# Instructions - Page Paramètres

## 🎯 Objectif

Permettre à l’utilisateur de personnaliser son expérience GuardDrive et de gérer les options principales liées à son compte et à son véhicule.

L’objectif est de centraliser les réglages utiles dans une interface simple, claire et accessible sur mobile.

---

## 📦 Contenu attendu

La page doit contenir :

- Informations utilisateur minimales
    - nom
    - email
- Section thème
    - changer thème (dark / light)
- Section véhicule
    - afficher le véhicule actuel
    - ajouter un véhicule
    - supprimer un véhicule
- Section compte
    - bouton déconnexion

Optionnel :
- version de l’application
- préférences futures

---

## 🧱 Structure UI

Mobile-first :

- Header (titre "Paramètres")
- Sections sous forme de cards empilées verticalement

Sections :

1. Compte
    - nom
    - email

2. Apparence
    - switch ou sélecteur de thème

3. Véhicule
    - informations du véhicule actuel
    - bouton "Ajouter un véhicule"
    - bouton "Supprimer le véhicule"

4. Session
    - bouton "Se déconnecter"

Layout :
- 1 colonne
- cards espacées
- boutons accessibles facilement sur mobile
- scroll vertical

---

## ⚙️ Comportements

- Chargement initial des données mockées
- Changement de thème immédiat dans l’interface
- Click sur "Ajouter un véhicule" → ouvre formulaire ou modal
- Click sur "Supprimer le véhicule" → demande confirmation
- Click sur "Se déconnecter" → supprime la session mockée et redirige vers Login

Si aucune donnée véhicule :
- afficher "Aucun véhicule enregistré"

---

## 🔌 Données / API

⚠️ Données mockées

Structure utilisateur :

```ts
type UserSettings = {
  name: string;
  email: string;
  theme: "dark" | "light";
};