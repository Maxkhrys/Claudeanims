import React from "react";
import { AbsoluteFill, Audio, Img, Loop, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { z } from "zod";
import { springs } from "../theme";
import { createCues, sp, type Word } from "../lib/timing";
import { Sfx } from "../components";
import transcript from "../../public/shorts/jensen/words.json";
import { ShortCaptions, SHORT_H, SHORT_W } from "./kit3d";

/*
 * "Nvidia's boss quit over a suspected Chinese spy... and 11 days later he got his job back" (48.6 s).
 * Same noir evidence board as JudgeGTA6 / WalksFreeGTA6, with real photo cut-outs of Jensen Huang.
 * Hook: full-screen glitch shock on frame 0 (RGB tear + flash), RESIGNED stamp flips to REINSTATED.
 * Beats: boss, resign (12 Nov), board ("not coming back"), GTA 6 gag (stamped JOKE), what really
 * happened, back in (day 11, +31%), investigation still open, comment question.
 * The woman in the reports is never shown: only a "?" silhouette marked IDENTITY NOT CONFIRMED.
 * Narration: public/shorts/jensen/vo.mp3 (Gemini TTS, pauses tightened + 6% faster), words.json.
 * Safe zone for key text: x 60..918, y 192..1536; captions small at about 60% down.
 */

loadFont({ family: "Anton", weight: "400", url: staticFile("fonts/Anton-400.woff2") });

export const jensenBackSchema = z.object({ showCaptions: z.boolean() });
export const JENSEN_BACK_FRAMES = 1476;

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
const NV = "#76B900";
const J = (n: string) => staticFile(`shorts/jensen/${n}`);
const GTA_LOGO = staticFile("shorts/judge/gta6-logo.png");

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const ramp = (f: number, a: number, d = 10) => clamp01((f - a) / d);
const usePop = (at: number, cfg = springs.pop) => {
  const f = useCurrentFrame();
  return f < at ? 0 : sp(f, FPS, at, cfg);
};
/* ------------------------------------------------------------------ board pieces */

const SvgDefs: React.FC = () => (
  <defs>
    <filter id="jg-cork" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".45" numOctaves="4" seed="12" />
      <feColorMatrix values="0 0 0 0 .2 0 0 0 0 .13 0 0 0 0 .08 0 0 0 .85 0" />
      <feComposite in2="SourceGraphic" operator="in" />
    </filter>
    <filter id="jg-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="10" result="a" />
      <feMerge>
        <feMergeNode in="a" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="jg-rim" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="-5" stdDeviation="9" floodColor={PINK} floodOpacity=".55" />
    </filter>
    <linearGradient id="jg-sunset" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3a0f5e" />
      <stop offset=".55" stopColor={PINK} />
      <stop offset="1" stopColor="#ff8a00" />
    </linearGradient>
    <linearGradient id="jg-night" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#07051a" />
      <stop offset="1" stopColor="#2a0b4f" />
    </linearGradient>
    <radialGradient id="jg-spot" cx=".5" cy=".42" r=".7">
      <stop offset=".35" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity=".85" />
    </radialGradient>
    <radialGradient id="jg-face" cx=".5" cy="0" r="1">
      <stop offset="0" stopColor={PINK} stopOpacity=".5" />
      <stop offset=".7" stopColor={PINK} stopOpacity="0" />
    </radialGradient>
  </defs>
);

const Pin: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx="6" cy="10" rx="16" ry="8" fill="#000" opacity=".45" />
    <circle r="17" fill="#C4161C" />
    <circle cx="-5" cy="-5" r="6" fill="#ff8a8a" />
  </g>
);

const palmPath =
  "M0,0 C2,-14 3,-26 6,-38 L9,-38 C7,-26 6,-14 6,0Z M7,-38 C-4,-44 -14,-40 -20,-32 C-10,-38 -2,-38 7,-36Z M7,-38 C18,-46 28,-42 32,-34 C22,-40 14,-39 8,-36Z M7,-38 C2,-50 -8,-54 -14,-52 C-6,-50 0,-46 6,-38Z M7,-38 C14,-52 24,-54 28,-50 C20,-50 13,-46 8,-38Z";

/** A polaroid pinned to the board; children draw inside a 820x780 photo. */
const Polaroid: React.FC<{ p: P; at?: number; children: React.ReactNode }> = ({ p, at = -100, children }) => {
  const s = usePop(at, springs.snappy);
  const shown = at < 0 ? 1 : s;
  return (
    <g transform={`translate(${p.x},${p.y}) rotate(${p.r}) scale(${0.85 + 0.15 * shown})`} opacity={clamp01(shown * 2)}>
      <rect x={-PW / 2 + 14} y={-PH / 2 + 22} width={PW} height={PH} fill="#000" opacity=".5" filter="url(#jg-blur)" />
      <rect x={-PW / 2} y={-PH / 2} width={PW} height={PH} fill="#F1ECE2" />
      <svg x={-PW / 2 + 40} y={-PH / 2 + 40} width={IMG_W} height={IMG_H} viewBox={`0 0 ${IMG_W} ${IMG_H}`} overflow="hidden">
        {children}
        <rect width={IMG_W} height={IMG_H} fill="url(#jg-spot)" />
      </svg>
      <text x={0} y={PH / 2 - 62} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={38} fill="#2a2a2a" letterSpacing="3">
        {p.label}
      </text>
      <Pin x={0} y={-PH / 2 + 14} s={1.3} />
    </g>
  );
};

