const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

// POST /api/quiz/result — submit a completed quiz attempt
router.post('/result', (req, res) => {
  const { subject, mode, score, total, accuracy, xpEarned, avgTime, bestStreak, timeSpentSeconds } = req.body || {};

  if (!subject || total === undefined || score === undefined) {
    return res.status(400).json({ error: 'subject, score, and total are required.' });
  }

  const userId = req.session.userId;

  db.prepare(
    `INSERT INTO quiz_results
      (user_id, subject, mode, score, total, accuracy, xp_earned, avg_time, best_streak, time_spent_seconds)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    userId,
    subject,
    mode || 'standard',
    score,
    total,
    accuracy ?? (total ? (score / total) * 100 : 0),
    xpEarned || 0,
    avgTime || 0,
    bestStreak || 0,
    timeSpentSeconds || 0
  );

  // Update streak + total XP
  let stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(userId);
  if (!stats) {
    db.prepare('INSERT INTO user_stats (user_id) VALUES (?)').run(userId);
    stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(userId);
  }

  const today = todayStr();
  let newStreak = stats.current_streak;
  if (stats.last_played_date === today) {
    // already played today, streak unchanged
  } else if (stats.last_played_date && daysBetween(stats.last_played_date, today) === 1) {
    newStreak = stats.current_streak + 1;
  } else {
    newStreak = 1;
  }
  const newLongest = Math.max(stats.longest_streak, newStreak);
  const newTotalXP = stats.total_xp + (xpEarned || 0);

  db.prepare(
    'UPDATE user_stats SET total_xp = ?, current_streak = ?, longest_streak = ?, last_played_date = ? WHERE user_id = ?'
  ).run(newTotalXP, newStreak, newLongest, today, userId);

  res.status(201).json({ ok: true, currentStreak: newStreak, totalXP: newTotalXP });
});

// GET /api/quiz/history — recent attempts, most recent first
router.get('/history', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
  const rows = db
    .prepare('SELECT * FROM quiz_results WHERE user_id = ? ORDER BY created_at DESC LIMIT ?')
    .all(req.session.userId, limit);
  res.json({ history: rows });
});

// GET /api/quiz/stats — aggregated analytics for the dashboard/charts
router.get('/stats', (req, res) => {
  const userId = req.session.userId;

  const overview = db
    .prepare(
      `SELECT
        COUNT(*) AS totalQuizzes,
        COALESCE(MAX(score), 0) AS bestScore,
        COALESCE(MAX(accuracy), 0) AS bestAccuracy,
        COALESCE(AVG(accuracy), 0) AS avgAccuracy,
        COALESCE(SUM(time_spent_seconds), 0) AS totalTimeSeconds,
        COALESCE(MAX(best_streak), 0) AS bestQuestionStreak
      FROM quiz_results WHERE user_id = ?`
    )
    .get(userId);

  const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(userId) || {
    total_xp: 0,
    current_streak: 0,
    longest_streak: 0,
  };

  // Score trend: last 30 attempts in chronological order
  const trendRows = db
    .prepare(
      `SELECT created_at, score, total, accuracy, subject
       FROM quiz_results WHERE user_id = ? ORDER BY created_at ASC LIMIT 30`
    )
    .all(userId);

  // Subject-wise breakdown
  const subjectRows = db
    .prepare(
      `SELECT subject,
        COUNT(*) AS attempts,
        AVG(accuracy) AS avgAccuracy,
        MAX(score * 1.0 / total) AS bestRatio,
        SUM(time_spent_seconds) AS timeSeconds
       FROM quiz_results WHERE user_id = ? GROUP BY subject ORDER BY attempts DESC`
    )
    .all(userId);

  // Mode breakdown
  const modeRows = db
    .prepare(
      `SELECT mode, COUNT(*) AS attempts, AVG(accuracy) AS avgAccuracy
       FROM quiz_results WHERE user_id = ? GROUP BY mode`
    )
    .all(userId);

  // Activity by day (last 14 days) for a mini activity chart
  const activityRows = db
    .prepare(
      `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS quizzes, SUM(xp_earned) AS xp
       FROM quiz_results
       WHERE user_id = ? AND created_at >= datetime('now', '-14 days')
       GROUP BY day ORDER BY day ASC`
    )
    .all(userId);

  res.json({
    overview: {
      totalQuizzes: overview.totalQuizzes,
      bestScore: overview.bestScore,
      bestAccuracy: Math.round(overview.bestAccuracy),
      avgAccuracy: Math.round(overview.avgAccuracy * 10) / 10,
      totalTimeSeconds: overview.totalTimeSeconds,
      bestQuestionStreak: overview.bestQuestionStreak,
      totalXP: stats.total_xp,
      currentDayStreak: stats.current_streak,
      longestDayStreak: stats.longest_streak,
    },
    scoreTrend: trendRows,
    subjectBreakdown: subjectRows,
    modeBreakdown: modeRows,
    activity: activityRows,
  });
});

// GET /api/quiz/leaderboard — global top scores across all users (single best attempt each)
router.get('/leaderboard', (req, res) => {
  const rows = db
    .prepare(
      `SELECT u.username, u.avatar_emoji, qr.subject, qr.score, qr.total, qr.mode, qr.created_at
       FROM quiz_results qr
       JOIN users u ON u.id = qr.user_id
       ORDER BY (qr.score * 1.0 / qr.total) DESC, qr.created_at DESC
       LIMIT 10`
    )
    .all();
  res.json({ leaderboard: rows });
});

// GET /api/quiz/badges — achievement badges, computed from existing quiz data
router.get('/badges', (req, res) => {
  const userId = req.session.userId;

  const overview = db
    .prepare(
      `SELECT
        COUNT(*) AS totalQuizzes,
        COALESCE(MAX(accuracy), 0) AS bestAccuracy,
        COALESCE(AVG(accuracy), 0) AS avgAccuracy,
        COALESCE(COUNT(DISTINCT subject), 0) AS distinctSubjects,
        COALESCE(SUM(CASE WHEN accuracy >= 100 THEN 1 ELSE 0 END), 0) AS perfectScores,
        COALESCE(SUM(CASE WHEN mode = 'blitz' THEN 1 ELSE 0 END), 0) AS blitzCount,
        COALESCE(SUM(CASE WHEN mode = 'zen' THEN 1 ELSE 0 END), 0) AS zenCount,
        COALESCE(MAX(best_streak), 0) AS bestQuestionStreak
      FROM quiz_results WHERE user_id = ?`
    )
    .get(userId);

  const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(userId) || {
    total_xp: 0,
    current_streak: 0,
    longest_streak: 0,
  };

  const TOTAL_SUBJECTS = 8;

  const badges = [
    {
      id: 'first_quiz',
      emoji: '🥇',
      name: 'First Steps',
      description: 'Complete your first quiz',
      earned: overview.totalQuizzes >= 1,
      progress: `${Math.min(overview.totalQuizzes, 1)}/1`,
    },
    {
      id: 'perfect_score',
      emoji: '💯',
      name: 'Perfectionist',
      description: 'Score 100% on any quiz',
      earned: overview.perfectScores >= 1,
      progress: overview.perfectScores >= 1 ? 'Earned' : '0/1',
    },
    {
      id: 'question_streak',
      emoji: '⚡',
      name: 'On Fire',
      description: 'Get 5 questions in a row correct',
      earned: overview.bestQuestionStreak >= 5,
      progress: `${Math.min(overview.bestQuestionStreak, 5)}/5`,
    },
    {
      id: 'subject_explorer',
      emoji: '🗺️',
      name: 'Subject Explorer',
      description: 'Try every subject at least once',
      earned: overview.distinctSubjects >= TOTAL_SUBJECTS,
      progress: `${overview.distinctSubjects}/${TOTAL_SUBJECTS}`,
    },
    {
      id: 'blitz_runner',
      emoji: '🚀',
      name: 'Blitz Runner',
      description: 'Complete 5 Blitz mode quizzes',
      earned: overview.blitzCount >= 5,
      progress: `${Math.min(overview.blitzCount, 5)}/5`,
    },
    {
      id: 'zen_master',
      emoji: '🧘',
      name: 'Zen Master',
      description: 'Complete 5 Zen mode quizzes',
      earned: overview.zenCount >= 5,
      progress: `${Math.min(overview.zenCount, 5)}/5`,
    },
    {
      id: 'sharpshooter',
      emoji: '🎯',
      name: 'Sharpshooter',
      description: '90%+ average accuracy over 10+ quizzes',
      earned: overview.totalQuizzes >= 10 && overview.avgAccuracy >= 90,
      progress: overview.totalQuizzes >= 10 ? `${Math.round(overview.avgAccuracy)}/90%` : `${overview.totalQuizzes}/10 quizzes`,
    },
    {
      id: 'marathoner',
      emoji: '💪',
      name: 'Marathoner',
      description: 'Complete 25 quizzes total',
      earned: overview.totalQuizzes >= 25,
      progress: `${Math.min(overview.totalQuizzes, 25)}/25`,
    },
    {
      id: 'week_streak',
      emoji: '🔥',
      name: 'Week Warrior',
      description: 'Hit a 7-day streak',
      earned: stats.longest_streak >= 7,
      progress: `${Math.min(stats.longest_streak, 7)}/7`,
    },
    {
      id: 'xp_1000',
      emoji: '⭐',
      name: 'Rising Star',
      description: 'Earn 1,000 total XP',
      earned: stats.total_xp >= 1000,
      progress: `${Math.min(stats.total_xp, 1000)}/1000`,
    },
  ];

  res.json({
    badges,
    earnedCount: badges.filter((b) => b.earned).length,
    totalCount: badges.length,
  });
});

module.exports = router;
