import { useNavigate } from 'react-router-dom';
import { mockRecentAlerts, mockVehicle } from '../data/vehicle.mock';
import '../styles/dashboard.css';

function Dashboard() {
	const navigate = useNavigate();
	const vehicule = mockVehicle;
	const alertesRecentes = mockRecentAlerts;

	return (
		<div className="tableau-bord-page">
			<div className="tableau-bord-entete">
				<h1 className="tableau-bord-nom-vehicule">{vehicule.name}</h1>
				<p className="tableau-bord-mise-a-jour">Mis à jour : {vehicule.lastUpdate}</p>
			</div>

			<div className="conteneur-verrouillage">
				<p className="conteneur-verrouillage__etiquette">Verrouillage</p>
				<span
					className={`badge-verrouillage badge-verrouillage--${vehicule.lock === 'locked' ? 'verrouille' : 'deverrouille'}`}
				>
					{vehicule.lock === 'locked' ? '🔒 Verrouillé' : '🔓 Déverrouillé'}
				</span>
			</div>

			<section className="section-indicateurs">
				
				<div className="carte-indicateur">
					<p className="carte-indicateur__label">⛽ Carburant</p>
					<div className="jauge-carburant-conteneur">
						<svg viewBox="0 0 120 80" className="jauge-carburant-svg">
							<defs>
								<linearGradient id="fuelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stopColor="#f59e0b" />
									<stop offset="100%" stopColor="#fbbf24" />
								</linearGradient>
							</defs>
							{/* Track */}
							<path
								d="M 10 68 A 50 50 0 0 1 110 68"
								fill="none"
								stroke="rgba(51,65,85,0.8)"
								strokeWidth="12"
								strokeLinecap="round"
							/>
							{/* Fill */}
							<path
								d="M 10 68 A 50 50 0 0 1 110 68"
								fill="none"
								stroke="url(#fuelGradient)"
								strokeWidth="12"
								strokeLinecap="round"
								style={{ strokeDasharray: `${(vehicule.fuel / 100) * 157} 157` }}
							/>
							<text x="6" y="80" fill="#64748b" fontSize="9" fontWeight="700">E</text>
							<text x="108" y="80" fill="#64748b" fontSize="9" fontWeight="700">F</text>
							<text x="60" y="62" fill="#f5f7fb" fontSize="15" fontWeight="800" textAnchor="middle">{vehicule.fuel}%</text>
						</svg>
					</div>
				</div>

				{/* Batterie */}
				<div className="carte-indicateur">
					<p className="carte-indicateur__label">🔋 Batterie</p>
					<div className="batterie-conteneur">
						<div className="batterie-corps">
							<div
								className={`batterie-remplissage ${
								vehicule.battery < 20
									? 'batterie-remplissage--faible'
									: vehicule.battery < 50
									? 'batterie-remplissage--moyenne'
									: 'batterie-remplissage--haute'
								}`}
								style={{ width: `${vehicule.battery}%` }}
							/>
							<span className="batterie-pourcentage">{vehicule.battery}%</span>
						</div>
						<div className="batterie-borne" />
					</div>
				</div>
			</section>

			<section className="section-alertes">
				<div className="section-alertes__entete">
					<h2>Alertes récentes</h2>
					<button onClick={() => navigate('/alertes')}>Voir tout</button>
				</div>

			{alertesRecentes.length === 0 ? (
				<p className="section-alertes__vide">Aucune alerte</p>
			) : (
				<ul className="section-alertes__liste">
					{alertesRecentes.map((alerte) => (
						<li
							key={alerte.id}
							className={`item-alerte item-alerte--${alerte.type === 'warning' ? 'avertissement' : alerte.type}`}
							onClick={() => navigate('/alertes')}
						>
							<p className="item-alerte__message">{alerte.message}</p>
							<p className="item-alerte__date">{alerte.date}</p>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	);
}

export default Dashboard;
