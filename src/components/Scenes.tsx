import { useEffect, useState } from 'react';
import { CutoutTitle } from './Cutout';
import { Flow, curve, pt, useReducedMotion, type FlowPath } from './Flow';
import { AcademicReference } from './AcademicReference';
import { portals, stories, type RefKey } from '../data/presentation';

/* Composiciones de los universos. Cada escena traduce su argumento en una
   estructura espacial propia y comparte el sistema de recortes (Scrap) y de
   conexiones dinámicas (Flow). Todo el lienzo es una caja 10:7. */

type Paper = 'cream' | 'white' | 'aged' | 'news' | 'black' | 'red' | 'teal' | 'ochre' | 'magenta' | 'violet';
type Font = 'news' | 'didone' | 'slab' | 'cond' | 'grot' | 'type' | 'ital';
type Pos = [number, number];

function Scrap({ t, x, y, r = 0, paper = 'cream', font = 'news', s = 1, d = 0, move = false, on, onEnter, onLeave, focusable, className = '' }: { t: string; x: number; y: number; r?: number; paper?: Paper; font?: Font; s?: number; d?: number; move?: boolean; on?: boolean; onEnter?: () => void; onLeave?: () => void; focusable?: boolean; className?: string }) {
  return <span className={`scrap p-${paper} f-${font}${move ? ' scrap-move' : ''}${on ? ' scrap-on' : ''} ${className}`} tabIndex={focusable ? 0 : undefined}
    onMouseEnter={onEnter} onMouseLeave={onLeave} onFocus={onEnter} onBlur={onLeave}
    style={{ left: `${x}%`, top: `${y}%`, ['--r' as string]: `${r}deg`, ['--s' as string]: s, ['--d' as string]: `${d}ms` }}>{t}</span>;
}
const Q = ({ t, y = 94 }: { t: string; y?: number }) => <p className="art-question" style={{ top: `${y}%` }}>{t}</p>;
const link = (a: Pos, b: Pos, bend: number, wob = 0) => curve(a, b, bend, wob);

/* 1 · Red de relaciones que se entrecruzan, superponen y modifican ------- */
function S1() {
  const [hot, setHot] = useState<string | null>(null);
  const N: Record<string, { p: Pos; paper: Paper; font: Font; r: number }> = {
    normativas: { p: [16, 36], paper: 'aged', font: 'slab', r: -4 }, cuerpos: { p: [44, 22], paper: 'red', font: 'cond', r: 3 },
    tecnologías: { p: [78, 32], paper: 'news', font: 'type', r: -3 }, espacios: { p: [88, 60], paper: 'teal', font: 'grot', r: 4 },
    alimentos: { p: [68, 86], paper: 'cream', font: 'ital', r: -3 }, afectos: { p: [32, 88], paper: 'magenta', font: 'didone', r: 3 },
    temporalidades: { p: [10, 68], paper: 'white', font: 'news', r: -4 }, dirección: { p: [50, 56], paper: 'black', font: 'didone', r: 0 },
  };
  const E: [string, string, number][] = [
    ['normativas', 'cuerpos', 40], ['cuerpos', 'tecnologías', -50], ['tecnologías', 'espacios', 40], ['espacios', 'alimentos', -45], ['alimentos', 'afectos', 40],
    ['afectos', 'temporalidades', -40], ['temporalidades', 'normativas', 45], ['normativas', 'espacios', 90], ['cuerpos', 'afectos', -110], ['tecnologías', 'temporalidades', 120],
    ['cuerpos', 'alimentos', 70], ['dirección', 'normativas', 30], ['dirección', 'tecnologías', -30], ['dirección', 'alimentos', 30], ['dirección', 'temporalidades', -30],
  ];
  const paths: FlowPath[] = E.map(([a, b, bend], i) => { const c = link(N[a].p, N[b].p, bend, 26); return { id: `${a}-${b}`, ...c, tags: [a, b], n: 3, dur: 5 + (i * 1.3) % 6, dir: i % 3 === 0 ? 0 : i % 2 ? 1 : -1, hue: 170 + (i * 23) % 140, delay: 0.3 + i * 0.08 }; });
  return <>
    <Q t="¿Cómo visibilizar una dirección hecha de relaciones simultáneas?" y={7} />
    <Flow paths={paths} active={hot} />
    {Object.entries(N).map(([k, v], i) => <Scrap key={k} t={k} x={v.p[0]} y={v.p[1]} r={v.r} paper={v.paper} font={v.font} d={300 + i * 80} s={k === 'dirección' ? 0.85 : 1} focusable on={hot === k} onEnter={() => setHot(k)} onLeave={() => setHot(null)} />)}
  </>;
}

