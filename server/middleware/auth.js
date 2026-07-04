// auth.js — middleware to protect routes that require a logged-in user

function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: 'Not authenticated. Please log in.' });
}

module.exports = { requireAuth };
