import React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Sfx } from "../components";
import { big, clamp01, lerp } from "../shorts/kit3d";

/*
 * Shared pieces for "Every Famous Hack Explained".
 * Every scene is drawn on a 1000x1000 canvas (S = 1000). EveryHack.tsx places that canvas
 * inside the vertical safe zone (9:16) or in the middle of the 16:9 frame.
 */

export const S = 1000;
export const YELLOW = "#FFD60A";
export const BLUE = "#3FB6FF";
export const RED = colors.red;
export const GREEN = colors.green;

export type C = (w: string, n?: number, o?: number) => number;
export type SceneProps = { c: C; D: number };

export const ramp = (f: number, at: number, dur = 10) => clamp01((f - at) / dur);
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

export const mono = (size: number, color: string = colors.text): React.CSSProperties => ({
  fontFamily: fonts.mono,
  fontWeight: 700,
  fontSize: size,
  color,
  letterSpacing: "0.06em",
  whiteSpace: "nowrap",
});

/** One visual beat: punches in and keeps pushing slowly so nothing sits still. */
export const Shot: React.FC<{ from: number; to: number; children: React.ReactNode; push?: number; whoosh?: boolean; ox?: number; oy?: number; enter?: "punch" | "fade" | "none" }> = ({
  from,
  to,
  children,
  push = 0.05,
  whoosh = false,
  ox = S / 2,
  oy = S / 2,
  enter = "punch",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from || frame >= to) return null;
  const e = enter === "none" ? 1 : sp(frame, fps, from, springs.snappy);
  const life = clamp01((frame - from) / Math.max(1, to - from));
  const scale = (enter === "punch" ? lerp(1.14, 1, e) : 1) * (1 + push * life);
  const op = enter === "fade" ? clamp01((frame - from) / 6) : clamp01((frame - from) / 3 + 0.4);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: `${ox}px ${oy}px`, opacity: op }}>
      {whoosh ? <Sfx name="whoosh" at={from} volume={0.45} /> : null}
      {children}
    </AbsoluteFill>
  );
};

