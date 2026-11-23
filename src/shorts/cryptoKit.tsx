import React, { useId, useMemo } from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Sfx } from "../components";
import { big, clamp01, lerp } from "./kit3d";

/*
 * Drawings for the Top 5 crypto video: the woman in the red gown, flat cartoon people,
 * coins, price charts, a dotted world map, vault, heart monitor, fireworks, crowd,
 * pixel disintegration and other props. All flat SVG/CSS, no photos or real logos.
 */

export const GOLD = "#FFC93C";
export const GOWN = "#E0182D";
export const PINK = "#FF2E88";
export const TEAL = "#1FD1B2";
export const SKY = "#3FB6FF";
export const MINT = "#39FF88";

export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeInOut = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const ramp = (f: number, at: number, dur = 10) => clamp01((f - at) / dur);

/* ------------------------------------------------------------------ the woman in the red gown */

/**
 * Glamorous woman in a red ball gown (anonymous cartoon, 240x480 box).
 * `wave` (cycles) swings the raised right forearm; `crown` adds a small tiara;
 * `silhouette` draws her as one flat colour (`shadow`).
 */
export const GownWoman: React.FC<{ wave?: number; crown?: boolean; walk?: number; lit?: number; silhouette?: boolean; shadow?: string; armUp?: boolean }> = ({
  wave = 0,
  crown = false,
  walk = 0,
  lit = 1,
  silhouette = false,
  shadow = "#120A10",
  armUp = true,
}) => {
  const id = useId().replace(/:/g, "");
  const skin = silhouette ? shadow : "#F2C29F";
  const skinD = silhouette ? shadow : "#DDA27C";
  const hair = silhouette ? shadow : "#2A1712";
  const dress = silhouette ? shadow : `url(#g-${id})`;
  const fore = Math.sin(wave * Math.PI * 2) * 22;
  const sway = Math.sin(walk * Math.PI * 2) * 7;
  const arm = 17;
  return (
    <svg width={240} height={480} viewBox="0 0 240 480" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`g-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#FF5466" />
          <stop offset="0.45" stopColor={GOWN} />
          <stop offset="1" stopColor="#6E0614" />
        </linearGradient>
        <radialGradient id={`sh-${id}`} cx="0.35" cy="0.3" r="0.7">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.35 * lit} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* long hair behind the shoulders */}
      <path d="M82 70 C78 30 162 30 158 70 C166 110 170 150 162 176 C150 184 140 176 132 182 L108 182 C100 176 90 184 78 176 C70 150 74 110 82 70 Z" fill={hair} />
      {/* skirt (flares, sways while walking) */}
      <path d={`M90 204 C72 300 ${32 + sway} 400 ${14 + sway} 470 L${226 + sway} 470 C${208 + sway} 400 168 300 150 204 Z`} fill={dress} />
      {!silhouette ? (
        <>
          <path d={`M108 214 C98 300 ${78 + sway} 400 ${66 + sway} 466`} stroke="#FF8A95" strokeWidth={5} fill="none" opacity={0.55} />
          <path d={`M132 214 C142 300 ${160 + sway} 400 ${176 + sway} 466`} stroke="#FF8A95" strokeWidth={3} fill="none" opacity={0.35} />
          <path d={`M146 214 C166 300 ${196 + sway} 400 ${214 + sway} 466`} stroke="#8A0818" strokeWidth={7} fill="none" opacity={0.6} />
          <rect x={14 + sway} y={462} width={212} height={10} rx={5} fill="#5E0412" />
        </>
      ) : null}
      {/* neck + shoulders */}
      <rect x={110} y={100} width={20} height={34} rx={6} fill={skinD} />
      <path d="M86 140 C88 128 102 124 120 124 C138 124 152 128 154 140 L152 156 L88 156 Z" fill={skin} />
      {/* bodice with a sweetheart neckline */}
      <path d="M88 152 Q104 140 120 154 Q136 140 152 152 L154 206 L86 206 Z" fill={dress} />
      {!silhouette ? <rect x={86} y={200} width={68} height={7} rx={3} fill={GOLD} /> : null}
      {/* left arm, relaxed */}
      <polyline points="92,142 80,188 78,232" fill="none" stroke={skin} strokeWidth={arm} strokeLinecap="round" strokeLinejoin="round" />
      {/* right arm: raised and waving (forearm swings at the elbow) */}
      {armUp ? (
        <g>
          <line x1={148} y1={142} x2={178} y2={110} stroke={skin} strokeWidth={arm} strokeLinecap="round" />
          <g transform={`rotate(${fore} 178 110)`}>
            <line x1={178} y1={110} x2={186} y2={60} stroke={skin} strokeWidth={arm - 1} strokeLinecap="round" />
            <ellipse cx={187} cy={50} rx={11} ry={13} fill={skin} />
          </g>
        </g>
      ) : (
        <polyline points="148,142 160,188 162,232" fill="none" stroke={skin} strokeWidth={arm} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {/* necklace */}
      {!silhouette ? <path d="M108 128 Q120 140 132 128" stroke={GOLD} strokeWidth={4} fill="none" /> : null}
      {/* face */}
      <ellipse cx={120} cy={78} rx={30} ry={35} fill={skin} />
      {/* side-swept fringe */}
      <path d="M88 82 C84 44 112 34 136 40 C154 46 160 64 154 88 C148 70 136 58 116 60 C104 62 94 70 88 82 Z" fill={hair} />
      {!silhouette ? (
        <>
          <circle cx={109} cy={82} r={4.2} fill="#1A1010" />
          <circle cx={131} cy={82} r={4.2} fill="#1A1010" />
          <path d="M103 76 L107 74 M137 76 L133 74" stroke="#1A1010" strokeWidth={2.5} strokeLinecap="round" />
          <circle cx={102} cy={93} r={6} fill="#FF7A8A" opacity={0.45} />
          <circle cx={138} cy={93} r={6} fill="#FF7A8A" opacity={0.45} />
          <path d="M112 99 Q120 106 128 99 Q120 102 112 99 Z" fill={GOWN} stroke={GOWN} strokeWidth={3} strokeLinejoin="round" />
          <circle cx={90} cy={92} r={4} fill={GOLD} />
          <circle cx={150} cy={92} r={4} fill={GOLD} />
          <ellipse cx={120} cy={78} rx={30} ry={35} fill={`url(#sh-${id})`} />
        </>
      ) : null}
      {crown ? (
        <g transform="translate(120 40)">
          <path d="M-30 6 L-24 -22 L-12 -4 L0 -30 L12 -4 L24 -22 L30 6 Z" fill={GOLD} stroke="#B07A00" strokeWidth={3} />
          <circle cx={0} cy={-8} r={5} fill={GOWN} />
          <circle cx={-24} cy={-22} r={3.5} fill="#fff" />
          <circle cx={24} cy={-22} r={3.5} fill="#fff" />
        </g>
      ) : null}
    </svg>
  );
};

