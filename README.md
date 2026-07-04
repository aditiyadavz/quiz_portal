# QuizForge — Full-Stack Edition

A tech-skills quiz portal with **real backend authentication**, **per-user profiles**, and a **progress analytics dashboard** with charts — built on top of the original QuizForge front-end.

## What's new vs. the original

- 🔐 **Real authentication** — Express + SQLite backend, `bcryptjs`-hashed passwords, server-side sessions (cookies), not just `localStorage`.
- 👤 **Per-account history** — every quiz result is tied to the logged-in user, so switching accounts shows a completely separate history/XP/streak.
- 📊 **Analytics dashboard** (`/dashboard.html`) — score trend line chart, subject-accuracy bar chart, mode split doughnut chart, 14-day activity chart, and a recent-attempts list, all built with Chart.js.
- 🏆 **Real cross-user leaderboard** — pulled from the database instead of a single browser's `localStorage`.
- 🔥 Day-streak and XP tracking now live server-side.

The original quiz gameplay (8 subjects, Standard/Blitz/Zen modes, timer, hints, confetti, dark/light theme) is untouched.

## Tech stack

- **Backend:** Node.js + Express
- **Database:** SQLite via Node's built-in `node:sqlite` module (no native compilation, no external DB server to install)
- **Auth:** `bcryptjs` password hashing + `express-session` cookie sessions
- **Frontend:** Plain HTML/CSS/JS (no build step) + Chart.js (via CDN) for the dashboard

## Requirements

- **Node.js 22.5+** (needed for the built-in `node:sqlite` module). Check with `node -v`.

## Setup

```bash
cd quiz-portal-app
npm install
cp .env.example .env   # edit SESSION_SECRET before deploying anywhere real
npm start
```

Then open **http://localhost:3000** — you'll land on the login page automatically since no account exists yet. Click **"Create an account"** to register, then start taking quizzes.

For development with auto-restart on file changes:
```bash
npm run dev
```

## Project structure

```
quiz-portal-app/
├── server/
│   ├── server.js          # Express app entry point
│   ├── db/
│   │   ├── database.js    # SQLite schema + connection (creates quizforge.db on first run)
│   │   └── quizforge.db   # created automatically, gitignored
│   ├── routes/
│   │   ├── auth.js        # POST /register, /login, /logout, GET /me
│   │   └── quiz.js        # POST /result, GET /history, /stats, /leaderboard
│   └── middleware/
│       └── auth.js        # requireAuth session guard
├── public/
│   ├── index.html          # main quiz app (unchanged gameplay)
│   ├── login.html          # new
│   ├── register.html       # new
│   ├── dashboard.html      # new — analytics dashboard
│   ├── style.css           # original theme
│   ├── css/extra.css       # new — auth + dashboard styles (same design tokens)
│   ├── script.js           # original quiz logic, now synced to the backend
│   └── js/
│       ├── api.js          # shared fetch helper + auth guard
│       └── dashboard.js    # renders the analytics charts
├── package.json
├── .env.example
└── .gitignore
```

## API reference

All endpoints are JSON. A session cookie (`connect.sid`) is set on login/register and required for everything under `/api/quiz/*`.

| Method | Path | Auth? | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | `{ username, email, password }` → creates account + logs in |
| POST | `/api/auth/login` | — | `{ username, password }` (username or email) |
| POST | `/api/auth/logout` | — | Destroys session |
| GET | `/api/auth/me` | ✅ | Current logged-in user |
| POST | `/api/quiz/result` | ✅ | Submit a completed quiz attempt |
| GET | `/api/quiz/history` | ✅ | Recent attempts (`?limit=`) |
| GET | `/api/quiz/stats` | ✅ | Aggregated analytics for the dashboard |
| GET | `/api/quiz/leaderboard` | ✅ | Top 10 attempts across all users |

## Security notes

- Passwords are hashed with bcrypt (10 salt rounds) — never stored in plain text.
- Sessions are `httpOnly` cookies; `secure` is auto-enabled when `NODE_ENV=production`.
- This is a solid **learning/demo-grade** setup. Before putting it on the public internet, also consider: rate-limiting login attempts, HTTPS, a persistent session store instead of the in-memory default (fine for one server, not for multiple instances), and CSRF protection if you add cross-site forms.
