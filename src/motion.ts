/* Esta presentación se proyecta en una PC controlada: el movimiento está siempre activo,
   aunque Windows tenga desactivadas las animaciones («Mostrar animaciones» = No).
   Solo se detiene si se abre con ?quieto en la dirección (prueba de accesibilidad). */
export const stillMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('quieto');
