import type { DiscoveredEntity } from "./types/discovery";
import { setClockFormat } from "./clock";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { getConfig, saveConfig as persistConfig } from "./api/config";
import { discoverRooms } from "./api/discovery";
import { activateLicense, claimCheckout, getLicense, type LicenseStatus } from "./api/license";
import { HDIcon } from "./components/HDIcon";
import { KeyBar } from "./components/KeyBar";
import { FloorPlan, planTitle } from "./components/FloorPlan";
import { DynamicShell } from "./components/DynamicShell";
import { pageIcon, NavigationDock, orderTabs, type HomeDeckPage } from "./components/NavigationDock";
import { ProSheet } from "./components/ProSheet";
import { FocusLayout } from "./screens/layouts/FocusLayout";
import { ListLayout } from "./screens/layouts/ListLayout";
import { SidebarLayout, type NavLink } from "./screens/layouts/SidebarLayout";
import { PhotoLayout } from "./screens/layouts/PhotoLayout";
import { Screensaver } from "./components/Screensaver";
import { pauseCameras } from "./cameraPause";
import { DoorbellPopup, useDoorbell } from "./components/Doorbell";
import { forgetCalendarColors, useOccasion } from "./components/Agenda";
import { childLocked, childLockNote, deviceBackground, deviceKidsScene, deviceViewMode, editingLocked, keepAwakeMode, useChildLockNote, useDevicePref } from "./devicePrefs";
import { guardHass, type ChildLockState } from "./childLock";
import { VIEW_MODES } from "./components/LayoutPicker";
import { KIDS_SCENES } from "./components/KidsScene";
import { keepAwakeWanted, startKeepAwake } from "./keepAwake";
import { createTranslator } from "./i18n";
import { inDesktopApp, reportLicenseToDesktop, wantsProSheet } from "./desktop";
import { entityKey, getLayout, migrateLayouts, roomScreen, setHidden, withLayout } from "./layout";
import { effectiveConfig, freeDevices, isControllable, overFreeLimits, panelRoomIds, PlanContext, restrictRooms, type PlanState, type UpsellReason } from "./plan";
import { availableSections } from "./security";
import { setStateText } from "./devices";
import { applyAudience, CustomizeContext, personalize, withNickname, withEntityOptions, withRoomOptions } from "./personalize";
import { PageScreen } from "./screens/PageScreen";
import { pageId, type PageRef } from "./screens/pages";
import { HomeScreen } from "./screens/HomeScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { PlanGateScreen } from "./screens/PlanGateScreen";
import { RoomScreen } from "./screens/RoomScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import type { ScreenProps } from "./screens/types";
import type { HomeDeckEntityOptions, HomeDeckConfig, ScreenLayout } from "./types/config";
import type { DiscoveryResponse } from "./types/discovery";
import type { HomeAssistant } from "./types/home-assistant";

const DEFAULT_LIMITS = { rooms: 4, devices: 10 };
/** A minute without a touch brings the panel back to Home. */
const IDLE_HOME_MS = 60_000;

/** The panel's settings with this device's own layout, background and Kids scene, when it has them. */
function onThisDevice(config: HomeDeckConfig, view: string, background: string, kids: string): HomeDeckConfig {
  const mode = VIEW_MODES.find((item) => item.id === view)?.id;
  const scene = KIDS_SCENES.find(([id]) => id === kids)?.[0];
  const preset = /^(adaptive|fixed)_[a-z]+$/.test(background) ? (background as HomeDeckConfig["background"]["preset"]) : undefined;
  if (!mode && !scene && !preset) return config;
  return { ...config, ...(mode ? { view_mode: mode } : {}), ...(scene ? { kids_background: scene } : {}), ...(preset ? { background: { ...config.background, preset } } : {}) };
}

