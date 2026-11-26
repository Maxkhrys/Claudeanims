import React from "react";
import { AbsoluteFill, Audio, Loop, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { z } from "zod";
import { springs } from "../theme";
import { createCues, sp, type Word } from "../lib/timing";
import { Sfx } from "../components";
import transcript from "../../public/shorts/pcport/words.json";
import { ShortCaptions, SHORT_H, SHORT_W } from "./kit3d";

/*
 * "A fifteen-year-old tried to put GTA 6 on PC... and Rockstar just crushed him." (about 44 s).
 * Facts (26 Nov 2026), all from Take-Two's DMCA notice on github/dmca (2026/11/2026-11-24-take-two.md) or 2+ outlets:
 *  - notice: "On November 20, 2026, stolen game files from an Xbox Series build of Grand Theft Auto VI were publicly
 *    distributed." / "The following day, this Leonida repository opened..." / "bring your own files" = "intentionally
 *    misleading"; GitHub took down the whole network of 3,007 repositories.
 *  - creator is 15 (his own post; The Verge, TechPowerUp, TweakTown); Discord ~180k (TechPowerUp, TweakTown), taken
 *    down; he quit. No official GTA 6 PC date.
 * Never name the kid (minor), never show a link to the port or the leak. The kid is a drawn silhouette.
 * Same noir evidence board as OneWeekHacked / JudgeGTA6. Real logos: GTA VI, Take-Two, GitHub, Discord.
 * Narration: public/shorts/pcport/vo.mp3 (Max's Gemini take, pauses capped at 0.3 s, 4% faster), words.json.
 * Safe zone for key text: x 60..918, y 192..1536; captions small at about 60% down.
 */

loadFont({ family: "Anton", weight: "400", url: staticFile("fonts/Anton-400.woff2") });

export const pcPortSchema = z.object({ showCaptions: z.boolean() });
export const PC_PORT_FRAMES = 1340;

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
const BLURPLE = "#5865F2";
const XBOX = "#107C10";

const LOGO = {
  gta: staticFile("shorts/pcport/gta6.png"),
  t2w: staticFile("shorts/pcport/taketwo-white.png"),
  t2b: staticFile("shorts/pcport/taketwo-black.png"),
  gh: staticFile("shorts/pcport/github.png"),
  ghw: staticFile("shorts/pcport/github-white.png"),
  dc: staticFile("shorts/pcport/discord.png"),
};
/** logo aspect ratios (w/h) */
const AR = { gta: 400 / 304, t2: 786 / 661, gh: 800 / 781, dc: 1 };

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
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/* ------------------------------------------------------------------ board pieces */

const SvgDefs: React.FC = () => (
  <defs>
    <filter id="pc-cork" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".45" numOctaves="4" seed="21" />
      <feColorMatrix values="0 0 0 0 .2 0 0 0 0 .13 0 0 0 0 .08 0 0 0 .85 0" />
      <feComposite in2="SourceGraphic" operator="in" />
    </filter>
    <filter id="pc-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="10" result="a" />
      <feMerge>
        <feMergeNode in="a" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="pc-blur">
      <feGaussianBlur stdDeviation="10" />
    </filter>
    <filter id="pc-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="6" dy="10" stdDeviation="8" floodColor="#000" floodOpacity=".6" />
    </filter>
    <radialGradient id="pc-spot" cx=".5" cy=".42" r=".7">
      <stop offset=".35" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity=".85" />
    </radialGradient>
    <linearGradient id="pc-vice" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2a0b3d" />
      <stop offset=".6" stopColor="#c2306b" />
      <stop offset="1" stopColor="#ff9a3c" />
    </linearGradient>
    <linearGradient id="pc-night" x1="0" y1="0" x2="0" y2="1">
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
const BH = 5900;
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
      <rect x={-PW / 2 + 14} y={-PH / 2 + 22} width={PW} height={PH} fill="#000" opacity=".5" filter="url(#pc-blur)" />
      <rect x={-PW / 2} y={-PH / 2} width={PW} height={PH} fill="#F1ECE2" />
      <svg x={-PW / 2 + 40} y={-PH / 2 + 40} width={IMG_W} height={IMG_H} viewBox={`0 0 ${IMG_W} ${IMG_H}`} overflow="hidden">
        {children}
        <rect width={IMG_W} height={IMG_H} fill="url(#pc-spot)" opacity=".7" />
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
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${lerp(2.4, 1, s)})`} opacity={clamp01(s * 2) * 0.95}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10" fill="rgba(0,0,0,0.45)" stroke={color} strokeWidth={10} />
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

/** Real logo image centred on (x,y) with height h; slams in at `at`. */
const Logo: React.FC<{ href: string; ar: number; x: number; y: number; h: number; at?: number; r?: number; shadow?: boolean }> = ({
  href,
  ar,
  x,
  y,
  h,
  at = -100,
  r = 0,
  shadow = true,
}) => {
  const s = usePop(Math.max(0, at), springs.slam);
  const shown = at < 0 ? 1 : s;
  if (shown <= 0) return null;
  const w = h * ar;
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${lerp(2.2, 1, shown)})`} opacity={clamp01(shown * 3)}>
      <image href={href} x={-w / 2} y={-h / 2} width={w} height={h} filter={shadow ? "url(#pc-shadow)" : undefined} />
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
    <filter id={`pc-grain-${f % 3}`}>
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed={7 + (f % 3)} />
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .08 0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#pc-grain-${f % 3})`} />
  </svg>
);

/* ------------------------------------------------------------------ drawings */

