import { beforeEach, describe, expect, it, vi } from "vitest";

type EventsFetcher = (
  info: { startStr: string; endStr: string },
  success: (events: unknown[]) => void,
  failure: (err: Error) => void,
) => Promise<void>;

const fetchCalendarEvents = vi.hoisted(() => vi.fn());
const render = vi.hoisted(() => vi.fn());
const refetchEvents = vi.hoisted(() => vi.fn());
const capturedConfig = vi.hoisted(
  () => ({ current: null }) as { current: { events: EventsFetcher } | null },
);

vi.mock("@fullcalendar/core", () => ({
  Calendar: class {
    constructor(_el: HTMLElement, config: { events: EventsFetcher }) {
      capturedConfig.current = config;
    }
    render = render;
    refetchEvents = refetchEvents;
  },
}));
vi.mock("@fullcalendar/daygrid", () => ({ default: {} }));
vi.mock("@/lib/calendar-api", () => ({ fetchCalendarEvents }));

import {
  renderCalendar,
  reportCalendarFailure,
  showCalendarRecovery,
} from "./calendar";

describe("showCalendarRecovery", () => {
  it("uses the shared mount-failure event for calendar request telemetry", () => {
    const listener = vi.fn();
    window.addEventListener("notaria:mount-failed", listener);

    reportCalendarFailure();

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { mount: "calendar", message: "request_failed" },
      }),
    );
    window.removeEventListener("notaria:mount-failed", listener);
  });

  it("replaces duplicate errors and gives the visitor a retry control", () => {
    const root = document.createElement("div");
    const retry = vi.fn();

    showCalendarRecovery(root, retry);
    showCalendarRecovery(root, retry);

    const button = root.querySelector<HTMLButtonElement>("button");
    expect(root.querySelectorAll("[data-calendar-recovery]")).toHaveLength(1);
    expect(root.querySelector('[role="alert"]')?.textContent).toBe(
      "No fue posible cargar el calendario. Intente más tarde.",
    );
    expect(button?.textContent).toBe("Reintentar calendario");
    button?.click();
    expect(retry).toHaveBeenCalledOnce();
  });
});
function calendarRoot(): HTMLDivElement {
  const root = document.createElement("div");
  root.setAttribute("aria-busy", "true");
  const loading = document.createElement("p");
  loading.dataset.calendarLoading = "";
  loading.textContent = "Cargando";
  root.append(loading);
  return root;
}

async function runEventsFetcher() {
  const events = capturedConfig.current?.events;
  if (!events) throw new Error("calendar config was never captured");
  const success = vi.fn();
  const failure = vi.fn();
  await events(
    { startStr: "2026-07-01", endStr: "2026-08-01" },
    success,
    failure,
  );
  return { success, failure };
}

describe("renderCalendar integration", () => {
  beforeEach(() => {
    capturedConfig.current = null;
    fetchCalendarEvents.mockReset();
    render.mockReset();
    refetchEvents.mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("clears the loading state and renders once the calendar module loads", async () => {
    fetchCalendarEvents.mockResolvedValue([]);
    const root = calendarRoot();

    await renderCalendar(root);

    expect(root.querySelector("[data-calendar-loading]")).toBeNull();
    expect(root.hasAttribute("aria-busy")).toBe(false);
    expect(render).toHaveBeenCalledOnce();
  });

  it("maps fetched events onto the FullCalendar event shape", async () => {
    fetchCalendarEvents.mockResolvedValue([
      {
        id: "evt-1",
        title: "Atención de público",
        start: "2026-07-06T09:00:00-04:00",
        end: "2026-07-06T14:00:00-04:00",
        allDay: false,
        kind: "attention",
      },
      {
        id: "evt-2",
        title: "Feriado",
        start: "2026-07-16",
        allDay: true,
        kind: "holiday",
      },
    ]);
    const root = calendarRoot();

    await renderCalendar(root);
    const { success, failure } = await runEventsFetcher();

    expect(failure).not.toHaveBeenCalled();
    expect(fetchCalendarEvents).toHaveBeenCalledWith(
      "2026-07-01",
      "2026-08-01",
    );
    const [mapped] = success.mock.calls[0] as [Array<Record<string, unknown>>];
    expect(mapped[0]).toMatchObject({
      id: "evt-1",
      title: "Atención de público",
      end: "2026-07-06T14:00:00-04:00",
      allDay: false,
      classNames: ["notaria-calendar-event--attention"],
      extendedProps: { kind: "attention" },
    });
    expect(mapped[1]).not.toHaveProperty("end");
    expect(root.hasAttribute("aria-busy")).toBe(false);
  });

  it("surfaces a retry control and reports telemetry when the fetch fails", async () => {
    fetchCalendarEvents.mockRejectedValue(new Error("upstream_failed"));
    const listener = vi.fn();
    window.addEventListener("notaria:mount-failed", listener);
    const root = calendarRoot();

    await renderCalendar(root);
    const { success, failure } = await runEventsFetcher();

    expect(success).not.toHaveBeenCalled();
    expect(failure).toHaveBeenCalledOnce();
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { mount: "calendar", message: "request_failed" },
      }),
    );
    expect(root.querySelector("[data-calendar-recovery]")).not.toBeNull();
    expect(root.hasAttribute("aria-busy")).toBe(false);
    window.removeEventListener("notaria:mount-failed", listener);
  });

  it("refetches events when the visitor uses the retry control", async () => {
    fetchCalendarEvents.mockRejectedValue(new Error("upstream_failed"));
    const root = calendarRoot();

    await renderCalendar(root);
    await runEventsFetcher();
    root
      .querySelector<HTMLButtonElement>("[data-calendar-recovery] button")
      ?.click();

    expect(refetchEvents).toHaveBeenCalledOnce();
  });

  it("removes a stale recovery notice once a later fetch succeeds", async () => {
    fetchCalendarEvents.mockRejectedValueOnce(new Error("upstream_failed"));
    const root = calendarRoot();

    await renderCalendar(root);
    await runEventsFetcher();
    expect(root.querySelector("[data-calendar-recovery]")).not.toBeNull();

    fetchCalendarEvents.mockResolvedValueOnce([]);
    await runEventsFetcher();

    expect(root.querySelector("[data-calendar-recovery]")).toBeNull();
  });

  it("shows the error message instead of a broken calendar when the module fails to load", async () => {
    const root = calendarRoot();
    vi.doMock("@fullcalendar/core", () => {
      throw new Error("chunk load failed");
    });
    vi.resetModules();
    const { renderCalendar: freshRender } = await import("./calendar");

    await freshRender(root);

    expect(
      root.querySelector<HTMLElement>("[data-calendar-loading]")?.textContent,
    ).toBe("No fue posible cargar el calendario. Intente más tarde.");
    expect(root.hasAttribute("aria-busy")).toBe(false);
    vi.doUnmock("@fullcalendar/core");
    vi.resetModules();
  });
});
