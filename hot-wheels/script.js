"use strict";

// PERSONALIZA AQUÍ. Se usa textContent para tratar los nombres siempre como texto.
const CONFIG = Object.freeze({
  nombre: "Chris Evans",
  remitente: "Yazmin", // Usa "" para ocultar la firma de la portada.
});

// SECCIÓN 2 · PERSONALIZA AQUÍ los juegos, las fotos y los mensajes de cada parada.
// photo: ruta de la foto · alt: descripción · objectPosition: encuadre horizontal / vertical.
// Para fotos propias usa credit: null. Conserva los créditos de las fotos de muestra.
// Conserva id y point: ubican cada parada sobre la carretera del mapa.
const ROUTE_STOPS = Object.freeze([
  {
    id: "aventuras",
    title: "Aventuras",
    tag: "UN DESVÍO CONTIGO",
    hint: "Lleva el carrito por toda la carretera hasta la bandera sin salirte: si te sales, vuelves al último punto. ¿Muy difícil? Toca «Avanzar» varias veces.",
    point: { x: 98, y: 310 },
    reveal: {
      message: "Contigo, hasta el camino más inesperado se vuelve una aventura",
      photo: "assets/chris-aventuras.jpg",
      alt: "Chris Evans con barba y traje azul, sonriendo durante una visita al Capitolio en 2019.",
      objectPosition: "50% 22%",
      credit: {
        author: "Oficina de Don Young · Cámara de Representantes de EE. UU.",
        source: "https://commons.wikimedia.org/wiki/File:Chris_Evans_in_2019.jpg",
        license: "Dominio público",
        licenseUrl: "https://commons.wikimedia.org/wiki/File:Chris_Evans_in_2019.jpg#Licensing",
      },
    },
  },
  {
    id: "recuerdos",
    title: "Recuerdos",
    tag: "UNA CANCIÓN PARA TI",
    hint: "Elige una tarjeta: la canción que descubras es la que te dedico.",
    point: { x: 272, y: 212 },
    // Tres tarjetas, una canción en cada una. La tarjeta que se abra decide qué canción se dedica.
    // youtube: el identificador del video (lo que va después de "watch?v=" en el enlace de YouTube).
    // audio: opcional. Si guardas un MP3 en assets (p. ej. "assets/perfect.mp3"), suena ese archivo en lugar de YouTube.
    // dedication: una frase corta tuya sobre la canción.
    // lyric: la frase de la letra que se destaca (line, en inglés) y su traducción.
    songs: [
      { title: "Perfect", artist: "Ed Sheeran", youtube: "2Vv-BfVoq4g", audio: "assets/perfect.mp3", dedication: "Porque a tu lado todo se siente perfecto.",
        lyric: { line: "I found a love for me", translation: "Encontré un amor para mí" } },
      { title: "Yellow", artist: "Coldplay", youtube: "yKNxeF4KMsY", audio: "assets/yellow.mp3", dedication: "Porque contigo hasta el cielo brilla distinto.",
        lyric: { line: "Look how they shine for you", translation: "Mira cómo brillan por ti" } },
      { title: "Thinking Out Loud", artist: "Ed Sheeran", youtube: "lp-EO5I60KA", audio: "assets/thinking-out-loud.mp3", dedication: "Para seguir eligiéndote hoy y dentro de muchos años.",
        lyric: { line: "We found love right where we are", translation: "Encontramos el amor justo donde estamos" } },
    ],
    reveal: {
      message: "Hay momentos a tu lado que quisiera guardar para siempre",
      photo: "assets/chris-recuerdos.jpg",
      alt: "Chris Evans con chaqueta oscura y camiseta blanca en el Festival de Cine de Toronto de 2014.",
      objectPosition: "50% 24%",
      credit: {
        author: "Gordon Correll",
        source: "https://commons.wikimedia.org/wiki/File:Chris_Evans_(15472529775).jpg",
        license: "CC BY-SA 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
      },
    },
  },
  {
    id: "lo-que-viene",
    title: "Lo que viene",
    tag: "NUESTRO PRÓXIMO CAPÍTULO",
    hint: "El camino se divide y cada rumbo esconde un plan sorpresa. Solo puedes elegir uno, ¡así que elige bien!",
    chooseOnce: true, // La elección es definitiva: la parada no se puede volver a jugar.
    point: { x: 104, y: 112 },
    // Dos rumbos sorpresa: el plan (label) solo se ve al elegirlo. Cada uno tiene su frase e imagen.
    choices: [
      {
        label: "Noche de cine",
        message: "Palomitas, una buena película y tú: no se me ocurre mejor plan",
        photo: "assets/cine.svg",
        alt: "Ilustración de una sala de cine con cortinas rojas, una pantalla que dice «Estreno: Nosotros» y palomitas.",
        objectPosition: "50% 45%",
        credit: null,
      },
      {
        label: "Picnic juntos",
        message: "Una manta, el sol y tú: no necesito nada más para un día perfecto",
        photo: "assets/picnic.svg",
        alt: "Ilustración de un picnic: manta a cuadros, canasta, dos copas y un árbol bajo el sol.",
        objectPosition: "50% 60%",
        credit: null,
      },
    ],
  },
]);

// EFECTOS DE SONIDO · Se generan en el navegador (Web Audio), sin archivos extra.
// El botón de sonido de la esquina los apaga o enciende; la preferencia se recuerda en este navegador.
const SFX = (() => {
  const toggle = document.querySelector("#sound-toggle");
  let context = null;
  let enabled = true;
  try { enabled = window.localStorage.getItem("entrega-sonido") !== "off"; } catch { /* sin almacenamiento */ }

  function ready() {
    if (!enabled) return null;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    context ??= new AudioContextClass();
    if (context.state === "suspended") context.resume();
    return context;
  }

  function tone({ frequency = 440, to = frequency, type = "sine", duration = 0.12, volume = 0.12, delay = 0, filter = 0 }) {
    const audio = ready();
    if (!audio) return;
    const start = audio.currentTime + delay;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(to, 1), start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.02, duration / 4));
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    let node = oscillator;
    if (filter) {
      const lowpass = audio.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = filter;
      oscillator.connect(lowpass);
      node = lowpass;
    }
    node.connect(gain).connect(audio.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  function noise({ duration = 0.2, volume = 0.08, from = 800, to = 3000, delay = 0 }) {
    const audio = ready();
    if (!audio) return;
    const start = audio.currentTime + delay;
    const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * duration), audio.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
    const source = audio.createBufferSource();
    source.buffer = buffer;
    const band = audio.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.setValueAtTime(from, start);
    band.frequency.exponentialRampToValueAtTime(to, start + duration);
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(band).connect(gain).connect(audio.destination);
    source.start(start);
  }

  const notes = (list, gap, options) => list.forEach((frequency, index) => tone({ frequency, delay: index * gap, ...options }));

  const sounds = {
    tap: () => tone({ frequency: 900, to: 1200, duration: 0.06, volume: 0.07, type: "triangle" }),
    light: () => tone({ frequency: 440, duration: 0.18, volume: 0.1, type: "square", filter: 1800 }),
    go: () => tone({ frequency: 880, duration: 0.35, volume: 0.12, type: "square", filter: 2400 }),
    // Motor: sube de revoluciones y baja al llegar.
    engine: (seconds = 1) => {
      tone({ frequency: 55, to: 120, type: "sawtooth", duration: seconds * 0.6, volume: 0.06, filter: 700 });
      tone({ frequency: 120, to: 70, type: "sawtooth", duration: seconds * 0.5, volume: 0.05, filter: 600, delay: seconds * 0.5 });
    },
    whoosh: () => noise({ duration: 0.45, volume: 0.09, from: 400, to: 4000 }),
    flip: () => noise({ duration: 0.16, volume: 0.1, from: 2500, to: 900 }),
    checkpoint: () => notes([988, 1319], 0.08, { duration: 0.12, volume: 0.07, type: "triangle" }),
    crash: () => {
      tone({ frequency: 180, to: 45, type: "square", duration: 0.35, volume: 0.1, filter: 900 });
      noise({ duration: 0.3, volume: 0.12, from: 1200, to: 200 });
    },
    chime: () => notes([523, 659, 784, 1047], 0.09, { duration: 0.4, volume: 0.07, type: "triangle" }),
    trail: () => tone({ frequency: 300, to: 900, duration: 0.5, volume: 0.04, type: "sine" }),
    fanfare: () => {
      notes([523, 659, 784], 0.12, { duration: 0.25, volume: 0.08, type: "square", filter: 2600 });
      notes([1047, 1319], 0.18, { duration: 0.6, volume: 0.08, type: "triangle", delay: 0.36 });
    },
  };

  function render() {
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.setAttribute("aria-label", enabled ? "Silenciar efectos de sonido" : "Activar efectos de sonido");
    toggle.classList.toggle("is-muted", !enabled);
  }
  toggle.addEventListener("click", () => {
    enabled = !enabled;
    try { window.localStorage.setItem("entrega-sonido", enabled ? "on" : "off"); } catch { /* sin almacenamiento */ }
    render();
    sounds.tap();
  });
  render();

  return new Proxy(sounds, { get: (target, name) => (...args) => { try { target[name]?.(...args); } catch { /* el sonido nunca bloquea la experiencia */ } } });
})();

(() => {
  const cover = document.querySelector("#section-1");
  const nextSection = document.querySelector("#section-2");
  const startButton = document.querySelector("#start-button");
  const startLabel = document.querySelector("#start-label");
  const panel = document.querySelector("#launch-panel");
  const message = document.querySelector("#launch-message");
  const status = document.querySelector("#experience-status");
  const racer = document.querySelector("#racer");
  const lights = [...document.querySelectorAll("[data-light]")];
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let phase = "idle";

  document.querySelectorAll("[data-recipient]").forEach((node) => {
    node.textContent = CONFIG.nombre.trim() || "[Nombre]";
  });
  document.querySelectorAll("[data-sender]").forEach((node) => {
    node.textContent = CONFIG.remitente;
  });
  document.querySelector("#sender-line").hidden = !CONFIG.remitente.trim();
  document.title = `${CONFIG.nombre.trim() || "[Nombre]"}, tienes una entrega especial`;

  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  function setSignal(color, text) {
    panel.dataset.signal = color;
    lights.forEach((light) => light.classList.toggle("is-on", light.dataset.light === color));
    message.textContent = text;
  }

  // La salida de la portada da paso al mapa de la sección 2.
  async function goToSection2() {
    phase = "transitioning";
    if (!motionPreference.matches) {
      cover.classList.add("is-departing");
      await wait(380);
    }

    cover.hidden = true;
    panel.hidden = true;
    nextSection.hidden = false;
    if (!motionPreference.matches) nextSection.classList.add("is-entering");

    document.querySelector("#section-2-title").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    phase = "complete";
    status.textContent = "Elige tu ruta. Tres paradas por descubrir.";

    // Inicializa el mapa solo después de mostrarlo.
    document.dispatchEvent(new CustomEvent("sorpresa:sectionchange", {
      detail: { from: 1, to: 2 },
    }));
  }

  async function startExperience() {
    // Bloqueo síncrono, antes de cualquier espera: clic, Enter y Espacio no duplican la secuencia.
    if (phase !== "idle") return;
    phase = "countdown";
    startButton.disabled = true;
    startButton.dataset.running = "true";
    startLabel.textContent = "ARRANCANDO…";
    cover.setAttribute("aria-busy", "true");
    // Oculta los controles de fondo a teclado y lectores de pantalla durante la salida.
    cover.querySelector(".masthead").inert = true;
    cover.querySelector(".hero").inert = true;
    panel.hidden = false;
    // Confirma el estado inicial antes de aplicar el fundido de entrada.
    void panel.offsetWidth;
    panel.classList.add("is-visible");

    status.textContent = "Preparando la salida.";
    SFX.tap();
    setSignal("red", "En tus marcas…");
    SFX.light();
    await wait(motionPreference.matches ? 300 : 700);
    setSignal("yellow", "Todo listo…");
    SFX.light();
    await wait(motionPreference.matches ? 300 : 650);
    setSignal("green", "Luz verde");
    SFX.go();

    if (!motionPreference.matches) {
      phase = "racing";
      racer.classList.add("is-racing");
      SFX.engine(0.9);
      SFX.whoosh();
    }
    await wait(motionPreference.matches ? 200 : 920);
    message.textContent = "¡Arrancamos!";
    status.textContent = "¡Arrancamos!";
    // Sin movimiento reducido: unos 3 s en total, con margen para leer el mensaje.
    // Con movimiento reducido: luces estáticas, sin desplazamientos ni fundidos.
    await wait(motionPreference.matches ? 450 : 550);
    cover.removeAttribute("aria-busy");
    await goToSection2();
  }

  startButton.addEventListener("click", startExperience);
  startButton.disabled = false;
})();


(() => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const section = document.querySelector("#section-2");
  const path = document.querySelector("#route-path");
  const car = document.querySelector("#route-car");
  const board = document.querySelector("#route-board");
  const trailsLayer = document.querySelector("#route-trails");
  const finishBadge = document.querySelector("#board-finish");
  const buttons = [...document.querySelectorAll("[data-stop]")];
  const dialog = document.querySelector("#stop-dialog");
  const card = document.querySelector("#stop-card");
  const closeButton = document.querySelector("#close-stop");
  const plays = [...document.querySelectorAll("[data-play]")];
  const photoFrame = document.querySelector("#stop-photo-frame");
  const photo = document.querySelector("#stop-photo");
  const photoFallback = document.querySelector("#photo-fallback");
  const eyebrow = document.querySelector("#stop-eyebrow");
  const hint = document.querySelector("#stop-hint");
  const revealPanel = document.querySelector("#stop-reveal");
  const replayButton = document.querySelector("#replay-stop");
  const live = document.querySelector("#stop-live");
  const routeNext = document.querySelector("#route-next");
  const continueButton = document.querySelector("#continue-route");
  const status = document.querySelector("#experience-status");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Color del tramo recorrido de cada parada y del último tramo hasta la meta.
  const TRAIL_COLORS = { aventuras: "#ff8a49", recuerdos: "#66c9ed", "lo-que-viene": "#e8d394", meta: "#f3f3ed" };
  const completed = new Set();
  const trailsDrawn = new Set();
  const lastReveal = new Map();
  const stopDistances = new Map();
  const segments = new Map();
  let length = 0;
  let currentDistance = 0;
  let state = "idle";
  let activeButton = null;
  let activeStop = null;
  let initialized = false;
  let finished = false;
  let summaryPending = false;
  let summarySeen = false;
  // Cada juego abierto recibe un número; las animaciones de un juego cerrado se descartan.
  let game = 0;
  let suppressBackdropUntil = 0;

  const reduced = () => motion.matches;
  const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

  // Anima de 0 a 1 con aceleración suave. Con movimiento reducido salta al final.
  function animate(duration, onFrame) {
    if (reduced()) {
      onFrame(1);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      let startedAt;
      function frame(now) {
        startedAt ??= now;
        // También responde si la preferencia cambia durante la animación.
        const progress = reduced() ? 1 : Math.min((now - startedAt) / duration, 1);
        onFrame((1 - Math.cos(Math.PI * progress)) / 2);
        if (progress < 1) window.requestAnimationFrame(frame);
        else resolve();
      }
      window.requestAnimationFrame(frame);
    });
  }

  function pose(pathElement, distance, total, direction = 1) {
    const point = pathElement.getPointAtLength(distance);
    const before = pathElement.getPointAtLength(Math.max(0, distance - 1));
    const after = pathElement.getPointAtLength(Math.min(total, distance + 1));
    const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI + 90 + (direction < 0 ? 180 : 0);
    return `translate(${point.x} ${point.y}) rotate(${angle})`;
  }

  function samplePath(pathElement, total, count = 300) {
    return Array.from({ length: count + 1 }, (_, index) => {
      const distance = total * index / count;
      return { distance, point: pathElement.getPointAtLength(distance) };
    });
  }

  function setButtonsDisabled(disabled) {
    buttons.forEach((button) => { button.disabled = disabled; });
  }

  /* ---------- Mapa principal ---------- */

  function placeCar(distance, direction = 1) {
    car.setAttribute("transform", pose(path, distance, length, direction));
    currentDistance = distance;
  }

  function travelTo(destination, onMove) {
    const origin = currentDistance;
    const direction = destination < origin ? -1 : 1;
    const duration = Math.min(1400, 620 + Math.abs(destination - origin) * 1.4);
    if (Math.abs(destination - origin) >= 1 && !reduced()) SFX.engine(duration / 1000);
    if (Math.abs(destination - origin) < 1) {
      placeCar(destination, direction);
      onMove?.(destination);
      return Promise.resolve();
    }
    return animate(duration, (eased) => {
      const distance = origin + (destination - origin) * eased;
      placeCar(distance, direction);
      onMove?.(distance);
    });
  }

  function createTrail(id, from, to) {
    const group = document.createElementNS(SVG_NS, "g");
    group.setAttribute("stroke", TRAIL_COLORS[id]);
    // Un brillo ancho y una línea firme sobre el centro de la carretera.
    [["11", ".2"], ["4", "1"]].forEach(([width, opacity]) => {
      const use = document.createElementNS(SVG_NS, "use");
      use.setAttribute("href", "#route-path");
      use.setAttribute("stroke-width", width);
      use.setAttribute("opacity", opacity);
      use.setAttribute("stroke-dashoffset", String(-from));
      group.append(use);
    });
    trailsLayer.append(group);
    segments.set(id, { from, to, group, amount: 0 });
    setTrail(id, 0);
  }

  function setTrail(id, amount) {
    const segment = segments.get(id);
    segment.amount = amount;
    segment.group.style.visibility = amount > 0 ? "visible" : "hidden";
    const drawn = (segment.to - segment.from) * amount;
    segment.group.querySelectorAll("use").forEach((use) => {
      use.setAttribute("stroke-dasharray", `${drawn} ${length * 2}`);
    });
  }

  function initializeRoute() {
    if (initialized) return;
    initialized = true;
    length = path.getTotalLength();
    // Calculamos la geometría una vez. SVG escala igual la carretera, el coche y las paradas.
    const samples = samplePath(path, length, 600);
    ROUTE_STOPS.forEach((stop) => {
      const nearest = samples.reduce((best, sample) => {
        const squaredDistance = (sample.point.x - stop.point.x) ** 2 + (sample.point.y - stop.point.y) ** 2;
        return squaredDistance < best.error ? { distance: sample.distance, error: squaredDistance } : best;
      }, { distance: 0, error: Infinity });
      stopDistances.set(stop.id, nearest.distance);
      // Las fotos se precargan al entrar al mapa, sin solicitudes externas.
      [stop.reveal, ...(stop.choices || [])].filter(Boolean).forEach((content) => {
        const preload = new Image();
        preload.src = content.photo;
      });
    });
    // Cada parada tiene su tramo: desde la parada anterior en la carretera hasta ella.
    let from = 0;
    [...ROUTE_STOPS].sort((a, b) => stopDistances.get(a.id) - stopDistances.get(b.id)).forEach((stop) => {
      createTrail(stop.id, from, stopDistances.get(stop.id));
      from = stopDistances.get(stop.id);
    });
    createTrail("meta", from, length);
    placeCar(0);
  }

  function markCompleted(stop) {
    completed.add(stop.id);
    const button = buttons.find((item) => item.dataset.stop === stop.id);
    button.classList.add("is-visited");
    button.setAttribute("aria-label", `${stop.title}, parada completada. Volver a abrir`);
    button.querySelector("[data-stop-caption]").textContent = "✓ PARADA COMPLETADA";
    document.querySelector(`[data-stamp="${stop.id}"]`).classList.add("is-visited");
    document.querySelector("#visited-count").textContent = completed.size;
    if (completed.size === ROUTE_STOPS.length && !finished) {
      document.querySelector("#route-progress-note").textContent = "¡Las tres! Ahora, rumbo a la meta.";
    }
  }

  async function selectStop(button) {
    // Ignora clics repetidos, selecciones durante el viaje y eventos de secciones ocultas.
    if (state !== "idle" || section.hidden) return;
    const stop = ROUTE_STOPS.find((item) => item.id === button.dataset.stop);
    if (!stop) return;
    initializeRoute();
    state = "traveling";
    activeButton = button;
    activeStop = stop;
    setButtonsDisabled(true);
    continueButton.disabled = true;
    board.setAttribute("aria-busy", "true");
    status.textContent = `En camino a ${stop.title}.`;
    await travelTo(stopDistances.get(stop.id));
    board.removeAttribute("aria-busy");
    buttons.forEach((item) => item.removeAttribute("aria-current"));
    button.setAttribute("aria-current", "location");
    document.querySelector("#stop-title").textContent = stop.title;
    document.querySelector("#stop-serial").textContent = stop.tag;
    // Una parada completada se reabre en su foto; «Volver a jugar» repite el juego.
    if (completed.has(stop.id)) showReveal(stop, lastReveal.get(stop.id), false);
    else startGame(stop);
    playIntro(stop, button);
    state = "card";
    document.body.classList.add("dialog-open");
    dialog.showModal();
    SFX.whoosh();
    dialog.scrollTop = 0;
    closeButton.focus({ preventScroll: true });
  }

  async function closeCard() {
    if (state !== "card") return;
    state = "closing";
    if (!reduced()) {
      dialog.classList.add("is-closing");
      await wait(180);
    }
    // Habilita el origen antes de que el diálogo restaure el foco.
    setButtonsDisabled(false);
    continueButton.disabled = false;
    dialog.close();
  }

  // Al cerrar: el carrito se queda en la parada, se marca su tramo y, con las tres, sigue a la meta.
  async function afterClose() {
    const stop = activeStop;
    if (stop && completed.has(stop.id) && !trailsDrawn.has(stop.id)) {
      trailsDrawn.add(stop.id);
      SFX.trail();
      await animate(560, (eased) => setTrail(stop.id, eased));
      status.textContent = `Tramo de ${stop.title} recorrido. ${completed.size} de 3 paradas completadas.`;
    }
    if (completed.size === ROUTE_STOPS.length) await driveToFinish();
  }

  async function driveToFinish() {
    const firstArrival = !finished;
    board.setAttribute("aria-busy", "true");
    if (firstArrival) status.textContent = "¡Las tres paradas completadas! Rumbo a la meta.";
    await wait(reduced() ? 0 : 220);
    const meta = segments.get("meta");
    await travelTo(length, (distance) => {
      const amount = Math.min(1, Math.max(meta.amount, (distance - meta.from) / (meta.to - meta.from)));
      setTrail("meta", amount);
    });
    setTrail("meta", 1);
    board.removeAttribute("aria-busy");
    buttons.forEach((item) => item.removeAttribute("aria-current"));
    if (!firstArrival) return;
    finished = true;
    finishBadge.hidden = false;
    SFX.fanfare();
    finishBadge.disabled = false;
    routeNext.hidden = false;
    document.querySelector("#route-progress-note").textContent = "Nuestro recorrido, completo. ♡";
    status.textContent = "¡Llegaste a la meta! Aquí está el resumen de tu recorrido.";
    // Al llegar por primera vez, el resumen se abre solo; después se abre tocando ¡META!.
    summaryPending = true;
  }

  /* ---------- Tarjeta: juego y revelación ---------- */

  // Animación de entrada de cada parada: su símbolo, nombre y etiqueta pasan como una cortinilla.
  const intro = document.querySelector("#stop-intro");
  function playIntro(stop, button) {
    intro.querySelector(".stop-intro__icon").replaceChildren(button.querySelector(".route-stop__icon").cloneNode(true));
    intro.querySelector(".stop-intro__title").textContent = stop.title;
    intro.querySelector(".stop-intro__tag").textContent = stop.tag;
    intro.classList.remove("is-playing");
    if (reduced()) return;
    void intro.offsetWidth;
    intro.classList.add("is-playing");
  }

  const canPlay = (id) => state === "card" && card.dataset.mode === "play" && activeStop?.id === id;

  function startGame(stop) {
    game += 1;
    stopSong();
    card.dataset.mode = "play";
    card.dataset.stop = stop.id;
    card.classList.remove("is-revealing");
    plays.forEach((play) => { play.hidden = play.dataset.play !== stop.id; });
    photoFrame.hidden = true;
    revealPanel.hidden = true;
    hint.hidden = false;
    eyebrow.textContent = "TU MISIÓN";
    hint.textContent = stop.hint;
    dialog.setAttribute("aria-describedby", "stop-hint");
    live.textContent = "";
    if (stop.id === "aventuras") setupAdventure();
    else if (stop.id === "recuerdos") setupMemories(stop);
    else setupFork(stop);
  }

  function showReveal(stop, content, withAnimation) {
    lastReveal.set(stop.id, content);
    card.dataset.mode = "reveal";
    replayButton.hidden = Boolean(stop.chooseOnce);
    card.dataset.stop = stop.id;
    plays.forEach((play) => { play.hidden = true; });
    photoFrame.hidden = false;
    hint.hidden = true;
    revealPanel.hidden = false;
    eyebrow.textContent = "UN PEDACITO DE NUESTRA HISTORIA";
    document.querySelector("#stop-song").hidden = !content.song;
    if (content.song) {
      document.querySelector("#song-title").textContent = `«${content.song.title}»`;
      document.querySelector("#song-artist").textContent = content.song.artist;
      document.querySelector("#song-verse").textContent = content.song.dedication;
      document.querySelector("#song-lyric-line").textContent = `“${content.song.lyric.line}”`;
      document.querySelector("#song-lyric-translation").textContent = content.song.lyric.translation;
      // Al reabrir la parada, la canción queda lista para darle play.
      if (!songPlayer.childElementCount) playSong(content.song, false);
    }
    document.querySelector("#stop-message").textContent = `«${content.message}»`;
    dialog.setAttribute("aria-describedby", "stop-message");
    photo.hidden = false;
    photoFallback.hidden = true;
    photo.alt = content.alt;
    photo.style.objectPosition = content.objectPosition || "50% 25%";
    photo.src = content.photo;
    const credit = document.querySelector("#photo-credit");
    credit.open = false;
    credit.hidden = !content.credit;
    if (content.credit) {
      const source = document.querySelector("#photo-source");
      const license = document.querySelector("#photo-license");
      source.textContent = content.credit.author;
      source.href = content.credit.source;
      license.textContent = content.credit.license;
      license.href = content.credit.licenseUrl;
    }
    card.classList.remove("is-revealing");
    if (withAnimation && !reduced()) {
      void card.offsetWidth;
      card.classList.add("is-revealing");
    }
  }

  function completeStop(stop, content) {
    // Con canción, la música ya suena: la campanita se omite.
    if (!content.song) SFX.chime();
    showReveal(stop, content, true);
    markCompleted(stop);
    dialog.scrollTop = 0;
    // Los controles del juego se ocultan: el foco vuelve a un lugar visible.
    closeButton.focus({ preventScroll: true });
    live.textContent = `${stop.title}, parada completada.${content.song ? ` Te dedico «${content.song.title}», de ${content.song.artist}. ${content.song.dedication}` : ""} «${content.message}»`;
  }

  photo.addEventListener("error", () => {
    photo.hidden = true;
    photoFallback.hidden = false;
  });
  photo.addEventListener("load", () => {
    photo.hidden = false;
    photoFallback.hidden = true;
  });

  replayButton.addEventListener("click", () => {
    if (state !== "card" || !activeStop) return;
    startGame(activeStop);
    dialog.scrollTop = 0;
    const firstControl = plays.find((play) => !play.hidden)?.querySelector("button");
    (firstControl || closeButton).focus({ preventScroll: true });
  });

  /* Aventuras: arrastrar el carrito por una curva larga sin salirse, o tocar «Avanzar». */
  const ADVENTURE_TAPS = 6; // Toques de «Avanzar» para llegar a la bandera.
  const ADVENTURE_TOLERANCE = 24; // Qué tanto puede alejarse el dedo del centro de la carretera.
  const adventure = {
    scene: document.querySelector("#adventure-scene"),
    path: document.querySelector("#adventure-path"),
    car: document.querySelector("#adventure-car"),
    trail: document.querySelector("#adventure-trail"),
    step: document.querySelector("#adventure-step"),
    meter: document.querySelector("#adventure-meter"),
    toast: document.querySelector("#adventure-toast"),
    length: 0, start: 0, end: 0, progress: 0, samples: [], checkpoints: [],
    dragging: false, busy: false, done: false, toastTimer: 0,
  };

  function placeAdventure(distance) {
    adventure.progress = distance;
    adventure.car.setAttribute("transform", pose(adventure.path, distance, adventure.length));
    adventure.trail.setAttribute("stroke-dasharray", `${distance} ${adventure.length * 2}`);
    const amount = (distance - adventure.start) / (adventure.end - adventure.start);
    adventure.meter.style.width = `${Math.max(0, Math.min(1, amount)) * 100}%`;
    adventure.scene.querySelectorAll("[data-checkpoint]").forEach((dot) => {
      const passed = Number(dot.dataset.checkpoint) <= distance;
      if (passed && !dot.classList.contains("is-passed") && distance > adventure.start + 1) SFX.checkpoint();
      dot.classList.toggle("is-passed", passed);
    });
  }

  function setupAdventure() {
    if (!adventure.length) {
      adventure.length = adventure.path.getTotalLength();
      adventure.samples = samplePath(adventure.path, adventure.length, 500);
      // El trazo empieza fuera de la escena: el carrito arranca donde ya es visible.
      adventure.start = adventure.samples.find((sample) => sample.point.y <= 212).distance;
      adventure.end = adventure.length - 12;
      // Dos puntos de control: al salirse de la carretera, el carrito vuelve al último.
      const span = adventure.end - adventure.start;
      adventure.checkpoints = [adventure.start, adventure.start + span / 3, adventure.start + span * 2 / 3];
      const layer = document.querySelector("#adventure-checkpoints");
      adventure.checkpoints.slice(1).forEach((distance) => {
        const point = adventure.path.getPointAtLength(distance);
        const dot = document.createElementNS(SVG_NS, "circle");
        dot.setAttribute("cx", point.x);
        dot.setAttribute("cy", point.y);
        dot.setAttribute("r", "5");
        dot.dataset.checkpoint = String(distance);
        dot.classList.add("play__checkpoint");
        layer.append(dot);
      });
    }
    adventure.dragging = false;
    adventure.busy = false;
    adventure.done = false;
    adventure.step.disabled = false;
    adventure.toast.hidden = true;
    adventure.scene.classList.remove("is-done", "is-crashed", "is-dragging");
    placeAdventure(adventure.start);
  }

  async function finishAdventure() {
    if (adventure.done) return;
    adventure.done = true;
    adventure.dragging = false;
    adventure.step.disabled = true;
    adventure.scene.classList.add("is-done");
    placeAdventure(adventure.end);
    const token = game;
    await wait(reduced() ? 150 : 450);
    const stop = ROUTE_STOPS.find((item) => item.id === "aventuras");
    if (token === game && canPlay("aventuras")) completeStop(stop, stop.reveal);
  }

  async function crashAdventure(pointerId) {
    adventure.dragging = false;
    adventure.busy = true;
    if (adventure.scene.hasPointerCapture(pointerId)) adventure.scene.releasePointerCapture(pointerId);
    adventure.scene.classList.remove("is-dragging");
    adventure.scene.classList.add("is-crashed");
    SFX.crash();
    adventure.toast.hidden = false;
    live.textContent = "Te saliste de la carretera. Vuelves al último punto.";
    const token = game;
    const from = adventure.progress;
    const to = adventure.checkpoints.filter((distance) => distance <= from + 0.5).pop();
    await wait(reduced() ? 0 : 250);
    await animate(450, (eased) => {
      if (token === game) placeAdventure(from + (to - from) * eased);
    });
    adventure.scene.classList.remove("is-crashed");
    adventure.busy = false;
    window.clearTimeout(adventure.toastTimer);
    adventure.toastTimer = window.setTimeout(() => { adventure.toast.hidden = true; }, 900);
  }

  function scenePoint(event) {
    const matrix = adventure.scene.getScreenCTM().inverse();
    return new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix);
  }

  adventure.scene.addEventListener("pointerdown", (event) => {
    if (!canPlay("aventuras") || adventure.busy || adventure.done) return;
    const pointer = scenePoint(event);
    const carPoint = adventure.path.getPointAtLength(adventure.progress);
    // Se toma el carrito dentro de un círculo generoso, cómodo para un dedo.
    if (Math.hypot(pointer.x - carPoint.x, pointer.y - carPoint.y) > 44) return;
    event.preventDefault();
    adventure.scene.setPointerCapture(event.pointerId);
    adventure.dragging = true;
    adventure.toast.hidden = true;
    adventure.scene.classList.add("is-dragging");
  });

  adventure.scene.addEventListener("pointermove", (event) => {
    if (!adventure.dragging || !canPlay("aventuras")) return;
    const pointer = scenePoint(event);
    // Solo busca cerca de la posición actual: el carrito avanza por la carretera sin saltos.
    const nearest = adventure.samples.reduce((best, sample) => {
      if (sample.distance < adventure.progress - 20 || sample.distance > adventure.progress + 90) return best;
      const error = (sample.point.x - pointer.x) ** 2 + (sample.point.y - pointer.y) ** 2;
      return error < best.error ? { distance: sample.distance, error } : best;
    }, { distance: adventure.progress, error: Infinity });
    if (Math.sqrt(nearest.error) > ADVENTURE_TOLERANCE) {
      crashAdventure(event.pointerId);
      return;
    }
    // Avanza como mucho un tramo corto por movimiento, para que no haya atajos.
    if (nearest.distance > adventure.progress) placeAdventure(Math.min(nearest.distance, adventure.progress + 36, adventure.end));
    if (adventure.progress >= adventure.end - 4) finishAdventure();
  });

  function endDrag() {
    if (!adventure.dragging) return;
    adventure.dragging = false;
    adventure.scene.classList.remove("is-dragging");
    // Soltar fuera de la tarjeta no debe cerrarla.
    suppressBackdropUntil = performance.now() + 400;
  }
  adventure.scene.addEventListener("pointerup", endDrag);
  adventure.scene.addEventListener("pointercancel", endDrag);

  adventure.step.addEventListener("click", async () => {
    if (!canPlay("aventuras") || adventure.busy || adventure.done) return;
    adventure.busy = true;
    const token = game;
    const from = adventure.progress;
    const to = Math.min(adventure.end, from + (adventure.end - adventure.start) / ADVENTURE_TAPS + 1);
    SFX.engine(0.35);
    await animate(320, (eased) => {
      if (token === game) placeAdventure(from + (to - from) * eased);
    });
    adventure.busy = false;
    if (token === game && adventure.progress >= adventure.end - 4) finishAdventure();
  });

  /* Recuerdos: tres tarjetas de colección; la que se abre decide la canción dedicada. */
  function memoryFace(side, parts) {
    const face = document.createElement("span");
    face.className = `memory-card__face memory-card__${side}`;
    parts.forEach(([className, text]) => {
      const part = document.createElement("span");
      part.className = className;
      part.textContent = text;
      face.append(part);
    });
    return face;
  }

  const songPlayer = document.querySelector("#song-player");

  // La canción elegida suena en un reproductor de toda la página y nos acompaña hasta el final.
  const music = document.querySelector("#page-music");
  const nowPlaying = document.querySelector("#now-playing");
  const musicToggle = document.querySelector("#music-toggle");

  function renderMusic() {
    const playing = !music.paused;
    musicToggle.classList.toggle("is-paused", !playing);
    musicToggle.setAttribute("aria-label", playing ? "Pausar la canción" : "Reanudar la canción");
  }
  music.addEventListener("play", renderMusic);
  music.addEventListener("pause", renderMusic);
  musicToggle.addEventListener("click", () => {
    if (music.paused) music.play().catch(() => {});
    else music.pause();
  });

  // Solo se retira el video de respaldo de la tarjeta; la música de la página sigue.
  function stopSong() {
    songPlayer.replaceChildren();
  }

  // Un MP3 local (audio) suena directamente; si no hay, se usa el video de YouTube.
  function playSong(song, autoplay = true) {
    stopSong();
    if (song.audio) {
      if (!autoplay) return;
      if (!music.src.endsWith(song.audio)) music.src = song.audio;
      music.currentTime = 0;
      music.play().catch(() => {});
      document.querySelector("#now-title").textContent = song.title;
      document.querySelector("#now-artist").textContent = song.artist;
      nowPlaying.hidden = false;
    } else if (song.youtube) {
      const frame = document.createElement("iframe");
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(song.youtube)}?autoplay=${autoplay ? 1 : 0}&playsinline=1&rel=0`;
      frame.title = `${song.title}, de ${song.artist}`;
      frame.allow = "autoplay; encrypted-media; picture-in-picture";
      frame.allowFullscreen = true;
      frame.loading = "eager";
      songPlayer.append(frame);
    }
  }

  function setupMemories(stop) {
    const container = document.querySelector("#memory-cards");
    container.replaceChildren();
    let chosen = false;
    stop.songs.forEach((song, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "memory-card";
      button.style.setProperty("--tilt", `${(index - 1) * 3}deg`);
      button.setAttribute("aria-label", "Abrir esta tarjeta y descubrir su canción");
      const inner = document.createElement("span");
      inner.className = "memory-card__inner";
      inner.setAttribute("aria-hidden", "true");
      inner.append(
        memoryFace("back", [["memory-card__logo", "♪"], ["memory-card__tag", "CANCIÓN"], ["memory-card__small", "SECRETA"]]),
        memoryFace("front", [["memory-card__band", "PARA TI"], ["memory-card__icon", "♪"], ["memory-card__text", song.title], ["memory-card__artist", song.artist]]),
      );
      button.append(inner);
      button.addEventListener("click", async () => {
        if (!canPlay("recuerdos") || chosen) return;
        chosen = true;
        [...container.children].forEach((card) => {
          card.setAttribute("aria-disabled", "true");
          if (card !== button) card.classList.add("is-dimmed");
        });
        button.classList.add("is-flipped");
        SFX.flip();
        button.setAttribute("aria-label", `Canción: ${song.title}, de ${song.artist}`);
        live.textContent = `Tu canción: ${song.title}, de ${song.artist}.`;
        // Empieza a sonar con el mismo toque, así el navegador permite reproducirla.
        playSong(song);
        const token = game;
        await wait(reduced() ? 400 : 1300);
        if (token === game && canPlay("recuerdos")) completeStop(stop, { ...stop.reveal, song });
      });
      container.append(button);
    });
  }

  /* Lo que viene: una bifurcación con dos caminos; los dos completan la parada. */
  const fork = {
    car: document.querySelector("#fork-car"),
    paths: [document.querySelector("#fork-path-0"), document.querySelector("#fork-path-1")],
    trails: [...document.querySelectorAll("[data-fork-trail]")],
    start: 0,
    busy: false,
  };

  function placeFork(index, distance) {
    const pathElement = fork.paths[index];
    const total = pathElement.getTotalLength();
    fork.car.setAttribute("transform", pose(pathElement, distance, total));
    fork.trails[index].setAttribute("stroke-dasharray", `${distance} ${total * 2}`);
  }

  function setupFork(stop) {
    const total = fork.paths[0].getTotalLength();
    fork.start ||= samplePath(fork.paths[0], total).find((sample) => sample.point.y <= 204).distance;
    fork.busy = false;
    fork.trails.forEach((trail) => trail.setAttribute("stroke-dasharray", "0 1000"));
    placeFork(0, fork.start);
    const container = document.querySelector("#fork-choices");
    container.replaceChildren();
    stop.choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `fork-choice fork-choice--${index}`;
      const arrow = document.createElement("span");
      arrow.className = "fork-choice__arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = index === 0 ? "↖" : "↗";
      const label = document.createElement("span");
      label.className = "fork-choice__label";
      label.textContent = "Rumbo sorpresa";
      button.setAttribute("aria-label", `Rumbo sorpresa de la ${index === 0 ? "izquierda" : "derecha"}`);
      button.append(arrow, label);
      button.addEventListener("click", () => chooseFork(stop, index));
      container.append(button);
    });
  }

  async function chooseFork(stop, index) {
    if (!canPlay("lo-que-viene") || fork.busy) return;
    fork.busy = true;
    const choices = [...document.querySelectorAll(".fork-choice")];
    choices.forEach((button, buttonIndex) => {
      button.setAttribute("aria-disabled", "true");
      button.classList.add(buttonIndex === index ? "is-chosen" : "is-dimmed");
    });
    // La sorpresa se descubre al elegir.
    choices[index].querySelector(".fork-choice__label").textContent = stop.choices[index].label;
    choices[index].setAttribute("aria-label", stop.choices[index].label);
    live.textContent = `Elegiste: ${stop.choices[index].label}.`;
    SFX.engine(1);
    const token = game;
    const end = fork.paths[index].getTotalLength() - 8;
    await animate(950, (eased) => {
      if (token === game) placeFork(index, fork.start + (end - fork.start) * eased);
    });
    await wait(reduced() ? 150 : 250);
    if (token === game && canPlay("lo-que-viene")) completeStop(stop, stop.choices[index]);
  }

  /* ---------- Resumen de la meta, para compartir por WhatsApp ---------- */
  const summaryDialog = document.querySelector("#summary-dialog");
  const summaryLive = document.querySelector("#summary-live");

  function summaryItems() {
    const byId = (id) => ROUTE_STOPS.find((stop) => stop.id === id);
    const adventure = lastReveal.get("aventuras");
    const memories = lastReveal.get("recuerdos");
    const future = lastReveal.get("lo-que-viene");
    return [
      { icon: "✦", title: byId("aventuras").title, text: `«${adventure.message}»` },
      { icon: "♪", title: byId("recuerdos").title, text: `Mi canción: «${memories.song.title}», de ${memories.song.artist}. “${memories.song.lyric.line}” (${memories.song.lyric.translation}). ${memories.song.dedication}` },
      { icon: "♡", title: byId("lo-que-viene").title, text: `Nuestro próximo plan: ${future.label}. «${future.message}»` },
    ];
  }

  function summaryText() {
    const name = CONFIG.nombre.trim();
    const sender = CONFIG.remitente.trim();
    const lines = summaryItems().map((item) => `${item.icon} *${item.title}:* ${item.text}`);
    return [
      "🏁 ¡Llegué a la meta de «Elige tu ruta»!",
      "",
      ...lines,
      "",
      sender ? `Una entrega especial de ${sender}${name ? ` para ${name}` : ""} ♡` : "Una entrega especial ♡",
    ].join("\n");
  }

  function openSummary() {
    if (state !== "idle" || !finished) return;
    const list = document.querySelector("#summary-list");
    list.replaceChildren(...summaryItems().map((item) => {
      const row = document.createElement("li");
      const icon = document.createElement("span");
      icon.className = "summary__icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = item.icon;
      const body = document.createElement("div");
      const title = document.createElement("strong");
      title.textContent = item.title;
      const text = document.createElement("p");
      text.textContent = item.text;
      body.append(title, text);
      row.append(icon, body);
      return row;
    }));
    document.querySelector("#share-whatsapp").href = `https://wa.me/?text=${encodeURIComponent(summaryText())}`;
    summaryLive.textContent = "";
    document.querySelector("#share-note").textContent = "";
    state = "summary";
    document.body.classList.add("dialog-open");
    summaryDialog.showModal();
    SFX.chime();
    summaryDialog.scrollTop = 0;
  }

  function closeSummary() {
    if (state === "summary") summaryDialog.close();
  }

  finishBadge.addEventListener("click", openSummary);
  document.querySelector("#close-summary").addEventListener("click", closeSummary);
  summaryDialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    state = "idle";
    if (summarySeen) {
      finishBadge.focus({ preventScroll: true });
      return;
    }
    // Tras el primer resumen, el siguiente paso es continuar la ruta.
    summarySeen = true;
    finishBadge.classList.add("is-seen");
    status.textContent = "Toca ¡META! para volver a ver el resumen, o continúa la ruta hacia Tu colección.";
    routeNext.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
    continueButton.focus({ preventScroll: true });
  });
  document.querySelector("#open-summary").addEventListener("click", openSummary);

  // Compartir: abre WhatsApp; si el navegador no deja abrir ventanas, usa el menú de compartir o copia el texto.
  document.querySelector("#share-whatsapp").addEventListener("click", async (event) => {
    event.preventDefault();
    const text = summaryText();
    SFX.tap();
    const opened = window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    if (opened) return;
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      summaryLive.textContent = "Copié el resumen: ábrelo en WhatsApp y pégalo.";
    } catch {
      summaryLive.textContent = "Usa «Copiar resumen» y pégalo en WhatsApp.";
    }
    document.querySelector("#share-note").textContent = summaryLive.textContent;
  });
  summaryDialog.addEventListener("click", (event) => {
    const rect = summaryDialog.getBoundingClientRect();
    if (event.target === summaryDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeSummary();
  });
  document.querySelector("#copy-summary").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(summaryText());
      summaryLive.textContent = "Resumen copiado.";
      document.querySelector("#copy-summary").textContent = "¡Copiado!";
    } catch {
      summaryLive.textContent = "No se pudo copiar. Usa el botón de WhatsApp.";
    }
    window.setTimeout(() => { document.querySelector("#copy-summary").textContent = "Copiar resumen"; }, 2000);
  });

  /* ---------- Diálogo ---------- */

  dialog.addEventListener("close", async () => {
    game += 1;
    stopSong();
    dialog.classList.remove("is-closing");
    document.body.classList.remove("dialog-open");
    setButtonsDisabled(false);
    continueButton.disabled = false;
    activeButton?.focus({ preventScroll: true });
    state = "animating";
    await afterClose();
    state = "idle";
    if (summaryPending) {
      summaryPending = false;
      await wait(reduced() ? 0 : 700);
      openSummary();
    }
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeCard();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll("button, summary, a[href]")]
      .filter((element) => {
        const details = element.closest("details");
        const inClosedDetails = details && !details.open && element.tagName !== "SUMMARY";
        return !element.disabled && !inClosedDetails && element.getClientRects().length > 0;
      });
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (performance.now() < suppressBackdropUntil) return;
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeCard();
  });
  closeButton.addEventListener("click", closeCard);
  buttons.forEach((button) => button.addEventListener("click", () => selectStop(button)));
  document.addEventListener("sorpresa:sectionchange", (event) => {
    if (event.detail.to === 2) initializeRoute();
  });

  // CONEXIÓN CON LA SECCIÓN 3 · Sustituye el contenido de #section-3 en index.html.
  // Conserva el encabezado #section-3-title con tabindex="-1" para recibir el foco.
  async function goToSection3() {
    if (state !== "idle" || !finished || completed.size !== ROUTE_STOPS.length || section.hidden) return;
    SFX.whoosh();
    state = "leaving";
    continueButton.disabled = true;
    section.inert = true;
    if (!reduced()) {
      section.classList.add("is-departing");
      await wait(300);
    }
    const collection = document.querySelector("#section-3");
    section.hidden = true;
    collection.hidden = false;
    if (!reduced()) collection.classList.add("is-entering");
    document.querySelector("#section-3-title").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    state = "complete";
    status.textContent = "Tu colección.";
    document.dispatchEvent(new CustomEvent("sorpresa:sectionchange", { detail: { from: 2, to: 3 } }));
  }
  continueButton.addEventListener("click", goToSection3);
})();

