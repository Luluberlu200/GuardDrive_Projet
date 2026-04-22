require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors({ origin: 'http://localhost:8000' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicle', require('./routes/vehicle'));
app.use('/api/alerts', require('./routes/alert'));

app.get('/health', (_, res) => res.json({ status: 'ok' }));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connecté');
  app.listen(process.env.PORT || 3000, () =>
    console.log(`API sur http://localhost:${process.env.PORT || 3000}`)
  );
});
