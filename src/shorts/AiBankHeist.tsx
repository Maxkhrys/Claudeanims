import React from "react";
import { AbsoluteFill, Audio, Loop, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { z } from "zod";
import { springs } from "../theme";
import { createCues, sp, type Word } from "../lib/timing";
import { Sfx } from "../components";
import transcript from "../../public/shorts/aibank/words.json";
import { ShortCaptions, SHORT_H, SHORT_W } from "./kit3d";

/*
 * "Hackers just stole a hundred million euros from a bank... and the bank says AI helped them do it" (45.4 s).
 * Crédit Mutuel Arkéa, 1-3 Nov 2026 (PC Gamer 13 Nov, Notebookcheck 15 Nov, both from the chair's AFP interview).
 * Same noir evidence board as JudgeGTA6 / WalksFreeGTA6 / JensenBack.
 * Hook: full-screen glitch shock on frame 0, a €100,000,000 counter drains to zero, then a red AI eye takes over.
 * Beats: Sunday at the bank, in through a supplier, fake accounts + instant payments, 21 hours -> crypto,
 * a crypto detective sees it, day 3, the chair's AI quote (always shown as HIS words), no arrests, question.
 * Narration: public/shorts/aibank/vo.mp3 (Max's Gemini take, pauses capped at 0.3 s, 4% faster), words.json.
 * Safe zone for key text: x 60..918, y 192..1536; captions small at about 60% down.
 */

loadFont({ family: "Anton", weight: "400", url: staticFile("fonts/Anton-400.woff2") });

export const aiBankSchema = z.object({ showCaptions: z.boolean() });
export const AI_BANK_FRAMES = 1380;

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

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const ramp = (f: number, a: number, d = 10) => clamp01((f - a) / d);
const usePop = (at: number, cfg = springs.pop) => {
  const f = useCurrentFrame();
  return f < at ? 0 : sp(f, FPS, at, cfg);
};
const euro = (n: number) => "€" + Math.round(n).toLocaleString("en-US");
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
const BH = 6600;
const PW = 900;
const PH = 1010;
const IMG_W = 820;
const IMG_H = 780;

type P = { x: number; y: number; r: number; label: string };
type Key = "bank" | "door" | "fake" | "hours" | "seen" | "day3" | "ai" | "open";
const POL: Record<Key, P> = {
  bank: { x: 700, y: 950, r: -2, label: "1 NOV 2026 · SUNDAY" },
  door: { x: 1850, y: 1630, r: 3, label: "THE WAY IN" },
  fake: { x: 700, y: 2310, r: -3, label: "FAKE ACCOUNTS" },
  hours: { x: 1850, y: 2990, r: 2, label: "21 HOURS" },
  seen: { x: 700, y: 3670, r: -2, label: "SOMEONE SAW IT" },
  day3: { x: 1850, y: 4350, r: 3, label: "3 NOV 2026 · DAY 3" },
  ai: { x: 700, y: 5030, r: -2, label: "THE BANK'S CHAIRMAN" },
  open: { x: 1850, y: 5710, r: 2, label: "CASE FILE" },
};
const ORDER: Key[] = ["bank", "door", "fake", "hours", "seen", "day3", "ai", "open"];
const pinOf = (p: P) => ({ x: p.x, y: p.y - PH / 2 + 14 });

/* ------------------------------------------------------------------ camera */

type K = { at: number; x: number; y: number; z: number };
const MOVE = 16;
const camKeys = (): K[] => {
  const v = (p: P, dy = 90) => ({ x: p.x + 70, y: p.y + dy });
  return [
    { at: 0, ...v(POL.bank, 60), z: 1.0 },
    { at: c("hackers", 1) - 6, ...v(POL.door), z: 1.0 },
    { at: c("make") - 8, ...v(POL.fake), z: 1.0 },
    { at: c("twentyone") - 8, ...v(POL.hours), z: 1.0 },
    { at: c("But") - 5, ...v(POL.seen), z: 1.0 },
    { at: c("only") - 8, ...v(POL.day3), z: 1.0 },
    { at: c("Their") - 5, ...v(POL.ai), z: 1.0 },
    { at: c("Nobody's") - 6, ...v(POL.open), z: 1.0 },
    { at: c("So") - 4, x: 1300, y: 3300, z: 0.28 },
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
  const next = keys[i + 1]?.at ?? AI_BANK_FRAMES;
  const hold = clamp01((f - cur.at - MOVE) / Math.max(1, next - cur.at - MOVE));
  const dip = i > 0 ? 1 - 0.2 * Math.sin(Math.PI * t) : 1;
  return { x: lerp(prev.x, cur.x, e), y: lerp(prev.y, cur.y, e), z: lerp(prev.z, cur.z, e) * dip * (1 + 0.06 * hold), rot: Math.sin(f / 70) * 0.4 };
};

/* ------------------------------------------------------------------ shared drawings */

/** A classic bank front: pediment, columns, name plate. Drawn around (0,0), ~560 wide. */
const BankFront: React.FC<{ lit?: number }> = ({ lit = 0 }) => (
  <g>
    <path d="M-300,-170 L0,-300 L300,-170Z" fill="#d9d2c2" stroke="#6b6458" strokeWidth="6" />
    <rect x="-300" y="-170" width="600" height="40" fill="#cbc3b1" />
    <rect x="-250" y="-118" width="500" height="52" fill="#141414" />
    <text x="0" y="-80" textAnchor="middle" fontFamily={ANTON} fontSize="36" fill={SUN} letterSpacing="3">
      CRÉDIT MUTUEL ARKÉA
    </text>
    {[-230, -130, -30, 70, 170].map((x) => (
      <rect key={x} x={x} y="-60" width="60" height="300" fill="#e7e0d0" stroke="#8d8576" strokeWidth="4" />
    ))}
    <rect x="-320" y="240" width="640" height="40" fill="#bdb5a3" />
    <rect x="-55" y="70" width="110" height="170" fill={lit > 0 ? `rgba(255,210,63,${0.25 + 0.6 * lit})` : "#2a2620"} />
  </g>
);

/** Hooded figure silhouette, ~140 tall, feet at (0,0). */
const Hood: React.FC<{ s?: number; eye?: string }> = ({ s = 1, eye = RED }) => (
  <g transform={`scale(${s})`}>
    <path d="M-46,0 C-50,-60 -40,-92 0,-96 C40,-92 50,-60 46,0Z" fill="#060606" />
    <path d="M-30,-92 C-36,-150 36,-150 30,-92 C26,-82 -26,-82 -30,-92Z" fill="#060606" />
    <circle cx="-9" cy="-112" r="4" fill={eye} />
    <circle cx="9" cy="-112" r="4" fill={eye} />
  </g>
);

/** Glowing AI eye: concentric rings + circuit traces. Drawn around (0,0), radius ~r. */
const AiEye: React.FC<{ f: number; r?: number; color?: string }> = ({ f, r = 200, color = RED }) => {
  const pulse = 0.85 + 0.15 * Math.sin(f / 4);
  return (
    <g>
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 + 0.3;
        const x1 = Math.cos(a) * r * 1.05;
        const y1 = Math.sin(a) * r * 1.05;
        const x2 = Math.cos(a) * r * 1.9;
        const y2 = Math.sin(a) * r * 1.9;
        return (
          <g key={i} opacity=".7">
            <path d={`M${x1},${y1} L${(x1 + x2) / 2},${y1} L${x2},${y2}`} fill="none" stroke={color} strokeWidth="5" />
            <circle cx={x2} cy={y2} r="9" fill={color} opacity={((f + i * 5) % 20) < 10 ? 1 : 0.35} />
          </g>
        );
      })}
      <circle r={r} fill="#0a0204" stroke={color} strokeWidth="10" filter="url(#jg-glow)" />
      <circle r={r * 0.72} fill="none" stroke={color} strokeWidth="4" strokeDasharray="18 12" transform={`rotate(${f * 3})`} opacity=".8" />
      <circle r={r * 0.46 * pulse} fill={color} opacity=".9" filter="url(#jg-glow)" />
      <circle r={r * 0.18} fill="#fff" />
    </g>
  );
};

