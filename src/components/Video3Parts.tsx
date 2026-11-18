import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter } from "./BlobCharacter";
import { Sfx } from "./Sfx";

type BlobProps = Partial<React.ComponentProps<typeof BlobCharacter>>;

/** Arion Kurtaj / "White": pale blob. Video 3's main character. */
export const White: React.FC<BlobProps> = (p) => <BlobCharacter color="#DDE4EC" seed={13} {...p} />;

/** Brand colours for the companies in video 3. These are plain wordmarks, not the real logos. */
export const BRANDS: Record<string, string> = {
  NVIDIA: "#76B900",
  SAMSUNG: "#3D7BE0",
  MICROSOFT: "#6FA8FF",
  OKTA: "#5B8DEF",
  UBER: "#E6E6E6",
  REVOLUT: "#E6E6E6",
  ROCKSTAR: "#FFB547",
  BT: "#9B6DFF",
  EE: "#2BC4B6",
};

/** Company wordmark: coloured block plus the name. */
export const BrandTag: React.FC<{ name: string; color?: string; size?: number; style?: React.CSSProperties }> = ({
  name,
  color,
  size = 90,
  style,
}) => {
  const c = color ?? BRANDS[name.toUpperCase()] ?? colors.text;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.22, ...style }}>
      <div style={{ width: size * 0.72, height: size * 0.72, borderRadius: size * 0.14, background: c, boxShadow: `0 0 ${size * 0.4}px ${c}66` }} />
      <span style={{ fontFamily: fonts.display, fontSize: size, lineHeight: 0.9, letterSpacing: "0.04em", color: c, whiteSpace: "nowrap", textShadow: `0 0 ${size * 0.3}px ${c}44` }}>
        {name}
      </span>
    </div>
  );
};

/** Where the TV screen sits inside <HotelRoom>, in 1920x1080 coordinates. */
export const HOTEL_TV = { left: 1010, top: 170, width: 700, height: 394 } as const;

/**
 * The budget hotel room (clips 1, 15, 17, 18, 26). Fills the frame.
 * `screen` is drawn on the TV; `tvOn` 0..1 lights the room; `stick` shows the streaming stick.
 */
export const HotelRoom: React.FC<{
  tvOn?: number;
  stick?: boolean;
  screen?: React.ReactNode;
  glow?: string;
  children?: React.ReactNode;
}> = ({ tvOn = 0, stick = false, screen, glow = colors.green, children }) => {
  const frame = useCurrentFrame();
  const flicker = tvOn * (0.9 + 0.1 * random(`tv-${Math.floor(frame / 3)}`));
  return (
    <AbsoluteFill>
      {/* wall and floor */}
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, #131A23 0%, #1A2430 64%, #0D1116 64%, #07090B 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 688, height: 6, background: "#1B242E" }} />
      {/* window with curtains */}
      <div style={{ position: "absolute", left: 120, top: 120, width: 360, height: 400, background: "linear-gradient(to bottom, #0B1220, #131C2E)", border: "10px solid #1C2530" }}>
        <div style={{ position: "absolute", left: 70, top: 60, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: 0.6 }} />
        <div style={{ position: "absolute", left: 250, top: 130, width: 3, height: 3, borderRadius: 2, background: "#fff", opacity: 0.4 }} />
        <div style={{ position: "absolute", left: -10, top: -10, width: 110, height: 420, background: "linear-gradient(to right, #232C38, #1A222C)" }} />
        <div style={{ position: "absolute", right: -10, top: -10, width: 110, height: 420, background: "linear-gradient(to left, #232C38, #1A222C)" }} />
      </div>
      {/* TV glow on the room */}
      <div style={{ position: "absolute", left: HOTEL_TV.left - 420, top: HOTEL_TV.top - 220, width: HOTEL_TV.width + 840, height: HOTEL_TV.height + 700, background: `radial-gradient(ellipse at 50% 40%, ${glow}, rgba(0,0,0,0) 62%)`, opacity: 0.22 * flicker }} />
      {/* TV */}
      <div style={{ position: "absolute", left: HOTEL_TV.left - 16, top: HOTEL_TV.top - 16, width: HOTEL_TV.width + 32, height: HOTEL_TV.height + 32, borderRadius: 14, background: "#07090B", border: "3px solid #232C36", boxShadow: `0 0 ${60 * flicker}px ${glow}55, 0 20px 50px rgba(0,0,0,0.7)` }} />
      <div style={{ position: "absolute", left: HOTEL_TV.left, top: HOTEL_TV.top, width: HOTEL_TV.width, height: HOTEL_TV.height, overflow: "hidden", borderRadius: 4, background: tvOn > 0.02 ? "#0A1210" : "#050607" }}>
        <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, tvOn * 1.4) }}>{screen}</div>
      </div>
      {/* streaming stick plugged into the side of the TV */}
      {stick ? (
        <div style={{ position: "absolute", left: HOTEL_TV.left + HOTEL_TV.width + 16, top: HOTEL_TV.top + 250, width: 78, height: 26, borderRadius: 6, background: "#1A2027", border: "2px solid #33404C" }}>
          <div style={{ position: "absolute", right: 10, top: 8, width: 8, height: 8, borderRadius: 4, background: colors.amber, boxShadow: `0 0 12px ${colors.amber}`, opacity: 0.5 + 0.5 * Math.sin(frame / 5) }} />
        </div>
      ) : null}
      {/* warm pool of light from the bedside lamp */}
      <div style={{ position: "absolute", left: 764 - 420, top: 500 - 330, width: 840, height: 760, background: "radial-gradient(ellipse at 50% 42%, rgba(255,181,71,0.5), rgba(0,0,0,0) 62%)", opacity: 0.3 }} />
      {/* bedside table, lamp, kettle */}
      <div style={{ position: "absolute", left: 620, top: 600, width: 210, height: 190, background: "#171E26", border: "3px solid #232C36", borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 660, top: 530, width: 62, height: 70, borderRadius: "10px 10px 14px 14px", background: "#2A333D" }}>
        <div style={{ position: "absolute", right: -22, top: 14, width: 26, height: 34, border: "6px solid #2A333D", borderLeft: "none", borderRadius: "0 14px 14px 0" }} />
      </div>
      <div style={{ position: "absolute", left: 760, top: 500, width: 8, height: 100, background: "#2A333D" }} />
      <div style={{ position: "absolute", left: 730, top: 460, width: 68, height: 50, borderRadius: "12px 12px 4px 4px", background: "#C99A52", boxShadow: "0 0 40px rgba(255,181,71,0.55)" }} />
      {/* bed */}
      <div style={{ position: "absolute", left: 60, top: 610, width: 540, height: 90, borderRadius: "14px 14px 0 0", background: "#1E2630" }} />
      <div style={{ position: "absolute", left: 40, top: 690, width: 620, height: 170, borderRadius: 14, background: "linear-gradient(to bottom, #2B3643, #1B232C)", boxShadow: "0 24px 40px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 80, top: 650, width: 200, height: 70, borderRadius: 26, background: "#C9D1DA", opacity: 0.85 }} />
      <div style={{ position: "absolute", left: 40, top: 760, width: 620, height: 100, borderRadius: "0 0 14px 14px", background: "linear-gradient(to bottom, #3A4757, #252E39)" }} />
      {children}
    </AbsoluteFill>
  );
};

