// Genera public/assets/school/escuela-flotante.svg
// Escuela secundaria pública bonaerense suspendida sobre un fragmento de suelo.
// Uso: node scripts/generate-school.mjs
// El SVG resultante es un recurso reemplazable: puede sustituirse por una
// ilustración o fotomontaje propio conservando la ruta y la proporción 1400 x 1260.
import { writeFileSync, mkdirSync } from 'node:fs';

let seed = 4242;
const R = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rr = (a, b) => a + (R() - 0.5 + 0.5) * (b - a);
const f = n => Math.round(n * 10) / 10;
const P = pts => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join('L') + 'Z';
const jag = (pts, seg, amp) => { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; const n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / seg)); for (let k = 0; k < n; k++) { const t = k / n; out.push([a[0] + (b[0] - a[0]) * t + (R() - 0.5) * amp, a[1] + (b[1] - a[1]) * t + (R() - 0.5) * amp]); } } return out; };
const o = [];
const add = s => o.push(s);

/* ----- geometría de la isla ----- */
const lip = [[150, 724], [260, 748], [400, 770], [560, 786], [700, 792], [850, 786], [1000, 770], [1140, 748], [1250, 722]]; // borde frontal del suelo
const side = [[150, 724], [176, 800], [214, 862], [270, 918], [330, 966], [395, 1002], [450, 1040], [520, 1068], [600, 1092], [670, 1130], [716, 1142], [748, 1108], [800, 1080], [870, 1052], [940, 1010], [1010, 966], [1080, 918], [1140, 860], [1200, 800], [1232, 760], [1250, 722], ...lip.slice().reverse().slice(1, -1)];
const sideJ = jag(side, 22, 14);
const top = [[150, 724], [190, 700], [320, 690], [700, 684], [1090, 690], [1210, 700], [1250, 722], ...lip.slice().reverse().slice(1, -1)];
const topJ = jag(top, 30, 6);

