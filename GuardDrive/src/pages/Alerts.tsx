import { useState } from 'react';
import { HoneycombBg } from '../components/HoneycombBg';
import { AlertList } from '../components/alerts/AlertList';
import { mockAlerts } from '../data/mockAlerts';
import type { Alert } from '../types/alert';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isLoading] = useState(false);

  const handleArchive = (id: string) => {
    const updated = alerts.map((alert) =>
      alert.id === id ? { ...alert, status: 'archived' as const } : alert
    );
    setAlerts(updated);
  };

  const handleDelete = (id: string) => {
    const updated = alerts.filter((alert) => alert.id !== id);
    setAlerts(updated);
  };

  const activeAlerts = alerts.filter((alert) => alert.status === 'active');

  return (
    <>
    <HoneycombBg className="hc-bg-fixed" />
    <div className="page-alerts">
      <h1>Alertes</h1>

      <AlertList
        alerts={activeAlerts}
        isLoading={isLoading}
        onArchive={handleArchive}
        onDelete={handleDelete}
      />
    </div>
    </>
  );
}
