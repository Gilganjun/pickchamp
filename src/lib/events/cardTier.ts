import type { Event, EventCardTier } from "@/types";

export const EVENT_CARD_TIER_LABELS: Record<EventCardTier, string> = {
  featured: "FEATURED",
  title_fight: "TITLE FIGHT",
  hot: "HOT CARD",
  test: "TEST CARD",
};

export function resolveEventCardTier(event: Event): EventCardTier | null {
  if (event.card_tier) {
    return event.card_tier;
  }
  if (event.id.startsWith("phantom-local-")) {
    return "test";
  }
  return null;
}
