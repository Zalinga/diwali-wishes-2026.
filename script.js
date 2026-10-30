const $ = (id) => document.getElementById(id);
const nameInput = $("nameInput");
const createBtn = $("createBtn");
const welcome = $("welcome");
const greeting = $("greeting");
const error = $("error");
const params = new URLSearchParams(window.location.search);
const sender = (params.get("from") || "").trim().slice(0, 32);
let currentName = "";

if (sender) {
  $("introText").textContent = `A little Diwali light comes to you from ${sender}. Enjoy their wish, then create one of your own to share.`;
  $("senderPreview").classList.remove("hidden");
  $("senderName").textContent = sender;
  $("senderSignature").textContent = sender;
  $("makeOwnBtn").addEventListener("click", () => {
    $("nameCard").scrollIntoView({ behavior: "smooth", block: "center" });
    nameInput.focus({ preventScroll: true });
  });
}

function cleanName(value) {
  return value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 32);
}
function greetingText(name) {
  return `🪔✨ HAPPY DIWALI 2026! ✨🪔\n\nDear ${name},\n\nMay your life shine brighter than a thousand diyas. May happiness fill your home, peace warm your heart, and every new beginning bring success and prosperity.\n\nWishing you and your loved ones a beautiful, joyful and prosperous Diwali.\n\nWith love & light,\n${name}\n\nNow it's your turn! Enter your name and send your own Diwali greeting to your friends:\n${makeShareUrl(name)}`;
}
function makeShareUrl(name) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("from", name);
  return url.toString();
}
function createGreeting() {
  const name = cleanName(nameInput.value);
  if (!name) {
    error.textContent = "Please enter your name to create your Diwali wish.";
    nameInput.focus();
    return;
  }
  currentName = name;
  error.textContent = "";
  $("receiverName").textContent = name;
  $("signatureName").textContent = name;
  welcome.classList.add("hidden");
  greeting.classList.remove("hidden");
  launchFireworks();
  guideToShareButton();
}
function guideToShareButton() {
  const shareArea = document.querySelector(".share-area");
  const shareGuide = $("shareGuide");
  const shareBtn = $("shareBtn");
  if (!shareArea || !shareGuide || !shareBtn) return;

  shareGuide.classList.add("show");
  shareBtn.classList.add("share-highlight");

  // Let the greeting become visible before smoothly bringing Share into view.
  window.setTimeout(() => {
    shareBtn.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 250);
}

createBtn.addEventListener("click", createGreeting);
nameInput.addEventListener("keydown", (event) => { if (event.key === "Enter") createGreeting(); });
$("againBtn").addEventListener("click", () => {
  greeting.classList.add("hidden");
  $("shareGuide").classList.remove("show");
  $("shareBtn").classList.remove("share-highlight");
  welcome.classList.remove("hidden");
  nameInput.value = "";
  nameInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("shareBtn").addEventListener("click", () => {
  if (!currentName) return;
  const message = greetingText(currentName);
  $("shareBtn").classList.remove("share-highlight");
  const url = "https://wa.me/?text=" + encodeURIComponent(message);
  window.open(url, "_blank", "noopener,noreferrer");
});
$("copyBtn").addEventListener("click", async () => {
  if (!currentName) return;
  try {
    await navigator.clipboard.writeText(greetingText(currentName));
    showToast("Your Diwali greeting has been copied!");
  } catch {
    showToast("Copy isn't available in this browser. Use WhatsApp Share.");
  }
});
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}

// Reliable, colorful Diwali fireworks (no external library required).
// The canvas is resized for high-DPI screens and fireworks run both when
// someone opens a shared ?from= link and after they create their own wish.
const canvas = $("fireworks");
const ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
let particles = [];
let animationFrame = null;
let lastFrameTime = 0;
const FIREWORK_COLORS = ["#ffd76a", "#ff8a3d", "#ff4f81", "#ffffff", "#62e6ff", "#c69cff"];

function resizeFireworksCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function addFireworkBurst(x, y) {
  const count = 72;
  const baseHue = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.12;
    const speed = 1.5 + Math.random() * 4.2;
    const life = 55 + Math.floor(Math.random() * 35);
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      gravity: 0.035 + Math.random() * 0.025,
      drag: 0.985 + Math.random() * 0.01,
      life,
      maxLife: life,
      radius: 1.2 + Math.random() * 2.1,
      color: Math.random() < 0.72 ? baseHue : FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)]
    });
  }
  // Add a few bright central stars for a more cracker-like sparkle.
  for (let i = 0; i < 12; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2.2;
    particles.push({
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      gravity: 0.02, drag: 0.97, life: 28 + Math.random() * 18,
      maxLife: 48, radius: 2 + Math.random() * 1.8, color: "#fff7d6"
    });
  }
}

function launchFireworks() {
  if (!canvas || !ctx) return;
  const width = window.innerWidth;
  const height = window.innerHeight;
  // Launch several separate bursts over a short celebration sequence.
  for (let burst = 0; burst < 5; burst++) {
    window.setTimeout(() => {
      const x = width * (0.12 + Math.random() * 0.76);
      const y = height * (0.12 + Math.random() * 0.42);
      addFireworkBurst(x, y);
      if (animationFrame === null) {
        lastFrameTime = 0;
        animationFrame = requestAnimationFrame(animateFireworks);
      }
    }, burst * 420);
  }
}

function animateFireworks(timestamp) {
  if (!ctx || !canvas) {
    animationFrame = null;
    return;
  }
  // Cap frame delta so particles remain smooth on slower mobile devices.
  const delta = lastFrameTime ? Math.min((timestamp - lastFrameTime) / 16.67, 2) : 1;
  lastFrameTime = timestamp;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    p.vy += p.gravity * delta;
    p.vx *= Math.pow(p.drag, delta);
    p.vy *= Math.pow(p.drag, delta);
    p.life -= delta;

    const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 12;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * (0.55 + alpha * 0.45), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  if (particles.length) {
    animationFrame = requestAnimationFrame(animateFireworks);
  } else {
    animationFrame = null;
    lastFrameTime = 0;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

if (canvas && ctx) {
  resizeFireworksCanvas();
  window.addEventListener("resize", resizeFireworksCanvas, { passive: true });
  // A friend opening a personalized link gets a celebration immediately.
  if (sender) {
    window.setTimeout(launchFireworks, 350);
  }
}
