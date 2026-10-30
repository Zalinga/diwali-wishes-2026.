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

// Lightweight celebratory particle burst; no external libraries required.
const canvas = $("fireworks");
const ctx = canvas.getContext("2d");
let particles = [];
let raf = null;
function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
function launchFireworks() {
  const w = window.innerWidth, h = window.innerHeight;
  for (let burst = 0; burst < 4; burst++) {
    const x = w * (0.2 + Math.random() * 0.6);
    const y = h * (0.18 + Math.random() * 0.34);
    for (let i = 0; i < 42; i++) {
      const angle = (Math.PI * 2 * i) / 42;
      const speed = 1.1 + Math.random() * 3;
      particles.push({x, y, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed, life:55+Math.random()*20, max:75, size:1+Math.random()*2});
    }
  }
  if (!raf) animate();
}
function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.025; p.vx *= 0.99; p.life--;
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    ctx.fillStyle = "#f6d78e";
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  if (particles.length) raf = requestAnimationFrame(animate);
  else { cancelAnimationFrame(raf); raf = null; ctx.clearRect(0,0,window.innerWidth,window.innerHeight); }
}
