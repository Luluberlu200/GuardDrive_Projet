import { useNavigate } from 'react-router-dom';
import { mockRecentAlerts, mockVehicle } from '../mock/vehicle.mock';
import '../styles/dashboard.css';

function Dashboard() {
	const navigate = useNavigate();
	const vehicle = mockVehicle;
	const recentAlerts = mockRecentAlerts;

	return <h1 onClick={() => navigate('/alertes')}>{vehicle.name} ({recentAlerts.length})</h1>;
}

export default Dashboard;
