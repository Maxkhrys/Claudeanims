import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, Loop, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { z } from "zod";
import { springs } from "../theme";
import { createCues, sp, type Word } from "../lib/timing";
import { Sfx } from "../components";
import transcript from "../../public/shorts/walksfree/words.json";
import { ShortCaptions, SHORT_H, SHORT_W } from "./kit3d";

/*
 * "GTA 6 hacker walks free" (about 50 s). Same noir evidence board as JudgeGTA6.tsx.
 * Hook: full-screen GTA sunset, GTA VI logo slams in on frame 0 with a white flash, then the
 * Fire Stick slams in; whip into the "exit" polaroid where the court doors open and he walks out.
 * Beats: exit, hotel, room, leak, sentence (7 years / time served), judge's quote, GTA card + "fair?".
 * Narration: public/shorts/walksfree/vo.mp3 (Gemini TTS), word timings words.json.
 *
 * (Original JudgeGTA6 notes follow.) Style: noir + evidence board.
 * A dark, lamp-lit case board with noir polaroids pinned to it. The camera flies along the
 * red string from polaroid to polaroid, one per beat:
 *
 *   judge  hook: a judge in a wig playing GTA alone in court, looks up at the camera
 *   hotel  Sept 2022: on bail, laptop seized, threats, hidden in a Travelodge
 *   room   phone + hotel Wi-Fi + Fire Stick in the TV -> into Rockstar
 *   leak   90 clips, nearly an hour, 4 years before release, LEAKED, $5M
 *   hosp   unfit for trial, secure hospital, no end date -> fit after all
 *   court  guilty 16 Nov 2026, GTA 6 out 3 days later, 17M copies (est.)
 *   board  pull back, sentencing card, back to the Fire Stick, "fair or too harsh?"
 *
 * Narration: public/shorts/judge/vo.mp3 (ElevenLabs v4, the placeholder "sentence line"
 * words cut out). Word timings in words.json (sherpa-onnx zipformer + script align).
 * Vertical layout keeps key text inside the safe zone (x 60..918, y 192..1536);
 * captions are small and sit about 60% down. Landscape uses the same board.
 */

loadFont({ family: "Anton", weight: "400", url: staticFile("fonts/Anton-400.woff2") });

export const walksFreeSchema = z.object({ showCaptions: z.boolean() });
export const WALKS_FREE_FRAMES = 1500;

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

/* ------------------------------------------------------------------ board layout (world px) */

const BW = 2600;
const BH = 4900;
const PW = 900; // polaroid
const PH = 1010;
const IMG_W = 820; // photo area
const IMG_H = 780;

type P = { x: number; y: number; r: number; label: string };
const POL: Record<"exit" | "hotel" | "room" | "leak" | "sent" | "quote", P> = {
  exit: { x: 700, y: 950, r: -2, label: "23 NOV 2026 · THE EXIT" },
  hotel: { x: 1850, y: 1560, r: 3, label: "2022 · THE HOTEL" },
  room: { x: 700, y: 2230, r: -3, label: "ROOM · THE SETUP" },
  leak: { x: 1850, y: 2900, r: 2, label: "THE LEAK" },
  sent: { x: 700, y: 3580, r: -2, label: "23 NOV 2026 · THE SENTENCE" },
  quote: { x: 1850, y: 4240, r: 3, label: "THE JUDGE" },
};
const pinOf = (p: P) => ({ x: p.x, y: p.y - PH / 2 + 14 });
const STICK_CARD = { x: 980, y: 1330 };
const GTA_CARD = { x: 1300, y: 2560 };
const QUOTE_CARD = { x: POL.quote.x, y: POL.quote.y + 400 };

/* ------------------------------------------------------------------ camera */

type K = { at: number; x: number; y: number; z: number; zl: number; xl?: number; yl?: number };
const MOVE = 18;

const camKeys = (): K[] => {
  const v = (p: P, dy = 40) => ({ x: p.x + 70, y: p.y + dy });
  return [
    { at: 0, ...v(POL.exit, -20), z: 1.0, zl: 0.86 },
    { at: c("2022.") - 8, ...v(POL.hotel), z: 1.0, zl: 0.86 },
    { at: c("All", 0) - 6, ...v(POL.room), z: 1.0, zl: 0.86 },
    { at: c("90") - 8, ...v(POL.leak), z: 1.0, zl: 0.86 },
    { at: c("Today", 1) - 8, ...v(POL.sent), z: 1.0, zl: 0.86 },
    { at: c("told") - 14, ...v(POL.quote), z: 1.0, zl: 0.86 },
    { at: c("Four") - 6, x: GTA_CARD.x + 40, y: GTA_CARD.y + 200, z: 1.2, zl: 1.0 },
    { at: c("Fair?") - 4, x: 1300, y: 2560, z: 0.36, zl: 0.3 },
  ];
};

