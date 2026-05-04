import { site } from "@/content/site";

export function mountCalendar(el: HTMLElement): void {
  const { eyebrow, heading, lead, loadingLabel, reservationNote } =
    site.calendar;

  el.innerHTML = `
    <div class="border-t border-line bg-surface">
      <div class="mx-auto max-w-(--container-content) px-6 py-20 md:py-28">
        <header class="mx-auto max-w-3xl text-center">
          <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${eyebrow}</p>
          <h2 id="calendario-heading" class="mt-3 font-display text-3xl text-navy md:text-4xl">${heading}</h2>
          <p class="mt-4 text-base text-muted md:text-lg">${lead}</p>
        </header>

        <div
          class="mt-12 min-h-[420px] rounded-card border border-line bg-bg p-4 shadow-card md:p-6"
          data-calendar-root
          aria-busy="true"
        >
          <p class="flex h-72 items-center justify-center text-sm text-muted" data-calendar-loading>
            ${loadingLabel}
          </p>
        </div>

        <p class="mt-6 text-center text-xs text-muted">
          ${reservationNote.beforePhone}
          <a class="font-semibold text-navy hover:underline" href="tel:${site.contact.phoneE164}">${site.contact.phoneDisplay}</a>
          ${reservationNote.afterPhone}
        </p>
      </div>
    </div>
  `;

  const root = el.querySelector<HTMLDivElement>("[data-calendar-root]");
  if (!root) return;

  const observer = new IntersectionObserver(
    async (entries) => {
      const visible = entries.some((e) => e.isIntersecting);
      if (!visible) return;
      observer.disconnect();
      await renderCalendar(root);
    },
    { rootMargin: "200px" },
  );

  observer.observe(root);
}

async function renderCalendar(root: HTMLDivElement): Promise<void> {
  const loading = root.querySelector<HTMLElement>("[data-calendar-loading]");

  try {
    const [{ Calendar }, dayGrid, { fetchCalendarEvents }] = await Promise.all([
      import("@fullcalendar/core"),
      import("@fullcalendar/daygrid"),
      import("@/lib/calendar-api"),
    ]);

    loading?.remove();
    root.removeAttribute("aria-busy");

    const calendar = new Calendar(root, {
      plugins: [dayGrid.default],
      initialView: "dayGridMonth",
      locale: "es",
      firstDay: 1,
      height: "auto",
      headerToolbar: { left: "prev,next today", center: "title", right: "" },
      buttonText: { today: site.calendar.todayLabel },
      events: async (info, success, failure) => {
        try {
          const events = await fetchCalendarEvents(info.startStr, info.endStr);
          success(
            events.map((ev) => ({
              id: ev.id,
              title: ev.title,
              start: ev.start,
              ...(ev.end ? { end: ev.end } : {}),
              allDay: ev.allDay,
              classNames: [`notaria-calendar-event--${ev.kind}`],
            })),
          );
        } catch (err) {
          failure(err as Error);
        }
      },
      eventDisplay: "block",
      displayEventEnd: true,
      eventTimeFormat: {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
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