const EthCoin: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <circle r="40" fill="#1b1f3a" stroke={TEAL} strokeWidth="5" />
    <path d="M0,-26 L16,2 L0,11 L-16,2Z" fill={TEAL} />
    <path d="M0,15 L16,6 L0,28 L-16,6Z" fill={TEAL} opacity=".75" />
  </g>
);

const EuroCoin: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <circle r="40" fill="#c9a23a" stroke="#8a6a12" strokeWidth="5" />
    <text x="0" y="17" textAnchor="middle" fontFamily={ANTON} fontSize="50" fill="#5a440a">
      €
    </text>
  </g>
);

/* ------------------------------------------------------------------ scenes (820x780 photos) */

const BankScene: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect width={IMG_W} height={IMG_H} fill="url(#jg-night)" />
    {Array.from({ length: 24 }, (_, i) => (
      <circle key={i} cx={(i * 137) % IMG_W} cy={(i * 59) % 260} r="2.5" fill="#fff" opacity={0.4 + 0.4 * Math.sin(i + f / 9)} />
    ))}
    <circle cx="680" cy="110" r="46" fill="#f2ecd8" opacity=".9" />
    <g transform="translate(410,440) scale(1.05)">
      <BankFront />
    </g>
    <rect y="720" width={IMG_W} height="60" fill="#0a0910" />
    <Tag x={410} y={70} at={c("French")} text="A FRENCH BANK" color={SUN} size={34} />
    <Tag x={410} y={690} at={c("Sunday.")} text="CLOSED · SUNDAY" color="#fff" size={28} />
  </g>
);

