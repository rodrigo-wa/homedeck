"""Data models and defaults for HomeDeck."""

from typing import Any, NotRequired, TypedDict


class HomeDeckPreferences(TypedDict):
    """Local display preferences."""

    clock: str
    temperature_unit: str


class HomeDeckHeaderConfig(TypedDict):
    """Visibility of contextual information on Home."""

    show_clock: bool
    show_weather: bool
    show_presence: bool
    # A bell in the header with Home Assistant's own notifications.
    ha_notifications: bool
    # A microphone in the header that opens Home Assistant's Assist.
    assist_button: bool
    # A sensor for the home status (devices on); empty for the built-in light count.
    status_sensor: str
    presence_people: list[str]
    badges: list[str]


class HomeDeckGlobalActionsConfig(TypedDict):
    """Global Home actions exposed by the dashboard."""

    lights_on: bool
    lights_off: bool


class HomeDeckNavigationConfig(TypedDict):
    """Generated navigation visibility and the order of the bottom bar's tabs."""

    rooms: bool
    scenes: bool
    media: bool
    security: bool
    cameras: bool
    # Pro: the floor plan page.
    plan: bool
    plan_title: NotRequired[str]
    order: NotRequired[list[str]]


class HomeDeckLayoutConfig(TypedDict):
    """Home layout preferences."""

    density: str
    featured_room: str | None


class HomeDeckBackgroundConfig(TypedDict):
    """Dynamic wallpaper preferences."""

    preset: str
    animated: bool
    include_devices: bool


class HomeDeckHomeCardsConfig(TypedDict):
    """Visibility of generated Home sections."""

    status: bool
    priority: bool
    rooms: bool
    shortcuts: bool
    scenes: bool


class HomeDeckPriorityConfig(TypedDict):
    """Automatic and user-selected cards shown above the rooms."""

    security: bool
    climate: bool
    media: bool
    featured_entity_ids: list[str]


class HomeDeckVisibilityConfig(TypedDict):
    """Visibility overrides for rooms and entities."""

    hidden_home_rooms: list[str]
    hidden_home_entities: list[str]
    visible_home_entities: list[str]
    hidden_room_entities: list[str]
    home_cards: HomeDeckHomeCardsConfig


class HomeDeckWeatherConfig(TypedDict):
    """Weather source and forecast preferences."""

    entity_id: str
    forecast_type: str


class HomeDeckPage(TypedDict):
    """User-created navigation page."""

    id: str
    title: str
    type: str
    icon: str
    entity_ids: list[str]


class HomeDeckScreenLayout(TypedDict):
    """Order, hidden items, double-width cards and separators of one screen."""

    order: list[str]
    hidden: list[str]
    wide: list[str]
    added: list[str]
    sections: NotRequired[dict[str, str]]


class HomeDeckScreensaverConfig(TypedDict):
    """Clock screensaver shown after a period without touches."""

    enabled: bool
    delay: int
    show_events: bool
    # Tomorrow's events too, below today's.
    show_tomorrow: bool
    show_todo: bool
    # Up to three temperature sensors under the clock, and the size of the clock's text.
    sensors: list[str]
    size: str


class HomeDeckDoorbellConfig(TypedDict):
    """Pro: the camera pops up when the doorbell (an event or a sensor turning on) rings."""

    enabled: bool
    trigger: str
    camera: str
    seconds: int


class HomeDeckAgendaConfig(TypedDict):
    """Calendar and to-do buttons beside the clock on Home."""

    show_calendar: bool
    calendars: list[str]
    show_todo: bool
    todo_entity: str
    todo_no_date: bool
    today_card: bool


class HomeDeckCardStyle(TypedDict):
    """Pro: corners (0-150 % of the default roundness), frame, and glass (0 solid to 100 see-through)."""

    corners: int
    frame: bool
    glass: int
    animations: bool
    sparklines: bool
    players: bool


class HomeDeckWidgets(TypedDict):
    """Optional cards on Home."""

    weather: bool
    sun: bool
    energy: bool
    bins: bool


