import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { hourOptions } from "../clock";
import type { TranslationKey } from "../i18n";
import type { HomeDeckVehicle, VehicleKind, VehicleSlot } from "../types/config";
import type { DiscoveredEntity } from "../types/discovery";
import type { HassEntity, HomeAssistant } from "../types/home-assistant";
import { useEscape } from "../useEscape";
import { useTallTile, useWideTile } from "./EditableGrid";
import { EntityModal } from "./EntityModal";
import { HDIcon, isIconName, type IconName } from "./HDIcon";
import { HDSelect, HDSegmented } from "./HDSelect";
import { PageIconButton } from "./RoomOptions";

// Vehicle cards (Pro): a car or motorbike with its battery or fuel, charging, range and whereabouts.
// Point the card at the vehicle's device (and, if it has one, the charger's: a wallbox or smart plug)
// and it finds the right sensors on its own, in any integration (Tesla, BMW, Kia/Hyundai, Renault,
// Volkswagen, Polestar, Ohme, Zaptec, easee, go-e...). Every slot can still be chosen by hand.

type T = (key: TranslationKey) => string;
type Found = Partial<Record<VehicleSlot, string>>;

export const VEHICLE_COLORS = ["#4f8cff", "#34c759", "#ff9f0a", "#ff375f", "#bf5af2", "#64d2ff", "#ffd60a", "#8e8e93", "#f2f2f7", "#1c1c1e"];
/** The card's colors for a vehicle: white gets a dark icon, black a light edge and ring so it shows on dark cards. */
export function vehicleStyle(color = VEHICLE_COLORS[0]): CSSProperties {
  const hex = color.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) || 0);
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return { "--vc": color, ...(luma > 0.75 ? { "--vc-ink": "#1c1c1e" } : {}), ...(luma < 0.2 ? { "--vc-edge": "rgba(255,255,255,.45)", "--vc-ring": "#d1d1d6" } : {}) } as CSSProperties;
}
const KIND_ICON: Record<VehicleKind, IconName> = { ev: "car", phev: "car", fuel: "car", moto: "bike" };

const text = (hass: HomeAssistant, id: string) => `${id} ${String(hass.states[id]?.attributes.friendly_name ?? "")}`.toLowerCase();
const deviceClass = (hass: HomeAssistant, id: string) => String(hass.states[id]?.attributes.device_class ?? "");
const unit = (hass: HomeAssistant, id: string) => String(hass.states[id]?.attributes.unit_of_measurement ?? "").toLowerCase();
const domain = (id: string) => id.split(".")[0];

/** Every entity of a Home Assistant device (all domains, the location tracker included). */
export function deviceEntities(hass: HomeAssistant, deviceId?: string): string[] {
  if (!deviceId) return [];
  const registry = hass.entities ? Object.values(hass.entities) : [];
  return registry.filter((entry) => entry.device_id === deviceId && hass.states[entry.entity_id]).map((entry) => entry.entity_id);
}

const CHARGE_WORDS = /charg|lade|carreg|recarg|laad/;
const NOT_MAIN_BATTERY = /12v|12_v|aux|key|phone|remote|tpms|tyre|tire|starter/;

