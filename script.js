// ============================================================
//  QuizForge — Enhanced Script
//  All logic wired to the existing HTML structure
// ============================================================

// ─── DATA ───────────────────────────────────────────────────
const SUBJECTS = [
  {
    id: 'HTML',
    name: 'HTML',
    icon: '🌐',
    desc: 'Markup, semantics & structure',
    color: '#e34c26',
    badge: 'FUNDAMENTALS'
  },
  {
    id: 'CSS',
    name: 'CSS',
    icon: '🎨',
    desc: 'Styling, layouts & animations',
    color: '#264de4',
    badge: 'DESIGN'
  },
  {
    id: 'JavaScript',
    name: 'JavaScript',
    icon: '⚡',
    desc: 'DOM, ES6+ & async patterns',
    color: '#f7df1e',
    badge: 'CORE'
  },
  {
    id: 'React',
    name: 'React',
    icon: '⚛️',
    desc: 'Components, hooks & state',
    color: '#61dafb',
    badge: 'FRAMEWORK'
  },
  {
    id: 'DSA',
    name: 'DSA',
    icon: '🧩',
    desc: 'Algorithms, complexity & data structures',
    color: '#a78bfa',
    badge: 'CS THEORY'
  },
  {
    id: 'Python',
    name: 'Python',
    icon: '🐍',
    desc: 'Syntax, OOP & libraries',
    color: '#3776ab',
    badge: 'SCRIPTING'
  },
  {
    id: 'SQL',
    name: 'SQL',
    icon: '🗃️',
    desc: 'Queries, joins & aggregation',
    color: '#00758f',
    badge: 'DATABASES'
  },
  {
    id: 'Git',
    name: 'Git & DevOps',
    icon: '🔀',
    desc: 'Version control & workflows',
    color: '#f05032',
    badge: 'TOOLING'
  }
];

