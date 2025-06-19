const questions = {
      HTML: [
        { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Transfer Markup Language"], answer: 0 },
        { q: "Which tag is used to define a hyperlink?", options: ["<link>", "<a>", "<href>", "<hyper>"], answer: 1 },
        { q: "HTML is what type of language?", options: ["Scripting", "Markup", "Programming", "Network"], answer: 1 },
        { q: "Which tag breaks the line?", options: ["<line>", "<br>", "<break>", "<lb>"], answer: 1 },
        { q: "How to create an ordered list?", options: ["<ul>", "<ol>", "<list>", "<li>"], answer: 1 }
      ],
      CSS: [
        { q: "What does CSS stand for?", options: ["Color Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"], answer: 2 },
        { q: "Which property controls text size?", options: ["font-size", "text-style", "font-weight", "text-align"], answer: 0 },
        { q: "Which is used for comments in CSS?", options: ["// comment", "<!-- comment -->", "/* comment */", "# comment"], answer: 2 },
        { q: "How do you select an element with ID 'header'?", options: [".header", "#header", "header", "*header"], answer: 1 },
        { q: "Which unit is relative to the parent?", options: ["em", "px", "%", "rem"], answer: 0 }
      ],
      JavaScript: [
        { q: "What is used to declare a variable in JS?", options: ["v", "var", "int", "declare"], answer: 1 },
        { q: "Which company developed JavaScript?", options: ["Microsoft", "Apple", "Netscape", "Google"], answer: 2 },
        { q: "How do you write 'Hello' in alert box?", options: ["alertBox('Hello')", "msg('Hello')", "msgBox('Hello')", "alert('Hello')"], answer: 3 },
        { q: "Inside which HTML element do we put JavaScript?", options: ["<js>", "<script>", "<javascript>", "<code>"], answer: 1 },
        { q: "Which operator is used for strict equality?", options: ["=", "==", "===", "!="], answer: 2 }
      ],
      React: [
        { q: "Who developed React?", options: ["Google", "Facebook", "Microsoft", "Amazon"], answer: 1 },
        { q: "What is JSX?", options: ["JSX is a JavaScript XML", "JSX is a template engine", "JSX is a database", "None"], answer: 0 },
        { q: "Which hook is used for state?", options: ["useEffect", "useState", "useRef", "useReducer"], answer: 1 },
        { q: "How do you render a component?", options: ["<Component />", "Component()", "Render(Component)", "All"], answer: 0 },
        { q: "React is a...?", options: ["Backend Framework", "UI Library", "Database", "Programming Language"], answer: 1 }
      ],
      DSA: [
        { q: "Time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], answer: 1 },
        { q: "Which data structure uses LIFO?", options: ["Queue", "Array", "Stack", "Tree"], answer: 2 },
        { q: "Which is not a sorting algorithm?", options: ["Bubble", "Merge", "Quick", "Search"], answer: 3 },
        { q: "In a queue, insertion is done at?", options: ["Front", "Middle", "End", "None"], answer: 2 },
        { q: "What is a binary tree?", options: ["Tree with 2 children max per node", "Tree with only one child", "Tree with 3 nodes", "None"], answer: 0 }
      ]
    };

    let currentSubject = '';
    let questionIndex = 0;
    let score = 0;
    let timer;
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const progressFill = document.getElementById('progressFill');
    const timerDisplay = document.getElementById('timer');
    const footer = document.getElementById('footer');
    const selectionScreen = document.getElementById('selectionScreen');
    const quizScreen = document.getElementById('quizScreen');

    function startQuiz(subject) {
      currentSubject = subject;
      questionIndex = 0;
      score = 0;
      selectionScreen.style.display = 'none';
      quizScreen.style.display = 'block';
      loadQuestion();
    }

    function loadQuestion() {
      clearTimeout(timer);
      const q = questions[currentSubject][questionIndex];
      questionText.textContent = q.q;
      optionsContainer.innerHTML = '';
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.setAttribute('tabindex', '0');
        btn.addEventListener('click', () => checkAnswer(idx));
        optionsContainer.appendChild(btn);
      });
      updateProgress();
      startTimer();
    }

    function checkAnswer(selected) {
      const q = questions[currentSubject][questionIndex];
      if (selected === q.answer) score++;
      questionIndex++;
      if (questionIndex < questions[currentSubject].length) {
        loadQuestion();
      } else {
        showResults();
      }
    }

    function updateProgress() {
      const percent = (questionIndex / questions[currentSubject].length) * 100;
      progressFill.style.width = `${percent}%`;
    }

    function startTimer() {
      let timeLeft = 30;
      timerDisplay.textContent = `Time left: ${timeLeft}s`;
      timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
          clearInterval(timer);
          checkAnswer(-1);
        }
      }, 1000);
    }

    function showResults() {
      questionText.textContent = `Quiz Completed! Your score: ${score}/${questions[currentSubject].length}`;
      optionsContainer.innerHTML = '<button onclick="startQuiz(currentSubject)">Retake Quiz</button><br><button onclick="goHome()">Go to Subjects</button>';
      progressFill.style.width = '100%';
      timerDisplay.textContent = '';
    }

    function goHome() {
      quizScreen.style.display = 'none';
      selectionScreen.style.display = 'block';
    }