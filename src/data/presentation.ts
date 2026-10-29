export type RefKey = 'ball2003' | 'borges1974' | 'cortazar1971' | 'deleuze1988' | 'eco1990' | 'haraway1995' | 'haraway2019' | 'iser1987' | 'landri2021' | 'latour2008' | 'maclure2013' | 'mifsud2021' | 'niesche2013' | 'niesche2018' | 'piglia2000' | 'richardson2005' | 'stpierre2021a' | 'stpierre2021b' | 'stockwell2002';
export type Reference = { cite: string; full: string };
/** Segmentos de un párrafo: texto corrido, noción destacada o cita APA con ficha bibliográfica. */
export type Seg = { t: 'text'; v: string } | { t: 'em'; v: string } | { t: 'cite'; refs: RefKey[]; label?: string };
export type Story = { title: string; description: string; mood: string; problem: string; ref?: RefKey; image: string; imageAlt: string };
export type Portal = { id: number; title: string; short: string; pages: Seg[][]; question?: string; storyPortal?: boolean };

export const presentation = {
  title: 'El multiverso de la dirección escolar',
  subtitle: 'Coproducción narrativa de cuentos desde la investigación postcualitativa',
  authors: ['Marcela Victoria Gil', 'Elías Gonzalo Aguirre'],
  congress: 'IV Congreso Internacional de Ciencias Humanas',
  university: 'Universidad Nacional de San Martín',
  table: 'Mesa 20',
  tableTitle: 'Nuevos lenguajes y métodos creativos de investigación en la sociedad postmedia',
  dates: '4 al 6 de noviembre de 2026',
};

/* Bibliografía exacta de la ponencia (APA 7). No se incorporan fuentes nuevas. */
export const refs: Record<RefKey, Reference> = {
  ball2003: { cite: '(Ball, 2003)', full: 'Ball, S. J. (2003). The teacher\'s soul and the terrors of performativity. Journal of Education Policy, 18(2), 215–228. https://doi.org/10.1080/0268093022000043065' },
  borges1974: { cite: '(Borges, 1974)', full: 'Borges, J. L. (1974). El jardín de senderos que se bifurcan. En Obras completas 1923–1972 (pp. 472–480). Emecé.' },
  cortazar1971: { cite: '(Cortázar, 1971)', full: 'Cortázar, J. (1971). Algunos aspectos del cuento. Cuadernos Hispanoamericanos, 255, 403–416.' },
  deleuze1988: { cite: '(Deleuze & Guattari, 1988)', full: 'Deleuze, G., & Guattari, F. (1988). Mil mesetas: Capitalismo y esquizofrenia (J. Vázquez Pérez & U. Larraceleta, Trads.). Pre-Textos. (Trabajo original publicado en 1980).' },
  eco1990: { cite: '(Eco, 1990)', full: 'Eco, U. (1990). Obra abierta. Ariel.' },
  haraway1995: { cite: '(Haraway, 1995)', full: 'Haraway, D. J. (1995). Conocimientos situados: La cuestión científica en el feminismo y el privilegio de la perspectiva parcial. En Ciencia, cyborgs y mujeres: La reinvención de la naturaleza (pp. 313–346). Cátedra. (Trabajo original publicado en 1988).' },
  haraway2019: { cite: '(Haraway, 2019)', full: 'Haraway, D. J. (2019). Seguir con el problema: Generar parentesco en el Chthuluceno (H. Torres, Trad.). Consonni. (Trabajo original publicado en 2016).' },
  iser1987: { cite: '(Iser, 1987)', full: 'Iser, W. (1987). El acto de leer: Teoría del efecto estético. Taurus.' },
  landri2021: { cite: '(Landri, 2021)', full: 'Landri, P. (2021). Educational leadership, management, and administration through actor-network theory. Routledge.' },
  latour2008: { cite: '(Latour, 2008)', full: 'Latour, B. (2008). Reensamblar lo social: Una introducción a la teoría del actor-red (G. Zadunaisky, Trad.). Manantial. (Trabajo original publicado en 2005).' },
  maclure2013: { cite: '(MacLure, 2013)', full: 'MacLure, M. (2013). Researching without representation? Language and materiality in post-qualitative methodology. International Journal of Qualitative Studies in Education, 26(6), 658–667. https://doi.org/10.1080/09518398.2013.788755' },
  mifsud2021: { cite: '(Mifsud, 2021)', full: 'Mifsud, D. (2021). Educational leadership research and creative analytic practices: A critical mapping of theoretical and methodological terrains? En D. Mifsud (Ed.), Narratives of educational leadership: Representing research via creative analytic practices (pp. 1–20). Springer. https://doi.org/10.1007/978-981-16-5831-0_1' },
  niesche2013: { cite: '(Niesche, 2013)', full: 'Niesche, R. (2013). Foucault, counter-conduct and school leadership as a form of political subjectivity. Journal of Educational Administration and History, 45(2), 144–158. https://doi.org/10.1080/00220620.2013.768968' },
  niesche2018: { cite: '(Niesche, 2018)', full: 'Niesche, R. (2018). Critical perspectives in educational leadership: A new \'theory turn\'? Journal of Educational Administration and History, 50(3), 145–158. https://doi.org/10.1080/00220620.2017.1395600' },
  piglia2000: { cite: '(Piglia, 2000)', full: 'Piglia, R. (2000). Tesis sobre el cuento. En Formas breves (pp. 103–111). Anagrama.' },
  richardson2005: { cite: '(Richardson & St. Pierre, 2005)', full: 'Richardson, L., & St. Pierre, E. A. (2005). Writing: A method of inquiry. En N. K. Denzin & Y. S. Lincoln (Eds.), The SAGE handbook of qualitative research (3.ª ed., pp. 959–978). Sage.' },
  stpierre2021a: { cite: '(St. Pierre, 2021a)', full: 'St. Pierre, E. A. (2021a). Post qualitative inquiry, the refusal of method, and the risk of the new. Qualitative Inquiry, 27(1), 3–9. https://doi.org/10.1177/1077800419863005' },
  stpierre2021b: { cite: '(St. Pierre, 2021b)', full: 'St. Pierre, E. A. (2021b). Why post qualitative inquiry? Qualitative Inquiry, 27(2), 163–166. https://doi.org/10.1177/1077800420931142' },
  stockwell2002: { cite: '(Stockwell, 2002)', full: 'Stockwell, P. (2002). Cognitive poetics: An introduction. Routledge.' },
};

