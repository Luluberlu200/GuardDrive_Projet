export type LockStatus = 'locked' | 'unlocked';

export type VehicleData = {
	name: string;
	fuel: number;
	battery: number;
	lock: LockStatus;
	lastUpdate: string;
};

export type RecentAlert = {
	id: number;
	type: 'intrusion' | 'warning' | 'info';
	message: string;
	date: string;
};

export const mockVehicle: VehicleData = {
	name: 'Renault Clio — AB-123-CD',
	fuel: 62,
	battery: 85,
	lock: 'locked',
	lastUpdate: '2026-04-13 09:15',
};

export const mockRecentAlerts: RecentAlert[] = [
	{
		id: 1,
		type: 'intrusion',
		message: "Tentative d'intrusion détectée",
		date: '2026-04-13 08:42',
	},
	{
		id: 2,
		type: 'warning',
		message: 'Pression des pneus basse',
		date: '2026-04-12 17:15',
	},
	{
		id: 3,
		type: 'info',
		message: 'Révision recommandée dans 500 km',
		date: '2026-04-11 09:00',
	},
];
