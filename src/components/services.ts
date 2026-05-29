import {
  site,
  type FeatureBlock,
  type FeatureGroup,
  type ServiceCard,
} from "@/content/site";
import { createArancelesSection } from "./aranceles";

type SvgShape = {
  tag: "path" | "circle";
  attrs: Record<string, string>;
};

const ICONS: Record<FeatureBlock["icon"], SvgShape[]> = {
  newspaper: [
    {
      tag: "path",
      attrs: {
        d: "M4 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5Z",
      },
    },
    { tag: "path", attrs: { d: "M9 7h6M9 11h6M9 15h4" } },
    { tag: "path", attrs: { d: "M19 7h2v10a2 2 0 0 1-2 2" } },
  ],
  file: [
    {
      tag: "path",
      attrs: {
        d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z",
      },
    },
    { tag: "path", attrs: { d: "M14 3v5h5" } },
    { tag: "path", attrs: { d: "M9 13h6M9 17h4" } },
  ],
  users: [
    { tag: "path", attrs: { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" } },
    { tag: "circle", attrs: { cx: "9", cy: "7", r: "4" } },
    { tag: "path", attrs: { d: "M22 21v-2a4 4 0 0 0-3-3.87" } },
    { tag: "path", attrs: { d: "M16 3.13a4 4 0 0 1 0 7.75" } },
  ],
  eraser: [
    { tag: "path", attrs: { d: "m17 14 3-3-7-7-9 9 4 4h6" } },
    { tag: "path", attrs: { d: "M14 21h7" } },
    { tag: "path", attrs: { d: "m9 11 4 4" } },
  ],
  stamp: [
    { tag: "path", attrs: { d: "M5 22h14" } },
    {
      tag: "path",
      attrs: {
        d: "M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z",
      },
    },
    {
      tag: "path",
      attrs: {
        d: "M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-3-3c-1.66 0-3 1-3 3s1 1 1 3.5V13",
      },
    },
  ],
};

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

function createIcon(name: FeatureBlock["icon"]): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "28");
  svg.setAttribute("height", "28");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.6");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");

  ICONS[name].forEach((shape) => {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      shape.tag,
    );
    Object.entries(shape.attrs).forEach(([key, value]) =>
      element.setAttribute(key, value),
    );
    svg.append(element);
  });

  return svg;
}

function createPrimaryCard(item: ServiceCard, index: number): HTMLLIElement {
  const card = document.createElement("li");
  card.className =
    "group rounded-card border border-line bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:border-gold/60";

  const badge = document.createElement("div");
  badge.className =
    "flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-navy transition group-hover:bg-gold/15 group-hover:text-navy";
  badge.append(
    createTextElement(
      "span",
      "font-display text-base font-semibold",
      `0${index + 1}`,
    ),
  );

  card.append(
    badge,
    createTextElement(
      "h3",
      "mt-5 font-display text-lg font-semibold text-navy",
      item.title,
    ),
    createTextElement(
      "p",
      "mt-3 text-sm leading-relaxed text-muted",
      item.description,
    ),
  );

  return card;
}

function createFeatureCard(item: FeatureBlock): HTMLLIElement {
  const card = document.createElement("li");
  card.className =
    "flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card";

  const iconWrap = document.createElement("div");
  iconWrap.className =
    "flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-navy";
  iconWrap.append(createIcon(item.icon));

  card.append(
    iconWrap,
    createTextElement(
      "h3",
      "mt-5 font-display text-lg font-semibold text-navy",
      item.title,
    ),
    createTextElement(
      "p",
      "mt-3 text-sm leading-relaxed text-muted",
      item.description,
    ),
  );

  if (item.requiredDocuments?.length) {
    const list = document.createElement("ul");
    list.className = "mt-4 space-y-1.5 text-sm text-muted";

    item.requiredDocuments.forEach((documentName) => {
      const listItem = document.createElement("li");
      listItem.className = "flex items-start gap-2";

      const bullet = document.createElement("span");
      bullet.className =
        "mt-2 inline-block h-1 w-1 flex-none rounded-full bg-gold";
      bullet.setAttribute("aria-hidden", "true");

      listItem.append(bullet, createTextElement("span", "", documentName));
      list.append(listItem);
    });

    card.append(list);
  }

  const footer = document.createElement("div");
  footer.className = "mt-auto";

  if (item.email) {
    const link = document.createElement("a");
    link.className =
      "mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy underline-offset-4 hover:underline";
    link.href = `mailto:${item.email.address}?subject=${encodeURIComponent(item.email.subject)}`;
    link.textContent = `${item.email.label} ↗`;
    footer.append(link);
  }

  card.append(footer);
  return card;
}

