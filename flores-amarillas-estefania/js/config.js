/* Para crear un nuevo pedido, edita solamente los valores de este archivo. */
const FLOWERS_CONFIG = {
  recipient: "Estefanía",
  sender: "Obed",
  memoryDate: "21 · 06 · 2025",
  relationshipStart: "2025-06-21",
  photoStripBack: "No importa cuántas fotos tengamos; siempre voy a querer guardar un momento más contigo.",
  dedication: "Hoy quiero regalarte flores amarillas porque haces que mis días sean más bonitos.",
  gardenMessage: "Estas flores son apenas un reflejo de toda la alegría que traes a mi vida. Gracias por hacer florecer mis días con tu presencia.",
  whatsappNumber: "", // Código de país + número, sin espacios. Ejemplo: 5215512345678
  gifts: [
    { title: "Una cita sorpresa", description: "Tú eliges el día, yo preparo todo.", whatsapp: "Hola, vengo a canjear mi cupón por una cita sorpresa 🌻💛" },
    { title: "Tu comida favorita", description: "Sin preguntas y con postre incluido.", whatsapp: "Hola, vengo a canjear mi cupón por mi comida favorita 🌻💛" },
    { title: "Una tarde juntos", description: "Película, abrazos y todo lo que tú elijas.", whatsapp: "Hola, vengo a canjear mi cupón por una tarde juntos 🌻💛" }
  ],
  letter: `A veces las palabras se quedan cortas, pero quería recordarte lo especial que eres para mí. Gracias por tu forma de iluminar los días sencillos, por cada sonrisa y por todos esos momentos que guardo con tanto cariño.\n\nQue estas flores sean una pequeña promesa: incluso en los días grises, siempre habrá un poquito de primavera esperándote.`,
  reasons: [
    "Porque haces más bonitos mis días.",
    "Porque tu sonrisa siempre consigue alegrarme.",
    "Porque contigo hasta los momentos sencillos se vuelven especiales.",
    "Porque eres paz, alegría y luz en mi vida.",
    "Porque simplemente siendo tú, ya me das todas las razones que necesito."
  ],
  galaxyPhrases: [
    "Mi sol", "Tu sonrisa", "Mi alegría", "Siempre tú", "Mi primavera",
    "Qué bonito coincidir", "Mi lugar favorito", "Contigo", "Tu luz", "Gracias por existir",
    "Mi flor amarilla", "Eres magia", "Mi calma", "Te quiero", "Nuestro universo",
    "Mi persona favorita", "Tu mirada", "Mi inspiración", "Qué suerte tenerte", "Mi refugio",
    "Tu forma de ser", "Mi mejor coincidencia", "Tu ternura", "Mi felicidad", "A tu lado",
    "Mi pensamiento bonito", "Tu corazón", "Mi motivo para sonreír", "Juntos", "Eres especial"
  ],
  photos: [
    { src: "assets/photos/pareja-1.jpg", text: "Donde la risa se vuelve nuestro lugar favorito.", alt: "Pareja disfrutando un momento especial al aire libre" },
    { src: "assets/photos/pareja-2.jpg", text: "Uno de esos instantes que quisiera guardar para siempre.", alt: "Pareja abrazándose durante una salida" },
    { src: "assets/photos/pareja-3.jpg", text: "Contigo, hasta el mundo parece detenerse.", alt: "Pareja compartiendo una tarde luminosa" },
    { src: "assets/photos/pareja-4.jpg", text: "Y todavía nos quedan muchos caminos por recorrer.", alt: "Pareja caminando junta en un entorno natural" }
    // Sustituye estas rutas por las fotografías del pedido cuando las recibas.
  ],
  song: "assets/music/flores.mp3?v=2",
  songTitle: "Flores Amarillas — Floricienta",
  colors: {
    cream: "#f8f1df",
    paper: "#fffdf7",
    pastel: "#f9dc76",
    sunflower: "#e9aa18",
    deep: "#654816",
    sage: "#7c8760"
  }
};