/* 2 · Investigación → categorización (separa) → escritura (emerge) ------- */
function S2() {
  const I: Pos = [21, 26], C: Pos = [52, 50], W: Pos = [80, 74];
  const paths: FlowPath[] = [];
  [-5, 0, 5].forEach((o, i) => paths.push({ id: `ic${i}`, ...link([I[0] + 12, I[1] + 5 + o], [C[0] - 13, C[1] - 6 + o], 25 + i * 12, 14), n: 3, dur: 5 + i, shape: 'paper', hue: 40, tags: ['inv'], delay: 0.3 + i * 0.2 }));
  [-7, -3, 0, 3, 7].forEach((o, i) => paths.push({ id: `ce${i}`, ...link([C[0] + 13, C[1] + 4 + o], [W[0] - 13, W[1] - 6 + o], i % 2 ? -50 : 50, 26), n: 2, dur: 6 + i * 0.8, dir: i % 2 ? -1 : 1, hue: 175, tags: ['esc'], delay: 1.4 + i * 0.25 }));
  paths.push({ id: 'posibilidad', ...link([C[0] + 3, C[1] - 7], [W[0] - 3, W[1] - 7], -140, 30), dash: true, n: 4, dur: 8, hue: 300, delay: 2 });
  return <>
    <Scrap t="INVESTIGACIÓN" x={I[0]} y={I[1]} r={-3} paper="black" font="didone" s={1.1} d={200} />
    <span className="art-cap" style={{ left: `${I[0]}%`, top: `${I[1] + 8}%` }}>materiales etnográficos</span>
    <Scrap t="CATEGORIZACIÓN" x={C[0]} y={C[1]} r={2} paper="red" font="cond" s={1.2} d={500} />
    <span className="art-cap" style={{ left: `${C[0]}%`, top: `${C[1] + 8}%` }}>ordenar, comparar, cortar</span>
    <Scrap t="ESCRITURA" x={W[0]} y={W[1]} r={-2} paper="teal" font="slab" s={1.15} d={1800} className="emerge" />
    <span className="art-cap" style={{ left: `${W[0]}%`, top: `${W[1] + 8}%` }}>otra posibilidad</span>
    <Flow paths={paths} />
    <Q t="¿Cómo mantener juntas relaciones que el análisis había separado?" y={92} />
  </>;
}

