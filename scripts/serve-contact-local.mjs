import http from 'node:http';
import { createReadStream } from 'node:fs';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const storage = path.join(root, '.local', 'contact-submissions');
const port = Number(process.env.ROTF_CONTACT_PORT || 4173);
const maxBytes = 30 * 1024 * 1024;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.mp3': 'audio/mpeg' };
const json = (res, status, data) => { res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); };
const reject = (message) => { throw new Error(message); };
function extension(bytes, type) {
  if (type === 'image/png' && bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) return '.png';
  if (type === 'image/jpeg' && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return '.jpg';
  if (type === 'image/gif' && /^GIF8[79]a$/.test(bytes.toString('ascii', 0, 6))) return '.gif';
  if (type === 'image/webp' && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return '.webp';
  if (['video/mp4', 'video/quicktime'].includes(type) && bytes.toString('ascii', 4, 8) === 'ftyp') return type === 'video/mp4' ? '.mp4' : '.mov';
  if (type === 'video/webm' && bytes.subarray(0, 4).equals(Buffer.from('1a45dfa3', 'hex'))) return '.webm';
  reject('El archivo no coincide con un formato de imagen o video permitido.');
}

const server = http.createServer(async (req, res) => {
  try {
    const host = `127.0.0.1:${port}`;
    if (![host, `localhost:${port}`].includes(req.headers.host)) return json(res, 403, { error: 'Host no permitido.' });
    const url = new URL(req.url, `http://${host}`);
    if (url.pathname === '/api/contact-capabilities' && req.method === 'GET') return json(res, 200, { localContactUploads: true });
    if (url.pathname === '/api/contact' && req.method === 'POST') {
      if (req.headers.origin && ![`http://${host}`, `http://localhost:${port}`].includes(req.headers.origin)) return json(res, 403, { error: 'Origen no permitido.' });
      const contentType = req.headers['content-type'] || '';
      if (!contentType.startsWith('multipart/form-data;')) return json(res, 415, { error: 'Formato de solicitud no compatible.' });
      let size = 0;
      const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > maxBytes + 1024 * 1024) return json(res, 413, { error: 'La solicitud supera los 30 MB.' });
        chunks.push(chunk);
      }
      const body = await new Response(Buffer.concat(chunks), { headers: { 'Content-Type': contentType } }).formData();
      const payload = JSON.parse(body.get('payload'));
      if (!payload || typeof payload !== 'object') reject('Solicitud inválida.');
      const data = {};
      for (const key of ['name', 'email', 'phone', 'project', 'idealDate', 'message', 'website']) {
        if (payload[key] != null && typeof payload[key] !== 'string') reject('Datos inválidos.');
        data[key] = String(payload[key] || '').trim();
        if (data[key].length > 10000) reject('Uno de los campos es demasiado largo.');
      }
      if (data.website || !data.name || !data.phone || !data.project || !data.message) reject('Revisa los campos requeridos.');
      const files = body.getAll('attachments');
      if (files.length > 3 || files.some(file => typeof file === 'string' || !file.size || file.size > 20 * 1024 * 1024) || files.reduce((sum, file) => sum + file.size, 0) > maxBytes) reject('Máximo 3 archivos, 20 MB por archivo y 30 MB en total.');
      const attachments = [];
      for (const file of files) {
        const bytes = Buffer.from(await file.arrayBuffer());
        attachments.push({ name: path.basename(file.name), type: file.type, size: file.size, storedName: randomUUID() + extension(bytes, file.type), bytes });
      }
      const id = randomUUID();
      const directory = path.join(storage, id);
      await mkdir(directory, { recursive: true });
      for (const file of attachments) await writeFile(path.join(directory, file.storedName), file.bytes, { flag: 'wx' });
      await writeFile(path.join(directory, 'request.json'), JSON.stringify({ id, createdAt: new Date().toISOString(), ...data, attachments: attachments.map(({ bytes, ...file }) => file) }, null, 2), { flag: 'wx' });
      return json(res, 201, { success: true, id, attachmentCount: attachments.length });
    }
    if (!['GET', 'HEAD'].includes(req.method)) return json(res, 405, { error: 'Método no permitido.' });
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.split(/[\\/]/).some(part => part.startsWith('.')) || pathname.includes('\\')) return json(res, 404, { error: 'No encontrado.' });
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep)) return json(res, 404, { error: 'No encontrado.' });
    let info = await stat(file);
    if (info.isDirectory()) { file = path.join(file, 'index.html'); info = await stat(file); }
    const type = types[path.extname(file)];
    if (!type || !info.isFile()) return json(res, 404, { error: 'No encontrado.' });
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': info.size, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    if (req.method === 'HEAD') return res.end();
    createReadStream(file).on('error', () => res.destroy()).pipe(res);
  } catch (error) {
    if (!res.headersSent) json(res, error.code === 'ENOENT' ? 404 : 400, { error: error.code === 'ENOENT' ? 'No encontrado.' : error.message });
    else res.destroy();
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Contacto local: http://127.0.0.1:${port}/contacto.html\nSolicitudes: ${storage}`));
