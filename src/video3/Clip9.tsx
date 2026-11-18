import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, BrandTag, Card, Chip, Counter, Crosshair, Pop, Scene, Sfx, Terminal, TitleSlam, mono } from "../components";
import { useClip } from "./words";

const NV = "#76B900";

const Folder: React.FC<{ at: number; label: string; top: number }> = ({ at, label, top }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = sp(frame, 30, at, springs.smooth, 22);
  return (
    <div style={{ position: "absolute", left: interpolate(s, [0, 1], [560, 1100]), top: top - Math.sin(Math.min(1, s) * Math.PI) * 70, opacity: Math.min(1, s * 3) }}>
      <Sfx name="whoosh" at={at} volume={0.8} />
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <svg width={110} height={90} viewBox="0 0 55 45">
          <path d="M 2 8 H 20 L 25 13 H 53 V 43 H 2 Z" fill={colors.amber} />
          <path d="M 2 18 H 53 V 43 H 2 Z" fill="#FFC870" />
        </svg>
        <span style={{ fontFamily: fonts.display, fontSize: 84, color: colors.text, whiteSpace: "nowrap" }}>{label}</span>
      </div>
    </div>
  );
};

const Exec: React.FC<{ at: number; qAt: number; left: number; top: number; color: string; seed: number; size?: number }> = ({ at, qAt, left, top, color, seed, size = 250 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Pop at={at} origin="center bottom" style={{ left, top }}>
        <BlobCharacter color={color} size={size} seed={seed} look={{ x: 0.2, y: -0.7 }} />
      </Pop>
      <Pop at={qAt} style={{ left: left + size * 0.55, top: top - 50 + Math.sin(frame / 9 + seed) * 6 }} sound="pop">
        <span style={{ fontFamily: fonts.display, fontSize: 110, color: colors.amber, textShadow: `0 0 24px ${colors.amber}77` }}>?</span>
      </Pop>
    </>
  );
};

