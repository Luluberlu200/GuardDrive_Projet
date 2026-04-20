const router = require('express').Router();
const protect = require('../middleware/auth');
const Alert = require('../models/Alert');

router.get('/', protect, async (req, res) => {
  const alerts = await Alert.find({ userId: req.userId }).sort({ date: -1 });
  res.json(alerts);
});

router.patch('/:id/archive', protect, async (req, res) => {
  const alert = await Alert.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status: 'archived' },
    { new: true }
  );
  res.json(alert);
});

router.delete('/:id', protect, async (req, res) => {
  await Alert.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Supprimée' });
});

module.exports = router;
