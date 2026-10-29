import { useEffect, useMemo, useRef, useState } from 'react';
import { portals, presentation } from './data/presentation';
import Cosmos from './components/Cosmos';
import { CutoutDefs, CutoutTitle, MainTitle } from './components/Cutout';
import { GateArt, GateDefs } from './components/Gate';
import { SceneArt, StoryScene } from './components/Scenes';
import { ReferenceList } from './components/AcademicReference';
import { MotionCtx } from './components/Flow';

type Scene = 'cover' | 'map' | 'portal';
function Icon({ name, size = 17 }: { name: 'left' | 'right' | 'book' | 'expand' | 'home' | 'map' | 'close'; size?: number }) {
  const paths: Record<typeof name, React.ReactNode> = {
    left: <><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>, right: <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    book: <><path d="M12 7v14"/><path d="M3 18V5a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v13h-5a4 4 0 0 0-4 3 4 4 0 0 0-4-3z"/></>,
    expand: <><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/></>,
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9M9 21v-7h6v7"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/></>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
const HUES = [277, 185, 30, 334, 48, 145, 260, 206, 13];
// Composición de la escena central (porcentajes del escenario 16:9).
// s = escala por plano de profundidad; ry = giro para que cada portal mire hacia la escuela.
const gates = [
  { x: 12, y: 41, s: 1.12, ry: 26, rz: -6 }, { x: 30, y: 20, s: 0.78, ry: 16, rz: 4 }, { x: 53, y: 12, s: 0.62, ry: 4, rz: 0 },
  { x: 76, y: 19, s: 0.86, ry: -16, rz: -4 }, { x: 90, y: 43, s: 1.0, ry: -26, rz: 6 }, { x: 88, y: 76, s: 1.18, ry: -28, rz: -3 },
  { x: 66, y: 86, s: 0.78, ry: -14, rz: 5 }, { x: 33, y: 87, s: 0.92, ry: 16, rz: -4 }, { x: 11, y: 76, s: 1.0, ry: 26, rz: 3 },
];
const SCHOOL = { x: 50, y: 52 };
const filament = (i: number, mul = 1) => {
  const g = gates[i]; const gx = g.x * 16, gy = g.y * 9; const sx = SCHOOL.x * 16, sy = SCHOOL.y * 9 - 20;
  const dx = gx - sx, dy = gy - sy; const len = Math.hypot(dx, dy);
  // arranca en el borde de la escuela y se curva hacia el portal
  const k = Math.min(1, 300 / Math.max(1, Math.abs(dx)) * 0.9);
  const x0 = sx + dx * 0.0 + Math.sign(dx) * Math.min(Math.abs(dx), 250 * (0.9 + 0.1 * k)), y0 = sy + dy * 0.28;
  const nx = -dy / len, ny = dx / len; const bend = (i % 2 ? 1 : -1) * 70 * mul;
  const cx = (x0 + gx) / 2 + nx * bend, cy = (y0 + gy) / 2 + ny * bend;
  return `M${x0.toFixed(0)} ${y0.toFixed(0)} Q${cx.toFixed(0)} ${cy.toFixed(0)} ${gx.toFixed(0)} ${gy.toFixed(0)}`;
};

function FilPath({ i, className, style, filter, live }: { i: number; className: string; style?: React.CSSProperties; filter?: string; live: boolean }) {
  const d = filament(i);
  return <path d={d} className={className} style={style} filter={filter}>{live && <animate attributeName="d" dur={`${15 + i * 1.7}s`} repeatCount="indefinite" values={`${d};${filament(i, -0.55)};${d}`} />}</path>;
}

export default function App() {
  const [scene, setScene] = useState<Scene>(() => { const q = new URLSearchParams(window.location.search); return q.get('portal') ? 'portal' : q.get('scene') === 'map' ? 'map' : 'cover'; });
  const [portalIndex, setPortalIndex] = useState(() => Math.max(0, Math.min(8, Number(new URLSearchParams(window.location.search).get('portal') || 1) - 1)));
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const [presenter, setPresenter] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [transitioning, setTransitioning] = useState(false);
  const [targetPortal, setTargetPortal] = useState<number | null>(null);
  const [hoverGate, setHoverGate] = useState<number | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [returning, setReturning] = useState(false);
  const [entering, setEntering] = useState(false);
  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => { const id = window.setTimeout(fn, ms); timers.current.push(id); };
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState<Record<number, string>>(() => {
    try { return JSON.parse(localStorage.getItem('multiverso-notes') || '{}') as Record<number, string>; } catch { return {}; }
  });
  const current = portals[portalIndex];
  const progress = useMemo(() => Math.round(((scene === 'cover' ? 0 : portalIndex + 1) / portals.length) * 100), [portalIndex, scene]);

  useEffect(() => { localStorage.setItem('multiverso-notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => {
    if (!presenter) return;
    const timer = window.setInterval(() => setElapsed(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [presenter]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (busy.current) return;
      if (event.key === 'Escape') { setNotesOpen(false); if (storyIndex !== null) setStoryIndex(null); else goMap(); }
      if (event.key.toLowerCase() === 'm') goMap();
      if (event.key.toLowerCase() === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
      if (event.key === 'ArrowRight') { event.preventDefault(); if (scene === 'cover') enterMap(reducedMotion); else { setPortalIndex(i => (i + 1) % portals.length); setScene('portal'); setStoryIndex(null); } }
      if (event.key === 'ArrowLeft') { event.preventDefault(); if (scene === 'portal' && portalIndex > 0) { setPortalIndex(i => i - 1); setStoryIndex(null); } else goMap(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [portalIndex, scene, reducedMotion, storyIndex]);

  const enterMap = (reduced = reducedMotion) => {
    setTransitioning(true);
    later(() => { setScene('map'); setTransitioning(false); setReturning(true); later(() => setReturning(false), 2200); }, reduced ? 10 : 760);
  };
  // Ingreso dimensional: ilumina el portal, atenúa el resto, la cámara se aproxima,
  // el anillo se expande y un túnel de luz tiñe la atmósfera antes de abrir el universo.
  const openPortal = (index: number) => {
    if (busy.current) return;
    busy.current = true; setTargetPortal(index);
    later(() => { setPortalIndex(index); setStoryIndex(null); setScene('portal'); setTargetPortal(null); setEntering(true); busy.current = false; later(() => setEntering(false), 2400); }, reducedMotion ? 30 : 1750);
  };
  // Regreso: el universo se contrae y el mapa reaparece de forma progresiva.
  const goMap = () => {
    if (scene === 'map' || busy.current) return;
    if (scene === 'cover') { setScene('map'); return; }
    busy.current = true; setLeaving(true);
    later(() => { setScene('map'); setLeaving(false); setReturning(true); busy.current = false; later(() => setReturning(false), 2200); }, reducedMotion ? 30 : 650);
  };
  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return <MotionCtx.Provider value={reducedMotion}><main className={`app-shell${reducedMotion ? ' motion-reduced' : ''}`}>
    <CutoutDefs /><GateDefs /><Cosmos />
    {scene === 'cover' && <section className="cover scene-in">
      <div className="cinema-veil" aria-hidden="true"/>
      <div className="cover-gate" aria-hidden="true" style={{ ['--h' as string]: 38 }}><GateArt id="cover-gate" seed={7} hue={38}/></div>
      <div className="cover-gate cover-gate-b" aria-hidden="true" style={{ ['--h' as string]: 268 }}><GateArt id="cover-gate-b" seed={3} hue={268}/></div>
      <div className="cover-content">
        <p className="eyebrow">Ponencia · Investigación postcualitativa</p>
        <h1 className="cover-title"><MainTitle/></h1>
        <p className="subtitle">{presentation.subtitle}</p>
        <div className="byline">{presentation.authors.map(author => <span key={author}>{author}</span>)}</div>
        <div className="editable-meta"><span>{presentation.affiliations}</span><span contentEditable suppressContentEditableWarning>{presentation.meeting}</span></div>
        <button className="enter-button" onClick={() => enterMap()}>Entrar al multiverso <Icon name="right"/></button>
      </div>
    </section>}

    {scene === 'map' && <section className={`map-scene ${returning ? 'map-return' : 'scene-in'}`}>
      <div className="cinema-veil" aria-hidden="true"/>
      <header className="scene-header"><div><p className="eyebrow">Mapa central · elegí un portal</p><h1 className="map-heading"><CutoutTitle text="La escuela como universo" small max={11}/></h1></div><button className="subtle-button" onClick={() => setScene('cover')}><Icon name="home" size={16}/> Portada</button></header>
      <div className={`stage${targetPortal !== null ? ' diving' : ''}`} data-diving={targetPortal !== null} style={targetPortal !== null ? { ['--ox' as string]: `${gates[targetPortal].x}%`, ['--oy' as string]: `${gates[targetPortal].y}%` } : undefined}>
        <div className="school-halo" aria-hidden="true"/><div className="school-rays" aria-hidden="true"/>
        <svg className="filaments" viewBox="0 0 1600 900" aria-hidden="true">
          <defs><filter id="fil-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter></defs>
          {gates.map((_, i) => <g key={i} className={`filament${hoverGate === i ? ' on' : ''}${hoverGate !== null && hoverGate !== i ? ' off' : ''}${targetPortal === i ? ' on' : ''}`} style={{ ['--h' as string]: HUES[i], ['--i' as string]: i }}>
            <FilPath i={i} className="fil-glow" filter="url(#fil-glow)" live={!reducedMotion}/><FilPath i={i} className="fil-line" live={!reducedMotion}/><FilPath i={i} className="fil-pulse" style={{ animationDelay: `${-i * 1.3}s` }} live={!reducedMotion}/><FilPath i={i} className="fil-pulse fil-back" style={{ animationDelay: `${-i * 0.9 - 2}s` }} live={!reducedMotion}/>
          </g>)}
        </svg>
        <div className="school-core"><div className="school-shadow"/><img src="./assets/school/escuela-flotante.svg" alt="Una escuela secundaria pública argentina flotando sobre un fragmento de suelo, entre raíces y ladrillos"/></div>
        {portals.map((portal, index) => { const g = gates[index]; const hue = [277, 185, 30, 334, 48, 145, 260, 206, 13][index];
          return <button key={portal.id} className={`gate${targetPortal === index ? ' gate-approach' : ''}${hoverGate === index ? ' gate-hot' : ''}${hoverGate !== null && hoverGate !== index ? ' gate-off' : ''}`}
            style={{ left: `${g.x}%`, top: `${g.y}%`, zIndex: Math.round(g.s * 10), ['--i' as string]: index, ['--h' as string]: hue, ['--s' as string]: g.s, ['--ry' as string]: `${g.ry}deg`, ['--rz' as string]: `${g.rz}deg` }}
            onMouseEnter={() => setHoverGate(index)} onMouseLeave={() => setHoverGate(null)} onFocus={() => setHoverGate(index)} onBlur={() => setHoverGate(null)}
            onClick={() => openPortal(index)} aria-label={`Abrir portal ${portal.id}: ${portal.title}`}>
            <span className="gate-tilt"><GateArt id={`g${portal.id}`} seed={portal.id} hue={hue}/></span>
            <span className="gate-num">{String(portal.id).padStart(2, '0')}</span>
            <span className={`gate-label${g.y > 60 ? ' gate-label-up' : ''}`}><CutoutTitle text={portal.title} small max={9} seed={portal.id * 31}/></span>
          </button>; })}
      </div>
      {targetPortal !== null && <div className="dive-tunnel" aria-hidden="true" style={{ ['--h' as string]: HUES[targetPortal], ['--tx' as string]: `${gates[targetPortal].x}%`, ['--ty' as string]: `${gates[targetPortal].y}%` }}><i/><i/><i/><i/><b/></div>}
      <footer className="map-footer"><span>9 portales · un mapa abierto</span><span>← → recorrer · F pantalla completa · M mapa</span></footer>
    </section>}

    {scene === 'portal' && current && <section key={`portal-${current.id}`} className={`portal-scene scene-in${current.storyPortal ? ' story-scene' : ''}${entering ? ' entering' : ''}${leaving ? ' leaving' : ''}`} style={{ ['--h' as string]: HUES[current.id - 1] }}>
      <div className="cinema-veil" aria-hidden="true"/>
      <header className="scene-header portal-top"><div><p className="eyebrow">PORTAL {String(current.id).padStart(2, '0')} / 09</p><h1 className="portal-heading"><CutoutTitle text={current.title} small/></h1></div><button className="subtle-button" onClick={goMap}><Icon name="map" size={16}/> Volver a la escuela <kbd>Esc</kbd></button></header>
      <div className={`portal-body portal-body-${current.id}`}>
        {current.storyPortal ? <StoryScene selected={storyIndex} onSelect={setStoryIndex} /> : <SceneArt id={current.id} />}
        <article className="portal-copy"><p className="portal-kicker">{current.short}</p><p className="portal-description">{current.description}</p><ReferenceList key={current.id} items={current.ground} />{current.id === 5 && <p className="aref-hint">Cada núcleo despliega su referencia completa: clic o Enter sobre la cita.</p>}</article>
      </div>
      <nav className="portal-nav"><button onClick={() => { setPortalIndex(i => (i + portals.length - 1) % portals.length); setStoryIndex(null); }}><Icon name="left"/> Anterior</button><span>{String(current.id).padStart(2, '0')} <i/> {String(portals.length).padStart(2, '0')}</span><button onClick={() => { setPortalIndex(i => (i + 1) % portals.length); setStoryIndex(null); }}>Siguiente <Icon name="right"/></button></nav>
    </section>}

    <aside className={`presenter-panel${presenter ? ' presenter-visible' : ''}`} aria-hidden={!presenter}><div className="presenter-head"><span>MODO PRESENTADOR</span><button onClick={() => setPresenter(false)} aria-label="Cerrar modo presentador"><Icon name="close"/></button></div><p>{scene === 'cover' ? 'Portada' : `Sección ${current?.id ?? '—'} · ${current?.title ?? 'Mapa central'}`}</p><div className="progress-track"><i style={{ width: `${progress}%` }}/></div><div className="presenter-meta"><span>{progress}% del recorrido</span><span>{clock}</span></div><label htmlFor="oral-notes">Notas orales · guardado local</label><textarea id="oral-notes" value={scene === 'portal' && current ? notes[current.id] ?? current.notes : ''} onChange={event => current && setNotes(value => ({ ...value, [current.id]: event.target.value }))} placeholder="Escribí notas para esta sección…"/></aside>
    <div className="utility-controls"><button title="Movimiento reducido" aria-pressed={reducedMotion} onClick={() => setReducedMotion(value => !value)}><span className="motion-icon">{reducedMotion ? 'I' : '≈'}</span><span>Movimiento {reducedMotion ? 'reducido' : 'activo'}</span></button><button title="Modo presentador" onClick={() => setPresenter(value => !value)}><Icon name="book"/><span>Notas</span></button><button title="Pantalla completa (F)" onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()}><Icon name="expand"/><span>Pantalla</span></button></div>
    {transitioning && <div className="warp-transition" aria-hidden="true"><div className="warp-tunnel"/><span>ENTRANDO AL MULTIVERSO</span></div>}
    {notesOpen && <div className="notes-backdrop" onClick={() => setNotesOpen(false)}><div className="notes-modal" onClick={event => event.stopPropagation()}><button className="close-detail" onClick={() => setNotesOpen(false)}><Icon name="close" size={18}/></button><h2>Modo presentador</h2><p>Las notas son editables y se guardan en este navegador.</p><button onClick={() => { setPresenter(true); setNotesOpen(false); }}>Abrir panel de notas</button></div></div>}
  </main></MotionCtx.Provider>;
}
