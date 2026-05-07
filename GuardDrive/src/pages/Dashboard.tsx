import { useEffect, useRef, useState } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useVehicle } from '../context/VehicleContext';
import { HoneycombBg } from '../components/HoneycombBg';
import '../styles/dashboard.css';

/* ── SVG Icons ── */
function IconFuelPump() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 22V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M3 22h12M15 8h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.5L21 6" />
      <line x1="7" y1="10" x2="11" y2="10" />
    </svg>
  );
}

function IconBattery({ pct }: { pct: number }) {
  const color = pct < 20 ? '#e57373' : pct < 50 ? '#fbbf24' : '#81c784';
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="16" height="10" rx="2" />
      <rect x="2" y="9" width={Math.round(pct / 100 * 16)} height="6" rx="1" fill={color} stroke="none" opacity="0.7" />
      <line x1="22" y1="11" x2="22" y2="13" strokeWidth="2.5" />
    </svg>
  );
}

function IconLock({ locked }: { locked: boolean }) {
  return locked ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

function IconThermo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </svg>
  );
}

function IconWind() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ── Vehicle Dropdown ── */
function VehicleDropdown() {
  const { vehicles, activeVehicle, setActiveId } = useVehicle();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!activeVehicle) return null;

  return (
    <div className="db-dropdown" ref={ref}>
      <button className="db-dropdown__trigger" onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <span className="db-dropdown__label">{activeVehicle.name}</span>
        <IconChevron open={open} />
      </button>
      {open && (
        <ul className="db-dropdown__menu" role="listbox">
          {vehicles.map(v => (
            <li key={v._id} role="option" aria-selected={v._id === activeVehicle._id}
              className={`db-dropdown__item${v._id === activeVehicle._id ? ' db-dropdown__item--active' : ''}`}
              onClick={() => { setActiveId(v._id); setOpen(false); }}>
              {v._id === activeVehicle._id && <span className="db-dropdown__check"><IconCheck /></span>}
              <span>{v.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Weather Widget ── */
type WeatherData = { temp: number; apparent: number; code: number; city: string };

function weatherEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code <= 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}

function WeatherWidget({ lat, lng }: { lat: number; lng: number }) {
  const [wx, setWx] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!lat || !lng) return;
    Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,weathercode&timezone=auto`).then(r => r.json()),
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`).then(r => r.json()),
    ]).then(([meteo, geo]) => {
      setWx({
        temp: Math.round(meteo.current.temperature_2m),
        apparent: Math.round(meteo.current.apparent_temperature),
        code: meteo.current.weathercode,
        city: geo.address?.city || geo.address?.town || geo.address?.village || 'Votre position',
      });
    }).catch(() => {});
  }, [lat, lng]);

  if (!wx) return null;

  return (
    <div className="db-weather">
      <span className="db-weather__emoji">{weatherEmoji(wx.code)}</span>
      <div className="db-weather__info">
        <span className="db-weather__city"><IconMapPin /> {wx.city}</span>
        <span className="db-weather__temp">{wx.temp}°C <small>ressenti {wx.apparent}°C</small></span>
      </div>
    </div>
  );
}

/* ── Gauge Card ── */
function GaugeCard({ icon, label, value, unit, bar, barColor }: {
  icon: React.ReactNode; label: string; value: string | number; unit?: string;
  bar?: number; barColor?: string;
}) {
  return (
    <div className="db-gauge-card">
      <div className="db-gauge-card__hd">
        <span className="db-gauge-card__icon">{icon}</span>
        <span className="db-gauge-card__label">{label}</span>
      </div>
      <div className="db-gauge-card__val">{value}<span className="db-gauge-card__unit">{unit}</span></div>
      {bar !== undefined && (
        <div className="db-gauge-bar">
          <div className="db-gauge-bar__fill" style={{ width: `${bar}%`, background: barColor ?? '#a4acb8' }} />
        </div>
      )}
    </div>
  );
}

/* ── Climate Control ── */
const MIN_TEMP = 16;
const MAX_TEMP = 28;

