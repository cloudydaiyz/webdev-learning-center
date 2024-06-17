const meme = document.getElementById("meme");
const joke = document.getElementById("joke");
const wisdom = document.getElementById("wisdom");
const wisdomAuthor = document.getElementById("wisdom-author");
const riddle = document.getElementById("riddle");
const riddleAnswer = document.getElementById("riddle-answer");

let previousSelected = [];
let riddleVisible = false;

function hidePreviouslySelected(exceptions = []) {
    for(const element of previousSelected) {
        if(!(exceptions.includes(element))) {
            console.log('hide', element);
            element.style.display = "none";
        }
    }
}

function showMeme() {
    hidePreviouslySelected();
    meme.style.display = "unset";
    previousSelected = [meme];
}

function showJoke() {
    hidePreviouslySelected();
    joke.style.display = "unset";
    previousSelected = [joke];
}

function showQuote() {
    hidePreviouslySelected();
    wisdom.style.display = "unset";
    wisdomAuthor.style.display = "unset";
    previousSelected = [wisdom, wisdomAuthor];
}

function showRiddle() {
    hidePreviouslySelected();
    riddle.style.display = "unset";
    previousSelected = [riddle];
}

function showRiddleAnswer() {
    hidePreviouslySelected([riddle]);
    riddleAnswer.style.display = "unset";
    previousSelected = [riddle, riddleAnswer];
}