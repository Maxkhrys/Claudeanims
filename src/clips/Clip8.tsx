import React from "react";
import { useCurrentFrame } from "remotion";
import { z } from "zod";
import transcript from "../../public/audio/clip8.json";
import { colors, fonts, springs } from "../theme";
import { captionNames, sp, useCues, type Word } from "../lib/timing";
import {
  AvatarBadge,
  BlobCharacter,
  BuildingIcon,
  Chemist,
  Chip,
  ClipShell,
  CoinIcon,
  CrossOut,
  DprDesk,
  Flash,
  NameTag,
  Pop,
  RedWhite,
  Scene,
  Stamp,
  TitleSlam,
  Vanish,
  mono,
} from "../components";

export const clip8Schema = z.object({ showCaptions: z.boolean() });
const words = transcript.words as Word[];
const capWords = captionNames(words);

const FIVE = [colors.chemist, colors.extras[3], colors.extras[0], colors.extras[1], colors.extras[2]];

const ZeroRow: React.FC<{ at: number; label: string; top: number }> = ({ at, label, top }) => (
  <Pop at={at} from="left" style={{ left: 330, top, width: 1260 }}>
    <div style={{ display: "flex", alignItems: "center", borderBottom: `2px solid ${colors.line}`, paddingBottom: 10 }}>
      <span style={{ ...mono(50), fontWeight: 700, flex: 1 }}>{label}</span>
      <span style={{ ...mono(96, colors.green), fontWeight: 700, textShadow: `0 0 30px ${colors.green}66` }}>0</span>
    </div>
  </Pop>
);

const VerdictRow: React.FC<{ at: number; label: string; value: string; color: string; top: number }> = ({
  at,
  label,
  value,
  color,
  top,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 250, right: 250, top, height: 200 }}>
      <div style={{ position: "absolute", left: 0, top: 30, fontFamily: fonts.display, fontSize: 150, lineHeight: 1, color: colors.text, opacity: frame >= at - 14 ? 1 : 0.25 }}>
        {label}
      </div>
      <TitleSlam text={value} color={color} fontSize={210} at={at} style={{ left: "auto", right: 0, top: 0, alignItems: "flex-end" }} />
    </div>
  );
};

