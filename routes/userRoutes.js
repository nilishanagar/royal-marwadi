import express from 'express';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import protect from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

router.use(protect, admin); // All user management routes are admin-only

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