add(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 1260" width="1400" height="1260">`);
add(`<defs>
<linearGradient id="lg-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9c9a3"/><stop offset=".55" stop-color="#c7b48d"/><stop offset="1" stop-color="#9a8a72"/></linearGradient>
<linearGradient id="lg-wall2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e2d3ac"/><stop offset="1" stop-color="#b4a07d"/></linearGradient>
<linearGradient id="lg-night" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3fd0d6" stop-opacity=".55"/><stop offset=".3" stop-color="#6b4fc4" stop-opacity=".16"/><stop offset="1" stop-color="#e5a24a" stop-opacity=".22"/></linearGradient>
<linearGradient id="lg-shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2060" stop-opacity=".0"/><stop offset="1" stop-color="#1a1238" stop-opacity=".55"/></linearGradient>
<linearGradient id="lg-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd890"/><stop offset=".6" stop-color="#f0a850"/><stop offset="1" stop-color="#b9672e"/></linearGradient>
<linearGradient id="lg-glass-off" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4c6a86"/><stop offset=".5" stop-color="#25324a"/><stop offset="1" stop-color="#151a2c"/></linearGradient>
<linearGradient id="lg-island-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".6" stop-color="#0b0716" stop-opacity=".35"/><stop offset="1" stop-color="#0b0716" stop-opacity=".82"/></linearGradient>
<linearGradient id="lg-island-rim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#48d4d8" stop-opacity=".5"/><stop offset=".25" stop-color="#48d4d8" stop-opacity="0"/><stop offset=".8" stop-color="#e6a550" stop-opacity="0"/><stop offset="1" stop-color="#e6a550" stop-opacity=".32"/></linearGradient>
<radialGradient id="rg-lit" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf80" stop-opacity=".95"/><stop offset=".4" stop-color="#ffb060" stop-opacity=".35"/><stop offset="1" stop-color="#ff9040" stop-opacity="0"/></radialGradient>
<radialGradient id="rg-shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#0a0614" stop-opacity=".7"/><stop offset="1" stop-color="#0a0614" stop-opacity="0"/></radialGradient>
<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="16" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="rough-s" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="8" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="grunge" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".022 .05" numOctaves="4" seed="21" result="t"/><feColorMatrix in="t" type="matrix" values=".5 0 0 0 .38  .5 0 0 0 .36  .5 0 0 0 .34  0 0 0 0 1" result="g"/><feBlend in="SourceGraphic" in2="g" mode="multiply" result="m"/><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="3" result="fine"/><feColorMatrix in="fine" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 -.18" result="speck"/><feComposite in="speck" in2="m" operator="in" result="sp"/><feMerge><feMergeNode in="m"/><feMergeNode in="sp"/></feMerge><feComposite in2="SourceGraphic" operator="in"/></filter>
<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="soft-s" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="paperfx" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="3" seed="6" result="n"/><feDiffuseLighting in="n" lighting-color="#fff" surfaceScale="1.2"><feDistantLight azimuth="230" elevation="60"/></feDiffuseLighting><feComposite in2="SourceGraphic" operator="in" result="l"/><feBlend in="SourceGraphic" in2="l" mode="multiply"/></filter>
<clipPath id="cp-side"><path d="${P(sideJ)}"/></clipPath>
<clipPath id="cp-top"><path d="${P(topJ)}"/></clipPath>
<pattern id="tiles" width="46" height="23" patternUnits="userSpaceOnUse"><rect width="46" height="23" fill="#9a9488"/><path d="M0 0H46M0 0V23" stroke="#5e594f" stroke-width="2"/><rect x="2" y="2" width="42" height="19" fill="#aba596" opacity=".55"/></pattern>
<pattern id="bricks" width="34" height="16" patternUnits="userSpaceOnUse"><rect width="34" height="16" fill="#8f4a38"/><path d="M0 0H34M0 8H34M0 0V8M17 8V16" stroke="#cfc3ae" stroke-width="1.6" opacity=".7"/><rect x="2" y="2" width="14" height="5" fill="#a8604a" opacity=".5"/></pattern>
</defs>`);

/* ----- fragmentos lejanos (detrás) ----- */
function rock(cx, cy, w, h, rot, extra = '') {
  const pts = jag([[-w / 2, -h * 0.2], [-w * 0.25, -h / 2], [w * 0.3, -h * 0.45], [w / 2, -h * 0.1], [w * 0.2, h / 2], [-w * 0.1, h * 0.38], [-w * 0.4, h * 0.3]], 14, 9);
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})" ${extra}><path d="${P(pts)}" fill="#4b3a30"/><path d="${P(pts.map(([x, y]) => [x * 0.96, y * 0.55 + 6]))}" fill="#6d5441" opacity=".7"/><path d="${P(pts.map(([x, y]) => [x * 0.9, y * 0.2 - h * 0.28]))}" fill="#2d3a2c" opacity=".9"/><path d="${P(pts)}" fill="url(#lg-island-dark)" opacity=".8"/></g>`;
}
add(`<g filter="url(#rough-s)">${rock(110, 560, 70, 44, -18)}${rock(1305, 560, 84, 50, 14)}${rock(1190, 1010, 58, 36, 24)}${rock(330, 1080, 46, 30, -30)}</g>`);

/* ----- cielo cercano a la isla: cables que salen hacia los portales ----- */
add(`<g fill="none" stroke="#0d0a16" stroke-linecap="round">
<path d="M352 372 C 250 330 150 350 20 250" stroke-width="2.4"/><path d="M360 372 C 260 360 130 400 0 330" stroke-width="1.8"/>
<path d="M1006 372 C 1120 336 1250 330 1400 240" stroke-width="2.4"/><path d="M1000 372 C 1150 380 1260 420 1400 360" stroke-width="1.8"/></g>`);

