import React from "react";
import { AbsoluteFill, Audio, Loop, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { z } from "zod";
import { springs } from "../theme";
import { createCues, sp, type Word } from "../lib/timing";
import { Sfx } from "../components";
import transcript from "../../public/shorts/photoban/words.json";
import { ShortCaptions, SHORT_H, SHORT_W } from "./kit3d";

/*
 * "Rockstar put a nudist beach in GTA 6... and PlayStation is banning people for it." (about 38 s).
 * Facts (27 Nov 2026), from 2+ outlets:
 *  - PSN player says PlayStation Safety suspended his social features for 30 days for sending ONE friend an
 *    in-game photo of GTA 6's nudist area; notice cited "pornographic or obscene content" (his X post, 20 Nov;
 *    PetaPixel 24 Nov citing TweakTown + Engadget). He says it also blocks online play such as Call of Duty.
 *  - Xbox: Reddit players say auto-uploaded GTA 6 beach clips triggered automatic 2-day bans (Pure Xbox, 20 Nov).
 *  - Sony and Microsoft have not commented, so every ban line is "he says" / "players say" on screen too.
 * Never show nudity: the beach is drawn and the bodies are behind a CENSORED bar.
 * Same noir evidence board as GTA6PcPort / OneWeekHacked. Real logos: GTA VI, PlayStation, Xbox
 * (PlayStation + Xbox marks from the simple-icons package, recoloured).
 * Narration: public/shorts/photoban/vo.mp3 (Max's Gemini take, variant B, pauses capped at ~0.28 s), words.json
 * (sherpa zipformer + script align; the doubled "FAIR or RIDICULOUS" was not spoken, so it is on the end card only).
 * Safe zone for key text: x 60..918, y 192..1536; captions small at about 62% down.
 */

loadFont({ family: "Anton", weight: "400", url: staticFile("fonts/Anton-400.woff2") });

export const photoBanSchema = z.object({ showCaptions: z.boolean() });
export const PHOTO_BAN_FRAMES = 1160;

const WORDS = transcript.words as Word[];
const FPS = 30;
const CUE = createCues(WORDS, FPS);
const c = (w: string, n = 0, o = 0) => CUE.at(w, n, o);

const LOGO = {
  gta: staticFile("shorts/photoban/gta6.png"),
  psw: staticFile("shorts/photoban/ps-white.svg"),
  psb: staticFile("shorts/photoban/ps-blue.svg"),
  xbw: staticFile("shorts/photoban/xbox-white.svg"),
  xbg: staticFile("shorts/photoban/xbox-green.svg"),
};
const AR = { gta: 981 / 745, ps: 1, xb: 1 };
const PSBLUE = "#0070D1";

const ANTON = `"Anton", "Bebas Neue", sans-serif`;
const MONO = `"JetBrains Mono", monospace`;
const PINK = "#FF2BD6";
const TEAL = "#22E6FF";
const SUN = "#FFD23F";
const RED = "#E8283C";
const PAPER = "#ECE4D2";
const INK = "#141414";
const GREEN = "#39FF88";
const BLURPLE = "#5865F2";
const XBOX = "#107C10";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const ramp = (f: number, a: number, d = 10) => clamp01((f - a) / d);
const usePop = (at: number, cfg = springs.pop) => {
  const f = useCurrentFrame();
  return f < at ? 0 : sp(f, FPS, at, cfg);
};
const rndAt = (n: number, f: number) => {
  const x = Math.sin(n * 127.1 + f * 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/* ------------------------------------------------------------------ board pieces */

const SvgDefs: React.FC = () => (
  <defs>
    <filter id="pb-cork" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".45" numOctaves="4" seed="21" />
      <feColorMatrix values="0 0 0 0 .2 0 0 0 0 .13 0 0 0 0 .08 0 0 0 .85 0" />
      <feComposite in2="SourceGraphic" operator="in" />
    </filter>
    <filter id="pb-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="10" result="a" />
      <feMerge>
        <feMergeNode in="a" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="pb-blur">
      <feGaussianBlur stdDeviation="10" />
    </filter>
    <filter id="pb-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="6" dy="10" stdDeviation="8" floodColor="#000" floodOpacity=".6" />
    </filter>
    <radialGradient id="pb-spot" cx=".5" cy=".42" r=".7">
      <stop offset=".35" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity=".85" />
    </radialGradient>
    <linearGradient id="pb-vice" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2a0b3d" />
      <stop offset=".6" stopColor="#c2306b" />
      <stop offset="1" stopColor="#ff9a3c" />
    </linearGradient>
    <linearGradient id="pb-night" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#05060f" />
      <stop offset="1" stopColor="#141a33" />
    </linearGradient>
  </defs>
);

const Pin: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx="6" cy="10" rx="16" ry="8" fill="#000" opacity=".45" />
    <circle r="17" fill="#C4161C" />
    <circle cx="-5" cy="-5" r="6" fill="#ff8a8a" />
  </g>
);

const BW = 2600;
const BH = 5900;
const PW = 900;
const PH = 1010;
const IMG_W = 820;
const IMG_H = 780;

type P = { x: number; y: number; r: number; label: string };

const Polaroid: React.FC<{ p: P; at?: number; children: React.ReactNode }> = ({ p, at = -100, children }) => {
  const s = usePop(at, springs.snappy);
  const shown = at < 0 ? 1 : s;
  return (
    <g transform={`translate(${p.x},${p.y}) rotate(${p.r}) scale(${0.85 + 0.15 * shown})`} opacity={clamp01(shown * 2)}>
      <rect x={-PW / 2 + 14} y={-PH / 2 + 22} width={PW} height={PH} fill="#000" opacity=".5" filter="url(#pb-blur)" />
      <rect x={-PW / 2} y={-PH / 2} width={PW} height={PH} fill="#F1ECE2" />
      <svg x={-PW / 2 + 40} y={-PH / 2 + 40} width={IMG_W} height={IMG_H} viewBox={`0 0 ${IMG_W} ${IMG_H}`} overflow="hidden">
        {children}
        <rect width={IMG_W} height={IMG_H} fill="url(#pb-spot)" opacity=".7" />
      </svg>
      <text x={0} y={PH / 2 - 62} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={38} fill="#2a2a2a" letterSpacing="3">
        {p.label}
      </text>
      <Pin x={0} y={-PH / 2 + 14} s={1.3} />
    </g>
  );
};

const Note: React.FC<{ x: number; y: number; r?: number; w: number; h: number; at: number; color?: string; children: React.ReactNode }> = ({
  x,
  y,
  r = 0,
  w,
  h,
  at,
  color = PAPER,
  children,
}) => {
  const s = usePop(at);
  if (s <= 0) return null;
  return (
    <g transform={`translate(${x},${y}) rotate(${r + (1 - s) * 14}) scale(${lerp(1.6, 1, s)})`} opacity={clamp01(s * 3)}>
      <rect x={-w / 2 + 10} y={-h / 2 + 16} width={w} height={h} fill="#000" opacity=".45" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={color} />
      {children}
      <Pin x={0} y={-h / 2 + 4} />
    </g>
  );
};

const Stamp: React.FC<{ x: number; y: number; at: number; text: string; color?: string; size?: number; r?: number }> = ({
  x,
  y,
  at,
  text,
  color = RED,
  size = 92,
  r = -10,
}) => {
  const s = usePop(at, springs.snappy);
  if (s <= 0) return null;
  const w = text.length * size * 0.56 + 60;
  const h = size * 1.3;
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${lerp(2.4, 1, s)})`} opacity={clamp01(s * 2) * 0.95}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10" fill="rgba(0,0,0,0.45)" stroke={color} strokeWidth={10} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={ANTON} fontSize={size} fill={color} letterSpacing="5">
        {text}
      </text>
    </g>
  );
};

const Tag: React.FC<{ x: number; y: number; at: number; text: string; color?: string; size?: number }> = ({ x, y, at, text, color = SUN, size = 40 }) => {
  const s = usePop(at, springs.snappy);
  if (s <= 0) return null;
  const w = text.length * size * 0.62 + 40;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.5} rx="8" fill="#0b0b0f" stroke={color} strokeWidth="4" />
      <text x={0} y={size * 0.25} textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  );
};

/** Real logo image centred on (x,y) with height h; slams in at `at`. */
const Logo: React.FC<{ href: string; ar: number; x: number; y: number; h: number; at?: number; r?: number; shadow?: boolean }> = ({
  href,
  ar,
  x,
  y,
  h,
  at = -100,
  r = 0,
  shadow = true,
}) => {
  const s = usePop(Math.max(0, at), springs.slam);
  const shown = at < 0 ? 1 : s;
  if (shown <= 0) return null;
  const w = h * ar;
  return (
    <g transform={`translate(${x},${y}) rotate(${r}) scale(${lerp(2.2, 1, shown)})`} opacity={clamp01(shown * 3)}>
      <image href={href} x={-w / 2} y={-h / 2} width={w} height={h} filter={shadow ? "url(#pb-shadow)" : undefined} />
    </g>
  );
};

const RedString: React.FC<{ pts: { x: number; y: number }[]; at: number[] }> = ({ pts, at }) => {
  const f = useCurrentFrame();
  return (
    <g>
      {pts.slice(1).map((b, i) => {
        const a = pts[i];
        const p = ease(ramp(f, at[i], 14));
        if (p <= 0) return null;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2 + 90;
        const len = Math.hypot(b.x - a.x, b.y - a.y) * 1.15;
        return (
          <path
            key={i}
            d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`}
            fill="none"
            stroke="#C4161C"
            strokeWidth="7"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - p)}
            opacity=".95"
          />
        );
      })}
    </g>
  );
};

