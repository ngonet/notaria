import{s as l}from"./site-DrCzpknc.js";function n(){const{heading:a,lead:s,areas:t,disclaimer:r}=l.aranceles;return`
    <section id="aranceles" class="scroll-mt-24" aria-labelledby="aranceles-heading">
      <header class="mx-auto max-w-3xl text-center">
        <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">Tarifas</p>
        <h3 id="aranceles-heading" class="mt-3 font-display text-2xl text-navy md:text-3xl">${a}</h3>
        <p class="mt-4 text-base text-muted md:text-lg">${s}</p>
      </header>

      <div class="mt-12 space-y-10">
        ${t.map(e=>`
              <div class="rounded-card border border-line bg-bg shadow-card overflow-hidden">
                <div class="px-6 py-5 border-b border-line">
                  <h4 class="font-display text-lg font-semibold text-navy capitalize">${e.title}</h4>
                  ${e.note?`<p class="mt-1 text-xs text-muted">${e.note}</p>`:""}
                </div>
                <table class="w-full text-sm">
                  <thead class="sr-only">
                    <tr>
                      <th scope="col">Servicio</th>
                      <th scope="col">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${e.items.map((d,i)=>`
                          <tr class="${i%2===0?"bg-bg":"bg-surface"}">
                            <td class="px-6 py-3 text-muted leading-snug">${d.service}</td>
                            <td class="px-6 py-3 text-right font-semibold text-navy tabular-nums whitespace-nowrap">${d.amount}</td>
                          </tr>
                        `).join("")}
                  </tbody>
                </table>
              </div>
            `).join("")}
      </div>

      <p class="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-muted">${r}</p>
    </section>
  `}const o={newspaper:'<path d="M4 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z" /><path d="M9 7h6M9 11h6M9 15h4" /><path d="M19 7h2v10a2 2 0 0 1-2 2" />',file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',eraser:'<path d="m17 14 3-3-7-7-9 9 4 4h6"/><path d="M14 21h7"/><path d="m9 11 4 4"/>'};function c(a){return`
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${o[a]??""}
    </svg>
  `}function x(a){const{primary:s,notary:t,secondary:r}=l.services;a.innerHTML=`
    <div class="mx-auto max-w-(--container-content) px-6 py-20 md:py-28">
      <header class="mx-auto max-w-3xl text-center">
        <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">Servicios</p>
        <h2 id="servicios-heading" class="mt-3 font-display text-3xl text-navy md:text-4xl">Trámites notariales con respaldo y experiencia</h2>
        <p class="mt-4 text-base text-muted md:text-lg">Atención personalizada en escrituras públicas, instrumentos privados y trámites del Conservador de Comercio.</p>
      </header>

      <ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        ${s.map(e=>`
              <li class="group rounded-card border border-line bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:border-gold/60">
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-navy transition group-hover:bg-gold/15 group-hover:text-navy">
                  <span class="font-display text-base font-semibold">0${s.indexOf(e)+1}</span>
                </div>
                <h3 class="mt-5 font-display text-lg font-semibold text-navy">${e.title}</h3>
                <p class="mt-3 text-sm leading-relaxed text-muted">${e.description}</p>
              </li>
            `).join("")}
      </ul>

      <article class="mt-16 grid gap-10 rounded-card border border-line bg-navy px-8 py-12 text-white md:grid-cols-[1fr_1.2fr] md:items-center md:px-12">
        <div>
          <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">Notario titular</p>
          <h3 class="mt-3 font-display text-2xl md:text-3xl">${t.name}</h3>
          <p class="mt-2 text-base text-white/75">${t.role}</p>
        </div>
        <p class="text-sm leading-relaxed text-white/85 md:text-base">
          ${t.decree.text}.
          <a class="ml-1 inline-flex items-center gap-1 font-semibold text-gold underline-offset-4 hover:underline" href="${t.decree.href}" target="_blank" rel="noopener noreferrer">
            Ver decreto
            <span aria-hidden="true">↗</span>
          </a>
        </p>
      </article>

      <ul class="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        ${r.map(e=>`
              <li class="rounded-card border border-line bg-surface p-6 shadow-card">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-navy">${c(e.icon)}</div>
                <h3 class="mt-5 font-display text-lg font-semibold text-navy">${e.title}</h3>
                <p class="mt-3 text-sm leading-relaxed text-muted">${e.description}</p>
              </li>
            `).join("")}
      </ul>

      <div class="mt-20 md:mt-24 border-t border-line/60 pt-16 md:pt-20">
        ${n()}
      </div>
    </div>
  `}export{x as mountServices};
