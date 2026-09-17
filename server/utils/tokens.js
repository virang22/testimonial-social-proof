import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export function createAccessToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}
export function createRefreshToken(user) {
  return jwt.sign({ id: user._id, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
export function hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
export function refreshCookieOptions() { return { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 }; }
