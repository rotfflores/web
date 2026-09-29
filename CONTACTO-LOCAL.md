# Contacto con adjuntos, versión local

## Prueba gratis de Día del Novio

El formulario destacado de `index.html` guarda solicitudes reales en el servicio de `https://api.rotfstudio.com/submit`, que alimenta el panel privado `https://api.rotfstudio.com/admin`. Esto también aplica al formulario alternativo `contacto.html?proyecto=dia-del-novio`.

Al ejecutar el servidor indicado abajo, la vista local envía estas solicitudes a `/api/trial`, que reenvía el JSON al mismo servicio. Necesita acceso a internet. Las solicitudes se identifican como **Día del Novio — Prueba gratis** e incluyen nombre, WhatsApp, correo opcional, pareja, comentarios y el enlace de referencia. No se guardan en `.local/contact-submissions`. El formulario solo muestra éxito cuando el servicio confirma `{ "ok": true }`.

## Formulario general con adjuntos

Ejecutar con Node.js 22 o posterior desde el proyecto:

```sh
node scripts/serve-contact-local.mjs
```

Abrir http://127.0.0.1:4173/contacto.html. Se pueden seleccionar y quitar hasta tres imágenes o videos (20 MB por archivo, 30 MB en total). Al enviar, la solicitud y los archivos se guardan en `.local/contact-submissions/<id>/`. No se mandan correos ni mensajes desde esta prueba local. La carpeta está excluida de Git y no se sirve por HTTP.

Las redes sociales del pie funcionan también al abrir `contacto.html` directamente. Los adjuntos necesitan el servidor local. Sin ese servidor, el formulario conserva el envío de texto original a `https://api.rotfstudio.com/submit` y no permite seleccionar archivos.

## Pendiente para producción

El receptor de adjuntos que está en `server/contact/worker.mjs` aún no se ha publicado en `api.rotfstudio.com`. Antes de habilitar adjuntos en producción hay que desplegarlo con sus enlaces a D1 y R2 y comprobar el acceso a los archivos desde el panel. El receptor local permite validar el flujo sin modificar ese servicio. El formulario de prueba gratis de Día del Novio sí usa la API de producción y no incluye adjuntos.
