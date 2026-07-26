function startGame() {
    document.getElementById("StartPrompt").style.display = "none";
    document.getElementById("BGM").volume = 0.3;
    document.getElementById("BGM").play();

    if ( localStorage.getItem("save") == null ) {
      
      var newSave = {
        "flashsets": [],
      };


      localStorage.setItem("save", JSON.stringify(newSave));

      console.log("No save detected. Made a new one!")
    }
}












// ---------- BOILER PLATE ----------


function switchToStudyMode() {
    document.querySelector(".dark").classList.add("slide-in");
    document.querySelector(".white").classList.add("slide-in");
    document.querySelector(".logo").classList.add("slide-in");

    setTimeout(() => {
        window.location.href = "../Study/study.html";
    }, 800);
}

function switchToFlashcardBuilder() {
    document.querySelector(".dark").classList.add("slide-in");
    document.querySelector(".white").classList.add("slide-in");
    document.querySelector(".logo").classList.add("slide-in");

    setTimeout(() => {
        window.location.href = "../FlashcardBuilder/flashcardbuilder.html";
    }, 800);
}

window.addEventListener("load", () => {
    document.querySelector(".dark").classList.add("slide-out");
    document.querySelector(".white").classList.add("slide-out");
    document.querySelector(".logo").classList.add("slide-out");
});

document.addEventListener('click', (event) => {
  document.getElementById("ClickSound").currentTime = 0;
  document.getElementById("ClickSound").play();
});

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const overlay = document.getElementById('StartPrompt');

function checkAudioState() {
  if (audioCtx.state === 'running') {
    overlay.style.display = 'none';
    document.getElementById("BGM").volume = 0.3
    document.getElementById("BGM").play();
  } else {
    overlay.style.display = 'flex'; 
  }
}

window.addEventListener('DOMContentLoaded', checkAudioState);

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    checkAudioState();
  }
});

overlay.addEventListener('click', () => {
  audioCtx.resume().then(() => {
    overlay.style.display = 'none';
  });
});


