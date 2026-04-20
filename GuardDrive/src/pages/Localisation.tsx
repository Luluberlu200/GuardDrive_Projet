import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useVehicle } from '../context/VehicleContext';
import '../styles/localisation.css';

const markerIcon = L.divIcon({
	className: '',
	html: `<div class="loc-marker"><div class="loc-marker__ring"></div><div class="loc-marker__dot"></div></div>`,
	iconSize: [20, 20],
	iconAnchor: [10, 10],
	popupAnchor: [0, -12],
});

async function reverseGeocode(lat: number, lng: number): Promise<string> {
	const res = await fetch(
		`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
		{ headers: { 'Accept-Language': 'fr' } }
	);
	const data = await res.json();
	const a = data.address ?? {};
	const parts = [a.road, a.house_number, a.city ?? a.town ?? a.village].filter(Boolean);
	return parts.length ? parts.join(' ') : data.display_name ?? 'Adresse inconnue';
}

function IconHorn() {
	return (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
			<path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
			<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
		</svg>
	);
}

function IconLight() {
	return (
		<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<circle cx="12" cy="12" r="5" />
			<line x1="12" y1="1" x2="12" y2="3" />
			<line x1="12" y1="21" x2="12" y2="23" />
			<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
			<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
			<line x1="1" y1="12" x2="3" y2="12" />
			<line x1="21" y1="12" x2="23" y2="12" />
			<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
			<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
		</svg>
	);
}

function Localisation() {
	const { activeVehicle, loading } = useVehicle();
	const [address, setAddress] = useState('Chargement de l\'adresse…');
	const [hornActive, setHornActive] = useState(false);
	const [lightsActive, setLightsActive] = useState(false);

	const lat = activeVehicle?.lat ?? 48.8566;
	const lng = activeVehicle?.lng ?? 2.3522;

	useEffect(() => {
		setAddress('Chargement de l\'adresse…');
		reverseGeocode(lat, lng).then(setAddress);
	}, [lat, lng]);

	function handleHorn() {
		setHornActive(true);
		setTimeout(() => setHornActive(false), 1500);
	}

	if (loading) {
		return (
			<div className="loc">
				<div className="loc-map loc-map--loading">
					<p>Chargement…</p>
				</div>
			</div>
		);
	}

	return (
		<div className="loc">
			<div className="loc-map">
				<MapContainer center={[lat, lng]} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
					<TileLayer
						url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
					/>
					<Marker position={[lat, lng]} icon={markerIcon}>
						<Popup>{activeVehicle?.name ?? 'Véhicule'}</Popup>
					</Marker>
				</MapContainer>
			</div>

			<div className="loc-card">
				<div className="loc-card__info">
					<p className="loc-card__name">{activeVehicle?.name ?? '—'}</p>
					<p className="loc-card__address">{address}</p>
				</div>

				<div className="loc-actions">
					<button className={`loc-action${hornActive ? ' loc-action--active' : ''}`} onClick={handleHorn}>
						<IconHorn />
						<span>Klaxonner</span>
					</button>
					<button className={`loc-action${lightsActive ? ' loc-action--on' : ''}`} onClick={() => setLightsActive(v => !v)}>
						<IconLight />
						<span>{lightsActive ? 'Éteindre' : 'Phares'}</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Localisation;
