import React from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Background, BrandTag, Captions, Glitch, OnionLogo, Sfx, White } from "../components";
import { clipTimings } from "../video3/clipTimings";
import { useClip } from "../video3/words";
import { Box, FlipCard, HookStrip, P, ProgressBar, SAFE, SHORT, SlamTag, punch } from "./kit";

const CLIP = clipTimings.find((t) => t.n === 1)!;
export const SHORT_LAPSUS1_FRAMES = CLIP.endFrame - CLIP.startFrame;

const mono = (size: number, color: string = colors.text): React.CSSProperties => ({ fontFamily: fonts.mono, fontSize: size, color });
const display = (size: number, color: string = colors.text): React.CSSProperties => ({
  fontFamily: fonts.display,
  fontSize: size,
  lineHeight: 0.9,
  color,
  whiteSpace: "nowrap",
});

// ─── The streaming stick as a small 3D object ────────────────────────
const Stick3D: React.FC<{ size?: number; spin: number; tilt?: number }> = ({ size = 1, spin, tilt = -14 }) => (
  <div style={{ width: 0, height: 0, perspective: 1600 }}>
    <div style={{ transformStyle: "preserve-3d", transform: `scale(${size}) rotateZ(${tilt}deg) rotateX(14deg) rotateY(${spin}deg)` }}>
      <Box
        w={420}
        h={120}
        d={46}
        y={-60}
        top="#3A4652"
        front="linear-gradient(to bottom, #2C3640, #151B21)"
        side="#1B2229"
        frontChildren={
          <>
            <div style={{ position: "absolute", left: 30, top: 34, ...mono(40, "#97A2AD"), fontWeight: 700, letterSpacing: "0.1em" }}>TV STICK</div>
            <div style={{ position: "absolute", right: 32, top: 40, width: 40, height: 40, borderRadius: 20, background: colors.amber, boxShadow: `0 0 40px ${colors.amber}` }} />
          </>
        }
      />
      {/* the plug */}
      <Box w={70} h={60} d={30} x={-245} y={-30} top="#B4BEC8" front="#9AA4AE" side="#7C8690" />
      {/* back face so it reads while spinning */}
      <P w={420} h={120} z={-23} style={{ background: "linear-gradient(to bottom, #232B33, #10151A)" }} />
    </div>
  </div>
);

// ─── Scene 0: the hook ───────────────────────────────────────────────
const Hook: React.FC<{ to: number }> = ({ to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame >= to + 6) return null;
  const out = sp(frame, fps, to - 4, springs.snappy);
  const zoom = 1 + 0.14 * Math.exp(-frame / 5) + punch(frame, [27, 50], 0.05);
  const l3 = sp(frame, fps, 8, springs.slam);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, transform: `scale(${zoom + out * 0.5})`, transformOrigin: "540px 760px" }}>
      <Sfx name="slam" at={0} />
      <Sfx name="stamp" at={8} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 58%, rgba(255,59,59,0.42), rgba(0,0,0,0) 60%)" }} />
      <div style={{ position: "absolute", left: SAFE.left, top: 250, ...display(250) , textShadow: "0 10px 0 rgba(0,0,0,0.7)" }}>HE HACKED</div>
      <div style={{ position: "absolute", left: SAFE.left - 6, top: 470, ...display(430, colors.amber), textShadow: `0 12px 0 rgba(0,0,0,0.7), 0 0 80px ${colors.amber}66` }}>GTA 6</div>
      <div
        style={{
          position: "absolute",
          left: SAFE.left,
          top: 860,
          ...display(150, colors.red),
          textShadow: "0 8px 0 rgba(0,0,0,0.7), 0 0 50px rgba(255,59,59,0.6)",
          transform: `scale(${2.2 - 1.2 * l3})`,
          transformOrigin: "left center",
          opacity: frame >= 8 ? 1 : 0,
        }}
      >
        WITH A TV STICK
      </div>
      <div style={{ position: "absolute", left: 520, top: 1180 }}>
        <Stick3D size={1.55} spin={-28 + frame * 2.2} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 1: push in on the hotel ───────────────────────────────────