/* ----- cara lateral de la isla: estratos ----- */
add(`<g filter="url(#rough)"><g clip-path="url(#cp-side)">`);
const bands = [['#2d211b', 770], ['#4b3427', 810], ['#7b4e32', 860], ['#a77849', 915], ['#7a6a58', 975], ['#4e4a52', 1030], ['#33303d', 1090], ['#221f2c', 1180]];
bands.forEach(([col, y], bi) => {
  const pts = []; for (let x = 100; x <= 1300; x += 40) pts.push([x, y + Math.sin(x / 85 + bi * 2) * 11 + (R() - 0.5) * 12]);
  add(`<path d="M100 1200L${pts.map(([x, yy]) => `${f(x)} ${f(yy)}`).join('L')}L1300 1200Z" fill="${col}"/>`);
});
// guijarros y escombros
for (let i = 0; i < 160; i++) {
  const x = 150 + R() * 1100, y = 740 + R() * 380, rx = 3 + R() * 11, ry = rx * (0.5 + R() * 0.5);
  const c = ['#8d7a66', '#5d5149', '#b39b78', '#3b3239', '#a6866a'][Math.floor(R() * 5)];
  add(`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${c}" opacity=".75" transform="rotate(${f(R() * 180)} ${f(x)} ${f(y)})"/>`);
}
// ladrillos y baldosas incrustados en la tierra
for (let i = 0; i < 22; i++) {
  const x = 230 + R() * 940, y = 780 + R() * 280, w = 28 + R() * 26, h = 14 + R() * 8, rot = R() * 360;
  const brick = R() < 0.7;
  add(`<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><rect x="${-w / 2}" y="${-h / 2}" width="${f(w)}" height="${f(h)}" rx="2" fill="${brick ? '#9a4c36' : '#b9b2a2'}"/><rect x="${-w / 2 + 2}" y="${-h / 2 + 2}" width="${f(w - 6)}" height="${f(h / 3)}" fill="#fff" opacity=".12"/><rect x="${-w / 2}" y="${-h / 2}" width="${f(w)}" height="${f(h)}" rx="2" fill="none" stroke="#1a100c" stroke-opacity=".5"/></g>`);
}
// tubería y cable seccionados
add(`<g transform="translate(560 892) rotate(-8)"><rect x="-90" y="-9" width="180" height="18" rx="9" fill="#c9c2b3"/><rect x="-90" y="-9" width="180" height="6" rx="3" fill="#fff" opacity=".35"/><ellipse cx="90" cy="0" rx="6" ry="9" fill="#2a2430"/></g>`);
add(`<path d="M840 842 C 880 860 900 900 960 905" stroke="#d9a548" stroke-width="5" fill="none"/><path d="M840 842 C 880 860 900 900 960 905" stroke="#1a1218" stroke-width="1.5" fill="none" stroke-dasharray="6 5"/>`);
// grietas
for (let c = 0; c < 9; c++) {
  let x = 200 + R() * 1000, y = 790 + R() * 120; let d = `M${f(x)} ${f(y)}`;
  for (let k = 0; k < 6; k++) { x += (R() - 0.5) * 50; y += 18 + R() * 28; d += `L${f(x)} ${f(y)}`; }
  add(`<path d="${d}" fill="none" stroke="#0e0912" stroke-width="${f(2 + R() * 2.5)}" stroke-linejoin="bevel" opacity=".85"/><path d="${d}" fill="none" stroke="#e8cfa0" stroke-width="1" opacity=".18" transform="translate(2 1)"/>`);
}
// sombreado y luces de borde
add(`<rect x="100" y="700" width="1200" height="480" fill="url(#lg-island-dark)"/><rect x="100" y="700" width="1200" height="480" fill="url(#lg-island-rim)"/>`);
add(`</g></g>`);
// contorno luminoso muy tenue
add(`<path d="${P(sideJ)}" fill="none" stroke="#7fe4ea" stroke-opacity=".28" stroke-width="2" filter="url(#rough)"/>`);

