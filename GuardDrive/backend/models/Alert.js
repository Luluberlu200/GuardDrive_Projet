const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['intrusion', 'warning', 'info'], required: true },
  message:   { type: String, required: true },
  status:    { type: String, enum: ['active', 'archived'], default: 'active' },
  date:      { type: String, default: () => new Date().toISOString() },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null },
  ruleKey:   { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);
