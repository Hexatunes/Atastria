let savedFlashsets = JSON.parse(localStorage.getItem("flashsets"));
let selectedSetIDX = -1

function refreshSetList() {


    document.getElementById("FlashsetList").innerHTML = "";

    var flashsets = savedFlashsets["flashsets"];

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
        "mode": "study",
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
        "scene": "study",
        "lighting": "study",
    })

    setCookie("battleInit", battleInit, 1)

    document.querySelector(".dark").classList.add("slide-in");
    document.querySelector(".white").classList.add("slide-in");
    document.querySelector(".logo").classList.add("slide-in");

    fadeAudio(bgm, bgm.volume, 0, 800, () => {
      window.location.href = "/battle.html";
    });

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

        fadeAudio(bgm, bgm.volume, 0, 800, () => {
            window.location.href = "/index.html";
        });
    }
    
}


window.addEventListener("load", () => {
    document.querySelector(".dark").classList.add("slide-out");
    document.querySelector(".white").classList.add("slide-out");
    document.querySelector(".logo").classList.add("slide-out");

    if ( localStorage.getItem("flashsets") == null ) {
      
      savedFlashsets = {
        "flashsets": [],
      };


      localStorage.setItem("save", JSON.stringify(savedFlashsets));

      console.log("No save detected. Made a new one!")
    }

    refreshSetList()

    document.cookie = "battleInit=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});