/* ----- raíces expuestas ----- */
function rootPath(x, y, ang, len, w, depth) {
  let d = `M${f(x)} ${f(y)}`; let cx = x, cy = y; let a = ang; const steps = 7;
  const pts = [[x, y]];
  for (let i = 0; i < steps; i++) { a += (R() - 0.5) * 0.9 + (depth === 0 ? 0.05 : 0); cx += Math.cos(a) * len / steps; cy += Math.sin(a) * len / steps + (depth === 0 ? 3 : 1.5); pts.push([cx, cy]); d += `L${f(cx)} ${f(cy)}`; }
  const out = [{ d, w, pts }];
  if (depth < 2) for (let i = 2; i < steps; i += 2) if (R() < 0.7) out.push(...rootPath(pts[i][0], pts[i][1], a + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.7), len * (0.4 + R() * 0.25), w * 0.55, depth + 1));
  return out;
}
const roots = [];
const anchors = [[200, 800], [250, 850], [330, 950], [430, 1012], [520, 1060], [610, 1090], [780, 1090], [880, 1040], [980, 990], [1070, 925], [1150, 840], [1215, 770], [560, 1070], [900, 1030]];
anchors.forEach(([x, y], i) => roots.push(...rootPath(x, y, Math.PI / 2 + (x < 700 ? -0.5 : 0.5) * (0.3 + R() * 0.8), Math.min(110 + R() * 150, y > 1000 ? 45 + R() * 40 : y > 940 ? 90 + R() * 50 : 999), 5 + R() * 3, 0)));
add(`<g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#rough-s)">`);
roots.forEach(r => add(`<path d="${r.d}" stroke="#1d130d" stroke-width="${f(r.w + 3)}" transform="translate(1.5 2.5)"/>`));
roots.forEach(r => add(`<path d="${r.d}" stroke="#8a6a46" stroke-width="${f(r.w)}"/>`));
roots.forEach(r => add(`<path d="${r.d}" stroke="#d8b987" stroke-width="${f(Math.max(1, r.w * 0.28))}" stroke-opacity=".7" transform="translate(-.8 -1)"/>`));
add(`</g>`);
// raíces que cruzan el corte de tierra
add(`<g fill="none" stroke-linecap="round"><path d="M180 790 C 300 800 360 840 440 836 S 560 880 640 868" stroke="#7a5b3a" stroke-width="5"/><path d="M1220 780 C 1100 800 1040 840 960 834" stroke="#7a5b3a" stroke-width="5"/><path d="M600 880 C 700 920 760 900 840 940" stroke="#6d4f33" stroke-width="3.5"/></g>`);

/* ----- plano superior (patio) ----- */
add(`<g filter="url(#rough-s)"><g clip-path="url(#cp-top)">`);
add(`<rect x="100" y="660" width="1200" height="160" fill="#4a3a2c"/>`);
// patio de baldosas en perspectiva
add(`<path d="M310 705 L1090 705 L1180 770 L220 770Z" fill="#7d786d"/><path d="M310 705 L1090 705 L1180 770 L220 770Z" fill="url(#tiles)" opacity=".8" transform="translate(0 0)"/>`);
// pasto y tierra a los lados
for (let i = 0; i < 90; i++) {
  const side = R() < 0.5; const x = side ? 150 + R() * 200 : 1050 + R() * 200; const y = 700 + R() * 60;
  add(`<path d="M${f(x)} ${f(y)} q ${f(R() * 6 - 3)} ${f(-8 - R() * 12)} ${f(R() * 8 - 4)} ${f(-14 - R() * 10)}" stroke="${['#4f6a3c', '#6b8a47', '#3c4f33', '#8a7c3e'][Math.floor(R() * 4)]}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`);
}
add(`</g></g>`);
// cordón/vereda rota en el borde frontal
add(`<path d="${P(jag([[170, 736], [400, 782], [700, 806], [1000, 782], [1230, 736], [1232, 746], [1000, 794], [700, 818], [400, 794], [168, 748]], 24, 4))}" fill="#a39d90"/><path d="${P(jag([[170, 736], [400, 782], [700, 806], [1000, 782], [1230, 736], [1232, 742], [1000, 788], [700, 812], [400, 788], [168, 742]], 24, 3))}" fill="#c9c3b3"/>`);

/* ----- sombra del edificio sobre el patio ----- */
add(`<ellipse cx="700" cy="722" rx="470" ry="34" fill="url(#rg-shadow)"/>`);

