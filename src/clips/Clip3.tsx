import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { z } from "zod";
import transcript from "../../public/audio/clip3.json";
import { colors, fonts, springs } from "../theme";
import { captionNames, sp, useCues, type Word } from "../lib/timing";
import {
  BlobCharacter,
  Card,
  Chemist,
  Chip,
  ClipShell,
  CoinIcon,
  Counter,
  DecodeText,
  Dpr,
  DprDesk,
  Flash,
  IconFlood,
  NameTag,
  Parcel,
  Pop,
  Scene,
  Stamp,
  Star,
  Terminal,
  TitleSlam,
  Vanish,
  mono,
} from "../components";

export const clip3Schema = z.object({ showCaptions: z.boolean() });
const words = transcript.words as Word[];
const capWords = captionNames(words);

/** Line that strikes itself out. */
const StrikeRow: React.FC<{ at: number; text: string; top: number }> = ({ at, text, top }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, 30, at + 7, springs.snappy);
  return (
    <Pop at={at} from="left" style={{ left: 130, top }}>
      <div style={{ position: "relative", display: "inline-block", ...mono(54), fontWeight: 700 }}>
        {text}
        <div
          style={{
            position: "absolute",
            left: -10,
            top: "52%",
            height: 7,
            width: `calc(${s * 100}% + ${s * 20}px)`,
            background: colors.red,
            boxShadow: `0 0 16px ${colors.red}`,
          }}
        />
      </div>
    </Pop>
  );
};

