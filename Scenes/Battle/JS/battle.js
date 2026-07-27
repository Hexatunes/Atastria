
// ⸻ [ Global Data ] ⸻
var battleInit = {};           //
var party = [];                //
var enemies = [];              //
    
var imana = 0;                 //

var turnOrder = [];            //

var rnrMode = "recognition";   //
// ⸻⸻⸻⸻⸻


// ⸻⸻⸻⸻⸻⸻ INITIAL SET UP ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻ //

function setUp() {

  console.log(battleInit)

  // --- Instantiate members and generate their mutable live battle data ----

  for ( var i = 0; i < battleInit["party"].length; i++ ) {

    let m = battleInit["party"][i]
    let code = m["code"]
    let level = m["level"]

    let partyInstance = {
      "code": code,
      "level": level,

      "maxHP": calculateStat(CHAR_DB[code]["BASE_HP"], level, 0),
      "hp": calculateStat(CHAR_DB[code]["BASE_HP"], level, 0),
      "strength": calculateStat(CHAR_DB[code]["BASE_STRENGTH"], level, 0),
      "magic": calculateStat(CHAR_DB[code]["BASE_MAGIC"], level, 0),
      "defence": calculateStat(CHAR_DB[code]["BASE_DEFENCE"], level, 0),
      "resistence": calculateStat(CHAR_DB[code]["BASE_RESISTENCE"], level, 0),
      "speed": calculateStat(CHAR_DB[code]["BASE_SPEED"], level, 0),

      "statuses": [],
      "BASE_AP": Math.floor( 10000 / calculateStat(CHAR_DB[code]["BASE_SPEED"], level, 0) ),
      "ap": Math.floor( 10000 / calculateStat(CHAR_DB[code]["BASE_SPEED"], level, 0) ),

      "side": "my",
    }

    party.push(partyInstance)

  }

  console.log(party)


  // ---------------- Do the same for enemies ----------------------

  for ( var i = 0; i < battleInit["enemies"].length; i++ ) {

    let e = battleInit["enemies"][i]
    let code = e["code"]
    let level = e["level"]

    let enemyInstance = {
      "code": code,
      "level": level,

      "maxHP": calculateStat(ENEMY_DB[code]["BASE_HP"], level, 0),
      "hp": calculateStat(ENEMY_DB[code]["BASE_HP"], level, 0),
      "strength": calculateStat(ENEMY_DB[code]["BASE_STRENGTH"], level, 0),
      "magic": calculateStat(ENEMY_DB[code]["BASE_MAGIC"], level, 0),
      "defence": calculateStat(ENEMY_DB[code]["BASE_DEFENCE"], level, 0),
      "resistence": calculateStat(ENEMY_DB[code]["BASE_RESISTENCE"], level, 0),
      "speed": calculateStat(ENEMY_DB[code]["BASE_SPEED"], level, 0),

      "statuses": [],
      "BASE_AP": Math.floor( 10000 / calculateStat(ENEMY_DB[code]["BASE_SPEED"], level, 0) ),
      "ap": Math.floor( 10000 / calculateStat(ENEMY_DB[code]["BASE_SPEED"], level, 0) ),

      "side": "enemy",
    }

    enemies.push(enemyInstance)

  }
  


  // ---------------- Create Turn Order ----------------------

  for ( var i = 0; i < 3; i++ ) {

    if ( i == party.length - 1 ) {
      break
    }

    turnOrder.push(party[i])
  }



  for ( var i = 0; i < enemies.length; i++ ) {

    turnOrder.push(enemies[i])

  }



  turnOrder.sort((a, b) => a.ap - b.ap)



  // ----------------------------------------------------------


  refreshDisplays()
}




function calculateStat(base, level, investment) {

  var part1 = 2 * base + investment;
  var part2 = part1 * level / 100;
  var final = part2 + 5;

  return final;

}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻//









// ⸻⸻⸻⸻⸻⸻ TURN ENGINE ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻ //

