import { Router } from 'express';
import {
  listCustomers, getCustomer, setCustomerActive, getDashboardStats,
} from '../controllers/usersController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));
router.get('/dashboard-stats', getDashboardStats);
router.get('/customers', listCustomers);
router.get('/customers/:id', getCustomer);
router.put('/customers/:id/active', setCustomerActive);

export default router;