function createFeatureGroup(
  group: FeatureGroup,
  gridClasses: string,
): HTMLDivElement {
  const wrapper = document.createElement("div");
  wrapper.append(
    createTextElement(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      group.eyebrow,
    ),
  );

  const list = document.createElement("ul");
  list.className = `mt-6 grid gap-6 ${gridClasses}`;
  group.items.forEach((item) => list.append(createFeatureCard(item)));

  wrapper.append(list);
  return wrapper;
}

function createNotaryArticle(): HTMLElement {
  const { notary } = site.services;
  const article = document.createElement("article");
  article.className =
    "mt-16 grid gap-10 rounded-card border border-line bg-navy px-8 py-12 text-white md:grid-cols-[1fr_1.2fr] md:items-center md:px-12";

  const left = document.createElement("div");
  left.append(
    createTextElement(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      notary.label,
    ),
    createTextElement(
      "h3",
      "mt-3 font-display text-2xl md:text-3xl",
      notary.name,
    ),
    createTextElement("p", "mt-2 text-base text-white/75", notary.role),
  );

  if (notary.substituteNotaries?.length) {
    const substitutes = document.createElement("div");
    substitutes.className = "mt-6";
    substitutes.append(
      createTextElement(
        "p",
        "font-display text-xs uppercase tracking-[0.22em] text-gold/85",
        notary.substituteLabel,
      ),
    );

    const list = document.createElement("ul");
    list.className = "mt-3 space-y-1 text-sm text-white/85";
    notary.substituteNotaries.forEach((name) =>
      list.append(createTextElement("li", "", name)),
    );
    substitutes.append(list);
    left.append(substitutes);
  }

  const right = document.createElement("div");
  const decree = createTextElement(
    "p",
    "text-sm leading-relaxed text-white/85 md:text-base",
    `${notary.decree.text}. `,
  );

  const decreeLink = document.createElement("a");
  decreeLink.className =
    "ml-1 inline-flex items-center gap-1 font-semibold text-gold underline-offset-4 hover:underline";
  decreeLink.href = notary.decree.href;
  decreeLink.target = "_blank";
  decreeLink.rel = "noopener noreferrer";
  decreeLink.append(document.createTextNode(notary.decree.label));

  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  decreeLink.append(arrow);
  decree.append(decreeLink);
  right.append(decree);

  if (notary.prosecutor) {
    const prosecutor = document.createElement("div");
    prosecutor.className = "mt-6";
    prosecutor.append(
      createTextElement(
        "p",
        "font-display text-xs uppercase tracking-[0.22em] text-gold/85",
        notary.prosecutor.label,
      ),
      createTextElement(
        "p",
        "mt-2 text-sm text-white/85",
        notary.prosecutor.name,
      ),
      createTextElement(
        "p",
        "mt-1 text-sm text-white/75",
        notary.prosecutor.office,
      ),
    );
    right.append(prosecutor);
  }

  article.append(left, right);
  return article;
}

export function mountServices(el: HTMLElement): void {
  const {
    eyebrow,
    heading: sectionHeading,
    lead,
    primary,
    secondary,
  } = site.services;

  el.replaceChildren();

  const container = document.createElement("div");
  container.className =
    "mx-auto max-w-(--container-content) px-6 py-20 md:py-28";

  const header = document.createElement("header");
  header.className = "mx-auto max-w-3xl text-center";
  header.append(
    createTextElement(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      eyebrow,
    ),
  );

  const heading = createTextElement(
    "h2",
    "mt-3 font-display text-3xl text-navy md:text-4xl",
    sectionHeading,
  );
  heading.id = "servicios-heading";
  header.append(
    heading,
    createTextElement("p", "mt-4 text-base text-muted md:text-lg", lead),
  );
  container.append(header);

  const primaryList = document.createElement("ul");
  primaryList.className = "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4";
  primary.forEach((item, index) =>
    primaryList.append(createPrimaryCard(item, index)),
  );
  container.append(primaryList, createNotaryArticle());

  const secondaryWrapper = document.createElement("div");
  secondaryWrapper.className = "mt-16 space-y-12";
  secondaryWrapper.append(
    createFeatureGroup(secondary.instrumentos, "md:grid-cols-2"),
    createFeatureGroup(secondary.conservador, "md:grid-cols-2"),
  );
  container.append(secondaryWrapper);

  const arancelesWrapper = document.createElement("div");
  arancelesWrapper.className =
    "mt-20 md:mt-24 border-t border-line/60 pt-16 md:pt-20";
  arancelesWrapper.append(createArancelesSection());
  container.append(arancelesWrapper);

  el.append(container);
}
