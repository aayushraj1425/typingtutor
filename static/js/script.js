import words from "./words.js"

let time = {"time1": 30, "time2" : 60, "time3": 120};
let level = {"level1": "standard", "level2": "professional"};

const time1 = document.querySelector("#time1");
const time2 = document.querySelector("#time2");
const time3 = document.querySelector("#time3");
const level1 = document.querySelector("#level1");
const level2 = document.querySelector("#level2");
const text = document.querySelector("#test-text");
const mins = document.querySelector('#minutes');
const secs = document.querySelector('#seconds');

let typing = false; /* Will be false unless user starts typing something */

let test_time, test_level, test_words; 
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

let prev_time;
let prev_level;
function setDisplayTime(time_type, time_type_DOM) {
    /* Changes DisplayTime to selected time type */
    
    test_time = time[time_type];
    mins.textContent = Math.floor(test_time / 60);
    secs.textContent = `${test_time % 60 < 10 ? '0' : ''}${test_time % 60}`;
    time_type_DOM.style.color = "rgb(85, 85, 85)";
    time_type_DOM.style.fontWeight = "bold";
    if (prev_time != time_type_DOM && prev_time != null) {
        prev_time.style.color = "rgb(120, 116, 116)";
        prev_time.style.fontWeight = "normal";
    }
    prev_time = time_type_DOM;
}

function setLevel(level_type, level_type_DOM) {
    /* Sets Typing Test Level to selected level type */

    test_level = level[level_type];
    test_words = words[level_type];
    level_type_DOM.style.color = "rgb(85, 85, 85)";
    level_type_DOM.style.fontWeight = "bold";
    if (prev_level != level_type_DOM && prev_level != null) {
        prev_level.style.color = "rgb(120, 116, 116)";
        prev_level.style.fontWeight = "normal";
    }
    prev_level = level_type_DOM;
}

// Default Settings //
setDisplayTime("time1", time1);
setLevel("level1", level1);

let current_key;
function waitForKey () {
/* Return promise for everytime user types a key */

    return new Promise((resolve) => {
        document.addEventListener('keydown', (event) => {
            // console.log("User typed:" + event.key);
            // current_key = event.key;
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
function generateParagraph(x, test_words) {
    /* Generates paragraph */

    text.innerHTML = "";
    text.textContent = "";
    test_words.forEach(function(word, index) {
        if (index < x + 60) {
           text.textContent += word + " ";
        }
    });
}


function mark_red(paragraph, char_index) {
    /* Marks the selected character to red */

    let target_char = paragraph.charAt(char_index);
    let newText = paragraph.slice(0, char_index) + `<span style='color: red'>${target_char}</span>` + paragraph.slice(char_index + 1)
    text.innerHTML = newText;
}

function mark_green(paragraph, char_index) {
    /* Marks the selected character to green */

    let target_char = paragraph.charAt(char_index);
    let newText = paragraph.slice(0, char_index) + `<span style='color: green'>${target_char}</span>` + paragraph.slice(char_index + 1)
    text.innerHTML = newText;
}   

function mark_back(paragraph, char_index) {
    /* Unmarks the selected character to default color */

    let target_char = paragraph.charAt(char_index);
    let newText = paragraph.slice(0, char_index) + `<span style='color: black'>${target_char}</span>` + paragraph.slice(char_index + 1)
    text.innerHTML = newText;
}

async function typingTest () {
    /* Typing Test */
    
    /*
    const timer = new Promise((resolve) => {
        startTimer(test_time);
        resolve("Time done");
    });
    let time = test_time;
    */

    let correct_words_typed = [];
    let incorrect_words_typed = [];
    let words_typed = [];
    let current_word_index = 0;
    let current_letter_index = 0;
    // let correct_words = 0;
    // let incorrect_words = 0;
        
    generateParagraph(x, test_words);
    let given_words = text.textContent.trim().split(" ");
    let paragraph = text.innerHTML;

    current_key = await waitForKey();
    startTimer(test_time);

    let words_length_till_now = 0;
    while (typing == true && remainingTime > 0) {
        let word_length = given_words[current_word_index].length;

        if (current_key === paragraph.charAt(current_letter_index)) {
            console.log("Yes");
            // mark_green(paragraph, current_letter_index);
        }

        else if (current_key != paragraph.charAt(current_letter_index)) {
            console.log("No")
            // mark_red(paragraph, current_letter_index)
        }

        current_key = await waitForKey();

        if (current_key != "Backspace") {
            current_letter_index++;
        }

        else if (current_key == "Backspace") {
            mark_back(paragraph, current_letter_index);
        }


        if (current_letter_index - words_length_till_now == word_length) {
            if (current_key != " ") {
                mark_red(paragraph, current_letter_index);
                
            }
            if (given_words[current_word_index] == paragraph.substring(current_letter_index - word_length, current_letter_index)) {
                // correct_words++;
                words_typed.push(given_words[current_word_index]);
                correct_words_typed.push(given_words[current_word_index]);
                words_length_till_now += word_length + 1;
            }
            else if (given_words[current_word_index] != paragraph.substring(current_letter_index - word_length, current_letter_index)) {
                // incorrect_words++;
                words_typed.push(given_words[current_word_index]);
                incorrect_words_typed.push(given_words[current_word_index])
                words_length_till_now += word_length + 1;
            }
            console.log(current_word_index)
            current_word_index++;
        }

        if (current_word_index == given_words.length) {
            x += 30;
            generateParagraph(x, test_words);
            current_letter_index = 0;
            current_word_index = 0;
            words_length_till_now = 0;
            given_words = text.textContent.trim().split(" ");
            paragraph = text.innerHTML;
        }
    }

    if (remainingTime <= 0) {
        displayResult();
    }
    /*
    await timer;
    timer.then((result) => {
        console.log("Time done:", result);
    })
    */
};

function displayResult () {
    /* Displays the result of the timed typing test */

}

function Reset() {
    /* Resets the test to its initial state */

}

// Initializes TypingTest function. Won't start unless the user types something. //
typingTest(); 

