export type AlertType = 'intrusion' | 'warning' | 'info';
export type AlertStatus = 'active' | 'archived';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  date: string;
  status: AlertStatus;
}
