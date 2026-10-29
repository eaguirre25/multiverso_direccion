import { useState } from 'react';
import { CutoutTitle } from './Cutout';
import { Flow, curve, pt, type FlowPath } from './Flow';
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

/* 4 · Dos trayectorias que se aproximan, se cruzan, se separan y se reconectan */
function S4() {
  const A = 'M90 150 C 330 150 380 329 500 329 S 760 515 910 515';
  const B = 'M910 150 C 670 150 620 329 500 329 S 240 515 90 515';
  const A2 = 'M90 150 C 300 190 400 329 500 329 S 720 480 910 515';
  const B2 = 'M910 150 C 700 190 600 329 500 329 S 280 480 90 515';
  const paths: FlowPath[] = [
    { id: 'A', d: A, d2: A2, n: 4, dur: 9, dir: 0, hue: 38, width: 1.4, tags: ['d'] },
    { id: 'B', d: B, d2: B2, n: 4, dur: 10, dir: 0, hue: 185, width: 1.4, tags: ['i'], delay: 0.4 },
    { id: 'r1', d: 'M250 470 C 330 560 670 560 750 470', n: 3, dur: 7, dir: 0, hue: 300, dash: true, delay: 1 },
    { id: 'r2', d: 'M250 470 C 330 380 400 400 500 329', n: 2, dur: 6, dir: 0, hue: 300, dash: true, delay: 1.2 },
    { id: 'r3', d: 'M750 470 C 670 380 600 400 500 329', n: 2, dur: 6.4, dir: 0, hue: 300, dash: true, delay: 1.4 },
  ];
  return <>
    <Flow paths={paths} />
    <Scrap t="COPRODUCCIÓN NARRATIVA" x={50} y={6} r={-1} paper="black" font="didone" s={1.1} d={150} />
    <Scrap t="una directora" x={12} y={17} r={-3} paper="ochre" font="didone" s={1.1} d={300} />
    <Scrap t="un investigador" x={83} y={17} r={3} paper="teal" font="grot" s={1} d={450} />
    <Scrap t="perspectivas parciales" x={24} y={37} r={-3} paper="cream" font="ital" d={700} />
    <Scrap t="conocimientos situados" x={76} y={37} r={3} paper="white" font="news" d={850} />
    <Scrap t="ESCRITURA COMPARTIDA" x={50} y={47} r={0} paper="red" font="cond" s={1.1} d={1000} className="core" />
    <Scrap t="hacer-con" x={50} y={60} r={-2} paper="aged" font="slab" d={1150} />
    <Scrap t="acuerdos y divergencias" x={50} y={84} r={2} paper="magenta" font="grot" s={0.95} d={1300} />
  </>;
}

/* 5 · Tres núcleos literarios con ficha bibliográfica desplegable -------- */
function S5() {
  const [hot, setHot] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const CORES: { k: string; name: string; at: Pos; concepts: string[]; ref: RefKey; paper: Paper; font: Font; up?: boolean }[] = [
    { k: 'cor', name: 'JULIO CORTÁZAR', at: [21, 25], concepts: ['Concentración', 'Intensidad', 'Tensión narrativa'], ref: 'cortazar1971', paper: 'aged', font: 'didone' },
    { k: 'pig', name: 'RICARDO PIGLIA', at: [79, 25], concepts: ['Dos historias', 'Elipsis', 'Intersticios narrativos'], ref: 'piglia2000', paper: 'teal', font: 'slab' },
    { k: 'bor', name: 'JORGE LUIS BORGES', at: [50, 82], concepts: ['Bifurcaciones temporales', 'Coexistencia de tiempos posibles'], ref: 'borges1974', paper: 'red', font: 'cond', up: true },
  ];
  const C: Pos = [50, 53];
  const paths: FlowPath[] = [
    ...CORES.map((c, i) => ({ id: `c${i}`, ...link(c.at, C, i === 2 ? 0 : (i ? 60 : -60), 20), n: 4, dur: 6 + i, dir: 0 as const, hue: [40, 175, 340][i], tags: [c.k], width: 1.4 } as FlowPath)),
    { id: 'cp', ...link(CORES[0].at, CORES[1].at, -90, 30), n: 3, dur: 9, dir: 0, hue: 270, dash: true, tags: ['cor', 'pig'] },
    { id: 'pb', ...link(CORES[1].at, CORES[2].at, -80, 30), n: 3, dur: 10, dir: 0, hue: 270, dash: true, tags: ['pig', 'bor'] },
    { id: 'bc', ...link(CORES[2].at, CORES[0].at, -80, 30), n: 3, dur: 11, dir: 0, hue: 270, dash: true, tags: ['bor', 'cor'] },
  ];
  return <>
    <Flow paths={paths} active={hot} />
    <div className="art-center art-center-s5" style={{ left: `${C[0]}%`, top: `${C[1]}%` }}><CutoutTitle text="¿POR QUÉ CUENTOS?" max={13} seed={77} mode="letters" /></div>
    {CORES.map((c, i) => <div key={c.k} className={`core-card${hot === c.k ? ' core-hot' : ''}${open === c.k ? ' core-open' : ''}`} style={{ left: `${c.at[0]}%`, top: `${c.at[1]}%`, ['--d' as string]: `${300 + i * 200}ms` }}
      onMouseEnter={() => setHot(c.k)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(c.k)} onBlur={() => setHot(null)}>
      <span className={`core-name p-${c.paper} f-${c.font}`}>{c.name}</span>
      <ul>{c.concepts.map(t => <li key={t}>{t}</li>)}</ul>
      <AcademicReference k={c.ref} open={open === c.k} onToggle={() => setOpen(open === c.k ? null : c.k)} popover up={c.up} />
    </div>)}
  </>;
}

