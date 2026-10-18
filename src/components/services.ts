import { site, type FeatureBlock, type ServiceCard } from "@/content/site";
import { createArancelesSection } from "./aranceles";
import { iconChip } from "./icons";

type ServiceArea = "notaria" | "conservador";

const AREAS: ServiceArea[] = ["notaria", "conservador"];

const TAB_BASE_CLASSES =
  "inline-flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold transition";
const TAB_SELECTED_CLASSES = "bg-surface text-ink shadow-sm";
const TAB_IDLE_CLASSES = "text-ink-2 hover:text-ink";

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

function createNotariaCard(item: ServiceCard, tag?: string): HTMLLIElement {
  const card = document.createElement("li");
  card.className =
    "flex flex-col gap-2 rounded-card border border-line bg-surface p-6";

  if (tag) {
    card.append(
      createTextElement("span", "text-[13px] font-semibold text-accent", tag),
    );
  }

  if (item.icon) {
    card.insertAdjacentHTML("beforeend", iconChip(item.icon, "md"));
  }

  card.append(
    createTextElement("h3", "font-body text-xl font-semibold", item.title),
    createTextElement("p", "text-[15px] text-ink-2", item.description),
  );

  return card;
}

function createConservadorCard(item: FeatureBlock): HTMLLIElement {
  const card = document.createElement("li");
  card.className =
    "flex flex-col gap-3 rounded-card border border-line bg-surface p-7";

  card.append(
    createTextElement("h3", "font-body text-[22px] font-semibold", item.title),
    createTextElement("p", "text-ink-2", item.description),
  );

  if (item.requiredDocuments?.length) {
    const list = document.createElement("ul");
    list.className = "flex flex-col gap-1 text-[15px] text-ink";

    item.requiredDocuments.forEach((documentName) => {
      const listItem = document.createElement("li");
      listItem.className = "flex items-start gap-2";

      const bullet = document.createElement("span");
      bullet.className =
        "mt-2 inline-block h-1.5 w-1.5 flex-none rounded-full bg-accent";
      bullet.setAttribute("aria-hidden", "true");

      listItem.append(bullet, createTextElement("span", "", documentName));
      list.append(listItem);
    });

    card.append(list);
  }

  if (item.email) {
    const link = document.createElement("a");
    link.className =
      "inline-flex min-h-11 items-center self-start rounded-[10px] bg-accent px-[18px] font-semibold text-white transition hover:bg-accent-dark";
    link.href = `mailto:${item.email.address}?subject=${encodeURIComponent(item.email.subject)}`;
    link.textContent = item.email.label;
    card.append(link);
  }

  return card;
}

function createTab(area: ServiceArea, label: string): HTMLButtonElement {
  const tab = createTextElement("button", TAB_BASE_CLASSES, label);
  tab.type = "button";
  tab.id = `servicios-tab-${area}`;
  tab.setAttribute("role", "tab");
  tab.setAttribute("aria-controls", `servicios-panel-${area}`);
  return tab;
}

function createPanel(area: ServiceArea, list: HTMLElement): HTMLDivElement {
  const panel = document.createElement("div");
  panel.id = `servicios-panel-${area}`;
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", `servicios-tab-${area}`);
  panel.tabIndex = 0;
  panel.append(list);
  return panel;
}

function setupTabs(tabs: HTMLButtonElement[], panels: HTMLElement[]): void {
  const select = (index: number, focus: boolean): void => {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.className = `${TAB_BASE_CLASSES} ${selected ? TAB_SELECTED_CLASSES : TAB_IDLE_CLASSES}`;
      panels[tabIndex].hidden = !selected;
    });
    if (focus) tabs[index].focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index, false));
    tab.addEventListener("keydown", (event) => {
      const last = tabs.length - 1;
      let next: number | null = null;
      if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
      else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = last;
      if (next === null) return;
      event.preventDefault();
      select(next, true);
    });
  });

  select(0, false);
}

export function mountServices(el: HTMLElement): void {
  const {
    heading: sectionHeading,
    lead,
    areaTabs,
    primary,
    secondary,
  } = site.services;

  el.replaceChildren();

  const container = document.createElement("div");
  container.className = "mx-auto flex max-w-content flex-col gap-8 px-6 py-20";

  const header = document.createElement("div");
  header.className = "flex flex-wrap items-end justify-between gap-5";

  const intro = document.createElement("div");
  intro.className = "flex max-w-[680px] flex-col gap-2";
  const heading = createTextElement(
    "h2",
    "text-4xl leading-[1.05] md:text-[42px]",
    sectionHeading,
  );
  heading.id = "servicios-heading";
  intro.append(heading, createTextElement("p", "text-[17px] text-ink-2", lead));

  const tablist = document.createElement("div");
  tablist.className = "flex gap-1 rounded-full bg-line-soft p-1";
  tablist.setAttribute("role", "tablist");
  tablist.setAttribute("aria-label", areaTabs.ariaLabel);

  const tabs = AREAS.map((area) => createTab(area, areaTabs[area]));
  tablist.append(...tabs);
  header.append(intro, tablist);

  const notariaList = document.createElement("ul");
  notariaList.className = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
  primary.forEach((item) => notariaList.append(createNotariaCard(item)));
  secondary.instrumentos.items.forEach((item) =>
    notariaList.append(createNotariaCard(item, secondary.instrumentos.eyebrow)),
  );

  const conservadorList = document.createElement("ul");
  conservadorList.className = "grid gap-4 md:grid-cols-2";
  secondary.conservador.items.forEach((item) =>
    conservadorList.append(createConservadorCard(item)),
  );

  const panels = [
    createPanel("notaria", notariaList),
    createPanel("conservador", conservadorList),
  ];

  container.append(header, ...panels, createArancelesSection());
  const background = document.createElement("div");
  background.className = "bg-soft";
  background.append(container);
  el.append(background);

  setupTabs(tabs, panels);
}
