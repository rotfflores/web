(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const button = form.querySelector('.form-submit');
  const status = form.querySelector('.form-status');
  const originalLabel = button.innerHTML;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;

    const data = new FormData(form);
    const payload = {
      name: data.get('Nombre'),
      email: data.get('Correo'),
      phone: data.get('Telefono'),
      project: data.get('Proyecto'),
      idealDate: data.get('Fecha'),
      message: data.get('Mensaje'),
      website: data.get('website')
    };

    button.disabled = true;
    button.textContent = 'Enviando…';
    status.className = 'form-status';
    status.textContent = 'Guardando tu solicitud de forma segura…';

    try {
      const response = await fetch('https://api.rotfstudio.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'No pudimos enviar tu solicitud.');
      form.reset();
      status.className = 'form-status success';
      status.textContent = '¡Listo! Recibimos tu idea y te contactaremos pronto.';
    } catch (error) {
      status.className = 'form-status error';
      status.textContent = error.message || 'Ocurrió un error. Intenta nuevamente.';
    } finally {
      button.disabled = false;
      button.innerHTML = originalLabel;
    }
  });
})();
