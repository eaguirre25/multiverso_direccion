// Captura de pantallas de QA con Microsoft Edge/Chrome (sin dependencias).
// Uso: node scripts/capture.mjs <urlBase> <carpetaSalida>
// Requiere el servidor de Vite o `npm run preview` en marcha.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2] ?? 'http://127.0.0.1:5199/';
const out = process.argv[3] ?? 'capturas';
const exe = process.env.BROWSER ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9333 + Math.floor(Math.random() * 500);
mkdirSync(out, { recursive: true });
const proc = spawn(exe, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cap-'))}`, 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let targets;
for (let i = 0; i < 40; i++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.find(t => t.type === 'page')) break; } catch { /* espera */ } await sleep(300); }
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

const only = process.argv[4];
const shots = only === 'portales' ? Array.from({ length: 9 }, (_, i) => [`portal${i + 1}`, `portal=${i + 1}`, Number(process.env.W ?? 1920), Number(process.env.H ?? 1080)]) : [
  ['portada', 'cover', 1920, 1080], ['mapa', 'map', 1920, 1080], ['cierre', 'thanks', 1920, 1080], ['cierre', 'thanks', 1366, 768],
  ['portada', 'cover', 1366, 768], ['mapa', 'map', 1366, 768],
];
for (const [name, scene, w, h] of shots) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: `${base}?${scene.includes('=') ? scene : 'scene=' + scene}&t=${Date.now()}` });
  await sleep(5500);
  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(join(out, `fase${only === 'portales' ? 2 : 1}-${name}-${w}x${h}.png`), Buffer.from(data, 'base64'));
  console.log('ok', name, w, h);
}
if (only === 'portales') { ws.close(); proc.kill(); process.exit(0); }
// estado hover del portal 5 (filamento y título)
await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: `${base}?scene=map&t=${Date.now()}` });
await sleep(8000);
const el = await send('Runtime.evaluate', { expression: 'JSON.stringify(document.querySelectorAll(".gate")[4].getBoundingClientRect())' });
const r = JSON.parse(el.result.value);
await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: r.x + r.width / 2, y: r.y + r.height / 2 });
await sleep(1200);
const { data } = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync(join(out, 'fase1-mapa-hover-1920x1080.png'), Buffer.from(data, 'base64'));
console.log('ok hover');
ws.close(); proc.kill();
process.exit(0);
