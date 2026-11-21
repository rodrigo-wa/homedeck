export type HomeDeckTheme = "glass" | "minimal" | "dark";
export type HomeDeckDensity = "compact" | "comfortable";
export type HomeDeckBackgroundPreset =
  | "adaptive_ember"
  | "adaptive_aurora"
  | "adaptive_sunset"
  | "fixed_night"
  | "fixed_ocean"
  | "fixed_graphite"
  | "adaptive_forest"
  | "adaptive_lagoon"
  | "adaptive_orchid"
  | "adaptive_reef"
  | "adaptive_berry"
  | "adaptive_glacier"
  | "adaptive_citrus"
  | "fixed_wine"
  | "fixed_plum"
  | "fixed_cobalt"
  | "fixed_violet"
  | "fixed_magenta"
  | "fixed_coral"
  | "fixed_emerald"
  | "fixed_teal"
  | "fixed_indigo"
  | "fixed_rose"
  | "fixed_amber"
  | "fixed_lime";

export type HomeDeckViewMode = "grid" | "sidebar" | "list" | "focus" | "kids" | "photo";
/** The animated scenes behind the Kids layout. */
export type HomeDeckKidsScene = "sky" | "ocean" | "space" | "candy" | "fairy" | "road";

export type HomeDeckPageType = "favorites" | "scenes" | "custom" | "cameras";

export interface HomeDeckPageConfig {
  id: string;
  title: string;
  type: HomeDeckPageType;
  icon: string;
  entity_ids: string[];
  /** Camera pages: how many cameras fit side by side (1 to 4). */
  columns?: number;
}

export interface ScreenLayout {
  order: string[];
  hidden: string[];
  wide: string[];
  /** Item keys shown large (two columns and two rows); always also in `wide`. */
  tall?: string[];
  /** Bigger sizes by item: 6 or 8 for camera cards, 4, 9 or 16 cells on a camera page. */
  cells?: Record<string, number>;
  /** Sensor keys shown small (half the height of a normal card). */
  small?: string[];
  /** Entities from other rooms shown on this screen (room screens only). */
  added?: string[];
  /** Separators placed in the order, by key ("section:<id>") with their title. */
  sections?: Record<string, string>;
  /** Separators that start folded outside Edit mode (none by default). */
  sections_folded?: string[];
  /** List cards placed in the order (Pro), by key ("list:<id>"). */
  lists?: Record<string, HomeDeckEntityList>;
  /** Folder cards placed in the order (Pro), by key ("folder:<id>"). */
  folders?: Record<string, HomeDeckFolder>;
  /** Vehicle cards placed in the order (Pro), by key ("vehicle:<id>"). */
  vehicles?: Record<string, HomeDeckVehicle>;
}

/** What a vehicle card reads, each found on its own on the car's (or charger's) device unless chosen. */
export type VehicleSlot = "battery" | "fuel" | "range" | "charging" | "plug" | "power" | "time" | "location" | "lock" | "climate" | "charge_switch" | "odometer";
export type VehicleKind = "ev" | "phev" | "fuel" | "moto";

/** A vehicle card (Pro): a car (or motorbike) with its battery or fuel, charging, range and where it is. */
export interface HomeDeckVehicle {
  name: string;
  kind?: VehicleKind;
  icon?: string;
  /** The card's accent, as a hex color. */
  color?: string;
  /** Home Assistant device of the vehicle and, optionally, of its charger (wallbox or smart plug). */
  device?: string;
  charger?: string;
  /** Entities chosen by hand, by slot; "" leaves that slot out. Missing slots are found on their own. */
  entities?: Partial<Record<VehicleSlot, string>>;
}

/** A card that opens a window with its own cards, arranged like a room (never another folder). */
export interface HomeDeckFolder {
  title: string;
  icon?: string;
  entities: string[];
  layout?: ScreenLayout;
}

/** A card with several entities, one per line, each with its value or control. */
export interface HomeDeckEntityList {
  title: string;
  entities: string[];
  /** The name each entity shows in this list; none means its own name. */
  names?: Record<string, string>;
  /** Its entities leave the other cards of the same screen. */
  hide_cards?: boolean;
}

