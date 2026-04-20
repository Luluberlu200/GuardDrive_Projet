interface EmptyStateProps {
  isArchivedView?: boolean;
}

export function EmptyState({ isArchivedView = false }: EmptyStateProps) {
  if (isArchivedView) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📂</div>
        <p className="empty-state-title">Aucune alerte archivée</p>
        <p className="empty-state-subtitle">
          Les alertes archivées apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state-icon">🔔</div>
      <p className="empty-state-title">Aucune alerte</p>
      <p className="empty-state-subtitle">
        Vous êtes à jour, tout va bien !
      </p>
    </div>
  );
}