const useCamera = (landscape: boolean) => {
  const f = useCurrentFrame();
  const keys = React.useMemo(camKeys, []);
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (f >= keys[k].at) i = k;
  const pick = (k: K) => ({ x: landscape ? k.xl ?? k.x : k.x, y: landscape ? k.yl ?? k.y : k.y, z: landscape ? k.zl : k.z });
  const cur = pick(keys[i]);
  const prev = i > 0 ? pick(keys[i - 1]) : cur;
  const t = i > 0 ? clamp01((f - keys[i].at) / MOVE) : 1;
  const e = ease(t);
  const next = keys[i + 1]?.at ?? WALKS_FREE_FRAMES;
  const hold = clamp01((f - keys[i].at - MOVE) / Math.max(1, next - keys[i].at - MOVE));
  const dip = i > 0 ? 1 - 0.22 * Math.sin(Math.PI * t) : 1;
  const push = 1 + 0.05 * hold;
  return {
    x: lerp(prev.x, cur.x, e),
    y: lerp(prev.y, cur.y, e),
    z: lerp(prev.z, cur.z, e) * dip * push,
    rot: Math.sin(f / 70) * 0.4,
    moveStarts: keys.slice(1).map((k) => k.at),
  };
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

/* ------------------------------------------------------------------ scenes (820x780 photos) */

const Judge: React.FC<{ f: number; playing: boolean; lookAt: number }> = ({ f, playing, lookAt }) => {
  const look = ease(ramp(f, lookAt, 6));
  const thumb = playing ? Math.sin(f / 2.2) * 3 : 0;
  const brow = -10 * look;
  const px = lerp(-9, 0, look);
  const py = lerp(7, 2, look);
  const blink = f % 97 > 93 ? 0.15 : 1;
  const curls: [number, number, number][] = [];
  for (const side of [-1, 1]) for (let r = 0; r < 4; r++) for (let cc = 0; cc < 2; cc++) curls.push([500 + side * (98 + cc * 30 + (r % 2) * 6), 850 + r * 44, 24 - r * 1.5]);
  const top: [number, number][] = Array.from({ length: 7 }, (_, i) => [420 + i * 27, 800 - Math.sin((i / 6) * Math.PI) * 28]);
  const skin = "#E2B392";
  const wig = "#ECE7DC";
  const robe = "#101014";
  return (
    <g filter="url(#jg-rim)">
      <path d="M330,1080 C340,1000 380,975 440,965 L560,965 C620,975 660,1000 670,1080Z" fill={robe} />
      <path d="M440,965 L500,1060 L560,965" fill="none" stroke="#9b1c2e" strokeWidth="14" />
      <rect x="486" y="975" width="12" height="52" fill="#f4f4f4" />
      <rect x="502" y="975" width="12" height="52" fill="#f4f4f4" />
      {curls.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={wig} />
      ))}
      <ellipse cx="500" cy="815" rx="112" ry="62" fill={wig} />
      {top.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="24" fill={wig} />
      ))}
      <ellipse cx="500" cy="885" rx="78" ry="95" fill={skin} />
      <ellipse cx="500" cy="905" rx="78" ry="75" fill="url(#jg-face)" />
      <path d="M430,808 C460,790 540,790 570,808 C560,825 440,825 430,808Z" fill={wig} />
      <path d={`M452,${846 + brow} q20,-14 38,-2 M510,${844 + brow} q20,-12 38,2`} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <g transform={`translate(0,876) scale(1,${blink}) translate(0,-876)`}>
        <ellipse cx="472" cy="876" rx="17" ry={19 + 3 * look} fill="#fff" />
        <ellipse cx="528" cy="876" rx="17" ry={19 + 3 * look} fill="#fff" />
        <circle cx={472 + px} cy={876 + py} r="8" fill={INK} />
        <circle cx={528 + px} cy={876 + py} r="8" fill={INK} />
      </g>
      <path d="M446,900 q26,14 52,0 M502,900 q26,14 52,0" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M498,885 q-6,22 4,26" fill="none" stroke={INK} strokeWidth="4" opacity=".6" />
      <path d={look > 0.5 ? "M486,942 q14,-6 28,0" : "M478,940 q22,8 44,0"} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      {playing ? (
        <g>
          <path d="M345,1060 C360,1010 400,1000 430,1030 L440,1070Z" fill={robe} />
          <path d="M655,1060 C640,1010 600,1000 570,1030 L560,1070Z" fill={robe} />
          <path d="M420,1010 C440,990 560,990 580,1010 C600,1030 610,1070 590,1078 C570,1084 556,1060 540,1052 L460,1052 C444,1060 430,1084 410,1078 C390,1070 400,1030 420,1010Z" fill="#1d1d22" />
          <circle cx="555" cy="1020" r="7" fill="#ff4d6d" opacity={f % 8 < 4 ? 1 : 0.4} />
          <circle cx="570" cy="1033" r="7" fill={TEAL} opacity={f % 11 < 5 ? 1 : 0.4} />
          <circle cx="540" cy="1033" r="7" fill={SUN} />
          <path d="M440,1028 h26 M453,1015 v26" stroke="#aaa" strokeWidth="7" />
          <ellipse cx="420" cy={1040 + thumb} rx="26" ry="20" fill={skin} />
          <ellipse cx="580" cy={1040 - thumb} rx="26" ry="20" fill={skin} />
        </g>
      ) : null}
    </g>
  );
};

