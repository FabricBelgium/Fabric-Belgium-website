/**
 * Joins class names, dropping falsy entries.
 *
 * shadcn-style components (and anything pasted from a generator) import `cn`
 * from here. Note this is a plain join, not clsx + tailwind-merge: it does not
 * resolve conflicting Tailwind utilities. If two inputs set the same property,
 * the winner is decided by generated CSS order, not by argument order. Keep
 * caller `className` overrides to properties the component does not already
 * set, or install tailwind-merge and swap the implementation.
 */
export function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}
