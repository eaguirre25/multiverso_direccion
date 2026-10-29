import { useState } from 'react';
import { refs, type Portal, type RefKey } from '../data/presentation';

/* Referencia académica: cita autor-año que, al activarse (clic, Enter o
   Espacio), despliega la entrada APA completa sin salir de la escena. */
export function AcademicReference({ k, concept, open, onToggle, popover, up }: { k: RefKey; concept?: string; open: boolean; onToggle: () => void; popover?: boolean; up?: boolean }) {
  const r = refs[k];
  return <span className={`aref${open ? ' aref-open' : ''}${popover ? ' aref-popover' : ''}`}>
    <button type="button" className="aref-btn" aria-expanded={open} onClick={onToggle}>
      {concept && <span className="aref-concept">{concept}</span>}
      <span className="aref-cite">{r.cite}</span>
    </button>
    {open && <span role="note" className={`aref-full${up ? ' aref-up' : ''}`}>{r.full}</span>}
  </span>;
}

/* Texto explicativo de un universo: las nociones y las citas viven dentro del
   argumento. Si el texto es largo se divide en capas navegables. */
export function PortalCopy({ portal }: { portal: Portal }) {
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const pages = portal.pages; const segs = pages[page];
  const go = (n: number) => { setPage(n); setOpen(null); };
  const openSeg = open === null ? null : segs[open];
  return <>
    <p className="portal-description" key={page}>
      {segs.map((s, i) => {
        if (s.t === 'text') return <span key={i}>{s.v}</span>;
        if (s.t === 'em') return <em key={i} className="kw">{s.v}</em>;
        const label = s.label ?? refs[s.refs[0]].cite;
        return <button key={i} type="button" className={`cite${open === i ? ' cite-open' : ''}`} aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>{label}</button>;
      })}
    </p>
    {openSeg && openSeg.t === 'cite' && <div className="cite-full" role="note">{openSeg.refs.map(k => <p key={k}>{refs[k].full}</p>)}</div>}
    {pages.length > 1 && <div className="pager" role="group" aria-label="Capas del texto">
      <button type="button" onClick={() => go(page - 1)} disabled={page === 0} aria-label="Capa anterior">‹</button>
      {pages.map((_, i) => <button key={i} type="button" className={`dot${i === page ? ' dot-on' : ''}`} onClick={() => go(i)} aria-label={`Capa ${i + 1} de ${pages.length}`} aria-current={i === page} />)}
      <button type="button" onClick={() => go(page + 1)} disabled={page === pages.length - 1} aria-label="Capa siguiente">›</button>
    </div>}
  </>;
}