/** The best entity for each slot among a device's entities, by kind of entity, device class, unit and name. */
function detect(hass: HomeAssistant, ids: string[], charger = false): Found {
  const pick = (test: (id: string) => boolean, rank: (id: string) => number = () => 0) => ids.filter(test).sort((a, b) => rank(b) - rank(a))[0];
  const sensor = (id: string) => domain(id) === "sensor";
  const found: Found = {};
  if (!charger) {
    found.battery = pick((id) => sensor(id) && (deviceClass(hass, id) === "battery" || (unit(hass, id) === "%" && /batter|soc|state_of_charge|charge_level|ladestand|akku|bateria|batterie/.test(text(hass, id)))) && !NOT_MAIN_BATTERY.test(text(hass, id)) && !/fuel|combust/.test(text(hass, id)),
      (id) => (/soc|state_of_charge|battery_level|charge_level|bateria|ladestand/.test(text(hass, id)) ? 2 : 0) + (deviceClass(hass, id) === "battery" ? 1 : 0));
    found.fuel = pick((id) => sensor(id) && /fuel|combust|tank|kraftstoff|carburant|gasolin|benzin/.test(text(hass, id)) && !/range|autonom|reichweite|consum/.test(text(hass, id)),
      (id) => (unit(hass, id) === "%" ? 1 : 0));
    found.odometer = pick((id) => sensor(id) && /odometer|mileage|kilometerstand|hodometro|odômetro|quilometragem|kilometrage|odo\b/.test(text(hass, id)));
    found.range = pick((id) => sensor(id) && id !== found.odometer && (deviceClass(hass, id) === "distance" || ["km", "mi"].includes(unit(hass, id))) && /range|autonom|reichweite|remaining|restant|alcance/.test(text(hass, id)),
      (id) => (/electric|ev_|battery|elektr|eléctr|elétr/.test(text(hass, id)) ? 1 : 0) + (/total|combined|gesamt/.test(text(hass, id)) ? 2 : 0));
    found.location = pick((id) => domain(id) === "device_tracker");
    found.lock = pick((id) => domain(id) === "lock");
    found.climate = pick((id) => domain(id) === "climate");
  }
  found.charging = pick((id) => (domain(id) === "binary_sensor" && (deviceClass(hass, id) === "battery_charging" || CHARGE_WORDS.test(text(hass, id)) && !/plug|cable|kabel|connect/.test(text(hass, id))))
      || (sensor(id) && !hass.states[id]?.attributes.unit_of_measurement && /charg(ing)?_?(state|status)|charge_state|ladestatus|ladezustand|status.*(charg|lade|carreg)|(charg|lade|carreg).*status/.test(text(hass, id))),
    (id) => (deviceClass(hass, id) === "battery_charging" ? 2 : 0) + (domain(id) === "binary_sensor" ? 1 : 0));
  found.plug = pick((id) => domain(id) === "binary_sensor" && (deviceClass(hass, id) === "plug" || /plug|cable|kabel|plugged|connected|conectad|branch|stecker/.test(text(hass, id))));
  found.power = pick((id) => sensor(id) && (deviceClass(hass, id) === "power" || ["w", "kw"].includes(unit(hass, id))) && (charger || CHARGE_WORDS.test(text(hass, id))));
  found.time = pick((id) => sensor(id) && ((deviceClass(hass, id) === "duration" || ["min", "h", "s"].includes(unit(hass, id))) && /charg|lade|carreg|full|remaining|restante|voll/.test(text(hass, id)) || (deviceClass(hass, id) === "timestamp" && /charg|lade|carreg|complete|full|finish|end|ende|fim/.test(text(hass, id)))));
  found.charge_switch = pick((id) => domain(id) === "switch" && (charger || CHARGE_WORDS.test(text(hass, id))), (id) => (CHARGE_WORDS.test(text(hass, id)) ? 1 : 0));
  return found;
}

/** The entity of each slot: the one chosen by hand, else the car's own, else the charger's. */
export function vehicleEntities(hass: HomeAssistant, vehicle: HomeDeckVehicle): { slots: Found; auto: Found } {
  const car = detect(hass, deviceEntities(hass, vehicle.device));
  const charger = detect(hass, deviceEntities(hass, vehicle.charger), true);
  const auto: Found = { ...charger };
  for (const [slot, id] of Object.entries(car) as Array<[VehicleSlot, string | undefined]>) if (id) auto[slot] = id;
  const slots: Found = { ...auto };
  for (const [slot, id] of Object.entries(vehicle.entities ?? {}) as Array<[VehicleSlot, string]>) {
    if (id === "") delete slots[slot];
    else if (hass.states[id]) slots[slot] = id;
  }
  return { slots, auto };
}

const number = (state?: HassEntity) => { const value = Number.parseFloat(state?.state ?? ""); return Number.isFinite(value) ? value : null; };

interface VehicleStatus {
  level: number | null;
  levelKind: "battery" | "fuel";
  charging: boolean;
  plugged: boolean;
  full: boolean;
  power: string | null;
  time: string | null;
  range: string | null;
  place: string | null;
  home: boolean;
  locked: boolean | null;
  odometer: string | null;
}

