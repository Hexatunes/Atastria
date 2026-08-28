
// ⸻ [ Global Data ] ⸻

let save = JSON.parse(localStorage.getItem("save"));

// ⸻⸻⸻⸻⸻


// ⸻⸻⸻⸻⸻⸻ INITIAL SET UP ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻ //

function setUp() {

    // --- Generate list ---

    for ( let i = STORY_DATA.length - 1; i >= 0; i-- ) {

        let storyNode = STORY_DATA[i]

        if ( storyNode["code"] in save["story"] || i == 0) {
            let nodeDiv = document.createElement("div");
            nodeDiv.className = "NodeDiv";

            let nodeIcon = document.createElement("img")
            nodeIcon.className = "NodeIcon"
            
            if ( storyNode["type"] == "story" ) {
                nodeIcon.src = "Scenes/Story/Sprites/storyIcon.png"
            } else {
                nodeIcon.src = "Scenes/Story/Sprites/battleIcon.png"
            }

            let nodeButton = document.createElement("button");
            nodeButton.className = "NodeButton"
            nodeButton.innerHTML = storyNode["display"]
            nodeButton.addEventListener("click", () => {
                loadNode(i);
            });

            nodeDiv.appendChild(nodeIcon);
            nodeDiv.appendChild(nodeButton);

            document.getElementById("StoryHolder").appendChild(nodeDiv)
            document.getElementById("StoryHolder").appendChild(document.createElement("br"))

        } else if ( i > 0 && STORY_DATA[i - 1]["code"] in save["story"] ) {

            let nodeDiv = document.createElement("div");
            nodeDiv.className = "NodeDiv";

            let nodeIcon = document.createElement("img")
            nodeIcon.className = "NodeIcon"
            
            if ( storyNode["type"] == "story" ) {
                nodeIcon.src = "Scenes/Story/Sprites/storyIcon.png"
            } else {
                nodeIcon.src = "Scenes/Story/Sprites/battleIcon.png"
            }

            let nodeButton = document.createElement("button");
            nodeButton.className = "NodeButton"
            nodeButton.innerHTML = storyNode["display"]
            nodeButton.addEventListener("click", () => {
                loadNode(i);
            });

            nodeDiv.appendChild(nodeIcon);
            nodeDiv.appendChild(nodeButton);

            document.getElementById("StoryHolder").appendChild(nodeDiv)
            document.getElementById("StoryHolder").appendChild(document.createElement("br"))

        }

        

        

    }

}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻//

function loadNode(i) {

  var node = STORY_DATA[i];

  if ( node["type"] == "story" ) {
    document.querySelector(".dark").classList.add("slide-in");
    document.querySelector(".white").classList.add("slide-in");
    document.querySelector(".logo").classList.add("slide-in");

    fadeAudio(bgm, bgm.volume, 0, 800, () => {
        window.location.href = "/storynode.html";
    });

    setCookie("loadedNode", i, 1)
  }

}


// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻//



















// ---------- BOILER PLATE ----------


function back() {
    document.querySelector(".dark").classList.add("slide-in");
    document.querySelector(".white").classList.add("slide-in");
    document.querySelector(".logo").classList.add("slide-in");

    fadeAudio(bgm, bgm.volume, 0, 800, () => {
        window.location.href = "/index.html";
    });
}


window.addEventListener("load", () => {
    document.querySelector(".dark").classList.add("slide-out");
    document.querySelector(".white").classList.add("slide-out");
    document.querySelector(".logo").classList.add("slide-out");

    document.cookie = "loadedNode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
});



