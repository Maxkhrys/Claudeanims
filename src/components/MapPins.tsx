import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Sfx } from "./Sfx";

type LonLat = [number, number];

// Rough continent outlines (lon, lat). Deliberately coarse: the map is drawn as a dot grid.
const LAND: LonLat[][] = [
  [[-165, 65], [-140, 70], [-95, 72], [-65, 60], [-55, 50], [-75, 40], [-80, 27], [-97, 18], [-105, 22], [-118, 33], [-125, 48], [-150, 58]],
  [[-97, 18], [-83, 10], [-78, 8], [-88, 16]],
  [[-80, 10], [-62, 10], [-50, 0], [-35, -7], [-40, -22], [-58, -38], [-68, -54], [-75, -45], [-71, -18], [-81, -5]],
  [[-10, 36], [-9, 43], [-1, 49], [5, 53], [8, 57], [5, 61], [15, 69], [30, 70], [40, 66], [40, 48], [28, 41], [22, 37], [12, 38], [3, 43], [-5, 36]],
  [[-6, 50], [1, 51], [0, 57], [-6, 58]],
  [[-17, 15], [-13, 28], [-5, 36], [10, 37], [32, 31], [43, 12], [51, 11], [40, -5], [39, -18], [32, -28], [20, -35], [13, -22], [9, 0], [-8, 5]],
  [[40, 48], [40, 66], [60, 70], [100, 77], [140, 73], [180, 68], [160, 60], [142, 50], [128, 38], [121, 30], [108, 20], [105, 10], [98, 8], [95, 16], [88, 22], [80, 10], [72, 20], [60, 25], [50, 28], [43, 13], [35, 30], [28, 41]],
  [[114, -22], [130, -12], [142, -11], [153, -27], [147, -38], [132, -33], [116, -34]],
  [[-52, 60], [-22, 70], [-30, 82], [-60, 78]],
];

const inside = (p: LonLat, poly: LonLat[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

export type MapPin = {
  lon: number;
  lat: number;
  label?: string;
  at: number;
  color?: string;
  /** which side the label sits on */
  side?: "left" | "right" | "top" | "bottom";
  /** large soft glow, for "this country lights up" moments */
  glow?: boolean;
};

export type MapLine = {
  from: LonLat;
  to: LonLat;
  at: number;
  durationInFrames?: number;
  color?: string;
  /** show a plane flying along the line */
  plane?: boolean;
};

/**
 * Dot-matrix world map with animated pins and arcing lines.
 * `focus` zooms in on a region: { lon, lat, zoom }.
 */
export const MapPins: React.FC<{
  width?: number;
  pins?: MapPin[];
  lines?: MapLine[];
  focus?: { lon: number; lat: number; zoom: number };
  dotColor?: string;
  style?: React.CSSProperties;
}> = ({ width = 1700, pins = [], lines = [], focus, dotColor = colors.greenDim, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const height = width * 0.47;
  const px = (lon: number) => ((lon + 180) / 360) * width;
  const py = (lat: number) => ((84 - lat) / 142) * height;

  const dots = useMemo(() => {
    const out: LonLat[] = [];
    for (let lat = 80; lat >= -56; lat -= 2.6) {
      for (let lon = -178; lon <= 180; lon += 2.6) {
        if (LAND.some((poly) => inside([lon, lat], poly))) out.push([lon, lat]);
      }
    }
    return out;
  }, []);

  const z = focus?.zoom ?? 1;
  const fx = focus ? px(focus.lon) : width / 2;
  const fy = focus ? py(focus.lat) : height / 2;

  return (
    <div style={{ position: "absolute", width, height, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${(width / 2 - fx) * (z - 1 > 0 ? 1 : 0)}px, ${(height / 2 - fy) * (z - 1 > 0 ? 1 : 0)}px) scale(${z})`,
          transformOrigin: `${fx}px ${fy}px`,
        }}
      >
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {dots.map(([lon, lat], i) => (
            <circle key={i} cx={px(lon)} cy={py(lat)} r={width / 520} fill={dotColor} opacity={0.75} />
          ))}
          {lines.map((l, i) => {
            if (frame < l.at) return null;
            const p = sp(frame, fps, l.at, springs.smooth, l.durationInFrames ?? 40);
            const [x1, y1, x2, y2] = [px(l.from[0]), py(l.from[1]), px(l.to[0]), py(l.to[1])];
            const cx = (x1 + x2) / 2;
            const cy = Math.min(y1, y2) - Math.hypot(x2 - x1, y2 - y1) * 0.22;
            const c = l.color ?? colors.amber;
            const t = Math.min(1, p);
            const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
            const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
            const ang = (Math.atan2(2 * (1 - t) * (cy - y1) + 2 * t * (y2 - cy), 2 * (1 - t) * (cx - x1) + 2 * t * (x2 - cx)) * 180) / Math.PI;
            return (
              <g key={i}>
                <path
                  d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                  fill="none"
                  stroke={c}
                  strokeWidth={4 / z}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1 - p}
                  style={{ filter: `drop-shadow(0 0 8px ${c})` }}
                />
                {l.plane && t < 0.995 ? (
                  <path d="M 16 0 L -10 -9 L -5 0 L -10 9 Z" fill={colors.text} transform={`translate(${bx} ${by}) rotate(${ang}) scale(${1.5 / z})`} />
                ) : null}
              </g>
            );
          })}
        </svg>
        {lines.map((l, i) => (l.plane ? <Sfx key={i} name="whoosh" at={l.at} /> : null))}
        {pins.map((p, i) => {
          if (frame < p.at) return null;
          const s = sp(frame, fps, p.at, springs.pop);
          const c = p.color ?? colors.amber;
          const pulse = ((frame - p.at) % 45) / 45;
          const side = p.side ?? "right";
          const off = 26 / z;
          return (
            <div key={i} style={{ position: "absolute", left: px(p.lon), top: py(p.lat), transform: `scale(${1 / z})` }}>
              <Sfx name="pop" at={p.at} volume={0.8} />
              {p.glow ? (
                <div style={{ position: "absolute", left: -110, top: -110, width: 220, height: 220, borderRadius: 110, background: `radial-gradient(circle, ${c}88, ${c}00 70%)`, opacity: 0.6 + 0.3 * Math.sin(frame / 8) }} />
              ) : null}
              <div style={{ position: "absolute", left: -30, top: -30, width: 60, height: 60, borderRadius: 30, border: `3px solid ${c}`, transform: `scale(${0.4 + pulse * 1.4})`, opacity: 1 - pulse }} />
              <div style={{ position: "absolute", left: -11, top: -11, width: 22, height: 22, borderRadius: 11, background: c, boxShadow: `0 0 20px ${c}`, transform: `scale(${s})` }} />
              {p.label ? (
                <div
                  style={{
                    position: "absolute",
                    whiteSpace: "nowrap",
                    left: side === "right" ? off * z : side === "left" ? undefined : -100,
                    right: side === "left" ? off * z : undefined,
                    top: side === "top" ? -64 : side === "bottom" ? 26 : -20,
                    width: side === "top" || side === "bottom" ? 200 : undefined,
                    textAlign: "center",
                    transform: `scale(${s})`,
                    transformOrigin: side === "right" ? "left center" : side === "left" ? "right center" : "center center",
                  }}
                >
                  <span style={{ display: "inline-block", padding: "5px 12px", borderRadius: 6, border: `2px solid ${c}`, background: "rgba(7,9,11,0.88)", color: c, fontFamily: fonts.mono, fontSize: 26, fontWeight: 700, letterSpacing: "0.06em" }}>
                    {p.label}
                  </span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