/** Teen silhouette from behind: hoodie + headphones. Feet/bottom at (0,0), ~260 tall at s=1. */
const Kid: React.FC<{ s?: number; glow?: string }> = ({ s = 1, glow = TEAL }) => (
  <g transform={`scale(${s})`}>
    <path d="M-120,0 C-122,-90 -90,-140 0,-146 C90,-140 122,-90 120,0Z" fill="#050505" />
    <path d="M-62,-140 C-70,-250 70,-250 62,-140 C50,-125 -50,-125 -62,-140Z" fill="#050505" />
    {/* headphones */}
    <path d="M-66,-196 C-66,-262 66,-262 66,-196" fill="none" stroke="#1d1d22" strokeWidth="12" />
    <rect x="-80" y="-212" width="26" height="46" rx="10" fill="#1d1d22" stroke={glow} strokeWidth="3" />
    <rect x="54" y="-212" width="26" height="46" rx="10" fill="#1d1d22" stroke={glow} strokeWidth="3" />
    {/* rim light */}
    <path d="M-62,-140 C-70,-250 70,-250 62,-140" fill="none" stroke={glow} strokeWidth="3" opacity=".6" />
    <path d="M-120,0 C-122,-90 -90,-140 0,-146 C90,-140 122,-90 120,0" fill="none" stroke={glow} strokeWidth="3" opacity=".4" />
  </g>
);

/** Hooded figure silhouette, ~150 tall, feet at (0,0). */
const Hood: React.FC<{ s?: number; eye?: string }> = ({ s = 1, eye = RED }) => (
  <g transform={`scale(${s})`}>
    <path d="M-46,0 C-50,-60 -40,-92 0,-96 C40,-92 50,-60 46,0Z" fill="#060606" />
    <path d="M-30,-92 C-36,-150 36,-150 30,-92 C26,-82 -26,-82 -30,-92Z" fill="#060606" />
    <circle cx="-9" cy="-112" r="4" fill={eye} />
    <circle cx="9" cy="-112" r="4" fill={eye} />
  </g>
);

/** Retro monitor around (0,0); screen w x h. */
const Monitor: React.FC<{ w: number; h: number; frame?: string; children?: React.ReactNode }> = ({ w, h, frame = "#1b1d24", children }) => (
  <g>
    <rect x={-w / 2 - 22} y={-h / 2 - 22} width={w + 44} height={h + 44} rx="18" fill={frame} stroke="#000" strokeWidth="4" />
    <svg x={-w / 2} y={-h / 2} width={w} height={h} viewBox={`0 0 ${w} ${h}`} overflow="hidden">
      <rect width={w} height={h} fill="#05060a" />
      {children}
    </svg>
    <rect x={-50} y={h / 2 + 22} width="100" height="50" fill="#14161c" />
    <rect x={-130} y={h / 2 + 66} width="260" height="18" rx="6" fill="#14161c" />
  </g>
);

const Crack: React.FC<{ p: number; s?: number }> = ({ p, s = 1 }) => {
  if (p <= 0) return null;
  const lines = [
    "M0,0 L-60,-40 L-130,-30 L-210,-90",
    "M0,0 L50,-70 L60,-150 L120,-210",
    "M0,0 L90,20 L170,-10 L250,30",
    "M0,0 L30,80 L-10,150 L20,230",
    "M0,0 L-70,50 L-120,120 L-220,140",
  ];
  return (
    <g transform={`scale(${s})`} stroke="#fff" strokeWidth="5" fill="none" strokeLinejoin="round">
      {lines.map((d, i) => (
        <path key={i} d={d} strokeDasharray="420" strokeDashoffset={420 * (1 - p)} />
      ))}
      <circle r={18 * p} fill="#fff" stroke="none" />
    </g>
  );
};

/** Typed text from frame `at`. */
const typed = (f: number, at: number, text: string, speed = 1.4) => (f < at ? "" : text.slice(0, Math.floor((f - at) * speed) + 1));

/* ------------------------------------------------------------------ scenes (820x780 photos) */

/** "GTA 6 just came out. Console only. No PC. Not even a date." */
const LaunchScene: React.FC<{ f: number }> = ({ f }) => {
  const box = (x: number, label: string, col: string, at: number, crossed = false) => {
    const s = f < at ? 0 : sp(f, FPS, at, springs.slam);
    if (s <= 0) return null;
    const x0 = crossed ? ramp(f, at + 4, 8) : 0;
    return (
      <g transform={`translate(${x},330) scale(${lerp(1.8, 1, s)})`}>
        <rect x="-115" y="-160" width="230" height="300" rx="10" fill={crossed ? "#20232b" : "url(#pc-vice)"} stroke="#000" strokeWidth="5" />
        <rect x="-115" y="-160" width="230" height="46" rx="10" fill={col} />
        <text x="0" y="-126" textAnchor="middle" fontFamily={ANTON} fontSize="32" fill="#fff" letterSpacing="2">
          {label}
        </text>
        {crossed ? (
          <text x="0" y="40" textAnchor="middle" fontFamily={ANTON} fontSize="70" fill="#5b6070">
            ?
          </text>
        ) : (
          <image href={LOGO.gta} x="-90" y="-90" width="180" height={180 / AR.gta} />
        )}
        {x0 > 0 ? (
          <g stroke={RED} strokeWidth="18" strokeLinecap="round">
            <line x1="-110" y1="-150" x2={lerp(-110, 110, x0)} y2={lerp(-150, 130, x0)} />
            <line x1="110" y1="-150" x2={lerp(110, -110, x0)} y2={lerp(-150, 130, x0)} />
          </g>
        ) : null}
      </g>
    );
  };
  const date = c("date.");
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0c0d14" />
      {box(150, "PS5", "#0a4fd6", c("Console") - 2)}
      {box(410, "XBOX", XBOX, c("Console") + 3)}
      {box(670, "PC", "#3a3f4d", c("No"), true)}
      {/* calendar */}
      {f >= c("Not") ? (
        <g transform="translate(410,630) rotate(-3)">
          <rect x="-200" y="-90" width="400" height="180" fill={PAPER} />
          <rect x="-200" y="-90" width="400" height="46" fill={RED} />
          <text x="0" y="-56" textAnchor="middle" fontFamily={ANTON} fontSize="32" fill="#fff" letterSpacing="3">
            PC RELEASE DATE
          </text>
          <text x="0" y="60" textAnchor="middle" fontFamily={ANTON} fontSize="96" fill={INK} opacity={0.7 + 0.3 * Math.sin(f / 4)}>
            ???
          </text>
        </g>
      ) : null}
      <Tag x={410} y={60} at={c("came")} text="OUT 19 NOV" color={SUN} size={34} />
      <Stamp x={630} y={520} at={date} text="NO DATE" size={74} r={-10} />
    </g>
  );
};

