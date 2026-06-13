import { Router } from 'express';
import {
  updateProfile,
  getUsers,
  deleteUser,
} from '../controllers/user.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = Router();

router.put('/profile', protect, updateProfile);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

export default router;