/**
 * A phone being flooded with login prompts ("MFA fatigue").
 * Prompts arrive every `interval` frames from `at`; at `approveAt` one is accepted.
 */
export const PhoneBuzz: React.FC<{
  at: number;
  prompts?: number;
  interval?: number;
  approveAt?: number;
  time?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ at, prompts = 6, interval = 9, approveAt, time = "", size = 300, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const enter = sp(frame, fps, at, springs.pop);
  const approved = approveAt !== undefined && frame >= approveAt;
  const shown = approved
    ? Math.min(prompts, Math.floor((approveAt! - at) / interval) + 1)
    : Math.min(prompts, Math.floor((frame - at) / interval) + 1);
  const since = (frame - at) % interval;
  const buzz = !approved && shown <= prompts && since < 5 ? (random(`buzz-${frame}`) - 0.5) * 16 : 0;
  const ok = approveAt === undefined ? 0 : sp(frame, fps, approveAt, springs.pop);
  const h = size * 2;
  return (
    <div style={{ position: "absolute", width: size, height: h, ...style, transform: `translateX(${buzz}px) rotate(${buzz * 0.12}deg) scale(${enter})` }}>
      {new Array(prompts).fill(0).map((_, i) => (approveAt !== undefined && at + i * interval >= approveAt ? null : <Sfx key={i} name="notify" at={at + i * interval} volume={0.5} />))}
      {approveAt !== undefined ? <Sfx name="click" at={approveAt} /> : null}
      <div style={{ position: "absolute", inset: 0, borderRadius: size * 0.14, background: "#0B0F13", border: `${size * 0.03}px solid #2A343D`, boxShadow: `0 30px 70px rgba(0,0,0,0.7), 0 0 60px ${approved ? colors.green : colors.amber}22`, overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginTop: size * 0.1, fontFamily: fonts.mono, fontSize: size * 0.2, fontWeight: 700, color: colors.text }}>{time || "\u00a0"}</div>
        <div style={{ position: "absolute", left: size * 0.05, right: size * 0.05, top: size * 0.44, display: "flex", flexDirection: "column", gap: size * 0.035 }}>
          {new Array(shown).fill(0).map((_, i) => {
            // only the newest few fit on the screen; older ones scroll off the top
            if (i < shown - 5) return null;
            const p = sp(frame, fps, at + i * interval, springs.snappy);
            const last = i === shown - 1;
            const good = approved && last;
            return (
              <div
                key={i}
                style={{
                  padding: `${size * 0.035}px ${size * 0.05}px`,
                  borderRadius: size * 0.05,
                  background: good ? "rgba(57,255,136,0.18)" : colors.panelLight,
                  border: `2px solid ${good ? colors.green : colors.line}`,
                  fontFamily: fonts.mono,
                  fontSize: size * 0.084,
                  fontWeight: 700,
                  color: good ? colors.green : colors.text,
                  transform: `scale(${good ? 1 + 0.08 * (1 - ok) : p})`,
                  opacity: approved && !last ? 0.35 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {good ? "✓ APPROVED" : "Approve sign-in?"}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
