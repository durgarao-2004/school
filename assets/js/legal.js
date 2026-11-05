/* Mobile menu for the Privacy and Terms pages. They don't load main.js, which needs the home page's sections. */
(function(){
  var nav=document.getElementById('nav'),burger=document.getElementById('burger');
  function setNav(o){nav.dataset.open=String(o);burger.setAttribute('aria-expanded',String(o))}
  burger.addEventListener('click',function(){setNav(nav.dataset.open!=='true')});
  nav.addEventListener('click',function(e){if(e.target.closest('a'))setNav(false)});
})();
