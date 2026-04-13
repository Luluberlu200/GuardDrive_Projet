export function EmptyState() {
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
