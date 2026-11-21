import { isRecentMediaSensor } from "../components/RecentMedia";
import { inDesktopApp } from "../desktop";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { HDIcon, isIconName, RoomIcon, type IconName } from "../components/HDIcon";
import { PageIconPicker } from "../components/RoomOptions";
import { HDSegmented, HDSelect } from "../components/HDSelect";
import { NOTICE_OFF_DOMAINS, NOTICE_RUN_DOMAINS } from "../components/HeaderBadges";
import { domainLabel, type TranslationKey } from "../i18n";
import type { HomeDeckCondition, HomeDeckNoticeTap, HomeDeckBackgroundPreset, HomeDeckBin, HomeDeckBinColor, HomeDeckCardStyle, HomeDeckConfig, HomeDeckPageType } from "../types/config";
import { ConditionFields } from "../components/ConditionFields";
import { DashboardImport } from "../components/DashboardImport";
import { KIDS_SCENES } from "../components/KidsScene";
import { applyImport } from "../dashboardImport";
import { withRoomOptions } from "../personalize";
import { energyCandidates } from "../components/ExtraWidgets";
import { cameraIds, DoorbellPopup, doorbellCandidates, guessDoorbellCamera } from "../components/Doorbell";
import { occasionsFor, RULES, SEASON_EFFECTS, type SeasonEffect } from "../seasons";
import { SeasonPreview } from "../components/SeasonLayer";
import type { Room } from "../types/discovery";
import type { HomeAssistant } from "../types/home-assistant";
import { hideSidebarPreferred, setHideSidebarPreferred } from "../sidebar";
import { setTextScale, setUiSize, textScale, TEXT_SCALE_MAX, TEXT_SCALE_MIN, uiSize, type SizeChoice, childLockEnabled, keyBar, keyBarUnlocked, KEYBAR_SLOTS, setKeyBarUnlocked, motionPrefs, setChildLockEnabled, setKeyBar, setMotionPrefs, deviceBackground, deviceKidsScene, deviceViewMode, editingLocked, keepAwakeMode, setDeviceBackground, setDeviceKidsScene, setDeviceViewMode, setEditingLocked, setKeepAwakeMode, setSpotifySpeaker, spotifySpeaker, useDevicePref } from "../devicePrefs";
import { isSilk } from "../keepAwake";
import { deactivateLicense, getLicense, openPortal, type LicenseStatus } from "../api/license";
import { LICENSE_ERRORS } from "../components/ProSheet";
import { getDefaultPanel, setSystemDefault, setUserDefault, type DefaultPanelState } from "../api/defaultPanel";
import { EntityPicker } from "../components/EntityPicker";
import { FeedbackSheet } from "../components/FeedbackSheet";
import { LayoutPicker, Thumb as LayoutThumb, VIEW_MODES } from "../components/LayoutPicker";
import { OPEN_METEO } from "../weather";
import { DEFAULT_ACCENT, DEFAULT_CARDS, DEFAULT_HIGHLIGHT, FREE_BACKGROUNDS, FREE_VIEW_MODES, freeDevices, freeRoomIds, freeUsage, isControllable, panelRoomIds, desktopUrl, SUPPORT_EMAIL, usePlan } from "../plan";
import { availableSections } from "../security";

type Section = "layout" | "appearance" | "home" | "weather" | "agenda" | "cameras" | "screensaver" | "rooms" | "navigation" | "device" | "plan" | "system";

const SECTIONS: Array<[Section, IconName, TranslationKey]> = [
  ["layout", "layout", "sectionLayout"],
  ["appearance", "palette", "sectionAppearance"],
  ["home", "home", "sectionHome"],
  ["weather", "cloud", "sectionWeather"],
  ["agenda", "calendar", "sectionAgenda"],
  ["cameras", "camera", "camerasTitle"],
  ["screensaver", "clock", "screensaver"],
  ["rooms", "grid", "sectionRooms"],
  ["navigation", "chevron", "sectionNavigation"],
  ["device", "tablet", "sectionDevice"],
  ["plan", "star", "sectionPlan"],
  ["system", "settings", "sectionSystem"],
];
const ACCENTS = ["#f4edd9", "#e8dcc6", "#d9d1bd", "#cad7dc", "#bdccd4", "#c9c2d2", "#d4c3c4", "#c8d2c2", "#b8c1b5", "#b8a99b", "#aeb7c2", "#c2b7a3", "#b8b4c4", "#aebfbb"];
const HIGHLIGHTS = ["#ffc94d", "#f5a524", "#ff9d4d", "#ff7a59", "#ff7a8a", "#f472b6", "#a78bfa", "#7c8cff", "#4fb3ff", "#2fd1b5", "#5fd68a", "#a3e635"];
// The vivid highlight that sits best on each card color.
const SUGGESTED: Record<string, string> = {
  "#f4edd9": "#ffc94d", "#e8dcc6": "#f5a524", "#d9d1bd": "#ffc94d", "#cad7dc": "#4fb3ff", "#bdccd4": "#4fb3ff", "#c9c2d2": "#a78bfa", "#d4c3c4": "#ff7a8a",
  "#c8d2c2": "#5fd68a", "#b8c1b5": "#5fd68a", "#b8a99b": "#ff9d4d", "#aeb7c2": "#7c8cff", "#c2b7a3": "#f5a524", "#b8b4c4": "#a78bfa", "#aebfbb": "#2fd1b5",
};
const BACKGROUNDS: Array<[HomeDeckBackgroundPreset, TranslationKey, string]> = [
  ["adaptive_ember", "backgroundEmber", "linear-gradient(135deg,#263d68,#5e477d 48%,#df8b3d)"],
  ["adaptive_aurora", "backgroundAurora", "linear-gradient(135deg,#173a53,#245d69 48%,#d59c50)"],
  ["adaptive_sunset", "backgroundSunset", "linear-gradient(135deg,#273554,#b4526f 55%,#ef9a62)"],
  ["adaptive_forest", "backgroundForest", "linear-gradient(135deg,#1d3b33,#5f8a62 50%,#d8a24a)"],
  ["adaptive_lagoon", "backgroundLagoon", "linear-gradient(135deg,#14324f,#3f9aa3 50%,#f09a7a)"],
  ["adaptive_orchid", "backgroundOrchid", "linear-gradient(135deg,#2e2352,#a83f8f 55%,#ee6fa8)"],
  ["adaptive_reef", "backgroundReef", "linear-gradient(135deg,#123a5a,#1fa58f 55%,#f0b24a)"],
  ["adaptive_berry", "backgroundBerry", "linear-gradient(135deg,#3a1c40,#c22f4f 55%,#ff7a45)"],
  ["adaptive_glacier", "backgroundGlacier", "linear-gradient(135deg,#1f3553,#4fa6d6 55%,#a8e4f0)"],
  ["adaptive_citrus", "backgroundCitrus", "linear-gradient(135deg,#2a3a24,#c0a21f 55%,#ff9f1c)"],
  ["fixed_night", "backgroundNight", "linear-gradient(135deg,#263d68,#111b38,#090f20)"],
  ["fixed_ocean", "backgroundOcean", "linear-gradient(135deg,#17677a,#0a334d,#051d2b)"],
  ["fixed_graphite", "backgroundGraphite", "linear-gradient(135deg,#3c414d,#1d2027,#0c0e12)"],
  ["fixed_wine", "backgroundWine", "linear-gradient(135deg,#5a1f2e,#2e0f18,#14060a)"],
  ["fixed_plum", "backgroundPlum", "linear-gradient(135deg,#3d2a55,#1e1430,#0d0816)"],
  ["fixed_cobalt", "backgroundCobalt", "linear-gradient(135deg,#4f86ff,#1f4fd8 50%,#12307f)"],
  ["fixed_violet", "backgroundViolet", "linear-gradient(135deg,#a06bff,#6a2fd6 50%,#3d1a86)"],
  ["fixed_magenta", "backgroundMagenta", "linear-gradient(135deg,#f0609f,#c42a7e 50%,#7a1650)"],
  ["fixed_coral", "backgroundCoral", "linear-gradient(135deg,#ff8a62,#e2533f 50%,#94302a)"],
  ["fixed_emerald", "backgroundEmerald", "linear-gradient(135deg,#3fd0a0,#0f9a6e 50%,#0a5e48)"],
  ["fixed_teal", "backgroundTeal", "linear-gradient(135deg,#3fc7dd,#0a93b5 50%,#075a78)"],
  ["fixed_indigo", "backgroundIndigo", "linear-gradient(135deg,#6f74ff,#3b3fd1 50%,#23257f)"],
  ["fixed_rose", "backgroundRose", "linear-gradient(135deg,#ff7da6,#e0447a 50%,#8f2650)"],
  ["fixed_amber", "backgroundAmber", "linear-gradient(135deg,#ffba47,#d98a14 50%,#8a540a)"],
  ["fixed_lime", "backgroundLime", "linear-gradient(135deg,#92cf3f,#5f9e1e 50%,#3a6412)"],
];
const SAVER_DELAYS = [30, 60, 120, 180, 300, 600, 900, 1800];
const PAGE_ICONS: Record<HomeDeckPageType, IconName> = { favorites: "star", scenes: "scene", cameras: "camera", custom: "grid" };

interface SettingsScreenProps {
  config: HomeDeckConfig;
  hass: HomeAssistant;
  onClose: () => void;
  /** Live preview of appearance changes on the real panel background. */
  onDraft: (config: HomeDeckConfig | null) => void;
  onReload: () => void;
  language?: string;
  onLicense: (license: LicenseStatus) => void;
  onSave: (config: HomeDeckConfig) => Promise<void>;
  rooms: Room[];
  t: (key: TranslationKey) => string;
  version?: string;
}

function Row({ children, description, label }: { children: ReactNode; description?: string; label: string }) {
  return <div className="st-row"><span><b>{label}</b>{description && <small>{description}</small>}</span>{children}</div>;
}

function Switch({ checked, label, onChange }: { checked: boolean; label: string; onChange: (checked: boolean) => void }) {
  return <input aria-label={label} checked={checked} className="st-switch" onChange={(event) => onChange(event.target.checked)} type="checkbox" />;
}

