import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { fonts, springs } from "../theme";
import { CAPTIONS } from "./deepfakeCaptions";

/**
 * Short: "A Deepfake Video Call Stole $25 Million" (Arup, Hong Kong, 2024).
 * Screen-life: everything happens on the employee's screens. All cue times are
 * seconds into public/audio/shorts/deepfake.mp3.
 */
export const SHORT_DEEPFAKE = { width: 1080, height: 1920, fps: 30, durationInFrames: 1740 } as const;

const FPS = 30;
const C = {
  bg: "#090B10",
  panel: "#141821",
  panel2: "#1C212C",
  line: "#2A3140",
  text: "#F2F4F8",
  dim: "#8A93A6",
  blue: "#3D7BFF",
  green: "#2FD67B",
  wire: "#39FF88",
  red: "#FF3B4E",
  yellow: "#FFE14A",
};

// ---------- helpers ----------
const useT = () => useCurrentFrame() / FPS;
const ramp = (t: number, a: number, b: number, from = 0, to = 1, ease = Easing.out(Easing.cubic)) =>
  interpolate(t, [a, b], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
const useSpring = (at: number, cfg: keyof typeof springs = "snappy") => {
  const frame = useCurrentFrame();
  return spring({ frame: frame - Math.round(at * FPS), fps: FPS, config: springs[cfg] });
};

/** A scene that lives between two times, sliding in and cutting out. */
const Scene: React.FC<{ from: number; to: number; children: React.ReactNode; push?: number }> = ({
  from,
  to,
  children,
  push = 0.05,
}) => {
  const t = useT();
  if (t < from || t >= to) return null;
  const enter = ramp(t, from, from + 0.3);
  const scale = 0.94 + 0.06 * enter + push * ((t - from) / (to - from));
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, enter * 1.6),
        transform: `translateY(${(1 - enter) * 90}px) scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------- faces ----------
type Person = {
  id: string;
  label: string;
  skin: string;
  hair: string;
  shirt: string;
  style: 0 | 1 | 2 | 3;
  glasses?: boolean;
  bg: [string, string];
};

const PEOPLE: Person[] = [
  { id: "cfo", label: "CFO · London", skin: "#E8B99A", hair: "#B9BDC6", shirt: "#1E2A44", style: 2, glasses: true, bg: ["#3A4257", "#1B2030"] },
  { id: "p1", label: "Finance Director", skin: "#C98F6B", hair: "#2A1D17", shirt: "#F1F1F1", style: 1, bg: ["#4B4038", "#221C19"] },
  { id: "p2", label: "Legal", skin: "#F0C9A8", hair: "#5A3A22", shirt: "#35506B", style: 0, bg: ["#34464A", "#162023"] },
  { id: "p3", label: "Treasury", skin: "#8E5E44", hair: "#15110F", shirt: "#6B2F3A", style: 3, bg: ["#443A4E", "#1D1823"] },
  { id: "p4", label: "Group Finance", skin: "#E2B08C", hair: "#3B3B3B", shirt: "#2E2E2E", style: 0, glasses: true, bg: ["#4A4A3A", "#20201A"] },
];
const BOSS: Person = { id: "boss", label: "Boss", skin: "#E8B99A", hair: "#3A2A20", shirt: "#22324F", style: 0, bg: ["#2E3A55", "#141A28"] };

const HAIR = [
  "M58 84 Q54 34 100 32 Q146 34 142 84 Q132 56 100 54 Q68 56 58 84Z",
  "M54 128 Q44 30 100 30 Q156 30 146 128 L134 128 Q142 62 100 56 Q58 62 66 128Z",
  "M60 76 Q62 42 100 40 Q138 42 140 76 Q130 58 100 57 Q70 58 60 76Z",
  "M58 84 Q54 36 100 34 Q146 36 142 84 Q132 56 100 54 Q68 56 58 84Z",
];

// face wireframe: rings of points around the head, plus shoulders
const MESH = (() => {
  const pts: [number, number][] = [[100, 88]];
  const rings: [number, number][] = [[13, 17], [27, 34], [40, 50]];
  const N = 10;
  rings.forEach(([rx, ry], ri) => {
    for (let k = 0; k < N; k++) {
      const a = (k / N) * Math.PI * 2 + ri * 0.31;
      pts.push([100 + rx * Math.cos(a), 88 + ry * Math.sin(a)]);
    }
  });
  const lines: [number, number][] = [];
  const idx = (r: number, k: number) => 1 + r * N + (k % N);
  for (let k = 0; k < N; k++) {
    lines.push([0, idx(0, k)]);
    for (let r = 0; r < 3; r++) {
      lines.push([idx(r, k), idx(r, k + 1)]);
      if (r < 2) lines.push([idx(r, k), idx(r + 1, k)], [idx(r, k), idx(r + 1, k + 1)]);
    }
  }
  const base = pts.length;
  const sh: [number, number][] = [[18, 200], [30, 162], [70, 142], [100, 152], [130, 142], [170, 162], [182, 200], [60, 200], [100, 200], [140, 200], [88, 136], [112, 136]];
  pts.push(...sh);
  const s = (a: number, b: number) => lines.push([base + a, base + b]);
  [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [1, 7], [2, 7], [3, 7], [3, 8], [3, 9], [4, 9], [5, 9], [2, 10], [4, 11], [10, 11], [10, 3], [11, 3]].forEach(([a, b]) => s(a, b));
  return { pts, lines };
})();

const FaceArt: React.FC<{ p: Person; t: number; talk?: boolean }> = ({ p, t, talk }) => {
  const seed = random(p.id) * 10;
  const nod = Math.sin(t * 1.7 + seed) * 2.2;
  const tilt = Math.sin(t * 0.9 + seed * 2) * 1.6;
  const blink = (t * 0.37 + seed) % 1 < 0.035 ? 0.15 : 1;
  const open = talk ? 2 + Math.abs(Math.sin(t * 11 + seed)) * 6 : 1.5;
  return (
    <g>
      <path d="M18 200 Q20 152 70 142 L130 142 Q180 152 182 200Z" fill={p.shirt} />
      <path d="M86 142 L100 162 L114 142Z" fill="#fff" opacity={0.18} />
      <g transform={`translate(0 ${nod}) rotate(${tilt} 100 120)`}>
        <rect x={86} y={118} width={28} height={30} rx={8} fill={p.skin} />
        <rect x={86} y={126} width={28} height={12} fill="#000" opacity={0.14} />
        <ellipse cx={100} cy={88} rx={40} ry={50} fill={p.skin} />
        <path d={HAIR[p.style]} fill={p.hair} />
        {p.style === 3 && <circle cx={100} cy={28} r={15} fill={p.hair} />}
        <g transform={`translate(0 ${90 * (1 - blink)}) scale(1 ${blink})`}>
          <circle cx={84} cy={90} r={4.2} fill="#1b1b1f" />
          <circle cx={116} cy={90} r={4.2} fill="#1b1b1f" />
        </g>
        <path d="M76 79 Q84 75 92 79 M108 79 Q116 75 124 79" stroke={p.hair} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.9} />
        <path d="M100 92 Q96 104 101 106" stroke="#000" strokeOpacity={0.2} strokeWidth={2.2} fill="none" strokeLinecap="round" />
        <path d={`M88 116 Q100 ${119 + open} 112 116 Q100 ${119 - open * 0.2} 88 116Z`} fill="#7A2E33" />
        {p.glasses && (
          <g stroke="#15171c" strokeWidth={3} fill="rgba(255,255,255,0.08)">
            <rect x={72} y={80} width={24} height={19} rx={6} />
            <rect x={104} y={80} width={24} height={19} rx={6} />
            <path d="M96 88 L104 88" />
          </g>
        )}
      </g>
    </g>
  );
};

const WireArt: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const j = (i: number, ax: number) => Math.sin(t * 3 + i * 1.7 + ax) * 0.9;
  const P = MESH.pts.map(([x, y], i) => [x + j(i, 0), y + j(i, 2)] as const);
  return (
    <g>
      {MESH.lines.map(([a, b], i) => (
        <line key={i} x1={P[a][0]} y1={P[a][1]} x2={P[b][0]} y2={P[b][1]} stroke={C.wire} strokeWidth={0.9} opacity={0.55 + 0.4 * random(`${id}l${i}`)} />
      ))}
      {P.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.7} fill={C.wire} />
      ))}
      <path d="M78 88 L84 84 L90 88 L84 92Z M110 88 L116 84 L122 88 L116 92Z M90 116 L100 113 L110 116 L100 120Z" fill="none" stroke={C.wire} strokeWidth={1.2} />
    </g>
  );
};

/** One webcam tile. wire 0..1 dissolves the face into a wireframe; glitch 0..1 shakes it. */
const Tile: React.FC<{
  p: Person;
  w: number;
  h: number;
  wire?: number;
  glitch?: number;
  talk?: boolean;
  label?: string;
  hideLabel?: boolean;
  radius?: number;
  active?: boolean;
}> = ({ p, w, h, wire = 0, glitch = 0, talk, label, hideLabel, radius = 28, active }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const G = 9;
  const fake = wire > 0.5;
  const gx = glitch > 0 ? (random(`${p.id}x${frame}`) - 0.5) * 60 * glitch : 0;
  const bars = glitch > 0.05 ? [0, 1, 2, 3] : [];
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        overflow: "hidden",
        position: "relative",
        background: `linear-gradient(160deg, ${p.bg[0]}, ${p.bg[1]})`,
        boxShadow: active ? `0 0 0 5px ${fake ? C.red : C.blue}, 0 20px 60px rgba(0,0,0,.5)` : "0 12px 40px rgba(0,0,0,.45)",
        transform: `translateX(${gx}px) skewX(${gx * 0.08}deg)`,
        filter: glitch > 0.05 ? `drop-shadow(${10 * glitch}px 0 rgba(255,0,60,.8)) drop-shadow(${-10 * glitch}px 0 rgba(0,255,220,.8))` : undefined,
      }}
    >
      {/* room behind */}
      <div style={{ position: "absolute", left: "8%", top: "10%", width: "26%", height: "34%", borderRadius: 8, background: "rgba(255,255,255,.07)" }} />
      <div style={{ position: "absolute", right: "6%", top: "18%", width: "30%", height: 10, background: "rgba(0,0,0,.25)" }} />
      <div style={{ position: "absolute", right: "6%", top: "34%", width: "30%", height: 10, background: "rgba(0,0,0,.25)" }} />
      <div style={{ position: "absolute", inset: 0, background: "#04110A", opacity: wire }} />
      <svg viewBox="0 20 200 180" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <mask id={`m-${p.id}`}>
            {Array.from({ length: G * G }, (_, i) => {
              const keep = random(`${p.id}c${i}`) * 0.9 + 0.05 > wire;
              return keep ? <rect key={i} x={(i % G) * (200 / G)} y={20 + Math.floor(i / G) * 20} width={200 / G + 0.5} height={20.5} fill="#fff" /> : null;
            })}
          </mask>
        </defs>
        {wire > 0 && <WireArt t={t} id={p.id} />}
        {wire < 1 && (
          <g mask={`url(#m-${p.id})`}>
            <rect x={0} y={20} width={200} height={180} fill={p.bg[1]} opacity={wire > 0 ? 0.6 : 0} />
            <FaceArt p={p} t={t} talk={talk} />
          </g>
        )}
      </svg>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, transparent 50%, rgba(0,0,0,.45))" }} />
      {bars.map((b) => (
        <div
          key={b}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${random(`${p.id}b${b}${frame}`) * 95}%`,
            height: 6 + random(`${p.id}h${b}${frame}`) * 40 * glitch,
            background: b % 2 ? "rgba(57,255,136,.55)" : "rgba(255,255,255,.35)",
            transform: `translateX(${(random(`${p.id}t${b}${frame}`) - 0.5) * 120}px)`,
            mixBlendMode: "screen",
          }}
        />
      ))}
      {!hideLabel && (
        <div
          style={{
            position: "absolute",
            left: 16,
            bottom: 14,
            padding: "8px 16px",
            borderRadius: 12,
            background: fake ? C.red : "rgba(0,0,0,.6)",
            color: "#fff",
            fontFamily: fake ? fonts.mono : fonts.sans,
            fontWeight: 700,
            fontSize: w > 600 ? 38 : 26,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {talk && !fake && <VoiceBars t={t} />}
          {fake ? "SYNTHETIC" : (label ?? p.label)}
        </div>
      )}
    </div>
  );
};

const VoiceBars: React.FC<{ t: number; color?: string; n?: number; h?: number }> = ({ t, color = C.green, n = 4, h = 26 }) => (
  <div style={{ display: "flex", gap: 4, alignItems: "center", height: h }}>
    {Array.from({ length: n }, (_, i) => (
      <div key={i} style={{ width: Math.max(4, h / 6), borderRadius: 3, background: color, height: h * (0.25 + 0.75 * Math.abs(Math.sin(t * (7 + i * 1.3) + i * 2))) }} />
    ))}
  </div>
);

// ---------- chrome ----------
const StatusBar: React.FC<{ time: string; tint?: string }> = ({ time, tint = C.text }) => (
  <div style={{ position: "absolute", top: 46, left: 64, right: 64, display: "flex", justifyContent: "space-between", fontFamily: fonts.sans, fontWeight: 700, fontSize: 34, color: tint, opacity: 0.9 }}>
    <span>{time}</span>
    <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
      <span style={{ fontSize: 26, letterSpacing: 2 }}>5G</span>
      <span style={{ width: 54, height: 26, borderRadius: 8, border: `3px solid ${tint}`, padding: 3, boxSizing: "border-box" }}>
        <span style={{ display: "block", width: "70%", height: "100%", background: tint, borderRadius: 3 }} />
      </span>
    </span>
  </div>
);

const Backdrop: React.FC<{ tint?: string; alarm?: number }> = ({ tint = "#12203F", alarm = 0 }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 60% at 50% 20%, ${tint}, transparent 70%)` }} />
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 70% at 50% 60%, rgba(255,40,60,.28), transparent 75%)`, opacity: alarm }} />
  </AbsoluteFill>
);

const CallControls: React.FC<{ y: number }> = ({ y }) => (
  <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 36 }}>
    {["#2A3140", "#2A3140", "#2A3140", C.red].map((bg, i) => (
      <div key={i} style={{ width: 120, height: 120, borderRadius: 60, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: i === 3 ? 56 : 40, height: i === 3 ? 18 : 40, borderRadius: i === 1 ? 20 : 9, background: "#fff", opacity: 0.92 }} />
      </div>
    ))}
  </div>
);

/** The five-tile call layout, shared by the hook, the call and the reveal. */
const CallGrid: React.FC<{
  shown?: number[]; // 0..1 per tile
  wire?: number[];
  glitch?: number[];
  talk?: number;
  voices?: boolean;
  title?: string;
  rec?: boolean;
}> = ({ shown = [1, 1, 1, 1, 1], wire = [0, 0, 0, 0, 0], glitch = [0, 0, 0, 0, 0], talk = 0, voices, title = "Confidential · Finance call", rec }) => {
  const t = useT();
  const cell = (i: number, node: React.ReactNode, x: number, y: number) => (
    <div key={i} style={{ position: "absolute", left: x, top: y, opacity: Math.min(1, shown[i] * 2), transform: `scale(${0.7 + 0.3 * shown[i]})` }}>{node}</div>
  );
  return (
    <>
      <div style={{ position: "absolute", top: 120, left: 60, right: 60, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: fonts.sans, fontWeight: 700, fontSize: 36, color: C.text }}>
        <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 18, height: 18, borderRadius: 9, background: C.red, opacity: rec ? 0.4 + 0.6 * Math.abs(Math.sin(t * 3)) : 0 }} />
          {title}
        </span>
        <span style={{ color: C.dim, fontFamily: fonts.mono, fontSize: 30 }}>{shown.filter((s) => s > 0.5).length + 1} in call</span>
      </div>
      {cell(0, <Tile p={PEOPLE[0]} w={1000} h={620} wire={wire[0]} glitch={glitch[0]} talk={talk === 0} active={talk === 0} />, 40, 196)}
      {[1, 2, 3, 4].map((i) =>
        cell(
          i,
          <Tile p={PEOPLE[i]} w={490} h={330} wire={wire[i]} glitch={glitch[i]} talk={voices || talk === i} active={talk === i} />,
          40 + ((i - 1) % 2) * 510,
          836 + Math.floor((i - 1) / 2) * 350,
        ),
      )}
      <CallControls y={1570} />
    </>
  );
};

// ---------- captions ----------
const Captions: React.FC<{ from?: number }> = ({ from = 3 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let gi = -1;
  for (let i = 0; i < CAPTIONS.length; i++) if (CAPTIONS[i][0].t <= t + 0.04) gi = i;
  if (gi < 0) return null;
  const g = CAPTIONS[gi];
  const last = g[g.length - 1].t;
  const next = CAPTIONS[gi + 1]?.[0].t ?? 999;
  if (g[0].t < from || t > Math.min(next, last + 1.3)) return null;
  const chars = g.map((w) => w.w).join(" ").length;
  const size = chars > 17 ? 96 : chars > 12 ? 112 : 132;
  return (
    <div style={{ position: "absolute", top: 1045, left: 30, right: 30, height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: "-40px 0", background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,0,0,.6), transparent 75%)" }} />
      <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${size * 0.24}px`, lineHeight: 1.02 }}>
        {g.filter((w) => t >= w.t - 0.04).map((w, i) => {
          const s = spring({ frame: frame - Math.round((w.t - 0.04) * FPS), fps: FPS, config: springs.pop, durationInFrames: 10 });
          return (
            <span
              key={i}
              style={{
                fontFamily: fonts.sans,
                fontWeight: 800,
                fontSize: size,
                textTransform: "uppercase",
                color: w.e ? C.yellow : "#fff",
                WebkitTextStroke: "16px #000",
                paintOrder: "stroke fill",
                textShadow: "0 8px 0 #000, 0 14px 30px rgba(0,0,0,.7)",
                transform: `scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * (i % 2 ? 4 : -4)}deg)`,
                display: "inline-block",
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------- scenes ----------
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const punch = spring({ frame: frame + 6, fps: FPS, config: springs.slam });
  const flick = t > 1.2 && t < 1.5 ? 0.6 : t > 2.9 ? ramp(t, 2.9, 3.4) : 0;
  const chip = (text: string, at: number) => {
    const s = spring({ frame: frame - at * FPS, fps: FPS, config: springs.pop });
    return (
      <span style={{ padding: "12px 28px", borderRadius: 16, background: "#fff", color: "#000", fontFamily: fonts.sans, fontWeight: 800, fontSize: 54, transform: `scale(${s})`, display: "inline-block" }}>{text}</span>
    );
  };
  return (
    <>
      <Backdrop />
      <StatusBar time="10:42" />
      <CallGrid rec glitch={[flick, 0, 0, 0, 0]} wire={[t > 1.2 && t < 1.5 ? 0.55 : 0, 0, 0, 0, 0]} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,.82) 50%, rgba(0,0,0,.82) 72%, transparent 92%)" }} />
      <div style={{ position: "absolute", top: 850, left: 0, right: 0, textAlign: "center", transform: `scale(${0.85 + 0.15 * punch})` }}>
        <div style={{ fontFamily: fonts.display, fontSize: 150, lineHeight: 0.95, color: "#fff", letterSpacing: 2 }}>THIS CALL COST</div>
        <div style={{ fontFamily: fonts.display, fontSize: 290, lineHeight: 0.92, color: C.yellow, textShadow: "0 10px 60px rgba(255,225,74,.35)" }}>$25 MILLION</div>
        <div style={{ marginTop: 34, display: "flex", justifyContent: "center", gap: 20 }}>
          {chip("JANUARY 2024", 0.1)}
          {chip("HONG KONG", 2.3)}
        </div>
      </div>
    </>
  );
};

const Bubble: React.FC<{ at: number; me?: boolean; children: React.ReactNode; big?: boolean; color?: string }> = ({ at, me, children, big, color }) => {
  const s = useSpring(at, "pop");
  const t = useT();
  if (t < at) return null;
  return (
    <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginTop: 22 }}>
      <div
        style={{
          maxWidth: 800,
          padding: big ? "30px 38px" : "22px 30px",
          borderRadius: 36,
          borderBottomLeftRadius: me ? 36 : 8,
          borderBottomRightRadius: me ? 8 : 36,
          background: color ?? (me ? C.blue : C.panel2),
          color: "#fff",
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: big ? 62 : 40,
          lineHeight: 1.15,
          transform: `scale(${0.5 + 0.5 * s})`,
          transformOrigin: me ? "100% 100%" : "0% 100%",
          boxShadow: "0 14px 40px rgba(0,0,0,.4)",
        }}
      >
        {children}
      </div>
    </div>
  );
};

const Avatar: React.FC<{ p: Person; size: number }> = ({ p, size }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, overflow: "hidden", flexShrink: 0 }}>
    <Tile p={p} w={size} h={size} hideLabel radius={0} />
  </div>
);

