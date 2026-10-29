import { useEffect, useMemo, useState } from 'react';
import { portals, presentation, stories } from './data/presentation';
import Cosmos from './components/Cosmos';
import { CutoutDefs, CutoutTitle, MainTitle } from './components/Cutout';
import { GateArt, GateDefs } from './components/Gate';
import { SceneArt } from './components/Scenes';

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
// Composición de la escena central (porcentajes del escenario 16:9).
// s = escala por plano de profundidad; ry = giro para que cada portal mire hacia la escuela.
const gates = [
  { x: 12, y: 41, s: 1.12, ry: 26, rz: -6 }, { x: 30, y: 20, s: 0.78, ry: 16, rz: 4 }, { x: 53, y: 12, s: 0.62, ry: 4, rz: 0 },
  { x: 76, y: 19, s: 0.86, ry: -16, rz: -4 }, { x: 90, y: 43, s: 1.0, ry: -26, rz: 6 }, { x: 88, y: 76, s: 1.18, ry: -28, rz: -3 },
  { x: 66, y: 86, s: 0.78, ry: -14, rz: 5 }, { x: 33, y: 87, s: 0.92, ry: 16, rz: -4 }, { x: 11, y: 76, s: 1.0, ry: 26, rz: 3 },
];
const SCHOOL = { x: 50, y: 52 };
const filament = (i: number) => {
  const g = gates[i]; const gx = g.x * 16, gy = g.y * 9; const sx = SCHOOL.x * 16, sy = SCHOOL.y * 9 - 20;
  const dx = gx - sx, dy = gy - sy; const len = Math.hypot(dx, dy);
  // arranca en el borde de la escuela y se curva hacia el portal
  const k = Math.min(1, 300 / Math.max(1, Math.abs(dx)) * 0.9);
  const x0 = sx + dx * 0.0 + Math.sign(dx) * Math.min(Math.abs(dx), 250 * (0.9 + 0.1 * k)), y0 = sy + dy * 0.28;
  const nx = -dy / len, ny = dx / len; const bend = (i % 2 ? 1 : -1) * 70;
  const cx = (x0 + gx) / 2 + nx * bend, cy = (y0 + gy) / 2 + ny * bend;
  return `M${x0.toFixed(0)} ${y0.toFixed(0)} Q${cx.toFixed(0)} ${cy.toFixed(0)} ${gx.toFixed(0)} ${gy.toFixed(0)}`;
};

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
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState<Record<number, string>>(() => {
    try { return JSON.parse(localStorage.getItem('multiverso-notes') || '{}') as Record<number, string>; } catch { return {}; }
  });
  const current = portals[portalIndex];
  const currentStory = storyIndex === null ? null : stories[storyIndex];
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
      if (event.key === 'Escape') { setNotesOpen(false); setStoryIndex(null); setScene('map'); }
      if (event.key.toLowerCase() === 'm') setScene('map');
      if (event.key.toLowerCase() === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
      if (event.key === 'ArrowRight') { event.preventDefault(); if (scene === 'cover') enterMap(reducedMotion); else { setPortalIndex(i => (i + 1) % portals.length); setScene('portal'); setStoryIndex(null); } }
      if (event.key === 'ArrowLeft') { event.preventDefault(); if (scene === 'portal' && portalIndex > 0) { setPortalIndex(i => i - 1); setStoryIndex(null); } else setScene('map'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [portalIndex, scene, reducedMotion]);

  const enterMap = (reduced = reducedMotion) => {
    setTransitioning(true);
    window.setTimeout(() => { setScene('map'); setTransitioning(false); }, reduced ? 10 : 760);
  };
  const openPortal = (index: number, reduced = reducedMotion) => {
    setTargetPortal(index);
    if (reduced) { setPortalIndex(index); setStoryIndex(null); setScene('portal'); setTargetPortal(null); return; }
    window.setTimeout(() => { setPortalIndex(index); setStoryIndex(null); setScene('portal'); setTargetPortal(null); }, 680);
  };
  const clock = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return <main className="app-shell">
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

    {scene === 'map' && <section className="map-scene scene-in">
      <div className="cinema-veil" aria-hidden="true"/>
      <header className="scene-header"><div><p className="eyebrow">Mapa central · elegí un portal</p><h1 className="map-heading"><CutoutTitle text="La escuela como universo" small max={11}/></h1></div><button className="subtle-button" onClick={() => setScene('cover')}><Icon name="home" size={16}/> Portada</button></header>
      <div className={`stage${targetPortal !== null ? ' diving' : ''}`} style={targetPortal !== null ? { ['--ox' as string]: `${gates[targetPortal].x}%`, ['--oy' as string]: `${gates[targetPortal].y}%` } : undefined}>
        <div className="school-halo" aria-hidden="true"/><div className="school-rays" aria-hidden="true"/>
        <svg className="filaments" viewBox="0 0 1600 900" aria-hidden="true">
          <defs><filter id="fil-glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter></defs>
          {gates.map((_, i) => <g key={i} className={`filament${hoverGate === i ? ' on' : ''}`} style={{ ['--h' as string]: [277, 185, 30, 334, 48, 145, 260, 206, 13][i] }}>
            <path d={filament(i)} className="fil-glow" filter="url(#fil-glow)"/><path d={filament(i)} className="fil-line"/><path d={filament(i)} className="fil-pulse" style={{ animationDelay: `${-i * 1.3}s` }}/>
          </g>)}
        </svg>
        <div className="school-core"><div className="school-shadow"/><img src="./assets/school/escuela-flotante.svg" alt="Una escuela secundaria pública argentina flotando sobre un fragmento de suelo, entre raíces y ladrillos"/></div>
        {portals.map((portal, index) => { const g = gates[index]; const hue = [277, 185, 30, 334, 48, 145, 260, 206, 13][index];
          return <button key={portal.id} className={`gate${targetPortal === index ? ' gate-approach' : ''}${hoverGate === index ? ' gate-hot' : ''}`}
            style={{ left: `${g.x}%`, top: `${g.y}%`, zIndex: Math.round(g.s * 10), ['--h' as string]: hue, ['--s' as string]: g.s, ['--ry' as string]: `${g.ry}deg`, ['--rz' as string]: `${g.rz}deg` }}
            onMouseEnter={() => setHoverGate(index)} onMouseLeave={() => setHoverGate(null)} onFocus={() => setHoverGate(index)} onBlur={() => setHoverGate(null)}
            onClick={() => openPortal(index)} aria-label={`Abrir portal ${portal.id}: ${portal.title}`}>
            <span className="gate-tilt"><GateArt id={`g${portal.id}`} seed={portal.id} hue={hue}/></span>
            <span className="gate-num">{String(portal.id).padStart(2, '0')}</span>
            <span className={`gate-label${g.y > 60 ? ' gate-label-up' : ''}`}><CutoutTitle text={portal.title} small max={9} seed={portal.id * 31}/></span>
          </button>; })}
      </div>
      <footer className="map-footer"><span>9 portales · un mapa abierto</span><span>← → recorrer · F pantalla completa · M mapa</span></footer>
    </section>}

    {scene === 'portal' && current && <section key={`portal-${current.id}`} className={`portal-scene scene-in${current.storyPortal ? ' story-scene' : ''}`} style={{ ['--h' as string]: [277, 185, 30, 334, 48, 145, 260, 206, 13][current.id - 1] }}>
      <div className="cinema-veil" aria-hidden="true"/>
      <header className="scene-header portal-top"><div><p className="eyebrow">PORTAL {String(current.id).padStart(2, '0')} / 09</p><h1 className="portal-heading"><CutoutTitle text={current.title} small/></h1></div><button className="subtle-button" onClick={() => setScene('map')}><Icon name="map" size={16}/> Volver a la escuela <kbd>Esc</kbd></button></header>
      {current.storyPortal ? <div className="story-constellation"><div className="story-orbit orbit-a"/><div className="story-orbit orbit-b"/><div className="story-hub"><img src="./assets/libro/tapa-collage.jpg" alt=""/><span>SEIS CUENTOS<br/>SEIS UNIVERSOS</span></div>
        {stories.map((story, index) => { const angle = (Math.PI * 2 * index) / stories.length - Math.PI / 2; const x = 50 + Math.cos(angle) * 36; const y = 50 + Math.sin(angle) * 36; return <button key={story.title} className={`story-world${storyIndex === index ? ' selected' : ''}`} style={{ left: `${x}%`, top: `${y}%`, '--world-hue': `${[39, 112, 190, 328, 24, 274][index]}deg` } as React.CSSProperties} onClick={() => setStoryIndex(index)}><span className="world-planet"><img src={story.image} alt=""/><span>{index + 1}</span></span><strong>{story.title}</strong></button>; })}
        {currentStory && <article className="story-detail"><button className="close-detail" onClick={() => setStoryIndex(null)} aria-label="Cerrar ficha"><Icon name="close" size={16}/></button><div className="story-detail-image"><img src={currentStory.image} alt={currentStory.imageAlt}/></div><div className="story-detail-copy"><p className="eyebrow">UNIVERSO {String((storyIndex ?? 0) + 1).padStart(2, '0')}</p><h2><CutoutTitle text={currentStory.title} small/></h2><p>{currentStory.description}</p></div></article>}
      </div> : <div className={`portal-body portal-body-${current.id}`}><SceneArt id={current.id} /><article className="portal-copy"><p className="portal-kicker">{current.short}</p><p className="portal-description">{current.description}</p><div className="editable-book"><img className="book-cover" src="./assets/libro/tapa-collage.jpg" alt="Tapa del libro: collage de objetos escolares unidos por hilos"/><div><span>En diálogo con</span><em>{presentation.book}</em></div></div></article></div>}
      <nav className="portal-nav"><button onClick={() => { setPortalIndex(i => (i + portals.length - 1) % portals.length); setStoryIndex(null); }}><Icon name="left"/> Anterior</button><span>{String(current.id).padStart(2, '0')} <i/> {String(portals.length).padStart(2, '0')}</span><button onClick={() => { setPortalIndex(i => (i + 1) % portals.length); setStoryIndex(null); }}>Siguiente <Icon name="right"/></button></nav>
    </section>}

    <aside className={`presenter-panel${presenter ? ' presenter-visible' : ''}`} aria-hidden={!presenter}><div className="presenter-head"><span>MODO PRESENTADOR</span><button onClick={() => setPresenter(false)} aria-label="Cerrar modo presentador"><Icon name="close"/></button></div><p>{scene === 'cover' ? 'Portada' : `Sección ${current?.id ?? '—'} · ${current?.title ?? 'Mapa central'}`}</p><div className="progress-track"><i style={{ width: `${progress}%` }}/></div><div className="presenter-meta"><span>{progress}% del recorrido</span><span>{clock}</span></div><label htmlFor="oral-notes">Notas orales · guardado local</label><textarea id="oral-notes" value={scene === 'portal' && current ? notes[current.id] ?? current.notes : ''} onChange={event => current && setNotes(value => ({ ...value, [current.id]: event.target.value }))} placeholder="Escribí notas para esta sección…"/></aside>
    <div className="utility-controls"><button title="Movimiento reducido" aria-pressed={reducedMotion} onClick={() => setReducedMotion(value => !value)}><span className="motion-icon">{reducedMotion ? 'I' : '≈'}</span><span>Movimiento {reducedMotion ? 'reducido' : 'activo'}</span></button><button title="Modo presentador" onClick={() => setPresenter(value => !value)}><Icon name="book"/><span>Notas</span></button><button title="Pantalla completa (F)" onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()}><Icon name="expand"/><span>Pantalla</span></button></div>
    {transitioning && <div className="warp-transition" aria-hidden="true"><div className="warp-tunnel"/><span>ENTRANDO AL MULTIVERSO</span></div>}
    {notesOpen && <div className="notes-backdrop" onClick={() => setNotesOpen(false)}><div className="notes-modal" onClick={event => event.stopPropagation()}><button className="close-detail" onClick={() => setNotesOpen(false)}><Icon name="close" size={18}/></button><h2>Modo presentador</h2><p>Las notas son editables y se guardan en este navegador.</p><button onClick={() => { setPresenter(true); setNotesOpen(false); }}>Abrir panel de notas</button></div></div>}
  </main>;
}
