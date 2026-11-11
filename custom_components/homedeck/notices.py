"""Dismissed header notices, shared by every HomeDeck screen of the home.

A notice dismissed on one tablet goes away on all of them, and comes back by itself as soon as
its entity changes again: each dismissal remembers the entity's `last_changed` at that moment.
"""

from __future__ import annotations

import re
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store

from .const import DOMAIN

SIGNAL_DISMISSED = f"{DOMAIN}_notices_dismissed"
_STORE_KEY = f"{DOMAIN}.notices"
_STORE_VERSION = 1
_DATA = "notices_dismissed"
_STORE = "notices_store"
_MAX = 50
_ENTITY = re.compile(r"^[a-z_]+\.[a-z0-9_]+$")


def _store(hass: HomeAssistant) -> Store[dict[str, Any]]:
    domain_data = hass.data.setdefault(DOMAIN, {})
    if _STORE not in domain_data:
        domain_data[_STORE] = Store(hass, _STORE_VERSION, _STORE_KEY)
    return domain_data[_STORE]


@callback
def _current(hass: HomeAssistant, dismissed: dict[str, str]) -> dict[str, str]:
    """Only the dismissals still in effect: the entity exists and hasn't changed since."""
    result: dict[str, str] = {}
    for entity_id, changed in dismissed.items():
        state = hass.states.get(entity_id)
        if state is not None and state.last_changed.isoformat() == changed:
            result[entity_id] = changed
    return result


async def async_dismissed(hass: HomeAssistant) -> dict[str, str]:
    """Entity id -> the `last_changed` it had when its notice was dismissed."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if _DATA not in domain_data:
        stored = await _store(hass).async_load()
        raw = stored.get("dismissed") if isinstance(stored, dict) else None
        domain_data[_DATA] = {
            key: value
            for key, value in (raw.items() if isinstance(raw, dict) else [])
            if isinstance(key, str) and isinstance(value, str) and _ENTITY.match(key)
        }
    return _current(hass, domain_data[_DATA])


async def async_dismiss(hass: HomeAssistant, entity_id: str) -> dict[str, str]:
    """Dismiss the notice of an entity until it changes again, and tell every open screen."""
    dismissed = await async_dismissed(hass)
    state = hass.states.get(entity_id)
    if state is not None and _ENTITY.match(entity_id):
        dismissed[entity_id] = state.last_changed.isoformat()
        dismissed = dict(list(dismissed.items())[-_MAX:])
    hass.data[DOMAIN][_DATA] = dismissed
    await _store(hass).async_save({"dismissed": dismissed})
    async_dispatcher_send(hass, SIGNAL_DISMISSED, dismissed)
    return dismissed