function vehicleStatus(hass: HomeAssistant, vehicle: HomeDeckVehicle, slots: Found, language: string | undefined, t: T): VehicleStatus {
  const get = (slot: VehicleSlot) => (slots[slot] ? hass.states[slots[slot]!] : undefined);
  const kind = vehicle.kind ?? "ev";
  const battery = number(get("battery"));
  const fuel = number(get("fuel"));
  const levelKind = kind === "fuel" || (battery == null && fuel != null) ? "fuel" : "battery";
  const level = levelKind === "fuel" ? fuel : battery;
  const chargeState = get("charging");
  const chargeText = (chargeState?.state ?? "").toLowerCase();
  const full = /complete|finished|fully|full|charged|beendet|voll|concluí|completo|termin/.test(chargeText) || (battery != null && battery >= 100);
  const charging = domain(slots.charging ?? "") === "binary_sensor" ? chargeState?.state === "on"
    : /charg|laden|lädt|carregando|cargando|en_charge|in_progress/.test(chargeText) && !/not|nicht|não|no_|stop|disconnect|complete|finish|ready|fully|idle|^charged$/.test(chargeText);
  const powerState = get("power");
  const watts = number(powerState);
  const powerUnit = String(powerState?.attributes.unit_of_measurement ?? "").toLowerCase();
  const kw = watts == null ? null : powerUnit === "w" ? watts / 1000 : watts;
  const plugState = get("plug");
  const plugged = plugState ? plugState.state === "on" : charging || (kw != null && kw > 0.05);
  const format = (value: number, digits: number) => new Intl.NumberFormat(language, { maximumFractionDigits: digits }).format(value);
  const timeState = get("time");
  let time: string | null = null;
  if (timeState && !["unknown", "unavailable", ""].includes(timeState.state)) {
    if (timeState.attributes.device_class === "timestamp") {
      const at = new Date(timeState.state);
      if (!Number.isNaN(at.getTime()) && at.getTime() > Date.now()) time = `${t("vehicleUntil")} ${new Intl.DateTimeFormat(language, { hour: "2-digit", minute: "2-digit", ...hourOptions() }).format(at)}`;
    } else {
      const value = number(timeState);
      const u = String(timeState.attributes.unit_of_measurement ?? "min").toLowerCase();
      const minutes = value == null ? null : u === "h" ? value * 60 : u === "s" ? value / 60 : value;
      if (minutes != null && minutes > 0) time = minutes >= 60 ? `${Math.floor(minutes / 60)} h ${String(Math.round(minutes % 60)).padStart(2, "0")}` : `${Math.round(minutes)} min`;
    }
  }
  const rangeState = get("range");
  const range = number(rangeState) != null ? `${format(number(rangeState)!, 0)} ${String(rangeState?.attributes.unit_of_measurement ?? "km")}` : null;
  const tracker = get("location");
  const home = tracker?.state === "home";
  const place = !tracker || ["unknown", "unavailable"].includes(tracker.state) ? null : home ? t("vehicleHome") : tracker.state === "not_home" ? t("vehicleAway") : tracker.state;
  const lockState = get("lock");
  const locked = !lockState || ["unknown", "unavailable"].includes(lockState.state) ? null : domain(slots.lock ?? "") === "binary_sensor" ? lockState.state === "off" : lockState.state === "locked";
  const odometerState = get("odometer");
  const odometer = number(odometerState) != null ? `${format(number(odometerState)!, 0)} ${String(odometerState?.attributes.unit_of_measurement ?? "km")}` : null;
  return { level, levelKind, charging, plugged, full, power: kw != null && kw > 0.05 ? `${format(kw, 1)} kW` : null, time, range, place, home, locked, odometer };
}

/** One line on what the vehicle is doing now. */
function statusLine(status: VehicleStatus, t: T): string {
  if (status.charging) return [t("vehicleCharging"), status.power, status.time].filter(Boolean).join(" · ");
  if (status.plugged) return status.full ? t("vehicleFull") : t("vehiclePlugged");
  return [status.place, status.range].filter(Boolean).join(" · ") || "";
}

/** The level as a ring, filling with the vehicle's color (amber and red when it runs low). */
function Ring({ charging, level, size }: { charging: boolean; level: number | null; size: number }) {
  const radius = 42;
  const length = 2 * Math.PI * radius;
  const value = level == null ? 0 : Math.max(0, Math.min(100, level));
  const tone = level == null ? "var(--vc-ring, var(--vc))" : value <= 15 ? "#ff453a" : value <= 30 ? "#ff9f0a" : "var(--vc-ring, var(--vc))";
  return <svg aria-hidden="true" className={`hd-vehicle__ring${charging ? " hd-vehicle__ring--charging" : ""}`} height={size} viewBox="0 0 100 100" width={size}>
    <circle cx="50" cy="50" fill="none" r={radius} stroke="currentColor" strokeOpacity=".16" strokeWidth="8" />
    <circle cx="50" cy="50" fill="none" r={radius} stroke={tone} strokeDasharray={`${(value / 100) * length} ${length}`} strokeLinecap="round" strokeWidth="8" transform="rotate(-90 50 50)" />
  </svg>;
}