/* 3 · Registros y experiencias se transforman por decisiones narrativas -- */
function S3() {
  const [op, setOp] = useState(0);
  const OPS = ['condensar escenas', 'modificar temporalidades', 'seleccionar voces', 'reorganizar relaciones'];
  const OUT: Pos[][] = [
    [[80, 26], [90, 46], [82, 66], [68, 78]], [[72, 22], [88, 38], [74, 62], [90, 74]],
    [[84, 20], [70, 40], [90, 60], [76, 80]], [[66, 24], [90, 30], [86, 70], [70, 62]],
  ];
  const o = OUT[op]; const COMP: Pos = [48, 50];
  const paths: FlowPath[] = [
    { id: 'r', ...link([14, 22], COMP, 40, 20), n: 3, dur: 6, shape: 'paper', hue: 40, tags: ['reg'] },
    { id: 'e', ...link([14, 72], COMP, -40, 20), n: 3, dur: 7, shape: 'paper', hue: 25, tags: ['exp'], delay: 0.3 },
    { id: 'i', ...link([48, 12], [COMP[0], COMP[1] - 9], 30, 16), n: 3, dur: 5, hue: 300, tags: ['ima'] },
    ...o.map((p, i) => ({ id: `o${i}-${op}`, ...link([COMP[0] + 12, COMP[1]], p, i % 2 ? 50 : -50, 24), n: 2, dur: 5 + i * 0.7, hue: 175, tags: ['comp'], delay: i * 0.12 } as FlowPath)),
    ...o.map((p, i) => ({ id: `n${i}-${op}`, ...link(p, o[(i + 1) % o.length], 40, 14), n: 2, dur: 6 + i, dir: 0 as const, hue: 320, delay: 0.5 + i * 0.1 } as FlowPath)),
  ];
  return <>
    <Flow paths={paths} />
    <Scrap t="REGISTROS" x={14} y={22} r={-4} paper="news" font="type" s={1.05} d={200} />
    <Scrap t="EXPERIENCIAS" x={14} y={72} r={3} paper="cream" font="ital" s={1.05} d={350} />
    <Scrap t="IMAGINACIÓN" x={48} y={11} r={-2} paper="magenta" font="didone" s={1.1} d={500} />
    <Scrap t="COMPOSICIÓN FICCIONAL" x={COMP[0]} y={COMP[1]} r={op % 2 ? 3 : -3} paper="black" font="didone" s={1.1} move d={650} />
    {o.map((p, i) => <Scrap key={i} t={['cuento', 'escena', 'voz', 'tiempo'][(i + op) % 4]} x={p[0]} y={p[1]} r={(i - 1.5) * 4} paper={(['aged', 'teal', 'white', 'red'] as Paper[])[(i + op) % 4]} font={(['slab', 'grot', 'ital', 'cond'] as Font[])[(i + op) % 4]} s={0.9} move d={i * 60} />)}
    <div className="ops" role="group" aria-label="Decisiones narrativas">
      {OPS.map((t, i) => <button key={t} type="button" className={`op${i === op ? ' op-on' : ''}`} aria-pressed={i === op} onClick={() => setOp(i)}>{t}</button>)}
    </div>
  </>;
}

/* 4 · Una trama institucional de la que surgen dos trayectorias que se encuentran sin fundirse */
function S4() {
  const [hot, setHot] = useState<string | null>(null);
  const ESC: Pos = [21, 11], ITED: Pos = [50, 25], DOC: Pos = [79, 11], DIR: Pos = [19, 52], INV: Pos = [82, 52], COP: Pos = [50, 87];
  const paths: FlowPath[] = [
    { id: 'e-i', ...link(ESC, ITED, 30, 20), n: 3, dur: 8, dir: 0, hue: 40, tags: ['trama'] },
    { id: 'i-d', ...link(ITED, DOC, 30, 20), n: 3, dur: 9, dir: 0, hue: 185, tags: ['trama'], delay: 0.2 },
    { id: 'e-d', ...link(ESC, DOC, -34, 22), n: 3, dur: 11, dir: 0, hue: 300, tags: ['trama'], delay: 0.4 },
    { id: 'e-dir', ...link([ESC[0], ESC[1] + 5], [DIR[0] + 1, DIR[1] - 7], 20, 20), n: 3, dur: 7, dir: 0, hue: 38, width: 1.4, tags: ['dir'], delay: 0.8 },
    { id: 'd-inv', ...link([DOC[0], DOC[1] + 5], [INV[0] - 1, INV[1] - 7], -20, 20), n: 3, dur: 8, dir: 0, hue: 185, width: 1.4, tags: ['inv'], delay: 1 },
    { id: 'i-dir', ...link([ITED[0] - 4, ITED[1] + 4], [DIR[0] + 6, DIR[1] - 6], -26, 22), n: 2, dur: 9, dir: 0, hue: 40, tags: ['dir', 'trama'], delay: 1.2 },
    { id: 'i-inv', ...link([ITED[0] + 4, ITED[1] + 4], [INV[0] - 6, INV[1] - 6], 26, 22), n: 2, dur: 10, dir: 0, hue: 185, tags: ['inv', 'trama'], delay: 1.3 },
    { id: 'dir-cop', ...link([DIR[0] + 4, DIR[1] + 7], [COP[0] - 8, COP[1] - 5], -36, 30), n: 3, dur: 7, dir: 0, hue: 38, width: 1.4, tags: ['dir', 'cop'], delay: 1.7 },
    { id: 'inv-cop', ...link([INV[0] - 4, INV[1] + 7], [COP[0] + 8, COP[1] - 5], 36, 30), n: 3, dur: 8, dir: 0, hue: 185, width: 1.4, tags: ['inv', 'cop'], delay: 1.8 },
    { id: 'dif', ...link([DIR[0] + 9, DIR[1]], [INV[0] - 9, INV[1]], -60, 40), n: 4, dur: 10, dir: 0, hue: 330, dash: true, tags: ['dif'], delay: 2.2 },
  ];
  const on = (k: string) => ({ onEnter: () => setHot(k), onLeave: () => setHot(null), focusable: true, on: hot === k });
  return <>
    <Flow paths={paths} active={hot} />
    <Scrap t="ESCUELAS SECUNDARIAS" x={ESC[0]} y={ESC[1]} r={-3} paper="aged" font="slab" s={0.82} d={150} {...on('trama')} />
    <Scrap t="ITED–UNSAM" x={ITED[0]} y={ITED[1]} r={2} paper="black" font="didone" s={1} d={300} {...on('trama')} />
    <Scrap t="INVESTIGACIÓN DOCTORAL" x={DOC[0]} y={DOC[1]} r={3} paper="teal" font="grot" s={0.74} d={450} {...on('trama')} />
    <Scrap t="DIRECTORA ESCOLAR" x={DIR[0]} y={DIR[1]} r={-2} paper="ochre" font="cond" s={0.9} d={800} {...on('dir')} />
    <Scrap t="INVESTIGADOR" x={INV[0]} y={INV[1]} r={2} paper="cream" font="cond" s={1.1} d={950} {...on('inv')} />
    <Scrap t="diferencias de posición" x={51} y={52} r={-1} paper="magenta" font="ital" s={0.7} d={1300} {...on('dif')} />
    <Scrap t="perspectivas parciales" x={19} y={69} r={-3} paper="white" font="news" s={0.8} d={1500} />
    <Scrap t="conocimientos situados" x={81} y={69} r={3} paper="news" font="type" s={0.8} d={1600} />
    <Scrap t="COPRODUCCIÓN NARRATIVA" x={COP[0]} y={COP[1]} r={0} paper="red" font="cond" s={1.1} d={1900} className="core" {...on('cop')} />
    <Scrap t="hacer-con" x={50} y={72} r={2} paper="aged" font="slab" s={0.85} d={1750} />
  </>;
}

