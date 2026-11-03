import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/* La compilación se puede abrir con doble clic (file://), sin servidor:
   se genera un script clásico (IIFE) con `defer` y se quita `crossorigin`,
   que los navegadores bloquean al abrir archivos locales. */
const abrirSinServidor = (): Plugin => ({
  name: 'abrir-sin-servidor',
  enforce: 'post',
  transformIndexHtml: html => html
    .replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/g, '<script defer src="$1"></script>')
    .replace(/ crossorigin/g, ''),
});

export default defineConfig({
  plugins: [react(), abrirSinServidor()],
  base: './',
  build: { modulePreload: false, rollupOptions: { output: { format: 'iife', inlineDynamicImports: true } } },
});
