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

/* FIX: EFEK TAP/KLIK JALAN DI HP DAN DESKTOP */
function setupTapEffect() {
    const selector = '.btn, .card, .stat-card, .gallery-item, .info-card';

    function getItem(target) {
        if (!target) return null;
        return target.closest(selector);
    }

    function pop(item) {
        if (!item) return;

        item.classList.remove('tap-pop');

        requestAnimationFrame(function () {
            item.classList.add('tap-pop');

            setTimeout(function () {
                item.classList.remove('tap-pop');
            }, 650);
        });
    }

    document.addEventListener('touchstart', function (e) {
        pop(getItem(e.target));
    }, { passive: true });

    document.addEventListener('pointerdown', function (e) {
        pop(getItem(e.target));
    }, { passive: true });

    document.addEventListener('click', function (e) {
        pop(getItem(e.target));
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setupContactForm();
    setupTapEffect();

    const hash = window.location.hash.substring(1);

    if (hash) {
        showPage(hash, false);
    }
});

window.addEventListener('popstate', function () {
    const hash = window.location.hash.substring(1) || 'beranda';
    showPage(hash, false);
});
