# Instructions - Page Alertes

## 🎯 Objectif

Permettre à l’utilisateur de consulter et gérer les alertes liées à son véhicule.

L’objectif est d’offrir une vision claire des événements importants :
- sécurité (intrusion)
- anomalies techniques
- informations diverses

---

## 📦 Contenu attendu

La page doit contenir :

- Liste des alertes
- Type d’alerte (intrusion, warning, info)
- Message descriptif
- Date et heure
- Statut (active / archivée)

Actions disponibles :
- Voir détail
- Archiver
- Supprimer

---

## 🧱 Structure UI

Mobile-first :

- Header (titre "Alertes")
- Liste verticale scrollable

Chaque alerte (card ou item) contient :
- Icône selon type
- Message principal
- Date
- Badge statut

Actions :
- Bouton "Voir"
- Bouton "Archiver"
- Bouton "Supprimer"

---

## ⚙️ Comportements

- Chargement avec loader (spinner ou skeleton)
- Scroll pour afficher toutes les alertes
- Click sur "Voir" → ouvre détail (modal ou nouvelle page)
- Click sur "Archiver" → change le statut en "archived"
- Click sur "Supprimer" → supprime l’alerte
- Confirmation avant suppression
- Si aucune alerte → afficher "Aucune alerte"

---

## 🔌 Données / API

⚠️ Données mockées

Structure :

```ts
type Alert = {
  id: string;
  type: "intrusion" | "warning" | "info";
  message: string;
  date: string;
  status: "active" | "archived";
};