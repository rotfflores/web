const drawer = document.querySelector('.drawer');
const scrim = document.querySelector('.scrim');
const toggle = document.querySelector('.menu-toggle');
const closeButton = document.querySelector('.close-menu');
let previousFocus;

const enhancementStyles = document.createElement('link');
enhancementStyles.rel = 'stylesheet';
enhancementStyles.href = 'css/scroll-effects.css?v=6';
document.head.appendChild(enhancementStyles);

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/png';
favicon.href = 'img/logo.png?v=1';
document.head.appendChild(favicon);

const touchIcon = document.createElement('link');
touchIcon.rel = 'apple-touch-icon';
touchIcon.href = 'img/logo.png?v=1';
document.head.appendChild(touchIcon);

const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.prepend(progress);

const directionIndicator = document.createElement('div');
directionIndicator.className = 'scroll-direction';
directionIndicator.setAttribute('aria-hidden', 'true');
directionIndicator.innerHTML = '<span>↓</span><small>BAJANDO</small>';
document.body.appendChild(directionIndicator);

document.querySelectorAll('footer .code-brand').forEach((brand) => {
  brand.className = 'footer-logo';
  brand.setAttribute('aria-label', 'ROTF, inicio');
  brand.innerHTML = '<img src="img/logo.png" alt="Logotipo de ROTF">';
});

function setMenu(open) {
  if (!drawer || !scrim || !toggle) return;
  if (open) previousFocus = document.activeElement;
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  toggle.setAttribute('aria-expanded', String(open));
  scrim.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) closeButton?.focus(); else previousFocus?.focus?.();
}

toggle?.addEventListener('click', () => setMenu(true));
closeButton?.addEventListener('click', () => setMenu(false));
scrim?.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false); });
document.querySelectorAll('[data-year]').forEach((item) => { item.textContent = new Date().getFullYear(); });

let ticking = false;
let lastScrollY = window.scrollY;
let directionTimer;
function updateScrollEffects() {
  const top = window.scrollY;
  const available = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = available > 0 ? Math.min(top / available, 1) : 0;
  document.documentElement.style.setProperty('--scroll-progress', `${ratio * 100}%`);
  document.body.classList.toggle('has-scrolled', top > 90);
  if (Math.abs(top - lastScrollY) > 3) {
    const goingDown = top > lastScrollY;
    document.body.classList.toggle('scrolling-down', goingDown);
    document.body.classList.toggle('scrolling-up', !goingDown);
    directionIndicator.innerHTML = goingDown
      ? '<span>↓</span><small>BAJANDO</small>'
      : '<span>↑</span><small>SUBIENDO</small>';
    directionIndicator.classList.add('show');
    window.clearTimeout(directionTimer);
    directionTimer = window.setTimeout(() => directionIndicator.classList.remove('show'), 700);
    lastScrollY = top;
  }
  document.documentElement.style.setProperty('--hero-shift', `${Math.min(top * .08, 42)}px`);
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}, { passive: true });
updateScrollEffects();

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reveal-ready');
  const items = document.querySelectorAll('.reveal, .type-grid article, .choice-grid > a, .features span, .process article, footer');
  items.forEach((item, index) => {
    item.classList.add('scroll-reveal');
    item.style.setProperty('--reveal-delay', `${(index % 6) * 65}ms`);
  });
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  items.forEach((item) => observer.observe(item));
}
