export type CardExpandHintScreen = "picks" | "events";

const STORAGE_PREFIX = "pickfist-card-expand-hint:";

export function isCardExpandHintDismissed(screen: CardExpandHintScreen): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  return (
    window.sessionStorage.getItem(`${STORAGE_PREFIX}${screen}`) === "dismissed"
  );
}

export function dismissCardExpandHint(screen: CardExpandHintScreen): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(`${STORAGE_PREFIX}${screen}`, "dismissed");
}
