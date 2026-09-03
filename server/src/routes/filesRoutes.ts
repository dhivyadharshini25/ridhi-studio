import { Router } from 'express';
import { uploadFile, listMyFiles, downloadFile, deleteFile } from '../controllers/filesController';
import { requireAuth } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.use(requireAuth);
router.post('/', upload.single('file'), uploadFile);
router.get('/', listMyFiles);
router.get('/:id/download', downloadFile);
router.delete('/:id', deleteFile);

export default router;
