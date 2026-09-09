
// ⸻ [ Global Data ] ⸻

let save = null
var username = ""
const CLIENT_ID = '10656282326-os8uk6lis03eurf8q72g6upn9frvc6pf.apps.googleusercontent.com';
const SERVER_URL = 'http://localhost:3000';

let currentCredential = null;


// ⸻⸻⸻⸻⸻


// ⸻⸻⸻⸻⸻⸻ GOOGLE AUTH ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻ //



window.onload = () => {
  google.accounts.id.initialize({
    client_id: CLIENT_ID,
    callback: handleSignIn
  });

  google.accounts.id.renderButton(
    document.getElementById('hiddenGoogleBtn'),
    { theme: 'outline', size: 'large' }
  );
  
  fetch(SERVER_URL + '/auth/me', {
    credentials: 'include'
  })
    .then(res => {
      if (!res.ok) throw new Error('not logged in');
      return res.json();
    })
    .then(data => {
      save = data.save;
      username = data.username
      if ( username == "" ) {

        document.getElementById('UsernameSetupDiv').style.display = 'block';
        fadeIn("UsernameSetupDiv")
        fadeOut("SignInButton")
        fadeOut("GoogleLogo")

        document.getElementById('SignedInView').style.display = 'block';

      } else {
        setUp()
      }
      
    })
    .catch(() => {
      // no valid session — sign-in button stays visible, do nothing
    });
};

// --- Called by Google once the user completes sign-in ---
function handleSignIn(response) {
  currentCredential = response.credential;

  loginAndLoad();
}

function loginAndLoad() {
  fetch(SERVER_URL + '/auth/login', {
    method: 'POST',
    credentials: 'include', // lets the browser store/send the cookie
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential: currentCredential })
  })
    .then(res => res.json())
    .then(data => { 
      save = data.save;
      username = data.username

      console.log("username: ", data.username)
      
      if ( username == "" ) {

        document.getElementById('UsernameSetupDiv').style.display = 'block';
        fadeIn("UsernameSetupDiv")
        fadeOut("SignInButton")
        fadeOut("GoogleLogo")

      } else {
        setUp()
      }
    });
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻//

function setUp() {
  document.getElementById('SignedOutView').style.display = 'none';
  document.getElementById('SignedInView').style.display = 'block';

  document.getElementById("UsernameDisplay").innerHTML = username

  generateList()
}

function generateList() {

  document.getElementById("StoryHolder").innerHTML = "";

    // --- Generate list ---

  for ( let i = MainStoryMap.length - 1; i >= 0; i-- ) {

      let storyNode = MainStoryMap[i]

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

      } else if ( i > 0 && MainStoryMap[i - 1]["code"] in save["story"] ) {

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

function loadNode(i) {

  var node = MainStoryMap[i];

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

function openMainStory() {
  console.log("afj;a")
  fadeInFast("MainStory")
  document.getElementById("MainStoryButton").style.display = "none";
}

function closeMainStory() {
  fadeOutFast("MainStory")
  document.getElementById("MainStoryButton").style.display = "block";
}


// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻//


function requestUsername() {
  var pendingUsername = document.getElementById("UsernameInput").value

  if ( pendingUsername == "" ) {
    document.getElementById("UsernameSetupText").innerHTML = "Username can't be empty"
    return
  }

  var value = pendingUsername.replace(/[^\w\s]/g, '')

  console.log(value)

  fetch(`${SERVER_URL}/username/set`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        username = data.username;
        
        document.getElementById("UsernameSetupDiv").style.display = "none";
        document.getElementById("SignedOutView").style.display = "none";
        document.getElementById("SignedInView").style.display = "block";
        fadeIn("SignedInView")

        document.getElementById("UsernameDisplay").innerHTML = username
      } else {
        console.warn('Update rejected:', data.error);
        document.getElementById("UsernameSetupText").innerHTML = data.error
      }
      return data;
    });
}
















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

document.getElementById('SignInButton').addEventListener('click', () => {
  document.getElementById('hiddenGoogleBtn').querySelector('div[role="button"]').click();
});

// --- Sign out ---
document.getElementById('SignOutButton').addEventListener('click', () => {
  fetch(SERVER_URL + '/auth/logout', {
    method: 'POST',
    credentials: 'include'
  }).finally(() => {
    currentCredential = null;
    save = null;

    document.getElementById('SignedInView').style.display = 'none';
    document.getElementById('SignedOutView').style.display = 'block';
    document.getElementById("SignedOutView").style.opacity = "1";
    document.getElementById("GoogleLogo").style.opacity = "1";
    document.getElementById("SignInButton").style.opacity = "1";

    document.getElementById("UsernameSetupDiv").style.display = "none";

    google.accounts.id.disableAutoSelect(); // stops it from silently re-signing them in
  });
});