const DoorScene: React.FC<{ f: number }> = ({ f }) => {
  const open = ease(ramp(f, c("walk") - 2, 12));
  const walk = ramp(f, c("walk"), 50);
  const hacked = f >= c("trusted.");
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#121016" />
      {/* main vault door: locked */}
      <g transform="translate(230,400)">
        <circle r="190" fill="#3a3d42" stroke="#1b1c1f" strokeWidth="14" />
        <circle r="150" fill="#4a4e54" stroke="#2a2c30" strokeWidth="8" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x="-8" y="-150" width="16" height="70" fill="#2a2c30" transform={`rotate(${i * 60})`} />
        ))}
        <circle r="40" fill="#2a2c30" />
      </g>
      <Stamp x={230} y={400} at={c("break")} text="NO BREAK-IN" size={60} r={-12} />
      {/* side door: the supplier */}
      <g transform="translate(610,560)">
        <rect x="-110" y="-330" width="220" height="330" fill={SUN} opacity={0.2 + 0.6 * open} />
        <rect x="-110" y="-330" width={220 * (1 - 0.85 * open)} height="330" fill="#2b2f35" stroke="#0c0e10" strokeWidth="6" />
        <rect x="-120" y="-390" width="240" height="50" fill={hacked ? RED : "#d9c9a3"} />
        <text x="0" y="-354" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="28" fill={hacked ? "#fff" : INK}>
          {hacked ? "SUPPLIER · HACKED" : "SUPPLIER"}
        </text>
        {open > 0.3
          ? [0, 1, 2].map((i) => {
              const t = clamp01(walk * 1.4 - i * 0.2);
              return (
                <g key={i} transform={`translate(${lerp(-20, 30, t) + i * 40},${-10 + i * 6}) `} opacity={clamp01(t * 4)}>
                  <Hood s={lerp(1.4, 0.8, t)} />
                </g>
              );
            })
          : null}
      </g>
      <Tag x={610} y={90} at={c("supplier")} text="A TRUSTED SUPPLIER" color={SUN} size={30} />
      <path d={`M430,640 L540,640`} stroke={SUN} strokeWidth="8" opacity={open} markerEnd="" />
      <rect y="700" width={IMG_W} height="80" fill="#0b0a0d" />
    </g>
  );
};

