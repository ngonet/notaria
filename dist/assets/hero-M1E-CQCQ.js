import{s as c}from"./site-DrCzpknc.js";const g=7e3;function h(r){const s=c.hero.slides;if(r.innerHTML=`
    <section class="relative isolate overflow-hidden bg-navy text-white">
      <div class="relative" data-hero-track>
        ${s.map((e,t)=>`
              <article
                class="grid gap-10 px-6 py-20 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-16 md:py-28 ${t===0?"":"hidden"}"
                data-hero-slide
                data-index="${t}"
              >
                <div class="mx-auto max-w-2xl md:mx-0">
                  <p class="font-display text-sm uppercase tracking-[0.32em] text-gold">${c.tagline}</p>
                  <h1 class="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">${e.title}</h1>
                  <p class="mt-6 text-lg text-white/85 md:text-xl">${e.subtitle}</p>
                  <p class="mt-3 text-base text-white/65">${e.caption}</p>
                  <div class="mt-8 flex flex-wrap gap-3">
                    <a href="#servicios" class="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 font-semibold text-navy transition hover:bg-gold-soft">Ver servicios</a>
                    <a href="#contacto" class="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10">Contactar</a>
                  </div>
                </div>
                <div class="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-card shadow-2xl ring-1 ring-white/10">
                  <picture>
                    <source srcset="${e.image.replace(/\.(jpg|png)$/,".webp")}" type="image/webp" />
                    <img
                      src="${e.image}"
                      alt="${e.alt}"
                      loading="${t===0?"eager":"lazy"}"
                      decoding="async"
                      width="800"
                      height="600"
                      class="h-full w-full object-cover"
                    />
                  </picture>
                  <div class="absolute inset-0 bg-gradient-to-tr from-navy/40 via-transparent to-transparent"></div>
                </div>
              </article>
            `).join("")}
      </div>

      <div class="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3 md:bottom-10" role="tablist" aria-label="Carrusel de presentación">
        ${s.map((e,t)=>`
              <button
                type="button"
                role="tab"
                aria-selected="${t===0}"
                aria-label="Ir al slide ${t+1}"
                class="h-2.5 w-8 rounded-full transition ${t===0?"bg-gold":"bg-white/30 hover:bg-white/60"}"
                data-hero-dot
                data-index="${t}"
              ></button>
            `).join("")}
      </div>
    </section>
  `,s.length<=1)return;let a=0;const o=r.querySelectorAll("[data-hero-slide]"),i=r.querySelectorAll("[data-hero-dot]"),d=e=>{e!==a&&(o[a]?.classList.add("hidden"),o[e]?.classList.remove("hidden"),i[a]?.classList.replace("bg-gold","bg-white/30"),i[a]?.setAttribute("aria-selected","false"),i[e]?.classList.replace("bg-white/30","bg-gold"),i[e]?.setAttribute("aria-selected","true"),a=e)};i.forEach(e=>{e.addEventListener("click",()=>{const t=Number(e.dataset.index);d(t),n()})});let l;const n=()=>{l&&window.clearInterval(l),l=window.setInterval(()=>d((a+1)%s.length),g)};window.matchMedia("(prefers-reduced-motion: reduce)").matches||n()}export{h as mountHero};
