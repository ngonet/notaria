import{s as i}from"./site-DrCzpknc.js";function d(){const{heading:a,lead:t,groups:l}=i.funcionarios;return`
    <section id="funcionarios" class="scroll-mt-24" aria-labelledby="funcionarios-heading">
      <header class="mx-auto max-w-3xl text-center">
        <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">Equipo</p>
        <h3 id="funcionarios-heading" class="mt-3 font-display text-2xl text-navy md:text-3xl">${a}</h3>
        <p class="mt-4 text-base text-muted md:text-lg">${t}</p>
      </header>

      <ul class="mt-12 grid gap-6 md:grid-cols-3">
        ${l.map(s=>`
              <li class="flex h-full flex-col rounded-card border border-line bg-bg p-6 shadow-card">
                <h4 class="font-display text-base font-semibold text-navy">${s.title}</h4>
                <ul class="mt-4 flex-1 space-y-2">
                  ${s.members.map(e=>`
                        <li class="flex items-start gap-2 text-sm text-muted">
                          <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true"></span>
                          ${e}
                        </li>
                      `).join("")}
                </ul>
              </li>
            `).join("")}
      </ul>
    </section>
  `}const r={gavel:'<path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9"/><path d="m15 13 6-6"/><path d="m9 7 6 6"/><path d="m17 5 4 4"/><path d="m13 9 4-4"/>',university:'<path d="m4 10 8-5 8 5"/><path d="M5 10v8h14v-8"/><path d="M9 18v-5M12 18v-5M15 18v-5"/><path d="M3 21h18"/>',cogs:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>'};function n(a){return`
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${r[a]??""}
    </svg>
  `}function c(a){const{commitment:t,trajectory:l,timeline:s}=i.about;a.innerHTML=`
    <div class="border-y border-line bg-surface">
      <div class="mx-auto max-w-(--container-content) px-6 py-20 md:py-28">
        <article class="grid gap-10 rounded-card border border-line bg-bg px-8 py-12 md:grid-cols-[1.1fr_1fr] md:items-center md:px-12">
          <div>
            <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${t.heading}</p>
            <h3 class="mt-3 font-display text-2xl text-navy md:text-3xl">${t.title}</h3>
            <p class="mt-2 text-sm text-muted md:text-base">${t.lead}</p>
            <p class="mt-5 text-sm leading-relaxed text-ink md:text-base">${t.body}</p>
          </div>
          <div class="overflow-hidden rounded-card ring-1 ring-line">
            <picture>
              <source srcset="${t.image.replace(/\.(jpg|png)$/,".webp")}" type="image/webp" />
              <img src="${t.image}" alt="${t.imageAlt}" loading="lazy" decoding="async" width="400" height="400" class="h-full w-full object-cover" />
            </picture>
          </div>
        </article>

        <section class="mt-20" aria-label="Historia y trayectoria">
          <header class="mx-auto max-w-3xl text-center">
            <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${l.heading}</p>
            <h3 class="mt-3 font-display text-2xl text-navy md:text-3xl">${l.title}</h3>
          </header>

          <ol class="relative mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            ${s.map(e=>`
                  <li class="relative flex h-full flex-col rounded-card border border-line bg-bg p-6 shadow-card">
                    <div class="flex items-center gap-3">
                      <span class="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-gold">${n(e.icon)}</span>
                      <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted">${e.period}</p>
                        <p class="font-display text-sm font-semibold text-navy">${e.date}</p>
                      </div>
                    </div>
                    <h4 class="mt-5 font-display text-base font-semibold text-navy">${e.title}</h4>
                    <p class="mt-2 flex-1 text-sm leading-relaxed text-muted">${e.description}</p>
                    ${e.link?`<a class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy underline-offset-4 hover:underline" href="${e.link.href}" target="_blank" rel="noopener noreferrer">${e.link.label} <span aria-hidden="true">↗</span></a>`:""}
                  </li>
                `).join("")}
          </ol>
        </section>

        <div class="mt-20 md:mt-24 border-t border-line/60 pt-16 md:pt-20">
          ${d()}
        </div>
      </div>
    </div>
  `}export{c as mountAbout};
