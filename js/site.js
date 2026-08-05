const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  document.body.classList.add('reveal-ready');
  const revealTargets = document.querySelectorAll(
    '.section-heading, .service-card, .feature-list article, .process li, .cta'
  );

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--delay', `${(index % 4) * 90}ms`);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealTargets.forEach((element) => observer.observe(element));

  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', (event) => {
    glow?.style.setProperty('--x', `${event.clientX}px`);
    glow?.style.setProperty('--y', `${event.clientY}px`);
  }, { passive: true });

  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      if (window.innerWidth < 801) return;
      const bounds = card.getBoundingClientRect();
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -4;
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4;
      card.style.setProperty('--rx', `${rotateX}deg`);
      card.style.setProperty('--ry', `${rotateY}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}
