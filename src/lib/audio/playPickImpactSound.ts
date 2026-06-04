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

interface PendingSound {
  id: ReturnType<typeof setTimeout>;
  comboId: number;
}

export interface PlayPickImpactSoundOptions {
  delayMs?: number;
  volume?: number;
  comboId?: number;
}

let activeComboId = 0;
const pendingSounds: PendingSound[] = [];
const playingAudios = new Set<HTMLAudioElement>();

function removePendingSound(id: ReturnType<typeof setTimeout>): void {
  const index = pendingSounds.findIndex((entry) => entry.id === id);
  if (index >= 0) {
    pendingSounds.splice(index, 1);
  }
}

/** Clears previous combo queue and stops playing audio (does not block the next combo). */
export function breakPickImpactAudio(): void {
  for (const entry of pendingSounds) {
    clearTimeout(entry.id);
  }
  pendingSounds.length = 0;
  for (const audio of playingAudios) {
    audio.pause();
    audio.currentTime = 0;
  }
  playingAudios.clear();
}

function playPickImpactSoundNow(
  volume: number,
  comboId: number
): void {
  if (typeof window === "undefined") return;
  if (comboId !== activeComboId) return;

  const src =
    PICK_IMPACT_SOUNDS[
      Math.floor(Math.random() * PICK_IMPACT_SOUNDS.length)
    ];

  try {
    const audio = new Audio(src);
    audio.volume = Math.min(1, Math.max(0, volume));
    playingAudios.add(audio);
    const release = () => playingAudios.delete(audio);
    audio.addEventListener("ended", release, { once: true });
    audio.addEventListener("pause", release, { once: true });
    void audio.play().catch(() => {
      release();
    });
  } catch {
    // fail silently
  }
}

export function playPickImpactSound(
  options?: PlayPickImpactSoundOptions
): void {
  if (typeof window === "undefined") return;

  const delayMs = options?.delayMs ?? PICK_IMPACT_SOUND_DELAY_MS;
  const volume = options?.volume ?? PICK_IMPACT_SOUND_VOLUME;
  const comboId = options?.comboId ?? activeComboId;

  if (delayMs <= 0) {
    playPickImpactSoundNow(volume, comboId);
    return;
  }

  const timeoutId = window.setTimeout(() => {
    removePendingSound(timeoutId);
    playPickImpactSoundNow(volume, comboId);
  }, delayMs);

  pendingSounds.push({ id: timeoutId, comboId });
}

/** One sound per combo hit; first hit plays immediately on every fresh click. */
export function playPickImpactCombo(
  hitCount: number,
  gapMs: number
): void {
  breakPickImpactAudio();
  activeComboId += 1;
  const comboId = activeComboId;
  const followUpSoundOffsetMs = 50;
  const hits = Math.max(1, hitCount);

  playPickImpactSound({ delayMs: 0, volume: PICK_IMPACT_SOUND_VOLUME, comboId });

  for (let i = 1; i < hits; i++) {
    playPickImpactSound({
      delayMs: i * gapMs + followUpSoundOffsetMs,
      comboId,
    });
  }
}
