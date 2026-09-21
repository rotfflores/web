/* Para crear un nuevo pedido, edita solamente los valores de este archivo. */
const FLOWERS_CONFIG = {
  recipient: "Karen",
  sender: "Ilse",
  memoryDate: "21 · 09 · 2026",
  relationshipStart: "2021-11-22",
  photoStripBack: "No importa cuántas fotos tengamos; siempre voy a querer guardar un momento más contigo.",
  dedication: "Hoy quiero regalarte flores amarillas porque haces que mis días sean más bonitos.",
  gardenMessage: "Estas flores son apenas un reflejo de toda la alegría que traes a mi vida. Gracias por hacer florecer mis días con tu presencia.",
  whatsappNumber: "525585525240", // Código de país + número, sin espacios. Ejemplo: 5215512345678
  gifts: [
    { title: "Un Frappé + churros rellenos, en tu cafetería favorita.", description: "Tú eliges el día, yo preparo todo.", whatsapp: "Hola, vengo a canjear mi cupón por Un Frappé + churros rellenos, en mi cafetería favorita." },
    { title: "Competencias de videojuegos (Crash y futbol) pero apostando dinero de verdad. ", description: "Sin preguntas.", whatsapp: "Hola, vengo a canjear mi cupón por Competencias de videojuegos (Crash y futbol) pero apostando dinero de verdad. " },
    { title: "Ir al cine todo incluído, tus palomitas, refresco, nachos y la peli que quieras.", description: "Película, abrazos y todo lo que tú elijas.", whatsapp: "Hola, vengo a canjear mi cupón por Ir al cine todo incluído, mis palomitas, refresco, nachos y la peli que quiera." }
  ],
  letter: `Amor mío: 
  El tiempo que hemos pasado juntas se vuelve eterno, estás flores amarillas llegan a ti cómo una muestra del deseo por seguir compartiendo el presente y el futuro a tu lado, hicimos el compromiso de hacer de nuestro amor, algo bonito y duradero, lleno de esperanza  y con muchos planes aún por cumplir.
  Te amo muchísimo y te lo he dicho siempre, eres el amor de mi vida y que buena coincidencia la nuestra. 
  Con todo mi amor.
  Tu esposa`,
  reasons: [
    "Porque haces más bonitos mis días.",
    "Porque tu sonrisa siempre consigue alegrarme.",
    "Porque contigo hasta los momentos sencillos se vuelven especiales.",
    "Porque las flores amarillas, en especial los girasoles son parte de nuestra esencia.",
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
    { src: "assets/photos/pareja-1.jpeg", text: "Donde la risa se vuelve nuestro lugar favorito.", alt: "Compartiendo un momento juntas por la noche" },
    { src: "assets/photos/pareja-2.jpeg", text: "Uno de esos instantes que quisiera guardar para siempre.", alt: "Posando juntas" },
    { src: "assets/photos/pareja-3.jpeg", text: "Contigo, hasta el mundo parece detenerse.", alt: "Junto a un lago" },
    { src: "assets/photos/pareja-4.jpeg", text: "Y todavía nos quedan muchos caminos por recorrer.", alt: "Posando juntas" }
    // Sustituye estas rutas por las fotografías del pedido cuando las recibas.
  ],
  song: "assets/music/flores.mp3?v=2",
  songTitle: "Mi Persona Favorita — Río Roma",
  colors: {
    cream: "#f8f1df",
    paper: "#fffdf7",
    pastel: "#f9dc76",
    sunflower: "#e9aa18",
    deep: "#654816",
    sage: "#7c8760"
  }
};
