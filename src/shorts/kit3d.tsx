import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp, type Word } from "../lib/timing";
import { Sfx } from "../components";

/*
 * Shared pieces for the fake-3D Shorts (same look as Short-Lapsus-1):
 * CSS 3D stage + spring camera, boxes, billboards, pop tags and big captions.
 */

export const SHORT_W = 1080;
export const SHORT_H = 1920;

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const big = (size: number, color: string): React.CSSProperties => ({
  fontFamily: fonts.display,
  fontSize: size,
  lineHeight: 0.88,
  color,
  letterSpacing: "0.01em",
  whiteSpace: "nowrap",
  textShadow: `0 ${size * 0.04}px 0 rgba(0,0,0,0.8), 0 0 ${size * 0.25}px ${color}55`,
});

export const Between: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  return <>{children}</>;
};

/* ------------------------------------------------------------------ captions */

type Chunk = { words: Word[]; start: number; end: number };

const chunkWords = (words: Word[], maxWords: number, maxChars: number): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) chunks.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  words.forEach((w, i) => {
    const len = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    if (cur.length >= maxWords || (cur.length > 0 && len > maxChars)) flush();
    cur.push(w);
    const next = words[i + 1];
    if (/[.!?…,]["”]?$/.test(w.text) || (next ? next.start - w.end > 0.35 : true)) flush();
  });
  flush();
  return chunks;
};

/** Big centred captions, a few words at a time; `hot` words light up red. */
export const ShortCaptions: React.FC<{ words: Word[]; enabled: boolean; hide: [number, number][]; centerY: number; hot?: string[] }> = ({
  words,
  enabled,
  hide,
  centerY,
  hot = [],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => chunkWords(words, 3, 15), [words]);
  if (!enabled || hide.some(([a, b]) => frame >= a && frame < b)) return null;
  const t = frame / fps;
  let idx = -1;
  for (let i = 0; i < chunks.length; i++) if (t >= chunks[i].start - 0.03) idx = i;
  if (idx < 0) return null;
  const chunk = chunks[idx];
  if (t > chunk.end + 0.45) return null;
  const enter = sp(frame, fps, Math.round((chunk.start - 0.03) * fps), springs.pop);
  const tilt = idx % 2 === 0 ? -2 : 2;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 50,
          right: 50,
          top: centerY - 80,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: 30,
          transform: `scale(${0.72 + 0.28 * enter}) rotate(${tilt * (1 - enter)}deg)`,
        }}
      >
        {chunk.words.map((w, i) => {
          const next = chunk.words[i + 1];
          const active = t >= w.start && (next ? t < next.start : true);
          const spoken = t >= w.start - 0.03;
          const clean = w.text.replace(/["“”]/g, "");
          const isHot = hot.includes(clean.toLowerCase().replace(/[^a-z0-9$]/g, ""));
          return (
            <span
              key={i}
              style={{
                fontFamily: fonts.sans,
                fontWeight: 800,
                fontSize: 104,
                lineHeight: 1.05,
                textTransform: "uppercase",
                color: active ? (isHot ? colors.red : colors.amber) : "#FFFFFF",
                opacity: spoken ? 1 : 0.35,
                WebkitTextStroke: "14px #000",
                paintOrder: "stroke fill",
                textShadow: "0 10px 0 rgba(0,0,0,0.7)",
                transform: `scale(${active ? 1.06 : 1})`,
                display: "inline-block",
              }}
            >
              {clean}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 3D */

export type V3 = { x: number; y: number; z: number };
export type Cam = { tx: number; ty: number; tz: number; rx: number; ry: number; dist: number };
export type CamKey = Cam & { at: number };

/** A flat face in the 3D world, centred on its own middle. */
export const Plane: React.FC<{ w: number; h: number; t: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, t, style, children }) => (
  <div style={{ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, transform: t, ...style }}>{children}</div>
);

/** Solid box standing on y = `y0` (floor is 0, up is negative y). */
export const Box: React.FC<{
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  y0?: number;
  top: string;
  front: string;
  side: string;
  topChildren?: React.ReactNode;
  frontChildren?: React.ReactNode;
}> = ({ x, z, w, d, h, y0 = 0, top, front, side, topChildren, frontChildren }) => (
  <>
    <Plane w={w} h={d} t={`translate3d(${x}px, ${y0 - h}px, ${z}px) rotateX(90deg)`} style={{ background: top, borderRadius: 6 }}>
      {topChildren}
    </Plane>
    <Plane w={w} h={h} t={`translate3d(${x}px, ${y0 - h / 2}px, ${z + d / 2}px)`} style={{ background: front, overflow: "hidden" }}>
      {frontChildren}
    </Plane>
    <Plane w={d} h={h} t={`translate3d(${x + w / 2}px, ${y0 - h / 2}px, ${z}px) rotateY(90deg)`} style={{ background: side }} />
    <Plane w={d} h={h} t={`translate3d(${x - w / 2}px, ${y0 - h / 2}px, ${z}px) rotateY(-90deg)`} style={{ background: side }} />
  </>
);

/** Something flat that always faces the camera, standing on `pos` (its bottom centre). */
export const Billboard: React.FC<{ pos: V3; cam: Cam; w: number; h: number; children: React.ReactNode }> = ({ pos, cam, w, h, children }) => (
  <div
    style={{
      position: "absolute",
      left: -w / 2,
      top: -h,
      width: w,
      height: h,
      transformOrigin: "50% 100%",
      transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px) rotateY(${-cam.ry}deg) rotateX(${-cam.rx}deg)`,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);

const camSpring = { damping: 26, stiffness: 46, mass: 1 };

/** Blends camera keyframes with springs, so every move eases in and settles. */
export const useCam = (keys: CamKey[]): Cam => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let cam: Cam = { ...keys[0] };
  for (let i = 1; i < keys.length; i++) {
    const p = sp(frame, fps, keys[i].at, camSpring);
    if (p <= 0) continue;
    cam = {
      tx: lerp(cam.tx, keys[i].tx, p),
      ty: lerp(cam.ty, keys[i].ty, p),
      tz: lerp(cam.tz, keys[i].tz, p),
      rx: lerp(cam.rx, keys[i].rx, p),
      ry: lerp(cam.ry, keys[i].ry, p),
      dist: lerp(cam.dist, keys[i].dist, p),
    };
  }
  return cam;
};

/** Perspective root + camera. Children are placed in world coordinates. */
export const Stage3D: React.FC<{ cam: Cam; cx?: number; cy?: number; perspective?: number; children: React.ReactNode }> = ({
  cam,
  cx = SHORT_W / 2,
  cy = 880,
  perspective = 1500,
  children,
}) => (
  <div style={{ position: "absolute", left: cx, top: cy, width: 0, height: 0, perspective }}>
    <div
      style={{
        position: "absolute",
        transformStyle: "preserve-3d",
        transform: `translateZ(${cam.dist}px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) translate3d(${-cam.tx}px, ${-cam.ty}px, ${-cam.tz}px)`,
      }}
    >
      {children}
    </div>
  </div>
);

/** Label that pops up with a pointer underneath. */
export const Tag: React.FC<{ at: number; until?: number; text: string; color?: string; size?: number; filled?: boolean; sound?: boolean }> = ({
  at,
  until = 99999,
  text,
  color = colors.amber,
  size = 44,
  filled = false,
  sound = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame >= until + 8) return null;
  const s = sp(frame, fps, at, springs.pop);
  const out = frame >= until ? (frame - until) / 8 : 0;
  return (
    <div style={{ transform: `scale(${s * (1 - out)})`, transformOrigin: "50% 100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {sound ? <Sfx name="pop" at={at} volume={0.7} /> : null}
      <div
        style={{
          padding: `${size * 0.22}px ${size * 0.5}px`,
          borderRadius: size * 0.2,
          border: `${size * 0.09}px solid ${color}`,
          background: filled ? color : "rgba(7,9,11,0.92)",
          color: filled ? colors.bg : color,
          fontFamily: fonts.mono,
          fontWeight: 700,
          fontSize: size,
          letterSpacing: "0.06em",
          whiteSpace: "nowrap",
          boxShadow: `0 0 ${size}px ${color}55, 0 12px 30px rgba(0,0,0,0.6)`,
        }}
      >
        {text}
      </div>
      <div style={{ width: 0, height: 0, borderLeft: `${size * 0.3}px solid transparent`, borderRight: `${size * 0.3}px solid transparent`, borderTop: `${size * 0.36}px solid ${color}` }} />
    </div>
  );
};

/** Pops its children in with a spring (outside 3D). */
export const Pop2: React.FC<{ at: number; style?: React.CSSProperties; children: React.ReactNode; sound?: boolean; until?: number }> = ({
  at,
  style,
  children,
  sound = true,
  until = 99999,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame >= until + 8) return null;
  const s = sp(frame, fps, at, springs.pop);
  const out = frame >= until ? clamp01((frame - until) / 8) : 0;
  return (
    <div style={{ position: "absolute", ...style, transform: `scale(${s * (1 - out)})` }}>
      {sound ? <Sfx name="pop" at={at} volume={0.7} /> : null}
      {children}
    </div>
  );
};
