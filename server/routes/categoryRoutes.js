import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Protected Admin Routes
router.post('/', protectAdmin, createCategory);
router.put('/reorder', protectAdmin, reorderCategories);
router.put('/:id', protectAdmin, updateCategory);
router.delete('/:id', protectAdmin, deleteCategory);

export default router;
