import { Router } from 'express';
import {
  signup,
  verifyEmail,
  resendVerification,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const router = Router();

router.post('/signup',              signup);
router.post('/verify-email',        verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/login',               login);
router.post('/refresh',             refresh);
router.post('/logout',              logout);
router.post('/forgot-password',     forgotPassword);
router.post('/reset-password',      resetPassword);

export default router;
