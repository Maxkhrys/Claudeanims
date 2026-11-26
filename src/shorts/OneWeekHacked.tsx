import React from "react";
import { AbsoluteFill, Audio, Loop, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { z } from "zod";
import { springs } from "../theme";
import { createCues, sp, type Word } from "../lib/timing";
import { Sfx } from "../components";
import transcript from "../../public/shorts/oneweek/words.json";
import { ShortCaptions, SHORT_H, SHORT_W } from "./kit3d";

/*
 * "One week... The FBI. The CIA. The US Treasury. All hacked." (about 44 s).
 * Facts (26 Nov 2026): FBI NCIC crime-database breach reported 20-21 Nov (CNN, AP, ABC); breach of an unclassified
 * CIA/ODNI system reported (NYT, CNN: no classified systems hit); Treasury's FinCEN disclosed unauthorized access
 * to "a limited subset of its systems" on Tue 24 Nov and took some offline (IBT/Yahoo citing AP + ABC, Cryptopolitan).
 * White House cyber chief out the same week (outlets differ: fired vs stepping down, so we only say "GONE").
 * Nobody has been named and nobody has claimed it. Nothing on screen says data was stolen.
 * Same noir evidence board as JudgeGTA6 / WalksFreeGTA6 / AiBankHeist.
 * Hook: glitch shock on frame 0, three agency seals slam in, "HACKED" stamp, then "WHO?".
 * Narration: public/shorts/oneweek/vo.mp3 (Max's Gemini take, pauses capped at 0.3 s, 4% faster), words.json.
 * Seals are drawn stand-ins (real seal files can't be fetched from the cloud container).
 * Safe zone for key text: x 60..918, y 192..1536; captions small at about 60% down.
 */

loadFont({ family: "Anton", weight: "400", url: staticFile("fonts/Anton-400.woff2") });

export const oneWeekSchema = z.object({ showCaptions: z.boolean() });
export const ONE_WEEK_FRAMES = 1335;

const WORDS = transcript.words as Word[];
const FPS = 30;
const CUE = createCues(WORDS, FPS);
const c = (w: string, n = 0, o = 0) => CUE.at(w, n, o);

const ANTON = `"Anton", "Bebas Neue", sans-serif`;
const MONO = `"JetBrains Mono", monospace`;
const PINK = "#FF2BD6";
const TEAL = "#22E6FF";
const SUN = "#FFD23F";
const RED = "#E8283C";
const PAPER = "#ECE4D2";
const INK = "#141414";
const GREEN = "#39FF88";
const NAVY = "#0c2350";
const GOLD = "#d9a933";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const ramp = (f: number, a: number, d = 10) => clamp01((f - a) / d);
const usePop = (at: number, cfg = springs.pop) => {
  const f = useCurrentFrame();
  return f < at ? 0 : sp(f, FPS, at, cfg);
};
const rndAt = (n: number, f: number) => {
  const x = Math.sin(n * 127.1 + f * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ------------------------------------------------------------------ board pieces */

const SvgDefs: React.FC = () => (
  <defs>
    <filter id="ow-cork" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".45" numOctaves="4" seed="12" />
      <feColorMatrix values="0 0 0 0 .2 0 0 0 0 .13 0 0 0 0 .08 0 0 0 .85 0" />
      <feComposite in2="SourceGraphic" operator="in" />
    </filter>
    <filter id="ow-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="10" result="a" />
      <feMerge>
        <feMergeNode in="a" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="ow-blur">
      <feGaussianBlur stdDeviation="10" />
    </filter>
    <radialGradient id="ow-spot" cx=".5" cy=".42" r=".7">
      <stop offset=".35" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity=".85" />
    </radialGradient>
    <linearGradient id="ow-night" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#05060f" />
      <stop offset="1" stopColor="#141a33" />
    </linearGradient>
  </defs>
);

const Pin: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx="6" cy="10" rx="16" ry="8" fill="#000" opacity=".45" />
    <circle r="17" fill="#C4161C" />
    <circle cx="-5" cy="-5" r="6" fill="#ff8a8a" />
  </g>
);

const BW = 2600;
const BH = 4900;
const PW = 900;
const PH = 1010;
const IMG_W = 820;
const IMG_H = 780;

type P = { x: number; y: number; r: number; label: string };

const Polaroid: React.FC<{ p: P; at?: number; children: React.ReactNode }> = ({ p, at = -100, children }) => {
  const s = usePop(at, springs.snappy);
  const shown = at < 0 ? 1 : s;
  return (
    <g transform={`translate(${p.x},${p.y}) rotate(${p.r}) scale(${0.85 + 0.15 * shown})`} opacity={clamp01(shown * 2)}>
      <rect x={-PW / 2 + 14} y={-PH / 2 + 22} width={PW} height={PH} fill="#000" opacity=".5" filter="url(#ow-blur)" />
      <rect x={-PW / 2} y={-PH / 2} width={PW} height={PH} fill="#F1ECE2" />
      <svg x={-PW / 2 + 40} y={-PH / 2 + 40} width={IMG_W} height={IMG_H} viewBox={`0 0 ${IMG_W} ${IMG_H}`} overflow="hidden">
        {children}
        <rect width={IMG_W} height={IMG_H} fill="url(#ow-spot)" />
      </svg>
      <text x={0} y={PH / 2 - 62} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={38} fill="#2a2a2a" letterSpacing="3">
        {p.label}
      </text>
      <Pin x={0} y={-PH / 2 + 14} s={1.3} />
    </g>
  );
};

const Note: React.FC<{ x: number; y: number; r?: number; w: number; h: number; at: number; color?: string; children: React.ReactNode }> = ({
  x,
  y,
  r = 0,
  w,
  h,
  at,
  color = PAPER,
  children,
}) => {
  const s = usePop(at);
  if (s <= 0) return null;
  return (
    <g transform={`translate(${x},${y}) rotate(${r + (1 - s) * 14}) scale(${lerp(1.6, 1, s)})`} opacity={clamp01(s * 3)}>
      <rect x={-w / 2 + 10} y={-h / 2 + 16} width={w} height={h} fill="#000" opacity=".45" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={color} />
      {children}
      <Pin x={0} y={-h / 2 + 4} />
    </g>
  );
};

const Stamp: React.FC<{ x: number; y: number; at: number; text: string; color?: string; size?: number; r?: number }> = ({
  x,
  y,
  at,
  text,
  color = RED,
  size = 92,
  r = -10,
}) => {
  const s = usePop(at, springs.snappy);
  if (s <= 0) return null;
  const w = text.length * size * 0.56 + 60;
  const h = size * 1.3;
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${lerp(2.4, 1, s)})`} opacity={clamp01(s * 2) * 0.94}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10" fill="rgba(0,0,0,0.4)" stroke={color} strokeWidth={10} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={ANTON} fontSize={size} fill={color} letterSpacing="5">
        {text}
      </text>
    </g>
  );
};

const Tag: React.FC<{ x: number; y: number; at: number; text: string; color?: string; size?: number }> = ({ x, y, at, text, color = SUN, size = 40 }) => {
  const s = usePop(at, springs.snappy);
  if (s <= 0) return null;
  const w = text.length * size * 0.62 + 40;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.5} rx="8" fill="#0b0b0f" stroke={color} strokeWidth="4" />
      <text x={0} y={size * 0.25} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
};

const RedString: React.FC<{ pts: { x: number; y: number }[]; at: number[] }> = ({ pts, at }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {pts.slice(1).map((b, i) => {
        const a = pts[i];
        const p = ease(ramp(f, at[i], 14));
        if (p <= 0) return null;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2 + 90;
        const len = Math.hypot(b.x - a.x, b.y - a.y) * 1.15;
        return (
          <path
            key={i}
            d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`}
            fill="none"
            stroke="#C4161C"
            strokeWidth="7"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - p)}
            opacity=".95"
          />
        );
      })}
    </g>
  );
};

