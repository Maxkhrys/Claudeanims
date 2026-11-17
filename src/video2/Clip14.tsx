import React, { useMemo } from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  BlobCharacter,
  Car,
  Chip,
  DecodeText,
  NameTag,
  OnionLogo,
  Pop,
  Scene,
  Sfx,
  Terminal,
  TitleSlam,
  mono,
} from "../components";
import { useClip } from "./words";

/** Open laptop facing the viewer. `on` 0..1 is how lit the screen is. */
const OpenLaptop: React.FC<{ on: number; color: string; text: string }> = ({ on, color, text }) => (
  <div style={{ width: 380 }}>
    <div
      style={{
        width: 340,
        height: 210,
        margin: "0 auto",
        borderRadius: "12px 12px 0 0",
        border: "8px solid #232B32",
        background: on > 0.05 ? `linear-gradient(to bottom, ${color}33, ${color}11)` : "#06080A",
        boxShadow: `0 0 ${70 * on}px ${color}${on > 0.3 ? "88" : "00"}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div style={{ ...mono(22, color), opacity: on, letterSpacing: "0.14em" }}>LOGGED IN AS</div>
      <div style={{ fontFamily: fonts.display, fontSize: 46, lineHeight: 1, color, opacity: on, textAlign: "center" }}>{text}</div>
    </div>
    <div style={{ width: 380, height: 16, borderRadius: "3px 3px 12px 12px", background: "#232B32" }} />
  </div>
);

/** Earth as a wireframe globe with glowing network lines. */
const NetGlobe: React.FC<{ size?: number }> = ({ size = 620 }) => {
  const frame = useCurrentFrame();
  const { nodes, links } = useMemo(() => {
    const n = new Array(26).fill(0).map((_, i) => {
      const a = random(`gn-a-${i}`) * Math.PI * 2;
      const r = Math.sqrt(random(`gn-r-${i}`)) * 92;
      return { x: Math.cos(a) * r, y: Math.sin(a) * r };
    });
    const l = new Array(30).fill(0).map((_, i) => ({
      a: Math.floor(random(`gl-a-${i}`) * n.length),
      b: Math.floor(random(`gl-b-${i}`) * n.length),
      phase: random(`gl-p-${i}`) * 60,
    }));
    return { nodes: n, links: l.filter((k) => k.a !== k.b) };
  }, []);
  return (
    <svg width={size} height={size} viewBox="-110 -110 220 220" style={{ overflow: "visible" }}>
      <circle r={100} fill="rgba(57,255,136,0.05)" stroke={colors.green} strokeWidth={1.6} style={{ filter: `drop-shadow(0 0 10px ${colors.green})` }} />
      <g opacity={0.5} transform={`rotate(${frame / 10})`}>
        <ellipse rx={100} ry={36} fill="none" stroke={colors.greenDim} strokeWidth={1} />
        <ellipse rx={100} ry={72} fill="none" stroke={colors.greenDim} strokeWidth={1} />
        <ellipse rx={40} ry={100} fill="none" stroke={colors.greenDim} strokeWidth={1} />
        <ellipse rx={76} ry={100} fill="none" stroke={colors.greenDim} strokeWidth={1} />
        <path d="M -100 0 H 100 M 0 -100 V 100" stroke={colors.greenDim} strokeWidth={1} />
      </g>
      {links.map((k, i) => {
        const A = nodes[k.a];
        const B = nodes[k.b];
        const mx = (A.x + B.x) / 2;
        const my = (A.y + B.y) / 2 - Math.hypot(B.x - A.x, B.y - A.y) * 0.3;
        const t = ((frame + k.phase) % 60) / 60;
        const px = (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * mx + t * t * B.x;
        const py = (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * my + t * t * B.y;
        const col = i % 6 === 0 ? colors.gold : colors.green;
        return (
          <g key={i}>
            <path d={`M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`} fill="none" stroke={col} strokeWidth={0.7} opacity={0.55} />
            <circle cx={px} cy={py} r={1.6} fill="#fff" />
          </g>
        );
      })}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={2.2} fill={colors.green} />
      ))}
    </svg>
  );
};

export const Clip14: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(14);

  const tLaptops = c("Both were caught");
  const tWeb = c("The dark");
  const tSomewhere = c("Somewhere");

  const RX = 560; // Ross column centre
  const CX = 1360; // Cazes column centre
  const screensOn = sp(frame, fps, c("laptops"), springs.snappy);
  const screensOff = sp(frame, fps, c("trial") + 14, springs.smooth, 20);
  const lit = screensOn * (1 - screensOff);
  const zoom = interpolate(sp(frame, fps, tWeb, springs.heavy, 150), [0, 1], [2.6, 1]);

  const tSoDid = c("So did");
  const tLogo = tSoDid + 38;
  const logoIn = sp(frame, fps, tLogo, springs.snappy);
  const black = frame >= D - 5;

  return (
    <>
      {/* 1 + 2: the two of them */}
      <Scene from={0} to={tWeb}>
        {/* seen from behind: eyes are painted in the body colour */}
        <Pop at={2} origin="center bottom" style={{ left: RX - 173, top: 390 }}>
          <BlobCharacter color={colors.ross} eyeColor={colors.ross} size={400} seed={1} />
          <NameTag text="ROSS ULBRICHT" color={colors.ross} />
        </Pop>
        <Pop at={c("Alexandre") - 4} origin="center bottom" style={{ left: CX - 173, top: 390 }}>
          <BlobCharacter color={colors.cazes} eyeColor={colors.cazes} cornerRadius={54} hair size={400} seed={11} />
          <NameTag text="ALEXANDRE CAZES" color={colors.cazes} />
        </Pop>

        <Scene from={0} to={tLaptops}>
          <TitleSlam text="TWO EMPIRES" fontSize={170} at={c("biggest")} style={{ top: 40 }} />
          <Chip at={c("brilliant")} text="BOTH BRILLIANT" color={colors.text} fontSize={36} origin="center center" style={{ left: 790, top: 470 }} />
          <Chip at={c("careful")} text="BOTH CAREFUL" color={colors.text} fontSize={36} origin="center center" style={{ left: 808, top: 560 }} />
          <Pop at={c("old")} from="up" style={{ left: RX - 380, top: 250, width: 760, textAlign: "center" }}>
            <span style={{ ...mono(46, colors.green), fontWeight: 700, textShadow: `0 0 24px ${colors.green}66` }}>
              <DecodeText text="rossulbricht@gmail.com" at={c("old")} durationInFrames={16} />
            </span>
          </Pop>
          <Pop at={c("email")} from="up" style={{ left: CX - 400, top: 250, width: 800, textAlign: "center" }}>
            <span style={{ ...mono(46, colors.gold), fontWeight: 700, textShadow: `0 0 24px ${colors.gold}66` }}>
              <DecodeText text="pimp_alex_91@hotmail.com" at={c("email")} durationInFrames={16} />
            </span>
          </Pop>
          <Chip at={c("forgotten")} text="AN OLD EMAIL ADDRESS" color={colors.red} filled fontSize={38} origin="center center" style={{ left: 740, top: 660 }} />
        </Scene>

        <Scene from={tLaptops} to={tWeb}>
          <Pop at={c("laptops") - 4} from="up" style={{ left: RX - 190, top: 60 }}>
            <div style={{ transform: "scale(1.25)", transformOrigin: "center top" }}>
              <OpenLaptop on={lit} color={colors.green} text="DREAD PIRATE ROBERTS" />
            </div>
          </Pop>
          <Pop at={c("laptops")} from="up" style={{ left: CX - 190, top: 60 }}>
            <div style={{ transform: "scale(1.25)", transformOrigin: "center top" }}>
              <OpenLaptop on={lit} color={colors.gold} text="ALPHA02" />
            </div>
          </Pop>
          <Sfx name="click" at={c("open")} />
          <Chip at={c("caught")} text="BOTH CAUGHT, LAPTOPS OPEN" color={colors.text} fontSize={32} origin="center center" style={{ left: 715, top: 372 }} />
          <Chip at={c("two", 1)} text="2 LIFE SENTENCES" color={colors.red} fontSize={32} origin="left center" style={{ left: 70, top: 520 }} />
          <Chip at={c("pardon") - 10} text="PARDONED, 2025" color={colors.green} fontSize={32} origin="left center" style={{ left: 70, top: 610 }} />
          <Pop at={c("never")} from="up" style={{ left: CX + 200, top: 540 }}>
            <span style={{ ...mono(34, colors.text), lineHeight: 1.4 }}>
              never made
              <br />
              it to trial
            </span>
          </Pop>
        </Scene>
      </Scene>

      {/* 3: zoom out to the whole network */}
      <Scene from={tWeb} to={tSomewhere}>
        <div style={{ position: "absolute", left: 130, top: 140, transform: `scale(${zoom})`, transformOrigin: "310px 310px" }}>
          <NetGlobe size={620} />
        </div>
        <Chip at={c("promises")} text="THE PROMISE: PERFECT ANONYMITY" color={colors.green} fontSize={38} style={{ left: 880, top: 150 }} />
        <TitleSlam text="PEOPLE AREN'T PERFECT" color={colors.amber} fontSize={112} at={c("aren't")} style={{ left: 874, right: "auto", top: 250, alignItems: "flex-start" }} />
        <Chip at={c("proud")} text="THEY GET PROUD" color={colors.text} fontSize={40} style={{ left: 880, top: 440 }} />
        <Chip at={c("lazy")} text="THEY GET LAZY" color={colors.text} fontSize={40} style={{ left: 880, top: 540 }} />
        <Pop at={c("selfie")} from="right" style={{ left: 880, top: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Car type="sedan" size={250} color={colors.gold} />
            <span style={{ ...mono(34, colors.gold), fontWeight: 700 }}>
              A SELFIE WITH
              <br />
              THE PORSCHE
            </span>
          </div>
        </Pop>
        <Sfx name="snap" at={c("selfie")} />
      </Scene>

      {/* 4: so did they */}
      <Scene from={tSomewhere} to={D} exit="cut">
        {frame < tLogo ? (
          <Terminal
            style={{ position: "absolute", left: 250, top: 250 }}
            fontSize={58}
            color={colors.text}
            lines={[
              { text: "someone is building the next AlphaBay.", prompt: "> ", at: c("someone"), durationInFrames: 64 },
              { text: "they think they're smarter.", prompt: "> ", at: c("They think"), durationInFrames: 30 },
              { text: "so did they.", prompt: "> ", at: tSoDid, durationInFrames: 14, color: colors.green, size: 1.5 },
            ]}
          />
        ) : null}
        {frame >= tLogo && !black ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              paddingBottom: 140,
              opacity: Math.min(1, logoIn * 2),
              transform: `scale(${0.9 + 0.1 * logoIn})`,
            }}
          >
            <Sfx name="slam" at={tLogo} volume={0.7} />
            <OnionLogo size={170} color={colors.green} />
            <div style={{ fontFamily: fonts.display, fontSize: 200, lineHeight: 1, letterSpacing: "0.04em", color: colors.text, textShadow: "0 0 50px rgba(57,255,136,0.35)" }}>
              THE ONION ARCHIVE
            </div>
          </div>
        ) : null}
      </Scene>
    </>
  );
};
