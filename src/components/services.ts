import { site } from "@/content/site";
import { renderAranceles } from "./aranceles";

const ICONS: Record<string, string> = {
	newspaper: `<path d="M4 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" /><path d="M9 7h6M9 11h6M9 15h4" /><path d="M19 7h2v10a2 2 0 0 1-2 2" />`,
	file: `<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>`,
	users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
	eraser: `<path d="m17 14 3-3-7-7-9 9 4 4h6"/><path d="M14 21h7"/><path d="m9 11 4 4"/>`,
};

function svg(name: keyof typeof ICONS): string {
	return `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${ICONS[name] ?? ""}
    </svg>
  `;
}

export function mountServices(el: HTMLElement): void {
	const { primary, notary, secondary } = site.services;

	el.innerHTML = `
    <div class="mx-auto max-w-(--container-content) px-6 py-20 md:py-28">
      <header class="mx-auto max-w-3xl text-center">
        <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">Servicios</p>
        <h2 id="servicios-heading" class="mt-3 font-display text-3xl text-navy md:text-4xl">Trámites notariales con respaldo y experiencia</h2>
        <p class="mt-4 text-base text-muted md:text-lg">Atención personalizada en escrituras públicas, instrumentos privados y trámites del Conservador de Comercio.</p>
      </header>

      <ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        ${primary
					.map(
						(item) => `
              <li class="group rounded-card border border-line bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:border-gold/60">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-navy transition group-hover:bg-gold/15 group-hover:text-navy">
                  <span class="font-display text-base font-semibold">0${primary.indexOf(item) + 1}</span>
                </div>
                <h3 class="mt-5 font-display text-lg font-semibold text-navy">${item.title}</h3>
                <p class="mt-3 text-sm leading-relaxed text-muted">${item.description}</p>
              </li>
            `,
					)
					.join("")}
      </ul>

      <article class="mt-16 grid gap-10 rounded-card border border-line bg-navy px-8 py-12 text-white md:grid-cols-[1fr_1.2fr] md:items-center md:px-12">
        <div>
          <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">Notario titular</p>
          <h3 class="mt-3 font-display text-2xl md:text-3xl">${notary.name}</h3>
          <p class="mt-2 text-base text-white/75">${notary.role}</p>
          ${
						notary.substituteNotaries?.length
							? `
              <div class="mt-6">
                <p class="font-display text-xs uppercase tracking-[0.22em] text-gold/85">Notarios suplentes</p>
                <ul class="mt-3 space-y-1 text-sm text-white/85">
                  ${notary.substituteNotaries.map((name) => `<li>${name}</li>`).join("")}
                </ul>
              </div>
            `
							: ""
					}
          ${
						notary.prosecutor
							? `
              <div class="mt-6">
                <p class="font-display text-xs uppercase tracking-[0.22em] text-gold/85">${notary.prosecutor.label}</p>
                <p class="mt-2 text-sm text-white/85">${notary.prosecutor.name}</p>
                <p class="mt-1 text-sm text-white/75">${notary.prosecutor.office}</p>
              </div>
            `
							: ""
					}
        </div>
        <p class="text-sm leading-relaxed text-white/85 md:text-base">
          ${notary.decree.text}.
          <a class="ml-1 inline-flex items-center gap-1 font-semibold text-gold underline-offset-4 hover:underline" href="${notary.decree.href}" target="_blank" rel="noopener noreferrer">
            Ver decreto
            <span aria-hidden="true">↗</span>
          </a>
        </p>
      </article>

      <ul class="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        ${secondary
					.map(
						(item) => `
              <li class="rounded-card border border-line bg-surface p-6 shadow-card">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-navy">${svg(item.icon)}</div>
                <h3 class="mt-5 font-display text-lg font-semibold text-navy">${item.title}</h3>
                <p class="mt-3 text-sm leading-relaxed text-muted">${item.description}</p>
              </li>
            `,
					)
					.join("")}
      </ul>

      <div class="mt-20 md:mt-24 border-t border-line/60 pt-16 md:pt-20">
        ${renderAranceles()}
      </div>
    </div>
  `;
}
