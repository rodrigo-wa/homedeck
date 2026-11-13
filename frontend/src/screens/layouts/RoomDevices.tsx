import { useState } from "react";
import type { ReactNode } from "react";
import { EditableGrid } from "../../components/EditableGrid";
import { EntityPicker } from "../../components/EntityPicker";
import { RoomOptions } from "../../components/RoomOptions";
import { HOME_SCREEN, keyId, roomKey, SIDEBAR_SCREEN } from "../../layout";
import type { ScreenLayout } from "../../types/config";
import { usePlan } from "../../plan";
import type { DiscoveredEntity, Room } from "../../types/discovery";
import type { ScreenProps } from "../types";
import { orderedRooms, roomItems, subsetLayout } from "./shared";
import { arrange, compactSensors, entityKey, getLayout, pickerRooms, showItem } from "../../layout";

interface RoomDevicesProps {
  className: string;
  props: ScreenProps;
  render: (entity: DiscoveredEntity) => ReactNode;
  room: Room;
  sizable?: boolean;
}

/** A room's devices in any layout: drag, hide and add in edit mode, saved on the room's screen. */
export function RoomDevices({ className, props, render, room, sizable = false }: RoomDevicesProps) {
  const { allRooms, catalogRooms, config, editing, hass, language, onLayout, t } = props;
  const [picking, setPicking] = useState(false);
  const plan = usePlan();
  const { screen, layout, own, added, byKey, visible, hidden } = roomItems(config, room, allRooms);
  const setAdded = (ids: string[]) => onLayout(screen, { ...layout, added: ids });

  return <>
    {editing && <RoomOptions allRooms={allRooms} compact={sizable ? compactSensors(layout, visible, (next) => onLayout(screen, next)) : undefined} hass={hass} room={room} t={t} />}
    <EditableGrid
      roomScreen={screen}
      hass={hass}
      addLabel={t("addDevices")}
      className={className}
      editing={editing}
      hiddenItems={hidden.map((key) => ({ key, label: byKey.get(key)?.name ?? keyId(key) }))}
      items={visible.map((key) => {
        const entity = byKey.get(key)!;
        return { key, label: entity.name, removal: own.has(entity.entity_id) ? "hide" : "remove", node: render(entity) };
      })}
      layout={layout}
      onAdd={() => setPicking(true)}
      onLayout={(next) => onLayout(screen, next)}
      onRemove={(key) => setAdded(added.filter((id) => id !== keyId(key)))}
      sections
      sizable={sizable}
      t={t}
    />
    {picking && <EntityPicker language={language} onClose={() => setPicking(false)} onToggle={(id) => { if (hidden.includes(entityKey(id))) { if (plan.allow(id)) onLayout(screen, showItem(layout, entityKey(id), visible)); } else if (added.includes(id)) setAdded(added.filter((item) => item !== id)); else if (plan.allow(id)) setAdded([...added, id]); }} rooms={pickerRooms(room, hidden, catalogRooms.filter((item) => item.id !== room.id))} selected={added} t={t} />}
  </>;
}

/** Rooms in any layout: drag and hide in edit mode, saved on Home without moving its other items. */
/** The sidebar's room list, separate from the room cards on Home: its own order and hidden rooms once
 * it has a layout, else Home's (so nothing changes until it is edited). Edits always save to its own. */
export function useSidebarRoomList(props: ScreenProps) {
  const { config, data, onLayout, t } = props;
  const keys = data.rooms.map((room) => roomKey(room.id));
  const byKey = new Map(data.rooms.map((room) => [roomKey(room.id), room]));
  const own = config.layouts?.[SIDEBAR_SCREEN];
  const home = getLayout(config, HOME_SCREEN);
  const isRoom = (key: string) => key.startsWith("room:");
  const layout: ScreenLayout = own ?? { order: home.order.filter(isRoom), hidden: home.hidden.filter(isRoom), wide: [] };
  const { visible, hidden } = arrange(keys, layout);
  return {
    rooms: visible.map((key) => byKey.get(key)!).filter(Boolean),
    layout,
    hiddenItems: hidden.map((key) => ({ key, label: byKey.get(key)?.id === "__unassigned__" ? t("unassigned") : byKey.get(key)?.name ?? keyId(key) })),
    onLayout: (next: ScreenLayout) => onLayout(SIDEBAR_SCREEN, { order: next.order.filter(isRoom), hidden: next.hidden.filter(isRoom), wide: [] }),
  };
}

/** Before the room cards on Home are first changed in the sidebar layout, the sidebar keeps the rooms
 * hidden so far and from then on follows the room order in Settings, so hiding a card no longer hides its room there. */
export function detachSidebar(props: ScreenProps): ScreenProps["onLayout"] {
  const { config, onLayout } = props;
  return (screen, next) => {
    if (screen === HOME_SCREEN && !config.layouts?.[SIDEBAR_SCREEN]) {
      const home = getLayout(config, HOME_SCREEN);
      onLayout(SIDEBAR_SCREEN, { order: [], hidden: home.hidden.filter((key) => key.startsWith("room:")), wide: [] });
    }
    onLayout(screen, next);
  };
}

export function useRoomList(props: ScreenProps) {
  const { config, data, onLayout, t } = props;
  const layout = getLayout(config, HOME_SCREEN);
  const keys = data.rooms.map((room) => roomKey(room.id));
  const byKey = new Map(data.rooms.map((room) => [roomKey(room.id), room]));
  const hidden = arrange(keys, layout).hidden;
  const allKeys = [...new Set([...layout.order, ...keys])];
  return {
    rooms: orderedRooms(config, data.rooms),
    layout,
    hiddenItems: hidden.map((key) => ({ key, label: byKey.get(key)?.id === "__unassigned__" ? t("unassigned") : byKey.get(key)?.name ?? keyId(key) })),
    onLayout: subsetLayout(allKeys, layout, (next) => onLayout(HOME_SCREEN, next)),
  };
}
