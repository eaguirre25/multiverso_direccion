import { useMemo } from 'react';

/* ------------------------------------------------------------------
   Sistema de títulos de recortes.
   Cada pieza es un trozo de papel impreso (SVG): borde irregular,
   reborde blanco de desgarro, grano de papel, tinta gastada y sombra.
   Se combinan letras sueltas y palabras completas de familias distintas.
   La maquetación se calcula midiendo el texto real con canvas.
------------------------------------------------------------------- */

export type FontKey = 'didone' | 'didoneIt' | 'slab' | 'condensed' | 'grotesk' | 'news' | 'newsIt' | 'type' | 'humanist' | 'georgIt' | 'poster';
export type PaperKey = 'cream' | 'white' | 'aged' | 'news' | 'black' | 'red' | 'teal' | 'ochre' | 'magenta' | 'violet';

type FontDef = { family: string; weight: number; style: 'normal' | 'italic'; cap: number };
const FONTS: Record<FontKey, FontDef> = {
  didone: { family: '"Bodoni MT Black","Bodoni MT","Didot","Playfair Display","Times New Roman",serif', weight: 800, style: 'normal', cap: 0.7 },
  didoneIt: { family: '"Bodoni MT","Didot","Playfair Display","Times New Roman",serif', weight: 700, style: 'italic', cap: 0.7 },
  slab: { family: '"Rockwell Extra Bold","Rockwell","Bookman Old Style","Georgia",serif', weight: 800, style: 'normal', cap: 0.68 },
  condensed: { family: '"Impact","Haettenschweiler","Arial Narrow",sans-serif', weight: 400, style: 'normal', cap: 0.79 },
  grotesk: { family: '"Arial Black","Franklin Gothic Heavy","Helvetica Neue",Arial,sans-serif', weight: 900, style: 'normal', cap: 0.72 },
  news: { family: '"Times New Roman","Liberation Serif",serif', weight: 700, style: 'normal', cap: 0.66 },
  newsIt: { family: '"Times New Roman","Liberation Serif",serif', weight: 700, style: 'italic', cap: 0.66 },
  type: { family: '"Courier New","Liberation Mono",monospace', weight: 700, style: 'normal', cap: 0.57 },
  humanist: { family: '"Gill Sans MT","Gill Sans","Century Gothic","Trebuchet MS",sans-serif', weight: 700, style: 'normal', cap: 0.68 },
  georgIt: { family: 'Georgia,"Times New Roman",serif', weight: 700, style: 'italic', cap: 0.69 },
  poster: { family: '"Gill Sans Ultra Bold","Franklin Gothic Heavy","Arial Black",sans-serif', weight: 900, style: 'normal', cap: 0.7 },
};
const FONT_POOL: [FontKey, number][] = [['didone', 3], ['news', 2], ['slab', 2], ['condensed', 2.5], ['grotesk', 2], ['georgIt', 1.4], ['type', 0.9], ['humanist', 1.4], ['poster', 1], ['didoneIt', 1]];

const PAPERS: Record<PaperKey, { bg: string; ink: string; rim: string; halftone?: boolean; grain?: number }> = {
  cream: { bg: '#eadfc2', ink: '#1b1719', rim: '#f8f2e2' },
  white: { bg: '#f4efe4', ink: '#141216', rim: '#fffaf0' },
  aged: { bg: '#d8c283', ink: '#2a1b10', rim: '#efe3b8' },
  news: { bg: '#cdc4ad', ink: '#17151a', rim: '#e8e0cb', halftone: true },
  black: { bg: '#0f0f14', ink: '#f2e7c9', rim: '#ebe3cf' },
  red: { bg: '#a92f2c', ink: '#f6e9d0', rim: '#ebdfc9' },
  teal: { bg: '#1c6a70', ink: '#f3ead2', rim: '#e7dfca' },
  ochre: { bg: '#d29b36', ink: '#1a1210', rim: '#f1e0b2' },
  magenta: { bg: '#b2306d', ink: '#f8ecd6', rim: '#eddfcc' },
  violet: { bg: '#3f3280', ink: '#f1e7cf', rim: '#e7ddcb' },
};
const PAPER_POOL: [PaperKey, number][] = [['cream', 3], ['white', 2], ['aged', 2], ['news', 2], ['black', 2.2], ['red', 0.9], ['teal', 0.9], ['ochre', 0.9], ['magenta', 0.4], ['violet', 0.5]];

export type WordSpec = { text: string; size?: number; mode?: 'letters' | 'word'; paper?: PaperKey; font?: FontKey; rot?: number; dy?: number };

type Item = {
  text: string; x: number; y: number; w: number; top: number; bottom: number; base: number;
  rot: number; font: FontKey; paper: PaperKey; size: number; paperPath: string; rimPath: string | null; i: number;
};
type Layout = { w: number; h: number; items: Item[] };

