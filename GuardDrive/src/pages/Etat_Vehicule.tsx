import { useRef, useState } from 'react';
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
function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconRoute() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="19" r="3" /><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" /><circle cx="18" cy="5" r="3" />
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
function IconRoad() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17l3-10h12l3 10M12 7v4M10 17h4" />
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

function tireWearClass(pct: number) {
  if (pct < 30) return 'ev-row__val--danger';
  if (pct < 60) return 'ev-row__val--warn';
  return 'ev-row__val--ok';
}

function pressureColor(bar: number) {
  if (bar < 1.8 || bar > 3.2) return '#e57373';
  if (bar < 2.0 || bar > 2.8) return '#fbbf24';
  return '#81c784';
}

function pressureClass(bar: number) {
  if (bar < 1.8 || bar > 3.2) return 'ev-row__val--danger';
  if (bar < 2.0 || bar > 2.8) return 'ev-row__val--warn';
  return 'ev-row__val--ok';
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

function fmtDuration(min: number) {
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`;
}

/* ── Document item ── */
function DocItem({ label, storageKey }: { label: string; storageKey: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const stored = localStorage.getItem(storageKey);
  const [hasFile, setHasFile] = useState(!!stored);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem(storageKey, reader.result as string);
      localStorage.setItem(`${storageKey}_name`, file.name);
      setHasFile(true);
    };
    reader.readAsDataURL(file);
  }

  function handleView() {
    const data = localStorage.getItem(storageKey);
    if (!data) return;
    const win = window.open();
    if (win) {
      win.document.write(`<iframe src="${data}" style="width:100%;height:100vh;border:none"></iframe>`);
    }
  }

  const fileName = localStorage.getItem(`${storageKey}_name`);

  return (
    <div className="ev-doc">
      <div className="ev-doc__icon"><IconFileText /></div>
      <div className="ev-doc__info">
        <div className="ev-doc__name">{label}</div>
        {hasFile
          ? <div className="ev-doc__status ev-doc__status--ok">✓ {fileName ?? 'Fichier enregistré'}</div>
          : <div className="ev-doc__status">Aucun document</div>
        }
      </div>
      <div className="ev-doc__actions">
        {hasFile && (
          <button className="ev-doc__btn" onClick={handleView}>Voir</button>
        )}
        <button className="ev-doc__btn ev-doc__btn--primary" onClick={() => fileRef.current?.click()}>
          {hasFile ? 'Remplacer' : 'Importer'}
        </button>
        <input ref={fileRef} type="file" accept="application/pdf" style={{ display: 'none' }} onChange={handleFile} />
      </div>
    </div>
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
  const nextCtDays = daysUntil(v.controleTechnique);

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
          <EditField label="Kilométrage (km)" value={String(v.mileage ?? 0)} type="number" onSave={val => save('mileage', Number(val))} />
        </div>
      </div>

      {/* ── Pneus ── */}
      <div className="ev-card">
        <div className="ev-card__hd">
          <span className="ev-card__icon"><IconTire /></span>
          <span className="ev-card__title">Pneus</span>
        </div>
        <div className="ev-tires">
          {([['fl', 'Avant G'], ['fr', 'Avant D'], ['rl', 'Arrière G'], ['rr', 'Arrière D']] as const).map(([key, lbl]) => (
            <div className="ev-tire" key={key}>
              <div className="ev-tire__hd">
                <span className="ev-tire__lbl">{lbl}</span>
              </div>

              {/* Usure */}
              <div className="ev-tire__row">
                <span className="ev-tire__sublbl">Usure</span>
                <span className={`ev-tire__val ${tireWearClass(tw[key])}`}>{tw[key]}%</span>
              </div>
              <div className="ev-tire__bar">
                <div className="ev-tire__fill" style={{ width: `${tw[key]}%`, background: tireWearColor(tw[key]) }} />
              </div>

              {/* Pression */}
              <div className="ev-tire__row" style={{ marginTop: 6 }}>
                <span className="ev-tire__sublbl">Pression</span>
                <span className={`ev-tire__val ${pressureClass(tp[key])}`}>{tp[key].toFixed(1)} bar</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Révision ── */}
      <div className="ev-card">
        <div className="ev-card__hd">
          <span className="ev-card__icon"><IconWrench /></span>
          <span className="ev-card__title">Révision</span>
        </div>
        <div className="ev-grid2">
          <EditField label="Dernière révision" value={v.lastService ?? ''} type="date" onSave={val => save('lastService', val)} />
          <EditField label="Prochaine révision" value={v.nextService ?? ''} type="date" onSave={val => save('nextService', val)} />
        </div>
        <div className="ev-rows">
          <div className="ev-row">
            <span className="ev-row__lbl">Dernière révision</span>
            <span className="ev-row__val">{fmtDate(v.lastService)}</span>
          </div>
          <div className="ev-row">
            <span className="ev-row__lbl">Prochaine révision</span>
            <span className={`ev-row__val ${daysUntil(v.nextService) !== null && daysUntil(v.nextService)! < 30 ? 'ev-row__val--warn' : 'ev-row__val--ok'}`}>
              {fmtDate(v.nextService)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Contrôle technique ── */}
      <div className="ev-card">
        <div className="ev-card__hd">
          <span className="ev-card__icon"><IconCalendar /></span>
          <span className="ev-card__title">Contrôle technique</span>
        </div>
        <EditField label="Date du prochain CT" value={v.controleTechnique ?? ''} type="date" onSave={val => save('controleTechnique', val)} />
        {v.controleTechnique && (
          <div className="ev-rows">
            <div className="ev-row">
              <span className="ev-row__lbl">Prochain contrôle</span>
              <span className={`ev-row__val ${ctClass(nextCtDays)}`}>{fmtDate(v.controleTechnique)}</span>
            </div>
            <div className="ev-row">
              <span className="ev-row__lbl">Dans</span>
              <span className={`ev-row__val ${ctClass(nextCtDays)}`}>
                {nextCtDays === null ? '—' : nextCtDays < 0 ? 'Expiré' : `${nextCtDays} jours`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Trajets ── */}
      <div className="ev-card">
        <div className="ev-card__hd">
          <span className="ev-card__icon"><IconRoute /></span>
          <span className="ev-card__title">Derniers trajets</span>
        </div>
        {v.trips && v.trips.length > 0 ? (
          <div className="ev-trips">
            {v.trips.slice(-5).reverse().map((t, i) => (
              <div className="ev-trip" key={i}>
                <span className="ev-trip__icon"><IconRoad /></span>
                <div className="ev-trip__info">
                  <div className="ev-trip__route">
                    {t.from && t.to ? `${t.from} → ${t.to}` : 'Trajet sans nom'}
                  </div>
                  <div className="ev-trip__meta">
                    {t.date ? fmtDate(t.date) : ''}
                    {t.duration ? ` · ${fmtDuration(t.duration)}` : ''}
                  </div>
                </div>
                <span className="ev-trip__dist">{t.distance} km</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="ev-empty">Aucun trajet enregistré</p>
        )}
        <div className="ev-rows">
          <div className="ev-row">
            <span className="ev-row__lbl">Kilométrage total</span>
            <span className="ev-row__val">{(v.mileage ?? 0).toLocaleString('fr-FR')} km</span>
          </div>
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
