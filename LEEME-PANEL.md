# REDROOM · Panel de administración (/admin)

```
redroom/
  index.html, discover.html, …   ← la web (no cambian al editar contenido)
  css/  js/                       ← diseño y código
  data/contenido.js               ← TODO el contenido: textos, videos, mapa, colores, menú, contacto
  admin/                          ← el panel (tusitio.com/admin)
  assets/subidas/                 ← fotos que subas desde el panel (se crea sola)
```

No usa base de datos. El panel edita `data/contenido.js` directamente en GitHub y Cloudflare vuelve a publicar la web sola (tarda 1–2 minutos).

## 1. Subir esta versión al repositorio (una sola vez)

Reemplaza los archivos del repo `juandaniel30917-sys/RedRoom` (rama `main`) por los de esta carpeta, incluidas las carpetas nuevas **data/** y **admin/**. Haz commit y push. Cloudflare publica la web nueva.

## 2. Crear tu token de GitHub (una sola vez, 2 minutos)

1. Abre https://github.com/settings/personal-access-tokens/new
2. Nombre: `Panel Redroom`. Expiración: la que prefieras (cuando venza, creas otro).
3. **Repository access → Only select repositories → RedRoom**.
4. **Permissions → Repository permissions → Contents → Read and write**.
5. Presiona **Generate token** y copia el código (`github_pat_…`). GitHub no lo vuelve a mostrar.

## 3. Entrar

Abre `https://TU-SITIO/admin`, pega el token y presiona **Entrar con GitHub**.
Marca «Recordar en este equipo» solo en tu propio computador.

## Quién puede editar

Solo quien tenga **permiso de escritura en el repositorio**. Un visitante que abra `/admin` ve la pantalla de ingreso y nada más; sin token válido no puede cambiar nada.
Para sumar a alguien (por ejemplo, Aníbal o Víctor): GitHub → RedRoom → Settings → Collaborators → Add people. Esa persona crea su propio token y entra.

## Qué se puede cambiar desde el panel

| Sección | Qué edita |
|---|---|
| Portafolio | Videos: link de YouTube, título, fecha, categoría, sensaciones, créditos, destacado, oculto, portada propia, notas del Modo Director |
| Mapa interactivo | Puntos (arrastrar, crear con clic, conectar, borrar), tipos de punto, silueta de la región, textos de la página |
| Textos de las páginas | Títulos, etiquetas y botones de todas las páginas, y los campos de los formularios |
| Servicios | Bloques de Comercial y Artístico |
| Nosotros · equipo | Personas, roles, biografías y fotos |
| Arma tu proyecto | Pasos, preguntas, opciones y claqueta |
| Menú | Nombres, orden y páginas visibles |
| Contacto | Correo, redes, WhatsApp, Formspree (envío directo de formularios) |
| Diseño | Colores, tipografías, grano, botón rojo, visor, nombre y textos para Google |
| Sensaciones y Modo Director | Lista de sensaciones y pestañas del Modo Director |
| Historial | Ver versiones anteriores y volver a cualquiera |
| Respaldo y JSON | Descargar o restaurar una copia, o editar todo en JSON |

En los títulos, `*asteriscos*` pintan palabras con el color de acento y Enter hace un salto de línea.

## Cómo se trabaja

1. Edita en cualquier sección. Arriba aparece **Cambios sin publicar**. Se guardan solos en tu navegador, así que no se pierden si cierras la pestaña.
2. **Vista previa** abre la web con tus cambios (una barra roja abajo lo indica). Solo tú la ves.
3. **Publicar cambios** los sube a GitHub y la web se actualiza en 1–2 minutos.

## Sin internet / sin token

En la pantalla de ingreso, **Trabajar sin conexión** abre el panel con el contenido local. «Publicar» descarga `contenido.js`; lo reemplazas en `data/` y lo subes a mano. En este modo no se pueden subir fotos (puedes pegar un link).

## Lo que no cambia desde el panel

El diseño de cada sección y las funciones (código). Eso se sigue editando en `js/main.js` y `css/style.css`.
