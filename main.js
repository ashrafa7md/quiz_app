let countSpan = document.querySelector(".count span")
let bullet = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area")
let answerArea = document.querySelector(".answer-area")
let submitButton = document.querySelector(".submit-button")
let bullets = document.querySelector(".bullets")
let results = document.querySelector(".result")
let countdown = document.querySelector(".countdown")

let currentIndex = 0
let rightAnswers = 0
let countDownInterval;

function getQuestion() {
    let myRequest = new XMLHttpRequest();
    myRequest.open("GET", "quiz.json", true)
    myRequest.send()
    myRequest.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let myQuestion = JSON.parse(this.responseText)
            let questionCount = myQuestion.length
            creatBullets(questionCount)
            addQuestionData(myQuestion[currentIndex], questionCount)
            countDown(30,questionCount)
            submitButton.onclick = () => {
                let rightAnswer = myQuestion[currentIndex].right_answer
                currentIndex++
                checkAnswer(rightAnswer, questionCount)
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";
                addQuestionData(myQuestion[currentIndex], questionCount);
                handleBullets();
                clearInterval(countDownInterval)
                countDown(30, questionCount);
                showResult(questionCount)
            }
        }
    }
}
function creatBullets(num) {
        countSpan.innerHTML = num
        for (let i = 0; i < num; i++) {
            let span = document.createElement("span")
            if (i === 0) {
                span.className = "on"
            }
            bullet.appendChild(span)

        }
}
function addQuestionData(obj, count) {
    if (currentIndex < count) {
        let h2 = document.createElement("h2")
        let questionText = document.createTextNode(obj.title)
        h2.appendChild(questionText)
        quizArea.appendChild(h2)
        for (let i = 1; i <= 4; i++) {
            let mainDiv = document.createElement("div")
            mainDiv.className = "answer"
            let radioInput = document.createElement("input")
            radioInput.type = "radio"
            radioInput.name = "question"
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];
            if (i == 1) {
                radioInput.checked = true
            }
            let label = document.createElement("label")
            label.htmlFor = `answer_${i}`;
            let labelText = document.createTextNode(obj[`answer_${i}`])
            label.appendChild(labelText)
            mainDiv.appendChild(radioInput)
            mainDiv.appendChild(label)
            answerArea.appendChild(mainDiv)
        }
    }
}
function checkAnswer(rAnswer, count) {
        let answers = document.getElementsByName("question")
        let choosenAnswer;
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].checked) {
                choosenAnswer = answers[i].dataset.answer
            }
        }
        if (rAnswer === choosenAnswer) {
            rightAnswers++
            console.log("good answer")
        }
}

function handleBullets() {
    let bulletsSpan = document.querySelectorAll(".bullets .spans span")
    let arraySpan = Array.from(bulletsSpan)
    arraySpan.forEach((span, index) => {
        if (currentIndex === index) {
            span.className = "on"
        }
    })
} 
function showResult(count) {
    if (currentIndex === count) {
        let result;
        quizArea.remove()
        answerArea.remove()
        submitButton.remove()
        bullets.remove()
        if (rightAnswers > (count / 2) && rightAnswers < count) {
            result = `<span class="good">Good</sapn> , ${rightAnswers} From ${count}`
        } else if (rightAnswers === count) {
            result = `<span class="perfect">Perfect</sapn> , ${rightAnswers} From ${count}`;
        } else {
            result = `<span class="bad">Bad</sapn> , ${rightAnswers} From ${count}`;
        }
        results.innerHTML = result
    }
}
function countDown(duration,count) {
    if (currentIndex < count) {
        let minuts, seconds;
        countDownInterval = setInterval(() => {
            minuts = parseInt(duration / 60)
            seconds = parseInt(duration % 60)
            minuts = minuts < 10 ? `0${minuts}` : minuts
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdown.innerHTML = `${minuts}:${seconds}`
            if (--duration < 0) {
                clearInterval(countDownInterval)
                submitButton.click();
            }
        }, 1000)
    }
}
getQuestion();
