document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const yearEl = document.querySelector('[data-year]');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Active nav — handles /portfolio/northline/index.html etc.
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href') || '';
    const path = location.pathname.replace(/\/index\.html$/, '/');
    const isHome = href === 'index.html' && (path === '/' || path.endsWith('/AndrewsWebDesign/'));
    const file = path.split('/').pop() || 'index.html';
    const norm = href.split('/').pop() || href;
    const active = isHome || (norm && file === norm) || (href.includes('portfolio') && path.includes('portfolio'));
    // prefer exact match, but don't force portfolio active on home
    if (href === 'portfolio/index.html' && !path.includes('portfolio')) a.classList.remove('active');
    else if (isHome && href === 'index.html') { a.classList.add('active'); a.setAttribute('aria-current','page'); }
    else if (file === norm && file !== '') { a.classList.add('active'); a.setAttribute('aria-current','page'); }
  });

  // Mobile nav — click, outside, Escape
  if (navToggle && siteNav) {
    const closeNav = () => { siteNav.classList.remove('is-open'); navToggle.setAttribute('aria-expanded','false'); siteNav.setAttribute('aria-hidden','true'); };
    const openNav = () => { siteNav.classList.add('is-open'); navToggle.setAttribute('aria-expanded','true'); siteNav.setAttribute('aria-hidden','false'); };
    siteNav.setAttribute('aria-hidden','true');
    navToggle.addEventListener('click', () => {
      const willOpen = !siteNav.classList.contains('is-open');
      if (willOpen) openNav(); else closeNav();
    });
    siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
    document.addEventListener('click', e => {
      if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
  }

  // Template switcher (basic HTML, no scroll)
  const templateOptions = document.querySelectorAll('.template-option');
  const templateScenes = document.querySelectorAll('.template-scene');
  if (templateOptions.length && templateScenes.length) {
    templateOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.template;
        templateOptions.forEach(o => o.classList.toggle('is-active', o === btn));
        templateScenes.forEach(s => s.classList.toggle('is-active', s.dataset.template === target));
      });
    });
  }

  // Project cards — delegated expand, accessible
  const cardGrid = document.querySelector('.card-grid');
  if (cardGrid) {
    cardGrid.addEventListener('click', e => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      cardGrid.querySelectorAll('.project-card').forEach(c => c.classList.toggle('is-expanded', c === card));
    });
    cardGrid.addEventListener('keydown', e => {
      const card = e.target.closest('.project-card');
      if (!card) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  }
});