// =====================================================================
// SECCIÓN 3 · TU COLECCIÓN
// =====================================================================

// PERSONALIZA AQUÍ los títulos, dedicatorias y colores de la colección.
// model selecciona una de las tres siluetas SVG: sport, rally o classic.
const COLLECTION_CARS = Object.freeze([
  { title: "Tu alegría", dedication: "Porque tienes esa forma tan tuya de hacer mis días mejores", color: "#ff823e", model: "sport", label: "SPORT COUPÉ · EDICIÓN SONRISAS" },
  { title: "Tu forma de cuidarme", dedication: "Por cada pequeño detalle con el que me demuestras que estás ahí", color: "#66c9ed", model: "rally", label: "RALLY GT · EDICIÓN COMPLICIDAD" },
  { title: "Todos nuestros planes", dedication: "Por las aventuras que todavía nos esperan", color: "#e8d394", model: "classic", label: "CLASSIC 70 · EDICIÓN FUTURO" },
]);

// <race-engine> Motor de la carrera, independiente del DOM (lo usa race-engine.test.cjs).
// El tiempo solo avanza cuando el controlador llama a advance().
const RACE_DURATION = 18;
const RACE_TRAVEL = 1.5; // Segundos que tarda un objeto en llegar desde arriba hasta el carrito (menos = más rápido).
const RACE_ASSIST = 3; // Segundos finales en los que el imán trae las cajas que falten.
const RACE_SHIELD = 0.9; // Segundos sin choques justo después de chocar.
// Corazones extra: [segundo de aparición, carril]. Muchos están en el único carril libre de una fila de conos.
const RACE_HEARTS = Object.freeze([[2, 2], [3, 2], [4.2, 0], [5.2, 2], [6, 1], [7.6, 0], [8.3, 1], [9.2, 2], [10, 2], [10.8, 0], [12.6, 1], [13.3, 0]]);
// Conos: [segundo de aparición, carril]. Dos conos a la vez dejan un solo carril libre.
const RACE_CONES = Object.freeze([
  [2.5, 1], [3.4, 0], [4.2, 1], [4.2, 2], [5.2, 0], [5.2, 1], [7.6, 2], [8.3, 0], [8.3, 2],
  [9.2, 1], [10, 0], [10, 1], [10.8, 2], [12.6, 0], [12.6, 2], [13.3, 1], [13.3, 2], [14, 0],
]);

