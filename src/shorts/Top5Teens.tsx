import React, { useMemo } from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { colors, fonts, springs } from "../theme";
import { createCues, sp, type Word } from "../lib/timing";
import { Background, BlobCharacter, Flash, GlitchBars, OnionLogo, SeizedStamp, Sfx } from "../components";
import transcript from "../../public/shorts/top5teens/words.json";
import { Between, big, Billboard, Box, type Cam, type CamKey, clamp01, lerp, Plane, Pop2, SHORT_H, SHORT_W, ShortCaptions, Stage3D, Tag, useCam } from "./kit3d";

/*
 * Top 5 countdown: "5 teenagers who hacked the impossible" (about 4 minutes, 9:16).
 * Narration: public/shorts/top5teens/vo.mp3 (ElevenLabs v4). Word timings in words.json
 * (sherpa-onnx zipformer, mapped onto the script text).
 *
 *   hook   a 15-year-old in his bedroom opens the CIA director's inbox -> "ONLY #3"
 *   title  5 teenagers who hacked the impossible
 *   #5     Jonathan James: Pentagon backdoor, NASA space station code, 21-day shutdown, locked up
 *   #4     Mafiaboy: the big sites go dark one by one, junk traffic flood, bragged in a chat room
 *   #3     Kane Gamble: CIA director's email via a support call, Clapper's phone rerouted
 *   #2     Graham Ivan Clark: celebrity "double your Bitcoin" posts, fake help desk, caught in 16 days
 *   #1     Arion Kurtaj: Lapsus$, laptop taken, Travelodge, TV + Fire Stick loadout, 90 GTA 6 clips
 *   outro  recap + comment poll + follow
 *
 * Countdown ring on the left (like true-crime Top 5 TikToks) drains through each story.
 * Layout follows the vertical safe zone: nothing important in the top 10%, bottom 20% or
 * right 15%. Captions are small and sit around 60% down.
 * Mocked-up UI only: no real logos, photos or game footage.
 */

export const top5TeensSchema = z.object({ showCaptions: z.boolean() });
export { SHORT_W, SHORT_H };
export const TOP5_TEENS_FRAMES = 7230;

const WORDS = transcript.words as Word[];
type C = (w: string, n?: number, o?: number) => number;

/* safe zone: x 60..900, y 200..1520 */
const CX = 480;
const CAPTION_Y = 1150;
const RING_Y = 1300;

const BLUE = "#2F6BFF";
const PURPLE = "#9B6BFF";
const CYAN = "#3FD6FF";
const WHITE = "#DDE4EC";

/* ------------------------------------------------------------------ small 2D helpers */

const Win: React.FC<{ w: number; title: string; color?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ w, title, color = BLUE, children, style }) => (
  <div style={{ width: w, borderRadius: 22, background: "#0E141B", border: `5px solid ${color}`, boxShadow: `0 0 50px ${color}44, 0 24px 50px rgba(0,0,0,0.6)`, overflow: "hidden", ...style }}>
    <div style={{ height: 50, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: `${color}22`, borderBottom: `3px solid ${color}55` }}>
      {[colors.red, colors.amber, colors.green].map((cc) => (
        <div key={cc} style={{ width: 14, height: 14, borderRadius: 14, background: cc }} />
      ))}
      <div style={{ marginLeft: 12, fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: colors.text, letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{title}</div>
    </div>
    <div style={{ padding: 22 }}>{children}</div>
  </div>
);

const Pill: React.FC<{ text: string; color?: string; filled?: boolean; size?: number }> = ({ text, color = colors.amber, filled = false, size = 40 }) => (
  <div
    style={{
      display: "inline-block",
      padding: `${size * 0.18}px ${size * 0.5}px`,
      borderRadius: size * 0.25,
      border: `${Math.max(3, size * 0.09)}px solid ${color}`,
      background: filled ? color : "rgba(7,9,11,0.9)",
      ...big(size * 1.2, filled ? colors.bg : color),
      textShadow: "none",
    }}
  >
    {text}
  </div>
);

/** Number that counts up from `at` over `dur` frames. */
const CountUp: React.FC<{ at: number; to: number; dur?: number; prefix?: string; suffix?: string; size: number; color: string; fmt?: (n: number) => string }> = ({
  at,
  to,
  dur = 24,
  prefix = "",
  suffix = "",
  size,
  color,
  fmt = (n) => Math.round(n).toLocaleString("en-US"),
}) => {
  const frame = useCurrentFrame();
  const p = clamp01((frame - at) / dur);
  const e = 1 - Math.pow(1 - p, 3);
  return (
    <div style={{ ...big(size, color) }}>
      {prefix}
      {fmt(to * e)}
      {suffix}
    </div>
  );
};

/** Slams text in (scale from big) with a thud. */
const Slam: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; sound?: boolean; rotate?: number }> = ({ at, children, style, sound = true, rotate = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = sp(frame, fps, at, springs.slam);
  return (
    <div style={{ position: "absolute", ...style, transform: `scale(${lerp(2.2, 1, s)}) rotate(${rotate}deg)`, opacity: clamp01(s * 3) }}>
      {sound ? <Sfx name="slam" at={at} volume={0.55} /> : null}
      {children}
    </div>
  );
};

/** Centred row inside the safe zone. */
const Row: React.FC<{ top: number; children: React.ReactNode; gap?: number }> = ({ top, children, gap = 20 }) => (
  <div style={{ position: "absolute", left: 60, width: 840, top, display: "flex", justifyContent: "center", alignItems: "center", gap, flexWrap: "wrap" }}>{children}</div>
);

const Shake: React.FC<{ at: number; amount?: number; children: React.ReactNode }> = ({ at, amount = 30, children }) => {
  const frame = useCurrentFrame();
  const hit = frame >= at ? Math.exp(-(frame - at) / 5) : 0;
  const dx = (random(`sx-${frame}-${at}`) - 0.5) * amount * hit;
  const dy = (random(`sy-${frame}-${at}`) - 0.5) * amount * hit;
  return <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px)` }}>{children}</AbsoluteFill>;
};

const Glow: React.FC<{ color: string; y?: number; x?: number }> = ({ color, y = 40, x = 45 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at ${x}% ${y}%, ${color}40, rgba(0,0,0,0) 55%)` }} />
);

/** Little monitor/laptop screen with scrolling code. */
const CodeScreen: React.FC<{ w: number; h: number; color: string; seed: number; dark?: boolean }> = ({ w, h, color, seed, dark = false }) => {
  const frame = useCurrentFrame();
  const lines = 7;
  return (
    <div style={{ width: w, height: h, background: dark ? "#050607" : "#071017", borderRadius: 8, overflow: "hidden", padding: 10, boxShadow: dark ? "none" : `0 0 40px ${color}88` }}>
      {!dark &&
        new Array(lines).fill(0).map((_, i) => (
          <div
            key={i}
            style={{
              height: h / (lines * 1.6),
              marginBottom: h / (lines * 4.5),
              borderRadius: 3,
              background: color,
              opacity: 0.75,
              width: `${30 + 60 * random(`cs-${seed}-${i}-${Math.floor(frame / 6 + i)}`)}%`,
            }}
          />
        ))}
    </div>
  );
};

/* ------------------------------------------------------------------ 3D bedroom / hotel room */

const RW = 760;
const RD = 620;
const RH = 520;

type RoomProps = {
  cam: Cam;
  wall: string;
  floor: string;
  accent: string;
  who: React.ReactNode;
  screen?: React.ReactNode;
  extra?: React.ReactNode;
  windowColor?: string;
  bed?: boolean;
  tv?: React.ReactNode;
  label?: string;
};

