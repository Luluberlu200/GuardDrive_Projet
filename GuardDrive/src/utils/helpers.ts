export function tireWearColor(pct: number): string {
  if (pct < 30) return '#e57373';
  if (pct < 60) return '#fbbf24';
  return '#81c784';
}

export function pressureColor(bar: number): string {
  if (bar < 1.8 || bar > 3.2) return '#e57373';
  if (bar < 2.0 || bar > 2.8) return '#fbbf24';
  return '#81c784';
}

export function fuelColor(pct: number): string {
  if (pct < 20) return '#e57373';
  if (pct < 40) return '#fbbf24';
  return '#81c784';
}

export function batteryColor(pct: number): string {
  if (pct < 20) return '#e57373';
  if (pct < 50) return '#fbbf24';
  return '#81c784';
}

export function fmtDate(d: string): string {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function daysUntil(d: string): number | null {
  if (!d) return null;
  const diff = new Date(d).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

export function weatherEmoji(code: number): string {
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

export function labelAlertType(type: string): string {
  if (type === 'warning') return 'Avertissement';
  if (type === 'intrusion') return 'Intrusion';
  return 'Info';
}
