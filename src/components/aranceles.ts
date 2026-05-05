import { site } from "@/content/site";

export function renderAranceles(): string {
  const { eyebrow, heading, lead, documents, disclaimer } = site.aranceles;

  return `
    <section id="aranceles" class="scroll-mt-24" aria-labelledby="aranceles-heading">
      <header class="mx-auto max-w-3xl text-center">
        <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${eyebrow}</p>
        <h3 id="aranceles-heading" class="mt-3 font-display text-2xl text-navy md:text-3xl">${heading}</h3>
        <p class="mt-4 text-base text-muted md:text-lg">${lead}</p>
      </header>

      <ul class="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        ${documents
          .map(
            (document) => `
              <li class="flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card">
                <h4 class="font-display text-lg font-semibold text-navy">${document.title}</h4>
                <p class="mt-3 flex-1 text-sm leading-relaxed text-muted">${document.description}</p>
                <a class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 hover:underline" href="${document.href}" target="_blank" rel="noopener noreferrer">
                  ${document.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            `,
          )
          .join("")}
      </ul>

      <div class="mx-auto mt-10 max-w-3xl text-center">
        <p class="text-xs leading-relaxed text-muted">${disclaimer}</p>
      </div>
    </section>
  `;
}
