/* REDROOM - sitio estático.
   Todo el contenido (textos, portafolio, mapa, colores, menú, contacto) vive en data/contenido.js
   y se edita desde el panel /admin. Este archivo solo dibuja la web a partir de esos datos. */

/* ---- Datos: contenido publicado, o el borrador del panel en modo vista previa ---- */
var D = (function () {
  var data = window.RR_DATA || {};
  try {
    var q = new URLSearchParams(location.search);
    if (q.get("vista-previa") === "1") { sessionStorage.setItem("rr_preview", "1"); }
    if (q.get("vista-previa") === "0") { sessionStorage.removeItem("rr_preview"); }
    if (sessionStorage.getItem("rr_preview") === "1") {
      var b = localStorage.getItem("rr_borrador");
      if (b) { data = JSON.parse(b); window.RR_PREVIEW = true; }
    }
  } catch (e) { /* sin almacenamiento: se usa el contenido publicado */ }
  return data;
})();
var S = D.sitio || {}, P = D.paginas || {}, BT = D.botones || {}, C = D.contacto || {};

var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
function fechaTexto(iso) { var m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? (+m[3]) + " " + MESES[+m[2] - 1] + " " + m[1] : ""; }

var PROJECTS = (D.proyectos || []).filter(function (p) { return p.visible !== false; }).map(function (p) {
  if (!p.dateText) { p.dateText = fechaTexto(p.date); }
  return p;
});
PROJECTS.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }); /* más reciente primero */
var MOODS = D.sensaciones || [];
var MAPA = D.mapa || {};
var NET_TYPES = {}; (MAPA.tipos || []).forEach(function (t) { NET_TYPES[t.clave] = t.nombre; });
var NET = (MAPA.nodos || []).map(function (n) { return Object.assign({}, n, {l: (n.l || []).slice()}); });
var MAULE_OUTLINE = MAPA.contorno || [];
var MENU = (D.menu || []).filter(function (m) { return m.visible !== false; });
var DIRECTOR_MODES = {}, DIRECTOR_KEYS = {};
(D.modoDirector || []).forEach(function (m) { DIRECTOR_MODES[m.nombre] = m.descripcion; DIRECTOR_KEYS[m.nombre] = m.palabras || []; });
var DM_FIRST = Object.keys(DIRECTOR_MODES)[0] || "";

var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]; }); };
/* Texto con formato simple: *palabras* en color de acento y salto de línea = <br> */
var rt = function (s) { return esc(s).replace(/\*([^*]+)\*/g, '<span class="red">$1</span>').replace(/\n/g, "<br>"); };
var para = function (s) { return s ? '<p>' + rt(s) + '</p>' : ''; };
var CTA = '<a class="btn" href="build.html">' + esc(BT.cotizar || "SOLICITAR COTIZACIÓN") + '</a>';

/* ---- Diseño: colores, tipografías y grano desde los datos ---- */
(function aplicarDiseno() {
  var c = S.colores || {}, f = S.fuentes || {}, r = document.documentElement.style;
  var map = {fondo: "--bg", gris1: "--g1", gris2: "--g2", gris3: "--g3", texto: "--fg", acento: "--red"};
  Object.keys(map).forEach(function (k) { if (c[k]) { r.setProperty(map[k], c[k]); } });
  if (f.titulos) { r.setProperty("--ft", "'" + f.titulos + "'"); }
  if (f.texto) { r.setProperty("--fb", "'" + f.texto + "'"); }
  var fams = [f.titulos, f.texto].filter(function (x) { return x && x !== "Bebas Neue" && x !== "Inter"; });
  if (fams.length) {
    var l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?" + fams.map(function (x) { return "family=" + encodeURIComponent(x).replace(/%20/g, "+") + ":wght@400;600;700"; }).join("&") + "&display=swap";
    document.head.appendChild(l);
  }
  if (S.grano === false) { document.documentElement.classList.add("sin-grano"); }
})();
function cssVar(n, d) { var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim(); return v || d; }

/* envío: si hay un formulario de Formspree configurado se envía ahí; si no, abre el correo (mailto). */
function submitForm(subject, body, done) {
  if (C.formspree) {
    var url = /^https?:/.test(C.formspree) ? C.formspree : "https://formspree.io/f/" + C.formspree;
    fetch(url, {method: "POST", headers: {"Accept": "application/json", "Content-Type": "application/json"}, body: JSON.stringify({_subject: subject, mensaje: body})})
      .then(function (r) { if (!r.ok) { throw 0; } if (done) { done(true); } })
      .catch(function () { location.href = mailto(subject, body); });
    return;
  }
  location.href = mailto(subject, body);
}
function mailto(subject, body) { return "mailto:" + (C.email || "") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body); }