/** A paper note that pops onto the board. */
const Note: React.FC<{ x: number; y: number; r?: number; w: number; h: number; at: number; color?: string; children: React.ReactNode; pin?: boolean }> = ({
  x,
  y,
  r = 0,
  w,
  h,
  at,
  color = PAPER,
  children,
  pin = true,
}) => {
  const s = usePop(at);
  if (s <= 0) return null;
  return (
    <g transform={`translate(${x},${y}) rotate(${r + (1 - s) * 14}) scale(${lerp(1.6, 1, s)})`} opacity={clamp01(s * 3)}>
      <rect x={-w / 2 + 10} y={-h / 2 + 16} width={w} height={h} fill="#000" opacity=".45" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={color} />
      {children}
      {pin ? <Pin x={0} y={-h / 2 + 4} /> : null}
    </g>
  );
};

/** Rubber stamp that slams onto a photo. */
const Stamp: React.FC<{ x: number; y: number; at: number; text: string; color?: string; size?: number; r?: number; sub?: string; until?: number }> = ({
  x,
  y,
  at,
  text,
  color = RED,
  size = 92,
  r = -10,
  sub,
  until,
}) => {
  const s = usePop(at, springs.snappy);
  const fr = useCurrentFrame();
  if (s <= 0 || (until !== undefined && fr >= until)) return null;
  const w = text.length * size * 0.56 + 60;
  const h = size * 1.3 + (sub ? size * 0.5 : 0);
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${lerp(2.4, 1, s)})`} opacity={clamp01(s * 2) * 0.92}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10" fill="rgba(0,0,0,0.35)" stroke={color} strokeWidth={10} />
      <text x={0} y={sub ? -h / 2 + size * 1.05 : size * 0.36} textAnchor="middle" fontFamily={ANTON} fontSize={size} fill={color} letterSpacing="5">
        {text}
      </text>
      {sub ? (
        <text x={0} y={h / 2 - size * 0.25} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={size * 0.38} fill={color}>
          {sub}
        </text>
      ) : null}
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

/** Counts a number up over `dur` frames. */
const countTo = (f: number, at: number, to: number, dur = 26) => Math.round(to * (1 - Math.pow(1 - ramp(f, at, dur), 3)));

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
    <filter id={`jg-grain-${f % 3}`}>
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed={7 + (f % 3)} />
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .08 0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#jg-grain-${f % 3})`} />
  </svg>
);
const SunsetBack: React.FC<{ f: number; w: number; h: number; horizon: number }> = ({ f, w, h, horizon }) => (
  <g>
    <rect width={w} height={h} fill="url(#jg-sunset)" />
    <circle cx={w * 0.5} cy={horizon - 40} r={w * 0.16} fill={SUN} filter="url(#jg-glow)" />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x="0" y={horizon - 70 + i * 22} width={w} height={6 + i * 2} fill="#3a0f5e" opacity=".55" />
    ))}
    <rect y={horizon} width={w} height={h - horizon} fill="#1a0830" />
    {Array.from({ length: 8 }, (_, i) => {
      const x = ((i * 173 - f * 14) % (w + 200) + w + 200) % (w + 200) - 100;
      return <rect key={i} x={x} y={horizon + 30 + (i % 3) * 40} width={90} height={6} fill={TEAL} opacity=".5" />;
    })}
  </g>
);

/* ------------------------------------------------------------------ board layout (world px) */

const BW = 2600;
const BH = 6100;
const PW = 900;
const PH = 1010;
const IMG_W = 820;
const IMG_H = 780;

type P = { x: number; y: number; r: number; label: string };
const POL: Record<"boss" | "resign" | "board" | "gta" | "twist" | "back" | "open", P> = {
  boss: { x: 700, y: 950, r: -2, label: "JENSEN HUANG · NVIDIA" },
  resign: { x: 1850, y: 1620, r: 3, label: "12 NOV 2026 · HE'S OUT" },
  board: { x: 700, y: 2290, r: -3, label: "THE BOARD" },
  gta: { x: 1850, y: 2960, r: 2, label: "19 NOV 2026 · MEANWHILE" },
  twist: { x: 700, y: 3640, r: -2, label: "WHAT ACTUALLY HAPPENED" },
  back: { x: 1850, y: 4320, r: 3, label: "23 NOV 2026 · DAY 11" },
  open: { x: 700, y: 5000, r: -3, label: "CASE FILE" },
};
const pinOf = (p: P) => ({ x: p.x, y: p.y - PH / 2 + 14 });

/* ------------------------------------------------------------------ camera */

