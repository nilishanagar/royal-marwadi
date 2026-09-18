import express from 'express';
import {
  createOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus, updatePaymentStatus, getOrderStats,
} from '../controllers/orderController.js';
import protect from '../middleware/auth.js';
import admin from '../middleware/admin.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/stats', protect, admin, getOrderStats);
router.get('/:id', protect, getOrderById);

router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id/pay', protect, updatePaymentStatus);

export default router;
