require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const result = await Vehicle.updateMany(
    {},
    { $set: { lastTripDistance: 10 } }
  );
  console.log(`${result.modifiedCount} véhicule(s) mis à jour`);
  mongoose.disconnect();
});
