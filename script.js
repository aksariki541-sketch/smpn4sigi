function showPage(pageId, updateHistory = true) {
    const pages = document.querySelectorAll('.page');

    pages.forEach(function (page) {
        page.classList.remove('active');
    });

    const selectedPage = document.getElementById(pageId);

    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(function (item) {
        item.classList.remove('active');

        if (item.getAttribute('href') === '#' + pageId) {
            item.classList.add('active');
        }
    });

    const navLinks = document.getElementById('navLinks');

    if (navLinks) {
        navLinks.classList.remove('active');
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

    if (updateHistory) {
        history.pushState(null, null, '#' + pageId);
    }

    setTimeout(function () {
        setupRevealAnimation();
    }, 120);
}

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');

    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

function setupContactForm() {
    const contactForm = document.getElementById('dummyForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nama = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const pesan = document.getElementById('contactMessage').value.trim();

        const tujuan = 'smpnegeri4sigi@gmail.com';
        const subjek = 'Pesan dari Website SMP Negeri 4 Sigi';

        const isiPesan =
            `Nama: ${nama}\n` +
            `Email Pengirim: ${email}\n\n` +
            `Pesan:\n${pesan}`;

        const gmailUrl =
            `https://mail.google.com/mail/?view=cm&fs=1` +
            `&to=${encodeURIComponent(tujuan)}` +
            `&su=${encodeURIComponent(subjek)}` +
            `&body=${encodeURIComponent(isiPesan)}`;

        window.open(gmailUrl, '_blank');
        contactForm.reset();
    });
}

/* EFEK ITEM YANG DIPENCET MAJU KE DEPAN */
function setupPressAnimation() {
    const pressItems = document.querySelectorAll(
        '.btn, .card, .stat-card, .gallery-item, .info-card'
    );

    pressItems.forEach(function (item) {
        item.addEventListener('pointerdown', function () {
            item.classList.add('press-pop');
        });

        item.addEventListener('pointerup', function () {
            setTimeout(function () {
                item.classList.remove('press-pop');
            }, 180);
        });

        item.addEventListener('pointerleave', function () {
            item.classList.remove('press-pop');
        });

        item.addEventListener('pointercancel', function () {
            item.classList.remove('press-pop');
        });
    });
}

/* ANIMASI MUNCUL SAAT DI-SCROLL */
let revealObserver = null;

function setupRevealAnimation() {
    if (revealObserver) {
        revealObserver.disconnect();
    }

    const activePage = document.querySelector('.page.active');

    if (!activePage) return;

    const revealItems = activePage.querySelectorAll(
        '.section-title, .card, .stat-card, .gallery-item, .timeline-item, .info-card'
    );

    revealItems.forEach(function (item, index) {
        item.classList.remove('show');
        item.classList.add('reveal');
        item.style.setProperty('--delay', index % 4);
    });

    if (!('IntersectionObserver' in window)) {
        revealItems.forEach(function (item) {
            item.classList.add('show');
        });
        return;
    }

    revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.16,
        rootMargin: '0px 0px -35px 0px'
    });

    revealItems.forEach(function (item) {
        revealObserver.observe(item);
    });
}

window.addEventListener('load', function () {
    setupContactForm();
    setupPressAnimation();

    const hash = window.location.hash.substring(1);

    if (hash) {
        showPage(hash, false);
    } else {
        setupRevealAnimation();
    }
});

window.addEventListener('popstate', function () {
    const hash = window.location.hash.substring(1) || 'beranda';
    showPage(hash, false);
});
