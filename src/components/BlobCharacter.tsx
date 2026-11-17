import React, { useId } from "react";
import { useCurrentFrame, random } from "remotion";
import { colors } from "../theme";

export type BlobExpression = "calm" | "scared" | "angry";
export type BlobAccessory = "none" | "hoodie" | "bikerVest";

/**
 * Capsule "blob" character: two dot eyes, no mouth, soft shadow.
 * Breathes, bobs and blinks on its own. `size` is the rendered height in px.
 */
export const BlobCharacter: React.FC<{
  color: string;
  accessory?: BlobAccessory;
  expression?: BlobExpression;
  size?: number;
  /** 1 = normal capsule, 1.3 = bulky */
  bulk?: number;
  /** idle breathing/bobbing amount; 0 freezes it */
  idle?: number;
  /** tremble; defaults on for "scared" */
  shake?: number;
  /** sweat drops; defaults on for "scared" */
  sweat?: boolean;
  eyeColor?: string;
  /** where the eyes look, each -1..1 */
  look?: { x: number; y: number };
  /** coloured light hitting the character from below/front (e.g. a laptop screen) */
  lightColor?: string;
  lightAmount?: number;
  /** offsets blink and idle phase so characters don't move in unison */
  seed?: number;
  style?: React.CSSProperties;
}> = ({
  color,
  accessory = "none",
  expression = "calm",
  size = 300,
  bulk = 1,
  idle = 1,
  shake,
  sweat,
  eyeColor,
  look = { x: 0, y: 0 },
  lightColor,
  lightAmount = 0,
  seed = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const uid = useId().replace(/:/g, "");
  const f = frame + seed * 37;

  const W = 260;
  const H = 300;
  const cx = W / 2;
  const bw = 150 * bulk;
  const bx = cx - bw / 2;
  const by = 46;
  const bh = 214;
  const rx = Math.min(bw / 2, 75);
  const baseY = by + bh;

  // idle
  const breath = 1 + 0.018 * idle * Math.sin(f / 14);
  const bob = 3 * idle * Math.sin(f / 23);
  const trem = shake ?? (expression === "scared" ? 1 : 0);
  const tx = (random(`tr-x-${seed}-${frame}`) - 0.5) * 5 * trem;
  const ty = (random(`tr-y-${seed}-${frame}`) - 0.5) * 2.5 * trem;

  // blink
  const period = 104 + (seed % 5) * 9;
  const bt = (f + 40) % period;
  const blink = bt < 6 ? Math.max(0.08, Math.abs(bt - 3) / 3) : 1;

  const hooded = accessory === "hoodie";
  const eyeFill = eyeColor ?? (hooded ? colors.text : "#07090B");
  const eyeY = hooded ? 128 : 122;
  const eyeDx = 27 * Math.min(bulk, 1.25);
  const lx = look.x * 5;
  const ly = look.y * 4;
  const showSweat = sweat ?? expression === "scared";

  const eye = (side: -1 | 1) => {
    const ex = cx + side * eyeDx + lx;
    const ey = eyeY + ly;
    if (expression === "scared") {
      const px = (random(`pu-${seed}-${Math.floor(frame / 4)}`) - 0.5) * 3;
      return (
        <g key={side}>
          <g transform={`translate(${ex} ${ey}) scale(1 ${blink}) translate(${-ex} ${-ey})`}>
            <circle cx={ex} cy={ey} r={13} fill="#F4F6F4" />
            <circle cx={ex + px} cy={ey + 1} r={4.6} fill="#07090B" />
          </g>
          <path
            d={`M ${ex - side * 13} ${ey - 32} Q ${ex} ${ey - 29} ${ex + side * 14} ${ey - 21}`}
            stroke="#07090B"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            opacity={0.75}
          />
        </g>
      );
    }
    if (expression === "angry") {
      return (
        <g key={side}>
          <g transform={`translate(${ex} ${ey}) scale(1 ${blink}) translate(${-ex} ${-ey})`}>
            <path
              d={`M ${ex + side * 11} ${ey - 5} L ${ex - side * 11} ${ey + 2} A 11 11 0 0 ${side === -1 ? 1 : 0} ${ex + side * 11} ${ey - 5} Z`}
              fill={eyeFill}
            />
          </g>
          <path
            d={`M ${ex + side * 15} ${ey - 19} L ${ex - side * 12} ${ey - 8}`}
            stroke={hooded ? eyeFill : "#07090B"}
            strokeWidth={5.5}
            strokeLinecap="round"
            opacity={hooded ? 0.9 : 0.85}
          />
        </g>
      );
    }
    return (
      <g key={side} transform={`translate(${ex} ${ey}) scale(1 ${blink}) translate(${-ex} ${-ey})`}>
        <circle cx={ex} cy={ey} r={8.5} fill={eyeFill} />
      </g>
    );
  };

  const sweatDrop = (i: number, x: number, phase: number) => {
    const t = ((f + phase) % 46) / 46;
    const y = by + 34 + t * 70;
    const o = t < 0.15 ? t / 0.15 : 1 - Math.max(0, (t - 0.6) / 0.4);
    return (
      <path
        key={i}
        d={`M ${x} ${y - 9} C ${x + 7} ${y} ${x + 6} ${y + 8} ${x} ${y + 8} C ${x - 6} ${y + 8} ${x - 7} ${y} ${x} ${y - 9} Z`}
        fill="#D9F3FF"
        opacity={o * 0.95}
      />
    );
  };

  const bodyClip = `body-${uid}`;
  const shade = `shade-${uid}`;
  const light = `light-${uid}`;
  const glow = `eyeglow-${uid}`;

  return (
    <svg
      width={(size * W) / H}
      height={size}
      viewBox={`0 0 ${W} ${H}`}
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <clipPath id={bodyClip}>
          <rect x={bx} y={by} width={bw} height={bh} rx={rx} />
        </clipPath>
        <linearGradient id={shade} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </linearGradient>
        <linearGradient id={light} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor={lightColor ?? "#fff"} stopOpacity="0.42" />
          <stop offset="0.5" stopColor={lightColor ?? "#fff"} stopOpacity="0.07" />
          <stop offset="1" stopColor={lightColor ?? "#fff"} stopOpacity="0" />
        </linearGradient>
        <filter id={glow} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* ground shadow */}
      <ellipse cx={cx} cy={baseY + 8} rx={bw * 0.52} ry={12} fill="#000" opacity={0.5} />

      <g
        transform={`translate(${tx} ${bob + ty}) translate(${cx} ${baseY}) scale(${1 / breath} ${breath}) translate(${-cx} ${-baseY})`}
      >
        {/* body */}
        <rect x={bx} y={by} width={bw} height={bh} rx={rx} fill={color} />

        {accessory === "bikerVest" ? (
          <g clipPath={`url(#${bodyClip})`}>
            <path
              d={`M ${bx - 4} 176 Q ${bx + 20} 150 ${cx - 30} 146 L ${cx - 10} 200 L ${cx - 10} ${baseY + 4} L ${bx - 4} ${baseY + 4} Z`}
              fill="#14171B"
            />
            <path
              d={`M ${bx + bw + 4} 176 Q ${bx + bw - 20} 150 ${cx + 30} 146 L ${cx + 10} 200 L ${cx + 10} ${baseY + 4} L ${bx + bw + 4} ${baseY + 4} Z`}
              fill="#14171B"
            />
            <path d={`M ${cx - 30} 146 L ${cx - 52} 176 L ${cx - 14} 192 Z`} fill="#23282E" />
            <path d={`M ${cx + 30} 146 L ${cx + 52} 176 L ${cx + 14} 192 Z`} fill="#23282E" />
            {[212, 232, 250].map((y) => (
              <circle key={y} cx={cx - 18} cy={y} r={3} fill="#AEB6BD" />
            ))}
            <rect x={cx + 24} y={206} width={30} height={18} rx={3} fill="#E6E6E6" opacity={0.9} />
            <rect x={cx + 24} y={206} width={30} height={9} rx={3} fill={colors.red} />
          </g>
        ) : null}

        {hooded ? (
          <g>
            {/* hood, slightly larger than the head, with a soft peak */}
            <path
              d={`M ${bx - 7} 172 C ${bx - 9} 78 ${cx - 46} 30 ${cx} 27 C ${cx + 46} 30 ${bx + bw + 9} 78 ${bx + bw + 7} 172 Q ${cx} 190 ${bx - 7} 172 Z`}
              fill="#232D38"
            />
            {/* face opening */}
            <ellipse cx={cx} cy={126} rx={51} ry={43} fill="#06080A" />
            <ellipse
              cx={cx}
              cy={126}
              rx={51}
              ry={43}
              fill="none"
              stroke="#32404E"
              strokeWidth={4}
            />
            {/* drawstrings + pocket */}
            <path d={`M ${cx - 16} 176 l -3 30`} stroke="#3B4958" strokeWidth={3.5} strokeLinecap="round" />
            <path d={`M ${cx + 16} 176 l 3 30`} stroke="#3B4958" strokeWidth={3.5} strokeLinecap="round" />
            <path
              d={`M ${cx - 38} 252 Q ${cx} 222 ${cx + 38} 252`}
              stroke="#0F151B"
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ) : null}

        {/* shading */}
        <g clipPath={`url(#${bodyClip})`}>
          <rect x={bx} y={by} width={bw} height={bh} fill={`url(#${shade})`} />
        </g>
        {lightColor && lightAmount > 0 ? (
          <g opacity={lightAmount}>
            <path
              d={`M ${bx - 7} 172 C ${bx - 9} 78 ${cx - 46} 30 ${cx} 27 C ${cx + 46} 30 ${bx + bw + 9} 78 ${bx + bw + 7} 172 L ${bx + bw} ${baseY - rx} Q ${bx + bw} ${baseY} ${cx} ${baseY} Q ${bx} ${baseY} ${bx} ${baseY - rx} Z`}
              fill={`url(#${light})`}
              style={{ mixBlendMode: "screen" }}
            />
          </g>
        ) : null}

        {/* eyes */}
        {hooded ? (
          <g filter={`url(#${glow})`} opacity={0.7}>
            <circle cx={cx - eyeDx + lx} cy={eyeY + ly} r={9} fill={lightColor ?? eyeFill} />
            <circle cx={cx + eyeDx + lx} cy={eyeY + ly} r={9} fill={lightColor ?? eyeFill} />
          </g>
        ) : null}
        {eye(-1)}
        {eye(1)}

        {showSweat ? (
          <g>
            {sweatDrop(0, bx + 16, 0)}
            {sweatDrop(1, bx + bw - 14, 19)}
            {sweatDrop(2, bx + bw - 34, 33)}
          </g>
        ) : null}
      </g>
    </svg>
  );
};
