const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');

const router = express.Router();

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVATARS = ['🧑‍🚀', '🦊', '🐙', '🦉', '🐺', '🦁', '🐼', '🦄', '🐢', '🦅'];

function publicUser(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    avatarEmoji: row.avatar_emoji,
    createdAt: row.created_at,
  };
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are all required.' });
  }
  if (!USERNAME_RE.test(username)) {
    return res.status(400).json({ error: 'Username must be 3-20 characters: letters, numbers, underscores only.' });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (existing) {
    return res.status(409).json({ error: 'That username or email is already registered.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];

  const info = db
    .prepare('INSERT INTO users (username, email, password_hash, avatar_emoji) VALUES (?, ?, ?, ?)')
    .run(username, email, passwordHash, avatar);

  const userId = info.lastInsertRowid;
  db.prepare('INSERT INTO user_stats (user_id) VALUES (?)').run(userId);

  req.session.userId = userId;
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  res.status(201).json({ user: publicUser(user) });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = db
    .prepare('SELECT * FROM users WHERE username = ? OR email = ?')
    .get(username, username);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  req.session.userId = user.id;
  res.json({ user: publicUser(user) });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Could not log out. Try again.' });
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  res.json({ user: publicUser(user) });
});

module.exports = router;
