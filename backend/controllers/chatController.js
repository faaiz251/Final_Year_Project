const Chat = require('../models/Chat');
const Appointment = require('../models/Appointment');

/**
 * Send Message
 */
exports.sendMessage = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    if (message.length > 2000) {
      return res.status(400).json({ message: 'Message too long (max 2000 chars)' });
    }

    // Get appointment to verify access
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify user is patient or doctor of this appointment
    const isPatient = appointment.patient.toString() === req.user._id.toString();
    const isDoctor = appointment.doctor.toString() === req.user._id.toString();

    if (!isPatient && !isDoctor) {
      return res.status(403).json({ message: 'Not authorized to chat' });
    }

    // Get or create chat
    let chat = await Chat.findOne({ appointment: appointmentId });

    if (!chat) {
      chat = await Chat.create({
        appointment: appointmentId,
        patient: appointment.patient,
        doctor: appointment.doctor,
        messages: []
      });
    }

    // Add message
    const messageObj = {
      sender: req.user._id,
      senderRole: isDoctor ? 'doctor' : 'patient',
      message: message.trim(),
      isRead: false,
      createdAt: new Date()
    };

    chat.messages.push(messageObj);
    chat.lastMessageAt = new Date();
    await chat.save();

    // Populate sender info
    await chat.populate('messages.sender', 'name email');

    const sentMessage = chat.messages[chat.messages.length - 1];

    res.status(201).json({
      message: 'Message sent',
      data: {
        _id: sentMessage._id,
        sender: sentMessage.sender,
        senderRole: sentMessage.senderRole,
        message: sentMessage.message,
        isRead: sentMessage.isRead,
        createdAt: sentMessage.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

/**
 * Get Chat Messages (Paginated)
 */
exports.getMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const page = parseInt(req.query.page) || 1;

    // Get appointment to verify access
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify access
    const isPatient = appointment.patient.toString() === req.user._id.toString();
    const isDoctor = appointment.doctor.toString() === req.user._id.toString();

    if (!isPatient && !isDoctor && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get chat
    let chat = await Chat.findOne({ appointment: appointmentId });

    if (!chat) {
      return res.json({ messages: [], total: 0, limit, page });
    }

    // Paginate messages
    const totalMessages = chat.messages.length;
    const skip = (page - 1) * limit;
    const messages = chat.messages.slice(skip, skip + limit);

    res.json({
      messages,
      total: totalMessages,
      limit,
      page,
      hasMore: skip + limit < totalMessages
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

/**
 * Mark Message as Read
 */
exports.markAsRead = async (req, res) => {
  try {
    const { appointmentId, messageId } = req.params;

    const chat = await Chat.findOne({ appointment: appointmentId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only recipient can mark as read
    const isRecipient = message.sender.toString() !== req.user._id.toString();
    if (!isRecipient) {
      return res.status(403).json({ message: 'Cannot mark own message as read' });
    }

    if (!message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      await chat.save();
    }

    res.json({ message: 'Message marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as read' });
  }
};

/**
 * Get Unread Message Count
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const chat = await Chat.findOne({ appointment: appointmentId });
    if (!chat) {
      return res.json({ unreadCount: 0 });
    }

    const unreadCount = chat.messages.filter(
      msg => !msg.isRead && msg.sender.toString() !== req.user._id.toString()
    ).length;

    res.json({ unreadCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch unread count' });
  }
};
