export interface OrderableEvent {
	start?: { dateTime?: string; date?: string };
}

const SANTIAGO_DAY = new Intl.DateTimeFormat("en-CA", {
	timeZone: "America/Santiago",
});

/**
 * Ordering key for merging the attention and holiday feeds.
 *
 * Timed events arrive with their own UTC offset, and Chile alternates between
 * -03:00 and -04:00, so lexicographic order stops being chronological across a
 * DST boundary. All-day events arrive date-only and have no instant; parsing
 * them yields UTC midnight, hours before the Chilean day they belong to.
 *
 * Both are reduced to the local Santiago day first, then to an instant within
 * it. All-day events lead their own day; undated events sort first.
 */
function eventOrder(event: OrderableEvent): { day: string; at: number } {
	const dateTime = event.start?.dateTime;
	if (dateTime) {
		const at = Date.parse(dateTime);
		if (!Number.isNaN(at)) return { day: SANTIAGO_DAY.format(at), at };
	}
	return { day: event.start?.date ?? "", at: Number.NEGATIVE_INFINITY };
}

/** Compares without subtraction, so two undated events cannot yield NaN. */
export function compareEvents(a: OrderableEvent, b: OrderableEvent): number {
	const left = eventOrder(a);
	const right = eventOrder(b);
	if (left.day !== right.day) return left.day < right.day ? -1 : 1;
	if (left.at === right.at) return 0;
	return left.at < right.at ? -1 : 1;
}
