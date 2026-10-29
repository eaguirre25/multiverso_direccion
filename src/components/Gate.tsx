import { useMemo } from 'react';

/* Portal dimensional: anillo de energía irregular, borde con espesor,
   interior que deja ver "otro mundo", chispas y trazos orbitales.
   El color se define con --h (matiz) y se comparte la paleta general. */

export function GateDefs() {
  return <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
    <defs>
      <filter id="gate-energy" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="12" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="20" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="gate-energy2" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="G" yChannelSelector="R" />
      </filter>
      <filter id="gate-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="5" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="gate-bloom" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14" /></filter>
      <filter id="gate-swirl" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed="9" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="B" />
      </filter>
    </defs>
  </svg>;
}

function rnd(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export function GateArt({ seed = 1, id, hue }: { seed?: number; id: string; hue: number }) {
  const art = useMemo(() => {
    const r = rnd(seed * 977 + 13);
    // chispas: segmentos cortos desprendidos del anillo
    const sparks = Array.from({ length: 26 }, () => {
      const a = r() * Math.PI * 2; const r0 = 76 + r() * 10; const len = 2 + r() * 8; const drift = r() * 9;
      return { x1: 120 + Math.cos(a) * r0, y1: 120 + Math.sin(a) * r0, x2: 120 + Math.cos(a + 0.02) * (r0 + len + drift), y2: 120 + Math.sin(a + 0.02) * (r0 + len + drift), w: 0.8 + r() * 1.8, o: 0.5 + r() * 0.5 };
    });
    const dashA = Array.from({ length: 12 }, () => (r() * 26 + 2).toFixed(1)).join(' ');
    const dashB = Array.from({ length: 10 }, () => (r() * 40 + 3).toFixed(1)).join(' ');
    const motes = Array.from({ length: 12 }, () => ({ a: r() * 360, d: 96 + r() * 20, s: 1 + r() * 2.2 }));
    const inner = Array.from({ length: 16 }, () => { const a = r() * 6.28, d = r() * 56; return { x: 120 + Math.cos(a) * d, y: 120 + Math.sin(a) * d, r: 0.5 + r() * 1.3, o: 0.35 + r() * 0.6 }; });
    return { sparks, dashA, dashB, motes, inner };
  }, [seed]);
  const g = (n: string) => `${id}-${n}`;
  const hsl = (s: number, l: number, a = 1) => `hsl(${hue} ${s}% ${l}% / ${a})`;
  return <svg className="gate-art" viewBox="0 0 240 240" aria-hidden="true">
    <defs>
      <radialGradient id={g('halo')} cx=".5" cy=".5" r=".5"><stop offset="0.45" stopColor={hsl(95, 62, 0.55)} /><stop offset="0.7" stopColor={hsl(90, 55, 0.18)} /><stop offset="1" stopColor={hsl(90, 55, 0)} /></radialGradient>
      <radialGradient id={g('inner')} cx=".42" cy=".4" r=".7"><stop offset="0" stopColor={hsl(85, 30, 1)} /><stop offset=".3" stopColor={hsl(80, 20, 1)} /><stop offset=".7" stopColor={hsl(70, 10, 1)} /><stop offset="1" stopColor="#04040a" /></radialGradient>
      <linearGradient id={g('rim')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={hsl(100, 92, 1)} /><stop offset=".5" stopColor={hsl(100, 74, 1)} /><stop offset="1" stopColor={hsl(90, 52, 1)} /></linearGradient>
      <clipPath id={g('clip')}><circle cx="120" cy="120" r="63" /></clipPath>
    </defs>
    <circle className="gate-halo" cx="120" cy="120" r="118" fill={`url(#${g('halo')})`} />
    {/* interior: otro mundo */}
    <circle cx="120" cy="120" r="66" fill={`url(#${g('inner')})`} />
    <g clipPath={`url(#${g('clip')})`}>
      <g className="gate-spin-slow" style={{ transformOrigin: '120px 120px' }}>
        <g filter="url(#gate-swirl)" opacity=".85">
          <path d="M120 120 m-10 0 a10 10 0 1 1 20 0 a22 22 0 1 1 -44 0 a34 34 0 1 1 68 0 a46 46 0 1 1 -92 0 a58 58 0 1 1 116 0" fill="none" stroke={hsl(90, 78, 0.75)} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M120 120 m6 0 a6 6 0 1 0 -12 0 a18 18 0 1 0 36 0 a30 30 0 1 0 -60 0 a42 42 0 1 0 84 0" fill="none" stroke={hsl(60, 90, 0.6)} strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      {art.inner.map((m, i) => <circle key={i} cx={m.x} cy={m.y} r={m.r} fill="#fff2d4" opacity={m.o} />)}
      <ellipse cx="94" cy="92" rx="30" ry="20" fill={hsl(90, 78, 0.16)} transform="rotate(-30 94 92)" />
      <circle cx="120" cy="120" r="63" fill="none" stroke="#02020a" strokeOpacity=".7" strokeWidth="12" />
    </g>
    {/* anillo de energía con espesor */}
    <circle cx="120" cy="120" r="70" fill="none" stroke={hsl(100, 60, 0.9)} strokeWidth="13" filter="url(#gate-bloom)" opacity=".7" />
    <g className="gate-spin" style={{ transformOrigin: '120px 120px' }}>
      <circle cx="120" cy="120" r="70" fill="none" stroke={`url(#${g('rim')})`} strokeWidth="8" filter="url(#gate-energy)" />
    </g>
    <g className="gate-spin-rev" style={{ transformOrigin: '120px 120px' }}>
      <circle cx="120" cy="120" r="73" fill="none" stroke={hsl(100, 90, 1)} strokeWidth="2.4" strokeDasharray={art.dashA} strokeLinecap="round" filter="url(#gate-energy2)" />
    </g>
    <circle cx="120" cy="120" r="66.5" fill="none" stroke={hsl(100, 95, 0.95)} strokeWidth="1.8" filter="url(#gate-glow)" />
    <path d="M120 49a71 71 0 0 1 68 50" fill="none" stroke="#fff6e0" strokeOpacity=".75" strokeWidth="2" strokeLinecap="round" filter="url(#gate-glow)" />
    {/* trazos orbitales y chispas */}
    <g className="gate-spin" style={{ transformOrigin: '120px 120px', animationDuration: '34s' }}>
      <ellipse cx="120" cy="120" rx="96" ry="40" fill="none" stroke={hsl(100, 92, 0.9)} strokeWidth="1.1" strokeDasharray={art.dashB} strokeLinecap="round" transform="rotate(-28 120 120)" />
    </g>
    <g className="gate-spin-rev" style={{ transformOrigin: '120px 120px', animationDuration: '46s' }}>
      <ellipse cx="120" cy="120" rx="100" ry="30" fill="none" stroke="#ffe7b0" strokeOpacity=".8" strokeWidth=".9" strokeDasharray="1 12 3 30 1 9" strokeLinecap="round" transform="rotate(38 120 120)" />
    </g>
    <g className="gate-sparks">
      {art.sparks.map((s, i) => <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={i % 5 === 0 ? '#fff0c8' : hsl(100, 95, 1)} strokeWidth={s.w} strokeLinecap="round" opacity={s.o} />)}
    </g>
    <g className="gate-spin" style={{ transformOrigin: '120px 120px', animationDuration: '60s' }}>
      {art.motes.map((m, i) => <circle key={i} cx={120 + Math.cos((m.a * Math.PI) / 180) * m.d} cy={120 + Math.sin((m.a * Math.PI) / 180) * m.d * 0.82} r={m.s} fill="#ffe8b8" opacity=".85" />)}
    </g>
  </svg>;
}
