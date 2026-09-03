import { Router } from 'express';
import { createQuote, listQuotes, getQuote, respondToQuote } from '../controllers/quotesController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth);
router.get('/', listQuotes);
router.get('/:id', getQuote);
router.post('/', requireRole('ADMIN'), createQuote);
router.post('/:id/respond', respondToQuote);

export default router;
