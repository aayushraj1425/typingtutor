import words from "./words.js"

let time = {"time1": 30, "time2" : 60, "time3": 120};
let level = {"level1": "standard", "level2": "professional"};

const time1 = document.querySelector("#time1");
const time2 = document.querySelector("#time2");
const time3 = document.querySelector("#time3");
const level1 = document.querySelector("#level1");
const level2 = document.querySelector("#level2");
const text = document.querySelector("#test-text");
const displayText = document.querySelector("#display-text");
const mins = document.querySelector('#minutes');
const secs = document.querySelector('#seconds');

let typing = false; /* Will be false unless user starts typing something */

let testTime, testLevel, testWords; 
time1.onclick = function () {
    if (typing == false) {
        setDisplayTime("time1", time1);
    }
}
time2.onclick = function () {
    if (typing == false) {
        setDisplayTime("time2", time2);
    }
}
time3.onclick = function () {
    if (typing == false) {
        setDisplayTime("time3", time3);
    }
}
level1.onclick = function () {
    if (typing == false) {
        setLevel("level1", level1);
        typingTest();
    }
}
level2.onclick = function () {
    if (typing == false) {
        setLevel("level2", level2);
        typingTest();
    }
}

let prevTime;
let prevLevel;
function setDisplayTime(timeType, timeTypeDOM) {
    /* Changes DisplayTime to selected time type */
    
    testTime = time[timeType];
    mins.textContent = Math.floor(testTime / 60);
    secs.textContent = `${testTime % 60 < 10 ? '0' : ''}${testTime % 60}`;
    timeTypeDOM.style.color = "rgb(85, 85, 85)";
    timeTypeDOM.style.fontWeight = "bold";
    if (prevTime != timeTypeDOM && prevTime != null) {
        prevTime.style.color = "rgb(120, 116, 116)";
        prevTime.style.fontWeight = "normal";
    }
    prevTime = timeTypeDOM;
}

function setLevel(levelType, levelTypeDOM) {
    /* Sets Typing Test Level to selected level type */

    testLevel = level[levelType];
    testWords = words[levelType];
    levelTypeDOM.style.color = "rgb(85, 85, 85)";
    levelTypeDOM.style.fontWeight = "bold";
    if (prevLevel != levelTypeDOM && prevLevel != null) {
        prevLevel.style.color = "rgb(120, 116, 116)";
        prevLevel.style.fontWeight = "normal";
    }
    prevLevel = levelTypeDOM;
}

// Default Settings //
setDisplayTime("time1", time1);
setLevel("level1", level1);

let currentKey;
function waitForKey () {
/* Return promise for everytime user types a key */

    return new Promise((resolve) => {
        document.addEventListener('keydown', (event) => {
            // console.log("User typed:" + event.key);
            // currentKey= event.key;
            typing = true;
            resolve(event.key);
        }, {once: true});
    });
}

let remainingTime;
function startTimer(durationInSeconds) {
    /* Countdown Timer */

    remainingTime = durationInSeconds;
    const timerInterval = setInterval(() => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    // console.log(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    mins.textContent = `${minutes}`;
    secs.textContent = `${seconds < 10 ? '0' : ''}${seconds}`;

    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        console.log("Time's up!");
    }

    remainingTime--;
    }, 1000); 
}

let x = 0; // Initial word index //
let originalPara = "";
function generateParaText(x, testWords) {
    /* Generates paraText with each character in a span */

    text.innerHTML = "";
    const paragraph = testWords.slice(x, x + 60).join(" ") + (" ");
    for (let i = 0; i < paragraph.length; i++) {
        const span = document.createElement("span");
        span.textContent = paragraph[i].toLowerCase();
        text.appendChild(span);
    }
    originalPara += paragraph.toLowerCase();
}


function markRed(paraSpans, currentLetterIndex) {
    /* Marks the selected character to red */
    
    paraSpans[currentLetterIndex].style.color = "red";   
}

function markGreen(paraSpans, currentLetterIndex) {
    /* Marks the selected character to green */

    paraSpans[currentLetterIndex].style.color = "green";  
}   

function markBlack(paraSpans, currentLetterIndex) {
    /* Unmarks the selected character to default color */
    
    paraSpans[currentLetterIndex].style.color = "black";
}

let typedTextPara = "";
async function typingTest () {
    /* Typing Test */
    
    /*
    const timer = new Promise((resolve) => {
        startTimer(testTime);
        resolve("Time done");
    });
    let time = testTime;
    */

    let currentLetterIndex = 0;  
    generateParaText(x, testWords);
    let paraSpans = text.querySelectorAll("span");

    currentKey = await waitForKey();
    startTimer(testTime);
    let textTyped = "";

    while (typing == true && remainingTime > 0) {
        const expectedChar = paraSpans[currentLetterIndex]?.textContent;

        if (currentKey === "Backspace") {
            if (currentLetterIndex > 0) {
                currentLetterIndex--;
                markBlack(paraSpans, currentLetterIndex);
                textTyped = textTyped.slice(0, -1);
            }
        }

        else {
            if (currentKey === " "  || expectedChar === " ") {
                markRed(paraSpans, currentLetterIndex);
                textTyped += "_";
            }

            else if (currentKey === expectedChar) {
                markGreen(paraSpans, currentLetterIndex);
                textTyped += currentKey;
            }

            else {
                markRed(paraSpans, currentLetterIndex);
                textTyped += currentKey;
            }

            currentLetterIndex++;
        }

        if (currentLetterIndex === paraSpans.length) {
            x += 60;  
            typedTextPara += textTyped;
            textTyped = "";
            generateParaText(x, testWords);
            currentLetterIndex = 0;
            paraSpans = text.querySelectorAll("span");
        }
        currentKey = await waitForKey();
    }

    if (x == 0) {
        typedTextPara += textTyped;
    }

    console.log(textTyped)
    displayResult();
    /*
    await timer;
    timer.then((result) => {
        console.log("Time done:", result);
    })
    */
}; 

function displayResult () {
    /* Displays the result of the timed typing test */
    let correctWordsTyped = [];
    let incorrectWordsTyped = [];
    let wordsTyped = [];
    let correctWords = 0;
    let incorrectWords = 0;

    let originalParaWords = originalPara.split(" ");
    let typedParaWords = typedTextPara.split("_");

    for (let i = 0; i < typedParaWords.length; i++) {
        if (originalParaWords[i] === typedParaWords[i]) {
            correctWordsTyped.push(typedParaWords[i]);
        }
        else if (originalParaWords[i] != typedParaWords[i]) {
            incorrectWordsTyped.push(typedParaWords[i]);
        }
        wordsTyped.push(typedParaWords[i]);
    }
    correctWords = correctWordsTyped.length;
    incorrectWords = incorrectWordsTyped.length;

    let WPM = correctWords / (testTime / 60);
    let accuracy = (correctWords / wordsTyped.length) * 100;
    displayText.textContent = `Your WPM is: ${WPM} words per minute.`;
}

function Reset() {
    /* Resets the test to its initial state */

}

// Initializes TypingTest function. Won't start unless the user types something. //
typingTest(); 