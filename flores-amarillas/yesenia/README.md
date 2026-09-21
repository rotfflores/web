# Flores amarillas — regalo digital

Una experiencia romántica, móvil y personalizable para regalar el 21 de septiembre. Está hecha únicamente con HTML, CSS y JavaScript, sin dependencias, y funciona en GitHub Pages.

La presentación utiliza un formato de stories inspirado en experiencias como Spotify Wrapped: una sola tarjeta ocupa toda la pantalla y las demás permanecen ocultas. Se avanza con el botón inferior, los indicadores superiores, un gesto horizontal o las flechas del teclado.

## Crear un nuevo pedido

Edita solamente `js/config.js`. Ahí puedes cambiar:

- `recipient`: nombre de quien recibe.
- `sender`: nombre de quien envía.
- `dedication`: mensaje principal.
- `gardenMessage`: dedicatoria de la escena donde crecen las flores.
- `gifts`: los tres premios, sus descripciones y el mensaje para canjear cada uno.
- `whatsappNumber`: número de quien envía, con código de país y sin espacios.
- `letter`: carta completa. Usa saltos de línea dentro de las comillas invertidas.
- `reasons`: hasta cinco razones.
- `galaxyPhrases`: mensajes que orbitan en el jardín interactivo.
- `photos`: hasta cinco fotografías, con ruta, texto y descripción alternativa.
- `song`: ruta del archivo de audio.
- `songTitle`: nombre corto mostrado junto al reproductor final.
- `colors`: paleta completa de la experiencia.

No hace falta modificar `index.html`.

La elección del regalo se guarda en el navegador. Para probar nuevamente las tres cajas durante la personalización, elimina el almacenamiento local del sitio desde las herramientas del navegador.

## Fotografías

1. Copia las imágenes a `assets/photos/`.
2. Para una carga rápida, se recomienda WebP o JPG, entre 900 y 1400 px de ancho y menos de 500 KB por foto.
3. Agrégalas a `photos` en `js/config.js`:

```js
{ src: "assets/photos/foto-1.webp", text: "Nuestro día favorito.", alt: "Descripción de la fotografía" }
```

La galería admite entre una y cinco fotos. Si dejas `photos: []`, la sección se oculta automáticamente.

## Jardín interactivo

La sección “Todo un universo florece para ti” está inspirada en una galaxia romántica, pero utiliza un lienzo ligero hecho con JavaScript puro. En celular se puede explorar con un dedo y acercar o alejar juntando dos dedos. El movimiento conserva inercia y los mensajes pasan delante y detrás de la flor. Sus textos se editan en `galaxyPhrases` dentro de `js/config.js`; no requiere Three.js ni conexión a servicios externos.

La escena “Mira cómo florece este detalle” integra el jardín animado del proyecto de referencia. Se carga solamente cuando está cerca de aparecer en pantalla para no hacer lenta la apertura. Su mensaje se personaliza con `gardenMessage`.

## Música

Coloca la canción en `assets/music/` y cambia `song` en `js/config.js`. Se recomienda MP3 o M4A comprimido. Por las políticas de los navegadores, la música empieza únicamente después de tocar “Ábrelas”. Si aún no agregas un archivo, la página sigue funcionando y el control indica que debes añadir la canción.

> Antes de vender o publicar, asegúrate de contar con permiso para usar las fotografías y la canción.

## Ver la página localmente

Abrir el archivo directamente puede funcionar, pero un servidor local reproduce mejor el comportamiento de GitHub Pages. Desde esta carpeta ejecuta uno de estos comandos:

```bash
python -m http.server 8000
```

Después visita `http://localhost:8000`.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube todos los archivos conservando la estructura.
2. En el repositorio abre **Settings → Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**.
4. Selecciona la rama `main`, la carpeta `/ (root)` y guarda.
5. GitHub mostrará la dirección pública cuando termine la publicación.

Todas las rutas son relativas, por lo que el sitio funciona tanto en la raíz como dentro de un repositorio de proyecto.

## Estructura

```text
index.html
css/styles.css
js/config.js
js/script.js
assets/images/ramo-girasoles.png
assets/photos/
assets/music/flores.mp3
assets/garden/
```

Los archivos `.gitkeep` mantienen las carpetas vacías en Git hasta que agregues tus fotos y música.