export const Clip9: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(9);

  const tTook = c("They took");
  const tAnnounce = c("Then they");
  const tRansom = c("When the");
  const tWish = c("It was a");

  const open = sp(frame, fps, c("ransom") - 4, springs.smooth, 22);
  const struck = sp(frame, fps, c("didn't"), springs.snappy);
  const wheel = frame * 2;
  const d1 = "Remove the mining limit from your graphics cards.";
  const d2 = "Release your drivers as open source.";
  const typed = (text: string, from: number, to: number) => text.slice(0, Math.max(0, Math.min(text.length, Math.floor(((frame - from) / Math.max(1, to - from)) * text.length))));

  return (
    <>
      {/* 1: the target */}
      <Scene from={0} to={tTook}>
        <Terminal style={{ position: "absolute", left: 130, top: 100 }} fontSize={64} lines={[{ text: "FEBRUARY 2022", at: c("February"), durationInFrames: 22 }]} />
        <Pop at={c("Nvidia")} from="slam" style={{ left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }} sound="slam">
          <BrandTag name="NVIDIA" size={260} />
        </Pop>
        <Crosshair at={c("after")} size={300} style={{ left: 420, top: 290 }} />
        <Chip at={c("video")} text="POWERS VIDEO GAMES" color={NV} fontSize={36} origin="center center" style={{ left: 420, top: 640 }} />
        <Chip at={c("artificial")} text="AND NOW: ARTIFICIAL INTELLIGENCE" color={colors.text} fontSize={36} origin="center center" style={{ left: 930, top: 640 }} />
        <Chip at={c("Lapsus")} text="TARGET" color={colors.red} filled fontSize={34} style={{ left: 130, top: 210 }} />
      </Scene>

      {/* 2: nearly a terabyte */}
      <Scene from={tTook} to={tAnnounce}>
        <Pop at={tTook} from="left" style={{ left: 130, top: 200 }}>
          <div style={{ width: 480, height: 480, borderRadius: 40, background: "linear-gradient(135deg, #1B242C, #0E1418)", border: `8px solid ${NV}`, boxShadow: `0 0 80px ${NV}44, 0 30px 80px rgba(0,0,0,0.7)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={260} height={260} viewBox="-50 -50 100 100" style={{ transform: `rotate(${wheel}deg)` }}>
              <circle r={40} fill="none" stroke={colors.text} strokeWidth={6} />
              <circle r={10} fill={colors.text} />
              {[0, 60, 120].map((a) => (
                <path key={a} d="M -44 0 H 44" stroke={colors.text} strokeWidth={6} strokeLinecap="round" transform={`rotate(${a})`} />
              ))}
            </svg>
          </div>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <BrandTag name="NVIDIA" size={54} />
          </div>
        </Pop>
        <div style={{ position: "absolute", left: 720, top: 130, display: "flex", alignItems: "baseline", gap: 26 }}>
          <Pop at={c("nearly")} from="up" style={{ position: "relative" }}>
            <span style={{ ...mono(40, colors.dim), letterSpacing: "0.16em" }}>NEARLY</span>
          </Pop>
          {frame >= c("nearly") ? (
            <Counter to={1000} at={c("nearly")} durationInFrames={c("data") - c("nearly") + 8} fontSize={200} color={NV} format={(n) => (n >= 1000 ? "1 TB" : `${n} GB`)} />
          ) : null}
        </div>
        <Folder at={c("Chip")} label="CHIP DESIGNS" top={420} />
        <Folder at={c("Internal")} label="INTERNAL SOFTWARE" top={560} />
        <Folder at={c("Employee")} label="EMPLOYEE LOGINS" top={700} />
      </Scene>

      {/* 3: they announce it, and wait */}
      <Scene from={tAnnounce} to={tRansom}>
        <Pop at={tAnnounce} from="up" style={{ left: 310, top: 170 }}>
          <Card accent={colors.amber} style={{ width: 1300, padding: "26px 36px 34px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
              <span style={{ fontFamily: fonts.display, fontSize: 70, color: colors.amber }}>LAPSUS</span>
              <span style={{ ...mono(26, colors.dim) }}>public channel · post paraphrased</span>
            </div>
            <Terminal
              style={{ marginTop: 16 }}
              fontSize={58}
              color={colors.text}
              lines={[
                { text: "we are inside NVIDIA.", at: c("announced"), durationInFrames: 24 },
                { text: "we took nearly 1 TB.", at: c("followers") - 6, durationInFrames: 22, color: colors.amber },
              ]}
            />
          </Card>
        </Pop>
        <Pop at={c("waited")} from="up" style={{ left: 0, right: 0, top: 620, textAlign: "center" }}>
          <span style={{ ...mono(48, colors.dim) }}>
            waiting for the company to respond{".".repeat(1 + (Math.floor(frame / 10) % 3))}
          </span>
        </Pop>
      </Scene>

      {/* 4: the ransom note */}
      <Scene from={tRansom} to={tWish}>
        <div
          style={{
            position: "absolute",
            left: 520,
            top: 60,
            width: 1280,
            height: 780,
            transform: `scaleY(${0.04 + 0.96 * open})`,
            transformOrigin: "center top",
            opacity: Math.min(1, open * 4),
            background: "#E9E4D8",
            borderRadius: 10,
            boxShadow: "0 40px 110px rgba(0,0,0,0.8)",
            padding: "38px 56px",
            color: "#14171B",
            overflow: "hidden",
          }}
        >
          <Sfx name="riser" at={c("ransom") - 4} volume={0.6} />
          <div style={{ fontFamily: fonts.display, fontSize: 110, lineHeight: 1, letterSpacing: "0.04em" }}>OUR DEMANDS</div>
          <div style={{ height: 6, background: "#14171B", margin: "10px 0 26px" }} />
          <div style={{ position: "relative", display: "inline-block", fontFamily: fonts.mono, fontSize: 64, fontWeight: 700, opacity: frame >= c("anyone") - 20 ? (frame >= c("asked") ? 0.35 : 1) : 0 }}>
            $ {frame >= c("didn't") ? "0" : "?,???,???"}
            <div style={{ position: "absolute", left: -8, top: "50%", height: 8, width: `calc(${struck * 100}% + ${struck * 16}px)`, background: colors.red }} />
          </div>
          <div style={{ fontFamily: fonts.mono, fontSize: 44, fontWeight: 700, lineHeight: 1.4, marginTop: 26, minHeight: 130 }}>
            {frame >= c("asked") ? <span style={{ color: "#8A1C1C" }}>1. </span> : null}
            {typed(d1, c("asked"), c("cards") + 8)}
          </div>
          <div style={{ fontFamily: fonts.mono, fontSize: 44, fontWeight: 700, lineHeight: 1.4, marginTop: 18, minHeight: 70 }}>
            {frame >= c("demanded") ? <span style={{ color: "#8A1C1C" }}>2. </span> : null}
            {typed(d2, c("demanded"), c("chips", 1) + 6)}
          </div>
        </div>
        <Sfx name="type" at={c("asked")} durationInFrames={c("cards") + 8 - c("asked")} loop />
        <Sfx name="type" at={c("demanded")} durationInFrames={c("chips", 1) + 6 - c("demanded")} loop />
        <Chip at={c("money")} text="NOT MONEY" color={colors.red} filled fontSize={46} origin="center center" style={{ left: 1300, top: 250 }} />
        <Chip at={c("mining")} text="...TO MINE CRYPTO BETTER" color={colors.amber} fontSize={28} sound={false} style={{ left: 1040, top: 424 }} />
        <Chip at={c("free")} text="FOR FREE" color={colors.amber} filled fontSize={44} style={{ left: 580, top: 720 }} />
        <Chip at={c("everyone")} text="FOR EVERYONE" color={colors.amber} filled fontSize={44} style={{ left: 910, top: 720 }} />
        <Chip at={c("Forever")} text="FOREVER" color={colors.red} filled fontSize={56} sound="slam" style={{ left: 1370, top: 712 }} />
        <Exec at={c("anyone") - 12} qAt={c("change")} left={110} top={170} color={colors.ross} seed={61} />
        <Exec at={c("anyone") - 6} qAt={c("mining")} left={250} top={400} color={colors.extras[0]} seed={62} />
        <Exec at={c("expected")} qAt={c("publish")} left={90} top={610} color={colors.extras[2]} seed={63} size={230} />
      </Scene>

      {/* 5: a teenager's wish list */}
      <Scene from={tWish} to={D}>
        <TitleSlam text="A RANSOM NOTE" fontSize={170} at={c("ransom", 1) - 4} style={{ top: 100 }} />
        <TitleSlam text="THAT READ LIKE A WISH LIST" color={colors.amber} fontSize={170} at={c("teenager's")} style={{ top: 290 }} />
        {[colors.ross, colors.extras[0], colors.extras[2]].map((col, i) => (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 560 + i * 290, top: 540 }}>
              <BlobCharacter color={col} size={270} seed={61 + i} look={{ x: 0, y: -0.6 }} />
            </div>
            <div style={{ position: "absolute", left: 700 + i * 290, top: 480 + Math.sin(frame / 9 + i) * 6, fontFamily: fonts.display, fontSize: 110, color: colors.amber }}>?</div>
          </React.Fragment>
        ))}
      </Scene>
    </>
  );
};