const HotelExterior: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from - 4 || frame >= to) return null;
  const t = interpolate(frame, [from, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = 1 + Math.pow(t, 2.2) * 7.5;
  const inn = Math.min(1, (frame - (from - 4)) / 6);
  const WX = 600;
  const WY = 835;
  return (
    <AbsoluteFill style={{ opacity: inn }}>
      <Sfx name="whoosh" at={from} />
      <Sfx name="whoosh" at={to - 14} volume={0.8} />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, #0A1322 0%, #0B0F16 70%, #07090B 100%)" }} />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${scale})`, transformOrigin: `${WX}px ${WY}px` }}>
        {new Array(26).fill(0).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: random(`sx${i}`) * 1080, top: 200 + random(`sy${i}`) * 420, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: 0.25 + random(`so${i}`) * 0.5 }} />
        ))}
        <div style={{ position: "absolute", left: 210, top: 470, width: 660, height: 900, background: "linear-gradient(to bottom, #161E28, #0E141B)", border: "4px solid #232D38" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", ...display(96, colors.amber), letterSpacing: "0.3em", textShadow: `0 0 40px ${colors.amber}` }}>HOTEL</div>
          {new Array(20).fill(0).map((_, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const lit = i === 10;
            const on = lit || random(`w${i}`) > 0.72;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 60 + col * 145,
                  top: 180 + row * 140,
                  width: 100,
                  height: 100,
                  background: lit ? colors.green : on ? "#C9A256" : "#0A0F14",
                  opacity: lit ? 0.75 + 0.25 * Math.sin(frame / 3) : on ? 0.55 : 1,
                  boxShadow: lit ? `0 0 60px ${colors.green}` : on ? "0 0 26px rgba(201,162,86,0.5)" : "none",
                  border: "4px solid #1B242E",
                }}
              />
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1370, height: 600, background: "#06080A" }} />
      </div>
      <div style={{ position: "absolute", left: SAFE.left, top: 320, opacity: 1 - t * 1.4 }}>
        <span style={{ ...mono(44, colors.green), fontWeight: 700, letterSpacing: "0.12em" }}>SEPTEMBER 2022 · ENGLAND</span>
      </div>
    </AbsoluteFill>
  );
};

// ─── The hotel room as a 3D cutaway ──────────────────────────────────
const W = 760;
const H = 540;
const D = 640;

