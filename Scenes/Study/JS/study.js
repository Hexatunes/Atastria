let save = JSON.parse(localStorage.getItem("save"));
let selectedSetIDX = -1

function refreshSetList() {


    document.getElementById("FlashsetList").innerHTML = "";

    var flashsets = save["flashsets"];

    if ( flashsets.length == 0 ) {
        document.getElementById("NoSetsLabel").style.display = "block"
        return
    } 

    for ( let i = 0; i < flashsets.length; i++ ) {

        var set = flashsets[i]

        if ( set["cards"].length >= 5 ) {
            const flashsetDiv = document.createElement("div");
            flashsetDiv.className = "FlashsetDiv";

            const openButton = document.createElement("button");
            openButton.className = "FlashsetOpenButton";
            openButton.innerHTML = set["name"];
            openButton.addEventListener("click", () => {
                selectSet(i);
            });

            flashsetDiv.appendChild(openButton);

            document.getElementById("FlashsetList").appendChild(flashsetDiv);
        }
        
        

    }
    
    document.getElementById("NoSetsLabel").style.display = "none";

}

function selectSet(idx) {

    selectedSetIDX = idx


    document.getElementById("FlashsetList").style.display = "none";
    document.getElementById("TitleInfo").style.display = "none";

    document.getElementById("StandardShadow").style.display = "block";
    document.getElementById("StandardDiv").style.display = "block";

}

function standardBattle() {

    var battleInit = JSON.stringify({

        "selectedSetIDX": selectedSetIDX,
        "mode": "study_standard",
        "enemies": [
          {
            "code": "testdummy",
            "level": 50
          },
          {
            "code": "testdummy",
            "level": 50
          },
          {
            "code": "testdummy",
            "level": 50
          },
        ],
        "party": [
          {
            "code": "lizzy",
            "level": 50,
            "items": [],
          },
          {
            "code": "lullaby",
            "level": 50,
            "items": [],
          },
          {
            "code": "xiaoling",
            "level": 50,
            "items": [],
          },
          
          {
            "code": "cuddlefish",
            "level": 50,
            "items": [],
          },
          {
            "code": "syla",
            "level": 50,
            "items": [],
          },
          
          {
            "code": "toki",
            "level": 50,
            "items": [],
          },
          
        ],
    })

    setCookie("battleInit", battleInit, 1)

    document.querySelector(".dark").classList.add("slide-in");
    document.querySelector(".white").classList.add("slide-in");
    document.querySelector(".logo").classList.add("slide-in");

    setTimeout(() => {
        console.log("switch")
        window.location.href = "/battle.html";
    }, 800);

}




















// ---------- BOILER PLATE ----------
function back() {
    if ( selectedSetIDX > -1 ) {
        selectedSetIDX = -1

        document.getElementById("FlashsetList").style.display = "block";
        document.getElementById("TitleInfo").style.display = "block";

        document.getElementById("StandardShadow").style.display = "none";
        document.getElementById("StandardDiv").style.display = "none";
    } else {
        document.querySelector(".dark").classList.add("slide-in");
        document.querySelector(".white").classList.add("slide-in");
        document.querySelector(".logo").classList.add("slide-in");

        setTimeout(() => {
            window.location.href = "/index.html";
        }, 800);
    }
    
}


window.addEventListener("load", () => {
    document.querySelector(".dark").classList.add("slide-out");
    document.querySelector(".white").classList.add("slide-out");
    document.querySelector(".logo").classList.add("slide-out");

    if ( localStorage.getItem("save") == null ) {
      
      var newSave = {
        "flashsets": [],
        "story": {},
      };


      localStorage.setItem("save", JSON.stringify(newSave));

      console.log("No save detected. Made a new one!")
    }

    refreshSetList()

    document.cookie = "battleInit=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});

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