function advanceTurn() {

  var lowestAP = turnOrder[0]["ap"]

  for ( var i = 0; i < turnOrder.length; i++ ) {
    turnOrder[i]["ap"] -= lowestAP
  }

  //-------------------------------------------

  turnOrder[0]["ap"] = turnOrder[0]["BASE_AP"]

  //-------------------------------------------

  turnOrder.sort((a, b) => a.ap - b.ap)

  //-------------------------------------------

  refreshDisplays()

  //-------------------------------------------

  if ( turnOrder[0]["side"] == "my" ) {

    document.getElementById("attackButton").style.display = "block";
    document.getElementById("techniqueButton").style.display = "block";

    inCard = false
    pendingAction = "none"

  } else {
    document.getElementById("attackButton").style.display = "none";
    document.getElementById("techniqueButton").style.display = "none";

    enemyDecision()
  }

  console.log("-------------")
  console.log("Advanced turn!")
  console.log(turnOrder)
  console.log("-------------")

}




var inCard = false
var pendingAction = "none"
var correct = false

var lastRNR = "recognition"

function initiateFlashcard(action) {

  if ( inCard ) {
    return
  }

  //-------------------------------------------

  inCard = true

  pendingAction = action

  if ( rnrMode == "recognition" ) {
    recognition()
    lastRNR = "recognition"
  } else {
    recall()
    lastRNR = "recall"
  }

  //-------------------------------------------

}

var correctAnswer = -1


function recognition() {

  var fs = JSON.parse(localStorage.getItem("save")).flashsets[battleInit["selectedSetIDX"]]
  var cardIDX = randiRange(0, fs["cards"].length - 1)
  var card = fs["cards"][cardIDX]

  // ----------------------------------------------------------

  document.getElementById("recognitionFlashcard").style.display = "block";

  document.getElementById("recognitionQuestion").innerHTML = card["question"]

  // ----------------------------------------------------------

  var answerPool = []

  for ( var i = 0; i < fs["cards"].length; i++ ) {
    if ( fs["cards"][i]["answer"] != card["answer"] ){
      answerPool.push(fs["cards"][i]["answer"]);
    }
  }

  for ( var i = 1; i <= 4; i++ ) {
    let randomAnswerIDX = randiRange(0, answerPool.length - 1);
    document.getElementById("recognitionAnswer" + String(i)).innerHTML = answerPool[randomAnswerIDX]
    answerPool.splice(randomAnswerIDX, 1)
  }

  // ----------------------------------------------------------

  correctAnswer = randiRange(1, 4)

  document.getElementById("recognitionAnswer" + String(correctAnswer)).innerHTML = card["answer"]

  // ----------------------------------------------------------

  document.getElementById("recognitionAnswer1").style.display = "block";
  document.getElementById("recognitionAnswer2").style.display = "block";
  document.getElementById("recognitionAnswer3").style.display = "block";
  document.getElementById("recognitionAnswer4").style.display = "block";
}

function recall() {

  var fs = JSON.parse(localStorage.getItem("save")).flashsets[battleInit["selectedSetIDX"]]
  var cardIDX = randiRange(0, fs["cards"].length - 1)
  var card = fs["cards"][cardIDX]

  // ----------------------------------------------------------

  document.getElementById("recallFlashcard").style.display = "block";

  document.getElementById("recallQuestion").innerHTML = card["question"]

  // ----------------------------------------------------------

  correctAnswer = card["answer"]

  document.getElementById("recallAnswer").style.display = "block";

}

function recognitionSubmit(idx) {

  document.getElementById("recognitionAnswer1").style.display = "none";
  document.getElementById("recognitionAnswer2").style.display = "none";
  document.getElementById("recognitionAnswer3").style.display = "none";
  document.getElementById("recognitionAnswer4").style.display = "none";

  document.getElementById("flashcardFeedback").style.display = "block";

  // ----------------------------------------------------------

  if ( idx == correctAnswer ) {
    document.getElementById("flashcardFeedback").innerHTML = "Correct!"

    correct = true
    document.getElementById("recognitionFlashcard").style.display = "none";
    document.getElementById("flashcardFeedback").style.display = "none";

    if ( pendingAction == "attack" ) {
      attack()
    }

    return
  }

  // ----------------------------------------------------------
  
  
  document.getElementById("flashcardFeedback").innerHTML = "The correct answer was: " + document.getElementById("recognitionAnswer" + String(correctAnswer) ).innerHTML

  correct = false
  

  setTimeout(() => {

    if ( pendingAction == "attack" ) {
      attack()
    }

    document.getElementById("recognitionFlashcard").style.display = "none";
    document.getElementById("flashcardFeedback").style.display = "none";

  }, 3000);
  
  // ----------------------------------------------------------

}