const iconOf = (vehicle: HomeDeckVehicle): IconName => (vehicle.icon && isIconName(vehicle.icon) ? vehicle.icon : KIND_ICON[vehicle.kind ?? "ev"]);
const asEntity = (hass: HomeAssistant, id: string): DiscoveredEntity => ({ entity_id: id, domain: domain(id), name: String(hass.states[id]?.attributes.friendly_name ?? id), area_id: "", device_id: null, device_class: (hass.states[id]?.attributes.device_class as string | undefined) ?? null, icon: null });

/** The card: the level in a ring around the vehicle's icon, its name and what it is doing; larger sizes
 * add range, power, time to full and where it is. A tap opens the details. */
export function VehicleCard({ editing, hass, language, t, vehicle }: { editing: boolean; hass: HomeAssistant; language?: string; t: T; vehicle: HomeDeckVehicle }) {
  const wide = useWideTile();
  const tall = useTallTile();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const { slots } = vehicleEntities(hass, vehicle);
  const status = vehicleStatus(hass, vehicle, slots, language, t);
  const line = statusLine(status, t);
  const style = vehicleStyle(vehicle.color);
  // The chips never repeat what the status line already says (range and place when parked, power and time when charging).
  const said = new Set(status.charging ? [status.power, status.time] : status.plugged ? [] : [status.place, status.range]);
  const chips: Array<[IconName, string]> = ([
    ["pin", status.range], ["bolt", status.charging ? status.power : null], ["clock", status.charging ? status.time : null], ["home", status.place], ["car", status.odometer],
    [status.locked ? "lock" : "unlock", status.locked == null ? null : status.locked ? t("vehicleLocked") : t("vehicleUnlocked")],
  ] as Array<[IconName, string | null]>).filter((chip): chip is [IconName, string] => Boolean(chip[1]) && !said.has(chip[1]));
  return <>
    <button aria-label={vehicle.name || t("vehicle")} className={`device-tile hd-vehicle${wide ? " hd-vehicle--wide" : ""}${tall ? " hd-vehicle--tall" : ""}${status.charging ? " hd-vehicle--charging" : ""}`} onClick={() => { if (!editing) setOpen(true); }} ref={button} style={style} type="button">
      <span className="hd-vehicle__art">
        <Ring charging={status.charging} level={status.level} size={wide ? 108 : 58} />
        <span className="hd-vehicle__icon"><HDIcon name={iconOf(vehicle)} size={wide ? 30 : 20} /></span>
        {status.charging && <span className="hd-vehicle__bolt"><HDIcon name="bolt" size={wide ? 15 : 11} /></span>}
      </span>
      <span className="hd-vehicle__copy">
        <strong>{vehicle.name || t("vehicle")}</strong>
        <span className="hd-vehicle__level">{status.level != null ? `${Math.round(status.level)}%` : "—"}{status.levelKind === "fuel" && status.level != null ? ` ${t("vehicleFuel").toLowerCase()}` : ""}</span>
        {line && <span className="hd-vehicle__status">{line}</span>}
        {wide && chips.length > 0 && <span className="hd-vehicle__chips">{chips.map(([icon, label]) => <span key={`${icon}${label}`}><HDIcon name={icon} size={13} />{label}</span>)}</span>}
      </span>
    </button>
    {open && button.current?.closest(".app-shell") && createPortal(<VehicleDetails hass={hass} language={language} onClose={() => setOpen(false)} slots={slots} status={status} t={t} vehicle={vehicle} />, button.current.closest(".app-shell")!)}
  </>;
}

