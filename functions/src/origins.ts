const PRODUCTION_ORIGINS = [
	"https://notariamelipilla.cl",
	"https://www.notariamelipilla.cl",
	"https://notaria-melipilla.web.app",
	"https://notaria-melipilla.firebaseapp.com",
];

const DEV_ORIGINS = ["http://localhost:5173", "http://localhost:5000"];

// Origin is caller-controlled, so the allowlist is defense-in-depth behind App
// Check, not the primary gate. The localhost dev origins would still let any
// non-browser client pass the check by spoofing that Origin, so they are only
// admitted when the code runs under the Functions emulator. FUNCTIONS_EMULATOR
// is set to "true" there and is never present in a deployed instance.
export function buildAllowedOrigins(
	env: Record<string, string | undefined>,
): Set<string> {
	return new Set([
		...PRODUCTION_ORIGINS,
		...(env.FUNCTIONS_EMULATOR === "true" ? DEV_ORIGINS : []),
	]);
}
