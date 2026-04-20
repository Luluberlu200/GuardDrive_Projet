interface AlertSegmentedProps {
  showArchived: boolean;
  onToggle: () => void;
  activeCount: number;
  archivedCount: number;
}

export function AlertSegmented({ showArchived, onToggle, activeCount, archivedCount }: AlertSegmentedProps) {
  return (
    <div className="alerts-segmented">
      <div className="segmented-container">
        <button
          className={`segment ${!showArchived ? 'active' : ''}`}
          onClick={() => showArchived && onToggle()}
        >
          <div className="segment-content">
            <span className="segment-icon">🔔</span>
            <span className="segment-label">Actives</span>
            <span className="segment-badge">{activeCount}</span>
          </div>
        </button>
        <button
          className={`segment ${showArchived ? 'active' : ''}`}
          onClick={() => !showArchived && onToggle()}
        >
          <div className="segment-content">
            <span className="segment-icon">📁</span>
            <span className="segment-label">Archivées</span>
            <span className="segment-badge">{archivedCount}</span>
          </div>
        </button>
      </div>
    </div>
  );
}