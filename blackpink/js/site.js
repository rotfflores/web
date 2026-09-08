const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const video = document.querySelector('.hero-video');
const toggle = document.querySelector('.video-toggle');

if (video && toggle) {
  let wantsPlayback = !reducedMotion.matches && !navigator.connection?.saveData;
  let onScreen = true;
  const status = document.querySelector('.video-status');
  const update = () => {
    const playing = !video.paused;
    const label = toggle.querySelector('.video-label');
    if (label) label.textContent = playing ? 'Pausar fondo' : 'Reproducir fondo';
    const path = toggle.querySelector('svg');
    if (path) path.innerHTML = playing
      ? '<path d="M8 5v14M16 5v14" stroke-width="3"/>'
      : '<path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none"/>';
    toggle.setAttribute('aria-label', playing ? 'Pausar video de fondo' : 'Reproducir video de fondo');
  };
  const sync = async () => {
    if (!wantsPlayback || document.hidden || !onScreen) {
      video.pause();
      return;
    }
    try { await video.play(); } catch { /* Autoplay may require a user gesture. The play button remains available. */ }
    update();
  };
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    wantsPlayback = video.paused;
    sync();
  });
  video.addEventListener('play', update);
  video.addEventListener('pause', update);
  const handleError = () => {
    wantsPlayback = false;
    toggle.hidden = true;
    if (status) status.textContent = 'Video no disponible';
  };
  video.addEventListener('error', handleError);
  video.querySelector('source')?.addEventListener('error', handleError);
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', () => {
    wantsPlayback = !reducedMotion.matches && !navigator.connection?.saveData;
    sync();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    }, { threshold: 0.05 }).observe(video);
  }
  sync();
}

// Load third-party players only when requested; close removes the player to stop audio.
document.querySelectorAll('.album-player').forEach(details => {
  details.addEventListener('toggle', () => {
    const frame = details.querySelector('iframe');
    if (!frame) return;
    if (details.open) {
      document.querySelectorAll('.album-player[open]').forEach(other => {
        if (other !== details) other.open = false;
      });
      frame.src = frame.dataset.src;
    } else {
      frame.removeAttribute('src');
    }
  });
});

// Progressive enhancement: content stays visible without JS or observer support.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const reveals = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        reveals.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .member-card, .album-card, .solo-art, .solo-content, .story-photo, .story-copy, .fan-banner, .next-member').forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 55}ms`);
    reveals.observe(element);
  });
}

// Works without View Transitions API; modifier clicks and external links remain native.
let navigating = false;
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download') || reducedMotion.matches) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin !== location.origin || destination.pathname === location.pathname || !destination.pathname.endsWith('.html')) return;
  if (navigating) { event.preventDefault(); return; }
  event.preventDefault();
  navigating = true;
  document.body.classList.add('page-leaving');
  window.setTimeout(() => location.assign(destination.href), 180);
});
window.addEventListener('pageshow', () => {
  navigating = false;
  document.body.classList.remove('page-leaving');
});