const QUESTIONS = {
  HTML: [
    { q: "What does HTML stand for?", options: ["Hyper Text Markup Language","Home Tool Markup Language","Hyperlinks and Text Markup Language","Hyper Transfer Markup Language"], answer: 0, hint: "Think 'hyper' + 'markup'" },
    { q: "Which tag is used to define a hyperlink?", options: ["<link>","<a>","<href>","<hyper>"], answer: 1, hint: "It's short for 'anchor'" },
    { q: "Which attribute specifies the destination URL in an anchor tag?", options: ["src","link","href","url"], answer: 2, hint: "H-R-F: Hyper Reference" },
    { q: "Which tag breaks the line?", options: ["<line>","<br>","<break>","<lb>"], answer: 1, hint: "Short for 'break'" },
    { q: "How do you create an ordered list?", options: ["<ul>","<ol>","<list>","<li>"], answer: 1, hint: "'o' for ordered" },
    { q: "Which HTML element is used for the largest heading?", options: ["<heading>","<h6>","<h1>","<head>"], answer: 2, hint: "Lower number = bigger" },
    { q: "What is the correct HTML element for inserting a line break?", options: ["<break>","<lb>","<br>","<newline>"], answer: 2, hint: "Self-closing, two letters" },
    { q: "Which doctype declaration is correct for HTML5?", options: ["<!DOCTYPE HTML5>","<!DOCTYPE html>","<DOCTYPE html>","<!html>"], answer: 1, hint: "Simple and lowercase" },
    { q: "Which HTML element defines the title of a document?", options: ["<meta>","<head>","<title>","<header>"], answer: 2, hint: "Shows in the browser tab" },
    { q: "What does the 'alt' attribute in <img> specify?", options: ["Image alignment","Alternate text","Image altitude","Author link tag"], answer: 1, hint: "Accessibility fallback text" }
  ],
  CSS: [
    { q: "What does CSS stand for?", options: ["Color Style Sheets","Creative Style Sheets","Cascading Style Sheets","Computer Style Sheets"], answer: 2, hint: "Think 'cascade' of rules" },
    { q: "Which property controls text size?", options: ["font-size","text-style","font-weight","text-align"], answer: 0, hint: "font-___" },
    { q: "How do you select an element with ID 'header'?", options: [".header","#header","header","*header"], answer: 1, hint: "# is for IDs" },
    { q: "Which CSS property is used to change the text color?", options: ["fgcolor","text-color","color","font-color"], answer: 2, hint: "Just the single word" },
    { q: "Which unit is relative to the parent element?", options: ["em","px","%","rem"], answer: 0, hint: "em — scales with parent's font-size" },
    { q: "What does the 'z-index' property control?", options: ["Zoom level","Horizontal position","Stacking order","Zero spacing"], answer: 2, hint: "Which element appears 'on top'" },
    { q: "Which display value makes an element a flex container?", options: ["block","inline","flex","grid"], answer: 2, hint: "display: ___" },
    { q: "How do you write a CSS comment?", options: ["// comment","<!-- comment -->","/* comment */","# comment"], answer: 2, hint: "Slash-star pairs" },
    { q: "Which property adds space inside an element's border?", options: ["margin","padding","spacing","border-space"], answer: 1, hint: "Inside the box" },
    { q: "What does 'position: absolute' do?", options: ["Fixes to viewport","Positions relative to nearest positioned ancestor","Positions relative to body only","Removes from flow"], answer: 1, hint: "Looks for the closest positioned parent" }
  ],
  JavaScript: [
    { q: "Which keyword declares a block-scoped variable?", options: ["var","let","int","declare"], answer: 1, hint: "Introduced in ES6" },
    { q: "Which company developed JavaScript?", options: ["Microsoft","Apple","Netscape","Google"], answer: 2, hint: "The original web browser company" },
    { q: "How do you write 'Hello' in an alert box?", options: ["alertBox('Hello')","msg('Hello')","msgBox('Hello')","alert('Hello')"], answer: 3, hint: "Built-in browser function" },
    { q: "Which operator checks strict equality?", options: ["=","==","===","!="], answer: 2, hint: "Three equals signs" },
    { q: "What is the output of typeof null?", options: ["'null'","'undefined'","'object'","'boolean'"], answer: 2, hint: "A famous JS quirk / bug" },
    { q: "Which method removes the last element from an array?", options: ["pop()","push()","shift()","splice()"], answer: 0, hint: "Opposite of push" },
    { q: "What does 'NaN' stand for?", options: ["Not a Node","Not a Number","Null and Nothing","Nested and Nameless"], answer: 1, hint: "Invalid numeric result" },
    { q: "Which loop always executes the body at least once?", options: ["for","while","do...while","forEach"], answer: 2, hint: "Checks condition after the body" },
    { q: "What does JSON stand for?", options: ["JavaScript Object Notation","Java Syntax Object Naming","JavaScript Online Node","Java Script Ordered Node"], answer: 0, hint: "A data-interchange format" },
    { q: "Which method is used to parse a JSON string?", options: ["JSON.parse()","JSON.stringify()","JSON.toObject()","JSON.eval()"], answer: 0, hint: "Parse = string → object" }
  ],
  React: [
    { q: "Who developed React?", options: ["Google","Facebook (Meta)","Microsoft","Amazon"], answer: 1, hint: "Now called Meta" },
    { q: "What is JSX?", options: ["JavaScript XML syntax extension","A template engine","A React database","A testing library"], answer: 0, hint: "Lets you write HTML inside JS" },
    { q: "Which hook manages component state?", options: ["useEffect","useState","useRef","useContext"], answer: 1, hint: "use___State" },
    { q: "Which hook runs side effects after render?", options: ["useState","useEffect","useMemo","useCallback"], answer: 1, hint: "Effect — triggered by renders" },
    { q: "How do you pass data to a child component?", options: ["state","props","ref","context"], answer: 1, hint: "Short for 'properties'" },
    { q: "What is the virtual DOM?", options: ["A separate browser","A lightweight JS representation of the real DOM","A database of components","A CSS engine"], answer: 1, hint: "In-memory tree React diffs against" },
    { q: "What does the key prop help React do?", options: ["Style list items","Track identity across re-renders","Set focus","Cache components"], answer: 1, hint: "Crucial for reconciliation in lists" },
    { q: "Which method renders a React component into the DOM?", options: ["React.render()","ReactDOM.render()","React.mount()","ReactDOM.attach()"], answer: 1, hint: "ReactDOM package" },
    { q: "React is a...?", options: ["Backend Framework","UI Library","Full-stack Platform","Database ORM"], answer: 1, hint: "Only concerned with the View layer" },
    { q: "What is prop drilling?", options: ["Creating props","Passing props through many nested components","Deleting unused props","A React anti-pattern only"], answer: 1, hint: "The pain of passing data deep" }
  ],
  DSA: [
    { q: "Time complexity of binary search?", options: ["O(n)","O(log n)","O(n²)","O(1)"], answer: 1, hint: "Halves the search space each step" },
    { q: "Which data structure uses LIFO?", options: ["Queue","Array","Stack","Tree"], answer: 2, hint: "Last In, First Out — like a pile of plates" },
    { q: "Which of these is NOT a sorting algorithm?", options: ["Bubble Sort","Merge Sort","Quick Sort","Binary Search"], answer: 3, hint: "One is for finding, not sorting" },
    { q: "In a queue, insertion is done at?", options: ["Front","Middle","Rear/End","Random"], answer: 2, hint: "FIFO — join the back of the line" },
    { q: "What is the space complexity of a linked list with n nodes?", options: ["O(1)","O(log n)","O(n)","O(n²)"], answer: 2, hint: "Each node takes constant space" },
    { q: "Which traversal visits root, left, right?", options: ["Inorder","Preorder","Postorder","Level order"], answer: 1, hint: "Pre = root first" },
    { q: "What is the worst-case complexity of Quick Sort?", options: ["O(n log n)","O(n)","O(n²)","O(log n)"], answer: 2, hint: "Happens when pivot is always min/max" },
    { q: "A hash table lookup is typically?", options: ["O(n)","O(log n)","O(1)","O(n²)"], answer: 2, hint: "Direct access via hash" },
    { q: "Which data structure is used for BFS?", options: ["Stack","Queue","Heap","Graph"], answer: 1, hint: "FIFO — process level by level" },
    { q: "What is a binary tree?", options: ["Tree with max 2 children per node","Tree with exactly 2 nodes","Tree with only one child","Tree sorted alphabetically"], answer: 0, hint: "Bi = two" }
  ],
  Python: [
    { q: "Which keyword defines a function in Python?", options: ["function","def","fn","func"], answer: 1, hint: "Short for 'define'" },
    { q: "What is the output of print(type([]))?", options: ["<class 'array'>","<class 'list'>","<class 'tuple'>","<class 'dict'>"], answer: 1, hint: "Square brackets = ___" },
    { q: "Which of these is a Python tuple?", options: ["[1,2,3]","{1,2,3}","(1,2,3)","<1,2,3>"], answer: 2, hint: "Immutable, round brackets" },
    { q: "What does 'len()' return?", options: ["Last element","Length/size of object","Left element","Line count"], answer: 1, hint: "How many items?" },
    { q: "Which operator is used for exponentiation?", options: ["^","**","exp()","//"], answer: 1, hint: "Double star" },
    { q: "What is a Python dictionary?", options: ["Ordered list","Key-value store","Set of values","String template"], answer: 1, hint: "Like a real dictionary: key→definition" },
    { q: "How do you start a comment in Python?", options: ["//","/*","#","--"], answer: 2, hint: "Hash/pound symbol" },
    { q: "Which method adds an item to the end of a list?", options: ["append()","add()","insert()","extend()"], answer: 0, hint: "Tack on to the end" },
    { q: "What does the 'self' keyword refer to in a class?", options: ["The class itself","The current instance","The parent class","A static method"], answer: 1, hint: "The object calling the method" },
    { q: "Which built-in function converts a string to integer?", options: ["toInt()","parseInt()","int()","Integer()"], answer: 2, hint: "Same as the type name" }
  ],
  SQL: [
    { q: "What does SQL stand for?", options: ["Structured Query Language","Simple Query Language","Sequential Query Logic","Structured Question Language"], answer: 0, hint: "Structured ___ Language" },
    { q: "Which statement retrieves data from a table?", options: ["GET","FETCH","SELECT","READ"], answer: 2, hint: "Most common SQL keyword" },
    { q: "Which clause filters rows?", options: ["HAVING","FILTER","WHERE","GROUP BY"], answer: 2, hint: "WHERE are the rows I want?" },
    { q: "Which JOIN returns all rows from both tables?", options: ["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN"], answer: 3, hint: "FULL — neither side is excluded" },
    { q: "Which aggregate function counts rows?", options: ["SUM()","AVG()","COUNT()","TOTAL()"], answer: 2, hint: "Count them up" },
    { q: "Which keyword removes duplicate rows from results?", options: ["UNIQUE","DISTINCT","DIFFERENT","NODUPE"], answer: 1, hint: "SELECT ___ column …" },
    { q: "Which clause is used with aggregate functions to filter groups?", options: ["WHERE","FILTER","HAVING","GROUP BY"], answer: 2, hint: "Like WHERE, but after GROUP BY" },
    { q: "What does PRIMARY KEY enforce?", options: ["Uniqueness only","Not-null only","Uniqueness + not-null","Foreign reference"], answer: 2, hint: "Each row must be uniquely identifiable" },
    { q: "Which command adds a new row to a table?", options: ["ADD","APPEND","UPDATE","INSERT INTO"], answer: 3, hint: "INSERT ___ table VALUES …" },
    { q: "ORDER BY default sort is?", options: ["Descending","Random","Ascending","Alphabetical only"], answer: 2, hint: "Lowest first by default" }
  ],
  Git: [
    { q: "Which command initialises a new Git repository?", options: ["git start","git init","git create","git new"], answer: 1, hint: "init = initialise" },
    { q: "What does 'git clone' do?", options: ["Creates a branch","Copies a remote repo locally","Merges two branches","Deletes a repo"], answer: 1, hint: "Copies an existing repo" },
    { q: "Which command stages changes for a commit?", options: ["git push","git stage","git add","git commit"], answer: 2, hint: "Add to staging area" },
    { q: "What is a branch?", options: ["A backup copy","A parallel line of development","A tag on a commit","A remote server"], answer: 1, hint: "Work in isolation" },
    { q: "Which command uploads commits to a remote?", options: ["git upload","git send","git push","git sync"], answer: 2, hint: "Push to remote" },
    { q: "What does 'git pull' do?", options: ["Fetch only","Fetch + merge","Push to remote","Create a PR"], answer: 1, hint: "Fetch AND merge in one step" },
    { q: "What is a merge conflict?", options: ["A slow merge","Two branches editing the same lines","A deleted branch","A failed push"], answer: 1, hint: "Git can't auto-resolve differing changes" },
    { q: "Which file tells Git what to ignore?", options: [".gitconfig",".gitattributes",".gitignore",".gitskip"], answer: 2, hint: "Ignore these files" },
    { q: "What does 'git stash' do?", options: ["Deletes uncommitted changes","Commits without a message","Temporarily shelves changes","Creates a tag"], answer: 2, hint: "Saves work without committing" },
    { q: "Which command shows the commit history?", options: ["git history","git log","git show","git status"], answer: 1, hint: "Log of all commits" }
  ]
};

