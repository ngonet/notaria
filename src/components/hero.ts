import { site, type QuickTask } from "@/content/site";
import { iconChip } from "./icons";

const EXTERNAL_ICON = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="shrink-0 text-muted">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
`;

function renderTask(task: QuickTask): string {
  const externalAttrs = task.external ? ' target="_blank" rel="noopener"' : "";

  return `
    <li>
      <a
        href="${task.href}"${externalAttrs}
        class="flex h-full min-h-24 gap-3 rounded-xl border border-line bg-surface p-[18px] text-ink transition hover:border-accent hover:text-ink"
      >
        ${iconChip(task.icon)}
        <span class="flex flex-col gap-1">
          <span class="flex items-center gap-1.5 font-semibold">${task.title}${task.external ? EXTERNAL_ICON : ""}</span>
          <span class="text-sm text-muted">${task.detail}</span>
        </span>
      </a>
    </li>
  `;
}

export function mountHero(el: HTMLElement): void {
  const {
    heading,
    lead,
    ctaPrimaryLabel,
    ctaSecondaryLabel,
    tasksAriaLabel,
    tasks,
  } = site.hero;
  const { street, schedule } = site.contact;

  el.innerHTML = `
    <div class="flex flex-col gap-5">
      <h1 id="hero-heading" class="font-display text-[clamp(38px,4.6vw,60px)] leading-[1.02] font-bold tracking-[-0.02em] text-ink">${heading}</h1>
      <p class="max-w-[50ch] text-[19px] text-ink-2">${lead}</p>

      <ul aria-label="${tasksAriaLabel}" class="mt-2 grid gap-3 sm:grid-cols-2">
        ${tasks.map(renderTask).join("")}
      </ul>

      <div class="flex flex-wrap gap-3">
        <a href="#servicios" class="inline-flex min-h-11 items-center rounded-[10px] bg-accent px-5 font-semibold text-white transition hover:bg-accent-dark hover:text-white">${ctaPrimaryLabel}</a>
        <a href="#contacto" class="inline-flex min-h-11 items-center rounded-[10px] border border-line bg-surface px-5 font-semibold text-ink transition hover:border-accent hover:text-ink">${ctaSecondaryLabel}</a>
      </div>

      <p class="text-[15px] text-ink-2">${street} · ${schedule.weekdays} · ${schedule.saturdays}</p>
    </div>
  `;
}
