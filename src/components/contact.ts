import { site } from "@/content/site";
import { getAppCheckHeader } from "@/lib/firebase";
import { withDeadline } from "@/lib/calendar-api";
import { mountCalendar } from "./calendar";

const INPUT_CLASS =
  "mt-1 w-full rounded border border-line bg-bg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold/60";
const LABEL_CLASS = "block text-sm font-semibold text-ink";

// Must stay ABOVE the contact function's own timeoutSeconds so the server always
// finishes or is killed first; otherwise an abort here can leave a send in flight
// and the visitor resubmits into a duplicate email.
const SUBMIT_TIMEOUT_MS = 10000;

function createTextElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

export function mountContact(el: HTMLElement): void {
  const c = site.contact;
  const cf = site.contactForm;
  const contactSection = c.section;

  const section = document.createElement("div");
  section.className = "border-t border-line bg-bg";
  const content = document.createElement("div");
  content.className = "mx-auto max-w-(--container-content) px-6 py-20 md:py-28";

  const header = document.createElement("header");
  header.className = "mx-auto max-w-3xl text-center";
  const heading = createTextElement(
    "h2",
    "mt-3 font-display text-3xl text-navy md:text-4xl",
    contactSection.heading,
  );
  heading.id = "contacto-heading";
  header.append(
    createTextElement(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      contactSection.eyebrow,
    ),
    heading,
    createTextElement(
      "p",
      "mt-4 text-base text-muted md:text-lg",
      contactSection.lead,
    ),
  );

  const cards = document.createElement("div");
  cards.className = "mt-12 grid gap-6 lg:grid-cols-3";

  const addressCard = document.createElement("article");
  addressCard.className =
    "rounded-card border border-line bg-surface p-6 shadow-card";
  const address = createTextElement(
    "p",
    "mt-3 text-sm leading-relaxed text-muted",
    c.street,
  );
  address.append(document.createElement("br"), document.createTextNode(c.city));
  const mapsLink = createTextElement(
    "a",
    "mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 hover:underline",
    c.labels.mapsLink,
  );
  mapsLink.href = c.mapsUrl;
  mapsLink.target = "_blank";
  mapsLink.rel = "noopener noreferrer";
  const mapsArrow = createTextElement("span", "", "↗");
  mapsArrow.setAttribute("aria-hidden", "true");
  mapsLink.append(mapsArrow);
  addressCard.append(
    createTextElement(
      "h3",
      "font-display text-base font-semibold text-navy",
      c.labels.address,
    ),
    address,
    mapsLink,
  );

  const contactCard = document.createElement("article");
  contactCard.className =
    "rounded-card border border-line bg-surface p-6 shadow-card";
  const contactList = document.createElement("ul");
  contactList.className = "mt-3 space-y-2 text-sm text-muted";
  const phoneLink = createTextElement(
    "a",
    "font-semibold text-ink hover:text-navy",
    c.phoneDisplay,
  );
  phoneLink.href = `tel:${c.phoneE164}`;
  const emailLink = createTextElement(
    "a",
    "font-semibold text-ink hover:text-navy",
    c.email,
  );
  emailLink.href = `mailto:${c.email}`;
  const phoneItem = document.createElement("li");
  phoneItem.append(phoneLink);
  const emailItem = document.createElement("li");
  emailItem.append(emailLink);
  contactList.append(phoneItem, emailItem);
  contactCard.append(
    createTextElement(
      "h3",
      "font-display text-base font-semibold text-navy",
      c.labels.phoneAndEmail,
    ),
    contactList,
  );

  const scheduleCard = document.createElement("article");
  scheduleCard.className =
    "rounded-card border border-line bg-surface p-6 shadow-card";
  const scheduleList = document.createElement("ul");
  scheduleList.className = "mt-3 space-y-2 text-sm text-muted";
  scheduleList.append(
    createTextElement("li", "", c.schedule.weekdays),
    createTextElement("li", "", c.schedule.saturdays),
  );
  scheduleCard.append(
    createTextElement(
      "h3",
      "font-display text-base font-semibold text-navy",
      c.labels.schedule,
    ),
    scheduleList,
  );
  cards.append(addressCard, contactCard, scheduleCard);

  const claims = document.createElement("section");
  claims.id = "reclamos";
  claims.className =
    "mt-10 scroll-mt-24 overflow-hidden rounded-card border border-line bg-surface p-8 shadow-card";
  claims.setAttribute("aria-labelledby", "reclamos-heading");
  const claimsHeading = createTextElement(
    "h3",
    "font-display text-xl text-navy",
    cf.heading,
  );
  claimsHeading.id = "reclamos-heading";

  const form = document.createElement("form");
  form.id = "cf-form";
  form.noValidate = true;
  form.className = "mt-6";
  const fields = document.createElement("div");
  fields.className = "grid gap-4 sm:grid-cols-2";

  const nameField = document.createElement("div");
  const nameLabel = createTextElement("label", LABEL_CLASS, cf.nameLabel);
  nameLabel.htmlFor = "cf-name";
  const nameInput = document.createElement("input");
  nameInput.id = "cf-name";
  nameInput.name = "name";
  nameInput.type = "text";
  nameInput.required = true;
  nameInput.autocomplete = "name";
  nameInput.className = INPUT_CLASS;
  nameField.append(nameLabel, nameInput);

  const emailField = document.createElement("div");
  const emailLabel = createTextElement("label", LABEL_CLASS, cf.emailLabel);
  emailLabel.htmlFor = "cf-email";
  const emailInput = document.createElement("input");
  emailInput.id = "cf-email";
  emailInput.name = "email";
  emailInput.type = "email";
  emailInput.required = true;
  emailInput.autocomplete = "email";
  emailInput.className = INPUT_CLASS;
  emailField.append(emailLabel, emailInput);

  const phoneField = document.createElement("div");
  const phoneLabel = createTextElement("label", LABEL_CLASS, cf.phoneLabel);
  phoneLabel.htmlFor = "cf-phone";
  phoneLabel.append(
    document.createTextNode(" "),
    createTextElement("span", "font-normal text-muted", cf.phoneNote),
  );
  const phoneInput = document.createElement("input");
  phoneInput.id = "cf-phone";
  phoneInput.name = "phone";
  phoneInput.type = "tel";
  phoneInput.autocomplete = "tel";
  phoneInput.className = INPUT_CLASS;
  phoneField.append(phoneLabel, phoneInput);

  const subjectField = document.createElement("div");
  const subjectLabel = createTextElement(
    "label",
    LABEL_CLASS,
    cf.claimTypeLabel,
  );
  subjectLabel.htmlFor = "cf-subject";
  const subjectInput = document.createElement("select");
  subjectInput.id = "cf-subject";
  subjectInput.name = "subject";
  subjectInput.required = true;
  subjectInput.className = INPUT_CLASS;
  subjectInput.append(new Option(cf.claimTypePlaceholder, ""));
  cf.claimTypes.forEach((type) => subjectInput.append(new Option(type, type)));
  subjectField.append(subjectLabel, subjectInput);
  fields.append(nameField, emailField, phoneField, subjectField);

  const messageField = document.createElement("div");
  messageField.className = "mt-4";
  const messageLabel = createTextElement("label", LABEL_CLASS, cf.messageLabel);
  messageLabel.htmlFor = "cf-message";
  const messageInput = document.createElement("textarea");
  messageInput.id = "cf-message";
  messageInput.name = "message";
  messageInput.required = true;
  messageInput.rows = 5;
  messageInput.className = `${INPUT_CLASS} resize-none`;
  messageField.append(messageLabel, messageInput);

  const actions = document.createElement("div");
  actions.className = "mt-6 flex flex-wrap items-center gap-4";
  const submitBtn = createTextElement(
    "button",
    "inline-flex items-center gap-2 rounded bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:bg-navy/90 disabled:opacity-60",
    cf.submitLabel,
  );
  submitBtn.id = "cf-submit";
  submitBtn.type = "submit";
  const errorEl = createTextElement(
    "p",
    "hidden text-sm text-red-600",
    cf.errorMessage,
  );
  errorEl.id = "cf-error";
  errorEl.setAttribute("role", "alert");
  actions.append(submitBtn, errorEl);
  form.append(fields, messageField, actions);

  const successEl = createTextElement(
    "p",
    "hidden mt-4 text-sm font-semibold text-green-700",
    cf.successMessage,
  );
  successEl.id = "cf-success";
  successEl.setAttribute("role", "status");
  claims.append(
    claimsHeading,
    createTextElement("p", "mt-2 text-sm text-muted", cf.lead),
    form,
    successEl,
  );

  const calendar = document.createElement("section");
  calendar.id = "calendario";
  calendar.className = "scroll-mt-24";
  calendar.setAttribute("aria-labelledby", "calendario-heading");
  calendar.dataset.contactCalendar = "";

  const mapWrap = document.createElement("div");
  mapWrap.className =
    "mt-10 overflow-hidden rounded-card border border-line bg-surface shadow-card";
  const map = document.createElement("iframe");
  map.title = `${c.labels.mapTitle} ${c.legalName}`;
  map.src = `https://www.google.com/maps?q=${encodeURIComponent(`${c.street}, ${c.city}`)}&output=embed`;
  map.loading = "lazy";
  map.referrerPolicy = "no-referrer-when-downgrade";
  map.className = "h-72 w-full border-0 md:h-96";
  mapWrap.append(map);

  content.append(header, cards, claims, calendar, mapWrap);
  section.append(content);
  el.replaceChildren(section);
  try {
    mountCalendar(calendar);
  } catch (error) {
    console.error("[notaria] calendar failed to initialize", error);
    const calendarError = createTextElement(
      "p",
      "mt-12 text-center text-sm text-muted",
      site.calendar.errorMessage,
    );
    calendarError.setAttribute("role", "status");
    calendar.replaceChildren(calendarError);
  }

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

    submitBtn.disabled = true;
    submitBtn.textContent = cf.sendingLabel;
    errorEl.classList.add("hidden");

    try {
      // One deadline covering the App Check wait and the request itself, so the
      // submission cannot outlast the budget this constant advertises.
      const submitSignal = AbortSignal.timeout(SUBMIT_TIMEOUT_MS);
      const appCheckHeaders = await withDeadline(
        getAppCheckHeader(),
        submitSignal,
      );
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...appCheckHeaders },
        body: JSON.stringify(payload),
        signal: submitSignal,
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
