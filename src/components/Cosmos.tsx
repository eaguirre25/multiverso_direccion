import { useEffect, useRef } from 'react';

/* ------------------------------------------------------------------
   Universo procedural: nebulosas con gas y polvo oscuro (ruido fractal
   con distorsión de dominio), estrellas en cúmulos y tres planos de
   parallax. Se dibuja una sola vez en canvas; el movimiento es lento.
------------------------------------------------------------------- */

function rng(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

function makeNoise(seed: number) {
  const r = rng(seed); const perm = new Uint8Array(512); const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const grad = (h: number, x: number, y: number) => { switch (h & 7) { case 0: return x + y; case 1: return x - y; case 2: return -x + y; case 3: return -x - y; case 4: return x; case 5: return -x; case 6: return y; default: return -y; } };
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y); const xf = x - xi, yf = y - yi; const X = xi & 255, Y = yi & 255;
    const u = fade(xf), v = fade(yf);
    const aa = perm[perm[X] + Y], ab = perm[perm[X] + Y + 1], ba = perm[perm[X + 1] + Y], bb = perm[perm[X + 1] + Y + 1];
    const x1 = grad(aa, xf, yf) + u * (grad(ba, xf - 1, yf) - grad(aa, xf, yf));
    const x2 = grad(ab, xf, yf - 1) + u * (grad(bb, xf - 1, yf - 1) - grad(ab, xf, yf - 1));
    return (x1 + v * (x2 - x1)) * 0.7071; // ~[-1,1]
  };
  const fbm = (x: number, y: number, oct = 5) => { let s = 0, a = 0.5, f = 1; for (let i = 0; i < oct; i++) { s += a * noise(x * f, y * f); f *= 2.03; a *= 0.5; } return s; };
  return { noise, fbm };
}
const sm = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

function paintNebula(nebula: HTMLCanvasElement, dust: HTMLCanvasElement) {
  const W = nebula.width, H = nebula.height;
  const { fbm, noise } = makeNoise(77);
  const c = nebula.getContext('2d')!; const img = c.createImageData(W, H); const d = img.data;
  const dc = dust.getContext('2d')!; const dimg = dc.createImageData(W, H); const dd = dimg.data;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const u = x / W, v = y / H; const px = u * 3.2, py = v * 1.8;
      // distorsión de dominio: da filamentos y volutas orgánicas
      const wx = fbm(px * 0.9 + 4.1, py * 0.9 + 1.7, 4), wy = fbm(px * 0.9 - 2.3, py * 0.9 + 6.2, 4);
      const qx = px + wx * 1.6, qy = py + wy * 1.6;
      const gas = fbm(qx * 1.2, qy * 1.2, 6) * 1.25 + 0.5;
      const gas2 = fbm(qx * 0.9 + 9, qy * 0.9 - 3, 5) * 1.25 + 0.5;
      // zonas: grandes regiones de vacío y regiones cargadas
      const region = fbm(u * 1.6 + 2, v * 1.3 - 1, 3) * 1.25 + 0.5;
      const mask = sm(0.38, 0.72, region);
      const violet = Math.pow(sm(0.38, 0.86, gas), 1.6) * mask;
      const blue = Math.pow(sm(0.42, 0.9, gas2), 1.8) * (0.35 + 0.65 * sm(0.3, 0.7, 1 - region));
      // turquesa hacia abajo-derecha; ámbar hacia arriba-izquierda y detrás del centro
      const teal = Math.pow(sm(0.5, 0.9, gas2 * 0.7 + gas * 0.3), 2) * sm(0.35, 1, u * 0.7 + v * 0.55);
      const amber = Math.pow(sm(0.52, 0.92, gas), 2.4) * (sm(0.75, 0.0, Math.hypot(u - 0.18, v - 0.2) * 1.3) * 0.8 + sm(0.5, 0.0, Math.hypot(u - 0.5, v - 0.55)) * 0.5);
      // polvo oscuro: crestas (valores absolutos del ruido) que recortan el gas
      const ridge = 1 - Math.abs(fbm(qx * 1.7 + 20, qy * 1.7 + 5, 5)) * 2.2;
      const dustAmt = Math.pow(Math.max(0, ridge), 2.2) * sm(0.25, 0.7, region + 0.15);
      // color
      let r = 4 + 3 * v, g = 5 + 4 * v, b = 13 + 8 * v;
      r += violet * 96 + blue * 18 + teal * 10 + amber * 150;
      g += violet * 52 + blue * 52 + teal * 118 + amber * 92;
      b += violet * 170 + blue * 130 + teal * 128 + amber * 46;
      const k = 1 - dustAmt * 0.9;
      r *= k; g *= k; b *= k;
      // brillo suave en las crestas del gas
      const rim = Math.pow(Math.max(0, gas - 0.62), 2) * 4;
      r += rim * 55; g += rim * 34; b += rim * 80;
      const vig = 1 - 0.55 * Math.pow(Math.hypot(u - 0.5, (v - 0.5) * 1.15) * 1.25, 2.4);
      const i = (y * W + x) * 4;
      img.data[i] = Math.min(255, r * vig); img.data[i + 1] = Math.min(255, g * vig); img.data[i + 2] = Math.min(255, b * vig); img.data[i + 3] = 255;
      // nubes de polvo en primer plano (alfa), concentradas en los bordes
      const edge = sm(0.22, 0.62, Math.hypot((u - 0.5) * 1.1, (v - 0.5) * 1.5));
      const cloud = sm(0.5, 0.78, fbm(u * 3.4 + 40, v * 2.4 + 12, 5) * 1.25 + 0.5);
      const a = Math.min(1, cloud * edge * 1.05);
      dd[i] = 3; dd[i + 1] = 3; dd[i + 2] = 10; dd[i + 3] = a * 255 * 0.92;
    }
  }
  void noise; void d;
  c.putImageData(img, 0, 0); dc.putImageData(dimg, 0, 0);
}

