import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Alerts from './pages/Alerts';
import Dashboard from './pages/Dashboard';
import EtatVehicule from './pages/Etat_Vehicule';
import Localisation from './pages/Localisation';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Navigate to="/login" replace />} />

			<Route element={<AuthLayout />}>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Route>

			<Route element={<MainLayout />}>
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/localisation" element={<Localisation />} />
				<Route path="/etat-vehicule" element={<EtatVehicule />} />
				<Route path="/settings" element={<Settings />} />
				<Route path="/alertes" element={<Alerts />} />
			</Route>

			<Route path="*" element={<Navigate to="/login" replace />} />
		</Routes>
	);
}

export default App;
