import { useEffect, useState } from 'react';
import { api } from '../services/api';
import '../styles/dashboard.css';

type Alert = {
  _id: string;
  type: 'intrusion' | 'warning' | 'info';
  message: string;
  status: 'active' | 'archived';
  date: string;
};

function libelleType(type: string) {
  if (type === 'warning') return 'Avertissement';
  if (type === 'intrusion') return 'Intrusion';
  return 'Information';
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    api.get('/alerts').then(data => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  async function handleArchive(id: string) {
    await api.patch(`/alerts/${id}/archive`);
    setAlerts(prev => prev.filter(a => a._id !== id));
  }

  async function handleDelete(id: string) {
    if (confirmDeleteId !== id) { setConfirmDeleteId(id); return; }
    await api.delete(`/alerts/${id}`);
    setAlerts(prev => prev.filter(a => a._id !== id));
    setConfirmDeleteId(null);
  }

  const active = alerts.filter(a => a.status === 'active');
  const archived = alerts.filter(a => a.status === 'archived');
  const [showArchived, setShowArchived] = useState(false);

  return (
    <section className="theme-page">
      <h1 className="theme-page__title">Alertes</h1>
      <p className="theme-page__subtitle">
        {loading ? 'Chargement…' : `${active.length} alerte${active.length !== 1 ? 's' : ''} active${active.length !== 1 ? 's' : ''}`}
      </p>

      {!loading && active.length === 0 && (
        <p className="section-alertes__vide">Aucune alerte active</p>
      )}

      {!loading && active.length > 0 && (
        <ul className="section-alertes__liste">
          {active.map(alert => (
            <li
              key={alert._id}
              className={`item-alerte item-alerte--${alert.type === 'warning' ? 'avertissement' : alert.type}`}
              style={{ cursor: 'default' }}
            >
              <div className="item-alerte__meta">
                <span className="item-alerte__type">{libelleType(alert.type)}</span>
                <p className="item-alerte__date">{formatDate(alert.date)}</p>
              </div>
              <p className="item-alerte__message">{alert.message}</p>
              <div className="alerte-actions">
                <button className="alerte-actions__btn" onClick={() => handleArchive(alert._id)}>
                  Archiver
                </button>
                <button
                  className={`alerte-actions__btn alerte-actions__btn--del${confirmDeleteId === alert._id ? ' alerte-actions__btn--confirm' : ''}`}
                  onClick={() => handleDelete(alert._id)}
                >
                  {confirmDeleteId === alert._id ? 'Confirmer ?' : 'Supprimer'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && archived.length > 0 && (
        <div className="alerte-archive-section">
          <button className="alerte-archive-toggle" onClick={() => setShowArchived(v => !v)}>
            <span>Archivées ({archived.length})</span>
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: showArchived ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showArchived && (
            <ul className="section-alertes__liste">
              {archived.map(alert => (
                <li
                  key={alert._id}
                  className={`item-alerte item-alerte--${alert.type === 'warning' ? 'avertissement' : alert.type} item-alerte--archived`}
                  style={{ cursor: 'default' }}
                >
                  <div className="item-alerte__meta">
                    <span className="item-alerte__type">{libelleType(alert.type)}</span>
                    <p className="item-alerte__date">{formatDate(alert.date)}</p>
                  </div>
                  <p className="item-alerte__message">{alert.message}</p>
                  <div className="alerte-actions">
                    <button
                      className={`alerte-actions__btn alerte-actions__btn--del${confirmDeleteId === alert._id ? ' alerte-actions__btn--confirm' : ''}`}
                      onClick={() => handleDelete(alert._id)}
                    >
                      {confirmDeleteId === alert._id ? 'Confirmer ?' : 'Supprimer'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
