# Invitación CR7 · Birthday Edition

## Abrir
- Abre `index.html` con tu navegador y presiona START. No requiere instalar nada.
- `invitacion.html` es una segunda entrada equivalente, conservada para el enlace anterior.
- Para GitHub Pages, sube el contenido del ZIP a la raíz del repositorio. Conserva los nombres y las carpetas.
- Las fuentes de Google son gratuitas y opcionales: sin internet se usan las fuentes locales de respaldo. El contenido y los juegos funcionan sin conexión.

## Personalizar
Edita `config.js`: nombre, apodo, ciudad, bandera (imagen), fotografía, nivel, número, posición, estadísticas, videos, música, trofeos, carta y recompensa.

Los recuerdos también se editan directamente en `index.html`, dentro de los cinco artículos con clase `memory`: cambia la ruta `src`, el texto alternativo `alt`, el título `h3` y el mensaje `p`. Los valores no vacíos en `config.js` tienen prioridad. Si editas el HTML, copia después `index.html` sobre `invitacion.html` para mantener las dos entradas iguales.

Las fotos actuales son imágenes temáticas de Cristiano Ronaldo. Puedes sustituirlas por fotos del festejado, preferiblemente JPG o WebP comprimidos. La imagen de perfil funciona mejor en vertical y los recuerdos en horizontal.

## Sonido
La música empieza únicamente al tocar START. El control flotante silencia música y efectos. Por defecto se generan una melodía ambiental y efectos con Web Audio, sin archivos externos.

Para usar audio propio, coloca los MP3 en `assets/audio/` y configura las rutas correspondientes en `config.js`:
- music: música de fondo (se repite), volumen inicial 0.12.
- click: botones.
- unlock: recuerdos y premios.
- goal: gol.
- celebration: celebración final (puedes colocar tu audio de SIUUU).

Si una ruta no está disponible, se usa el sonido generado. Los videos de fondo permanecen silenciados.

## Recompensa
`reward.type` admite `message`, `coupon`, `image` o `video`.
- `title` y `message`: texto de la recompensa.
- `src`: archivo local para imagen o video.
- `code`: texto del cupón.
El botón de recompensa aparece tras marcar un gol.

## Funcionamiento
- START anima la entrada, sin recargar la página ni interrumpir la música.
- Cada sección tiene regreso al menú. Escape también vuelve al menú; en ventanas emergentes, Escape las cierra.
- Los recuerdos y premios mantienen su estado durante la sesión. Al recargar comienzan bloqueados.
- El portero elige aleatoriamente izquierda, centro o derecha. Direcciones distintas = gol.
- La carta final tiene una pantalla previa de “MODO HISTORIA COMPLETADO” y se puede visitar desde el menú en cualquier momento.
- El botón CELEBRAR muestra SIUUUUU y reproduce una fanfarria corta. El confeti y las animaciones se omiten si el dispositivo solicita movimiento reducido.
- Puedes pausar el fondo desde el pie de página.

## Archivos
- index.html / invitacion.html: estructura semántica y recuerdos editables.
- styles.css: diseño responsive, variables de color y animaciones.
- config.js: contenido personalizable.
- script.js: navegación, audio, tarjetas y minijuego.
- assets/: videos recortados, posters, placeholders y carpeta de audio.

## Versiones anteriores
En el proyecto de trabajo, `versions/hub-clasico/` guarda el diseño anterior completo. Las versiones anteriores no se incluyen en el ZIP final.

## Fotos y fiesta sorpresa
La tarjeta y los cinco niveles incluyen fotografías temáticas reales de Cristiano Ronaldo, guardadas en `assets/photos/` y optimizadas a WebP. Las fuentes, autores y licencias están en `creditos.html`, accesible desde el pie de página. No son fotos personales del festejado: sustitúyelas cuando tengas las tuyas.

Los avisos de sorpresa se editan con `surpriseTitle` y `surpriseMessage` en `config.js`. El menú, la recompensa y el mensaje final recuerdan guardar el secreto. El nombre del festejado sigue siendo personalizable.

## Edición 23
Se usa Alex / El Comandante como nombre de ejemplo. La casa y dirección son ficticias en Durango; la hora de fiesta (8:00 p. m.) y llegada (7:30 p. m.) son provisionales. Todos se editan en config.js. No se ha fijado una fecha.
