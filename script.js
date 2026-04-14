/* =====================================================================
   KWESI BUABENG BORTEI — Portfolio Scripts
   ===================================================================== */

(function () {
    'use strict';

    /* ── SCROLL PROGRESS BAR ──────────────────────────────────────────── */
    const scrollBar = document.getElementById('scroll-bar');

    function updateScrollBar() {
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        scrollBar.style.width = Math.min(pct, 100) + '%';
    }

    /* ── NAV SHADOW ON SCROLL ─────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');

    function updateNav() {
        navbar.style.boxShadow = window.scrollY > 60
            ? '0 2px 30px rgba(0,0,0,.6), 0 0 20px rgba(37,99,235,.05)'
            : 'none';
    }

    window.addEventListener('scroll', () => {
        updateScrollBar();
        updateNav();
    }, { passive: true });

    /* ── MOBILE MENU ──────────────────────────────────────────────────── */
    const mobileBtn = document.getElementById('mobile-menu');
    const navLinks  = document.getElementById('nav-links');
    let menuOpen    = false;

    function setMenu(open) {
        menuOpen = open;
        navLinks.classList.toggle('open', open);
        const spans = mobileBtn.querySelectorAll('span');
        if (open) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity   = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    }

    mobileBtn.addEventListener('click', () => setMenu(!menuOpen));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

    /* ── REVEAL ON SCROLL ─────────────────────────────────────────────── */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const siblings = entry.target.parentElement
                ? Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'))
                : [];
            const idx   = siblings.indexOf(entry.target);
            const delay = idx >= 0 ? idx * 70 : 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    /* ── ACTIVE NAV HIGHLIGHT ─────────────────────────────────────────── */
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navAs    = Array.from(document.querySelectorAll('.nav-links a'));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navAs.forEach(a => a.classList.remove('active'));
            const active = navAs.find(a => a.getAttribute('href') === `#${entry.target.id}`);
            if (active) active.classList.add('active');
        });
    }, { threshold: 0.35 });

    sections.forEach(s => sectionObserver.observe(s));

    /* ── SMOOTH SCROLL (offset for fixed nav) ─────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            window.scrollTo({ top: target.offsetTop - navbar.offsetHeight - 12, behavior: 'smooth' });
        });
    });

    /* ── CONTACT FORM ─────────────────────────────────────────────────── */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn  = this.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML        = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
            btn.style.boxShadow  = '0 0 20px rgba(34,197,94,.35)';
            btn.disabled         = true;
            setTimeout(() => {
                btn.innerHTML       = orig;
                btn.style.background = '';
                btn.style.boxShadow  = '';
                btn.disabled        = false;
                this.reset();
            }, 3500);
        });
    }

    /* ── PHOTO FALLBACK ───────────────────────────────────────────────── */
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        profileImg.addEventListener('error', function () {
            const frame = this.closest('.photo-frame');
            if (!frame) return;
            this.remove();
            const initials = document.createElement('div');
            initials.style.cssText = `
                width:100%;height:100%;border-radius:50%;
                background:linear-gradient(135deg,#1d4ed8,#4f46e5);
                display:flex;align-items:center;justify-content:center;
                font-size:3.2rem;font-weight:800;color:#fff;
                font-family:'Inter',sans-serif;letter-spacing:-2px;
                position:relative;z-index:1;
            `;
            initials.textContent = 'KB';
            frame.appendChild(initials);
        });
    }

    /* ── CURSOR TRAIL (fine-pointer / mouse only) ─────────────────────── */
    if (window.matchMedia('(pointer: fine)').matches) {

        const ct = [
            document.getElementById('ct1'),
            document.getElementById('ct2'),
            document.getElementById('ct3'),
        ];

        /* Each bubble tracks the one before it with different lag */
        const pos = [
            { x: -100, y: -100 },
            { x: -100, y: -100 },
            { x: -100, y: -100 },
        ];
        /* Higher = snappier. ct1 leads, ct3 lags most */
        const speeds = [0.20, 0.13, 0.08];

        let mouseX = -100;
        let mouseY = -100;
        let visible = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!visible) {
                ct.forEach(el => el && (el.style.opacity = '1'));
                visible = true;
            }
        });

        /* Hide trail when cursor leaves the window */
        document.addEventListener('mouseleave', () => {
            ct.forEach(el => el && (el.style.opacity = '0'));
            visible = false;
        });

        /* Grow cursor near clickable elements */
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, [role="button"], input, textarea, select')) {
                ct[0] && (ct[0].style.transform = 'translate(-50%,-50%) scale(1.6)');
                ct[1] && (ct[1].style.transform = 'translate(-50%,-50%) scale(1.3)');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, [role="button"], input, textarea, select')) {
                ct[0] && (ct[0].style.transform = 'translate(-50%,-50%) scale(1)');
                ct[1] && (ct[1].style.transform = 'translate(-50%,-50%) scale(1)');
            }
        });

        function animateCursor() {
            /* ct1 follows the mouse */
            pos[0].x += (mouseX - pos[0].x) * speeds[0];
            pos[0].y += (mouseY - pos[0].y) * speeds[0];

            /* ct2 follows ct1, ct3 follows ct2 */
            for (let i = 1; i < 3; i++) {
                pos[i].x += (pos[i - 1].x - pos[i].x) * speeds[i];
                pos[i].y += (pos[i - 1].y - pos[i].y) * speeds[i];
            }

            ct.forEach((el, i) => {
                if (el) {
                    el.style.left = pos[i].x + 'px';
                    el.style.top  = pos[i].y + 'px';
                }
            });

            requestAnimationFrame(animateCursor);
        }

        animateCursor();
    }

    /* ── FOOTER YEAR ──────────────────────────────────────────────────── */
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