const Grain: React.FC<{ f: number }> = ({ f }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
    <filter id={`ow-grain-${f % 3}`}>
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed={7 + (f % 3)} />
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .08 0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#ow-grain-${f % 3})`} />
  </svg>
);

/* ------------------------------------------------------------------ drawings */

type SealKind = "fbi" | "cia" | "treasury";
const SEAL: Record<SealKind, { ring: string; field: string; edge: string; ink: string; arc: string; mid: string }> = {
  fbi: { ring: NAVY, field: "#14408f", edge: GOLD, ink: GOLD, arc: "FEDERAL BUREAU OF INVESTIGATION", mid: "FBI" },
  cia: { ring: "#101c33", field: "#1f3a68", edge: "#c9d2dc", ink: "#e9eef3", arc: "CENTRAL INTELLIGENCE AGENCY", mid: "CIA" },
  treasury: { ring: "#0d3b25", field: "#145c38", edge: GOLD, ink: GOLD, arc: "DEPARTMENT OF THE TREASURY", mid: "TREASURY" },
};

/** A drawn agency seal around (0,0), radius r. `uid` keeps the text-path id unique. */
const Seal: React.FC<{ kind: SealKind; r?: number; uid: string; hacked?: number }> = ({ kind, r = 140, uid, hacked = 0 }) => {
  const s = SEAL[kind];
  const id = `ow-arc-${kind}-${uid}`;
  const ar = r * 0.8;
  return (
    <g>
      <defs>
        <path id={id} d={`M${-ar},0 A${ar},${ar} 0 1 1 ${ar},0 A${ar},${ar} 0 1 1 ${-ar},0`} />
      </defs>
      <circle r={r + 8} fill="#000" opacity=".35" transform="translate(6,10)" />
      <circle r={r} fill={s.ring} stroke={s.edge} strokeWidth={r * 0.06} />
      <text fontFamily={ANTON} fontSize={r * 0.17} fill={s.ink} letterSpacing={r * 0.012}>
        <textPath href={`#${id}`} startOffset="0%">
          {s.arc}
        </textPath>
      </text>
      <circle r={r * 0.62} fill={s.field} stroke={s.edge} strokeWidth={r * 0.03} />
      {kind === "cia" ? (
        <g opacity=".9">
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d={`M0,${-r * 0.55} L${r * 0.06},0 L${-r * 0.06},0Z`} fill={i % 2 ? "#c9d2dc" : RED} transform={`rotate(${i * 22.5})`} />
          ))}
          <circle r={r * 0.2} fill={s.field} stroke="#c9d2dc" strokeWidth="3" />
        </g>
      ) : kind === "treasury" ? (
        <g stroke={GOLD} strokeWidth={r * 0.03} fill="none" opacity=".9">
          <path d={`M${-r * 0.36},${-r * 0.22} L${r * 0.36},${-r * 0.22} M0,${-r * 0.34} L0,${r * 0.1}`} />
          <path d={`M${-r * 0.46},${-r * 0.04} Q${-r * 0.36},${r * 0.08} ${-r * 0.26},${-r * 0.04}Z M${r * 0.26},${-r * 0.04} Q${r * 0.36},${r * 0.08} ${r * 0.46},${-r * 0.04}Z`} />
        </g>
      ) : (
        <g fill={GOLD}>
          {Array.from({ length: 13 }, (_, i) => {
            const a = (i / 13) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * r * 0.5} cy={Math.sin(a) * r * 0.5} r={r * 0.025} />;
          })}
        </g>
      )}
      <text
        y={kind === "treasury" ? r * 0.36 : r * 0.14}
        textAnchor="middle"
        fontFamily={ANTON}
        fontSize={kind === "treasury" ? r * 0.2 : kind === "cia" ? r * 0.3 : r * 0.42}
        fill={kind === "cia" ? "#fff" : s.ink}
        stroke={kind === "cia" ? s.field : "none"}
        strokeWidth={kind === "cia" ? r * 0.05 : 0}
        paintOrder="stroke"
        letterSpacing={r * 0.02}
      >
        {s.mid}
      </text>
      {hacked > 0 ? <circle r={r} fill={RED} opacity={0.35 * hacked} /> : null}
    </g>
  );
};