/* --- utilidades ---------------------------------------------------- */
function hash(str: string) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry(seed: number) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function pick<T>(pool: [T, number][], rnd: () => number, avoid: T[] = []): T {
  const list = pool.filter(([k]) => !avoid.includes(k));
  const total = list.reduce((s, [, w]) => s + w, 0);
  let r = rnd() * total;
  for (const [k, w] of list) { r -= w; if (r <= 0) return k; }
  return list[0][0];
}

let ctx: CanvasRenderingContext2D | null = null;
const measureCache = new Map<string, { w: number; asc: number; desc: number }>();
function measure(text: string, font: FontKey, size: number) {
  const f = FONTS[font];
  const key = `${font}|${text}|${size}`;
  const hit = measureCache.get(key);
  if (hit) return hit;
  ctx ??= document.createElement('canvas').getContext('2d');
  let res = { w: size * 0.6 * text.length, asc: size * 0.7, desc: size * 0.1 };
  if (ctx) {
    ctx.font = `${f.style} ${f.weight} ${size}px ${f.family}`;
    const m = ctx.measureText(text);
    res = { w: m.width, asc: m.actualBoundingBoxAscent || size * 0.7, desc: m.actualBoundingBoxDescent || 0 };
  }
  measureCache.set(key, res);
  return res;
}

