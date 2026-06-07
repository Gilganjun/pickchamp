import { resolveEventCardTier, EVENT_CARD_TIER_LABELS } from "@/lib/events/cardTier";
import { formatEventDateTime } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";
import type { ReactNode } from "react";

interface EventCardShellProps {
  event: Event;
  className?: string;
  surface?: "default" | "elevated";
  overlay?: ReactNode;
  children: ReactNode;
}

export function EventCardShell({
  event,
  className,
  surface = "elevated",
  overlay,
  children,
}: EventCardShellProps) {
  const tier = resolveEventCardTier(event);

  return (
    <section
      className={cn(
        "event-card-shell relative overflow-hidden rounded-xl border border-[#2a2a2a]",
        surface === "elevated" ? "bg-[#181818]" : "bg-[#111111]",
        className
      )}
      data-tier={tier ?? undefined}
    >
      {overlay}
      {children}
    </section>
  );
}

interface EventCardHeaderContentProps {
  event: Event;
  functionalBadges?: ReactNode;
  /** Override default promotion / venue / date lines (plain text). */
  detailLine?: string;
  fightLine?: string;
  trailing?: ReactNode;
  className?: string;
}

function EventCardMetadata({
  event,
  detailLine,
  fightLine,
}: {
  event: Event;
  detailLine?: string;
  fightLine?: string;
}) {
  if (detailLine) {
    return (
      <div className="event-card-metadata mt-1 space-y-0.5">
        <p className="text-[11px] leading-snug text-zinc-400">{detailLine}</p>
        {fightLine ? (
          <p className="text-[10px] leading-snug text-zinc-500">{fightLine}</p>
        ) : null}
      </div>
    );
  }

  const venueDate = (
    <>
      {event.location ?? "TBA"}
      <span className="mx-1">·</span>
      {formatEventDateTime(event)}
    </>
  );

  return (
    <div className="event-card-metadata mt-1 space-y-0.5">
      {event.promotion ? (
        <p className="text-[11px] leading-snug text-zinc-300">{event.promotion}</p>
      ) : null}
      <p className="text-[11px] leading-snug text-zinc-400">{venueDate}</p>
      {fightLine ? (
        <p className="text-[10px] leading-snug text-zinc-500">{fightLine}</p>
      ) : null}
    </div>
  );
}

export function EventCardHeaderContent({
  event,
  functionalBadges,
  detailLine,
  fightLine,
  trailing,
  className,
}: EventCardHeaderContentProps) {
  const tier = resolveEventCardTier(event);

  return (
    <div className={cn("flex w-full items-start gap-3", className)}>
      <div className="min-w-0 flex-1 pl-0.5">
        {tier ? (
          <p className="event-card-marketing-badge mb-1 text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-400">
            {EVENT_CARD_TIER_LABELS[tier]}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="event-card-title text-sm font-bold uppercase tracking-tight text-white">
            {event.name}
          </h2>
          {functionalBadges}
        </div>
        <EventCardMetadata
          event={event}
          detailLine={detailLine}
          fightLine={fightLine}
        />
      </div>
      {trailing}
    </div>
  );
}
