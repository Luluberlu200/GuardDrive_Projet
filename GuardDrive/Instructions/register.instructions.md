# Instructions - Page Register

## 🎯 Objectif

Permettre à un nouvel utilisateur de créer un compte GuardDrive de manière simple, claire et rassurante.

L’objectif est d’offrir une inscription fluide, adaptée au mobile, tout en préparant l’accès futur à l’application.

---

## 📦 Contenu attendu

La page doit contenir :

- Logo ou nom de l’application
- Titre principal
- Champ nom
- Champ email
- Champ mot de passe
- Champ confirmation du mot de passe
- Bouton d’inscription
- Lien vers la page Login
- Message d’erreur si le formulaire est invalide

Optionnel :
- Bouton afficher / masquer mot de passe
- Texte d’introduction court

---

## 🧱 Structure UI

Mobile-first :

- Header ou zone branding
    - Logo / nom GuardDrive
    - Sous-titre court
- Formulaire centré verticalement
    - Input nom
    - Input email
    - Input mot de passe
    - Input confirmation mot de passe
    - Bouton Register
- Footer léger
    - Lien "J’ai déjà un compte"

Layout :
- 1 colonne
- Formulaire lisible et compact
- Espacement cohérent
- Bouton principal bien visible

---

## ⚙️ Comportements

- Saisie des champs nom, email, mot de passe et confirmation
- Bouton d’inscription désactivé si les champs sont incomplets
- Au submit :
    - affichage d’un loader sur le bouton
    - simulation de création de compte
- Si succès :
    - redirection vers Login ou Dashboard
- Si échec :
    - affichage d’un message d’erreur
- Possibilité d’afficher / masquer le mot de passe

---

## ⚠️ Validation / Erreurs

Règles de validation :

- Nom obligatoire
- Email obligatoire
- Email au bon format
- Mot de passe obligatoire
- Confirmation obligatoire
- Mot de passe et confirmation identiques
- Longueur minimale du mot de passe (ex : 6 caractères)

Messages d’erreur possibles :

- "Nom requis"
- "Email requis"
- "Format d’email invalide"
- "Mot de passe requis"
- "Confirmation requise"
- "Les mots de passe ne correspondent pas"
- "Le mot de passe doit contenir au moins 6 caractères"

Les erreurs doivent être affichées clairement sous les champs concernés ou sous le formulaire.

---

## 🔌 Données / API

⚠️ Données mockées

Structure attendue :

```ts
type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};