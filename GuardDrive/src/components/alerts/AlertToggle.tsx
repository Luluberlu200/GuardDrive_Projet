interface AlertToggleProps {
  showArchived: boolean;
  onToggle: () => void;
  activeCount: number;
  archivedCount: number;
}

export function AlertToggle({ showArchived, onToggle, activeCount, archivedCount }: AlertToggleProps) {
  return (
    <div className="alerts-toggle">
      <button
        className={`toggle-option ${!showArchived ? 'active' : 'inactive'}`}
        onClick={() => showArchived && onToggle()}
      >
        Actives ({activeCount})
      </button>
      <button
        className={`toggle-option ${showArchived ? 'active' : 'inactive'}`}
        onClick={() => !showArchived && onToggle()}
      >
        Archivées ({archivedCount})
      </button>
    </div>
  );
}