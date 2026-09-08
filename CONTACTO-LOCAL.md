# Contacto con adjuntos, versión local

Ejecutar con Node.js 22 o posterior desde el proyecto:

```sh
node scripts/serve-contact-local.mjs
```

Abrir http://127.0.0.1:4173/contacto.html. Se pueden seleccionar y quitar hasta tres imágenes o videos (20 MB por archivo, 30 MB en total). Al enviar, la solicitud y los archivos se guardan en `.local/contact-submissions/<id>/`. No se mandan correos ni mensajes desde esta prueba local. La carpeta está excluida de Git y no se sirve por HTTP.

Las redes sociales del pie funcionan también al abrir `contacto.html` directamente. Los adjuntos necesitan el servidor local. Sin ese servidor, el formulario conserva el envío de texto original a `https://api.rotfstudio.com/submit` y no permite seleccionar archivos.

## Pendiente para producción

El código de `api.rotfstudio.com` no está disponible en este proyecto ni se encontró en la cuenta de Cloudflare conectada. Antes de publicar adjuntos se debe integrar un receptor multipart en ese servicio, almacenamiento persistente privado, límites y validación de archivos en el servidor, y acceso a los adjuntos desde el panel de solicitudes. No basta con publicar el selector de archivos. El receptor local permite validar el flujo y el formato de datos sin modificar producción.
