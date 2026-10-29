export type RefKey = 'ball2003' | 'borges1974' | 'cortazar1971' | 'deleuze1988' | 'eco1990' | 'haraway1995' | 'haraway2019' | 'iser1987' | 'landri2021' | 'latour2008' | 'maclure2013' | 'mifsud2021' | 'niesche2013' | 'niesche2018' | 'piglia2000' | 'richardson2005' | 'stpierre2021a' | 'stpierre2021b' | 'stockwell2002';
export type Reference = { cite: string; full: string };
export type Ground = { concept: string; ref: RefKey };
export type Story = { title: string; description: string; problem: string; ref?: RefKey; image: string; imageAlt: string };
export type Portal = { id: number; title: string; short: string; description: string; notes: string; question?: string; concepts: string[]; ground: Ground[]; storyPortal?: boolean };

export const presentation = {
  title: 'El multiverso de la dirección escolar',
  subtitle: 'Coproducción narrativa de cuentos desde la investigación postcualitativa',
  authors: ['Marcela Victoria Gil', 'Elías Gonzalo Aguirre'],
  affiliations: 'Marcela V. Gil · EH-UNSAM  |  Elías Aguirre · LICH-EH-UNSAM / CONICET',
  meeting: 'IV Congreso Internacional de Ciencias Humanas · UNSAM · 4 al 6 de noviembre de 2026 · Mesa 20',
  book: 'Cuentos más-que-humanos sobre la dirección escolar',
  context: 'Investigación doctoral sobre prácticas de dirección escolar en tres escuelas secundarias del conurbano bonaerense (2021–2025).',
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
    description: 'Las prácticas de dirección están hechas de relaciones simultáneas, materialidades, afectos y temporalidades. Las miradas centradas en quien dirige resultan insuficientes para narrarlas.',
    question: '¿Cómo visibilizar una dirección hecha de relaciones simultáneas?',
    concepts: ['Prácticas ordinarias', 'Asociaciones heterogéneas', 'Centralidad del sujeto director', 'Multiplicidad de relaciones'],
    ground: [
      { concept: 'Leader centrism y múltiples capas', ref: 'mifsud2021' },
      { concept: 'Hegemonía del what works', ref: 'niesche2018' },
      { concept: 'Asociaciones y mediación de objetos', ref: 'latour2008' },
      { concept: 'Actor-red en la dirección', ref: 'landri2021' },
    ],
    notes: 'El trabajo nace de una encrucijada analítica en una investigación doctoral. Los discursos gerenciales y de liderazgo individual conviven con prácticas atravesadas por relaciones, regulaciones, espacios, tecnologías, cuerpos, alimentos y afectos. La pregunta no propone caricaturizar el liderazgo: busca narrar aquello que las categorías prescriptivas dejan fuera.' },
  { id: 2, title: 'De la investigación a la escritura', short: 'Del análisis a la escritura',
    description: 'La categorización permitió ordenar y comparar materiales, pero también separó relaciones que en la vida escolar se presentan a la vez. La escritura surgió como otra posibilidad de trabajo.',
    question: '¿Cómo mantener juntas relaciones que el análisis había separado?',
    concepts: ['INVESTIGACIÓN', 'CATEGORIZACIÓN', 'ESCRITURA'],
    ground: [
      { concept: 'Escritura como indagación', ref: 'richardson2005' },
      { concept: 'Materialidad del lenguaje', ref: 'maclure2013' },
    ],
    notes: 'Las categorías analíticas hicieron posible reconocer recurrencias, comparar y organizar materiales producidos durante años; también introdujeron cortes. Una llamada podía codificarse como interrupción administrativa aunque la escena involucrara una relación afectiva, un problema territorial, una urgencia institucional y una tecnología que extendía el espacio escolar. Los cuentos no formaban parte del diseño inicial: surgieron de un problema concreto de la investigación, cuando la dificultad para mantener juntas ciertas escenas comenzó a requerir otra forma de trabajo. La escritura no aparece como resultado automático de la codificación, sino como una posibilidad que emerge. El material etnográfico se menciona solo en la medida en que el argumento lo necesita.' },
  { id: 3, title: 'De la etnografía a la ficción', short: 'Composición ficcional',
    description: 'La composición ficcional transforma registros y experiencias mediante decisiones narrativas: condensa situaciones, modifica temporalidades, selecciona voces y reorganiza relaciones.',
    concepts: ['REGISTROS', 'EXPERIENCIAS', 'IMAGINACIÓN', 'COMPOSICIÓN FICCIONAL'],
    ground: [
      { concept: 'Prácticas analíticas creativas', ref: 'mifsud2021' },
      { concept: 'Crítica de la representación', ref: 'maclure2013' },
      { concept: 'Experimentación postcualitativa', ref: 'stpierre2021a' },
      { concept: 'Métodos predefinidos', ref: 'stpierre2021b' },
    ],
    notes: 'Los cuentos trabajan con materiales vinculados con situaciones observadas o recordadas, y su composición condensa escenas, modifica temporalidades, reúne elementos y selecciona voces. El vínculo con el trabajo empírico queda atravesado por decisiones narrativas. Fidelidad documental y productividad analítica remiten a criterios diferentes que conviven y entran en tensión dentro de una misma escritura. Explicitar qué se condensó, qué se reunió y qué resguardos se adoptaron forma parte del rigor.' },
  { id: 4, title: 'Escribir entre dos', short: 'Coproducción narrativa',
    description: 'Los cuentos surgieron del vínculo entre una directora participante y un investigador. La escritura conjunta reúne experiencias, recuerdos y decisiones narrativas sin borrar las diferencias entre sus posiciones.',
    concepts: ['Perspectivas parciales', 'Conocimientos situados', 'Acuerdos y divergencias', 'Hacer-con'],
    ground: [
      { concept: 'Conocimientos situados y perspectivas parciales', ref: 'haraway1995' },
      { concept: 'Simpoiesis y hacer-con', ref: 'haraway2019' },
    ],
    notes: 'La directora discute situaciones, incorpora memorias y modifica interpretaciones. Es una relación entre pares alrededor de una pregunta común, aunque las posiciones respecto de investigación, autoría y circulación siguen siendo distintas. La escritura conserva acuerdos, divergencias y tensiones. Las posiciones se encuentran sin confundirse.' },
  { id: 5, title: '¿Por qué cuentos?', short: 'Forma breve',
    description: 'El cuento concentra experiencias, sostiene tensiones, cifra segundas historias en la elipsis y permite trabajar con tiempos que se bifurcan.',
    concepts: ['JULIO CORTÁZAR', 'RICARDO PIGLIA', 'JORGE LUIS BORGES'],
    ground: [],
    notes: 'La ponencia recupera la concentración y la intensidad del cuento (Cortázar, 1971), la segunda historia que se cifra en los intersticios (Piglia, 2000) y la coexistencia de temporalidades en la imagen de los senderos que se bifurcan (Borges, 1974). La participación del lector aparece más adelante (Iser, 1987; Stockwell, 2002; Eco, 1990). La forma breve responde a un problema metodológico, no es un adorno.' },
  { id: 6, title: 'Una narrativa coral y multiespecies', short: 'Voces y presencias',
    description: 'Neurona, hongo, puerta, monstruo, mate y pájaros narran perspectivas que desplazan el centro humano. La dirección se hace con organismos, objetos, tecnologías y otras presencias.',
    concepts: ['NARRATIVA CORAL', 'MULTIPLICIDADES', 'PRESENCIAS MÁS-QUE-HUMANAS'],
    ground: [
      { concept: 'Fabulación especulativa y hacer-con', ref: 'haraway2019' },
      { concept: 'Asociaciones y mediaciones', ref: 'latour2008' },
      { concept: 'Perspectiva sociotécnica', ref: 'landri2021' },
      { concept: 'Multiplicidades', ref: 'deleuze1988' },
    ],
    notes: 'La nota de autoría cuenta que los relatos hicieron hablar a neuronas, un hongo, una puerta, un monstruo, un mate y pájaros para ensayar un descentramiento de la mirada humana. Conviene distinguir las presencias vivas (neuronas, hongo, pájaros) de los objetos (puerta, mate) y de otras presencias (monstruo, tecnologías, afectos). Las prácticas directivas se producen en asociaciones heterogéneas; la figura de quien dirige permanece relevante, pero no explica por sí sola la escena.' },
  { id: 7, title: 'Seis cuentos, seis universos', short: 'Mundos narrativos',
    description: 'Seis relatos exploran tensiones de las prácticas de dirección escolar desde perspectivas y temporalidades diferentes.',
    concepts: [],
    ground: [
      { concept: 'Performatividad', ref: 'ball2003' },
      { concept: 'Lectura de múltiples capas', ref: 'mifsud2021' },
      { concept: 'Mediaciones sociomateriales', ref: 'latour2008' },
    ],
    storyPortal: true,
    notes: 'Los seis cuentos del libro constituyen composiciones narrativas. Cada ficha indica qué tensión de la dirección escolar permite interrogar, sin revelar desenlaces. No se asigna un autor a cada cuento: las referencias orientan problemas, no clasifican relatos. Las ilustraciones de esta escena fueron compuestas para esta presentación; la tapa del libro ocupa el centro.' },
  { id: 8, title: 'Escribir también es investigar', short: 'Indagación postcualitativa',
    description: 'Al componer cuentos se transforman las relaciones entre materiales y experiencias, aparecen preguntas y se producen nuevas interpretaciones: la escritura participa de la producción de conocimiento.',
    concepts: ['ESCRIBIR ES PENSAR', 'ESCRIBIR ES ANALIZAR'],
    ground: [
      { concept: 'Escritura como método de indagación, p. 967', ref: 'richardson2005' },
      { concept: 'Experimentación postcualitativa', ref: 'stpierre2021a' },
      { concept: 'Lenguaje y materialidad', ref: 'maclure2013' },
    ],
    notes: '“Writing is thinking, writing is analysis” (Richardson & St. Pierre, 2005, p. 967): la cita está documentada en la ponencia. La investigación doctoral conserva su inscripción etnográfica; la coproducción de cuentos introduce una experimentación postcualitativa que transforma el vínculo entre registros, experiencias, conceptos y escritura. Las categorías no se descartan. La escritura no es una actividad posterior al análisis: decidir qué narrar, qué cifrar mediante la elipsis y qué temporalidades superponer es en sí mismo una operación analítica.' },
  { id: 9, title: 'Universos resonantes', short: 'Lecturas que expanden',
    description: 'La lectura recrea sentidos desde posiciones, experiencias y biografías sociales diferentes. Los relatos abren interpretaciones y discusión colectiva dentro de los límites que organiza cada texto.',
    concepts: ['LECTURA', 'MUNDOS TEXTUALES', 'INTERPRETACIONES', 'RESONANCIAS'],
    ground: [
      { concept: 'Interacción entre texto y lector', ref: 'iser1987' },
      { concept: 'Mundos textuales', ref: 'stockwell2002' },
      { concept: 'Apertura y organización textual', ref: 'eco1990' },
    ],
    notes: 'La lectura produce mundos textuales en el encuentro entre relato y lector. Los vacíos convocan interpretación, dentro de los límites que organiza cada texto: la apertura no equivale a ausencia de límites. Una misma escena puede abrir preguntas distintas según la experiencia y la posición de quien lee. Cerrar retomando que la narración deja hilos disponibles para nuevas lecturas colectivas.' },
];

