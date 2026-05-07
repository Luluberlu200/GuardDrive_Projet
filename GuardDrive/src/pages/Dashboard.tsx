import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useVehicle } from '../context/VehicleContext';
import '../styles/dashboard.css';

/* ════════════════════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════════════════ */
type Alert = { _id: string; type: 'intrusion' | 'warning' | 'info'; message: string; date: string };
type Weather = { temp: number; apparent: number; code: number; city: string };

/* ════════════════════════════════════════════════════════════
   ICÔNES SVG
════════════════════════════════════════════════════════════ */
function IconFuelPump() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>
      <path d="M3 22h12"/>
      <path d="M7 22V14h4v8"/>
      <path d="M15 8h2a2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9l-3-3"/>
      <path d="M18 3l3 3"/>
      <line x1="7" y1="8" x2="11" y2="8"/>
    </svg>
  );
}

function IconBattery({ pct }: { pct: number }) {
  const fill = pct >= 50 ? '#f7a8b8' : pct >= 20 ? '#b5b5b5' : '#e57373';
  const barW = Math.round((pct / 100) * 13);
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="7" width="18" height="10" rx="2"/>
      <line x1="23" y1="11" x2="23" y2="13" strokeWidth="2.5"/>
      <rect x="2.5" y="8.5" width={barW} height="7" rx="1" fill={fill} stroke="none"/>
    </svg>
  );
}

function IconLockClosed() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function IconLockOpen() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}

