import { site } from "@/content/site";

export function mountContact(el: HTMLElement): void {
  const c = site.contact;

  el.innerHTML = `
    <div class="border-t border-line bg-bg">
      <div class="mx-auto max-w-(--container-content) px-6 py-20 md:py-28">
        <header class="mx-auto max-w-3xl text-center">
          <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">Contacto</p>
          <h2 id="contacto-heading" class="mt-3 font-display text-3xl text-navy md:text-4xl">Visítenos o escríbanos</h2>
          <p class="mt-4 text-base text-muted md:text-lg">${c.legalName}, en pleno centro de ${c.city}, al costado del mall Melipilla.</p>
        </header>

        <div class="mt-12 grid gap-6 lg:grid-cols-3">
          <article class="rounded-card border border-line bg-surface p-6 shadow-card">
            <h3 class="font-display text-base font-semibold text-navy">Dirección</h3>
            <p class="mt-3 text-sm leading-relaxed text-muted">
              ${c.street}<br/>${c.city}
            </p>
            <a
              href="${c.mapsUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 hover:underline"
            >
              Ver en Google Maps
              <span aria-hidden="true">↗</span>
            </a>
          </article>

          <article class="rounded-card border border-line bg-surface p-6 shadow-card">
            <h3 class="font-display text-base font-semibold text-navy">Teléfono y correo</h3>
            <ul class="mt-3 space-y-2 text-sm text-muted">
              <li>
                <a href="tel:${c.phoneE164}" class="font-semibold text-ink hover:text-navy">${c.phoneDisplay}</a>
              </li>
              <li>
                <a href="mailto:${c.email}" class="font-semibold text-ink hover:text-navy">${c.email}</a>
              </li>
            </ul>
          </article>

          <article class="rounded-card border border-line bg-surface p-6 shadow-card">
            <h3 class="font-display text-base font-semibold text-navy">Horario de atención</h3>
            <ul class="mt-3 space-y-2 text-sm text-muted">
              <li>${c.schedule.weekdays}</li>
              <li>${c.schedule.saturdays}</li>
            </ul>
          </article>
        </div>

        <div class="mt-10 overflow-hidden rounded-card border border-line bg-surface shadow-card">
          <iframe
            title="Ubicación de ${c.legalName}"
            src="https://www.google.com/maps?q=${encodeURIComponent(`${c.street}, ${c.city}`)}&output=embed"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="h-72 w-full border-0 md:h-96"
          ></iframe>
        </div>
      </div>
    </div>
  `;
}