const Diorama: React.FC<{
  scale?: number;
  ry?: number;
  rx?: number;
  tvOn?: number;
  hop?: number;
  look?: { x: number; y: number };
  enter?: number;
  tvContent?: React.ReactNode;
}> = ({ scale = 1, ry = 24, rx = -16, tvOn = 0, hop = 0, look = { x: 0.4, y: 0 }, enter = 1, tvContent }) => {
  const frame = useCurrentFrame();
  const flick = tvOn * (0.88 + 0.12 * random(`dtv-${Math.floor(frame / 3)}`));
  // squash and stretch as White lands on the bed
  const sq = 1 + (1 - enter) * 0.5;
  return (
    <div style={{ position: "absolute", left: 500, top: 1085, width: 0, height: 0, perspective: 2100 }}>
      <div style={{ transformStyle: "preserve-3d", transform: `scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg)` }}>
        {/* floor */}
        <P w={W} h={D} rx={90} style={{ background: "linear-gradient(135deg, #1A222B, #0E1318)", boxShadow: "0 0 0 6px #232D38" }}>
          <div style={{ position: "absolute", left: 300, top: 250, width: 330, height: 250, borderRadius: 20, background: "rgba(57,255,136,0.07)", border: "3px solid rgba(57,255,136,0.18)" }} />
        </P>
        {/* back wall */}
        <P w={W} h={H} y={H / 2} z={-D / 2} style={{ background: "linear-gradient(to bottom, #17202A, #1D2732)", boxShadow: "inset 0 0 0 6px #232D38" }}>
          <div style={{ position: "absolute", left: 300, top: 60, width: 520, height: 400, background: `radial-gradient(ellipse at 50% 50%, ${colors.green}, rgba(0,0,0,0) 65%)`, opacity: 0.35 * flick }} />
        </P>
        {/* left wall with a window */}
        <P w={D} h={H} x={-W / 2} y={H / 2} ry={90} style={{ background: "linear-gradient(to bottom, #121A22, #18212B)", boxShadow: "inset 0 0 0 6px #232D38" }}>
          <div style={{ position: "absolute", left: 330, top: 110, width: 210, height: 230, background: "linear-gradient(to bottom, #0B1424, #152136)", border: "10px solid #28333F" }}>
            <div style={{ position: "absolute", left: 96, top: 0, width: 8, height: "100%", background: "#28333F" }} />
            <div style={{ position: "absolute", left: 40, top: 50, width: 5, height: 5, borderRadius: 3, background: "#fff", opacity: 0.7 }} />
            <div style={{ position: "absolute", left: 150, top: 120, width: 4, height: 4, borderRadius: 2, background: "#fff", opacity: 0.5 }} />
          </div>
        </P>
        {/* bed */}
        <Box w={320} h={70} d={430} x={-W / 2 + 175} z={-D / 2 + 232} top="linear-gradient(to bottom, #3B4858, #2A3441)" front="#1E2731" side="#1A222B" />
        <Box w={320} h={150} d={20} x={-W / 2 + 175} z={-D / 2 + 14} top="#2A3441" front="#222C37" side="#1A222B" />
        <Box w={230} h={26} d={90} x={-W / 2 + 175} y={70} z={-D / 2 + 80} top="#D5DCE4" front="#B9C2CC" side="#A7B0BA" />
        {/* bedside table, lamp, kettle */}
        <Box w={120} h={120} d={120} x={-W / 2 + 420} z={-D / 2 + 70} top="#27313C" front="#1C252E" side="#161D25" />
        <P w={70} h={70} x={-W / 2 + 400} y={120 + 78} z={-D / 2 + 60} style={{ background: "#E5A64B", borderRadius: "16px 16px 6px 6px", boxShadow: "0 0 70px rgba(229,166,75,0.8)" }} />
        <P w={10} h={46} x={-W / 2 + 400} y={120 + 23} z={-D / 2 + 60} style={{ background: "#3A4652" }} />
        <P w={46} h={56} x={-W / 2 + 452} y={120 + 28} z={-D / 2 + 96} style={{ background: "#4A5663", borderRadius: "10px 10px 12px 12px" }} />
        {/* wall TV */}
        <P w={330} h={196} x={W / 2 - 200} y={330} z={-D / 2 + 8} style={{ background: "#05070A", border: "8px solid #2B3642", borderRadius: 10, boxShadow: `0 0 ${70 * flick}px ${colors.green}88` }}>
          <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: tvOn > 0.05 ? "#0A1512" : "#050607", opacity: 1 }}>
            <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, tvOn * 1.3) }}>{tvContent}</div>
          </div>
        </P>
        {/* the stick in the side of the TV */}
        <P w={54} h={20} x={W / 2 - 200 + 190} y={300} z={-D / 2 + 12} style={{ background: "#2C3640", borderRadius: 5, border: "2px solid #4A5663" }}>
          <div style={{ position: "absolute", right: 6, top: 4, width: 8, height: 8, borderRadius: 4, background: colors.amber, boxShadow: `0 0 12px ${colors.amber}`, opacity: 0.5 + 0.5 * Math.sin(frame / 4) }} />
        </P>
        {/* White on the bed */}
        <P w={210} h={242} x={-W / 2 + 190} y={70 + 121 + hop} z={-D / 2 + 300}>
          <div style={{ transform: `scale(${1 / sq}, ${sq}) translateY(${(1 - enter) * -260}px)`, transformOrigin: "center bottom", opacity: enter > 0.02 ? 1 : 0 }}>
            <White size={242} look={look} lightColor={colors.green} lightAmount={0.35 * flick} />
          </div>
        </P>
      </div>
    </div>
  );
};

