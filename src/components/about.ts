import { site } from "@/content/site";
import { renderFuncionarios } from "./funcionarios";

const LINK_CLASSES =
  "inline-flex min-h-11 items-center gap-1 font-semibold text-accent underline underline-offset-4 hover:text-accent-dark";

function renderNotaryCard(): string {
  const { notary } = site.services;

  const substitutes = notary.substituteNotaries?.length
    ? `<p class="text-[15px]"><strong>${notary.substituteLabel}:</strong> ${notary.substituteNotaries.join(", ")}</p>`
    : "";

  const prosecutor = notary.prosecutor
    ? `<p class="text-[15px]"><strong>${notary.prosecutor.label}:</strong> ${notary.prosecutor.name}, ${notary.prosecutor.office}</p>`
    : "";

  return `
    <article class="flex flex-col gap-2.5 rounded-card border border-line p-6">
      <p class="text-[13px] font-semibold text-accent">${notary.label}</p>
      <p class="font-display text-[26px] font-bold leading-tight">${notary.name}</p>
      <p class="text-ink-2">${notary.role}</p>
      ${substitutes}
      ${prosecutor}
      <p class="text-[15px]">
        ${notary.decree.text} ·
        <a class="${LINK_CLASSES}" href="${notary.decree.href}" target="_blank" rel="noopener noreferrer">${notary.decree.label} <span aria-hidden="true">↗</span></a>
      </p>
    </article>
  `;
}

export function mountAbout(el: HTMLElement): void {
  const { section, commitment, trajectory, timeline } = site.about;

  el.innerHTML = `
    <div class="mx-auto grid max-w-content gap-12 px-6 py-20 lg:grid-cols-2 lg:items-start">
      <div class="flex flex-col gap-4">
        <h2 id="nosotros-heading" class="text-4xl leading-[1.05] md:text-[42px]">${section.heading}</h2>
        <p class="text-[17px] text-ink-2">${commitment.body}</p>
        ${renderNotaryCard()}
      </div>

      <div class="flex flex-col gap-8">
        <ol class="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="${trajectory.ariaLabel}">
          ${timeline
            .map(
              (entry) => `
                <li class="flex flex-col gap-1 rounded-card bg-soft p-[18px]">
                  <span class="font-display text-2xl font-bold">${entry.date}</span>
                  <span class="text-[15px] font-semibold">${entry.title}</span>
                  <span class="text-sm text-muted">${entry.description}</span>
                  ${
                    entry.link
                      ? `<a class="${LINK_CLASSES} self-start text-sm" href="${entry.link.href}" target="_blank" rel="noopener noreferrer">${entry.link.label} <span aria-hidden="true">↗</span></a>`
                      : ""
                  }
                </li>
              `,
            )
            .join("")}
        </ol>

        ${renderFuncionarios()}
      </div>
    </div>
  `;
}
