import panel from './panel.html';

const origins = new Set(['https://rotfstudio.com', 'https://www.rotfstudio.com', 'http://127.0.0.1:5501', 'http://localhost:5501', 'http://127.0.0.1:4173', 'http://localhost:4173']);
const MB = 1024 * 1024;
const privateHeaders = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex, nofollow' };
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...privateHeaders, ...headers } });
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
function cors(request) {
  const origin = request.headers.get('Origin');
  return origins.has(origin) ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' } : {};
}

// Bound the bytes actually read, including requests without Content-Length.
async function boundedBody(request, max) {
  if (Number(request.headers.get('content-length') || 0) > max) fail('La solicitud supera el tamaño permitido.', 413);
  if (!request.body) fail('Solicitud vacía.');
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) { await reader.cancel(); fail('La solicitud supera el tamaño permitido.', 413); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return new Blob(chunks, { type: request.headers.get('content-type') || '' });
}

export async function validateFile(file) {
  if (typeof file === 'string' || !file?.size || file.size > 20 * MB) fail('Máximo 20 MB por archivo.');
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const text = (a, b) => String.fromCharCode(...bytes.slice(a, b));
  const matches = (values) => values.every((v, i) => bytes[i] === v);
  const valid = {
    'image/png': matches([137,80,78,71,13,10,26,10]),
    'image/jpeg': matches([255,216,255]),
    'image/gif': /^GIF8[79]a$/.test(text(0,6)),
    'image/webp': text(0,4) === 'RIFF' && text(8,12) === 'WEBP',
    'video/mp4': text(4,8) === 'ftyp',
    'video/quicktime': text(4,8) === 'ftyp',
    'video/webm': matches([26,69,223,163])
  };
  if (valid[file.type] !== true) fail('El archivo no coincide con un formato de imagen o video permitido.');
}

