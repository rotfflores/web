// Rotate real project previews only while the card is visible.
document.querySelectorAll('[data-project-slideshow]').forEach((slideshow) => {
  const slides = [...slideshow.querySelectorAll('img')];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let visible = false;
  let timer;

  const sync = () => {
    window.clearInterval(timer);
    if (!visible || motion.matches || document.hidden) return;
    timer = window.setInterval(() => {
      const next = (index + 1) % slides.length;
      if (!slides[next].complete || !slides[next].naturalWidth) return;
      slides[index].classList.remove('is-current');
      slides[index].setAttribute('aria-hidden', 'true');
      slides[next].classList.add('is-current');
      slides[next].removeAttribute('aria-hidden');
      index = next;
    }, 5000);
  };

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, { threshold: .15 }).observe(slideshow);
  motion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  sync();
});