/* 5 · Tres posibilidades narrativas, cada una con su propia animación ---- */
function S5() {
  const [hot, setHot] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const CORES: { k: string; name: string; gloss: string; author: string; x: number; ref: RefKey; paper: Paper; font: Font }[] = [
    { k: 'cor', name: 'CONCENTRACIÓN', gloss: 'Intensidad y concentración narrativa', author: 'Julio Cortázar', x: 17, ref: 'cortazar1971', paper: 'aged', font: 'cond' },
    { k: 'pig', name: 'ELIPSIS', gloss: 'La historia visible y otra construida indirectamente', author: 'Ricardo Piglia', x: 50, ref: 'piglia2000', paper: 'teal', font: 'didone' },
    { k: 'bor', name: 'BIFURCACIONES', gloss: 'Temporalidades divergentes y coexistentes', author: 'Jorge Luis Borges', x: 83, ref: 'borges1974', paper: 'red', font: 'cond' },
  ];
  const AY = 79;
  const paths: FlowPath[] = [
    ...CORES.map((c, i) => ({ id: `t${i}`, ...link([50, 19], [c.x, 24], i === 1 ? 0 : (i ? -30 : 30), 10), n: 2, dur: 6 + i, dir: 0 as const, hue: [40, 175, 340][i], tags: [c.k], delay: i * 0.2 } as FlowPath)),
    // concentración: fragmentos que convergen y se intensifican
    ...[0, 1, 2, 3, 4, 5].map(i => { const a = (i / 6) * Math.PI * 2; return { id: `c${i}`, ...link([17 + Math.cos(a) * 12, AY + Math.sin(a) * 14], [17, AY], 0, 0), n: 2, dur: 3 + (i % 3) * 0.4, shape: 'paper' as const, hue: 40, tags: ['cor'], delay: i * 0.1 } as FlowPath; }),
    // elipsis: una trayectoria visible y otra que aparece y desaparece
    { id: 'e1', ...link([37, AY - 3], [63, AY - 3], 0, 8), n: 4, dur: 6, dir: 1, hue: 175, width: 1.4, tags: ['pig'] },
    { id: 'e2', ...link([37, AY + 7], [63, AY + 7], -30, 20), n: 4, dur: 7, dir: 0, hue: 300, dash: true, blink: true, tags: ['pig'], delay: 0.5 },
    // bifurcaciones: caminos que se dividen
    { id: 'b0', ...link([71, AY], [80, AY], 0, 0), n: 2, dur: 3, hue: 340, width: 1.5, tags: ['bor'] },
    { id: 'b1', ...link([80, AY], [95, AY - 15], 24, 12), n: 2, dur: 5, hue: 20, tags: ['bor'], delay: 0.3 },
    { id: 'b2', ...link([80, AY], [95, AY], 0, 8), n: 2, dur: 7, hue: 330, tags: ['bor'], delay: 0.6 },
    { id: 'b3', ...link([80, AY], [95, AY + 15], -24, 12), n: 2, dur: 9, hue: 280, tags: ['bor'], delay: 0.9 },
  ];
  return <>
    <Flow paths={paths} active={hot} />
    <div className="art-center art-center-s5" style={{ left: '50%', top: '9%' }}><CutoutTitle text="UNA ESCENA, MÚLTIPLES HISTORIAS" max={13} seed={77} mode="letters" /></div>
    {CORES.map((c, i) => <div key={c.k} className={`core-card${hot === c.k ? ' core-hot' : ''}${open === c.k ? ' core-open' : ''}`} style={{ left: `${c.x}%`, top: '40%', ['--d' as string]: `${300 + i * 200}ms` }}
      onMouseEnter={() => setHot(c.k)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(c.k)} onBlur={() => setHot(null)}>
      <span className={`core-name p-${c.paper} f-${c.font}`}>{c.name}</span>
      <p className="core-gloss">{c.gloss}</p>
      <p className="core-author">{c.author}</p>
      <AcademicReference k={c.ref} open={open === c.k} onToggle={() => setOpen(open === c.k ? null : c.k)} popover />
    </div>)}
  </>;
}