/* ----- EDIFICIO ----- */
add(`<g filter="url(#grunge)">`);
// ala izquierda + cuerpo principal
add(`<rect x="320" y="390" width="700" height="318" fill="url(#lg-wall)"/>`);
add(`<rect x="320" y="640" width="700" height="68" fill="url(#bricks)"/>`);          // zócalo de ladrillo visto
add(`<rect x="320" y="636" width="700" height="8" fill="#6c6252"/>`);                  // cenefa
add(`<rect x="320" y="530" width="700" height="10" fill="#7e7360"/>`);                 // cornisa de entrepiso
// ala derecha baja con techo de chapa
add(`<rect x="1020" y="548" width="150" height="160" fill="url(#lg-wall2)"/><rect x="1020" y="650" width="150" height="58" fill="url(#bricks)"/>`);
add(`<path d="M1010 548 L1100 508 L1180 548Z" fill="#6c7276"/><path d="M1010 548 L1100 508 L1180 548Z" fill="none" stroke="#2a2d33" stroke-width="3"/>`);
for (let i = 0; i < 9; i++) add(`<path d="M${1030 + i * 15} 540 L ${1098 + (i - 4) * 6} 514" stroke="#4a4f55" stroke-width="2"/>`);
// bloque central de acceso (más alto)
add(`<rect x="580" y="320" width="180" height="388" fill="url(#lg-wall2)"/><rect x="580" y="650" width="180" height="58" fill="url(#bricks)"/>`);
add(`<rect x="570" y="304" width="200" height="20" fill="#7e7360"/><rect x="574" y="324" width="192" height="6" fill="#4d443a"/>`);
// parapeto
add(`<rect x="312" y="372" width="716" height="20" fill="#8a7e68"/><rect x="312" y="372" width="716" height="5" fill="#d8caa6"/>`);
// manchas de humedad
for (let i = 0; i < 16; i++) { const x = 330 + R() * 680; const h = 30 + R() * 90; add(`<path d="M${f(x)} ${f(708 - h)} q 6 ${f(h / 2)} 0 ${f(h)} q -8 -${f(h / 2)} 0 -${f(h)}Z" fill="#40362e" opacity=".22"/>`); }
for (let i = 0; i < 9; i++) { const x = 340 + R() * 660; add(`<rect x="${f(x)}" y="${f(540 + R() * 80)}" width="${f(3 + R() * 5)}" height="${f(40 + R() * 70)}" fill="#2c231f" opacity=".16"/>`); }
// pintura descascarada
for (let i = 0; i < 10; i++) { const x = 340 + R() * 640, y = 400 + R() * 230; add(`<path d="${P(jag([[x, y], [x + 20 + R() * 18, y + 3], [x + 24 + R() * 14, y + 16 + R() * 10], [x + 4, y + 20 + R() * 8]], 7, 6))}" fill="#8f4a38" opacity=".85"/>`); }
add(`</g>`);

// ventanas con rejas
const lit = new Set([1, 4, 6, 8, 11, 12]);
let wi = 0;
function win(x, y, w, h, on) {
  add(`<g><rect x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" fill="#6f6553"/><rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" fill="#2b2430"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${on ? 'url(#lg-glass)' : 'url(#lg-glass-off)'}"/>`);
  if (on) add(`<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w * 1.2}" ry="${h * 1.1}" fill="url(#rg-lit)" opacity=".7" filter="url(#soft-s)"/>`);
  add(`<path d="M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}" stroke="#2b2430" stroke-width="3"/>`);
  // reja
  for (let k = 1; k < 5; k++) add(`<path d="M${x + (w * k) / 5} ${y - 2}V${y + h + 2}" stroke="#14121a" stroke-width="2.2"/>`);
  add(`<path d="M${x - 3} ${y + h * 0.33}H${x + w + 3}M${x - 3} ${y + h * 0.66}H${x + w + 3}" stroke="#14121a" stroke-width="2"/>`);
  add(`<rect x="${x - 8}" y="${y + h + 5}" width="${w + 16}" height="6" fill="#9b8f78"/><rect x="${x - 8}" y="${y + h + 11}" width="${w + 16}" height="3" fill="#2a2330" opacity=".5"/></g>`);
}
[352, 432, 512].forEach(x => { win(x, 424, 50, 62, lit.has(wi++)); win(x, 566, 50, 62, lit.has(wi++)); });
[792, 872, 952].forEach(x => { win(x, 424, 50, 62, lit.has(wi++)); win(x, 566, 50, 62, lit.has(wi++)); });
// ventanas del ala baja
[1042, 1100].forEach(x => win(x, 572, 44, 56, lit.has(wi++)));