const decode = value => Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')), c => c.charCodeAt(0));
// Verify Access signatures and the configured application audience, never trust
// a caller-supplied email header alone (workers.dev also reaches this Worker).
export async function authorized(request, env) {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return false;
  try {
    if (!/^[a-z0-9-]+\.cloudflareaccess\.com$/.test(env.ACCESS_TEAM_DOMAIN)) return false;
    const token = request.headers.get('Cf-Access-Jwt-Assertion') || '';
    const parts = token.split('.');
    if (parts.length !== 3 || token.length > 16000) return false;
    const head = JSON.parse(new TextDecoder().decode(decode(parts[0])));
    const claims = JSON.parse(new TextDecoder().decode(decode(parts[1])));
    const issuer = 'https://' + env.ACCESS_TEAM_DOMAIN;
    const now = Date.now()/1000;
    if (head.alg !== 'RS256' || claims.iss !== issuer || !Array.isArray(claims.aud) || !claims.aud.includes(env.ACCESS_AUD) || !Number.isFinite(claims.exp) || claims.exp <= now || (claims.nbf && claims.nbf > now + 30)) return false;
    const response = await fetch(issuer + '/cdn-cgi/access/certs');
    if (!response.ok) return false;
    const keys = await response.json();
    const jwk = keys.keys.find(key => key.kid === head.kid && key.kty === 'RSA');
    if (!jwk) return false;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    return await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decode(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
  } catch { return false; }
}

export async function submit(request, env) {
  const multipart = (request.headers.get('content-type') || '').startsWith('multipart/form-data;');
  const body = await boundedBody(request, multipart ? 31 * MB : 20000);
  let data, files = [];
  try {
    if (multipart) {
      const form = await new Response(body, { headers: { 'Content-Type': body.type } }).formData();
      const payload = form.get('payload');
      if (typeof payload !== 'string' || payload.length > 20000) fail('Datos inválidos.');
      data = JSON.parse(payload);
      files = form.getAll('attachments');
    } else { data = JSON.parse(await body.text()); }
  } catch { fail('Datos inválidos.'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) fail('Datos inválidos.');
  if (data.website) return { ok: true };
  const values = {};
  const limits = { name:120, email:160, phone:40, project:100, idealDate:80, message:3000 };
  for (const [key, limit] of Object.entries(limits)) {
    if (data[key] != null && typeof data[key] !== 'string') fail('Revisa los campos del formulario.');
    values[key] = (data[key] || '').trim();
    if (values[key].length > limit) fail('Revisa los campos del formulario.');
  }
  if (!values.name || !values.phone || !values.project || !values.message) fail('Revisa los campos del formulario.');
  if (files.length > 3 || files.reduce((sum, f) => sum + (f.size || 0), 0) > 30 * MB) fail('Máximo 3 archivos y 30 MB en total.');
  for (const file of files) await validateFile(file);
  if (files.length && (!env.ATTACHMENTS || !env.ACCESS_AUD || !env.ACCESS_TEAM_DOMAIN)) fail('El almacenamiento de archivos no está disponible. Intenta más tarde.', 503);
  const stored = [];
  try {
    for (const file of files) {
      const id = crypto.randomUUID();
      const key = 'contact/' + id;
      const name = file.name.split(/[\\/]/).pop().replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 180) || 'archivo';
      stored.push({ id, key, name, type:file.type, size:file.size });
      await env.ATTACHMENTS.put(key, file.stream(), { httpMetadata: { contentType:file.type } });
    }
    // D1 batch is transactional. last_insert_rowid is captured by the first
    // attachment; later rows refer to it rather than the changed rowid.
    const statements = [env.DB.prepare('INSERT INTO submissions (name,email,phone,project,ideal_date,message) VALUES (?,?,?,?,?,?)').bind(values.name,values.email,values.phone,values.project,values.idealDate,values.message)];
    stored.forEach((file, index) => statements.push(env.DB.prepare(index === 0
      ? 'INSERT INTO attachments (id,submission_id,object_key,name,type,size) VALUES (?,last_insert_rowid(),?,?,?,?)'
      : 'INSERT INTO attachments (id,submission_id,object_key,name,type,size) VALUES (?,(SELECT submission_id FROM attachments WHERE id=?),?,?,?,?)')
      .bind(...(index === 0 ? [file.id,file.key,file.name,file.type,file.size] : [file.id,stored[0].id,file.key,file.name,file.type,file.size]))));
    const results = await env.DB.batch(statements);
    return { ok:true, id:results[0].meta.last_row_id, attachmentCount:stored.length };
  } catch (error) {
    if (stored.length) await Promise.allSettled(stored.map(file => env.ATTACHMENTS.delete(file.key)));
    throw error;
  }
}

export default { async fetch(request, env) {
  const url = new URL(request.url);
  const headers = cors(request);
  try {
    if (request.method === 'OPTIONS') return new Response(null, { status:headers['Access-Control-Allow-Origin'] ? 204 : 403, headers });
    if (url.pathname === '/contact-capabilities' && request.method === 'GET') return json({ contactUploads:!!(env.ATTACHMENTS && env.ACCESS_AUD && env.ACCESS_TEAM_DOMAIN) }, 200, headers);
    if (url.pathname === '/submit' && request.method === 'POST') {
      if (!headers['Access-Control-Allow-Origin']) return json({ error:'Origen no permitido.' },403);
      return json(await submit(request, env),201,headers);
    }
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      if (!await authorized(request, env)) return json({ error:'No autorizado.' },401);
      if (request.method !== 'GET') return json({ error:'Método no permitido.' },405);
      if (url.pathname === '/admin' || url.pathname === '/admin/') return new Response(panel, { headers: { ...privateHeaders, 'Content-Type':'text/html; charset=utf-8' } });
      if (url.pathname === '/admin/submissions') {
        const { results } = await env.DB.prepare('SELECT id,name,email,phone,project,ideal_date,message,status,created_at FROM submissions ORDER BY id DESC LIMIT 500').all();
        const { results:files } = await env.DB.prepare('SELECT id,submission_id,name,type,size FROM attachments WHERE submission_id IN (SELECT id FROM submissions ORDER BY id DESC LIMIT 500)').all();
        const grouped = new Map();
        for (const file of files) { if (!grouped.has(file.submission_id)) grouped.set(file.submission_id,[]); grouped.get(file.submission_id).push(file); }
        return json({ ok:true, results:results.map(row => ({ ...row, attachments:grouped.get(row.id) || [] })) });
      }
      const match = url.pathname.match(/^\/admin\/attachments\/([0-9a-f-]{36})$/);
      if (match) {
        const file = await env.DB.prepare('SELECT object_key,name,type,size FROM attachments WHERE id=?').bind(match[1]).first();
        if (!file) return json({ error:'Archivo no encontrado.' },404);
        const object = await env.ATTACHMENTS.get(file.object_key, { range:request.headers });
        if (!object) return json({ error:'Archivo no encontrado.' },404);
        const responseHeaders = new Headers(privateHeaders);
        responseHeaders.set('Content-Type',file.type);
        responseHeaders.set('Accept-Ranges','bytes');
        const range = object.range;
        if (range && 'offset' in range && 'length' in range) {
          responseHeaders.set('Content-Range',`bytes ${range.offset}-${range.offset + range.length - 1}/${object.size}`);
          responseHeaders.set('Content-Length',String(range.length));
        } else responseHeaders.set('Content-Length',String(object.size));
        responseHeaders.set('Content-Disposition',(url.searchParams.get('download') === '1' ? 'attachment' : 'inline') + "; filename*=UTF-8''" + encodeURIComponent(file.name));
        return new Response(object.body,{ status:responseHeaders.has('Content-Range') ? 206 : 200, headers:responseHeaders });
      }
      return json({ error:'No encontrado.' },404);
    }
    return json({ ok:true, service:'ROTF Contact API' });
  } catch (error) {
    console.error(JSON.stringify({ event:'contact_error', status:error.status || 500 }));
    return json({ ok:false, error:error.status ? error.message : 'No pudimos guardar la solicitud. Intenta nuevamente.' },error.status || 500,headers);
  }
} };
