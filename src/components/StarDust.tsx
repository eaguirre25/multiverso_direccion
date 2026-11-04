import { useEffect, useRef } from 'react';

/* Transición de la portada al multiverso: una lluvia de polvo de estrellas
   que cae sobre la pantalla, se espesa y se disuelve mientras aparece el mapa. */
const DURATION = 1300;

export default function StarDust() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return; const ctx = cv.getContext('2d'); if (!ctx) return;
    const W = (cv.width = window.innerWidth), H = (cv.height = window.innerHeight);
    const hues = [46, 38, 52, 190, 270, 330];
    const N = Math.round(Math.min(520, (W * H) / 3600));
    const dust = Array.from({ length: N }, () => {
      const z = Math.random();
      return { x: Math.random() * W, y: -Math.random() * H * 0.5, vy: 420 + z * 1300, sway: 10 + Math.random() * 40, ph: Math.random() * 6.28, r: 0.7 + z * 2.4, len: 16 + z * 120, h: hues[Math.floor(Math.random() * hues.length)], start: Math.random() * 0.95 * (DURATION / 1000), tw: 4 + Math.random() * 10 };
    });
    const t0 = performance.now(); let raf = 0; let last = t0;
    const tick = (now: number) => {
      const t = (now - t0) / 1000; const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const fade = t < 0.18 ? t / 0.18 : t > 0.9 ? Math.max(0, 1 - (t - 0.9) / 0.4) : 1;
      ctx.clearRect(0, 0, W, H);
      // velo oscuro que se espesa y se disuelve: el polvo se ve sobre el cambio de escena
      ctx.fillStyle = `rgba(5,6,16,${0.55 * Math.sin(Math.min(1, t / 1.3) * Math.PI)})`; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (const d of dust) {
        if (t < d.start) continue;
        d.y += d.vy * dt; const x = d.x + Math.sin(t * 1.6 + d.ph) * d.sway;
        if (d.y - d.len > H) { d.y = -20; d.x = Math.random() * W; }
        const tw = 0.55 + 0.45 * Math.sin(t * d.tw + d.ph);
        ctx.strokeStyle = `hsla(${d.h},100%,82%,${0.5 * fade * tw})`; ctx.lineWidth = d.r; ctx.beginPath(); ctx.moveTo(x, d.y); ctx.lineTo(x, d.y - d.len); ctx.stroke();
        ctx.fillStyle = `hsla(${d.h},100%,92%,${fade * tw})`; ctx.beginPath(); ctx.arc(x, d.y, d.r * 1.15, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      if (t * 1000 < DURATION + 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} className="stardust" aria-hidden="true" />;
}