// cuerpo central: ventanal alto, placa y puerta
add(`<rect x="620" y="352" width="100" height="120" fill="#6f6553"/><rect x="624" y="356" width="92" height="112" fill="#2b2430"/><path d="M624 468V386a46 46 0 0 1 92 0V468Z" fill="url(#lg-glass)"/><path d="M624 468V386a46 46 0 0 1 92 0V468Z" fill="none" stroke="#2b2430" stroke-width="3"/><path d="M670 340V468M624 410H716M624 440H716" stroke="#2b2430" stroke-width="3"/>`);
add(`<ellipse cx="670" cy="410" rx="120" ry="90" fill="url(#rg-lit)" opacity=".5" filter="url(#soft)"/>`);
for (let k = 1; k < 9; k++) add(`<path d="M${624 + k * 10.2} 356V468" stroke="#14121a" stroke-width="1.8"/>`);
// placa del nombre
add(`<rect x="610" y="496" width="120" height="44" fill="#1c3b63" rx="2"/><rect x="610" y="496" width="120" height="44" fill="none" stroke="#e8e0cc" stroke-width="2.5" rx="2"/><text x="670" y="514" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="13" fill="#f2ead2" letter-spacing="1">ESCUELA</text><text x="670" y="532" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="13" fill="#f2ead2" letter-spacing="1">SECUNDARIA</text>`);
// puerta doble de acceso con luz interior
add(`<rect x="622" y="570" width="96" height="140" fill="#2b2430"/><path d="M628 574h40v130h-40zM672 574h40v130h-40z" fill="url(#lg-glass)"/><path d="M648 574V704M692 574V704M628 604H712" stroke="#2b2430" stroke-width="3"/><ellipse cx="670" cy="705" rx="90" ry="26" fill="url(#rg-lit)" opacity=".8" filter="url(#soft-s)"/>`);
// escalones y rampa
add(`<path d="M610 708h120v8H610zM602 716h136v8H602z" fill="#b8b1a2"/><path d="M602 724h136v3H602z" fill="#4a443c"/><path d="M738 716 L800 742 L744 742Z" fill="#9a9488"/>`);
// reloj/escudo
add(`<circle cx="670" cy="312" r="18" fill="#e9e0c6" stroke="#4d443a" stroke-width="3"/><path d="M670 312V300M670 312L679 316" stroke="#1a1620" stroke-width="2.5" stroke-linecap="round"/>`);
// aire acondicionado, caños, tanque de agua
add(`<rect x="1000" y="470" width="44" height="24" fill="#d3d0c6" rx="3"/><circle cx="1012" cy="482" r="7" fill="#7b7880"/>`);
add(`<path d="M334 392V450M338 392V450" stroke="#6c6458" stroke-width="3"/>`);
add(`<g transform="translate(404 312)"><path d="M0 62 L-6 74M52 62 L58 74M26 62V74" stroke="#4d4c55" stroke-width="3"/><rect x="-6" y="68" width="70" height="5" fill="#3e3d46"/><rect x="0" y="0" width="52" height="64" rx="8" fill="#5f7d8f"/><ellipse cx="26" cy="2" rx="26" ry="7" fill="#87a7b8"/><rect x="2" y="4" width="10" height="58" fill="#fff" opacity=".18"/><rect x="40" y="2" width="12" height="62" fill="#0b1018" opacity=".25"/><path d="M0 24H52M0 44H52" stroke="#33454f" stroke-width="2"/></g>`);
// antena
add(`<path d="M900 372V312M884 326H916M888 340H912" stroke="#2a2630" stroke-width="3"/>`);