const Grain: React.FC<{ f: number }> = ({ f }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
    <filter id={`pb-grain-${f % 3}`}>
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed={7 + (f % 3)} />
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .08 0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#pb-grain-${f % 3})`} />
  </svg>
);

/** Typed text from frame `at`. */
const typed = (f: number, at: number, text: string, speed = 1.4) => (f < at ? "" : text.slice(0, Math.floor((f - at) * speed) + 1));

/* ------------------------------------------------------------------ drawings */

/** Drawn Vice-City beach at sunset, w x h, origin top-left. `censor` 0..1 slides the CENSORED bar in. */
const Beach: React.FC<{ w: number; h: number; f: number; censor?: number; tint?: number }> = ({ w, h, f, censor = 0, tint = 0 }) => {
  const horizon = h * 0.5;
  const sand = h * 0.68;
  return (
    <g>
      <rect width={w} height={horizon} fill="url(#pb-vice)" />
      <circle cx={w * 0.62} cy={horizon - h * 0.02} r={h * 0.16} fill="#ffd36b" opacity=".95" />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={0} y={horizon - h * 0.02 - h * 0.12 + i * h * 0.035} width={w} height={h * 0.012} fill="#c2306b" opacity=".55" />
      ))}
      <rect y={horizon} width={w} height={sand - horizon} fill="#1d5e8c" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect
          key={`w${i}`}
          x={((i * 173 + f * 2) % (w + 200)) - 200}
          y={horizon + 10 + i * ((sand - horizon) / 6)}
          width={160}
          height={5}
          fill="#9fd6ff"
          opacity=".5"
        />
      ))}
      <rect y={sand} width={w} height={h - sand} fill="#e7b77a" />
      {/* palms */}
      {[0.1, 0.9].map((px, i) => (
        <g key={`p${i}`} transform={`translate(${w * px},${h}) scale(${h / 780})`}>
          <path d={`M0,0 C${i ? -20 : 20},-160 ${i ? -50 : 50},-300 ${i ? -30 : 30},-440`} stroke="#140a1c" strokeWidth="22" fill="none" />
          {[-150, -100, -40, 20, 80, 140].map((a, k) => (
            <path
              key={k}
              d={`M${i ? -30 : 30},-440 q${Math.cos((a * Math.PI) / 180) * 90},${-60 + Math.abs(a) * 0.4} ${Math.cos((a * Math.PI) / 180) * 180},${40 + Math.abs(a) * 0.5}`}
              stroke="#140a1c"
              strokeWidth="18"
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>
      ))}
      {/* two vague figures on the sand (silhouettes only) */}
      <g transform={`translate(${w * 0.42},${h * 0.9}) scale(${h / 780})`} fill="#3b2216">
        <circle cx="-60" cy="-190" r="26" />
        <rect x="-86" y="-162" width="52" height="150" rx="22" />
        <circle cx="60" cy="-200" r="26" />
        <rect x="34" y="-172" width="52" height="160" rx="22" />
      </g>
      {censor > 0 ? (
        <g transform={`translate(${w * 0.42},${h * 0.8}) scale(${lerp(1.6, 1, censor)})`} opacity={clamp01(censor * 3)}>
          <rect x={-w * 0.3} y={-h * 0.09} width={w * 0.6} height={h * 0.18} fill="#000" />
          <text x="0" y={h * 0.035} textAnchor="middle" fontFamily={ANTON} fontSize={h * 0.11} fill="#fff" letterSpacing="6">
            CENSORED
          </text>
        </g>
      ) : null}
      {tint > 0 ? <rect width={w} height={h} fill={RED} opacity={0.35 * tint} /> : null}
    </g>
  );
};

/** Big red X drawn over (0,0), size s. */
const Cross: React.FC<{ p: number; s?: number }> = ({ p, s = 40 }) => {
  if (p <= 0) return null;
  const a = clamp01(p * 2);
  const b = clamp01(p * 2 - 1);
  return (
    <g stroke={RED} strokeWidth={s * 0.28} strokeLinecap="round">
      <line x1={-s} y1={-s} x2={lerp(-s, s, a)} y2={lerp(-s, s, a)} />
      {b > 0 ? <line x1={s} y1={-s} x2={lerp(s, -s, b)} y2={lerp(-s, s, b)} /> : null}
    </g>
  );
};

/* ------------------------------------------------------------------ scenes (820x780 photos) */

/** "One player took a photo there. In the game. With the game's own camera." */
const PhotoScene: React.FC<{ f: number }> = ({ f }) => {
  const shots = [c("photo"), c("camera.")];
  const flash = Math.max(...shots.map((s) => (f >= s && f < s + 7 ? 1 - (f - s) / 7 : 0)));
  const vf = 34;
  return (
    <g>
      <Beach w={IMG_W} h={IMG_H} f={f} censor={1} />
      {/* in-game camera viewfinder */}
      <g stroke="#fff" strokeWidth="7" fill="none" opacity=".95">
        <path d={`M${vf},${vf + 70} V${vf} H${vf + 70}`} />
        <path d={`M${IMG_W - vf - 70},${vf} H${IMG_W - vf} V${vf + 70}`} />
        <path d={`M${vf},${IMG_H - vf - 70} V${IMG_H - vf} H${vf + 70}`} />
        <path d={`M${IMG_W - vf - 70},${IMG_H - vf} H${IMG_W - vf} V${IMG_H - vf - 70}`} />
        <rect x={IMG_W / 2 - 60} y={IMG_H / 2 - 60} width="120" height="120" strokeWidth="4" opacity={0.6 + 0.4 * Math.sin(f / 3)} />
      </g>
      <g transform={`translate(${IMG_W - 120},110)`}>
        <rect x="-70" y="-34" width="140" height="60" rx="8" fill="rgba(0,0,0,.6)" />
        <text x="0" y="10" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="26" fill="#fff">
          📷 x1
        </text>
      </g>
      <rect width={IMG_W} height={IMG_H} fill="#fff" opacity={flash} />
      <Tag x={IMG_W / 2} y={70} at={c("In", 1)} text="IN THE GAME" color={SUN} size={34} />
      <Tag x={IMG_W / 2} y={IMG_H - 70} at={c("own")} text="GTA 6 PHOTO MODE" color="#fff" size={30} />
    </g>
  );
};

/** "He sent it to a single friend." */
const SendScene: React.FC<{ f: number }> = ({ f }) => {
  const sent = c("sent");
  const fr = c("friend.");
  const slide = ease(ramp(f, sent, 9));
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0b0d14" />
      {/* phone */}
      <g transform="translate(410,410)">
        <rect x="-230" y="-380" width="460" height="760" rx="50" fill="#111" stroke="#2c2f38" strokeWidth="8" />
        <rect x="-205" y="-340" width="410" height="690" rx="20" fill="#16192a" />
        <rect x="-205" y="-340" width="410" height="80" fill="#22263a" />
        <circle cx="-150" cy="-300" r="24" fill={PSBLUE} />
        <text x="-112" y="-290" fontFamily={MONO} fontWeight={700} fontSize="26" fill="#fff">
          MATE
        </text>
        <text x="-112" y="-262" fontFamily={MONO} fontSize="18" fill="#9aa3b5">
          PSN · online
        </text>
        {/* photo bubble */}
        <g transform={`translate(${lerp(260, 0, slide) + 40},${-60}) `} opacity={clamp01(slide * 2)}>
          <rect x="-150" y="-150" width="300" height="250" rx="18" fill={PSBLUE} />
          <svg x={-138} y={-138} width="276" height="226" viewBox={`0 0 ${IMG_W} ${IMG_H}`} preserveAspectRatio="xMidYMid slice">
            <Beach w={IMG_W} h={IMG_H} f={f} censor={1} />
          </svg>
          <text x="140" y="140" textAnchor="end" fontFamily={MONO} fontSize="20" fill="#cfe3ff">
            {f >= fr ? "Sent ✓✓" : f >= sent + 6 ? "Sending..." : ""}
          </text>
        </g>
        <g transform="translate(40,200)" opacity={clamp01((f - sent - 10) / 6)}>
          <rect x="-150" y="-36" width="300" height="64" rx="18" fill={PSBLUE} />
          <text x="0" y="6" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="24" fill="#fff">
            {typed(f, sent + 10, "look at this lol 😂", 1.2)}
          </text>
        </g>
      </g>
      <Tag x={410} y={60} at={fr} text="1 FRIEND" color={SUN} size={36} />
    </g>
  );
};

