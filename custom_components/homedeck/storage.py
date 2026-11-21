"""Persistent local storage for HomeDeck."""

from copy import deepcopy
import re
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN, STORAGE_KEY, STORAGE_VERSION
from .models import ENERGY_FIELDS, HomeDeckConfig, default_config

_CONFIG_DATA = "config"
_STORE_DATA = "store"
_ALLOWED_BACKGROUNDS = {
    "adaptive_ember",
    "adaptive_aurora",
    "adaptive_sunset",
    "fixed_night",
    "fixed_ocean",
    "fixed_graphite",
    "adaptive_forest",
    "adaptive_lagoon",
    "adaptive_orchid",
    "adaptive_reef",
    "adaptive_berry",
    "adaptive_glacier",
    "adaptive_citrus",
    "fixed_wine",
    "fixed_plum",
    "fixed_cobalt",
    "fixed_violet",
    "fixed_magenta",
    "fixed_coral",
    "fixed_emerald",
    "fixed_teal",
    "fixed_indigo",
    "fixed_rose",
    "fixed_amber",
    "fixed_lime",
}
_ALLOWED_FORECAST_TYPES = {"daily", "hourly"}
_ALLOWED_VIEW_MODES = {"grid", "sidebar", "list", "focus", "kids", "photo"}
_ALLOWED_KIDS_SCENES = {"sky", "ocean", "space", "candy", "fairy", "road"}
_ALLOWED_PAGE_TYPES = {"favorites", "scenes", "custom", "cameras"}
_MAX_LAYOUTS = 300
_MAX_LAYOUT_ITEMS = 500
_MAX_KEY_LENGTH = 300
_MAX_SECTIONS = 50
_MAX_LIST_ENTITIES = 30
_MAX_NAME_LENGTH = 60
_SCREENSAVER_DELAYS = {30, 60, 120, 180, 300, 600, 900, 1800}


def _unique_strings(value: Any) -> list[str]:
    """Return ordered, unique strings from an arbitrary value."""
    if not isinstance(value, list):
        return []
    result: list[str] = []
    for item in value:
        if isinstance(item, str) and item not in result:
            result.append(item)
    return result


def _normalize_sections(value: Any) -> dict[str, str]:
    """Separator titles by key ("section:<id>")."""
    if not isinstance(value, dict):
        return {}
    return {
        key: title.strip()[:60]
        for key, title in list(value.items())[:_MAX_SECTIONS]
        if isinstance(key, str)
        and key.startswith("section:")
        and len(key) <= _MAX_KEY_LENGTH
        and isinstance(title, str)
        and title.strip()
    }


def _normalize_lists(value: Any) -> dict[str, dict[str, Any]]:
    """List cards by key ("list:<id>"): a title, the entities, their names here, and whether
    their own cards leave the screen."""
    if not isinstance(value, dict):
        return {}
    lists: dict[str, dict[str, Any]] = {}
    for key, item in list(value.items())[:_MAX_SECTIONS]:
        if not isinstance(key, str) or not key.startswith("list:") or len(key) > _MAX_KEY_LENGTH:
            continue
        if not isinstance(item, dict):
            continue
        title = item.get("title")
        entities = [
            entity for entity in _unique_strings(item.get("entities")) if len(entity) <= _MAX_KEY_LENGTH
        ][:_MAX_LIST_ENTITIES]
        clean: dict[str, Any] = {
            "title": title.strip()[:60] if isinstance(title, str) else "",
            "entities": entities,
        }
        names = item.get("names")
        if isinstance(names, dict):
            clean_names = {
                entity: name.strip()[:40]
                for entity, name in names.items()
                if entity in entities and isinstance(name, str) and name.strip()
            }
            if clean_names:
                clean["names"] = clean_names
        if item.get("hide_cards") is True:
            clean["hide_cards"] = True
        lists[key] = clean
    return lists


def _normalize_rooms(value: Any) -> dict[str, dict[str, str]]:
    """Per room: its name in HomeDeck, and the icon and temperature sensor chosen in Edit mode."""
    if not isinstance(value, dict):
        return {}
    rooms: dict[str, dict[str, str]] = {}
    for room_id, options in list(value.items())[:_MAX_LAYOUTS]:
        if not isinstance(room_id, str) or not room_id or len(room_id) > _MAX_KEY_LENGTH or not isinstance(options, dict):
            continue
        clean: dict[str, str] = {}
        name = options.get("name")
        if isinstance(name, str) and name.strip():
            clean["name"] = name.strip()[:_MAX_NAME_LENGTH]
        icon = options.get("icon")
        if isinstance(icon, str) and icon and len(icon) <= 60:
            clean["icon"] = icon
        temperature = options.get("temperature")
        if isinstance(temperature, str) and temperature.startswith("sensor.") and len(temperature) <= _MAX_KEY_LENGTH:
            clean["temperature"] = temperature
        humidity = options.get("humidity")
        if isinstance(humidity, str) and humidity.startswith("sensor.") and len(humidity) <= _MAX_KEY_LENGTH:
            clean["humidity"] = humidity
        if clean:
            rooms[room_id] = clean
    return rooms


def _normalize_names(value: Any) -> dict[str, str]:
    """Device nicknames given in HomeDeck, by entity id."""
    if not isinstance(value, dict):
        return {}
    return {
        entity_id: name.strip()[:_MAX_NAME_LENGTH]
        for entity_id, name in list(value.items())[:_MAX_LAYOUT_ITEMS]
        if isinstance(entity_id, str)
        and "." in entity_id
        and len(entity_id) <= _MAX_KEY_LENGTH
        and isinstance(name, str)
        and name.strip()
    }