/** Horizontally centred row across the canvas. */
export const Row: React.FC<{ top: number; children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({ top, children, gap = 20, style }) => (
  <div style={{ position: "absolute", left: 0, width: S, top, display: "flex", justifyContent: "center", alignItems: "center", gap, ...style }}>{children}</div>
);

/** Pops in with a spring at `at`; `until` pops it out again. Position via a wrapping Row or style. */
export const Pop: React.FC<{ at: number; until?: number; children: React.ReactNode; sound?: "pop" | "slam" | "boom" | "whoosh" | "none"; from?: "scale" | "up" | "left" | "right"; style?: React.CSSProperties }> = ({
  at,
  until = 1e9,
  children,
  sound = "pop",
  from = "scale",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame >= until + 8) return null;
  const s = sp(frame, fps, at, sound === "slam" || sound === "boom" ? springs.slam : springs.pop);
  const out = frame >= until ? clamp01((frame - until) / 8) : 0;
  const k = s * (1 - out);
  const tr =
    sound === "slam" || sound === "boom"
      ? `scale(${lerp(2.3, 1, s) * (1 - out)})`
      : from === "scale"
        ? `scale(${k})`
        : from === "up"
          ? `translateY(${(1 - s) * 160}px)`
          : from === "left"
            ? `translateX(${(1 - s) * -500}px)`
            : `translateX(${(1 - s) * 500}px)`;
  return (
    <div style={{ position: "relative", transform: tr, opacity: from === "scale" && sound !== "slam" && sound !== "boom" ? 1 - out : clamp01(s * 3) * (1 - out), ...style }}>
      {sound !== "none" ? <Sfx name={sound} at={at} volume={sound === "boom" ? 0.7 : sound === "slam" ? 0.55 : 0.6} /> : null}
      {children}
    </div>
  );
};

export const Pill: React.FC<{ text: string; color?: string; filled?: boolean; size?: number; rotate?: number }> = ({ text, color = YELLOW, filled = false, size = 44, rotate = 0 }) => (
  <div
    style={{
      display: "inline-block",
      padding: `${size * 0.18}px ${size * 0.5}px`,
      borderRadius: size * 0.25,
      border: `${Math.max(3, size * 0.09)}px solid ${color}`,
      background: filled ? color : "rgba(7,9,11,0.9)",
      ...big(size * 1.2, filled ? colors.bg : color),
      textShadow: "none",
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 0 ${size}px ${color}44`,
    }}
  >
    {text}
  </div>
);

/** Yellow "click word" block in the channel style. */
export const Hit: React.FC<{ text: string; size?: number; color?: string; rotate?: number }> = ({ text, size = 120, color = YELLOW, rotate = -2 }) => (
  <div style={{ display: "inline-block", padding: `${size * 0.06}px ${size * 0.26}px`, borderRadius: size * 0.12, background: color, transform: `rotate(${rotate}deg)`, boxShadow: `0 0 ${size * 0.6}px ${color}55` }}>
    <div style={{ ...big(size, colors.bg), textShadow: "none" }}>{text}</div>
  </div>
);

export const Glow: React.FC<{ color: string; y?: number; x?: number; a?: string }> = ({ color, y = 45, x = 50, a = "40" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${x}% ${y}%, ${color}${a}, rgba(0,0,0,0) 60%)` }} />
);

/** Number that counts from `from` to `to` starting at `at`. */
export const CountUp: React.FC<{ at: number; to: number; from?: number; dur?: number; prefix?: string; suffix?: string; size: number; color: string; fmt?: (n: number) => string; tick?: boolean }> = ({
  at,
  to,
  from = 0,
  dur = 24,
  prefix = "",
  suffix = "",
  size,
  color,
  fmt = (n) => Math.round(n).toLocaleString("en-US"),
  tick = true,
}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  const e = 1 - Math.pow(1 - p, 3);
  return (
    <div style={{ ...big(size, color) }}>
      {tick && frame >= at ? <Sfx name="tick" at={at} volume={0.35} durationInFrames={dur} /> : null}
      {prefix}
      {fmt(from + (to - from) * e)}
      {suffix}
    </div>
  );
};

/** Screen shake after each hit frame. */
export const ShakeAt: React.FC<{ hits: number[]; amount?: number; children: React.ReactNode }> = ({ hits, amount = 30, children }) => {
  const frame = useCurrentFrame();
  let k = 0;
  for (const h of hits) if (frame >= h) k = Math.max(k, Math.exp(-(frame - h) / 4.5));
  const dx = (random(`shx-${frame}`) - 0.5) * amount * k;
  const dy = (random(`shy-${frame}`) - 0.5) * amount * k;
  return <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) rotate(${(random(`shr-${frame}`) - 0.5) * k * 1.5}deg)` }}>{children}</AbsoluteFill>;
};

export const WhiteFlash: React.FC<{ at: number; hold?: number; fade?: number; color?: string }> = ({ at, hold = 2, fade = 12, color = "#FFFFFF" }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > hold + fade) return null;
  const o = t < hold ? 1 : 1 - (t - hold) / fade;
  return <AbsoluteFill style={{ background: color, opacity: o * o, pointerEvents: "none" }} />;
};

/** Small "dramatised" note for mocked-up calls and chats. */
export const Dramatised: React.FC<{ top: number }> = ({ top }) => <div style={{ position: "absolute", left: 0, width: S, top, textAlign: "center", ...mono(20, colors.dim) }}>dramatised</div>;

/* ------------------------------------------------------------------ real logos */

export type LogoId = "cornell" | "mit" | "motorola" | "nokia" | "fbi" | "yahoo" | "gta6" | "sony";
const LOGO_FILE: Record<LogoId, { file: string; card?: string }> = {
  cornell: { file: "cornell-color.svg", card: "#FFFFFF" },
  mit: { file: "mit.svg", card: "#FFFFFF" },
  motorola: { file: "motorola-color.svg", card: "#FFFFFF" },
  nokia: { file: "nokia-color.svg", card: "#FFFFFF" },
  fbi: { file: "fbi.svg" },
  yahoo: { file: "yahoo.svg", card: "#FFFFFF" },
  gta6: { file: "gta6.png" },
  sony: { file: "sony.svg" },
};

/** A real logo; brands with dark marks sit on a white card so they read on the dark scene. */
export const Logo: React.FC<{ id: LogoId; h: number; maxW?: number; card?: boolean }> = ({ id, h, maxW = h * 3.4, card = true }) => {
  const l = LOGO_FILE[id];
  const img = <Img src={staticFile(`thumbnails/logos/${l.file}`)} style={{ height: h, maxWidth: maxW, objectFit: "contain", display: "block" }} />;
  if (!card || !l.card) return <div style={{ filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.7))" }}>{img}</div>;
  return (
    <div style={{ padding: `${h * 0.18}px ${h * 0.28}px`, borderRadius: h * 0.16, background: l.card, boxShadow: "0 16px 40px rgba(0,0,0,0.6)", border: "4px solid #0B0C10" }}>{img}</div>
  );
};

/* ------------------------------------------------------------------ props */

/** Old-school telephone handset (SVG), `size` = width. */
export const Handset: React.FC<{ size: number; color?: string; ring?: number }> = ({ size, color = "#E6E6E6", ring = 0 }) => {
  const frame = useCurrentFrame();
  const wob = ring > 0 ? Math.sin(frame * 2.2) * 9 * ring : 0;
  return (
    <svg width={size} height={size} viewBox="-60 -60 120 120" style={{ overflow: "visible", transform: `rotate(${-20 + wob}deg)` }}>
      <path d="M-44,-18 q-6,-22 14,-28 l14,-4 q6,-2 8,4 l6,18 q2,6 -4,8 l-12,4 q4,22 26,32 l4,-12 q2,-6 8,-4 l18,6 q6,2 4,8 l-4,14 q-6,20 -28,14 q-44,-14 -54,-60z" fill={color} stroke="#0B0C10" strokeWidth={4} />
      {ring > 0
        ? [0, 1, 2].map((i) => (
            <path key={i} d={`M${18 + i * 12},${-40 - i * 10} q${14 + i * 6},${10 + i * 4} ${16 + i * 6},${28 + i * 8}`} stroke={YELLOW} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 4 + i))} />
          ))
        : null}
    </svg>
  );
};

/** Desk telephone (90s office phone). */
export const DeskPhone: React.FC<{ w: number; ring?: boolean; color?: string }> = ({ w, ring = false, color = "#D9DEE3" }) => {
  const frame = useCurrentFrame();
  const jump = ring ? Math.abs(Math.sin(frame * 1.6)) * 10 : 0;
  return (
    <div style={{ position: "relative", width: w, height: w * 0.75 }}>
      <svg width={w} height={w * 0.75} viewBox="0 0 200 150" style={{ overflow: "visible" }}>
        <path d="M20,140 L40,60 L160,60 L180,140 Z" fill={color} stroke="#0B0C10" strokeWidth={5} />
        <rect x={62} y={78} width={76} height={50} rx={6} fill="#2A3442" />
        {[0, 1, 2].map((r) => [0, 1, 2].map((k) => <rect key={`${r}${k}`} x={68 + k * 24} y={83 + r * 15} width={16} height={10} rx={2} fill="#E6E6E6" />))}
        <g transform={`translate(0,${-jump})`}>
          <path d="M14,58 q0,-30 30,-34 h112 q30,4 30,34 l-28,6 q-4,-16 -20,-16 h-76 q-16,0 -20,16z" fill={color} stroke="#0B0C10" strokeWidth={5} />
        </g>
      </svg>
      {ring ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: -w * 0.32, textAlign: "center", ...big(w * 0.24, YELLOW), opacity: 0.6 + 0.4 * Math.abs(Math.sin(frame / 3)) }}>RING RING</div>
      ) : null}
    </div>
  );
};

/** Chunky CRT monitor. `children` draw on the screen. */
export const Crt: React.FC<{ w: number; children?: React.ReactNode; glow?: string; dead?: boolean }> = ({ w, children, glow = GREEN, dead = false }) => (
  <div style={{ width: w, position: "relative" }}>
    <div style={{ width: w, height: w * 0.8, borderRadius: w * 0.07, background: "#CFC8B8", border: `${w * 0.025}px solid #0B0C10`, padding: w * 0.07, boxSizing: "border-box", boxShadow: dead ? "none" : `0 0 ${w * 0.4}px ${glow}44` }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: w * 0.05, background: dead ? "#050607" : "#06120B", overflow: "hidden", border: "3px solid #0B0C10" }}>
        {dead ? null : children}
        <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 2px, transparent 2px 5px)" }} />
      </div>
    </div>
    <div style={{ margin: "0 auto", width: w * 0.36, height: w * 0.09, background: "#B9B2A2", border: `${w * 0.02}px solid #0B0C10`, borderTop: "none" }} />
    <div style={{ margin: "0 auto", width: w * 0.6, height: w * 0.05, borderRadius: w * 0.02, background: "#B9B2A2", border: `${w * 0.02}px solid #0B0C10` }} />
  </div>
);