/** "But PlayStation flagged it as 'pornographic or obscene.'" */
const FlagScene: React.FC<{ f: number }> = ({ f }) => {
  const reason = c("pornographic");
  const alarm = f >= c("flagged") ? 0.5 + 0.5 * Math.sin(f / 2.2) : 0;
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#08090f" />
      <rect width={IMG_W} height={IMG_H} fill={RED} opacity={0.12 * alarm} />
      <Logo href={LOGO.psw} ar={AR.ps} x={410} y={130} h={170} at={c("PlayStation", 1)} />
      <g transform="translate(410,470)">
        <rect x="-340" y="-170" width="680" height="330" rx="16" fill="#f3f4f7" filter="url(#pb-shadow)" />
        <rect x="-340" y="-170" width="680" height="70" rx="16" fill={PSBLUE} />
        <text x="0" y="-124" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="28" fill="#fff" letterSpacing="2">
          PLAYSTATION SAFETY
        </text>
        <text x="-310" y="-50" fontFamily={MONO} fontWeight={700} fontSize="26" fill={INK}>
          {typed(f, c("flagged"), "Your message was reviewed.", 1.6)}
        </text>
        <text x="-310" y="0" fontFamily={MONO} fontSize="24" fill="#555">
          {typed(f, c("flagged") + 10, "Reason:", 1.6)}
        </text>
        {f >= reason ? (
          <g transform={`scale(${sp(f, FPS, reason, springs.slam)})`}>
            <rect x="-310" y="26" width="620" height="110" fill="#ffe4e6" stroke={RED} strokeWidth="5" />
            <text x="0" y="74" textAnchor="middle" fontFamily={ANTON} fontSize="44" fill={RED} letterSpacing="2">
              "PORNOGRAPHIC
            </text>
            <text x="0" y="122" textAnchor="middle" fontFamily={ANTON} fontSize="44" fill={RED} letterSpacing="2">
              OR OBSCENE CONTENT"
            </text>
          </g>
        ) : null}
      </g>
      <Stamp x={560} y={690} at={c("flagged")} text="FLAGGED" size={86} r={-8} />
    </g>
  );
};