/** "Then hackers leaked a stolen Xbox copy of the game online." */
const LeakScene: React.FC<{ f: number }> = ({ f }) => {
  const leak = c("leaked");
  const on = c("online.");
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="url(#pc-night)" />
      {Array.from({ length: 18 }, (_, i) => (
        <text key={i} x={(i * 97) % 820} y={((i * 131 + f * 9) % 860) - 40} fontFamily={MONO} fontSize="22" fill={GREEN} opacity=".25">
          {["0x1F", "GTA6", "XBX", "DUMP", "1010", "rpf"][i % 6]}
        </text>
      ))}
      {/* the hacker */}
      <g transform="translate(160,600)">
        <Hood s={2.6} />
      </g>
      {/* laptop */}
      <g transform="translate(470,430)">
        <rect x="-220" y="-150" width="440" height="270" rx="12" fill="#111318" stroke="#2b2f3a" strokeWidth="6" />
        <rect x="-200" y="-130" width="400" height="230" fill="#040507" />
        <text x="-185" y="-90" fontFamily={MONO} fontWeight={700} fontSize="24" fill={GREEN}>
          {typed(f, c("hackers"), "> upload GTA6_XBOX_BUILD")}
        </text>
        {f >= leak ? (
          <g>
            <rect x="-185" y="-50" width="370" height="30" fill="#1a1d24" />
            <rect x="-185" y="-50" width={370 * ease(ramp(f, leak, on - leak + 6))} height="30" fill={RED} />
            <text x="0" y="20" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="26" fill="#fff">
              {Math.round(100 * ease(ramp(f, leak, on - leak + 6)))}% · ~209 GB
            </text>
          </g>
        ) : null}
        <rect x="-260" y="120" width="520" height="26" rx="8" fill="#2b2f3a" />
      </g>
      {/* Xbox badge */}
      <g transform="translate(680,150)">
        <circle r="62" fill={XBOX} stroke="#fff" strokeWidth="5" />
        <text y="14" textAnchor="middle" fontFamily={ANTON} fontSize="36" fill="#fff">
          XBOX
        </text>
      </g>
      {/* files flying out */}
      {f >= on
        ? Array.from({ length: 7 }, (_, i) => {
            const t = ((f - on) / 22 + i / 7) % 1;
            return (
              <g key={i} transform={`translate(${lerp(470, 760, t)},${lerp(330, -40 + i * 50, t)}) rotate(${t * 40 - 20})`} opacity={clamp01(t * 5)}>
                <rect x="-34" y="-24" width="68" height="48" rx="4" fill={SUN} />
                <rect x="-34" y="-30" width="30" height="10" rx="3" fill={SUN} />
              </g>
            );
          })
        : null}
      <Tag x={410} y={60} at={c("hackers")} text="HACKERS" color={RED} size={34} />
      <Stamp x={430} y={680} at={c("stolen")} text="STOLEN" size={110} r={-7} />
    </g>
  );
};

/** "The next day, this kid started a project called Leonida... to make that Xbox copy run on PC.
 *  Almost a hundred and eighty thousand people joined its Discord." */
const KidScene: React.FC<{ f: number }> = ({ f }) => {
  const leo = c("Leonida");
  const dcAt = c("Almost");
  const cnt = ease(ramp(f, dcAt, c("Discord.") - dcAt + 4)) * 180000;
  const prog = ease(ramp(f, c("make"), 50));
  const dcShow = ease(ramp(f, dcAt - 3, 10));
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#090b12" />
      <g transform={`translate(${lerp(410, 300, dcShow)},300) scale(${lerp(1, 0.78, dcShow)})`}>
        <Monitor w={480} h={300}>
          <rect width="480" height="300" fill="#0a0d16" />
          <text x="240" y="70" textAnchor="middle" fontFamily={ANTON} fontSize="64" fill={f >= leo ? SUN : "#333"} letterSpacing="6">
            LEONIDA
          </text>
          <text x="240" y="112" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="20" fill="#9aa3b5">
            XBOX → PC · RECOMPILER
          </text>
          {f >= c("make") ? (
            <g>
              <rect x="40" y="150" width="400" height="34" fill="#1a1f2c" />
              <rect x="40" y="150" width={400 * prog * 0.62} height="34" fill={GREEN} />
              <text x="240" y="230" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="22" fill={GREEN}>
                {typed(f, c("run"), "booting GTA VI on PC...")}
              </text>
            </g>
          ) : null}
        </Monitor>
        <g transform="translate(0,410)">
          <Kid s={1.25} />
        </g>
      </g>
      {/* Discord */}
      {dcShow > 0 ? (
        <g opacity={dcShow}>
          <Logo href={LOGO.dc} ar={AR.dc} x={650} y={210} h={190} at={dcAt - 3} />
          <g transform="translate(640,400)">
            <rect x="-160" y="-60" width="320" height="120" rx="14" fill={BLURPLE} stroke="#fff" strokeWidth="5" />
            <text x="0" y="22" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill="#fff" letterSpacing="2">
              {fmt(cnt)}
            </text>
          </g>
          <text x="640" y="508" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="26" fill="#cfd5ff">
            MEMBERS
          </text>
        </g>
      ) : null}
      <Tag x={410} y={60} at={c("kid")} text="AGE: 15" color={SUN} size={36} />
    </g>
  );
};