const Courtroom: React.FC<{ f: number; playing: boolean; lookAt: number; gameScreen?: boolean }> = ({ f, playing, lookAt, gameScreen = true }) => {
  const carX = ((f * 9) % 760) - 80;
  return (
    <g transform="translate(-90,-470)">
      <rect x="0" y="0" width="1100" height="1500" fill="#16131c" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={60 + i * 250} y="480" width="210" height="560" rx="6" fill="#1d1925" />
      ))}
      {gameScreen ? (
        <g filter="url(#jg-glow)">
          <rect x="215" y="505" width="570" height="330" rx="8" fill="url(#jg-sunset)" opacity={0.9 + 0.1 * Math.sin(f / 3)} />
          <circle cx="640" cy="640" r="60" fill={SUN} />
          <rect x="215" y="760" width="570" height="75" fill="#1a0830" />
          <g transform={`translate(${215 + carX},770)`}>
            <rect x="0" y="0" width="70" height="18" rx="6" fill={TEAL} />
            <rect x="14" y="-12" width="38" height="14" rx="5" fill={TEAL} />
          </g>
          <path d={palmPath} transform="translate(280,790) scale(3)" fill="#1a0830" />
          <path d={palmPath} transform="translate(730,790) scale(2.2)" fill="#1a0830" />
        </g>
      ) : (
        <g>
          <rect x="215" y="505" width="570" height="330" rx="8" fill="#241f2c" />
          <circle cx="500" cy="670" r="110" fill="none" stroke="#9a7a44" strokeWidth="8" />
          <path d="M500,600 v140 M430,640 h140 M430,640 l-24,50 h48z M570,640 l-24,50 h48z" fill="none" stroke="#9a7a44" strokeWidth="7" />
        </g>
      )}
      <Judge f={f} playing={playing} lookAt={lookAt} />
      <rect x="90" y="1052" width="820" height="30" rx="6" fill="#4c3021" />
      <rect x="110" y="1080" width="780" height="300" fill="#3b2519" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={140 + i * 250} y="1110" width="220" height="210" rx="6" fill="#4c3021" />
      ))}
      <g transform="translate(745,1030) rotate(-12)">
        <rect x="-70" y="-6" width="110" height="12" rx="5" fill="#5a3a26" />
        <rect x="30" y="-24" width="56" height="44" rx="10" fill="#5a3a26" />
      </g>
      <path d="M440,0 L560,0 L800,1350 L200,1350Z" fill="#fff" opacity=".07" />
    </g>
  );
};

const HotelScene: React.FC<{ f: number }> = ({ f }) => {
  const lit = ramp(f, c("Travelodge."), 8);
  const windows = [];
  for (let r = 0; r < 4; r++)
    for (let col = 0; col < 6; col++) {
      const on = (r * 7 + col * 3) % 5 === 0;
      const isHim = r === 2 && col === 3;
      windows.push(
        <rect key={`${r}-${col}`} x={150 + col * 92} y={300 + r * 88} width="60" height="56" fill={isHim ? `rgba(255,190,90,${0.15 + 0.85 * lit})` : on ? "#ffcf7a" : "#1b1830"} opacity={on && !isHim ? 0.7 : 1} />,
      );
    }
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="url(#jg-night)" />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={(i * 137) % IMG_W} cy={(i * 59) % 230} r={i % 3 ? 1.5 : 2.5} fill="#fff" opacity={0.3 + 0.5 * Math.abs(Math.sin(f / 20 + i))} />
      ))}
      <rect x="110" y="250" width="600" height="440" fill="#100d20" />
      {windows}
      <g transform={`translate(${150 + 3 * 92 + 30},${300 + 2 * 88 + 56})`} opacity={lit}>
        <circle cx="0" cy="-34" r="11" fill="#2a1a10" />
        <path d="M-16,0 C-16,-22 16,-22 16,0Z" fill="#2a1a10" />
      </g>
      <g filter="url(#jg-glow)">
        <rect x="240" y="180" width="340" height="62" rx="8" fill="#0e1a3a" stroke={TEAL} strokeWidth="4" />
        <text x="410" y="226" textAnchor="middle" fontFamily={ANTON} fontSize="44" fill={TEAL} letterSpacing="6">
          TRAVELODGE
        </text>
      </g>
      <rect x="0" y="690" width={IMG_W} height="90" fill="#08060f" />
      <g transform="translate(600,720)">
        <rect x="-80" y="-6" width="160" height="40" rx="12" fill="#1c1c28" />
        <circle cx="-50" cy="34" r="12" fill="#000" />
        <circle cx="50" cy="34" r="12" fill="#000" />
        <rect x="-30" y="-24" width="60" height="20" rx="4" fill="#1c1c28" />
        <rect x="-26" y="-34" width="52" height="10" fill={f % 20 < 10 ? "#ff2b4a" : "#2b6bff"} opacity=".9" />
      </g>
    </g>
  );
};