function IconCar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="6" rx="2"/>
      <path d="M6 7l2-4h8l2 4"/>
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   MÉTÉO
════════════════════════════════════════════════════════════ */
function weatherEmoji(code: number) {
  if (code === 0) return '☀️';
  if (code === 1) return '🌤';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫';
  if (code <= 67) return '🌧';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦';
  return '⛈';
}
function weatherLabel(code: number) {
  if (code === 0) return 'Ciel dégagé';
  if (code === 1) return 'Peu nuageux';
  if (code === 2) return 'Partiellement nuageux';
  if (code === 3) return 'Couvert';
  if (code <= 48) return 'Brouillard';
  if (code <= 57) return 'Bruine';
  if (code <= 67) return 'Pluie';
  if (code <= 77) return 'Neige';
  if (code <= 82) return 'Averses';
  return 'Orage';
}
async function fetchWeather(lat: number, lng: number): Promise<Weather> {
  const [wRes, gRes] = await Promise.all([
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,weather_code`),
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, { headers: { 'Accept-Language': 'fr' } }),
  ]);
  const wd = await wRes.json();
  const gd = await gRes.json();
  const a = gd.address ?? {};
  return {
    temp: Math.round(wd.current.temperature_2m),
    apparent: Math.round(wd.current.apparent_temperature),
    code: wd.current.weather_code,
    city: a.city ?? a.town ?? a.village ?? a.county ?? 'Inconnu',
  };
}

/* ════════════════════════════════════════════════════════════
   LISTE DÉROULANTE VÉHICULE
════════════════════════════════════════════════════════════ */
function VehicleDropdown() {
  const { vehicles, activeVehicle, setActiveId } = useVehicle();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  return (
    <div className="db-dropdown" ref={ref}>
      <button className="db-dropdown__trigger" onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <span className="db-dropdown__icon"><IconCar /></span>
        <span className="db-dropdown__current">{activeVehicle?.name ?? '—'}</span>
        <span className="db-dropdown__chevron"><IconChevron open={open} /></span>
      </button>

      {open && (
        <ul className="db-dropdown__menu" role="listbox">
          {vehicles.map(v => (
            <li key={v._id} role="option" aria-selected={v._id === activeVehicle?._id}>
              <button
                className={`db-dropdown__option${v._id === activeVehicle?._id ? ' db-dropdown__option--active' : ''}`}
                onClick={() => { setActiveId(v._id); setOpen(false); }}
              >
                <span className="db-dropdown__option-check">
                  {v._id === activeVehicle?._id && <IconCheck />}
                </span>
                {v.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   WIDGET MÉTÉO
════════════════════════════════════════════════════════════ */
function WeatherWidget({ lat, lng }: { lat: number; lng: number }) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setWeather(null); setError(false);
    fetchWeather(lat, lng).then(setWeather).catch(() => setError(true));
  }, [lat, lng]);

  if (error) return null;
  if (!weather) return <div className="db-weather db-weather--loading"><span className="db-weather__skeleton" /></div>;

  return (
    <div className="db-weather">
      <span className="db-weather__emoji" role="img" aria-label={weatherLabel(weather.code)}>{weatherEmoji(weather.code)}</span>
      <div className="db-weather__info">
        <p className="db-weather__city">{weather.city}</p>
        <p className="db-weather__desc">{weatherLabel(weather.code)}</p>
      </div>
      <div className="db-weather__temps">
        <span className="db-weather__temp">{weather.temp}°</span>
        <span className="db-weather__apparent">Ressenti {weather.apparent}°</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE PRINCIPALE
════════════════════════════════════════════════════════════ */
function Dashboard() {
  const navigate = useNavigate();
  const { activeVehicle: v, loading } = useVehicle();
  const [alertes, setAlertes] = useState<Alert[]>([]);

  useEffect(() => { api.get('/alerts').then(d => setAlertes(d.slice(0, 3))); }, []);

  if (loading || !v) return (
    <div className="db-page">
      <div className="db-loader"><span className="db-loader__spinner" /></div>
    </div>
  );

  const isLocked = v.lock === 'locked';

  function libelleType(type: string) {
    if (type === 'warning') return 'Avertissement';
    if (type === 'intrusion') return 'Intrusion';
    return 'Information';
  }

  return (
    <div className="db-page">

      {/* Liste déroulante véhicule */}
      <VehicleDropdown />

      {/* Météo */}
      <WeatherWidget lat={v.lat ?? 48.8566} lng={v.lng ?? 2.3522} />

      {/* Héro – nom + statut verrou */}
      <div className="db-hero">
        <div className="db-hero__name-row">
          <span className="db-hero__car-icon"><IconCar /></span>
          <h1 className="db-hero__name">{v.name}</h1>
        </div>
        <span className={`db-hero__lock db-hero__lock--${isLocked ? 'on' : 'off'}`}>
          {isLocked ? <IconLockClosed /> : <IconLockOpen />}
          {isLocked ? 'Verrouillé' : 'Déverrouillé'}
        </span>
      </div>

      {/* Jauges */}
      <div className="db-gauges">

        {/* Carburant */}
        <div className="db-gauge-card">
          <div className="db-gauge-card__header">
            <span className="db-gauge-card__ico db-gauge-card__ico--fuel"><IconFuelPump /></span>
            <p className="db-gauge-card__label">Carburant</p>
          </div>
          <div className="db-gauge-card__arc">
            <svg viewBox="0 0 120 72">
              <defs>
                <linearGradient id="fuelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b"/>
                  <stop offset="100%" stopColor="#fbbf24"/>
                </linearGradient>
              </defs>
              <path d="M10 65 A 50 50 0 0 1 110 65" fill="none" stroke="rgba(136,136,136,0.15)" strokeWidth="10" strokeLinecap="round"/>
              <path d="M10 65 A 50 50 0 0 1 110 65" fill="none" stroke="url(#fuelGrad)" strokeWidth="10" strokeLinecap="round"
                style={{ strokeDasharray: `${(v.fuel / 100) * 157} 157` }}/>
              <text x="60" y="60" fill="var(--couleur-texte)" fontSize="16" fontWeight="800" textAnchor="middle" fontFamily="Manrope,Inter,sans-serif">{v.fuel}%</text>
            </svg>
          </div>
        </div>

        {/* Batterie */}
        <div className="db-gauge-card">
          <div className="db-gauge-card__header">
            <span className="db-gauge-card__ico db-gauge-card__ico--battery"><IconBattery pct={v.battery} /></span>
            <p className="db-gauge-card__label">Batterie</p>
          </div>
          <div className="db-gauge-card__battery">
            <div className="db-battery">
              <div className="db-battery__body">
                <div className={`db-battery__fill db-battery__fill--${v.battery >= 50 ? 'high' : v.battery >= 20 ? 'mid' : 'low'}`}
                  style={{ width: `${v.battery}%` }}/>
                <span className="db-battery__pct">{v.battery}%</span>
              </div>
              <div className="db-battery__cap" />
            </div>
          </div>
        </div>
      </div>

      {/* Alertes récentes */}
      <section className="db-alerts">
        <div className="db-alerts__head">
          <h2 className="db-section-title">
            <span className="db-section-title__ico"><IconBell /></span>
            Alertes récentes
          </h2>
          <button className="db-alerts__see-all" onClick={() => navigate('/alertes')}>Voir tout</button>
        </div>

        {alertes.length === 0 ? (
          <p className="db-alerts__empty">Aucune alerte récente</p>
        ) : (
          <ul className="db-alerts__list">
            {alertes.map((a) => (
              <li key={a._id}
                className={`db-alert-item db-alert-item--${a.type === 'warning' ? 'warning' : a.type}`}
                onClick={() => navigate('/alertes')}>
                <div className="db-alert-item__row">
                  <span className="db-alert-item__type">{libelleType(a.type)}</span>
                  <span className="db-alert-item__date">{a.date}</span>
                </div>
                <p className="db-alert-item__msg">{a.message}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}

export default Dashboard;
