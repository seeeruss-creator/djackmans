import jwt from 'jsonwebtoken';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.NETLIFY_JWT_SECRET;
  if (secret) return secret;
  console.warn('JWT_SECRET is not set — using a temporary fallback. Set JWT_SECRET in environment variables.');
  return 'djackman-temporary-jwt-secret-set-JWT_SECRET';
}

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
}
