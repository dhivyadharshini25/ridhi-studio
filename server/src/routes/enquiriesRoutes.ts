import { Router } from 'express';
import {
  createEnquiry, listEnquiries, getEnquiry, updateEnquiry, convertToProject,
} from '../controllers/enquiriesController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth);
router.post('/', createEnquiry);
router.get('/', listEnquiries);
router.get('/:id', getEnquiry);
router.put('/:id', requireRole('ADMIN'), updateEnquiry);
router.post('/:id/convert', requireRole('ADMIN'), convertToProject);

export default router;
