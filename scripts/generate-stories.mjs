// Genera las seis ilustraciones de los cuentos en public/assets/stories/ilustraciones/*.svg
// (collage de papel + realismo mágico). Los PNG originales de public/assets/stories/ no se tocan.
// Uso: node scripts/generate-stories.mjs
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';

let seed = 99;
const R = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const f = n => Math.round(n * 10) / 10;
const out = 'public/assets/stories/ilustraciones';
mkdirSync(out, { recursive: true });

const defs = (hue) => `<defs>
<radialGradient id="bg" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="hsl(${hue} 55% 30%)"/><stop offset=".55" stop-color="hsl(${hue} 50% 14%)"/><stop offset="1" stop-color="#05060f"/></radialGradient>
<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="3" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="rough2" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".12" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" seed="2" result="t"/><feColorMatrix in="t" type="matrix" values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .38  0 0 0 .55 -.12" result="g"/><feComposite in="g" in2="SourceGraphic" operator="in"/></filter>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="glow2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="paper" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" seed="6" result="n"/><feDiffuseLighting in="n" lighting-color="#fff" surfaceScale="1.4"><feDistantLight azimuth="230" elevation="60"/></feDiffuseLighting><feComposite in2="SourceGraphic" operator="in" result="l"/><feBlend in="SourceGraphic" in2="l" mode="multiply"/></filter>
</defs>`;
const wrap = (hue, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">${defs(hue)}<rect width="600" height="600" fill="url(#bg)"/>${body}<rect width="600" height="600" fill="#fff" filter="url(#grain)" opacity=".5" style="mix-blend-mode:overlay"/><rect width="600" height="600" fill="none"/></svg>`;
const stars = (n, col = '#fff3d0') => Array.from({ length: n }, () => `<circle cx="${f(R() * 600)}" cy="${f(R() * 600)}" r="${f(0.6 + R() * 1.6)}" fill="${col}" opacity="${f(0.3 + R() * 0.6)}"/>`).join('');
const save = (name, svg) => { writeFileSync(`${out}/${name}.svg`, svg); console.log(name, Math.round(svg.length / 1024) + ' KB'); };

/* 1 · Ludismo neuronal ------------------------------------------------ */
{
  let b = stars(40, '#ffd9a0');
  const dend = (x, y, ang, len, w, depth) => {
    let d = `M${f(x)} ${f(y)}`; let cx = x, cy = y; let a = ang; const parts = [];
    for (let i = 0; i < 5; i++) { a += (R() - 0.5) * 0.7; cx += Math.cos(a) * len / 5; cy += Math.sin(a) * len / 5; d += `L${f(cx)} ${f(cy)}`; if (depth < 3 && i > 0 && R() < 0.6) parts.push(dend(cx, cy, a + (R() < 0.5 ? -1 : 1) * (0.5 + R() * 0.6), len * 0.55, w * 0.6, depth + 1)); }
    return `<path d="${d}" fill="none" stroke="#f6c477" stroke-width="${f(w)}" stroke-linecap="round" stroke-linejoin="round"/>${parts.join('')}`;
  };
  b += `<g filter="url(#glow)" opacity=".8">${Array.from({ length: 7 }, (_, i) => dend(300, 320, (i / 7) * 6.28 + 0.3, 150, 7, 0)).join('')}</g>`;
  b += `<g filter="url(#rough2)">${Array.from({ length: 7 }, (_, i) => { seed = 5 + i * 3; return dend(300, 320, (i / 7) * 6.28 + 0.3, 150, 5.5, 0); }).join('')}</g>`;
  b += `<path d="M300 370 C 300 450 380 470 430 540" stroke="#f6c477" stroke-width="7" fill="none" stroke-linecap="round" filter="url(#rough2)"/><circle cx="430" cy="541" r="9" fill="#ffe3a8"/>`;
  b += `<circle cx="300" cy="320" r="70" fill="#ffb86a" opacity=".5" filter="url(#glow)"/><circle cx="300" cy="320" r="48" fill="#d85f8a" filter="url(#rough2)"/><circle cx="288" cy="308" r="20" fill="#f6a0b6" opacity=".7"/><circle cx="306" cy="326" r="12" fill="#7a2a55"/>`;
  // engranaje
  const gear = (cx, cy, r, n, col) => { let p = []; for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * 6.283; const rr = i % 2 ? r : r * 1.22; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return `<path d="M${p.map(([x, y]) => `${f(x)} ${f(y)}`).join('L')}Z" fill="${col}" stroke="#14111c" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${r * 0.38}" fill="#14111c"/>`; };
  b += `<g filter="url(#paper)" opacity=".95">${gear(130, 460, 52, 10, '#8f98a6')}${gear(205, 520, 34, 8, '#a8896a')}</g>`;
  // martillo levantado
  b += `<g transform="translate(470 150) rotate(32)" filter="url(#paper)"><rect x="-6" y="-10" width="12" height="150" rx="4" fill="#8a5a36"/><rect x="-40" y="-34" width="80" height="40" rx="6" fill="#6f7886" stroke="#14111c" stroke-width="3"/></g>`;
  b += `<g fill="#fff3c0" filter="url(#glow2)"><path d="M420 255 l14 -22 l-6 18 l16 -8 l-14 26z"/><path d="M180 200 l10 -18 l-4 14 l12 -6 l-10 20z"/></g>`;
  save('ludismo-neuronal', wrap(285, b));
}

/* 2 · Diario de un hongo en la pared --------------------------------- */
{
  let b = '';
  b += `<rect width="600" height="600" fill="#b9ad98"/><g filter="url(#paper)"><rect width="600" height="600" fill="#cfc3a8"/></g>`;
  // ladrillos a la vista donde descascaró
  b += `<path d="M0 330 C 80 300 140 360 230 330 S 400 290 470 340 S 560 330 600 320 V600 H0Z" fill="#8c4a37" filter="url(#rough)"/>`;
  for (let y = 330; y < 600; y += 34) for (let x = (y / 34) % 2 ? -20 : 0; x < 600; x += 80) b += `<rect x="${x}" y="${y}" width="76" height="30" fill="#9b5440" stroke="#d9cdb4" stroke-width="3" opacity=".9"/>`;
  // humedad
  b += `<rect y="250" width="600" height="350" fill="url(#bg)" opacity=".55"/>`;
  b += `<path d="M120 0 C 140 120 90 160 130 300 M410 0 C 400 90 440 140 420 260" stroke="#4a3d32" stroke-width="16" fill="none" opacity=".18" filter="url(#glow2)"/>`;
  // grieta
  b += `<path d="M300 0 L 292 80 L 312 150 L 296 230 L 318 300 L 300 360" stroke="#2a211c" stroke-width="7" fill="none" stroke-linejoin="bevel"/>`;
  // colonia de hongos
  const cap = (x, y, r, rot, col) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-r * 0.16}" y="0" width="${r * 0.32}" height="${r * 1.1}" rx="${r * 0.12}" fill="#e8dcc0"/><path d="M${-r} 0 C ${-r} ${-r * 1.15} ${r} ${-r * 1.15} ${r} 0 Z" fill="${col}" filter="url(#rough2)"/><path d="M${-r * 0.9} 0 H${r * 0.9}" stroke="#4d3a28" stroke-width="3" opacity=".6"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${f(-r * 0.8 + i * r * 0.27)} 1 L${f(-r * 0.7 + i * r * 0.23)} ${f(r * 0.22)}" stroke="#7a6347" stroke-width="2"/>`).join('')}<ellipse cx="${-r * 0.3}" cy="${-r * 0.55}" rx="${r * 0.35}" ry="${r * 0.18}" fill="#fff" opacity=".35"/></g>`;
  b += `<g>${cap(300, 330, 74, -4, '#c9983f')}${cap(214, 372, 48, -22, '#b88a3b')}${cap(392, 368, 54, 18, '#d6a74c')}${cap(166, 430, 30, -34, '#cdbb8a')}${cap(446, 418, 34, 30, '#c9983f')}${cap(268, 438, 28, 6, '#e0d2a0')}</g>`;
  b += Array.from({ length: 46 }, () => `<circle cx="${f(120 + R() * 360)}" cy="${f(130 + R() * 260)}" r="${f(1 + R() * 3)}" fill="#8ff0dc" opacity="${f(0.3 + R() * 0.6)}" filter="url(#glow2)"/>`).join('');
  // hoja del diario
  b += `<g transform="translate(440 120) rotate(8)" filter="url(#paper)"><path d="M0 0 H120 V150 H0Z" fill="#f1e9d2" stroke="#3a2f26" stroke-width="2"/><path d="M12 24H108M12 44H108M12 64H90M12 84H108M12 104H70" stroke="#4a63a0" stroke-width="2" opacity=".7"/><path d="M0 0 H120" stroke="#b44" stroke-width="5"/></g>`;
  save('diario-de-un-hongo', wrap(165, b));
}

/* 3 · Puerta --------------------------------------------------------- */
{
  let b = stars(25, '#bfe9ee');
  b += `<ellipse cx="300" cy="560" rx="260" ry="46" fill="#ffd27a" opacity=".5" filter="url(#glow)"/>`;
  b += `<g filter="url(#paper)"><rect x="150" y="60" width="300" height="500" fill="#2f2118" stroke="#120c09" stroke-width="8"/><rect x="170" y="80" width="260" height="480" fill="#7a4d2c"/>`;
  b += `<rect x="190" y="100" width="220" height="150" fill="#cbb690"/><rect x="190" y="100" width="220" height="150" fill="#ffd98a" opacity=".9"/><path d="M300 100V250M190 175H410" stroke="#3a2415" stroke-width="8"/>`;
  b += `<path d="M230 250 C 232 200 250 190 252 175 C 262 190 270 200 270 250Z M340 250 C 342 210 362 196 366 178 C 374 196 384 210 384 250Z" fill="#8a4f25" opacity=".55" filter="url(#glow2)"/>`;
  [[190, 280, 100, 120], [310, 280, 100, 120], [190, 420, 100, 120], [310, 420, 100, 120]].forEach(([x, y, w, h]) => b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#68401f" stroke="#2a1a0e" stroke-width="5"/><rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="${h - 16}" fill="none" stroke="#9a6a3e" stroke-width="2"/>`);
  b += `<circle cx="395" cy="340" r="15" fill="#d9b04b" stroke="#6a4c14" stroke-width="3"/><rect x="383" y="352" width="24" height="8" rx="3" fill="#b88f2c"/><circle cx="395" cy="340" r="5" fill="#fff3b0"/>`;
  b += `<rect x="238" y="262" width="124" height="22" fill="#e9dfc4" stroke="#222" stroke-width="2"/><text x="300" y="278" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="14" fill="#1a1620" letter-spacing="3">DIRECCIÓN</text></g>`;
  b += `<path d="M150 556 H450 L520 600 H80Z" fill="#ffd27a" opacity=".8" filter="url(#glow2)"/>`;
  save('puerta', wrap(195, b));
}

/* 4 · Esto que existe ------------------------------------------------ */
{
  let b = stars(55, '#ffe9c0');
  b += `<circle cx="470" cy="130" r="58" fill="#f4e7b8" filter="url(#rough2)"/><circle cx="486" cy="116" r="52" fill="#1a1236" opacity=".78"/>`;
  // monstruo
  b += `<g filter="url(#rough2)"><path d="M150 460 C 120 300 220 170 330 190 C 450 210 480 360 440 470Z" fill="#a43d7a"/><path d="M190 190 L 170 120 L 225 165Z M390 200 L 428 128 L 440 205Z" fill="#7d2b5e"/>`;
  for (let i = 0; i < 40; i++) { const a = R() * 6.28, d = 70 + R() * 90; b += `<path d="M${f(300 + Math.cos(a) * d)} ${f(330 + Math.sin(a) * d * 1.1)} l${f(Math.cos(a) * 14)} ${f(Math.sin(a) * 14)}" stroke="#c75a97" stroke-width="3" stroke-linecap="round"/>`; }
  b += `</g><ellipse cx="260" cy="300" rx="34" ry="42" fill="#fbf2d8"/><ellipse cx="365" cy="300" rx="34" ry="42" fill="#fbf2d8"/><circle cx="268" cy="306" r="17" fill="#1a1020"/><circle cx="357" cy="306" r="17" fill="#1a1020"/><circle cx="262" cy="298" r="6" fill="#fff"/><circle cx="351" cy="298" r="6" fill="#fff"/>`;
  b += `<path d="M240 380 Q 312 440 392 380" stroke="#2a0f24" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M262 396 l8 18 l8 -14 M322 410 l8 -18 l8 18" stroke="#fbf2d8" stroke-width="7" fill="none" stroke-linejoin="round"/>`;
  // pupitre en primer plano
  b += `<g filter="url(#paper)"><path d="M70 470 H530 L550 500 H50Z" fill="#c9a06a" stroke="#2a1a10" stroke-width="4"/><rect x="60" y="500" width="480" height="26" fill="#8a5f34"/><path d="M110 526V590M490 526V590" stroke="#1a1620" stroke-width="10"/><g transform="translate(120 420) rotate(-6)"><rect width="110" height="52" fill="#f1e9d2" stroke="#222" stroke-width="2"/><path d="M12 14H98M12 28H98M12 42H70" stroke="#4a63a0" stroke-width="2"/></g><rect x="430" y="400" width="86" height="80" rx="14" fill="#2a6f8a" stroke="#0c2530" stroke-width="4"/><rect x="448" y="440" width="50" height="26" rx="6" fill="#1d5066"/></g>`;
  save('esto-que-existe', wrap(325, b));
}

/* 5 · Mate lavado ---------------------------------------------------- */
{
  let b = '';
  b += `<circle cx="300" cy="270" r="230" fill="#f0b25a" opacity=".16" filter="url(#glow)"/>`;
  b += `<g stroke="#f6e7c8" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55" filter="url(#glow2)"><path d="M280 190 C 250 150 320 120 290 70"/><path d="M330 200 C 300 160 370 130 340 84"/></g>`;
  // reloj de pared
  b += `<g filter="url(#paper)"><circle cx="470" cy="120" r="56" fill="#efe4c8" stroke="#2a1a10" stroke-width="7"/><path d="M470 120 V82 M470 120 L496 134" stroke="#1a1620" stroke-width="6" stroke-linecap="round"/><circle cx="470" cy="120" r="5" fill="#a22"/></g>`;
  // termo
  b += `<g filter="url(#paper)"><rect x="76" y="260" width="108" height="270" rx="30" fill="#b53a34" stroke="#2a0e0c" stroke-width="5"/><rect x="76" y="260" width="108" height="48" rx="22" fill="#4b4a52"/><rect x="92" y="300" width="14" height="210" fill="#fff" opacity=".22"/></g>`;
  // mate (calabaza)
  b += `<g filter="url(#paper)"><path d="M230 300 C 220 400 260 520 340 520 C 420 520 460 400 450 300Z" fill="#8a5a2e" stroke="#2a180a" stroke-width="5"/><ellipse cx="340" cy="300" rx="112" ry="30" fill="#5a3a1c" stroke="#2a180a" stroke-width="5"/><ellipse cx="340" cy="302" rx="94" ry="21" fill="#4e5a28"/><path d="M262 340 C 270 420 290 470 330 490" stroke="#c28a50" stroke-width="10" fill="none" opacity=".5" stroke-linecap="round"/><path d="M240 330 C 262 346 300 350 340 350 S 420 346 442 330" stroke="#caa66a" stroke-width="12" fill="none"/></g>`;
  // bombilla
  b += `<path d="M366 302 L 420 140" stroke="#d9dde2" stroke-width="9" stroke-linecap="round"/><path d="M366 302 L 420 140" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/><ellipse cx="423" cy="132" rx="14" ry="9" fill="#d9dde2" transform="rotate(-18 423 132)"/>`;
  // llaves
  b += `<g transform="translate(110 150) rotate(-14)" filter="url(#paper)"><circle cx="0" cy="0" r="22" fill="none" stroke="#c9a23c" stroke-width="8"/><path d="M0 22 V92 M0 70 H18 M0 88 H14" stroke="#c9a23c" stroke-width="8" stroke-linecap="round"/></g>`;
  save('mate-lavado', wrap(30, b));
}

/* 6 · La mujer de las granadas --------------------------------------- */
{
  const sparrow = readFileSync('public/assets/fauna/gorrion.png').toString('base64');
  let b = stars(30, '#ffd0c0');
  b += `<g filter="url(#rough2)"><path d="M-10 120 C 150 160 300 90 620 200" stroke="#3a2418" stroke-width="16" fill="none"/>`;
  for (let i = 0; i < 28; i++) { const x = 20 + i * 21 + R() * 10, y = 130 + Math.sin(i / 3) * 24 - i * 1.3 + (R() - 0.5) * 50; b += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="26" ry="9" fill="${['#4d7a3a', '#6a9a45', '#3a5e30'][i % 3]}" transform="rotate(${f(R() * 180)} ${f(x)} ${f(y)})"/>`; }
  b += `</g>`;
  const gran = (x, y, r, open) => `<g filter="url(#paper)"><circle cx="${x}" cy="${y}" r="${r}" fill="#b2262e" stroke="#4a0c12" stroke-width="4"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.35}" r="${r * 0.35}" fill="#e46a6a" opacity=".5"/><path d="M${x - r * 0.3} ${y - r} l ${r * 0.15} -${r * 0.22} l ${r * 0.15} ${r * 0.16} l ${r * 0.15} -${r * 0.2} l ${r * 0.15} ${r * 0.26}z" fill="#8a1a22" stroke="#4a0c12" stroke-width="3"/>${open ? `<path d="M${x - r * 0.1} ${y} a${r * 0.9} ${r * 0.9} 0 0 0 ${r * 1.1} ${r * 0.8} a${r * 0.9} ${r * 0.9} 0 0 0 -${r * 1.1} -${r * 0.8}z" fill="#f5d6c6"/>${Array.from({ length: 26 }, () => `<circle cx="${f(x + r * 0.1 + R() * r * 0.8)}" cy="${f(y + r * 0.1 + R() * r * 0.6)}" r="${f(4 + R() * 3)}" fill="#c8102e" stroke="#7a0a1c" stroke-width="1.5"/>`).join('')}` : ''}</g>`;
  b += gran(140, 260, 66, false) + gran(240, 330, 52, false) + gran(470, 250, 76, true);
  // gorrión (foto recortada, borde de papel)
  b += `<g transform="translate(300 480) rotate(-5)"><path d="M-190 -92 L190 -100 L196 96 L-184 100Z" fill="#f1e9d2" filter="url(#rough2)" opacity="0"/></g>`;
  b += `<g filter="url(#rough2)"><image href="data:image/png;base64,${sparrow}" x="150" y="330" width="330" height="240" preserveAspectRatio="xMidYMid meet"/></g>`;
  save('la-mujer-de-las-granadas', wrap(350, b));
}