class CollectionRace {
  constructor() {
    this.duration = RACE_DURATION;
    this.elapsed = 0;
    this.lane = 1;
    this.done = false;
    this.assistance = false;
    this.crashes = 0;
    this.heartsLost = 0;
    this.shieldUntil = -1;
    this.items = [0, 2, 1].map((lane, id) => ({
      id, lane, spawnAt: [1.5, 6.5, 11.5][id], travel: RACE_TRAVEL,
      collected: false, missed: false, attempts: 0, assisted: false,
    }));
    this.hearts = RACE_HEARTS.map(([spawnAt, lane], id) => ({ id, lane, spawnAt, taken: false, passed: false }));
    this.cones = RACE_CONES.map(([spawnAt, lane], id) => ({ id, lane, spawnAt, hit: false, passed: false }));
  }

  get count() { return this.items.filter((item) => item.collected).length; }
  get heartsTaken() { return this.hearts.filter((heart) => heart.taken).length; }
  get heartCount() { return this.heartsTaken - this.heartsLost; }
  get shielded() { return this.elapsed < this.shieldUntil; }

  move(direction) {
    this.setLane(this.lane + Math.sign(direction));
  }

  setLane(lane) {
    if (!this.done && Number.isFinite(lane)) this.lane = Math.max(0, Math.min(2, Math.round(lane)));
  }

  get boxes() {
    return this.items.filter((item) => !item.collected && this.elapsed >= item.spawnAt)
      .map((item) => ({
        id: item.id,
        lane: item.assisted ? this.lane : item.lane,
        y: -0.12 + (this.elapsed - item.spawnAt) / item.travel * 0.92,
        assisted: item.assisted,
      }));
  }

  // Objetos que bajan a la velocidad de la pista (corazones y conos).
  visible(list, keep) {
    return list.map((entry) => ({ entry, progress: (this.elapsed - entry.spawnAt) / RACE_TRAVEL }))
      .filter(({ entry, progress }) => keep(entry) && progress >= 0 && progress < 1.25)
      .map(({ entry, progress }) => ({ id: entry.id, lane: entry.lane, y: -0.12 + progress * 0.92, hit: entry.hit }));
  }

  get visibleHearts() { return this.visible(this.hearts, (heart) => !heart.taken); }
  get visibleCones() { return this.visible(this.cones, () => true); }

  advance(seconds) {
    if (this.done || !Number.isFinite(seconds) || seconds <= 0) return [];
    const events = [];
    let remaining = Math.min(seconds, this.duration - this.elapsed);
    // Subpasos: un fotograma lento no se salta ninguna caja ni ningún cono.
    while (remaining > 1e-8) {
      const delta = Math.min(remaining, 1 / 60);
      this.elapsed = Math.min(this.duration, this.elapsed + delta);
      remaining -= delta;
      if (!this.assistance && this.elapsed >= this.duration - RACE_ASSIST) {
        this.assistance = true;
        const missing = this.items.filter((item) => !item.collected);
        missing.forEach((item, index) => {
          item.assisted = true;
          item.missed = false;
          item.spawnAt = this.duration - RACE_ASSIST + index * 0.5;
          item.travel = 1;
        });
        if (missing.length) events.push({ type: "assist" });
      }
      for (const item of this.items) {
        if (item.collected || this.elapsed < item.spawnAt) continue;
        const progress = (this.elapsed - item.spawnAt) / item.travel;
        if (progress >= 1 && !item.missed) {
          if (item.assisted || this.lane === item.lane) {
            item.collected = true;
            events.push({ type: "pickup", id: item.id, count: this.count, assisted: item.assisted });
          } else {
            item.missed = true;
            events.push({ type: "miss", id: item.id });
          }
        }
        // Una caja perdida vuelve un poco después por el carril de al lado.
        if (!item.collected && item.missed && progress >= 1.2) {
          item.attempts += 1;
          item.lane = (item.lane + 1) % 3;
          item.spawnAt = this.elapsed + 0.8;
          item.missed = false;
        }
      }
      for (const heart of this.hearts) {
        if (heart.taken || heart.passed || (this.elapsed - heart.spawnAt) / RACE_TRAVEL < 1) continue;
        if (this.lane === heart.lane) {
          heart.taken = true;
          events.push({ type: "heart", id: heart.id, count: this.heartCount });
        } else {
          heart.passed = true;
        }
      }
      for (const cone of this.cones) {
        if (cone.hit || cone.passed || (this.elapsed - cone.spawnAt) / RACE_TRAVEL < 1) continue;
        if (this.lane === cone.lane && !this.shielded) {
          cone.hit = true;
          this.crashes += 1;
          this.shieldUntil = this.elapsed + RACE_SHIELD;
          // Cada choque cuesta un corazón (si hay alguno).
          const lost = this.heartCount > 0;
          if (lost) this.heartsLost += 1;
          events.push({ type: "crash", id: cone.id, lost, count: this.heartCount, crashes: this.crashes });
        } else {
          cone.passed = true;
        }
      }
    }
    if (this.elapsed >= this.duration - 1e-7) {
      this.elapsed = this.duration;
      this.done = true;
      events.push({ type: "finish" });
    }
    return events;
  }

