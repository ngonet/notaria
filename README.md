# Notaría Martínez

Sitio de Notaría Martínez (Melipilla) — Vite + TypeScript vanilla + Tailwind CSS v4. Desplegado en Firebase Hosting con una Cloud Function v2 que oculta la API key de Google Calendar.

- Producción: <https://notariamelipilla.cl>
- Espejo Firebase: <https://notaria-melipilla.web.app>

## Stack

| Capa          | Tecnología                            |
| ------------- | ------------------------------------- |
| Build         | Vite 7                                |
| Lenguaje      | TypeScript 5 (strict)                 |
| CSS           | Tailwind v4 (`@tailwindcss/vite`)     |
| Calendario    | FullCalendar 6 (dynamic import lazy)  |
| Backend proxy | Firebase Cloud Functions v2 (Node 22) |
| Deploy        | Firebase Hosting + Functions          |

## Requisitos

- Node.js 22
- npm 10+
- Firebase CLI (solo para emuladores y deploy manual)
- Plan **Blaze** en Firebase (Cloud Functions exige Blaze)

## Estructura

```
src/
  main.ts                 # composition root
  styles/tailwind.css     # tokens (@theme) + base styles
  content/site.ts         # única fuente de copy (textos, contacto, equipo, etc.)
  components/             # mountX(el): void por sección
  lib/                    # utilidades (fetch al proxy)
public/                   # favicons, manifest, /images/*
  functions/                # Cloud Functions calendarProxy, contactForm y mountFailureTelemetry
dist/                     # output de vite build (publicado por Firebase)
```

## Desarrollo

```bash
npm install
npm --prefix functions install

npm run dev                              # Vite en :5173
firebase emulators:start --only functions,hosting   # con Function local
```

El frontend hace `fetch('/api/calendar/events?…')` con un token limitado de App Check — same-origin gracias al rewrite de Firebase Hosting hacia `calendarProxy`.

## Contratos HTTP públicos

Firebase Hosting enruta los endpoints same-origin a Functions en `us-central1`. Los clientes web deben obtener un token limitado de App Check y enviarlo como `X-Firebase-AppCheck`; no deben llamar las URLs directas de Cloud Functions.

### `POST /api/contact`

Envía un reclamo o consulta. El cliente establece `Content-Type: application/json`, agrega `X-Firebase-AppCheck`, espera hasta 10 segundos y puede reintentar después de cualquier respuesta no exitosa o timeout.

```http
POST /api/contact
Content-Type: application/json
X-Firebase-AppCheck: <limited-use-token>

{"name":"Ada Lovelace","email":"ada@example.com","phone":"+56 9 1234 5678","subject":"Reclamo","message":"Necesito ayuda."}
```

Respuesta exitosa: `200 {"success":true}`. Errores: `400 missing_fields|invalid_email`, `401 app_check_required`, `403 app_check_invalid|app_check_replay`, `405 method_not_allowed`, `500 missing_credentials` y `502 email_send_failed`. El formulario conserva sus datos y vuelve a habilitar el envío al fallar.

### `POST /api/telemetry/mount-failure`

Registra un fallo de montaje del frontend. Solo acepta el origen permitido, App Check y un identificador de montaje ASCII de 1 a 64 caracteres; no acepta ni almacena el mensaje de excepción ni datos de formulario.

```http
POST /api/telemetry/mount-failure
Content-Type: application/json
X-Firebase-AppCheck: <limited-use-token>

{"mount":"contact"}
```

Respuesta exitosa: `204` sin cuerpo. Errores: `400 invalid_mount`, `401 app_check_required`, `403 origin_not_allowed|app_check_invalid|app_check_replay`, `405 method_not_allowed` y `500 telemetry_unavailable`. El listener del navegador la emite sin bloquear el fallback visual, con timeout de 3 segundos; los clientes no deben reintentarla.

### `GET /api/calendar/events`

Entrega solo `id`, `start`, `end` y `calendarSource` (`attention|holiday`); no expone summaries ni el payload de Google Calendar. Requiere un origen permitido y `X-Firebase-AppCheck` con token limitado. Errores: `400 invalid_time_range`, `401 app_check_required`, `403 origin_not_allowed|app_check_invalid|app_check_replay`, `405 method_not_allowed` y `502 calendar_upstream_error|upstream_failed`.

El cliente aplica timeout de 5 segundos y, solo ante una falla transitoria, hace un segundo intento con un token fresco. Si ambos fallan, ofrece un botón para reintentar y emite telemetría de fallo sin impedir que carguen las demás secciones.

## Verificación

```bash
npm run typecheck
npm run test        # pruebas unitarias del frontend
npm --prefix functions run test # pruebas de contrato de Functions
npm run check       # tsc + prettier
npm run build       # tsc + vite build → dist/
```

Antes de cada deploy CI verifica que **no haya API keys filtradas**. El web
apiKey de Firebase (`AIzaSyAn2A...`) es público por diseño y debe estar en el
bundle para App Check, así que está en allowlist; cualquier otra key `AIzaSy*`
(p. ej. el `GOOGLE_CALENDAR_API_KEY`) hace fallar el check:

```bash
# debe retornar 0 (ninguna key no-allowlisted)
rg -o 'AIzaSy[0-9A-Za-z_-]+' dist/ | sort -u \
  | grep -vF 'AIzaSyAn2A233ZY1y6C85uJvntgZFbENmWGg9C0'
```

## Cloud Function: calendarProxy

`functions/src/index.ts` expone `GET /api/calendar/events?timeMin=ISO&timeMax=ISO`. Lee la key como **secret** (no `process.env`):

```bash
# Set una sola vez (queda en Google Secret Manager):
firebase functions:secrets:set GOOGLE_CALENDAR_API_KEY

# Visualizar:
firebase functions:secrets:access GOOGLE_CALENDAR_API_KEY
```

Restricciones de la key en Google Cloud Console:

- API restringida: solo **Google Calendar API**.
- Restricción de aplicación: **None** (la key vive en backend, no en navegadores). Si en algún momento se reutiliza para otro propósito frontend, agregar referrers.

## Deploy

### Automático (GitHub Actions)

- `firebase-hosting-merge.yml` corre en push a `main`: build + leak check + deploy de hosting y functions al canal `live`.
- `firebase-hosting-pull-request.yml` despliega preview por PR (solo hosting).

Secret necesario en el repo: `FIREBASE_SERVICE_ACCOUNT_NOTARIA_MELIPILLA` (JSON de service account con roles Hosting Admin + Cloud Functions Admin + Service Account User).

### Manual

```bash
npm run build
npm --prefix functions run build
firebase deploy --only hosting,functions --project notaria-melipilla
```

## Firebase

- Proyecto: `notaria-melipilla` (`.firebaserc`).
- `firebase.json` publica `dist/` y declara rewrites para `/api/calendar/**`, `/api/contact` y `/api/telemetry/mount-failure` (region `us-central1`).
- Region debe coincidir con `setGlobalOptions({ region: 'us-central1' })` en `functions/src/index.ts`.

## Notas de migración

El sitio anterior usaba Bootstrap 4 + jQuery + FullCalendar 5 servido como artefactos compilados sin sourcemaps, con la API key embebida en `js/bundle.js`. Esta versión reconstruye todo el frontend con stack moderno y mueve la key al backend.