const MODES = {
  standard: { label: 'Standard', questions: 5, time: 30 },
  blitz:    { label: 'Blitz',    questions: 10, time: 15 },
  zen:      { label: 'Zen',      questions: 7,  time: 0  }
};

// ─── STATE ──────────────────────────────────────────────────
let state = {
  subject: null,
  mode: 'standard',
  questions: [],
  idx: 0,
  score: 0,
  hintsLeft: 2,
  timerInterval: null,
  timeLeft: 30,
  answerTimes: [],
  questionStart: 0,
  dotStatuses: [],
  inStreak: 0,
  bestStreak: 0,
  xpThisRound: 0,
  totalXP: parseInt(localStorage.getItem('qf_xp') || '0'),
  streak: parseInt(localStorage.getItem('qf_streak') || '0'),
  totalQuizzes: parseInt(localStorage.getItem('qf_total') || '0'),
  bestScore: parseInt(localStorage.getItem('qf_best') || '-1'),
  scoreHistory: JSON.parse(localStorage.getItem('qf_history') || '[]'),
  leaderboard: JSON.parse(localStorage.getItem('qf_lb') || '[]')
};

// ─── INIT ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildSubjectGrid();
  refreshHomeStats();
  renderLeaderboard();
  loadTheme();
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);
});