/** Little worm sprite. */
export const Worm: React.FC<{ size: number; color?: string; phase?: number }> = ({ size, color = GREEN, phase = 0 }) => {
  const frame = useCurrentFrame();
  const pts = new Array(6).fill(0).map((_, i) => [i * 16, Math.sin(frame / 3 + i * 0.9 + phase) * 6]);
  return (
    <svg width={size} height={size * 0.5} viewBox="-10 -20 100 40" style={{ overflow: "visible" }}>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 5 ? 11 : 9} fill={color} stroke="#0B0C10" strokeWidth={3} />
      ))}
      <circle cx={84} cy={pts[5][1] - 3} r={3} fill="#0B0C10" />
    </svg>
  );
};

/** Big tick in a circle. */
export const Check: React.FC<{ size: number; color?: string }> = ({ size, color = GREEN }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={44} fill="rgba(7,9,11,0.9)" stroke={color} strokeWidth={8} />
    <path d="M28,52 l15,15 l30,-34" stroke={color} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Red cross drawn over something, wipes in at `at`. */
export const CrossOut: React.FC<{ at: number; size: number }> = ({ at, size }) => {
  const frame = useCurrentFrame();
  const p1 = clamp01((frame - at) / 5);
  const p2 = clamp01((frame - at - 4) / 5);
  if (frame < at) return null;
  const L = size * 1.41;
  return (
    <svg width={size} height={size} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <line x1={0} y1={0} x2={size * p1} y2={size * p1} stroke={RED} strokeWidth={size * 0.08} strokeLinecap="round" strokeDasharray={L} />
      <line x1={size} y1={0} x2={size - size * p2} y2={size * p2} stroke={RED} strokeWidth={size * 0.08} strokeLinecap="round" />
    </svg>
  );
};

/** Rubber stamp that thumps on. */
export const Stamp: React.FC<{ at: number; text: string; color?: string; size?: number; rotate?: number }> = ({ at, text, color = RED, size = 110, rotate = -10 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = sp(frame, fps, at, springs.slam);
  return (
    <div style={{ transform: `rotate(${rotate}deg) scale(${lerp(2.2, 1, s)})`, opacity: clamp01(s * 3), display: "inline-block" }}>
      <Sfx name="stamp" at={at} volume={0.7} />
      <div style={{ padding: `${size * 0.08}px ${size * 0.3}px`, border: `${size * 0.09}px solid ${color}`, borderRadius: size * 0.12, ...big(size, color), textShadow: "none", background: "rgba(7,9,11,0.55)" }}>{text}</div>
    </div>
  );
};

/** Speech bubble. */
export const Bubble: React.FC<{ text: string; w?: number; color?: string; tail?: "left" | "right"; size?: number; ink?: string }> = ({ text, w = 420, color = "#FFFFFF", tail = "left", size = 38, ink = "#0B0C10" }) => (
  <div style={{ position: "relative", width: w }}>
    <div style={{ padding: "18px 24px", borderRadius: 26, background: color, fontFamily: fonts.sans, fontWeight: 800, fontSize: size, lineHeight: 1.15, color: ink, boxShadow: "0 14px 30px rgba(0,0,0,0.5)", border: "4px solid #0B0C10" }}>{text}</div>
    <div style={{ position: "absolute", [tail]: 40, bottom: -24, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `28px solid ${color}` }} />
  </div>
);

/** Flashing red alarm light strip across the top of a scene. */
export const Alarm: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const on = Math.floor((frame - from) / 5) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: on ? "radial-gradient(ellipse at 50% 0%, rgba(255,40,40,0.5), rgba(0,0,0,0) 60%)" : "transparent", pointerEvents: "none" }}>
      {frame - from < 2 ? <Sfx name="error" at={from} volume={0.5} /> : null}
    </AbsoluteFill>
  );
};

/** Hooded silhouette with a "?" - teases the next hacker without showing them. */
export const Mystery: React.FC<{ size: number; label?: string; color?: string }> = ({ size, label = "?", color = YELLOW }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", width: size * 0.7, height: size }}>
      <svg width={size * 0.7} height={size} viewBox="0 0 140 200">
        <path d="M70,8 q44,0 50,52 q4,30 -8,50 q30,14 34,90 h-152 q4,-76 34,-90 q-12,-20 -8,-50 q6,-52 50,-52z" fill="#050607" stroke="#2E3944" strokeWidth={4} />
        <ellipse cx={56} cy={74} rx={6} ry={4} fill={color} opacity={0.7 + 0.3 * Math.sin(frame / 6)} />
        <ellipse cx={84} cy={74} rx={6} ry={4} fill={color} opacity={0.7 + 0.3 * Math.sin(frame / 6)} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: size * 0.5, textAlign: "center", ...big(size * 0.36, color) }}>{label}</div>
    </div>
  );
};
