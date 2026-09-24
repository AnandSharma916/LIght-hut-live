import express from 'express';
import {
  uploadFile,
  uploadMultiple,
  getMediaLibrary,
  deleteMedia,
} from '../controllers/uploadController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protectAdmin, upload.single('file'), uploadFile);
router.post('/multiple', protectAdmin, upload.array('files', 10), uploadMultiple);
router.get('/media', protectAdmin, getMediaLibrary);
router.delete('/media/:id', protectAdmin, deleteMedia);

export default router;
