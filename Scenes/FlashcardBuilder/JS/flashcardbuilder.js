
let save = JSON.parse(localStorage.getItem("save"));

function promptNewSetName() {
    var setName = prompt("Give your new set a name!");

    if ( setName == "" ) {
        alert("Flashset cannot have an empty name!")
        return
    }

    var flashsets = save["flashsets"];

    console.log(flashsets)

    setName = setName.replaceAll('"', '')
    setName = setName.replaceAll("'", "")

    flashsets.push({
        "name": setName,
        "cards": []
    });

    save_data()

    refreshSetList();
}

function refreshSetList() {
    document.getElementById("FlashsetList").innerHTML = "";

    var flashsets = save["flashsets"];

    if ( flashsets.length == 0 ) {
        document.getElementById("NoSetsLabel").style.display = "block"
        return
    } 

    for ( let i = 0; i < flashsets.length; i++ ) {

        var set = flashsets[i]
        
        const flashsetDiv = document.createElement("div");
        flashsetDiv.className = "FlashsetDiv";

        const openButton = document.createElement("button");
        openButton.className = "FlashsetOpenButton";
        openButton.innerHTML = set["name"];
        openButton.addEventListener("click", () => {
            openSet(i);
        });

        const deleteButton = document.createElement("input");
        deleteButton.className = "FlashsetDeleteButton";
        deleteButton.src = "/Scenes/FlashcardBuilder/Sprites/trashIcon.png";
        deleteButton.type = "image"
        deleteButton.addEventListener("click", () => {
            deleteSet(i);
        });

        const renameButton = document.createElement("button");
        renameButton.className = "FlashsetRenameButton";
        renameButton.innerHTML = "Rename";
        renameButton.addEventListener("click", () => {
            renameSet(i);
        });

        flashsetDiv.appendChild(openButton);
        flashsetDiv.appendChild(deleteButton);
        flashsetDiv.appendChild(renameButton);

        document.getElementById("FlashsetList").appendChild(flashsetDiv);

    }

    document.getElementById("NoSetsLabel").style.display = "none"

}


var editingSet = -1

function openSet(idx) {
    var fs = save["flashsets"][idx];

    editingSet = idx

    document.getElementById("FlashcardEditor").style.display = "block"
    document.getElementById("NewCard").style.display = "block"

    document.getElementById("FlashcardEditor").innerHTML = ""

    document.getElementById("FlashsetList").style.display = "none"
    document.getElementById("NewSet").style.display = "none"

    const setName = document.createElement("p");
    setName.className = "SetName"
    setName.innerHTML = fs["name"];
    document.getElementById("FlashcardEditor").appendChild(setName);

    console.log(fs)

    for ( let i = 0; i < fs["cards"].length; i++ ) {

        let card = fs["cards"][i]

        let cardDiv = document.createElement("div")
        cardDiv.className = "CardDiv"

        let questionInput = document.createElement("input")
        questionInput.className = "QuestionInput"
        questionInput.addEventListener("input", () => {
            updateCard(i, "question", questionInput.value);
        });
        questionInput.placeholder = "Question"

        if (card["question"] != "") {
            questionInput.value = card["question"];
        }
        

        let answerInput = document.createElement("input");
        answerInput.className = "AnswerInput";
        answerInput.addEventListener("input", () => {
            updateCard(i, "answer", answerInput.value);
        });
        if (card["answer"] != "") {
            answerInput.value = card["answer"];
        }
        answerInput.placeholder = "Answer"

        let deleteCardButton = document.createElement("input");
        deleteCardButton.className = "DeleteCard";
        deleteCardButton.type = "image";
        deleteCardButton.src = "/Scenes/FlashcardBuilder/Sprites/trashIcon.png";
        deleteCardButton.addEventListener("click", () => {
            deleteCard(i);
        });

        cardDiv.appendChild(questionInput);
        cardDiv.appendChild(answerInput);
        cardDiv.appendChild(deleteCardButton);

        document.getElementById("FlashcardEditor").appendChild(cardDiv)
        document.getElementById("FlashcardEditor").appendChild(document.createElement("br"))

    }

    if ( fs["cards"].length < 5 ) {
        document.getElementById("CardAmountWarning").style.display = "block";
    } else {
        document.getElementById("CardAmountWarning").style.display = "none";
    }
}

