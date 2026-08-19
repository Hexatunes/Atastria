
// ⸻ [ Global Data ] ⸻
var battleInit = {};           //
var party = [];                //
var enemies = [];              //
    
var imana = 0;                 //

var turnOrder = [];            //

var rnrMode = "recognition";   //

var scene = "Sunset";          //
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
      "DISPLAY_NAME": CHAR_DB[code]["DISPLAY_NAME"],
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
      "DISPLAY_NAME": ENEMY_DB[code]["DISPLAY_NAME"],
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

  document.getElementById("mySlot0").src = "/Scenes/Battle/CHAR_DATABASE/" + party[0]["code"] + "/" + party[0]["code"] + "Idle" + scene + ".png";
  document.getElementById("mySlot1").src = "/Scenes/Battle/CHAR_DATABASE/" + party[1]["code"] + "/" + party[1]["code"] + "Idle" + scene + ".png";
  document.getElementById("mySlot2").src = "/Scenes/Battle/CHAR_DATABASE/" + party[2]["code"] + "/" + party[2]["code"] + "Idle" + scene + ".png";

  document.getElementById("enemySlot0").src = "/Scenes/Battle/ENEMY_DATABASE/" + enemies[0]["code"] + "/" + enemies[0]["code"] + ".png";
  document.getElementById("enemySlot1").src = "/Scenes/Battle/ENEMY_DATABASE/" + enemies[1]["code"] + "/" + enemies[1]["code"] + ".png";
  document.getElementById("enemySlot2").src = "/Scenes/Battle/ENEMY_DATABASE/" + enemies[2]["code"] + "/" + enemies[2]["code"] + ".png";

  document.getElementById("bgLayer1").src = "/Scenes/Battle/Sprites/battleBG" + scene + ".png" 
  


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

  //--------------Increment Statuses-----------------

  for ( var i = 0; i < party.length; i++ ) {

    for ( var j = 0; j < party[i]["statuses"].length; j++ ) {

      var status = party[i]["statuses"][j]

      if ( status["effect"] == "heal" ) {

        applyStatus(party[i], "heal")
        
      }

    }

  }

  for ( var i = 0; i < party.length; i++ ) {

    for ( var j = 0; j < party[i]["statuses"].length; j++ ) {

      var status = party[i]["statuses"][j]

      status["turns_passed"] += 1
      console.log(party[i]["DISPLAY_NAME"] + "'s " + status["name"] + " down to " + String(status["turns_duration"] - status["turns_passed"]))

      if ( status["turns_passed"] > status["turns_duration"] ) {

        battlelog(party[i]["DISPLAY_NAME"] + "'s " + '"' + status["name"] + '" expired!');
        removeStatus(party[i], status["effect"])
        party[i]["statuses"].splice(j, 1);
        
      }

    }

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

var pinned = 0
var pinnedSelf = 0

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
    } else if ( pendingAction == "technique" ) {
      technique()
    }

    return
  }

  // ----------------------------------------------------------
  
  
  document.getElementById("flashcardFeedback").innerHTML = "The correct answer was: " + document.getElementById("recognitionAnswer" + String(correctAnswer) ).innerHTML

  correct = false
  

  setTimeout(() => {

    if ( pendingAction == "attack" ) {
      attack()
    } else if ( pendingAction == "technique" ) {
      technique()
    }


    document.getElementById("recognitionFlashcard").style.display = "none";
    document.getElementById("flashcardFeedback").style.display = "none";

  }, 3000);
  
  // ----------------------------------------------------------

}

