
// ⸻ [ Global Data ] ⸻
var battleInit = {};           //
var party = [];                //
var enemies = [];              //
    
var imana = 0;                 //

var turnOrder = [];            //
// ⸻⸻⸻⸻⸻


// ⸻⸻⸻⸻⸻⸻ INITIAL SET UP ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻ //

function setUp() {

  console.log(battleInit)

  // --- Instantiate members and generate their mutable live battle data ----

  for ( var i = 0; i < battleInit["party"].length; i++ ) {

    var m = battleInit["party"][i]
    var code = m["code"]
    var level = m["level"]

    var partyInstance = {
      "code": code,

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

    var e = battleInit["enemies"][i]
    var code = e["code"]
    var level = e["level"]

    var enemyInstance = {
      "code": code,

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
  } else {
    document.getElementById("attackButton").style.display = "none";
    document.getElementById("techniqueButton").style.display = "none";
  }

}


function attack() {

}

function technique() {

}


function damageCalc(power, attack, defence, level, mods) {

  var part1 = ( (2 * level) / 5 ) + 2;
  var final = part1 * power * (attack / defence) * 0.02 + 2;

  return final * mods;

}

function refreshDisplays() {

  document.getElementById("mySlot").src = "./CHAR_DATABASE/" + turnOrder[0]["code"] + "/" + turnOrder[0]["code"] + ".webp";

  for ( var i = 0; i < party.length; i++ ) {

    var code = party[i]["code"]
    
    if ( i < 3 ) {
      document.getElementById("myIcon" + String(i)).src = "./CHAR_DATABASE/" + code + "/" + code + ".webp";
      document.getElementById("team" + String(i)).src = "./CHAR_DATABASE/" + code + "/" + code + ".webp";

      document.getElementById("myHP" + String(i) + "Fill").style.width = String(party[i]["hp"] / party[i]["maxHP"] * 100) + "%"
    } else {
      document.getElementById("sub" + String(i)).src = "./CHAR_DATABASE/" + code + "/" + code + ".webp";
    }

    
  }

  for ( var i = 0; i < enemies.length; i++ ) {

    var code = enemies[i]["code"]

    if ( i < 3 ) {
      document.getElementById("enemySlot" + String(i)).src = "./ENEMY_DATABASE/" + code + "/" + code + ".webp";
    }

    document.getElementById("enemyHP" + String(i) + "Fill").style.width = String(enemies[i]["hp"] / enemies[i]["maxHP"] * 100) + "%"
  }



  for ( var i = 0; i < turnOrder.length; i++ ) {

    console.log(turnOrder[i]["side"])

    var code = turnOrder[i]["code"]

    if ( turnOrder[i]["side"] == "my" ) {
      document.getElementById("turn" + String(i)).src = "./CHAR_DATABASE/" + code + "/" + code + ".webp";
    } else {
      document.getElementById("turn" + String(i)).src = "./ENEMY_DATABASE/" + code + "/" + code + ".webp";
    }
    
  }

}
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻//

















// ---------- BOILER PLATE ----------
function back() {
    if ( confirm("You are about to forfeit the battle!") ) {
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

    if ( getCookie("battleInit") == "" ) {
      
      alert("Error: No active battle! Returning to home...")
      window.location.href = "../Home/index.html";

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