/* Descripciones verificadas contra el texto de cada cuento (PDF del libro). */
export const stories: Story[] = [
  { title: 'Ludismo neuronal',
    description: 'Una neurona recuerda la magia de conectarse entre muchas. Agotadas por urgencias, resoluciones y llamados fuera de horario, las neuronas inician un plan de lucha.',
    problem: 'Urgencia, regulación y disponibilidad permanente: qué hace la sobrecarga normativa con el tiempo y el cuerpo de quien dirige.', ref: 'ball2003',
    image: './assets/stories/ilustraciones/ludismo-neuronal.svg', imageAlt: 'Ilustración del cuento Ludismo neuronal: una neurona luminosa con engranajes y un martillo' },
  { title: 'Diario de un hongo en la pared',
    description: 'Un hongo fosforescente habita la esquina de una oficina, observa a las personas que la usan y la irrupción nocturna de invasores, y se pregunta si es problema, proyecto, trabajo o veneno.',
    problem: 'Lo que la materialidad del espacio —humedad, grietas, paredes— muestra y mediatiza del trabajo directivo.', ref: 'latour2008',
    image: './assets/stories/ilustraciones/diario-de-un-hongo.svg', imageAlt: 'Ilustración del cuento Diario de un hongo en la pared' },
  { title: 'Puerta',
    description: 'La puerta de la dirección, interrogada por quienes pasan, permanece impasible mientras detrás de ella se tejen hipótesis y ficciones sobre lo que ocurre.',
    problem: 'Umbral, permeabilidad y suposiciones: cómo una puerta organiza accesos, demandas y miradas sobre la dirección.', ref: 'latour2008',
    image: './assets/stories/ilustraciones/puerta.svg', imageAlt: 'Ilustración del cuento Puerta: una puerta de dirección con luz bajo el marco' },
  { title: 'Esto que existe',
    description: 'Iván tiene quince años y cursa el secundario vespertino. Un monstruo lo acecha; en la dirección lo acompañan la directora, un profesor y la preceptora.',
    problem: 'Cuidado y acompañamiento: qué hace la dirección cuando irrumpe en la oficina un sufrimiento que excede lo administrativo.',
    image: './assets/stories/ilustraciones/esto-que-existe.svg', imageAlt: 'Ilustración del cuento Esto que existe: un monstruo detrás de un pupitre' },
  { title: 'Mate lavado',
    description: 'Una directora ya jubilada siente en el cuerpo algo que no logra nombrar, hasta que reconoce el modo de estar todo el tiempo alerta que aprendió en la escuela.',
    problem: 'Capas sedimentadas de performatividad: la alerta constante que permanece en el cuerpo aun fuera del cargo.', ref: 'ball2003',
    image: './assets/stories/ilustraciones/mate-lavado.svg', imageAlt: 'Ilustración del cuento Mate lavado: mate, termo, llaves y reloj' },
  { title: 'La mujer de las granadas',
    description: 'Un pájaro que vuelve cada temporada observa desde un cable a una mujer de pelo rojo a quien los chicos llaman Profe, y a quienes regresan siendo adultos.',
    problem: 'Permanencia y paso del tiempo: lo que persiste de una directora en los vínculos que atraviesan las temporadas.',
    image: './assets/stories/ilustraciones/la-mujer-de-las-granadas.svg', imageAlt: 'Ilustración del cuento La mujer de las granadas: granadas y un gorrión' },
];

export const motionSettings = { reducedMotion: false, starCount: 42 };