/** Hooded figure silhouette, ~150 tall, feet at (0,0). */
const Hood: React.FC<{ s?: number; eye?: string }> = ({ s = 1, eye = RED }) => (
  <g transform={`scale(${s})`}>
    <path d="M-46,0 C-50,-60 -40,-92 0,-96 C40,-92 50,-60 46,0Z" fill="#060606" />
    <path d="M-30,-92 C-36,-150 36,-150 30,-92 C26,-82 -26,-82 -30,-92Z" fill="#060606" />
    <circle cx="-9" cy="-112" r="4" fill={eye} />
    <circle cx="9" cy="-112" r="4" fill={eye} />
  </g>
);

/** Government building front: steps, columns, plate. Around (0,0), ~600 wide. */
const GovFront: React.FC<{ name: string; dome?: boolean; lit?: number }> = ({ name, dome, lit = 1 }) => (
  <g>
    {dome ? (
      <g>
        <rect x="-70" y="-290" width="140" height="70" fill="#e9e4d8" />
        <path d="M-90,-220 Q0,-330 90,-220Z" fill="#f2eee4" />
      </g>
    ) : (
      <path d="M-300,-170 L0,-280 L300,-170Z" fill="#d9d2c2" stroke="#6b6458" strokeWidth="6" />
    )}
    <rect x="-300" y="-170" width="600" height="40" fill="#cbc3b1" />
    <rect x="-250" y="-118" width="500" height="52" fill="#141414" />
    <text x="0" y="-80" textAnchor="middle" fontFamily={ANTON} fontSize="36" fill={SUN} letterSpacing="3">
      {name}
    </text>
    {[-230, -130, -30, 70, 170].map((x) => (
      <rect key={x} x={x} y="-60" width="60" height="300" fill="#e7e0d0" stroke="#8d8576" strokeWidth="4" />
    ))}
    {[-180, -80, 20, 120].map((x) => (
      <rect key={`w${x}`} x={x} y="20" width="40" height="80" fill={`rgba(255,210,63,${0.15 + 0.7 * lit})`} />
    ))}
    <rect x="-320" y="240" width="640" height="40" fill="#bdb5a3" />
  </g>
);

/* ------------------------------------------------------------------ scenes (820x780 photos) */

/** Types `text` out from frame `at`. */
const typed = (f: number, at: number, text: string, speed = 1.4) => (f < at ? "" : text.slice(0, Math.floor((f - at) * speed) + 1));

const FbiScene: React.FC<{ f: number }> = ({ f }) => {
  const br = c("Breached.");
  const hit = f >= br;
  const gl = f >= br && f < br + 10 ? 1 - (f - br) / 10 : 0;
  const rows: [string, number][] = [
    ["WARRANTS", c("Warrants.")],
    ["CRIMINAL RECORDS", c("Criminal")],
    ["MISSING PERSONS", c("Missing")],
  ];
  const lights = Math.floor(f / 4) % 2;
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#07080d" />
      {/* police light bar */}
      <g opacity={f >= c("cop") ? 1 : 0.25}>
        <rect x="160" y="22" width="500" height="44" rx="20" fill="#111" />
        <rect x="170" y="28" width="235" height="32" rx="14" fill={lights ? RED : "#3a0b10"} filter={lights ? "url(#ow-glow)" : undefined} />
        <rect x="415" y="28" width="235" height="32" rx="14" fill={!lights ? "#2a6bff" : "#0b1a3a"} filter={!lights ? "url(#ow-glow)" : undefined} />
      </g>
      {/* terminal */}
      <g transform={`translate(${gl * (rndAt(3, f) - 0.5) * 40},0)`}>
        <rect x="60" y="100" width="700" height="560" rx="18" fill="#0b0f0c" stroke={hit ? RED : "#2b3a30"} strokeWidth="8" />
        <rect x="60" y="100" width="700" height="70" rx="18" fill={hit ? RED : "#163222"} />
        <text x="410" y="148" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="30" fill="#fff" letterSpacing="2">
          NCIC · FBI CRIME DATABASE
        </text>
        <text x="95" y="225" fontFamily={MONO} fontWeight={700} fontSize="28" fill={GREEN}>
          {typed(f, c("pull") - 4, "> RUN PLATE  7KX-219_")}
        </text>
        {rows.map(([t, at], i) => {
          const s = f >= at ? 1 : 0;
          return (
            <g key={t} opacity={s} transform={`translate(95,${300 + i * 95})`}>
              <text fontFamily={MONO} fontWeight={700} fontSize="34" fill={hit ? "#ff9aa5" : "#e9f5ec"}>
                {t}
              </text>
              <rect y="18" width={500 + ((i * 97) % 90)} height="20" fill={hit ? RED : GREEN} opacity=".45" />
            </g>
          );
        })}
        {hit
          ? Array.from({ length: 6 }, (_, i) => (
              <rect key={i} x="60" y={110 + rndAt(i, Math.floor(f / 2)) * 540} width="700" height={6 + rndAt(i + 9, f) * 18} fill={RED} opacity=".5" />
            ))
          : null}
      </g>
      <Tag x={410} y={712} at={c("every")} text="EVERY COP IN AMERICA" color={SUN} size={32} />
      <Stamp x={410} y={430} at={br} text="BREACHED" size={130} r={-9} />
    </g>
  );
};

