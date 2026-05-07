import { site } from "@/content/site";

export function mountFooter(el: HTMLElement): void {
  const c = site.contact;

  el.innerHTML = `
    <footer class="bg-navy text-white">
      <div class="mx-auto grid max-w-(--container-content) gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p class="font-display text-xl font-semibold">${site.brand}</p>
          <p class="mt-2 text-sm text-white/70">${site.tagline}</p>
          <p class="mt-6 text-sm text-white/70">${c.street} · ${c.city}</p>
          <a class="mt-2 inline-block text-sm font-semibold text-gold hover:text-gold-soft" href="tel:${c.phoneE164}">${c.phoneDisplay}</a>
        </div>

        <nav aria-label="Enlaces de pie">
          <p class="font-display text-sm uppercase tracking-[0.22em] text-gold">Sitio</p>
          <ul class="mt-4 space-y-2 text-sm text-white/80">
            ${site.nav
              .map(
                (link) => `
                  <li><a class="hover:text-white" href="${link.href}">${link.label}</a></li>
                `,
              )
              .join("")}
          </ul>
        </nav>

        <div>
          <p class="font-display text-sm uppercase tracking-[0.22em] text-gold">Atención</p>
          <ul class="mt-4 space-y-2 text-sm text-white/80">
            <li>${c.schedule.weekdays}</li>
            <li>${c.schedule.saturdays}</li>
            <li><a class="hover:text-white" href="mailto:${c.email}">${c.email}</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10">
        <div class="mx-auto flex max-w-(--container-content) flex-col items-center gap-2 px-6 py-6 text-center text-xs text-white/60 sm:flex-row sm:justify-between">
          <p>${site.footer.copyright}</p>
          <a class="hover:text-white/80 underline underline-offset-2" href="${site.footer.transparency.href}" target="_blank" rel="noopener noreferrer">${site.footer.transparency.label} ↗</a>
        </div>
      </div>
    </footer>
  `;
}