_SEASON_IDS = {"christmas", "newyear", "halloween", "valentines", "easter", "carnival", "thanksgiving", "birthdays"}
_SEASON_EFFECTS = {"snow", "sparkle", "halloween", "hearts", "eggs", "confetti", "bunting", "leaves"}
_BADGE_ENTITY = re.compile(r"^[a-z_]+\.[a-z0-9_]+$")
_RULE_CHECKS = ("on", "off", "eq", "neq", "above", "below")
_MAX_RULES = 6
_RULE_TIME = re.compile(r"^([01][0-9]|2[0-3]):[0-5][0-9]$")
_SEASON_DATE = re.compile(r"^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$")


_USER_ID = re.compile(r"^[A-Za-z0-9_-]{1,64}$")
_BIN_COLORS = {"black", "brown", "green", "blue", "yellow", "grey", "red"}


def _normalize_hidden_for(value: Any) -> dict[str, list[str]]:
    """Who a card or room is not shown to: card key to Home Assistant user ids."""
    if not isinstance(value, dict):
        return {}
    result: dict[str, list[str]] = {}
    for key, users in list(value.items())[:_MAX_LAYOUT_ITEMS]:
        if not (isinstance(key, str) and key and len(key) <= _MAX_KEY_LENGTH):
            continue
        clean = [item for item in _unique_strings(users) if _USER_ID.match(item)][:32]
        if clean:
            result[key] = clean
    return result


def _normalize_bins(value: Any) -> list[dict[str, str]]:
    """The waste collection card: up to four bins, each a sensor (or one of its attributes) with a name and a color."""
    if not isinstance(value, list):
        return []
    result: list[dict[str, str]] = []
    for item in value[:4]:
        if not isinstance(item, dict):
            continue
        entity = item.get("entity")
        color = item.get("color")
        name = item.get("name")
        attribute = item.get("attribute")
        clean = {
            "entity": entity if isinstance(entity, str) and _BADGE_ENTITY.match(entity) else "",
            "name": name.strip()[:30] if isinstance(name, str) else "",
            "color": color if color in _BIN_COLORS else "black",
        }
        # The attribute that tells the day, when the sensor's state does not (empty: the state, as before).
        if isinstance(attribute, str) and 0 < len(attribute) <= 64 and attribute.isprintable():
            clean["attribute"] = attribute
        # Calendars: the text an event's title must have (empty: the next event).
        match = item.get("match")
        if isinstance(match, str) and match.strip():
            clean["match"] = match.strip()[:40]
        result.append(clean)
    return result


def _normalize_card_link_names(value: Any) -> dict[str, dict[str, str]]:
    """The name an extra device shows inside a card: card key to entity id to name."""
    if not isinstance(value, dict):
        return {}
    result: dict[str, dict[str, str]] = {}
    for key, names in list(value.items())[:_MAX_LAYOUT_ITEMS]:
        if not (isinstance(key, str) and key and len(key) <= _MAX_KEY_LENGTH and isinstance(names, dict)):
            continue
        clean = {
            entity_id: name.strip()[:40]
            for entity_id, name in list(names.items())[:2]
            if isinstance(entity_id, str) and _BADGE_ENTITY.match(entity_id) and isinstance(name, str) and name.strip()
        }
        if clean:
            result[key] = clean
    return result


def _normalize_room_names(value: Any) -> dict[str, dict[str, str]]:
    """A device's name in one room only: room screen ("room:…") to entity id to name."""
    if not isinstance(value, dict):
        return {}
    result: dict[str, dict[str, str]] = {}
    for key, names in list(value.items())[:_MAX_LAYOUT_ITEMS]:
        if not (isinstance(key, str) and key.startswith("room:") and len(key) <= _MAX_KEY_LENGTH and isinstance(names, dict)):
            continue
        clean = {
            entity_id: name.strip()[:40]
            for entity_id, name in list(names.items())[:_MAX_LAYOUT_ITEMS]
            if isinstance(entity_id, str) and _BADGE_ENTITY.match(entity_id) and isinstance(name, str) and name.strip()
        }
        if clean:
            result[key] = clean
    return result


def _plan_spot_key(key: str) -> bool:
    """A device on the plan: its entity id, or "<room id>|<entity id>" for its spot in one room."""
    room, _, entity = key.rpartition("|")
    return bool(_BADGE_ENTITY.match(entity)) and len(key) <= _MAX_KEY_LENGTH and (not room or len(room) <= 64)


def _plan_rect(rect: Any) -> dict[str, int] | None:
    """A rectangle on the plan's 48 x 32 grid, or None."""
    if not isinstance(rect, dict):
        return None
    numbers = [rect.get(key) for key in ("x", "y", "w", "h")]
    if not all(isinstance(number, int) and not isinstance(number, bool) for number in numbers):
        return None
    x, y, w, h = numbers
    return {"x": x, "y": y, "w": w, "h": h} if 0 <= x <= 47 and 0 <= y <= 31 and 1 <= w <= 48 and 1 <= h <= 32 else None


