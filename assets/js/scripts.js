// Questions & Answers Arrays
var questions = [
    { 
        question: "Arrays in javascript can be used to store _______", 
        answers: [
            { text: "Numbers and Strings", correct: false },
            { text: "Other Arrays", correct: false },
            { text: "Booleans", correct: false },
            { text: "All of the Above", correct: true }
        ]
    },
    { 
        question: "String values must be enclosed within ____ when being assigned to variables.",
        answers: [
            { text: "commas", correct: false },
            { text: "curly brackets", correct: false },
            { text: "quotes", correct: true },
            { text: "parentheses", correct: false }
        ]
    },
];

// quiz timer set to 30. Timer left will be the final score.
var timeLeft = 30;
var timerID;
var timerEl = document.getElementById("timerCountdown");
var startButton = document.getElementById("startButton");
var nextButton = document.getElementById("nextButton");
var questionContainerEl = document.getElementById("qContainer");
var startContainerEl = document.getElementById("containerStart");
var questionEl = document.getElementById("question");
var answerButtonsEl = document.getElementById("aButtons");
var checkAnswerEl = document.getElementById("see-answer");
var viewHighScores = document.getElementById("highscores-link");
var submitButton = document.getElementById("submitButton");
var clearScoreButton = document.getElementById("clear-btn");
var initialsField = document.getElementById("player-name");
var restartButton = document.getElementById("restart-btn");
var scoreField = document.getElementById("player-score");
var scores = JSON.parse(localStorage.getItem("scores")) || [];

var randomQuestions, currentQuestionIndex;


// Start button trigger the first Q and next button to display
startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
    currentQuestionIndex++
    setNextQuestion()
});


// Countdown timer
function countdownTimer() {
    timeLeft--;
    timerEl.textContent = "Time: " + timeLeft;
    if (timeLeft <= 0) {
        saveScore();
    }
}


// Start Quiz
function startGame() {
    timerID = setInterval(countdownTimer, 1000);
    startContainerEl.classList.add("hide");
    randomQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    questionContainerEl.classList.remove("hide");

    // Timer starts when start button is clicked
    countdownTimer();
    setNextQuestion();
};


// Go to next question
function setNextQuestion() {
    resetState();
    showQuestion(randomQuestions[currentQuestionIndex]);
};


// Display questions
function showQuestion(question) {
    questionEl.innerText = question.question
    question.answers.forEach(answer => {
        var button = document.createElement("button")
        button.innerText = answer.text
        button.classList.add("btn")
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener("click", selectAnswer)
        answerButtonsEl.appendChild(button)
    })
};


// Reset state function
function resetState() {
    nextButton.classList.add("hide")
    checkAnswerEl.classList.add("hide")
    while (answerButtonsEl.firstChild) {
        answerButtonsEl.removeChild
            (answerButtonsEl.firstChild)
    }
};


// Select answer function
function selectAnswer(e) {
    var selectedButton = e.target;
    
    var correct = selectedButton.dataset.correct;
    checkAnswerEl.classList.remove("hide")
    
    if (correct) {
        checkAnswerEl.innerHTML = "Correct!";
    } else {
        checkAnswerEl.innerHTML = "Incorrect!";
        if (timeLeft <= 15) {
            timeLeft = 0;
        } else {
            // If incorrect, deduct time by 15
            timeLeft -= 15;
        }
    }

    Array.from(answerButtonsEl.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
    })

    if (randomQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove("hide")
        checkAnswerEl.classList.remove("hide")
    } else {
        startButton.classList.remove("hide")
        saveScore();
    }
};


// Check and show the correct answer by set the buttons colors
function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add("correct!");
    } else {
        element.classList.add("incorrect!");
    }
};


// Remove all the classes
function clearStatusClass(element) {
    element.classList.remove("correct!");
    element.classList.remove("incorrect!");
};


// Save scores
function saveScore() {
    clearInterval(timerID);
    timerEl.textContent = "Time: " + timeLeft;
    setTimeout(function () {
        //localStorage.setItem("scores", JSON.stringify(scores));
        questionContainerEl.classList.add("hide");
        document.getElementById("sContainer").classList.remove("hide");
        document.getElementById("your-score").textContent = "Your final score is " + timeLeft;

    }, 2000)
};


var loadScores = function () {
    // Get score from local storage

    if (!savedScores) {
        return false;
    }

    // Convert scores from stringfield format into array
    savedScores = JSON.parse(savedScores);
    var initials = document.querySelector("#initials").value;
    var newScore = {
        score: timeLeft,
        initials: initials
    }
    savedScores.push(newScore);
    console.log(savedScores)

    savedScores.forEach(score => {
        initialsField.innerText = score.initials
        scoreField.innerText = score.score
    })
};


// Show high scores
function showHighScores(initials) {
    document.getElementById("hScores").classList.remove("hide")
    document.getElementById("sContainer").classList.add("hide");
    startContainerEl.classList.add("hide");
    questionContainerEl.classList.add("hide");
    if (typeof initials == "string") {
        var score = {
            initials, timeLeft
        }
        scores.push(score)
    }

    var highScoreEl = document.getElementById("highscore");
    highScoreEl.innerHTML = "";
    //console.log(scores)
    for (i = 0; i < scores.length; i++) {
        var div1 = document.createElement("div");
        div1.setAttribute("class", "name-div");
        div1.innerText = scores[i].initials;
        var div2 = document.createElement("div");
        div2.setAttribute("class", "score-div");
        div2.innerText = scores[i].timeLeft;

        highScoreEl.appendChild(div1);
        highScoreEl.appendChild(div2);
    }

    localStorage.setItem("scores", JSON.stringify(scores));

};


// View high scores link
viewHighScores.addEventListener("click", showHighScores);


submitButton.addEventListener("click", function (event) {
    event.preventDefault()
    var initials = document.querySelector("#initials").value;
    showHighScores(initials);
});


// Restart or reload the page
restartButton.addEventListener("click", function () {
    window.location.reload();
});


// Clear localStorage items 
clearScoreButton.addEventListener("click", function () {
    localStorage.clear();
    document.getElementById("highscore").innerHTML = "";
});