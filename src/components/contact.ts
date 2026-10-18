import { site } from "@/content/site";
import { getAppCheckHeader } from "@/lib/firebase";

const INPUT_CLASS =
  "mt-1.5 min-h-12 w-full rounded-[10px] border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/40";
const LABEL_CLASS = "block text-sm font-semibold text-ink";

export function mountContact(el: HTMLElement): void {
  const contact = site.contact;
  const formContent = site.contactForm;

  el.innerHTML = `
    <div class="bg-soft">
      <div class="mx-auto grid max-w-content items-start gap-8 px-6 py-20 lg:grid-cols-2">
        <div class="space-y-5">
          <h2 id="contacto-heading" class="text-4xl leading-[1.05] text-ink md:text-[42px]">${contact.heading}</h2>

          <article class="flex flex-col gap-3.5 rounded-card bg-surface p-6">
            <h3 class="text-xl text-ink">${contact.legalName}</h3>
            <a
              href="${contact.mapsUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex min-h-11 items-center text-accent underline-offset-4 hover:text-accent-dark hover:underline"
            >${contact.street}, ${contact.city} <span class="ml-1" aria-hidden="true">↗</span></a>
            <a class="inline-flex min-h-11 items-center text-accent hover:text-accent-dark hover:underline" href="tel:${contact.phoneE164}">${contact.phoneDisplay}</a>
            <a class="inline-flex min-h-11 items-center text-accent hover:text-accent-dark hover:underline" href="mailto:${contact.email}">${contact.email}</a>
            <p class="text-ink-2">${contact.locationNote}</p>
            <p class="leading-relaxed text-ink-2">${contact.schedule.weekdays}<br />${contact.schedule.saturdays}</p>
          </article>

          <div class="overflow-hidden rounded-card border border-line bg-surface">
            <iframe
              title="${contact.legalName}"
              src="https://www.google.com/maps?q=${encodeURIComponent(`${contact.street}, ${contact.city}`)}&output=embed"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              class="h-[260px] w-full border-0"
            ></iframe>
          </div>
        </div>

        <article class="rounded-card bg-surface p-7">
          <h3 class="text-2xl leading-tight text-ink md:text-[26px]">${formContent.heading}</h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">${formContent.lead}</p>

          <form id="cf-form" novalidate class="mt-6 space-y-4">
            <div>
              <label for="cf-name" class="${LABEL_CLASS}">${formContent.nameLabel}</label>
              <input id="cf-name" name="name" type="text" required autocomplete="name" class="${INPUT_CLASS}" />
            </div>
            <div>
              <label for="cf-email" class="${LABEL_CLASS}">${formContent.emailLabel}</label>
              <input id="cf-email" name="email" type="email" required autocomplete="email" class="${INPUT_CLASS}" />
            </div>
            <div>
              <label for="cf-phone" class="${LABEL_CLASS}">
                ${formContent.phoneLabel} <span class="font-normal text-muted">${formContent.phoneNote}</span>
              </label>
              <input id="cf-phone" name="phone" type="tel" autocomplete="tel" class="${INPUT_CLASS}" />
            </div>
            <div>
              <label for="cf-subject" class="${LABEL_CLASS}">${formContent.claimTypeLabel}</label>
              <select id="cf-subject" name="subject" required class="${INPUT_CLASS}">
                <option value="">${formContent.claimTypePlaceholder}</option>
                ${formContent.claimTypes
                  .map((type) => `<option value="${type}">${type}</option>`)
                  .join("")}
              </select>
            </div>
            <div>
              <label for="cf-message" class="${LABEL_CLASS}">${formContent.messageLabel}</label>
              <textarea id="cf-message" name="message" required rows="4" class="${INPUT_CLASS} resize-y"></textarea>
            </div>
            <div class="flex flex-wrap items-center gap-4 pt-1">
              <button
                id="cf-submit"
                type="submit"
                class="inline-flex min-h-12 items-center justify-center rounded-[10px] bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
              >
                ${formContent.submitLabel}
              </button>
              <p id="cf-error" class="hidden text-sm text-red-700" role="alert">${formContent.errorMessage}</p>
            </div>
          </form>

          <p id="cf-success" class="mt-4 hidden text-sm font-semibold text-green-700" role="status">
            ${formContent.successMessage}
          </p>
        </article>
      </div>
    </div>
  `;

  const form = el.querySelector<HTMLFormElement>("#cf-form")!;
  const submitButton = el.querySelector<HTMLButtonElement>("#cf-submit")!;
  const error = el.querySelector<HTMLElement>("#cf-error")!;
  const success = el.querySelector<HTMLElement>("#cf-success")!;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const payload = {
      name: (data.get("name") as string).trim(),
      email: (data.get("email") as string).trim(),
      phone: (data.get("phone") as string).trim(),
      subject: (data.get("subject") as string).trim(),
      message: (data.get("message") as string).trim(),
    };

    submitButton.disabled = true;
    submitButton.textContent = formContent.sendingLabel;
    error.classList.add("hidden");

    try {
      const appCheckHeaders = await getAppCheckHeader();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...appCheckHeaders },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`${response.status}`);
      form.classList.add("hidden");
      success.classList.remove("hidden");
    } catch {
      error.classList.remove("hidden");
      submitButton.disabled = false;
      submitButton.textContent = formContent.submitLabel;
    }
  });
}
