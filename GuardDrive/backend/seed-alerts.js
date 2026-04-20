require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Alert = require('./models/Alert');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find();
  for (const user of users) {
    const existing = await Alert.countDocuments({ userId: user._id });
    if (existing === 0) {
      await Alert.insertMany([
        { userId: user._id, type: 'intrusion', message: 'Tentative d\'accès non autorisée détectée.' },
        { userId: user._id, type: 'warning',   message: 'Niveau de carburant faible (15%).' },
        { userId: user._id, type: 'info',      message: 'Prochain entretien prévu dans 12 jours.' },
      ]);
      console.log(`✓ Alertes créées pour ${user.email}`);
    } else {
      console.log(`— ${user.email} a déjà des alertes, ignoré`);
    }
  }
  mongoose.disconnect();
});
