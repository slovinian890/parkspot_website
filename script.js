const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Nav ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Scroll progress + parallax (combined, rAF-throttled) ---------- */
const scrollProgress = document.getElementById('scrollProgress');
const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));

if (scrollProgress || parallaxEls.length) {
  let scrollTicking = false;

  const updateOnScroll = () => {
    if (scrollProgress) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
      scrollProgress.style.transform = `scaleX(${progress})`;
    }
    if (parallaxEls.length && !reducedMotion) {
      const vh = window.innerHeight;
      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.08;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.transform = `translateY(${offset.toFixed(2)}px)`;
      });
    }
    scrollTicking = false;
  };

  const queueScrollUpdate = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateOnScroll);
  };

  updateOnScroll();
  window.addEventListener('scroll', queueScrollUpdate, { passive: true });
  window.addEventListener('resize', queueScrollUpdate, { passive: true });
}

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

const closeMenu = () => {
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open menu');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
};

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
});

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);
document.querySelectorAll('.reveal, .reveal-stagger, .reveal-left, .reveal-right').forEach((el) => revealObserver.observe(el));

/* ---------- Count figures up ---------- */
const runCounter = (el) => {
  const target = Number(el.dataset.countTo);
  if (!Number.isFinite(target)) return;

  const prefix = el.dataset.countPrefix || '';
  const suffix = el.dataset.countSuffix || '';
  const duration = 1300;
  const start = performance.now();
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const value = Math.round(target * easeOut(t));
    el.textContent = prefix + value.toLocaleString('en-US') + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counters = document.querySelectorAll('[data-count-to]');
if (counters.length && !reducedMotion) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => counterObserver.observe(el));
}

/* ---------- How-it-works tabs ---------- */
const tabs = document.getElementById('tabs');
if (tabs) {
  const tabButtons = Array.from(tabs.querySelectorAll('[role="tab"]'));

  const selectTab = (btn) => {
    tabButtons.forEach((other) => {
      const isTarget = other === btn;
      const panel = document.getElementById(other.getAttribute('aria-controls'));
      other.classList.toggle('active', isTarget);
      other.setAttribute('aria-selected', String(isTarget));
      panel.classList.toggle('active', isTarget);
      panel.hidden = !isTarget;
    });
  };

  tabButtons.forEach((btn, i) => {
    btn.addEventListener('click', () => selectTab(btn));
    btn.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const step = e.key === 'ArrowRight' ? 1 : -1;
      const next = tabButtons[(i + step + tabButtons.length) % tabButtons.length];
      selectTab(next);
      next.focus();
    });
  });
}

/* ---------- FAQ accordion ---------- */
const faqList = document.getElementById('faqList');
if (faqList) {
  faqList.querySelectorAll('.faq-q').forEach((question) => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const willOpen = !item.classList.contains('open');

      // one answer at a time keeps the column from becoming a wall of text
      faqList.querySelectorAll('.faq-item.open').forEach((open) => {
        open.classList.remove('open');
        open.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      item.classList.toggle('open', willOpen);
      question.setAttribute('aria-expanded', String(willOpen));
    });
  });
}

/* ---------- Waitlist role toggle ---------- */
const roleToggle = document.getElementById('roleToggle');
if (roleToggle) {
  const buttons = Array.from(roleToggle.querySelectorAll('button'));

  const moveThumb = () => {
    const active = roleToggle.querySelector('button.active');
    if (!active) return;
    roleToggle.style.setProperty('--thumb-w', `${active.offsetWidth}px`);
    roleToggle.style.setProperty('--thumb-x', `${active.offsetLeft - buttons[0].offsetLeft}px`);
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      moveThumb();
    });
  });

  moveThumb();
  window.addEventListener('resize', moveThumb, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveThumb);
}

/* ---------- Promo videos (facade: no <video> in the DOM until pressed) ---------- */
document.querySelectorAll('.demo-play').forEach((demoPlay) => {
  demoPlay.addEventListener('click', () => {
    const { videoMp4, videoWebm } = demoPlay.dataset;
    const video = document.createElement('video');
    video.className = 'demo-video';
    video.controls = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'auto';
    video.setAttribute('width', '1080');
    video.setAttribute('height', '1920');
    video.innerHTML = `
      ${videoWebm ? `<source src="${videoWebm}" type="video/webm">` : ''}
      <source src="${videoMp4}" type="video/mp4">
    `;
    demoPlay.replaceWith(video);
    video.play().catch(() => {});
  });
});

/* ---------- Phone tilt ---------- */
const heroVisual = document.getElementById('heroVisual');
const phoneMockup = document.getElementById('phoneMockup');

if (canHover && !reducedMotion && heroVisual && phoneMockup) {
  heroVisual.addEventListener('pointermove', (e) => {
    const rect = heroVisual.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    phoneMockup.style.setProperty('--tilt-x', `${px * 6}deg`);
    phoneMockup.style.setProperty('--tilt-y', `${-py * 6}deg`);
  }, { passive: true });

  heroVisual.addEventListener('pointerleave', () => {
    phoneMockup.style.setProperty('--tilt-x', '0deg');
    phoneMockup.style.setProperty('--tilt-y', '0deg');
  });
}

/* ---------- Waitlist form (front-end only — wire to a backend before launch) ---------- */
const waitlistForm = document.getElementById('waitlistForm');
const waitlistSuccess = document.getElementById('waitlistSuccess');
const formError = document.getElementById('formError');

if (waitlistForm) {
  const emailField = waitlistForm.querySelector('#email');

  const showError = (message) => {
    formError.textContent = message;
    formError.hidden = false;
    emailField.setAttribute('aria-invalid', 'true');
  };

  const clearError = () => {
    formError.hidden = true;
    emailField.removeAttribute('aria-invalid');
  };

  emailField.addEventListener('input', clearError);

  waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = emailField.value.trim();

    if (!value) return showError('Please enter your email address.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return showError('That email address doesn’t look right.');
    }

    clearError();
    waitlistForm.hidden = true;
    waitlistSuccess.hidden = false;
  });
}
