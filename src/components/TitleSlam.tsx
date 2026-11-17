import React from "react";
import { useCurrentFrame, useVideoConfig, random, interpolate } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Glitch } from "./GlitchTransition";
import { Sfx, type SfxName } from "./Sfx";

/** Big text that slams in with a shake and a glitch. Position it with `style`. */
export const TitleSlam: React.FC<{
  text: string;
  color?: string;
  fontSize?: number;
  /** frame (local) at which the slam starts */
  at?: number;
  shake?: boolean;
  glitch?: boolean;
  /** extra glitch 0..1 driven from outside, e.g. for a later hit */
  extraGlitch?: number;
  underline?: boolean;
  /** impact sound; false for silent */
  sound?: SfxName | false;
  style?: React.CSSProperties;
}> = ({
  text,
  color = colors.text,
  fontSize = 260,
  at = 0,
  shake = true,
  glitch = true,
  extraGlitch = 0,
  underline = false,
  sound = "slam",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - at;
  if (f < 0) return null;

  const s = sp(frame, fps, at, springs.slam);
  const scale = interpolate(s, [0, 1], [3.2, 1]);
  const opacity = interpolate(f, [0, 3], [0, 1], { extrapolateRight: "clamp" });

  const amp = shake ? 30 * Math.exp(-f / 5) : 0;
  const dx = (random(`sx-${text}-${f}`) - 0.5) * 2 * amp;
  const dy = (random(`sy-${text}-${f}`) - 0.5) * 2 * amp;

  const burst = random(`burst-${text}-${Math.floor(f / 3)}`) > 0.94 ? 0.3 : 0;
  const amount = Math.min(1, (glitch ? Math.exp(-f / 5) + burst : 0) + extraGlitch);

  const line = sp(frame, fps, at + 4, springs.smooth, 18);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...style,
      }}
    >
      {sound ? <Sfx name={sound} at={at} /> : null}
      <div style={{ transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity }}>
        <Glitch amount={amount} seed={`ts-${text}`}>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize,
              lineHeight: 0.95,
              color,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              textShadow: `0 0 ${fontSize * 0.18}px ${color}55, 0 6px 0 rgba(0,0,0,0.6)`,
            }}
          >
            {text}
          </div>
        </Glitch>
      </div>
      {underline ? (
        <div
          style={{
            width: `${line * 46}%`,
            height: 6,
            marginTop: fontSize * 0.05,
            background: color,
            boxShadow: `0 0 24px ${color}`,
            opacity: 0.9,
          }}
        />
      ) : null}
    </div>
  );
};
