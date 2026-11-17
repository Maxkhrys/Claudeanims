import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Sfx } from "./Sfx";

/** Rubber-stamp label (SEIZED, SCAMMED, GONE...). Position with `style`. */
export const SeizedStamp: React.FC<{
  at: number;
  text?: string;
  color?: string;
  fontSize?: number;
  rotate?: number;
  sound?: boolean;
  style?: React.CSSProperties;
}> = ({ at, text = "SEIZED", color = colors.red, fontSize = 64, rotate = -12, sound = true, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = sp(frame, fps, at, springs.slam);
  return (
    <div
      style={{
        position: "absolute",
        ...style,
        transform: `rotate(${rotate}deg) scale(${2.6 - 1.6 * s})`,
        opacity: Math.min(1, (frame - at) / 2),
      }}
    >
      {sound ? <Sfx name="stamp" at={at} /> : null}
      <div
        style={{
          padding: `${fontSize * 0.06}px ${fontSize * 0.34}px`,
          border: `${Math.max(3, fontSize * 0.08)}px solid ${color}`,
          outline: `2px solid ${color}`,
          outlineOffset: 4,
          borderRadius: fontSize * 0.14,
          fontFamily: fonts.display,
          fontSize,
          lineHeight: 1.1,
          letterSpacing: "0.08em",
          color,
          background: "rgba(7,9,11,0.72)",
          textShadow: `0 0 ${fontSize * 0.3}px ${color}77`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};
