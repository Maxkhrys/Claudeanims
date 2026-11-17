import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Sfx } from "./Sfx";

export type CarType = "supercar" | "sedan" | "mini" | "bike";

/** Simple side-view vehicle silhouette. `size` is the width in px. */
export const Car: React.FC<{ type?: CarType; color?: string; size?: number; style?: React.CSSProperties }> = ({
  type = "supercar",
  color = colors.gold,
  size = 300,
  style,
}) => {
  const wheel = (x: number, r = 17) => (
    <g key={x}>
      <circle cx={x} cy={78} r={r} fill="#0B0E11" stroke="#3A444E" strokeWidth={4} />
      <circle cx={x} cy={78} r={r * 0.38} fill="#59636D" />
    </g>
  );
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 200 100" style={{ overflow: "visible", filter: `drop-shadow(0 0 16px ${color}44)`, ...style }}>
      <ellipse cx={100} cy={96} rx={86} ry={5} fill="#000" opacity={0.5} />
      {type === "supercar" ? (
        <g>
          <path d="M 6 76 L 10 62 L 58 52 L 92 36 L 138 36 L 168 54 L 194 62 L 196 76 Z" fill={color} />
          <path d="M 96 40 L 134 40 L 154 54 L 76 54 Z" fill="#0B0E11" opacity={0.75} />
          <path d="M 10 68 H 40" stroke="#0B0E11" strokeWidth={3} opacity={0.5} />
          {[46, 158].map((x) => wheel(x))}
        </g>
      ) : null}
      {type === "sedan" ? (
        <g>
          <path d="M 6 76 L 8 56 L 46 50 L 70 28 L 136 28 L 162 50 L 192 56 L 196 76 Z" fill={color} />
          <path d="M 74 33 L 100 33 L 100 50 L 56 50 Z M 106 33 L 133 33 L 152 50 L 106 50 Z" fill="#0B0E11" opacity={0.75} />
          {[46, 158].map((x) => wheel(x))}
        </g>
      ) : null}
      {type === "mini" ? (
        <g>
          <path d="M 30 76 L 30 52 L 52 46 L 66 22 L 138 22 L 150 46 L 170 52 L 172 76 Z" fill={color} />
          <path d="M 70 27 L 98 27 L 98 46 L 60 46 Z M 104 27 L 134 27 L 143 46 L 104 46 Z" fill="#0B0E11" opacity={0.75} />
          <rect x={66} y={18} width={72} height={6} rx={3} fill="#E6E6E6" />
          {[60, 142].map((x) => wheel(x, 15))}
        </g>
      ) : null}
      {type === "bike" ? (
        <g>
          <path d="M 52 78 L 84 46 L 128 46 L 150 78 M 84 46 L 100 70 L 128 46 M 128 46 L 140 30 L 156 30" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 76 40 H 118 L 110 50 H 84 Z" fill={color} />
          {[52, 150].map((x) => wheel(x, 19))}
        </g>
      ) : null}
    </svg>
  );
};

/**
 * A garage whose door rolls up at `openAt` to reveal whatever you put inside.
 * Children are laid out in a row on the garage floor.
 */
export const AssetGarage: React.FC<{
  width?: number;
  height?: number;
  openAt: number;
  openDuration?: number;
  label?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ width = 1500, height = 560, openAt, openDuration = 40, label, style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const open = sp(frame, fps, openAt, springs.smooth, openDuration);
  const slats = Math.ceil(height / 46);
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        border: "14px solid #1C232A",
        borderBottom: "none",
        borderRadius: "14px 14px 0 0",
        background: "linear-gradient(to bottom, #0E1317, #151C22)",
        overflow: "hidden",
        boxShadow: "0 30px 90px rgba(0,0,0,0.7)",
        ...style,
      }}
    >
      <Sfx name="rumble" at={openAt} durationInFrames={openDuration} loop volume={0.9} />
      {/* strip light */}
      <div style={{ position: "absolute", left: "10%", right: "10%", top: 10, height: 8, borderRadius: 4, background: colors.text, opacity: 0.25 + 0.6 * open, boxShadow: `0 0 60px ${colors.text}` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.10), rgba(0,0,0,0) 70%)", opacity: open }} />
      {/* floor */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, background: "linear-gradient(to bottom, #20282F, #0C1014)" }} />
      <div style={{ position: "absolute", left: 30, right: 30, bottom: 34, display: "flex", justifyContent: "space-around", alignItems: "flex-end" }}>{children}</div>
      {/* the door */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "100%", transform: `translateY(${-open * 101}%)` }}>
        {new Array(slats).fill(0).map((_, i) => (
          <div key={i} style={{ height: 46, background: "linear-gradient(to bottom, #2A333B, #1A2128)", borderBottom: "3px solid #0C1014" }} />
        ))}
        {label ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: "42%", textAlign: "center", fontFamily: fonts.mono, fontSize: 40, fontWeight: 700, letterSpacing: "0.3em", color: colors.dim }}>
            {label}
          </div>
        ) : null}
      </div>
    </div>
  );
};