export interface HomeDeckConfig {
  version: number;
  onboarding_complete: boolean;
  theme: HomeDeckTheme;
  /** Cream surface of lit cards. */
  accent_color: string;
  /** Vivid color for lit icons, light dots, sliders and counters. */
  highlight_color: string;
  locale: string;
  selected_rooms: string[];
  /** Per room (area id): its name in HomeDeck, and the icon and temperature sensor chosen in Edit mode. */
  rooms: Record<string, HomeDeckRoomOptions>;
  /** Nicknames given in HomeDeck, by entity id; Home Assistant keeps its own names. */
  names?: Record<string, string>;
  /** Tiles show the entity's own icon from Home Assistant when it has one (off by default). */
  ha_icons?: boolean;
  /** Rooms use the icon of their area in Home Assistant, when it has one. */
  ha_room_icons?: boolean;
  /** Each room shows its scenes in a strip at the top (like Home's) instead of among its cards. */
  room_scenes?: boolean;
  /** Each room shows its environment sensors (temperature, humidity, CO2...) as pills at the top, out of its cards. */
  room_sensors?: boolean;
  /** The rooms list of the Rooms tab grouped under Home Assistant's floors (off by default). */
  rooms_by_floor?: boolean;
  /** The Photo layout: a picture per room id ("__home__" for Home), sent from the panel. */
  room_photos?: Record<string, HomeDeckRoomPhoto>;
  /** Per device, set in its details: its icon ("ha" or a HomeDeck icon) and whether a tap asks to confirm. */
  entity_options?: Record<string, HomeDeckEntityOptions>;
  /** Extra devices shown inside double and large cards, by card key ("entity:…", "room:…"). */
  card_links?: Record<string, string[]>;
  /** The name each of those devices shows inside that card; none means its own name. */
  card_link_names?: Record<string, Record<string, string>>;
  /** A device's name in one room only (Edit → details → rename, "Only in this room"): room screen to entity id to name. */
  room_names?: Record<string, Record<string, string>>;
  /** Pro floor plan: rooms on a 24 x 16 grid (whole units), device spots inside their room (0–1), devices left off. */
  floorplan?: HomeDeckFloorplan;
  /** Who a card or room is not shown to: card key to Home Assistant user ids. */
  hidden_for?: Record<string, string[]>;
  /** The waste collection card: a sensor, a name and a color for each bin. */
  bins?: HomeDeckBin[];
  dashboard: Record<string, unknown>;
  favorites: string[];
  /** Free plan: the controllable devices chosen to appear (empty = all of the selected rooms, when they fit). */
  free_devices: string[];
  /** Free plan: the rooms chosen to appear (empty = the selection, when it fits). The full selection stays for Pro. */
  free_rooms: string[];
  /** How Home and rooms are laid out. */
  view_mode: HomeDeckViewMode;
  /** Background of the Kids layout (Pro). */
  kids_background?: HomeDeckKidsScene;
  preferences: {
    temperature_unit: string;
    clock: string;
  };
  home: {
    show_clock: boolean;
    show_weather: boolean;
    show_presence: boolean;
    /** A bell in the header with Home Assistant's own notifications (off by default). */
    ha_notifications?: boolean;
    /** A microphone in the header that opens Home Assistant's Assist (off by default). */
    assist_button?: boolean;
    /** A sensor of the person's own for the home status (how many devices are on); empty for the light count. */
    status_sensor?: string;
    /** The people shown in the header (person entities); everyone when empty. */
    presence_people?: string[];
    /** Entities shown as small notices beside the presence avatars, only when there is something to notice. */
    badges?: string[];
    /** How each notice looks; icon and text when not set. */
    badge_styles?: Record<string, "icon" | "text">;
    /** The text to show instead of the entity's name, per entity. */
    badge_texts?: Record<string, string>;
    /** When each notice can show, per entity (Pro). */
    badge_rules?: Record<string, HomeDeckCondition>;
    /** What a tap on each notice does; opens the details when not set. Holding always opens them. */
    badge_taps?: Record<string, HomeDeckNoticeTap>;
  };
  global_actions: {
    lights_on: boolean;
    lights_off: boolean;
  };
  navigation: {
    rooms: boolean;
    scenes: boolean;
    media: boolean;
    security: boolean;
    cameras?: boolean;
    /** Pro: the floor plan page. */
    plan?: boolean;
    /** The floor plan's name, on its tab and its card (default: "Floor plan" / "Home floor plan"). */
    plan_title?: string;
    /** The screen the panel opens on and goes back to after a minute idle: a tab or a page id (empty: Home). */
    start?: string;
    /** Tab ids of the bottom bar in the order arranged in Edit mode (Home always comes first). */
    order?: string[];
  };
  layout: {
    density: HomeDeckDensity;
    featured_room: string | null;
  };
  background: {
    preset: HomeDeckBackgroundPreset;
    animated: boolean;
    include_devices: boolean;
  };
  visibility: {
    hidden_home_rooms: string[];
    hidden_home_entities: string[];
    visible_home_entities: string[];
    hidden_room_entities: string[];
    home_cards: {
      status: boolean;
      priority: boolean;
      rooms: boolean;
      shortcuts: boolean;
      scenes: boolean;
    };
  };
  priority_cards: {
    security: boolean;
    climate: boolean;
    media: boolean;
    featured_entity_ids: string[];
  };
  weather: {
    entity_id: string;
    forecast_type: "daily" | "hourly";
    /** An outdoor sensor that replaces the weather's temperature (header, card, screensaver); none by default. */
    outdoor_temperature?: string;
    /** The same for the humidity. */
    outdoor_humidity?: string;
    /** Wind speed from an own weather station, replacing the weather service's; none by default. */
    outdoor_wind?: string;
    /** Air pressure from an own weather station, replacing the weather service's; none by default. */
    outdoor_pressure?: string;
    /** The next days shown beside the weather in the header: 0 (none, the default), 3 or 5. */
    header_days?: number;
  };
  pages: HomeDeckPageConfig[];
  layouts: Record<string, ScreenLayout>;
  /** Calendar and to-do buttons beside the clock. Empty calendars: all; empty todo_entity: the first list. */
  agenda: {
    show_calendar: boolean;
    calendars: string[];
    show_todo: boolean;
    todo_entity: string;
    todo_no_date: boolean;
    /** A Today card on Home with the day's events and the reminders due. */
    today_card: boolean;
  };
  screensaver: {
    enabled: boolean;
    delay: number;
    /** Under the clock: today's events and the reminders due (same calendars and list as the agenda). */
    show_events?: boolean;
    /** Tomorrow's events too, below today's (off by default). */
    show_tomorrow?: boolean;
    show_todo?: boolean;
    /** Up to eight temperature sensors under the clock, each named by its room. */
    sensors?: string[];
    /** "large" makes the date, weather and temperatures bigger, to read from across the room. */
    size?: "normal" | "large";
  };
  /** Optional cards on Home: the bigger weather card, the sun and (Pro) energy. All off by default. */
  widgets: {
    weather: boolean;
    sun: boolean;
    energy: boolean;
    bins?: boolean;
    /** Pro: a small floor plan on Home that opens the Floor plan page. */
    plan?: boolean;
    /** Pro: covers of the media recently added to a library. */
    recent?: boolean;
  };
  /** The "recently added" sensors of that card (Plex Recently Added, Jellyfin, Sonarr, Radarr...). */
  recent_media?: string[];
  /** Sensors of the energy card; empty fields are left out. */
  energy: HomeDeckEnergy;
  /** Pro: special dates (holidays by the home's country, birthdays from the calendar, own dates). */
  seasons?: { enabled: boolean; off: string[]; custom: Array<{ name: string; date: string; effect: string }> };
  /** Camera cards play their live video while on screen (on by default); off shows a still every 10 s. */
  live_cameras: boolean;
  /** Camera cards show the whole picture instead of filling the card. */
  camera_whole?: boolean;
  camera_columns?: number;
  /** Pro: when the trigger (a doorbell event, or a sensor turning on) fires, the camera pops up. */
  doorbell: {
    enabled: boolean;
    trigger: string;
    camera: string;
    seconds: number;
  };
  /** Pro: how cards look. corners 0-150 (% of the default roundness), glass 0 (solid) to 100 (see-through). */
  cards: HomeDeckCardStyle;
}

