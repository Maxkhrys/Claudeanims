import React from "react";
import { useCurrentFrame, useVideoConfig, random, interpolate, interpolateColors } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Star } from "./Icons";

export type ShopListing = {
  /** harmless-looking title shown first */
  title: string;
  /** what it really is; shown after `revealAt` */
  realTitle?: string;
  price: string;
  review?: string;
};

/**
 * Browser window showing a marketplace grid.
 * Frames are local. Each stage is optional:
 *   listingsAt -> cards pop in, starsAt -> stars fill,
 *   reviewsAt -> review chips, revealAt -> cards turn red with real titles.
 */
export const ShopWindow: React.FC<{
  width?: number;
  url?: string;
  storeName?: string;
  tagline?: string;
  listings: ShopListing[];
  columns?: number;
  listingsAt?: number;
  starsAt?: number;
  reviewsAt?: number;
  revealAt?: number;
  style?: React.CSSProperties;
}> = ({
  width = 1500,
  url = "silkroad.onion",
  storeName = "Silk Road",
  tagline = "anonymous marketplace",
  listings,
  columns = 4,
  listingsAt = 0,
  starsAt,
  reviewsAt,
  revealAt,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = sp(frame, fps, 0, springs.snappy);

  return (
    <div
      style={{
        width,
        fontFamily: fonts.mono,
        color: colors.text,
        background: colors.panel,
        border: `2px solid ${colors.line}`,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 80px rgba(57,255,136,0.07)",
        opacity: interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${(1 - enter) * 50}px) scale(${0.9 + 0.1 * enter})`,
        ...style,
      }}
    >
      {/* browser chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 20px",
          background: "#090D10",
          borderBottom: `2px solid ${colors.line}`,
        }}
      >
        {[colors.red, colors.amber, colors.green].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.75 }} />
        ))}
        <div
          style={{
            flex: 1,
            marginLeft: 14,
            padding: "8px 18px",
            borderRadius: 8,
            background: colors.panelLight,
            border: `1px solid ${colors.line}`,
            fontSize: 22,
            color: colors.dim,
          }}
        >
          <span style={{ color: colors.green }}>tor://</span>
          {url}
        </div>
      </div>

      {/* store header */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 20,
          padding: "22px 30px 16px",
          borderBottom: `2px solid ${colors.line}`,
        }}
      >
        <div style={{ fontFamily: fonts.display, fontSize: 64, lineHeight: 1, color: colors.green }}>
          {storeName}
        </div>
        <div style={{ fontSize: 22, color: colors.dim }}>{tagline}</div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 22, color: colors.dim }}>cart (0) · account · messages</div>
      </div>

      {/* listings */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 20,
          padding: 26,
        }}
      >
        {listings.map((l, i) => {
          const pop = sp(frame, fps, listingsAt + i * 2.5, springs.pop);
          const rev = revealAt === undefined ? 0 : sp(frame, fps, revealAt + i * 2, springs.snappy);
          const revealed = rev > 0.5;
          const accent = interpolateColors(Math.min(1, rev), [0, 1], [colors.line, colors.red]);
          const jitter = rev > 0.02 && rev < 0.98 ? (random(`shop-${i}-${frame}`) - 0.5) * 14 : 0;
          const chip = reviewsAt === undefined ? 0 : sp(frame, fps, reviewsAt + i * 3, springs.pop);
          return (
            <div
              key={i}
              style={{
                position: "relative",
                background: colors.panelLight,
                border: `2px solid ${accent}`,
                borderRadius: 10,
                padding: 14,
                transform: `scale(${pop}) translateX(${jitter}px)`,
                boxShadow: revealed ? "0 0 30px rgba(255,59,59,0.25)" : "none",
              }}
            >
              <div
                style={{
                  height: 116,
                  borderRadius: 6,
                  background: revealed
                    ? "repeating-linear-gradient(45deg, rgba(255,59,59,0.22) 0 12px, rgba(255,59,59,0.08) 12px 24px)"
                    : "linear-gradient(135deg, #1B242C, #141B21)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width={54} height={54} viewBox="0 0 24 24" opacity={revealed ? 0.9 : 0.45}>
                  <path
                    d="M3 7 L12 3 L21 7 V17 L12 21 L3 17 Z M3 7 L12 11 L21 7 M12 11 V21"
                    fill="none"
                    stroke={revealed ? colors.red : colors.text}
                    strokeWidth={1.4}
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 30,
                  fontWeight: 700,
                  color: revealed ? colors.red : colors.text,
                  whiteSpace: "nowrap",
                }}
              >
                {revealed ? l.realTitle ?? l.title : l.title}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 8 }}>
                {[0, 1, 2, 3, 4].map((s) => (
                  <Star
                    key={s}
                    size={24}
                    fill={
                      starsAt === undefined
                        ? 0
                        : Math.max(0, Math.min(1, sp(frame, fps, starsAt + i * 1.5 + s * 2.5, springs.pop)))
                    }
                  />
                ))}
                <div style={{ flex: 1 }} />
                <div style={{ fontSize: 22, color: colors.green }}>{l.price}</div>
              </div>
              {l.review && chip > 0.01 ? (
                <div
                  style={{
                    position: "absolute",
                    right: -10,
                    top: -16,
                    padding: "6px 12px",
                    borderRadius: "10px 10px 10px 2px",
                    background: colors.text,
                    color: colors.bg,
                    fontSize: 19,
                    fontWeight: 700,
                    transform: `scale(${chip}) rotate(${i % 2 ? 2 : -2}deg)`,
                    transformOrigin: "left bottom",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {l.review}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
