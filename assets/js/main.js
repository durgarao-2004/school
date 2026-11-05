(function(){
  var d=document; d.documentElement.classList.add('js');
  var $=function(s,c){return (c||d).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
  var store={get:function(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}};
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* gallery data */
  var G=[
    ['cultural-day-stage','celebrations','Cultural day on stage'],['classroom-cheer','classroom','Classroom cheer'],['bharatanatyam-science-expo','stage','Bharatanatyam at Science Expo 2026'],
    ['independence-day-salute','celebrations','Independence Day salute'],['art-competition','classroom','Art competition'],
    ['republic-day-costumes','celebrations','Republic Day colours'],['media-club-speaking','stage','Speaking on stage'],['classroom-reading','classroom','Reading together'],
    ['fancy-dress-day','celebrations','Fancy dress day'],['science-expo-stage','stage','Science Expo 2026'],['science-exhibits','classroom','Science exhibits'],
    ['school-building','campus','Our school building'],['assembly-presenters','stage','Assembly presenters'],['freedom-fighters-costumes','celebrations','Freedom fighters in costume'],
    ['students-writing','classroom','Focused at work'],['costume-parade','celebrations','Costume parade'],['drawing-session','classroom','Drawing session'],
    ['young-performers','stage','Young performers'],['awards-day','classroom','Awards and appreciation'],['colouring-time','classroom','Colouring time'],
    ['independence-day-assembly','celebrations','Independence Day assembly'],['happy-students','classroom','Our happy students'],['awareness-performance','stage','Awareness performance']
  ];
  var mas=$('#masonry');
  G.forEach(function(g){var b=d.createElement('button');b.type='button';b.dataset.c=g[1];b.dataset.cap=g[2];b.innerHTML='<img src="assets/img/'+g[0]+'.webp" alt="'+g[2]+'" loading="lazy">';mas.appendChild(b)});
  $$('.gtab').forEach(function(t){t.addEventListener('click',function(){
    $$('.gtab').forEach(function(x){x.setAttribute('aria-pressed',String(x===t))});
    $$('button',mas).forEach(function(b){b.hidden=!(t.dataset.f==='all'||b.dataset.c===t.dataset.f)});
  })});

  /* modals */
  var lastFocus=null;
  function openM(id){lastFocus=d.activeElement;$$('.modal').forEach(function(m){if(!m.hidden&&m.id!==id)closeM(m.id)});var m=$('#'+id);m.hidden=false;d.body.classList.add('locked');var f=$('.mclose',m);f&&f.focus()}
  function closeM(id){var m=$('#'+id);if(m.hidden)return;m.hidden=true;$$('video',m).forEach(function(v){v.pause()});if(id==='lightbox')$('#lbMedia').innerHTML='';if($$('.modal').every(function(x){return x.hidden}))d.body.classList.remove('locked');lastFocus&&lastFocus.focus&&lastFocus.focus()}
  $$('.modal').forEach(function(m){m.addEventListener('click',function(e){if(e.target===m||e.target.closest('[data-close]'))closeM(m.id)})});
  d.addEventListener('keydown',function(e){if(e.key==='Escape')$$('.modal').forEach(function(m){if(!m.hidden)closeM(m.id)})});
  d.addEventListener('click',function(e){var t=e.target.closest('[data-enquire]');if(t){e.preventDefault();openM('enquiry')}});

  /* loader with real progress */
  var loader=$('#loader'),pct=$('#pct'),bar=$('#barI');
  var crit=['assets/img/logo.webp',(window.innerWidth*(window.devicePixelRatio||1)<=900?'assets/img/classroom-cheer-900.webp':'assets/img/classroom-cheer.webp')];
  var done=0,shown=0,target=0,finished=false;
  function tick(){ if(shown<target){shown=Math.min(target,shown+4);pct.textContent=shown+'%';bar.style.width=shown+'%'}
    if(shown>=100){finish();return} requestAnimationFrame(tick)}
  function finish(){ if(finished)return; finished=true; loader.classList.add('done'); setTimeout(function(){loader.hidden=true;afterLoad()},450)}
  crit.forEach(function(src){var i=new Image();i.onload=i.onerror=function(){done++;target=Math.round(done/crit.length*100)};i.src=src});
  target=8; requestAnimationFrame(tick);
  setTimeout(function(){target=100},4200);
  if(reduce){target=100}

  function afterLoad(){
    startSlider();
    setTimeout(function(){openM('popup');var v=$('#popVid');var p=v.play();p&&p.catch&&p.catch(function(){})},500);
  }
  $('#snd').addEventListener('click',function(){var v=$('#popVid');v.muted=!v.muted;this.textContent=v.muted?'Sound on':'Sound off';v.play().catch(function(){})});

  /* hero slider */
  var slides=$$('.slide'),dots=$('#dots'),idx=0,timer=null;
  var copy=[
    ['Sarath stands for','Knowledge','Nurturing minds, building futures. Skill-based learning in Pedagantyada since 2000.'],
    ['Sarath stands for','Creativity','Dance, music, art and monthly stage events where every child finds their passion.'],
    ['Sarath stands for','Discipline','Strong values and character, from morning assembly to the national flag.'],
    ['Sarath stands for','Success','26 years of academic and administrative excellence, celebrated on every stage.']
  ];
  slides.forEach(function(s,i){var b=d.createElement('button');b.type='button';b.setAttribute('aria-label','Slide '+(i+1));b.setAttribute('aria-current',i===0?'true':'false');b.addEventListener('click',function(){go(i);restart()});dots.appendChild(b)});
  function go(n){idx=(n+slides.length)%slides.length;slides.forEach(function(s,i){s.classList.toggle('on',i===idx)});$$('button',dots).forEach(function(b,i){b.setAttribute('aria-current',String(i===idx))});
    var t=$('#hbText');t.classList.add('swap');setTimeout(function(){$('#hbH').textContent=copy[idx][1];$('#hbP').textContent=copy[idx][2];t.classList.remove('swap')},300)}
  function restart(){clearInterval(timer);if(!reduce)timer=setInterval(function(){go(idx+1)},5500)}
  function startSlider(){restart()}
  $('#prev').addEventListener('click',function(){go(idx-1);restart()});
  $('#next').addEventListener('click',function(){go(idx+1);restart()});

  /* header: burger, active link, totop */
  var nav=$('#nav'),burger=$('#burger');
  function setNav(o){nav.dataset.open=String(o);burger.setAttribute('aria-expanded',String(o))}
  burger.addEventListener('click',function(){setNav(nav.dataset.open!=='true')});
  nav.addEventListener('click',function(e){if(e.target.closest('a')&&window.matchMedia('(max-width:1060px)').matches)setNav(false)});
  var totop=$('#totop');totop.addEventListener('click',function(){window.scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
  var secs=['home','about','programmes','admissions','campus','gallery','contact'].map(function(id){return d.getElementById(id)});
  window.addEventListener('scroll',function(){totop.classList.toggle('show',window.scrollY>600)},{passive:true});
  if('IntersectionObserver' in window){
    var navIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id=e.target.id;$$('a',nav).forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+id)})}})},{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(s){s&&navIO.observe(s)});
    /* reveal: content is visible by default; only elements below the fold get the pre-state */
    var rv=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');rv.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    $$('.reveal').forEach(function(el){if(el.getBoundingClientRect().top>window.innerHeight){el.classList.add('pre');rv.observe(el)}});
    /* counters */
    var cIO=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cIO.unobserve(e.target);var el=e.target,to=+el.dataset.count,suf=el.dataset.suffix||'',from=to>1000?to-60:0,t0=null;
      if(reduce)return;function step(t){t0=t0||t;var p=Math.min(1,(t-t0)/1400);el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step)})},{threshold:.6});
    $$('[data-count]').forEach(function(el){cIO.observe(el)});
    /* reels play muted while visible */
    var vIO=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting&&!reduce){v.preload='auto';var p=v.play();p&&p.catch&&p.catch(function(){})}else v.pause()})},{threshold:.5});
    $$('.vcard video, .fcard video').forEach(function(v){vIO.observe(v)});
  }

  /* lightbox for photos and videos */
  function showLB(html,cap){$('#lbMedia').innerHTML=html;$('#lbCap').textContent=cap;openM('lightbox');var v=$('#lbMedia video');if(v){var p=v.play();p&&p.catch&&p.catch(function(){})}}
  mas.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var im=$('img',b);showLB('<img src="'+im.getAttribute('src')+'" alt="'+im.alt+'">',b.dataset.cap)});
  $$('.vcard').forEach(function(c){c.addEventListener('click',function(){showLB('<video src="'+c.dataset.video+'" controls playsinline></video>',c.dataset.cap)})});

  /* zero hour: highlight today's activity */
  var dow=new Date().getDay();
  $$('.day').forEach(function(c){if(+c.dataset.day===dow){c.classList.add('today');var t=d.createElement('span');t.className='tag';t.textContent='Today';c.appendChild(t)}});

  /* copy phone and email */
  var toast=$('#toast'),tt;function say(m){toast.textContent=m;toast.hidden=false;clearTimeout(tt);tt=setTimeout(function(){toast.hidden=true},2200)}
  function copyBtn(btn,textEl,value,label){$(btn).addEventListener('click',function(){function sel(){var r=d.createRange();r.selectNodeContents($(textEl));var s=getSelection();s.removeAllRanges();s.addRange(r);say(label+' selected')}
    try{navigator.clipboard.writeText(value).then(function(){say(label+' copied')},sel)}catch(e){sel()}})}
  copyBtn('#copyPhone','#phoneText','+91 94413 68036','Number');
  copyBtn('#copyEmail','#emailText','sarathschool2001@gmail.com','Email');

  /* enquiry -> WhatsApp */
  var f=$('#enqForm');
  f.addEventListener('submit',function(e){e.preventDefault();
    var parent=f.parent.value.trim(),mob=f.mobile.value.replace(/\D/g,'');
    if(!parent||mob.length<10){$('#enqErr').hidden=false;return}$('#enqErr').hidden=true;
    var txt='Hello Sarath English Medium School,\nAdmission enquiry for '+f.year.value+'\nClass: '+f.grade.value+(f.child.value.trim()?'\nChild: '+f.child.value.trim()+' ('+f.gender.value+')':'')+'\nParent: '+parent+'\nMobile: '+f.mobile.value.trim()+(f.area.value.trim()?'\nArea: '+f.area.value.trim():'');
    $('#readyText').textContent=txt;$('#waSend').href='https://wa.me/919441368036?text='+encodeURIComponent(txt);$('#ready').hidden=false;$('#waSend').focus()});
})();