const MessageScene: React.FC = () => {
  const t = useT();
  const drop = useSpring(6.3, "pop");
  const urgent = t > 10.65 ? 0.5 + 0.5 * Math.sin(t * 14) : 0;
  return (
    <>
      <Backdrop />
      <StatusBar time="09:14" />
      {/* work chat */}
      <div style={{ position: "absolute", top: 130, left: 40, right: 40, height: 1640, borderRadius: 44, background: C.panel, border: `2px solid ${C.line}`, overflow: "hidden" }}>
        <div style={{ padding: "34px 40px", borderBottom: `2px solid ${C.line}`, display: "flex", alignItems: "center", gap: 24 }}>
          <Avatar p={PEOPLE[0]} size={110} />
          <div>
            <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 50, color: C.text }}>Chief Financial Officer</div>
            <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 32, color: C.dim }}>London · Head office</div>
          </div>
        </div>
        <div style={{ padding: "10px 40px" }}>
          <div style={{ textAlign: "center", fontFamily: fonts.mono, fontSize: 28, color: C.dim, margin: "26px 0 6px" }}>TODAY · HONG KONG OFFICE</div>
          {t < 6.3 && t > 5.2 && (
            <div style={{ marginTop: 30, display: "flex", gap: 12, padding: "26px 30px", background: C.panel2, borderRadius: 36, width: 150 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: C.dim, opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 6 + i)) }} />
              ))}
            </div>
          )}
          <Bubble at={6.3} big>
            I need your help with a <span style={{ color: C.yellow }}>confidential transaction.</span>
          </Bubble>
          <Bubble at={9.3} big>
            🔒 Keep this secret. Tell no one.
          </Bubble>
          <Bubble at={10.65} big color={`rgb(${150 + 105 * urgent}, 40, 60)`}>
            It needs to happen <u>today.</u>
          </Bubble>
        </div>
      </div>
      {/* notification banner */}
      {t > 6.3 && t < 9 && (
        <div style={{ position: "absolute", top: 40 - (1 - drop) * 260, left: 40, right: 40, padding: "26px 32px", borderRadius: 36, background: "rgba(40,46,60,.96)", border: `2px solid ${C.line}`, display: "flex", gap: 22, alignItems: "center", opacity: ramp(t, 8.6, 9, 1, 0), boxShadow: "0 20px 60px rgba(0,0,0,.6)" }}>
          <div style={{ width: 76, height: 76, borderRadius: 20, background: C.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>✉️</div>
          <div style={{ fontFamily: fonts.sans, color: C.text }}>
            <div style={{ fontWeight: 800, fontSize: 36 }}>New message · CFO</div>
            <div style={{ fontWeight: 700, fontSize: 30, color: C.dim }}>Confidential transaction…</div>
          </div>
        </div>
      )}
    </>
  );
};

const CallScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const joined = t >= 13.75;
  const at = [14.4, 15.7, 16.0, 16.3, 16.6];
  const shown = at.map((a) => spring({ frame: frame - a * FPS, fps: FPS, config: springs.pop }));
  const press = t > 13.55 && t < 13.75 ? 0.92 : 1;
  const ringPulse = 1 + 0.04 * Math.sin(t * 20);
  return (
    <>
      <Backdrop />
      <StatusBar time="09:31" />
      {joined ? (
        <CallGrid shown={shown} rec talk={t < 15.7 ? 0 : t < 17.1 ? -1 : t < 18.3 ? -1 : -1} voices={t > 18.3} />
      ) : (
        <div style={{ position: "absolute", top: 330, left: 80, right: 80, padding: "70px 50px", borderRadius: 56, background: C.panel, border: `2px solid ${C.line}`, textAlign: "center", boxShadow: "0 30px 90px rgba(0,0,0,.6)" }}>
          <div style={{ display: "flex", justifyContent: "center", transform: `scale(${ringPulse})` }}>
            <Avatar p={PEOPLE[0]} size={300} />
          </div>
          <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 70, color: C.text, marginTop: 36 }}>CFO · London</div>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 40, color: C.dim, marginTop: 8 }}>invites you to a video call</div>
          <div style={{ margin: "60px auto 0", width: 620, padding: "38px 0", borderRadius: 60, background: C.green, color: "#04130A", fontFamily: fonts.sans, fontWeight: 800, fontSize: 64, transform: `scale(${press})`, boxShadow: `0 0 ${40 + 30 * Math.sin(t * 8)}px rgba(47,214,123,.6)` }}>JOIN CALL</div>
        </div>
      )}
      {!joined && <Cursor x={ramp(t, 12.6, 13.5, 900, 560)} y={ramp(t, 12.6, 13.5, 1500, 1010)} />}
    </>
  );
};

