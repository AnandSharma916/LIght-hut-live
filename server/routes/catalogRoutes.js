import express from 'express';
import { getCatalog } from '../controllers/catalogController.js';

const router = express.Router();

// GET /api/catalog - Dedicated catalog endpoint for /catalog page
router.get('/', getCatalog);

export default router;