/* ------------------------------------------------------------------ flat cartoon people */

export type PersonProps = {
  size?: number;
  skin?: string;
  hair?: "messy" | "neat" | "short" | "none";
  hairColor?: string;
  outfit?: "suit" | "tee" | "uniform";
  shirt?: string;
  shorts?: boolean;
  glasses?: boolean;
  tie?: string;
  look?: number;
  bob?: number;
  arm?: number;
  silhouette?: boolean;
};

/** Flat cartoon person, 200x400 box scaled to `size` height. Dot eyes like the channel's blobs. */
export const Person: React.FC<PersonProps> = ({
  size = 400,
  skin = "#E8B48F",
  hair = "short",
  hairColor = "#2B1D14",
  outfit = "suit",
  shirt = "#2A3442",
  shorts = false,
  glasses = false,
  tie = colors.red,
  look = 0,
  bob = 0,
  arm = 0,
  silhouette = false,
}) => {
  const frame = useCurrentFrame();
  const k = silhouette ? "#0B0E12" : undefined;
  const sk = k ?? skin;
  const hc = k ?? hairColor;
  const sh = k ?? shirt;
  const pants = k ?? (outfit === "suit" ? shirt : "#5C6B4A");
  const y = Math.sin(frame / 12) * 3 * bob;
  return (
    <svg width={size / 2} height={size} viewBox="0 0 200 400" style={{ overflow: "visible" }}>
      <ellipse cx={100} cy={394} rx={62} ry={9} fill="rgba(0,0,0,0.35)" />
      <g transform={`translate(0 ${y})`}>
        {/* legs */}
        {shorts ? (
          <>
            <rect x={70} y={300} width={24} height={82} rx={8} fill={sk} />
            <rect x={106} y={300} width={24} height={82} rx={8} fill={sk} />
            <rect x={66} y={360} width={30} height={14} fill={k ?? "#F2F2F2"} />
            <rect x={104} y={360} width={30} height={14} fill={k ?? "#F2F2F2"} />
            <path d="M62 262 L138 262 L142 318 L104 318 L100 290 L96 318 L58 318 Z" fill={k ?? "#6B7A55"} />
          </>
        ) : (
          <>
            <rect x={68} y={262} width={28} height={118} rx={8} fill={pants} />
            <rect x={104} y={262} width={28} height={118} rx={8} fill={pants} />
          </>
        )}
        <ellipse cx={80} cy={384} rx={20} ry={9} fill={k ?? "#15191F"} />
        <ellipse cx={120} cy={384} rx={20} ry={9} fill={k ?? "#15191F"} />
        {/* body */}
        <path d="M58 160 C58 140 76 130 100 130 C124 130 142 140 142 160 L146 272 L54 272 Z" fill={sh} />
        {!silhouette && outfit === "suit" ? (
          <>
            <path d="M88 132 L100 172 L112 132 Z" fill="#F1F3F5" />
            <path d="M97 140 L103 140 L106 200 L100 210 L94 200 Z" fill={tie} />
            <path d="M84 132 L98 190 L74 150 Z" fill="rgba(0,0,0,0.25)" />
            <path d="M116 132 L102 190 L126 150 Z" fill="rgba(0,0,0,0.25)" />
          </>
        ) : null}
        {!silhouette && outfit === "uniform" ? <rect x={60} y={190} width={80} height={14} fill="#1B2430" /> : null}
        {/* arms */}
        <rect x={38} y={146} width={22} height={110} rx={10} fill={sh} transform={`rotate(${8 - arm * 0.3} 49 150)`} />
        <rect x={140} y={146} width={22} height={110} rx={10} fill={sh} transform={`rotate(${-8 - arm} 151 150)`} />
        <circle cx={44} cy={258} r={11} fill={sk} />
        <g transform={`rotate(${-8 - arm} 151 150)`}>
          <circle cx={152} cy={260} r={11} fill={sk} />
        </g>
        {/* head */}
        <rect x={90} y={112} width={20} height={22} fill={sk} />
        <circle cx={100} cy={82} r={44} fill={sk} />
        {hair === "messy" ? (
          <g fill={hc}>
            {[
              [62, 70, 20],
              [72, 48, 22],
              [96, 38, 24],
              [122, 44, 22],
              [140, 62, 20],
              [146, 84, 14],
              [56, 92, 14],
              [84, 52, 18],
              [110, 34, 16],
              [132, 50, 16],
            ].map(([x, yy, r], i) => (
              <circle key={i} cx={x + Math.sin(frame / 7 + i) * 1.2} cy={yy} r={r} />
            ))}
          </g>
        ) : null}
        {hair === "neat" ? <path d="M56 82 C54 46 76 34 100 34 C128 34 146 48 144 78 C134 60 116 54 96 56 C78 58 64 66 56 82 Z" fill={hc} /> : null}
        {hair === "short" ? <path d="M58 76 C60 46 80 36 100 36 C124 36 142 50 142 76 C128 62 112 58 100 58 C86 58 70 62 58 76 Z" fill={hc} /> : null}
        {!silhouette ? (
          <>
            <circle cx={86 + look * 6} cy={86} r={5.5} fill="#14181D" />
            <circle cx={114 + look * 6} cy={86} r={5.5} fill="#14181D" />
            {glasses ? (
              <g stroke="#14181D" strokeWidth={4} fill="none">
                <rect x={70} y={74} width={30} height={24} rx={8} />
                <rect x={102} y={74} width={30} height={24} rx={8} />
                <line x1={100} y1={84} x2={102} y2={84} />
              </g>
            ) : null}
          </>
        ) : null}
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------ coins */

/** Gold coin with a symbol, spinning in fake 3D (layered edge). */
export const Coin: React.FC<{ size: number; label: React.ReactNode; color?: string; edge?: string; spin?: number; textColor?: string }> = ({
  size,
  label,
  color = GOLD,
  edge = "#B07A00",
  spin = 0,
  textColor = "#6B4A00",
}) => {
  const layers = 8;
  return (
    <div style={{ width: size, height: size, position: "relative", transformStyle: "preserve-3d", transform: `perspective(1200px) rotateY(${spin}deg)` }}>
      {new Array(layers).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, borderRadius: "50%", background: edge, transform: `translateZ(${-i * (size * 0.012)}px)` }} />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 30%, #FFF3C4, ${color} 45%, ${edge} 100%)`,
          border: `${size * 0.045}px solid ${edge}`,
          boxShadow: `inset 0 0 0 ${size * 0.04}px ${color}, 0 0 ${size * 0.4}px ${color}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateZ(1px)",
        }}
      >
        <div style={{ ...big(size * 0.42, textColor), textShadow: "none", letterSpacing: 0 }}>{label}</div>
      </div>
    </div>
  );
};

/** The three game shapes (circle, triangle, square) as one row, for the squid coin and TV. */
export const Shapes: React.FC<{ size: number; color?: string; stroke?: number }> = ({ size, color = PINK, stroke = 0.12 }) => {
  const s = size;
  const w = s * stroke;
  return (
    <svg width={s * 3.4} height={s} viewBox={`0 0 ${s * 3.4} ${s}`}>
      <circle cx={s / 2} cy={s / 2} r={s / 2 - w / 2} fill="none" stroke={color} strokeWidth={w} />
      <polygon points={`${s * 1.7},${w * 0.8} ${s * 2.2 - w * 0.2},${s - w / 2} ${s * 1.2 + w * 0.2},${s - w / 2}`} fill="none" stroke={color} strokeWidth={w} strokeLinejoin="round" />
      <rect x={s * 2.4 + w / 2} y={w / 2} width={s - w} height={s - w} fill="none" stroke={color} strokeWidth={w} />
    </svg>
  );
};

/* ------------------------------------------------------------------ price chart */

/** Line chart that draws itself. `pts` are 0..1 (x, y up). `progress` 0..1 reveals along x. */
export const LineChart: React.FC<{ w: number; h: number; pts: [number, number][]; progress: number; color: string; fill?: boolean; grid?: boolean; dot?: boolean }> = ({
  w,
  h,
  pts,
  progress,
  color,
  fill = true,
  grid = true,
  dot = true,
}) => {
  const id = useId().replace(/:/g, "");
  const p = clamp01(progress);
  // resample the path up to progress
  const shown: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    if (pts[i][0] <= p) shown.push(pts[i]);
    else {
      const a = pts[i - 1] ?? pts[i];
      const t = (p - a[0]) / Math.max(1e-6, pts[i][0] - a[0]);
      shown.push([p, lerp(a[1], pts[i][1], clamp01(t))]);
      break;
    }
  }
  const X = (x: number) => x * w;
  const Y = (y: number) => h - y * h;
  const d = shown.map(([x, y], i) => `${i ? "L" : "M"}${X(x).toFixed(1)} ${Y(y).toFixed(1)}`).join(" ");
  const last = shown[shown.length - 1] ?? [0, 0];
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`lf-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.45} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {grid
        ? [0.25, 0.5, 0.75].map((g) => <line key={g} x1={0} x2={w} y1={h * g} y2={h * g} stroke="rgba(255,255,255,0.08)" strokeWidth={3} strokeDasharray="10 12" />)
        : null}
      {fill && shown.length > 1 ? <path d={`${d} L${X(last[0])} ${h} L0 ${h} Z`} fill={`url(#lf-${id})`} /> : null}
      <path d={d} fill="none" stroke={color} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${color})` }} />
      {dot && shown.length ? <circle cx={X(last[0])} cy={Y(last[1])} r={16} fill="#fff" stroke={color} strokeWidth={6} /> : null}
    </svg>
  );
};

/* ------------------------------------------------------------------ phone */

export const Phone: React.FC<{ w: number; children?: React.ReactNode; tilt?: number; glow?: string }> = ({ w, children, tilt = 0, glow = MINT }) => (
  <div
    style={{
      width: w,
      height: w * 2,
      borderRadius: w * 0.14,
      background: "#0A0D11",
      border: `${w * 0.035}px solid #2E3944`,
      boxShadow: `0 0 80px ${glow}44, 0 30px 60px rgba(0,0,0,0.6)`,
      position: "relative",
      overflow: "hidden",
      transform: `rotate(${tilt}deg)`,
    }}
  >
    <div style={{ position: "absolute", left: "36%", right: "36%", top: w * 0.04, height: w * 0.06, borderRadius: 30, background: "#000", zIndex: 3 }} />
    <div style={{ position: "absolute", inset: `${w * 0.13}px ${w * 0.06}px ${w * 0.08}px` }}>{children}</div>
  </div>
);

