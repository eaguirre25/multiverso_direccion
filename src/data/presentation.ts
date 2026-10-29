export type Story = { title: string; description: string; image: string; imageAlt: string };
export type Portal = { id: number; title: string; short: string; description: string; notes: string; storyPortal?: boolean };

export const presentation = {
  title: 'El multiverso de la dirección escolar',
  subtitle: 'Coproducción narrativa de cuentos desde la investigación postcualitativa',
  authors: ['Marcela Victoria Gil', 'Elías Gonzalo Aguirre'],
  affiliations: 'Marcela V. Gil · EH-UNSAM  |  Elías Aguirre · LICH-EH-UNSAM / CONICET',
  meeting: '[Nombre del encuentro académico — editar]',
  book: 'Cuentos más-que-humanos sobre la dirección escolar',
  context: 'Investigación doctoral sobre prácticas de dirección escolar en tres escuelas secundarias del conurbano bonaerense (2021–2025).',
  references: [
    'Ball, S. J. (2003). The teacher’s soul and the terrors of performativity. Journal of Education Policy, 18(2), 215–228.',
    'Borges, J. L. (1974). El jardín de senderos que se bifurcan. En Obras completas 1923–1972 (pp. 472–480). Emecé.',
    'Cortázar, J. (1971). Algunos aspectos del cuento. Cuadernos Hispanoamericanos, 255, 403–416.',
    'Deleuze, G., & Guattari, F. (1988). Mil mesetas: Capitalismo y esquizofrenia. Pre-Textos.',
    'Eco, U. (1990). Obra abierta. Ariel.',
    'Haraway, D. J. (1995). Conocimientos situados. En Ciencia, cyborgs y mujeres (pp. 313–346). Cátedra.',
    'Haraway, D. J. (2019). Seguir con el problema. Consonni.',
    'Iser, W. (1987). El acto de leer: Teoría del efecto estético. Taurus.',
    'Landri, P. (2021). Educational leadership, management, and administration through actor-network theory. Routledge.',
    'Latour, B. (2008). Reensamblar lo social: Una introducción a la teoría del actor-red. Manantial.',
    'MacLure, M. (2013). Researching without representation? International Journal of Qualitative Studies in Education, 26(6), 658–667.',
    'Mifsud, D. (2021). Educational leadership research and creative analytic practices: A critical mapping of theoretical and methodological terrains? En D. Mifsud (Ed.), Narratives of educational leadership (pp. 1–20). Springer.',
    'Niesche, R. (2013). Foucault, counter-conduct and school leadership. Journal of Educational Administration and History, 45(2), 144–158.',
    'Niesche, R. (2018). Critical perspectives in educational leadership. Journal of Educational Administration and History, 50(3), 145–158.',
    'Piglia, R. (2000). Tesis sobre el cuento. En Formas breves (pp. 103–111). Anagrama.',
    'Richardson, L., & St. Pierre, E. A. (2005). Writing: A method of inquiry. En The SAGE handbook of qualitative research (3.ª ed., pp. 959–978). Sage.',
    'St. Pierre, E. A. (2021a). Post qualitative inquiry, the refusal of method, and the risk of the new. Qualitative Inquiry, 27(1), 3–9.',
    'St. Pierre, E. A. (2021b). Why post qualitative inquiry? Qualitative Inquiry, 27(2), 163–166.',
    'Stockwell, P. (2002). Cognitive poetics: An introduction. Routledge.',
  ],
};

