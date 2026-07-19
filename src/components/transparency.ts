import { site } from "@/content/site";
import { renderSalaryPublication } from "./funcionarios";

function disclosureCard(item: {
  title: string;
  description: string;
  href: string;
  label: string;
}): string {
  return `
		<a
			href="${item.href}"
			target="_blank"
			rel="noopener noreferrer"
			class="group flex h-full flex-col rounded-card border border-line bg-bg p-6 shadow-card transition hover:-translate-y-1 hover:border-gold/70"
		>
			<span class="font-display text-lg font-semibold text-navy">${item.title}</span>
			<span class="mt-3 flex-1 text-sm leading-relaxed text-muted">${item.description}</span>
			<span class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 group-hover:underline">${item.label}<span aria-hidden="true">↗</span></span>
		</a>
	`;
}

export function mountTransparency(el: HTMLElement): void {
  const {
    section,
    tariffsHeading,
    overviewHeading,
    institutionalEyebrow,
    institutionalHeading,
    decree,
    assetDeclaration,
    salaryPublication,
  } = site.transparency;
  const tariffs = site.aranceles;
  const oversight = site.documents.visitas;

  el.innerHTML = `
		<div class="border-y border-line bg-surface">
			<div class="mx-auto max-w-(--container-content) px-6 py-20 md:py-28">
				<header class="mx-auto max-w-3xl text-center">
					<p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${section.eyebrow}</p>
					<h2 id="transparencia-heading" class="mt-3 font-display text-3xl text-navy md:text-4xl">${section.heading}</h2>
					<p class="mt-4 text-base text-muted md:text-lg">${section.lead}</p>
				</header>

				<section id="aranceles" class="mt-16 scroll-mt-24" aria-labelledby="aranceles-heading">
					<header class="max-w-3xl">
						<p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${tariffs.eyebrow}</p>
						<h3 id="aranceles-heading" class="mt-3 font-display text-2xl text-navy md:text-3xl">${tariffsHeading}</h3>
						<p class="mt-4 text-sm leading-relaxed text-muted md:text-base">${tariffs.lead}</p>
					</header>
					<div class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
						${[...tariffs.documents, decree].map(disclosureCard).join("")}
					</div>
					<p class="mt-6 text-xs leading-relaxed text-muted">${tariffs.disclaimer}</p>
				</section>

				<section id="visitas" class="mt-20 scroll-mt-24 border-t border-line/60 pt-16" aria-labelledby="visitas-heading">
					<header class="max-w-3xl">
						<p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${oversight.eyebrow}</p>
						<h3 id="visitas-heading" class="mt-3 font-display text-2xl text-navy md:text-3xl">${overviewHeading}</h3>
						<p class="mt-4 text-sm leading-relaxed text-muted md:text-base">${oversight.lead}</p>
					</header>
					<div class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						${oversight.documents.map(disclosureCard).join("")}
					</div>
				</section>

				<section class="mt-20 border-t border-line/60 pt-16" aria-labelledby="publicaciones-heading">
					<header class="max-w-3xl">
						<p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${institutionalEyebrow}</p>
						<h3 id="publicaciones-heading" class="mt-3 font-display text-2xl text-navy md:text-3xl">${institutionalHeading}</h3>
					</header>
					<div class="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
						${disclosureCard(assetDeclaration)}
						${renderSalaryPublication(salaryPublication)}
					</div>
				</section>
			</div>
		</div>
	`;
}
