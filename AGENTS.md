# AGENTS.md

## Stack and Boundaries
- Root app is a Vite 7 + vanilla TypeScript frontend; Firebase Functions is a separate Node 22 package under `functions/`.
- Install deps per package: `npm ci` at repo root and `npm --prefix functions ci` for the backend.
- `dist/` is generated output for Firebase Hosting. Do not hand-edit it.

## Entry Points
- Frontend composition root is `src/main.ts`; it lazy-loads section mounts from `src/components/*` via `[data-mount]` in `index.html`.
- Site copy and business content live centrally in `src/content/site.ts`. Update that file before editing component text inline.
- Calendar data is fetched client-side from same-origin `/api/calendar/events`; Hosting rewrites that path to the `calendarProxy` function.
- `/documentos/` is not built here: CI checks out `ngonet/notaria-documentos` (`main`), runs `pnpm build:public` and copies its `dist-public/` to `dist/documentos/`. The forms load the wording an admin published in Notia from same-origin `/api/documentos/plantillas`, rewritten to the `publishedTemplates` function (`southamerica-west1`), which reads notIA's view `public_document_templates` as `consulta_ro`. The documents section cards link to `/documentos/#<document-id>`.

## Commands
- Dev frontend only: `npm run dev`
- Full local Firebase flow: `firebase emulators:start --only functions,hosting`
- Verify frontend formatting + types exactly like CI: `npm run check`
- Production frontend build: `npm run build`
- Functions build only: `npm --prefix functions run build`
- Functions tests: `npm --prefix functions test`
- Frontend tests: `npm test` (Vitest + jsdom, `src/**/*.test.ts`)

## Verification Order
- CI order is: install root deps -> install `functions/` deps -> `npm --prefix functions run build` -> `npm --prefix functions test` -> `npm run check` -> `npm test` -> `npm run build`.
- Both packages have Vitest tests: `functions/src/*.test.ts` (`npm --prefix functions test`) and the frontend `src/**/*.test.ts` (`npm test`, jsdom).

## Firebase and Secrets
- Firebase project is `notaria-melipilla` from `.firebaserc`.
- Each `firebase.json` function rewrite must target a region listed for its function in `functions/src/regions.ts` (`FUNCTION_REGIONS`); `functions/src/regions.test.ts` checks it. `calendarProxy` uses the `setGlobalOptions` default `us-central1`; `contactForm`, `deedLookup` and `publishedTemplates` run in `southamerica-west1`. A Hosting preview can only rewrite to a function that already exists in that region, so moving a rewrite to a new region takes two deploys: add the region first, move the rewrite after.
- Google Calendar API key is a Firebase Functions secret named `GOOGLE_CALENDAR_API_KEY`, accessed with `defineSecret(...)`; do not move it to frontend env vars or inline config.
- CI needs the secret `NOTARIA_DOCUMENTOS_DEPLOY_KEY` (private half of a read-only deploy key on the private `ngonet/notaria-documentos`). The merge workflow also runs on `repository_dispatch` `documentos-updated`, sent by notaria-documentos after it deploys.
- Manual deploy target is `firebase deploy --only hosting,functions --project notaria-melipilla` after building both packages.

## Repo-Specific Gotchas
- CI checks for leaked Google API keys by extracting every `AIzaSy*` token from `dist/` and failing on any that is not the allowlisted public Firebase web apiKey (`AIzaSyAn2A233ZY1y6C85uJvntgZFbENmWGg9C0`, required in the bundle for App Check). The `GOOGLE_CALENDAR_API_KEY` secret must never appear in `dist/`. Run the check yourself if you touch calendar, App Check, or deploy-related code.
- `firebase.json` also builds functions on deploy via predeploy, but CI explicitly builds `functions/` first; preserve that workflow when validating changes.
- Vite build uses `sourcemap: false`; do not expect generated source maps in `dist/`.
