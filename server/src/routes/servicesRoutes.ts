import { Router } from 'express';
import {
  listServices, getServiceBySlug, createService, updateService, deleteService, listCategories,
} from '../controllers/servicesController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', listServices);
router.get('/categories', listCategories);
router.get('/:slug', getServiceBySlug);
router.post('/', requireAuth, requireRole('ADMIN'), createService);
router.put('/:id', requireAuth, requireRole('ADMIN'), updateService);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deleteService);

export default router;
