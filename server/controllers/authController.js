import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { createAccessToken, createRefreshToken, hashToken, refreshCookieOptions } from '../utils/tokens.js';

function setSession(res, user) {
  const refreshToken = createRefreshToken(user);
  user.refreshTokenHash = hashToken(refreshToken);
  return user.save().then(() => { res.cookie('refreshToken', refreshToken, refreshCookieOptions()); return res.json({ user: { id: user._id, name: user.name, email: user.email }, accessToken: createAccessToken(user) }); });
}
export async function signup(req, res) {
  try { const { name, email, password } = req.body; if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, email and an 8-character password are required' });
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email is already registered' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), isVerified: true }); return setSession(res, user);
  } catch (error) { res.status(500).json({ message: error.message }); }
}
export async function login(req, res) { try { const user = await User.findOne({ email: req.body.email }).select('+password +refreshTokenHash'); if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password' }); return setSession(res, user); } catch (error) { res.status(500).json({ message: error.message }); } }
export async function refresh(req, res) { try { const token = req.cookies.refreshToken; const payload = jwt.verify(token || '', process.env.JWT_REFRESH_SECRET); const user = await User.findById(payload.id).select('+refreshTokenHash'); if (!user || user.refreshTokenHash !== hashToken(token)) return res.status(401).json({ message: 'Refresh token is invalid' }); return setSession(res, user); } catch { res.status(401).json({ message: 'Refresh token expired' }); } }
export async function logout(req, res) { if (req.cookies.refreshToken) { const payload = jwt.decode(req.cookies.refreshToken); if (payload?.id) await User.findByIdAndUpdate(payload.id, { $unset: { refreshTokenHash: 1 } }); } res.clearCookie('refreshToken', refreshCookieOptions()); res.json({ message: 'Logged out' }); }
export async function forgotPassword(req, res) { const user = await User.findOne({ email: req.body.email }); if (user) { const raw = crypto.randomBytes(24).toString('hex'); user.resetTokenHash = hashToken(raw); user.resetTokenExpires = Date.now() + 3600000; await user.save(); } res.json({ message: 'If the email exists, a reset link has been prepared' }); }
export async function resetPassword(req, res) { const user = await User.findOne({ resetTokenHash: hashToken(req.body.token || ''), resetTokenExpires: { $gt: Date.now() } }).select('+password'); if (!user) return res.status(400).json({ message: 'Reset token is invalid or expired' }); user.password = await bcrypt.hash(req.body.password, 12); user.resetTokenHash = undefined; user.resetTokenExpires = undefined; await user.save(); res.json({ message: 'Password reset successfully' }); }