/** "He says he got thirty days. No messages. No parties. Not even Call of Duty online." */
const DaysScene: React.FC<{ f: number }> = ({ f }) => {
  const t0 = c("thirty");
  const n = Math.max(1, Math.round(ease(ramp(f, t0 - 6, c("days.") - t0 + 8)) * 30));
  const rows: [string, number][] = [
    ["MESSAGES", c("messages.")],
    ["PARTIES", c("parties.")],
    ["CALL OF DUTY ONLINE", c("online.") - 4],
  ];
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0c0d14" />
      {/* calendar */}
      <g transform="translate(410,210) rotate(-2)">
        <rect x="-230" y="-150" width="460" height="300" fill={PAPER} filter="url(#pb-shadow)" />
        <rect x="-230" y="-150" width="460" height="70" fill={RED} />
        <text x="0" y="-100" textAnchor="middle" fontFamily={ANTON} fontSize="44" fill="#fff" letterSpacing="4">
          SUSPENDED
        </text>
        <text x="-20" y="110" textAnchor="middle" fontFamily={ANTON} fontSize="180" fill={INK}>
          {f >= t0 - 6 ? n : ""}
        </text>
        <text x="150" y="100" textAnchor="middle" fontFamily={ANTON} fontSize="60" fill={INK}>
          {f >= t0 - 6 ? "DAYS" : ""}
        </text>
      </g>
      {rows.map(([label, at], i) => {
        const s = f < at - 6 ? 0 : sp(f, FPS, at - 6, springs.snappy);
        if (s <= 0) return null;
        return (
          <g key={label} transform={`translate(410,${440 + i * 108}) scale(${s})`}>
            <rect x="-340" y="-44" width="680" height="88" rx="12" fill="#1a1d28" stroke="#30364a" strokeWidth="3" />
            <text x="-300" y="18" fontFamily={ANTON} fontSize="50" fill="#fff" letterSpacing="2">
              {label}
            </text>
            <g transform="translate(280,0)">
              <Cross p={ramp(f, at, 8)} s={30} />
            </g>
          </g>
        );
      })}
      <Tag x={410} y={36} at={c("says")} text="HE SAYS" color={SUN} size={30} />
    </g>
  );
};

/** "But Xbox players say it's even worse... Their beach clips uploaded automatically... and they say they got banned for two days." */
const XboxScene: React.FC<{ f: number }> = ({ f }) => {
  const up = c("uploaded");
  const p = ease(ramp(f, up, c("and", 1) - up));
  const ban = c("banned");
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#07100a" />
      <Logo href={LOGO.xbw} ar={AR.xb} x={130} y={120} h={150} at={c("Xbox")} />
      <Tag x={520} y={110} at={c("players")} text="PLAYERS SAY" color={SUN} size={32} />
      {/* the clip */}
      <g transform="translate(410,380)">
        <rect x="-300" y="-160" width="600" height="340" rx="10" fill="#000" stroke={XBOX} strokeWidth="6" />
        <svg x={-292} y={-152} width="584" height="324" viewBox={`0 0 ${IMG_W} ${IMG_H * 0.72}`} preserveAspectRatio="xMidYMid slice">
          <Beach w={IMG_W} h={IMG_H * 0.72} f={f} censor={0} tint={ramp(f, ban, 6)} />
        </svg>
        <text x="-280" y="-120" fontFamily={MONO} fontWeight={700} fontSize="22" fill="#fff">
          ● CLIP · BEACH · 0:30
        </text>
        {f >= c("didn't") ? (
          <g transform={`translate(160,-110) rotate(6) scale(${sp(f, FPS, c("didn't"), springs.snappy)})`}>
            <rect x="-130" y="-30" width="260" height="56" fill={PAPER} />
            <text x="0" y="10" textAnchor="middle" fontFamily={ANTON} fontSize="34" fill={INK}>
              SENT TO NOBODY
            </text>
          </g>
        ) : null}
      </g>
      {/* auto-upload bar */}
      {f >= up - 4 ? (
        <g transform="translate(410,610)">
          <text x="-300" y="-20" fontFamily={MONO} fontWeight={700} fontSize="24" fill={GREEN}>
            ☁ AUTO-UPLOAD {Math.round(p * 100)}%
          </text>
          <rect x="-300" y="0" width="600" height="30" fill="#16241a" />
          <rect x="-300" y="0" width={600 * p} height="30" fill={p >= 1 ? RED : GREEN} />
        </g>
      ) : null}
      <Stamp x={430} y={390} at={ban} text="BANNED · 2 DAYS" size={78} r={-8} />
    </g>
  );
};

