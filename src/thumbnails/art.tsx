import React from "react";
import { Img, staticFile } from "remotion";

/**
 * Character + object art for the Onion Archive thumbnail system.
 * Every piece is drawn around (0,0) so the layout can place it anywhere.
 * Characters: face centre at (0,0), bust reaches ~y=+330.
 * Objects: centred on (0,0), roughly 420 x 260.
 */

export type Emotion = "shock" | "smirk" | "fear";

const INK = "#101014";
const SKIN = "#E7B48F";
const SKIN_SHADE = "#C98E6A";

/* ---------- faces ---------- */

const Brows: React.FC<{ e: Emotion }> = ({ e }) => {
  if (e === "smirk")
    return <path d="M-58,-58 L-14,-48 M14,-52 q22,-18 46,-4" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />;
  if (e === "fear")
    return <path d="M-56,-46 L-14,-66 M14,-66 L56,-46" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />;
  // shock: brows shoved up high
  return <path d="M-60,-66 q22,-22 46,-10 M14,-76 q24,-12 46,10" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />;
};

const Eyes: React.FC<{ e: Emotion }> = ({ e }) => {
  if (e === "smirk")
    return (
      <g>
        <path d="M-56,-18 q20,-14 40,0 q-20,10 -40,0Z" fill="#fff" stroke={INK} strokeWidth={4} />
        <path d="M16,-20 q22,-16 44,0 q-22,12 -44,0Z" fill="#fff" stroke={INK} strokeWidth={4} />
        <circle cx={-30} cy={-17} r={6} fill={INK} />
        <circle cx={44} cy={-19} r={6} fill={INK} />
      </g>
    );
  // shock / fear: huge white eyes, tiny pupils
  return (
    <g>
      <ellipse cx={-34} cy={-14} rx={24} ry={29} fill="#fff" stroke={INK} strokeWidth={4} />
      <ellipse cx={34} cy={-14} rx={24} ry={29} fill="#fff" stroke={INK} strokeWidth={4} />
      <circle cx={-32} cy={-10} r={7} fill={INK} />
      <circle cx={36} cy={-10} r={7} fill={INK} />
    </g>
  );
};

const Mouth: React.FC<{ e: Emotion }> = ({ e }) => {
  if (e === "smirk") return <path d="M-30,56 q30,8 52,-14" fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />;
  if (e === "fear")
    return (
      <g>
        <path d="M-36,62 q36,-30 72,0 q-36,10 -72,0Z" fill="#3a0f14" stroke={INK} strokeWidth={4} />
        <path d="M-28,58 h56" stroke="#fff" strokeWidth={6} />
      </g>
    );
  return (
    <g>
      <ellipse cx={0} cy={62} rx={22} ry={28} fill="#3a0f14" stroke={INK} strokeWidth={4} />
      <ellipse cx={0} cy={74} rx={12} ry={9} fill="#d0505d" />
    </g>
  );
};

const Face: React.FC<{ e: Emotion; skin?: string }> = ({ e, skin = SKIN }) => (
  <g>
    <ellipse cx={0} cy={0} rx={84} ry={102} fill={skin} stroke={INK} strokeWidth={5} />
    <path d="M-84,10 C-80,80 -40,104 0,104 C-30,90 -60,60 -70,10Z" fill={SKIN_SHADE} opacity={0.5} />
    <Brows e={e} />
    <Eyes e={e} />
    <path d="M-2,4 q-8,22 6,28" fill="none" stroke={INK} strokeWidth={4} opacity={0.55} />
    <Mouth e={e} />
    {e !== "smirk" && (
      <g fill="#7fd7ff" opacity={0.9}>
        <path d="M78,-50 q8,16 0,24 q-8,-8 0,-24Z" />
      </g>
    )}
  </g>
);

/* ---------- characters ---------- */

/** Teen in a hoodie, face lit from below by a screen. */
export const Hacker: React.FC<{ e: Emotion; accent: string }> = ({ e, accent }) => (
  <g>
    {/* body + hood */}
    <path d="M-250,340 C-240,190 -170,120 -90,105 L90,105 C170,120 240,190 250,340Z" fill="#26282F" stroke={INK} strokeWidth={6} />
    <path d="M-150,-60 C-150,-190 150,-190 150,-60 L150,90 C110,130 -110,130 -150,90Z" fill="#30333B" stroke={INK} strokeWidth={6} />
    <path d="M-60,110 L-48,240 M60,110 L48,240" stroke="#d8d8d8" strokeWidth={8} strokeLinecap="round" />
    <path d="M-150,-60 C-150,-190 150,-190 150,-60 L150,90 C110,130 -110,130 -150,90Z" fill="none" stroke="#454955" strokeWidth={10} opacity={0.6} />
    {/* messy fringe under hood */}
    <Face e={e} />
    <path d="M-86,-58 C-80,-110 80,-118 86,-56 L60,-78 L40,-60 L18,-84 L-6,-62 L-28,-86 L-50,-62 L-66,-80Z" fill="#2a1d16" stroke={INK} strokeWidth={4} />
  </g>
);

