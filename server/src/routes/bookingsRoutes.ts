import { Router } from 'express';
import { createBooking, listBookings, updateBooking } from '../controllers/bookingsController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth);
router.post('/', createBooking);
router.get('/', listBookings);
router.put('/:id', requireRole('ADMIN'), updateBooking);

export default router;
