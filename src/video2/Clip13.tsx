import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  BlobCharacter,
  Card,
  Chip,
  Cop,
  Counter,
  DecodeText,
  Flash,
  GlitchTransition,
  MapPins,
  MarketLogo,
  Pop,
  Scene,
  SeizedStamp,
  Sfx,
  TitleSlam,
  mono,
} from "../components";
import { useClip } from "./words";

/** Simple coiled snake avatar for DeSnake. */
const SnakeAvatar: React.FC<{ size?: number; color?: string }> = ({ size = 200, color = colors.gold }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={48} fill={colors.panelLight} stroke={color} strokeWidth={3} />
    <path
      d="M 28 74 C 16 62 22 46 38 46 C 54 46 54 62 44 62 C 36 62 36 54 44 52 M 28 74 C 44 86 76 82 78 60 C 80 42 66 34 60 26"
      fill="none"
      stroke={color}
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M 60 26 C 54 18 60 10 70 12 C 80 14 80 26 72 30 C 66 33 62 30 60 26 Z" fill={color} />
    <circle cx={71} cy={19} r={2.6} fill={colors.bg} />
    <path d="M 78 22 l 9 -4 M 78 22 l 9 3" stroke={colors.red} strokeWidth={2.5} strokeLinecap="round" />
  </svg>
);

const Hooded: React.FC<{ size: number; seed: number; look?: { x: number; y: number } }> = ({ size, seed, look }) => (
  <BlobCharacter color={colors.dpr} accessory="hoodie" size={size} seed={seed} look={look} lightColor={colors.gold} lightAmount={0.7} />
);

/** Line that strikes itself out. */
const StrikeLine: React.FC<{ at: number; text: string; top: number }> = ({ at, text, top }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, 30, at + 8, springs.snappy);
  return (
    <Pop at={at} from="up" style={{ left: 0, right: 0, top, textAlign: "center" }}>
      <span style={{ position: "relative", display: "inline-block", ...mono(56), fontWeight: 700 }}>
        {text}
        <span style={{ position: "absolute", left: -10, top: "52%", height: 7, width: `calc(${s * 100}% + ${s * 20}px)`, background: colors.red, boxShadow: `0 0 16px ${colors.red}` }} />
      </span>
    </Pop>
  );
};

// where new markets "sprout" on the map (lon, lat)
const SPROUTS: [number, number][] = [
  [-100, 42], [10, 50], [105, 34], [-55, -12], [25, 5], [135, -25], [-120, 55], [75, 22],
  [35, 55], [-75, 5], [120, 58], [18, -28], [-88, 34], [55, 40], [2, 44], [100, 15],
];

