# Instructions - Page Login

## 🎯 Objectif

Permettre à l’utilisateur de se connecter à son compte GuardDrive de manière simple, rapide et sécurisée.

L’objectif est d’offrir un point d’entrée clair vers l’application tout en respectant l’approche mobile-first.

---

## 📦 Contenu attendu

La page doit contenir :

- Logo ou nom de l’application
- Titre principal
- Champ email
- Champ mot de passe
- Bouton de connexion
- Lien vers la page Register
- Message d’erreur si identifiants invalides

Optionnel :
- Bouton afficher / masquer mot de passe
- Texte d’accueil court

---

## 🧱 Structure UI

Mobile-first :

- Header ou zone branding
    - Logo / nom GuardDrive
    - Sous-titre court
- Formulaire centré verticalement
    - Input email
    - Input mot de passe
    - Bouton Login
- Footer léger
    - Lien "Créer un compte"

Layout :
- 1 colonne
- Formulaire compact et lisible
- Espacement régulier
- Bouton principal bien visible

---

## ⚙️ Comportements

- Saisie des champs email et mot de passe
- Bouton de connexion désactivé si les champs sont vides
- Au submit :
    - affichage loader sur le bouton
    - simulation de connexion
- Si succès :
    - redirection vers Dashboard
- Si échec :
    - affichage d’un message d’erreur
- Possibilité d’afficher / masquer le mot de passe

---

## ⚠️ Validation / Erreurs

Règles de validation :

- Email obligatoire
- Email au bon format
- Mot de passe obligatoire
- Mot de passe non vide

Messages d’erreur possibles :

- "Email requis"
- "Format d’email invalide"
- "Mot de passe requis"
- "Identifiants invalides"

Les erreurs doivent être affichées de manière claire sous les champs ou sous le formulaire.

---

## 🔌 Données / API

⚠️ Données mockées

Structure attendue :

```ts
type LoginPayload = {
  email: string;
  password: string;
};