import express from 'express';
import {
  register, login, logout, getMe,
  updateProfile, updatePassword, updateAddresses, deleteAddress,
} from '../controllers/authController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);
router.put('/addresses', protect, updateAddresses);
router.delete('/addresses/:addressId', protect, deleteAddress);

export default router;