// mural en el ala baja
add(`<g opacity=".95"><rect x="1126" y="568" width="40" height="76" fill="#24346b" opacity=".0"/><circle cx="1150" cy="590" r="12" fill="#f0b840"/><path d="M1126 640c10-26 20-22 30-34s10 34 10 34z" fill="#c0306e"/><path d="M1128 620c12-6 20 2 30-8" stroke="#2fb5b8" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M1134 580l8-6 8 8" stroke="#f4ead2" stroke-width="3" fill="none"/></g>`);
// hongo en la pared (guiño al cuento)
add(`<g transform="translate(340 600)" opacity=".95"><ellipse cx="6" cy="22" rx="16" ry="5" fill="#2b2a24" opacity=".4"/><path d="M0 18c0-12 6-18 12-18s12 6 12 18z" fill="#d7d0b8"/><path d="M-2 22c-4-8-1-14 4-14" fill="#e8e1c8"/><ellipse cx="4" cy="8" rx="3" ry="2" fill="#a5987a"/><ellipse cx="14" cy="11" rx="2.4" ry="1.8" fill="#a5987a"/><path d="M14 18c0-8 4-12 8-12s8 4 8 12z" transform="translate(6 2)" fill="#c6bea2"/><circle cx="14" cy="6" r="22" fill="#6fe0d0" opacity=".16" filter="url(#soft-s)"/></g>`);

/* ----- cercos, vereda, mástil, árbol ----- */
add(`<path d="M610 727 L730 727 L780 774 L560 774Z" fill="#b9b2a1" opacity=".92"/><path d="M610 727 L730 727 L780 774 L560 774Z" fill="url(#tiles)" opacity=".5"/>`);
function fence(x0, x1) {
  add(`<g><rect x="${x0}" y="740" width="${x1 - x0}" height="4" fill="#16131c"/><rect x="${x0}" y="768" width="${x1 - x0}" height="4" fill="#16131c"/>`);
  for (let x = x0; x <= x1; x += 13) { const miss = R() < 0.06; if (miss) continue; const bend = R() < 0.07 ? (R() - 0.5) * 10 : 0; add(`<path d="M${f(x)} 774 L${f(x + bend)} 734" stroke="#16131c" stroke-width="3"/><path d="M${f(x + bend)} 734 l-3 -6 l3 -4 l3 4z" fill="#16131c"/>`); }
  add(`<rect x="${x0}" y="740" width="${x1 - x0}" height="1.5" fill="#6e7fb5" opacity=".6"/></g>`);
}
fence(300, 560); fence(790, 1050); fence(1090, 1180);
// mástil con bandera argentina
add(`<g><rect x="258" y="440" width="5" height="300" fill="#e8e3d4"/><rect x="258" y="440" width="2" height="300" fill="#fff"/><circle cx="260.5" cy="436" r="5" fill="#d9b45a"/>
<path d="M263 448 C 290 438 320 462 372 446 L 372 520 C 320 536 290 512 263 522Z" fill="#74b3e3"/>
<path d="M263 472 C 290 462 320 486 372 470 L 372 497 C 320 513 290 489 263 497Z" fill="#f7f6f0"/>
<circle cx="318" cy="485" r="7" fill="#f4b43c"/>
<path d="M263 448 C 290 438 320 462 372 446 L 372 520 C 320 536 290 512 263 522Z" fill="url(#lg-shade)" opacity=".5"/>
<ellipse cx="262" cy="741" rx="28" ry="6" fill="#0a0614" opacity=".6"/></g>`);
// ceibo (árbol) a la derecha
add(`<g><path d="M1204 744 C1198 700 1206 668 1200 630 L1218 630 C1216 668 1224 704 1230 744Z" fill="#4a3426"/><path d="M1206 740 C1204 700 1210 668 1206 640" stroke="#7a5a42" stroke-width="3" fill="none"/>`);
[[1212, 600, 56], [1176, 626, 44], [1252, 620, 48], [1214, 558, 46], [1244, 570, 36], [1182, 576, 34]].forEach(([x, y, r], i) => add(`<circle cx="${x}" cy="${y}" r="${r}" fill="${['#2f4a35', '#3a5a3c', '#284030'][i % 3]}"/>`));
for (let i = 0; i < 46; i++) { const a = R() * 6.28, d = R() * 70; add(`<circle cx="${f(1212 + Math.cos(a) * d * 1.1)}" cy="${f(592 + Math.sin(a) * d * 0.8)}" r="${f(2.5 + R() * 3.5)}" fill="${R() < 0.7 ? '#d8383a' : '#f08a3c'}"/>`); }
add(`<ellipse cx="1214" cy="745" rx="34" ry="7" fill="#0a0614" opacity=".55"/></g>`);
// banco y mochila
add(`<g transform="translate(450 752)"><rect x="0" y="0" width="64" height="7" fill="#7a4a2a"/><rect x="2" y="-12" width="60" height="5" fill="#8b5a36"/><path d="M6 7V22M58 7V22M6 -7V0M58 -7V0" stroke="#2a2028" stroke-width="3"/></g>`);

