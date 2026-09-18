import express from 'express';
import {
  getProducts, getProduct, getFeaturedProducts,
  createProduct, updateProduct, deleteProduct, addReview,
} from '../controllers/productController.js';
import protect from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);

router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

router.post('/:id/reviews', protect, addReview);

export default router;
