const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { getProfile, updateProfile, listDoctors } = require('../controllers/userController');

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);

router.put(
  '/profile',
  authMiddleware,
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('gender').optional().isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  ],
  updateProfile
);

// Public list of active doctors for booking (authenticated users)
router.get('/doctors', authMiddleware, listDoctors);

module.exports = router;

