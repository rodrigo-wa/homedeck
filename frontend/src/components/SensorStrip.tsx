import { useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { arrange, entityKey, getLayout, keyId, setHidden } from "../layout";
import { usePlan } from "../plan";
import type { ScreenProps } from "../screens/types";
import { entityIndex } from "../screens/types";
import type { DiscoveredEntity, Room } from "../types/discovery";
import type { HassEntity, HomeAssistant } from "../types/home-assistant";
import { EditableGrid } from "./EditableGrid";
import { EntityModal } from "./EntityModal";
import { EntityPicker } from "./EntityPicker";
import { EntityIcon } from "./HDIcon";

/** A room's own sensor strip, when environment sensors are shown at the top of each room. */
export const roomSensorsScreen = (roomId: string) => `room-sensors:${roomId}`;

/** Readings that describe the room itself: they go to the strip; power, battery and the rest stay cards. */
const ENVIRONMENT = new Set(["temperature", "humidity", "carbon_dioxide", "carbon_monoxide", "pm25", "pm10", "pm1", "volatile_organic_compounds", "volatile_organic_compounds_parts", "aqi", "illuminance", "atmospheric_pressure", "pressure", "nitrogen_dioxide", "ozone", "sound_pressure"]);

export function isEnvironmentSensor(entity: DiscoveredEntity, hass?: HomeAssistant): boolean {
  return entity.domain === "sensor" && ENVIRONMENT.has(String(entity.device_class ?? hass?.states[entity.entity_id]?.attributes.device_class ?? ""));
}

/** The reading as Home Assistant writes it (number and unit in the user's format), or a fallback. */
function reading(hass: HomeAssistant, state: HassEntity | undefined, language?: string): string {
  if (!state || ["unavailable", "unknown"].includes(state.state)) return "–";
  const format = (hass as unknown as { formatEntityState?: (value: HassEntity) => string }).formatEntityState;
  if (typeof format === "function") { try { return format.call(hass, state); } catch { /* falls back below */ } }
  const value = Number(state.state);
  const unit = state.attributes.unit_of_measurement ? ` ${String(state.attributes.unit_of_measurement)}` : "";
  return Number.isFinite(value) ? `${new Intl.NumberFormat(language, { maximumFractionDigits: 1 }).format(value)}${unit}` : `${state.state}${unit}`;
}

/** Environment sensors of a room, as small pills under its name: icon and reading, a tap opens the
 * details with the history. In edit mode they can be dragged, hidden, or added from elsewhere. */
export function SensorStrip({ props, room }: { props: ScreenProps; room: Room }) {
  const { config, editing, hass, language, onLayout, t } = props;
  const screen = roomSensorsScreen(room.id);
  const [picking, setPicking] = useState(false);
  const [opened, setOpened] = useState<DiscoveredEntity | null>(null);
  const [shell, setShell] = useState<Element | null>(null);
  const placed = useCallback((node: HTMLElement | null) => { if (node) setShell(node.closest(".app-shell")); }, []);
  const plan = usePlan();
  const everywhere = useMemo(() => entityIndex(props.catalogRooms), [props.catalogRooms]);
  const layout = getLayout(config, screen);

  const nativeIds = room.entities.filter((entity) => isEnvironmentSensor(entity, hass)).map((entity) => entity.entity_id);
  const nativeSet = new Set(nativeIds);
  const added = (layout.added ?? []).filter((id) => !nativeSet.has(id) && everywhere.byId.has(id));
  const { visible, hidden } = arrange([...nativeIds, ...added].map(entityKey), layout);
  const shown = visible.map(keyId).filter((id) => hass.states[id]?.state !== "unavailable" || editing);

  const toggle = (id: string) => {
    const key = entityKey(id);
    if (nativeSet.has(id)) onLayout(screen, setHidden(layout, key, shown.includes(id)));
    else if (added.includes(id)) onLayout(screen, { ...layout, added: added.filter((item) => item !== id) });
    else if (plan.allow(id)) onLayout(screen, { ...setHidden(layout, key, false), added: [...added, id] });
  };
  const entityOf = (id: string) => room.entities.find((entity) => entity.entity_id === id) ?? everywhere.byId.get(id);
  const nameOf = (id: string) => entityOf(id)?.name ?? String(hass.states[id]?.attributes.friendly_name ?? id);

  if (shown.length === 0 && !editing) return null;
  return (
    <section className="scene-section sensor-section--room" ref={placed}>
      {/* The room's name already says where these are: the heading only shows while editing. */}
      {editing && <div className="operational-heading"><span>{t("roomSensorsHeading")}</span><i>{shown.length}</i></div>}
      <EditableGrid
        hass={hass}
        addLabel={t("addSensors")}
        className="scene-strip sensor-strip"
        editing={editing}
        hiddenItems={hidden.map((key) => ({ key, label: nameOf(keyId(key)) }))}
        items={shown.map((id) => {
          const entity = entityOf(id);
          const own = config.entity_options?.[id] ?? {};
          const name = own.pill_text || nameOf(id);
          const value = reading(hass, hass.states[id], language);
          return {
            key: entityKey(id),
            label: name,
            removal: nativeSet.has(id) ? "hide" : "remove",
            node: <button aria-label={`${name}: ${value}`} className={own.pill_style ? `sensor-pill--${own.pill_style}` : undefined} onClick={() => entity && setOpened(entity)} title={name} type="button">
              {entity && own.pill_style !== "text" && <EntityIcon entity={entity} size={18} />}<span><b>{value}</b>{own.pill_style !== "icon" && <small>{name}</small>}</span>
            </button>,
          };
        })}
        layout={layout}
        onAdd={() => setPicking(true)}
        onLayout={(next) => onLayout(screen, next)}
        onRemove={(key) => onLayout(screen, { ...layout, added: added.filter((id) => id !== keyId(key)) })}
        sizable={false}
        t={t}
      />
      {picking && <EntityPicker domains={["sensor"]} language={language} onClose={() => setPicking(false)} onToggle={toggle} rooms={props.catalogRooms} selected={shown} t={t} title={t("addSensors")} />}
      {/* Over the whole panel: inside the room header the details would sit under the cards that follow. */}
      {opened && shell && createPortal(<EntityModal entity={opened} hass={hass} language={language} onClose={() => setOpened(null)} roomName={room.name} t={t} />, shell)}
    </section>
  );
}
