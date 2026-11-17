import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig, type SpringConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp, type Word } from "../lib/timing";
import { Background } from "./Background";
import { Captions } from "./Captions";
import { Glitch, GlitchTransition } from "./GlitchTransition";
import { BlobCharacter } from "./BlobCharacter";
import { AvatarBadge } from "./Icons";
import { TitleSlam } from "./TitleSlam";

/** Audio + background + captions. Every clip from 3 onward is wrapped in this. */
export const ClipShell: React.FC<{
  audio: string;
  words: Word[];
  showCaptions: boolean;
  children: React.ReactNode;
}> = ({ audio, words, showCaptions, children }) => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    <Audio src={staticFile(audio)} />
    <Background>{children}</Background>
    <Captions words={words} enabled={showCaptions} />
  </AbsoluteFill>
);

/**
 * Shows its children between two absolute frames. Unlike <Sequence> it does
 * not shift time, so everything inside keeps using composition frames
 * (i.e. `cue.at(...)` values directly).
 */
export const Scene: React.FC<{
  from: number;
  to: number;
  exit?: "fade" | "glitch" | "cut";
  children: React.ReactNode;
}> = ({ from, to, exit = "fade", children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < from) return null;
  if (exit === "cut") return frame < to ? <AbsoluteFill>{children}</AbsoluteFill> : null;
  if (exit === "glitch") {
    return (
      <GlitchTransition at={to - 8} durationInFrames={8} mode="out" seed={`scene-${from}`}>
        {children}
      </GlitchTransition>
    );
  }
  if (frame >= to + 6) return null;
  const e = sp(frame, fps, to - 4, springs.snappy);
  return (
    <AbsoluteFill style={{ opacity: 1 - e, transform: `scale(${1 + e * 0.08})` }}>{children}</AbsoluteFill>
  );
};

/** Springs its children in at frame `at`. Absolutely positioned via `style`. */
export const Pop: React.FC<{
  at: number;
  from?: "scale" | "left" | "right" | "up" | "slam";
  config?: Partial<SpringConfig>;
  origin?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, from = "scale", config, origin = "center center", style, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = sp(frame, fps, at, config ?? (from === "scale" ? springs.pop : from === "slam" ? springs.slam : springs.snappy));
  const transform =
    from === "scale"
      ? `scale(${s})`
      : from === "slam"
        ? `scale(${3 - 2 * s})`
        : from === "left"
          ? `translateX(${(1 - s) * -70}px)`
          : from === "right"
            ? `translateX(${(1 - s) * 70}px)`
            : `translateY(${(1 - s) * 60}px)`;
  return (
    <div
      style={{
        position: "absolute",
        ...style,
        transform,
        transformOrigin: origin,
        opacity: from === "scale" ? 1 : Math.min(1, s * 2.5),
      }}
    >
      {children}
    </div>
  );
};

/** Glitches its children away at frame `at`. */
export const Vanish: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t >= 9) return null;
  if (t < 0) return <>{children}</>;
  return (
    <Glitch amount={0.5 + t / 18} seed={`vanish-${at}`} style={{ opacity: t % 3 === 2 ? 0.2 : 1 - t / 12 }}>
      {children}
    </Glitch>
  );
};

/** Small bordered label that pops in. */
export const Chip: React.FC<{
  at: number;
  text: string;
  color?: string;
  filled?: boolean;
  fontSize?: number;
  origin?: string;
  style?: React.CSSProperties;
}> = ({ at, text, color = colors.amber, filled = false, fontSize = 32, origin = "left center", style }) => (
  <Pop at={at} origin={origin} style={style}>
    <div
      style={{
        display: "inline-block",
        padding: `${fontSize * 0.32}px ${fontSize * 0.65}px`,
        border: `2px solid ${color}`,
        borderRadius: 6,
        background: filled ? color : "rgba(7,9,11,0.85)",
        color: filled ? colors.bg : color,
        fontFamily: fonts.mono,
        fontSize,
        fontWeight: 700,
        letterSpacing: "0.08em",
        whiteSpace: "nowrap",
        boxShadow: `0 0 30px ${color}33`,
      }}
    >
      {text}
    </div>
  </Pop>
);

/** Rotated TitleSlam, like a rubber stamp. */
export const Stamp: React.FC<{
  at: number;
  text: string;
  color?: string;
  fontSize?: number;
  rotate?: number;
  top?: number;
}> = ({ at, text, color = colors.red, fontSize = 300, rotate = -9, top = 300 }) => (
  <div style={{ position: "absolute", inset: 0, transform: `rotate(${rotate}deg)`, pointerEvents: "none" }}>
    <TitleSlam text={text} color={color} fontSize={fontSize} at={at} style={{ top }} />
  </div>
);

/** Mono text helper. */
export const mono = (size: number, color: string = colors.text): React.CSSProperties => ({
  fontFamily: fonts.mono,
  fontSize: size,
  color,
});

/** Dark panel. */
export const Card: React.FC<{
  accent?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ accent = colors.line, style, children }) => (
  <div
    style={{
      background: colors.panel,
      border: `2px solid ${accent}`,
      borderRadius: 14,
      boxShadow: `0 40px 100px rgba(0,0,0,0.65), 0 0 70px ${accent === colors.line ? "rgba(57,255,136,0.05)" : accent + "22"}`,
      padding: "28px 36px",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Target reticle that locks on. `at` is the frame it appears. */
export const Crosshair: React.FC<{ at: number; size?: number; color?: string; style?: React.CSSProperties }> = ({
  at,
  size = 220,
  color = colors.red,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = sp(frame, fps, at, springs.snappy);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        position: "absolute",
        overflow: "visible",
        transform: `scale(${2.2 - 1.2 * s}) rotate(${(1 - s) * 90}deg)`,
        opacity: Math.min(1, s * 2),
        filter: `drop-shadow(0 0 10px ${color})`,
        ...style,
      }}
    >
      <circle cx={50} cy={50} r={36} fill="none" stroke={color} strokeWidth={4} />
      <circle cx={50} cy={50} r={3.5} fill={color} />
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d="M 50 2 V 24" stroke={color} strokeWidth={4} strokeLinecap="round" transform={`rotate(${a} 50 50)`} />
      ))}
    </svg>
  );
};

