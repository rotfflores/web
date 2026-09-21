/* Para crear un nuevo pedido, edita solamente los valores de este archivo. */
const FLOWERS_CONFIG = {
  recipient: "Karla",
  sender: "Arnulfo",
  memoryDate: "21 · 09 · 2026",
  relationshipStart: "2025-03-12",
  photoStripBack: "No importa cuántas fotos tengamos; siempre voy a querer guardar un momento más contigo.",
  dedication: "Hoy quiero regalarte flores amarillas porque haces que mis días sean más bonitos.",
  gardenMessage: "Estas flores son apenas un reflejo de toda la alegría que traes a mi vida. Gracias por hacer florecer mis días con tu presencia.",
  whatsappNumber: "523320652572", // Código de país + número, sin espacios. Ejemplo: 5215512345678
  gifts: [
    { title: "Una cita sorpresa", description: "Tú eliges el día, yo preparo todo.", whatsapp: "Hola, vengo a canjear mi cupón por una cita sorpresa 🌻💛" },
    { title: "Tu comida favorita", description: "Sin preguntas y con postre incluido.", whatsapp: "Hola, vengo a canjear mi cupón por mi comida favorita 🌻💛" },
    { title: "Una tarde juntos", description: "Película, abrazos y todo lo que tú elijas.", whatsapp: "Hola, vengo a canjear mi cupón por una tarde juntos 🌻💛" }
  ],
  letter: `Feliz 21 de marzo.
  No soy muy bueno escribiendo cartas, pero quería hacer el intento porque hoy es un día para decir cosas que a veces uno no dice.
  Me gusta lo que tenemos. Me gusta que podamos hablar de cualquier cosa, que me entiendas sin que tenga que explicar mucho, y que estés ahí cuando te necesito. Eres una de esas personas que hacen que todo sea más fácil.
  No sé bien qué nombre tiene esto que somos, pero sé que me gusta. Me gusta compartir contigo, me gusta tu forma de ser y me gusta cómo me haces sentir.
  No te traje flores porque no alcancé, pero esta carta es mi versión de una flor amarilla: algo sencillo, hecho para ti, que espero te saque una sonrisa.
  Gracias por estar. Feliz día.`,
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
    { src: "assets/photos/pareja-1.jpeg", text: "Donde la risa se vuelve nuestro lugar favorito.", alt: "Posando en la graduación" },
    { src: "assets/photos/pareja-2.jpeg", text: "Uno de esos instantes que quisiera guardar para siempre.", alt: "Posando" },
    { src: "assets/photos/pareja-3.jpeg", text: "Contigo, hasta el mundo parece detenerse.", alt: "Karla sonriendo" },
    { src: "assets/photos/pareja-4.jpeg", text: "Y todavía nos quedan muchos caminos por recorrer.", alt: "Karla y arnulfo posando juntos" }
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
t