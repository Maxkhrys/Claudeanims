import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Easing, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { colors, fonts, springs } from "../theme";
import { sp, type Word } from "../lib/timing";
import {
  AvatarBadge,
  Background,
  BrandTag,
  Cop,
  Flash,
  Glitch,
  GlitchBars,
  OnionLogo,
  SeizedStamp,
  Sfx,
  TitleSlam,
  White,
} from "../components";
import { useClip } from "../video3/words";

/*
 * YouTube Short: Lapsus$ part 1, "The Hotel Room", built natively for 9:16.
 * Uses the existing part 1 narration (clip 1 of video 3, 0 to 41.1s).
 *
 *   intro      headline + TV stick on the first frame
 *   dive       one zoom into a lit hotel window
 *   room       tilted cutaway room (real CSS 3D, flat characters as billboards)
 *   loadout    game-style inventory cards that flip in
 *   studio     3D studio block, the lock breaks, "most anticipated game"
 *   phone      the phone takes over the whole screen, the message types out
 *   outro      the cliffhanger, then an end card pointing to the full video
 *
 * Every element is timed to a spoken word with c("word").
 */

export const shortLapsus1Schema = z.object({ showCaptions: z.boolean() });

export const SHORT_W = 1080;
export const SHORT_H = 1920;
/** narration is 1234 frames; the end card holds a little longer */
export const SHORT_LAPSUS1_FRAMES = 1310;
const AUDIO_END = 1236;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const big = (size: number, color: string): React.CSSProperties => ({
  fontFamily: fonts.display,
  fontSize: size,
  lineHeight: 0.88,
  color,
  letterSpacing: "0.01em",
  whiteSpace: "nowrap",
  textShadow: `0 ${size * 0.04}px 0 rgba(0,0,0,0.8), 0 0 ${size * 0.25}px ${color}55`,
});

/** Shows children between two frames without shifting time. */
const Between: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
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

