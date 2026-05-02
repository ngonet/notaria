import "./styles/tailwind.css";

type Mount = (el: HTMLElement) => void;

const mounts: Record<string, () => Promise<Mount>> = {
  nav: () => import("@/components/nav").then((m) => m.mountNav),
  hero: () => import("@/components/hero").then((m) => m.mountHero),
  services: () => import("@/components/services").then((m) => m.mountServices),
  funcionarios: () =>
    import("@/components/funcionarios").then((m) => m.mountFuncionarios),
  aranceles: () =>
    import("@/components/aranceles").then((m) => m.mountAranceles),
  about: () => import("@/components/about").then((m) => m.mountAbout),
  documents: () =>
    import("@/components/documents").then((m) => m.mountDocuments),
  contact: () => import("@/components/contact").then((m) => m.mountContact),
  calendar: () => import("@/components/calendar").then((m) => m.mountCalendar),
  footer: () => import("@/components/footer").then((m) => m.mountFooter),
};

async function bootstrap(): Promise<void> {
  const nodes = document.querySelectorAll<HTMLElement>("[data-mount]");
  await Promise.all(
    Array.from(nodes).map(async (el) => {
      const key = el.dataset.mount;
      if (!key) return;
      const loader = mounts[key];
      if (!loader) {
        console.warn(`[notaria] no mount registered for "${key}"`);
        return;
      }
      const mount = await loader();
      mount(el);
    }),
  );
}

bootstrap().catch((err) => {
  console.error("[notaria] bootstrap failed", err);
});