type K = { at: number; x: number; y: number; z: number };
const MOVE = 16;
const camKeys = (): K[] => {
  const v = (p: P, dy = 90) => ({ x: p.x + 70, y: p.y + dy });
  return [
    { at: 0, ...v(POL.boss, 60), z: 1.0 },
    { at: c("November") - 8, ...v(POL.resign), z: 1.0 },
    { at: c("board") - 10, ...v(POL.board), z: 1.0 },
    { at: c("But", 0) - 5, ...v(POL.gta), z: 1.0 },
    { at: c("But", 1) - 5, ...v(POL.twist), z: 1.0 },
    { at: c("Day") - 6, ...v(POL.back), z: 1.0 },
    { at: c("But", 2) - 5, ...v(POL.open), z: 1.0 },
    { at: c("So...") - 4, x: 1300, y: 2900, z: 0.3 },
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
  const next = keys[i + 1]?.at ?? JENSEN_BACK_FRAMES;
  const hold = clamp01((f - cur.at - MOVE) / Math.max(1, next - cur.at - MOVE));
  const dip = i > 0 ? 1 - 0.2 * Math.sin(Math.PI * t) : 1;
  return { x: lerp(prev.x, cur.x, e), y: lerp(prev.y, cur.y, e), z: lerp(prev.z, cur.z, e) * dip * (1 + 0.06 * hold), rot: Math.sin(f / 70) * 0.4 };
};

/* ------------------------------------------------------------------ shared drawings */

/** The real photo cut-out (1000x1200) drawn `w` wide with its top-centre at x,y. */
const Jensen: React.FC<{ x: number; y: number; w: number; noir?: boolean; opacity?: number }> = ({ x, y, w, noir = true, opacity = 1 }) => (
  <image href={J("jensen-cut.png")} x={x - w / 2} y={y} width={w} height={w * 1.2} filter={noir ? "url(#jb-noir)" : undefined} opacity={opacity} />
);

const Controller: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <path d="M-80,-30 C-60,-50 60,-50 80,-30 C100,-10 110,30 90,38 C70,44 56,20 40,12 L-40,12 C-56,20 -70,44 -90,38 C-110,30 -100,-10 -80,-30Z" fill="#1d1d22" stroke="#555" strokeWidth="3" />
    <circle cx="55" cy="-20" r="7" fill="#ff4d6d" opacity={f % 8 < 4 ? 1 : 0.4} />
    <circle cx="70" cy="-7" r="7" fill={TEAL} opacity={f % 11 < 5 ? 1 : 0.4} />
    <circle cx="40" cy="-7" r="7" fill={SUN} />
    <path d="M-60,-12 h26 M-47,-25 v26" stroke="#aaa" strokeWidth="7" />
  </g>
);

const Chip: React.FC<{ f: number }> = ({ f }) => (
  <g>
    {Array.from({ length: 6 }, (_, i) => (
      <g key={i}>
        <rect x={-62 + i * 22} y="-84" width="10" height="20" fill="#9a8f7a" />
        <rect x={-62 + i * 22} y="64" width="10" height="20" fill="#9a8f7a" />
        <rect x="-84" y={-62 + i * 22} width="20" height="10" fill="#9a8f7a" />
        <rect x="64" y={-62 + i * 22} width="20" height="10" fill="#9a8f7a" />
      </g>
    ))}
    <rect x="-66" y="-66" width="132" height="132" rx="10" fill="#151515" stroke={NV} strokeWidth="5" />
    <image href={J("nvidia-eye.png")} x="-46" y="-30" width="92" height="59" opacity={0.75 + 0.25 * Math.sin(f / 4)} />
  </g>
);

/** Anonymous silhouette. Deliberately not a real person. */
const Unknown: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <path d="M-120,330 C-120,150 -90,110 0,104 C90,110 120,150 120,330Z" fill="#050505" />
    <path d="M-78,40 C-90,-110 90,-110 78,40 C84,120 100,170 96,210 L-96,210 C-100,170 -84,120 -78,40Z" fill="#050505" />
    <text x="0" y="60" textAnchor="middle" fontFamily={ANTON} fontSize="170" fill={RED} opacity={0.75 + 0.25 * Math.sin(f / 5)} filter="url(#jg-glow)">
      ?
    </text>
  </g>
);

/* ------------------------------------------------------------------ scenes (820x780 photos) */

const BossScene: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={IMG_W} height={IMG_H} fill="#0b1206" />
    <image href={J("nvidia-eye.png")} x="110" y="60" width="600" height="385" opacity=".5" />
    <Jensen x={410} y={90} w={760} />
    <Tag x={590} y={660} at={c("leather")} text="THE LEATHER JACKET" color={SUN} size={30} />
    <Stamp x={410} y={130} at={-100} text="REINSTATED" color={GREEN} size={84} r={-6} />
  </g>
);

const ResignScene: React.FC<{ f: number }> = ({ f }) => {
  const sil = ease(ramp(f, c("one") - 4, 10));
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0d0d10" />
      <image href={J("jensen-casual.jpg")} x="0" y="-20" width="620" height="800" preserveAspectRatio="xMidYMid slice" filter="url(#jb-noir)" />
      {/* torn edge + unknown panel */}
      <g opacity={sil} transform={`translate(${(1 - sil) * 120},0)`}>
        <path d="M470,0 L500,70 L462,150 L506,240 L458,330 L500,420 L464,520 L506,610 L470,700 L496,780 L820,780 L820,0Z" fill="#16131c" stroke="#F1ECE2" strokeWidth="8" />
        <g transform="translate(655,330)">
          <Unknown f={f} />
        </g>
      </g>
      <Stamp x={270} y={570} at={c("resigns.")} text="RESIGNED" size={92} r={-8} />
      <Tag x={250} y={690} at={c("affairs...")} text="REPORTED AFFAIRS" color={SUN} size={32} />
      <Tag x={655} y={90} at={c("woman")} text="IDENTITY" color="#fff" size={26} />
      <Tag x={655} y={140} at={c("woman") + 3} text="NOT CONFIRMED" color="#fff" size={26} />
    </g>
  );
};

