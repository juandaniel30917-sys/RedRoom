# REDROOM · Panel de administración (/admin)

```
index.html, discover.html, …   ← la web
css/  js/                      ← diseño y código
data/contenido.js              ← contenido ORIGINAL (punto de partida)
admin/                         ← el panel (tusitio/admin)
worker/index.js                ← servidor de Cloudflare: guarda lo que publicas y protege la API
wrangler.jsonc                 ← configuración del Worker (nombre, almacenamiento, Access)
```

- **Quién entra:** solo los correos que tú pongas en Cloudflare Access. Cada persona escribe su correo, le llega un código de 6 dígitos y entra. No hay tokens ni contraseñas.
- **Dónde se guarda:** en Cloudflare (almacenamiento KV `redroom-contenido`). Al presionar **Publicar cambios** la web cambia en segundos, sin pasar por GitHub.
- GitHub sigue guardando el **código** del sitio. El contenido editado desde el panel vive en Cloudflare. Respáldalo cuando quieras en *Respaldo y JSON*.

## Activar el ingreso con correo (una sola vez, ~10 minutos)

1. Entra a https://one.dash.cloudflare.com (Zero Trust). La primera vez te pide un **nombre de equipo** (por ejemplo `redroom`) y elegir el plan **Free** (gratis hasta 50 personas).
2. Ve a **Access controls → Applications → Create new application → Self-hosted and private**.
3. Nombre: `Panel Redroom`.
4. **Add public hostname**:
   - Subdomain: `redroom`
   - Domain: tu dominio `….workers.dev` (el mismo de la web)
   - Path: `admin`
5. En **Access policies → Create new policy**:
   - Nombre: `Correos autorizados`, Action: **Allow**
   - Include → Selector **Emails** → escribe cada correo autorizado.
6. Métodos de ingreso: deja activado **One-time PIN** (el código por correo).
7. Guarda la aplicación.
8. Copia dos datos y envíaselos a Claude (o pégalos tú en `wrangler.jsonc`, en `vars`):
   - **Application Audience (AUD) Tag**: en la aplicación → *Overview* / *Basic information*.
   - **Team domain**: en *Settings → Team name and domain*, por ejemplo `https://redroom.cloudflareaccess.com`.

Cuando esos dos datos están en `wrangler.jsonc` y se publica, el panel queda funcionando en `tusitio/admin`.

## Sumar o quitar personas

Zero Trust → **Access controls → Applications → Panel Redroom → Policies → Correos autorizados** → agrega o borra correos → Save. Funciona al instante. La persona no necesita cuenta de GitHub ni de Cloudflare.

## Cómo se trabaja

1. Entra a `tusitio/admin`, escribe tu correo y el código que te llega.
2. Edita en cualquier sección. Arriba aparece **Cambios sin publicar**. Se guardan solos en tu navegador por si cierras la pestaña.
3. **Vista previa** abre la web con tus cambios (barra roja abajo). Solo tú la ves.
4. **Publicar cambios** los deja en la web al instante.
5. **Historial** guarda las últimas 40 publicaciones con quién y cuándo, y permite volver a cualquiera.

## Qué se puede cambiar desde el panel

| Sección | Qué edita |
|---|---|
| Portafolio | Videos: link de YouTube, título, fecha, categoría, sensaciones, créditos, destacado, oculto, portada propia, notas del Modo Director |
| Mapa interactivo | Puntos (arrastrar, crear con clic, conectar, borrar), tipos de punto, silueta de la región, textos de la página |
| Textos de las páginas | Títulos, etiquetas y botones de todas las páginas, y los campos de los formularios |
| Servicios | Bloques de Comercial y Artístico |
| Nosotros · equipo | Personas, roles, biografías y fotos (se suben y optimizan solas) |
| Arma tu proyecto | Pasos, preguntas, opciones y claqueta |
| Menú | Nombres, orden y páginas visibles |
| Contacto | Correo, redes, WhatsApp, Formspree (envío directo de formularios) |
| Diseño | Colores, tipografías, grano, botón rojo, visor, nombre y textos para Google |
| Sensaciones y Modo Director | Lista de sensaciones y pestañas del Modo Director |
| Respaldo y JSON | Descargar o restaurar una copia, o editar todo en JSON |

En los títulos, `*asteriscos*` pintan palabras con el color de acento y Enter hace un salto de línea.

## Seguridad

- Cloudflare Access pide el correo antes de mostrar `/admin`.
- Además, el Worker comprueba en cada guardado la firma de Cloudflare Access (equipo y AUD). Aunque alguien encontrara la dirección de la API, sin una sesión válida de un correo autorizado no puede cambiar nada.

## Sin internet

Si abres `admin/index.html` desde tu computador, puedes usar **Trabajar sin conexión**: editas y «Publicar» descarga `contenido.js`.
