import { site } from "@/content/site";

export function mountNav(el: HTMLElement): void {
  el.innerHTML = `
    <div class="border-b border-line-soft bg-surface">
      <div class="mx-auto flex max-w-content flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-3">
        <a href="#page-top" class="flex min-h-11 min-w-0 flex-col justify-center leading-tight text-ink hover:text-ink">
          <span class="font-display text-[22px] font-bold">${site.brand}</span>
          <span class="hidden text-[13px] text-muted sm:block">${site.tagline}</span>
        </a>

        <button
          type="button"
          aria-controls="primary-navigation"
          aria-expanded="false"
          class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] text-ink transition hover:bg-soft md:hidden"
          data-nav-toggle
        >
          <span class="sr-only">Abrir menú</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <nav aria-label="Principal" class="w-full md:w-auto">
          <ul
            id="primary-navigation"
            class="hidden w-full flex-col gap-1 pb-2 md:flex md:w-auto md:flex-row md:flex-wrap md:items-center md:gap-0.5 md:pb-0"
            data-nav-menu
          >
            ${site.nav
              .map(
                (link) => `
                  <li>
                    <a
                      href="${link.href}"
                      class="flex min-h-11 items-center rounded-md px-3 py-2.5 font-medium text-ink transition hover:text-accent"
                    >${link.label}</a>
                  </li>
                `,
              )
              .join("")}
            <li class="mt-1 md:mt-0 md:ml-1.5">
              <a
                href="tel:${site.contact.phoneE164}"
                class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-accent px-4 font-semibold text-white transition hover:bg-accent-dark hover:text-white md:w-auto"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>${site.contact.phoneDisplay}</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
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