const BoardScene: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={IMG_W} height={IMG_H} fill="#121016" />
    <image href={J("nvidia-logo-white.png")} x="290" y="50" width="240" height="178" opacity=".8" />
    <path d="M330,0 L490,0 L640,780 L180,780Z" fill="#fff" opacity=".08" />
    {/* empty chair */}
    <rect x="320" y="290" width="180" height="250" rx="26" fill="#0a0a0d" stroke="#2c2733" strokeWidth="5" />
    <rect x="300" y="520" width="220" height="50" rx="14" fill="#0a0a0d" stroke="#2c2733" strokeWidth="5" />
    {/* table */}
    <path d="M60,600 L760,600 L820,780 L0,780Z" fill="#3b2519" />
    <rect x="60" y="590" width="700" height="18" fill="#4c3021" />
    <g transform="translate(410,640)">
      <rect x="-120" y="-22" width="240" height="44" fill="#d9c9a3" stroke={INK} strokeWidth="3" />
      <text x="0" y="12" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="26" fill={INK}>
        CEO: VACANT
      </text>
    </g>
    <Stamp x={410} y={400} at={c("done.")} text="HE'S DONE" size={100} r={-8} />
    <Tag x={410} y={270} at={c("Not")} text="“NOT COMING BACK”" color={RED} size={34} />
  </g>
);

const GtaScene: React.FC<{ f: number }> = ({ f }) => {
  const logo = f >= c("GTA6") ? sp(f, FPS, c("GTA6"), springs.slam) : 0;
  const up = ease(ramp(f, c("Missing") - 4, 10));
  const pc = ease(ramp(f, c("isn't") - 3, 8));
  const joke = f >= c("Joke.");
  return (
    <g>
      <SunsetBack f={f} w={IMG_W} h={IMG_H} horizon={560} />
      <path d={palmPath} transform="translate(70,575) scale(4.4)" fill="#1a0830" />
      <path d={palmPath} transform="translate(740,575) scale(3.4)" fill="#1a0830" />
      {logo > 0 ? <image href={GTA_LOGO} x={410 - 170 * lerp(2.4, 1, logo)} y={150 - 130 * lerp(2.4, 1, logo)} width={340 * lerp(2.4, 1, logo)} height={258 * lerp(2.4, 1, logo)} /> : null}
      <Tag x={410} y={318} at={c("drops.")} text="OUT 19 NOV 2026" color={SUN} size={32} />
      {/* the gag: the boss with a controller */}
      <g transform={`translate(0,${(1 - up) * 700})`} opacity={1 - 0.75 * pc}>
        <Jensen x={300} y={330} w={520} noir={false} />
        <g transform={`translate(330,${640 + Math.sin(f / 2) * 4}) scale(1.5)`}>
          <Controller f={f} />
        </g>
      </g>
      <Tag x={610} y={420} at={c("Missing")} text="MISSING BOSS" color="#fff" size={30} />
      <Tag x={610} y={480} at={c("Biggest")} text="+ BIGGEST GAME" color="#fff" size={30} />
      <Tag x={610} y={540} at={c("math.")} text="= ???" color={SUN} size={38} />
      {joke ? <rect width={IMG_W} height={IMG_H} fill="#000" opacity={0.35 * ramp(f, c("Joke."), 5)} /> : null}
      <Stamp x={410} y={420} at={c("Joke.")} text="JOKE" size={220} r={-9} sub="NOT REAL" until={c("isn't") - 3} />
      {pc > 0 ? (
        <g transform={`translate(410,470) scale(${lerp(1.5, 1, pc)})`} opacity={pc}>
          <rect x="-170" y="-120" width="340" height="210" rx="12" fill="#0e0e12" stroke="#bbb" strokeWidth="8" />
          <image href={GTA_LOGO} x="-80" y="-90" width="160" height="121" opacity=".9" />
          <rect x="-30" y="90" width="60" height="36" fill="#bbb" />
          <rect x="-100" y="124" width="200" height="16" rx="6" fill="#bbb" />
          <path d="M-150,-150 L150,150 M150,-150 L-150,150" stroke={RED} strokeWidth="26" strokeLinecap="round" />
        </g>
      ) : null}
      <Tag x={410} y={672} at={c("PC.") - 2} text="GTA 6 IS NOT ON PC" color={RED} size={36} />
      {joke ? <Tag x={410} y={36} at={c("Joke.") + 4} text="JOKE · NOT A REAL CLAIM" color={SUN} size={26} /> : null}
    </g>
  );
};

const Strip: React.FC<{ y: number; at: number; head: string; text: string; color?: string; r?: number }> = ({ y, at, head, text, color = INK, r = 0 }) => {
  const s = usePop(at, springs.slam);
  if (s <= 0) return null;
  return (
    <g transform={`translate(410,${y}) rotate(${r + (1 - s) * 10}) scale(${lerp(1.7, 1, s)})`} opacity={clamp01(s * 3)}>
      <rect x="-352" y="-74" width="720" height="160" fill="#000" opacity=".5" />
      <rect x="-360" y="-82" width="720" height="160" fill={PAPER} />
      <text x="-330" y="-28" fontFamily={MONO} fontWeight={700} fontSize="28" fill={RED} letterSpacing="3">
        {head}
      </text>
      <text x="-330" y="48" fontFamily={ANTON} fontSize="68" fill={color} letterSpacing="2">
        {text}
      </text>
    </g>
  );
};

