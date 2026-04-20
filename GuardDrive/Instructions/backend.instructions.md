# Instructions – Backend Express (GuardDrive API)

## 🎯 Objectif

Remplacer les données mockées du frontend par une vraie API REST Express + MongoDB.

---

## 🗂️ Structure

```
backend/
├── models/
│   ├── User.js
│   ├── Vehicle.js
│   └── Alert.js
├── routes/
│   ├── auth.js
│   ├── vehicle.js
│   └── alert.js
├── middleware/
│   └── auth.js
├── .env
└── index.js
```

---

## 📦 Installation

```bash
mkdir backend && cd backend
npm init -y
npm install express mongoose jsonwebtoken dotenv cors
```

Scripts dans `package.json` :

```json
{
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node index.js"
  }
}
```

---

## 🔐 Variables d'environnement (`.env`)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/guarddrive
JWT_SECRET=guarddrive_secret
```

---

## 🗃️ Modèles Mongoose

### `models/User.js`

```js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
```

### `models/Vehicle.js`

```js
const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Mon véhicule' },
  fuel: { type: Number, default: 80 },
  battery: { type: Number, default: 90 },
  lock: { type: String, enum: ['locked', 'unlocked'], default: 'locked' },
  tirePressure: { type: Number, default: 2.3 },
  temperature: { type: Number, default: 21 },
  lastService: { type: String, default: '2024-10-01' },
  nextService: { type: String, default: '2025-04-01' },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
```

### `models/Alert.js`

```js
const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['intrusion', 'warning', 'info'], required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  date: { type: String, default: () => new Date().toISOString() },
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);
```

---

## 🔑 Middleware JWT (`middleware/auth.js`)

```js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Non autorisé' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
};
```

---

## 🛣️ Routes

### `routes/auth.js`

```js
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Champs manquants' });

  if (await User.findOne({ email }))
    return res.status(409).json({ message: 'Email déjà utilisé' });

  const user = await User.create({ name, email, password });
  await Vehicle.create({ userId: user._id });

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

module.exports = router;
```

### `routes/vehicle.js`

```js
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
```

### `routes/alert.js`

```js
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
```

---

## 🚀 Entry point (`index.js`)

```js
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
```

---

## 🔁 Connexion frontend

### Proxy Vite (`vite.config.ts`)

```ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    proxy: { '/api': 'http://localhost:3000' },
  },
});
```

### Service API (`src/services/api.ts`)

```ts
const BASE = '/api';
const h = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
});

export const api = {
  post: (path: string, body: object) =>
    fetch(BASE + path, { method: 'POST', headers: h(), body: JSON.stringify(body) }).then(r => r.json()),
  get: (path: string) =>
    fetch(BASE + path, { headers: h() }).then(r => r.json()),
  patch: (path: string, body?: object) =>
    fetch(BASE + path, { method: 'PATCH', headers: h(), body: body ? JSON.stringify(body) : undefined }).then(r => r.json()),
  delete: (path: string) =>
    fetch(BASE + path, { method: 'DELETE', headers: h() }).then(r => r.json()),
};
```

---

## ✅ Checklist

- [ ] Créer `backend/` et installer les dépendances
- [ ] Créer `.env` avec `MONGO_URI` et `JWT_SECRET`
- [ ] Copier tous les fichiers `models/`, `routes/`, `middleware/`, `index.js`
- [ ] Lancer MongoDB (`mongod`) ou utiliser MongoDB Atlas
- [ ] `npm run dev` dans `backend/` (port 3000)
- [ ] `npm start` dans le frontend (port 8000)
- [ ] Tester `GET http://localhost:3000/health`
- [ ] Ajouter le proxy dans `vite.config.ts`
- [ ] Créer `src/services/api.ts` et brancher `AuthContext`
