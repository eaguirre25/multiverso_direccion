import { useState } from 'react';
import { refs, type Ground, type RefKey } from '../data/presentation';

/* Referencia académica: muestra el concepto con su cita autor-año y,
   al activarse (clic, Enter o Espacio), despliega la entrada APA completa
   sin salir de la escena. */
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

/* Lista de fundamentación de un universo: una ficha abierta a la vez. */
export function ReferenceList({ items }: { items: Ground[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!items.length) return null;
  return <div className="aref-list" aria-label="Fundamentación bibliográfica">
    <p className="aref-title">Fundamentación</p>
    {items.map((g, i) => <AcademicReference key={`${g.ref}-${i}`} k={g.ref} concept={g.concept} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />)}
  </div>;
}