export const references = Object.values(refs).map(r => r.full);

export const portals: Portal[] = [
  { id: 1, title: '¿Cómo contar la dirección escolar?', short: 'Problema de investigación',
    pages: [
      [{ t: 'text', v: 'La dirección escolar se produce entre ' }, { t: 'em', v: 'relaciones simultáneas' }, { t: 'text', v: ': normativas, cuerpos, plataformas, arquitecturas, alimentos y afectos. Las lecturas centradas en la figura individual de quien dirige, cuestionadas por la crítica al ' }, { t: 'em', v: 'leader centrism' }, { t: 'text', v: ' ' }, { t: 'cite', refs: ['mifsud2021'] }, { t: 'text', v: ' y al predominio del ' }, { t: 'em', v: 'what works' }, { t: 'text', v: ' ' }, { t: 'cite', refs: ['niesche2018'] }, { t: 'text', v: ', encuentran allí un límite.' }],
      [{ t: 'text', v: 'Seguir las ' }, { t: 'em', v: 'asociaciones heterogéneas' }, { t: 'text', v: ' y la mediación de los objetos ' }, { t: 'cite', refs: ['latour2008'] }, { t: 'text', v: ' —también en la dirección y el liderazgo educativo ' }, { t: 'cite', refs: ['landri2021'] }, { t: 'text', v: '— deja un problema narrativo: cómo contar esa multiplicidad sin dispersarla ni reducirla.' }],
    ],
    question: '¿Cómo visibilizar una dirección hecha de relaciones simultáneas?' },
  { id: 2, title: 'De la investigación a la escritura', short: 'Del análisis a la escritura',
    pages: [
      [{ t: 'text', v: 'En la investigación doctoral, las categorías analíticas permitieron ordenar y comparar los materiales etnográficos, pero también introdujeron ' }, { t: 'em', v: 'cortes' }, { t: 'text', v: ': separaban relaciones que en la escuela ocurren a la vez.' }],
      [{ t: 'text', v: 'La ' }, { t: 'em', v: 'escritura' }, { t: 'text', v: ' apareció en ese punto como otra posibilidad de trabajo, entendida como método de indagación ' }, { t: 'cite', refs: ['richardson2005'] }, { t: 'text', v: '. Interesa por la ' }, { t: 'em', v: 'materialidad del lenguaje' }, { t: 'text', v: ' y los problemas de representación que plantea ' }, { t: 'cite', refs: ['maclure2013'] }, { t: 'text', v: '.' }],
    ],
    question: '¿Cómo mantener juntas relaciones que el análisis había separado?' },
  { id: 3, title: 'De la etnografía a la ficción', short: 'Composición ficcional',
    pages: [
      [{ t: 'text', v: 'La ' }, { t: 'em', v: 'composición ficcional' }, { t: 'text', v: ' transforma registros, experiencias y recuerdos mediante decisiones narrativas: condensa escenas, modifica temporalidades, reúne elementos y selecciona voces.' }],
      [{ t: 'text', v: 'Se inscribe en las ' }, { t: 'em', v: 'prácticas analíticas creativas' }, { t: 'text', v: ', que cuestionan la expectativa de representar transparentemente «lo real» ' }, { t: 'cite', refs: ['mifsud2021'] }, { t: 'text', v: ', y en una investigación atenta a la materialidad del lenguaje ' }, { t: 'cite', refs: ['maclure2013'] }, { t: 'text', v: '. Su ' }, { t: 'em', v: 'experimentación postcualitativa' }, { t: 'text', v: ' rehúsa convertirse en un repertorio de métodos para aplicar ' }, { t: 'cite', refs: ['stpierre2021a', 'stpierre2021b'], label: '(St. Pierre, 2021a, 2021b)' }, { t: 'text', v: '.' }],
    ] },
  { id: 4, title: 'Escribir entre dos', short: 'Coproducción narrativa',
    pages: [
      [{ t: 'text', v: 'La escritura compartida se fue gestando en un ' }, { t: 'em', v: 'vínculo construido durante una investigación doctoral' }, { t: 'text', v: ' y sostenido en las relaciones entre ' }, { t: 'em', v: 'escuelas secundarias y universidad' }, { t: 'text', v: ', particularmente a través de ' }, { t: 'em', v: 'ITED-UNSAM' }, { t: 'text', v: '.' }],
      [{ t: 'text', v: 'Desde sus diferentes experiencias y posiciones, una ' }, { t: 'em', v: 'directora escolar' }, { t: 'text', v: ' y un ' }, { t: 'em', v: 'investigador' }, { t: 'text', v: ' comenzaron a componer cuentos en los que convergen recuerdos, conversaciones, interpretaciones y decisiones narrativas.' }],
      [{ t: 'text', v: 'Esta experiencia de ' }, { t: 'em', v: 'hacer-con' }, { t: 'text', v: ' ' }, { t: 'cite', refs: ['haraway2019'] }, { t: 'text', v: ' reúne ' }, { t: 'em', v: 'conocimientos situados y perspectivas parciales' }, { t: 'text', v: ' ' }, { t: 'cite', refs: ['haraway1995'] }, { t: 'text', v: ', atravesados por acuerdos, diferencias y una historia compartida.' }],
    ] },
  { id: 5, title: '¿Por qué cuentos?', short: 'Forma breve',
    pages: [
      [{ t: 'text', v: 'El cuento ofrece recursos precisos para trabajar los interrogantes del multiverso: la ' }, { t: 'em', v: 'concentración' }, { t: 'text', v: ' capaz de irradiar significados más allá de los límites del texto ' }, { t: 'cite', refs: ['cortazar1971'] }, { t: 'text', v: ', la ' }, { t: 'em', v: 'elipsis' }, { t: 'text', v: ' que cifra una segunda historia en los intersticios ' }, { t: 'cite', refs: ['piglia2000'] }, { t: 'text', v: ' y la coexistencia de tiempos que se ' }, { t: 'em', v: 'bifurcan' }, { t: 'text', v: ' ' }, { t: 'cite', refs: ['borges1974'] }, { t: 'text', v: '.' }],
      [{ t: 'text', v: 'Una misma escena puede así contar más de una historia y conservar la irresolución de lo que ocurre en la dirección escolar.' }],
    ] },
  { id: 6, title: 'Una narrativa coral y multiespecies', short: 'Perspectivas y presencias',
    pages: [
      [{ t: 'text', v: 'Escribir cuentos permite ensayar un descentramiento de la mirada humana: neuronas, un hongo, una puerta, un monstruo, un mate y pájaros narran ' }, { t: 'em', v: 'perspectivas' }, { t: 'text', v: ' que desplazan al sujeto director.' }],
      [{ t: 'text', v: 'La dirección se produce en ' }, { t: 'em', v: 'asociaciones heterogéneas' }, { t: 'text', v: ' de personas, objetos, tecnologías y regulaciones ' }, { t: 'cite', refs: ['latour2008'] }, { t: 'text', v: ', una configuración ' }, { t: 'em', v: 'sociotécnica' }, { t: 'text', v: ' ' }, { t: 'cite', refs: ['landri2021'] }, { t: 'text', v: '. La ' }, { t: 'em', v: 'fabulación especulativa' }, { t: 'text', v: ' y el hacer-con ' }, { t: 'cite', refs: ['haraway2019'] }, { t: 'text', v: ', y la noción de ' }, { t: 'em', v: 'multiplicidades' }, { t: 'text', v: ' ' }, { t: 'cite', refs: ['deleuze1988'] }, { t: 'text', v: ', acompañan esa composición.' }],
    ] },
  { id: 7, title: 'Seis cuentos, seis universos', short: 'Los seis relatos',
    pages: [
      [{ t: 'text', v: 'Seis cuentos concretan la experimentación. Cada uno explora una tensión de la dirección escolar desde una perspectiva y una temporalidad distintas: la ' }, { t: 'em', v: 'performatividad' }, { t: 'text', v: ' y sus exigencias contradictorias ' }, { t: 'cite', refs: ['ball2003'] }, { t: 'text', v: ', las ' }, { t: 'em', v: 'múltiples capas' }, { t: 'text', v: ' del trabajo directivo ' }, { t: 'cite', refs: ['mifsud2021'] }, { t: 'text', v: ' o las ' }, { t: 'em', v: 'mediaciones sociomateriales' }, { t: 'text', v: ' ' }, { t: 'cite', refs: ['latour2008'] }, { t: 'text', v: '.' }],
      [{ t: 'text', v: 'Seleccioná un cuento para ver su atmósfera y el problema que permite interrogar.' }],
    ],
    storyPortal: true },
  { id: 8, title: 'Escribir también es investigar', short: 'Indagación postcualitativa',
    pages: [
      [{ t: 'text', v: 'Escribir un cuento modifica las relaciones entre los materiales, altera la importancia de ciertos elementos y produce preguntas que antes no tenían formulación. Por eso la escritura es un ' }, { t: 'em', v: 'método de indagación' }, { t: 'text', v: ': «writing is thinking, writing is analysis» ' }, { t: 'cite', refs: ['richardson2005'], label: '(Richardson & St. Pierre, 2005, p. 967)' }, { t: 'text', v: '.' }],
      [{ t: 'text', v: 'Es una ' }, { t: 'em', v: 'experimentación postcualitativa' }, { t: 'text', v: ' surgida de un problema concreto ' }, { t: 'cite', refs: ['stpierre2021a'] }, { t: 'text', v: ', atenta a la materialidad del lenguaje ' }, { t: 'cite', refs: ['maclure2013'] }, { t: 'text', v: '. Decidir qué narrar, qué cifrar con la elipsis y qué temporalidades superponer ya es ' }, { t: 'em', v: 'analizar' }, { t: 'text', v: '.' }],
    ] },
  { id: 9, title: 'Universos resonantes', short: 'Lectura y resonancias',
    pages: [
      [{ t: 'text', v: 'El sentido se produce en la interacción entre texto y lector, allí donde los vacíos convocan una ' }, { t: 'em', v: 'intervención activa' }, { t: 'text', v: ' ' }, { t: 'cite', refs: ['iser1987'] }, { t: 'text', v: '. La poética cognitiva permite seguir cómo la lectura construye ' }, { t: 'em', v: 'mundos textuales' }, { t: 'text', v: ' ' }, { t: 'cite', refs: ['stockwell2002'] }, { t: 'text', v: '.' }],
      [{ t: 'text', v: 'Esa apertura ocurre dentro de una organización textual que orienta las inferencias posibles ' }, { t: 'cite', refs: ['eco1990'] }, { t: 'text', v: '. Los cuentos abren así una discusión colectiva desde posiciones, experiencias y biografías sociales diferentes.' }],
    ] },
];