/* ---- YouTube: ID, portadas y reproductor ---- */
function ytId(url) {
  var m = String(url || "").match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/))([\w-]{11})/);
  return m ? m[1] : "";
}
function ytThumb(id, q) { return "https://img.youtube.com/vi/" + id + "/" + (q || "maxresdefault") + ".jpg"; }
function ytEmbed(id, auto) { return "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&modestbranding=1" + (auto ? "&autoplay=1" : ""); }
function thumbFallback(img) { if (img.dataset.fb || !img.dataset.yt) { img.style.display = "none"; return; } img.dataset.fb = "1"; img.src = ytThumb(img.dataset.yt, "hqdefault"); }
function thumbCheck(img) { if (img.dataset.yt && img.naturalWidth && img.naturalWidth <= 120) { thumbFallback(img); } }
function thumb(p, cls) {
  var c = cls ? ' class="' + cls + '"' : '';
  if (p.portada) { return '<img' + c + ' src="' + esc(p.portada) + '" alt="" loading="lazy" onerror="thumbFallback(this)">'; }
  var id = ytId(p.link);
  return id ? '<img' + c + ' src="' + ytThumb(id) + '" data-yt="' + id + '" alt="" loading="lazy" onload="thumbCheck(this)" onerror="thumbFallback(this)">' : '';
}
function byId(id) { return PROJECTS.filter(function (x) { return x.id === id; })[0]; }
function meta(p) { return [p.category, p.dateText].filter(Boolean).join(" · "); }
function info(p) { return [p.category, p.client, p.duration].filter(Boolean).join(" · "); }
function frame(p, auto) {
  var id = ytId(p.link);
  return id ? '<div class="pframe"><iframe src="' + ytEmbed(id, auto) + '" title="' + esc(p.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>' : '';
}

function card(p) {
  return '<a class="card rv" href="project.html?id=' + esc(p.id) + '" data-play="' + esc(p.id) + '" aria-label="Ver ' + esc(p.title) + '"><i>' + thumb(p) + '</i><span class="demo">' + (p.demo ? "DEMO" : esc(p.dateText)) + '</span><span class="play" aria-hidden="true"></span><div><b>' + esc(p.title) + '</b>' + (p.category ? '<small>' + esc(p.category) + '</small>' : '') + '</div></a>';
}
function chips(list, cur, attr) {
  return '<div class="chips" role="group">' + list.map(function (c) { return '<button class="btn' + (c === cur ? ' on' : '') + '" ' + attr + '="' + esc(c) + '">' + esc(c) + '</button>'; }).join("") + '</div>';
}
function section(h, t, extra) { return '<div class="wrap"><p class="tag">' + esc(t) + '</p><h2 class="rv">' + rt(h) + '</h2>' + (extra || "") + '</div>'; }
function service(items, cta) {
  return '<div class="wrap">' + (items || []).map(function (s) {
    return '<hr class="line"><div class="two rv"><h2>' + rt(s.titulo) + '</h2><div><p>' + rt(s.texto) + '</p><br>' + (cta ? CTA : '<a class="btn" href="collaborate.html">' + esc(BT.colaborar || "CREEMOS ALGO JUNTOS") + '</a>') + '</div></div>';
  }).join("") + '</div>';
}
function head(p, tag) { return '<p class="tag">' + esc(tag) + '</p><h1 class="rv">' + rt(p.titulo) + '</h1>'; }

var PAGES = {
  discover: function () {
    var p = P.discover || {};
    return '<div class="wrap">' + head(p, p.tag) + '<hr class="line rv"></div>' +
      section(p.destacadosTitulo, p.destacadosTag, '<div class="grid">' + featured().map(card).join("") + '</div><br><a class="btn" href="work.html">' + esc(p.verTodo) + '</a>') +
      '<div class="wrap"><hr class="line"><h2 class="rv">' + rt(p.cierre) + '</h2><br><a class="btn" href="mood.html">' + esc(p.botonSensacion) + '</a> <a class="btn" href="build.html">' + esc(p.botonProyecto) + '</a></div>';
  },
  work: function () {
    var p = P.work || {}, cats = usedCategories();
    return section(p.titulo, (p.tag || "") + ' · ' + PROJECTS.length + ' VIDEOS', (cats.length > 1 ? chips([p.todos || "TODOS"].concat(cats), p.todos || "TODOS", "data-c") : '') + '<div class="grid" id="g"></div><br><a class="btn" href="mood.html">' + esc(p.boton) + '</a>');
  },
  mood: function () {
    var p = P.mood || {}, used = usedMoods();
    return section(p.titulo, p.tag, (used.length ? chips(used.map(function (m) { return m.toUpperCase(); }), "", "data-m") : '<p class="tag" style="margin-top:1.5rem">' + esc(p.vacio) + '</p>') + '<div class="grid" id="g"></div><br>' + CTA);
  },
  commercial: function () { var p = P.commercial || {}; return '<div class="wrap">' + head(p, p.tag) + para(p.intro) + '</div>' + service(p.servicios, true); },
  artistic: function () { var p = P.artistic || {}; return '<div class="wrap">' + head(p, p.tag) + para(p.intro) + '</div>' + service(p.servicios, false); },
  build: function () { return '<div class="wrap"><p class="tag">' + esc((P.build || {}).tag) + '</p><div id="b"></div></div>'; },
  maule: function () {
    var p = P.maule || {};
    return '<div class="wrap">' + head(p, p.tag) + para(p.intro) + '<br><button class="btn" id="bn">' + esc(p.boton) + '</button><canvas id="net" class="net" role="img" aria-label="Red audiovisual del Maule: puntos conectados por líneas"></canvas><div class="two" style="margin-top:1.5rem"><div aria-live="polite"><p class="tag">CONEXIÓN</p><p id="chain">' + esc(p.ayuda) + '</p><div id="ndet"></div></div><div><p class="tag" id="yr">LA RED HOY</p><div id="stats"></div></div></div><div class="chips" id="nlist" aria-label="Lista de puntos de la red"></div>' + (p.nota ? '<p class="tag">' + esc(p.nota) + '</p>' : '') + '<br>' + CTA + '</div>';
  },
  about: function () {
    var p = P.about || {};
    return '<div class="wrap">' + head(p, p.tag) + para(p.intro) + '<div class="grid">' + (p.equipo || []).map(function (m) {
      return '<div class="card rv"><i>' + (m.foto ? '<img src="' + esc(m.foto) + '" alt="' + esc(m.nombre) + '" loading="lazy">' : '') + '</i>' + (m.etiqueta ? '<span class="demo">' + esc(m.etiqueta) + '</span>' : '') + '<div><b>' + esc(m.nombre) + '</b><small>' + esc([m.rol, m.bio].filter(Boolean).join(". ")) + '</small></div></div>';
    }).join("") + '</div><br>' + CTA + '</div>';
  },
  collaborate: function () { var p = P.collaborate || {}; return '<div class="wrap">' + head(p, p.tag) + para(p.intro) + fform("cf", p.campos, p.boton) + '</div>'; },
  contact: function () {
    var p = P.contact || {}, redes = [["INSTAGRAM", C.instagram], ["YOUTUBE", C.youtube], ["TIKTOK", C.tiktok], ["WHATSAPP", C.whatsapp ? "https://wa.me/" + String(C.whatsapp).replace(/\D/g, "") : ""]].filter(function (r) { return r[1]; });
    return '<div class="wrap">' + head(p, p.tag) + '<p>' + (C.email ? '<a href="mailto:' + esc(C.email) + '">' + esc(C.email) + '</a>' : '') + redes.map(function (r) { return ' · <a href="' + esc(r[1]) + '" rel="noopener" target="_blank">' + r[0] + '</a>'; }).join("") + '</p>' +
      fform("ct", p.campos, p.boton) + '<br><h2>' + rt(p.cierre) + '</h2></div>';
  },
  project: function () {
    var t = P.project || {}, id = new URLSearchParams(location.search).get("id");
    var p = byId(id) || PROJECTS[0]; if (!p) { return '<div class="wrap"><h1>SIN TRABAJOS</h1></div>'; }
    var k = PROJECTS.indexOf(p), prev = PROJECTS[k - 1], next = PROJECTS[k + 1];
    document.title = (S.nombre || "REDROOM") + " — " + p.title;
    return '<div class="wrap"><p class="tag">' + esc(meta(p)) + '</p><h1 class="ptitle">' + esc(p.title) + '</h1>' + (p.description ? '<p>' + esc(p.description) + '</p>' : '') + (info(p) ? '<p class="tag">' + esc(info(p)) + '</p>' : '') + '<br>' + frame(p, false) +
      (p.link ? '<p style="margin-top:1rem"><a class="btn" href="' + esc(p.link) + '" target="_blank" rel="noopener">' + esc(t.verYoutube || "VER EN YOUTUBE") + '</a></p>' : '') +
      (DM_FIRST ? '<p class="tag" style="margin-top:2rem">' + esc(t.director || "MODO DIRECTOR") + '</p>' + chips(Object.keys(DIRECTOR_MODES), DM_FIRST, "data-d") + '<div class="card" id="dm" style="aspect-ratio:16/7"><i>' + thumb(p) + '</i><div><b id="dt">' + esc(DM_FIRST) + '</b><small id="dd">' + esc(directorText(p, DM_FIRST)) + '</small></div></div>' : '') + '<br>' + ficha(p) + CTA + ' <a class="btn" href="work.html">' + esc(t.volver || "VOLVER A TRABAJOS") + '</a>' +
      '<hr class="line"><div class="pnav">' + (prev ? '<a href="project.html?id=' + esc(prev.id) + '"><small class="tag">← MÁS RECIENTE</small><b>' + esc(prev.title) + '</b></a>' : '<span></span>') + (next ? '<a href="project.html?id=' + esc(next.id) + '" style="text-align:right"><small class="tag">ANTERIOR →</small><b>' + esc(next.title) + '</b></a>' : '') + '</div></div>';
  }
};
function fform(id, fields, label) {
  return '<form id="' + id + '">' + (fields || []).map(function (f, i) {
    var fid = id + i, lab = esc(f.etiqueta);
    return '<div><label for="' + fid + '">' + lab.toUpperCase() + '</label>' + (f.largo ? '<textarea id="' + fid + '" name="' + lab + '" rows="4" required></textarea>' : '<input id="' + fid + '" name="' + lab + '"' + (f.correo ? ' type="email"' : '') + ' required>') + '</div>';
  }).join("") + '<button class="btn" type="submit">' + esc(label || "ENVIAR") + '</button></form>';
}

var INIT = {
  work: function () { var all = (P.work || {}).todos || "TODOS"; renderGrid(function (p, c) { return c === all || p.category === c; }, "data-c", all); },
  mood: function () { renderGrid(function (p, m) { return !m || (p.mood || []).map(function (x) { return x.toLowerCase(); }).indexOf(m.toLowerCase()) > -1; }, "data-m", ""); },
  project: function () {
    var p = byId(new URLSearchParams(location.search).get("id")) || PROJECTS[0];
    if (!p || !$("[data-d]")) { return; }
    $$("[data-d]").forEach(function (b) {
      b.onclick = function () {
        $$("[data-d]").forEach(function (x) { x.classList.toggle("on", x === b); });
        $("#dt").textContent = b.dataset.d; $("#dd").textContent = directorText(p, b.dataset.d);
      };
    });
  },
  maule: netInit,
  collaborate: function () { bindForm("cf", (P.collaborate || {}).asunto || "Colaboración"); },
  contact: function () { bindForm("ct", (P.contact || {}).asunto || "Contacto"); },
  build: buildFlow
};
function ficha(p) {
  var rows = [["Lugar", p.venue], ["Fecha de grabación", p.recorded], ["Publicado", p.dateText], ["Canal", p.channel], ["Duración", p.duration]].filter(function (r) { return r[1]; }).concat((p.credits || []).filter(function (c) { return c[0] || c[1]; }));
  return rows.length ? '<p class="tag" style="margin-top:2rem">' + esc((P.project || {}).ficha || "FICHA TÉCNICA") + '</p><dl class="ficha">' + rows.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join("") + '</dl>' : '';
}
function directorText(p, k) {
  if (p.director && p.director[k]) { return p.director[k]; }
  var keys = DIRECTOR_KEYS[k] || [], hits = (p.credits || []).filter(function (c) {
    var r = String(c[0]).toLowerCase() + ","; return keys.some(function (w) { return w && r.indexOf(String(w).toLowerCase()) > -1; });
  });
  return hits.length ? hits.map(function (c) { return c[0] + ": " + c[1]; }).join(" · ") : DIRECTOR_MODES[k] + ": sin información publicada para este video.";
}
function uniq(list) { return list.filter(function (x, i) { return x && list.indexOf(x) === i; }); }
function usedCategories() { return uniq(PROJECTS.map(function (p) { return p.category; })); }
function usedMoods() { var all = [].concat.apply([], PROJECTS.map(function (p) { return (p.mood || []).map(function (x) { return x.toLowerCase(); }); })); return MOODS.filter(function (m) { return all.indexOf(m.toLowerCase()) > -1; }); }
function featured() { var n = +((P.discover || {}).cantidadDestacados) || 4, f = PROJECTS.filter(function (p) { return p.featured; }); return (f.length ? f : PROJECTS).slice(0, n); }

/* Reproductor en modal: clic en una tarjeta abre el video. Ctrl/Cmd+clic abre la ficha del proyecto. */
var lastFocus = null;
function openPlayer(p) {
  var pl = $("#player"), t = P.project || {}; if (!pl || !ytId(p.link)) { location.href = "project.html?id=" + p.id; return; }
  lastFocus = document.activeElement;
  pl.innerHTML = '<div class="pbox"><div class="ptop"><p class="tag">' + esc(meta(p)) + '</p><button class="x" id="pclose" aria-label="Cerrar video">' + esc(BT.cerrar || "CERRAR") + '</button></div><h2>' + esc(p.title) + '</h2>' + frame(p, true) +
    (p.description ? '<p class="pdesc">' + esc(p.description) + '</p>' : '') + ficha(p) +
    '<div class="pact"><a class="btn" href="project.html?id=' + esc(p.id) + '">FICHA Y ' + esc(t.director || "MODO DIRECTOR") + '</a> <a class="btn" href="' + esc(p.link) + '" target="_blank" rel="noopener">' + esc(t.verYoutube || "VER EN YOUTUBE") + '</a></div></div>';
  pl.classList.add("on"); document.body.style.overflow = "hidden";
  $("#pclose").onclick = closePlayer; $("#pclose").focus();
}
function closePlayer() {
  var pl = $("#player"); if (!pl || !pl.classList.contains("on")) { return; }
  pl.classList.remove("on"); pl.innerHTML = ""; document.body.style.overflow = "";
  if (lastFocus) { lastFocus.focus(); }
}
document.addEventListener("click", function (e) {
  var a = e.target.closest ? e.target.closest("[data-play]") : null;
  if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
  var p = byId(a.dataset.play); if (!p) { return; }
  e.preventDefault(); openPlayer(p);
});

function renderGrid(filter, attr, start) {
  var cur = start, g = $("#g");
  function draw() {
    var list = PROJECTS.filter(function (p) { return filter(p, cur); });
    g.innerHTML = list.length ? list.map(card).join("") : '<p>Sin proyectos para esta selección.</p>';
    $$(".rv", g).forEach(function (e) { setTimeout(function () { e.classList.add("in"); }, 30); });
    document.body.dataset.mood = cur;
  }
  $$("[" + attr + "]").forEach(function (b) {
    b.onclick = function () { cur = b.getAttribute(attr); $$("[" + attr + "]").forEach(function (x) { x.classList.toggle("on", x === b); }); draw(); };
  });
  draw();
}
function bindForm(id, subject) {
  var f = $("#" + id); if (!f) { return; }
  f.onsubmit = function (e) {
    e.preventDefault();
    var body = $$("input,textarea", this).map(function (i) { return i.name + ": " + i.value; }).join("\n");
    submitForm(subject, body, function () { f.innerHTML = '<h2>MENSAJE ENVIADO.</h2><p>Te responderemos pronto.</p>'; });
  };
}

function buildFlow() {
  var B = P.build || {}, steps = B.pasos || [], i = 0, a = {}, root = $("#b");
  function show() {
    if (i >= steps.length) {
      var sum = Object.keys(a).map(function (k) { return k + ": " + a[k]; }).join("\n");
      root.innerHTML = '<h1>' + rt(B.final || "TU PROYECTO ESTÁ LISTO.") + '</h1>' + (B.claqueta !== false ? claqueta(a) : '') + '<pre class="sum">' + esc(sum) + '</pre><button class="btn" id="send">' + esc(B.enviar || "ENVIAR") + '</button> <button class="btn" id="back">' + esc(B.editar || "EDITAR") + '</button>';
      $("#send").onclick = function () { submitForm(B.asunto || "Solicitud de cotización", sum, function () { root.innerHTML = '<h1>PROYECTO <span class="red">ENVIADO.</span></h1><p>Te responderemos pronto.</p>'; }); };
      $("#back").onclick = function () { i = 0; show(); };
      return;
    }
    var s = steps[i], h = '<p class="tag">PASO ' + (i + 1) + ' / ' + steps.length + '</p><h1>' + rt(s.pregunta) + '</h1>';
    if (s.tipo === "opciones") { h += '<div class="opt">' + (s.opciones || []).map(function (o) { return '<button class="btn' + (a[s.clave] === o ? ' on' : '') + '" data-o="' + esc(o) + '">' + esc(o) + '</button>'; }).join("") + '</div>'; }
    else if (s.tipo === "texto") { h += '<form id="st"><textarea aria-label="' + esc(s.clave) + '" id="v" rows="5">' + esc(a[s.clave] || "") + '</textarea><button class="btn" type="submit">SIGUIENTE</button></form>'; }
    else { h += '<form id="st">' + [["Nombre", "n", 1], ["Correo", "e", 1], ["Teléfono", "p", 1], ["Instagram (opcional)", "i", 0]].map(function (f) { return '<div><label for="' + f[1] + '">' + f[0].toUpperCase() + '</label><input id="' + f[1] + '"' + (f[1] === "e" ? ' type="email"' : '') + (f[2] ? ' required' : '') + '></div>'; }).join("") + '<button class="btn" type="submit">TERMINAR</button></form>'; }
    h += i ? '<br><button class="btn" id="prev">ATRÁS</button>' : '';
    root.innerHTML = h;
    $$("[data-o]").forEach(function (b) { b.onclick = function () { a[s.clave] = b.dataset.o; i++; show(); }; });
    var f = $("#st");
    if (f) { f.onsubmit = function (e) { e.preventDefault(); if (s.tipo === "texto") { a[s.clave] = $("#v").value || "-"; } else { a.NOMBRE = $("#n").value; a.CORREO = $("#e").value; a.TELÉFONO = $("#p").value; a.INSTAGRAM = $("#i").value || "-"; } i++; show(); }; }
    if ($("#prev")) { $("#prev").onclick = function () { i--; show(); }; }
  }
  show();
}

function chrome() {
  var cur = document.body.dataset.page, X = D.experiencia || {};
  document.body.insertAdjacentHTML("afterbegin",
    (window.RR_PREVIEW ? '<div class="pv-bar">VISTA PREVIA DEL PANEL · LOS CAMBIOS AÚN NO ESTÁN PUBLICADOS <a href="?vista-previa=0">SALIR</a></div>' : '') +
    '<header class="top"><a href="index.html" aria-label="' + esc(S.nombre || "REDROOM") + ', inicio">' + esc(S.nombre || "REDROOM") + '</a><button id="mb" aria-expanded="false" aria-controls="menu">' + esc(BT.menu || "MENÚ") + '</button></header>' +
    '<nav class="menu" id="menu" aria-label="Principal"><button class="x" id="mx">' + esc(BT.cerrar || "CERRAR") + '</button>' + MENU.map(function (m) { return '<a href="' + esc(m.pagina) + '.html"' + (m.pagina === cur ? ' aria-current="page"' : '') + '>' + esc(m.texto) + '</a>'; }).join("") + '</nav>' +
    '<div class="stage" id="stage" role="dialog" aria-label="Modo experiencia"></div>' +
    '<div class="player" id="player" role="dialog" aria-modal="true" aria-label="Reproductor de video"></div>' +
    (X.botonRojo !== false ? '<button class="rbtn" id="rb" aria-label="Botón rojo: modo experiencia" title="EL BOTÓN ROJO"></button>' : ''));
  var m = $("#menu");
  function tog(o) { m.classList.toggle("open", o); $("#mb").setAttribute("aria-expanded", o); if (o) { $("#mx").focus(); } }
  $("#mb").onclick = function () { tog(true); }; $("#mx").onclick = function () { tog(false); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { tog(false); stopExp(); closePlayer(); } });
  $("#player").onclick = function (e) { if (e.target === this) { closePlayer(); } };
  var timer;
  function stopExp() { clearInterval(timer); $("#stage").classList.remove("on"); document.body.classList.remove("exp"); if (document.fullscreenElement) { document.exitFullscreen(); } }
  if (!$("#rb")) { return; }
  $("#rb").onclick = function () {
    var st = $("#stage"), n = 0;
    if (st.classList.contains("on")) { stopExp(); return; }
    if (!PROJECTS.length) { return; }
    document.body.classList.add("exp"); st.classList.add("on");
    if (document.documentElement.requestFullscreen) { document.documentElement.requestFullscreen().catch(function () {}); }
    function f() { var p = PROJECTS[n++ % PROJECTS.length]; st.innerHTML = thumb(p, "sbg") + '<div class="sin"><p class="tag">' + esc(meta(p)) + '</p><h1>' + esc(p.title) + '</h1><p><a class="btn" href="project.html?id=' + esc(p.id) + '">VER ESTE TRABAJO</a></p><p class="tag">ESC O EL BOTÓN ROJO PARA SALIR</p></div>'; }
    f(); timer = setInterval(f, +X.intervalo || 2800);
  };
}

