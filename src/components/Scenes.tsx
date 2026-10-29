import { useState } from 'react';
import { CutoutTitle } from './Cutout';
import { GateArt } from './Gate';
import { stories } from '../data/presentation';

/* Composiciones de las escenas interiores. Cada portal tiene su propio
   diagrama espacial, hecho con recortes (Scrap), hilos SVG y capas. */

type Paper = 'cream' | 'white' | 'aged' | 'news' | 'black' | 'red' | 'teal' | 'ochre' | 'magenta' | 'violet';
type Font = 'news' | 'didone' | 'slab' | 'cond' | 'grot' | 'type' | 'ital';

function Scrap({ t, x, y, r = 0, paper = 'cream', font = 'news', s = 1, d = 0, move = false, on, onEnter, onLeave }: { t: string; x: number; y: number; r?: number; paper?: Paper; font?: Font; s?: number; d?: number; move?: boolean; on?: boolean; onEnter?: () => void; onLeave?: () => void }) {
  return <span className={`scrap p-${paper} f-${font}${move ? ' scrap-move' : ''}${on ? ' scrap-on' : ''}`} onMouseEnter={onEnter} onMouseLeave={onLeave}
    style={{ left: `${x}%`, top: `${y}%`, ['--r' as string]: `${r}deg`, ['--s' as string]: s, ['--d' as string]: `${d}ms` }}>{t}</span>;
}
const Lines = ({ children }: { children: React.ReactNode }) => <svg className="art-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{children}</svg>;
const Center = ({ x = 50, y = 50, children }: { x?: number; y?: number; children: React.ReactNode }) => <div className="art-center" style={{ left: `${x}%`, top: `${y}%` }}>{children}</div>;

/* 1 · Muchas relaciones simultáneas alrededor de una pregunta */
function S1() {
  const w: [string, number, number, number, Paper, Font][] = [
    ['liderazgo individual', 22, 22, -4, 'black', 'didone'], ['regulaciones', 78, 20, 3, 'aged', 'slab'], ['espacios', 90, 50, -3, 'teal', 'grot'],
    ['tecnologías', 78, 80, 4, 'news', 'cond'], ['cuerpos', 50, 90, -2, 'red', 'cond'], ['alimentos', 20, 78, 3, 'cream', 'ital'], ['afectos', 8, 50, -5, 'magenta', 'didone'], ['gestión', 50, 10, 2, 'white', 'type'],
  ];
  return <>
    <Lines>{w.map(([, x, y], i) => <path key={i} d={`M50 50 Q${(50 + x) / 2 + (i % 2 ? 6 : -6)} ${(50 + y) / 2 + 5} ${x} ${y}`} className="thread" style={{ animationDelay: `${i * 120}ms` }} />)}</Lines>
    <Center><CutoutTitle text="¿Cómo?" max={6} seed={11} /></Center>
    {w.map(([t, x, y, r, p, f], i) => <Scrap key={t} t={t} x={x} y={y} r={r} paper={p} font={f} d={300 + i * 90} s={t === 'liderazgo individual' ? 0.9 : 1} />)}
  </>;
}

/* 2 · Cinco escenas que ocurren al mismo tiempo, abarrotadas */
function S2() {
  const c: [string, number, number, number, Paper, Font][] = [
    ['una entrevista', 31, 30, -6, 'cream', 'news'], ['mensajes en un teléfono personal', 62, 24, 3, 'aged', 'type'], ['una firma pendiente', 22, 62, 5, 'white', 'ital'],
    ['la entrada de un estudiante', 70, 60, -4, 'teal', 'grot'], ['una urgencia del comedor', 48, 82, 3, 'red', 'slab'],
  ];
  return <>
    <Lines><circle cx="50" cy="50" r="18" className="ring-line" /><circle cx="50" cy="50" r="31" className="ring-line" style={{ animationDelay: '600ms' }} /></Lines>
    <Center><CutoutTitle text="2021–2025" max={7} seed={5} /></Center>
    <Scrap t="tres escuelas secundarias" x={50} y={9} r={-1} paper="black" font="didone" s={1} d={100} />
    {c.map(([t, x, y, r, p, f], i) => <Scrap key={t} t={t} x={x} y={y} r={r} paper={p} font={f} d={300 + i * 140} s={0.92} />)}
  </>;
}

