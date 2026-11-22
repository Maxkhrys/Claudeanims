import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { colors, fonts, springs } from "../theme";
import { createCues, sp, type Word } from "../lib/timing";
import { Background, BlobCharacter, BrandTag, Flash, Glitch, GlitchBars, OnionLogo, SeizedStamp, Sfx, TitleSlam } from "../components";
import transcript from "../../public/shorts/cyberleak/words.json";
import { Between, big, Billboard, Box, type Cam, clamp01, lerp, Plane, Pop2, SHORT_H, SHORT_W, ShortCaptions, Stage3D, Tag, useCam } from "./kit3d";

/*
 * YouTube Short: "He tried to blackmail the internet with GTA 6" (the Cyberleak story).
 * Same fake-3D look as Short-Lapsus-1. Narration: public/shorts/cyberleak/vo.mp3 (ElevenLabs v4),
 * word timings in words.json (sherpa-onnx zipformer, mapped onto the script text).
 *
 *   hook      GTA 6 LEAKED + the Cyberleak leek on a spinning pedestal, browser windows orbiting
 *   profile   a tilted 3D phone with the anonymous X profile; "leak" posts fly out at the camera
 *   demand    cutaway hideout room, a hologram coin rises from the desk
 *   deal      loadout cards: pump the coin to $30M <-> get the whole game free
 *   flop      3D price chart crashes under the target line
 *   dump      the big red button, 200 GB, file cubes rain onto the grid, downloaders rush in
 *   missing   inventory grid of game files; GAME.EXE is empty, the leek keeps it
 *   malware   phone takeover: fake download copies flood in, then passwords get stolen
 *   silence   the studio block, its lights go out one by one (music cuts too)
 *   versus    biggest leak vs crypto scam
 *   end       comment poll + follow
 *
 * Every element is timed to a spoken word with c("word").
 * Mocked-up UI only: no publisher art, logos or game footage.
 */

export const shortCyberleakSchema = z.object({ showCaptions: z.boolean() });
export { SHORT_W, SHORT_H };
export const SHORT_CYBERLEAK_FRAMES = 1790;

const WORDS = transcript.words as Word[];
const LEEK = staticFile("shorts/cyberleak/leek.png");
const LOGO = staticFile("shorts/cyberleak/logo.jpg");
const BLUE = "#2F6BFF";
const LEEKGREEN = "#7BE04A";

type C = (w: string, n?: number, o?: number) => number;

/* ------------------------------------------------------------------ the character */

/** Cyberleak's own avatar character (cut out from the profile picture), with a little squash-and-bob. */
const Leek: React.FC<{ h: number; bob?: number; glow?: string; flip?: boolean; seed?: number }> = ({ h, bob = 1, glow = BLUE, flip = false, seed = 0 }) => {
  const frame = useCurrentFrame();
  const w = (h * 188) / 353;
  const b = Math.sin((frame + seed * 13) / 6);
  return (
    <div style={{ position: "relative", width: w, height: h }}>
      <div style={{ position: "absolute", left: -w * 0.1, right: -w * 0.1, bottom: -h * 0.03, height: h * 0.07, borderRadius: "50%", background: "rgba(0,0,0,0.55)", filter: "blur(6px)" }} />
      <Img
        src={LEEK}
        style={{
          position: "absolute",
          inset: 0,
          width: w,
          height: h,
          imageRendering: "pixelated",
          transformOrigin: "50% 100%",
          transform: `scaleX(${(flip ? -1 : 1) * (1 - 0.02 * b * bob)}) scaleY(${1 + 0.025 * b * bob}) rotate(${1.5 * Math.sin((frame + seed * 7) / 17) * bob}deg)`,
          filter: `drop-shadow(0 0 ${h * 0.04}px ${glow})`,
        }}
      />
    </div>
  );
};

/** The round profile picture. */
const Avatar: React.FC<{ size: number; ring?: string }> = ({ size, ring = BLUE }) => (
  <div style={{ width: size, height: size, borderRadius: size, overflow: "hidden", border: `${size * 0.04}px solid ${ring}`, boxShadow: `0 0 ${size * 0.3}px ${ring}88`, background: "#000", flexShrink: 0 }}>
    <Img src={LOGO} style={{ width: "100%", height: "100%", transform: "scale(1.08)" }} />
  </div>
);

/** A spinning coin with thickness. */
const Coin3D: React.FC<{ size: number; spin: number; label?: string }> = ({ size, spin, label = "LEEK" }) => (
  <div style={{ position: "relative", width: size, height: size, perspective: 1200 }}>
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${spin}deg)` }}>
      {new Array(9).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, borderRadius: size, background: "#B8860B", transform: `translateZ(${(i - 4) * size * 0.012}px)` }} />
      ))}
      {[1, -1].map((s) => (
        <div
          key={s}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: size,
            background: `radial-gradient(circle at 35% 30%, #FFE69A, ${colors.amber} 55%, #C98A1C)`,
            border: `${size * 0.05}px solid #E2A33A`,
            transform: `translateZ(${s * size * 0.05}px) ${s < 0 ? "rotateY(180deg)" : ""}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backfaceVisibility: "hidden",
          }}
        >
          <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 40 40">
            <path d="M18 38 V18 C 14 10 8 6 4 2 C 12 4 18 10 20 16 C 22 8 28 3 36 2 C 30 8 24 12 22 18 V38 Z" fill={colors.bg} opacity={0.75} />
          </svg>
          <div style={{ ...big(size * 0.2, colors.bg), textShadow: "none", marginTop: size * 0.02 }}>${label}</div>
        </div>
      ))}
    </div>
  </div>
);

/** Fake gameplay thumbnail: sunset city with palms (no real game art). */
const FakeFootage: React.FC<{ w: number; h: number; seed: number }> = ({ w, h, seed }) => {
  const hue = [0, 30, 300, 200][seed % 4];
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: w * 0.03, overflow: "hidden", background: `linear-gradient(to bottom, hsl(${hue + 280},70%,30%), hsl(${hue + 10},90%,60%) 70%, hsl(${hue + 30},90%,70%))` }}>
      <div style={{ position: "absolute", left: w * 0.55, top: h * 0.42, width: w * 0.22, height: w * 0.22, borderRadius: w, background: "#FFE0A0", opacity: 0.9 }} />
      <svg width={w} height={h} viewBox="0 0 100 60" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
        <path d={`M0 60 V40 H8 V30 H14 V44 H22 V26 H30 V38 H36 V22 H44 V40 H52 V32 H60 V45 H68 V28 H76 V42 H84 V34 H92 V46 H100 V60 Z`} fill="#1A0E2A" opacity={0.9} />
        {[12, 80].map((x, i) => (
          <g key={i} fill="#12081E">
            <rect x={x} y={26 + i * 4} width={1.6} height={34} />
            <path d={`M${x + 0.8} ${26 + i * 4} q -8 -2 -12 4 q 6 -6 12 -4 q -4 -8 -10 -8 q 8 0 10 8 q 2 -8 10 -8 q -6 2 -10 8 q 6 -2 12 4 q -6 -4 -12 -4 Z`} />
          </g>
        ))}
      </svg>
      <div style={{ position: "absolute", left: w / 2 - w * 0.08, top: h / 2 - w * 0.08, width: w * 0.16, height: w * 0.16, borderRadius: w, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 0, height: 0, borderTop: `${w * 0.035}px solid transparent`, borderBottom: `${w * 0.035}px solid transparent`, borderLeft: `${w * 0.055}px solid #fff`, marginLeft: w * 0.012 }} />
      </div>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0 2px, rgba(0,0,0,0) 2px 5px)" }} />
    </div>
  );
};

/** A post from the Cyberleak account. */
const Post: React.FC<{ w: number; seed: number; text: string }> = ({ w, seed, text }) => (
  <div style={{ width: w, padding: w * 0.04, borderRadius: w * 0.05, background: "#0D1218", border: `${w * 0.008}px solid #2A3540`, boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: w * 0.03, marginBottom: w * 0.03 }}>
      <Avatar size={w * 0.13} />
      <div>
        <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: w * 0.055, color: colors.text }}>Cyberleak</div>
        <div style={{ fontFamily: fonts.mono, fontSize: w * 0.035, color: colors.dim }}>anonymous · {["2m", "1h", "3d", "2w"][seed % 4]}</div>
      </div>
      <div style={{ marginLeft: "auto", padding: `${w * 0.008}px ${w * 0.025}px`, borderRadius: w * 0.02, background: colors.red, ...big(w * 0.06, colors.bg), textShadow: "none" }}>LEAK</div>
    </div>
    <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: w * 0.05, color: colors.text, marginBottom: w * 0.03 }}>{text}</div>
    <FakeFootage w={w * 0.92} h={w * 0.5} seed={seed} />
  </div>
);

/* ------------------------------------------------------------------ 1. hook */

