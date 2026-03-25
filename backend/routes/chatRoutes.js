const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const  authMiddleware  = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Send message
router.post('/:appointmentId/messages', chatController.sendMessage);

// Get messages
router.get('/:appointmentId/messages', chatController.getMessages);

// Mark as read
router.patch('/:appointmentId/messages/:messageId/read', chatController.markAsRead);

// Get unread count
router.get('/:appointmentId/unread', chatController.getUnreadCount);

module.exports = router;