/* ------------------------------------------------------------------ dotted world map */

type LL = [number, number];
const LAND: LL[][] = [
  // North America
  [[-168, 66], [-160, 71], [-140, 70], [-120, 72], [-95, 73], [-80, 73], [-62, 67], [-55, 52], [-66, 45], [-70, 42], [-76, 35], [-81, 31], [-80, 25], [-82, 28], [-90, 29], [-97, 26], [-97, 21], [-92, 18], [-87, 21], [-88, 16], [-83, 10], [-79, 8], [-82, 8], [-86, 12], [-92, 15], [-105, 20], [-110, 24], [-117, 32], [-123, 38], [-125, 48], [-132, 55], [-142, 60], [-152, 58], [-165, 61]],
  // Greenland
  [[-55, 60], [-45, 60], [-20, 70], [-20, 80], [-40, 83], [-65, 80], [-60, 75]],
  // South America
  [[-80, 8], [-72, 12], [-60, 10], [-50, 2], [-35, -6], [-38, -13], [-41, -22], [-48, -27], [-53, -34], [-58, -38], [-65, -41], [-68, -50], [-70, -55], [-75, -50], [-73, -40], [-71, -30], [-70, -18], [-76, -14], [-81, -5], [-80, 1], [-77, 4]],
  // Europe
  [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [5, 53], [8, 57], [5, 62], [15, 69], [25, 71], [40, 68], [45, 66], [60, 68], [60, 55], [50, 47], [40, 47], [36, 45], [30, 45], [28, 41], [26, 40], [22, 37], [20, 40], [18, 42], [14, 45], [12, 44], [16, 40], [16, 38], [12, 38], [10, 44], [6, 43], [3, 43], [0, 39], [-5, 36]],
  // Britain + Ireland
  [[-6, 50], [2, 51], [1, 53], [-2, 56], [-3, 58], [-6, 58], [-5, 55], [-3, 54], [-5, 52]],
  [[-10, 52], [-6, 52], [-6, 55], [-10, 54]],
  // Africa
  [[-17, 21], [-17, 15], [-12, 8], [-8, 5], [5, 6], [9, 4], [10, -2], [13, -12], [12, -18], [15, -27], [18, -34], [25, -34], [32, -28], [35, -20], [40, -15], [40, -5], [51, 11], [43, 12], [37, 20], [33, 28], [32, 31], [20, 32], [10, 37], [0, 36], [-6, 35], [-10, 30], [-15, 26]],
  // Asia
  [[26, 40], [30, 45], [36, 45], [40, 47], [50, 47], [60, 55], [60, 68], [70, 73], [90, 76], [110, 77], [130, 72], [150, 71], [170, 70], [180, 66], [170, 60], [160, 58], [155, 50], [142, 46], [140, 40], [130, 42], [129, 35], [126, 35], [126, 38], [122, 40], [122, 32], [118, 24], [110, 20], [108, 12], [104, 9], [100, 13], [100, 7], [103, 1], [98, 8], [97, 17], [92, 22], [88, 22], [80, 15], [78, 8], [73, 18], [72, 22], [67, 25], [62, 25], [57, 26], [52, 28], [48, 30], [56, 26], [58, 22], [55, 17], [44, 13], [43, 17], [39, 22], [35, 28], [35, 33], [36, 36], [30, 37], [27, 37]],
  // Japan
  [[130, 31], [135, 34], [140, 36], [142, 40], [141, 45], [145, 44], [141, 38], [136, 33]],
  // Indonesia
  [[95, 5], [105, -6], [120, -9], [140, -8], [150, -10], [140, -3], [118, 3], [105, 2]],
  // Australia
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -27], [150, -37], [144, -39], [138, -35], [132, -32], [124, -34], [115, -34], [113, -26]],
];

