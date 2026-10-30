/*
  DIWALI WISHES 2026
  Complete English-only application script.
  Features: personalized sender preview, greeting creation, WhatsApp sharing,
  copy greeting, share-button guidance, and animated fireworks.
*/

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const nameInput = $("nameInput");
  const createBtn = $("createBtn");
  const welcome = $("welcome");
  const greeting = $("greeting");
  const error = $("error");
  const params = new URLSearchParams(window.location.search);
  const sender = (params.get("from") || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 32);
  let currentName = "";

  // Show the greeting preview when a visitor arrives through a shared link.
  if (sender) {
    const introText = $("introText");
    const senderPreview = $("senderPreview");
    const senderName = $("senderName");
    const senderSignature = $("senderSignature");
    const makeOwnBtn = $("makeOwnBtn");

    if (introText) {
      introText.textContent = `A little Diwali light comes to you from ${sender}. Enjoy their wish, then create one of your own to share.`;
    }
    if (senderPreview) senderPreview.classList.remove("hidden");
    if (senderName) senderName.textContent = sender;
    if (senderSignature) senderSignature.textContent = sender;

    if (makeOwnBtn) {
      makeOwnBtn.addEventListener("click", () => {
        const nameCard = $("nameCard");
        if (nameCard) nameCard.scrollIntoView({ behavior: "smooth", block: "center" });
        if (nameInput) nameInput.focus({ preventScroll: true });
      });
    }
  }

  function cleanName(value) {
    return String(value || "")
      .replace(/[<>]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 32);
  }

  function makeShareUrl(name) {
    const url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    url.searchParams.set("from", name);
    return url.toString();
  }

  function greetingText(name) {
    return `🪔✨ HAPPY DIWALI 2026! ✨🪔\n\nDear ${name},\n\nMay your life shine brighter than a thousand diyas. May happiness fill your home, peace warm your heart, and every new beginning bring success and prosperity.\n\nWishing you and your loved ones a beautiful, joyful and prosperous Diwali.\n\nWith love & light,\n${name}\n\nNow it is your turn! Create your own Diwali greeting and share it with your friends and family:\n${makeShareUrl(name)}`;
  }

  function showToast(message) {
    const toast = $("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function guideToShareButton() {
    const shareGuide = $("shareGuide");
    const shareBtn = $("shareBtn");
    if (!shareGuide || !shareBtn) return;

    shareGuide.classList.add("show");
    shareBtn.classList.add("share-highlight");

    // Wait for the greeting to become visible, then bring the share action into view.
    window.setTimeout(() => {
      shareBtn.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  }

  function createGreeting() {
    if (!nameInput || !welcome || !greeting) return;
    const name = cleanName(nameInput.value);

    if (!name) {
      if (error) error.textContent = "Please enter your name to create your Diwali wish.";
      nameInput.focus();
      return;
    }

    currentName = name;
    if (error) error.textContent = "";
    if ($("receiverName")) $("receiverName").textContent = name;
    if ($("signatureName")) $("signatureName").textContent = name;

    welcome.classList.add("hidden");
    greeting.classList.remove("hidden");

    launchFireworks();
    guideToShareButton();
  }

  if (createBtn) createBtn.addEventListener("click", createGreeting);
  if (nameInput) {
    nameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") createGreeting();
    });
  }

  const againBtn = $("againBtn");
  if (againBtn) {
    againBtn.addEventListener("click", () => {
      if (greeting) greeting.classList.add("hidden");
      if ($("shareGuide")) $("shareGuide").classList.remove("show");
      if ($("shareBtn")) $("shareBtn").classList.remove("share-highlight");
      if (welcome) welcome.classList.remove("hidden");
      if (nameInput) {
        nameInput.value = "";
        nameInput.focus();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const shareBtn = $("shareBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      if (!currentName) return;
      const message = greetingText(currentName);
      shareBtn.classList.remove("share-highlight");
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  const copyBtn = $("copyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      if (!currentName) return;
      const textToCopy = greetingText(currentName);
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          const temporary = document.createElement("textarea");
          temporary.value = textToCopy;
          temporary.setAttribute("readonly", "");
          temporary.style.position = "fixed";
          temporary.style.opacity = "0";
          document.body.appendChild(temporary);
          temporary.select();
          const copied = document.execCommand("copy");
          temporary.remove();
          if (!copied) throw new Error("Clipboard copy failed");
        }
        showToast("Your Diwali greeting has been copied!");
      } catch (copyError) {
        showToast("Copy is unavailable. Please use WhatsApp Share.");
      }
    });
  }

  // -------------------------------------------------------------------------
  // FIREWORKS ENGINE
  // Uses an independent full-screen canvas and does not require any library.
  // -------------------------------------------------------------------------
  let canvas = $("fireworks");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "fireworks";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext ? canvas.getContext("2d", { alpha: true }) : null;
  const colors = ["#ffd76a", "#ff8a3d", "#ff4f81", "#ffffff", "#62e6ff", "#c69cff", "#9cffb5"];
  let particles = [];
  let rockets = [];
  let animationId = 0;
  let lastFrame = 0;
  let fireworksRunning = false;

  function resizeFireworksCanvas() {
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "8";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createBurst(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const particleCount = 85;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.08;
      const speed = 1.4 + Math.random() * 4.8;
      const life = 48 + Math.random() * 34;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.045 + Math.random() * 0.025,
        drag: 0.985,
        life,
        maxLife: life,
        radius: 1.2 + Math.random() * 1.8,
        color: Math.random() < 0.72 ? color : colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Small bright stars create the sparkling finish of each burst.
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2.6;
      const life = 25 + Math.random() * 20;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.025,
        drag: 0.97,
        life,
        maxLife: life,
        radius: 1.8 + Math.random() * 1.5,
        color: "#fff8dc"
      });
    }
  }

  function launchRocket(targetX, targetY, delay) {
    window.setTimeout(() => {
      if (!ctx) return;
      rockets.push({
        x: targetX,
        y: window.innerHeight + 8,
        targetX,
        targetY,
        speed: 7 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: []
      });
      startAnimation();
    }, delay);
  }

  function startAnimation() {
    if (!ctx || animationId) return;
    fireworksRunning = true;
    lastFrame = 0;
    animationId = window.requestAnimationFrame(animateFireworks);
  }

  function launchFireworks() {
    if (!ctx) return;
    resizeFireworksCanvas();

    const width = window.innerWidth;
    const height = window.innerHeight;
    // Rockets travel upward and burst at different positions across the screen.
    for (let i = 0; i < 7; i++) {
      const targetX = width * (0.12 + Math.random() * 0.76);
      const targetY = height * (0.12 + Math.random() * 0.42);
      launchRocket(targetX, targetY, i * 260);
    }

    // Add a few immediate bursts so the celebration is visible at once.
    for (let i = 0; i < 3; i++) {
      window.setTimeout(() => {
        createBurst(width * (0.18 + Math.random() * 0.64), height * (0.16 + Math.random() * 0.32));
        startAnimation();
      }, 180 + i * 480);
    }
  }

  function animateFireworks(timestamp) {
    if (!ctx) {
      animationId = 0;
      return;
    }

    const delta = lastFrame ? Math.min((timestamp - lastFrame) / 16.67, 2) : 1;
    lastFrame = timestamp;
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    // Draw rising rockets and turn each one into a bright particle burst.
    rockets = rockets.filter((rocket) => {
      const dx = rocket.targetX - rocket.x;
      const dy = rocket.targetY - rocket.y;
      const distance = Math.hypot(dx, dy);
      rocket.trail.push({ x: rocket.x, y: rocket.y });
      if (rocket.trail.length > 7) rocket.trail.shift();

      rocket.x += (dx / Math.max(distance, 1)) * rocket.speed * delta;
      rocket.y += (dy / Math.max(distance, 1)) * rocket.speed * delta;

      ctx.beginPath();
      rocket.trail.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = rocket.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.65;
      ctx.shadowBlur = 12;
      ctx.shadowColor = rocket.color;
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(rocket.x, rocket.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      if (distance < 13) {
        createBurst(rocket.x, rocket.y);
        return false;
      }
      return rocket.y > -20;
    });

    // Draw and update the explosion particles.
    particles = particles.filter((particle) => particle.life > 0);
    for (const particle of particles) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += particle.gravity * delta;
      particle.vx *= Math.pow(particle.drag, delta);
      particle.vy *= Math.pow(particle.drag, delta);
      particle.life -= delta;

      const alpha = Math.max(0, Math.min(1, particle.life / particle.maxLife));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 13;
      ctx.shadowColor = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "source-over";

    if (particles.length > 0 || rockets.length > 0) {
      animationId = window.requestAnimationFrame(animateFireworks);
    } else {
      animationId = 0;
      fireworksRunning = false;
      lastFrame = 0;
      ctx.clearRect(0, 0, width, height);
    }
  }

  if (ctx) {
    resizeFireworksCanvas();
    window.addEventListener("resize", resizeFireworksCanvas, { passive: true });

    // A visitor opening a personalized link sees fireworks automatically.
    if (sender) {
      const startOnLoad = () => window.setTimeout(launchFireworks, 450);
      if (document.readyState === "complete") startOnLoad();
      else window.addEventListener("load", startOnLoad, { once: true });
    }
  }
})();