export const Clip8: React.FC<z.infer<typeof clip8Schema>> = ({ showCaptions }) => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useCues(words);

  const tInv = c("Investigators");
  const tYears = c("Years");
  const tDpr = c("The Dread");
  const tKiller = c("The killer");

  const uncross = sp(frame, fps, c("None"), springs.smooth, 14);
  const PUPPETS = [
    { x: 400, at: c("panicked"), tag: "THE SUPPLIER" },
    { x: 960, at: c("biker"), tag: "THE ENFORCER" },
    { x: 1520, at: c("dealer"), tag: "THE DEALER" },
  ];
  const seg = (a: number, d = 16) => sp(frame, fps, a, springs.smooth, d);

  return (
    <ClipShell audio="audio/clip8.mp3" words={capWords} showCaptions={showCaptions}>
      {/* 1: nobody ever went missing */}
      <Scene from={0} to={tInv}>
        {FIVE.map((col, i) => {
          const x = 280 + i * 340;
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x - 113, top: 110 }}>
                <Vanish at={c("existed") + i * 2}>
                  {i === 0 ? <Chemist size={260} sweat={false} shake={0} /> : <BlobCharacter color={col} size={260} seed={10 + i} />}
                </Vanish>
              </div>
              <div style={{ position: "absolute", left: x - 105, top: 130, opacity: 1 - uncross }}>
                <CrossOut progress={1} size={210} />
              </div>
            </React.Fragment>
          );
        })}
        <Scene from={0} to={c("No")}>
          <TitleSlam text="NONE WENT MISSING" color={colors.green} fontSize={210} at={c("missing") - 6} style={{ top: 480 }} />
        </Scene>
        <ZeroRow at={c("bodies")} label="BODIES FOUND" top={470} />
        <ZeroRow at={c("reports") - 12} label="MISSING PERSON REPORTS" top={610} />
        <TitleSlam text="NEVER EXISTED?" color={colors.red} fontSize={220} at={c("existed") + 4} style={{ top: 130 }} />
      </Scene>

      {/* 2: one person, every character */}
      <Scene from={tInv} to={tYears}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {PUPPETS.map((p, i) => {
            const s = seg(p.at - 6);
            return (
              <line
                key={i}
                x1={960}
                y1={400}
                x2={960 + (p.x - 960) * s}
                y2={400 + 100 * s}
                stroke={colors.amber}
                strokeWidth={4}
                strokeDasharray="4 12"
                strokeLinecap="round"
                opacity={s > 0 ? 0.9 : 0}
              />
            );
          })}
        </svg>
        <Pop at={tInv + 4} origin="center bottom" style={{ left: 960 - 139, top: 90 }}>
          <BlobCharacter color="#2B333C" size={320} seed={5} eyeColor={colors.amber} look={{ x: 0, y: 0.9 }} />
        </Pop>
        <TitleSlam text="ONE PERSON" color={colors.amber} fontSize={170} at={c("one")} style={{ left: 110, right: "auto", top: 130, alignItems: "flex-start" }} />
        <Chip at={c("every")} text="PLAYING EVERY CHARACTER" style={{ left: 1210, top: 190 }} />
        {PUPPETS.map((p, i) => (
          <Pop key={i} at={p.at} origin="center top" style={{ left: p.x - 113, top: 490 + Math.sin(frame / 9 + i * 2) * 8 }}>
            <div style={{ transform: `rotate(${Math.sin(frame / 13 + i) * 4}deg)`, transformOrigin: "center top" }}>
              {i === 0 ? (
                <Chemist size={260} />
              ) : i === 1 ? (
                <RedWhite size={260} expression="angry" />
              ) : (
                <BlobCharacter color={colors.extras[1]} size={260} seed={8} />
              )}
            </div>
            <NameTag text={p.tag} color={i === 0 ? colors.chemist : i === 1 ? colors.redandwhite : colors.extras[1]} fontSize={22} />
          </Pop>
        ))}
      </Scene>

      {/* 3: the money trail */}
      <Scene from={tYears} to={tDpr}>
        <div style={{ position: "absolute", left: 150, top: 110, ...mono(34, colors.dim) }}>&gt; years later: follow the money</div>
        <div style={{ position: "absolute", left: 330, top: 395, height: 8, width: 500 * seg(c("traced")), background: colors.amber, boxShadow: `0 0 16px ${colors.amber}` }} />
        <div style={{ position: "absolute", left: 1080, top: 395, height: 8, width: 420 * seg(c("to")), background: colors.amber, boxShadow: `0 0 16px ${colors.amber}` }} />
        <Pop at={c("bitcoin") - 4} style={{ left: 150, top: 300 }}>
          <CoinIcon size={200} />
          <div style={{ ...mono(26, colors.amber), textAlign: "center", marginTop: 12 }}>DPR's bitcoin</div>
        </Pop>
        <Pop at={c("exchange") - 4} style={{ left: 850, top: 290 }}>
          <BuildingIcon size={220} color={colors.text} />
          <div style={{ ...mono(26), textAlign: "center", marginTop: 4 }}>AN EXCHANGE</div>
        </Pop>
        <Pop at={c("man")} style={{ left: 1520, top: 290 }}>
          <AvatarBadge icon="unknown" size={220} />
          <div style={{ ...mono(26), textAlign: "center", marginTop: 12 }}>
            <span style={{ background: colors.text, color: colors.text }}>████████</span>
          </div>
        </Pop>
        <Chip at={c("Canada")} text="CANADA" color={colors.red} origin="center center" style={{ left: 1560, top: 210 }} />
        <Chip at={c("never")} text="NEVER CONVICTED" color={colors.text} fontSize={52} origin="center center" style={{ left: 640, top: 640 }} />
        <Stamp at={c("alleged")} text="ALLEGED" color={colors.amber} fontSize={330} top={330} />
      </Scene>

      {/* 4: DPR had been played */}
      <Scene from={tDpr} to={tKiller}>
        <DprDesk x={1380} expression={frame >= c("played") ? "angry" : "calm"} glow={frame >= c("played") ? colors.red : colors.green} />
        <div style={{ position: "absolute", left: 130, top: 190, fontFamily: fonts.display, fontSize: 120, lineHeight: 1, color: colors.text }}>
          DREAD PIRATE ROBERTS
        </div>
        <Chip at={c("most", 1)} text="MOST WANTED MAN ON THE DARK WEB" style={{ left: 130, top: 340 }} />
        <TitleSlam text="PLAYED." color={colors.red} fontSize={360} at={c("played")} style={{ left: 120, right: "auto", top: 450, alignItems: "flex-start" }} />
        <Flash at={c("played")} peak={0.45} />
      </Scene>

      {/* 5: the verdict */}
      <Scene from={tKiller} to={D} exit="glitch">
        <VerdictRow at={c("fake")} label="THE KILLER" value="FAKE" color={colors.red} top={110} />
        <VerdictRow at={c("fake", 1)} label="THE VICTIMS" value="FAKE" color={colors.red} top={350} />
        <VerdictRow at={c("real")} label="THE MONEY" value="REAL" color={colors.amber} top={590} />
        <Flash at={c("real")} color={colors.amber} peak={0.4} />
      </Scene>
    </ClipShell>
  );
};
