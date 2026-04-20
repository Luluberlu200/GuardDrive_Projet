interface AlertTabsProps {
  showArchived: boolean;
  onToggle: () => void;
  activeCount: number;
  archivedCount: number;
}

export function AlertTabs({ showArchived, onToggle, activeCount, archivedCount }: AlertTabsProps) {
  return (
    <div className="alerts-tabs">
      <button
        className={`tab ${!showArchived ? 'active' : ''}`}
        onClick={() => showArchived && onToggle()}
      >
        <span className="tab-icon">🔔</span>
        <span className="tab-text">Actives</span>
        <span className="tab-count">({activeCount})</span>
      </button>
      <button
        className={`tab ${showArchived ? 'active' : ''}`}
        onClick={() => !showArchived && onToggle()}
      >
        <span className="tab-icon">📁</span>
        <span className="tab-text">Archivées</span>
        <span className="tab-count">({archivedCount})</span>
      </button>
    </div>
  );
}