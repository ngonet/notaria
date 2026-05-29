import { site } from "@/content/site";

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
  const { eyebrow, heading, lead, documents, disclaimer } = site.aranceles;

  const section = document.createElement("section");
  section.id = "aranceles";
  section.className = "scroll-mt-24";
  section.setAttribute("aria-labelledby", "aranceles-heading");

  const header = document.createElement("header");
  header.className = "mx-auto max-w-3xl text-center";
  header.append(
    createTextElement(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      eyebrow,
    ),
  );

  const title = createTextElement(
    "h3",
    "mt-3 font-display text-2xl text-navy md:text-3xl",
    heading,
  );
  title.id = "aranceles-heading";
  header.append(
    title,
    createTextElement("p", "mt-4 text-base text-muted md:text-lg", lead),
  );
  section.append(header);

  const list = document.createElement("ul");
  list.className = "mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3";

  documents.forEach((documentItem) => {
    const item = document.createElement("li");
    item.className =
      "flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card";

    const link = document.createElement("a");
    link.className =
      "mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 hover:underline";
    link.href = documentItem.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.append(document.createTextNode(documentItem.label));

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    link.append(arrow);

    item.append(
      createTextElement(
        "h4",
        "font-display text-lg font-semibold text-navy",
        documentItem.title,
      ),
      createTextElement(
        "p",
        "mt-3 flex-1 text-sm leading-relaxed text-muted",
        documentItem.description,
      ),
      link,
    );

    list.append(item);
  });

  section.append(list);

  const footer = document.createElement("div");
  footer.className = "mx-auto mt-10 max-w-3xl text-center";
  footer.append(
    createTextElement("p", "text-xs leading-relaxed text-muted", disclaimer),
  );
  section.append(footer);

  return section;
}