/** Big centred captions, two or three words at a time, with a thick outline. */
const ShortCaptions: React.FC<{ words: Word[]; enabled: boolean; hide: [number, number][]; centerY: number }> = ({
  words,
  enabled,
  hide,
  centerY,
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
          rowGap: 0,
          transform: `scale(${0.72 + 0.28 * enter}) rotate(${tilt * (1 - enter)}deg)`,
        }}
      >
        {chunk.words.map((w, i) => {
          const next = chunk.words[i + 1];
          const active = t >= w.start && (next ? t < next.start : true);
          const spoken = t >= w.start - 0.03;
          return (
            <span
              key={i}
              style={{
                fontFamily: fonts.sans,
                fontWeight: 800,
                fontSize: 104,
                lineHeight: 1.05,
                textTransform: "uppercase",
                color: active ? colors.amber : "#FFFFFF",
                opacity: spoken ? 1 : 0.35,
                WebkitTextStroke: "14px #000",
                paintOrder: "stroke fill",
                textShadow: "0 10px 0 rgba(0,0,0,0.7)",
                transform: `scale(${active ? 1.06 : 1})`,
                display: "inline-block",
              }}
            >
              {w.text.replace(/["“”]/g, "")}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ props */

/** The streaming stick, drawn flat. `w` is its width. */
const StickArt: React.FC<{ w: number; led?: number; label?: boolean }> = ({ w, led = 1, label = true }) => {
  const h = w * 0.3;
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: h * 0.18,
          background: "linear-gradient(to bottom, #36414D, #151A20)",
          border: `${Math.max(3, w * 0.012)}px solid #56626F`,
        }}
      >
        <div style={{ position: "absolute", left: "6%", right: "6%", top: "10%", height: "16%", borderRadius: 99, background: "rgba(255,255,255,0.12)" }} />
        {label ? (
          <div style={{ position: "absolute", left: w * 0.09, top: h * 0.32, fontFamily: fonts.mono, fontWeight: 700, fontSize: w * 0.085, color: "#8C96A0", letterSpacing: "0.1em" }}>
            TV STICK
          </div>
        ) : null}
        <div
          style={{
            position: "absolute",
            right: w * 0.08,
            top: h * 0.36,
            width: h * 0.26,
            height: h * 0.26,
            borderRadius: 99,
            background: colors.amber,
            opacity: 0.35 + 0.65 * led,
            boxShadow: `0 0 ${w * 0.06 * led}px ${colors.amber}`,
          }}
        />
      </div>
      {/* HDMI plug */}
      <div style={{ position: "absolute", left: -w * 0.13, top: h * 0.28, width: w * 0.14, height: h * 0.44, borderRadius: `${h * 0.06}px 0 0 ${h * 0.06}px`, background: "#9AA4AE", border: `${Math.max(2, w * 0.008)}px solid #5A646E` }} />
    </div>
  );
};

/** A smartphone outline with a lit screen. */
const PhoneArt: React.FC<{ h: number; screen?: string }> = ({ h, screen = "#1E2A36" }) => (
  <div style={{ width: h * 0.5, height: h, borderRadius: h * 0.08, background: "#0B0F13", border: `${h * 0.035}px solid #4A5866`, position: "relative", boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
    <div style={{ position: "absolute", left: "8%", right: "8%", top: "7%", bottom: "9%", borderRadius: h * 0.03, background: screen }} />
    <div style={{ position: "absolute", left: "38%", right: "38%", top: "2.5%", height: "2.5%", borderRadius: 9, background: "#2A343D" }} />
  </div>
);

/** A hotel TV with a little home screen. */
const TvArt: React.FC<{ w: number; on?: number }> = ({ w, on = 1 }) => {
  const h = w * 0.58;
  return (
    <div style={{ width: w, height: h, borderRadius: w * 0.025, background: "#07090B", border: `${w * 0.025}px solid #2C3640`, position: "relative", overflow: "hidden", boxShadow: `0 0 ${w * 0.12 * on}px rgba(57,255,136,0.35)` }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #0E1B18, #0A1210)", opacity: on }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${8 + (i % 3) * 29}%`,
              top: `${22 + Math.floor(i / 3) * 36}%`,
              width: "25%",
              height: "28%",
              borderRadius: w * 0.012,
              background: [colors.greenDim, "#24425A", "#5A3B24", "#3B2A55", "#244A3A", "#4A2430"][i],
              opacity: 0.9,
            }}
          />
        ))}
        <div style={{ position: "absolute", left: "8%", top: "7%", width: "30%", height: "6%", borderRadius: 4, background: "rgba(230,230,230,0.35)" }} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ 3D helpers */

type V3 = { x: number; y: number; z: number };

/** A flat face in the 3D room. Centred on its own middle. */
const Plane: React.FC<{ w: number; h: number; t: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, t, style, children }) => (
  <div style={{ position: "absolute", left: -w / 2, top: -h / 2, width: w, height: h, transform: t, ...style }}>{children}</div>
);

/** Solid box sitting on the floor (y = 0 is the floor, up is negative y). */
const Box: React.FC<{ x: number; z: number; w: number; d: number; h: number; top: string; front: string; side: string; topChildren?: React.ReactNode }> = ({
  x,
  z,
  w,
  d,
  h,
  top,
  front,
  side,
  topChildren,
}) => (
  <>
    <Plane w={w} h={d} t={`translate3d(${x}px, ${-h}px, ${z}px) rotateX(90deg)`} style={{ background: top, borderRadius: 6 }}>
      {topChildren}
    </Plane>
    <Plane w={w} h={h} t={`translate3d(${x}px, ${-h / 2}px, ${z + d / 2}px)`} style={{ background: front }} />
    <Plane w={d} h={h} t={`translate3d(${x + w / 2}px, ${-h / 2}px, ${z}px) rotateY(90deg)`} style={{ background: side }} />
  </>
);

/** Something flat that always faces the camera, standing on `pos` (its bottom centre). */
const Billboard: React.FC<{ pos: V3; cam: Cam; w: number; h: number; children: React.ReactNode }> = ({ pos, cam, w, h, children }) => (
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

type Cam = { tx: number; ty: number; tz: number; rx: number; ry: number; dist: number };
type CamKey = Cam & { at: number };

const camSpring = { damping: 26, stiffness: 46, mass: 1 };

/** Blends camera keyframes with springs, so every move eases in and settles. */
const useCam = (keys: CamKey[]): Cam => {
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
const Stage3D: React.FC<{ cam: Cam; cx?: number; cy?: number; perspective?: number; children: React.ReactNode }> = ({
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

/** Label that pops up over an object in the room. */
const Tag: React.FC<{ at: number; until?: number; text: string; color?: string; size?: number; filled?: boolean }> = ({
  at,
  until = 99999,
  text,
  color = colors.amber,
  size = 44,
  filled = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at || frame >= until + 8) return null;
  const s = sp(frame, fps, at, springs.pop);
  const out = frame >= until ? (frame - until) / 8 : 0;
  return (
    <div style={{ transform: `scale(${s * (1 - out)})`, transformOrigin: "50% 100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Sfx name="pop" at={at} />
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

/* ------------------------------------------------------------------ scenes */

const Intro: React.FC<{ out: number }> = ({ out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = sp(frame, fps, 0, springs.pop);
  const spin = sp(frame, fps, 70, { damping: 30, stiffness: 60 });
  const yaw = -26 + 14 * Math.sin(frame / 16) + spin * 340;
  const head = out;
  const led = 0.5 + 0.5 * Math.sin(frame / 4);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(255,181,71,0.28), rgba(0,0,0,0) 55%)", opacity: 1 - out }} />
      {/* headline: on screen from frame 0 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", transform: `translateY(${-head * 700}px) scale(${1 + 0.1 * (1 - punch)})` }}>
        <div style={big(190, colors.text)}>HE HACKED</div>
        <div style={{ ...big(330, colors.amber), marginTop: 6 }}>GTA 6</div>
        <div style={{ marginTop: 26, display: "inline-block", padding: "10px 28px", borderRadius: 12, background: colors.red, ...big(74, colors.bg), textShadow: "none", transform: "rotate(-2deg)" }}>
          WITH A TV STICK
        </div>
      </div>
      {/* the stick, extruded in 3D, floating */}
      <div style={{ position: "absolute", left: 540, top: 1010, perspective: 1100 }}>
        <div
          style={{
            position: "absolute",
            transformStyle: "preserve-3d",
            transform: `translateY(${12 * Math.sin(frame / 11) + spin * -120}px) rotateX(${16 + 4 * Math.sin(frame / 20)}deg) rotateY(${yaw}deg) rotateZ(-10deg) scale(${1 - 0.85 * spin})`,
          }}
        >
          {[6, 5, 4, 3, 2, 1].map((i) => (
            <div key={i} style={{ position: "absolute", left: -320, top: -96, transform: `translateZ(${-i * 7}px)`, filter: `brightness(${0.35 + i * -0.03})` }}>
              <StickArt w={640} led={0} label={false} />
            </div>
          ))}
          <div style={{ position: "absolute", left: -320, top: -96, transform: "translateZ(0px)" }}>
            <StickArt w={640} led={led} />
          </div>
        </div>
      </div>
      {/* glint */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, height: 380, background: `linear-gradient(100deg, rgba(255,255,255,0) ${((frame * 3) % 160) - 30}%, rgba(255,255,255,0.08) ${((frame * 3) % 160) - 20}%, rgba(255,255,255,0) ${((frame * 3) % 160) - 10}%)`, opacity: 1 - out }} />
    </AbsoluteFill>
  );
};

const WIN = { x: 642, y: 930, w: 92, h: 112 };

/** Night exterior of the hotel; the camera dives into one lit window. */
const Dive: React.FC<{ z: number; tBudget: number; tEngland: number }> = ({ z, tBudget, tEngland }) => {
  const frame = useCurrentFrame();
  const scale = Math.pow(16, z);
  const farScale = 1 + 0.7 * z;
  const labels = clamp01(1 - (z - 0.45) * 3);
  const flick = 0.85 + 0.15 * random(`dw-${Math.floor(frame / 3)}`);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, #050A14 0%, #0C1626 55%, #111C2C 100%)" }} />
      {/* stars + moon */}
      <AbsoluteFill style={{ transform: `scale(${1 + 0.2 * z})`, transformOrigin: `${WIN.x}px ${WIN.y}px` }}>
        {new Array(40).fill(0).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: random(`sx${i}`) * 1080, top: random(`sy${i}`) * 900, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: 0.2 + 0.5 * random(`so${i}`) }} />
        ))}
        <div style={{ position: "absolute", left: 840, top: 150, width: 120, height: 120, borderRadius: 99, background: "#DDE4EC", boxShadow: "0 0 90px rgba(221,228,236,0.45)" }} />
      </AbsoluteFill>
      {/* far skyline */}
      <AbsoluteFill style={{ transform: `scale(${farScale})`, transformOrigin: `${WIN.x}px ${WIN.y}px` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const h = 260 + random(`bh${i}`) * 420;
          return <div key={i} style={{ position: "absolute", left: i * 140 - 30, bottom: 0, width: 150, height: h, background: "#0E1520", borderTop: "4px solid #162130" }} />;
        })}
      </AbsoluteFill>
      {/* the hotel */}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: `${WIN.x}px ${WIN.y}px` }}>
        <div style={{ position: "absolute", left: 200, top: 560, width: 680, height: 1500, background: "linear-gradient(to right, #1A222D, #141B24)", borderTop: "10px solid #2A3644" }}>
          {new Array(5 * 9).fill(0).map((_, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const lit = col === 3 && row === 2;
            const warm = random(`ww${i}`) > 0.72;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 46 + col * 126,
                  top: 70 + row * 150,
                  width: WIN.w,
                  height: WIN.h,
                  background: lit ? `rgba(57,255,136,${0.75 * flick})` : warm ? "rgba(255,181,71,0.22)" : "#0B1018",
                  boxShadow: lit ? `0 0 60px rgba(57,255,136,${0.6 * flick})` : "none",
                  border: "5px solid #26313E",
                }}
              >
                {lit ? <div style={{ position: "absolute", left: 10, bottom: 0, width: 34, height: 44, borderRadius: "17px 17px 0 0", background: "#0B1018" }} /> : null}
              </div>
            );
          })}
        </div>
        {/* vertical neon sign */}
        <div style={{ position: "absolute", left: 120, top: 640, width: 90, padding: "14px 0", borderRadius: 10, background: "#0B0F13", border: `4px solid ${colors.amber}`, boxShadow: `0 0 40px ${colors.amber}88`, textAlign: "center" }}>
          {"HOTEL".split("").map((ch, i) => (
            <div key={i} style={{ ...big(78, colors.amber), lineHeight: 1 }}>
              {ch}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      {/* labels outside the zoom */}
      <div style={{ opacity: labels }}>
        <Pop2 at={tBudget} style={{ left: 0, right: 0, top: 330, textAlign: "center" }}>
          <span style={{ ...big(150, colors.text) }}>A BUDGET HOTEL</span>
        </Pop2>
        <Pop2 at={tEngland} style={{ left: 0, right: 0, top: 480, textAlign: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "10px 30px", borderRadius: 14, background: colors.green, ...big(84, colors.bg), textShadow: "none" }}>
            <svg width={44} height={56} viewBox="0 0 44 56">
              <path d="M22 54 C 8 34 2 26 2 20 A 20 20 0 0 1 42 20 C 42 26 36 34 22 54 Z" fill={colors.bg} />
              <circle cx={22} cy={20} r={8} fill={colors.green} />
            </svg>
            ENGLAND
          </span>
        </Pop2>
      </div>
    </AbsoluteFill>
  );
};

/** Pop that keeps opacity for its children (works outside 3D). */
const Pop2: React.FC<{ at: number; style?: React.CSSProperties; children: React.ReactNode; sound?: boolean }> = ({ at, style, children, sound = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = sp(frame, fps, at, springs.pop);
  return (
    <div style={{ position: "absolute", ...style, transform: `scale(${s})` }}>
      {sound ? <Sfx name="pop" at={at} /> : null}
      {children}
    </div>
  );
};

/* the room, in world units: x right, y down (floor at 0), z towards the viewer */
const RW = 820;
const RD = 760;
const RH = 560;
const DOOR_X = 290;
const TV_X = -70;

const Room: React.FC<{ c: (w: string, n?: number, o?: number) => number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tIn = 122;
  const tAge = c("17-year-old");
  const tBoy = c("boy");
  const tPolice = c("police");
  const tBack = c("He is already");
  const tBail = c("bail");
  const tBiggest = c("biggest");
  const tLaptop = c("laptop");
  const tTaken = c("taken");
  const tBanned = c("banned");
  const tPhone = c("smartphone");
  const tOut = c("So he uses");

  const cam0 = useCam([
    { at: tIn, tx: -260, ty: -260, tz: 80, rx: -6, ry: -70, dist: 900 },
    { at: tIn + 2, tx: -40, ty: -200, tz: 20, rx: -26, ry: -34, dist: -120 },
    { at: tAge - 6, tx: -210, ty: -210, tz: 120, rx: -20, ry: -26, dist: 260 },
    { at: tPolice - 6, tx: DOOR_X - 60, ty: -230, tz: -300, rx: -14, ry: -16, dist: 260 },
    { at: tBack, tx: -200, ty: -230, tz: 120, rx: -22, ry: -38, dist: 300 },
    { at: tBiggest - 4, tx: -90, ty: -400, tz: 60, rx: -12, ry: -28, dist: 60 },
    { at: tLaptop - 6, tx: -110, ty: -200, tz: 230, rx: -26, ry: -20, dist: 380 },
    { at: tBanned - 6, tx: 40, ty: -300, tz: 100, rx: -16, ry: -32, dist: 280 },
    { at: tOut - 14, tx: 0, ty: -150, tz: 0, rx: -72, ry: -50, dist: -1100 },
  ]);
  const cam: Cam = { ...cam0, ry: cam0.ry + 2.2 * Math.sin(frame / 40), rx: cam0.rx + 1 * Math.sin(frame / 55) };

  const tvFlick = 0.85 + 0.15 * random(`rtv-${Math.floor(frame / 3)}`);
  const police = frame >= tPolice ? Math.floor((frame - tPolice) / 5) % 2 : -1;
  const door = sp(frame, fps, tPolice + 2, springs.snappy);
  const laptopLift = sp(frame, fps, tTaken - 4, { damping: 16, stiffness: 70 });
  const phoneIn = sp(frame, fps, tBanned - 2, springs.pop);
  const ban = clamp01((frame - tBanned - 8) / 14);

  return (
    <Stage3D cam={cam} cy={860}>
      {/* floor slab */}
      <Plane w={RW} h={RD} t="rotateX(90deg)" style={{ background: "linear-gradient(to bottom, #262B36, #323846)", boxShadow: "inset 0 0 120px rgba(0,0,0,0.55)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 14px, rgba(0,0,0,0) 14px 28px)" }} />
        {/* TV glow pool */}
        <div style={{ position: "absolute", left: RW / 2 + TV_X - 340, top: -160, width: 680, height: 560, background: "radial-gradient(ellipse at 50% 20%, rgba(57,255,136,0.30), rgba(0,0,0,0) 65%)", opacity: tvFlick }} />
        {/* lamp pool */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 360, height: 360, background: "radial-gradient(circle at 20% 20%, rgba(255,181,71,0.30), rgba(0,0,0,0) 65%)" }} />
        {/* rug */}
        <div style={{ position: "absolute", left: 400, top: 380, width: 300, height: 220, borderRadius: 18, background: "#3A2E3A", border: "8px solid #4A3A4A", opacity: 0.9 }} />
      </Plane>
      <Plane w={RW} h={40} t={`translate3d(0px, 20px, ${RD / 2}px)`} style={{ background: "#151A21" }} />
      <Plane w={RD} h={40} t={`translate3d(${RW / 2}px, 20px, 0px) rotateY(90deg)`} style={{ background: "#0F1318" }} />

      {/* back wall */}
      <Plane w={RW} h={RH} t={`translate3d(0px, ${-RH / 2}px, ${-RD / 2}px)`} style={{ background: "linear-gradient(to bottom, #1E2A38, #24313F)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(to right, rgba(255,255,255,0.025) 0 3px, rgba(0,0,0,0) 3px 46px)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: "#141B24" }} />
        {/* doorway */}
        <div style={{ position: "absolute", left: RW / 2 + DOOR_X - 80, bottom: 0, width: 160, height: 330, background: frame >= tPolice ? "linear-gradient(to bottom, #3A3020, #1C1710)" : "#0A0D11", border: "8px solid #33404E", borderBottom: "none" }} />
      </Plane>
      {/* door panel, hinged on its left edge */}
      <div
        style={{
          position: "absolute",
          left: DOOR_X - 72,
          top: -322,
          width: 144,
          height: 322,
          transformOrigin: "0% 50%",
          transform: `translate3d(0px, 0px, ${-RD / 2 + 2}px) rotateY(${-78 * door}deg)`,
          background: "linear-gradient(to bottom, #3B4654, #2C3541)",
          border: "4px solid #46525F",
        }}
      >
        <div style={{ position: "absolute", right: 14, top: 160, width: 16, height: 16, borderRadius: 8, background: "#C9A86A" }} />
        <div style={{ position: "absolute", left: 30, top: 40, width: 60, height: 20, borderRadius: 4, background: "#C9D1DA", opacity: 0.7, fontFamily: fonts.mono, fontSize: 14, fontWeight: 700, color: colors.bg, textAlign: "center" }}>214</div>
      </div>
      {/* TV on the back wall */}
      <Plane w={420} h={244} t={`translate3d(${TV_X}px, ${-330}px, ${-RD / 2 + 6}px)`}>
        <div style={{ position: "absolute", inset: -14, borderRadius: 12, background: "#07090B", border: "3px solid #2C3640", boxShadow: `0 0 ${70 * tvFlick}px rgba(57,255,136,0.45)` }} />
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 4 }}>
          <TvArt w={420} />
        </div>
        {/* the stick, plugged into the side */}
        <div style={{ position: "absolute", right: -66, top: 150, width: 56, height: 20, borderRadius: 5, background: "#1A2027", border: "2px solid #46525F" }}>
          <div style={{ position: "absolute", right: 6, top: 4, width: 8, height: 8, borderRadius: 4, background: colors.amber, boxShadow: `0 0 12px ${colors.amber}`, opacity: 0.5 + 0.5 * Math.sin(frame / 5) }} />
        </div>
      </Plane>
      {/* TV cabinet */}
      <Box x={TV_X} z={-RD / 2 + 50} w={460} d={100} h={90} top="#2E3742" front="#232B35" side="#1A2028" />

      {/* left wall, with the window */}
      <Plane w={RD} h={RH} t={`translate3d(${-RW / 2}px, ${-RH / 2}px, 0px) rotateY(90deg)`} style={{ background: "linear-gradient(to bottom, #17212C, #1B2632)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(to right, rgba(255,255,255,0.02) 0 3px, rgba(0,0,0,0) 3px 46px)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: "#121821" }} />
        {/* window */}
        <div
          style={{
            position: "absolute",
            left: 130,
            top: 70,
            width: 320,
            height: 230,
            border: "12px solid #2A3644",
            background: police === 0 ? "linear-gradient(#1B2E70, #0B1220)" : police === 1 ? "linear-gradient(#6A1420, #0B1220)" : "linear-gradient(#0B1220, #131C2E)",
            boxShadow: police >= 0 ? `0 0 80px ${police === 0 ? "rgba(91,134,196,0.8)" : "rgba(255,59,59,0.7)"}` : "none",
          }}
        >
          <div style={{ position: "absolute", left: 60, top: 40, width: 5, height: 5, borderRadius: 3, background: "#fff", opacity: 0.6 }} />
          <div style={{ position: "absolute", left: 210, top: 90, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: 0.4 }} />
          <div style={{ position: "absolute", left: 148, top: -12, width: 12, height: 254, background: "#2A3644" }} />
        </div>
        <div style={{ position: "absolute", left: 96, top: 54, width: 70, height: 270, borderRadius: 8, background: "linear-gradient(to right, #3A2A40, #2A1E30)" }} />
        <div style={{ position: "absolute", left: 414, top: 54, width: 70, height: 270, borderRadius: 8, background: "linear-gradient(to left, #3A2A40, #2A1E30)" }} />
        {/* headboard */}
        <div style={{ position: "absolute", left: 50, bottom: 26, width: 400, height: 170, borderRadius: "20px 20px 0 0", background: "#2B2230", border: "6px solid #3A2E40" }} />
      </Plane>
      {/* wall top rims: the cut edge of the diorama */}
      <Plane w={RW + 24} h={24} t={`translate3d(12px, ${-RH}px, ${-RD / 2 - 12}px) rotateX(90deg)`} style={{ background: "#3A4A5C" }} />
      <Plane w={24} h={RD} t={`translate3d(${-RW / 2 - 12}px, ${-RH}px, 0px) rotateX(90deg)`} style={{ background: "#3A4A5C" }} />

      {/* bed against the left wall */}
      <Box
        x={-230}
        z={130}
        w={360}
        d={420}
        h={100}
        top="linear-gradient(to right, #C9D1DA 0%, #C9D1DA 22%, #3E5A78 22%, #35506C 100%)"
        front="#2A3A4C"
        side="#22303F"
        topChildren={<div style={{ position: "absolute", left: 18, top: 40, width: 50, height: 340, borderRadius: 16, background: "#E6ECF2", boxShadow: "0 4px 0 rgba(0,0,0,0.25)" }} />}
      />
      {/* bedside table */}
      <Box x={-350} z={-230} w={110} d={110} h={110} top="#3A3026" front="#2C241C" side="#231D17" />
      <Billboard pos={{ x: -350, y: -110, z: -230 }} cam={cam} w={140} h={170}>
        <div style={{ position: "relative", width: 140, height: 170 }}>
          <div style={{ position: "absolute", left: -60, top: -40, width: 260, height: 220, background: "radial-gradient(circle, rgba(255,181,71,0.45), rgba(0,0,0,0) 65%)" }} />
          <div style={{ position: "absolute", left: 66, top: 60, width: 8, height: 100, background: "#5A4A38" }} />
          <div style={{ position: "absolute", left: 36, top: 14, width: 68, height: 54, borderRadius: "12px 12px 4px 4px", background: "#E8B96A", boxShadow: "0 0 40px rgba(255,181,71,0.8)" }} />
          <div style={{ position: "absolute", left: 44, top: 156, width: 52, height: 14, borderRadius: 6, background: "#5A4A38" }} />
        </div>
      </Billboard>

      {/* suitcase on the floor, front right */}
      <Box x={250} z={230} w={190} d={90} h={70} top="#5A3B30" front="#4A2E24" side="#3A231C" />

      {/* laptop on the desk, taken away */}
      {laptopLift < 0.995 ? (
        <Billboard pos={{ x: -80, y: -100 - laptopLift * 700, z: 250 }} cam={cam} w={200} h={150}>
          <div style={{ position: "relative", width: 180, height: 140, transform: `rotate(${laptopLift * -30}deg)`, opacity: 1 - laptopLift }}>
            <div style={{ position: "absolute", left: 20, top: 0, width: 140, height: 100, borderRadius: 8, background: "#0B0F13", border: "6px solid #8C96A0" }}>
              <div style={{ position: "absolute", inset: 6, background: colors.greenDim, opacity: 0.6 }} />
            </div>
            <div style={{ position: "absolute", left: 0, top: 104, width: 180, height: 16, borderRadius: 4, background: "#8C96A0" }} />
          </div>
        </Billboard>
      ) : null}

      {/* the cop at the door */}
      {frame >= tPolice + 4 ? (
        <Billboard pos={{ x: DOOR_X, y: 0, z: -RD / 2 + 40 }} cam={cam} w={300} h={330}>
          <div style={{ transform: `scale(${sp(frame, fps, tPolice + 4, springs.pop)})`, transformOrigin: "50% 100%" }}>
            <Cop size={300} look={{ x: -0.7, y: 0 }} />
          </div>
        </Billboard>
      ) : null}

      {/* the boy, sitting on the bed */}
      {frame >= tBoy - 8 ? (
        <Billboard pos={{ x: -190, y: -100, z: 170 }} cam={cam} w={260} h={260}>
          <div style={{ transform: `scale(${sp(frame, fps, tBoy - 8, springs.pop)})`, transformOrigin: "50% 100%" }}>
            <White size={240} look={{ x: 0.6, y: -0.3 }} lightColor={colors.green} lightAmount={0.4 * tvFlick} />
          </div>
        </Billboard>
      ) : null}

      {/* smartphone, banned */}
      {frame >= tBanned - 2 ? (
        <Billboard pos={{ x: 40, y: -170, z: 110 }} cam={cam} w={260} h={300}>
          <div style={{ position: "relative", width: 220, height: 280, transform: `scale(${phoneIn}) rotate(${-8 + 3 * Math.sin(frame / 9)}deg) translateY(${-8 * Math.sin(frame / 13)}px)` }}>
            <div style={{ position: "absolute", left: 50, top: 10 }}>
              <PhoneArt h={240} screen="#24425A" />
            </div>
            <svg width={240} height={240} viewBox="0 0 240 240" style={{ position: "absolute", left: -10, top: 18 }}>
              <circle cx={120} cy={120} r={100} fill="none" stroke={colors.red} strokeWidth={22} strokeDasharray={630} strokeDashoffset={630 * (1 - ban)} strokeLinecap="round" />
              {ban > 0.6 ? <line x1={50} y1={50} x2={190} y2={190} stroke={colors.red} strokeWidth={22} strokeLinecap="round" /> : null}
            </svg>
          </div>
        </Billboard>
      ) : null}

      {/* labels */}
      <Billboard pos={{ x: -190, y: -390, z: 170 }} cam={cam} w={500} h={120}>
        <Tag at={tAge} until={tPolice - 6} text="AGE 17" color={colors.green} size={60} />
      </Billboard>
      <Billboard pos={{ x: DOOR_X - 90, y: -350, z: -RD / 2 + 160 }} cam={cam} w={700} h={120}>
        <Tag at={c("protection")} until={tBack} text="POLICE PROTECTION" color={colors.agent} size={46} />
      </Billboard>
      <Billboard pos={{ x: -190, y: -390, z: 170 }} cam={cam} w={600} h={120}>
        <Tag at={tBail} until={tBiggest - 2} text="ON BAIL" color={colors.amber} size={64} filled />
      </Billboard>
      {[
        { name: "NVIDIA", x: -300, y: -430 },
        { name: "SAMSUNG", x: -60, y: -560 },
        { name: "MICROSOFT", x: 150, y: -420 },
      ].map((b, i) => {
        const at = tBiggest + i * 6;
        if (frame < at || frame >= tLaptop + 4) return null;
        const s = sp(frame, fps, at, springs.pop);
        return (
          <Billboard key={b.name} pos={{ x: b.x, y: b.y + 8 * Math.sin((frame + i * 20) / 12), z: 60 }} cam={cam} w={560} h={150}>
            <Sfx name="pop" at={at} />
            <div style={{ transform: `scale(${s})`, padding: "14px 24px", borderRadius: 14, background: "rgba(7,9,11,0.92)", border: `4px solid ${colors.red}`, boxShadow: `0 0 40px ${colors.red}55`, position: "relative" }}>
              <BrandTag name={b.name} size={80} />
              <div style={{ position: "absolute", right: -18, top: -24, padding: "2px 10px", borderRadius: 6, background: colors.red, fontFamily: fonts.display, fontSize: 30, color: colors.bg, transform: "rotate(8deg)" }}>HACKED</div>
            </div>
          </Billboard>
        );
      })}
      <Billboard pos={{ x: -80, y: -320, z: 250 }} cam={cam} w={700} h={120}>
        <Tag at={tTaken} until={tBanned - 4} text="LAPTOP: TAKEN" color={colors.red} size={52} />
      </Billboard>
      <Billboard pos={{ x: 40, y: -490, z: 110 }} cam={cam} w={760} h={120}>
        <Tag at={tPhone} until={tOut} text="SMARTPHONE: BANNED" color={colors.red} size={48} filled />
      </Billboard>
    </Stage3D>
  );
};

/* ------------------------------------------------------------------ loadout */

type Item = { key: string; name: string; sub: string; rarity: string; color: string; stats: [string, number][]; art: React.ReactNode };

const ITEMS: Item[] = [
  {
    key: "stick",
    name: "FIRE STICK",
    sub: "TV STREAMING STICK",
    rarity: "COMMON",
    color: colors.green,
    stats: [
      ["STEALTH", 0.92],
      ["SIZE", 0.12],
      ["SUSPICION", 0.04],
    ],
    art: <StickArt w={340} />,
  },
  {
    key: "tv",
    name: "HOTEL TV",
    sub: "CAME WITH THE ROOM",
    rarity: "COMMON",
    color: colors.green,
    stats: [
      ["STEALTH", 0.8],
      ["SCREEN", 0.7],
      ["SUSPICION", 0.08],
    ],
    art: <TvArt w={300} />,
  },
  {
    key: "phone",
    name: "A PHONE",
    sub: "HE IS NOT ALLOWED ONE",
    rarity: "CONTRABAND",
    color: colors.red,
    stats: [
      ["STEALTH", 0.6],
      ["POWER", 0.85],
      ["ALLOWED", 0],
    ],
    art: <PhoneArt h={190} screen="#24425A" />,
  },
];

const SLOT_Y = 560;
const SLOT_X = [230, 540, 850];
const CARD_Y = 955;

const CardFace: React.FC<{ item: Item; fill: number }> = ({ item, fill }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: "linear-gradient(to bottom, #121A22, #0A0F14)", border: `6px solid ${item.color}`, boxShadow: `0 0 80px ${item.color}55`, overflow: "hidden", backfaceVisibility: "hidden" }}>
    <div style={{ height: 76, background: item.color, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px" }}>
      <span style={{ ...big(58, colors.bg), textShadow: "none", letterSpacing: "0.12em" }}>{item.rarity}</span>
      <span style={{ ...big(58, colors.bg), textShadow: "none" }}>{"★".repeat(item.rarity === "CONTRABAND" ? 3 : 1)}</span>
    </div>
    <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 50% 55%, ${item.color}33, rgba(0,0,0,0) 65%)` }}>{item.art}</div>
    <div style={{ textAlign: "center", ...big(110, colors.text) }}>{item.name}</div>
    <div style={{ textAlign: "center", fontFamily: fonts.mono, fontSize: 30, fontWeight: 700, color: colors.dim, letterSpacing: "0.1em", marginTop: 10 }}>{item.sub}</div>
    <div style={{ padding: "18px 50px 0", display: "flex", flexDirection: "column", gap: 12 }}>
      {item.stats.map(([label, v], i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ width: 210, fontFamily: fonts.mono, fontSize: 28, fontWeight: 700, color: colors.text, letterSpacing: "0.06em" }}>{label}</span>
          <div style={{ flex: 1, height: 26, borderRadius: 6, background: colors.line, overflow: "hidden" }}>
            <div style={{ width: `${100 * v * clamp01(fill * 1.6 - i * 0.25)}%`, height: "100%", background: label === "SUSPICION" ? colors.amber : item.color }} />
          </div>
          {v === 0 ? <span style={{ ...big(44, colors.red), width: 40 }}>✕</span> : null}
        </div>
      ))}
    </div>
    {/* holo sheen */}
    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, rgba(255,255,255,0) ${fill * 140 - 40}%, rgba(255,255,255,0.14) ${fill * 140 - 30}%, rgba(255,255,255,0) ${fill * 140 - 20}%)` }} />
  </div>
);

