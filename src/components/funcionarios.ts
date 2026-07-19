import { site } from "@/content/site";

export function renderFuncionarios(): string {
  const { eyebrow, heading, lead, groups } = site.funcionarios;

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
		</section>
	`;
}

export function renderSalaryPublication(content: {
  eyebrow: string;
  lead: string;
}): string {
  const salary = site.funcionarios.salaryModal;

  return `
		<section class="rounded-card border border-line bg-bg p-6 shadow-card" aria-labelledby="remuneraciones-heading">
			<p class="font-display text-sm uppercase tracking-[0.22em] text-gold">${content.eyebrow}</p>
			<h4 id="remuneraciones-heading" class="mt-3 font-display text-lg text-navy">${salary.title}</h4>
			<p class="mt-2 text-sm text-muted">${content.lead}</p>
			<div class="mt-5 overflow-x-auto">
				<table class="w-full border-collapse text-left text-sm">
					<thead>
						<tr class="border-b border-line text-xs uppercase tracking-[0.14em] text-muted">
							<th class="px-2 py-3 font-semibold">${salary.rutHeader}</th>
							<th class="px-2 py-3 font-semibold">${salary.baseSalaryHeader}</th>
							<th class="px-2 py-3 font-semibold">${salary.variableSalaryHeader}</th>
						</tr>
					</thead>
					<tbody>
						${salary.rows
              .map(
                (row) => `
									<tr class="border-b border-line/70 last:border-b-0">
										<td class="px-2 py-3 font-medium text-ink">${row.rut}</td>
										<td class="px-2 py-3 font-semibold text-navy">${row.baseSalary}</td>
										<td class="px-2 py-3 text-ink">${salary.variableSalaryText}</td>
									</tr>
								`,
              )
              .join("")}
					</tbody>
				</table>
			</div>
		</section>
	`;
}