/* 6 · Una escuela entre presencias heterogéneas que se reorganizan ------- */
const GLYPHS: Record<string, React.ReactNode> = {
  personas: <><circle cx="50" cy="34" r="16" /><path d="M20 86c0-20 14-30 30-30s30 10 30 30z" /></>,
  organismos: <><path d="M50 90C22 62 24 28 50 8c26 20 28 54 0 82z" /><path d="M50 90V30" className="gl-vein" /></>,
  objetos: <><path d="M28 14h44v38H28z" /><path d="M32 52v36M68 52v36M28 70h44" className="gl-line" /></>,
  tecnologías: <><rect x="12" y="20" width="76" height="48" rx="4" /><path d="M34 84h32M50 68v16" className="gl-line" /></>,
  espacios: <><path d="M14 88V44L50 12l36 32v44z" /><path d="M42 88V62h16v26" className="gl-door" /></>,
  afectos: <path d="M50 88C12 58 16 24 36 22c8 0 14 6 14 12 0-6 6-12 14-12 20 2 24 36-14 66z" />,
  materialidades: <><rect x="12" y="24" width="36" height="20" /><rect x="52" y="24" width="36" height="20" /><rect x="30" y="48" width="36" height="20" /><rect x="12" y="72" width="36" height="18" /><rect x="52" y="72" width="36" height="18" /></>,
};
const S6_KIND: Record<string, 'vivo' | 'objeto' | 'otro'> = { personas: 'vivo', organismos: 'vivo', objetos: 'objeto', tecnologías: 'objeto', espacios: 'objeto', materialidades: 'objeto', afectos: 'otro' };
function S6() {
  const rm = useReducedMotion();
  const [hot, setHot] = useState<string | null>(null);
  const [cfg, setCfg] = useState(0);
  useEffect(() => { if (rm) return; const id = window.setInterval(() => setCfg(c => (c + 1) % 3), 7000); return () => window.clearInterval(id); }, [rm]);
  const names = Object.keys(GLYPHS);
  const C: Pos = [50, 48];
  const P: Record<string, Pos> = {};
  names.forEach((n, i) => { const a = (i / names.length) * Math.PI * 2 - Math.PI / 2; P[n] = [C[0] + Math.cos(a) * 39, C[1] + Math.sin(a) * 36]; });
  P.escuela = C;
  // tres configuraciones de la trama: las asociaciones se reorganizan con el tiempo
  const CFG: [string, string][][] = names.length ? [
    [...names.map((n, i) => [n, names[(i + 1) % 7]] as [string, string]), ['escuela', 'personas'], ['escuela', 'tecnologías'], ['escuela', 'afectos']],
    [...names.map((n, i) => [n, names[(i + 2) % 7]] as [string, string]), ['escuela', 'objetos'], ['escuela', 'espacios']],
    [...names.map((n, i) => [n, names[(i + 3) % 7]] as [string, string]), ['escuela', 'organismos'], ['escuela', 'materialidades'], ['escuela', 'personas']],
  ] : [];
  const paths: FlowPath[] = CFG[cfg].map(([a, b], i) => ({ id: `${cfg}-${a}-${b}`, ...link(P[a], P[b], (i % 2 ? 1 : -1) * (30 + (i * 13) % 50), 34), tags: [a, b], n: 2, dur: 5 + (i * 1.9) % 6, dir: (i % 3 === 0 ? 0 : i % 2 ? 1 : -1) as 0 | 1 | -1, hue: S6_KIND[a] === 'vivo' ? 150 : S6_KIND[a] === 'objeto' ? 40 : 320, delay: i * 0.08 }));
  return <>
    <Flow paths={paths} active={hot} />
    <img className="s6-school" src="./assets/school/escuela-flotante.svg" alt="La escuela, nodo destacado de la trama" style={{ left: `${C[0]}%`, top: `${C[1]}%` }} />
    <Scrap t="MULTIPLICIDAD DE PERSPECTIVAS" x={21} y={3} r={-1} paper="black" font="didone" s={0.6} d={200} />
    <Scrap t="PRESENCIAS MÁS-QUE-HUMANAS" x={74} y={98} r={1} paper="aged" font="slab" s={0.78} d={350} />
    {names.map((n, i) => { const k = S6_KIND[n]; return <span key={n} className={`pres pres-${k}${hot && hot !== n ? ' pres-dim' : ''}`}>
      <svg className={`glyph glyph-${k}`} viewBox="0 0 100 100" style={{ left: `${P[n][0]}%`, top: `${P[n][1] - 5}%` }} aria-hidden="true">{GLYPHS[n]}</svg>
      <Scrap t={n} x={P[n][0]} y={P[n][1] + 5} r={(i % 2 ? 3 : -3)} paper={k === 'vivo' ? 'teal' : k === 'objeto' ? 'ochre' : 'magenta'} font={(['ital', 'type', 'slab', 'grot', 'didone', 'cond', 'news'] as Font[])[i]} s={0.85} d={300 + i * 90} focusable on={hot === n} onEnter={() => setHot(n)} onLeave={() => setHot(null)} />
    </span>; })}
    <ul className="legend legend-s6" aria-label="Tipos de presencia"><li className="lg-vivo">vivas</li><li className="lg-objeto">materiales</li><li className="lg-otro">afectivas</li></ul>
  </>;
}

