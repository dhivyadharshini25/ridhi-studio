import { Router } from 'express';
import { createPaymentOrder, verifyPayment, listPayments } from '../controllers/paymentsController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);
router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/', listPayments);

export default router;
