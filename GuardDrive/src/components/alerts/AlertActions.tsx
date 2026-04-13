interface AlertActionsProps {
  alertId: string;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AlertActions({
  alertId,
  onArchive,
  onDelete,
}: AlertActionsProps) {
  const handleDeleteClick = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      onDelete(alertId);
    }
  };

  return (
    <div className="alert-actions">
      <button
        className="btn btn-secondary"
        onClick={() => onArchive(alertId)}
        title="Archiver cette alerte"
      >
        Archiver
      </button>
      <button
        className="btn btn-danger"
        onClick={handleDeleteClick}
        title="Supprimer définitivement"
      >
        Supprimer
      </button>
    </div>
  );
}