/* 8 · Escribir es pensar, escribir es analizar --------------------------- */
function S8() {
  const paths: FlowPath[] = [
    { id: 'p1', d: 'M250 520 C 230 590 180 600 200 640', n: 3, dur: 6, dir: 0, hue: 215, delay: 1.5 },
    { id: 'p2', d: 'M500 540 C 500 590 500 610 500 645', n: 3, dur: 5, dir: 0, hue: 175, delay: 1.7 },
    { id: 'p3', d: 'M750 520 C 770 590 820 600 800 640', n: 3, dur: 7, dir: 0, hue: 330, delay: 1.9 },
  ];
  return <>
    <Scrap t="ESCRIBIR ES PENSAR" x={26} y={5} r={-2} paper="black" font="didone" s={1.1} d={150} />
    <Scrap t="ESCRIBIR ES ANALIZAR" x={76} y={5} r={2} paper="red" font="cond" s={1.2} d={300} />
    <div className="manuscript">
      <div className="ms-lines" />
      <p className="ms-quote">“Writing is thinking, writing is analysis”</p>
      <p className="ms-cite">(Richardson &amp; St. Pierre, 2005, p. 967)</p>
      <svg className="ms-scribble" viewBox="0 0 300 60" aria-hidden="true"><path d="M5 40 C 40 5 55 58 95 32 S 150 8 180 36 S 240 50 295 14" /><path className="ms-s2" d="M5 52 C 60 44 120 58 190 46 S 260 52 295 48" /></svg>
    </div>
    <Flow paths={paths} />
    <Scrap t="conexiones" x={20} y={92} r={-4} paper="news" font="type" d={1700} />
    <Scrap t="preguntas" x={50} y={94} r={2} paper="aged" font="ital" s={1.1} d={1900} />
    <Scrap t="relaciones" x={80} y={92} r={4} paper="teal" font="grot" d={2100} />
  </>;
}

