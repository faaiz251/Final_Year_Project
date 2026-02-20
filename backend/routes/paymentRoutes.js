const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createPaymentOrder,
  verifyPayment,
  markOfflinePayment,
} = require('../controllers/paymentController');

const router = express.Router();

// Create Razorpay order for online payment
router.post('/create-order', authMiddleware, createPaymentOrder);

// Verify payment and update appointment
router.post('/verify', authMiddleware, verifyPayment);

// Mark appointment as offline payment
router.post('/offline', authMiddleware, markOfflinePayment);

module.exports = router;
