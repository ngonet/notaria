import { site, type ConsultaContent } from "@/content/site";
import { getAppCheckHeader } from "@/lib/firebase";

const INPUT_CLASS =
  "min-h-12 w-full min-w-0 flex-1 rounded-[10px] border-[1.5px] border-muted bg-surface px-3.5 py-3 text-[17px] text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";
const LABEL_CLASS = "block text-sm font-semibold text-ink";
const TYPE_OPTION_CLASS =
  "flex min-h-11 cursor-pointer items-center justify-center rounded-lg px-3 text-center text-[15px] font-semibold text-ink-2 transition peer-checked:bg-surface peer-checked:text-accent peer-checked:shadow-sm peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent";

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
  fullWidth = false,
): void {
  const wrapper = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  if (fullWidth) wrapper.className = "col-span-2";
  term.className = "text-xs text-muted";
  term.textContent = label;
  description.className = "text-ink [overflow-wrap:anywhere]";
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

    card.className = "rounded-xl border border-line bg-surface p-4";
    type.className = "font-semibold text-ink";
    type.textContent =
      site.consulta.types[
        result.tipoRepertorio as keyof ConsultaContent["types"]
      ] ?? result.tipoRepertorio;
    details.className = "mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[15px]";

    appendField(details, "Repertorio", result.repertorio);
    appendField(details, "Fecha", formatDate(result.fecha));
    appendField(details, "Materia", result.materia, true);
    appendField(details, "Foja", result.foja ?? "—");

    const numeroProtocolizado = result.numeroProtocolizado?.trim();
    if (numeroProtocolizado) {
      appendField(
        details,
        site.consulta.numeroProtocolizadoLabel,
        numeroProtocolizado,
      );
    }

    const comparecientes = result.comparecientes?.trim();
    if (comparecientes) {
      appendField(details, site.consulta.comparecientesLabel, comparecientes);
    }

    card.append(type, details);
    container.append(card);
  }
}

export function mountConsulta(el: HTMLElement): void {
  const content = site.consulta;

  el.innerHTML = `
    <div class="flex flex-col gap-4 rounded-2xl border border-line border-t-4 border-t-accent bg-surface p-7">
      <header class="flex flex-col gap-1">
        <p class="text-[13px] font-semibold text-accent">${content.eyebrow}</p>
        <h2 id="consulta-heading" class="font-display text-[28px] leading-tight font-bold text-ink">${content.heading}</h2>
        <p class="text-[15px] text-muted">${content.lead}</p>
      </header>

      <form id="consulta-form" novalidate class="flex flex-col gap-3.5">
        <fieldset>
          <legend class="mb-2 ${LABEL_CLASS}">${content.typeLabel}</legend>
          <div class="grid grid-cols-2 gap-1 rounded-[10px] bg-soft p-1">
            <label>
              <input type="radio" name="tipo" value="escrituras" checked class="peer sr-only" />
              <span class="${TYPE_OPTION_CLASS}">${content.types.escrituras}</span>
            </label>
            <label>
              <input type="radio" name="tipo" value="comercio" class="peer sr-only" />
              <span class="${TYPE_OPTION_CLASS}">${content.types.comercio}</span>
            </label>
          </div>
        </fieldset>

        <div class="flex flex-col gap-1.5">
          <label for="consulta-repertorio" class="${LABEL_CLASS}">${content.repertorioLabel}</label>
          <div class="flex gap-2">
            <input id="consulta-repertorio" name="repertorio" type="text" required maxlength="30" class="${INPUT_CLASS}" />
            <button
              id="consulta-submit"
              type="submit"
              class="inline-flex min-h-12 shrink-0 items-center rounded-[10px] bg-accent px-[22px] font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
            >
              ${content.submitLabel}
            </button>
          </div>
        </div>

        <p id="consulta-status" class="hidden text-sm" role="status" aria-live="polite"></p>
      </form>

      <div id="consulta-results" class="grid gap-3"></div>

      <details class="text-[13px] text-muted">
        <summary class="min-h-8 cursor-pointer">${content.privacySummary}</summary>
        <p class="mt-2">${content.privacyNote}</p>
      </details>
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