export function App({ hass: haHass, version }: { hass: HomeAssistant; version?: string }) {
  // Every screen gets hass through the child lock, which drops calls to locked devices while it is on.
  const childLock = useRef<ChildLockState>({ locked: false, ids: new Set() });
  const hass = useMemo(() => guardHass(haHass, childLock), [haHass]);
  setStateText(hass);
  const [rawData, setData] = useState<DiscoveryResponse | null>(null);
  const [config, setConfig] = useState<HomeDeckConfig | null>(null);
  const [license, setLicense] = useState<LicenseStatus | null>(null);
  // An integration that predates licenses (not restarted after an update) has no license command.
  const [legacyBackend, setLegacyBackend] = useState(false);
  const [upsellReason, setUpsellReason] = useState<UpsellReason | null>(null);
  const [error, setError] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<HomeDeckConfig | null>(null);
  const [editing, setEditing] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<HomeDeckPage>("home");
  const saveQueue = useRef(Promise.resolve());
  const configRef = useRef<HomeDeckConfig | null>(null);
  const lastActivity = useRef(Date.now());
  const [saverOn, setSaverOn] = useState(false);
  const language = hass.locale?.language ?? hass.language;
  const t = useMemo(() => createTranslator(language), [language]);
  configRef.current = config;
  const pro = license?.plan === "pro" || legacyBackend;
  // Nicknames and room options apply to every screen through the discovery data, and "Who can see" (Pro) too.
  const named = useMemo(() => (rawData ? personalize(rawData, config?.names, config?.rooms, config?.entity_options, config?.ha_icons, config?.layouts, config?.ha_room_icons) : null), [rawData, config?.names, config?.rooms, config?.entity_options, config?.ha_icons, config?.layouts, config?.ha_room_icons]);
  const hiddenFor = pro ? config?.hidden_for : undefined;
  const data = useMemo(() => (named ? applyAudience(named, hiddenFor, hass.user, editing) : null), [named, hiddenFor, hass.user?.id, hass.user?.is_admin, editing]);

  const load = useCallback(async () => {
    setError(false);
    try {
      const [discovery, savedConfig] = await Promise.all([discoverRooms(hass), getConfig(hass)]);
      setData(discovery);
      setConfig(savedConfig);
    } catch {
      setError(true);
    }
    try {
      const status = await getLicense(hass);
      setLicense(status);
      setLegacyBackend(false);
      // A purchase paid while the panel was closed activates on the next load.
      if (status.pending) setLicense(await claimCheckout(hass));
    } catch (err) {
      setLegacyBackend((err as { code?: string })?.code === "unknown_command");
    }
  }, [hass.connection]);

  useEffect(() => { void load(); }, [load]);

  // Areas, devices and entities added or moved in Home Assistant show up without a manual refresh.
  useEffect(() => {
    const { connection } = hass;
    if (!connection.subscribeMessage) return;
    let cancelled = false;
    let timer: number | undefined;
    const unsubscribers: Array<() => void> = [];
    const rediscover = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        void discoverRooms(hass).then((discovery) => { if (!cancelled) setData(discovery); }).catch(() => undefined);
      }, 1500);
    };
    for (const eventType of ["area_registry_updated", "device_registry_updated", "entity_registry_updated"]) {
      const handler = eventType === "entity_registry_updated" ? (event: unknown) => { const data = (event as { data?: { entity_id?: string } })?.data; if (data?.entity_id?.startsWith("calendar.")) forgetCalendarColors(); rediscover(); } : rediscover;
      void connection.subscribeMessage(handler, { type: "subscribe_events", event_type: eventType })
        .then((unsubscribe) => { if (cancelled) unsubscribe(); else unsubscribers.push(unsubscribe); })
        .catch(() => undefined);
    }
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [hass.connection]);

  // HomeDeck Desktop checks the license itself: tell it on load, after every change and twice a day.
  useEffect(() => {
    if (!inDesktopApp() || (!license && !legacyBackend)) return;
    void reportLicenseToDesktop(hass);
    const timer = window.setInterval(() => { void reportLicenseToDesktop(hass); }, 12 * 3600_000);
    return () => window.clearInterval(timer);
  }, [license, legacyBackend, hass.connection]);

  // The desktop app's "Get Pro" opens /homedeck?pro=1 in the browser, straight on the Pro sheet.
  const proLinkShown = useRef(false);
  useEffect(() => {
    if (proLinkShown.current || !license || license.plan === "pro" || !wantsProSheet()) return;
    proLinkShown.current = true;
    setUpsellReason("general");
  }, [license]);

  // Changes apply on screen at once and build on the latest config, so quick successive edits
  // never undo each other; saves run in order. A save refused by the free plan reloads the config.
  const updateConfig = useCallback((update: (current: HomeDeckConfig) => HomeDeckConfig) => {
    const current = configRef.current;
    if (!current) return Promise.resolve();
    const next = update(current);
    configRef.current = next;
    setConfig(next);
    const run = saveQueue.current.then(async () => { await persistConfig(hass, next); });
    saveQueue.current = run.catch(async (err) => {
      if ((err as { code?: string })?.code !== "pro_required") return;
      const saved = await getConfig(hass);
      configRef.current = saved;
      setConfig(saved);
      setUpsellReason("devices");
    });
    return run;
  }, [hass.connection]);
  const saveConfig = useCallback((next: HomeDeckConfig) => updateConfig(() => next), [updateConfig]);

  // One-time move from the 0.3 visibility options to per-screen layouts.
  useEffect(() => {
    if (!config || !data || !config.onboarding_complete) return;
    const migrated = migrateLayouts(config, data);
    if (migrated) void saveConfig(migrated);
  }, [config, data, saveConfig]);

  const limits = license?.limits ?? DEFAULT_LIMITS;
  const allowed = useMemo(() => (pro || !config || !data ? null : new Set(freeDevices(config, data.rooms))), [pro, config, data]);
  // This device's own layout and background (Settings → This device) go over the panel's, before the plan's
  // limits, so Pro layouts and backgrounds still need Pro.
  const devView = useDevicePref(deviceViewMode);
  const devBackground = useDevicePref(deviceBackground);
  const devKids = useDevicePref(deviceKidsScene);
  // Every clock and time follows the chosen format (or the Home Assistant profile's).
  setClockFormat(config?.preferences?.clock, hass.locale?.time_format);
  const view = useMemo(() => (config ? effectiveConfig(onThisDevice(config, devView, devBackground, devKids), pro) : null), [config, pro, devView, devBackground, devKids]);

  const plan = useMemo<PlanState>(() => ({
    pro,
    license,
    limits,
    allowed,
    upsell: (reason = "general") => setUpsellReason(reason),
    allow: (entityId) => {
      if (!allowed || !data) return true;
      const entity = data.rooms.flatMap((room) => room.entities).find((item) => item.entity_id === entityId);
      if (!entity || !isControllable(entity) || allowed.has(entityId)) return true;
      if (allowed.size >= limits.devices) { setUpsellReason("devices"); return false; }
      void updateConfig((current) => ({ ...current, free_devices: [...freeDevices(current, data.rooms), entityId] }));
      return true;
    },
  }), [pro, license, limits, allowed, data, updateConfig]);

  const customize = useMemo(() => {
    const byId = new Map((data?.rooms ?? []).flatMap((room) => room.entities).map((entity) => [entity.entity_id, entity]));
    return {
    // Scenes and scripts often have no area, so discovery never lists them: their options come from the config.
    lookup: (entityId: string) => {
      const found = byId.get(entityId);
      const state = hass.states[entityId];
      if (found || !state) return found;
      const own = config?.entity_options?.[entityId] ?? {};
      return { entity_id: entityId, domain: entityId.split(".")[0], name: config?.names?.[entityId] || String(state.attributes.friendly_name ?? entityId), area_id: "", device_id: null, device_class: null, icon: null,
        ...(own.icon ? { display_icon: own.icon } : {}), ...(own.child_lock ? { child_lock: true } : {}), ...(own.confirm ? { confirm: true } : {}), ...(own.highlight_entity ? { highlight_entity: own.highlight_entity } : {}),
        ...(own.pill_style ? { pill_style: own.pill_style } : {}), ...(own.pill_text ? { pill_text: own.pill_text } : {}), ...(own.player_window ? { player_window: true } : {}), ...(own.player_hide?.length ? { player_hide: own.player_hide } : {}), ...(own.player_buttons?.length ? { player_buttons: own.player_buttons } : {}) } as DiscoveredEntity;
    },
    rename: (entityId: string, name: string, original: string) => void updateConfig((current) => withNickname(current, entityId, name, original)),
    setRoom: (roomId: string, change: { icon?: string; temperature?: string }) => void updateConfig((current) => withRoomOptions(current, roomId, change)),
    setEntity: (entityId: string, change: HomeDeckEntityOptions) => void updateConfig((current) => withEntityOptions(current, entityId, change)),
    rooms: () => data?.rooms ?? [],
    restricted: (itemKey: string) => Boolean(hass.user && hiddenFor?.[itemKey]?.includes(hass.user.id)),
    hiddenFor: (itemKey: string) => config?.hidden_for?.[itemKey] ?? [],
    setHiddenFor: (itemKey: string, userId: string, hidden: boolean) => void updateConfig((current) => {
      const { [itemKey]: previous = [], ...rest } = current.hidden_for ?? {};
      const next = hidden ? [...new Set([...previous, userId])] : previous.filter((id) => id !== userId);
      return { ...current, hidden_for: next.length > 0 ? { ...rest, [itemKey]: next } : rest };
    }),
    linksFor: (itemKey: string) => config?.card_links?.[itemKey] ?? [],
    linkName: (itemKey: string, entityId: string) => config?.card_link_names?.[itemKey]?.[entityId] ?? "",
    setLinkName: (itemKey: string, entityId: string, name: string) => void updateConfig((current) => {
      const { [entityId]: _old, ...names } = current.card_link_names?.[itemKey] ?? {};
      const next = name.trim() ? { ...names, [entityId]: name.trim() } : names;
      const { [itemKey]: _card, ...others } = current.card_link_names ?? {};
      return { ...current, card_link_names: Object.keys(next).length > 0 ? { ...others, [itemKey]: next } : others };
    }),
    roomName: (screen: string, entityId: string) => config?.room_names?.[screen]?.[entityId] ?? "",
    // A device with no area, moved into a room inside HomeDeck: added to that room and hidden where it was.
    moveToRoom: (entityId: string, fromRoomId: string, toRoomId: string) => void updateConfig((current) => {
      const key = entityKey(entityId);
      const target = getLayout(current, roomScreen(toRoomId));
      const withTarget = withLayout(current, roomScreen(toRoomId), { ...setHidden(target, key, false), added: [...new Set([...(target.added ?? []), entityId])] });
      return withLayout(withTarget, roomScreen(fromRoomId), setHidden(getLayout(withTarget, roomScreen(fromRoomId)), key, true));
    }),
    setRoomName: (screen: string, entityId: string, name: string) => void updateConfig((current) => {
      const { [entityId]: _old, ...names } = current.room_names?.[screen] ?? {};
      const next = name.trim() ? { ...names, [entityId]: name.trim() } : names;
      const { [screen]: _room, ...others } = current.room_names ?? {};
      return { ...current, room_names: Object.keys(next).length > 0 ? { ...others, [screen]: next } : others };
    }),
    setLinks: (itemKey: string, ids: string[]) => void updateConfig((current) => {
      const { [itemKey]: _previous, ...rest } = current.card_links ?? {};
      return { ...current, card_links: ids.length > 0 ? { ...rest, [itemKey]: ids } : rest };
    }),
    };
  }, [data, updateConfig, config?.card_links, config?.card_link_names, config?.room_names, config?.hidden_for, config?.entity_options, config?.names, hiddenFor, hass.user?.id]);

  useEffect(() => { pauseCameras("screensaver", saverOn); }, [saverOn]);

  // Screensaver: any touch, click, scroll or key counts as activity.
  const saver = view?.screensaver;
  useEffect(() => {
    const touch = () => { lastActivity.current = Date.now(); };
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((name) => window.addEventListener(name, touch, { capture: true, passive: true }));
    return () => events.forEach((name) => window.removeEventListener(name, touch, { capture: true }));
  }, []);
  useEffect(() => {
    if (!saver?.enabled || editing || settingsOpen) { setSaverOn(false); return; }
    lastActivity.current = Date.now();
    const timer = window.setInterval(() => {
      if (Date.now() - lastActivity.current >= saver.delay * 1000) setSaverOn(true);
    }, 2_000);
    return () => window.clearInterval(timer);
  }, [saver?.enabled, saver?.delay, editing, settingsOpen]);
  const dismissSaver = useCallback(() => { lastActivity.current = Date.now(); setSaverOn(false); }, []);

  // Doorbell (Pro): a ring wakes the panel and shows the camera above everything.
  const [ringing, setRinging] = useState(false);
  // A wall tablet can lock editing: no Edit button, and Edit mode closes if it was open.
  const childOn = useDevicePref(childLocked);
  // While the child lock is on, editing stays locked too, so the lock cannot be turned off from Settings.
  const locked = useDevicePref(editingLocked) || childOn;
  childLock.current = { locked: childOn, ids: new Set(Object.entries(config?.entity_options ?? {}).filter(([, options]) => options.child_lock).map(([id]) => id)) };
  const lockNote = useChildLockNote();
  // Echo Show and other wall screens: keep the browser open and the display on (per device).
  const awake = useDevicePref(keepAwakeMode);
  useEffect(() => (keepAwakeWanted(awake) ? startKeepAwake() : undefined), [awake]);
  useEffect(() => { if (locked) setEditing(false); }, [locked]);
  useDoorbell(hass, view?.doorbell, useCallback(() => { dismissSaver(); setRinging(true); }, [dismissSaver]));
  const stopRinging = useCallback(() => { lastActivity.current = Date.now(); setRinging(false); }, []);
  // After a minute with nobody touching the panel, it goes back to Home, in any layout. Not while the
  // screensaver, Edit mode, Settings or the doorbell are up, nor on the cameras, the full-screen player or a
  // full-screen camera, which are meant to be watched.
  const probe = useRef<HTMLSpanElement>(null);
  // The start screen chosen in Navigation, while that tab is still on; Home otherwise.
  const startPage = startScreen(view, pro);
  const opened = useRef(false);
  useEffect(() => { if (view && !opened.current) { opened.current = true; if (startPage !== "home") setActivePage(startPage); } }, [view, startPage]);
  const cameraPage = activePage === "cameras" || view?.pages.some((page) => page.id === activePage && page.type === "cameras");
  useEffect(() => {
    if ((activePage === startPage && !selectedRoomId) || editing || settingsOpen || saverOn || ringing || cameraPage) return;
    const timer = window.setInterval(() => {
      if (Date.now() - lastActivity.current < IDLE_HOME_MS) return;
      const root = probe.current?.getRootNode() as Document | ShadowRoot | undefined;
      if (root?.querySelector(".hd-player, .hd-camera, .hd-camera__full, .hd-doorbell")) return;
      setSelectedRoomId(null);
      setActivePage(startPage);
    }, 5_000);
    return () => window.clearInterval(timer);
  }, [activePage, startPage, selectedRoomId, editing, settingsOpen, saverOn, ringing, cameraPage]);

  // Special dates (Pro): the occasion near or happening now, and New Year's fireworks.
  const season = useOccasion(view, hass, t);

  useEffect(() => {
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }, [activePage, settingsOpen, selectedRoomId]);

  const visibleData = useMemo<DiscoveryResponse | null>(() => {
    if (!data || !view) return null;
    const byId = new Map(data.rooms.map((room) => [room.id, room]));
    const selected = panelRoomIds(view, data.rooms, pro).map((roomId) => byId.get(roomId)).filter((room): room is DiscoveryResponse["rooms"][number] => Boolean(room));
    // Automations are never a room's own cards: they show only where they are added (Edit → Add devices),
    // so the rooms look as before for everyone with automations in an area.
    const rooms = restrictRooms(selected, allowed).map((room) => (room.entities.some((entity) => entity.domain === "automation") ? { ...room, entities: room.entities.filter((entity) => entity.domain !== "automation") } : room));
    return {
      ...data,
      rooms,
      counts: {
        rooms: rooms.filter((room) => room.id !== "__unassigned__").length,
        devices: rooms.reduce((total, room) => total + room.device_count, 0),
        entities: rooms.reduce((total, room) => total + room.entities.length, 0),
      },
    };
  }, [view, data, allowed, pro]);

  // Cards that open a page (the floor plan card) ask for it with an event, as they don't hold the navigation.
  useEffect(() => {
    const go = (event: Event) => { const page = (event as CustomEvent<string>).detail; if (typeof page === "string") { setSelectedRoomId(null); setActivePage(page); } };
    window.addEventListener("homedeck-navigate", go);
    return () => window.removeEventListener("homedeck-navigate", go);
  }, []);
  const navigate = useCallback((page: HomeDeckPage) => {
    if (page === "rooms") {
      setSelectedRoomId((current) => current ?? visibleData?.rooms[0]?.id ?? null);
    } else {
      setSelectedRoomId(null);
    }
    setActivePage(page);
  }, [visibleData]);

  const activate = async (key: string) => {
    setLicense(await activateLicense(hass, key));
    setUpsellReason(null);
  };
  const withPlan = (node: ReactNode) => <PlanContext.Provider value={plan}><CustomizeContext.Provider value={customize}>
    {node}
    {upsellReason && <div className="app-shell app-shell--overlay" style={{ "--hd-accent": "#f4edd9" } as CSSProperties}><ProSheet hass={hass} language={language} license={license} onActivate={activate} onClose={() => setUpsellReason(null)} onLicense={setLicense} reason={upsellReason} t={t} /></div>}
  </CustomizeContext.Provider></PlanContext.Provider>;

  if (error) {
    return (
      <main className="screen center-state">
        <span className="center-state__icon"><HDIcon name="close" size={28} /></span>
        <h1>{t("appName")}</h1>
        <p>{t("errorDescription")}</p>
        <button className="primary-button" onClick={() => void load()} type="button"><HDIcon name="refresh" size={18} />{t("refresh")}</button>
      </main>
    );
  }

  if (!data || !config || !view || !visibleData) {
    return (
      <main className="screen center-state">
        <span className="loader-mark"><HDIcon name="home" size={26} /></span>
        <p>{t("loading")}</p>
      </main>
    );
  }

  if (!config.onboarding_complete) {
    return withPlan(<OnboardingScreen config={config} data={data} hass={hass} onComplete={async (next) => { await saveConfig(next); }} t={t} />);
  }

  // Free plan over its limits (after setup, an update or a removed license): pick what stays, or go Pro.
  if (!pro && overFreeLimits(config, data.rooms, limits)) {
    return withPlan(<DynamicShell config={view} data={visibleData} hass={hass}>
      <PlanGateScreen config={config} language={language} onSave={async (next) => { await saveConfig(next); }} rooms={data.rooms} t={t} />
    </DynamicShell>);
  }

  if (settingsOpen) {
    // The settings preview the real panel background, lit by the same lights as Home.
    const shellConfig = effectiveConfig(draft ?? config, pro);
    const previewRooms = panelRoomIds(draft ?? config, data.rooms, pro).map((id) => data.rooms.find((room) => room.id === id)).filter((room): room is DiscoveryResponse["rooms"][number] => Boolean(room));
    return withPlan(
      <DynamicShell config={shellConfig} data={draft ? { ...data, rooms: restrictRooms(previewRooms, allowed) } : visibleData} hass={hass}>
        <SettingsScreen
          config={config}
          hass={hass}
          language={language}
          onClose={() => { setSettingsOpen(false); setDraft(null); }}
          onDraft={setDraft}
          onLicense={setLicense}
          onReload={() => void load()}
          onSave={async (next) => { await saveConfig(next); }}
          rooms={data.rooms}
          t={t}
          version={version}
        />
        <KeyBar active hass={hass} label={t("keyBar")} />
      </DynamicShell>,
    );
  }

  const screenProps: ScreenProps = {
    allRooms: restrictRooms(data.rooms, allowed),
    catalogRooms: data.rooms,
    config: view,
    data: visibleData,
    editing,
    hass,
    language,
    onConfig: (update) => void updateConfig(update),
    onLayout: (screen: string, layout: ScreenLayout) => void updateConfig((current) => withLayout(current, screen, pro ? layout : { ...layout, wide: current.layouts[screen]?.wide ?? [], tall: current.layouts[screen]?.tall ?? [] })),
    onSettings: () => { if (childOn) { childLockNote("hold"); return; } setEditing(false); setSettingsOpen(true); },
    onToggleEdit: () => { if (!locked) setEditing((current) => !current); },
    t,
  };

  const selectedRoom = activePage === "rooms" ? (visibleData.rooms.find((room) => room.id === selectedRoomId) ?? visibleData.rooms[0]) : undefined;
  const customPage = view.pages.find((page) => page.id === activePage);
  const { hasCameras, hasMedia, hasScenes, hasSecurity } = availableSections(visibleData.rooms.flatMap((room) => room.entities));

  // Every screen follows the chosen layout: Home, rooms, Media, Security, Scenes and custom pages.
  const mode = view.view_mode;
  const pageRef: PageRef | null = selectedRoom ? null
    : activePage === "scenes" || activePage === "media" || activePage === "security" || activePage === "cameras" ? { kind: "collection", id: activePage }
    : customPage ? { kind: "custom", page: customPage } : null;
  const links: NavLink[] = orderTabs([
    ...(view.navigation.scenes && hasScenes ? [{ id: "scenes", label: t("scenes"), icon: "scene" as const }] : []),
    ...(view.navigation.media && hasMedia ? [{ id: "media", label: t("media"), icon: "media" as const }] : []),
    ...(view.navigation.security && hasSecurity ? [{ id: "security", label: t("security"), icon: "shield" as const }] : []),
    ...(view.navigation.cameras && hasCameras ? [{ id: "cameras", label: t("camerasTitle"), icon: "camera" as const }] : []),
    ...(view.navigation.plan ? [{ id: "plan", label: planTitle(view, t), icon: "plan" as const }] : []),
    ...view.pages.map((page) => ({ id: page.id, label: page.title, icon: pageIcon(page) as NavLink["icon"] })),
  ], view.navigation.order);
  const openRoom = (roomId: string | null) => { setSelectedRoomId(roomId); setActivePage(roomId ? "rooms" : "home"); };

  // The floor plan (Pro) is its own screen in every layout; the Sidebar layout shows it beside its menu.
  const planOpen = activePage === "plan" && !selectedRoom && Boolean(view.navigation.plan);
  let screen;
  if (mode === "photo") screen = <PhotoLayout {...screenProps} activePage={activePage} links={links} onGo={(target, roomId) => { setSelectedRoomId(roomId ?? null); setActivePage(target); }} page={pageRef} plan={planOpen ? <FloorPlan {...screenProps} embedded onOpenRoom={openRoom} /> : undefined} roomId={selectedRoomId} />;
  else if (mode === "sidebar") screen = <SidebarLayout {...screenProps} custom={planOpen ? <FloorPlan {...screenProps} embedded onOpenRoom={openRoom} /> : undefined} customId={planOpen ? "plan" : undefined} links={links} onNavigate={navigate} onSelectRoom={openRoom} page={pageRef} roomId={selectedRoom?.id ?? null} />;
  else if (planOpen) screen = <FloorPlan {...screenProps} onOpenRoom={openRoom} />;
  else if (mode === "list") screen = <ListLayout {...screenProps} onSelectRoom={(roomId) => openRoom(roomId)} page={pageRef} roomId={selectedRoom?.id ?? null} />;
  else if (mode === "focus") screen = <FocusLayout {...screenProps} onRoomChange={(roomId) => { setSelectedRoomId(roomId); setActivePage(roomId ? "rooms" : "home"); }} page={pageRef} roomId={selectedRoom?.id ?? null} />;
  else if (selectedRoom) screen = <RoomScreen {...screenProps} onSelectRoom={setSelectedRoomId} room={selectedRoom} />;
  else if (pageRef) screen = <PageScreen key={pageId(pageRef)} {...screenProps} page={pageRef} />;
  else screen = <HomeScreen {...screenProps} onOpenRoom={(roomId) => { setSelectedRoomId(roomId); setActivePage("rooms"); }} />;

  const active = selectedRoom ? "rooms" : customPage || ["scenes", "media", "security", "cameras", "plan"].includes(activePage) ? activePage : "home";

  // A new page fades in (transitions on): the key changes with the page, not with the room inside it, which
  // animates its own content; the Sidebar layout animates its right side itself.
  const pageKey = mode === "sidebar" || mode === "photo" ? mode : selectedRoom ? "rooms" : activePage;
  return withPlan(
    <DynamicShell config={view} data={visibleData} hass={hass} mode={mode} season={season}>
      <Fragment key={pageKey}>{screen}</Fragment>
      {mode !== "sidebar" && mode !== "photo" && <NavigationDock active={active} config={view} editing={editing} hasMedia={hasMedia} hasScenes={hasScenes} hasSecurity={hasSecurity} hasCameras={hasCameras} onNavigate={navigate} onOrder={(order) => void updateConfig((current) => ({ ...current, navigation: { ...current.navigation, order } }))} t={t} />}
      {!locked && <button aria-label={editing ? t("doneEditing") : t("editScreen")} aria-pressed={editing} className={editing ? "edit-fab edit-fab--on" : "edit-fab"} onClick={() => setEditing((current) => !current)} type="button">
        <HDIcon name={editing ? "check" : "pencil"} size={20} />
      </button>}
      <KeyBar active hass={hass} label={t("keyBar")} />
      <span hidden ref={probe} />
      {lockNote && <div className="hd-lock-note" role="status"><HDIcon name="lock" size={16} />{lockNote === "blocked" ? t("childLockBlocked") : childOn ? t("childLockHoldOff") : t("childLockHoldOn")}</div>}
      {saverOn && <Screensaver config={view} hass={hass} language={language} onDismiss={dismissSaver} rooms={data?.rooms} t={t} />}
      {ringing && <DoorbellPopup camera={view.doorbell.camera} hass={hass} onClose={stopRinging} seconds={view.doorbell.seconds} t={t} />}
    </DynamicShell>,
  );
}

/** The screen chosen to open on, when it still exists and is on; Home otherwise. */
function startScreen(view: HomeDeckConfig | null, pro: boolean): HomeDeckPage {
  const start = view?.navigation.start;
  if (!view || !start || start === "home") return "home";
  const nav = view.navigation;
  const tabs: Record<string, boolean> = { rooms: nav.rooms, scenes: nav.scenes, media: nav.media, security: nav.security, cameras: Boolean(nav.cameras), plan: Boolean(nav.plan) && pro };
  if (start in tabs) return tabs[start] ? start as HomeDeckPage : "home";
  return view.pages.some((page) => page.id === start) ? start as HomeDeckPage : "home";
}