const TwistScene: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={IMG_W} height={IMG_H} fill="#101018" />
    <image href={J("nvidia-eye.png")} x="210" y="250" width="400" height="257" opacity=".12" />
    <Tag x={410} y={70} at={c("here's")} text="THE REAL STORY" color={SUN} size={40} />
    <Strip y={215} at={c("President")} head="THE PRESIDENT" text="BACKS HIM" r={-2} />
    <Strip y={390} at={c("Silicon")} head="SILICON VALLEY" text="RALLIES BEHIND HIM" r={2} />
    <Strip y={565} at={c("Government")} head="US OFFICIALS → THE BOARD" text="NO SECURITY RISK" color="#0b6b2c" r={-1} />
    <Stamp x={600} y={672} at={c("risk.")} text="CLEARED" color={GREEN} size={60} r={-10} />
  </g>
);

const BackScene: React.FC<{ f: number }> = ({ f }) => {
  const o = ease(ramp(f, c("Jensen", 1) - 6, 12));
  const walk = ramp(f, c("walks") - 2, 40);
  const leaf = 180 * (1 - 0.9 * o);
  const cheer = c("cheer.");
  const chartAt = c("stock") - 2;
  const chart = ease(ramp(f, chartAt, 8));
  const line = ease(ramp(f, c("rockets"), 22));
  const pct = countTo(f, c("thirty-one"), 31, 14);
  const pts = Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    const y = t < 0.55 ? 560 - t * 60 + Math.sin(i * 1.7) * 12 : 527 - Math.pow((t - 0.55) / 0.45, 1.6) * 330 + Math.sin(i * 2.1) * 8;
    return `${110 + t * 600},${y}`;
  });
  const shown = Math.max(2, Math.round(pts.length * line));
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0c1107" />
      {/* doorway with green light */}
      <rect x="230" y="200" width="360" height="580" fill={NV} opacity={0.35 + 0.5 * o} />
      <path d="M230,200 L590,200 L800,780 L20,780Z" fill={NV} opacity={0.14 * o} />
      <path d="M0,0 H820 V780 H590 V200 H230 V780 H0Z" fill="#17191c" />
      <rect x="0" y="130" width="820" height="40" fill="#22262a" />
      <image href={J("nvidia-logo-white.png")} x="330" y="6" width="160" height="118" />
      <rect x="230" y="200" width={leaf} height="580" fill="#2a2f33" stroke="#0c0e10" strokeWidth="6" />
      <rect x={590 - leaf} y="200" width={leaf} height="580" fill="#2a2f33" stroke="#0c0e10" strokeWidth="6" />
      {o > 0 ? <Jensen x={410} y={lerp(330, 150, walk)} w={lerp(300, 720, walk)} noir={false} opacity={clamp01(o * 2)} /> : null}
      {/* confetti when employees cheer */}
      {f >= cheer
        ? Array.from({ length: 46 }, (_, i) => {
            const t = (f - cheer) / 30;
            const x = 410 + (((i * 97) % 760) - 380) * Math.min(1, t * 1.6);
            const y = 300 - Math.sin(Math.min(1, t) * Math.PI * 0.6) * (260 + ((i * 53) % 200)) + t * t * 260 + ((i * 31) % 120);
            return <rect key={i} x={x} y={y} width="16" height="9" fill={[NV, SUN, "#fff", GREEN][i % 4]} transform={`rotate(${i * 40 + f * 9},${x},${y})`} opacity={clamp01(2.2 - t)} />;
          })
        : null}
      <Stamp x={410} y={590} at={c("in.")} text="REINSTATED" color={GREEN} size={92} r={-6} sub="23 NOV 2026" until={chartAt} />
      <Tag x={410} y={250} at={cheer} text="EMPLOYEES CHEER" color={SUN} size={32} />
      {chart > 0 ? (
        <g opacity={chart}>
          <rect width={IMG_W} height={IMG_H} fill="#020503" opacity=".9" />
          <image href={J("nvidia-logo-white.png")} x="60" y="40" width="150" height="111" />
          <text x="230" y="112" fontFamily={MONO} fontWeight={700} fontSize="34" fill="#9fb09f">
            NVDA · STOCK
          </text>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="90" x2="730" y1={220 + i * 120} y2={220 + i * 120} stroke="#1c2a1c" strokeWidth="3" />
          ))}
          <polyline points={pts.slice(0, shown).join(" ")} fill="none" stroke={GREEN} strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" filter="url(#jg-glow)" />
          {f >= c("thirty-one") ? (
            <text x="430" y="700" textAnchor="middle" fontFamily={ANTON} fontSize="170" fill={GREEN} filter="url(#jg-glow)">
              +{pct}%
            </text>
          ) : null}
        </g>
      ) : null}
    </g>
  );
};

