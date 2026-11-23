import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { z } from "zod";
import { Character, LeekImg, ObjectArt } from "./art";

loadFont({ family: "Anton", url: staticFile("fonts/Anton.woff2") });
loadFont({ family: "JetBrains Mono", weight: "700", url: staticFile("fonts/JetBrainsMono-700.woff2") });

/**
 * THE ONION ARCHIVE thumbnail system.
 * One look for every video: near-black background, ONE accent colour,
 * Anton headline (white line + accent block line), a white-outlined
 * "sticker" character with a strong emotion, one clear object circled
 * in the accent colour, and the onion logo always in the same corner.
 * See /mnt/project-files/branding/thumbnail-style-guide.md
 */

export const BRAND = {
  bg: "#0B0C10",
  accent: "#FFD60A", // channel yellow: use it unless a story really needs another
  ink: "#0B0C10",
  white: "#FFFFFF",
} as const;

export const onionThumbSchema = z.object({
  format: z.enum(["yt", "cover"]),
  /** White line. Keep the whole thumbnail to 3-4 words. */
  top: z.string(),
  /** Line in the accent block: the word that makes you click. */
  hit: z.string(),
  accent: z.string().default(BRAND.accent),
  character: z.enum(["hacker", "anon", "judge", "leek", "none"]),
  emotion: z.enum(["shock", "smirk", "fear"]).default("shock"),
  object: z.enum(["tvstick", "evidence", "coin", "mystery", "none"]),
  objectLabel: z.string().optional(),
});
export type OnionThumbProps = z.infer<typeof onionThumbSchema>;

type Layout = {
  W: number;
  H: number;
  logo: { x: number; y: number; s: number };
  text: { x: number; y: number; maxW: number; maxSize: number };
  char: { x: number; y: number; s: number };
  obj: { x: number; y: number; s: number };
  glow: { x: number; y: number; r: number };
};

/** 1280x720. Bottom-right stays free for YouTube's timestamp. */
const YT: Layout = {
  W: 1280,
  H: 720,
  logo: { x: 1172, y: 24, s: 84 },
  text: { x: 52, y: 70, maxW: 600, maxSize: 170 },
  char: { x: 960, y: 330, s: 1.0 },
  obj: { x: 700, y: 560, s: 0.62 },
  glow: { x: 940, y: 360, r: 460 },
};

/**
 * 1080x1920. Everything that matters sits inside x 60-918, y 250-1536:
 * inside TikTok's 3:4 profile-grid crop (y 240-1680) and clear of the
 * top 10%, the right-side buttons (15%) and the bottom caption bar (20%).
 */
const COVER: Layout = {
  W: 1080,
  H: 1920,
  logo: { x: 66, y: 262, s: 124 },
  text: { x: 66, y: 420, maxW: 840, maxSize: 230 },
  char: { x: 460, y: 1070, s: 1.5 },
  obj: { x: 650, y: 1360, s: 0.9 },
  glow: { x: 480, y: 1120, r: 640 },
};

/** Rough Anton advance widths (em) so the headline always fits. */
const estWidth = (s: string) =>
  [...s].reduce((w, c) => w + (c === " " ? 0.22 : /[0-9$]/.test(c) ? 0.56 : /[MW]/.test(c) ? 0.66 : /[A-Z]/.test(c) ? 0.54 : 0.3), 0);

const fit = (s: string, maxW: number, maxSize: number) => Math.min(maxSize, Math.floor(maxW / Math.max(estWidth(s), 0.01)));

const Background: React.FC<{ L: Layout; accent: string }> = ({ L, accent }) => (
  <svg width={L.W} height={L.H} viewBox={`0 0 ${L.W} ${L.H}`} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="glow" cx={L.glow.x} cy={L.glow.y} r={L.glow.r} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={accent} stopOpacity={0.34} />
        <stop offset="0.55" stopColor={accent} stopOpacity={0.08} />
        <stop offset="1" stopColor={accent} stopOpacity={0} />
      </radialGradient>
      <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="7" cy="7" r="2" fill="#fff" />
      </pattern>
      <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.5" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={0.75} />
      </radialGradient>
      <mask id="dotmask">
        <rect width={L.W} height={L.H} fill="url(#glow)" />
      </mask>
    </defs>
    <rect width={L.W} height={L.H} fill={BRAND.bg} />
    <rect width={L.W} height={L.H} fill="url(#glow)" />
    <g opacity={0.05}>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        const R = 3000;
        return (
          <path
            key={i}
            d={`M${L.glow.x},${L.glow.y} L${L.glow.x + Math.cos(a) * R},${L.glow.y + Math.sin(a) * R} L${L.glow.x + Math.cos(a + 0.12) * R},${L.glow.y + Math.sin(a + 0.12) * R}Z`}
            fill="#fff"
          />
        );
      })}
    </g>
    <rect width={L.W} height={L.H} fill="url(#dots)" opacity={0.18} mask="url(#dotmask)" />
  </svg>
);