/* 3 · Códigos separados ⇄ cuento que reensambla (interactivo) */
function S3() {
  const [story, setStory] = useState(false);
  const items: [string, [number, number, number], [number, number, number], Paper, Font][] = [
    ['entrevista', [24, 24, 0], [46, 38, -7], 'news', 'type'], ['mensajes', [24, 38, 0], [68, 30, 5], 'news', 'type'], ['firma pendiente', [24, 52, 0], [58, 52, -3], 'news', 'type'],
    ['entrada de un estudiante', [24, 66, 0], [44, 66, 4], 'news', 'type'], ['urgencia del comedor', [24, 80, 0], [72, 70, -5], 'news', 'type'],
  ];
  const papers: Paper[] = ['aged', 'teal', 'white', 'red', 'ochre'];
  return <>
    <Lines>{story && items.map((_, i) => <path key={i} d={`M${items[i][2][0]} ${items[i][2][1]} L${items[(i + 1) % items.length][2][0]} ${items[(i + 1) % items.length][2][1]}`} className="thread" />)}
      {!story && <path d="M12 16V88M12 16H88" className="ring-line" />}</Lines>
    <div className="art-title" style={{ left: '50%', top: '9%' }}><CutoutTitle text={story ? 'CUENTO' : 'CÓDIGOS'} max={7} seed={story ? 41 : 17} /></div>
    {items.map(([t, a, b, p, f], i) => { const q = story ? b : a; return <Scrap key={t} t={t} x={q[0]} y={q[1]} r={q[2]} paper={story ? papers[i] : p} font={story ? (['didone', 'slab', 'ital', 'grot', 'cond'] as Font[])[i] : f} move d={i * 80} s={1.05} />; })}
    <button className="art-toggle" onClick={() => setStory(v => !v)}>{story ? '← Volver a codificar' : 'Reensamblar en ficción →'}</button>
  </>;
}

/* 4 · Dos voces, una zona compartida */
function S4() {
  return <>
    <div className="venn venn-a" /><div className="venn venn-b" />
    <Lines><path d="M26 50 Q50 20 74 50 Q50 80 26 50" className="thread" /></Lines>
    <Scrap t="una directora" x={27} y={22} r={-4} paper="ochre" font="didone" s={1.25} d={150} />
    <Scrap t="un investigador" x={73} y={22} r={3} paper="teal" font="grot" s={1.1} d={300} />
    <Scrap t="memorias" x={26} y={64} r={-3} paper="cream" font="ital" d={500} />
    <Scrap t="materiales de campo" x={72} y={68} r={3} paper="news" font="type" d={600} />
    <Scrap t="acuerdos" x={50} y={40} r={-2} paper="white" font="slab" d={700} />
    <Scrap t="divergencias" x={50} y={53} r={2} paper="red" font="cond" s={1.1} d={800} />
    <Scrap t="tensiones" x={50} y={79} r={-3} paper="black" font="didone" d={900} />
  </>;
}

/* 5 · Un camino que se bifurca: forma breve */
function S5() {
  return <>
    <Lines>
      <path d="M4 52 H34" className="path-main" /><path d="M34 52 C 48 52 50 24 70 24 S 90 20 98 20" className="path-main" style={{ animationDelay: '500ms' }} />
      <path d="M34 52 C 52 52 56 52 98 52" className="path-main" style={{ animationDelay: '700ms' }} /><path d="M34 52 C 48 52 52 82 70 80 S 90 84 98 84" className="path-main" style={{ animationDelay: '900ms' }} />
      <circle cx="34" cy="52" r="1.8" className="node" />
    </Lines>
    <Scrap t="concentración" x={17} y={40} r={-3} paper="black" font="didone" s={1.15} d={200} />
    <Scrap t="intensidad" x={17} y={66} r={2} paper="red" font="cond" s={1.2} d={400} />
    <Scrap t="elipsis" x={62} y={42} r={-2} paper="cream" font="ital" s={1.1} d={800} />
    <Scrap t="tiempos que se bifurcan" x={66} y={13} r={2} paper="aged" font="slab" d={1000} />
    <Scrap t="lectura que completa" x={68} y={92} r={-2} paper="teal" font="grot" s={0.95} d={1200} />
  </>;
}

