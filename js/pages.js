document.body.classList.add('studio-shell');
document.querySelector('.topbar')?.classList.add('studio-topbar');
document.querySelectorAll('.code-brand').forEach((brand) => {
  brand.innerHTML = '<span>&lt;</span>rotf studio<span>&gt;</span>';
  brand.setAttribute('aria-label', 'ROTF Studio, inicio');
});
document.querySelectorAll('.drawer nav small').forEach((number) => number.remove());
const drawerMessage = document.querySelector('.drawer > p');
if (drawerMessage) drawerMessage.innerHTML = '&lt;rotf studio&gt;<br>Experiencias digitales hechas a tu medida.';
document.title = document.title.replace(/\bROTF\b(?! Studio)/g, 'ROTF Studio');
document.querySelectorAll('footer p').forEach((item) => {
  item.innerHTML = item.innerHTML.replace(/\bROTF\b(?! Studio)/g, 'ROTF Studio');
});

const pageTopbar = document.querySelector('.topbar');
if (pageTopbar && !pageTopbar.querySelector('.theme-toggle')) {
  const pageThemeToggle = document.createElement('button');
  pageThemeToggle.className = 'theme-toggle';
  pageThemeToggle.type = 'button';
  pageThemeToggle.setAttribute('aria-label', 'Activar modo claro');
  pageThemeToggle.setAttribute('aria-pressed', 'false');
  pageThemeToggle.innerHTML = '<span class="theme-icon" aria-hidden="true">☼</span><span class="theme-label">Claro</span>';
  pageTopbar.insertBefore(pageThemeToggle, pageTopbar.querySelector('.menu-toggle'));
}

const drawer = document.querySelector('.drawer');
const scrim = document.querySelector('.scrim');
const toggle = document.querySelector('.menu-toggle');
const closeButton = document.querySelector('.close-menu');
let previousFocus;

const enhancementStyles = document.createElement('link');
enhancementStyles.rel = 'stylesheet';
enhancementStyles.href = 'css/scroll-effects.css?v=20';
document.head.appendChild(enhancementStyles);

const cardEffects = document.createElement('link');
cardEffects.rel = 'stylesheet';
cardEffects.href = 'css/card-effects.css?v=3';
document.head.appendChild(cardEffects);

const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.type = 'image/webp';
favicon.href = 'img/logo-mobile.webp?v=1';
document.head.appendChild(favicon);

const touchIcon = document.createElement('link');
touchIcon.rel = 'apple-touch-icon';
touchIcon.href = 'img/logo-mobile.webp?v=1';
document.head.appendChild(touchIcon);

const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.prepend(progress);

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (finePointer) {
  const ambientGlow = document.createElement('div');
  ambientGlow.className = 'cursor-ambient';
  ambientGlow.setAttribute('aria-hidden', 'true');
  document.body.prepend(ambientGlow);
}

const gridOverlay = document.createElement('div');
gridOverlay.className = 'grid-overlay';
gridOverlay.setAttribute('aria-hidden', 'true');
document.body.prepend(gridOverlay);

if (finePointer) {
  window.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
  }, { passive: true });
}

document.querySelectorAll('footer .code-brand').forEach((brand) => {
  brand.className = 'footer-logo';
  brand.setAttribute('aria-label', 'ROTF, inicio');
  brand.innerHTML = '<img src="img/logo-mobile.webp" alt="Logotipo de ROTF" width="512" height="512">';
});

// Las animaciones fuera de pantalla no deben competir con el primer render.
const deferredMotionSections = [...document.querySelectorAll('main > section:not(:first-child), footer')];
const motionViewport = window.innerHeight;
deferredMotionSections.forEach((section) => {
  const bounds = section.getBoundingClientRect();
  section.classList.toggle('motion-paused', bounds.top > motionViewport + 180 || bounds.bottom < -180);
});
const motionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.target.classList.toggle('motion-paused', !entry.isIntersecting));
}, { rootMargin: '180px 0px' });
deferredMotionSections.forEach((section) => motionObserver.observe(section));

