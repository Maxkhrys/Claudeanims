import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Sfx, type SfxName } from "../components";

/** Shorts frame and the area that stays clear of the apps' own buttons and text. */
export const SHORT = { width: 1080, height: 1920 } as const;
export const SAFE = { left: 60, right: 940, top: 230, bottom: 1480 } as const;

/**
 * A flat plane in 3D room space. (x, y, z) is the plane's centre:
 * x to the right, y UP, z towards the viewer. Parent must be preserve-3d.
 */
export const P: React.FC<{
  w: number;
  h: number;
  x?: number;
  y?: number;
  z?: number;
  rx?: number;
  ry?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ w, h, x = 0, y = 0, z = 0, rx = 0, ry = 0, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: -w / 2,
      top: -h / 2,
      width: w,
      height: h,
      transform: `translate3d(${x}px, ${-y}px, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`,
      backfaceVisibility: "visible",
      ...style,
    }}
  >
    {children}
  </div>
);

/** A box standing on the floor. (x, z) is the centre of its base, `y` the height of its base. */
export const Box: React.FC<{
  w: number;
  h: number;
  d: number;
  x?: number;
  y?: number;
  z?: number;
  top: string;
  front: string;
  side: string;
  topChildren?: React.ReactNode;
  frontChildren?: React.ReactNode;
}> = ({ w, h, d, x = 0, y = 0, z = 0, top, front, side, topChildren, frontChildren }) => (
  <>
    <P w={d} h={h} x={x - w / 2} y={y + h / 2} z={z} ry={90} style={{ background: side }} />
    <P w={d} h={h} x={x + w / 2} y={y + h / 2} z={z} ry={90} style={{ background: side }} />
    <P w={w} h={h} x={x} y={y + h / 2} z={z + d / 2} style={{ background: front }}>
      {frontChildren}
    </P>
    <P w={w} h={d} x={x} y={y + h} z={z} rx={90} style={{ background: top }}>
      {topChildren}
    </P>
  </>
);

/** Sum of short zoom "punches" at the given frames. Multiply a scale by (1 + punch). */
export const punch = (frame: number, beats: number[], amount = 0.06, decay = 4) =>
  beats.reduce((s, b) => (frame >= b ? s + amount * Math.exp(-(frame - b) / decay) : s), 0);

/** Bold tag that slams in: a small label and a big value. */
export const SlamTag: React.FC<{
  at: number;
  label: string;
  value: string;
  color?: string;
  top: number;
  left?: number;
  rotate?: number;
  sound?: SfxName | false;
}> = ({ at, label, value, color = colors.red, top, left = SAFE.left, rotate = -2, sound = "stamp" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = sp(frame, fps, at, springs.slam);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        transform: `rotate(${rotate}deg) scale(${2.6 - 1.6 * s})`,
        transformOrigin: "left center",
        opacity: Math.min(1, (frame - at) / 2),
      }}
    >
      {sound ? <Sfx name={sound} at={at} /> : null}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 22,
          padding: "10px 28px 6px 22px",
          background: "rgba(7,9,11,0.92)",
          borderLeft: `14px solid ${color}`,
          border: `4px solid ${color}`,
          borderLeftWidth: 14,
          borderRadius: 12,
          boxShadow: `0 0 50px ${color}55, 0 18px 40px rgba(0,0,0,0.7)`,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: colors.text, letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontFamily: fonts.display, fontSize: 92, lineHeight: 1, color, textShadow: `0 0 30px ${color}66` }}>{value}</span>
      </div>
    </div>
  );
};

/** Thin bar at the very top that fills over the whole Short. */
export const ProgressBar: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: SHORT.width, height: 10, background: "rgba(255,255,255,0.08)" }}>
      <div style={{ width: `${Math.min(100, (frame / total) * 100)}%`, height: "100%", background: colors.green, boxShadow: `0 0 16px ${colors.green}` }} />
    </div>
  );
};

/** The hook, kept small at the top after the opening so late arrivals still get it. */
export const HookStrip: React.FC<{ at: number; text: string }> = ({ at, text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = sp(frame, fps, at, springs.snappy);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 236, display: "flex", justifyContent: "center", opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * -30}px)` }}>
      <div style={{ padding: "8px 24px 4px", borderRadius: 10, background: colors.amber, color: colors.bg, fontFamily: fonts.display, fontSize: 50, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
        {text}
      </div>
    </div>
  );
};

/** Inventory card that flips down into place. */
export const FlipCard: React.FC<{
  at: number;
  top: number;
  slot: string;
  title: string;
  stat: string;
  color: string;
  icon: React.ReactNode;
  badge?: { text: string; at: number };
}> = ({ at, top, slot, title, stat, color, icon, badge }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at - 1) return null;
  const s = sp(frame, fps, at, springs.pop);
  const b = badge ? sp(frame, fps, badge.at, springs.slam) : 0;
  return (
    <div style={{ position: "absolute", left: SAFE.left, top, width: 880, height: 210, perspective: 1400 }}>
      <Sfx name="click" at={at} />
      <Sfx name="whoosh" at={at - 2} volume={0.5} />
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `rotateX(${(1 - s) * -92}deg) translateY(${(1 - s) * -40}px)`,
          transformOrigin: "center top",
          borderRadius: 18,
          background: "linear-gradient(135deg, #151C23, #0B1014)",
          border: `4px solid ${color}`,
          boxShadow: `0 0 60px ${color}33, 0 26px 50px rgba(0,0,0,0.75)`,
          display: "flex",
          alignItems: "center",
          gap: 30,
          padding: "0 30px",
        }}
      >
        <div style={{ width: 170, height: 150, borderRadius: 14, background: "#07090B", border: `2px solid ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 24, color: colors.dim, letterSpacing: "0.2em" }}>{slot}</div>
          <div style={{ fontFamily: fonts.display, fontSize: 104, lineHeight: 0.95, color, textShadow: `0 0 30px ${color}55`, whiteSpace: "nowrap" }}>{title}</div>
          <div style={{ fontFamily: fonts.mono, fontSize: 27, color: colors.text, opacity: 0.85, whiteSpace: "nowrap" }}>{stat}</div>
        </div>
      </div>
      {badge && frame >= badge.at ? (
        <div style={{ position: "absolute", right: 24, top: 18, transform: `rotate(8deg) scale(${2.4 - 1.4 * b})`, padding: "4px 16px 0", border: `5px solid ${colors.red}`, borderRadius: 10, background: "rgba(7,9,11,0.9)", fontFamily: fonts.display, fontSize: 56, color: colors.red }}>
          <Sfx name="stamp" at={badge.at} />
          {badge.text}
        </div>
      ) : null}
    </div>
  );
};
