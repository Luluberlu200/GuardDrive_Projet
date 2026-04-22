import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/Login.css';

function hexPoints(cx: number, cy: number, r: number): string {
  const h = r * 0.866;
  return [
    [cx,     cy - r],
    [cx + h, cy - r * 0.5],
    [cx + h, cy + r * 0.5],
    [cx,     cy + r],
    [cx - h, cy + r * 0.5],
    [cx - h, cy - r * 0.5],
  ].map(p => p.map(n => Math.round(n * 10) / 10).join(',')).join(' ');
}

function HoneycombBg() {
  const R  = 30;
  const DX = R * 1.732;
  const DY = R * 1.5;

  const hexes: { cx: number; cy: number; tier: 0 | 1 | 2 }[] = [];

  for (let row = -1; row <= 29; row++) {
    for (let col = -1; col <= 16; col++) {
      const cx  = col * DX + (row % 2) * (DX / 2);
      const cy  = row * DY;
      const w   = Math.sin((col + row * 0.5) * 0.9) * Math.sin((row - col * 0.4) * 0.7);
      const tier: 0 | 1 | 2 = w > 0.62 ? 2 : w > 0.12 ? 1 : 0;
      hexes.push({ cx, cy, tier });
    }
  }

  return (
    <svg
      className="auth-honeycomb"
      viewBox="0 0 800 1300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="hglow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="100%" stopColor="var(--auth-vignette)" />
        </radialGradient>
      </defs>

      {hexes.map(({ cx, cy, tier }, i) => (
        <polygon
          key={i}
          points={hexPoints(cx, cy, R - 1.5)}
          className={`hc hc--t${tier}`}
          filter={tier === 2 ? 'url(#hglow)' : undefined}
        />
      ))}

      {/* vignette sur les bords */}
      <rect x="0" y="0" width="800" height="1300" fill="url(#vignette)" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>   <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22"  x2="5.64"  y2="5.64"/>  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>   <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64"  y2="18.36"/> <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => (localStorage.getItem('theme') ?? 'dark') === 'dark'
  );

  function toggle() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setIsDark(!isDark);
  }

  return (
    <button className="auth-theme-toggle" onClick={toggle} aria-label="Changer de thème">
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function AuthLayout() {
  return (
    <div className="auth-shell">
      <HoneycombBg />
      <ThemeToggle />
      <Outlet />
    </div>
  );
}

export default AuthLayout;
