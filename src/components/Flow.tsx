import { createContext, useContext, useEffect, useState } from 'react';

/** El interruptor «Movimiento reducido» de la interfaz se comparte por contexto. */
export const MotionCtx = createContext(false);

/* Sistema reutilizable de conexiones dinámicas (SVG + SMIL).
   Coordenadas en un lienzo de 1000 × 700 que coincide con la caja .scene-art
   (proporción 10:7), de modo que los porcentajes de los recortes y las curvas
   comparten el mismo espacio.
   Cada trazo admite: curva, ondulación orgánica, partículas, flujo en uno o
   ambos sentidos, ritmo propio y activación selectiva por etiqueta. */

export type FlowPath = {
  id: string;
  d: string;
  d2?: string;               // forma alternativa: el trazo respira entre d y d2
  tags?: string[];           // etiquetas para activación selectiva
  n?: number;                // cantidad de partículas
  dur?: number;              // segundos por recorrido
  dir?: 1 | -1 | 0;          // 1 ida, -1 vuelta, 0 ambos sentidos
  shape?: 'dot' | 'paper';
  hue?: number;
  dash?: boolean;
  width?: number;
  delay?: number;            // aparición progresiva (segundos)
};

export const pt = (x: number, y: number): [number, number] => [x * 10, y * 7];
const f = (n: number) => Math.round(n * 10) / 10;

/** Curva cuadrática entre dos puntos (en %), con curvatura y ondulación. */
export function curve(a: [number, number], b: [number, number], bend = 60, wob = 0) {
  const A = pt(...a), B = pt(...b);
  const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2; const dx = B[0] - A[0], dy = B[1] - A[1]; const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  const q = (k: number) => `M${f(A[0])} ${f(A[1])} Q${f(mx + nx * k)} ${f(my + ny * k)} ${f(B[0])} ${f(B[1])}`;
  return { d: q(bend), d2: wob ? q(bend - wob * 2) : undefined };
}

export function useReducedMotion() {
  const manual = useContext(MotionCtx);
  const [r, setR] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { const m = window.matchMedia('(prefers-reduced-motion: reduce)'); const h = () => setR(m.matches); m.addEventListener('change', h); return () => m.removeEventListener('change', h); }, []);
  return r || manual;
}

export function Flow({ paths, active, reduced }: { paths: FlowPath[]; active?: string | null; reduced?: boolean }) {
  const rm = useReducedMotion(); const still = reduced ?? rm;
  return <svg className="art-lines" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    {paths.map((p, pi) => {
      const hot = !!active && !!p.tags?.includes(active); const dim = !!active && !hot;
      const n = p.n ?? 3; const dur = p.dur ?? 7; const dir = p.dir ?? 1;
      const style = { ['--h' as string]: p.hue ?? 190, ['--w' as string]: p.width ?? 1, animationDelay: `${p.delay ?? 0}s` } as React.CSSProperties;
      return <g key={p.id} className={`flow${hot ? ' flow-on' : ''}${dim ? ' flow-dim' : ''}${p.dash ? ' flow-dash' : ''}`} style={style}>
        <path className="flow-glow" d={p.d}>{p.d2 && !still && <animate attributeName="d" dur={`${dur * 2.2}s`} repeatCount="indefinite" values={`${p.d};${p.d2};${p.d}`} />}</path>
        <path className="flow-line" d={p.d}>{p.d2 && !still && <animate attributeName="d" dur={`${dur * 2.2}s`} repeatCount="indefinite" values={`${p.d};${p.d2};${p.d}`} />}</path>
        {!still && Array.from({ length: n }, (_, i) => {
          const back = dir === -1 || (dir === 0 && i % 2 === 1);
          const common = { dur: `${dur + (i % 3) * 0.7}s`, repeatCount: 'indefinite', begin: `${-(i * dur) / n - pi * 0.37}s`, path: p.d, ...(back ? { keyPoints: '1;0', keyTimes: '0;1', calcMode: 'linear' } : {}) };
          return p.shape === 'paper'
            ? <rect key={i} className="flow-bit" x="-5" y="-3.5" width="10" height="7" rx="1.2"><animateMotion {...common} rotate="auto" /></rect>
            : <circle key={i} className="flow-dot" r={i % 3 === 0 ? 4.2 : 2.8}><animateMotion {...common} /></circle>;
        })}
      </g>;
    })}
  </svg>;
}