const Cursor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={90} height={90} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.6))" }}>
    <path d="M4 2 L4 19 L8.5 15 L11.5 22 L14.5 20.7 L11.5 14 L18 14Z" fill="#fff" stroke="#000" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

const N_TRANSFERS = 15;
const transferTime = (n: number) => (n === 1 ? 21.9 : 22.55 + ((n - 2) / 13) * 1.05); // 15 lands on "them"
const BankScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let count = 0;
  for (let n = 1; n <= N_TRANSFERS; n++) if (t >= transferTime(n)) count = n;
  const lastAt = count ? transferTime(count) : 0;
  const bump = count ? spring({ frame: frame - lastAt * FPS, fps: FPS, config: springs.pop, durationInFrames: 8 }) : 1;
  const pip = useSpring(19.75, "pop");
  const rows = Array.from({ length: count }, (_, i) => i + 1).slice(-4).reverse();
  return (
    <>
      <Backdrop tint="#0E3324" />
      <StatusBar time="10:05" />
      <div style={{ position: "absolute", top: 130, left: 60, fontFamily: fonts.sans, fontWeight: 800, fontSize: 44, color: C.text }}>
        Business Banking <span style={{ color: C.dim, fontWeight: 700 }}>· Transfers</span>
      </div>
      {/* CFO still on the call, giving the order */}
      <div style={{ position: "absolute", top: 210, left: 40, display: "flex", alignItems: "center", gap: 20, transform: `scale(${pip})`, transformOrigin: "0 50%" }}>
        <Tile p={PEOPLE[0]} w={300} h={220} talk={t < 21.5} label="CFO" active />
        {t < 21.6 && (
          <div style={{ padding: "26px 34px", borderRadius: 36, borderBottomLeftRadius: 8, background: C.panel2, color: "#fff", fontFamily: fonts.sans, fontWeight: 800, fontSize: 56 }}>“Make the transfers.”</div>
        )}
      </div>
      {/* counter */}
      <div style={{ position: "absolute", top: 460, left: 40, right: 40, height: 520, borderRadius: 48, background: C.panel, border: `2px solid ${C.line}`, textAlign: "center" }}>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 40, color: C.dim, marginTop: 44, letterSpacing: 6 }}>TRANSFERS SENT</div>
        <div style={{ fontFamily: fonts.display, fontSize: 380, lineHeight: 1, color: count >= 15 ? C.yellow : C.green, transform: `scale(${0.85 + 0.15 * bump})` }}>
          {count}
          <span style={{ fontSize: 150, color: C.dim }}> / 15</span>
        </div>
      </div>
      {/* latest transfers */}
      <div style={{ position: "absolute", top: 1010, left: 40, right: 40 }}>
        {rows.map((n, i) => (
          <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 34px", marginBottom: 12, borderRadius: 26, background: C.panel2, opacity: 1 - i * 0.22, fontFamily: fonts.mono, fontWeight: 700, fontSize: 36, color: C.text }}>
            <span>Transfer {String(n).padStart(2, "0")} → Account {((n - 1) % 5) + 1}</span>
            <span style={{ color: C.green }}>SENT ✓</span>
          </div>
        ))}
      </div>
      {/* five accounts */}
      <div style={{ position: "absolute", top: 1420, left: 40, right: 40, display: "flex", gap: 16 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const s = spring({ frame: frame - (23.75 + i * 0.2) * FPS, fps: FPS, config: springs.pop });
          return (
            <div key={i} style={{ flex: 1, height: 230, borderRadius: 28, background: `linear-gradient(160deg, #1F6B46, #0F2E20)`, border: `3px solid ${C.green}`, transform: `scale(${s})`, padding: 18, boxSizing: "border-box", fontFamily: fonts.mono, color: "#fff" }}>
              <div style={{ fontSize: 24, opacity: 0.7 }}>ACCOUNT</div>
              <div style={{ fontFamily: fonts.display, fontSize: 120, lineHeight: 1 }}>{i + 1}</div>
              <div style={{ fontSize: 22, opacity: 0.7 }}>•••• ••••</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const TotalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const hk = ramp(t, 25.3, 27.2, 0, 200_000_000, Easing.out(Easing.quad));
  const done = t >= 27.2;
  const slam1 = spring({ frame: frame - 27.2 * FPS, fps: FPS, config: springs.slam });
  const slam2 = spring({ frame: frame - 28.05 * FPS, fps: FPS, config: springs.slam });
  const shake = t > 28.05 && t < 28.5 ? (random(`s${frame}`) - 0.5) * 26 * (1 - ramp(t, 28.05, 28.5)) : 0;
  return (
    <>
      <Backdrop tint="#3A1016" alarm={ramp(t, 27.2, 28.4)} />
      <StatusBar time="16:48" />
      <div style={{ position: "absolute", inset: 0, transform: `translate(${shake}px, ${-shake}px)` }}>
        <div style={{ position: "absolute", top: 250, left: 0, right: 0, textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 44, letterSpacing: 8, color: C.dim }}>TOTAL SENT</div>
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily: fonts.display, color: "#fff", transform: `scale(${done ? 0.9 + 0.1 * slam1 : 1})` }}>
          <div style={{ fontSize: 130, color: C.dim, lineHeight: 1 }}>HK$</div>
          <div style={{ fontSize: 215, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{fmt(hk)}</div>
        </div>
        <div style={{ position: "absolute", top: 690, left: 100, right: 100, height: 18, borderRadius: 9, background: C.line, overflow: "hidden" }}>
          <div style={{ width: `${(hk / 2e8) * 100}%`, height: "100%", background: C.red }} />
        </div>
        {t >= 28.05 && (
          <div style={{ position: "absolute", top: 1400, left: 0, right: 0, textAlign: "center", fontFamily: fonts.display, transform: `scale(${2.2 - 1.2 * slam2}) rotate(-3deg)`, opacity: Math.min(1, slam2 * 3) }}>
            <div style={{ fontSize: 90, color: "#fff", lineHeight: 1 }}>THAT'S ABOUT</div>
            <div style={{ fontSize: 200, color: C.yellow, lineHeight: 0.95, textShadow: "0 10px 80px rgba(255,225,74,.4)" }}>US$25,000,000</div>
          </div>
        )}
        <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 44, color: C.text, opacity: 0.85 }}>
          15 transfers · 5 accounts
        </div>
      </div>
    </>
  );
};