class HomeDeckConfig(TypedDict):
    """Persisted HomeDeck configuration."""

    version: int
    onboarding_complete: bool
    theme: str
    accent_color: str
    highlight_color: str
    locale: str
    selected_rooms: list[str]
    rooms: dict[str, dict[str, Any]]
    dashboard: dict[str, Any]
    favorites: list[str]
    names: dict[str, str]
    entity_options: dict[str, dict[str, Any]]
    card_links: dict[str, list[str]]
    hidden_for: dict[str, list[str]]
    bins: list[dict[str, str]]
    card_link_names: dict[str, dict[str, str]]
    # A device's name in one room only, when it shows in several: room screen to entity id to name.
    room_names: dict[str, dict[str, str]]
    floorplan: dict[str, Any]
    room_photos: dict[str, Any]
    ha_icons: bool
    ha_room_icons: bool
    # Each room shows its scenes in a strip at the top instead of among its cards.
    room_scenes: bool
    # Each room shows its environment sensors (temperature, humidity, CO2...) at the top.
    room_sensors: bool
    free_devices: list[str]
    free_rooms: list[str]
    view_mode: str
    kids_background: str
    preferences: HomeDeckPreferences
    home: HomeDeckHeaderConfig
    global_actions: HomeDeckGlobalActionsConfig
    navigation: HomeDeckNavigationConfig
    layout: HomeDeckLayoutConfig
    background: HomeDeckBackgroundConfig
    visibility: HomeDeckVisibilityConfig
    priority_cards: HomeDeckPriorityConfig
    weather: HomeDeckWeatherConfig
    pages: list[HomeDeckPage]
    layouts: dict[str, HomeDeckScreenLayout]
    screensaver: HomeDeckScreensaverConfig
    agenda: HomeDeckAgendaConfig
    cards: HomeDeckCardStyle
    widgets: HomeDeckWidgets
    energy: dict[str, str]
    doorbell: HomeDeckDoorbellConfig
    live_cameras: bool
    camera_whole: bool
    camera_columns: int
    seasons: dict[str, Any]


ENERGY_FIELDS = ("consumption", "grid_import", "grid_export", "solar", "battery", "solar_today")


def default_config() -> HomeDeckConfig:
    """Return a fresh default configuration."""
    return {
        "version": 9,
        "onboarding_complete": False,
        "theme": "glass",
        "accent_color": "#f4edd9",
        "highlight_color": "#ffc94d",
        "locale": "auto",
        "selected_rooms": [],
        "rooms": {},
        "dashboard": {},
        "favorites": [],
        "names": {},
        "entity_options": {},
        "card_links": {},
        "hidden_for": {},
        "bins": [],
        "card_link_names": {},
        # Floor plan: room rectangles (grid units), device spots (fractions of their room) and hidden devices.
        "floorplan": {"rooms": {}, "devices": {}, "hidden": [], "images": {}},
        "room_names": {},
        "ha_icons": False,
        "ha_room_icons": False,
        "room_scenes": False,
        "room_sensors": False,
        "rooms_by_floor": False,
        "room_photos": {},
        "free_devices": [],
        "free_rooms": [],
        "view_mode": "grid",
        "kids_background": "sky",
        "preferences": {
            "temperature_unit": "auto",
            "clock": "auto",
        },
        "home": {
            "show_clock": True,
            "show_weather": True,
            "show_presence": True,
            "ha_notifications": False,
            "assist_button": False,
            "status_sensor": "",
            "presence_people": [],
            "badges": [],
        },
        "global_actions": {
            "lights_on": True,
            "lights_off": True,
        },
        "navigation": {
            "rooms": True,
            "scenes": True,
            "media": True,
            "security": True,
            "cameras": False,
            "plan": False,
        },
        "layout": {
            "density": "comfortable",
            "featured_room": None,
        },
        "background": {
            "preset": "adaptive_ember",
            "animated": True,
            "include_devices": True,
        },
        "visibility": {
            "hidden_home_rooms": [],
            "hidden_home_entities": [],
            "visible_home_entities": [],
            "hidden_room_entities": [],
            "home_cards": {
                "status": True,
                "priority": True,
                "rooms": True,
                "shortcuts": True,
                "scenes": True,
            },
        },
        "priority_cards": {
            "security": True,
            "climate": True,
            "media": True,
            "featured_entity_ids": [],
        },
        "weather": {
            "entity_id": "auto",
            "forecast_type": "daily",
        },
        "pages": [],
        "layouts": {},
        "screensaver": {
            "enabled": False,
            "delay": 180,
            "show_events": False,
            "show_tomorrow": False,
            "show_todo": False,
            "sensors": [],
            "size": "normal",
        },
        # Empty calendars means every calendar; an empty to-do entity means the first list.
        "agenda": {
            "show_calendar": True,
            "calendars": [],
            "show_todo": True,
            "todo_entity": "",
            "todo_no_date": False,
            "today_card": False,
        },
        "cards": {
            "corners": 100,
            "frame": True,
            "glass": 50,
            "animations": False,
            "sparklines": False,
            "players": True,
        },
        "widgets": {"weather": False, "sun": False, "energy": False, "bins": False, "plan": False, "recent": False},
        "recent_media": [],
        "energy": {key: "" for key in ENERGY_FIELDS},
        "doorbell": {"enabled": False, "trigger": "", "camera": "", "seconds": 60},
        "live_cameras": True,
        "camera_whole": False,
        "camera_columns": 2,
        "seasons": {"enabled": False, "off": [], "custom": []},
    }