export interface HomeDeckRoomOptions {
  /** Name shown in HomeDeck (Settings → Rooms); the area keeps its name in Home Assistant. */
  name?: string;
  icon?: string;
  temperature?: string;
  /** A humidity sensor shown beside the temperature on the room card (none by default). */
  humidity?: string;
}

export interface HomeDeckEntityOptions {
  icon?: string;
  confirm?: boolean;
  /** Does nothing while the child lock is on (on the devices that use it). */
  child_lock?: boolean;
  /** Scenes and scripts in the strip: the button lights up while this entity is on (none by default). */
  highlight_entity?: string;
  /** Sensors in a room's top strip: icon and value only, or value and name only (both by default). */
  pill_style?: "icon" | "text";
  /** Sensors in a room's top strip: the text shown instead of the name. */
  pill_text?: string;
  /** Media players: the player opens as a window over the panel instead of full screen. */
  player_window?: boolean;
  /** Media players: parts of the player and its card left out (art, track, modes, volume, sources, power). */
  player_hide?: string[];
  /** Media players: extra buttons in the player (scripts, scenes, switches, buttons...), in this order. */
  player_buttons?: string[];
  /** While on, the card's highlight takes the color of the light. */
  light_accent?: boolean;
  /** Outside Edit mode, the card only shows while these rules are met. */
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
  /** A binary sensor outside the security classes, added to Security. */
  security_item?: boolean;
  /** Covers: the card never takes the highlighted look. */
  cover_no_highlight?: boolean;
  /** Covers: no open/closed caption on the card (for covers that never report their state). */
  cover_no_status?: boolean;
  /** Covers: "buttons" only or the position "slider" only; both when not set. */
  cover_control?: "buttons" | "slider";
  /** Alarm panels: arm and disarm buttons on the card and on Home's Security card. */
  alarm_buttons?: boolean;
  /** Cameras: MJPEG first, even when the camera offers WebRTC. */
  camera_mjpeg?: boolean;
}

