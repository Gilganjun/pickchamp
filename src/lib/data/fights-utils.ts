import type { Event, FightWithRelations, SportFilter } from "@/types";
import { inferFightTab, isFightLocked } from "@/lib/utils";

export type EventCardFilter = "all" | string;

/** Fights shown on the Picks page (open cards + Past Picks settled cards). */
export function isActivePicksFight(fight: FightWithRelations): boolean {
  if (fight.status === "cancelled" || fight.status === "no_contest") {
    return false;
  }
  const tab = inferFightTab(fight.status, fight.lock_time);
  return tab === "upcoming" || tab === "live" || tab === "settled";
}

/** Every fight on the card has passed pick lock — no new picks or edits. */
export function isEventPicksLocked(fights: FightWithRelations[]): boolean {
  if (fights.length === 0) return false;
  return fights.every((fight) => isFightLocked(fight));
}

export function filterFightsForPicksView(
  fights: FightWithRelations[],
  sportFilter: SportFilter,
  eventFilter: EventCardFilter
): FightWithRelations[] {
  return fights
    .filter(isActivePicksFight)
    .filter((f) => sportFilter === "all" || f.sport === sportFilter)
    .filter((f) => eventFilter === "all" || f.event_id === eventFilter)
    .sort((a, b) => {
      const eventDiff =
        new Date(a.event.event_date).getTime() -
        new Date(b.event.event_date).getTime();
      if (eventDiff !== 0) return eventDiff;
      const orderA = a.fight_order ?? 999;
      const orderB = b.fight_order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return (
        new Date(a.lock_time).getTime() - new Date(b.lock_time).getTime()
      );
    });
}

export type EventFightGroup = {
  event: Event;
  fights: FightWithRelations[];
};

export function groupFightsByEvent(
  fights: FightWithRelations[]
): EventFightGroup[] {
  const map = new Map<string, FightWithRelations[]>();
  for (const fight of fights) {
    const list = map.get(fight.event_id) ?? [];
    list.push(fight);
    map.set(fight.event_id, list);
  }
  return [...map.entries()]
    .map(([, cardFights]) => ({
      event: cardFights[0].event,
      fights: cardFights,
    }))
    .sort(
      (a, b) =>
        new Date(a.event.event_date).getTime() -
        new Date(b.event.event_date).getTime()
    );
}

/** True when the card filter targets a single event whose picks are fully locked. */
export function isFocusedLockedCardSelection(
  eventCard: EventCardFilter,
  fights: FightWithRelations[]
): boolean {
  if (eventCard === "all") return false;
  const cardFights = fights.filter((fight) => fight.event_id === eventCard);
  if (cardFights.length === 0) return false;
  return isEventPicksLocked(cardFights);
}

/** Pin the selected card to the top when a specific event is chosen in the filter. */
export function orderEventCardGroups(
  groups: EventFightGroup[],
  selectedCardId: EventCardFilter
): EventFightGroup[] {
  if (selectedCardId === "all") return groups;
  const index = groups.findIndex((group) => group.event.id === selectedCardId);
  if (index <= 0) return groups;
  const reordered = [...groups];
  const [selected] = reordered.splice(index, 1);
  return [selected, ...reordered];
}
