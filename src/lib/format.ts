/** Formats an ISO date ("2026-10-15") for display, locale-stable across builds. */
export function formatEventDate(
  iso: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  },
): string {
  if (!iso) return "";
  const date = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    ...options,
    timeZone: "UTC",
  }).format(date);
}
