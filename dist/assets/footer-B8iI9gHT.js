import{s as e}from"./site-DrCzpknc.js";function l(a){const t=e.contact;a.innerHTML=`
    <footer class="bg-navy text-white">
      <div class="mx-auto grid max-w-(--container-content) gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p class="font-display text-xl font-semibold">${e.brand}</p>
          <p class="mt-2 text-sm text-white/70">${e.tagline}</p>
          <p class="mt-6 text-sm text-white/70">${t.street} · ${t.city}</p>
          <a class="mt-2 inline-block text-sm font-semibold text-gold hover:text-gold-soft" href="tel:${t.phoneE164}">${t.phoneDisplay}</a>
        </div>

        <nav aria-label="Enlaces de pie">
          <p class="font-display text-sm uppercase tracking-[0.22em] text-gold">Sitio</p>
          <ul class="mt-4 space-y-2 text-sm text-white/80">
            ${e.nav.map(s=>`
                  <li><a class="hover:text-white" href="${s.href}">${s.label}</a></li>
                `).join("")}
          </ul>
        </nav>

        <div>
          <p class="font-display text-sm uppercase tracking-[0.22em] text-gold">Atención</p>
          <ul class="mt-4 space-y-2 text-sm text-white/80">
            <li>${t.schedule.weekdays}</li>
            <li>${t.schedule.saturdays}</li>
            <li><a class="hover:text-white" href="mailto:${t.email}">${t.email}</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-white/10">
        <p class="mx-auto max-w-(--container-content) px-6 py-6 text-center text-xs text-white/60">${e.footer.copyright}</p>
      </div>
    </footer>
  `}export{l as mountFooter};
