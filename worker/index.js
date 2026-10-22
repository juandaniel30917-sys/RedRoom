/* REDROOM · Worker
   - Sirve la web estática (carpeta del repo) tal cual.
   - /data/contenido.js  → el contenido publicado desde el panel (guardado en Cloudflare KV).
   - /media/*            → imágenes subidas desde el panel.
   - /admin/api/*        → API del panel. Solo responde a personas que entraron por Cloudflare Access.
   Variables (wrangler.jsonc → vars): TEAM_DOMAIN (https://EQUIPO.cloudflareaccess.com) y POLICY_AUD (AUD de la aplicación de Access). */

const HIST_MAX = 40;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const p = url.pathname;
    try {
      if (p === "/data/contenido.js") { return contenidoJs(request, env); }
      if (p.startsWith("/media/")) { return media(p.slice(7), env); }
      if (p.startsWith("/admin/api/")) { return api(request, env, p.slice(11)); }
    } catch (e) {
      return json({ error: "Error interno: " + (e && e.message || e) }, 500);
    }
    return env.ASSETS.fetch(request);
  }
};

/* ---------- Público ---------- */
async function contenidoJs(request, env) {
  const saved = await env.RR_KV.get("contenido");
  if (!saved) { return env.ASSETS.fetch(request); }
  return new Response("window.RR_DATA = " + saved + ";\n", {
    headers: { "content-type": "text/javascript; charset=utf-8", "cache-control": "no-cache" }
  });
}
async function media(name, env) {
  if (!/^[\w.-]+$/.test(name)) { return new Response("No encontrado", { status: 404 }); }
  const r = await env.RR_KV.getWithMetadata("media:" + name, { type: "arrayBuffer" });
  if (!r.value) { return new Response("No encontrado", { status: 404 }); }
  return new Response(r.value, { headers: { "content-type": (r.metadata && r.metadata.type) || "application/octet-stream", "cache-control": "public, max-age=31536000, immutable" } });
}

/* ---------- API del panel ---------- */
async function api(request, env, route) {
  const who = await verifyAccess(request, env);
  if (!who.ok) { return json({ error: who.error, code: who.code }, who.status); }
  const email = who.email, m = request.method;

  if (route === "sesion" && m === "GET") { return json({ email }); }

  if (route === "contenido" && m === "GET") {
    const data = await leerContenido(request, env);
    const ver = +(await env.RR_KV.get("contenido:ver")) || 0;
    return json({ data, ver });
  }

  if (route === "contenido" && m === "PUT") {
    const body = await request.json();
    if (!body || !body.data || !body.data.paginas || !body.data.sitio) { return json({ error: "Contenido inválido." }, 400); }
    const ver = +(await env.RR_KV.get("contenido:ver")) || 0;
    if (!body.forzar && +body.base !== ver) { return json({ error: "Alguien publicó otra versión mientras editabas.", code: "CONFLICT", ver }, 409); }
    const texto = JSON.stringify(body.data, null, 1);
    if (texto.length > 20 * 1024 * 1024) { return json({ error: "El contenido es demasiado grande." }, 413); }
    const nuevo = ver + 1, ts = Date.now();
    await env.RR_KV.put("hist:" + nuevo, JSON.stringify({ data: body.data, email, mensaje: String(body.mensaje || "").slice(0, 200), ts }));
    const idx = JSON.parse((await env.RR_KV.get("hist:index")) || "[]");
    idx.unshift({ v: nuevo, ts, email, mensaje: String(body.mensaje || "").slice(0, 200) });
    for (const old of idx.splice(HIST_MAX)) { await env.RR_KV.delete("hist:" + old.v); }
    await env.RR_KV.put("hist:index", JSON.stringify(idx));
    await env.RR_KV.put("contenido", texto);
    await env.RR_KV.put("contenido:ver", String(nuevo));
    return json({ ok: true, ver: nuevo });
  }

  if (route === "historial" && m === "GET") {
    return json({ items: JSON.parse((await env.RR_KV.get("hist:index")) || "[]") });
  }
  const hm = route.match(/^historial\/(\d+)$/);
  if (hm && m === "GET") {
    const h = await env.RR_KV.get("hist:" + hm[1]);
    return h ? json(JSON.parse(h)) : json({ error: "Esa versión ya no existe." }, 404);
  }

  if (route === "subir" && m === "POST") {
    const type = request.headers.get("content-type") || "";
    if (!/^image\/(jpeg|png|webp|gif|svg\+xml|avif)$/.test(type)) { return json({ error: "Solo se aceptan imágenes." }, 415); }
    const buf = await request.arrayBuffer();
    if (buf.byteLength > 20 * 1024 * 1024) { return json({ error: "La imagen pesa más de 20 MB." }, 413); }
    const base = (request.headers.get("x-nombre") || "imagen").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "imagen";
    const ext = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg", "image/avif": "avif" }[type];
    const name = new Date().toISOString().slice(0, 10) + "-" + base + "-" + crypto.randomUUID().slice(0, 6) + "." + ext;
    await env.RR_KV.put("media:" + name, buf, { metadata: { type, email, ts: Date.now() } });
    return json({ path: "media/" + name });
  }

  return json({ error: "Ruta no encontrada." }, 404);
}

