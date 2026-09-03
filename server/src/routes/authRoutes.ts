import { Router } from 'express';
import { register, login, me, updateProfile, forgotPassword, resetPassword } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', requireAuth, me);
router.put('/me', requireAuth, updateProfile);

export default router;