/* 9 · Ondas de resonancia que se multiplican en cada posición lectora ---- */
function S9() {
  const SRC: Pos = [20, 50]; const T = 9; const SPEED = 900 / T;
  const R: { t: string; p: Pos; paper: Paper; font: Font }[] = [
    { t: 'LECTURA', p: [50, 20], paper: 'cream', font: 'didone' }, { t: 'MUNDOS TEXTUALES', p: [74, 50], paper: 'teal', font: 'grot' },
    { t: 'INTERPRETACIONES', p: [50, 80], paper: 'aged', font: 'slab' }, { t: 'RESONANCIAS', p: [88, 20], paper: 'red', font: 'cond' },
  ];
  const [sx, sy] = pt(...SRC);
  const paths: FlowPath[] = [
    ...R.map((r, i) => ({ id: `s${i}`, ...link(SRC, r.p, i % 2 ? 40 : -40, 20), n: 2, dur: 8 + i, hue: 15, delay: 0.6 + i * 0.15 } as FlowPath)),
    { id: 'x1', ...link(R[0].p, R[3].p, -50, 20), n: 2, dur: 9, dir: 0, hue: 330, dash: true, delay: 2 },
    { id: 'x2', ...link(R[1].p, R[3].p, 40, 20), n: 2, dur: 8, dir: 0, hue: 330, dash: true, delay: 2.2 },
    { id: 'x3', ...link(R[1].p, R[2].p, 40, 20), n: 2, dur: 10, dir: 0, hue: 330, dash: true, delay: 2.4 },
    { id: 'x4', ...link(R[0].p, R[1].p, 30, 20), n: 2, dur: 7, dir: 0, hue: 330, dash: true, delay: 2.6 },
  ];
  return <>
    <svg className="art-lines ripple-svg" viewBox="0 0 1000 700" aria-hidden="true">
      {[0, 3, 6].map(b => <circle key={b} className="rip" cx={sx} cy={sy} r="0" fill="none"><animate attributeName="r" dur={`${T}s`} begin={`${b}s`} repeatCount="indefinite" values="0;900" /><animate attributeName="opacity" dur={`${T}s`} begin={`${b}s`} repeatCount="indefinite" values=".9;0" /></circle>)}
      {R.map((r, i) => { const [px, py] = pt(...r.p); const t = Math.hypot(px - sx, py - sy) / SPEED; return <g key={i}>
        {[0, 1].map(k => <circle key={k} className="rip rip2" cx={px} cy={py} r="0" fill="none"><animate attributeName="r" dur={`${T}s`} begin={`${t + k * 1.2}s`} repeatCount="indefinite" values="0;230;230" keyTimes="0;.5;1" /><animate attributeName="opacity" dur={`${T}s`} begin={`${t + k * 1.2}s`} repeatCount="indefinite" values=".9;0;0" keyTimes="0;.5;1" /></circle>)}
      </g>; })}
    </svg>
    <Flow paths={paths} />
    <Scrap t="un relato" x={SRC[0]} y={SRC[1]} r={-2} paper="black" font="didone" s={1.2} d={150} className="core" />
    {R.map((r, i) => <Scrap key={r.t} t={r.t} x={r.p[0]} y={r.p[1]} r={(i - 1.5) * 3} paper={r.paper} font={r.font} d={500 + i * 250} />)}
  </>;
}

