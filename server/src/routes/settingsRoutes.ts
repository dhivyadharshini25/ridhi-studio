import { Router } from 'express';
import { getPublicSettings, updateSetting } from '../controllers/settingsController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getPublicSettings);
router.put('/:key', requireAuth, requireRole('ADMIN'), updateSetting);

export default router;