function setTitle(page) {
  if (page === "index" || page === "project") { document.title = S.tituloSEO || S.nombre || document.title; if (page === "index") { return; } }
  var m = (D.menu || []).filter(function (x) { return x.pagina === page; })[0];
  if (m) { document.title = (S.nombre || "REDROOM") + " — " + m.texto.charAt(0) + m.texto.slice(1).toLowerCase(); }
  var md = $('meta[name="description"]'); if (md && S.descripcionSEO && page === "index") { md.content = S.descripcionSEO; }
}

document.addEventListener("DOMContentLoaded", function () {
  var page = document.body.dataset.page;
  setTitle(page);
  if (page === "index") { return enterRoom(); }
  chrome();
  $("#app").innerHTML = PAGES[page] ? PAGES[page]() : "";
  if (INIT[page]) { INIT[page](); }
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, {threshold: .15}) : null;
  $$(".rv").forEach(function (e) { io ? io.observe(e) : e.classList.add("in"); });
});

function enterRoom() {
  var t = P.index || {}, h = $(".hero"), go = function () { h.classList.add("go"); setTimeout(function () { location.href = "discover.html"; }, 1100); };
  if (t.titulo) { $(".hero h1").innerHTML = rt(t.titulo); }
  $("#load").textContent = t.cargando || "CARGANDO";
  $("#enter").textContent = t.boton || "ENTRAR";
  $("#enter").onclick = go;
  document.addEventListener("keydown", function (e) { if (e.key === "Enter") { go(); } });
  setTimeout(function () { $("#load").textContent = t.listo || "LISTO"; $("#enter").hidden = false; $("#enter").focus(); }, 900);
}

