// Pure, DB-free helpers for the deedLookup endpoint: input validation,
// repertorio normalization, and per-IP rate limiting. Kept separate from
// index.ts (which wires these to Express, App Check and Cloud SQL) so they
// are unit-testable without a live database or the Functions runtime.

export const CONSULTA_TIPOS = ["escrituras", "comercio"] as const;
export type ConsultaTipo = (typeof CONSULTA_TIPOS)[number];

export interface ConsultaResult {
	tipoRepertorio: ConsultaTipo;
	repertorio: string;
	fecha: string;
	materia: string;
	foja: string | null;
}

export interface ValidConsultaInput {
	tipo: ConsultaTipo;
	repertorio: string;
}

export type ConsultaValidation =
	| { ok: true; value: ValidConsultaInput }
	| { ok: false; error: string };

// Charset allowlist for the raw (pre-normalization) repertorio: digits,
// letters, dash, slash and spaces. Broader than notia's canonical
// "NNNN-AAAA" shape so obviously-malformed input is rejected up front,
// before it ever reaches the query.
const REPERTORIO_CHARS = /^[0-9A-Za-z\-/ ]+$/;
const REPERTORIO_MAX_LENGTH = 30;

// Validates and normalizes the request body. Returns a generic error code on
// failure — never echoes back which field or why, so the response can't be
// used to probe the input format.
export function validateConsultaInput(body: unknown): ConsultaValidation {
	if (typeof body !== "object" || body === null) {
		return { ok: false, error: "invalid_body" };
	}
	const { tipo, repertorio } = body as Record<string, unknown>;

	if (
		typeof tipo !== "string" ||
		!CONSULTA_TIPOS.includes(tipo as ConsultaTipo)
	) {
		return { ok: false, error: "invalid_tipo" };
	}

	if (typeof repertorio !== "string") {
		return { ok: false, error: "invalid_repertorio" };
	}
	const trimmed = repertorio.trim();
	if (
		trimmed.length < 1 ||
		trimmed.length > REPERTORIO_MAX_LENGTH ||
		!REPERTORIO_CHARS.test(trimmed)
	) {
		return { ok: false, error: "invalid_repertorio" };
	}

	return {
		ok: true,
		value: {
			tipo: tipo as ConsultaTipo,
			repertorio: normalizeRepertorio(trimmed),
		},
	};
}

// Mirrors notia's normalizeRepertorio (packages/shared/src/schemas.ts):
// strips leading zeros from the numeric part of a "NNNN-AAAA" repertorio, so
// "0005-2026" matches the canonical "5-2026" stored by public_consulta.
// Input that does not have that num-year shape (letters, missing dash) is
// returned unchanged — it simply cannot match any row.
export function normalizeRepertorio(repertorio: string): string {
	const [num, year] = repertorio.split("-");
	if (!num || !year || !/^\d+$/.test(num)) return repertorio;
	return `${num.replace(/^0+(?=\d)/, "")}-${year}`;
}

interface RateLimitEntry {
	count: number;
	windowStart: number;
}

// Per-instance, per-IP fixed-window rate limiter. In-memory only: each Cloud
// Run instance keeps its own state, which is acceptable because App Check is
// already required for every request (see index.ts) — this only caps abuse
// from a single client hammering one warm instance.
export class RateLimiter {
	private readonly hits = new Map<string, RateLimitEntry>();

	constructor(
		private readonly windowMs = 60_000,
		private readonly max = 20,
	) {}

	// Returns true if the request is allowed, false if it should be
	// rejected with 429. `now` is injectable for deterministic tests.
	allow(ip: string, now = Date.now()): boolean {
		const entry = this.hits.get(ip);
		if (!entry || now - entry.windowStart >= this.windowMs) {
			this.hits.set(ip, { count: 1, windowStart: now });
			return true;
		}
		if (entry.count >= this.max) return false;
		entry.count += 1;
		return true;
	}
}

interface ConsultaRow {
	tipo_repertorio: string;
	repertorio: string;
	fecha: string;
	materia: string;
	foja: string | null;
}

// Maps a public_consulta row (snake_case, as returned by pg) to the camelCase
// API shape from the contract.
export function mapConsultaRow(row: ConsultaRow): ConsultaResult {
	return {
		tipoRepertorio: row.tipo_repertorio as ConsultaTipo,
		repertorio: row.repertorio,
		fecha: row.fecha,
		materia: row.materia,
		foja: row.foja,
	};
}
