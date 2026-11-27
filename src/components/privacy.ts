import { site, type PrivacyBlock } from "@/content/site";

const LINK_CLASS =
  "font-medium text-accent underline underline-offset-4 hover:text-accent-dark";

function renderBlock(block: PrivacyBlock): string {
  if (block.type === "p") {
    return `<p class="leading-relaxed text-ink-2">${block.html}</p>`;
  }
  return `
    <ul class="list-disc space-y-2 pl-5 leading-relaxed text-ink-2">
      ${block.items.map((item) => `<li>${item.html}</li>`).join("")}
    </ul>
  `;
}

export function mountPrivacy(el: HTMLElement): void {
  const content = site.privacyPolicy;

  el.innerHTML = `
    <div class="mx-auto max-w-3xl px-6 py-14">
      <a href="/" class="inline-flex min-h-11 items-center text-sm ${LINK_CLASS}">
        <span aria-hidden="true">←</span>&nbsp;${content.backLabel}
      </a>
      <h1 id="privacidad-heading" class="mt-4 text-4xl leading-[1.05] text-ink md:text-[42px]">${content.heading}</h1>
      <p class="mt-3 text-sm text-muted"><strong>${content.updatedLabel}</strong> ${content.updatedAt}</p>

      <div class="mt-8 space-y-4">
        ${content.intro.map(renderBlock).join("")}
      </div>

      ${content.sections
        .map(
          (section) => `
            <section class="mt-10 space-y-4">
              <h2 class="text-2xl leading-tight text-ink">${section.heading}</h2>
              ${section.blocks.map(renderBlock).join("")}
            </section>
          `,
        )
        .join("")}
    </div>
  `;

  el.querySelectorAll<HTMLAnchorElement>("a[href^='http']").forEach((link) => {
    link.className = LINK_CLASS;
  });
}
