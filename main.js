// ====== CONFIGURA TU NÚMERO AQUÍ (formato internacional, sin +) ======
const PHONE = '54911XXXXXXXX'; // ← Reemplazá por tu número real (ej: 5491122334455)

// ====== Utilidades
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const encode = s => encodeURIComponent(s);

// ====== Precios aleatorios (ARS)
function randomPrice(min=4500, max=12000){
  const n = Math.floor(Math.random() * (max - min + 1)) + min;
  // Formato ARS con separador de miles
  return n.toLocaleString('es-AR', { style:'currency', currency:'ARS', maximumFractionDigits:0 });
}

// ====== Inicialización de precios y enlaces
function initMenu(){
  $$('.card.tiny').forEach(card => {
    // set precio aleatorio
    const priceEl = $('[data-price]', card);
    if (priceEl) priceEl.textContent = randomPrice();

    // click "Agregar y pedir"
    $('[data-add]', card)?.addEventListener('click', () => {
      const name = card.getAttribute('data-item') || 'Ítem';
      const price = priceEl?.textContent || '';
      addItemToMessage(`${name} — ${price}`);
      openWhatsApp(); // abre directamente con el pedido
    });

    // también permitir click en la imagen para agregar al pedido (sin abrir wapp)
    $('.food', card)?.addEventListener('click', () => {
      const name = card.getAttribute('data-item') || 'Ítem';
      const price = priceEl?.textContent || '';
      addItemToMessage(`${name} — ${price}`);
    });
  });
}

// ====== Mensaje/pedido (se va acumulando)
function addItemToMessage(text){
  const area = $('textarea[name="mensaje"]');
  if (!area) return;
  area.value = (area.value ? area.value + '\n' : '') + `• ${text}`;
}

// ====== Arma el enlace a WhatsApp con el pedido actual
function buildWappURL(){
  const area = $('textarea[name="mensaje"]');
  const pedido = encode(area?.value?.trim() || 'Quiero hacer un pedido.');
  const url = `https://wa.me/${PHONE}?text=${pedido}`;
  return url;
}

// ====== Botones generales a WhatsApp
function initCTAs(){
  $('#cta-wapp-hero')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(buildWappURL(), '_blank', 'noopener');
  });
  $('#cta-wapp-contacto')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(buildWappURL(), '_blank', 'noopener');
  });
}

// ====== Form -> WhatsApp (permite usar otro número si el cliente lo completa)
function sendWapp(e){
  e.preventDefault();
  const f = e.target;
  const nombre = encode((f.nombre.value || '').trim());
  // Si el usuario escribe su número, priorizamos ese para iniciar chat
  const telUser = (f.telefono.value || '').replace(/\D+/g,'');
  const basePhone = telUser.length >= 8 ? telUser : PHONE;
  const msg = encode((f.mensaje.value || '').trim());
  const texto = `Hola Figikhan, soy ${nombre}. Quiero pedir:\n${msg}`;
  const url = `https://wa.me/${basePhone}?text=${texto}`;
  window.open(url, '_blank', 'noopener');
  return false;
}
window.sendWapp = sendWapp;

// ====== Ola en el texto
(function wave(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const el = document.querySelector('[data-wave]');
  if(!el) return;
  const txt = el.textContent;
  el.textContent = '';
  for(const ch of txt){
    const span = document.createElement('span');
    if(ch === ' '){ span.className = 'space'; span.innerHTML = '&nbsp;'; }
    else{ span.className = 'char'; span.textContent = ch; }
    el.appendChild(span);
  }
  if(reduce) return;
  let t = 0;
  const amp = 6, freq = 0.35, speed = 0.12;
  const chars = el.querySelectorAll('.char');
  (function anim(){
    t += speed;
    let i = 0;
    for(const c of chars){
      const y = Math.sin(t + i*freq) * amp;
      c.style.transform = `translateY(${y.toFixed(2)}px)`;
      i++;
    }
    requestAnimationFrame(anim);
  })();
})();

// ====== Reveal en scroll
(function reveal(){
  if(!('IntersectionObserver' in window)){ $$('.reveal').forEach(el=>el.classList.add('show')); return; }
  const io = new IntersectionObserver((entries)=>{
    for(const e of entries) if(e.isIntersecting){ e.target.classList.add('show'); io.unobserve(e.target); }
  }, { threshold: 0.15 });
  $$('.reveal').forEach(el=>io.observe(el));
})();

// ====== Init
document.addEventListener('DOMContentLoaded', () => {
  initMenu();
  initCTAs();
});
