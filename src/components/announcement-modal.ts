import { site } from "@/content/site";

const ANNOUNCEMENT_MODAL_ID = "announcement-modal";

function dismissKey(id: string): string {
  return `notaria:announcement-dismissed:${id}`;
}

function isDismissed(id: string): boolean {
  try {
    return localStorage.getItem(dismissKey(id)) === "dismissed";
  } catch {
    return false;
  }
}

function markDismissed(id: string): void {
  try {
    localStorage.setItem(dismissKey(id), "dismissed");
  } catch {
    // localStorage unavailable (private mode, blocked storage): ignore.
  }
}

function isExpired(activeUntil: string): boolean {
  const end = new Date(`${activeUntil}T23:59:59`);
  return Date.now() > end.getTime();
}

function highlightTimes(text: string): string {
  return text.replace(
    /\d{1,2}:\d{2}(?:\s?hrs?\.?)?/g,
    (match) => `<strong class="font-semibold text-navy">${match}</strong>`,
  );
}

function render(): string {
  const { id, title, body, closeLabel } = site.announcement;

  return `
    <div id="${ANNOUNCEMENT_MODAL_ID}" data-announcement-modal data-announcement-id="${id}" class="fixed inset-0 z-50 hidden grid place-items-center px-4 py-8" aria-hidden="true">
      <button type="button" data-announcement-modal-overlay class="absolute inset-0 bg-navy/70" aria-label="${closeLabel}"></button>
      <div role="dialog" aria-modal="true" aria-labelledby="announcement-modal-title" class="relative z-10 w-full max-w-md overflow-hidden rounded-card border border-line bg-surface shadow-card">
        <div class="h-1 w-full bg-[linear-gradient(90deg,var(--color-navy)_0%,var(--color-gold)_100%)]"></div>

        <header class="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div class="flex min-w-0 items-start gap-3.5">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="5"></circle>
                <path d="M8.5 12.5 6 21l6-3 6 3-2.5-8.5"></path>
              </svg>
            </div>
            <div class="min-w-0">
              <p class="font-display text-xs font-semibold uppercase tracking-[0.28em] text-gold">Aviso</p>
              <h4 id="announcement-modal-title" class="mt-1 font-display text-xl font-semibold leading-tight text-navy">${title}</h4>
            </div>
          </div>
          <button type="button" data-announcement-modal-close class="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold text-navy transition hover:bg-navy/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy">${closeLabel}</button>
        </header>

        <div class="mx-6 h-px bg-[linear-gradient(90deg,var(--color-line)_0%,var(--color-gold-soft)_50%,var(--color-line)_100%)]"></div>

        <div class="px-6 pt-5 pb-7">
          <p class="text-base leading-relaxed text-ink">${highlightTimes(body)}</p>
        </div>
      </div>
    </div>
  `;
}

export function mountAnnouncementModal(root: HTMLElement): void {
  const { id, activeUntil } = site.announcement;

  if (isExpired(activeUntil) || isDismissed(id)) return;

  root.innerHTML = render();

  const modal = root.querySelector<HTMLElement>("[data-announcement-modal]");
  if (!modal) return;

  const dialog = modal.querySelector<HTMLElement>('[role="dialog"]');
  const closeButtons = modal.querySelectorAll<HTMLButtonElement>(
    "[data-announcement-modal-close], [data-announcement-modal-overlay]",
  );

  let previouslyFocused: HTMLElement | null = null;

  function getFocusable(): HTMLElement[] {
    if (!dialog) return [];
    return Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute("disabled"));
  }

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    if (event.key === "Tab") {
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
  };

  const openModal = (): void => {
    previouslyFocused = document.activeElement as HTMLElement | null;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("overflow-hidden");
    document.addEventListener("keydown", handleKeydown);
    const focusable = getFocusable();
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  };

  const closeModal = (): void => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("overflow-hidden");
    document.removeEventListener("keydown", handleKeydown);
    markDismissed(id);
    if (previouslyFocused) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }
  };

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  openModal();
}
