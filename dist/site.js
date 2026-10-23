(function(){
  var hdr=document.getElementById('hdr');
  var burger=hdr.querySelector('.burger');
  burger.addEventListener('click',function(){var o=hdr.classList.toggle('open');burger.setAttribute('aria-expanded',o);});
  hdr.querySelectorAll('.dd').forEach(function(dd){var b=dd.querySelector('button');b.addEventListener('click',function(e){e.stopPropagation();var open=dd.classList.toggle('open');hdr.querySelectorAll('.dd').forEach(function(o){if(o!==dd){o.classList.remove('open');o.querySelector('button').setAttribute('aria-expanded','false');}});b.setAttribute('aria-expanded',open);});});
  document.addEventListener('click',function(){hdr.querySelectorAll('.dd.open').forEach(function(o){o.classList.remove('open');o.querySelector('button').setAttribute('aria-expanded','false');});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){hdr.classList.remove('open');hdr.querySelectorAll('.dd.open').forEach(function(o){o.classList.remove('open');});}});

  // Suivi des clics (Umami)
  document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a||!window.umami)return;var h=a.getAttribute('href')||'';var d={page:location.pathname,text:(a.textContent||'').trim().slice(0,60)};
    if(h.indexOf('tel:')===0)umami.track('clic_telephone',d);else if(h.indexOf('mailto:')===0)umami.track('clic_courriel',d);else if(h.indexOf('/demande-de-soumission')===0)umami.track('clic_soumission',d);},true);

  // Formulaire
  var f=document.getElementById('quote');if(!f)return;
  var sel=f.querySelector('[name=Service]');
  var q=new URLSearchParams(location.search).get('service');if(q){for(var i=0;i<sel.options.length;i++)if(sel.options[i].value===q)sel.value=q;}
  function sync(){var m=sel.value==='Manutention';f.querySelectorAll('[data-when=livraison]').forEach(function(el){el.hidden=m;});f.querySelectorAll('[data-when=manutention]').forEach(function(el){el.hidden=!m;});}
  sel.addEventListener('change',sync);sync();
  var msg=f.querySelector('.form-msg');
  f.addEventListener('submit',function(e){e.preventDefault();
    var req=['Name','Email','Phone','Service','Demande'],bad=req.filter(function(n){return !f.elements[n].value.trim();});
    if(bad.length){msg.className='form-msg err';msg.textContent='Merci de remplir tous les champs obligatoires.';f.elements[bad[0]].focus();return;}
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.elements.Email.value)){msg.className='form-msg err';msg.textContent='Vérifiez votre adresse courriel.';f.elements.Email.focus();return;}
    var btn=f.querySelector('button[type=submit]');btn.disabled=true;msg.className='form-msg';msg.textContent='Envoi en cours…';
    var fd=new FormData(f);var data={};fd.forEach(function(v,k){data[k]=v;});
    if(data.Service==='Manutention'){data.from=data.from_m||'';data.to='';}delete data.from_m;
    data.page=location.pathname;
    fetch('/api/demande',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)}).then(function(r){return r.ok?r.json():Promise.reject(r);}).then(function(){
      msg.className='form-msg ok';msg.textContent='Merci ! Votre demande est envoyée. Nous vous répondons rapidement avec un prix et une date.';f.reset();sync();if(window.umami)umami.track('demande_envoyee',{service:data.Service});
    }).catch(function(){msg.className='form-msg err';msg.textContent='Désolé, l’envoi a échoué. Appelez-nous au 514-424-7936 ou réessayez dans un instant.';}).finally(function(){btn.disabled=false;});
  });
})();
