const router = require('express').Router();
const protect = require('../middleware/auth');
const Vehicle = require('../models/Vehicle');

router.get('/', protect, async (req, res) => {
  const vehicles = await Vehicle.find({ userId: req.userId });
  res.json(vehicles);
});

router.post('/', protect, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Nom requis' });
  const vehicle = await Vehicle.create({ userId: req.userId, name });
  res.status(201).json(vehicle);
});

router.delete('/:id', protect, async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.params.id, userId: req.userId });
  if (!vehicle) return res.status(404).json({ message: 'Véhicule introuvable' });
  await vehicle.deleteOne();
  res.json({ message: 'Véhicule supprimé' });
});

router.patch('/:id/location', protect, async (req, res) => {
  const { lat, lng } = req.body;
  if (lat == null || lng == null) return res.status(400).json({ message: 'lat et lng requis' });
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { lat, lng },
    { new: true }
  );
  if (!vehicle) return res.status(404).json({ message: 'Véhicule introuvable' });
  res.json({ lat: vehicle.lat, lng: vehicle.lng });
});

router.patch('/:id/lock', protect, async (req, res) => {
  const vehicle = await Vehicle.findOne({ _id: req.params.id, userId: req.userId });
  if (!vehicle) return res.status(404).json({ message: 'Véhicule introuvable' });
  vehicle.lock = vehicle.lock === 'locked' ? 'unlocked' : 'locked';
  await vehicle.save();
  res.json({ lock: vehicle.lock });
});

module.exports = router;
