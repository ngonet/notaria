import { site } from "@/content/site";

const INPUT_CLASS =
  "mt-1 w-full rounded border border-line bg-bg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold/60";
const LABEL_CLASS = "block text-sm font-semibold text-ink";

export function mountContact(el: HTMLElement): void {
  const c = site.contact;
  const cf = site.contactForm;

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

        <div class="mt-10 overflow-hidden rounded-card border border-line bg-surface p-8 shadow-card">
          <h3 class="font-display text-xl text-navy">${cf.heading}</h3>
          <p class="mt-2 text-sm text-muted">${cf.lead}</p>

          <form id="cf-form" novalidate class="mt-6">
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="cf-name" class="${LABEL_CLASS}">${cf.nameLabel}</label>
                <input id="cf-name" name="name" type="text" required autocomplete="name" class="${INPUT_CLASS}" />
              </div>
              <div>
                <label for="cf-email" class="${LABEL_CLASS}">${cf.emailLabel}</label>
                <input id="cf-email" name="email" type="email" required autocomplete="email" class="${INPUT_CLASS}" />
              </div>
              <div>
                <label for="cf-phone" class="${LABEL_CLASS}">
                  ${cf.phoneLabel} <span class="font-normal text-muted">${cf.phoneNote}</span>
                </label>
                <input id="cf-phone" name="phone" type="tel" autocomplete="tel" class="${INPUT_CLASS}" />
              </div>
              <div>
                <label for="cf-subject" class="${LABEL_CLASS}">${cf.subjectLabel}</label>
                <input id="cf-subject" name="subject" type="text" required class="${INPUT_CLASS}" />
              </div>
            </div>
            <div class="mt-4">
              <label for="cf-message" class="${LABEL_CLASS}">${cf.messageLabel}</label>
              <textarea id="cf-message" name="message" required rows="5" class="${INPUT_CLASS} resize-none"></textarea>
            </div>
            <div class="mt-6 flex flex-wrap items-center gap-4">
              <button
                id="cf-submit"
                type="submit"
                class="inline-flex items-center gap-2 rounded bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:bg-navy/90 disabled:opacity-60"
              >
                ${cf.submitLabel}
              </button>
              <p id="cf-error" class="hidden text-sm text-red-600" role="alert">${cf.errorMessage}</p>
            </div>
          </form>

          <p id="cf-success" class="hidden mt-4 text-sm font-semibold text-green-700" role="status">
            ${cf.successMessage}
          </p>
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

  const form = el.querySelector<HTMLFormElement>("#cf-form")!;
  const submitBtn = el.querySelector<HTMLButtonElement>("#cf-submit")!;
  const errorEl = el.querySelector<HTMLElement>("#cf-error")!;
  const successEl = el.querySelector<HTMLElement>("#cf-success")!;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const payload = {
      name: (data.get("name") as string).trim(),
      email: (data.get("email") as string).trim(),
      phone: (data.get("phone") as string).trim(),
      subject: (data.get("subject") as string).trim(),
      message: (data.get("message") as string).trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = cf.sendingLabel;
    errorEl.classList.add("hidden");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      form.classList.add("hidden");
      successEl.classList.remove("hidden");
    } catch {
      errorEl.classList.remove("hidden");
      submitBtn.disabled = false;
      submitBtn.textContent = cf.submitLabel;
    }
  });
}
