(function(){
  var d=document,b=d.body;
  // naglowek i pasek kontaktu po przewinieciu
  var top=d.querySelector('.top'),mbar=d.querySelector('.mbar'),tik=false;
  function stan(){tik=false;var y=window.scrollY;if(top)top.classList.toggle('on',y>40);if(mbar)mbar.classList.toggle('on',y>window.innerHeight*.6);}
  window.addEventListener('scroll',function(){if(!tik){tik=true;requestAnimationFrame(stan);}},{passive:true});
  requestAnimationFrame(stan);
  // menu telefonu
  var mb=d.querySelector('.menu-b');
  function menu(o){b.classList.toggle('menu-o',o);if(mb)mb.setAttribute('aria-expanded',o?'true':'false');b.style.overflow=o?'hidden':'';}
  if(mb)mb.addEventListener('click',function(){menu(!b.classList.contains('menu-o'));});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&b.classList.contains('menu-o'))menu(false);});

  // przeciaganie mysza (palcem przewija przegladarka)
  function ciagnij(t,krok,po){
    var x0=0,s0=0,dr=false,ruch=0;
    t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;dr=true;ruch=0;x0=e.clientX;s0=t.scrollLeft;t.classList.add('drag');});
    window.addEventListener('pointermove',function(e){if(!dr)return;var dx=e.clientX-x0;ruch=Math.max(ruch,Math.abs(dx));t.scrollLeft=s0-dx;});
    window.addEventListener('pointerup',function(){if(!dr)return;dr=false;t.classList.remove('drag');var w=krok(),i=Math.round(t.scrollLeft/w);if(ruch>40){i=t.scrollLeft>s0?Math.ceil(s0/w+.15):Math.floor(s0/w-.15);}t.scrollTo({left:Math.max(0,i)*w,behavior:'smooth'});});
    t.addEventListener('click',function(e){if(ruch>6){e.preventDefault();e.stopPropagation();ruch=0;}},true);
  }

  // galerie w kartach
  d.querySelectorAll('[data-gal]').forEach(function(g){
    var t=g.querySelector('.gal-t'),n=t.children.length,c=g.querySelector('.gal-c');
    if(n<2){g.querySelectorAll('button').forEach(function(x){x.remove();});if(c)c.remove();}
    function ile(){return Math.round(t.scrollLeft/t.clientWidth);}
    function idz(i){if(i>=n)i=0;if(i<0)i=n-1;t.scrollTo({left:i*t.clientWidth,behavior:'smooth'});}
    var p=g.querySelector('.gp'),nx=g.querySelector('.gn');
    if(p)p.addEventListener('click',function(){idz(ile()-1);});
    if(nx)nx.addEventListener('click',function(){idz(ile()+1);});
    var rt=false;
    t.addEventListener('scroll',function(){if(!rt){rt=true;requestAnimationFrame(function(){rt=false;if(c)c.textContent=(ile()+1)+' / '+n;});}},{passive:true});
    t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){e.preventDefault();idz(ile()+1);}if(e.key==='ArrowLeft'){e.preventDefault();idz(ile()-1);}});
    ciagnij(t,function(){return t.clientWidth;});
    t.addEventListener('click',function(e){var f=e.target.closest('figure');if(f&&lb)otworz(t,[].indexOf.call(t.children,f));});
  });
  // paski realizacji ze strzalkami
  d.querySelectorAll('.pasek').forEach(function(s){
    function krok(){var f=s.firstElementChild;return f?f.getBoundingClientRect().width+14:300;}
    ciagnij(s,krok);
    var sek=s.parentNode;sek.querySelectorAll('.strz button').forEach(function(x){x.addEventListener('click',function(){s.scrollBy({left:krok()*(+x.getAttribute('data-s')),behavior:'smooth'});});});
  });
  // powiekszenie z siatek, paskow i pojedynczych zdjec
  d.querySelectorAll('[data-lb]').forEach(function(g){
    g.addEventListener('click',function(e){var im=e.target.closest('img');if(!im||!lb)return;var imgs=[].slice.call(g.querySelectorAll('img'));otworz(g,imgs.indexOf(im));});
  });

  var lb=d.getElementById('lb'),lt,lc,ostatni;
  function otworz(t,i){
    ostatni=d.activeElement;
    lt=lb.querySelector('.lb-t');lc=lb.querySelector('.lb-c');lt.innerHTML='';
    [].forEach.call(t.querySelectorAll('img'),function(im){var f=d.createElement('figure'),m=d.createElement('img'),c=d.createElement('figcaption');m.src=im.getAttribute('data-full');m.alt=im.alt;m.decoding='async';c.textContent=im.alt;f.appendChild(m);f.appendChild(c);lt.appendChild(f);});
    lb.hidden=false;b.style.overflow='hidden';
    requestAnimationFrame(function(){lt.scrollLeft=i*lt.clientWidth;licz();lb.querySelector('.lx').focus();});
  }
  function licz(){if(lc&&lt)lc.textContent=(Math.round(lt.scrollLeft/lt.clientWidth)+1)+' / '+lt.children.length;}
  function zamknij(){lb.hidden=true;b.style.overflow='';if(ostatni)ostatni.focus();}
  if(lb){
    lb.querySelector('.lx').addEventListener('click',zamknij);
    lb.querySelector('.lp').addEventListener('click',function(){lt.scrollBy({left:-lt.clientWidth,behavior:'smooth'});});
    lb.querySelector('.ln').addEventListener('click',function(){lt.scrollBy({left:lt.clientWidth,behavior:'smooth'});});
    lb.querySelector('.lb-t').addEventListener('scroll',function(){requestAnimationFrame(licz);},{passive:true});
    lb.addEventListener('click',function(e){if(e.target.tagName==='FIGURE')zamknij();});
    d.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')zamknij();if(e.key==='ArrowRight')lt.scrollBy({left:lt.clientWidth,behavior:'smooth'});if(e.key==='ArrowLeft')lt.scrollBy({left:-lt.clientWidth,behavior:'smooth'});});
  }

  // formularz (wersja testowa: bez wysylki)
  var f=d.getElementById('form');
  if(f){
    var info=d.getElementById('form-info');
    var tm=new URLSearchParams(location.search).get('temat');
    if(tm){var s=f.querySelector('select[name=temat]');if(s){[].forEach.call(s.options,function(o){if(o.value===tm)s.value=tm;});}}
    f.addEventListener('submit',function(e){e.preventDefault();
      if(!f.checkValidity()){info.className='bl';info.textContent='Uzupełnij pola oznaczone gwiazdką i zaznacz zgodę na kontakt.';var z=f.querySelector(':invalid');if(z)z.focus();return;}
      info.className='ok';info.textContent='To wersja testowa strony. Formularz zacznie wysyłać wiadomości po uruchomieniu na luxfer.net.pl, do tego czasu zapraszamy pod numer 501 338 623.';});
  }

  // zgody cookies, mapa i modul Facebooka
  var KL='lx-zgoda',c=d.getElementById('cookies');
  function zgoda(){try{return localStorage.getItem(KL);}catch(e){return null;}}
  function zapisz(v){try{localStorage.setItem(KL,v);}catch(e){}if(c)c.hidden=true;if(v!=='nie')zewn(true);}
  if(c){
    c.querySelector('[data-c=tak]').addEventListener('click',function(){zapisz('tak');});
    c.querySelector('[data-c=nie]').addEventListener('click',function(){zapisz('nie');});
    var ust=c.querySelector('[data-c=ust]'),pan=c.querySelector('.ust'),zap=c.querySelector('[data-c=zap]');
    ust.addEventListener('click',function(){pan.hidden=false;ust.hidden=true;zap.hidden=false;});
    zap.addEventListener('click',function(){zapisz(c.querySelector('#zg-zew').checked?'tak':'nie');});
  }
  d.querySelectorAll('[data-cookies]').forEach(function(x){x.addEventListener('click',function(){if(c)c.hidden=false;});});
  function wstaw(m){if(m.querySelector('iframe'))return;var i=d.createElement('iframe'),u=m.getAttribute('data-src');if(m.classList.contains('fb')){var sz=Math.max(180,Math.min(500,Math.floor(m.clientWidth)));u=u.replace('width=500','width='+sz).replace('height=600','height='+Math.floor(m.clientHeight));}i.src=u;i.title=m.getAttribute('data-t');i.loading='lazy';i.referrerPolicy='no-referrer-when-downgrade';if(m.classList.contains('fb'))i.setAttribute('scrolling','no');m.appendChild(i);var z=m.querySelector('.mapa-z,.fb-z');if(z)z.remove();}
  function zewn(teraz){
    d.querySelectorAll('[data-src]').forEach(function(m){
      var bt=m.querySelector('button');if(bt)bt.onclick=function(){wstaw(m);};
      if(zgoda()!=='tak'&&!teraz)return;
      if(!('IntersectionObserver' in window)){wstaw(m);return;}
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){wstaw(m);io.disconnect();}});},{rootMargin:'400px'});io.observe(m);
    });
  }
  zewn(false);
  var r=d.getElementById('rok');if(r)r.textContent=new Date().getFullYear();
})();
