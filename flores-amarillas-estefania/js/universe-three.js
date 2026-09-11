(() => {
  "use strict";

  window.createYellowUniverse3D = ({ config, reducedMotion }) => {
    const THREE = window.THREE;
    const canvas = document.querySelector("#yellow-universe-canvas");
    const frontCanvas = document.querySelector("#yellow-universe-front");
    const section = document.querySelector(".yellow-universe");
    const flower = document.querySelector(".universe-center", section);
    const intro = document.querySelector(".universe-intro");
    if (!THREE || !canvas || !section || !flower || !intro) return null;

    document.body.appendChild(intro);

    frontCanvas.style.display = "none";
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, .1, 4000);
    const world = new THREE.Group();
    scene.add(world);

    const words = [];
    const phrases = (config.galaxyPhrases || []).slice(0, 42);
    const gold = [0xf0b51c, 0xffd85c, 0xd99a0b, 0xffe38a, 0xc88408];

    function textTexture(text, color) {
      const surface = document.createElement("canvas");
      surface.width = 640;
      surface.height = 150;
      const context = surface.getContext("2d");
      context.font = "600 44px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = "rgba(255,253,239,.94)";
      context.shadowColor = "rgba(238,174,24,.88)";
      context.shadowBlur = 22;
      context.fillText(text, 320, 75);
      context.shadowBlur = 0;
      context.strokeStyle = color;
      context.lineWidth = 1;
      context.strokeText(text, 320, 75);
      const texture = new THREE.CanvasTexture(surface);
      texture.minFilter = THREE.LinearFilter;
      return texture;
    }

    phrases.forEach((text, index) => {
      const material = new THREE.SpriteMaterial({ map: textTexture(text, `#${gold[index % gold.length].toString(16)}`), transparent: true, depthWrite: false, opacity: .9 });
      const sprite = new THREE.Sprite(material);
      const count = phrases.length;
      const y = 1 - 2 * ((index + .5) / count);
      const phi = Math.acos(y);
      const theta = index * 2.399963;
      const pair = Math.min(index, count - 1 - index);
      const radius = 165 + (pair % 6) * 20;
      sprite.position.set(radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
      sprite.scale.set(104, 25, 1);
      sprite.userData = { theta, phi, radius, speed: (.00013 + Math.random() * .00011) * (index % 2 ? 1 : -1), baseScale: 1, glow: 0 };
      words.push(sprite);
      world.add(sprite);
    });

    const starPositions = new Float32Array(900);
    for (let index = 0; index < 300; index += 1) {
      const radius = 130 + Math.random() * 350;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[index * 3 + 1] = radius * Math.cos(phi);
      starPositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    world.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xf5bd29, size: 2.2, transparent: true, opacity: .72, depthWrite: false })));

    function petalTexture() {
      const surface = document.createElement("canvas");
      surface.width = surface.height = 64;
      const context = surface.getContext("2d");
      context.translate(32, 32);
      context.rotate(-.6);
      context.fillStyle = "#f4b816";
      context.beginPath();
      context.ellipse(0, 0, 8, 23, 0, 0, Math.PI * 2);
      context.fill();
      return new THREE.CanvasTexture(surface);
    }
    const petalMap = petalTexture();
    for (let index = 0; index < 48; index += 1) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: petalMap, transparent: true, depthWrite: false, opacity: .82 }));
      const radius = 125 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      sprite.position.set(radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
      sprite.scale.set(10 + Math.random() * 9, 20 + Math.random() * 14, 1);
      sprite.userData.spin = (Math.random() - .5) * .012;
      world.add(sprite);
    }

    const rings = new THREE.Group();
    [[62, 69, .3], [77, 82, .2], [92, 95, .11]].forEach(([inner, outer, opacity], index) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 128), new THREE.MeshBasicMaterial({ color: 0xe7aa18, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false }));
      ring.rotation.x = Math.PI / 2 + (index - 1) * .055;
      ring.rotation.z = -.12 + index * .045;
      rings.add(ring);
    });
    world.add(rings);

    let width = 1;
    let height = 1;
    let active = false;
    let visible = false;
    let dragging = false;
    let moved = false;
    let lastX = 0;
    let lastY = 0;
    let rotX = .12;
    let rotY = 0;
    let targetX = .12;
    let targetY = 0;
    let distance = 470;
    let targetDistance = 470;
    let frame = 0;
    let heldWord = null;
    let introTimer = 0;
    let introEndTimer = 0;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function wordAt(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(words, false)[0]?.object || null;
    }

    function resize() {
      width = Math.max(1, section.clientWidth);
      height = Math.max(1, section.clientHeight);
      renderer.setSize(width, height, false);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function render(time = 0) {
      rotX += (targetX - rotX) * .08;
      rotY += (targetY - rotY) * .08;
      distance += (targetDistance - distance) * .07;
      world.rotation.x = rotX;
      world.rotation.y = rotY;
      words.forEach((sprite) => {
        if (!reducedMotion) sprite.userData.theta += sprite.userData.speed * 16;
        const data = sprite.userData;
        sprite.position.x = data.radius * Math.sin(data.phi) * Math.cos(data.theta);
        sprite.position.z = data.radius * Math.sin(data.phi) * Math.sin(data.theta);
        data.glow = sprite === heldWord ? 1 : data.glow * .965;
        const scale = 1 + data.glow * .18;
        sprite.scale.set(104 * scale, 25 * scale, 1);
        sprite.material.opacity = .72 + data.glow * .28;
      });
      rings.children[0].rotation.z += reducedMotion ? 0 : .00042;
      rings.children[1].rotation.z -= reducedMotion ? 0 : .0003;
      rings.children[2].rotation.z += reducedMotion ? 0 : .0002;
      camera.position.set(0, 0, distance);
      camera.lookAt(0, 0, 0);
      const floatY = reducedMotion ? 0 : Math.sin(time * .0018) * 7;
      flower.style.left = `${width / 2}px`;
      flower.style.top = `${height / 2 + floatY}px`;
      flower.style.setProperty("--flower-x", "0px");
      flower.style.setProperty("--flower-y", "0px");
      flower.style.setProperty("--flower-scale", "1");
      flower.style.setProperty("--flower-tilt-x", `${rotX * -5}deg`);
      flower.style.setProperty("--flower-tilt-y", `${rotY * 5}deg`);
      renderer.render(scene, camera);
      if (active && visible && !reducedMotion) frame = requestAnimationFrame(render);
    }

    canvas.addEventListener("pointerdown", (event) => {
      heldWord = wordAt(event);
      if (heldWord) {
        heldWord.userData.savedSpeed = heldWord.userData.speed;
        heldWord.userData.speed = 0;
        heldWord.userData.glow = 1;
        canvas.setPointerCapture?.(event.pointerId);
        return;
      }
      dragging = true;
      moved = false;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture?.(event.pointerId);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (heldWord) return;
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      if (Math.hypot(dx, dy) > 3) moved = true;
      targetY += dx / Math.max(width, 1) * 3;
      targetX = Math.max(-1.15, Math.min(1.15, targetX + dy / Math.max(height, 1) * 2.2));
      lastX = event.clientX;
      lastY = event.clientY;
    });
    canvas.addEventListener("pointerup", (event) => {
      if (heldWord) {
        heldWord.userData.speed = heldWord.userData.savedSpeed;
        heldWord.userData.glow = 1;
        heldWord = null;
        return;
      }
      dragging = false;
      if (moved) return;
      const hit = wordAt(event);
      if (hit) hit.userData.glow = 1;
    });
    canvas.addEventListener("pointercancel", () => {
      dragging = false;
      if (heldWord) {
        heldWord.userData.speed = heldWord.userData.savedSpeed;
        heldWord.userData.glow = 1;
        heldWord = null;
      }
    });
    canvas.addEventListener("wheel", (event) => {
      targetDistance = Math.max(300, Math.min(720, targetDistance + event.deltaY * .35));
    }, { passive: true });
    addEventListener("resize", resize, { passive: true });

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && active && !frame && !reducedMotion) frame = requestAnimationFrame(render);
      if (!visible && frame) { cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: .08 }).observe(section);

    resize();
    if (reducedMotion) render(0);
    section.classList.add("has-three-universe");
    window.playYellowUniverseIntro = () => {
      clearTimeout(introTimer);
      clearTimeout(introEndTimer);
      section.classList.remove("is-intro-playing", "is-intro-revealing", "is-universe-visible");
      section.classList.add("is-universe-waiting");
      intro.classList.remove("is-intro-playing", "is-intro-revealing");
      void intro.offsetWidth;
      section.classList.add("is-intro-playing");
      intro.classList.add("is-intro-playing");
      introTimer = setTimeout(() => {
        section.classList.add("is-intro-revealing");
        intro.classList.add("is-intro-revealing");
      }, 3900);
      introEndTimer = setTimeout(() => {
        section.classList.remove("is-intro-playing", "is-intro-revealing");
        section.classList.remove("is-universe-waiting");
        section.classList.add("is-universe-visible");
        intro.classList.remove("is-intro-playing", "is-intro-revealing");
      }, 5450);
    };
    return () => {
      active = true;
      resize();
      if (!reducedMotion && visible && !frame) frame = requestAnimationFrame(render);
    };
  };
})();