const inPoly = (x: number, y: number, poly: LL[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

const DOTS: LL[] = (() => {
  const out: LL[] = [];
  for (let lat = -56; lat <= 80; lat += 2) for (let lon = -170; lon <= 180; lon += 2) if (LAND.some((p) => inPoly(lon, lat, p))) out.push([lon, lat]);
  return out;
})();

export const PLACES = {
  canada: [-100, 57] as LL,
  india: [75.8, 26.9] as LL,
  korea: [127, 36.5] as LL,
  montenegro: [19.3, 42.4] as LL,
  london: [-0.1, 51.5] as LL,
  newyork: [-74, 40.7] as LL,
  sofia: [23.3, 42.7] as LL,
  athens: [23.7, 38] as LL,
  dubai: [55.3, 25.2] as LL,
};

export type MapPin = { at: LL; label?: string; color?: string; t: number };
export type MapArc = { from: LL; to: LL; color?: string; t0: number; t1: number; plane?: boolean };

/**
 * Dotted world map. `view` = [lonW, latN, lonE, latS] window. Pins pop at frame `t`,
 * arcs draw between t0 and t1 (optionally with a plane riding the arc).
 */
export const DotMap: React.FC<{ w: number; h: number; view: [number, number, number, number]; pins?: MapPin[]; arcs?: MapArc[]; dotColor?: string; question?: { at: LL; t: number }[] }> = ({
  w,
  h,
  view,
  pins = [],
  arcs = [],
  dotColor = "#2C3B4A",
  question = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [lw, ln, le, ls] = view;
  const X = (lon: number) => ((lon - lw) / (le - lw)) * w;
  const Y = (lat: number) => ((ln - lat) / (ln - ls)) * h;
  const r = Math.max(2.5, Math.min(9, (w / ((le - lw) / 2)) * 0.32));
  const dots = useMemo(() => DOTS.filter(([lo, la]) => lo >= lw - 2 && lo <= le + 2 && la <= ln + 2 && la >= ls - 2), [lw, ln, le, ls]);
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {dots.map(([lo, la], i) => (
        <circle key={i} cx={X(lo)} cy={Y(la)} r={r} fill={dotColor} />
      ))}
      {arcs.map((a, i) => {
        const p = easeInOut((frame - a.t0) / Math.max(1, a.t1 - a.t0));
        if (frame < a.t0) return null;
        const x0 = X(a.from[0]);
        const y0 = Y(a.from[1]);
        const x1 = X(a.to[0]);
        const y1 = Y(a.to[1]);
        const mx = (x0 + x1) / 2;
        const my = Math.min(y0, y1) - Math.abs(x1 - x0) * 0.35 - 40;
        const pt = (t: number) => ({ x: (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1, y: (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * my + t * t * y1 });
        const N = 40;
        const pts = new Array(Math.max(2, Math.round(N * p) + 1)).fill(0).map((_, k, arr) => pt((k / (arr.length - 1)) * p));
        const d = pts.map((q, k) => `${k ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ");
        const head = pt(p);
        const prev = pt(Math.max(0, p - 0.02));
        const ang = (Math.atan2(head.y - prev.y, head.x - prev.x) * 180) / Math.PI;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={a.color ?? GOLD} strokeWidth={6} strokeDasharray="14 12" strokeLinecap="round" />
            {a.plane ? (
              <g transform={`translate(${head.x} ${head.y}) rotate(${ang})`}>
                <PlaneShape size={70} color="#FFFFFF" />
              </g>
            ) : null}
          </g>
        );
      })}
      {pins.map((p, i) => {
        if (frame < p.t) return null;
        const s = sp(frame, fps, p.t, springs.pop);
        const x = X(p.at[0]);
        const y = Y(p.at[1]);
        const ring = ((frame - p.t) % 40) / 40;
        const col = p.color ?? colors.red;
        return (
          <g key={`p${i}`}>
            <circle cx={x} cy={y} r={20 + ring * 60} fill="none" stroke={col} strokeWidth={4} opacity={1 - ring} />
            <g transform={`translate(${x} ${y}) scale(${s})`}>
              <path d="M0 0 C-10 -22 -26 -32 -26 -50 A26 26 0 1 1 26 -50 C26 -32 10 -22 0 0 Z" fill={col} stroke="#fff" strokeWidth={4} />
              <circle cx={0} cy={-50} r={10} fill="#fff" />
            </g>
          </g>
        );
      })}
      {question.map((q, i) => {
        if (frame < q.t) return null;
        const s = sp(frame, fps, q.t, springs.pop);
        const blink = 0.55 + 0.45 * Math.sin((frame - q.t) / 5 + i);
        return (
          <text key={`q${i}`} x={X(q.at[0])} y={Y(q.at[1])} textAnchor="middle" fontFamily={fonts.display} fontSize={86 * s} fill={colors.red} opacity={blink} style={{ filter: `drop-shadow(0 0 10px ${colors.red})` }}>
            ?
          </text>
        );
      })}
    </svg>
  );
};

/** Plane silhouette pointing right, centred on 0,0. */
export const PlaneShape: React.FC<{ size: number; color?: string }> = ({ size, color = "#fff" }) => {
  const s = size / 100;
  return (
    <g transform={`scale(${s})`}>
      <path d="M-50 -6 L30 -6 C44 -6 52 -2 52 0 C52 2 44 6 30 6 L-50 6 Z" fill={color} />
      <path d="M-4 -6 L-24 -46 L-12 -46 L18 -6 Z" fill={color} />
      <path d="M-4 6 L-24 46 L-12 46 L18 6 Z" fill={color} />
      <path d="M-46 -6 L-56 -24 L-48 -24 L-34 -6 Z" fill={color} />
      <path d="M-46 6 L-56 24 L-48 24 L-34 6 Z" fill={color} />
    </g>
  );
};

/* ------------------------------------------------------------------ heart monitor */

/** ECG strip. Beats until `flatAt`, then flatlines; optional single blip at `blipAt`. */
export const Ecg: React.FC<{ w: number; h: number; flatAt: number; blipAt?: number; color?: string }> = ({ w, h, flatAt, blipAt, color = MINT }) => {
  const frame = useCurrentFrame();
  const speed = 9;
  const head = (frame * speed) % w;
  const N = 140;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * w;
    // the frame at which the scan head drew this x
    const age = (head - x + w) % w;
    const fDrawn = frame - age / speed;
    const phase = ((fDrawn % 26) + 26) % 26;
    let y = 0;
    const alive = fDrawn < flatAt || (blipAt !== undefined && fDrawn >= blipAt && fDrawn < blipAt + 8);
    if (alive) {
      if (blipAt !== undefined && fDrawn >= blipAt) {
        const q = fDrawn - blipAt;
        y = q < 2 ? -0.15 : q < 4 ? 0.85 : q < 6 ? -0.4 : 0;
      } else y = phase < 2 ? -0.15 : phase < 4 ? 0.85 : phase < 6 ? -0.4 : phase < 10 ? 0.12 : 0;
    }
    pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${(h / 2 - y * h * 0.42).toFixed(1)}`);
  }
  const gap = 46;
  return (
    <svg width={w} height={h}>
      {new Array(Math.floor(w / 60)).fill(0).map((_, i) => (
        <line key={i} x1={i * 60} x2={i * 60} y1={0} y2={h} stroke={`${color}18`} strokeWidth={2} />
      ))}
      {new Array(Math.floor(h / 60)).fill(0).map((_, i) => (
        <line key={`h${i}`} x1={0} x2={w} y1={i * 60} y2={i * 60} stroke={`${color}18`} strokeWidth={2} />
      ))}
      <path d={pts.join(" ")} fill="none" stroke={color} strokeWidth={7} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      <rect x={head} y={0} width={gap} height={h} fill="#05080A" />
      <circle cx={head} cy={h / 2} r={9} fill="#fff" />
    </svg>
  );
};

/* ------------------------------------------------------------------ fireworks + crowd */

/** One firework burst at (x, y), starting at frame `at`. */
export const Burst: React.FC<{ x: number; y: number; at: number; color: string; r?: number; n?: number; sound?: boolean }> = ({ x, y, at, color, r = 230, n = 26, sound = false }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / 34;
  if (t < 0 || t > 1.2) return sound ? <Sfx name="firework" at={at - 16} volume={0.5} /> : null;
  const e = easeOut(t);
  return (
    <>
      {sound ? <Sfx name="firework" at={at - 16} volume={0.5} /> : null}
      <svg style={{ position: "absolute", left: x - r * 1.3, top: y - r * 1.3, overflow: "visible" }} width={r * 2.6} height={r * 2.6}>
        {new Array(n).fill(0).map((_, i) => {
          const a = (i / n) * Math.PI * 2 + random(`fw-${at}-${i}`) * 0.2;
          const rr = r * (0.75 + 0.25 * random(`fr-${at}-${i}`)) * e;
          const cx = r * 1.3 + Math.cos(a) * rr;
          const cy = r * 1.3 + Math.sin(a) * rr + t * t * 70;
          const tx = r * 1.3 + Math.cos(a) * rr * 0.72;
          const ty = r * 1.3 + Math.sin(a) * rr * 0.72 + t * t * 60;
          const o = 1 - clamp01((t - 0.5) / 0.7);
          return (
            <g key={i} opacity={o}>
              <line x1={tx} y1={ty} x2={cx} y2={cy} stroke={color} strokeWidth={6} strokeLinecap="round" />
              <circle cx={cx} cy={cy} r={7} fill="#fff" />
            </g>
          );
        })}
        {t < 0.25 ? <circle cx={r * 1.3} cy={r * 1.3} r={r * 0.5 * (1 - t * 4)} fill="#fff" opacity={0.8} /> : null}
      </svg>
    </>
  );
};

/** Rows of crowd silhouettes with phone lights, `w` wide, standing on their bottom edge. */
export const Crowd: React.FC<{ w: number; rows?: number; color?: string; lights?: boolean; cheer?: number }> = ({ w, rows = 3, color = "#0B0710", lights = true, cheer = 0 }) => {
  const frame = useCurrentFrame();
  const per = Math.round(w / 70);
  const H = rows * 70 + 120;
  return (
    <svg width={w} height={H} style={{ overflow: "visible" }}>
      {new Array(rows).fill(0).map((_, r) => {
        const yb = 120 + r * 70;
        const shade = r === rows - 1 ? color : `rgba(20,10,22,${0.6 + r * 0.15})`;
        return (
          <g key={r}>
            {new Array(per + 1).fill(0).map((_, i) => {
              const x = i * 70 + (r % 2) * 35 + (random(`cx-${r}-${i}`) - 0.5) * 20;
              const jump = Math.max(0, Math.sin(frame / 4 + i * 1.7 + r)) * 10 * cheer;
              const yy = yb - jump;
              const hasLight = lights && random(`cl-${r}-${i}`) > 0.55;
              return (
                <g key={i}>
                  {hasLight ? (
                    <g>
                      <line x1={x + 22} y1={yy - 30} x2={x + 30} y2={yy - 92} stroke={shade} strokeWidth={14} strokeLinecap="round" />
                      <rect x={x + 22} y={yy - 122} width={18} height={30} rx={4} fill="#FFF6D6" opacity={0.6 + 0.4 * Math.sin(frame / 6 + i)} />
                      <circle cx={x + 31} cy={yy - 107} r={26} fill="#FFF6D6" opacity={0.12} />
                    </g>
                  ) : null}
                  <circle cx={x} cy={yy - 52} r={26} fill={shade} />
                  <rect x={x - 34} y={yy - 30} width={68} height={120} rx={30} fill={shade} />
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ pixel disintegration */

/**
 * Breaks `render()` (a w x h drawing) into square tiles that sweep away left to right,
 * flying up and outwards and turning gold, starting at frame `at`.
 */
export const Disintegrate: React.FC<{ w: number; h: number; at: number; cols?: number; rows?: number; dur?: number; render: () => React.ReactNode; tint?: string; seed?: string }> = ({
  w,
  h,
  at,
  cols = 12,
  rows = 22,
  dur = 30,
  render,
  tint = GOLD,
  seed = "dis",
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return <div style={{ width: w, height: h, position: "relative" }}>{render()}</div>;
  const tw = Math.ceil(w / cols);
  const th = Math.ceil(h / rows);
  const tiles: React.ReactNode[] = [];
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const r1 = random(`${seed}-a-${i}-${j}`);
      const r2 = random(`${seed}-b-${i}-${j}`);
      const r3 = random(`${seed}-c-${i}-${j}`);
      const delay = (i / cols) * dur * 0.45 + (1 - j / rows) * dur * 0.15 + r1 * dur * 0.25;
      const p = clamp01((frame - at - delay) / (dur * 0.7));
      if (p >= 1) continue;
      const e = p * p;
      const dx = e * (140 + r2 * 360) * (0.6 + i / cols);
      const dy = -e * (120 + r3 * 380) + Math.sin(p * 6 + r1 * 6) * 10 * p;
      const rot = e * (r1 - 0.5) * 360;
      const sc = 1 - 0.55 * p;
      tiles.push(
        <div
          key={`${i}-${j}`}
          style={{
            position: "absolute",
            left: i * tw,
            top: j * th,
            width: tw + 1,
            height: th + 1,
            overflow: "hidden",
            transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${sc})`,
            opacity: 1 - p * p,
          }}
        >
          <div style={{ position: "absolute", left: -i * tw, top: -j * th, width: w, height: h }}>{render()}</div>
          {p > 0 ? <div style={{ position: "absolute", inset: 0, background: tint, opacity: Math.min(0.85, p * 2.2), mixBlendMode: "screen" }} /> : null}
        </div>,
      );
    }
  return <div style={{ width: w, height: h, position: "relative" }}>{tiles}</div>;
};

/* ------------------------------------------------------------------ vault */

/** Round vault door. `open` 0..1 swings it open (to the right), revealing `inside`. */
export const Vault: React.FC<{ size: number; open: number; inside?: React.ReactNode; spin?: number }> = ({ size, open, inside, spin = 0 }) => {
  const s = size;
  return (
    <div style={{ width: s, height: s, position: "relative", perspective: 1400 }}>
      <div style={{ position: "absolute", inset: -s * 0.06, borderRadius: "50%", background: "linear-gradient(145deg, #59636E, #1E252C)", boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }} />
      <div style={{ position: "absolute", inset: s * 0.02, borderRadius: "50%", background: "#07090B", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{inside}</div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          transformOrigin: "100% 50%",
          transform: `rotateY(${-open * 105}deg)`,
          background: "radial-gradient(circle at 40% 35%, #B9C3CC, #76818C 45%, #3B444D 100%)",
          border: `${s * 0.03}px solid #2A3138`,
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        <svg width={s} height={s} viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, transform: `rotate(${spin}deg)` }}>
          <circle cx={100} cy={100} r={70} fill="none" stroke="#545E68" strokeWidth={6} />
          <circle cx={100} cy={100} r={22} fill="#C9D2DA" stroke="#454E57" strokeWidth={6} />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <g key={a} transform={`rotate(${a} 100 100)`}>
              <rect x={96} y={34} width={8} height={46} rx={4} fill="#C9D2DA" stroke="#454E57" strokeWidth={3} />
              <circle cx={100} cy={32} r={9} fill="#C9D2DA" stroke="#454E57" strokeWidth={3} />
            </g>
          ))}
        </svg>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
          const a = (k / 8) * Math.PI * 2;
          return <div key={k} style={{ position: "absolute", left: s / 2 + Math.cos(a) * s * 0.45 - s * 0.02, top: s / 2 + Math.sin(a) * s * 0.45 - s * 0.02, width: s * 0.04, height: s * 0.04, borderRadius: "50%", background: "#2A3138" }} />;
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ assorted props */

/** Prison bars that drop in at `at`. */
export const Bars: React.FC<{ w: number; h: number; at: number; n?: number }> = ({ w, h, at, n = 7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, pointerEvents: "none" }}>
      {new Array(n).fill(0).map((_, i) => {
        const d = sp(frame, fps, at + i * 1.5, springs.slam);
        return (
          <div
            key={i}
            style={{ position: "absolute", left: ((i + 0.5) / n) * w - 14, top: 0, width: 28, height: h, borderRadius: 14, background: "linear-gradient(90deg, #5E6872, #C9D2DA 40%, #6E7882)", transform: `translateY(${(1 - d) * -h}px)`, boxShadow: "6px 0 14px rgba(0,0,0,0.5)" }}
          />
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.12, height: 26, borderRadius: 13, background: "linear-gradient(180deg, #C9D2DA, #5E6872)", opacity: clamp01((frame - at - 8) / 4) }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: h * 0.12, height: 26, borderRadius: 13, background: "linear-gradient(180deg, #C9D2DA, #5E6872)", opacity: clamp01((frame - at - 8) / 4) }} />
    </div>
  );
};

/** Tear-off calendar page. */
export const CalendarPage: React.FC<{ month: string; day: string; w?: number; color?: string }> = ({ month, day, w = 300, color = colors.red }) => (
  <div style={{ width: w, borderRadius: w * 0.07, background: "#F4F1EA", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.6)", textAlign: "center" }}>
    <div style={{ background: color, padding: `${w * 0.04}px 0`, ...big(w * 0.2, "#fff"), textShadow: "none" }}>{month}</div>
    <div style={{ ...big(w * 0.55, "#14181D"), textShadow: "none", padding: `${w * 0.06}px 0 ${w * 0.03}px` }}>{day}</div>
  </div>
);

/** Money bag with a $ (optionally with flapping wings). */
export const MoneyBag: React.FC<{ size: number; wings?: boolean }> = ({ size, wings = false }) => {
  const frame = useCurrentFrame();
  const flap = Math.sin(frame / 2.2) * 30;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
      {wings ? (
        <>
          <path d="M60 90 C10 60 -20 80 -10 110 C20 100 40 110 62 112 Z" fill="#F4F1EA" transform={`rotate(${flap} 62 100)`} />
          <path d="M140 90 C190 60 220 80 210 110 C180 100 160 110 138 112 Z" fill="#F4F1EA" transform={`rotate(${-flap} 138 100)`} />
        </>
      ) : null}
      <path d="M78 52 L122 52 L112 70 L88 70 Z" fill="#B88A3C" />
      <path d="M88 70 C40 90 30 180 100 186 C170 180 160 90 112 70 Z" fill="#D9A84E" stroke="#8C6420" strokeWidth={5} />
      <rect x={84} y={64} width={32} height={10} rx={4} fill="#8C6420" />
      <text x={100} y={150} textAnchor="middle" fontFamily={fonts.display} fontSize={78} fill="#5E4210">
        $
      </text>
    </svg>
  );
};

/** A stack of bills. */
export const Cash: React.FC<{ w: number; layers?: number }> = ({ w, layers = 6 }) => (
  <div style={{ position: "relative", width: w, height: w * 0.45 + layers * 8 }}>
    {new Array(layers).fill(0).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 0,
          bottom: i * 8,
          width: w,
          height: w * 0.45,
          borderRadius: 8,
          background: "linear-gradient(135deg, #8FD19E, #3E8F57)",
          border: "4px solid #2C6B3F",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...big(w * 0.26, "#1F4D2D"),
          textShadow: "none",
        }}
      >
        $
      </div>
    ))}
  </div>
);

/** Falling bills/coins rain across a w x h box. */
export const MoneyRain: React.FC<{ w: number; h: number; from: number; n?: number; coins?: boolean; speed?: number }> = ({ w, h, from, n = 26, coins = false, speed = 1 }) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, overflow: "hidden", pointerEvents: "none" }}>
      {new Array(n).fill(0).map((_, i) => {
        const r = random(`mr-${i}`);
        const y = ((frame - from) * (6 + r * 6) * speed + random(`my-${i}`) * h) % (h + 200) - 150;
        const x = random(`mx-${i}`) * w + Math.sin((frame + i * 20) / 14) * 30;
        const rot = (frame * (2 + r * 4) + i * 40) % 360;
        return coins ? (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 60, height: 60, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #FFF3C4, ${GOLD} 50%, #B07A00)`, transform: `rotateY(${rot}deg)`, opacity: 0.85 }} />
        ) : (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 110, height: 52, borderRadius: 6, background: "linear-gradient(135deg, #9EDBAA, #4C9C63)", border: "3px solid #2C6B3F", transform: `rotate(${rot}deg) rotateX(${rot * 1.4}deg)`, opacity: 0.85 }} />
        );
      })}
    </div>
  );
};

/** Big red rubber "WANTED" stamp with an amount underneath. */
export const WantedStamp: React.FC<{ at: number; amount?: string; size?: number; sound?: boolean }> = ({ at, amount = "$5,000,000", size = 1, sound = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = sp(frame, fps, at, springs.slam);
  return (
    <div style={{ transform: `rotate(-7deg) scale(${lerp(3.2, 1, s)})`, opacity: clamp01((frame - at) / 2), transformOrigin: "50% 50%" }}>
      {sound ? (
        <>
          <Sfx name="stamp" at={at} volume={1} />
          <Sfx name="slam" at={at} volume={0.8} />
        </>
      ) : null}
      <div
        style={{
          display: "inline-block",
          padding: `${14 * size}px ${44 * size}px ${20 * size}px`,
          border: `${14 * size}px solid ${colors.red}`,
          outline: `${4 * size}px solid ${colors.red}`,
          outlineOffset: 8 * size,
          borderRadius: 18 * size,
          background: "rgba(20,4,6,0.78)",
          textAlign: "center",
          boxShadow: `0 0 ${80 * size}px ${colors.red}88`,
        }}
      >
        <div style={{ ...big(190 * size, colors.red), letterSpacing: "0.06em", textShadow: `0 0 ${30 * size}px ${colors.red}AA` }}>WANTED</div>
        <div style={{ height: 6 * size, background: colors.red, margin: `${6 * size}px 0 ${12 * size}px` }} />
        <div style={{ ...big(112 * size, "#FFFFFF"), textShadow: `0 0 ${24 * size}px ${colors.red}` }}>{amount}</div>
      </div>
    </div>
  );
};

/** Hairline crack overlay (glass), grows from (x, y). */
export const Cracks: React.FC<{ x: number; y: number; at: number; w: number; h: number; seed?: string; color?: string }> = ({ x, y, at, w, h, seed = "ck", color = "rgba(255,255,255,0.85)" }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = easeOut((frame - at) / 6);
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * Math.PI * 2 + random(`${seed}-a${i}`) * 0.4;
    let px = x;
    let py = y;
    const segs: string[] = [`M${px} ${py}`];
    for (let k = 0; k < 4; k++) {
      const len = (60 + random(`${seed}-l${i}-${k}`) * 140) * p;
      const aa = a + (random(`${seed}-t${i}-${k}`) - 0.5) * 0.7;
      px += Math.cos(aa) * len;
      py += Math.sin(aa) * len;
      segs.push(`L${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    lines.push(<path key={i} d={segs.join(" ")} stroke={color} strokeWidth={4} fill="none" />);
  }
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {lines}
      <circle cx={x} cy={y} r={18 * p} fill="none" stroke={color} strokeWidth={4} />
    </svg>
  );
};

/** Browser window frame. */
export const Browser: React.FC<{ w: number; url: string; color?: string; children?: React.ReactNode }> = ({ w, url, color = "#2E3944", children }) => (
  <div style={{ width: w, borderRadius: 20, background: "#0E141B", border: `5px solid ${color}`, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
    <div style={{ height: 58, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: "#18212B" }}>
      {[colors.red, colors.amber, colors.green].map((cc) => (
        <div key={cc} style={{ width: 14, height: 14, borderRadius: 14, background: cc }} />
      ))}
      <div style={{ marginLeft: 14, flex: 1, height: 34, borderRadius: 17, background: "#0B1015", display: "flex", alignItems: "center", padding: "0 16px", fontFamily: fonts.mono, fontSize: 22, color: colors.dim }}>{url}</div>
    </div>
    <div>{children}</div>
  </div>
);

/** Court/government building with columns. */
export const Columns: React.FC<{ w: number; label?: string; color?: string }> = ({ w, label, color = "#D9DEE3" }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 500 360">
    <polygon points="250,10 490,90 10,90" fill={color} />
    <polygon points="250,34 440,84 60,84" fill="#AEB6BF" />
    <rect x={20} y={90} width={460} height={24} fill={color} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={46 + i * 76} y={122} width={34} height={196} fill={color} />
    ))}
    <rect x={10} y={318} width={480} height={20} fill={color} />
    <rect x={0} y={338} width={500} height={22} fill="#AEB6BF" />
    {label ? (
      <text x={250} y={108} textAnchor="middle" fontFamily={fonts.mono} fontWeight={700} fontSize={18} fill="#4B545E" letterSpacing={4}>
        {label}
      </text>
    ) : null}
  </svg>
);

/** Little house icon. */
export const House: React.FC<{ size: number; color?: string; window?: string }> = ({ size, color = "#D9DEE3", window = colors.amber }) => (
  <svg width={size} height={size} viewBox="0 0 140 130">
    <polygon points="70,8 132,58 8,58" fill={color} />
    <rect x={22} y={58} width={96} height={66} fill={color} />
    <rect x={60} y={86} width={22} height={38} fill="#3A4652" />
    <rect x={32} y={70} width={20} height={18} fill={window} />
    <rect x={90} y={70} width={20} height={18} fill={window} />
  </svg>
);

/** Night graveyard tombstone. */
export const Tomb: React.FC<{ w: number; text: string[] }> = ({ w, text }) => (
  <svg width={w} height={w * 1.2} viewBox="0 0 200 240">
    <path d="M30 240 L30 90 C30 30 170 30 170 90 L170 240 Z" fill="#6E7782" stroke="#3B434C" strokeWidth={6} />
    <path d="M44 240 L44 96 C44 50 156 50 156 96 L156 240 Z" fill="#7E8893" />
    {text.map((t, i) => (
      <text key={i} x={100} y={110 + i * 30} textAnchor="middle" fontFamily={fonts.display} fontSize={i === 0 ? 30 : 24} fill="#3B434C">
        {t}
      </text>
    ))}
  </svg>
);

/** Full-frame shake wrapper triggered at several frames. */
export const ShakeAt: React.FC<{ hits: number[]; amount?: number; children: React.ReactNode }> = ({ hits, amount = 34, children }) => {
  const frame = useCurrentFrame();
  let k = 0;
  for (const h of hits) if (frame >= h) k = Math.max(k, Math.exp(-(frame - h) / 4.5));
  const dx = (random(`shx-${frame}`) - 0.5) * amount * k;
  const dy = (random(`shy-${frame}`) - 0.5) * amount * k;
  return <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) rotate(${(random(`shr-${frame}`) - 0.5) * k * 1.5}deg)` }}>{children}</AbsoluteFill>;
};
