import type { AlertType } from '../../types/alert';

interface IconAlertProps {
  type: AlertType;
}

export function IconAlert({ type }: IconAlertProps) {
  const alertConfig = {
    intrusion: {
      icon: '🚨',
      label: 'Intrusion',
      color: 'red',
    },
    warning: {
      icon: '⚠️',
      label: 'Avertissement',
      color: 'orange',
    },
    info: {
      icon: 'ℹ️',
      label: 'Information',
      color: 'blue',
    },
  };

  const config = alertConfig[type];

  return (
    <div
      className={`icon-alert icon-${type}`}
      title={config.label}
      style={{ color: config.color }}
    >
      {config.icon}
    </div>
  );
}
