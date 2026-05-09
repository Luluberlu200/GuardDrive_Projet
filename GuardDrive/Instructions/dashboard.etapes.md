# Étapes de développement — Dashboard

## Fichiers à modifier / créer

| Fichier | Action |
|---|---|
| `src/pages/Dashboard.tsx` | Modifier |
| `src/mock/vehicle.mock.ts` | Créer |
| `src/styles/dashboard.css` | Créer |

> Ne pas toucher : `App.tsx`, `main.tsx`, `MainLayout.tsx`, `layout.css`

---

## Étape 1 — Créer les données mockées : `src/mock/vehicle.mock.ts`

```ts
export type LockStatus = 'locked' | 'unlocked';

export type VehicleData = {
  name: string;
  fuel: number;        // pourcentage 0-100
  battery: number;     // pourcentage 0-100
  lock: LockStatus;
  lastUpdate: string;
};

export const mockVehicle: VehicleData = {
  name: 'Renault Clio — AB-123-CD',
  fuel: 62,
  battery: 85,
  lock: 'locked',
  lastUpdate: '2026-04-13 09:15',
};

// Les 3 dernières alertes (à importer aussi depuis alerts.mock si dispo)
export const mockRecentAlerts = [
  {
    id: 1,
    type: 'intrusion',
    message: 'Tentative d\'intrusion détectée',
    date: '2026-04-13 08:42',
  },
  {
    id: 2,
    type: 'warning',
    message: 'Pression des pneus basse',
    date: '2026-04-12 17:15',
  },
  {
    id: 3,
    type: 'info',
    message: 'Révision recommandée dans 500 km',
    date: '2026-04-11 09:00',
  },
];
```

---

## Étape 2 — Imports dans `Dashboard.tsx`

```tsx
import { useNavigate } from 'react-router-dom';
import { mockRecentAlerts, mockVehicle } from '../mock/vehicle.mock';
import '../styles/dashboard.css';
```

---

## Étape 3 — État local

```tsx
const navigate = useNavigate();
const vehicle = mockVehicle;
const recentAlerts = mockRecentAlerts;
```

---

## Étape 4 — JSX à retourner

```tsx
return (
  <div className="dashboard-page">

    {/* Header */}
    <div className="dashboard-header">
      <h1 className="dashboard-vehicle-name">{vehicle.name}</h1>
      <span className={`dashboard-lock dashboard-lock--${vehicle.lock}`}>
        {vehicle.lock === 'locked' ? '🔒 Verrouillé' : '🔓 Déverrouillé'}
      </span>
      <p className="dashboard-update">Mis à jour : {vehicle.lastUpdate}</p>
    </div>

    {/* Indicateurs */}
    <section className="dashboard-indicators">
      <div className="indicator-card">
        <p className="indicator-card__label">Carburant</p>
        <div className="indicator-card__bar">
          <div
            className="indicator-card__fill indicator-card__fill--fuel"
            style={{ width: `${vehicle.fuel}%` }}
          />
        </div>
        <p className="indicator-card__value">{vehicle.fuel}%</p>
      </div>

      <div className="indicator-card">
        <p className="indicator-card__label">Batterie</p>
        <div className="indicator-card__bar">
          <div
            className="indicator-card__fill indicator-card__fill--battery"
            style={{ width: `${vehicle.battery}%` }}
          />
        </div>
        <p className="indicator-card__value">{vehicle.battery}%</p>
      </div>
    </section>

    {/* Alertes récentes */}
    <section className="dashboard-alerts">
      <div className="dashboard-alerts__header">
        <h2>Alertes récentes</h2>
        <button onClick={() => navigate('/alertes')}>Voir tout</button>
      </div>

      {recentAlerts.length === 0 ? (
        <p className="dashboard-alerts__empty">Aucune alerte</p>
      ) : (
        <ul className="dashboard-alerts__list">
          {recentAlerts.map((alert) => (
            <li
              key={alert.id}
              className={`dashboard-alert-item dashboard-alert-item--${alert.type}`}
              onClick={() => navigate('/alertes')}
            >
              <p className="dashboard-alert-item__message">{alert.message}</p>
              <p className="dashboard-alert-item__date">{alert.date}</p>
            </li>
          ))}
        </ul>
      )}
    </section>

  </div>
);
```

---

## Étape 5 — Créer `src/styles/dashboard.css`

```css
.dashboard-page {
  padding: 24px 16px 120px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Header */
.dashboard-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dashboard-vehicle-name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: #f5f7fb;
}

.dashboard-lock {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 999px;
  align-self: flex-start;
}

.dashboard-lock--locked   { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
.dashboard-lock--unlocked { background: rgba(248, 113, 113, 0.15); color: #f87171; }

.dashboard-update {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
}

/* Indicateurs */
.dashboard-indicators {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.indicator-card {
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.indicator-card__label {
  margin: 0;
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
}

.indicator-card__bar {
  height: 10px;
  background: rgba(51, 65, 85, 0.6);
  border-radius: 999px;
  overflow: hidden;
}

.indicator-card__fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.6s ease;
}

.indicator-card__fill--fuel    { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.indicator-card__fill--battery { background: linear-gradient(90deg, #10b981, #34d399); }

.indicator-card__value {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f5f7fb;
  text-align: right;
}

/* Alertes récentes */
.dashboard-alerts__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.dashboard-alerts__header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f5f7fb;
}

.dashboard-alerts__header button {
  background: none;
  border: none;
  color: #ec4899;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.dashboard-alerts__empty {
  color: #64748b;
  text-align: center;
  margin: 24px 0;
}

.dashboard-alerts__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dashboard-alert-item {
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dashboard-alert-item--intrusion { border-left: 4px solid #f87171; }
.dashboard-alert-item--warning   { border-left: 4px solid #fbbf24; }
.dashboard-alert-item--info      { border-left: 4px solid #60a5fa; }

.dashboard-alert-item__message {
  margin: 0;
  font-size: 0.9rem;
  color: #f5f7fb;
}

.dashboard-alert-item__date {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
}
```

---

## Résumé de l'ordre d'exécution

1. Créer `src/mock/vehicle.mock.ts`
2. Créer `src/styles/dashboard.css`
3. Compléter `src/pages/Dashboard.tsx` (imports → données → JSX)
4. Tester sur `http://localhost:8000/dashboard`