const RoomScene: React.FC<{ f: number }> = ({ f }) => {
  const hiPhone = ramp(f, c("phone"), 6);
  const hiWifi = ramp(f, c("Wi-Fi..."), 6);
  const hiStick = ramp(f, c("Fire", 1), 6);
  const hack = ramp(f, c("breaks"), 8);
  const granted = f >= c("Rockstar", 0);
  const prog = clamp01((f - c("breaks")) / (c("Rockstar") - c("breaks") + 1));
  const pulse = 0.6 + 0.4 * Math.sin(f / 3);
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#1a1420" />
      <rect y="520" width={IMG_W} height="260" fill="#2a2030" />
      {/* bed */}
      <rect x="40" y="560" width="380" height="140" rx="20" fill="#3b3550" />
      <rect x="40" y="520" width="140" height="70" rx="20" fill="#e6e0f0" opacity=".85" />
      <rect x="160" y="560" width="260" height="70" rx="10" fill="#5a4b7a" />
      {/* phone on bed */}
      <g transform="translate(300,585) rotate(-12)">
        <rect x="-26" y="-44" width="52" height="88" rx="9" fill="#111" stroke={hiPhone > 0 ? SUN : "#333"} strokeWidth={3 + 4 * hiPhone} />
        <rect x="-20" y="-36" width="40" height="70" rx="4" fill={hiPhone > 0 ? "#2b6bff" : "#222"} opacity={0.5 + 0.5 * hiPhone} />
      </g>
      {/* dresser + tv */}
      <rect x="450" y="470" width="330" height="200" fill="#4c3021" />
      <rect x="470" y="490" width="140" height="70" fill="#3b2519" />
      <rect x="620" y="490" width="140" height="70" fill="#3b2519" />
      <rect x="470" y="190" width="300" height="230" rx="10" fill="#0e0e12" />
      <rect x="485" y="205" width="270" height="200" rx="4" fill={hack > 0 ? "#05110a" : "#141024"} />
      {hack > 0 ? (
        <g fontFamily={MONO} fontWeight={700}>
          <text x="500" y="245" fontSize="20" fill={GREEN}>
            ROCKSTAR · INTERNAL
          </text>
          <text x="500" y="285" fontSize="18" fill={GREEN} opacity=".8">
            user: ********
          </text>
          <rect x="500" y="310" width="240" height="18" fill="#0f3d22" />
          <rect x="500" y="310" width={240 * prog} height="18" fill={GREEN} />
          {granted ? (
            <text x="620" y="380" fontSize="28" textAnchor="middle" fill={GREEN} filter="url(#jg-glow)">
              ACCESS GRANTED
            </text>
          ) : null}
        </g>
      ) : (
        <g opacity=".6">
          <rect x="485" y="205" width="270" height="200" fill="url(#jg-sunset)" opacity=".35" />
        </g>
      )}
      <rect x="600" y="420" width="40" height="50" fill="#0e0e12" />
      {/* fire stick in the back of the tv */}
      <g transform="translate(770,360)">
        <rect x="-8" y="-12" width="70" height="24" rx="6" fill="#222" stroke={hiStick > 0 ? SUN : "#444"} strokeWidth={2 + 3 * hiStick} />
        <circle cx="52" cy="0" r={6 + 6 * hiStick} fill="#ff4d6d" opacity={hiStick > 0 ? pulse : 0.6} filter="url(#jg-glow)" />
      </g>
      {/* wifi */}
      <g transform="translate(140,250)" opacity={0.25 + 0.75 * hiWifi}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${-30 - i * 26},${-i * 22} Q0,${-40 - i * 40} ${30 + i * 26},${-i * 22}`} fill="none" stroke={hiWifi > 0 ? TEAL : "#555"} strokeWidth="10" strokeLinecap="round" opacity={hiWifi > 0 ? (Math.floor(f / 6) % 3 >= i ? 1 : 0.3) : 1} />
        ))}
        <circle cx="0" cy="18" r="10" fill={hiWifi > 0 ? TEAL : "#555"} />
      </g>
      <Tag x={300} y={470} at={c("phone")} text="PHONE" />
      <Tag x={140} y={330} at={c("Wi-Fi...")} text="HOTEL WI-FI" color={TEAL} />
      <Tag x={640} y={120} at={c("Fire", 1)} text="FIRE STICK" color={RED} />
      {hiStick > 0 && hack <= 0 ? <circle cx="822" cy="360" r={40 + 20 * pulse} fill="none" stroke={SUN} strokeWidth="5" /> : null}
    </g>
  );
};

const LeakScene: React.FC<{ f: number }> = ({ f }) => {
  const t90 = c("90");
  const n = countTo(f, t90, 90, 30);
  const tiles = Array.from({ length: 24 }, (_, i) => i);
  const money = countTo(f, c("$5"), 5000000, 24);
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0d0b14" />
      <g transform="translate(60,60)">
        <rect width="700" height="250" rx="16" fill="#17131f" stroke="#3a2f4a" strokeWidth="4" />
        <rect width="700" height="46" rx="16" fill="#241d30" />
        <text x="24" y="31" fontFamily={MONO} fontWeight={700} fontSize="22" fill="#cfc6dc">
          # internal-chat
        </text>
        <circle cx="54" cy="100" r="26" fill={PINK} />
        <text x="96" y="94" fontFamily={MONO} fontWeight={700} fontSize="22" fill="#fff">
          teapotuberhacker
        </text>
        <rect x="96" y="108" width="380" height="16" rx="6" fill="#4a4060" />
        <rect x="96" y="134" width="260" height="16" rx="6" fill="#4a4060" />
        {f >= t90 ? (
          <g>
            <rect x="96" y="166" width="190" height="56" rx="8" fill="#2a2238" />
            <text x="191" y="203" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="24" fill={SUN}>
              ▶ {n} clips
            </text>
          </g>
        ) : null}
      </g>
      {tiles.map((i) => {
        const at = t90 + i * 1.2;
        const p = ease(ramp(f, at, 16));
        if (p <= 0) return null;
        const tx = 100 + (i % 6) * 110 + ((i * 37) % 30);
        const ty = 360 + Math.floor(i / 6) * 80 + ((i * 23) % 20);
        const fromX = 190;
        const fromY = 250;
        const r = ((i * 47) % 40) - 20;
        return (
          <g key={i} transform={`translate(${lerp(fromX, tx, p)},${lerp(fromY, ty, p)}) rotate(${r * p}) scale(${lerp(0.2, 1, p)})`}>
            <rect x="-48" y="-30" width="96" height="60" rx="8" fill="url(#jg-sunset)" />
            <circle cx="24" cy="-6" r="10" fill={SUN} />
            <path d={palmPath} transform="translate(-30,28) scale(.9)" fill="#1a0830" />
            <path d="M-6,-10 L10,0 L-6,10Z" fill="#fff" opacity=".9" />
          </g>
        );
      })}
      <Tag x={410} y={705} at={c("world.")} text="LEAKED TO THE WORLD" color={TEAL} size={30} />
      <Stamp x={410} y={500} at={c("Leaked", 1)} text="LEAKED" size={130} r={-8} sub="4 YEARS BEFORE RELEASE" />
      {f >= c("$5") ? (
        <g>
          <rect x="0" y="0" width={IMG_W} height={IMG_H} fill="#000" opacity={0.65 * ramp(f, c("$5"), 6)} />
          <text x="410" y="380" textAnchor="middle" fontFamily={ANTON} fontSize="128" fill={SUN} filter="url(#jg-glow)">
            ${money.toLocaleString("en-US")}
          </text>
          <text x="410" y="450" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="32" fill="#fff">
            ROCKSTAR SAYS IT COST
          </text>
        </g>
      ) : null}
    </g>
  );
};

const FireStickDrawing: React.FC<{ f: number }> = ({ f }) => (
  <g>
    <rect x="-150" y="-40" width="260" height="80" rx="14" fill="#232328" />
    <rect x="-200" y="-24" width="54" height="48" rx="6" fill="#9aa3b5" />
    <rect x="-110" y="-20" width="150" height="10" rx="5" fill="#4a4a55" />
    <circle cx="80" cy="0" r="12" fill="#ff4d6d" opacity={0.6 + 0.4 * Math.sin(f / 3)} filter="url(#jg-glow)" />
  </g>
);

const Grain: React.FC<{ f: number }> = ({ f }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
    <filter id={`jg-grain-${f % 3}`}>
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed={7 + (f % 3)} />
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .08 0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#jg-grain-${f % 3})`} />
  </svg>
);

