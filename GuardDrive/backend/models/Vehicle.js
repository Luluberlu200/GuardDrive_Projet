const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Mon véhicule' },
  fuel: { type: Number, default: 80 },
  battery: { type: Number, default: 90 },
  lock: { type: String, enum: ['locked', 'unlocked'], default: 'locked' },
  tirePressure: { type: Number, default: 2.3 },
  temperature: { type: Number, default: 21 },
  lastService: { type: String, default: '2024-10-01' },
  nextService: { type: String, default: '2025-04-01' },
  lat: { type: Number, default: 48.8566 },
  lng: { type: Number, default: 2.3522 },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
