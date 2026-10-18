import type { IconName } from "@/content/site";

const PATHS: Record<IconName, string> = {
  form: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6M8 13h8M8 17h5"></path>',
  screen:
    '<rect x="3" y="4" width="18" height="14" rx="2"></rect><path d="M8 21h8M12 18v3"></path>',
  building:
    '<path d="M3 21h18M5 21V9l7-5 7 5v12"></path><path d="M9 21v-6h6v6"></path>',
  fees: '<path d="M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6"></path>',
  contract:
    '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><path d="M14 3v6h6M9 15l2 2 4-4"></path>',
  seal: '<circle cx="12" cy="9" r="5"></circle><path d="M9 13.5 8 21l4-2 4 2-1-7.5"></path>',
  signature:
    '<path d="M3 17c3 0 4-3 6-3s2 3 4 3 3-6 5-6 2 2 3 2"></path><path d="M3 21h18"></path>',
  house:
    '<path d="M3 11l9-7 9 7"></path><path d="M5 10v10h14V10"></path><path d="M10 20v-5h4v5"></path>',
};

// Tinted chip per icon so each task reads at a glance.
const TONES: Record<IconName, string> = {
  form: "bg-tone-blue text-accent",
  screen: "bg-tone-gold text-tone-gold-ink",
  building: "bg-tone-green text-tone-green-ink",
  fees: "bg-tone-wine text-tone-wine-ink",
  contract: "bg-tone-blue text-accent",
  seal: "bg-tone-gold text-tone-gold-ink",
  signature: "bg-tone-green text-tone-green-ink",
  house: "bg-tone-wine text-tone-wine-ink",
};

export function iconChip(name: IconName, size: "sm" | "md" = "sm"): string {
  const box =
    size === "sm" ? "h-9 w-9 rounded-[9px]" : "h-10 w-10 rounded-[10px]";
  const svgSize = size === "sm" ? 18 : 20;

  return `
    <span class="grid shrink-0 place-items-center ${box} ${TONES[name]}" aria-hidden="true">
      <svg width="${svgSize}" height="${svgSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${PATHS[name]}</svg>
    </span>
  `;
}

// Guilloché rosette, like the security pattern on notarial paper.
export function rosette(className: string): string {
  const ellipses = Array.from(
    { length: 12 },
    (_, index) =>
      `<ellipse cx="300" cy="300" rx="280" ry="96" transform="rotate(${index * 15} 300 300)"></ellipse>`,
  ).join("");

  return `
    <svg class="${className}" viewBox="0 0 600 600" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true" focusable="false">
      ${ellipses}
      <circle cx="300" cy="300" r="120"></circle>
      <circle cx="300" cy="300" r="110" stroke-dasharray="3 5"></circle>
    </svg>
  `;
}
