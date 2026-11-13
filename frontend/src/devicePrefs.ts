import { useEffect, useState } from "react";

// Choices kept per device (a wall tablet can differ from a phone): editing locked, and the speaker
// Spotify plays on when started from this device. Off / empty by default, so nothing changes.

const LOCK_KEY = "homedeck-lock-editing";
const SPEAKER_KEY = "homedeck-spotify-speaker";
const AWAKE_KEY = "homedeck-keep-awake";
const VIEW_KEY = "homedeck-device-view";
const BACKGROUND_KEY = "homedeck-device-background";
const KIDS_KEY = "homedeck-device-kids";
const PREF_EVENT = "homedeck-device-pref";

function read(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string | null): void {
  try { if (value == null || value === "") window.localStorage.removeItem(key); else window.localStorage.setItem(key, value); } catch { /* private mode: lasts this visit */ }
  window.dispatchEvent(new Event(PREF_EVENT));
}

export const editingLocked = () => read(LOCK_KEY) === "1";
export const setEditingLocked = (locked: boolean) => write(LOCK_KEY, locked ? "1" : null);

export const spotifySpeaker = () => read(SPEAKER_KEY) ?? "";

/** Keep the screen on: "auto" (the default, only on an Echo Show), "on" or "off". */
export const keepAwakeMode = (): "auto" | "on" | "off" => { const value = read(AWAKE_KEY); return value === "on" || value === "off" ? value : "auto"; };
export const setKeepAwakeMode = (mode: "auto" | "on" | "off") => write(AWAKE_KEY, mode === "auto" ? null : mode);
export const setSpotifySpeaker = (speaker: string) => write(SPEAKER_KEY, speaker || null);

/** This device's own layout, background and Kids scene; empty means it follows the panel's (Settings → Layout
 * and Appearance). A wall tablet in the kids' room can use the Kids layout while the living room keeps the grid. */
export const deviceViewMode = () => read(VIEW_KEY) ?? "";
export const setDeviceViewMode = (mode: string) => write(VIEW_KEY, mode || null);
export const deviceBackground = () => read(BACKGROUND_KEY) ?? "";
export const setDeviceBackground = (preset: string) => write(BACKGROUND_KEY, preset || null);
export const deviceKidsScene = () => read(KIDS_KEY) ?? "";
export const setDeviceKidsScene = (scene: string) => write(KIDS_KEY, scene || null);

/** Child lock on this device: the lock in the header, held 3 s to lock or unlock. While locked, the cards
 * marked "Lock with the child lock" do nothing. Off by default, and nothing is locked until a card is marked. */
const CHILD_KEY = "homedeck-child-lock";
const CHILD_ON_KEY = "homedeck-child-locked";
const NOTE_EVENT = "homedeck-child-note";
export const childLockEnabled = () => read(CHILD_KEY) === "1";
export const childLocked = () => childLockEnabled() && read(CHILD_ON_KEY) === "1";
export const setChildLocked = (locked: boolean) => write(CHILD_ON_KEY, locked ? "1" : null);
export const setChildLockEnabled = (on: boolean) => { if (!on) write(CHILD_ON_KEY, null); write(CHILD_KEY, on ? "1" : null); };
/** A short note under the header: a locked card was tapped, or the lock was tapped instead of held. */
export type ChildLockNote = "blocked" | "hold";
export const childLockNote = (note: ChildLockNote) => window.dispatchEvent(new CustomEvent<ChildLockNote>(NOTE_EVENT, { detail: note }));
export function useChildLockNote(): ChildLockNote | null {
  const [note, setNote] = useState<{ kind: ChildLockNote; at: number } | null>(null);
  useEffect(() => {
    const show = (event: Event) => setNote({ kind: (event as CustomEvent<ChildLockNote>).detail, at: Date.now() });
    window.addEventListener(NOTE_EVENT, show);
    return () => window.removeEventListener(NOTE_EVENT, show);
  }, []);
  useEffect(() => {
    if (!note) return;
    const timer = window.setTimeout(() => setNote(null), 2600);
    return () => window.clearTimeout(timer);
  }, [note]);
  return note?.kind ?? null;
}

/** Re-renders when a device choice changes (in Settings, or in another tab of the same browser). */
export function useDevicePref<T>(get: () => T): T {
  const [value, setValue] = useState(get);
  useEffect(() => {
    const update = () => setValue(get());
    window.addEventListener(PREF_EVENT, update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener(PREF_EVENT, update); window.removeEventListener("storage", update); };
  }, []);
  return value;
}

/**
 * Play or pause; starting playback moves it first to this device's speaker when one is chosen.
 * Returns false when there was nothing to send: Spotify with no active device only accepts a choice
 * of where to play, and asking it to play would show an error.
 */
export function spotifyPlayPause(hass: { callService: (domain: string, service: string, data?: Record<string, unknown>) => Promise<unknown> }, entityId: string, state?: { state: string; attributes: Record<string, unknown> }): boolean {
  const speaker = spotifySpeaker();
  const sources = Array.isArray(state?.attributes.source_list) ? state.attributes.source_list.map(String) : [];
  const starting = state?.state !== "playing";
  const features = Number(state?.attributes.supported_features) || 0;
  const canPlay = features === 0 || (features & (1 | 16384)) !== 0; // PAUSE or PLAY
  if (starting && speaker && state?.attributes.source !== speaker && sources.includes(speaker)) {
    const moved = hass.callService("media_player", "select_source", { entity_id: entityId, source: speaker });
    void (canPlay ? moved.then(() => hass.callService("media_player", "media_play", { entity_id: entityId })) : moved).catch(() => undefined);
    return true;
  }
  if (!canPlay) return false;
  void hass.callService("media_player", "media_play_pause", { entity_id: entityId });
  return true;
}
