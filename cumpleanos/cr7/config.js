/* PERSONALIZA AQUÍ. Rutas relativas para funcionar con file:// y GitHub Pages.
   También puedes editar las tarjetas de recuerdos directamente en index.html.
   Después de editar el HTML, copia index.html a invitacion.html si usas esa entrada. */
window.INVITATION_CONFIG = {
  // Nombre, lugar y hora de ejemplo; cámbialos aquí por los datos definitivos.
  name: 'Alex', nickname: 'El Comandante', number: '7', position: 'LEYENDA', overall: 99,
  city: 'Durango, Dgo.', flag: '', photo: 'assets/photos/cr7-perfil.webp',
  age: 23,
  venue: 'Casa La Cancha',
  address: 'Calle Gol de Oro 23 · Durango, Dgo.',
  venueNote: 'Casa y dirección de ejemplo para esta invitación.',
  partyTime: '8:00 p. m.',
  arrivalTime: '7:30 p. m.',
  photoAlt: 'Cristiano Ronaldo con Portugal, imagen temática de la tarjeta',
  surpriseTitle: 'Él cree que es un plan cualquiera.',
  surpriseMessage: 'Llega antes de las 7:30, entra sin hacer ruido y no subas historias. Cuando llegue Alex, que nos encuentre a todos listos.',
  introVideo: 'assets/intro-cr7-loop.mp4', backgroundVideo: 'assets/invitacion-loop.mp4',
  stats: { Mentalidad: 99, Disciplina: 98, Lealtad: 100, Carisma: 97, Estilo: 99 },
  celebrationStat: 'SIUUU',
  statsMessage: 'Los números confirman lo que todos ya sabíamos: estamos frente a una leyenda.',
  // Opcional: { image: 'assets/recuerdo.jpg', title: 'Título', message: 'Texto' }.
  // Un objeto vacío conserva la imagen y los textos escritos en el HTML.
  memories: [
    { image: 'assets/photos/cr7-comienzo.webp' },
    { image: 'assets/photos/cr7-victorias.webp' },
    { image: 'assets/photos/cr7-recuerdos.webp' },
    { image: 'assets/photos/cr7-temporada.webp' },
    { image: 'assets/photos/cr7-futuro.webp' }
  ],
  trophies: [
    { title: 'Trofeo a la mejor actitud', message: 'Por encontrar una oportunidad para sonreír en cada partido de la vida.' },
    { title: 'Trofeo a la persona más divertida', message: 'Por convertir cualquier momento en una celebración.' },
    { title: 'Trofeo a los mejores recuerdos', message: 'Por todos los momentos que merecen repetición.' },
    { title: 'Balón de Oro por ser alguien increíble', message: 'Por jugar con el corazón y hacer mejor a tu equipo.' },
    { title: 'Champions por nunca rendirse', message: 'Por levantarte, volver a intentarlo y seguir creyendo.' }
  ],
  finalMessage: 'Alex, hoy celebramos tus 23 años. Los grandes jugadores ganan partidos, pero las grandes personas dejan recuerdos. Sigue avanzando con la mentalidad de una leyenda: trabajo, confianza y nunca rendirse.',
  finalMission: 'PRÓXIMA MISIÓN: SEGUIR HACIENDO HISTORIA.',
  // type: 'message', 'coupon', 'image' o 'video'. Para multimedia, completa src.
  reward: { type: 'message', title: 'Acceso al equipo secreto', message: '¡Estás dentro! Tu misión es ayudarnos a sorprender a nuestra leyenda. Guarda el secreto y prepárate para celebrar a lo grande.', src: '', code: 'LEYENDA23' },
  audio: {
    volume: 0.12,
    // Canción principal. El navegador intentará reproducirla al cargar y la
    // iniciará con el primer toque si su política bloquea el autoplay.
    music: 'assets/audio/el-fin-del-mundo.mp3',
    click: '', unlock: '', goal: '', celebration: ''
  }
};