/** Cutaway room: back wall, left wall, floor, desk with screen, a character, optional bed and wall TV. */
const Room: React.FC<RoomProps> = ({ cam, wall, floor, accent, who, screen, extra, windowColor, bed = true, tv, label }) => {
  const frame = useCurrentFrame();
  return (
    <Stage3D cam={cam} cx={CX - 40} cy={760}>
      {/* floor */}
      <Plane w={RW} h={RD} t="rotateX(90deg)" style={{ background: floor, boxShadow: "0 0 120px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 76px)" }} />
      </Plane>
      {/* back wall */}
      <Plane w={RW} h={RH} t={`translate3d(0px, ${-RH / 2}px, ${-RD / 2}px)`} style={{ background: wall }}>
        {windowColor ? (
          <div style={{ position: "absolute", left: 80, top: 90, width: 190, height: 150, borderRadius: 8, border: "10px solid #2A3540", background: `linear-gradient(180deg, ${windowColor}, #0B1220)` }}>
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 8, background: "#2A3540" }} />
          </div>
        ) : null}
        {tv ? <div style={{ position: "absolute", right: 70, top: 70 }}>{tv}</div> : null}
        {label ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: "rgba(255,255,255,0.35)", letterSpacing: "0.3em" }}>{label}</div>
        ) : null}
      </Plane>
      {/* left wall */}
      <Plane w={RD} h={RH} t={`translate3d(${-RW / 2}px, ${-RH / 2}px, 0px) rotateY(90deg)`} style={{ background: `linear-gradient(90deg, ${wall}, #0A0E12)` }} />
      {/* desk + screen */}
      <Box x={150} z={-200} w={330} d={150} h={150} top="#5A4634" front="#3E2F22" side="#33271D" />
      <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translate3d(150px, -150px, -250px)` }}>
        <div style={{ position: "absolute", left: -110, top: -150, width: 220, height: 140, background: "#111", borderRadius: 10, padding: 8 }}>{screen}</div>
        <div style={{ position: "absolute", left: -12, top: -12, width: 24, height: 14, background: "#222" }} />
      </div>
      {/* light from the screen */}
      <Plane w={420} h={300} t="translate3d(150px, -2px, -110px) rotateX(90deg)" style={{ background: `radial-gradient(ellipse, ${accent}55, rgba(0,0,0,0) 70%)` }} />
      {bed ? <Box x={-210} z={40} w={260} d={420} h={70} top="#C9D2DC" front="#5B6B7C" side="#4A5866" topChildren={<div style={{ position: "absolute", left: 20, top: 20, width: 220, height: 90, borderRadius: 30, background: "#E8EDF2" }} />} /> : null}
      {extra}
      <Billboard pos={{ x: 150, y: 0, z: -90 }} cam={cam} w={260} h={300}>
        <div style={{ transform: `translateY(${Math.sin(frame / 9) * 3}px)` }}>{who}</div>
      </Billboard>
    </Stage3D>
  );
};

const roomCam = (at: number, ry = -24): CamKey[] => [
  { at, tx: 0, ty: -200, tz: 0, rx: -20, ry, dist: -200 },
  { at: at + 1, tx: 60, ty: -210, tz: -60, rx: -18, ry: ry + 8, dist: 60 },
];

/* ------------------------------------------------------------------ simple drawn props */

const Pentagon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <polygon points="50,6 94,38 77,92 23,92 6,38" fill={`${color}22`} stroke={color} strokeWidth={5} />
    <polygon points="50,30 72,46 64,72 36,72 28,46" fill="none" stroke={color} strokeWidth={4} />
  </svg>
);

const Station: React.FC<{ size: number; color: string; spin: number }> = ({ size, color, spin }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 200 120" style={{ transform: `rotate(${spin}deg)` }}>
    {[10, 40, 130, 160].map((x) => (
      <rect key={x} x={x} y={10} width={26} height={100} fill={`${color}55`} stroke={color} strokeWidth={3} />
    ))}
    <rect x={20} y={56} width={160} height={8} fill={color} />
    <rect x={78} y={40} width={44} height={40} rx={8} fill="#1A2430" stroke={color} strokeWidth={4} />
  </svg>
);

const PhoneIcon: React.FC<{ w: number; ring?: boolean; color?: string; children?: React.ReactNode }> = ({ w, ring = false, color = colors.green, children }) => {
  const frame = useCurrentFrame();
  const r = ring ? Math.sin(frame * 1.6) * 5 : 0;
  return (
    <div style={{ width: w, height: w * 1.9, borderRadius: w * 0.16, background: "#0B0F14", border: `${w * 0.05}px solid #2B3742`, transform: `rotate(${r}deg)`, boxShadow: `0 0 40px ${color}55`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "35%", right: "35%", top: w * 0.06, height: w * 0.06, borderRadius: 20, background: "#2B3742" }} />
      <div style={{ position: "absolute", inset: `${w * 0.18}px ${w * 0.07}px ${w * 0.12}px` }}>{children}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ countdown ring */

const Ring: React.FC<{ n: number; start: number; end: number; name: string; sub: string; color: string }> = ({ n, start, end, name, sub, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = sp(frame, fps, start, springs.pop);
  const p = clamp01((frame - start) / Math.max(1, end - start));
  const R = 62;
  const circ = 2 * Math.PI * R;
  const out = clamp01((frame - (end - 6)) / 6);
  return (
    <div style={{ position: "absolute", left: 60, top: RING_Y, display: "flex", alignItems: "center", gap: 22, opacity: 1 - out }}>
      <div style={{ position: "relative", width: 160, height: 160, transform: `scale(${enter})` }}>
        <svg width={160} height={160} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
          <circle cx={80} cy={80} r={R} fill="rgba(7,9,11,0.75)" stroke="rgba(255,255,255,0.15)" strokeWidth={12} />
          <circle cx={80} cy={80} r={R} fill="none" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * p} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...big(118, "#FFFFFF"), paddingTop: 10 }}>{n}</div>
      </div>
      <div style={{ transform: `translateX(${(1 - enter) * -40}px)`, opacity: enter }}>
        <div style={{ ...big(66, color) }}>{name}</div>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, color: colors.text, letterSpacing: "0.06em", marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

