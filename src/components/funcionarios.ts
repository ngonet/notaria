import { site } from "@/content/site";

const SALARY_MODAL_ID = "funcionarios-salary-modal";

export function renderFuncionarios(): string {
  const { eyebrow, heading, lead, groups, salaryModal } = site.funcionarios;

  return `
    <section id="funcionarios" class="scroll-mt-24" aria-labelledby="funcionarios-heading">
      <header class="mx-auto max-w-3xl text-center">
        <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${eyebrow}</p>
        <h3 id="funcionarios-heading" class="mt-3 font-display text-2xl text-navy md:text-3xl">${heading}</h3>
        <p class="mt-4 text-base text-muted md:text-lg">${lead}</p>
      </header>

      <ul class="mt-12 grid gap-6 md:grid-cols-3">
        ${groups
          .map(
            (group) => `
              <li class="flex h-full flex-col rounded-card border border-line bg-bg p-6 shadow-card">
                <h4 class="font-display text-base font-semibold text-navy">${group.title}</h4>
                <ul class="mt-4 flex-1 space-y-2">
                  ${group.members
                    .map(
                      (name) => `
                        <li class="flex items-start gap-2 text-sm text-muted">
                          <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true"></span>
                          ${name}
                        </li>
                      `,
                    )
                    .join("")}
                </ul>
              </li>
            `,
          )
          .join("")}
      </ul>

      <div class="mt-10 flex justify-center">
        <button
          type="button"
          data-funcionarios-modal-open
          aria-controls="${SALARY_MODAL_ID}"
          class="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
        >
          ${salaryModal.buttonLabel}
        </button>
      </div>

      <div id="${SALARY_MODAL_ID}" data-funcionarios-modal class="fixed inset-0 z-50 hidden grid place-items-center px-4 py-8" aria-hidden="true">
        <button type="button" data-funcionarios-modal-overlay class="absolute inset-0 bg-navy/70" aria-label="${salaryModal.closeLabel}"></button>
        <div role="dialog" aria-modal="true" aria-labelledby="funcionarios-salary-title" class="relative z-10 w-full max-w-2xl overflow-hidden rounded-card border border-line bg-bg shadow-card">
          <header class="flex items-center justify-between border-b border-line px-6 py-4">
            <h4 id="funcionarios-salary-title" class="font-display text-lg text-navy">${salaryModal.title}</h4>
            <button type="button" data-funcionarios-modal-close class="rounded-full px-3 py-1.5 text-sm font-semibold text-navy transition hover:bg-navy/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">${salaryModal.closeLabel}</button>
          </header>

          <div class="max-h-[70vh] overflow-auto p-6">
            <table class="w-full border-collapse text-left text-sm">
              <thead>
                <tr class="border-b border-line text-xs uppercase tracking-[0.14em] text-muted">
                  <th class="px-2 py-3 font-semibold">${salaryModal.rutHeader}</th>
                  <th class="px-2 py-3 font-semibold">${salaryModal.baseSalaryHeader}</th>
                </tr>
              </thead>
              <tbody>
                ${salaryModal.rows
                  .map(
                    (row) => `
                      <tr class="border-b border-line/70 last:border-b-0">
                        <td class="px-2 py-3 font-medium text-ink">${row.rut}</td>
                        <td class="px-2 py-3 font-semibold text-navy">${row.baseSalary}</td>
                      </tr>
                    `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupFuncionariosModal(root: ParentNode): void {
  const modal = root.querySelector<HTMLElement>("[data-funcionarios-modal]");
  if (!modal) return;

  const openButtons = root.querySelectorAll<HTMLButtonElement>(
    "[data-funcionarios-modal-open]",
  );
  const closeButtons = modal.querySelectorAll<HTMLButtonElement>(
    "[data-funcionarios-modal-close], [data-funcionarios-modal-overlay]",
  );

  const openModal = (): void => {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
  };

  const closeModal = (): void => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal.getAttribute("aria-hidden") === "false"
    ) {
      closeModal();
    }
  });
}
