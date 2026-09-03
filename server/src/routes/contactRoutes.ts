import { Router } from 'express';
import {
  submitContactMessage, listContactMessages, updateContactMessage, deleteContactMessage,
} from '../controllers/contactController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', submitContactMessage);
router.get('/', requireAuth, requireRole('ADMIN'), listContactMessages);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateContactMessage);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteContactMessage);

export default router;
