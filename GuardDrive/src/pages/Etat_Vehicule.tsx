import { useEffect, useRef, useState } from 'react';
import { HoneycombBg } from '../components/HoneycombBg';
import { useVehicle } from '../context/VehicleContext';
import '../styles/etat-vehicule.css';

/* ── Icons ── */
function IconCar() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-4h10l2 4h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
      <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
    </svg>
  );
}
function IconTire() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconWrench() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}
function IconFileText() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function IconPlate() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="10" rx="2" /><line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  );
}

/* ── Helpers ── */
function tireWearColor(pct: number) {
  if (pct < 30) return '#e57373';
  if (pct < 60) return '#fbbf24';
  return '#81c784';
}

function pressureColor(bar: number) {
  if (bar < 1.8 || bar > 3.2) return '#e57373';
  if (bar < 2.0 || bar > 2.8) return '#fbbf24';
  return '#81c784';
}

/* ── Tire gauge (270° arc) ── */
function TireGauge({ pct, color }: { pct: number; color: string }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const arcLen = circ * 0.75;
  const filled = (pct / 100) * arcLen;
  return (
    <svg width="72" height="72" viewBox="0 0 70 70">
      <g transform="rotate(135, 35, 35)">
        <circle cx="35" cy="35" r={r} fill="none"
          stroke="rgba(164,172,184,0.12)" strokeWidth="5.5"
          strokeDasharray={`${arcLen} ${circ - arcLen}`}
          strokeLinecap="round" />
        <circle cx="35" cy="35" r={r} fill="none"
          stroke={color} strokeWidth="5.5"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.5s ease' }} />
      </g>
      <text x="35" y="36" textAnchor="middle" dominantBaseline="middle"
        fontSize="13" fontWeight="700" fill="currentColor" fontFamily="inherit">
        {pct}%
      </text>
    </svg>
  );
}

function TireCard({ label, wear, pressure }: { label: string; wear: number; pressure: number }) {
  const wColor = tireWearColor(wear);
  const pColor = pressureColor(pressure);
  return (
    <div className="ev-tire-card">
      <span className="ev-tire-card__pos">{label}</span>
      <TireGauge pct={wear} color={wColor} />
      <span className="ev-tire-card__pressure" style={{ color: pColor }}>
        {pressure.toFixed(1)} bar
      </span>
    </div>
  );
}

function fmtDate(d: string) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }); }
  catch { return d; }
}

function daysUntil(d: string): number | null {
  if (!d) return null;
  const diff = new Date(d).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function ctClass(days: number | null) {
  if (days === null) return '';
  if (days < 0) return 'ev-row__val--danger';
  if (days < 60) return 'ev-row__val--warn';
  return 'ev-row__val--ok';
}


/* ── Document viewer modal ── */
function DocModal({ data, name, onClose }: { data: string; name: string; onClose: () => void }) {
  const isImage = data.startsWith('data:image');

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="ev-modal-overlay" onClick={onClose}>
      <div className="ev-modal" onClick={e => e.stopPropagation()}>
        <div className="ev-modal__hd">
          <span className="ev-modal__title">{name}</span>
          <button className="ev-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="ev-modal__body">
          {isImage
            ? <img src={data} alt={name} className="ev-modal__img" />
            : <iframe src={data} className="ev-modal__iframe" title={name} />
          }
        </div>
      </div>
    </div>
  );
}

/* ── Document item ── */
function DocItem({ label, storageKey }: { label: string; storageKey: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const stored = localStorage.getItem(storageKey);
  const [hasFile, setHasFile] = useState(!!stored);
  const [viewing, setViewing] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowed.includes(file.type)) return;
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem(storageKey, reader.result as string);
      localStorage.setItem(`${storageKey}_name`, file.name);
      setHasFile(true);
    };
    reader.readAsDataURL(file);
  }

  const fileName = localStorage.getItem(`${storageKey}_name`);
  const fileData = localStorage.getItem(storageKey);

  return (
    <>
      <div className="ev-doc">
        <div className="ev-doc__icon"><IconFileText /></div>
        <div className="ev-doc__info">
          <div className="ev-doc__name">{label}</div>
          {!hasFile && <div className="ev-doc__status">Aucun document</div>}
        </div>
        <div className="ev-doc__actions">
          {hasFile && (
            <button className="ev-doc__btn" onClick={() => setViewing(true)}>Voir</button>
          )}
          <button className="ev-doc__btn ev-doc__btn--primary" onClick={() => fileRef.current?.click()}>
            {hasFile ? 'Remplacer' : 'Importer'}
          </button>
          <input ref={fileRef} type="file" accept="application/pdf,image/png,image/jpeg" style={{ display: 'none' }} onChange={handleFile} />
        </div>
      </div>
      {viewing && fileData && (
        <DocModal data={fileData} name={fileName ?? label} onClose={() => setViewing(false)} />
      )}
    </>
  );
}


