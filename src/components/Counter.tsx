import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";

/** Animated number ticker with spring easing. */
export const Counter: React.FC<{
  from?: number;
  to: number;
  /** frame (local) when counting starts */
  at?: number;
  durationInFrames?: number;
  prefix?: string;
  /** appears with a pop once the count lands */
  suffix?: string;
  color?: string;
  fontSize?: number;
  /** custom number formatting; default adds thousands separators */
  format?: (n: number) => string;
  style?: React.CSSProperties;
}> = ({
  from = 0,
  to,
  at = 0,
  durationInFrames = 60,
  prefix = "",
  suffix = "",
  color = colors.green,
  fontSize = 160,
  format,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = sp(frame, fps, at, springs.smooth, durationInFrames);
  const value = Math.round(from + (to - from) * p);
  const landed = frame >= at + durationInFrames - 4;
  const suffixPop = sp(frame, fps, at + durationInFrames - 4, springs.pop);
  const land = sp(frame, fps, at + durationInFrames - 4, springs.pop);
  const scale = landed ? 1 + 0.08 * (1 - land) : 1;

  return (
    <div
      style={{
        fontFamily: fonts.mono,
        fontWeight: 700,
        fontSize,
        lineHeight: 1,
        color,
        fontVariantNumeric: "tabular-nums",
        textShadow: `0 0 ${fontSize * 0.2}px ${color}66`,
        transform: `scale(${scale})`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {prefix}
      {format ? format(value) : value.toLocaleString("en-US")}
      {suffix ? (
        <span
          style={{
            display: "inline-block",
            transform: `scale(${landed ? suffixPop : 0})`,
            transformOrigin: "left center",
          }}
        >
          {suffix.replace(/^ /, "\u00a0")}
        </span>
      ) : null}
    </div>
  );
};
