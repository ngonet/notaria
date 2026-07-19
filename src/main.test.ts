import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const mounts = vi.hoisted(() => ({
  nav: vi.fn(),
  hero: vi.fn(),
  services: vi.fn(),
  about: vi.fn(),
  documents: vi.fn(),
  transparency: vi.fn(),
  contact: vi.fn(),
  footer: vi.fn(),
}));
const firebase = vi.hoisted(() => ({ getAppCheckHeader: vi.fn() }));

vi.mock("@/components/nav", () => ({ mountNav: mounts.nav }));
vi.mock("@/components/hero", () => ({ mountHero: mounts.hero }));
vi.mock("@/components/services", () => ({ mountServices: mounts.services }));
vi.mock("@/components/about", () => ({ mountAbout: mounts.about }));
vi.mock("@/components/documents", () => ({
  mountDocuments: mounts.documents,
}));
vi.mock("@/components/transparency", () => ({
  mountTransparency: mounts.transparency,
}));
vi.mock("@/components/contact", () => ({ mountContact: mounts.contact }));
vi.mock("@/components/footer", () => ({ mountFooter: mounts.footer }));
vi.mock("@/lib/firebase", () => firebase);

let bootstrap: () => Promise<void>;

beforeAll(async () => {
  document.body.replaceChildren();
  ({ bootstrap } = await import("./main"));
});

beforeEach(() => {
  document.body.replaceChildren();
  history.replaceState(null, "", "/");
  Object.values(mounts).forEach((mount) => mount.mockReset());
  firebase.getAppCheckHeader.mockReset();
  firebase.getAppCheckHeader.mockResolvedValue({});
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
});

describe("bootstrap", () => {
  it("isolates a failed lazy mount while mounting later sections and publishing a failure event", async () => {
    mounts.nav.mockImplementation(() => {
      throw new Error("navigation unavailable");
    });

    const failureListener = vi.fn();
    window.addEventListener("notaria:mount-failed", failureListener);
    const nav = document.createElement("div");
    nav.dataset.mount = "nav";
    const hero = document.createElement("div");
    hero.dataset.mount = "hero";
    document.body.append(nav, hero);

    await bootstrap();

    expect(mounts.hero).toHaveBeenCalledOnce();
    expect(nav.querySelector('[role="alert"]')?.textContent).toBe(
      "No fue posible cargar esta sección. Intente recargar la página.",
    );
    expect(failureListener).toHaveBeenCalledOnce();
    expect(failureListener.mock.calls[0]?.[0]).toMatchObject({
      type: "notaria:mount-failed",
      detail: { mount: "nav", message: "navigation unavailable" },
    });
    window.removeEventListener("notaria:mount-failed", failureListener);
  });

  it("mounts route sections before scrolling to the current hash target", async () => {
    const target = document.createElement("section");
    target.id = "contacto";
    const scrollIntoView = vi.fn();
    target.scrollIntoView = scrollIntoView;
    const nav = document.createElement("div");
    nav.dataset.mount = "nav";
    const contact = document.createElement("div");
    contact.dataset.mount = "contact";
    document.body.append(nav, contact, target);
    history.replaceState(null, "", "#contacto");

    await bootstrap();

    expect(mounts.nav).toHaveBeenCalledOnce();
    expect(mounts.contact).toHaveBeenCalledOnce();
    expect(scrollIntoView).toHaveBeenCalledOnce();
  });
});
