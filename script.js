/* =====================================================================
   KWESI BUABENG BORTEI | Portfolio Scripts
   Everything is progressive: if a capability is missing (WebGL, fine
   pointer, clipboard) the page still works, it just does less.
   ===================================================================== */

(function () {
    'use strict';

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fine    = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    var narrow  = window.matchMedia && window.matchMedia('(max-width: 760px)').matches;

    var $  = function (sel, root) { return (root || document).querySelector(sel); };
    var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    /* ── A REFRESH SHOULD LAND AT THE TOP, NOT MID-PAGE ───────────────── */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (!location.hash) window.scrollTo(0, 0);

    /* ── TEXT SPLITTING ───────────────────────────────────────────────── */

    /* per-letter spans, used by the logo and the preloader name */
    $$('[data-split]').forEach(function (el) {
        var text = el.textContent.trim();
        var frag = document.createDocumentFragment();
        Array.prototype.forEach.call(text, function (ch, i) {
            var s = document.createElement('span');
            s.textContent = ch === ' ' ? ' ' : ch;
            s.style.animationDelay = (i * 35) + 'ms';
            frag.appendChild(s);
        });
        el.textContent = '';
        el.appendChild(frag);
    });

    /* hero name: every letter lifts on its own hover. Letters are grouped
       per word so the browser can only break between words, never inside
       one, which is exactly what a naive per-letter split gets wrong. */
    $$('[data-chars]').forEach(function (el) {
        var words = el.textContent.trim().split(/\s+/);
        el.textContent = '';
        words.forEach(function (word, wi) {
            var wrap = document.createElement('span');
            wrap.className = 'wd';
            Array.prototype.forEach.call(word, function (ch) {
                var s = document.createElement('span');
                s.className = 'ch';
                s.textContent = ch;
                wrap.appendChild(s);
            });
            el.appendChild(wrap);
            if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
        });
    });

    /* headings arrive one word at a time; the inner <i> is what moves */
    $$('[data-words]').forEach(function (el) {
        var words = el.textContent.trim().split(/\s+/);
        el.textContent = '';
        words.forEach(function (w, i) {
            var span = document.createElement('span');
            span.className = 'word';
            var inner = document.createElement('i');
            inner.textContent = w;
            span.appendChild(inner);
            el.appendChild(span);
            if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
        });
    });

    /* ── SECTION NUMBERING ────────────────────────────────────────────── */
    /* written here so reordering sections never leaves a stale 03 behind */
    var kickers = $$('.kicker');
    kickers.forEach(function (k, i) {
        k.setAttribute('data-num', ('0' + (i + 1)).slice(-2));
    });
    /* +1 because the hero carries no kicker but is still a section */
    var total = ('0' + (kickers.length + 1)).slice(-2);
    var navCountInit = $('#nav-count');
    if (navCountInit) navCountInit.textContent = '01 / ' + total;

    /* ── PRELOADER ────────────────────────────────────────────────────── */
    var pre = $('#pre');
    var didLock = false;

    function clearPre() {
        if (!pre) return;
        pre.classList.add('done');
        document.body.classList.remove('locked');
        /* locking the body while the preloader is up throws away the jump
           the browser made for a #section link, so land it again here */
        if (didLock && location.hash) {
            var target = document.querySelector(location.hash);
            if (target) {
                var offset = navbar ? navbar.offsetHeight + 8 : 0;
                window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'auto' });
            }
        }
    }

    if (pre && !reduced) {
        var preStart = Date.now(), MIN_PRE = 2000;
        document.body.classList.add('locked');
        didLock = true;
        window.addEventListener('load', function () {
            setTimeout(clearPre, Math.max(0, MIN_PRE - (Date.now() - preStart)));
        });
        setTimeout(clearPre, 4000);           // never let it trap the page
    } else {
        clearPre();
    }

    /* ── LIVE BACKGROUND: VANTA.NET ───────────────────────────────────── */
    /* Greyscale on purpose. The lattice is atmosphere, not decoration to
       compete with the copy, so it stays desaturated at every size. */
    (function initVanta() {
        var host = $('#livebg');
        if (!host || reduced || !window.VANTA || !window.VANTA.NET) return;
        try {
            window.__vantaNet = window.VANTA.NET({
                el: host,
                mouseControls: fine,
                touchControls: false,      // never fight the page scroll on phones
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0x3d434e,           // dim enough to sit under body copy
                backgroundColor: 0x0e0e11,
                points: narrow ? 6.00 : 9.00,
                maxDistance: narrow ? 17.00 : 21.00,
                spacing: narrow ? 20.00 : 16.00,
                showDots: true
            });
        } catch (e) { /* leave the flat background in place */ }
    })();

    /* ── REVEAL ON SCROLL ─────────────────────────────────────────────── */
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var parent   = entry.target.parentElement;
            var siblings = parent ? $$('.reveal:not(.visible)', parent) : [];
            var idx      = siblings.indexOf(entry.target);
            setTimeout(function () { entry.target.classList.add('visible'); }, idx > 0 ? idx * 70 : 0);
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach(function (el) { revealObserver.observe(el); });

    /* section headings play their word animation on entry */
    var headObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in');
            headObserver.unobserve(entry.target);
        });
    }, { threshold: 0.25 });

    $$('.sec-head').forEach(function (el) { headObserver.observe(el); });

    /* ── STAT COUNT-UP ────────────────────────────────────────────────── */
    var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el     = entry.target;
            var target = parseInt(el.getAttribute('data-count'), 10) || 0;
            var suffix = el.getAttribute('data-suffix') || '';
            statObserver.unobserve(el);

            if (reduced) { el.textContent = target + suffix; return; }

            var start = performance.now(), dur = 1100;
            (function tick(now) {
                var p = Math.min(1, (now - start) / dur);
                var eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(tick);
            })(start);
        });
    }, { threshold: 0.6 });

    $$('[data-count]').forEach(function (el) { statObserver.observe(el); });

    /* ── NAV: STUCK STATE, SCROLL SPY, SECTION COUNTER ────────────────── */
    var navbar   = $('#navbar');
    var navCount = $('#nav-count');
    var navAs    = $$('.nav-links a');
    var sections = $$('section[id]');

    function onScroll() {
        if (navbar) navbar.classList.toggle('stuck', window.scrollY > 40);
        updateProgress();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = entry.target.id;
            navAs.forEach(function (a) {
                a.classList.toggle('active', a.getAttribute('href') === '#' + id);
            });
            var i = sections.indexOf(entry.target);
            if (navCount && i >= 0) navCount.textContent = ('0' + (i + 1)).slice(-2) + ' / ' + total;
        });
    }, { threshold: 0.3 });

    sections.forEach(function (s) { spy.observe(s); });

    /* ── MOBILE MENU ──────────────────────────────────────────────────── */
    var mobileBtn = $('#mobile-menu');
    var navLinks  = $('#nav-links');
    var menuOpen  = false;

    function setMenu(open) {
        menuOpen = open;
        if (navLinks) navLinks.classList.toggle('open', open);
        document.body.classList.toggle('locked', open);
        if (!mobileBtn) return;
        var spans = mobileBtn.querySelectorAll('span');
        if (open) {
            spans[0].style.transform = 'translateY(3.5px) rotate(45deg)';
            spans[1].style.transform = 'translateY(-3.5px) rotate(-45deg)';
            spans[1].style.width = '100%';
        } else {
            spans[0].style.transform = '';
            spans[1].style.transform = '';
            spans[1].style.width = '';
        }
    }

    if (mobileBtn) {
        mobileBtn.addEventListener('click', function () { setMenu(!menuOpen); });
        mobileBtn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMenu(!menuOpen); }
        });
    }
    navAs.forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

    /* ── SMOOTH SCROLL WITH NAV OFFSET ────────────────────────────────── */
    $$('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;
            var target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            var offset = navbar ? navbar.offsetHeight + 8 : 0;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: reduced ? 'auto' : 'smooth'
            });
        });
    });

    /* ── BACK TO TOP, WITH READING PROGRESS DRAWN AROUND IT ───────────── */
    var toTop = $('#to-top');
    var ring  = $('#to-top-ring');
    var CIRC  = 2 * Math.PI * 23;

    if (ring) {
        ring.style.strokeDasharray  = CIRC;
        ring.style.strokeDashoffset = CIRC;
    }

    function updateProgress() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        if (ring) ring.style.strokeDashoffset = CIRC * (1 - pct);
        if (toTop) toTop.classList.toggle('on', window.scrollY > window.innerHeight * 0.6);
    }

    if (toTop) {
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
        });
    }

    /* ── POINTER LAYER (fine pointers only) ───────────────────────────── */
    if (fine && !reduced) {
        var dot   = $('#cur-dot');
        var ringEl = $('#cur-ring');
        var label = $('#ptr-label');
        var mx = -200, my = -200, rx = -200, ry = -200;
        var shown = false;

        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            if (!shown) {
                [dot, ringEl].forEach(function (el) { if (el) el.style.opacity = '1'; });
                shown = true;
            }
            if (dot) dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
            if (label) label.style.transform = label.classList.contains('on')
                ? 'translate(' + (mx + 26) + 'px,' + (my + 22) + 'px) scale(1)'
                : 'translate(' + (mx + 26) + 'px,' + (my + 22) + 'px) scale(.7)';
        });

        document.addEventListener('mouseleave', function () {
            [dot, ringEl].forEach(function (el) { if (el) el.style.opacity = '0'; });
            shown = false;
        });

        (function follow() {
            rx += (mx - rx) * 0.16;
            ry += (my - ry) * 0.16;
            if (ringEl) ringEl.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
            requestAnimationFrame(follow);
        })();

        var HOT = 'a, button, [role="button"], input, textarea, select, .tag, .copy';

        document.addEventListener('mouseover', function (e) {
            var hot = e.target.closest(HOT);
            if (ringEl) ringEl.classList.toggle('hot', !!hot);
            var labelled = e.target.closest('[data-label]');
            if (label && labelled) {
                label.textContent = labelled.getAttribute('data-label');
                label.classList.add('on');
            }
        });

        document.addEventListener('mouseout', function (e) {
            if (e.target.closest(HOT) && ringEl) ringEl.classList.remove('hot');
            if (e.target.closest('[data-label]') && label) label.classList.remove('on');
        });

        /* pointer-following highlight on cards */
        $$('[data-spot]').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        });

        /* gentle 3D tilt */
        $$('[data-tilt]').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var r  = el.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width - 0.5;
                var py = (e.clientY - r.top) / r.height - 0.5;
                el.style.transform = 'perspective(900px) rotateX(' + (-py * 4).toFixed(2) + 'deg) rotateY(' + (px * 4).toFixed(2) + 'deg)';
            });
            el.addEventListener('mouseleave', function () { el.style.transform = ''; });
        });

        /* magnetic buttons */
        $$('[data-magnetic]').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var r = el.getBoundingClientRect();
                var x = e.clientX - r.left - r.width / 2;
                var y = e.clientY - r.top - r.height / 2;
                el.style.transform = 'translate(' + (x * 0.18).toFixed(2) + 'px,' + (y * 0.28).toFixed(2) + 'px)';
            });
            el.addEventListener('mouseleave', function () { el.style.transform = ''; });
        });
    }

    /* ── COPY THE EMAIL ───────────────────────────────────────────────── */
    var copyBtn = $('#copy-email');
    if (copyBtn) {
        copyBtn.addEventListener('click', function () {
            var addr = copyBtn.getAttribute('data-email');
            var done = function () {
                copyBtn.textContent = 'Copied';
                setTimeout(function () { copyBtn.textContent = 'Copy'; }, 1800);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(addr).then(done, function () { window.location.href = 'mailto:' + addr; });
            } else {
                window.location.href = 'mailto:' + addr;
            }
        });
    }

    /* ── LOCAL TIME IN ACCRA ──────────────────────────────────────────── */
    var timeEl = $('#local-time');
    if (timeEl) {
        (function tickClock() {
            try {
                var t = new Date().toLocaleTimeString('en-GB', {
                    timeZone: 'Africa/Accra', hour: '2-digit', minute: '2-digit'
                });
                timeEl.textContent = t + ' in Accra, Ghana';
            } catch (e) {
                timeEl.textContent = 'Accra, Ghana';
            }
            setTimeout(tickClock, 30000);
        })();
    }

    /* ── MESSAGE COUNTER ──────────────────────────────────────────────── */
    var message = $('#message');
    var counter = $('#char-count');
    if (message && counter) {
        message.addEventListener('input', function () {
            counter.textContent = message.value.length + ' / 600';
        });
    }

    /* ── CONTACT FORM ─────────────────────────────────────────────────── */
    /* There is no backend here, so rather than pretend, hand the message
       to the visitor's mail client with everything already filled in. */
    var contactForm = $('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn  = contactForm.querySelector('button[type="submit"]');
            var orig = btn ? btn.innerHTML : '';
            var name    = ($('#name')    || {}).value || '';
            var email   = ($('#email')   || {}).value || '';
            var subject = ($('#subject') || {}).value || 'Portfolio enquiry';
            var body    = (message ? message.value : '') + '\n\n' + name + '\n' + email;

            window.location.href = 'mailto:officialkingbee2@gmail.com'
                + '?subject=' + encodeURIComponent(subject)
                + '&body='    + encodeURIComponent(body);

            if (btn) {
                btn.innerHTML = '<i class="fas fa-check"></i> Opening your mail app';
                btn.disabled  = true;
                setTimeout(function () {
                    btn.innerHTML = orig;
                    btn.disabled  = false;
                }, 3000);
            }
        });
    }

    /* ── PHOTO FALLBACK ───────────────────────────────────────────────── */
    var profileImg = $('#profile-img');
    if (profileImg) {
        profileImg.addEventListener('error', function () {
            var clip = profileImg.closest('.photo-clip');
            if (!clip) return;
            profileImg.remove();
            var initials = document.createElement('div');
            initials.style.cssText = 'width:100%;height:100%;display:grid;place-items:center;'
                + 'font-size:3rem;font-weight:600;letter-spacing:-.04em;color:#6c6d78;';
            initials.textContent = 'KB';
            clip.appendChild(initials);
        });
    }

    /* ── FOOTER YEAR ──────────────────────────────────────────────────── */
    var yearEl = $('#footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
