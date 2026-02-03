const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'patient', 'staff'],
      default: 'patient',
      required: true,
    },
    phone: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    dateOfBirth: { type: Date },
    address: { type: String },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    specialization: { type: String }, // for doctors
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    // Simple staff/doctor extra fields
    schedule: [
      {
        day: String,
        shift: String,
        isOnDuty: { type: Boolean, default: false },
      },
    ],
    attendance: [
      {
        date: Date,
        status: { type: String, enum: ['present', 'absent'], default: 'present' },
      },
    ],
  },
  { timestamps: true }
);

// Ensure phone is unique when present (don't index null/absent values)
userSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $exists: true, $ne: null } } }
);

// Remove explicit null/empty phone fields before saving to avoid unique-null conflicts
userSchema.pre('validate', function (next) {
  if (!this.phone) {
    this.phone = undefined;
  }
  // also guard against legacy `phoneNumber` field
  if (!this.phoneNumber) {
    this.phoneNumber = undefined;
  }
  next();
});

module.exports = mongoose.model('User', userSchema);