const Hook: React.FC<{ c: C; out: number }> = ({ c, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = sp(frame, fps, 0, springs.pop);
  const tBlack = c("blackmail");
  const tNet = c("entire");
  const tGta = c("GTA");
  const rep = sp(frame, fps, tGta, springs.slam);
  const hit = frame >= tGta ? Math.exp(-(frame - tGta) / 5) : 0;
  const shake = (k: string) => (random(`hk-${k}-${frame}`) - 0.5) * 40 * hit;
  const N = 8;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 62%, rgba(47,107,255,0.35), rgba(0,0,0,0) 50%), radial-gradient(ellipse at 50% 18%, rgba(255,59,59,0.22), rgba(0,0,0,0) 50%)" }} />
      {/* headline, fully on screen at frame 0 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", transform: `translate(${shake("x")}px, ${-out * 800 + shake("y")}px) scale(${(1 + 0.08 * (1 - punch)) * (1 + 0.1 * hit)})` }}>
        <div style={{ display: "inline-block", padding: "6px 34px", borderRadius: 14, background: colors.red, ...big(120, colors.bg), textShadow: "none", transform: `rotate(-3deg) scale(${1 + 0.05 * Math.sin(frame / 4)})` }}>LEAKED</div>
        <div style={{ ...big(400, colors.amber), marginTop: 4, transform: `scale(${1 + 0.06 * rep * hit})` }}>GTA 6</div>
        <div style={{ display: "inline-flex", gap: 22, marginTop: 6 }}>
          <div style={{ padding: "8px 26px", borderRadius: 12, border: `5px solid ${colors.text}`, ...big(76, colors.text) }}>200 GB</div>
          <div style={{ padding: "8px 26px", borderRadius: 12, background: colors.amber, ...big(76, colors.bg), textShadow: "none" }}>FOR A CRYPTO COIN</div>
        </div>
      </div>

      {/* the leek on a spinning pedestal, browser windows orbiting it */}
      <div style={{ position: "absolute", left: 540, top: 1270, perspective: 1300, transform: `translateY(${out * 900}px)` }}>
        <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: "rotateX(-14deg)" }}>
          {/* pedestal disc */}
          <div style={{ position: "absolute", left: -260, top: -260, width: 520, height: 520, borderRadius: 520, transform: `rotateX(90deg) rotateZ(${frame * 2}deg)`, background: `repeating-conic-gradient(${BLUE}55 0 10deg, rgba(0,0,0,0) 10deg 20deg)`, border: `10px solid ${BLUE}`, boxShadow: `0 0 80px ${BLUE}` }} />
          {/* orbit */}
          {new Array(N).fill(0).map((_, i) => {
            const at = tNet + i * 3;
            if (frame < at) return null;
            const s = sp(frame, fps, at, springs.pop);
            const a = (i / N) * Math.PI * 2 + frame * 0.035;
            const x = Math.cos(a) * 400;
            const zz = Math.sin(a) * 400;
            const y = -330 + 40 * Math.sin(a * 2 + i);
            return (
              <div key={i} style={{ position: "absolute", left: -80, top: -60, width: 160, height: 120, transform: `translate3d(${x}px, ${y}px, ${zz}px) scale(${s})`, borderRadius: 14, background: "#0F1620", border: `4px solid ${i % 3 === 0 ? colors.red : BLUE}`, boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}>
                <div style={{ height: 22, borderBottom: "3px solid #24303C", display: "flex", gap: 6, alignItems: "center", paddingLeft: 10 }}>
                  {[colors.red, colors.amber, colors.green].map((cc) => (
                    <div key={cc} style={{ width: 9, height: 9, borderRadius: 9, background: cc }} />
                  ))}
                </div>
                <div style={{ textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: colors.text, marginTop: 18 }}>www</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: -150, top: -560, transform: `scale(${0.75 + 0.25 * sp(frame, fps, 0, springs.pop)})`, transformOrigin: "50% 100%" }}>
          <Leek h={560} />
        </div>
        <div style={{ position: "absolute", left: -560, top: -470, width: 600, display: "flex", justifyContent: "center", transform: "rotate(-6deg)" }}>
          <Tag at={tBlack} text="BLACKMAILER" color={colors.red} size={50} filled />
        </div>
      </div>
      <Flash at={tGta} color={colors.amber} peak={0.4} />
      <Sfx name="slam" at={tGta} volume={0.7} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 2. profile */

const MONTHS = ["AUG", "SEP", "OCT", "NOV"];

const Profile: React.FC<{ c: C }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("He runs");
  const tAnon = c("anonymous");
  const tName = c("Cyberleak");
  const tMonths = c("months");
  const tPosted = c("posted");
  const tSwore = c("swore");
  const tMil = c("Millions");
  const tEnd = c("Then");

  const rise = sp(frame, fps, t0, { damping: 18, stiffness: 80 });
  const back = sp(frame, fps, tMil - 4, springs.snappy);
  const rx = lerp(50, 14, rise) + 3 * Math.sin(frame / 30);
  const ry = lerp(-40, -16, rise) + 10 * Math.sin(frame / 45);
  const scale = lerp(0.9, 0.62, back);
  const ty = (1 - rise) * 1500 - back * 160;
  const nName = Math.floor("Cyberleak".length * clamp01((frame - tName) / 14));
  const scroll = sp(frame, fps, tPosted, springs.smooth, 40) * 560;
  const views = Math.floor(9_999_999 * clamp01((frame - tMil) / 16) ** 2);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(47,107,255,0.25), rgba(0,0,0,0) 55%)" }} />
      <Sfx name="whoosh" at={t0} volume={0.7} />
      {/* the phone */}
      <div style={{ position: "absolute", left: 540, top: 820, perspective: 1700 }}>
        <div style={{ position: "absolute", left: -380, top: -700, width: 760, height: 1400, transformStyle: "preserve-3d", transform: `translateY(${ty}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${-4 + 2 * Math.sin(frame / 37)}deg) scale(${scale})` }}>
          {/* thickness */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ position: "absolute", inset: 0, borderRadius: 90, background: "#1A222B", transform: `translateZ(${-i * 8}px)` }} />
          ))}
          <div style={{ position: "absolute", inset: 0, borderRadius: 90, background: "#0B0F13", border: "8px solid #3A4753", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 30, right: 30, top: 30, bottom: 30, borderRadius: 66, overflow: "hidden", background: "#05070A" }}>
              {/* banner */}
              <div style={{ height: 260, background: `linear-gradient(120deg, #0A1A4A, ${BLUE} 60%, #0A1A4A)`, backgroundSize: "200% 100%", backgroundPosition: `${frame * 2}% 0` }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 260, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 4px, rgba(0,0,0,0) 4px 24px)" }} />
              </div>
              <div style={{ position: "absolute", left: 40, top: 160 }}>
                <Avatar size={220} />
              </div>
              <div style={{ position: "absolute", right: 40, top: 290, padding: "12px 34px", borderRadius: 50, background: colors.text, fontFamily: fonts.sans, fontWeight: 800, fontSize: 36, color: colors.bg }}>Follow</div>
              <div style={{ position: "absolute", left: 50, top: 400 }}>
                <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 84, color: colors.text, minHeight: 90 }}>
                  {frame >= tName ? "Cyberleak".slice(0, nName) : "??????"}
                  {frame >= tName && nName < 9 ? <span style={{ color: BLUE }}>▌</span> : null}
                </div>
                <div style={{ fontFamily: fonts.mono, fontSize: 34, color: colors.dim, marginTop: 6 }}>on X · real name: unknown</div>
              </div>
              {/* feed */}
              <div style={{ position: "absolute", left: 0, right: 0, top: 600, bottom: 0, overflow: "hidden", borderTop: "3px solid #1E2A32" }}>
                <div style={{ transform: `translateY(${-scroll}px)`, padding: "30px 30px", display: "flex", flexDirection: "column", gap: 30 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <Post key={i} w={640} seed={i} text={["GTA 6 gameplay. real. 👀", "more footage tonight", "you're not ready", "told you it was real"][i]} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* labels */}
      <Pop2 at={tAnon} until={tMonths - 4} style={{ left: 0, right: 0, top: 170, textAlign: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 20, padding: "12px 34px", borderRadius: 16, background: colors.panel, border: `6px solid ${colors.text}`, ...big(100, colors.text) }}>
          <span style={{ ...big(100, colors.red) }}>?</span> ANONYMOUS
        </span>
      </Pop2>
      {frame >= tMonths && frame < tSwore ? (
        <Pop2 at={tMonths} style={{ left: 0, right: 0, top: 170, textAlign: "center" }} sound={false}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 24 }}>
            <span style={{ ...big(100, colors.text) }}>POSTING SINCE</span>
            <span style={{ padding: "6px 24px", borderRadius: 14, background: BLUE, ...big(100, colors.text), textShadow: "none" }}>{MONTHS[Math.min(3, Math.floor((frame - tMonths) / 8))]}</span>
          </span>
        </Pop2>
      ) : null}
      {[0, 1, 2].map((i) => (
        <Sfx key={i} name="tick" at={tMonths + i * 8} volume={0.6} />
      ))}

      {/* posts flying out at the camera */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const at = tPosted + i * 8;
        if (frame < at || frame > at + 40) return null;
        const p = (frame - at) / 40;
        const side = i % 2 === 0 ? -1 : 1;
        return (
          <div key={i} style={{ position: "absolute", left: 540, top: 820, perspective: 1200 }}>
            <Sfx name="whoosh" at={at} volume={0.35} />
            <div style={{ position: "absolute", left: -260, top: -200, transform: `translate3d(${side * p * 520}px, ${-p * 260 + i * 30}px, ${-400 + p * 1300}px) rotateY(${side * -30 * p}deg) rotateZ(${side * 8}deg)`, opacity: clamp01(p * 6) * clamp01((1 - p) * 4) }}>
              <Post w={520} seed={i + 1} text={["GTA 6 gameplay. real. 👀", "new clip", "wait for it", "they can't stop me", "real build", "👀👀"][i]} />
            </div>
          </div>
        );
      })}

      {frame >= tSwore && frame < tMil ? <SeizedStamp at={tSwore} text="100% REAL" color={colors.green} fontSize={120} rotate={-9} style={{ left: 230, top: 180 }} /> : null}

      {/* millions */}
      {frame >= tMil ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
          <Sfx name="riser" at={tMil - 6} volume={0.5} />
          <Pop2 at={tMil} style={{ left: 0, right: 0, top: 0 }} sound={false}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 24 }}>
              <svg width={140} height={100} viewBox="0 0 140 100">
                <path d="M5 50 Q 70 -20 135 50 Q 70 120 5 50 Z" fill={colors.text} />
                <circle cx={70} cy={50} r={26} fill={colors.bg} />
                <circle cx={70} cy={50} r={12} fill={BLUE} />
              </svg>
              <span style={{ ...big(150, colors.text), fontFamily: fonts.mono, fontWeight: 700, fontSize: 110 }}>{views >= 9_999_999 ? "" : views.toLocaleString("en-US")}</span>
            </div>
          </Pop2>
          {frame >= tMil + 16 ? <TitleSlam text="MILLIONS" color={colors.amber} fontSize={300} at={tMil + 16} style={{ top: -30 }} /> : null}
        </div>
      ) : null}
      {frame >= tEnd - 6 ? <GlitchBars amount={clamp01(1 - (frame - tEnd + 6) / 8)} seed="prof-out" /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 3. demand (hideout room) */

const RW = 900;
const RD = 760;
const RH = 560;

const Monitor: React.FC<{ w: number; seed: number }> = ({ w, seed }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: w, height: w * 0.62, borderRadius: 8, background: "#06101F", border: "6px solid #2C3640", boxShadow: `0 0 50px ${BLUE}88`, overflow: "hidden", padding: 8, boxSizing: "border-box" }}>
      {new Array(7).fill(0).map((_, i) => (
        <div key={i} style={{ height: 8, marginBottom: 8, borderRadius: 3, width: `${20 + 70 * random(`mon-${seed}-${i}-${Math.floor(frame / 6)}`)}%`, background: i % 3 === 0 ? colors.green : BLUE, opacity: 0.8 }} />
      ))}
    </div>
  );
};

