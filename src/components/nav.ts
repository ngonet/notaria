import { site } from "@/content/site";

export function mountNav(el: HTMLElement): void {
  el.innerHTML = `
    <nav class="sticky top-0 z-40 border-b border-line/70 bg-surface/85 backdrop-blur supports-[backdrop-filter]:bg-surface/70">
      <div class="mx-auto flex max-w-(--container-content) items-center justify-between gap-6 px-6 py-4">
        <a href="#page-top" class="flex items-baseline gap-2 text-navy">
          <span class="font-display text-xl font-semibold tracking-tight">${site.brand}</span>
          <span class="hidden text-xs font-medium uppercase tracking-[0.18em] text-muted sm:inline">Melipilla</span>
        </a>

        <button
          type="button"
          aria-controls="primary-navigation"
          aria-expanded="false"
          class="inline-flex items-center justify-center rounded-md p-2 text-navy transition hover:bg-line/60 md:hidden"
          data-nav-toggle
        >
          <span class="sr-only">Abrir menú</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <ul
          id="primary-navigation"
          class="hidden w-full flex-col gap-1 pt-4 text-sm font-medium text-ink md:flex md:w-auto md:flex-row md:items-center md:gap-8 md:pt-0"
          data-nav-menu
        >
          ${site.nav
            .map(
              (link) => `
                <li>
                  <a
                    href="${link.href}"
                    class="block rounded-md px-3 py-2 transition hover:text-navy focus-visible:text-navy md:px-0 md:py-1"
                  >${link.label}</a>
                </li>
              `,
            )
            .join("")}
          <li class="md:ml-4">
            <a
              href="tel:${site.contact.phoneE164}"
              class="inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-light md:w-auto"
            >
              <span aria-hidden="true">☎</span>
              <span>${site.contact.phoneDisplay}</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `;

  const toggle = el.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const menu = el.querySelector<HTMLUListElement>("[data-nav-menu]");

  toggle?.addEventListener("click", () => {
    if (!menu) return;
    const open = menu.classList.toggle("hidden");
    const expanded = (!open).toString();
    toggle.setAttribute("aria-expanded", expanded);
  });

  menu?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        menu.classList.add("hidden");
        toggle?.setAttribute("aria-expanded", "false");
      }
    });
  });
}
