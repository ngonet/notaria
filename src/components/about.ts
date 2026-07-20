import { site } from "@/content/site";
import { createNotaryArticle } from "./services";
import { makeElement } from "@/lib/dom";

type SvgShape = {
  tag: "path" | "circle";
  attrs: Record<string, string>;
};

const ICONS: Record<string, SvgShape[]> = {
  gavel: [
    { tag: "path", attrs: { d: "m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9" } },
    { tag: "path", attrs: { d: "m15 13 6-6" } },
    { tag: "path", attrs: { d: "m9 7 6 6" } },
    { tag: "path", attrs: { d: "m17 5 4 4" } },
    { tag: "path", attrs: { d: "m13 9 4-4" } },
  ],
  university: [
    { tag: "path", attrs: { d: "m4 10 8-5 8 5" } },
    { tag: "path", attrs: { d: "M5 10v8h14v-8" } },
    { tag: "path", attrs: { d: "M9 18v-5M12 18v-5M15 18v-5" } },
    { tag: "path", attrs: { d: "M3 21h18" } },
  ],
  cogs: [
    { tag: "circle", attrs: { cx: "12", cy: "12", r: "3" } },
    {
      tag: "path",
      attrs: {
        d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z",
      },
    },
  ],
};

function createTimelineIcon(name: keyof typeof ICONS): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "22");
  svg.setAttribute("height", "22");
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

function createFuncionariosSection(): HTMLElement {
  const { eyebrow, heading, lead, groups } = site.funcionarios;
  const section = document.createElement("section");
  section.id = "funcionarios";
  section.className = "scroll-mt-24";
  section.setAttribute("aria-labelledby", "funcionarios-heading");

  const header = document.createElement("header");
  header.className = "mx-auto max-w-3xl text-center";
  const title = makeElement(
    "h3",
    "mt-3 font-display text-2xl text-navy md:text-3xl",
    heading,
  );
  title.id = "funcionarios-heading";
  header.append(
    makeElement(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      eyebrow,
    ),
    title,
    makeElement("p", "mt-4 text-base text-muted md:text-lg", lead),
  );

  const groupsList = document.createElement("ul");
  groupsList.className = "mt-12 grid gap-6 md:grid-cols-3";
  groups.forEach((group) => {
    const groupItem = document.createElement("li");
    groupItem.className =
      "flex h-full flex-col rounded-card border border-line bg-bg p-6 shadow-card";
    const members = document.createElement("ul");
    members.className = "mt-4 flex-1 space-y-2";
    group.members.forEach((name) => {
      const member = document.createElement("li");
      member.className = "flex items-start gap-2 text-sm text-muted";
      const bullet = document.createElement("span");
      bullet.className = "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold";
      bullet.setAttribute("aria-hidden", "true");
      member.append(bullet, document.createTextNode(name));
      members.append(member);
    });
    groupItem.append(
      makeElement(
        "h4",
        "font-display text-base font-semibold text-navy",
        group.title,
      ),
      members,
    );
    groupsList.append(groupItem);
  });

  section.append(header, groupsList);
  return section;
}

