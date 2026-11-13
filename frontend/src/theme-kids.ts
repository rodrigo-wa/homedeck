// The Kids layout (Pro): the grid layout dressed as a children's game. Rounded type, chunky candy-colored
// cards with a solid "3D" edge, bouncy motion and animated scenes behind (components/KidsScene.tsx).
// Everything is scoped to .view-kids, so the other layouts never see it.
export const themeKids = String.raw`
.app-shell.view-kids {
  --f-display: "HomeDeck Fredoka", "Fredoka", "Baloo 2", "Segoe UI", system-ui, sans-serif;
  --f-body: "HomeDeck Fredoka", "Fredoka", "Baloo 2", "Segoe UI", system-ui, sans-serif;
  --kid-ink: #2b2140; --kid-ink-2: rgba(43,33,64,.68);
  --ink: #fff; --ink-2: rgba(255,255,255,.88); --ink-3: rgba(255,255,255,.75);
  --paper-ink: var(--kid-ink); --paper-ink-2: var(--kid-ink-2);
  --glass: #fffdf8; --glass-strong: #fff; --line: rgba(255,255,255,.9);
  --hd-pill: 999px; --hd-blur: 0px;
  /* Buttons are white unless they sit in a card, which hands down its own color. */
  --btn: #fffdf8;
  --kid: #ffd43b; --kid-deep: #e0a800; --kid-soft: #fff3bf;
  --kid-spring: cubic-bezier(.34,1.56,.64,1);
}
.app-shell.view-kids .ambient-background { display: none; }

/* Six candy colors, one per card in turn: yellow, mint, sky, pink, lavender, orange. */
.app-shell.view-kids .hd-item:nth-child(6n+1) { --kid: #ffd43b; --kid-deep: #e0a800; --kid-soft: #fff3bf; }
.app-shell.view-kids .hd-item:nth-child(6n+2) { --kid: #63e6a4; --kid-deep: #2fb57a; --kid-soft: #d3f9e6; }
.app-shell.view-kids .hd-item:nth-child(6n+3) { --kid: #74c0fc; --kid-deep: #3b8fd6; --kid-soft: #d6ecff; }
.app-shell.view-kids .hd-item:nth-child(6n+4) { --kid: #ff8fab; --kid-deep: #e0567b; --kid-soft: #ffe0e9; }
.app-shell.view-kids .hd-item:nth-child(6n+5) { --kid: #b197fc; --kid-deep: #7f63e0; --kid-soft: #ece5ff; }
.app-shell.view-kids .hd-item:nth-child(6n+6) { --kid: #ffa94d; --kid-deep: #e07a1a; --kid-soft: #ffe8cc; }

/* Header: big friendly type. On the light scenes (sky, ocean, candy) dark ink with a white halo; in space
   white with a dark edge, so it reads over clouds, bubbles and stars alike. */
.app-shell.view-kids { --kid-head: #1f3155; --kid-head-shadow: 0 0 2px #fff, 0 0 8px #fff, 0 0 16px rgba(255,255,255,.85); }
.app-shell.view-kids.kids-scene--space { --kid-head: #fff; --kid-head-shadow: 0 2px 0 rgba(20,14,48,.45), 0 0 14px rgba(20,14,48,.35); }
.app-shell.view-kids :is(.context-header__clock span, .context-header__clock strong, .home-status h1, .home-status span, .home-status p, .operational-heading, .operational-heading span, .room-operational-header h1, .room-operational-header .eyebrow, .collection-header h1, .collection-header .eyebrow, .collection-header p, .sb-main__header h1, .page-header h1, .edit-hint, .screen > header .eyebrow, .empty-state p, .hd-section, .hd-section span, .hd-section input) {
  color: var(--kid-head); text-shadow: var(--kid-head-shadow);
}
.app-shell.view-kids :is(.context-header__clock strong, .home-status h1, .room-operational-header h1) { font-weight: 700; letter-spacing: 0; }
.app-shell.view-kids .eyebrow { letter-spacing: .06em; }
/* Widget labels (SECURITY, CLIMATE...) fit next to their icon: tighter letters, and "…" if still too long. */
.app-shell.view-kids .widget-card__label { letter-spacing: .03em; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* The game look: a near-black outline and solid shadow, pastel cards, glossy candy buttons. */
.app-shell.view-kids { --kid-shadow: rgba(35,27,61,.42); --kid-dark: #231b3d; --kid-edge: calc(var(--u)*.32); --kid-drop: calc(var(--u)*.55); }
/* Glossy candy surface: lighter top half, a white shine, a dark outline and a dark solid shadow. Set --btn for its color. */
.app-shell.view-kids :is(.room-card__power, .device-controls button, .tile-buttons button, .tile-chips button, .tile-target button, .climate-quick-control > div button, .scene-strip .hd-item > button:first-child, .global-actions > button, .room-actions > button, .round-action, .weather-chip, .hd-notice, .hd-agenda__button, .hd-link__buttons button, .hd-link__run, .spotify-card__start, .spotify-card button, .hd-player__controls button, .navigation-dock button.navigation-dock__active, .edit-fab, .room-selector__list > button[aria-selected="true"]) {
  /* Jelly volume: a shine at the top left, light to dark from top to bottom, a bright rim above and a shaded rim below. */
  background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%),
    linear-gradient(180deg, color-mix(in srgb, var(--btn) 50%, #fff) 0%, var(--btn) 55%, color-mix(in srgb, var(--btn) 78%, #3a1d5c) 100%);
  border: var(--kid-edge) solid var(--kid-dark); color: var(--kid-dark);
  --btn-rim: inset 0 calc(var(--u)*.3) 0 rgba(255,255,255,.65), inset 0 calc(var(--u)*-.42) 0 color-mix(in srgb, var(--btn) 62%, #2b1550);
  box-shadow: var(--btn-rim), 0 var(--kid-drop) 0 var(--kid-shadow); backdrop-filter: none; -webkit-backdrop-filter: none;
  font-weight: 700; transition: transform .25s var(--kid-spring), box-shadow .15s ease;
}
.app-shell.view-kids :is(.room-card__power, .device-controls button, .tile-buttons button, .tile-chips button, .tile-target button, .climate-quick-control > div button, .scene-strip .hd-item > button:first-child, .global-actions > button, .room-actions > button, .round-action, .weather-chip, .hd-notice, .hd-agenda__button, .hd-link__buttons button, .hd-link__run, .spotify-card__start, .spotify-card button, .hd-player__controls button, .navigation-dock button, .edit-fab, .room-selector__list > button) :is(span, b, small, svg) { color: var(--kid-dark); }
/* Pressed: it sinks onto its shadow. */
.app-shell.view-kids :is(.room-card__power, .device-controls button, .tile-buttons button, .tile-chips button, .tile-target button, .climate-quick-control > div button, .global-actions > button, .room-actions > button, .round-action, .weather-chip, .hd-notice, .hd-agenda__button, .hd-link__buttons button, .hd-link__run, .spotify-card__start, .spotify-card button, .hd-player__controls button, .edit-fab):active { transform: translateY(var(--kid-drop)); box-shadow: var(--btn-rim, none), 0 0 0 var(--kid-shadow); }
/* White buttons for the header and on colored cards. */
.app-shell.view-kids .hd-item { --btn: var(--kid); }
.app-shell.view-kids .room-actions > .room-actions__primary { --btn: #ffd43b; }
.app-shell.view-kids :is(.room-card--active, .device-tile--active) :is(.room-card__power, .device-controls button, .tile-buttons button, .climate-quick-control > div button) { --btn: #fffdf8; }
.app-shell.view-kids .tile-buttons .tile-buttons__warn { --btn: #ff6b6b; }
.app-shell.view-kids .tile-buttons--options button[aria-pressed="true"] { --btn: #ffd43b; }
.app-shell.view-kids .edit-fab { --btn: #ff8fab; }
/* A header notice waiting for its second tap turns yellow, like the card's confirm bubble. */
.app-shell.view-kids .hd-notice.hd-notice--confirm { --btn: #ffd43b; }
.app-shell.view-kids .scene-strip .hd-item > button:first-child { padding-inline: calc(var(--u)*2); }

/* Cards: pastel, no frame, and the dark solid shadow underneath; full color while on. */
.app-shell.view-kids :is(.room-card, .device-tile, .widget-card) {
  /* Volume: lighter at the top, a bubble of the card's color in a corner, a bright rim above and a tinted one below. */
  /* Off: only the fill is see-through (50%), so the scene shows behind; outline, icon and text stay solid. */
  /* --kid-off: the card's own hue, lighter and less saturated (toward white and a soft grey). */
  --kid-off: color-mix(in srgb, color-mix(in srgb, var(--kid-soft) 55%, #ffffff) 82%, #dcd9e3);
  background: radial-gradient(circle at 104% 104%, color-mix(in srgb, var(--kid) 12%, transparent) 0 30%, transparent 31%),
    radial-gradient(circle at 86% 14%, rgba(255,255,255,.45) 0 5%, transparent 6%),
    radial-gradient(circle at 93% 26%, rgba(255,255,255,.35) 0 2.5%, transparent 3.5%),
    linear-gradient(165deg, color-mix(in srgb, color-mix(in srgb, var(--kid-off) 70%, #fff) 50%, transparent) 0%, color-mix(in srgb, var(--kid-off) 50%, transparent) 58%, color-mix(in srgb, color-mix(in srgb, var(--kid-off) 88%, var(--kid-soft)) 50%, transparent) 100%);
  color: var(--kid-dark); isolation: isolate;
  border: var(--kid-edge) solid var(--kid-dark); border-radius: calc(var(--u)*3.4);
  box-shadow: inset 0 calc(var(--u)*.5) 0 rgba(255,255,255,.7), inset 0 calc(var(--u)*-.7) 0 color-mix(in srgb, var(--kid) 40%, transparent), 0 calc(var(--u)*.9) 0 var(--kid-shadow);
  backdrop-filter: none; -webkit-backdrop-filter: none;
  transition: transform .35s var(--kid-spring), box-shadow .2s ease, background .25s ease;
}
.app-shell.view-kids :is(.room-card, .device-tile, .widget-card) :is(strong, b, h2, h3) { color: var(--kid-dark); }
.app-shell.view-kids :is(.room-card, .device-tile, .widget-card) :is(span, small, p) { color: color-mix(in srgb, var(--kid-dark) 72%, transparent); }
.app-shell.view-kids :is(.room-card__content strong, .device-tile__copy strong) { font-weight: 700; }
/* Big numbers and titles ("All safe", 25°, page titles): bold, never hairline. */
.app-shell.view-kids :is(.widget-card strong, .widget-card b, .climate-quick-control span, .screen h1) { font-weight: 700; }
/* Summary cards (security, climate, weather...) aren't devices that are off: their fill stays solid. A media
   player is a device: solid while playing, light and see-through like the others while idle or off. */
.app-shell.view-kids :is(.widget-card:not(.spotify-card), .spotify-card--playing) {
  background: radial-gradient(circle at 104% 104%, color-mix(in srgb, var(--kid) 42%, transparent) 0 30%, transparent 31%),
    radial-gradient(circle at 86% 14%, rgba(255,255,255,.75) 0 5%, transparent 6%),
    radial-gradient(circle at 93% 26%, rgba(255,255,255,.6) 0 2.5%, transparent 3.5%),
    linear-gradient(165deg, color-mix(in srgb, var(--kid-soft) 45%, #fff) 0%, var(--kid-soft) 58%, color-mix(in srgb, var(--kid-soft) 72%, var(--kid)) 100%);
}
/* On: full color with a soft shine across the top. */
.app-shell.view-kids :is(.room-card--active, .device-tile--active, .widget-card--playing) {
  background: radial-gradient(circle at 104% 104%, color-mix(in srgb, var(--kid-fill, var(--kid)) 45%, transparent) 0 30%, transparent 31%),
    radial-gradient(circle at 86% 14%, rgba(255,255,255,.8) 0 5%, transparent 6%),
    radial-gradient(circle at 93% 26%, rgba(255,255,255,.65) 0 2.5%, transparent 3.5%),
    linear-gradient(170deg, color-mix(in srgb, var(--kid) 60%, #fff) 0%, var(--kid) 48%, color-mix(in srgb, var(--kid) 82%, #3a1d5c) 100%);
  box-shadow: inset 0 calc(var(--u)*.5) 0 rgba(255,255,255,.55), inset 0 calc(var(--u)*-.8) 0 color-mix(in srgb, var(--kid) 70%, #2b1550), 0 calc(var(--u)*.9) 0 var(--kid-shadow);
}
.app-shell.view-kids :is(.room-card--active, .device-tile--active) :is(span, small, p) { color: var(--kid-dark); }
/* Off cards are see-through, so their words use the full dark ink (no fading) to read on any scene. */
.app-shell.view-kids :is(.room-card:not(.room-card--active), .device-tile:not(.device-tile--active):not(.camera-tile), .spotify-card:not(.spotify-card--playing)) :is(strong, b, span, small, p) { color: var(--kid-dark); }
.app-shell.view-kids .device-tile--alert { --kid: #ff6b6b; --kid-soft: #ffc9c9; }
.app-shell.view-kids .device-tile--unavailable, .app-shell.view-kids .room-card--unavailable { filter: grayscale(.8); opacity: .75; }

/* Icons: a glossy round bubble with the dark outline (white while on). */
.app-shell.view-kids :is(.device-tile__icon, .room-card__icon, .widget-card__icon) {
  /* A little sphere: shine at the top left, darker toward the bottom right. */
  background: radial-gradient(circle at 32% 28%, #fff 0 9%, color-mix(in srgb, var(--kid) 45%, #fff) 16%, var(--kid) 52%, color-mix(in srgb, var(--kid) 72%, #3a1d5c) 100%);
  color: var(--kid-dark); border-radius: 50%; border: var(--kid-edge) solid var(--kid-dark);
  box-shadow: 0 calc(var(--u)*.35) 0 var(--kid-shadow);
}
.app-shell.view-kids :is(.device-tile--active .device-tile__icon, .room-card--active .room-card__icon, .widget-card--playing .widget-card__icon) {
  background: radial-gradient(circle at 32% 28%, #fff 0 22%, #fffdf8 45%, color-mix(in srgb, #fffdf8 80%, var(--kid)) 100%);
}
.app-shell.view-kids .light-pip { background: color-mix(in srgb, var(--kid-dark) 18%, transparent); }
.app-shell.view-kids .light-pip--active { background: var(--kid-dark); box-shadow: none; }

/* Illustration: a big faded drawing of the card's own icon, tilted in the bottom corner. */
.app-shell :is(.room-card__art, .device-tile__art) { display: none; }
.app-shell.view-kids :is(.room-card__art, .device-tile__art) {
  display: block; position: absolute; z-index: -1; right: 4%; bottom: 4%; width: 44%; max-width: calc(var(--u)*14); aspect-ratio: 1;
  /* Always white, on or off. !important: the card's text rules (dark ink) would otherwise reach this span too. */
  color: #fff !important; opacity: .2; transform: rotate(-12deg); pointer-events: none;
}
.app-shell.view-kids :is(.room-card__art, .device-tile__art) :is(svg, ha-icon, ha-state-icon) { width: 100%; height: 100%; --mdc-icon-size: 100%; }
.app-shell.view-kids :is(.hd-item--small, .hd-item--wide) .device-tile__art { width: 34%; }

/* Sliders: a white track with the dark outline and a glossy fill. */
.app-shell.view-kids :is(.device-dimmer, .tile-slider__track) { background: linear-gradient(180deg, #ece7f5, #fff 45%); border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.35) 0 var(--kid-shadow); height: calc(var(--u)*3.8); }
.app-shell.view-kids :is(.device-dimmer b, .tile-slider__track b) {
  /* Rounded volume (light to deep) with a small shine; no band across the top, which read as an empty part. */
  background: radial-gradient(ellipse 22% 30% at 12% 30%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%), linear-gradient(180deg, color-mix(in srgb, var(--kid-fill, #ff6b8b) 65%, #fff) 0%, var(--kid-fill, #ff6b8b) 55%, color-mix(in srgb, var(--kid-fill, #ff6b8b) 80%, #2b1550) 100%);
  border-radius: inherit;
}
.app-shell.view-kids .device-tile--active :is(.device-dimmer b, .tile-slider__track b) { background: radial-gradient(ellipse 22% 30% at 12% 30%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%), linear-gradient(180deg, color-mix(in srgb, var(--kid-fill, #ff6b8b) 65%, #fff) 0%, var(--kid-fill, #ff6b8b) 55%, color-mix(in srgb, var(--kid-fill, #ff6b8b) 80%, #2b1550) 100%); }
.app-shell.view-kids :is(.device-dimmer b, .tile-slider__track b)::after { background: #fff; width: 4px; box-shadow: 0 0 0 1.5px var(--kid-dark); }
.app-shell.view-kids .hd-item:nth-child(6n+1) { --kid-fill: #ff8f3b; }
.app-shell.view-kids .hd-item:nth-child(6n+2) { --kid-fill: #20c997; }
.app-shell.view-kids .hd-item:nth-child(6n+3) { --kid-fill: #339af0; }
.app-shell.view-kids .hd-item:nth-child(6n+4) { --kid-fill: #f06595; }
.app-shell.view-kids .hd-item:nth-child(6n+5) { --kid-fill: #845ef7; }
.app-shell.view-kids .hd-item:nth-child(6n+6) { --kid-fill: #ff6b6b; }

.app-shell.view-kids .presence-avatar { border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.35) 0 var(--kid-shadow); }

/* Room list beside a room: white pills, the open room as a glossy yellow button. */
.app-shell.view-kids .room-selector__list > button { background: #fffdf8; color: var(--kid-dark); border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.45) 0 var(--kid-shadow); font-weight: 600; transition: transform .25s var(--kid-spring), box-shadow .15s ease; }
.app-shell.view-kids .room-selector__list > button .room-selector__icon { background: #fff3bf; color: var(--kid-dark); }
.app-shell.view-kids .room-selector__list > button[aria-selected="true"] { --btn: #ffd43b; }

/* Buttons in rows that scroll sideways (scenes, bottom bar) don't sink when pressed: moving down would
   give the row a vertical scroll. They darken a little instead. */
.app-shell.view-kids :is(.scene-strip .hd-item > button:first-child, .navigation-dock button):active { filter: brightness(.92); }

/* Phones: the room list scrolls sideways. Nothing in it moves up or down (no sink, no nudge) and it keeps
   room for the shadows, so it never grows a vertical scroll of its own. */
@media (max-width: 720px) {
  .app-shell.view-kids .room-selector__list { overflow-y: hidden; padding: 2px 2px calc(var(--u)*1.2); margin-bottom: calc(var(--u)*-.8); overscroll-behavior-x: contain; }
  .app-shell.view-kids .room-selector__list > button, .app-shell.view-kids .room-selector__list > button[aria-selected="true"], .app-shell.view-kids .room-selector__list > button:active { transform: none; }
}

/* Bottom bar: a white bar with the dark outline; the current tab is a glossy yellow button. */
.app-shell.view-kids .navigation-dock {
  background: #fffdf8; border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.8) 0 var(--kid-shadow); backdrop-filter: none; -webkit-backdrop-filter: none;
}
.app-shell.view-kids .navigation-dock button { color: var(--kid-dark); font-weight: 600; border: var(--kid-edge) solid transparent; }
.app-shell.view-kids .navigation-dock button.navigation-dock__active { --btn: #ffd43b; box-shadow: 0 calc(var(--u)*.4) 0 var(--kid-shadow); }

/* Section titles in the grid: header-style ink with a candy underline, and a white field when renamed. */
.app-shell.view-kids .hd-section { font-weight: 700; letter-spacing: .06em; }
.app-shell.view-kids .hd-section::after { background: repeating-linear-gradient(90deg, var(--kid-head) 0 10px, transparent 10px 18px); opacity: .45; height: 3px; border-radius: 3px; }
.app-shell.view-kids .hd-section input { background: #fff; color: var(--kid-dark); text-shadow: none; border: var(--kid-edge) solid var(--kid-dark); border-radius: calc(var(--u)*1.4); }

/* Camera cards: the picture fills them, so they keep a dark base and white text over its shade. */
.app-shell.view-kids .camera-tile { background: #2b2140; }
.app-shell.view-kids .camera-tile :is(span, strong, small, p, b, i) { color: #fff; }
.app-shell.view-kids .camera-tile .camera-tile__badge { background: rgba(35,27,61,.7); border: 2px solid #fff; font-weight: 700; }

/* Song progress on the media card: a white track with the outline, the played part in ink. */
.app-shell.view-kids .spotify-card__bar { height: calc(var(--u)*1.3); background: #fff; box-shadow: inset 0 0 0 2px var(--kid-dark); }
.app-shell.view-kids .spotify-card__bar b { background: linear-gradient(180deg, #a597f5, #5f3dc4); box-shadow: inset 0 0 0 2px var(--kid-dark); }

/* ---------- Small parts on cards ---------- */
/* Devices attached to a card: names in bold ink, their buttons candy (handed the card's color), switches below. */
.app-shell.view-kids .hd-link__name { color: var(--kid-dark); font-weight: 700; }
.app-shell.view-kids .hd-link__value { color: var(--kid-dark); opacity: .8; font-weight: 700; }
.app-shell.view-kids .hd-link__buttons button { --btn: #fffdf8; }
.app-shell.view-kids .hd-link__run { --btn: #fffdf8; }
.app-shell.view-kids .device-tile--active .hd-link__run { --btn: #ffd43b; }
/* Switches (attached devices, options in sheets): an outlined track, a glossy knob, green when on. */
.app-shell.view-kids :is(.ls-switch, .st-switch) { background: linear-gradient(180deg, #e3dcef, #fff 70%); box-shadow: inset 0 0 0 var(--kid-edge) var(--kid-dark), 0 calc(var(--u)*.3) 0 var(--kid-shadow); }
.app-shell.view-kids :is(.ls-switch--on, .st-switch:checked) { background: linear-gradient(180deg, #b2f2bb, #40c057 70%); }
.app-shell.view-kids :is(.ls-switch i, .st-switch::before) { background: radial-gradient(circle at 35% 30%, #fff 0 30%, #f1ecf8 100%); box-shadow: 0 0 0 2px var(--kid-dark), 0 2px 0 var(--kid-shadow); }
.app-shell.view-kids :is(.room-card--active, .device-tile--active) .hd-link .ls-switch i { background: radial-gradient(circle at 35% 30%, #fff 0 30%, #f1ecf8 100%); box-shadow: 0 0 0 2px var(--kid-dark), 0 2px 0 var(--kid-shadow); }
/* Dropdowns on cards and in sheets: a white candy box; its list opens as cream paper. */
.app-shell.view-kids :is(.device-select, .hd-sheet .hdx-select) { background: linear-gradient(180deg, #fff, #f6f1e8); color: var(--kid-dark); border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.35) 0 var(--kid-shadow); font-family: var(--f-body); font-weight: 700; }
.app-shell.view-kids .device-tile--active .device-select { background: linear-gradient(180deg, #fff, #f6f1e8); color: var(--kid-dark); border-color: var(--kid-dark); }
.app-shell.view-kids .hdx-select__list { background: #fffdf8; color: var(--kid-dark); border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.8) 0 var(--kid-shadow); font-family: var(--f-body); }
.app-shell.view-kids .hdx-select__option--active, .app-shell.view-kids .hdx-select__option:hover { background: #fff3bf; }
/* "Tap again to confirm": a yellow speech bubble with bold dark text that pops in. */
.app-shell.view-kids .device-tile .device-tile__confirm { background: radial-gradient(ellipse 40% 30% at 28% 22%, rgba(255,255,255,.7), rgba(255,255,255,0) 70%), #ffd43b; color: var(--kid-dark); outline: none; box-shadow: inset 0 0 0 var(--kid-edge) var(--kid-dark); font-family: var(--f-body); font-weight: 700; font-size: calc(var(--u)*2); animation: kid-pop .35s var(--kid-spring); }
/* The lock of a protected card: a small white seal with the outline. */
.app-shell.view-kids .device-tile__guard { background: radial-gradient(circle at 35% 30%, #fff 0 35%, #f1ecf8 100%); color: var(--kid-dark); opacity: 1; box-shadow: 0 0 0 2px var(--kid-dark), 0 2px 0 var(--kid-shadow); }
/* While a command is on its way the card's own border pulses (dark to soft lilac). No inner ring: a second
   line inside the border looked like the outline was doubling up. */
.app-shell.view-kids .device-tile__busy { display: none; }
.app-shell.view-kids .device-tile:has(.device-tile__busy) { animation: kid-busy .9s ease-in-out infinite; }
@keyframes kid-busy { 50% { border-color: #9a8fd0; } }

/* ---------- Full-screen player ----------
   It keeps its dark backdrop from the cover art; its controls become candy like the rest. */
.app-shell.view-kids .hd-player { font-family: var(--f-body); }
.app-shell.view-kids .hd-player :is(h1, h2, strong) { font-weight: 700; }
.app-shell.view-kids .hd-player :is(.hd-close, .hd-player__volume button, .hd-player__devices button) { background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%), linear-gradient(180deg, #fff, #fffdf8 55%, #e6dfd3); border: var(--kid-edge) solid var(--kid-dark); color: var(--kid-dark); box-shadow: 0 calc(var(--u)*.45) 0 rgba(0,0,0,.35); font-weight: 700; }
.app-shell.view-kids .hd-player .hd-close, .app-shell.view-kids .hd-player > button.hd-close { background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.9), rgba(255,255,255,0) 72%), linear-gradient(180deg, #ffc2d1, #ff8fab 55%, #e0567b); }
.app-shell.view-kids .hd-player .hd-player__devices button[aria-pressed="true"] { background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.9), rgba(255,255,255,0) 72%), linear-gradient(180deg, #ffe58a, #ffd43b 55%, #f2b600); }
.app-shell.view-kids .hd-player :is(.hd-player__volume button, .hd-player__devices button) :is(svg, span) { color: var(--kid-dark); }
.app-shell.view-kids .hd-player .hd-player__volume { background: none; }
/* The volume buttons carry !important backgrounds in the base style. */
.app-shell.view-kids .hd-player .hd-player__volume button { background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%), linear-gradient(180deg, #fff, #fffdf8 55%, #e6dfd3) !important; }
.app-shell.view-kids .hd-player .hd-player__volume span { color: #fff; font-weight: 700; }

/* Doorbell and full-screen camera keep their dark stage for the video; the frame and close button join in. */
.app-shell.view-kids .hd-doorbell__panel { border: calc(var(--u)*.45) solid #fff; box-shadow: 0 calc(var(--u)*1) 0 rgba(0,0,0,.35); font-family: var(--f-body); }
.app-shell.view-kids .hd-doorbell__panel :is(strong, h2, b) { font-weight: 700; }
.app-shell.view-kids :is(.hd-doorbell, .hd-camera, .hd-camera__full) button.hd-close { background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.9), rgba(255,255,255,0) 72%), linear-gradient(180deg, #ffc2d1, #ff8fab 55%, #e0567b); color: var(--kid-dark); border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.45) 0 rgba(0,0,0,.35); }

/* ---------- Edit mode ---------- */
/* The room's options above its devices: a sheet of cream paper, so its text reads over any scene. */
.app-shell.view-kids .screen .room-options {
  --ink: var(--kid-dark); --ink-2: rgba(35,27,61,.72); --ink-3: rgba(35,27,61,.58); --line: rgba(35,27,61,.16); --glass: rgba(35,27,61,.06);
  color: var(--kid-dark); padding: calc(var(--u)*2.2); border-radius: calc(var(--u)*3.4);
  background: radial-gradient(circle at 100% 0%, rgba(255,212,59,.25) 0 14%, transparent 15%), linear-gradient(180deg, #fffdf8, #fff6e0);
  border: var(--kid-edge) solid var(--kid-dark); box-shadow: inset 0 calc(var(--u)*.5) 0 #fff, 0 calc(var(--u)*.8) 0 var(--kid-shadow);
}
.app-shell.view-kids .room-options :is(.eyebrow, small, p) { color: rgba(35,27,61,.66); text-shadow: none; }
.app-shell.view-kids .room-options :is(b, strong, span) { color: var(--kid-dark); text-shadow: none; }
/* Candy buttons inside it: the icon chooser, who can see, the temperature list. */
.app-shell.view-kids .room-options :is(.room-options__auto, button[aria-pressed], .hdx-select) {
  background: linear-gradient(180deg, #fff, #f6f1e8); color: var(--kid-dark); border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.35) 0 var(--kid-shadow); font-weight: 700;
}
.app-shell.view-kids .room-options button[aria-pressed="true"] { background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.9), rgba(255,255,255,0) 72%), linear-gradient(180deg, #ffe58a, #ffd43b 55%, #f2b600); }
/* Hide and size buttons on each card, and the size menu. */
.app-shell.view-kids .hd-item__badge { border: 2px solid var(--kid-dark); box-shadow: 0 2px 0 var(--kid-shadow); }
.app-shell.view-kids .hd-item__badge--size { background: radial-gradient(circle at 35% 30%, #fff 0 30%, #f1ecf8 100%); color: var(--kid-dark); }
.app-shell.view-kids .hd-sizemenu__option { background: radial-gradient(circle at 35% 30%, #fff 0 30%, #f1ecf8 100%); color: var(--kid-dark); border: 2px solid var(--kid-dark); box-shadow: 0 2px 0 var(--kid-shadow); backdrop-filter: none; }
.app-shell.view-kids .hd-sizemenu__option--on { background: radial-gradient(circle at 35% 30%, #fff6c4 0 25%, #ffd43b 100%); }
/* The "add devices" tile and the hidden ones: a dashed white well, candy pills. */
.app-shell.view-kids .hd-add-tile { background: rgba(255,253,248,.85); border: var(--kid-edge) dashed rgba(35,27,61,.45); color: var(--kid-dark); font-weight: 700; border-radius: calc(var(--u)*3.4); }
.app-shell.view-kids .hd-add-tile span { background: radial-gradient(circle at 32% 28%, #fff 0 9%, #fff3bf 16%, #ffd43b 52%, #e0a800 100%); color: var(--kid-dark); border: var(--kid-edge) solid var(--kid-dark); }
.app-shell.view-kids .screen :is(.hd-hidden-tray button, .hd-pill) { background: linear-gradient(180deg, #fff, #f6f1e8); color: var(--kid-dark); border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.35) 0 var(--kid-shadow); backdrop-filter: none; -webkit-backdrop-filter: none; font-weight: 700; }
.app-shell.view-kids .screen--editing .hd-item:not(.hd-item--section) > :first-child { outline: none; }

/* ---------- Sheets (details, options, pickers, forecast, calendar) ----------
   Cream paper with the dark outline. The panel's ink variables are redefined inside, so most parts follow
   on their own; the few that paint white on purpose are set below. */
.app-shell.view-kids .hd-sheet-backdrop { background: rgba(35,27,61,.42); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }
.app-shell.view-kids :is(.hd-sheet, .hd-cal, .hd-forecast) {
  --ink: var(--kid-dark); --ink-2: rgba(35,27,61,.72); --ink-3: rgba(35,27,61,.56); --line: rgba(35,27,61,.16);
  --glass: rgba(35,27,61,.06); --glass-strong: rgba(35,27,61,.1); --paper: #ffd43b; --paper-ink: var(--kid-dark); --on: #ffd43b; --on-ink: var(--kid-dark);
  --kid: #ffd43b; --kid-soft: #fff3bf; --btn: #fffdf8;
  color: var(--kid-dark);
  background: radial-gradient(circle at 100% 0%, rgba(255,212,59,.28) 0 18%, transparent 19%), radial-gradient(circle at 0% 100%, rgba(116,192,252,.22) 0 22%, transparent 23%), linear-gradient(180deg, #fffdf8, #fff6e0);
  border: calc(var(--u)*.45) solid var(--kid-dark); border-radius: calc(var(--u)*4.4);
  box-shadow: inset 0 calc(var(--u)*.6) 0 #fff, 0 calc(var(--u)*1.2) 0 var(--kid-shadow), 0 calc(var(--u)*3) calc(var(--u)*6) rgba(35,27,61,.25);
  backdrop-filter: none; -webkit-backdrop-filter: none;
  animation: kid-sheet .45s var(--kid-spring);
}
@keyframes kid-sheet { from { opacity: 0; transform: translateY(calc(var(--u)*4)) scale(.85); } }
.app-shell.view-kids :is(.hd-sheet, .hd-cal, .hd-forecast) :is(h2, h3, strong, b) { color: var(--kid-dark); }
.app-shell.view-kids .hd-detail__header h2 { font-weight: 700; }
/* Nothing hairline on paper: big readings in sheets are bold too. */
.app-shell.view-kids :is(.hd-sheet, .hd-cal, .hd-forecast) strong { font-weight: 700; }
.app-shell.view-kids .hd-todo__item--late .hd-todo__when { color: #c92a2a; font-weight: 700; }
.app-shell.view-kids :is(.hd-detail__reading strong, .hd-stepper strong) { font-weight: 700; }
/* Round buttons in sheets (close, back, steppers, transport): glossy white candy. */
.app-shell.view-kids :is(.hd-sheet, .hd-cal, .hd-forecast) :is(.hd-close, .hd-detail__x, .st-icon-button, .hd-stepper button, .hd-transport button, .hd-detail__primary, .hd-segment button[aria-pressed="true"], .hd-pill, .hd-cal button.hd-pill) {
  background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%), linear-gradient(180deg, color-mix(in srgb, var(--btn) 50%, #fff) 0%, var(--btn) 55%, color-mix(in srgb, var(--btn) 82%, #3a1d5c) 100%);
  border: var(--kid-edge) solid var(--kid-dark); color: var(--kid-dark);
  box-shadow: inset 0 calc(var(--u)*.3) 0 rgba(255,255,255,.65), 0 calc(var(--u)*.45) 0 var(--kid-shadow); backdrop-filter: none; -webkit-backdrop-filter: none; font-weight: 700;
}
.app-shell.view-kids :is(.hd-sheet, .hd-cal, .hd-forecast) :is(.hd-close, .hd-detail__x, .st-icon-button, .hd-stepper button, .hd-transport button, .hd-detail__primary, .hd-pill):active { transform: translateY(calc(var(--u)*.4)); box-shadow: inset 0 calc(var(--u)*.3) 0 rgba(255,255,255,.65); }
.app-shell.view-kids :is(.hd-sheet, .hd-cal, .hd-forecast) .hd-close { --btn: #ff8fab; }
.app-shell.view-kids .hd-sheet :is(.hd-detail__primary--off, .hd-transport .hd-transport__play, .hd-segment button[aria-pressed="true"], .hd-pill--set, .hd-pill--solid, .hd-pill[aria-expanded="true"]) { --btn: #ffd43b; }
.app-shell.view-kids .hd-sheet .hd-pill--danger { --btn: #ff6b6b; }
.app-shell.view-kids .hd-sheet .hd-detail__icon { background: radial-gradient(circle at 32% 28%, #fff 0 9%, #fff3bf 16%, #ffd43b 52%, #e0a800 100%); color: var(--kid-dark); border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.35) 0 var(--kid-shadow); }
/* Choice buttons in sheets (Warm/Normal/Cool, history ranges, list options): white candy, the chosen one yellow. */
.app-shell.view-kids .hd-sheet :is(.hd-temps button, .hd-history__ranges button, .hd-options button) {
  --btn: #fffdf8; background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%), linear-gradient(180deg, color-mix(in srgb, var(--btn) 50%, #fff) 0%, var(--btn) 55%, color-mix(in srgb, var(--btn) 82%, #3a1d5c) 100%);
  border: var(--kid-edge) solid var(--kid-dark); color: var(--kid-dark); font-weight: 700; box-shadow: 0 calc(var(--u)*.4) 0 var(--kid-shadow);
}
.app-shell.view-kids .hd-sheet :is(.hd-temps button, .hd-history__ranges button, .hd-options button)[aria-pressed="true"] { --btn: #ffd43b; }
.app-shell.view-kids .hd-sheet .hd-temps button i { box-shadow: 0 0 0 1.5px var(--kid-dark); }

/* History chart: a vivid violet line that reads on the cream paper. */
.app-shell.view-kids .hd-sheet .hd-history { color: #7048e8; }

/* Pickers and option grids in sheets. */
.app-shell.view-kids .hd-sheet .hd-sheet__close { --btn: #ffd43b; background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%), linear-gradient(180deg, #ffe58a, #ffd43b 55%, #f2b600); color: var(--kid-dark); border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.45) 0 var(--kid-shadow); font-weight: 700; }
.app-shell.view-kids .hd-sheet .hd-search { background: #fff; border: var(--kid-edge) solid rgba(35,27,61,.35); color: var(--kid-dark); }
.app-shell.view-kids .hd-sheet .hd-search input { color: var(--kid-dark); }
.app-shell.view-kids .hd-sheet .hd-search input::placeholder { color: rgba(35,27,61,.5); }
.app-shell.view-kids .hd-sheet .hd-picker__row { border-radius: calc(var(--u)*2); }
.app-shell.view-kids .hd-sheet .hd-picker__row:hover { background: rgba(255,212,59,.18); }
.app-shell.view-kids .hd-sheet .hd-picker__icon { background: radial-gradient(circle at 32% 28%, #fff 0 9%, #fff3bf 18%, #ffe58a 60%, #f2c94c 100%); color: var(--kid-dark); border: 2px solid var(--kid-dark); }
.app-shell.view-kids .hd-sheet .hd-picker__row--on .hd-picker__icon { background: radial-gradient(circle at 32% 28%, #fff 0 9%, #ffe58a 18%, #ffd43b 60%, #e0a800 100%); }
.app-shell.view-kids .hd-sheet .hd-picker__check { border: var(--kid-edge) solid var(--kid-dark); background: #fff; color: transparent; }
.app-shell.view-kids .hd-sheet .hd-picker__row--on .hd-picker__check { background: radial-gradient(circle at 35% 30%, #d3f9d8 0 25%, #40c057 100%); color: var(--kid-dark); border-color: var(--kid-dark); }
.app-shell.view-kids .hd-sheet .room-options__icons button { background: #fff; color: var(--kid-dark); border: 2px solid rgba(35,27,61,.3); }
.app-shell.view-kids .hd-sheet .room-options__icons button:is([aria-checked="true"], [aria-expanded="true"]) { background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.9), rgba(255,255,255,0) 72%), linear-gradient(180deg, #ffe58a, #ffd43b 55%, #f2b600); border: var(--kid-edge) solid var(--kid-dark); }
.app-shell.view-kids .hd-sheet .hd-detail__rename { background: #fff; color: var(--kid-dark); border: 2px solid rgba(35,27,61,.3); }

/* "No forecast" note: dark ink on a soft lilac well. */
.app-shell.view-kids .hd-forecast .weather-modal__empty { color: var(--kid-dark); background: rgba(35,27,61,.07); border: 2px dashed rgba(35,27,61,.2); }

/* Tracks and grouped areas inside sheets: soft lilac wells with the outline. */
.app-shell.view-kids .hd-sheet :is(.hd-slider__track) { background: linear-gradient(180deg, #ece7f5, #fff 45%); border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.4) 0 var(--kid-shadow); }
.app-shell.view-kids .hd-sheet .hd-slider__track b { --kid-fill: var(--lc, #ffa94d); background: radial-gradient(ellipse 22% 30% at 12% 30%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%), linear-gradient(180deg, color-mix(in srgb, var(--kid-fill) 65%, #fff) 0%, var(--kid-fill) 55%, color-mix(in srgb, var(--kid-fill) 80%, #2b1550) 100%); }
.app-shell.view-kids .hd-sheet .hd-slider__track b::after { background: #fff; box-shadow: 0 0 0 1.5px var(--kid-dark); }
.app-shell.view-kids .hd-sheet .hd-segment { background: rgba(35,27,61,.08); border: var(--kid-edge) solid var(--kid-dark); }
.app-shell.view-kids .hd-sheet .hd-segment button { color: var(--kid-dark); }
.app-shell.view-kids .hd-sheet .hd-swatches button { border: var(--kid-edge) solid var(--kid-dark); box-shadow: 0 calc(var(--u)*.35) 0 var(--kid-shadow); }
.app-shell.view-kids .hd-sheet :is(.room-options, .hd-detail__options) { background: rgba(255,255,255,.7); border: var(--kid-edge) solid rgba(35,27,61,.2); border-radius: calc(var(--u)*2.6); }
/* Groups inside a group: no second frame, just a soft divider. */
.app-shell.view-kids .hd-sheet :is(.room-options, .hd-detail__options) :is(.room-options, .hd-rules, .hd-links-editor, .hd-detail__options) { background: none; border: 0; border-radius: 0; box-shadow: none; padding-inline: 0; }
.app-shell.view-kids .hd-sheet :is(.room-options, .hd-detail__options) > * + :is(.hd-rules, .hd-links-editor, .room-options) { border-top: 2px dashed rgba(35,27,61,.15); padding-top: calc(var(--u)*1.6); }
.app-shell.view-kids .hd-sheet .hd-links-editor__item { background: #fff; border: 2px solid rgba(35,27,61,.25); }
.app-shell.view-kids .hd-sheet :is(input[type="text"], input[type="number"], input:not([type]), input[type="time"], textarea, .st-input) { background: #fff; color: var(--kid-dark); border: var(--kid-edge) solid rgba(35,27,61,.35); border-radius: calc(var(--u)*1.4); }

/* Reminders: each item a white card with the outline, the check a ring you can see. */
.app-shell.view-kids .hd-todo__item { background: #fff; color: var(--kid-dark); border: 2px solid rgba(35,27,61,.18); box-shadow: 0 calc(var(--u)*.35) 0 rgba(35,27,61,.12); }
.app-shell.view-kids .hd-todo__item:active { background: #fff3bf; }
.app-shell.view-kids .hd-todo__check { box-shadow: inset 0 0 0 var(--kid-edge) var(--kid-dark); background: #fff; }
.app-shell.view-kids .hd-todo__item--late .hd-todo__check { box-shadow: inset 0 0 0 var(--kid-edge) #e03131; background: #fff5f5; }
.app-shell.view-kids .hd-todo__item--done .hd-todo__check { background: #63e6a4; color: var(--kid-dark); box-shadow: inset 0 0 0 var(--kid-edge) var(--kid-dark); }

/* Calendar (full screen): cream page, the month and the day's list as white cards with the outline. */
.app-shell.view-kids .hd-cal { border: 0; border-radius: 0; box-shadow: none; animation: hd-cal-in .3s ease; background: radial-gradient(circle at 100% 0%, rgba(255,212,59,.3) 0 16%, transparent 17%), radial-gradient(circle at 0% 100%, rgba(116,192,252,.25) 0 20%, transparent 21%), linear-gradient(180deg, #fffdf8, #fff3d6); }
.app-shell.view-kids .hd-cal__nav h2 { font-weight: 700; } .app-shell.view-kids .hd-cal__nav h2 span { font-weight: 500; }
.app-shell.view-kids .hd-cal__round { --btn: #fffdf8; background: radial-gradient(ellipse 34% 26% at 26% 22%, rgba(255,255,255,.92), rgba(255,255,255,0) 72%), linear-gradient(180deg, #fff, #fffdf8 55%, #ece6dc); border: var(--kid-edge) solid var(--kid-dark); color: var(--kid-dark); box-shadow: 0 calc(var(--u)*.45) 0 var(--kid-shadow); }
.app-shell.view-kids :is(.hd-cal__month, .hd-cal__agenda) { background: #fff; border: var(--kid-edge) solid var(--kid-dark); box-shadow: inset 0 calc(var(--u)*.5) 0 #fff, 0 calc(var(--u)*.8) 0 var(--kid-shadow); }
.app-shell.view-kids .hd-cal__day { background: #fff8e8; color: var(--kid-dark); box-shadow: inset 0 0 0 1.5px rgba(35,27,61,.1); }
.app-shell.view-kids .hd-cal__day:nth-child(7n+1), .app-shell.view-kids .hd-cal__day:nth-child(7n) { background: #eef6ff; }
.app-shell.view-kids .hd-cal__day:active { background: #fff3bf; }
.app-shell.view-kids .hd-cal__day--selected { background: #fff3bf; box-shadow: inset 0 0 0 var(--kid-edge) var(--kid-dark); }
.app-shell.view-kids .hd-cal__day--today .hd-cal__num { background: radial-gradient(ellipse 34% 26% at 30% 24%, #fff, rgba(255,255,255,0) 70%), #ffd43b; color: var(--kid-dark); box-shadow: 0 0 0 2px var(--kid-dark); }
.app-shell.view-kids .hd-cal__chip { background: color-mix(in srgb, var(--c) 30%, #fff); color: var(--kid-dark); }
.app-shell.view-kids .hd-cal__event { background: color-mix(in srgb, var(--c) 18%, #fff); border: 2px solid color-mix(in srgb, var(--c) 55%, var(--kid-dark)); }
.app-shell.view-kids .hd-cal__event em { color: var(--kid-dark); background: color-mix(in srgb, var(--c) 35%, #fff); padding: 1px calc(var(--u)*.8); border-radius: 99px; margin-left: auto; }
.app-shell.view-kids .hd-cal__agenda h3 { font-weight: 700; }

/* ---------- Motion ---------- */
@keyframes kid-pop { 0% { opacity: 0; transform: translateY(calc(var(--u)*3)) scale(.6); } 70% { opacity: 1; } 100% { opacity: 1; transform: none; } }
@keyframes kid-wiggle { 0%, 100% { transform: rotate(0); } 15% { transform: rotate(-12deg) scale(1.08); } 30% { transform: rotate(10deg) scale(1.08); } 45% { transform: rotate(-6deg); } 60% { transform: rotate(0); } }
@keyframes kid-burst { 0% { opacity: 1; transform: scale(.9); } 70% { opacity: 1; } 100% { opacity: 0; transform: scale(1.35); } }
@keyframes kid-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(calc(var(--u)*-.6)); } }

/* Cards hop in one after another when a screen opens. */
.app-shell.view-kids .screen:not(.screen--editing) .hd-item { animation: kid-pop .55s var(--kid-spring) both; }
${Array.from({ length: 16 }, (_, n) => `.app-shell.view-kids .screen:not(.screen--editing) .hd-item:nth-child(${n + 1}) { animation-delay: ${n * 45}ms; }`).join("\n")}
.app-shell.view-kids .screen:not(.screen--editing) .hd-item:nth-child(n+17) { animation-delay: 720ms; }
/* A tap squishes the card. */
.app-shell.view-kids .screen:not(.screen--editing) :is(.room-card, .device-tile, .widget-card):active { transform: scale(.95) translateY(calc(var(--u)*.4)); box-shadow: 0 calc(var(--u)*.4) 0 var(--kid-shadow); }
/* What is on wiggles now and then, and a ring of stars pops when it turns on. */
.app-shell.view-kids .screen:not(.screen--editing) :is(.device-tile--active .device-tile__icon, .room-card--active .room-card__icon) { animation: kid-wiggle 3.4s ease-in-out 1s infinite; }
.app-shell.view-kids :is(.device-tile__icon, .room-card__icon) { position: relative; }
/* Sparkles when something turns on: a ring of outlined dots that opens from behind the icon. It starts
   already outside the icon's outline and only grows, so it never crosses or covers it. */
.app-shell.view-kids .screen:not(.screen--editing) :is(.device-tile--active .device-tile__icon, .room-card--active .room-card__icon)::after {
  content: ""; position: absolute; inset: -60%; z-index: -1; pointer-events: none; border-radius: 50%;
  background: radial-gradient(circle, #fff 0 34%, #231b3d 35% 50%, transparent 52%) 50% 0/16% 16% no-repeat,
    radial-gradient(circle, #fff 0 34%, #231b3d 35% 50%, transparent 52%) 85% 15%/16% 16% no-repeat,
    radial-gradient(circle, #fff 0 34%, #231b3d 35% 50%, transparent 52%) 100% 50%/16% 16% no-repeat,
    radial-gradient(circle, #fff 0 34%, #231b3d 35% 50%, transparent 52%) 85% 85%/16% 16% no-repeat,
    radial-gradient(circle, #fff 0 34%, #231b3d 35% 50%, transparent 52%) 50% 100%/16% 16% no-repeat,
    radial-gradient(circle, #fff 0 34%, #231b3d 35% 50%, transparent 52%) 15% 85%/16% 16% no-repeat,
    radial-gradient(circle, #fff 0 34%, #231b3d 35% 50%, transparent 52%) 0 50%/16% 16% no-repeat,
    radial-gradient(circle, #fff 0 34%, #231b3d 35% 50%, transparent 52%) 15% 15%/16% 16% no-repeat;
  animation: kid-burst .7s ease-out both;
}
.app-shell.view-kids .presence-stack { animation: kid-float 4s ease-in-out infinite; }

/* ---------- Scenes ---------- */
.app-shell .kd-scene { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
.app-shell .kd-scene > * { position: absolute; }
.app-shell .kd-scene--sky { background: linear-gradient(180deg, #5cc8ff 0%, #9fe0ff 55%, #d9f4ff 100%); }
.app-shell .kd-scene--ocean { background: linear-gradient(180deg, #3fd0e0 0%, #1f9cc2 50%, #136f9e 100%); }
.app-shell .kd-scene--space { background: radial-gradient(120% 90% at 70% 20%, #4b3a9b 0%, #261a5c 45%, #120c33 100%); }
.app-shell .kd-scene--candy { background: linear-gradient(180deg, #ffd6ec 0%, #e8d4ff 55%, #cfe8ff 100%); }

/* Sky: a smiling-warm sun, drifting clouds, birds and two hills. */
.app-shell .kd-sun { top: -6vmin; right: 6vw; width: 26vmin; height: 26vmin; border-radius: 50%; background: radial-gradient(circle, #fff3a3 0 38%, #ffd43b 39% 52%, transparent 53%); }
.app-shell .kd-sun i { position: absolute; inset: 0; border-radius: 50%; background: repeating-conic-gradient(from 0deg, rgba(255,212,59,.55) 0 8deg, transparent 8deg 22.5deg); -webkit-mask: radial-gradient(circle, transparent 52%, #000 53% 70%, transparent 71%); mask: radial-gradient(circle, transparent 52%, #000 53% 70%, transparent 71%); animation: kd-spin 40s linear infinite; }
.app-shell .kd-cloud { overflow: visible; width: 22vmin; fill: #fff; opacity: .95; filter: drop-shadow(0 1vmin 0 rgba(43,33,64,.06)); animation: kd-drift linear infinite; }
.app-shell .kd-cloud--0 { top: 12vh; width: 26vmin; animation-duration: 70s; animation-delay: -10s; }
.app-shell .kd-cloud--1 { top: 34vh; width: 18vmin; animation-duration: 95s; animation-delay: -60s; opacity: .8; }
.app-shell .kd-cloud--2 { top: 6vh; width: 15vmin; animation-duration: 120s; animation-delay: -30s; opacity: .7; }
.app-shell .kd-cloud--3 { top: 52vh; width: 22vmin; animation-duration: 85s; animation-delay: -45s; opacity: .85; }
.app-shell .kd-cloud--candy { fill: #fff; }
.app-shell .kd-bird { width: 4vmin; fill: none; stroke: #2b4a6b; stroke-width: 2.4; stroke-linecap: round; opacity: .55; animation: kd-drift-r linear infinite, kd-flap .5s ease-in-out infinite alternate; }
.app-shell .kd-bird--0 { top: 22vh; animation-duration: 38s, .5s; }
.app-shell .kd-bird--1 { top: 26vh; animation-duration: 38s, .45s; animation-delay: -1.2s, 0s; width: 3vmin; }
.app-shell .kd-bird--2 { top: 18vh; animation-duration: 52s, .55s; animation-delay: -20s, 0s; width: 3.4vmin; }
.app-shell .kd-hills { left: 0; right: 0; bottom: 0; width: 100%; height: 22vh; }
.app-shell .kd-hill--back { fill: #8ce99a; }
.app-shell .kd-hill--front { fill: #51cf66; }

/* Ocean: light rays, rising bubbles, swimming fish, swaying seaweed and waves at the bottom. */
.app-shell .kd-light { inset: -20% 10% auto; height: 80%; background: repeating-linear-gradient(100deg, rgba(255,255,255,.12) 0 4%, transparent 4% 11%); -webkit-mask: linear-gradient(#000, transparent); mask: linear-gradient(#000, transparent); animation: kd-sway 9s ease-in-out infinite alternate; }
.app-shell .kd-bubble { bottom: -4vmin; aspect-ratio: 1; border-radius: 50%; border: .35vmin solid rgba(255,255,255,.75); background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.7) 0 18%, rgba(255,255,255,.08) 22%); animation-name: kd-rise; animation-timing-function: linear; animation-iteration-count: infinite; }
.app-shell .kd-fish { width: 9vmin; animation: kd-swim linear infinite; transform: scaleX(-1); /* drawn facing left; they swim to the right */ }
.app-shell .kd-fish path { fill: #ffa94d; } .app-shell .kd-fish circle { fill: #2b2140; }
.app-shell .kd-fish--0 { top: 30vh; animation-duration: 34s; }
.app-shell .kd-fish--1 { top: 55vh; width: 7vmin; animation-duration: 46s; animation-delay: -20s; }
.app-shell .kd-fish--1 path { fill: #ff8fab; }
.app-shell .kd-fish--2 { top: 18vh; width: 6vmin; animation-duration: 58s; animation-delay: -35s; }
.app-shell .kd-fish--2 path { fill: #ffd43b; }
.app-shell .kd-weed { bottom: 6vh; width: 6vmin; height: 26vmin; fill: none; stroke: #2fb57a; stroke-width: 7; stroke-linecap: round; transform-origin: bottom center; animation: kd-sway 4s ease-in-out infinite alternate; }
.app-shell .kd-weed--0 { left: 8vw; } .app-shell .kd-weed--1 { right: 12vw; height: 20vmin; animation-delay: -2s; stroke: #63e6a4; }
.app-shell .kd-waves { left: 0; bottom: 0; width: 200%; height: 14vh; animation: kd-slide 16s linear infinite; }
.app-shell .kd-wave--back { fill: rgba(255,255,255,.18); } .app-shell .kd-wave--front { fill: #f3d9a4; }

/* Space: twinkling stars, a ringed planet, the moon, a comet and a little rocket. */
.app-shell .kd-star { aspect-ratio: 1; border-radius: 50%; background: #fff; box-shadow: 0 0 1vmin #fff; animation-name: kd-twinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; }
.app-shell .kd-planet { right: 8vw; top: 14vh; width: 20vmin; height: 20vmin; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #ffc9de, #ff8fab 45%, #c2477a); animation: kd-bob 7s ease-in-out infinite; }
.app-shell .kd-planet i { position: absolute; left: -30%; right: -30%; top: 38%; height: 24%; border-radius: 50%; border: 1.1vmin solid #ffd43b; transform: rotate(-14deg); box-shadow: 0 0 0 .5vmin rgba(255,212,59,.25); }
.app-shell .kd-moon { left: 7vw; bottom: 12vh; width: 13vmin; height: 13vmin; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #fff 0 25%, #e9ecef 26%), #e9ecef; box-shadow: inset -2vmin -1vmin 0 rgba(0,0,0,.08); animation: kd-bob 9s ease-in-out -3s infinite; }
.app-shell .kd-comet { top: 10vh; left: -20vw; width: 18vw; height: .5vmin; border-radius: 99px; background: linear-gradient(90deg, transparent, #fff); animation: kd-comet 11s ease-in 4s infinite; }
.app-shell .kd-rocket { left: 40vw; bottom: -20vmin; width: 7vmin; animation: kd-launch 22s ease-in-out 2s infinite; }
.app-shell .kd-rocket__body { fill: #f8f9fa; } .app-shell .kd-rocket__window { fill: #74c0fc; stroke: #2b2140; stroke-width: 2; } .app-shell .kd-rocket__fin { fill: #ff6b6b; } .app-shell .kd-rocket__flame { fill: #ffd43b; animation: kd-flicker .15s linear infinite alternate; transform-origin: 20px 58px; }

/* Candy: a rainbow, soft clouds, falling confetti and floating hearts. */
.app-shell .kd-rainbow { left: 50%; bottom: -2vh; width: min(110vw, 150vh); transform: translateX(-50%); opacity: .75; }
.app-shell .kd-scene--candy .kd-cloud--0 { top: auto; bottom: 4vh; left: 6vw; animation: kd-bob 8s ease-in-out infinite; }
.app-shell .kd-scene--candy .kd-cloud--1 { top: auto; bottom: 6vh; right: 6vw; left: auto; animation: kd-bob 10s ease-in-out -4s infinite; }
.app-shell .kd-confetti { top: -4vh; width: 1.4vmin; height: 2.4vmin; border-radius: .4vmin; animation-name: kd-fall; animation-timing-function: linear; animation-iteration-count: infinite; }
.app-shell .kd-heart { width: 5vmin; fill: #ff8fab; opacity: .8; animation: kd-rise 16s linear infinite; bottom: -6vmin; }
.app-shell .kd-heart--0 { left: 14vw; } .app-shell .kd-heart--1 { left: 38vw; animation-delay: -6s; width: 3.4vmin; fill: #b197fc; }
.app-shell .kd-heart--2 { left: 66vw; animation-delay: -11s; } .app-shell .kd-heart--3 { left: 86vw; animation-delay: -3s; width: 4vmin; fill: #ffa94d; }

/* Characters */
.app-shell .kd-balloon { width: 8vmin; left: 40vw; top: 2vh; animation: kd-balloon 18s ease-in-out infinite; }
.app-shell .kd-jelly { width: 7vmin; left: 44vw; top: 6vh; animation: kd-jelly 6s ease-in-out infinite; }
.app-shell .kd-starfish { width: 9vmin; left: 4vw; bottom: 3vh; transform: rotate(-12deg); animation: kd-wiggle-slow 5s ease-in-out infinite; }
.app-shell .kd-ufo { width: 13vmin; left: 32vw; top: 2vh; animation: kd-ufo 14s ease-in-out infinite; }
.app-shell .kd-ufo__light { animation: kd-blink 1s steps(2, jump-none) infinite; }
.app-shell .kd-lolly { width: 8vmin; bottom: -2vh; transform-origin: bottom center; animation: kd-sway 5s ease-in-out infinite alternate; }
.app-shell .kd-lolly--0 { left: 3vw; } .app-shell .kd-lolly--1 { right: 3vw; width: 6.5vmin; animation-delay: -2.5s; }
.app-shell .kd-candy { width: 9vmin; animation: kd-bob 6s ease-in-out infinite; }
.app-shell .kd-candy--0 { left: 42vw; top: 5vh; }
.app-shell .kd-candy--1 { right: 18vw; top: 12vh; width: 7vmin; animation-delay: -2s; }
.app-shell .kd-candy--2 { left: 58vw; top: 30vh; width: 6vmin; animation-delay: -4s; }
@keyframes kd-balloon { 0%, 100% { transform: translate(0, 0) rotate(-3deg); } 50% { transform: translate(10vw, 3vh) rotate(3deg); } }
@keyframes kd-jelly { 0%, 100% { transform: translateY(0) scaleY(1); } 40% { transform: translateY(-3vh) scaleY(.92); } 60% { transform: translateY(-3.5vh) scaleY(1.04); } }
@keyframes kd-wiggle-slow { 0%, 100% { transform: rotate(-12deg); } 50% { transform: rotate(6deg); } }
@keyframes kd-ufo { 0%, 100% { transform: translate(0, 0) rotate(-4deg); } 50% { transform: translate(14vw, 2vh) rotate(4deg); } }
@keyframes kd-blink { 0% { fill: #ffd43b; } 100% { fill: #63e6a4; } }
/* Enchanted (pink): sparkles, pink hills, a castle with waving flags, butterflies and rising hearts. */
.app-shell .kd-scene--fairy { background: linear-gradient(180deg, #ffc6e2 0%, #ffd9ec 50%, #fff0f7 100%); }
.app-shell .kd-glow { left: 50%; top: -30vh; width: 120vmin; height: 80vmin; transform: translateX(-50%); border-radius: 50%; background: radial-gradient(closest-side, rgba(255,255,255,.75), rgba(255,255,255,0)); }
.app-shell .kd-sparkle { fill: #fff; filter: drop-shadow(0 0 .6vmin rgba(255,255,255,.9)); animation-name: kd-twinkle; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; }
.app-shell .kd-hills--fairy .kd-hill--back { fill: #ffb3d9; }
.app-shell .kd-hills--fairy .kd-hill--front { fill: #ff8fc4; }
.app-shell .kd-castle { right: 4vw; bottom: 9vh; width: 24vmin; }
.app-shell .kd-castle__flag { animation: kd-flag 1.6s ease-in-out infinite alternate; }
.app-shell .kd-butterfly { width: 7vmin; animation: kd-flutter 18s ease-in-out infinite; }
.app-shell .kd-butterfly--0 { left: 30vw; top: 4vh; }
.app-shell .kd-butterfly--1 { left: 60vw; top: 22vh; width: 5.5vmin; animation-delay: -6s; animation-duration: 22s; }
.app-shell .kd-butterfly--2 { left: 8vw; top: 46vh; width: 6vmin; animation-delay: -12s; animation-duration: 20s; }
.app-shell .kd-butterfly__wing { transform-box: fill-box; animation: kd-wings .32s ease-in-out infinite alternate; }
.app-shell .kd-butterfly__wing--l { transform-origin: right center; } .app-shell .kd-butterfly__wing--r { transform-origin: left center; }
.app-shell .kd-scene--fairy .kd-heart { fill: #ff6b9a; }
.app-shell .kd-scene--fairy .kd-heart--1 { fill: #da77f2; } .app-shell .kd-scene--fairy .kd-heart--3 { fill: #ff8fab; }

/* Road (blue): sun and clouds, green hills and trees, a road whose lines run and little cars both ways. */
.app-shell .kd-scene--road { background: linear-gradient(180deg, #4dabf7 0%, #a5d8ff 55%, #e7f5ff 100%); }
.app-shell .kd-sun--road { top: 3vh; right: 8vw; width: 18vmin; height: 18vmin; }
/* Soft green hills behind the road (no city: it made the scene busy). */
.app-shell .kd-hills--road { bottom: 14vh; height: 18vh; }
.app-shell .kd-hills--road .kd-hill--back { fill: #8ce99a; } .app-shell .kd-hills--road .kd-hill--front { fill: #69db7c; }
.app-shell .kd-tree { bottom: 14.5vh; width: 5vmin; }
.app-shell .kd-tree--0 { left: 3vw; } .app-shell .kd-tree--1 { left: 24vw; width: 4vmin; } .app-shell .kd-tree--2 { left: 47vw; } .app-shell .kd-tree--3 { left: 71vw; width: 4.4vmin; } .app-shell .kd-tree--4 { left: 92vw; }
.app-shell .kd-road { left: 0; right: 0; bottom: 0; height: 15vh; background: linear-gradient(180deg, #51cf66 0 1.2vh, #495057 1.2vh calc(100% - 1vh), #51cf66 calc(100% - 1vh)); border-top: 3px solid #231b3d; overflow: hidden; }
.app-shell .kd-road__lines { position: absolute; left: 0; top: 50%; width: 200%; height: .9vh; margin-top: -.45vh; background: repeating-linear-gradient(90deg, #fff3bf 0 5vw, transparent 5vw 9vw); animation: kd-lines 2.4s linear infinite; }
.app-shell .kd-car { width: 13vmin; animation: kd-drive linear infinite; }
.app-shell .kd-car--0 { bottom: 6.6vh; animation-duration: 14s; }
.app-shell .kd-car--1 { bottom: 6.6vh; width: 11vmin; animation-duration: 14s; animation-delay: -7s; }
.app-shell .kd-car--2, .app-shell .kd-car--3 { bottom: 1.2vh; transform: scaleX(-1); animation-name: kd-drive-back; }
.app-shell .kd-car--2 { animation-duration: 11s; animation-delay: -3s; }
.app-shell .kd-car--3 { width: 12vmin; animation-duration: 11s; animation-delay: -8.5s; }
.app-shell .kd-car__body { animation: kd-bump .5s ease-in-out infinite alternate; }
.app-shell .kd-car__wheel { animation: kd-spin .6s linear infinite; }
@keyframes kd-flag { from { transform: rotate(-6deg) scaleX(.85); } to { transform: rotate(4deg) scaleX(1.05); } }
@keyframes kd-wings { from { transform: scaleX(1); } to { transform: scaleX(.35); } }
@keyframes kd-flutter { 0%, 100% { transform: translate(0, 0) rotate(-6deg); } 25% { transform: translate(8vw, -4vh) rotate(8deg); } 50% { transform: translate(14vw, 3vh) rotate(-4deg); } 75% { transform: translate(5vw, 6vh) rotate(6deg); } }
@keyframes kd-lines { to { transform: translateX(-9vw); } }
@keyframes kd-drive { from { left: -16vmin; } to { left: 104vw; } }
@keyframes kd-drive-back { from { left: 104vw; } to { left: -16vmin; } }
@keyframes kd-bump { from { transform: translateY(0); } to { transform: translateY(-1.5px); } }
@keyframes kd-spin { to { transform: rotate(360deg); } }
@keyframes kd-drift { from { left: -30vmin; } to { left: 105vw; } }
@keyframes kd-drift-r { from { left: -6vmin; } to { left: 104vw; } }
@keyframes kd-flap { to { transform: scaleY(.5); } }
@keyframes kd-rise { from { transform: translateY(0); opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } to { transform: translateY(-110vh); opacity: 0; } }
@keyframes kd-fall { from { transform: translateY(0) rotate(0); } to { transform: translateY(112vh) rotate(540deg); } }
@keyframes kd-swim { from { left: -12vmin; } to { left: 106vw; } }
@keyframes kd-sway { from { transform: rotate(-6deg); } to { transform: rotate(6deg); } }
@keyframes kd-slide { to { transform: translateX(-50%); } }
@keyframes kd-twinkle { from { opacity: .25; transform: scale(.7); } to { opacity: 1; transform: scale(1.1); } }
@keyframes kd-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.6vmin); } }
@keyframes kd-comet { 0% { transform: translate(0, 0) rotate(18deg); opacity: 0; } 10% { opacity: 1; } 40% { transform: translate(140vw, 46vh) rotate(18deg); opacity: 0; } 100% { opacity: 0; transform: translate(140vw, 46vh) rotate(18deg); } }
@keyframes kd-launch { 0%, 55% { transform: translateY(0); } 85% { transform: translateY(-140vh); } 100% { transform: translateY(-140vh); } }
@keyframes kd-flicker { to { transform: scaleY(.6); } }

/* Calm when it should be: still scenes and no hops for reduced motion or a still background. */
@media (prefers-reduced-motion: reduce) {
  .app-shell.view-kids *, .app-shell .kd-scene * { animation: none !important; transition: none !important; }
}
.app-shell.view-kids.ambient-still .kd-scene * { animation-play-state: paused; }

/* Layout picker thumbnail */
/* Layout picture: the Kids Home in small, with the sky, the header, the scene chips, the candy cards and the dock. */
:is(.app-shell, .onboarding-screen) .lp-thumb--kids { flex-direction: column; gap: 3px; padding: 6px 7px; background: linear-gradient(180deg, #74c0fc 0%, #a5d8ff 60%, #d0ebff 100%); }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids > * { position: relative; z-index: 1; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids > .lp-kids-sun { position: absolute; z-index: 0; top: -9px; right: -7px; width: 28px; height: 28px; border-radius: 50%; background: #ffd43b; box-shadow: 0 0 0 4px rgba(255,212,59,.35); }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids > .lp-kids-cloud { position: absolute; z-index: 0; top: 8px; left: 58px; width: 22px; height: 7px; border-radius: 99px; background: #fff; opacity: .85; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids > .lp-kids-cloud::before { content: ""; position: absolute; left: 5px; bottom: 3px; width: 10px; height: 8px; border-radius: 50%; background: inherit; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids > .lp-kids-hill { position: absolute; z-index: 0; left: -10%; right: -10%; bottom: -14px; height: 26px; border-radius: 50% 50% 0 0; background: #8ce99a; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kh { display: flex; align-items: center; gap: 2px; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kh b { width: 22px; height: 6px; margin-right: auto; border-radius: 2px; background: #231b3d; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kh em { width: 14px; height: 6px; border-radius: 99px; background: #fff; box-shadow: 0 0 0 1px #231b3d; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kh em + em { width: 6px; border-radius: 50%; background: #ffa8a8; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kt { width: 52%; height: 5px; border-radius: 2px; background: #231b3d; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kc { display: flex; gap: 3px; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kc i { width: 15px; height: 5px; border-radius: 99px; background: #ffd43b; box-shadow: 0 0 0 1px #231b3d, 0 1px 0 1px rgba(35,27,61,.42); }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kc i:nth-child(2) { background: #8ce99a; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kc i:nth-child(3) { background: #a5d8ff; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg { flex: 1; display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: 1fr 1fr; gap: 4px 3px; margin-top: 1px; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i { position: relative; border-radius: 4px; background: #ffd66b; box-shadow: 0 0 0 1px #231b3d, 0 1.5px 0 1px rgba(35,27,61,.42); }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i em { position: absolute; top: 2px; right: 2px; width: 5px; height: 5px; border-radius: 50%; background: #fff; box-shadow: 0 0 0 1px #231b3d; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i::after { content: ""; position: absolute; left: 2px; bottom: 2px; width: 55%; height: 1.5px; border-radius: 1px; background: #231b3d; opacity: .75; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i:nth-child(6n+2) { background: #8ce99a; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i:nth-child(6n+3) { background: #74c0fc; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i:nth-child(6n+4) { background: #ffa8c5; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i:nth-child(6n+5) { background: #b197fc; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i:nth-child(6n) { background: #ffc078; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i:nth-child(n+7) { background: #fff3d6; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i:nth-child(8) { background: #d3f9d8; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i:nth-child(9) { background: #d0ebff; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kg i:nth-child(10) { background: #ffdeeb; }
:is(.app-shell, .onboarding-screen) .lp-thumb--kids .lp-kd { align-self: center; width: 50%; height: 7px; margin-top: 2px; border-radius: 99px; background: #fff; box-shadow: 0 0 0 1px #231b3d, 0 1px 0 1px rgba(35,27,61,.42); }

/* Kids backgrounds in Settings and in the first setup */
.onboarding-screen .onboarding-kids { margin-top: 22px; display: grid; gap: 8px; text-align: left; }
.onboarding-screen .onboarding-kids h2 { margin: 0; font-size: 20px; }
.onboarding-screen .onboarding-kids p { margin: 0 0 6px; opacity: .75; }
.onboarding-screen .st-kids-scenes { --u: 7px; --on: #ffd43b; }
:is(.app-shell, .onboarding-screen) .st-kids-scenes { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 140px), 1fr)); gap: calc(var(--u)*1.2); }
:is(.app-shell, .onboarding-screen) .st-kids-scenes button { position: relative; display: grid; gap: calc(var(--u)*.8); padding: 0; border: 0; background: none; color: inherit; font: 600 calc(var(--u)*1.8)/1.2 var(--f-body); text-align: left; cursor: pointer; }
:is(.app-shell, .onboarding-screen) .st-kids-scenes .st-kids-scene { position: relative; display: block; height: calc(var(--u)*11); border-radius: calc(var(--u)*2); overflow: hidden; border: 3px solid transparent; transform: translateZ(0); }
:is(.app-shell, .onboarding-screen) .st-kids-scene--sky { background: radial-gradient(circle at 82% 18%, #ffd43b 0 14%, transparent 15%), radial-gradient(ellipse at 30% 40%, #fff 0 16%, transparent 17%), radial-gradient(ellipse at 120% 120%, #51cf66 0 45%, transparent 46%), radial-gradient(ellipse at -10% 125%, #8ce99a 0 50%, transparent 51%), linear-gradient(180deg, #5cc8ff, #d9f4ff); }
:is(.app-shell, .onboarding-screen) .st-kids-scene--ocean { background: radial-gradient(circle at 20% 70%, rgba(255,255,255,.7) 0 4%, transparent 5%), radial-gradient(circle at 34% 45%, rgba(255,255,255,.6) 0 3%, transparent 4%), radial-gradient(circle at 70% 60%, rgba(255,255,255,.6) 0 5%, transparent 6%), radial-gradient(ellipse at 50% 130%, #f3d9a4 0 40%, transparent 41%), linear-gradient(180deg, #3fd0e0, #136f9e); }
:is(.app-shell, .onboarding-screen) .st-kids-scene--space { background: radial-gradient(circle at 74% 34%, #ff8fab 0 15%, transparent 16%), radial-gradient(circle at 18% 72%, #e9ecef 0 10%, transparent 11%), radial-gradient(circle at 40% 20%, #fff 0 1.5%, transparent 2%), radial-gradient(circle at 60% 80%, #fff 0 1.5%, transparent 2%), radial-gradient(circle at 12% 30%, #fff 0 1.5%, transparent 2%), radial-gradient(120% 90% at 70% 20%, #4b3a9b, #120c33); }
:is(.app-shell, .onboarding-screen) .st-kids-scene--fairy { background: radial-gradient(circle at 20% 25%, #fff 0 2%, transparent 3%), radial-gradient(circle at 45% 15%, #fff 0 1.5%, transparent 2.5%), radial-gradient(circle at 30% 50%, #fff 0 1.5%, transparent 2.5%), linear-gradient(#ff8fab, #ff8fab) 74% 40%/10% 45% no-repeat, linear-gradient(#ffd6ec, #ffd6ec) 82% 55%/22% 35% no-repeat, radial-gradient(ellipse at 50% 135%, #ff8fc4 0 45%, transparent 46%), linear-gradient(180deg, #ffc6e2, #fff0f7); }
:is(.app-shell, .onboarding-screen) .st-kids-scene--road { background: radial-gradient(circle at 84% 22%, #ffd43b 0 11%, transparent 12%), linear-gradient(#ff6b6b, #ff6b6b) 22% 76%/22% 10% no-repeat, linear-gradient(#ffd43b, #ffd43b) 66% 88%/20% 9% no-repeat, linear-gradient(90deg, #fff3bf 0 20%, transparent 20% 40%) 0 84%/40% 3% repeat-x, linear-gradient(180deg, transparent 68%, #495057 68%), radial-gradient(ellipse at 30% 100%, #69db7c 0 30%, transparent 31%) 0 0/100% 70% no-repeat, radial-gradient(ellipse at 80% 100%, #8ce99a 0 34%, transparent 35%) 0 0/100% 70% no-repeat, linear-gradient(180deg, #4dabf7, #e7f5ff); }
:is(.app-shell, .onboarding-screen) .st-kids-scene--candy { background: radial-gradient(circle at 50% 120%, transparent 0 34%, #b197fc 35% 39%, #4dabf7 40% 44%, #69db7c 45% 49%, #ffd43b 50% 54%, #ffa94d 55% 59%, #ff6b6b 60% 64%, transparent 65%), linear-gradient(180deg, #ffd6ec, #cfe8ff); }
:is(.app-shell, .onboarding-screen) .st-kids-scenes button[aria-pressed="true"] .st-kids-scene { border-color: var(--on); }
`;
