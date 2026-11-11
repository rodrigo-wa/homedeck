import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TranslationKey } from "../i18n";
import { conditionMet, useCustomize, useMinute } from "../personalize";
import { usePlan } from "../plan";
import { runEntity } from "../devices";
import type { HomeDeckCondition, HomeDeckNoticeTap } from "../types/config";
import type { DiscoveredEntity } from "../types/discovery";
import type { HassEntity, HomeAssistant } from "../types/home-assistant";
import { EntityModal } from "./EntityModal";
import { HDIcon, domainIcon, type IconName } from "./HDIcon";

// Notices beside the presence avatars: entities chosen in Settings → Home (a mailbox, the garage
// door, the doorbell...) show up as small chips only while there is something to notice, so the
// header stays clean the rest of the time. A tap opens HomeDeck's own details, or, when chosen in
// Settings, dismisses the notice, turns its entity off or runs a script; those ask for a second tap,
// and holding the chip always opens the details.

/** How long an event (a doorbell ring, a button press) stays as a notice. */
const RECENT_MS = 30 * 60 * 1000;
const QUIET = new Set(["off", "closed", "locked", "idle", "standby", "unavailable", "unknown", "none", "false", "0", "", "not_home", "disarmed", "docked", "clear", "ok"]);

export interface Notice { id: string; name: string; detail: string; state: HassEntity }

/** When a timestamp-like state is recent, the minutes since it; null when it isn't a time. */
function minutesAgo(value: string, now: number): number | null {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return null;
  const at = Date.parse(value);
  return Number.isFinite(at) ? Math.max(0, Math.round((now - at) / 60000)) : null;
}

/** The notice for one entity, or null while it has nothing to say. */
export function noticeFor(state: HassEntity | undefined, now: number, t: (key: TranslationKey) => string): Notice | null {
  if (!state) return null;
  const domain = state.entity_id.split(".")[0];
  const name = String(state.attributes.friendly_name ?? state.entity_id.split(".")[1].replaceAll("_", " "));
  const value = String(state.state ?? "").trim();
  const ago = minutesAgo(value, now);
  // Events (doorbells, buttons) and timestamp sensors: only for a while after they happen.
  if (ago != null || domain === "event") {
    if (ago == null || ago * 60000 > RECENT_MS) return null;
    return { id: state.entity_id, name, detail: ago < 1 ? t("justNow") : t("minutesAgo").replace("{minutes}", String(ago)), state };
  }
  if (QUIET.has(value.toLowerCase())) return null;
  const number = Number(value);
  if (value !== "" && Number.isFinite(number)) {
    if (number <= 0) return null;
    const unit = typeof state.attributes.unit_of_measurement === "string" ? ` ${state.attributes.unit_of_measurement}` : "";
    return { id: state.entity_id, name, detail: `${value}${unit}`, state };
  }
  // On, open, detected, unlocked, playing... the name says it; other texts are shown as they are.
  const plain = ["on", "open", "opening", "unlocked", "detected", "home", "playing", "triggered", "true"].includes(value.toLowerCase());
  return { id: state.entity_id, name, detail: plain ? "" : value, state };
}

/** Domains whose notice can be cleared by turning the entity off (closing, locking). */
export const NOTICE_OFF_DOMAINS = new Set(["switch", "input_boolean", "light", "fan", "cover", "lock"]);
/** What a notice can run when tapped. */
export const NOTICE_RUN_DOMAINS = ["script", "button", "input_button", "automation", "scene"];

function turnOff(hass: HomeAssistant, entityId: string) {
  const domain = entityId.split(".")[0];
  if (domain === "cover") return hass.callService("cover", "close_cover", { entity_id: entityId });
  if (domain === "lock") return hass.callService("lock", "lock", { entity_id: entityId });
  return hass.callService("homeassistant", "turn_off", { entity_id: entityId });
}

function runTarget(hass: HomeAssistant, entityId: string) {
  const domain = entityId.split(".")[0];
  if (domain === "automation") return hass.callService("automation", "trigger", { entity_id: entityId });
  if (domain === "scene") return hass.callService("scene", "turn_on", { entity_id: entityId });
  return runEntity(hass, entityId);
}

/** Notices dismissed on any screen of the home, kept by the integration until their entity changes. */
function useDismissed(hass: HomeAssistant, active: boolean): Record<string, string> {
  const [dismissed, setDismissed] = useState<Record<string, string>>({});
  const connection = hass.connection;
  useEffect(() => {
    if (!active || !connection.subscribeMessage) return;
    let unsubscribe: (() => void) | undefined;
    let closed = false;
    connection.subscribeMessage<{ dismissed?: Record<string, string> }>((message) => setDismissed(message.dismissed ?? {}), { type: "homedeck/notices/subscribe" })
      .then((stop) => { if (closed) stop(); else unsubscribe = stop; })
      // An integration not yet restarted after the update has no such command: nothing is dismissed.
      .catch(() => undefined);
    return () => { closed = true; unsubscribe?.(); };
  }, [active, connection]);
  return dismissed;
}

/** Still dismissed: the entity hasn't changed since (the times come from Python and from the browser). */
function stillDismissed(state: HassEntity, at?: string) {
  if (!at) return false;
  return Math.abs(Date.parse(state.last_changed) - Date.parse(at)) < 1000;
}

const HOLD_MS = 500;
const CONFIRM_MS = 4000;

function fallbackIcon(state: HassEntity): IconName {
  const domain = state.entity_id.split(".")[0];
  const deviceClass = String(state.attributes.device_class ?? "");
  if (domain === "event" || deviceClass === "doorbell") return "bell";
  if (["door", "garage_door", "opening", "window"].includes(deviceClass)) return "door";
  if (["motion", "occupancy", "presence"].includes(deviceClass)) return "people";
  if (["moisture"].includes(deviceClass)) return "drop";
  return domainIcon(domain);
}

