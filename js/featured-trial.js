(() => {
  const dialog = document.querySelector('#trial-dialog');
  const form = document.querySelector('#trial-form');
  if (!dialog || !form || typeof dialog.showModal !== 'function') return;

  const submit = form.querySelector('.trial-submit');
  const status = form.querySelector('.trial-status');
  const originalLabel = submit.innerHTML;
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  const endpoint = local ? '/api/trial' : 'https://api.rotfstudio.com/submit';
  const project = 'Día del Novio — Prueba gratis';
  const projectUrl = 'https://dia-del-novio.rotfstudio.com/bienvenida/dist/';
  let opener;

  document.querySelectorAll('[data-trial-open]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      dialog.showModal();
      document.documentElement.classList.add('trial-open');
      form.elements.name.focus();
    });
  });
  dialog.querySelector('.trial-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('trial-open');
    opener?.focus({ preventScroll: true });
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled || !form.reportValidity()) return;
    const data = new FormData(form);
    const value = key => String(data.get(key) || '').trim();
    if (value('name').length < 2 || value('phone').replace(/\D/g, '').length < 7) {
      status.dataset.state = 'error';
      status.textContent = 'Revisa tu nombre y escribe un número de WhatsApp válido con lada.';
      return;
    }
    const message = [
      'Quiero solicitar mi prueba gratis de Día del Novio.',
      `Página de referencia: ${projectUrl}`,
      value('partner') && `Nombre de mi pareja: ${value('partner')}`,
      value('comments') && `Comentarios: ${value('comments')}`
    ].filter(Boolean).join('\n');
    const payload = { name: value('name'), email: value('email'), phone: value('phone'), project, idealDate: '', message, website: value('website') };

    submit.disabled = true;
    submit.textContent = 'Enviando solicitud…';
    form.setAttribute('aria-busy', 'true');
    status.removeAttribute('data-state');
    status.textContent = 'Guardando tu solicitud…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || result?.ok !== true) throw new Error('request_failed');
      form.reset();
      status.dataset.state = 'success';
      status.textContent = '¡Recibimos tu solicitud de prueba gratis! Te contactaremos por WhatsApp para personalizarla contigo.';
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'No pudimos guardar tu solicitud. Tus datos siguen aquí; vuelve a intentarlo en un momento.';
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
      submit.innerHTML = originalLabel;
      form.removeAttribute('aria-busy');
    }
  });
})();
