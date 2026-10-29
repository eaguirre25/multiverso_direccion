import { useEffect, useMemo, useRef } from 'react';
import { CutoutSvg, layoutCutout, type WordSpec } from './Cutout';
import { presentation, stories } from '../data/presentation';

/* Pantalla final: no es un décimo portal académico.
   «MUCHAS GRACIAS» en recortes, las seis ilustraciones en órbita elíptica y el QR. */

const THANKS: WordSpec[][] = [[{ text: 'MUCHAS', size: 1.15 }], [{ text: 'GRACIAS', size: 1.3 }]];
const NAMES: WordSpec[][] = [[
  { text: 'Marcela', mode: 'word', size: 0.8 }, { text: 'Victoria', mode: 'word', size: 0.8 }, { text: 'Gil', mode: 'word', size: 0.8 }, { text: '·', mode: 'word', size: 0.8 },
  { text: 'Elías', mode: 'word', size: 0.8 }, { text: 'Gonzalo', mode: 'word', size: 0.8 }, { text: 'Aguirre', mode: 'word', size: 0.8 },
]];

export default function ThankYou({ leaving, entering, onPrev, onCover }: { leaving: boolean; entering: boolean; onPrev: () => void; onCover: () => void }) {
  const thanks = useMemo(() => layoutCutout(THANKS, { seed: 8088, baseSize: 100 }), []);
  const names = useMemo(() => layoutCutout(NAMES, { seed: 313, baseSize: 100 }), []);
  const stage = useRef<HTMLDivElement>(null);
  const pics = useRef<(HTMLImageElement | null)[]>([]);

  // Órbita elíptica adaptable a 16:9: seis posiciones equidistantes en el mismo ángulo,
  // por lo que nunca se superponen; las imágenes no rotan y conservan su proporción.
  useEffect(() => {
    const el = stage.current; if (!el) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0; const t0 = performance.now();
    const place = (now: number) => {
      const w = el.clientWidth, h = el.clientHeight; const t = still ? 0 : (now - t0) / 1000;
      const cx = w * 0.44, cy = h * 0.47, rx = w * 0.36, ry = h * 0.34;
      pics.current.forEach((im, i) => {
        if (!im) return; const a = -Math.PI / 2 + t * 0.11 + (i * Math.PI) / 3;
        im.style.transform = `translate(${(cx + Math.cos(a) * rx).toFixed(1)}px,${(cy + Math.sin(a) * ry).toFixed(1)}px) translate(-50%,-50%)`;
      });
      if (!still) raf = requestAnimationFrame(place);
    };
    raf = requestAnimationFrame(place);
    const ro = new ResizeObserver(() => place(performance.now())); ro.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <section className={`thanks scene-in${entering ? ' entering' : ''}${leaving ? ' leaving' : ''}`} aria-label="Cierre: muchas gracias">
    <div className="cinema-veil" aria-hidden="true" />
    <div className="thanks-stage" ref={stage}>
      {stories.map((s, i) => <img key={s.title} ref={el => { pics.current[i] = el; }} className="thanks-pic" src={s.image} alt={s.imageAlt} />)}
      <div className="thanks-text">
        <h1 className="thanks-title"><CutoutSvg layout={thanks} label="Muchas gracias" className="cutout-main" /></h1>
        <p className="thanks-names"><CutoutSvg layout={names} label={presentation.authors.join(' · ')} className="cutout-main" /></p>
      </div>
      <div className="thanks-qr"><img src="./assets/qr/qr-cierre.png" alt="Código QR" onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }} /></div>
    </div>
    <nav className="thanks-nav"><button type="button" onClick={onPrev}>← Anterior</button><button type="button" onClick={onCover}>Portada</button></nav>
  </section>;
}
