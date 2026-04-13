import { NavLink, Outlet } from 'react-router-dom';

const navigationItems = [
	{ to: '/dashboard', label: 'Accueil' },
	{ to: '/localisation', label: 'Localisation' },
	{ to: '/etat-vehicule', label: 'État' },
	{ to: '/alertes', label: 'Alertes' },
	{ to: '/settings', label: 'Réglages' },
];

function MainLayout() {
	return (
		<div className="app-shell">
			<header className="app-brand-static" aria-label="Identité GuardDrive">
				<img src="/logo.png" alt="GuardDrive" className="app-brand-static__logo" />
			</header>

			<main className="app-content">
				<Outlet />
			</main>

			<nav className="mobile-navbar" aria-label="Navigation principale">
				{navigationItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						className={({ isActive }) =>
							isActive ? 'mobile-navbar__link mobile-navbar__link--active' : 'mobile-navbar__link'
						}
					>
						{item.label}
					</NavLink>
				))}
			</nav>
		</div>
	);
}

export default MainLayout;
