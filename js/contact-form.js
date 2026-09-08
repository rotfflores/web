(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  if (new URLSearchParams(window.location.search).get('proyecto') === 'invitacion') {
    form.querySelector('select[name="Proyecto"]').value = 'Una invitación digital';
  }

  const button = form.querySelector('.form-submit');
  const status = form.querySelector('.form-status');
  const originalLabel = button.innerHTML;
  const fileInput = form.querySelector('#contact-files');
  const fileList = form.querySelector('.contact-file-list');
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  let uploadsReady = false;
  let selectedFiles = [];
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];

  const renderFiles = () => {
    fileList.replaceChildren();
    selectedFiles.forEach((file, index) => {
      const item = document.createElement('li');
      const name = document.createElement('span');
      name.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Quitar';
      remove.setAttribute('aria-label', `Quitar ${file.name}`);
      remove.addEventListener('click', () => {
        selectedFiles.splice(index, 1);
        renderFiles();
      });
      item.append(name, remove);
      fileList.append(item);
    });
  };

  fileInput.addEventListener('change', () => {
    const files = [...selectedFiles, ...fileInput.files];
    fileInput.value = '';
    const invalid = files.length > 3 || files.some(file => !allowedTypes.includes(file.type) || !file.size || file.size > 20 * 1024 * 1024) || files.reduce((sum, file) => sum + file.size, 0) > 30 * 1024 * 1024;
    if (invalid) {
      status.className = 'form-status error';
      status.textContent = 'Elige hasta 3 imágenes o videos compatibles: máximo 20 MB por archivo y 30 MB en total. No se agregaron los archivos nuevos.';
      return;
    }
    selectedFiles = files;
    status.textContent = '';
    renderFiles();
  });

  if (local) {
    fetch('/api/contact-capabilities').then(response => response.ok ? response.json() : null).then(result => {
      if (result?.localContactUploads !== true) return;
      uploadsReady = true;
      fileInput.disabled = false;
      form.querySelector('[data-local-note]').hidden = false;
      form.querySelector('[data-files-availability]').hidden = true;
    }).catch(() => { /* Existing text submissions remain available. */ });
  }

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
      const multipart = new FormData();
      multipart.append('payload', JSON.stringify(payload));
      selectedFiles.forEach(file => multipart.append('attachments', file, file.name));
      const response = await fetch(uploadsReady ? '/api/contact' : 'https://api.rotfstudio.com/submit', {
        method: 'POST',
        headers: uploadsReady ? {} : { 'Content-Type': 'application/json' },
        body: uploadsReady ? multipart : JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'No pudimos enviar tu solicitud.');
      form.reset();
      selectedFiles = [];
      renderFiles();
      status.className = 'form-status success';
      status.textContent = uploadsReady ? 'Solicitud y archivos guardados en este equipo. Esta prueba local no envía mensajes.' : '¡Listo! Recibimos tu idea y te contactaremos pronto.';
    } catch (error) {
      status.className = 'form-status error';
      status.textContent = error.message || 'Ocurrió un error. Intenta nuevamente.';
    } finally {
      button.disabled = false;
      button.innerHTML = originalLabel;
    }
  });
})();
