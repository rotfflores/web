/* Para crear un nuevo pedido, edita solamente los valores de este archivo. */
const FLOWERS_CONFIG = {
  recipient: "Flor",
  sender: "Rene",
  memoryDate: "21 · 09 · 2026",
  relationshipStart: "1997-05-28",
  photoStripBack: "No importa cuántas fotos tengamos; siempre voy a querer guardar un momento más contigo.",
  dedication: "Hoy quiero regalarte flores amarillas porque haces que mis días sean más bonitos.",
  gardenMessage: "Estas flores son apenas un reflejo de toda la alegría que traes a mi vida. Gracias por hacer florecer mis días con tu presencia.",
  whatsappNumber: "526181169110", // Código de país + número, sin espacios. Ejemplo: 5215512345678
  gifts: [
    { title: "Una cita sorpresa", description: "Tú eliges el día, yo preparo todo.", whatsapp: "Hola, vengo a canjear mi cupón por una cita sorpresa 🌻💛" },
    { title: "Tu comida favorita", description: "Sin preguntas y con postre incluido.", whatsapp: "Hola, vengo a canjear mi cupón por mi comida favorita 🌻💛" },
    { title: "Una tarde juntos", description: "Película, abrazos y todo lo que tú elijas.", whatsapp: "Hola, vengo a canjear mi cupón por una tarde juntos 🌻💛" }
  ],
  letter: `A mi esposa, al amor de mi vida. 
  Hoy te regalo flores amarillas, pero ninguna flor alcanza para expresar lo que siento después de 32 años de conocerte y 29 de estar casados. 
  Desde que te conocí supe que eras la mujer con la que quería pasar mi vida. Hoy, después de tantos años, confirmo que aquella intuición fue correcta: eras tú. Siempre fuiste tú.
  Hemos vivido alegrías y dificultades, hemos reído y llorado, pero seguimos juntos. Y eso es lo más valioso. Porque el verdadero amor no es solo decir "te amo" cuando todo va bien, sino permanecer, apoyarse, perdonarse y seguir eligiéndose con el tiempo.
  Y yo te sigo eligiendo.
  Gracias por estos 29 años de matrimonio, por cada abrazo, cada palabra y cada momento compartido. Si pudiera volver al día en que te conocí, sabiendo todo lo que viviríamos, no cambiaría nada: me volvería a enamorar de ti.
  Mi amor, aún nos quedan muchos capítulos por escribir. Porque el amor no se mide por el tiempo juntos, sino por todas las veces que seguimos escogiendo a la misma persona.
  Y yo te escogería a ti una vez más. Y otra. Y otra.
  Te amo por lo que fuiste, por lo que eres y por todo lo que nos falta vivir.
  Feliz día de las flores amarillas, mi amor. 🌻❤️
  Con todo mi amor, tu esposo, René.`,
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
    { src: "assets/photos/pareja-1.jpeg", text: "Donde la risa se vuelve nuestro lugar favorito.", alt: "Flor y Rene compartiendo un momento juntos por la noche" },
    { src: "assets/photos/pareja-2.jpg", text: "Uno de esos instantes que quisiera guardar para siempre.", alt: "Flor y Rene posando juntos" },
    { src: "assets/photos/pareja-3.jpeg", text: "Contigo, hasta el mundo parece detenerse.", alt: "Flor y Rene junto a un lago" },
    { src: "assets/photos/pareja-4.jpeg", text: "Y todavía nos quedan muchos caminos por recorrer.", alt: "Flor y Rene paseando juntos en un jardín" }
    // Sustituye estas rutas por las fotografías del pedido cuando las recibas.
  ],
  song: "assets/music/flores.mp3?v=2",
  songTitle: "No sé tú — Luis Miguel",
  colors: {
    cream: "#f8f1df",
    paper: "#fffdf7",
    pastel: "#f9dc76",
    sunflower: "#e9aa18",
    deep: "#654816",
    sage: "#7c8760"
  }
};
