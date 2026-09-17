/* JavaScript puro. Sin fetch ni módulos: funciona también abriendo index.html. */
(() => {
  'use strict';
  const C = window.INVITATION_CONFIG;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intro = $('#intro'), app = $('#app'), introVideo = $('#intro-video'), background = $('#background-video');
  let active = 'menu', switching = false, started = false, videoPaused = false, menuScrollY = 0;
  let introMusicStarted = false;
  let gameTimer, celebrationTimer, gameBusy = false, goals = 0, attempts = 0;
  const memoriesUnlocked = new Set();
  const wait = ms => new Promise(resolve => setTimeout(resolve, reduced.matches ? 0 : ms));
  const icon = name => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const textNode = (tag, text, className) => { const el = document.createElement(tag); el.textContent = text; if (className) el.className = className; return el; };
  const safePlay = video => video.play().catch(() => {});

  // Audio: los archivos personales son opcionales. La síntesis local sirve de respaldo.
  const audio = {
    context: null, enabled: false, timer: null, music: null, media: new Set(), beat: 0,
    init() {
      if (!this.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.context = new AudioContext();
      }
      this.context?.resume().catch(() => {});
    },
    tone(frequency, duration = .12, delay = 0, volume = .07, type = 'sine') {
      if (!this.enabled || !this.context || this.context.state !== 'running') return;
      const time = this.context.currentTime + delay;
      const osc = this.context.createOscillator(), gain = this.context.createGain();
      osc.type = type; osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume * Math.max(0, Math.min(1, C.audio.volume)), time + .025);
      gain.gain.exponentialRampToValueAtTime(.0001, time + duration);
      osc.connect(gain); gain.connect(this.context.destination);
      osc.start(time); osc.stop(time + duration + .05);
      osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    },
    generatedEffect(kind) {
      const notes = { click: [520], unlock: [523,659,784], goal: [392,523,659,784], celebration: [523,659,784,1047,784,1047] }[kind] || [520];
      notes.forEach((note, i) => this.tone(note, .24, i * .10, .6, 'triangle'));
    },
    effect(kind) {
      if (!this.enabled) return;
      if (!C.audio[kind]) return this.generatedEffect(kind);
      const clip = new Audio(C.audio[kind]); clip.volume = Math.min(1, C.audio.volume * 3);
      this.media.add(clip);
      const cleanup = () => this.media.delete(clip);
      clip.addEventListener('ended', cleanup, { once: true });
      clip.play().catch(() => { cleanup(); this.generatedEffect(kind); });
    },
    synthMusic() {
      if (this.timer || !this.enabled) return;
      const playChord = () => {
        if (document.hidden || !this.enabled) return;
        const chord = [[130.81,196,261.63],[110,164.81,220],[87.31,130.81,174.61],[98,146.83,196]][this.beat++ % 4];
        chord.forEach((n, i) => this.tone(n, 2.7, i * .12, .14));
        this.tone(chord[2] * 2, 1.1, .6, .12);
      };
      playChord(); this.timer = setInterval(playChord, 3100);
    },
    ensureMusic() {
      if (!C.audio.music) return null;
      if (!this.music) {
        this.music = $('#background-music') || new Audio();
        if (this.music.getAttribute('src') !== C.audio.music) this.music.src = C.audio.music;
        this.music.loop = true;
        this.music.preload = 'auto';
        this.music.volume = Math.max(0, Math.min(1, C.audio.volume));
      }
      return this.music;
    },
    tryAutoplay() {
      const music = this.ensureMusic();
      if (!music) return;
      this.enabled = true;
      music.play().then(() => { introMusicStarted = true; this.syncToggle(); }).catch(() => {
        // Respaldo para navegadores que bloquean sonido antes del primer gesto.
        this.enabled = false;
        this.syncToggle();
        $('#start small').textContent = 'TOCA PARA ACTIVAR LA CANCIÓN';
      });
    },
    syncToggle() {
      const toggle = $('#music-toggle');
      if (!toggle) return;
      toggle.setAttribute('aria-pressed', String(this.enabled));
      toggle.setAttribute('aria-label', this.enabled ? 'Silenciar canción' : 'Activar canción');
      $('use', toggle).setAttribute('href', this.enabled ? '#i-sound' : '#i-mute');
    },
    setEnabled(enabled) {
      this.enabled = enabled;
      const toggle = $('#music-toggle');
      this.syncToggle();
      if (enabled) {
        this.init();
        if (C.audio.music) {
          this.ensureMusic();
          this.music.play().catch(() => this.synthMusic());
        } else this.synthMusic();
      } else {
        clearInterval(this.timer); this.timer = null; this.music?.pause();
        this.media.forEach(clip => clip.pause()); this.media.clear();
        this.context?.suspend().catch(() => {});
      }
    }
  };

  // Aplicar configuración sin interpretar texto personalizable como HTML.
  $$('[data-config]').forEach(el => { const value = C[el.dataset.config]; if (value !== undefined) el.textContent = value; });
  $('#player-photo').src = C.photo || 'assets/player-placeholder.svg';
  $('#player-photo').alt = C.photoAlt || `Fotografía de ${C.name}`;
  $('#player-city').textContent = C.city;
  if (C.flag) { const flag = new Image(); flag.src = C.flag; flag.alt = 'Bandera del jugador'; $('#player-city').prepend(flag); }
  if (C.introVideo) { introVideo.src = C.introVideo; }
  background.dataset.src = C.backgroundVideo;
  $('#stats-message').textContent = C.statsMessage;
  $('#final-message').textContent = C.finalMessage;
  $('#final-mission').textContent = C.finalMission;
  // Si una foto personalizada falta, usar un placeholder local sin bucles de error.
  document.addEventListener('error', event => {
    const el = event.target;
    if (el instanceof HTMLImageElement && !el.dataset.fallback) {
      el.dataset.fallback = 'true';
      el.src = el.id === 'player-photo' ? 'assets/player-placeholder.svg' : 'assets/memory-placeholder.svg';
    }
  }, true);
  safePlay(introVideo);
  Object.entries(C.stats).forEach(([label, rawValue]) => {
    const value = Math.max(0, Math.min(100, Number(rawValue) || 0));
    const row = textNode('div', '', 'stat');
    const top = textNode('div', '', 'stat-label'); top.append(textNode('span', label), textNode('b', value));
    const track = textNode('div', '', 'bar-track'); track.setAttribute('role', 'meter'); track.setAttribute('aria-label', label);
    track.setAttribute('aria-valuemin', '0'); track.setAttribute('aria-valuemax', '100'); track.setAttribute('aria-valuenow', value);
    const fill = textNode('div', '', 'bar-fill'); fill.dataset.value = value; track.append(fill); row.append(top, track); $('#stats-bars').append(row);
  });
  const celebrationStat = textNode('div', '', 'stat-celebration'); celebrationStat.append(textNode('span', 'Celebración'), textNode('strong', C.celebrationStat)); $('#stats-bars').append(celebrationStat);
  $$('.memory').forEach((card, index) => {
    const override = C.memories[index] || {};
    if (override.image) $('.memory-content img', card).src = override.image;
    if (override.title) { $('.memory-content h3', card).textContent = override.title; $('.memory-lock strong', card).textContent = override.title; }
    if (override.message) $('.memory-content p', card).textContent = override.message;
    const button = $('.memory-lock', card), content = $('.memory-content', card);
    content.id = `memory-${index}`; button.setAttribute('aria-controls', content.id);
    button.addEventListener('click', async () => {
      if (!memoriesUnlocked.has(index)) { memoriesUnlocked.add(index); audio.effect('unlock'); }
      const open = button.getAttribute('aria-expanded') !== 'true';
      if (open) {
        content.hidden = false;
        content.classList.remove('closing');
        content.classList.add('opening');
      } else {
        content.classList.remove('opening');
        content.classList.add('closing');
        await wait(320);
        content.hidden = true;
        content.classList.remove('closing');
      }
      button.setAttribute('aria-expanded', String(open)); card.classList.add('unlocked');
      button.style.minHeight = '110px'; $('svg', button).style.display = 'none';
      $('small', button).textContent = open ? 'DESBLOQUEADO · TOCA PARA CERRAR' : 'DESBLOQUEADO · TOCA PARA VER';
      $('#story-progress').textContent = `${memoriesUnlocked.size} / 5 desbloqueados`;
    });
  });

  const dialog = $('#reward-dialog');
  function showDialog(title, content, label = 'RECONOCIMIENTO DESBLOQUEADO') {
    $('#dialog-title').textContent = title; $('.eyebrow', dialog).textContent = label;
    $('#dialog-content').replaceChildren(content); dialog.showModal();
  }
  function closeDialog() { $$('video', dialog).forEach(v => v.pause()); dialog.close(); }
  $('#close-dialog').addEventListener('click', closeDialog);
  dialog.addEventListener('close', () => $$('video', dialog).forEach(v => v.pause()));
  $('#dialog-home').addEventListener('click', () => { closeDialog(); showSection('menu'); });
  C.trophies.forEach((trophy, index) => {
    const button = document.createElement('button'); button.className = 'trophy'; button.type = 'button';
    button.innerHTML = icon(index === 3 ? 'ball' : 'trophy');
    button.append(textNode('strong', trophy.title), textNode('small', 'TOCA PARA DESBLOQUEAR'));
    button.addEventListener('click', () => {
      button.classList.remove('unlocked'); void button.offsetWidth; button.classList.add('unlocked');
      $('small', button).textContent = 'PREMIO DESBLOQUEADO'; audio.effect('unlock');
      showDialog(trophy.title, textNode('p', trophy.message));
    });
    $('#trophy-grid').append(button);
  });

  // Entrada y cambio de pantalla: la música no se reinicia porque no se recarga el documento.
  async function startExperience() {
    if (switching || started) return;
    started = true; switching = true; audio.setEnabled(true);
    background.src = background.dataset.src; background.muted = true;
    if (!videoPaused) safePlay(background);
    app.hidden = false; app.classList.add('arriving'); intro.classList.add('departing');
    await wait(720); intro.hidden = true; introVideo.pause();
    intro.classList.remove('departing'); app.classList.remove('arriving'); switching = false;
    $('#menu-title').focus({ preventScroll: true });
  }
  function activateIntro() {
    const music = audio.ensureMusic();
    if (music && !introMusicStarted) {
      introMusicStarted = true;
      audio.setEnabled(true);
      $('#start small').textContent = 'PRESIONA DE NUEVO PARA ENTRAR';
      return;
    }
    startExperience();
  }
  intro.addEventListener('click', activateIntro);
  intro.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateIntro();
    }
  });
  // Intenta iniciar la canción al cargar. Si el navegador la bloquea, el
  // primer clic en cualquier parte de la portada la inicia junto con START.
  audio.tryAutoplay();
  async function showSection(id) {
    if (switching || !started || !document.getElementById(id)?.classList.contains('screen')) return;
    if (id === active) { window.scrollTo(0, 0); return; }
    switching = true; cancelShot(); const previous = document.getElementById(active);
    if (active === 'menu') menuScrollY = window.scrollY;
    previous.classList.add('leaving'); await wait(190); previous.hidden = true; previous.classList.remove('leaving');
    active = id; const section = document.getElementById(id); section.hidden = false;
    $('#breadcrumb').textContent = id === 'menu' ? 'MENÚ PRINCIPAL' : $('[data-section="' + id + '"] strong').textContent;
    window.scrollTo(0, id === 'menu' ? menuScrollY : 0);
    $('h1,h2', section)?.focus({ preventScroll: true });
    if (id === 'menu') {
      $$('.menu-card').forEach((card, index) => {
        card.style.setProperty('--card-delay', `${index * 45}ms`);
        card.classList.remove('card-return');
        void card.offsetWidth;
        card.classList.add('card-return');
      });
    }
    if (id === 'stats') {
      $$('.bar-fill').forEach(bar => bar.style.width = '0');
      requestAnimationFrame(() => requestAnimationFrame(() => $$('.bar-fill').forEach(bar => bar.style.width = `${bar.dataset.value}%`)));
    }
    if (id === 'final') { $('#completion').hidden = false; $('#letter').hidden = true; }
    switching = false;
  }
  $$('[data-section]').forEach(button => button.addEventListener('click', async () => {
    if (switching) return;
    button.classList.add('card-selected');
    await wait(300);
    await showSection(button.dataset.section);
    button.classList.remove('card-selected');
  }));
  $$('[data-home]').forEach(button => button.addEventListener('click', () => showSection('menu')));
  $('#exit-intro').addEventListener('click', async () => {
    if (switching) return;
    if (active !== 'menu') await showSection('menu');
    started = false; introMusicStarted = false; cancelShot(); background.pause(); audio.setEnabled(false);
    app.hidden = true; intro.hidden = false; safePlay(introVideo); intro.focus();
  });
  $('#music-toggle').addEventListener('click', () => audio.setEnabled(!audio.enabled));
  $('#video-toggle').addEventListener('click', () => {
    videoPaused = !videoPaused;
    if (videoPaused) background.pause(); else safePlay(background);
    $('#video-toggle').textContent = videoPaused ? 'Reanudar fondo' : 'Pausar fondo';

    $('#video-toggle').setAttribute('aria-pressed', String(videoPaused));
  });
  const rsvpButton = $('#rsvp-button'), rsvpStatus = $('#rsvp-status'), rsvpName = $('#rsvp-name');
  const cleanGuestName = () => rsvpName.value.trim().replace(/\s+/g, ' ').slice(0, 40);
  function renderRsvp(confirmed) {
    const guestName = cleanGuestName().toUpperCase();
    rsvpButton.classList.toggle('confirmed', confirmed);
    rsvpButton.setAttribute('aria-pressed', String(confirmed));
    rsvpButton.hidden = confirmed;
    rsvpName.disabled = confirmed;
    $('span', rsvpButton).textContent = confirmed
      ? `${guestName} · ASISTENCIA CONFIRMADA`
      : 'CONFIRMAR ASISTENCIA';
    rsvpStatus.textContent = confirmed
      ? `✓ ${guestName}, TU ASISTENCIA ESTÁ CONFIRMADA · NOS VEMOS EN LA FIESTA`
      : '';
    rsvpStatus.hidden = !confirmed;
  }
  let rsvpConfirmed = false;
  try {
    const storedName = localStorage.getItem('cr7-rsvp-name') || '';
    rsvpConfirmed = localStorage.getItem('cr7-rsvp-confirmed') === 'true' && Boolean(storedName.trim());
    rsvpName.value = rsvpConfirmed ? storedName : '';
    if (!rsvpConfirmed) localStorage.removeItem('cr7-rsvp-name');
  } catch {}
  renderRsvp(rsvpConfirmed);
  rsvpButton.addEventListener('click', () => {
    if (!rsvpConfirmed && !cleanGuestName()) {
      rsvpStatus.textContent = 'ESCRIBE TU NOMBRE PARA CONFIRMAR TU ASISTENCIA.';
      rsvpStatus.hidden = false;
      rsvpName.focus();
      return;
    }
    rsvpConfirmed = true;
    try {
      rsvpName.value = cleanGuestName();
      localStorage.setItem('cr7-rsvp-name', rsvpName.value);
      localStorage.setItem('cr7-rsvp-confirmed', 'true');
    } catch {}
    renderRsvp(rsvpConfirmed);
    if (rsvpConfirmed) { audio.effect('unlock'); confetti(); }
  });
  rsvpName.addEventListener('input', () => {
    if (!rsvpConfirmed) rsvpStatus.hidden = true;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { introVideo.pause(); background.pause(); audio.music?.pause(); audio.context?.suspend().catch(() => {}); }
    else {
      if (!started) safePlay(introVideo); else if (!videoPaused) safePlay(background);
      if (audio.enabled) { audio.context?.resume().catch(() => {}); if (audio.music) audio.music.play().catch(() => audio.synthMusic()); }
    }
  });
  document.addEventListener('click', event => { if (event.target.closest('button') && !event.target.closest('#start')) audio.effect('click'); });

  // Inclinación suave, sin bloquear el desplazamiento táctil.
  const playerCard = $('#player-card');
  playerCard.addEventListener('pointermove', event => {
    if (reduced.matches) return;
    const r = playerCard.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - .5, y = (event.clientY - r.top) / r.height - .5;
    playerCard.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg)`;
  });
  playerCard.addEventListener('pointerdown', () => { if (!reduced.matches) playerCard.style.transform = 'perspective(900px) rotateX(4deg) rotateY(-5deg)'; });
  ['pointerleave','pointerup','pointercancel','blur'].forEach(event => playerCard.addEventListener(event, () => playerCard.style.transform = 'none'));

  function confetti() {
    if (reduced.matches) return;
    const root = $('#confetti'); root.replaceChildren();
    const colors = ['#e9c976','#fff3c2','#d4a349','#f6f4e8'];
    for (let i = 0; i < 65; i++) {
      const piece = textNode('i', '', 'confetti-piece');
      piece.style.left = `${Math.random() * 100}%`; piece.style.background = colors[i % colors.length];
      piece.style.setProperty('--drift', `${Math.random() * 160 - 80}px`); piece.style.animationDelay = `${Math.random() * .4}s`;
      piece.addEventListener('animationend', () => piece.remove(), { once: true }); root.append(piece);
    }
  }
  const ball = $('#football'), keeper = $('#keeper');
  function cancelShot() {
    clearTimeout(gameTimer); gameBusy = false;
    $$('[data-shot]').forEach(b => b.disabled = false); ball.style.transform = 'none'; keeper.style.transform = 'none';
    if ($('#game-result').textContent === 'Disparando…') $('#game-result').textContent = 'Elige una dirección para volver a intentarlo.';
  }
  $$('[data-shot]').forEach(button => button.addEventListener('click', () => {
    if (gameBusy) return;
    gameBusy = true; $$('[data-shot]').forEach(b => b.disabled = true);
    ball.style.transition = 'none'; keeper.style.transition = 'none'; ball.style.transform = 'none'; keeper.style.transform = 'none';
    void ball.offsetWidth; ball.style.transition = ''; keeper.style.transition = '';
    const direction = button.dataset.shot, keeperDirection = ['left','center','right'][Math.floor(Math.random() * 3)];
    const width = $('#pitch').clientWidth, offset = { left: -width * .29, center: 0, right: width * .29 };
    const won = direction !== keeperDirection;
    // El tiro y la atajada comparten destino para que el resultado coincida con la animación.
    const targetY = 82 - ball.offsetTop;
    ball.style.transform = `translate(${offset[direction]}px,${targetY}px) scale(.55) rotate(340deg)`;
    keeper.style.transform = `translateX(${offset[keeperDirection]}px) rotate(${keeperDirection === 'left' ? -35 : keeperDirection === 'right' ? 35 : 0}deg)`;
    $('#game-result').textContent = 'Disparando…';
    gameTimer = setTimeout(() => {
      attempts++; $('#attempts').textContent = attempts;
      if (won) {
        goals++; $('#goals').textContent = goals; $('#game-result').textContent = '¡GOOOOL! Recompensa desbloqueada.';
        $('#open-reward').hidden = false; audio.effect('goal'); confetti();
      } else { $('#game-result').textContent = '¡Atajado! Elige otra dirección y vuelve a intentarlo.'; }
      gameBusy = false; $$('[data-shot]').forEach(b => b.disabled = false);
    }, reduced.matches ? 30 : 740);
  }));
  $('#open-reward').addEventListener('click', () => {
    const reward = C.reward, content = document.createElement('div'); content.append(textNode('p', reward.message));
    if (reward.type === 'coupon') content.append(textNode('div', reward.code, 'coupon-code'));
    if ((reward.type === 'image' || reward.type === 'video') && reward.src) {
      const media = document.createElement(reward.type === 'image' ? 'img' : 'video'); media.src = reward.src;
      if (reward.type === 'image') { media.alt = reward.title; media.loading = 'lazy'; }
      else { media.controls = true; media.playsInline = true; media.preload = 'metadata'; }
      media.addEventListener('error', () => content.append(textNode('p', 'Archivo no disponible. Puedes cambiar la ruta en config.js.')), { once: true });
      content.append(media);
    }
    showDialog(reward.title, content, 'RECOMPENSA DESBLOQUEADA');
  });
  $('#read-letter').addEventListener('click', async () => {
    $('#completion').classList.add('leaving'); await wait(220); $('#completion').hidden = true; $('#completion').classList.remove('leaving');
    $('#letter').hidden = false; $('#letter h3').focus({ preventScroll: true }); audio.effect('unlock');
  });
  $('#celebrate').addEventListener('click', () => {
    clearTimeout(celebrationTimer); $('#celebration-overlay').hidden = false; confetti(); audio.effect('celebration');
    celebrationTimer = setTimeout(() => $('#celebration-overlay').hidden = true, 2800);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !dialog.open) {
      $('#celebration-overlay').hidden = true;
      if (started && active !== 'menu') showSection('menu');
    }
  });
})();

