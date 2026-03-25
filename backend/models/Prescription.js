const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dosage: { type: String },
    frequency: { type: String },
    duration: { type: String },
    notes: { type: String },
  },
  { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // disease: { type: String, required: true, index: true },
    medicalRecord: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalRecord' },
    medications: [medicationSchema],
    issuedDate: { type: Date, default: Date.now, index: true },
    status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
    prescription: { type: String },
  },
  { timestamps: true }
);

// Index for efficient disease + patient queries
prescriptionSchema.index({ patient: 1, disease: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);

