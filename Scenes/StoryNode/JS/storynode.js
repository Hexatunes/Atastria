

// ⸻ [ Global Data ] ⸻

var nodeIDX = JSON.parse(getCookie("loadedNode"))

// ⸻⸻⸻⸻⸻


function setUp() {
    
    

}










// ---------- BOILER PLATE ----------


function back() {
    document.querySelector(".dark").classList.add("slide-in");
    document.querySelector(".white").classList.add("slide-in");
    document.querySelector(".logo").classList.add("slide-in");

    fadeAudio(bgm, bgm.volume, 0, 800, () => {
        window.location.href = "/story.html";
    });
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
});