/* 6 · Coral y multiespecies: constelación de presencias */
function S6() {
  const [hot, setHot] = useState<number | null>(null);
  const p: [string, number, number, number, Paper, Font, number | null][] = [
    ['neuronas', 16, 22, -4, 'cream', 'ital', 0], ['hongos', 82, 20, 3, 'aged', 'type', 1], ['puertas', 88, 56, -3, 'black', 'didone', 2], ['mate', 74, 86, 4, 'ochre', 'slab', 4],
    ['aves', 30, 88, -2, 'teal', 'grot', 5], ['monstruo', 8, 62, 3, 'red', 'cond', 3], ['tecnologías', 50, 8, -1, 'news', 'type', null], ['afectos', 62, 70, 3, 'magenta', 'didone', null], ['cuerpos', 4, 40, -4, 'white', 'news', null],
  ];
  const pos = (i: number) => [p[i][1], p[i][2]];
  return <>
    <Lines>{p.map(([, x, y], i) => <path key={i} d={`M50 50 Q${(50 + x) / 2 + 5} ${(50 + y) / 2 - 6} ${x} ${y}`} className={`thread${hot === i ? ' hot' : ''}`} style={{ opacity: hot === null || hot === i ? 1 : 0.25, animationDelay: `${i * 90}ms` }} />)}</Lines>
    <Center><div className="coral-pair"><CutoutTitle text="CORAL" max={6} seed={3} /><CutoutTitle text="MULTIESPECIES" max={9} seed={9} mode="letters" /></div></Center>
    {p.map(([t, x, y, r, pa, f, si], i) => <span key={t} style={{ opacity: hot === null || hot === i ? 1 : 0.4, transition: 'opacity .3s' }}>
      <Scrap t={t} x={x} y={y} r={r} paper={pa} font={f} d={200 + i * 90} on={hot === i} onEnter={() => setHot(i)} onLeave={() => setHot(null)} />
      {si !== null && <img className={`cameo${si === 5 ? ' cameo-bird' : ''}`} src={si === 5 ? './assets/fauna/gorrion.png' : stories[si].image} alt="" style={{ left: `${pos(i)[0] + (pos(i)[0] < 50 ? 9 : -9)}%`, top: `${pos(i)[1] + 8}%` }} />}
    </span>)}
  </>;
}

/* 8 · La escritura como método de indagación */
function S8() {
  return <>
    <div className="manuscript">
      <div className="ms-lines" />
      <p className="ms-quote">“Writing is thinking, writing is analysis”</p>
      <p className="ms-cite">Richardson &amp; St. Pierre (2005, p. 967)</p>
      <svg className="ms-scribble" viewBox="0 0 200 40" aria-hidden="true"><path d="M5 25 C 30 5 40 38 70 20 S 110 8 130 24 S 175 30 195 12" /></svg>
    </div>
    <Lines><path d="M24 78 L50 84 L76 78" className="thread" /></Lines>
    <Scrap t="registros" x={20} y={86} r={-4} paper="news" font="type" d={300} />
    <Scrap t="escritura" x={50} y={92} r={2} paper="black" font="didone" s={1.3} d={500} />
    <Scrap t="preguntas nuevas" x={80} y={86} r={4} paper="aged" font="ital" d={700} />
    <Scrap t="otra práctica analítica" x={82} y={12} r={3} paper="teal" font="grot" s={0.9} d={900} />
  </>;
}

/* 9 · Ondas de lectura */
function S9() {
  return <>
    <div className="ripples" aria-hidden="true"><i /><i /><i /><i /></div>
    <div className="art-gate" style={{ left: '50%', top: '50%' }}><GateArt id="s9-gate" seed={9} hue={13} /></div>
    <Scrap t="una escena" x={50} y={50} r={-2} paper="black" font="didone" s={1.2} d={100} />
    <Scrap t="vacíos que convocan" x={22} y={26} r={-4} paper="cream" font="ital" d={500} />
    <Scrap t="posiciones" x={80} y={30} r={3} paper="teal" font="grot" d={700} />
    <Scrap t="experiencias" x={20} y={74} r={3} paper="aged" font="slab" d={900} />
    <Scrap t="lecturas colectivas" x={78} y={78} r={-3} paper="red" font="cond" s={1.15} d={1100} />
  </>;
}

export function SceneArt({ id }: { id: number }) {
  const body = { 1: <S1 />, 2: <S2 />, 3: <S3 />, 4: <S4 />, 5: <S5 />, 6: <S6 />, 8: <S8 />, 9: <S9 /> }[id];
  return <div className={`scene-art art-${id}`}><div className="art-glow" aria-hidden="true" />{body}</div>;
}
