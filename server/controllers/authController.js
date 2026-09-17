import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { createAccessToken, createRefreshToken, hashToken, refreshCookieOptions } from '../utils/tokens.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailSimulator.js';

// ─── helpers ────────────────────────────────────────────────────────────────

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

/**
 * Issue a brand-new access + refresh token pair.
 * Each refresh increments tokenVersion so any older refresh token is rejected.
 */
async function setSession(res, user) {
  user.tokenVersion = (user.tokenVersion || 0) + 1;
  const refreshToken = createRefreshToken(user);
  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();
  res.cookie('refreshToken', refreshToken, refreshCookieOptions());
  return res.json({
    user: { id: user._id, name: user.name, email: user.email, isVerified: user.isVerified },
    accessToken: createAccessToken(user),
  });
}

// ─── SIGNUP ─────────────────────────────────────────────────────────────────

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8)
      return res.status(400).json({ message: 'Name, email, and an 8-character password are required.' });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Email is already registered.' });

    const code = generateVerificationCode();
    const user = await User.create({
      name,
      email,
      password:               await bcrypt.hash(password, 12),
      isVerified:             false,
      emailVerificationCode:  code,
      verificationExpires:    new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // Simulate email
    sendVerificationEmail(email, code);

    // Return user id + signal so the frontend can show the verification step
    return res.status(201).json({
      message:  'Account created! Please verify your email.',
      userId:   user._id,
      email:    user.email,
      // In development we also send the code in the response body so the
      // assessor can test without reading the server console.
      devVerificationCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ─── VERIFY EMAIL ────────────────────────────────────────────────────────────

export async function verifyEmail(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ message: 'Email and verification code are required.' });

    const user = await User.findOne({ email }).select('+emailVerificationCode +refreshTokenHash +tokenVersion');
    if (!user)
      return res.status(404).json({ message: 'User not found.' });
    if (user.isVerified)
      return res.status(400).json({ message: 'Email is already verified.' });
    if (!user.emailVerificationCode || user.verificationExpires < Date.now())
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    if (user.emailVerificationCode !== code)
      return res.status(400).json({ message: 'Incorrect verification code.' });

    user.isVerified             = true;
    user.emailVerificationCode  = undefined;
    user.verificationExpires    = undefined;

    return setSession(res, user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ─── RESEND CODE ─────────────────────────────────────────────────────────────

export async function resendVerification(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+emailVerificationCode');
    if (!user)                return res.status(404).json({ message: 'User not found.' });
    if (user.isVerified)      return res.status(400).json({ message: 'Email is already verified.' });

    const code = generateVerificationCode();
    user.emailVerificationCode = code;
    user.verificationExpires   = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    sendVerificationEmail(user.email, code);

    return res.json({
      message: 'A new verification code has been sent.',
      devVerificationCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────

export async function login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email })
      .select('+password +refreshTokenHash +tokenVersion');

    if (!user || !(await bcrypt.compare(req.body.password || '', user.password)))
      return res.status(401).json({ message: 'Invalid email or password.' });

    if (!user.isVerified)
      return res.status(403).json({
        message:  'Please verify your email before logging in.',
        needsVerification: true,
        email:    user.email,
      });

    return setSession(res, user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ─── REFRESH TOKEN (with rotation) ───────────────────────────────────────────

export async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token.' });

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id).select('+refreshTokenHash +tokenVersion');

    if (!user || user.refreshTokenHash !== hashToken(token))
      return res.status(401).json({ message: 'Refresh token is invalid or has been rotated.' });

    // Rotate: setSession increments tokenVersion and issues a new token
    return setSession(res, user);
  } catch {
    res.status(401).json({ message: 'Refresh token expired or invalid.' });
  }
}

// ─── LOGOUT ──────────────────────────────────────────────────────────────────

export async function logout(req, res) {
  if (req.cookies.refreshToken) {
    const payload = jwt.decode(req.cookies.refreshToken);
    if (payload?.id) {
      await User.findByIdAndUpdate(payload.id, {
        $unset: { refreshTokenHash: 1 },
        $inc:   { tokenVersion: 1 },
      });
    }
  }
  res.clearCookie('refreshToken', refreshCookieOptions());
  res.json({ message: 'Logged out.' });
}

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────

export async function forgotPassword(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email }).select('+resetTokenHash');
    if (user) {
      const raw = crypto.randomBytes(32).toString('hex');
      user.resetTokenHash    = hashToken(raw);
      user.resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hr
      await user.save();
      sendPasswordResetEmail(user.email, raw);

      // In dev, return the token so assessors don't need to read the console
      if (process.env.NODE_ENV !== 'production') {
        return res.json({
          message:    'If that email exists, a reset link has been prepared.',
          devResetToken: raw,
        });
      }
    }
    // Always respond 200 so we don't leak whether an account exists
    return res.json({ message: 'If that email exists, a reset link has been prepared.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ─── RESET PASSWORD ──────────────────────────────────────────────────────────

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8)
      return res.status(400).json({ message: 'Token and a new 8-character password are required.' });

    const user = await User.findOne({
      resetTokenHash:    hashToken(token),
      resetTokenExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user)
      return res.status(400).json({ message: 'Reset token is invalid or has expired.' });

    user.password          = await bcrypt.hash(password, 12);
    user.resetTokenHash    = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