def _normalize_floorplan(value: Any) -> dict[str, Any]:
    """The floor plan: each room's rectangle on a 48 x 32 grid, each device's spot inside its room
    (0 to 1 across and down) and the devices left off the plan."""
    result: dict[str, Any] = {"rooms": {}, "devices": {}, "hidden": [], "images": {}}
    if not isinstance(value, dict):
        return result
    rooms = value.get("rooms")
    if isinstance(rooms, dict):
        for room_id, rect in list(rooms.items())[:_MAX_LAYOUT_ITEMS]:
            if not (isinstance(room_id, str) and room_id and len(room_id) <= _MAX_KEY_LENGTH and isinstance(rect, dict)):
                continue
            numbers = [rect.get(key) for key in ("x", "y", "w", "h")]
            if not all(isinstance(number, int) and not isinstance(number, bool) for number in numbers):
                continue
            x, y, w, h = numbers
            if 0 <= x <= 47 and 0 <= y <= 31 and 1 <= w <= 48 and 1 <= h <= 32:
                result["rooms"][room_id] = {"x": x, "y": y, "w": w, "h": h}
    devices = value.get("devices")
    if isinstance(devices, dict):
        for entity_id, spot in list(devices.items())[:_MAX_LAYOUT_ITEMS * 4]:
            if not (isinstance(entity_id, str) and _plan_spot_key(entity_id) and isinstance(spot, dict)):
                continue
            x, y = spot.get("x"), spot.get("y")
            if all(isinstance(number, (int, float)) and not isinstance(number, bool) and 0 <= number <= 1 for number in (x, y)):
                result["devices"][entity_id] = {"x": round(float(x), 4), "y": round(float(y), 4)}
    result["hidden"] = [item for item in _unique_strings(value.get("hidden")) if _plan_spot_key(item)][: _MAX_LAYOUT_ITEMS * 4]
    # Rooms that are not a rectangle: extra rectangles joined to the room (an L or a U shape).
    parts = value.get("parts")
    if isinstance(parts, dict):
        clean_parts: dict[str, list[dict[str, int]]] = {}
        for room_id, rects in list(parts.items())[:_MAX_LAYOUT_ITEMS]:
            if not (isinstance(room_id, str) and room_id and len(room_id) <= _MAX_KEY_LENGTH and isinstance(rects, list)):
                continue
            kept = [clean for clean in (_plan_rect(rect) for rect in rects[:4]) if clean]
            if kept:
                clean_parts[room_id] = kept
        if clean_parts:
            result["parts"] = clean_parts
    # Where each room's name sits on the plan (0 to 1 across and down the room), and whether names show.
    labels = value.get("labels")
    if isinstance(labels, dict):
        clean_labels = {}
        for room_id, spot in list(labels.items())[:_MAX_LAYOUT_ITEMS]:
            if not (isinstance(room_id, str) and room_id and len(room_id) <= _MAX_KEY_LENGTH and isinstance(spot, dict)):
                continue
            x, y = spot.get("x"), spot.get("y")
            if all(isinstance(number, (int, float)) and not isinstance(number, bool) and 0 <= number <= 1 for number in (x, y)):
                clean_labels[room_id] = {"x": round(float(x), 4), "y": round(float(y), 4)}
        if clean_labels:
            result["labels"] = clean_labels
    if value.get("show_names") is True:
        result["show_names"] = True
    if value.get("card_image") is False:
        result["card_image"] = False
    first = value.get("first_floor")
    if isinstance(first, str) and first and len(first) <= 64:
        result["first_floor"] = first
    # A background image per floor: an address on this Home Assistant (or https), and how visible it is.
    images = value.get("images")
    result["images"] = {}
    if isinstance(images, dict):
        for floor, image in list(images.items())[:20]:
            if not (isinstance(floor, str) and floor and len(floor) <= 64 and isinstance(image, dict)):
                continue
            src = image.get("src")
            if not (isinstance(src, str) and len(src) <= 400 and (src.startswith("/") or src.startswith("https://"))):
                continue
            opacity = image.get("opacity")
            clean: dict[str, Any] = {"src": src}
            if isinstance(opacity, (int, float)) and not isinstance(opacity, bool) and 0 <= opacity <= 1:
                clean["opacity"] = round(float(opacity), 2)
            result["images"][floor] = clean
    return result


def _normalize_room_photos(value: Any) -> dict[str, dict[str, Any]]:
    """The Photo layout: a picture per room (and "__home__" for Home), where its focus is, whether it
    darkens with the lights off and where its lamp glows."""
    result: dict[str, dict[str, Any]] = {}
    if not isinstance(value, dict):
        return result
    for room, photo in list(value.items())[:100]:
        if not (isinstance(room, str) and room and len(room) <= 64 and isinstance(photo, dict)):
            continue
        src = photo.get("src")
        if not (isinstance(src, str) and len(src) <= 400 and (src.startswith("/") or src.startswith("https://"))):
            continue
        clean: dict[str, Any] = {"src": src}
        focus = photo.get("x")
        if isinstance(focus, (int, float)) and not isinstance(focus, bool) and 0 <= focus <= 100:
            clean["x"] = round(float(focus), 1)
        if isinstance(photo.get("dim"), bool):
            clean["dim"] = photo["dim"]
        glow = photo.get("glow")
        if isinstance(glow, dict):
            gx, gy = glow.get("x"), glow.get("y")
            if all(isinstance(number, (int, float)) and not isinstance(number, bool) and 0 <= number <= 1 for number in (gx, gy)):
                clean["glow"] = {"x": round(float(gx), 3), "y": round(float(gy), 3)}
        result[room] = clean
    return result