/* ── Editable field ── */
function EditField({ label, value, type = 'text', onSave }: {
  label: string; value: string; type?: string; onSave: (v: string) => Promise<void>;
}) {
  const [val, setVal] = useState(value);
  const [saving, setSaving] = useState(false);
  const dirty = val !== value;

  async function save() {
    if (!dirty) return;
    setSaving(true);
    await onSave(val);
    setSaving(false);
  }

  return (
    <div className="ev-field">
      <span className="ev-field__lbl">{label}</span>
      <div className="ev-field__row">
        <input
          className="ev-field__inp"
          type={type}
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
        />
        {dirty && (
          <button className="ev-field__save" onClick={save} disabled={saving}>
            {saving ? '…' : 'Sauver'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main page ── */
function EtatVehicule() {
  const { activeVehicle: v, updateVehicle } = useVehicle();
  const [toast, setToast] = useState('');

  if (!v) {
    return (
      <div className="ev">
        <div className="ev-card">
          <p className="ev-empty">Aucun véhicule sélectionné.</p>
        </div>
      </div>
    );
  }

  async function save(field: string, value: unknown) {
    await updateVehicle(v!._id, { [field]: value } as never);
    setToast('Sauvegardé ✓');
    setTimeout(() => setToast(''), 2000);
  }

  const tw = v.tireWear ?? { fl: 80, fr: 80, rl: 75, rr: 75 };
  const tp = v.tirePressureWheels ?? { fl: 2.3, fr: 2.3, rl: 2.2, rr: 2.2 };
  return (
    <>
    <HoneycombBg className="hc-bg-fixed" />
    <div className="ev">

      {/* ── Identité ── */}
      <div className="ev-card">
        <div className="ev-card__hd">
          <span className="ev-card__icon"><IconCar /></span>
          <span className="ev-card__title">Identité du véhicule</span>
        </div>
        <div className="ev-hero">
          <div className="ev-hero__avatar"><IconCar /></div>
          <div className="ev-hero__info">
            <p className="ev-hero__name">{v.name}</p>
            <span className="ev-hero__plate">
              <IconPlate />
              {v.plateNumber || 'Plaque non renseignée'}
            </span>
          </div>
        </div>
        <div className="ev-grid2">
          <EditField label="Plaque d'immatriculation" value={v.plateNumber ?? ''} onSave={val => save('plateNumber', val.toUpperCase())} />
          <div className="ev-field">
            <span className="ev-field__lbl">Kilométrage total</span>
            <div className="ev-field__readonly">{(v.mileage ?? 0).toLocaleString('fr-FR')} km</div>
          </div>
          <div className="ev-field">
            <span className="ev-field__lbl">Dernier trajet</span>
            <div className="ev-field__readonly">
              {v.lastTripDistance > 0 ? `${v.lastTripDistance} km` : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Pneus ── */}
      <div className="ev-card">
        <div className="ev-card__hd">
          <span className="ev-card__icon"><IconTire /></span>
          <span className="ev-card__title">Pneus</span>
        </div>
        <div className="ev-tire-map">
          <TireCard label="AV-G" wear={tw.fl} pressure={tp.fl} />
          <TireCard label="AV-D" wear={tw.fr} pressure={tp.fr} />
          <TireCard label="AR-G" wear={tw.rl} pressure={tp.rl} />
          <TireCard label="AR-D" wear={tw.rr} pressure={tp.rr} />
        </div>
      </div>

      {/* ── Entretien ── */}
      <div className="ev-card">
        <div className="ev-card__hd">
          <span className="ev-card__icon"><IconWrench /></span>
          <span className="ev-card__title">Contrôle technique</span>
        </div>
        <div className="ev-grid2">
          <EditField label="Dernier entretien" value={v.lastService ?? ''} type="date" onSave={val => save('lastService', val)} />
          <EditField label="Prochain entretien" value={v.nextService ?? ''} type="date" onSave={val => save('nextService', val)} />
        </div>
        <div className="ev-rows">
          <div className="ev-row">
            <span className="ev-row__lbl">Dernier entretien</span>
            <span className="ev-row__val">{fmtDate(v.lastService)}</span>
          </div>
          <div className="ev-row">
            <span className="ev-row__lbl">Prochain entretien</span>
            <span className={`ev-row__val ${daysUntil(v.nextService) !== null && daysUntil(v.nextService)! < 30 ? 'ev-row__val--warn' : 'ev-row__val--ok'}`}>
              {fmtDate(v.nextService)}
            </span>
          </div>
          {v.nextService && (
            <div className="ev-row">
              <span className="ev-row__lbl">Dans</span>
              <span className={`ev-row__val ${ctClass(daysUntil(v.nextService))}`}>
                {daysUntil(v.nextService) === null ? '—' : daysUntil(v.nextService)! < 0 ? 'Dépassé' : `${daysUntil(v.nextService)} jours`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Documents ── */}
      <div className="ev-card">
        <div className="ev-card__hd">
          <span className="ev-card__icon"><IconFileText /></span>
          <span className="ev-card__title">Documents</span>
        </div>
        <div className="ev-docs">
          <DocItem label="Carte grise" storageKey={`doc_cg_${v._id}`} />
          <DocItem label="Permis de conduire" storageKey={`doc_permis_${v._id}`} />
        </div>
      </div>

      {toast && <div className="ev-toast">{toast}</div>}
    </div>
    </>
  );
}

export default EtatVehicule;