/** "But Rockstar's owner, Take-Two, hit back. One legal notice... and GitHub deleted his project, plus over three thousand copies of it." */
const TakedownScene: React.FC<{ f: number }> = ({ f }) => {
  const notice = c("notice...");
  const del = c("deleted");
  const n = ease(ramp(f, c("plus"), c("it.") - c("plus") + 6)) * 3007;
  const rows = Math.floor(ease(ramp(f, del, 60)) * 9);
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0d0b0b" />
      <Logo href={LOGO.t2w} ar={AR.t2} x={170} y={150} h={190} at={c("owner,")} />
      {/* legal notice flying in */}
      {f >= notice - 2 ? (
        <g transform={`translate(${lerp(900, 230, ease(ramp(f, notice - 2, 8)))},${470}) rotate(${-6})`}>
          <rect x="-150" y="-190" width="300" height="380" fill={PAPER} filter="url(#pc-shadow)" />
          <text x="0" y="-140" textAnchor="middle" fontFamily={ANTON} fontSize="46" fill={RED} letterSpacing="3">
            DMCA
          </text>
          <text x="0" y="-100" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="18" fill={INK}>
            TAKEDOWN NOTICE
          </text>
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="-120" y={-70 + i * 30} width={240 - ((i * 53) % 90)} height="10" fill="#8a8170" />
          ))}
          <text x="0" y="170" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="18" fill={INK}>
            TAKE-TWO INTERACTIVE
          </text>
        </g>
      ) : null}
      {/* GitHub repo wall */}
      <g transform="translate(590,430)">
        {f >= c("GitHub") ? <Logo href={LOGO.ghw} ar={AR.gh} x={0} y={-250} h={110} at={c("GitHub")} /> : null}
        {f >= c("GitHub")
          ? Array.from({ length: 9 }, (_, i) => {
              const dead = i < rows;
              return (
                <g key={i} transform={`translate(0,${-170 + i * 36})`}>
                  <rect x="-170" y="-14" width="340" height="28" rx="4" fill={dead ? "#3a0b10" : "#161b22"} stroke={dead ? RED : "#30363d"} strokeWidth="2" />
                  <text x="-155" y="7" fontFamily={MONO} fontWeight={700} fontSize="16" fill={dead ? "#ff8a95" : "#8b949e"} textDecoration={dead ? "line-through" : undefined}>
                    {i === 0 ? "Leonida" : `fork #${i * 337 + 12}`}
                  </text>
                  {dead ? (
                    <text x="160" y="7" textAnchor="end" fontFamily={MONO} fontWeight={700} fontSize="15" fill={RED}>
                      REMOVED
                    </text>
                  ) : null}
                </g>
              );
            })
          : null}
      </g>
      {f >= c("plus") ? (
        <g transform="translate(590,700)">
          <rect x="-200" y="-50" width="400" height="90" rx="10" fill="#000" stroke={RED} strokeWidth="5" />
          <text x="0" y="16" textAnchor="middle" fontFamily={ANTON} fontSize="56" fill={RED} letterSpacing="2">
            {fmt(n)} REPOS
          </text>
        </g>
      ) : null}
      <Stamp x={400} y={380} at={del} text="DELETED" size={120} r={-9} />
    </g>
  );
};

/** "But here's the crazy part. In that notice, Take-Two admits the leaked game files were real... and stolen." */
const NoticeScene: React.FC<{ f: number }> = ({ f }) => {
  const hl = ease(ramp(f, c("admits"), c("stolen", 1) - c("admits") + 4));
  const zoom = ease(ramp(f, c("In"), 18));
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#16120d" />
      <g transform={`translate(410,${lerp(420, 390, zoom)}) rotate(${lerp(-4, -1.5, zoom)}) scale(${lerp(0.9, 1.05, zoom)})`}>
        <rect x="-360" y="-330" width="720" height="660" fill={PAPER} filter="url(#pc-shadow)" />
        <image href={LOGO.t2b} x="-330" y="-305" width={110} height={110 / AR.t2} />
        <text x="-200" y="-270" fontFamily={ANTON} fontSize="34" fill={INK} letterSpacing="2">
          TAKE-TWO INTERACTIVE
        </text>
        <text x="-200" y="-232" fontFamily={MONO} fontWeight={700} fontSize="20" fill="#5a4a30">
          DMCA NOTICE · 24 NOV 2026
        </text>
        <rect x="-330" y="-190" width="660" height="4" fill={INK} />
        {[0, 1].map((i) => (
          <rect key={i} x="-320" y={-160 + i * 34} width={600 - i * 120} height="12" fill="#a99f8b" />
        ))}
        {/* the quote */}
        <rect x="-330" y="-60" width={660 * hl} height="200" fill={SUN} opacity=".75" />
        <foreignObject x="-320" y="-58" width="640" height="200">
          <div
            style={{
              fontFamily: `"JetBrains Mono", monospace`,
              fontWeight: 700,
              fontSize: 33,
              lineHeight: "48px",
              color: INK,
            }}
          >
            “...<span style={{ color: RED }}>stolen game files</span> from an <span style={{ color: RED }}>Xbox Series build</span> of Grand Theft Auto VI were publicly distributed.”
          </div>
        </foreignObject>
        {[0, 1, 2].map((i) => (
          <rect key={`b${i}`} x="-320" y={180 + i * 34} width={560 - i * 90} height="12" fill="#a99f8b" />
        ))}
        <text x="330" y="310" textAnchor="end" fontFamily={MONO} fontWeight={700} fontSize="18" fill="#5a4a30">
          — TAKE-TWO'S OWN WORDS
        </text>
      </g>
      <Stamp x={560} y={130} at={c("real...")} text="REAL" size={96} r={8} />
      <Stamp x={300} y={660} at={c("stolen", 1)} text="+ STOLEN" size={96} r={-8} />
    </g>
  );
};