def _normalize_card_links(value: Any) -> dict[str, list[str]]:
    """Extra devices shown inside double and large cards: card key to at most two entity ids."""
    if not isinstance(value, dict):
        return {}
    result: dict[str, list[str]] = {}
    for key, ids in list(value.items())[:_MAX_LAYOUT_ITEMS]:
        if not (isinstance(key, str) and key and len(key) <= _MAX_KEY_LENGTH):
            continue
        clean = [item for item in _unique_strings(ids) if _BADGE_ENTITY.match(item)][:2]
        if clean:
            result[key] = clean
    return result


def _normalize_condition(value: Any) -> dict[str, Any] | None:
    """Return the rules for showing a card or notice: a device's state, a time window and weekdays."""
    if not isinstance(value, dict):
        return None
    clean: dict[str, Any] = {}
    rules: list[dict[str, Any]] = []
    raw_rules = value.get("rules")
    if isinstance(raw_rules, list):
        for rule in raw_rules[:_MAX_RULES]:
            if not isinstance(rule, dict):
                continue
            entity = rule.get("entity")
            check = rule.get("is")
            if not (isinstance(entity, str) and "." in entity and len(entity) <= _MAX_KEY_LENGTH and check in _RULE_CHECKS):
                continue
            item: dict[str, Any] = {"entity": entity, "is": check}
            target = rule.get("value")
            if isinstance(target, (int, float)) and not isinstance(target, bool):
                target = str(target)
            if check in ("eq", "neq", "above", "below"):
                if not isinstance(target, str) or not target.strip():
                    continue
                item["value"] = target.strip()[:60]
            rules.append(item)
    # The first version kept one entity on or off; it becomes a rule.
    entity = value.get("entity")
    if not rules and isinstance(entity, str) and "." in entity and len(entity) <= _MAX_KEY_LENGTH:
        rules.append({"entity": entity, "is": "off" if value.get("state") == "off" else "on"})
    if rules:
        clean["rules"] = rules
        if value.get("match") == "any" and len(rules) > 1:
            clean["match"] = "any"
    if value.get("people") in ("home", "away"):
        clean["people"] = value["people"]
    start, end = value.get("from"), value.get("to")
    if isinstance(start, str) and isinstance(end, str) and _RULE_TIME.match(start) and _RULE_TIME.match(end):
        clean["from"] = start
        clean["to"] = end
    days = value.get("days")
    if isinstance(days, list):
        valid = sorted({day for day in days if type(day) is int and 0 <= day <= 6})
        if 0 < len(valid) < 7:
            clean["days"] = valid
    return clean or None


# What a notice can run when tapped: a script, a button, an automation or a scene.
_TAP_RUN_DOMAINS = ("script", "button", "input_button", "automation", "scene")


def _normalize_entity_options(value: Any) -> dict[str, dict[str, Any]]:
    """Per device: its tile icon ("ha" or a HomeDeck icon name) and whether a tap asks to confirm."""
    if not isinstance(value, dict):
        return {}
    result: dict[str, dict[str, Any]] = {}
    for entity_id, options in list(value.items())[:_MAX_LAYOUT_ITEMS]:
        if not (isinstance(entity_id, str) and "." in entity_id and len(entity_id) <= _MAX_KEY_LENGTH and isinstance(options, dict)):
            continue
        clean: dict[str, Any] = {}
        icon = options.get("icon")
        if isinstance(icon, str) and icon and len(icon) <= 32 and all(char.isalnum() or char == "-" for char in icon):
            clean["icon"] = icon
        if options.get("confirm") is True:
            clean["confirm"] = True
        if options.get("child_lock") is True:
            clean["child_lock"] = True
        if options.get("light_accent") is True:
            clean["light_accent"] = True
        for flag in ("not_security", "cover_no_tap", "cover_swap_buttons", "cover_invert_position", "cover_invert_state", "cover_side_buttons", "cover_no_highlight", "cover_no_status", "security_item", "alarm_buttons", "camera_mjpeg", "player_window"):
            if options.get(flag) is True:
                clean[flag] = True
        # Scenes and scripts in the strip: lit while this entity is on.
        highlight = options.get("highlight_entity")
        if isinstance(highlight, str) and _BADGE_ENTITY.match(highlight):
            clean["highlight_entity"] = highlight
        # Media players: parts of the player left out, and the player's own buttons.
        hide = [part for part in _unique_strings(options.get("player_hide")) if part in ("art", "track", "modes", "volume", "sources", "power")]
        if hide:
            clean["player_hide"] = hide
        buttons = [item for item in _unique_strings(options.get("player_buttons")) if _BADGE_ENTITY.match(item)][:24]
        if buttons:
            clean["player_buttons"] = buttons
        # Sensors in a room's top strip: how they look and the text in place of the name.
        if options.get("pill_style") in ("icon", "text"):
            clean["pill_style"] = options["pill_style"]
        pill_text = options.get("pill_text")
        if isinstance(pill_text, str) and pill_text.strip():
            clean["pill_text"] = pill_text.strip()[:40]
        if options.get("cover_control") in ("buttons", "slider"):
            clean["cover_control"] = options["cover_control"]
        when = _normalize_condition(options.get("visible_when"))
        if when:
            clean["visible_when"] = when
        if clean:
            result[entity_id] = clean
    return result


