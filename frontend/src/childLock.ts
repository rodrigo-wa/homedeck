import { childLockNote } from "./devicePrefs";
import type { HomeAssistant } from "./types/home-assistant";

/** What the child lock knows at the moment of a call: whether it is on and which devices it covers. */
export interface ChildLockState { locked: boolean; ids: Set<string> }

const targets = (value: unknown): string[] => (typeof value === "string" ? [value] : Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);

/**
 * The same hass, with every service call checked against the child lock: calls to a locked device are
 * dropped with a note, and calls to several devices (a room's lights) leave the locked ones out. Checking
 * here covers every way to act on a device: the card, its details, the scene strip, wide controls.
 */
export function guardHass(hass: HomeAssistant, lock: { current: ChildLockState }): HomeAssistant {
  const call = hass.callService.bind(hass) as (...args: unknown[]) => Promise<unknown>;
  return {
    ...hass,
    callService: ((domain: string, service: string, data?: Record<string, unknown>, ...rest: unknown[]) => {
      const { locked, ids } = lock.current;
      if (!locked || ids.size === 0) return call(domain, service, data, ...rest);
      const target = rest[0] as Record<string, unknown> | undefined;
      const inData = targets(data?.entity_id);
      const inTarget = targets(target?.entity_id);
      const blocked = [...inData, ...inTarget].filter((id) => ids.has(id));
      if (blocked.length === 0) return call(domain, service, data, ...rest);
      const freeData = inData.filter((id) => !ids.has(id));
      const freeTarget = inTarget.filter((id) => !ids.has(id));
      childLockNote("blocked");
      if (freeData.length + freeTarget.length === 0) return Promise.resolve(undefined);
      const nextData = inData.length > 0 ? { ...data, entity_id: freeData } : data;
      const nextRest = inTarget.length > 0 ? [{ ...target, entity_id: freeTarget }, ...rest.slice(1)] : rest;
      return call(domain, service, nextData, ...nextRest);
    }) as HomeAssistant["callService"],
  };
}
