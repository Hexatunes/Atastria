
let save = JSON.parse(localStorage.getItem("save"));

function promptNewSetName() {
    var setName = prompt("Give your new set a name!");

    if ( setName == "" ) {
        alert("Flashset cannot have an empty name!")
        return
    }

    console.log(flashsets)

    var flashsets = save["flashsets"];

    setName = setName.replaceAll('"', '')
    setName = setName.replaceAll("'", "")

    flashsets.push({
        "name": setName,
        "cards": []
    });

    save_data()

    refreshSetList();
}

function refreshSetList() {
    document.getElementById("FlashsetList").innerHTML = "";

    var flashsets = save["flashsets"];

    if ( flashsets.length == 0 ) {
        document.getElementById("NoSetsLabel").style.display = "block"
        return
    } 

    for ( let i = 0; i < flashsets.length; i++ ) {

        var set = flashsets[i]
        
        const flashsetDiv = document.createElement("div");
        flashsetDiv.className = "FlashsetDiv";

        const openButton = document.createElement("button");
        openButton.className = "FlashsetOpenButton";
        openButton.innerHTML = set["name"];
        openButton.addEventListener("click", () => {
            openSet(i);
        });

        const deleteButton = document.createElement("input");
        deleteButton.className = "FlashsetDeleteButton";
        deleteButton.src = "/Scenes/FlashcardBuilder/Sprites/trashIcon.png";
        deleteButton.type = "image"
        deleteButton.addEventListener("click", () => {
            deleteSet(i);
        });

        const renameButton = document.createElement("button");
        renameButton.className = "FlashsetRenameButton";
        renameButton.innerHTML = "Rename";
        renameButton.addEventListener("click", () => {
            renameSet(i);
        });

        flashsetDiv.appendChild(openButton);
        flashsetDiv.appendChild(deleteButton);
        flashsetDiv.appendChild(renameButton);

        document.getElementById("FlashsetList").appendChild(flashsetDiv);

    }

    document.getElementById("NoSetsLabel").style.display = "none"

}


var editingSet = -1

function openSet(idx) {
    var fs = save["flashsets"][idx];

    editingSet = idx

    document.getElementById("FlashcardEditor").style.display = "block"
    document.getElementById("NewCard").style.display = "block"

    document.getElementById("FlashcardEditor").innerHTML = ""

    document.getElementById("FlashsetList").style.display = "none"
    document.getElementById("NewSet").style.display = "none"

    const setName = document.createElement("p");
    setName.className = "SetName"
    setName.innerHTML = fs["name"];
    document.getElementById("FlashcardEditor").appendChild(setName);

    for ( let i = 0; i < fs["cards"].length; i++ ) {

        var card = fs["cards"][i]

        const cardDiv = document.createElement("div")
        cardDiv.className = "CardDiv"

        const questionInput = document.createElement("input")
        questionInput.className = "QuestionInput"
        questionInput.addEventListener("input", () => {
            updateCard(i, "question", questionInput.value);
        });
        questionInput.placeholder = "Question"

        if (card["question"] != "") {
            questionInput.value = card["question"];
        }
        

        const answerInput = document.createElement("input");
        answerInput.className = "AnswerInput";
        answerInput.addEventListener("input", () => {
            updateCard(i, "answer", answerInput.value);
        });
        if (card["answer"] != "") {
            answerInput.value = card["answer"];
        }
        answerInput.placeholder = "Answer"

        const deleteCardButton = document.createElement("input");
        deleteCardButton.className = "DeleteCard";
        deleteCardButton.type = "image";
        deleteCardButton.src = "/Scenes/FlashcardBuilder/Sprites/trashIcon.png";
        deleteCardButton.addEventListener("click", () => {
            deleteCard(i);
        });

        cardDiv.appendChild(questionInput);
        cardDiv.appendChild(answerInput);
        cardDiv.appendChild(deleteCardButton);

        document.getElementById("FlashcardEditor").appendChild(cardDiv)
        document.getElementById("FlashcardEditor").appendChild(document.createElement("br"))

    }

    if ( fs["cards"].length < 4 ) {
        document.getElementById("CardAmountWarning").style.display = "block";
    } else {
        document.getElementById("CardAmountWarning").style.display = "none";
    }
}