/** Anonymous teen for countdowns: face in shadow, glowing eyes. Never shows who #1 is. */
export const Anon: React.FC<{ accent: string }> = ({ accent }) => (
  <g>
    <path d="M-250,340 C-240,190 -170,120 -90,105 L90,105 C170,120 240,190 250,340Z" fill="#1E2026" stroke={INK} strokeWidth={6} />
    <path d="M-150,-60 C-150,-190 150,-190 150,-60 L150,90 C110,130 -110,130 -150,90Z" fill="#2A2D34" stroke={INK} strokeWidth={6} />
    <ellipse cx={0} cy={0} rx={92} ry={110} fill="#050507" />
    <ellipse cx={-34} cy={-8} rx={20} ry={9} fill={accent} />
    <ellipse cx={34} cy={-8} rx={20} ry={9} fill={accent} />
    <path d="M-60,110 L-48,240 M60,110 L48,240" stroke="#9a9a9a" strokeWidth={8} strokeLinecap="round" />
  </g>
);

/** Judge in a white wig. */
export const Judge: React.FC<{ e: Emotion }> = ({ e }) => {
  const wig = "#F1ECE1";
  const curls: React.ReactNode[] = [];
  for (const s of [-1, 1])
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 2; c++)
        curls.push(
          <circle key={`${s}${r}${c}`} cx={s * (100 + c * 30 + (r % 2) * 6)} cy={-35 + r * 44} r={24 - r * 1.5} fill={wig} stroke="#bdb5a3" strokeWidth={3} />,
        );
  const top = Array.from({ length: 7 }, (_, i) => (
    <circle key={i} cx={-80 + i * 27} cy={-88 - Math.sin((i / 6) * Math.PI) * 28} r={25} fill={wig} stroke="#bdb5a3" strokeWidth={3} />
  ));
  return (
    <g>
      <path d="M-250,340 C-230,170 -150,105 -70,95 L70,95 C150,105 230,170 250,340Z" fill="#121217" stroke={INK} strokeWidth={6} />
      <path d="M-70,95 L0,220 L70,95" fill="none" stroke="#b01e35" strokeWidth={18} />
      <rect x={-16} y={104} width={14} height={66} fill="#f6f6f6" />
      <rect x={2} y={104} width={14} height={66} fill="#f6f6f6" />
      {curls}
      <ellipse cx={0} cy={-72} rx={114} ry={64} fill={wig} stroke="#bdb5a3" strokeWidth={3} />
      {top}
      <Face e={e} />
      <path d="M-72,-80 C-40,-98 40,-98 72,-80 C60,-62 -60,-62 -72,-80Z" fill={wig} />
    </g>
  );
};

/** Cyberleak's real avatar (pixel-art leek). Rendered as an image, not SVG. */
export const LEEK_SRC = "thumbnails/cyberleak.png";

/* ---------- objects ---------- */

export const TvStick: React.FC<{ label?: string }> = ({ label = "TV STICK" }) => (
  <g transform="rotate(-14)">
    <rect x={-250} y={-34} width={70} height={68} rx={8} fill="#B7C0CC" stroke={INK} strokeWidth={6} />
    <rect x={-236} y={-18} width={18} height={14} fill="#5d6570" />
    <rect x={-236} y={4} width={18} height={14} fill="#5d6570" />
    <rect x={-190} y={-62} width={420} height={124} rx={26} fill="#24262C" stroke={INK} strokeWidth={6} />
    <rect x={-176} y={-50} width={392} height={30} rx={14} fill="#3a3d46" />
    <circle cx={182} cy={0} r={15} fill="#FF9F1C" />
    {label && (
      <text x={10} y={26} textAnchor="middle" fontFamily="JetBrains Mono" fontWeight={700} fontSize={36} fill="#9aa2ad" letterSpacing={6}>
        {label}
      </text>
    )}
  </g>
);