const Demand: React.FC<{ c: C }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("Then");
  const tDemand = c("demand");
  const tBuy = c("Buy");
  const tCoin = c("coin");
  const tOut = c("Get it");

  const cam0 = useCam([
    { at: t0, tx: 0, ty: -240, tz: 0, rx: -10, ry: -60, dist: -600 },
    { at: t0 + 1, tx: 0, ty: -260, tz: 40, rx: -22, ry: -30, dist: 120 },
    { at: tDemand - 6, tx: 0, ty: -330, tz: -60, rx: -14, ry: -18, dist: 380 },
    { at: tBuy - 4, tx: 0, ty: -480, tz: 40, rx: -10, ry: -34, dist: 220 },
  ]);
  const cam: Cam = { ...cam0, ry: cam0.ry + 2.5 * Math.sin(frame / 36) };
  const coinRise = sp(frame, fps, tBuy - 2, { damping: 14, stiffness: 80 });
  const flick = 0.85 + 0.15 * random(`hq-${Math.floor(frame / 3)}`);

  return (
    <AbsoluteFill>
      <Stage3D cam={cam} cy={900}>
        {/* floor */}
        <Plane w={RW} h={RD} t="rotateX(90deg)" style={{ background: "linear-gradient(to bottom, #151B26, #1E2533)" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${BLUE}22 2px, rgba(0,0,0,0) 2px), linear-gradient(90deg, ${BLUE}22 2px, rgba(0,0,0,0) 2px)`, backgroundSize: "60px 60px" }} />
          <div style={{ position: "absolute", left: RW / 2 - 380, top: 0, width: 760, height: 600, background: `radial-gradient(ellipse at 50% 20%, ${BLUE}55, rgba(0,0,0,0) 65%)`, opacity: flick }} />
        </Plane>
        {/* back wall */}
        <Plane w={RW} h={RH} t={`translate3d(0px, ${-RH / 2}px, ${-RD / 2}px)`} style={{ background: "linear-gradient(to bottom, #0E1420, #141C2A)" }}>
          <div style={{ position: "absolute", left: 60, right: 60, top: 60, height: 10, borderRadius: 10, background: BLUE, boxShadow: `0 0 40px ${BLUE}`, opacity: flick }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", ...big(70, `${BLUE}`), opacity: 0.8 }}>LEAK HQ</div>
          {/* posters of "leaked" stills */}
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 90 + i * 260, top: 220, transform: `rotate(${(i - 1) * 4}deg)` }}>
              <FakeFootage w={200} h={130} seed={i} />
            </div>
          ))}
        </Plane>
        {/* left wall */}
        <Plane w={RD} h={RH} t={`translate3d(${-RW / 2}px, ${-RH / 2}px, 0px) rotateY(90deg)`} style={{ background: "linear-gradient(to bottom, #0B111B, #111826)" }}>
          {new Array(6).fill(0).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 80 + i * 100, top: 120, width: 60, height: 280, borderRadius: 6, background: "#0A0E14", border: "3px solid #24303C" }}>
              {new Array(8).fill(0).map((__, j) => (
                <div key={j} style={{ position: "absolute", left: 10, top: 14 + j * 32, width: 8, height: 8, borderRadius: 8, background: random(`led-${i}-${j}-${Math.floor(frame / 5)}`) > 0.5 ? colors.green : "#123" }} />
              ))}
            </div>
          ))}
        </Plane>
        <Plane w={RW + 24} h={24} t={`translate3d(12px, ${-RH}px, ${-RD / 2 - 12}px) rotateX(90deg)`} style={{ background: "#2A3A5C" }} />
        <Plane w={24} h={RD} t={`translate3d(${-RW / 2 - 12}px, ${-RH}px, 0px) rotateX(90deg)`} style={{ background: "#2A3A5C" }} />

        {/* the leek behind the desk */}
        <Billboard pos={{ x: 0, y: 0, z: -40 }} cam={cam} w={300} h={420}>
          <Leek h={400} />
        </Billboard>
        {/* desk */}
        <Box x={0} z={120} w={560} d={180} h={130} top="#2E3742" front="#1E2630" side="#171D25" />
        {[-180, 0, 180].map((x, i) => (
          <Billboard key={i} pos={{ x, y: -130, z: 160 }} cam={cam} w={190} h={130}>
            <Monitor w={170} seed={i} />
          </Billboard>
        ))}

        {/* hologram coin rising from the desk */}
        {frame >= tBuy - 2 ? (
          <Billboard pos={{ x: 0, y: -170 - coinRise * 300, z: 160 }} cam={cam} w={360} h={380}>
            <div style={{ position: "relative", transform: `scale(${coinRise})`, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "absolute", left: -40, right: -40, top: 290, height: 300, background: `linear-gradient(to bottom, ${colors.amber}55, rgba(0,0,0,0))`, clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)" }} />
              <Coin3D size={290} spin={frame * 7} />
            </div>
          </Billboard>
        ) : null}

        <Billboard pos={{ x: 0, y: -470, z: -40 }} cam={cam} w={700} h={130}>
          <Tag at={tDemand} until={tBuy - 4} text="THE DEMAND" color={colors.red} size={60} filled />
        </Billboard>
      </Stage3D>
      {frame >= tCoin ? (
        <Pop2 at={tCoin} style={{ left: 0, right: 0, top: 170, textAlign: "center" }}>
          <span style={{ display: "inline-block", padding: "10px 36px", borderRadius: 16, background: colors.amber, ...big(120, colors.bg), textShadow: "none", transform: `rotate(-2deg) scale(${1 + 0.04 * Math.sin(frame / 3)})` }}>BUY MY COIN</span>
        </Pop2>
      ) : null}
      <Sfx name="coin" at={tCoin} volume={0.8} />
      <Sfx name="riser" at={tBuy - 8} volume={0.45} />
      {frame >= tOut - 6 ? <GlitchBars amount={clamp01(1 - (frame - tOut + 6) / 8)} seed="hq-out" /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 4. the deal (loadout cards) */

const DealCard: React.FC<{ color: string; rarity: string; title: string; sub: string; art: React.ReactNode; children?: React.ReactNode }> = ({ color, rarity, title, sub, art, children }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "linear-gradient(to bottom, #121A22, #0A0F14)", border: `6px solid ${color}`, boxShadow: `0 0 70px ${color}66`, overflow: "hidden", backfaceVisibility: "hidden" }}>
    <div style={{ height: 66, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ ...big(52, colors.bg), textShadow: "none", letterSpacing: "0.12em" }}>{rarity}</span>
    </div>
    <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 50% 55%, ${color}33, rgba(0,0,0,0) 65%)` }}>{art}</div>
    <div style={{ textAlign: "center", ...big(78, colors.text), whiteSpace: "normal", lineHeight: 0.95, padding: "0 20px" }}>{title}</div>
    <div style={{ textAlign: "center", fontFamily: fonts.mono, fontSize: 26, fontWeight: 700, color: colors.dim, letterSpacing: "0.08em", marginTop: 12 }}>{sub}</div>
    {children}
  </div>
);

