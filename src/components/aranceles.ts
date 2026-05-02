import { site } from "@/content/site";

export function mountAranceles(el: HTMLElement): void {
  const { heading, lead, areas, disclaimer } = site.aranceles;

  el.innerHTML = `
    <div class="border-y border-line bg-surface">
      <div class="mx-auto max-w-(--container-content) px-6 py-20 md:py-28">
        <header class="mx-auto max-w-3xl text-center">
          <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">Tarifas</p>
          <h2 id="aranceles-heading" class="mt-3 font-display text-3xl text-navy md:text-4xl">${heading}</h2>
          <p class="mt-4 text-base text-muted md:text-lg">${lead}</p>
        </header>

        <div class="mt-12 space-y-10">
          ${areas
            .map(
              (area) => `
                <div class="rounded-card border border-line bg-bg shadow-card overflow-hidden">
                  <div class="px-6 py-5 border-b border-line">
                    <h3 class="font-display text-lg font-semibold text-navy capitalize">${area.title}</h3>
                    ${area.note ? `<p class="mt-1 text-xs text-muted">${area.note}</p>` : ""}
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

        <p class="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-muted">${disclaimer}</p>
      </div>
    </div>
  `;
}