/** Big "NUMBER X" card at the start of each story. */
const NumberCard: React.FC<{ at: number; n: number; color: string }> = ({ at, n, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dur = 26;
  if (frame < at || frame > at + dur) return null;
  const s = sp(frame, fps, at, springs.slam);
  const o = 1 - clamp01((frame - at - dur + 8) / 8);
  return (
    <AbsoluteFill style={{ background: `rgba(7,9,11,${0.82 * o})` }}>
      <Sfx name="whoosh" at={at} volume={0.6} />
      <div style={{ position: "absolute", left: 60, width: 840, top: 330, textAlign: "center", opacity: o, transform: `scale(${lerp(1.8, 1, s)})` }}>
        <div style={{ ...big(110, colors.text) }}>NUMBER</div>
        <div style={{ ...big(460, color) }}>{n}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ HOOK */

const Hook: React.FC<{ c: C; end: number }> = ({ c, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tDir = c("director");
  const tBed = c("bedroom");
  const tOnly = c("only");
  const cam = useCam([
    { at: 0, tx: 40, ty: -190, tz: -80, rx: -16, ry: -18, dist: 220 },
    { at: 4, tx: 80, ty: -200, tz: -120, rx: -14, ry: -10, dist: 330 },
    { at: tOnly, tx: 0, ty: -200, tz: 0, rx: -22, ry: -30, dist: -120 },
  ]);
  const inbox = sp(frame, fps, tDir, springs.snappy);
  return (
    <AbsoluteFill>
      <Glow color={colors.red} y={30} />
      <Room
        cam={cam}
        wall="#1A2230"
        floor="#2A2F3A"
        accent={colors.red}
        windowColor="#1B2B4A"
        who={<BlobCharacter color={BLUE} accessory="hoodie" size={230} lightColor={colors.red} lightAmount={0.5} look={{ x: 0.6, y: -0.2 }} />}
        screen={<CodeScreen w={204} h={124} color={colors.red} seed={1} />}
      />
      {/* headline on screen at frame 0 */}
      <div style={{ position: "absolute", left: 60, width: 840, top: 210, textAlign: "center" }}>
        <Pill text="AGE 15" color={colors.amber} filled size={56} />
      </div>
      {/* inbox */}
      {frame >= tDir ? (
        <div style={{ position: "absolute", left: 120, top: 330, transform: `translateY(${(1 - inbox) * -60}px) scale(${0.8 + 0.2 * inbox})`, opacity: inbox }}>
          <Win w={720} title="INBOX  ·  DIRECTOR, CIA" color={colors.red}>
            {["RE: briefing", "Travel schedule", "Personal"].map((t, i) => (
              <div key={t} style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.mono, fontSize: 28, color: colors.text, padding: "10px 4px", borderBottom: "2px solid #1E2A32", opacity: frame > tDir + 6 + i * 4 ? 1 : 0 }}>
                <span>{t}</span>
                <span style={{ color: colors.dim }}>opened</span>
              </div>
            ))}
          </Win>
        </div>
      ) : null}
      <SeizedStamp at={tBed} text="ACCESS GRANTED" color={colors.green} fontSize={64} rotate={-8} style={{ left: 200, top: 620 }} />
      {/* only #3 */}
      <Slam at={tOnly} style={{ left: 60, width: 840, top: 260, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "10px 40px", borderRadius: 26, background: "rgba(7,9,11,0.92)", border: `8px solid ${colors.amber}` }}>
          <div style={{ ...big(90, colors.text) }}>AND HE'S ONLY</div>
          <div style={{ ...big(300, colors.amber) }}>#3</div>
        </div>
      </Slam>
      <Flash at={tOnly} color={colors.amber} peak={0.35} />
      {frame > end - 6 ? <GlitchBars amount={(frame - end + 6) / 6} seed="hook-out" /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ TITLE */

const Title: React.FC<{ c: C; start: number }> = ({ c, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tImp = c("impossible");
  const tCrazy = c("craziest");
  const cols = [colors.green, colors.amber, BLUE, PURPLE, WHITE];
  return (
    <AbsoluteFill>
      <Glow color={colors.green} y={35} />
      <Slam at={start} style={{ left: 60, width: 840, top: 230, textAlign: "center" }}>
        <div style={{ ...big(150, colors.text) }}>5 TEENAGERS</div>
        <div style={{ ...big(92, colors.dim), marginTop: 6 }}>WHO HACKED THE</div>
      </Slam>
      <Slam at={tImp} style={{ left: 60, width: 840, top: 470, textAlign: "center" }} rotate={-3}>
        <div style={{ display: "inline-block", padding: "4px 30px", borderRadius: 18, background: colors.red }}>
          <div style={{ ...big(150, colors.bg), textShadow: "none" }}>IMPOSSIBLE</div>
        </div>
      </Slam>
      <Row top={700} gap={26}>
        {cols.map((cc, i) => {
          const s = sp(frame, fps, start + 6 + i * 4, springs.pop);
          const lit = frame >= tCrazy && i === 4;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${s})` }}>
              <BlobCharacter color={cc} accessory="hoodie" size={lit ? 200 : 150} seed={i} />
              <div style={{ ...big(54, lit ? colors.amber : colors.text), marginTop: 8 }}>#{5 - i}</div>
            </div>
          );
        })}
      </Row>
      <div style={{ position: "absolute", left: 590, top: 640 }}>
        <Tag at={tCrazy} text="CRAZIEST" color={colors.amber} size={40} filled />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ #5 JONATHAN JAMES */

const James: React.FC<{ c: C; start: number }> = ({ c, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tBack = c("backdoor");
  const tMsgs = c("three thousand");
  const tNasa = c("then he walks");
  const tMil = c("one point seven");
  const tTemp = c("temperature");
  const tShut = c("nasa has");
  const tTwist = c("twist");
  const tLocked = c("locked");
  const tQuiet = c("quiet");
  const cam = useCam(roomCam(start, -26));
  const bA = frame < tNasa;
  const bB = frame >= tNasa && frame < tShut;
  const bC = frame >= tShut;
  return (
    <AbsoluteFill>
      <Glow color={colors.green} />
      {bA ? (
        <>
          <Room
            cam={cam}
            wall="#20302A"
            floor="#2C3A33"
            accent={colors.green}
            windowColor="#2B6C8F"
            label="MIAMI · 1999"
            who={<BlobCharacter color={colors.green} accessory="hoodie" size={220} lightColor={colors.green} lightAmount={0.5} look={{ x: 0.7, y: -0.2 }} />}
            screen={<CodeScreen w={204} h={124} color={colors.green} seed={5} />}
          />
          <div style={{ position: "absolute", left: 60, width: 840, top: 220, display: "flex", justifyContent: "center", gap: 18 }}>
            <Pop2 at={start + 4} style={{ position: "relative" }}>
              <Pill text="MIAMI · 1999" color={colors.text} size={44} />
            </Pop2>
            <Pop2 at={c("comrade")} style={{ position: "relative" }}>
              <Pill text="c0mrade" color={colors.green} filled size={44} />
            </Pop2>
          </div>
          {frame >= tBack ? (
            <Pop2 at={tBack} style={{ left: 100, top: 330 }}>
              <Win w={760} title="DoD AGENCY · WMD DEFENCE" color={colors.red}>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <Pentagon size={170} color={colors.red} />
                  <div>
                    <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: colors.green }}>backdoor: INSTALLED</div>
                    {frame >= tMsgs ? (
                      <div style={{ marginTop: 10 }}>
                        <CountUp at={tMsgs} to={3000} size={110} color={colors.amber} suffix="+" />
                        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, color: colors.text }}>MESSAGES READ</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Win>
            </Pop2>
          ) : null}
        </>
      ) : null}
      {bB ? (
        <>
          <Glow color={CYAN} y={30} />
          <Slam at={tNasa} style={{ left: 60, width: 840, top: 220, textAlign: "center" }}>
            <div style={{ ...big(170, colors.text) }}>NASA</div>
          </Slam>
          <div style={{ position: "absolute", left: 140, top: 430, transform: `translateY(${Math.sin(frame / 20) * 10}px)` }}>
            <Station size={680} color={CYAN} spin={Math.sin(frame / 40) * 4} />
          </div>
          <Row top={860} gap={18}>
            <Pop2 at={tMil} style={{ position: "relative" }}>
              <div style={{ textAlign: "center", padding: "8px 26px", borderRadius: 18, background: "rgba(7,9,11,0.9)", border: `5px solid ${colors.amber}` }}>
                <CountUp at={tMil} to={1.7} size={100} color={colors.amber} prefix="$" suffix="M" fmt={(n) => n.toFixed(1)} />
                <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: colors.text }}>SOFTWARE TAKEN</div>
              </div>
            </Pop2>
            <Pop2 at={tTemp} style={{ position: "relative" }}>
              <div style={{ padding: "12px 22px", borderRadius: 18, background: "rgba(7,9,11,0.9)", border: `5px solid ${CYAN}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: CYAN, lineHeight: 1.5 }}>
                <div>TEMP ▮▮▮▯</div>
                <div>HUMIDITY ▮▮▯▯</div>
              </div>
            </Pop2>
          </Row>
        </>
      ) : null}
      {bC ? (
        <>
          <Glow color={colors.red} y={30} />
          <div style={{ position: "absolute", left: 60, width: 840, top: 230, textAlign: "center" }}>
            <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: colors.red, letterSpacing: "0.1em" }}>NASA COMPUTERS: OFFLINE</div>
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: 20, marginTop: 10 }}>
              <CountUp at={tShut + 6} to={21} dur={40} size={300} color={colors.text} />
              <div style={{ ...big(110, colors.red) }}>DAYS</div>
            </div>
          </div>
          {frame >= tTwist ? (
            <Pop2 at={tTwist} style={{ left: 60, width: 840, top: 640, display: "flex", justifyContent: "center" }}>
              <div style={{ position: "relative", width: 380, height: 380, borderRadius: 30, background: "#141A20", border: "6px solid #3A4652", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                <BlobCharacter color={colors.green} accessory="hoodie" size={300} expression="scared" />
                {frame >= tLocked
                  ? new Array(6).fill(0).map((_, i) => {
                      const d = sp(frame, fps, tLocked + i, springs.slam);
                      return <div key={i} style={{ position: "absolute", left: 20 + i * 66, top: 0, width: 16, height: 380, background: "#9AA6B2", transform: `translateY(${(1 - d) * -400}px)` }} />;
                    })
                  : null}
              </div>
            </Pop2>
          ) : null}
          <SeizedStamp at={tLocked} text="FIRST KID IN THE US JAILED FOR HACKING" color={colors.red} fontSize={40} rotate={-6} style={{ left: 80, top: 960 }} />
          {frame >= tQuiet ? <AbsoluteFill style={{ background: "rgba(0,0,0,0.45)", opacity: clamp01((frame - tQuiet) / 10) }} /> : null}
        </>
      ) : null}
      {frame >= tNasa && frame < tNasa + 8 ? <GlitchBars amount={1 - (frame - tNasa) / 8} seed="j1" /> : null}
      {frame >= tShut && frame < tShut + 8 ? <GlitchBars amount={1 - (frame - tShut) / 8} seed="j2" /> : null}
      <Sfx name="stamp" at={tLocked} volume={0.6} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ #4 MAFIABOY */

const SITES = [
  { name: "YAHOO!", color: PURPLE, cue: ["yahoo", 0] as const },
  { name: "eBay", color: colors.amber, cue: ["ebay", 0] as const },
  { name: "AMAZON", color: colors.amber, cue: ["amazon", 0] as const },
  { name: "CNN", color: colors.red, cue: ["cnn", 0] as const },
  { name: "DELL", color: BLUE, cue: ["dell", 0] as const },
];

const Mafiaboy: React.FC<{ c: C; start: number }> = ({ c, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tDark = c("dark");
  const tBillion = c("some estimates");
  const tMontreal = c("montreal");
  const tMafia = c("mafiaboy");
  const tJunk = c("junk");
  const tHow = c("so how");
  const tBrag = c("bragged");
  const tClaim = c("claimed");
  const tBefore = c("before anyone");
  const tEight = c("eight months");
  const tPeople = c("running america");
  const bA = frame < tBillion;
  const bB = frame >= tBillion && frame < tHow;
  const bC = frame >= tHow;
  return (
    <AbsoluteFill>
      <Glow color={PURPLE} />
      {bA ? (
        <>
          <div style={{ position: "absolute", left: 60, width: 840, top: 215, textAlign: "center" }}>
            <Pop2 at={start + 4} style={{ position: "relative" }}>
              <Pill text="FEBRUARY 2000" color={colors.text} size={46} />
            </Pop2>
          </div>
          <div style={{ position: "absolute", left: 80, top: 320, width: 800, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
            {SITES.map((s, i) => {
              const at = i === 0 ? start + 10 : start + 14 + i * 3;
              const down = frame >= (i === 0 ? tDark : c(s.cue[0], s.cue[1]));
              const pop = sp(frame, fps, at, springs.pop);
              return (
                <div key={s.name} style={{ gridColumn: i === 0 ? "1 / span 2" : undefined, transform: `scale(${pop})` }}>
                  <Win w={i === 0 ? 800 : 389} title={`www.${s.name.toLowerCase().replace(/[^a-z]/g, "")}.com`} color={down ? "#3A4652" : s.color}>
                    <div style={{ height: i === 0 ? 170 : 120, display: "flex", alignItems: "center", justifyContent: "center", background: down ? "#050607" : "transparent", borderRadius: 10 }}>
                      {down ? (
                        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: i === 0 ? 46 : 34, color: colors.red }}>SITE DOWN</div>
                      ) : (
                        <div style={{ ...big(i === 0 ? 130 : 80, s.color) }}>{s.name}</div>
                      )}
                    </div>
                  </Win>
                  {down ? <Sfx name="error" at={i === 0 ? tDark : c(s.cue[0], s.cue[1])} volume={0.45} /> : null}
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 60, width: 840, top: 590, textAlign: "center" }}>
            {frame >= tDark ? <Tag at={tDark} text="THE BIGGEST SITE ONLINE" color={PURPLE} size={34} filled /> : null}
          </div>
        </>
      ) : null}
      {bB ? (
        <>
          <div style={{ position: "absolute", left: 60, width: 840, top: 220, textAlign: "center" }}>
            <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: colors.dim, letterSpacing: "0.08em" }}>SOME ESTIMATES</div>
            <CountUp at={tBillion + 4} to={1.2} size={190} color={colors.amber} prefix="$" suffix=" BILLION" fmt={(n) => n.toFixed(1)} />
          </div>
          {/* junk traffic flood into a server */}
          {frame >= tMontreal ? (
            <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1100 }}>
              <div style={{ position: "absolute", left: 120, top: 560 }}>
                <BlobCharacter color={colors.amber} accessory="hoodie" size={260} lightColor={colors.red} lightAmount={0.4} look={{ x: 1, y: 0 }} />
              </div>
              <div style={{ position: "absolute", left: 90, top: 470 }}>
                <Tag at={tMafia} text="MAFIABOY · 15" color={colors.amber} size={38} filled />
              </div>
              <div style={{ position: "absolute", left: 90, top: 860 }}>
                <Pop2 at={tMontreal} style={{ position: "relative" }}>
                  <Pill text="MONTREAL" color={colors.text} size={36} />
                </Pop2>
              </div>
              <div style={{ position: "absolute", left: 640, top: 560, width: 220, height: 320, borderRadius: 18, background: "#141A20", border: `6px solid ${frame >= tJunk + 20 ? colors.red : "#3A4652"}`, padding: 18 }}>
                {new Array(6).fill(0).map((_, i) => (
                  <div key={i} style={{ height: 30, marginBottom: 14, borderRadius: 6, background: frame >= tJunk + 20 && (Math.floor(frame / 4) + i) % 2 ? colors.red : "#2A3540" }} />
                ))}
              </div>
              {frame >= tJunk
                ? new Array(26).fill(0).map((_, i) => {
                    const t = ((frame - tJunk) * 0.035 + random(`pk-${i}`)) % 1;
                    const y0 = 600 + random(`py-${i}`) * 260;
                    return <div key={i} style={{ position: "absolute", left: lerp(380, 640, t), top: lerp(y0, 720, t), width: 26, height: 18, borderRadius: 4, background: i % 3 ? colors.amber : colors.red, opacity: 0.9 }} />;
                  })
                : null}
              {frame >= tJunk ? (
                <div style={{ position: "absolute", left: 380, top: 900, width: 260, textAlign: "center" }}>
                  <Tag at={tJunk} text="JUNK TRAFFIC" color={colors.red} size={30} />
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
      {bC ? (
        <>
          <div style={{ position: "absolute", left: 100, top: 240 }}>
            <Win w={760} title="#chat  ·  IRC" color={colors.green}>
              {[
                { at: tBrag, who: "mafiaboy", txt: "yahoo? that was me", col: colors.amber },
                { at: tClaim, who: "mafiaboy", txt: "dell too. dell is down", col: colors.amber },
                { at: tBefore, who: "FBI + RCMP", txt: "(dell attack not public yet)", col: colors.red },
              ].map((m) =>
                frame >= m.at ? (
                  <div key={m.txt} style={{ fontFamily: fonts.mono, fontSize: 32, color: colors.text, padding: "10px 0", transform: `translateY(${(1 - sp(frame, fps, m.at, springs.snappy)) * 30}px)` }}>
                    <span style={{ color: m.col, fontWeight: 700 }}>{m.who}:</span> {m.txt}
                  </div>
                ) : null,
              )}
              <div style={{ fontFamily: fonts.mono, fontSize: 22, color: colors.dim, marginTop: 8 }}>dramatised</div>
            </Win>
          </div>
          {frame >= tBrag ? <Sfx name="notify" at={tBrag} volume={0.5} /> : null}
          {frame >= tClaim ? <Sfx name="notify" at={tClaim} volume={0.5} /> : null}
          <div style={{ position: "absolute", left: 360, top: 700 }}>
            <Tag at={tBefore} text="NOBODY KNEW YET" color={colors.red} size={40} filled />
          </div>
          <SeizedStamp at={tEight} text="8 MONTHS YOUTH CUSTODY" color={colors.red} fontSize={52} rotate={-7} style={{ left: 120, top: 830 }} />
          {frame >= tPeople ? (
            <Pop2 at={tPeople} style={{ left: 60, width: 840, top: 990, textAlign: "center" }}>
              <Pill text="NEXT: THE PEOPLE RUNNING AMERICA" color={colors.amber} size={36} />
            </Pop2>
          ) : null}
        </>
      ) : null}
      {frame >= tBillion && frame < tBillion + 8 ? <GlitchBars amount={1 - (frame - tBillion) / 8} seed="m1" /> : null}
      {frame >= tHow && frame < tHow + 8 ? <GlitchBars amount={1 - (frame - tHow) / 8} seed="m2" /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ #3 KANE GAMBLE */

const Gamble: React.FC<{ c: C; start: number }> = ({ c, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tBreaks = c("breaks into");
  const tDir = c("director", 1);
  const tHow = c("how", 1);
  const tPretend = c("pretending");
  const tWorks = c("it works");
  const tHijack = c("then he hijacks");
  const tClapper = c("clapper");
  const tReroute = c("reroutes");
  const tJudge = c("a judge");
  const tTwo = c("two years");
  const tAll = c("all of them");
  const cam = useCam(roomCam(start, -22));
  const bA = frame < tHow;
  const bB = frame >= tHow && frame < tHijack;
  const bC = frame >= tHijack;
  return (
    <AbsoluteFill>
      <Glow color={BLUE} />
      {bA ? (
        <>
          <Room
            cam={cam}
            wall="#1E2536"
            floor="#2A3040"
            accent={BLUE}
            windowColor="#3A4A66"
            label="COALVILLE · ENGLAND"
            who={<BlobCharacter color={BLUE} accessory="hoodie" size={220} lightColor={BLUE} lightAmount={0.5} look={{ x: 0.7, y: -0.2 }} />}
            screen={<CodeScreen w={204} h={124} color={BLUE} seed={3} />}
          />
          <div style={{ position: "absolute", left: 60, width: 840, top: 220, display: "flex", justifyContent: "center", gap: 18 }}>
            <Pop2 at={start + 4} style={{ position: "relative" }}>
              <Pill text="2015" color={colors.text} size={44} />
            </Pop2>
            <Pop2 at={c("kane")} style={{ position: "relative" }}>
              <Pill text="KANE GAMBLE · 15" color={BLUE} filled size={44} />
            </Pop2>
          </div>
          {frame >= tBreaks ? (
            <Pop2 at={tBreaks} style={{ left: 100, top: 330 }}>
              <Win w={760} title="PERSONAL EMAIL · J. BRENNAN" color={colors.red}>
                {["Inbox (1,204)", "Contacts", "Drafts"].map((t, i) => (
                  <div key={t} style={{ fontFamily: fonts.mono, fontSize: 30, color: colors.text, padding: "8px 0", borderBottom: "2px solid #1E2A32", opacity: frame > tBreaks + 4 + i * 4 ? 1 : 0 }}>
                    {t}
                  </div>
                ))}
              </Win>
            </Pop2>
          ) : null}
          <div style={{ position: "absolute", left: 300, top: 285 }}>{frame >= tDir ? <Tag at={tDir} text="DIRECTOR OF THE CIA" color={colors.red} size={40} filled /> : null}</div>
        </>
      ) : null}
      {bB ? (
        <>
          <Glow color={colors.green} y={45} />
          <div style={{ position: "absolute", left: 120, top: 260 }}>
            <PhoneIcon w={260} ring={frame < tWorks} color={colors.green}>
              <div style={{ textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, color: colors.text }}>
                <div style={{ fontSize: 22, color: colors.dim }}>CALLING</div>
                <div style={{ fontSize: 30, marginTop: 10 }}>CUSTOMER SUPPORT</div>
                <div style={{ fontSize: 26, marginTop: 30, color: colors.green }}>00:{String(Math.min(59, Math.floor((frame - tHow) / 30))).padStart(2, "0")}</div>
              </div>
            </PhoneIcon>
          </div>
          {frame >= tPretend ? (
            <Pop2 at={tPretend} style={{ left: 440, top: 300 }}>
              <div style={{ width: 420, padding: "22px 26px", borderRadius: 28, background: colors.text, color: colors.bg, fontFamily: fonts.sans, fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>
                "Hi, this is John Brennan..."
              </div>
            </Pop2>
          ) : null}
          {frame >= tWorks ? (
            <Pop2 at={tWorks} style={{ left: 440, top: 540 }}>
              <div style={{ width: 420, padding: "18px 24px", borderRadius: 20, background: "rgba(7,9,11,0.92)", border: `6px solid ${colors.green}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: colors.green }}>
                PASSWORD RESET ✓
              </div>
            </Pop2>
          ) : null}
          {frame >= tWorks ? <Sfx name="coin" at={tWorks} volume={0.5} /> : null}
          <div style={{ position: "absolute", left: 120, top: 830, fontFamily: fonts.mono, fontSize: 22, color: colors.dim }}>dramatised</div>
        </>
      ) : null}
      {bC ? (
        <>
          <Glow color={colors.red} y={35} />
          <div style={{ position: "absolute", left: 60, width: 840, top: 220, textAlign: "center" }}>
            <Pop2 at={tClapper} style={{ position: "relative" }}>
              <Pill text="JAMES CLAPPER · TOP US INTELLIGENCE OFFICIAL" color={colors.amber} size={30} />
            </Pop2>
          </div>
          {/* house -> router -> rerouted calls */}
          <div style={{ position: "absolute", left: 110, top: 330 }}>
            <svg width={280} height={260} viewBox="0 0 140 130">
              <polygon points="70,8 132,58 8,58" fill="#2A3540" stroke={colors.text} strokeWidth={4} />
              <rect x={22} y={58} width={96} height={66} fill="#1A222B" stroke={colors.text} strokeWidth={4} />
              <rect x={60} y={86} width={22} height={38} fill={colors.amber} />
            </svg>
            <div style={{ textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: colors.text }}>HOME PHONE + WIFI</div>
          </div>
          {frame >= tHijack + 8 ? (
            <div style={{ position: "absolute", left: 420, top: 360 }}>
              <SeizedStamp at={tHijack + 8} text="HIJACKED" color={colors.red} fontSize={56} rotate={-10} style={{ left: 0, top: 0 }} />
            </div>
          ) : null}
          {frame >= tReroute ? (
            <>
              <div style={{ position: "absolute", left: 250, top: 640, width: 400, height: 10, background: colors.red, transformOrigin: "0 50%", transform: `scaleX(${sp(frame, fps, tReroute, springs.smooth)}) rotate(0deg)` }} />
              {new Array(4).fill(0).map((_, i) => {
                const t = ((frame - tReroute) * 0.03 + i / 4) % 1;
                return <div key={i} style={{ position: "absolute", left: lerp(250, 640, t), top: 626, width: 40, height: 40, borderRadius: 40, background: colors.amber, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: colors.bg }}>☎</div>;
              })}
              <Pop2 at={tReroute + 10} style={{ left: 560, top: 680 }}>
                <div style={{ width: 300, padding: "14px 18px", borderRadius: 18, background: "rgba(7,9,11,0.92)", border: `5px solid ${colors.green}`, fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: colors.green, textAlign: "center" }}>
                  CALLS NOW GO TO A "FREE PALESTINE" GROUP
                </div>
              </Pop2>
            </>
          ) : null}
          <SeizedStamp at={tJudge + 6} text="CYBER TERRORISM" color={colors.red} fontSize={66} rotate={-6} style={{ left: 120, top: 870 }} />
          {frame >= tTwo ? (
            <Pop2 at={tTwo} style={{ left: 60, width: 840, top: 1000, textAlign: "center" }}>
              <Pill text="2 YEARS YOUTH DETENTION" color={colors.text} size={40} />
            </Pop2>
          ) : null}
          {frame >= tAll ? <AbsoluteFill style={{ background: "rgba(0,0,0,0.5)", opacity: clamp01((frame - tAll) / 10) }} /> : null}
        </>
      ) : null}
      {frame >= tHow && frame < tHow + 8 ? <GlitchBars amount={1 - (frame - tHow) / 8} seed="g1" /> : null}
      {frame >= tHijack && frame < tHijack + 8 ? <GlitchBars amount={1 - (frame - tHijack) / 8} seed="g2" /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ #2 TWITTER */

const POSTERS = [
  { name: "Barack Obama", cue: ["obama", 0] as const },
  { name: "Joe Biden", cue: ["joe", 0] as const },
  { name: "Elon Musk", cue: ["elon", 0] as const },
  { name: "Jeff Bezos", cue: ["bezos", 0] as const },
  { name: "Bill Gates", cue: ["gates", 0] as const },
  { name: "Kanye West", cue: ["kanye", 0] as const },
];

const Post: React.FC<{ name: string; w: number }> = ({ name, w }) => (
  <div style={{ width: w, padding: "18px 22px", borderRadius: 22, background: "#F3F5F7", boxShadow: "0 18px 40px rgba(0,0,0,0.5)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 56, height: 56, borderRadius: 56, background: "#B8C2CC" }} />
      <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 32, color: "#0B0F14" }}>{name}</div>
      <div style={{ width: 30, height: 30, borderRadius: 30, background: "#1D9BF0", color: "#fff", fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
    </div>
    <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 30, color: "#0B0F14", marginTop: 12, lineHeight: 1.2 }}>Send me Bitcoin and I'll send you double back.</div>
  </div>
);

const Twitter: React.FC<{ c: C; start: number }> = ({ c, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tPanic = c("panics");
  const tBehind = c("behind it", 1);
  const tGraham = c("graham");
  const tCrack = c("crack");
  const tPhoned = c("he phoned");
  const tHelp = c("help desk");
  const tFake = c("fake login");
  const tTools = c("internal tools");
  const tMoney = c("a hundred and seventeen");
  const tCaught = c("caught sixteen");
  const tThree = c("three years");
  const bA = frame < tBehind;
  const bB = frame >= tBehind && frame < tPhoned;
  const bC = frame >= tPhoned && frame < tMoney;
  const bD = frame >= tMoney;
  return (
    <AbsoluteFill>
      <Glow color="#1D9BF0" />
      {bA ? (
        <>
          <div style={{ position: "absolute", left: 60, width: 840, top: 215, textAlign: "center" }}>
            <Pop2 at={start + 4} style={{ position: "relative" }}>
              <Pill text="JULY 15, 2020" color={colors.text} size={44} />
            </Pop2>
          </div>
          {POSTERS.map((p, i) => {
            const at = c(p.cue[0], p.cue[1]);
            if (frame < at) return null;
            const s = sp(frame, fps, at, springs.pop);
            const x = 100 + (i % 2) * 40;
            const y = 330 + i * 105;
            return (
              <div key={p.name} style={{ position: "absolute", left: x, top: y, transform: `scale(${s}) rotate(${i % 2 ? 2 : -2}deg)` }}>
                <Sfx name="notify" at={at} volume={0.4} />
                <Post name={p.name} w={720} />
              </div>
            );
          })}
          {frame >= tPanic ? (
            <Slam at={tPanic} style={{ left: 60, width: 840, top: 520, textAlign: "center" }} rotate={-4}>
              <div style={{ display: "inline-block", padding: "16px 34px", borderRadius: 22, background: colors.red }}>
                <div style={{ ...big(92, colors.text), textShadow: "none" }}>ALL VERIFIED ACCOUNTS</div>
                <div style={{ ...big(130, colors.bg), textShadow: "none" }}>FROZEN</div>
              </div>
            </Slam>
          ) : null}
        </>
      ) : null}
      {bB ? (
        <>
          <div style={{ position: "absolute", left: 300, top: 470 }}>
            <BlobCharacter color={PURPLE} accessory="hoodie" size={340} lightColor={PURPLE} lightAmount={0.4} />
          </div>
          <div style={{ position: "absolute", left: 60, width: 840, top: 230, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <Pop2 at={tGraham} style={{ position: "relative" }}>
              <Pill text="GRAHAM IVAN CLARK" color={PURPLE} filled size={52} />
            </Pop2>
            <Pop2 at={c("seventeen")} style={{ position: "relative" }}>
              <Pill text="17 · TAMPA, FLORIDA" color={colors.text} size={40} />
            </Pop2>
          </div>
          {frame >= tCrack ? (
            <Pop2 at={tCrack} style={{ left: 560, top: 560 }}>
              <div style={{ position: "relative", padding: "14px 20px", borderRadius: 16, background: "#071017", border: `4px solid ${colors.green}`, fontFamily: fonts.mono, fontSize: 26, color: colors.green, lineHeight: 1.4 }}>
                <div>01101 crack()</div>
                <div>while(true)</div>
                <div style={{ position: "absolute", left: -10, right: -10, top: "50%", height: 10, background: colors.red, transform: "rotate(-12deg)" }} />
              </div>
            </Pop2>
          ) : null}
          {frame >= tCrack ? (
            <div style={{ position: "absolute", left: 560, top: 500 }}>
              <Tag at={tCrack + 6} text="NO CODE NEEDED" color={colors.red} size={30} filled />
            </div>
          ) : null}
        </>
      ) : null}
      {bC ? (
        <>
          <div style={{ position: "absolute", left: 100, top: 250 }}>
            <PhoneIcon w={200} ring={frame < tFake} color={PURPLE}>
              <div style={{ textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, color: colors.text }}>
                <div style={{ fontSize: 18, color: colors.dim }}>INCOMING</div>
                <div style={{ fontSize: 24, marginTop: 8 }}>{frame >= tHelp ? '"IT HELP DESK"' : "UNKNOWN"}</div>
              </div>
            </PhoneIcon>
          </div>
          <div style={{ position: "absolute", left: 360, top: 300 }}>
            <BlobCharacter color={WHITE} size={200} expression={frame >= tFake ? "calm" : "calm"} look={{ x: -1, y: 0 }} seed={4} />
            <div style={{ textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: colors.text, marginTop: 6 }}>TWITTER STAFF</div>
          </div>
          {frame >= tFake ? (
            <Pop2 at={tFake} style={{ left: 120, top: 640 }}>
              <Win w={720} title="login.vpn-support  (FAKE)" color={colors.red}>
                <div style={{ fontFamily: fonts.mono, fontSize: 28, color: colors.dim }}>username</div>
                <div style={{ height: 50, borderRadius: 8, background: "#1A222B", margin: "6px 0 12px", fontFamily: fonts.mono, fontSize: 28, color: colors.text, padding: "8px 12px" }}>staff.member</div>
                <div style={{ fontFamily: fonts.mono, fontSize: 28, color: colors.dim }}>password</div>
                <div style={{ height: 50, borderRadius: 8, background: "#1A222B", marginTop: 6, fontFamily: fonts.mono, fontSize: 32, color: colors.text, padding: "6px 12px" }}>{"•".repeat(Math.min(12, Math.max(0, Math.floor((frame - tFake) / 3))))}</div>
              </Win>
            </Pop2>
          ) : null}
          {frame >= tFake ? <Sfx name="type" at={tFake} durationInFrames={36} volume={0.4} /> : null}
          <div style={{ position: "absolute", left: 60, width: 840, top: 980, display: "flex", justifyContent: "center" }}>{frame >= tTools ? <Tag at={tTools} text="INTERNAL TOOLS: UNLOCKED" color={colors.green} size={36} filled /> : null}</div>
        </>
      ) : null}
      {bD ? (
        <>
          <Glow color={colors.amber} y={30} />
          <div style={{ position: "absolute", left: 60, width: 840, top: 230, textAlign: "center" }}>
            <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: colors.dim, letterSpacing: "0.08em" }}>IN BITCOIN</div>
            <CountUp at={tMoney + 2} to={117000} dur={40} size={210} color={colors.amber} prefix="$" />
          </div>
          {frame >= tCaught ? (
            <Pop2 at={tCaught} style={{ left: 60, width: 840, top: 540, display: "flex", justifyContent: "center" }}>
              <div style={{ width: 360, borderRadius: 24, overflow: "hidden", border: `6px solid ${colors.text}`, background: "#F3F5F7", textAlign: "center" }}>
                <div style={{ background: colors.red, ...big(56, colors.text), padding: "8px 0" }}>CAUGHT IN</div>
                <div style={{ ...big(200, colors.bg), textShadow: "none" }}>16</div>
                <div style={{ ...big(56, colors.bg), textShadow: "none", paddingBottom: 10 }}>DAYS</div>
              </div>
            </Pop2>
          ) : null}
          <SeizedStamp at={tThree} text="3 YEARS PRISON" color={colors.red} fontSize={60} rotate={-8} style={{ left: 200, top: 960 }} />
        </>
      ) : null}
      {[tBehind, tPhoned, tMoney].map((t) => (frame >= t && frame < t + 8 ? <GlitchBars key={t} amount={1 - (frame - t) / 8} seed={`t-${t}`} /> : null))}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ #1 KURTAJ */

const TARGETS = [
  { name: "NVIDIA", color: colors.green, cue: ["nvidia", 0] as const },
  { name: "UBER", color: colors.text, cue: ["uber", 0] as const },
  { name: "REVOLUT", color: BLUE, cue: ["revolut", 0] as const },
];

const LOADOUT = [
  { name: "HOTEL TV", cue: ["hotel tv", 0] as const, color: CYAN, rarity: "COMMON" },
  { name: "FIRE STICK", cue: ["fire", 0] as const, color: colors.amber, rarity: "RARE" },
  { name: "A PHONE", cue: ["a phone", 0] as const, color: PURPLE, rarity: "COMMON" },
  { name: "KEYBOARD", cue: ["keyboard", 0] as const, color: colors.green, rarity: "COMMON" },
];

const Kurtaj: React.FC<{ c: C; start: number }> = ({ c, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tLapsus = c("lapsus");
  const tPolice = c("police arrest");
  const tLaptop = c("laptop");
  const tLodge = c("travelodge");
  const tBail = c("bail");
  const tProt = c("protection");
  const tNoPc = c("no computer");
  const tFrom = c("and from that");
  const tRock = c("hacks rockstar");
  const tNinety = c("ninety clips");
  const tGta = c("gta");
  const tFive = c("five million");
  const tSent = c("he's sent");
  const tIndef = c("indefinitely");
  const tFit = c("found fit");
  const tNov = c("november");
  const tGuilty = c("pleads guilty");
  const bA = frame < tPolice;
  const bB = frame >= tPolice && frame < tNoPc;
  const bC = frame >= tNoPc && frame < tFrom;
  const bD = frame >= tFrom && frame < tSent;
  const bE = frame >= tSent;
  const camHotel = useCam([
    { at: tPolice, tx: 0, ty: -200, tz: 0, rx: -20, ry: -28, dist: -150 },
    { at: tPolice + 1, tx: 40, ty: -210, tz: -40, rx: -18, ry: -20, dist: 40 },
  ]);
  const camTv = useCam([
    { at: tFrom, tx: 0, ty: -220, tz: 0, rx: -16, ry: 20, dist: -100 },
    { at: tFrom + 1, tx: 60, ty: -260, tz: -120, rx: -10, ry: 10, dist: 160 },
  ]);
  const tvGlow = frame >= tRock;
  const hotelTv = (
    <div style={{ width: 300, height: 175, background: "#080A0D", border: "10px solid #1A1F25", borderRadius: 8, overflow: "hidden", boxShadow: tvGlow ? `0 0 60px ${colors.amber}` : "none" }}>
      {tvGlow ? <CodeScreen w={280} h={155} color={colors.amber} seed={9} /> : null}
    </div>
  );
  return (
    <AbsoluteFill>
      <Glow color={colors.amber} />
      {bA ? (
        <>
          <div style={{ position: "absolute", left: 60, width: 840, top: 215, display: "flex", justifyContent: "center", gap: 16 }}>
            <Pop2 at={start + 4} style={{ position: "relative" }}>
              <Pill text="OXFORD, ENGLAND" color={colors.text} size={42} />
            </Pop2>
            <Pop2 at={c("arion")} style={{ position: "relative" }}>
              <Pill text="ARION KURTAJ" color={colors.amber} filled size={42} />
            </Pop2>
          </div>
          <div style={{ position: "absolute", left: 120, top: 380 }}>
            <BlobCharacter color={WHITE} accessory="hoodie" size={300} seed={7} lightColor={colors.amber} lightAmount={0.4} />
          </div>
          <div style={{ position: "absolute", left: 90, top: 330 }}>
            <Tag at={tLapsus} text="LAPSUS$" color={colors.red} size={44} filled />
          </div>
          <div style={{ position: "absolute", left: 470, top: 330, display: "flex", flexDirection: "column", gap: 22 }}>
            {TARGETS.map((t) => {
              const at = c(t.cue[0], t.cue[1]);
              if (frame < at) return null;
              const s = sp(frame, fps, at, springs.pop);
              return (
                <div key={t.name} style={{ position: "relative", width: 400, padding: "18px 0", borderRadius: 20, background: "#0E141B", border: `5px solid ${t.color}`, textAlign: "center", transform: `scale(${s})` }}>
                  <Sfx name="stamp" at={at} volume={0.45} />
                  <div style={{ ...big(84, t.color) }}>{t.name}</div>
                  <div style={{ position: "absolute", right: -16, top: -18, padding: "4px 12px", borderRadius: 8, background: colors.red, fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: colors.text, transform: "rotate(8deg)" }}>BREACHED</div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
      {bB ? (
        <>
          <Room
            cam={camHotel}
            wall="#2E2A36"
            floor="#3A3340"
            accent={colors.amber}
            label="TRAVELODGE"
            tv={hotelTv}
            who={<BlobCharacter color={WHITE} accessory="hoodie" size={220} seed={7} look={{ x: -0.5, y: 0 }} />}
            screen={frame < tLaptop ? <CodeScreen w={204} h={124} color={colors.amber} seed={8} /> : <CodeScreen w={204} h={124} color={colors.amber} seed={8} dark />}
            extra={
              <Billboard pos={{ x: -110, y: 0, z: 230 }} cam={camHotel} w={200} h={260}>
                <BlobCharacter color="#2C4C86" size={200} badge={colors.amber} seed={2} />
              </Billboard>
            }
          />
          {frame >= tLaptop ? (
            <div style={{ position: "absolute", left: 330, top: 420 }}>
              <SeizedStamp at={tLaptop} text="LAPTOP SEIZED" color={colors.red} fontSize={54} rotate={-8} style={{ left: 0, top: 0 }} />
            </div>
          ) : null}
          <div style={{ position: "absolute", left: 60, width: 840, top: 215, display: "flex", justifyContent: "center", gap: 16 }}>
            <Pop2 at={tLodge} style={{ position: "relative" }}>
              <Pill text="HOTEL ROOM" color={colors.amber} size={40} />
            </Pop2>
            <Pop2 at={tBail} style={{ position: "relative" }}>
              <Pill text="OUT ON BAIL" color={colors.text} size={40} />
            </Pop2>
          </div>
          <div style={{ position: "absolute", left: 90, top: 900 }}>
            <Tag at={tProt} text="POLICE PROTECTION" color={BLUE} size={36} filled />
          </div>
        </>
      ) : null}
      {bC ? (
        <>
          <div style={{ position: "absolute", left: 60, width: 840, top: 225, textAlign: "center" }}>
            <div style={{ ...big(96, colors.text) }}>NO COMPUTER. SO...</div>
          </div>
          <div style={{ position: "absolute", left: 80, top: 360, width: 800, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {LOADOUT.map((l) => {
              const at = c(l.cue[0], l.cue[1]);
              const s = frame >= at ? sp(frame, fps, at, springs.pop) : 0;
              const flip = frame >= at ? 0 : 180;
              return (
                <div key={l.name} style={{ height: 300, perspective: 900 }}>
                  <div style={{ position: "relative", width: "100%", height: "100%", transform: `rotateY(${flip + (1 - s) * 180}deg) scale(${0.9 + 0.1 * s})`, transformStyle: "preserve-3d" }}>
                    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 24, background: `linear-gradient(180deg, ${l.color}33, #0E141B 70%)`, border: `6px solid ${l.color}`, boxShadow: `0 0 40px ${l.color}55`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: 20 }}>
                      <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: l.color, letterSpacing: "0.2em" }}>{l.rarity}</div>
                      <LoadoutArt name={l.name} color={l.color} />
                      <div style={{ ...big(64, colors.text) }}>{l.name}</div>
                    </div>
                    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 24, background: "#141A20", border: "6px solid #2A3540", display: "flex", alignItems: "center", justifyContent: "center", ...big(120, "#2A3540") }}>?</div>
                  </div>
                  {frame >= at ? <Sfx name="snap" at={at} volume={0.5} /> : null}
                </div>
              );
            })}
          </div>
        </>
      ) : null}
      {bD ? (
        <>
          <Room
            cam={camTv}
            wall="#2E2A36"
            floor="#3A3340"
            accent={colors.amber}
            label="TRAVELODGE"
            tv={hotelTv}
            bed
            who={<BlobCharacter color={WHITE} accessory="hoodie" size={220} seed={7} lightColor={colors.amber} lightAmount={tvGlow ? 0.6 : 0} look={{ x: 0.8, y: -0.5 }} />}
            screen={<CodeScreen w={204} h={124} color={colors.amber} seed={8} dark />}
          />
          {frame >= tGta ? <AbsoluteFill style={{ background: "rgba(7,9,11,0.7)", opacity: clamp01((frame - tGta) / 6) }} /> : null}
          {frame >= tNinety ? (
            <Pop2 at={tNinety} style={{ left: 60, width: 840, top: 220, display: "flex", justifyContent: "center" }}>
              <div style={{ textAlign: "center", padding: "10px 30px", borderRadius: 22, background: "rgba(7,9,11,0.9)", border: `6px solid ${colors.red}` }}>
                <CountUp at={tNinety} to={90} size={150} color={colors.red} suffix=" CLIPS" />
                <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, color: colors.text }}>LEAKED</div>
              </div>
            </Pop2>
          ) : null}
          <Slam at={tGta} style={{ left: 60, width: 840, top: 450, textAlign: "center" }} rotate={-4}>
            <div style={{ ...big(260, colors.amber) }}>GTA 6</div>
          </Slam>
          <Flash at={tGta} color={colors.amber} peak={0.35} />
          {frame >= tFive ? (
            <Pop2 at={tFive} style={{ left: 60, width: 840, top: 800, textAlign: "center" }}>
              <div style={{ display: "inline-block", padding: "8px 26px", borderRadius: 18, background: "rgba(7,9,11,0.92)", border: `5px solid ${colors.amber}` }}>
                <CountUp at={tFive} to={5} size={110} color={colors.amber} prefix="$" suffix="M" />
                <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: colors.text }}>ROCKSTAR'S COST</div>
              </div>
            </Pop2>
          ) : null}
        </>
      ) : null}
      {bE ? (
        <>
          <Glow color={CYAN} y={35} />
          <div style={{ position: "absolute", left: 230, top: 260 }}>
            <svg width={500} height={380} viewBox="0 0 250 190">
              <rect x={20} y={40} width={210} height={145} fill="#1A222B" stroke={colors.text} strokeWidth={4} />
              <rect x={95} y={10} width={60} height={40} fill="#1A222B" stroke={colors.text} strokeWidth={4} />
              <rect x={115} y={16} width={20} height={28} fill={colors.red} />
              <rect x={111} y={20} width={28} height={20} fill={colors.red} />
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={36 + i * 50} y={70} width={30} height={30} fill="#0B0F14" stroke={CYAN} strokeWidth={3} />
              ))}
              {[0, 1, 2, 3].map((i) => (
                <rect key={`b${i}`} x={36 + i * 50} y={120} width={30} height={30} fill="#0B0F14" stroke={CYAN} strokeWidth={3} />
              ))}
            </svg>
            <div style={{ textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: colors.text }}>SECURE HOSPITAL</div>
          </div>
          <div style={{ position: "absolute", left: 60, width: 840, top: 215, textAlign: "center" }}>
            <Tag at={tIndef} text="INDEFINITE" color={colors.red} size={40} filled />
          </div>
          {frame >= tFit ? (
            <Pop2 at={tFit} style={{ left: 60, width: 840, top: 740, textAlign: "center" }}>
              <Pill text="FOUND FIT FOR TRIAL" color={colors.green} size={40} />
            </Pop2>
          ) : null}
          {frame >= tNov ? (
            <Pop2 at={tNov} style={{ left: 60, width: 840, top: 830, textAlign: "center" }}>
              <Pill text="NOV 2026 · AGE 21" color={colors.text} size={40} />
            </Pop2>
          ) : null}
          <SeizedStamp at={tGuilty} text="GUILTY PLEA" color={colors.red} fontSize={90} rotate={-8} style={{ left: 190, top: 460 }} />
        </>
      ) : null}
      {[tPolice, tNoPc, tFrom, tSent].map((t) => (frame >= t && frame < t + 8 ? <GlitchBars key={t} amount={1 - (frame - t) / 8} seed={`k-${t}`} /> : null))}
    </AbsoluteFill>
  );
};

const LoadoutArt: React.FC<{ name: string; color: string }> = ({ name, color }) => {
  if (name === "HOTEL TV")
    return (
      <div style={{ width: 200, height: 118, border: `8px solid ${color}`, borderRadius: 8, background: "#071017" }}>
        <div style={{ margin: "40px auto 0", width: 60, height: 8, background: color }} />
      </div>
    );
  if (name === "FIRE STICK")
    return (
      <div style={{ width: 70, height: 140, borderRadius: 14, background: "#1A1F25", border: `6px solid ${color}`, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ width: 22, height: 30, marginTop: -26, background: "#9AA6B2", borderRadius: 4 }} />
      </div>
    );
  if (name === "A PHONE") return <PhoneIcon w={72} color={color} />;
  return (
    <div style={{ width: 220, height: 90, borderRadius: 12, border: `6px solid ${color}`, background: "#071017", display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4, padding: 8 }}>
      {new Array(24).fill(0).map((_, i) => (
        <div key={i} style={{ background: `${color}88`, borderRadius: 3 }} />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ OUTRO */

const RECAP = [
  { name: "NASA", color: CYAN, cue: ["nasa", 2] as const },
  { name: "THE CIA", color: colors.red, cue: ["cia", 2] as const },
  { name: "TWITTER", color: "#1D9BF0", cue: ["twitter", 2] as const },
];

const Outro: React.FC<{ c: C; start: number }> = ({ c, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tGame = c("biggest game");
  const tTv = c("hotel tv", 1);
  const tWhich = c("which one");
  const tFollow = c("follow");
  const tNext = c("five hackers");
  const end = frame >= tWhich;
  return (
    <AbsoluteFill>
      <Glow color={colors.green} />
      {!end ? (
        <>
          <Row top={240} gap={16}>
            {RECAP.map((r) => {
              const at = c(r.cue[0], r.cue[1]);
              if (frame < at) return null;
              const s = sp(frame, fps, at, springs.pop);
              return (
                <div key={r.name} style={{ width: 260, padding: "26px 0", borderRadius: 20, background: "#0E141B", border: `6px solid ${r.color}`, textAlign: "center", transform: `scale(${s})` }}>
                  <Sfx name="pop" at={at} volume={0.5} />
                  <div style={{ ...big(76, r.color) }}>{r.name}</div>
                  <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: colors.red, marginTop: 6 }}>HACKED BY A KID</div>
                </div>
              );
            })}
          </Row>
          {frame >= tGame ? (
            <Pop2 at={tGame} style={{ left: 60, width: 840, top: 470, textAlign: "center" }}>
              <div style={{ ...big(200, colors.amber) }}>GTA 6</div>
            </Pop2>
          ) : null}
          {frame >= tTv ? (
            <Pop2 at={tTv} style={{ left: 60, width: 840, top: 720, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: colors.text }}>THROUGH A</div>
                <LoadoutArt name="HOTEL TV" color={CYAN} />
              </div>
            </Pop2>
          ) : null}
        </>
      ) : (
        <>
          <Slam at={tWhich} style={{ left: 60, width: 840, top: 220, textAlign: "center" }} sound={false}>
            <div style={{ ...big(104, colors.text) }}>WHICH KID WOULD</div>
            <div style={{ ...big(104, colors.amber) }}>YOU HAVE CAUGHT?</div>
          </Slam>
          <Row top={500} gap={14}>
            {[
              ["#5", "JAMES"],
              ["#4", "MAFIABOY"],
              ["#3", "GAMBLE"],
              ["#2", "CLARK"],
              ["#1", "KURTAJ"],
            ].map(([n, name], i) => {
              const s = sp(frame, fps, tWhich + 8 + i * 4, springs.pop);
              return (
                <div key={n} style={{ width: 150, padding: "14px 0", borderRadius: 18, background: "#0E141B", border: `5px solid ${i === 4 ? colors.amber : "#3A4652"}`, textAlign: "center", transform: `scale(${s})` }}>
                  <div style={{ ...big(64, i === 4 ? colors.amber : colors.text) }}>{n}</div>
                  <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 18, color: colors.dim }}>{name}</div>
                </div>
              );
            })}
          </Row>
          <div style={{ position: "absolute", left: 60, width: 840, top: 700, textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: colors.text }}>COMMENT YOUR PICK</div>
          {frame >= tFollow ? (
            <Pop2 at={tFollow} style={{ left: 60, width: 840, top: 790, display: "flex", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 34px", borderRadius: 60, background: colors.red }}>
                <OnionLogo size={64} color={colors.text} />
                <div style={{ ...big(72, colors.text), textShadow: "none" }}>FOLLOW THE ONION ARCHIVE</div>
              </div>
            </Pop2>
          ) : null}
          {frame >= tNext ? (
            <Pop2 at={tNext} style={{ left: 60, width: 840, top: 940, textAlign: "center" }}>
              <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: colors.dim }}>NEXT</div>
              <div style={{ ...big(70, colors.amber), whiteSpace: "normal" }}>5 HACKERS CAUGHT BY ONE STUPID MISTAKE</div>
            </Pop2>
          ) : null}
        </>
      )}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ the video */

export const Top5Teens: React.FC<z.infer<typeof top5TeensSchema>> = ({ showCaptions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useMemo(() => createCues(WORDS, fps), [fps]);
  const c: C = cue.at;

  const tTitle = c("five teenagers");
  const t5 = c("number five");
  const t4 = c("number four", 1);
  const t3 = c("number three", 2);
  const t2 = c("number two", 1);
  const t1 = c("number one", 3);
  const tOut = c("so think");
  const END = TOP5_TEENS_FRAMES;

  const stories = [
    { n: 5, start: t5, end: t4, name: "JONATHAN JAMES", sub: "AGE 15 · NASA", color: colors.green },
    { n: 4, start: t4, end: t3, name: "MAFIABOY", sub: "AGE 15 · YAHOO", color: colors.amber },
    { n: 3, start: t3, end: t2, name: "KANE GAMBLE", sub: "AGE 15 · THE CIA", color: BLUE },
    { n: 2, start: t2, end: t1, name: "GRAHAM IVAN CLARK", sub: "AGE 17 · TWITTER", color: PURPLE },
    { n: 1, start: t1, end: tOut, name: "ARION KURTAJ", sub: "TEEN · GTA 6", color: colors.amber },
  ];

  const bedVol = (f: number) => {
    const fadeOut = interpolate(f, [END - 45, END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return 0.09 * fadeOut;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio src={staticFile("shorts/top5teens/vo.mp3")} />
      <Audio src={staticFile("shorts/top5teens/bed.mp3")} volume={bedVol} loop />
      <Background drift={0.35} vignette={0.7}>
        <Between from={0} to={tTitle}>
          <Shake at={c("only")}>
            <Hook c={c} end={tTitle} />
          </Shake>
        </Between>
        <Sfx name="slam" at={0} volume={0.5} />
        <Between from={tTitle} to={t5}>
          <Title c={c} start={tTitle} />
        </Between>
        <Between from={t5} to={t4}>
          <James c={c} start={t5} />
        </Between>
        <Between from={t4} to={t3}>
          <Mafiaboy c={c} start={t4} />
        </Between>
        <Between from={t3} to={t2}>
          <Gamble c={c} start={t3} />
        </Between>
        <Between from={t2} to={t1}>
          <Twitter c={c} start={t2} />
        </Between>
        <Between from={t1} to={tOut}>
          <Kurtaj c={c} start={t1} />
        </Between>
        <Between from={tOut} to={END}>
          <Outro c={c} start={tOut} />
        </Between>

        {/* countdown ring (left, lower-middle, inside the safe zone) */}
        {stories.map((s) => (
          <Between key={s.n} from={s.start} to={s.end}>
            <Ring n={s.n} start={s.start} end={s.end} name={s.name} sub={s.sub} color={s.color} />
          </Between>
        ))}
        {stories.map((s) => (
          <NumberCard key={`n${s.n}`} at={s.start} n={s.n} color={s.color} />
        ))}
        {[t5, t4, t3, t2, t1, tOut].map((t) => (frame >= t && frame < t + 8 ? <GlitchBars key={`gb${t}`} amount={1 - (frame - t) / 8} seed={`s-${t}`} /> : null))}
      </Background>

      <ShortCaptions
        words={WORDS}
        enabled={showCaptions}
        centerY={CAPTION_Y}
        fontSize={62}
        maxWords={4}
        maxChars={22}
        left={70}
        right={190}
        hide={[[c("which one"), END]]}
        hot={["cia", "nasa", "pentagon", "yahoo", "mafiaboy", "bragged", "brennan", "clapper", "obama", "bitcoin", "twitter", "travelodge", "gta", "guilty", "impossible", "craziest", "fifteen", "seventeen"]}
      />
    </AbsoluteFill>
  );
};
