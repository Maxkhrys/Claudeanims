import React from "react";
import { colors } from "../theme";

/** Pirate hat that draws itself. `progress` goes 0 -> 1. */
export const PirateHat: React.FC<{
  progress: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ progress, size = 200, color = colors.amber, style }) => {
  const seg = (from: number, to: number) =>
    Math.min(1, Math.max(0, (progress - from) / (to - from)));
  const draw = (p: number) => ({
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1 - p,
    opacity: p > 0 ? 1 : 0,
  });
  const fill = seg(0.8, 1);
  const common = {
    stroke: color,
    strokeWidth: 5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 200 160"
      style={{ overflow: "visible", filter: `drop-shadow(0 0 14px ${color}88)`, ...style }}
    >
      {/* bicorne silhouette: dome with two upturned points */}
      <path
        d="M 6 82 Q 44 98 52 68 C 60 32 82 18 100 18 C 118 18 140 32 148 68 Q 156 98 194 82 L 186 112 Q 100 150 14 112 Z"
        {...common}
        {...draw(seg(0, 0.6))}
        fill={color}
        fillOpacity={fill * 0.16}
      />
      {/* brim band */}
      <path d="M 22 104 Q 100 136 178 104" {...common} strokeWidth={3} {...draw(seg(0.45, 0.75))} />
      {/* crossbones */}
      <path d="M 78 96 L 122 60" {...common} {...draw(seg(0.6, 0.8))} />
      <path d="M 78 60 L 122 96" {...common} {...draw(seg(0.68, 0.88))} />
      {/* skull */}
      <circle
        cx={100}
        cy={74}
        r={15}
        {...common}
        {...draw(seg(0.78, 1))}
        fill={colors.bg}
        fillOpacity={1}
      />
      <g opacity={fill}>
        <circle cx={94} cy={73} r={3.4} fill={color} />
        <circle cx={106} cy={73} r={3.4} fill={color} />
      </g>
    </svg>
  );
};

export type AvatarIcon = "flask" | "skull" | "helmet" | "unknown";

/** Round profile badge used in chat headers. One icon per character. */
export const AvatarBadge: React.FC<{
  icon: AvatarIcon;
  size?: number;
  color?: string;
}> = ({ icon, size = 96, color = colors.green }) => {
  const ink = colors.bg;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={48} fill={icon === "unknown" ? colors.panelLight : color} />
      <circle cx={50} cy={50} r={48} fill="none" stroke={ink} strokeOpacity={0.25} strokeWidth={4} />
      {icon === "flask" ? (
        <g>
          <path
            d="M 42 20 H 58 M 44 20 V 42 L 26 74 Q 22 84 32 84 H 68 Q 78 84 74 74 L 56 42 V 20"
            fill="none"
            stroke={ink}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M 35 62 H 65 L 72 76 Q 74 81 68 81 H 32 Q 26 81 28 76 Z" fill={ink} />
          <circle cx={44} cy={71} r={3.5} fill={color} />
          <circle cx={56} cy={67} r={2.5} fill={color} />
          <circle cx={52} cy={50} r={3} fill={ink} />
        </g>
      ) : null}
      {icon === "skull" ? (
        <g>
          <path d="M 22 82 L 78 62 M 22 62 L 78 82" stroke={ink} strokeWidth={8} strokeLinecap="round" />
          <path
            d="M 50 18 C 30 18 24 34 26 46 C 27 54 33 56 35 60 V 68 H 65 V 60 C 67 56 73 54 74 46 C 76 34 70 18 50 18 Z"
            fill={ink}
          />
          <circle cx={41} cy={43} r={6.5} fill={color} />
          <circle cx={59} cy={43} r={6.5} fill={color} />
          <path d="M 47 55 L 50 49 L 53 55 Z" fill={color} />
        </g>
      ) : null}
      {icon === "helmet" ? (
        <g>
          <path d="M 18 58 C 16 30 34 18 52 18 C 72 18 84 34 82 56 L 60 58 L 56 50 H 30 L 28 58 Z" fill={ink} />
          <path d="M 14 60 H 62" stroke={ink} strokeWidth={7} strokeLinecap="round" />
          <path d="M 34 64 H 58 V 74 Q 46 84 34 74 Z" fill={ink} opacity={0.85} />
          <circle cx={41} cy={68} r={3} fill={color} />
          <circle cx={52} cy={68} r={3} fill={color} />
        </g>
      ) : null}
      {icon === "unknown" ? (
        <text
          x={50}
          y={68}
          textAnchor="middle"
          fontSize={52}
          fontWeight={700}
          fontFamily="monospace"
          fill={colors.dim}
        >
          ?
        </text>
      ) : null}
    </svg>
  );
};

/** Columned building: reads as "government" or "bank". */
export const BuildingIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 200,
  color = colors.text,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 50 8 L 94 34 H 6 Z" fill={color} />
    <rect x={10} y={38} width={80} height={7} fill={color} />
    {[18, 37, 56, 75].map((x) => (
      <rect key={x} x={x} y={49} width={8} height={30} fill={color} />
    ))}
    <rect x={8} y={82} width={84} height={10} rx={2} fill={color} />
  </svg>
);

/** Bitcoin-style coin. */
export const CoinIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 200,
  color = colors.amber,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 16px ${color}77)` }}>
    <circle cx={50} cy={50} r={46} fill={color} />
    <circle cx={50} cy={50} r={38} fill="none" stroke={colors.bg} strokeOpacity={0.35} strokeWidth={3} />
    <g fill="none" stroke={colors.bg} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round">
      <path d="M 38 28 V 72 M 38 28 H 54 Q 66 28 66 39 Q 66 50 54 50 H 38 M 54 50 Q 69 50 69 61 Q 69 72 54 72 H 38" />
      <path d="M 45 20 V 28 M 55 20 V 28 M 45 72 V 80 M 55 72 V 80" strokeWidth={5} />
    </g>
  </svg>
);

/** Red X that draws itself. `progress` 0 -> 1. */
export const CrossOut: React.FC<{ progress: number; size?: number; color?: string }> = ({
  progress,
  size = 200,
  color = colors.red,
}) => {
  const a = Math.min(1, progress * 2);
  const b = Math.min(1, Math.max(0, progress * 2 - 1));
  const line = (p: number) => ({ pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p, opacity: p > 0 ? 1 : 0 });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ overflow: "visible", filter: `drop-shadow(0 0 14px ${color})` }}
    >
      <path d="M 6 6 L 94 94" stroke={color} strokeWidth={10} strokeLinecap="round" {...line(a)} />
      <path d="M 94 6 L 6 94" stroke={color} strokeWidth={10} strokeLinecap="round" {...line(b)} />
    </svg>
  );
};

export const Star: React.FC<{ fill: number; size?: number; color?: string }> = ({
  fill,
  size = 26,
  color = colors.amber,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `scale(${0.8 + 0.2 * Math.min(1, fill) + (fill > 0 && fill < 1 ? 0.25 : 0)})` }}>
    <path
      d="M12 2 L14.9 8.6 L22 9.3 L16.6 14 L18.2 21 L12 17.3 L5.8 21 L7.4 14 L2 9.3 L9.1 8.6 Z"
      fill={color}
      fillOpacity={Math.min(1, fill)}
      stroke={color}
      strokeOpacity={0.6}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </svg>
);