const CardBack: React.FC<{ color: string }> = ({ color }) => (
  <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "#0C1115", border: `6px solid ${color}`, transform: "rotateY(180deg)", backfaceVisibility: "hidden", display: "flex", alignItems: "center", justifyContent: "center", backgroundImage: `repeating-linear-gradient(45deg, ${color}22 0 16px, rgba(0,0,0,0) 16px 32px)` }}>
    <span style={{ ...big(200, color) }}>?</span>
  </div>
);

/** A plain game box mock-up: no real cover art. */
const GameBox: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, height: w * 1.25, borderRadius: w * 0.05, background: "linear-gradient(160deg, #3A1A5A, #D0408A 55%, #FFB547)", border: `${w * 0.03}px solid #E6E6E6`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 16px 40px rgba(0,0,0,0.6)", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "30%", background: "#14081E", clipPath: "polygon(0 40%, 15% 20%, 25% 50%, 40% 10%, 55% 45%, 70% 15%, 85% 40%, 100% 25%, 100% 100%, 0 100%)" }} />
    <div style={{ ...big(w * 0.36, "#fff"), textShadow: "0 4px 0 rgba(0,0,0,0.5)", textAlign: "center", lineHeight: 0.85 }}>
      GTA
      <br />6
    </div>
  </div>
);

