import { site } from "@/content/site";
import { rosette } from "./icons";

export function mountFooter(el: HTMLElement): void {
  const contact = site.contact;

  el.innerHTML = `
    <footer class="relative overflow-hidden bg-dark text-white/80">
      ${rosette("pointer-events-none absolute -top-40 -right-36 h-[420px] w-[420px] text-gold opacity-25 [stroke-width:1.5]")}
      <div class="relative mx-auto flex max-w-content flex-wrap justify-between gap-8 px-6 py-10 text-sm">
        <div class="flex min-w-0 flex-[1_1_30rem] flex-col gap-1">
          <p id="footer-brand" class="font-display text-xl font-bold text-white">${site.brand}</p>
          <p>${site.tagline}</p>
          <p class="mt-2">${contact.street} · ${contact.city}</p>
          <div class="flex flex-wrap gap-x-4">
            <a class="inline-flex min-h-11 items-center font-medium text-white hover:text-accent-soft" href="tel:${contact.phoneE164}">${contact.phoneDisplay}</a>
            <a class="inline-flex min-h-11 items-center font-medium text-white hover:text-accent-soft" href="mailto:${contact.email}">${contact.email}</a>
          </div>
          <p>${contact.schedule.weekdays}<br />${contact.schedule.saturdays}</p>
        </div>

        <nav aria-labelledby="footer-brand">
          <ul class="flex max-w-xl flex-wrap gap-x-4">
            ${site.nav
              .map(
                (link) => `
                  <li><a class="inline-flex min-h-11 items-center font-medium text-white hover:text-accent-soft" href="${link.href}">${link.label}</a></li>
                `,
              )
              .join("")}
          </ul>
        </nav>

        <div class="flex basis-full flex-col gap-2 border-t border-dark-line pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>${site.footer.copyright}</p>
          <a
            class="inline-flex min-h-11 items-center font-medium text-accent-soft hover:text-white hover:underline"
            href="${site.footer.transparency.href}"
            target="_blank"
            rel="noopener noreferrer"
          >${site.footer.transparency.label} <span class="ml-1" aria-hidden="true">↗</span></a>
        </div>
      </div>
    </footer>
  `;
}
