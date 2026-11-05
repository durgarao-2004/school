# Sarath English Medium School website

Website for **Sarath English Medium School (Sarath Public School)**,
BJR Nagar Colony, Pedagantyada, Gajuwaka, Visakhapatnam, Andhra Pradesh 530044.

Plain HTML, CSS and JavaScript. Nothing to install. All photos and videos are included and already compressed.

## Folder structure

```
index.html              The whole home page
404.html                "Page not found" page
manifest.webmanifest    App icon / name for phones
robots.txt              Lets Google crawl everything
build.js                Optional build step (adds full web address for SEO, makes sitemap.xml)
netlify.toml            Netlify settings (runs build.js automatically)
vercel.json             Vercel settings (runs build.js automatically)
.github/workflows/      Optional GitHub Pages deploy
assets/css/style.css    Styles
assets/js/main.js       Loader, video popup, slider, gallery, enquiry form
assets/img/             Photos (WebP) + logo
assets/video/           15 videos (MP4) + poster frames (JPG)
assets/icons/           Favicon, app icons, social share image
```

## 1. Put it on GitHub

In VS Code open this folder, then in the terminal:

```
git init
git add .
git commit -m "Sarath school website"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## 2. Go live (pick one)

**Netlify (recommended)**: Add new site > Import an existing project > GitHub > pick the repo > Deploy.
Everything is pre-set in `netlify.toml`; leave the settings as they are.

**Vercel**: Add New > Project > import the repo > Deploy. Pre-set in `vercel.json`.

**GitHub Pages**: repo Settings > Pages > Source: **GitHub Actions**. Then Actions tab >
"Deploy to GitHub Pages" > Run workflow.

On all three, `build.js` runs automatically and fills in your real web address everywhere
Google and WhatsApp need it (canonical link, share image, structured data, sitemap). If you
later add a custom domain such as `www.sarathschool.in`, just redeploy and it updates itself.

## 3. SEO: what is already done

- Page title and description target **"Sarath English Medium School"** and **"Sarath Public School"**
  plus Pedagantyada, Gajuwaka, BJR Nagar Colony and Visakhapatnam.
- Google structured data (schema.org): School with both names, address, map position, phone,
  opening hours (Mon–Sat 8:30–5:00), Instagram, chairman; FAQ; all 14 videos.
- One clear H1, descriptive alt text on every image, FAQ including "Is Sarath Public School the
  same as Sarath English Medium School?".
- `sitemap.xml` with every image and video, `robots.txt`, canonical URL, social preview tags,
  local geo tags, fast WebP images, phone-sized hero images.
- Lighthouse (Google's audit): **SEO 100, Accessibility 100**, Best practices 96, Performance 96 desktop.

## 4. SEO: two things only the school can do (10 minutes, needs your Google login)

These use your Google account, so nobody else can do them for you. They make Google show the
site for "Sarath English Medium School" / "Sarath Public School" much faster.

1. **Google Search Console**: go to search.google.com/search-console > Add property > URL prefix >
   paste your site address > verify with the "HTML tag" option (paste the tag into `index.html`
   right under `<meta charset="utf-8">`, push, then click Verify). Then open **Sitemaps** and
   submit `sitemap.xml`. Use **URL inspection > Request indexing** on the home page.
2. **Google Business Profile**: go to business.google.com, search for the school, claim it
   (or create it as "Sarath English Medium School"), add the website address, phone,
   address and photos. This is what makes the school show on Google Maps and the right-side
   panel in search results.

Also put the website link in the Instagram bio (@sarathschool) and the Justdial listing.

## Editing common things

| What | Where |
|---|---|
| Phone / WhatsApp number | Search for `919441368036` and `94413 68036` in `index.html` and `assets/js/main.js` |
| Address | Search for `BJR Nagar Colony` in `index.html` |
| News ticker | `index.html`, the `ticker-track` block (each item appears twice so the loop is seamless) |
| Hero slides / words | `index.html` `slides` block; `assets/js/main.js` `copy` list |
| Popup video and text | `index.html`, the `popup` block |
| Videos | `index.html`, the `videos` and `voices` sections (copy one `vcard` line, change the file name) |
| Gallery photos | `assets/js/main.js`, the `G` list (`[file name, category, caption]`) |
| Zero hour timetable | `index.html`, the `zero-hour` section |
| FAQ | `index.html` FAQ block **and** the matching `FAQPage` entry in the `ld+json` script |

New photo: save into `assets/img/` (WebP or JPG, about 1600 px wide, under 300 KB).
New video: MP4 (H.264), under about 6 MB, plus a JPG poster with the same name.

## Notes

- The video popup opens every time the site is opened. It plays muted (browsers block sound
  until the visitor taps); **Sound on** turns sound on.
- The enquiry form prepares a WhatsApp message to the school office; the parent taps send.
  No server or database is needed.
- Preview locally: VS Code > install **Live Server** > right-click `index.html` > Open with Live Server.
