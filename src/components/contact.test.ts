import { beforeEach, describe, expect, it, vi } from "vitest";

const calendar = vi.hoisted(() => vi.fn());
const firebase = vi.hoisted(() => ({ getAppCheckHeader: vi.fn() }));
const fetchMock = vi.fn();

vi.mock("./calendar", () => ({ mountCalendar: calendar }));
vi.mock("@/lib/firebase", () => firebase);

import { mountContact } from "./contact";

describe("mountContact", () => {
  beforeEach(() => {
    document.body.replaceChildren();
    calendar.mockReset();
    firebase.getAppCheckHeader.mockReset();
    firebase.getAppCheckHeader.mockResolvedValue({
      "X-Firebase-AppCheck": "test-token",
    });
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("keeps contact details and the claims form usable when calendar initialization fails", () => {
    calendar.mockImplementation(() => {
      throw new Error("IntersectionObserver is unavailable");
    });
    const host = document.createElement("div");

    mountContact(host);

    expect(host.querySelector("#contacto-heading")).not.toBeNull();
    expect(host.querySelector('a[href^="tel:"]')).not.toBeNull();
    expect(host.querySelector<HTMLFormElement>("#cf-form")).not.toBeNull();
    expect(
      host.querySelector("[data-contact-calendar]")?.textContent,
    ).toContain("No fue posible cargar el calendario.");
  });

  it("submits the expected JSON body with the App Check header and confirms success", async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200 });
    const host = document.createElement("div");
    mountContact(host);

    const form = host.querySelector<HTMLFormElement>("#cf-form")!;
    host.querySelector<HTMLInputElement>("#cf-name")!.value = "Ada Lovelace";
    host.querySelector<HTMLInputElement>("#cf-email")!.value =
      "ada@example.com";
    host.querySelector<HTMLInputElement>("#cf-phone")!.value =
      "+56 9 1234 5678";
    host.querySelector<HTMLSelectElement>("#cf-subject")!.value = "Otro";
    host.querySelector<HTMLTextAreaElement>("#cf-message")!.value =
      "Necesito ayuda.";

    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());

    expect(fetchMock).toHaveBeenCalledWith("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Firebase-AppCheck": "test-token",
      },
      body: JSON.stringify({
        name: "Ada Lovelace",
        email: "ada@example.com",
        phone: "+56 9 1234 5678",
        subject: "Otro",
        message: "Necesito ayuda.",
      }),
      signal: expect.any(AbortSignal),
    });
    expect(form.classList.contains("hidden")).toBe(true);
    expect(
      host.querySelector("#cf-success")?.classList.contains("hidden"),
    ).toBe(false);
  });

  it("restores a retryable form state when the contact API fails", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 });
    const host = document.createElement("div");
    mountContact(host);

    const form = host.querySelector<HTMLFormElement>("#cf-form")!;
    host.querySelector<HTMLInputElement>("#cf-name")!.value = "Ada Lovelace";
    host.querySelector<HTMLInputElement>("#cf-email")!.value =
      "ada@example.com";
    host.querySelector<HTMLSelectElement>("#cf-subject")!.value = "Otro";
    host.querySelector<HTMLTextAreaElement>("#cf-message")!.value =
      "Necesito ayuda.";

    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    await vi.waitFor(() =>
      expect(
        host.querySelector("#cf-error")?.classList.contains("hidden"),
      ).toBe(false),
    );

    expect(host.querySelector<HTMLButtonElement>("#cf-submit")?.disabled).toBe(
      false,
    );
    expect(
      host.querySelector<HTMLButtonElement>("#cf-submit")?.textContent,
    ).toBe("Enviar reclamo");
  });
});