const SLOT_LABELS: Record<VehicleSlot, TranslationKey> = {
  battery: "vehicleBattery", fuel: "vehicleFuel", range: "vehicleRange", charging: "vehicleChargingState", plug: "vehiclePlug", power: "vehiclePower",
  time: "vehicleTime", location: "vehicleLocation", lock: "vehicleLock", climate: "vehicleClimate", charge_switch: "vehicleChargeSwitch", odometer: "vehicleOdometer",
};
const SLOT_ICONS: Record<VehicleSlot, IconName> = {
  battery: "battery", fuel: "drop", range: "pin", charging: "bolt", plug: "plug", power: "bolt", time: "clock", location: "home", lock: "lock", climate: "climate", charge_switch: "power", odometer: "car",
};
const SLOT_ORDER: VehicleSlot[] = ["battery", "fuel", "range", "charging", "plug", "power", "time", "location", "lock", "climate", "charge_switch", "odometer"];

/** The details: the level large, every reading (a tap opens its history) and the controls the vehicle has. */
function VehicleDetails({ hass, language, onClose, slots, status, t, vehicle }: { hass: HomeAssistant; language?: string; onClose: () => void; slots: Found; status: VehicleStatus; t: T; vehicle: HomeDeckVehicle }) {
  const [history, setHistory] = useState<string | null>(null);
  useEscape(onClose, !history);
  const show = (slot: VehicleSlot) => {
    const id = slots[slot];
    const state = id ? hass.states[id] : undefined;
    if (!id || !state) return "";
    if (slot === "location") return status.place ?? state.state;
    if (slot === "charging") return status.charging ? t("vehicleCharging") : status.full ? t("vehicleFull") : status.plugged ? t("vehiclePlugged") : t("vehicleNotCharging");
    if (slot === "time") return status.time ?? "—";
    // A lock sensor (binary_sensor) is on when unlocked.
    if (slot === "lock" && domain(id) === "binary_sensor" && ["on", "off"].includes(state.state)) return t(state.state === "off" ? "vehicleLocked" : "vehicleUnlocked");
    if (["lock", "climate", "charge_switch", "plug"].includes(slot)) return state.state === "on" || state.state === "locked" ? t(slot === "lock" ? "vehicleLocked" : "on") : state.state === "unlocked" ? t("vehicleUnlocked") : t(state.state === "off" ? "off" : "unknown");
    const value = number(state);
    return value == null ? state.state : `${new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(value)} ${String(state.attributes.unit_of_measurement ?? "")}`.trim();
  };
  const call = (service: string, id: string, data: Record<string, unknown> = {}) => void hass.callService(domain(id), service, { entity_id: id, ...data }).catch(() => undefined);
  const controls: ReactNode[] = [];
  // The button says what a tap will do: while the car charges (or the switch is on) it stops charging.
  if (slots.charge_switch) { const on = status.charging || hass.states[slots.charge_switch]?.state === "on"; controls.push(<button className={`hd-pill${on ? " hd-pill--on" : ""}`} key="charge" onClick={() => call(on ? "turn_off" : "turn_on", slots.charge_switch!)} type="button"><HDIcon name="bolt" size={16} />{on ? t("vehicleStopCharging") : t("vehicleStartCharging")}</button>); }
  if (slots.lock && domain(slots.lock) === "lock") { const locked = hass.states[slots.lock]?.state === "locked"; controls.push(<button className="hd-pill" key="lock" onClick={() => call(locked ? "unlock" : "lock", slots.lock!)} type="button"><HDIcon name={locked ? "unlock" : "lock"} size={16} />{locked ? t("unlock") : t("lock")}</button>); }
  if (slots.climate) { const off = hass.states[slots.climate]?.state === "off"; controls.push(<button className={`hd-pill${off ? "" : " hd-pill--on"}`} key="climate" onClick={() => call(off ? "turn_on" : "turn_off", slots.climate!)} type="button"><HDIcon name="climate" size={16} />{off ? t("vehicleClimateOn") : t("vehicleClimateOff")}</button>); }
  return <div aria-label={vehicle.name} aria-modal="true" className="hd-sheet-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} role="dialog">
    <section className="hd-sheet hd-vehicle-sheet" style={vehicleStyle(vehicle.color)}>
      <header className="hd-sheet__header"><h2>{vehicle.name || t("vehicle")}</h2><button className="hd-sheet__close" onClick={onClose} type="button">{t("close")}</button></header>
      <div className="hd-vehicle-sheet__hero">
        <span className="hd-vehicle__art"><Ring charging={status.charging} level={status.level} size={132} /><span className="hd-vehicle__icon"><HDIcon name={iconOf(vehicle)} size={36} /></span></span>
        <div><b>{status.level != null ? `${Math.round(status.level)}%` : "—"}</b><span>{statusLine(status, t) || (status.levelKind === "fuel" ? t("vehicleFuel") : t("vehicleBattery"))}</span></div>
      </div>
      {controls.length > 0 && <div className="hd-vehicle-sheet__controls">{controls}</div>}
      <div className="hd-vehicle-sheet__rows">
        {SLOT_ORDER.filter((slot) => slots[slot] && !["charge_switch", "climate"].includes(slot)).map((slot) => <button className="hd-vehicle-sheet__row" key={slot} onClick={() => setHistory(slots[slot]!)} type="button">
          <HDIcon name={SLOT_ICONS[slot]} size={18} /><span>{t(SLOT_LABELS[slot])}</span><b>{show(slot)}</b>
        </button>)}
      </div>
    </section>
    {history && <EntityModal entity={asEntity(hass, history)} hass={hass} language={language} onClose={() => setHistory(null)} t={t} />}
  </div>;
}

