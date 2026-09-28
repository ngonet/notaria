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

// notia's canonical repertorio shape (packages/shared/src/schemas.ts
// repertorioSchema): the whole string must be digits, a dash, then a
// 4-digit year — nothing before or after. notia's raw normalizeRepertorio
// only strips leading zeros via split("-"), which is safe there because
// repertorioSchema's regex already rejects non-canonical input before the
// transform runs. This endpoint has no such upstream gate, so the shape
// check is inlined here: anchoring the match end-to-end (not just splitting
// on "-") rejects input like "12-2026-X" instead of silently truncating it
// to "12-2026", which could otherwise match an unrelated deed.
const CANONICAL_REPERTORIO = /^(\d+)-(\d{4})$/;

export function normalizeRepertorio(repertorio: string): string {
	const match = CANONICAL_REPERTORIO.exec(repertorio);
	if (!match) return repertorio;
	const [, num, year] = match;
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
//
// The hit map is swept whenever it grows past MAX_TRACKED_IPS, dropping
// expired (window-elapsed) entries, so a warm instance fielding requests
// from many distinct IPs doesn't grow the map without bound.
export class RateLimiter {
	private readonly hits = new Map<string, RateLimitEntry>();

	constructor(
		private readonly windowMs = 60_000,
		private readonly max = 20,
		private readonly maxTrackedIps = 5_000,
	) {}

	// Returns true if the request is allowed, false if it should be
	// rejected with 429. `now` is injectable for deterministic tests.
	allow(ip: string, now = Date.now()): boolean {
		if (this.hits.size >= this.maxTrackedIps) {
			this.evictExpired(now);
		}

		const entry = this.hits.get(ip);
		if (!entry || now - entry.windowStart >= this.windowMs) {
			this.hits.set(ip, { count: 1, windowStart: now });
			return true;
		}
		if (entry.count >= this.max) return false;
		entry.count += 1;
		return true;
	}

	// Drops entries whose window has already elapsed. If the map is still
	// over capacity after that (e.g. a burst of distinct IPs within one
	// window), falls back to evicting the oldest entries by windowStart so
	// the map size stays bounded regardless of traffic shape.
	private evictExpired(now: number): void {
		for (const [ip, entry] of this.hits) {
			if (now - entry.windowStart >= this.windowMs) {
				this.hits.delete(ip);
			}
		}

		if (this.hits.size < this.maxTrackedIps) return;

		const oldestFirst = [...this.hits.entries()].sort(
			(a, b) => a[1].windowStart - b[1].windowStart,
		);
		const excess = this.hits.size - this.maxTrackedIps + 1;
		for (let i = 0; i < excess; i++) {
			this.hits.delete(oldestFirst[i][0]);
		}
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
