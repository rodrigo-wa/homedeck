// Floating edit button, tap cards, screensaver, Spotify and the select controls.
export const themeExtras = String.raw`
/* Dock and the floating Edit button share one baseline at the bottom */
.app-shell { --dock-bottom: calc(var(--u)*2.4 + env(safe-area-inset-bottom, 0px)); --dock-height: calc(var(--u)*6.2 + 2px); }
.app-shell .navigation-dock { bottom: var(--dock-bottom); max-width: calc(100% - var(--u)*24); }
.app-shell .navigation-dock button { height: calc(var(--u)*4.6); padding-top: 0; padding-bottom: 0; }
/* Edit mode: the tabs after Home are dragged sideways to reorder them. */
.app-shell .navigation-dock--editing { touch-action: none; outline: 1.5px dashed color-mix(in srgb, var(--ink) 35%, transparent); outline-offset: calc(var(--u)*.4); }
.app-shell .navigation-dock--editing button[data-tab] { cursor: grab; background: color-mix(in srgb, var(--ink) 8%, transparent); user-select: none; -webkit-user-select: none; }
.app-shell .navigation-dock--editing button.navigation-dock__dragging { cursor: grabbing; background: var(--paper); color: var(--paper-ink); }
.app-shell .edit-fab {
  position: fixed; right: calc(var(--u)*4); bottom: var(--dock-bottom); z-index: 21; width: var(--dock-height); height: var(--dock-height);
  display: inline-flex; align-items: center; justify-content: center; padding: 0; border-radius: var(--hd-round,50%);
  border: 1px solid var(--hd-frame,var(--line)); background: var(--glass); color: var(--ink); backdrop-filter: blur(var(--hd-blur,22px)) saturate(1.3); -webkit-backdrop-filter: blur(var(--hd-blur,22px)) saturate(1.3);
  box-shadow: 0 calc(var(--u)*1.2) calc(var(--u)*4) rgba(0,0,0,.35); font: 600 calc(var(--u)*1.9)/1 var(--f-body); cursor: pointer;
}
.app-shell .edit-fab--on { background: rgba(255,255,255,.92); color: #1d1a17; border-color: transparent; }
.app-shell:has(.hd-sheet-backdrop, .hd-player, .hd-saver) .edit-fab,
.app-shell:has(.hd-player, .hd-saver) .navigation-dock { visibility: hidden; }

/* Tap cards: the whole card is the switch, press and hold opens the details */
.app-shell .device-tile--tap { cursor: pointer; -webkit-tap-highlight-color: transparent; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; }
.app-shell .device-tile--tap:active:not(:has(input:active, button:active)) { transform: scale(.98); }
.app-shell .device-tile--tap .device-tile__top { min-height: calc(var(--u)*5); }

/* Screensaver */
.app-shell .hd-saver {
  position: fixed; inset: 0; z-index: 90; display: grid; place-items: center; color: #fff; cursor: pointer;
  background: color-mix(in srgb, var(--ambient-4, #120f14) 40%, rgba(0,0,0,.3));
  backdrop-filter: blur(32px) saturate(.9) brightness(.82); -webkit-backdrop-filter: blur(32px) saturate(.9) brightness(.82);
  animation: hd-saver-in .6s ease;
}
@keyframes hd-saver-in { from { opacity: 0; } }
.app-shell .hd-saver__clock { display: flex; flex-direction: column; align-items: center; gap: min(2.4vw, 22px); transform: translateY(-4vh); text-align: center; }
.app-shell .hd-saver__time { font: 300 min(30vw, 42vh, 260px)/.82 var(--f-display); letter-spacing: -.02em; font-variant-numeric: tabular-nums; text-shadow: 0 2px 24px rgba(0,0,0,.18); }
.app-shell .hd-saver__date { font: 600 min(3.2vw, 28px)/1.2 var(--f-body); letter-spacing: .14em; text-transform: uppercase; opacity: .82; }
.app-shell .hd-saver__weather { display: flex; align-items: center; gap: 10px; font: 500 min(3vw, 24px)/1.2 var(--f-body); opacity: .8; }
.app-shell .hd-saver__hint { position: absolute; left: 0; right: 0; bottom: calc(48px + env(safe-area-inset-bottom, 0px)); text-align: center; font: 500 13px/1 var(--f-body); letter-spacing: .06em; opacity: .45; }

/* Spotify card */
/* The grid cell is the size container: a container can only restyle its descendants. */
.app-shell .hd-item:has(> .spotify-card) { container: tile / inline-size; }
.app-shell .spotify-card { flex-direction: row; align-items: center; justify-content: flex-start; gap: calc(var(--u)*2); cursor: pointer; }
/* Higher specificity than the generic top-right button of widget cards. */
.app-shell .spotify-card > .spotify-card__cover {
  position: static; inset: auto; height: auto; flex: none; width: min(42%, calc(var(--u)*14)); aspect-ratio: 1; border: 0; padding: 0; border-radius: calc(var(--u)*2*var(--hd-r,1)); cursor: pointer;
  background: conic-gradient(from 200deg, #1c7c4a, #1fd36b, #b8f5cf, #0f3f2a, #1c7c4a) center / cover no-repeat; color: rgba(255,255,255,.75);
  display: grid; place-items: center; box-shadow: 0 8px 20px -8px rgba(0,0,0,.5);
}
.app-shell .spotify-card > .spotify-card__cover:not(.spotify-card__cover--empty) { background-size: cover; background-position: center; }
.app-shell .spotify-card__meta { flex: 1; min-width: 0; align-self: stretch; display: flex; flex-direction: column; justify-content: space-between; gap: calc(var(--u)*1.1); }
.app-shell .spotify-card.spotify-card--idle { flex-direction: column; align-items: center; justify-content: center; gap: calc(var(--u)*1.2); text-align: center; }
.app-shell .spotify-card.spotify-card--idle > strong { margin: 0; max-width: 100%; font: 600 calc(var(--u)*1.9)/1.15 var(--f-body); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .spotify-card.spotify-card--idle > .spotify-card__start { position: static; inset: auto; flex: none; width: calc(var(--u)*7); height: calc(var(--u)*7); padding: 0; border: 0; border-radius: var(--hd-round,50%); display: grid; place-items: center; background: #fff; color: #111; cursor: pointer; }
.app-shell .spotify-card.spotify-card--idle > .spotify-card__start:disabled { opacity: .4; cursor: default; }
.app-shell .spotify-card__source { display: flex; align-items: center; gap: calc(var(--u)*.6); font: 700 calc(var(--u)*1.5)/1 var(--f-body); letter-spacing: .08em; text-transform: uppercase; color: #1fd36b; }
.app-shell .spotify-card__source > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .spotify-card__source--other, .app-shell .hd-player__source--other { color: rgba(255,255,255,.72); }
.app-shell .spotify-card__line { display: flex; align-items: center; gap: calc(var(--u)*1); min-width: 0; }
.app-shell .spotify-card__line > .spotify-card__copy { flex: 1; }
.app-shell .spotify-card__thumb { flex: none; width: calc(var(--u)*5); height: calc(var(--u)*5); border-radius: calc(var(--u)*1*var(--hd-r,1)); background: center / cover no-repeat; }
.app-shell .spotify-card__copy { display: flex; flex-direction: column; gap: calc(var(--u)*.35); min-width: 0; }
.app-shell .spotify-card__copy strong { font: 600 calc(var(--u)*2.05)/1.15 var(--f-body); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .spotify-card__copy small { font: 500 calc(var(--u)*1.75)/1.25 var(--f-body); color: var(--ink-2); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .spotify-card__bar { height: calc(var(--u)*.9); border-radius: var(--hd-pill,99px); background: rgba(255,255,255,.2); overflow: hidden; }
.app-shell .spotify-card__bar b { display: block; height: 100%; border-radius: inherit; background: #fff; transition: width 1s linear; }
.app-shell .spotify-card__controls { display: flex; align-items: center; justify-content: center; gap: calc(var(--u)*1.4); }
.app-shell .spotify-card__controls > button { width: calc(var(--u)*3.8); height: calc(var(--u)*3.8); border: 0; padding: 0; border-radius: var(--hd-round,50%); display: grid; place-items: center; background: none; color: inherit; cursor: pointer; flex: none; }
.app-shell .spotify-card__controls > .spotify-card__pp { width: calc(var(--u)*5); height: calc(var(--u)*5); background: #fff; color: #111; }
.app-shell .spotify-card__volume { margin-left: auto; display: flex; align-items: center; gap: calc(var(--u)*.6); font: 600 calc(var(--u)*1.6)/1 var(--f-body); color: var(--ink-2); font-variant-numeric: tabular-nums; }
.app-shell .spotify-card__volume button { width: calc(var(--u)*3.2); height: calc(var(--u)*3.2); border: 0; padding: 0; border-radius: var(--hd-round,50%); display: grid; place-items: center; background: rgba(255,255,255,.15); color: var(--ink); cursor: pointer; }
@container tile (max-width: 330px) {
  .app-shell .spotify-card { flex-direction: column; align-items: stretch; }
  .app-shell .spotify-card > .spotify-card__cover { width: calc(var(--u)*6.4); }
  .app-shell .spotify-card__source { order: -1; }
  .app-shell .spotify-card__volume { display: none; }
}

/* Full-screen player */
.app-shell .hd-player { --u: clamp(5px, min(calc(var(--hd-vh, 1vh)*.95), 1.8vw), 12px); position: fixed; inset: 0; z-index: 80; overflow: hidden; color: #fff; background: color-mix(in srgb, var(--ambient-4, #120f14) 40%, rgba(0,0,0,.3)); backdrop-filter: blur(32px) saturate(.9) brightness(.82); -webkit-backdrop-filter: blur(32px) saturate(.9) brightness(.82); animation: hd-player-in .35s cubic-bezier(.2,.8,.2,1); }
@keyframes hd-player-in { from { opacity: 0; transform: translateY(3%); } }
.app-shell .hd-player__bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.app-shell .hd-player__bg i { position: absolute; inset: -20%; background: radial-gradient(60% 50% at 30% 30%, var(--on, #c98a3a) 0, transparent 70%), radial-gradient(60% 60% at 75% 70%, #3a4d7a 0, transparent 70%), #1b1820; background-size: cover; background-position: center; filter: blur(80px) saturate(1.5) brightness(.7); transform: scale(1.15); }
.app-shell .hd-player__bg::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,.15), rgba(0,0,0,.55)); }
/* The one close button: round, frosted, like the Spotify player's */
.app-shell .hd-close { width: calc(var(--u)*6); height: calc(var(--u)*6); flex: none; padding: 0; border: 0; border-radius: var(--hd-round,50%); display: grid; place-items: center; background: rgba(255,255,255,.16); color: #fff; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); cursor: pointer; }
.app-shell .hd-close:active { background: rgba(255,255,255,.26); }
.app-shell .hd-player__close { position: absolute; z-index: 2; top: calc(var(--u)*3 + env(safe-area-inset-top, 0px)); right: calc(var(--u)*3); }
.app-shell .hd-player__scroll { position: absolute; inset: 0; z-index: 1; display: flex; flex-direction: column; align-items: center; overflow: hidden auto; overscroll-behavior: contain; scrollbar-width: none; padding: calc(var(--u)*6 + env(safe-area-inset-top, 0px)) calc(var(--u)*4) calc(var(--u)*4 + env(safe-area-inset-bottom, 0px)); }
.app-shell .hd-player__wrap { margin: auto 0; width: min(100%, calc(var(--u)*62)); display: flex; flex-direction: column; align-items: center; gap: calc(var(--u)*2.6); text-align: center; }
.app-shell .hd-player__wrap > * { width: 100%; min-width: 0; }
/* The player as a window (Options of the player's card): a framed box over the dimmed panel. */
.app-shell .hd-player-window { position: fixed; inset: 0; z-index: 80; display: grid; place-items: center; padding: calc(var(--u)*3); background: rgba(0,0,0,.45); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); animation: hd-fade .2s ease; }
.app-shell .hd-player.hd-player--window { position: relative; inset: auto; width: min(100%, 680px); height: min(100%, 820px); border-radius: calc(var(--u)*4*var(--hd-r,1)); box-shadow: 0 30px 90px rgba(0,0,0,.5); border: 1px solid rgba(255,255,255,.14); }
.app-shell .hd-player--window .hd-player__close { top: calc(var(--u)*2.4); right: calc(var(--u)*2.4); }
.app-shell .hd-player--window .hd-player__scroll { padding: calc(var(--u)*6) calc(var(--u)*3.4) calc(var(--u)*3.4); }
.app-shell .hd-player--window .hd-player__art { width: min(calc(var(--hd-vh, 1vh)*28), 70%, 340px); }
/* The player's own buttons: logos (radio stations) as tiles, the rest as pills. */
.app-shell .hd-player__extras { display: flex; flex-wrap: wrap; justify-content: center; gap: calc(var(--u)*1); }
.app-shell .hd-player__extra { display: inline-flex; align-items: center; gap: calc(var(--u)*.8); padding: calc(var(--u)*1) calc(var(--u)*1.8); border-radius: var(--hd-pill,99px); border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.12); color: #fff; font: 600 calc(var(--u)*1.7)/1.1 var(--f-body); cursor: pointer; }
.app-shell .hd-player__extra[aria-pressed="true"] { background: var(--on); color: var(--on-ink); border-color: transparent; }
.app-shell .hd-player__extra--picture { flex-direction: column; padding: calc(var(--u)*.6); border-radius: calc(var(--u)*2*var(--hd-r,1)); width: calc(var(--u)*11); }
.app-shell .hd-player__extra--picture i { width: 100%; aspect-ratio: 1; border-radius: calc(var(--u)*1.5*var(--hd-r,1)); background: center / cover no-repeat; }
.app-shell .hd-player__extra--picture span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: calc(var(--u)*1.4); }
.app-shell .hd-player-parts { display: flex; flex-wrap: wrap; gap: calc(var(--u)*.8); margin-top: calc(var(--u)*1); }
.app-shell .hd-player-parts .hd-pill[aria-pressed="false"] { opacity: .5; text-decoration: line-through; }
.app-shell .hd-player-buttons-edit { list-style: none; margin: calc(var(--u)*1) 0; padding: 0; display: flex; flex-direction: column; gap: calc(var(--u)*.6); }
.app-shell .hd-player-buttons-edit li { display: flex; align-items: center; gap: calc(var(--u)*.6); }
.app-shell .hd-player-buttons-edit li span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .hd-player-buttons-edit li button { width: calc(var(--u)*3.6); height: calc(var(--u)*3.6); border-radius: 50%; border: 0; display: grid; place-items: center; background: rgba(255,255,255,.12); color: inherit; cursor: pointer; }
.app-shell .hd-player-buttons-edit li button:first-of-type svg { transform: rotate(-90deg); }
.app-shell .hd-player-buttons-edit li button:disabled { opacity: .3; cursor: default; }
.app-shell .hd-player__art { width: min(calc(var(--hd-vh, 1vh)*34), 86vw, 560px); aspect-ratio: 1; border-radius: calc(var(--u)*3*var(--hd-r,1)); display: grid; place-items: center; color: rgba(255,255,255,.55); background: linear-gradient(135deg, #3a4d7a, #b5523f) center / cover no-repeat; box-shadow: 0 calc(var(--u)*3) calc(var(--u)*9) rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.12); transition: transform .45s cubic-bezier(.2,.8,.2,1); }
.app-shell .hd-player__art--paused { transform: scale(.92); }
.app-shell .hd-player__source { display: inline-flex; align-items: center; justify-content: center; gap: calc(var(--u)*.8); font: 700 calc(var(--u)*1.5)/1 var(--f-body); letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.62); }
.app-shell .hd-player__source svg { color: #1ed760; }
.app-shell .hd-player__source--other svg { color: inherit; }
.app-shell .hd-player__title { margin-top: calc(var(--u)*1.2); font: 600 calc(var(--u)*4.6)/1.08 var(--f-display); overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.app-shell .hd-player__artist { margin-top: calc(var(--u)*.8); font: 500 calc(var(--u)*2.2)/1.2 var(--f-body); color: rgba(255,255,255,.72); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.app-shell .hd-player__track { display: grid; gap: calc(var(--u)*.6); }
.app-shell .hd-player__bar { position: relative; height: calc(var(--u)*3); display: flex; align-items: center; cursor: pointer; touch-action: none; }
.app-shell .hd-player__bar::before { content: ""; position: absolute; left: 0; right: 0; height: calc(var(--u)*.8); border-radius: var(--hd-pill,99px); background: rgba(255,255,255,.22); }
.app-shell .hd-player__bar b { position: absolute; left: 0; height: calc(var(--u)*.8); border-radius: var(--hd-pill,99px); background: #fff; }
.app-shell .hd-player__bar b::after { content: ""; position: absolute; right: calc(var(--u)*-1.1); top: 50%; width: calc(var(--u)*2.2); height: calc(var(--u)*2.2); margin-top: calc(var(--u)*-1.1); border-radius: var(--hd-round,50%); background: #fff; box-shadow: 0 1px 6px rgba(0,0,0,.35); transform: scale(0); transition: transform .15s; }
.app-shell .hd-player__bar:hover b::after, .app-shell .hd-player__bar--drag b::after { transform: scale(1); }
.app-shell .hd-player__bar--drag::before, .app-shell .hd-player__bar--drag b { height: calc(var(--u)*1.2); }
.app-shell .hd-player__times { display: flex; justify-content: space-between; font: 600 calc(var(--u)*1.6)/1 var(--f-body); color: rgba(255,255,255,.6); font-variant-numeric: tabular-nums; }
.app-shell .hd-player__controls { display: grid; grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); align-items: center; column-gap: calc(var(--u)*2); }
.app-shell .hd-player__side { display: flex; gap: calc(var(--u)*.6); justify-self: start; }
.app-shell .hd-player__side--end { justify-self: end; }
.app-shell .hd-player__main { display: flex; align-items: center; gap: calc(var(--u)*2.2); }
.app-shell .hd-player__controls button { position: relative; border: 0; background: none; color: #fff; padding: 0; width: calc(var(--u)*6.4); height: calc(var(--u)*6.4); border-radius: var(--hd-round,50%); display: grid; place-items: center; cursor: pointer; }
.app-shell .hd-player__controls button:active { background: rgba(255,255,255,.14); }
.app-shell .hd-player__controls .hd-player__pp { width: calc(var(--u)*10); height: calc(var(--u)*10); background: #fff; color: #111; box-shadow: 0 calc(var(--u)*1.4) calc(var(--u)*4) rgba(0,0,0,.35); }
.app-shell .hd-player__small { color: rgba(255,255,255,.55) !important; }
.app-shell .hd-player__small--on { color: #1ed760 !important; }
.app-shell .hd-player__small--on::after { content: ""; position: absolute; bottom: calc(var(--u)*.4); left: 50%; width: 4px; height: 4px; margin-left: -2px; border-radius: 50%; background: currentColor; }
.app-shell .hd-player__volume { display: flex; align-items: center; gap: calc(var(--u)*.4); padding: calc(var(--u)*.5); border-radius: var(--hd-pill,99px); background: rgba(255,255,255,.13); }
.app-shell .hd-player__volume button { width: calc(var(--u)*4.8) !important; height: calc(var(--u)*4.8) !important; background: rgba(255,255,255,.14) !important; }
.app-shell .hd-player__volume span { min-width: calc(var(--u)*6); text-align: center; font: 600 calc(var(--u)*1.9)/1 var(--f-body); font-variant-numeric: tabular-nums; }
.app-shell .hd-player__devices { display: flex; flex-wrap: wrap; justify-content: center; gap: calc(var(--u)*.9); }
.app-shell .hd-player__devices button { display: inline-flex; align-items: center; gap: calc(var(--u)*.7); max-width: 100%; border: 0; border-radius: var(--hd-pill,99px); padding: calc(var(--u)*1) calc(var(--u)*1.8); background: rgba(255,255,255,.13); color: #fff; font: 600 calc(var(--u)*1.7)/1.2 var(--f-body); cursor: pointer; }
.app-shell .hd-player__devices button span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.app-shell .hd-player__devices button[aria-pressed="true"] { background: #fff; color: #111; }
.app-shell .hd-player__devices button[aria-pressed="true"] svg { color: #1a9f4a; }
@media (orientation: portrait) {
  .app-shell .hd-player__controls { grid-template-columns: minmax(0,1fr) auto minmax(0,1fr); grid-template-areas: "m m m" "s . v"; row-gap: calc(var(--u)*1.6); }
  .app-shell .hd-player__main { grid-area: m; justify-self: center; }
  .app-shell .hd-player__side { grid-area: s; }
  .app-shell .hd-player__side--end { grid-area: v; }
}

/* Select: trigger, floating list and phone sheet (px units: also used outside the shell) */
.hdx-select {
  display: inline-flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%; min-width: 0; min-height: 44px; padding: 0 14px 0 16px;
  border-radius: calc(14px*var(--hd-r,1)); border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.1); color: #fff;
  font: 600 15px/1.2 "HomeDeck Figtree", "Figtree", system-ui, sans-serif; text-align: left; cursor: pointer; transition: background .15s, border-color .15s;
}
.hdx-select > span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hdx-select svg { flex: none; transform: rotate(90deg); opacity: .7; transition: transform .2s; }
.hdx-select--open { border-color: rgba(255,255,255,.55); background: rgba(255,255,255,.16); }
.hdx-select--open svg { transform: rotate(-90deg); }
.hdx-select:disabled { opacity: .45; cursor: default; }
.hdx-select:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
.hdx-select__list {
  position: fixed; z-index: 95; overflow: auto; padding: 6px; border-radius: calc(16px*var(--hd-r,1)); color: #1d1a17;
  /* Light frosted glass, like iOS menus and the light pills of the dock. */
  background: rgba(255,255,255,.86); border: 1px solid rgba(255,255,255,.6);
  backdrop-filter: blur(30px) saturate(1.6); -webkit-backdrop-filter: blur(30px) saturate(1.6);
  box-shadow: 0 18px 50px rgba(0,0,0,.4); font: 500 15px/1.25 "HomeDeck Figtree", "Figtree", system-ui, sans-serif; animation: hdx-pop .14s ease-out; overscroll-behavior: contain;
}
.hdx-select__list--up { transform: translateY(-100%); animation-name: hdx-pop-up; }
@keyframes hdx-pop { from { opacity: 0; transform: translateY(-4px); } }
@keyframes hdx-pop-up { from { opacity: 0; transform: translateY(calc(-100% + 4px)); } }
.hdx-select__option { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; padding: 10px 12px; border-radius: calc(10px*var(--hd-r,1)); cursor: pointer; }
.hdx-select__option > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hdx-select__option--active { background: rgba(0,0,0,.06); }
.hdx-select__option[aria-selected="true"] { font-weight: 700; }
/* Deeper shade of the highlight: the light tone alone fades on white. */
.hdx-select__option[aria-selected="true"] svg { color: color-mix(in srgb, var(--on, #ffc94d) 62%, #000); }
.hdx-select__backdrop { position: fixed; inset: 0; z-index: 95; background: rgba(0,0,0,.45); animation: hdx-fade .2s ease; }
@keyframes hdx-fade { from { opacity: 0; } }
.hdx-select__list--sheet {
  left: 0; right: 0; bottom: 0; max-height: 72vh; border-radius: calc(22px*var(--hd-r,1)) calc(22px*var(--hd-r,1)) 0 0; padding: 10px 12px calc(16px + env(safe-area-inset-bottom, 0px));
  font-size: 17px; animation: hdx-sheet .25s cubic-bezier(.2,.8,.2,1);
}
.hdx-select__list--sheet::before { content: ""; display: block; width: 40px; height: 5px; margin: 0 auto 10px; border-radius: var(--hd-pill,99px); background: rgba(0,0,0,.18); }
@keyframes hdx-sheet { from { transform: translateY(100%); } }
.hdx-select__sheet-title { padding: 4px 12px 10px; font: 700 13px/1.2 "HomeDeck Figtree", "Figtree", system-ui, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: rgba(29,26,23,.5); }
.hdx-select__list--sheet .hdx-select__option { min-height: 52px; }
.hdx-segmented { display: inline-flex; padding: 4px; gap: 4px; border-radius: var(--hd-pill,99px); background: rgba(0,0,0,.22); }
.hdx-segmented button { min-height: 36px; padding: 0 16px; border: 0; border-radius: var(--hd-pill,99px); background: none; color: rgba(255,255,255,.72); font: 600 14px/1 "HomeDeck Figtree", "Figtree", system-ui, sans-serif; cursor: pointer; white-space: nowrap; }
.hdx-segmented button[aria-checked="true"] { background: rgba(255,255,255,.92); color: #1d1a17; }
.app-shell .st-row .hdx-select { width: auto; min-width: min(52%, 280px); }

/* Phones: the dock is a strip you drag sideways, between fixed edges, as tall as the main dashboard's
   (56px), with the Edit button beside it at the same height. Like the main dashboard, it sits low: it
   takes 30px off the bottom safe area (the home indicator). */
@media (max-width: 720px) {
  .app-shell {
    /* A little higher and slimmer than before, closer to the other layouts' dock. */
    --dock-bottom: max(10px, calc(var(--u)*1.6 + env(safe-area-inset-bottom, 0px) - 14px));
    --dock-height: calc(var(--u)*7.2);
    --dock-side: calc(var(--u)*2.4 + env(safe-area-inset-right, 0px));
  }
  .app-shell .navigation-dock {
    left: calc(var(--u)*2.4 + env(safe-area-inset-left, 0px)); right: calc(var(--dock-side) + var(--dock-height) + var(--u)*1.2);
    transform: none; max-width: none; height: var(--dock-height); box-sizing: border-box; align-items: stretch; padding: calc(var(--u)*.6);
  }
  .app-shell .navigation-dock button { height: auto; padding: 0 calc(var(--u)*1.8); font-size: calc(var(--u)*1.95); }
  .app-shell .navigation-dock button svg { width: calc(var(--u)*2.7); height: calc(var(--u)*2.7); }
  .app-shell .edit-fab { right: var(--dock-side); }
}
}

/* Settings: card color + vivid highlight, with a live sample */
.app-shell .st-colors { display: grid; grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: "cards preview" "vivid preview"; gap: calc(var(--u)*2.4) calc(var(--u)*3); }
.app-shell .st-colors__group { display: flex; flex-direction: column; gap: calc(var(--u)*1.2); }
.app-shell .st-colors__group:first-of-type { grid-area: cards; }
.app-shell .st-colors__group:last-of-type { grid-area: vivid; }
.app-shell .st-colors__group > p { margin: calc(var(--u)*-.6) 0 calc(var(--u)*.2); color: var(--ink-2); font: 500 calc(var(--u)*1.7)/1.35 var(--f-body); }
.app-shell .st-colors__preview { grid-area: preview; align-self: center; position: relative; padding: calc(var(--u)*1.2); }
.app-shell .st-colors__card {
  display: flex; flex-direction: column; width: calc(var(--u)*20); padding: calc(var(--u)*2); gap: calc(var(--u)*.4); border-radius: calc(var(--u)*3.4*var(--hd-r,1));
  background: var(--hd-accent); color: #2b2418; box-shadow: 0 calc(var(--u)*1.6) calc(var(--u)*4) rgba(0,0,0,.3); transition: background .25s;
}
.app-shell .st-colors__card i { width: calc(var(--u)*5); height: calc(var(--u)*5); margin-bottom: calc(var(--u)*3); border-radius: var(--hd-round,50%); display: grid; place-items: center; background: var(--on); color: var(--on-ink); transition: background .25s; }
.app-shell .st-colors__card b { font: 600 calc(var(--u)*2.05)/1.15 var(--f-body); }
.app-shell .st-colors__card small { font: 500 calc(var(--u)*1.75)/1.2 var(--f-body); color: rgba(43,36,24,.62); }
.app-shell .st-colors__card em { display: block; height: calc(var(--u)*3.2); margin-top: calc(var(--u)*1.2); border-radius: var(--hd-pill,99px); background: rgba(43,36,24,.1); overflow: hidden; }
.app-shell .st-colors__card em span { display: block; width: 75%; height: 100%; border-radius: inherit; background: var(--on); transition: background .25s; }
.app-shell .st-colors__badge { position: absolute; top: 0; right: 0; min-width: calc(var(--u)*3.4); height: calc(var(--u)*3.4); padding: 0 calc(var(--u)*.8); border-radius: var(--hd-pill,99px); display: grid; place-items: center; background: var(--on); color: var(--on-ink); font: 700 calc(var(--u)*1.6)/1 var(--f-body); box-shadow: 0 2px 8px rgba(0,0,0,.3); }
.app-shell .st-swatches--vivid button { box-shadow: none; }
@media (max-width: 720px) {
  .app-shell .st-colors { grid-template-columns: minmax(0, 1fr); grid-template-areas: "preview" "cards" "vivid"; }
  .app-shell .st-colors__preview { justify-self: center; }
}

/* Room card toggle mirrors the icon: same distance from the top and side edges. The top row
   already sits inside the card padding, so the button anchors to its corner. Size unchanged. */
.app-shell .room-card__top { position: relative; }
.app-shell .room-card .room-card__power { top: 0; right: 0; }

/* ---------- Double-size cards: more controls ---------- */
.app-shell .device-tile--wide { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); grid-template-rows: auto 1fr; column-gap: calc(var(--u)*2.4); row-gap: calc(var(--u)*1); }
.app-shell .device-tile--wide > .device-tile__top { grid-area: 1 / 1; }
.app-shell .device-tile--wide > .device-tile__copy { grid-area: 2 / 1; align-self: end; }
.app-shell .device-tile--wide > .tile-wide { grid-area: 1 / 2 / 3 / 3; align-self: center; min-width: 0; }
.app-shell .widget-card--wide { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); grid-template-rows: auto 1fr auto; column-gap: calc(var(--u)*2.4); align-items: end; }
.app-shell .widget-card--wide > .widget-card__icon { grid-area: 1 / 1; align-self: start; }
.app-shell .widget-card--wide > strong { grid-area: 2 / 1; }
.app-shell .widget-card--wide > p { grid-area: 3 / 1; margin: 0; }
.app-shell .widget-card--wide > .tile-wide, .app-shell .widget-card--wide > .widget-list { grid-area: 1 / 2 / 4 / 3; align-self: center; min-width: 0; }
.app-shell .tile-wide__controls { display: flex; flex-direction: column; gap: calc(var(--u)*1.1); }
.app-shell .tile-wide__since { margin: 0; text-align: right; color: var(--ink-2); font: 500 calc(var(--u)*1.6)/1.3 var(--f-body); }
.app-shell .device-tile--active .tile-wide__since { color: var(--paper-ink-2); }
.app-shell .tile-slider { display: flex; align-items: center; gap: calc(var(--u)*1); margin: 0; }
.app-shell .tile-slider__track { position: relative; flex: 1; min-width: 0; height: calc(var(--u)*3.6); border-radius: var(--hd-pill,99px); overflow: hidden; background: color-mix(in srgb, currentColor 14%, transparent); }
.app-shell .tile-slider__track b { background: color-mix(in srgb, currentColor 50%, transparent); }
.app-shell .tile-slider__track b::after { background: currentColor; }
.app-shell :is(.device-tile--active, .widget-card--playing) .tile-slider__track { background: rgba(43,36,24,.1); }
.app-shell :is(.device-tile--active, .widget-card--playing) .tile-slider__track b { background: var(--lc, var(--on)); }
.app-shell :is(.device-tile--active, .widget-card--playing) .tile-slider__track b::after { background: rgba(43,36,24,.55); }
.app-shell .tile-slider--off .tile-slider__track b { display: none; }
.app-shell .tile-slider > span { min-width: calc(var(--u)*4.4); text-align: right; font: 600 calc(var(--u)*1.6)/1 var(--f-body); font-variant-numeric: tabular-nums; opacity: .75; }
/* Climate, double size: target on a ring beside the modes and − / +, like the main dashboard */
.app-shell .tile-climate { display: grid; grid-template-columns: auto minmax(0, 1fr); grid-template-areas: "ring seg" "ring step"; column-gap: calc(var(--u)*2); row-gap: calc(var(--u)*1); align-items: center; --cool: #6cb8ff; --heat: #ff9b5e; }
.app-shell .device-tile--wide-climate { grid-template-columns: auto minmax(0, 1fr); grid-template-rows: auto 1fr auto auto; grid-template-areas: "ring copy" "ring ." "ring seg" "ring step"; column-gap: calc(var(--u)*2.2); }
.app-shell .device-tile--wide.device-tile--wide-climate > .device-tile__top { display: none; }
.app-shell .device-tile--wide.device-tile--wide-climate > .device-tile__copy { grid-area: copy; align-self: start; }
.app-shell .widget-card--wide.widget-card--climate { grid-template-columns: auto minmax(0, 1fr); grid-template-rows: auto auto 1fr auto auto; grid-template-areas: "ring label" "ring copy" "ring ." "ring seg" "ring step"; column-gap: calc(var(--u)*2.2); align-items: stretch; }
.app-shell .widget-card--climate > .widget-card__label { grid-area: label; position: static; }
.app-shell .widget-card--wide.widget-card--climate > p { grid-area: copy; margin: calc(var(--u)*.4) 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell :is(.device-tile--wide-climate, .widget-card--climate) > .tile-wide, .app-shell :is(.device-tile--wide-climate, .widget-card--climate) .tile-climate { display: contents; }
.app-shell .tile-ring { grid-area: ring; position: relative; width: calc(var(--u)*13); aspect-ratio: 1; display: grid; place-items: center; align-self: center; }
.app-shell .tile-ring svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(135deg); }
.app-shell .tile-ring circle { fill: none; stroke-width: 7; stroke-linecap: round; }
.app-shell .tile-ring__track { stroke: color-mix(in srgb, currentColor 16%, transparent); }
.app-shell .tile-ring__value { stroke: var(--cool); transition: stroke-dasharray .4s ease; }
.app-shell .tile-ring--heat .tile-ring__value { stroke: var(--heat); }
.app-shell .tile-ring strong { position: relative; font: 300 calc(var(--u)*4.4)/1 var(--f-display); font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
.app-shell .tile-ring strong small { font-size: .5em; vertical-align: top; margin-left: 1px; }
.app-shell :is(.device-tile--active, .widget-card--playing) .tile-climate { --cool: #2f86d6; --heat: #e0702a; }
.app-shell .tile-seg { grid-area: seg; display: flex; padding: calc(var(--u)*.35); border-radius: var(--hd-pill,99px); background: color-mix(in srgb, currentColor 12%, transparent); }
.app-shell .tile-seg button { flex: 1; min-width: 0; height: calc(var(--u)*3.6); border: 0; border-radius: var(--hd-pill,99px); background: none; color: inherit; opacity: .72; cursor: pointer; font: 600 calc(var(--u)*1.5)/1 var(--f-body); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.app-shell .tile-seg button[aria-pressed="true"] { opacity: 1; background: rgba(255,255,255,.92); color: #1d1a17; }
.app-shell :is(.device-tile--active, .widget-card--playing) .tile-seg button[aria-pressed="true"] { background: var(--paper-ink, #2a2110); color: var(--paper, #f4edd9); }
.app-shell .tile-step { grid-area: step; display: flex; gap: calc(var(--u)*.8); }
.app-shell .tile-step button { flex: 1; height: calc(var(--u)*4.2); border: 0; border-radius: var(--hd-pill,99px); background: color-mix(in srgb, currentColor 13%, transparent); color: inherit; cursor: pointer; display: grid; place-items: center; }
.app-shell .tile-step button:disabled { opacity: .35; cursor: default; }

/* Covers, double size: a vertical position bar and open / stop / close stacked */
.app-shell .device-tile--wide-cover > .tile-wide { align-self: stretch; }
.app-shell .tile-cover { flex-direction: row; justify-content: flex-end; align-items: stretch; height: 100%; gap: calc(var(--u)*1); }
.app-shell .tile-vslider { position: relative; width: calc(var(--u)*6.2); min-height: calc(var(--u)*11); border-radius: calc(var(--u)*1.8*var(--hd-r,1)); overflow: hidden; background: color-mix(in srgb, currentColor 12%, transparent); cursor: ns-resize; touch-action: none; outline-offset: 2px; }
.app-shell .tile-vslider[aria-disabled="true"] { cursor: default; }
.app-shell .tile-vslider b { position: absolute; left: 0; right: 0; bottom: 0; height: var(--value); background: color-mix(in srgb, currentColor 42%, transparent); transition: height .2s ease; }
.app-shell .device-tile--active .tile-vslider b { background: var(--lc, var(--on)); }
.app-shell .tile-vslider span { position: absolute; left: 0; right: 0; bottom: calc(var(--u)*.8); text-align: center; font: 600 calc(var(--u)*1.45)/1 var(--f-body); font-variant-numeric: tabular-nums; }
.app-shell .tile-buttons--vertical { flex-direction: column; width: calc(var(--u)*5.2); }
.app-shell .tile-buttons--vertical button { flex: 1; height: auto; min-height: calc(var(--u)*3.4); padding: 0; }
.app-shell .tile-swatches { display: flex; flex-wrap: wrap; gap: calc(var(--u)*.8); }
.app-shell .tile-swatches button { width: calc(var(--u)*3.4); height: calc(var(--u)*3.4); padding: 0; border-radius: var(--hd-round,50%); border: 2px solid color-mix(in srgb, currentColor 18%, transparent); cursor: pointer; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); transition: transform .15s; }
.app-shell .tile-swatches button[aria-pressed="true"] { border-color: currentColor; transform: scale(1.08); }
.app-shell :is(.tile-buttons, .tile-chips, .tile-target) button {
  border: 0; border-radius: var(--hd-pill,99px); cursor: pointer; color: inherit; background: color-mix(in srgb, currentColor 13%, transparent);
  font: 600 calc(var(--u)*1.55)/1 var(--f-body); display: inline-flex; align-items: center; justify-content: center; gap: calc(var(--u)*.6);
}
.app-shell :is(.tile-buttons, .tile-chips, .tile-target) button:disabled { opacity: .35; cursor: default; }
.app-shell .tile-buttons { display: flex; align-items: center; gap: calc(var(--u)*.8); }
.app-shell .tile-buttons button { flex: 1; height: calc(var(--u)*4.4); padding: 0 calc(var(--u)*1.2); white-space: nowrap; }
.app-shell .tile-buttons .tile-buttons__icon { flex: 0 0 calc(var(--u)*4.4); padding: 0; }
.app-shell .tile-buttons--media { justify-content: center; }
.app-shell .tile-buttons .tile-buttons__main { flex-basis: calc(var(--u)*5.4); height: calc(var(--u)*5.4); background: currentColor; }
.app-shell .tile-buttons .tile-buttons__main svg { color: var(--paper, #f4edd9); }
.app-shell .device-tile--active .tile-buttons .tile-buttons__main svg, .app-shell .widget-card--playing .tile-buttons .tile-buttons__main svg { color: #fff; }
.app-shell .tile-buttons .tile-buttons__warn { background: #e5484d; color: #fff; }
.app-shell .tile-chips { display: flex; align-items: center; gap: calc(var(--u)*.6); overflow-x: auto; scrollbar-width: none; }
.app-shell .tile-chips::-webkit-scrollbar { display: none; }
.app-shell .tile-chips button { flex: none; height: calc(var(--u)*3.6); padding: 0 calc(var(--u)*1.3); }
.app-shell .tile-chips--small button { height: calc(var(--u)*3); font-size: calc(var(--u)*1.4); text-transform: capitalize; }
.app-shell .tile-chips > svg { flex: none; opacity: .6; }
.app-shell .tile-chips button[aria-pressed="true"] { background: currentColor; }
.app-shell .tile-chips button[aria-pressed="true"] > * , .app-shell .tile-chips button[aria-pressed="true"] { color: var(--paper, #f4edd9); }
.app-shell .device-tile--active .tile-chips button[aria-pressed="true"], .app-shell .widget-card--playing .tile-chips button[aria-pressed="true"] { background: var(--paper-ink, #2a2110); color: var(--paper, #f4edd9); }
.app-shell .tile-target { display: flex; align-items: center; justify-content: space-between; gap: calc(var(--u)*1); }
.app-shell .tile-target strong { font: 300 calc(var(--u)*4.2)/1 var(--f-display); font-variant-numeric: tabular-nums; }
.app-shell .tile-target button { width: calc(var(--u)*4.6); height: calc(var(--u)*4.6); padding: 0; }
.app-shell .widget-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: calc(var(--u)*.5); }
.app-shell .widget-list button { width: 100%; display: flex; justify-content: space-between; gap: calc(var(--u)*1); padding: calc(var(--u)*.8) calc(var(--u)*1.2); border: 0; border-radius: calc(var(--u)*1.4*var(--hd-r,1)); background: color-mix(in srgb, currentColor 9%, transparent); color: inherit; font: 500 calc(var(--u)*1.6)/1.2 var(--f-body); cursor: pointer; text-align: left; }
.app-shell .widget-list button span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .widget-list button small { flex: none; opacity: .65; }
.app-shell .widget-list button.widget-list--alert { background: rgba(229,72,77,.22); }
/* Today card: a dot in the calendar's color before each event, an empty ring before each reminder. */
.app-shell .widget-list__dot { display: inline-block; width: calc(var(--u)*.9); height: calc(var(--u)*.9); margin-right: calc(var(--u)*.8); border-radius: var(--hd-round,50%); vertical-align: .1em; }
.app-shell .widget-list__dot--todo { box-sizing: border-box; border: 2px solid currentColor; opacity: .6; }
.app-shell .widget-card--today .widget-list small { text-transform: none; }
.app-shell .widget-card--today > p { text-transform: none; }
/* Double size: the weekday in the card's body size, and three rows at most, so the card keeps its row's height. */
.app-shell .widget-card--today.widget-card--wide > strong { font: 600 calc(var(--u)*2.2)/1.2 var(--f-body); -webkit-line-clamp: 2; overflow-wrap: anywhere; }
.app-shell .widget-card--today .widget-list button { padding-block: calc(var(--u)*.6); }
.app-shell .widget-card--today:not(.widget-card--wide) > strong { font: 600 calc(var(--u)*2.2)/1.2 var(--f-body); -webkit-line-clamp: 3; }
.app-shell .widget-card--wide > .widget-card__empty { grid-area: 1 / 2 / 4 / 3; align-self: center; margin: 0; opacity: .6; }
/* Spotify, double size: times, shuffle, repeat and a volume slider. */
.app-shell .spotify-card__progress { display: flex; align-items: center; gap: calc(var(--u)*1); }
.app-shell .spotify-card__progress .spotify-card__bar { flex: 1; }
.app-shell .spotify-card__progress small { font: 600 calc(var(--u)*1.35)/1 var(--f-body); color: var(--ink-2); font-variant-numeric: tabular-nums; }
.app-shell .spotify-card__controls > .spotify-card__toggle { opacity: .55; }
.app-shell .spotify-card__controls > .spotify-card__toggle--on { opacity: 1; color: #1ed760; }
.app-shell .spotify-card--wide .spotify-card__controls { flex-wrap: wrap; align-items: center; row-gap: calc(var(--u)*.6); }
/* Double size: shuffle, previous, play, next and repeat on one line; the volume buttons on the next. */
.app-shell .spotify-card--wide .spotify-card__controls { column-gap: calc(var(--u)*.6); }
.app-shell .spotify-card--wide .spotify-card__volume { flex-basis: 100%; margin-left: 0; justify-content: flex-start; }
.app-shell .spotify-card__slider { flex: 1 0 100%; min-width: 0; display: flex; align-items: center; gap: calc(var(--u)*.8); color: var(--ink-2); }
.app-shell .spotify-card__slider .tile-slider { flex: 1; color: var(--ink); }
.app-shell .spotify-card__slider .tile-slider__track { height: calc(var(--u)*2.6); }

/* ---------- Calendar and reminders beside the clock ---------- */
.app-shell .context-header__time { display: flex; align-items: center; gap: calc(var(--u)*1.4); flex-wrap: wrap; }
.app-shell .hd-agenda { display: inline-flex; gap: calc(var(--u)*.8); margin-top: calc(var(--u)*.6); }
.app-shell .hd-agenda__button { position: relative; width: calc(var(--u)*5.4); height: calc(var(--u)*5.4); min-width: 40px; min-height: 40px; padding: 0; border: 1px solid var(--hd-frame,var(--line)); border-radius: var(--hd-round,50%); display: grid; place-items: center; background: var(--glass); color: var(--ink); cursor: pointer; backdrop-filter: blur(var(--hd-blur,22px)); -webkit-backdrop-filter: blur(var(--hd-blur,22px)); -webkit-tap-highlight-color: transparent; }
.app-shell .hd-agenda__button:active { background: rgba(255,255,255,.2); }
.app-shell .hd-agenda__button b { position: absolute; top: -3px; right: -3px; min-width: 20px; height: 20px; padding: 0 5px; box-sizing: border-box; border-radius: var(--hd-pill,99px); display: grid; place-items: center; background: var(--on); color: var(--on-ink, #2a2110); font: 700 11px/1 var(--f-body); }
.app-shell .hd-agenda__button b.hd-agenda__late { background: #ff6b5e; color: #fff; }

/* Reminders sheet */
.app-shell .hd-todo { gap: calc(var(--u)*1.8); width: min(92%, 620px); }
.app-shell .hd-todo__head { display: flex; align-items: center; gap: calc(var(--u)*1.6); }
.app-shell .hd-todo__head > div { flex: 1; min-width: 0; }
.app-shell .hd-todo__head h2 { margin: 0; font: 500 calc(var(--u)*3.2)/1.1 var(--f-display); }
.app-shell .hd-todo__head p { margin: calc(var(--u)*.4) 0 0; color: var(--ink-2); font: 500 calc(var(--u)*1.7)/1.3 var(--f-body); }
.app-shell .hd-todo__section { display: flex; flex-direction: column; gap: calc(var(--u)*.8); }
.app-shell .hd-todo__item { display: flex; align-items: center; gap: calc(var(--u)*1.4); padding: calc(var(--u)*1.3) calc(var(--u)*1.6); border: 0; border-radius: calc(var(--u)*2*var(--hd-r,1)); background: rgba(255,255,255,.08); color: var(--ink); text-align: left; cursor: pointer; transition: opacity .3s; -webkit-tap-highlight-color: transparent; }
.app-shell .hd-todo__item:active { background: rgba(255,255,255,.14); }
.app-shell .hd-todo__check { flex: none; width: calc(var(--u)*3.2); height: calc(var(--u)*3.2); border-radius: var(--hd-round,50%); box-shadow: inset 0 0 0 2px rgba(255,255,255,.7); display: grid; place-items: center; color: transparent; transition: background .2s, color .2s; }
.app-shell .hd-todo__item--late .hd-todo__check { box-shadow: inset 0 0 0 2px #ff8a7e; }
.app-shell .hd-todo__item--done { opacity: .45; }
.app-shell .hd-todo__item--done .hd-todo__check { background: var(--on); box-shadow: none; color: #2a2110; }
.app-shell .hd-todo__item--done b { text-decoration: line-through; }
.app-shell .hd-todo__copy { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.app-shell .hd-todo__copy b { font: 600 calc(var(--u)*2)/1.25 var(--f-body); }
.app-shell .hd-todo__copy small { color: var(--ink-3); font: 500 calc(var(--u)*1.55)/1.3 var(--f-body); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.app-shell .hd-todo__when { flex: none; color: var(--ink-2); font: 600 calc(var(--u)*1.6)/1 var(--f-body); font-variant-numeric: tabular-nums; }
.app-shell .hd-todo__item--late .hd-todo__when { color: #ff9a8f; }
.app-shell .hd-todo__ok, .app-shell .hd-todo__empty { display: flex; align-items: center; gap: calc(var(--u)*1.2); margin: 0; padding: calc(var(--u)*2); border-radius: calc(var(--u)*2*var(--hd-r,1)); background: rgba(255,255,255,.06); color: var(--ink-2); font: 500 calc(var(--u)*1.9)/1.3 var(--f-body); }
.app-shell .hd-todo__ok svg { color: #7bd88f; }

/* Calendar: full screen month with the day's agenda */
.app-shell .hd-cal { --cb: clamp(40px, 5.6vmin, 54px); --co: clamp(14px, 2.4vmin, 26px); --u: clamp(5px, min(1vh, 1.6vw), 12px); position: fixed; inset: 0; z-index: 100; display: flex; flex-direction: column; gap: calc(var(--u)*1.6); padding: calc(var(--co) + env(safe-area-inset-top, 0px)) calc(var(--co) + env(safe-area-inset-right, 0px)) calc(var(--co) + env(safe-area-inset-bottom, 0px)) calc(var(--co) + env(safe-area-inset-left, 0px)); background: #000; color: var(--ink); animation: hd-cal-in .35s cubic-bezier(.2,.8,.2,1); }
/* Same opening as the main dashboard: rises a little while fading in. */
@keyframes hd-cal-in { from { opacity: 0; transform: translateY(3%); } to { opacity: 1; transform: none; } }
.app-shell .hd-cal__head { position: relative; display: flex; align-items: center; gap: 10px; height: var(--cb); flex: none; padding-right: calc(var(--cb) + 10px); }
.app-shell .hd-cal__head .hd-close { position: absolute; top: 0; right: 0; width: var(--cb); height: var(--cb); }
.app-shell .hd-cal__head .hd-pill { height: var(--cb); padding: 0 calc(var(--cb)*.42); font-size: calc(var(--cb)*.32); }
.app-shell .hd-cal__nav { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; }
.app-shell .hd-cal__nav h2 { margin: 0; min-width: calc(var(--u)*26); font: 500 calc(var(--u)*3.6)/1 var(--f-display); white-space: nowrap; }
.app-shell .hd-cal__nav h2 span { color: var(--ink-2); font-weight: 300; }
.app-shell .hd-cal__round { width: var(--cb); height: var(--cb); flex: none; padding: 0; border: 0; border-radius: var(--hd-round,50%); display: grid; place-items: center; background: rgba(255,255,255,.12); color: var(--ink); cursor: pointer; }
.app-shell .hd-cal__body { flex: 1; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, clamp(240px, 30%, 420px)); gap: calc(var(--u)*2); }
.app-shell .hd-cal__month, .app-shell .hd-cal__agenda { min-height: 0; display: flex; flex-direction: column; border-radius: calc(var(--u)*3*var(--hd-r,1)); background: #000; border: 1px solid rgba(255,255,255,.1); }
.app-shell .hd-cal__month { padding: calc(var(--u)*1.2); }
.app-shell .hd-cal__week { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); padding: calc(var(--u)*.4) 0 calc(var(--u)*.8); }
.app-shell .hd-cal__week span { text-align: center; color: var(--ink-3); font: 700 calc(var(--u)*1.4)/1 var(--f-body); letter-spacing: .12em; text-transform: uppercase; }
.app-shell .hd-cal__grid { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); grid-template-rows: repeat(6, minmax(0, 1fr)); gap: calc(var(--u)*.5); }
.app-shell .hd-cal__day { min-width: 0; min-height: 0; overflow: hidden; display: flex; flex-direction: column; gap: calc(var(--u)*.4); padding: calc(var(--u)*.7); border: 0; border-radius: calc(var(--u)*1.6*var(--hd-r,1)); background: rgba(255,255,255,.055); color: var(--ink); text-align: left; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.app-shell .hd-cal__day:active { background: rgba(255,255,255,.12); }
.app-shell .hd-cal__day--out { opacity: .35; }
.app-shell .hd-cal__day--selected { background: rgba(255,255,255,.14); box-shadow: inset 0 0 0 2px rgba(255,255,255,.75); }
.app-shell .hd-cal__num { align-self: flex-start; flex: none; min-width: calc(var(--u)*3.4); height: calc(var(--u)*3.4); padding: 0 calc(var(--u)*.6); border-radius: var(--hd-pill,99px); display: grid; place-items: center; font: 600 calc(var(--u)*1.75)/1 var(--f-body); font-variant-numeric: tabular-nums; }
.app-shell .hd-cal__day--today .hd-cal__num { background: var(--on); color: #2a2110; }
.app-shell .hd-cal__chips { min-height: 0; overflow: hidden; display: flex; flex-direction: column; gap: calc(var(--u)*.3); }
.app-shell .hd-cal__chip { flex: none; min-width: 0; display: flex; align-items: center; gap: calc(var(--u)*.5); padding: calc(var(--u)*.2) calc(var(--u)*.6); border-radius: calc(var(--u)*.8*var(--hd-r,1)); background: color-mix(in srgb, var(--c) 22%, transparent); font: 600 calc(var(--u)*1.3)/1.3 var(--f-body); }
.app-shell .hd-cal__chip i { flex: none; width: 3px; align-self: stretch; border-radius: calc(2px*var(--hd-r,1)); background: var(--c); }
.app-shell .hd-cal__chip span { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.app-shell .hd-cal__more { padding-left: calc(var(--u)*.6); color: var(--ink-2); font: 600 calc(var(--u)*1.25)/1 var(--f-body); }
.app-shell .hd-cal__dotrow { display: none; gap: 3px; justify-content: center; }
.app-shell .hd-cal__dotrow i { width: 6px; height: 6px; border-radius: var(--hd-round,50%); }
.app-shell .hd-cal__agenda { gap: calc(var(--u)*1.4); padding: calc(var(--u)*2); }
.app-shell .hd-cal__agenda h3 { margin: calc(var(--u)*.3) 0 0; font: 500 calc(var(--u)*3)/1.1 var(--f-display); }
.app-shell .hd-cal__list { flex: 1; min-height: 0; overflow-y: auto; scrollbar-width: none; display: flex; flex-direction: column; gap: calc(var(--u)*1); }
.app-shell .hd-cal__event { flex: none; display: flex; gap: calc(var(--u)*1.2); padding: calc(var(--u)*1.4); border-radius: calc(var(--u)*2*var(--hd-r,1)); background: color-mix(in srgb, var(--c) 14%, rgba(255,255,255,.04)); }
.app-shell .hd-cal__event > i { flex: none; width: 4px; border-radius: calc(3px*var(--hd-r,1)); background: var(--c); }
.app-shell .hd-cal__event > div { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: calc(var(--u)*.5); }
.app-shell .hd-cal__event b { font: 600 calc(var(--u)*2.1)/1.2 var(--f-body); }
.app-shell .hd-cal__event span { min-width: 0; display: flex; align-items: center; gap: calc(var(--u)*.6); color: var(--ink-2); font: 500 calc(var(--u)*1.6)/1.3 var(--f-body); }
.app-shell .hd-cal__event em { margin-left: auto; padding-left: calc(var(--u)*1); color: var(--c); font-style: normal; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.app-shell .hd-cal__event small { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: inherit; }
.app-shell .hd-cal__event p { margin: 0; color: var(--ink-3); font: 500 calc(var(--u)*1.5)/1.35 var(--f-body); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.app-shell .hd-cal__empty { margin: 0; color: var(--ink-3); font: 500 calc(var(--u)*1.8)/1.3 var(--f-body); }
@media (max-width: 720px) {
  .app-shell .hd-cal { --u: 6px; }
  .app-shell .hd-cal__head { flex-wrap: wrap; height: auto; row-gap: 10px; }
  .app-shell .hd-cal__nav { flex-basis: 100%; }
  .app-shell .hd-cal__nav h2 { min-width: 0; font-size: calc(var(--u)*3.4); }
  .app-shell .hd-cal__body { grid-template-columns: minmax(0, 1fr); grid-template-rows: minmax(0, 1.15fr) minmax(0, 1fr); }
  .app-shell .hd-cal__chips { display: none; }
  .app-shell .hd-cal__dotrow { display: flex; margin-top: auto; }
  .app-shell .hd-cal__num { align-self: center; }
}
}

/* ---------- Forecast window, as in the main dashboard ---------- */
.app-shell .hd-forecast { display: flex; flex-direction: column; gap: calc(var(--u)*1.6); width: min(720px, 100%); }
.app-shell .hd-forecast > * { flex: none; }
.app-shell .hd-forecast__now { display: flex; align-items: center; gap: calc(var(--u)*2); margin: calc(var(--u)*1) 0 0; }
.app-shell .hd-forecast__now > strong { font: 300 calc(var(--u)*7.4)/1 var(--f-display); letter-spacing: -.03em; }
.app-shell .hd-forecast__now > span { display: flex; flex-direction: column; gap: calc(var(--u)*.5); }
.app-shell .hd-forecast__now b { font: 600 calc(var(--u)*2.2)/1.2 var(--f-body); text-transform: capitalize; }
.app-shell .hd-forecast__now small { color: var(--ink-2); font: 500 calc(var(--u)*1.8)/1.2 var(--f-body); }
.app-shell .hd-forecast__facts { display: flex; flex-wrap: wrap; gap: calc(var(--u)*.8); }
.app-shell .hd-forecast__facts span { padding: calc(var(--u)*.7) calc(var(--u)*1.4); border-radius: var(--hd-pill,99px); background: rgba(255,255,255,.12); font: 600 calc(var(--u)*1.7)/1.2 var(--f-body); }
.app-shell .hd-forecast > .eyebrow { margin-top: calc(var(--u)*.6); }
.app-shell .hd-forecast__hours { display: flex; gap: calc(var(--u)*1); overflow-x: auto; scrollbar-width: none; padding-bottom: calc(var(--u)*.4); }
.app-shell .hd-forecast__hours::-webkit-scrollbar { display: none; }
@media (pointer: fine) { .app-shell .hd-forecast__hours { cursor: grab; user-select: none; } }
.app-shell .hd-forecast__hours > div { flex: none; width: calc(var(--u)*8.5); display: flex; flex-direction: column; align-items: center; gap: calc(var(--u)*.6); padding: calc(var(--u)*1.2) calc(var(--u)*.4); border-radius: calc(var(--u)*2*var(--hd-r,1)); background: rgba(255,255,255,.08); }
.app-shell .hd-forecast__hours small { color: var(--ink-2); font: 600 calc(var(--u)*1.5)/1 var(--f-body); }
.app-shell .hd-forecast__hours b { font: 500 calc(var(--u)*2.2)/1 var(--f-display); }
.app-shell .hd-forecast em { min-height: 1.2em; color: #6cc4ff; font: 600 calc(var(--u)*1.5)/1.2 var(--f-body); font-style: normal; font-variant-numeric: tabular-nums; }
.app-shell .hd-forecast__days { display: flex; flex-direction: column; }
.app-shell .hd-forecast__days > div { display: grid; grid-template-columns: calc(var(--u)*7) calc(var(--u)*3.4) calc(var(--u)*5) calc(var(--u)*4.4) minmax(0, 1fr) calc(var(--u)*4.4); align-items: center; gap: calc(var(--u)*1.2); padding: calc(var(--u)*1) 0; border-top: 1px solid rgba(255,255,255,.08); font: 600 calc(var(--u)*1.9)/1.2 var(--f-body); font-variant-numeric: tabular-nums; }
.app-shell .hd-forecast__days span { text-transform: capitalize; }
.app-shell .hd-forecast__days small { color: var(--ink-2); text-align: right; font: inherit; }
.app-shell .hd-forecast__days i { position: relative; height: calc(var(--u)*.8); border-radius: var(--hd-pill,99px); background: rgba(255,255,255,.14); }
.app-shell .hd-forecast__days i b { position: absolute; top: 0; bottom: 0; border-radius: inherit; background: linear-gradient(90deg, #6cc4ff, #ffc94d, #ff9d4d); }
.app-shell .hd-forecast__source { margin: 0; color: var(--ink-3); font: 500 calc(var(--u)*1.5)/1.3 var(--f-body); }
@media (max-width: 560px) {
  .app-shell .hd-forecast__days > div { grid-template-columns: calc(var(--u)*6) calc(var(--u)*3.2) calc(var(--u)*4.4) calc(var(--u)*4.2) minmax(0, 1fr) calc(var(--u)*4.2); gap: calc(var(--u)*.9); }
}

/* ---------- Cameras: the latest still fills the card; a tap opens the live view ---------- */
.app-shell .camera-tile { padding: 0; border: 0; justify-content: flex-end; background: #0c0a0f; color: #fff; cursor: pointer; text-align: left; font: inherit; }
.app-shell .camera-tile__image, .app-shell .camera-tile__empty { position: absolute; inset: 0; width: 100%; height: 100%; }
.app-shell .camera-tile__image { object-fit: cover; }
/* Live video in the card: the player fills it and never takes the tap (which opens the details). */
.app-shell .camera-tile__player { display: block; overflow: hidden; pointer-events: none; }
.app-shell .camera-tile__player ha-camera-stream { display: block; width: 100%; height: 100%; }
.app-shell .camera-tile__badge--live i { width: 7px; height: 7px; border-radius: 50%; background: #ff4d4d; box-shadow: 0 0 0 3px rgba(255,77,77,.25); animation: hd-live 1.6s ease-in-out infinite; }
@keyframes hd-live { 50% { opacity: .35; } }
.app-shell .camera-tile__empty { display: grid; place-items: center; color: rgba(255,255,255,.35); background: rgba(255,255,255,.06); }
.app-shell .camera-tile__shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.62), rgba(0,0,0,0) 55%); pointer-events: none; }
.app-shell .camera-tile__badge { position: absolute; top: calc(var(--u)*1.4); left: calc(var(--u)*1.4); display: inline-flex; align-items: center; gap: calc(var(--u)*.6); padding: calc(var(--u)*.6) calc(var(--u)*1.2); border-radius: var(--hd-pill,99px); background: rgba(0,0,0,.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); font: 600 calc(var(--u)*1.4)/1 var(--f-body); letter-spacing: .02em; }
/* A double-size camera keeps the photo layout: the grid of other double cards would put the name at the top, under the badge. */
.app-shell .camera-tile.device-tile--wide { display: flex; flex-direction: column; justify-content: flex-end; }
.app-shell .camera-tile__name { position: relative; padding: calc(var(--u)*2); font: 600 calc(var(--u)*2)/1.2 var(--f-body); text-shadow: 0 1px 8px rgba(0,0,0,.5); }
.app-shell .hd-detail--camera { width: min(960px, calc(100vw - var(--u)*6)); }
.app-shell .hd-camera { overflow: hidden; border-radius: calc(var(--u)*2.4*var(--hd-r,1)); background: #000; aspect-ratio: 16 / 9; display: grid; place-items: center; }
.app-shell .hd-camera img { width: 100%; height: 100%; object-fit: contain; }
.app-shell .hd-camera p { color: var(--ink-2); }

/* ---------- Vacuums: the robot drives around its icon while it cleans ---------- */
.app-shell .device-tile--cleaning .device-tile__icon { position: relative; overflow: visible; }
.app-shell .device-tile--cleaning .device-tile__icon svg { animation: hd-vacuum-drive 3.6s ease-in-out infinite; }
.app-shell .device-tile--cleaning .device-tile__icon::after { content: ""; position: absolute; inset: calc(var(--u)*-.6); border-radius: 50%; border: 2px solid var(--on); opacity: 0; animation: hd-vacuum-sweep 2.4s ease-out infinite; }
@keyframes hd-vacuum-drive {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(3px, -2px) rotate(35deg); }
  50% { transform: translate(0, 2px) rotate(110deg); }
  75% { transform: translate(-3px, -1px) rotate(200deg); }
}
@keyframes hd-vacuum-sweep { 0% { opacity: .7; transform: scale(.85); } 100% { opacity: 0; transform: scale(1.35); } }
@media (prefers-reduced-motion: reduce) { .app-shell .device-tile--cleaning .device-tile__icon svg, .app-shell .device-tile--cleaning .device-tile__icon::after { animation: none; } }

/* ---------- Selects: the current option in the card; every option in the details ---------- */
.app-shell .device-tile .device-select { position: relative; z-index: 2; min-height: calc(var(--u)*4.4); border-radius: var(--hd-pill,99px); font-size: calc(var(--u)*1.7); }
.app-shell .device-tile--active .device-select { border-color: rgba(43,36,24,.16); background: rgba(43,36,24,.08); color: var(--paper-ink); }
.app-shell .hd-options { display: flex; flex-wrap: wrap; gap: calc(var(--u)*.8); }
/* Volume − and +, on double cards and in the details. */
.app-shell .hd-volume { display: flex; align-items: center; justify-content: center; gap: calc(var(--u)*1.2); }
.app-shell .hd-volume button { width: calc(var(--u)*4.4); height: calc(var(--u)*4.4); flex: none; display: grid; place-items: center; padding: 0; border: 0; border-radius: var(--hd-round,50%); background: color-mix(in srgb, currentColor 12%, transparent); color: inherit; cursor: pointer; }
.app-shell .hd-volume button:active { transform: scale(.94); }
.app-shell .hd-volume--large button { width: calc(var(--u)*5.6); height: calc(var(--u)*5.6); }

/* Media: the artwork of what is playing, and the player's sources (Sonos favorites, Apple TV apps). */
.app-shell :is(.device-tile__icon--art, .widget-card__icon--art) { background: center / cover no-repeat; border-radius: calc(var(--u)*1.2*var(--hd-r,1)); box-shadow: 0 calc(var(--u)*.4) calc(var(--u)*1.2) rgba(0,0,0,.25); }
.app-shell .hd-detail__art { width: min(60%, calc(var(--u)*26)); aspect-ratio: 1; margin: 0 auto; border-radius: calc(var(--u)*2.4*var(--hd-r,1)); background: center / cover no-repeat; box-shadow: 0 calc(var(--u)*1.6) calc(var(--u)*4) rgba(0,0,0,.4); }
.app-shell .hd-detail__sources { display: grid; gap: calc(var(--u)*1); max-height: calc(var(--u)*30); overflow-y: auto; }
.app-shell .hd-options button { flex: 1 1 calc(50% - var(--u)*.8); min-height: calc(var(--u)*5.2); padding: 0 calc(var(--u)*1.6); border: 1px solid rgba(255,255,255,.14); border-radius: calc(var(--u)*1.8*var(--hd-r,1)); background: rgba(255,255,255,.08); color: var(--ink); font: 600 calc(var(--u)*1.8)/1.2 var(--f-body); cursor: pointer; }
.app-shell .hd-options button[aria-pressed="true"] { border-color: transparent; background: var(--on); color: var(--on-ink, #2a2110); }
.app-shell .tile-buttons--options { flex-wrap: wrap; }
/* How long ago a sensor changed, under its value on 1x and ½x cards (Settings → Cards). */
.app-shell .device-tile__since { display: block; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 500 calc(var(--u)*1.4)/1.2 var(--f-body); opacity: .62; }
/* Vacuum: the three buttons stacked in the controls column, each with its whole label, so they fit in any language. */
.app-shell .tile-buttons--vacuum { flex-direction: column; align-items: stretch; width: 100%; gap: calc(var(--u)*.6); }
.app-shell .tile-buttons--vacuum button { flex: none; width: 100%; min-width: 0; height: calc(var(--u)*3.9); padding: 0 calc(var(--u)*1); gap: calc(var(--u)*.6); }
.app-shell .tile-buttons--vacuum svg { flex: none; }
.app-shell .tile-buttons__label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .tile-buttons--options button { flex: 1 1 calc(33% - var(--u)*.8); }
.app-shell .tile-buttons--options button[aria-pressed="true"] { background: var(--on); color: var(--on-ink, #2a2110); }

/* 0.15: room options in Edit mode, nicknames, alarm panels and plants. */
.app-shell .room-options { display: grid; gap: calc(var(--u)*1.4); margin: 0 0 calc(var(--u)*2); padding: calc(var(--u)*1.6); border: 1px dashed rgba(255,255,255,.22); border-radius: calc(var(--u)*2.2*var(--hd-r,1)); background: rgba(255,255,255,.05); }
.app-shell .room-options__row { display: grid; gap: calc(var(--u)*.8); min-width: 0; }
.app-shell .room-options__icons { display: flex; flex-wrap: wrap; gap: calc(var(--u)*.7); max-height: calc(var(--u)*17); overflow-y: auto; scrollbar-width: none; padding-bottom: 2px; }
.app-shell .room-options__icons::-webkit-scrollbar { display: none; }
.app-shell .room-options__icons button { flex: none; display: inline-flex; align-items: center; justify-content: center; gap: calc(var(--u)*.7); min-width: calc(var(--u)*4.6); height: calc(var(--u)*4.6); padding: 0 calc(var(--u)*1.1); border: 1px solid rgba(255,255,255,.14); border-radius: calc(var(--u)*1.6*var(--hd-r,1)); background: rgba(255,255,255,.07); color: var(--ink); font: 600 calc(var(--u)*1.6)/1 var(--f-body); cursor: pointer; }
.app-shell .room-options__icons button[aria-checked="true"] { border-color: transparent; background: var(--on); color: var(--on-ink, #2a2110); }
.app-shell .room-options__select { max-width: calc(var(--u)*44); }
.app-shell .hd-ha-icon { color: inherit; }
.app-shell .hd-detail__name { display: flex; align-items: center; gap: calc(var(--u)*.8); }
.app-shell .hd-detail__source { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px calc(var(--u)*1); margin: calc(var(--u)*.4) 0 0; color: var(--ink-2, rgba(255,255,255,.7)); font: 500 calc(var(--u)*1.5)/1.35 var(--f-body); }
.app-shell .hd-detail__source b { font-weight: 600; color: var(--ink, #fff); }
.app-shell .hd-detail__source code { font: 500 calc(var(--u)*1.35)/1.35 ui-monospace, SFMono-Regular, Menlo, monospace; opacity: .7; overflow-wrap: anywhere; }
/* A long name wraps to two lines and the pencil stays beside it. */
.app-shell .hd-detail__header h2.hd-detail__name { overflow: visible; white-space: normal; }
.app-shell .hd-detail__name > span { min-width: 0; overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow-wrap: anywhere; }
.app-shell .hd-detail__rename { flex: none; display: inline-grid; place-items: center; width: calc(var(--u)*3.4); height: calc(var(--u)*3.4); border: 0; border-radius: 50%; background: rgba(255,255,255,.1); color: var(--ink-2); cursor: pointer; }
.app-shell .hd-detail__naming { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: calc(var(--u)*.8); align-items: center; margin-top: calc(var(--u)*.3); }
.app-shell .hd-detail__naming input:not(.st-switch) { min-width: 0; height: calc(var(--u)*4.6); padding: 0 calc(var(--u)*1.4); border: 1px solid rgba(255,255,255,.22); border-radius: calc(var(--u)*1.4*var(--hd-r,1)); background: rgba(0,0,0,.18); color: var(--ink); font: 500 calc(var(--u)*2.2)/1 var(--f-body); }
.app-shell .hd-detail__naming button { width: calc(var(--u)*4.6); height: calc(var(--u)*4.6); border: 0; border-radius: calc(var(--u)*1.4*var(--hd-r,1)); background: var(--on); color: var(--on-ink, #2a2110); cursor: pointer; display: grid; place-items: center; }
.app-shell .hd-detail__only-here { grid-column: 1 / -1; display: flex; align-items: center; gap: calc(var(--u)*1); color: var(--ink); font: 600 calc(var(--u)*1.6)/1.3 var(--f-body); cursor: pointer; }
.app-shell .hd-detail__naming small { grid-column: 1 / -1; color: var(--ink-2); font: 500 calc(var(--u)*1.5)/1.3 var(--f-body); }
.app-shell .hd-alarm { display: grid; gap: calc(var(--u)*1.2); }
.app-shell .hd-alarm__code { height: calc(var(--u)*5.6); padding: 0 calc(var(--u)*1.6); border: 1px solid rgba(255,255,255,.22); border-radius: calc(var(--u)*1.8*var(--hd-r,1)); background: rgba(0,0,0,.18); color: var(--ink); font: 600 calc(var(--u)*2.4)/1 var(--f-body); letter-spacing: .3em; text-align: center; }
.app-shell .hd-alarm .hd-detail__primary { margin: 0; }
.app-shell .device-tile--alert { border-color: rgba(255,107,94,.5); background: rgba(255,107,94,.2); }
.app-shell .device-tile--alert .device-tile__icon { background: var(--bad); color: #fff; }
.app-shell .hd-plant { display: grid; gap: calc(var(--u)*1.2); }
.app-shell .hd-plant__head { display: flex; align-items: center; gap: calc(var(--u)*1.2); color: var(--ink-2); font: italic 500 calc(var(--u)*1.8)/1.3 var(--f-body); }
.app-shell .hd-plant__head img { width: calc(var(--u)*7); height: calc(var(--u)*7); border-radius: calc(var(--u)*1.6*var(--hd-r,1)); object-fit: cover; }
.app-shell .hd-plant__readings { display: grid; gap: calc(var(--u)*.7); margin: 0; padding: 0; list-style: none; }
.app-shell .hd-plant__readings li { display: flex; align-items: center; gap: calc(var(--u)*1); min-height: calc(var(--u)*5); padding: 0 calc(var(--u)*1.6); border-radius: calc(var(--u)*1.6*var(--hd-r,1)); background: rgba(255,255,255,.07); font: 500 calc(var(--u)*1.8)/1.2 var(--f-body); }
.app-shell .hd-plant__readings li span { flex: 1; color: var(--ink-2); }
.app-shell .hd-plant__readings li i { font-style: normal; font-weight: 700; color: #ffb3b5; }
.app-shell .hd-plant__readings .hd-plant__reading--problem { background: rgba(255,107,94,.18); }

.app-shell .st-icon-button--small { width: calc(var(--u)*4); height: calc(var(--u)*4); background: rgba(255,255,255,.08); color: var(--ink-2); }
.app-shell .st-input--framed { height: calc(var(--u)*4.2); border-color: rgba(255,255,255,.3); background: rgba(0,0,0,.16); }
.app-shell .st-item__was { flex: none; max-width: 40%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink-3); font: 500 calc(var(--u)*1.5)/1 var(--f-body); }

/* 0.16: history, large cards, camera full screen, weather, sun and energy cards, animations. */
.app-shell .hd-item--tall { grid-row: span 2; }
.app-shell .hd-item--tall > :first-child { height: 100%; }
.app-shell .empty-state p { color: #fff; }
.app-shell .hd-alarm__open { display: grid; gap: calc(var(--u)*.5); padding: calc(var(--u)*1.2) calc(var(--u)*1.4); border-radius: calc(var(--u)*1.6*var(--hd-r,1)); background: rgba(255,122,107,.14); color: #ffd9d4; font-size: calc(var(--u)*1.7); }
.app-shell .hd-alarm__open button { justify-self: start; height: calc(var(--u)*4); min-height: 32px; margin-top: calc(var(--u)*.4); padding: 0 calc(var(--u)*1.6); border: 0; border-radius: var(--hd-pill,99px); background: #fff; color: #1d1a17; font: 600 calc(var(--u)*1.6)/1 var(--f-body); cursor: pointer; }
.app-shell .hd-audience { display: flex; flex-wrap: wrap; gap: calc(var(--u)*.7); }
.app-shell .hd-audience button { display: inline-flex; align-items: center; gap: calc(var(--u)*.5); height: calc(var(--u)*4); min-height: 32px; padding: 0 calc(var(--u)*1.5); border: 1px solid rgba(255,255,255,.16); border-radius: var(--hd-pill,99px); background: transparent; color: rgba(255,255,255,.65); font: 600 calc(var(--u)*1.6)/1 var(--f-body); cursor: pointer; }
.app-shell .hd-audience button[aria-pressed="true"] { border-color: transparent; background: var(--on); color: var(--on-ink, #2a2110); }
.app-shell .hd-grid--editing .hd-item--restricted > :first-child { opacity: .42; }
.app-shell .hd-grid--editing .hd-item--restricted::after { content: ""; position: absolute; left: 50%; top: 50%; width: calc(var(--u)*4); height: 3px; border-radius: 3px; background: var(--bad, #ff7a6b); transform: translate(-50%, -50%) rotate(-35deg); pointer-events: none; }
.app-shell .bins-card { padding: calc(var(--u)*1.6); }
.app-shell .bins-card__row { flex: 1; min-height: 0; height: 100%; display: flex; align-items: stretch; justify-content: space-around; gap: calc(var(--u)*1); }
.app-shell .bins-card__bin { flex: 1 1 0; min-width: 0; min-height: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: calc(var(--u)*.5); padding: 0; border: 0; background: none; color: inherit; cursor: pointer; }
.app-shell .bins-card__bin b { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 700 calc(var(--u)*1.45)/1.1 var(--f-body); letter-spacing: .04em; text-transform: uppercase; color: var(--ink-2, rgba(255,255,255,.75)); }
.app-shell .bins-card__bin--next b { color: var(--on, #ffc94d); }
.app-shell .bins-card__art { flex: 1 1 0; min-height: 0; width: 100%; max-height: calc(var(--u)*11); }
.app-shell .hd-item--tall .bins-card__art { max-height: calc(var(--u)*22); }
.app-shell .bins-card__bin small { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 500 calc(var(--u)*1.45)/1.1 var(--f-body); color: var(--ink-2, rgba(255,255,255,.75)); }
.app-shell .st-bin { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1.4fr) minmax(0, 1fr) auto; align-items: center; gap: calc(var(--u)*.8); padding: calc(var(--u)*.6) 0; }
@media (max-width: 720px) { .app-shell .st-bin { grid-template-columns: minmax(0, 1fr) auto; } }
.app-shell .hd-links { display: grid; gap: calc(var(--u)*.7); min-width: 0; margin-top: calc(var(--u)*.8); }
.app-shell .hd-link { display: flex; align-items: center; justify-content: space-between; gap: calc(var(--u)*.8); min-width: 0; min-height: calc(var(--u)*3.8); }
.app-shell .hd-link__name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 600 calc(var(--u)*1.6)/1.15 var(--f-body); }
.app-shell .hd-link__value { flex: none; font: 600 calc(var(--u)*1.6)/1 var(--f-body); opacity: .75; }
.app-shell .hd-link__buttons { flex: none; display: inline-flex; gap: calc(var(--u)*.5); }
.app-shell .hd-link__buttons button { width: calc(var(--u)*3.8); height: calc(var(--u)*3.8); min-width: 30px; min-height: 30px; padding: 0; display: grid; place-items: center; border: 0; border-radius: var(--hd-round,50%); background: color-mix(in srgb, currentColor 14%, transparent); color: inherit; cursor: pointer; }
.app-shell .hd-link--select .device-select { flex: 0 1 62%; min-width: 0; }
.app-shell .hd-link__run { display: flex; align-items: center; justify-content: center; gap: calc(var(--u)*.7); width: 100%; height: calc(var(--u)*4.4); min-height: 34px; padding: 0 calc(var(--u)*1.2); border: 0; border-radius: var(--hd-pill,99px); background: #fff; color: #1d1a17; font: 600 calc(var(--u)*1.65)/1 var(--f-body); cursor: pointer; }
.app-shell .device-tile--active .hd-link__run { background: var(--lc, var(--on)); color: var(--on-ink, #2a2110); }
.app-shell .hd-link__run span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .hd-link button:disabled, .app-shell .hd-link__run:disabled { opacity: .4; cursor: default; }
/* Cards with extra devices split half and half: the card's own content left, the devices right. */
.app-shell .room-card__links { position: absolute; z-index: 2; left: calc(50% + var(--u)*1.2); right: calc(var(--u)*2.4); bottom: calc(var(--u)*2); }
.app-shell .room-card__links .hd-links { margin: 0; }
.app-shell .room-card:has(.hd-links) .room-card__content { max-width: calc(50% - var(--u)*3.6); }
/* The footer (light dots and temperature) stays in the left half too, so the devices never cover the temperature. */
.app-shell .room-card:has(.hd-links) .room-card__footer { max-width: calc(50% - var(--u)*3.6); }
/* Short cards (phones, sidebar layout) grow just enough for two devices below the power button. */
.app-shell .room-card:has(.hd-links) { min-height: max(calc(var(--u)*11.4 + 48px), 100%); }
/* Inside a room card the devices are a little more compact, so two of them fit under the power button in a normal row. */
.app-shell .room-card__links { bottom: calc(var(--u)*1.4); }
.app-shell .room-card__links .hd-links { gap: calc(var(--u)*.4); }
.app-shell .room-card__links .hd-link { min-height: calc(var(--u)*3.4); }
.app-shell .room-card__links .hd-link__buttons button { width: calc(var(--u)*3.4); height: calc(var(--u)*3.4); min-width: 26px; min-height: 26px; }
/* On short screens the Home rows grow just enough for such a card, instead of the card spilling over the next row. */
@media (min-width: 721px) { .app-shell .home-grid:not(.hd-grid--halves):has(.room-card .hd-links) { grid-auto-rows: minmax(max(calc(var(--u)*19), calc(var(--u)*11.4 + 48px)), 1fr); } }
/* A large (4x) room card has the height to spare: the devices take the full width, above the name. */
.app-shell .hd-item--tall .room-card .room-card__links { position: relative; left: auto; right: auto; bottom: auto; margin-top: auto; }
.app-shell .hd-item--tall .room-card:has(.hd-links) .room-card__content { margin-top: calc(var(--u)*1.6); max-width: none; }
.app-shell .hd-item--tall .room-card:has(.hd-links) .room-card__footer { max-width: none; }
.app-shell .device-tile--wide:has(.hd-links) { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.app-shell .room-card:has(.hd-links) .room-card__content strong { white-space: normal; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.app-shell .hd-link .ls-switch { flex: none; background: color-mix(in srgb, currentColor 20%, transparent); }
.app-shell .hd-link .ls-switch--on { background: var(--on, #ffc94d); }
.app-shell .room-card--active .hd-link .ls-switch i, .app-shell .device-tile--active .hd-link .ls-switch i { background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); }
.app-shell .hd-links-editor small { opacity: .65; font-size: calc(var(--u)*1.5); }
.app-shell .hd-links-editor__item { display: flex; align-items: center; justify-content: space-between; gap: calc(var(--u)*1); padding: calc(var(--u)*.6) calc(var(--u)*.6) calc(var(--u)*.6) calc(var(--u)*1.2); border-radius: var(--hd-pill,99px); background: rgba(255,255,255,.08); }
.app-shell .hd-links-editor__item button { width: calc(var(--u)*3.2); height: calc(var(--u)*3.2); min-width: 26px; min-height: 26px; padding: 0; display: grid; place-items: center; border: 0; border-radius: 50%; background: #d9534f; color: #fff; cursor: pointer; }
.app-shell .hd-links-editor > .hd-pill { justify-self: start; }
.app-shell .hd-links-editor__item input { flex: 1; min-width: 0; height: calc(var(--u)*3.8); min-height: 32px; padding: 0 calc(var(--u)*1); border: 1px solid transparent; border-radius: calc(var(--u)*1*var(--hd-r,1)); background: transparent; color: inherit; font: 600 calc(var(--u)*1.7)/1 var(--f-body); }
.app-shell .hd-links-editor__item input:focus { outline: none; border-color: rgba(255,255,255,.35); background: rgba(0,0,0,.18); }
.app-shell .hd-links-editor__item input::placeholder { color: inherit; opacity: .85; }
.app-shell .hd-detail .hd-swatches { flex-wrap: nowrap; justify-content: space-between; gap: calc(var(--u)*.5); }
.app-shell .hd-detail .hd-swatches button { flex: 0 1 calc(var(--u)*4.2); width: auto; height: auto; aspect-ratio: 1; min-width: 0; padding: 0; }
.app-shell .hd-swatches button.hd-swatches__other { border: 0; background: conic-gradient(#f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00); box-shadow: inset 0 0 0 2px rgba(255,255,255,.28); }
.app-shell .hd-temps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: calc(var(--u)*.8); }
.app-shell .hd-temps button { display: inline-flex; align-items: center; justify-content: center; gap: calc(var(--u)*.8); height: calc(var(--u)*5); min-height: 38px; padding: 0 calc(var(--u)*.8); border: 1px solid rgba(255,255,255,.14); border-radius: var(--hd-pill,99px); background: rgba(255,255,255,.08); color: var(--ink,#fff); font: 600 calc(var(--u)*1.7)/1 var(--f-body); cursor: pointer; }
.app-shell .hd-temps button i { flex: none; width: calc(var(--u)*1.8); height: calc(var(--u)*1.8); border-radius: 50%; background: var(--t); }
.app-shell .hd-temps button[aria-pressed="true"] { border-color: transparent; background: #fff; color: #1d1a17; }
.app-shell .hd-wheel { position: relative; width: min(calc(var(--u)*30), 100%); aspect-ratio: 1; margin: calc(var(--u)*.6) auto; border-radius: 50%; background: radial-gradient(closest-side, #fff, rgba(255,255,255,0)), conic-gradient(#f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00); box-shadow: 0 0 0 1px rgba(255,255,255,.18), 0 calc(var(--u)*1) calc(var(--u)*3) rgba(0,0,0,.35); cursor: crosshair; touch-action: none; }
.app-shell .hd-wheel:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.app-shell .hd-wheel i { position: absolute; width: calc(var(--u)*3.4); height: calc(var(--u)*3.4); min-width: 24px; min-height: 24px; border: 3px solid #fff; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 2px 8px rgba(0,0,0,.45); pointer-events: none; }
.app-shell .st-page-row { display: grid; gap: calc(var(--u)*.8); min-width: 0; }
.app-shell .hd-pill--danger { background: var(--bad, #ff7a6b); border-color: transparent; color: #fff; }
/* Small sensor cards: a grid holding one switches to half-height rows, every other card spans two. */
.app-shell .hd-grid--halves { grid-auto-flow: row dense; }
.app-shell .hd-grid--halves > :is(.hd-item, .hd-add-tile) { grid-row: span 2; }
.app-shell .hd-grid--halves > .hd-item--tall { grid-row: span 4; }
.app-shell .hd-grid--halves > .hd-item--small { grid-row: span 1; }
.app-shell .home-grid.hd-grid--halves { grid-auto-rows: minmax(calc(var(--u)*8.6), 1fr); }
.app-shell :is(.room-pane .device-grid, .collection-grid).hd-grid--halves { grid-auto-rows: minmax(calc(var(--u)*7.35), auto); }
.app-shell .sb-grid.hd-grid--halves { grid-auto-rows: minmax(calc(var(--u)*7.6), auto); }
@media (max-width: 720px) { .app-shell .home-grid.hd-grid--halves { grid-auto-rows: minmax(calc(var(--u)*10.1), auto); } }
/* Phones (two columns): a half-height sensor takes the whole row, so its name and value are read in full. */
@media (max-width: 720px) { .app-shell .hd-grid--halves > .hd-item--small { grid-column: 1 / -1; } }
.app-shell .hd-item--small > .device-tile { height: 100%; min-height: 0; flex-direction: row; align-items: center; gap: calc(var(--u)*1.4); padding: calc(var(--u)*1.2) calc(var(--u)*1.6); }
.app-shell .hd-item--small > .device-tile > .device-tile__top { min-height: 0; flex: none; }
.app-shell .hd-item--small > .device-tile .device-tile__icon { width: calc(var(--u)*4.4); height: calc(var(--u)*4.4); }
.app-shell .hd-item--small > .device-tile > .device-tile__copy { flex: 1; min-width: 0; margin: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 2px; text-align: left; }
.app-shell .hd-item--small > .device-tile .device-tile__copy :is(strong, span) { -webkit-line-clamp: 1; }
.app-shell .hd-item--small > .device-tile .device-tile__guard { display: none; }
.app-shell .hd-history { display: grid; gap: calc(var(--u)*1); color: var(--on); }
.app-shell .hd-history__head { display: flex; align-items: center; justify-content: space-between; gap: calc(var(--u)*1); color: var(--ink); }
.app-shell .hd-history__ranges { display: flex; gap: calc(var(--u)*.5); }
.app-shell .hd-history__ranges button { min-height: calc(var(--u)*3.6); padding: 0 calc(var(--u)*1.2); border: 1px solid rgba(255,255,255,.14); border-radius: 99px; background: rgba(255,255,255,.06); color: var(--ink-2); font: 600 calc(var(--u)*1.5)/1 var(--f-body); cursor: pointer; }
.app-shell .hd-history__ranges button[aria-pressed="true"] { background: var(--on); border-color: transparent; color: var(--on-ink, #2a2110); }
.app-shell .hd-history__empty { display: grid; place-items: center; min-height: calc(var(--u)*12); margin: 0; color: var(--ink-2); font: 500 calc(var(--u)*1.7)/1.3 var(--f-body); text-align: center; }
.app-shell .hd-spark { margin: 0; display: grid; gap: calc(var(--u)*.6); }
.app-shell .hd-spark svg { width: 100%; height: calc(var(--u)*14); display: block; touch-action: none; overflow: visible; }
.app-shell .hd-spark--compact svg { height: 100%; min-height: calc(var(--u)*6); }
.app-shell .hd-spark figcaption { display: flex; justify-content: center; color: var(--ink-2); font: 500 calc(var(--u)*1.6)/1.2 var(--f-body); }
.app-shell .hd-spark figcaption span { display: flex; gap: calc(var(--u)*2); }
.app-shell .hd-spark figcaption i { font-style: normal; }
.app-shell .hd-spark__hover b { color: var(--ink); }
.app-shell .hd-camera { position: relative; }
.app-shell .hd-camera__full { position: absolute; right: calc(var(--u)*1); bottom: calc(var(--u)*1); width: calc(var(--u)*4.4); height: calc(var(--u)*4.4); display: grid; place-items: center; border: 0; border-radius: 50%; background: rgba(0,0,0,.55); color: #fff; cursor: pointer; backdrop-filter: blur(6px); }
.app-shell .hd-camera:fullscreen, .app-shell .hd-camera--full { position: fixed; inset: 0; z-index: 400; width: 100vw; height: 100vh; height: 100dvh; aspect-ratio: auto; display: grid; place-items: center; margin: 0; border-radius: 0; background: #000; }
.app-shell .hd-camera:fullscreen img, .app-shell .hd-camera--full img { width: 100%; height: 100%; max-height: none; object-fit: contain; border-radius: 0; }
.app-shell .hd-camera__player { display: block; width: 100%; height: 100%; }
.app-shell .hd-camera:fullscreen .hd-camera__player, .app-shell .hd-camera--full .hd-camera__player { width: 100%; height: 100%; }
.app-shell .widget-card--wide > .widget-hours, .app-shell .widget-card--wide > .sun-arc { grid-area: 1 / 2 / 4 / 3; align-self: center; min-width: 0; }
.app-shell .widget-hours { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: calc(var(--u)*.6); text-align: center; }
.app-shell .widget-hours span { display: grid; justify-items: center; gap: calc(var(--u)*.5); }
.app-shell .widget-hours small { color: var(--ink-2); font: 500 calc(var(--u)*1.4)/1 var(--f-body); }
.app-shell .widget-hours b { font: 600 calc(var(--u)*1.8)/1 var(--f-body); }
.app-shell .sun-arc { width: 100%; height: auto; overflow: visible; color: inherit; }
.app-shell .widget-card--wide.widget-card--energy { grid-template-rows: auto 1fr auto auto; }
.app-shell .widget-card__chart { grid-column: 1 / -1; min-height: calc(var(--u)*7); color: var(--on); margin-top: calc(var(--u)*1); }
.app-shell .hd-item--tall .widget-card__chart { flex: 1; }
/* Sensor charts (optional): double cards draw a thin line on the right half, large cards fill the middle. */
.app-shell .device-tile__spark { position: absolute; right: calc(var(--u)*1.6); bottom: calc(var(--u)*1.6); width: 46%; height: calc(var(--u)*4.4); color: var(--on); opacity: .85; pointer-events: none; }
.app-shell .device-tile__spark .hd-spark, .app-shell .device-tile__spark svg { height: 100%; min-height: 0; }
.app-shell .device-tile__spark--tall { left: calc(var(--u)*1.6); width: auto; top: 38%; bottom: 34%; height: auto; }
.app-shell .device-tile:has(.device-tile__spark) .tile-wide__since { position: absolute; top: calc(var(--u)*2.2); right: calc(var(--u)*2.2); margin: 0; }
@keyframes hd-spin { to { transform: rotate(360deg); } }
@keyframes hd-glow { 0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--lc, var(--on)) 0%, transparent); } 50% { box-shadow: 0 0 calc(var(--u)*2.4) calc(var(--u)*.4) color-mix(in srgb, var(--lc, var(--on)) 55%, transparent); } }
@keyframes hd-shake { 0%, 100% { transform: translate(0, 0) rotate(0); } 20% { transform: translate(-1px, 1px) rotate(-3deg); } 40% { transform: translate(1px, -1px) rotate(3deg); } 60% { transform: translate(-1px, 0) rotate(-2deg); } 80% { transform: translate(1px, 1px) rotate(2deg); } }
.app-shell.hd-anim [data-domain="fan"].device-tile--active .device-tile__icon svg { animation: hd-spin 1.6s linear infinite; }
.app-shell.hd-anim [data-domain="light"].device-tile--active .device-tile__icon { animation: hd-glow 3.2s ease-in-out infinite; }
.app-shell.hd-anim [data-running="appliance"] .device-tile__icon svg { animation: hd-shake .45s linear infinite; }
@media (prefers-reduced-motion: reduce) { .app-shell.hd-anim [data-domain] .device-tile__icon, .app-shell.hd-anim [data-domain] .device-tile__icon svg { animation: none !important; } }

/* No scroll bars inside the panel: scrolling works as before. */
.app-shell, .app-shell * { scrollbar-width: none; }
.app-shell ::-webkit-scrollbar, .app-shell::-webkit-scrollbar { display: none; }

/* Screensaver agenda, as on the home dashboard: today's events and reminders under the clock. */
.app-shell .hd-saver__clock { transition: transform .4s ease; }
.app-shell .hd-saver:has(.hd-saver__agenda) .hd-saver__clock { transform: translateY(-9vh); }
.app-shell .hd-saver:has(.hd-saver__agenda--many) .hd-saver__clock { transform: translateY(-15vh); }
.app-shell .hd-saver:has(.hd-saver__agenda) .hd-saver__time { font-size: min(26vw, 34vh, 240px); }
.app-shell .hd-saver__agenda { position: absolute; left: 50%; bottom: calc(80px + env(safe-area-inset-bottom, 0px)); transform: translateX(-50%); width: min(560px, calc(100vw - 48px)); max-height: 40vh; overflow: hidden; display: flex; flex-direction: column; gap: 14px; padding: 14px 16px; border-radius: 22px; background: rgba(0,0,0,.22); box-shadow: inset 0 0 0 1px rgba(255,255,255,.1); text-align: left; cursor: default; }
.app-shell .hd-saver__agenda section { display: flex; flex-direction: column; gap: 6px; }
.app-shell .hd-saver__head { display: flex; align-items: center; gap: 8px; padding-bottom: 4px; font: 700 12px/1 var(--f-body); letter-spacing: .14em; text-transform: uppercase; opacity: .65; }
.app-shell .hd-saver__row { display: flex; align-items: center; gap: 12px; font: 500 clamp(14px, 2.2vw, 19px)/1.25 var(--f-body); }
.app-shell .hd-saver__row i { flex: none; width: 14px; height: 14px; border-radius: 50%; box-shadow: inset 0 0 0 2px rgba(255,255,255,.8); }
.app-shell .hd-saver__row span { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .hd-saver__row small { flex: none; font-size: .82em; opacity: .65; font-variant-numeric: tabular-nums; }
.app-shell .hd-saver__row--late i { box-shadow: inset 0 0 0 2px #ff8a7e; }
.app-shell .hd-saver__row--late small { color: #ffb0a8; opacity: .95; }
.app-shell .hd-saver__more { padding-left: 26px; font: 500 14px/1.2 var(--f-body); opacity: .55; }
.app-shell .hd-saver:has(.hd-saver__agenda) .hd-saver__hint { bottom: calc(40px + env(safe-area-inset-bottom, 0px)); }

/* Separators inside a list group: inset like the rows. A separator inside an edited list (a room's
   rows on Home) neither jiggles nor blocks its title field, whatever grid it sits in. */
.app-shell .ls-group .hd-sections { gap: 0; }
.app-shell .ls-group .hd-sections > .hd-item--section { margin: 0; padding: calc(var(--u)*1.6) calc(var(--u)*1.8) calc(var(--u)*.8) calc(var(--u)*1.6); }
.app-shell .ls-group .hd-sections > .hd-item--section + .ls-rows, .app-shell .ls-group .hd-sections > .ls-rows + .hd-item--section { border-top: 1px solid rgba(255,255,255,.07); }
.app-shell .hd-grid--editing .hd-item--section, .app-shell .hd-sections--editing .hd-item--section { animation: none; }
.app-shell .hd-grid--editing .hd-item--section > :first-child, .app-shell .hd-sections--editing .hd-item--section > :first-child { pointer-events: auto; }
.app-shell .hd-section__input { user-select: text; -webkit-user-select: text; cursor: text; touch-action: auto; }
.app-shell .ls-group .hd-sections > .hd-item--section .hd-item__badge--remove { left: calc(var(--u)*.6); }
/* Doorbell pop-up (Pro): above everything, the screensaver included. */
.app-shell .st-actions--end { justify-content: flex-end; }
/* Settings menu: with many sections it scrolls on its own on short screens instead of running off the bottom. */
@media (min-width: 721px) { .app-shell .st-nav .room-selector__list { max-height: calc(100dvh - var(--u)*4); overflow-y: auto; scrollbar-width: none; } }
/* An action at the end of a group sits in its own row, with the rows' divider and breathing room. */
/* Rows with a select breathe like the others: the select no longer touches the dividers. */
.app-shell .st-sub__row:has(.hdx-select) { padding: calc(var(--u)*.8) 0; }
.app-shell .st-sub > .st-actions--end { margin: 0; padding: calc(var(--u)*1.2) 0 calc(var(--u)*.8); border-top: 1px solid rgba(255,255,255,.07); }
.app-shell .st-sub > .st-actions--end .hd-pill { min-height: calc(var(--u)*4.4); padding-inline: calc(var(--u)*2); }
.app-shell .hd-doorbell { position: fixed; inset: 0; z-index: 900; display: grid; place-items: center; padding: calc(var(--u)*3); background: rgba(8,6,10,.72); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); animation: hd-doorbell-in .25s ease-out; }
.app-shell .hd-doorbell__panel { width: min(100%, 1100px); display: grid; gap: calc(var(--u)*1.6); padding: calc(var(--u)*2); border-radius: calc(var(--u)*3*var(--hd-r,1)); background: rgba(30,24,34,.92); border: 1px solid rgba(255,255,255,.1); box-shadow: 0 30px 90px rgba(0,0,0,.55); }
.app-shell .hd-doorbell__panel > header { display: flex; align-items: center; gap: calc(var(--u)*1.4); }
.app-shell .hd-doorbell__panel > header > div { flex: 1; min-width: 0; display: grid; gap: 2px; }
.app-shell .hd-doorbell__panel strong { font: 500 calc(var(--u)*2.8)/1.1 var(--f-display); color: var(--ink); }
.app-shell .hd-doorbell__panel small { color: var(--ink-2); font: 500 calc(var(--u)*1.6)/1.2 var(--f-body); }
.app-shell .hd-doorbell__icon { width: calc(var(--u)*5); height: calc(var(--u)*5); flex: none; display: grid; place-items: center; border-radius: 50%; background: var(--on); color: var(--on-ink, #2a2110); animation: hd-doorbell-ring 1.2s ease-in-out 3; }
.app-shell .hd-doorbell__panel > header > button { width: calc(var(--u)*4.6); height: calc(var(--u)*4.6); flex: none; display: grid; place-items: center; border: 0; border-radius: 50%; background: rgba(255,255,255,.1); color: var(--ink); cursor: pointer; }
.app-shell .hd-doorbell .hd-camera { max-height: calc(100dvh - var(--u)*16); }
.app-shell .hd-doorbell__none { margin: 0; padding: calc(var(--u)*4) 0; text-align: center; color: var(--ink-2); }
@keyframes hd-doorbell-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes hd-doorbell-ring { 0%, 100% { transform: rotate(0); } 15% { transform: rotate(14deg); } 30% { transform: rotate(-12deg); } 45% { transform: rotate(8deg); } 60% { transform: rotate(-4deg); } }

/* A protected device: a small lock on its tile, and the second-tap prompt over it. */
.app-shell .device-tile__guard { position: absolute; top: calc(var(--u)*1.6); right: calc(var(--u)*1.6); width: calc(var(--u)*2.8); height: calc(var(--u)*2.8); display: grid; place-items: center; border-radius: 50%; background: rgba(0,0,0,.18); color: inherit; opacity: .8; }
.app-shell .device-tile__confirm { position: absolute; inset: 0; z-index: 3; display: grid; place-items: center; padding: calc(var(--u)*1.4); border-radius: inherit; background: rgba(18,12,16,.8); color: #fff; outline: 2px solid var(--on); outline-offset: -2px; text-align: center; font: 600 calc(var(--u)*1.8)/1.25 var(--f-body); animation: hd-confirm-in .15s ease-out; pointer-events: none; }
@keyframes hd-confirm-in { from { opacity: 0; transform: scale(.97); } to { opacity: 1; transform: none; } }
.app-shell .device-tile__icon .hd-ha-icon { color: inherit; }
/* Device options in the details: a quiet button, then the icon picker and the confirmation switch. */
.app-shell .hd-detail__options-toggle { justify-self: center; display: inline-flex; align-items: center; gap: calc(var(--u)*.7); margin-top: calc(var(--u)*1.4); padding: calc(var(--u)*.8) calc(var(--u)*1.6); border: 0; border-radius: var(--hd-pill,99px); background: rgba(255,255,255,.07); color: var(--ink-2); font: 600 calc(var(--u)*1.5)/1 var(--f-body); cursor: pointer; }
.app-shell .hd-detail__options { margin: calc(var(--u)*1.6) 0 0; }
.app-shell .hd-detail__confirm { display: flex; align-items: center; justify-content: space-between; gap: calc(var(--u)*2); cursor: pointer; }
.app-shell .hd-detail__confirm b { display: block; color: var(--ink); font: 600 calc(var(--u)*1.7)/1.25 var(--f-body); }
.app-shell .hd-detail__confirm small { display: block; margin-top: 2px; color: var(--ink-2); font: 500 calc(var(--u)*1.45)/1.3 var(--f-body); }

/* Special dates: the animation layer behind the cards, the badge by the clock and the saver greeting. */
.app-shell .hd-season-layer { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.app-shell .hd-season-layer canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
.app-shell .hd-season-bunting { position: absolute; top: 0; left: 0; width: 100%; height: calc(var(--u)*3.4); opacity: .85; }
.app-shell .hd-season-badge { display: inline-flex; align-items: center; gap: 4px; margin-left: calc(var(--u)*1.2); padding: calc(var(--u)*.55) calc(var(--u)*1.5); line-height: 1.2; border-radius: var(--hd-pill,99px); background: rgba(255,255,255,.12); color: var(--ink); font-weight: 600; letter-spacing: 0; text-transform: none; white-space: nowrap; }
.app-shell .hd-season-badge--day { background: var(--on); color: var(--on-ink, #2a2110); }
.app-shell .hd-saver__season { margin-top: calc(var(--u)*2); color: #fff; font: 500 calc(var(--u)*3.2)/1.2 var(--f-display); text-align: center; }
.app-shell .st-season-actions { display: inline-flex; align-items: center; gap: calc(var(--u)*1); flex: none; }
.app-shell .st-season-see { padding-block: calc(var(--u)*.6); font-size: calc(var(--u)*1.45); }
.app-shell .hd-season-preview { position: fixed; inset: 0; z-index: 700; pointer-events: none; }
.app-shell .hd-season-preview .hd-season-layer { z-index: 0; }
.app-shell .hd-season-preview__chip { position: absolute; left: 50%; bottom: calc(var(--u)*4); transform: translateX(-50%); display: inline-flex; align-items: center; gap: calc(var(--u)*1.2); padding: calc(var(--u)*.8) calc(var(--u)*.8) calc(var(--u)*.8) calc(var(--u)*.8); border: 0; border-radius: var(--hd-pill,99px); background: rgba(20,14,20,.85); color: #fff; font: 600 calc(var(--u)*1.6)/1 var(--f-body); pointer-events: auto; cursor: pointer; backdrop-filter: blur(10px); }
.app-shell .hd-season-preview__chip > span:last-child { padding-right: calc(var(--u)*1); opacity: .8; }
.app-shell .st-season-add { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) auto; gap: calc(var(--u)*.8); align-items: center; padding: calc(var(--u)*1) 0; border-top: 1px solid rgba(255,255,255,.07); }
.app-shell .st-season-add input { min-width: 0; height: calc(var(--u)*4.4); padding: 0 calc(var(--u)*1.2); border: 1px solid rgba(255,255,255,.2); border-radius: calc(var(--u)*1.4*var(--hd-r,1)); background: rgba(0,0,0,.18); color: var(--ink); font: 500 calc(var(--u)*1.6)/1 var(--f-body); color-scheme: dark; }
@media (max-width: 720px) { .app-shell .st-season-add { grid-template-columns: 1fr 1fr; } }

/* Special-date decorations on the cards and in the empty spaces (above the cards, under the dock, never tappable). */
.app-shell .hd-decor { position: fixed; inset: 0; z-index: 8; pointer-events: none; overflow: hidden; }
.app-shell .hd-decor__at { position: absolute; }
.app-shell .hd-decor__row { display: flex; gap: 3px; align-items: flex-end; }
.app-shell .hd-decor__webclip { width: 64px; height: 64px; overflow: hidden; }
.app-shell .hd-decor__lights { position: absolute; top: 0; left: 0; width: 100%; height: calc(var(--u)*4.2); }
.app-shell .hd-decor__bulb { animation: hd-bulb 2s ease-in-out infinite; }
@keyframes hd-bulb { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
.app-shell .hd-decor__ghost { position: absolute; top: 55%; left: 0; opacity: .85; animation: hd-ghost 60s linear infinite; animation-delay: 4s; transform: translateX(-80px); }
.app-shell .hd-decor__ghost--now { animation: hd-ghost-now 8s linear 1; }
@keyframes hd-ghost { 0% { transform: translate(-80px, 0); } 8% { transform: translate(30vw, -30px); } 16% { transform: translate(60vw, 20px); } 24% { transform: translate(calc(100vw + 20px), -20px); } 100% { transform: translate(calc(100vw + 20px), -20px); } }
@keyframes hd-ghost-now { 0% { transform: translate(-80px, 0); } 33% { transform: translate(30vw, -30px); } 66% { transform: translate(60vw, 20px); } 100% { transform: translate(calc(100vw + 20px), -20px); } }
.app-shell .hd-decor__ghost-body { animation: hd-ghost-wobble 1.6s ease-in-out infinite alternate; }
@keyframes hd-ghost-wobble { from { transform: rotate(-6deg); } to { transform: rotate(6deg); } }
.app-shell .hd-decor__dangle { transform-origin: top center; animation: hd-dangle 3.2s ease-in-out infinite alternate; }
@keyframes hd-dangle { from { transform: translateY(-34px) scaleY(.9); } to { transform: translateY(0) scaleY(1); } }
.app-shell .hd-decor__peek { width: 64px; overflow: hidden; }
.app-shell .hd-decor__bunny-body { display: block; transform: translateY(100%); animation: hd-peek 6s ease-in-out infinite; }
@keyframes hd-peek { 0%, 100% { transform: translateY(100%); } 18%, 62% { transform: translateY(14%); } 30% { transform: translateY(18%) rotate(-4deg); } 45% { transform: translateY(14%) rotate(4deg); } }
.app-shell .hd-decor__tag { display: grid; justify-items: center; transform-origin: top center; animation: hd-swing 2.4s ease-in-out infinite alternate; }
.app-shell .hd-decor__string { width: 1px; height: 12px; background: rgba(255,255,255,.6); }
@keyframes hd-swing { from { transform: rotate(-9deg); } to { transform: rotate(9deg); } }
.app-shell .hd-decor__speck { display: block; width: 7px; height: 3px; border-radius: 1px; }
.app-shell .hd-decor__balloons { position: absolute; inset: 0; }
.app-shell .hd-decor__balloon { position: absolute; bottom: -110px; animation: hd-balloon 16s linear infinite; }
@keyframes hd-balloon { 0% { transform: translate(0, 0); } 50% { transform: translate(24px, -55vh); } 100% { transform: translate(-10px, calc(-100vh - 140px)); } }
@media (prefers-reduced-motion: reduce) { .app-shell .hd-decor * { animation: none !important; } .app-shell .hd-decor__bunny-body { transform: translateY(14%); } }


/* Notices beside the people: chips like the weather one, only while something needs attention. */
.app-shell .hd-notices { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: calc(var(--u)*.8); min-width: 0; }
.app-shell .hd-notice { display: inline-flex; align-items: center; gap: calc(var(--u)*.8); max-width: calc(var(--u)*30); padding: calc(var(--u)*.9) calc(var(--u)*1.6) calc(var(--u)*.9) calc(var(--u)*1.2); border: 1px solid color-mix(in srgb, var(--on, #ffc94d) 45%, transparent); border-radius: var(--hd-pill, 99px); background: color-mix(in srgb, var(--on, #ffc94d) 16%, rgba(255,255,255,.06)); backdrop-filter: blur(18px); color: var(--ink, #fff); font: 600 calc(var(--u)*1.7)/1.1 var(--f-body); cursor: pointer; }
.app-shell .hd-notice__icon { flex: none; display: inline-flex; color: var(--on, #ffc94d); --mdc-icon-size: 18px; }
.app-shell .hd-notice__name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .hd-notice small { flex: none; font-weight: 500; opacity: .7; }
.app-shell .hd-notice--icon { padding: calc(var(--u)*.9); }
.app-shell .hd-notice--text { padding-left: calc(var(--u)*1.6); }
.app-shell .hd-notice { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; touch-action: manipulation; }
.app-shell .hd-notice--confirm { padding-left: calc(var(--u)*1.6); border-color: var(--on, #ffc94d); background: color-mix(in srgb, var(--on, #ffc94d) 34%, rgba(255,255,255,.06)); }
.app-shell .st-notice-edit { display: flex; align-items: center; gap: calc(var(--u)*.8); min-width: 0; }
.app-shell .st-notice-edit .st-input { width: calc(var(--u)*22); max-width: 100%; }
.app-shell .st-notice-edit { flex-wrap: wrap; justify-content: flex-end; }
.app-shell .hd-pill--set, .app-shell .hd-pill[aria-expanded="true"] { background: var(--on); color: var(--on-ink, #2a2110); }
.app-shell .st-notice-rules { display: grid; gap: calc(var(--u)*1); padding: calc(var(--u)*1) 0 calc(var(--u)*1.6); }
.app-shell .st-notice-rules > small, .app-shell .hd-rules small { color: var(--ink-3); }
.app-shell .hd-rules { display: grid; gap: calc(var(--u)*1.4); min-width: 0; }
.app-shell .hd-rules__row { display: grid; gap: calc(var(--u)*.7); min-width: 0; }
.app-shell .hd-rules__label { font-weight: 600; }
.app-shell .hd-rules__body { display: flex; flex-wrap: wrap; align-items: center; gap: calc(var(--u)*.8); min-width: 0; }
.app-shell .hd-rules__time { flex: none; width: calc(var(--u)*13); color-scheme: dark; }
.app-shell .hd-rules__row > .hd-pill { justify-self: start; }
.app-shell .hd-rules__rule { display: grid; gap: calc(var(--u)*.8); padding: calc(var(--u)*1.1) calc(var(--u)*1.2); border-radius: calc(var(--u)*1.6*var(--hd-r,1)); background: rgba(255,255,255,.06); min-width: 0; }
.app-shell .hd-rules__head { display: flex; align-items: center; gap: calc(var(--u)*1); min-width: 0; }
.app-shell .hd-rules__head small { flex: none; max-width: 45%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .hd-rules__value { display: inline-flex; align-items: center; gap: calc(var(--u)*.8); }
.app-shell .hd-rules__value .st-input { width: calc(var(--u)*16); flex: none; }
.app-shell .hd-rules__days button { min-width: calc(var(--u)*5.4); padding: 0 calc(var(--u)*.8); }
:is(.app-shell, .onboarding-screen) .hd-import { display: grid; gap: 12px; min-width: 0; text-align: left; }
.app-shell .hd-import-sheet .hd-detail__header h2 { overflow: visible; white-space: normal; text-overflow: clip; }
:is(.app-shell, .onboarding-screen) .hd-import p { margin: 0; }
:is(.app-shell, .onboarding-screen) .hd-import__note, :is(.app-shell, .onboarding-screen) .hd-import__summary { opacity: .78; }
:is(.app-shell, .onboarding-screen) .hd-import__list { display: grid; gap: 6px; max-height: 260px; overflow-y: auto; }
:is(.app-shell, .onboarding-screen) .hd-import__option { display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px 12px; border: 1px solid rgba(255,255,255,.1); border-radius: 14px; background: rgba(255,255,255,.05); color: inherit; font: inherit; text-align: left; cursor: pointer; }
:is(.app-shell, .onboarding-screen) .hd-import__option span { display: grid; min-width: 0; }
:is(.app-shell, .onboarding-screen) .hd-import__option small { opacity: .6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
:is(.app-shell, .onboarding-screen) .hd-import__option[aria-checked="true"] { border-color: var(--hd-accent, #f4edd9); background: color-mix(in srgb, var(--hd-accent, #f4edd9) 16%, transparent); }
:is(.app-shell, .onboarding-screen) .hd-import__views { display: grid; gap: 4px; margin: 0; padding: 0; list-style: none; max-height: 180px; overflow-y: auto; }
:is(.app-shell, .onboarding-screen) .hd-import__views li { display: flex; justify-content: space-between; gap: 12px; padding: 6px 2px; border-bottom: 1px solid rgba(255,255,255,.08); }
:is(.app-shell, .onboarding-screen) .hd-import__views span { opacity: .65; }
:is(.app-shell, .onboarding-screen) .hd-import__check { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
:is(.app-shell, .onboarding-screen) .hd-import__check input { flex: none; width: 20px; height: 20px; margin: 2px 0 0; accent-color: var(--hd-accent, #f4edd9); }
:is(.app-shell, .onboarding-screen) .hd-import__check span { display: grid; gap: 2px; }
:is(.app-shell, .onboarding-screen) .hd-import__check small { opacity: .7; }
:is(.app-shell, .onboarding-screen) .hd-import__check em { display: inline-flex; align-items: center; gap: 3px; margin-left: 8px; font-style: normal; font-size: .8em; opacity: .75; }
:is(.app-shell, .onboarding-screen) .hd-import__actions { display: flex; justify-content: flex-end; align-items: center; gap: 10px; flex-wrap: wrap; }
/* Cancel and Import as a pair: same size, font and corners; only the color tells them apart. */
:is(.app-shell, .onboarding-screen) .hd-import__actions :is(.primary-button, .secondary-button) { display: inline-flex; align-items: center; justify-content: center; min-width: 116px; height: 42px; margin: 0; padding: 0 20px; border: 1px solid transparent; border-radius: calc(14px*var(--hd-r,1)); font: 700 13px/1 var(--f-body, inherit); letter-spacing: .01em; cursor: pointer; }
:is(.app-shell, .onboarding-screen) .hd-import__actions .secondary-button { border-color: rgba(255,255,255,.16); background: rgba(255,255,255,.08); color: inherit; }
:is(.app-shell, .onboarding-screen) .hd-import__actions .secondary-button:hover { background: rgba(255,255,255,.14); }
:is(.app-shell, .onboarding-screen) .hd-import__done { margin: 10px 0 0; opacity: .85; }
.onboarding-screen .onboarding-import { margin: 14px 0; }
.app-shell .hd-import-sheet { max-width: min(560px, calc(100vw - 32px)); }
.app-shell .hd-condition__name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600; }

/* Whole picture on camera cards, and the bigger sizes only cameras get. */
.app-shell .room-options__icons button[aria-expanded="true"], .app-shell button.st-item__icon[aria-expanded="true"] { background: var(--on); color: var(--on-ink, #2a2110); }
.app-shell button.st-item__icon { border: 0; padding: 0; color: inherit; cursor: pointer; }
.app-shell .camera-tile--whole .camera-tile__image { object-fit: contain; }
.app-shell .hd-item--x6 { grid-column: span 3; grid-row: span 2; }
.app-shell .hd-item--x8 { grid-column: span 4; grid-row: span 2; }
.app-shell .hd-grid--halves > .hd-item--x6, .app-shell .hd-grid--halves > .hd-item--x8 { grid-row: span 4; }
.app-shell .hd-grid[data-cols="3"] > .hd-item--x8 { grid-column: span 3; }
.app-shell .hd-grid:is([data-cols="1"], [data-cols="2"]) > :is(.hd-item--x6, .hd-item--x8) { grid-column: 1 / -1; }
@media (max-width: 720px) { .app-shell .hd-item--x6, .app-shell .hd-item--x8 { grid-column: 1 / -1; } }

/* Camera pages: 16:9 cells whatever the layout, in the columns the page asks for. */
.app-shell .camera-page { --cols: var(--cols-set); container-type: inline-size; width: 100%; }
.app-shell .camera-grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); gap: calc(var(--u)*1.4); grid-auto-rows: calc((100cqw - (var(--cols) - 1) * calc(var(--u)*1.4)) / var(--cols) * 9 / 16); grid-auto-flow: row dense; }
.app-shell .camera-grid .hd-item > .camera-tile { width: 100%; height: 100%; min-height: 0; }
.app-shell .camera-grid .hd-item--c4 { grid-column: span 2; grid-row: span 2; }
.app-shell .camera-grid .hd-item--c9 { grid-column: span 3; grid-row: span 3; }
.app-shell .camera-grid .hd-item--c16 { grid-column: span 4; grid-row: span 4; }
@media (max-width: 720px) {
  .app-shell .camera-page { --cols: var(--cols-phone); }
  .app-shell .camera-grid .hd-item:is(.hd-item--c9, .hd-item--c16) { grid-column: span 2; grid-row: span 2; }
}

/* Home columns by screen, the same on every device of a kind: tablets lying down (Echo Show 8, iPad, Fire...)
   5; big screens lying down (Echo Show 15, 1441 px and up) 6 or more as they widen; phones lying down 3, or 4 on the wider ones.
   Phones standing up keep 2; tablets standing up and computer windows still fit as many as their width allows. */
@media (min-width: 721px) and (max-width: 1440px) and (orientation: landscape) and (min-height: 521px) {
  .app-shell .home-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}
@media (min-width: 1441px) and (orientation: landscape) {
  /* At least 6, and more as the screen widens (cards of 240 px or more). */
  .app-shell .home-grid { grid-template-columns: repeat(auto-fill, minmax(min(calc((100% - 5 * var(--u) * 1.8) / 6), 240px), 1fr)); }
}
@media (min-width: 560px) and (orientation: landscape) and (max-height: 520px) {
  .app-shell .home-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (min-width: 800px) and (orientation: landscape) and (max-height: 520px) {
  .app-shell .home-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
/* Widget labels beside their icon never run past the card (several columns on tablets make them narrower). */
.app-shell .widget-card__label { right: calc(var(--u)*1.6); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; letter-spacing: .08em; }
/* Settings: a reminder that this device has its own layout or background. */
.app-shell .st-device-note { display: flex; align-items: center; gap: calc(var(--u)*1); margin: calc(var(--u)*1.6) 0 0; padding: calc(var(--u)*1.2) calc(var(--u)*1.6); border-radius: calc(var(--u)*1.6*var(--hd-r,1)); background: color-mix(in srgb, var(--on) 16%, transparent); color: var(--ink); font: 500 calc(var(--u)*1.7)/1.35 var(--f-body); }
.app-shell .st-device-note svg { flex: none; color: var(--on); }
.app-shell .st-device-note--panel { margin: 0 0 calc(var(--u)*1.6); }
/* Pictures in dropdowns (layout and background choices): a small rounded frame left of the label. */
.hdx-thumb { position: relative; flex: none; width: 52px; height: 32px; border-radius: 7px; overflow: hidden; box-shadow: 0 0 0 1px rgba(0,0,0,.18); }
.hdx-thumb > .lp-thumb { position: absolute; left: 0; top: 0; transform: scale(.40625); transform-origin: 0 0; }
.hdx-thumb > .st-kids-scene, .hdx-thumb > .hdx-thumb__fill { position: absolute; inset: 0; display: block; width: 100%; height: 100%; border: 0; border-radius: 0; }
.hdx-select > span.hdx-thumb { flex: none; width: 40px; height: 25px; border-radius: 6px; }
/* Phones: the closed button keeps its width for the name; the pictures show in the list. */
@media (max-width: 720px) { .hdx-select > span.hdx-thumb { display: none; } }
.hdx-select > .hdx-thumb > .lp-thumb { transform: scale(.3125); }
.hdx-select__option { justify-content: flex-start; }
.hdx-select__option > span:not(.hdx-thumb) { flex: 1; min-width: 0; }

/* Screensaver: room temperatures under the weather, and the large size for reading from across the room. */
.app-shell .hd-saver__rooms { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px min(3.4vw, 34px); max-width: 96vw; font: 500 min(3vw, 24px)/1.2 var(--f-body); }
.app-shell .hd-saver__rooms > span { display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
.app-shell .hd-saver__rooms > span > span { max-width: 14em; overflow: hidden; text-overflow: ellipsis; opacity: .8; }
.app-shell .hd-saver__rooms svg { opacity: .8; }
.app-shell .hd-saver__rooms b { font-weight: 650; font-variant-numeric: tabular-nums; }
/* Large: the clock stays, the weather and temperatures become big numbers with their names under them. */
.app-shell .hd-saver--large .hd-saver__date { font-size: min(3.6vw, 32px); }
.app-shell .hd-saver__stats { display: flex; flex-wrap: wrap; justify-content: center; gap: min(2.4vh, 20px) 0; max-width: 96vw; margin-top: min(2vh, 14px); }
.app-shell .hd-saver__stat { display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 0; padding: 0 min(3.4vw, 40px); }
.app-shell .hd-saver__stat + .hd-saver__stat { box-shadow: inset 1px 0 0 rgba(255,255,255,.2); }
.app-shell .hd-saver__stat b { font: 300 min(8vw, 10vh, 84px)/.95 var(--f-display); letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.app-shell .hd-saver__stat span { display: inline-flex; align-items: center; gap: 6px; max-width: 12em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 600 min(1.9vw, 16px)/1.2 var(--f-body); letter-spacing: .12em; text-transform: uppercase; opacity: .72; }
/* Many readings: one line as long as the screen is wide enough, then the next; spaced instead of ruled, so a
   wrapped line doesn't start with a separator. */
.app-shell .hd-saver__stats--many { gap: min(2.4vh, 20px) min(3.6vw, 44px); }
.app-shell .hd-saver__stats--many .hd-saver__stat { padding: 0; box-shadow: none; }
.app-shell .hd-saver__stats--many .hd-saver__stat b { font-size: min(6.4vw, 8vh, 68px); }
.app-shell .hd-saver--large:has(.hd-saver__stats--many) .hd-saver__time { font-size: min(24vw, 32vh, 220px); }
.app-shell .hd-saver--large:has(.hd-saver__agenda) .hd-saver__time { font-size: min(20vw, 26vh, 200px); }
.app-shell .hd-saver--large:has(.hd-saver__agenda) .hd-saver__stat b { font-size: min(5vw, 6.5vh, 54px); }

/* Child lock: the header lock fills a ring while held, the note under the header, and a lock on the locked cards. */
.app-shell .hd-child-lock { position: relative; touch-action: none; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
.app-shell .hd-child-lock--on { background: #f4edd9; color: #1b1712; }
.app-shell .hd-child-lock__ring { position: absolute; inset: -1px; border-radius: 50%; pointer-events: none; opacity: 0; transition: opacity .15s ease;
  background: conic-gradient(var(--on, #ffd43b) calc(var(--hold, 0) * 1turn), transparent 0);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3.5px), #000 calc(100% - 3px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 3.5px), #000 calc(100% - 3px)); }
.app-shell .hd-child-lock--holding .hd-child-lock__ring { opacity: 1; }
.app-shell.view-kids .hd-child-lock__ring { inset: calc(var(--kid-edge, 3px) * -1); background: conic-gradient(#ffd43b calc(var(--hold, 0) * 1turn), transparent 0); }
.app-shell .hd-lock-note { position: fixed; z-index: 60; left: 50%; top: calc(16px + env(safe-area-inset-top, 0px)); transform: translateX(-50%); display: flex; align-items: center; gap: 8px; max-width: calc(100vw - 32px); padding: 10px 16px; border-radius: var(--hd-pill, 99px); background: rgba(20,18,16,.88); color: #fff; font: 600 14px/1.3 var(--f-body); box-shadow: 0 8px 28px rgba(0,0,0,.35); backdrop-filter: blur(10px); animation: hd-lock-note .25s ease; pointer-events: none; }
@keyframes hd-lock-note { from { opacity: 0; transform: translate(-50%, -8px); } }
.app-shell .device-tile__lock { position: absolute; z-index: 2; left: calc(var(--u)*3.9); top: calc(var(--u)*.7); display: grid; place-items: center; width: 22px; height: 22px; box-shadow: 0 0 0 2px rgba(0,0,0,.25); border-radius: 50%; background: rgba(0,0,0,.45); color: #fff; pointer-events: none; }
.app-shell .device-tile:has(.device-tile__lock) > :not(.device-tile__lock) { opacity: .55; }

/* Cover option "Buttons on the side": on a small tile the three buttons stack on the right, so the tile is as tall as the others. */
.app-shell .device-tile:has(> .device-controls--side) { padding-right: calc(var(--u)*1.4 + 48px); }
.app-shell .device-tile > .device-controls.device-controls--side { position: absolute; z-index: 1; top: calc(var(--u)*1.2); right: calc(var(--u)*1.2); bottom: calc(var(--u)*1.2); width: 42px; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.app-shell .device-tile > .device-controls.device-controls--side button { flex: 1 1 0; width: 100%; min-width: 0; min-height: 0; }

/* Device picker: search and kinds stay on top while the list scrolls; on wider screens a big sheet with the
   devices in columns, each with its state and entity id, and the room name pinned while its devices scroll by. */
.app-shell .hd-sheet.hd-picker { overflow: hidden; }
.app-shell .hd-picker .hd-picker__list { flex: 1 1 auto; min-height: 0; overflow: auto; overscroll-behavior: contain; margin: 0 calc(var(--u)*-1); padding: 0 calc(var(--u)*1) calc(var(--u)*1); gap: calc(var(--u)*1.6); }
.app-shell .hd-picker__kinds { display: flex; gap: calc(var(--u)*.8); overflow-x: auto; scrollbar-width: none; margin: calc(var(--u)*-1) calc(var(--u)*-3) 0; padding: 2px calc(var(--u)*3); }
.app-shell .hd-picker__kinds::-webkit-scrollbar { display: none; }
.app-shell .hd-picker__kinds button { flex: none; display: inline-flex; align-items: center; gap: calc(var(--u)*.7); height: calc(var(--u)*4.2); padding: 0 calc(var(--u)*1.6); border: 0; border-radius: var(--hd-pill, 99px); background: rgba(255,255,255,.1); color: var(--ink); font: 600 calc(var(--u)*1.6)/1 var(--f-body); white-space: nowrap; cursor: pointer; }
.app-shell .hd-picker__kinds button i { font-style: normal; font-weight: 500; opacity: .6; font-variant-numeric: tabular-nums; }
.app-shell .hd-picker__kinds button[aria-pressed="true"] { background: var(--on); color: var(--on-ink, #2a2110); }
.app-shell .hd-picker__kinds button[aria-pressed="true"] i { opacity: .75; }
.app-shell .hd-picker__room { position: sticky; top: 0; z-index: 1; margin: 0 calc(var(--u)*-1); padding: calc(var(--u)*.8) calc(var(--u)*2.2); background: rgba(30,26,24,.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.app-shell .hd-picker__rows { display: grid; grid-template-columns: minmax(0, 1fr); gap: calc(var(--u)*.4); }
.app-shell .hd-picker__copy small, .app-shell .hd-picker__copy code { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .hd-picker__copy code { color: var(--ink-3); font: 500 calc(var(--u)*1.3)/1.2 ui-monospace, SFMono-Regular, Menlo, monospace; opacity: .8; }
.app-shell .hd-picker__copy strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@media (min-width: 760px) {
  .app-shell .hd-sheet.hd-picker { width: min(1120px, calc(100vw - 64px)); height: min(860px, calc(100vh - 64px)); max-height: none; }
  .app-shell .hd-picker__rows { grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr)); gap: calc(var(--u)*.6) calc(var(--u)*1); }
  .app-shell .hd-picker__row { background: rgba(255,255,255,.04); }
}
@media (max-width: 759px) { .app-shell .hd-sheet.hd-picker { height: calc(100dvh - 40px); max-height: none; } }

/* Long dropdowns: a search field pinned on top, and the entity id under each sensor's name. */
.hdx-select__search { position: sticky; top: -6px; z-index: 1; display: flex; align-items: center; gap: 8px; margin: -6px -6px 6px; padding: 10px 14px; background: rgba(255,255,255,.94); border-bottom: 1px solid rgba(0,0,0,.08); color: rgba(29,26,23,.55); }
.hdx-select__list--sheet .hdx-select__search { top: -10px; margin: 0 -12px 6px; padding: 10px 20px; }
.hdx-select__search input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; color: #1d1a17; font: inherit; }
.hdx-select__two { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.hdx-select__two > span, .hdx-select__two > small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.hdx-select__two > small { font: 500 11.5px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace; color: rgba(29,26,23,.5); }
.hdx-select__none { padding: 12px; text-align: center; color: rgba(29,26,23,.5); }
.app-shell.view-kids .hdx-select__search { background: #fffdf8; }
.app-shell.view-kids .hd-picker__room { background: var(--kid-sheet, #fffdf8); }

/* Waste bins: the value a bin reads (the state or an attribute), on its own line under the sensor. */
.app-shell .st-bin__value { grid-column: 1 / -1; display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: center; gap: calc(var(--u)*1.2); padding-left: calc(var(--u)*.4); color: var(--ink-2); font: 500 calc(var(--u)*1.6)/1.2 var(--f-body); }

/* A room's environment sensors: pills with the reading and, smaller, the sensor's name. */
.app-shell .sensor-strip .hd-item > button:first-child { gap: calc(var(--u)*.9); }
.app-shell .sensor-strip button > span { display: inline-flex; align-items: baseline; gap: calc(var(--u)*.7); min-width: 0; }
.app-shell .sensor-strip button b { font-weight: 650; font-variant-numeric: tabular-nums; white-space: nowrap; }
.app-shell .sensor-strip button small { max-width: 11em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .82em; opacity: .7; }

/* Shortcut bar of this device (Settings → This device): a black strip at the very bottom, 9 equal parts.
   The dock and the Edit button sit above it, or the dock hides when the device asks for that. */
.app-shell .hd-keybar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 2147483000; height: 30px; display: grid; grid-template-columns: repeat(9, minmax(0, 1fr)); align-items: center; background: #000; padding-bottom: env(safe-area-inset-bottom, 0px); box-sizing: content-box; }
.app-shell .hd-keybar button { grid-row: 1; height: 30px; min-width: 0; padding: 0 2px; border: 0; background: none; color: #fff; font: 700 13px/30px var(--f-body); letter-spacing: .14em; text-transform: uppercase; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; -webkit-tap-highlight-color: transparent; }
.app-shell .hd-keybar button:active { background: rgba(255,255,255,.18); }
.app-shell .hd-keybar button:disabled { cursor: default; opacity: .55; }
.app-shell.has-keybar { --dock-bottom: calc(30px + env(safe-area-inset-bottom, 0px) + var(--u)*1.6); }
.app-shell.keybar-nodock .navigation-dock { display: none; }

.app-shell .st-keybar { display: grid; grid-template-columns: calc(var(--u)*3) minmax(0, 1fr) minmax(0, 1.4fr); align-items: center; gap: calc(var(--u)*.8); padding: calc(var(--u)*.5) 0; }
.app-shell .st-keybar__n { color: var(--ink-3); font: 700 calc(var(--u)*1.6)/1 var(--f-body); text-align: center; font-variant-numeric: tabular-nums; }
@media (max-width: 720px) { .app-shell .st-keybar { grid-template-columns: calc(var(--u)*3) minmax(0, 1fr); } .app-shell .st-keybar > :last-child { grid-column: 2; } }

/* Home Assistant notifications: the bell with a count, and the list sheet. */
.app-shell .hd-bell { position: relative; }
.app-shell .hd-bell__dot { position: absolute; top: -3px; right: -3px; min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box; border-radius: 99px; display: grid; place-items: center; background: #ff6b5e; color: #fff; font: 700 11px/1 var(--f-body); font-style: normal; box-shadow: 0 0 0 2px rgba(0,0,0,.25); }
.app-shell .hd-notes__list { display: flex; flex-direction: column; gap: calc(var(--u)*1.2); }
.app-shell .hd-notes__item { display: flex; flex-direction: column; align-items: flex-start; gap: calc(var(--u)*.9); padding: calc(var(--u)*1.6); border-radius: calc(var(--u)*2*var(--hd-r,1)); background: rgba(255,255,255,.07); }
.app-shell .hd-notes__head { display: flex; align-items: baseline; justify-content: space-between; gap: calc(var(--u)*1.2); width: 100%; }
.app-shell .hd-notes__head b { font: 600 calc(var(--u)*1.9)/1.25 var(--f-body); }
.app-shell .hd-notes__head small { flex: none; color: var(--ink-3); font: 500 calc(var(--u)*1.45)/1 var(--f-body); }
.app-shell .hd-notes__text { width: 100%; margin: 0; color: var(--ink-2); font: 500 calc(var(--u)*1.65)/1.45 var(--f-body); overflow-wrap: anywhere; }
.app-shell .hd-notes__text--plain { white-space: pre-wrap; }
.app-shell .hd-notes__text a { color: var(--on); }
.app-shell .hd-notes__empty { margin: 0; color: var(--ink-2); text-align: center; padding: calc(var(--u)*2) 0; }
.app-shell .hd-notes__all { align-self: center; }

/* Security alerts list: a short sheet (the picker's rows), each alert marked and opening its details. */
@media (min-width: 760px) { .app-shell .hd-sheet.hd-picker.hd-alerts { width: min(560px, calc(100vw - 64px)); height: auto; max-height: min(640px, calc(100vh - 64px)); } }
@media (max-width: 759px) { .app-shell .hd-sheet.hd-picker.hd-alerts { height: auto; max-height: calc(100dvh - 40px); } }
.app-shell .hd-alerts .hd-picker__rows { grid-template-columns: minmax(0, 1fr); }
.app-shell .hd-alerts__row .hd-picker__icon { background: rgba(255,107,94,.22); color: #ffb0a8; }
.app-shell .hd-alerts__row > svg { transform: rotate(-90deg); opacity: .6; }

/* Forecast: where it is for (the weather entity's name, e.g. the home or the city) under the title. */
.app-shell .hd-forecast__place { margin: calc(var(--u)*.4) 0 0; color: var(--ink-2); font: 500 calc(var(--u)*1.6)/1.2 var(--f-body); }

/* Floor plan (Pro). The screen fits the window: the plan takes what the header and the dock leave. */
.app-shell .fp-screen { height: calc(var(--hd-vh, 1vh) * 100); min-height: 0; box-sizing: border-box; overflow: hidden; }
.app-shell .fp { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: calc(var(--u)*1.2); }
.app-shell .sb-main .fp { height: calc(var(--hd-vh, 1vh) * 100 - var(--u)*22); }
.app-shell .fp-bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: calc(var(--u)*1); }
.app-shell .fp-bar:empty { display: none; }
.app-shell .fp-tools { display: flex; flex-wrap: wrap; gap: calc(var(--u)*.8); margin-left: auto; }
.app-shell .fp-stage { flex: 1 1 auto; min-height: calc(var(--u)*30); display: grid; place-items: center; position: relative; }
.app-shell .fp-canvas { position: relative; touch-action: none; }
.app-shell .fp-room { position: absolute; box-sizing: border-box; padding: calc(var(--fp-unit)*.32) calc(var(--fp-unit)*.4); --fp-wall: rgba(255,255,255,.26); }
.app-shell .fp-room::before { content: ""; position: absolute; inset: 2px; border-radius: calc(var(--fp-unit)*.3*var(--hd-r,1)); border: 1.5px solid var(--fp-wall); background: rgba(255,255,255,.035); transition: background .6s ease, border-color .4s ease, box-shadow .6s ease; pointer-events: none; }
.app-shell .fp-room--lit::before { background: radial-gradient(ellipse at 50% 55%, rgba(255,196,110, calc(.12 + .30 * var(--fp-glow))), rgba(255,196,110, calc(.03 + .08 * var(--fp-glow))) 70%); border-color: rgba(255,214,150, calc(.35 + .4 * var(--fp-glow))); box-shadow: 0 0 calc(var(--fp-unit)*1.2) rgba(255,190,90, calc(.08 + .22 * var(--fp-glow))); }
.app-shell .fp-room--open { --fp-wall: rgba(255,107,94,.85); }
.app-shell .fp-room--motion::after { content: ""; position: absolute; inset: 2px; border-radius: calc(var(--fp-unit)*.3*var(--hd-r,1)); box-shadow: inset 0 0 0 2px rgba(120,200,255,.6); animation: fp-motion 2.2s ease-in-out infinite; pointer-events: none; }
@keyframes fp-motion { 50% { box-shadow: inset 0 0 0 2px rgba(120,200,255,.1); } }
.app-shell .fp-room__head { position: relative; z-index: 1; display: flex; align-items: baseline; justify-content: space-between; gap: 6px; min-width: 0; }
.app-shell .fp-room__head > span:first-child { min-width: 0; color: var(--ink); font: 600 clamp(11px, calc(var(--fp-unit)*.5), 16px)/1.2 var(--f-body); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .fp-room__temp { flex: none; color: var(--ink-2); font: 500 clamp(10px, calc(var(--fp-unit)*.45), 15px)/1 var(--f-body); font-variant-numeric: tabular-nums; }
.app-shell .fp-spot { position: absolute; z-index: 2; translate: -50% -50%; width: clamp(32px, calc(var(--fp-unit)*1.65), 56px); height: clamp(32px, calc(var(--fp-unit)*1.65), 56px); padding: 0; display: grid; place-items: center; border: 0; border-radius: var(--hd-round, 50%); background: rgba(255,255,255,.12); color: var(--ink); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); cursor: pointer; transition: background .3s, box-shadow .3s, transform .15s; -webkit-tap-highlight-color: transparent; touch-action: none; user-select: none; -webkit-user-select: none; }
.app-shell .fp-spot:active { transform: scale(.9); }
.app-shell .fp-spot svg { width: 58%; height: 58%; }
/* In Edit mode the floor buttons sit above the plan, so the rooms along the top stay reachable. */
.app-shell .fp--editing .fp-overlay { position: relative; }
.app-shell .fp-spot--on { background: var(--on); color: var(--on-ink, #2a2110); box-shadow: 0 0 calc(var(--fp-unit)*.9) color-mix(in srgb, var(--on) 60%, transparent); }
.app-shell .fp-spot--alert { background: #ff6b5e; color: #fff; box-shadow: 0 0 calc(var(--fp-unit)*.9) rgba(255,107,94,.6); }
.app-shell .fp-spot--motion { background: rgba(120,200,255,.35); animation: fp-pulse 1.6s ease-in-out infinite; }
@keyframes fp-pulse { 50% { box-shadow: 0 0 0 calc(var(--fp-unit)*.4) rgba(120,200,255,0), inset 0 0 0 1px rgba(255,255,255,.14); } 0%, 100% { box-shadow: 0 0 0 0 rgba(120,200,255,.5), inset 0 0 0 1px rgba(255,255,255,.14); } }
.app-shell .fp-spot--na { opacity: .4; }
.app-shell .fp--editing .fp-room { cursor: move; }
.app-shell .fp--editing .fp-room::before { border-style: dashed; }
.app-shell .fp--editing .fp-spot { cursor: grab; }
.app-shell .fp-spot--hidden { opacity: .35; outline: 1.5px dashed rgba(255,255,255,.5); outline-offset: 2px; }
.app-shell .fp-spot__hide { position: absolute; top: -7px; right: -7px; width: 18px; height: 18px; border-radius: 50%; display: grid; place-items: center; background: #ff6b5e; color: #fff; font: 700 13px/1 var(--f-body); font-style: normal; box-shadow: 0 1px 4px rgba(0,0,0,.4); cursor: pointer; }
.app-shell .fp-spot--hidden .fp-spot__hide { background: #3fb68b; }
.app-shell .fp-room__resize { position: absolute; z-index: 3; right: 0; bottom: 0; width: 22px; height: 22px; cursor: nwse-resize; touch-action: none; }
.app-shell .fp-room__resize::after { content: ""; position: absolute; right: 6px; bottom: 6px; width: 9px; height: 9px; border-right: 2.5px solid var(--ink); border-bottom: 2.5px solid var(--ink); border-radius: 0 0 3px 0; opacity: .8; }
.app-shell .fp-room__resize--start { right: auto; bottom: auto; left: 0; top: 0; }
.app-shell .fp-room__resize--start::after { right: auto; bottom: auto; left: 6px; top: 6px; border: 0; border-left: 2.5px solid var(--ink); border-top: 2.5px solid var(--ink); border-radius: 3px 0 0 0; }
/* Kids layout: paper rooms with a dark outline. */
.app-shell.view-kids .fp-room { --fp-wall: var(--kid-dark, #231b3d); }
.app-shell.view-kids .fp-room::before { border-width: 3px; background: rgba(255,255,255,.55); }
.app-shell.view-kids .fp-room--lit::before { background: radial-gradient(ellipse at 50% 55%, rgba(255,214,107, calc(.45 + .4 * var(--fp-glow))), rgba(255,240,200,.6) 75%); border-color: var(--kid-dark, #231b3d); }
.app-shell.view-kids .fp-room__head > span { color: var(--kid-dark, #231b3d); }
.app-shell.view-kids .fp-spot { background: #fffdf8; color: var(--kid-dark, #231b3d); box-shadow: 0 0 0 2px var(--kid-dark, #231b3d), 0 2px 0 2px rgba(35,27,61,.42); }
.app-shell.view-kids .fp-spot--on { background: #ffd43b; }

/* Floor plan with a background image: the image under the rooms, rooms without walls (dashed in Edit
   mode), the glow kept soft over the drawing. */
.app-shell .fp-image { position: absolute; left: 0; top: 0; z-index: 0; object-fit: fill; border-radius: calc(var(--fp-unit)*.25); pointer-events: none; user-select: none; -webkit-user-select: none; }
.app-shell .fp--image .fp-room::before { background: transparent; border-color: transparent; }
.app-shell .fp--image .fp-room--lit::before { background: radial-gradient(ellipse at 50% 55%, rgba(255,196,110, calc(.18 + .30 * var(--fp-glow))), rgba(255,196,110,.04) 72%); border-color: transparent; box-shadow: none; }
.app-shell .fp--image .fp-room--open::before { border-color: rgba(255,107,94,.9); }
.app-shell .fp--image.fp--editing .fp-room::before { border-color: rgba(255,255,255,.7); background: rgba(0,0,0,.12); }
.app-shell .fp--image .fp-room__head > span { padding: 1px 6px; border-radius: 6px; background: rgba(0,0,0,.55); color: #fff; }
.app-shell .fp-image-panel { display: flex; flex-direction: column; gap: calc(var(--u)*.8); padding: calc(var(--u)*1.2) calc(var(--u)*1.4); border-radius: calc(var(--u)*1.8*var(--hd-r,1)); background: rgba(255,255,255,.06); }
.app-shell .fp-image-panel p { margin: 0; color: var(--ink-2); font: 500 calc(var(--u)*1.55)/1.4 var(--f-body); }
.app-shell .fp-image-panel__row { display: flex; flex-wrap: wrap; align-items: center; gap: calc(var(--u)*.8); }
.app-shell .fp-image-panel__opacity { display: inline-flex; align-items: center; gap: calc(var(--u)*.8); color: var(--ink-2); font: 600 calc(var(--u)*1.5)/1 var(--f-body); }
.app-shell .fp-image-panel__opacity input { width: calc(var(--u)*16); accent-color: var(--on); }
.app-shell .fp-image-panel__error { color: #ffb0a8 !important; }
/* 3D: the plan tilted back like a model on a table; rooms rise as low walls, devices stand facing you. */
.app-shell .fp-3d-toggle--on { background: var(--on); color: var(--on-ink, #2a2110); border-color: transparent; }
.app-shell .fp--3d .fp-stage { perspective: 1800px; perspective-origin: 50% 30%; }
.app-shell .fp--3d .fp-canvas { transform-style: preserve-3d; }
.app-shell .fp--moving .fp-canvas { transition: none; }
.app-shell .fp-stage { touch-action: none; overflow: hidden; }
.app-shell .fp--3d .fp-stage { cursor: grab; }
.app-shell .fp--3d.fp--moving .fp-stage { cursor: grabbing; }
.app-shell .fp-canvas { transition: transform .6s cubic-bezier(.2,.8,.2,1); }
.app-shell .fp--3d .fp-room { transform-style: preserve-3d; }
/* 3D: the rooms lie on the floor, without a raised outline above them (the devices stand up instead). */
.app-shell .fp--3d .fp-room:not(.fp-room--motion)::after { content: none; }
.app-shell .fp--3d .fp-room::before { box-shadow: 0 0 0 1px var(--fp-wall), 0 calc(var(--fp-unit)*.3) calc(var(--fp-unit)*1.2) rgba(0,0,0,.35); }
.app-shell .fp--3d .fp-spot { transform: translateZ(calc(var(--fp-unit)*.9)) rotateZ(calc(var(--fp-rz) * -1)) rotateX(calc(var(--fp-rx) * -1)); }
/* The devices (and names) sit in their own layer over the room: it keeps the 3D so they stand up. */
.app-shell .fp--3d .fp-room__spots { transform-style: preserve-3d; }
.app-shell .fp--3d .fp-room__name { transform: translateZ(calc(var(--fp-unit)*1.4)) rotateZ(calc(var(--fp-rz) * -1)) rotateX(calc(var(--fp-rx) * -1)); }
.app-shell .fp--3d .fp-room__head { transform: translateZ(calc(var(--fp-unit)*1.15)); }
.app-shell .fp--3d.fp--image .fp-room::after { border-color: transparent; }
.app-shell .fp--3d .fp-image { box-shadow: 0 calc(var(--fp-unit)*1.4) calc(var(--fp-unit)*3) rgba(0,0,0,.45); }
@media (prefers-reduced-motion: reduce) { .app-shell .fp-canvas { transition: none; } }

/* Floor plan card on Home: the plan fills the card between its label and its line. */
.app-shell .fp-card { display: flex; flex-direction: column; }
.app-shell .fp-card__plan { position: relative; display: grid; place-items: center; flex: 1 1 auto; min-height: calc(var(--u)*8); margin: calc(var(--u)*.4) 0; }
.app-shell .fp-card__box { position: relative; display: block; }
.app-shell .fp-card .fp-room { position: absolute; display: block; padding: 0; }
.app-shell .fp-card .fp-room::before { inset: 1.5px; border-radius: 4px; border-width: 1px; }
.app-shell .fp-card p { margin: 0; }

/* Sensors on the plan: a pill with their reading. Plan screen: no title, the plan takes the room left. */
.app-shell .fp-spot--reading { width: auto; min-width: clamp(32px, calc(var(--fp-unit)*1.65), 56px); padding: 0 clamp(6px, calc(var(--fp-unit)*.2), 10px); gap: 4px; display: inline-flex; align-items: center; justify-content: center; border-radius: var(--hd-pill, 99px); }
.app-shell .fp-spot--reading svg { width: 16px; height: 16px; flex: none; opacity: .8; }
.app-shell .fp-spot--reading b { font: 650 clamp(11px, calc(var(--fp-unit)*.46), 16px)/1 var(--f-body); white-space: nowrap; font-variant-numeric: tabular-nums; }
.app-shell .fp-screen .fp { gap: calc(var(--u)*.8); }
.app-shell .fp-screen .context-header { margin-bottom: 0; }

/* Edit mode: each device's name under its spot, to know what is being placed. */
.app-shell .fp-spot__label { position: absolute; left: 50%; top: calc(100% + 3px); translate: -50% 0; max-width: calc(var(--fp-unit)*4.5); padding: 2px 6px; border-radius: 6px; background: rgba(0,0,0,.72); color: #fff; font: 600 10.5px/1.25 var(--f-body); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; z-index: 3; }
.app-shell.view-kids .fp-spot__label { background: var(--kid-dark, #231b3d); }

/* Plan controls float over the plan's top left corner, so the plan gets the whole screen. */
.app-shell .fp { position: relative; }
.app-shell .fp-overlay { position: absolute; z-index: 6; top: 0; left: 0; right: 0; display: flex; flex-direction: column; align-items: flex-start; gap: calc(var(--u)*.8); pointer-events: none; }
.app-shell .fp-overlay > * { pointer-events: auto; }
.app-shell .fp-overlay .fp-bar { justify-content: flex-start; }
.app-shell .fp-overlay .fp-tools { margin-left: 0; }
.app-shell .fp-overlay .fp-image-panel { max-width: min(560px, 100%); background: rgba(20,18,16,.82); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }
.app-shell .fp-confirm { background: #ff6b5e; color: #fff; border-color: transparent; }
/* With a background image the drawing is the plan: no room boxes, outlines, walls or glow outside Edit mode. */
.app-shell .fp--image:not(.fp--editing) .fp-room::before, .app-shell .fp--image:not(.fp--editing) .fp-room::after { content: none; }
.app-shell .fp--3d .fp-image { box-shadow: none; }

/* Floor plan card: only the plan, as large as the card allows, with the lights that are on glowing. */
.app-shell .fp-card__plan { margin: calc(var(--u)*.8) 0 0; min-height: 0; }
.app-shell .fp-card--image .fp-room::before { border-color: transparent; background: transparent; }
.app-shell .fp-card--image .fp-room--lit::before { background: radial-gradient(ellipse at 50% 55%, rgba(255,196,110, calc(.16 + .26 * var(--fp-glow))), rgba(255,196,110,.03) 72%); box-shadow: none; }
.app-shell .fp-card__light { position: absolute; z-index: 1; translate: -50% -50%; width: 9px; height: 9px; border-radius: 50%; background: #ffd27a; box-shadow: 0 0 6px 2px rgba(255,200,110,.85), 0 0 18px 6px rgba(255,190,90,.35); }

/* Plan spots: icons exactly in the middle of their circle, Home Assistant's own icons included (they
   otherwise sit on the text line and drift down or sideways). */
.app-shell .fp-spot { line-height: 0; }
.app-shell .fp-spot :is(ha-state-icon, ha-icon) { display: flex !important; align-items: center; justify-content: center; --ha-icon-display: block; line-height: 0; }
.app-shell .fp-spot:not(.fp-spot--reading) :is(ha-state-icon, ha-icon) { width: 55% !important; height: 55% !important; --mdc-icon-size: 100%; }
.app-shell .fp-spot svg { display: block; }
.app-shell .fp-spot--reading :is(ha-state-icon, ha-icon) { width: 14px !important; height: 14px !important; --mdc-icon-size: 14px; flex: none; }

/* The shortcut bar stays on top of everything (screensaver, sheets, doorbell, Settings); full-screen layers
   end right above it, so nothing is hidden under the bar. */
.app-shell.has-keybar :is(.hd-saver, .hd-sheet-backdrop, .weather-modal, .entity-modal, .hdx-select__backdrop, .hd-doorbell, .hd-cal) { bottom: calc(30px + env(safe-area-inset-bottom, 0px)); }
.app-shell.has-keybar .hdx-select__list--sheet { bottom: calc(30px + env(safe-area-inset-bottom, 0px)); }
.app-shell.has-keybar .settings-v2 { padding-bottom: calc(30px + env(safe-area-inset-bottom, 0px)); }

/* Floor plan card: the plan fills the card from just under its label (see PlanWidget), top-aligned. */
.app-shell .fp-card { position: relative; }
.app-shell .fp-card .fp-card__plan { position: absolute; left: calc(var(--u)*1.7); right: calc(var(--u)*1.7); bottom: calc(var(--u)*1.7); top: calc(var(--u)*7.8); margin: 0; place-items: center; }

/* No icon on the floor plan card: its label sits in the corner, as far from the top as from the side. */
.app-shell .fp-card .widget-card__label { position: absolute; left: calc(var(--u)*1.7); right: calc(var(--u)*1.7); top: calc(var(--u)*1.7); margin: 0; }

/* Interface transitions (Settings → This device → Animations → Transitions and effects).
   Tab pill: slides behind the tabs to the one chosen. */
.app-shell .navigation-dock__pill { display: none; }
.app-shell.hd-motion:not(.view-kids) .navigation-dock__pill { display: block; position: absolute; z-index: 0; border-radius: var(--hd-pill, 99px); background: rgba(255,255,255,.92); box-shadow: 0 6px 18px rgba(0,0,0,.2); pointer-events: none; transition: left .45s cubic-bezier(.3,1.25,.4,1), width .45s cubic-bezier(.3,1.25,.4,1), top .3s ease, height .3s ease; }
.app-shell.hd-motion:not(.view-kids) .navigation-dock button { position: relative; z-index: 1; transition: color .3s ease, transform .2s ease; }
.app-shell.hd-motion:not(.view-kids) .navigation-dock button.navigation-dock__active { background: transparent; }
.app-shell.hd-motion .navigation-dock button:active { transform: scale(.94); }
/* Pages fade and rise in; a room's content slides in when another room is chosen. */
@keyframes hd-page-in { from { opacity: 0; transform: translateY(14px); } }
@keyframes hd-pane-in { from { opacity: 0; transform: translateX(18px); } }
/* The header (clock, weather, people) is the same on every page: it stays put while the rest arrives. */
.app-shell.hd-motion > .screen > :not(.context-header, .navigation-dock) { animation: hd-page-in .48s cubic-bezier(.2,.8,.2,1) both; }
.app-shell.hd-motion .room-pane { animation: hd-pane-in .42s cubic-bezier(.2,.8,.2,1) both; }
.app-shell.hd-motion .sb-main > :not(.context-header) { animation: hd-pane-in .42s cubic-bezier(.2,.8,.2,1) both; }
/* Cards arrive one after another. */
@keyframes hd-item-in { from { opacity: 0; transform: translateY(12px) scale(.96); } }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item { animation: hd-item-in .52s cubic-bezier(.2,.85,.25,1) both; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(1) { animation-delay: 0ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(2) { animation-delay: 24ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(3) { animation-delay: 48ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(4) { animation-delay: 72ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(5) { animation-delay: 96ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(6) { animation-delay: 120ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(7) { animation-delay: 144ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(8) { animation-delay: 168ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(9) { animation-delay: 192ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(10) { animation-delay: 216ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(11) { animation-delay: 240ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(12) { animation-delay: 264ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(13) { animation-delay: 288ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(14) { animation-delay: 312ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(15) { animation-delay: 336ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(16) { animation-delay: 360ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(17) { animation-delay: 384ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(18) { animation-delay: 408ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(19) { animation-delay: 432ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(20) { animation-delay: 456ms; }
.app-shell.hd-motion:not(.view-kids) .screen:not(.screen--editing) .hd-item:nth-child(n+21) { animation-delay: 480ms; }
/* Sheets and windows spring open; on phones they rise from the bottom. */
@keyframes hd-sheet-pop { from { opacity: 0; transform: translateY(22px) scale(.95); } 60% { opacity: 1; } }
@keyframes hd-sheet-up { from { transform: translateY(100%); } }
@keyframes hd-veil { from { opacity: 0; backdrop-filter: blur(0); -webkit-backdrop-filter: blur(0); } }
.app-shell.hd-motion:not(.view-kids) :is(.hd-sheet, .weather-modal__panel) { animation: hd-sheet-pop .46s cubic-bezier(.2,.95,.25,1.06) both; }
.app-shell.hd-motion :is(.hd-sheet-backdrop, .weather-modal) { animation: hd-veil .3s ease both; }
@media (max-width: 720px) { .app-shell.hd-motion:not(.view-kids) .hd-sheet { animation: hd-sheet-up .42s cubic-bezier(.2,.9,.25,1) both; } }
.app-shell.hd-motion .hdx-select__list:not(.hdx-select__list--sheet) { animation: hdx-pop .2s cubic-bezier(.2,.9,.25,1.1); }
/* Controls answer the finger. */
.app-shell.hd-motion :is(.hd-pill, .round-action, .weather-chip, .room-actions > button, .global-actions > button) { transition: transform .18s ease, background .25s ease, color .25s ease, box-shadow .25s ease; }
.app-shell.hd-motion :is(.hd-pill, .round-action, .weather-chip, .room-actions > button, .global-actions > button):active { transform: scale(.95); }
/* Off: no entrance or opening animations at all, for slow devices. */
.app-shell:not(.hd-motion) :is(.screen, .room-pane, .sb-main, .hd-item, .hd-sheet, .hd-sheet-backdrop, .weather-modal, .weather-modal__panel, .hd-cal, .hdx-select__list, .hdx-select__backdrop, .hd-saver, .hd-detail) { animation: none !important; }
@media (prefers-reduced-motion: reduce) {
  .app-shell.hd-motion :is(.screen, .room-pane, .sb-main, .hd-item, .hd-sheet, .weather-modal__panel) { animation: none !important; }
  .app-shell.hd-motion .navigation-dock__pill { transition: none; }
}

/* Settings → This device: its choices grouped under small headings. */
.app-shell .st-category { margin: calc(var(--u)*2.6) 0 calc(var(--u)*.4); padding-top: calc(var(--u)*1.6); border-top: 1px solid var(--line, rgba(255,255,255,.12)); color: var(--ink-3); font: 700 calc(var(--u)*1.35)/1.2 var(--f-body); letter-spacing: .14em; text-transform: uppercase; }
.app-shell .st-panel > p + .st-category, .app-shell .st-panel > h2 + .st-category { border-top: 0; padding-top: 0; margin-top: calc(var(--u)*1.2); }

/* Kids layout: the lock on a locked card is a little white bubble with the dark outline, like its icons. */
.app-shell.view-kids .device-tile__lock { width: calc(var(--u)*3.4); height: calc(var(--u)*3.4); background: #fffdf8; color: var(--kid-dark, #231b3d); border: var(--kid-edge, 2px) solid var(--kid-dark, #231b3d); box-shadow: 0 calc(var(--u)*.3) 0 var(--kid-shadow); }
.app-shell.view-kids .device-tile:has(.device-tile__lock) > :not(.device-tile__lock) { opacity: .6; }

/* Settings save themselves: a quiet note in the header instead of a Save button. */
.app-shell .st-saved { display: inline-flex; align-items: center; gap: 6px; color: var(--ink-2); font: 600 calc(var(--u)*1.5)/1.2 var(--f-body); white-space: nowrap; }
.app-shell .st-saved svg { color: #5fd38d; }
.app-shell .st-saved--failed { color: #ffb0a8; }

/* Air conditioner, small card: the target temperature sits in the top right corner (across from the icon),
   so the card keeps the size of the others; − and + stay at the bottom. */
.app-shell .device-tile:not(.device-tile--wide) > .climate-quick-control > span { position: absolute; top: calc(var(--u)*2); right: calc(var(--u)*2); line-height: 1; }

/* Settings, one look for every panel: the same title and text sizes, and every field (text box, list,
   button) the same height, type, corners and frame. */
.app-shell .settings-v2 .st-panel { gap: calc(var(--u)*1.4); }
.app-shell .settings-v2 .st-panel h2 { margin: 0; font: 600 calc(var(--u)*2.2)/1.2 var(--f-body); }
.app-shell .settings-v2 .st-panel > p { margin: calc(var(--u)*-.6) 0 calc(var(--u)*.4); color: var(--ink-2); font: 500 calc(var(--u)*1.65)/1.4 var(--f-body); }
.app-shell .settings-v2 .st-panel h3:not(.st-category) { margin: calc(var(--u)*1) 0 0; font: 600 calc(var(--u)*1.9)/1.25 var(--f-body); }
.app-shell .settings-v2 :is(.st-row small, .st-sub p, .st-device-note) { font-size: calc(var(--u)*1.55); line-height: 1.4; }
.app-shell .settings-v2 .st-row b, .app-shell .settings-v2 .st-sub__row > span:first-child { font: 600 calc(var(--u)*1.85)/1.25 var(--f-body); }
.app-shell .settings-v2 :is(.hdx-select, .st-input, .st-input--framed) { box-sizing: border-box; height: calc(var(--u)*4.8); min-height: calc(var(--u)*4.8); border-radius: calc(var(--u)*1.4*var(--hd-r,1)); border: 1px solid rgba(255,255,255,.24); background: rgba(255,255,255,.08); color: var(--ink); font: 600 calc(var(--u)*1.75)/1.2 var(--f-body); }
.app-shell .settings-v2 .st-input { padding: 0 calc(var(--u)*1.4); font-weight: 500; }
.app-shell .settings-v2 .st-input:focus { outline: none; border-color: rgba(255,255,255,.6); background: rgba(255,255,255,.12); }
.app-shell .settings-v2 .st-input::placeholder { color: var(--ink-3); }
.app-shell .settings-v2 .hdx-select { padding: 0 calc(var(--u)*1.4) 0 calc(var(--u)*1.6); }
.app-shell .settings-v2 .hd-pill { min-height: calc(var(--u)*4.4); font: 600 calc(var(--u)*1.65)/1 var(--f-body); }
.app-shell .settings-v2 .st-sub { gap: 0; }
.app-shell .settings-v2 .st-sub__row { min-height: calc(var(--u)*5.6); padding: calc(var(--u)*.6) 0; }
.app-shell.view-kids .settings-v2 :is(.hdx-select, .st-input, .st-input--framed) { background: #fff; color: var(--kid-dark); border: var(--kid-edge) solid var(--kid-dark); }

/* Many readings on the screensaver: two rows split evenly (4 + 4, 4 + 3), each reading in an equal column,
   the second row centered under the first. */
.app-shell .hd-saver__stats--many { display: flex; flex-wrap: wrap; justify-content: center; gap: min(2.4vh, 20px) 0; width: min(96vw, calc(var(--saver-cols, 4) * min(23vw, 250px))); }
.app-shell .hd-saver__stats--many .hd-saver__stat { flex: 0 0 calc(100% / var(--saver-cols, 4)); padding: 0 8px; box-sizing: border-box; box-shadow: none; }
.app-shell .hd-saver__rooms--many { display: grid; grid-template-columns: repeat(var(--saver-cols, 4), auto); justify-content: center; justify-items: center; }
/* List card: a title, then one line per entity (value or control); long lists scroll inside the card. */
.app-shell .hd-elist { justify-content: flex-start; gap: calc(var(--u)*1); height: 100%; min-height: 0; box-sizing: border-box; cursor: default; }
.app-shell .hd-elist__title { flex: none; font: 750 calc(var(--u)*1.25)/1.2 var(--f-body); letter-spacing: .12em; text-transform: uppercase; opacity: .6; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .hd-elist__empty { margin: 0; font-size: calc(var(--u)*1.5); opacity: .6; }
.app-shell .hd-elist__rows { flex: 1 1 auto; min-height: 0; display: grid; align-content: start; gap: calc(var(--u)*.3); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; margin: 0 calc(var(--u)*-.6); }
.app-shell .hd-elist__rows::-webkit-scrollbar { display: none; }
.app-shell .hd-elist__row { display: flex; align-items: center; gap: calc(var(--u)*.9); min-width: 0; min-height: calc(var(--u)*4); padding: 0 calc(var(--u)*.6); border: 0; border-radius: calc(12px*var(--hd-r,1)); background: none; color: inherit; font: inherit; text-align: left; }
.app-shell .hd-elist__row > .hd-link { flex: 1 1 auto; min-height: calc(var(--u)*4); }
.app-shell .hd-elist__row--value { cursor: pointer; justify-content: space-between; }
.app-shell .hd-elist__row--value .hd-link__name { flex: 1 1 auto; }
.app-shell .hd-elist__row--value:hover, .app-shell .hd-elist__row--value:focus-visible { background: color-mix(in srgb, currentColor 8%, transparent); }
.app-shell .hd-elist__icon { flex: none; display: grid; place-items: center; width: calc(var(--u)*2.6); height: calc(var(--u)*2.6); padding: 0; border: 0; background: none; color: inherit; opacity: .75; cursor: pointer; }
.app-shell .hd-elist__row + .hd-elist__row { box-shadow: 0 -1px 0 color-mix(in srgb, currentColor 9%, transparent); }
.app-shell .hd-elist__row .hd-link__run { height: calc(var(--u)*3.6); justify-content: space-between; padding: 0 calc(var(--u)*.4) 0 0; background: none; color: inherit; font-weight: 600; }
.app-shell .hd-elist__row .hd-link__run svg { order: 2; flex: none; width: calc(var(--u)*3.4); height: calc(var(--u)*3.4); padding: calc(var(--u)*.9); box-sizing: border-box; border-radius: var(--hd-round,50%); background: color-mix(in srgb, currentColor 14%, transparent); }
.app-shell .hd-elist--editing .hd-elist__rows { pointer-events: none; }
.app-shell .hd-elist-editor__item input { flex: 1 1 auto; min-width: 0; }
.app-shell .hd-elist-editor__item button:not(:last-child) { background: rgba(255,255,255,.14); }
.app-shell .hd-elist-editor__item button:disabled { opacity: .35; cursor: default; }
.app-shell .hd-add-tile--list > svg { margin-left: 4px; opacity: .6; }
/* Alarm buttons on its card and on Home's Security card (an option of the alarm panel). */
.app-shell .hd-alarm-buttons { display: flex; flex-wrap: wrap; gap: calc(var(--u)*.6); margin-top: calc(var(--u)*1); }
.app-shell .hd-alarm-buttons button { flex: 1 1 0; min-width: 0; height: calc(var(--u)*4); min-height: 32px; padding: 0 calc(var(--u)*1.2); border: 0; border-radius: var(--hd-pill,99px); background: color-mix(in srgb, currentColor 16%, transparent); color: inherit; font: 600 calc(var(--u)*1.5)/1 var(--f-body); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
.app-shell .hd-alarm-buttons .hd-alarm-buttons__disarm { background: #fff; color: #1d1a17; }
.app-shell .hd-alarm-buttons button:disabled { opacity: .5; cursor: default; }
.app-shell .widget-card .hd-alarm-buttons { position: absolute; z-index: 1; left: 52%; right: 17px; top: 50%; transform: translateY(-50%); flex-direction: column; flex-wrap: nowrap; margin: 0; }
.app-shell .widget-card .hd-alarm-buttons button { flex: none; }
.app-shell .widget-card:has(> .hd-alarm-buttons) .widget-list { display: none; }
/* Half-size devices: icon, name and state in one line; the card's extra controls stay for 1× and up. */
.app-shell .hd-item--small > .device-tile > :not(.device-tile__top, .device-tile__copy, .device-tile__art, .device-tile__lock, .device-tile__confirm, .device-tile__busy) { display: none; }
/* Separators fold what follows them: the title is a button with a chevron (down open, right folded). */
.app-shell .hd-section__fold { flex: none; display: inline-flex; align-items: center; gap: calc(var(--u)*.8); max-width: 70%; padding: 0; border: 0; background: none; color: inherit; font: inherit; letter-spacing: inherit; text-transform: inherit; cursor: pointer; }
.app-shell .hd-section__fold > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .hd-section__fold > svg { flex: none; opacity: .7; transform: rotate(90deg); transition: transform .2s ease; }
.app-shell .hd-section--folded .hd-section__fold > svg { transform: none; }
/* Floor names between the rooms of the Rooms tab ("Group rooms by floor"). */
.app-shell .room-selector__floor { display: block; padding: calc(var(--u)*1.6) calc(var(--u)*1.2) calc(var(--u)*.6); color: var(--ink-3, rgba(255,255,255,.5)); font: 700 calc(var(--u)*1.2)/1.2 var(--f-body); letter-spacing: .12em; text-transform: uppercase; }
.app-shell .room-selector__floor:first-child { padding-top: calc(var(--u)*.4); }
.app-shell .hd-backup-confirm { display: inline-flex; flex-wrap: wrap; gap: calc(var(--u)*.6); justify-content: flex-end; }
/* Folder card and its window. */
.app-shell .hd-folder { width: 100%; height: 100%; text-align: left; font: inherit; cursor: pointer; }
.app-shell .hd-folder .device-tile__top { display: flex; justify-content: space-between; align-items: flex-start; }
.app-shell .hd-folder__arrow { opacity: .55; }
.app-shell .hd-folder-sheet { width: min(1100px, 94vw); max-height: 90vh; display: flex; flex-direction: column; }
.app-shell .hd-folder-sheet__body { flex: 1 1 auto; min-height: 0; overflow-y: auto; padding: calc(var(--u)*.4) calc(var(--u)*.2) calc(var(--u)*1.4); }
.app-shell .hd-folder-sheet__title { display: flex; align-items: center; gap: calc(var(--u)*1.2); min-width: 0; }
.app-shell .hd-folder-sheet__title h2 { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.app-shell .hd-folder-sheet__icon { display: grid; place-items: center; width: calc(var(--u)*4.4); height: calc(var(--u)*4.4); border-radius: var(--hd-round,50%); background: rgba(255,255,255,.12); }
.app-shell .hd-folder-sheet__naming { display: flex; align-items: center; gap: calc(var(--u)*1); flex: 1; min-width: 0; }
.app-shell .hd-folder-sheet__naming input { flex: 1; min-width: 0; height: calc(var(--u)*4.4); padding: 0 calc(var(--u)*1.4); border: 1px solid rgba(255,255,255,.18); border-radius: var(--hd-pill,99px); background: rgba(255,255,255,.08); color: inherit; font: 600 calc(var(--u)*1.8)/1 var(--f-body); }
.app-shell .hd-folder-sheet__empty { margin: calc(var(--u)*2) 0; opacity: .65; text-align: center; }
/* Without the lights button, the arrow of a lit room card stays readable on its light surface. */
.app-shell .room-card--active .room-card__arrow { color: currentColor; border-color: color-mix(in srgb, currentColor 18%, transparent); background: color-mix(in srgb, currentColor 8%, transparent); opacity: .7; }
/* The next days beside the weather in the header (optional); no room for them on phones. */
.app-shell .weather-chip__days { display: inline-flex; align-items: center; gap: calc(var(--u)*1.4); margin-left: calc(var(--u)*.6); padding-left: calc(var(--u)*1.4); border-left: 1px solid color-mix(in srgb, currentColor 22%, transparent); }
.app-shell .weather-chip__days > span { display: inline-flex; align-items: center; gap: calc(var(--u)*.45); white-space: nowrap; }
.app-shell .weather-chip__days small { display: inline !important; text-transform: capitalize; opacity: .75; font-size: calc(var(--u)*1.45); }
.app-shell .weather-chip__days b { font-size: calc(var(--u)*1.65); font-weight: 650; }
.app-shell .weather-chip__days i { font-style: normal; font-size: calc(var(--u)*1.45); opacity: .6; }
@media (max-width: 720px) { .app-shell .weather-chip__days { display: none; } }
/* Recently added: covers in one row (two on a large card), as many as fit. */
.app-shell .hd-recent { display: flex; flex-direction: column; gap: calc(var(--u)*1.2); height: 100%; box-sizing: border-box; }
.app-shell .hd-recent__empty { margin: auto 0; font-size: calc(var(--u)*1.5); opacity: .6; white-space: normal; text-transform: none; }
.app-shell .hd-recent__row { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(calc(var(--u)*9.5), 1fr)); grid-template-rows: 1fr; grid-auto-rows: 0; column-gap: calc(var(--u)*1.2); overflow: hidden; }
.app-shell .hd-recent--tall .hd-recent__row { grid-template-rows: 1fr 1fr; row-gap: calc(var(--u)*1.4); }
.app-shell .hd-recent__item { min-width: 0; min-height: 0; display: flex; flex-direction: column; gap: calc(var(--u)*.4); padding: 0; border: 0; background: none; color: inherit; text-align: left; cursor: pointer; overflow: hidden; }
.app-shell .hd-recent__poster { flex: 1 1 auto; min-height: 0; display: grid; place-items: center; overflow: hidden; border-radius: calc(10px*var(--hd-r,1)); background: rgba(255,255,255,.08); }
.app-shell .hd-recent__poster { position: relative; }
.app-shell .hd-recent__poster img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.app-shell .hd-recent > .widget-card__icon { position: static; flex: none; align-self: flex-start; }
.app-shell .hd-recent__item b { flex: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: calc(var(--u)*1.35); font-weight: 650; }
.app-shell .hd-recent__item small { flex: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: calc(var(--u)*1.15); opacity: .65; }
.app-shell .st-note { margin: calc(var(--u)*.4) 0; color: var(--ink-2); font: 500 calc(var(--u)*1.5)/1.4 var(--f-body); }
/* Nothing in the panel is selected by a long press or a drag: it is a control surface, not a page.
   Fields where people type keep normal selection. */
.app-shell, .app-shell * { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
.app-shell :is(input, textarea, select, [contenteditable="true"]), .app-shell :is(input, textarea, [contenteditable="true"]) * { -webkit-user-select: text; user-select: text; -webkit-touch-callout: default; }
/* Sideways rows fade where there is more to swipe (scrollFades.ts sets data-fade). The tab bar keeps a
   little of its glass at the edge, so its round ends still read as a bar. */
.app-shell [data-fade] { --fade: calc(var(--u)*4.2); --fade-edge: transparent; }
.app-shell .navigation-dock[data-fade] { --fade-edge: rgba(0,0,0,.18); }
.app-shell [data-fade="right"] { -webkit-mask-image: linear-gradient(to right, #000 calc(100% - var(--fade)), var(--fade-edge)); mask-image: linear-gradient(to right, #000 calc(100% - var(--fade)), var(--fade-edge)); }
.app-shell [data-fade="left"] { -webkit-mask-image: linear-gradient(to left, #000 calc(100% - var(--fade)), var(--fade-edge)); mask-image: linear-gradient(to left, #000 calc(100% - var(--fade)), var(--fade-edge)); }
.app-shell [data-fade="both"] { -webkit-mask-image: linear-gradient(to right, var(--fade-edge), #000 var(--fade), #000 calc(100% - var(--fade)), var(--fade-edge)); mask-image: linear-gradient(to right, var(--fade-edge), #000 var(--fade), #000 calc(100% - var(--fade)), var(--fade-edge)); }
.app-shell .hd-detail__choice { flex-wrap: wrap; row-gap: calc(var(--u)*1); }
.app-shell .hd-detail__choice > .hdx-segmented { flex: none; }
/* A Home plan card with a picture is lit like a room with lights on: the picture, as it is, sits on the
   card's paper. The Floor plan page keeps its own look. */
.app-shell .widget-card.fp-card--image { background: var(--paper); color: var(--paper-ink); border-color: transparent; }
.app-shell .widget-card.fp-card--image .widget-card__label { color: var(--paper-ink-2); }
/* Real glass (Glass theme, the Shine option in Settings → Appearance): besides the frosted fill, a pane catches light. A soft sheen falls from the top
   left, the top edge shines and the bottom edge is a touch darker, what is behind gets a little more color
   and the pane floats on a light shadow. Lit cards keep their own fill; only the light and the edges apply. */
.app-shell.theme-glass.hd-shine :where(.room-card, .device-tile, .widget-card, .weather-chip, .navigation-dock, .scene-strip .hd-item > button:first-child) {
  background-image: linear-gradient(135deg, rgba(255,255,255,.13) 0%, rgba(255,255,255,.04) 38%, rgba(255,255,255,0) 60%);
  backdrop-filter: blur(var(--hd-blur,22px)) saturate(1.7) brightness(1.04); -webkit-backdrop-filter: blur(var(--hd-blur,22px)) saturate(1.7) brightness(1.04);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.26), inset 1px 0 0 rgba(255,255,255,.08), inset 0 -1px 0 rgba(0,0,0,.14), 0 10px 28px -12px rgba(0,0,0,.45);
}
/* The same glass on the Settings cards: the full effect on each block, and on the cards inside a block
   (layout choices, sub-groups) only the light and the edges, so shadows never pile up. */
.app-shell.theme-glass.hd-shine .settings-v2 .st-panel {
  background-image: linear-gradient(135deg, rgba(255,255,255,.13) 0%, rgba(255,255,255,.04) 38%, rgba(255,255,255,0) 60%);
  backdrop-filter: blur(var(--hd-blur,22px)) saturate(1.7) brightness(1.04); -webkit-backdrop-filter: blur(var(--hd-blur,22px)) saturate(1.7) brightness(1.04);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.26), inset 1px 0 0 rgba(255,255,255,.08), inset 0 -1px 0 rgba(0,0,0,.14), 0 10px 28px -12px rgba(0,0,0,.45);
}
.app-shell.theme-glass.hd-shine .settings-v2 :is(.lp-option, .st-sub) {
  background-image: linear-gradient(135deg, rgba(255,255,255,.1) 0%, rgba(255,255,255,0) 50%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.2), inset 0 -1px 0 rgba(0,0,0,.12);
}
.app-shell.theme-glass.hd-shine :where(.room-card--active, .device-tile--active) { background-image: linear-gradient(135deg, rgba(255,255,255,.35) 0%, rgba(255,255,255,0) 55%); }
/* The player over the panel like the screensaver: frosted glass with the album's colors glowing softly
   through, instead of a solid dark page. */
.app-shell .hd-player__bg i { opacity: .55; }
.app-shell .hd-player__bg::after { background: linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.35)); }
/* Phones: everything fits the visible screen (the browser's bars left out), without scrolling. */
@media (max-width: 720px) {
  .app-shell .hd-player { --u: clamp(4.6px, min(calc(var(--hd-vh, 1vh)*.82), 1.9vw), 9px); }
  .app-shell .hd-player__art { width: min(calc(var(--hd-vh, 1vh)*30), 74vw); }
  .app-shell .hd-player__wrap { gap: calc(var(--u)*2); }
  .app-shell .hd-player__scroll { padding-top: calc(var(--u)*8 + env(safe-area-inset-top, 0px)); padding-bottom: calc(var(--u)*3 + env(safe-area-inset-bottom, 0px)); }
}

/* ---------- Vehicle card (Pro) ---------- */
.app-shell .hd-vehicle { --vc: #4f8cff; display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; gap: calc(var(--u)*1.2); text-align: left; cursor: pointer; }
.app-shell .hd-vehicle__art { position: relative; flex: none; width: calc(var(--u)*7.2); height: calc(var(--u)*7.2); min-width: 50px; min-height: 50px; display: grid; place-items: center; }
.app-shell .hd-vehicle__ring { position: absolute; inset: 0; width: 100%; height: 100%; color: currentColor; }
.app-shell .hd-vehicle__ring circle { transition: stroke-dasharray .8s ease; }
.app-shell .hd-vehicle__icon { width: 64%; height: 64%; display: grid; place-items: center; border-radius: var(--hd-round, 50%); background: var(--vc); color: var(--vc-ink, #fff); box-shadow: 0 0 0 1px var(--vc-edge, transparent), 0 4px 14px color-mix(in srgb, var(--vc) 40%, transparent); }
.app-shell .hd-vehicle__bolt { position: absolute; right: -2px; bottom: -2px; width: 34%; height: 34%; display: grid; place-items: center; border-radius: 50%; background: #ffd60a; color: #2a2110; box-shadow: 0 0 0 2px rgba(0,0,0,.25); }
.app-shell.hd-motion .hd-vehicle--charging .hd-vehicle__ring { animation: hd-vehicle-pulse 2.4s ease-in-out infinite; }
@keyframes hd-vehicle-pulse { 50% { filter: drop-shadow(0 0 6px var(--vc)); } }
.app-shell .hd-vehicle__copy { display: flex; flex-direction: column; gap: calc(var(--u)*.35); min-width: 0; width: 100%; }
.app-shell .hd-vehicle__copy strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 650 calc(var(--u)*1.75)/1.2 var(--f-body); }
.app-shell .hd-vehicle__level { font: 300 calc(var(--u)*2.8)/1 var(--f-display); letter-spacing: -.02em; font-variant-numeric: tabular-nums; }
.app-shell .hd-vehicle__status { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ink-2); font: 500 calc(var(--u)*1.4)/1.3 var(--f-body); }
.app-shell .device-tile--active.hd-vehicle .hd-vehicle__status, .app-shell .hd-vehicle.device-tile--active .hd-vehicle__chips { color: var(--paper-ink-2); }
.app-shell .hd-vehicle__chips { display: flex; flex-wrap: wrap; gap: calc(var(--u)*.6); margin-top: calc(var(--u)*.6); color: var(--ink-2); }
.app-shell .hd-vehicle__chips span { display: inline-flex; align-items: center; gap: 5px; height: calc(var(--u)*3); min-height: 24px; padding: 0 calc(var(--u)*1); border-radius: var(--hd-pill, 99px); background: rgba(255,255,255,.1); font: 600 calc(var(--u)*1.3)/1 var(--f-body); white-space: nowrap; }
.app-shell .hd-vehicle--wide { flex-direction: row; align-items: center; gap: calc(var(--u)*2.4); }
.app-shell .hd-vehicle--wide .hd-vehicle__art { width: calc(var(--u)*12); height: calc(var(--u)*12); max-width: 42%; aspect-ratio: 1; }
.app-shell .hd-vehicle--wide .hd-vehicle__level { font-size: calc(var(--u)*4); }
.app-shell .hd-vehicle--wide .hd-vehicle__copy strong { font-size: calc(var(--u)*2.1); }
.app-shell .hd-vehicle--tall { flex-direction: column; justify-content: center; align-items: center; text-align: center; }
.app-shell .hd-vehicle--tall .hd-vehicle__art { width: min(calc(var(--u)*18), 60%); height: auto; aspect-ratio: 1; max-width: none; }
.app-shell .hd-vehicle--tall .hd-vehicle__copy { align-items: center; }
.app-shell .hd-vehicle--tall .hd-vehicle__chips { justify-content: center; }
.app-shell .hd-vehicle--tall .hd-vehicle__level { font-size: calc(var(--u)*5); }
.app-shell .hd-item--small .hd-vehicle { flex-direction: row; align-items: center; }
.app-shell .hd-item--small .hd-vehicle .hd-vehicle__art { width: calc(var(--u)*4.6); height: calc(var(--u)*4.6); min-width: 36px; min-height: 36px; }
.app-shell .hd-item--small .hd-vehicle .hd-vehicle__level { font-size: calc(var(--u)*1.8); }
.app-shell .hd-item--small .hd-vehicle .hd-vehicle__status { display: none; }
/* The details and the editor. */
.app-shell .hd-vehicle-sheet__hero { display: flex; align-items: center; gap: calc(var(--u)*2.4); margin-bottom: calc(var(--u)*2); }
.app-shell .hd-vehicle-sheet__hero .hd-vehicle__art { width: 132px; height: 132px; }
.app-shell .hd-vehicle-sheet__hero b { display: block; font: 300 calc(var(--u)*6)/1 var(--f-display); letter-spacing: -.03em; }
.app-shell .hd-vehicle-sheet__hero span { color: var(--ink-2); font: 500 calc(var(--u)*1.7)/1.4 var(--f-body); }
.app-shell .hd-vehicle-sheet__controls { display: flex; flex-wrap: wrap; gap: calc(var(--u)*1); margin-bottom: calc(var(--u)*1.6); }
.app-shell .hd-pill--on { background: var(--on, #f5c542); color: var(--on-ink, #2a2110); }
.app-shell .hd-vehicle-sheet__rows { display: flex; flex-direction: column; }
.app-shell .hd-vehicle-sheet__row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: calc(var(--u)*1.2); padding: calc(var(--u)*1.3) calc(var(--u)*.4); border: 0; border-top: 1px solid var(--line); background: none; color: inherit; text-align: left; cursor: pointer; font: 500 calc(var(--u)*1.6)/1.3 var(--f-body); }
.app-shell .hd-vehicle-sheet__row b { font-weight: 650; text-align: right; }
.app-shell .hd-vehicle-edit__naming { display: flex; align-items: center; gap: calc(var(--u)*1.2); margin-bottom: calc(var(--u)*1.6); }
.app-shell .hd-vehicle-edit__naming input { flex: 1; min-width: 0; height: calc(var(--u)*5); min-height: 40px; padding: 0 calc(var(--u)*1.4); border: 1px solid var(--line); border-radius: calc(var(--u)*1.4*var(--hd-r,1)); background: rgba(255,255,255,.06); color: inherit; font: 600 calc(var(--u)*1.8)/1 var(--f-body); }
.app-shell .hd-vehicle-edit__row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr); align-items: center; gap: calc(var(--u)*1.4); padding: calc(var(--u)*1) 0; border-top: 1px solid var(--line); font: 600 calc(var(--u)*1.55)/1.3 var(--f-body); }
.app-shell .hd-vehicle-edit__row--stack { grid-template-columns: minmax(0, 1fr); }
.app-shell .hd-vehicle-edit__row--stack > :last-child { max-width: 100%; overflow-x: auto; scrollbar-width: none; }
.app-shell .hd-vehicle-edit__row > span { display: flex; flex-direction: column; gap: 3px; }
.app-shell .hd-vehicle-edit__row > span:has(svg) { flex-direction: row; align-items: center; gap: calc(var(--u)*.8); }
.app-shell .hd-vehicle-edit__row small { color: var(--ink-2); font-weight: 500; font-size: calc(var(--u)*1.3); }
.app-shell .hd-vehicle-edit__now { grid-column: 2; margin-top: -4px; }
.app-shell .hd-vehicle-edit__colors { display: flex; flex-wrap: wrap; gap: calc(var(--u)*.8); }
.app-shell .hd-vehicle-edit__colors button { width: calc(var(--u)*3.6); height: calc(var(--u)*3.6); min-width: 28px; min-height: 28px; border: 0; border-radius: var(--hd-round, 50%); cursor: pointer; box-shadow: inset 0 0 0 2px rgba(255,255,255,.15); }
.app-shell .hd-vehicle-edit__colors button[aria-checked="true"] { box-shadow: 0 0 0 3px #fff; }
.app-shell .hd-vehicle-edit__title { margin: calc(var(--u)*2.4) 0 0; font: 650 calc(var(--u)*1.9)/1.2 var(--f-body); }
.app-shell .hd-vehicle-edit__hint { margin: calc(var(--u)*.6) 0 calc(var(--u)*1); color: var(--ink-2); font: 500 calc(var(--u)*1.4)/1.45 var(--f-body); }
@media (max-width: 720px) { .app-shell .hd-vehicle-edit__row { grid-template-columns: minmax(0, 1fr); } .app-shell .hd-vehicle-edit__now { grid-column: 1; } }

/* ---------- Floor plan: rooms of several rectangles, names, per-room spots ---------- */
.app-shell .fp-room__spots { position: absolute; z-index: 2; pointer-events: none; }
.app-shell .fp-room__spots > * { pointer-events: auto; }
/* A room of several parts paints nothing itself: its floor and walls are one shape drawn over it. */
.app-shell .fp-room.fp-room--joined::before { inset: 0; border: 0; border-radius: 0; background: none !important; box-shadow: none !important; }
.app-shell .fp-room--joined.fp-room--motion::after { content: none; }
/* In Edit mode a room of several parts shows one dashed outline around its whole shape (no lines across it). */
.app-shell .fp--editing .fp-walls .fp-walls__line, .app-shell .fp--editing.fp--image .fp-walls .fp-walls__line { stroke: rgba(255,255,255,.7); stroke-dasharray: 6 4; }
.app-shell .fp--editing .fp-walls .fp-walls__floor { fill: rgba(255,255,255,.06); }
.app-shell .fp-walls { position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.app-shell .fp-walls__line { fill: none; stroke: rgba(255,255,255,.26); stroke-width: 1.5px; stroke-linecap: square; vector-effect: non-scaling-stroke; transition: stroke .4s ease; }
.app-shell .fp-walls__floor { fill: rgba(255,255,255,.035); stroke: none; transition: fill .6s ease; }
.app-shell .fp-walls--lit .fp-walls__line { stroke: rgba(255,214,150, calc(.35 + .4 * var(--fp-glow))); }
.app-shell .fp-walls--lit .fp-walls__floor { fill: rgba(255,196,110, calc(.08 + .22 * var(--fp-glow))); }
.app-shell .fp-walls--open .fp-walls__line { stroke: rgba(255,107,94,.85); }
.app-shell .fp--image .fp-walls__line { stroke: transparent; }
.app-shell .fp--image .fp-walls__floor { fill: transparent; }
.app-shell .fp--image .fp-walls--lit .fp-walls__floor { fill: rgba(255,196,110, calc(.1 + .2 * var(--fp-glow))); }
.app-shell.view-kids .fp-walls__line { stroke: var(--kid-dark, #231b3d); stroke-width: 3px; }
.app-shell.view-kids .fp-walls__floor { fill: rgba(255,255,255,.55); }
.app-shell .fp-card .fp-walls__line { stroke-width: 1px; }
.app-shell .fp-card .fp-room__spots { display: block; }
.app-shell .fp-room__name { position: absolute; z-index: 3; translate: -50% -50%; display: inline-flex; align-items: baseline; gap: 6px; max-width: none; overflow: visible; color: var(--ink); font: 650 clamp(11px, calc(var(--fp-unit)*.56), 17px)/1.15 var(--f-body); white-space: nowrap; text-shadow: 0 1px 6px rgba(0,0,0,.45); pointer-events: none !important; }
.app-shell .fp-room__name small { color: var(--ink-2); font-weight: 550; font-size: .86em; font-variant-numeric: tabular-nums; }
.app-shell .fp--editing .fp-room__name { pointer-events: auto !important; cursor: grab; padding: 2px 8px; border-radius: var(--hd-pill, 99px); outline: 1.5px dashed rgba(255,255,255,.5); background: rgba(0,0,0,.25); touch-action: none; }
.app-shell.view-kids .fp-room__name { color: var(--kid-dark, #231b3d); text-shadow: none; }
.app-shell .fp--editing .fp-room__head > span:first-child { flex: 1; }
.app-shell .fp-room__add, .app-shell .fp-room__remove { flex: none; width: 22px; height: 22px; display: grid; place-items: center; padding: 0; border: 0; border-radius: 50%; background: rgba(255,255,255,.2); color: var(--ink); cursor: pointer; font: 700 15px/1 var(--f-body); }
.app-shell .fp-room__add:hover { background: rgba(255,255,255,.32); }
.app-shell .fp-room__remove { position: absolute; z-index: 3; top: 4px; right: 4px; background: #ff6b5e; color: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.4); }

/* ---------- Text size on this device: a slider and a preview (Settings → This device) ---------- */
/* The screensaver keeps its own size (Settings → Screensaver), whatever the text size here. */
.app-shell .hd-saver { --hd-font: 1; }
.app-shell .st-textsize__body { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: calc(var(--u)*2.4); padding: 0 0 calc(var(--u)*1.6); }
.app-shell .st-textsize__control { display: flex; align-items: center; gap: calc(var(--u)*1.2); flex-wrap: wrap; }
.app-shell .st-textsize__control input { flex: 1; min-width: 140px; accent-color: var(--on, #f5c542); }
.app-shell .st-textsize__a { color: var(--ink-2); font-weight: 650; line-height: 1; }
.app-shell .st-textsize__a--small { font-size: 13px; }
.app-shell .st-textsize__a--large { font-size: 22px; }
.app-shell .st-textsize__preview { display: grid; grid-template-columns: repeat(2, calc(var(--u)*17)); gap: calc(var(--u)*1.2); pointer-events: none; }
.app-shell .st-textsize__preview .device-tile { height: calc(var(--u)*15); min-height: 0; }
@media (max-width: 720px) { .app-shell .st-textsize__body { grid-template-columns: minmax(0, 1fr); } .app-shell .st-textsize__preview { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
/* A cover button armed by "Ask before switching": a second tap on it acts. */
.app-shell :is(.device-controls--cover, .tile-cover) button.is-confirming { background: var(--on); color: var(--on-ink); box-shadow: 0 0 0 2px color-mix(in srgb, var(--on) 45%, transparent); }
`;
