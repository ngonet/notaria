// Reads manifest.json from the public bucket where notIA's monthly job
// publishes the Índice PDFs, and returns each PDF's last update.
// Any failure (network, CORS, bad JSON, unexpected shape) yields an empty
// map, so callers keep the static updatedAt from site.ts.

interface ManifestEntry {
  file: string;
  updatedAt: string;
}

function isManifestEntry(value: unknown): value is ManifestEntry {
  if (typeof value !== "object" || value === null) return false;
  const { file, updatedAt } = value as Record<string, unknown>;
  return (
    typeof file === "string" &&
    typeof updatedAt === "string" &&
    !Number.isNaN(Date.parse(updatedAt))
  );
}

// Accepts the series either as an array or as an object keyed by series,
// at the top level or under "series", and matches them by file name.
export async function fetchIndexUpdates(
  manifestUrl: string,
): Promise<Map<string, string>> {
  const updates = new Map<string, string>();
  try {
    const response = await fetch(manifestUrl, { cache: "no-cache" });
    if (!response.ok) return updates;
    const body: unknown = await response.json();
    const root =
      typeof body === "object" && body !== null && "series" in body
        ? (body as { series: unknown }).series
        : body;
    if (typeof root !== "object" || root === null) return updates;
    for (const entry of Object.values(root)) {
      if (isManifestEntry(entry)) updates.set(entry.file, entry.updatedAt);
    }
  } catch {
    // Keep the static dates.
  }
  return updates;
}
