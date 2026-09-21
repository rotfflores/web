/* Para crear un nuevo pedido, edita solamente los valores de este archivo. */
const FLOWERS_CONFIG = {
  recipient: "Bobo",
  sender: "Obed y Rene",
  memoryDate: "21 · 09 · 2025",
  relationshipStart: "1999-01-11",
  photoStripBack: "No importa cuántas fotos tengamos; siempre vamos a querer guardar un momento más contigo.",
  dedication: "Hoy quiero regalarte flores amarillas porque haces que nuestros días sean más bonitos.",
  gardenMessage: "Estas flores son apenas un reflejo de toda la alegría que traes a nuestra vida. Gracias por hacer florecer nuestros días con tu presencia.",
  whatsappNumber: "526181169110", // Código de país + número, sin espacios. Ejemplo: 5215512345678
  gifts: [
    { title: "Una salida sorpresa", description: "Tú eliges el día, y mi pa prepara todo.", whatsapp: "Hola, vengo a canjear mi cupón por una salida sorpresa 🌻💛" },
    { title: "Tu comida favorita", description: "Sin preguntas y con papas incluidas.", whatsapp: "Hola, vengo a canjear mi cupón por mi comida favorita 🌻💛" },
    { title: "Una kindle", description: "Si te gustaria perro?.", whatsapp: "Hola, vengo a canjear mi cupón por una kindle 🌻💛" }
  ],
  letter: `A veces las palabras se quedan cortas, pero queriamos recordarte lo especial que eres para nosotros. Gracias por tu forma de iluminar los días sencillos, por cada sonrisa y por todos esos momentos que guardo con tanto cariño.\n\nQue estas flores sean una pequeña promesa: incluso en los días grises, siempre habrá un poquito de primavera esperándote. Por cierto, me haces los mandados`,
  reasons: [
    "Porque haces más bonitos nuestros días.",
    "Porque tu sonrisa siempre consigue alegrarme.",
    "Porque contigo hasta los momentos sencillos se vuelven especiales.",
    "Porque eres paz, alegría y luz en mi vida.",
    "Porque simplemente siendo tú, ya me das todas las razones que necesito."
  ],
  galaxyPhrases: [
    "Mi hija", "Mi hermana", "Mi tesoro", "Siempre tú", "Mi orgullo",
    "Qué suerte tenerte", "Mi compañera", "Tu sonrisa", "Mi inspiración", "Gracias por existir",
    "Mi niña", "Eres especial", "Mi calma", "Te quiero", "Nuestro vínculo",
    "Mi persona favorita", "Tu mirada", "Mi motivación", "Qué bonito coincidir", "Mi refugio",
    "Tu forma de ser", "Mi mejor regalo", "Tu ternura", "Mi felicidad", "A tu lado",
    "Mi pensamiento bonito", "Tu corazón", "Mi motivo para sonreír", "Juntos", "Eres única"
  ],
  photos: [
    { src: "assets/photos/pareja-1.jpeg", text: "Donde la risa se vuelve nuestro lugar favorito.", alt: "compartiendo un momento juntos por la noche" },
    { src: "assets/photos/pareja-2.jpeg", text: "Uno de esos instantes que quisiera guardar para siempre.", alt: "posando juntos" },
    { src: "assets/photos/pareja-3.jpeg", text: "Contigo.", alt: "junto a una mona" },
    { src: "assets/photos/pareja-4.jpeg", text: "Y todavía nos quedan muchos caminos por recorrer.", alt: "bobo posando" }
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