/** "So if you play GTA 6... turn off auto-upload. And send this to your mate before he gets banned." */
const FixScene: React.FC<{ f: number }> = ({ f }) => {
  const off = ramp(f, c("off"), 6);
  const mate = c("mate");
  return (
    <g>
      <rect width={IMG_W} height={IMG_H} fill="#0b0c12" />
      <Logo href={LOGO.gta} ar={AR.gta} x={200} y={120} h={150} at={c("GTA", 1)} />
      <g transform="translate(410,330)">
        <rect x="-340" y="-90" width="680" height="190" rx="14" fill="#1b1e2a" stroke="#30364a" strokeWidth="3" />
        <text x="-310" y="-40" fontFamily={MONO} fontSize="22" fill="#9aa3b5">
          SETTINGS › CAPTURES
        </text>
        <text x="-310" y="30" fontFamily={ANTON} fontSize="46" fill="#fff" letterSpacing="1">
          AUTO-UPLOAD
        </text>
        {/* toggle */}
        <g transform="translate(220,14)">
          <rect x="-80" y="-40" width="160" height="80" rx="40" fill={off > 0.5 ? "#4a4f60" : GREEN} />
          <circle cx={lerp(40, -40, ease(off))} cy="0" r="32" fill="#fff" />
          <text x="0" y="78" textAnchor="middle" fontFamily={ANTON} fontSize="30" fill={off > 0.5 ? RED : GREEN}>
            {off > 0.5 ? "OFF" : "ON"}
          </text>
        </g>
      </g>
      {f >= mate - 4 ? (
        <g transform={`translate(410,610) rotate(-3) scale(${sp(f, FPS, mate - 4, springs.slam)})`}>
          <rect x="-330" y="-70" width="660" height="140" fill={SUN} />
          <text x="0" y="28" textAnchor="middle" fontFamily={ANTON} fontSize="64" fill={INK} letterSpacing="2">
            SEND THIS TO YOUR MATE
          </text>
        </g>
      ) : null}
      <Stamp x={590} y={125} at={c("turn")} text="DO THIS NOW" size={60} r={6} color={GREEN} />
    </g>
  );
};

type Key = "photo" | "send" | "flag" | "days" | "xbox" | "fix";
const POL: Record<Key, P> = {
  photo: { x: 700, y: 950, r: -2, label: "EXHIBIT A · THE PHOTO" },
  send: { x: 1850, y: 1630, r: 3, label: "SENT TO 1 FRIEND" },
  flag: { x: 700, y: 2310, r: -3, label: "20 NOV · FLAGGED" },
  days: { x: 1850, y: 2990, r: 2, label: "THE PUNISHMENT" },
  xbox: { x: 700, y: 3670, r: -2, label: "MEANWHILE · XBOX" },
  fix: { x: 1850, y: 4350, r: 3, label: "HOW NOT TO GET BANNED" },
};
const ORDER: Key[] = ["photo", "send", "flag", "days", "xbox", "fix"];
const SCENES: Record<Key, React.FC<{ f: number }>> = {
  photo: PhotoScene,
  send: SendScene,
  flag: FlagScene,
  days: DaysScene,
  xbox: XboxScene,
  fix: FixScene,
};
const pinOf = (p: P) => ({ x: p.x, y: p.y - PH / 2 + 14 });

/* ------------------------------------------------------------------ camera */

type K = { at: number; x: number; y: number; z: number };
const MOVE = 16;
const Z = 0.85;
const camKeys = (): K[] => {
  const v = (p: P, dy = 230) => ({ x: p.x + 70, y: p.y + dy });
  return [
    { at: 0, ...v(POL.photo), z: Z },
    { at: c("He") - 6, ...v(POL.send), z: Z },
    { at: c("But") - 5, ...v(POL.flag), z: Z },
    { at: c("He", 1) - 6, ...v(POL.days), z: Z },
    { at: c("But", 1) - 5, ...v(POL.xbox), z: Z },
    { at: c("So") - 5, ...v(POL.fix), z: Z },
    { at: c("Fair") - 4, x: 1300, y: 2700, z: 0.26 },
  ];
};

const useCamera = () => {
  const f = useCurrentFrame();
  const keys = React.useMemo(camKeys, []);
  let i = 0;
  for (let k = 0; k < keys.length; k++) if (f >= keys[k].at) i = k;
  const cur = keys[i];
  const prev = i > 0 ? keys[i - 1] : cur;
  const t = i > 0 ? clamp01((f - cur.at) / MOVE) : 1;
  const e = ease(t);
  const next = keys[i + 1]?.at ?? PHOTO_BAN_FRAMES;
  const hold = clamp01((f - cur.at - MOVE) / Math.max(1, next - cur.at - MOVE));
  const dip = i > 0 ? 1 - 0.2 * Math.sin(Math.PI * t) : 1;
  return { x: lerp(prev.x, cur.x, e), y: lerp(prev.y, cur.y, e), z: lerp(prev.z, cur.z, e) * dip * (1 + 0.06 * hold), rot: Math.sin(f / 70) * 0.4 };
};

/* ------------------------------------------------------------------ glitch wrapper */

/* ------------------------------------------------------------------ glitch wrapper */

