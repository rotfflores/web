(() => {
  "use strict";

  const config = window.FLOWERS_CONFIG || FLOWERS_CONFIG;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  Object.entries(config.colors || {}).forEach(([name, value]) => root.style.setProperty(`--${name}`, value));
  $$('[data-config="recipient"]').forEach((el) => { el.textContent = config.recipient; });
  $$('[data-config="sender"]').forEach((el) => { el.textContent = config.sender; });
  $$('[data-config="memoryDate"]').forEach((el) => { el.textContent = config.memoryDate || "21 · 09 · 2026"; });
  $$('[data-config="photoStripBack"]').forEach((el) => { el.textContent = config.photoStripBack || "Siempre voy a querer guardar un momento más contigo."; });
  $$('[data-config="songTitle"]').forEach((el) => { el.textContent = config.songTitle || "Nuestra canción"; });
  $('[data-config="dedication"]').textContent = config.dedication;
  const letterText = $("#letter-text");
  letterText.replaceChildren(...String(config.letter || "").split(/\n+/).filter(Boolean).map((line, index) => {
    const span = document.createElement("span");
    span.textContent = line;
    span.style.setProperty("--line-delay", `${.52 + index * .34}s`);
    return span;
  }));
  document.title = `Flores amarillas para ${config.recipient}`;

  const audio = $("#music");
  const musicControl = $("#music-control");
  const musicIcon = $(".music-control__icon", musicControl);
  let hasMusic = Boolean(config.song);
  let startUniverse = () => {};
  let wakeStoryControls = () => {};
  let reasonsUnlocked = false;
  let giftUnlocked = false;
  let letterUnlocked = false;
  if (hasMusic) audio.src = config.song;

  function updateMusicUI() {
    const playing = !audio.paused;
    musicControl.classList.toggle("is-playing", playing);
    musicIcon.textContent = playing ? "Ⅱ" : "▶";
    musicControl.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
  }

  async function toggleMusic(forcePlay = false) {
    if (!hasMusic) return;
    try {
      if (forcePlay || audio.paused) await audio.play();
      else audio.pause();
    } catch (_) {
      hasMusic = false;
      musicControl.classList.add("is-unavailable");
      $(".music-control__label", musicControl).textContent = "Agrega tu canción";
    }
    updateMusicUI();
  }

  audio.addEventListener("play", updateMusicUI);
  audio.addEventListener("pause", updateMusicUI);
  audio.addEventListener("error", () => {
    hasMusic = false;
    musicControl.classList.add("is-unavailable");
    $(".music-control__label", musicControl).textContent = "Agrega tu canción";
  });
  musicControl.addEventListener("click", () => toggleMusic());

  function createPetals() {
    if (reducedMotion) return;
    const container = $("#petals");
    for (let i = 0; i < 16; i += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.setProperty("--x", `${Math.random() * 100}vw`);
      petal.style.setProperty("--delay", `${Math.random() * -14}s`);
      petal.style.setProperty("--duration", `${10 + Math.random() * 9}s`);
      petal.style.setProperty("--drift", `${-45 + Math.random() * 90}px`);
      petal.style.setProperty("--size", `${8 + Math.random() * 8}px`);
      container.appendChild(petal);
    }
  }

  let bouquetMessageTimer;

  function releaseBouquetPetals(bouquetButton) {
    if (reducedMotion) return;
    const bounds = bouquetButton.getBoundingClientRect();
    const originX = bounds.width * (.32 + Math.random() * .36);
    const originY = bounds.height * (.2 + Math.random() * .35);

    $$(".petal--click", bouquetButton).slice(24).forEach((petal) => petal.remove());

    for (let i = 0; i < 13; i += 1) {
      const petal = document.createElement("span");
      const size = 7 + Math.random() * 11;
      const direction = Math.random() < .5 ? -1 : 1;
      const travelX = direction * (45 + Math.random() * 150);
      const travelY = -70 - Math.random() * 180;
      const duration = 3800 + Math.random() * 2200;

      petal.className = "petal--click";
      petal.style.left = `${originX - size / 2 + (Math.random() - .5) * 55}px`;
      petal.style.top = `${originY - size / 2 + (Math.random() - .5) * 45}px`;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.55}px`;
      bouquetButton.appendChild(petal);

      const animation = petal.animate([
        { transform: `translate3d(0,0,0) rotate(${Math.random() * 180}deg) scale(.65)`, opacity: 0 },
        { transform: `translate3d(${travelX * .45}px,${travelY}px,0) rotate(${240 + Math.random() * 260}deg) scale(1)`, opacity: .9, offset: .38 },
        { transform: `translate3d(${travelX}px,${120 + Math.random() * 180}px,0) rotate(${620 + Math.random() * 420}deg) scale(.78)`, opacity: 0 }
      ], { duration, delay: Math.random() * 380, easing: "cubic-bezier(.18,.62,.22,1)", fill: "none" });

      const removePetal = () => petal.remove();
      animation.finished.then(removePetal).catch(removePetal);
      setTimeout(removePetal, duration + 500);
    }
  }

  function celebrateBouquet(event) {
    event.stopPropagation();
    const bouquetButton = $("#hero-bouquet");
    const bouquetMessage = $("#bouquet-message");
    bouquetButton.classList.add("was-clicked");
    bouquetMessage.classList.add("is-visible");
    releaseBouquetPetals(bouquetButton);
    clearTimeout(bouquetMessageTimer);
    bouquetMessageTimer = setTimeout(() => bouquetMessage.classList.remove("is-visible"), 3000);
  }

  $("#hero-bouquet").addEventListener("click", celebrateBouquet);
  ["pointerdown", "pointerup"].forEach((type) => {
    $("#hero-bouquet").addEventListener(type, (event) => event.stopPropagation());
  });

  $("#open-experience").addEventListener("click", () => {
    const welcome = $("#welcome");
    welcome.classList.add("is-opening");
    document.body.classList.remove("is-locked");
    document.body.classList.add("stories-active");
    $("#experience").setAttribute("aria-hidden", "false");
    toggleMusic(true);
    createPetals();
    setTimeout(() => {
      welcome.hidden = true;
      musicControl.hidden = false;
      $("#story-progress").hidden = false;
      $("#story-next").hidden = false;
      wakeStoryControls();
      startUniverse();
      scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      observeReveals();
    }, reducedMotion ? 100 : 1050);
  });

  function observeReveals() {
    const items = $$(".reveal");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });
    items.forEach((item) => observer.observe(item));
  }

  const photos = (config.photos || []).slice(0, 8);
  const defaultCaptions = [
    "Donde todo comenzó.",
    "Uno de mis días favoritos.",
    "Tu sonrisa favorita.",
    "Y todavía nos faltan muchos recuerdos."
  ];
  const memoryPhotos = photos.length ? Array.from({ length: 4 }, (_, index) => ({
    ...photos[index % photos.length],
    text: photos[index % photos.length].text || defaultCaptions[index]
  })) : [];
  const stripFrames = $("#photo-strip-frames");
  memoryPhotos.forEach((photo, index) => {
    const frame = document.createElement("figure");
    frame.className = "photo-strip__frame";
    frame.innerHTML = `<button type="button" aria-label="Recordar fotografía ${index + 1}"><img src="${photo.src}" alt="${photo.alt || `Recuerdo ${index + 1}`}" loading="lazy" decoding="async"></button><figcaption>${photo.text || defaultCaptions[index]}</figcaption>`;
    frame.querySelector("button").addEventListener("click", () => {
      if ($("#memory-stage").classList.contains("is-complete")) openPhoto(index);
    });
    stripFrames.appendChild(frame);
  });
  if (!memoryPhotos.length) $("#gallery-section").hidden = true;

  const memoryStage = $("#memory-stage");
  const photoStrip = $("#photo-strip");
  const countdown = $("#camera-countdown");
  let stripProgress = 0;
  let stripStartY = 0;
  let stripStartProgress = 0;
  let stripDragging = false;
  let developing = false;

  function wait(milliseconds) { return new Promise((resolve) => setTimeout(resolve, milliseconds)); }

  function setStripProgress(value) {
    stripProgress = Math.max(.08, Math.min(1, value));
    photoStrip.style.setProperty("--strip-y", `${-96 + stripProgress * 96}%`);
    $$(".photo-strip__frame", photoStrip).forEach((frame, index) => {
      frame.classList.toggle("is-revealed", stripProgress >= .22 + index * .18);
    });
    if (stripProgress >= .985) {
      memoryStage.classList.add("is-complete");
      $("#gallery-section").scrollTo({ top: 330, behavior: reducedMotion ? "auto" : "smooth" });
    }
  }

  function playCameraClick() {
    try {
      const AudioEngine = window.AudioContext || window.webkitAudioContext;
      const engine = new AudioEngine();
      const oscillator = engine.createOscillator();
      const gain = engine.createGain();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(150, engine.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(52, engine.currentTime + .08);
      gain.gain.setValueAtTime(.045, engine.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, engine.currentTime + .1);
      oscillator.connect(gain).connect(engine.destination);
      oscillator.start();
      oscillator.stop(engine.currentTime + .1);
    } catch (_) { /* El sonido es decorativo; la experiencia continúa sin él. */ }
  }

  async function revealMemories() {
    if (developing || memoryStage.classList.contains("is-ready")) return;
    developing = true;
    memoryStage.classList.add("is-counting");
    for (const value of ["3", "2", "1"]) {
      countdown.textContent = value;
      countdown.classList.remove("is-ticking");
      void countdown.offsetWidth;
      countdown.classList.add("is-ticking");
      await wait(reducedMotion ? 80 : 720);
    }
    $("#camera-lens").classList.add("is-lit");
    $("#camera-flash").classList.add("is-flashing");
    document.body.classList.add("camera-flash-active");
    playCameraClick();
    await wait(reducedMotion ? 50 : 360);
    $("#camera-flash").classList.remove("is-flashing");
    document.body.classList.remove("camera-flash-active");
    countdown.textContent = "LISTA";
    memoryStage.classList.remove("is-counting");
    memoryStage.classList.add("is-ready");
    setStripProgress(.08);
  }

  [$("#reveal-memories"), $("#reveal-memories-main")].forEach((button) => button.addEventListener("click", revealMemories));
  photoStrip.addEventListener("pointerdown", (event) => {
    if (!memoryStage.classList.contains("is-ready") || event.target.closest(".photo-strip__flip")) return;
    stripDragging = true;
    stripStartY = event.clientY;
    stripStartProgress = stripProgress;
    photoStrip.classList.add("is-dragging");
    photoStrip.setPointerCapture?.(event.pointerId);
  });
  photoStrip.addEventListener("pointermove", (event) => {
    if (!stripDragging) return;
    setStripProgress(stripStartProgress + (event.clientY - stripStartY) / 520);
  });
  function finishStripDrag() {
    if (!stripDragging) return;
    stripDragging = false;
    photoStrip.classList.remove("is-dragging");
    if (stripProgress > .88) setStripProgress(1);
  }
  photoStrip.addEventListener("pointerup", finishStripDrag);
  photoStrip.addEventListener("pointercancel", finishStripDrag);
  $$(".photo-strip__flip").forEach((button) => button.addEventListener("click", () => photoStrip.classList.toggle("is-flipped")));

  const photoModal = $("#photo-modal");
  function openPhoto(index) {
    const photo = memoryPhotos[index] || photos[index];
    photoModal.classList.remove("is-closing");
    $("#photo-modal-image").src = photo.src;
    $("#photo-modal-image").alt = photo.alt || `Recuerdo ${index + 1}`;
    $("#photo-modal-caption").textContent = photo.text || "";
    photoModal.classList.add("is-open");
    photoModal.setAttribute("aria-hidden", "false");
    $(".photo-modal__close").focus();
  }
  $(".photo-modal__close").addEventListener("click", () => closeDialog(photoModal));
  photoModal.addEventListener("click", (event) => { if (event.target === photoModal) closeDialog(photoModal); });
  let modalTouchY = 0;
  photoModal.addEventListener("pointerdown", (event) => { modalTouchY = event.clientY; });
  photoModal.addEventListener("pointerup", (event) => { if (event.clientY - modalTouchY > 80) closeDialog(photoModal); });

  const reasons = (config.reasons || []).slice(0, 5);
  const scratchTicket = $("#scratch-ticket");
  const scratchCanvas = $("#scratch-canvas");
  const scratchContext = scratchCanvas?.getContext?.("2d");
  const scratchNext = $("#scratch-next");
  const scratchSkip = $("#scratch-skip");
  let scratchIndex = 0;
  let scratching = false;
  let scratchComplete = false;
  let scratchedCells = new Set();
  const scratchColumns = 24;
  const scratchRows = 12;

  reasons.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.toggle("is-active", index === 0);
    $("#scratch-dots").appendChild(dot);
  });

  function drawScratchCover() {
    if (!scratchContext) return;
    const width = Math.max(1, scratchCanvas.clientWidth);
    const height = Math.max(1, scratchCanvas.clientHeight);
    const dpr = Math.min(devicePixelRatio || 1, 2);
    scratchCanvas.width = Math.round(width * dpr);
    scratchCanvas.height = Math.round(height * dpr);
    scratchContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gradient = scratchContext.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#9d6b0c");
    gradient.addColorStop(.18, "#dcae35");
    gradient.addColorStop(.36, "#f8dd6a");
    gradient.addColorStop(.53, "#b7780c");
    gradient.addColorStop(.72, "#f4cf50");
    gradient.addColorStop(.86, "#ffe783");
    gradient.addColorStop(1, "#a66d08");
    scratchContext.globalCompositeOperation = "source-over";
    scratchContext.fillStyle = gradient;
    scratchContext.fillRect(0, 0, width, height);
    for (let index = 0; index < 48; index += 1) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const length = 18 + Math.random() * 65;
      scratchContext.strokeStyle = Math.random() > .48 ? `rgba(255,246,185,${.025 + Math.random() * .09})` : `rgba(74,42,3,${.018 + Math.random() * .07})`;
      scratchContext.lineWidth = .4 + Math.random() * 1.3;
      scratchContext.beginPath();
      scratchContext.moveTo(x, y);
      scratchContext.bezierCurveTo(x + length * .25, y - 4 + Math.random() * 8, x + length * .7, y - 4 + Math.random() * 8, x + length, y + Math.random() * 5);
      scratchContext.stroke();
    }
    for (let index = 0; index < 280; index += 1) {
      const light = Math.random() > .48;
      scratchContext.fillStyle = light ? `rgba(255,245,179,${.08 + Math.random() * .2})` : `rgba(92,54,4,${.035 + Math.random() * .11})`;
      const size = .5 + Math.random() * 2.2;
      scratchContext.beginPath();
      scratchContext.arc(Math.random() * width, Math.random() * height, size, 0, Math.PI * 2);
      scratchContext.fill();
    }
    scratchContext.strokeStyle = "rgba(91,55,7,.48)";
    scratchContext.lineWidth = 1.4;
    scratchContext.setLineDash([2, 5]);
    scratchContext.strokeRect(9, 9, width - 18, height - 18);
    scratchContext.setLineDash([]);
    for (let index = 0; index < 18; index += 1) {
      const x = 16 + Math.random() * (width - 32);
      const y = 16 + Math.random() * (height - 32);
      const size = 1.5 + Math.random() * 2.5;
      scratchContext.fillStyle = `rgba(255,251,208,${.35 + Math.random() * .45})`;
      scratchContext.beginPath();
      scratchContext.moveTo(x, y - size * 2);
      scratchContext.lineTo(x + size * .6, y - size * .6);
      scratchContext.lineTo(x + size * 2, y);
      scratchContext.lineTo(x + size * .6, y + size * .6);
      scratchContext.lineTo(x, y + size * 2);
      scratchContext.lineTo(x - size * .6, y + size * .6);
      scratchContext.lineTo(x - size * 2, y);
      scratchContext.lineTo(x - size * .6, y - size * .6);
      scratchContext.closePath();
      scratchContext.fill();
    }
    scratchContext.fillStyle = "rgba(80,48,5,.82)";
    scratchContext.textAlign = "center";
    scratchContext.textBaseline = "middle";
    scratchContext.font = `700 ${Math.max(12, width * .047)}px Arial`;
    scratchContext.fillText("RASCA PARA DESCUBRIRLA", width / 2, height / 2);
  }

  function makeScratchSparkles(finalPrize = false) {
    const container = $("#scratch-sparkles");
    container.replaceChildren();
    const amount = finalPrize ? 34 : 14;
    for (let index = 0; index < amount; index += 1) {
      const sparkle = document.createElement("i");
      sparkle.style.setProperty("--x", `${8 + Math.random() * 84}%`);
      sparkle.style.setProperty("--y", `${12 + Math.random() * 76}%`);
      sparkle.style.setProperty("--delay", `${Math.random() * .45}s`);
      sparkle.style.setProperty("--travel", `${-25 - Math.random() * 75}px`);
      container.appendChild(sparkle);
    }
  }

  function makeScratchRewardPetals(finalPrize = false) {
    const container = $("#scratch-reward-petals");
    container.classList.remove("is-ambient");
    container.replaceChildren();
    const amount = finalPrize ? 24 : 11;
    for (let index = 0; index < amount; index += 1) {
      const petal = document.createElement("i");
      petal.style.setProperty("--x", `${8 + Math.random() * 84}%`);
      petal.style.setProperty("--delay", `${Math.random() * .55}s`);
      petal.style.setProperty("--drift", `${-65 + Math.random() * 130}px`);
      petal.style.setProperty("--size", `${7 + Math.random() * 7}px`);
      container.appendChild(petal);
    }
    container.classList.remove("is-active");
    void container.offsetWidth;
    container.classList.add("is-active");
  }

  function makeAmbientScratchPetals() {
    const container = $("#scratch-reward-petals");
    container.replaceChildren();
    for (let index = 0; index < 16; index += 1) {
      const petal = document.createElement("i");
      petal.style.setProperty("--x", `${4 + Math.random() * 92}%`);
      petal.style.setProperty("--delay", `${-Math.random() * 8}s`);
      petal.style.setProperty("--drift", `${-45 + Math.random() * 90}px`);
      petal.style.setProperty("--size", `${6 + Math.random() * 7}px`);
      petal.style.setProperty("--duration", `${6.5 + Math.random() * 4}s`);
      container.appendChild(petal);
    }
    container.classList.remove("is-active");
    container.classList.add("is-ambient");
  }

  function completeScratch() {
    if (scratchComplete) return;
    scratchComplete = true;
    scratchContext?.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    const finalPrize = scratchIndex === reasons.length - 1;
    scratchTicket.classList.add("is-complete");
    scratchTicket.classList.toggle("is-final", finalPrize);
    makeScratchSparkles(finalPrize);
    makeScratchRewardPetals(finalPrize);
    scratchSkip.hidden = true;
    scratchNext.hidden = false;
    scratchNext.textContent = finalPrize ? "Continuar a la siguiente card →" : "Siguiente razón →";
    if (navigator.vibrate) navigator.vibrate(finalPrize ? [35, 35, 55] : 35);
    if (finalPrize) {
      reasonsUnlocked = true;
      document.dispatchEvent(new Event("reasons:unlocked"));
    }
  }

  function scratchAt(event) {
    if (!scratching || scratchComplete || !scratchContext) return;
    const rect = scratchCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const radius = Math.max(25, rect.width * .085);
    scratchContext.globalCompositeOperation = "destination-out";
    scratchContext.beginPath();
    scratchContext.arc(x, y, radius, 0, Math.PI * 2);
    scratchContext.fill();
    const columnRadius = Math.ceil(radius / (rect.width / scratchColumns));
    const rowRadius = Math.ceil(radius / (rect.height / scratchRows));
    const centerColumn = Math.floor(x / rect.width * scratchColumns);
    const centerRow = Math.floor(y / rect.height * scratchRows);
    for (let column = centerColumn - columnRadius; column <= centerColumn + columnRadius; column += 1) {
      for (let row = centerRow - rowRadius; row <= centerRow + rowRadius; row += 1) {
        if (column >= 0 && column < scratchColumns && row >= 0 && row < scratchRows) scratchedCells.add(`${column}:${row}`);
      }
    }
    if (scratchedCells.size / (scratchColumns * scratchRows) >= .7) completeScratch();
  }

  function loadScratchTicket(index) {
    scratchIndex = index;
    scratchComplete = false;
    scratchedCells = new Set();
    scratchTicket.classList.remove("is-complete", "is-final", "is-scratching");
    $("#scratch-ticket-label").textContent = index === reasons.length - 1 ? "Razón final · Premio especial" : `Razón Nº ${index + 1}`;
    $("#scratch-reason-text").textContent = reasons[index] || "Porque simplemente siendo tú, ya eres una razón especial.";
    $("#scratch-count").textContent = `${index + 1} de ${reasons.length} razones`;
    $$("#scratch-dots span").forEach((dot, dotIndex) => {
      dot.classList.toggle("is-complete", dotIndex < index);
      dot.classList.toggle("is-active", dotIndex === index);
    });
    scratchSkip.hidden = false;
    scratchNext.hidden = true;
    $("#scratch-sparkles").replaceChildren();
    $("#scratch-reward-petals").classList.remove("is-active");
    makeAmbientScratchPetals();
    requestAnimationFrame(drawScratchCover);
  }

  if (!scratchContext || !("PointerEvent" in window)) scratchTicket.classList.add("no-scratch-support");
  scratchCanvas?.addEventListener("pointerdown", (event) => {
    scratching = true;
    scratchTicket.classList.add("is-scratching");
    scratchCanvas.setPointerCapture?.(event.pointerId);
    scratchAt(event);
  });
  scratchCanvas?.addEventListener("pointermove", scratchAt);
  ["pointerup", "pointercancel"].forEach((type) => scratchCanvas?.addEventListener(type, () => { scratching = false; }));
  scratchSkip.addEventListener("click", completeScratch);
  scratchNext.addEventListener("click", () => {
    if (scratchIndex < reasons.length - 1) {
      scratchTicket.classList.add("is-leaving");
      setTimeout(() => {
        scratchTicket.classList.remove("is-leaving");
        loadScratchTicket(scratchIndex + 1);
      }, reducedMotion ? 20 : 520);
    } else {
      $("#story-next").click();
    }
  });
  if (reasons.length) loadScratchTicket(0);
  else $("#scratch-reasons").hidden = true;

  const gifts = (config.gifts || []).slice(0, 3);
  const giftGame = $("#gift-game");
  const giftBoxes = $$(".gift-box", giftGame);
  const coupon = $("#love-coupon");
  const couponActions = $("#coupon-actions");
  const giftStorageKey = `yellow-flowers-gift:${config.recipient}:${config.sender}`;
  let selectedGift = -1;
  let giftPrepared = false;
  try { selectedGift = Number(localStorage.getItem(giftStorageKey) ?? -1); } catch (_) { selectedGift = -1; }

  function giftConfetti() {
    const container = $("#gift-confetti");
    container.replaceChildren();
    for (let index = 0; index < 28; index += 1) {
      const piece = document.createElement("i");
      piece.style.setProperty("--x", `${18 + Math.random() * 64}%`);
      piece.style.setProperty("--drift", `${-90 + Math.random() * 180}px`);
      piece.style.setProperty("--delay", `${Math.random() * .45}s`);
      piece.style.setProperty("--color", ["#f4bd27", "#fff0a8", "#d58b45", "#f8d85f"][index % 4]);
      container.appendChild(piece);
    }
    container.classList.remove("is-active");
    void container.offsetWidth;
    container.classList.add("is-active");
  }

  function renderGift(index, restored = false) {
    if (!gifts[index]) return;
    selectedGift = index;
    giftUnlocked = true;
    giftGame.classList.add("has-choice");
    giftBoxes.forEach((box, boxIndex) => {
      box.disabled = true;
      box.classList.toggle("is-selected", boxIndex === index);
      box.classList.toggle("is-dimmed", boxIndex !== index);
    });
    $("#gift-instruction").textContent = restored ? "Este fue el regalo que elegiste" : "Tu elección es especial";
    $("#coupon-prize").textContent = gifts[index].title;
    $("#coupon-description").textContent = gifts[index].description;
    coupon.hidden = false;
    couponActions.hidden = false;
    requestAnimationFrame(() => giftGame.classList.add("is-revealed"));
    if (!restored) giftConfetti();
    try { localStorage.setItem(giftStorageKey, String(index)); } catch (_) { /* La elección sigue funcionando sin almacenamiento. */ }
    document.dispatchEvent(new Event("gift:unlocked"));
  }

  function prepareGiftGame() {
    if (giftPrepared) return;
    giftPrepared = true;
    if (selectedGift >= 0 && selectedGift < gifts.length) return renderGift(selectedGift, true);
    giftGame.classList.add("is-shuffling");
    $("#gift-instruction").textContent = "Observa bien…";
    setTimeout(() => {
      giftGame.classList.remove("is-shuffling");
      giftGame.classList.add("is-ready");
      $("#gift-instruction").textContent = "Ahora elige tu regalo";
      giftBoxes.forEach((box) => { box.disabled = false; });
    }, reducedMotion ? 80 : 2100);
  }

  giftBoxes.forEach((box) => box.addEventListener("click", () => {
    if (!giftGame.classList.contains("is-ready") || selectedGift >= 0) return;
    renderGift(Number(box.dataset.gift));
  }));

  $("#redeem-coupon").addEventListener("click", () => {
    const gift = gifts[selectedGift];
    if (!gift) return;
    const number = String(config.whatsappNumber || "").replace(/\D/g, "");
    open(`https://wa.me/${number}?text=${encodeURIComponent(gift.whatsapp || `Hola, vengo a canjear mi cupón por ${gift.title} 🌻💛`)}`, "_blank", "noopener,noreferrer");
  });

  $("#save-coupon").addEventListener("click", () => {
    const gift = gifts[selectedGift];
    if (!gift) return;
    const escapeXml = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="#f4d25d"/><rect x="80" y="80" width="920" height="1190" rx="54" fill="#fff9df" stroke="#9b6a18" stroke-width="5" stroke-dasharray="12 13"/><text x="540" y="185" text-anchor="middle" font-family="Arial" font-size="35" letter-spacing="9" fill="#9b6a18">CUPÓN ESPECIAL</text><text x="540" y="265" text-anchor="middle" font-family="Arial" font-size="22" fill="#705025">LOVE-2109</text><text x="540" y="405" text-anchor="middle" font-family="Georgia" font-size="28" fill="#80612e">VALE POR:</text><text x="540" y="490" text-anchor="middle" font-family="Georgia" font-size="57" fill="#4e321c">${escapeXml(gift.title.toUpperCase())}</text><text x="540" y="565" text-anchor="middle" font-family="Georgia" font-size="28" fill="#76552f">${escapeXml(gift.description)}</text><line x1="190" y1="650" x2="890" y2="650" stroke="#d3b56c"/><text x="190" y="735" font-family="Arial" font-size="24" fill="#9b7a45">PARA</text><text x="350" y="735" font-family="Georgia" font-size="34" fill="#4e321c">${escapeXml(config.recipient)}</text><text x="190" y="810" font-family="Arial" font-size="24" fill="#9b7a45">DE</text><text x="350" y="810" font-family="Georgia" font-size="34" fill="#4e321c">${escapeXml(config.sender)}</text><text x="540" y="975" text-anchor="middle" font-family="Georgia" font-size="29" fill="#6e4a25">Válido cuando tú quieras</text><text x="540" y="1025" text-anchor="middle" font-family="Arial" font-size="22" fill="#9a7441">USO ÚNICO · NO CADUCA</text><text x="540" y="1160" text-anchor="middle" font-family="Georgia" font-size="64" fill="#d39a17">♥</text></svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `cupon-${config.recipient.toLowerCase().replace(/\s+/g, "-")}.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  $("#continue-to-letter").addEventListener("click", () => $("#story-next").click());

  const letterModal = $("#letter-modal");
  let lastFocused = null;
  let letterOpening = false;
  let previousMusicVolume = 1;
  $("#open-letter").addEventListener("click", async () => {
    if (letterOpening) return;
    letterOpening = true;
    lastFocused = document.activeElement;
    document.body.classList.add("letter-opening");
    $(".letter-section").classList.add("is-opening");
    await new Promise((resolve) => setTimeout(resolve, reducedMotion ? 40 : 1250));
    previousMusicVolume = audio.volume;
    audio.volume = Math.min(audio.volume, .36);
    document.body.classList.remove("letter-opening");
    document.body.classList.add("letter-is-open");
    letterModal.classList.add("is-open");
    letterModal.setAttribute("aria-hidden", "false");
    $(".letter-card").focus();
    letterOpening = false;
  });
  $$('[data-close-modal]').forEach((el) => el.addEventListener("click", () => closeDialog(letterModal)));

  function closeDialog(dialog) {
    if (dialog === photoModal) {
      dialog.classList.add("is-closing");
      dialog.classList.remove("is-open");
      dialog.setAttribute("aria-hidden", "true");
      setTimeout(() => dialog.classList.remove("is-closing"), reducedMotion ? 20 : 520);
      return;
    }
    dialog.classList.remove("is-open");
    dialog.setAttribute("aria-hidden", "true");
    if (dialog === letterModal) {
      document.body.classList.remove("letter-is-open");
      $(".letter-section").classList.remove("is-opening");
      audio.volume = previousMusicVolume;
      lastFocused?.focus();
    }
  }

  $("#letter-signature").addEventListener("click", () => {
    if (letterUnlocked) return;
    letterUnlocked = true;
    letterModal.classList.add("is-signed");
    $("#letter-final-next").hidden = false;
    const effect = $("#letter-signature-effect");
    effect.replaceChildren();
    for (let index = 0; index < 16; index += 1) {
      const petal = document.createElement("i");
      petal.style.setProperty("--x", `${20 + Math.random() * 60}%`);
      petal.style.setProperty("--delay", `${Math.random() * .35}s`);
      petal.style.setProperty("--drift", `${-50 + Math.random() * 100}px`);
      effect.appendChild(petal);
    }
    document.dispatchEvent(new Event("letter:unlocked"));
  });
  $("#letter-final-next").addEventListener("click", () => {
    closeDialog(letterModal);
    setTimeout(() => $("#story-next").click(), reducedMotion ? 30 : 460);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (letterModal.classList.contains("is-open")) closeDialog(letterModal);
      if (photoModal.classList.contains("is-open")) closeDialog(photoModal);
    }
  });
  $("#replay").addEventListener("click", () => { audio.currentTime = 0; toggleMusic(true); });

  $("#final-bouquet").addEventListener("click", () => {
    const bouquet = $("#final-bouquet");
    bouquet.classList.remove("is-touched");
    void bouquet.offsetWidth;
    bouquet.classList.add("is-touched");
    const petals = $("#final-petals");
    petals.replaceChildren();
    for (let index = 0; index < 18; index += 1) {
      const petal = document.createElement("i");
      petal.style.setProperty("--x", `${18 + Math.random() * 64}%`);
      petal.style.setProperty("--delay", `${Math.random() * .45}s`);
      petal.style.setProperty("--drift", `${-75 + Math.random() * 150}px`);
      petals.appendChild(petal);
    }
  });

  $("#restart-experience").addEventListener("click", () => {
    try { localStorage.removeItem(giftStorageKey); } catch (_) { /* El reinicio continúa aunque no haya almacenamiento. */ }
    location.reload();
  });

  $("#save-memory").addEventListener("click", async () => {
    try {
      const imageBlob = await fetch("assets/images/ramo-estefania.png").then((response) => response.blob());
      const imageData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(imageBlob);
      });
      const safe = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><defs><radialGradient id="g"><stop stop-color="#80621c"/><stop offset="1" stop-color="#211b10"/></radialGradient></defs><rect width="1080" height="1350" fill="url(#g)"/><circle cx="540" cy="595" r="390" fill="#eeb627" opacity=".12"/><text x="540" y="115" text-anchor="middle" font-family="Arial" font-size="27" letter-spacing="9" fill="#e5c567">PARA TI, SIEMPRE</text><text x="540" y="185" text-anchor="middle" font-family="Georgia" font-size="52" fill="#fff5cf">Estas flores nunca se marchitarán.</text><image href="${imageData}" x="265" y="220" width="550" height="825" preserveAspectRatio="xMidYMid meet"/><text x="540" y="1090" text-anchor="middle" font-family="Georgia" font-size="27" fill="#eee1ba">Gracias por hacer mis días más bonitos.</text><text x="540" y="1170" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="24" fill="#cdbd8e">Con cariño,</text><text x="540" y="1235" text-anchor="middle" font-family="Georgia" font-style="italic" font-size="43" fill="#f1c952">${safe(config.sender)}</text></svg>`;
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `flores-para-${String(config.recipient).toLowerCase().replace(/\s+/g, "-")}.svg`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1200);
    } catch (_) { /* La experiencia continúa si el navegador bloquea la descarga. */ }
  });

  function setupYellowUniverse() {
    const canvas = $("#yellow-universe-canvas");
    const frontCanvas = $("#yellow-universe-front");
    const section = $(".yellow-universe");
    if (!canvas || !frontCanvas || !section) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const frontCtx = frontCanvas.getContext("2d", { alpha: true });
    const phrases = (config.galaxyPhrases || []).slice(0, 36);
    const golden = ["#e5a512", "#f3c94f", "#d9940a", "#f7da73", "#c98b0c"];
    let width = 0;
    let height = 0;
    let frame = 0;
    let active = false;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let rotationX = 0;
    let rotationY = 0;
    let targetX = 0;
    let targetY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let zoom = .86;
    let targetZoom = .86;
    let pinchDistance = 0;
    let visible = false;
    let dots = [];
    let labelHits = [];
    let selectedWordId = -1;
    let highlightUntil = 0;
    let pressX = 0;
    let pressY = 0;
    const pointers = new Map();
    const flower = $(".universe-center", section);

    function makeScene() {
      const count = Math.max(70, Math.min(108, Math.round(width / 4.4)));
      const wordCount = Math.min(phrases.length, count);
      dots = Array.from({ length: count }, (_, index) => {
        const isWord = index < wordCount;
        const oppositePair = Math.min(index, wordCount - 1 - index);
        return {
          id: index,
          angle: isWord ? index * 2.399963 : Math.random() * Math.PI * 2,
          phi: isWord ? Math.acos(1 - 2 * ((index + .5) / wordCount)) : Math.acos(2 * Math.random() - 1),
          radius: isWord ? 112 + (oppositePair % 7) * 14 : 82 + Math.random() * Math.min(width * .48, 215),
          speed: (.00014 + Math.random() * .00024) * (index % 2 ? 1 : -1),
          size: 1 + Math.random() * 2.5,
          kind: isWord ? "word" : (index % 4 ? "light" : "petal"),
          text: phrases[index] || "",
          color: golden[index % golden.length],
          phase: Math.random() * Math.PI * 2
        };
      });
    }

    function resize() {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      frontCanvas.width = Math.round(width * dpr);
      frontCanvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      frontCanvas.style.width = `${width}px`;
      frontCanvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      frontCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeScene();
      if (reducedMotion) draw(0);
    }

    function roundedLabel(target, text, x, y, alpha, scale, color, highlight = 0, depth = 1) {
      target.save();
      target.globalAlpha = alpha + (1 - alpha) * highlight;
      if (depth < .9) target.filter = `blur(${(1 - depth) * 2.4}px)`;
      if (highlight > 0) {
        target.shadowColor = "rgba(255,199,34,.95)";
        target.shadowBlur = 24 * highlight;
      }
      scale *= 1 + .13 * highlight;
      target.font = `500 ${Math.max(10, 11 * scale)}px ${getComputedStyle(root).getPropertyValue('--sans')}`;
      const measure = target.measureText(text).width;
      const pad = 9 * scale;
      const h = 26 * scale;
      target.fillStyle = `rgba(255,${Math.round(253 - highlight)},${Math.round(247 - 29 * highlight)},${.78 + .2 * highlight})`;
      target.beginPath();
      target.roundRect(x - measure / 2 - pad, y - h / 2, measure + pad * 2, h, h / 2);
      target.fill();
      target.strokeStyle = `rgba(${Math.round(183 + 72 * highlight)},${Math.round(126 + 64 * highlight)},${Math.round(11 + 9 * highlight)},${.18 + .74 * highlight})`;
      target.lineWidth = 1 + highlight;
      target.stroke();
      target.fillStyle = color;
      target.textAlign = "center";
      target.textBaseline = "middle";
      target.fillText(text, x, y + .5);
      target.restore();
      return { left: x - measure / 2 - pad, right: x + measure / 2 + pad, top: y - h / 2, bottom: y + h / 2 };
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);
      frontCtx.clearRect(0, 0, width, height);
      const floatY = reducedMotion ? 0 : -5 + Math.cos(time * Math.PI * 2 / 3600) * 5;
      const cx = width / 2;
      const cy = height * .5 + floatY;
      labelHits = [];
      if (!dragging) {
        targetX += velocityX;
        targetY += velocityY;
        velocityX *= .94;
        velocityY *= .94;
      }
      rotationX += (targetX - rotationX) * .09;
      rotationY += (targetY - rotationY) * .09;
      zoom += (targetZoom - zoom) * .08;
      flower.style.left = `${cx}px`;
      flower.style.top = `${cy}px`;
      flower.style.setProperty("--flower-x", "0px");
      flower.style.setProperty("--flower-y", "0px");
      flower.style.setProperty("--flower-scale", String(.86 + zoom * .08));
      flower.style.setProperty("--flower-tilt-x", `${Math.sin(rotationY) * -5}deg`);
      flower.style.setProperty("--flower-tilt-y", `${Math.sin(rotationX) * 6}deg`);
      section.style.setProperty("--scene-x", `${Math.sin(rotationX) * 18}px`);
      section.style.setProperty("--scene-y", `${Math.sin(rotationY) * 12}px`);

      const projectPoint = (x, y, z) => {
        const cosY = Math.cos(rotationX), sinY = Math.sin(rotationX);
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const cosX = Math.cos(rotationY), sinX = Math.sin(rotationY);
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const depth = Math.max(.42, Math.min(1.72, 320 / (320 + z2)));
        return { px: cx + x1 * depth * zoom, py: cy + y1 * depth * zoom, depth };
      };

      // Los anillos usan exactamente la misma cámara 3D que mensajes y pétalos.
      [
        { radius: 104, tilt: .48, turn: -.3, alpha: .25 },
        { radius: 154, tilt: -.34, turn: .2, alpha: .18 },
        { radius: 204, tilt: .68, turn: .55, alpha: .12 }
      ].forEach((ring, ringIndex) => {
        ctx.save();
        ctx.beginPath();
        for (let step = 0; step <= 96; step += 1) {
          const angle = (step / 96) * Math.PI * 2;
          const planeX = Math.cos(angle) * ring.radius;
          const planeZ = Math.sin(angle) * ring.radius;
          const tiltedY = planeZ * Math.sin(ring.tilt);
          const tiltedZ = planeZ * Math.cos(ring.tilt);
          const x = planeX * Math.cos(ring.turn) - tiltedY * Math.sin(ring.turn);
          const y = planeX * Math.sin(ring.turn) + tiltedY * Math.cos(ring.turn);
          const point = projectPoint(x, y, tiltedZ);
          if (step === 0) ctx.moveTo(point.px, point.py);
          else ctx.lineTo(point.px, point.py);
        }
        ctx.strokeStyle = `rgba(221,159,24,${ring.alpha})`;
        ctx.lineWidth = ringIndex === 0 ? 1.5 : 1;
        ctx.shadowColor = "rgba(247,194,51,.5)";
        ctx.shadowBlur = ringIndex === 0 ? 10 : 4;
        ctx.stroke();
        ctx.restore();
      });

      const ordered = dots.map((dot) => {
        if (!reducedMotion) dot.angle += dot.speed * 16;
        const sinPhi = Math.sin(dot.phi);
        const x = dot.radius * sinPhi * Math.cos(dot.angle);
        const y = dot.radius * Math.cos(dot.phi);
        const z = dot.radius * sinPhi * Math.sin(dot.angle);
        const projected = projectPoint(x, y, z);
        return {
          ...dot,
          ...projected
        };
      }).sort((a, b) => a.depth - b.depth);

      ordered.forEach((dot) => {
        const target = dot.depth > 1.02 ? frontCtx : ctx;
        const pulse = .82 + .18 * Math.sin(time * .0015 + dot.phase);
        const alpha = (.2 + dot.depth * .72) * pulse;
        if (dot.kind === "word") {
          const remaining = dot.id === selectedWordId ? highlightUntil - time : 0;
          const highlight = remaining > 0 ? Math.min(1, remaining / 1500) : 0;
          const steadyAlpha = Math.max(.42, Math.min(.96, .34 + dot.depth * .43));
          const hit = roundedLabel(target, dot.text, dot.px, dot.py, steadyAlpha, .52 + dot.depth * .48, dot.color, highlight, dot.depth);
          labelHits.push({ ...hit, id: dot.id });
        } else if (dot.kind === "petal") {
          target.save();
          target.translate(dot.px, dot.py);
          target.rotate(dot.angle * 1.7);
          target.globalAlpha = alpha;
          if (dot.depth < .82) target.filter = `blur(${(1 - dot.depth) * 2}px)`;
          target.fillStyle = dot.color;
          target.beginPath();
          target.ellipse(0, 0, 3.5 * dot.depth, 8 * dot.depth, .5, 0, Math.PI * 2);
          target.fill();
          target.restore();
        } else {
          target.save();
          target.globalAlpha = alpha;
          target.shadowColor = dot.color;
          target.shadowBlur = Math.max(0, (dot.depth - .75) * 7);
          target.fillStyle = dot.color;
          target.beginPath();
          target.arc(dot.px, dot.py, dot.size * dot.depth, 0, Math.PI * 2);
          target.fill();
          target.restore();
        }
      });
      ctx.globalAlpha = 1;
      frontCtx.globalAlpha = 1;
      if (active && visible && !reducedMotion) frame = requestAnimationFrame(draw);
    }

    function down(event) {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      pressX = event.clientX;
      pressY = event.clientY;
      velocityX = velocityY = 0;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      }
      canvas.setPointerCapture?.(event.pointerId);
    }
    function move(event) {
      if (!pointers.has(event.pointerId)) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDistance) targetZoom = Math.max(.72, Math.min(1.42, targetZoom + (distance - pinchDistance) * .0035));
        pinchDistance = distance;
        return;
      }
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      velocityX = dx * .0048;
      velocityY = dy * .0032;
      targetX += velocityX;
      targetY = Math.max(-1.15, Math.min(1.15, targetY + velocityY));
      lastX = event.clientX;
      lastY = event.clientY;
    }
    function up(event) {
      const wasTap = pointers.size === 1 && Math.hypot(event.clientX - pressX, event.clientY - pressY) < 12;
      if (wasTap) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const hit = [...labelHits].reverse().find((label) => x >= label.left - 8 && x <= label.right + 8 && y >= label.top - 8 && y <= label.bottom + 8);
        if (hit) {
          selectedWordId = hit.id;
          highlightUntil = performance.now() + 3200;
          if (reducedMotion) {
            draw(performance.now());
            setTimeout(() => { selectedWordId = -1; draw(performance.now()); }, 3250);
          }
        }
      }
      pointers.delete(event.pointerId);
      dragging = pointers.size > 0;
      pinchDistance = 0;
      if (dragging) {
        const remaining = [...pointers.values()][0];
        lastX = remaining.x;
        lastY = remaining.y;
      }
    }
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("wheel", (event) => {
      targetZoom = Math.max(.72, Math.min(1.42, targetZoom - event.deltaY * .001));
    }, { passive: true });
    addEventListener("resize", resize, { passive: true });

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && active && !frame && !reducedMotion) frame = requestAnimationFrame(draw);
      if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: .08 });
    visibilityObserver.observe(section);
    resize();
    startUniverse = () => {
      active = true;
      if (visible && !reducedMotion && !frame) frame = requestAnimationFrame(draw);
    };
  }

  const threeUniverseStart = window.createYellowUniverse3D?.({ config, reducedMotion });
  if (threeUniverseStart) startUniverse = threeUniverseStart;
  else setupYellowUniverse();

  function setupGrowingGarden() {
    const frame = $("#growing-garden");
    if (!frame) return;
    frame.addEventListener("load", () => {
      frame.contentWindow?.postMessage({ type: "garden-config", message: config.gardenMessage }, location.origin);
    });
    const loadGarden = () => {
      if (!frame.src) frame.src = frame.dataset.src;
    };
    if (!("IntersectionObserver" in window)) return loadGarden();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { loadGarden(); observer.disconnect(); }
    }, { rootMargin: "300px" });
    observer.observe(frame);
  }

  setupGrowingGarden();

  function setupWrappedStories() {
    const cards = $$("#experience > section");
    const segments = $("#story-segments");
    const counter = $("#story-count");
    const nextButton = $("#story-next");
    const experience = $("#experience");
    let activeCard = 0;
    let touchStart = null;
    let chromeTimer = 0;

    wakeStoryControls = () => {
      $("#story-progress").classList.remove("is-idle");
      nextButton.classList.remove("is-idle");
      clearTimeout(chromeTimer);
      if (experience.getAttribute("aria-hidden") === "false") {
        chromeTimer = setTimeout(() => {
          $("#story-progress").classList.add("is-idle");
          nextButton.classList.add("is-idle");
        }, 1900);
      }
    };

    cards.forEach((card, index) => {
      card.classList.add("wrapped-card");
      card.dataset.story = String(index + 1).padStart(2, "0");
      const segment = document.createElement("button");
      segment.type = "button";
      segment.setAttribute("aria-label", `Ir a la historia ${index + 1}`);
      segment.addEventListener("click", () => showCard(index));
      segments.appendChild(segment);
    });

    function showCard(index) {
      wakeStoryControls();
      const nextIndex = (index + cards.length) % cards.length;
      const movingForward = nextIndex > activeCard || (activeCard === cards.length - 1 && nextIndex === 0);
      activeCard = nextIndex;
      document.body.classList.toggle("scratch-card-active", activeCard === 3);
      document.body.classList.toggle("garden-card-active", activeCard === 4);
      document.body.classList.toggle("final-card-active", activeCard === cards.length - 1);
      cards.forEach((card, i) => {
        const isActive = i === activeCard;
        card.classList.toggle("is-active", isActive);
        card.classList.toggle("is-before", !isActive && (movingForward ? i < activeCard : i <= activeCard));
        card.classList.toggle("is-after", !isActive && !card.classList.contains("is-before"));
        card.setAttribute("aria-hidden", String(!isActive));
        card.inert = !isActive;
      });
      const gardenFrame = $("#growing-garden", cards[activeCard]);
      if (gardenFrame && !gardenFrame.src) gardenFrame.src = gardenFrame.dataset.src;
      const last = activeCard === cards.length - 1;
      $$("button", segments).forEach((segment, i) => {
        segment.classList.toggle("is-complete", i < activeCard);
        segment.classList.toggle("is-active", i === activeCard);
        if (i === activeCard) segment.setAttribute("aria-current", "step");
        else segment.removeAttribute("aria-current");
      });
      counter.textContent = `${String(activeCard + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
      nextButton.classList.toggle("is-last", last);
      nextButton.classList.toggle("is-emphasized", activeCard === 1);
      const cardLocked = (activeCard === 3 && !reasonsUnlocked) || (activeCard === 5 && !giftUnlocked) || (activeCard === 6 && !letterUnlocked);
      nextButton.disabled = cardLocked;
      nextButton.classList.toggle("is-locked", cardLocked);
      if (activeCard === 1) window.playYellowUniverseIntro?.();
      if (activeCard === 5) prepareGiftGame();
      if (activeCard === cards.length - 1) {
        const finalCard = cards[activeCard];
        finalCard.classList.remove("is-final-playing");
        void finalCard.offsetWidth;
        finalCard.classList.add("is-final-playing");
      }
      nextButton.querySelector("span").textContent = last ? "↻" : "→";
      nextButton.setAttribute("aria-label", last ? "Volver a la primera historia" : "Siguiente historia");
    }

    nextButton.addEventListener("click", () => {
      if (nextButton.disabled) return;
      const nextIndex = activeCard === cards.length - 1 ? 0 : activeCard + 1;
      showCard(nextIndex);
    });
    document.addEventListener("reasons:unlocked", () => {
      if (activeCard !== 3) return;
      nextButton.disabled = false;
      nextButton.classList.remove("is-locked");
      wakeStoryControls();
    });
    document.addEventListener("gift:unlocked", () => {
      if (activeCard !== 5) return;
      nextButton.disabled = false;
      nextButton.classList.remove("is-locked");
      wakeStoryControls();
    });
    document.addEventListener("letter:unlocked", () => {
      if (activeCard !== 6) return;
      nextButton.disabled = false;
      nextButton.classList.remove("is-locked");
      wakeStoryControls();
    });
    document.addEventListener("keydown", (event) => {
      if ($("#experience").getAttribute("aria-hidden") === "true") return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") nextButton.click();
      if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
        const previous = activeCard === 0 ? cards.length - 1 : activeCard - 1;
        showCard(previous);
      }
    });
    experience.addEventListener("pointerdown", (event) => {
      wakeStoryControls();
      if (activeCard === 1) { touchStart = null; return; }
      if (event.target.closest("button, canvas, iframe, .gallery, .reason-card, .letter-envelope, .memory-stage, .scratch-ticket")) return;
      touchStart = { x: event.clientX, y: event.clientY };
    });
    experience.addEventListener("pointerup", (event) => {
      if (activeCard === 1) { touchStart = null; return; }
      if (!touchStart) return;
      const dx = event.clientX - touchStart.x;
      const dy = event.clientY - touchStart.y;
      touchStart = null;
      if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy)) return;
      showCard(dx < 0 ? activeCard + 1 : activeCard - 1);
    });
    addEventListener("wheel", wakeStoryControls, { passive: true });
    addEventListener("touchmove", wakeStoryControls, { passive: true });
    addEventListener("scroll", wakeStoryControls, { passive: true, capture: true });
    showCard(0);
  }

  setupWrappedStories();
})();
