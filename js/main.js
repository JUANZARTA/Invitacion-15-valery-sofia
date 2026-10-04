/* ============================================================
   CONFIGURACIÓN — cambiá solo este bloque, se actualiza todo
   ============================================================ */
const XV = {
  name:      'Valery Sofía',
  nameFirst: 'Valery',
  nameLast:  'Sofía',
  nameShort: 'Valery',
  phone:     '573148740710',
  hashtag:   '@rochymeneses_b',
  eventDate: new Date('2026-11-15T19:00:00'),
};

// Inyecta el nombre en todos los elementos marcados
document.title = `XV Años · ${XV.name}`;
document.querySelectorAll('[data-xv="name"]').forEach(el => el.textContent = XV.name);
document.querySelectorAll('[data-xv="name-first"]').forEach(el => el.textContent = XV.nameFirst);
document.querySelectorAll('[data-xv="name-last"]').forEach(el => el.textContent = XV.nameLast);
document.querySelectorAll('[data-xv="name-short"]').forEach(el => el.textContent = XV.nameShort);
document.querySelectorAll('[data-xv="hashtag"]').forEach(el => el.textContent = XV.hashtag);
const _waMsg = encodeURIComponent(`Hola! Confirmo mi asistencia a los XV Años de ${XV.nameShort} 🌸`);
document.querySelectorAll('[data-xv-wa]').forEach(el => {
  el.href = `https://wa.me/${XV.phone}?text=${_waMsg}`;
});

/* ============================================================
   MÚSICA
   Los navegadores bloquean autoplay con sonido sin interacción.
   Solución: arranca silenciado (siempre permitido), se activa
   con el primer gesto del usuario sin que lo note.
   ============================================================ */
const musicBtn = document.getElementById('music-btn');
const bgMusic  = document.getElementById('bg-music');

window.addEventListener('load', () => {
  if (!bgMusic) return;

  bgMusic.volume = 0.65;
  bgMusic.muted  = true;   // silenciado → el navegador lo permite siempre

  bgMusic.play().then(() => {
    musicBtn.classList.add('playing');

    // Al primer gesto del usuario, activa el sonido
    const unmute = () => {
      bgMusic.muted = false;
    };
    ['click', 'touchstart', 'scroll', 'keydown'].forEach(e =>
      document.addEventListener(e, unmute, { once: true, passive: true })
    );
  }).catch(() => {
    // Si incluso el muted falla, espera primer clic
    const startOnClick = () => {
      bgMusic.muted = false;
      bgMusic.play().then(() => musicBtn.classList.add('playing')).catch(() => {});
    };
    document.addEventListener('click', startOnClick, { once: true });
    document.addEventListener('touchstart', startOnClick, { once: true });
  });
});

/* ============================================================
   PETALS CANVAS
   ============================================================ */