  complete() {
    this.items.forEach((item) => { item.collected = true; });
    this.elapsed = this.duration;
    this.done = true;
  }
}
// </race-engine>

(() => {
  const section = document.querySelector("#section-3");
  const track = document.querySelector("#collection-track");
  const panel = document.querySelector("#collection-race-panel");
  const showcase = document.querySelector("#collection-showcase");
  const curtain = document.querySelector("#race-curtain");
  const pauseOverlay = document.querySelector("#race-pause");
  const countdown = document.querySelector("#race-countdown");
  const player = document.querySelector("#collection-player");
  const laneGlow = document.querySelector("#race-lane-glow");
  const world = document.querySelector("#race-world");
  const finishLine = document.querySelector("#race-finish");
  const startButton = document.querySelector("#race-start");
  const anywayButton = document.querySelector("#race-anyway");
  const pauseButton = document.querySelector("#race-pause-button");
  const skipButton = document.querySelector("#race-skip");
  const replayButton = document.querySelector("#race-replay");
  const continueButton = document.querySelector("#collection-continue");
  const leftButton = document.querySelector("#race-left");
  const rightButton = document.querySelector("#race-right");
  const counter = document.querySelector("#race-counter strong");
  const heartCounter = document.querySelector("#race-hearts strong");
  const clock = document.querySelector("#race-time");
  const progressBar = document.querySelector("#race-progress");
  const pickup = document.querySelector("#race-pickup");
  const assist = document.querySelector("#race-assist");
  const badge = document.querySelector("#collection-badge");
  const completeNote = document.querySelector("#collection-complete-note");
  const live = document.querySelector("#collection-status");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const ROAD_UNITS = 520; // Alto del viewBox de la pista.
  const PLAYER_Y = 0.8; // Altura del carrito dentro de la pista (0 arriba, 1 abajo).
  let race = new CollectionRace();
  let state = "intro";
  let raced = false; // Si la colección se ganó corriendo (y no saltando la carrera).
  let frameId = 0;
  let lastTime = null;
  let finishTimer = 0;
  let pickupTimer = 0;
  let countdownTimers = [];
  let visualLane = 1;
  let width = 360;
  let height = 420;
  let pointer = null;
  let playerSize = [46, 84];
  let boxSize = [48, 52];
  const packages = [];

  const reduced = () => motion.matches;
  const sound = (name) => { if (typeof SFX !== "undefined") SFX[name](); };
  const buzz = (ms) => { try { if (!reduced() && navigator.userActivation?.hasBeenActive !== false) navigator.vibrate?.(ms); } catch { /* sin vibración */ } };
  const clockText = (seconds) => `00:${String(Math.max(0, Math.ceil(seconds))).padStart(2, "0")}`;

  document.querySelectorAll("[data-race-seconds]").forEach((node) => { node.textContent = String(RACE_DURATION); });

  function setState(next) {
    state = next;
    section.dataset.raceState = next;
  }

  function stopLoop() {
    window.cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = null;
  }

  function cancelEffects() {
    window.clearTimeout(finishTimer);
    window.clearTimeout(pickupTimer);
    countdownTimers.forEach((timer) => window.clearTimeout(timer));
    countdownTimers = [];
    finishTimer = pickupTimer = 0;
    countdown.hidden = true;
    player.classList.remove("is-picking-up");
    pickup.textContent = "";
    pickup.classList.remove("is-heart", "is-crash");
    player.classList.remove("is-shielded");
    track.classList.remove("is-crash");
  }

  const VIEWBOXES = { "collection-box": "0 0 64 68", "collection-heart": "0 0 32 30", "collection-cone": "0 0 40 44" };
  function makeSprite(className, symbol, color) {
    const node = document.createElement("div");
    node.className = className;
    if (color) node.style.setProperty("--car-color", color);
    node.innerHTML = `<svg viewBox="${VIEWBOXES[symbol]}"><use href="#${symbol}"/></svg>`;
    node.hidden = true;
    document.querySelector("#race-boxes").append(node);
    return node;
  }
  const boxNodes = COLLECTION_CARS.map((car) => makeSprite("race-box", "collection-box", car.color));
  const heartNodes = RACE_HEARTS.map(() => makeSprite("race-heart", "collection-heart"));
  const coneNodes = RACE_CONES.map(() => makeSprite("race-cone", "collection-cone"));

  COLLECTION_CARS.forEach((car, index) => {
    const article = document.createElement("article");
    article.className = "collection-package";
    article.style.setProperty("--car-color", car.color);
    article.innerHTML = `<button class="collection-package__button" type="button" aria-expanded="false" aria-controls="collection-message-${index}"><span class="collection-package__art" aria-hidden="true"></span><img class="collection-package__brand" src="assets/hot-wheels-logo.png" alt="" width="102" height="38"/><span class="collection-package__serial" aria-hidden="true">0${index + 1} / 03</span><span class="collection-package__title"></span><span class="collection-package__model" aria-hidden="true"></span><span class="collection-package__toy" aria-hidden="true"><svg viewBox="0 0 280 120"><use/></svg></span><span class="collection-package__blister" aria-hidden="true"></span><span class="collection-package__action" aria-hidden="true">TOCA PARA ABRIR</span></button><p class="collection-package__message" id="collection-message-${index}" hidden></p>`;
    const button = article.querySelector("button");
    const message = article.querySelector(".collection-package__message");
    const action = article.querySelector(".collection-package__action");
    article.querySelector(".collection-package__title").textContent = car.title;
    article.querySelector(".collection-package__model").textContent = car.label;
    const model = ["sport", "rally", "classic"].includes(car.model) ? car.model : "sport";
    article.querySelector("use").setAttribute("href", `#collection-${model}`);
    message.textContent = `«${car.dedication}»`;
    const item = { article, button, message, action, car, seen: false };
    button.addEventListener("click", () => togglePackage(item));
    document.querySelector("#collection-shelf").append(article);
    packages.push(item);
  });

  function setPackage(item, open) {
    item.article.classList.toggle("is-open", open);
    item.button.setAttribute("aria-expanded", String(open));
    item.button.setAttribute("aria-label", `${open ? "Cerrar dedicatoria" : item.seen ? "Volver a abrir empaque" : "Abrir empaque"}: ${item.car.title}`);
    item.message.hidden = !open;
    item.action.textContent = open ? "CERRAR" : item.seen ? "VOLVER A ABRIR" : "TOCA PARA ABRIR";
  }

  function togglePackage(item) {
    if (state !== "complete") return;
    const open = item.button.getAttribute("aria-expanded") !== "true";
    if (open) item.seen = true;
    setPackage(item, open);
    if (!open) return;
    sound("flip");
    const opened = packages.filter((entry) => entry.seen).length;
    live.textContent = `${item.car.title}. ${item.car.dedication}.`;
    if (opened === packages.length && !continueButton.classList.contains("is-ready")) {
      continueButton.classList.add("is-ready");
      completeNote.textContent = "Abriste los tres empaques. El viaje sigue un poco más adelante.";
      window.setTimeout(() => { if (state === "complete") live.textContent = "Abriste los tres empaques. Cuando quieras, continúa el viaje."; }, 1800);
    }
    // En celular, la dedicatoria queda a la vista sin buscarla.
    const rect = item.message.getBoundingClientRect();
    if (rect.bottom > window.innerHeight - 16) item.message.scrollIntoView({ block: "nearest", behavior: reduced() ? "auto" : "smooth" });
  }

  function resetPackages() {
    packages.forEach((item) => { item.seen = false; setPackage(item, false); });
    continueButton.classList.remove("is-ready");
    completeNote.textContent = "Toca cada empaque. Hay algo más que un carrito dentro.";
  }

  function measure() {
    if (section.hidden || panel.hidden) return;
    width = track.clientWidth || width;
    height = track.clientHeight || height;
    playerSize = [player.offsetWidth || playerSize[0], player.offsetHeight || playerSize[1]];
    boxSize = [boxNodes[0].offsetWidth || boxSize[0], boxNodes[0].offsetHeight || boxSize[1]];
    render(0);
  }
  if ("ResizeObserver" in window) new ResizeObserver(measure).observe(track);
  else window.addEventListener("resize", measure);

  const place = (node, lane, y, size) => {
    node.style.transform = `translate3d(${(lane + 0.5) * width / 3 - size[0] / 2}px, ${y * height - size[1] / 2}px, 0)`;
  };

  function render(delta) {
    // Con movimiento reducido el cambio de carril es inmediato.
    const ease = reduced() || delta <= 0 ? 1 : Math.min(1, delta * 16);
    visualLane += (race.lane - visualLane) * ease;
    if (Math.abs(race.lane - visualLane) < 0.01) visualLane = race.lane;
    const tilt = (race.lane - visualLane) * 14;
    player.style.transform = `translate3d(${(visualLane + 0.5) * width / 3 - playerSize[0] / 2}px, ${height * PLAYER_Y - playerSize[1] / 2}px, 0) rotate(${tilt.toFixed(2)}deg)`;
    laneGlow.style.transform = `translateX(${race.lane * 100}%)`;
    // La pista se desplaza a la misma velocidad que las cajas: parecen quietas sobre el asfalto.
    const speed = ROAD_UNITS * 0.92 / RACE_TRAVEL;
    world.setAttribute("transform", `translate(0 ${((race.elapsed * speed) % 64).toFixed(2)})`);
    const finishY = ROAD_UNITS * PLAYER_Y - 24 - (race.duration - race.elapsed) * speed;
    finishLine.setAttribute("transform", `translate(0 ${Math.max(-120, finishY).toFixed(2)})`);
    const active = race.boxes;
    boxNodes.forEach((node, index) => {
      const box = active.find((entry) => entry.id === index);
      node.hidden = !box;
      if (!box) return;
      place(node, box.assisted ? visualLane : box.lane, box.y, boxSize);
      node.classList.toggle("is-assisted", box.assisted);
    });
    const hearts = race.visibleHearts;
    heartNodes.forEach((node, index) => {
      const heart = hearts.find((entry) => entry.id === index);
      node.hidden = !heart;
      if (heart) place(node, heart.lane, heart.y, [30, 28]);
    });
    const cones = race.visibleCones;
    coneNodes.forEach((node, index) => {
      const cone = cones.find((entry) => entry.id === index);
      node.hidden = !cone;
      if (!cone) return;
      // Un cono golpeado sale despedido hacia un lado.
      place(node, cone.hit ? cone.lane + (cone.lane === 2 ? -0.38 : 0.38) : cone.lane, cone.y, [34, 38]);
      node.classList.toggle("is-hit", cone.hit);
    });
    player.classList.toggle("is-shielded", race.shielded);
    const text = clockText(race.duration - race.elapsed);
    if (clock.textContent !== text) clock.textContent = text;
    progressBar.style.transform = `scaleX(${(race.elapsed / race.duration).toFixed(4)})`;
    section.dataset.raceElapsed = race.elapsed.toFixed(2);
    section.dataset.raceLane = race.lane;
  }

  function setControls(active) {
    leftButton.disabled = !active;
    rightButton.disabled = !active;
  }

  function updateMotionUI() {
    startButton.querySelector("[data-start-label]").textContent = reduced() ? "VER MI COLECCIÓN" : "INICIAR CARRERA";
    anywayButton.hidden = !reduced();
    document.querySelector("#race-intro-note").textContent = reduced()
      ? "Tu colección está lista para abrirse, sin movimiento. Si prefieres, también puedes correr la carrera."
      : "Recoge las cajas y los corazones, y esquiva los conos: cada choque te quita un corazón. Va rápido: toca el carril al que quieres ir.";
  }

  function showIntro() {
    stopLoop();
    cancelEffects();
    race = new CollectionRace();
    visualLane = 1;
    setState("intro");
    section.dataset.view = "race";
    panel.hidden = false;
    showcase.hidden = true;
    curtain.hidden = false;
    pauseOverlay.hidden = true;
    pauseButton.hidden = true;
    skipButton.hidden = false;
    assist.hidden = true;
    counter.textContent = "0/3";
    heartCounter.textContent = "0";
    setControls(false);
    updateMotionUI();
    measure();
  }

  function showCollection() {
    if (section.hidden || ["leaving", "off", "complete"].includes(state)) return;
    stopLoop();
    cancelEffects();
    race.complete();
    setState("complete");
    section.dataset.view = "showcase";
    counter.textContent = "3/3";
    setControls(false);
    pauseOverlay.hidden = true;
    panel.hidden = true;
    showcase.hidden = false;
    const hearts = race.heartCount;
    const crashes = race.crashes;
    const crashLabel = crashes === 1 ? "1 choque" : `${crashes} choques`;
    badge.textContent = raced ? `✓ 3 / 3 · ♡ ${hearts} / ${RACE_HEARTS.length} · ${crashes ? crashLabel : "SIN CHOQUES"}` : "✓ 3 / 3";
    document.querySelector("#collection-complete-title").focus({ preventScroll: true });
    section.scrollIntoView({ behavior: "instant", block: "start" });
    const heartText = raced ? ` Terminaste con ${hearts} de ${RACE_HEARTS.length} corazones y ${crashes ? crashLabel : "ningún choque"}.` : "";
    live.textContent = `¡Tu colección está completa!${heartText} Toca cada uno de los tres empaques para abrir su dedicatoria.`;
    sound("fanfare");
  }

  function flash(text, heart, crash = false) {
    pickup.textContent = text;
    pickup.classList.toggle("is-heart", heart);
    pickup.classList.toggle("is-crash", crash);
    window.clearTimeout(pickupTimer);
    player.classList.remove("is-picking-up");
    void player.offsetWidth;
    if (!heart && !crash) player.classList.add("is-picking-up");
    pickupTimer = window.setTimeout(() => {
      pickup.textContent = "";
      player.classList.remove("is-picking-up");
    }, heart ? 600 : 1100);
  }

  function onPickup(event) {
    counter.textContent = `${event.count}/3`;
    live.textContent = `Recogiste ${COLLECTION_CARS[event.id].title}. Colección: ${event.count} de 3.`;
    flash(`✦ ${COLLECTION_CARS[event.id].title}`, false);
    sound("checkpoint");
    buzz(25);
  }

  function onHeart(event) {
    heartCounter.textContent = String(event.count);
    if (!pickup.textContent || pickup.classList.contains("is-heart")) flash("+♡", true);
    sound("tap");
  }

  function onCrash(event) {
    heartCounter.textContent = String(event.count);
    flash(event.lost ? "¡CHOQUE! −♡" : "¡CHOQUE!", false, true);
    live.textContent = event.lost ? `Chocaste con un cono y perdiste un corazón. Te quedan ${event.count}.` : "Chocaste con un cono. ¡Esquiva el siguiente!";
    if (!reduced()) {
      track.classList.remove("is-crash");
      void track.offsetWidth;
      track.classList.add("is-crash");
    }
    sound("crash");
    buzz(70);
  }

  function frame(now) {
    frameId = 0;
    if (state !== "running" || section.hidden) return;
    if (document.hidden) { pauseRace(); return; }
    // Un fotograma muy tardío (p. ej. al volver de otra app) cuenta como máximo 0,25 s.
    const delta = lastTime === null ? 0 : Math.min(0.25, Math.max(0, (now - lastTime) / 1000));
    lastTime = now;
    const events = race.advance(delta);
    render(delta);
    for (const event of events) {
      if (event.type === "pickup") onPickup(event);
      if (event.type === "heart") onHeart(event);
      if (event.type === "crash") onCrash(event);
      if (event.type === "miss") live.textContent = "Esa caja volverá por otro carril. ¡Sigue disfrutando el camino!";
      if (event.type === "assist") {
        assist.hidden = false;
        live.textContent = "Último tramo: imán de colección activado. Las sorpresas van contigo.";
      }
      if (event.type === "finish") {
        setState("finishing");
        setControls(false);
        pauseButton.hidden = true;
        skipButton.hidden = true;
        pickup.classList.remove("is-heart");
        pickup.textContent = "¡META! · 3/3";
        finishTimer = window.setTimeout(showCollection, reduced() ? 300 : 900);
      }
    }
    if (state === "running") frameId = window.requestAnimationFrame(frame);
  }

  function beginRunning() {
    countdown.hidden = true;
    setState("running");
    setControls(true);
    pauseButton.hidden = false;
    pauseButton.textContent = "Pausar";
    lastTime = null;
    frameId = window.requestAnimationFrame(frame);
  }

  // Cuenta regresiva corta: 3, 2, 1, ¡YA! (en total, poco más de un segundo y medio).
  function runCountdown() {
    setState("countdown");
    const steps = ["3", "2", "1", "¡YA!"];
    const gap = 420;
    countdown.hidden = false;
    steps.forEach((label, index) => {
      countdownTimers.push(window.setTimeout(() => {
        if (state !== "countdown") return;
        countdown.textContent = label;
        countdown.classList.remove("is-tick");
        void countdown.offsetWidth;
        countdown.classList.add("is-tick");
        sound(index === steps.length - 1 ? "go" : "light");
        if (index === steps.length - 1) {
          countdownTimers.push(window.setTimeout(() => { if (state === "countdown") beginRunning(); }, 260));
        }
      }, index * gap));
    });
  }

  function startRace(options = {}) {
    if (section.hidden || !["intro", "complete"].includes(state)) return;
    if (reduced() && !options.anyway) { raced = false; showCollection(); return; }
    showIntro();
    resetPackages();
    raced = true;
    curtain.hidden = true;
    measure();
    // La pista entera (marcador, carriles y botones) queda a la vista en el celular.
    panel.scrollIntoView({ block: "center", behavior: "instant" });
    track.focus({ preventScroll: true });
    live.textContent = "La carrera empieza en 3 segundos. Esquiva los conos y recoge las cajas. Toca un carril, desliza o usa las flechas para cambiarte.";
    runCountdown();
  }

  function pauseRace() {
    if (!["running", "countdown"].includes(state)) return;
    stopLoop();
    cancelEffects();
    setState("paused");
    setControls(false);
    pointer = null;
    pauseOverlay.hidden = false;
    pauseButton.hidden = false;
    pauseButton.textContent = "Reanudar";
    live.textContent = "Carrera en pausa. Tu progreso se guarda mientras vuelves.";
  }

  function resumeRace() {
    if (state !== "paused" || document.hidden || section.hidden) return;
    pauseOverlay.hidden = true;
    track.focus({ preventScroll: true });
    live.textContent = "La carrera continúa.";
    if (race.elapsed === 0) runCountdown();
    else beginRunning();
  }

  function move(direction) {
    if (state !== "running" || section.hidden) return;
    race.move(direction);
  }
  leftButton.addEventListener("click", () => move(-1));
  rightButton.addEventListener("click", () => move(1));
  section.addEventListener("keydown", (event) => {
    const keys = { ArrowLeft: -1, ArrowRight: 1, a: -1, A: -1, d: 1, D: 1 };
    if (state !== "running" || !(event.key in keys) || event.target.closest?.("input, textarea")) return;
    event.preventDefault();
    move(keys[event.key]);
  });

  // Tocar un carril lleva el carrito a ese carril; deslizar lo mueve de uno en uno.
  track.addEventListener("pointerdown", (event) => {
    if (state !== "running" || !event.isPrimary || event.button !== 0) return;
    pointer = { id: event.pointerId, x: event.clientX, startX: event.clientX, swiped: false };
    try { track.setPointerCapture(event.pointerId); } catch { /* sin captura */ }
  });
  track.addEventListener("pointermove", (event) => {
    if (state !== "running" || !pointer || pointer.id !== event.pointerId) return;
    const difference = event.clientX - pointer.x;
    if (Math.abs(difference) >= 28) {
      move(Math.sign(difference));
      pointer.x = event.clientX;
      pointer.swiped = true;
    }
  });
  track.addEventListener("pointerup", (event) => {
    if (state === "running" && pointer && pointer.id === event.pointerId && !pointer.swiped && Math.abs(event.clientX - pointer.startX) < 12) {
      const rect = track.getBoundingClientRect();
      race.setLane(Math.floor((event.clientX - rect.left) / (rect.width / 3)));
    }
    pointer = null;
  });
  const releasePointer = () => { pointer = null; };
  track.addEventListener("pointercancel", releasePointer);
  track.addEventListener("lostpointercapture", releasePointer);

  startButton.addEventListener("click", () => startRace());
  anywayButton.addEventListener("click", () => startRace({ anyway: true }));
  replayButton.addEventListener("click", () => startRace({ anyway: true }));
  skipButton.addEventListener("click", () => { raced = raced && race.elapsed > 0; showCollection(); });
  document.querySelector("#race-resume").addEventListener("click", resumeRace);
  pauseButton.addEventListener("click", () => (state === "paused" ? resumeRace() : pauseRace()));

  document.addEventListener("visibilitychange", () => { if (document.hidden) pauseRace(); });
  window.addEventListener("pagehide", () => { pauseRace(); stopLoop(); cancelEffects(); });
  motion.addEventListener?.("change", () => {
    updateMotionUI();
    // Si se activa el movimiento reducido a media carrera, se muestra la colección completa.
    if (reduced() && ["running", "paused", "countdown", "finishing"].includes(state)) showCollection();
  });

  function leaveSection() {
    stopLoop();
    cancelEffects();
    setControls(false);
    pointer = null;
    setState("off");
  }
  new MutationObserver(() => { if (section.hidden) leaveSection(); }).observe(section, { attributes: true, attributeFilter: ["hidden"] });
  document.addEventListener("sorpresa:sectionchange", (event) => {
    if (event.detail.to === 3) showIntro();
    else if (event.detail.from === 3) leaveSection();
  });

  // CONEXIÓN CON LA SECCIÓN 4. Sustituye su contenido conservando section-4 y section-4-title.
  continueButton.addEventListener("click", async () => {
    if (state !== "complete" || section.hidden) return;
    setState("leaving");
    continueButton.disabled = true;
    stopLoop();
    cancelEffects();
    section.inert = true;
    sound("whoosh");
    if (!reduced()) {
      section.classList.add("is-departing");
      await new Promise((resolve) => window.setTimeout(resolve, 250));
    }
    section.hidden = true;
    section.classList.remove("is-departing");
    const next = document.querySelector("#section-4");
    next.hidden = false;
    if (!reduced()) next.classList.add("is-entering");
    document.querySelector("#section-4-title").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector("#experience-status").textContent = "Sección 4. El viaje continúa.";
    document.dispatchEvent(new CustomEvent("sorpresa:sectionchange", { detail: { from: 3, to: 4 } }));
  });

  updateMotionUI();
  if (!section.hidden) showIntro();
})();

