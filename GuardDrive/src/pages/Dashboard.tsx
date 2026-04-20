import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useVehicle } from '../context/VehicleContext';
import '../styles/dashboard.css';

type Alert = {
  _id: string;
  type: 'intrusion' | 'warning' | 'info';
  message: string;
  date: string;
};

function Dashboard() {
  const navigate = useNavigate();
  const { activeVehicle: vehicule, loading } = useVehicle();
  const [alertes, setAlertes] = useState<Alert[]>([]);

  useEffect(() => {
    api.get('/alerts').then((data) => setAlertes(data.slice(0, 3)));
  }, []);

  function libelleTypeAlerte(type: string) {
    if (type === 'warning') return 'Avertissement';
    if (type === 'intrusion') return 'Intrusion';
    return 'Information';
  }

  if (loading || !vehicule) return <div className="tableau-bord-page"><p style={{ padding: '2rem', color: '#f5f7fb' }}>Chargement...</p></div>;

  return (
    <div className="tableau-bord-page">
      <div className="tableau-bord-contenu">
        <header className="tableau-bord-entete">
          <h1 className="tableau-bord-nom-vehicule">{vehicule.name}</h1>
        </header>

        <div className="conteneur-verrouillage">
          <p className="conteneur-verrouillage__etiquette">Verrouillage</p>
          <span
            className={`badge-verrouillage badge-verrouillage--${vehicule.lock === 'locked' ? 'verrouille' : 'deverrouille'}`}
          >
            {vehicule.lock === 'locked' ? 'Verrouillé' : 'Déverrouillé'}
          </span>
        </div>

        <section className="section-indicateurs">
          <h2 className="section-titre">Niveaux</h2>
          <div className="grille-indicateurs">
            <div className="carte-indicateur">
              <p className="carte-indicateur__label">Carburant</p>
              <div className="jauge-carburant-conteneur">
                <svg viewBox="0 0 120 80" className="jauge-carburant-svg">
                  <defs>
                    <linearGradient id="fuelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                  <path d="M 10 68 A 50 50 0 0 1 110 68" fill="none" stroke="rgba(51,65,85,0.8)" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 10 68 A 50 50 0 0 1 110 68" fill="none" stroke="url(#fuelGradient)" strokeWidth="12" strokeLinecap="round"
                    style={{ strokeDasharray: `${(vehicule.fuel / 100) * 157} 157` }} />
                  <text x="6" y="80" fill="#64748b" fontSize="9" fontWeight="700">E</text>
                  <text x="108" y="80" fill="#64748b" fontSize="9" fontWeight="700">F</text>
                  <text x="60" y="62" fill="#f5f7fb" fontSize="15" fontWeight="800" textAnchor="middle">{vehicule.fuel}%</text>
                </svg>
              </div>
            </div>

            <div className="carte-indicateur">
              <p className="carte-indicateur__label">Batterie</p>
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
          </div>
        </section>

        <section className="section-alertes">
          <div className="section-alertes__entete">
            <h2 className="section-titre">Alertes récentes</h2>
            <button onClick={() => navigate('/alertes')}>Voir tout</button>
          </div>

          {alertes.length === 0 ? (
            <p className="section-alertes__vide">Aucune alerte</p>
          ) : (
            <ul className="section-alertes__liste">
              {alertes.map((alerte) => (
                <li
                  key={alerte._id}
                  className={`item-alerte item-alerte--${alerte.type === 'warning' ? 'avertissement' : alerte.type}`}
                  onClick={() => navigate('/alertes')}
                >
                  <div className="item-alerte__meta">
                    <span className="item-alerte__type">{libelleTypeAlerte(alerte.type)}</span>
                    <p className="item-alerte__date">{alerte.date}</p>
                  </div>
                  <p className="item-alerte__message">{alerte.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
