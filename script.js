/* ============================================================
   SMP Negeri 4 Sigi – script.js (Improved)
   Accessibility + Performance + UX enhancements
   ============================================================ */

'use strict';

// ── Fallback Image (SVG placeholder) ──
function fallbackImage(img, text) {
  const safe = String(text || 'SMP 4 SIGI').replace(/[<>]/g, '');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'>
    <defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>
      <stop stop-color='#dbeafe'/><stop offset='1' stop-color='#ecfeff'/>
    </linearGradient></defs>
    <rect width='900' height='600' fill='url(#g)'/>
    <circle cx='740' cy='90' r='160' fill='#3b82f6' opacity='.12'/>
    <circle cx='160' cy='530' r='200' fill='#06b6d4' opacity='.12'/>
    <rect x='100' y='160' width='700' height='280' rx='36' fill='white' opacity='.75'/>
    <text x='450' y='290' text-anchor='middle' font-size='48' font-family='system-ui,sans-serif'
      font-weight='800' fill='#1e40af'>${safe}</text>
    <text x='450' y='345' text-anchor='middle' font-size='22' font-family='system-ui,sans-serif'
      font-weight='600' fill='#64748b'>Gambar belum tersedia</text>
  </svg>`;
  img.onerror = null;
  img.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  img.removeAttribute('srcset');
}

// ── DOM refs ──
const pages       = [...document.querySelectorAll('.page')];
const pageButtons = [...document.querySelectorAll('[data-page]')];
const mobileMenu  = document.getElementById('mobileMenu');
const menuToggle  = document.getElementById('menuToggle');
const siteHeader  = document.getElementById('siteHeader');
const backTop     = document.getElementById('backTop');
const liveClock   = document.getElementById('liveClock');

// ── Page Navigation ──
function setActivePage(pageId, pushState = true) {
  const target = document.getElementById(pageId) || document.getElementById('beranda');
  pages.forEach(p => {
    p.classList.toggle('is-active', p === target);
    p.removeAttribute('aria-hidden');
  });
  pages.filter(p => p !== target).forEach(p => p.setAttribute('aria-hidden', 'true'));

  pageButtons.forEach(btn =>
    btn.classList.toggle('active', btn.dataset.page === target.id)
  );

  if (pushState) history.replaceState({ page: target.id }, '', '#' + target.id);

  const title = target.dataset.title || 'Beranda – SMP Negeri 4 Sigi';
  document.title = title;

  // Update dynamic breadcrumb structured data
  updateBreadcrumb(target.id, target.dataset.title);

  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMobileMenu();
  scheduleReveal();

  // Announce page change to screen readers
  announcePageChange(target.dataset.title || 'Beranda');
}

function announcePageChange(title) {
  const announcer = document.getElementById('page-announcer');
  if (announcer) announcer.textContent = 'Halaman ' + title + ' ditampilkan';
}

function updateBreadcrumb(pageId, pageTitle) {
  const schema = document.getElementById('breadcrumb-ld');
  if (!schema) return;
  const base = [{ '@type': 'ListItem', 'position': 1, 'name': 'Beranda', 'item': 'https://smpnegeri4sigi.my.id/' }];
  if (pageId !== 'beranda' && pageTitle) {
    base.push({ '@type': 'ListItem', 'position': 2, 'name': pageTitle.split('–')[0].trim() });
  }
  try { schema.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': base }); } catch(e){}
}

pageButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.page;
    if (id) setActivePage(id);
  });
});

// ── Mobile Menu ──
function openMobileMenu() {
  mobileMenu.classList.add('show');
  mobileMenu.removeAttribute('aria-hidden');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Tutup menu navigasi');
}
function closeMobileMenu() {
  mobileMenu.classList.remove('show');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Buka menu navigasi');
}

menuToggle.addEventListener('click', () => {
  mobileMenu.classList.contains('show') ? closeMobileMenu() : openMobileMenu();
});
document.addEventListener('click', e => {
  if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) closeMobileMenu();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});

// ── Scroll effects ──
let scrollTicking = false;
function handleScroll() {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const scrolled = window.scrollY > 20;
      siteHeader.classList.toggle('is-scrolled', scrolled);
      backTop.classList.toggle('show', window.scrollY > 400);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Live Clock (WITA) ──
const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Makassar',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hour12: false
});
function tickClock() {
  if (liveClock) {
    liveClock.textContent = timeFormatter.format(new Date()).replace(/\./g, ':') + ' WITA';
  }
}
tickClock();
setInterval(tickClock, 1000);

// ── Year in footer ──
const yearEl = document.getElementById('yearNow');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ── Reveal on Scroll ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function scheduleReveal() {
  requestAnimationFrame(() => {
    document.querySelectorAll('.page.is-active .reveal').forEach((el, i) => {
      el.classList.remove('is-visible');
      setTimeout(() => el.classList.add('is-visible'), 60 + i * 40);
    });
  });
}

// ── Contact Form ──
const submitBtn = document.getElementById('submitBtn');
if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    const nama   = document.getElementById('nama')?.value.trim() || '';
    const email  = document.getElementById('email')?.value.trim() || '';
    const subjek = document.getElementById('subjek')?.value.trim() || '';
    const pesan  = document.getElementById('pesan')?.value.trim() || '';

    if (!nama || !email || !subjek || !pesan) {
      alert('Harap lengkapi semua kolom sebelum mengirim pesan.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Harap masukkan alamat email yang valid.');
      return;
    }

    const body = encodeURIComponent(`Nama: ${nama}\nEmail: ${email}\n\n${pesan}`);
    const sub  = encodeURIComponent(subjek || 'Pesan dari website SMP Negeri 4 Sigi');
    window.location.href = `mailto:smpn4sigi@gmail.com?subject=${sub}&body=${body}`;
  });
}

// ── Gallery Modal ──
const modal           = document.getElementById('imageModal');
const modalImage      = document.getElementById('modalImage');
const modalVideo      = document.getElementById('modalVideo');
const modalVideoSrc   = document.getElementById('modalVideoSource');
const modalClose      = document.getElementById('modalClose');

function openModal(item) {
  const fullFile = item.dataset.full || '';
  const type     = item.dataset.type || (fullFile.toLowerCase().endsWith('.mp4') ? 'video' : 'image');

  if (type === 'video') {
    modalImage.style.display = 'none';
    modalImage.src = '';
    modalVideo.style.display = 'block';
    modalVideoSrc.src = fullFile;
    modalVideo.load();
    modalVideo.play().catch(() => {});
  } else {
    const img = item.querySelector('img');
    modalVideo.pause();
    modalVideoSrc.src = '';
    modalVideo.load();
    modalVideo.style.display = 'none';
    modalImage.style.display = 'block';
    modalImage.src = fullFile || img?.src || '';
  }

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  modalClose.focus();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  modalImage.src = '';
  modalImage.style.display = 'block';
  modalVideo.pause();
  modalVideoSrc.src = '';
  modalVideo.load();
  modalVideo.style.display = 'none';
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => openModal(item));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(item); }
  });
});

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('show')) closeModal(); });

// ── Hash-based routing on load ──
const initialHash = (location.hash || '#beranda').replace('#', '');
setActivePage(initialHash, false);

// ── Preload visible page images ──
document.querySelectorAll('.page.is-active img[loading="lazy"]').forEach(img => {
  img.loading = 'eager';
});

// ── Add screen reader announcer ──
(function() {
  const el = document.createElement('div');
  el.id = 'page-announcer';
  el.setAttribute('aria-live', 'polite');
  el.setAttribute('aria-atomic', 'true');
  el.className = 'sr-only';
  document.body.appendChild(el);
})();