// ─── Cast presets ────────────────────────────────────────────────────
type BlobProps = Partial<React.ComponentProps<typeof BlobCharacter>>;

export const Chemist: React.FC<BlobProps> = (p) => (
  <BlobCharacter color={colors.chemist} expression="scared" seed={2} {...p} />
);
export const Dpr: React.FC<BlobProps> = (p) => (
  <BlobCharacter color={colors.dpr} accessory="hoodie" seed={1} lightColor={colors.green} lightAmount={0.8} {...p} />
);
export const RedWhite: React.FC<BlobProps> = (p) => (
  <BlobCharacter color={colors.redandwhite} accessory="bikerVest" bulk={1.35} seed={3} {...p} />
);

export const NameTag: React.FC<{ text: string; color?: string; fontSize?: number }> = ({
  text,
  color = colors.text,
  fontSize = 26,
}) => (
  <div style={{ textAlign: "center", marginTop: 12 }}>
    <span
      style={{
        display: "inline-block",
        padding: "6px 16px",
        borderRadius: 6,
        background: color,
        color: colors.bg,
        fontFamily: fonts.mono,
        fontSize,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  </div>
);

/** Chat header presets for the three message writers. */
export const SENDERS = {
  chemist: {
    name: "FriendlyChemist",
    color: colors.chemist,
    avatar: <AvatarBadge icon="flask" size={104} color={colors.chemist} />,
  },
  dpr: {
    name: "DreadPirateRoberts",
    color: colors.green,
    avatar: <AvatarBadge icon="skull" size={104} color={colors.green} />,
  },
  rw: {
    name: "redandwhite",
    color: colors.red,
    avatar: <AvatarBadge icon="helmet" size={104} color={colors.redandwhite} />,
  },
} as const;

/**
 * DPR behind his laptop, lit by the screen. Centred on `x`.
 * `light` 0..1 is the screen glow, `reveal` 0..1 how visible he is.
 */
export const DprDesk: React.FC<{
  x?: number;
  light?: number;
  reveal?: number;
  glow?: string;
  expression?: "calm" | "angry" | "scared";
  look?: { x: number; y: number };
}> = ({ x = 1300, light = 1, reveal = 1, glow = colors.green, expression = "calm", look = { x: 0, y: 0.9 } }) => {
  const frame = useCurrentFrame();
  const l = light * (0.92 + 0.08 * Math.sin(frame / 2.3) * Math.sin(frame / 7));
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: x - 700,
          top: 60,
          width: 1400,
          height: 1000,
          background: `radial-gradient(ellipse at 50% 62%, ${glow} 0%, rgba(0,0,0,0) 62%)`,
          opacity: 0.2 * l,
        }}
      />
      <div style={{ position: "absolute", left: x - 238, top: 270, opacity: 0.06 + 0.94 * reveal }}>
        <BlobCharacter
          color={colors.dpr}
          accessory="hoodie"
          expression={expression}
          size={550}
          seed={1}
          look={look}
          lightColor={glow}
          lightAmount={l * (0.35 + 0.65 * reveal)}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: -200,
          right: -200,
          top: 800,
          bottom: -200,
          background: "linear-gradient(to bottom, #0D1216 0%, #06080A 40%)",
          borderTop: `3px solid rgba(255,255,255,${0.04 + 0.06 * l})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 520,
          top: 790,
          width: 1040,
          height: 150,
          background: `radial-gradient(ellipse at 50% 0%, ${glow} 0%, rgba(0,0,0,0) 70%)`,
          opacity: 0.35 * l,
        }}
      />
      <div style={{ position: "absolute", left: x - 250, top: 572 }}>
        <div
          style={{
            position: "absolute",
            left: -26,
            top: -30,
            width: 552,
            height: 120,
            background: `radial-gradient(ellipse at 50% 100%, ${glow} 0%, rgba(0,0,0,0) 70%)`,
            opacity: 0.75 * l,
            filter: "blur(10px)",
          }}
        />
        <div
          style={{
            width: 500,
            height: 290,
            borderRadius: "22px 22px 6px 6px",
            background: "linear-gradient(to bottom, #1A2128, #0C1014)",
            border: "2px solid #2A343D",
            boxShadow: "0 30px 60px rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              background: glow,
              opacity: 0.15 + 0.75 * l,
              boxShadow: `0 0 ${40 * l}px ${glow}`,
            }}
          />
        </div>
        <div style={{ width: 560, height: 16, marginLeft: -30, borderRadius: "4px 4px 12px 12px", background: "#1C232A" }} />
      </div>
    </AbsoluteFill>
  );
};

/** Small parcel. */
export const Parcel: React.FC<{ size?: number; color?: string }> = ({ size = 60, color = colors.green }) => (
  <div
    style={{
      width: size,
      height: size * 0.8,
      borderRadius: size * 0.1,
      background: colors.panelLight,
      border: `${Math.max(2, size * 0.05)}px solid ${color}`,
      boxShadow: `0 0 ${size * 0.4}px ${color}44`,
      position: "relative",
    }}
  >
    <div style={{ position: "absolute", left: "42%", top: 0, bottom: 0, width: "16%", background: color, opacity: 0.55 }} />
  </div>
);
