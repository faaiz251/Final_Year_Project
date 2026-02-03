const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['medicine', 'equipment', 'other'], default: 'medicine' },
    quantity: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 0 },
    unit: { type: String, default: 'pcs' },
    expiryDate: { type: Date },
    supplier: { type: String },
    status: { type: String, enum: ['in_stock', 'low_stock', 'out_of_stock'], default: 'in_stock' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);

