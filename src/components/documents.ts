import { site } from "@/content/site";

const ICONS: Record<string, string> = {
  check: `<path d="M20 6 9 17l-5-5"/>`,
  plane: `<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>`,
  bolt: `<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/>`,
  bookmark: `<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z"/>`,
};

function svg(name: keyof typeof ICONS): string {
  return `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${ICONS[name] ?? ""}
    </svg>
  `;
}

export function mountDocuments(el: HTMLElement): void {
  const { heading, lead, downloads, fojas } = site.documents;

  el.innerHTML = `
    <div class="mx-auto max-w-(--container-content) px-6 py-20 md:py-28">
      <header class="mx-auto max-w-3xl text-center">
        <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">Documentos</p>
        <h2 id="documentos-heading" class="mt-3 font-display text-3xl text-navy md:text-4xl">${heading}</h2>
        <p class="mt-4 text-base text-muted md:text-lg">${lead}</p>
      </header>

      <ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        ${downloads
          .map(
            (doc) => `
              <li class="flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:border-gold/60">
                <span class="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-navy">${svg(doc.icon)}</span>
                <h3 class="mt-5 font-display text-lg font-semibold text-navy">${doc.title}</h3>
                <p class="mt-3 flex-1 text-sm leading-relaxed text-muted">${doc.description}</p>
                <a
                  href="${doc.href}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 hover:underline"
                >
                  Descargar PDF
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            `,
          )
          .join("")}
      </ul>

      <article class="mt-16 grid gap-10 rounded-card border border-line bg-surface px-8 py-12 shadow-card md:grid-cols-[1.2fr_1fr] md:items-center md:px-12">
        <div>
          <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">Portal Fojas</p>
          <h3 class="mt-3 font-display text-2xl text-navy md:text-3xl">${fojas.heading}</h3>
          <p class="mt-4 text-sm leading-relaxed text-muted md:text-base">${fojas.body}</p>
          <a
            href="${fojas.href}"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-6 inline-flex items-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-light"
          >
            Ir a Fojas.cl
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div class="flex items-center justify-center">
          <picture>
            <source srcset="${fojas.logo.replace(/\.(jpg|png)$/, '.webp')}" type="image/webp" />
            <img src="${fojas.logo}" alt="Logo Fojas.cl" loading="lazy" decoding="async" width="200" height="128" class="max-h-32 w-auto" />
          </picture>
        </div>
      </article>
    </div>
  `;
}
