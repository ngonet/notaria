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
functions/                # Cloud Function calendarProxy
dist/                     # output de vite build (publicado por Firebase)
```

## Desarrollo

```bash
npm install
npm --prefix functions install

npm run dev                              # Vite en :5173
firebase emulators:start --only functions,hosting   # con Function local
```

El frontend hace `fetch('/api/calendar/events?…')` — same-origin gracias al rewrite de Firebase Hosting hacia `calendarProxy`.

## Verificación

```bash
npm run typecheck
npm run check       # tsc + prettier
npm run build       # tsc + vite build → dist/
```

Antes de cada deploy CI verifica que **no haya API keys filtradas**:

```bash
rg -F 'AIzaSy' dist/        # debe retornar 0 matches
rg -F 'AIzaSy' functions/lib/   # también 0 matches
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
- `firebase.json` publica `dist/` y declara rewrite `/api/calendar/**` → `calendarProxy` (region `us-central1`).
- Region debe coincidir con `setGlobalOptions({ region: 'us-central1' })` en `functions/src/index.ts`.

## Notas de migración

El sitio anterior usaba Bootstrap 4 + jQuery + FullCalendar 5 servido como artefactos compilados sin sourcemaps, con la API key embebida en `js/bundle.js`. Esta versión reconstruye todo el frontend con stack moderno y mueve la key al backend.
