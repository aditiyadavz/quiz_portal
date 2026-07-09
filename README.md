# 🧠 QuizForge

A **full-stack Quiz Portal** — built with **HTML, CSS, and JavaScript** on the front end, and a real **Node.js + Express + SQLite** backend for accounts and progress tracking.

Log in, pick a topic, and challenge yourself with a timed multiple-choice quiz across 8 tech subjects. Your XP, streaks, and accuracy are saved to your own account and visualized on a personal analytics dashboard.

---

## 🚀 Features

- 🔐 **Real accounts** – register/login with a hashed password, not just a name typed into a box
- 📚 **8 subjects** – HTML, CSS, JavaScript, React, DSA, Python, SQL, and Git & DevOps
- ⏱️ **3 quiz modes** – Standard (5 questions, 30s each), Blitz (10 questions, 15s each), Zen (7 questions, untimed)
- 🎯 **Live scoring, streak bonuses, and XP** – with hints (2 per quiz) and instant answer feedback
- 📊 **Personal analytics dashboard** – score trend, subject-accuracy breakdown, mode split, 14-day activity chart, and recent-attempt history, all backed by your real quiz data
- 🏆 **Global leaderboard** – pulled from every user's actual results, not just your browser
- 🔥 **Daily streak & total XP tracking** – stored server-side, so it survives clearing your browser
- 🌗 **Dark/light theme toggle**
- 📱 **Fully responsive** UI, down to mobile
- 🎉 Confetti + toast celebrations on strong scores

---

## 📁 Project Structure

```
quiz-portal-app/
├── server/
│   ├── server.js            # Express app entry point
│   ├── db/
│   │   ├── database.js      # SQLite schema (users, quiz_results, user_stats)
│   │   └── quizforge.db     # created automatically on first run
│   ├── routes/
│   │   ├── auth.js          # register / login / logout / me
│   │   └── quiz.js          # submit result / history / stats / leaderboard
│   └── middleware/
│       └── auth.js          # session guard for protected routes
├── public/
│   ├── index.html           # the quiz app itself
│   ├── login.html           # sign in
│   ├── register.html        # create account
│   ├── dashboard.html       # analytics dashboard
│   ├── style.css            # core theme
│   ├── css/extra.css        # auth + dashboard styles
│   ├── script.js            # quiz gameplay logic
│   ├── js/api.js            # shared fetch/auth helper
│   ├── js/dashboard.js      # renders the dashboard charts
│   └── img/                 # screenshots
├── package.json
├── .env.example
└── README.md
```

---

## 💻 Tech Stack

- **HTML5 / CSS3 / JavaScript** – quiz UI and gameplay logic
- **Node.js + Express** – backend API
- **SQLite** (via Node's built-in `node:sqlite`) – stores users, quiz results, and stats in a single local file
- **bcryptjs** – password hashing
- **express-session** – login sessions (cookies)
- **Chart.js** – dashboard charts

---

## 🧠 How it works

1. **Create an account** (or log in if you already have one).
2. Choose one of the 8 subjects on the home screen, and a mode: Standard, Blitz, or Zen.
3. Answer each question before the timer runs out (Zen mode has no timer). Use a hint if you're stuck — you get 2 per quiz.
4. At the end, see your score, accuracy, XP earned, and a full question-by-question review.
5. Your result is saved automatically to your account and the global leaderboard — no manual "save score" step needed.
6. Visit the **📊 Dashboard** any time to see trends across every quiz you've ever taken.

---

## ⚙️ Running it locally

```bash
npm install
copy .env.example .env      # (or `cp` on Mac/Linux) then set a real SESSION_SECRET
npm start
```

Open **http://localhost:3000** — you'll land on the login page. Requires **Node.js 22.5+**.

See the API reference and security notes further down this repo's docs (or ask if you want them re-added here) for endpoint details.
