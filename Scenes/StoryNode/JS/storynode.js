

// ⸻ [ Global Data ] ⸻

var nodeIDX = JSON.parse(getCookie("loadedNode"))

var story

var chars = []

var idx = -1

var visibleChars = 0

var speakerID = -1

var lighting = ""

var storyName = ""

// ⸻⸻⸻⸻⸻


function advance() {

  window.scrollTo(0, 0);

  if ( inOption ) {
    return
  }

  if ( talking ) {

    if ( story["parts"][idx]["event"] == "dialogue") {
      document.getElementById("Dialogue" + String(speakerID)).innerHTML = currentText.replaceAll("[p]", storyName)
    } else {
      document.getElementById("NarrationText").innerHTML = story["parts"][idx]["text"]
    }
    
    talking = false
    clearTimeout(ticker)
    return
  }
    
  idx += 1

  if ( idx == story["parts"].length ) {
    setCookie("storyComplete", MainStoryMap[nodeIDX]["code"], 1)
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

          chars[i]["emotion"] = part["emotion"]
        }

      }

      if ( !found ) {
        chars.push({
          "char": part["speaker"],
          "emotion": part["emotion"]
        })

        speakerID = chars.length
      }

      currentText = part["dialogue"].replaceAll("[p]", storyName);

      tickDialogue()

      console.log(chars)
      console.log(speakerID)

      refreshDisplays()

      lastCharsLength = chars.length

      break;
    
    case "narration":

      tickNarration()

      refreshDisplays()

      break;
      
    case "option":

      fadeIn("PlayerOption", 500)
      document.getElementById("PlayerOption").innerHTML = part["text"]
      document.getElementById("PlayerOption").style.display = "block";

      inOption = true

      break;
    
    case "name":

      document.getElementById("StoryNameInput").style.display = "block";
      document.getElementById("StoryNameInput").focus()

      inOption = true;

      break;
    
    case "environment":

      if ( lighting != "" ) {
        fadeIn("BlackFade", 500)
      }

      lighting = part["lighting"]

      var pendingBG = part["background"]
      

      setTimeout(() => {
        fadeOut("BlackFade", 500)
        document.getElementById("Backdrop").src = "Scenes/StoryNode/SPrites/BGs/" + pendingBG
      }, 500)


      advance();

      break;

    case "removechar":

      chars = chars.filter(item => item.char !== part["char"]);

      if (chars.length == 0) {
        fadeOut("Char1", 500)
        fadeOut("Char2", 500)
        fadeOut("Char3", 500)
      }
      


      advance()

  }

  

}

var lastCharsLength = 0

function refreshDisplays() {

  part = story["parts"][idx]

  switch ( part["speaker"] ) {
    case "lullaby":
      document.getElementById("Name" + String(speakerID)).innerHTML = "Lullaby"
      break;
    case "xiaoling":
      document.getElementById("Name" + String(speakerID)).innerHTML = "XiaoLing"
      break;
    case "toki":
      document.getElementById("Name" + String(speakerID)).innerHTML = "Toki"
      break;
    case "cuddlefish":
      document.getElementById("Name" + String(speakerID)).innerHTML = "Cuddle Fish"
      break;
    case "lizzy":
      document.getElementById("Name" + String(speakerID)).innerHTML = "Lizzy"
      break;
    case "syla":
      document.getElementById("Name" + String(speakerID)).innerHTML = "Syla"
      break;
    case "limerence":
      document.getElementById("Name" + String(speakerID)).innerHTML = "Limerence"
      break;
    case "evelyn":
      document.getElementById("Name" + String(speakerID)).innerHTML = "Evelyn"
      break;
  }


  if ( chars.length == 1 ) {

    fadeIn("Char1", 500)
    fadeOut("Char2", 500)
    fadeOut("Char3", 500)

    

    if ( chars.length != lastCharsLength ){
      tweenElement("Char1", 2000, 50, 75)
      tweenElement("Box1", 2000, 50, 75)
    }
    
  } else if ( chars.length == 2 ) {
  
    fadeIn("Char1", 500)
    fadeIn("Char2", 500)
    fadeOut("Char3, 500")

    if ( chars.length != lastCharsLength ){

      tweenElement("Char1", 2000, 33, 75)
      tweenElement("Box1", 2000, 33, 75)

      tweenElement("Char2", 2000, 66, 75)
      tweenElement("Box2", 2000, 66, 75)
      
    }
  } else if ( chars.length == 3 ) {
  
    fadeIn("Char1", 500)
    fadeIn("Char2", 500)
    fadeIn("Char3", 500)

    if ( chars.length != lastCharsLength ){
      
      tweenElement("Char1", 2000, 25, 75)
      tweenElement("Box1", 2000, 25, 75)

      tweenElement("Char2", 2000, 50, 75)
      tweenElement("Box2", 2000, 50, 75)

      tweenElement("Char3", 2000, 75, 75)
      tweenElement("Box3", 2000, 75, 75)
      
    }
  }


  if ( part["event"] == "dialogue" ) {

    fadeOut("NarrationBox", 500)
    
    if ( speakerID == 1 ) {
      fadeIn("Box1", 500)
      
      fadeOut("Box2", 500)
      fadeOut("Box3", 500)
    } else if ( speakerID == 2 ) {
      fadeIn("Box2", 500)

      fadeOut("Box1", 500)
      fadeOut("Box3", 500)
    } else if ( speakerID == 3 ) {
      fadeIn("Box3", 500)

      fadeOut("Box1", 500)
      fadeOut("Box2", 500)
    }

    for ( var i = 0; i < chars.length; i++ ) {

      document.getElementById("Char" + String(i + 1)).src = "/Scenes/StoryNode/Sprites/Portraits/" + chars[i]["char"] + "/" + lighting + "/" + chars[i]["emotion"] + ".png"

    }

  } else if ( part["event"] == "narration" ) {

    fadeOut("Box1", 500)
    fadeOut("Box2", 500)
    fadeOut("Box3", 500)

    fadeIn("NarrationBox", 500)

  }

  

}

var talking = false
var inOption = false
var ticker
var currentText = ""

function tickDialogue() {

  talking = true

  visibleChars += 1

  part = story["parts"][idx]

  document.getElementById("Dialogue" + String(speakerID)).innerHTML = currentText.substring(0, visibleChars)

  let waitTime = 25
  let lastChar = currentText.substring(visibleChars - 1, visibleChars)

  if ( lastChar == "," ) {
    waitTime = 400
  } else if ( lastChar == "." || lastChar == "?" || lastChar == "!" || lastChar == "-" || lastChar == "~" || lastChar == "…" ) {
    waitTime = 700
  }

  if ( visibleChars < currentText.length && talking ) {
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

function updateStoryName() {

  inOption = false

  var nameValue = document.getElementById("StoryNameInput").value

  localStorage.setItem("name", nameValue)
  storyName = nameValue

  document.getElementById("StoryNameInput").style.display = "none";

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

    if ( localStorage.getItem("name") == null ) {

      localStorage.setItem("name", "");

    } else {
      
      storyName = localStorage.getItem("name")

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

const nameInput = document.getElementById('StoryNameInput');


nameInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    
    updateStoryName()
  }
});



