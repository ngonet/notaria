import { site } from "@/content/site";

const ICON_PATHS = {
  check: ["M20 6 9 17l-5-5"],
  plane: [
    "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
  ],
  bolt: ["M13 2 3 14h7l-1 8 10-12h-7l1-8Z"],
  bookmark: ["M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16Z"],
  scroll: [
    "M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4",
    "M19 17V5a2 2 0 0 0-2-2H4",
  ],
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);

  if (className) {
    node.className = className;
  }

  if (text !== undefined) {
    node.textContent = text;
  }

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

function svg(name: keyof typeof ICON_PATHS): SVGSVGElement {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("width", "22");
  icon.setAttribute("height", "22");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "1.6");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  icon.setAttribute("aria-hidden", "true");

  ICON_PATHS[name].forEach((pathData) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    icon.appendChild(path);
  });

  return icon;
}

export function mountDocuments(root: HTMLElement): void {
  const {
    eyebrow,
    heading,
    lead,
    downloads,
    downloadCtaLabel,
    visitas,
    fojas,
  } = site.documents;

  root.textContent = "";

  const wrapper = el(
    "div",
    "mx-auto max-w-(--container-content) px-6 py-20 md:py-28",
  );

  const header = el("header", "mx-auto max-w-3xl text-center");
  append(
    header,
    el(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      eyebrow,
    ),
    el("h2", "mt-3 font-display text-3xl text-navy md:text-4xl", heading),
    el("p", "mt-4 text-base text-muted md:text-lg", lead),
  );
  header.querySelector("h2")?.setAttribute("id", "documentos-heading");

  const downloadsList = el(
    "ul",
    "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
  );
  downloads.forEach((doc) => {
    const item = el(
      "li",
      "flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:border-gold/60",
    );
    const iconWrap = el(
      "span",
      "flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-navy",
    );
    iconWrap.appendChild(svg(doc.icon));

    const link = externalLink(
      doc.href,
      "mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 hover:underline",
    );
    append(
      link,
      document.createTextNode(downloadCtaLabel),
      el("span", "", "↗"),
    );
    link.lastElementChild?.setAttribute("aria-hidden", "true");

    append(
      item,
      iconWrap,
      el("h3", "mt-5 font-display text-lg font-semibold text-navy", doc.title),
      el(
        "p",
        "mt-3 flex-1 text-sm leading-relaxed text-muted",
        doc.description,
      ),
      link,
    );
    downloadsList.appendChild(item);
  });

  const visitasSection = el(
    "section",
    "mt-16 rounded-card border border-line bg-surface px-8 py-12 shadow-card md:px-12",
  );
  visitasSection.setAttribute("aria-labelledby", "visitas-heading");

  const visitasHeader = el("div", "max-w-3xl");
  const visitasHeading = el(
    "h3",
    "mt-3 font-display text-2xl text-navy md:text-3xl",
    visitas.heading,
  );
  visitasHeading.id = "visitas-heading";
  append(
    visitasHeader,
    el(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      visitas.eyebrow,
    ),
    visitasHeading,
    el(
      "p",
      "mt-4 text-sm leading-relaxed text-muted md:text-base",
      visitas.lead,
    ),
  );

  const visitasGrid = el("div", "mt-8 grid gap-4 md:grid-cols-3");
  visitas.documents.forEach((visit) => {
    const link = externalLink(
      visit.href,
      "group flex h-full flex-col rounded-2xl border border-line bg-cream/60 p-5 transition hover:-translate-y-1 hover:border-gold/70 hover:bg-cream",
    );
    const label = el(
      "span",
      "mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 group-hover:underline",
    );
    append(label, document.createTextNode(visit.label), el("span", "", "↗"));
    label.lastElementChild?.setAttribute("aria-hidden", "true");

    append(
      link,
      el("span", "font-display text-lg font-semibold text-navy", visit.title),
      el(
        "span",
        "mt-3 flex-1 text-sm leading-relaxed text-muted",
        visit.description,
      ),
      label,
    );
    visitasGrid.appendChild(link);
  });
  append(visitasSection, visitasHeader, visitasGrid);

  const fojasArticle = el(
    "article",
    "mt-16 grid gap-10 rounded-card border border-line bg-surface px-8 py-12 shadow-card md:grid-cols-[1.2fr_1fr] md:items-center md:px-12",
  );
  const fojasContent = el("div");
  const fojasLink = externalLink(
    fojas.href,
    "mt-6 inline-flex items-center gap-2 rounded-md bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy-light",
  );
  append(
    fojasLink,
    document.createTextNode(fojas.ctaLabel),
    el("span", "", "↗"),
  );
  fojasLink.lastElementChild?.setAttribute("aria-hidden", "true");
  append(
    fojasContent,
    el(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      fojas.eyebrow,
    ),
    el("h3", "mt-3 font-display text-2xl text-navy md:text-3xl", fojas.heading),
    el("p", "mt-4 text-sm leading-relaxed text-muted md:text-base", fojas.body),
    fojasLink,
  );

  const imageWrap = el("div", "flex items-center justify-center");
  const picture = document.createElement("picture");
  const source = document.createElement("source");
  source.srcset = fojas.logo.replace(/\.(jpg|png)$/, ".webp");
  source.type = "image/webp";
  const image = document.createElement("img");
  image.src = fojas.logo;
  image.alt = fojas.logoAlt;
  image.loading = "lazy";
  image.decoding = "async";
  image.width = 200;
  image.height = 128;
  image.className = "max-h-32 w-auto";
  append(picture, source, image);
  imageWrap.appendChild(picture);

  append(fojasArticle, fojasContent, imageWrap);
  append(wrapper, header, downloadsList, visitasSection, fojasArticle);
  root.appendChild(wrapper);
}