export const Clip13: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(13);

  const tRelaunch = c("It was relaunched");
  const tBeyond = c("And beyond");
  const tCat = c("It's a cat");
  const tAlmost = c("But almost");

  const back = c("AlphaBay");
  const alive = frame >= back;
  const sway = Math.sin((frame - tCat) / 16) * 70 + Math.sin((frame - tCat) / 7) * 10;
  const drift = interpolate(frame, [tAlmost, D], [1500, -900]);

  return (
    <>
      {/* 1: four years later, it comes back */}
      <Scene from={0} to={tRelaunch}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center" }}>
          <Counter from={2017} to={2021} at={c("2021") - 8} durationInFrames={26} fontSize={210} format={(n) => String(n)} color={alive ? colors.gold : colors.dim} />
        </div>
        <Chip at={c("four")} text="4 YEARS LATER" color={colors.text} origin="center center" style={{ left: 800, top: 360 }} />
        {/* dead logo, then alive */}
        {!alive ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", opacity: 0.25, filter: "grayscale(1)" }}>
            <MarketLogo name="ALPHABAY" mark="alpha" size={170} color={colors.dim} />
          </div>
        ) : null}
        <GlitchTransition at={back} durationInFrames={16} mode="in" seed="ab-back">
          <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center" }}>
            <MarketLogo name="ALPHABAY" mark="alpha" size={170} />
          </div>
        </GlitchTransition>
        <Scene from={0} to={back}>
          <SeizedStamp at={6} text="OFFLINE SINCE 2017" color={colors.dim} fontSize={54} rotate={-6} sound={false} style={{ left: 700, top: 740 }} />
        </Scene>
        <Chip at={c("back")} text="BACK ONLINE" color={colors.gold} filled fontSize={46} origin="center center" style={{ left: 770, top: 750 }} />
        <Flash at={back} color={colors.gold} peak={0.3} durationInFrames={10} />
      </Scene>

      {/* 2: DeSnake */}
      <Scene from={tRelaunch} to={tBeyond}>
        <Pop at={tRelaunch} origin="center bottom" style={{ left: 190, top: 300 }}>
          <Hooded size={470} seed={14} look={{ x: 0.8, y: 0 }} />
        </Pop>
        <Pop at={c("relaunched")} from="up" style={{ left: 720, top: 150 }}>
          <Card accent={colors.gold} style={{ width: 1060, display: "flex", gap: 44, alignItems: "center", padding: "34px 44px" }}>
            <SnakeAvatar size={230} />
            <div style={{ flex: 1 }}>
              <div style={{ ...mono(26, colors.dim), letterSpacing: "0.2em" }}>NEW ADMIN</div>
              <div style={{ fontFamily: fonts.display, fontSize: 190, lineHeight: 1, color: colors.gold, textShadow: `0 0 40px ${colors.gold}55` }}>
                <DecodeText text="DeSnake" at={c("DeSnake")} durationInFrames={12} />
              </div>
              <div style={{ ...mono(28, colors.dim), marginTop: 6 }}>alphabay, relaunched 2021</div>
            </div>
          </Card>
        </Pop>
        <Chip at={c("claimed")} text="CLAIMED: ORIGINAL SECURITY CHIEF" fontSize={36} style={{ left: 730, top: 520 }} />
        <Chip at={c("one")} text="THE ONE FROM THE OLD TEAM" color={colors.text} fontSize={32} style={{ left: 730, top: 620 }} />
        <Chip at={c("never")} text="NEVER CAUGHT" color={colors.red} filled fontSize={44} style={{ left: 730, top: 712 }} />
      </Scene>

      {/* 3: new markets, like weeds */}
      <Scene from={tBeyond} to={tCat}>
        <MapPins
          width={1640}
          style={{ left: 140, top: 110 }}
          pins={[
            ...SPROUTS.slice(0, 11).map(([lon, lat], i) => ({
              lon,
              lat,
              at: c("new") + i * 4,
              color: i % 4 === 0 ? colors.gold : colors.green,
            })),
            ...SPROUTS.slice(11).map(([lon, lat], i) => ({ lon, lat, at: c("others") + i * 4, color: colors.green })),
          ]}
        />
        <Chip at={c("markets")} text="NEW MARKETS KEEP APPEARING" color={colors.green} fontSize={40} origin="center center" style={{ left: 610, top: 60 }} />
        <SeizedStamp at={c("Shut")} text="SHUT DOWN" fontSize={46} style={{ left: 760, top: 300 }} />
        <Chip at={c("others")} text="...AND OTHERS TAKE ITS PLACE" color={colors.text} fontSize={34} origin="center center" style={{ left: 660, top: 800 }} />
      </Scene>

      {/* 4: the tug of war */}
      <Scene from={tCat} to={tAlmost}>
        <TitleSlam text="CAT AND MOUSE" color={colors.amber} fontSize={190} at={c("cat")} style={{ top: 50 }} />
        <div style={{ position: "absolute", inset: 0, transform: `translateX(${sway}px)` }}>
          {/* rope */}
          <div style={{ position: "absolute", left: 420, width: 1080, top: 610, height: 12, borderRadius: 6, background: "repeating-linear-gradient(90deg, #B89B6A 0 18px, #8C734A 18px 36px)", boxShadow: "0 6px 14px rgba(0,0,0,0.6)" }} />
          <div style={{ position: "absolute", left: 950, top: 590, width: 20, height: 52, background: colors.red, borderRadius: 3 }} />
          {[0, 1].map((i) => (
            <div key={`c${i}`} style={{ position: "absolute", left: 150 + i * 230, top: 400, transform: `rotate(${-7 - Math.sin(frame / 9 + i) * 2}deg)`, transformOrigin: "center bottom" }}>
              <Cop size={370} seed={12 + i} expression="angry" look={{ x: 1, y: 0 }} />
            </div>
          ))}
          {[0, 1].map((i) => (
            <div key={`h${i}`} style={{ position: "absolute", left: 1240 + i * 230, top: 400, transform: `rotate(${7 + Math.sin(frame / 9 + i) * 2}deg)`, transformOrigin: "center bottom" }}>
              <Hooded size={370} seed={16 + i} look={{ x: -1, y: 0 }} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 958, top: 300, width: 4, height: 520, background: colors.line }} />
        <Chip at={c("police")} text="THE POLICE LEARN" color={colors.agent} fontSize={36} style={{ left: 170, top: 300 }} />
        <Chip at={c("criminals")} text="THE CRIMINALS LEARN TOO" color={colors.gold} fontSize={36} style={{ left: 1160, top: 300 }} />
        <Sfx name="whoosh" at={c("Every")} volume={0.6} />
        <Sfx name="whoosh" at={c("every", 1)} volume={0.6} />
      </Scene>

      {/* 5: a human mistake */}
      <Scene from={tAlmost} to={D} exit="glitch">
        <div
          style={{
            position: "absolute",
            left: drift,
            top: 120,
            whiteSpace: "nowrap",
            ...mono(120, colors.green),
            fontWeight: 700,
            opacity: 0.2 + 0.1 * random(`fl-${Math.floor(frame / 3)}`),
            textShadow: `0 0 40px ${colors.green}`,
          }}
        >
          pimp_alex_91@hotmail.com
        </div>
        <Chip at={c("same")} text="THE SAME THING GETS THEM" color={colors.text} fontSize={40} origin="center center" style={{ left: 640, top: 330 }} />
        <StrikeLine at={c("encryption") - 8} text="THE ENCRYPTION" top={440} />
        <StrikeLine at={c("code") - 8} text="THE CODE" top={530} />
        <TitleSlam text="A HUMAN MISTAKE" color={colors.red} fontSize={250} at={c("human")} style={{ top: 600 }} />
        <Flash at={c("human")} peak={0.4} />
      </Scene>
    </>
  );
};
