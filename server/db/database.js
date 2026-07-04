// database.js
// Uses Node's built-in `node:sqlite` module (available in Node 22+, no native
// compilation required). Data persists to a file on disk at server/db/quizforge.db.

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_DIR = __dirname;
const DB_PATH = path.join(DB_DIR, 'quizforge.db');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`PRAGMA journal_mode = WAL;`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar_emoji TEXT DEFAULT '🧑‍🚀',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS quiz_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'standard',
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    accuracy REAL NOT NULL,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    avg_time REAL NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    time_spent_seconds REAL NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

db.exec(`
  CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON quiz_results(user_id);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_stats (
    user_id INTEGER PRIMARY KEY,
    total_xp INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_played_date TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

module.exports = db;
