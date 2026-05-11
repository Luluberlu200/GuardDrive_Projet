# GuardDrive

Application web mobile-first de supervision de véhicule. Permet au conducteur de surveiller et contrôler son véhicule à distance.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | CSS custom properties (dark/light theme) |
| Backend | Node.js + Express 5 |
| Base de données | MongoDB Atlas (via Mongoose) |
| Authentification | JWT (JSON Web Tokens) |
| Carte | Leaflet + React-Leaflet |
| Géolocalisation | API `navigator.geolocation` |
| Météo | Open-Meteo API (gratuite, sans clé) |
| Géocodage | Nominatim / OpenStreetMap |

---

## Prérequis

- Node.js v18+
- npm v9+
- Un compte MongoDB Atlas avec une base de données créée
- Fichier `.env` configuré dans `backend/`

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd GuardDrive
```

### 2. Installer les dépendances frontend

```bash
npm install
```

### 3. Installer les dépendances backend

```bash
cd backend
npm install
cd ..
```

### 4. Configurer les variables d'environnement

Créer le fichier `backend/.env` :

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=votre_secret_jwt
PORT=5000
```

---

## Lancer le projet

Le projet nécessite **deux terminaux** ouverts simultanément.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Le serveur Express démarre sur `http://localhost:5000`

### Terminal 2 — Frontend

```bash
npm run start
```

L'application Vite démarre sur `http://localhost:8000`

---

## Structure du projet

```
GuardDrive/
├── backend/
│   ├── models/
│   │   ├── Alert.js         # Modèle Mongoose alerte
│   │   ├── User.js          # Modèle Mongoose utilisateur
│   │   └── Vehicle.js       # Modèle Mongoose véhicule
│   ├── routes/
│   │   ├── auth.js          # Register / Login
│   │   ├── alert.js         # CRUD alertes
│   │   └── vehicle.js       # CRUD véhicules
│   ├── middleware/
│   │   └── auth.js          # Middleware vérification JWT
│   ├── .env                 # Variables d'environnement (non versionné)
│   └── index.js             # Point d'entrée Express
│
├── src/
│   ├── components/
│   │   └── HoneycombBg.tsx  # Fond hexagonal SVG animé
│   ├── layouts/
│   │   └── MainLayout.tsx   # Layout avec navbar mobile
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Localisation.tsx
│   │   ├── Alerts.tsx
│   │   ├── VehicleState.tsx
│   │   └── Settings.tsx
│   ├── styles/
│   │   ├── layout.css       # Variables CSS globales (thème dark/light)
│   │   ├── dashboard.css
│   │   ├── alerts.css
│   │   ├── localisation.css
│   │   └── ...
│   ├── types/
│   │   └── alert.ts         # Types TypeScript partagés
│   └── main.tsx             # Point d'entrée React
│
├── Instructions/            # Fichiers de spécification par page
│   ├── globales.instructions.md
│   ├── alertes.instructions.md
│   └── ...
└── README.md
```

---

## Fonctionnalités

### Authentification
- Inscription avec nom, email, mot de passe
- Connexion avec génération de token JWT
- Token stocké en `localStorage`
- Routes protégées côté backend (middleware JWT)
- Routes protégées côté frontend (redirection si non connecté)

### Dashboard
- Vue synthétique de l'état du véhicule
- Alertes récentes (3 dernières)
- Indicateurs rapides : carburant, batterie, verrouillage
- Météo locale via Open-Meteo

### Localisation
- Carte interactive Leaflet centrée sur le véhicule
- Position de l'utilisateur en temps réel (`watchPosition`)
- Marqueurs différenciés (véhicule / utilisateur)
- Boutons : klaxonner, allumer les phares
- Géocodage inverse : affichage de l'adresse

### État du véhicule
- Niveau de carburant
- Niveau de batterie
- Pression des pneus
- Température intérieure
- Dates de révision (dernière / prochaine)

### Alertes
- Historique des alertes par onglet (Actives / Archivées)
- Filtres par type : Intrusion, Warning, Info
- Indicateur lu / non lu (point coloré)
- Actions : Voir détail, Marquer comme lu, Archiver, Désarchiver, Supprimer
- Rafraîchissement automatique toutes les 30 secondes
- Confirmation avant suppression

### Paramètres
- Ajouter / supprimer un véhicule
- Changer le thème (dark / light)

---

## API Endpoints

Toutes les routes (sauf auth) nécessitent le header :
```
Authorization: Bearer <token>
```

### Auth

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter |

### Alertes

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/alerts` | Lister les alertes |
| POST | `/api/alerts` | Créer une alerte |
| PATCH | `/api/alerts/:id/read` | Marquer comme lue |
| PATCH | `/api/alerts/:id/archive` | Archiver |
| PATCH | `/api/alerts/:id/unarchive` | Désarchiver |
| DELETE | `/api/alerts/:id` | Supprimer |

### Véhicules

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/vehicles` | Lister les véhicules |
| POST | `/api/vehicles` | Ajouter un véhicule |
| DELETE | `/api/vehicles/:id` | Supprimer un véhicule |

---

## Système de thème

Le thème est géré via des variables CSS dans `src/styles/layout.css`.

Les variables `--t-*` et `--couleur-*` changent selon la classe `.dark` ou `.light` appliquée sur `<body>`.

Le choix est persisté dans `localStorage` via la page Paramètres.

---

## Workflow Git

```
main          ← production stable
  └── develop ← intégration continue
        ├── feature/auth
        ├── feature/dashboard
        ├── feature/localisation
        ├── feature/alert-page
        └── feature/settings
```

Chaque fonctionnalité est développée sur une branche `feature/*`, mergée dans `develop` une fois terminée, puis `develop` est mergé dans `main` pour les releases.

---

## Fichiers d'instructions

Le dossier `Instructions/` contient des fichiers Markdown de spécification rédigés avant le développement de chaque page. Ils décrivent :

- L'objectif de la page
- Le contenu attendu (composants, données)
- La structure UI (layout, cards, actions)
- Les comportements (chargement, erreurs, cas vides)
- Le format des données / API

Ces fichiers ont servi de base pour guider le développement assisté par IA.
