import type { TranslationKey } from "../i18n";
import type { HomeDeckKidsScene } from "../types/config";

/** The scenes of the Kids layout, in the order they are offered (Settings and the first setup). */
export const KIDS_SCENES: Array<[HomeDeckKidsScene, TranslationKey]> = [["sky", "kidsSky"], ["ocean", "kidsOcean"], ["space", "kidsSpace"], ["candy", "kidsCandy"], ["fairy", "kidsFairy"], ["road", "kidsRoad"]];

// The animated scenes behind the Kids layout. Plain shapes (no emoji, no images), so they stay sharp on
// any screen and weigh nothing; the motion lives in theme-kids.ts and stops for reduced motion.

/** A fixed scatter (the same on every load), so the scenes never jump around between renders. */
const spot = (n: number, a: number, b: number) => ((n * a) % b);

const CLOUD = "M25 60a20 20 0 0 1 4-39.6A28 28 0 0 1 82 18a22 22 0 0 1 33 20 18 18 0 0 1-4 35.6H29A16 16 0 0 1 25 60z";

/** Outlined like the cards: the same near-black edge everywhere. */
const EDGE = { stroke: "#231b3d", strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Balloon() {
  return <svg className="kd-balloon" viewBox="0 0 100 150">
    <path d="M38 104 44 122M62 104 56 122" fill="none" {...EDGE} strokeWidth={2.5} />
    <path d="M50 4C24 4 8 24 8 46c0 26 26 44 34 58h16c8-14 34-32 34-58C92 24 76 4 50 4z" fill="#ff6b6b" {...EDGE} />
    <path d="M50 4c-10 0-18 20-18 42 0 24 6 44 10 58h16c4-14 10-34 10-58C68 24 60 4 50 4z" fill="#ffd43b" {...EDGE} />
    <path d="M50 4c-3 0-6 20-6 42s2 44 4 58h4c2-14 4-36 4-58S53 4 50 4z" fill="#4dabf7" {...EDGE} strokeWidth={2} />
    <ellipse cx="28" cy="30" fill="#fff" opacity=".6" rx="7" ry="11" transform="rotate(20 28 30)" />
    <rect fill="#c98a4b" height="18" rx="4" width="22" x="39" y="122" {...EDGE} />
  </svg>;
}

function Sky() {
  return <>
    <span className="kd-sun"><i /></span>
    {[0, 1, 2, 3].map((n) => <svg className={`kd-cloud kd-cloud--${n}`} key={n} viewBox="5 -2 128 80"><path d={CLOUD} /></svg>)}
    <Balloon />
    {[0, 1, 2].map((n) => <svg className={`kd-bird kd-bird--${n}`} key={n} viewBox="0 0 40 16"><path d="M2 12C8 4 14 4 20 11 26 4 32 4 38 12" /></svg>)}
    <svg className="kd-hills" preserveAspectRatio="none" viewBox="0 0 1200 220">
      <path className="kd-hill kd-hill--back" d="M0 140C180 60 360 60 520 120S860 40 1200 110V220H0z" />
      <path className="kd-hill kd-hill--front" d="M0 170C220 110 420 200 640 150S1000 120 1200 160V220H0z" />
    </svg>
  </>;
}

function Ocean() {
  return <>
    <span className="kd-light" />
    {Array.from({ length: 14 }, (_, n) => <i className="kd-bubble" key={n} style={{ left: `${4 + n * 6.8}%`, width: `${1.4 + spot(n, 7, 4) * 0.6}vmin`, animationDuration: `${9 + spot(n, 5, 7) * 1.3}s`, animationDelay: `${-n * 1.7}s` }} />)}
    {[0, 1, 2].map((n) => <svg className={`kd-fish kd-fish--${n}`} key={n} viewBox="0 0 60 34"><path d="M8 17C18 2 40 2 48 17 40 32 18 32 8 17zM48 17l11-11v22z" /><circle cx="20" cy="14" r="2.6" /></svg>)}
    <svg className="kd-jelly" viewBox="0 0 80 110">
      <path d="M22 60c0 16-6 22-6 34M34 62c0 18 4 26 2 38M46 62c0 18-4 26-2 38M58 60c0 16 6 22 6 34" fill="none" stroke="#f783ac" strokeLinecap="round" strokeWidth="5" />
      <path d="M8 58C8 30 24 12 40 12s32 18 32 46c-8 6-16 2-22 6-6-4-14-4-20 0-6-4-14 0-22-6z" fill="#faa2c1" {...EDGE} />
      <ellipse cx="28" cy="32" fill="#fff" opacity=".65" rx="6" ry="9" transform="rotate(25 28 32)" />
      <circle cx="32" cy="44" fill="#231b3d" r="3.5" /><circle cx="48" cy="44" fill="#231b3d" r="3.5" />
      <path d="M35 52q5 4 10 0" fill="none" {...EDGE} strokeWidth={2.5} />
    </svg>
    <svg className="kd-starfish" viewBox="0 0 100 100"><path d="M50 6l12 30 32 2-25 20 9 32-28-18-28 18 9-32L6 38l32-2z" fill="#ff922b" {...EDGE} /><circle cx="42" cy="46" fill="#231b3d" r="3.5" /><circle cx="58" cy="46" fill="#231b3d" r="3.5" /><path d="M44 56q6 5 12 0" fill="none" {...EDGE} strokeWidth={2.5} /></svg>
    <svg className="kd-weed kd-weed--0" viewBox="0 0 40 160"><path d="M20 160C4 130 34 110 18 80S30 30 20 0" /></svg>
    <svg className="kd-weed kd-weed--1" viewBox="0 0 40 160"><path d="M20 160C36 128 6 112 22 82S10 34 20 0" /></svg>
    <svg className="kd-waves" preserveAspectRatio="none" viewBox="0 0 1200 140">
      <path className="kd-wave kd-wave--back" d="M0 60Q150 20 300 60T600 60T900 60T1200 60V140H0z" />
      <path className="kd-wave kd-wave--front" d="M0 90Q150 50 300 90T600 90T900 90T1200 90V140H0z" />
    </svg>
  </>;
}

function Space() {
  return <>
    {Array.from({ length: 28 }, (_, n) => <i className="kd-star" key={n} style={{ left: `${spot(n, 37, 100)}%`, top: `${spot(n, 53, 90)}%`, width: `${0.6 + (n % 3) * 0.4}vmin`, animationDuration: `${2 + (n % 5) * 0.7}s`, animationDelay: `${-n * 0.37}s` }} />)}
    <span className="kd-planet"><i /></span>
    <span className="kd-moon" />
    <span className="kd-comet" />
    <svg className="kd-ufo" viewBox="0 0 140 90">
      <path d="M46 40a24 22 0 0 1 48 0z" fill="#a5d8ff" {...EDGE} />
      <ellipse cx="60" cy="28" fill="#fff" opacity=".7" rx="5" ry="7" transform="rotate(20 60 28)" />
      <ellipse cx="70" cy="48" fill="#b197fc" rx="62" ry="16" {...EDGE} />
      <ellipse cx="70" cy="44" fill="#d0bfff" rx="44" ry="7" />
      {[30, 50, 70, 90, 110].map((x, n) => <circle className="kd-ufo__light" cx={x} cy={52} fill="#ffd43b" key={x} r="5" style={{ animationDelay: `${n * 0.2}s` }} {...EDGE} strokeWidth={2} />)}
    </svg>
    <svg className="kd-rocket" viewBox="0 0 40 80"><path className="kd-rocket__body" d="M20 2C32 14 34 34 30 56H10C6 34 8 14 20 2z" /><circle className="kd-rocket__window" cx="20" cy="26" r="6" /><path className="kd-rocket__fin" d="M10 44 2 62h8zM30 44l8 18h-8z" /><path className="kd-rocket__flame" d="M12 58h16l-8 20z" /></svg>
  </>;
}

function Candy() {
  return <>
    <svg className="kd-rainbow" viewBox="0 0 400 210">
      {["#ff6b6b", "#ffa94d", "#ffd43b", "#69db7c", "#4dabf7", "#b197fc"].map((color, n) => <path d={`M${20 + n * 16} 200a${180 - n * 16} ${180 - n * 16} 0 0 1 ${360 - n * 32} 0`} fill="none" key={color} stroke={color} strokeLinecap="round" strokeWidth="15" />)}
    </svg>
    {[0, 1].map((n) => <svg className={`kd-cloud kd-cloud--candy kd-cloud--${n}`} key={n} viewBox="5 -2 128 80"><path d={CLOUD} /></svg>)}
    {Array.from({ length: 18 }, (_, n) => <i className="kd-confetti" key={n} style={{ left: `${spot(n, 41, 100)}%`, background: `hsl(${n * 47} 90% 65%)`, animationDuration: `${9 + (n % 6) * 1.5}s`, animationDelay: `${-n * 1.1}s` }} />)}
    {[0, 1].map((n) => <svg className={`kd-lolly kd-lolly--${n}`} key={n} viewBox="0 0 80 170">
      <rect fill="#fff" height="100" rx="4" width="8" x="36" y="66" {...EDGE} />
      <circle cx="40" cy="40" fill={n ? "#b197fc" : "#ff8fab"} r="34" {...EDGE} />
      <path d="M40 40m-6 0a6 6 0 1 1 12 0 12 12 0 1 1-24 0 18 18 0 1 1 36 0 24 24 0 1 1-48 0" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="5" />
    </svg>)}
    {[0, 1, 2].map((n) => <svg className={`kd-candy kd-candy--${n}`} key={n} viewBox="0 0 90 44">
      <path d="M22 22 4 8v28zM68 22l18-14v28z" fill={["#ffd43b", "#63e6a4", "#74c0fc"][n]} {...EDGE} />
      <rect fill={["#ff6b6b", "#ff8fab", "#b197fc"][n]} height="30" rx="15" width="50" x="20" y="7" {...EDGE} />
      <ellipse cx="34" cy="16" fill="#fff" opacity=".6" rx="7" ry="3.5" />
    </svg>)}
    {[0, 1, 2, 3].map((n) => <svg className={`kd-heart kd-heart--${n}`} key={n} viewBox="0 0 32 30"><path d="M16 29S1 19 1 9a7.5 7.5 0 0 1 15-2 7.5 7.5 0 0 1 15 2c0 10-15 20-15 20z" /></svg>)}
  </>;
}


/** A four-point sparkle. */
const SPARKLE = "M12 0c1 6 5 10 12 12-7 2-11 6-12 12-1-6-5-10-12-12 7-2 11-6 12-12z";

function Butterfly({ n }: { n: number }) {
  const [a, b] = [["#ff8fab", "#ffd1e0"], ["#b197fc", "#e5dbff"], ["#ffa94d", "#ffe8cc"]][n % 3];
  return <svg className={`kd-butterfly kd-butterfly--${n}`} viewBox="0 0 60 50">
    <g className="kd-butterfly__wing kd-butterfly__wing--l"><path d="M30 25C22 6 4 4 6 18c1 8 10 10 24 7z" fill={a} {...EDGE} strokeWidth={2.5} /><path d="M30 27C18 30 10 40 16 45c6 4 12-6 14-18z" fill={b} {...EDGE} strokeWidth={2.5} /></g>
    <g className="kd-butterfly__wing kd-butterfly__wing--r"><path d="M30 25C38 6 56 4 54 18c-1 8-10 10-24 7z" fill={a} {...EDGE} strokeWidth={2.5} /><path d="M30 27C42 30 50 40 44 45c-6 4-12-6-14-18z" fill={b} {...EDGE} strokeWidth={2.5} /></g>
    <rect fill="#231b3d" height="24" rx="3" width="5" x="27.5" y="14" />
    <path d="M29 14c-2-5-5-7-8-8M31 14c2-5 5-7 8-8" fill="none" stroke="#231b3d" strokeLinecap="round" strokeWidth="2" />
  </svg>;
}

function Castle() {
  return <svg className="kd-castle" viewBox="0 0 220 200">
    {[[34, "#ff8fab"], [186, "#b197fc"]].map(([x, flag]) => <g className="kd-castle__flag" key={x as number} style={{ transformOrigin: `${x}px 18px` }}><path d={`M${x} 18v-16`} stroke="#231b3d" strokeWidth={3} /><path d={`M${x} 2l18 6-18 6z`} fill={flag as string} {...EDGE} strokeWidth={2} /></g>)}
    <path d="M16 70 34 20 52 70z" fill="#b197fc" {...EDGE} /><path d="M168 70 186 20 204 70z" fill="#ff8fab" {...EDGE} />
    <path d="M86 60 110 6l24 54z" fill="#ffd43b" {...EDGE} />
    <rect fill="#ffd6ec" height="128" rx="6" width="40" x="14" y="68" {...EDGE} />
    <rect fill="#ffd6ec" height="128" rx="6" width="40" x="166" y="68" {...EDGE} />
    <rect fill="#fff0f6" height="140" rx="6" width="56" x="82" y="56" {...EDGE} />
    <path d="M50 110h120v86H50z" fill="#ffc2dd" {...EDGE} />
    {[50, 66, 82, 122, 138, 154].map((x) => <rect fill="#ffc2dd" height="12" key={x} width="12" x={x} y="100" {...EDGE} strokeWidth={2.5} />)}
    <path d="M94 196v-34a16 16 0 0 1 32 0v34z" fill="#b197fc" {...EDGE} />
    {[[34, 100], [186, 100], [110, 92]].map(([x, y]) => <path d={`M${x} ${y + 10}c-8-6-8-14 0-12 8-2 8 6 0 12z`} fill="#ff6b9a" key={x} {...EDGE} strokeWidth={2} />)}
  </svg>;
}

function Fairy() {
  return <>
    <span className="kd-glow" />
    {Array.from({ length: 16 }, (_, n) => <svg className="kd-sparkle" key={n} style={{ left: `${spot(n, 43, 96)}%`, top: `${spot(n, 29, 60)}%`, width: `${1.6 + (n % 3) * 0.9}vmin`, animationDuration: `${2 + (n % 4) * 0.6}s`, animationDelay: `${-n * 0.45}s` }} viewBox="0 0 24 24"><path d={SPARKLE} /></svg>)}
    <svg className="kd-hills kd-hills--fairy" preserveAspectRatio="none" viewBox="0 0 1200 220">
      <path className="kd-hill kd-hill--back" d="M0 130C200 70 380 80 560 120S900 50 1200 100V220H0z" />
      <path className="kd-hill kd-hill--front" d="M0 170C240 120 440 200 660 160S1000 130 1200 165V220H0z" />
    </svg>
    <Castle />
    {[0, 1, 2].map((n) => <Butterfly key={n} n={n} />)}
    {[0, 1, 2, 3].map((n) => <svg className={`kd-heart kd-heart--${n}`} key={n} viewBox="0 0 32 30"><path d="M16 29S1 19 1 9a7.5 7.5 0 0 1 15-2 7.5 7.5 0 0 1 15 2c0 10-15 20-15 20z" /></svg>)}
  </>;
}

function Car({ n }: { n: number }) {
  const [body, roof] = [["#ff6b6b", "#ffc9c9"], ["#ffd43b", "#fff3bf"], ["#4dabf7", "#d0ebff"], ["#63e6a4", "#d3f9e6"]][n % 4];
  return <svg className={`kd-car kd-car--${n}`} viewBox="0 0 120 64">
    <g className="kd-car__body">
      <path d="M14 30h18l14-18h34l16 18h10a8 8 0 0 1 8 8v8a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4v-8a8 8 0 0 1 8-8z" fill={body} {...EDGE} />
      <path d="M38 30l10-13h14v13zM68 30V17h11l12 13z" fill={roof} {...EDGE} strokeWidth={2.5} />
      <circle cx="108" cy="38" fill="#fff3bf" r="3" {...EDGE} strokeWidth={2} />
      <path d="M18 36h8" stroke="#fff" strokeLinecap="round" strokeOpacity=".7" strokeWidth="3" />
    </g>
    {[30, 92].map((x) => <g className="kd-car__wheel" key={x} style={{ transformOrigin: `${x}px 50px` }}><circle cx={x} cy="50" fill="#2b2140" r="11" {...EDGE} /><circle cx={x} cy="50" fill="#dee2e6" r="5" /><path d={`M${x - 5} 50h10M${x} 45v10`} stroke="#2b2140" strokeWidth="2" /></g>)}
  </svg>;
}

function Road() {
  return <>
    <span className="kd-sun kd-sun--road"><i /></span>
    {[0, 1, 2].map((n) => <svg className={`kd-cloud kd-cloud--${n}`} key={n} viewBox="5 -2 128 80"><path d={CLOUD} /></svg>)}
    <svg className="kd-hills kd-hills--road" preserveAspectRatio="none" viewBox="0 0 1200 220">
      <path className="kd-hill kd-hill--back" d="M0 140C200 80 400 90 600 130S950 70 1200 120V220H0z" />
      <path className="kd-hill kd-hill--front" d="M0 175C240 130 460 200 680 165S1000 140 1200 170V220H0z" />
    </svg>
    {[0, 1, 2, 3, 4].map((n) => <svg className={`kd-tree kd-tree--${n}`} key={n} viewBox="0 0 40 60"><rect fill="#c98a4b" height="20" rx="3" width="8" x="16" y="38" {...EDGE} strokeWidth={2.5} /><circle cx="20" cy="24" fill={n % 2 ? "#51cf66" : "#69db7c"} r="17" {...EDGE} strokeWidth={2.5} /></svg>)}
    <div className="kd-road"><i className="kd-road__lines" /></div>
    {[0, 1, 2, 3].map((n) => <Car key={n} n={n} />)}
  </>;
}

export function KidsScene({ scene }: { scene: HomeDeckKidsScene }) {
  return <div aria-hidden="true" className={`kd-scene kd-scene--${scene}`}>
    {scene === "ocean" ? <Ocean /> : scene === "space" ? <Space /> : scene === "candy" ? <Candy /> : scene === "fairy" ? <Fairy /> : scene === "road" ? <Road /> : <Sky />}
  </div>;
}
