import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  BlobCharacter,
  CamelLogo,
  Cazes,
  Chip,
  CoinIcon,
  Counter,
  Glitch,
  GlitchBars,
  MarketLogo,
  OnionLogo,
  Pop,
  RossBlob,
  Scene,
  SeizedStamp,
  Sfx,
  Terminal,
  TitleSlam,
  mono,
} from "../components";
import { useClip } from "./words";

// the camel breaks into these pieces (clip-path polygons, % of its box)
const SHARDS = [
  "polygon(0% 0%, 46% 0%, 50% 40%, 0% 52%)",
  "polygon(46% 0%, 100% 0%, 100% 38%, 50% 40%)",
  "polygon(0% 52%, 50% 40%, 46% 100%, 0% 100%)",
  "polygon(50% 40%, 100% 38%, 100% 100%, 46% 100%)",
];
const SHARD_DIR = [
  [-1, -0.7],
  [1, -0.8],
  [-0.9, 0.8],
  [1, 0.7],
];

const MARKETS = [
  { name: "SILK ROAD 2", cue: ["Silk", 2] as const, stamp: "SEIZED", stampCue: "raided" },
  { name: "AGORA", cue: ["Agora", 0] as const, stamp: "GONE", stampCue: "vanished" },
  { name: "EVOLUTION", cue: ["Evolution", 0] as const, stamp: "SCAMMED", stampCue: "exit" },
];