/** Tiny chat shown on the room's TV. */
const MiniChat: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, padding: 14, fontFamily: fonts.mono }}>
      <div style={{ fontSize: 17, color: colors.amber, fontWeight: 700 }}>#all-staff</div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ marginTop: 12, height: 12, width: 150 + i * 50, borderRadius: 4, background: "#2A3A36" }} />
      ))}
      <div style={{ marginTop: 16, fontSize: 16, color: colors.red, opacity: 0.6 + 0.4 * Math.sin(frame / 4) }}>new user is typing...</div>
    </div>
  );
};

// ─── Icons for the loadout ───────────────────────────────────────────
const IconStick = () => (
  <div style={{ width: 124, height: 40, borderRadius: 9, background: "#2C3640", border: "3px solid #55616D", position: "relative", transform: "rotate(-14deg)" }}>
    <div style={{ position: "absolute", left: -22, top: 7, width: 22, height: 20, background: "#9AA4AE", borderRadius: "4px 0 0 4px" }} />
    <div style={{ position: "absolute", right: 10, top: 10, width: 14, height: 14, borderRadius: 7, background: colors.amber, boxShadow: `0 0 16px ${colors.amber}` }} />
  </div>
);
const IconTv = () => (
  <div>
    <div style={{ width: 126, height: 78, borderRadius: 8, background: "#0A1512", border: `5px solid #55616D`, boxShadow: `0 0 26px ${colors.green}66` }}>
      <div style={{ margin: "14px 0 0 14px", width: 60, height: 8, borderRadius: 4, background: colors.green }} />
      <div style={{ margin: "10px 0 0 14px", width: 86, height: 8, borderRadius: 4, background: colors.greenDim }} />
    </div>
    <div style={{ width: 60, height: 8, margin: "6px auto 0", background: "#55616D", borderRadius: 4 }} />
  </div>
);
const IconPhone = () => (
  <div style={{ width: 62, height: 116, borderRadius: 14, background: "#0B0F13", border: "5px solid #55616D", position: "relative" }}>
    <div style={{ position: "absolute", left: 9, right: 9, top: 14, bottom: 22, borderRadius: 5, background: "linear-gradient(to bottom, #3A1418, #1B0D10)" }} />
    <div style={{ position: "absolute", left: 22, bottom: 6, width: 10, height: 10, borderRadius: 5, background: "#55616D" }} />
  </div>
);

