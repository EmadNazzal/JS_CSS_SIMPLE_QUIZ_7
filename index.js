let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit-button");
let results = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
  let myReq = new XMLHttpRequest();
  myReq.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questions = JSON.parse(this.responseText);
      let questionsCount = questions.length;
      createBullets(questionsCount);
      addQuestionsData(questions[currentIndex], questionsCount);
      countDown(15, questionsCount);

      submitButton.onclick = () => {
        let theRightAnswer = questions[currentIndex].right_answer;
        currentIndex++;
        checkAnswers(theRightAnswer, questionsCount);

        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionsData(questions[currentIndex], questionsCount);

        handleBullets();
        clearInterval(countDownInterval);
        countDown(15, questionsCount);
        showResults(questionsCount);
      };
    }
  };
  myReq.open("GET", "questions.json", true);
  myReq.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(obj["title"]);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    for (i = 1; i <= 4; i++) {
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.type = "radio";
      radioInput.dataset.answer = obj[`Answer_${i}`];
      let theLabel = document.createElement("label");
      theLabel.htmlFor = `answer_${i}`;
      let theLabelText = document.createTextNode(obj[`Answer_${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswers(rAnswer, count) {
  let answers = document.getElementsByName("questions");
  let theChosenAnswer;
  for (i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChosenAnswer) {
    rightAnswers++;
    console.log(`Goood`);
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    // console.log(`Questions are over`);
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    results.style.display = "block";
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} / ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="excellent">Excellent</span>, ${rightAnswers} / ${count}`;
    } else {
      theResults = `<span class="failed" style = "color:red;">Failed</span>, ${rightAnswers} / ${count}`;
    }
    results.innerHTML = theResults;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownElement.innerHTML = `${minutes}: ${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
