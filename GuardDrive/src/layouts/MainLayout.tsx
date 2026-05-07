import { NavLink, Outlet } from 'react-router-dom';
import { VehicleProvider } from '../context/VehicleContext';

const navigationItems = [
	{
		to: '/dashboard',
		label: 'Accueil',
		icon: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
				<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
				<polyline points="9 22 9 12 15 12 15 22" />
			</svg>
		),
	},
	{
		to: '/localisation',
		label: 'Localisation',
		icon: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
				<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
				<circle cx="12" cy="10" r="3" />
			</svg>
		),
	},
	{
		to: '/etat-vehicule',
		label: 'État',
		icon: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
				<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
				<circle cx="12" cy="12" r="4" />
			</svg>
		),
	},
	{
		to: '/alertes',
		label: 'Alertes',
		icon: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
				<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
				<path d="M13.73 21a2 2 0 0 1-3.46 0" />
			</svg>
		),
	},
	{
		to: '/settings',
		label: 'Réglages',
		icon: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
				<circle cx="12" cy="12" r="3" />
				<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
			</svg>
		),
	},
];

function MainLayout() {
	return (
		<div className="app-shell">
			<header className="app-brand-static" aria-label="Identité GuardDrive">
				<span className="app-brand-static__wordmark">Guard<span className="app-brand-static__accent">Drive</span></span>
			</header>

			<VehicleProvider>
				<main className="app-content">
					<Outlet />
				</main>
			</VehicleProvider>

			<nav className="mobile-navbar" aria-label="Navigation principale">
				{navigationItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						aria-label={item.label}
						className={({ isActive }) =>
							isActive ? 'mobile-navbar__link mobile-navbar__link--active' : 'mobile-navbar__link'
						}
					>
						{({ isActive }) => (
							<span className="mobile-navbar__item">
								{item.icon}
								{isActive && <span className="mobile-navbar__label">{item.label}</span>}
							</span>
						)}
					</NavLink>
				))}
			</nav>
		</div>
	);
}

export default MainLayout;