//NEW
/* ------------------------------------------------------------------ new scenes */

/** Hooded figure seen from the front, as a silhouette. */
const Hoodie: React.FC<{ x: number; y: number; s: number; f: number; color?: string }> = ({ x, y, s, f, color = "#0b0910" }) => {
  const bob = Math.sin(f / 4) * 4;
  const step = Math.sin(f / 4) * 10;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      <path d={`M-26,150 L${-20 + step},260 L${-4 + step},260 L0,170Z`} fill={color} />
      <path d={`M26,150 L${20 - step},260 L${4 - step},260 L0,170Z`} fill={color} />
      <path d="M-70,160 C-74,60 -54,20 0,14 C54,20 74,60 70,160Z" fill={color} />
      <path d="M-44,30 C-50,-50 50,-50 44,30 C30,44 -30,44 -44,30Z" fill={color} />
      <ellipse cx="0" cy="6" rx="24" ry="28" fill="#000" />
    </g>
  );
};

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

const ExitScene: React.FC<{ f: number }> = ({ f }) => {
  const openAt = c("walked") - 6;
  const o = ease(ramp(f, openAt, 14));
  const walk = ramp(f, c("walked"), 50);
  const leaf = 180 * (1 - 0.88 * o);
  return (
    <g>
      <svg x="230" y="200" width="360" height="580" viewBox="0 0 360 580" overflow="hidden">
        <SunsetBack f={f} w={360} h={580} horizon={380} />
        <path d={palmPath} transform="translate(40,390) scale(2.6)" fill="#1a0830" />
        <path d={palmPath} transform="translate(300,390) scale(2)" fill="#1a0830" />
      </svg>
      {/* light pouring out of the doors */}
      <path d={`M230,780 L590,780 L${590 + 300 * o},780 L${820},${780} L820,780 L0,780Z`} fill="none" />
      <path d={`M230,200 L590,200 L${800},780 L${20},780Z`} fill={SUN} opacity={0.18 * o} />
      {/* facade */}
      <path d="M0,0 H820 V780 H590 V200 H230 V780 H0Z" fill="#1f1a24" />
      {[60, 150, 670, 760].map((x) => (
        <rect key={x} x={x - 26} y="170" width="52" height="610" fill="#2b2531" />
      ))}
      <rect x="0" y="130" width="820" height="40" fill="#2b2531" />
      <path d="M40,130 L410,30 L780,130Z" fill="#2b2531" />
      <text x="410" y="112" textAnchor="middle" fontFamily={ANTON} fontSize="46" fill="#9a8f7a" letterSpacing="10">
        COURT
      </text>
      {/* doors */}
      <rect x="230" y="200" width={leaf} height="580" fill="#3b2519" stroke="#1a0f08" strokeWidth="6" />
      <rect x={590 - leaf} y="200" width={leaf} height="580" fill="#3b2519" stroke="#1a0f08" strokeWidth="6" />
      {o > 0 ? <Hoodie x={410} y={lerp(470, 430, walk)} s={lerp(0.55, 1.35, walk)} f={f} /> : null}
      <Stamp x={410} y={260} at={c("free.")} text="FREE" color={GREEN} size={170} r={-8} sub="TIME SERVED" />
    </g>
  );
};

