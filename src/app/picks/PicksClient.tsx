"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { FightCard } from "@/components/FightCard";
import {
  EventCardHeaderContent,
  EventCardShell,
} from "@/components/events/EventCardShell";
import { LockGraphic } from "@/components/LockGraphic";
import { cn } from "@/lib/utils";
import {
  PicksFilterBar,
  resolveCardFilterForSport,
  type CardFilterValue,
} from "@/components/picks/PicksFilterBar";
import { loadPicksPageDataAction } from "@/app/actions/picks";
import {
  groupFightsByEvent,
  isEventPicksLocked,
  isFocusedLockedCardSelection,
  orderEventCardGroups,
} from "@/lib/data/fights-utils";
import { CardExpandPointer } from "@/components/picks/CardExpandPointer";
import { EventCardPickSummary } from "@/components/picks/EventCardPickSummary";
import { summarizeEventCardPicks } from "@/lib/picks/eventCardPickSummary";
import {
  dismissCardExpandHint,
  isCardExpandHintDismissed,
} from "@/lib/ui/cardExpandHint";
import { CHANGE_PICK_QUERY_KEY } from "@/lib/picks/changePickRoute";
import { inferFightTab } from "@/lib/utils";
import type {
  Event,
  FightWithRelations,
  Prediction,
  SportFilter as SF,
} from "@/types";

type PointerTarget =
  | { kind: "active"; eventId: string }
  | { kind: "past-section" }
  | { kind: "past-inner"; eventId: string };

function PicksFightList({
  fights,
  onPredictionSaved,
  isLoggedIn,
}: {
  fights: FightWithRelations[];
  onPredictionSaved: (fightId: string, prediction: Prediction) => void;
  isLoggedIn: boolean;
}) {
  return (
    <>
      {fights.map((fight) => (
        <FightCard
          key={fight.id}
          fight={fight}
          onPredictionSaved={onPredictionSaved}
          enablePickImpact
          isLoggedIn={isLoggedIn}
        />
      ))}
    </>
  );
}

function CardCollapseChevron({ expanded }: { expanded: boolean }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#111111] text-zinc-300 transition-colors",
        "group-hover:border-zinc-600 group-hover:text-white"
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "h-5 w-5 transition-transform duration-200",
          expanded ? "rotate-180" : "rotate-0"
        )}
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}

