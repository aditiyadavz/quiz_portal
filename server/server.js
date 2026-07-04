require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

app.use(
  session({
    name: 'connect.sid',
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      secure: isProd,
      sameSite: 'lax',
    },
  })
);

// ---- API routes ----
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);

// Lightweight endpoint the frontend can call to check session before rendering
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ---- Static frontend ----
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Protect the dashboard page: if not logged in, send to login page.
// (This is a convenience redirect; the real enforcement happens via the API session checks,
// since a determined user could still request the JSON API directly.)
app.get('/dashboard.html', (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login.html');
  }
  res.sendFile(path.join(PUBLIC_DIR, 'dashboard.html'));
});

app.use(express.static(PUBLIC_DIR));

app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'), (err) => {
    if (err) res.status(404).send('Not found');
  });
});

app.listen(PORT, () => {
  console.log(`\n  🧠 QuizForge server running → http://localhost:${PORT}\n`);
});
