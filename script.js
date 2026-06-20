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

    refreshRevealAnimation();
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

/* ANIMASI SCROLL RINGAN */
let revealObserver = null;

function setupRevealAnimation() {
    const revealItems = document.querySelectorAll(
        '.section-title, .card, .stat-card, .gallery-item, .timeline-item, .info-card'
    );

    revealItems.forEach(function (item) {
        item.classList.add('reveal');
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
        threshold: 0.12,
        rootMargin: '0px 0px -20px 0px'
    });

    revealItems.forEach(function (item) {
        revealObserver.observe(item);
    });
}

function refreshRevealAnimation() {
    setTimeout(function () {
        const activePage = document.querySelector('.page.active');
        if (!activePage) return;

        const activeRevealItems = activePage.querySelectorAll('.reveal');

        activeRevealItems.forEach(function (item) {
            const rect = item.getBoundingClientRect();

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                item.classList.add('show');

                if (revealObserver) {
                    revealObserver.unobserve(item);
                }
            }
        });
    }, 80);
}

window.addEventListener('load', function () {
    setupContactForm();
    setupRevealAnimation();

    const hash = window.location.hash.substring(1);

    if (hash) {
        showPage(hash, false);
    } else {
        refreshRevealAnimation();
    }
});

window.addEventListener('popstate', function () {
    const hash = window.location.hash.substring(1) || 'beranda';
    showPage(hash, false);
});