export const Clip3: React.FC<z.infer<typeof clip3Schema>> = ({ showCaptions }) => {
  const frame = useCurrentFrame();
  const { c, ce, fps, D } = useCues(words);

  // scene boundaries
  const tPackages = c("Packages");
  const tSales = c("By the end");
  const tProblem = c("But running");
  const tScammers = c("And Silk");
  const tExit = c("One trick");
  const tBiggest = c("One of the biggest");

  const line = sp(frame, fps, c("blew"), springs.smooth, 34);
  const N = 22;
  const cut = sp(frame, fps, c("cut"), springs.smooth, 20);

  return (
    <ClipShell audio="audio/clip3.mp3" words={capWords} showCaptions={showCaptions}>
      {/* 1a: Silk Road blew up */}
      <Scene from={0} to={tPackages}>
        <TitleSlam text="SILK ROAD" color={colors.green} fontSize={280} at={c("Silk")} style={{ top: 110 }} />
        <svg width={1400} height={420} viewBox="0 0 1400 420" style={{ position: "absolute", left: 260, top: 430, overflow: "visible" }}>
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M 0 ${100 * i + 60} H 1400`} stroke={colors.line} strokeWidth={2} />
          ))}
          <path
            d="M 0 390 C 320 385 520 360 720 270 S 1120 70 1400 10"
            fill="none"
            stroke={colors.green}
            strokeWidth={10}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - line}
            style={{ filter: `drop-shadow(0 0 16px ${colors.green})` }}
          />
        </svg>
        <Chip at={c("up")} text="ORDERS ↗" color={colors.green} style={{ left: 300, top: 470 }} />
      </Scene>

      {/* 1b: packages all over the world */}
      <Scene from={tPackages} to={tSales}>
        <svg width={360} height={360} viewBox="-180 -180 360 360" style={{ position: "absolute", left: 780, top: 290, overflow: "visible" }}>
          <g transform={`rotate(${frame / 6})`} opacity={0.8}>
            <circle r={150} fill="rgba(57,255,136,0.05)" stroke={colors.green} strokeWidth={4} />
            <ellipse rx={150} ry={55} fill="none" stroke={colors.greenDim} strokeWidth={3} />
            <ellipse rx={60} ry={150} fill="none" stroke={colors.greenDim} strokeWidth={3} />
            <path d="M -150 0 H 150 M 0 -150 V 150" stroke={colors.greenDim} strokeWidth={3} />
          </g>
        </svg>
        {new Array(N).fill(0).map((_, i) => {
          const a = (i / N) * Math.PI * 2 + random(`pa-${i}`) * 0.25;
          const dist = 250 + random(`pd-${i}`) * 210;
          const s = sp(frame, fps, c("went") + i * 2.2, springs.snappy);
          if (s <= 0.001) return null;
          const x = 960 + Math.cos(a) * dist * 1.75 * s;
          const y = 470 + Math.sin(a) * dist * 0.92 * s;
          return (
            <div key={i} style={{ position: "absolute", left: x - 28, top: y - 22, transform: `scale(${s}) rotate(${(random(`pr-${i}`) - 0.5) * 30}deg)` }}>
              <Parcel size={56} color={i % 5 === 0 ? colors.amber : colors.green} />
            </div>
          );
        })}
        <Chip at={c("normal")} text="REGULAR MAIL" style={{ left: 150, top: 90 }} />
        <Chip at={c("vacuum")} text="VACUUM-SEALED" style={{ left: 790, top: 90 }} />
        <Chip at={c("all")} text="WORLDWIDE" color={colors.green} style={{ left: 1480, top: 90 }} />
      </Scene>

      {/* 2: $1.2 billion */}
      <Scene from={tSales} to={tProblem}>
        <Pop at={c("prosecutors")} from="up" style={{ left: 0, right: 0, top: 150, textAlign: "center" }}>
          <span style={{ ...mono(34, colors.dim), letterSpacing: "0.2em" }}>TOTAL SALES, ACCORDING TO PROSECUTORS</span>
        </Pop>
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center" }}>
          {frame >= c("handled") ? (
            <Counter to={1200000000} prefix="$" at={c("handled")} durationInFrames={c("sales") - c("handled")} fontSize={172} color={colors.amber} />
          ) : null}
        </div>
        <Pop at={c("billion")} style={{ left: 0, right: 0, top: 440, textAlign: "center" }}>
          <span style={{ fontFamily: fonts.display, fontSize: 170, color: colors.text }}>$1.2 BILLION</span>
        </Pop>
        <Pop at={c("Ross")} origin="center bottom" style={{ left: 1420, top: 480 }}>
          <Dpr size={360} />
        </Pop>
        {frame >= c("cut")
          ? [0, 1, 2, 3, 4, 5].map((i) => {
              const t = ((frame - c("cut") + i * 9) % 54) / 54;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: interpolate(t, [0, 1], [1000, 1530]),
                    top: interpolate(t, [0, 1], [560, 690]) - Math.sin(t * Math.PI) * 70,
                    opacity: Math.min(1, cut) * Math.sin(t * Math.PI),
                  }}
                >
                  <CoinIcon size={54} />
                </div>
              );
            })
          : null}
        <Chip at={c("every")} text="A CUT OF EVERY SINGLE SALE" style={{ left: 420, top: 660 }} />
      </Scene>

      {/* 3: the problem with running it anonymously */}
      <Scene from={tProblem} to={tScammers}>
        <DprDesk x={1350} />
        <Terminal
          style={{ position: "absolute", left: 130, top: 130 }}
          fontSize={36}
          color={colors.dim}
          showCursor={frame < c("problem")}
          lines={[{ text: "a criminal empire, run anonymously", prompt: "> ", at: c("running"), durationInFrames: 40 }]}
        />
        <TitleSlam text="ONE PROBLEM" color={colors.amber} fontSize={190} at={c("problem")} style={{ left: 124, right: "auto", top: 200, alignItems: "flex-start" }} />
        <StrikeRow at={c("call")} text="CALL THE POLICE" top={440} />
        <StrikeRow at={c("sue")} text="SUE ANYONE" top={530} />
        <Chip at={c("robs")} text="ROBBED?" style={{ left: 130, top: 640 }} />
        <Chip at={c("threatens")} text="THREATENED?" style={{ left: 380, top: 640 }} />
        <TitleSlam text="YOU'RE ON YOUR OWN" color={colors.red} fontSize={120} at={c("on your")} style={{ left: 124, right: "auto", top: 740, alignItems: "flex-start" }} />
      </Scene>

      {/* 4a: full of scammers */}
      <Scene from={tScammers} to={tExit}>
        <IconFlood at={tScammers} spread={26} highlightAt={c("scammers") - 4} highlightColor={colors.red} highlightRatio={0.34} seed="scam" />
        <Pop at={c("full")} style={{ left: 0, right: 0, top: 330, height: 300, background: "rgba(7,9,11,0.9)", borderTop: `2px solid ${colors.red}`, borderBottom: `2px solid ${colors.red}` }}>
          <div />
        </Pop>
        <TitleSlam text="FULL OF SCAMMERS" color={colors.red} fontSize={230} at={c("scammers")} style={{ top: 370 }} />
      </Scene>

      {/* 4b: the exit scam */}
      <Scene from={tExit} to={tBiggest}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", ...mono(34, colors.dim) }}>&gt; one trick:</div>
        <TitleSlam text="EXIT SCAM" color={colors.amber} fontSize={200} at={c("exit")} style={{ top: 110 }} />
        <Pop at={c("A dealer")} from="up" style={{ left: 410, top: 340 }}>
          <Card style={{ width: 1100, height: 480, display: "flex", gap: 50, alignItems: "center" }}>
            <div style={{ width: 300, flexShrink: 0 }}>
              <Vanish at={c("disappears")}>
                <BlobCharacter color={colors.extras[1]} size={330} seed={8} />
              </Vanish>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...mono(26, colors.dim), letterSpacing: "0.16em" }}>VENDOR PROFILE</div>
              <div style={{ fontFamily: fonts.display, fontSize: 88, lineHeight: 1, color: colors.text, marginTop: 6 }}>TRUSTED DEALER</div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={58} fill={Math.max(0, Math.min(1, sp(frame, fps, c("perfect") + i * 4, springs.pop)))} />
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 22 }}>
                <span style={{ ...mono(30, colors.dim), width: 240 }}>OPEN ORDERS</span>
                <Counter to={2480} at={c("takes")} durationInFrames={c("then") - c("takes")} fontSize={76} />
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 10 }}>
                <span style={{ ...mono(30, colors.dim), width: 240 }}>MONEY HELD</span>
                <span style={{ ...mono(54, frame >= c("money") ? colors.red : colors.amber), fontWeight: 700 }}>
                  {frame >= c("money") ? "GONE" : frame >= c("takes") ? "$$$$$$" : "$"}
                </span>
              </div>
            </div>
          </Card>
        </Pop>
        <Stamp at={c("disappears") + 6} text="VANISHED" fontSize={260} top={420} />
        <Flash at={c("disappears") + 6} peak={0.35} durationInFrames={10} />
      </Scene>

      {/* 5: one of the biggest had just done it, enter FriendlyChemist */}
      <Scene from={tBiggest} to={D} exit="glitch">
        <div style={{ position: "absolute", left: 170, top: 150, ...mono(30, colors.green), letterSpacing: "0.2em" }}>TOP SELLER ON THE SITE</div>
        <div style={{ position: "absolute", left: 166, top: 200, fontFamily: fonts.display, fontSize: 230, lineHeight: 1, color: colors.text }}>
          <DecodeText text="LUCYDROP" at={c("biggest")} durationInFrames={14} />
        </div>
        <div style={{ position: "absolute", left: 170, top: 470, ...mono(44, colors.dim) }}>
          status:{" "}
          <span style={{ color: frame >= c("exactly") ? colors.red : colors.green, fontWeight: 700 }}>
            {frame >= c("exactly") ? "VANISHED WITH THE MONEY" : "ACTIVE"}
          </span>
        </div>
        <div style={{ position: "absolute", left: 220, top: 560 }}>
          <Vanish at={c("exactly")}>
            <BlobCharacter color={colors.extras[1]} size={300} seed={8} />
          </Vanish>
        </div>
        <Pop at={c("Friendly")} origin="center bottom" style={{ left: 1260, top: 300 }}>
          <Chemist size={470} look={{ x: -0.8, y: 0.1 }} />
          <NameTag text="FriendlyChemist" color={colors.chemist} />
        </Pop>
        <Chip at={c("where")} text="ENTER:" color={colors.chemist} style={{ left: 1280, top: 200 }} />
      </Scene>
    </ClipShell>
  );
};