// ─── The Short ───────────────────────────────────────────────────────
export const ShortLapsus1: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D: total, words } = useClip(1);

  const tHotel = c("budget") - 4;
  const tRoom = c("17-year-old") - 14;
  const tBail = c("bail");
  const tLaptop = c("laptop");
  const tBanned = c("banned");
  const tLoadout = c("So he uses");
  const tStick = c("fire");
  const tTv = c("hotel television");
  const tPhone = c("a phone");
  const tWith = c("With that");
  const tBreak = c("breaks");
  const tMost = c("most anticipated");
  const tLeaves = c("And he leaves");
  const tMsg1 = c("I am not");
  const tMsg2 = c("I am an");
  const tAttacker = c("attacker");
  const tEven = c("And this");
  const tBiggest = c("biggest hack");

  // ── room scene (tRoom → tLoadout) and its return (tWith → tBreak)
  const roomIn = sp(frame, fps, tRoom, springs.heavy, 50);
  const whiteIn = sp(frame, fps, tRoom + 10, springs.pop);
  const beats = [c("17-year-old"), c("police"), tBail, tLaptop, tBanned];
  const hop = beats.reduce((h, b) => (frame >= b && frame < b + 12 ? h + Math.sin(((frame - b) / 12) * Math.PI) * 34 : h), 0);
  const orbit = 24 + Math.sin(frame / 55) * 7;
  const roomExit = sp(frame, fps, tLoadout - 5, springs.snappy);
  const inRoom = frame >= tRoom && frame < tLoadout + 6;
  const roomScale = (0.5 + 0.5 * roomIn) * (1 + punch(frame, beats, 0.045)) * (1 + roomExit * 0.25);

  // return to the room and dive into the TV
  const dive = sp(frame, fps, tWith, springs.smooth, tBreak - tWith);
  const inDive = frame >= tWith - 2 && frame < tBreak;

  // ── break-in
  const breakT = interpolate(frame, [tBreak, tMost - 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const granted = frame >= tMost - 6;
  const inTarget = frame >= tBreak && frame < tLeaves + 6;
  const targetExit = sp(frame, fps, tLeaves - 4, springs.snappy);
  const g1 = frame >= tBreak - 3 && frame < tBreak + 10 ? Math.sin(((frame - tBreak + 3) / 13) * Math.PI) : 0;

  // ── chat takeover
  const chatIn = sp(frame, fps, tLeaves, springs.snappy);
  const inChat = frame >= tLeaves && frame < tEven;
  const line1 = "I am not a Rockstar employee,";
  const line2 = "I am an attacker.";
  const n1 = Math.max(0, Math.min(line1.length, Math.floor(((frame - tMsg1) / (c("employee", 1) + 14 - tMsg1)) * line1.length)));
  const n2 = Math.max(0, Math.min(line2.length, Math.floor(((frame - tMsg2) / (tAttacker + 16 - tMsg2)) * line2.length)));
  const pulse = frame >= tMsg1 ? 0.25 + 0.2 * Math.sin((frame - tMsg1) / 5) + (frame >= tAttacker ? 0.25 : 0) : 0;
  const g2 = frame >= tAttacker && frame < tAttacker + 12 ? Math.sin(((frame - tAttacker) / 12) * Math.PI) * 0.8 : 0;

  // ── ending
  const inEnd = frame >= tEven;
  const endCard = sp(frame, fps, tEven + 20, springs.pop);

  const fadeOut = interpolate(frame, [total - 6, total - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio src={staticFile("audio/video3/part1.mp3")} volume={fadeOut} />
      <Background drift={0.5}>
        <Hook to={tHotel} />
        <HotelExterior from={tHotel} to={tRoom} />

        {/* ── the room ── */}
        {inRoom ? (
          <AbsoluteFill style={{ opacity: 1 - roomExit }}>
            <Sfx name="pop" at={tRoom + 10} />
            <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 52%, rgba(57,255,136,0.10), rgba(0,0,0,0) 60%)" }} />
            <Diorama
              scale={roomScale}
              ry={orbit}
              tvOn={0.25}
              hop={hop}
              enter={Math.min(1, whiteIn)}
              look={{ x: frame >= tBail ? 0.2 : 0.6, y: frame >= tBail ? -0.8 : 0 }}
            />
            {frame < c("He is already") ? (
              <>
                <SlamTag at={c("17-year-old")} label="AGE" value="17" color={colors.amber} top={330} />
                <SlamTag at={c("police")} label="UNDER" value="POLICE PROTECTION" color={colors.agent} top={470} rotate={1.5} />
              </>
            ) : (
              <>
                <SlamTag at={tBail} label="BAIL" value="ACTIVE" color={colors.amber} top={330} />
                <SlamTag at={tLaptop} label="LAPTOP" value="CONFISCATED" color={colors.red} top={470} rotate={1.5} />
                <SlamTag at={tBanned} label="SMARTPHONE" value="BANNED" color={colors.red} top={610} rotate={-1} />
              </>
            )}
            {/* the companies he was already on bail for */}
            {frame >= c("biggest") && frame < tLaptop + 4
              ? ["NVIDIA", "SAMSUNG", "MICROSOFT", "UBER"].map((name, i) => {
                  const s = sp(frame, fps, c("biggest") + i * 4, springs.pop);
                  return (
                    <div key={name} style={{ position: "absolute", left: SAFE.left + (i % 2) * 440, top: 1130 + Math.floor(i / 2) * 74, transform: `scale(${s})`, transformOrigin: "left center" }}>
                      <BrandTag name={name} size={62} />
                    </div>
                  );
                })
              : null}
          </AbsoluteFill>
        ) : null}

        {/* ── loadout ── */}
        {frame >= tLoadout - 2 && frame < tWith + 6 ? (
          <AbsoluteFill style={{ opacity: 1 - sp(frame, fps, tWith - 4, springs.snappy), transform: `scale(${1 + punch(frame, [tStick, tTv, tPhone], 0.03)})` }}>
            <AbsoluteFill
              style={{
                backgroundImage: "linear-gradient(rgba(57,255,136,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(57,255,136,0.07) 2px, transparent 2px)",
                backgroundSize: "90px 90px",
                backgroundPosition: `${(frame * 0.8) % 90}px ${(frame * 0.8) % 90}px`,
              }}
            />
            <Sfx name="slam" at={tLoadout} />
            <div style={{ position: "absolute", left: SAFE.left, top: 330, ...display(210, colors.green), textShadow: `0 0 60px ${colors.green}66`, transform: `scale(${2 - sp(frame, fps, tLoadout, springs.slam)})`, transformOrigin: "left center" }}>
              LOADOUT
            </div>
            <div style={{ position: "absolute", left: SAFE.left + 560, top: 392, ...mono(30, colors.dim), letterSpacing: "0.12em", lineHeight: 1.4 }}>
              WHAT HE
              <br />
              COULD GET
            </div>
            <FlipCard at={tStick} top={560} slot="SLOT 1" title="TV STICK" stat="plugs into any television" color={colors.amber} icon={<IconStick />} />
            <FlipCard at={tTv} top={790} slot="SLOT 2" title="HOTEL TV" stat="already in the room" color={colors.green} icon={<IconTv />} />
            <FlipCard at={tPhone} top={1020} slot="SLOT 3" title="A PHONE" stat="banned by his bail" color={colors.red} icon={<IconPhone />} badge={{ text: "NOT ALLOWED", at: c("not supposed") }} />
          </AbsoluteFill>
        ) : null}

        {/* ── back to the room, straight into the TV ── */}
        {inDive ? (
          <AbsoluteFill>
            <Sfx name="whoosh" at={tWith} />
            <Sfx name="riser" at={tBreak - 40} volume={0.6} />
            <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + dive * dive * 3.4})`, transformOrigin: "672px 700px" }}>
              <Diorama scale={1} ry={24 - dive * 22} rx={-16 + dive * 12} tvOn={0.4 + dive * 0.6} look={{ x: 0.9, y: -0.3 }} tvContent={<MiniChat />} />
            </div>
          </AbsoluteFill>
        ) : null}

        {/* ── break-in ── */}
        {inTarget ? (
          <Glitch amount={g1} seed="break" style={{ position: "absolute", inset: 0, opacity: 1 - targetExit }}>
            <AbsoluteFill>
              <Sfx name="glitch" at={tBreak - 3} />
              <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,181,71,0.16), rgba(0,0,0,0) 60%)" }} />
              <div style={{ position: "absolute", left: SAFE.left, top: 330, ...mono(40, colors.dim), letterSpacing: "0.2em" }}>TARGET</div>
              <div style={{ position: "absolute", left: SAFE.left, top: 400, transform: `scale(${1 + punch(frame, [tBreak], 0.2, 5)})`, transformOrigin: "left center" }}>
                <BrandTag name="ROCKSTAR" size={170} />
              </div>
              <div style={{ position: "absolute", left: SAFE.left, top: 590, ...mono(38, colors.text) }}>the studio behind Grand Theft Auto</div>
              {/* access bar */}
              <div style={{ position: "absolute", left: SAFE.left, top: 720, width: 880 }}>
                <div style={{ ...mono(40, granted ? colors.green : colors.amber), fontWeight: 700, letterSpacing: "0.1em" }}>
                  {granted ? "ACCESS: GRANTED" : `BREAKING IN... ${Math.round(breakT * 100)}%`}
                </div>
                <div style={{ marginTop: 16, height: 46, borderRadius: 10, border: `4px solid ${granted ? colors.green : colors.amber}`, overflow: "hidden" }}>
                  <div style={{ width: `${breakT * 100}%`, height: "100%", background: granted ? colors.green : colors.amber, boxShadow: `0 0 30px ${granted ? colors.green : colors.amber}` }} />
                </div>
                <Sfx name="tick" at={tBreak} durationInFrames={tMost - 6 - tBreak} loop volume={0.7} />
                <Sfx name="coin" at={tMost - 6} volume={0.7} />
              </div>
              {frame >= tMost ? (
                <div style={{ position: "absolute", left: SAFE.left, top: 900 }}>
                  {["THE MOST", "ANTICIPATED", "GAME IN HISTORY"].map((t, i) => {
                    const s = sp(frame, fps, tMost + i * 9, springs.slam);
                    return frame >= tMost + i * 9 ? (
                      <div key={t} style={{ ...display(i === 1 ? 170 : 120, i === 1 ? colors.amber : colors.text), transform: `scale(${1.8 - 0.8 * s})`, transformOrigin: "left center", textShadow: "0 8px 0 rgba(0,0,0,0.6)" }}>
                        {t}
                      </div>
                    ) : null;
                  })}
                  <Sfx name="stamp" at={tMost + 9} />
                </div>
              ) : null}
            </AbsoluteFill>
          </Glitch>
        ) : null}

        {/* ── the chat takes over the whole screen ── */}
        {inChat ? (
          <Glitch amount={g2} seed="attacker" style={{ position: "absolute", inset: 0 }}>
            <AbsoluteFill style={{ transform: `translateY(${(1 - chatIn) * 1920}px)`, background: "#0A0F12" }}>
              <Sfx name="whoosh" at={tLeaves} />
              <Sfx name="notify" at={c("message")} />
              <Sfx name="type" at={tMsg1} durationInFrames={c("employee", 1) + 14 - tMsg1} loop />
              <Sfx name="type" at={tMsg2} durationInFrames={tAttacker + 16 - tMsg2} loop />
              <Sfx name="glitch" at={tAttacker} />
              {/* chat chrome */}
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 330, background: "#0D1418", borderBottom: `3px solid ${colors.line}` }} />
              <div style={{ position: "absolute", left: SAFE.left, top: 244, ...mono(46, colors.amber), fontWeight: 700 }}># all-staff</div>
              <div style={{ position: "absolute", left: SAFE.left + 330, top: 256, ...mono(30, colors.dim) }}>every employee</div>
              {[0, 1].map((i) => (
                <div key={i} style={{ position: "absolute", left: SAFE.left, top: 370 + i * 76, display: "flex", gap: 18, alignItems: "center", opacity: 0.45 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: "#22313A" }} />
                  <div style={{ width: 300 + i * 160, height: 18, borderRadius: 6, background: "#22313A" }} />
                </div>
              ))}
              {/* the message */}
              <div style={{ position: "absolute", left: SAFE.left, top: 540, width: 880 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 14, background: colors.red, boxShadow: `0 0 30px ${colors.red}`, ...display(54, colors.bg), display: "flex", alignItems: "center", justifyContent: "center" }}>?</div>
                  <span style={{ ...mono(38, colors.red), fontWeight: 700 }}>unknown user</span>
                  {frame < tMsg1 ? <span style={{ ...mono(30, colors.dim), opacity: 0.5 + 0.5 * Math.sin(frame / 4) }}>is typing...</span> : null}
                </div>
                <div
                  style={{
                    marginTop: 22,
                    padding: "26px 30px",
                    borderRadius: 18,
                    borderLeft: `12px solid ${colors.red}`,
                    background: "rgba(255,59,59,0.10)",
                    fontFamily: fonts.mono,
                    fontWeight: 700,
                    fontSize: 84,
                    lineHeight: 1.16,
                    color: colors.red,
                    textShadow: "0 0 30px rgba(255,59,59,0.55)",
                    minHeight: 560,
                    opacity: frame >= tMsg1 - 2 ? 1 : 0,
                  }}
                >
                  {line1.slice(0, n1)}
                  {n2 > 0 || frame >= tMsg2 ? <br /> : null}
                  <span style={{ color: colors.text, textShadow: "0 0 30px rgba(255,255,255,0.4)" }}>{line2.slice(0, n2)}</span>
                  <span style={{ display: "inline-block", width: 42, height: 84, verticalAlign: "-12px", marginLeft: 6, background: colors.red, opacity: Math.floor(frame / 7) % 2 ? 0.2 : 1 }} />
                </div>
              </div>
              {/* red vignette pulse */}
              <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(255,40,40,0.9) 130%)", opacity: Math.max(0, pulse), pointerEvents: "none" }} />
            </AbsoluteFill>
          </Glitch>
        ) : null}

        {/* ── ending ── */}
        {inEnd ? (
          <AbsoluteFill style={{ backgroundColor: colors.bg }}>
            <Sfx name="slam" at={c("wasn't")} />
            <Sfx name="slam" at={tBiggest} />
            <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(255,59,59,0.25), rgba(0,0,0,0) 60%)" }} />
            {frame >= c("wasn't") ? (
              <div style={{ position: "absolute", left: SAFE.left, top: 320, ...display(112), transform: `scale(${2 - sp(frame, fps, c("wasn't"), springs.slam)})`, transformOrigin: "left center" }}>
                AND THIS WASN'T EVEN
              </div>
            ) : null}
            {frame >= tBiggest ? (
              <div style={{ position: "absolute", left: SAFE.left, top: 440, ...display(136, colors.red), textShadow: "0 0 50px rgba(255,59,59,0.6)", transform: `scale(${2.2 - 1.2 * sp(frame, fps, tBiggest, springs.slam)})`, transformOrigin: "left center" }}>
                HIS BIGGEST HACK.
              </div>
            ) : null}
            {/* end card */}
            <div style={{ position: "absolute", left: SAFE.left, top: 700, width: 880, transform: `scale(${endCard})`, transformOrigin: "center top" }}>
              <Sfx name="pop" at={tEven + 20} />
              <div style={{ borderRadius: 26, background: colors.amber, padding: "34px 40px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: `0 0 80px ${colors.amber}66` }}>
                <div>
                  <div style={{ ...display(170, colors.bg) }}>FULL STORY</div>
                  <div style={{ ...mono(38, colors.bg), fontWeight: 700, marginTop: 6 }}>watch the full video</div>
                </div>
                <svg width={150} height={150} viewBox="0 0 100 100" style={{ transform: `translateX(${Math.sin(frame / 3) * 10}px)` }}>
                  <path d="M 14 50 H 80 M 54 22 L 84 50 L 54 78" fill="none" stroke={colors.bg} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ marginTop: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
                <OnionLogo size={62} />
                <span style={{ ...mono(40, colors.green), fontWeight: 700, letterSpacing: "0.14em" }}>THE ONION ARCHIVE</span>
              </div>
            </div>
          </AbsoluteFill>
        ) : null}

        {/* the hook stays on screen, small, through the middle of the Short */}
        {frame < tLeaves ? <HookStrip at={tRoom} text="HE HACKED GTA 6 WITH A TV STICK" /> : null}
      </Background>

      <Captions words={words} fontSize={88} maxWords={3} maxChars={13} bottom={520} />
      <ProgressBar total={total} />
    </AbsoluteFill>
  );
};

export const SHORT_SIZE = SHORT;
