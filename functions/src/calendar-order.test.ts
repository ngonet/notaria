import { describe, expect, it } from "vitest";
import { compareEvents } from "./calendar-order";

interface TestEvent {
	id: string;
	start?: { dateTime?: string; date?: string };
}

function order(events: TestEvent[]): string[] {
	return [...events].sort(compareEvents).map((event) => event.id);
}

describe("compareEvents", () => {
	it("orders timed events by instant, not by text, across a DST offset change", () => {
		// 00:30-04:00 is 04:30Z; 01:00-03:00 is 04:00Z. As text the first sorts
		// first, but it happens 30 minutes later.
		expect(
			order([
				{ id: "later", start: { dateTime: "2026-04-05T00:30:00-04:00" } },
				{ id: "earlier", start: { dateTime: "2026-04-05T01:00:00-03:00" } },
			]),
		).toEqual(["earlier", "later"]);
	});

	it("keeps a timed event on day N+1 after an all-day event on day N", () => {
		expect(
			order([
				{ id: "timed", start: { dateTime: "2026-07-17T09:00:00-04:00" } },
				{ id: "holiday", start: { date: "2026-07-16" } },
			]),
		).toEqual(["holiday", "timed"]);
	});

	it("keeps an all-day event after a timed event on the previous Santiago day", () => {
		// 22:00-04:00 on the 15th is 02:00Z on the 16th, so UTC-based day logic
		// would wrongly place it on the holiday's day.
		expect(
			order([
				{ id: "holiday", start: { date: "2026-07-16" } },
				{ id: "timed", start: { dateTime: "2026-07-15T22:00:00-04:00" } },
			]),
		).toEqual(["timed", "holiday"]);
	});

	it("puts an all-day event before a timed event on the same day", () => {
		expect(
			order([
				{ id: "timed", start: { dateTime: "2026-07-16T00:30:00-04:00" } },
				{ id: "holiday", start: { date: "2026-07-16" } },
			]),
		).toEqual(["holiday", "timed"]);
	});

	it("orders undated events deterministically and ahead of dated ones, never via NaN", () => {
		const events: TestEvent[] = [
			{ id: "undated-a" },
			{ id: "dated", start: { dateTime: "2026-07-15T10:00:00-04:00" } },
			{ id: "undated-b", start: {} },
			{ id: "undated-c" },
		];
		expect(compareEvents(events[0], events[2])).toBe(0);
		const ids = order(events);
		expect(ids[ids.length - 1]).toBe("dated");
		expect(new Set(ids)).toEqual(
			new Set(["undated-a", "undated-b", "undated-c", "dated"]),
		);
		expect(ids).toHaveLength(4);
	});
});