const afterFirstPaint = (callback) => {
  const run = () => window.requestAnimationFrame(() => window.requestAnimationFrame(callback));
  if (document.readyState === 'complete') run();
  else window.addEventListener('load', run, { once: true });
};

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

const themeToggle = document.querySelector('.theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme, persist = false) {
  const light = theme === 'light';
  if (light) document.documentElement.dataset.theme = 'light';
  else delete document.documentElement.dataset.theme;
  themeToggle?.setAttribute('aria-pressed', String(light));
  themeToggle?.setAttribute('aria-label', light ? 'Activar modo oscuro' : 'Activar modo claro');
  const icon = themeToggle?.querySelector('.theme-icon');
  const label = themeToggle?.querySelector('.theme-label');
  if (icon) icon.textContent = light ? '☾' : '☼';
  if (label) label.textContent = light ? 'Oscuro' : 'Claro';
  themeMeta?.setAttribute('content', light ? '#f4f2ec' : '#08090a');
  if (persist) {
    try { localStorage.setItem('rotf-theme', light ? 'light' : 'dark'); } catch (error) { /* Storage may be unavailable. */ }
  }
}

let initialTheme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
try { if (localStorage.getItem('rotf-theme') === 'light') initialTheme = 'light'; } catch (error) { /* Storage may be unavailable. */ }
applyTheme(initialTheme);
themeToggle?.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true);
});

