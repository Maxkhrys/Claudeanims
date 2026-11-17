import React from "react";
import { AbsoluteFill, useCurrentFrame, random } from "remotion";
import { colors } from "../theme";

/** Slow scale + pan so the frame never sits fully still. */
export const CameraDrift: React.FC<{ amount?: number; children: React.ReactNode }> = ({
  amount = 1,
  children,
}) => {
  const f = useCurrentFrame();
  const scale = 1.035 + 0.012 * amount * Math.sin(f / 170);
  const x = Math.sin(f / 131) * 14 * amount;
  const y = Math.cos(f / 97) * 9 * amount;
  const rot = Math.sin(f / 211) * 0.15 * amount;
  return (
    <AbsoluteFill
      style={{ transform: `scale(${scale}) translate(${x}px, ${y}px) rotate(${rot}deg)` }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2);
  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: "screen", pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Scanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.13 }) => {
  const f = useCurrentFrame();
  const bandY = ((f * 5) % 1500) - 300;
  const flicker = 0.9 + 0.1 * random(`scan-${f}`);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          opacity: opacity * flicker,
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.9) 3px, rgba(0,0,0,0.9) 4px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: bandY,
          height: 260,
          background:
            "linear-gradient(to bottom, rgba(57,255,136,0), rgba(57,255,136,0.035), rgba(57,255,136,0))",
        }}
      />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.85 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/**
 * Wrap every clip's scenes in this. Children get the camera drift;
 * grain, scanlines and vignette sit on top.
 */
export const Background: React.FC<{
  children?: React.ReactNode;
  drift?: number;
  grain?: number;
  scanlines?: number;
  vignette?: number;
}> = ({ children, drift = 1, grain = 0.09, scanlines = 0.13, vignette = 0.85 }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(57,255,136,0.045) 0%, rgba(57,255,136,0) 60%)",
        }}
      />
      <CameraDrift amount={drift}>{children}</CameraDrift>
      <Grain opacity={grain} />
      <Scanlines opacity={scanlines} />
      <Vignette strength={vignette} />
    </AbsoluteFill>
  );
};
