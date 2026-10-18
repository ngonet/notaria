import { site } from "@/content/site";

const EXTERNAL_ICON = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>`;

function createTextElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

export function createArancelesSection(): HTMLElement {
  const { heading, documents, disclaimer, fileTypeLabel } = site.aranceles;

  const section = document.createElement("section");
  section.id = "aranceles";
  section.className =
    "grid scroll-mt-24 gap-6 border-t border-line-soft pt-8 md:grid-cols-3 md:items-start";
  section.setAttribute("aria-labelledby", "aranceles-heading");

  const header = document.createElement("div");
  header.className = "flex flex-col gap-1.5";
  const title = createTextElement("h3", "text-[28px] leading-tight", heading);
  title.id = "aranceles-heading";
  header.append(
    title,
    createTextElement("p", "text-[15px] text-ink-2", disclaimer),
  );

  const list = document.createElement("ul");
  list.className = "flex flex-col md:col-span-2";

  documents.forEach((documentItem) => {
    const item = document.createElement("li");
    item.className = "border-b border-line-soft";

    const link = document.createElement("a");
    link.className =
      "group flex min-h-11 justify-between gap-4 py-3.5 text-ink";
    link.href = documentItem.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", documentItem.label);

    const text = document.createElement("span");
    text.className = "flex flex-col";
    text.append(
      createTextElement(
        "span",
        "font-semibold group-hover:underline",
        documentItem.title,
      ),
      createTextElement("span", "text-sm text-muted", documentItem.description),
    );

    const fileType = createTextElement(
      "span",
      "inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-accent",
      fileTypeLabel,
    );
    fileType.insertAdjacentHTML("beforeend", EXTERNAL_ICON);

    link.append(text, fileType);
    item.append(link);
    list.append(item);
  });

  section.append(header, list);
  return section;
}
