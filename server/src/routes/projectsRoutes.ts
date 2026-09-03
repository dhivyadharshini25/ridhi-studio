import { Router } from 'express';
import {
  listProjects, getProject, updateProjectStatus, addProjectUpdate,
} from '../controllers/projectsController';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(requireAuth);
router.get('/', listProjects);
router.get('/:id', getProject);
router.put('/:id', requireRole('ADMIN'), updateProjectStatus);
router.post('/:id/updates', addProjectUpdate); // admin adds progress notes; customer replies allowed too

export default router;
