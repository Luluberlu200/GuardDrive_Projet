interface AlertActionsProps {
  alertId: string;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  isArchivedView?: boolean;
}

export function AlertActions({
  alertId,
  onArchive,
  onDelete,
  isArchivedView = false,
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
        title={isArchivedView ? "Remettre cette alerte en active" : "Archiver cette alerte"}
      >
        {isArchivedView ? "Désarchiver" : "Archiver"}
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
