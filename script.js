function showPage(pageId, updateHistory = true) {
    const pages = document.querySelectorAll('.page');
    const selectedPage = document.getElementById(pageId);

    if (!selectedPage) return;

    pages.forEach(function (page) {
        page.classList.remove('active');
    });

    selectedPage.classList.add('active');

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

    if (updateHistory && window.location.hash !== '#' + pageId) {
        history.pushState(null, '', '#' + pageId);
    }
}

function toggleMenu() {
    const navLinks = document.getElementById('navLinks');

    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

function setupNavigation() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const href = link.getAttribute('href');

            if (!href || href === '#') return;

            const pageId = href.replace('#', '');
            const targetPage = document.getElementById(pageId);

            if (targetPage && targetPage.classList.contains('page')) {
                e.preventDefault();
                showPage(pageId, true);
            }
        });
    });
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

/* EFEK TAP FIX: TIDAK DOBEL DI HP */
function setupTapEffect() {
    const selector = '.btn, .card, .stat-card, .gallery-item, .info-card';
    let activeTimer = null;

    function getItem(target) {
        if (!target) return null;
        return target.closest(selector);
    }

    function pop(item) {
        if (!item) return;

        clearTimeout(activeTimer);

        item.classList.remove('tap-pop');

        /*
            Ini supaya animasi bisa diulang terus
            tanpa langsung mental balik.
        */
        void item.offsetWidth;

        item.classList.add('tap-pop');

        activeTimer = setTimeout(function () {
            item.classList.remove('tap-pop');
        }, 520);
    }

    document.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        const item = getItem(e.target);
        pop(item);
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupContactForm();
    setupTapEffect();

    const hash = window.location.hash.substring(1);
    const defaultPage = document.getElementById('beranda') ? 'beranda' : null;

    if (hash && document.getElementById(hash)) {
        showPage(hash, false);
    } else if (defaultPage) {
        showPage(defaultPage, false);
    }
});

window.addEventListener('popstate', function () {
    const hash = window.location.hash.substring(1) || 'beranda';

    if (document.getElementById(hash)) {
        showPage(hash, false);
    }
});