(function () {
  const canvas = document.getElementById('petals-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#9C7FC9', '#B79FDA', '#D9C8EC', '#7E62A8', '#4B2E6B', '#D9A94A'];

  class Petal {
    constructor(randomY = false) { this.init(randomY); }
    init(randomY) {
      this.x      = Math.random() * canvas.width;
      this.y      = randomY ? Math.random() * canvas.height : -20;
      this.size   = Math.random() * 7 + 4;
      this.vy     = Math.random() * 1.2 + 0.5;
      this.vx     = (Math.random() - 0.5) * 0.8;
      this.angle  = Math.random() * Math.PI * 2;
      this.spin   = (Math.random() - 0.5) * 0.04;
      this.wobble = Math.random() * Math.PI * 2;
      this.wSpeed = Math.random() * 0.04 + 0.01;
      this.alpha  = Math.random() * 0.55 + 0.2;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.wobble += this.wSpeed;
      this.x += Math.sin(this.wobble) * 0.7 + this.vx;
      this.y += this.vy;
      this.angle += this.spin;
      if (this.y > canvas.height + 20 || this.x < -30 || this.x > canvas.width + 30) {
        this.init(false);
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  const petals = Array.from({ length: 40 }, () => new Petal(true));
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('nav-hamburger');
const drawer    = document.getElementById('nav-drawer');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  drawer.classList.toggle('open');
  document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
});

drawer.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   COUNTDOWN
   ============================================================ */
const EVENT_DATE = XV.eventDate;
const cdDays     = document.getElementById('cd-days');
const cdHours    = document.getElementById('cd-hours');
const cdMinutes  = document.getElementById('cd-minutes');
const cdSeconds  = document.getElementById('cd-seconds');

const crDays     = document.getElementById('cr-days');
const crHours    = document.getElementById('cr-hours');
const crMinutes  = document.getElementById('cr-minutes');
const crSeconds  = document.getElementById('cr-seconds');

function pad(n) { return String(n).padStart(2, '0'); }

function animateFlip(el, newVal) {
  if (el.textContent === newVal) return;
  el.classList.add('flip-out');
  setTimeout(() => {
    el.textContent = newVal;
    el.classList.remove('flip-out');
    el.classList.add('flip-in');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('flip-in')));
  }, 140);
}

function tick() {
  const diff = EVENT_DATE - Date.now();
  if (diff <= 0) {
    document.querySelector('.countdown-wrapper').innerHTML =
      '<p style="font-family:var(--ff-script);font-size:2rem;color:#fff;letter-spacing:.1em">¡Hoy es el gran día! ✨</p>';
    return;
  }
  const days    = pad(Math.floor(diff / 86400000));
  const hours   = pad(Math.floor((diff % 86400000) / 3600000));
  const minutes = pad(Math.floor((diff % 3600000)  / 60000));
  const seconds = pad(Math.floor((diff % 60000)    / 1000));

  animateFlip(cdDays,    days);
  animateFlip(cdHours,   hours);
  animateFlip(cdMinutes, minutes);
  animateFlip(cdSeconds, seconds);

  if (crDays)    crDays.textContent    = days;
  if (crHours)   crHours.textContent   = hours;
  if (crMinutes) crMinutes.textContent = minutes;
  if (crSeconds) crSeconds.textContent = seconds;
}
tick();
setInterval(tick, 1000);

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const GALLERY_SRCS = [
  'img/fotos/Img (1).jpeg',
  'img/fotos/Img (2).jpeg',
  'img/fotos/Img (3).jpeg',
  'img/fotos/Img (4).jpeg',
  'img/fotos/Img (5).jpeg',
  'img/fotos/img (6).jpeg',
  'img/fotos/img (7).jpeg',
];

let lbIndex    = 0;
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');

function openLightbox(idx) {
  lbIndex = ((idx % GALLERY_SRCS.length) + GALLERY_SRCS.length) % GALLERY_SRCS.length;
  lbImg.src = GALLERY_SRCS[lbIndex];
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});
document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => openLightbox(lbIndex - 1));
document.getElementById('lb-next').addEventListener('click', () => openLightbox(lbIndex + 1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  openLightbox(lbIndex - 1);
  if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
});

/* ============================================================
   GALLERY CAROUSEL — dots + flechas, sincronizados por scroll
   El tap/click en una foto sigue abriendo el lightbox (listener
   de arriba, sin tocar) — esto solo agrega navegación visual.
   ============================================================ */