// ─── THEME ──────────────────────────────────────────────────
function loadTheme() {
  if (localStorage.getItem('qf_theme') === 'light') {
    document.body.classList.add('light');
    document.getElementById('themeIcon').textContent = '☀️';
  }
}
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  document.getElementById('themeIcon').textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('qf_theme', isLight ? 'light' : 'dark');
}

// ─── HOME ────────────────────────────────────────────────────
function buildSubjectGrid() {
  const grid = document.getElementById('subjectGrid');
  grid.innerHTML = '';
  SUBJECTS.forEach(sub => {
    const card = document.createElement('div');
    card.className = 'subject-card';
    card.style.setProperty('--card-color', sub.color);
    card.dataset.id = sub.id;
    card.innerHTML = `
      <span class="card-badge">${sub.badge}</span>
      <div class="subject-icon">${sub.icon}</div>
      <div class="subject-name">${sub.name}</div>
      <div class="subject-desc">${sub.desc}</div>
      <div class="subject-qcount">${QUESTIONS[sub.id].length} questions available</div>
    `;
    card.addEventListener('click', () => selectSubject(sub.id, card));
    grid.appendChild(card);
  });
}

function selectSubject(id, card) {
  document.querySelectorAll('.subject-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  state.subject = id;
  // Start after brief delay for visual feedback
  setTimeout(() => startQuiz(), 300);
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
}

function refreshHomeStats() {
  document.getElementById('totalQuizzesStat').textContent = state.totalQuizzes;
  document.getElementById('xpTotalStat').textContent = state.totalXP;
  document.getElementById('xpCount').textContent = state.totalXP;
  document.getElementById('streakCount').textContent = state.streak;

  if (state.bestScore >= 0) {
    document.getElementById('bestScoreStat').textContent = state.bestScore + '%';
  }
  const history = state.scoreHistory;
  if (history.length) {
    const avg = Math.round(history.reduce((a, b) => a + b, 0) / history.length);
    document.getElementById('avgAccStat').textContent = avg + '%';
  }
}

// ─── QUIZ START ──────────────────────────────────────────────
function startQuiz() {
  if (!state.subject) { showToast('Pick a subject first!'); return; }
  const cfg = MODES[state.mode];
  const pool = [...QUESTIONS[state.subject]].sort(() => Math.random() - 0.5).slice(0, cfg.questions);

  state.questions = pool;
  state.idx = 0;
  state.score = 0;
  state.hintsLeft = 2;
  state.answerTimes = [];
  state.dotStatuses = Array(pool.length).fill('pending');
  state.inStreak = 0;
  state.bestStreak = 0;
  state.xpThisRound = 0;

  document.getElementById('quizSubjectTag').textContent = SUBJECTS.find(s => s.id === state.subject)?.name;
  document.getElementById('quizModeTag').textContent = cfg.label + ' Mode';

  showScreen('quizScreen');
  buildDots();
  loadQuestion();
}

function buildDots() {
  const track = document.getElementById('qnumTrack');
  track.innerHTML = '';
  state.questions.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'qnum-dot' + (i === 0 ? ' current' : '');
    dot.id = `dot-${i}`;
    track.appendChild(dot);
  });
}