const Glitch: React.FC<{ f: number; g: number; id: string; children: React.ReactNode }> = ({ f, g, id, children }) => {
  if (g <= 0.02) return <>{children}</>;
  const rnd = (n: number) => rndAt(n, f);
  return (
    <g>
      <defs>
        <filter id={`${id}-r`}>
          <feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
        </filter>
        <filter id={`${id}-c`}>
          <feColorMatrix values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </defs>
      {children}
      <g filter={`url(#${id}-r)`} transform={`translate(${-46 * g},0)`} style={{ mixBlendMode: "screen" }} opacity=".9">
        {children}
      </g>
      <g filter={`url(#${id}-c)`} transform={`translate(${46 * g},0)`} style={{ mixBlendMode: "screen" }} opacity=".9">
        {children}
      </g>
      {Array.from({ length: 8 }, (_, i) => {
        const y = rnd(i + 10) * SHORT_H;
        const h = 20 + rnd(i + 30) * 150;
        const dx = (rnd(i + 50) - 0.5) * 420 * g;
        return (
          <g key={i} clipPath={`inset(${y}px 0 ${Math.max(0, SHORT_H - y - h)}px 0)`} transform={`translate(${dx},0)`}>
            {children}
          </g>
        );
      })}
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={`b${i}`} x="0" y={rnd(i + 80) * SHORT_H} width={SHORT_W} height={6 + rnd(i + 90) * 26} fill={[PINK, TEAL, "#fff", GREEN, RED][i]} opacity={0.75 * g} />
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ full-screen hook (0 .. "One player") */

const Hook: React.FC<{ f: number }> = ({ f }) => {
  const outAt = c("One") - 3;
  if (f > outAt + 10) return null;
  const out = ease(ramp(f, outAt, 9));
  const logo = usePop(0, springs.slam);
  const nud = c("nudist");
  const psAt = c("PlayStation");
  const banAt = c("banning");
  const burst = (at: number, len: number) => (f >= at && f < at + len ? 1 - (f - at) / len : 0);
  const g = Math.max(burst(0, 18), burst(nud, 6) * 0.5, burst(psAt - 2, 10) * 0.8, burst(banAt - 2, 18));
  const flash = Math.max(0, 0.6 - f / 6) + burst(banAt, 6) * 0.9 + burst(psAt, 3) * 0.4;
  const shake = g * 38;
  const sx = (rndAt(1, f) - 0.5) * shake;
  const sy = (rndAt(2, f) - 0.5) * shake;
  const banned = ramp(f, banAt, 6);
  const censor = f < nud + 6 ? 0 : sp(f, FPS, nud + 6, springs.slam);
  const ps = f < psAt ? 0 : sp(f, FPS, psAt, springs.slam);
  const blink = Math.floor(f / 6) % 2 ? 1 : 0.45;
  const scene = (
    <g>
      <rect width={SHORT_W} height={SHORT_H} fill="#07070c" />
      <rect width={SHORT_W} height={SHORT_H} fill={RED} opacity={0.18 * banned + 0.07 * banned * Math.sin(f / 2)} />
      {Array.from({ length: 24 }, (_, i) => (
        <rect key={`sl${i}`} x="0" y={(i * 80 + f * 6) % SHORT_H} width={SHORT_W} height="2" fill={banned > 0 ? RED : "#2a2f45"} opacity=".35" />
      ))}
      {/* frame-0 shock: account suspended banner */}
      <g transform="translate(490,250)">
        <rect x="-430" y="-48" width="860" height="92" fill={RED} />
        <text x="0" y="22" textAnchor="middle" fontFamily={ANTON} fontSize="62" fill="#fff" letterSpacing="5" opacity={blink}>
          ⚠ ACCOUNT SUSPENDED
        </text>
      </g>
      {/* GTA VI logo slams on frame 0 */}
      <g transform={`translate(490,470) scale(${lerp(2.6, 1, logo)}) rotate(${-3 + (banned > 0 ? (rndAt(5, f) - 0.5) * 4 : 0)})`}>
        <image href={LOGO.gta} x={-200} y={-200 / AR.gta} width={400} height={400 / AR.gta} filter="url(#pb-shadow)" />
      </g>
      {/* the in-game photo */}
      <g transform="translate(490,1000) rotate(-2)">
        <rect x="-400" y="-300" width="800" height="600" fill="#F1ECE2" filter="url(#pb-shadow)" />
        <svg x={-370} y={-270} width="740" height="500" viewBox={`0 0 ${IMG_W} ${IMG_H}`} preserveAspectRatio="xMidYMid slice">
          <Beach w={IMG_W} h={IMG_H} f={f} censor={censor} tint={banned} />
        </svg>
        <text x="0" y="276" textAnchor="middle" fontFamily={MONO} fontWeight={700} fontSize="30" fill="#2a2a2a" letterSpacing="3">
          GTA 6 · IN-GAME PHOTO
        </text>
      </g>
      {ps > 0 ? (
        <g transform={`translate(770,730) rotate(8) scale(${lerp(2.4, 1, ps)})`}>
          <circle r="110" fill={PSBLUE} stroke="#fff" strokeWidth="8" />
          <image href={LOGO.psw} x={-75} y={-75} width={150} height={150} />
        </g>
      ) : null}
      {f >= nud ? (
        <g transform={`translate(330,1400) rotate(-3) scale(${sp(f, FPS, nud, springs.slam)})`}>
          <rect x="-270" y="-66" width="540" height="122" fill={SUN} />
          <text x="0" y="34" textAnchor="middle" fontFamily={ANTON} fontSize="94" fill={INK} letterSpacing="4">
            NUDIST BEACH
          </text>
        </g>
      ) : null}
      {f >= banAt ? (
        <g transform="translate(490,1000)">
          <Stamp x={0} y={0} at={banAt} text="BANNED" size={170} r={-9} />
        </g>
      ) : null}
    </g>
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${lerp(1, 0.42, out)}) rotate(${-6 * out}deg)` }}>
      <svg width={SHORT_W} height={SHORT_H} viewBox={`0 0 ${SHORT_W} ${SHORT_H}`} style={{ position: "absolute", inset: 0 }}>
        <SvgDefs />
        <g transform={`translate(${sx},${sy})`}>
          <Glitch f={f} g={g} id="pb-hk">
            {scene}
          </Glitch>
        </g>
      </svg>
      <AbsoluteFill style={{ background: "#fff", opacity: Math.min(1, flash) }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ "even worse" punch */

const WorsePunch: React.FC<{ f: number }> = ({ f }) => {
  const at = c("But", 1);
  const end = c("They") - 1;
  if (f < at - 2 || f > end + 6) return null;
  const inn = ease(ramp(f, at - 2, 5));
  const out = ease(ramp(f, end - 3, 4));
  const g = f < at + 6 ? 1 - (f - at + 2) / 8 : 0;
  const s = sp(f, FPS, at, springs.slam);
  const xb = f < c("Xbox") ? 0 : sp(f, FPS, c("Xbox"), springs.slam);
  const scene = (
    <g>
      <rect width={SHORT_W} height={SHORT_H} fill="#050509" opacity={0.9} />
      {xb > 0 ? (
        <g transform={`translate(490,560) scale(${lerp(2.2, 1, xb)})`}>
          <circle r="140" fill={XBOX} stroke="#fff" strokeWidth="8" />
          <image href={LOGO.xbw} x={-100} y={-100} width={200} height={200} />
        </g>
      ) : null}
      <g transform={`translate(490,900) rotate(-4) scale(${lerp(2.2, 1, s)})`}>
        <rect x="-380" y="-110" width="760" height="220" fill={SUN} />
        <text x="0" y="-10" textAnchor="middle" fontFamily={ANTON} fontSize="96" fill={INK} letterSpacing="4">
          XBOX IS
        </text>
        <text x="0" y="86" textAnchor="middle" fontFamily={ANTON} fontSize="96" fill={RED} letterSpacing="4">
          EVEN WORSE
        </text>
      </g>
    </g>
  );
  return (
    <AbsoluteFill style={{ opacity: inn * (1 - out) }}>
      <svg width={SHORT_W} height={SHORT_H} viewBox={`0 0 ${SHORT_W} ${SHORT_H}`} style={{ position: "absolute", inset: 0 }}>
        <Glitch f={f} g={g} id="pb-wp">
          {scene}
        </Glitch>
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ the board */

const Board: React.FC<{ f: number }> = ({ f }) => {
  const keys = camKeys();
  return (
    <svg width={BW} height={BH} viewBox={`0 0 ${BW} ${BH}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <SvgDefs />
      <rect x="-1200" y="-1200" width={BW + 2400} height={BH + 2400} fill="#1a120c" />
      <rect x="-1200" y="-1200" width={BW + 2400} height={BH + 2400} fill="#fff" filter="url(#pb-cork)" />
      {Array.from({ length: 30 }, (_, i) => {
        const x = (i * 613) % BW;
        const y = (i * 1031) % BH;
        return (
          <g key={i} transform={`translate(${x},${y}) rotate(${((i * 37) % 30) - 15})`} opacity=".55">
            <rect x="-110" y="-70" width="220" height="140" fill="#d8cfbb" />
            {[0, 1, 2].map((k) => (
              <rect key={k} x="-90" y={-44 + k * 30} width={160 - k * 30} height="12" fill="#8a8170" />
            ))}
          </g>
        );
      })}
      <RedString pts={ORDER.map((k) => pinOf(POL[k]))} at={keys.slice(1, 6).map((k) => k.at)} />

      {/* title card with the GTA VI logo */}
      <g transform={`translate(${POL.photo.x},${POL.photo.y - PH / 2 - 200}) rotate(-3)`}>
        <rect x="-360" y="-150" width="720" height="290" fill="#000" opacity=".45" transform="translate(10,14)" />
        <rect x="-360" y="-150" width="720" height="290" fill={PAPER} />
        <image href={LOGO.gta} x="-340" y="-130" width={250 * AR.gta} height={250} />
        <text x="140" y="-30" textAnchor="middle" fontFamily={ANTON} fontSize="70" fill={INK} letterSpacing="3">
          1 PHOTO
        </text>
        <text x="140" y="60" textAnchor="middle" fontFamily={ANTON} fontSize="70" fill={RED} letterSpacing="3">
          = BANNED
        </text>
        <Pin x={320} y={-140} />
      </g>

      {ORDER.map((k, i) => {
        const S = SCENES[k];
        return (
          <Polaroid key={k} p={POL[k]} at={i === 0 ? -100 : keys[i].at - 6}>
            <S f={f} />
          </Polaroid>
        );
      })}

      {/* side evidence: real logos pinned on the board */}
      <g transform={`translate(${POL.flag.x + 560},${POL.flag.y - 380}) rotate(6)`}>
        <rect x="-150" y="-150" width="300" height="300" fill={PAPER} />
        <image href={LOGO.psb} x="-110" y="-110" width="220" height="220" />
        <Pin x={0} y={-140} />
      </g>
      <g transform={`translate(${POL.xbox.x + 560},${POL.xbox.y - 380}) rotate(-6)`}>
        <rect x="-150" y="-150" width="300" height="300" fill={PAPER} />
        <image href={LOGO.xbg} x="-110" y="-110" width="220" height="220" />
        <Pin x={0} y={-140} />
      </g>
      <Note x={POL.days.x - 330} y={POL.days.y + 470} r={-6} w={380} h={130} at={c("thirty")} color="#f2c230">
        <text x="0" y="24" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill={INK}>
          30 DAYS
        </text>
      </Note>
      <Note x={POL.xbox.x + 300} y={POL.xbox.y + 480} r={6} w={380} h={130} at={c("two")} color="#f2c230">
        <text x="0" y="24" textAnchor="middle" fontFamily={ANTON} fontSize="66" fill={INK}>
          2 DAYS
        </text>
      </Note>
    </svg>
  );
};

/* ------------------------------------------------------------------ main */

const EndCard: React.FC = () => {
  const s = usePop(c("Fair") - 2);
  const s2 = usePop(c("ridiculous?") - 2);
  const s3 = usePop(c("ridiculous?") + 16);
  if (s <= 0) return null;
  const box: React.CSSProperties = { padding: "18px 40px", boxShadow: "10px 14px 0 rgba(0,0,0,0.5)", fontFamily: ANTON, whiteSpace: "nowrap", letterSpacing: 3 };
  return (
    <div style={{ position: "absolute", left: 60, width: 840, top: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 40, transform: `scale(${lerp(1.5, 1, s)})`, opacity: clamp01(s * 3) }}>
        <img src={LOGO.psw} style={{ width: 120, filter: "drop-shadow(5px 8px 0 rgba(0,0,0,.5))" }} />
        <img src={LOGO.gta} style={{ width: 300, filter: "drop-shadow(6px 10px 0 rgba(0,0,0,.5))" }} />
        <img src={LOGO.xbw} style={{ width: 110, filter: "drop-shadow(5px 8px 0 rgba(0,0,0,.5))" }} />
      </div>
      <div style={{ ...box, transform: `scale(${lerp(1.6, 1, s)}) rotate(-3deg)`, opacity: clamp01(s * 3), background: PAPER, color: INK, fontSize: 100 }}>
        FAIR BAN
      </div>
      {s2 > 0 ? (
        <div style={{ ...box, transform: `scale(${lerp(1.6, 1, s2)}) rotate(2deg)`, opacity: clamp01(s2 * 3), background: RED, color: "#fff", fontSize: 100 }}>
          OR RIDICULOUS?
        </div>
      ) : null}
      {s3 > 0 ? (
        <div style={{ transform: `scale(${s3}) rotate(-2deg)`, background: SUN, padding: "12px 30px", fontFamily: ANTON, fontSize: 56, color: INK, letterSpacing: 2 }}>COMMENT FAIR OR RIDICULOUS ↓</div>
      ) : null}
    </div>
  );
};

export const GTA6PhotoBan: React.FC<z.infer<typeof photoBanSchema>> = ({ showCaptions }) => {
  const f = useCurrentFrame();
  const cam = useCamera();
  const keys = camKeys();
  const dark = ease(ramp(f, c("Fair") - 4, 10));
  return (
    <AbsoluteFill style={{ background: "#120c08", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: BW,
          height: BH,
          transformOrigin: "0 0",
          transform: `translate(540px,900px) rotate(${cam.rot}deg) scale(${cam.z}) translate(${-cam.x}px,${-cam.y}px)`,
        }}
      >
        <Board f={f} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 42%, rgba(255,179,92,0.12) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: 0.6 * dark }} />
      <Grain f={f} />
      <WorsePunch f={f} />
      <Hook f={f} />
      <EndCard />
      <ShortCaptions
        words={WORDS}
        enabled={showCaptions}
        hide={[
          [0, c("One") - 2],
          [c("But", 1) - 2, c("They") + 1],
          [c("Fair") - 2, PHOTO_BAN_FRAMES],
        ]}
        centerY={1250}
        fontSize={60}
        maxWords={4}
        maxChars={22}
        left={170}
        right={170}
        hot={["gta", "6", "playstation", "xbox", "banned", "banning", "photo", "camera", "friend", "pornographic", "obscene", "thirty", "days", "call", "duty", "automatically", "two", "but", "off", "autoupload", "mate", "nudist"]}
      />
      <Audio src={staticFile("shorts/photoban/vo.mp3")} />
      <Loop durationInFrames={Math.round(62 * FPS)}>
        <Audio src={staticFile("shorts/cyberleak/bed.mp3")} volume={0.16} />
      </Loop>
      {/* hook */}
      <Sfx name="slam" at={0} volume={1} />
      <Sfx name="glitch" at={0} volume={0.95} />
      <Sfx name="error" at={1} volume={0.7} />
      <Sfx name="pop" at={c("nudist")} volume={0.7} />
      <Sfx name="stamp" at={c("nudist") + 6} volume={0.7} />
      <Sfx name="glitch" at={c("PlayStation") - 2} volume={0.7} />
      <Sfx name="slam" at={c("PlayStation")} volume={0.85} />
      <Sfx name="glitch" at={c("banning") - 2} volume={0.95} />
      <Sfx name="crash" at={c("banning")} volume={0.8} />
      <Sfx name="stamp" at={c("banning")} volume={1} />
      <Sfx name="whoosh" at={c("One") - 4} volume={0.8} />
      {keys.slice(1, 6).map((k, i) => (
        <Sfx key={i} name="whoosh" at={k.at - 2} volume={0.7} />
      ))}
      {/* photo */}
      <Sfx name="snap" at={c("photo")} volume={0.9} />
      <Sfx name="pop" at={c("In", 1)} volume={0.5} />
      <Sfx name="snap" at={c("camera.")} volume={0.9} />
      {/* send */}
      <Sfx name="whoosh" at={c("sent")} volume={0.5} />
      <Sfx name="type" at={c("sent") + 10} durationInFrames={14} volume={0.35} />
      <Sfx name="notify" at={c("friend.")} volume={0.7} />
      {/* flag */}
      <Sfx name="rumble" at={c("But")} volume={0.6} />
      <Sfx name="slam" at={c("PlayStation", 1)} volume={0.8} />
      <Sfx name="stamp" at={c("flagged")} volume={1} />
      <Sfx name="type" at={c("flagged")} durationInFrames={20} volume={0.35} />
      <Sfx name="error" at={c("pornographic")} volume={0.8} />
      {/* days */}
      <Sfx name="pop" at={c("says")} volume={0.5} />
      <Sfx name="tick" at={c("thirty") - 6} durationInFrames={c("days.") - c("thirty") + 8} volume={0.4} />
      <Sfx name="slam" at={c("days.")} volume={0.7} />
      <Sfx name="error" at={c("messages.")} volume={0.5} />
      <Sfx name="error" at={c("parties.")} volume={0.5} />
      <Sfx name="stamp" at={c("online.") - 4} volume={0.9} />
      {/* xbox punch */}
      <Sfx name="glitch" at={c("But", 1) - 2} volume={0.9} />
      <Sfx name="slam" at={c("But", 1)} volume={0.9} />
      <Sfx name="slam" at={c("Xbox")} volume={0.8} />
      <Sfx name="rumble" at={c("worse")} volume={0.6} />
      <Sfx name="pop" at={c("didn't")} volume={0.6} />
      <Sfx name="riser" at={c("uploaded")} volume={0.4} />
      <Sfx name="tick" at={c("uploaded")} durationInFrames={c("and", 1) - c("uploaded")} volume={0.3} />
      <Sfx name="stamp" at={c("banned")} volume={1} />
      <Sfx name="error" at={c("banned") + 2} volume={0.6} />
      {/* fix */}
      <Sfx name="pop" at={c("GTA", 1)} volume={0.5} />
      <Sfx name="stamp" at={c("turn")} volume={0.8} />
      <Sfx name="click" at={c("off")} volume={0.9} />
      <Sfx name="slam" at={c("mate") - 4} volume={0.8} />
      {/* end card */}
      <Sfx name="whoosh" at={c("Fair") - 4} volume={0.8} />
      <Sfx name="slam" at={c("Fair") - 2} volume={0.8} />
      <Sfx name="slam" at={c("ridiculous?") - 2} volume={0.8} />
      <Sfx name="pop" at={c("ridiculous?") + 16} volume={0.5} />
    </AbsoluteFill>
  );
};
