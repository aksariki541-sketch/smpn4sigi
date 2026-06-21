const pages = [...document.querySelectorAll('.page')];
    const pageButtons = [...document.querySelectorAll('[data-page]')];
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.getElementById('menuToggle');
    const siteHeader = document.getElementById('siteHeader');
    const backTop = document.getElementById('backTop');
    const liveClock = document.getElementById('liveClock');

    function fallbackImage(img, text) {
      const safeText = String(text || 'SMP 4 SIGI').replace(/</g, '').replace(/>/g, '');
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop stop-color='#dbeafe'/><stop offset='1' stop-color='#ecfeff'/></linearGradient></defs><rect width='900' height='600' fill='url(#g)'/><circle cx='735' cy='90' r='160' fill='#3b82f6' opacity='.15'/><circle cx='170' cy='520' r='210' fill='#06b6d4' opacity='.16'/><rect x='110' y='150' width='680' height='300' rx='42' fill='white' opacity='.72'/><text x='450' y='290' text-anchor='middle' font-size='52' font-family='Arial, sans-serif' font-weight='800' fill='#1e40af'>${safeText}</text><text x='450' y='345' text-anchor='middle' font-size='24' font-family='Arial, sans-serif' font-weight='700' fill='#475569'>Gambar belum tersedia</text></svg>`;
      img.onerror = null;
      img.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
    }

    function setActivePage(pageId, pushHash = true) {
      const target = document.getElementById(pageId) || document.getElementById('beranda');
      pages.forEach(page => page.classList.toggle('is-active', page === target));
      pageButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.page === target.id));
      if (pushHash) history.replaceState(null, '', '#' + target.id);
      document.title = `${target.dataset.title || 'Beranda'} | SMP 4 SIGI`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (mobileMenu) mobileMenu.classList.remove('show');
      refreshReveal();
    }

    pageButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.page;
        if (id) setActivePage(id);
      });
    });

    menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('show'));
    document.addEventListener('click', (event) => {
      if (!mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) mobileMenu.classList.remove('show');
    });

    function updateHeaderState() {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
      backTop.classList.toggle('show', window.scrollY > 360);
    }
    window.addEventListener('scroll', updateHeaderState, { passive: true });
    updateHeaderState();
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    function tickClock() {
      const formatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Makassar', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
      if (liveClock) liveClock.textContent = formatter.format(new Date()).replace(/\./g, ':') + ' WITA';
    }
    tickClock();
    setInterval(tickClock, 1000);
    document.getElementById('yearNow').textContent = new Date().getFullYear();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    function refreshReveal() {
      document.querySelectorAll('.page.is-active .reveal').forEach((el, index) => {
        el.classList.remove('is-visible');
        setTimeout(() => el.classList.add('is-visible'), 60 + index * 45);
      });
    }

    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const nama = document.getElementById('nama').value.trim();
      const email = document.getElementById('email').value.trim();
      const subjek = document.getElementById('subjek').value.trim();
      const pesan = document.getElementById('pesan').value.trim();
      const body = encodeURIComponent(`Nama: ${nama}\nEmail: ${email}\n\n${pesan}`);
      const subject = encodeURIComponent(subjek || 'Pesan dari website SMP 4 SIGI');
      window.location.href = `mailto:smpn4sigi@gmail.com?subject=${subject}&body=${body}`;
    });

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const image = item.querySelector('img');
        modalImage.src = image.src;
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
      });
    });
    function closeModal() {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modalImage.src = '';
    }
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    window.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

    const initialHash = (location.hash || '#beranda').replace('#', '');
    setActivePage(initialHash, false);
