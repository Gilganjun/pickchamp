import type { Event } from "@/types";

/**
 * PickFist datetime display standard (single source of truth).
 *
 * - Store instants as ISO UTC (`event_date`, `lock_time`).
 * - Set `event.timezone` (IANA) when known; else `resolveEventTimeZone` infers from `location`.
 * - User-facing labels: `formatEventDateTime` (card start) and `formatPickLockDateTime` (per bout).
 * - Never format with the viewer's local zone — always pass an explicit IANA zone via this module.
 */

/** Single locale for all user-facing fight/event timestamps. */
export const PICKFIST_DISPLAY_LOCALE = "en-GB";

/** Event fields used to resolve venue timezone (explicit `timezone` wins). */
export type EventTimeContext = Pick<Event, "location" | "timezone">;

const LOCATION_TIMEZONE_RULES: { test: (loc: string) => boolean; zone: string }[] =
  [
    {
      test: (loc) =>
        /uk|sheffield|london|manchester|birmingham|cardiff|dublin|britain|england|scotland|wales/i.test(
          loc
        ),
      zone: "Europe/London",
    },
    {
      test: (loc) =>
        /las vegas|nevada|apex|los angeles|california|usa.*vegas/i.test(loc),
      zone: "America/Los_Angeles",
    },
    {
      test: (loc) => /new york|madison square|brooklyn|nyc/i.test(loc),
      zone: "America/New_York",
    },
    {
      test: (loc) => /riyadh|saudi|jeddah/i.test(loc),
      zone: "Asia/Riyadh",
    },
    {
      test: (loc) => /tokyo|japan|saitama/i.test(loc),
      zone: "Asia/Tokyo",
    },
    {
      test: (loc) => /abu dhabi|dubai|uae/i.test(loc),
      zone: "Asia/Dubai",
    },
    {
      test: (loc) => /sydney|melbourne|australia/i.test(loc),
      zone: "Australia/Sydney",
    },
  ];

/**
 * Resolves IANA timezone for an event card.
 * Prefer explicit `event.timezone`; fall back to location rules; default UTC.
 */
export function resolveEventTimeZone(event: EventTimeContext): string {
  if (event.timezone?.trim()) {
    return event.timezone.trim();
  }
  if (!event.location) {
    return "UTC";
  }
  const loc = event.location.toLowerCase();
  for (const rule of LOCATION_TIMEZONE_RULES) {
    if (rule.test(loc)) {
      return rule.zone;
    }
  }
  return "UTC";
}

export interface FormatDateTimeOptions {
  /** Include short timezone name (e.g. BST, GMT-7). Default true. */
  includeTimeZoneName?: boolean;
  /** Date only, no clock time. */
  dateOnly?: boolean;
}

/**
 * Formats an ISO instant in a fixed IANA zone (never the viewer's local zone).
 */
export function formatDateTimeInZone(
  iso: string,
  timeZone: string,
  options: FormatDateTimeOptions = {}
): string {
  const { includeTimeZoneName = true, dateOnly = false } = options;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return "DATE TBC";
  }

  if (dateOnly) {
    return d
      .toLocaleDateString(PICKFIST_DISPLAY_LOCALE, {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone,
      })
      .toUpperCase();
  }

  return d
    .toLocaleString(PICKFIST_DISPLAY_LOCALE, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone,
      ...(includeTimeZoneName ? { timeZoneName: "short" as const } : {}),
    })
    .toUpperCase();
}

/** Card / event header: when the show starts (same for all bouts on that card). */
export function formatEventDateTime(event: Pick<Event, "event_date" | "location" | "timezone">): string {
  return formatDateTimeInZone(
    event.event_date,
    resolveEventTimeZone(event)
  );
}

/** Pick lock deadline in venue timezone (per-fight). */
export function formatPickLockDateTime(
  iso: string,
  event: EventTimeContext
): string {
  return formatDateTimeInZone(iso, resolveEventTimeZone(event));
}

/** @deprecated Use formatEventDateTime or formatDateTimeInZone — kept for gradual migration */
export function formatFightDate(iso: string, timeZone?: string): string {
  return formatDateTimeInZone(iso, timeZone ?? "UTC");
}

/** @deprecated Use resolveEventTimeZone — kept for gradual migration */
export function getEventTimeZone(location: string | null): string {
  return resolveEventTimeZone({ location, timezone: null });
}
