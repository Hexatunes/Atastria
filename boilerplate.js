const bgm = document.getElementById("BGM");

function fadeAudio(audio, from, to, duration, callback) {
    const startTime = performance.now();

    function update(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Linear interpolation
        const volume = from + (to - from) * progress;

        // Clamp volume between 0 and 1
        audio.volume = Math.max(0, Math.min(1, volume));

        if (progress < 1) {
            requestAnimationFrame(update);
        } else if (callback) {
            callback();
        }
    }

    requestAnimationFrame(update);
}


const canvas = document.getElementById('trail');
const ctx = canvas.getContext('2d');
const cursorDot = document.getElementById('cursorDot');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// ---- Gradient trail using a fading array of points ----
const points = [];
const MAX_POINTS = 5;

// Hue cycles over time for a shifting rainbow-gradient trail
let hue = 10;

window.addEventListener('mousemove', (e) => {
  points.push({ x: e.clientX, y: e.clientY, life: 1 });
  if (points.length > MAX_POINTS) points.shift();

  cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;

  // occasionally spawn glitter
  if (Math.random() < 0.6) spawnSparkle(e.clientX, e.clientY);
});

function drawTrail() {
  // fade the whole canvas toward transparent (instead of toward a background color)
  // by erasing a bit of alpha each frame rather than painting over it
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';

  hue += 0.6;
  if (hue > 360) hue -= 360;

  for (let i = 1; i < points.length; i++) {
    const p0 = points[i - 1];
    const p1 = points[i];
    const t = i / points.length; // 0 (old) -> 1 (new)

    const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
    grad.addColorStop(0, `hsla(${(hue + i * 4) % 360}, 100%, 65%, ${t * 0.6})`);
    grad.addColorStop(1, `hsla(${(hue + i * 4 + 20) % 360}, 100%, 70%, ${t})`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = t * 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }

  requestAnimationFrame(drawTrail);
}
drawTrail();

// ---- Glitter sparkle particles (DOM based, twinkle + fall + fade) ----
function spawnSparkle(x, y) {
  const el = document.createElement('div');
  el.className = 'sparkle';

  const size = 3 + Math.random() * 5;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;

  const hueVal = Math.floor(Math.random() * 360);
  el.style.background = `radial-gradient(circle, hsl(${hueVal},100%,80%) 0%, rgba(255,255,255,0) 70%)`;

  const offsetX = (Math.random() - 0.5) * 20;
  const offsetY = (Math.random() - 0.5) * 20;
  el.style.transform = `translate(${x + offsetX}px, ${y + offsetY}px)`;
  el.style.opacity = '1';

  document.body.appendChild(el);

  const driftX = (Math.random() - 0.5) * 40;
  const fallY = 20 + Math.random() * 40;
  const duration = 600 + Math.random() * 500;

  const animation = el.animate([
    { transform: `translate(${x + offsetX}px, ${y + offsetY}px) scale(1)`, opacity: 1 },
    { transform: `translate(${x + offsetX + driftX}px, ${y + offsetY + fallY}px) scale(0)`, opacity: 0 }
  ], {
    duration: duration,
    easing: 'ease-out'
  });

  animation.onfinish = () => el.remove();
}

document.addEventListener('click', (event) => {
  document.getElementById("ClickSound").currentTime = 0;
  document.getElementById("ClickSound").play();
});

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}

function tweenElement(id, duration, xPercent, yPercent) {
    const element = document.getElementById(id);
    if (!element) return;

    // Get the current CSS position
    const style = getComputedStyle(element);

    let startX = parseFloat(style.left);
    let startY = parseFloat(style.top);

    // If left/top aren't set, default to 0
    if (isNaN(startX)) startX = 0;
    if (isNaN(startY)) startY = 0;

    // Convert pixel positions to percentages
    const parent = element.offsetParent;

    const parentWidth = parent ? parent.clientWidth : window.innerWidth;
    const parentHeight = parent ? parent.clientHeight : window.innerHeight;

    startX = (startX / parentWidth) * 100;
    startY = (startY / parentHeight) * 100;

    const startTime = performance.now();

    function animate(currentTime) {
        const progress = Math.min(
            (currentTime - startTime) / duration,
            1
        );

        // Expo-out
        const eased = progress === 1
            ? 1
            : 1 - Math.pow(2, -10 * progress);

        const x = startX + (xPercent - startX) * eased;
        const y = startY + (yPercent - startY) * eased;

        element.style.left = `${x}%`;
        element.style.top = `${y}%`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

function fadeIn(id) {
    const element = document.getElementById(id);
    if (!element) return;

    element.style.opacity = "0";

    setTimeout(() => {
        element.style.transition = "opacity 500ms linear";
        element.style.opacity = "1";
    }, 10);
}

function fadeOut(id) {
    const element = document.getElementById(id);
    if (!element) return;

    element.style.transition = "opacity 500ms linear";
    element.style.opacity = "0";
}

function fadeInFast(id) {
    const element = document.getElementById(id);
    if (!element) return;

    element.style.opacity = "0";

    setTimeout(() => {
        element.style.transition = "opacity 200ms linear";
        element.style.opacity = "1";
    }, 10);
}

function fadeOutFast(id) {
    const element = document.getElementById(id);
    if (!element) return;

    element.style.transition = "opacity 200ms linear";
    element.style.opacity = "0";
}

function shake(id, intensity) {
    const element = document.getElementById(id);
    if (!element) return;

    element.animate(
        [
            { "--shake-x": "0px" },
            { "--shake-x": `-${intensity}%` },
            { "--shake-x": `${intensity}%` },
            { "--shake-x": `-${intensity}%` },
            { "--shake-x": `${intensity}%` },
            { "--shake-x": "0px" }
        ],
        {
            duration: 500,
            easing: "ease-in-out"
        }
    );
}


function hop(id, intensity, times) {
    const element = document.getElementById(id);
    if (!element) return;

    const keyframes = [
        { "--hop-y": "0px" }
    ];

    for (let i = 0; i < times; i++) {
        keyframes.push(
            { "--hop-y": `-${intensity}px` },
            { "--hop-y": "0px" }
        );
    }

    element.animate(keyframes, {
        duration: times * 200,
        easing: "ease-out"
    });
}


function sink(id) {
    const element = document.getElementById(id);
    if (!element) return;

    element.animate(
        [
            { "--sink-y": "0px" },
            { "--sink-y": "30px" },
            { "--sink-y": "0px" }
        ],
        {
            duration: 600,
            easing: "ease-in-out"
        }
    );
}