// =====================================================================
// SECCIÓN 4 · PIT STOP DE RECUERDOS
// =====================================================================

// PERSONALIZA AQUÍ la canción favorita. audio: un MP3 guardado en assets.
const PIT_STOP_SONG = Object.freeze({ title: "Perfect", artist: "Ed Sheeran", audio: "assets/perfect.mp3" });

// PERSONALIZA AQUÍ las tarjetas de la galería (se recomiendan entre 4 y 10).
// photo: imagen en assets (o poster del video). video: opcional, un MP4 en assets; suena sin audio y en bucle.
// objectPosition: encuadre "horizontal vertical". credit: null para fotos propias.
const PIT_STOP_MEMORIES = Object.freeze([
  {
    photo: "assets/galeria-1.jpg", alt: "Chris Evans con lentes redondos y camiseta azul oscuro, sonriendo de lado", objectPosition: "50% 28%",
    title: "Así me gusta verte", place: "TRANQUILO · SONRIENDO", color: "#ff823e",
    message: "Hay fotos que se ven una vez y otras que se guardan para siempre. Esta es de las segundas.",
    credit: null,
  },
  {
    photo: "assets/galeria-2.jpg", alt: "Chris Evans de traje azul y camisa verde, con barba, sonriendo", objectPosition: "50% 30%",
    title: "Esa sonrisa", place: "LA QUE ME GANÓ", color: "#66c9ed",
    message: "Tengo una colección de tus sonrisas y todavía me faltan muchas por guardar.",
    credit: null,
  },
  {
    photo: "assets/galeria-3.jpg", alt: "Chris Evans de traje negro y corbata en una alfombra roja", objectPosition: "50% 16%",
    title: "De gala", place: "ALFOMBRA ROJA · EDICIÓN 30.09", color: "#e8d394",
    message: "Cualquier día contigo merece vestirse de gala.",
    credit: null,
  },
  {
    photo: "assets/galeria-4.jpg", alt: "Primer plano de Chris Evans con barba y ojos azules, mirando de frente", objectPosition: "44% 40%",
    title: "Esos ojos", place: "PRIMER PLANO", color: "#72cca4",
    message: "Podría perderme en esa mirada y no pedir el camino de regreso.",
    credit: null,
  },
  {
    photo: "assets/galeria-5.jpg", alt: "Foto en blanco y negro de Chris Evans con los brazos cruzados, mirando hacia la ventana", objectPosition: "50% 22%",
    title: "Lo que nos falta", place: "PRÓXIMA VUELTA", color: "#ff6f8f",
    message: "Esta tarjeta está a medio llenar a propósito: el resto lo escribimos juntos.",
    credit: null,
  },
]);