const CardBack: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: 34, background: "#0C1115", border: `6px solid ${color}`, transform: "rotateY(180deg)", backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: `repeating-linear-gradient(45deg, ${color}22 0 16px, rgba(0,0,0,0) 16px 32px)` }}>
    <span style={{ ...big(200, color) }}>?</span>
  </div>
);

const Loadout: React.FC<{ c: (w: string, n?: number, o?: number) => number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("So he uses");
  const tWith = c("With that");
  const tBreak = c("breaks");
  const ats = [c("Amazon") - 4, c("hotel", 1) - 4, c("phone") - 4];
  const leaves = [ats[1], ats[2], c("have") + 6];

  const gridScroll = (frame * 6) % 120;
  const combine = sp(frame, fps, tWith, springs.snappy);
  const charge = clamp01((frame - tWith - 6) / (tBreak - tWith - 10));

  return (
    <AbsoluteFill>
      {/* perspective grid floor */}
      <div style={{ position: "absolute", left: 540, top: 1150, perspective: 900 }}>
        <div
          style={{
            position: "absolute",
            left: -1500,
            top: -1500,
            width: 3000,
            height: 3000,
            transform: "rotateX(78deg)",
            backgroundImage: `linear-gradient(rgba(57,255,136,0.35) 3px, rgba(0,0,0,0) 3px), linear-gradient(90deg, rgba(57,255,136,0.35) 3px, rgba(0,0,0,0) 3px)`,
            backgroundSize: "120px 120px",
            backgroundPosition: `0px ${gridScroll}px`,
            maskImage: "radial-gradient(circle at 50% 50%, black 20%, transparent 55%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 20%, transparent 55%)",
          }}
        />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(57,255,136,0.12), rgba(0,0,0,0) 60%)" }} />

      <TitleSlam text="LOADOUT" color={colors.green} fontSize={230} at={t0} style={{ top: 170 }} />
      <Pop2 at={t0 + 8} style={{ left: 0, right: 0, top: 390, textAlign: "center" }} sound={false}>
        <span style={{ fontFamily: fonts.mono, fontSize: 38, fontWeight: 700, color: colors.dim, letterSpacing: "0.2em" }}>WHAT HE COULD GET</span>
      </Pop2>

      {/* three slots */}
      {SLOT_X.map((x, i) => {
        const s = sp(frame, fps, t0 + 4 + i * 4, springs.pop);
        const filled = frame >= leaves[i] + 8;
        const fillPop = sp(frame, fps, leaves[i] + 8, springs.pop);
        const item = ITEMS[i];
        const dx = (540 - x) * combine * 0.55;
        const glow = frame >= tWith ? 0.6 + 0.4 * Math.sin((frame - tWith) / 3 + i) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 95 + dx,
              top: SLOT_Y - 90 + combine * 340,
              width: 190,
              height: 190,
              borderRadius: 26,
              border: `5px ${filled ? "solid" : "dashed"} ${filled ? item.color : colors.line}`,
              background: filled ? "rgba(12,17,21,0.95)" : "rgba(12,17,21,0.6)",
              boxShadow: filled ? `0 0 ${30 + 50 * glow}px ${item.color}${glow ? "AA" : "44"}` : "none",
              transform: `scale(${s * (1 + 0.15 * combine)})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
            }}
          >
            {filled ? (
              <>
                <div style={{ transform: `scale(${0.42 * fillPop})`, height: 80, display: "flex", alignItems: "center" }}>{item.art}</div>
                <div style={{ fontFamily: fonts.mono, fontSize: 22, fontWeight: 700, color: item.color, letterSpacing: "0.04em" }}>{item.name}</div>
              </>
            ) : (
              <span style={{ ...big(110, colors.line), textShadow: "none" }}>{i + 1}</span>
            )}
          </div>
        );
      })}

      {/* the big card that flips in, then flies to its slot */}
      {ITEMS.map((item, i) => {
        const at = ats[i];
        const leave = leaves[i];
        if (frame < at || frame >= leave + 10) return null;
        const flip = sp(frame, fps, at, { damping: 14, stiffness: 110, mass: 0.8 });
        const fly = sp(frame, fps, leave, { damping: 20, stiffness: 160, mass: 0.6 });
        const fill = clamp01((frame - at - 6) / 24);
        const x = lerp(540, SLOT_X[i], fly);
        const y = lerp(CARD_Y + (1 - flip) * 500, SLOT_Y, fly);
        const scale = lerp(1, 0.24, fly);
        const yaw = lerp(180 * (1 - flip) + 7 * Math.sin(frame / 14), 0, fly);
        const pitch = lerp(10 + 3 * Math.sin(frame / 19), 0, fly);
        return (
          <div key={item.key} style={{ position: "absolute", left: x, top: y, perspective: 1400 }}>
            <Sfx name="whoosh" at={at} volume={0.7} />
            <Sfx name="snap" at={at + 8} volume={0.6} />
            <div
              style={{
                position: "absolute",
                left: -370,
                top: -290,
                width: 740,
                height: 580,
                transformStyle: "preserve-3d",
                transform: `scale(${scale}) rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${(1 - flip) * -8}deg)`,
              }}
            >
              <CardFace item={item} fill={fill} />
              <CardBack color={item.color} />
            </div>
          </div>
        );
      })}
      <Between from={c("not")} to={leaves[2]}>
        <SeizedStamp at={c("not")} text="NOT ALLOWED" fontSize={100} rotate={-10} style={{ left: 250, top: 740 }} />
      </Between>

      {/* combine bar */}
      {frame >= tWith ? (
        <div style={{ position: "absolute", left: 140, right: 140, top: 1060, opacity: clamp01((frame - tWith) / 6) }}>
          <div style={{ textAlign: "center", fontFamily: fonts.mono, fontSize: 40, fontWeight: 700, color: colors.green, letterSpacing: "0.16em", marginBottom: 16 }}>
            {charge < 1 ? "COMBINING..." : "READY"}
          </div>
          <div style={{ height: 34, borderRadius: 10, border: `4px solid ${colors.green}`, padding: 4 }}>
            <div style={{ width: `${charge * 100}%`, height: "100%", borderRadius: 5, background: colors.green, boxShadow: `0 0 30px ${colors.green}` }} />
          </div>
        </div>
      ) : null}
      <Sfx name="riser" at={tWith} volume={0.8} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ studio */

const BW = 520;
const BH = 600;
const BD = 320;

const Windows: React.FC<{ cols: number; rows: number; seed: string; lit: number }> = ({ cols, rows, seed, lit }) => (
  <div style={{ position: "absolute", left: 30, right: 30, top: 120, bottom: 140, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, columnGap: 22, rowGap: 30 }}>
    {new Array(cols * rows).fill(0).map((_, i) => {
      const on = random(`${seed}-${i}`) < lit;
      return <div key={i} style={{ borderRadius: 4, background: on ? "rgba(255,181,71,0.75)" : "#0B1018", boxShadow: on ? "0 0 18px rgba(255,181,71,0.5)" : "none" }} />;
    })}
  </div>
);

const Studio: React.FC<{ c: (w: string, n?: number, o?: number) => number }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("breaks");
  const tStudio = c("studio");
  const tMost = c("anticipated");
  const tGame = c("video");
  const tHist = c("history");
  const tEnd = c("And he leaves");

  const rise = sp(frame, fps, t0 - 2, { damping: 16, stiffness: 90 });
  const yaw = -32 + (frame - t0) * 0.18;
  const pitch = -14;
  const push = sp(frame, fps, tStudio, springs.heavy, 50);
  const lit = 0.25 + 0.6 * sp(frame, fps, tStudio, springs.smooth, 30);
  const brk = sp(frame, fps, t0 + 6, { damping: 18, stiffness: 120 });
  const hype = clamp01((frame - tMost) / 26);
  const gta = frame >= tGame ? 1 : 0;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 70%, rgba(255,181,71,0.18), rgba(0,0,0,0) 60%)" }} />
      {/* the studio block */}
      <div style={{ position: "absolute", left: 540, top: 1190, perspective: 1600 }}>
        <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translateZ(${push * 140 - 120}px) rotateX(${pitch}deg) rotateY(${yaw}deg) scaleY(${rise})` }}>
          {/* ground */}
          <Plane w={1300} h={1300} t="rotateX(90deg)" style={{ background: "radial-gradient(circle, #1A222D 0%, rgba(7,9,11,0) 60%)" }} />
          {/* front */}
          <Plane w={BW} h={BH} t={`translate3d(0px, ${-BH / 2}px, ${BD / 2}px)`} style={{ background: "linear-gradient(to bottom, #222C38, #18202A)", border: "4px solid #2E3A48" }}>
            <Windows cols={4} rows={5} seed="sf" lit={lit} />
            <div style={{ position: "absolute", left: BW / 2 - 70, bottom: 0, width: 140, height: 110, background: "#0B1018", border: "6px solid #33404E", borderBottom: "none" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 26, display: "flex", justifyContent: "center" }}>
              <BrandTag name="ROCKSTAR" size={68} />
            </div>
          </Plane>
          {/* side */}
          <Plane w={BD} h={BH} t={`translate3d(${BW / 2}px, ${-BH / 2}px, 0px) rotateY(90deg)`} style={{ background: "linear-gradient(to bottom, #182029, #11171E)", border: "4px solid #26313E" }}>
            <Windows cols={2} rows={5} seed="ss" lit={lit} />
          </Plane>
          {/* roof */}
          <Plane w={BW} h={BD} t={`translate3d(0px, ${-BH}px, 0px) rotateX(90deg)`} style={{ background: "#2E3A48" }}>
            <div style={{ position: "absolute", left: 60, top: 60, width: 120, height: 80, background: "#3A4757" }} />
          </Plane>
        </div>
      </div>

      {/* the lock, breaking */}
      {frame < t0 + 40 ? (
        <div style={{ position: "absolute", left: 540, top: 900, opacity: 1 - clamp01((frame - t0 - 22) / 16) }}>
          <Sfx name="crash" at={t0 + 6} volume={0.8} />
          {/* shackle */}
          <div style={{ position: "absolute", left: -95, top: -250 - brk * 120, width: 190, height: 220, borderRadius: "95px 95px 0 0", border: "34px solid #9AA4AE", borderBottom: "none", transform: `rotate(${brk * -25}deg)` }} />
          {/* body halves */}
          {[-1, 1].map((s) => (
            <div
              key={s}
              style={{
                position: "absolute",
                left: s < 0 ? -150 : 0,
                top: -60,
                width: 150,
                height: 230,
                background: colors.amber,
                borderRadius: s < 0 ? "30px 0 0 30px" : "0 30px 30px 0",
                boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                transform: `translate(${s * brk * 260}px, ${brk * 140}px) rotate(${s * brk * 40}deg)`,
              }}
            >
              <div style={{ position: "absolute", [s < 0 ? "right" : "left"]: 0, top: 70, width: 30, height: 60, background: "#3A2A10", borderRadius: s < 0 ? "30px 0 0 30px" : "0 30px 30px 0" }} />
            </div>
          ))}
        </div>
      ) : null}
      <Flash at={t0 + 6} color={colors.red} peak={0.45} />
      <Between from={t0 + 10} to={tMost}>
        <SeizedStamp at={t0 + 10} text="BROKEN INTO" fontSize={130} rotate={-8} style={{ left: 190, top: 330 }} />
      </Between>

      {/* most anticipated */}
      {frame >= tMost ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 190, textAlign: "center" }}>
          <Pop2 at={tMost} style={{ left: 0, right: 0, top: 0 }}>
            <div style={big(132, colors.text)}>THE MOST ANTICIPATED</div>
          </Pop2>
          <div style={{ position: "absolute", left: 150, right: 150, top: 150 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: colors.amber, letterSpacing: "0.14em", marginBottom: 10 }}>
              <span>HYPE</span>
              <span>{hype >= 1 ? "MAX" : `${Math.round(hype * 100)}%`}</span>
            </div>
            <div style={{ height: 40, borderRadius: 10, border: `4px solid ${colors.amber}`, padding: 4 }}>
              <div style={{ width: `${hype * 100}%`, height: "100%", borderRadius: 5, background: `linear-gradient(to right, ${colors.amber}, ${colors.red})`, boxShadow: `0 0 30px ${colors.amber}` }} />
            </div>
          </div>
        </div>
      ) : null}
      {gta ? <TitleSlam text="GTA 6" color={colors.amber} fontSize={420} at={tGame} style={{ top: 560 }} /> : null}
      {frame >= tHist ? (
        <Pop2 at={tHist} style={{ left: 0, right: 0, top: 990, textAlign: "center" }}>
          <span style={{ display: "inline-block", padding: "8px 30px", borderRadius: 12, background: colors.amber, ...big(96, colors.bg), textShadow: "none", transform: "rotate(-3deg)" }}>IN HISTORY</span>
        </Pop2>
      ) : null}
      <Sfx name="whoosh" at={tEnd - 4} />
      {frame >= tEnd - 6 ? <GlitchBars amount={clamp01(1 - (frame - tEnd + 6) / 8)} seed="studio-out" /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ phone takeover */

const STAFF = 40;

const Phone: React.FC<{ c: (w: string, n?: number, o?: number) => number; ce: (w: string, n?: number, o?: number) => number }> = ({ c, ce }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("And he leaves");
  const tMsg = c("message");
  const tEvery = c("every");
  const tA = c("I am not");
  const tAEnd = ce("employee", 1);
  const tB = c("I am an");
  const tAtt = c("attacker");
  const tBEnd = ce("attacker");

  const rise = sp(frame, fps, t0, { damping: 18, stiffness: 80 });
  const take = sp(frame, fps, tMsg - 2, { damping: 22, stiffness: 70 });
  const scale = lerp(0.5, 1.09, take);
  const rx = lerp(lerp(55, 16, rise), 0, take);
  const ry = lerp(-22, 0, take);
  const rz = lerp(lerp(-18, -6, rise), 0, take);
  const ty = lerp((1 - rise) * 1600, 0, take);

  const msgA = "I am not a Rockstar employee,";
  const msgB = "I am an attacker.";
  const nA = Math.floor(msgA.length * clamp01((frame - tA) / (tAEnd - tA)));
  const nB = Math.floor(msgB.length * clamp01((frame - tB) / (tAtt + 10 - tB)));
  const scroll = sp(frame, fps, tA - 6, springs.snappy);
  const hit = frame >= tAtt ? Math.exp(-(frame - tAtt) / 6) : 0;
  const shakeX = (random(`ps-x-${frame}`) - 0.5) * 50 * hit;
  const shakeY = (random(`ps-y-${frame}`) - 0.5) * 50 * hit;
  const cursor = Math.floor(frame / 8) % 2 === 0;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,59,59,0.2), rgba(0,0,0,0) 60%)" }} />
      <Sfx name="whoosh" at={t0} />
      <Sfx name="notify" at={tMsg} />
      <Sfx name="type" at={tA} durationInFrames={tAEnd - tA} loop volume={0.6} />
      <Sfx name="type" at={tB} durationInFrames={tAtt + 10 - tB} loop volume={0.6} />
      <Sfx name="slam" at={tAtt} />
      <div style={{ position: "absolute", left: 540, top: 960, perspective: 1800 }}>
        <div
          style={{
            position: "absolute",
            left: -576,
            top: -996,
            width: 1152,
            height: 1992,
            borderRadius: 110,
            background: "#0B0F13",
            border: "6px solid #3A4753",
            boxShadow: "0 60px 140px rgba(0,0,0,0.8)",
            transform: `translate(${shakeX}px, ${ty + shakeY}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`,
          }}
        >
          <Glitch amount={hit * 0.8} seed="phone-hit" style={{ position: "absolute", left: 36, top: 36, width: 1080, height: 1920 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 80, overflow: "hidden", background: "#0C1115" }}>
              {/* status bar */}
              <div style={{ position: "absolute", left: 70, right: 70, top: 40, zIndex: 3, display: "flex", justifyContent: "space-between", fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: colors.text }}>
                <span>SEPT 2022</span>
                <span>▮▮▮ ●</span>
              </div>
              {/* app header */}
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 340, paddingTop: 150, boxSizing: "border-box", zIndex: 2, background: "#0C1115", borderBottom: `3px solid ${colors.line}`, padding: "150px 70px 0", display: "flex", alignItems: "center", gap: 30 }}>
                <div style={{ width: 110, height: 110, borderRadius: 26, background: colors.amber, ...big(80, colors.bg), textShadow: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>#</div>
                <div>
                  <div style={big(92, colors.text)}>all-staff</div>
                  <div style={{ fontFamily: fonts.mono, fontSize: 30, color: colors.dim, marginTop: 6 }}>company chat · every employee</div>
                </div>
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 340, bottom: 0, transform: `translateY(${-scroll * 520}px)` }}>
                {/* who it goes to */}
                <div style={{ position: "absolute", left: 70, right: 70, top: 60 }}>
                  {frame >= tEvery ? (
                    <div style={{ transform: `scale(${sp(frame, fps, tEvery, springs.pop)})`, padding: "18px 0", borderRadius: 18, background: colors.red, textAlign: "center", ...big(80, colors.bg), textShadow: "none" }}>
                      TO: EVERY EMPLOYEE
                    </div>
                  ) : null}
                  <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 22 }}>
                    {new Array(STAFF).fill(0).map((_, i) => {
                      const on = frame >= tEvery + 4 + i * 0.8;
                      return (
                        <div key={i} style={{ aspectRatio: "1", borderRadius: 99, background: on ? colors.extras[i % 4] : colors.line, opacity: on ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                          <div style={{ width: 10, height: 14, borderRadius: 5, background: colors.bg, opacity: on ? 1 : 0 }} />
                          <div style={{ width: 10, height: 14, borderRadius: 5, background: colors.bg, opacity: on ? 1 : 0 }} />
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* the message */}
                {frame >= tA - 6 ? (
                  <div style={{ position: "absolute", left: 70, right: 70, top: 760 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 26 }}>
                      <AvatarBadge icon="unknown" size={110} />
                      <div>
                        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 44, color: colors.red }}>unknown user</div>
                        <div style={{ fontFamily: fonts.mono, fontSize: 30, color: colors.dim }}>just now</div>
                      </div>
                    </div>
                    <div style={{ padding: "34px 40px", borderRadius: "10px 40px 40px 40px", background: colors.panelLight, border: `3px solid ${colors.line}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 98, lineHeight: 1.16, color: colors.text, minHeight: 340 }}>
                      {msgA.slice(0, nA)}
                      {nA < msgA.length && cursor ? <span style={{ color: colors.green }}>▌</span> : null}
                    </div>
                    {frame >= tB ? (
                      <div
                        style={{
                          marginTop: 30,
                          padding: "34px 40px",
                          borderRadius: "10px 40px 40px 40px",
                          background: "rgba(255,59,59,0.16)",
                          border: `5px solid ${colors.red}`,
                          fontFamily: fonts.mono,
                          fontWeight: 700,
                          fontSize: 128,
                          lineHeight: 1.08,
                          color: colors.red,
                          textShadow: `0 0 30px ${colors.red}88`,
                          transform: `scale(${1 + 0.08 * hit})`,
                        }}
                      >
                        {msgB.slice(0, nB)}
                        {nB < msgB.length && cursor ? <span style={{ color: colors.red }}>▌</span> : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </Glitch>
        </div>
      </div>
      {frame >= tMsg && frame < tMsg + 34 ? (
        <div style={{ position: "absolute", left: 90, right: 90, top: 140, transform: `translateY(${(1 - sp(frame, fps, tMsg, springs.snappy)) * -260}px)`, opacity: clamp01((tMsg + 34 - frame) / 8) }}>
          <div style={{ padding: "26px 34px", borderRadius: 30, background: "rgba(230,230,230,0.95)", display: "flex", alignItems: "center", gap: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: colors.red, ...big(60, colors.bg), textShadow: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>!</div>
            <div>
              <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 40, color: colors.bg }}>New message · #all-staff</div>
              <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 34, color: "#3A444E" }}>unknown user</div>
            </div>
          </div>
        </div>
      ) : null}
      <Flash at={tAtt} color={colors.red} peak={0.5} durationInFrames={18} />
      <Sfx name="glitch" at={tBEnd - 4} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ outro + end card */

const Outro: React.FC<{ c: (w: string, n?: number, o?: number) => number; endAt: number }> = ({ c, endAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("And this");
  const card = sp(frame, fps, endAt, { damping: 20, stiffness: 120 });
  const eyes = clamp01((frame - t0) / 20);
  const bounce = Math.abs(Math.sin((frame - endAt) / 6)) * 24;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 85%, rgba(255,59,59,0.25), rgba(0,0,0,0) 55%)", opacity: eyes }} />
      {/* the boy in the dark */}
      <div style={{ position: "absolute", left: 540 - 260, top: 1050, opacity: 0.85 * eyes * (1 - card), transform: `translateY(${(1 - eyes) * 80}px)` }}>
        <White size={560} idle={0.6} look={{ x: 0, y: 0.1 }} lightColor={colors.red} lightAmount={0.9} />
      </div>
      <div style={{ opacity: 1 - card, transform: `translateY(${-card * 300}px)` }}>
        <TitleSlam text="THIS WASN'T" fontSize={210} at={c("wasn't")} style={{ top: 250 }} />
        <TitleSlam text="EVEN" fontSize={210} at={c("even")} style={{ top: 440 }} />
        <TitleSlam text="HIS BIGGEST" color={colors.amber} fontSize={210} at={c("biggest", 1)} style={{ top: 630 }} />
        <TitleSlam text="HACK." color={colors.red} fontSize={400} at={c("hack")} style={{ top: 820 }} />
      </div>

      {/* end card */}
      {frame >= endAt ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, transform: `translateY(${(1 - card) * 1920}px)` }}>
          <Sfx name="whoosh" at={endAt} />
          <AbsoluteFill style={{ background: "linear-gradient(to bottom, #07090B, #0C1115)" }} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(57,255,136,0.16), rgba(0,0,0,0) 55%)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
              <OnionLogo size={56} />
              <span style={{ fontFamily: fonts.mono, fontSize: 40, fontWeight: 700, color: colors.green, letterSpacing: "0.12em" }}>THE ONION ARCHIVE</span>
            </div>
            <div style={{ ...big(170, colors.text), marginTop: 60 }}>THE FULL STORY</div>
            <div style={{ ...big(120, colors.amber), marginTop: 14 }}>THE TEEN WHO</div>
            <div style={{ ...big(120, colors.amber), marginTop: 6 }}>HACKED GTA 6</div>
          </div>
          <div style={{ position: "absolute", left: 540 - 220, top: 830 }}>
            <White size={380} idle={1} look={{ x: 0, y: 0.6 }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center" }}>
            <div style={{ display: "inline-block", padding: "18px 44px", borderRadius: 20, background: colors.red, ...big(96, colors.bg), textShadow: "none" }}>FULL VIDEO LINKED BELOW</div>
            <svg width={140} height={150} viewBox="0 0 140 150" style={{ display: "block", margin: "26px auto 0", transform: `translateY(${bounce}px)` }}>
              <path d="M70 10 V 120 M 20 76 L 70 128 L 120 76" fill="none" stroke={colors.red} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ the Short */

export const ShortLapsus1: React.FC<z.infer<typeof shortLapsus1Schema>> = ({ showCaptions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { c, ce, words } = useClip(1);

  const tBudget = c("budget") - 2;
  const tEngland = c("England");
  const tDive = 64;
  const tRoom = 122;
  const tLoad = c("So he uses");
  const tStudio = c("breaks");
  const tPhone = c("And he leaves");
  const tOutro = c("And this");
  const tEnd = ce("hack") + 6;

  const introOut = sp(frame, fps, tDive, springs.smooth, 22);
  const diveZ = interpolate(frame, [tDive + 6, tRoom + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const roomIn = clamp01((frame - tRoom) / 8);
  const roomOut = clamp01((frame - (tLoad - 10)) / 10);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio src={staticFile("audio/video3/part1.mp3")} trimAfter={AUDIO_END} volume={(f) => interpolate(f, [AUDIO_END - 8, AUDIO_END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
      <Background drift={0.35} vignette={0.7}>
        {/* dive sits under the intro so the zoom starts while the headline leaves */}
        <Between from={tDive - 2} to={tRoom + 10}>
          <div style={{ position: "absolute", inset: 0, opacity: clamp01((frame - tDive + 2) / 8) * (1 - clamp01((frame - tRoom - 2) / 8)) }}>
            <Dive z={diveZ} tBudget={tBudget} tEngland={tEngland} />
          </div>
        </Between>
        <Between from={0} to={tDive + 24}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp01((frame - tDive - 8) / 14) }}>
            <Intro out={introOut} />
          </div>
        </Between>
        <Sfx name="slam" at={0} volume={0.7} />
        <Sfx name="whoosh" at={tDive + 4} />
        <Sfx name="whoosh" at={tRoom} />

        <Between from={tRoom} to={tLoad}>
          <div style={{ position: "absolute", inset: 0, opacity: roomIn * (1 - roomOut) }}>
            <Room c={c} />
          </div>
        </Between>
        <Sfx name="door" at={c("police") + 2} volume={0.7} />
        <Sfx name="whoosh" at={tLoad - 12} />

        <Between from={tLoad} to={tStudio}>
          <Loadout c={c} />
        </Between>
        <Between from={tStudio} to={tPhone}>
          <Studio c={c} />
        </Between>
        <Between from={tPhone} to={tOutro}>
          <Phone c={c} ce={ce} />
        </Between>
        <Between from={tOutro} to={SHORT_LAPSUS1_FRAMES}>
          <Outro c={c} endAt={tEnd} />
        </Between>
        {frame >= tOutro && frame < tOutro + 8 ? <GlitchBars amount={1 - (frame - tOutro) / 8} seed="outro-in" /> : null}
        <Flash at={tRoom - 2} color={colors.green} peak={0.5} durationInFrames={12} />
      </Background>

      <ShortCaptions
        words={words}
        enabled={showCaptions}
        centerY={1330}
        hide={[
          [c("I am not") - 2, SHORT_LAPSUS1_FRAMES],
        ]}
      />
    </AbsoluteFill>
  );
};
