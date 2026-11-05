/*
  Build step for Sarath English Medium School website.
  No dependencies. Copies the site into ./dist and turns relative SEO links into
  full web addresses (canonical, social preview image, Google structured data),
  then writes sitemap.xml and robots.txt.

  The site address is detected automatically:
    Netlify  -> process.env.URL
    Vercel   -> process.env.VERCEL_PROJECT_PRODUCTION_URL
    GitHub   -> process.env.SITE_URL (set by .github/workflows/pages.yml)
  You can also force it:  SITE_URL=https://www.example.com node build.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'dist');
const SKIP = new Set(['dist', 'node_modules', '.git', '.github', 'build.js', 'netlify.toml', 'vercel.json', 'README.md', '.gitignore', 'package.json']);

function siteUrl() {
  let u = process.env.SITE_URL || process.env.URL || '';
  if (!u && process.env.VERCEL_PROJECT_PRODUCTION_URL) u = 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL;
  return u.trim().replace(/\/+$/, '');
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const name of fs.readdirSync(src)) {
    if (src === ROOT && SKIP.has(name)) continue;
    const s = path.join(src, name), d = path.join(dst, name);
    if (fs.statSync(s).isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

const U = siteUrl();
fs.rmSync(OUT, { recursive: true, force: true });
copyDir(ROOT, OUT);

if (U) {
  const file = path.join(OUT, 'index.html');
  let h = fs.readFileSync(file, 'utf8');
  const abs = (p) => U + '/' + p.replace(/^\.\//, '');
  // Social preview + canonical
  h = h.replace(/(<meta (?:property="og:image"|name="twitter:image") content=")([^"]+)(")/g, (m, a, p, b) => a + abs(p) + b);
  h = h.replace('<meta property="og:type"', `<link rel="canonical" href="${U}/">\n<meta property="og:url" content="${U}/">\n<meta property="og:type"`);
  // Structured data: make every relative url absolute
  h = h.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/, (m, json) => {
    const data = JSON.parse(json);
    const walk = (o) => {
      if (Array.isArray(o)) return o.map(walk);
      if (o && typeof o === 'object') {
        for (const k of Object.keys(o)) {
          const v = o[k];
          if (typeof v === 'string' && ['@id', 'url', 'logo', 'thumbnailUrl', 'contentUrl'].includes(k) && !/^https?:/.test(v)) o[k] = abs(v);
          else if (k === 'image') o[k] = (Array.isArray(v) ? v : [v]).map((x) => (/^https?:/.test(x) ? x : abs(x)));
          else o[k] = walk(v);
        }
      }
      return o;
    };
    return '<script type="application/ld+json">\n' + JSON.stringify(walk(data), null, 1) + '\n</script>';
  });
  fs.writeFileSync(file, h);

  // sitemap.xml with images and videos
  const today = new Date().toISOString().slice(0, 10);
  const imgs = [...new Set([...h.matchAll(/assets\/img\/[\w-]+\.webp/g)].map((m) => m[0]))];
  const js = fs.readFileSync(path.join(OUT, 'assets/js/main.js'), 'utf8');
  // The pattern also matches the sections list (['home','about',...]), so keep only real files.
  for (const m of js.matchAll(/\['([\w-]+)','(\w+)','/g)) {
    const img = `assets/img/${m[1]}.webp`;
    if (fs.existsSync(path.join(OUT, img))) imgs.push(img);
  }
  const vids = [...h.matchAll(/data-video="(assets\/video\/([\w-]+)\.mp4)" data-cap="([^"]+)"/g)];
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const seenV = new Set();
  const videoXml = vids.filter((v) => !seenV.has(v[1]) && seenV.add(v[1])).map((v) => `
    <video:video>
      <video:thumbnail_loc>${abs(`assets/video/${v[2]}.jpg`)}</video:thumbnail_loc>
      <video:title>${esc(v[3])}</video:title>
      <video:description>${esc(v[3])} at Sarath English Medium School, Pedagantyada, Visakhapatnam</video:description>
      <video:content_loc>${abs(v[1])}</video:content_loc>
    </video:video>`).join('');
  const imageXml = [...new Set(imgs)].map((i) => `
    <image:image><image:loc>${abs(i)}</image:loc></image:image>`).join('');
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${U}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>${imageXml}${videoXml}
  </url>
</urlset>
`);
  fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${U}/sitemap.xml\n`);
  console.log('Built dist/ for ' + U);
} else {
  console.log('Built dist/ (no site address found: SEO links stay relative; set SITE_URL to make them absolute)');
}
