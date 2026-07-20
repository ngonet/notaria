import { site } from "@/content/site";
import { makeElement } from "@/lib/dom";

export function mountFooter(el: HTMLElement): void {
  const c = site.contact;
  const footer = document.createElement("footer");
  footer.className = "bg-navy text-white";

  const content = document.createElement("div");
  content.className =
    "mx-auto grid max-w-(--container-content) gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr]";

  const brand = document.createElement("div");
  const phoneLink = makeElement(
    "a",
    "mt-2 inline-block text-sm font-semibold text-gold hover:text-gold-soft",
    c.phoneDisplay,
  );
  phoneLink.href = `tel:${c.phoneE164}`;
  brand.append(
    makeElement("p", "font-display text-xl font-semibold", site.brand),
    makeElement("p", "mt-2 text-sm text-white/70", site.tagline),
    makeElement("p", "mt-6 text-sm text-white/70", `${c.street} · ${c.city}`),
    phoneLink,
  );

  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", site.footer.navLabel);
  const navList = document.createElement("ul");
  navList.className = "mt-4 space-y-2 text-sm text-white/80";
  site.nav.forEach((link) => {
    const item = document.createElement("li");
    const anchor = makeElement("a", "hover:text-white", link.label);
    anchor.href = link.href;
    item.append(anchor);
    navList.append(item);
  });
  nav.append(
    makeElement(
      "p",
      "font-display text-sm uppercase tracking-[0.22em] text-gold",
      site.footer.siteHeading,
    ),
    navList,
  );

  const hours = document.createElement("div");
  const hoursList = document.createElement("ul");
  hoursList.className = "mt-4 space-y-2 text-sm text-white/80";
  const emailItem = document.createElement("li");
  const emailLink = makeElement("a", "hover:text-white", c.email);
  emailLink.href = `mailto:${c.email}`;
  emailItem.append(emailLink);
  hoursList.append(
    makeElement("li", "", c.schedule.weekdays),
    makeElement("li", "", c.schedule.saturdays),
    emailItem,
  );
  hours.append(
    makeElement(
      "p",
      "font-display text-sm uppercase tracking-[0.22em] text-gold",
      site.footer.attentionHeading,
    ),
    hoursList,
  );
  content.append(brand, nav, hours);

  const copyrightBorder = document.createElement("div");
  copyrightBorder.className = "border-t border-white/10";
  const copyright = document.createElement("div");
  copyright.className =
    "mx-auto flex max-w-(--container-content) flex-col items-center gap-2 px-6 py-6 text-center text-xs text-white/60 sm:flex-row sm:justify-between";
  const transparencyLink = makeElement(
    "a",
    "hover:text-white/80 underline underline-offset-2",
    site.footer.transparencyLinkLabel,
  );
  transparencyLink.href = "#transparencia";
  copyright.append(
    makeElement("p", "", site.footer.copyright),
    transparencyLink,
  );
  copyrightBorder.append(copyright);

  footer.append(content, copyrightBorder);
  el.replaceChildren(footer);
}
