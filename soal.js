let currentQuestion = 0;
let userAnswers = [];
let score = 0;
let timeLeft = 930; // 15 menit 30 detik
let questions = [];
let quizData = {};

// Fungsi untuk memuat pertanyaan
async function loadQuestions() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("Gagal memuat data.json");
        quizData = await response.json();

        if (!quizData.HTML || quizData.HTML.length === 0) {
            throw new Error("Data JSON kosong");
        }

        questions = [
            ...quizData.HTML, 
            ...quizData.CSS, 
            ...quizData.JavaScript
        ];

        return questions;
    } catch (error) {
        console.error("Error:", error);
        quizData = {
            "HTML": [
                {
                    "question": "Apa kepanjangan dari HTML?",
                    "options": {
                        "a": "Hyperlinks and Text Markup Language",
                        "b": "Home Tool Markup Language",
                        "c": "Hyper Text Markup Language",
                        "d": "High Text Markup Language"
                    },
                    "answer": "c"
                }
            ]
        };
        questions = quizData.HTML;
        return questions;
    }
}

// Fungsi untuk menampilkan pertanyaan
function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question-number').textContent = `Soal ${currentQuestion + 1}`;
    document.getElementById('question-text').textContent = question.question;

    const optionsDiv = document.getElementById('answer-options');
    optionsDiv.innerHTML = '';

    for (const [key, value] of Object.entries(question.options)) {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = `${key}. ${value}`;
        button.onclick = () => selectAnswer(key);

        // Highlight jawaban yang sudah dipilih
        if (userAnswers[currentQuestion] === key) {
            button.style.backgroundColor = '#4a69bd';
            button.style.color = 'white';
        }

        optionsDiv.appendChild(button);
    }

    document.getElementById('prev-button').disabled = currentQuestion === 0;
    document.getElementById('next-button').style.display = 
        currentQuestion === questions.length - 1 ? 'none' : 'block';
    document.getElementById('submit-button').style.display = 
        currentQuestion === questions.length - 1 ? 'block' : 'none';
}

// Fungsi untuk memilih jawaban
function selectAnswer(answer) {
    const question = questions[currentQuestion];
    const correctAnswer = question.answer;

    userAnswers[currentQuestion] = answer;

    // Ambil semua tombol opsi
    const buttons = document.querySelectorAll('#answer-options .option-button');

    buttons.forEach(button => {
        const optionKey = button.textContent.charAt(0); // ambil huruf
        if (optionKey === correctAnswer) {
            button.style.backgroundColor = 'green';
            button.style.color = 'white';
        } else if (optionKey === answer) {
            if (answer !== correctAnswer) {
                button.style.backgroundColor = 'red';
                button.style.color = 'white';
            }
        } else {
            button.style.backgroundColor = '';
            button.style.color = '';
        }

        // Disable semua tombol setelah klik
        button.disabled = true;
    });
}

// Fungsi untuk menghitung skor
function calculateScore() {
    score = 0;
    questions.forEach((question, index) => {
        if (userAnswers[index] === question.answer) {
            score++;
        }
    });
    return score;
}

// Fungsi timer
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('time-left').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Fungsi ketika kuis selesai
function finishQuiz() {
    calculateScore();
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('final-score').textContent = 
        `${score} dari ${questions.length} (${Math.round((score/questions.length)*100)}%)`;
}

// Inisialisasi kuis
async function initializeQuiz() {
    await loadQuestions();
    showQuestion();

    const timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);

    document.getElementById('next-button').addEventListener('click', () => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion();
        }
    });

    document.getElementById('prev-button').addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion();
        }
    });

    document.getElementById('submit-button').addEventListener('click', finishQuiz);
    document.getElementById('restart-button').addEventListener('click', () => {
        location.reload();
    });
}

document.addEventListener('DOMContentLoaded', initializeQuiz);