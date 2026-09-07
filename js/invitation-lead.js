(function () {
  'use strict';

  var script = document.currentScript;
  var invitationName = (script && script.dataset.invitation) || document.title || 'Invitación digital';
  var endpoint = 'https://boda-toscana.rotfstudio.com/api/requests';
  var whatsappNumber = '526182051723';

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character];
    });
  }

  function mount() {
    if (document.querySelector('.rotf-demo-contact')) return;

    var style = document.createElement('style');
    style.textContent = `
      .rotf-demo-contact, .rotf-demo-contact * { box-sizing: border-box; }
      .rotf-demo-contact { position: relative; z-index: 2; width: 100%; max-width: 100vw; overflow: hidden; isolation: isolate; color: #f7f3e8; background: #102d28; padding: max(72px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(72px, calc(env(safe-area-inset-bottom) + 48px)) max(20px, env(safe-area-inset-left)); font-family: Arial, Helvetica, sans-serif; line-height: 1.5; }
      .rotf-demo-contact::before { content: ''; position: absolute; inset: 0; z-index: -1; opacity: .45; background: radial-gradient(circle at 15% 15%, rgba(190,155,86,.28), transparent 32%), radial-gradient(circle at 90% 85%, rgba(255,255,255,.09), transparent 35%); }
      .rotf-demo-contact__inner { width: min(100%, 760px); margin: 0 auto; }
      .rotf-demo-contact__brand { margin: 0 0 12px; color: #d6b66f; font-size: 12px; font-weight: 800; letter-spacing: .25em; text-transform: uppercase; }
      .rotf-demo-contact h2 { max-width: 620px; margin: 0; color: #fff; font: 500 clamp(32px, 7vw, 58px)/1.05 Georgia, 'Times New Roman', serif; letter-spacing: -.025em; }
      .rotf-demo-contact__description { max-width: 590px; margin: 18px 0 0; color: #e7e5dc; font-size: clamp(16px, 2vw, 18px); }
      .rotf-demo-contact__note { margin: 28px 0; padding: 15px 18px; border: 1px solid rgba(214,182,111,.45); border-radius: 12px; color: #f2ead7; background: rgba(255,255,255,.055); font-size: 14px; }
      .rotf-demo-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; margin-top: 28px; }
      .rotf-demo-field { display: grid; gap: 7px; min-width: 0; color: #fff; font-size: 14px; font-weight: 700; }
      .rotf-demo-field--wide { grid-column: 1 / -1; }
      .rotf-demo-field input, .rotf-demo-field select, .rotf-demo-field textarea { display: block; width: 100%; min-width: 0; min-height: 52px; margin: 0; border: 1px solid rgba(255,255,255,.3); border-radius: 10px; outline: 0; background: #fff; color: #17201e; padding: 13px 14px; font: 400 16px/1.35 Arial, Helvetica, sans-serif; box-shadow: none; appearance: auto; }
      .rotf-demo-field textarea { min-height: 112px; resize: vertical; }
      .rotf-demo-field input:focus, .rotf-demo-field select:focus, .rotf-demo-field textarea:focus { border-color: #d6b66f; box-shadow: 0 0 0 3px rgba(214,182,111,.25); }
      .rotf-demo-submit { grid-column: 1 / -1; min-height: 54px; border: 0; border-radius: 999px; padding: 14px 24px; color: #102d28; background: #d6b66f; font: 800 15px/1 Arial, Helvetica, sans-serif; letter-spacing: .035em; cursor: pointer; touch-action: manipulation; }
      .rotf-demo-submit:hover { background: #e7ca84; transform: translateY(-1px); }
      .rotf-demo-submit:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
      .rotf-demo-submit:disabled { cursor: wait; opacity: .72; transform: none; }
      .rotf-demo-status { grid-column: 1 / -1; min-height: 24px; margin: -4px 0 0; color: #fff; font-size: 14px; }
      .rotf-demo-status[data-state='error'] { color: #ffd2cd; }
      .rotf-demo-status[data-state='success'] { color: #d8f4cf; }
      .rotf-demo-whatsapp { display: flex; align-items: center; gap: 15px; width: 100%; margin-top: 34px; border: 1px solid rgba(255,255,255,.24); border-radius: 16px; padding: 17px 18px; color: #fff !important; background: #1f7a4a; text-decoration: none !important; box-shadow: 0 12px 34px rgba(0,0,0,.16); touch-action: manipulation; }
      .rotf-demo-whatsapp:hover { background: #238b55; }
      .rotf-demo-whatsapp:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
      .rotf-demo-whatsapp svg { flex: 0 0 38px; width: 38px; height: 38px; fill: currentColor; }
      .rotf-demo-whatsapp span { display: grid; gap: 2px; min-width: 0; }
      .rotf-demo-whatsapp strong { color: #fff; font-size: 16px; }
      .rotf-demo-whatsapp small { color: #e9fff2; font-size: 14px; font-weight: 400; }
      @media (max-width: 620px) { .rotf-demo-contact { padding-top: 58px; } .rotf-demo-form { grid-template-columns: 1fr; gap: 16px; } .rotf-demo-field--wide, .rotf-demo-submit, .rotf-demo-status { grid-column: 1; } .rotf-demo-whatsapp { align-items: flex-start; } }
      @media (prefers-reduced-motion: reduce) { .rotf-demo-contact *, .rotf-demo-contact *::before, .rotf-demo-contact *::after { scroll-behavior: auto !important; transition: none !important; } }
    `;
    document.head.appendChild(style);

    var section = document.createElement('section');
    section.className = 'rotf-demo-contact';
    section.setAttribute('aria-labelledby', 'rotf-demo-title');
    section.innerHTML = `
      <div class="rotf-demo-contact__inner">
        <p class="rotf-demo-contact__brand">ROTF STUDIO</p>
        <h2 id="rotf-demo-title">¿Te gustó esta invitación?</h2>
        <p class="rotf-demo-contact__description">Personaliza este diseño con tus nombres, fotografías y datos.</p>
        <p class="rotf-demo-contact__note">Esta es una demostración. Los nombres, fotografías, colores y datos pueden personalizarse.</p>
        <form class="rotf-demo-form" novalidate>
          <label class="rotf-demo-field">Nombre del cliente<input name="clientName" type="text" autocomplete="name" minlength="2" maxlength="120" required></label>
          <label class="rotf-demo-field">Número de WhatsApp<input name="clientWhatsapp" type="tel" inputmode="tel" autocomplete="tel" maxlength="30" placeholder="Ej. 618 123 4567" required></label>
          <label class="rotf-demo-field">Tipo de evento<select name="eventType" required><option value="">Selecciona una opción</option><option>Boda</option><option>XV años</option><option>Bautizo</option><option>Primera comunión</option><option>Cumpleaños</option><option>Otro</option></select></label>
          <label class="rotf-demo-field">Fecha del evento<input name="eventDate" type="date" required></label>
          <label class="rotf-demo-field rotf-demo-field--wide">Comentarios opcionales<textarea name="comments" maxlength="600" placeholder="Cuéntanos qué te gustaría personalizar"></textarea></label>
          <button class="rotf-demo-submit" type="submit">Solicitar esta invitación</button>
          <p class="rotf-demo-status" role="status" aria-live="polite"></p>
        </form>
        <a class="rotf-demo-whatsapp" href="#" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27.3 4.6A15.4 15.4 0 0 0 3.1 23.2L1 31l8-2.1A15.5 15.5 0 0 0 16 30h.1A15.5 15.5 0 0 0 27.3 4.6ZM16.1 27.4c-2.4 0-4.7-.6-6.7-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5a12.8 12.8 0 1 1 10.9 6Zm7-9.6c-.4-.2-2.3-1.1-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.2 1.5-.2.3-.5.3-.9.1-2.3-1.1-3.8-2-5.4-4.6-.4-.7.4-.7 1.2-2.2.1-.3.1-.5 0-.7l-1.2-3c-.3-.8-.7-.7-.9-.7h-.8c-.3 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.4s1.5 4 1.7 4.2c.2.3 2.9 4.4 7 6.2 2.6 1.1 3.6 1.2 4.9 1 .8-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.4-.3-.8-.5Z"/></svg>
          <span><strong>¿Prefieres escribirnos directamente?</strong><small>Cuéntanos por WhatsApp que te interesó ${escapeHtml(invitationName)}.</small></span>
        </a>
      </div>`;
    document.body.appendChild(section);

    var demoUrl = window.location.href;
    var directText = encodeURIComponent('Hola, me interesó el diseño de la invitación "' + invitationName + '". La vi aquí: ' + demoUrl);
    section.querySelector('.rotf-demo-whatsapp').href = 'https://wa.me/' + whatsappNumber + '?text=' + directText;

    var form = section.querySelector('.rotf-demo-form');
    var submit = section.querySelector('.rotf-demo-submit');
    var status = section.querySelector('.rotf-demo-status');

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      status.textContent = '';
      status.removeAttribute('data-state');
      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var payload = {
        clientName: String(data.get('clientName') || '').trim(),
        clientWhatsapp: String(data.get('clientWhatsapp') || '').trim(),
        eventType: String(data.get('eventType') || ''),
        eventDate: String(data.get('eventDate') || ''),
        comments: String(data.get('comments') || '').trim(),
        invitationName: invitationName,
        demoUrl: demoUrl
      };

      submit.disabled = true;
      submit.textContent = 'Guardando solicitud…';
      try {
        var response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('request_failed');
        status.dataset.state = 'success';
        status.textContent = 'Solicitud guardada correctamente. Nos pondremos en contacto contigo.';
        form.reset();
      } catch (error) {
        status.dataset.state = 'error';
        status.textContent = 'No pudimos guardar tu solicitud. Inténtalo nuevamente en un momento.';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Solicitar esta invitación';
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