function newCard() {

    var fs = save["flashsets"][editingSet]["cards"];

    fs.push({
        "question": "",
        "answer": "",
    });

    const cardDiv = document.createElement("div")
    cardDiv.className = "CardDiv"

    const questionInput = document.createElement("input")
    questionInput.className = "QuestionInput"
    questionInput.addEventListener("input", () => {
        updateCard(fs.length - 1, "question", questionInput.value);
    });
    questionInput.placeholder = "Question"

    const answerInput = document.createElement("input");
    answerInput.className = "AnswerInput";
    answerInput.addEventListener("input", () => {
        updateCard(fs.length - 1, "answer", answerInput.value);
    });
    answerInput.placeholder = "Answer"

    const deleteCardButton = document.createElement("input");
    deleteCardButton.className = "DeleteCard";
    deleteCardButton.type = "image";
    deleteCardButton.src = "./Sprites/trashIcon.png";
    deleteCardButton.addEventListener("click", () => {
        deleteCard(fs.length - 1);
    });

    cardDiv.appendChild(questionInput);
    cardDiv.appendChild(answerInput);
    cardDiv.appendChild(deleteCardButton);

    document.getElementById("FlashcardEditor").appendChild(cardDiv);
    document.getElementById("FlashcardEditor").appendChild(document.createElement("br"))

    save_data()

    if ( fs.length < 4 ) {
        document.getElementById("CardAmountWarning").style.display = "block";
    } else {
        document.getElementById("CardAmountWarning").style.display = "none";
    }

}
function updateCard(cardIDX, toUpdate, text) {

    var fs = save["flashsets"][editingSet]["cards"];

    fs[cardIDX][toUpdate] = text

    save_data()
}
function deleteCard(cardIDX) {

    var fs = save["flashsets"][editingSet]["cards"];
    fs.splice(cardIDX, 1)

    openSet(editingSet)

    save_data()
}

// -----------------------------------------

function deleteSet(idx) {
    save["flashsets"].splice(idx, 1);

    save_data()

    refreshSetList()
    
}

function renameSet(idx) {

    var newName = prompt("Rename set to...");
    save["flashsets"][idx]["name"] = newName;

    save_data()

    refreshSetList()
    
}














// ---------- BOILER PLATE ----------
function save_data() {
    console.log("Saving... ")
    localStorage.setItem("save", JSON.stringify(save))
}

window.addEventListener("load", () => {
    document.querySelector(".dark").classList.add("slide-out");
    document.querySelector(".white").classList.add("slide-out");
    document.querySelector(".logo").classList.add("slide-out");

    document.getElementById("BGM").volume = 0.3;
    document.getElementById("BGM").play()

    if ( localStorage.getItem("save") == null ) {
      
      var newSave = {
        "flashsets": [],
      };


      localStorage.setItem("save", JSON.stringify(newSave));

      console.log("No save detected. Made a new one!")
    } else {
        refreshSetList()
    }
});

document.addEventListener('click', (event) => {
    document.getElementById("ClickSound").currentTime = 0;
    document.getElementById("ClickSound").play();
});

function back() {
    if ( editingSet == -1){
        document.querySelector(".dark").classList.add("slide-in");
        document.querySelector(".white").classList.add("slide-in");
        document.querySelector(".logo").classList.add("slide-in");

        setTimeout(() => {
            window.location.href = "/index.html";
        }, 800);
    } else {
        document.getElementById("FlashcardEditor").style.display = "none";
        document.getElementById("NewCard").style.display = "none";
        document.getElementById("CardAmountWarning").style.display = "none";

        document.getElementById("FlashsetList").style.display = "block";
        document.getElementById("NewSet").style.display = "block";
        

        editingSet = -1;
    }
    
}
