import { site } from "@/content/site";

const AUTOPLAY_MS = 7000;

export function mountHero(el: HTMLElement): void {
  const slides = site.hero.slides;

  el.innerHTML = `
    <section class="relative isolate overflow-hidden bg-navy text-white">
      <div class="relative" data-hero-track>
        ${slides
          .map(
            (slide, index) => `
              <article
                class="grid gap-10 px-6 py-20 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-16 md:py-28 ${index === 0 ? "" : "hidden"}"
                data-hero-slide
                data-index="${index}"
              >
                <div class="mx-auto max-w-2xl md:mx-0">
                  <p class="font-display text-sm uppercase tracking-[0.32em] text-gold">${site.tagline}</p>
                  <h1 class="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">${slide.title}</h1>
                  <p class="mt-6 text-lg text-white/85 md:text-xl">${slide.subtitle}</p>
                  <p class="mt-3 text-base text-white/65">${slide.caption}</p>
                  <div class="mt-8 flex flex-wrap gap-3">
                    <a href="#servicios" class="inline-flex items-center gap-2 rounded-md bg-gold px-5 py-3 font-semibold text-navy transition hover:bg-gold-soft">Ver servicios</a>
                    <a href="#contacto" class="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10">Contactar</a>
                  </div>
                </div>
                <div class="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-card shadow-2xl ring-1 ring-white/10">
                  <picture>
                    <source srcset="${slide.image.replace(/\.(jpg|png)$/, '.webp')}" type="image/webp" />
                    <img
                      src="${slide.image}"
                      alt="${slide.alt}"
                      loading="${index === 0 ? "eager" : "lazy"}"
                      decoding="async"
                      width="800"
                      height="600"
                      class="h-full w-full object-cover"
                    />
                  </picture>
                  <div class="absolute inset-0 bg-gradient-to-tr from-navy/40 via-transparent to-transparent"></div>
                </div>
              </article>
            `,
          )
          .join("")}
      </div>

      <div class="absolute inset-x-0 bottom-6 flex items-center justify-center gap-3 md:bottom-10" role="tablist" aria-label="Carrusel de presentación">
        ${slides
          .map(
            (_, index) => `
              <button
                type="button"
                role="tab"
                aria-selected="${index === 0}"
                aria-label="Ir al slide ${index + 1}"
                class="h-2.5 w-8 rounded-full transition ${index === 0 ? "bg-gold" : "bg-white/30 hover:bg-white/60"}"
                data-hero-dot
                data-index="${index}"
              ></button>
            `,
          )
          .join("")}
      </div>
    </section>
  `;

  if (slides.length <= 1) return;

  let active = 0;
  const slideEls = el.querySelectorAll<HTMLElement>("[data-hero-slide]");
  const dots = el.querySelectorAll<HTMLButtonElement>("[data-hero-dot]");

  const show = (next: number) => {
    if (next === active) return;
    slideEls[active]?.classList.add("hidden");
    slideEls[next]?.classList.remove("hidden");
    dots[active]?.classList.replace("bg-gold", "bg-white/30");
    dots[active]?.setAttribute("aria-selected", "false");
    dots[next]?.classList.replace("bg-white/30", "bg-gold");
    dots[next]?.setAttribute("aria-selected", "true");
    active = next;
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = Number(dot.dataset.index);
      show(target);
      restart();
    });
  });

  let timer: number | undefined;
  const restart = () => {
    if (timer) window.clearInterval(timer);
    timer = window.setInterval(
      () => show((active + 1) % slides.length),
      AUTOPLAY_MS,
    );
  };

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (!reduceMotion) restart();
}
