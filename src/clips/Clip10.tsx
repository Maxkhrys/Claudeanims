import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import transcript from "../../public/audio/clip10.json";
import { colors, fonts, springs } from "../theme";
import { captionNames, sp, useCues, type Word } from "../lib/timing";
import {
  BlobCharacter,
  Chip,
  ClipShell,
  Counter,
  Dpr,
  Flash,
  NameTag,
  Pop,
  Scene,
  Stamp,
  Terminal,
  TitleSlam,
  mono,
} from "../components";

export const clip10Schema = z.object({ showCaptions: z.boolean() });
const words = transcript.words as Word[];
const capWords = captionNames(words);

const Ross: React.FC<Partial<React.ComponentProps<typeof BlobCharacter>>> = (p) => (
  <BlobCharacter color={colors.ross} seed={1} {...p} />
);

const ChargeRow: React.FC<{ at: number; text: string; verdict: string; color: string }> = ({ at, text, verdict, color }) => (
  <Pop at={at} from="left" style={{ position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "16px 0", borderBottom: `2px solid ${colors.line}` }}>
      <span style={{ ...mono(50), fontWeight: 700, flex: 1 }}>{text}</span>
      <span style={{ ...mono(34, colors.bg), fontWeight: 700, background: color, padding: "6px 18px", borderRadius: 6 }}>{verdict}</span>
    </div>
  </Pop>
);

