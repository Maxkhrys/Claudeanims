import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  Chip,
  Cop,
  EmailHeader,
  EvidenceBoard,
  Flash,
  MarketLogo,
  NameTag,
  Pop,
  Scene,
  Sfx,
  Terminal,
  TitleSlam,
  mono,
} from "../components";
import { useClip } from "./words";

const GLYPHS = "0123456789abcdef#$%&@/+=";

/** Full-frame wall of scrambling ciphertext. */
const CipherWall: React.FC = () => {
  const frame = useCurrentFrame();
  const tick = Math.floor(frame / 3);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 40, ...mono(34, colors.greenDim), lineHeight: 1.45, letterSpacing: "0.12em", opacity: 0.7, whiteSpace: "pre", overflow: "hidden", height: 800 }}>
      {new Array(16).fill(0).map((_, r) => (
        <div key={r}>
          {new Array(72)
            .fill(0)
            .map((_, k) => GLYPHS[Math.floor(random(`cw-${r}-${k}-${tick + (k % 5)}`) * GLYPHS.length)])
            .join("")}
        </div>
      ))}
    </div>
  );
};

const Envelope: React.FC<{ glow: number }> = ({ glow }) => (
  <svg width={360} height={260} viewBox="0 0 36 26" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${10 + glow * 40}px ${colors.amber})` }}>
    <rect x={1} y={1} width={34} height={24} rx={2.5} fill={colors.panelLight} stroke={colors.amber} strokeWidth={1.2} />
    <path d="M 2 3 L 18 15 L 34 3" fill="none" stroke={colors.amber} strokeWidth={1.2} strokeLinejoin="round" />
    <circle cx={30} cy={5} r={3.2} fill={colors.red} />
  </svg>
);

// ─── Clip 7: The Hunt ────────────────────────────────────────────────
export const Clip7: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(7);

  const tSplit = c("Bay");
  const tWall = c("But AlphaBay");
  const tTip = c("Then");
  const tEmail = c("When");

  const bayOn = frame >= c("Bay");
  const netOn = frame >= c("Net");
  const blade = sp(frame, fps, c("pierce"), springs.snappy);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 5);
  const zoom = 1 + 1.15 * sp(frame, fps, c("investigators", 1), springs.heavy, D - c("investigators", 1));
  const piece = (text: string, on: boolean): React.ReactNode => (
    <span style={{ color: on ? colors.gold : colors.dim, textShadow: on ? `0 0 40px ${colors.gold}88` : "none", opacity: on ? 1 : 0.55 }}>{text}</span>
  );

  return (
    <>
      {/* 1: the hunters */}
      <Scene from={0} to={tSplit}>
        <Pop at={c("FBI") - 4} origin="center bottom" style={{ left: 110, top: 380 }}>
          <Cop size={380} look={{ x: 0.8, y: -0.2 }} />
          <NameTag text="FBI" color={colors.agent} fontSize={34} />
        </Pop>
        <Pop at={c("DEA") - 4} origin="center bottom" style={{ left: 420, top: 380 }}>
          <Cop size={380} seed={13} look={{ x: 0.8, y: -0.2 }} />
          <NameTag text="DEA" color={colors.agent} fontSize={34} />
        </Pop>
        <EvidenceBoard
          width={1010}
          height={560}
          style={{ left: 820, top: 250 }}
          items={[
            { id: "site", x: 250, y: 120, at: c("hunting"), title: "ALPHABAY", color: colors.gold },
            { id: "srv", x: 770, y: 130, at: c("hunting") + 8, title: "SERVERS", sub: "location: unknown" },
            { id: "cash", x: 250, y: 440, at: c("hunting") + 16, title: "MONEY", sub: "owner: unknown" },
            { id: "who", x: 720, y: 400, at: c("Alpha02"), title: "ALPHA02", sub: "real name: ???", color: colors.red, big: true },
          ]}
          strings={[
            { from: "site", to: "who", at: c("Alpha02") + 8 },
            { from: "srv", to: "who", at: c("Alpha02") + 14 },
            { from: "cash", to: "who", at: c("Alpha02") + 20 },
          ]}
        />
        <TitleSlam text="OPERATION BAYONET" color={colors.agent} fontSize={170} at={c("Bayonet") - 4} style={{ top: 50 }} />
      </Scene>

      {/* 2: where the name comes from */}
      <Scene from={tSplit} to={tWall}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: fonts.display, fontSize: 210, lineHeight: 1, letterSpacing: "0.02em" }}>
          {piece("ALPHA", false)}
          {piece("BAY", bayOn)}
          <span style={{ color: colors.text, margin: "0 50px", opacity: netOn ? 1 : 0.2 }}>+</span>
          {piece("DARK", false)}
          {piece("NET", netOn)}
        </div>
        <Sfx name="pop" at={c("Bay")} />
        <Sfx name="pop" at={c("Net")} />
        <Pop at={c("blade")} from="slam" sound="slam" style={{ left: 0, right: 0, top: 400, textAlign: "center" }}>
          <span style={{ fontFamily: fonts.display, fontSize: 340, lineHeight: 1, letterSpacing: "0.03em" }}>
            {piece("BAY", true)}
            <span style={{ color: colors.text }}>O</span>
            {piece("NET", true)}
          </span>
        </Pop>
        {/* the blade */}
        {frame >= c("pierce") ? (
          <svg width={900} height={90} viewBox="0 0 300 30" style={{ position: "absolute", left: interpolate(blade, [0, 1], [-900, 1400]), top: 520, filter: `drop-shadow(0 0 16px ${colors.text})` }}>
            <path d="M 0 12 H 70 V 18 H 0 Z" fill="#59636D" />
            <path d="M 70 6 H 78 V 24 H 70 Z" fill={colors.text} />
            <path d="M 78 9 L 270 9 L 298 15 L 270 21 L 78 21 Z" fill={colors.text} />
          </svg>
        ) : null}
        <Sfx name="whoosh" at={c("pierce")} />
        <Chip at={c("dark")} text="BUILT TO PIERCE THE DARK WEB" color={colors.text} fontSize={34} origin="center center" style={{ left: 660, top: 770 }} />
      </Scene>

      {/* 3: two years of nothing */}
      <Scene from={tWall} to={tTip}>
        <CipherWall />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 55%, rgba(7,9,11,0.2) 0%, rgba(7,9,11,0.88) 75%)" }} />
        <Pop at={tWall + 4} origin="center bottom" style={{ left: 600, top: 480 }}>
          <Cop size={340} look={{ x: 0.4, y: -0.9 }} />
        </Pop>
        <Pop at={tWall + 8} origin="center bottom" style={{ left: 1030, top: 480 }}>
          <Cop size={340} seed={13} look={{ x: -0.4, y: -0.9 }} />
        </Pop>
        <Chip at={c("built")} text="?" color={colors.text} filled fontSize={60} origin="center center" style={{ left: 480, top: 520 }} />
        <Chip at={c("built") + 6} text="?" color={colors.text} filled fontSize={60} origin="center center" style={{ left: 1370, top: 520 }} />
        <Chip at={c("Tor")} text="TOR HID THE SERVERS" color={colors.green} fontSize={36} style={{ left: 130, top: 60 }} />
        <Chip at={c("Bitcoin")} text="BITCOIN HID THE MONEY" color={colors.amber} fontSize={36} style={{ left: 1260, top: 60 }} />
        <Chip at={c("two")} text="2+ YEARS" color={colors.text} fontSize={44} origin="center center" style={{ left: 830, top: 60 }} />
        <TitleSlam text="NOWHERE" color={colors.red} fontSize={300} at={c("nowhere")} style={{ top: 150 }} />
        <Sfx name="error" at={c("nowhere") + 4} />
      </Scene>

      {/* 4: the tip */}
      <Scene from={tTip} to={tEmail}>
        <Terminal
          style={{ position: "absolute", left: 0, right: 0, top: 110 }}
          align="center"
          fontSize={60}
          lines={[{ text: "LATE 2016", at: c("late") - 4, durationInFrames: 18 }]}
        />
        <Sfx name="riser" at={c("investigators") - 6} volume={0.7} />
        <Pop at={c("found")} sound="notify" style={{ left: 960 - 180, top: 330 }}>
          <div style={{ transform: `translateY(${Math.sin(frame / 12) * 8}px) scale(${1 + 0.03 * pulse})` }}>
            <Envelope glow={pulse} />
          </div>
        </Pop>
        <Chip at={c("tiny")} text="A TINY DETAIL" color={colors.amber} filled fontSize={50} origin="center center" style={{ left: 240, top: 420 }} />
        <Chip at={c("plain")} text="IN PLAIN SIGHT" color={colors.text} fontSize={50} origin="center center" style={{ left: 1260, top: 380 }} />
        <Chip at={c("day")} text="SINCE DAY ONE" color={colors.text} fontSize={50} origin="center center" style={{ left: 1270, top: 510 }} />
        <Flash at={c("found")} color={colors.amber} peak={0.3} durationInFrames={10} />
      </Scene>

      {/* 5: the welcome email */}
      <Scene from={tEmail} to={D + 10} exit="cut">
        <Scene from={tEmail} to={c("investigators", 1)}>
          <Pop at={tEmail + 2} style={{ left: 110, top: 70 }}>
            <MarketLogo name="ALPHABAY" mark="alpha" size={50} />
          </Pop>
          <Chip at={c("signed")} text="NEW FORUM SIGN-UP" color={colors.gold} fontSize={32} style={{ left: 620, top: 76 }} />
          <Chip at={c("reset")} text="PASSWORD RESET" color={colors.gold} fontSize={32} style={{ left: 1050, top: 76 }} />
          <Chip at={c("email", 1)} text="= AN EMAIL" color={colors.text} filled fontSize={32} style={{ left: 1410, top: 76 }} />
        </Scene>
        <EmailHeader
          width={1300}
          style={{ left: 310 + (zoom - 1) * 300, top: 190 }}
          at={tEmail + 8}
          subject="Welcome to AlphaBay!"
          fromName="AlphaBay"
          fromAddress="pimp_alex_91@hotmail.com"
          to="new member"
          date="December 2014"
          body={["Welcome to the AlphaBay forums.", "Your account has been created."]}
          blur={1}
          zoom={zoom}
        />
        <Sfx name="riser" at={c("look")} volume={0.6} />
        <Chip at={c("who", 2)} text="WHO SENT THESE?" color={colors.red} filled fontSize={54} origin="center center" style={{ left: 660, top: 740 }} />
      </Scene>
    </>
  );
};