/** Devices that look like a vehicle (a tracker and a battery or fuel level) first, then the rest. */
function deviceOptions(hass: HomeAssistant, charger: boolean): Array<{ value: string; label: string }> {
  const devices = hass.devices ?? {};
  const byDevice = new Map<string, string[]>();
  for (const entry of Object.values(hass.entities ?? {})) if (entry.device_id && hass.states[entry.entity_id]) byDevice.set(entry.device_id, [...(byDevice.get(entry.device_id) ?? []), entry.entity_id]);
  const score = (ids: string[]) => {
    const found = detect(hass, ids, charger);
    return charger ? (found.power ? 2 : 0) + (found.charge_switch ? 1 : 0) + (found.charging ? 1 : 0) : (found.location ? 2 : 0) + (found.battery || found.fuel ? 2 : 0) + (found.range ? 1 : 0) + (found.charging ? 1 : 0);
  };
  return [...byDevice.entries()]
    .map(([id, ids]) => ({ id, score: score(ids), label: String(devices[id]?.name_by_user || devices[id]?.name || id) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
    .map((item) => ({ value: item.id, label: [item.label, devices[item.id]?.manufacturer].filter(Boolean).join(" · ") }));
}

/** Entities that could fill a slot: of the right kind, the vehicle's and charger's own first. */
function slotOptions(hass: HomeAssistant, slot: VehicleSlot, own: string[]): string[] {
  const domains: Record<VehicleSlot, string[]> = {
    battery: ["sensor"], fuel: ["sensor"], range: ["sensor"], odometer: ["sensor"], power: ["sensor"], time: ["sensor"],
    charging: ["binary_sensor", "sensor"], plug: ["binary_sensor"], location: ["device_tracker", "person"], lock: ["lock", "binary_sensor"], climate: ["climate", "switch"], charge_switch: ["switch", "input_boolean"],
  };
  const ids = Object.keys(hass.states).filter((id) => domains[slot].includes(domain(id)));
  const mine = new Set(own);
  return ids.sort((a, b) => Number(mine.has(b)) - Number(mine.has(a)) || text(hass, a).localeCompare(text(hass, b)));
}

/** Edit mode: what the vehicle is and where its readings come from. */
export function VehicleSheet({ hass, onChange, onClose, t, vehicle }: { hass: HomeAssistant; onChange: (vehicle: HomeDeckVehicle) => void; onClose: () => void; t: T; vehicle: HomeDeckVehicle }) {
  const [name, setName] = useState(vehicle.name);
  useEffect(() => setName(vehicle.name), [vehicle.name]);
  useEscape(onClose);
  const { slots, auto } = vehicleEntities(hass, vehicle);
  const own = [...deviceEntities(hass, vehicle.device), ...deviceEntities(hass, vehicle.charger)];
  const label = (id: string) => String(hass.states[id]?.attributes.friendly_name ?? id);
  const kind = vehicle.kind ?? "ev";
  const relevant = SLOT_ORDER.filter((slot) => !(kind === "ev" && slot === "fuel") && !(kind === "fuel" && ["battery", "charging", "plug", "power", "time", "charge_switch"].includes(slot)));
  const setSlot = (slot: VehicleSlot, value: string) => {
    const entities = { ...(vehicle.entities ?? {}) };
    if (value === "auto") delete entities[slot]; else entities[slot] = value === "none" ? "" : value;
    onChange({ ...vehicle, entities });
  };
  const chosen = (slot: VehicleSlot) => { const value = vehicle.entities?.[slot]; return value === undefined ? "auto" : value === "" ? "none" : value; };
  return <div aria-label={t("vehicle")} aria-modal="true" className="hd-sheet-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} role="dialog">
    <section className="hd-sheet hd-vehicle-edit">
      <header className="hd-sheet__header"><h2>{t("vehicle")}</h2><button className="hd-sheet__close" onClick={onClose} type="button">{t("close")}</button></header>
      <div className="hd-vehicle-edit__naming">
        <PageIconButton fallback={KIND_ICON[kind]} onPick={(icon) => onChange({ ...vehicle, icon })} t={t} value={vehicle.icon} />
        <input aria-label={t("vehicleName")} maxLength={60} onBlur={() => { if (name.trim() !== vehicle.name) onChange({ ...vehicle, name: name.trim() }); }} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") event.currentTarget.blur(); }} placeholder={t("vehicleName")} value={name} />
      </div>
      <div className="hd-vehicle-edit__row hd-vehicle-edit__row--stack"><span>{t("vehicleKind")}</span><HDSegmented ariaLabel={t("vehicleKind")} onChange={(value) => onChange({ ...vehicle, kind: value as VehicleKind })} options={[{ value: "ev", label: t("vehicleEv") }, { value: "phev", label: t("vehiclePhev") }, { value: "fuel", label: t("vehicleCombustion") }, { value: "moto", label: t("vehicleMoto") }]} value={kind} /></div>
      <div className="hd-vehicle-edit__row"><span>{t("vehicleColor")}</span><div className="hd-vehicle-edit__colors" role="radiogroup" aria-label={t("vehicleColor")}>{VEHICLE_COLORS.map((color) => <button aria-checked={(vehicle.color ?? VEHICLE_COLORS[0]) === color} aria-label={color} key={color} onClick={() => onChange({ ...vehicle, color })} role="radio" style={{ background: color }} type="button" />)}</div></div>
      <div className="hd-vehicle-edit__row"><span>{t("vehicleDevice")}<small>{t("vehicleDeviceHint")}</small></span><HDSelect ariaLabel={t("vehicleDevice")} onChange={(device) => onChange({ ...vehicle, device: device || undefined, name: vehicle.name || (device ? String(hass.devices?.[device]?.name_by_user || hass.devices?.[device]?.name || "") : "") })} options={[{ value: "", label: t("vehicleNoDevice") }, ...deviceOptions(hass, false)]} value={vehicle.device ?? ""} /></div>
      {kind !== "fuel" && <div className="hd-vehicle-edit__row"><span>{t("vehicleCharger")}<small>{t("vehicleChargerHint")}</small></span><HDSelect ariaLabel={t("vehicleCharger")} onChange={(charger) => onChange({ ...vehicle, charger: charger || undefined })} options={[{ value: "", label: t("vehicleNoCharger") }, ...deviceOptions(hass, true)]} value={vehicle.charger ?? ""} /></div>}
      <h3 className="hd-vehicle-edit__title">{t("vehicleReadings")}</h3>
      <p className="hd-vehicle-edit__hint">{t("vehicleReadingsHint")}</p>
      {relevant.map((slot) => <div className="hd-vehicle-edit__row" key={slot}><span><HDIcon name={SLOT_ICONS[slot]} size={16} />{t(SLOT_LABELS[slot])}</span>
        <HDSelect ariaLabel={t(SLOT_LABELS[slot])} onChange={(value) => setSlot(slot, value)} options={[
          { value: "auto", label: auto[slot] ? `${t("automatic")} · ${label(auto[slot]!)}` : `${t("automatic")} · ${t("vehicleNotFound")}` },
          { value: "none", label: t("vehicleNone") },
          ...slotOptions(hass, slot, own).map((id) => ({ value: id, label: label(id) })),
        ]} value={chosen(slot)} />
        {slots[slot] && chosen(slot) !== "none" && <small className="hd-vehicle-edit__now">{hass.states[slots[slot]!]?.state}{hass.states[slots[slot]!]?.attributes.unit_of_measurement ? ` ${String(hass.states[slots[slot]!]?.attributes.unit_of_measurement)}` : ""}</small>}
      </div>)}
    </section>
  </div>;
}
