/* Para crear un nuevo pedido, edita solamente los valores de este archivo. */
const FLOWERS_CONFIG = {
  recipient: "Yesenia Saldaña",
  sender: "Victoria",
  memoryDate: "21 · 09 · 2026",
  relationshipStart: "2025-06-21",
  photoStripBack: "No importa cuántas fotos tengamos; siempre voy a querer guardar un momento más contigo.",
  dedication: "Esta canción me hace pensar en ti.",
  gardenMessage: "",
  whatsappNumber: "525574483856", // Código de país + número, sin espacios. Ejemplo: 5215512345678
  gifts: [
    { title: "🌿 Un paseo por la naturaleza: Desierto de los Leones o algún lugar bonito que descubramos juntas.", description: "Tú eliges el día, yo preparo todo.", whatsapp: "Hola, vengo a canjear mi cupón por Un paseo por la naturaleza: Desierto de los Leones o algún lugar bonito que descubramos juntas. 🌻💛" },
    { title: "🎨 Un taller: tú eliges algo que quieras aprender y yo te acompaño en la aventura.", description: "Sin preguntas te acompaño.", whatsapp: "Hola, vengo a canjear mi cupón Un taller: tú eliges algo que quieras aprender y yo te acompaño en la aventura." },
    { title: "🎭 Una obra o evento de música: tú eliges… (aunque yo recomendaría Vivaldi en la Capilla Gótica del Helénico 😉).", description: "obras, abrazos y todo lo que tú elijas.", whatsapp: "Hola, vengo a canjear mi cupón por 🎭 Una obra o evento de música: tú eliges… (aunque yo recomendaría Vivaldi en la Capilla Gótica del Helénico 😉). 🌻💛" }
  ],
  letter: `A veces las palabras se quedan cortas, pero quería recordarte lo especial que eres para mí. Gracias por tu forma de iluminar los días sencillos, por cada sonrisa y por todos esos momentos que guardo con tanto cariño.\n\nQue estas flores sean una pequeña promesa: incluso en los días grises, siempre habrá un poquito de primavera esperándote.`,
  reasons: [
    "🌻 Porque sé que son tus flores favoritas y me encanta regalarte algo que sé que te hace feliz.",
    "🌻 Porque regalar es una de mis formas de decir “estoy pensando en ti”.",
    "🌻 Porque hay personas que inspiran detalles sin pedirlos… y tú eres una de ellas. 💛"
  ],
  galaxyPhrases: [
    "Coincidir ✨", "Miradas 👀", "Calma 🤍", "Risas", "Apapacho 🫶",
    "Café ☕", "Lluvia 🌧️", "Magia ✨", "Complicidad", "Tú y yo 💛", "Coincidir ✨", "Miradas 👀", "Calma 🤍", "Risas", "Apapacho 🫶",
    "Café ☕", "Lluvia 🌧️", "Magia ✨", "Complicidad", "Tú y yo 💛",
    "Coincidir ✨", "Miradas 👀", "Calma 🤍", "Risas", "Apapacho 🫶",
    "Café ☕", "Lluvia 🌧️", "Magia ✨", "Complicidad", "Tú y yo 💛",
  ],
  photos: [
    { src: "assets/photos/pareja-1.jpeg", text: "Donde las risas vuelven a nuestro lugar favorito.", alt: "compartiendo un momento juntos" },
    { src: "assets/photos/pareja-2.jpeg", text: "Uno de esos instantes que quisiera guardar para siempre.", alt: "Posando juntos" },
    { src: "assets/photos/pareja-3.jpeg", text: "Contigo, hasta el mundo parece detenerse.", alt: "" },
    { src: "assets/photos/pareja-4.jpeg", text: "Y todavia nos quedan muchos caminos por recorrer.", alt: "Por siempre" },
    { src: "assets/photos/pareja-5.jpeg", text: "Siempre estarás en mi corazón.", alt: "Besos por siempre" },
    { src: "assets/photos/pareja-6.jpeg", text: "Contigo, el tiempo se detiene.", alt: "Posando juntos" },
    { src: "assets/photos/pareja-7.jpeg", text: "Un momento perfecto en tu mundo.", alt: "Paseando juntos en un jardín" },
    { src: "assets/photos/pareja-8.jpeg", text: "7 de junio 26: coincidimos. 23 de junio: nuestra primera cita. Y desde entonces, muchos momentos que hoy ya son parte de nuestra historia. ✨ Gracias por estar en ella. 💛🌻", alt: "Compartiendo un momento juntos por la noche" },
    { src: "assets/photos/pareja-9.png", text: "7 de junio 26: coincidimos. 23 de junio: nuestra primera cita. Y desde entonces, muchos momentos que hoy ya son parte de nuestra historia. ✨ Gracias por estar en ella. 💛🌻", alt: "Posando juntos" }
    // Sustituye estas rutas por las fotografías del pedido cuando las recibas.
  ],
  song: "assets/music/flores.mp3?v=2",
  songTitle: "Mon Amour Remix — Zzoilo & Aitana",
  colors: {
    cream: "#f8f1df",
    paper: "#fffdf7",
    pastel: "#f9dc76",
    sunflower: "#e9aa18",
    deep: "#654816",
    sage: "#7c8760"
  }
};
