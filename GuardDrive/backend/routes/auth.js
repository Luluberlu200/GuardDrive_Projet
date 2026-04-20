const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Alert = require('../models/Alert');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Champs manquants' });

  if (await User.findOne({ email }))
    return res.status(409).json({ message: 'Email déjà utilisé' });

  const user = await User.create({ name, email, password });
  await Vehicle.create({ userId: user._id });
  await Alert.insertMany([
    { userId: user._id, type: 'intrusion', message: 'Tentative d\'accès non autorisée détectée.' },
    { userId: user._id, type: 'warning',   message: 'Niveau de carburant faible (15%).' },
    { userId: user._id, type: 'info',      message: 'Prochain entretien prévu dans 12 jours.' },
  ]);

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

router.get('/me', require('../middleware/auth'), async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user);
});

router.patch('/me', require('../middleware/auth'), async (req, res) => {
  const { name, email } = req.body;
  const update = {};
  if (name) update.name = name;
  if (email) update.email = email;

  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: req.userId } });
    if (existing) return res.status(409).json({ message: 'Email déjà utilisé' });
  }

  const user = await User.findByIdAndUpdate(req.userId, update, { new: true }).select('-password');
  res.json({ id: user._id, name: user.name, email: user.email });
});

module.exports = router;
