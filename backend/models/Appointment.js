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
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    doctorNotes: { type: String },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // TREATMENT FIELDS (NEW)
    treatment: {
      treatmentName: { type: String },
      treatmentStartDate: { type: Date },
      treatmentDurationDays: { type: Number },
      treatmentEndDate: { type: Date },
      treatmentNotes: { type: String },
      treatmentStatus: {
        type: String,
        enum: ['not-started', 'active', 'completed', 'paused'],
        default: 'not-started'
      }
    }
  },
  { timestamps: true }
);

// Virtual for remaining days calculation
appointmentSchema.virtual('remainingDays').get(function() {
  if (!this.treatment.treatmentEndDate) return null;
  const today = new Date();
  const endDate = new Date(this.treatment.treatmentEndDate);
  const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysRemaining);
});

// Ensure virtuals are included in JSON
appointmentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

