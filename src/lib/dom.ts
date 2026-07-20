/**
 * Creates an element, optionally setting a class and text. Replaces the
 * per-component `createTextElement` (which required both) and the `el` helper in
 * documents.ts (which made them optional), so element construction lives in one
 * place. Named `makeElement`, not `createElement`, to stay distinct from the
 * native `document.createElement` it wraps.
 *
 * Guard semantics: an empty-string `className` is treated the same as omitting it
 * (no class attribute is set — matching the element's default). Any defined
 * `text`, including `""`, sets `textContent`; `undefined` leaves it untouched.
 */
export function makeElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}
