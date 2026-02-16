# GuardDrive – Global Project Instructions

## Vision du projet

GuardDrive est une application web mobile-first de supervision de véhicule.

L’objectif est d’offrir au conducteur :
- Sécurité
- Sérénité
- Contrôle à distance
- Centralisation des informations essentielles du véhicule

L’application permet de surveiller :

- Niveau de carburant
- Niveau de batterie
- Localisation GPS en temps réel
- Verrouillage du véhicule
- Date des révisions
- Alertes techniques
- Tentatives d’intrusion

GuardDrive vise à créer un lien de confiance entre le conducteur et son véhicule.

---

## Identité visuelle

- Approche mobile-first
- Interface moderne, épurée et intuitive
- Thème sombre dominant
- Touches de rose clair (accent color)
- Design technologique et élégant

Public cible :
Tous profils de conducteurs (jeunes actifs, familles, seniors).

---

## Architecture fonctionnelle

L'application est composée des pages suivantes :

### 1️ - Authentification
- Login
- Register
- Gestion JWT
- Protection des routes

---

### 2️ - Dashboard (Page d’accueil)
Affichage synthétique :
- Statut du véhicule
- Alertes récentes
- Indicateurs rapides (carburant, batterie, verrouillage)

---

### 3️ - Page Localisation
- Carte interactive (zoom possible)
- Affichage GPS du véhicule
- Bouton klaxonner
- Bouton allumer les phares

---

### 4️ - Page État du véhicule
- Niveau carburant
- Batterie
- Pression des pneus
- Température intérieure
- Dernière révision
- Prochaine révision

---

### 5️ - Page Paramètres
- Ajouter un véhicule
- Supprimer un véhicule
- Changer le thème (dark / light)

---

### 6️ - Page Alertes
- Historique des alertes
- Voir détail
- Archiver
- Supprimer
