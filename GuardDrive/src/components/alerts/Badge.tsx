import type { AlertStatus } from '../../types/alert';

interface BadgeProps {
  status: AlertStatus;
}

export function Badge({ status }: BadgeProps) {
  const badges = {
    active: {
      label: 'Actif',
      className: 'badge-active',
    },
    archived: {
      label: 'Archivé',
      className: 'badge-archived',
    },
  };

  const badge = badges[status];

  return (
    <span className={`badge ${badge.className}`}>
      {badge.label}
    </span>
  );
}
