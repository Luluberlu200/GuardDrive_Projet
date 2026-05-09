import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HoneycombBg } from '../components/HoneycombBg';
import { useAuth } from '../context/AuthContext';
import { useVehicle } from '../context/VehicleContext';
import { api } from '../services/api';
import '../styles/settings.css';

function initials(name: string) {
	const parts = name.trim().split(/\s+/);
	return parts.length === 1
		? (parts[0][0] ?? '?').toUpperCase()
		: (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function IconUser() {
	return (
		<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	);
}

function IconCar() {
	return (
		<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2" />
			<rect x="6" y="14" width="12" height="6" rx="2" />
			<path d="M6 7l2-4h8l2 4" />
		</svg>
	);
}

function IconMoon() {
	return (
		<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	);
}

function Settings() {
	const navigate = useNavigate();
	const { user, updateUser, logout } = useAuth();
	const { vehicles, activeVehicle, setActiveId, addVehicle, deleteVehicle } = useVehicle();

	const [name, setName] = useState(user?.name ?? '');
	const [email, setEmail] = useState(user?.email ?? '');
	const [profileLoading, setProfileLoading] = useState(false);
	const [profileSuccess, setProfileSuccess] = useState(false);
	const [profileError, setProfileError] = useState('');

	const [isDark, setIsDark] = useState(() => (localStorage.getItem('theme') ?? 'dark') === 'dark');
	const [showAddForm, setShowAddForm] = useState(false);
	const [newVehicleName, setNewVehicleName] = useState('');
	const [addLoading, setAddLoading] = useState(false);
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	async function handleProfileSubmit(e: { preventDefault: () => void }) {
		e.preventDefault();
		setProfileLoading(true);
		setProfileError('');
		setProfileSuccess(false);
		const data = await api.patch('/auth/me', { name, email });
		setProfileLoading(false);
		if (data.id) {
			updateUser({ name: data.name, email: data.email });
			setProfileSuccess(true);
		} else {
			setProfileError(data.message ?? 'Une erreur est survenue');
		}
	}

	async function handleAddVehicle(e: { preventDefault: () => void }) {
		e.preventDefault();
		if (!newVehicleName.trim()) return;
		setAddLoading(true);
		const ok = await addVehicle(newVehicleName.trim());
		setAddLoading(false);
		if (ok) { setNewVehicleName(''); setShowAddForm(false); }
	}

	async function handleDelete(id: string) {
		if (confirmDeleteId !== id) { setConfirmDeleteId(id); return; }
		await deleteVehicle(id);
		setConfirmDeleteId(null);
	}

	function handleLogout() {
		logout();
		navigate('/login');
	}

	function toggleTheme() {
		const next = isDark ? 'light' : 'dark';
		document.documentElement.setAttribute('data-theme', next);
		localStorage.setItem('theme', next);
		setIsDark(!isDark);
	}

	return (
		<>
		<HoneycombBg className="hc-bg-fixed" />
		<div className="sp">

			{/* ── Identity hero ── */}
			<div className="sp-hero">
				<div className="sp-avatar">{initials(user?.name ?? '?')}</div>
				<div className="sp-hero__text">
					<p className="sp-hero__name">{user?.name}</p>
					<p className="sp-hero__email">{user?.email}</p>
				</div>
			</div>

			{/* ── Profil ── */}
			<div className="sp-group">
				<div className="sp-group__hd">
					<span className="sp-group__icon"><IconUser /></span>
					<span className="sp-group__label">Profil</span>
				</div>

				<form className="sp-form" onSubmit={handleProfileSubmit}>
					<div className="sp-field">
						<label className="sp-field__lbl">Nom</label>
						<input className="sp-field__inp" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Votre nom" required />
					</div>
					<div className="sp-field">
						<label className="sp-field__lbl">Adresse email</label>
						<input className="sp-field__inp" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Votre email" required />
					</div>
					{profileError && <p className="sp-msg sp-msg--err">{profileError}</p>}
					{profileSuccess && <p className="sp-msg sp-msg--ok">Profil mis à jour avec succès.</p>}
					<button className="sp-btn" type="submit" disabled={profileLoading}>
						{profileLoading ? 'Enregistrement…' : 'Enregistrer les modifications'}
					</button>
				</form>
			</div>

			{/* ── Véhicules ── */}
			<div className="sp-group">
				<div className="sp-group__hd">
					<span className="sp-group__icon"><IconCar /></span>
					<span className="sp-group__label">Mes véhicules</span>
				</div>

				<ul className="sp-vlist">
					{vehicles.map(v => {
						const isActive = activeVehicle?._id === v._id;
						const isConfirming = confirmDeleteId === v._id;
						return (
							<li key={v._id} className={`sp-vitem${isActive ? ' sp-vitem--active' : ''}`}>
								<button className="sp-vitem__body" onClick={() => setActiveId(v._id)}>
									<span className="sp-vitem__check">{isActive && '✓'}</span>
									<span className="sp-vitem__name">{v.name}</span>
									{isActive && <span className="sp-vitem__pill">Actif</span>}
								</button>
								<button
									className={`sp-vitem__del${isConfirming ? ' sp-vitem__del--warn' : ''}`}
									onClick={() => handleDelete(v._id)}
									disabled={vehicles.length === 1}
									title={vehicles.length === 1 ? 'Dernier véhicule' : undefined}
								>
									{isConfirming ? 'Confirmer ?' : 'Retirer'}
								</button>
							</li>
						);
					})}
				</ul>

				{showAddForm ? (
					<form className="sp-add" onSubmit={handleAddVehicle}>
						<input
							className="sp-field__inp"
							type="text"
							value={newVehicleName}
							onChange={e => setNewVehicleName(e.target.value)}
							placeholder="Nom du véhicule"
							autoFocus
							required
						/>
						<div className="sp-add__row">
							<button className="sp-btn" type="submit" disabled={addLoading}>
								{addLoading ? 'Ajout…' : 'Ajouter'}
							</button>
							<button className="sp-btn sp-btn--ghost" type="button" onClick={() => { setShowAddForm(false); setNewVehicleName(''); }}>
								Annuler
							</button>
						</div>
					</form>
				) : (
					<button className="sp-add-trigger" onClick={() => setShowAddForm(true)}>
						<span className="sp-add-trigger__plus">+</span>
						Ajouter un véhicule
					</button>
				)}
			</div>

			{/* ── Apparence ── */}
			<div className="sp-group">
				<div className="sp-group__hd">
					<span className="sp-group__icon"><IconMoon /></span>
					<span className="sp-group__label">Apparence</span>
				</div>

				<div className="sp-row">
					<div>
						<p className="sp-row__title">Mode sombre</p>
						<p className="sp-row__sub">{isDark ? 'Interface sombre activée' : 'Interface claire activée'}</p>
					</div>
					<button className={`sp-toggle${isDark ? ' sp-toggle--on' : ''}`} onClick={toggleTheme} aria-pressed={isDark}>
						<span className="sp-toggle__knob" />
					</button>
				</div>
			</div>

			{/* ── Compte ── */}
			<div className="sp-group sp-group--danger">
				<button className="sp-logout" onClick={handleLogout}>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<polyline points="16 17 21 12 16 7" />
						<line x1="21" y1="12" x2="9" y2="12" />
					</svg>
					Se déconnecter
				</button>
			</div>

		</div>
		</>
	);
}

export default Settings;
