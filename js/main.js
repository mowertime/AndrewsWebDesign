document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const yearTarget = document.querySelector('[data-year]');
  const templateOptions = document.querySelectorAll('.template-option');
  const templateScenes = document.querySelectorAll('.template-scene');
  const projectCards = document.querySelectorAll('.project-card');
  const navLinks = document.querySelectorAll('.nav-link');

  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  if (navLinks.length) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  templateOptions.forEach((button) => {
    button.addEventListener('click', () => {
      const targetTemplate = button.dataset.template;

      templateOptions.forEach((option) => {
        option.classList.toggle('is-active', option === button);
      });

      templateScenes.forEach((scene) => {
        scene.classList.toggle('is-active', scene.dataset.template === targetTemplate);
      });
    });
  });

  projectCards.forEach((card) => {
    const activateCard = () => {
      projectCards.forEach((item) => {
        item.classList.toggle('is-expanded', item === card);
      });
    };

    card.addEventListener('click', activateCard);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activateCard();
      }
    });
  });
});
