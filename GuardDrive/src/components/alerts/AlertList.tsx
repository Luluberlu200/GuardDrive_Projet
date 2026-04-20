import type { Alert } from '../../types/alert';
import { AlertCard } from './AlertCard';
import { EmptyState } from './EmptyState';

interface AlertListProps {
  alerts: Alert[];
  isLoading: boolean;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  isArchivedView?: boolean;
}

export function AlertList({
  alerts,
  isLoading,
  onArchive,
  onDelete,
  isArchivedView = false,
}: AlertListProps) {
  if (isLoading) {
    return (
      <div className="alert-list">
        <div className="skeleton">Chargement des alertes...</div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return <EmptyState isArchivedView={isArchivedView} />;
  }

  return (
    <div className="alert-list">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onArchive={onArchive}
          onDelete={onDelete}
          isArchivedView={isArchivedView}
        />
      ))}
    </div>
  );
}