const CiaScene: React.FC<{ f: number }> = ({ f }) => {
  const crack = ramp(f, c("broken"), 8);
  const inside = ease(ramp(f, c("but"), 12));
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#090c14" />
      <g transform="translate(140,150)">
        <Seal kind="cia" r={95} uid="pol" />
      </g>
      <Tag x={520} y={150} at={c("spyagency")} text="SPY-AGENCY SYSTEM" color={TEAL} size={30} />
      {/* the system's screen */}
      <g transform="translate(410,420)">
        <rect x="-300" y="-150" width="600" height="300" rx="16" fill="#0d1626" stroke={crack > 0 ? RED : "#2a3a58"} strokeWidth="8" />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x="-260" y={-115 + i * 42} width={420 - ((i * 53) % 160)} height="16" fill={TEAL} opacity=".35" />
        ))}
        {crack > 0 ? (
          <path
            d="M-40,-150 L-10,-70 L-70,-20 L10,30 L-30,90 L20,150"
            fill="none"
            stroke="#fff"
            strokeWidth="6"
            strokeDasharray="420"
            strokeDashoffset={420 * (1 - crack)}
          />
        ) : null}
        <g transform={`translate(${lerp(260, 150, inside)},140)`} opacity={inside}>
          <Hood s={1.6} />
        </g>
      </g>
      {/* "nothing classified was touched" */}
      {f >= c("nothing") ? (
        <g transform="translate(410,665) rotate(-2)" opacity={1 - 0.5 * inside}>
          <rect x="-300" y="-40" width="600" height="80" fill={PAPER} />
          <text x="0" y="14" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="30" fill={INK}>
            CLASSIFIED: “NOT TOUCHED” ✓
          </text>
        </g>
      ) : null}
      <Tag x={410} y={740} at={c("say")} text="THEY SAY" color="#fff" size={24} />
      <Stamp x={410} y={330} at={c("got")} text="STILL GOT IN" size={96} r={-8} />
    </g>
  );
};