/** A tap that dismisses the notice until it changes, turns its entity off or runs a script, button, automation or scene. */
export interface HomeDeckNoticeTap {
  action: "dismiss" | "off" | "run";
  target?: string;
}

/** One check on an entity: on or off, equal or not to a state, above or below a number. */
export interface HomeDeckEntityRule {
  entity: string;
  is: "on" | "off" | "eq" | "neq" | "above" | "below";
  value?: string;
}

/** When a card or notice shows. Every kind of rule that is set must be met. */
export interface HomeDeckCondition {
  /** Checks on entities; with "any", one of them is enough. */
  rules?: HomeDeckEntityRule[];
  match?: "all" | "any";
  /** Someone home, or nobody home (from the people in Home Assistant). */
  people?: "home" | "away";
  /** The first version: one entity on or off. Still read, written as a rule from now on. */
  entity?: string;
  state?: "on" | "off";
  /** A time window as "HH:MM"; when it ends before it starts, it runs overnight. */
  from?: string;
  to?: string;
  /** Weekdays, 0 is Sunday; none means every day. An overnight window belongs to the day it started. */
  days?: number[];
}

export interface HomeDeckCardStyle {
  corners: number;
  frame: boolean;
  /** Real glass on the cards: a shining top edge, a soft sheen, richer color behind and a light shadow. Off by default. */
  shine?: boolean;
  glass: number;
  /** Lit fans spin, lights glow and washing machines shake while they run. */
  animations?: boolean;
  /** Double and large sensor cards show a small chart of the last 24 hours. */
  sparklines?: boolean;
  /** Every media player (not just Spotify) uses the player card and the full-screen player. On by default. */
  players?: boolean;
  /** Sensor cards at 1x and ½x also show how long ago they changed. */
  sensor_since?: boolean;
  /** The lights button on room cards; on unless set to false. */
  room_power?: boolean;
}

export type HomeDeckBinColor = "black" | "brown" | "green" | "blue" | "yellow" | "grey" | "red";

export interface HomeDeckBin {
  entity: string;
  name: string;
  color: HomeDeckBinColor;
  /** The sensor attribute that tells the day; none means the sensor's state (or its daysTo attribute). */
  attribute?: string;
  /** Calendars: only events whose title has this text ("Paper"); none means the next event. */
  match?: string;
}

export interface HomeDeckEnergy {
  /** Power the home is using now (W or kW). */
  consumption: string;
  /** Power drawn from the grid; when there is no export sensor, negative means exporting. */
  grid_import: string;
  grid_export: string;
  /** Power the solar panels (inverter) produce now. */
  solar: string;
  /** Home battery charge (%). */
  battery: string;
  /** Energy produced today (kWh). */
  solar_today: string;
}


export interface HomeDeckRoomPhoto {
  src: string;
  /** Horizontal focus, 0 (left) to 100 (right); 50 when unset. */
  x?: number;
  /** Darkens while the room's lights are off (on unless false). */
  dim?: boolean;
  /** Where the lamp is, 0 to 1 across and down: a warm glow there while a light is on. */
  glow?: { x: number; y: number };
}

export interface HomeDeckFloorplanRect { x: number; y: number; w: number; h: number }
export interface HomeDeckFloorplan {
  rooms: Record<string, HomeDeckFloorplanRect>;
  devices: Record<string, { x: number; y: number }>;
  hidden: string[];
  /** A background image per floor (the real plan), and how visible it is (0–1). */
  images?: Record<string, { src: string; opacity?: number }>;
  /** Extra rectangles joined to a room, for rooms that are not a rectangle (an L or a U), by room id. */
  parts?: Record<string, HomeDeckFloorplanRect[]>;
  /** Where each room's name sits (0–1 across and down the room), by room id. */
  labels?: Record<string, { x: number; y: number }>;
  /** Room names on the plan outside Edit mode (off by default). */
  show_names?: boolean;
  /** The floor the plan (and its Home card) opens on; the lowest when unset. */
  first_floor?: string;
  /** The background image on the Home card too (on unless false); without it, the card draws the rooms. */
  card_image?: boolean;
}