const SentenceScene: React.FC<{ f: number }> = ({ f }) => {
  const out = ease(ramp(f, c("walked", 1), 26));
  return (
    <g>
      <Courtroom f={f} playing={false} lookAt={c("judge") - 4} gameScreen={false} />
      <g transform={`translate(${410 + 520 * out},700)`} opacity={1 - out}>
        <circle cx="0" cy="-90" r="44" fill="#1a1a22" />
        <path d="M-70,-20 C-70,-80 70,-80 70,-20Z" fill="#1a1a22" />
      </g>
      <rect x="240" y="680" width="340" height="120" fill="#2e1d14" />
      <Stamp x={410} y={110} at={c("7")} text="7 YEARS" size={100} r={-6} />
      {f >= c("But") ? (
        <line x1="190" y1={130} x2={190 + 440 * ease(ramp(f, c("But"), 8))} y2={80} stroke={INK} strokeWidth="16" strokeLinecap="round" />
      ) : null}
      <Stamp x={410} y={640} at={c("time.")} text="TIME SERVED" color={GREEN} size={90} r={5} />
      <Tag x={410} y={250} at={c("walked", 1)} text="FREE TO GO" color={SUN} size={44} />
    </g>
  );
};

const QuoteScene: React.FC<{ f: number }> = ({ f }) => <Courtroom f={f} playing={false} lookAt={c("told")} gameScreen={false} />;

const QUOTE_LINES = [
  ["You", "are", "obviously"],
  ["a", "very", "talented"],
  ["young", "man."],
  ["Don't", "waste"],
  ["those", "talents."],
];

const QuoteCard: React.FC<{ f: number }> = ({ f }) => {
  const t = f / FPS;
  const qWords = WORDS.filter((w) => w.start >= WORDS.find((x) => x.text === '"You')!.start - 0.01 && w.start < WORDS.find((x) => x.text === 'talents."')!.end);
  let k = 0;
  return (
    <Note x={QUOTE_CARD.x} y={QUOTE_CARD.y} r={-2} w={780} h={470} at={c("You") - 3}>
      <text x="-350" y="-170" fontFamily={MONO} fontWeight={700} fontSize="28" fill={RED} letterSpacing="3">
        THE JUDGE SAID:
      </text>
      {QUOTE_LINES.map((line, li) => (
        <text key={li} x="-350" y={-105 + li * 66} fontFamily={ANTON} fontSize="60" letterSpacing="2">
          {line.map((word, wi) => {
            const w = qWords[k++];
            const on = w ? t >= w.start - 0.03 : true;
            const hot = /talent/i.test(word);
            return (
              <tspan key={wi} fill={on ? (hot ? RED : INK) : "#b8ae98"}>
                {(wi ? " " : "") + (li === 0 && wi === 0 ? "“" : "") + word.toUpperCase().replace(/[.]$/, li === 4 ? ".”" : ".")}
              </tspan>
            );
          })}
        </text>
      ))}
    </Note>
  );
};