const OpenScene: React.FC<{ f: number }> = ({ f }) => {
  const openF = ease(ramp(f, c("investigation") - 2, 12));
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#15110d" />
      <g transform="translate(410,420)">
        <rect x="-300" y="-250" width="600" height="520" fill="#f3ecd9" transform={`rotate(${-3 * openF})`} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="-250" y={-170 + i * 60} width={i % 2 ? 380 : 480} height="22" fill="#111" opacity={i === 1 || i === 3 ? 1 : 0.25} transform={`rotate(${-3 * openF})`} />
        ))}
        <path d={`M-320,-270 L-120,-270 L-90,-230 L320,-230 L320,290 L-320,290Z`} fill="#c9a660" transform={`translate(0,${openF * 250}) rotate(${4 * openF})`} />
        <g transform={`translate(0,${openF * 250}) rotate(${4 * openF})`}>
          <text x="0" y="-90" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="34" fill="#4a3a16" letterSpacing="4">
            BOARD INVESTIGATION
          </text>
          <image href={J("nvidia-logo.png")} x="-90" y="-60" width="180" height="133" opacity=".85" />
        </g>
      </g>
      <Tag x={410} y={90} at={c("spy", 1)} text="THE REPORTED SPY LINK" color={RED} size={34} />
      <Stamp x={410} y={400} at={c("Still")} text="STILL OPEN" size={130} r={-8} />
    </g>
  );
};

/* ------------------------------------------------------------------ full-screen hook (0 .. "Jensen") */