function loadQuestion() {
  clearTimer();
  const q = state.questions[state.idx];
  const total = state.questions.length;

  // Progress
  document.getElementById('qCounter').textContent = `Question ${state.idx + 1} of ${total}`;
  document.getElementById('qText').textContent = q.q;
  document.getElementById('progressBar').style.width = `${(state.idx / total) * 100}%`;
  document.getElementById('livescore').textContent = state.score;

  // Hint reset
  document.getElementById('hintArea').classList.remove('visible');
  document.getElementById('hintArea').textContent = '';
  document.getElementById('hintBtn').disabled = state.hintsLeft === 0;
  document.getElementById('hintCount').textContent = state.hintsLeft;

  // Options
  const grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';
  const letters = ['A','B','C','D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';

    const letterSpan = document.createElement('span');
    letterSpan.className = 'option-letter';
    letterSpan.textContent = letters[i];

    const textSpan = document.createElement('span');
    textSpan.textContent = opt;  // textContent safely handles <tags> & special chars

    btn.appendChild(letterSpan);
    btn.appendChild(textSpan);
    btn.addEventListener('click', () => pickAnswer(i, btn));
    grid.appendChild(btn);
  });

  // Timer
  state.questionStart = Date.now();
  const timeLimit = MODES[state.mode].time;
  document.getElementById('timerWrap').style.display = timeLimit > 0 ? 'flex' : 'none';
  if (timeLimit > 0) startTimer(timeLimit);

  // Question card reset
  const card = document.getElementById('questionCard');
  card.classList.remove('pulse-correct', 'pulse-wrong');
}

