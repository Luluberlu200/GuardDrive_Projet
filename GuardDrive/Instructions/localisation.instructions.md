# Instructions - Page Localisation

## 🎯 Objectif

Permettre à l’utilisateur de localiser son véhicule en temps réel et d’interagir à distance avec celui-ci.

L’objectif est de fournir une interface simple et rapide pour :
- visualiser la position du véhicule
- effectuer des actions rapides (klaxonner, allumer les phares)

---

## 📦 Contenu attendu

La page doit contenir :

- Carte interactive
- Position du véhicule (marker)
- Bouton "Klaxonner"
- Bouton "Allumer les phares"
- Statut de connexion (optionnel)

---

## 🧱 Structure UI

Mobile-first :

- Header (titre "Localisation")
- Carte en plein écran (ou grande zone principale)
- Overlay avec actions (en bas de l’écran)

Structure :

- MapContainer (100% largeur)
- Marker position véhicule
- Control panel (fixed bottom) :
    - Bouton Klaxonner
    - Bouton Phares

Layout :
- Carte occupe la majorité de l’écran
- Boutons accessibles avec le pouce (bottom UI)

---

## ⚙️ Comportements

- Chargement initial avec loader
- Affichage position mock du véhicule
- Possibilité de zoom / déplacer la carte
- Click sur "Klaxonner" → affiche une notification (toast)
- Click sur "Phares" → toggle ON/OFF visuel
- Simulation d’un déplacement du véhicule (optionnel)

---

## 🔌 Données / API

⚠️ Données mockées

Structure :

```ts
type VehicleLocation = {
  latitude: number;
  longitude: number;
  lastUpdate: string;
};