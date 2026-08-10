const drawer = document.querySelector('.drawer');
const scrim = document.querySelector('.scrim');
const toggle = document.querySelector('.menu-toggle');
const closeButton = document.querySelector('.close-menu');
let previousFocus;

const enhancementStyles = document.createElement('link');
enhancementStyles.rel = 'stylesheet';
enhancementStyles.href = 'css/scroll-effects.css?v=19';
document.head.appendChild(enhancementStyles);

const cardEffects = document.createElement('link');
cardEffects.rel = 'stylesheet';
cardEffects.href = 'css/card-effects.css?v=3';
document.head.appendChild(cardEffects);

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

const ambientGlow = document.createElement('div');
ambientGlow.className = 'cursor-ambient';
ambientGlow.setAttribute('aria-hidden', 'true');
document.body.prepend(ambientGlow);

const gridOverlay = document.createElement('div');
gridOverlay.className = 'grid-overlay';
gridOverlay.setAttribute('aria-hidden', 'true');
document.body.prepend(gridOverlay);

window.addEventListener('pointermove', (event) => {
  document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
  document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
}, { passive: true });

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

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const categoryTabs = [...document.querySelectorAll('.type-option[data-category]')];
const samplePanels = [...document.querySelectorAll('.sample-panel[data-panel]')];
function openInvitationCategory(tab, moveToPanel = false) {
  const category = tab.dataset.category;
  categoryTabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.setAttribute('aria-expanded', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  samplePanels.forEach((panel) => {
    const selected = panel.dataset.panel === category;
    panel.hidden = !selected;
    panel.classList.toggle('active', selected);
  });
  const activePanel = samplePanels.find((panel) => panel.dataset.panel === category);
  if (moveToPanel && activePanel && window.innerWidth <= 760) {
    window.setTimeout(() => activePanel.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' }), 80);
  }
}

categoryTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => openInvitationCategory(tab, true));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = categoryTabs.length - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % categoryTabs.length;
    else next = (index - 1 + categoryTabs.length) % categoryTabs.length;
    categoryTabs[next].focus();
    openInvitationCategory(categoryTabs[next]);
  });
});

if (!reducedMotion) {
  const transitionLayer = document.createElement('div');
  transitionLayer.className = 'page-transition';
  transitionLayer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(transitionLayer);

  const playEntrance = () => {
    document.body.classList.remove('page-leaving');
    document.querySelectorAll('.card-selected').forEach((item) => item.classList.remove('card-selected'));
    transitionLayer.classList.remove('active');
    document.body.classList.remove('page-entering');
    window.requestAnimationFrame(() => document.body.classList.add('page-entering'));
    window.setTimeout(() => document.body.classList.remove('page-entering'), 560);
  };
  if (cardEffects.sheet) playEntrance(); else cardEffects.addEventListener('load', playEntrance, { once: true });
  window.addEventListener('pageshow', playEntrance);

  document.querySelectorAll('a.choice-card[href]').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const destination = new URL(card.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      event.preventDefault();
      if (document.body.classList.contains('page-leaving')) return;
      card.classList.add('card-selected');
      document.body.classList.add('page-leaving');
      transitionLayer.classList.add('active');
      window.setTimeout(() => { window.location.assign(destination.href); }, 360);
    });
  });
}

let ticking = false;
let lastScrollY = window.scrollY;
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
    document.querySelectorAll('.scroll-reveal:not(.visible)').forEach((item) => {
      item.classList.toggle('reveal-from-up', !goingDown);
      item.classList.toggle('reveal-from-down', goingDown);
    });
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

if (!reducedMotion) {
  document.body.classList.add('reveal-ready');
  const items = document.querySelectorAll('.reveal, .type-grid article, .type-grid button, .choice-grid > a, .features span, .process article, footer');
  items.forEach((item, index) => {
    item.classList.add('scroll-reveal');
    item.style.setProperty('--reveal-delay', `${(index % 6) * 65}ms`);
  });
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  }), { threshold: .08, rootMargin: '96px 0px 96px 0px' });
  items.forEach((item) => observer.observe(item));
}