export function SettingsScreen({ config, hass, language, onClose, onDraft, onLicense, onReload, onSave, rooms, t, version }: SettingsScreenProps) {
  const plan = usePlan();
  const devView = useDevicePref(deviceViewMode);
  const devBackground = useDevicePref(deviceBackground);
  const [managing, setManaging] = useState(false);
  const [iconPage, setIconPage] = useState<string | null>(null);
  // The shell the import sheet opens over: rendered there, not inside the panel, so it centers on the screen.
  const [importing, setImporting] = useState<Element | null>(null);
  const [imported, setImported] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [hideHaSidebar, setHideHaSidebar] = useState(hideSidebarPreferred);
  // Pro-only options stay visible with a lock; choosing one opens the Pro sheet.
  const locked = (condition: boolean) => !plan.pro && condition;
  const Lock = () => <span className="st-lock" aria-hidden="true"><HDIcon name="lock" size={11} /></span>;
  const [section, setSection] = useState<Section>("layout");
  // On a phone the menu is a sideways strip: keep the chosen section in view.
  const sectionList = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const list = sectionList.current;
    const active = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (list && active && list.scrollWidth > list.clientWidth) list.scrollTo({ left: active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2, behavior: "smooth" });
  }, [section]);
  // An empty room list means "every room"; spell it out so the list can be edited, without counting as a change.
  const [initial] = useState<HomeDeckConfig>(() => ({
    ...config,
    selected_rooms: config.selected_rooms.length > 0 ? config.selected_rooms.filter((id) => rooms.some((room) => room.id === id)) : rooms.map((room) => room.id),
  }));
  const [draft, setDraft] = useState<HomeDeckConfig>(initial);
  const [saving, setSaving] = useState(false);
  // Every weather service, including those that are down, so a broken one can be seen and replaced.
  const weatherEntities = useMemo(() => Object.values(hass.states).filter((state) => state.entity_id.startsWith("weather.")), [hass.states]);

  useEffect(() => { onDraft(draft); }, [draft]);
  useEffect(() => () => onDraft(null), []);
  // Opening the plan shows renewals, cancellations and refunds right away, not after the weekly check.
  useEffect(() => { if (section === "plan" && plan.license?.manage) void getLicense(hass, true).then(onLicense).catch(() => undefined); }, [section]);

  const update = (patch: Partial<HomeDeckConfig>) => setDraft((current) => ({ ...current, ...patch }));
  // The highlight follows the card color while it is still the suggested pairing.
  const setCardColor = (color: string) => setDraft((current) => ({
    ...current,
    accent_color: color,
    highlight_color: current.highlight_color === (SUGGESTED[current.accent_color] ?? "#ffc94d") ? (SUGGESTED[color] ?? current.highlight_color) : current.highlight_color,
  }));
  const save = async (next = draft) => {
    if (next.selected_rooms.length === 0) return;
    setSaving(true);
    try {
      await onSave({ ...next, pages: next.pages.map((page) => page.title.trim() ? page : { ...page, title: t("newPage") }) });
      saved.current = JSON.stringify(next);
      setSaveState("saved");
    } catch {
      setSaveState("failed");
    } finally { setSaving(false); }
  };
  // Every change is saved on its own a moment after it is made (no Save button); closing saves what is left.
  const saved = useRef(JSON.stringify(initial));
  const [saveState, setSaveState] = useState<"idle" | "saved" | "failed">("idle");
  const pending = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (JSON.stringify(draft) === saved.current) return;
    window.clearTimeout(pending.current);
    pending.current = window.setTimeout(() => { pending.current = undefined; void save(draft); }, 600);
    return () => window.clearTimeout(pending.current);
  }, [draft]);
  const close = async () => {
    window.clearTimeout(pending.current);
    if (JSON.stringify(draft) !== saved.current) await save(draft).catch(() => undefined);
    onClose();
  };

  // On the free plan the list edits the free choice; the full selection stays for Pro.
  const selected = plan.pro ? draft.selected_rooms : freeRoomIds(draft, rooms);
  const toggleRoom = (id: string, on: boolean) => {
    const field = plan.pro ? "selected_rooms" : "free_rooms";
    if (on) update({ [field]: selected.filter((item) => item !== id) });
    else if (locked(selected.length >= plan.limits.rooms)) plan.upsell("rooms");
    else update({ [field]: [...selected, id], ...(plan.pro ? {} : { selected_rooms: draft.selected_rooms.includes(id) ? draft.selected_rooms : [...draft.selected_rooms, id] }) });
  };
  const orderedRooms = () => [...shownSelected.map((id) => rooms.find((room) => room.id === id)).filter((room): room is Room => Boolean(room)), ...rooms.filter((room) => !selected.includes(room.id))];
  // Drag to reorder: the held room follows the finger and the others make room for it.
  const [renamingRoom, setRenamingRoom] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; from: number; to: number; startY: number; dy: number; pitch: number } | null>(null);
  const shownSelected = drag ? moveItem(selected, drag.from, drag.to) : selected;
  const startDrag = (event: ReactPointerEvent<HTMLElement>, id: string) => {
    const row = event.currentTarget.closest<HTMLElement>(".st-item");
    const next = row?.nextElementSibling as HTMLElement | null;
    if (!row) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const pitch = next ? next.getBoundingClientRect().top - row.getBoundingClientRect().top : row.offsetHeight;
    const from = selected.indexOf(id);
    setDrag({ id, from, to: from, startY: event.clientY, dy: 0, pitch });
  };
  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (!drag) return;
    const dy = event.clientY - drag.startY;
    const to = Math.max(0, Math.min(selected.length - 1, drag.from + Math.round(dy / drag.pitch)));
    setDrag({ ...drag, dy, to });
  };
  const endDrag = () => {
    if (!drag) return;
    if (drag.to !== drag.from) {
      // The shown rooms take the same slots in the full selection, so the free choice never replaces it.
      const order = moveItem(selected, drag.from, drag.to);
      const full = draft.selected_rooms.length > 0 ? [...draft.selected_rooms] : rooms.map((room) => room.id);
      const slots = full.map((id, index) => (order.includes(id) ? index : -1)).filter((index) => index >= 0);
      slots.forEach((slot, index) => { full[slot] = order[index]; });
      update({ selected_rooms: full });
    }
    setDrag(null);
  };
  const addPage = (type: HomeDeckPageType) => {
    const title = type === "favorites" ? t("favorites") : type === "scenes" ? t("scenes") : type === "cameras" ? t("camerasTitle") : t("newPage");
    update({ pages: [...draft.pages, { id: `page-${type}-${Date.now().toString(36)}`, title, type, icon: PAGE_ICONS[type], entity_ids: [] }] });
  };

  return <main className="screen settings-v2">
    <header className="st-header">
      <div><span className="eyebrow">{t("appName")}</span><h1>{t("settings")}</h1><p>{t("settingsDescription")}</p></div>
      <div className="st-header__actions">
        {(saving || saveState !== "idle") && <span className={`st-saved${saveState === "failed" && !saving ? " st-saved--failed" : ""}`} role="status">{saving ? t("saving") : saveState === "failed" ? t("settingsNotSaved") : <><HDIcon name="check" size={14} />{t("settingsAutoSaved")}</>}</span>}
        <button aria-label={t("close")} className="hd-close" onClick={() => void close()} type="button"><HDIcon name="close" size={20} /></button>
      </div>
    </header>

    <div className="room-workspace">
      <aside className="room-selector st-nav" aria-label={t("settings")}>
        <div className="room-selector__list" ref={sectionList} role="tablist">
          {SECTIONS.filter(([id]) => id !== "cameras" || Object.keys(hass.states).some((entity) => entity.startsWith("camera."))).map(([id, icon, label]) => <button aria-selected={section === id} key={id} onClick={() => setSection(id)} role="tab" type="button"><span className="room-selector__icon"><HDIcon name={icon} size={18} /></span><span>{t(label)}</span></button>)}
        </div>
      </aside>

      <section className="st-content">
        {section === "layout" && <section className="st-panel">
          <h2>{t("viewMode")}</h2><p>{t("viewModeHint")}</p>
          <LayoutPicker onChange={(view_mode) => update({ view_mode })} t={t} value={plan.pro || FREE_VIEW_MODES.includes(draft.view_mode) ? draft.view_mode : "grid"} />
          {devView && <p className="st-device-note"><HDIcon name="tablet" size={16} />{t("deviceOwnLayout").replace("{layout}", t(VIEW_MODES.find((mode) => mode.id === devView)?.name ?? "viewGrid"))}</p>}
        </section>}

        {section === "appearance" && <>
          {(devView || devBackground) && <p className="st-device-note st-device-note--panel"><HDIcon name="tablet" size={16} />{t("deviceOwnLook")}</p>}
          {/* The Kids layout draws its own colors, background and card shapes, so those choices are hidden there. */}
          {draft.view_mode !== "kids" && <section className="st-panel st-colors">
            <div className="st-colors__preview" aria-hidden="true" style={{ "--hd-accent": draft.accent_color } as CSSProperties}>
              <span className="st-colors__card"><i><HDIcon name="light" size={18} /></i><b>{t("previewLight")}</b><small>75%</small><em><span /></em></span>
              <span className="st-colors__badge">2</span>
            </div>
            <div className="st-colors__group">
              <h2>{t("cardColor")}</h2><p>{t("cardColorDescription")}</p>
              <div className="st-swatches">{ACCENTS.map((color) => <button aria-label={`${t("cardColor")} ${color}`} aria-pressed={draft.accent_color === color} key={color} onClick={() => (locked(color !== DEFAULT_ACCENT) ? plan.upsell("feature") : setCardColor(color))} style={{ background: color }} type="button">{draft.accent_color === color ? <HDIcon name="check" size={16} /> : locked(color !== DEFAULT_ACCENT) && <Lock />}</button>)}</div>
            </div>
            <div className="st-colors__group">
              <h2>{t("highlightColor")}</h2><p>{t("highlightColorDescription")}</p>
              <div className="st-swatches st-swatches--vivid">{HIGHLIGHTS.map((color) => <button aria-label={`${t("highlightColor")} ${color}`} aria-pressed={draft.highlight_color === color} key={color} onClick={() => (locked(color !== DEFAULT_HIGHLIGHT) ? plan.upsell("feature") : update({ highlight_color: color }))} style={{ background: color }} type="button">{draft.highlight_color === color ? <HDIcon name="check" size={16} /> : locked(color !== DEFAULT_HIGHLIGHT) && <Lock />}</button>)}</div>
            </div>
          </section>}
          {draft.view_mode === "kids" && <section className="st-panel">
            <h2>{t("kidsBackground")}</h2><p>{t("kidsBackgroundDescription")}</p>
            <div className="st-kids-scenes">{KIDS_SCENES.map(([scene, label]) => <button aria-pressed={(draft.kids_background ?? "sky") === scene} key={scene} onClick={() => update({ kids_background: scene })} type="button"><span className={`st-kids-scene st-kids-scene--${scene}`} /><span>{t(label)}</span></button>)}</div>
          </section>}
          {draft.view_mode !== "kids" && <section className="st-panel">
            <h2>{t("background")}</h2><p>{t("lightsOnly")}</p>
            <div className="st-backgrounds">{BACKGROUNDS.map(([preset, label, preview]) => <button aria-pressed={draft.background.preset === preset} key={preset} onClick={() => (locked(!FREE_BACKGROUNDS.includes(preset)) ? plan.upsell("feature") : update({ background: { ...draft.background, preset } }))} type="button"><i style={{ background: preview }}>{locked(!FREE_BACKGROUNDS.includes(preset)) && <Lock />}</i><b>{t(label)}</b><small>{locked(!FREE_BACKGROUNDS.includes(preset)) ? "Pro" : preset.startsWith("adaptive_") ? t("automatic") : t("fixedBackground")}</small></button>)}</div>
          </section>}
          <CardStylePanel cards={draft.cards} kids={draft.view_mode === "kids"} locked={!plan.pro} onChange={(cards) => update({ cards })} onUpsell={() => plan.upsell("feature")} t={t} />
          <section className="st-panel">
            <h2>{t("iconsTitle")}</h2>
            <Row description={t("haIconsDescription")} label={t("haIcons")}><Switch checked={Boolean(draft.ha_icons)} label={t("haIcons")} onChange={(ha_icons) => update({ ha_icons })} /></Row>
            <Row description={t("haRoomIconsDescription")} label={t("haRoomIcons")}><Switch checked={Boolean(draft.ha_room_icons)} label={t("haRoomIcons")} onChange={(ha_room_icons) => update({ ha_room_icons })} /></Row>
          </section>

        </>}

        {section === "screensaver" && <section className="st-panel">
            <h2>{t("screensaver")}</h2><p>{t("screensaverDescription")}</p>
            <Row label={t("screensaverEnable")}>{plan.pro ? <Switch checked={draft.screensaver.enabled} label={t("screensaverEnable")} onChange={(enabled) => update({ screensaver: { ...draft.screensaver, enabled } })} /> : <button className="hd-pill" onClick={() => plan.upsell("feature")} type="button"><HDIcon name="lock" size={14} />Pro</button>}</Row>
            <Row label={t("screensaverDelay")}><HDSelect ariaLabel={t("screensaverDelay")} disabled={!draft.screensaver.enabled} onChange={(value) => update({ screensaver: { ...draft.screensaver, delay: Number(value) } })} options={SAVER_DELAYS.map((seconds) => ({ value: String(seconds), label: seconds < 60 ? `${seconds} s` : `${seconds / 60} min` }))} value={String(draft.screensaver.delay)} /></Row>
            {plan.pro && draft.screensaver.enabled && Object.keys(hass.states).some((id) => id.startsWith("calendar.")) && <Row description={t("saverAgendaDescription")} label={t("saverEvents")}><Switch checked={Boolean(draft.screensaver.show_events)} label={t("saverEvents")} onChange={(show_events) => update({ screensaver: { ...draft.screensaver, show_events } })} /></Row>}
            {plan.pro && draft.screensaver.enabled && draft.screensaver.show_events && Object.keys(hass.states).some((id) => id.startsWith("calendar.")) && <Row description={t("saverTomorrowDescription")} label={t("saverTomorrow")}><Switch checked={Boolean(draft.screensaver.show_tomorrow)} label={t("saverTomorrow")} onChange={(show_tomorrow) => update({ screensaver: { ...draft.screensaver, show_tomorrow } })} /></Row>}
            {plan.pro && draft.screensaver.enabled && Object.keys(hass.states).some((id) => id.startsWith("todo.")) && <Row description={t("saverAgendaDescription")} label={t("saverTodo")}><Switch checked={Boolean(draft.screensaver.show_todo)} label={t("saverTodo")} onChange={(show_todo) => update({ screensaver: { ...draft.screensaver, show_todo } })} /></Row>}
            {plan.pro && draft.screensaver.enabled && <SaverTemperatures chosen={draft.screensaver.sensors ?? []} hass={hass} onChange={(sensors) => update({ screensaver: { ...draft.screensaver, sensors } })} t={t} />}
            {plan.pro && draft.screensaver.enabled && <Row description={t("saverSizeDescription")} label={t("saverSize")}><HDSelect ariaLabel={t("saverSize")} onChange={(size) => update({ screensaver: { ...draft.screensaver, size: size as "normal" | "large" } })} options={[{ value: "normal", label: t("saverSizeNormal") }, { value: "large", label: t("saverSizeLarge") }]} value={draft.screensaver.size ?? "normal"} /></Row>}
          </section>}

        {section === "home" && <>
          <section className="st-panel">
            <h2>{t("headerInfo")}</h2>
            <Row label={t("showClock")}><Switch checked={draft.home.show_clock} label={t("showClock")} onChange={(show_clock) => update({ home: { ...draft.home, show_clock } })} /></Row>
            <Row description={t("clockFormatDescription")} label={t("clockFormat")}><HDSegmented ariaLabel={t("clockFormat")} onChange={(clock) => update({ preferences: { ...draft.preferences, clock } })} options={[{ value: "auto", label: t("automatic") }, { value: "24", label: "24 h" }, { value: "12", label: "12 h" }]} value={["24", "12"].includes(draft.preferences.clock) ? draft.preferences.clock : "auto"} /></Row>
            <Row label={t("showWeather")}><Switch checked={draft.home.show_weather} label={t("showWeather")} onChange={(show_weather) => update({ home: { ...draft.home, show_weather } })} /></Row>
            <Row label={t("showPresence")}><Switch checked={draft.home.show_presence} label={t("showPresence")} onChange={(show_presence) => update({ home: { ...draft.home, show_presence } })} /></Row>
            {draft.home.show_presence && <PresencePeople chosen={draft.home.presence_people ?? []} hass={hass} onChange={(presence_people) => update({ home: { ...draft.home, presence_people } })} t={t} />}
            <Row description={t("assistButtonDescription")} label={t("assistButton")}><Switch checked={Boolean(draft.home.assist_button)} label={t("assistButton")} onChange={(assist_button) => update({ home: { ...draft.home, assist_button } })} /></Row>
            <Row description={t("haNotificationsDescription")} label={t("haNotificationsSetting")}><Switch checked={Boolean(draft.home.ha_notifications)} label={t("haNotificationsSetting")} onChange={(ha_notifications) => update({ home: { ...draft.home, ha_notifications } })} /></Row>
          </section>
          <NoticesPanel hass={hass} home={draft.home} language={language} onChange={(patch) => update({ home: { ...draft.home, ...patch } })} t={t} />
          <section className="st-panel">
            <h2>{t("homeActions")}</h2>
            <Row label={t("showStatus")}><Switch checked={draft.visibility.home_cards.status} label={t("showStatus")} onChange={(status) => update({ visibility: { ...draft.visibility, home_cards: { ...draft.visibility.home_cards, status } } })} /></Row>
            <Row description={t("statusSensorDescription")} label={t("statusSensor")}><HDSelect ariaLabel={t("statusSensor")} onChange={(sensor) => update({ home: { ...draft.home, status_sensor: sensor } })} options={[{ value: "", label: t("statusSensorLights") }, ...Object.values(hass.states).filter((state) => /^(sensor|input_number|number|counter|input_text)\./.test(state.entity_id)).sort((a, b) => String(a.attributes.friendly_name ?? a.entity_id).localeCompare(String(b.attributes.friendly_name ?? b.entity_id))).map((state) => ({ value: state.entity_id, label: String(state.attributes.friendly_name ?? state.entity_id) }))]} value={draft.home.status_sensor ?? ""} /></Row>
            <Row label={t("turnAllOn")}><Switch checked={draft.global_actions.lights_on} label={t("turnAllOn")} onChange={(lights_on) => update({ global_actions: { ...draft.global_actions, lights_on } })} /></Row>
            <Row label={t("turnAllOff")}><Switch checked={draft.global_actions.lights_off} label={t("turnAllOff")} onChange={(lights_off) => update({ global_actions: { ...draft.global_actions, lights_off } })} /></Row>
            <Row label={t("showScenesStrip")}><Switch checked={draft.visibility.home_cards.scenes} label={t("showScenesStrip")} onChange={(scenes) => update({ visibility: { ...draft.visibility, home_cards: { ...draft.visibility.home_cards, scenes } } })} /></Row>
          </section>

          <ExtraCardsPanel draft={draft} hass={hass} onUpsell={() => plan.upsell("feature")} pro={plan.pro} t={t} update={update} />
        </>}

        {section === "weather" && <section className="st-panel">
            <h2>{t("weatherForecast")}</h2><p>{t("weatherSourceDescription")}</p>
            <Row label={t("weatherSource")}><HDSelect ariaLabel={t("weatherSource")} onChange={(entity_id) => update({ weather: { ...draft.weather, entity_id } })} options={[{ value: "auto", label: t("automatic") }, { value: OPEN_METEO, label: t("openMeteoSource") }, ...weatherEntities.map((entity) => ({ value: entity.entity_id, label: `${String(entity.attributes.friendly_name ?? entity.entity_id)}${["unknown", "unavailable"].includes(entity.state) ? ` · ${t("unavailable")}` : ""}` }))]} value={draft.weather.entity_id === OPEN_METEO || weatherEntities.some((entity) => entity.entity_id === draft.weather.entity_id) ? draft.weather.entity_id : "auto"} /></Row>
            <Row description={t("headerDaysDescription")} label={t("headerDays")}><HDSegmented ariaLabel={t("headerDays")} onChange={(days) => update({ weather: { ...draft.weather, header_days: Number(days) } })} options={[{ value: "0", label: t("humidityNone") }, { value: "3", label: "3" }, { value: "5", label: "5" }]} value={String(draft.weather.header_days ?? 0)} /></Row>
            {([["outdoor_temperature", "outdoorTemperature", "temperature"], ["outdoor_humidity", "outdoorHumidity", "humidity"], ["outdoor_wind", "outdoorWind", "wind_speed"], ["outdoor_pressure", "outdoorPressure", "pressure"]] as const).map(([key, label, kind]) => <Row description={t(`${label}Description`)} key={key} label={t(label)}><HDSelect ariaLabel={t(label)} onChange={(sensor) => update({ weather: { ...draft.weather, [key]: sensor || undefined } })} options={[{ value: "", label: t("outdoorFromWeather") }, ...Object.values(hass.states).filter((state) => state.entity_id.startsWith("sensor.") && (kind === "pressure" ? ["pressure", "atmospheric_pressure"].includes(String(state.attributes.device_class)) : state.attributes.device_class === kind)).sort((a, b) => Number(/outdoor|outside|extern|exterior|esterno|aussen|außen|rua|quintal/i.test(`${b.entity_id} ${b.attributes.friendly_name ?? ""}`)) - Number(/outdoor|outside|extern|exterior|esterno|aussen|außen|rua|quintal/i.test(`${a.entity_id} ${a.attributes.friendly_name ?? ""}`)) || String(a.attributes.friendly_name ?? a.entity_id).localeCompare(String(b.attributes.friendly_name ?? b.entity_id))).map((state) => ({ value: state.entity_id, label: String(state.attributes.friendly_name ?? state.entity_id) }))]} value={draft.weather[key] ?? ""} /></Row>)}
          </section>}

        {section === "agenda" && <>
          <AgendaPanel draft={draft} hass={hass} t={t} update={update} />
          <SeasonsPanel draft={draft} hass={hass} onUpsell={() => plan.upsell("feature")} pro={plan.pro} t={t} update={update} />
        </>}

        {section === "cameras" && <>
          <section className="st-panel">
            <h2>{t("camerasTitle")}</h2>
            <Row description={t("liveCamerasDescription")} label={t("liveCameras")}><Switch checked={draft.live_cameras !== false} label={t("liveCameras")} onChange={(live_cameras) => update({ live_cameras })} /></Row>
            <Row description={t("cameraWholeDescription")} label={t("cameraWhole")}><Switch checked={Boolean(draft.camera_whole)} label={t("cameraWhole")} onChange={(camera_whole) => update({ camera_whole })} /></Row>
          </section>
          <DoorbellPanel draft={draft} hass={hass} onUpsell={() => plan.upsell("feature")} pro={plan.pro} t={t} update={update} />
        </>}

        {section === "rooms" && <section className="st-panel">
          <h2>{t("sectionRooms")}</h2><p>{t("roomsOrderDescription")}</p>
          <div className="st-list">{orderedRooms().map((room) => {
            const on = selected.includes(room.id);
            const held = drag?.id === room.id;
            // The name in Home Assistant, and the one typed here (saved with the other settings).
            const original = room.original_name ?? room.name;
            const typed = draft.rooms?.[room.id]?.name;
            const name = room.id === "__unassigned__" ? t("unassigned") : typed ?? original;
            const renaming = renamingRoom === room.id;
            return <div className={`st-item ${on ? "st-item--on" : ""} ${held ? "st-item--held" : ""}`} key={room.id} style={held ? { transform: `translateY(${drag.dy - (drag.to - drag.from) * drag.pitch}px)` } : undefined}>
              {renaming
                ? <div className="st-item__main"><span className="st-check">{on && <HDIcon name="check" size={14} />}</span><RoomIcon room={{ ...room, name }} size={18} /><input aria-label={`${t("renameRoom")}: ${original}`} autoFocus className="st-input st-input--framed" maxLength={60} onBlur={() => setRenamingRoom(null)} onChange={(event) => update({ rooms: withRoomOptions(draft, room.id, { name: event.target.value.trim() === original ? "" : event.target.value }).rooms })} onFocus={(event) => event.currentTarget.select()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === "Escape") event.currentTarget.blur(); }} placeholder={original} value={typed ?? original} /></div>
                : <button aria-pressed={on} className="st-item__main" disabled={on && selected.length === 1} onClick={() => toggleRoom(room.id, on)} type="button">
                  <span className="st-check">{on && <HDIcon name="check" size={14} />}</span><RoomIcon room={{ ...room, name }} size={18} /><b>{name}</b>{typed && <small className="st-item__was">{original}</small>}
                </button>}
              {room.id !== "__unassigned__" && !renaming && <button aria-label={`${t("renameRoom")}: ${name}`} className="st-icon-button st-icon-button--small" onClick={() => setRenamingRoom(room.id)} type="button"><HDIcon name="pencil" size={15} /></button>}
              {on && selected.length > 1 && <span aria-label={`${t("dragToReorder")}: ${name}`} className="st-grip" onPointerCancel={endDrag} onPointerDown={(event) => startDrag(event, room.id)} onPointerMove={moveDrag} onPointerUp={endDrag} role="img"><HDIcon name="grip" size={18} /></span>}
            </div>;
          })}</div>
          <Row description={t("roomScenesDescription")} label={t("roomScenes")}><Switch checked={Boolean(draft.room_scenes)} label={t("roomScenes")} onChange={(room_scenes) => update({ room_scenes })} /></Row>
          <Row description={t("roomSensorsDescription")} label={t("roomSensors")}><Switch checked={Boolean(draft.room_sensors)} label={t("roomSensors")} onChange={(room_sensors) => update({ room_sensors })} /></Row>
          <Row description={t("roomsByFloorDescription")} label={t("roomsByFloor")}><Switch checked={Boolean(draft.rooms_by_floor)} label={t("roomsByFloor")} onChange={(rooms_by_floor) => update({ rooms_by_floor })} /></Row>
        </section>}

        {section === "navigation" && (() => {
          // A tab only shows when the panel's rooms have something for it: say so under a switch that is on.
          const panelIds = new Set(panelRoomIds(draft, rooms, plan.pro));
          const found = availableSections(rooms.filter((room) => panelIds.has(room.id)).flatMap((room) => room.entities));
          const missing = (on: boolean, has: boolean, key: TranslationKey) => (on && !has ? t(key) : undefined);
          return <>
          <section className="st-panel">
            <h2>{t("builtInNavigation")}</h2><p>{t("navigationDescription")}</p>
            <Row label={t("roomsPage")}><Switch checked={draft.navigation.rooms} label={t("roomsPage")} onChange={(rooms) => update({ navigation: { ...draft.navigation, rooms } })} /></Row>
            <Row description={missing(draft.navigation.scenes, found.hasScenes, "navNoScenes")} label={t("scenes")}><Switch checked={draft.navigation.scenes} label={t("scenes")} onChange={(scenes) => update({ navigation: { ...draft.navigation, scenes } })} /></Row>
            <Row description={missing(draft.navigation.media, found.hasMedia, "navNoMedia")} label={t("media")}><Switch checked={draft.navigation.media} label={t("media")} onChange={(media) => update({ navigation: { ...draft.navigation, media } })} /></Row>
            <Row description={missing(draft.navigation.security, found.hasSecurity, "navNoSecurity")} label={t("security")}><Switch checked={draft.navigation.security} label={t("security")} onChange={(security) => update({ navigation: { ...draft.navigation, security } })} /></Row>
            <Row description={missing(Boolean(draft.navigation.cameras), found.hasCameras, "navNoCameras")} label={t("camerasTitle")}><Switch checked={Boolean(draft.navigation.cameras)} label={t("camerasTitle")} onChange={(cameras) => update({ navigation: { ...draft.navigation, cameras } })} /></Row>
            <Row description={t("floorplanDescription")} label={t("floorplan")}>{plan.pro ? <Switch checked={Boolean(draft.navigation.plan)} label={t("floorplan")} onChange={(on) => update({ navigation: { ...draft.navigation, plan: on } })} /> : <button className="hd-pill" onClick={() => plan.upsell("feature")} type="button"><HDIcon name="lock" size={14} />Pro</button>}</Row>
            {plan.pro && draft.navigation.plan && <div className="st-sub"><label className="st-sub__row"><span>{t("floorplanName")}</span><input aria-label={t("floorplanName")} className="st-input st-input--framed" maxLength={30} onChange={(event) => update({ navigation: { ...draft.navigation, plan_title: event.target.value } })} placeholder={t("floorplanCardLabel")} value={draft.navigation.plan_title ?? ""} /></label></div>}
          </section>
          <section className="st-panel">
            <h2>{t("panelStart")}</h2><p>{t("panelStartDescription")}</p>
            <Row label={t("panelStart")}><HDSelect ariaLabel={t("panelStart")} onChange={(start) => update({ navigation: { ...draft.navigation, start: start === "home" ? undefined : start } })} options={[
              { value: "home", label: t("home") },
              ...(draft.navigation.rooms ? [{ value: "rooms", label: t("roomsPage") }] : []),
              ...(draft.navigation.scenes ? [{ value: "scenes", label: t("scenes") }] : []),
              ...(draft.navigation.media ? [{ value: "media", label: t("media") }] : []),
              ...(draft.navigation.security ? [{ value: "security", label: t("security") }] : []),
              ...(draft.navigation.cameras ? [{ value: "cameras", label: t("camerasTitle") }] : []),
              ...(plan.pro && draft.navigation.plan ? [{ value: "plan", label: draft.navigation.plan_title || t("floorplan") }] : []),
              ...(plan.pro ? draft.pages.map((page) => ({ value: page.id, label: page.title })) : []),
            ]} value={draft.navigation.start ?? "home"} /></Row>
          </section>
          <section className="st-panel">
            <h2>{t("yourPages")}</h2><p>{t("pagesHint")}</p>
            {!plan.pro ? <div className="st-actions"><button className="hd-pill" onClick={() => plan.upsell("feature")} type="button"><HDIcon name="lock" size={14} />{t("proPagesLocked")}</button></div> : <>
            {draft.pages.length > 0 && <div className="st-list">{draft.pages.map((page) => <div className="st-page-row" key={page.id}><div className="st-page">
              <div className="st-item st-item--on">
                <button aria-expanded={iconPage === page.id} aria-label={`${t("pageIconLabel")}: ${page.title}`} className="st-item__icon" onClick={() => setIconPage((open) => open === page.id ? null : page.id)} type="button"><HDIcon name={isIconName(page.icon) ? page.icon : PAGE_ICONS[page.type]} size={18} /></button>
                <input aria-label={t("pageName")} className="st-input" onChange={(event) => update({ pages: draft.pages.map((item) => item.id === page.id ? { ...item, title: event.target.value } : item) })} value={page.title} />
              </div>
              <button aria-label={`${t("deletePage")}: ${page.title}`} className="st-icon-button st-icon-button--danger" onClick={() => update({ pages: draft.pages.filter((item) => item.id !== page.id) })} type="button"><HDIcon name="trash" size={18} /></button>
            </div>{iconPage === page.id && <PageIconPicker onPick={(icon) => { update({ pages: draft.pages.map((item) => item.id === page.id ? { ...item, icon } : item) }); setIconPage(null); }} t={t} value={isIconName(page.icon) ? page.icon : PAGE_ICONS[page.type]} />}</div>)}</div>}
            <div className="st-actions">
              <button className="hd-pill" onClick={() => addPage("favorites")} type="button"><HDIcon name="star" size={16} />{t("favorites")}</button>
              <button className="hd-pill" onClick={() => addPage("scenes")} type="button"><HDIcon name="scene" size={16} />{t("scenes")}</button>
              <button className="hd-pill" onClick={() => addPage("cameras")} type="button"><HDIcon name="camera" size={16} />{t("camerasTitle")}</button>
              <button className="hd-pill" onClick={() => addPage("custom")} type="button"><HDIcon name="plus" size={16} />{t("newPage")}</button>
            </div></>}
            {imported && <p className="hd-import__done">{t("importDone")}</p>}
          </section>
          <section className="st-panel">
            <h2>{t("importTitle")}</h2><p>{t("importPanelHint")}</p>
            <div className="st-actions"><button className="hd-pill" onClick={(event) => setImporting(event.currentTarget.closest(".app-shell"))} type="button"><HDIcon name="plus" size={16} />{t("importDashboard")}</button></div>
            {importing && createPortal(<div aria-label={t("importTitle")} aria-modal="true" className="hd-sheet-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setImporting(null); }} role="dialog">
              <section className="hd-sheet hd-detail hd-import-sheet">
                <header className="hd-detail__header"><span className="hd-detail__icon"><HDIcon name="grid" size={24} /></span><div><span className="eyebrow">{t("navigation")}</span><h2>{t("importTitle")}</h2></div><button aria-label={t("close")} className="hd-close" onClick={() => setImporting(null)} type="button"><HDIcon name="close" size={20} /></button></header>
                <DashboardImport hass={hass} onCancel={() => setImporting(null)} onImport={(choice) => { setDraft((current) => applyImport(current, choice.dashboard, { pages: choice.pages, onlyThese: choice.onlyThese, rooms, maxRooms: plan.pro ? undefined : plan.limits.rooms })); setImporting(null); setImported(true); }} t={t} />
              </section>
            </div>, importing)}
          </section>
        </>;
        })()}

        {section === "plan" && <section className="st-panel st-plan">
          {plan.pro ? <>
            <div className="st-plan__head"><span className="hd-pro__mark"><HDIcon name="star" size={20} /></span><div><h2>{t("proActive")}</h2><p>{plan.license?.kind === "annual" ? t("proAnnual") : t("proLifetime")}{plan.license?.email ? ` · ${plan.license.email}` : ""}</p></div></div>
            {plan.license?.expires_at && <Row label={plan.license.cancels ? t("proEnds") : t("proRenews")}><span className="st-value">{new Intl.DateTimeFormat(language, { dateStyle: "medium" }).format(new Date(plan.license.expires_at * 1000))}</span></Row>}
            {plan.license?.manage && <Row description={t("proManageDescription")} label={t("proManage")}><button className="hd-pill" onClick={() => void openPortal(hass, window.location.href).then(({ url }) => window.open(url, "_blank", "noopener")).catch(() => undefined)} type="button">{t("proManageAction")}</button></Row>}
            <Row description={t("proRemoveDescription")} label={t("proRemove")}><RemoveLicenseButton onRemove={() => void deactivateLicense(hass).then(onLicense)} t={t} /></Row>
          </> : <>
            <div className="st-plan__head"><span className="hd-pro__mark hd-pro__mark--free"><HDIcon name="home" size={20} /></span><div><h2>{t("freePlan")}</h2><p>{t("freePlanDescription").replace("{rooms}", String(plan.limits.rooms)).replace("{devices}", String(plan.limits.devices))}</p></div></div>
            {plan.license && LICENSE_ERRORS[plan.license.status] && <p className="st-plan__ended"><HDIcon name="shield" size={16} />{t(LICENSE_ERRORS[plan.license.status])}</p>}
            <div className="st-meters">
              <Meter label={t("sectionRooms")} used={freeUsage(draft, rooms).rooms} limit={plan.limits.rooms} />
              <Meter label={t("gateDevices")} used={freeUsage(draft, rooms).devices} limit={plan.limits.devices} />
            </div>
            <Row description={t("manageDevicesDescription")} label={t("gateDevices")}><button className="hd-pill" onClick={() => setManaging(true)} type="button">{t("manageDevices")}</button></Row>
            <div className="st-actions"><button className="hd-pill hd-pill--solid" onClick={() => plan.upsell("general")} type="button"><HDIcon name="star" size={16} />{t("proSeePro")}</button></div>
          </>}
          <Row description={t("feedbackDescription")} label={t("feedback")}>{plan.pro ? <button className="hd-pill hd-pill--solid" onClick={() => setFeedback(true)} type="button"><HDIcon name="check" size={16} />{t("feedbackOpen")}</button> : <button className="hd-pill" onClick={() => plan.upsell("feature")} type="button"><HDIcon name="lock" size={14} />Pro</button>}</Row>
          <Row description={t("supportDescription")} label={t("support")}><a className="hd-pill" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></Row>
          <Row description={t("installationIdDescription")} label={t("installationId")}><code className="st-code">{plan.license?.installation_id ?? "—"}</code></Row>
        </section>}

        {section === "plan" && !inDesktopApp() && <section className="st-panel st-love st-desktop">
          <div className="st-love__head">
            <svg aria-hidden="true" className="st-love__art" viewBox="0 0 64 64"><defs><linearGradient id="hdDesktop" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#5b8def" /><stop offset="1" stopColor="#8a6fd8" /></linearGradient></defs><rect fill="url(#hdDesktop)" height="64" rx="18" width="64" /><rect fill="#fff" height="24" rx="3.5" width="36" x="14" y="17" /><rect fill="#5b8def" height="9" opacity=".55" rx="1.5" width="8" x="18" y="21" /><rect fill="#8a6fd8" height="5" opacity=".45" rx="1.5" width="8" x="28" y="21" /><rect fill="#8a6fd8" height="5" opacity=".45" rx="1.5" width="8" x="28" y="28" /><path d="M10 45h44l-3 4H13z" fill="#fff" /></svg>
            <div><h2>{t("desktopTitle")}</h2><p>{t("desktopText")}{plan.pro ? "" : ` ${t("desktopProNote")}`}</p></div>
          </div>
          <div className="st-love__links">
            <a className="hd-pill hd-pill--solid" href={desktopUrl(language)} rel="noopener" target="_blank"><HDIcon name="monitor" size={16} />{t("desktopDownload")}</a>
          </div>
        </section>}

        {section === "plan" && <section className="st-panel st-love">
          <div className="st-love__head">
            <svg aria-hidden="true" className="st-love__art" viewBox="0 0 64 64"><defs><linearGradient id="hdLove" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ff8fb1" /><stop offset="1" stopColor="#c86bff" /></linearGradient></defs><rect fill="url(#hdLove)" height="64" rx="18" width="64" /><path d="M32 47s-14-8.6-14-18.2C18 24 21.6 20.5 25.9 20.5c2.6 0 4.8 1.3 6.1 3.4 1.3-2.1 3.5-3.4 6.1-3.4 4.3 0 7.9 3.5 7.9 8.3C46 38.4 32 47 32 47z" fill="#fff" /><circle cx="49" cy="15" fill="#fff" opacity=".85" r="3" /><circle cx="14" cy="49" fill="#fff" opacity=".6" r="2" /></svg>
            <div><h2>{t("loveTitle")}</h2><p>{t("loveText")}</p></div>
          </div>
          <div className="st-love__links">
            <a className="hd-pill" href="https://github.com/rodrigo-wa/homedeck" rel="noopener" target="_blank"><HDIcon name="star" size={16} />{t("loveGithub")}</a>
            <a className="hd-pill" href="https://community.home-assistant.io/t/1032025" rel="noopener" target="_blank"><HDIcon name="people" size={16} />{t("loveForum")}</a>
            <a className="hd-pill hd-pill--solid" href="https://www.instagram.com/homedeck.pro" rel="noopener" target="_blank"><HDIcon name="camera" size={16} />{t("loveInstagram")}</a>
          </div>
        </section>}

        {section === "device" && <section className="st-panel">
          <h2>{t("sectionDevice")}</h2><p>{t("sectionDeviceDescription")}</p>
          <DevicePrefsRows general={draft.view_mode} generalBackground={draft.background.preset} generalKids={draft.kids_background ?? "sky"} hass={hass} onUpsell={() => plan.upsell("feature")} pro={plan.pro} sidebarRow={<Row description={t("hideHaSidebarDescription")} label={t("hideHaSidebar")}><Switch checked={hideHaSidebar} label={t("hideHaSidebar")} onChange={(hidden) => { setHideHaSidebar(hidden); setHideSidebarPreferred(hidden); }} /></Row>} t={t} />
        </section>}

        {section === "system" && <StartScreenPanel hass={hass} t={t} />}

        {section === "system" && <section className="st-panel">
          <h2>{t("sectionSystem")}</h2>
          <Row description={t("reloadDevicesDescription")} label={t("reloadDevices")}><button className="hd-pill" onClick={onReload} type="button"><HDIcon name="refresh" size={16} />{t("refresh")}</button></Row>
          <BackupRows draft={draft} onImport={(imported) => setDraft((current) => ({ ...current, ...imported }))} t={t} version={version} />
          <Row description={t("restartSetupDescription")} label={t("restartSetup")}><button className="hd-pill" disabled={saving} onClick={() => void save({ ...draft, onboarding_complete: false }).then(onClose)} type="button">{t("restartSetup")}</button></Row>
          <VersionRow t={t} version={version} />
        </section>}
      </section>
    </div>
    {feedback && <FeedbackSheet hass={hass} language={language} onClose={() => setFeedback(false)} t={t} />}
    {managing && <EntityPicker filter={isControllable} language={language} onClose={() => setManaging(false)} onToggle={(id) => {
      const current = freeDevices(draft, rooms);
      if (current.includes(id)) update({ free_devices: current.filter((item) => item !== id) });
      else if (current.length >= plan.limits.devices) plan.upsell("devices");
      else update({ free_devices: [...current, id] });
    }} rooms={rooms.filter((room) => freeRoomIds(draft, rooms).includes(room.id))} selected={freeDevices(draft, rooms)} t={t} title={`${t("gateDevices")} · ${freeUsage(draft, rooms).devices} ${t("of")} ${plan.limits.devices}`} />}
  </main>;
}