(() => {
  const section = document.querySelector("#section-4");
  const deck = document.querySelector("#pit-deck");
  const prevButton = document.querySelector("#pit-prev");
  const nextButton = document.querySelector("#pit-next");
  const indexLabel = document.querySelector("#pit-index");
  const dots = document.querySelector("#pit-dots");
  const live = document.querySelector("#pit-status");
  const continueButton = document.querySelector("#pit-continue");
  const nextNote = document.querySelector("#pit-next-note");
  const songButton = document.querySelector("#pit-song-button");
  const music = document.querySelector("#page-music");
  const nowPlaying = document.querySelector("#now-playing");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => motion.matches;
  const sound = (name) => { if (typeof SFX !== "undefined") SFX[name](); };
  const pad = (number) => String(number).padStart(2, "0");
  const memories = PIT_STOP_MEMORIES.filter((memory) => memory && (memory.photo || memory.video));
  const total = memories.length;
  let current = 0;
  let busy = false; // Mientras una tarjeta sale volando.
  let drag = null;
  let suppressClick = false;
  let leaving = false;
  const seen = new Set();

  document.querySelector("#pit-total").textContent = pad(total);
  document.querySelector("#pit-song-title").textContent = PIT_STOP_SONG.title;
  document.querySelector("#pit-song-artist").textContent = PIT_STOP_SONG.artist;

  // Cada tarjeta: frente (foto o video) y reverso (dedicatoria). El frente entero es un botón para girarla.
  const cards = memories.map((memory, index) => {
    const card = document.createElement("article");
    card.className = "pit-card";
    card.style.setProperty("--card-color", memory.color || "#ff823e");
    card.innerHTML = `<div class="pit-card__inner">
      <button class="pit-card__face pit-card__front" type="button" aria-expanded="false">
        <span class="pit-card__top" aria-hidden="true"><img src="assets/hot-wheels-logo.png" alt="" width="102" height="38"/><span class="pit-card__serial">PIT · ${pad(index + 1)}/${pad(total)}</span></span>
        <span class="pit-card__media"><span class="pit-card__fallback" hidden>Aquí va una foto de ustedes dos</span></span>
        <span class="pit-card__caption" aria-hidden="true"><strong class="pit-card__title"></strong><small class="pit-card__place"></small></span>
        <span class="pit-card__hint" aria-hidden="true">TOCA PARA GIRAR ↻</span>
      </button>
      <div class="pit-card__face pit-card__back">
        <span class="pit-card__back-eyebrow" aria-hidden="true">RECUERDO ${pad(index + 1)} · ${pad(total)}</span>
        <p class="pit-card__message"></p>
        <p class="pit-card__signature">— <span class="pit-card__sender"></span> <span aria-hidden="true">♡</span></p>
        <button class="pit-card__flip-back" type="button">↻ Ver la foto</button>
        <p class="pit-card__credit" hidden></p>
      </div>
    </div>`;
    const front = card.querySelector(".pit-card__front");
    const media = card.querySelector(".pit-card__media");
    const fallback = card.querySelector(".pit-card__fallback");
    card.querySelector(".pit-card__title").textContent = memory.title || "";
    card.querySelector(".pit-card__place").textContent = memory.place || "";
    card.querySelector(".pit-card__message").textContent = memory.message || "";
    const sender = typeof CONFIG !== "undefined" ? String(CONFIG.remitente || "").trim() : "";
    card.querySelector(".pit-card__sender").textContent = sender;
    card.querySelector(".pit-card__signature").hidden = !sender;
    const back = card.querySelector(".pit-card__back");
    back.inert = true;
    front.setAttribute("aria-label", `Recuerdo ${index + 1} de ${total}: ${memory.title || ""}. ${memory.alt || ""}. Toca para leer la dedicatoria.`);
    let video = null;
    if (memory.video) {
      video = document.createElement("video");
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.src = memory.video;
      if (memory.photo) video.poster = memory.photo;
      video.setAttribute("aria-hidden", "true");
      video.addEventListener("error", () => { video.hidden = true; fallback.hidden = false; });
      media.prepend(video);
    } else {
      const image = document.createElement("img");
      image.src = memory.photo;
      image.alt = "";
      image.decoding = "async";
      image.loading = index < 2 ? "eager" : "lazy";
      image.draggable = false;
      image.addEventListener("error", () => { image.hidden = true; fallback.hidden = false; });
      media.prepend(image);
    }
    media.style.setProperty("--object-position", memory.objectPosition || "50% 50%");
    if (memory.credit) {
      const credit = card.querySelector(".pit-card__credit");
      const source = document.createElement("a");
      source.href = memory.credit.source;
      source.target = "_blank";
      source.rel = "noopener noreferrer";
      source.textContent = `Foto de muestra: ${memory.credit.author}`;
      const license = document.createElement("a");
      license.href = memory.credit.licenseUrl;
      license.target = "_blank";
      license.rel = "noopener noreferrer";
      license.textContent = memory.credit.license;
      credit.append(source, " · ", license);
      credit.hidden = false;
    }
    front.addEventListener("click", () => {
      if (suppressClick) { suppressClick = false; return; }
      flip(entry, true);
    });
    card.querySelector(".pit-card__flip-back").addEventListener("click", () => flip(entry, false));
    deck.append(card);
    const entry = { card, front, back, video, memory, index, flipped: false };
    return entry;
  });

  cards.forEach(() => dots.append(document.createElement("i")));

  function flip(entry, open) {
    if (entry.index !== current || busy) return;
    entry.flipped = open;
    entry.card.classList.toggle("is-flipped", open);
    entry.front.setAttribute("aria-expanded", String(open));
    entry.back.inert = !open;
    entry.front.inert = open;
    sound("flip");
    if (open) {
      live.textContent = `${entry.memory.title}. ${entry.memory.message}`;
      entry.card.querySelector(".pit-card__flip-back").focus({ preventScroll: true });
    } else {
      entry.front.focus({ preventScroll: true });
    }
  }

  // Coloca la pila: la tarjeta actual arriba y las dos siguientes asomando detrás.
  function layout() {
    cards.forEach((entry) => {
      const depth = (entry.index - current + total) % total;
      const { card } = entry;
      card.style.setProperty("--depth", depth);
      card.dataset.depth = depth > 2 ? "hidden" : String(depth);
      card.style.zIndex = String(total - depth);
      const top = depth === 0;
      card.inert = !top;
      card.setAttribute("aria-hidden", String(!top));
      if (!top && entry.flipped) {
        entry.flipped = false;
        card.classList.remove("is-flipped");
        entry.front.setAttribute("aria-expanded", "false");
        entry.back.inert = true;
        entry.front.inert = false;
      }
      if (entry.video) {
        if (top && !reduced() && !section.hidden) entry.video.play().catch(() => {});
        else entry.video.pause();
      }
    });
    indexLabel.textContent = pad(current + 1);
    [...dots.children].forEach((dot, index) => {
      dot.classList.toggle("is-current", index === current);
      dot.classList.toggle("is-seen", seen.has(index));
    });
  }

  function markSeen() {
    seen.add(current);
    if (seen.size === total && !continueButton.classList.contains("is-ready")) {
      continueButton.classList.add("is-ready");
      nextNote.textContent = "Viste toda la colección. La pista te espera.";
      window.setTimeout(() => { if (!section.hidden) live.textContent = "Viste todos los recuerdos. Cuando quieras, sigue la ruta."; }, 1200);
    }
  }

  function announce() {
    const memory = memories[current];
    live.textContent = `Recuerdo ${current + 1} de ${total}: ${memory.title}.`;
  }

  // direction: 1 = siguiente, -1 = anterior. La tarjeta de arriba sale volando hacia un lado.
  async function go(direction, { fromSwipe = false, dx = 0 } = {}) {
    if (busy || section.hidden || total < 2) return;
    const top = cards[current];
    const focusWasInside = top.card.contains(document.activeElement) || document.activeElement === deck;
    busy = true;
    sound("whoosh");
    if (!reduced() && direction === 1) {
      const side = fromSwipe ? Math.sign(dx) || 1 : -1;
      top.card.classList.add("is-leaving");
      top.card.style.setProperty("--fly-x", `${side * 130}%`);
      top.card.style.setProperty("--fly-r", `${side * 18}deg`);
      await new Promise((resolve) => window.setTimeout(resolve, 280));
      top.card.classList.remove("is-leaving");
      top.card.style.removeProperty("--drag-x");
      top.card.style.removeProperty("--drag-r");
    }
    current = (current + direction + total) % total;
    layout();
    top.card.style.removeProperty("--fly-x");
    top.card.style.removeProperty("--fly-r");
    markSeen();
    announce();
    busy = false;
    if (focusWasInside) cards[current].front.focus({ preventScroll: true });
  }

  prevButton.addEventListener("click", () => go(-1));
  nextButton.addEventListener("click", () => go(1));
  deck.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
  });

  // Arrastrar la tarjeta de arriba: más de 80 px (o un gesto rápido) la descarta; si no, vuelve a su sitio.
  deck.addEventListener("pointerdown", (event) => {
    if (busy || !event.isPrimary || event.button !== 0) return;
    const entry = cards[current];
    if (!entry.card.contains(event.target) || entry.flipped) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0, time: performance.now(), active: false, entry };
  });
  deck.addEventListener("pointermove", (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.active) {
      if (Math.abs(dx) < 10) return;
      // Un gesto sobre todo vertical deja desplazar la página.
      if (Math.abs(dy) > Math.abs(dx)) { drag = null; return; }
      drag.active = true;
      drag.entry.card.classList.add("is-dragging");
      try { deck.setPointerCapture(event.pointerId); } catch { /* sin captura */ }
    }
    drag.dx = dx;
    drag.entry.card.style.setProperty("--drag-x", `${dx}px`);
    drag.entry.card.style.setProperty("--drag-r", `${reduced() ? 0 : dx / 18}deg`);
  });
  function endDrag(event, cancelled) {
    if (!drag || drag.id !== event.pointerId) return;
    const { entry, dx, active, time } = drag;
    drag = null;
    if (!active) return;
    suppressClick = true;
    window.setTimeout(() => { suppressClick = false; }, 0);
    entry.card.classList.remove("is-dragging");
    const speed = Math.abs(dx) / Math.max(1, performance.now() - time);
    if (!cancelled && (Math.abs(dx) > 80 || speed > 0.6)) {
      go(1, { fromSwipe: true, dx });
    } else {
      entry.card.style.removeProperty("--drag-x");
      entry.card.style.removeProperty("--drag-r");
    }
  }
  deck.addEventListener("pointerup", (event) => endDrag(event, false));
  deck.addEventListener("pointercancel", (event) => endDrag(event, true));

  // Radio del pit: pone la canción favorita en el reproductor de toda la página.
  const isOurSong = () => Boolean(music.src) && music.src.endsWith(PIT_STOP_SONG.audio) && !music.paused;
  function renderSongButton() {
    const playing = isOurSong();
    songButton.textContent = playing ? "Sonando ♪ · Pausar" : "Poner nuestra canción";
    songButton.setAttribute("aria-pressed", String(playing));
    section.classList.toggle("is-song-playing", playing);
  }
  songButton.addEventListener("click", () => {
    if (isOurSong()) { music.pause(); return; }
    if (!music.src.endsWith(PIT_STOP_SONG.audio)) {
      music.src = PIT_STOP_SONG.audio;
      music.currentTime = 0;
    }
    music.play().catch(() => { live.textContent = "No se pudo reproducir la canción en este navegador."; });
    document.querySelector("#now-title").textContent = PIT_STOP_SONG.title;
    document.querySelector("#now-artist").textContent = PIT_STOP_SONG.artist;
    nowPlaying.hidden = false;
    live.textContent = `Suena ${PIT_STOP_SONG.title}, de ${PIT_STOP_SONG.artist}.`;
  });
  ["play", "pause", "emptied", "loadstart"].forEach((name) => music.addEventListener(name, renderSongButton));

  function enter() {
    leaving = false;
    section.inert = false;
    continueButton.disabled = false;
    current = 0;
    busy = false;
    layout();
    markSeen();
    renderSongButton();
  }

  function leave() {
    drag = null;
    cards.forEach((entry) => entry.video?.pause());
  }

  motion.addEventListener?.("change", () => { if (!section.hidden) layout(); });
  new MutationObserver(() => { if (section.hidden) leave(); }).observe(section, { attributes: true, attributeFilter: ["hidden"] });
  document.addEventListener("sorpresa:sectionchange", (event) => {
    if (event.detail.to === 4) enter();
    else if (event.detail.from === 4) leave();
  });

  // CONEXIÓN CON LA SECCIÓN 5. Sustituye su contenido conservando section-5 y section-5-title.
  continueButton.addEventListener("click", async () => {
    if (leaving || section.hidden) return;
    leaving = true;
    continueButton.disabled = true;
    section.inert = true;
    sound("whoosh");
    if (!reduced()) {
      section.classList.add("is-departing");
      await new Promise((resolve) => window.setTimeout(resolve, 250));
    }
    section.hidden = true;
    section.classList.remove("is-departing", "is-entering");
    const next = document.querySelector("#section-5");
    next.hidden = false;
    if (!reduced()) next.classList.add("is-entering");
    document.querySelector("#section-5-title").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector("#experience-status").textContent = "Sección 5. El viaje continúa.";
    document.dispatchEvent(new CustomEvent("sorpresa:sectionchange", { detail: { from: 4, to: 5 } }));
  });

  layout();
  if (!section.hidden) enter();
})();

// =====================================================================
// SECCIÓN 5 · MENSAJE EN LA GUANTERA
// =====================================================================

// PERSONALIZA AQUÍ la carta. Cada elemento de paragraphs es un párrafo; se insertan como texto.
// {nombre} se sustituye por CONFIG.nombre. La firma usa CONFIG.remitente.
const GLOVEBOX_LETTER = Object.freeze({
  phrase: "Antes de llegar a la meta, quiero decirte algo",
  greeting: "{nombre}:",
  paragraphs: [
    "Si llegaste hasta aquí es porque recorriste cada parada conmigo: las aventuras, las canciones, los planes y los recuerdos. Gracias por jugar, pero sobre todo gracias por estar.",
    "Hay cosas que no caben en una tarjeta ni en una carrera, así que las guardé aquí, en la guantera, donde se guarda lo importante: me haces feliz de una forma sencilla y constante, de esas que no hacen ruido pero se notan todos los días.",
    "No sé exactamente qué curvas vienen, pero sí sé con quién quiero tomarlas. Este 30 de septiembre solo quería recordártelo.",
  ],
  closing: "Con todo mi cariño,",
});

