# Instructions - Page Dashboard

## 🎯 Objectif

Afficher un aperçu global du véhicule de l’utilisateur de manière claire, rapide et mobile-first.

Le dashboard doit permettre en un coup d’œil de connaître :
- l’état général du véhicule
- les informations critiques (carburant, batterie, verrouillage)
- les alertes récentes

---

## 📦 Contenu attendu

Le dashboard doit contenir :

- Indicateur niveau carburant
- Indicateur batterie
- Statut verrouillage (verrouillé / déverrouillé)
- Liste des alertes récentes (max 3)
- Nom du véhicule (optionnel)
- Dernière mise à jour (timestamp)

---

## 🧱 Structure UI

Mobile-first :

- Header (nom véhicule + icône statut)
- Section indicateurs (cards)
    - FuelCard
    - BatteryCard
    - LockStatusCard
- Section alertes
    - Liste verticale
    - 3 dernières alertes
- Bottom navbar (navigation globale)

Layout :
- 1 colonne (mobile)
- Cards avec bord arrondi
- Espacement cohérent (padding 16px)

---

## ⚙️ Comportements

- Chargement initial avec loader (skeleton ou spinner)
- Rafraîchissement des données (simulé pour l’instant)
- Animation légère sur les indicateurs (ex : progression carburant)
- Si aucune alerte → afficher "Aucune alerte"
- Click sur une alerte → redirection vers page Alertes

---

## 🔌 Données / API

⚠️ Actuellement mockées

Structure attendue :

```ts
{
  fuelLevel: number,        // %
  batteryLevel: number,     // %
  isLocked: boolean,
  alerts: [
    {
      id: string,
      type: "warning" | "intrusion" | "info",
      message: string,
      date: string
    }
  ],
  lastUpdate: string
}