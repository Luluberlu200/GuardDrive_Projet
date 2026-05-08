const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  date:     { type: String, default: '' },
  distance: { type: Number, default: 0 },
  duration: { type: Number, default: 0 },
  from:     { type: String, default: '' },
  to:       { type: String, default: '' },
}, { _id: false });

const VehicleSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, default: 'Mon véhicule' },
  plateNumber: { type: String, default: '' },
  mileage:     { type: Number, default: 0 },

  fuel:        { type: Number, default: 80 },
  battery:     { type: Number, default: 90 },
  lock:        { type: String, enum: ['locked', 'unlocked'], default: 'locked' },
  temperature: { type: Number, default: 21 },

  tirePressure: { type: Number, default: 2.3 },
  tireWear: {
    fl: { type: Number, default: 80 },
    fr: { type: Number, default: 80 },
    rl: { type: Number, default: 75 },
    rr: { type: Number, default: 75 },
  },
  tirePressureWheels: {
    fl: { type: Number, default: 2.3 },
    fr: { type: Number, default: 2.3 },
    rl: { type: Number, default: 2.2 },
    rr: { type: Number, default: 2.2 },
  },

  lastService:        { type: String, default: '' },
  nextService:        { type: String, default: '' },
  controleTechnique:  { type: String, default: '' },

  trips: { type: [TripSchema], default: [] },

  lat: { type: Number, default: 48.8566 },
  lng: { type: Number, default: 2.3522 },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
