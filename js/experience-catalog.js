(() => {
  const catalog = document.querySelector('.experience-catalog');
  if (!catalog) return;

  const buttons = [...catalog.querySelectorAll('[data-filter]')];
  const cards = [...catalog.querySelectorAll('[data-cat]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    cards.forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.cat !== filter;
      if (!card.hidden) card.classList.add('visible');
    });
    const firstProject = cards.find(card => !card.hidden);
    if (!firstProject) return;

    // Keep the first project below the category bar when it becomes sticky.
    const filters = catalog.querySelector('.inv-filters');
    const offset = parseFloat(getComputedStyle(filters).top) + filters.offsetHeight + 20;
    window.scrollTo({
      top: window.scrollY + firstProject.getBoundingClientRect().top - offset,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  }));
})();
