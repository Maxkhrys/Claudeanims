import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { z } from "zod";
import transcript from "../../public/audio/clip9.json";
import { colors, fonts, springs } from "../theme";
import { captionNames, sp, useCues, type Word } from "../lib/timing";
import {
  BlobCharacter,
  Card,
  Chip,
  ClipShell,
  DecodeText,
  Dpr,
  DprDesk,
  Flash,
  NameTag,
  Pop,
  Scene,
  Stamp,
  Terminal,
  TitleSlam,
  Vanish,
  mono,
} from "../components";

export const clip9Schema = z.object({ showCaptions: z.boolean() });
const words = transcript.words as Word[];
const capWords = captionNames(words);

const Agent: React.FC<Partial<React.ComponentProps<typeof BlobCharacter>>> = (p) => (
  <BlobCharacter color={colors.agent} seed={6} {...p} />
);

const MiniLaptop: React.FC<{ glow?: string }> = ({ glow = colors.green }) => (
  <div>
    <div
      style={{
        width: 230,
        height: 140,
        borderRadius: "12px 12px 3px 3px",
        background: "linear-gradient(to bottom, #1A2128, #0C1014)",
        border: "2px solid #2A343D",
        boxShadow: `0 -4px 30px ${glow}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 24, height: 24, borderRadius: 12, background: glow, boxShadow: `0 0 20px ${glow}` }} />
    </div>
    <div style={{ width: 260, height: 10, marginLeft: -15, borderRadius: "3px 3px 8px 8px", background: "#1C232A" }} />
  </div>
);

const ForumPost: React.FC<{
  site: string;
  date: string;
  nameAt: number;
  children: React.ReactNode;
}> = ({ site, date, nameAt, children }) => (
  <Card style={{ width: 800, height: 470, padding: "26px 34px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", ...mono(24, colors.dim), letterSpacing: "0.12em" }}>
      <span>{site}</span>
      <span>{date}</span>
    </div>
    <div style={{ ...mono(26, colors.dim), marginTop: 18 }}>posted by</div>
    <div style={{ fontFamily: fonts.display, fontSize: 110, lineHeight: 1, color: colors.amber, textShadow: `0 0 30px ${colors.amber}55` }}>
      <DecodeText text="altoid" at={nameAt} durationInFrames={10} />
    </div>
    <div style={{ ...mono(31), lineHeight: 1.5, marginTop: 16 }}>{children}</div>
  </Card>
);

const EvidenceRow: React.FC<{ at: number; n: string; title: string; note: string }> = ({ at, n, title, note }) => (
  <Pop at={at} from="left" style={{ position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 34, padding: "20px 0", borderBottom: `2px solid ${colors.line}` }}>
      <div style={{ ...mono(40, colors.green), fontWeight: 700, width: 70 }}>{n}</div>
      <div style={{ fontFamily: fonts.display, fontSize: 104, lineHeight: 1, color: colors.text, flex: 1 }}>{title}</div>
      <div style={{ ...mono(28, colors.dim), width: 520, textAlign: "right" }}>{note}</div>
    </div>
  </Pop>
);

export const Clip9: React.FC<z.infer<typeof clip9Schema>> = ({ showCaptions }) => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useCues(words);

  const tAgent = c("An IRS");
  const tFound = c("He found");
  const tRoss = c("Ross");
  const tOct = c("October");
  const tOnIt = c("On it");

  const close = sp(frame, fps, c("closing"), springs.heavy, tAgent - c("closing"));
  const inset = interpolate(close, [0, 1], [40, 250]);
  const query = '"silk road" earliest mentions';
  const typed = Math.max(0, Math.min(query.length, Math.floor(((frame - c("searched")) / fps) * 22)));
  const link = sp(frame, fps, c("again"), springs.smooth, 14);

  // library
  const fight = frame >= c("stage");
  const look = frame >= c("turns") ? 1 : 0;
  const sneak = sp(frame, fps, c("Another"), springs.smooth, 20);
  const grab = sp(frame, fps, c("grabs"), springs.snappy);
  const DESK_X = 820;

  return (
    <ClipShell audio="audio/clip9.mp3" words={capWords} showCaptions={showCaptions}>
      {/* 1: the law closes in */}
      <Scene from={0} to={tAgent}>
        <DprDesk x={960} />
        {[
          { left: inset * 1.6, top: inset * 0.55, bl: true, bt: true },
          { right: inset * 1.6, top: inset * 0.55, br: true, bt: true },
          { left: inset * 1.6, bottom: inset * 0.75, bl: true, bb: true },
          { right: inset * 1.6, bottom: inset * 0.75, br: true, bb: true },
        ].map((k, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: k.left,
              right: k.right,
              top: k.top,
              bottom: k.bottom,
              width: 130,
              height: 130,
              borderLeft: k.bl ? `8px solid ${colors.red}` : undefined,
              borderRight: k.br ? `8px solid ${colors.red}` : undefined,
              borderTop: k.bt ? `8px solid ${colors.red}` : undefined,
              borderBottom: k.bb ? `8px solid ${colors.red}` : undefined,
              opacity: frame >= c("law") ? 0.9 : 0,
              filter: `drop-shadow(0 0 12px ${colors.red})`,
            }}
          />
        ))}
        <Chip at={c("scammed")} text="BUSY GETTING SCAMMED" color={colors.text} style={{ left: 130, top: 150 }} />
        <TitleSlam text="CLOSING IN" color={colors.red} fontSize={170} at={c("closing")} style={{ top: 60 }} />
      </Scene>

      {/* 2: the IRS agent */}
      <Scene from={tAgent} to={tFound}>
        <Pop at={tAgent} origin="center bottom" style={{ left: 170, top: 280 }}>
          <Agent size={460} look={{ x: 0.8, y: 0 }} />
          <NameTag text="GARY ALFORD" color={colors.agent} />
        </Pop>
        <Chip at={c("IRS")} text="IRS AGENT" color={colors.agent} fontSize={40} style={{ left: 200, top: 170 }} />
        <Pop at={c("searched") - 8} from="up" style={{ left: 720, top: 220 }}>
          <Card style={{ width: 1060, padding: "26px 34px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 24px", borderRadius: 40, border: `2px solid ${colors.agent}`, background: colors.panelLight }}>
              <svg width={40} height={40} viewBox="0 0 24 24">
                <circle cx={10} cy={10} r={6.5} fill="none" stroke={colors.agent} strokeWidth={2.4} />
                <path d="M15 15 L21 21" stroke={colors.agent} strokeWidth={2.6} strokeLinecap="round" />
              </svg>
              <span style={{ ...mono(40), fontWeight: 700 }}>
                {query.slice(0, typed)}
                <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1, color: colors.agent }}>▌</span>
              </span>
            </div>
            <div style={{ ...mono(24, colors.dim), marginTop: 22 }}>sorted by: oldest first</div>
            {[0, 1, 2].map((i) => {
              const s = sp(frame, fps, c("earliest") + i * 6, springs.snappy);
              return (
                <div key={i} style={{ marginTop: 18, opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * 40}px)` }}>
                  <div style={{ height: 22, width: 420 + i * 90, borderRadius: 4, background: i === 0 ? colors.amber : colors.line }} />
                  <div style={{ height: 14, width: 760 - i * 110, borderRadius: 4, background: colors.line, marginTop: 10, opacity: 0.6 }} />
                </div>
              );
            })}
          </Card>
        </Pop>
      </Scene>

      {/* 3: altoid, twice */}
      <Scene from={tFound} to={tRoss}>
        <Pop at={c("2011") - 6} from="up" style={{ left: 110, top: 150 }}>
          <ForumPost site="DRUG FORUM" date="JAN 2011" nameAt={c("Altoid")}>
            has anyone here heard of <b style={{ color: colors.green }}>Silk Road</b>? a hidden site where you can buy and sell anything, anonymously...
          </ForumPost>
        </Pop>
        <Pop at={c("Then he found")} from="up" style={{ left: 1010, top: 150 }}>
          <ForumPost site="BITCOIN FORUM" date="OCT 2011" nameAt={c("Altoid", 1)}>
            <span style={{ opacity: frame >= c("hiring") ? 1 : 0.15 }}>hiring: lead developer for a bitcoin startup.</span>
            <br />
            <span style={{ opacity: frame >= c("signing") ? 1 : 0 }}>
              contact:{" "}
              <b style={{ color: colors.bg, background: frame >= c("email") ? colors.amber : colors.line, padding: "2px 10px" }}>
                {frame >= c("email") ? "rossulbricht@gmail.com" : "▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇"}
              </b>
            </span>
          </ForumPost>
        </Pop>
        <div style={{ position: "absolute", left: 420, top: 348, height: 6, width: 640 * link, background: colors.amber, boxShadow: `0 0 16px ${colors.amber}` }} />
        <Chip at={c("quietly")} text="QUIETLY PROMOTING THE SITE" color={colors.green} fontSize={28} style={{ left: 150, top: 650 }} />
        <Chip at={c("again") + 6} text="SAME USERNAME" origin="center center" fontSize={28} style={{ left: 810, top: 90 }} />
        <div style={{ position: "absolute", left: 110, top: 760, ...mono(22, colors.dim) }}>posts paraphrased</div>
        <Flash at={c("email")} color={colors.amber} peak={0.3} durationInFrames={10} />
      </Scene>

      {/* 4: his real name */}
      <Scene from={tRoss} to={tOct}>
        <div style={{ position: "absolute", left: 190, top: 330 }}>
          {frame < tRoss + 8 ? (
            <Vanish at={tRoss}>
              <Dpr size={500} />
            </Vanish>
          ) : (
            <BlobCharacter color={colors.ross} size={500} seed={1} expression="scared" sweat shake={0.4} />
          )}
        </div>
        <div style={{ position: "absolute", left: 760, top: 170, ...mono(36, colors.dim) }}>
          altoid <span style={{ color: colors.amber }}>→</span> email <span style={{ color: colors.amber }}>→</span>
        </div>
        <TitleSlam text="ROSS ULBRICHT" fontSize={230} at={tRoss} style={{ left: 750, right: "auto", top: 230, alignItems: "flex-start" }} />
        <Chip at={c("real")} text="HIS REAL NAME" fontSize={44} style={{ left: 760, top: 500 }} />
        <TitleSlam text="ONLINE THE WHOLE TIME" color={colors.red} fontSize={120} at={c("whole")} style={{ left: 754, right: "auto", top: 630, alignItems: "flex-start" }} />
      </Scene>

      {/* 5: the library */}
      <Scene from={tOct} to={tOnIt}>
        {/* bookshelves */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 560, opacity: 0.32 }}>
          {[0, 1, 2].map((r) => (
            <div key={r} style={{ position: "absolute", left: 0, right: 0, top: 60 + r * 165, height: 150, borderBottom: "10px solid #2A343D", display: "flex", alignItems: "flex-end", gap: 5, paddingLeft: 20 }}>
              {new Array(58).fill(0).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 18 + random(`bw-${r}-${i}`) * 22,
                    height: 80 + random(`bh-${r}-${i}`) * 60,
                    background: [colors.greenDim, "#3A4652", "#5A4632", "#4A3550", "#2F4A5A"][Math.floor(random(`bc-${r}-${i}`) * 5)],
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <Terminal
          style={{ position: "absolute", left: 110, top: 80, background: "rgba(7,9,11,0.85)", padding: "14px 22px", borderRadius: 8 }}
          fontSize={50}
          lines={[
            { text: "OCTOBER 2013", at: c("October"), durationInFrames: 20 },
            { text: "public library, san francisco", prompt: "> ", at: c("library"), durationInFrames: 30, size: 0.6, color: colors.text },
          ]}
        />
        {/* desk */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 760, bottom: -100, background: "linear-gradient(to bottom, #11171C, #06080A 50%)", borderTop: "3px solid rgba(255,255,255,0.08)" }} />
        {/* Ross */}
        <Pop at={c("library")} origin="center bottom" style={{ left: DESK_X - 165, top: 390 }}>
          <BlobCharacter color={colors.ross} size={380} seed={1} look={{ x: look, y: look ? 0 : 0.9 }} lightColor={colors.green} lightAmount={grab > 0.5 ? 0 : 0.5} />
        </Pop>
        {/* two agents stage a fight */}
        {[0, 1].map((i) => {
          const j = fight ? (random(`fx-${i}-${frame}`) - 0.5) * 26 : 0;
          return (
            <Pop key={i} at={c("Two") + i * 4} origin="center bottom" style={{ left: 1380 + i * 220 + (fight ? (i ? -40 : 40) : 0) + j, top: 420 }}>
              <Agent size={330} seed={7 + i} expression={fight ? "angry" : "calm"} look={{ x: i ? -1 : 1, y: 0 }} />
            </Pop>
          );
        })}
        <Chip at={c("undercover")} text="UNDERCOVER" color={colors.agent} fontSize={26} origin="center center" style={{ left: 1500, top: 350 }} />
        <Chip at={c("fight")} text="!!" color={colors.red} filled fontSize={60} origin="center center" style={{ left: 1570, top: 220 }} />
        {/* the third agent and the laptop */}
        <div style={{ position: "absolute", left: interpolate(sneak, [0, 1], [-320, 300]), top: 420, opacity: frame >= c("Another") ? 1 : 0 }}>
          <Agent size={350} seed={9} look={{ x: 1, y: 0.4 }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: interpolate(grab, [0, 1], [DESK_X - 95, 350]),
            top: interpolate(grab, [0, 1], [640, 560]),
            transform: `rotate(${grab * -10}deg)`,
            opacity: frame >= c("library") ? 1 : 0,
          }}
        >
          <MiniLaptop />
        </div>
        <Flash at={c("grabs")} color={colors.text} peak={0.35} durationInFrames={8} />
        <Chip at={c("Open")} text="STILL OPEN" fontSize={40} style={{ left: 130, top: 320 }} />
        <Chip at={c("logged")} text="LOGGED IN AS: DREAD PIRATE ROBERTS" color={colors.green} filled fontSize={34} style={{ left: 130, top: 410 }} />
      </Scene>

      {/* 6: what was on it */}
      <Scene from={tOnIt} to={D} exit="glitch">
        <Pop at={tOnIt} from="up" style={{ left: 160, top: 90 }}>
          <Card accent={colors.green} style={{ width: 1600, padding: "26px 50px 40px" }}>
            <div style={{ ...mono(28, colors.green), letterSpacing: "0.2em" }}>SEIZED LAPTOP // CONTENTS</div>
            <div style={{ borderTop: `2px solid ${colors.line}`, marginTop: 16 }}>
              <EvidenceRow at={c("control")} n="01" title="CONTROL PANEL" note="the site's admin page, open" />
              <EvidenceRow at={c("diary")} n="02" title="A DIARY" note="about building Silk Road" />
              <EvidenceRow at={c("chat")} n="03" title="THE CHAT LOGS" note="the messages you've just heard" />
            </div>
          </Card>
        </Pop>
        <Stamp at={c("logs") + 4} text="EVIDENCE" color={colors.amber} fontSize={330} top={300} />
      </Scene>
    </ClipShell>
  );
};
