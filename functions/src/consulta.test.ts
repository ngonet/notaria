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
			}),
		).toEqual({
			tipoRepertorio: "escrituras",
			repertorio: "5-2026",
			fecha: "2026-01-10",
			materia: "COMPRAVENTA",
			foja: "12",
		});
	});

	it("passes through a null foja", () => {
		expect(
			mapConsultaRow({
				tipo_repertorio: "comercio",
				repertorio: "1-2026",
				fecha: "2026-02-01",
				materia: "CONSTITUCION DE SOCIEDAD",
				foja: null,
			}).foja,
		).toBeNull();
	});
});