(function () {
  const track    = document.querySelector('.gallery-track');
  const items    = document.querySelectorAll('.gallery-track .gallery-item');
  const dotsWrap = document.querySelector('.gallery-dots');
  const prevBtn  = document.querySelector('.gallery-arrow--prev');
  const nextBtn  = document.querySelector('.gallery-arrow--next');

  if (!track || !items.length || !dotsWrap) return;

  // Detecta la foto centrada por posición real de scroll — con el "peek"
  // activado, varias fotos quedan parcialmente visibles a la vez y el
  // IntersectionObserver por ratio se queda pegado en el índice 0.
  // Esto en cambio mide qué foto está geométricamente más cerca del
  // centro del track, que es justo lo que decide scroll-snap-align:center.
  function closestIndexToCenter() {
    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
    let bestIdx = 0, bestDist = Infinity;
    items.forEach((item, idx) => {
      const r = item.getBoundingClientRect();
      const dist = Math.abs((r.left + r.width / 2) - trackCenter);
      if (dist < bestDist) { bestDist = dist; bestIdx = idx; }
    });
    return bestIdx;
  }

  // Posición de scroll que centra una foto dada — calculada a mano en vez
  // de confiar en scrollIntoView(inline:'center'), que cerca de los bordes
  // del track se clampea sin moverse (no hay espacio real para centrar) y
  // deja los botones "pegados" sin feedback visible.
  function scrollLeftToCenter(item) {
    const max = track.scrollWidth - track.clientWidth;
    const raw = item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2;
    return Math.max(0, Math.min(max, raw));
  }

  function goToIndex(i) {
    const idx = Math.max(0, Math.min(items.length - 1, i));
    track.scrollTo({ left: scrollLeftToCenter(items[idx]), behavior: 'smooth' });
  }
  function goToIndexLooping(i) {
    goToIndex((i + items.length) % items.length);
  }

  // Construye los dots en base a la cantidad real de fotos (no hardcodeado)
  const dots = Array.from(items).map((item, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Ir a foto ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => goToIndex(i));
    dotsWrap.appendChild(dot);
    return dot;
  });
  dots[0].classList.add('active');

  let activeIndex = 0;
  function setActive(i) {
    if (i === activeIndex) return;
    activeIndex = i;
    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === i);
      d.setAttribute('aria-selected', idx === i ? 'true' : 'false');
    });
  }

  let scrollRaf = null;
  track.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = null;
      setActive(closestIndexToCenter());
    });
  }, { passive: true });

  // Las flechas siempre parten del índice real (closestIndexToCenter), no de
  // `activeIndex` guardado — así no dependen de que el evento 'scroll' se
  // haya disparado a tiempo.
  prevBtn?.addEventListener('click', () => goToIndex(closestIndexToCenter() - 1));
  nextBtn?.addEventListener('click', () => goToIndex(closestIndexToCenter() + 1));

  // ── Autoplay en bucle — desliza suave de derecha a izquierda,
  // se pausa ante cualquier interacción del usuario y retoma sola.
  const AUTOPLAY_DELAY = 4000;
  let autoplayTimer = null;

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => goToIndexLooping(closestIndexToCenter() + 1), AUTOPLAY_DELAY);
  }
  function stopAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  let resumeTimer = null;
  function pauseAutoplayTemporarily() {
    stopAutoplay();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoplay, AUTOPLAY_DELAY * 2);
  }

  // Solo un toque/arrastre real sobre el track (o flechas/dots) pausa el
  // autoplay — un "wheel" se descartó porque se disparaba con cualquier
  // scroll de la página que pasara por encima de la galería.
  track.addEventListener('pointerdown', pauseAutoplayTemporarily, { passive: true });
  prevBtn?.addEventListener('click', pauseAutoplayTemporarily);
  nextBtn?.addEventListener('click', pauseAutoplayTemporarily);
  dots.forEach(d => d.addEventListener('click', pauseAutoplayTemporarily));

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay(); else startAutoplay();
  });

  // Se pausa mientras el lightbox está abierto (misma instancia que el lightbox de arriba)
  const lightboxEl = document.getElementById('lightbox');
  if (lightboxEl) {
    new MutationObserver(() => {
      if (lightboxEl.classList.contains('active')) stopAutoplay();
      else startAutoplay();
    }).observe(lightboxEl, { attributes: true, attributeFilter: ['class'] });
  }

  startAutoplay();
})();

/* ============================================================
   MUSIC BUTTON — pause / play directo sobre el audio HTML5
   ============================================================ */
musicBtn.addEventListener('click', () => {
  if (!bgMusic) return;
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.classList.remove('paused');
    musicBtn.classList.add('playing');
  } else {
    bgMusic.pause();
    musicBtn.classList.remove('playing');
    musicBtn.classList.add('paused');
  }
});

/* ============================================================
   XV MODALS — Vestuario & Notas
   ============================================================ */
document.querySelectorAll('[data-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById(btn.dataset.modal).classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById(btn.dataset.close).classList.remove('active');
    document.body.style.overflow = '';
  });
});

document.querySelectorAll('.xv-modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.xv-modal.active').forEach(m => {
      m.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  });
});