/** "The kid said, 'bring your own files.' Take-Two says that's a trick... because the only files that work are the stolen ones." */
const ByofScene: React.FC<{ f: number }> = ({ f }) => {
  const trick = c("trick...");
  const only = c("only");
  const x = ramp(f, trick + 2, 8);
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0b0d12" />
      {/* the README sticky */}
      <g transform="translate(250,250) rotate(-5)">
        <rect x="-200" y="-150" width="400" height="300" fill="#f2c230" filter="url(#pc-shadow)" />
        <text x="0" y="-80" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="24" fill={INK}>
          LEONIDA README
        </text>
        <text x="0" y="-10" textAnchor="middle" fontFamily={ANTON} fontSize="58" fill={INK}>
          “BRING YOUR
        </text>
        <text x="0" y="60" textAnchor="middle" fontFamily={ANTON} fontSize="58" fill={INK}>
          OWN FILES”
        </text>
        {x > 0 ? (
          <g stroke={RED} strokeWidth="16" strokeLinecap="round">
            <line x1="-180" y1="-130" x2={lerp(-180, 180, x)} y2={lerp(-130, 130, x)} />
            <line x1="180" y1="-130" x2={lerp(180, -180, x)} y2={lerp(-130, 130, x)} />
          </g>
        ) : null}
      </g>
      <Logo href={LOGO.t2w} ar={AR.t2} x={640} y={150} h={140} at={c("Take-Two", 2)} />
      {/* arrow to the only files that work */}
      {f >= only ? (
        <g>
          <path d="M330,450 C380,560 470,600 560,600" fill="none" stroke={SUN} strokeWidth="8" strokeDasharray="400" strokeDashoffset={400 * (1 - ease(ramp(f, only, 10)))} />
          <path d="M540,580 L580,602 L546,630Z" fill={SUN} opacity={ramp(f, only + 8, 3)} />
        </g>
      ) : null}
      {f >= only ? (
        <g transform={`translate(640,560) scale(${sp(f, FPS, only, springs.slam)})`}>
          <rect x="-110" y="-70" width="220" height="150" rx="8" fill={SUN} />
          <rect x="-110" y="-88" width="90" height="26" rx="6" fill={SUN} />
          <text x="0" y="-10" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="22" fill={INK}>
            GTA6_XBOX
          </text>
          <text x="0" y="40" textAnchor="middle" fontFamily={ANTON} fontSize="44" fill={RED}>
            STOLEN
          </text>
        </g>
      ) : null}
      <Tag x={410} y={720} at={c("work")} text="THE ONLY FILES THAT WORK" color={SUN} size={30} />
      <Stamp x={300} y={520} at={trick} text="A TRICK?" size={88} r={-8} />
    </g>
  );
};

/** "His Discord? Gone. And the kid? He quit." */
const EndScene: React.FC<{ f: number }> = ({ f }) => {
  const gone = ease(ramp(f, c("Gone.") - 2, 10));
  const walk = ease(ramp(f, c("kid", 2), 30));
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0a0a0f" />
      <g transform={`translate(230,260) rotate(${gone * -18}) scale(${1 - 0.15 * gone})`} style={{ filter: `grayscale(${gone})` }}>
        <image href={LOGO.dc} x="-130" y="-130" width="260" height="260" opacity={1 - 0.55 * gone} />
      </g>
      {gone > 0 ? (
        <g transform="translate(230,450)" opacity={gone}>
          <rect x="-190" y="-34" width="380" height="64" rx="8" fill="#000" stroke={RED} strokeWidth="4" />
          <text x="0" y="12" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="28" fill={RED}>
            SERVER DELETED
          </text>
        </g>
      ) : null}
      {/* the kid walking away into the dark */}
      <g transform={`translate(${lerp(600, 760, walk)},${700}) scale(${lerp(1.1, 0.75, walk)})`} opacity={1 - 0.6 * walk}>
        <Kid s={1} glow={RED} />
      </g>
      <rect x="0" y="700" width={IMG_W} height="80" fill="#050507" />
      <Stamp x={260} y={640} at={c("Gone.")} text="GONE" size={110} r={-10} />
      <Stamp x={560} y={300} at={c("quit.")} text="HE QUIT" size={100} r={8} />
    </g>
  );
};

type Key = "launch" | "leak" | "kid" | "takedown" | "notice" | "byof" | "end";
const POL: Record<Key, P> = {
  launch: { x: 700, y: 950, r: -2, label: "19 NOV · GTA 6 LAUNCH" },
  leak: { x: 1850, y: 1630, r: 3, label: "20 NOV · THE LEAK" },
  kid: { x: 700, y: 2310, r: -3, label: "21 NOV · LEONIDA" },
  takedown: { x: 1850, y: 2990, r: 2, label: "24 NOV · TAKEDOWN" },
  notice: { x: 700, y: 3670, r: -2, label: "EXHIBIT A · THE NOTICE" },
  byof: { x: 1850, y: 4350, r: 3, label: "THE LOOPHOLE" },
  end: { x: 700, y: 5030, r: -2, label: "THE END" },
};
const ORDER: Key[] = ["launch", "leak", "kid", "takedown", "notice", "byof", "end"];
const SCENES: Record<Key, React.FC<{ f: number }>> = {
  launch: LaunchScene,
  leak: LeakScene,
  kid: KidScene,
  takedown: TakedownScene,
  notice: NoticeScene,
  byof: ByofScene,
  end: EndScene,
};
const pinOf = (p: P) => ({ x: p.x, y: p.y - PH / 2 + 14 });

/* ------------------------------------------------------------------ camera */