/* INNOVACIÓN: la CLAQUETA. Al terminar "Arma tu proyecto", el proyecto se convierte en una claqueta de cine. */
function claqueta(a) {
  function c(l, v) { return '<div><small>' + esc(l) + '</small><b>' + esc(v || "-") + '</b></div>'; }
  var st = (P.build || {}).pasos || [], k = st.filter(function (s) { return s.tipo === "opciones"; }).slice(0, 3);
  return '<div class="slate"><div class="clap"></div><div class="sg">' + k.map(function (s) { return c(s.clave, a[s.clave]); }).join("") + c("PRODUCTORA", S.nombre || "REDROOM") + c("FECHA", new Date().toLocaleDateString("es-CL")) + c("TOMA", "1") + '</div></div>';
}
/* INNOVACIÓN: el VISOR. En pantallas con mouse, un visor de cámara sigue el cursor y "encuadra" lo que miras. */
function viewfinder() {
  if ((D.experiencia || {}).visor === false) { return; }
  if (!window.matchMedia("(pointer:fine)").matches || window.matchMedia("(prefers-reduced-motion:reduce)").matches) { return; }
  var v = document.createElement("div"); v.className = "vf"; v.setAttribute("aria-hidden", "true");
  v.innerHTML = '<i></i><i></i><i></i><i></i><span id="vft"></span>'; document.body.appendChild(v);
  var t0 = Date.now(), pad = function (n) { return (n < 10 ? "0" : "") + n; };
  document.addEventListener("mousemove", function (e) {
    var el = e.target.closest ? e.target.closest("a,button,.card") : null, r = el && el.getBoundingClientRect();
    v.classList.toggle("lock", !!el);
    if (el && !el.classList.contains("dot")) { v.style.cssText = "transform:translate(" + r.left + "px," + r.top + "px);width:" + r.width + "px;height:" + r.height + "px"; }
    else { v.style.cssText = "transform:translate(" + (e.clientX - 40) + "px," + (e.clientY - 28) + "px)"; }
  });
  setInterval(function () { var s = Math.floor((Date.now() - t0) / 1000); $("#vft").innerHTML = '<em>●</em> REC ' + pad(Math.floor(s / 60)) + ":" + pad(s % 60) + (v.classList.contains("lock") ? " · EN CUADRO" : ""); }, 250);
}
document.addEventListener("DOMContentLoaded", viewfinder);