function recallSubmit() {

  document.getElementById("recallAnswer").style.display = "none";
  document.getElementById("flashcardFeedback").style.display = "block";

  document.getElementById("recallAnswer").value = "";

  // ----------------------------------------------------------
  
  if ( document.getElementById("recallAnswer").value == correctAnswer ) {

    document.getElementById("flashcardFeedback").style.display = "none";

    document.getElementById("recallFlashcard").style.display = "none";

    correct = true

    if ( pendingAction == "attack" ) {
      attack()
    }

    return
  }

  // ----------------------------------------------------------
  
  document.getElementById("flashcardFeedback").innerHTML = "The correct answer was: " + correctAnswer

  correct = false



  setTimeout(() => {

    if ( pendingAction == "attack" ) {
      attack()
    }


    document.getElementById("recallFlashcard").style.display = "none";
    document.getElementById("flashcardFeedback").style.display = "none";


  }, 3000);
}





function attack() {
  
  var acting = turnOrder[0]
  var code = acting["code"]

  var attackInfo = CHAR_DB[code]["ATTACK"]

  var bp = attackInfo["basePower"]

  if ( lastRNR == "recall" ) {
    bp *= 1.25
  }

  var acc = attackInfo["accuracy"]

  if ( !correct ) {
    acc = 0
  }

  // !! EDIT THIS LATER TO ALLOW FOR MANUAL TARGETTING !!
  var target = enemies[randiRange(0, 2)]

  // ------------------Calculate Damage-------------------------

  for ( var i = 0; i < attackInfo["hits"]; i++ ) {

    let damage = damageCalc(bp, acting["strength"], target["defence"], acting["level"], 1, acc)

    target["hp"] -= damage

    console.log(code + " attacked " + target["code"] + " for " + String(damage) + "!");

  }

  // ----------------------------------------------------------

  refreshDisplays()

  setTimeout(() => {

    advanceTurn()

  }, 1000);


}

function technique() {

}


function enemyDecision() {

  var acting = turnOrder[0]
  var code = acting["code"]

  var choices = ["attack"]
  var decision = choices[randiRange(0, 0)]

  if ( decision == "attack" ) {
    
    var attackInfo = ENEMY_DB[code]["ATTACK"]
    var target = party[randiRange(0, 2)]

    for ( var i = 0; i < attackInfo["hits"]; i++ ) {

      let damage = damageCalc(attackInfo["basePower"], acting["strength"], target["defence"], acting["level"], 1, attackInfo["accuracy"])

      target["hp"] -= damage

      console.log(code + " attacked " + target["code"] + " for " + String(damage) + "!");

    }
    
  }

  // ----------------------------------------------------------

  refreshDisplays()

  setTimeout(() => {

    advanceTurn()

  }, 1000);

}

function damageCalc(power, strength, defence, level, mods, acc) {

  var hitRoll = randiRange(0, 100) / 100

  if ( hitRoll >= acc ) {
    return 0
  }

  var part1 = ( (2 * level) / 5 ) + 2;
  var final = part1 * power * (strength / defence) * 0.02 + 2;

  return Math.floor(final * mods);

}






