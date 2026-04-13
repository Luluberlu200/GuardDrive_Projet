import { Outlet } from 'react-router-dom';

function AuthLayout() {
	return (
		<div className="app-shell app-shell--auth">
			<main className="app-content app-content--auth">
				<div className="app-card app-card--auth">
					<Outlet />
				</div>
			</main>
		</div>
	);
}

export default AuthLayout;