def _normalize_layout(layout: dict[str, Any], folders: bool = True) -> dict[str, Any]:
    """One screen's layout: ordered, hidden and sized item keys, separators, list cards and (not inside a
    folder) folder cards."""
    clean: dict[str, Any] = {
        key: [
            item
            for item in _unique_strings(layout.get(key))
            if len(item) <= _MAX_KEY_LENGTH
        ][:_MAX_LAYOUT_ITEMS]
        for key in ("order", "hidden", "wide", "added", "tall", "small")
    }
    cells = layout.get("cells")
    if isinstance(cells, dict):
        clean_cells = {
            key: size
            for key, size in list(cells.items())[:_MAX_LAYOUT_ITEMS]
            if isinstance(key, str) and len(key) <= _MAX_KEY_LENGTH and size in (4, 6, 8, 9, 16)
        }
        if clean_cells:
            clean["cells"] = clean_cells
    sections = _normalize_sections(layout.get("sections"))
    if sections:
        clean["sections"] = sections
        # Separators that start folded outside Edit mode.
        folded = [key for key in _unique_strings(layout.get("sections_folded")) if key in sections]
        if folded:
            clean["sections_folded"] = folded
    lists = _normalize_lists(layout.get("lists"))
    if lists:
        clean["lists"] = lists
    vehicles = _normalize_vehicles(layout.get("vehicles"))
    if vehicles:
        clean["vehicles"] = vehicles
    if folders:
        folder_cards = _normalize_folders(layout.get("folders"))
        if folder_cards:
            clean["folders"] = folder_cards
    return clean


_VEHICLE_SLOTS = ("battery", "fuel", "range", "charging", "plug", "power", "time", "location", "lock", "climate", "charge_switch", "odometer")
_VEHICLE_KINDS = ("ev", "phev", "fuel", "moto")
_HEX_COLOR = re.compile(r"^#[0-9a-fA-F]{6}$")


def _normalize_vehicles(value: Any) -> dict[str, dict[str, Any]]:
    """Vehicle cards by key ("vehicle:<id>"): a name, a kind, an icon and color, the car's and the
    charger's devices, and the entities chosen by hand ("" leaves a slot out)."""
    if not isinstance(value, dict):
        return {}
    vehicles: dict[str, dict[str, Any]] = {}
    for key, item in list(value.items())[:_MAX_SECTIONS]:
        if not isinstance(key, str) or not key.startswith("vehicle:") or len(key) > _MAX_KEY_LENGTH or not isinstance(item, dict):
            continue
        name = item.get("name")
        clean: dict[str, Any] = {"name": name.strip()[:60] if isinstance(name, str) else ""}
        if item.get("kind") in _VEHICLE_KINDS:
            clean["kind"] = item["kind"]
        for field in ("icon", "device", "charger"):
            text = item.get(field)
            if isinstance(text, str) and text.strip() and len(text) <= 64:
                clean[field] = text.strip()
        color = item.get("color")
        if isinstance(color, str) and _HEX_COLOR.match(color):
            clean["color"] = color.lower()
        entities = item.get("entities")
        if isinstance(entities, dict):
            chosen = {
                slot: entity
                for slot, entity in entities.items()
                if slot in _VEHICLE_SLOTS and isinstance(entity, str) and (entity == "" or (len(entity) <= _MAX_KEY_LENGTH and _BADGE_ENTITY.match(entity)))
            }
            if chosen:
                clean["entities"] = chosen
        vehicles[key] = clean
    return vehicles


def _normalize_folders(value: Any) -> dict[str, dict[str, Any]]:
    """Folder cards by key ("folder:<id>"): a title, an icon, its devices and its own layout (no folders inside)."""
    if not isinstance(value, dict):
        return {}
    folders: dict[str, dict[str, Any]] = {}
    for key, item in list(value.items())[:_MAX_SECTIONS]:
        if not isinstance(key, str) or not key.startswith("folder:") or len(key) > _MAX_KEY_LENGTH:
            continue
        if not isinstance(item, dict):
            continue
        title = item.get("title")
        icon = item.get("icon")
        clean: dict[str, Any] = {
            "title": title.strip()[:60] if isinstance(title, str) else "",
            "entities": [
                entity for entity in _unique_strings(item.get("entities")) if len(entity) <= _MAX_KEY_LENGTH
            ][:_MAX_LAYOUT_ITEMS],
        }
        if isinstance(icon, str) and icon and len(icon) <= 32 and all(char.isalnum() or char == "-" for char in icon):
            clean["icon"] = icon
        layout = item.get("layout")
        if isinstance(layout, dict):
            clean["layout"] = _normalize_layout(layout, folders=False)
        folders[key] = clean
    return folders


def _normalize_layouts(value: Any) -> dict[str, dict[str, Any]]:
    """Return per-screen layouts: ordered, hidden and double-width item keys, and separators."""
    if not isinstance(value, dict):
        return {}
    layouts: dict[str, dict[str, Any]] = {}
    for screen, layout in list(value.items())[:_MAX_LAYOUTS]:
        if not isinstance(screen, str) or not screen or len(screen) > _MAX_KEY_LENGTH:
            continue
        if not isinstance(layout, dict):
            continue
        layouts[screen] = _normalize_layout(layout)
    return layouts


