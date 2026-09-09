

// ⸻ [ Global Data ] ⸻

var nodeIDX = JSON.parse(getCookie("loadedNode"))

var story

var chars = []

var idx = -1

var visibleChars = 0

var speakerID = -1

var setting = "test"

// ⸻⸻⸻⸻⸻


function advance() {

  if ( inOption ) {
    return
  }

  if ( talking ) {

    if ( story["parts"][idx]["event"] == "dialogue") {
      document.getElementById("Dialogue" + String(speakerID)).innerHTML = story["parts"][idx]["dialogue"]
    } else {
      document.getElementById("NarrationText").innerHTML = story["parts"][idx]["text"]
    }
    
    talking = false
    clearTimeout(ticker)
    return
  }
    
  idx += 1

  if ( idx == story["parts"].length ) {
    back()
    return
  }

  visibleChars = 0

  part = story["parts"][idx]

  switch ( part["event"] ) {

    case "dialogue":

      var found = false

      for ( var i = 0; i < chars.length; i++ ) {

        if ( chars[i]["char"] == part["speaker"] ) {
          found = true
          speakerID = i + 1
        }

      }

      if ( !found ) {
        chars.push({
          "char": part["speaker"],
          "emotion": part["emotion"]
        })

        speakerID = chars.length
      }

      tickDialogue()

      break;
    
    case "narration":

      tickNarration()

      break;
      
    case "option":

      fadeIn("PlayerOption")
      document.getElementById("PlayerOption").innerHTML = part["text"]
      document.getElementById("PlayerOption").style.display = "block";

      inOption = true

      break;


  }

  refreshDisplays()

}

var lastCharsLength = 0

function refreshDisplays() {

  part = story["parts"][idx]

  if ( chars.length == 1 ) {

    fadeIn("Char1")
    fadeOut("Char2")
    fadeOut("Char3")

    if ( chars.length != lastCharsLength ){
      tweenElement("Char1", 2000, 50, 75)
      tweenElement("Box1", 2000, 50, 75)
    }
    
  } else if ( chars.length == 2 ) {
  
    fadeIn("Char1")
    fadeOut("Char2")
    fadeOut("Char3")

    if ( chars.length != lastCharsLength ){

      tweenElement("Char1", 2000, 50, 75)
      tweenElement("Box1", 2000, 50, 75)

      tweenElement("Char2", 2000, 50, 75)
      tweenElement("Box2", 2000, 50, 75)
      
    }
  }


  if ( part["event"] == "dialogue" ) {

    fadeOut("NarrationBox")
    
    if ( speakerID == 1 ) {
      fadeIn("Box1")
      
      fadeOut("Box2")
      fadeOut("Box3")
    } else if ( speakerID == 2 ) {
      fadeIn("Box2")

      fadeOut("Box1")
      fadeOut("Box3")
    } else if ( speakerID == 3 ) {
      fadeIn("Box3")

      fadeOut("Box1")
      fadeOut("Box2")
    }

    for ( var i = 0; i < chars.length; i++ ) {

      document.getElementById("Char" + String(i + 1)).src = "/Scenes/StoryNode/Sprites/Portraits/" + part["speaker"] + "/" + setting + "/" + part["emotion"] + ".png"

    }

  } else if ( part["event"] == "narration" ) {

    fadeOut("Box1")
    fadeOut("Box2")
    fadeOut("Box3")

    fadeIn("NarrationBox")

  }

  lastCharsLength = chars.length

}

var talking = false
var inOption = false
var ticker

function tickDialogue() {

  talking = true

  visibleChars += 1

  part = story["parts"][idx]

  document.getElementById("Dialogue" + String(speakerID)).innerHTML = part["dialogue"].substring(0, visibleChars)

  let waitTime = 30
  let lastChar = part["dialogue"].substring(visibleChars - 1, visibleChars)

  if ( lastChar == "," ) {
    waitTime = 400
  } else if ( lastChar == "." || lastChar == "?" || lastChar == "!" || lastChar == "-" || lastChar == "~" || lastChar == "…" ) {
    waitTime = 700
  }

  if ( visibleChars < part["dialogue"].length && talking ) {
    ticker = setTimeout(() => {
      tickDialogue()

      if ( visibleChars % 2 == 0) {
        document.getElementById("Boop").currentTime = 0;
        document.getElementById("Boop").play();
      }
      
    }, waitTime);
  } else {
    talking = false
  }

}

function tickNarration() {

  talking = true

  visibleChars += 1

  part = story["parts"][idx]

  document.getElementById("NarrationText").innerHTML = part["text"].substring(0, visibleChars)

  var waitTime = 25
  let lastChar = part["text"].substring(visibleChars - 1, visibleChars)

  if ( lastChar == "," ) {
    waitTime = 400
  } else if ( lastChar == "." || lastChar == "?" || lastChar == "!" || lastChar == "-" || lastChar == "~" || lastChar == "…" ) {
    waitTime = 700
  }

  if ( visibleChars < part["text"].length && talking ) {
    ticker = setTimeout(() => {
      tickNarration()
    }, waitTime);
  } else {
    talking = false
  }

}


function optionPicked() {

  inOption = false

  document.getElementById("PlayerOption").style.display = "none";
  document.getElementById("PlayerOption").style.opacity = 0;

  advance()
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

async function loadJSON(path) {
    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`Failed to load ${path}: HTTP ${response.status}`);
    }

    return await response.json();
}

async function loadStory() {
    story = await loadJSON(MainStoryMap[nodeIDX]["path"]);

    // Story is now the actual JSON data
    console.log(story);

    setTimeout(() => {
      advance()
    }, 500);
}




