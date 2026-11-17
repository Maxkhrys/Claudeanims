import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  Car,
  Card,
  Cazes,
  Chip,
  Cop,
  Counter,
  Flash,
  Glitch,
  MarketLogo,
  NameTag,
  Pop,
  RossBlob,
  Scene,
  Sfx,
  Terminal,
  TitleSlam,
  mono,
} from "../components";
import { useClip } from "./words";

const EMAIL = "pimp_alex_91@hotmail.com";
const ROSS_EMAIL = "rossulbricht@gmail.com";

/** Night pool with a slow shimmer. */
const Pool: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {/* villa wall + warm windows */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 560, background: "linear-gradient(to bottom, #0A0D10, #10161B)" }} />
      {[220, 520, 1340, 1620].map((x, i) => (
        <div key={x} style={{ position: "absolute", left: x, top: 120 + (i % 2) * 30, width: 150, height: 210, borderRadius: 6, background: colors.gold, opacity: 0.1 + 0.03 * Math.sin(frame / 20 + i), boxShadow: `0 0 80px ${colors.gold}` }} />
      ))}
      {/* deck */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, bottom: 0, background: "linear-gradient(to bottom, #1A2026, #0B0F12)" }} />
      {/* water */}
      <div style={{ position: "absolute", left: 620, top: 640, width: 1500, height: 300, borderRadius: 26, overflow: "hidden", background: "linear-gradient(to bottom, #0F6D78, #0A3A47)", border: "6px solid #2A343D", boxShadow: "0 0 120px rgba(31,190,200,0.35)" }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -200 + ((frame * (0.6 + i * 0.1) + i * 260) % 1900),
              top: 30 + i * 44,
              width: 240,
              height: 6,
              borderRadius: 3,
              background: "#9CF3F0",
              opacity: 0.22 + 0.12 * Math.sin(frame / 9 + i),
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Front gate that buckles on impact. `hit` goes 0 -> 1. */
const Gate: React.FC<{ hit: number }> = ({ hit }) => (
  <div style={{ position: "absolute", left: 1010, top: 330, width: 520, height: 430 }}>
    {/* posts */}
    <div style={{ position: "absolute", left: -46, top: -30, width: 46, height: 460, background: "#232B33", borderRadius: 6 }} />
    <div style={{ position: "absolute", left: 520, top: -30, width: 46, height: 460, background: "#232B33", borderRadius: 6 }} />
    {[0, 1].map((side) => (
      <div
        key={side}
        style={{
          position: "absolute",
          left: side * 260,
          top: 0,
          width: 256,
          height: 430,
          border: "8px solid #59636D",
          borderRadius: 6,
          display: "flex",
          justifyContent: "space-around",
          transformOrigin: side === 0 ? "left center" : "right center",
          transform: `perspective(900px) rotateY(${(side === 0 ? -1 : 1) * hit * 58}deg) skewY(${(side === 0 ? 1 : -1) * hit * 7}deg)`,
          background: "rgba(7,9,11,0.5)",
        }}
      >
        {[0, 1, 2, 3, 4].map((b) => (
          <div key={b} style={{ width: 9, height: "100%", background: "#59636D" }} />
        ))}
      </div>
    ))}
  </div>
);

export const Clip1: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(1);

  const tOwner = c("Its");
  const tStudied = c("He'd");
  const tJuly = c("July");
  const tCar = c("A car");
  const tLaptop = c("His laptop");
  const tWeek = c("week");

  // 1: the email
  const lift = sp(frame, fps, c("That"), springs.smooth, 22);
  const glow = sp(frame, fps, c("That") - 4, springs.smooth, 14);

  // 3: the two emails slide together
  const slide = sp(frame, fps, c("And then"), springs.smooth, 34);
  const same = frame - c("exact");
  const sameGlitch = same >= 0 ? Math.exp(-same / 6) : 0;

  // 4: crash
  const impact = c("smashes") + 8;
  const drive = interpolate(frame, [tCar + 2, impact], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const carX = -520 + drive * drive * 1230;
  const hit = sp(frame, fps, impact, springs.pop);
  const shakeAmp = frame >= impact ? 34 * Math.exp(-(frame - impact) / 7) : 0;
  const sx = (random(`cr-x-${frame}`) - 0.5) * 2 * shakeAmp;
  const sy = (random(`cr-y-${frame}`) - 0.5) * 2 * shakeAmp;
  const run = sp(frame, fps, c("runs"), springs.smooth, 26);
  const cops = frame >= c("police");
  const strobe = cops ? (Math.floor(frame / 5) % 2 === 0 ? colors.red : colors.agent) : "transparent";
  const dimEnd = sp(frame, fps, tWeek - 6, springs.smooth, 18);

  return (
    <>
      {/* 1: the address, typed slowly */}
      <Scene from={0} to={tOwner}>
        {frame >= c("brought") ? (
          <Pop at={c("brought")} from="up" style={{ left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
            <div style={{ opacity: 0.95 }}>
              <MarketLogo name="ALPHABAY" mark="alpha" size={190} />
            </div>
          </Pop>
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 430 - lift * 290,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1 - lift * 0.42})`,
            filter: `drop-shadow(0 0 ${glow * 34}px ${colors.green})`,
          }}
        >
          <Terminal
            fontSize={112}
            color={glow > 0.5 ? colors.green : colors.text}
            cursorColor={colors.green}
            lines={[{ text: EMAIL, at: 4, durationInFrames: c("That") - 16 }]}
          />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
          {frame >= c("billion-dollar") ? (
            <Counter to={1000000000} prefix="$" suffix="+" at={c("billion-dollar")} durationInFrames={c("The biggest") - c("billion-dollar")} fontSize={150} color={colors.gold} />
          ) : null}
        </div>
        <Chip at={c("biggest")} text="THE BIGGEST BLACK MARKET IN INTERNET HISTORY" fontSize={36} origin="center center" style={{ left: 410, top: 760 }} />
      </Scene>

      {/* 2: the owner */}
      <Scene from={tOwner} to={tStudied}>
        <Pool />
        <Pop at={c("Lamborghini")} from="right" style={{ left: 1160, top: 330 }} sound="whoosh">
          <Car type="supercar" size={620} color={colors.gold} />
        </Pop>
        <Pop at={c("Porsche")} from="right" style={{ left: 660, top: 410 }} sound="whoosh">
          <Car type="sedan" size={440} color={colors.text} />
        </Pop>
        <Pop at={tOwner + 2} origin="center bottom" style={{ left: 170, top: 300 }}>
          <Cazes size={440} sunglasses />
          <NameTag text="ALPHA02" color={colors.gold} fontSize={30} />
        </Pop>
        <Chip at={c("25-year-old")} text="25 YEARS OLD" color={colors.text} fontSize={38} style={{ left: 620, top: 90 }} />
        <Chip at={c("genius")} text="COMPUTER GENIUS" color={colors.text} fontSize={38} style={{ left: 980, top: 90 }} />
        <Chip at={c("millionaire")} text="MILLIONAIRE" color={colors.gold} filled fontSize={46} style={{ left: 620, top: 190 }} sound="coin" />
        <Chip at={c("houses")} text="HOUSES ON 3 CONTINENTS" color={colors.gold} fontSize={36} style={{ left: 1040, top: 198 }} />
      </Scene>

      {/* 3: he'd studied Ross's mistakes */}
      <Scene from={tStudied} to={tJuly} exit="glitch">
        <Pop at={tStudied} origin="center bottom" style={{ left: 190, top: 330 }}>
          <Cazes size={380} look={{ x: 0.8, y: 0 }} />
        </Pop>
        <Pop at={c("Silk")} origin="center bottom" style={{ left: 1400, top: 330 }}>
          <div style={{ opacity: 0.45 }}>
            <RossBlob size={380} look={{ x: -0.8, y: 0 }} />
          </div>
        </Pop>
        <Chip at={c("studied")} text="STUDIED EVERY MISTAKE" color={colors.gold} fontSize={36} origin="center center" style={{ left: 700, top: 360 }} />
        <Chip at={c("sure")} text="&quot;I'LL NEVER MAKE THEM&quot;" color={colors.text} fontSize={36} origin="center center" style={{ left: 690, top: 450 }} />
        {/* the two addresses */}
        <Glitch amount={sameGlitch} seed="same" style={{ position: "absolute", inset: 0 }}>
          <Pop at={tStudied + 8} from="up" style={{ left: interpolate(slide, [0, 1], [110, 570]), top: interpolate(slide, [0, 1], [740, 590]) }}>
            <div style={{ ...mono(46, same >= 0 ? colors.red : colors.gold), fontWeight: 700, padding: "10px 24px", border: `3px solid ${same >= 0 ? colors.red : colors.gold}`, borderRadius: 8, background: "rgba(7,9,11,0.9)", width: 780, textAlign: "center" }}>
              {EMAIL}
            </div>
          </Pop>
          <Pop at={c("Silk") + 6} from="up" style={{ left: interpolate(slide, [0, 1], [1030, 570]), top: interpolate(slide, [0, 1], [740, 700]) }}>
            <div style={{ ...mono(46, same >= 0 ? colors.red : colors.green), fontWeight: 700, padding: "10px 24px", border: `3px solid ${same >= 0 ? colors.red : colors.green}`, borderRadius: 8, background: "rgba(7,9,11,0.9)", width: 780, textAlign: "center" }}>
              {ROSS_EMAIL}
            </div>
          </Pop>
        </Glitch>
        <TitleSlam text="SAME MISTAKE" color={colors.red} fontSize={290} at={c("exact")} style={{ top: 30 }} />
        <Flash at={c("exact")} peak={0.5} />
      </Scene>

      {/* 4: Bangkok */}
      <Scene from={tJuly} to={D} exit="glitch">
        <Scene from={tJuly} to={tLaptop} exit="cut">
          <div style={{ position: "absolute", inset: 0, transform: `translate(${sx}px, ${sy}px)` }}>
            {frame >= tCar - 4 ? (
              <>
                {/* house */}
                <div style={{ position: "absolute", left: 1560, top: 150, width: 500, height: 610, background: "linear-gradient(to bottom, #151B21, #0D1216)", borderLeft: "4px solid #2A343D" }} />
                <div style={{ position: "absolute", left: 1640, top: 430, width: 150, height: 330, borderRadius: "8px 8px 0 0", background: colors.gold, opacity: 0.16, boxShadow: `0 0 90px ${colors.gold}` }} />
                {/* road */}
                <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: 0, background: "linear-gradient(to bottom, #161C22, #07090B 60%)", borderTop: "3px solid rgba(255,255,255,0.08)" }} />
                <Gate hit={hit} />
                {/* police strobe */}
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 30% 60%, ${strobe}, rgba(0,0,0,0) 65%)`, opacity: cops ? 0.22 : 0 }} />
                <div style={{ position: "absolute", left: carX, top: 560 }}>
                  <Car type="sedan" size={470} color="#3A444E" />
                </div>
                {/* debris */}
                {frame >= impact
                  ? new Array(10).fill(0).map((_, i) => {
                      const t = (frame - impact) / 26;
                      if (t > 1) return null;
                      const a = -Math.PI / 2 + (random(`db-a-${i}`) - 0.5) * 2.4;
                      const v = 240 + random(`db-v-${i}`) * 300;
                      return (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            left: 1130 + Math.cos(a) * v * t,
                            top: 600 + Math.sin(a) * v * t + 380 * t * t,
                            width: 14,
                            height: 14,
                            background: i % 2 ? "#59636D" : colors.amber,
                            transform: `rotate(${t * 500 + i * 40}deg)`,
                            opacity: 1 - t,
                          }}
                        />
                      );
                    })
                  : null}
                {/* Cazes runs out */}
                {frame >= c("runs") ? (
                  <div style={{ position: "absolute", left: interpolate(run, [0, 1], [1720, 1300]), top: 470 - Math.abs(Math.sin(run * 16)) * 18 }}>
                    <Cazes size={300} expression={cops ? "scared" : "calm"} look={{ x: -0.9, y: 0 }} />
                  </div>
                ) : null}
                {[0, 1, 2].map((i) => (
                  <Pop key={i} at={c("police") + i * 3} origin="center bottom" style={{ left: 40 + i * 215, top: 470 + (i === 1 ? 30 : 0) }}>
                    <Cop size={290} seed={12 + i} look={{ x: 0.9, y: 0 }} />
                  </Pop>
                ))}
                <Chip at={c("police") + 4} text="POLICE" color={colors.agent} filled fontSize={44} style={{ left: 250, top: 370 }} sound="click" />
              </>
            ) : null}
          </div>
          <Terminal
            style={{ position: "absolute", left: 120, top: 90 }}
            fontSize={74}
            lines={[
              { text: "JULY 5, 2017.", at: tJuly + 2, durationInFrames: 26 },
              { text: "BANGKOK.", at: c("Bangkok"), durationInFrames: 14 },
            ]}
          />
          <Sfx name="crash" at={impact} volume={1.4} />
          <Flash at={impact} color={colors.text} peak={0.7} durationInFrames={10} />
        </Scene>

        {/* the laptop, still open */}
        <Scene from={tLaptop} to={D} exit="cut">
          <div style={{ position: "absolute", inset: 0, opacity: 1 - dimEnd * 0.96 }}>
            <Pop at={tLaptop} from="up" style={{ left: 360, top: 110 }}>
              <Card accent={colors.gold} style={{ width: 1200, padding: "26px 44px 36px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <MarketLogo name="ALPHABAY" mark="alpha" size={56} />
                  <span style={{ ...mono(26, colors.green), fontWeight: 700 }}>● logged in: alpha02</span>
                </div>
                <div style={{ fontFamily: fonts.display, fontSize: 190, lineHeight: 1, color: colors.text, marginTop: 20, textAlign: "center" }}>ADMIN PANEL</div>
                <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
                  {["SERVERS", "WALLETS", "USERS", "PASSWORDS"].map((t) => (
                    <div key={t} style={{ flex: 1, padding: "16px 0", textAlign: "center", border: `2px solid ${colors.line}`, borderRadius: 8, ...mono(26, colors.dim), fontWeight: 700 }}>
                      {t}
                    </div>
                  ))}
                </div>
              </Card>
            </Pop>
            <Chip at={c("still")} text="STILL OPEN" color={colors.red} filled fontSize={54} origin="center center" style={{ left: 790, top: 690 }} />
          </div>
          <Pop at={tWeek} from="up" style={{ left: 0, right: 0, top: 440, textAlign: "center" }}>
            <span style={{ ...mono(64, colors.text), letterSpacing: "0.12em" }}>one week later...</span>
          </Pop>
        </Scene>
      </Scene>
    </>
  );
};
