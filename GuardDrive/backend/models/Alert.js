const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['intrusion', 'warning', 'info'], required: true },
  message:   { type: String, required: true },
  status:    { type: String, enum: ['active', 'archived'], default: 'active' },
  date:      { type: Date, default: Date.now },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', default: null },
  ruleKey:   { type: String, default: null },
  read:      { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);
