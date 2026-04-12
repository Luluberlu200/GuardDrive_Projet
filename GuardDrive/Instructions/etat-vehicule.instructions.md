# Instructions - Page État du véhicule

## 🎯 Objectif

Afficher de manière détaillée l’état du véhicule afin de permettre à l’utilisateur de surveiller les paramètres essentiels.

L’objectif est de fournir une vision claire, lisible et rapide de l’état technique du véhicule.

---

## 📦 Contenu attendu

La page doit contenir :

- Niveau de carburant (%)
- Niveau de batterie (%)
- Pression des pneus (par roue ou globale)
- Température intérieure
- Date de la dernière révision
- Date de la prochaine révision

Optionnel :
- Statut global du véhicule (OK / Warning)

---

## 🧱 Structure UI

Mobile-first :

- Header (titre "État du véhicule")
- Liste de sections (cards)

Sections :

1. 🔋 Batterie
2. ⛽ Carburant
3. 🛞 Pneus
4. 🌡 Température
5. 🛠 Révision

Chaque section = Card contenant :
- Titre
- Valeur principale
- Indicateur visuel (barre, couleur, icône)

Layout :
- 1 colonne
- Cards espacées (padding 16px)
- Scroll vertical

---

## ⚙️ Comportements

- Chargement avec loader
- Mise à jour simulée des données
- Changement de couleur selon état :
  - Vert = OK
  - Orange = warning
  - Rouge = critique
- Animation légère sur les indicateurs (ex: barre de progression)
- Si donnée absente → afficher "Non disponible"

---

## 🔌 Données / API

⚠️ Données mockées

Structure :

```ts
type VehicleStatus = {
  fuelLevel: number;        // %
  batteryLevel: number;     // %
  tirePressure: number[];   // ex: [2.2, 2.1, 2.3, 2.2]
  temperature: number;      // °C
  lastServiceDate: string;
  nextServiceDate: string;
};