function ClimateWidget({ cabinTemp }: { cabinTemp: number }) {
  const [target, setTarget] = useState(cabinTemp);

  function stepTemp(delta: number) {
    setTarget(t => Math.min(MAX_TEMP, Math.max(MIN_TEMP, t + delta)));
  }

  const mode = target < cabinTemp ? 'cool' : target > cabinTemp ? 'heat' : 'off';
  const stateLabel = mode === 'off' ? 'Éteint' : mode === 'cool' ? 'Refroidissement' : 'Chauffage';
  const tempClass = mode === 'cool' ? 'db-climate__temp-val--cool' : mode === 'heat' ? 'db-climate__temp-val--heat' : '';

  return (
    <div className="db-climate">
      <div className="db-climate__hd">
        <span className="db-climate__icon">{mode === 'cool' ? <IconWind /> : <IconThermo />}</span>
        <span className="db-climate__label">Climatisation</span>
        <span className={`db-climate__state db-climate__state--${mode}`}>{stateLabel}</span>
      </div>

      <div className="db-climate__picker">
        <button className="db-climate__step" onClick={() => stepTemp(-1)} disabled={target <= MIN_TEMP} aria-label="Diminuer">−</button>
        <div className="db-climate__temp-display">
          <span className={`db-climate__temp-val ${tempClass}`}>{target}°C</span>
          <span className="db-climate__temp-cabin">cabine {cabinTemp}°C</span>
        </div>
        <button className="db-climate__step" onClick={() => stepTemp(1)} disabled={target >= MAX_TEMP} aria-label="Augmenter">+</button>
      </div>
    </div>
  );
}

/* ── Alert item ── */
type Alert = { _id: string; type: 'intrusion' | 'warning' | 'info'; message: string; date: string };

function labelType(type: string) {
  if (type === 'warning') return 'Avertissement';
  if (type === 'intrusion') return 'Intrusion';
  return 'Info';
}

/* ── Main component ── */
function Dashboard() {
  const navigate = useNavigate();
  const { activeVehicle: v, loading, toggleLock } = useVehicle();
  const [alertes, setAlertes] = useState<Alert[]>([]);
  const [lockPending, setLockPending] = useState(false);

  useEffect(() => { api.get('/alerts').then(d => setAlertes(d.slice(0, 3))); }, []);

  if (loading || !v) return (
    <div className="db-page">
      <div className="db-loader"><span className="db-loader__spinner" /></div>
    </div>
  );

  const isLocked = v.lock === 'locked';

  if (loading || !v) {
    return (
      <>
        <HoneycombBg className="db-hc-bg" />
        <div className="db-page">
          <p style={{ padding: '2rem', color: 'var(--couleur-texte-faible)' }}>Chargement…</p>
        </div>
      </>
    );
  }

  const fuelColor = v.fuel < 20 ? '#e57373' : v.fuel < 40 ? '#fbbf24' : '#81c784';
  const battColor = v.battery < 20 ? '#e57373' : v.battery < 50 ? '#fbbf24' : '#81c784';
  const locked = v.lock === 'locked';

  return (
    <>
      <HoneycombBg className="db-hc-bg" />

      <div className="db-page">

        {/* Header: dropdown + weather */}
        <header className="db-hero">
          <div className="db-hero__top">
            <VehicleDropdown />
          </div>
          {v.lat && v.lng && <WeatherWidget lat={v.lat} lng={v.lng} />}
        </header>

        {/* Lock status */}
        <div className="db-lock">
          <button
            className={`db-lock__badge db-lock__badge--${locked ? 'locked' : 'unlocked'}`}
            onClick={async () => {
              if (lockPending) return;
              setLockPending(true);
              await toggleLock(v._id);
              setLockPending(false);
            }}
            disabled={lockPending}
            aria-label={locked ? 'Déverrouiller le véhicule' : 'Verrouiller le véhicule'}
          >
            <IconLock locked={locked} />
            {lockPending ? '…' : locked ? 'Verrouillé' : 'Déverrouillé'}
          </button>
        </div>

        {/* Gauges grid */}
        <div className="db-gauges">
          <GaugeCard icon={<IconFuelPump />} label="Carburant" value={v.fuel} unit="%" bar={v.fuel} barColor={fuelColor} />
          <GaugeCard icon={<IconBattery pct={v.battery} />} label="Batterie" value={v.battery} unit="%" bar={v.battery} barColor={battColor} />
        </div>

        {/* Climate control */}
        <ClimateWidget cabinTemp={v.temperature} />

        {/* Alerts */}
        <section className="db-alerts">
          <div className="db-alerts__hd">
            <span className="db-alerts__title"><IconBell /> Alertes récentes</span>
            <button className="db-alerts__more" onClick={() => navigate('/alertes')}>Voir tout</button>
          </div>
          {alertes.length === 0 ? (
            <p className="db-alerts__empty">Aucune alerte</p>
          ) : (
            <ul className="db-alerts__list">
              {alertes.map(a => (
                <li key={a._id} className={`db-alert-item db-alert-item--${a.type}`} onClick={() => navigate('/alertes')}>
                  <div className="db-alert-item__row">
                    <span className="db-alert-item__type">{labelType(a.type)}</span>
                    <span className="db-alert-item__date">{new Date(a.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <p className="db-alert-item__msg">{a.message}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default Dashboard;
