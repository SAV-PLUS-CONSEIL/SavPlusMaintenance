const header = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const navBackdrop = document.getElementById('navBackdrop');

window.addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

function closeNav() {
  siteNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Ouvrir le menu');
  navBackdrop.classList.remove('open');
  document.body.classList.remove('nav-open');
}

function openNav() {
  siteNav.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Fermer le menu');
  navBackdrop.classList.add('open');
  document.body.classList.add('nav-open');
}

if (navToggle && siteNav && navBackdrop) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });

  navBackdrop.addEventListener('click', closeNav);

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav.classList.contains('open')) closeNav();
  });

  let wasMobile = window.matchMedia('(max-width: 900px)').matches;
  window.addEventListener('resize', () => {
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    if (wasMobile && !isMobile) closeNav();
    wasMobile = isMobile;
  });
}

// Indicateur de section active dans la navigation (scrollspy)
const navLinks = Array.from(document.querySelectorAll('#siteNav a[data-nav]'));
if (navLinks.length) {
  const sections = navLinks
    .map(link => document.getElementById(link.dataset.nav))
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(link => {
      if (link.dataset.nav === id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }

  if (sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

    sections.forEach(section => observer.observe(section));
  }
}
