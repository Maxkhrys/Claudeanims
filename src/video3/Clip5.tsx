import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  BlobCharacter,
  BrandTag,
  Card,
  Chip,
  CoinIcon,
  Counter,
  Flash,
  Pop,
  Scene,
  SeizedStamp,
  Sfx,
  Terminal,
  TitleSlam,
  White,
  mono,
} from "../components";
import { useClip } from "./words";

/** A rack of servers with blinking lights. `breach` 0..1 turns the lights red. */
const Rack: React.FC<{ left: number; top: number; seed: number; breach: number }> = ({ left, top, seed, breach }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left, top, width: 150, height: 330, borderRadius: 10, background: "#0E1318", border: "3px solid #232C36", padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
      {new Array(8).fill(0).map((_, i) => {
        const on = random(`led-${seed}-${i}-${Math.floor(frame / 5)}`) > 0.35;
        const red = breach > random(`br-${seed}-${i}`);
        const col = red ? colors.red : colors.green;
        return (
          <div key={i} style={{ height: 30, borderRadius: 4, background: "#161D24", display: "flex", alignItems: "center", gap: 6, paddingLeft: 8 }}>
            <div style={{ width: 9, height: 9, borderRadius: 5, background: col, opacity: on ? 1 : 0.25, boxShadow: on ? `0 0 10px ${col}` : "none" }} />
            <div style={{ width: 9, height: 9, borderRadius: 5, background: col, opacity: on ? 0.3 : 0.9 }} />
            <div style={{ flex: 1, height: 4, marginRight: 8, background: "#232C36" }} />
          </div>
        );
      })}
    </div>
  );
};

/** Tiny SIM card. */
const Sim: React.FC<{ color: string; size?: number }> = ({ color, size = 34 }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 40 50">
    <path d="M 4 4 H 26 L 36 14 V 46 H 4 Z" fill={colors.panelLight} stroke={color} strokeWidth={3} strokeLinejoin="round" />
    <rect x={11} y={22} width={18} height={16} rx={3} fill={color} />
  </svg>
);

/** White at his desk, lit by a monitor. `window2` 0..1 opens a second window. */
const Desk: React.FC<{ window2: number }> = ({ window2 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 150, top: 250, width: 760, height: 600 }}>
      <div style={{ position: "absolute", left: 250, top: 20, width: 620, height: 520, background: "radial-gradient(ellipse at 50% 45%, rgba(57,255,136,0.28), rgba(0,0,0,0) 65%)" }} />
      <div style={{ position: "absolute", left: 20, top: 130 }}>
        <White size={380} look={{ x: 0.9, y: 0.1 }} lightColor={colors.green} lightAmount={0.5} />
      </div>
      {/* monitor */}
      <div style={{ position: "absolute", left: 390, top: 110, width: 360, height: 250, borderRadius: 12, background: "#0A1210", border: "6px solid #232C36", overflow: "hidden", boxShadow: "0 0 60px rgba(57,255,136,0.25)" }}>
        <div style={{ position: "absolute", left: 16, top: 16, width: 200, height: 120, borderRadius: 6, border: `2px solid ${colors.greenDim}`, padding: 8 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 8, width: 60 + ((i * 53 + Math.floor(frame / 9)) % 100), background: colors.greenDim, marginBottom: 8, borderRadius: 2 }} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 70,
            width: 230,
            height: 150,
            borderRadius: 6,
            border: `2px solid ${colors.green}`,
            background: "#0D1A16",
            padding: 10,
            transform: `scale(${window2})`,
            transformOrigin: "left top",
          }}
        >
          <div style={{ ...mono(18, colors.green), fontWeight: 700 }}>&gt; next target_</div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: 8, width: 90 + i * 40, background: colors.green, opacity: 0.6, marginTop: 10, borderRadius: 2 }} />
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 362, width: 60, height: 40, background: "#232C36" }} />
      {/* desk */}
      <div style={{ position: "absolute", left: -40, top: 400, width: 880, height: 26, borderRadius: 6, background: "#1B232C", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 420, top: 372, width: 250, height: 22, borderRadius: 5, background: "#2A343D" }} />
    </div>
  );
};

