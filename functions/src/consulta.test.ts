import { describe, expect, it } from "vitest";
import {
	RateLimiter,
	mapConsultaRow,
	normalizeRepertorio,
	validateConsultaInput,
} from "./consulta";

describe("validateConsultaInput", () => {
	it("rejects an invalid tipo", () => {
		expect(
			validateConsultaInput({ tipo: "vehiculos", repertorio: "1-2026" }),
		).toEqual({ ok: false, error: "invalid_tipo" });
		expect(
			validateConsultaInput({ tipo: 123, repertorio: "1-2026" }),
		).toEqual({ ok: false, error: "invalid_tipo" });
		expect(validateConsultaInput({ repertorio: "1-2026" })).toEqual({
			ok: false,
			error: "invalid_tipo",
		});
	});

	it("rejects a non-string, empty or over-length repertorio", () => {
		expect(
			validateConsultaInput({ tipo: "escrituras", repertorio: 1 }),
		).toEqual({ ok: false, error: "invalid_repertorio" });
		expect(
			validateConsultaInput({ tipo: "escrituras", repertorio: "   " }),
		).toEqual({ ok: false, error: "invalid_repertorio" });
		expect(
			validateConsultaInput({
				tipo: "escrituras",
				repertorio: "1".repeat(31),
			}),
		).toEqual({ ok: false, error: "invalid_repertorio" });
	});

	it("rejects a repertorio with disallowed characters", () => {
		expect(
			validateConsultaInput({ tipo: "escrituras", repertorio: "1-2026;drop" }),
		).toEqual({ ok: false, error: "invalid_repertorio" });
		expect(
			validateConsultaInput({ tipo: "escrituras", repertorio: "<script>" }),
		).toEqual({ ok: false, error: "invalid_repertorio" });
	});

	it("accepts a valid body and normalizes the repertorio", () => {
		expect(
			validateConsultaInput({ tipo: "comercio", repertorio: " 0007-2026 " }),
		).toEqual({ ok: true, value: { tipo: "comercio", repertorio: "7-2026" } });
	});

	it("rejects a non-object body", () => {
		expect(validateConsultaInput(null)).toEqual({
			ok: false,
			error: "invalid_body",
		});
		expect(validateConsultaInput("not an object")).toEqual({
			ok: false,
			error: "invalid_body",
		});
	});
});

describe("normalizeRepertorio", () => {
	it("strips leading zeros from the numeric part", () => {
		expect(normalizeRepertorio("0005-2026")).toBe("5-2026");
		expect(normalizeRepertorio("007-2026")).toBe("7-2026");
	});

	it("leaves an already-canonical repertorio untouched", () => {
		expect(normalizeRepertorio("10-2026")).toBe("10-2026");
	});

	it("passes through input that doesn't match the num-year shape", () => {
		expect(normalizeRepertorio("ABC-2026")).toBe("ABC-2026");
		expect(normalizeRepertorio("no-dash-here")).toBe("no-dash-here");
	});

	it("leaves input with extra segments untouched instead of truncating it", () => {
		expect(normalizeRepertorio("12-2026-X")).toBe("12-2026-X");
		expect(normalizeRepertorio("1-2-2026")).toBe("1-2-2026");
	});

	it("leaves a non-4-digit year untouched", () => {
		expect(normalizeRepertorio("12-26")).toBe("12-26");
		expect(normalizeRepertorio("12-20266")).toBe("12-20266");
	});
});

describe("RateLimiter", () => {
	it("allows requests under the limit within the window", () => {
		const limiter = new RateLimiter(60_000, 3);
		const now = 1_000_000;
		expect(limiter.allow("1.2.3.4", now)).toBe(true);
		expect(limiter.allow("1.2.3.4", now + 10)).toBe(true);
		expect(limiter.allow("1.2.3.4", now + 20)).toBe(true);
	});

	it("rejects once the limit is exceeded within the window", () => {
		const limiter = new RateLimiter(60_000, 2);
		const now = 1_000_000;
		expect(limiter.allow("1.2.3.4", now)).toBe(true);
		expect(limiter.allow("1.2.3.4", now + 10)).toBe(true);
		expect(limiter.allow("1.2.3.4", now + 20)).toBe(false);
	});

	it("resets the count once the window elapses", () => {
		const limiter = new RateLimiter(60_000, 1);
		const now = 1_000_000;
		expect(limiter.allow("1.2.3.4", now)).toBe(true);
		expect(limiter.allow("1.2.3.4", now + 60_000)).toBe(true);
	});

	it("tracks each IP independently", () => {
		const limiter = new RateLimiter(60_000, 1);
		const now = 1_000_000;
		expect(limiter.allow("1.2.3.4", now)).toBe(true);
		expect(limiter.allow("5.6.7.8", now)).toBe(true);
	});

	it("evicts expired entries once the tracked-IP cap is reached", () => {
		const limiter = new RateLimiter(60_000, 5, 2);
		const now = 1_000_000;

		// Fill the map with entries whose window has already elapsed.
		expect(limiter.allow("1.1.1.1", now)).toBe(true);
		expect(limiter.allow("2.2.2.2", now)).toBe(true);

		// This third call hits the cap and triggers a sweep; both prior
		// entries are expired by `now + 60_000`, so they're evicted and the
		// map never exceeds maxTrackedIps.
		expect(limiter.allow("3.3.3.3", now + 60_000)).toBe(true);
		expect((limiter as unknown as { hits: Map<string, unknown> }).hits.size).toBe(
			1,
		);
	});

	it("falls back to evicting the oldest entries when nothing has expired", () => {
		const limiter = new RateLimiter(60_000, 5, 2);
		const now = 1_000_000;

		expect(limiter.allow("1.1.1.1", now)).toBe(true);
		expect(limiter.allow("2.2.2.2", now + 10)).toBe(true);
		// Cap reached with no expired entries: the oldest (1.1.1.1) is
		// evicted to make room instead of the map growing unbounded.
		expect(limiter.allow("3.3.3.3", now + 20)).toBe(true);

		const hits = (limiter as unknown as { hits: Map<string, unknown> }).hits;
		expect(hits.size).toBe(2);
		expect(hits.has("1.1.1.1")).toBe(false);
		expect(hits.has("3.3.3.3")).toBe(true);
	});
});

describe("mapConsultaRow", () => {
	it("maps snake_case DB columns to the camelCase API shape", () => {
		expect(
			mapConsultaRow({
				tipo_repertorio: "escrituras",
				repertorio: "5-2026",
				fecha: "2026-01-10",
				materia: "COMPRAVENTA",
				foja: "12",
				numero_protocolizado: "321",
				comparecientes: "Ana Pérez, Empresa Limitada",
			}),
		).toEqual({
			tipoRepertorio: "escrituras",
			repertorio: "5-2026",
			fecha: "2026-01-10",
			materia: "COMPRAVENTA",
			foja: "12",
			numeroProtocolizado: "321",
			comparecientes: "Ana Pérez, Empresa Limitada",
		});
	});

	it("passes through null values", () => {
		expect(
			mapConsultaRow({
				tipo_repertorio: "comercio",
				repertorio: "1-2026",
				fecha: "2026-02-01",
				materia: "CONSTITUCION DE SOCIEDAD",
				foja: null,
				numero_protocolizado: null,
				comparecientes: null,
			}),
		).toMatchObject({
			foja: null,
			numeroProtocolizado: null,
			comparecientes: null,
		});
	});
});