/** A copy of the whole configuration in a file, and putting one back (after a second tap). License keys
 * are not part of it; floor plan pictures stay on Home Assistant and are only referenced. */
function BackupRows({ draft, onImport, t, version }: { draft: HomeDeckConfig; onImport: (config: Partial<HomeDeckConfig>) => void; t: (key: TranslationKey) => string; version?: string }) {
  const [pending, setPending] = useState<Partial<HomeDeckConfig> | null>(null);
  const [error, setError] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const exportFile = () => {
    const blob = new Blob([JSON.stringify({ ...draft, homedeck_export: { version: version ?? "", date: new Date().toISOString() } }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `homedeck-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  const read = (chosen?: File) => {
    setError(false);
    setPending(null);
    if (!chosen) return;
    void chosen.text().then((text) => {
      const parsed = JSON.parse(text) as Partial<HomeDeckConfig> & { homedeck_export?: unknown };
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.selected_rooms) || typeof parsed.layouts !== "object") throw new Error("not a HomeDeck file");
      const { homedeck_export: _info, ...config } = parsed;
      setPending({ ...config, onboarding_complete: true });
    }).catch(() => setError(true));
  };
  return <>
    <Row description={t("backupExportDescription")} label={t("backupExport")}><button className="hd-pill" onClick={exportFile} type="button"><HDIcon name="arrow" size={16} />{t("backupExportAction")}</button></Row>
    <Row description={error ? t("backupImportError") : pending ? t("backupImportConfirm") : t("backupImportDescription")} label={t("backupImport")}>
      <input accept="application/json,.json" hidden onChange={(event) => { read(event.target.files?.[0]); event.target.value = ""; }} ref={file} type="file" />
      {pending
        ? <span className="hd-backup-confirm"><button className="hd-pill" onClick={() => setPending(null)} type="button">{t("cancel")}</button><button className="hd-pill hd-pill--danger" onClick={() => { onImport(pending); setPending(null); }} type="button">{t("backupImportApply")}</button></span>
        : <button className="hd-pill" onClick={() => file.current?.click()} type="button"><HDIcon name="plus" size={16} />{t("backupImportAction")}</button>}
    </Row>
  </>;
}

function Range({ label, max, onChange, value, ends }: { label: string; max: number; onChange: (value: number) => void; value: number; ends: [string, string] }) {
  return <div className="st-range">
    <input aria-label={label} max={max} min={0} onChange={(event) => onChange(Number(event.currentTarget.value))} step={5} style={{ "--value": `${(value / max) * 100}%` } as CSSProperties} type="range" value={value} />
    <span><small>{ends[0]}</small><small>{ends[1]}</small></span>
  </div>;
}

/** Pro: corners, frame and glass, previewed live on the panel behind the settings. */
function CardStylePanel({ cards, kids = false, locked, onChange, onUpsell, t }: { cards: HomeDeckCardStyle; kids?: boolean; locked: boolean; onChange: (cards: HomeDeckCardStyle) => void; onUpsell: () => void; t: (key: TranslationKey) => string }) {
  const changed = JSON.stringify({ ...DEFAULT_CARDS, ...cards }) !== JSON.stringify(DEFAULT_CARDS);
  return <section className={`st-panel st-cards ${locked ? "st-cards--locked" : ""}`}>
    <h2>{t("cardStyle")}</h2>{!kids && <p>{t("cardStyleDescription")}</p>}
    {locked && <div className="st-actions"><button className="hd-pill" onClick={onUpsell} type="button"><HDIcon name="lock" size={14} />{t("proStyleLocked")}</button></div>}
    <div className="st-cards__body"><fieldset disabled={locked}>
      {!kids && <Row label={t("corners")}><Range ends={[t("cornersSquare"), t("cornersRound")]} label={t("corners")} max={150} onChange={(corners) => onChange({ ...cards, corners })} value={cards.corners} /></Row>}
      {!kids && <Row label={t("glass")}><Range ends={[t("glassSolid"), t("glassClear")]} label={t("glass")} max={100} onChange={(glass) => onChange({ ...cards, glass })} value={cards.glass} /></Row>}
      {!kids && <Row description={t("frameDescription")} label={t("frame")}><Switch checked={cards.frame} label={t("frame")} onChange={(frame) => onChange({ ...cards, frame })} /></Row>}
      {!kids && <Row description={t("shineDescription")} label={t("shine")}><Switch checked={Boolean(cards.shine)} label={t("shine")} onChange={(shine) => onChange({ ...cards, shine })} /></Row>}
      <Row description={t("sparklinesDescription")} label={t("sparklines")}><Switch checked={Boolean(cards.sparklines)} label={t("sparklines")} onChange={(sparklines) => onChange({ ...cards, sparklines })} /></Row>
      <Row description={t("roomPowerDescription")} label={t("roomPower")}><Switch checked={cards.room_power !== false} label={t("roomPower")} onChange={(room_power) => onChange({ ...cards, room_power })} /></Row>
      <Row description={t("sensorSinceDescription")} label={t("sensorSince")}><Switch checked={Boolean(cards.sensor_since)} label={t("sensorSince")} onChange={(sensor_since) => onChange({ ...cards, sensor_since })} /></Row>
      <Row description={t("playersDescription")} label={t("players")}><Switch checked={cards.players !== false} label={t("players")} onChange={(players) => onChange({ ...cards, players })} /></Row>
    </fieldset>{locked && <button aria-label={t("proStyleLocked")} className="st-cards__lock" onClick={onUpsell} type="button" />}</div>
    {!locked && changed && <div className="st-actions"><button className="hd-pill" onClick={() => onChange(DEFAULT_CARDS)} type="button"><HDIcon name="refresh" size={16} />{t("restoreDefaults")}</button></div>}
  </section>;
}

/** Optional cards on Home: the bigger weather card, the sun and (Pro) energy, with its sensors. */
function ExtraCardsPanel({ draft, hass, onUpsell, pro, t, update }: { draft: HomeDeckConfig; hass: HomeAssistant; onUpsell: () => void; pro: boolean; t: (key: TranslationKey) => string; update: (patch: Partial<HomeDeckConfig>) => void }) {
  const widgets = draft.widgets;
  const energy = draft.energy;
  const candidates = useMemo(() => energyCandidates(hass), [hass.states]);
  const label = (id: string) => String(hass.states[id]?.attributes.friendly_name ?? id);
  const set = (patch: Partial<HomeDeckConfig["widgets"]>) => update({ widgets: { ...widgets, ...patch } });
  const recentSensors = useMemo(() => Object.values(hass.states).filter(isRecentMediaSensor).sort((a, b) => String(a.attributes.friendly_name ?? a.entity_id).localeCompare(String(b.attributes.friendly_name ?? b.entity_id))), [hass.states]);
  const turnOnEnergy = (on: boolean) => {
    if (on && !pro) { onUpsell(); return; }
    // The first time, each field starts with the sensor that best fits it.
    const empty = Object.values(energy).every((id) => !id);
    const guess = (key: keyof typeof candidates) => candidates[key][0]?.entity_id ?? "";
    update({
      widgets: { ...widgets, energy: on },
      ...(on && empty ? { energy: { consumption: guess("consumption"), grid_import: guess("grid_import"), grid_export: "", solar: guess("solar"), battery: guess("battery"), solar_today: guess("solar_today") } } : {}),
    });
  };
  const fields: Array<[keyof HomeDeckConfig["energy"], TranslationKey]> = [["consumption", "energyHome"], ["solar", "energySolar"], ["grid_import", "energyGrid"], ["grid_export", "energyGridExport"], ["battery", "energyBattery"], ["solar_today", "energyToday"]];
  return <section className="st-panel">
    <h2>{t("moreHomeCards")}</h2><p>{t("homeCardsDescription")}</p>
    <Row label={t("weatherCard")}><Switch checked={widgets.weather} label={t("weatherCard")} onChange={(weather) => set({ weather })} /></Row>
    {hass.states["sun.sun"] && <Row description={t("sunCardDescription")} label={t("sunCard")}><Switch checked={widgets.sun} label={t("sunCard")} onChange={(sun) => set({ sun })} /></Row>}
    <div className="st-group">
      <Row description={t("energyCardDescription")} label={t("energyCard")}>{pro ? <Switch checked={widgets.energy} label={t("energyCard")} onChange={turnOnEnergy} /> : <button className="hd-pill" onClick={onUpsell} type="button"><HDIcon name="lock" size={14} />Pro</button>}</Row>
      {pro && widgets.energy && <div className="st-sub">
        {fields.map(([key, name]) => <div className="st-sub__row" key={key}><span>{t(name)}</span><HDSelect ariaLabel={t(name)} onChange={(id) => update({ energy: { ...energy, [key]: id } })} options={[{ value: "", label: t("none") }, ...[...new Set([...(energy[key] ? [energy[key]] : []), ...candidates[key].map((state) => state.entity_id)])].map((id) => ({ value: id, label: label(id) }))]} value={energy[key]} /></div>)}
      </div>}
    </div>
    <div className="st-group">
          <Row description={t("floorplanCardDescription")} label={t("floorplanCard")}>{pro ? <Switch checked={Boolean(widgets.plan)} label={t("floorplanCard")} onChange={(plan) => set({ plan })} /> : <button className="hd-pill" onClick={onUpsell} type="button"><HDIcon name="lock" size={14} />Pro</button>}</Row>
      {pro && widgets.plan && Object.keys(draft.floorplan?.images ?? {}).length > 0 && <div className="st-sub"><label className="st-sub__row"><span>{t("floorplanCardImage")}</span><Switch checked={draft.floorplan?.card_image !== false} label={t("floorplanCardImage")} onChange={(on) => update({ floorplan: { ...(draft.floorplan ?? { rooms: {}, devices: {}, hidden: [] }), card_image: on ? undefined : false } })} /></label></div>}
    </div>
    <div className="st-group">
      <Row description={t("recentMediaDescription")} label={t("recentMediaCard")}>{pro ? <Switch checked={Boolean(widgets.recent)} label={t("recentMediaCard")} onChange={(recent) => set({ recent })} /> : <button className="hd-pill" onClick={onUpsell} type="button"><HDIcon name="lock" size={14} />Pro</button>}</Row>
      {pro && widgets.recent && <div className="st-sub">
        {recentSensors.length === 0 && <p className="st-note">{t("recentMediaNone")}</p>}
        {recentSensors.length > 0 && [0, 1, 2].slice(0, Math.min(3, (draft.recent_media ?? []).length + 1)).map((slot) => <div className="st-sub__row" key={slot}><span>{t("saverTempsSensor").replace("{n}", String(slot + 1))}</span><HDSelect ariaLabel={t("saverTempsSensor").replace("{n}", String(slot + 1))} onChange={(id) => { const list = [...(draft.recent_media ?? [])]; if (id) list[slot] = id; else list.splice(slot, 1); update({ recent_media: [...new Set(list.filter(Boolean))] }); }} options={[{ value: "", label: t("none") }, ...recentSensors.map((state) => ({ value: state.entity_id, label: String(state.attributes.friendly_name ?? state.entity_id) }))]} value={(draft.recent_media ?? [])[slot] ?? ""} /></div>)}
      </div>}
    </div>
    <BinsSettings bins={draft.bins ?? []} enabled={Boolean(widgets.bins)} hass={hass} onBins={(bins) => update({ bins })} onEnabled={(on) => { set({ bins: on }); if (on && (draft.bins ?? []).length === 0) update({ widgets: { ...widgets, bins: true }, bins: [{ entity: "", name: "", color: "black" }] }); }} onUpsell={onUpsell} pro={pro} t={t} />
  </section>;
}

/** A sensor's attributes that may tell the collection day: plain values, without HA's own bookkeeping. */
const BIN_SKIP = new Set(["friendly_name", "icon", "unit_of_measurement", "device_class", "state_class", "attribution", "entity_picture", "supported_features", "restored", "assumed_state"]);
function binAttributes(hass: HomeAssistant, entityId: string): Array<[string, string]> {
  const attributes = hass.states[entityId]?.attributes ?? {};
  return Object.entries(attributes)
    .filter(([key, value]) => !BIN_SKIP.has(key) && (typeof value === "string" || typeof value === "number") && String(value).length > 0)
    .slice(0, 40)
    .map(([key, value]) => [key, String(value).length > 32 ? `${String(value).slice(0, 31)}…` : String(value)]);
}

const BIN_WORDS = /waste|bin|trash|garbage|recycl|m[uü]ll|abfall|tonne|lixo|coleta|basura|odpad/i;

/** Pro: the waste collection card, up to four bins, each a sensor with a name and a color. */
function BinsSettings({ bins, enabled, hass, onBins, onEnabled, onUpsell, pro, t }: { bins: HomeDeckBin[]; enabled: boolean; hass: HomeAssistant; onBins: (bins: HomeDeckBin[]) => void; onEnabled: (on: boolean) => void; onUpsell: () => void; pro: boolean; t: (key: TranslationKey) => string }) {
  const name = (id: string) => String(hass.states[id]?.attributes.friendly_name ?? id);
  const sensors = useMemo(() => Object.keys(hass.states).filter((id) => id.startsWith("sensor.") || id.startsWith("calendar.")).sort((a, b) => Number(BIN_WORDS.test(b + name(b))) - Number(BIN_WORDS.test(a + name(a))) || name(a).localeCompare(name(b))), [enabled]);
  const change = (index: number, patch: Partial<HomeDeckBin>) => onBins(bins.map((bin, at) => at === index ? { ...bin, ...patch } : bin));
  const colors: Array<[HomeDeckBinColor, TranslationKey]> = [["black", "binBlack"], ["brown", "binBrown"], ["green", "binGreen"], ["blue", "binBlue"], ["yellow", "binYellow"], ["grey", "binGrey"], ["red", "binRed"]];
  return <div className="st-group">
    <Row description={t("binsCardDescription")} label={t("binsCard")}>{pro ? <Switch checked={enabled} label={t("binsCard")} onChange={onEnabled} /> : <button className="hd-pill" onClick={onUpsell} type="button"><HDIcon name="lock" size={14} />Pro</button>}</Row>
    {pro && enabled && <div className="st-sub">
      {bins.map((bin, index) => <div className="st-bin" key={index}>
        <HDSelect ariaLabel={t("binSensor")} onChange={(entity) => change(index, { entity, attribute: undefined })} options={[{ value: "", label: t("binSensor") }, ...[...new Set([...(bin.entity ? [bin.entity] : []), ...sensors])].map((id) => ({ value: id, label: name(id) }))]} value={bin.entity} />
        <input aria-label={t("binName")} className="st-input st-input--framed" maxLength={30} onChange={(event) => change(index, { name: event.target.value })} placeholder={t("binName")} value={bin.name} />
        <HDSelect ariaLabel={t("binColor")} onChange={(color) => change(index, { color: color as HomeDeckBinColor })} options={colors.map(([value, label]) => ({ value, label: t(label) }))} value={bin.color} />
        <button aria-label={t("removeItem")} className="st-icon-button st-icon-button--danger" onClick={() => onBins(bins.filter((_, at) => at !== index))} type="button"><HDIcon name="trash" size={16} /></button>
        {bin.entity.startsWith("calendar.") && <div className="st-bin__value"><span>{t("binMatch")}</span><input aria-label={t("binMatch")} className="st-input st-input--framed" maxLength={40} onChange={(event) => change(index, { match: event.target.value || undefined })} placeholder={t("binMatchHint")} value={bin.match ?? ""} /></div>}
        {bin.entity && !bin.entity.startsWith("calendar.") && binAttributes(hass, bin.entity).length > 0 && <div className="st-bin__value"><span>{t("binValue")}</span><HDSelect ariaLabel={t("binValue")} onChange={(attribute) => change(index, { attribute: attribute || undefined })} options={[{ value: "", label: t("binValueState").replace("{value}", String(hass.states[bin.entity]?.state ?? "")) }, ...binAttributes(hass, bin.entity).map(([key, value]) => ({ value: key, label: `${key}: ${value}` }))]} value={bin.attribute ?? ""} /></div>}
      </div>)}
      {bins.length < 4 && <div className="st-actions"><button className="hd-pill" onClick={() => onBins([...bins, { entity: "", name: "", color: "black" }])} type="button"><HDIcon name="plus" size={16} />{t("binsAdd")}</button></div>}
    </div>}
  </div>;
}

/** Pro: special dates. One switch for all, one per occasion (those of the home's country), and the
 * user's own dates with the animation each one gets. */
function SeasonsPanel({ draft, hass, onUpsell, pro, t, update }: { draft: HomeDeckConfig; hass: HomeAssistant; onUpsell: () => void; pro: boolean; t: (key: TranslationKey) => string; update: (patch: Partial<HomeDeckConfig>) => void }) {
  const seasons = draft.seasons ?? { enabled: false, off: [], custom: [] };
  const set = (patch: Partial<typeof seasons>) => update({ seasons: { ...seasons, ...patch } });
  const country = (hass.config?.country ?? "").toUpperCase();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [effect, setEffect] = useState("confetti");
  const add = () => {
    const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(date);
    if (!name.trim() || !match) return;
    set({ custom: [...seasons.custom, { name: name.trim().slice(0, 40), date: `${match[1]}-${match[2]}`, effect }] });
    setName(""); setDate("");
  };
  const effects = SEASON_EFFECTS.map((value) => ({ value, label: t(`seasonEffect_${value}` as TranslationKey) }));
  // "See" plays an occasion's animation for a few seconds over the settings, with its greeting.
  const [preview, setPreview] = useState<{ id: string; effect: SeasonEffect | null; fireworks: boolean; label: string } | null>(null);
  const greetingOf = (id: string) => id === "birthdays" ? t("seasonBirthdayOf").replace("{name}", t("seasonsSampleName")) : id === "newyear" ? t("seasonNewYear") : t(`seasonGreeting_${id}` as TranslationKey);
  const effectOf = (id: string): SeasonEffect => id === "birthdays" ? "confetti" : RULES.find((rule) => rule.id === id)?.effect ?? "confetti";
  const see = (label: string) => <button className="hd-pill st-season-see" onClick={(event) => { event.preventDefault(); const id = label; setPreview({ id, effect: effectOf(id), fireworks: id === "newyear", label: greetingOf(id) }); }} type="button"><HDIcon name="eye" size={15} />{t("seasonsSee")}</button>;
  return <section className="st-panel">
    <h2>{t("seasonsTitle")}</h2><p>{t("seasonsDescription")}</p>
    <Row label={t("seasonsEnable")}>{pro ? <Switch checked={seasons.enabled} label={t("seasonsEnable")} onChange={(enabled) => set({ enabled })} /> : <button className="hd-pill" onClick={onUpsell} type="button"><HDIcon name="lock" size={14} />Pro</button>}</Row>
    {pro && seasons.enabled && <>
      <div className="st-sub">
        {occasionsFor(country).map((id) => <div className="st-sub__row" key={id}><span>{t(`season_${id}` as TranslationKey)}</span><span className="st-season-actions">{see(id)}<input aria-label={t(`season_${id}` as TranslationKey)} checked={!seasons.off.includes(id)} className="st-switch" onChange={(event) => set({ off: event.target.checked ? seasons.off.filter((item) => item !== id) : [...seasons.off, id] })} type="checkbox" /></span></div>)}
      </div>
      <div className="st-sub">
        <div className="st-sub__title">{t("seasonsCustom")}</div>
        {seasons.custom.map((item, index) => <div className="st-sub__row" key={`${item.name}-${index}`}><span>{item.name} · {item.date.split("-").reverse().join("/")} · {t(`seasonEffect_${item.effect}` as TranslationKey)}</span><span className="st-season-actions"><button className="hd-pill st-season-see" onClick={() => setPreview({ id: `custom:${item.name}`, effect: (SEASON_EFFECTS as string[]).includes(item.effect) ? item.effect as SeasonEffect : "confetti", fireworks: false, label: item.name })} type="button"><HDIcon name="eye" size={15} />{t("seasonsSee")}</button><button aria-label={`${t("removeItem")}: ${item.name}`} className="hd-pill" onClick={() => set({ custom: seasons.custom.filter((_, position) => position !== index) })} type="button"><HDIcon name="trash" size={15} /></button></span></div>)}
        <div className="st-season-add">
          <input aria-label={t("seasonsName")} maxLength={40} onChange={(event) => setName(event.target.value)} placeholder={t("seasonsName")} value={name} />
          <input aria-label={t("seasonsDate")} onChange={(event) => setDate(event.target.value)} type="date" value={date} />
          <HDSelect ariaLabel={t("seasonsEffect")} onChange={setEffect} options={effects} value={effect} />
          <button className="hd-pill" disabled={!name.trim() || !date} onClick={add} type="button"><HDIcon name="plus" size={15} />{t("addItem")}</button>
        </div>
      </div>
    </>}
    {preview && <SeasonPreview closeLabel={t("close")} effect={preview.effect} id={preview.id} fireworks={preview.fireworks} label={preview.label} onClose={() => setPreview(null)} />}
  </section>;
}

/** Choices for this device only: lock editing, and the speaker Spotify starts on from here. */
function DevicePrefsRows({ general, generalBackground, generalKids, hass, onUpsell, pro, sidebarRow, t }: { general: HomeDeckConfig["view_mode"]; generalBackground: string; generalKids: string; hass: HomeAssistant; onUpsell: () => void; pro: boolean; sidebarRow: ReactNode; t: (key: TranslationKey) => string }) {
  const motion = useDevicePref(motionPrefs);
  const setMotion = (patch: Partial<typeof motion>) => setMotionPrefs({ ...motion, ...patch });
  const locked = useDevicePref(editingLocked);
  const childLock = useDevicePref(childLockEnabled);
  const barUnlocked = useDevicePref(keyBarUnlocked);
  const view = useDevicePref(deviceViewMode);
  const background = useDevicePref(deviceBackground);
  const kidsScene = useDevicePref(deviceKidsScene);
  // The layout this device ends up with decides which background choice makes sense here.
  const kids = (view || general) === "kids";
  const pro_ = (free: boolean) => (pro || free ? "" : " (Pro)");
  // Small pictures in the lists: the layout drawing, the background's colors, the Kids scene.
  const layoutThumb = (mode: HomeDeckConfig["view_mode"]) => <LayoutThumb mode={mode} />;
  const backgroundThumb = (preset: string) => <span className="hdx-thumb__fill" style={{ background: BACKGROUNDS.find(([id]) => id === preset)?.[2] ?? BACKGROUNDS[0][2] }} />;
  const sceneThumb = (scene: string) => <span className={`st-kids-scene st-kids-scene--${scene}`} />;
  const speaker = useDevicePref(spotifySpeaker);
  const awake = useDevicePref(keepAwakeMode);
  const textSize = useDevicePref(textScale);
  const interfaceSize = useDevicePref(uiSize);
  const sizes = [{ value: "small", label: t("sizeSmall") }, { value: "normal", label: t("sizeNormal") }, { value: "large", label: t("sizeLarge") }];
  const spotify = Object.values(hass.states).find((state) => state.entity_id.startsWith("media_player.") && (state.entity_id.includes("spotify") || state.attributes.source === "Spotify" || String(state.attributes.friendly_name ?? "").toLowerCase().includes("spotify")));
  const sources = Array.isArray(spotify?.attributes.source_list) ? spotify.attributes.source_list.map(String) : [];
  return <>
    <h3 className="st-category">{t("deviceCatLook")}</h3>
    <Row description={t("deviceLayoutDescription")} label={t("deviceLayout")}><HDSelect ariaLabel={t("deviceLayout")} onChange={setDeviceViewMode} options={[{ value: "", label: t("useGeneral"), thumb: layoutThumb(general) }, ...VIEW_MODES.map((mode) => ({ value: mode.id, label: `${t(mode.name)}${pro_(FREE_VIEW_MODES.includes(mode.id))}`, thumb: layoutThumb(mode.id) }))]} value={view} /></Row>
    {kids
      ? <Row label={t("deviceKidsScene")}><HDSelect ariaLabel={t("deviceKidsScene")} onChange={setDeviceKidsScene} options={[{ value: "", label: t("useGeneral"), thumb: sceneThumb(generalKids) }, ...KIDS_SCENES.map(([scene, label]) => ({ value: scene, label: t(label), thumb: sceneThumb(scene) }))]} value={kidsScene} /></Row>
      : <Row label={t("deviceBackground")}><HDSelect ariaLabel={t("deviceBackground")} onChange={setDeviceBackground} options={[{ value: "", label: t("useGeneral"), thumb: backgroundThumb(generalBackground) }, ...BACKGROUNDS.map(([preset, label]) => ({ value: preset, label: `${t(label)}${pro_(FREE_BACKGROUNDS.includes(preset))}`, thumb: backgroundThumb(preset) }))]} value={background} /></Row>}
    <TextSizeRow t={t} value={textSize} />
    <Row description={t("deviceUiSizeDescription")} label={t("deviceUiSize")}><HDSegmented ariaLabel={t("deviceUiSize")} onChange={(size) => setUiSize(size as SizeChoice)} options={sizes} value={interfaceSize} /></Row>
    <h3 className="st-category">{t("deviceCatMotion")}</h3>
    <Row description={t("motionUiDescription")} label={t("motionUi")}><Switch checked={motion.ui} label={t("motionUi")} onChange={(ui) => setMotion({ ui })} /></Row>
    <Row description={t("animationsDescription")} label={t("motionCards")}>{pro ? <Switch checked={motion.cards} label={t("motionCards")} onChange={(cards) => setMotion({ cards })} /> : <button className="hd-pill" onClick={onUpsell} type="button"><HDIcon name="lock" size={14} />Pro</button>}</Row>
    <Row label={t("animateBackground")}><Switch checked={motion.background} label={t("animateBackground")} onChange={(background) => setMotion({ background })} /></Row>
    <h3 className="st-category">{t("deviceCatWall")}</h3>
    {sidebarRow}
    <Row description={`${t("keepAwakeDescription")}${isSilk() ? ` ${t("keepAwakeEcho")}` : ""}`} label={t("keepAwake")}><HDSelect ariaLabel={t("keepAwake")} onChange={(mode) => setKeepAwakeMode(mode as "auto" | "on" | "off")} options={[{ value: "auto", label: t("keepAwakeAuto") }, { value: "on", label: t("keepAwakeOn") }, { value: "off", label: t("keepAwakeOff") }]} value={awake} /></Row>
    <Row description={t("lockEditingDescription")} label={t("lockEditing")}><Switch checked={locked} label={t("lockEditing")} onChange={setEditingLocked} /></Row>
    <Row description={t("childLockDescription")} label={t("childLock")}><Switch checked={childLock} label={t("childLock")} onChange={setChildLockEnabled} /></Row>
    {barUnlocked && <KeyBarRows hass={hass} t={t} />}
    {spotify && <h3 className="st-category">{t("deviceCatMusic")}</h3>}
    {spotify && <Row description={t("spotifySpeakerDescription")} label={t("spotifySpeaker")}><HDSelect ariaLabel={t("spotifySpeaker")} onChange={setSpotifySpeaker} options={[{ value: "", label: t("spotifySpeakerAny") }, ...[...new Set([...(speaker ? [speaker] : []), ...sources])].map((source) => ({ value: source, label: source }))]} value={speaker} /></Row>}
  </>;
}

/** Pro: the camera pops up when the doorbell rings. The trigger and camera are guessed the first time. */
function DoorbellPanel({ draft, hass, onUpsell, pro, t, update }: { draft: HomeDeckConfig; hass: HomeAssistant; onUpsell: () => void; pro: boolean; t: (key: TranslationKey) => string; update: (patch: Partial<HomeDeckConfig>) => void }) {
  const doorbell = draft.doorbell;
  const [testing, setTesting] = useState(false);
  const triggers = useMemo(() => doorbellCandidates(hass).map((state) => state.entity_id), [hass.states]);
  const cameras = useMemo(() => cameraIds(hass), [hass.states]);
  const label = (id: string) => String(hass.states[id]?.attributes.friendly_name ?? id);
  const set = (patch: Partial<HomeDeckConfig["doorbell"]>) => update({ doorbell: { ...doorbell, ...patch } });
  const turnOn = (on: boolean) => {
    if (on && !pro) { onUpsell(); return; }
    const trigger = doorbell.trigger || triggers[0] || "";
    set({ enabled: on, ...(on && !doorbell.trigger ? { trigger } : {}), ...(on && !doorbell.camera ? { camera: guessDoorbellCamera(hass, trigger) } : {}) });
  };
  const options = (ids: string[], current: string) => [{ value: "", label: t("none") }, ...[...new Set([...(current ? [current] : []), ...ids])].map((id) => ({ value: id, label: label(id) }))];
  const seconds = [30, 60, 120, 300].map((value) => ({ value: String(value), label: value < 60 ? `${value} s` : `${value / 60} min` }));
  return <section className="st-panel">
    <h2>{t("doorbellTitle")}</h2><p>{t("doorbellDescription")}</p>
    <Row label={t("doorbellEnable")}>{pro ? <Switch checked={doorbell.enabled} label={t("doorbellEnable")} onChange={turnOn} /> : <button className="hd-pill" onClick={onUpsell} type="button"><HDIcon name="lock" size={14} />Pro</button>}</Row>
    {pro && doorbell.enabled && <div className="st-sub">
      <div className="st-sub__row"><span>{t("doorbellTrigger")}</span><HDSelect ariaLabel={t("doorbellTrigger")} onChange={(trigger) => set({ trigger, ...(doorbell.camera ? {} : { camera: guessDoorbellCamera(hass, trigger) }) })} options={options(triggers, doorbell.trigger)} value={doorbell.trigger} /></div>
      <div className="st-sub__row"><span>{t("doorbellCamera")}</span><HDSelect ariaLabel={t("doorbellCamera")} onChange={(camera) => set({ camera })} options={options(cameras, doorbell.camera)} value={doorbell.camera} /></div>
      <div className="st-sub__row"><span>{t("doorbellSeconds")}</span><HDSelect ariaLabel={t("doorbellSeconds")} onChange={(value) => set({ seconds: Number(value) })} options={seconds} value={String(doorbell.seconds)} /></div>
      <div className="st-actions st-actions--end"><button className="hd-pill" onClick={() => setTesting(true)} type="button"><HDIcon name="bell" size={16} />{t("doorbellTest")}</button></div>
    </div>}
    {testing && <DoorbellPopup camera={doorbell.camera} hass={hass} onClose={() => setTesting(false)} seconds={doorbell.seconds} t={t} />}
  </section>;
}

/** Makes HomeDeck the screen Home Assistant opens; applied at once, stored by Home Assistant. */
function StartScreenPanel({ hass, t }: { hass: HomeAssistant; t: (key: TranslationKey) => string }) {
  const [state, setState] = useState<DefaultPanelState | null>(null);
  const [error, setError] = useState<TranslationKey | null>(null);
  useEffect(() => { void getDefaultPanel(hass).then(setState); }, [hass.connection]);
  if (!state) return null;
  const toggle = async (scope: "user" | "system", on: boolean) => {
    setError(null);
    try {
      if (scope === "user") await setUserDefault(hass, on, state.synced);
      else await setSystemDefault(hass, on);
      setState({ ...state, [scope]: on });
    } catch {
      setError(scope === "system" ? "startScreenAdminOnly" : "startScreenFailed");
    }
  };
  return <section className="st-panel">
    <h2>{t("startScreen")}</h2><p>{t("startScreenDescription")}</p>
    <Row description={state.synced ? t("startScreenMineDescription") : t("startScreenBrowserDescription")} label={t("startScreenMine")}><Switch checked={state.user} label={t("startScreenMine")} onChange={(on) => void toggle("user", on)} /></Row>
    {state.synced && <Row description={t("startScreenEveryoneDescription")} label={t("startScreenEveryone")}><Switch checked={state.system} label={t("startScreenEveryone")} onChange={(on) => void toggle("system", on)} /></Row>}
    {error && <p className="hd-pro__error">{t(error)}</p>}
  </section>;
}

function Meter({ label, limit, used }: { label: string; limit: number; used: number }) {
  return <div className={used > limit ? "st-meter st-meter--over" : "st-meter"}>
    <span><b>{label}</b><i>{used} / {limit}</i></span>
    <em><span style={{ width: `${Math.min(100, (used / limit) * 100)}%` }} /></em>
  </div>;
}

function moveItem<T>(items: T[], from: number, to: number): T[] {
  const next = [...items];
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
}

/** Removing the license takes a second tap within a few seconds. */
function RemoveLicenseButton({ onRemove, t }: { onRemove: () => void; t: (key: TranslationKey) => string }) {
  const [asking, setAsking] = useState(false);
  useEffect(() => {
    if (!asking) return;
    const timer = window.setTimeout(() => setAsking(false), 5000);
    return () => window.clearTimeout(timer);
  }, [asking]);
  return <button className={asking ? "hd-pill hd-pill--danger" : "hd-pill"} onClick={() => { if (asking) { setAsking(false); onRemove(); } else setAsking(true); }} type="button">{asking ? t("proRemoveConfirm") : t("proRemoveAction")}</button>;
}

/** Which people show in the header: all of them until some are turned off, so new people show up on their own. */
/** Pro: up to eight temperature sensors under the screensaver clock, one select each, the next one shown once the last is chosen. */
function SaverTemperatures({ chosen, hass, onChange, t }: { chosen: string[]; hass: HomeAssistant; onChange: (ids: string[]) => void; t: (key: TranslationKey) => string }) {
  const name = (id: string) => String(hass.states[id]?.attributes.friendly_name ?? id);
  const sensors = useMemo(() => Object.keys(hass.states).filter((id) => id.startsWith("sensor.") && hass.states[id]?.attributes.device_class === "temperature").sort((a, b) => name(a).localeCompare(name(b))), [Object.keys(hass.states).length]);
  if (sensors.length === 0 && chosen.length === 0) return null;
  const slots = chosen.length < 8 ? [...chosen, ""] : chosen;
  const set = (index: number, id: string) => onChange(slots.map((item, at) => (at === index ? id : item)).filter(Boolean).filter((item, at, list) => list.indexOf(item) === at));
  return <div className="st-group">
    <Row description={t("saverTempsDescription")} label={t("saverTemps")}><span /></Row>
    <div className="st-sub">
      {slots.map((value, index) => <div className="st-sub__row" key={index}><span>{t("saverTempsSensor").replace("{n}", String(index + 1))}</span><HDSelect ariaLabel={t("saverTempsSensor").replace("{n}", String(index + 1))} onChange={(id) => set(index, id)} options={[{ value: "", label: t("none") }, ...[...new Set([...(value ? [value] : []), ...sensors.filter((id) => id === value || !chosen.includes(id))])].map((id) => ({ value: id, label: name(id) }))]} value={value} /></div>)}
    </div>
  </div>;
}

const KEYBAR_DOMAINS = ["script", "scene", "light", "switch", "input_boolean", "fan", "cover", "media_player", "button", "input_button", "automation"];

/** This device's shortcut bar: on or off, the dock hidden or not, and 9 parts each with a name and what it runs. */
/** Text size on this device: a slider from 80% to 180%, with a card beside it drawn at the size chosen. */
function TextSizeRow({ t, value }: { t: (key: TranslationKey) => string; value: number }) {
  const [draft, setDraft] = useState<number | null>(null);
  const shown = draft ?? value;
  const commit = () => { if (draft != null) { setTextScale(draft); setDraft(null); } };
  return <div className="st-textsize">
    <Row description={t("deviceTextSizeDescription")} label={t("deviceTextSize")}><span className="st-value">{Math.round(shown * 100)}%</span></Row>
    <div className="st-textsize__body">
      <div className="st-textsize__control">
        <span aria-hidden="true" className="st-textsize__a st-textsize__a--small">A</span>
        <input aria-label={t("deviceTextSize")} max={TEXT_SCALE_MAX} min={TEXT_SCALE_MIN} onChange={(event) => setDraft(Number(event.target.value))} onKeyUp={commit} onPointerUp={commit} onTouchEnd={commit} step={0.05} type="range" value={shown} />
        <span aria-hidden="true" className="st-textsize__a st-textsize__a--large">A</span>
        {shown !== 1 && <button className="hd-pill" onClick={() => { setDraft(null); setTextScale(1); }} type="button">{t("sizeNormal")}</button>}
      </div>
      <div aria-hidden="true" className="st-textsize__preview" style={{ "--hd-font": shown } as CSSProperties}>
        <div className="device-tile device-tile--active">
          <div className="device-tile__top"><span className="device-tile__icon"><HDIcon name="light" size={22} /></span></div>
          <div className="device-tile__copy"><strong>{t("textSizeSampleName")}</strong><span>{t("textSizeSampleState")}</span></div>
        </div>
        <div className="device-tile">
          <div className="device-tile__top"><span className="device-tile__icon"><HDIcon name="sensor" size={22} /></span></div>
          <div className="device-tile__copy"><strong>{t("textSizeSampleSensor")}</strong><span>22,5 °C</span></div>
        </div>
      </div>
    </div>
  </div>;
}

/** The version; seven quick taps on it unlock (or lock again) the test shortcut bar on this device. */
function VersionRow({ t, version }: { t: (key: TranslationKey) => string; version?: string }) {
  const taps = useRef<number[]>([]);
  const tap = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((at) => now - at < 3000), now];
    if (taps.current.length >= 7) { taps.current = []; setKeyBarUnlocked(!keyBarUnlocked()); }
  };
  return <Row description={t("madeWith")} label={version ? t("version") : "HomeDeck"}>{version && <span className="st-value" onClick={tap} role="presentation">{version}</span>}</Row>;
}

function KeyBarRows({ hass, t }: { hass: HomeAssistant; t: (key: TranslationKey) => string }) {
  const prefs = useDevicePref(keyBar);
  const name = (id: string) => String(hass.states[id]?.attributes.friendly_name ?? id);
  const entities = useMemo(() => Object.keys(hass.states).filter((id) => KEYBAR_DOMAINS.includes(id.split(".")[0])).sort((a, b) => name(a).localeCompare(name(b))), [Object.keys(hass.states).length]);
  const setSlot = (index: number, change: Partial<{ label: string; entity: string }>) => setKeyBar({ ...prefs, slots: prefs.slots.map((slot, at) => (at === index ? { ...slot, ...change } : slot)) });
  return <div className="st-group">
    <Row description={t("keyBarDescription")} label={t("keyBar")}><Switch checked={prefs.on} label={t("keyBar")} onChange={(on) => setKeyBar({ ...prefs, on })} /></Row>
    {prefs.on && <div className="st-sub">
      <label className="st-sub__row"><span>{t("keyBarHideDock")}</span><Switch checked={prefs.hideDock} label={t("keyBarHideDock")} onChange={(hideDock) => setKeyBar({ ...prefs, hideDock })} /></label>
      {Array.from({ length: KEYBAR_SLOTS }, (_, index) => {
        const slot = prefs.slots[index];
        return <div className="st-keybar" key={index}>
          <span className="st-keybar__n">{index + 1}</span>
          <input aria-label={`${t("keyBarName")} ${index + 1}`} className="st-input st-input--framed" maxLength={24} onChange={(event) => setSlot(index, { label: event.target.value })} placeholder={t("keyBarName")} value={slot.label} />
          <HDSelect ariaLabel={`${t("keyBarAction")} ${index + 1}`} onChange={(entity) => setSlot(index, { entity, ...(slot.label || !entity ? {} : { label: name(entity).toLocaleUpperCase() }) })} options={[{ value: "", label: t("none") }, ...[...new Set([...(slot.entity ? [slot.entity] : []), ...entities])].map((id) => ({ value: id, label: name(id) }))]} value={slot.entity} />
        </div>;
      })}
    </div>}
  </div>;
}

function PresencePeople({ chosen, hass, onChange, t }: { chosen: string[]; hass: HomeAssistant; onChange: (ids: string[]) => void; t: (key: TranslationKey) => string }) {
  const people = Object.keys(hass.states).filter((id) => id.startsWith("person.")).sort((a, b) => name(a).localeCompare(name(b)));
  function name(id: string) { return String(hass.states[id]?.attributes.friendly_name ?? id); }
  if (people.length < 2) return null;
  const shown = (id: string) => chosen.length === 0 || chosen.includes(id);
  const toggle = (id: string, on: boolean) => {
    const current = chosen.length === 0 ? people : chosen.filter((item) => people.includes(item));
    const next = on ? [...current, id] : current.filter((item) => item !== id);
    // Everyone (or nobody, which would empty the header) is saved as "everyone".
    onChange(next.length === 0 || people.every((item) => next.includes(item)) ? [] : next);
  };
  return <div className="st-sub" role="group" aria-label={t("presencePeople")}>
    <span className="st-sub__title">{t("presencePeople")}</span>
    {people.map((id) => <label className="st-sub__row" key={id}><span>{name(id)}</span><Switch checked={shown(id)} label={name(id)} onChange={(on) => toggle(id, on)} /></label>)}
  </div>;
}

const NOTICE_DOMAINS = ["binary_sensor", "event", "sensor", "cover", "lock", "switch", "input_boolean", "alarm_control_panel", "update", "timer", "vacuum", "light", "fan"];

/** Notices beside the people in the header: the entities chosen here, shown only when they have something to say. */
function NoticesPanel({ hass, home, language, onChange, t }: { hass: HomeAssistant; home: HomeDeckConfig["home"]; language?: string; onChange: (patch: Partial<HomeDeckConfig["home"]>) => void; t: (key: TranslationKey) => string }) {
  const ids = home.badges ?? [];
  const texts = home.badge_texts ?? {};
  const rules = home.badge_rules ?? {};
  const styles = home.badge_styles ?? {};
  const taps = home.badge_taps ?? {};
  const [ruling, setRuling] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const name = (id: string) => String(hass.states[id]?.attributes.friendly_name ?? id);
  // Scripts, buttons, automations and scenes a notice can run when tapped.
  const runnable = useMemo(() => Object.keys(hass.states).filter((id) => NOTICE_RUN_DOMAINS.includes(id.split(".")[0])).sort((a, b) => name(a).localeCompare(name(b))), [ruling]);
  // Every candidate from Home Assistant, grouped by kind (events and unassigned sensors included).
  const groups = useMemo<Room[]>(() => NOTICE_DOMAINS.map((domain) => ({
    id: domain, name: domainLabel(domain, language), icon: null, aliases: [], floor_id: null, device_count: 0,
    entities: Object.keys(hass.states).filter((id) => id.startsWith(`${domain}.`)).sort((a, b) => name(a).localeCompare(name(b))).map((id) => ({
      entity_id: id, domain, name: name(id), area_id: "", device_id: null, device_class: typeof hass.states[id]?.attributes.device_class === "string" ? String(hass.states[id]!.attributes.device_class) : null, icon: null,
    })),
  })).filter((group) => group.entities.length > 0), [picking]);
  const toggle = (id: string) => {
    const { [id]: _text, ...others } = texts;
    const { [id]: _rule, ...otherRules } = rules;
    const { [id]: _style, ...otherStyles } = styles;
    const { [id]: _tap, ...otherTaps } = taps;
    onChange(ids.includes(id) ? { badges: ids.filter((item) => item !== id), badge_texts: others, badge_rules: otherRules, badge_styles: otherStyles, badge_taps: otherTaps } : { badges: [...ids, id].slice(0, 12) });
  };
  const setRule = (id: string, rule: HomeDeckCondition | undefined) => {
    const { [id]: _rule, ...others } = rules;
    onChange({ badge_rules: rule ? { ...others, [id]: rule } : others });
  };
  const setStyle = (id: string, style: "" | "icon" | "text") => {
    const { [id]: _style, ...others } = styles;
    onChange({ badge_styles: style ? { ...others, [id]: style } : others });
  };
  const setTap = (id: string, tap: HomeDeckNoticeTap | null) => {
    const { [id]: _tap, ...others } = taps;
    onChange({ badge_taps: tap ? { ...others, [id]: tap } : others });
  };
  const setText = (id: string, text: string) => {
    const { [id]: _text, ...others } = texts;
    onChange({ badge_texts: text ? { ...others, [id]: text } : others });
  };
  return <section className="st-panel">
    <h2>{t("noticesTitle")}</h2><p>{t("noticesDescription")}</p>
    {ids.length > 0 && <div className="st-group">
      {ids.map((id) => <Fragment key={id}><Row description={id} label={name(id)}><div className="st-notice-edit"><button aria-expanded={ruling === id} aria-label={`${t("noticeOptions")}: ${name(id)}`} className={`hd-pill ${rules[id] || styles[id] || texts[id] || taps[id] ? "hd-pill--set" : ""}`} onClick={() => setRuling((open) => open === id ? null : id)} type="button">{t("noticeOptions")}</button><button aria-label={`${t("removeItem")}: ${name(id)}`} className="hd-pill" onClick={() => toggle(id)} type="button"><HDIcon name="minus" size={14} />{t("removeItem")}</button></div></Row>
        {ruling === id && <div className="st-notice-rules">
          <div className="hd-rules__row"><span className="hd-rules__label">{t("noticeStyle")}</span><div className="room-options__icons" role="radiogroup" aria-label={t("noticeStyle")}>{([["", "noticeStyleBoth"], ["icon", "noticeStyleIcon"], ["text", "noticeStyleText"]] as const).map(([value, label]) => <button aria-checked={(styles[id] ?? "") === value} key={value} onClick={() => setStyle(id, value)} role="radio" type="button">{t(label)}</button>)}</div></div>
          {styles[id] !== "icon" && <div className="hd-rules__row"><span className="hd-rules__label">{t("noticeText")}</span><input aria-label={`${t("noticeText")}: ${name(id)}`} className="st-input st-input--framed" maxLength={40} onChange={(event) => setText(id, event.target.value)} placeholder={name(id)} value={texts[id] ?? ""} /></div>}
          <div className="hd-rules__row"><span className="hd-rules__label">{t("noticeTap")}</span><div className="room-options__icons" role="radiogroup" aria-label={t("noticeTap")}>{([["", "noticeTapDetails"], ["dismiss", "noticeTapDismiss"], ...(NOTICE_OFF_DOMAINS.has(id.split(".")[0]) ? [["off", "noticeTapOff"] as const] : []), ...(runnable.length > 0 ? [["run", "noticeTapRun"] as const] : [])] as const).map(([value, label]) => <button aria-checked={(taps[id]?.action ?? "") === value} key={value} onClick={() => setTap(id, value ? { action: value, ...(value === "run" ? { target: taps[id]?.target ?? runnable[0] } : {}) } : null)} role="radio" type="button">{t(label)}</button>)}</div></div>
          {taps[id]?.action === "run" && <div className="hd-rules__row"><span className="hd-rules__label">{t("noticeTapTarget")}</span><HDSelect ariaLabel={t("noticeTapTarget")} onChange={(target) => setTap(id, { action: "run", target })} options={runnable.map((item) => ({ value: item, label: name(item) }))} value={taps[id]?.target && runnable.includes(taps[id]!.target!) ? taps[id]!.target! : runnable[0]} /></div>}
          {taps[id] && <small>{t("noticeTapHint")}</small>}
          <small>{t("noticeRulesHint")}</small>
          <ConditionFields hass={hass} onChange={(rule) => setRule(id, rule)} t={t} value={rules[id]} />
        </div>}</Fragment>)}
    </div>}
    <div className="st-actions"><button className="hd-pill" disabled={ids.length >= 12} onClick={() => setPicking(true)} type="button"><HDIcon name="plus" size={16} />{t("addNotice")}</button></div>
    {picking && <EntityPicker language={language} onClose={() => setPicking(false)} onToggle={toggle} rooms={groups} selected={ids} t={t} title={t("addNotice")} />}
  </section>;
}

/** Calendar and reminders beside the clock: what to show and from which entities. */
function AgendaPanel({ draft, hass, t, update }: { draft: HomeDeckConfig; hass: HomeAssistant; t: (key: TranslationKey) => string; update: (patch: Partial<HomeDeckConfig>) => void }) {
  const agenda = draft.agenda;
  const set = (patch: Partial<HomeDeckConfig["agenda"]>) => update({ agenda: { ...agenda, ...patch } });
  const calendars = Object.keys(hass.states).filter((id) => id.startsWith("calendar.")).sort();
  const lists = Object.keys(hass.states).filter((id) => id.startsWith("todo.")).sort();
  const name = (id: string) => String(hass.states[id]?.attributes.friendly_name ?? id);
  // An empty choice means every calendar, so new calendars show up on their own.
  const shown = (id: string) => agenda.calendars.length === 0 || agenda.calendars.includes(id);
  const toggleCalendar = (id: string, on: boolean) => {
    const current = agenda.calendars.length === 0 ? calendars : agenda.calendars;
    const next = on ? [...current, id] : current.filter((item) => item !== id);
    set({ calendars: calendars.every((item) => next.includes(item)) ? [] : next });
  };
  if (calendars.length === 0 && lists.length === 0) return null;
  return <section className="st-panel">
    <h2>{t("agendaTitle")}</h2><p>{t("agendaDescription")}</p>
    <div className="st-group">
      <Row description={t("todayCardDescription")} label={t("todayCard")}><Switch checked={agenda.today_card} label={t("todayCard")} onChange={(today_card) => set({ today_card })} /></Row>
    </div>
    {calendars.length > 0 && <div className="st-group">
      <Row label={t("showCalendar")}><Switch checked={agenda.show_calendar} label={t("showCalendar")} onChange={(show_calendar) => set({ show_calendar })} /></Row>
      {(agenda.show_calendar || agenda.today_card) && <div className="st-sub" role="group" aria-label={t("calendars")}>
        <span className="st-sub__title">{t("calendars")}</span>
        {calendars.map((id) => <label className="st-sub__row" key={id}><span>{name(id)}</span><Switch checked={shown(id)} label={name(id)} onChange={(on) => toggleCalendar(id, on)} /></label>)}
      </div>}
    </div>}
    {lists.length > 0 && <div className="st-group">
      <Row label={t("showTodo")}><Switch checked={agenda.show_todo} label={t("showTodo")} onChange={(show_todo) => set({ show_todo })} /></Row>
      {(agenda.show_todo || agenda.today_card) && <div className="st-sub">
        <div className="st-sub__row"><span>{t("todoList")}</span><HDSelect ariaLabel={t("todoList")} onChange={(todo_entity) => set({ todo_entity })} options={lists.map((id) => ({ value: id, label: name(id) }))} value={lists.includes(agenda.todo_entity) ? agenda.todo_entity : lists[0]} /></div>
        <label className="st-sub__row"><span>{t("todoNoDate")}</span><Switch checked={agenda.todo_no_date} label={t("todoNoDate")} onChange={(todo_no_date) => set({ todo_no_date })} /></label>
      </div>}
    </div>}
  </section>;
}