const Overlay: React.FC<{ L: Layout }> = ({ L }) => (
  <svg width={L.W} height={L.H} viewBox={`0 0 ${L.W} ${L.H}`} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="vig2" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.55" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#000" stopOpacity={0.7} />
      </radialGradient>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .07 0" />
      </filter>
    </defs>
    <rect width={L.W} height={L.H} fill="url(#vig2)" />
    <rect width={L.W} height={L.H} filter="url(#grain)" />
  </svg>
);

/** Characters and objects get a thick white sticker outline so they pop at feed size. */
const StickerDefs: React.FC = () => (
  <defs>
    <filter id="sticker" x="-20%" y="-20%" width="140%" height="140%">
      <feMorphology in="SourceAlpha" operator="dilate" radius="7" result="grow" />
      <feFlood floodColor="#fff" />
      <feComposite in2="grow" operator="in" result="outline" />
      <feDropShadow in="outline" dx="0" dy="14" stdDeviation="14" floodColor="#000" floodOpacity="0.85" result="shadowed" />
      <feMerge>
        <feMergeNode in="shadowed" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
);

export const OnionThumb: React.FC<OnionThumbProps> = (p) => {
  const L = p.format === "yt" ? YT : COVER;
  const accent = p.accent ?? BRAND.accent;
  const topSize = fit(p.top, L.text.maxW, L.text.maxSize);
  const hitSize = fit(p.hit, L.text.maxW - 40, L.text.maxSize * 0.92);
  const ringRx = 250 * L.obj.s;
  const ringRy = 190 * L.obj.s;

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      <Background L={L} accent={accent} />

      {/* subject: character + one object */}
      <svg width={L.W} height={L.H} viewBox={`0 0 ${L.W} ${L.H}`} style={{ position: "absolute", inset: 0 }}>
        <StickerDefs />
        {p.character !== "leek" && p.character !== "none" && (
          <g transform={`translate(${L.char.x},${L.char.y}) scale(${L.char.s})`} filter="url(#sticker)">
            <Character id={p.character} e={p.emotion ?? "shock"} accent={accent} />
          </g>
        )}
      </svg>
      {p.character === "leek" && (
        <LeekImg x={L.char.x} y={L.char.y - 250 * L.char.s} h={600 * L.char.s} />
      )}
      {p.object !== "none" && (
        <svg width={L.W} height={L.H} viewBox={`0 0 ${L.W} ${L.H}`} style={{ position: "absolute", inset: 0 }}>
          <StickerDefs />
          <g transform={`translate(${L.obj.x},${L.obj.y}) scale(${L.obj.s})`} filter="url(#sticker)">
            <ObjectArt id={p.object} label={p.objectLabel} />
          </g>
          <ellipse
            cx={L.obj.x}
            cy={L.obj.y}
            rx={ringRx}
            ry={ringRy}
            fill="none"
            stroke={accent}
            strokeWidth={p.format === "yt" ? 10 : 14}
            transform={`rotate(-8 ${L.obj.x} ${L.obj.y})`}
            style={{ filter: "drop-shadow(0 6px 8px rgba(0,0,0,.8))" }}
          />
        </svg>
      )}

      {/* headline */}
      <div style={{ position: "absolute", left: L.text.x, top: L.text.y, width: L.text.maxW, fontFamily: "Anton", lineHeight: 1, whiteSpace: "nowrap" }}>
        <div
          style={{
            fontSize: topSize,
            color: BRAND.white,
            textTransform: "uppercase",
            letterSpacing: 1,
            textShadow: "0 8px 0 #000, 0 10px 30px rgba(0,0,0,.9)",
          }}
        >
          {p.top}
        </div>
        <div style={{ marginTop: topSize * 0.12 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: hitSize,
              color: BRAND.ink,
              background: accent,
              padding: `${hitSize * 0.04}px ${hitSize * 0.12}px ${hitSize * 0.02}px`,
              transform: "rotate(-2.5deg)",
              transformOrigin: "left center",
              textTransform: "uppercase",
              boxShadow: "0 10px 0 #000",
            }}
          >
            {p.hit}
          </span>
        </div>
      </div>

      {/* logo: same corner, same size, every time */}
      <Img
        src={staticFile("thumbnails/onion-logo.png")}
        style={{
          position: "absolute",
          left: L.logo.x,
          top: L.logo.y,
          width: L.logo.s,
          height: L.logo.s,
          borderRadius: "50%",
          boxShadow: "0 0 0 4px #fff, 0 8px 20px rgba(0,0,0,.8)",
        }}
      />
      <Overlay L={L} />
    </AbsoluteFill>
  );
};
