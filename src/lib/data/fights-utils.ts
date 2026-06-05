import type { Event, FightWithRelations, SportFilter } from "@/types";
import { inferFightTab } from "@/lib/utils";

export type EventCardFilter = "all" | string;

/** Upcoming + in-progress fights shown on the Picks page (settled excluded). */
export function isActivePicksFight(fight: FightWithRelations): boolean {
  const tab = inferFightTab(fight.status, fight.lock_time);
  return tab === "upcoming" || tab === "live";
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

export function groupFightsByEvent(
  fights: FightWithRelations[]
): { event: Event; fights: FightWithRelations[] }[] {
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