function recallSubmit() {

  document.getElementById("recallAnswer").style.display = "none";
  document.getElementById("flashcardFeedback").style.display = "block";

  // ----------------------------------------------------------
  
  if ( document.getElementById("recallAnswer").value == correctAnswer ) {

    document.getElementById("flashcardFeedback").style.display = "none";
    document.getElementById("recallFlashcard").style.display = "none";

    document.getElementById("recallAnswer").value = "";

    correct = true

    if ( pendingAction == "attack" ) {
      attack()
    } else if ( pendingAction == "technique" ) {
      technique()
    }


    return
  }

  // ----------------------------------------------------------

  document.getElementById("recallAnswer").value = "";
  
  document.getElementById("flashcardFeedback").innerHTML = "The correct answer was: " + correctAnswer

  correct = false



  setTimeout(() => {

    if ( pendingAction == "attack" ) {
      attack()
    } else if ( pendingAction == "technique" ) {
      technique()
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
    bp *= 1.5
  }

  var acc = attackInfo["accuracy"]

  if ( !correct ) {
    acc = 0
  }

  var defendingStat = "defence"

  if ( attackInfo["stat"] == "magic" ) {
    defendingStat = "resistence"
  }

  var target = enemies[pinned]

  // ------------------Calculate Damage-------------------------

  for ( var i = 0; i < attackInfo["hits"]; i++ ) {

    let damage = damageCalc(bp, acting[attackInfo["stat"]], target[defendingStat], acting["level"], 1, acc)

    target["hp"] -= damage

    battlelog(acting["DISPLAY_NAME"] + " used " + attackInfo["name"] + " on " + target["DISPLAY_NAME"] + " for " + String(damage) + "!");

  }

  if ( lastRNR == "recognition" && correct ) {
    imana += 5
  } else if ( lastRNR == "recall" && correct ) {
    imana += 10
  }

  if ( imana > 100 ) {
    imana = 100
  }

  // ----------------------------------------------------------

  refreshDisplays()

  setTimeout(() => {

    advanceTurn()

  }, 500);


}

function mySlotInput(idx) {

  if ( pendingAction = "chooseTeammateTechnique" ) {
    pinnedSelf = idx;
    initiateFlashcard("technique")

    document.getElementById("teamFocus").style.display = "none";
    document.getElementById("focusText").style.display = "none";
  }

}

function techniqueTarget() {

  var acting = turnOrder[0]
  var code = acting["code"]

  var techniqueInfo = CHAR_DB[code]["TECHNIQUE"]

  if ( techniqueInfo["type"] == "heal" || (techniqueInfo["type"] == "status" && techniqueInfo["status"]["type"] == "positive") ) {

    document.getElementById("teamFocus").style.display = "block";
    document.getElementById("focusText").style.display = "block";

    pendingAction = "chooseTeammateTechnique"

  } else {
    initiateFlashcard("technique")
  }

}

function technique() {

  // ------------------Set Up Variables-------------------------

  var acting = turnOrder[0]
  var code = acting["code"]

  var techniqueInfo = CHAR_DB[code]["TECHNIQUE"]

  var bp = techniqueInfo["basePower"]

  if ( lastRNR == "recall" ) {
    bp *= 1.5
  }

  var defendingStat = "defence"

  if ( techniqueInfo["stat"] == "magic" ) {
    defendingStat = "resistence"
  }

  var acc = techniqueInfo["accuracy"]

  if ( !correct ) {
    acc = 0
  }

  var target = enemies[pinned]

  if ( techniqueInfo["type"] == "heal" || (techniqueInfo["type"] == "status" && techniqueInfo["status"]["type"] == "positive") ) {
    target = party[pinnedSelf];
  }

  // ------------Act Depending on Type of Technique-------------

  if ( techniqueInfo["type"] == "damage" ) {

    for ( var i = 0; i < techniqueInfo["hits"]; i++ ) {

      let damage = damageCalc(bp, acting[techniqueInfo["stat"]], target[defendingStat], acting["level"], 1, acc)

      target["hp"] -= damage

      battlelog(acting["DISPLAY_NAME"] + " used " + techniqueInfo["name"] + " on " + target["DISPLAY_NAME"] + " for " + String(damage) + "!");

    
    }

  } else if ( techniqueInfo["type"] == "status" ) {

    if ( correct ) {
      target["statuses"].push({
        "name": techniqueInfo["status"]["name"],
        "effect": techniqueInfo["status"]["effect"],
        "turns_duration": techniqueInfo["status"]["turns"],
        "turns_passed": 0,
      })

      if ( techniqueInfo["status"]["type"] == "positive" ) {
        battlelog(acting["DISPLAY_NAME"] + ' gave inspiration "' + techniqueInfo["status"]["name"] + '" to ' + target["DISPLAY_NAME"] + "!");
      } else {
        battlelog(acting["DISPLAY_NAME"] + ' gave hinderance "' + techniqueInfo["status"]["name"] + '" to ' + target["DISPLAY_NAME"] + "!");
      }
      

      applyStatus(target, techniqueInfo["status"]["effect"])
    }

    

  } else if ( techniqueInfo["type"] == "drain" ) {

    for ( var i = 0; i < techniqueInfo["hits"]; i++ ) {

      let damage = damageCalc(bp, acting[techniqueInfo["stat"]], target[defendingStat], acting["level"], 1, acc)

      target["hp"] -= damage
      acting["hp"] += Math.floor(damage * 0.5)

      if ( acting["hp"] > acting["maxHP"] ) {
        acting["hp"] = acting["maxHP"]
      }

      battlelog(acting["DISPLAY_NAME"] + " used " + techniqueInfo["name"] + " on " + target["DISPLAY_NAME"] + " for " + String(damage) + "!");
      battlelog(acting["DISPLAY_NAME"] + " healed " + String(damage * 0.5) + " and now has " + String(acting["hp"]) + "/" + String(acting["maxHP"]) + " hp!")

    
    }

  } else if ( techniqueInfo["type"] == "heal" ) {

    for ( var i = 0; i < techniqueInfo["hits"]; i++ ) {

      let heal = damageCalc(bp, acting[techniqueInfo["stat"]], 100, acting["level"], 1, acc)

      target["hp"] += heal

      if ( target["hp"] > target["maxHP"] ) {
        target["hp"] = target["maxHP"]
      }

      battlelog(acting["DISPLAY_NAME"] + " used " + techniqueInfo["name"] + " on " + target["DISPLAY_NAME"] + " to heal " + String(heal) + "hp!");

    
    }

  
  }

  

  // ----------------------------------------------------------

  if ( lastRNR == "recognition" && correct ) {
    imana += 5
  } else if ( lastRNR == "recall" && correct ) {
    imana += 10
  }
  

  if ( imana > 100 ) {
    imana = 100
  }


  refreshDisplays()

  setTimeout(() => {

    advanceTurn()

  }, 500);

}


function enemyDecision() {

  var acting = turnOrder[0]
  var code = acting["code"]

  var choices = ["attack", "technique"]
  var decision = choices[randiRange(0, 1)]

  if ( decision == "attack" ) {
    
    var attackInfo = ENEMY_DB[code]["ATTACK"]
    var targetIDX = randiRange(0, 2)
    var target = party[targetIDX]

    for ( var i = 0; i < attackInfo["hits"]; i++ ) {

      let damage = damageCalc(attackInfo["basePower"], acting["strength"], target["defence"], acting["level"], 1, attackInfo["accuracy"])

      target["hp"] -= damage

      battlelog(acting["DISPLAY_NAME"] + " attacked " + target["DISPLAY_NAME"] + " for " + String(damage) + "!");

    }

    if ( targetIDX == 0 ) {
      setCameraAnchor("right");

      document.getElementById("mySlot0").classList.add("visible")
      document.getElementById("mySlot1").classList.remove("visible")
      document.getElementById("mySlot2").classList.remove("visible")
    } else if ( targetIDX == 1 ) {
      setCameraAnchor("center");
      document.getElementById("mySlot0").classList.remove("visible")
      document.getElementById("mySlot1").classList.add("visible")
      document.getElementById("mySlot2").classList.remove("visible")
    } else if ( targetIDX == 2 ) {
      setCameraAnchor("left");
      document.getElementById("mySlot0").classList.remove("visible")
      document.getElementById("mySlot1").classList.remove("visible")
      document.getElementById("mySlot2").classList.add("visible")
    }
    
  } else if ( decision == "technique" ) {
    
    var techniqueInfo = ENEMY_DB[code]["TECHNIQUE"]
    var targetIDX = randiRange(0, 2)
    var target = party[targetIDX]

    var defendingStat = "defence"

    if ( techniqueInfo["stat"] == "magic" ) {
      defendingStat = "resistence"
    }

    var acc = techniqueInfo["accuracy"]

    if ( !correct ) {
      acc = 0
    }

    if ( techniqueInfo["type"] == "heal" || (techniqueInfo["type"] == "status" && techniqueInfo["status"]["type"] == "positive") ) {
      target = enemies[randiRange(0,2)];
    }

    // ------------Act Depending on Type of Technique-------------

    if ( techniqueInfo["type"] == "damage" ) {

      for ( var i = 0; i < techniqueInfo["hits"]; i++ ) {

        let damage = damageCalc(bp, acting[techniqueInfo["stat"]], target[defendingStat], acting["level"], 1, acc)

        target["hp"] -= damage

        battlelog(acting["DISPLAY_NAME"] + " used " + techniqueInfo["name"] + " on " + target["DISPLAY_NAME"] + " for " + String(damage) + "!");

      
      }

    } else if ( techniqueInfo["type"] == "status" ) {

      if ( correct ) {
        target["statuses"].push({
          "name": techniqueInfo["status"]["name"],
          "effect": techniqueInfo["status"]["effect"],
          "turns_duration": techniqueInfo["status"]["turns"],
          "turns_passed": 0,
        })

        if ( techniqueInfo["status"]["type"] == "positive" ) {
          battlelog(acting["DISPLAY_NAME"] + ' gave inspiration "' + techniqueInfo["status"]["name"] + '" to ' + target["DISPLAY_NAME"] + "!");
        } else {
          battlelog(acting["DISPLAY_NAME"] + ' gave hinderance "' + techniqueInfo["status"]["name"] + '" to ' + target["DISPLAY_NAME"] + "!");
        }
        

        applyStatus(target, techniqueInfo["status"]["effect"])
      }

      

    } else if ( techniqueInfo["type"] == "drain" ) {

      for ( var i = 0; i < techniqueInfo["hits"]; i++ ) {

        let damage = damageCalc(bp, acting[techniqueInfo["stat"]], target[defendingStat], acting["level"], 1, acc)

        target["hp"] -= damage
        acting["hp"] += Math.floor(damage * 0.5)

        if ( acting["hp"] > acting["maxHP"] ) {
          acting["hp"] = acting["maxHP"]
        }

        battlelog(acting["DISPLAY_NAME"] + " used " + techniqueInfo["name"] + " on " + target["DISPLAY_NAME"] + " for " + String(damage) + "!");
        battlelog(acting["DISPLAY_NAME"] + " healed " + String(damage * 0.5) + " and now has " + String(acting["hp"]) + "/" + String(acting["maxHP"]) + " hp!")

      
      }

    } else if ( techniqueInfo["type"] == "heal" ) {

      for ( var i = 0; i < techniqueInfo["hits"]; i++ ) {

        let heal = damageCalc(bp, acting[techniqueInfo["stat"]], 100, acting["level"], 1, acc)

        target["hp"] += heal

        if ( target["hp"] > target["maxHP"] ) {
          target["hp"] = target["maxHP"]
        }

        battlelog(acting["DISPLAY_NAME"] + " used " + techniqueInfo["name"] + " on " + target["DISPLAY_NAME"] + " to heal " + String(heal) + "hp!");

      
      }

    
    }

    if ( targetIDX == 0 ) {
      setCameraAnchor("right");

      document.getElementById("mySlot0").classList.add("visible")
      document.getElementById("mySlot1").classList.remove("visible")
      document.getElementById("mySlot2").classList.remove("visible")
    } else if ( targetIDX == 1 ) {
      setCameraAnchor("center");
      document.getElementById("mySlot0").classList.remove("visible")
      document.getElementById("mySlot1").classList.add("visible")
      document.getElementById("mySlot2").classList.remove("visible")
    } else if ( targetIDX == 2 ) {
      setCameraAnchor("left");
      document.getElementById("mySlot0").classList.remove("visible")
      document.getElementById("mySlot1").classList.remove("visible")
      document.getElementById("mySlot2").classList.add("visible")
    }
    
  }

  // ----------------------------------------------------------

  refreshDisplays()

  setTimeout(() => {

    advanceTurn()

  }, 1500);

  imana += 1

  if ( imana > 100 ) {
    imana = 100
  }

}

function damageCalc(power, stat, defence, level, mods, acc) {

  var hitRoll = randiRange(0, 100) / 100

  if ( hitRoll >= acc ) {
    return 0
  }

  var part1 = ( (2 * level) / 5 ) + 2;
  var final = part1 * power * (stat / defence) * 0.02 + 2;

  return Math.floor(final * mods);

}




function setPinned(idx) {
  document.getElementById("pin" + String(pinned)).src = "/Scenes/Battle/Sprites/transparent.png";
  pinned = idx;
  document.getElementById("pin" + String(pinned)).src = "/Scenes/Battle/Sprites/pinned.png";
}

const CAMERA_ANCHORS = {
  "left":   { "x": '-13vmin', "y": '0vmin'  },
  "center": { "x": '0vmin',   "y": '0vmin'  },
  "right":  { "x": '13vmin',  "y": '0vmin' },
};

function setCameraAnchor(name, durationMs = 900) {
  const rig = document.querySelector('.camera-rig');
  if (!rig || !CAMERA_ANCHORS[name]) return;
  const a = CAMERA_ANCHORS[name];
  rig.style.transitionDuration = `${durationMs}ms`;
  rig.style.transform = `translate(${a.x}, ${a.y})`;
}


function refreshDisplays() {

  // --------------------Check for Fallen Party Members---------------------------

  turnOrder = turnOrder.filter(checkAlive)

  // ----------------------------------------------------------

  for ( var i = 0; i < party.length; i++ ) {

    let code = party[i]["code"]
    
    if ( i < 3 ) {
      document.getElementById("myIcon" + String(i)).src = "/Scenes/Battle/CHAR_DATABASE/" + code + "/" + code + "Icon" + ".png";
      document.getElementById("team" + String(i)).src = "/Scenes/Battle/CHAR_DATABASE/" + code + "/" + code + "Icon" + ".png";

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

    if ( enemies[i]["hp"] > 0 ) {
      document.getElementById("enemyHP" + String(i) + "Fill").style.width = String(enemies[i]["hp"] / enemies[i]["maxHP"] * 100) + "%"
    } else {
      document.getElementById("enemyHP" + String(i)).style.display = "none";
      document.getElementById("enemySlot" + String(i)).style.display = "none";

      if ( pinned == i ) {
        document.getElementById("pin" + String(i)).style.display = "none";

        for ( var j = 0; j < 3; j++ ) {
          if ( enemies[j]["hp"] > 0 ) {
            document.getElementById("pin" + String(j)).src = "/Scenes/Battle/Sprites/pinned.png";
            pinned = j
            break
          }
        }
      }
    }

  }

  // ----------------------------------------------------------

  for ( var i = 0; i < 6; i++ ) {
    document.getElementById("turn" + String(i)).src = ""
  }

  for ( var i = 0; i < turnOrder.length; i++ ) {

    let code = turnOrder[i]["code"]

    if ( turnOrder[i]["side"] == "my" ) {
      document.getElementById("turn" + String(i)).src = "/Scenes/Battle/CHAR_DATABASE/" + code + "/" + code + "Icon" + ".png";
    } else {
      document.getElementById("turn" + String(i)).src = "/Scenes/Battle/ENEMY_DATABASE/" + code + "/" + code + ".png";
    }
    
  }

  // ----------------------------------------------------------

  document.getElementById("imanaFill").style.top = String(imana - 100) + "%"

  // ----------------------------------------------------------

  if ( turnOrder[0]["code"] == party[0]["code"] ) {
    setCameraAnchor("right");

    document.getElementById("mySlot0").classList.add("visible")
    document.getElementById("mySlot1").classList.remove("visible")
    document.getElementById("mySlot2").classList.remove("visible")
  } else if ( turnOrder[0]["code"] == party[1]["code"] ) {
    setCameraAnchor("center");
    document.getElementById("mySlot0").classList.remove("visible")
    document.getElementById("mySlot1").classList.add("visible")
    document.getElementById("mySlot2").classList.remove("visible")
  } else if ( turnOrder[0]["code"] == party[2]["code"] ) {
    setCameraAnchor("left");
    document.getElementById("mySlot0").classList.remove("visible")
    document.getElementById("mySlot1").classList.remove("visible")
    document.getElementById("mySlot2").classList.add("visible")
  }


}

function checkAlive(member) {
  return member["hp"] > 0;
}

function applyStatus(char, effect) {

  var change = 25

  switch (effect) {

    case "heal":
      char["hp"] += Math.floor(char["maxHP"] * 0.08)

      if ( char["hp"] > char["maxHP"] ) {
        char["hp"] = char["maxHP"]
      }
      break;
    
    case "strengthUp":

      char["strength"] += change

      break;
    
    case "strengthDown":

      char["strength"] -= change

      break;
    
    case "magicUp":

      char["magic"] += change

      break;
    
    case "magicDown":

      char["magic"] -= change

      break;
    
    case "defenceUp":

      char["defence"] += change

      break;
    
    case "defenceDown":

      char["defence"] -= change

      break;
    
    case "resistenceUp":

      char["resistence"] += change

      break;
    
    case "resistenceDown":

      char["resistence"] -= change

      break;
    
    case "speedUp":

      char["speed"] += change

      break;
    
    case "speedDown":

      char["speed"] -= change

      break;
  }

}

function removeStatus(char, effect) {

  var change = 25

  switch (effect) {
    
    case "strengthUp":

      char["strength"] -= change

      break;
    
    case "strengthDown":

      char["strength"] += change

      break;
    
    case "magicUp":

      char["magic"] -= change

      break;
    
    case "magicDown":

      char["magic"] += change

      break;
    
    case "defenceUp":

      char["defence"] -= change

      break;
    
    case "defenceDown":

      char["defence"] += change

      break;
    
    case "resistenceUp":

      char["resistence"] -= change

      break;
    
    case "resistenceDown":

      char["resistence"] += change

      break;
    
    case "speedUp":

      char["speed"] -= change

      break;
    
    case "speedDown":

      char["speed"] += change

      break;
  }

}

function battlelog(message) {
  const m = document.createElement("p")
  m.innerHTML = String(message)
  m.className = "logtext"
  document.getElementById("battlelog").appendChild(m)

  document.getElementById("battlelog").scrollTo({
    top: document.getElementById("battlelog").scrollHeight,
    behavior: 'smooth'
  });
}
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻//





// ⸻⸻⸻⸻⸻⸻ KEY INPUT HANDLER ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻ //

document.onkeypress = function (e) {
    e = e || window.event;

    //console.log(e.key)
    
    if ( e.key == "1" && !inCard ) {

      rnrMode = "recognition"
      document.getElementById("rnrModeText").innerHTML = "[Recognition] / Recall"

    } else if ( e.key == "2" && !inCard ) {

      rnrMode = "recall"
      document.getElementById("rnrModeText").innerHTML = "Recognition / [Recall]"

    } else if ( e.key == "Enter" && inCard ) {

      recallSubmit()

    } else if ( e.key == "q" && !inCard) {

      initiateFlashcard('attack')
      
    } else if ( e.key == "e" && !inCard) {

      techniqueTarget()

    } else if ( e.key == "a" && !inCard) {

      if ( document.getElementById("battlelog").style.display == "none" ) {
        document.getElementById("battlelog").style.display = "block";
      } else {
        document.getElementById("battlelog").style.display = "none";
      }

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

var bouncyButtons = ["attackButton", "techniqueButton", "pin0", "pin1", "pin2"]

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

