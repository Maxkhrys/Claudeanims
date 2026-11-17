import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Sfx } from "./Sfx";

export type EvidenceItem = {
  id: string;
  /** centre position on the board, px */
  x: number;
  y: number;
  at: number;
  title: string;
  sub?: string;
  color?: string;
  width?: number;
  /** bigger card, used for the final suspect */
  big?: boolean;
};

export type EvidenceString = { from: string; to: string; at: number };

/** Investigation board: pinned cards, and red strings that snap between them. */
export const EvidenceBoard: React.FC<{
  width?: number;
  height?: number;
  items: EvidenceItem[];
  strings?: EvidenceString[];
  style?: React.CSSProperties;
}> = ({ width = 1700, height = 800, items, strings = [], style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        borderRadius: 14,
        border: `2px solid ${colors.line}`,
        background: "linear-gradient(135deg, #0F1418, #0A0D10)",
        backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1.5px, transparent 1.5px)",
        backgroundSize: "34px 34px",
        boxShadow: "0 40px 110px rgba(0,0,0,0.7)",
        ...style,
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {strings.map((s, i) => {
          const a = byId[s.from];
          const b = byId[s.to];
          if (!a || !b || frame < s.at) return null;
          const p = sp(frame, fps, s.at, springs.pop);
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y - (a.big ? 70 : 44)}
              x2={a.x + (b.x - a.x) * p}
              y2={a.y - (a.big ? 70 : 44) + (b.y - (b.big ? 70 : 44) - (a.y - (a.big ? 70 : 44))) * p}
              stroke={colors.red}
              strokeWidth={5}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${colors.red})` }}
            />
          );
        })}
      </svg>
      {strings.map((s, i) => (
        <Sfx key={i} name="snap" at={s.at} />
      ))}
      {items.map((it) => {
        if (frame < it.at) return null;
        const p = sp(frame, fps, it.at, springs.pop);
        const c = it.color ?? colors.text;
        const w = it.width ?? (it.big ? 520 : 330);
        return (
          <div
            key={it.id}
            style={{
              position: "absolute",
              left: it.x - w / 2,
              top: it.y - (it.big ? 70 : 44),
              width: w,
              transform: `scale(${p}) rotate(${((it.x * 7 + it.y * 3) % 5) - 2}deg)`,
              transformOrigin: "center top",
            }}
          >
            <Sfx name="pop" at={it.at} volume={0.7} />
            <div style={{ position: "absolute", left: w / 2 - 11, top: -11, width: 22, height: 22, borderRadius: 11, background: colors.red, boxShadow: `0 0 14px ${colors.red}`, zIndex: 2 }} />
            <div
              style={{
                padding: it.big ? "26px 26px 22px" : "20px 20px 16px",
                background: colors.panelLight,
                border: `2px solid ${c}`,
                borderRadius: 8,
                boxShadow: `0 16px 40px rgba(0,0,0,0.6), 0 0 40px ${c}22`,
                textAlign: "center",
              }}
            >
              <div style={{ fontFamily: it.big ? fonts.display : fonts.mono, fontSize: it.big ? 76 : 30, fontWeight: 700, lineHeight: 1.05, color: c, wordBreak: "break-word" }}>
                {it.title}
              </div>
              {it.sub ? <div style={{ fontFamily: fonts.mono, fontSize: it.big ? 26 : 21, color: colors.dim, marginTop: 6 }}>{it.sub}</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};