async function leerContenido(request, env) {
  const saved = await env.RR_KV.get("contenido");
  if (saved) { return JSON.parse(saved); }
  /* primera vez: se parte del data/contenido.js del repositorio */
  const r = await env.ASSETS.fetch(new Request(new URL("/data/contenido.js", request.url)));
  const src = await r.text(), m = /^window\.RR_DATA\s*=/m.exec(src);
  return JSON.parse(src.slice(m.index + m[0].length).trim().replace(/;\s*$/, ""));
}

function json(o, status) {
  return new Response(JSON.stringify(o), { status: status || 200, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}

/* ---------- Verificación de Cloudflare Access (JWT RS256) ---------- */
let jwksCache = null, jwksAt = 0;
async function verifyAccess(request, env) {
  const team = String(env.TEAM_DOMAIN || "").replace(/\/$/, ""), aud = String(env.POLICY_AUD || "").trim();
  if (!team || !aud) { return { ok: false, status: 503, code: "NO_CONFIG", error: "El panel aún no está conectado a Cloudflare Access (faltan TEAM_DOMAIN y POLICY_AUD)." }; }
  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) { return { ok: false, status: 401, code: "NO_LOGIN", error: "Debes entrar con tu correo autorizado." }; }
  try {
    const [h64, p64, s64] = token.split(".");
    const header = JSON.parse(b64urlText(h64)), payload = JSON.parse(b64urlText(p64));
    if (header.alg !== "RS256") { throw new Error("alg"); }
    const now = Math.floor(Date.now() / 1000);
    if (payload.iss !== team) { throw new Error("iss"); }
    const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (auds.indexOf(aud) < 0) { throw new Error("aud"); }
    if (!payload.exp || payload.exp < now - 30) { throw new Error("exp"); }
    if (payload.nbf && payload.nbf > now + 30) { throw new Error("nbf"); }
    let keys = await getKeys(team, false), jwk = keys.find(k => k.kid === header.kid);
    if (!jwk) { keys = await getKeys(team, true); jwk = keys.find(k => k.kid === header.kid); }
    if (!jwk) { throw new Error("kid"); }
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlBytes(s64), new TextEncoder().encode(h64 + "." + p64));
    if (!ok) { throw new Error("firma"); }
    return { ok: true, email: payload.email || payload.common_name || "desconocido" };
  } catch (e) {
    return { ok: false, status: 403, code: "BAD_TOKEN", error: "Tu sesión no es válida. Vuelve a entrar." };
  }
}
async function getKeys(team, force) {
  if (!force && jwksCache && Date.now() - jwksAt < 3600e3) { return jwksCache; }
  const r = await fetch(team + "/cdn-cgi/access/certs");
  const j = await r.json(); jwksCache = j.keys || []; jwksAt = Date.now();
  return jwksCache;
}
function b64urlBytes(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) { s += "="; } const bin = atob(s), out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) { out[i] = bin.charCodeAt(i); } return out; }
function b64urlText(s) { return new TextDecoder().decode(b64urlBytes(s)); }
