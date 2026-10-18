import { site } from "@/content/site";

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;

  return node;
}

function append(parent: Node, ...children: Node[]): void {
  children.forEach((child) => parent.appendChild(child));
}

function externalLink(href: string, className: string): HTMLAnchorElement {
  const link = el("a", className);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

export function mountDocuments(root: HTMLElement): void {
  const { heading, lead, steps, downloads, downloadCtaLabel, fojas } =
    site.documents;

  root.replaceChildren();

  const section = el("div", "bg-soft");
  const wrapper = el("div", "mx-auto max-w-content px-6 py-20");
  const header = el("header", "max-w-3xl");
  const title = el(
    "h2",
    "text-4xl leading-[1.05] text-ink md:text-[42px]",
    heading,
  );
  title.id = "documentos-heading";
  append(
    header,
    title,
    el("p", "mt-3 text-base leading-relaxed text-ink-2 md:text-[17px]", lead),
  );

  const stepsList = el("ol", "mt-8 grid list-none gap-3 p-0 sm:grid-cols-3");
  steps.forEach((step, index) => {
    const item = el("li", "rounded-xl bg-surface p-4 text-sm text-ink-2");
    append(
      item,
      el(
        "strong",
        "mb-1 block text-[15px] font-semibold text-ink",
        `${index + 1}. ${step.title}`,
      ),
      document.createTextNode(step.body),
    );
    stepsList.append(item);
  });

  const downloadsList = el(
    "ul",
    "mt-7 overflow-hidden rounded-card border border-line bg-surface",
  );
  downloads.forEach((documentItem) => {
    const item = el(
      "li",
      "flex flex-wrap items-center justify-between gap-4 border-b border-line-soft px-5 py-4 last:border-b-0 md:px-6",
    );
    const copy = el("div", "min-w-0 flex-[1_1_24rem]");
    append(
      copy,
      el("h3", "text-[17px] font-semibold text-ink", documentItem.title),
      el(
        "p",
        "mt-1 text-sm leading-relaxed text-muted",
        documentItem.description,
      ),
    );

    const link = externalLink(
      documentItem.href,
      "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[10px] border-2 border-accent px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent-dark hover:bg-accent-dark hover:text-white",
    );
    append(
      link,
      document.createTextNode(downloadCtaLabel),
      el("span", "", "↗"),
    );
    link.lastElementChild?.setAttribute("aria-hidden", "true");

    append(item, copy, link);
    downloadsList.append(item);
  });

  const fojasPanel = el(
    "article",
    "mt-7 flex flex-wrap items-center justify-between gap-5 rounded-card bg-dark p-7 text-white",
  );
  const fojasCopy = el("div", "min-w-0 flex-[1_1_30rem]");
  append(
    fojasCopy,
    el("p", "text-[13px] font-semibold text-accent-soft", fojas.eyebrow),
    el(
      "h3",
      "mt-1 text-2xl leading-tight text-white md:text-[26px]",
      fojas.heading,
    ),
    el("p", "mt-2 leading-relaxed text-white/80", fojas.body),
  );

  const fojasLink = externalLink(
    fojas.href,
    "inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[10px] bg-white px-5 py-3 font-semibold text-dark transition hover:bg-soft",
  );
  append(
    fojasLink,
    document.createTextNode(fojas.ctaLabel),
    el("span", "", "↗"),
  );
  fojasLink.lastElementChild?.setAttribute("aria-hidden", "true");

  append(fojasPanel, fojasCopy, fojasLink);
  append(wrapper, header, stepsList, downloadsList, fojasPanel);
  section.append(wrapper);
  root.append(section);
}
