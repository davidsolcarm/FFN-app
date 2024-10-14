//CODE 

window.onload = function() {
    loadNotes()
}

document.addEventListener('visibilitychange', function() {
    saveNotes();
})

    //Hidden buttons for debugging
    document.getElementById("loadButton").addEventListener("click", loadNotes);
    document.getElementById("saveButton").addEventListener("click", saveNotes);
    document.getElementById("clearButton").addEventListener("click", clearStorage);


//Listeners for our "Click Me" button, automatic text resize, and info button
document.getElementById("myButton").addEventListener("click", createNote);
document.getElementById("inputTextArea").addEventListener("input", modifyTextHeight);
document.getElementById("extendButton").addEventListener("click", expandNotesSpace)
document.getElementById("infoButton").addEventListener("click", showInfo);

var notesDivContainer = document.getElementById("notesDivContainer")
var inputTextArea = document.getElementById("inputTextArea")
var body = document.body
    body.style.width = "600px"

//declare of the textHeight to 0 (number)
var textHeight = 0;

//declare the notesToSave 
var notesToSave = document.getElementsByClassName("note")
var idNotesToSave = document.getElementsByClassName("noteDiv")

//this funtion creates a new note inside the div
function createNote(){

    //id of Div and childs
    var id = generateId()

    //create the note div
    let noteDiv = createNoteDiv(id)

    //append to noteDiv the textarea and button 
    createTextArea(noteDiv)
    createDeleteButton(noteDiv, id)
    
}

function expandNotesSpace() {

    switch (body.style.width) {
        case '600px':
            body.style.width = "1000px"
            break;

        case '1000px':
            body.style.width = "1800px"  
            break;            
    
        default:
            body.style.width = "600px"
            break;
    }

}

function setAddedNotesToPage(id, text, width, height) {
    let noteDiv = createNoteDiv(id)
    createTextArea(noteDiv, id, text, height, width)
    createDeleteButton(noteDiv, id)
}

function generateId() {
    return Math.floor(Math.random() * 100000)
}

function createNoteDiv(id) {
    let noteDiv = document.createElement("div")
    noteDiv.className = "noteDiv"
    noteDiv.id = id
    notesDivContainer.insertAdjacentElement("afterbegin", noteDiv)
    return noteDiv
}

function createTextArea(noteDiv, id, text, width, height ) {
    if (arguments.length == 5) {
        let noteTextArea = document.createElement("textarea");
        noteTextArea.className = "note";
        noteTextArea.innerHTML = text;
        noteTextArea.style.height = height;
        noteTextArea.style.width = width;
        noteTextArea.id = id;
        noteDiv.appendChild(noteTextArea);
    } else {
        let noteTextArea = document.createElement("textarea");
        noteTextArea.className = "note";
        noteTextArea.innerHTML = inputTextArea.value
        noteTextArea.style.height = inputTextArea.style.height
        noteDiv.appendChild(noteTextArea);
    
        resetinputTextArea()
    }
}

function createDeleteButton(noteDiv, id) {
    let deleteButton = document.createElement("button");
    deleteButton.className = "deleteButton"
    deleteButton.innerHTML = "X"
    deleteButton.id = id
    noteDiv.appendChild(deleteButton)
    addDeleteEvent(id)
}   

function resetinputTextArea() {
    inputTextArea.style.height = "34px"
    inputTextArea.value = ""
}

function addDeleteEvent(id) {
    document.querySelector('.deleteButton').addEventListener("click", function(){
        notesDivContainer.removeChild(document.getElementById(id))
    })
}


//this funtion autamically uodates the text height of the text area to 
//to match the input
function modifyTextHeight() {
    inputTextArea.style.height = "auto";
    inputTextArea.style.height = `${inputTextArea.scrollHeight}px`;
    textHeight = inputTextArea.scrollHeight;
}

async function saveNotes() {

    //array that hold all the notes to be saved
    var notesArray = [];

    await clearStorage()
    
    for (var i = 0; i < notesToSave.length; i++ ) {
        //singleNoteToSave = [id, text, height, width]
        let singleNoteToSave = [];

        singleNoteToSave.push(idNotesToSave[i].id);
        singleNoteToSave.push(notesToSave[i].innerHTML);
        singleNoteToSave.push(notesToSave[i].style.height);
        singleNoteToSave.push(notesToSave[i].style.width);

        notesArray.push(singleNoteToSave);
    }

    chrome.storage.sync.set({"notes": notesArray},function() {
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });

    console.log(notesArray);
    console.log("Notes were saved")

}

function clearStorage() {
    chrome.storage.sync.clear( function() {
        if (chrome.runtime.error) {
            console.log("Runtime error while clearing storage")
        }
    })
}

async function loadNotes(){ 

    chrome.storage.sync.get("notes", function(data) {
        addNotesToPage(data.notes)
    })

}

function addNotesToPage(notesToLoad) {

    console.log(notesToLoad)
    var notesToLoadReversed = notesToLoad.toReversed();
    console.log(notesToLoadReversed)

    for (var n = 0; n < notesToLoadReversed.length; n++) {
        setAddedNotesToPage(
            notesToLoadReversed[n][0],
            notesToLoadReversed[n][1],
            notesToLoadReversed[n][2],
            notesToLoadReversed[n][3])
            
    }

}



function showInfo() {
    alert(

        "Welcome to the Free Fast Note app!" + "\n" +
        "This app is designed as a free, lightweight extension to take notes" +
        ", I hope you like it" + "\n" +
        "\n" +
        "How to use it?" + "\n" +
        "1. Type your note in 'Type your new note'" + "\n" +
        "2. Click on 'Click me' button" + "\n" +
        "3. Drag the bottom right corner to resize it" + "\n" +
        "Now you are done!" + "\n\n" +
        "The '<->' button expands your note space" + "\n\n" +

        "Note: Your notes will sync with your google account to be avaiable in all your devices" + "\n\n" +


        "If you want to contribute you can go to my github: \n davidsolcarm/FFN-app" +
        "\n\nMore info in my Github Repo"
    )
}


