import React from "react";
import { colors, fonts } from "../theme";

/** Generic onion mark for dark-web markets. */
export const OnionLogo: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 80,
  color = colors.green,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", ...style }}>
    <path d="M 50 12 C 46 26 20 38 20 62 C 20 80 33 92 50 92 C 67 92 80 80 80 62 C 80 38 54 26 50 12 Z" fill={color} fillOpacity={0.14} stroke={color} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 50 30 C 47 42 34 48 34 64 C 34 78 41 88 50 91" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    <path d="M 50 30 C 53 42 66 48 66 64 C 66 78 59 88 50 91" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    <path d="M 50 12 V 4" stroke={color} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

/** Stylised Silk Road camel (our own drawing, not the real logo). */
export const CamelLogo: React.FC<{ size?: number; color?: string; cracked?: boolean; style?: React.CSSProperties }> = ({
  size = 300,
  color = colors.green,
  cracked = false,
  style,
}) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 200 150" style={{ overflow: "visible", filter: `drop-shadow(0 0 14px ${color}66)`, ...style }}>
    <g fill={color}>
      <ellipse cx={96} cy={86} rx={56} ry={25} />
      <path d="M 62 74 Q 96 12 130 74 Z" />
      <path d="M 138 92 L 158 44 L 172 48 L 156 96 Z" />
      <ellipse cx={176} cy={40} rx={17} ry={10} />
      <path d="M 162 30 l 4 -12 l 6 11 Z" />
      {[56, 76, 116, 136].map((x) => (
        <rect key={x} x={x} y={98} width={10} height={46} rx={4} />
      ))}
      <path d="M 42 82 Q 28 86 30 104" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
    </g>
    <circle cx={181} cy={38} r={2.4} fill={colors.bg} />
    {cracked ? (
      <path d="M 88 30 L 100 58 L 90 72 L 108 96 L 98 118 L 106 146" fill="none" stroke={colors.bg} strokeWidth={5} strokeLinejoin="bevel" />
    ) : null}
  </svg>
);

/**
 * Market wordmark with a simple mark. Stylised on purpose: these are not the real logos.
 * mark: "alpha" (AlphaBay), "hansa", or "onion" (any copycat market).
 */
export const MarketLogo: React.FC<{
  name: string;
  mark?: "alpha" | "hansa" | "onion";
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ name, mark = "onion", size = 120, color, style }) => {
  const c = color ?? (mark === "alpha" ? colors.gold : mark === "hansa" ? colors.dutch : colors.green);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: size * 0.22, ...style }}>
      {mark === "onion" ? (
        <OnionLogo size={size} color={c} />
      ) : (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 ${size * 0.14}px ${c}77)` }}>
          {mark === "alpha" ? (
            <g>
              <path d="M 50 4 L 90 27 V 73 L 50 96 L 10 73 V 27 Z" fill={c} />
              <path d="M 30 72 L 50 24 L 70 72 M 38 56 H 62" fill="none" stroke={colors.bg} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : (
            <g>
              <circle cx={50} cy={50} r={45} fill={c} />
              <path d="M 33 26 V 74 M 67 26 V 74 M 33 50 H 67" fill="none" stroke={colors.bg} strokeWidth={10} strokeLinecap="round" />
            </g>
          )}
        </svg>
      )}
      <span
        style={{
          fontFamily: fonts.display,
          fontSize: size * 1.15,
          lineHeight: 0.9,
          letterSpacing: "0.04em",
          color: c,
          textShadow: `0 0 ${size * 0.3}px ${c}55`,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
    </div>
  );
};
