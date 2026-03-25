const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['doctor', 'patient'], required: true },
    message: { type: String, required: true, maxLength: 2000 },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const chatSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true
    },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema],
    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', chatSchema);