/* Descripciones verificadas contra el texto de cada cuento (PDF del libro). */
export const stories: Story[] = [
  { title: 'Ludismo neuronal',
    description: 'Una neurona recuerda la magia de conectarse entre muchas. Agotadas por urgencias, resoluciones y llamados fuera de horario, las neuronas inician un plan de lucha.',
    mood: 'Humor, cansancio y nostalgia: una huelga de neuronas contada con ironía.',
    problem: 'Urgencia, regulación y disponibilidad permanente: qué hace la sobrecarga normativa con el tiempo y el cuerpo de quien dirige.', ref: 'ball2003',
    image: './assets/stories/ilustraciones/ludismo-neuronal.svg', imageAlt: 'Ilustración del cuento Ludismo neuronal: una neurona luminosa con engranajes y un martillo' },
  { title: 'Diario de un hongo en la pared',
    description: 'Un hongo fosforescente habita la esquina de una oficina, observa a las personas que la usan y la irrupción nocturna de invasores, y se pregunta si es problema, proyecto, trabajo o veneno.',
    mood: 'Íntima e inquietante: la mirada de quien observa desde un rincón húmedo.',
    problem: 'Lo que la materialidad del espacio —humedad, grietas, paredes— muestra y mediatiza del trabajo directivo.', ref: 'latour2008',
    image: './assets/stories/ilustraciones/diario-de-un-hongo.svg', imageAlt: 'Ilustración del cuento Diario de un hongo en la pared' },
  { title: 'Puerta',
    description: 'La puerta de la dirección, interrogada por quienes pasan, permanece impasible mientras detrás de ella se tejen hipótesis y ficciones sobre lo que ocurre.',
    mood: 'Reflexiva y casi ensayística: una puerta que solo permanece y es interrogada.',
    problem: 'Umbral, permeabilidad y suposiciones: cómo una puerta organiza accesos, demandas y miradas sobre la dirección.', ref: 'latour2008',
    image: './assets/stories/ilustraciones/puerta.svg', imageAlt: 'Ilustración del cuento Puerta: una puerta de dirección con luz bajo el marco' },
  { title: 'Esto que existe',
    description: 'Iván tiene quince años y cursa el secundario vespertino. Un monstruo lo acecha; en la dirección lo acompañan la directora, un profesor y la preceptora.',
    mood: 'Tensa y angustiante: el barrio, el miedo y un monstruo que acecha.',
    problem: 'Cuidado y acompañamiento: qué hace la dirección cuando irrumpe en la oficina un sufrimiento que excede lo administrativo.',
    image: './assets/stories/ilustraciones/esto-que-existe.svg', imageAlt: 'Ilustración del cuento Esto que existe: un monstruo detrás de un pupitre' },
  { title: 'Mate lavado',
    description: 'Una directora ya jubilada siente en el cuerpo algo que no logra nombrar, hasta que reconoce el modo de estar todo el tiempo alerta que aprendió en la escuela.',
    mood: 'Cotidiana y corporal: memoria y alerta que se reconocen en el cuerpo.',
    problem: 'Capas sedimentadas de performatividad: la alerta constante que permanece en el cuerpo aun fuera del cargo.', ref: 'ball2003',
    image: './assets/stories/ilustraciones/mate-lavado.svg', imageAlt: 'Ilustración del cuento Mate lavado: mate, termo, llaves y reloj' },
  { title: 'La mujer de las granadas',
    description: 'Un pájaro que vuelve cada temporada observa desde un cable a una mujer de pelo rojo a quien los chicos llaman Profe, y a quienes regresan siendo adultos.',
    mood: 'Observadora y tierna: el tiempo visto desde un cable, de temporada en temporada.',
    problem: 'Permanencia y paso del tiempo: lo que persiste de una directora en los vínculos que atraviesan las temporadas.',
    image: './assets/stories/ilustraciones/la-mujer-de-las-granadas.svg', imageAlt: 'Ilustración del cuento La mujer de las granadas: granadas y un gorrión' },
];
