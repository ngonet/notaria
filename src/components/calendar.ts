import { site } from "@/content/site";
import { makeElement } from "@/lib/dom";

export function reportCalendarFailure(): void {
  window.dispatchEvent(
    new CustomEvent("notaria:mount-failed", {
      detail: { mount: "calendar", message: "request_failed" },
    }),
  );
}

export function showCalendarRecovery(
  root: HTMLDivElement,
  retry: () => void,
): void {
  root.querySelector("[data-calendar-recovery]")?.remove();
  const recovery = document.createElement("div");
  recovery.className = "mt-4 flex flex-wrap items-center justify-center gap-4";
  recovery.dataset.calendarRecovery = "";
  const message = makeElement(
    "p",
    "text-sm text-muted",
    site.calendar.errorMessage,
  );
  message.setAttribute("role", "alert");
  const button = makeElement(
    "button",
    "rounded-md border border-navy px-4 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white",
    site.calendar.retryLabel,
  );
  button.type = "button";
  button.addEventListener("click", retry);
  recovery.append(message, button);
  root.append(recovery);
}

export function mountCalendar(el: HTMLElement): void {
  const { eyebrow, heading, lead, loadingLabel, reservationNote } =
    site.calendar;

  const wrapper = document.createElement("div");
  wrapper.className = "mt-16 border-t border-line/60 pt-16";
  const header = document.createElement("header");
  header.className = "mx-auto max-w-3xl text-center";
  const title = makeElement(
    "h3",
    "mt-3 font-display text-2xl text-navy md:text-3xl",
    heading,
  );
  title.id = "calendario-heading";
  header.append(
    makeElement(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      eyebrow,
    ),
    title,
    makeElement("p", "mt-4 text-base text-muted md:text-lg", lead),
  );

  const root = document.createElement("div");
  root.className =
    "mt-12 min-h-[420px] rounded-card border border-line bg-surface p-4 shadow-card md:p-6";
  root.dataset.calendarRoot = "";
  root.setAttribute("aria-busy", "true");
  const loading = makeElement(
    "p",
    "flex h-72 items-center justify-center text-sm text-muted",
    loadingLabel,
  );
  loading.dataset.calendarLoading = "";
  root.append(loading);

  const reservation = makeElement(
    "p",
    "mt-6 text-center text-xs text-muted",
    reservationNote.beforePhone,
  );
  const phoneLink = makeElement(
    "a",
    "font-semibold text-navy hover:underline",
    site.contact.phoneDisplay,
  );
  phoneLink.href = `tel:${site.contact.phoneE164}`;
  reservation.append(
    phoneLink,
    document.createTextNode(reservationNote.afterPhone),
  );

  wrapper.append(header, root, reservation);
  el.replaceChildren(wrapper);

  const observer = new IntersectionObserver(
    async (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (!visible) return;
      observer.disconnect();
      await renderCalendar(root);
    },
    { rootMargin: "200px" },
  );

  observer.observe(root);
}

export async function renderCalendar(root: HTMLDivElement): Promise<void> {
  const loading = root.querySelector<HTMLElement>("[data-calendar-loading]");

  try {
    const [{ Calendar }, dayGrid, { fetchCalendarEvents }] = await Promise.all([
      import("@fullcalendar/core"),
      import("@fullcalendar/daygrid"),
      import("@/lib/calendar-api"),
    ]);

    loading?.remove();
    root.removeAttribute("aria-busy");

    let calendar: { refetchEvents: () => void; render: () => void };
    calendar = new Calendar(root, {
      plugins: [dayGrid.default],
      initialView: "dayGridMonth",
      locale: "es",
      firstDay: 1,
      height: "auto",
      headerToolbar: { left: "prev,next today", center: "title", right: "" },
      buttonText: { today: site.calendar.todayLabel },
      events: async (info, success, failure) => {
        root.setAttribute("aria-busy", "true");
        try {
          const events = await fetchCalendarEvents(info.startStr, info.endStr);
          root.querySelector("[data-calendar-recovery]")?.remove();
          success(
            events.map((event) => ({
              id: event.id,
              title: event.title,
              start: event.start,
              ...(event.end ? { end: event.end } : {}),
              allDay: event.allDay,
              classNames: [`notaria-calendar-event--${event.kind}`],
              extendedProps: { kind: event.kind },
            })),
          );
        } catch (err) {
          reportCalendarFailure();
          showCalendarRecovery(root, () => calendar.refetchEvents());
          failure(err as Error);
        } finally {
          root.removeAttribute("aria-busy");
        }
      },
      eventDisplay: "block",
      displayEventEnd: true,
      eventTimeFormat: {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
      eventContent: (arg) => {
        const kind = arg.event.extendedProps.kind as string | undefined;
        const content = document.createElement("span");
        content.className = "notaria-calendar-event__content";

        const title = document.createElement("span");
        title.className = "notaria-calendar-event__title";
        title.textContent = arg.event.title;
        content.append(title);

        if (kind === "attention" && arg.timeText) {
          const time = document.createElement("span");
          time.className = "notaria-calendar-event__time";
          time.textContent = arg.timeText.replace(" - ", "–");
          content.append(time);
        }

        return { domNodes: [content] };
      },
    });

    calendar.render();
  } catch (err) {
    console.error("[notaria] calendar failed to load", err);
    if (loading) {
      loading.textContent = site.calendar.errorMessage;
    }
    root.removeAttribute("aria-busy");
  }
}
