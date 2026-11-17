import React from "react";
import { AbsoluteFill, useCurrentFrame, random, interpolate } from "remotion";
import { colors } from "../theme";

/**
 * Applies an RGB split and horizontal slice tearing to its children.
 * `amount` is 0..1; at 0 children render untouched.
 */
export const Glitch: React.FC<{
  amount: number;
  seed?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ amount, seed = "g", style, children }) => {
  const f = useCurrentFrame();
  if (amount <= 0.001) {
    return <div style={{ position: "relative", ...style }}>{children}</div>;
  }
  const r = (k: string) => random(`${seed}-${k}-${f}`);
  const split = amount * (6 + r("s") * 14);
  const jx = (r("x") - 0.5) * 30 * amount;
  const slices = [0, 1, 2].map((i) => {
    const top = r(`t${i}`) * 85;
    const h = 4 + r(`h${i}`) * 14;
    const dx = (r(`d${i}`) - 0.5) * 220 * amount;
    return { top, h, dx };
  });
  return (
    <div style={{ position: "relative", ...style }}>
      <div
        style={{
          transform: `translateX(${jx}px)`,
          filter: `drop-shadow(${split}px 0 0 rgba(255,40,70,0.75)) drop-shadow(${-split}px 0 0 rgba(0,240,255,0.65))`,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
      {slices.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `inset(${s.top}% 0 ${Math.max(0, 100 - s.top - s.h)}% 0)`,
            transform: `translateX(${s.dx}px)`,
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
};

/** Random coloured tear bars across the whole frame. */
export const GlitchBars: React.FC<{ amount: number; seed?: string }> = ({
  amount,
  seed = "bars",
}) => {
  const f = useCurrentFrame();
  if (amount <= 0.001) return null;
  const palette = [colors.green, colors.red, "#00F0FF", colors.text];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(7).fill(0).map((_, i) => {
        const r = (k: string) => random(`${seed}-${k}-${i}-${f}`);
        if (r("on") > amount) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${r("y") * 100}%`,
              left: `${r("x") * 60 - 10}%`,
              width: `${20 + r("w") * 70}%`,
              height: 2 + r("h") * 16,
              background: palette[Math.floor(r("c") * palette.length)],
              opacity: 0.25 + r("o") * 0.5,
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * Scene-level glitch transition.
 *  - "in":    children hidden before `at`, glitch in over `durationInFrames`
 *  - "out":   children glitch out and are gone after `at + durationInFrames`
 *  - "pulse": children always visible, glitch burst at `at`
 */
export const GlitchTransition: React.FC<{
  at: number;
  durationInFrames?: number;
  mode?: "in" | "out" | "pulse";
  seed?: string;
  children: React.ReactNode;
}> = ({ at, durationInFrames = 12, mode = "in", seed = "gt", children }) => {
  const f = useCurrentFrame();
  const t = (f - at) / durationInFrames; // 0..1 during the transition
  const active = t >= 0 && t < 1;

  if (mode === "in" && t < 0) return null;
  if (mode === "out" && t >= 1) return null;

  let amount = 0;
  let opacity = 1;
  if (active) {
    const flick = random(`${seed}-fl-${f}`);
    if (mode === "in") {
      amount = 1 - t;
      opacity = flick < (1 - t) * 0.45 ? 0.15 : 1;
    } else if (mode === "out") {
      amount = 0.35 + t * 0.65;
      opacity = flick < t * 0.6 ? 0.1 : interpolate(t, [0.7, 1], [1, 0.4], { extrapolateLeft: "clamp" });
    } else {
      amount = Math.sin(t * Math.PI);
    }
  }

  return (
    <AbsoluteFill>
      <Glitch amount={amount} seed={seed} style={{ position: "absolute", inset: 0, opacity }}>
        {children}
      </Glitch>
      <GlitchBars amount={amount} seed={seed} />
    </AbsoluteFill>
  );
};

/** Full-frame colour flash that decays quickly. */
export const Flash: React.FC<{
  at: number;
  color?: string;
  durationInFrames?: number;
  peak?: number;
}> = ({ at, color = colors.red, durationInFrames = 14, peak = 0.55 }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < 0 || t > durationInFrames) return null;
  const opacity = peak * Math.exp(-t / (durationInFrames / 4));
  return <AbsoluteFill style={{ background: color, opacity, mixBlendMode: "screen" }} />;
};