// ─── TIMER ──────────────────────────────────────────────────
function startTimer(seconds) {
  state.timeLeft = seconds;
  const arc = document.getElementById('timerArc');
  const num = document.getElementById('timerNum');
  const circumference = 119.4;
  arc.className = 'timer-arc';
  num.textContent = seconds;
  arc.style.strokeDashoffset = 0;

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    num.textContent = state.timeLeft;
    arc.style.strokeDashoffset = ((seconds - state.timeLeft) / seconds) * circumference;

    const ratio = state.timeLeft / seconds;
    arc.className = 'timer-arc' + (ratio <= 0.2 ? ' danger' : ratio <= 0.4 ? ' warning' : '');

    if (state.timeLeft <= 0) {
      clearTimer();
      pickAnswer(-1, null); // timeout
    }
  }, 1000);
}

function clearTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
}

// ─── ANSWER ─────────────────────────────────────────────────
function pickAnswer(selected, clickedBtn) {
  clearTimer();
  const q = state.questions[state.idx];
  const elapsed = (Date.now() - state.questionStart) / 1000;
  state.answerTimes.push(elapsed);

  const buttons = document.querySelectorAll('.option-btn');
  buttons.forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer) b.classList.add('correct');
    else if (i === selected) b.classList.add('wrong');
  });

  const correct = selected === q.answer;
  const card = document.getElementById('questionCard');

  if (correct) {
    state.score++;
    state.inStreak++;
    state.bestStreak = Math.max(state.bestStreak, state.inStreak);
    const timeBonus = Math.max(0, Math.floor((MODES[state.mode].time - elapsed) * 2));
    const xp = 10 + timeBonus + (state.inStreak > 2 ? 5 * state.inStreak : 0);
    state.xpThisRound += xp;
    document.getElementById('livescore').textContent = state.score;
    animateScore();
    card.classList.add('pulse-correct');
  } else {
    state.inStreak = 0;
    state.dotStatuses[state.idx] = 'wrong';
    card.classList.add('pulse-wrong');
  }
  state.dotStatuses[state.idx] = correct ? 'correct' : (selected === -1 ? 'skipped' : 'wrong');
  updateDot(state.idx, state.dotStatuses[state.idx]);

  setTimeout(advance, 1100);
}

