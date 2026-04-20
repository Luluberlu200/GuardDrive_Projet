interface AlertDropdownProps {
  showArchived: boolean;
  onToggle: () => void;
  activeCount: number;
  archivedCount: number;
}

export function AlertDropdown({ showArchived, onToggle, activeCount, archivedCount }: AlertDropdownProps) {
  return (
    <div className="alerts-dropdown">
      <select
        value={showArchived ? 'archived' : 'active'}
        onChange={onToggle}
        className="dropdown-select"
      >
        <option value="active">
          🔔 Alertes actives ({activeCount})
        </option>
        <option value="archived">
          📁 Alertes archivées ({archivedCount})
        </option>
      </select>
      <span className="dropdown-arrow">▼</span>
    </div>
  );
}