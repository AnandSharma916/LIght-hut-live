import express from 'express';
import { login, logout, getMe, updatePassword } from '../controllers/authController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectAdmin, getMe);
router.put('/update-password', protectAdmin, updatePassword);

export default router;