function advance() {
  state.idx++;
  if (state.idx < state.questions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
}

function animateScore() {
  const el = document.getElementById('livescore');
  el.style.transform = 'scale(1.4)';
  setTimeout(() => el.style.transform = 'scale(1)', 200);
}

function updateDot(i, status) {
  const dot = document.getElementById(`dot-${i}`);
  if (!dot) return;
  dot.className = 'qnum-dot ' + status;
  if (i + 1 < state.questions.length) {
    const next = document.getElementById(`dot-${i+1}`);
    if (next) next.classList.add('current');
  }
}

// ─── HINT ───────────────────────────────────────────────────
function useHint() {
  if (state.hintsLeft <= 0) return;
  const q = state.questions[state.idx];
  const hintArea = document.getElementById('hintArea');
  hintArea.textContent = '💡 ' + (q.hint || 'No hint available for this question.');
  hintArea.classList.add('visible');
  state.hintsLeft--;
  document.getElementById('hintCount').textContent = state.hintsLeft;
  document.getElementById('hintBtn').disabled = state.hintsLeft === 0;
}

// ─── SKIP ───────────────────────────────────────────────────
function skipQuestion() {
  clearTimer();
  state.dotStatuses[state.idx] = 'skipped';
  updateDot(state.idx, 'skipped');
  state.answerTimes.push(0);
  state.inStreak = 0;
  setTimeout(advance, 200);
}

// ─── EXIT ───────────────────────────────────────────────────
function confirmExit() {
  document.getElementById('exitModal').classList.add('active');
}
function closeModal() {
  document.getElementById('exitModal').classList.remove('active');
}
function exitQuiz() {
  closeModal();
  clearTimer();
  goHome();
}

// ─── FINISH ─────────────────────────────────────────────────
function finishQuiz() {
  const total = state.questions.length;
  const accuracy = Math.round((state.score / total) * 100);
  const avgTime = state.answerTimes.length
    ? Math.round(state.answerTimes.reduce((a,b)=>a+b,0) / state.answerTimes.length)
    : 0;

  // XP & persistence
  state.totalXP += state.xpThisRound;
  state.totalQuizzes++;
  state.scoreHistory.push(accuracy);
  if (accuracy > (state.bestScore || -1)) state.bestScore = accuracy;

  // Streak: simple daily (just increment for demo)
  state.streak = Math.min(state.streak + 1, 99);

  saveState();
  refreshHomeStats();

  // Results screen population
  const emoji = accuracy === 100 ? '🏆' : accuracy >= 80 ? '🎉' : accuracy >= 60 ? '👍' : accuracy >= 40 ? '🤔' : '📚';
  const msg   = accuracy === 100 ? 'Perfect score! You\'re a legend.' : accuracy >= 80 ? 'Excellent work!' : accuracy >= 60 ? 'Solid effort, keep going!' : accuracy >= 40 ? 'Room to grow — review your answers.' : 'Practice makes perfect!';

  document.getElementById('resultsEmoji').textContent = emoji;
  document.getElementById('resultsTitle').textContent = 'Quiz Complete!';
  document.getElementById('resultsMessage').textContent = msg;
  document.getElementById('finalScore').textContent = state.score;
  document.getElementById('finalTotal').textContent = `/${total}`;
  document.getElementById('rAccuracy').textContent = accuracy + '%';
  document.getElementById('rXPEarned').textContent = '+' + state.xpThisRound;
  document.getElementById('rAvgTime').textContent = avgTime + 's';
  document.getElementById('rStreak').textContent = state.bestStreak;
  document.getElementById('xpCount').textContent = state.totalXP;
  document.getElementById('streakCount').textContent = state.streak;

  // Score ring animation
  const circumference = 339.3;
  const fill = document.getElementById('scoreRingFill');
  fill.style.strokeDashoffset = circumference;
  fill.style.stroke = accuracy === 100 ? '#f59e0b' : accuracy >= 60 ? '#10b981' : '#ef4444';
  setTimeout(() => {
    fill.style.strokeDashoffset = circumference - (accuracy / 100) * circumference;
  }, 150);

  // Review list
  const reviewList = document.getElementById('reviewList');
  reviewList.innerHTML = '';
  state.questions.forEach((q, i) => {
    const status = state.dotStatuses[i];
    const isCorrect = status === 'correct';
    const div = document.createElement('div');
    div.className = `review-item ${isCorrect ? 'correct-item' : 'wrong-item'}`;
    div.innerHTML = `
      <span class="review-icon">${isCorrect ? '✅' : '❌'}</span>
      <div>
        <div class="review-q">${q.q}</div>
        ${isCorrect
          ? `<div class="review-a-correct">✓ ${q.options[q.answer]}</div>`
          : `<div class="review-a-wrong">Correct: ${q.options[q.answer]}</div>`}
      </div>
    `;
    reviewList.appendChild(div);
  });

  showScreen('resultsScreen');

  // Confetti for good scores
  if (accuracy >= 80 && typeof confetti === 'function') {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
  }

  // XP toast
  setTimeout(() => showToast(`+${state.xpThisRound} XP earned!`), 600);
}

// ─── LEADERBOARD ─────────────────────────────────────────────
function saveToLeaderboard() {
  const name = document.getElementById('playerName').value.trim() || 'Anonymous';
  const total = state.questions.length;
  const accuracy = Math.round((state.score / total) * 100);
  const entry = {
    name,
    subject: SUBJECTS.find(s => s.id === state.subject)?.name || state.subject,
    score: state.score,
    total,
    accuracy,
    mode: state.mode,
    date: new Date().toLocaleDateString()
  };
  state.leaderboard.unshift(entry);
  state.leaderboard = state.leaderboard.slice(0, 10);
  localStorage.setItem('qf_lb', JSON.stringify(state.leaderboard));
  renderLeaderboard();
  showToast('Score saved to leaderboard! 🏆');
  document.getElementById('playerName').value = '';
}

function renderLeaderboard() {
  const list = document.getElementById('lbList');
  if (!state.leaderboard.length) {
    list.innerHTML = '<p class="lb-empty">No scores yet — be the first!</p>';
    return;
  }
  const rankClass = ['gold','silver','bronze'];
  list.innerHTML = state.leaderboard.map((e, i) => `
    <div class="lb-entry">
      <span class="lb-rank ${rankClass[i] || ''}">${i < 3 ? ['🥇','🥈','🥉'][i] : i+1}</span>
      <span class="lb-name">${e.name}</span>
      <span class="lb-subject">${e.subject}</span>
      <span class="lb-score">${e.accuracy}%</span>
    </div>
  `).join('');
}

// ─── RESULTS ACTIONS ─────────────────────────────────────────
function retakeQuiz() { startQuiz(); }
function goHome() {
  clearTimer();
  showScreen('homeScreen');
  refreshHomeStats();
  renderLeaderboard();
  // Deselect subject
  state.subject = null;
  document.querySelectorAll('.subject-card').forEach(c => c.classList.remove('selected'));
}

function shareResult() {
  const total = state.questions.length;
  const accuracy = Math.round((state.score / total) * 100);
  const text = `I scored ${state.score}/${total} (${accuracy}%) on ${state.subject} in QuizForge! 🎯`;
  if (navigator.share) {
    navigator.share({ title: 'QuizForge Result', text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => showToast('Result copied!')).catch(() => {});
  }
}

// ─── SCREEN MANAGER ──────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── TOAST ──────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('levelToast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ─── PERSIST ────────────────────────────────────────────────
function saveState() {
  localStorage.setItem('qf_xp', state.totalXP);
  localStorage.setItem('qf_streak', state.streak);
  localStorage.setItem('qf_total', state.totalQuizzes);
  localStorage.setItem('qf_best', state.bestScore);
  localStorage.setItem('qf_history', JSON.stringify(state.scoreHistory.slice(-50)));
}