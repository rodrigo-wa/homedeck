import type { HomeDeckCondition } from "./config";

export interface DiscoveredEntity {
  entity_id: string;
  domain: string;
  name: string;
  area_id: string;
  device_id: string | null;
  device_class: string | null;
  icon: string | null;
  platform?: string | null;
  /** Name of the device it belongs to in Home Assistant. */
  device_name?: string | null;
  /** HomeDeck's options for it: the icon on its tile ("ha" or a HomeDeck icon) and tap confirmation. */
  display_icon?: string;
  confirm?: boolean;
  /** Does nothing while the child lock is on (on the devices that use it). */
  child_lock?: boolean;
  /** The card's highlight takes the color of the light while it is on. */
  light_accent?: boolean;
  /** The card only shows while these rules are met. */
  visible_when?: HomeDeckCondition;
  /** Left out of Security: its card, its alerts and its screen. */
  not_security?: boolean;
  /** Covers: a tap on the card body or icon does nothing; only the up, stop and down buttons act. */
  cover_no_tap?: boolean;
  /** Covers that report their position the other way round: the position bar is reversed. */
  cover_invert_position?: boolean;
  /** Covers whose open/closed caption comes the other way round: the caption is reversed. */
  cover_invert_state?: boolean;
  /** Small cover tiles: the up, stop and down buttons stacked on the right, so the tile keeps the height of the others. */
  cover_side_buttons?: boolean;
  /** Covers wired the other way round: the up and down buttons are swapped. */
  cover_swap_buttons?: boolean;
  /** Name in Home Assistant, when a nickname was given in HomeDeck. */
  original_name?: string;
  /** Set on the devices of a room's screen: that screen ("room:…"), for a name used only there. */
  room_screen?: string;
  /** When the room gives it its own name: the name it has everywhere else. */
  global_name?: string;
  /** Hidden from its room in Edit mode: left out of the light counts and of "turn all on/off". */
  hidden?: boolean;
}

export interface Room {
  id: string;
  name: string;
  icon: string | null;
  aliases: string[];
  floor_id: string | null;
  device_count: number;
  entities: DiscoveredEntity[];
  /** Name in Home Assistant, when the room was renamed in HomeDeck. */
  original_name?: string;
  /** Set on the devices of a room's screen: that screen ("room:…"), for a name used only there. */
  room_screen?: string;
  /** When the room gives it its own name: the name it has everywhere else. */
  global_name?: string;
  /** Icon chosen in Edit mode: an HomeDeck icon name, "ha" (the area's icon) or none (from the name). */
  display_icon?: string;
  /** Sensor chosen for the room's temperature; none: the climate device, as before. */
  temperature_entity?: string;
}

export interface DiscoveryResponse {
  version: string;
  rooms: Room[];
  counts: {
    rooms: number;
    devices: number;
    entities: number;
  };
}

