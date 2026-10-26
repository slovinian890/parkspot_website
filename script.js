// Nav scroll state
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = () => {
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
};
burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

// Scroll reveal
const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
revealTargets.forEach((el) => observer.observe(el));

// How-it-works: highlight whichever step is crossing the viewport center
const steps = document.querySelectorAll('.step');
if (steps.length) {
  const stepObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-active', entry.isIntersecting);
      });
    },
    { threshold: 0, rootMargin: '-45% 0px -45% 0px' }
  );
  steps.forEach((step) => stepObserver.observe(step));
}

// Waitlist role toggle
const roleToggle = document.getElementById('roleToggle');
if (roleToggle) {
  roleToggle.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      roleToggle.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// Subtle cursor-reactive phone tilt (desktop only, respects reduced motion)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const heroVisual = document.getElementById('heroVisual');
const phoneMockup = document.getElementById('phoneMockup');

if (canHover && !prefersReducedMotion) {
  if (heroVisual && phoneMockup) {
    heroVisual.addEventListener('pointermove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      phoneMockup.style.setProperty('--tilt-x', `${px * 7}deg`);
      phoneMockup.style.setProperty('--tilt-y', `${-py * 7}deg`);
    }, { passive: true });
    heroVisual.addEventListener('pointerleave', () => {
      phoneMockup.style.setProperty('--tilt-x', '0deg');
      phoneMockup.style.setProperty('--tilt-y', '0deg');
    });
  }
}

// Waitlist form (front-end only — wire to a real backend before launch)
const waitlistForm = document.getElementById('waitlistForm');
const waitlistSuccess = document.getElementById('waitlistSuccess');
if (waitlistForm) {
  waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    waitlistForm.style.display = 'none';
    waitlistSuccess.classList.add('show');
  });
}