const TreasuryScene: React.FC<{ f: number }> = ({ f }) => {
  const off = ramp(f, c("Systems..."), 22);
  const banks = c("banks");
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="url(#ow-night)" />
      <g transform="translate(470,330) scale(.62)">
        <GovFront name="U.S. TREASURY" lit={1 - off} />
      </g>
      {/* banks filing dirty-money reports */}
      {f >= banks
        ? Array.from({ length: 6 }, (_, i) => {
            const t = ((f - banks) / 26 + i / 6) % 1;
            return (
              <g key={i} transform={`translate(${lerp(40, 380, t)},${lerp(140 + (i % 3) * 120, 300, t) - Math.sin(t * Math.PI) * 60}) rotate(${-10 + t * 20})`} opacity={(1 - off) * clamp01(t * 6)}>
                <rect x="-48" y="-30" width="96" height="60" fill={PAPER} />
                <text x="0" y="-6" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="14" fill={RED}>
                  SUSPICIOUS
                </text>
                <text x="0" y="16" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="14" fill={INK}>
                  $ REPORT
                </text>
              </g>
            );
          })
        : null}
      {/* server racks */}
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${150 + k * 260},560)`}>
          <rect x="-100" y="-50" width="200" height="170" fill="#0c0f14" stroke="#2c3440" strokeWidth="4" />
          {Array.from({ length: 4 }, (_, i) => {
            const dead = off * 12 > k * 4 + i;
            return <circle key={i} cx={-70 + i * 46} cy="0" r="10" fill={dead ? "#2a1012" : (f + i * 3 + k) % 14 < 7 ? GREEN : "#1a5a33"} />;
          })}
          <rect x="-80" y="30" width="160" height="14" fill="#1b222c" />
          <rect x="-80" y="62" width="160" height="14" fill="#1b222c" />
        </g>
      ))}
      <Tag x={410} y={60} at={c("dirty")} text="WHERE BANKS REPORT DIRTY MONEY" color={SUN} size={26} />
      <Stamp x={410} y={500} at={c("offline.")} text="OFFLINE" size={140} r={-8} />
    </g>
  );
};

const ChiefScene: React.FC<{ f: number }> = ({ f }) => {
  const gone = ease(ramp(f, c("Gone...") - 2, 10));
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0b0d14" />
      <g transform="translate(410,250) scale(.55)" opacity=".55">
        <GovFront name="THE WHITE HOUSE" dome />
      </g>
      {/* desk + chief */}
      <g transform={`translate(${410 + gone * 420},${470}) rotate(${gone * 25})`} opacity={1 - gone}>
        <circle cx="0" cy="-80" r="52" fill="#111" />
        <path d="M-110,60 C-110,-30 -60,-30 0,-30 C60,-30 110,-30 110,60Z" fill="#111" />
        <path d="M-12,-30 L12,-30 L6,40 L0,52 L-6,40Z" fill={RED} />
      </g>
      <g transform={`translate(410,520) rotate(${gone * 340})`}>
        <rect x="-70" y="-60" width="140" height="70" rx="12" fill="#2a2a30" opacity={gone} />
      </g>
      <rect x="110" y="560" width="600" height="150" fill="#3a2a1c" />
      <g transform="translate(410,610)">
        <rect x="-170" y="-30" width="340" height="60" fill={GOLD} />
        <text x="0" y="14" textAnchor="middle" fontFamily={ANTON} fontSize="38" fill={INK} letterSpacing="3">
          TOP CYBER CHIEF
        </text>
      </g>
      <Tag x={410} y={60} at={c("White")} text="THE WHITE HOUSE" color="#fff" size={30} />
      <Stamp x={410} y={360} at={c("Gone...")} text="GONE" size={170} r={-10} />
      <Tag x={410} y={740} at={c("same")} text="SAME WEEK" color={SUN} size={30} />
    </g>
  );
};

const WhoScene: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={IMG_W} height={IMG_H} fill="#15110d" />
    <g transform="translate(410,390) rotate(-2)">
      <rect x="-260" y="-320" width="520" height="640" fill="#e9dcc0" />
      <text x="0" y="-235" textAnchor="middle" fontFamily={ANTON} fontSize="96" fill={INK} letterSpacing="6">
        WANTED
      </text>
      <rect x="-170" y="-190" width="340" height="320" fill="#1a1612" />
      <g transform="translate(0,120)">
        <Hood s={2.2} />
      </g>
      <text x="0" y="40" textAnchor="middle" fontFamily={ANTON} fontSize="150" fill={RED} opacity={0.75 + 0.25 * Math.sin(f / 5)} filter="url(#ow-glow)">
        ?
      </text>
      <text x="0" y="210" textAnchor="middle" fontFamily={ANTON} fontSize="52" fill={INK}>
        FBI · CIA · TREASURY
      </text>
      <text x="0" y="270" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="26" fill="#5a4a30">
        IDENTITY UNKNOWN
      </text>
    </g>
    <Stamp x={290} y={170} at={c("said.")} text="NO NAME" size={86} r={-12} />
    <Stamp x={520} y={580} at={c("claimed")} text="NO ONE CLAIMED IT" size={56} r={8} />
  </g>
);

type Key = "fbi" | "cia" | "treasury" | "chief" | "who";
const POL: Record<Key, P> = {
  fbi: { x: 700, y: 950, r: -2, label: "FRI 20 NOV · THE FBI" },
  cia: { x: 1850, y: 1630, r: 3, label: "THE CIA" },
  treasury: { x: 700, y: 2310, r: -3, label: "TUE 24 NOV · TREASURY" },
  chief: { x: 1850, y: 2990, r: 2, label: "SAME WEEK" },
  who: { x: 700, y: 3670, r: -2, label: "SUSPECT" },
};
const ORDER: Key[] = ["fbi", "cia", "treasury", "chief", "who"];
const SCENES: Record<Key, React.FC<{ f: number }>> = { fbi: FbiScene, cia: CiaScene, treasury: TreasuryScene, chief: ChiefScene, who: WhoScene };
const pinOf = (p: P) => ({ x: p.x, y: p.y - PH / 2 + 14 });

/* ------------------------------------------------------------------ camera */

type K = { at: number; x: number; y: number; z: number };
const MOVE = 16;
const camKeys = (): K[] => {
  const v = (p: P, dy = 90) => ({ x: p.x + 70, y: p.y + dy });
  return [
    { at: 0, ...v(POL.fbi, 60), z: 1.0 },
    { at: c("Then") - 6, ...v(POL.cia), z: 1.0 },
    { at: c("Then", 1) - 6, ...v(POL.treasury), z: 1.0 },
    { at: c("And", 1) - 5, ...v(POL.chief), z: 1.0 },
    { at: c("Who's") - 5, ...v(POL.who), z: 1.0 },
    { at: c("Three") - 4, x: 1300, y: 2400, z: 0.3 },
  ];
};

const useCamera = () => {
  const f = useCurrentFrame();
  const keys = React.useMemo(camKeys, []);
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (f >= keys[k].at) i = k;
  const cur = keys[i];
  const prev = i > 0 ? keys[i - 1] : cur;
  const t = i > 0 ? clamp01((f - cur.at) / MOVE) : 1;
  const e = ease(t);
  const next = keys[i + 1]?.at ?? ONE_WEEK_FRAMES;
  const hold = clamp01((f - cur.at - MOVE) / Math.max(1, next - cur.at - MOVE));
  const dip = i > 0 ? 1 - 0.2 * Math.sin(Math.PI * t) : 1;
  return { x: lerp(prev.x, cur.x, e), y: lerp(prev.y, cur.y, e), z: lerp(prev.z, cur.z, e) * dip * (1 + 0.06 * hold), rot: Math.sin(f / 70) * 0.4 };
};

/* ------------------------------------------------------------------ glitch wrapper */

const Glitch: React.FC<{ f: number; g: number; id: string; children: React.ReactNode }> = ({ f, g, id, children }) => {
  if (g <= 0.02) return <>{children}</>;
  const rnd = (n: number) => rndAt(n, f);
  return (
    <g>
      <defs>
        <filter id={`${id}-r`}>
          <feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
        </filter>
        <filter id={`${id}-c`}>
          <feColorMatrix values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </defs>
      {children}
      <g filter={`url(#${id}-r)`} transform={`translate(${-46 * g},0)`} style={{ mixBlendMode: "screen" }} opacity=".9">
        {children}
      </g>
      <g filter={`url(#${id}-c)`} transform={`translate(${46 * g},0)`} style={{ mixBlendMode: "screen" }} opacity=".9">
        {children}
      </g>
      {Array.from({ length: 8 }, (_, i) => {
        const y = rnd(i + 10) * SHORT_H;
        const h = 20 + rnd(i + 30) * 150;
        const dx = (rnd(i + 50) - 0.5) * 420 * g;
        return (
          <g key={i} clipPath={`inset(${y}px 0 ${Math.max(0, SHORT_H - y - h)}px 0)`} transform={`translate(${dx},0)`}>
            {children}
          </g>
        );
      })}
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={`b${i}`} x="0" y={rnd(i + 80) * SHORT_H} width={SHORT_W} height={6 + rnd(i + 90) * 26} fill={[PINK, TEAL, "#fff", GREEN, RED][i]} opacity={0.75 * g} />
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ full-screen hook (0 .. "Friday") */

const SEAL_X: Record<SealKind, number> = { fbi: 200, cia: 490, treasury: 780 };

const Hook: React.FC<{ f: number }> = ({ f }) => {
  const week = usePop(0, springs.slam);
  const outAt = c("Friday.") - 4;
  if (f > outAt + 10) return null;
  const out = ease(ramp(f, outAt, 9));
  const hackAt = c("All");
  const whoAt = c("nobody");
  const burst = (at: number, len: number) => (f >= at && f < at + len ? 1 - (f - at) / len : 0);
  const sealAt: Record<SealKind, number> = { fbi: c("FBI."), cia: c("CIA."), treasury: c("Treasury.") };
  const g = Math.max(burst(0, 16), burst(sealAt.fbi, 5) * 0.6, burst(sealAt.cia, 5) * 0.6, burst(sealAt.treasury, 5) * 0.6, burst(hackAt - 2, 16), burst(whoAt - 2, 8) * 0.7);
  const flash = Math.max(0, 0.45 - f / 7) + burst(hackAt, 5) * 0.85 + burst(sealAt.fbi, 3) * 0.3 + burst(sealAt.cia, 3) * 0.3 + burst(sealAt.treasury, 3) * 0.3;
  const shake = g * 34;
  const sx = (rndAt(1, f) - 0.5) * shake;
  const sy = (rndAt(2, f) - 0.5) * shake;
  const hacked = ramp(f, hackAt, 6);
  const who = ease(ramp(f, whoAt - 2, 10));
  const Scene = (
    <g>
      <rect width={SHORT_W} height={SHORT_H} fill="#07070c" />
      <rect width={SHORT_W} height={SHORT_H} fill={RED} opacity={0.14 * hacked + 0.06 * hacked * Math.sin(f / 2)} />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={`sl${i}`} x="0" y={((i * 80 + f * 6) % SHORT_H)} width={SHORT_W} height="2" fill={hacked > 0 ? RED : "#2a2f45"} opacity=".35" />
      ))}
      <g transform="translate(0,215)">
        <rect x="60" y="-34" width="250" height="60" fill={RED} />
        <text x="185" y="12" textAnchor="middle" fontFamily={ANTON} fontSize="44" fill="#fff" letterSpacing="4" opacity={Math.floor(f / 8) % 2 ? 1 : 0.55}>
          ● BREAKING
        </text>
        <text x="330" y="10" fontFamily={MONO} fontWeight={700} fontSize="26" fill="#cfd3dc" letterSpacing="2">
          US GOVERNMENT · NOV 2026
        </text>
      </g>
      {/* "ONE WEEK" */}
      <g transform={`translate(490,${lerp(420, 330, who)}) rotate(-3) scale(${lerp(2.2, 1, week) * lerp(1, 0.8, who)})`}>
        <rect x="-330" y="-95" width="660" height="190" fill="#050505" stroke={hacked > 0 ? RED : SUN} strokeWidth="8" />
        <text x="0" y="55" textAnchor="middle" fontFamily={ANTON} fontSize="150" fill={hacked > 0 ? RED : SUN} letterSpacing="6">
          ONE WEEK
        </text>
      </g>
      {(["fbi", "cia", "treasury"] as SealKind[]).map((k, i) => {
        const s = f < sealAt[k] ? 0 : sp(f, FPS, sealAt[k], springs.slam);
        if (s <= 0) return null;
        const jit = hacked > 0 ? (rndAt(i + 3, f) - 0.5) * 10 : 0;
        return (
          <g key={k} transform={`translate(${SEAL_X[k] + jit},${lerp(780, 720, who)}) scale(${lerp(2.6, 1, s) * lerp(1, 0.85, who)}) rotate(${(i - 1) * 4})`}>
            <Seal kind={k} r={135} uid="hook" hacked={hacked} />
          </g>
        );
      })}
      {f >= hackAt ? (
        <g transform={`translate(490,${lerp(1130, 985, who)}) scale(${lerp(1, 0.85, who)})`}>
          <Stamp x={0} y={0} at={hackAt} text="HACKED" size={210} r={-8} />
        </g>
      ) : null}
      {who > 0 ? (
        <g opacity={who}>
          <g transform="translate(490,1560)">
            <Hood s={2.2} />
          </g>
          <g transform={`translate(490,1235) scale(${lerp(2, 1, who)})`}>
            <text x="0" y="0" textAnchor="middle" fontFamily={ANTON} fontSize="130" fill="#fff" stroke={RED} strokeWidth="8" paintOrder="stroke" letterSpacing="6">
              WHO?
            </text>
          </g>
        </g>
      ) : null}
    </g>
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${lerp(1, 0.42, out)}) rotate(${-6 * out}deg)` }}>
      <svg width={SHORT_W} height={SHORT_H} viewBox={`0 0 ${SHORT_W} ${SHORT_H}`} style={{ position: "absolute", inset: 0 }}>
        <SvgDefs />
        <g transform={`translate(${sx},${sy})`}>
          <Glitch f={f} g={g} id="ow-hk">
            {Scene}
          </Glitch>
        </g>
      </svg>
      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(1, flash) }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ finale: "Three of the most powerful agencies... in one week" */

const Finale: React.FC<{ f: number }> = ({ f }) => {
  const at = c("Three");
  if (f < at - 2) return null;
  const inn = ease(ramp(f, at - 2, 8));
  const weekAt = c("one", 2);
  const g = f >= at - 2 && f < at + 8 ? 1 - (f - at + 2) / 10 : f >= weekAt - 1 && f < weekAt + 7 ? 1 - (f - weekAt + 1) / 8 : 0;
  const string = ease(ramp(f, c("agencies") - 4, 14));
  const scene = (
    <g>
      <rect width={SHORT_W} height={SHORT_H} fill="#050509" opacity={0.86 * inn} />
      <g transform="translate(490,360) rotate(-3)" opacity={inn}>
        <rect x="-360" y="-80" width="720" height="160" fill={PAPER} />
        <text x="0" y="48" textAnchor="middle" fontFamily={ANTON} fontSize="120" fill={INK} letterSpacing="5">
          3 AGENCIES
        </text>
      </g>
      <path
        d={`M${SEAL_X.fbi},760 Q345,880 ${SEAL_X.cia},760 Q635,880 ${SEAL_X.treasury},760`}
        fill="none"
        stroke="#C4161C"
        strokeWidth="9"
        strokeDasharray="800"
        strokeDashoffset={800 * (1 - string)}
      />
      {(["fbi", "cia", "treasury"] as SealKind[]).map((k, i) => {
        const s = f < at + i * 4 ? 0 : sp(f, FPS, at + i * 4, springs.slam);
        if (s <= 0) return null;
        return (
          <g key={k} transform={`translate(${SEAL_X[k]},760) scale(${lerp(2.2, 1, s)}) rotate(${(i - 1) * 4})`}>
            <Seal kind={k} r={130} uid="fin" hacked={1} />
          </g>
        );
      })}
      {f >= weekAt ? (
        <g transform="translate(490,1180)">
          <Stamp x={0} y={0} at={weekAt} text="1 WEEK" size={200} r={-7} />
        </g>
      ) : null}
    </g>
  );
  const fade = 1 - ease(ramp(f, c("So") - 3, 8));
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <svg width={SHORT_W} height={SHORT_H} viewBox={`0 0 ${SHORT_W} ${SHORT_H}`} style={{ position: "absolute", inset: 0 }}>
        <SvgDefs />
        <Glitch f={f} g={g} id="ow-fin">
          {scene}
        </Glitch>
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ the board */

const Board: React.FC<{ f: number }> = ({ f }) => {
  const keys = camKeys();
  return (
    <svg width={BW} height={BH} viewBox={`0 0 ${BW} ${BH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <SvgDefs />
      <rect x="-1200" y="-1200" width={BW + 2400} height={BH + 2400} fill="#1a120c" />
      <rect x="-1200" y="-1200" width={BW + 2400} height={BH + 2400} fill="#fff" filter="url(#ow-cork)" />
      {Array.from({ length: 26 }, (_, i) => {
        const x = (i * 613) % BW;
        const y = (i * 1031) % BH;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${((i * 37) % 30) - 15})`} opacity=".55">
            <rect x="-110" y="-70" width="220" height="140" fill="#d8cfbb" />
            {[0, 1, 2].map((k) => (
              <rect key={k} x="-90" y={-44 + k * 30} width={160 - k * 30} height="12" fill="#8a8170" />
            ))}
          </g>
        );
      })}
      <RedString pts={ORDER.map((k) => pinOf(POL[k]))} at={keys.slice(1, 5).map((k) => k.at)} />

      {/* title card */}
      <g transform={`translate(${POL.fbi.x},${POL.fbi.y - PH / 2 - 180}) rotate(-3)`}>
        <rect x="-330" y="-130" width="660" height="250" fill="#000" opacity=".45" transform="translate(10,14)" />
        <rect x="-330" y="-130" width="660" height="250" fill={PAPER} />
        <text x="0" y="-20" textAnchor="middle" fontFamily={ANTON} fontSize="74" fill={INK} letterSpacing="3">
          ONE WEEK
        </text>
        <text x="0" y="60" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill={RED} letterSpacing="3">
          3 AGENCIES HACKED
        </text>
        <Pin x={300} y={-120} />
      </g>

      {ORDER.map((k, i) => {
        const S = SCENES[k];
        return (
          <Polaroid key={k} p={POL[k]} at={i === 0 ? -100 : keys[i].at - 6}>
            <S f={f} />
          </Polaroid>
        );
      })}

      <Note x={POL.fbi.x + 300} y={POL.fbi.y + 480} r={6} w={380} h={130} at={c("Friday.")} color="#f2c230">
        <text x="0" y="24" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill={INK}>
          FRI 20 NOV
        </text>
      </Note>
      <Note x={POL.treasury.x + 300} y={POL.treasury.y + 480} r={-5} w={380} h={130} at={c("Tuesday.")} color="#f2c230">
        <text x="0" y="24" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill={INK}>
          TUE 24 NOV
        </text>
      </Note>
    </svg>
  );
};

/* ------------------------------------------------------------------ main */

const EndCard: React.FC = () => {
  const s = usePop(c("So") - 2);
  const s3 = usePop(c("Tell") - 2);
  if (s <= 0) return null;
  const box: React.CSSProperties = { padding: "18px 40px", boxShadow: "10px 14px 0 rgba(0,0,0,0.5)", fontFamily: ANTON, whiteSpace: "nowrap", color: INK, letterSpacing: 3 };
  return (
    <div style={{ position: "absolute", left: 60, width: 840, top: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
      <div style={{ ...box, transform: `scale(${lerp(1.6, 1, s)}) rotate(-3deg)`, opacity: clamp01(s * 3), background: PAPER, fontSize: 92 }}>
        WHO DID <span style={{ color: RED }}>IT?</span>
      </div>
      {s3 > 0 ? (
        <div style={{ transform: `scale(${s3}) rotate(-2deg)`, background: SUN, padding: "12px 30px", fontFamily: ANTON, fontSize: 56, color: INK, letterSpacing: 2 }}>COMMENT BELOW ↓</div>
      ) : null}
    </div>
  );
};

export const OneWeekHacked: React.FC<z.infer<typeof oneWeekSchema>> = ({ showCaptions }) => {
  const f = useCurrentFrame();
  const cam = useCamera();
  const keys = camKeys();
  return (
    <AbsoluteFill style={{ background: "#120c08", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: BW,
          height: BH,
          transformOrigin: "0 0",
          transform: `translate(540px,900px) rotate(${cam.rot}deg) scale(${cam.z}) translate(${-cam.x}px,${-cam.y}px)`,
        }}
      >
        <Board f={f} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 42%, rgba(255,179,92,0.12) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)" }} />
      <Grain f={f} />
      <Finale f={f} />
      <Hook f={f} />
      <EndCard />
      <ShortCaptions
        words={WORDS}
        enabled={showCaptions}
        hide={[
          [0, c("Friday.") - 2],
          [c("Three") - 2, c("So") - 2],
        ]}
        centerY={1150}
        fontSize={60}
        maxWords={4}
        maxChars={22}
        left={170}
        right={170}
        hot={["fbi", "fbi's", "cia", "treasury", "hacked", "nobody", "breached", "warrants", "classified", "but", "still", "dirty", "money", "offline", "gone", "claimed", "nobody's"]}
      />
      <Audio src={staticFile("shorts/oneweek/vo.mp3")} />
      <Loop durationInFrames={Math.round(62 * FPS)}>
        <Audio src={staticFile("shorts/cyberleak/bed.mp3")} volume={0.16} />
      </Loop>
      {/* hook */}
      <Sfx name="slam" at={0} volume={1} />
      <Sfx name="glitch" at={0} volume={0.85} />
      <Sfx name="slam" at={c("FBI.")} volume={0.85} />
      <Sfx name="slam" at={c("CIA.")} volume={0.85} />
      <Sfx name="slam" at={c("Treasury.")} volume={0.9} />
      <Sfx name="glitch" at={c("All") - 2} volume={0.9} />
      <Sfx name="stamp" at={c("All")} volume={1} />
      <Sfx name="error" at={c("hacked.")} volume={0.6} />
      <Sfx name="rumble" at={c("nobody") - 2} volume={0.7} />
      <Sfx name="whoosh" at={c("Friday.") - 4} volume={0.8} />
      {keys.slice(1).map((k, i) => (
        <Sfx key={i} name="whoosh" at={k.at - 2} volume={0.7} />
      ))}
      {/* FBI */}
      <Sfx name="pop" at={c("Friday.")} volume={0.5} />
      <Sfx name="pop" at={c("every")} volume={0.5} />
      <Sfx name="type" at={c("pull") - 4} durationInFrames={16} volume={0.5} />
      <Sfx name="click" at={c("Warrants.")} volume={0.7} />
      <Sfx name="click" at={c("Criminal")} volume={0.7} />
      <Sfx name="click" at={c("Missing")} volume={0.7} />
      <Sfx name="glitch" at={c("Breached.")} volume={0.8} />
      <Sfx name="stamp" at={c("Breached.")} volume={0.95} />
      {/* CIA */}
      <Sfx name="pop" at={c("spyagency")} volume={0.5} />
      <Sfx name="crash" at={c("broken")} volume={0.6} />
      <Sfx name="pop" at={c("nothing")} volume={0.5} />
      <Sfx name="rumble" at={c("but")} volume={0.6} />
      <Sfx name="stamp" at={c("got")} volume={0.95} />
      {/* Treasury */}
      <Sfx name="pop" at={c("Tuesday.")} volume={0.5} />
      <Sfx name="pop" at={c("dirty")} volume={0.5} />
      <Sfx name="error" at={c("Systems...")} volume={0.6} />
      <Sfx name="stamp" at={c("offline.")} volume={0.95} />
      {/* chief */}
      <Sfx name="pop" at={c("White")} volume={0.5} />
      <Sfx name="whoosh" at={c("Gone...") - 2} volume={0.7} />
      <Sfx name="stamp" at={c("Gone...")} volume={1} />
      <Sfx name="pop" at={c("same")} volume={0.5} />
      {/* who */}
      <Sfx name="stamp" at={c("said.")} volume={0.9} />
      <Sfx name="stamp" at={c("claimed")} volume={0.9} />
      {/* finale */}
      <Sfx name="glitch" at={c("Three") - 2} volume={0.8} />
      <Sfx name="slam" at={c("Three")} volume={0.8} />
      <Sfx name="slam" at={c("Three") + 4} volume={0.7} />
      <Sfx name="slam" at={c("Three") + 8} volume={0.7} />
      <Sfx name="riser" at={c("agencies") - 6} volume={0.45} />
      <Sfx name="glitch" at={c("one", 2) - 1} volume={0.8} />
      <Sfx name="stamp" at={c("one", 2)} volume={1} />
      <Sfx name="slam" at={c("So") - 2} volume={0.7} />
      <Sfx name="pop" at={c("Tell") - 2} volume={0.5} />
    </AbsoluteFill>
  );
};
