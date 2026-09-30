import { site, type ConsultaContent } from "@/content/site";
import { getAppCheckHeader } from "@/lib/firebase";

const INPUT_CLASS =
  "mt-1 w-full rounded border border-line bg-bg px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-gold/60";
const LABEL_CLASS = "block text-sm font-semibold text-ink";

interface ConsultaResult {
  tipoRepertorio: string;
  repertorio: string;
  fecha: string;
  materia: string;
  foja: string | null;
  numeroProtocolizado: string | null;
  comparecientes: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseConsultaResults(body: unknown): ConsultaResult[] | null {
  if (!isRecord(body) || !Array.isArray(body.results)) return null;

  return body.results.flatMap((item): ConsultaResult[] => {
    if (
      !isRecord(item) ||
      typeof item.tipoRepertorio !== "string" ||
      typeof item.repertorio !== "string" ||
      typeof item.fecha !== "string" ||
      typeof item.materia !== "string" ||
      (item.foja !== undefined &&
        item.foja !== null &&
        typeof item.foja !== "string") ||
      (item.numeroProtocolizado !== null &&
        typeof item.numeroProtocolizado !== "string") ||
      (item.comparecientes !== null && typeof item.comparecientes !== "string")
    ) {
      return [];
    }

    return [
      {
        tipoRepertorio: item.tipoRepertorio,
        repertorio: item.repertorio,
        fecha: item.fecha,
        materia: item.materia,
        foja: item.foja ?? null,
        numeroProtocolizado: item.numeroProtocolizado,
        comparecientes: item.comparecientes,
      },
    ];
  });
}

function formatDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return date;

  const [, year, month, day] = match;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    parsedDate.getFullYear() !== Number(year) ||
    parsedDate.getMonth() !== Number(month) - 1 ||
    parsedDate.getDate() !== Number(day)
  ) {
    return date;
  }

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

function appendField(
  container: HTMLElement,
  label: string,
  value: string,
): void {
  const wrapper = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  term.className = "text-xs font-semibold uppercase tracking-wide text-muted";
  term.textContent = label;
  description.className = "mt-1 text-sm text-ink";
  description.textContent = value;

  wrapper.append(term, description);
  container.append(wrapper);
}

function renderResults(
  container: HTMLElement,
  results: ConsultaResult[],
): void {
  container.replaceChildren();

  for (const result of results) {
    const card = document.createElement("article");
    const type = document.createElement("p");
    const details = document.createElement("dl");

    card.className =
      "rounded-card border border-line bg-surface p-6 shadow-card";
    type.className = "font-display text-lg font-semibold text-navy";
    type.textContent =
      site.consulta.types[
        result.tipoRepertorio as keyof ConsultaContent["types"]
      ] ?? result.tipoRepertorio;
    details.className = "mt-4 grid gap-4 sm:grid-cols-2";

    appendField(details, "Repertorio", result.repertorio);
    appendField(details, "Fecha", formatDate(result.fecha));
    appendField(details, "Materia", result.materia);
    appendField(details, "Foja", result.foja ?? "—");

    card.append(type, details);
    container.append(card);
  }
}

export function mountConsulta(el: HTMLElement): void {
  const content = site.consulta;

  el.innerHTML = `
    <div class="border-t border-line bg-bg">
      <div class="mx-auto max-w-(--container-content) px-6 py-20 md:py-28">
        <header class="mx-auto max-w-3xl text-center">
          <p class="font-display text-sm uppercase tracking-[0.28em] text-gold">${content.eyebrow}</p>
          <h2 id="consulta-heading" class="mt-3 font-display text-3xl text-navy md:text-4xl">${content.heading}</h2>
          <p class="mt-4 text-base text-muted md:text-lg">${content.lead}</p>
        </header>

        <div class="mx-auto mt-12 max-w-3xl rounded-card border border-line bg-surface p-6 shadow-card md:p-8">
          <form id="consulta-form" novalidate>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="consulta-tipo" class="${LABEL_CLASS}">${content.typeLabel}</label>
                <select id="consulta-tipo" name="tipo" required class="${INPUT_CLASS}">
                  <option value="escrituras">${content.types.escrituras}</option>
                  <option value="comercio">${content.types.comercio}</option>
                </select>
              </div>
              <div>
                <label for="consulta-repertorio" class="${LABEL_CLASS}">${content.repertorioLabel}</label>
                <input id="consulta-repertorio" name="repertorio" type="text" required maxlength="30" class="${INPUT_CLASS}" />
              </div>
            </div>

            <p class="mt-4 text-sm leading-relaxed text-muted">${content.privacyNote}</p>

            <div class="mt-6 flex flex-wrap items-center gap-4">
              <button
                id="consulta-submit"
                type="submit"
                class="inline-flex items-center gap-2 rounded bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:bg-navy/90 disabled:opacity-60"
              >
                ${content.submitLabel}
              </button>
              <p id="consulta-status" class="hidden text-sm" role="status" aria-live="polite"></p>
            </div>
          </form>
        </div>

        <div id="consulta-results" class="mx-auto mt-8 grid max-w-3xl gap-4"></div>
      </div>
    </div>
  `;

  const form = el.querySelector<HTMLFormElement>("#consulta-form")!;
  const submitButton = el.querySelector<HTMLButtonElement>("#consulta-submit")!;
  const status = el.querySelector<HTMLElement>("#consulta-status")!;
  const resultsContainer = el.querySelector<HTMLElement>("#consulta-results")!;

  const showStatus = (message: string, isError = false): void => {
    status.textContent = message;
    status.classList.remove("hidden", "text-muted", "text-red-600");
    status.classList.add(isError ? "text-red-600" : "text-muted");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const tipo = String(data.get("tipo") ?? "");
    const repertorio = String(data.get("repertorio") ?? "").trim();

    if (!repertorio) {
      showStatus(content.requiredMessage, true);
      return;
    }
    if (repertorio.length > 30) {
      showStatus(content.maxLengthMessage, true);
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = content.loadingLabel;
    resultsContainer.replaceChildren();
    showStatus(content.loadingMessage);

    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    try {
      const appCheckHeaders = await getAppCheckHeader();
      timeoutId = setTimeout(() => controller.abort(), 10_000);
      const response = await fetch("/api/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...appCheckHeaders },
        body: JSON.stringify({ tipo, repertorio }),
        signal: controller.signal,
      });

      if (response.status === 400) {
        showStatus(content.invalidRequestMessage, true);
        return;
      }
      if (response.status === 401 || response.status === 403) {
        showStatus(content.unauthorizedMessage, true);
        return;
      }
      if (response.status === 429) {
        showStatus(content.rateLimitMessage, true);
        return;
      }
      if (!response.ok) {
        showStatus(content.errorMessage, true);
        return;
      }

      const results = parseConsultaResults(await response.json());
      if (results === null) {
        showStatus(content.errorMessage, true);
        return;
      }
      if (results.length === 0) {
        showStatus(content.emptyMessage);
        return;
      }

      renderResults(resultsContainer, results);
      showStatus(
        results.length === 1
          ? content.singleResultMessage
          : content.multipleResultsMessage.replace(
              "{count}",
              String(results.length),
            ),
      );
    } catch {
      showStatus(
        controller.signal.aborted
          ? content.timeoutMessage
          : content.errorMessage,
        true,
      );
    } finally {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      submitButton.disabled = false;
      submitButton.textContent = content.submitLabel;
    }
  });
}