function paintStars(far: HTMLCanvasElement, near: HTMLCanvasElement) {
  const W = far.width, H = far.height; const r = rng(31337); const { fbm } = makeNoise(5);
  const fc = far.getContext('2d')!; const nc = near.getContext('2d')!;
  const tint = ['#fff4de', '#ffe9c2', '#d9e6ff', '#c3d4ff', '#ffd9a8', '#cdeeff'];
  // densidad: banda diagonal tipo vía láctea + cúmulos
  const density = (u: number, v: number) => {
    const band = Math.exp(-Math.pow((v - (0.28 + u * 0.46)) * 3.1, 2));
    return 0.1 + band * 0.75 + Math.max(0, fbm(u * 5, v * 5, 3)) * 0.8;
  };
  const place = (n: number, fn: (x: number, y: number, rr: number) => void) => {
    let placed = 0, guard = 0;
    while (placed < n && guard++ < n * 40) { const x = r() * W, y = r() * H; if (r() < density(x / W, y / H)) { fn(x, y, r()); placed++; } }
  };
  fc.globalCompositeOperation = 'lighter';
  place(5200, (x, y, rr) => { fc.globalAlpha = 0.18 + rr * 0.5; fc.fillStyle = tint[Math.floor(r() * tint.length)]; const s = rr > 0.93 ? 1.6 : 1; fc.fillRect(x, y, s, s); });
  place(240, (x, y, rr) => {
    const rad = 1.6 + rr * 2.4; const col = tint[Math.floor(r() * tint.length)];
    const g = fc.createRadialGradient(x, y, 0, x, y, rad * 2.4); g.addColorStop(0, col); g.addColorStop(0.18, col + 'cc'); g.addColorStop(1, col + '00');
    fc.globalAlpha = 0.35 + rr * 0.4; fc.fillStyle = g; fc.beginPath(); fc.arc(x, y, rad * 2.4, 0, 7); fc.fill();
  });
  nc.globalCompositeOperation = 'lighter';
  place(64, (x, y, rr) => {
    const col = tint[Math.floor(r() * tint.length)]; const rad = 2 + rr * 3;
    const g = nc.createRadialGradient(x, y, 0, x, y, rad * 3.4); g.addColorStop(0, '#ffffff'); g.addColorStop(0.1, col + 'ee'); g.addColorStop(0.35, col + '55'); g.addColorStop(1, col + '00');
    nc.globalAlpha = 0.55 + rr * 0.4; nc.fillStyle = g; nc.beginPath(); nc.arc(x, y, rad * 3.4, 0, 7); nc.fill();
    if (rr > 0.72) { // destello con espiga de difracción
      nc.globalAlpha = 0.5; nc.strokeStyle = col; nc.lineWidth = 0.8;
      const L = 14 + rr * 42; nc.beginPath(); nc.moveTo(x - L, y); nc.lineTo(x + L, y); nc.moveTo(x, y - L * 0.8); nc.lineTo(x, y + L * 0.8); nc.stroke();
    }
  });
  // bokeh lejano: círculos muy suaves ámbar y turquesa
  nc.globalAlpha = 1;
  for (let i = 0; i < 26; i++) {
    const x = r() * W, y = r() * H, rad = 18 + r() * 55; const col = r() < 0.55 ? '255,190,100' : '90,210,215';
    const g = nc.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(${col},0.05)`); g.addColorStop(0.8, `rgba(${col},0.03)`); g.addColorStop(1, `rgba(${col},0)`);
    nc.fillStyle = g; nc.beginPath(); nc.arc(x, y, rad, 0, 7); nc.fill();
  }
}

export default function Cosmos() {
  const root = useRef<HTMLDivElement>(null);
  const nebula = useRef<HTMLCanvasElement>(null);
  const dust = useRef<HTMLCanvasElement>(null);
  const far = useRef<HTMLCanvasElement>(null);
  const near = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (nebula.current && dust.current) paintNebula(nebula.current, dust.current);
      if (far.current && near.current) paintStars(far.current, near.current);
      root.current?.classList.add('cosmos-ready');
    }, 20);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0; let tx = 0, ty = 0, cx = 0, cy = 0; const t0 = performance.now();
    const onMove = (e: PointerEvent) => { tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5; };
    const tick = (now: number) => {
      const t = (now - t0) / 1000; const el = root.current;
      cx += (tx - cx) * 0.04; cy += (ty - cy) * 0.04;
      if (el) {
        const st = el.style; st.setProperty('--px', cx.toFixed(4)); st.setProperty('--py', cy.toFixed(4));
        // deriva autónoma por profundidad: lenta, continua y sin saltos (el fondo se mueve aunque el mouse esté quieto)
        st.setProperty('--nx', (Math.sin(t / 22) * 18).toFixed(2)); st.setProperty('--ny', (Math.cos(t / 27) * 12).toFixed(2));
        st.setProperty('--fx', (Math.sin(t / 25) * 14).toFixed(2)); st.setProperty('--fy', (Math.sin(t / 31) * 8).toFixed(2));
        st.setProperty('--rx', (Math.sin(t / 17 + 1) * 34).toFixed(2)); st.setProperty('--ry', (Math.cos(t / 19) * 22).toFixed(2));
        st.setProperty('--dx', (Math.sin(t / 13 + 2) * 52).toFixed(2)); st.setProperty('--dy', (Math.cos(t / 15) * 30).toFixed(2));
        st.setProperty('--tw', (0.82 + 0.18 * Math.sin(t / 2.6)).toFixed(3));
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove); raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return <div className="cosmos" ref={root} aria-hidden="true">
    <canvas ref={nebula} className="cosmos-layer cosmos-nebula" width={960} height={540} />
    <canvas ref={far} className="cosmos-layer cosmos-far" width={1920} height={1080} />
    <canvas ref={near} className="cosmos-layer cosmos-near" width={1920} height={1080} />
    <div className="cosmos-motes">{Array.from({ length: 26 }, (_, i) => <i key={i} style={{ left: `${(i * 41 + 7) % 100}%`, top: `${(i * 67 + 13) % 100}%`, ['--dur' as string]: `${34 + (i * 7) % 40}s`, ['--dl' as string]: `${-(i * 5) % 30}s`, ['--sz' as string]: `${2 + (i % 4)}px`, ['--c' as string]: i % 3 === 0 ? '#79d8dc' : '#f0c36d' }} />)}</div>
    <canvas ref={dust} className="cosmos-layer cosmos-dust" width={960} height={540} />
    <div className="cosmos-grain" />
  </div>;
}
