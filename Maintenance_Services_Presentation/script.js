const header = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function setupRevealAnimations() {
  const animatedSelectors = [
    '.hero .eyebrow',
    '.hero h1',
    '.hero .lead',
    '.hero-actions',
    '.trust-row',
    '.hero-card',
    '.section-intro',
    '.card',
    '.accredit-banner',
    '.feature-row-body',
    '.feature-row-media',
    '.cta-panel',
    '.timeline-item',
    '.gallery-grid img',
    '.faq-item',
    '.contact-strip .eyebrow',
    '.contact-strip h2',
    '.contact-strip .hero-actions',
    '.page-hero-content > *',
    '.contract-shell > *',
    '.footer-col'
  ];

  document.querySelectorAll(animatedSelectors.join(',')).forEach((el, index) => {
    el.classList.add('reveal-auto');
    el.style.setProperty('--reveal-delay', `${Math.min(index * 35, 280)}ms`);
  });

  document.querySelectorAll('.cards, .gallery-grid, .timeline, .trust-row, .accredit-points, .footer-grid').forEach((group) => {
    group.classList.add('reveal-group');
    Array.from(group.children).forEach((child, index) => {
      child.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`);
    });
  });
}

setupRevealAnimations();

const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger, .reveal-auto, .reveal-group');
const counterEls = document.querySelectorAll('.counter');

function animateCounter(el) {
  if (el.dataset.counted === 'true') return;
  el.dataset.counted = 'true';
  const to = parseInt(el.dataset.countTo, 10);
  if (Number.isNaN(to)) return;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) {
    el.textContent = prefix + to + suffix;
    return;
  }

  const duration = 950;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + Math.round(eased * to) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = prefix + to + suffix;
  }

  requestAnimationFrame(tick);
}

if (!reduceMotion) {
  counterEls.forEach((el) => {
    el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
  });
}

if (revealEls.length) {
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => {
      el.classList.add('is-visible');
      el.querySelectorAll('.counter').forEach(animateCounter);
    });
  } else {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('.counter').forEach((counter) => {
          const wrapper = counter.closest('.reveal-stagger > *, .reveal-group > *') || counter;
          const delay = parseFloat(getComputedStyle(wrapper).transitionDelay) * 1000 || 0;
          setTimeout(() => animateCounter(counter), delay);
        });
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));
  }
}

if (counterEls.length && !reduceMotion && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  counterEls.forEach((counter) => counterObserver.observe(counter));
}

function revealVisibleNow() {
  if (reduceMotion) return;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  revealEls.forEach((el) => {
    if (el.classList.contains('is-visible')) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.88 && rect.bottom > 0) {
      el.classList.add('is-visible');
      el.querySelectorAll('.counter').forEach(animateCounter);
    }
  });
}

let revealTicking = false;
function requestRevealCheck() {
  if (revealTicking) return;
  revealTicking = true;
  requestAnimationFrame(() => {
    revealTicking = false;
    revealVisibleNow();
  });
}

window.addEventListener('load', requestRevealCheck);
window.addEventListener('scroll', requestRevealCheck, { passive: true });
window.addEventListener('resize', requestRevealCheck);
requestRevealCheck();
