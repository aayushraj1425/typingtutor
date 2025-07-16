import words from "./words.js"

let time = {"time1": 30, "time2" : 60, "time3": 120};
let level = {"level1": "standard", "level2": "professional"};

const time1 = document.querySelector("#time1")
const time2 = document.querySelector("#time2")
const time3 = document.querySelector("#time3")
const level1 = document.querySelector("#level1")
const level2 = document.querySelector("#level2")
const text = document.querySelector("#test-text")
const mins = document.querySelector('#minutes')
const secs = document.querySelector('#seconds')

let test_time, test_level, test_words; 

time1.onclick = function () {
    setDisplayTime("time1");
    typingTest();
}
time2.onclick = function () {
    setDisplayTime("time2");
}
time3.onclick = function () {
    setDisplayTime("time3");
}
level1.onclick = function () {
    setLevel("level1");
}
level2.onclick = function () {
    setLevel("level2");
}

function setDisplayTime(time_type) {
    test_time = time[time_type];
    mins.textContent = Math.floor(test_time / 60);
    secs.textContent = `${test_time % 60 < 10 ? '0' : ''}${test_time % 60}`;
}

function setLevel(level_type) {
    test_level = level[level_type];
    test_words = words[level_type];
}

setDisplayTime("time1");
setLevel("level1");

let typing = false;
let current_key;

const user_typing = new Promise((resolve) => {
    document.addEventListener('keydown', (event) => {
        console.log("User typed:" + event.key)
        current_key = event.key;
        typing = true;
        resolve();
    });
}
)

// Countdown Timer
function startTimer(durationInSeconds) {
  var remainingTime = durationInSeconds;
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


async function typingTest () {
    // const timer = new Promise((resolve) => {
    //     startTimer(test_time);
    //     resolve("Time done");
    // });
    let correct_words_typed = [];
    let words_typed = [];
    let time = test_time;
    let current_word_index = 0;
    let current_letter_index = 0;
    text.textContent = test_words(0, 30);

    await user_typing;
    startTimer(test_time);
    while (typing == true && remainingTime > 0) {
        if (current_key === test_words[current_word_index][current_letter_index]) {
            console.log("Yes");
            await user_typing;
            if (current_key != "Backspace") {
                current_letter_index++;
            }
        }
    }
    
    // await timer;
    // timer.then((result) => {
    //     console.log("Time done:", result);
    // })
};

typingTest();

