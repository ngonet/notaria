import { site } from "@/content/site";

export function renderAranceles(): string {
  const { heading, lead, areas, disclaimer, document } = site.aranceles;

  return `
    <section id="aranceles" class="scroll-mt-24" aria-labelledby="aranceles-heading">
      <header class="mx-auto max-w-3xl text-center">
        <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">Tarifas</p>
        <h3 id="aranceles-heading" class="mt-3 font-display text-2xl text-navy md:text-3xl">${heading}</h3>
        <p class="mt-4 text-base text-muted md:text-lg">${lead}</p>
      </header>

      <div class="mt-12 space-y-10">
        ${areas
          .map(
            (area) => `
              <div class="rounded-card border border-line bg-bg shadow-card overflow-hidden">
                <div class="px-6 py-5 border-b border-line">
                  <h4 class="font-display text-lg font-semibold text-navy capitalize">${area.title}</h4>
                  ${area.note ? `<p class="mt-1 text-xs text-muted">${area.note}</p>` : ""}
                  ${
                    area.source
                      ? `<a class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-navy underline-offset-4 hover:underline" href="${area.source.href}" target="_blank" rel="noopener noreferrer">Fuente oficial: ${area.source.label}<span aria-hidden="true">↗</span></a>`
                      : ""
                  }
                </div>
                <table class="w-full text-sm">
                  <thead class="sr-only">
                    <tr>
                      <th scope="col">Servicio</th>
                      <th scope="col">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${area.items
                      .map(
                        (item, i) => `
                          <tr class="${i % 2 === 0 ? "bg-bg" : "bg-surface"}">
                            <td class="px-6 py-3 text-muted leading-snug">${item.service}</td>
                            <td class="px-6 py-3 text-right font-semibold text-navy tabular-nums whitespace-nowrap">${item.amount}</td>
                          </tr>
                        `,
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            `,
          )
          .join("")}
      </div>

      <div class="mx-auto mt-10 max-w-3xl text-center">
        <p class="text-xs leading-relaxed text-muted">${disclaimer}</p>
        <a class="mt-4 inline-flex items-center gap-2 rounded-md border border-line bg-surface px-4 py-2 text-xs font-semibold text-navy shadow-card transition hover:border-gold/60" href="${document.href}" target="_blank" rel="noopener noreferrer">
          ${document.label}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  `;
}
