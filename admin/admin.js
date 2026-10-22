/* REDROOM · Panel de administración (/admin)
   - El ingreso lo hace Cloudflare Access: solo los correos autorizados llegan (reciben un código por correo).
   - El contenido se guarda en Cloudflare (KV) mediante la API del Worker (/admin/api/*). Publicar es inmediato.
   - Modo sin conexión: editas y descargas contenido.js para subirlo a mano. */
(function () {
  "use strict";

  /* ================= Configuración ================= */
  var DATA_FILE = "data/contenido.js";
  var API = "api/";
  var LS_WORK = "rr_admin_trabajo", LS_PREVIEW = "rr_borrador";
  var FONTS_T = ["Bebas Neue", "Anton", "Oswald", "Big Shoulders Display", "Archivo Black", "Space Grotesk", "Playfair Display", "DM Serif Display"];
  var FONTS_B = ["Inter", "IBM Plex Sans", "DM Sans", "Work Sans", "Manrope", "Space Grotesk", "Roboto", "Lora"];
  var PAGE_NAMES = {discover: "Descubrir", work: "Trabajos", commercial: "Comercial", artistic: "Artístico", mood: "Sensación", build: "Arma tu proyecto", maule: "Redroom Maule (mapa)", about: "Nosotros", collaborate: "Colabora", contact: "Contacto", index: "Entrada", project: "Ficha de un trabajo"};

  /* ================= Estado ================= */
  var st = {
    mode: null,          /* "nube" | "local" */
    email: "",
    sha: null,           /* versión publicada sobre la que se edita */
    data: null,          /* contenido en edición */
    published: "",       /* JSON del contenido publicado (para saber si hay cambios) */
    route: "inicio",
    sel: {proyecto: null, nodo: null, pagina: "discover"},
    imgCache: {}         /* vista previa de imágenes recién subidas (aún no publicadas en la web) */
  };

  /* ================= Utilidades ================= */
  function h(tag, attrs) {
    var el = document.createElement(tag), i, k;
    attrs = attrs || {};
    for (k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) { continue; }
      if (k === "class") { el.className = v; }
      else if (k === "html") { el.innerHTML = v; }
      else if (k === "text") { el.textContent = v; }
      else if (k.slice(0, 2) === "on") { el.addEventListener(k.slice(2), v); }
      else if (k === "style" && typeof v === "object") { Object.assign(el.style, v); }
      else if (k === "value") { el.value = v; }
      else if (k === "checked") { el.checked = !!v; }
      else { el.setAttribute(k, v === true ? "" : v); }
    }
    for (i = 2; i < arguments.length; i++) { add(el, arguments[i]); }
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) { return; }
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); return; }
    el.appendChild(typeof c === "object" ? c : document.createTextNode(String(c)));
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function uid(prefix) { return prefix + Date.now().toString(36).slice(-5) + Math.random().toString(36).slice(2, 5); }
  function slug(s) { return String(s || "archivo").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "archivo"; }
  function ytId(url) { var m = String(url || "").match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/|v\/))([\w-]{11})/); return m ? m[1] : ""; }
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sept", "oct", "nov", "dic"];
  function fechaTexto(iso) { var m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? (+m[3]) + " " + MESES[+m[2] - 1] + " " + m[1] : ""; }
  function hoy() { return new Date().toISOString().slice(0, 10); }
  function store(k, v) { try { if (v == null) { localStorage.removeItem(k); } else { localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)); } } catch (e) {} }
  function load(k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function imgSrc(p) { if (!p) { return ""; } if (st.imgCache[p]) { return st.imgCache[p]; } return /^(https?:|data:)/.test(p) ? p : "../" + p; }

  var toastT;
  function toast(msg, kind) {
    var t = $(".toast"); if (t) { t.remove(); }
    t = h("div", {class: "toast " + (kind || ""), role: "status"}, msg); document.body.appendChild(t);
    clearTimeout(toastT); toastT = setTimeout(function () { t.remove(); }, kind === "error" ? 9000 : 4500);
  }
  function modal(title, body, buttons) {
    return new Promise(function (resolve) {
      var m = h("div", {class: "modal", role: "dialog", "aria-modal": "true"});
      var box = h("div", {class: "modal__box"}, h("h2", {text: title}), body,
        h("div", {class: "adm-actions", style: {position: "static"}}, buttons.map(function (b) {
          return h("button", {class: "btn " + (b.cls || ""), type: "button", onclick: function () { m.remove(); resolve(b.value); }}, b.label);
        })));
      m.appendChild(box); document.body.appendChild(m);
      var f = box.querySelector(".btn--primary") || box.querySelector("button"); if (f) { f.focus(); }
    });
  }
  function confirmar(title, text, ok) { return modal(title, h("p", {class: "muted", text: text}), [{label: "Cancelar", value: false}, {label: ok || "Aceptar", value: true, cls: "btn--primary"}]); }

  /* ================= API (Worker de Cloudflare) ================= */
  function api(path, opts) {
    opts = opts || {};
    var isJson = opts.body && !(opts.body instanceof Blob);
    return fetch(API + path, {
      method: opts.method || "GET", cache: "no-store", credentials: "same-origin",
      headers: Object.assign({}, isJson ? {"Content-Type": "application/json"} : {}, opts.headers || {}),
      body: isJson ? JSON.stringify(opts.body) : opts.body
    }).then(function (r) {
      return r.text().then(function (t) {
        var j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok || !j) { var err = new Error((j && j.error) || "No pude conectar con el servidor (" + r.status + ")."); err.status = r.status; err.code = (j && j.code) || (!j ? "NO_API" : ""); throw err; }
        return j;
      });
    });
  }
  function explain(e) {
    var m = e && e.message || String(e);
    if (e && (e.code === "NO_LOGIN" || e.code === "BAD_TOKEN")) { return "Tu sesión venció. Recarga la página para volver a entrar con tu correo."; }
    if (/Failed to fetch|NetworkError/i.test(m)) { return "Sin conexión. Revisa tu internet."; }
    return m;
  }

  /* contenido.js <-> objeto */
  function parseData(src) {
    var m = /^window\.RR_DATA\s*=/m.exec(src); /* la línea real, no el ejemplo del comentario */
    if (!m) { throw new Error("El archivo no tiene window.RR_DATA"); }
    var body = src.slice(m.index + m[0].length).trim().replace(/;\s*$/, "");
    return JSON.parse(body);
  }
  function serialize(d) {
    return "/* REDROOM · CONTENIDO DEL SITIO\n   Este archivo lo escribe el panel /admin. Puedes editarlo a mano, pero mantén el formato:\n   window.RR_DATA = { ... };  (JSON válido entre las llaves) */\nwindow.RR_DATA = " + JSON.stringify(d, null, 1) + ";\n";
  }

  /* ================= Sesión ================= */
  function connect() {
    st.mode = "nube";
    return api("sesion").then(function (r) {
      st.email = r.email;
      return api("contenido");
    }).then(function (r) {
      st.data = r.data; st.sha = r.ver; st.published = JSON.stringify(r.data);
      return recoverWork();
    });
  }
  function loadLocal() {
    st.mode = "local";
    return new Promise(function (res, rej) {
      if (window.RR_DATA) { return res(); }
      var s = document.createElement("script"); s.src = "../" + DATA_FILE + "?t=" + Date.now();
      s.onload = function () { res(); }; s.onerror = function () { rej(new Error("No pude abrir ../data/contenido.js. Abre el panel desde la carpeta del sitio.")); };
      document.head.appendChild(s);
    }).then(function () {
      st.data = clone(window.RR_DATA); st.published = JSON.stringify(st.data); st.sha = "local";
      return recoverWork();
    });
  }
  function recoverWork() {
    var w = load(LS_WORK);
    if (!w || !w.data || JSON.stringify(w.data) === st.published) { return; }
    var same = w.sha === st.sha;
    return modal("Cambios sin publicar", h("div", {},
      h("p", {text: "Tienes cambios guardados en este equipo del " + new Date(w.ts).toLocaleString("es-CL") + " que no se publicaron."}),
      same ? null : h("p", {class: "adm-note", html: "<b>Ojo:</b> desde entonces se publicó otra versión. Si los recuperas y publicas, reemplazarás esa versión."})),
      [{label: "Descartar", value: false, cls: "btn--danger"}, {label: "Recuperar cambios", value: true, cls: "btn--primary"}]
    ).then(function (ok) { if (ok) { st.data = w.data; } else { store(LS_WORK, null); } });
  }
  function logout() { location.href = "/cdn-cgi/access/logout"; }

  /* ================= Cambios, publicar, vista previa ================= */
  function isDirty() { return st.data && JSON.stringify(st.data) !== st.published; }
  var saveT;
  function changed() {
    clearTimeout(saveT);
    saveT = setTimeout(function () { if (isDirty()) { store(LS_WORK, {data: st.data, sha: st.sha, ts: Date.now()}); } else { store(LS_WORK, null); } }, 300);
    var d = $("#dirty"); if (d) { var on = isDirty(); d.className = "dirty" + (on ? "" : " clean"); d.textContent = on ? "Cambios sin publicar" : "Todo publicado"; }
    var pb = $("#publish"); if (pb) { pb.disabled = !isDirty(); }
    var db = $("#discard"); if (db) { db.hidden = !isDirty(); }
  }
  function validar(d) {
    var errs = [], ids = {};
    (d.proyectos || []).forEach(function (p, i) {
      if (!p.title) { errs.push("El video n.º " + (i + 1) + " no tiene título."); }
      if (ids[p.id]) { errs.push("Hay dos videos con el mismo id «" + p.id + "»."); } ids[p.id] = 1;
      if (p.date && !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) { errs.push("La fecha de «" + p.title + "» no es válida."); }
    });
    var nids = {}; ((d.mapa || {}).nodos || []).forEach(function (n) { if (nids[n.id]) { errs.push("Hay dos puntos del mapa con el id «" + n.id + "»."); } nids[n.id] = 1; });
    return errs;
  }
  function publish() {
    if (!isDirty()) { return; }
    var errs = validar(st.data);
    if (errs.length) { return modal("Revisa antes de publicar", h("ul", {}, errs.map(function (e) { return h("li", {text: e}); })), [{label: "Entendido", value: 0, cls: "btn--primary"}]); }
    if (st.mode === "local") { return download(); }
    var msgIn = h("input", {class: "input", value: "Actualiza contenido", maxlength: 120});
    return modal("Publicar cambios", h("div", {class: "field"}, h("span", {text: "Descripción del cambio (queda en el historial)"}), msgIn,
      h("small", {text: "Los cambios se verán en la web en unos segundos."})),
      [{label: "Cancelar", value: false}, {label: "Publicar", value: true, cls: "btn--primary"}]
    ).then(function (ok) {
      if (!ok) { return; }
      var pb = $("#publish"); if (pb) { pb.disabled = true; pb.textContent = "Publicando…"; }
      return doPublish(msgIn.value || "Actualiza contenido", false).then(null, function (e) {
        if (e.code === "CONFLICT") {
          return confirmar("Alguien publicó antes que tú", "Mientras editabas se publicó otra versión del contenido. Si continúas, tus cambios la reemplazan por completo.", "Reemplazar con mis cambios")
            .then(function (yes) { if (yes) { return doPublish(msgIn.value, true); } });
        }
        throw e;
      }).catch(function (e) { toast(explain(e), "error"); }).then(function () { if (pb) { pb.textContent = "Publicar cambios"; } changed(); });
    });
  }
  function doPublish(msg, forzar) {
    var snapshot = JSON.stringify(st.data);
    return api("contenido", {method: "PUT", body: {data: st.data, base: st.sha, mensaje: msg, forzar: !!forzar}}).then(function (r) {
      st.sha = r.ver; st.published = snapshot; store(LS_WORK, null); changed();
      toast("Publicado. Ya está en la web.", "ok");
    });
  }
  function download() {
    var blob = new Blob([serialize(st.data)], {type: "text/javascript"}), a = h("a", {href: URL.createObjectURL(blob), download: "contenido.js"});
    document.body.appendChild(a); a.click(); a.remove();
    toast("Descargado contenido.js. Reemplaza con él el archivo data/contenido.js del sitio y súbelo al repositorio.", "ok");
  }
  function preview(page) {
    store(LS_PREVIEW, JSON.stringify(st.data));
    window.open("../" + (page || "discover") + ".html?vista-previa=1", "_blank", "noopener");
  }
  function discard() {
    confirmar("Descartar cambios", "Vuelves al contenido publicado. Los cambios sin publicar se pierden.", "Descartar").then(function (ok) {
      if (!ok) { return; } st.data = JSON.parse(st.published); store(LS_WORK, null); render();
    });
  }

  /* ================= Subida de imágenes ================= */
  function pickImage() {
    return new Promise(function (res) {
      var i = h("input", {type: "file", accept: "image/*", style: {display: "none"}});
      i.onchange = function () { res(i.files[0] || null); i.remove(); }; document.body.appendChild(i); i.click();
    });
  }
  function shrink(file, max) {
    return new Promise(function (res) {
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { var fr = new FileReader(); fr.onload = function () { res({dataUrl: fr.result, ext: (file.name.split(".").pop() || "bin").toLowerCase()}); }; fr.readAsDataURL(file); return; }
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var s = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
        var webp = c.toDataURL("image/webp", 0.85), ok = webp.indexOf("data:image/webp") === 0;
        res({dataUrl: ok ? webp : c.toDataURL("image/jpeg", 0.85), ext: ok ? "webp" : "jpg"});
      };
      img.src = url;
    });
  }
  function uploadImage() {
    if (st.mode !== "nube") { toast("En modo sin conexión no se pueden subir imágenes. Pega el enlace de una imagen.", "error"); return Promise.resolve(null); }
    return pickImage().then(function (file) {
      if (!file) { return null; }
      if (!/^image\//.test(file.type)) { toast("Elige un archivo de imagen.", "error"); return null; }
      if (file.size > 25 * 1024 * 1024) { toast("La imagen pesa más de 25 MB.", "error"); return null; }
      toast("Subiendo imagen…");
      return shrink(file, 2000).then(function (r) {
        return fetch(r.dataUrl).then(function (x) { return x.blob(); }).then(function (blob) {
          return api("subir", {method: "POST", body: blob, headers: {"Content-Type": blob.type, "X-Nombre": slug(file.name.replace(/\.[^.]+$/, ""))}});
        }).then(function (res) {
          st.imgCache[res.path] = r.dataUrl; toast("Imagen subida. Recuerda publicar los cambios.", "ok"); return res.path;
        });
      });
    }).catch(function (e) { toast(explain(e), "error"); return null; });
  }

  /* ================= Motor de formularios =================
     Cada campo: {k, l (etiqueta), t (tipo), h (ayuda), o (opciones), wide, fields (para listas), title (fn título del ítem), make (fn ítem nuevo)} */
  var RT_HELP = "Usa *asteriscos* para pintar palabras con el color de acento. Enter = salto de línea.";
  function form(fields, obj, onAny) {
    var g = h("div", {class: "adm-grid"});
    fields.forEach(function (f) { g.appendChild(field(f, obj, onAny)); });
    return g;
  }
  function set(obj, f, v, onAny) { obj[f.k] = v; changed(); if (onAny) { onAny(f.k, v); } }
  function field(f, obj, onAny) {
    var wrap = h("label", {class: "field" + (f.wide || /^(textarea|rich|list|pairs|tags|image|checks|kv)$/.test(f.t) ? " wide" : "")}), val = obj[f.k], ctl;
    var lab = h("span", {text: f.l});
    switch (f.t) {
      case "textarea": case "rich":
        ctl = h("textarea", {class: "textarea", rows: f.rows || 3, value: val == null ? "" : val, oninput: function () { set(obj, f, ctl.value, onAny); }}); break;
      case "check":
        wrap = h("label", {class: "check" + (f.wide ? " wide" : "")});
        ctl = h("input", {type: "checkbox", checked: f.inverse ? val === false : (f.def ? val !== false : !!val), onchange: function () { set(obj, f, f.inverse ? !ctl.checked : ctl.checked, onAny); }});
        wrap.appendChild(ctl); wrap.appendChild(h("span", {text: f.l})); if (f.h) { wrap.appendChild(h("small", {class: "faint", text: "· " + f.h})); }
        return wrap;
      case "select":
        ctl = h("select", {class: "select", onchange: function () { set(obj, f, ctl.value, onAny); }},
          (typeof f.o === "function" ? f.o() : f.o).map(function (o) { o = Array.isArray(o) ? o : [o, o]; return h("option", {value: o[0], selected: String(val) === String(o[0])}, o[1]); }));
        if (val == null && ctl.options.length) { obj[f.k] = ctl.value; }
        break;
      case "color":
        var txt = h("input", {class: "input", value: val || "", maxlength: 7, style: {maxWidth: "120px"}});
        var pick = h("input", {type: "color", value: /^#[0-9a-f]{6}$/i.test(val) ? val : "#000000"});
        pick.oninput = function () { txt.value = pick.value; set(obj, f, pick.value, onAny); };
        txt.oninput = function () { if (/^#[0-9a-f]{6}$/i.test(txt.value)) { pick.value = txt.value; set(obj, f, txt.value, onAny); } };
        ctl = h("div", {class: "color"}, pick, txt); break;
      case "number":
        ctl = h("input", {class: "input", type: "number", step: f.step || 1, min: f.min, max: f.max, value: val == null ? "" : val, oninput: function () { set(obj, f, ctl.value === "" ? "" : +ctl.value, onAny); }}); break;
      case "tags": ctl = tagsCtl(obj, f, onAny); break;
      case "checks": ctl = checksCtl(obj, f, onAny); break;
      case "pairs": ctl = pairsCtl(obj, f, onAny); break;
      case "kv": ctl = kvCtl(obj, f, onAny); break;
      case "list": ctl = listCtl(obj, f, onAny); wrap = h("div", {class: "field wide"}); break;
      case "image": ctl = imageCtl(obj, f, onAny); wrap = h("div", {class: "field wide"}); break;
      default:
        ctl = h("input", {class: "input", type: f.t === "url" ? "url" : f.t === "email" ? "email" : f.t === "date" ? "date" : f.t === "month" ? "month" : "text", value: val == null ? "" : val, placeholder: f.ph || "", list: f.datalist ? f.k + "-dl" : null, oninput: function () { set(obj, f, ctl.value, onAny); }});
        if (f.datalist) { ctl = h("div", {}, ctl, h("datalist", {id: f.k + "-dl"}, f.datalist().map(function (o) { return h("option", {value: o}); }))); }
    }
    wrap.appendChild(lab); wrap.appendChild(ctl);
    if (f.h) { wrap.appendChild(h("small", {text: f.h})); }
    return wrap;
  }
  function tagsCtl(obj, f, onAny) {
    var box = h("div", {class: "tags"});
    function draw() {
      box.innerHTML = ""; var arr = obj[f.k] = obj[f.k] || [];
      arr.forEach(function (t, i) { box.appendChild(h("span", {class: "tag"}, t, h("button", {type: "button", "aria-label": "Quitar " + t, onclick: function () { arr.splice(i, 1); changed(); if (onAny) { onAny(f.k); } draw(); }}, "×"))); });
      var inp = h("input", {class: "input", placeholder: f.ph || "Escribe y presiona Enter", onkeydown: function (e) {
        if ((e.key === "Enter" || e.key === ",") && inp.value.trim()) { e.preventDefault(); arr.push(inp.value.trim()); changed(); if (onAny) { onAny(f.k); } draw(); box.querySelector("input").focus(); }
      }});
      box.appendChild(inp);
    }
    draw(); return box;
  }
  function checksCtl(obj, f, onAny) {
    var box = h("div", {class: "chk-grid"}), arr = obj[f.k] = obj[f.k] || [], opts = typeof f.o === "function" ? f.o() : f.o;
    if (!opts.length) { return h("small", {class: "faint", text: f.empty || "No hay opciones todavía."}); }
    opts.forEach(function (o) {
      o = Array.isArray(o) ? o : [o, o];
      var c = h("input", {type: "checkbox", checked: arr.map(String).map(function (x) { return x.toLowerCase(); }).indexOf(String(o[0]).toLowerCase()) > -1, onchange: function () {
        var i = arr.map(function (x) { return String(x).toLowerCase(); }).indexOf(String(o[0]).toLowerCase());
        if (c.checked && i < 0) { arr.push(o[0]); } if (!c.checked && i > -1) { arr.splice(i, 1); }
        changed(); if (onAny) { onAny(f.k); }
      }});
      box.appendChild(h("label", {class: "chk"}, c, o[1]));
    });
    return box;
  }
  function pairsCtl(obj, f, onAny) {
    var box = h("div", {class: "pairs"});
    function draw() {
      box.innerHTML = ""; var arr = obj[f.k] = obj[f.k] || [];
      arr.forEach(function (p, i) {
        var a = h("input", {class: "input", value: p[0], placeholder: f.ph0 || "Rol", oninput: function () { p[0] = a.value; changed(); }});
        var b = h("input", {class: "input", value: p[1], placeholder: f.ph1 || "Nombre", oninput: function () { p[1] = b.value; changed(); }});
        box.appendChild(h("div", {class: "pair"}, a, b, h("div", {style: {display: "flex"}},
          h("button", {type: "button", class: "icon", title: "Subir", disabled: !i, onclick: function () { arr.splice(i - 1, 0, arr.splice(i, 1)[0]); changed(); draw(); }}, "↑"),
          h("button", {type: "button", class: "icon icon--del", title: "Quitar", onclick: function () { arr.splice(i, 1); changed(); draw(); }}, "×"))));
      });
      box.appendChild(h("div", {}, h("button", {type: "button", class: "btn btn--sm", onclick: function () { arr.push(["", ""]); changed(); draw(); box.querySelectorAll(".pair input")[arr.length * 2 - 2].focus(); }}, "+ " + (f.addLabel || "Agregar fila"))));
    }
    draw(); return box;
  }
  function kvCtl(obj, f) { /* objeto {clave: texto} con claves fijas */
    var o = obj[f.k] = obj[f.k] || {}, box = h("div", {class: "adm-grid"}), keys = typeof f.o === "function" ? f.o() : f.o;
    keys.forEach(function (k) {
      var t = h("textarea", {class: "textarea", rows: 2, value: o[k] || "", placeholder: f.ph || "", oninput: function () { if (t.value) { o[k] = t.value; } else { delete o[k]; } changed(); }});
      box.appendChild(h("label", {class: "field"}, h("span", {text: k}), t));
    });
    return box;
  }
  function imageCtl(obj, f, onAny) {
    var box = h("div", {class: "img-field"});
    function draw() {
      box.innerHTML = ""; var v = obj[f.k] || "";
      var prev = h("div", {class: "img-prev", style: v ? {backgroundImage: "url('" + imgSrc(v).replace(/'/g, "%27") + "')"} : {}}, v ? "" : "Sin imagen");
      var url = h("input", {class: "input", value: v, placeholder: "assets/subidas/foto.webp o https://…", onchange: function () { set(obj, f, url.value.trim(), onAny); draw(); }});
      box.appendChild(prev); box.appendChild(url);
      box.appendChild(h("div", {class: "img-actions"},
        h("button", {type: "button", class: "btn btn--sm", onclick: function () { uploadImage().then(function (p) { if (p) { set(obj, f, p, onAny); draw(); } }); }}, "Subir imagen"),
        v ? h("button", {type: "button", class: "btn btn--sm btn--danger", onclick: function () { set(obj, f, "", onAny); draw(); }}, "Quitar") : null));
    }
    draw(); return box;
  }
  function listCtl(obj, f, onAny) {
    var box = h("div", {class: "items"}), openIdx = -1;
    function title(it, i) { return (f.title ? f.title(it, i) : it.titulo || it.nombre || it.texto) || "(sin título)"; }
    function draw() {
      box.innerHTML = ""; var arr = obj[f.k] = obj[f.k] || [];
      arr.forEach(function (it, i) {
        var t = h("span", {class: "t", text: title(it, i)});
        var d = h("details", {class: "item", open: i === openIdx},
          h("summary", {}, h("span", {class: "n", text: String(i + 1).padStart(2, "0")}), t,
            h("button", {type: "button", class: "icon", title: "Subir", disabled: !i, onclick: function (e) { e.preventDefault(); arr.splice(i - 1, 0, arr.splice(i, 1)[0]); openIdx = -1; changed(); draw(); }}, "↑"),
            h("button", {type: "button", class: "icon", title: "Bajar", disabled: i === arr.length - 1, onclick: function (e) { e.preventDefault(); arr.splice(i + 1, 0, arr.splice(i, 1)[0]); openIdx = -1; changed(); draw(); }}, "↓"),
            h("button", {type: "button", class: "icon icon--del", title: "Eliminar", onclick: function (e) { e.preventDefault(); confirmar("Eliminar", "¿Eliminar «" + title(it, i) + "»?", "Eliminar").then(function (ok) { if (ok) { arr.splice(i, 1); openIdx = -1; changed(); draw(); if (onAny) { onAny(f.k); } } }); }}, "×")),
          h("div", {class: "item__body"}, form(f.fields, it, function () { t.textContent = title(it, i); if (onAny) { onAny(f.k); } })));
        d.addEventListener("toggle", function () { if (d.open) { openIdx = i; } });
        box.appendChild(d);
      });
      box.appendChild(h("div", {}, h("button", {type: "button", class: "btn btn--sm", onclick: function () { arr.push(f.make ? f.make() : {}); openIdx = arr.length - 1; changed(); draw(); if (onAny) { onAny(f.k); } }}, "+ " + (f.addLabel || "Agregar"))));
    }
    draw(); return box;
  }

  /* ================= Pantalla de acceso =================
     Normalmente no se ve: Cloudflare Access pide el correo antes de cargar /admin.
     Aparece si Access aún no está configurado, si la sesión venció o si el panel se abre sin servidor. */
  function renderAccess(e) {
    var root = $("#root"); root.innerHTML = "";
    var code = e && e.code, box = h("div", {class: "login__box"},
      h("div", {}, h("p", {class: "mono muted", text: "Panel de administración"}), h("div", {class: "login__brand", html: "RED<span>ROOM</span>"})));
    if (code === "NO_CONFIG") {
      box.appendChild(h("div", {class: "help"}, h("b", {text: "Falta activar el ingreso con correo"}),
        h("p", {class: "muted", style: {marginTop: "8px"}, text: "El panel está instalado, pero aún no tiene la lista de correos autorizados. Sigue LEEME-PANEL.md, paso «Activar el ingreso con correo»."})));
    } else if (code === "NO_LOGIN" || code === "BAD_TOKEN") {
      box.appendChild(h("div", {class: "help"}, h("b", {text: "Entra con tu correo"}),
        h("p", {class: "muted", style: {marginTop: "8px"}, text: "Tu sesión venció o todavía no entras. Presiona Entrar: te pedirán tu correo y te llegará un código. Solo funcionan los correos autorizados."}),
        h("a", {class: "btn btn--primary", href: location.pathname + "?entrar=" + Date.now()}, "Entrar")));
    } else if (e) {
      box.appendChild(h("div", {class: "help"}, h("b", {text: "No pude conectar con el servidor"}),
        h("p", {class: "muted", style: {marginTop: "8px"}, text: code === "NO_API" ? "Estás abriendo el panel desde tu computador o el servidor aún no se actualiza. Puedes trabajar sin conexión y descargar el archivo." : explain(e)})));
    }
    var msg = h("p", {class: "form-error", role: "alert"});
    box.appendChild(msg);
    box.appendChild(h("button", {class: "btn btn--ghost", type: "button", onclick: function () { loadLocal().then(boot, function (er) { msg.textContent = er.message; }); }}, "Trabajar sin conexión (descarga el archivo)"));
    root.appendChild(h("div", {class: "login"}, box));
  }

  /* ================= Estructura del panel ================= */
  var NAV = [
    ["Panel", [["inicio", "Inicio"]]],
    ["Contenido", [["portafolio", "Portafolio (videos)"], ["mapa", "Mapa interactivo Maule"], ["paginas", "Textos de las páginas"], ["servicios", "Servicios"], ["equipo", "Nosotros · equipo"], ["proyecto", "Arma tu proyecto"]]],
    ["Sitio", [["menu", "Menú"], ["contacto", "Contacto y formularios"], ["diseno", "Diseño y colores"], ["ajustes", "Sensaciones y Modo Director"]]],
    ["Avanzado", [["historial", "Historial de versiones"], ["respaldo", "Respaldo y JSON"], ["cuenta", "Cuenta"]]]
  ];
  function boot() {
    window.addEventListener("hashchange", function () { st.route = (location.hash.replace(/^#\/?/, "") || "inicio"); render(); });
    window.addEventListener("beforeunload", function (e) { if (isDirty()) { e.preventDefault(); e.returnValue = ""; } });
    st.route = location.hash.replace(/^#\/?/, "") || "inicio";
    render();
  }
  function render() {
    var root = $("#root"); root.innerHTML = "";
    var side = h("nav", {class: "adm-side", "aria-label": "Secciones del panel"},
      h("div", {class: "adm-side__brand", html: "RED<span>ROOM</span>"}),
      NAV.map(function (g) { return [h("div", {class: "adm-side__group", text: g[0]}), g[1].map(function (r) { return h("a", {href: "#/" + r[0], class: st.route === r[0] ? "active" : null, onclick: function () { side.classList.remove("is-open"); }}, r[1]); })]; }),
      h("div", {class: "adm-side__user"},
        h("span", {style: {minWidth: 0, overflow: "hidden", textOverflow: "ellipsis"}}, st.mode === "local" ? "Sin conexión" : st.email, h("br"), h("small", {class: "faint", text: st.mode === "local" ? "Publicar = descargar" : "Guardado en Cloudflare"}))));
    var title = (NAV.reduce(function (a, g) { return a.concat(g[1]); }, []).filter(function (r) { return r[0] === st.route; })[0] || ["", ""])[1];
    var top = h("header", {class: "adm-top"},
      h("button", {class: "btn btn--sm menu-btn", type: "button", onclick: function () { side.classList.toggle("is-open"); }}, "Menú"),
      h("span", {class: "adm-top__title", text: title}),
      h("span", {id: "dirty", class: "dirty"}),
      h("button", {id: "discard", class: "btn btn--sm btn--ghost", type: "button", onclick: discard, hidden: true}, "Descartar"),
      h("button", {class: "btn btn--sm", type: "button", onclick: function () { preview(previewPage()); }}, "Vista previa"),
      h("button", {id: "publish", class: "btn btn--sm btn--primary", type: "button", onclick: publish}, st.mode === "local" ? "Descargar contenido.js" : "Publicar cambios"));
    var main = h("main", {class: "adm-main", id: "main"});
    root.appendChild(h("div", {class: "adm"}, side, h("div", {class: "adm-body"}, top, main)));
    (VIEWS[st.route] || VIEWS.inicio)(main);
    changed();
    window.scrollTo(0, 0);
  }
  function previewPage() {
    return {portafolio: st.sel.proyecto ? "project" : "work", mapa: "maule", servicios: "commercial", equipo: "about", proyecto: "build", contacto: "contact", paginas: st.sel.pagina === "index" ? "discover" : st.sel.pagina}[st.route] || "discover";
  }
  function head(main, h1, lead) { main.appendChild(h("h1", {class: "adm-h1", text: h1})); if (lead) { main.appendChild(h("p", {class: "adm-lead", html: lead})); } }

  /* ================= Vistas ================= */
  var VIEWS = {};
  VIEWS.inicio = function (main) {
    var d = st.data, pr = d.proyectos || [], nodos = (d.mapa || {}).nodos || [];
    head(main, "Hola", "Desde aquí cambias todo el sitio sin tocar código. Edita, revisa con <b>Vista previa</b> y cuando esté listo presiona <b>Publicar cambios</b>.");
    if (st.mode === "local") { main.appendChild(h("p", {class: "adm-note", html: "<b>Modo sin conexión.</b> Tus cambios se guardan en este navegador. «Descargar contenido.js» te entrega el archivo para reemplazar <code>data/contenido.js</code> y subirlo a GitHub a mano."})); main.appendChild(h("br")); }
    main.appendChild(h("div", {class: "adm-stats"},
      [[pr.filter(function (p) { return p.visible !== false; }).length, "videos publicados", "portafolio"], [nodos.length, "puntos en el mapa", "mapa"], [((d.paginas.commercial || {}).servicios || []).length + ((d.paginas.artistic || {}).servicios || []).length, "servicios", "servicios"], [((d.paginas.about || {}).equipo || []).length, "personas en el equipo", "equipo"]]
        .map(function (s) { return h("a", {class: "adm-stat", href: "#/" + s[2]}, h("b", {text: s[0]}), h("span", {text: s[1]})); })));
    main.appendChild(h("h2", {class: "adm-h1", style: {fontSize: "32px"}, text: "Tareas rápidas"}));
    main.appendChild(h("div", {class: "adm-tasks"},
      [["portafolio", "Agregar un video", "Pega el link de YouTube: la portada y el reproductor salen solos."],
       ["mapa", "Editar el mapa", "Arrastra puntos, conéctalos y agrega nuevos lugares del Maule."],
       ["paginas", "Cambiar textos", "Títulos y textos de cada página del sitio."],
       ["diseno", "Colores y tipografías", "Cambia el rojo de acento, el fondo y las fuentes."],
       ["equipo", "Fotos del equipo", "Sube las fotos y biografías de Nosotros."],
       ["contacto", "Correo y redes", "Dónde llegan los formularios y los links a redes."]]
        .map(function (t) { return h("a", {class: "adm-task", href: "#/" + t[0]}, h("i", {text: "→"}), h("b", {text: t[1]}), h("span", {text: t[2]})); })));
    var placeholders = [];
    if (/CORREO@/i.test((d.contacto || {}).email || "")) { placeholders.push(["contacto", "El correo de contacto todavía es de ejemplo."]); }
    if (nodos.some(function (n) { return /DEMO/i.test(n.n); })) { placeholders.push(["mapa", "El mapa tiene puntos DEMO de ejemplo."]); }
    if (((d.paginas.about || {}).equipo || []).some(function (m) { return !m.foto; })) { placeholders.push(["equipo", "Faltan fotos del equipo."]); }
    if (placeholders.length) {
      main.appendChild(h("div", {class: "adm-panel"}, h("h3", {text: "Pendientes"}), h("ul", {style: {margin: 0, paddingLeft: "18px"}}, placeholders.map(function (p) { return h("li", {}, p[1] + " ", h("a", {href: "#/" + p[0], text: "Resolver"})); }))));
    }
  };

  /* ---------- Portafolio ---------- */
  var PROJ_FIELDS = [
    {k: "title", l: "Título", wide: true},
    {k: "link", l: "Link de YouTube", t: "url", wide: true, h: "Acepta youtu.be, youtube.com/watch, shorts y live. La portada se toma sola."},
    {k: "date", l: "Fecha de publicación", t: "date", h: "Ordena el portafolio (más reciente primero)."},
    {k: "dateText", l: "Fecha como se muestra", ph: "se completa sola", h: "Déjalo vacío para que se escriba solo."},
    {k: "category", l: "Categoría", h: "Crea los filtros de Trabajos. Escribe una nueva o elige una existente.", datalist: function () { return uniq((st.data.proyectos || []).map(function (p) { return p.category; })); }},
    {k: "visible", l: "Visible en la web", t: "check", def: true},
    {k: "featured", l: "Destacado en Descubrir", t: "check"},
    {k: "demo", l: "Marcar como DEMO", t: "check"},
    {k: "description", l: "Descripción", t: "textarea", rows: 3},
    {k: "client", l: "Cliente"}, {k: "channel", l: "Canal"}, {k: "duration", l: "Duración", ph: "15:21"},
    {k: "venue", l: "Lugar"}, {k: "recorded", l: "Fecha de grabación", ph: "dd/mm/aaaa"},
    {k: "mood", l: "Sensaciones", t: "checks", o: function () { return st.data.sensaciones || []; }, empty: "Crea sensaciones en Sitio → Sensaciones y Modo Director.", h: "Activa el buscador «¿Qué quieres sentir?»."},
    {k: "credits", l: "Créditos (ficha técnica)", t: "pairs", ph0: "Rol", ph1: "Nombre(s)", addLabel: "Agregar crédito"},
    {k: "portada", l: "Portada personalizada (opcional)", t: "image", h: "Si la dejas vacía se usa la portada de YouTube."},
    {k: "director", l: "Notas del Modo Director (opcional)", t: "kv", o: function () { return (st.data.modoDirector || []).map(function (m) { return m.nombre; }); }, ph: "Vacío = se arma solo con los créditos", h: "Si dejas un modo vacío, se completa con los créditos que coinciden."}
  ];
  function uniq(a) { return a.filter(function (x, i) { return x && a.indexOf(x) === i; }); }
  VIEWS.portafolio = function (main) {
    head(main, "Portafolio", "Cada video aparece en Trabajos, en Descubrir (si es destacado), en el buscador por sensación y en el modo experiencia del botón rojo.");
    var arr = st.data.proyectos = st.data.proyectos || [], q = "", cat = "";
    var listBox = h("div", {class: "adm-list"}), edit = h("div");
    function sorted() { return arr.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }); }
    function drawList() {
      listBox.innerHTML = "";
      sorted().filter(function (p) { return (!q || (p.title + " " + p.category + " " + p.client).toLowerCase().indexOf(q) > -1) && (!cat || p.category === cat); }).forEach(function (p) {
        var id = ytId(p.link), th = p.portada ? imgSrc(p.portada) : id ? "https://img.youtube.com/vi/" + id + "/mqdefault.jpg" : "";
        listBox.appendChild(h("button", {type: "button", class: "adm-row" + (st.sel.proyecto === p.id ? " active" : ""), onclick: function () { st.sel.proyecto = p.id; drawList(); drawEdit(); if (window.innerWidth < 1100) { edit.scrollIntoView({behavior: "smooth"}); } }},
          h("span", {class: "adm-row__thumb", style: th ? {backgroundImage: "url('" + th + "')"} : {}}),
          h("span", {class: "adm-row__main"}, h("span", {class: "adm-row__title", text: p.title || "(sin título)"}), h("span", {class: "adm-row__sub", text: [p.category, p.dateText || fechaTexto(p.date)].filter(Boolean).join(" · ")})),
          p.visible === false ? h("span", {class: "pill", text: "Oculto"}) : null, p.featured ? h("span", {class: "pill pill--red", text: "Destacado"}) : null));
      });
      if (!listBox.children.length) { listBox.appendChild(h("p", {class: "muted", text: "Sin resultados."})); }
    }
    function drawEdit() {
      edit.innerHTML = "";
      var p = arr.filter(function (x) { return x.id === st.sel.proyecto; })[0];
      if (!p) { edit.appendChild(h("div", {class: "adm-panel"}, h("p", {class: "muted", text: "Elige un video de la lista o agrega uno nuevo."}))); return; }
      var id = ytId(p.link), prev = h("div", {class: "img-prev img-prev--video", style: {backgroundImage: p.portada ? "url('" + imgSrc(p.portada) + "')" : id ? "url('https://img.youtube.com/vi/" + id + "/hqdefault.jpg')" : "none"}}, id || p.portada ? "" : "Pega un link de YouTube válido");
      edit.appendChild(h("div", {class: "adm-panel"},
        h("div", {style: {display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center", flexWrap: "wrap"}}, h("h2", {text: "Editar video"}), h("span", {class: "mono faint", text: "id: " + p.id})),
        prev,
        form(PROJ_FIELDS, p, function (k) {
          if (k === "date") { p.dateText = fechaTexto(p.date); var dt = edit.querySelectorAll("input")[3]; if (dt) { dt.value = p.dateText; } }
          if (k === "link" || k === "portada") { var y = ytId(p.link); prev.style.backgroundImage = p.portada ? "url('" + imgSrc(p.portada) + "')" : y ? "url('https://img.youtube.com/vi/" + y + "/hqdefault.jpg')" : "none"; prev.textContent = y || p.portada ? "" : "Pega un link de YouTube válido"; }
          if (k === "title" || k === "category" || k === "visible" || k === "featured" || k === "date" || k === "link") { drawList(); }
        }),
        h("div", {class: "adm-actions"},
          h("button", {type: "button", class: "btn btn--sm", onclick: function () { preview("project"); setTimeout(function () {}, 0); }, title: "Abre la ficha en la vista previa"}, "Vista previa"),
          h("button", {type: "button", class: "btn btn--sm", onclick: function () { var c = clone(p); c.id = uid("p"); c.title = p.title + " (copia)"; arr.push(c); st.sel.proyecto = c.id; changed(); drawList(); drawEdit(); }}, "Duplicar"),
          h("button", {type: "button", class: "btn btn--sm btn--danger", onclick: function () { confirmar("Eliminar video", "¿Eliminar «" + p.title + "» del portafolio? Se puede recuperar desde el historial.", "Eliminar").then(function (ok) { if (ok) { arr.splice(arr.indexOf(p), 1); st.sel.proyecto = null; changed(); drawList(); drawEdit(); } }); }}, "Eliminar"))));
      var pv = edit.querySelector(".adm-actions .btn");
      pv.onclick = function () { store(LS_PREVIEW, JSON.stringify(st.data)); window.open("../project.html?id=" + encodeURIComponent(p.id) + "&vista-previa=1", "_blank", "noopener"); };
    }
    var cats = uniq(arr.map(function (p) { return p.category; }));
    main.appendChild(h("div", {class: "adm-split"},
      h("div", {class: "adm-panel"},
        h("div", {class: "adm-search"},
          h("input", {class: "input", type: "search", placeholder: "Buscar…", oninput: function (e) { q = e.target.value.toLowerCase(); drawList(); }}),
          h("button", {type: "button", class: "btn btn--primary", onclick: function () {
            var p = {id: uid("p"), title: "Nuevo video", date: hoy(), dateText: fechaTexto(hoy()), link: "", category: "", mood: [], description: "", client: "", duration: "", director: {}, credits: [], visible: true, featured: false};
            arr.push(p); st.sel.proyecto = p.id; changed(); drawList(); drawEdit(); var t = edit.querySelector("input"); if (t) { t.select(); }
          }}, "+ Nuevo")),
        h("select", {class: "select", onchange: function (e) { cat = e.target.value; drawList(); }}, [h("option", {value: ""}, "Todas las categorías")].concat(cats.map(function (c) { return h("option", {value: c}, c); }))),
        h("p", {class: "mono faint", text: arr.length + " videos · orden por fecha"}),
        listBox),
      edit));
    drawList(); drawEdit();
  };

  /* ---------- Mapa interactivo ---------- */
  var MW = 1000, MH = 620, MM = 30;
  function proj(ll) { return [MM + (ll[0] + 72.9) / 2.7 * (MW - 2 * MM), MM + (-34.6 - ll[1]) / 1.95 * (MH - 2 * MM)]; }
  function unproj(x, y) { return [+((x - MM) / (MW - 2 * MM) * 2.7 - 72.9).toFixed(3), +(-34.6 - (y - MM) / (MH - 2 * MM) * 1.95).toFixed(3)]; }
  VIEWS.mapa = function (main) {
    head(main, "Mapa interactivo", "La «Red viva» de la página Redroom Maule. <b>Arrastra</b> un punto para moverlo, <b>tócalo</b> para editarlo, usa <b>Conectar</b> para unir puntos y <b>Agregar punto</b> para crear uno nuevo donde hagas clic.");
    var M = st.data.mapa = st.data.mapa || {tipos: [], nodos: [], contorno: []}; M.nodos = M.nodos || []; M.tipos = M.tipos || []; M.contorno = M.contorno || [];
    var mode = "mover", svgNS = "http://www.w3.org/2000/svg";
    var acc = (st.data.sitio.colores || {}).acento || "#e10600";
    var wrap = h("div", {class: "map-wrap"}), svg = document.createElementNS(svgNS, "svg"), form1 = h("div");
    svg.setAttribute("viewBox", "0 0 " + MW + " " + MH); svg.setAttribute("role", "img"); svg.setAttribute("aria-label", "Editor del mapa del Maule");
    wrap.appendChild(svg); var hint = h("div", {class: "map-hint"}); wrap.appendChild(hint);
    function byId(id) { return M.nodos.filter(function (n) { return n.id === id; })[0]; }
    function linked(a, b) { return (a.l || []).indexOf(b.id) > -1 || (b.l || []).indexOf(a.id) > -1; }
    function toggleLink(a, b) {
      if (a === b) { return; }
      if (linked(a, b)) { a.l = (a.l || []).filter(function (x) { return x !== b.id; }); b.l = (b.l || []).filter(function (x) { return x !== a.id; }); }
      else { (a.l = a.l || []).push(b.id); }
      changed();
    }
    function central() { return M.tipos[0] ? M.tipos[0].clave : "R"; }
    function el(n, a) { var e = document.createElementNS(svgNS, n); for (var k in a) { e.setAttribute(k, a[k]); } return e; }
    function pt(e) { var r = svg.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * MW, (e.clientY - r.top) / r.height * MH]; }
    function draw() {
      svg.innerHTML = "";
      svg.appendChild(el("rect", {x: 0, y: 0, width: MW, height: MH, fill: "#050505"}));
      for (var gx = 0; gx <= 10; gx++) { svg.appendChild(el("line", {x1: gx * 100, y1: 0, x2: gx * 100, y2: MH, stroke: "#111", "stroke-width": 1})); }
      for (var gy = 0; gy <= 6; gy++) { svg.appendChild(el("line", {x1: 0, y1: gy * 100, x2: MW, y2: gy * 100, stroke: "#111", "stroke-width": 1})); }
      if (M.contorno.length) { svg.appendChild(el("polygon", {points: M.contorno.map(function (q) { return proj(q).join(","); }).join(" "), fill: "#0c0c0c", stroke: "#333", "stroke-width": 1.5})); }
      var sel = byId(st.sel.nodo), seen = {};
      M.nodos.forEach(function (n) { (n.l || []).forEach(function (o) { var b = byId(o), k = [n.id, o].sort().join("|"); if (!b || seen[k]) { return; } seen[k] = 1; var p = proj(n.ll), q = proj(b.ll), hot = sel && (sel === n || sel === b); svg.appendChild(el("line", {x1: p[0], y1: p[1], x2: q[0], y2: q[1], stroke: acc, "stroke-opacity": hot ? 1 : .45, "stroke-width": hot ? 2.5 : 1.5})); }); });
      M.nodos.forEach(function (n) {
        var p = proj(n.ll), g = el("g", {class: "node" + (n === sel ? " sel" : ""), "data-id": n.id, transform: "translate(" + p[0] + "," + p[1] + ")"}), big = n.t === central();
        if (n === sel) { g.appendChild(el("circle", {r: big ? 20 : 15, fill: "none", stroke: "#fff", "stroke-width": 2})); }
        else if (big) { g.appendChild(el("circle", {r: 16, fill: "none", stroke: "#f2f2f2", "stroke-width": 1.5})); }
        if (mode === "conectar" && sel && n !== sel && linked(sel, n)) { g.appendChild(el("circle", {r: 13, fill: "none", stroke: acc, "stroke-width": 2, "stroke-dasharray": "3 3"})); }
        g.appendChild(el("circle", {r: big ? 10 : 7, fill: acc}));
        g.appendChild(el("circle", {r: 18, fill: "transparent"}));
        var t = el("text", {x: 14, y: -10}); t.textContent = n.n; g.appendChild(t);
        svg.appendChild(g);
      });
      if (mode === "contorno") { M.contorno.forEach(function (q, i) { var p = proj(q); svg.appendChild(el("circle", {class: "vtx", cx: p[0], cy: p[1], r: 7, "data-v": i})); }); }
      hint.textContent = {mover: "Arrastra para mover · toca para editar", agregar: "Haz clic en el mapa para crear el punto", conectar: sel ? "Toca otros puntos para conectarlos o desconectarlos con " + sel.n : "Primero elige un punto", contorno: "Arrastra los vértices blancos para ajustar la silueta de la región"}[mode];
      wrap.classList.toggle("adding", mode === "agregar");
    }
    var drag = null;
    svg.addEventListener("pointerdown", function (e) {
      var g = e.target.closest("g.node"), v = e.target.getAttribute && e.target.getAttribute("data-v");
      if (mode === "contorno" && v != null) { drag = {v: +v}; svg.setPointerCapture(e.pointerId); return; }
      if (g) {
        var n = byId(g.getAttribute("data-id"));
        if (mode === "conectar" && st.sel.nodo && n.id !== st.sel.nodo) { toggleLink(byId(st.sel.nodo), n); draw(); drawForm(); return; }
        st.sel.nodo = n.id; drag = {n: n, moved: false, start: pt(e)}; svg.setPointerCapture(e.pointerId); draw(); drawForm(); return;
      }
      if (mode === "agregar") {
        var p = pt(e), t2 = (M.tipos[1] || M.tipos[0] || {clave: "P"}).clave, nn = {id: uid("n"), t: t2, n: "NUEVO PUNTO", ll: unproj(p[0], p[1]), add: hoy().slice(0, 7), l: [], desc: "", link: ""};
        M.nodos.push(nn); st.sel.nodo = nn.id; mode = "mover"; setMode(); changed(); draw(); drawForm();
        var ni = form1.querySelector("input"); if (ni) { ni.select(); }
      }
    });
    svg.addEventListener("pointermove", function (e) {
      if (!drag) { return; }
      var p = pt(e);
      if (drag.v != null) { M.contorno[drag.v] = unproj(Math.max(0, Math.min(MW, p[0])), Math.max(0, Math.min(MH, p[1]))); draw(); return; }
      if (!drag.moved && Math.hypot(p[0] - drag.start[0], p[1] - drag.start[1]) < 4) { return; }
      drag.moved = true; drag.n.ll = unproj(Math.max(0, Math.min(MW, p[0])), Math.max(0, Math.min(MH, p[1]))); draw();
    });
    function endDrag() { if (drag && (drag.moved || drag.v != null)) { changed(); drawForm(); } drag = null; }
    svg.addEventListener("pointerup", endDrag); svg.addEventListener("pointercancel", endDrag);
    var tools = h("div", {class: "map-tools"});
    function setMode() {
      tools.querySelectorAll("[data-mode]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-mode") === mode); });
      draw();
    }
    [["mover", "Mover / elegir"], ["agregar", "+ Agregar punto"], ["conectar", "Conectar"], ["contorno", "Editar silueta"]].forEach(function (m) {
      tools.appendChild(h("button", {type: "button", class: "btn btn--sm", "data-mode": m[0], onclick: function () { mode = mode === m[0] ? "mover" : m[0]; setMode(); }}, m[1]));
    });
    tools.appendChild(h("button", {type: "button", class: "btn btn--sm", onclick: function () { preview("maule"); }}, "Ver en la web"));
    function typeOpts() { return M.tipos.map(function (t) { return [t.clave, t.nombre]; }); }
    function drawForm() {
      form1.innerHTML = "";
      var n = byId(st.sel.nodo);
      if (!n) { form1.appendChild(h("div", {class: "adm-panel"}, h("h3", {text: "Punto"}), h("p", {class: "muted", text: "Elige un punto en el mapa o en la lista, o usa «+ Agregar punto»."}))); return; }
      var others = M.nodos.filter(function (o) { return o !== n; });
      var lonI, latI;
      var links = h("div", {class: "chk-grid"}, others.map(function (o) {
        var c = h("input", {type: "checkbox", checked: linked(n, o), onchange: function () { toggleLink(n, o); draw(); }});
        return h("label", {class: "chk"}, c, o.n);
      }));
      form1.appendChild(h("div", {class: "adm-panel"},
        h("h3", {text: "Editar punto"}),
        form([{k: "n", l: "Nombre", wide: true}, {k: "t", l: "Tipo", t: "select", o: typeOpts}, {k: "add", l: "Se sumó a la red", t: "month", h: "Ordena la animación «Construir la red»."},
              {k: "desc", l: "Descripción (opcional)", t: "textarea", rows: 2, h: "Se muestra al tocar el punto."}, {k: "link", l: "Link (opcional)", t: "url", wide: true, ph: "https://instagram.com/…"}], n, function () { draw(); drawList(); }),
        h("div", {class: "adm-grid"},
          h("label", {class: "field"}, h("span", {text: "Longitud"}), lonI = h("input", {class: "input", type: "number", step: "0.001", value: n.ll[0], oninput: function () { n.ll[0] = +lonI.value; changed(); draw(); }})),
          h("label", {class: "field"}, h("span", {text: "Latitud"}), latI = h("input", {class: "input", type: "number", step: "0.001", value: n.ll[1], oninput: function () { n.ll[1] = +latI.value; changed(); draw(); }}))),
        h("div", {class: "field"}, h("span", {text: "Conectado con"}), links),
        h("div", {class: "adm-actions"},
          h("button", {type: "button", class: "btn btn--sm", onclick: function () { mode = "conectar"; setMode(); }}, "Conectar en el mapa"),
          h("button", {type: "button", class: "btn btn--sm btn--danger", onclick: function () {
            confirmar("Eliminar punto", "¿Eliminar «" + n.n + "» y sus conexiones?", "Eliminar").then(function (ok) {
              if (!ok) { return; } M.nodos.splice(M.nodos.indexOf(n), 1); M.nodos.forEach(function (o) { o.l = (o.l || []).filter(function (x) { return x !== n.id; }); });
              st.sel.nodo = null; changed(); draw(); drawForm(); drawList();
            });
          }}, "Eliminar punto"))));
    }
    var listBox = h("div", {class: "chk-grid"});
    function drawList() {
      listBox.innerHTML = "";
      M.nodos.forEach(function (n) { listBox.appendChild(h("button", {type: "button", class: "btn btn--sm" + (n.id === st.sel.nodo ? " on" : ""), onclick: function () { st.sel.nodo = n.id; draw(); drawForm(); drawList(); }}, n.n)); });
    }
    main.appendChild(h("div", {class: "adm-split adm-split--map"},
      h("div", {class: "adm-panel"}, tools, wrap,
        h("div", {class: "legend"}, h("span", {text: M.nodos.length + " puntos"}), h("span", {text: "· el primer tipo de la lista (" + (M.tipos[0] ? M.tipos[0].nombre : "—") + ") se dibuja más grande"})),
        h("div", {class: "field"}, h("span", {text: "Todos los puntos"}), listBox)),
      form1));
    var T = st.data.paginas.maule = st.data.paginas.maule || {};
    main.appendChild(h("br"));
    main.appendChild(h("div", {class: "adm-split"},
      h("div", {class: "adm-panel"}, h("h3", {text: "Tipos de punto"}), h("p", {class: "muted", text: "Son las categorías del contador de la red. La clave es una letra o palabra corta que no se repite."}),
        form([{k: "tipos", l: "Tipos", t: "list", addLabel: "Agregar tipo", title: function (t) { return (t.clave || "?") + " · " + (t.nombre || ""); }, make: function () { return {clave: "X" + (M.tipos.length + 1), nombre: "NUEVO TIPO"}; },
          fields: [{k: "clave", l: "Clave"}, {k: "nombre", l: "Nombre"}]}], M, function () { draw(); drawForm(); })),
      h("div", {class: "adm-panel"}, h("h3", {text: "Textos de la página del mapa"}),
        form([{k: "tag", l: "Etiqueta"}, {k: "titulo", l: "Título", h: RT_HELP}, {k: "intro", l: "Introducción", t: "textarea"}, {k: "boton", l: "Botón construir"}, {k: "botonVolver", l: "Botón volver"},
              {k: "ayuda", l: "Texto antes de elegir un punto", wide: true}, {k: "final", l: "Texto al terminar de construir", wide: true}, {k: "nota", l: "Nota al pie", wide: true, h: "Déjala vacía para ocultarla."}], T))));
    main.appendChild(h("p", {class: "muted", style: {marginTop: "14px", fontSize: "13px"}}, h("button", {type: "button", class: "btn btn--sm btn--ghost", onclick: function () {
      confirmar("Restaurar silueta", "Vuelve la silueta de la región a la forma original del Maule.", "Restaurar").then(function (ok) { if (ok) { M.contorno = [[-72.35, -34.95], [-72.1, -34.72], [-71.5, -34.66], [-70.9, -34.7], [-70.4, -34.9], [-70.55, -35.3], [-70.45, -35.7], [-70.6, -36.05], [-70.9, -36.35], [-71.6, -36.45], [-72.2, -36.38], [-72.7, -36.05], [-72.62, -35.75], [-72.5, -35.35]]; changed(); draw(); } });
    }}, "Restaurar silueta original del Maule")));
    setMode(); drawForm(); drawList();
  };

  /* ---------- Textos de las páginas ---------- */
  var PAGE_FIELDS = {
    index: [{k: "titulo", l: "Título grande", h: RT_HELP}, {k: "cargando", l: "Texto mientras carga"}, {k: "listo", l: "Texto al terminar de cargar"}, {k: "boton", l: "Botón de entrada"}],
    discover: [{k: "tag", l: "Etiqueta"}, {k: "titulo", l: "Título principal", t: "textarea", rows: 2, h: RT_HELP}, {k: "destacadosTag", l: "Etiqueta de destacados"}, {k: "destacadosTitulo", l: "Título de destacados"}, {k: "cantidadDestacados", l: "Cuántos destacados mostrar", t: "number", min: 1, max: 12}, {k: "verTodo", l: "Botón ver todo"}, {k: "cierre", l: "Frase de cierre", wide: true, h: RT_HELP}, {k: "botonSensacion", l: "Botón sensación"}, {k: "botonProyecto", l: "Botón proyecto"}],
    work: [{k: "tag", l: "Etiqueta"}, {k: "titulo", l: "Título", h: RT_HELP}, {k: "todos", l: "Filtro «todos»"}, {k: "boton", l: "Botón inferior"}],
    mood: [{k: "tag", l: "Etiqueta"}, {k: "titulo", l: "Título", h: RT_HELP}, {k: "vacio", l: "Texto si no hay sensaciones asignadas", t: "textarea", rows: 2}],
    commercial: [{k: "tag", l: "Etiqueta"}, {k: "titulo", l: "Título", t: "textarea", rows: 2, h: RT_HELP}, {k: "intro", l: "Introducción (opcional)", t: "textarea", rows: 2}],
    artistic: [{k: "tag", l: "Etiqueta"}, {k: "titulo", l: "Título", t: "textarea", rows: 2, h: RT_HELP}, {k: "intro", l: "Introducción (opcional)", t: "textarea", rows: 2}],
    about: [{k: "tag", l: "Etiqueta"}, {k: "titulo", l: "Título", h: RT_HELP}, {k: "intro", l: "Texto de presentación", t: "textarea", rows: 4}],
    collaborate: [{k: "tag", l: "Etiqueta"}, {k: "titulo", l: "Título", h: RT_HELP}, {k: "intro", l: "Texto", t: "textarea", rows: 2}, {k: "boton", l: "Botón enviar"}, {k: "asunto", l: "Asunto del correo"},
      {k: "campos", l: "Campos del formulario", t: "list", addLabel: "Agregar campo", title: function (c) { return c.etiqueta + (c.largo ? " · largo" : ""); }, make: function () { return {etiqueta: "Nuevo campo", largo: false}; }, fields: [{k: "etiqueta", l: "Etiqueta"}, {k: "largo", l: "Texto largo", t: "check"}, {k: "correo", l: "Es un correo", t: "check"}]}],
    contact: [{k: "tag", l: "Etiqueta"}, {k: "titulo", l: "Título", h: RT_HELP}, {k: "boton", l: "Botón enviar"}, {k: "cierre", l: "Frase de cierre", h: RT_HELP}, {k: "asunto", l: "Asunto del correo"},
      {k: "campos", l: "Campos del formulario", t: "list", addLabel: "Agregar campo", title: function (c) { return c.etiqueta + (c.largo ? " · largo" : ""); }, make: function () { return {etiqueta: "Nuevo campo", largo: false}; }, fields: [{k: "etiqueta", l: "Etiqueta"}, {k: "largo", l: "Texto largo", t: "check"}, {k: "correo", l: "Es un correo", t: "check"}]}],
    project: [{k: "director", l: "Título Modo Director"}, {k: "ficha", l: "Título ficha técnica"}, {k: "verYoutube", l: "Botón YouTube"}, {k: "volver", l: "Botón volver"}],
    build: [{k: "tag", l: "Etiqueta"}],
    maule: null
  };
  VIEWS.paginas = function (main) {
    head(main, "Textos de las páginas", "Todos los títulos, etiquetas y botones. " + RT_HELP);
    var tabs = h("div", {class: "adm-tabs"}), box = h("div");
    var order = ["index", "discover", "work", "mood", "commercial", "artistic", "build", "maule", "about", "collaborate", "contact", "project"];
    function draw() {
      tabs.innerHTML = ""; box.innerHTML = "";
      order.forEach(function (k) { tabs.appendChild(h("button", {type: "button", class: "btn btn--sm" + (st.sel.pagina === k ? " on" : ""), onclick: function () { st.sel.pagina = k; draw(); }}, PAGE_NAMES[k])); });
      var k = st.sel.pagina, p = st.data.paginas[k] = st.data.paginas[k] || {};
      var redirect = {maule: ["mapa", "Los textos del mapa están en Mapa interactivo."], build: ["proyecto", "Los pasos están en Arma tu proyecto."]}[k];
      box.appendChild(h("div", {class: "adm-panel"}, h("h2", {text: PAGE_NAMES[k]}),
        PAGE_FIELDS[k] ? form(PAGE_FIELDS[k], p) : null,
        redirect ? h("p", {class: "adm-note"}, redirect[1] + " ", h("a", {href: "#/" + redirect[0], text: "Ir ahí →"})) : null,
        /commercial|artistic/.test(k) ? h("p", {class: "adm-note"}, "Los servicios de esta página están en ", h("a", {href: "#/servicios", text: "Servicios →"})) : null,
        k === "about" ? h("p", {class: "adm-note"}, "Las personas del equipo están en ", h("a", {href: "#/equipo", text: "Nosotros · equipo →"})) : null,
        h("div", {class: "adm-actions"}, h("button", {type: "button", class: "btn btn--sm", onclick: function () { preview(k === "index" ? "index" : k === "project" ? "work" : k); }}, "Vista previa de esta página"))));
    }
    main.appendChild(tabs); main.appendChild(box); draw();
  };

  VIEWS.servicios = function (main) {
    head(main, "Servicios", "Los bloques de las páginas Comercial (con botón de cotizar) y Artístico (con botón de colaborar). Arrastra el orden con las flechas.");
    var make = function () { return {titulo: "NUEVO SERVICIO", texto: ""}; }, sf = [{k: "titulo", l: "Título", h: RT_HELP}, {k: "texto", l: "Texto", t: "textarea", rows: 3}];
    ["commercial", "artistic"].forEach(function (k) {
      var p = st.data.paginas[k] = st.data.paginas[k] || {};
      main.appendChild(h("div", {class: "adm-panel", style: {marginBottom: "18px"}}, h("h2", {text: PAGE_NAMES[k]}),
        form([{k: "servicios", l: "Servicios", t: "list", addLabel: "Agregar servicio", make: make, fields: sf}], p),
        h("div", {}, h("button", {type: "button", class: "btn btn--sm", onclick: function () { preview(k); }}, "Vista previa"))));
    });
  };

  VIEWS.equipo = function (main) {
    head(main, "Nosotros · equipo", "Las tarjetas de la página Nosotros. Sube una foto por persona (se optimiza sola).");
    var p = st.data.paginas.about = st.data.paginas.about || {};
    main.appendChild(h("div", {class: "adm-panel"},
      form([{k: "tag", l: "Etiqueta"}, {k: "titulo", l: "Título", h: RT_HELP}, {k: "intro", l: "Texto de presentación", t: "textarea", rows: 3},
        {k: "equipo", l: "Personas", t: "list", addLabel: "Agregar persona", make: function () { return {nombre: "NOMBRE", rol: "", bio: "", foto: "", etiqueta: ""}; },
          fields: [{k: "nombre", l: "Nombre"}, {k: "rol", l: "Rol"}, {k: "etiqueta", l: "Etiqueta sobre la foto", h: "Ej: DIRECCIÓN. Vacío = sin etiqueta."}, {k: "bio", l: "Biografía corta", t: "textarea", rows: 3}, {k: "foto", l: "Foto", t: "image"}]}], p),
      h("div", {}, h("button", {type: "button", class: "btn btn--sm", onclick: function () { preview("about"); }}, "Vista previa"))));
  };

  VIEWS.proyecto = function (main) {
    head(main, "Arma tu proyecto", "El formulario por pasos que termina en la claqueta. Cada paso puede ser de <b>opciones</b>, <b>texto libre</b> o <b>datos de contacto</b>.");
    var p = st.data.paginas.build = st.data.paginas.build || {};
    main.appendChild(h("div", {class: "adm-panel"},
      form([{k: "tag", l: "Etiqueta"}, {k: "asunto", l: "Asunto del correo"}, {k: "final", l: "Título al terminar", t: "textarea", rows: 2, h: RT_HELP}, {k: "enviar", l: "Botón enviar"}, {k: "editar", l: "Botón editar"}, {k: "claqueta", l: "Mostrar la claqueta al final", t: "check", def: true},
        {k: "pasos", l: "Pasos", t: "list", addLabel: "Agregar paso", title: function (s) { return s.clave + " · " + ({opciones: "opciones", texto: "texto libre", contacto: "contacto"}[s.tipo] || ""); },
          make: function () { return {clave: "NUEVO PASO", pregunta: "¿PREGUNTA?", tipo: "opciones", opciones: []}; },
          fields: [{k: "clave", l: "Nombre corto (aparece en el resumen)"}, {k: "pregunta", l: "Pregunta", h: RT_HELP}, {k: "tipo", l: "Tipo de paso", t: "select", o: [["opciones", "Opciones (botones)"], ["texto", "Texto libre"], ["contacto", "Datos de contacto"]]},
            {k: "opciones", l: "Opciones (solo para el tipo Opciones)", t: "tags"}]}], p),
      h("div", {}, h("button", {type: "button", class: "btn btn--sm", onclick: function () { preview("build"); }}, "Vista previa"))));
  };

  VIEWS.menu = function (main) {
    head(main, "Menú", "El menú a pantalla completa. Cambia los nombres, el orden o esconde páginas.");
    var opts = Object.keys(PAGE_NAMES).filter(function (k) { return k !== "project" && k !== "index"; }).map(function (k) { return [k, PAGE_NAMES[k]]; });
    main.appendChild(h("div", {class: "adm-panel"}, form([{k: "menu", l: "Elementos del menú", t: "list", addLabel: "Agregar al menú", title: function (m) { return m.texto + (m.visible === false ? " (oculto)" : ""); },
      make: function () { return {texto: "NUEVO", pagina: "discover", visible: true}; },
      fields: [{k: "texto", l: "Texto"}, {k: "pagina", l: "Página", t: "select", o: opts}, {k: "visible", l: "Visible", t: "check", def: true}]}], st.data),
      form([{k: "menu", l: "Botón del menú"}, {k: "cerrar", l: "Botón cerrar"}, {k: "cotizar", l: "Botón «cotizar» (en varias páginas)"}, {k: "colaborar", l: "Botón «colaborar»"}], st.data.botones = st.data.botones || {})));
  };

  VIEWS.contacto = function (main) {
    head(main, "Contacto y formularios", "Dónde llegan los mensajes de Contacto, Colabora y Arma tu proyecto.");
    var c = st.data.contacto = st.data.contacto || {};
    main.appendChild(h("div", {class: "adm-panel"}, form([
      {k: "email", l: "Correo de contacto", t: "email", wide: true},
      {k: "formspree", l: "Formspree (opcional)", wide: true, ph: "xyzabcd o https://formspree.io/f/xyzabcd", h: "Si lo completas, los formularios se envían directo sin abrir el correo del visitante. Crea uno gratis en formspree.io. Vacío = se abre el correo (mailto)."},
      {k: "instagram", l: "Instagram", t: "url"}, {k: "youtube", l: "YouTube", t: "url"}, {k: "tiktok", l: "TikTok", t: "url"}, {k: "whatsapp", l: "WhatsApp", ph: "+56 9 1234 5678", h: "Vacío = no se muestra."}], c)));
  };

  VIEWS.diseno = function (main) {
    head(main, "Diseño y colores", "Cambia la identidad visual de todo el sitio. Usa Vista previa para verlo antes de publicar.");
    var s = st.data.sitio = st.data.sitio || {}, col = s.colores = s.colores || {}, fu = s.fuentes = s.fuentes || {}, x = st.data.experiencia = st.data.experiencia || {};
    var sw = h("div", {class: "swatches"});
    function drawSw() { sw.innerHTML = ""; ["fondo", "gris1", "gris2", "gris3", "texto", "acento"].forEach(function (k) { sw.appendChild(h("div", {style: {background: col[k] || "#000"}, title: k})); }); }
    main.appendChild(h("div", {class: "adm-panel", style: {marginBottom: "18px"}}, h("h2", {text: "Colores"}), sw,
      form([{k: "acento", l: "Acento (rojo Redroom)", t: "color"}, {k: "fondo", l: "Fondo", t: "color"}, {k: "texto", l: "Texto", t: "color"}, {k: "gris1", l: "Gris oscuro (tarjetas)", t: "color"}, {k: "gris2", l: "Gris medio (líneas)", t: "color"}, {k: "gris3", l: "Gris claro (etiquetas)", t: "color"}], col, drawSw),
      h("div", {}, h("button", {type: "button", class: "btn btn--sm btn--ghost", onclick: function () { Object.assign(col, {fondo: "#050505", gris1: "#141414", gris2: "#2a2a2a", gris3: "#8a8a8a", texto: "#f2f2f2", acento: "#e10600"}); changed(); render(); }}, "Restaurar colores originales"))));
    drawSw();
    main.appendChild(h("div", {class: "adm-panel", style: {marginBottom: "18px"}}, h("h2", {text: "Tipografías y textura"}),
      form([{k: "titulos", l: "Títulos", t: "select", o: FONTS_T}, {k: "texto", l: "Texto", t: "select", o: FONTS_B}], fu),
      form([{k: "grano", l: "Grano de película sobre la web", t: "check", def: true}], s)));
    main.appendChild(h("div", {class: "adm-panel", style: {marginBottom: "18px"}}, h("h2", {text: "Experiencia"}),
      form([{k: "botonRojo", l: "Botón rojo (modo experiencia)", t: "check", def: true}, {k: "intervalo", l: "Segundos por trabajo en el modo experiencia", t: "number", min: 1, max: 20, step: .5},
            {k: "visor", l: "Visor de cámara que sigue el mouse", t: "check", def: true}], x, function (k, v) { if (k === "intervalo") { x.intervalo = Math.round(v * 1000) || 2800; } })));
    var iv = main.querySelectorAll('input[type=number]'); if (iv.length) { iv[iv.length - 1].value = (x.intervalo || 2800) / 1000; }
    main.appendChild(h("div", {class: "adm-panel"}, h("h2", {text: "Nombre y buscadores"}),
      form([{k: "nombre", l: "Nombre de la productora"}, {k: "tituloSEO", l: "Título en Google / pestaña", wide: true}, {k: "descripcionSEO", l: "Descripción en Google", t: "textarea", rows: 2}], s)));
  };

  VIEWS.ajustes = function (main) {
    head(main, "Sensaciones y Modo Director", "Las sensaciones alimentan el buscador «¿Qué quieres sentir?». Asígnalas a cada video en Portafolio.");
    main.appendChild(h("div", {class: "adm-panel", style: {marginBottom: "18px"}}, h("h2", {text: "Sensaciones"}), form([{k: "sensaciones", l: "Lista de sensaciones", t: "tags"}], st.data),
      h("small", {class: "faint", text: "Solo aparecen en la web las sensaciones que tiene al menos un video."})));
    main.appendChild(h("div", {class: "adm-panel"}, h("h2", {text: "Modo Director"}), h("p", {class: "muted", text: "Las pestañas de la ficha de cada video. Cada modo muestra los créditos cuyo rol contiene alguna de sus palabras clave (o la nota escrita a mano en el video)."}),
      form([{k: "modoDirector", l: "Modos", t: "list", addLabel: "Agregar modo", title: function (m) { return m.nombre; }, make: function () { return {nombre: "NUEVO", descripcion: "", palabras: []}; },
        fields: [{k: "nombre", l: "Nombre de la pestaña"}, {k: "descripcion", l: "Descripción"}, {k: "palabras", l: "Palabras clave en el rol del crédito", t: "tags"}]}], st.data)));
  };

  VIEWS.historial = function (main) {
    head(main, "Historial de versiones", "Cada publicación queda guardada (las últimas 40). Puedes cargar una versión anterior, revisarla y volver a publicarla.");
    if (st.mode !== "nube") { main.appendChild(h("p", {class: "adm-note", text: "El historial necesita conexión."})); return; }
    var box = h("div", {class: "adm-panel"}, h("p", {class: "muted", text: "Cargando…"})); main.appendChild(box);
    api("historial").then(function (r) {
      box.innerHTML = "";
      if (!r.items.length) { box.appendChild(h("p", {class: "muted", text: "Todavía no hay publicaciones desde el panel. La versión actual es la original del sitio."})); return; }
      box.appendChild(h("table", {class: "adm-table"}, h("thead", {}, h("tr", {}, h("th", {text: "Fecha"}), h("th", {text: "Cambio"}), h("th", {text: "Quién"}), h("th", {}))),
        h("tbody", {}, r.items.map(function (c, i) {
          return h("tr", {}, h("td", {text: new Date(c.ts).toLocaleString("es-CL")}), h("td", {text: c.mensaje || "—"}), h("td", {text: c.email}),
            h("td", {}, i === 0 ? h("span", {class: "pill pill--ok", text: "Actual"}) : h("button", {type: "button", class: "btn btn--sm", onclick: function () {
              confirmar("Cargar esta versión", "Se carga en el panel como cambios sin publicar. Revísala y presiona Publicar para dejarla en la web.", "Cargar").then(function (ok) {
                if (!ok) { return; }
                api("historial/" + c.v).then(function (v) { st.data = v.data; changed(); toast("Versión cargada. Publica para dejarla en la web.", "ok"); location.hash = "#/inicio"; }).catch(function (e) { toast(explain(e), "error"); });
              });
            }}, "Cargar")));
        }))));
    }).catch(function (e) { box.innerHTML = ""; box.appendChild(h("p", {class: "form-error", text: explain(e)})); });
  };

  VIEWS.respaldo = function (main) {
    head(main, "Respaldo y JSON", "Descarga una copia del contenido, restaura una copia, o edita el contenido completo en JSON (para usuarios avanzados).");
    var ta = h("textarea", {class: "textarea json", spellcheck: "false", value: JSON.stringify(st.data, null, 2)}), msg = h("p", {class: "form-error"});
    main.appendChild(h("div", {class: "adm-panel", style: {marginBottom: "18px"}},
      h("div", {class: "img-actions"},
        h("button", {type: "button", class: "btn btn--sm", onclick: function () { var a = h("a", {href: URL.createObjectURL(new Blob([JSON.stringify(st.data, null, 2)], {type: "application/json"})), download: "redroom-respaldo-" + hoy() + ".json"}); document.body.appendChild(a); a.click(); a.remove(); }}, "Descargar respaldo (.json)"),
        h("button", {type: "button", class: "btn btn--sm", onclick: function () {
          var i = h("input", {type: "file", accept: ".json,.js,application/json", style: {display: "none"}});
          i.onchange = function () { var fr = new FileReader(); fr.onload = function () { try { var t = fr.result, d = /window\.RR_DATA/.test(t) ? parseData(t) : JSON.parse(t); if (!d.paginas || !d.sitio) { throw new Error("El archivo no parece un respaldo de Redroom."); } st.data = d; changed(); toast("Respaldo cargado. Publica para dejarlo en la web.", "ok"); render(); } catch (e) { toast(e.message, "error"); } }; fr.readAsText(i.files[0]); };
          document.body.appendChild(i); i.click();
        }}, "Restaurar desde archivo"),
        h("button", {type: "button", class: "btn btn--sm", onclick: download}, "Descargar contenido.js"))));
    main.appendChild(h("div", {class: "adm-panel"}, h("h2", {text: "Editor JSON"}), ta, msg,
      h("div", {class: "adm-actions"}, h("button", {type: "button", class: "btn btn--sm btn--primary", onclick: function () {
        try { var d = JSON.parse(ta.value); if (!d.paginas || !d.sitio) { throw new Error("Falta «sitio» o «paginas»."); } st.data = d; msg.textContent = ""; changed(); toast("JSON aplicado.", "ok"); }
        catch (e) { msg.textContent = "JSON inválido: " + e.message; }
      }}, "Aplicar JSON"))));
  };

  VIEWS.cuenta = function (main) {
    head(main, "Cuenta", "");
    main.appendChild(h("div", {class: "adm-panel"},
      st.mode === "nube" ? h("div", {},
        h("p", {}, "Entraste como ", h("b", {text: st.email}), "."),
        h("p", {class: "adm-note", html: "<b>¿Quién puede entrar?</b> Los correos de la lista de Cloudflare Access. Para sumar o quitar a alguien: Cloudflare → <b>Zero Trust</b> → <b>Access controls</b> → <b>Applications</b> → <b>Panel Redroom</b> → edita la política con la lista de correos."}))
        : h("p", {text: "Modo sin conexión. Publicar descarga el archivo contenido.js."}),
      h("div", {class: "adm-actions"}, h("button", {type: "button", class: "btn btn--danger", onclick: function () {
        (isDirty() ? confirmar("Cerrar sesión", "Tienes cambios sin publicar. Quedan guardados en este equipo para la próxima vez.", "Cerrar sesión") : Promise.resolve(true)).then(function (ok) { if (ok) { if (st.mode === "nube") { logout(); } else { location.reload(); } } });
      }}, st.mode === "nube" ? "Cerrar sesión" : "Salir"))));
  };

  /* ================= Arranque ================= */
  if (location.protocol === "file:") { renderAccess({code: "NO_API"}); }
  else { connect().then(boot, function (e) { renderAccess(e); }); }
})();
