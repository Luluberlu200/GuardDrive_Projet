# Étapes de développement — Page Alertes

## Fichiers à modifier / créer

| Fichier | Action |
|---|---|
| `src/pages/Alerts.tsx` | Modifier |
| `src/mock/alerts.mock.ts` | Créer |
| `src/styles/alerts.css` | Créer |

> Ne pas toucher : `App.tsx`, `main.tsx`, `MainLayout.tsx`, `layout.css`

---

## Étape 1 — Créer les données mockées : `src/mock/alerts.mock.ts`

```ts
export type AlertType = 'intrusion' | 'warning' | 'info';
export type AlertStatus = 'active' | 'archived';

export type Alert = {
  id: number;
  type: AlertType;
  message: string;
  date: string;
  status: AlertStatus;
};

export const mockAlerts: Alert[] = [
  {
    id: 1,
    type: 'intrusion',
    message: 'Tentative d\'intrusion détectée côté conducteur',
    date: '2026-04-13 08:42',
    status: 'active',
  },
  {
    id: 2,
    type: 'warning',
    message: 'Pression des pneus avant gauche basse',
    date: '2026-04-12 17:15',
    status: 'active',
  },
  {
    id: 3,
    type: 'info',
    message: 'Révision recommandée dans 500 km',
    date: '2026-04-11 09:00',
    status: 'active',
  },
  {
    id: 4,
    type: 'warning',
    message: 'Batterie faible (12%)',
    date: '2026-04-10 22:30',
    status: 'archived',
  },
];
```

---

## Étape 2 — Imports dans `Alerts.tsx`

```tsx
import { useState } from 'react';
import { mockAlerts, type Alert } from '../mock/alerts.mock';
import '../styles/alerts.css';
```

---

## Étape 3 — État local (dans la fonction)

```tsx
const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
const [selected, setSelected] = useState<Alert | null>(null);
```

---

## Étape 4 — Fonctions d'action

```tsx
function handleArchive(id: number) {
  setAlerts((prev) =>
    prev.map((a) => (a.id === id ? { ...a, status: 'archived' } : a))
  );
}

function handleDelete(id: number) {
  if (!confirm('Supprimer cette alerte ?')) return;
  setAlerts((prev) => prev.filter((a) => a.id !== id));
}
```

---

## Étape 5 — JSX à retourner

```tsx
return (
  <div className="alerts-page">
    <h1 className="alerts-title">Alertes</h1>

    {alerts.length === 0 && (
      <p className="alerts-empty">Aucune alerte</p>
    )}

    <ul className="alerts-list">
      {alerts.map((alert) => (
        <li key={alert.id} className={`alert-card alert-card--${alert.type}`}>
          <div className="alert-card__header">
            <span className="alert-card__badge">{alert.type}</span>
            <span className="alert-card__status">{alert.status}</span>
          </div>
          <p className="alert-card__message">{alert.message}</p>
          <p className="alert-card__date">{alert.date}</p>
          <div className="alert-card__actions">
            <button onClick={() => setSelected(alert)}>Voir</button>
            {alert.status === 'active' && (
              <button onClick={() => handleArchive(alert.id)}>Archiver</button>
            )}
            <button onClick={() => handleDelete(alert.id)}>Supprimer</button>
          </div>
        </li>
      ))}
    </ul>

    {/* Modal détail */}
    {selected && (
      <div className="alert-modal" onClick={() => setSelected(null)}>
        <div className="alert-modal__box" onClick={(e) => e.stopPropagation()}>
          <h2>{selected.type.toUpperCase()}</h2>
          <p>{selected.message}</p>
          <p>{selected.date}</p>
          <button onClick={() => setSelected(null)}>Fermer</button>
        </div>
      </div>
    )}
  </div>
);
```

---

## Étape 6 — Créer `src/styles/alerts.css`

```css
.alerts-page {
  padding: 24px 16px 120px;
  min-height: 100vh;
}

.alerts-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 20px;
  color: #f5f7fb;
}

.alerts-empty {
  text-align: center;
  color: #94a3b8;
  margin-top: 48px;
}

.alerts-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-card {
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-card--intrusion { border-left: 4px solid #f87171; }
.alert-card--warning   { border-left: 4px solid #fbbf24; }
.alert-card--info      { border-left: 4px solid #60a5fa; }

.alert-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alert-card__badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #cbd5e1;
}

.alert-card__status {
  font-size: 0.7rem;
  color: #64748b;
  border: 1px solid #334155;
  padding: 2px 8px;
  border-radius: 999px;
}

.alert-card__message {
  margin: 0;
  color: #f5f7fb;
  font-size: 0.95rem;
}

.alert-card__date {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
}

.alert-card__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.alert-card__actions button {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(30, 41, 59, 0.8);
  color: #f5f7fb;
  font-size: 0.8rem;
  cursor: pointer;
}

.alert-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 24px;
}

.alert-modal__box {
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 20px;
  padding: 24px;
  width: min(100%, 420px);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-modal__box h2 { margin: 0; color: #f5f7fb; }
.alert-modal__box p  { margin: 0; color: #94a3b8; }
.alert-modal__box button {
  align-self: flex-end;
  padding: 8px 20px;
  border-radius: 10px;
  border: none;
  background: #ec4899;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
```

---

## Résumé de l'ordre d'exécution

1. Créer `src/mock/alerts.mock.ts`
2. Créer `src/styles/alerts.css`
3. Compléter `src/pages/Alerts.tsx` (imports → états → fonctions → JSX)
4. Tester sur `http://localhost:8000/alertes`
