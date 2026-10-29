import { useEffect, useRef, useState } from 'react';
import { portals, presentation } from './data/presentation';
import Cosmos from './components/Cosmos';
import { CutoutDefs, CutoutTitle, MainTitle } from './components/Cutout';
import { GateArt, GateDefs } from './components/Gate';
import { SceneArt, StoryScene } from './components/Scenes';
import { PortalCopy } from './components/AcademicReference';
import { MotionCtx } from './components/Flow';
import ThankYou from './components/ThankYou';

type Scene = 'cover' | 'map' | 'portal' | 'thanks';
function Icon({ name, size = 17 }: { name: 'left' | 'right' | 'expand' | 'home' | 'map'; size?: number }) {
  const paths: Record<typeof name, React.ReactNode> = {
    left: <><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></>, right: <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    expand: <><path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3"/></>,
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9M9 21v-7h6v7"/></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/></>,
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
  const x0 = sx + Math.sign(dx) * Math.min(Math.abs(dx), 250 * (0.9 + 0.1 * k)), y0 = sy + dy * 0.28;
  const nx = -dy / len, ny = dx / len; const bend = (i % 2 ? 1 : -1) * 70 * mul;
  const cx = (x0 + gx) / 2 + nx * bend, cy = (y0 + gy) / 2 + ny * bend;
  return `M${x0.toFixed(0)} ${y0.toFixed(0)} Q${cx.toFixed(0)} ${cy.toFixed(0)} ${gx.toFixed(0)} ${gy.toFixed(0)}`;
};

function FilPath({ i, className, style, filter, live }: { i: number; className: string; style?: React.CSSProperties; filter?: string; live: boolean }) {
  const d = filament(i);
  return <path d={d} className={className} style={style} filter={filter}>{live && <animate attributeName="d" dur={`${15 + i * 1.7}s`} repeatCount="indefinite" values={`${d};${filament(i, -0.55)};${d}`} />}</path>;
}

const toggleFullscreen = () => { if (document.fullscreenElement) void document.exitFullscreen(); else void document.documentElement.requestFullscreen?.(); };

export default function App() {
  const q = new URLSearchParams(window.location.search);
  const [scene, setScene] = useState<Scene>(() => (q.get('portal') ? 'portal' : q.get('scene') === 'map' ? 'map' : q.get('scene') === 'thanks' ? 'thanks' : 'cover'));
  const [portalIndex, setPortalIndex] = useState(() => Math.max(0, Math.min(8, Number(q.get('portal') || 1) - 1)));
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  // La accesibilidad respeta la preferencia del sistema; no hay interruptor público.
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
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
  const current = portals[portalIndex];

  /* ---- Navegación dimensional centralizada ----------------------------------
     Todo cambio de universo pasa por el mapa y atraviesa un portal:
     salida → mapa visible (≈1 s) → conexión y anillo del destino → túnel → universo. */
  const showMap = () => { setScene('map'); setReturning(true); later(() => setReturning(false), 2200); };
  const leaveThen = (next: () => void) => { setLeaving(true); later(() => { setLeaving(false); next(); }, reduced ? 30 : 650); };
  const dive = (index: number) => {
    setTargetPortal(index);
    later(() => { setPortalIndex(index); setStoryIndex(null); setScene('portal'); setTargetPortal(null); setHoverGate(null); setEntering(true); busy.current = false; later(() => setEntering(false), 2400); }, reduced ? 30 : 1750);
  };
  const openPortal = (index: number) => { if (busy.current) return; busy.current = true; dive(index); };
  const navigateToPortal = (target: number) => {
    if (busy.current) return; busy.current = true; setStoryIndex(null);
    const viaMap = () => { showMap(); later(() => setHoverGate(target), reduced ? 0 : 450); later(() => dive(target), reduced ? 30 : 1100); };
    if (scene === 'portal' || scene === 'thanks') leaveThen(viaMap); else viaMap();
  };
  const goMap = () => { if (busy.current || scene === 'map' || scene === 'cover') return; busy.current = true; setStoryIndex(null); leaveThen(() => { showMap(); busy.current = false; }); };
  const goThanks = () => { if (busy.current) return; busy.current = true; leaveThen(() => { setScene('thanks'); setEntering(true); later(() => setEntering(false), 2000); busy.current = false; }); };
  const enterMap = () => { if (busy.current) return; busy.current = true; setTransitioning(true); later(() => { showMap(); setTransitioning(false); busy.current = false; }, reduced ? 10 : 760); };
  const next = () => { if (portalIndex < portals.length - 1) navigateToPortal(portalIndex + 1); else goThanks(); };
  const prev = () => { if (portalIndex > 0) navigateToPortal(portalIndex - 1); else goMap(); };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key.toLowerCase() === 'f') { toggleFullscreen(); return; }
      if (busy.current) return;
      if (event.key === 'Escape') { if (storyIndex !== null) setStoryIndex(null); else goMap(); }
      else if (event.key.toLowerCase() === 'm') goMap();
      else if (event.key === 'ArrowRight') { event.preventDefault(); if (scene === 'cover') enterMap(); else if (scene === 'map') openPortal(0); else if (scene === 'portal') next(); }
      else if (event.key === 'ArrowLeft') { event.preventDefault(); if (scene === 'portal') prev(); else if (scene === 'thanks') navigateToPortal(8); else if (scene === 'map') setScene('cover'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return <MotionCtx.Provider value={reduced}><main className="app-shell">
    <CutoutDefs /><GateDefs /><Cosmos />
    {scene === 'cover' && <section className="cover scene-in">
      <div className="cinema-veil" aria-hidden="true"/>
      <div className="cover-gate" aria-hidden="true" style={{ ['--h' as string]: 38 }}><GateArt id="cover-gate" seed={7} hue={38}/></div>
      <div className="cover-gate cover-gate-b" aria-hidden="true" style={{ ['--h' as string]: 268 }}><GateArt id="cover-gate-b" seed={3} hue={268}/></div>
      <div className="cover-content">
        <h1 className="cover-title"><MainTitle/></h1>
        <p className="subtitle">{presentation.subtitle}</p>
        <div className="byline">{presentation.authors.map(author => <span key={author}>{author}</span>)}</div>
        <div className="congress">
          <p className="cg-main">{presentation.congress}</p>
          <p className="cg-uni">{presentation.university}</p>
          <p className="cg-table"><b>{presentation.table}</b> · {presentation.tableTitle}</p>
          <p className="cg-date">{presentation.dates}</p>
        </div>
        <button className="enter-button" onClick={enterMap}>Entrar al multiverso <Icon name="right"/></button>
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
            <FilPath i={i} className="fil-glow" filter="url(#fil-glow)" live={!reduced}/><FilPath i={i} className="fil-line" live={!reduced}/><FilPath i={i} className="fil-pulse" style={{ animationDelay: `${-i * 1.3}s` }} live={!reduced}/><FilPath i={i} className="fil-pulse fil-back" style={{ animationDelay: `${-i * 0.9 - 2}s` }} live={!reduced}/>
          </g>)}
        </svg>
        <div className="school-core"><div className="school-shadow"/><img src="./assets/school/escuela-flotante.svg" alt="Una escuela secundaria pública argentina flotando sobre un fragmento de suelo, entre raíces y ladrillos"/></div>
        {portals.map((portal, index) => { const g = gates[index]; const hue = HUES[index];
          return <button key={portal.id} className={`gate${targetPortal === index ? ' gate-approach' : ''}${hoverGate === index ? ' gate-hot' : ''}${hoverGate !== null && hoverGate !== index ? ' gate-off' : ''}`}
            style={{ left: `${g.x}%`, top: `${g.y}%`, zIndex: hoverGate === index ? 60 : Math.round(g.s * 10), ['--i' as string]: index, ['--h' as string]: hue, ['--s' as string]: g.s, ['--ry' as string]: `${g.ry}deg`, ['--rz' as string]: `${g.rz}deg` }}
            onMouseEnter={() => setHoverGate(index)} onMouseLeave={() => setHoverGate(null)} onFocus={() => setHoverGate(index)} onBlur={() => setHoverGate(null)}
            onClick={() => openPortal(index)} aria-label={`Abrir portal ${portal.id}: ${portal.title}`}>
            <span className="gate-tilt"><GateArt id={`g${portal.id}`} seed={portal.id} hue={hue}/></span>
            <span className="gate-num">{String(portal.id).padStart(2, '0')}</span>
            <span className={`gate-label${g.y > 60 ? ' gate-label-up' : ''}${g.x < 20 ? ' gate-label-l' : ''}${g.x > 80 ? ' gate-label-r' : ''}`}><CutoutTitle text={portal.title} small max={9} seed={portal.id * 31}/></span>
          </button>; })}
      </div>
      {targetPortal !== null && <div className="dive-tunnel" aria-hidden="true" style={{ ['--h' as string]: HUES[targetPortal], ['--tx' as string]: `${gates[targetPortal].x}%`, ['--ty' as string]: `${gates[targetPortal].y}%` }}><i/><i/><i/><i/><b/></div>}
      <footer className="map-footer"><span>9 portales · un mapa abierto</span><span>← → recorrer · F pantalla completa · M mapa</span></footer>
    </section>}

    {scene === 'portal' && current && <section key={`portal-${current.id}`} className={`portal-scene scene-in${current.storyPortal ? ' story-scene' : ''}${entering ? ' entering' : ''}${leaving ? ' leaving' : ''}`} style={{ ['--h' as string]: HUES[current.id - 1] }}>
      <div className="cinema-veil" aria-hidden="true"/>
      <header className="scene-header portal-top"><div><p className="eyebrow">PORTAL {String(current.id).padStart(2, '0')} / 09</p><h1 className="portal-heading"><CutoutTitle text={current.title} small max={14}/></h1></div><button className="subtle-button" onClick={goMap}><Icon name="map" size={16}/> Volver a la escuela <kbd>Esc</kbd></button></header>
      <div className={`portal-body portal-body-${current.id}`}>
        {current.storyPortal ? <StoryScene selected={storyIndex} onSelect={setStoryIndex} /> : <SceneArt id={current.id} />}
        <article className="portal-copy"><p className="portal-kicker">{current.short}</p><PortalCopy key={current.id} portal={current} /></article>
      </div>
      <nav className="portal-nav"><button onClick={prev}><Icon name="left"/> Anterior</button><span>{String(current.id).padStart(2, '0')} <i/> {String(portals.length).padStart(2, '0')}</span><button onClick={next}>Siguiente <Icon name="right"/></button></nav>
    </section>}

    {scene === 'thanks' && <ThankYou entering={entering} leaving={leaving} onPrev={() => navigateToPortal(8)} onCover={() => setScene('cover')} />}

    <div className="utility-controls"><button title="Pantalla completa (F)" onClick={toggleFullscreen}><Icon name="expand"/><span>Pantalla completa</span></button></div>
    {transitioning && <div className="warp-transition" aria-hidden="true"><div className="warp-tunnel"/><span>ENTRANDO AL MULTIVERSO</span></div>}
  </main></MotionCtx.Provider>;
}
