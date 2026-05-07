require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

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

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000, family: 4 })
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(process.env.PORT || 3000, () =>
      console.log(`API sur http://localhost:${process.env.PORT || 3000}`)
    );
  })
  .catch((err) => {
    console.error('\n❌ Connexion MongoDB échouée :', err.message);
    if (err.code === 'ECONNREFUSED' || err.code === 'querySrv') {
      console.error('→ Vérifie que ton IP est autorisée sur MongoDB Atlas (Network Access)');
      console.error('→ Ou que ton DNS supporte les requêtes SRV (essaie DNS 8.8.8.8)');
    }
    process.exit(1);
  });