function createStudioUniverse() {
  const main = document.querySelector('main');
  const start = document.querySelector('.studio-intro') || main?.firstElementChild;
  const end = document.querySelector('.bottom-cta') || main?.lastElementChild;
  if (!main || !start || !end) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'studio-universe-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  main.insertBefore(canvas, start);
  const context = canvas.getContext('2d');
  if (!context) return;

  let width = 0;
  let height = 0;
  let ratio = 1;
  let particles = [];
  let frame = 0;
  let visible = true;
  let pointerX = -10000;
  let pointerY = -10000;
  let lastDraw = 0;
  const compactMotion = window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;
  const frameInterval = compactMotion ? 1000 / 30 : 1000 / 60;

  const darkColors = ['157,123,255', '184,255,74', '255,255,255'];
  const lightColors = ['5,5,5', '76,45,132', '5,5,5'];
  const rebuild = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = Math.min(window.devicePixelRatio || 1, compactMotion ? 1 : 1.25);
    canvas.style.top = '0';
    canvas.style.height = '100vh';
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const isHome = document.body.classList.contains('studio-home');
    const count = isHome
      ? Math.min(compactMotion ? 82 : 120, Math.max(62, Math.round((width * height) / 11500)))
      : Math.min(compactMotion ? 72 : 100, Math.max(55, Math.round((width * height) / 13500)));
    particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: .55 + Math.random() * 1.35,
      vx: (Math.random() - .5) * .09,
      vy: -.035 - Math.random() * .075,
      phase: Math.random() * Math.PI * 2,
      palette: index % darkColors.length
    }));
  };

  const draw = (time) => {
    if (!visible || document.hidden) { frame = 0; return; }
    if (time - lastDraw < frameInterval) { frame = window.requestAnimationFrame(draw); return; }
    lastDraw = time;
    context.clearRect(0, 0, width, height);
    const lightTheme = document.documentElement.dataset.theme === 'light';
    const lineColor = lightTheme ? '52,31,86' : '157,123,255';
    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      const pointerDx = particle.x - pointerX;
      const pointerDy = particle.y - pointerY;
      if (pointerDx * pointerDx + pointerDy * pointerDy < 32400) {
        particle.x += (particle.x - pointerX) * .0007;
        particle.y += (particle.y - pointerY) * .0007;
      }
      if (particle.y < -8) particle.y = height + 8;
      if (particle.x < -8) particle.x = width + 8;
      if (particle.x > width + 8) particle.x = -8;
      const pulse = .35 + (Math.sin(time * .0018 + particle.phase) + 1) * .28;
      const particleColor = lightTheme
        ? lightColors[particle.palette]
        : darkColors[particle.palette];
      context.beginPath();
      context.fillStyle = `rgba(${particleColor},${pulse})`;
      context.shadowColor = `rgba(${particleColor},.55)`;
      context.shadowBlur = particle.r * 7;
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
      for (let next = index + 1; next < Math.min(particles.length, index + 18); next += 1) {
        const other = particles[next];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < 15625) {
          const distance = Math.sqrt(distanceSquared);
          context.beginPath();
          context.strokeStyle = `rgba(${lineColor},${(1 - distance / 125) * .1})`;
          context.lineWidth = .7;
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }
    });
    frame = window.requestAnimationFrame(draw);
  };

  const resumeDrawing = () => {
    if (visible && !document.hidden && !frame) frame = window.requestAnimationFrame(draw);
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    resumeDrawing();
  }, { rootMargin: '250px' });
  observer.observe(canvas);
  rebuild();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) frame = window.requestAnimationFrame(draw);
  window.addEventListener('resize', rebuild, { passive: true });
  window.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
  }, { passive: true });
  document.addEventListener('visibilitychange', resumeDrawing);

  const finePointerOnly = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('.studio-project, .studio-home .choice-card, .project-card, .contact-card, .type-grid article').forEach((card) => {
    card.classList.add('cosmic-card');
    if (!finePointerOnly) return;
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      card.style.setProperty('--tilt-x', `${y * -4}deg`);
      card.style.setProperty('--tilt-y', `${x * 5}deg`);
      card.style.setProperty('--glow-x', `${(x + .5) * 100}%`);
      card.style.setProperty('--glow-y', `${(y + .5) * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

afterFirstPaint(createStudioUniverse);

function createFeatureGalaxy() {
  const stage = document.querySelector('.feature-orbit');
  const track = stage?.querySelector('.orbit-tags');
  const tags = track ? [...track.children] : [];
  if (!stage || tags.length === 0) return;

  const lines = document.createElement('canvas');
  lines.className = 'constellation-lines';
  lines.setAttribute('aria-hidden', 'true');
  stage.prepend(lines);
  const lineContext = lines.getContext('2d');
  const prefersLessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let offset = 0;
  let targetOffset = 0;
  let sphereTilt = .2;
  let targetSphereTilt = .2;
  let dragCandidate = false;
  let dragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let previousX = 0;
  let previousY = 0;
  let visible = true;
  let lastTime = performance.now();
  let points = [];
  let dust = [];
  let lineRatio = 1;
  let animationFrame = 0;

  const resizeLines = () => {
    lineRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    lines.width = Math.round(stage.clientWidth * lineRatio);
    lines.height = Math.round(stage.clientHeight * lineRatio);
    lineContext?.setTransform(lineRatio, 0, 0, lineRatio, 0, 0);
    dust = Array.from({ length: stage.clientWidth < 620 ? 42 : 70 }, () => ({
      x: Math.random() * stage.clientWidth,
      y: Math.random() * stage.clientHeight,
      size: .45 + Math.random() * 1.25,
      phase: Math.random() * Math.PI * 2,
      tone: Math.random() > .55 ? 'purple' : 'white'
    }));
  };

  const placeTags = (time = performance.now()) => {
    const compact = stage.clientWidth < 620;
    const radiusX = compact ? 118 : 350;
    const radiusY = compact ? 150 : 190;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const tilt = sphereTilt;
    points = [];
    tags.forEach((tag, index) => {
      const sphereY = 1 - 2 * ((index + .5) / tags.length);
      const latitudeRadius = Math.sqrt(1 - sphereY * sphereY);
      const longitude = index * goldenAngle + offset;
      const sphereX = Math.cos(longitude) * latitudeRadius;
      const sphereZ = Math.sin(longitude) * latitudeRadius;
      const rotatedY = sphereY * Math.cos(tilt) - sphereZ * Math.sin(tilt);
      const rotatedZ = sphereY * Math.sin(tilt) + sphereZ * Math.cos(tilt);
      const x = sphereX * radiusX;
      const y = rotatedY * radiusY;
      const depth = (rotatedZ + 1) / 2;
      const scale = .72 + depth * .38;
      const z = -110 + depth * 220;
      tag.style.setProperty('--orbit-x', `${x}px`);
      tag.style.setProperty('--orbit-y', `${y}px`);
      tag.style.setProperty('--orbit-z', `${z}px`);
      tag.style.setProperty('--orbit-scale', scale.toFixed(3));
      tag.style.setProperty('--orbit-opacity', (.5 + depth * .5).toFixed(3));
      tag.style.setProperty('--orbit-blur', `${((1 - depth) * 1.15).toFixed(2)}px`);
      tag.style.setProperty('--orbit-brightness', (.8 + depth * .3).toFixed(3));
      tag.style.setProperty('--orbit-tilt', `${(sphereX * -7).toFixed(2)}deg`);
      tag.style.zIndex = String(10 + Math.round(depth * 20));
      points.push({ x: stage.clientWidth / 2 + x, y: stage.clientHeight / 2 + y });
    });

    if (!lineContext) return;
    lineContext.clearRect(0, 0, stage.clientWidth, stage.clientHeight);
    const light = document.documentElement.dataset.theme === 'light';
    dust.forEach((particle) => {
      const opacity = .18 + (Math.sin(time * .002 + particle.phase) + 1) * .22;
      const purple = particle.tone === 'purple';
      lineContext.beginPath();
      lineContext.fillStyle = light
        ? (purple ? `rgba(76,45,132,${opacity})` : `rgba(5,5,5,${opacity})`)
        : (purple ? `rgba(157,123,255,${opacity})` : `rgba(255,255,255,${opacity})`);
      lineContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      lineContext.fill();
    });
    points.forEach((point, index) => {
      const links = [index + 1, index + 3];
      links.forEach((linkIndex) => {
        const target = points[linkIndex];
        if (!target) return;
        const gradient = lineContext.createLinearGradient(point.x, point.y, target.x, target.y);
        gradient.addColorStop(0, light ? 'rgba(15,10,24,.2)' : 'rgba(157,123,255,.2)');
        gradient.addColorStop(.5, light ? 'rgba(110,71,189,.48)' : 'rgba(184,255,74,.35)');
        gradient.addColorStop(1, light ? 'rgba(15,10,24,.2)' : 'rgba(157,123,255,.2)');
        lineContext.beginPath();
        lineContext.strokeStyle = gradient;
        lineContext.lineWidth = 1;
        lineContext.moveTo(point.x, point.y);
        lineContext.lineTo(target.x, target.y);
        lineContext.stroke();
      });
    });
  };

  const animate = (time) => {
    if (!visible || document.hidden) { animationFrame = 0; return; }
    const elapsed = Math.min(40, time - lastTime);
    lastTime = time;
    if (visible && !document.hidden && !dragging) targetOffset += elapsed * .00014;
    offset += (targetOffset - offset) * .075;
    sphereTilt += (targetSphereTilt - sphereTilt) * .075;
    if (visible && !document.hidden) placeTags(time);
    animationFrame = window.requestAnimationFrame(animate);
  };

  const startDrag = (event) => {
    dragCandidate = true;
    dragging = false;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    previousX = event.clientX;
    previousY = event.clientY;
  };
  const moveDrag = (event) => {
    if (!dragCandidate && !dragging) return;
    if (!dragging && Math.hypot(event.clientX - dragStartX, event.clientY - dragStartY) < 10) return;
    if (!dragging) {
      dragging = true;
      stage.classList.add('is-dragging');
      stage.setPointerCapture?.(event.pointerId);
    }
    const deltaX = event.clientX - previousX;
    const deltaY = event.clientY - previousY;
    previousX = event.clientX;
    previousY = event.clientY;
    targetOffset += deltaX * .011;
    targetSphereTilt = Math.max(-1.05, Math.min(1.05, targetSphereTilt + deltaY * .006));
    event.preventDefault();
  };
  const endDrag = (event) => {
    dragCandidate = false;
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging');
    stage.releasePointerCapture?.(event.pointerId);
  };

  stage.addEventListener('pointerdown', startDrag);
  stage.addEventListener('pointermove', moveDrag);
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  const resumeOrbit = () => {
    if (!prefersLessMotion && visible && !document.hidden && !animationFrame) {
      lastTime = performance.now();
      animationFrame = window.requestAnimationFrame(animate);
    }
  };
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    resumeOrbit();
  }, { rootMargin: '180px' }).observe(stage);
  new ResizeObserver(() => { resizeLines(); placeTags(); }).observe(stage);
  resizeLines();
  placeTags();
  document.addEventListener('visibilitychange', resumeOrbit);
  resumeOrbit();
}

afterFirstPaint(createFeatureGalaxy);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const categoryTabs = [...document.querySelectorAll('.type-option[data-category]')];
const samplePanels = [...document.querySelectorAll('.sample-panel[data-panel]')];
const samplePanelsContainer = document.querySelector('.sample-panels');
let closeTimer;
let swipeGuideTimer;
let swipeGuideRemoveTimer;
let swipeGuideShown = false;

function hideSwipeGuide(immediate = false) {
  window.clearTimeout(swipeGuideTimer);
  window.clearTimeout(swipeGuideRemoveTimer);
  const guide = document.querySelector('.swipe-guide');
  if (!guide) return;
  if (immediate || reducedMotion) {
    guide.remove();
    return;
  }
  guide.classList.add('leaving');
  swipeGuideRemoveTimer = window.setTimeout(() => guide.remove(), 320);
}

function showSwipeGuide(panel) {
  const gallery = panel.querySelector('.projects-gallery');
  if (swipeGuideShown || !mobileCarouselQuery.matches || !gallery || gallery.querySelectorAll('.showcase-project').length < 2) return;
  swipeGuideShown = true;
  const guide = document.createElement('div');
  guide.className = 'swipe-guide';
  guide.innerHTML = '<div><span class="swipe-hand" aria-hidden="true"><svg viewBox="0 0 64 64" focusable="false"><path d="M25 29V12a5 5 0 0 1 10 0v14-7a5 5 0 0 1 10 0v10-5a5 5 0 0 1 10 0v15c0 13-8 21-21 21h-2c-8 0-13-4-17-10L7 38a5 5 0 0 1 8-6l10 9V29Z"/><path class="swipe-accent" d="M8 17h9M47 8h9"/></svg></span><strong>Arrastra o desliza</strong><small>Mueve hacia ambos lados para ver más</small></div>';
  document.body.appendChild(guide);
  const dismiss = () => hideSwipeGuide();
  guide.addEventListener('pointerdown', dismiss, { once: true });
  guide.addEventListener('touchstart', dismiss, { once: true, passive: true });
  swipeGuideTimer = window.setTimeout(dismiss, 2100);
}

function openInvitationCategory(tab, moveToPanel = false) {
  window.clearTimeout(closeTimer);
  const category = tab.dataset.category;
  const activePanel = samplePanels.find((panel) => panel.dataset.panel === category);
  const shouldClose = tab.classList.contains('active') && activePanel && !activePanel.hidden;
  tab.insertAdjacentElement('afterend', samplePanelsContainer);
  if (shouldClose) {
    hideSwipeGuide();
    activePanel.querySelector('.projects-gallery')?.destroyCarousel?.();
    tab.classList.add('closing');
    samplePanelsContainer.classList.add('closing');
    activePanel.classList.add('closing');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('aria-expanded', 'false');
    closeTimer = window.setTimeout(() => {
      tab.classList.remove('active', 'closing');
      activePanel.classList.remove('active', 'closing');
      activePanel.hidden = true;
      samplePanelsContainer.classList.remove('open', 'closing');
    }, reducedMotion ? 0 : 420);
    return;
  }
  samplePanelsContainer.classList.remove('closing');
  samplePanels.forEach((panel) => panel.classList.remove('closing'));
  categoryTabs.forEach((item) => item.classList.remove('closing'));
  categoryTabs.forEach((item) => {
    const selected = !shouldClose && item === tab;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-selected', String(selected));
    item.setAttribute('aria-expanded', String(selected));
    item.tabIndex = item === tab ? 0 : -1;
  });
  samplePanels.forEach((panel) => {
    const selected = !shouldClose && panel.dataset.panel === category;
    panel.hidden = !selected;
    panel.classList.toggle('active', selected);
  });
  samplePanelsContainer?.classList.toggle('open', !shouldClose);
  if (activePanel && !shouldClose) {
    const activeGallery = activePanel.querySelector('.projects-gallery');
    if (mobileCarouselQuery.matches) {
      configureProjectCarousels(activeGallery);
      centerProjectGallery(activeGallery);
    }
    else window.requestAnimationFrame(() => centerProjectGallery(activeGallery));
    window.setTimeout(() => showSwipeGuide(activePanel), reducedMotion ? 0 : 380);
  }
  if (moveToPanel && activePanel && !shouldClose) {
    if (mobileCarouselQuery.matches) tab.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.setTimeout(() => activePanel.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' }), 80);
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

const mobileCarouselQuery = window.matchMedia('(max-width: 760px)');
const projectGalleries = document.querySelectorAll('.sample-panel .projects-gallery');

function centerProjectGallery(gallery) {
  if (!gallery) return;
  if (typeof gallery.resetCarousel === 'function') gallery.resetCarousel();
  else gallery.scrollLeft = 0;
}

function configureProjectCarousel(gallery) {
    gallery.scrollLeft = 0;
    gallery.tabIndex = 0;
    if (!mobileCarouselQuery.matches) return;
    const originals = [...gallery.children];
    if (originals.length < 2) return;

    const track = document.createElement('div');
    track.className = 'carousel-track';
    originals.forEach((card) => track.appendChild(card));
    gallery.appendChild(track);

    let index = 0;
    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let horizontal = false;
    let deciding = false;
    let mouseDragging = false;
    let suppressClick = false;
    const slideWidth = () => gallery.clientWidth;
    const place = (animate = false, offset = 0) => {
      track.style.transition = animate ? 'transform .28s cubic-bezier(.22,.61,.36,1)' : 'none';
      track.style.transform = `translate3d(${(-index * slideWidth()) + offset}px,0,0)`;
    };
    const reset = () => { index = 0; place(false); };
    const move = (direction) => {
      index = Math.max(0, Math.min(originals.length - 1, index + direction));
      place(true);
    };
    const onTouchStart = (event) => {
      if (event.touches.length !== 1) return;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      deltaX = 0;
      horizontal = false;
      deciding = true;
      track.style.transition = 'none';
    };
    const onTouchMove = (event) => {
      if (!deciding || event.touches.length !== 1) return;
      const dx = event.touches[0].clientX - startX;
      const dy = event.touches[0].clientY - startY;
      if (!horizontal && Math.abs(dx) < 7 && Math.abs(dy) < 7) return;
      if (!horizontal && Math.abs(dy) >= Math.abs(dx)) {
        deciding = false;
        return;
      }
      horizontal = true;
      deltaX = dx;
      event.preventDefault();
      place(false, deltaX);
    };
    const onTouchEnd = () => {
      if (!horizontal) return;
      if (Math.abs(deltaX) > Math.min(70, slideWidth() * .18)) move(deltaX < 0 ? 1 : -1);
      else place(true);
      deciding = false;
      horizontal = false;
    };
    const onPointerDown = (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      startX = event.clientX;
      deltaX = 0;
      mouseDragging = true;
      suppressClick = false;
      gallery.classList.add('is-dragging');
      gallery.setPointerCapture?.(event.pointerId);
      track.style.transition = 'none';
    };
    const onPointerMove = (event) => {
      if (!mouseDragging || event.pointerType !== 'mouse') return;
      deltaX = event.clientX - startX;
      if (Math.abs(deltaX) < 5) return;
      suppressClick = true;
      event.preventDefault();
      place(false, deltaX);
    };
    const onPointerEnd = (event) => {
      if (!mouseDragging || event.pointerType !== 'mouse') return;
      if (Math.abs(deltaX) > Math.min(70, slideWidth() * .18)) move(deltaX < 0 ? 1 : -1);
      else place(true);
      mouseDragging = false;
      gallery.classList.remove('is-dragging');
      gallery.releasePointerCapture?.(event.pointerId);
      window.setTimeout(() => { suppressClick = false; }, 0);
    };
    const onClickCapture = (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
    };
    const onKeyDown = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    };
    const onResize = () => place(false);
    gallery.addEventListener('touchstart', onTouchStart, { passive: true });
    gallery.addEventListener('touchmove', onTouchMove, { passive: false });
    gallery.addEventListener('touchend', onTouchEnd, { passive: true });
    gallery.addEventListener('touchcancel', onTouchEnd, { passive: true });
    gallery.addEventListener('pointerdown', onPointerDown);
    gallery.addEventListener('pointermove', onPointerMove);
    gallery.addEventListener('pointerup', onPointerEnd);
    gallery.addEventListener('pointercancel', onPointerEnd);
    gallery.addEventListener('click', onClickCapture, true);
    gallery.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    gallery.resetCarousel = reset;
    gallery.destroyCarousel = () => {
      gallery.removeEventListener('touchstart', onTouchStart);
      gallery.removeEventListener('touchmove', onTouchMove);
      gallery.removeEventListener('touchend', onTouchEnd);
      gallery.removeEventListener('touchcancel', onTouchEnd);
      gallery.removeEventListener('pointerdown', onPointerDown);
      gallery.removeEventListener('pointermove', onPointerMove);
      gallery.removeEventListener('pointerup', onPointerEnd);
      gallery.removeEventListener('pointercancel', onPointerEnd);
      gallery.removeEventListener('click', onClickCapture, true);
      gallery.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      [...track.children].forEach((card) => gallery.appendChild(card));
      track.remove();
      delete gallery.resetCarousel;
      delete gallery.destroyCarousel;
    };
    reset();
}

function configureProjectCarousels(activeGallery = document.querySelector('.sample-panel.active .projects-gallery')) {
  projectGalleries.forEach((gallery) => gallery.destroyCarousel?.());
  if (activeGallery) configureProjectCarousel(activeGallery);
}

configureProjectCarousels();
mobileCarouselQuery.addEventListener?.('change', () => configureProjectCarousels());

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
let navigationFadeTimer;

function wakeFloatingNavigation() {
  document.body.classList.add('nav-controls-active');
  window.clearTimeout(navigationFadeTimer);
  navigationFadeTimer = window.setTimeout(() => {
    document.body.classList.remove('nav-controls-active');
  }, 1100);
}

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
  wakeFloatingNavigation();
  if (!ticking) {
    window.requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}, { passive: true });
updateScrollEffects();

if (!reducedMotion) {
  document.body.classList.add('reveal-ready');
  const items = [...document.querySelectorAll('.reveal, .type-grid > article, .type-grid > button, .choice-grid > a, .features span, .process article, footer')]
    .filter((item) => !item.closest('.orbit-tags'));
  items.forEach((item, index) => {
    item.classList.add('scroll-reveal');
    item.style.setProperty('--reveal-delay', `${(index % 6) * 65}ms`);
  });
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
  }), { threshold: .08, rootMargin: '96px 0px 96px 0px' });
  items.forEach((item) => observer.observe(item));
}
