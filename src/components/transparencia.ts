import { site } from "@/content/site";

const SALARY_MODAL_ID = "transparencia-salary-modal";

function renderSalaryModal(): string {
  const modal = site.funcionarios.salaryModal;

  return `
    <div
      id="${SALARY_MODAL_ID}"
      data-salary-modal
      class="fixed inset-0 z-50 hidden grid place-items-center px-4 py-8"
      aria-hidden="true"
    >
      <button
        type="button"
        data-salary-modal-overlay
        class="absolute inset-0 bg-dark/70"
        aria-label="${modal.closeLabel}"
      ></button>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="transparencia-salary-title"
        class="relative z-10 flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-card border border-line bg-surface shadow-xl"
      >
        <header class="flex items-start justify-between gap-4 border-b border-line-soft px-6 py-5">
          <h3 id="transparencia-salary-title" class="text-xl leading-tight text-ink md:text-2xl">${modal.title}</h3>
          <button
            type="button"
            data-salary-modal-close
            class="inline-flex min-h-11 shrink-0 items-center rounded-[10px] bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >${modal.closeLabel}</button>
        </header>

        <div class="overflow-auto p-5 md:p-6">
          <table class="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead class="bg-soft">
              <tr class="text-xs uppercase tracking-[0.12em] text-muted">
                <th class="px-3 py-3 font-semibold">${modal.rutHeader}</th>
                <th class="px-3 py-3 font-semibold">${modal.baseSalaryHeader}</th>
                <th class="px-3 py-3 font-semibold">${modal.variableSalaryHeader}</th>
              </tr>
            </thead>
            <tbody>
              ${modal.rows
                .map(
                  (row) => `
                    <tr class="border-b border-line-soft last:border-b-0">
                      <td class="px-3 py-3 font-medium tabular-nums text-ink">${row.rut}</td>
                      <td class="px-3 py-3 font-semibold tabular-nums text-ink">${row.baseSalary}</td>
                      <td class="px-3 py-3 text-muted">${modal.variableSalaryText}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function setupSalaryModal(root: ParentNode): void {
  const modal = root.querySelector<HTMLElement>("[data-salary-modal]");
  if (!modal) return;

  const dialog = modal.querySelector<HTMLElement>('[role="dialog"]');
  const openButtons = root.querySelectorAll<HTMLButtonElement>(
    "[data-salary-modal-open]",
  );
  const closeButtons = modal.querySelectorAll<HTMLButtonElement>(
    "[data-salary-modal-close], [data-salary-modal-overlay]",
  );

  let previouslyFocused: HTMLElement | null = null;

  function getFocusable(): HTMLElement[] {
    if (!dialog) return [];
    return Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute("disabled"));
  }

  const closeModal = (): void => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    document.removeEventListener("keydown", handleKeydown);
    if (previouslyFocused) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }
  };

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = getFocusable();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const openModal = (): void => {
    previouslyFocused = document.activeElement as HTMLElement | null;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
    document.addEventListener("keydown", handleKeydown);
    getFocusable()[0]?.focus();
  };

  openButtons.forEach((button) => button.addEventListener("click", openModal));
  closeButtons.forEach((button) =>
    button.addEventListener("click", closeModal),
  );
}

export function mountTransparencia(el: HTMLElement): void {
  const content = site.transparencia;
  const declaration = site.footer.transparency;

  el.innerHTML = `
    <div class="border-t border-line-soft bg-surface">
      <div class="mx-auto max-w-content px-6 py-20">
        <header class="max-w-3xl">
          <p class="text-[13px] font-semibold text-accent">${content.eyebrow}</p>
          <h2 id="transparencia-heading" class="mt-2 text-4xl leading-[1.05] text-ink md:text-[42px]">${content.heading}</h2>
          <p class="mt-3 text-base leading-relaxed text-ink-2">${content.lead}</p>
        </header>

        <div class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          ${content.documents
            .map(
              (documentItem) => `
                <a
                  href="${documentItem.href}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="group flex min-h-[7.5rem] flex-col justify-between gap-3 rounded-xl border border-line bg-surface p-4 text-ink transition hover:border-accent"
                >
                  <span>
                    <span class="block font-semibold leading-snug">${documentItem.title}</span>
                    <span class="mt-1 block text-sm leading-relaxed text-muted">${documentItem.description}</span>
                  </span>
                  <span class="text-sm font-semibold text-accent group-hover:text-accent-dark">${documentItem.label} <span aria-hidden="true">↗</span></span>
                </a>
              `,
            )
            .join("")}

          <button
            type="button"
            data-salary-modal-open
            aria-controls="${SALARY_MODAL_ID}"
            aria-haspopup="dialog"
            class="group flex min-h-[7.5rem] flex-col justify-between gap-3 rounded-xl border border-line bg-surface p-4 text-left text-ink transition hover:border-accent"
          >
            <span class="font-semibold leading-snug">${content.salaryCardLabel}</span>
            <span class="text-sm font-semibold text-accent group-hover:text-accent-dark">${content.salaryCardAction}</span>
          </button>

          <a
            href="${declaration.href}"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex min-h-[7.5rem] flex-col justify-between gap-3 rounded-xl border border-line bg-surface p-4 text-ink transition hover:border-accent"
          >
            <span class="font-semibold leading-snug">${declaration.label}</span>
            <span class="text-sm font-semibold text-accent group-hover:text-accent-dark" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>

    ${renderSalaryModal()}
  `;

  setupSalaryModal(el);
}
