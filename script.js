
const $ = (id) => document.getElementById(id);

const nameInput = $("nameInput");
const createBtn = $("createBtn");
const welcome = $("welcome");
const greeting = $("greeting");
const error = $("error");

const params = new URLSearchParams(window.location.search);
const sender = (params.get("from") || "").trim().slice(0, 32);

let currentName = "";

// ===================================
// INCOMING DIWALI GREETING
// ===================================

if (sender) {
  $("introText").textContent =
    `A little Diwali light comes to you from ${sender}. Enjoy their wish, then create one of your own to share.`;

  $("senderPreview").classList.remove("hidden");
  $("senderName").textContent = sender;
  $("senderSignature").textContent = sender;

  $("makeOwnBtn").addEventListener("click", () => {
    $("nameCard").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    nameInput.focus({ preventScroll: true });
  });

  // FIREWORKS AUTOMATICALLY WHEN FRIEND OPENS LINK
  window.addEventListener("load", () => {
    setTimeout(() => {
      launchFireworks();
      setTimeout(launchFireworks, 700);
      setTimeout(launchFireworks, 1450);
      setTimeout(launchFireworks, 2200);
    }, 300);
  }, { once: true });
}

// ===================================
// PERSONALIZED GREETING
// ===================================

function cleanName(value) {
  return value
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
  return `🪔✨ HAPPY DIWALI 2026! ✨🪔

Dear ${name},

May your life shine brighter than a thousand diyas.

May happiness fill your home, peace warm your heart, and every new beginning bring success and prosperity.

Wishing you and your loved ones a beautiful, joyful and prosperous Diwali.

With love & light,
${name}

Now it's your turn! Enter your name and send your own Diwali greeting to your friends:

${makeShareUrl(name)}`;
}

// ===================================
// CREATE WISH
// ===================================

function createGreeting() {
  const name = cleanName(nameInput.value);

  if (!name) {
    error.textContent =
      "Please enter your name to create your Diwali wish.";
    nameInput.focus();
    return;
  }

  currentName = name;

  error.textContent = "";

  $("receiverName").textContent = name;
  $("signatureName").textContent = name;

  welcome.classList.add("hidden");
  greeting.classList.remove("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  launchFireworks();
}

createBtn.addEventListener("click", createGreeting);

nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") createGreeting();
});

// ===================================
// WHATSAPP SHARING
// ===================================

$("shareBtn").addEventListener("click", () => {
  if (!currentName) return;

  const message = greetingText(currentName);

  const whatsappURL =
    "https://wa.me/?text=" + encodeURIComponent(message);

  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );
});

// ===================================
// COPY GREETING
// ===================================

$("copyBtn").addEventListener("click", async () => {
  if (!currentName) return;

  try {
    await navigator.clipboard.writeText(
      greetingText(currentName)
    );

    showToast("Your Diwali greeting has been copied!");
  } catch {
    showToast("Copy unavailable. Please use WhatsApp Share.");
  }
});

// ===================================
// CREATE ANOTHER WISH
// ===================================

$("againBtn").addEventListener("click", () => {
  greeting.classList.add("hidden");
  welcome.classList.remove("hidden");

  nameInput.value = "";
  currentName = "";

  nameInput.focus();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// ===================================
// TOAST MESSAGE
// ===================================

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

// ===================================
// FESTIVE FIREWORKS ENGINE
// ===================================

const canvas = $("fireworks");
const ctx = canvas.getContext("2d");

let particles = [];
let raf = null;

const festiveColors = [
  "#FFD700",
  "#FFA500",
  "#FF4500",
  "#FF69B4",
  "#FFFFFF",
  "#00FFFF",
  "#FF3131",
  "#F6D78E"
];

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;

  ctx.setTransform(
    devicePixelRatio,
    0,
    0,
    devicePixelRatio,
    0,
    0
  );
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===================================
// LAUNCH MULTIPLE FIREWORK BURSTS
// ===================================

function launchFireworks() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  for (let burst = 0; burst < 5; burst++) {

    const x = w * (0.12 + Math.random() * 0.76);
    const y = h * (0.12 + Math.random() * 0.42);

    const count = 60;

    for (let i = 0; i < count; i++) {

      const angle = (Math.PI * 2 * i) / count;

      const speed = 1.3 + Math.random() * 4;

      particles.push({
        x: x,
        y: y,

        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,

        life: 65 + Math.random() * 30,
        max: 95,

        size: 1.2 + Math.random() * 2.5,

        color: festiveColors[
          Math.floor(Math.random() * festiveColors.length)
        ]
      });
    }
  }

  if (!raf) {
    animate();
  }
}

// ===================================
// FIREWORK ANIMATION
// ===================================

function animate() {

  ctx.clearRect(
    0,
    0,
    window.innerWidth,
    window.innerHeight
  );

  particles = particles.filter(
    particle => particle.life > 0
  );

  for (const p of particles) {

    p.x += p.vx;
    p.y += p.vy;

    p.vy += 0.025;
    p.vx *= 0.99;

    p.life--;

    ctx.globalAlpha = Math.max(
      0,
      p.life / p.max
    );

    ctx.fillStyle = p.color;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.size,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.globalAlpha = 1;

  if (particles.length > 0) {

    raf = requestAnimationFrame(animate);

  } else {

    cancelAnimationFrame(raf);
    raf = null;

    ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );
  }
}

// Guide user to the WhatsApp share button
setTimeout(() => {
    const shareGuide = document.getElementById("shareGuide");

    if (shareGuide && shareBtn) {
        shareGuide.classList.add("show");
        shareBtn.classList.add("share-highlight");

        shareGuide.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}, 700);