/* Contorno de papel recortado: tijera (pocos vértices) o desgarro (muchos). */
function paperOutline(w: number, h: number, rnd: () => number, torn: boolean, grow = 0) {
  const j = torn ? 3.2 : 1.6;
  const corner = () => (rnd() - 0.5) * 7;
  const x0 = -grow + corner(), y0 = -grow + corner();
  const x1 = w + grow + corner(), y1 = -grow + corner();
  const x2 = w + grow + corner(), y2 = h + grow + corner();
  const x3 = -grow + corner(), y3 = h + grow + corner();
  const edge = (ax: number, ay: number, bx: number, by: number, rough: number) => {
    const len = Math.hypot(bx - ax, by - ay);
    const n = torn ? Math.max(2, Math.round(len / 7)) : Math.max(1, Math.round(len / 38));
    const pts: string[] = [];
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      const nx = -(by - ay) / len, ny = (bx - ax) / len;
      const o = (rnd() - 0.5) * 2 * rough;
      pts.push(`${(ax + (bx - ax) * t + nx * o).toFixed(1)},${(ay + (by - ay) * t + ny * o).toFixed(1)}`);
    }
    return pts;
  };
  const rough = [j, j, j, j].map(r => (torn && rnd() < 0.45 ? r * 1.7 : r));
  const pts = [`${x0.toFixed(1)},${y0.toFixed(1)}`, ...edge(x0, y0, x1, y1, rough[0]), ...edge(x1, y1, x2, y2, rough[1]), ...edge(x2, y2, x3, y3, rough[2]), ...edge(x3, y3, x0, y0, rough[3])];
  // esquina cortada en diagonal
  if (!torn && rnd() < 0.35) {
    const c = 3 + rnd() * 8;
    pts[0] = `${(x0 + c).toFixed(1)},${y0.toFixed(1)}`;
    pts.push(`${x0.toFixed(1)},${(y0 + c).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

/* --- maquetación --------------------------------------------------- */
export function layoutCutout(lines: WordSpec[][], opts: { seed: number; maxWidth?: number; align?: 'center' | 'left'; baseSize?: number }): Layout {
  const rnd = mulberry(opts.seed);
  const base = opts.baseSize ?? 100;
  const maxW = (opts.maxWidth ?? 9999) * 100;
  type Tok = { text: string; size: number; font: FontKey; paper: PaperKey; rot: number; dy: number; w: number; asc: number; desc: number; gapBefore: number; wordStart: boolean };
  const rows: Tok[][] = [];
  let prevFont: FontKey[] = [];
  let prevPaper: PaperKey[] = [];

  const wordTokens = (word: WordSpec): Tok[] => {
    const wsize = (word.size ?? 1) * base;
    const asWord = word.mode === 'word';
    const chars = asWord ? [word.text] : [...word.text];
    return chars.map((ch, ci) => {
      const font = word.font ?? pick(FONT_POOL, rnd, prevFont.slice(-2));
      const paper = word.paper ?? pick(PAPER_POOL, rnd, prevPaper.slice(-1));
      prevFont = [...prevFont, font].slice(-3); prevPaper = [...prevPaper, paper].slice(-2);
      const vary = asWord ? 1 : 0.9 + rnd() * 0.22;
      const size = (wsize * vary * 0.7) / FONTS[font].cap;
      const m = measure(ch, font, size);
      return {
        text: ch, size, font, paper, w: m.w, asc: m.asc, desc: m.desc,
        rot: word.rot ?? (rnd() - 0.5) * (asWord ? 3.2 : 8),
        dy: word.dy ?? (rnd() - 0.5) * wsize * (asWord ? 0.04 : 0.14),
        gapBefore: ci === 0 ? wsize * 0.8 : wsize * (-0.04 + rnd() * 0.07),
        wordStart: ci === 0,
      } as Tok;
    });
  };

  for (const line of lines) {
    let row: Tok[] = []; let rowW = 0;
    for (const word of line) {
      const toks = wordTokens(word);
      const wordW = toks.reduce((s, t) => s + t.w + t.size * 0.28 + Math.max(0, t.gapBefore), 0);
      if (row.length && rowW + wordW > maxW) { rows.push(row); row = []; rowW = 0; }
      toks[0].gapBefore = row.length ? toks[0].gapBefore : 0;
      row.push(...toks); rowW += wordW;
    }
    if (row.length) rows.push(row);
  }

  const items: Item[] = [];
  let y = 0; let maxRight = 0; let idx = 0;
  const widths: number[] = [];
  const placed = rows.map(row => {
    let x = 0; let asc = 0; let desc = 0;
    const out = row.map(t => {
      const padX = t.size * (0.11 + rnd() * 0.07);
      const padY = t.size * (0.07 + rnd() * 0.05);
      x += t.gapBefore;
      const pw = t.w + padX * 2;
      const a = Math.max(t.asc, t.size * 0.66), d = Math.max(t.desc, t.size * 0.1);
      asc = Math.max(asc, a + padY); desc = Math.max(desc, d + padY);
      const o = { t, x, pw, a, d, padX, padY };
      x += pw;
      return o;
    });
    widths.push(x);
    maxRight = Math.max(maxRight, x);
    return { out, asc, desc };
  });
  placed.forEach(({ out, asc, desc }, ri) => {
    const offset = (opts.align === 'left' ? 0 : (maxRight - widths[ri]) / 2);
    const base0 = y + asc;
    out.forEach(({ t, x, pw, a, d, padX, padY }) => {
      const torn = rnd() < 0.3;
      const top = -(a + padY), bottom = d + padY;
      const h = bottom - top;
      const outlineRnd = mulberry(Math.floor(rnd() * 1e9));
      const rimRnd = mulberry(Math.floor(rnd() * 1e9));
      items.push({
        text: t.text, x: x + offset, y: base0 + t.dy, w: pw, top, bottom, base: padX,
        rot: t.rot, font: t.font, paper: t.paper, size: t.size,
        paperPath: paperOutline(pw, h, outlineRnd, torn),
        rimPath: rnd() < 0.62 ? paperOutline(pw, h, rimRnd, true, 2.4) : null,
        i: idx++,
      });
    });
    y += asc + desc - Math.min(asc, desc) * 0.1; // las líneas se encastran un poco
  });
  const pad = 26;
  return { w: maxRight + pad * 2, h: y + pad * 2 + 6, items: items.map(it => ({ ...it, x: it.x + pad, y: it.y + pad })) };
}

/* --- defs globales (filtros y tramas) ----------------------------- */
export function CutoutDefs() {
  return <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
    <defs>
      <filter id="cut-paper" x="-6%" y="-8%" width="112%" height="116%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="4" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="rough" />
        <feTurbulence type="fractalNoise" baseFrequency="0.55 0.9" numOctaves="3" seed="11" result="grain" />
        <feDiffuseLighting in="grain" lightingColor="#fff" surfaceScale="1.6" diffuseConstant="1.05" result="lit"><feDistantLight azimuth="235" elevation="62" /></feDiffuseLighting>
        <feComposite in="lit" in2="rough" operator="in" result="litIn" />
        <feBlend in="rough" in2="litIn" mode="multiply" result="shaded" />
        <feComposite in="shaded" in2="rough" operator="in" />
      </filter>
      <filter id="cut-rim" x="-8%" y="-10%" width="116%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="3" seed="9" result="w" />
        <feDisplacementMap in="SourceGraphic" in2="w" scale="5" xChannelSelector="R" yChannelSelector="B" />
      </filter>
      <filter id="cut-ink" x="-4%" y="-4%" width="108%" height="108%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="7" result="n2" />
        <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  13 0 0 0 -3.15" result="holes" />
        <feComposite in="d" in2="holes" operator="in" />
      </filter>
      <pattern id="cut-halftone" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
        <circle cx="2.5" cy="2.5" r="0.95" fill="#2a2630" fillOpacity=".34" />
      </pattern>
      <pattern id="cut-lines" width="7" height="7" patternUnits="userSpaceOnUse">
        <path d="M0 3.5H7" stroke="#2a2630" strokeOpacity=".07" strokeWidth="1" />
      </pattern>
      <filter id="story-ink" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 .96  0 0 0 0 .92  0 0 0 0 .82  0 0 0 11 0" /></filter>
      <filter id="cut-tape" x="-5%" y="-10%" width="110%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.4 0.05" numOctaves="2" seed="3" result="w" />
        <feDisplacementMap in="SourceGraphic" in2="w" scale="4" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>;
}

/* --- render -------------------------------------------------------- */
export function CutoutSvg({ layout, label, className, style, animate = true }: { layout: Layout; label: string; className?: string; style?: React.CSSProperties; animate?: boolean }) {
  return <svg className={`cutout-svg ${className ?? ''}`} viewBox={`0 0 ${layout.w.toFixed(0)} ${layout.h.toFixed(0)}`} role="img" aria-label={label} style={style}>
    {layout.items.map(it => {
      const p = PAPERS[it.paper]; const f = FONTS[it.font];
      const cx = it.w / 2, cy = (it.top + it.bottom) / 2;
      return <g key={it.i} transform={`translate(${it.x.toFixed(1)} ${it.y.toFixed(1)}) rotate(${it.rot.toFixed(2)} ${cx.toFixed(1)} ${cy.toFixed(1)})`}>
        <g className={animate ? 'cut-pop' : undefined} style={{ ['--d' as string]: `${it.i * 34}ms` }}>
          <g transform={`translate(0 ${it.top.toFixed(1)})`}>
            {it.rimPath && <path d={it.rimPath} fill={p.rim} filter="url(#cut-rim)" opacity=".96" />}
            <path d={it.paperPath} fill={p.bg} filter="url(#cut-paper)" />
            {p.halftone && <path d={it.paperPath} fill="url(#cut-halftone)" />}
            <path d={it.paperPath} fill="url(#cut-lines)" />
          </g>
          <text x={it.base} y={0} fill={p.ink} filter="url(#cut-ink)" fontFamily={f.family} fontWeight={f.weight} fontStyle={f.style} fontSize={it.size.toFixed(1)} xmlSpace="preserve">{it.text}</text>
        </g>
      </g>;
    })}
  </svg>;
}

/* Título automático para encabezados (portales, fichas). */
export function CutoutTitle({ text, small = false, seed, max, mode, className }: { text: string; small?: boolean; seed?: number; max?: number; mode?: 'letters' | 'mixed'; className?: string }) {
  const layout = useMemo(() => {
    const s = seed ?? hash(text);
    const rnd = mulberry(s ^ 0x9e3779b9);
    const words = text.split(/\s+/).filter(Boolean);
    // En modo mixto, algunas palabras (cortas o intermedias) se recortan enteras.
    const spec: WordSpec[] = words.map((w, i) => {
      const clean = w.replace(/[¿?¡!.,]/g, '');
      const whole = mode !== 'letters' && (clean.length <= 3 || (clean.length > 5 && rnd() < 0.34) || i === words.length - 1 && rnd() < 0.4);
      return { text: w, mode: whole ? 'word' : 'letters', size: whole ? 0.9 : 1 };
    });
    return layoutCutout([spec], { seed: s, maxWidth: max ?? (small ? 15 : 12), baseSize: small ? 84 : 100 });
  }, [text, small, seed, max, mode]);
  return <span className={`cutout${small ? ' cutout-sm' : ''}${className ? ` ${className}` : ''}`}>
    <CutoutSvg layout={layout} label={text} style={{ width: `${layout.w / 100}em`, height: `${layout.h / 100}em` }} />
  </span>;
}

/* Titular principal de la portada: composición diseñada a mano. */
const MAIN: WordSpec[][] = [
  [
    { text: 'EL', mode: 'word', size: 0.62, paper: 'black', font: 'didoneIt', rot: -5, dy: -26 },
    { text: 'MULTIVERSO', size: 1.42 },
  ],
  [
    { text: 'DE LA', mode: 'word', size: 0.5, paper: 'news', font: 'condensed', rot: 3, dy: 14 },
    { text: 'DIRECCIÓN', size: 1.04 },
  ],
  [
    { text: 'ESCOLAR', mode: 'word', size: 1.46, paper: 'red', font: 'condensed', rot: -1.4 },
  ],
];
export function MainTitle({ className }: { className?: string }) {
  const layout = useMemo(() => layoutCutout(MAIN, { seed: 20260, baseSize: 100 }), []);
  return <CutoutSvg layout={layout} label="El multiverso de la dirección escolar" className={`cutout-main ${className ?? ''}`} />;
}

/* Etiqueta pequeña tipo "cinta" para números de portal. */
export function TapeLabel({ children }: { children: React.ReactNode }) { return <span className="tape-label">{children}</span>; }
