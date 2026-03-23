const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    reason: { type: String },
    disease: { type: String },
    fee: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['online', 'offline'], default: 'offline' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed', 'expired', 'no-show'],
      default: 'pending',
    },
    isCompleted: { type: Boolean, default: false }, // Doctor marks if appointment was completed
    completedAt: { type: Date }, // Timestamp when doctor marked as completed
    doctorNotes: { type: String }, // Notes from doctor after appointment
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', appointmentSchema);

