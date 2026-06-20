function showPage(pageId, updateHistory = true) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === '#' + pageId) {
            item.classList.add('active');
        }
    });

    const navLinks = document.getElementById('navLinks');
    navLinks.classList.remove('active');

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
    navLinks.classList.toggle('active');
}

const contactForm = document.getElementById('dummyForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
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

window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showPage(hash, false);
    }
});

window.addEventListener('popstate', () => {
    const hash = window.location.hash.substring(1) || 'beranda';
    showPage(hash, false);
});