const Hook: React.FC<{ f: number }> = ({ f }) => {
  const outAt = c("Jensen") - 4;
  if (f > outAt + 10) return null;
  const out = ease(ramp(f, outAt, 9));
  const quit = c("quit");
  const spy = c("suspected");
  const days = c("eleven");
  const got = c("got");
  const back = f >= got;
  // glitch bursts: frame 0, the stamp, and the flip
  const burst = (at: number, len: number) => (f >= at && f < at + len ? 1 - (f - at) / len : 0);
  const g = Math.max(burst(0, 14), burst(quit, 6) * 0.7, burst(got - 2, 12));
  const rnd = (n: number) => {
    const x = Math.sin(n * 127.1 + f * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const flash = Math.max(0, 0.32 - f / 8) + burst(got, 5) * 0.8 + burst(quit, 3) * 0.4;
  const shake = g * 30;
  const sx = (rnd(1) - 0.5) * shake;
  const sy = (rnd(2) - 0.5) * shake;
  const zoom = lerp(1.25, 1, ease(ramp(f, 0, 10))) + 0.0006 * f;
  const day = Math.min(11, 1 + Math.floor(ramp(f, days, c("later,") - days + 6) * 10.99));
  const tint = back ? NV : RED;
  const Scene = (
    <g>
      <rect width={SHORT_W} height={SHORT_H} fill={back ? "#0a1404" : "#170406"} />
      <rect width={SHORT_W} height={SHORT_H} fill={tint} opacity=".16" />
      <g transform={`translate(540,760) scale(${zoom}) translate(-540,-760)`}>
        <image href={J("nvidia-logo-white.png")} x="340" y="210" width="400" height="296" />
        <image href={J("jensen-cut.png")} x="-10" y="470" width="1100" height="1320" />
      </g>
      <rect y="1500" width={SHORT_W} height="420" fill="url(#jb-fade)" />
    </g>
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${lerp(1, 0.42, out)}) rotate(${-6 * out}deg)` }}>
      <svg width={SHORT_W} height={SHORT_H} viewBox={`0 0 ${SHORT_W} ${SHORT_H}`} style={{ position: "absolute", inset: 0 }}>
        <SvgDefs />
        <defs>
          <linearGradient id="jb-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity=".9" />
          </linearGradient>
          <filter id="jb-r">
            <feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id="jb-c">
            <feColorMatrix values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
        <g transform={`translate(${sx},${sy})`}>
          {Scene}
          {g > 0.02 ? (
            <g>
              <g filter="url(#jb-r)" transform={`translate(${-46 * g},0)`} style={{ mixBlendMode: "screen" }} opacity=".9">
                {Scene}
              </g>
              <g filter="url(#jb-c)" transform={`translate(${46 * g},0)`} style={{ mixBlendMode: "screen" }} opacity=".9">
                {Scene}
              </g>
              {Array.from({ length: 9 }, (_, i) => {
                const y = rnd(i + 10) * SHORT_H;
                const h = 20 + rnd(i + 30) * 150;
                const dx = (rnd(i + 50) - 0.5) * 420 * g;
                return (
                  <g key={i} clipPath={`inset(${y}px 0 ${Math.max(0, SHORT_H - y - h)}px 0)`} transform={`translate(${dx},0)`}>
                    {Scene}
                  </g>
                );
              })}
              {Array.from({ length: 5 }, (_, i) => (
                <rect key={`b${i}`} x="0" y={rnd(i + 80) * SHORT_H} width={SHORT_W} height={6 + rnd(i + 90) * 26} fill={[PINK, TEAL, "#fff", NV, RED][i]} opacity={0.75 * g} />
              ))}
            </g>
          ) : null}
          {/* stamp: RESIGNED, then flips to REINSTATED */}
          {!back ? (
            <g transform="translate(500,925)">
              <Stamp x={0} y={0} at={quit} text="RESIGNED" size={150} r={-9} sub="12 NOV 2026" />
            </g>
          ) : (
            <g transform="translate(500,925)">
              <Stamp x={0} y={0} at={got} text="REINSTATED" color={GREEN} size={132} r={-7} sub="11 DAYS LATER" />
            </g>
          )}
          {f >= spy && !back ? (
            <g transform={`translate(${lerp(1300, 500, ease(ramp(f, spy, 7)))},1330) rotate(4)`}>
              <rect x="-330" y="-62" width="660" height="124" fill={PAPER} />
              <text x="0" y="-12" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="26" fill={RED} letterSpacing="3">
                REPORTED · NOT PROVEN
              </text>
              <text x="0" y="44" textAnchor="middle" fontFamily={ANTON} fontSize="54" fill={INK} letterSpacing="2">
                SUSPECTED CHINESE SPY LINK
              </text>
            </g>
          ) : null}
          {f >= days ? (
            <g transform={`translate(500,${back ? 1330 : 1500}) rotate(-3) scale(${0.9 + 0.1 * Math.sin(f)})`}>
              <rect x="-170" y="-70" width="340" height="140" fill={SUN} />
              <text x="0" y="36" textAnchor="middle" fontFamily={ANTON} fontSize="100" fill={INK} letterSpacing="3">
                DAY {day}
              </text>
            </g>
          ) : null}
        </g>
      </svg>
      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(1, flash) }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ the board */

const Board: React.FC<{ f: number }> = ({ f }) => {
  const order = [POL.boss, POL.resign, POL.board, POL.gta, POL.twist, POL.back, POL.open];
  const keys = camKeys();
  const spyNote = { x: POL.resign.x - 330, y: POL.resign.y + 470 };
  return (
    <svg width={BW} height={BH} viewBox={`0 0 ${BW} ${BH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <SvgDefs />
      <defs>
        <filter id="jg-blur">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="jb-noir">
          <feColorMatrix type="saturate" values="0.18" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.25" intercept="-0.06" />
            <feFuncG type="linear" slope="1.25" intercept="-0.06" />
            <feFuncB type="linear" slope="1.2" intercept="-0.06" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect x="-1200" y="-1200" width={BW + 2400} height={BH + 2400} fill="#1a120c" />
      <rect x="-1200" y="-1200" width={BW + 2400} height={BH + 2400} fill="#fff" filter="url(#jg-cork)" />
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
      <RedString pts={order.map(pinOf)} at={keys.slice(1, 7).map((k) => k.at)} />
      <RedString pts={[{ x: POL.resign.x + 240, y: POL.resign.y + 60 }, { x: spyNote.x + 60, y: spyNote.y - 110 }]} at={[c("US") - 2]} />

      {/* title card */}
      <g transform={`translate(${POL.boss.x},${POL.boss.y - PH / 2 - 180}) rotate(-3)`}>
        <rect x="-330" y="-130" width="660" height="250" fill="#000" opacity=".45" transform="translate(10,14)" />
        <rect x="-330" y="-130" width="660" height="250" fill={PAPER} />
        <image href={J("nvidia-logo.png")} x="-300" y="-110" width="250" height="185" />
        <text x="-20" y="-20" fontFamily={ANTON} fontSize="62" fill={INK} letterSpacing="3">
          THE BOSS
        </text>
        <text x="-20" y="50" fontFamily={ANTON} fontSize="62" fill={RED} letterSpacing="3">
          IS BACK?!
        </text>
        <Pin x={300} y={-120} />
      </g>

      <Polaroid p={POL.boss}>
        <BossScene f={f} />
      </Polaroid>
      <Note x={POL.boss.x + 250} y={POL.boss.y + 470} r={6} w={420} h={300} at={c("chips")}>
        <g transform="translate(-110,10) scale(.95)">
          <Chip f={f} />
        </g>
        <text x="95" y="-20" textAnchor="middle" fontFamily={ANTON} fontSize="46" fill={INK}>
          THE CHIPS
        </text>
        <text x="95" y="36" textAnchor="middle" fontFamily={ANTON} fontSize="46" fill="#3d6b00">
          THAT RUN
        </text>
        <text x="95" y="92" textAnchor="middle" fontFamily={ANTON} fontSize="46" fill="#3d6b00">
          ALL OF AI
        </text>
      </Note>

      <Polaroid p={POL.resign} at={keys[1].at - 6}>
        <ResignScene f={f} />
      </Polaroid>
      <Note x={POL.resign.x - 280} y={POL.resign.y - 470} r={-6} w={330} h={130} at={c("November")} color="#f2c230">
        <text x="0" y="24" textAnchor="middle" fontFamily={ANTON} fontSize="70" fill={INK}>
          12 NOV
        </text>
      </Note>
      <Note x={spyNote.x} y={spyNote.y} r={-3} w={700} h={270} at={c("US") - 2} color="#d9c9a3">
        <text x="0" y="-78" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="27" fill={RED} letterSpacing="2">
          REPORTED · NOT PROVEN
        </text>
        <text x="0" y="-10" textAnchor="middle" fontFamily={ANTON} fontSize="52" fill={INK} letterSpacing="1">
          US OFFICIALS REPORTEDLY
        </text>
        <text x="0" y="50" textAnchor="middle" fontFamily={ANTON} fontSize="52" fill={INK} letterSpacing="1">
          SUSPECT TIES TO
        </text>
        <text x="0" y="110" textAnchor="middle" fontFamily={ANTON} fontSize="52" fill={RED} letterSpacing="1">
          CHINESE INTELLIGENCE
        </text>
      </Note>

      <Polaroid p={POL.board} at={keys[2].at - 6}>
        <BoardScene f={f} />
      </Polaroid>
      <Polaroid p={POL.gta} at={keys[3].at - 6}>
        <GtaScene f={f} />
      </Polaroid>
      <Polaroid p={POL.twist} at={keys[4].at - 6}>
        <TwistScene f={f} />
      </Polaroid>
      <Polaroid p={POL.back} at={keys[5].at - 6}>
        <BackScene f={f} />
      </Polaroid>
      <Note x={POL.back.x - 280} y={POL.back.y - 470} r={-6} w={330} h={130} at={c("Day")} color="#f2c230">
        <text x="0" y="24" textAnchor="middle" fontFamily={ANTON} fontSize="70" fill={INK}>
          DAY 11
        </text>
      </Note>
      <Polaroid p={POL.open} at={keys[6].at - 6}>
        <OpenScene f={f} />
      </Polaroid>
    </svg>
  );
};

/* ------------------------------------------------------------------ main */

const EndCard: React.FC = () => {
  const s = usePop(c("beat") - 2);
  const s2 = usePop(c("or") + 2);
  const s3 = usePop(c("Comment") - 2);
  if (s <= 0) return null;
  const box: React.CSSProperties = { padding: "18px 40px", boxShadow: "10px 14px 0 rgba(0,0,0,0.5)", fontFamily: ANTON, whiteSpace: "nowrap", color: INK, letterSpacing: 3 };
  return (
    <div style={{ position: "absolute", left: 60, width: 840, top: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ ...box, transform: `scale(${lerp(1.6, 1, s)}) rotate(-3deg)`, opacity: clamp01(s * 3), background: PAPER, fontSize: 80 }}>
        BEAT THE <span style={{ color: RED }}>SCANDAL?</span>
      </div>
      {s2 > 0 ? (
        <div style={{ ...box, transform: `scale(${lerp(1.6, 1, s2)}) rotate(2deg)`, opacity: clamp01(s2 * 3), background: PAPER, fontSize: 66, display: "flex", alignItems: "center", gap: 18 }}>
          OR FINISHED <Img src={GTA_LOGO} style={{ height: 120, margin: "-18px 0" }} /> <span style={{ color: RED }}>STORY MODE?</span>
        </div>
      ) : null}
      {s3 > 0 ? (
        <div style={{ transform: `scale(${s3}) rotate(-2deg)`, background: SUN, padding: "12px 30px", fontFamily: ANTON, fontSize: 52, color: INK, letterSpacing: 2 }}>COMMENT BELOW ↓</div>
      ) : null}
    </div>
  );
};

export const JensenBack: React.FC<z.infer<typeof jensenBackSchema>> = ({ showCaptions }) => {
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
      <Hook f={f} />
      <EndCard />
      <ShortCaptions
        words={WORDS}
        enabled={showCaptions}
        hide={[]}
        centerY={1150}
        fontSize={60}
        maxWords={4}
        maxChars={22}
        left={170}
        right={170}
        hot={["nvidias", "nvidia", "spy", "resigns", "gta6", "joke", "pc", "president", "risk", "back", "thirtyone", "percent", "open", "scandal", "done", "eleven"]}
      />
      <Audio src={J("vo.mp3")} />
      <Loop durationInFrames={Math.round(62 * FPS)}>
        <Audio src={staticFile("shorts/cyberleak/bed.mp3")} volume={0.16} />
      </Loop>
      <Sfx name="slam" at={0} volume={0.95} />
      <Sfx name="glitch" at={0} volume={0.8} />
      <Sfx name="stamp" at={c("quit")} volume={0.9} />
      <Sfx name="whoosh" at={c("suspected")} volume={0.6} />
      <Sfx name="tick" at={c("eleven")} durationInFrames={c("got") - c("eleven")} loop volume={0.5} />
      <Sfx name="glitch" at={c("got") - 2} volume={0.8} />
      <Sfx name="slam" at={c("got")} volume={0.9} />
      <Sfx name="whoosh" at={c("Jensen") - 4} volume={0.8} />
      {keys.slice(1).map((k, i) => (
        <Sfx key={i} name="whoosh" at={k.at - 2} volume={0.7} />
      ))}
      {[c("leather"), c("chips"), c("November"), c("affairs..."), c("woman"), c("US") - 2, c("Not"), c("drops."), c("Missing"), c("Biggest"), c("math."), c("here's"), c("Day"), c("spy", 1)].map((a, i) => (
        <Sfx key={`p${i}`} name="pop" at={a} volume={0.5} />
      ))}
      <Sfx name="stamp" at={c("resigns.")} volume={0.9} />
      <Sfx name="stamp" at={c("done.")} volume={0.9} />
      <Sfx name="slam" at={c("GTA6")} volume={0.85} />
      <Sfx name="stamp" at={c("Joke.")} volume={1} />
      <Sfx name="error" at={c("isn't") - 3} volume={0.6} />
      {[c("President"), c("Silicon"), c("Government")].map((a, i) => (
        <Sfx key={`s${i}`} name="slam" at={a} volume={0.7} />
      ))}
      <Sfx name="stamp" at={c("risk.")} volume={0.8} />
      <Sfx name="door" at={c("Jensen", 1) - 6} volume={0.8} />
      <Sfx name="stamp" at={c("in.")} volume={0.9} />
      <Sfx name="notify" at={c("cheer.")} volume={0.6} />
      <Sfx name="riser" at={c("stock") - 2} volume={0.5} />
      <Sfx name="coin" at={c("thirty-one")} volume={0.7} />
      <Sfx name="stamp" at={c("Still")} volume={0.9} />
      <Sfx name="slam" at={c("beat") - 2} volume={0.7} />
      <Sfx name="pop" at={c("or") + 2} volume={0.6} />
      <Sfx name="pop" at={c("Comment") - 2} volume={0.5} />
    </AbsoluteFill>
  );
};