const HeadOfficeScene: React.FC = () => {
  const t = useT();
  const connected = t >= 31.35;
  const secs = Math.max(0, Math.floor(t - 31.35));
  const cold = ramp(t, 33.3, 34.2);
  return (
    <>
      <Backdrop tint="#12203F" alarm={cold} />
      <StatusBar time="17:02" />
      <div style={{ position: "absolute", top: 170, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ width: 260, height: 260, borderRadius: 130, margin: "0 auto", background: "linear-gradient(160deg,#2B3550,#151B2B)", border: `4px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 130, boxShadow: connected ? "none" : `0 0 0 ${20 + 20 * Math.abs(Math.sin(t * 4))}px rgba(61,123,255,.18)` }}>🏢</div>
        <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 84, color: C.text, marginTop: 30 }}>Head Office · UK</div>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 44, color: connected ? C.green : C.dim, marginTop: 8, display: "flex", justifyContent: "center", gap: 18, alignItems: "center" }}>
          {connected ? (
            <>
              <VoiceBars t={t} h={40} n={6} /> 00:0{secs}
            </>
          ) : (
            `calling${".".repeat(1 + (Math.floor(t * 3) % 3))}`
          )}
        </div>
      </div>
      <div style={{ position: "absolute", top: 700, left: 50, right: 50 }}>
        <Bubble at={31.5} me big>
          Just confirming the transfers went through.
        </Bubble>
        {t > 32.6 && t < 33.3 && (
          <div style={{ marginTop: 30, display: "flex", gap: 12, padding: "26px 30px", background: C.panel2, borderRadius: 36, width: 150 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 22, height: 22, borderRadius: 11, background: C.dim, opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 8 + i)) }} />
            ))}
          </div>
        )}
      </div>
      {t >= 33.3 && (
        <div style={{ position: "absolute", top: 1400, left: 50, right: 50 }}>
          <Bubble at={33.3} big color="#fff">
            <span style={{ color: "#000", fontSize: 120, fontWeight: 800 }}>“What transfers?”</span>
          </Bubble>
        </div>
      )}
    </>
  );
};

const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const hit = [37.9, 39.1, 39.4, 39.7, 40.0];
  const wire = hit.map((h) => ramp(t, h, h + 0.5));
  const glitch = hit.map((h) => (t > h - 0.15 && t < h + 0.6 ? 1 - Math.abs((t - h - 0.2) / 0.45) * 0.7 : 0));
  // slow push toward the CFO before the reveal, then pull back for the others
  const zoom = ramp(t, 35.8, 37.9, 1, 1.25, Easing.inOut(Easing.cubic)) - ramp(t, 38.7, 39.2, 0, 0.25, Easing.inOut(Easing.cubic));
  const stamp = spring({ frame: frame - 40.75 * FPS, fps: FPS, config: springs.slam });
  const scan = ((t * 0.6) % 1) * 1920;
  const info = t >= 41.7;
  return (
    <>
      <Backdrop tint={t > 37.9 ? "#0A2A18" : "#12203F"} alarm={ramp(t, 37.9, 38.3) * 0.6} />
      <StatusBar time="09:31" />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 26%" }}>
        <CallGrid wire={wire} glitch={glitch} talk={t < 37.9 ? 0 : -1} title={t > 40 ? "0 real people in call" : "Confidential · Finance call"} rec />
      </div>
      {t > 37.9 && <div style={{ position: "absolute", left: 0, right: 0, top: scan, height: 6, background: C.wire, opacity: 0.35, boxShadow: `0 0 40px ${C.wire}` }} />}
      {t >= 40.75 && (
        <div style={{ position: "absolute", top: 370, left: 0, right: 0, textAlign: "center", transform: `scale(${2.4 - 1.4 * stamp}) rotate(-7deg)`, opacity: Math.min(1, stamp * 3) }}>
          <span style={{ fontFamily: fonts.display, fontSize: 250, color: C.red, border: `14px solid ${C.red}`, borderRadius: 30, padding: "0 40px", background: "rgba(9,11,16,.82)", letterSpacing: 6 }}>DEEPFAKE</span>
        </div>
      )}
      {info && (
        <div style={{ position: "absolute", top: 1560, left: 40, right: 40, display: "flex", gap: 20 }}>
          {["FACE", "VOICE"].map((k, i) => {
            const s = spring({ frame: frame - (i ? 44.0 : 43.3) * FPS, fps: FPS, config: springs.pop });
            return (
              <div key={k} style={{ flex: 1, padding: "26px 30px", borderRadius: 30, background: "rgba(4,17,10,.95)", border: `3px solid ${C.wire}`, transform: `scale(${s})`, fontFamily: fonts.mono, fontWeight: 700, color: C.wire, fontSize: 44, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{k}: CLONED</span>
                {i ? <VoiceBars t={t} color={C.wire} h={50} n={5} /> : <span style={{ fontSize: 50 }}>◈</span>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const ArupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const slam = spring({ frame: frame - 45.75 * FPS, fps: FPS, config: springs.slam });
  const draw = ramp(t, 47.0, 48.4, 0, 1, Easing.inOut(Easing.quad));
  return (
    <>
      <Backdrop tint="#132B4A" />
      <StatusBar time="Feb 2024" />
      <div style={{ position: "absolute", top: 150, left: 40, right: 40, height: 1560, borderRadius: 44, background: "#F4F1EA", overflow: "hidden" }}>
        <div style={{ padding: "26px 34px", background: "#E2DED4", display: "flex", gap: 14, alignItems: "center" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 26, height: 26, borderRadius: 13, background: c }} />
          ))}
          <div style={{ flex: 1, marginLeft: 16, padding: "14px 26px", borderRadius: 30, background: "#fff", fontFamily: fonts.mono, fontSize: 30, color: "#555" }}>news · deepfake fraud · hong kong</div>
        </div>
        <div style={{ padding: "50px 54px", color: "#111" }}>
          <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 36, color: C.red, letterSpacing: 4 }}>THE VICTIM WAS</div>
          <div style={{ fontFamily: fonts.display, fontSize: 420, lineHeight: 0.95, transform: `scale(${t >= 45.75 ? 1.6 - 0.6 * slam : 0})`, transformOrigin: "0 60%", opacity: Math.min(1, slam * 3) }}>ARUP</div>
          <div style={{ height: 8, background: "#111", width: `${ramp(t, 45.9, 46.4) * 100}%` }} />
          <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 66, lineHeight: 1.1, marginTop: 30, opacity: ramp(t, 46.3, 46.7) }}>
            The engineers behind the <span style={{ background: C.yellow, padding: "0 10px" }}>Sydney Opera House.</span>
          </div>
          <svg viewBox="0 0 400 190" style={{ position: "absolute", left: 120, top: 1180, width: 760 }}>
            <g fill="none" stroke="#111" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw}>
              <path pathLength={1} d="M20 160 L380 160" />
              <path pathLength={1} d="M50 160 Q60 70 130 40 Q118 110 132 160" />
              <path pathLength={1} d="M112 160 Q130 60 205 22 Q186 100 196 160" />
              <path pathLength={1} d="M180 160 Q205 90 262 62 Q246 120 252 160" />
              <path pathLength={1} d="M262 160 Q292 105 344 92 Q330 130 334 160" />
              <path pathLength={1} d="M20 175 L380 175" />
            </g>
          </svg>
        </div>
      </div>
    </>
  );
};

const CaseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const row = (label: string, value: string, at: number, y: number) => {
    const s = spring({ frame: frame - at * FPS, fps: FPS, config: springs.slam });
    return (
      <div style={{ position: "absolute", top: y, left: 40, right: 40, height: 330, borderRadius: 40, background: C.panel, border: `2px solid ${C.line}`, padding: "36px 46px", boxSizing: "border-box" }}>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 46, color: C.dim, letterSpacing: 4 }}>{label}</div>
        {frame >= at * FPS && (
          <div style={{ position: "absolute", right: 50, top: 50, transform: `scale(${2.6 - 1.6 * s}) rotate(${-6}deg)`, opacity: Math.min(1, s * 3), fontFamily: fonts.display, fontSize: 230, lineHeight: 1, color: C.red, border: `12px solid ${C.red}`, borderRadius: 26, padding: "0 36px" }}>{value}</div>
        )}
      </div>
    );
  };
  return (
    <>
      <Backdrop tint="#3A1016" alarm={0.5} />
      <StatusBar time="Today" />
      <div style={{ position: "absolute", top: 190, left: 60, fontFamily: fonts.display, fontSize: 130, color: C.text, letterSpacing: 3 }}>CASE STATUS</div>
      <div style={{ position: "absolute", top: 330, left: 60, fontFamily: fonts.mono, fontWeight: 700, fontSize: 38, color: C.dim }}>Hong Kong · deepfake fraud · HK$200M</div>
      {row("ARRESTS", "0", 49.95, 460)}
      {row("MONEY", "GONE", 52.0, 1380)}
    </>
  );
};

const BossScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const buzz = Math.sin(t * 60) * (((t - 52.9) % 1.5) < 0.7 ? 7 : 0) * (t < 56.75 ? 1 : 0);
  const doubt = t > 55.3;
  const flick = doubt ? (t > 56.75 ? 0.5 : random(`f${Math.floor(frame / 3)}`) > 0.55 ? 0.45 : 0) : 0;
  const g = doubt ? (t > 56.75 ? (t < 57.0 ? 1 : 0.12) : flick > 0 ? 0.6 : 0) : 0;
  const ring = 1 + 0.05 * Math.sin(t * 9);
  return (
    <>
      <Backdrop tint="#1A2C52" alarm={doubt ? 0.35 : 0} />
      <StatusBar time="Now" />
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${buzz}px)` }}>
        <div style={{ position: "absolute", top: 150, left: 0, right: 0, textAlign: "center", fontFamily: fonts.sans, fontWeight: 700, fontSize: 46, color: C.dim }}>Incoming video call…</div>
        <div style={{ position: "absolute", top: 250, left: 190, width: 700, height: 700, borderRadius: 350, overflow: "hidden", boxShadow: `0 0 0 ${10 * ring}px ${doubt ? C.red : C.blue}, 0 0 120px rgba(61,123,255,.4)` }}>
          <Tile p={BOSS} w={700} h={700} radius={0} hideLabel wire={flick} glitch={g} />
        </div>
        <div style={{ position: "absolute", top: 965, left: 0, right: 0, textAlign: "center", fontFamily: fonts.sans, fontWeight: 800, fontSize: 96, color: C.text }}>Boss</div>
        <div style={{ position: "absolute", top: 1440, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 240 }}>
          {[C.red, C.green].map((c, i) => (
            <div key={c} style={{ textAlign: "center", fontFamily: fonts.sans, fontWeight: 700, fontSize: 36, color: C.text }}>
              <div style={{ width: 190, height: 190, borderRadius: 95, background: c, marginBottom: 14, transform: `scale(${i ? ring : 1})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 84, height: 30, borderRadius: 15, background: "#fff", transform: `rotate(${i ? -45 : 0}deg)` }} />
              </div>
              {i ? "Accept" : "Decline"}
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 60, left: 0, right: 0, textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: C.dim }}>THE ONION ARCHIVE</div>
    </>
  );
};

// ---------- sound ----------
type Cue = [file: string, at: number, vol?: number];
const SFX: Cue[] = [
  ["boom", 0, 0.8], ["glitch", 1.2, 0.35], ["pop", 0.1, 0.5], ["pop", 2.3, 0.6], ["glitch", 2.95, 0.3],
  ["whoosh", 3.45, 0.5], ["type", 5.2, 0.25], ["notify", 6.3, 0.7], ["notify", 9.3, 0.55], ["notify", 10.65, 0.6], ["slam", 11.9, 0.45],
  ["whoosh", 12.25, 0.5], ["ring", 12.4, 0.4], ["click", 13.58, 0.9], ["join", 13.8, 0.5],
  ["pop", 14.4, 0.6], ["join", 15.7, 0.35], ["pop", 16.0, 0.5], ["pop", 16.3, 0.5], ["pop", 16.6, 0.5], ["riser", 18.1, 0.2],
  ["whoosh", 19.55, 0.5], ["pop", 19.75, 0.5],
  ...Array.from({ length: N_TRANSFERS }, (_, i): Cue => ["coin", transferTime(i + 1), i === 14 ? 0.6 : 0.35]),
  ...Array.from({ length: N_TRANSFERS }, (_, i): Cue => ["click", transferTime(i + 1), 0.7]),
  ...[0, 1, 2, 3, 4].map((i): Cue => ["snap", 23.75 + i * 0.2, 0.5]),
  ["whoosh", 25.1, 0.5], ["riser", 25.6, 0.5],
  ...Array.from({ length: 18 }, (_, i): Cue => ["click", 25.35 + i * 0.1, 0.5]),
  ["slam", 27.2, 0.7], ["boom", 28.05, 1], ["crash", 28.05, 0.3],
  ["whoosh", 30.15, 0.5], ["dial", 30.3, 0.35], ["click", 31.35, 0.9], ["pop", 31.5, 0.5], ["type", 32.6, 0.2], ["error", 33.3, 0.55], ["boom", 33.3, 0.6],
  ["whoosh", 35.65, 0.5], ["riser", 36.3, 0.6], ["glitch", 37.8, 0.9], ["crash", 37.9, 0.5], ["boom", 37.92, 0.9],
  ["glitch", 39.05, 0.6], ["glitch", 39.35, 0.6], ["glitch", 39.65, 0.6], ["glitch", 39.95, 0.6],
  ["stamp", 40.75, 0.9], ["slam", 40.75, 0.6], ["snap", 43.3, 0.5], ["snap", 44.0, 0.5],
  ["whoosh", 44.95, 0.5], ["slam", 45.75, 0.7], ["type", 46.4, 0.18],
  ["whoosh", 48.9, 0.5], ["stamp", 49.95, 0.9], ["stamp", 52.0, 0.9], ["boom", 52.0, 0.8],
  ["whoosh", 52.75, 0.5], ["ring", 52.95, 0.4], ["ring", 54.45, 0.4], ["glitch", 55.3, 0.5], ["glitch", 56.0, 0.3], ["glitch", 56.72, 0.9], ["boom", 56.78, 0.9],
];

const Sound: React.FC = () => (
  <>
    <Audio src={staticFile("audio/shorts/deepfake.mp3")} />
    <Audio
      src={staticFile("sfx/bed.wav")}
      volume={(f) => interpolate(f, [0, 30, 1700, 1740], [0, 0.26, 0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
    {SFX.map(([file, at, vol = 0.5], i) => (
      <Sequence key={i} from={Math.round(at * FPS)} layout="none">
        <Audio src={staticFile(`sfx/${file}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </>
);

// ---------- composition ----------
export const ShortDeepfake: React.FC = () => {
  const t = useT();
  // white flash on the hard hits
  const flash = [28.05, 37.9, 40.75, 56.75].reduce((a, h) => Math.max(a, t >= h ? 1 - ramp(t, h, h + 0.25) : 0), 0);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Scene from={-1} to={3.5}><Hook /></Scene>
      <Scene from={3.5} to={12.3}><MessageScene /></Scene>
      <Scene from={12.3} to={19.6}><CallScene /></Scene>
      <Scene from={19.6} to={25.15}><BankScene /></Scene>
      <Scene from={25.15} to={30.2} push={0.03}><TotalScene /></Scene>
      <Scene from={30.2} to={35.7}><HeadOfficeScene /></Scene>
      <Scene from={35.7} to={45.0} push={0}><RevealScene /></Scene>
      <Scene from={45.0} to={48.95}><ArupScene /></Scene>
      <Scene from={48.95} to={52.8}><CaseScene /></Scene>
      <Scene from={52.8} to={60} push={0.04}><BossScene /></Scene>
      <Captions from={3} />
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.5, pointerEvents: "none" }} />
      <AbsoluteFill style={{ background: "repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 2px, transparent 2px 6px)", pointerEvents: "none" }} />
      <Sound />
    </AbsoluteFill>
  );
};
