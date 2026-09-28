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

## Cloud Function: deedLookup

`functions/src/index.ts` expone `POST /api/consulta` (región
`southamerica-west1`, `maxInstances: 3`): busca una escritura o documento
comercio por número de repertorio, consultando directamente la base de datos
de notIA a través de un rol de solo lectura (`consulta_ro`, vista
`public_consulta` — ver `notia/docs/deploy.md`, sección "Public consulta").
No expone la API interna de notIA (VPN-only) ni datos personales:
solo repertorio, fecha, materia y foja.

Requiere App Check (header `X-Firebase-AppCheck`, igual que `contactForm`) y
aplica un rate limit en memoria por IP (20 solicitudes/minuto por instancia).

Setup manual, una vez (fuera de este repo, en el proyecto `notia-b8f87`):

```bash
# 1. Rol de solo lectura ya creado por la migración 0019 de notia; falta
#    habilitar login con contraseña (ver notia/docs/deploy.md):
gcloud sql connect notia-db --project=notia-b8f87 --user=notia
# en psql: ALTER ROLE consulta_ro LOGIN PASSWORD '<strong-password>';

# 2. Secret en este proyecto (notaria-melipilla):
firebase functions:secrets:set CONSULTA_DB_PASSWORD

# 3. La cuenta de servicio de las Functions de notaria-melipilla necesita
#    permiso para conectarse al Cloud SQL de notia-b8f87:
gcloud projects add-iam-policy-binding notia-b8f87 \
  --member="serviceAccount:<notaria-melipilla-functions-sa-email>" \
  --role="roles/cloudsql.client"
```

La conexión usa `@google-cloud/cloud-sql-connector` con IP pública (requiere
que la instancia `notia-db` tenga IP pública habilitada con SSL forzado, que
es el estado por defecto documentado en `notia/docs/deploy.md`). Si esa
instancia pasa a IP privada exclusiva, `deedLookup` necesitará
`ipType: IpAddressTypes.PRIVATE` y un conector de Serverless VPC Access.

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
- `firebase.json` publica `dist/` y declara los rewrites `/api/calendar/**` → `calendarProxy`, `/api/contact` → `contactForm` (region `us-central1`, el default de `setGlobalOptions` en `functions/src/index.ts`) y `/api/consulta` → `deedLookup` (region `southamerica-west1`, fijada por función — más cerca de la base de datos de notIA en ese mismo proyecto/región).
- Cada función con region distinta al default debe fijarla explícitamente en sus propias opciones (`onRequest({ region: ... })`) y mantenerla alineada con su rewrite en `firebase.json`.

## Notas de migración

El sitio anterior usaba Bootstrap 4 + jQuery + FullCalendar 5 servido como artefactos compilados sin sourcemaps, con la API key embebida en `js/bundle.js`. Esta versión reconstruye todo el frontend con stack moderno y mueve la key al backend.
