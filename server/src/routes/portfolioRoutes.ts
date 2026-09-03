import { Router } from 'express';
import {
  listPortfolio, getPortfolioItem, createPortfolioItem, updatePortfolioItem, deletePortfolioItem, listPortfolioCategories,
} from '../controllers/portfolioController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', listPortfolio);
router.get('/categories', listPortfolioCategories);
router.get('/:id', getPortfolioItem);
router.post('/', requireAuth, requireRole('ADMIN'), createPortfolioItem);
router.put('/:id', requireAuth, requireRole('ADMIN'), updatePortfolioItem);
router.delete('/:id', requireAuth, requireRole('ADMIN'), deletePortfolioItem);

export default router;
