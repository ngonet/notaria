import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/firebase", () => ({
  getAppCheckHeader: vi.fn(async () => ({})),
}));

import { mountConsulta } from "./consulta";
import { mountContact } from "./contact";
import { mountFooter } from "./footer";
import { mountPrivacy } from "./privacy";

function mount(fn: (el: HTMLElement) => void): HTMLElement {
  const el = document.createElement("div");
  document.body.append(el);
  fn(el);
  return el;
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
});

describe("privacy policy page", () => {
  it("renders the policy with its heading, date and sections", () => {
    const el = mount(mountPrivacy);

    const h1 = el.querySelector("h1");
    expect(h1?.id).toBe("privacidad-heading");
    expect(h1?.textContent).toBe("Política de privacidad");
    expect(el.textContent).toContain(
      "Última actualización: 27 de noviembre de 2026",
    );
    expect(Array.from(el.querySelectorAll("h2"), (h) => h.textContent)).toEqual(
      [
        "1. Responsable",
        "2. Normativa aplicable",
        "3. Datos que se tratan en este sitio",
        "4. Datos del registro notarial",
        "5. Sus derechos",
        "6. Seguridad",
        "7. Cambios a esta política",
      ],
    );
    expect(el.textContent).toContain(
      "Esta política explica qué datos personales trata la Notaría a través de este sitio web y del registro notarial, para qué los usa y cómo puede ejercer sus derechos.",
    );
    expect(
      el.querySelector('a[href="https://policies.google.com/privacy"]'),
    ).not.toBeNull();
    expect(el.querySelector('a[href="/"]')?.textContent).toContain(
      "Volver al inicio",
    );
  });

  it("publishes the AI support bullet and no review markers", () => {
    const el = mount(mountPrivacy);

    expect(el.textContent).toContain(
      "Apoyo de inteligencia artificial: para facilitar la digitación, el sistema puede enviar la escritura escaneada a un servicio de inteligencia artificial de Google (Gemini)",
    );
    expect(el.textContent).toContain(
      "y los conserva hasta 55 días solo para detectar abusos y cumplir obligaciones legales. Google puede procesarlos fuera de Chile.",
    );
    expect(el.textContent).not.toMatch(
      /VERIFICAR|DECISIÓN DEL NOTARIO|Nota interna|fecha de publicación/,
    );
  });
});

describe("footer", () => {
  it("links to the privacy policy", () => {
    const el = mount(mountFooter);

    const link = Array.from(el.querySelectorAll("a")).find(
      (a) => a.textContent?.trim() === "Política de privacidad",
    );
    expect(link?.getAttribute("href")).toBe("/privacidad/");
  });

  it("keeps section links in-page on the home page and points them home elsewhere", () => {
    const section = document.createElement("section");
    section.id = "servicios";
    document.body.append(section);
    const onHome = mount(mountFooter);
    expect(onHome.querySelector('nav a[href="#servicios"]')?.textContent).toBe(
      "Servicios",
    );

    document.body.innerHTML = "";
    const elsewhere = mount(mountFooter);
    expect(
      elsewhere.querySelector('nav a[href="/#servicios"]')?.textContent,
    ).toBe("Servicios");
  });
});

describe("contact form consent", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
  });

  function fillForm(el: HTMLElement): void {
    const set = (selector: string, value: string) => {
      el.querySelector<HTMLInputElement>(selector)!.value = value;
    };
    set("#cf-name", "Ana Pérez");
    set("#cf-email", "ana@example.com");
    set("#cf-phone", "");
    set("#cf-subject", "Otro");
    set("#cf-message", "Consulta de prueba");
  }

  function submit(el: HTMLElement): void {
    el.querySelector<HTMLFormElement>("#cf-form")!.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  }

  it("has a required consent checkbox linking to the policy", () => {
    const el = mount(mountContact);

    const checkbox = el.querySelector<HTMLInputElement>("#cf-consent")!;
    expect(checkbox.type).toBe("checkbox");
    expect(checkbox.required).toBe(true);
    const label = el.querySelector('label[for="cf-consent"]')!;
    expect(label.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "He leído y acepto la Política de privacidad",
    );
    expect(label.querySelector("a")?.getAttribute("href")).toBe("/privacidad/");
  });

  it("blocks submission until the checkbox is checked, with an accessible error", async () => {
    const el = mount(mountContact);
    fillForm(el);

    submit(el);
    await vi.waitFor(() => {
      expect(
        el.querySelector("#cf-consent-error")!.classList.contains("hidden"),
      ).toBe(false);
    });
    const checkbox = el.querySelector<HTMLInputElement>("#cf-consent")!;
    const error = el.querySelector("#cf-consent-error")!;
    expect(fetchMock).not.toHaveBeenCalled();
    expect(checkbox.getAttribute("aria-invalid")).toBe("true");
    expect(checkbox.getAttribute("aria-describedby")).toBe("cf-consent-error");
    expect(error.getAttribute("role")).toBe("alert");
    expect(error.textContent).toBe(
      "Para enviar el reclamo debe aceptar la Política de privacidad.",
    );
    expect(document.activeElement).toBe(checkbox);
  });

  it("submits once checked, without sending the consent field", async () => {
    const el = mount(mountContact);
    fillForm(el);
    const checkbox = el.querySelector<HTMLInputElement>("#cf-consent")!;
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event("change"));

    submit(el);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/contact");
    expect(JSON.parse(init.body as string)).toEqual({
      name: "Ana Pérez",
      email: "ana@example.com",
      phone: "",
      subject: "Otro",
      message: "Consulta de prueba",
    });
    expect(
      el.querySelector("#cf-consent-error")!.classList.contains("hidden"),
    ).toBe(true);
  });
});

describe("consulta privacy note", () => {
  it("links to the privacy policy", () => {
    const el = mount(mountConsulta);

    const link = el.querySelector("details a");
    expect(link?.getAttribute("href")).toBe("/privacidad/");
    expect(link?.textContent).toBe("Ver la Política de privacidad");
  });
});
