import { Router } from 'express';
import {
  listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
} from '../controllers/testimonialsController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', listTestimonials);
router.post('/', createTestimonial); // public: customers can submit a testimonial for review
router.put('/:id', requireAuth, requireRole('ADMIN'), updateTestimonial);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteTestimonial);

export default router;
