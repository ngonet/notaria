import { site } from "@/content/site";

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
    (match) =>
      `<strong class="font-semibold text-notice-ink">${match}</strong>`,
  );
}

function render(): string {
  const { id, title, body, closeLabel } = site.announcement;

  return `
    <div role="region" aria-label="${title}" data-announcement data-announcement-id="${id}" class="border-b border-notice-line bg-notice text-ink">
      <div class="mx-auto flex max-w-content flex-wrap items-center gap-x-3 gap-y-1 px-6 py-2.5">
        <strong class="text-xs font-semibold uppercase tracking-[0.12em] text-notice-ink">${title}</strong>
        <span class="flex-[1_1_300px]">${highlightTimes(body)}</span>
        <button type="button" data-announcement-close class="inline-flex min-h-11 items-center px-3.5 font-semibold text-notice-ink underline underline-offset-2 transition hover:no-underline">${closeLabel}</button>
      </div>
    </div>
  `;
}

export function mountAnnouncementModal(root: HTMLElement): void {
  const { id, activeUntil } = site.announcement;

  if (isExpired(activeUntil) || isDismissed(id)) return;

  root.innerHTML = render();

  const closeButton = root.querySelector<HTMLButtonElement>(
    "[data-announcement-close]",
  );

  const closeBanner = (): void => {
    root.replaceChildren();
    markDismissed(id);
  };

  closeButton?.addEventListener("click", closeBanner);
}
