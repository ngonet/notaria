import { site } from "@/content/site";

export function renderFuncionarios(): string {
  const { heading, groups } = site.funcionarios;

  return `
    <section id="funcionarios" class="flex scroll-mt-24 flex-col gap-3.5" aria-labelledby="funcionarios-heading">
      <h3 id="funcionarios-heading" class="text-[26px] leading-tight">${heading}</h3>
      <dl class="flex flex-col gap-3 text-[15px]">
        ${groups
          .map(
            (group) => `
              <div>
                <dt class="font-semibold">${group.title}</dt>
                <dd class="mt-0.5 text-ink-2">${group.members.join(" · ")}</dd>
              </div>
            `,
          )
          .join("")}
      </dl>
    </section>
  `;
}
