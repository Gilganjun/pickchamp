export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export {
  formatDateTimeInZone,
  formatEventDateTime,
  formatFightDate,
  formatPickLockDateTime,
  getEventTimeZone,
  resolveEventTimeZone,
} from "@/lib/datetime";

export function getLockCountdown(lockTime: string): string {
  const now = Date.now();
  const lock = new Date(lockTime).getTime();
  const diff = lock - now;
  if (diff <= 0) return "Locked";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return `Locks in ${days}d ${hours % 24}h`;
  }
  return `Locks in ${hours}h ${minutes}m`;
}

export function isFightLocked(fight: {
  lock_time: string;
  status: string;
}): boolean {
  if (
    fight.status === "locked" ||
    fight.status === "result_pending" ||
    fight.status === "settled" ||
    fight.status === "cancelled" ||
    fight.status === "no_contest"
  ) {
    return true;
  }
  return new Date(fight.lock_time).getTime() <= Date.now();
}

export function inferFightTab(
  status: string,
  lockTime: string
): "upcoming" | "live" | "settled" {
  if (status === "settled" || status === "cancelled" || status === "no_contest") {
    return "settled";
  }
  if (
    status === "locked" ||
    status === "result_pending" ||
    (status === "upcoming" && new Date(lockTime).getTime() <= Date.now())
  ) {
    return "live";
  }
  return "upcoming";
}

export function getFighterSurname(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length <= 1) return name.toUpperCase();
  return parts[parts.length - 1].toUpperCase();
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
