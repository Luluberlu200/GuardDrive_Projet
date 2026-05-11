const router = require('express').Router();
const protect = require('../middleware/auth');
const Alert = require('../models/Alert');

/* GET /api/alerts?status=active|archived */
router.get('/', protect, async (req, res) => {
  const filter = { userId: req.userId };
  if (req.query.status) filter.status = req.query.status;
  const alerts = await Alert.find(filter).sort({ date: -1 });
  res.json(alerts);
});

/* POST /api/alerts – créer une alerte (capteurs, tests) */
router.post('/', protect, async (req, res) => {
  const { type, message, vehicleId } = req.body;
  const alert = await Alert.create({ userId: req.userId, type, message, vehicleId });
  res.status(201).json(alert);
});

/* PATCH /api/alerts/:id/archive */
router.patch('/:id/archive', protect, async (req, res) => {
  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status: 'archived' },
    { new: true }
  );
  res.json(alert);
});

/* PATCH /api/alerts/:id/unarchive */
router.patch('/:id/unarchive', protect, async (req, res) => {
  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status: 'active' },
    { new: true }
  );
  res.json(alert);
});

/* DELETE /api/alerts/:id */
router.delete('/:id', protect, async (req, res) => {
  await Alert.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Supprimée' });
});

module.exports = router;
