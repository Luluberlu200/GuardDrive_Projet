import type { Alert } from '../../types/alert';
import { IconAlert } from './IconAlert';
import { Badge } from './Badge';
import { AlertActions } from './AlertActions';

interface AlertCardProps {
  alert: Alert;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  isArchivedView?: boolean;
}

export function AlertCard({ alert, onArchive, onDelete, isArchivedView = false }: AlertCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="alert-card">
      <div className="alert-card-header">
        <IconAlert type={alert.type} />
        
        <div className="alert-card-content">
          <h3 className="alert-card-title">{alert.message}</h3>
          <p className="alert-card-date">{formatDate(alert.date)}</p>
        </div>

        <Badge status={alert.status} />
      </div>

      <AlertActions
        alertId={alert.id}
        onArchive={onArchive}
        onDelete={onDelete}
        isArchivedView={isArchivedView}
      />
    </div>
  );
}