export const Clip5: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(5);

  const tInside = c("They got");
  const tMoney = c("Then");
  const tDemand = c("And on");
  const tAfter = c("It didn't");

  const breach = sp(frame, fps, c("inside"), springs.smooth, 50);
  const swapP = sp(frame, fps, c("more"), springs.smooth, c("moved") - c("more") + 20);
  const drain = Math.min(1, Math.max(0, (frame - c("disappear")) / (c("accounts") - c("disappear") + 10)));
  const win2 = sp(frame, fps, c("He had"), springs.pop);

  return (
    <>
      {/* A: a bigger target */}
      <Scene from={0} to={tInside}>
        <Terminal style={{ position: "absolute", left: 150, top: 110 }} fontSize={64} lines={[{ text: "SUMMER 2021", at: c("summer") - 6, durationInFrames: 22 }]} />
        <Pop at={c("White")} origin="center bottom" style={{ left: 190, top: 380 }}>
          <White size={360} look={{ x: 0.9, y: -0.2 }} />
        </Pop>
        <Chip at={c("bigger") - 10} text="SOMETHING MUCH BIGGER" fontSize={36} style={{ left: 150, top: 250 }} />
        <Pop at={c("BT")} from="slam" sound="slam" style={{ left: 780, top: 250 }}>
          <BrandTag name="BT" size={230} />
        </Pop>
        <Chip at={c("British")} text="THE BRITISH TELECOMS GIANT" color={colors.text} fontSize={34} style={{ left: 790, top: 500 }} />
        <Pop at={c("EE")} from="slam" sound="slam" style={{ left: 1330, top: 250 }}>
          <BrandTag name="EE" size={230} />
        </Pop>
        <Chip at={c("mobile")} text="ITS MOBILE NETWORK" color={colors.text} fontSize={34} style={{ left: 1340, top: 580 }} />
        <Pop at={c("aimed")} from="left" style={{ left: 560, top: 640 }}>
          <span style={{ ...mono(40, colors.amber), fontWeight: 700 }}>the same trick ━━━▶</span>
        </Pop>
      </Scene>

      {/* B: inside, and 900 numbers */}
      <Scene from={tInside} to={tMoney}>
        <div style={{ position: "absolute", left: 110, top: 80, ...mono(34, colors.dim) }}>&gt; inside the company's systems</div>
        {[0, 1, 2, 3].map((i) => (
          <Rack key={i} left={110 + i * 175} top={190} seed={i} breach={breach} />
        ))}
        <Chip at={c("inside")} text="ACCESS: GRANTED" color={colors.red} filled fontSize={36} style={{ left: 200, top: 560 }} />
        <Sfx name="error" at={c("inside")} volume={0.7} />
        <Pop at={c("more") - 8} from="up" style={{ left: 880, top: 150 }}>
          <Card accent={colors.amber} style={{ width: 900, padding: "26px 40px 30px" }}>
            <div style={{ ...mono(28, colors.dim), letterSpacing: "0.16em" }}>PHONE NUMBERS MOVED TO HACKERS' SIM CARDS</div>
            <div style={{ height: 210 }}>{frame >= c("more") ? <Counter to={900} suffix="+" at={c("more")} durationInFrames={c("numbers") - c("more") + 16} fontSize={200} color={colors.amber} /> : null}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 16, height: 150 }}>
              {new Array(40).fill(0).map((_, i) => (
                <Sim key={i} color={swapP > (i + 1) / 41 ? colors.red : colors.greenDim} size={30} />
              ))}
            </div>
          </Card>
        </Pop>
        <Chip at={c("SIM")} text="USED IN 29 HANDSETS" color={colors.text} fontSize={30} style={{ left: 1400, top: 720 }} />
        <Chip at={c("quietly")} text="QUIETLY" color={colors.dim} fontSize={30} style={{ left: 890, top: 720 }} />
      </Scene>

      {/* C: the money disappears */}
      <Scene from={tMoney} to={tDemand}>
        <TitleSlam text="THE MONEY DISAPPEARED" color={colors.red} fontSize={150} at={c("disappear")} style={{ top: 60 }} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = 130 + (i % 3) * 370;
          const y = 270 + Math.floor(i / 3) * 250;
          const left = Math.max(0, 1 - drain * (1.02 + (i % 3) * 0.1));
          return (
            <Pop key={i} at={tMoney + i * 3} style={{ left: x, top: y }}>
              <Card style={{ width: 330, padding: "18px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <svg width={46} height={46} viewBox="0 0 34 34">
                    <circle cx={17} cy={11} r={6.5} fill={colors.text} />
                    <path d="M 4 32 C 4 21 10 19 17 19 C 24 19 30 21 30 32 Z" fill={colors.text} />
                  </svg>
                  <div style={{ ...mono(24, colors.dim) }}>customer account</div>
                </div>
                <div style={{ height: 18, borderRadius: 9, background: colors.line, marginTop: 14, overflow: "hidden" }}>
                  <div style={{ width: `${left * 100}%`, height: "100%", background: left < 0.3 ? colors.red : colors.green }} />
                </div>
                <div style={{ ...mono(32, left < 0.05 ? colors.red : colors.text), fontWeight: 700, marginTop: 10 }}>{left < 0.05 ? "EMPTY" : `${Math.round(left * 100)}%`}</div>
              </Card>
            </Pop>
          );
        })}
        {/* coins streaming to the attackers */}
        {frame >= c("disappear")
          ? new Array(9).fill(0).map((_, i) => {
              const t = ((frame - c("disappear") + i * 11) % 66) / 66;
              const sx = 300 + (i % 3) * 370;
              const sy = 380 + (Math.floor(i / 3) % 2) * 250;
              return (
                <div key={i} style={{ position: "absolute", left: interpolate(t, [0, 1], [sx, 1530]), top: interpolate(t, [0, 1], [sy, 520]) - Math.sin(t * Math.PI) * 90, opacity: Math.sin(t * Math.PI) }}>
                  <CoinIcon size={50} />
                </div>
              );
            })
          : null}
        <Pop at={tMoney + 8} origin="center bottom" style={{ left: 1400, top: 360 }}>
          <BlobCharacter color="#2B333C" size={360} seed={21} eyeColor={colors.red} look={{ x: -0.9, y: 0 }} />
        </Pop>
        <Chip at={c("Cash")} text="CASH" color={colors.green} fontSize={36} style={{ left: 1300, top: 250 }} />
        <Chip at={c("cryptocurrency")} text="CRYPTOCURRENCY" fontSize={36} style={{ left: 1460, top: 250 }} />
        <Sfx name="coin" at={c("taken")} volume={0.7} />
      </Scene>

      {/* D: the ransom demand */}
      <Scene from={tDemand} to={tAfter}>
        <Terminal style={{ position: "absolute", left: 150, top: 90 }} fontSize={60} lines={[{ text: "AUGUST 1, 2021", at: c("August") - 4, durationInFrames: 22 }]} />
        <Pop at={c("sent") - 6} from="up" style={{ left: 310, top: 220 }}>
          <Card accent={colors.red} style={{ width: 1300, padding: "30px 50px 40px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...mono(28, colors.dim), letterSpacing: "0.14em" }}>
              <span>TO: BT</span>
              <span>A DEMAND</span>
            </div>
            <div style={{ height: 250, display: "flex", justifyContent: "center", alignItems: "center" }}>
              {frame >= c("4") ? <Counter to={4000000} prefix="$" at={c("4")} durationInFrames={24} fontSize={210} color={colors.amber} /> : <span style={{ ...mono(120, colors.dim) }}>$ ?</span>}
            </div>
            <Pop at={c("Or")} from="up" style={{ position: "relative" }}>
              <div style={{ fontFamily: fonts.display, fontSize: 84, lineHeight: 1, color: colors.red }}>OR THE STOLEN DATA GETS RELEASED</div>
            </Pop>
          </Card>
        </Pop>
        <SeizedStamp at={c("pay")} text="NOT PAID" fontSize={190} rotate={-10} style={{ left: 560, top: 330 }} />
        <Flash at={c("pay")} peak={0.35} durationInFrames={10} />
      </Scene>

      {/* E: the real lesson */}
      <Scene from={tAfter} to={D} exit="glitch">
        <Pop at={tAfter} origin="center bottom" style={{ left: 0, top: 0 }}>
          <Desk window2={win2} />
        </Pop>
        <Sfx name="click" at={c("He had")} />
        <Pop at={c("matter") - 6} from="right" style={{ left: 1010, top: 200 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 110, color: colors.text }}>IT DIDN'T MATTER.</span>
        </Pop>
        <Chip at={c("valuable")} text="WORTH MORE THAN $4,000,000:" fontSize={32} style={{ left: 1015, top: 350 }} />
        <TitleSlam text="IT WORKED." color={colors.green} fontSize={215} at={c("worked") - 4} style={{ left: 960, right: 30, top: 450 }} />
      </Scene>
    </>
  );
};