export function mountAbout(el: HTMLElement): void {
  const { section, commitment, trajectory, timeline } = site.about;

  const wrapper = document.createElement("div");
  wrapper.className = "border-y border-line bg-surface";
  const content = document.createElement("div");
  content.className = "mx-auto max-w-(--container-content) px-6 py-20 md:py-28";

  const header = document.createElement("header");
  header.className = "mx-auto max-w-3xl text-center";
  const heading = makeElement(
    "h2",
    "mt-3 font-display text-3xl text-navy md:text-4xl",
    section.heading,
  );
  heading.id = "nosotros-heading";
  header.append(
    makeElement(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      section.eyebrow,
    ),
    heading,
    makeElement("p", "mt-4 text-base text-muted md:text-lg", section.lead),
  );

  const commitmentArticle = document.createElement("article");
  commitmentArticle.className =
    "mt-16 grid gap-10 rounded-card border border-line bg-bg px-8 py-12 md:grid-cols-[1.1fr_1fr] md:items-center md:px-12";
  const commitmentContent = document.createElement("div");
  commitmentContent.append(
    makeElement(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      commitment.heading,
    ),
    makeElement(
      "h3",
      "mt-3 font-display text-2xl text-navy md:text-3xl",
      commitment.title,
    ),
    makeElement("p", "mt-2 text-sm text-muted md:text-base", commitment.lead),
    makeElement(
      "p",
      "mt-5 text-sm leading-relaxed text-ink md:text-base",
      commitment.body,
    ),
  );
  const imageWrap = document.createElement("div");
  imageWrap.className = "overflow-hidden rounded-card ring-1 ring-line";
  const picture = document.createElement("picture");
  const source = document.createElement("source");
  source.srcset = commitment.image.replace(/\.(jpg|png)$/, ".webp");
  source.type = "image/webp";
  const image = document.createElement("img");
  image.src = commitment.image;
  image.alt = commitment.imageAlt;
  image.loading = "lazy";
  image.decoding = "async";
  image.width = 400;
  image.height = 400;
  image.className = "h-full w-full object-cover";
  picture.append(source, image);
  imageWrap.append(picture);
  commitmentArticle.append(commitmentContent, imageWrap);

  const articleMount = document.createElement("div");
  articleMount.dataset.notaryArticle = "";

  const trajectorySection = document.createElement("section");
  trajectorySection.className = "mt-20";
  trajectorySection.setAttribute("aria-label", trajectory.ariaLabel);
  const trajectoryHeader = document.createElement("header");
  trajectoryHeader.className = "mx-auto max-w-3xl text-center";
  trajectoryHeader.append(
    makeElement(
      "p",
      "font-display text-sm uppercase tracking-[0.28em] text-gold",
      trajectory.heading,
    ),
    makeElement(
      "h3",
      "mt-3 font-display text-2xl text-navy md:text-3xl",
      trajectory.title,
    ),
  );
  const timelineList = document.createElement("ol");
  timelineList.className =
    "relative mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4";
  timeline.forEach((entry) => {
    const item = document.createElement("li");
    item.className =
      "relative flex h-full flex-col rounded-card border border-line bg-bg p-6 shadow-card";
    const top = document.createElement("div");
    top.className = "flex items-center gap-3";
    const iconWrap = document.createElement("span");
    iconWrap.className =
      "flex h-10 w-10 items-center justify-center rounded-full bg-navy text-gold";
    iconWrap.append(createTimelineIcon(entry.icon));
    const dates = document.createElement("div");
    dates.append(
      makeElement(
        "p",
        "text-xs font-semibold uppercase tracking-[0.18em] text-muted",
        entry.period,
      ),
      makeElement(
        "p",
        "font-display text-sm font-semibold text-navy",
        entry.date,
      ),
    );
    top.append(iconWrap, dates);
    item.append(
      top,
      makeElement(
        "h4",
        "mt-5 font-display text-base font-semibold text-navy",
        entry.title,
      ),
      makeElement(
        "p",
        "mt-2 flex-1 text-sm leading-relaxed text-muted",
        entry.description,
      ),
    );
    timelineList.append(item);
  });
  trajectorySection.append(trajectoryHeader, timelineList);

  const funcionariosWrap = document.createElement("div");
  funcionariosWrap.className =
    "mt-20 md:mt-24 border-t border-line/60 pt-16 md:pt-20";
  funcionariosWrap.append(createFuncionariosSection());

  content.append(
    header,
    commitmentArticle,
    articleMount,
    trajectorySection,
    funcionariosWrap,
  );
  wrapper.append(content);
  el.replaceChildren(wrapper);
  articleMount.append(createNotaryArticle());
}
