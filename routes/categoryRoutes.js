import express from 'express';
import {
  getCategories, getCategory, createCategory, updateCategory, deleteCategory,
} from '../controllers/categoryController.js';
import protect from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategory);

router.post('/', protect, admin, upload.single('image'), createCategory);
router.put('/:id', protect, admin, upload.single('image'), updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
