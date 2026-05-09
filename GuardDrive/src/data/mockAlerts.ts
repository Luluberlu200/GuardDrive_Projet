import type { Alert } from '../types/alert';

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'intrusion',
    message: 'Tentative d\'ouverture de la porte arrière droite',
    date: new Date('2025-09-17T03:47:00').toISOString(),
    status: 'active',
  },
  {
    id: '2',
    type: 'warning',
    message: 'Pression des pneus du 12/07/2025 - Pression du pneu avant gauche anormalement basse (1,5 bar)',
    date: new Date('2025-07-12T15:23:00').toISOString(),
    status: 'active',
  },
  {
    id: '3',
    type: 'info',
    message: 'Maintenance prévisionnelle dans 500 km',
    date: new Date('2025-09-15T10:00:00').toISOString(),
    status: 'active',
  },
  {
    id: '4',
    type: 'warning',
    message: 'Batterie faible détectée',
    date: new Date('2025-09-14T08:30:00').toISOString(),
    status: 'archived',
  },
];