function newCard() {

    let fs = save["flashsets"][editingSet]["cards"];

    fs.push({
        "question": "",
        "answer": "",
    });

    const newLength = fs.length - 1

    let cardDiv = document.createElement("div")
    cardDiv.className = "CardDiv"

    let questionInput = document.createElement("input")
    questionInput.className = "QuestionInput"
    questionInput.addEventListener("input", () => {
        updateCard(newLength, "question", questionInput.value);
    });
    questionInput.placeholder = "Question"

    let answerInput = document.createElement("input");
    answerInput.className = "AnswerInput";
    answerInput.addEventListener("input", () => {
        updateCard(newLength, "answer", answerInput.value);
    });
    answerInput.placeholder = "Answer"

    let deleteCardButton = document.createElement("input");
    deleteCardButton.className = "DeleteCard";
    deleteCardButton.type = "image";
    deleteCardButton.src = "/Scenes/FlashcardBuilder/Sprites/trashIcon.png";
    deleteCardButton.addEventListener("click", () => {
        deleteCard(newLength);
    });

    cardDiv.appendChild(questionInput);
    cardDiv.appendChild(answerInput);
    cardDiv.appendChild(deleteCardButton);

    document.getElementById("FlashcardEditor").appendChild(cardDiv);
    document.getElementById("FlashcardEditor").appendChild(document.createElement("br"))

    save_data()

    if ( fs.length < 5 ) {
        document.getElementById("CardAmountWarning").style.display = "block";
    } else {
        document.getElementById("CardAmountWarning").style.display = "none";
    }

}
function updateCard(cardIDX, toUpdate, text) {

    var fs = save["flashsets"][editingSet]["cards"];

    fs[cardIDX][toUpdate] = text

    console.log(cardIDX, toUpdate, text)

    save_data()
}
function deleteCard(cardIDX) {

    var fs = save["flashsets"][editingSet]["cards"];
    fs.splice(cardIDX, 1)

    openSet(editingSet)

    save_data()
}

// -----------------------------------------

function deleteSet(idx) {
    save["flashsets"].splice(idx, 1);

    save_data()

    refreshSetList()
    
}

function renameSet(idx) {

    var newName = prompt("Rename set to...");
    save["flashsets"][idx]["name"] = newName;

    save_data()

    refreshSetList()
    
}














// ---------- BOILER PLATE ----------
function save_data() {
    console.log("Saving... ")
    localStorage.setItem("save", JSON.stringify(save))
}

window.addEventListener("load", () => {
    document.querySelector(".dark").classList.add("slide-out");
    document.querySelector(".white").classList.add("slide-out");
    document.querySelector(".logo").classList.add("slide-out");

    document.getElementById("BGM").volume = 0.3;
    document.getElementById("BGM").play()

    if ( localStorage.getItem("save") == null ) {
      
      var newSave = {
        "flashsets": [],
        "story": {},
      };


      localStorage.setItem("save", JSON.stringify(newSave));

      console.log("No save detected. Made a new one!")
    } else {
        refreshSetList()
    }
});

document.addEventListener('click', (event) => {
    document.getElementById("ClickSound").currentTime = 0;
    document.getElementById("ClickSound").play();
});

function back() {
    if ( editingSet == -1){
        document.querySelector(".dark").classList.add("slide-in");
        document.querySelector(".white").classList.add("slide-in");
        document.querySelector(".logo").classList.add("slide-in");

        setTimeout(() => {
            window.location.href = "/index.html";
        }, 800);
    } else {
        document.getElementById("FlashcardEditor").style.display = "none";
        document.getElementById("NewCard").style.display = "none";
        document.getElementById("CardAmountWarning").style.display = "none";

        document.getElementById("FlashsetList").style.display = "block";
        document.getElementById("NewSet").style.display = "block";
        

        editingSet = -1;
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