const Iban: React.FC<{ x: number; y: number; r: number; at: number; code: string }> = ({ x, y, r, at, code }) => {
  const s = usePop(at, springs.slam);
  if (s <= 0) return null;
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${lerp(1.8, 1, s)})`} opacity={clamp01(s * 3)}>
      <rect x="-230" y="-70" width="460" height="140" rx="14" fill="#0d1a2a" stroke={TEAL} strokeWidth="4" />
      <text x="-205" y="-22" fontFamily={MONO} fontWeight={700} fontSize="24" fill="#7fa7c9" letterSpacing="2">
        IBAN
      </text>
      <text x="-205" y="30" fontFamily={MONO} fontWeight={700} fontSize="34" fill="#fff" letterSpacing="2">
        {code}
      </text>
      <Stamp x={130} y={-10} at={at + 5} text="FAKE" size={60} r={-12} />
    </g>
  );
};

const FakeScene: React.FC<{ f: number }> = ({ f }) => {
  const flow = ramp(f, c("own"), 40);
  const instant = f >= c("Instant");
  const barely = f >= c("Barely");
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0e1118" />
      <Iban x={300} y={130} r={-4} at={c("fake")} code="FR76 •••• 3391" />
      <Iban x={520} y={260} r={3} at={c("fake") + 4} code="FR76 •••• 8027" />
      <Iban x={330} y={390} r={-2} at={c("accounts.")} code="FR76 •••• 1154" />
      {/* the bank's own money streaming out */}
      {flow > 0 ? (
        <g opacity={clamp01(flow * 4)}>
          <rect x="0" y="0" width={IMG_W} height={IMG_H} fill="#000" opacity={0.55 * clamp01(flow * 3)} />
          <g transform="translate(150,600) scale(.42)">
            <BankFront lit={1} />
          </g>
          {Array.from({ length: 12 }, (_, i) => {
            const t = ((f - c("own")) / 22 + i / 12) % 1;
            return (
              <g key={i} transform={`translate(${lerp(240, 760, t)},${lerp(600, 520 - (i % 3) * 70, t) - Math.sin(t * Math.PI) * 120})`}>
                <EuroCoin s={0.7} />
              </g>
            );
          })}
        </g>
      ) : null}
      {instant ? <Tag x={560} y={680} at={c("Instant")} text="⚡ INSTANT PAYMENTS" color={SUN} size={32} /> : null}
      {barely ? <Stamp x={410} y={440} at={c("Barely")} text="BARELY ANY CHECKS" size={62} r={-7} /> : null}
    </g>
  );
};

const HoursScene: React.FC<{ f: number }> = ({ f }) => {
  const a = c("twentyone");
  const hrs = Math.min(21, Math.floor(21 * ramp(f, a, 26)));
  const money = 100_000_000 * (1 - Math.pow(1 - ramp(f, c("about"), 34), 3));
  const toCrypto = ease(ramp(f, c("crypto.") - 4, 14));
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0a0a0f" />
      <rect x="110" y="40" width="600" height="190" rx="18" fill="#050505" stroke="#3a1a1a" strokeWidth="6" />
      <text x="410" y="185" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="140" fill={RED} filter="url(#jg-glow)">
        {String(hrs).padStart(2, "0")}:00:00
      </text>
      <text x="410" y="300" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="30" fill="#9aa">
        HOURS OF TRANSFERS
      </text>
      <text x="410" y="430" textAnchor="middle" fontFamily={ANTON} fontSize="104" fill={SUN} opacity={1 - 0.6 * toCrypto}>
        {f >= c("about") ? euro(money) : ""}
      </text>
      {f >= c("about") && f < c("crypto.") - 4 ? (
        <Tag x={410} y={490} at={c("about")} text="ABOUT · BANK'S OWN MONEY" color="#fff" size={24} />
      ) : null}
      {Array.from({ length: 7 }, (_, i) => {
        const x = 110 + i * 100;
        const y = lerp(470, 640, toCrypto) + Math.sin(f / 5 + i) * 6;
        return (
          <g key={i} transform={`translate(${x},${y})`} opacity={toCrypto}>
            <EthCoin s={lerp(0.4, 1, toCrypto)} />
          </g>
        );
      })}
      <Stamp x={410} y={430} at={c("crypto.")} text="→ CRYPTO" color={TEAL} size={100} r={-8} />
    </g>
  );
};

const SeenScene: React.FC<{ f: number }> = ({ f }) => {
  const scroll = (f * 6) % 70;
  const alert = f >= c("spots");
  const q = usePop(c("whose"), springs.slam);
  const gx = 410 + Math.sin(f / 14) * 160;
  const gy = 330 + Math.cos(f / 18) * 80;
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#05080a" />
      {Array.from({ length: 13 }, (_, i) => {
        const y = 40 + i * 70 - scroll;
        const big = i % 4 === 1;
        return (
          <text key={i} x="40" y={y} fontFamily={MONO} fontWeight={700} fontSize="28" fill={big && alert ? RED : "#2fa86a"} opacity=".85">
            {`0x${((i * 7919 + 31) % 65535).toString(16).padStart(4, "0")}…  →  ${big ? "4,800,000" : String(((i * 3571) % 90000) + 1200)} USDC`}
          </text>
        );
      })}
      {/* magnifying glass */}
      <g transform={`translate(${gx},${gy})`} opacity={f >= c("detective") ? 1 : 0}>
        <circle r="110" fill="rgba(255,255,255,0.08)" stroke="#d9c9a3" strokeWidth="16" />
        <rect x="70" y="70" width="40" height="150" rx="14" fill="#6b4a2a" transform="rotate(-45 70 70)" />
      </g>
      <Tag x={410} y={60} at={c("famous")} text="A FAMOUS CRYPTO DETECTIVE" color={SUN} size={30} />
      {alert ? <Tag x={410} y={690} at={c("spots")} text="⚠ $106M+ SUSPICIOUS" color={RED} size={36} /> : null}
      {q > 0 ? (
        <g transform={`translate(410,420) scale(${lerp(2.2, 1, q)})`} opacity={clamp01(q * 3)}>
          <rect x="-250" y="-120" width="500" height="200" fill={PAPER} transform="rotate(-4)" />
          <text x="0" y="40" textAnchor="middle" fontFamily={ANTON} fontSize="150" fill={RED} transform="rotate(-4)">
            WHOSE?
          </text>
        </g>
      ) : null}
    </g>
  );
};

const Day3Scene: React.FC<{ f: number }> = ({ f }) => {
  const days = ["SUN 1", "MON 2", "TUE 3"];
  const idx = f < c("day") ? 0 : f < c("three.") ? 1 : 2;
  const flip = ramp(f, idx === 1 ? c("day") : c("three."), 6);
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#15110d" />
      <g transform="translate(410,360)">
        <rect x="-230" y="-250" width="460" height="460" rx="20" fill="#f3ecd9" />
        <rect x="-230" y="-250" width="460" height="110" rx="20" fill={RED} />
        <text x="0" y="-170" textAnchor="middle" fontFamily={ANTON} fontSize="64" fill="#fff" letterSpacing="4">
          NOV 2026
        </text>
        <text x="0" y="90" textAnchor="middle" fontFamily={ANTON} fontSize="170" fill={INK} opacity={idx === 0 ? 1 : flip}>
          {days[idx]}
        </text>
        {idx > 0 ? (
          <g transform={`translate(0,${-140 + flip * 260}) rotate(${flip * 18})`} opacity={1 - flip}>
            <rect x="-230" y="0" width="460" height="350" fill="#e6dcc4" />
          </g>
        ) : null}
      </g>
      <Tag x={410} y={690} at={c("only")} text="THE BANK FINALLY NOTICES" color={SUN} size={30} />
      <Stamp x={410} y={430} at={c("three.") + 3} text="TOO LATE" size={120} r={-9} />
    </g>
  );
};

/** Types `text` out from frame `at` at ~1.6 chars per frame. */
const typed = (f: number, at: number, text: string, speed = 1.6) => (f < at ? "" : text.slice(0, Math.floor((f - at) * speed) + 1));

const AiScene: React.FC<{ f: number }> = ({ f }) => {
  const eye = ease(ramp(f, c("Pulled") - 4, 14));
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0d0507" />
      <g transform={`translate(410,${lerp(470, 300, eye)}) scale(${lerp(0.3, 1, eye)})`} opacity={eye}>
        <AiEye f={f} r={150} />
      </g>
      <g transform="translate(410,150)" opacity={1 - eye}>
        <rect x="-370" y="-90" width="740" height="200" fill={PAPER} transform="rotate(-2)" />
        <text x="-340" y="-40" fontFamily={MONO} fontWeight={700} fontSize="26" fill={RED} transform="rotate(-2)" letterSpacing="2">
          THE CHAIRMAN SAYS:
        </text>
        <text x="-340" y="50" fontFamily={ANTON} fontSize="76" fill={INK} transform="rotate(-2)">
          {typed(f, c("heist") - 6, "“A HEIST OF A NEW KIND”")}
        </text>
      </g>
      {f >= c("very") ? (
        <g transform="translate(410,600) rotate(-1)">
          <rect x="-385" y="-110" width="770" height="210" fill={PAPER} />
          <text x="-360" y="-30" fontFamily={ANTON} fontSize="50" fill={INK}>
            {typed(f, c("very"), "“VERY LIKELY AIDED BY")}
          </text>
          <text x="-360" y="50" fontFamily={ANTON} fontSize="50" fill={RED}>
            {typed(f, c("advanced"), "ADVANCED ARTIFICIAL INTELLIGENCE”")}
          </text>
        </g>
      ) : null}
      <Tag x={410} y={40} at={c("Pulled")} text="HIS WORDS · TO AFP" color="#fff" size={26} />
      <Stamp x={600} y={330} at={c("intelligence.")} text="AI" size={150} r={-10} />
    </g>
  );
};

const OpenScene: React.FC<{ f: number }> = ({ f }) => (
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
      <text x="0" y="40" textAnchor="middle" fontFamily={ANTON} fontSize="150" fill={RED} opacity={0.75 + 0.25 * Math.sin(f / 5)} filter="url(#jg-glow)">
        ?
      </text>
      <text x="0" y="210" textAnchor="middle" fontFamily={ANTON} fontSize="60" fill={INK}>
        €100,000,000
      </text>
      <text x="0" y="270" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="26" fill="#5a4a30">
        IDENTITY UNKNOWN
      </text>
    </g>
    <Stamp x={300} y={180} at={c("arrested.")} text="NO ARRESTS" size={80} r={-12} />
    <Stamp x={520} y={560} at={c("credit.")} text="NO ONE CLAIMED IT" size={56} r={8} />
  </g>
);

const SCENES: Record<Key, React.FC<{ f: number }>> = {
  bank: BankScene,
  door: DoorScene,
  fake: FakeScene,
  hours: HoursScene,
  seen: SeenScene,
  day3: Day3Scene,
  ai: AiScene,
  open: OpenScene,
};

/* ------------------------------------------------------------------ full-screen hook (0 .. "November") */

const Hook: React.FC<{ f: number }> = ({ f }) => {
  const outAt = c("November") - 4;
  if (f > outAt + 10) return null;
  const out = ease(ramp(f, outAt, 9));
  const stole = c("stole");
  const ai = c("AI");
  const isAi = f >= ai - 1;
  const burst = (at: number, len: number) => (f >= at && f < at + len ? 1 - (f - at) / len : 0);
  const g = Math.max(burst(0, 14), burst(stole, 6) * 0.7, burst(ai - 3, 14));
  const rnd = (n: number) => {
    const x = Math.sin(n * 127.1 + f * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const flash = Math.max(0, 0.32 - f / 8) + burst(ai - 1, 5) * 0.8 + burst(stole, 3) * 0.4;
  const shake = g * 30;
  const sx = (rnd(1) - 0.5) * shake;
  const sy = (rnd(2) - 0.5) * shake;
  const zoom = lerp(1.25, 1, ease(ramp(f, 0, 10))) + 0.0006 * f;
  // the counter: full at frame 0, drains to zero by "bank..."
  const drain = ease(ramp(f, stole, c("bank...") - stole + 4));
  const money = 100_000_000 * (1 - drain);
  const Scene = isAi ? (
    <g>
      <rect width={SHORT_W} height={SHORT_H} fill="#120205" />
      <rect width={SHORT_W} height={SHORT_H} fill={RED} opacity=".12" />
      <g transform={`translate(500,760) scale(${zoom * lerp(1.4, 1, ease(ramp(f, ai, 8)))})`}>
        <AiEye f={f} r={230} />
      </g>
    </g>
  ) : (
    <g>
      <rect width={SHORT_W} height={SHORT_H} fill="#0b0a12" />
      <rect width={SHORT_W} height={SHORT_H} fill={SUN} opacity=".05" />
      <g transform={`translate(500,720) scale(${zoom * 1.3})`}>
        <BankFront lit={1 - drain} />
      </g>
    </g>
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${lerp(1, 0.42, out)}) rotate(${-6 * out}deg)` }}>
      <svg width={SHORT_W} height={SHORT_H} viewBox={`0 0 ${SHORT_W} ${SHORT_H}`} style={{ position: "absolute", inset: 0 }}>
        <SvgDefs />
        <defs>
          <filter id="ab-r">
            <feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id="ab-c">
            <feColorMatrix values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
        <g transform={`translate(${sx},${sy})`}>
          {Scene}
          {g > 0.02 ? (
            <g>
              <g filter="url(#ab-r)" transform={`translate(${-46 * g},0)`} style={{ mixBlendMode: "screen" }} opacity=".9">
                {Scene}
              </g>
              <g filter="url(#ab-c)" transform={`translate(${46 * g},0)`} style={{ mixBlendMode: "screen" }} opacity=".9">
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
                <rect key={`b${i}`} x="0" y={rnd(i + 80) * SHORT_H} width={SHORT_W} height={6 + rnd(i + 90) * 26} fill={[PINK, TEAL, "#fff", GREEN, RED][i]} opacity={0.75 * g} />
              ))}
            </g>
          ) : null}
          {!isAi ? (
            <g>
              <g transform="translate(490,290) rotate(-3)">
                <rect x="-420" y="-95" width="840" height="190" fill="#050505" stroke={drain > 0.02 ? RED : SUN} strokeWidth="8" />
                <text x="0" y="50" textAnchor="middle" fontFamily={ANTON} fontSize="140" fill={drain > 0.02 ? RED : SUN} letterSpacing="2">
                  {euro(money)}
                </text>
              </g>
              <g transform="translate(490,1390)">
                <Stamp x={0} y={0} at={stole} text="STOLEN" size={150} r={-9} />
              </g>
            </g>
          ) : (
            <g>
              <g transform="translate(500,300) rotate(-3)">
                <rect x="-330" y="-62" width="660" height="124" fill={PAPER} />
                <text x="0" y="22" textAnchor="middle" fontFamily={ANTON} fontSize="64" fill={INK} letterSpacing="3">
                  THE BANK SAYS…
                </text>
              </g>
              <g transform={`translate(500,1240) scale(${f >= ai ? lerp(2.6, 1, sp(f, FPS, ai, springs.slam)) : 0})`}>
                <text x="0" y="80" textAnchor="middle" fontFamily={ANTON} fontSize="300" fill="#fff" stroke={RED} strokeWidth="10" paintOrder="stroke" letterSpacing="10">
                  AI
                </text>
              </g>
              <g transform="translate(500,1440) rotate(2)">
                {f >= c("helped") ? (
                  <g>
                    <rect x="-300" y="-50" width="600" height="100" fill={SUN} />
                    <text x="0" y="22" textAnchor="middle" fontFamily={ANTON} fontSize="64" fill={INK} letterSpacing="3">
                      HELPED THEM DO IT
                    </text>
                  </g>
                ) : null}
              </g>
            </g>
          )}
        </g>
      </svg>
      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(1, flash) }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ the board */