/* 6 · Constelación de presencias vivas, objetos y otras presencias ------- */
function S6() {
  const [hot, setHot] = useState<string | null>(null);
  type Kind = 'vivo' | 'objeto' | 'otro';
  const N: Record<string, { p: Pos; kind: Kind; img?: string; paper: Paper; font: Font; r: number }> = {
    neuronas: { p: [14, 24], kind: 'vivo', img: stories[0].image, paper: 'teal', font: 'ital', r: -4 },
    hongos: { p: [46, 12], kind: 'vivo', img: stories[1].image, paper: 'teal', font: 'type', r: 3 },
    aves: { p: [84, 22], kind: 'vivo', img: './assets/fauna/gorrion.png', paper: 'teal', font: 'grot', r: -3 },
    puerta: { p: [90, 54], kind: 'objeto', img: stories[2].image, paper: 'ochre', font: 'didone', r: 3 },
    mate: { p: [80, 84], kind: 'objeto', img: stories[4].image, paper: 'ochre', font: 'slab', r: -3 },
    tecnologías: { p: [47, 85], kind: 'otro', paper: 'magenta', font: 'type', r: 2 },
    monstruo: { p: [18, 82], kind: 'otro', img: stories[3].image, paper: 'magenta', font: 'cond', r: -3 },
    afectos: { p: [8, 54], kind: 'otro', paper: 'magenta', font: 'didone', r: 3 },
  };
  const E: [string, string, number][] = [['neuronas', 'hongos', 30], ['hongos', 'aves', -40], ['aves', 'puerta', 40], ['puerta', 'mate', -40], ['mate', 'tecnologías', 30], ['tecnologías', 'monstruo', -30], ['monstruo', 'afectos', 40], ['afectos', 'neuronas', -40], ['hongos', 'puerta', 110], ['neuronas', 'monstruo', 120], ['aves', 'mate', 120], ['afectos', 'hongos', -90], ['tecnologías', 'puerta', 70]];
  const paths: FlowPath[] = E.map(([a, b, bend], i) => ({ id: `${a}-${b}`, ...link(N[a].p, N[b].p, bend, 30), tags: [a, b], n: 2, dur: 6 + (i * 1.7) % 7, dir: i % 2 ? 1 : -1, hue: N[a].kind === 'vivo' ? 150 : N[a].kind === 'objeto' ? 40 : 320, delay: i * 0.1 }));
  return <>
    <Flow paths={paths} active={hot} />
    <div className="coral-core" aria-hidden="false">
      <Scrap t="NARRATIVA CORAL" x={50} y={38} r={-2} paper="cream" font="didone" s={1.15} d={200} />
      <Scrap t="MULTIPLICIDADES" x={50} y={50} r={2} paper="black" font="cond" s={1.2} d={350} />
      <Scrap t="PRESENCIAS MÁS-QUE-HUMANAS" x={50} y={62} r={-1} paper="aged" font="slab" s={0.95} d={500} />
    </div>
    {Object.entries(N).map(([k, v], i) => <span key={k} className={`pres pres-${v.kind}${hot && hot !== k ? ' pres-dim' : ''}`}>
      {v.img && <img className={`cameo cameo-${v.kind}`} src={v.img} alt="" style={{ left: `${v.p[0]}%`, top: `${v.p[1] - 8}%` }} />}
      <Scrap t={k} x={v.p[0]} y={v.p[1] + (v.img ? 4 : 0)} r={v.r} paper={v.paper} font={v.font} d={300 + i * 80} focusable on={hot === k} onEnter={() => setHot(k)} onLeave={() => setHot(null)} />
    </span>)}
    <ul className="legend" aria-label="Tipos de presencia"><li className="lg-vivo">organismos</li><li className="lg-objeto">objetos</li><li className="lg-otro">otras presencias</li></ul>
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
        <p className="sd-problem"><b>Problema que permite interrogar</b>{s.problem}</p>
        {s.ref && <SdRef k={s.ref} />}
      </div>
    </article>}
  </div></div>;
}
function SdRef({ k }: { k: RefKey }) { const [o, setO] = useState(false); return <AcademicReference k={k} open={o} onToggle={() => setO(v => !v)} />; }