/** Full-screen hook layer: GTA sunset, logo slams on frame 0, Fire Stick slams in, then whips away. */
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const outAt = c("and") - 2;
  if (f > outAt + 10) return null;
  const logo = sp(f, FPS, 0, springs.slam);
  const stickAt = c("Fire");
  const stick = f >= stickAt ? sp(f, FPS, stickAt, springs.slam) : 0;
  const out = ease(ramp(f, outAt, 9));
  const shakeAmt = Math.max(0, 1 - f / 12) * 26 + (f >= stickAt ? Math.max(0, 1 - (f - stickAt) / 10) * 22 : 0);
  const sx = Math.sin(f * 7.3) * shakeAmt;
  const sy = Math.cos(f * 5.1) * shakeAmt;
  const flash = Math.max(0, 0.35 - f / 10) + (f >= stickAt ? Math.max(0, 1 - (f - stickAt) / 4) * 0.6 : 0);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${lerp(1, 0.42, out)}) rotate(${-6 * out}deg)` }}>
      <svg width={SHORT_W} height={SHORT_H} viewBox={`0 0 ${SHORT_W} ${SHORT_H}`} style={{ position: "absolute", inset: 0 }}>
        <SvgDefs />
        <g transform={`translate(${sx},${sy})`}>
          <g transform={`translate(-60,-60) scale(1.12)`}>
            <SunsetBack f={f} w={SHORT_W} h={SHORT_H} horizon={1300} />
            <path d={palmPath} transform="translate(120,1320) scale(9)" fill="#1a0830" />
            <path d={palmPath} transform="translate(900,1320) scale(7)" fill="#1a0830" />
          </g>
          <image
            href={staticFile("shorts/judge/gta6-logo.png")}
            x={540 - 320 * lerp(2.6, 1, logo)}
            y={500 - 243 * lerp(2.6, 1, logo)}
            width={640 * lerp(2.6, 1, logo)}
            height={486 * lerp(2.6, 1, logo)}
          />
          <g transform="translate(540,800)">
            <Stamp x={0} y={0} at={c("leaked")} text="LEAKED" size={120} r={-7} />
          </g>
          {stick > 0 ? (
            <g transform={`translate(540,${lerp(1500, 975, stick)}) rotate(${lerp(30, -6, stick)})`}>
              <circle r="135" fill="#000" opacity=".45" />
              <circle r="135" fill="none" stroke={SUN} strokeWidth="12" />
              <g transform="translate(25,0) scale(.95)">
                <FireStickDrawing f={f} />
              </g>
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
  const pins = [pinOf(POL.exit), pinOf(POL.hotel), pinOf(POL.room), pinOf(POL.leak), pinOf(POL.sent), pinOf(POL.quote)];
  const keys = camKeys();
  return (
    <svg width={BW} height={BH} viewBox={`0 0 ${BW} ${BH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <SvgDefs />
      <filter id="jg-blur">
        <feGaussianBlur stdDeviation="10" />
      </filter>
      <rect x="-1200" y="-1200" width={BW + 2400} height={BH + 2400} fill="#1a120c" />
      <rect x="-1200" y="-1200" width={BW + 2400} height={BH + 2400} fill="#fff" filter="url(#jg-cork)" />
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
      <RedString pts={pins} at={[keys[1].at, keys[2].at, keys[3].at, keys[4].at, keys[5].at]} />
      <RedString pts={[pinOf(POL.quote), { x: GTA_CARD.x, y: GTA_CARD.y - 270 }]} at={[keys[6].at]} />
      <RedString pts={[pinOf(POL.exit), { x: STICK_CARD.x, y: STICK_CARD.y - 110 }]} at={[c("Fire", 0)]} />

      <g transform={`translate(${POL.exit.x},${POL.exit.y - PH / 2 - 190}) rotate(-3)`}>
        <rect x="-330" y="-150" width="660" height="290" fill="#000" opacity=".45" transform="translate(10,14)" />
        <rect x="-330" y="-150" width="660" height="290" fill={PAPER} />
        <text x="0" y="-80" textAnchor="middle" fontFamily={ANTON} fontSize="60" fill={INK} letterSpacing="3">
          THE GTA 6 LEAKER
        </text>
        <image href={staticFile("shorts/judge/gta6-logo.png")} x={-115} y={-62} width={230} height={175} />
        <Pin x={300} y={-140} />
      </g>

      <Polaroid p={POL.exit}>
        <ExitScene f={f} />
      </Polaroid>
      <Note x={STICK_CARD.x} y={STICK_CARD.y} r={7} w={480} h={230} at={c("Fire", 0)}>
        <text x="0" y="-50" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="30" fill={RED}>
          EXHIBIT B
        </text>
        <g transform="translate(20,20) scale(.8)">
          <FireStickDrawing f={f} />
        </g>
        <text x="0" y="96" textAnchor="middle" fontFamily={ANTON} fontSize="40" fill={INK}>
          AMAZON FIRE STICK
        </text>
      </Note>

      <Polaroid p={POL.hotel} at={keys[1].at - 6}>
        <HotelScene f={f} />
      </Polaroid>
      <Note x={POL.hotel.x - 260} y={POL.hotel.y - 470} r={-6} w={300} h={130} at={c("2022.")} color="#f2c230">
        <text x="0" y="22" textAnchor="middle" fontFamily={ANTON} fontSize="64" fill={INK}>
          2022
        </text>
      </Note>
      <Note x={POL.hotel.x + 170} y={POL.hotel.y - 430} r={5} w={380} h={120} at={c("Arion")}>
        <text x="0" y="20" textAnchor="middle" fontFamily={ANTON} fontSize="52" fill={RED}>
          ARION KURTAJ
        </text>
      </Note>

      <Polaroid p={POL.room} at={keys[2].at - 6}>
        <RoomScene f={f} />
      </Polaroid>
      <Polaroid p={POL.leak} at={keys[3].at - 6}>
        <LeakScene f={f} />
      </Polaroid>
      <Polaroid p={POL.sent} at={keys[4].at - 6}>
        <SentenceScene f={f} />
      </Polaroid>
      <Polaroid p={POL.quote} at={keys[5].at - 6}>
        <QuoteScene f={f} />
      </Polaroid>
      <QuoteCard f={f} />

      <Note x={GTA_CARD.x} y={GTA_CARD.y} r={-3} w={680} h={680} at={keys[6].at + 4}>
        <image href={staticFile("shorts/judge/gta6-logo.png")} x={-190} y={-310} width={380} height={289} />
        <text x="0" y="70" textAnchor="middle" fontFamily={ANTON} fontSize="70" fill={INK}>
          OUT 19 NOV 2026
        </text>
        <text x="0" y="135" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="34" fill={RED} letterSpacing="2">
          4 DAYS LATER...
        </text>
        <Stamp x={0} y={245} at={c("free.", 1)} text="LEAKER: FREE" color={GREEN} size={84} r={-4} />
      </Note>
    </svg>
  );
};