const Deal: React.FC<{ c: C }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("Get it");
  const tThirty = c("thirty");
  const tGive = c("I'll give");
  const tWhole = c("whole");
  const tFree = c("Free");
  const tEnd = c("The internet");

  const target = Math.floor(30_000_000 * clamp01((frame - tThirty) / 22) ** 0.6);
  const cards = [
    { at: t0 - 2, x: 285, color: colors.amber, rarity: "YOU DO THIS", title: "PUMP MY COIN", sub: "TO $30,000,000", art: <Coin3D size={190} spin={frame * 5} /> },
    { at: tGive - 2, x: 795, color: colors.green, rarity: "YOU GET THIS", title: "THE WHOLE GAME", sub: "FULL BUILD", art: <GameBox w={150} /> },
  ];
  const glowSwap = frame >= tWhole ? 0.5 + 0.5 * Math.sin((frame - tWhole) / 3) : 0;

  return (
    <AbsoluteFill>
      {/* scrolling grid floor */}
      <div style={{ position: "absolute", left: 540, top: 1150, perspective: 900 }}>
        <div style={{ position: "absolute", left: -1500, top: -1500, width: 3000, height: 3000, transform: "rotateX(78deg)", backgroundImage: `linear-gradient(${colors.amber}44 3px, rgba(0,0,0,0) 3px), linear-gradient(90deg, ${colors.amber}44 3px, rgba(0,0,0,0) 3px)`, backgroundSize: "120px 120px", backgroundPosition: `0px ${(frame * 6) % 120}px`, maskImage: "radial-gradient(circle at 50% 50%, black 20%, transparent 55%)", WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 20%, transparent 55%)" }} />
      </div>
      <TitleSlam text="THE DEAL" color={colors.text} fontSize={230} at={t0} style={{ top: 140 }} />

      {cards.map((cd, i) => {
        if (frame < cd.at) return null;
        const flip = sp(frame, fps, cd.at, { damping: 14, stiffness: 110, mass: 0.8 });
        const yaw = 180 * (1 - flip) + 8 * Math.sin((frame + i * 30) / 16);
        const pitch = 8 + 3 * Math.sin((frame + i * 20) / 19);
        return (
          <div key={i} style={{ position: "absolute", left: cd.x, top: 800 + (1 - flip) * 500, perspective: 1400 }}>
            <Sfx name="whoosh" at={cd.at} volume={0.6} />
            <Sfx name="snap" at={cd.at + 8} volume={0.5} />
            <div style={{ position: "absolute", left: -230, top: -320, width: 460, height: 640, transformStyle: "preserve-3d", transform: `rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${(1 - flip) * (i ? 10 : -10)}deg)` }}>
              <DealCard color={cd.color} rarity={cd.rarity} title={cd.title} sub={cd.sub} art={cd.art}>
                {i === 0 && frame >= tThirty ? (
                  <div style={{ position: "absolute", left: 30, right: 30, bottom: 34 }}>
                    <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 40, color: colors.amber, textAlign: "center", marginBottom: 10 }}>${target.toLocaleString("en-US")}</div>
                    <div style={{ height: 26, borderRadius: 8, border: `4px solid ${colors.amber}`, padding: 3 }}>
                      <div style={{ width: `${(target / 30_000_000) * 100}%`, height: "100%", borderRadius: 4, background: colors.amber }} />
                    </div>
                  </div>
                ) : null}
              </DealCard>
              <CardBack color={cd.color} />
            </div>
          </div>
        );
      })}
      {/* swap arrows */}
      {frame >= tGive ? (
        <div style={{ position: "absolute", left: 540 - 70, top: 730, transform: `scale(${sp(frame, fps, tGive, springs.pop) * (1 + 0.12 * glowSwap)})` }}>
          <svg width={140} height={140} viewBox="0 0 140 140">
            <circle cx={70} cy={70} r={66} fill={colors.bg} stroke={colors.text} strokeWidth={6} />
            <path d="M35 55 H100 L85 40 M105 85 H40 L55 100" fill="none" stroke={colors.text} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : null}
      {frame >= tFree ? <SeizedStamp at={tFree} text="FREE" color={colors.green} fontSize={190} rotate={-12} style={{ left: 600, top: 860 }} /> : null}
      <Sfx name="tick" at={tThirty} durationInFrames={22} loop volume={0.4} />
      <Sfx name="coin" at={tThirty + 22} volume={0.7} />
      {frame >= tEnd - 6 ? <GlitchBars amount={clamp01(1 - (frame - tEnd + 6) / 8)} seed="deal-out" /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 5. the flop (3D chart) */

const CHART = [0.08, 0.12, 0.1, 0.18, 0.22, 0.2, 0.27, 0.25, 0.3, 0.24, 0.14, 0.09, 0.05, 0.03];

const Flop: React.FC<{ c: C }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("The internet");
  const tNo = c("no");
  const tFlop = c("flopped");
  const tEnd = c("So he did");

  const draw = clamp01((frame - t0) / (tFlop - t0 + 4));
  const n = CHART.length;
  const W = 820;
  const H = 620;
  const pts = CHART.map((v, i) => [(i / (n - 1)) * W, H - v * H] as const);
  const shown = Math.max(2, Math.ceil(draw * n));
  const path = pts.slice(0, shown).map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const crashing = shown > 9;
  const hit = frame >= tFlop ? Math.exp(-(frame - tFlop) / 6) : 0;
  const ent = sp(frame, fps, t0, springs.snappy);

  return (
    <AbsoluteFill style={{ transform: `translate(${(random(`fl-x-${frame}`) - 0.5) * 40 * hit}px, ${(random(`fl-y-${frame}`) - 0.5) * 40 * hit}px)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, ${crashing ? "rgba(255,59,59,0.25)" : "rgba(57,255,136,0.15)"}, rgba(0,0,0,0) 60%)` }} />
      <div style={{ position: "absolute", left: 540, top: 840, perspective: 1500 }}>
        <div style={{ position: "absolute", left: -W / 2 - 50, top: -H / 2 - 60, width: W + 100, height: H + 120, borderRadius: 30, background: "#0B1016", border: "5px solid #24303C", boxShadow: "0 40px 100px rgba(0,0,0,0.7)", transform: `rotateX(${18 + 2 * Math.sin(frame / 20)}deg) rotateY(${-16 + 4 * Math.sin(frame / 30)}deg) scale(${0.6 + 0.4 * ent})` }}>
          <div style={{ position: "absolute", left: 30, top: 18, fontFamily: fonts.mono, fontWeight: 700, fontSize: 34, color: colors.dim }}>$CYBERLEEK</div>
          <svg width={W} height={H} style={{ position: "absolute", left: 50, top: 60, overflow: "visible" }}>
            {[0.25, 0.5, 0.75].map((g) => (
              <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke="#1A242E" strokeWidth={3} />
            ))}
            <line x1={0} x2={W} y1={30} y2={30} stroke={colors.amber} strokeWidth={6} strokeDasharray="18 14" />
            <text x={W} y={16} textAnchor="end" fill={colors.amber} style={{ fontFamily: fonts.display, fontSize: 52 }}>
              TARGET $30M
            </text>
            <path d={`${path} L${pts[shown - 1][0]},${H} L0,${H} Z`} fill={crashing ? "rgba(255,59,59,0.18)" : "rgba(57,255,136,0.15)"} />
            <path d={path} fill="none" stroke={crashing ? colors.red : colors.green} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" />
            <circle cx={pts[shown - 1][0]} cy={pts[shown - 1][1]} r={16} fill={crashing ? colors.red : colors.green} />
          </svg>
        </div>
      </div>
      {/* the internet says no */}
      {[0, 1, 2, 3, 4].map((i) => {
        const at = tNo + i * 3;
        if (frame < at) return null;
        const s = sp(frame, fps, at, springs.pop);
        const x = [90, 760, 180, 680, 420][i];
        const y = [250, 300, 1150, 1100, 200][i];
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `scale(${s}) rotate(${(i % 2 ? 1 : -1) * 10}deg)` }}>
            <div style={{ padding: "10px 30px", borderRadius: 40, background: colors.red, ...big(110, colors.text), textShadow: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>NO</div>
          </div>
        );
      })}
      <Sfx name="error" at={tNo} volume={0.6} />
      <Sfx name="pop" at={tNo + 6} volume={0.5} />
      {frame >= tFlop ? <SeizedStamp at={tFlop} text="FLOPPED" fontSize={200} rotate={-10} style={{ left: 150, top: 700 }} sound={false} /> : null}
      <Sfx name="crash" at={tFlop} volume={0.7} />
      <Flash at={tFlop} color={colors.red} peak={0.45} />
      {frame >= tEnd - 6 ? <GlitchBars amount={clamp01(1 - (frame - tEnd + 6) / 8)} seed="flop-out" /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 6. the dump */

const CUBES = new Array(26).fill(0).map((_, i) => ({
  x: (random(`cx${i}`) - 0.5) * 520,
  z: 120 + (random(`cz${i}`) - 0.5) * 300,
  stack: Math.floor(random(`cs${i}`) * 3),
  color: ["#2F6BFF", "#39FF88", "#FFB547", "#B59AC8"][i % 4],
  rot: random(`cr${i}`) * 60 - 30,
}));

const RUNNERS = [
  { from: -900, to: -330, z: 380, color: colors.extras[0] },
  { from: 900, to: 330, z: 380, color: colors.extras[1] },
  { from: -1000, to: -230, z: 520, color: colors.extras[2] },
  { from: 1000, to: 230, z: 520, color: colors.extras[3] },
  { from: -1100, to: -430, z: 560, color: "#9AC0E8" },
  { from: 1100, to: 430, z: 560, color: "#E8C79A" },
];

const Dump: React.FC<{ c: C }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("So he did");
  const tAny = c("anyway");
  const tTwo = c("Two hundred");
  const tDump = c("dumped");
  const tPeople = c("People");
  const tDl = c("download");
  const tEnd = c("And then");

  const cam0 = useCam([
    { at: t0, tx: 0, ty: -300, tz: 0, rx: -16, ry: 30, dist: -300 },
    { at: t0 + 1, tx: 120, ty: -260, tz: 60, rx: -14, ry: 18, dist: 330 },
    { at: tTwo - 4, tx: 0, ty: -520, tz: 0, rx: -10, ry: -6, dist: 80 },
    { at: tDump - 4, tx: 0, ty: -200, tz: 100, rx: -30, ry: -14, dist: 60 },
    { at: tPeople - 4, tx: 0, ty: -160, tz: 260, rx: -22, ry: 10, dist: -60 },
  ]);
  const cam: Cam = { ...cam0, ry: cam0.ry + 2 * Math.sin(frame / 40) };
  const press = frame >= tAny ? Math.max(0, 1 - Math.abs(frame - tAny - 3) / 5) : 0;
  const gb = sp(frame, fps, tTwo, springs.slam);

  return (
    <AbsoluteFill>
      <Stage3D cam={cam} cy={920}>
        {/* grid floor */}
        <Plane w={2400} h={2000} t="rotateX(90deg)" style={{ background: `radial-gradient(circle, #121A26 0%, rgba(7,9,11,0) 60%)` }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${colors.green}33 3px, rgba(0,0,0,0) 3px), linear-gradient(90deg, ${colors.green}33 3px, rgba(0,0,0,0) 3px)`, backgroundSize: "100px 100px", maskImage: "radial-gradient(circle, black 15%, transparent 50%)", WebkitMaskImage: "radial-gradient(circle, black 15%, transparent 50%)" }} />
        </Plane>
        {/* server vault */}
        <Box
          x={-120}
          z={-260}
          w={300}
          d={200}
          h={460}
          top="#2A3442"
          front="linear-gradient(to bottom, #1B2330, #121821)"
          side="#0F141C"
          frontChildren={
            <div style={{ position: "absolute", inset: 20 }}>
              {new Array(9).fill(0).map((_, j) => (
                <div key={j} style={{ height: 34, marginBottom: 12, borderRadius: 4, background: "#0A0E14", border: "2px solid #24303C", display: "flex", alignItems: "center", gap: 8, paddingLeft: 10 }}>
                  {[0, 1, 2].map((k) => (
                    <div key={k} style={{ width: 9, height: 9, borderRadius: 9, background: random(`sv-${j}-${k}-${Math.floor(frame / 4)}`) > 0.4 ? colors.green : "#123" }} />
                  ))}
                </div>
              ))}
            </div>
          }
        />
        {/* the leek beside its server */}
        <Billboard pos={{ x: 160, y: 0, z: -120 }} cam={cam} w={260} h={380}>
          <Leek h={360} />
        </Billboard>
        {/* big red button */}
        <Box x={160} z={40} w={140} d={140} h={110} top="#2E3742" front="#232B35" side="#1A2028" />
        <Box x={160} z={40} w={90} d={90} h={40 - 26 * press} y0={-110} top={colors.red} front="#B02020" side="#801818" />

        {/* 200 GB, extruded */}
        {frame >= tTwo ? (
          <Billboard pos={{ x: 0, y: -560, z: -100 }} cam={cam} w={900} h={300}>
            <div style={{ position: "relative", transform: `scale(${2.2 - 1.2 * gb})`, opacity: clamp01((frame - tTwo) / 3) }}>
              {[6, 5, 4, 3, 2, 1].map((i) => (
                <div key={i} style={{ position: "absolute", left: i * 3, top: i * 4, ...big(270, "#7A4A00"), textShadow: "none" }}>
                  200 GB
                </div>
              ))}
              <div style={{ position: "relative", ...big(270, colors.amber) }}>200 GB</div>
            </div>
          </Billboard>
        ) : null}

        {/* file cubes raining down */}
        {CUBES.map((cb, i) => {
          const at = tDump + i * 1.4;
          if (frame < at) return null;
          const fall = sp(frame, fps, at, { damping: 12, stiffness: 120, mass: 0.8 });
          const y0 = -cb.stack * 70;
          const y = lerp(-1500, y0, fall);
          return (
            <div key={i} style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translate3d(${cb.x}px, ${y}px, ${cb.z}px) rotateY(${cb.rot}deg)` }}>
              <Box x={0} z={0} w={70} d={70} h={70} top={cb.color} front={`linear-gradient(to bottom, ${cb.color}, ${cb.color}AA)`} side={`${cb.color}88`} frontChildren={<div style={{ position: "absolute", left: 14, top: 12, right: 14, height: 8, background: "rgba(0,0,0,0.35)", borderRadius: 3 }} />} />
            </div>
          );
        })}

        {/* downloaders rush in */}
        {RUNNERS.map((r, i) => {
          const at = tPeople + i * 3;
          if (frame < at) return null;
          const run = sp(frame, fps, at, { damping: 20, stiffness: 60 });
          const x = lerp(r.from, r.to, run);
          const hop = Math.abs(Math.sin((frame + i * 5) / 3)) * 30 * (1 - run * 0.8);
          const prog = clamp01((frame - tDl - i * 2) / 24);
          return (
            <Billboard key={i} pos={{ x, y: -hop, z: r.z }} cam={cam} w={220} h={330}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                {frame >= tDl ? (
                  <div style={{ width: 170, height: 26, borderRadius: 8, border: `4px solid ${colors.green}`, padding: 3, background: colors.bg }}>
                    <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 4, background: colors.green }} />
                  </div>
                ) : null}
                <BlobCharacter color={r.color} size={190} look={{ x: r.to < 0 ? 0.7 : -0.7, y: -0.3 }} seed={i} />
              </div>
            </Billboard>
          );
        })}

        <Billboard pos={{ x: 160, y: -400, z: -120 }} cam={cam} w={600} h={130}>
          <Tag at={tAny} until={tTwo - 2} text="LEAKED ANYWAY" color={colors.red} size={50} filled />
        </Billboard>
      </Stage3D>
      {frame >= tDump ? (
        <Pop2 at={tDump} until={tPeople - 2} style={{ left: 0, right: 0, top: 1180, textAlign: "center" }} sound={false}>
          <span style={{ display: "inline-block", padding: "10px 36px", borderRadius: 16, background: colors.green, ...big(110, colors.bg), textShadow: "none" }}>DUMPED ONLINE</span>
        </Pop2>
      ) : null}
      <Sfx name="click" at={tAny} />
      <Sfx name="rumble" at={tAny + 2} volume={0.6} />
      <Flash at={tAny + 3} color={colors.red} peak={0.35} />
      <Sfx name="slam" at={tTwo} volume={0.7} />
      <Sfx name="tick" at={tDump} durationInFrames={36} loop volume={0.5} />
      <Sfx name="whoosh" at={tPeople} volume={0.5} />
      <Sfx name="notify" at={tDl + 24} volume={0.5} />
      {frame >= tEnd - 6 ? <GlitchBars amount={clamp01(1 - (frame - tEnd + 6) / 8)} seed="dump-out" /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 7. the missing file (inventory) */

const FILES = ["MAPS", "CARS", "AUDIO", "MISSIONS", "TEXTURES", "PEOPLE", "CUTSCENES", "GAME.EXE", "WEAPONS"];
const FILE_ICON: Record<string, string> = { MAPS: "▦", CARS: "◧", AUDIO: "♫", MISSIONS: "★", TEXTURES: "▤", PEOPLE: "☻", CUTSCENES: "▶", "GAME.EXE": "⏻", WEAPONS: "✦" };

const Missing: React.FC<{ c: C }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("And then");
  const tReal = c("realised");
  const tOne = c("one file");
  const tStarts = c("starts");
  const tKept = c("He kept");
  const tEnd = c("Now");

  const shrink = sp(frame, fps, tKept - 4, springs.snappy);
  const S = 280;
  const G = 26;
  const exeAlarm = frame >= tOne ? 0.5 + 0.5 * Math.sin((frame - tOne) / 3) : 0;
  const take = sp(frame, fps, tKept + 4, { damping: 16, stiffness: 90 });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(57,255,136,0.12), rgba(0,0,0,0) 60%)" }} />
      <div style={{ opacity: 1 - shrink }}>
        <TitleSlam text="THE FILES" color={colors.green} fontSize={190} at={t0} style={{ top: 120 }} />
      </div>
      {/* inventory grid, tilted */}
      <div style={{ position: "absolute", left: 540, top: 720 - shrink * 80, perspective: 1600 }}>
        <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `rotateX(${14 + 3 * Math.sin(frame / 25)}deg) rotateY(${-10 + 6 * Math.sin(frame / 33)}deg) scale(${1 - 0.25 * shrink})` }}>
          {FILES.map((f, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = (col - 1) * (S + G) - S / 2;
            const y = (row - 1) * (S + G) - S / 2;
            const exe = f === "GAME.EXE";
            const at = t0 + 4 + i * 3;
            const s = sp(frame, fps, at, springs.pop);
            const ok = !exe && frame >= at + 6;
            const border = exe ? (frame >= tOne ? colors.red : colors.line) : colors.green;
            return (
              <div
                key={f}
                style={{
                  position: "absolute",
                  left: x,
                  top: y,
                  width: S,
                  height: S,
                  borderRadius: 26,
                  border: `6px ${exe ? "dashed" : "solid"} ${border}`,
                  background: exe ? `rgba(255,59,59,${0.08 + 0.15 * exeAlarm})` : "rgba(12,17,21,0.95)",
                  boxShadow: exe && frame >= tOne ? `0 0 ${40 + 60 * exeAlarm}px ${colors.red}` : `0 0 30px ${colors.green}33`,
                  transform: `scale(${s * (exe && frame >= tOne ? 1 + 0.06 * exeAlarm : 1)}) translateZ(${exe && frame >= tOne ? 60 : 0}px)`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                {exe ? (
                  <>
                    <span style={{ ...big(150, frame >= tOne ? colors.red : colors.line), textShadow: "none" }}>?</span>
                    <span style={{ fontFamily: fonts.mono, fontSize: 32, fontWeight: 700, color: frame >= tOne ? colors.red : colors.dim }}>GAME.EXE</span>
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: 110, lineHeight: 1, color: colors.green }}>{FILE_ICON[f]}</span>
                    <span style={{ fontFamily: fonts.mono, fontSize: 30, fontWeight: 700, color: colors.text }}>{f}</span>
                    {ok ? <div style={{ position: "absolute", right: 14, top: 12, ...big(50, colors.green) }}>✓</div> : null}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {FILES.map((f, i) => (f === "GAME.EXE" ? null : <Sfx key={f} name="tick" at={t0 + 10 + i * 3} volume={0.4} />))}
      {frame >= tOne && frame < tKept ? (
        <Pop2 at={tOne} style={{ left: 0, right: 0, top: 1180, textAlign: "center" }} sound={false}>
          <span style={{ display: "inline-block", padding: "8px 30px", borderRadius: 14, background: colors.red, ...big(90, colors.text), textShadow: "none" }}>MISSING</span>
        </Pop2>
      ) : null}
      <Sfx name="error" at={tOne} volume={0.7} />
      {frame >= tStarts && frame < tKept ? (
        <Pop2 at={tStarts} style={{ left: 0, right: 0, top: 330, textAlign: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "10px 30px", borderRadius: 14, border: `5px solid ${colors.dim}`, background: colors.bg, ...big(80, colors.dim) }}>
            ▶ PLAY <span style={{ color: colors.red }}>✕</span>
          </span>
        </Pop2>
      ) : null}
      {/* he kept it */}
      {frame >= tKept - 4 ? (
        <div style={{ position: "absolute", left: 540 - 125, top: 870, transform: `translateX(${(1 - shrink) * 700}px)` }}>
          <Leek h={470} />
          <div style={{ position: "absolute", left: 30, top: lerp(-560, -120, take), transform: `rotate(${8 * Math.sin(frame / 6)}deg) scale(${lerp(1.3, 0.9, take)})` }}>
            <div style={{ width: 190, height: 190, borderRadius: 24, border: `6px solid ${colors.amber}`, background: "#1A1408", boxShadow: `0 0 60px ${colors.amber}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span style={{ fontSize: 90, lineHeight: 1, color: colors.amber }}>⏻</span>
              <span style={{ fontFamily: fonts.mono, fontSize: 26, fontWeight: 700, color: colors.amber }}>GAME.EXE</span>
            </div>
          </div>
        </div>
      ) : null}
      {frame >= tKept ? (
        <Pop2 at={tKept + 6} style={{ left: 0, right: 0, top: 170, textAlign: "center" }}>
          <span style={{ display: "inline-block", padding: "10px 36px", borderRadius: 16, background: colors.amber, ...big(130, colors.bg), textShadow: "none", transform: "rotate(-3deg)" }}>HE KEPT IT</span>
        </Pop2>
      ) : null}
      <Sfx name="whoosh" at={tKept - 4} volume={0.6} />
      <Sfx name="snap" at={tKept + 10} volume={0.6} />
      {frame >= tReal - 2 && frame < tReal + 10 ? <Flash at={tReal} color={colors.green} peak={0.2} /> : null}
      {frame >= tEnd - 6 ? <GlitchBars amount={clamp01(1 - (frame - tEnd + 6) / 8)} seed="miss-out" /> : null}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 8. malware (phone takeover) */

const FAKES = ["GTA6_FULL_BUILD.zip", "GTA6_REAL_crack.exe", "GTA6_PC_FREE.rar", "GTA6_unlocked.exe", "GTA6_EXE_FIX.zip", "GTA6_FINAL_v2.rar", "GTA6_launcher.exe", "GTA6_NO_VIRUS.zip", "GTA6_XBOX_PC.rar"];

const Malware: React.FC<{ c: C }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("Now");
  const tFlood = c("flooding");
  const tSteal = c("steal");
  const tPass = c("passwords");
  const tEnd = c("And Rockstar");

  const take = sp(frame, fps, t0, { damping: 20, stiffness: 70 });
  const rx = lerp(50, 0, take);
  const rz = lerp(-16, 0, take);
  const ty = (1 - take) * 1500;
  const scale = lerp(0.6, 1.0, take);
  const red = frame >= tSteal ? clamp01((frame - tSteal) / 4) : 0;
  const hit = frame >= tSteal ? Math.exp(-(frame - tSteal) / 7) : 0;
  const shakeX = (random(`mw-x-${frame}`) - 0.5) * 50 * hit;
  const shakeY = (random(`mw-y-${frame}`) - 0.5) * 50 * hit;
  const nFiles = frame < tFlood ? 2 : Math.min(FAKES.length, 2 + Math.floor((frame - tFlood) / 2));

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, rgba(255,59,59,${0.15 + 0.3 * red}), rgba(0,0,0,0) 60%)` }} />
      <Sfx name="whoosh" at={t0} volume={0.7} />
      <div style={{ position: "absolute", left: 540, top: 900, perspective: 1800 }}>
        <div style={{ position: "absolute", left: -480, top: -820, width: 960, height: 1640, borderRadius: 100, background: "#0B0F13", border: "8px solid #3A4753", boxShadow: "0 60px 140px rgba(0,0,0,0.8)", transform: `translate(${shakeX}px, ${ty + shakeY}px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${scale})` }}>
          <Glitch amount={hit * 0.9} seed="mw-hit" style={{ position: "absolute", left: 30, top: 30, width: 884, height: 1564 }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 74, overflow: "hidden", background: lerpColor(red) }}>
              {/* site header */}
              <div style={{ padding: "90px 50px 30px", borderBottom: `3px solid ${colors.line}` }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 30, color: colors.dim }}>free-gta6-download.site</div>
                <div style={{ ...big(110, colors.green), marginTop: 14 }}>FREE GTA 6 ⬇</div>
              </div>
              <div style={{ padding: "30px 40px", display: "flex", flexDirection: "column", gap: 22 }}>
                {FAKES.slice(0, nFiles).map((f, i) => {
                  const at = i < 2 ? t0 + 6 + i * 4 : tFlood + (i - 2) * 2;
                  const s = sp(frame, fps, at, springs.pop);
                  return (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 20, padding: "22px 26px", borderRadius: 22, background: "#121A22", border: `3px solid ${red > 0 ? colors.red : colors.line}`, transform: `scale(${s})` }}>
                      <div style={{ width: 80, height: 96, borderRadius: 10, background: i % 2 ? colors.amber : BLUE, ...big(40, colors.bg), textShadow: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>{f.split(".")[1].toUpperCase()}</div>
                      <div style={{ flex: 1, fontFamily: fonts.mono, fontWeight: 700, fontSize: 36, color: colors.text, overflow: "hidden", whiteSpace: "nowrap" }}>{f}</div>
                      <div style={{ padding: "12px 20px", borderRadius: 14, background: colors.green, ...big(46, colors.bg), textShadow: "none" }}>GET</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Glitch>
          {/* password popup */}
          {frame >= tSteal ? (
            <div style={{ position: "absolute", left: 80, right: 80, top: 520, transform: `scale(${sp(frame, fps, tSteal, springs.slam)})`, padding: "40px 40px", borderRadius: 40, background: "#1A0608", border: `8px solid ${colors.red}`, boxShadow: `0 0 120px ${colors.red}`, textAlign: "center" }}>
              <div style={{ ...big(150, colors.red) }}>⚠</div>
              <div style={{ ...big(120, colors.text), marginTop: 10 }}>PASSWORDS</div>
              <div style={{ ...big(120, colors.red) }}>STOLEN</div>
              <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 16 }}>
                {["email", "bank", "steam"].map((k, i) => {
                  const fly = clamp01((frame - tPass - i * 4) / 18);
                  return (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 24px", borderRadius: 14, background: "#2A0C10", fontFamily: fonts.mono, fontWeight: 700, fontSize: 38 }}>
                      <span style={{ color: colors.dim }}>{k}</span>
                      <span style={{ color: colors.red, transform: `translate(${fly * 500}px, ${-fly * 300}px)`, opacity: 1 - fly }}>••••••••</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {new Array(Math.max(0, nFiles - 2)).fill(0).map((_, i) => (
        <Sfx key={i} name="notify" at={tFlood + i * 2} volume={0.3} />
      ))}
      <Sfx name="glitch" at={tSteal} volume={0.7} />
      <Sfx name="slam" at={tSteal} volume={0.6} />
      <Flash at={tSteal} color={colors.red} peak={0.5} durationInFrames={16} />
      {frame >= tEnd - 6 ? <GlitchBars amount={clamp01(1 - (frame - tEnd + 6) / 8)} seed="mw-out" /> : null}
    </AbsoluteFill>
  );
};

const lerpColor = (t: number) => `rgb(${Math.round(lerp(12, 40, t))}, ${Math.round(lerp(17, 6, t))}, ${Math.round(lerp(21, 8, t))})`;

/* ------------------------------------------------------------------ 9. silence (the studio) */

const BW = 520;
const BH = 600;
const BD = 320;

const Silence: React.FC<{ c: C }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("And Rockstar");
  const tTotal = c("Total");
  const tSil = c("silence");

  const rise = sp(frame, fps, t0, { damping: 16, stiffness: 90 });
  const yaw = -30 + (frame - t0) * 0.25;
  const off = (i: number) => frame >= tTotal + i * 0.7;
  const dots = Math.floor((frame - t0) / 6) % 4;

  const windows = (cols: number, rows: number, seed: string, base: number) => (
    <div style={{ position: "absolute", left: 30, right: 30, top: 120, bottom: 120, display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, columnGap: 22, rowGap: 30 }}>
      {new Array(cols * rows).fill(0).map((_, i) => {
        const lit = random(`${seed}-${i}`) < 0.75 && !off(base + Math.floor(random(`${seed}o${i}`) * 26));
        return <div key={i} style={{ borderRadius: 4, background: lit ? "rgba(255,181,71,0.8)" : "#0B1018", boxShadow: lit ? "0 0 18px rgba(255,181,71,0.5)" : "none" }} />;
      })}
    </div>
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 70%, rgba(255,181,71,0.15), rgba(0,0,0,0) 60%)", opacity: frame >= tSil ? 0.3 : 1 }} />
      <div style={{ position: "absolute", left: 540, top: 1230, perspective: 1600 }}>
        <div style={{ position: "absolute", transformStyle: "preserve-3d", transform: `translateZ(${-120 + sp(frame, fps, t0, springs.heavy, 60) * 160}px) rotateX(-14deg) rotateY(${yaw}deg) scaleY(${rise})` }}>
          <Plane w={1300} h={1300} t="rotateX(90deg)" style={{ background: "radial-gradient(circle, #1A222D 0%, rgba(7,9,11,0) 60%)" }} />
          <Plane w={BW} h={BH} t={`translate3d(0px, ${-BH / 2}px, ${BD / 2}px)`} style={{ background: "linear-gradient(to bottom, #222C38, #18202A)", border: "4px solid #2E3A48" }}>
            {windows(4, 5, "slf", 0)}
            <div style={{ position: "absolute", left: BW / 2 - 70, bottom: 0, width: 140, height: 100, background: "#0B1018", border: "6px solid #33404E", borderBottom: "none" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 26, display: "flex", justifyContent: "center" }}>
              <BrandTag name="ROCKSTAR" size={68} />
            </div>
          </Plane>
          <Plane w={BD} h={BH} t={`translate3d(${BW / 2}px, ${-BH / 2}px, 0px) rotateY(90deg)`} style={{ background: "linear-gradient(to bottom, #182029, #11171E)", border: "4px solid #26313E" }}>
            {windows(2, 5, "sls", 4)}
          </Plane>
          <Plane w={BW} h={BD} t={`translate3d(0px, ${-BH}px, 0px) rotateX(90deg)`} style={{ background: "#2E3A48" }} />
        </div>
      </div>
      {/* a reply that never comes */}
      {frame < tSil + 6 ? (
        <Pop2 at={t0 + 6} style={{ left: 600, top: 330 }}>
          <div style={{ padding: "26px 44px", borderRadius: "50px 50px 50px 10px", background: colors.panelLight, border: `5px solid ${colors.line}`, display: "flex", gap: 18 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 34, height: 34, borderRadius: 34, background: colors.text, opacity: dots > i ? 1 : 0.25 }} />
            ))}
          </div>
        </Pop2>
      ) : null}
      {frame >= tTotal ? <TitleSlam text="TOTAL" fontSize={250} at={tTotal} style={{ top: 140 }} sound={false} /> : null}
      {frame >= tSil ? <TitleSlam text="SILENCE" color={colors.dim} fontSize={250} at={tSil} style={{ top: 360 }} sound={false} /> : null}
      {frame >= tSil ? (
        <Pop2 at={tSil + 4} style={{ left: 840, top: 170 }} sound={false}>
          <svg width={140} height={140} viewBox="0 0 100 100">
            <path d="M15 38 H32 L55 18 V82 L32 62 H15 Z" fill={colors.text} />
            <path d="M68 36 L92 64 M92 36 L68 64" stroke={colors.red} strokeWidth={9} strokeLinecap="round" />
          </svg>
        </Pop2>
      ) : null}
      <Sfx name="whoosh" at={t0} volume={0.6} />
      <Sfx name="click" at={tTotal} volume={0.6} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 10. versus */

const Versus: React.FC<{ c: C }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("So is this");
  const tBig = c("biggest");
  const tOr = c("or");
  const tScam = c("scam");
  const top = sp(frame, fps, tBig - 4, springs.snappy);
  const bot = sp(frame, fps, c("most") - 4, springs.snappy);
  const vs = sp(frame, fps, tOr, springs.slam);
  const sway = Math.sin(frame / 14);

  const Panel: React.FC<{ y: number; color: string; l1: string; l2: string; p: number; side: number; icon: React.ReactNode }> = ({ y, color, l1, l2, p, side, icon }) => (
    <div style={{ position: "absolute", left: 540, top: y, perspective: 1400 }}>
      <div style={{ position: "absolute", left: -470, top: -250, width: 940, height: 500, borderRadius: 40, background: `linear-gradient(135deg, ${color}, ${color}88)`, border: `8px solid ${color}`, boxShadow: `0 0 90px ${color}88`, transform: `translateX(${(1 - p) * side * 1200}px) rotateY(${side * (8 + 4 * sway)}deg) rotateX(${side * 6}deg)`, display: "flex", alignItems: "center", gap: 30, padding: "0 50px", boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ ...big(120, colors.text) }}>{l1}</div>
          <div style={{ ...big(70, colors.bg), textShadow: "none", marginTop: 10 }}>{l2}</div>
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      <Sfx name="whoosh" at={t0} volume={0.6} />
      <AbsoluteFill style={{ background: `linear-gradient(170deg, ${BLUE}33 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0) 55%, ${colors.red}33 100%)` }} />
      <Panel y={440} color={BLUE} l1="BIGGEST LEAK" l2="IN GAMING HISTORY?" p={top} side={-1} icon={<GameBox w={190} />} />
      <Panel y={1040} color={colors.red} l1="CRYPTO SCAM" l2="THE MOST ELABORATE?" p={bot} side={1} icon={<Coin3D size={210} spin={frame * 6} />} />
      <Sfx name="whoosh" at={tBig - 4} volume={0.5} />
      <Sfx name="whoosh" at={c("most") - 4} volume={0.5} />
      {frame >= tOr ? (
        <div style={{ position: "absolute", left: 540 - 120, top: 740 - 120, width: 240, height: 240, borderRadius: 240, background: colors.bg, border: `10px solid ${colors.amber}`, boxShadow: `0 0 80px ${colors.amber}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${2 - vs}) rotate(${(1 - vs) * 40 + 4 * sway}deg)` }}>
          <span style={{ ...big(140, colors.amber) }}>VS</span>
        </div>
      ) : null}
      <Sfx name="slam" at={tOr} volume={0.6} />
      {frame >= tScam ? <SeizedStamp at={tScam} text="?" color={colors.amber} fontSize={160} rotate={10} style={{ left: 860, top: 1170 }} /> : null}
      {/* the leek, peeking in */}
      <div style={{ position: "absolute", left: 40, top: 640, transform: `translateX(${(1 - sp(frame, fps, tOr + 4, springs.pop)) * -400}px) rotate(${-6 + 3 * sway}deg)` }}>
        <Leek h={300} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ 11. end card */

const EndCard: React.FC<{ c: C }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = c("Follow");
  const tTell = c("tell");
  const card = sp(frame, fps, t0, { damping: 20, stiffness: 120 });
  const tap = frame >= t0 + 8 ? Math.max(0, 1 - Math.abs(frame - t0 - 16) / 6) : 0;
  const bounce = Math.abs(Math.sin((frame - t0) / 6)) * 24;
  const pulse = 1 + 0.04 * Math.sin(frame / 5);
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - card) * SHORT_H}px)` }}>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, #07090B, #0C1115)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, ${BLUE}33, rgba(0,0,0,0) 55%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 16 }}>
          <OnionLogo size={56} />
          <span style={{ fontFamily: fonts.mono, fontSize: 40, fontWeight: 700, color: colors.green, letterSpacing: "0.12em" }}>THE ONION ARCHIVE</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 540 - 150, top: 280 }}>
        <Avatar size={300} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 30 }}>
          <div style={{ padding: "16px 40px", borderRadius: 24, background: BLUE, ...big(150, colors.text), textShadow: "none", transform: `rotate(-4deg) scale(${frame >= tTell ? pulse : 1})` }}>LEAK</div>
          <div style={{ ...big(90, colors.dim) }}>OR</div>
          <div style={{ padding: "16px 40px", borderRadius: 24, background: colors.red, ...big(150, colors.text), textShadow: "none", transform: `rotate(4deg) scale(${frame >= tTell ? 2 - pulse : 1})` }}>SCAM?</div>
        </div>
        <div style={{ ...big(110, colors.amber), marginTop: 70 }}>TELL ME IN THE COMMENTS</div>
        <svg width={140} height={150} viewBox="0 0 140 150" style={{ display: "block", margin: "20px auto 0", transform: `translateY(${bounce}px)` }}>
          <path d="M70 10 V 120 M 20 76 L 70 128 L 120 76" fill="none" stroke={colors.amber} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {/* follow button with a tap */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, textAlign: "center" }}>
        <div style={{ display: "inline-block", position: "relative", padding: "22px 80px", borderRadius: 60, background: frame >= t0 + 16 ? colors.dim : colors.text, ...big(100, colors.bg), textShadow: "none", transform: `scale(${1 - 0.08 * tap})` }}>
          {frame >= t0 + 16 ? "FOLLOWING ✓" : "FOLLOW"}
          <svg width={110} height={130} viewBox="0 0 110 130" style={{ position: "absolute", right: -40, top: 50 - 30 * tap, opacity: clamp01((frame - t0 - 4) / 6) }}>
            <path d="M30 10 V 80 L 15 68 Q 5 62 12 74 L 40 118 H 90 L 100 70 Q 102 58 90 58 H 55 V 10 Q 42 -2 30 10 Z" fill="#fff" stroke={colors.bg} strokeWidth={5} />
          </svg>
        </div>
      </div>
      <Sfx name="whoosh" at={t0} volume={0.6} />
      <Sfx name="click" at={t0 + 16} volume={0.7} />
      <Sfx name="pop" at={tTell} volume={0.5} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ the Short */

export const ShortCyberleak: React.FC<z.infer<typeof shortCyberleakSchema>> = ({ showCaptions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useMemo(() => createCues(WORDS, fps), [fps]);
  const c: C = cue.at;

  const tProfile = c("He runs");
  const tDemand = c("Then");
  const tDeal = c("Get it");
  const tFlop = c("The internet");
  const tDump = c("So he did");
  const tMissing = c("And then");
  const tMalware = c("Now");
  const tSilence = c("And Rockstar");
  const tTotal = c("Total");
  const tVersus = c("So is this");
  const tEnd = c("Follow");

  const hookOut = sp(frame, fps, tProfile - 6, springs.smooth, 14);
  // music bed ducks under the voice and drops out for "total silence"
  const bedVol = (f: number) => {
    const base = 0.11;
    const cut = interpolate(f, [tTotal, tTotal + 3, tVersus - 4, tVersus + 6], [1, 0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const fade = interpolate(f, [SHORT_CYBERLEAK_FRAMES - 30, SHORT_CYBERLEAK_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return base * cut * fade;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio src={staticFile("shorts/cyberleak/vo.mp3")} />
      <Audio src={staticFile("shorts/cyberleak/bed.mp3")} volume={bedVol} />
      <BackgroundLayer>
        <Between from={0} to={tProfile + 8}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - clamp01((frame - tProfile) / 8) }}>
            <Hook c={c} out={hookOut} />
          </div>
        </Between>
        <Sfx name="slam" at={0} volume={0.6} />
        <Sfx name="stamp" at={c("blackmail")} volume={0.5} />
        <Between from={tProfile} to={tDemand}>
          <Profile c={c} />
        </Between>
        <Between from={tDemand} to={tDeal}>
          <Demand c={c} />
        </Between>
        <Between from={tDeal} to={tFlop}>
          <Deal c={c} />
        </Between>
        <Between from={tFlop} to={tDump}>
          <Flop c={c} />
        </Between>
        <Between from={tDump} to={tMissing}>
          <Dump c={c} />
        </Between>
        <Between from={tMissing} to={tMalware}>
          <Missing c={c} />
        </Between>
        <Between from={tMalware} to={tSilence}>
          <Malware c={c} />
        </Between>
        <Between from={tSilence} to={tVersus}>
          <Silence c={c} />
        </Between>
        <Between from={tVersus} to={tEnd + 20}>
          <Versus c={c} />
        </Between>
        <Between from={tEnd} to={SHORT_CYBERLEAK_FRAMES}>
          <EndCard c={c} />
        </Between>
        {[tDemand, tFlop, tDump, tMissing, tSilence, tVersus].map((t) => (frame >= t && frame < t + 8 ? <GlitchBars key={t} amount={1 - (frame - t) / 8} seed={`in-${t}`} /> : null))}
        <Flash at={tDeal} color={colors.amber} peak={0.3} durationInFrames={10} />
      </BackgroundLayer>

      <ShortCaptions
        words={WORDS}
        enabled={showCaptions}
        centerY={1440}
        hide={[[tEnd, SHORT_CYBERLEAK_FRAMES]]}
        hot={["blackmail", "cyberleak", "millions", "free", "flopped", "kept", "passwords", "silence", "scam", "leak", "no"]}
      />
    </AbsoluteFill>
  );
};

/** Grain, scanlines and vignette over the scenes, with a slow drift. */
const BackgroundLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Background drift={0.35} vignette={0.7}>
    {children}
  </Background>
);
