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

        if ( set["cards"].length >= 4 ) {
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
            "code": "lizzy",
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
        window.location.href = "../Battle/battle.html";
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
            window.location.href = "../Home/index.html";
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