const Board: React.FC<{ f: number }> = ({ f }) => {
  const keys = camKeys();
  return (
    <svg width={BW} height={BH} viewBox={`0 0 ${BW} ${BH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <SvgDefs />
      <defs>
        <filter id="jg-blur">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <rect x="-1200" y="-1200" width={BW + 2400} height={BH + 2400} fill="#1a120c" />
      <rect x="-1200" y="-1200" width={BW + 2400} height={BH + 2400} fill="#fff" filter="url(#jg-cork)" />
      {Array.from({ length: 32 }, (_, i) => {
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
      <RedString pts={ORDER.map((k) => pinOf(POL[k]))} at={keys.slice(1, 8).map((k) => k.at)} />

      {/* title card */}
      <g transform={`translate(${POL.bank.x},${POL.bank.y - PH / 2 - 180}) rotate(-3)`}>
        <rect x="-330" y="-130" width="660" height="250" fill="#000" opacity=".45" transform="translate(10,14)" />
        <rect x="-330" y="-130" width="660" height="250" fill={PAPER} />
        <text x="0" y="-20" textAnchor="middle" fontFamily={ANTON} fontSize="70" fill={INK} letterSpacing="3">
          €100,000,000
        </text>
        <text x="0" y="60" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill={RED} letterSpacing="3">
          THE AI HEIST?
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

      <Note x={POL.bank.x + 300} y={POL.bank.y + 480} r={6} w={380} h={130} at={c("Sunday.")} color="#f2c230">
        <text x="0" y="24" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill={INK}>
          SUN 1 NOV
        </text>
      </Note>
      <Note x={POL.hours.x - 290} y={POL.hours.y - 480} r={-6} w={360} h={130} at={c("twentyone")} color="#f2c230">
        <text x="0" y="24" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill={INK}>
          21 HOURS
        </text>
      </Note>
      <Note x={POL.day3.x - 290} y={POL.day3.y - 480} r={-5} w={360} h={130} at={c("day")} color="#f2c230">
        <text x="0" y="24" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill={INK}>
          DAY 3
        </text>
      </Note>
    </svg>
  );
};

/* ------------------------------------------------------------------ main */

const EndCard: React.FC = () => {
  const s = usePop(c("rob") - 2);
  const s2 = usePop(c("is", 1) - 1);
  const s3 = usePop(c("Tell") - 2);
  if (s <= 0) return null;
  const box: React.CSSProperties = { padding: "18px 40px", boxShadow: "10px 14px 0 rgba(0,0,0,0.5)", fontFamily: ANTON, whiteSpace: "nowrap", color: INK, letterSpacing: 3 };
  return (
    <div style={{ position: "absolute", left: 60, width: 840, top: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      <div style={{ ...box, transform: `scale(${lerp(1.6, 1, s)}) rotate(-3deg)`, opacity: clamp01(s * 3), background: PAPER, fontSize: 74 }}>
        AI ROBBED A <span style={{ color: RED }}>BANK?</span>
      </div>
      {s2 > 0 ? (
        <div style={{ ...box, transform: `scale(${lerp(1.6, 1, s2)}) rotate(2deg)`, opacity: clamp01(s2 * 3), background: PAPER, fontSize: 74 }}>
          IS YOUR MONEY <span style={{ color: RED }}>NEXT?</span>
        </div>
      ) : null}
      {s3 > 0 ? (
        <div style={{ transform: `scale(${s3}) rotate(-2deg)`, background: SUN, padding: "12px 30px", fontFamily: ANTON, fontSize: 52, color: INK, letterSpacing: 2 }}>COMMENT BELOW ↓</div>
      ) : null}
    </div>
  );
};

export const AiBankHeist: React.FC<z.infer<typeof aiBankSchema>> = ({ showCaptions }) => {
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
        hide={[[c("AI"), c("November") - 2]]}
        centerY={1150}
        fontSize={60}
        maxWords={4}
        maxChars={22}
        left={170}
        right={170}
        hot={["hackers", "stole", "ai", "hundred", "million", "euros", "supplier", "fake", "instant", "checks", "twentyone", "crypto", "but", "three", "heist", "artificial", "intelligence", "arrested", "next"]}
      />
      <Audio src={staticFile("shorts/aibank/vo.mp3")} />
      <Loop durationInFrames={Math.round(62 * FPS)}>
        <Audio src={staticFile("shorts/cyberleak/bed.mp3")} volume={0.16} />
      </Loop>
      <Sfx name="slam" at={0} volume={0.95} />
      <Sfx name="glitch" at={0} volume={0.8} />
      <Sfx name="stamp" at={c("stole")} volume={0.9} />
      <Sfx name="tick" at={c("stole")} durationInFrames={c("bank...") - c("stole")} loop volume={0.5} />
      <Sfx name="glitch" at={c("AI") - 3} volume={0.85} />
      <Sfx name="slam" at={c("AI")} volume={0.95} />
      <Sfx name="pop" at={c("helped")} volume={0.6} />
      <Sfx name="whoosh" at={c("November") - 4} volume={0.8} />
      {keys.slice(1).map((k, i) => (
        <Sfx key={i} name="whoosh" at={k.at - 2} volume={0.7} />
      ))}
      {[c("French"), c("Sunday."), c("supplier"), c("famous"), c("only"), c("Pulled"), c("twentyone")].map((a, i) => (
        <Sfx key={`p${i}`} name="pop" at={a} volume={0.5} />
      ))}
      <Sfx name="stamp" at={c("break")} volume={0.9} />
      <Sfx name="door" at={c("walk") - 2} volume={0.8} />
      <Sfx name="error" at={c("trusted.")} volume={0.6} />
      <Sfx name="slam" at={c("fake")} volume={0.7} />
      <Sfx name="slam" at={c("fake") + 4} volume={0.6} />
      <Sfx name="slam" at={c("accounts.")} volume={0.6} />
      {[0, 5, 10, 15, 20].map((o) => (
        <Sfx key={`c${o}`} name="coin" at={c("own") + o} volume={0.45} />
      ))}
      <Sfx name="stamp" at={c("Barely")} volume={0.9} />
      <Sfx name="tick" at={c("twentyone")} durationInFrames={26} loop volume={0.5} />
      <Sfx name="riser" at={c("about")} volume={0.45} />
      <Sfx name="stamp" at={c("crypto.")} volume={0.9} />
      <Sfx name="notify" at={c("spots")} volume={0.6} />
      <Sfx name="slam" at={c("whose")} volume={0.85} />
      <Sfx name="snap" at={c("day")} volume={0.7} />
      <Sfx name="snap" at={c("three.")} volume={0.7} />
      <Sfx name="stamp" at={c("three.") + 3} volume={0.9} />
      <Sfx name="type" at={c("heist") - 6} durationInFrames={16} volume={0.5} />
      <Sfx name="rumble" at={c("Pulled") - 4} volume={0.6} />
      <Sfx name="type" at={c("very")} durationInFrames={40} volume={0.5} />
      <Sfx name="stamp" at={c("intelligence.")} volume={1} />
      <Sfx name="stamp" at={c("arrested.")} volume={0.9} />
      <Sfx name="stamp" at={c("credit.")} volume={0.9} />
      <Sfx name="slam" at={c("rob") - 2} volume={0.7} />
      <Sfx name="pop" at={c("is", 1) - 1} volume={0.6} />
      <Sfx name="pop" at={c("Tell") - 2} volume={0.5} />
    </AbsoluteFill>
  );
};