/* ------------------------------------------------------------------ main */

const EndCard: React.FC = () => {
  const at = c("Fair?") - 2;
  const s = usePop(at);
  const s2 = usePop(c("Tell"));
  if (s <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 60, width: 840, top: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div
        style={{
          transform: `scale(${lerp(1.6, 1, s)}) rotate(-3deg)`,
          opacity: clamp01(s * 3),
          background: PAPER,
          padding: "22px 44px",
          boxShadow: "10px 14px 0 rgba(0,0,0,0.5)",
          fontFamily: ANTON,
          fontSize: 84,
          whiteSpace: "nowrap",
          color: INK,
          letterSpacing: 3,
        }}
      >
        FAIR? <span style={{ color: RED }}>OR NOT?</span>
      </div>
      {s2 > 0 ? (
        <div style={{ transform: `scale(${s2}) rotate(2deg)`, background: SUN, padding: "12px 30px", fontFamily: ANTON, fontSize: 50, color: INK, letterSpacing: 2 }}>
          TELL ME IN THE COMMENTS ↓
        </div>
      ) : null}
    </div>
  );
};

export const WalksFreeGTA6: React.FC<z.infer<typeof walksFreeSchema>> = ({ showCaptions }) => {
  const f = useCurrentFrame();
  const cam = useCamera(false);
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
        hide={[[c("You") - 2, c("Four") - 2]]}
        centerY={1150}
        fontSize={60}
        maxWords={4}
        maxChars={22}
        left={170}
        right={170}
        hot={["gta6", "firestick", "fire", "stick", "free", "leaked", "rockstar", "90", "$5", "7", "judge", "travelodge", "walked", "kurtaj"]}
      />
      <Audio src={staticFile("shorts/walksfree/vo.mp3")} />
      <Loop durationInFrames={Math.round(62 * FPS)}>
        <Audio src={staticFile("shorts/cyberleak/bed.mp3")} volume={0.16} />
      </Loop>
      <Sfx name="slam" at={0} volume={0.9} />
      <Sfx name="glitch" at={0} volume={0.5} />
      <Sfx name="stamp" at={c("leaked")} volume={0.8} />
      <Sfx name="slam" at={c("Fire")} volume={0.8} />
      <Sfx name="whoosh" at={c("and") - 2} volume={0.8} />
      <Sfx name="door" at={c("walked") - 6} volume={0.8} />
      <Sfx name="stamp" at={c("free.")} volume={0.9} />
      {keys.slice(1).map((k, i) => (
        <Sfx key={i} name="whoosh" at={k.at - 2} volume={0.7} />
      ))}
      {[c("2022."), c("Arion")].map((a, i) => (
        <Sfx key={`n${i}`} name="pop" at={a} volume={0.5} />
      ))}
      {[c("phone"), c("Wi-Fi..."), c("Fire", 1)].map((a, i) => (
        <Sfx key={`r${i}`} name="click" at={a} volume={0.7} />
      ))}
      <Sfx name="type" at={c("breaks")} durationInFrames={c("Rockstar") - c("breaks")} volume={0.5} />
      <Sfx name="notify" at={c("Rockstar")} volume={0.6} />
      <Sfx name="tick" at={c("90")} durationInFrames={30} loop volume={0.5} />
      <Sfx name="stamp" at={c("Leaked", 1)} volume={0.9} />
      <Sfx name="coin" at={c("$5")} volume={0.6} />
      <Sfx name="slam" at={c("7")} volume={0.8} />
      <Sfx name="snap" at={c("But")} volume={0.6} />
      <Sfx name="stamp" at={c("time.")} volume={0.9} />
      <Sfx name="door" at={c("walked", 1)} volume={0.7} />
      <Sfx name="pop" at={c("You") - 3} volume={0.6} />
      <Sfx name="riser" at={c("Four") - 10} volume={0.5} />
      <Sfx name="stamp" at={c("free.", 1)} volume={0.9} />
      <Sfx name="slam" at={c("Fair?") - 2} volume={0.7} />
      <Sfx name="pop" at={c("Tell")} volume={0.5} />
    </AbsoluteFill>
  );
};

export { SHORT_W, SHORT_H };