(() => {
  const section = document.querySelector("#section-5");
  const envelope = document.querySelector("#glove-envelope");
  const action = document.querySelector("#glove-action");
  const letter = document.querySelector("#glove-letter");
  const greeting = document.querySelector("#glove-letter-title");
  const body = document.querySelector("#glove-letter-body");
  const foldButton = document.querySelector("#glove-fold");
  const continueButton = document.querySelector("#glove-continue");
  const nextNote = document.querySelector("#glove-next-note");
  const live = document.querySelector("#glove-status");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => motion.matches;
  const sound = (name) => { if (typeof SFX !== "undefined") SFX[name](); };
  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
  const name = typeof CONFIG !== "undefined" ? String(CONFIG.nombre || "").trim() : "";
  const sender = typeof CONFIG !== "undefined" ? String(CONFIG.remitente || "").trim() : "";
  let opening = false;
  let leaving = false;
  let read = false;

  // Todo el texto de la carta se inserta como texto plano.
  const fill = (text) => String(text || "").replaceAll("{nombre}", name).trim();
  document.querySelector("#glove-phrase").textContent = `«${fill(GLOVEBOX_LETTER.phrase)}»`;
  document.querySelector("#glove-to").textContent = name ? `PARA: ${name}` : "PARA TI";
  greeting.textContent = fill(GLOVEBOX_LETTER.greeting) || "Para ti:";
  GLOVEBOX_LETTER.paragraphs.forEach((text, index) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = fill(text);
    paragraph.style.setProperty("--line", index);
    body.append(paragraph);
  });
  document.querySelector("#glove-letter-closing").textContent = fill(GLOVEBOX_LETTER.closing);
  document.querySelector("#glove-letter-signature").textContent = sender;
  document.querySelector("#glove-letter-signature").hidden = !sender;
  envelope.setAttribute("aria-label", `Carta cerrada: ${fill(GLOVEBOX_LETTER.phrase)}. Toca para abrirla.`);

  async function openLetter() {
    if (opening || section.hidden) return;
    if (envelope.getAttribute("aria-expanded") === "true") {
      letter.scrollIntoView({ block: "start", behavior: reduced() ? "auto" : "smooth" });
      greeting.focus({ preventScroll: true });
      return;
    }
    opening = true;
    sound("flip");
    section.classList.add("is-opening");
    envelope.setAttribute("aria-expanded", "true");
    action.textContent = "CARTA ABIERTA";
    if (!reduced()) await wait(650);
    if (section.hidden) { opening = false; return; }
    section.classList.add("is-open");
    letter.hidden = false;
    sound("chime");
    letter.scrollIntoView({ block: "start", behavior: reduced() ? "auto" : "smooth" });
    greeting.focus({ preventScroll: true });
    live.textContent = "Carta abierta.";
    opening = false;
    if (!read) {
      read = true;
      continueButton.classList.add("is-ready");
      nextNote.textContent = "Ahora sí: la meta te espera.";
    }
  }

  function foldLetter() {
    if (opening) return;
    letter.hidden = true;
    section.classList.remove("is-open", "is-opening");
    envelope.setAttribute("aria-expanded", "false");
    action.textContent = "TOCA PARA VOLVER A LEER";
    envelope.setAttribute("aria-label", `Carta guardada: ${fill(GLOVEBOX_LETTER.phrase)}. Toca para volver a abrirla.`);
    sound("flip");
    envelope.focus({ preventScroll: true });
    envelope.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" });
    live.textContent = "Guardaste la carta en la guantera.";
  }

  envelope.addEventListener("click", openLetter);
  foldButton.addEventListener("click", foldLetter);

  function enter() {
    leaving = false;
    section.inert = false;
    continueButton.disabled = false;
  }
  document.addEventListener("sorpresa:sectionchange", (event) => {
    if (event.detail.to === 5) enter();
  });

  // CONEXIÓN CON LA SECCIÓN 6. Sustituye su contenido conservando section-6 y section-6-title.
  continueButton.addEventListener("click", async () => {
    if (leaving || section.hidden) return;
    leaving = true;
    continueButton.disabled = true;
    section.inert = true;
    sound("whoosh");
    if (!reduced()) {
      section.classList.add("is-departing");
      await wait(250);
    }
    section.hidden = true;
    section.classList.remove("is-departing", "is-entering");
    const next = document.querySelector("#section-6");
    next.hidden = false;
    if (!reduced()) next.classList.add("is-entering");
    document.querySelector("#section-6-title").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    document.querySelector("#experience-status").textContent = "Sección 6. La meta.";
    document.dispatchEvent(new CustomEvent("sorpresa:sectionchange", { detail: { from: 5, to: 6 } }));
  });

  if (!section.hidden) enter();
})();

// =====================================================================
// SECCIÓN 6 · LA META: TU RAMO
// =====================================================================

// PERSONALIZA AQUÍ el mensaje final. {nombre} se sustituye por CONFIG.nombre.
// cars: cada carrito llega en orden hasta su lugar en el ramo (x, y en % de la imagen) desde la izquierda o la derecha.
const FINALE = Object.freeze({
  message: "Este 30 de septiembre, esta carrera termina contigo. Feliz día, {nombre}",
  cars: [
    { color: "#ff823e", x: 42, y: 48, from: "left" },
    { color: "#ffcf33", x: 65, y: 50, from: "right" },
    { color: "#2f7fe8", x: 29, y: 29, from: "left" },
    { color: "#e5392f", x: 73, y: 32, from: "right" },
  ],
});

(() => {
  const section = document.querySelector("#section-6");
  const bouquet = document.querySelector("#finale-bouquet");
  // La máscara se aplica solo a la foto del ramo; los carritos y el confeti quedan por encima.
  const image = document.querySelector("#finale-image");
  const carsLayer = document.querySelector("#finale-cars");
  const confetti = document.querySelector("#finale-confetti");
  const description = document.querySelector("#finale-description");
  const skipButton = document.querySelector("#finale-skip");
  const messageBox = document.querySelector("#finale-message");
  const messageText = document.querySelector("#finale-text");
  const replayButton = document.querySelector("#finale-replay");
  const live = document.querySelector("#finale-status");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = () => motion.matches;
  const sound = (name, ...args) => { if (typeof SFX !== "undefined") SFX[name](...args); };
  const name = typeof CONFIG !== "undefined" ? String(CONFIG.nombre || "").trim() : "";
  const sender = typeof CONFIG !== "undefined" ? String(CONFIG.remitente || "").trim() : "";
  const cars = FINALE.cars.slice(0, 6);
  let runId = 0;
  let timers = [];
  let frames = [];
  // Radios (px) de la máscara que va descubriendo el ramo: [envoltura, carrito 1, carrito 2, …].
  let radii = [];
  const centers = [{ x: 50, y: 97 }, ...cars.map((car) => ({ x: car.x, y: car.y }))];

  // Mensaje final: el nombre se inserta como texto y se destaca.
  const [before, after = ""] = FINALE.message.split("{nombre}");
  messageText.append(before);
  if (FINALE.message.includes("{nombre}")) {
    const em = document.createElement("em");
    em.textContent = name;
    messageText.append(em, after);
  }
  const plainMessage = FINALE.message.replaceAll("{nombre}", name);
  const signature = document.querySelector("#finale-signature");
  signature.textContent = sender ? `Con cariño, ${sender} ♡` : "";
  signature.hidden = !sender;

  const carNodes = cars.map((car) => {
    const node = document.createElement("span");
    node.className = "finale-car";
    node.style.left = `${car.x}%`;
    node.style.top = `${car.y}%`;
    node.style.setProperty("--car-color", car.color);
    node.innerHTML = `<svg viewBox="0 0 120 52"><ellipse cx="60" cy="49" rx="54" ry="3" fill="#02070f" opacity=".45"/><path d="M8 34 20 22l24-8h32l16 10 18 4 4 10-4 4H10l-4-4 2-6Z" fill="var(--car-color)" stroke="#ffffff66" stroke-width="1"/><path d="M40 18h18v8H32l8-8Zm22 0h12l12 8H62v-8Z" fill="#17324a"/><path d="M14 32h92" stroke="#fff" stroke-width="2" opacity=".55"/><path d="m108 29 5 2" stroke="#e2faff" stroke-width="3"/><g fill="#0a1019"><circle cx="30" cy="42" r="9"/><circle cx="92" cy="42" r="9"/></g><g fill="#a6c8d8"><circle cx="30" cy="42" r="4"/><circle cx="92" cy="42" r="4"/></g></svg><span class="finale-car__trail"></span>`;
    carsLayer.append(node);
    return node;
  });

  const wait = (ms) => new Promise((resolve) => { timers.push(window.setTimeout(resolve, ms)); });

  function cancel() {
    runId += 1;
    timers.forEach((timer) => window.clearTimeout(timer));
    frames.forEach((frame) => window.cancelAnimationFrame(frame));
    timers = [];
    frames = [];
  }

  function paintMask() {
    const width = image.clientWidth || 300;
    const layers = centers.map((center, index) => {
      const radius = Math.max(0, radii[index] || 0);
      const feather = Math.min(radius, width * 0.1);
      return radius <= 0
        ? "linear-gradient(transparent, transparent)"
        : `radial-gradient(circle at ${center.x}% ${center.y}%, #000 ${radius.toFixed(1)}px, transparent ${(radius + feather).toFixed(1)}px)`;
    }).join(", ");
    image.style.setProperty("-webkit-mask-image", layers);
    image.style.maskImage = layers;
  }

  function clearMask() {
    image.style.removeProperty("-webkit-mask-image");
    image.style.removeProperty("mask-image");
  }

  // Anima el radio de una o varias capas de la máscara.
  function grow(indexes, to, duration) {
    return new Promise((resolve) => {
      const from = indexes.map((index) => radii[index] || 0);
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - progress) ** 3;
        indexes.forEach((index, i) => { radii[index] = from[i] + (to - from[i]) * eased; });
        paintMask();
        if (progress < 1) frames.push(window.requestAnimationFrame(step));
        else resolve();
      };
      frames.push(window.requestAnimationFrame(step));
      // Si la pestaña está oculta y no hay fotogramas, la secuencia no se queda detenida.
      timers.push(window.setTimeout(() => {
        indexes.forEach((index) => { radii[index] = to; });
        paintMask();
        resolve();
      }, duration + 400));
    });
  }

  function driveIn(node, car) {
    const width = image.clientWidth || 300;
    const side = car.from === "left" ? -1 : 1;
    node.style.setProperty("--face", side === 1 ? -1 : 1);
    node.style.transition = "none";
    node.style.transform = `translate(-50%, -50%) translateX(${side * width * 1.1}px) scaleX(var(--face))`;
    node.classList.remove("is-parked");
    node.classList.add("is-driving");
    void node.offsetWidth;
    node.style.transition = "";
    node.style.transform = "translate(-50%, -50%) scaleX(var(--face))";
  }

  function spray() {
    if (reduced()) return;
    confetti.replaceChildren();
    const colors = ["#ff823e", "#66c9ed", "#ffcf33", "#f3f3ed", "#2f7fe8"];
    for (let index = 0; index < 40; index += 1) {
      const piece = document.createElement("i");
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * 400}ms`;
      piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 120}px`);
      piece.style.setProperty("--spin", `${(Math.random() - 0.5) * 900}deg`);
      confetti.append(piece);
    }
    timers.push(window.setTimeout(() => confetti.replaceChildren(), 3200));
  }

  function reset() {
    cancel();
    radii = centers.map(() => 0);
    paintMask();
    carNodes.forEach((node) => {
      node.classList.remove("is-driving", "is-parked");
      node.style.transition = "none";
      node.style.transform = "";
    });
    confetti.replaceChildren();
    messageBox.hidden = true;
    section.classList.remove("is-complete");
    replayButton.disabled = false;
  }

  function showFinal({ announce = true } = {}) {
    cancel();
    clearMask();
    carNodes.forEach((node) => { node.classList.remove("is-driving"); node.classList.add("is-parked"); });
    skipButton.hidden = true;
    section.classList.add("is-complete");
    description.textContent = "Todos llegaron a la meta.";
    messageBox.hidden = false;
    messageText.focus({ preventScroll: true });
    messageBox.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" });
    if (announce) live.textContent = `Tu ramo está completo. ${plainMessage}.`;
  }

  async function play() {
    if (section.hidden) return;
    reset();
    const run = runId;
    const stale = () => run !== runId || section.hidden;
    if (reduced()) {
      description.textContent = "Todos llegaron a la meta.";
      showFinal();
      return;
    }
    skipButton.hidden = false;
    description.textContent = "Tus carritos vienen en camino, uno por uno.";
    live.textContent = "Tus carritos vienen en camino para formar tu ramo.";
    await wait(450);
    if (stale()) return;
    sound("whoosh");
    await grow([0], (image.clientWidth || 300) * 0.36, 700);
    for (const [index, car] of cars.entries()) {
      if (stale()) return;
      description.textContent = `Carrito ${index + 1} de ${cars.length} en camino…`;
      sound("engine", 0.8);
      driveIn(carNodes[index], car);
      await wait(760);
      if (stale()) return;
      sound("checkpoint");
      carNodes[index].classList.add("is-parked");
      await grow([index + 1], (image.clientWidth || 300) * 0.2, 450);
      await wait(180);
    }
    if (stale()) return;
    const full = Math.hypot(image.clientWidth || 300, image.clientHeight || 450) * 1.2;
    sound("fanfare");
    spray();
    await grow(centers.map((_, index) => index), full, 900);
    if (stale()) return;
    showFinal();
  }

  skipButton.addEventListener("click", () => showFinal());
  replayButton.addEventListener("click", () => {
    section.querySelector("#section-6-title").focus({ preventScroll: true });
    document.querySelector("#finale-stage").scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" });
    play();
  });

  motion.addEventListener?.("change", () => { if (reduced() && !section.hidden && messageBox.hidden) showFinal(); });
  new MutationObserver(() => { if (section.hidden) cancel(); }).observe(section, { attributes: true, attributeFilter: ["hidden"] });
  document.addEventListener("sorpresa:sectionchange", (event) => {
    if (event.detail.to === 6) play();
    else if (event.detail.from === 6) cancel();
  });

  if (!section.hidden) play();
})();
