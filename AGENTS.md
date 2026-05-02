# AGENTS.md

## Stack and Boundaries
- Root app is a Vite 7 + vanilla TypeScript frontend; Firebase Functions is a separate Node 22 package under `functions/`.
- Install deps per package: `npm ci` at repo root and `npm --prefix functions ci` for the backend.
- `dist/` is generated output for Firebase Hosting. Do not hand-edit it.

## Entry Points
- Frontend composition root is `src/main.ts`; it lazy-loads section mounts from `src/components/*` via `[data-mount]` in `index.html`.
- Site copy and business content live centrally in `src/content/site.ts`. Update that file before editing component text inline.
- Calendar data is fetched client-side from same-origin `/api/calendar/events`; Hosting rewrites that path to the `calendarProxy` function.

## Commands
- Dev frontend only: `npm run dev`
- Full local Firebase flow: `firebase emulators:start --only functions,hosting`
- Verify frontend formatting + types exactly like CI: `npm run check`
- Production frontend build: `npm run build`
- Functions build only: `npm --prefix functions run build`

## Verification Order
- CI order is: install root deps -> install `functions/` deps -> `npm --prefix functions run build` -> `npm run check` -> `npm run build`.
- There is no test suite configured. Do not claim tests passed; use the build/check commands above.

## Firebase and Secrets
- Firebase project is `notaria-melipilla` from `.firebaserc`.
- `functions/src/index.ts` and `firebase.json` must stay aligned on region `us-central1` and function id `calendarProxy`.
- Google Calendar API key is a Firebase Functions secret named `GOOGLE_CALENDAR_API_KEY`, accessed with `defineSecret(...)`; do not move it to frontend env vars or inline config.
- Manual deploy target is `firebase deploy --only hosting,functions --project notaria-melipilla` after building both packages.

## Repo-Specific Gotchas
- CI checks for leaked Google API keys with `rg -F 'AIzaSy' dist/`; run that check yourself if you touch calendar or deploy-related code.
- `firebase.json` also builds functions on deploy via predeploy, but CI explicitly builds `functions/` first; preserve that workflow when validating changes.
- Vite build uses `sourcemap: false`; do not expect generated source maps in `dist/`.
