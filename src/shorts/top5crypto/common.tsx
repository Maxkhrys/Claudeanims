import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../../theme";
import { sp } from "../../lib/timing";
import { Sfx } from "../../components";
import { big, clamp01, lerp } from "../kit3d";
import { Burst, GOLD, GOWN, PINK } from "../cryptoKit";

/*
 * Shared layout pieces for the Top 5 crypto video.
 * Scene canvas: 1080x1920, content kept in x 60..900, y 200..1100 (scene px). The main
 * component scales the canvas by 0.9 around (540, 760) and nudges it 54px right, so the
 * content lands in x 162..918 / y 256..1066 of the vertical frame: centred and inside the
 * TikTok/Reels/Shorts safe zone. Captions sit at y 1150, the countdown ring at y 1300.
 */

export type C = (w: string, n?: number, o?: number) => number;
export type SceneProps = { c: C; start: number; end: number };

export const CX = 480;
export const L0 = 60;
export const CW = 840;

export const Between: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return <>{children}</>;
};

/**
 * One visual beat. Mounted between `from` and `to`; punches in (scale 1.14 -> 1) and keeps
 * pushing in slowly so nothing ever sits still.
 */
export const Shot: React.FC<{ from: number; to: number; children: React.ReactNode; push?: number; whoosh?: boolean; ox?: number; oy?: number; enter?: "punch" | "fade" | "none" }> = ({
  from,
  to,
  children,
  push = 0.05,
  whoosh = false,
  ox = CX,
  oy = 650,
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

/** Absolutely placed, horizontally centred row in the content column. */
export const Row: React.FC<{ top: number; children: React.ReactNode; gap?: number; style?: React.CSSProperties }> = ({ top, children, gap = 20, style }) => (
  <div style={{ position: "absolute", left: L0, width: CW, top, display: "flex", justifyContent: "center", alignItems: "center", gap, flexWrap: "wrap", ...style }}>{children}</div>
);

export const Pill: React.FC<{ text: string; color?: string; filled?: boolean; size?: number }> = ({ text, color = colors.amber, filled = false, size = 40 }) => (
  <div
    style={{
      display: "inline-block",
      padding: `${size * 0.18}px ${size * 0.5}px`,
      borderRadius: size * 0.25,
      border: `${Math.max(3, size * 0.09)}px solid ${color}`,
      background: filled ? color : "rgba(7,9,11,0.9)",
      ...big(size * 1.2, filled ? colors.bg : color),
      textShadow: "none",
    }}
  >
    {text}
  </div>
);

export const mono = (size: number, color: string = colors.text): React.CSSProperties => ({ fontFamily: fonts.mono, fontWeight: 700, fontSize: size, color, letterSpacing: "0.06em", whiteSpace: "nowrap" });

/** Number that counts up (or down) from `from` to `to` starting at `at`. */
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

/** Slams children in (scale from big) with a thud. */
export const Slam: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; sound?: "slam" | "boom" | "none"; rotate?: number; until?: number }> = ({ at, children, style, sound = "slam", rotate = 0, until = 1e9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame >= until) return null;
  const s = sp(frame, fps, at, springs.slam);
  return (
    <div style={{ position: "absolute", ...style, transform: `scale(${lerp(2.4, 1, s)}) rotate(${rotate}deg)`, opacity: clamp01(s * 3) }}>
      {sound !== "none" ? <Sfx name={sound} at={at} volume={sound === "boom" ? 0.7 : 0.55} /> : null}
      {children}
    </div>
  );
};

/** Pops children in with a spring at `at` (outside 3D). */
export const Pop: React.FC<{ at: number; style?: React.CSSProperties; children: React.ReactNode; sound?: boolean; until?: number; from?: "scale" | "up" | "left" | "right" }> = ({ at, style, children, sound = true, until = 1e9, from = "scale" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame >= until + 8) return null;
  const s = sp(frame, fps, at, springs.pop);
  const out = frame >= until ? clamp01((frame - until) / 8) : 0;
  const k = s * (1 - out);
  const tr =
    from === "scale" ? `scale(${k})` : from === "up" ? `translateY(${(1 - s) * 160}px) scale(${0.6 + 0.4 * k})` : from === "left" ? `translateX(${(1 - s) * -400}px)` : `translateX(${(1 - s) * 400}px)`;
  return (
    <div style={{ position: "absolute", ...style, transform: tr, opacity: from === "scale" ? 1 : clamp01(s * 2) * (1 - out) }}>
      {sound ? <Sfx name="pop" at={at} volume={0.6} /> : null}
      {children}
    </div>
  );
};

export const Glow: React.FC<{ color: string; y?: number; x?: number; a?: string }> = ({ color, y = 40, x = 50, a = "40" }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${x}% ${y}%, ${color}${a}, rgba(0,0,0,0) 58%)` }} />
);

/** Dark panel with a coloured border. */
export const Panel: React.FC<{ w: number; color?: string; children?: React.ReactNode; style?: React.CSSProperties; pad?: number }> = ({ w, color = "#2E3944", children, style, pad = 26 }) => (
  <div style={{ width: w, borderRadius: 26, background: "rgba(10,14,19,0.94)", border: `6px solid ${color}`, boxShadow: `0 0 60px ${color}44, 0 24px 50px rgba(0,0,0,0.6)`, padding: pad, ...style }}>{children}</div>
);

/** Small "dramatised" note for mocked-up posts and chats. */
export const Dramatised: React.FC<{ top: number }> = ({ top }) => <div style={{ position: "absolute", left: L0, width: CW, top, textAlign: "center", ...mono(22, colors.dim) }}>dramatised</div>;

/* ------------------------------------------------------------------ countdown ring */

const RING_Y = 1300;

export const Ring: React.FC<{ n: number; start: number; end: number; name: string; sub: string; color: string }> = ({ n, start, end, name, sub, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = sp(frame, fps, start, springs.pop);
  const p = clamp01((frame - start) / Math.max(1, end - start));
  const R = 62;
  const circ = 2 * Math.PI * R;
  const out = clamp01((frame - (end - 6)) / 6);
  return (
    <div style={{ position: "absolute", left: 170, top: RING_Y, display: "flex", alignItems: "center", gap: 22, opacity: 1 - out }}>
      <div style={{ position: "relative", width: 160, height: 160, transform: `scale(${enter})` }}>
        <svg width={160} height={160} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          <circle cx={80} cy={80} r={R} fill="rgba(7,9,11,0.8)" stroke="rgba(255,255,255,0.15)" strokeWidth={12} />
          <circle cx={80} cy={80} r={R} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * p} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...big(118, "#FFFFFF"), paddingTop: 10 }}>{n}</div>
      </div>
      <div style={{ transform: `translateX(${(1 - enter) * -40}px)`, opacity: enter, maxWidth: 520 }}>
        <div style={{ ...big(62, color) }}>{name}</div>
        <div style={{ ...mono(26), marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

/* landscape (1920x1080) layout of the scene canvas */
export const LS = (() => {
  const S = 1.03;
  const T = 50 - 230 * S;
  const sideL = 1000 - 162 * S;
  const centerL = 960 - 540 * S;
  return { S, T, sideL, centerL };
})();

/** Countdown panel for the landscape version: big ring with the name underneath, left side. */
export const RingWide: React.FC<{ n: number; start: number; end: number; name: string; sub: string; color: string }> = ({ n, start, end, name, sub, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = sp(frame, fps, start + 6, springs.pop);
  const p = clamp01((frame - start) / Math.max(1, end - start));
  const R = 100;
  const circ = 2 * Math.PI * R;
  const out = clamp01((frame - (end - 6)) / 6);
  return (
    <div style={{ position: "absolute", left: 110, top: 230, width: 760, opacity: (1 - out) * clamp01(enter * 2) }}>
      <div style={{ position: "relative", width: 250, height: 250, transform: `scale(${enter})`, transformOrigin: "0 50%" }}>
        <svg width={250} height={250} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          <circle cx={125} cy={125} r={R} fill="rgba(7,9,11,0.8)" stroke="rgba(255,255,255,0.15)" strokeWidth={18} />
          <circle cx={125} cy={125} r={R} fill="none" stroke={color} strokeWidth={18} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * p} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...big(190, "#FFFFFF"), paddingTop: 14 }}>{n}</div>
      </div>
      <div style={{ marginTop: 34, transform: `translateX(${(1 - enter) * -40}px)` }}>
        <div style={{ ...big(104, color), whiteSpace: "normal" }}>{name}</div>
        <div style={{ ...mono(38), marginTop: 14, whiteSpace: "normal" }}>{sub}</div>
      </div>
    </div>
  );
};

/** Big "NUMBER X" card at the start of each story, with a flash and a boom. */
export const NumberCard: React.FC<{ at: number; n: number; color: string }> = ({ at, n, color }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const dur = 26;
  if (frame < at || frame > at + dur) return null;
  const s = sp(frame, fps, at, springs.slam);
  const o = 1 - clamp01((frame - at - dur + 8) / 8);
  const portrait = height > width;
  return (
    <AbsoluteFill style={{ background: `rgba(7,9,11,${0.86 * o})` }}>
      <Sfx name="whoosh" at={at} volume={0.6} />
      <Sfx name="boom" at={at} volume={0.35} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% ${portrait ? 33 : 45}%, ${color}55, rgba(0,0,0,0) 45%)`, opacity: o }} />
      <div style={{ position: "absolute", left: portrait ? 162 : 0, width: portrait ? 756 : width, top: portrait ? 330 : 110, textAlign: "center", opacity: o, transform: `scale(${lerp(1.9, 1, s)})` }}>
        <div style={{ ...big(110, colors.text) }}>NUMBER</div>
        <div style={{ ...big(460, color) }}>{n}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ stage backdrop (opening + #1) */

/** Full-frame concert stage: velvet curtains, sweeping spotlights, LED glow, fireworks. */
export const StageBackdrop: React.FC<{ at?: number; bursts?: number[]; intensity?: number; dim?: number }> = ({ at = 0, bursts = [], intensity = 1, dim = 0 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const f = frame - at;
  const sweep = Math.sin(f / 9) * 14;
  const curtainW = width * 0.16;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "linear-gradient(180deg, #2A0632 0%, #4A0A2A 45%, #1A0410 100%)" }}>
      {/* LED wall */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${GOLD}${Math.round(60 * intensity).toString(16).padStart(2, "0")}, rgba(0,0,0,0) 45%)` }} />
      <AbsoluteFill
        style={{
          opacity: 0.35 * intensity,
          backgroundImage: "radial-gradient(circle, rgba(255,210,120,0.5) 2px, transparent 3px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse at 50% 32%, black 20%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 32%, black 20%, transparent 60%)",
        }}
      />
      {/* spotlights */}
      {[-1, 1].map((sd) => (
        <div
          key={sd}
          style={{
            position: "absolute",
            left: width / 2 + sd * width * 0.42 - width * 0.12,
            top: -height * 0.05,
            width: width * 0.24,
            height: height * 1.1,
            background: `linear-gradient(180deg, rgba(255,240,220,${0.5 * intensity}), rgba(255,240,220,0) 85%)`,
            clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
            transformOrigin: "50% 0",
            transform: `rotate(${sd * (-24 + sweep * sd)}deg)`,
            mixBlendMode: "screen",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: width / 2 - width * 0.2,
          top: -height * 0.05,
          width: width * 0.4,
          height: height * 1.05,
          background: `linear-gradient(180deg, rgba(255,250,235,${0.55 * intensity}), rgba(255,250,235,0.05) 90%)`,
          clipPath: "polygon(44% 0, 56% 0, 100% 100%, 0 100%)",
          mixBlendMode: "screen",
        }}
      />
      {/* stage floor */}
      <div style={{ position: "absolute", left: -width * 0.1, right: -width * 0.1, top: height * 0.63, bottom: 0, background: "linear-gradient(180deg, #3A0D24, #12040B)" }} />
      <div style={{ position: "absolute", left: width / 2 - width * 0.34, width: width * 0.68, top: height * 0.6, height: height * 0.09, borderRadius: "50%", background: `radial-gradient(ellipse, rgba(255,240,220,${0.6 * intensity}), rgba(255,240,220,0) 70%)` }} />
      {/* curtains */}
      {[0, 1].map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            [side ? "right" : "left"]: 0,
            width: curtainW,
            background: `repeating-linear-gradient(90deg, #7A0A1E 0px, ${GOWN} ${curtainW * 0.12}px, #5A0614 ${curtainW * 0.25}px)`,
            boxShadow: "0 0 80px rgba(0,0,0,0.8)",
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: height * 0.06, background: `repeating-linear-gradient(90deg, #7A0A1E 0px, ${GOWN} 40px, #5A0614 80px)`, boxShadow: "0 10px 40px rgba(0,0,0,0.7)" }} />
      {bursts.map((b, i) => (
        <Burst key={i} x={width * (i % 2 ? 0.74 : 0.26) + (random(`bx-${i}`) - 0.5) * width * 0.1} y={height * (0.16 + 0.1 * random(`by-${i}`))} at={b} color={[GOLD, PINK, "#7CF3FF", "#FFFFFF"][i % 4]} r={Math.min(width, height) * 0.2} sound={false} />
      ))}
      {dim > 0 ? <AbsoluteFill style={{ background: `rgba(5,2,6,${dim})` }} /> : null}
    </AbsoluteFill>
  );
};

/** Full-frame white flash: holds at full white for `hold` frames, then fades. */
export const WhiteFlash: React.FC<{ at: number; hold?: number; fade?: number; color?: string }> = ({ at, hold = 3, fade = 14, color = "#FFFFFF" }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > hold + fade) return null;
  const o = t < hold ? 1 : 1 - (t - hold) / fade;
  return <AbsoluteFill style={{ background: color, opacity: o * o }} />;
};
