export const PICK_IMPACT_SOUNDS = [
  "/sounds/Punch2.mp3",
  "/sounds/Punch3.mp3",
  "/sounds/Punch4.mp3",
  "/sounds/Punch5.mp3",
  "/sounds/Punch6.mp3",
  "/sounds/Punch7.mp3",
  "/sounds/Punch8.mp3",
  "/sounds/Punch9.mp3",
  "/sounds/Punch10.mp3",
  "/sounds/Punch11.mp3",
] as const;

export const PICK_IMPACT_SOUND_DELAY_MS = 120;
export const PICK_IMPACT_SOUND_VOLUME = 0.18;

export interface PlayPickImpactSoundOptions {
  delayMs?: number;
  volume?: number;
}

export function playPickImpactSound(
  options?: PlayPickImpactSoundOptions
): void {
  if (typeof window === "undefined") return;

  const delayMs = options?.delayMs ?? PICK_IMPACT_SOUND_DELAY_MS;
  const volume = options?.volume ?? PICK_IMPACT_SOUND_VOLUME;
  const src =
    PICK_IMPACT_SOUNDS[
      Math.floor(Math.random() * PICK_IMPACT_SOUNDS.length)
    ];

  window.setTimeout(() => {
    try {
      const audio = new Audio(src);
      audio.volume = Math.min(1, Math.max(0, volume));
      void audio.play().catch(() => {});
    } catch {
      // fail silently
    }
  }, delayMs);
}

/** One sound per combo hit, staggered to match punch timing. */
export function playPickImpactCombo(
  hitCount: number,
  gapMs: number
): void {
  const followUpSoundOffsetMs = 50;
  for (let i = 0; i < hitCount; i++) {
    playPickImpactSound({
      delayMs:
        i === 0
          ? PICK_IMPACT_SOUND_DELAY_MS
          : i * gapMs + followUpSoundOffsetMs,
    });
  }
}
