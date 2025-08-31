// === Destello: sigue el cursor y recorre en automático ===
(() => {
  const root = document.documentElement;
  let auto = { t: 0, speed: 0.0012 }; // barrido automático
  let mouse = { x: 0.5, y: 0.5, active: false };

  const update = () => {
    auto.t += auto.speed;
    const ax = (Math.sin(auto.t) * 0.4) + 0.5;
    const ay = (Math.cos(auto.t * 0.85) * 0.3) + 0.5;

    const fx = mouse.active ? mouse.x : ax;
    const fy = mouse.active ? mouse.y : ay;

    root.style.setProperty('--flare-x', (fx * 100).toFixed(2) + '%');
    root.style.setProperty('--flare-y', (fy * 100).toFixed(2) + '%');
    requestAnimationFrame(update);
  };
  update();

  window.addEventListener('mousemove', (e) => {
    const w = window.innerWidth, h = window.innerHeight;
    mouse.x = e.clientX / w; mouse.y = e.clientY / h; mouse.active = true;
    clearTimeout(mouse._to);
    mouse._to = setTimeout(() => mouse.active = false, 1200);
  }, { passive: true });
})();

// === Revelado en scroll ===
(() => {
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) {
        e.target.classList.add('show'); io.unobserve(e.target);
      }
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    // fallback
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('show'));
  }
})();

// === Formulario a WhatsApp ===
function sendWapp(e){
  e.preventDefault();
  const f = e.target;
  const nombre = encodeURIComponent(f.nombre.value.trim());
  const tel = (f.telefono.value || '').replace(/\D+/g,'');
  const msg = encodeURIComponent(f.mensaje.value.trim());
  const texto = `Hola FigiKhan, soy ${nombre}. Quiero la Landing Page Express. ${msg}`;
  const url = `https://wa.me/${tel}?text=${texto}`;
  window.open(url, '_blank', 'noopener');
  return false;
}

// === Abrir/Cerrar formulario ===
(() => {
  const openBtn = document.querySelector('[data-open-form]');
  const closeBtn = document.querySelector('[data-close-form]');
  const form = document.querySelector('.contacto .form');

  if (openBtn && form) openBtn.addEventListener('click', () => {
    form.classList.remove('hidden'); form.setAttribute('aria-hidden', 'false');
  });
  if (closeBtn && form) closeBtn.addEventListener('click', () => {
    form.classList.add('hidden'); form.setAttribute('aria-hidden', 'true');
  });
})();

// === Micro-animaciones de tarjetas ===
(() => {
  const cards = document.querySelectorAll('.card.tiny');
  cards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty('--mx', (x / r.width).toFixed(2));
      card.style.setProperty('--my', (y / r.height).toFixed(2));
      card.style.transform = `translateY(-4px) rotateX(${(0.5 - (y/r.height))*3}deg) rotateY(${((x/r.width)-0.5)*3}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
})();
