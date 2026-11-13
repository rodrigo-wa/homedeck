import { useContext, useEffect, useState } from "react";
import { newYearCountdown } from "../seasons";
import { OccasionContext } from "./SeasonLayer";
import { weatherConditionLabel, type TranslationKey } from "../i18n";
import type { HomeDeckConfig } from "../types/config";
import type { HomeAssistant } from "../types/home-assistant";
import { useWeather } from "../weather";
import { HDIcon, type IconName } from "./HDIcon";
import { SaverAgenda } from "./Agenda";
import type { Room } from "../types/discovery";
import { entityIndex } from "../screens/types";

function weatherIcon(condition: string): IconName {
  if (condition === "sunny") return "sun";
  if (condition === "clear-night") return "moon";
  return "cloud";
}

interface ScreensaverProps {
  config: HomeDeckConfig;
  hass: HomeAssistant;
  language?: string;
  onDismiss: () => void;
  /** The panel's rooms, to name each temperature sensor by its room. */
  rooms?: Room[];
  t: (key: TranslationKey) => string;
}

/** The chosen temperature sensors as "Room 22.5°", leaving out the ones without a number. */
function roomTemperatures(ids: string[], hass: HomeAssistant, rooms: Room[], language?: string) {
  const index = entityIndex(rooms);
  const format = new Intl.NumberFormat(language, { maximumFractionDigits: 1 });
  return ids.flatMap((id) => {
    const state = hass.states[id];
    const value = Number(state?.state);
    if (!state || state.state === "" || !Number.isFinite(value)) return [];
    const entity = index.byId.get(id);
    const name = (entity && index.roomName(entity)) || String(state.attributes.friendly_name ?? id);
    return [{ id, name, value: `${format.format(value)}°` }];
  });
}

/** Large clock with date and weather over a blurred copy of the panel background. */
export function Screensaver({ config, hass, language, onDismiss, rooms, t }: ScreensaverProps) {
  const occasion = useContext(OccasionContext);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 5_000);
    const key = () => onDismiss();
    window.addEventListener("keydown", key);
    return () => { window.clearInterval(timer); window.removeEventListener("keydown", key); };
  }, [onDismiss]);

  const { now: weather } = useWeather(hass, config);
  const temperature = weather?.temperature != null ? Math.round(weather.temperature) : undefined;

  const large = config.screensaver.size === "large";
  const temperatures = roomTemperatures(config.screensaver.sensors ?? [], hass, rooms ?? [], language);

  return <div aria-label={t("tapToReturn")} className={`hd-saver${large ? " hd-saver--large" : ""}`} onClick={onDismiss} role="button" tabIndex={0}>
    <div className="hd-saver__clock">
      <time className="hd-saver__time">{new Intl.DateTimeFormat(language, { hour: "2-digit", minute: "2-digit" }).format(now)}</time>
      <div className="hd-saver__date">{new Intl.DateTimeFormat(language, { weekday: "long", day: "numeric", month: "long" }).format(now)}</div>
      {large && (weather || temperatures.length > 0) && <div className={`hd-saver__stats${temperatures.length > 3 ? " hd-saver__stats--many" : ""}`}>
        {weather && temperature != null && <div className="hd-saver__stat"><b>{temperature}°</b><span><HDIcon name={weatherIcon(weather.condition ?? "")} size={16} />{weather.condition ? weatherConditionLabel(weather.condition, language) : t("weather")}</span></div>}
        {temperatures.map((item) => <div className="hd-saver__stat" key={item.id}><b>{item.value}</b><span>{item.name}</span></div>)}
      </div>}
      {!large && weather && <div className="hd-saver__weather"><HDIcon name={weatherIcon(weather.condition ?? "")} size={22} /><span>{temperature != null ? `${temperature}°` : ""}{temperature != null && weather.condition ? " · " : ""}{weather.condition ? weatherConditionLabel(weather.condition, language) : ""}</span></div>}
      {!large && temperatures.length > 0 && <div className="hd-saver__rooms">{temperatures.map((item) => <span key={item.id}><HDIcon name="climate" size={20} /><span>{item.name}</span><b>{item.value}</b></span>)}</div>}
      {(() => {
        // Special dates: the greeting on the day, and on New Year's Eve the time left to midnight.
        const eve = occasion?.id === "newyear" ? newYearCountdown(now) : null;
        if (eve) return <div className="hd-saver__season">{t("seasonNewYearIn").replace("{year}", String(eve.year)).replace("{time}", eve.hours > 0 ? `${eve.hours} h ${String(eve.minutes).padStart(2, "0")} min` : `${eve.minutes} min`)}</div>;
        return occasion?.phase === "day" && occasion.greeting ? <div className="hd-saver__season">{occasion.greeting}</div> : null;
      })()}
    </div>
    {(config.screensaver.show_events || config.screensaver.show_todo) && <SaverAgenda config={config} hass={hass} language={language} showEvents={Boolean(config.screensaver.show_events)} showTodo={Boolean(config.screensaver.show_todo)} t={t} />}
    <div className="hd-saver__hint">{t("tapToReturn")}</div>
  </div>;
}