export const EvidenceBag: React.FC = () => (
  <g transform="rotate(6)">
    <rect x={-230} y={-150} width={460} height={300} rx={20} fill="#dfe8ee" opacity={0.35} stroke="#fff" strokeWidth={6} />
    <rect x={-230} y={-150} width={460} height={40} rx={12} fill="#c4161c" />
    <text x={0} y={-118} textAnchor="middle" fontFamily="Anton" fontSize={32} fill="#fff" letterSpacing={8}>
      EVIDENCE
    </text>
    <g transform="translate(10,30) scale(0.78)">
      <TvStick label="" />
    </g>
    <path d="M-200,-90 L200,130" stroke="#fff" strokeWidth={8} opacity={0.25} />
  </g>
);

export const Coin: React.FC<{ label?: string }> = ({ label = "$30M" }) => (
  <g>
    <ellipse cx={14} cy={18} rx={150} ry={150} fill="#9a6a00" stroke={INK} strokeWidth={6} />
    <circle cx={0} cy={0} r={150} fill="#FFC21A" stroke={INK} strokeWidth={6} />
    <circle cx={0} cy={0} r={120} fill="none" stroke="#C98E00" strokeWidth={8} />
    <text x={0} y={30} textAnchor="middle" fontFamily="Anton" fontSize={label.length > 4 ? 76 : 92} fill="#3a2500">
      {label}
    </text>
    <path d="M-90,-90 q30,-30 70,-36" stroke="#fff6c4" strokeWidth={14} strokeLinecap="round" fill="none" />
  </g>
);

/** Classified file for countdown covers: teases #1 without naming it. */
export const MysteryFile: React.FC<{ label?: string }> = ({ label = "#1" }) => (
  <g transform="rotate(-8)">
    <path d="M-200,-130 L-60,-130 L-30,-100 L200,-100 L200,140 L-200,140Z" fill="#C8A86A" stroke={INK} strokeWidth={6} />
    <rect x={-200} y={-80} width={400} height={220} fill="#D9BC7E" stroke={INK} strokeWidth={6} />
    <g transform="rotate(-12)">
      <rect x={-150} y={-30} width={300} height={70} fill="none" stroke="#C4161C" strokeWidth={8} />
      <text x={0} y={24} textAnchor="middle" fontFamily="Anton" fontSize={52} fill="#C4161C" letterSpacing={6}>
        CLASSIFIED
      </text>
    </g>
    <text x={120} y={120} textAnchor="middle" fontFamily="Anton" fontSize={90} fill={INK}>
      {label}
    </text>
  </g>
);

/** Retro handset + payphone keypad: social-engineering stories ("he just called and asked"). */
export const PhoneObj: React.FC<{ label?: string }> = ({ label = "" }) => (
  <g transform="rotate(-12)">
    <path d="M-190,-40 q-20,-90 60,-110 l60,-16 q24,-6 32,16 l22,70 q6,24 -16,32 l-48,16 q16,90 104,128 l16,-48 q8,-22 32,-16 l70,24 q22,8 16,32 l-16,56 q-24,80 -112,56 q-176,-56 -220,-240z" fill="#E6E6E6" stroke={INK} strokeWidth={8} />
    <path d="M-150,-110 q14,-20 40,-24" stroke="#ffffff" strokeWidth={12} strokeLinecap="round" fill="none" />
    {label && (
      <text x={40} y={190} textAnchor="middle" fontFamily="Anton" fontSize={64} fill="#FFD60A">
        {label}
      </text>
    )}
  </g>
);

export type CharacterId = "hacker" | "anon" | "judge" | "leek" | "none";
export type ObjectId = "tvstick" | "evidence" | "coin" | "mystery" | "phone" | "none";

export const Character: React.FC<{ id: CharacterId; e: Emotion; accent: string }> = ({ id, e, accent }) => {
  if (id === "hacker") return <Hacker e={e} accent={accent} />;
  if (id === "anon") return <Anon accent={accent} />;
  if (id === "judge") return <Judge e={e} />;
  return null;
};

export const ObjectArt: React.FC<{ id: ObjectId; label?: string }> = ({ id, label }) => {
  if (id === "tvstick") return <TvStick label={label} />;
  if (id === "evidence") return <EvidenceBag />;
  if (id === "coin") return <Coin label={label} />;
  if (id === "mystery") return <MysteryFile label={label} />;
  if (id === "phone") return <PhoneObj label={label} />;
  return null;
};

/** Pixel-art leek as an HTML image, positioned by the layout. */
export const LeekImg: React.FC<{ x: number; y: number; h: number }> = ({ x, y, h }) => (
  <Img
    src={staticFile(LEEK_SRC)}
    style={{
      position: "absolute",
      left: x - (h * 188) / 353 / 2,
      top: y,
      height: h,
      imageRendering: "pixelated",
      filter: "drop-shadow(0 0 0 #fff) drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff) drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff) drop-shadow(0 18px 24px rgba(0,0,0,.8))",
    }}
  />
);