/** Cell bars. `down` 0..1 */
const Bars: React.FC<{ down: number; left: number; width: number; top: number; height: number }> = ({ down, left, width, top, height }) => (
  <div style={{ position: "absolute", left, top, width, height, overflow: "hidden", pointerEvents: "none" }}>
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${(down - 1) * 105}%)`, display: "flex", justifyContent: "space-between" }}>
      {new Array(9).fill(0).map((_, i) => (
        <div key={i} style={{ width: 22, height: "100%", borderRadius: 6, background: "linear-gradient(to right, #59636D, #2A323A)", boxShadow: "0 0 14px rgba(0,0,0,0.7)" }} />
      ))}
    </div>
  </div>
);

const SideList: React.FC<{ left: number; title: string; color: string; titleAt: number; items: { at: number; text: string }[] }> = ({
  left,
  title,
  color,
  titleAt,
  items,
}) => (
  <div style={{ position: "absolute", left, top: 130, width: 760 }}>
    <Pop at={titleAt} from="up" style={{ position: "relative" }}>
      <div style={{ fontFamily: fonts.display, fontSize: 130, lineHeight: 1, color, textShadow: `0 0 34px ${color}55` }}>{title}</div>
      <div style={{ height: 6, background: color, marginTop: 8, marginBottom: 20 }} />
    </Pop>
    {items.map((it) => (
      <Pop key={it.text} at={it.at} from="left" style={{ position: "relative", marginBottom: 18 }}>
        <span style={{ ...mono(50), fontWeight: 700 }}>
          <span style={{ color }}>▸ </span>
          {it.text}
        </span>
      </Pop>
    ))}
  </div>
);

export const Clip10: React.FC<z.infer<typeof clip10Schema>> = ({ showCaptions }) => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useCues(words);

  const tNever = c("He was never");
  const tSentence = c("The sentence");
  const tSupport = c("Supporters");
  const tPardon = c("In January");
  const tWho = c("So who");
  const tOutro = c("Let");

  const barsDown = sp(frame, fps, c("parole"), springs.snappy);
  const barsUp = sp(frame, fps, c("pardoned"), springs.smooth, 20);
  const walk = sp(frame, fps, c("walked"), springs.heavy, 40);

  return (
    <ClipShell audio="audio/clip10.mp3" words={capWords} showCaptions={showCaptions}>
      {/* 1: convicted */}
      <Scene from={0} to={tNever}>
        <Terminal style={{ position: "absolute", left: 130, top: 100 }} fontSize={64} lines={[{ text: "2015", at: 2, durationInFrames: 12 }]} />
        <Pop at={c("Ross")} origin="center bottom" style={{ left: 150, top: 360 }}>
          <Ross size={430} expression="scared" sweat={false} shake={0.2} look={{ x: 0.7, y: 0 }} />
        </Pop>
        <TitleSlam text="CONVICTED" color={colors.red} fontSize={230} at={c("convicted")} style={{ left: 690, right: "auto", top: 90, alignItems: "flex-start" }} />
        <div style={{ position: "absolute", left: 700, top: 390, width: 1060 }}>
          <ChargeRow at={c("drug")} text="DRUG TRAFFICKING" verdict="GUILTY" color={colors.red} />
          <ChargeRow at={c("money")} text="MONEY LAUNDERING" verdict="GUILTY" color={colors.red} />
          <ChargeRow at={c("computer")} text="COMPUTER HACKING" verdict="GUILTY" color={colors.red} />
        </div>
        <Flash at={c("convicted")} peak={0.35} durationInFrames={10} />
      </Scene>

      {/* 2: never convicted of murder-for-hire */}
      <Scene from={tNever} to={tSentence}>
        <div style={{ position: "absolute", left: 130, top: 200, width: 1100 }}>
          <ChargeRow at={tNever + 3} text="MURDER-FOR-HIRE" verdict="NEVER CONVICTED" color={colors.text} />
        </div>
        <Pop at={c("judge") - 4} origin="center bottom" style={{ left: 1360, top: 200 }}>
          <BlobCharacter color="#3C3550" size={440} seed={4} look={{ x: -0.7, y: 0.5 }} />
        </Pop>
        <Pop at={c("judge") - 4} from="up" style={{ left: 1240, top: 560, width: 600, height: 400, borderRadius: "14px 14px 0 0", background: "linear-gradient(to bottom, #2A2118, #120E0A)", border: "2px solid #4A3A28" }}>
          <div style={{ textAlign: "center", marginTop: 30, ...mono(34, colors.amber), fontWeight: 700, letterSpacing: "0.2em" }}>THE JUDGE</div>
        </Pop>
        <TitleSlam text="BUT THE JUDGE HEARD" color={colors.amber} fontSize={130} at={c("heard")} style={{ left: 124, right: "auto", top: 440, alignItems: "flex-start" }} />
        <Chip at={c("hits")} text="ABOUT THE HITS" color={colors.red} filled fontSize={50} style={{ left: 130, top: 610 }} />
      </Scene>

      {/* 3: the sentence */}
      <Scene from={tSentence} to={tSupport}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", ...mono(38, colors.dim) }}>&gt; the sentence:</div>
        <TitleSlam text="2 × LIFE" color={colors.text} fontSize={380} at={c("Two")} style={{ top: 110 }} />
        <TitleSlam text="+ 40 YEARS" color={colors.amber} fontSize={220} at={c("plus")} style={{ top: 500 }} />
        <Bars down={barsDown} left={0} width={1920} top={0} height={1080} />
        <Stamp at={c("No")} text="NO PAROLE" fontSize={280} top={330} />
        <Flash at={c("No")} peak={0.45} />
      </Scene>

      {/* 4: two readings of the sentence */}
      <Scene from={tSupport} to={tPardon}>
        <div style={{ position: "absolute", left: 958, top: 110, width: 4, height: 720, background: colors.line }} />
        <SideList
          left={130}
          title="SUPPORTERS"
          color={colors.green}
          titleAt={tSupport}
          items={[
            { at: c("brutally"), text: "BRUTALLY HARSH" },
            { at: c("first"), text: "A FIRST OFFENSE" },
          ]}
        />
        <SideList
          left={1040}
          title="CRITICS"
          color={colors.red}
          titleAt={c("Critics")}
          items={[
            { at: c("drugs"), text: "THE DRUGS" },
            { at: c("overdoses"), text: "THE OVERDOSES" },
            { at: c("hit"), text: "THE HIT LIST" },
          ]}
        />
      </Scene>

      {/* 5: pardoned */}
      <Scene from={tPardon} to={tWho}>
        <Terminal style={{ position: "absolute", left: 130, top: 100 }} fontSize={64} lines={[{ text: "JANUARY 2025", at: c("January"), durationInFrames: 22 }]} />
        <div style={{ position: "absolute", left: 250 + walk * 1500, top: 330 - Math.abs(Math.sin(walk * 22)) * 26 }}>
          <Ross size={460} look={{ x: frame >= c("walked") ? 1 : 0, y: 0 }} />
        </div>
        <Bars down={1 - barsUp} left={150} width={600} top={250} height={640} />
        <div style={{ position: "absolute", left: 880, top: 250, display: "flex", alignItems: "baseline", gap: 30 }}>
          {frame >= c("more") ? <Counter to={11} at={c("more")} durationInFrames={c("years", 1) - c("more") + 20} fontSize={260} color={colors.text} /> : null}
          <Pop at={c("years", 1)} from="up" style={{ position: "relative" }}>
            <span style={{ ...mono(54, colors.dim), fontWeight: 700 }}>YEARS IN PRISON</span>
          </Pop>
        </div>
        <TitleSlam text="PARDONED" color={colors.green} fontSize={280} at={c("pardoned")} style={{ left: 870, right: "auto", top: 520, alignItems: "flex-start" }} />
        <Flash at={c("pardoned")} color={colors.green} peak={0.35} />
      </Scene>

      {/* 6 + 7: the question */}
      <Scene from={tWho} to={D} exit="glitch">
        <Scene from={tWho} to={tOutro}>
          <TitleSlam text="WHO WAS THE REAL ROSS ULBRICHT?" fontSize={132} at={c("who")} style={{ top: 70 }} />
        </Scene>
        <Pop at={c("idealist") - 6} origin="center bottom" style={{ left: 330, top: 300 }}>
          <Ross size={420} look={{ x: 0.6, y: 0 }} />
          <NameTag text="THE IDEALIST" color={colors.green} fontSize={32} />
        </Pop>
        <Chip at={c("built")} text="BUILT A FREE MARKET" color={colors.green} fontSize={30} origin="center center" style={{ left: 320, top: 790 }} />
        <Pop at={c("Or")} origin="center bottom" style={{ left: 1230, top: 300 }}>
          <Dpr size={420} expression="angry" lightColor={colors.red} look={{ x: -0.6, y: 0 }} />
          <NameTag text="THE MAN WHO ORDERED HITS" color={colors.red} fontSize={32} />
        </Pop>
        <Chip at={c("lucky")} text="THE KILLER JUST WASN'T REAL" color={colors.red} fontSize={30} origin="center center" style={{ left: 1150, top: 790 }} />
        <Pop at={c("Or")} style={{ left: 880, top: 420 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 150, color: colors.amber }}>OR</span>
        </Pop>
        <TitleSlam text="WHAT DO YOU THINK?" color={colors.amber} fontSize={190} at={tOutro} style={{ top: 50 }} />
        <Chip at={c("comments") - 8} text="▼ TELL ME IN THE COMMENTS ▼" color={colors.text} fontSize={36} origin="center center" style={{ left: 640, top: 240 }} />
      </Scene>
    </ClipShell>
  );
};
