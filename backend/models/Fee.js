const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    disease: { type: String, required: true, unique: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    amount: { type: Number, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', feeSchema);
