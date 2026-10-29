# El multiverso de la dirección escolar

Presentación web interactiva en React, Vite y TypeScript. Implementa las etapas A y B: navegación entre nueve portales, identidad visual cinematográfica, títulos de recortes, animación CSS ligera, escenas interiores, constelación de seis cuentos, controles por teclado, movimiento reducido y notas de presentación.

## Ejecutar

Requiere Node.js 20 o posterior. Desde esta carpeta:

```sh
npm install
npm run dev
```

Abrí la dirección local que informa Vite. Para generar el sitio estático:

```sh
npm run build
npm run preview
```

El resultado de compilación queda en `dist/`. La configuración usa rutas relativas (`base: './'`) y no hay solicitudes de recursos externos; puede abrirse `dist/index.html` directamente o servirse desde cualquier hosting estático. Para desarrollo sí se necesita instalar las dependencias npm.

## Navegación

- Flecha derecha: entrar desde portada o avanzar al portal siguiente.
- Flecha izquierda: portal anterior.
- Escape o M: volver al mapa central.
- F: solicitar pantalla completa.
- Tab y Enter/Espacio: recorrer y activar los portales.
- Botón “Notas”: abrir el panel presentador. Las notas se guardan en `localStorage` del navegador.
- Cada portal abre su escena; el portal 7 presenta los seis cuentos en una constelación seleccionable.

## Edición de contenido

Los datos de portada, los nueve portales, las seis fichas narrativas, las notas iniciales, las referencias y los parámetros de movimiento están en `src/data/presentation.ts`. Afiliaciones y encuentro son campos editables en la portada. El contenido se contrastó con el DOCX de la ponencia, el PDF del libro y la maqueta PPTX.

## Recursos y fuentes pendientes

Se revisaron `C:\Users\elias\Downloads\materiales`: DOCX de la ponencia, PDF del libro y maqueta PPTX de 46 diapositivas. Se añadieron a la escena seis ilustraciones extraídas de las primeras páginas de cada cuento y se redactaron fichas con base en sus contenidos y el prólogo. La ponencia documenta las referencias usadas en las notas; los datos editoriales de la maqueta incluyen campos sin completar, por lo que no se presentan como definitivos. La imagen original única del multiverso de los seis cuentos no se encontró como página o recurso gráfico en los archivos. La escuela actual sigue siendo una ilustración SVG provisional original.

Carpetas previstas bajo `public/assets/`: `school`, `portals`, `stories`, `textures`, `fonts` y `audio`. Los seis PNG de `stories/` se extrajeron de la maqueta PPTX y están conectados con sus fichas. `school/school.svg` es una ilustración provisional original, preparada para reemplazarse en esa misma ruta. Las texturas, el polvo estelar y los anillos se componen con CSS/SVG local; no requieren servicios externos.

## Pruebas y problemas conocidos

Registro de etapa B: `npm run build` completó correctamente con TypeScript 5.7 y Vite 5.4. La revisión visual rápida en navegador local mostró la portada, el mapa de nueve portales, una escena temática y el portal coral a 1536 × 864; queda pendiente revisar Edge y 1920 × 1080 / 1366 × 768 en el equipo de proyección. Los anillos, conexiones y escenas usan CSS/SVG y no incorporan un motor 3D. Las notas se guardan por número de portal en el navegador y no se sincronizan entre equipos.

## Rediseño artístico · Fase 1 (portada y escena central)

Archivos nuevos: `src/components/Cutout.tsx` (títulos de recortes en SVG con papel, borde irregular, grano y tinta; sistema reutilizable `CutoutTitle`), `src/components/Cosmos.tsx` (universo procedural en canvas con parallax), `src/components/Gate.tsx` (portales dimensionales), `src/redesign.css`, `scripts/generate-school.mjs` (genera `public/assets/school/escuela-flotante.svg`, reemplazable por una ilustración propia con proporción 1400 × 1260) y `scripts/capture.mjs` (capturas de QA). Respaldo previo en `_backup_pre-rediseno/`. `?scene=map` abre directamente el mapa central. Las tipografías de los recortes usan fuentes del sistema (Bodoni MT, Rockwell, Impact, Georgia, etc.) con alternativas; el diseño se mide en tiempo de ejecución.

## Rediseño artístico · Fase 2 (escenas interiores)

`src/components/Scenes.tsx` + `src/scenes.css`: una composición propia por portal (hilos de relaciones, escenas simultáneas, códigos ⇄ cuento interactivo, intersección de dos voces, camino que se bifurca, constelación coral con hover, planetas de los seis cuentos, manuscrito con la cita documentada, ondas de lectura). `?portal=N` abre un portal directo. Nota: los PNG de `public/assets/stories/` son íconos casi transparentes (alfa ≈ 9 %); se realzan con el filtro SVG `#story-ink`. Conviene reemplazarlos por las láminas originales del libro con los mismos nombres.