type K = { at: number; x: number; y: number; z: number };
const MOVE = 16;
const Z = 0.85;
const camKeys = (): K[] => {
  const v = (p: P, dy = 150) => ({ x: p.x + 70, y: p.y + dy });
  return [
    { at: 0, ...v(POL.launch, 140), z: Z },
    { at: c("Then") - 6, ...v(POL.leak), z: Z },
    { at: c("next") - 6, ...v(POL.kid), z: Z },
    { at: c("But") - 5, ...v(POL.takedown), z: Z },
    { at: c("But", 1) - 5, ...v(POL.notice), z: Z },
    { at: c("kid", 1) - 6, ...v(POL.byof), z: Z },
    { at: c("his", 1) - 5, ...v(POL.end), z: Z },
    { at: c("So...") - 4, x: 1300, y: 3000, z: 0.24 },
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
  const next = keys[i + 1]?.at ?? PC_PORT_FRAMES;
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

/* ------------------------------------------------------------------ full-screen hook (0 .. "GTA 6 just came out") */

const Hook: React.FC<{ f: number }> = ({ f }) => {
  const outAt = c("GTA", 1) - 3;
  if (f > outAt + 10) return null;
  const out = ease(ramp(f, outAt, 9));
  const logo = usePop(0, springs.slam);
  const kidAt = c("fifteenyearold");
  const pcAt = c("PC...");
  const rsAt = c("Rockstar");
  const crushAt = c("crushed");
  const burst = (at: number, len: number) => (f >= at && f < at + len ? 1 - (f - at) / len : 0);
  const g = Math.max(burst(0, 16), burst(pcAt, 6) * 0.5, burst(rsAt, 6) * 0.6, burst(crushAt - 2, 18));
  const flash = Math.max(0, 0.5 - f / 7) + burst(crushAt, 6) * 0.9 + burst(rsAt, 3) * 0.3;
  const shake = g * 36;
  const sx = (rndAt(1, f) - 0.5) * shake;
  const sy = (rndAt(2, f) - 0.5) * shake;
  const crushed = ramp(f, crushAt, 6);
  const load = ease(ramp(f, kidAt + 4, crushAt - kidAt - 4));
  const scene = (
    <g>
      <rect width={SHORT_W} height={SHORT_H} fill="#07070c" />
      <rect width={SHORT_W} height={SHORT_H} fill={RED} opacity={0.16 * crushed + 0.06 * crushed * Math.sin(f / 2)} />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={`sl${i}`} x="0" y={(i * 80 + f * 6) % SHORT_H} width={SHORT_W} height="2" fill={crushed > 0 ? RED : "#2a2f45"} opacity=".35" />
      ))}
      <g transform="translate(0,215)">
        <rect x="60" y="-34" width="250" height="60" fill={RED} />
        <text x="185" y="12" textAnchor="middle" fontFamily={ANTON} fontSize="44" fill="#fff" letterSpacing="4" opacity={Math.floor(f / 8) % 2 ? 1 : 0.55}>
          ● BREAKING
        </text>
        <text x="330" y="10" fontFamily={MONO} fontWeight={700} fontSize="26" fill="#cfd3dc" letterSpacing="2">
          GTA 6 · PC PORT · NOV 2026
        </text>
      </g>
      {/* GTA VI logo slams on frame 0 */}
      <g transform={`translate(490,430) scale(${lerp(2.6, 1, logo)}) rotate(${-3 + (crushed > 0 ? (rndAt(5, f) - 0.5) * 4 : 0)})`}>
        <image href={LOGO.gta} x={-230} y={-230 / AR.gta} width={460} height={460 / AR.gta} filter="url(#pc-shadow)" />
      </g>
      {/* the PC */}
      <g transform="translate(490,930)">
        <Monitor w={600} h={340} frame={crushed > 0 ? "#3a0b10" : "#1b1d24"}>
          <rect width="600" height="340" fill={crushed > 0 ? "#1a0306" : "url(#pc-vice)"} />
          <text x="300" y="80" textAnchor="middle" fontFamily={ANTON} fontSize="64" fill="#fff" letterSpacing="4">
            {f >= pcAt ? "GTA VI · PC" : "GTA VI"}
          </text>
          <rect x="60" y="150" width="480" height="40" fill="rgba(0,0,0,.5)" />
          <rect x="60" y="150" width={480 * load * 0.78} height="40" fill={crushed > 0 ? RED : GREEN} />
          <text x="300" y="250" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="30" fill="#fff">
            {crushed > 0 ? "ERROR · TAKEN DOWN" : `INSTALLING ${Math.round(load * 78)}%`}
          </text>
        </Monitor>
        <g transform="translate(0,-10)">
          <Crack p={ease(crushed)} s={1.4} />
        </g>
        <g transform="translate(0,470)">
          <Kid s={1.4} glow={crushed > 0 ? RED : TEAL} />
        </g>
      </g>
      {/* 15-year-old tag */}
      {f >= kidAt ? (
        <g transform={`translate(490,1440) rotate(-3) scale(${sp(f, FPS, kidAt, springs.slam)})`}>
          <rect x="-300" y="-70" width="600" height="130" fill={SUN} />
          <text x="0" y="36" textAnchor="middle" fontFamily={ANTON} fontSize="104" fill={INK} letterSpacing="4">
            AGE: 15
          </text>
        </g>
      ) : null}
      {f >= rsAt ? (
        <g transform={`translate(490,668) rotate(2) scale(${sp(f, FPS, rsAt, springs.slam)})`}>
          <rect x="-250" y="-46" width="500" height="80" fill="#000" stroke={RED} strokeWidth="5" />
          <text x="0" y="20" textAnchor="middle" fontFamily={ANTON} fontSize="58" fill={RED} letterSpacing="6">
            VS ROCKSTAR
          </text>
        </g>
      ) : null}
      {f >= crushAt ? (
        <g transform="translate(490,930)">
          <Stamp x={0} y={0} at={crushAt} text="CRUSHED" size={150} r={-9} />
        </g>
      ) : null}
    </g>
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${lerp(1, 0.42, out)}) rotate(${-6 * out}deg)` }}>
      <svg width={SHORT_W} height={SHORT_H} viewBox={`0 0 ${SHORT_W} ${SHORT_H}`} style={{ position: "absolute", inset: 0 }}>
        <SvgDefs />
        <g transform={`translate(${sx},${sy})`}>
          <Glitch f={f} g={g} id="pc-hk">
            {scene}
          </Glitch>
        </g>
      </svg>
      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(1, flash) }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ "admits" punch: full-screen flash quote */

const AdmitPunch: React.FC<{ f: number }> = ({ f }) => {
  const at = c("crazy");
  const end = c("In") - 1;
  if (f < at - 2 || f > end + 6) return null;
  const inn = ease(ramp(f, at - 2, 5));
  const out = ease(ramp(f, end, 6));
  const g = f < at + 6 ? 1 - (f - at + 2) / 8 : 0;
  const s = sp(f, FPS, at, springs.slam);
  const scene = (
    <g>
      <rect width={SHORT_W} height={SHORT_H} fill="#050509" opacity={0.88} />
      <g transform={`translate(490,760) rotate(-4) scale(${lerp(2.2, 1, s)})`}>
        <rect x="-380" y="-110" width="760" height="220" fill={SUN} />
        <text x="0" y="-10" textAnchor="middle" fontFamily={ANTON} fontSize="96" fill={INK} letterSpacing="4">
          THE CRAZY
        </text>
        <text x="0" y="86" textAnchor="middle" fontFamily={ANTON} fontSize="96" fill={RED} letterSpacing="4">
          PART...
        </text>
      </g>
    </g>
  );
  return (
    <AbsoluteFill style={{ opacity: inn * (1 - out) }}>
      <svg width={SHORT_W} height={SHORT_H} viewBox={`0 0 ${SHORT_W} ${SHORT_H}`} style={{ position: "absolute", inset: 0 }}>
        <Glitch f={f} g={g} id="pc-ad">
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
      <rect x="-1200" y="-1200" width={BW + 2400} height={BH + 2400} fill="#fff" filter="url(#pc-cork)" />
      {Array.from({ length: 30 }, (_, i) => {
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
      <RedString pts={ORDER.map((k) => pinOf(POL[k]))} at={keys.slice(1, 7).map((k) => k.at)} />

      {/* title card with the GTA VI logo */}
      <g transform={`translate(${POL.launch.x},${POL.launch.y - PH / 2 - 200}) rotate(-3)`}>
        <rect x="-360" y="-150" width="720" height="290" fill="#000" opacity=".45" transform="translate(10,14)" />
        <rect x="-360" y="-150" width="720" height="290" fill={PAPER} />
        <image href={LOGO.gta} x="-340" y="-130" width={250 * AR.gta} height={250} />
        <text x="140" y="-30" textAnchor="middle" fontFamily={ANTON} fontSize="70" fill={INK} letterSpacing="3">
          PC PORT
        </text>
        <text x="140" y="60" textAnchor="middle" fontFamily={ANTON} fontSize="70" fill={RED} letterSpacing="3">
          KILLED
        </text>
        <Pin x={320} y={-140} />
      </g>

      {ORDER.map((k, i) => {
        const S = SCENES[k];
        return (
          <Polaroid key={k} p={POL[k]} at={i === 0 ? -100 : keys[i].at - 6}>
            <S f={f} />
          </Polaroid>
        );
      })}

      {/* side evidence: real logos pinned on the board */}
      <g transform={`translate(${POL.takedown.x - 560},${POL.takedown.y - 420}) rotate(-6)`}>
        <rect x="-150" y="-150" width="300" height="300" fill={PAPER} />
        <image href={LOGO.t2b} x="-120" y={-120 / AR.t2} width="240" height={240 / AR.t2} />
        <Pin x={0} y={-140} />
      </g>
      <g transform={`translate(${POL.kid.x + 560},${POL.kid.y + 380}) rotate(7)`}>
        <rect x="-150" y="-150" width="300" height="300" fill={PAPER} />
        <image href={LOGO.dc} x="-110" y="-110" width="220" height="220" />
        <Pin x={0} y={-140} />
      </g>
      <g transform={`translate(${POL.takedown.x - 560},${POL.takedown.y + 420}) rotate(5)`}>
        <rect x="-150" y="-150" width="300" height="300" fill={PAPER} />
        <image href={LOGO.gh} x="-110" y={-110 / AR.gh} width="220" height={220 / AR.gh} />
        <Pin x={0} y={-140} />
      </g>

      <Note x={POL.leak.x - 330} y={POL.leak.y + 470} r={-6} w={380} h={130} at={c("leaked")} color="#f2c230">
        <text x="0" y="24" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill={INK}>
          20 NOV
        </text>
      </Note>
      <Note x={POL.kid.x + 300} y={POL.kid.y + 480} r={6} w={380} h={130} at={c("next")} color="#f2c230">
        <text x="0" y="24" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill={INK}>
          NEXT DAY
        </text>
      </Note>
    </svg>
  );
};

/* ------------------------------------------------------------------ main */

const EndCard: React.FC = () => {
  const s = usePop(c("So...") - 2);
  const s2 = usePop(c("pirate?") - 2);
  const s3 = usePop(c("Tell") - 2);
  if (s <= 0) return null;
  const box: React.CSSProperties = { padding: "18px 40px", boxShadow: "10px 14px 0 rgba(0,0,0,0.5)", fontFamily: ANTON, whiteSpace: "nowrap", letterSpacing: 3 };
  return (
    <div style={{ position: "absolute", left: 60, width: 840, top: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <img src={LOGO.gta} style={{ width: 330, transform: `scale(${lerp(1.5, 1, s)})`, opacity: clamp01(s * 3), filter: "drop-shadow(6px 10px 0 rgba(0,0,0,.5))" }} />
      <div style={{ ...box, transform: `scale(${lerp(1.6, 1, s)}) rotate(-3deg)`, opacity: clamp01(s * 3), background: PAPER, color: INK, fontSize: 100 }}>
        GENIUS
      </div>
      {s2 > 0 ? (
        <div style={{ ...box, transform: `scale(${lerp(1.6, 1, s2)}) rotate(2deg)`, opacity: clamp01(s2 * 3), background: RED, color: "#fff", fontSize: 100 }}>
          OR PIRATE?
        </div>
      ) : null}
      {s3 > 0 ? (
        <div style={{ transform: `scale(${s3}) rotate(-2deg)`, background: SUN, padding: "12px 30px", fontFamily: ANTON, fontSize: 56, color: INK, letterSpacing: 2 }}>COMMENT BELOW ↓</div>
      ) : null}
    </div>
  );
};

export const GTA6PcPort: React.FC<z.infer<typeof pcPortSchema>> = ({ showCaptions }) => {
  const f = useCurrentFrame();
  const cam = useCamera();
  const keys = camKeys();
  const dark = ease(ramp(f, c("So...") - 4, 10));
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
      <AbsoluteFill style={{ background: "#000", opacity: 0.6 * dark }} />
      <Grain f={f} />
      <AdmitPunch f={f} />
      <Hook f={f} />
      <EndCard />
      <ShortCaptions
        words={WORDS}
        enabled={showCaptions}
        hide={[
          [0, c("GTA", 1) - 2],
          [c("crazy") - 2, c("In") + 2],
          [c("So...") - 2, PC_PORT_FRAMES],
        ]}
        centerY={1250}
        fontSize={60}
        maxWords={4}
        maxChars={22}
        left={170}
        right={170}
        hot={["gta", "6", "pc", "pc.", "stolen", "xbox", "leonida", "discord", "take-two", "taketwo", "deleted", "github", "real", "trick", "gone", "quit", "but", "fifteen", "thousand", "eighty"]}
      />
      <Audio src={staticFile("shorts/pcport/vo.mp3")} />
      <Loop durationInFrames={Math.round(62 * FPS)}>
        <Audio src={staticFile("shorts/cyberleak/bed.mp3")} volume={0.16} />
      </Loop>
      {/* hook */}
      <Sfx name="slam" at={0} volume={1} />
      <Sfx name="glitch" at={0} volume={0.9} />
      <Sfx name="pop" at={c("fifteenyearold")} volume={0.7} />
      <Sfx name="type" at={c("fifteenyearold") + 4} durationInFrames={30} volume={0.35} />
      <Sfx name="glitch" at={c("PC...")} volume={0.5} />
      <Sfx name="slam" at={c("Rockstar")} volume={0.8} />
      <Sfx name="glitch" at={c("crushed") - 2} volume={0.95} />
      <Sfx name="crash" at={c("crushed")} volume={0.9} />
      <Sfx name="stamp" at={c("crushed")} volume={1} />
      <Sfx name="whoosh" at={c("GTA", 1) - 4} volume={0.8} />
      {keys.slice(1, 7).map((k, i) => (
        <Sfx key={i} name="whoosh" at={k.at - 2} volume={0.7} />
      ))}
      {/* launch */}
      <Sfx name="pop" at={c("came")} volume={0.5} />
      <Sfx name="slam" at={c("Console") - 2} volume={0.6} />
      <Sfx name="slam" at={c("Console") + 3} volume={0.6} />
      <Sfx name="error" at={c("No")} volume={0.6} />
      <Sfx name="stamp" at={c("date.")} volume={0.95} />
      {/* leak */}
      <Sfx name="type" at={c("hackers")} durationInFrames={18} volume={0.5} />
      <Sfx name="riser" at={c("leaked")} volume={0.35} />
      <Sfx name="stamp" at={c("stolen")} volume={0.95} />
      <Sfx name="pop" at={c("leaked")} volume={0.4} />
      {/* kid */}
      <Sfx name="pop" at={c("kid")} volume={0.6} />
      <Sfx name="click" at={c("Leonida")} volume={0.7} />
      <Sfx name="type" at={c("run")} durationInFrames={16} volume={0.4} />
      <Sfx name="notify" at={c("Almost") - 3} volume={0.7} />
      <Sfx name="tick" at={c("Almost")} durationInFrames={c("Discord.") - c("Almost")} volume={0.35} />
      <Sfx name="coin" at={c("Discord.")} volume={0.5} />
      {/* takedown */}
      <Sfx name="rumble" at={c("But")} volume={0.6} />
      <Sfx name="slam" at={c("owner,")} volume={0.8} />
      <Sfx name="whoosh" at={c("notice...") - 2} volume={0.7} />
      <Sfx name="slam" at={c("notice...") + 6} volume={0.7} />
      <Sfx name="pop" at={c("GitHub")} volume={0.6} />
      <Sfx name="stamp" at={c("deleted")} volume={1} />
      <Sfx name="error" at={c("plus")} volume={0.5} />
      <Sfx name="tick" at={c("plus")} durationInFrames={c("it.") - c("plus")} volume={0.35} />
      {/* notice twist */}
      <Sfx name="glitch" at={c("crazy") - 2} volume={0.9} />
      <Sfx name="slam" at={c("crazy")} volume={0.9} />
      <Sfx name="rumble" at={c("crazy")} volume={0.6} />
      <Sfx name="type" at={c("admits")} durationInFrames={20} volume={0.3} />
      <Sfx name="stamp" at={c("real...")} volume={0.95} />
      <Sfx name="stamp" at={c("stolen", 1)} volume={1} />
      {/* bring your own files */}
      <Sfx name="pop" at={c("bring")} volume={0.6} />
      <Sfx name="slam" at={c("Take-Two", 2)} volume={0.6} />
      <Sfx name="stamp" at={c("trick...")} volume={0.95} />
      <Sfx name="snap" at={c("trick...") + 2} volume={0.6} />
      <Sfx name="pop" at={c("only")} volume={0.5} />
      <Sfx name="pop" at={c("work")} volume={0.5} />
      {/* end */}
      <Sfx name="error" at={c("Gone.") - 2} volume={0.6} />
      <Sfx name="stamp" at={c("Gone.")} volume={1} />
      <Sfx name="door" at={c("kid", 2)} volume={0.6} />
      <Sfx name="stamp" at={c("quit.")} volume={1} />
      {/* end card */}
      <Sfx name="whoosh" at={c("So...") - 4} volume={0.8} />
      <Sfx name="slam" at={c("So...") - 2} volume={0.8} />
      <Sfx name="slam" at={c("pirate?") - 2} volume={0.8} />
      <Sfx name="pop" at={c("Tell") - 2} volume={0.5} />
    </AbsoluteFill>
  );
};