def _normalize_pages(value: Any) -> list[dict[str, Any]]:
    """Return safe user-created page definitions."""
    if not isinstance(value, list):
        return []
    pages: list[dict[str, Any]] = []
    used_ids: set[str] = set()
    for item in value:
        if not isinstance(item, dict):
            continue
        page_id = item.get("id")
        title = item.get("title")
        page_type = item.get("type")
        if (
            not isinstance(page_id, str)
            or not page_id
            or page_id in used_ids
            or not isinstance(title, str)
            or not title.strip()
            or page_type not in _ALLOWED_PAGE_TYPES
        ):
            continue
        used_ids.add(page_id)
        icon = item.get("icon")
        pages.append(
            {
                "id": page_id[:80],
                "title": title.strip()[:80],
                "type": page_type,
                "icon": icon[:40] if isinstance(icon, str) else "grid",
                "entity_ids": _unique_strings(item.get("entity_ids")),
                **({"columns": item["columns"]} if item.get("columns") in (1, 2, 3, 4) else {}),
            }
        )
    return pages


def normalize_config(value: Any) -> HomeDeckConfig:
    """Normalize stored or user-provided configuration."""
    config = default_config()
    if not isinstance(value, dict):
        return config

    config["onboarding_complete"] = bool(value.get("onboarding_complete", False))

    accent_color = value.get("accent_color")
    if isinstance(accent_color, str) and re.fullmatch(r"#[0-9a-fA-F]{6}", accent_color):
        config["accent_color"] = accent_color.lower()

    highlight_color = value.get("highlight_color")
    if isinstance(highlight_color, str) and re.fullmatch(r"#[0-9a-fA-F]{6}", highlight_color):
        config["highlight_color"] = highlight_color.lower()

    locale = value.get("locale")
    if isinstance(locale, str):
        config["locale"] = locale

    config["selected_rooms"] = _unique_strings(value.get("selected_rooms"))
    config["favorites"] = _unique_strings(value.get("favorites"))
    config["free_devices"] = _unique_strings(value.get("free_devices"))[:50]
    config["free_rooms"] = _unique_strings(value.get("free_rooms"))[:50]
    if value.get("view_mode") in _ALLOWED_VIEW_MODES:
        config["view_mode"] = value["view_mode"]
    # The background of the Kids layout (its own, so the regular one is kept for the other layouts).
    if value.get("kids_background") in _ALLOWED_KIDS_SCENES:
        config["kids_background"] = value["kids_background"]

    config["rooms"] = _normalize_rooms(value.get("rooms"))
    config["names"] = _normalize_names(value.get("names"))
    config["entity_options"] = _normalize_entity_options(value.get("entity_options"))
    config["card_links"] = _normalize_card_links(value.get("card_links"))
    config["card_link_names"] = _normalize_card_link_names(value.get("card_link_names"))
    config["room_names"] = _normalize_room_names(value.get("room_names"))
    config["floorplan"] = _normalize_floorplan(value.get("floorplan"))
    config["room_photos"] = _normalize_room_photos(value.get("room_photos"))
    config["hidden_for"] = _normalize_hidden_for(value.get("hidden_for"))
    config["bins"] = _normalize_bins(value.get("bins"))
    # The "recently added" sensors of the Recently added card (up to three).
    config["recent_media"] = [
        entity for entity in _unique_strings(value.get("recent_media")) if entity.startswith("sensor.") and len(entity) <= _MAX_KEY_LENGTH
    ][:3]
    if isinstance(value.get("ha_icons"), bool):
        config["ha_icons"] = value["ha_icons"]
    if isinstance(value.get("ha_room_icons"), bool):
        config["ha_room_icons"] = value["ha_room_icons"]
    if isinstance(value.get("room_scenes"), bool):
        config["room_scenes"] = value["room_scenes"]
    if isinstance(value.get("room_sensors"), bool):
        config["room_sensors"] = value["room_sensors"]
    if isinstance(value.get("rooms_by_floor"), bool):
        config["rooms_by_floor"] = value["rooms_by_floor"]

    dashboard = value.get("dashboard")
    if isinstance(dashboard, dict):
        config["dashboard"] = deepcopy(dashboard)

    preferences = value.get("preferences")
    if isinstance(preferences, dict):
        temperature_unit = preferences.get("temperature_unit")
        clock = preferences.get("clock")
        if isinstance(temperature_unit, str):
            config["preferences"]["temperature_unit"] = temperature_unit
        if isinstance(clock, str):
            config["preferences"]["clock"] = clock

    home = value.get("home")
    if isinstance(home, dict):
        for key in ("show_clock", "show_weather", "show_presence", "ha_notifications", "assist_button"):
            if isinstance(home.get(key), bool):
                config["home"][key] = home[key]
        # A sensor of the person's own for the home status (devices on), instead of the light count.
        sensor = home.get("status_sensor")
        config["home"]["status_sensor"] = sensor if isinstance(sensor, str) and _BADGE_ENTITY.match(sensor) and sensor.split(".")[0] in ("sensor", "input_number", "number", "counter", "input_text") else ""
        # The people shown in the header; everyone when the list is empty.
        config["home"]["presence_people"] = [
            item for item in _unique_strings(home.get("presence_people")) if item.startswith("person.") and _BADGE_ENTITY.match(item)
        ][:20]
        # Entities shown as small notices beside the presence avatars (mailbox, doorbell...).
        config["home"]["badges"] = [
            item for item in _unique_strings(home.get("badges")) if _BADGE_ENTITY.match(item)
        ][:12]
        styles = home.get("badge_styles")
        if isinstance(styles, dict):
            config["home"]["badge_styles"] = {
                entity_id: style
                for entity_id, style in styles.items()
                if entity_id in config["home"]["badges"] and style in ("icon", "text")
            }
        rules = home.get("badge_rules")
        if isinstance(rules, dict):
            clean_rules = {entity_id: _normalize_condition(rule) for entity_id, rule in rules.items() if entity_id in config["home"]["badges"]}
            config["home"]["badge_rules"] = {entity_id: rule for entity_id, rule in clean_rules.items() if rule}
        taps = home.get("badge_taps")
        if isinstance(taps, dict):
            clean_taps: dict[str, dict[str, str]] = {}
            for entity_id, tap in taps.items():
                if entity_id not in config["home"]["badges"] or not isinstance(tap, dict):
                    continue
                action = tap.get("action")
                target = tap.get("target")
                if action in ("dismiss", "off"):
                    clean_taps[entity_id] = {"action": action}
                elif action == "run" and isinstance(target, str) and _BADGE_ENTITY.match(target) and target.split(".")[0] in _TAP_RUN_DOMAINS:
                    clean_taps[entity_id] = {"action": "run", "target": target}
            config["home"]["badge_taps"] = clean_taps
        texts = home.get("badge_texts")
        if isinstance(texts, dict):
            config["home"]["badge_texts"] = {
                entity_id: text.strip()[:40]
                for entity_id, text in texts.items()
                if entity_id in config["home"]["badges"] and isinstance(text, str) and text.strip()
            }

    global_actions = value.get("global_actions")
    if isinstance(global_actions, dict):
        for key in ("lights_on", "lights_off"):
            if isinstance(global_actions.get(key), bool):
                config["global_actions"][key] = global_actions[key]

    navigation = value.get("navigation")
    if isinstance(navigation, dict):
        for key in ("rooms", "scenes", "media", "security", "cameras", "plan"):
            if isinstance(navigation.get(key), bool):
                config["navigation"][key] = navigation[key]
        if "order" in navigation:
            config["navigation"]["order"] = _unique_strings(navigation.get("order"))[:60]
        # The floor plan's own name (its tab and its card); empty means the default name.
        # The screen the panel opens on and goes back to when idle (empty: Home).
        start = navigation.get("start")
        if isinstance(start, str) and 0 < len(start) <= _MAX_KEY_LENGTH:
            config["navigation"]["start"] = start
        plan_title = navigation.get("plan_title")
        if isinstance(plan_title, str) and plan_title.strip():
            config["navigation"]["plan_title"] = plan_title.strip()[:30]

    layout = value.get("layout")
    if isinstance(layout, dict):
        featured_room = layout.get("featured_room")
        if isinstance(featured_room, str) or featured_room is None:
            config["layout"]["featured_room"] = featured_room

    background = value.get("background")
    if isinstance(background, dict):
        preset = background.get("preset")
        if isinstance(preset, str) and preset in _ALLOWED_BACKGROUNDS:
            config["background"]["preset"] = preset
        for key in ("animated", "include_devices"):
            if isinstance(background.get(key), bool):
                config["background"][key] = background[key]

    visibility = value.get("visibility")
    if isinstance(visibility, dict):
        for key in (
            "hidden_home_rooms",
            "hidden_home_entities",
            "visible_home_entities",
            "hidden_room_entities",
        ):
            config["visibility"][key] = _unique_strings(visibility.get(key))
        home_cards = visibility.get("home_cards")
        if isinstance(home_cards, dict):
            for key in ("status", "priority", "rooms", "shortcuts", "scenes"):
                if isinstance(home_cards.get(key), bool):
                    config["visibility"]["home_cards"][key] = home_cards[key]

    priority_cards = value.get("priority_cards")
    if isinstance(priority_cards, dict):
        for key in ("security", "climate", "media"):
            if isinstance(priority_cards.get(key), bool):
                config["priority_cards"][key] = priority_cards[key]
        config["priority_cards"]["featured_entity_ids"] = _unique_strings(
            priority_cards.get("featured_entity_ids")
        )

    weather = value.get("weather")
    if isinstance(weather, dict):
        entity_id = weather.get("entity_id")
        forecast_type = weather.get("forecast_type")
        if isinstance(entity_id, str):
            config["weather"]["entity_id"] = entity_id
        if forecast_type in _ALLOWED_FORECAST_TYPES:
            config["weather"]["forecast_type"] = forecast_type
        if weather.get("header_days") in (0, 3, 5):
            config["weather"]["header_days"] = weather["header_days"]
        # Optional outdoor sensors that replace the weather's own temperature and humidity.
        for key in ("outdoor_temperature", "outdoor_humidity", "outdoor_wind", "outdoor_pressure"):
            sensor = weather.get(key)
            if isinstance(sensor, str) and sensor.startswith("sensor.") and len(sensor) <= _MAX_KEY_LENGTH:
                config["weather"][key] = sensor

    config["pages"] = _normalize_pages(value.get("pages"))
    config["layouts"] = _normalize_layouts(value.get("layouts"))

    screensaver = value.get("screensaver")
    if isinstance(screensaver, dict):
        for key in ("enabled", "show_events", "show_tomorrow", "show_todo"):
            if isinstance(screensaver.get(key), bool):
                config["screensaver"][key] = screensaver[key]
        delay = screensaver.get("delay")
        if isinstance(delay, int) and delay in _SCREENSAVER_DELAYS:
            config["screensaver"]["delay"] = delay
        config["screensaver"]["sensors"] = [
            item for item in _unique_strings(screensaver.get("sensors")) if item.startswith("sensor.") and _BADGE_ENTITY.match(item)
        ][:8]
        if screensaver.get("size") in ("normal", "large"):
            config["screensaver"]["size"] = screensaver["size"]

    agenda = value.get("agenda")
    if isinstance(agenda, dict):
        for key in ("show_calendar", "show_todo", "todo_no_date", "today_card"):
            if isinstance(agenda.get(key), bool):
                config["agenda"][key] = agenda[key]
        config["agenda"]["calendars"] = [
            item for item in _unique_strings(agenda.get("calendars")) if item.startswith("calendar.")
        ][:50]
        todo_entity = agenda.get("todo_entity")
        if isinstance(todo_entity, str) and (todo_entity == "" or todo_entity.startswith("todo.")):
            config["agenda"]["todo_entity"] = todo_entity

    cards = value.get("cards")
    if isinstance(cards, dict):
        for key, high in (("corners", 150), ("glass", 100)):
            number = cards.get(key)
            if isinstance(number, (int, float)) and not isinstance(number, bool):
                config["cards"][key] = max(0, min(high, round(number)))
        for key in ("frame", "animations", "sparklines", "players", "sensor_since", "room_power", "shine"):
            if isinstance(cards.get(key), bool):
                config["cards"][key] = cards[key]

    widgets = value.get("widgets")
    if isinstance(widgets, dict):
        for key in ("weather", "sun", "energy", "bins", "plan", "recent"):
            if isinstance(widgets.get(key), bool):
                config["widgets"][key] = widgets[key]

    energy = value.get("energy")
    if isinstance(energy, dict):
        for key in ENERGY_FIELDS:
            entity_id = energy.get(key)
            if isinstance(entity_id, str) and (entity_id == "" or (entity_id.startswith("sensor.") and len(entity_id) <= _MAX_KEY_LENGTH)):
                config["energy"][key] = entity_id

    seasons = value.get("seasons")
    if isinstance(seasons, dict):
        if isinstance(seasons.get("enabled"), bool):
            config["seasons"]["enabled"] = seasons["enabled"]
        config["seasons"]["off"] = [item for item in _unique_strings(seasons.get("off")) if item in _SEASON_IDS]
        custom = []
        for item in seasons.get("custom") if isinstance(seasons.get("custom"), list) else []:
            if not isinstance(item, dict):
                continue
            name, date, effect = item.get("name"), item.get("date"), item.get("effect")
            if isinstance(name, str) and name.strip() and isinstance(date, str) and _SEASON_DATE.match(date) and effect in _SEASON_EFFECTS:
                custom.append({"name": name.strip()[:40], "date": date, "effect": effect})
        config["seasons"]["custom"] = custom[:20]

    if isinstance(value.get("live_cameras"), bool):
        config["live_cameras"] = value["live_cameras"]
    if isinstance(value.get("camera_whole"), bool):
        config["camera_whole"] = value["camera_whole"]
    if value.get("camera_columns") in (1, 2, 3, 4):
        config["camera_columns"] = value["camera_columns"]

    doorbell = value.get("doorbell")
    if isinstance(doorbell, dict):
        if isinstance(doorbell.get("enabled"), bool):
            config["doorbell"]["enabled"] = doorbell["enabled"]
        trigger = doorbell.get("trigger")
        if isinstance(trigger, str) and (trigger == "" or (trigger.split(".")[0] in ("event", "binary_sensor", "input_boolean") and len(trigger) <= _MAX_KEY_LENGTH)):
            config["doorbell"]["trigger"] = trigger
        camera = doorbell.get("camera")
        if isinstance(camera, str) and (camera == "" or (camera.startswith("camera.") and len(camera) <= _MAX_KEY_LENGTH)):
            config["doorbell"]["camera"] = camera
        seconds = doorbell.get("seconds")
        if isinstance(seconds, int) and not isinstance(seconds, bool) and seconds in (30, 60, 120, 300):
            config["doorbell"]["seconds"] = seconds

    return config


def _store(hass: HomeAssistant) -> Store[dict[str, Any]]:
    """Return the HomeDeck store instance."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if _STORE_DATA not in domain_data:
        domain_data[_STORE_DATA] = Store(
            hass,
            STORAGE_VERSION,
            STORAGE_KEY,
            minor_version=0,
        )
    return domain_data[_STORE_DATA]


async def async_load_config(hass: HomeAssistant) -> HomeDeckConfig:
    """Load and cache local configuration."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if _CONFIG_DATA in domain_data:
        return deepcopy(domain_data[_CONFIG_DATA])

    stored = await _store(hass).async_load()
    config = normalize_config(stored)
    domain_data[_CONFIG_DATA] = config
    return deepcopy(config)


async def async_save_config(
    hass: HomeAssistant, value: dict[str, Any]
) -> HomeDeckConfig:
    """Validate, persist and cache local configuration."""
    config = normalize_config(value)
    await _store(hass).async_save(config)
    hass.data.setdefault(DOMAIN, {})[_CONFIG_DATA] = config
    return deepcopy(config)

