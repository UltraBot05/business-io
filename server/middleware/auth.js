export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

export function optionalAuth(req, res, next) {
  // Doesn't block, just passes through
  next();
}
