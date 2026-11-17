import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";
import { Sfx } from "./Sfx";

export type TerminalLine = {
  text: string;
  /** frame (local) when typing starts */
  at: number;
  /** frames the typing takes; default is ~22 chars/sec */
  durationInFrames?: number;
  color?: string;
  prompt?: string;
  /** font size multiplier for this line */
  size?: number;
};

/** Terminal text that types itself, with a blinking block cursor. */
export const Terminal: React.FC<{
  lines: TerminalLine[];
  fontSize?: number;
  color?: string;
  cursorColor?: string;
  align?: "left" | "center";
  showCursor?: boolean;
  /** key clicks while typing */
  sound?: boolean;
  style?: React.CSSProperties;
}> = ({
  lines,
  fontSize = 64,
  color = colors.green,
  cursorColor,
  align = "left",
  showCursor = true,
  sound = true,
  style,
}) => {
  const f = useCurrentFrame();

  // the active line is the last one that has started (or the first, while waiting)
  let active = 0;
  lines.forEach((l, i) => {
    if (f >= l.at) active = i;
  });

  return (
    <div
      style={{
        fontFamily: fonts.mono,
        fontWeight: 700,
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: fontSize * 0.35,
        ...style,
      }}
    >
      {sound
        ? lines.map((l, i) => (
            <Sfx
              key={`sfx-${i}`}
              name="type"
              at={l.at}
              durationInFrames={l.durationInFrames ?? Math.max(1, Math.round((l.text.length / 22) * 30))}
              loop
            />
          ))
        : null}
      {lines.map((l, i) => {
        if (i > active) return null;
        const dur = l.durationInFrames ?? Math.max(1, Math.round((l.text.length / 22) * 30));
        const t = Math.min(1, Math.max(0, (f - l.at) / dur));
        const chars = Math.floor(t * l.text.length);
        const typing = f >= l.at && chars < l.text.length;
        const size = fontSize * (l.size ?? 1);
        const c = l.color ?? color;
        const blinkOn = typing || Math.floor(f / 8) % 2 === 0;
        return (
          <div
            key={i}
            style={{
              fontSize: size,
              lineHeight: 1.1,
              color: c,
              whiteSpace: "pre",
              textShadow: `0 0 ${size * 0.25}px ${c}55`,
              display: "flex",
              alignItems: "center",
            }}
          >
            {l.prompt ? <span style={{ opacity: 0.55 }}>{l.prompt}</span> : null}
            <span>{l.text.slice(0, chars)}</span>
            {showCursor && i === active ? (
              <span
                style={{
                  display: "inline-block",
                  width: size * 0.56,
                  height: size * 1.02,
                  marginLeft: size * 0.08,
                  background: cursorColor ?? c,
                  boxShadow: `0 0 ${size * 0.3}px ${cursorColor ?? c}`,
                  opacity: blinkOn ? 1 : 0,
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
