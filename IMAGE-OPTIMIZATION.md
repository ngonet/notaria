# 🖼️ Optimización de Imágenes — Pasos Finales

## Estado Actual

✅ **Completado:**
- H1 agregado al HTML estático
- Meta robots explícito agregado
- Width/height agregados a todas las imágenes en componentes
- OG image separada creada (`og-image.jpg`)

⚠️ **Pendiente (requiere herramientas):**
- Comprimir imágenes a WebP
- Optimizar OG image a 1200×630

---

## Paso 1: Instalar Herramientas

### macOS (Homebrew)
```bash
brew install webp imagemagick
```

### Ubuntu/Debian
```bash
sudo apt-get install webp imagemagick
```

### Verificar instalación
```bash
which cwebp convert
```

---

## Paso 2: Crear OG Image Optimizada (1200×630)

```bash
# Usar ImageMagick convert para cropear y redimensionar
convert /home/ngo/Desktop/notaria/public/images/header_one.jpg \
  -resize 1200x630 \
  -gravity center \
  -background '#0f2c49' \
  -extent 1200x630 \
  -quality 85 \
  /home/ngo/Desktop/notaria/public/images/og-image.jpg
```

**Resultado esperado:** imagen 1200×630, ~80-100KB

---

## Paso 3: Convertir a WebP

### Header images
```bash
cd /home/ngo/Desktop/notaria/public/images

# Convertir header_one.jpg
cwebp -q 80 header_one.jpg -o header_one.webp

# Convertir header_two.jpg
cwebp -q 80 header_two.jpg -o header_two.webp

# Convertir og-image.jpg
cwebp -q 85 og-image.jpg -o og-image.webp
```

**Beneficio:** Reducción de ~40-50% en tamaño (1920×500 JPEG ~13KB → WebP ~6-7KB)

### PNG images
```bash
# Convertir PNG a WebP
cwebp -q 80 compromiso.png -o compromiso.webp
cwebp -q 80 fojas2.png -o fojas2.webp
cwebp -q 80 team.png -o team.webp
```

---

## Paso 4: Actualizar HTML para Usar WebP

Una vez creados los archivos `.webp`, actualizar los componentes para usar fallback:

### hero.ts
```typescript
// Cambiar:
<img src="${slide.image}" alt="${slide.alt}" ... />

// A:
<picture>
  <source srcset="${slide.image.replace('.jpg', '.webp')}" type="image/webp" />
  <img src="${slide.image}" alt="${slide.alt}" ... />
</picture>
```

### about.ts
```typescript
// Cambiar imagen compromiso:
<picture>
  <source srcset="${commitment.image.replace('.png', '.webp')}" type="image/webp" />
  <img src="${commitment.image}" alt="${commitment.imageAlt}" ... />
</picture>
```

### documents.ts
```typescript
// Cambiar logo Fojas:
<picture>
  <source srcset="${fojas.logo.replace('.png', '.webp')}" type="image/webp" />
  <img src="${fojas.logo}" alt="Logo Fojas.cl" ... />
</picture>
```

---

## Paso 5: Verificar Tamaños

```bash
ls -lh /home/ngo/Desktop/notaria/public/images/

# Comparar:
# header_one.jpg vs header_one.webp
# og-image.jpg vs og-image.webp
```

---

## Paso 6: Commit y Deploy

```bash
cd /home/ngo/Desktop/notaria

git add public/images/*.webp src/components/*.ts index.html
git commit -m "fix(seo): convert images to webp, add picture tags, optimize og-image"
git push
```

---

## Metricas Esperadas

| Antes | Después | Mejora |
|-------|---------|--------|
| ~13KB JPEG (header) | ~6KB WebP | -54% |
| LCP ~3s | LCP <2.5s | -20% |
| CLS ~0.1 | CLS <0.05 | -50% |

---

## Troubleshooting

### ❌ "cwebp: command not found"
Instalar WebP utilities:
```bash
# macOS
brew install webp

# Ubuntu/Debian
sudo apt-get install webp
```

### ❌ "convert: command not found"
Instalar ImageMagick:
```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick
```

### ❌ Imágenes WebP muy grandes
Reducir calidad en cwebp:
```bash
cwebp -q 70 image.jpg -o image.webp  # Quality 70 instead of 80
```

### ❌ OG image distorsionada
Si la image sale estirada, usar aspect-ratio preserving:
```bash
convert header_one.jpg \
  -resize 1200x630 \
  +repage \
  -background '#0f2c49' \
  -gravity center \
  -extent 1200x630 \
  og-image.jpg
```

---

## Validación Post-Optimización

1. **Verificar en PageSpeed Insights:** https://pagespeed.web.dev
   - LCP debe bajar
   - INP debe mejorar
   
2. **Verificar OG preview:** https://metatags.io/?url=https://notariamelipilla.cl

3. **Validar WebP soporte:** https://caniuse.com/webp (>95% browsers)

---

## Timeline Recomendado

- **Hoy:** Commit cambios actuales (H1, meta robots, width/height)
- **Mañana:** Instalar herramientas, procesar imágenes, commit WebP
- **Día 3:** Verificar en PageSpeed Insights, ajustar si necesario

---

Total de mejora esperada: **+20-25 puntos SEO**
