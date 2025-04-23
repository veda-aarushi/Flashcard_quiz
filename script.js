let flashcards = [];
let score = 0;
let timeLeft = 60;
let timer = null;
let currentIndex = 0;

const flashcardContainer = document.getElementById("flashcard-container");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");

function loadFlashcards() {
  const saved = localStorage.getItem("flashcards");
  if (saved) {
    flashcards = JSON.parse(saved);
  } else {
    flashcards = [
      { question: "Capital of France?", answer: "Paris" },
      { question: "2 + 2?", answer: "4" },
      { question: "Color of the sky?", answer: "Blue" },
      { question: "What is a cat?", answer: "An animal" }
    ];
    saveFlashcards();
  }
}

function saveFlashcards() {
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function shuffleArray(arr) {
  return arr.map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
}

function getOptions(correctAnswer) {
  const otherAnswers = flashcards
    .map(f => f.answer)
    .filter(a => a !== correctAnswer);

  const shuffled = shuffleArray(otherAnswers).slice(0, 3);
  shuffled.push(correctAnswer);

  return shuffleArray(shuffled);
}

function showQuestion() {
  if (currentIndex >= flashcards.length) {
    clearInterval(timer);
    alert(`Game over! Final Score: ${score}`);
    return;
  }

  const card = flashcards[currentIndex];
  const options = getOptions(card.answer);

  flashcardContainer.innerHTML = `
    <div class="question-block">
      <h2>${card.question}</h2>
      ${options.map(opt => `<button class="option-btn">${opt}</button>`).join('')}
    </div>
  `;

  document.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.textContent === card.answer) {
        score++;
        scoreDisplay.textContent = score;
        btn.style.backgroundColor = "#28a745"; // green
      } else {
        btn.style.backgroundColor = "#dc3545"; // red
      }
      setTimeout(() => {
        currentIndex++;
        showQuestion();
      }, 800);
    });
  });
}

function startGame() {
  score = 0;
  timeLeft = 60;
  currentIndex = 0;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  flashcards = shuffleArray(flashcards);
  showQuestion();

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert(`Time's up! Final Score: ${score}`);
    }
  }, 1000);
}

document.getElementById("addFlashcard").addEventListener("click", () => {
  const q = document.getElementById("questionInput").value.trim();
  const a = document.getElementById("answerInput").value.trim();
  if (q && a) {
    flashcards.push({ question: q, answer: a });
    saveFlashcards();
    document.getElementById("questionInput").value = "";
    document.getElementById("answerInput").value = "";
  }
});

document.getElementById("startBtn").addEventListener("click", startGame);

loadFlashcards();
