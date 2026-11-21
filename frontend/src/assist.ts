import type { HomeAssistant } from "./types/home-assistant";

/** Home Assistant's voice assistant (Assist) is set up: the conversation integration is loaded. */
export const hasAssist = (hass: HomeAssistant) => Boolean((hass.config as { components?: string[] } | undefined)?.components?.includes("conversation"));

/** Opens Home Assistant's own Assist dialog, as its "a" shortcut does (the companion app opens its native
 * Assist). If shortcuts are off in the profile, opens the dialog directly when the frontend has it loaded. */
export function openAssist(from: HTMLElement) {
  const key = new KeyboardEvent("keydown", { key: "a", code: "KeyA", cancelable: true });
  window.dispatchEvent(new CustomEvent("hass-quick-bar-trigger", { detail: key }));
  if (key.defaultPrevented || !customElements.get("ha-voice-command-dialog")) return;
  from.dispatchEvent(new CustomEvent("show-dialog", {
    bubbles: true, composed: true,
    detail: { dialogTag: "ha-voice-command-dialog", dialogImport: () => Promise.resolve(), dialogParams: { pipeline_id: "last_used" } },
  }));
}
