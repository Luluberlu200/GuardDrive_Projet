const router = require('express').Router();
const protect = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');

router.get('/', protect, async (req, res) => {
  const vehicle = await Vehicle.findOne({ userId: req.userId });
  res.json(vehicle);
});

router.patch('/lock', protect, async (req, res) => {
  const vehicle = await Vehicle.findOne({ userId: req.userId });
  vehicle.lock = vehicle.lock === 'locked' ? 'unlocked' : 'locked';
  await vehicle.save();
  res.json({ lock: vehicle.lock });
});

module.exports = router;