function refreshDisplays() {

  // --------------------Check for Fallen Party Members---------------------------

  turnOrder = turnOrder.filter(checkAlive)

  // ----------------------------------------------------------

  if ( turnOrder[0]["side"] == "my" ) {
    document.getElementById("mySlot").src = "/Scenes/Battle/CHAR_DATABASE/" + turnOrder[0]["code"] + "/" + turnOrder[0]["code"] + ".webp";
  }

  // ----------------------------------------------------------

  for ( var i = 0; i < party.length; i++ ) {

    let code = party[i]["code"]
    
    if ( i < 3 ) {
      document.getElementById("myIcon" + String(i)).src = "/Scenes/Battle/CHAR_DATABASE/" + code + "/" + code + ".webp";
      document.getElementById("team" + String(i)).src = "/Scenes/Battle/CHAR_DATABASE/" + code + "/" + code + ".webp";

      if ( party[i]["hp"] > 0 ) {
        document.getElementById("myHP" + String(i) + "Fill").style.width = String(party[i]["hp"] / party[i]["maxHP"] * 100) + "%"
      } else {
        document.getElementById("myHP" + String(i) + "Fill").style.width = "0%"
      }
      
    } else {
      document.getElementById("sub" + String(i)).src = "/Scenes/Battle/CHAR_DATABASE/" + code + "/" + code + ".webp";
    }

    
  }

  for ( var i = 0; i < enemies.length; i++ ) {

    let code = enemies[i]["code"]

    if ( i < 3 ) {
      document.getElementById("enemySlot" + String(i)).src = "/Scenes/Battle/ENEMY_DATABASE/" + code + "/" + code + ".webp";
    }

    if ( enemies[i]["hp"] > 0 ) {
      document.getElementById("enemyHP" + String(i) + "Fill").style.width = String(enemies[i]["hp"] / enemies[i]["maxHP"] * 100) + "%"
    } else {
      document.getElementById("enemyHP" + String(i)).style.display = "none";
      document.getElementById("enemySlot" + String(i)).style.display = "none";
    }

  }

  // ----------------------------------------------------------

  for ( var i = 0; i < 6; i++ ) {
    document.getElementById("turn" + String(i)).src = ""
  }

  for ( var i = 0; i < turnOrder.length; i++ ) {

    let code = turnOrder[i]["code"]

    if ( turnOrder[i]["side"] == "my" ) {
      document.getElementById("turn" + String(i)).src = "/Scenes/Battle/CHAR_DATABASE/" + code + "/" + code + ".webp";
    } else {
      document.getElementById("turn" + String(i)).src = "/Scenes/Battle/ENEMY_DATABASE/" + code + "/" + code + ".webp";
    }
    
  }

  // ----------------------------------------------------------

  document.getElementById("imanaFill").style.height = String(imana) + "%"

  

}

function checkAlive(member) {
  return member["hp"] > 0;
}
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻//





// ⸻⸻⸻⸻⸻⸻ KEY INPUT HANDLER ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻ //

document.onkeypress = function (e) {
    e = e || window.event;
    
    if ( e.key == "1" ) {
      rnrMode = "recognition"
      document.getElementById("rnrModeText").innerHTML = "[Recognition] / Recall"
    } else if ( e.key == "2" ) {
      rnrMode = "recall"
      document.getElementById("rnrModeText").innerHTML = "Recognition / [Recall]"
    } else if ( e.key == "Enter" && inCard ) {
      recallSubmit()
    }

};

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻//











// ---------- BOILER PLATE ----------
function back() {
    if ( confirm("You are about to forfeit the battle!") ) {
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

    if ( getCookie("battleInit") == "" ) {
      
      alert("Error: No active battle! Returning to home...")
      window.location.href = "/index.html";

      return
    }
    battleInit = JSON.parse(getCookie("battleInit"))

    setUp()
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

function randiRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var bouncyButtons = ["attackButton", "techniqueButton"]

for ( var i = 0; i < bouncyButtons.length; i++ ) {
  
  let b = bouncyButtons[i]

  document.getElementById(b).addEventListener('mousedown', () => {
    document.getElementById(b).classList.remove('animate');
    void document.getElementById(b).offsetWidth; // force reflow so the animation restarts if clicked again quickly
    document.getElementById(b).classList.add('animate');
  });

  document.getElementById(b).addEventListener('animationend', () => {
    document.getElementById(b).classList.remove('animate');
  });
}
