import { useContext, useEffect, useMemo, useState } from "react";
import { domainLabel, type TranslationKey } from "../i18n";
import type { DiscoveredEntity, Room } from "../types/discovery";
import { domainIcon, HassContext, HDIcon } from "./HDIcon";
import type { HomeAssistant } from "../types/home-assistant";

interface EntityPickerProps {
  domains?: string[];
  /** Extra rule on top of domains, e.g. only security-related binary sensors. */
  filter?: (entity: DiscoveredEntity) => boolean;
  language?: string;
  onClose: () => void;
  onToggle: (entityId: string) => void;
  rooms: Room[];
  selected: string[];
  t: (key: TranslationKey) => string;
  title?: string;
}

/** Kinds of device for the filter chips; a domain not listed falls under "Other". */
const KINDS: Array<{ id: string; label: TranslationKey; domains: string[] }> = [
  { id: "light", label: "pickerLights", domains: ["light"] },
  { id: "switch", label: "pickerSwitches", domains: ["switch", "input_boolean", "fan", "humidifier", "valve", "siren"] },
  { id: "cover", label: "pickerCovers", domains: ["cover"] },
  { id: "climate", label: "pickerClimate", domains: ["climate", "water_heater"] },
  { id: "media", label: "pickerMedia", domains: ["media_player", "remote"] },
  { id: "security", label: "pickerSecurity", domains: ["lock", "alarm_control_panel", "camera"] },
  { id: "actions", label: "pickerActions", domains: ["scene", "script", "button", "input_button", "automation"] },
  { id: "sensor", label: "pickerSensors", domains: ["sensor", "binary_sensor", "plant", "event"] },
];
const kindOf = (domain: string) => KINDS.find((kind) => kind.domains.includes(domain))?.id ?? "other";

/** The device's state in words, as Home Assistant writes it when it can. */
function stateText(hass: HomeAssistant | null, entityId: string): string {
  const state = hass?.states[entityId];
  if (!state || state.state === "unknown") return "";
  const format = (hass as unknown as { formatEntityState?: (value: typeof state) => string }).formatEntityState;
  if (typeof format === "function") { try { return format.call(hass, state); } catch { /* falls back below */ } }
  const unit = state.attributes.unit_of_measurement;
  return unit ? `${state.state} ${String(unit)}` : state.state;
}

export function EntityPicker({ domains, filter, language, onClose, onToggle, rooms, selected, t, title }: EntityPickerProps) {
  const hass = useContext(HassContext);
  const [query, setQuery] = useState("");
  const [chosenKind, setKind] = useState("all");
  const normalized = query.trim().toLocaleLowerCase();
  // Everything the picker may offer, before the search and the chips.
  const offered = useMemo(() => rooms.map((room) => ({
    room,
    entities: room.entities.filter((entity) => (!domains || domains.includes(entity.domain)) && (!filter || filter(entity))),
  })).filter((group) => group.entities.length > 0), [domains, filter, rooms]);
  const counts = useMemo(() => {
    const result = new Map<string, number>();
    for (const { entities } of offered) for (const entity of entities) result.set(kindOf(entity.domain), (result.get(kindOf(entity.domain)) ?? 0) + 1);
    return result;
  }, [offered]);
  const chips = [...KINDS.filter((item) => counts.has(item.id)).map((item) => ({ id: item.id, label: t(item.label), count: counts.get(item.id)! })), ...(counts.has("other") ? [{ id: "other", label: t("pickerOther"), count: counts.get("other")! }] : [])];
  const chosen = offered.reduce((sum, group) => sum + group.entities.filter((entity) => selected.includes(entity.entity_id)).length, 0);
  // "Selected" with nothing left selected, or a kind the search no longer has, goes back to everything.
  const kind = (chosenKind === "selected" && chosen === 0) || (chosenKind !== "selected" && chosenKind !== "all" && !counts.has(chosenKind)) ? "all" : chosenKind;
  const groups = useMemo(() => offered.map(({ room, entities }) => ({
    room,
    entities: entities.filter((entity) => (kind === "all" || (kind === "selected" ? selected.includes(entity.entity_id) : kindOf(entity.domain) === kind))
      && (!normalized || `${entity.name} ${entity.entity_id} ${room.name}`.toLocaleLowerCase().includes(normalized))),
  })).filter((group) => group.entities.length > 0), [offered, kind, normalized, selected]);
  const total = offered.reduce((sum, group) => sum + group.entities.length, 0);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  return <div aria-label={title ?? t("addDevices")} aria-modal="true" className="hd-sheet-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} role="dialog">
    <section className="hd-sheet hd-picker">
      <header className="hd-sheet__header">
        <div><span className="eyebrow">{chosen > 0 ? t("pickerSelectedCount").replace("{count}", String(chosen)) : t("addItem")}</span><h2>{title ?? t("addDevices")}</h2></div>
        <button className="hd-sheet__close" onClick={onClose} type="button">{t("doneEditing")}</button>
      </header>
      <label className="hd-search"><HDIcon name="search" size={18} /><input autoFocus onChange={(event) => setQuery(event.target.value)} placeholder={t("searchDevices")} type="search" value={query} /></label>
      {(chips.length > 1 || chosen > 0) && <div aria-label={t("pickerKinds")} className="hd-picker__kinds" role="group">
        <button aria-pressed={kind === "all"} onClick={() => setKind("all")} type="button">{t("pickerAll")}<i>{total}</i></button>
        {chosen > 0 && <button aria-pressed={kind === "selected"} onClick={() => setKind("selected")} type="button"><HDIcon name="check" size={14} />{t("pickerSelected")}<i>{chosen}</i></button>}
        {chips.length > 1 && chips.map((chip) => <button aria-pressed={kind === chip.id} key={chip.id} onClick={() => setKind(chip.id)} type="button">{chip.label}<i>{chip.count}</i></button>)}
      </div>}
      <div className="hd-picker__list">
        {groups.length === 0 && <p className="hd-picker__empty">{t("noResults")}</p>}
        {groups.map(({ room, entities }) => <section key={room.id}>
          <span className="eyebrow hd-picker__room">{room.id === "__unassigned__" ? t("unassigned") : room.name}</span>
          <div className="hd-picker__rows">
            {entities.map((entity) => {
              const on = selected.includes(entity.entity_id);
              const status = stateText(hass, entity.entity_id);
              return <button aria-pressed={on} className={on ? "hd-picker__row hd-picker__row--on" : "hd-picker__row"} key={entity.entity_id} onClick={() => onToggle(entity.entity_id)} title={entity.entity_id} type="button">
                <span className="hd-picker__icon"><HDIcon name={domainIcon(entity.domain)} size={18} /></span>
                <span className="hd-picker__copy"><strong>{entity.name}</strong><small>{domainLabel(entity.domain, language)}{status && <> · {status}</>}</small><code>{entity.entity_id}</code></span>
                <span className="hd-picker__check">{on && <HDIcon name="check" size={16} />}</span>
              </button>;
            })}
          </div>
        </section>)}
      </div>
    </section>
  </div>;
}
