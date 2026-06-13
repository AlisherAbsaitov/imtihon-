import { Router } from 'express';
import { getStats } from '../controllers/stats.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, admin, getStats);

export default router;