/** Home Assistant's own icon for the entity (mailbox, garage...), or HomeDeck's when it isn't there. */
function NoticeIcon({ hass, state }: { hass: HomeAssistant; state: HassEntity }) {
  const ref = useRef<HTMLElement & { hass?: unknown; stateObj?: unknown }>(null);
  const native = typeof customElements !== "undefined" && Boolean(customElements.get("ha-state-icon"));
  useEffect(() => {
    if (!ref.current) return;
    ref.current.hass = hass;
    ref.current.stateObj = state;
  });
  return native ? <ha-state-icon class="hd-notice__icon" ref={ref} /> : <span className="hd-notice__icon"><HDIcon name={fallbackIcon(state)} size={16} /></span>;
}

export function HeaderBadges({ hass, ids, language, rules, styles, t, taps, texts }: { hass: HomeAssistant; ids: string[]; language?: string; rules?: Record<string, HomeDeckCondition>; styles?: Record<string, "icon" | "text">; t: (key: TranslationKey) => string; taps?: Record<string, HomeDeckNoticeTap>; texts?: Record<string, string> }) {
  const now = useMinute();
  const customize = useCustomize();
  const [opened, setOpened] = useState<{ id: string; shell: Element } | null>(null);
  const { pro } = usePlan();
  const dismissing = ids.some((id) => taps?.[id]?.action === "dismiss");
  const dismissed = useDismissed(hass, dismissing);
  const [asking, setAsking] = useState<string | null>(null);
  const held = useRef<{ timer?: number; done?: boolean }>({});
  useEffect(() => {
    if (!asking) return;
    const timer = window.setTimeout(() => setAsking(null), CONFIRM_MS);
    return () => window.clearTimeout(timer);
  }, [asking]);
  const notices = ids
    .filter((id) => !pro || conditionMet(rules?.[id], hass.states, new Date(now)))
    .filter((id) => !(taps?.[id]?.action === "dismiss" && hass.states[id] && stillDismissed(hass.states[id]!, dismissed[id])))
    .map((id) => noticeFor(hass.states[id], now, t)).filter((notice): notice is Notice => Boolean(notice));
  const open = (id: string, from: Element) => { const shell = from.closest(".app-shell"); if (shell) setOpened({ id, shell }); };
  const act = (id: string, tap: HomeDeckNoticeTap) => {
    if (tap.action === "dismiss") void hass.connection.sendMessagePromise({ type: "homedeck/notices/dismiss", entity_id: id }).catch(() => undefined);
    else if (tap.action === "off") void turnOff(hass, id);
    else if (tap.target) void runTarget(hass, tap.target);
  };
  const tapped = (id: string, from: Element) => {
    if (held.current.done) { held.current.done = false; return; }
    const tap = taps?.[id];
    if (!tap || (tap.action === "run" && !tap.target)) { open(id, from); return; }
    if (asking !== id) { setAsking(id); return; }
    setAsking(null);
    act(id, tap);
  };
  const press = (id: string, from: Element) => {
    window.clearTimeout(held.current.timer);
    held.current.done = false;
    held.current.timer = window.setTimeout(() => { held.current.done = true; setAsking(null); open(id, from); }, HOLD_MS);
  };
  const release = () => window.clearTimeout(held.current.timer);
  // Over the whole panel, and it stays open if the notice goes away while it is being looked at.
  const details = opened && createPortal(<EntityModal entity={entityFor(opened.id, hass, customize?.lookup(opened.id))} hass={hass} language={language} onClose={() => setOpened(null)} t={t} />, opened.shell);
  if (notices.length === 0) return details || null;
  return <div className="hd-notices" role="status">
    {notices.map((notice) => {
      const label = texts?.[notice.id] || notice.name;
      const style = styles?.[notice.id];
      const full = notice.detail ? `${label}: ${notice.detail}` : label;
      const confirming = asking === notice.id;
      // While it asks for the second tap the chip says so, whatever its style.
      if (confirming) return <button aria-label={t("tapAgainToConfirm")} className="hd-notice hd-notice--confirm" key={notice.id} onClick={(event) => tapped(notice.id, event.currentTarget)} onContextMenu={(event) => event.preventDefault()} onPointerCancel={release} onPointerDown={(event) => press(notice.id, event.currentTarget)} onPointerLeave={release} onPointerUp={release} type="button">
        <span className="hd-notice__name">{t("tapAgainToConfirm")}</span>
      </button>;
      return <button aria-label={full} className={`hd-notice ${style ? `hd-notice--${style}` : ""}`} key={notice.id} onClick={(event) => tapped(notice.id, event.currentTarget)} onContextMenu={(event) => event.preventDefault()} onPointerCancel={release} onPointerDown={(event) => press(notice.id, event.currentTarget)} onPointerLeave={release} onPointerUp={release} title={full} type="button">
        {style !== "text" && <NoticeIcon hass={hass} state={notice.state} />}
        {style !== "icon" && <span className="hd-notice__name">{label}</span>}
        {style !== "icon" && notice.detail && <small>{notice.detail}</small>}
      </button>;
    })}
    {details}
  </div>;
}

/** The device as HomeDeck knows it, or a plain description for entities outside the panel's rooms. */
function entityFor(id: string, hass: HomeAssistant, known?: DiscoveredEntity): DiscoveredEntity {
  if (known) return known;
  const attributes = hass.states[id]?.attributes ?? {};
  return { entity_id: id, domain: id.split(".")[0], name: String(attributes.friendly_name ?? id), area_id: "", device_id: null, device_class: typeof attributes.device_class === "string" ? attributes.device_class : null, icon: null };
}
