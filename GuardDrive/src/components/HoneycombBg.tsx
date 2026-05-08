import { useMemo } from 'react';

const W = 28;
const H = W * Math.sqrt(3);
const COLS = 14;
const ROWS = 18;

function hex(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(' ');
}

function tier(col: number, row: number): 0 | 1 | 2 {
  const hash = (col * 7 + row * 13) % 17;
  if (hash === 0) return 2;
  if (hash < 5)  return 1;
  return 0;
}

export function HoneycombBg({ className = 'hc-bg' }: { className?: string }) {
  const hexes = useMemo(() => {
    const items: { cx: number; cy: number; t: 0 | 1 | 2 }[] = [];
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cx = col * W * 1.5 + W;
        const cy = row * H + (col % 2 === 1 ? H / 2 : 0) + H / 2;
        items.push({ cx, cy, t: tier(col, row) });
      }
    }
    return items;
  }, []);

  const vW = COLS * W * 1.5 + W;
  const vH = ROWS * H + H;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${vW} ${vH}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hc-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="100%" stopColor="var(--hc-vignette)" />
        </radialGradient>
      </defs>
      {hexes.map(({ cx, cy, t }, i) => (
        <polygon key={i} points={hex(cx, cy, W * 0.54)} className={`hc hc--t${t}`} />
      ))}
      <rect width="100%" height="100%" fill="url(#hc-vignette)" />
    </svg>
  );
}
