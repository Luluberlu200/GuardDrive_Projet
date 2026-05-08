import { useCallback, useEffect, useState } from 'react';
import { HoneycombBg } from '../components/HoneycombBg';
import { api } from '../services/api';
import type { Alert, AlertStatus, AlertType } from '../types/alert';
import '../styles/alerts.css';

/* ── Helpers ── */
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `il y a ${d}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const TYPE_LABEL: Record<AlertType, string> = {
  intrusion: 'Intrusion',
  warning:   'Avertissement',
  info:      'Info',
};

/* ── SVG icons ── */
function IconIntrusion() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function IconWarning() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8.01" /><line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  );
}
function IconArchive() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  );
}
function IconRefresh() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

const TYPE_ICON: Record<AlertType, React.ReactElement> = {
  intrusion: <IconIntrusion />,
  warning:   <IconWarning />,
  info:      <IconInfo />,
};

/* ── Alert card ── */
function AlertCard({
  alert, onArchive, onUnarchive, onDelete,
}: {
  alert: Alert;
  onArchive:   (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete:    (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isArchived = alert.status === 'archived';

  return (
    <div className={`al-card al-card--${alert.type}`}>
      <div className="al-card__stripe" />
      <div className="al-card__body">
        <div className="al-card__top">
          <span className={`al-card__icon al-card__icon--${alert.type}`}>
            {TYPE_ICON[alert.type]}
          </span>
          <div className="al-card__content">
            <span className={`al-card__label al-card__label--${alert.type}`}>
              {TYPE_LABEL[alert.type]}
            </span>
            <p className="al-card__msg">{alert.message}</p>
            <span className="al-card__date">{timeAgo(alert.date)}</span>
          </div>
        </div>

        <div className="al-card__actions">
          {isArchived ? (
            <button className="al-btn" onClick={() => onUnarchive(alert._id)}>
              <IconArchive /> Restaurer
            </button>
          ) : (
            <button className="al-btn" onClick={() => onArchive(alert._id)}>
              <IconArchive /> Archiver
            </button>
          )}
          <button
            className={`al-btn al-btn--danger${confirmDelete ? ' al-btn--confirm' : ''}`}
            onClick={() => confirmDelete ? onDelete(alert._id) : setConfirmDelete(true)}
            onBlur={() => setConfirmDelete(false)}
          >
            {confirmDelete ? 'Confirmer ?' : <><IconTrash /> Supprimer</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
type FilterKey = AlertType | 'all';

export default function Alerts() {
  const [alerts, setAlerts]         = useState<Alert[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab]               = useState<AlertStatus>('active');
  const [filter, setFilter]         = useState<FilterKey>('all');

  const load = useCallback(async (silent = false) => {
    silent ? setRefreshing(true) : setLoading(true);
    try {
      const data = await api.get('/alerts');
      if (Array.isArray(data)) setAlerts(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(() => load(true), 30000);
    return () => clearInterval(id);
  }, [load]);

  async function handleArchive(id: string) {
    await api.patch(`/alerts/${id}/archive`);
    setAlerts(prev => prev.map(a => a._id === id ? { ...a, status: 'archived' } : a));
  }
  async function handleUnarchive(id: string) {
    await api.patch(`/alerts/${id}/unarchive`);
    setAlerts(prev => prev.map(a => a._id === id ? { ...a, status: 'active' } : a));
  }
  async function handleDelete(id: string) {
    await api.delete(`/alerts/${id}`);
    setAlerts(prev => prev.filter(a => a._id !== id));
  }

  const active   = alerts.filter(a => a.status === 'active');
  const archived = alerts.filter(a => a.status === 'archived');

  const visible = (tab === 'active' ? active : archived)
    .filter(a => filter === 'all' || a.type === filter);

  return (
    <>
      <HoneycombBg className="hc-bg-fixed" />
      <div className="al">

        {/* Header */}
        <div className="al-header">
          <div className="al-header__left">
            <h2 className="al-header__title">Alertes</h2>
          </div>
          <button
            className={`al-refresh${refreshing ? ' al-refresh--spin' : ''}`}
            onClick={() => load(true)}
            aria-label="Actualiser"
          >
            <IconRefresh />
          </button>
        </div>

        {/* Tabs */}
        <div className="al-tabs">
          <button className={`al-tab${tab === 'active' ? ' al-tab--active' : ''}`} onClick={() => setTab('active')}>
            Actives <span className="al-tab__count">{active.length}</span>
          </button>
          <button className={`al-tab${tab === 'archived' ? ' al-tab--active' : ''}`} onClick={() => setTab('archived')}>
            Archivées <span className="al-tab__count">{archived.length}</span>
          </button>
        </div>

        {/* Filters */}
        <div className="al-filters">
          {(['all', 'intrusion', 'warning', 'info'] as FilterKey[]).map(f => (
            <button
              key={f}
              className={`al-chip${filter === f ? ' al-chip--active' : ''}${f !== 'all' ? ` al-chip--${f}` : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Tous' : TYPE_LABEL[f as AlertType]}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="al-skeletons">
            {[1, 2, 3].map(i => <div key={i} className="al-skeleton" />)}
          </div>
        ) : visible.length === 0 ? (
          <div className="al-empty">
            <p className="al-empty__title">
              {tab === 'active' ? 'Aucune alerte active' : 'Aucune alerte archivée'}
            </p>
          </div>
        ) : (
          <div className="al-list">
            {visible.map(alert => (
              <AlertCard
                key={alert._id}
                alert={alert}
                onArchive={handleArchive}
                onUnarchive={handleUnarchive}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