function EventCardSection({
  event,
  fights,
  onPredictionSaved,
  isLoggedIn,
  hideLockOverlay = false,
  showExpandPointer = false,
  onExpandedChange,
  startExpanded = false,
  scrollToFightId = null,
  onFocusFightHandled,
}: {
  event: Event;
  fights: FightWithRelations[];
  onPredictionSaved: (fightId: string, prediction: Prediction) => void;
  isLoggedIn: boolean;
  hideLockOverlay?: boolean;
  showExpandPointer?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  startExpanded?: boolean;
  scrollToFightId?: string | null;
  onFocusFightHandled?: () => void;
}) {
  const picksLocked = isEventPicksLocked(fights);
  const pickSummary = useMemo(
    () => (picksLocked ? summarizeEventCardPicks(fights) : null),
    [picksLocked, fights]
  );
  const [expanded, setExpanded] = useState(startExpanded);
  const isLiveCard =
    !picksLocked &&
    fights.some(
      (fight) => inferFightTab(fight.status, fight.lock_time) === "live"
    );

  useEffect(() => {
    if (picksLocked) {
      setExpanded(false);
    }
  }, [picksLocked]);

  useEffect(() => {
    if (!startExpanded) return;
    setExpanded(true);
    onExpandedChange?.(true);
  }, [startExpanded, onExpandedChange]);

  useEffect(() => {
    if (!expanded || !scrollToFightId) return;
    const timer = window.setTimeout(() => {
      document.getElementById(`fight-${scrollToFightId}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      onFocusFightHandled?.();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [expanded, scrollToFightId, onFocusFightHandled]);

  const toggleExpanded = () => {
    setExpanded((open) => {
      const next = !open;
      onExpandedChange?.(next);
      return next;
    });
  };

  const functionalBadges = picksLocked ? (
    <span className="inline-flex items-center rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
      Picks Locked — Event Started
    </span>
  ) : isLiveCard ? (
    <span className="inline-flex items-center rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
      Live Card
    </span>
  ) : null;

  return (
    <EventCardShell
      event={event}
      overlay={
        picksLocked &&
        !expanded &&
        !hideLockOverlay &&
        (!pickSummary || pickSummary.picksMade === 0) ? (
          <div
            className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
            aria-hidden
          >
            <LockGraphic
              variant="card"
              className="drop-shadow-[0_0_18px_rgba(255,255,255,0.12)]"
            />
          </div>
        ) : null
      }
    >
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        className="relative z-[2] group w-full px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
      >
        {showExpandPointer && !expanded ? (
          <CardExpandPointer className="right-8 top-1/2 -translate-y-1/2 sm:right-10" />
        ) : null}
        <EventCardHeaderContent
          event={event}
          functionalBadges={functionalBadges}
          fightLine={`${fights.length} fight${fights.length === 1 ? "" : "s"}`}
          trailing={<CardCollapseChevron expanded={expanded} />}
        />
      </button>

      {pickSummary ? (
        <div className="relative z-[2] border-t border-[#2a2a2a] px-3 py-3">
          <EventCardPickSummary
            summary={pickSummary}
            variant={expanded ? "detailed" : "compact"}
          />
        </div>
      ) : null}

      {expanded ? (
        <div className="relative z-[2] space-y-3 border-t border-[#2a2a2a] px-3 pb-3 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Full fight card
          </p>
          <PicksFightList
            fights={fights}
            onPredictionSaved={onPredictionSaved}
            isLoggedIn={isLoggedIn}
          />
        </div>
      ) : null}
    </EventCardShell>
  );
}

type EventFightGroup = ReturnType<typeof groupFightsByEvent>[number];

function PastPicksSection({
  groups,
  eventCard,
  onPredictionSaved,
  isLoggedIn,
  expanded,
  onExpandedChange,
  onInnerExpandedChange,
  showExpandPointer = false,
  pointerTargetEventId = null,
  innerStartExpandedIds,
  focusFightId = null,
  onFocusFightHandled,
}: {
  groups: EventFightGroup[];
  eventCard: CardFilterValue;
  onPredictionSaved: (fightId: string, prediction: Prediction) => void;
  isLoggedIn: boolean;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onInnerExpandedChange: (eventId: string, expanded: boolean) => void;
  showExpandPointer?: boolean;
  pointerTargetEventId?: string | null;
  innerStartExpandedIds?: Set<string>;
  focusFightId?: string | null;
  onFocusFightHandled?: () => void;
}) {
  if (groups.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#181818]">
      <button
        type="button"
        onClick={() => onExpandedChange(!expanded)}
        aria-expanded={expanded}
        className="group relative flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
      >
        {showExpandPointer && !expanded ? (
          <CardExpandPointer className="right-8 top-1/2 -translate-y-1/2 sm:right-10" />
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold uppercase tracking-tight text-white">
            Past Picks
          </h2>
          <p className="mt-1 text-[11px] text-zinc-500">
            {groups.length} locked card{groups.length === 1 ? "" : "s"}
          </p>
        </div>
        <CardCollapseChevron expanded={expanded} />
      </button>

      {expanded ? (
        <div className="space-y-4 border-t border-[#2a2a2a] px-3 pb-3 pt-3">
          {groups.map(({ event, fights: cardFights }) => (
            <EventCardSection
              key={`${event.id}-${eventCard}`}
              event={event}
              fights={cardFights}
              onPredictionSaved={onPredictionSaved}
              isLoggedIn={isLoggedIn}
              hideLockOverlay
              showExpandPointer={
                pointerTargetEventId === event.id && expanded
              }
              startExpanded={innerStartExpandedIds?.has(event.id) ?? false}
              scrollToFightId={
                focusFightId &&
                cardFights.some((fight) => fight.id === focusFightId)
                  ? focusFightId
                  : null
              }
              onFocusFightHandled={onFocusFightHandled}
              onExpandedChange={(next) =>
                onInnerExpandedChange(event.id, next)
              }
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

interface PicksClientProps {
  initialIsLoggedIn?: boolean;
  initialEvents?: Event[];
  initialFights?: FightWithRelations[];
  initialError?: string | null;
}

export function PicksClient({
  initialIsLoggedIn = false,
  initialEvents = [],
  initialFights = [],
  initialError = null,
}: PicksClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [focusFightId, setFocusFightId] = useState<string | null>(null);
  const focusHandledRef = useRef(false);

  const [sport, setSport] = useState<SF>("all");
  const [eventCard, setEventCard] = useState<CardFilterValue>("all");
  const [pickEvents, setPickEvents] = useState<Event[]>(initialEvents);
  const [fights, setFights] = useState<FightWithRelations[]>(initialFights);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [hintDismissed, setHintDismissed] = useState(true);
  const [pastPicksExpanded, setPastPicksExpanded] = useState(false);
  const [activeExpandedIds, setActiveExpandedIds] = useState<Set<string>>(
    () => new Set()
  );
  const [pastInnerExpandedIds, setPastInnerExpandedIds] = useState<Set<string>>(
    () => new Set()
  );

  useEffect(() => {
    setHintDismissed(isCardExpandHintDismissed("picks"));
  }, []);

  useEffect(() => {
    const fightId = searchParams.get(CHANGE_PICK_QUERY_KEY);
    if (fightId) {
      setFocusFightId(fightId);
      focusHandledRef.current = false;
    }
  }, [searchParams]);

  const focusTarget = useMemo(() => {
    if (!focusFightId) return null;
    const fight = fights.find((entry) => entry.id === focusFightId);
    if (!fight) return null;
    return {
      fightId: fight.id,
      eventId: fight.event_id,
      sport: fight.sport as SF,
    };
  }, [focusFightId, fights]);

  const handleFocusFightHandled = useCallback(() => {
    if (focusHandledRef.current) return;
    focusHandledRef.current = true;
    setFocusFightId(null);
    router.replace("/picks", { scroll: false });
  }, [router]);

  const dismissExpandHint = useCallback(() => {
    dismissCardExpandHint("picks");
    setHintDismissed(true);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadPicksPageDataAction(sport, eventCard);
      if (!data.ok) {
        setError(data.error);
        setPickEvents([]);
        setFights([]);
        return;
      }

      const resolvedCard = resolveCardFilterForSport(eventCard, data.events);
      if (resolvedCard !== eventCard) {
        setEventCard(resolvedCard);
      }
      setPickEvents(data.events);
      setFights(data.fights);
      setIsLoggedIn(data.isLoggedIn);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load fight cards."
      );
      setPickEvents([]);
      setFights([]);
    } finally {
      setLoading(false);
    }
  }, [sport, eventCard]);

  useEffect(() => {
    if (sport === "all" && eventCard === "all") {
      return;
    }
    load();
  }, [load, sport, eventCard]);

  const handleSportChange = (next: SF) => {
    setSport(next);
  };

  const { activeGroups, lockedGroups } = useMemo(() => {
    const groups = orderEventCardGroups(groupFightsByEvent(fights), eventCard);
    const phantomIndex = groups.findIndex((group) =>
      group.event.id.startsWith("phantom-local-")
    );
    const ordered =
      phantomIndex > 0
        ? (() => {
            const reordered = [...groups];
            const [phantom] = reordered.splice(phantomIndex, 1);
            return [phantom, ...reordered];
          })()
        : groups;

    const active: EventFightGroup[] = [];
    const locked: EventFightGroup[] = [];
    for (const group of ordered) {
      if (isEventPicksLocked(group.fights)) {
        locked.push(group);
      } else {
        active.push(group);
      }
    }
    return { activeGroups: active, lockedGroups: locked };
  }, [fights, eventCard]);

  useEffect(() => {
    if (!focusTarget || focusHandledRef.current) return;

    if (sport !== focusTarget.sport) {
      setSport(focusTarget.sport);
      return;
    }
    if (eventCard !== focusTarget.eventId) {
      setEventCard(focusTarget.eventId);
      return;
    }

    const inActive = activeGroups.some(
      (group) => group.event.id === focusTarget.eventId
    );
    const inLocked = lockedGroups.some(
      (group) => group.event.id === focusTarget.eventId
    );

    if (inLocked) {
      setPastPicksExpanded(true);
      setPastInnerExpandedIds(new Set([focusTarget.eventId]));
    } else if (inActive) {
      setActiveExpandedIds(new Set([focusTarget.eventId]));
    }
  }, [focusTarget, sport, eventCard, activeGroups, lockedGroups]);

  const focusedLockedCard = useMemo(
    () => isFocusedLockedCardSelection(eventCard, fights),
    [eventCard, fights]
  );

  const allCardsCollapsed =
    activeExpandedIds.size === 0 &&
    pastInnerExpandedIds.size === 0 &&
    !pastPicksExpanded;

  useEffect(() => {
    if (
      allCardsCollapsed &&
      (activeGroups.length > 0 || lockedGroups.length > 0)
    ) {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("pickfist-card-expand-hint:picks");
      }
      setHintDismissed(false);
    }
  }, [
    allCardsCollapsed,
    activeGroups.length,
    lockedGroups.length,
  ]);

  useEffect(() => {
    if (focusFightId) return;
    setActiveExpandedIds(new Set());
    setPastInnerExpandedIds(new Set());
    setPastPicksExpanded(focusedLockedCard);
  }, [sport, eventCard, focusedLockedCard, focusFightId]);

  const pointerTarget = useMemo((): PointerTarget | null => {
    if (hintDismissed || focusedLockedCard) {
      return null;
    }
    if (activeGroups.length > 0 && activeExpandedIds.size === 0) {
      return { kind: "active", eventId: activeGroups[0].event.id };
    }
    if (lockedGroups.length > 0 && !pastPicksExpanded) {
      return { kind: "past-section" };
    }
    if (
      pastPicksExpanded &&
      lockedGroups.length > 0 &&
      pastInnerExpandedIds.size === 0
    ) {
      return { kind: "past-inner", eventId: lockedGroups[0].event.id };
    }
    return null;
  }, [
    hintDismissed,
    focusedLockedCard,
    activeGroups,
    lockedGroups,
    activeExpandedIds,
    pastPicksExpanded,
    pastInnerExpandedIds,
  ]);

  const handleActiveExpanded = useCallback(
    (eventId: string, expanded: boolean) => {
      setActiveExpandedIds((current) => {
        const has = current.has(eventId);
        if ((expanded && has) || (!expanded && !has)) {
          return current;
        }
        const next = new Set(current);
        if (expanded) {
          next.add(eventId);
        } else {
          next.delete(eventId);
        }
        return next;
      });
      if (expanded) {
        dismissExpandHint();
      }
    },
    [dismissExpandHint]
  );

  const handlePastPicksExpanded = useCallback(
    (expanded: boolean) => {
      setPastPicksExpanded(expanded);
      if (expanded) {
        dismissExpandHint();
      }
    },
    [dismissExpandHint]
  );

  const handlePastInnerExpanded = useCallback(
    (eventId: string, expanded: boolean) => {
      setPastInnerExpandedIds((current) => {
        const has = current.has(eventId);
        if ((expanded && has) || (!expanded && !has)) {
          return current;
        }
        const next = new Set(current);
        if (expanded) {
          next.add(eventId);
        } else {
          next.delete(eventId);
        }
        return next;
      });
      if (expanded) {
        dismissExpandHint();
      }
    },
    [dismissExpandHint]
  );

  const handlePredictionSaved = useCallback(
    (fightId: string, prediction: Prediction) => {
      setFights((current) =>
        current.map((fight) =>
          fight.id === fightId
            ? { ...fight, userPrediction: prediction }
            : fight
        )
      );
    },
    []
  );

  return (
    <AppShell prominentBrand showTagline showProfileLink>
      <div className="mt-0.5">
        <PicksFilterBar
          sport={sport}
          card={eventCard}
          events={pickEvents}
          onSportChange={handleSportChange}
          onCardChange={setEventCard}
        />
      </div>

      <div className="mt-3 space-y-4">
        {error ? (
          <p className="rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-6 text-center text-sm text-red-300">
            {error}
          </p>
        ) : null}
        {loading ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            Loading fights…
          </p>
        ) : fights.length === 0 && !error ? (
          <p className="py-12 text-center text-sm text-zinc-500">
            No fights in this view. Try another sport or event card.
          </p>
        ) : (
          <>
            {focusedLockedCard ? (
              <PastPicksSection
                groups={lockedGroups}
                eventCard={eventCard}
                onPredictionSaved={handlePredictionSaved}
                isLoggedIn={isLoggedIn}
                expanded={pastPicksExpanded}
                onExpandedChange={handlePastPicksExpanded}
                onInnerExpandedChange={handlePastInnerExpanded}
                innerStartExpandedIds={pastInnerExpandedIds}
                focusFightId={focusFightId}
                onFocusFightHandled={handleFocusFightHandled}
              />
            ) : null}
            {activeGroups.map(({ event, fights: cardFights }) => (
              <EventCardSection
                key={`${event.id}-${eventCard}`}
                event={event}
                fights={cardFights}
                onPredictionSaved={handlePredictionSaved}
                isLoggedIn={isLoggedIn}
                showExpandPointer={
                  pointerTarget?.kind === "active" &&
                  pointerTarget.eventId === event.id
                }
                startExpanded={activeExpandedIds.has(event.id)}
                scrollToFightId={
                  focusTarget?.eventId === event.id ? focusTarget.fightId : null
                }
                onFocusFightHandled={handleFocusFightHandled}
                onExpandedChange={(expanded) =>
                  handleActiveExpanded(event.id, expanded)
                }
              />
            ))}
            {!focusedLockedCard ? (
              <PastPicksSection
                groups={lockedGroups}
                eventCard={eventCard}
                onPredictionSaved={handlePredictionSaved}
                isLoggedIn={isLoggedIn}
                expanded={pastPicksExpanded}
                onExpandedChange={handlePastPicksExpanded}
                onInnerExpandedChange={handlePastInnerExpanded}
                innerStartExpandedIds={pastInnerExpandedIds}
                focusFightId={focusFightId}
                onFocusFightHandled={handleFocusFightHandled}
                showExpandPointer={pointerTarget?.kind === "past-section"}
                pointerTargetEventId={
                  pointerTarget?.kind === "past-inner"
                    ? pointerTarget.eventId
                    : null
                }
              />
            ) : null}
          </>
        )}
      </div>
    </AppShell>
  );
}