export const Clip2: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(2);

  const tCamel = c("In 2013");
  const tBut = c("But");
  const tMarkets = c("Silk", 2) - 6;
  const tTrust = c("By 2014");
  const tNew = c("And in");

  const rw = frame - c("go");
  const rewinding = rw >= 0 && rw < 30;
  const rwAmount = rewinding ? 0.25 + 0.3 * Math.sin((rw / 30) * Math.PI) : 0;
  const shatterAt = c("didn't");
  const shatter = sp(frame, fps, shatterAt, springs.smooth, 30);
  const pulse = 0.75 + 0.25 * Math.sin(frame / 7);

  return (
    <>
      {/* 1a: rewind to where the last story ended */}
      <Scene from={0} to={tCamel}>
        <Terminal
          style={{ position: "absolute", left: 0, right: 0, top: 210 }}
          align="center"
          fontSize={46}
          color={colors.text}
          showCursor={frame < c("go")}
          lines={[{ text: "to understand alphabay...", prompt: "> ", at: 3, durationInFrames: 26 }]}
        />
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
          <Glitch amount={rwAmount} seed="rw2">
            <Counter from={2017} to={2013} at={c("go")} durationInFrames={30} fontSize={330} format={(n) => String(n)} color={rw >= 0 ? colors.amber : colors.green} />
          </Glitch>
        </div>
        <Chip at={c("go")} text="◀◀ REWIND" fontSize={46} origin="center center" style={{ left: 790, top: 740 }} sound="whoosh" />
        <GlitchBars amount={rwAmount * 1.6} seed="rw2-bars" />
      </Scene>

      {/* 1b: Silk Road falls */}
      <Scene from={tCamel} to={tBut}>
        <Pop at={tCamel} style={{ left: 960 - 280, top: 150 }}>
          <CamelLogo size={560} cracked={frame >= c("took")} />
        </Pop>
        <div style={{ position: "absolute", left: 0, right: 0, top: 610, textAlign: "center", fontFamily: fonts.display, fontSize: 120, color: colors.green, letterSpacing: "0.06em" }}>SILK ROAD</div>
        <Chip at={c("2013")} text="2013" color={colors.text} fontSize={44} style={{ left: 200, top: 200 }} />
        <Chip at={c("FBI")} text="FBI TAKEDOWN" color={colors.agent} filled fontSize={40} style={{ left: 200, top: 300 }} />
        <SeizedStamp at={c("took") + 6} fontSize={130} style={{ left: 700, top: 300 }} />
        <Pop at={c("founder")} origin="center bottom" style={{ left: 1420, top: 250 }}>
          <div style={{ opacity: 0.8 }}>
            <RossBlob size={300} expression="scared" sweat={false} shake={0} />
          </div>
        </Pop>
        <Chip at={c("prison")} text="FOUNDER: LIFE IN PRISON" color={colors.red} fontSize={32} origin="center center" style={{ left: 1310, top: 570 }} sound="door" />
      </Scene>

      {/* 2: it did the opposite */}
      <Scene from={tBut} to={tMarkets}>
        {/* the camel shatters */}
        {shatter < 0.999
          ? SHARDS.map((clip, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 960 - 280 + SHARD_DIR[i][0] * shatter * 520,
                  top: 150 + SHARD_DIR[i][1] * shatter * 330,
                  width: 560,
                  height: 420,
                  clipPath: clip,
                  transform: `rotate(${SHARD_DIR[i][0] * shatter * 50}deg)`,
                  opacity: 1 - shatter,
                }}
              >
                <CamelLogo size={560} cracked />
              </div>
            ))
          : null}
        <Sfx name="crash" at={shatterAt} volume={0.7} />
        {/* onions sprout from the pieces */}
        {new Array(26).fill(0).map((_, i) => {
          const at = shatterAt + 10 + i * 2.6;
          const s = sp(frame, fps, at, springs.pop);
          if (s <= 0.001) return null;
          const x = 120 + random(`on-x-${i}`) * 1620;
          const y = 100 + random(`on-y-${i}`) * 640;
          const size = 56 + random(`on-s-${i}`) * 70;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y + Math.sin(frame / 18 + i) * 6, transform: `scale(${s})`, opacity: 0.5 + 0.5 * random(`on-o-${i}`) }}>
              <OnionLogo size={size} color={i % 6 === 0 ? colors.amber : colors.green} />
            </div>
          );
        })}
        <Sfx name="pop" at={shatterAt + 10} />
        <Sfx name="pop" at={shatterAt + 26} volume={0.7} />
        <Sfx name="pop" at={shatterAt + 44} volume={0.7} />
        <TitleSlam text="IT DID THE OPPOSITE" color={colors.amber} fontSize={190} at={c("opposite")} style={{ top: 330 }} />
        <Chip at={c("Copycats")} text="COPYCATS EVERYWHERE" color={colors.green} filled fontSize={44} origin="center center" style={{ left: 670, top: 600 }} />
      </Scene>

      {/* 3: the copycats fall one by one */}
      <Scene from={tMarkets} to={tTrust}>
        {MARKETS.map((m, i) => {
          const at = c(m.cue[0], m.cue[1]);
          const stampAt = c(m.stampCue);
          const dead = frame >= stampAt;
          return (
            <React.Fragment key={m.name}>
              <Pop at={at} from="left" style={{ left: 260, top: 110 + i * 240 }} sound="pop">
                <div style={{ opacity: dead ? 0.4 : 1, filter: dead ? "grayscale(1)" : undefined }}>
                  <MarketLogo name={m.name} size={120} />
                </div>
              </Pop>
              <SeizedStamp at={stampAt} text={m.stamp} fontSize={96} rotate={-8 + i * 5} style={{ left: 1180, top: 120 + i * 240 }} />
            </React.Fragment>
          );
        })}
        <Chip at={c("fell")} text="ONE BY ONE, THEY FELL" color={colors.red} fontSize={34} origin="center center" style={{ left: 1260, top: 40 }} />
        {/* the owners vanish with the money */}
        {frame >= c("money") - 10
          ? [0, 1, 2, 3, 4, 5].map((i) => {
              const t = interpolate(frame, [c("money") - 10 + i * 2, c("money") + 24 + i * 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              return (
                <div key={i} style={{ position: "absolute", left: 900 + i * 60 + t * 900, top: 620 - t * 300 - Math.sin(t * Math.PI) * 120, opacity: t > 0 ? 1 - t : 0 }}>
                  <CoinIcon size={70} />
                </div>
              );
            })
          : null}
        <Sfx name="coin" at={c("money") - 6} />
      </Scene>

      {/* 4: a trust problem */}
      <Scene from={tTrust} to={tNew}>
        {new Array(9).fill(0).map((_, i) => {
          const x = 90 + i * 196 + Math.sin(frame / 40 + i * 1.7) * 50;
          const y = 400 + (i % 3) * 80 + Math.cos(frame / 33 + i * 2.1) * 34;
          return (
            <Pop key={i} at={tTrust + i * 2} origin="center bottom" style={{ left: x, top: y }}>
              <div style={{ opacity: 0.85 }}>
                <BlobCharacter color={colors.extras[i % 4]} size={220} seed={20 + i} look={{ x: Math.sin(frame / 25 + i), y: 0 }} />
              </div>
              <div style={{ position: "absolute", left: 136, top: 126 }}>
                <CoinIcon size={56} />
              </div>
              <div style={{ position: "absolute", left: 82, top: -44, ...mono(44, colors.amber), fontWeight: 700, opacity: 0.5 + 0.5 * Math.sin(frame / 10 + i) }}>?</div>
            </Pop>
          );
        })}
        <TitleSlam text="A TRUST PROBLEM" color={colors.amber} fontSize={210} at={c("trust")} style={{ top: 60 }} />
        <Chip at={c("shut")} text="WON'T GET SHUT DOWN" color={colors.text} fontSize={36} style={{ left: 380, top: 290 }} />
        <Chip at={c("rob")} text="WON'T ROB YOU" color={colors.text} fontSize={36} style={{ left: 1040, top: 290 }} />
      </Scene>

      {/* 5: AlphaBay appears */}
      <Scene from={tNew} to={D} exit="glitch">
        <Terminal
          style={{ position: "absolute", left: 0, right: 0, top: 90 }}
          align="center"
          fontSize={50}
          lines={[{ text: "DECEMBER 2014", at: c("December"), durationInFrames: 22 }]}
        />
        <div style={{ position: "absolute", left: 460, top: 150, width: 1000, height: 420, background: `radial-gradient(ellipse at center, ${colors.gold}55, rgba(0,0,0,0) 65%)`, opacity: frame >= c("new") ? pulse * 0.6 : 0 }} />
        <Pop at={c("new")} from="slam" style={{ left: 0, right: 0, top: 220, display: "flex", justifyContent: "center" }} sound="riser">
          <MarketLogo name="ALPHABAY" mark="alpha" size={210} />
        </Pop>
        <Pop at={c("owner")} origin="center bottom" style={{ left: 420, top: 520 }}>
          <Cazes size={300} sunglasses />
        </Pop>
        <Pop at={c("owner")} from="left" style={{ left: 760, top: 560 }}>
          <span style={{ ...mono(38, colors.dim), letterSpacing: "0.16em" }}>OWNER:</span>
        </Pop>
        <TitleSlam text="ALPHA02" color={colors.gold} fontSize={250} at={c("Alpha")} style={{ left: 750, right: "auto", top: 600, alignItems: "flex-start" }} />
      </Scene>
    </>
  );
};
