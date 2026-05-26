import { site } from "@/content/site";
import { renderFuncionarios, setupFuncionariosModal } from "./funcionarios";

const ICONS: Record<string, string> = {
  gavel: `<path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9"/><path d="m15 13 6-6"/><path d="m9 7 6 6"/><path d="m17 5 4 4"/><path d="m13 9 4-4"/>`,
  university: `<path d="m4 10 8-5 8 5"/><path d="M5 10v8h14v-8"/><path d="M9 18v-5M12 18v-5M15 18v-5"/><path d="M3 21h18"/>`,
  cogs: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>`,
};

function timelineIcon(name: keyof typeof ICONS): string {
  return `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${ICONS[name] ?? ""}
    </svg>
  `;
}

export function mountAbout(el: HTMLElement): void {
  const { section, commitment, trajectory, timeline } = site.about;

  el.innerHTML = `
    <div class="border-y border-line bg-surface">
      <div class="mx-auto max-w-(--container-content) px-6 py-20 md:py-28">
        <header class="mx-auto max-w-3xl text-center">
          <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${section.eyebrow}</p>
          <h2 id="nosotros-heading" class="mt-3 font-display text-3xl text-navy md:text-4xl">${section.heading}</h2>
          <p class="mt-4 text-base text-muted md:text-lg">${section.lead}</p>
        </header>

        <article class="mt-16 grid gap-10 rounded-card border border-line bg-bg px-8 py-12 md:grid-cols-[1.1fr_1fr] md:items-center md:px-12">
          <div>
            <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${commitment.heading}</p>
            <h3 class="mt-3 font-display text-2xl text-navy md:text-3xl">${commitment.title}</h3>
            <p class="mt-2 text-sm text-muted md:text-base">${commitment.lead}</p>
            <p class="mt-5 text-sm leading-relaxed text-ink md:text-base">${commitment.body}</p>
          </div>
          <div class="overflow-hidden rounded-card ring-1 ring-line">
            <picture>
              <source srcset="${commitment.image.replace(/\.(jpg|png)$/, ".webp")}" type="image/webp" />
              <img src="${commitment.image}" alt="${commitment.imageAlt}" loading="lazy" decoding="async" width="400" height="400" class="h-full w-full object-cover" />
            </picture>
          </div>
        </article>

        <section class="mt-20" aria-label="${trajectory.ariaLabel}">
          <header class="mx-auto max-w-3xl text-center">
            <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${trajectory.heading}</p>
            <h3 class="mt-3 font-display text-2xl text-navy md:text-3xl">${trajectory.title}</h3>
          </header>

          <ol class="relative mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            ${timeline
              .map(
                (entry) => `
                  <li class="relative flex h-full flex-col rounded-card border border-line bg-bg p-6 shadow-card">
                    <div class="flex items-center gap-3">
                      <span class="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-gold">${timelineIcon(entry.icon)}</span>
                      <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted">${entry.period}</p>
                        <p class="font-display text-sm font-semibold text-navy">${entry.date}</p>
                      </div>
                    </div>
                    <h4 class="mt-5 font-display text-base font-semibold text-navy">${entry.title}</h4>
                    <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">${entry.description}</p>
                    ${
                      entry.link
                        ? `<a class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy underline-offset-4 hover:underline" href="${entry.link.href}" target="_blank" rel="noopener noreferrer">${entry.link.label} <span aria-hidden="true">↗</span></a>`
                        : ""
                    }
                  </li>
                `,
              )
              .join("")}
          </ol>
        </section>

        <div class="mt-20 md:mt-24 border-t border-line/60 pt-16 md:pt-20">
          ${renderFuncionarios()}
        </div>
      </div>
    </div>
  `;

  setupFuncionariosModal(el);
}
