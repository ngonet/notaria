# notaria

Sitio estático de Notaría Martínez desplegado en Firebase Hosting.

## Estructura actual

- `index.html` contiene sitio publicado.
- `css/main.css` y `js/bundle.js` son artefactos compilados actuales.
- `assets/` y `static/` contienen imágenes, iconos y manifest.
- `public/index.html` es placeholder histórico de Firebase y no representa sitio real.

## Requisitos

- Node.js 22
- npm 10+

## Instalar dependencias de desarrollo

```bash
npm ci
```

## Desarrollo local

```bash
npm run dev
```

Vite sirve archivos estáticos desde raíz del proyecto.

## Verificar formato de archivos de configuración

```bash
npm run check
```

## Formatear archivos de configuración

```bash
npm run format
```

## Deploy

- Firebase Hosting publica raíz del proyecto (`public: "."`).
- GitHub Actions ejecuta `npm ci` y `npm run check` antes de desplegar.
- Workflow de merge publica canal `live`.
- Workflow de pull request publica preview.

## Firebase

- Proyecto por defecto: `notaria-melipilla`
- Archivo principal: `firebase.json`
- Configuración de proyecto: `.firebaserc`
- `public/` ya no define contenido desplegado. Hosting publica raíz del proyecto.

## Google Calendar API

`js/bundle.js` contiene integración directa con Google Calendar y API key pública de frontend. Esa key debe estar restringida en Google Cloud por:

- HTTP referrers permitidos
- Google Calendar API como única API habilitada

### Restricciones recomendadas

- `https://notariamelipilla.cl/*`
- `https://notaria-melipilla.web.app/*`
- `https://notaria-melipilla.firebaseapp.com/*`
- dominios preview de Firebase Hosting usados por pull requests, si aplican

### Checklist en Google Cloud Console

1. Ir a **APIs y servicios > Credenciales**.
2. Abrir key usada por Google Calendar.
3. En **Restricciones de aplicación**, elegir **HTTP referrers (web sites)**.
4. Cargar dominios permitidos listados arriba.
5. En **Restricciones de API**, elegir **Restringir clave**.
6. Dejar habilitada solo **Google Calendar API**.
7. Guardar cambios y probar calendario en producción y preview.

## Próxima etapa recomendada

- Recuperar o reconstruir código fuente original.
- Migrar publicación a `dist/`.
- Actualizar Bootstrap, FullCalendar y dependencias legacy con baseline visual.
