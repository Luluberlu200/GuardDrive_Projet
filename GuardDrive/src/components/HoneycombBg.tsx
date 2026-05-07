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

type HoneycombBgProps = {
  className?: string;
};

export function HoneycombBg({ className = 'hc-bg' }: HoneycombBgProps) {
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
      className={className}
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
        <radialGradient id="hc-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="100%" stopColor="var(--hc-vignette, rgba(4,3,10,0.82))" />
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

      <rect x="0" y="0" width="800" height="1300" fill="url(#hc-vignette)" />
    </svg>
  );
}