/* ----- cables que caen del techo hacia el vacío ----- */
add(`<g fill="none" stroke="#0d0a16" stroke-width="2"><path d="M352 372 C 330 420 340 470 320 520"/><path d="M1010 372 C 1030 420 1020 450 1040 480"/></g>`);

/* ----- fragmentos en primer plano ----- */
// losa de vereda
add(`<g transform="translate(150 960) rotate(-14)" filter="url(#rough-s)"><path d="M-70 -14L70 -22L78 -4L-62 6Z" fill="#a7a193"/><path d="M-70 -14L70 -22L70 -18L-70 -8Z" fill="#cfc9b9"/><path d="M-62 6L78 -4L78 12L-56 20Z" fill="#5d574d"/><path d="M-18 -17L-10 4M26 -20L34 -2" stroke="#4e493f" stroke-width="2"/><path d="M-62 6 L-56 20" stroke="#3b362f" stroke-width="2"/></g>`);
// ladrillos flotantes
[[1180, 905, 22], [1118, 980, -34], [1235, 960, 52]].forEach(([x, y, r]) => add(`<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-26" y="-11" width="52" height="22" rx="2" fill="#a34f38"/><rect x="-26" y="-11" width="52" height="7" fill="#c06a50"/><rect x="-26" y="3" width="52" height="8" fill="#6d2f24" opacity=".6"/><circle cx="-9" cy="2" r="3" fill="#331a14"/><circle cx="9" cy="2" r="3" fill="#331a14"/></g>`));
// silla escolar
add(`<g transform="translate(228 1062) rotate(24)"><rect x="-22" y="-26" width="44" height="6" fill="#c9923a"/><rect x="-20" y="-52" width="40" height="22" rx="3" fill="#c9923a"/><rect x="-20" y="-52" width="40" height="5" fill="#f0c570" opacity=".5"/><path d="M-18 -20V14M18 -20V14M-18 -4H18" stroke="#2a2630" stroke-width="3.5"/></g>`);
// cuaderno abierto
add(`<g transform="translate(1100 800) rotate(-22)" filter="url(#paperfx)"><path d="M0 0 L-36 -5 L-36 28 L0 34Z" fill="#efe6cc"/><path d="M0 0 L36 -5 L36 28 L0 34Z" fill="#e5dbbd"/><path d="M-30 6H-6M-30 13H-6M-30 20H-6M6 6H30M6 13H30" stroke="#5a6aa0" stroke-width="1" opacity=".6"/><path d="M0 0V34" stroke="#b4a780" stroke-width="2"/></g>`);
// mate flotante
add(`<g transform="translate(330 1012) rotate(10)"><path d="M-16 -10 q0 28 16 28 q16 0 16 -28z" fill="#6b4a2c"/><ellipse cx="0" cy="-10" rx="16" ry="5" fill="#2f3f27"/><path d="M12 -26 L2 -12" stroke="#c9c9c9" stroke-width="3" stroke-linecap="round"/></g>`);

/* ----- iluminación ambiental final ----- */
add(`</svg>`);

mkdirSync('public/assets/school', { recursive: true });
writeFileSync('public/assets/school/escuela-flotante.svg', o.join('\n'));
console.log('escuela-flotante.svg', Math.round(o.join('\n').length / 1024) + ' KB');
