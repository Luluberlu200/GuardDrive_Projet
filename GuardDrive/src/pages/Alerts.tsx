import { useState } from 'react';
import { AlertList } from '../components/alerts/AlertList';
import { AlertToggle } from '../components/alerts/AlertToggle';
import { mockAlerts } from '../data/mockAlerts';
import type { Alert } from '../types/alert';

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isLoading] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

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

  const handleUnarchive = (id: string) => {
    const updated = alerts.map((alert) =>
      alert.id === id ? { ...alert, status: 'active' as const } : alert
    );
    setAlerts(updated);
  };

  const activeAlerts = alerts.filter((alert) => alert.status === 'active');
  const archivedAlerts = alerts.filter((alert) => alert.status === 'archived');

  return (
    <div className="page-alerts">
      <div className="alerts-header">
        <h1>Alertes</h1>
        <AlertToggle
          showArchived={showArchived}
          onToggle={() => setShowArchived(!showArchived)}
          activeCount={activeAlerts.length}
          archivedCount={archivedAlerts.length}
        />
      </div>

      {showArchived ? (
        <AlertList
          alerts={archivedAlerts}
          isLoading={isLoading}
          onArchive={handleUnarchive}
          onDelete={handleDelete}
          isArchivedView={true}
        />
      ) : (
        <AlertList
          alerts={activeAlerts}
          isLoading={isLoading}
          onArchive={handleArchive}
          onDelete={handleDelete}
          isArchivedView={false}
        />
      )}
    </div>
  );
}
