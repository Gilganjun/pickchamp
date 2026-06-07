export const EVENT_CARD_STYLES = ["classic", "enhanced"] as const;

export type EventCardStyle = (typeof EVENT_CARD_STYLES)[number];

export const EVENT_CARD_STYLE_STORAGE_KEY = "pickfist-event-card-style";
export const EVENT_CARD_STYLE_ATTR = "data-event-card-style";
export const DEFAULT_EVENT_CARD_STYLE: EventCardStyle = "enhanced";

export function getStoredEventCardStyle(): EventCardStyle {
  if (typeof window === "undefined") {
    return DEFAULT_EVENT_CARD_STYLE;
  }
  const stored = window.localStorage.getItem(EVENT_CARD_STYLE_STORAGE_KEY);
  return stored === "classic" ? "classic" : DEFAULT_EVENT_CARD_STYLE;
}

export function applyEventCardStyleToDocument(style: EventCardStyle): void {
  if (typeof document === "undefined") {
    return;
  }
  document.documentElement.setAttribute(EVENT_CARD_STYLE_ATTR, style);
}

export function setStoredEventCardStyle(style: EventCardStyle): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(EVENT_CARD_STYLE_STORAGE_KEY, style);
  applyEventCardStyleToDocument(style);
}

export function cycleEventCardStyle(): EventCardStyle {
  const current = getStoredEventCardStyle();
  const index = EVENT_CARD_STYLES.indexOf(current);
  const next = EVENT_CARD_STYLES[(index + 1) % EVENT_CARD_STYLES.length];
  setStoredEventCardStyle(next);
  return next;
}