export const portals: Portal[] = [
  { id: 1, title: '¿Cómo contar la dirección escolar?', short: 'Problema y narración', description: 'La ponencia pregunta cómo visibilizar prácticas de dirección hechas de relaciones simultáneas, sin dispersarlas ni reducirlas a una sola explicación.', notes: 'El trabajo nace de una encrucijada analítica en una investigación doctoral. Los discursos gerenciales y de liderazgo individual conviven con prácticas atravesadas por relaciones, regulaciones, espacios, tecnologías, cuerpos, alimentos y afectos. La pregunta no propone caricaturizar el liderazgo: busca narrar aquello que las categorías prescriptivas dejan fuera.' },
  { id: 2, title: 'Investigar el cotidiano escolar', short: 'Origen etnográfico', description: 'Tres escuelas secundarias del conurbano bonaerense, 2021–2025: una cotidianeidad donde las escenas rara vez ocurren aisladas.', notes: 'La ponencia parte de una inmersión etnográfica prolongada. Una entrevista, mensajes en un teléfono personal, una firma pendiente, la entrada de un estudiante y una urgencia del comedor pueden coexistir. Cada fragmento se codifica, pero la experiencia gana espesor en su simultaneidad.' },
  { id: 3, title: 'De la etnografía a la ficción', short: 'Desplazamientos narrativos', description: 'Los cuentos recomponen relaciones que la codificación había separado; no reproducen literalmente los hechos observados.', notes: 'Las categorías permitieron organizar y comparar años de materiales, aunque cada corte podía hacer menos visible parte de una escena. Los cuentos surgieron después, como una forma complementaria de reensamblar vínculos. La composición selecciona, reúne y modifica elementos; registro empírico y productividad analítica son criterios distintos que conviven.' },
  { id: 4, title: 'Escribir entre dos', short: 'Coproducción narrativa', description: 'Una directora participante y un investigador elaboran relatos desde experiencias, conversaciones, recuerdos y materiales de campo.', notes: 'La directora discute situaciones, incorpora memorias y modifica interpretaciones. Es una relación entre pares alrededor de una pregunta común, aunque las posiciones respecto de investigación, autoría y circulación siguen siendo distintas. La escritura conserva acuerdos, divergencias y tensiones.' },
  { id: 5, title: '¿Por qué cuentos?', short: 'Forma breve', description: 'Concentración, intensidad, elipsis y tiempos que se bifurcan sostienen escenas abiertas a la lectura.', notes: 'La ponencia recupera la concentración y la intensidad del cuento (Cortázar), la segunda historia que se cifra en los intersticios (Piglia), la coexistencia de temporalidades (Borges) y la participación del lector en la producción de sentido (Iser, Stockwell, Eco). La forma breve responde a un problema metodológico, no es un adorno.' },
  { id: 6, title: 'Narrativa coral y multiespecies', short: 'Voces y presencias', description: 'Neurona, hongo, puerta, monstruo, mate y pájaros narran perspectivas que desplazan el centro humano.', notes: 'La nota de autoría cuenta que los relatos hicieron hablar a neuronas, un hongo, una puerta, un monstruo, un mate y pájaros para ensayar un descentramiento de la mirada humana. Distinguir las especies vivas de objetos y otras materialidades. Las prácticas directivas se producen en asociaciones heterogéneas; la figura de quien dirige permanece relevante, pero no explica por sí sola la escena.' },
  { id: 7, title: 'Seis cuentos, seis universos', short: 'Mundos narrativos', description: 'Seis relatos reúnen distintas perspectivas, ritmos y nudos de la vida escolar.', notes: 'La maqueta del libro contiene los seis cuentos completos y sus ilustraciones. En esta escena se ofrece una ficha breve por relato, sin revelar desenlaces. La imagen de multiverso indicada en el prompt no aparece como lámina única en los archivos; las ilustraciones de cada cuento sí fueron extraídas y quedan disponibles como recursos locales.', storyPortal: true },
  { id: 8, title: 'Escribir también es investigar', short: 'Indagación postcualitativa', description: 'La escritura modifica las relaciones entre materiales, cambia su importancia y produce preguntas nuevas.', notes: 'La investigación doctoral conserva su inscripción etnográfica; la coproducción de cuentos introduce una experimentación postcualitativa que transforma el vínculo entre registros, experiencias, conceptos y escritura. “Writing is thinking, writing is analysis” (Richardson & St. Pierre, 2005, p. 967): la cita está documentada en la ponencia. Las categorías no se descartan; se ensaya otra práctica analítica complementaria.' },
  { id: 9, title: 'Universos resonantes', short: 'Lecturas que expanden', description: 'Quienes leen recrean los sentidos desde sus posiciones y llevan los cuentos a la discusión colectiva.', notes: 'La lectura produce mundos textuales en el encuentro entre relato y lector. Los vacíos convocan interpretación, dentro de los límites que organiza cada texto. Una misma escena puede abrir preguntas distintas según la experiencia y la posición de quien lee. Cerrar retomando que la narración deja hilos disponibles para nuevas lecturas colectivas.' },
];

export const stories: Story[] = [
  { title: 'Ludismo neuronal', description: 'Una neurona recuerda el trabajo de las conexiones y se suma a una asamblea que busca interrumpir la maquinaria cerebral que funciona sin descanso.', image: './assets/stories/ilustraciones/ludismo-neuronal.svg', imageAlt: 'Ilustración del cuento Ludismo neuronal' },
  { title: 'Diario de un hongo en la pared', description: 'Desde la pared de la oficina, un hongo observa reuniones con docentes, supervisores, estudiantes y familias, junto con escenas de violencia y saqueo que atraviesan la escuela.', image: './assets/stories/ilustraciones/diario-de-un-hongo.svg', imageAlt: 'Ilustración del cuento Diario de un hongo en la pared' },
  { title: 'Puerta', description: 'La puerta de dirección observa el umbral entre lo que ocurre dentro y fuera, y las ficciones que se imaginan detrás de ella.', image: './assets/stories/ilustraciones/puerta.svg', imageAlt: 'Ilustración del cuento Puerta' },
  { title: 'Esto que existe', description: 'Iván cursa el secundario vespertino entre condiciones precarias, interrupciones y regresos; en la escuela encuentra adultos que lo acompañan y un monstruo que forma parte de su experiencia.', image: './assets/stories/ilustraciones/esto-que-existe.svg', imageAlt: 'Ilustración del cuento Esto que existe' },
  { title: 'Mate lavado', description: 'Una directora jubilada percibe en el cuerpo y la memoria las marcas de años de trabajo, alerta constante y dificultad para dejar la escuela atrás.', image: './assets/stories/ilustraciones/mate-lavado.svg', imageAlt: 'Ilustración del cuento Mate lavado' },
  { title: 'La mujer de las granadas', description: 'Un ave observa a una directora, los vínculos con estudiantes que regresan y el paso de las temporadas alrededor de la escuela.', image: './assets/stories/ilustraciones/la-mujer-de-las-granadas.svg', imageAlt: 'Ilustración del cuento La mujer de las granadas' },
];

export const motionSettings = { reducedMotion: false, starCount: 42 };