export function SceneArt({ id }: { id: number }) {
  const body = { 1: <S1 />, 2: <S2 />, 3: <S3 />, 4: <S4 />, 5: <S5 />, 6: <S6 />, 8: <S8 />, 9: <S9 /> }[id];
  const p = portals[id - 1];
  return <div className="art-slot"><div className={`scene-art art-${id}`} role="group" aria-label={`Composición del universo ${id}: ${p.title}`}><div className="art-glow" aria-hidden="true" />{body}</div></div>;
}

/* 7 · Seis universos en órbita suave, con conexiones entre sí ------------ */
const WORLD_HUES = [39, 112, 190, 328, 24, 274];
const STORY_POS: Pos[] = [[25, 13], [75, 13], [89, 49], [75, 85], [25, 85], [11, 49]];
export function StoryScene({ selected, onSelect }: { selected: number | null; onSelect: (i: number | null) => void }) {
  const [hot, setHot] = useState<number | null>(null);
  const P: Pos[] = STORY_POS;
  const paths: FlowPath[] = [
    ...P.map((p, i) => ({ id: `ring${i}`, ...link(p, P[(i + 1) % 6], 36, 22), n: 2, dur: 8 + i, dir: (i % 2 ? 1 : -1) as 1 | -1, hue: WORLD_HUES[i], tags: [String(i), String((i + 1) % 6)], delay: i * 0.15 } as FlowPath)),
    ...P.map((p, i) => ({ id: `hub${i}`, ...link([50, 49], p, i % 2 ? 24 : -24, 14), n: 2, dur: 6 + i * 0.6, dir: 0 as const, hue: WORLD_HUES[i], tags: [String(i)], delay: 0.4 + i * 0.1 } as FlowPath)),
  ];
  const s = selected === null ? null : stories[selected];
  return <div className="art-slot"><div className="scene-art art-7" role="group" aria-label="Constelación de los seis cuentos">
    <div className="art-glow" aria-hidden="true" />
    <Flow paths={paths} active={hot !== null ? String(hot) : null} />
    <div className="story-hub"><img src="./assets/libro/tapa-collage.jpg" alt="" /><span>SEIS CUENTOS<br />SEIS UNIVERSOS</span></div>
    {stories.map((st, i) => <button key={st.title} type="button" className={`story-world${selected === i ? ' selected' : ''}`}
      style={{ left: `${P[i][0]}%`, top: `${P[i][1]}%`, ['--world-hue' as string]: `${WORLD_HUES[i]}deg`, ['--sway' as string]: `${18 + i * 3}s`, ['--sd' as string]: `${-i * 3}s` }}
      onClick={() => onSelect(i)} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(i)} onBlur={() => setHot(null)} aria-label={`Abrir ficha: ${st.title}`}>
      <span className="world-sway"><span className="world-planet"><img src={st.image} alt="" /><span>{i + 1}</span></span><strong>{st.title}</strong></span>
    </button>)}
    {s && <article className="story-detail" aria-live="polite">
      <button type="button" className="close-detail" onClick={() => onSelect(null)} aria-label="Cerrar ficha">×</button>
      <div className="story-detail-image"><img src={s.image} alt={s.imageAlt} /></div>
      <div className="story-detail-copy">
        <p className="eyebrow">CUENTO {String((selected ?? 0) + 1).padStart(2, '0')}</p>
        <h2>{s.title}</h2>
        <p className="sd-desc">{s.description}</p>
        <p className="sd-mood"><b>Atmósfera</b>{s.mood}</p>
        <p className="sd-problem"><b>Problema que permite interrogar</b>{s.problem}</p>
        {s.ref && <SdRef k={s.ref} />}
      </div>
    </article>}
  </div></div>;
}
function SdRef({ k }: { k: RefKey }) { const [o, setO] = useState(false); return <AcademicReference k={k} open={o} onToggle={() => setO(v => !v)} />; }