/* ---- Red audiovisual viva (canvas). Proyección compartida con el editor del panel. ---- */
function netProject(ll, W, H) { var m = 30; return [m + (ll[0] + 72.9) / 2.7 * (W - 2 * m), m + (-34.6 - ll[1]) / 1.95 * (H - 2 * m)]; }
function netInit() {
  var cv = $("#net"), c = cv.getContext("2d"), W = 0, H = 0, now = 0, sel = null, lev = {}, vis = {}, timer = null, building = false;
  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches, byId = {}, E = [], seen = {}, T = P.maule || {};
  var RED = cssVar("--red", "#e10600"), FG = cssVar("--fg", "#f2f2f2"), G = cssVar("--g1", "#1a1a1a");
  var CENTRAL = (MAPA.tipos || [])[0] ? MAPA.tipos[0].clave : "R";
  NET.forEach(function (n, i) { n.i = i; byId[n.id] = n; vis[n.id] = true; });
  NET.forEach(function (n) { n.l.forEach(function (o) { var k = [n.id, o].sort().join("-"); if (!seen[k] && byId[o] && o !== n.id) { seen[k] = 1; E.push({a: n, b: byId[o], t0: null}); } }); });
  function size() { var d = window.devicePixelRatio || 1; W = cv.clientWidth; H = Math.round(W * 0.62); cv.style.height = H + "px"; cv.width = W * d; cv.height = H * d; c.setTransform(d, 0, 0, d, 0, 0); }
  function xy(ll, n) {
    var t = reduce || !n ? 0 : now, p = netProject(ll, W, H);
    return [p[0] + (n ? 6 * Math.sin(t / 1700 + n.i) : 0), p[1] + (n ? 5 * Math.cos(t / 2100 + n.i * 1.7) : 0)];
  }
  function stats() {
    var cnt = {}, k, e = 0, h = "";
    NET.forEach(function (n) { if (vis[n.id]) { cnt[n.t] = (cnt[n.t] || 0) + 1; } });
    E.forEach(function (x) { if (vis[x.a.id] && vis[x.b.id] && (!building || x.t0 !== null)) { e++; } });
    for (k in NET_TYPES) { h += '<p><b class="red">' + (cnt[k] || 0) + '</b> ' + esc(NET_TYPES[k]) + '</p>'; }
    $("#stats").innerHTML = h + '<p><b class="red">' + e + '</b> CONEXIONES</p>';
  }
  function select(n) {
    sel = n; lev = {}; lev[n.id] = 0; var q = [n], lines = [];
    while (q.length) { var u = q.shift(); E.forEach(function (x) { var v = x.a === u ? x.b : (x.b === u ? x.a : null); if (v && vis[v.id] && lev[v.id] === undefined) { lev[v.id] = lev[u.id] + 1; q.push(v); } }); }
    E.forEach(function (x) { x.t0 = (lev[x.a.id] !== undefined && lev[x.b.id] !== undefined) ? now + Math.min(lev[x.a.id], lev[x.b.id]) * 450 : null; });
    NET.forEach(function (m) { if (lev[m.id] !== undefined) { (lines[lev[m.id]] = lines[lev[m.id]] || []).push(m.n); } });
    $("#chain").textContent = lines.map(function (l) { return l.join(" · "); }).join("  →  ");
    $("#ndet").innerHTML = (n.desc || n.link) ? '<p class="tag" style="margin-top:1rem">' + esc(n.n) + (NET_TYPES[n.t] ? ' · ' + esc(NET_TYPES[n.t]) : '') + '</p>' + (n.desc ? '<p>' + esc(n.desc) + '</p>' : '') + (n.link ? '<p><a class="btn" href="' + esc(n.link) + '" target="_blank" rel="noopener">VER MÁS</a></p>' : '') : '';
    if (reduce) { draw(); }
  }
  function draw() {
    now = Date.now(); c.clearRect(0, 0, W, H);
    if (MAULE_OUTLINE.length) { c.beginPath(); MAULE_OUTLINE.forEach(function (q, i) { var p = xy(q, null); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.strokeStyle = G; c.lineWidth = 1; c.stroke(); }
    E.forEach(function (x) {
      if (x.t0 === null || !vis[x.a.id] || !vis[x.b.id]) { return; }
      var p = reduce ? 1 : Math.max(0, Math.min(1, (now - x.t0) / 450)); if (!p) { return; }
      var a = xy(x.a.ll, x.a), b = xy(x.b.ll, x.b);
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p); c.strokeStyle = RED; c.globalAlpha = .9; c.lineWidth = 1.5; c.stroke(); c.globalAlpha = 1;
    });
    NET.forEach(function (n) {
      if (!vis[n.id]) { return; }
      var p = xy(n.ll, n), on = sel ? lev[n.id] !== undefined && now > (lev[n.id] * 450 + 300 - 450 * (lev[n.id] ? 0 : 1)) : true, big = n.t === CENTRAL;
      c.globalAlpha = on ? 1 : .3; c.beginPath(); c.arc(p[0], p[1], big ? 9 : 5, 0, 7); c.fillStyle = RED; c.fill();
      if (n === sel || big) { c.strokeStyle = FG; c.lineWidth = 1.5; c.beginPath(); c.arc(p[0], p[1], big ? 14 : 11, 0, 7); c.stroke(); }
      if (sel && on && lev[n.id] !== undefined) { c.fillStyle = FG; c.font = "11px monospace"; c.fillText(n.n, p[0] + 10, p[1] - 9); }
      c.globalAlpha = 1;
    });
  }
  function loop() { if (!document.hidden) { draw(); } requestAnimationFrame(loop); }
  function nearest(x, y) { var best = null, d = 24; NET.forEach(function (n) { if (vis[n.id]) { var p = xy(n.ll, n), k = Math.hypot(p[0] - x, p[1] - y); if (k < d) { d = k; best = n; } } }); return best; }
  cv.onclick = function (e) { var r = cv.getBoundingClientRect(), n = nearest(e.clientX - r.left, e.clientY - r.top); if (n) { select(n); } };
  $("#nlist").innerHTML = NET.map(function (n) { return '<button class="btn" data-n="' + esc(n.id) + '">' + esc(n.n) + '</button>'; }).join("");
  $$("[data-n]").forEach(function (b) { b.onclick = function () { if (vis[b.dataset.n]) { select(byId[b.dataset.n]); cv.scrollIntoView({block: "center", behavior: reduce ? "auto" : "smooth"}); } }; });
  $("#bn").onclick = function () {
    clearInterval(timer);
    if (building) { building = false; NET.forEach(function (n) { vis[n.id] = true; }); sel = null; E.forEach(function (x) { x.t0 = null; }); $("#bn").textContent = T.boton || "CONSTRUIR LA RED"; $("#yr").textContent = "LA RED HOY"; $("#chain").textContent = T.ayuda || ""; $("#ndet").innerHTML = ""; stats(); return; }
    building = true; sel = null; NET.forEach(function (n) { vis[n.id] = false; }); E.forEach(function (x) { x.t0 = null; });
    var order = NET.slice().sort(function (a, b) { return String(a.add) < String(b.add) ? -1 : 1; }), i = 0;
    $("#bn").textContent = T.botonVolver || "VOLVER A EXPLORAR";
    function step() {
      if (i >= order.length) { clearInterval(timer); $("#chain").textContent = T.final || ""; return; }
      var n = order[i++]; vis[n.id] = true; $("#yr").textContent = "CRECIMIENTO · " + (n.add || "");
      E.forEach(function (x) { if (x.t0 === null && vis[x.a.id] && vis[x.b.id]) { x.t0 = Date.now(); } });
      stats();
    }
    if (reduce) { while (i < order.length) { step(); } draw(); } else { step(); timer = setInterval(step, 800); }
  };
  window.addEventListener("resize", function () { size(); if (reduce) { draw(); } });
  size(); stats(); E.forEach(function (x) { x.t0 = null; });
  if (reduce) { draw(); } else { loop(); }
}
