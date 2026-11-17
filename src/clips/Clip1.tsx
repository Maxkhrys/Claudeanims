import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  interpolateColors,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import transcript from "../../public/audio/clip1.json";
import { colors, fonts, springs } from "../theme";
import { createCues, replacePhrase, sp, type Cues, type Word } from "../lib/timing";
import {
  AvatarBadge,
  Background,
  BlobCharacter,
  Captions,
  ChatWindow,
  Counter,
  DecodeText,
  Flash,
  GlitchTransition,
  IconFlood,
  PirateHat,
  Terminal,
  TitleSlam,
} from "../components";

export const clip1Schema = z.object({
  showCaptions: z.boolean(),
});

const words = transcript.words as Word[];
const captionWords = replacePhrase(words, "Friendly Chemist", "FriendlyChemist");

/** Every beat is derived from a spoken word. No hand-picked frame numbers. */
const useBeats = (cue: Cues) =>
  useMemo(
    () => ({
      typeDate: cue.at("March"),
      typeDateEnd: cue.at("2013", 0, 0.75),
      typeMarket: cue.at("biggest"),
      chatIn: cue.at("private", 0, -0.1),
      senderReveal: cue.at("Friendly"),
      subject: cue.at("Chemist"),
      flood: cue.at("addresses", 0, -0.2),
      counter: cue.at("thousands"),
      counterEnd: cue.end("customers"),
      dealers: cue.at("dozens"),
      demand: cue.at("His demand"),
      demandType: cue.at("demand"),
      slamMoney: cue.at("half"),
      leak: cue.at("posts"),
      leakText: cue.at("everything"),
      room: cue.at("On the other"),
      roomQuestion: cue.at("other"),
      screenOn: cue.at("that screen"),
      dprReveal: cue.at("man"),
      alias: cue.at("Dread"),
      aliasEnd: cue.end("Roberts"),
      pushIn: cue.at("Over the next"),
      role: cue.at("weeks"),
      turn: cue.at("nobody"),
      movement: cue.at("online", 1),
      angry: cue.at("movement", 0, 0.3),
      cutToBlack: cue.at("pay", 1),
      slamOrdered: cue.at("have"),
      slamHit: cue.at("killed"),
      glitchOut: cue.at("so"),
    }),
    [cue],
  );

type Beats = ReturnType<typeof useBeats>;

// ─── Scene 1: terminal ───────────────────────────────────────────────
const SceneTerminal: React.FC<{ b: Beats; exitAt: number }> = ({ b, exitAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const exit = sp(frame, fps, exitAt, springs.snappy);
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: 1 - exit,
        transform: `scale(${1 + exit * 0.15}) translateY(${-exit * 40}px)`,
      }}
    >
      <Terminal
        align="center"
        fontSize={150}
        lines={[
          { text: "MARCH 2013", at: b.typeDate, durationInFrames: b.typeDateEnd - b.typeDate },
          {
            text: "silk road :: the biggest drug market on the internet",
            prompt: "> ",
            at: b.typeMarket,
            durationInFrames: 44,
            size: 0.26,
            color: colors.text,
          },
        ]}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 2: the message ────────────────────────────────────────────
const SceneChat: React.FC<{ b: Beats; start: number }> = ({ b, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = (abs: number) => abs - start;
  const blobIn = sp(frame, fps, rel(b.senderReveal), springs.pop);
  const exit = sp(frame, fps, rel(b.flood), springs.smooth, 16);
  const notif = sp(frame, fps, 6, springs.pop);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.12})` }}>
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 96,
          fontFamily: fonts.mono,
          fontSize: 26,
          fontWeight: 700,
          color: colors.green,
          letterSpacing: "0.12em",
          transform: `scale(${notif})`,
          transformOrigin: "left center",
          opacity: 0.6 + 0.4 * Math.sin(frame / 5),
        }}
      >
        ● 1 NEW PRIVATE MESSAGE
      </div>

      <ChatWindow
        style={{ position: "absolute", left: 150, top: 150 }}
        width={1120}
        title="silkroad :: private messages"
        recipient="Dread Pirate Roberts"
        timestamp="3/13/2013"
        sender={{
          name: "FriendlyChemist",
          color: colors.chemist,
          revealAt: rel(b.senderReveal),
          avatar: <AvatarBadge icon="flask" size={104} color={colors.chemist} />,
          hiddenAvatar: <AvatarBadge icon="unknown" size={104} />,
        }}
        subject={{ text: "LIFE AND DEATH", urgent: true, at: rel(b.subject) }}
        messages={[
          {
            typingFrom: 4,
            at: rel(b.subject) + 10,
            cps: 62,
            // verbatim from the trial exhibit (first message, 3/13/2013)
            text: "can u please get dread pirate roberts to message me RIGHT away ?\nits very serious... a matter of life and death. also has to do with the identities of a dozen top vendors and thousands of silk road customers",
          },
        ]}
        minBodyHeight={300}
      />

      {/* FriendlyChemist himself */}
      <div
        style={{
          position: "absolute",
          left: 1330,
          top: 250,
          width: 460,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${(1 - blobIn) * 80}px) scale(${blobIn})`,
          transformOrigin: "center bottom",
        }}
      >
        <BlobCharacter color={colors.chemist} expression="scared" size={470} seed={2} look={{ x: -0.8, y: 0.2 }} />
        <div
          style={{
            marginTop: 14,
            padding: "8px 18px",
            fontFamily: fonts.mono,
            fontSize: 28,
            fontWeight: 700,
            color: colors.bg,
            background: colors.chemist,
            borderRadius: 6,
          }}
        >
          FriendlyChemist
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: the flood of names ─────────────────────────────────────
const SceneFlood: React.FC<{ b: Beats; start: number }> = ({ b, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = (abs: number) => abs - start;
  const panel = sp(frame, fps, rel(b.counter) - 4, springs.snappy);
  const dealers = sp(frame, fps, rel(b.dealers), springs.pop);

  return (
    <GlitchTransition at={rel(b.demand) - 10} durationInFrames={10} mode="out" seed="flood-out">
      <IconFlood highlightAt={rel(b.dealers)} spread={50} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            marginTop: -70,
            padding: "40px 80px 44px",
            background: "rgba(7,9,11,0.94)",
            border: `2px solid ${colors.green}`,
            borderRadius: 14,
            boxShadow: `0 0 0 14px rgba(7,9,11,0.7), 0 0 120px rgba(57,255,136,0.25), 0 40px 100px rgba(0,0,0,0.8)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            transform: `scale(${0.8 + 0.2 * panel})`,
            opacity: Math.min(1, panel * 1.5),
          }}
        >
          <div style={{ fontFamily: fonts.mono, fontSize: 30, color: colors.dim, letterSpacing: "0.18em" }}>
            CUSTOMER RECORDS
          </div>
          <Counter
            to={5000}
            suffix="+"
            at={rel(b.counter)}
            durationInFrames={b.counterEnd - b.counter}
            fontSize={210}
          />
          <div style={{ fontFamily: fonts.mono, fontSize: 34, fontWeight: 700, color: colors.text, letterSpacing: "0.1em" }}>
            REAL NAMES · HOME ADDRESSES
          </div>
          <div
            style={{
              height: 54 * Math.min(1, dealers),
              overflow: "hidden",
              fontFamily: fonts.mono,
              fontSize: 34,
              fontWeight: 700,
              color: colors.amber,
              letterSpacing: "0.1em",
              transform: `scale(${dealers})`,
              textShadow: `0 0 24px ${colors.amber}77`,
            }}
          >
            + DOZENS OF TOP DEALERS
          </div>
        </div>
      </AbsoluteFill>
    </GlitchTransition>
  );
};

// ─── Scene 4: the demand ─────────────────────────────────────────────
const SceneDemand: React.FC<{ b: Beats; start: number }> = ({ b, start }) => {
  const frame = useCurrentFrame();
  const rel = (abs: number) => abs - start;
  const leakT = frame - rel(b.leak);
  const leakGlitch = leakT >= 0 ? Math.exp(-leakT / 5) : 0;
  const danger = leakT >= 0 ? Math.min(0.5, 0.1 + leakT / 40) : 0;

  return (
    <AbsoluteFill>
      {leakT >= 0 ? (
        <IconFlood instant danger={1} seed="leak" style={{ opacity: danger }} />
      ) : null}
      <Terminal
        style={{ position: "absolute", left: 0, right: 0, top: 210 }}
        align="center"
        fontSize={44}
        color={colors.text}
        lines={[{ text: "his demand is simple:", prompt: "> ", at: rel(b.demandType), durationInFrames: 24 }]}
      />
      <TitleSlam
        text="$500,000"
        color={colors.amber}
        fontSize={400}
        at={rel(b.slamMoney)}
        extraGlitch={leakGlitch}
        style={{ top: 300 }}
      />
      <TitleSlam
        text="OR EVERYTHING GOES PUBLIC"
        color={colors.red}
        fontSize={120}
        at={rel(b.leakText)}
        style={{ top: 700 }}
      />
    </AbsoluteFill>
  );
};

// ─── Scene 5: the other side of the screen ───────────────────────────
const SceneDPR: React.FC<{ b: Beats; start: number }> = ({ b, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = (abs: number) => abs - start;

  const screen = sp(frame, fps, rel(b.screenOn), springs.snappy);
  const reveal = sp(frame, fps, rel(b.dprReveal), springs.smooth, 26);
  const hat = sp(frame, fps, rel(b.alias), springs.smooth, b.aliasEnd - b.alias + 6);
  const push = sp(frame, fps, rel(b.pushIn), springs.heavy, rel(b.cutToBlack) - rel(b.pushIn) + 20);
  const turn = sp(frame, fps, rel(b.turn), springs.smooth, 120);
  const aliasIn = sp(frame, fps, rel(b.alias), springs.snappy);
  const roleIn = sp(frame, fps, rel(b.role), springs.snappy);
  const chipIn = sp(frame, fps, rel(b.movement), springs.pop);

  const flicker = 0.92 + 0.08 * random(`scr-${Math.floor(frame / 3)}`);
  const glow = interpolateColors(turn, [0, 1], [colors.green, colors.red]);
  const light = screen * flicker;
  const DX = 1270; // DPR centre x
  const scale = 1 + push * 0.3;
  const angry = frame >= rel(b.angry);

  return (
    <GlitchTransition at={0} durationInFrames={12} mode="in" seed="room-in">
      {/* the room: pushes in on DPR */}
      <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: `${DX}px 330px` }}>
        {/* screen glow on the back wall */}
        <div
          style={{
            position: "absolute",
            left: DX - 700,
            top: 60,
            width: 1400,
            height: 1000,
            background: `radial-gradient(ellipse at 50% 62%, ${glow} 0%, rgba(0,0,0,0) 62%)`,
            opacity: 0.2 * light,
          }}
        />
        {/* pirate hat draws itself above him */}
        <div style={{ position: "absolute", left: DX - 105, top: 96 + Math.sin(frame / 20) * 5 }}>
          <PirateHat progress={hat} size={210} />
        </div>
        {/* DPR */}
        <div
          style={{
            position: "absolute",
            left: DX - 238,
            top: 270,
            opacity: 0.06 + 0.94 * reveal,
          }}
        >
          <BlobCharacter
            color={colors.dpr}
            accessory="hoodie"
            expression={angry ? "angry" : "calm"}
            size={550}
            seed={1}
            look={{ x: 0, y: 0.9 }}
            lightColor={glow}
            lightAmount={light * (0.35 + 0.65 * reveal)}
          />
        </div>
        {/* desk */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 800,
            bottom: -200,
            background: "linear-gradient(to bottom, #0D1216 0%, #06080A 40%)",
            borderTop: `3px solid rgba(255,255,255,${0.04 + 0.06 * light})`,
          }}
        />
        {/* light pooling on the desk */}
        <div
          style={{
            position: "absolute",
            left: DX - 520,
            top: 790,
            width: 1040,
            height: 150,
            background: `radial-gradient(ellipse at 50% 0%, ${glow} 0%, rgba(0,0,0,0) 70%)`,
            opacity: 0.35 * light,
          }}
        />
        {/* laptop, seen from behind */}
        <div style={{ position: "absolute", left: DX - 250, top: 572 }}>
          <div
            style={{
              position: "absolute",
              left: -26,
              top: -30,
              width: 552,
              height: 120,
              background: `radial-gradient(ellipse at 50% 100%, ${glow} 0%, rgba(0,0,0,0) 70%)`,
              opacity: 0.75 * light,
              filter: "blur(10px)",
            }}
          />
          <div
            style={{
              width: 500,
              height: 290,
              borderRadius: "22px 22px 6px 6px",
              background: "linear-gradient(to bottom, #1A2128, #0C1014)",
              border: "2px solid #2A343D",
              boxShadow: `0 -3px 0 ${glow}${light > 0.5 ? "cc" : "00"}, 0 30px 60px rgba(0,0,0,0.8)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                background: glow,
                opacity: 0.15 + 0.75 * light,
                boxShadow: `0 0 ${40 * light}px ${glow}`,
              }}
            />
          </div>
          <div
            style={{
              width: 560,
              height: 16,
              marginLeft: -30,
              borderRadius: "4px 4px 12px 12px",
              background: "#1C232A",
            }}
          />
        </div>
      </AbsoluteFill>

      {/* labels: stay put while the camera pushes in */}
      <div style={{ position: "absolute", left: 130, top: 250, width: 800 }}>
        <Terminal
          fontSize={34}
          color={colors.dim}
          showCursor={frame < rel(b.alias)}
          lines={[
            { text: "who is on the other side?", prompt: "> ", at: rel(b.roomQuestion), durationInFrames: 30 },
          ]}
        />
        <div style={{ marginTop: 46, opacity: Math.min(1, aliasIn * 2), transform: `translateX(${(1 - aliasIn) * -40}px)` }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 28, color: colors.amber, letterSpacing: "0.2em" }}>
            KNOWN ONLY AS
          </div>
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 132,
              lineHeight: 0.95,
              marginTop: 10,
              color: colors.text,
              textShadow: "0 0 40px rgba(230,230,230,0.25)",
            }}
          >
            <DecodeText text="DREAD PIRATE" at={rel(b.alias)} durationInFrames={14} />
            <br />
            <DecodeText text="ROBERTS" at={rel(b.alias) + 10} durationInFrames={12} />
          </div>
        </div>
        <div
          style={{
            marginTop: 30,
            fontFamily: fonts.mono,
            fontSize: 30,
            color: colors.text,
            opacity: Math.min(1, roleIn * 2),
            transform: `translateX(${(1 - roleIn) * -40}px)`,
          }}
        >
          <span style={{ color: colors.dim }}>role: </span>owner, silk road
          <br />
          <span style={{ color: colors.dim }}>real name: </span>
          <span style={{ background: colors.text, color: colors.text }}>████████████</span>
        </div>
        <div
          style={{
            marginTop: 34,
            display: "inline-block",
            padding: "10px 20px",
            border: `2px solid ${colors.amber}`,
            borderRadius: 6,
            fontFamily: fonts.mono,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: colors.amber,
            transform: `scale(${chipIn})`,
            transformOrigin: "left center",
          }}
        >
          THE QUIET FACE OF "FREEDOM"
        </div>
      </div>
    </GlitchTransition>
  );
};

// ─── Scene 6: the hit ────────────────────────────────────────────────
const SceneHit: React.FC<{ b: Beats; start: number; end: number }> = ({ b, start, end }) => {
  const frame = useCurrentFrame();
  const rel = (abs: number) => abs - start;
  const out = rel(b.glitchOut);
  const outDur = 14;
  // one last blink of the cursor on black
  const blinkOn = out + outDur + 5;
  const blinkOff = Math.min(blinkOn + 12, rel(end) - 5);
  const cursor = frame >= blinkOn && frame < blinkOff;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <GlitchTransition at={out} durationInFrames={outDur} mode="out" seed="hit-out">
        <TitleSlam text="HE ORDERED" color={colors.red} fontSize={300} at={rel(b.slamOrdered)} style={{ top: 190 }} />
        <TitleSlam text="A HIT." color={colors.red} fontSize={420} at={rel(b.slamHit)} style={{ top: 450 }} />
      </GlitchTransition>
      {cursor ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              width: 84,
              height: 150,
              background: colors.green,
              boxShadow: `0 0 40px ${colors.green}`,
            }}
          />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

// ─── Clip 1 ──────────────────────────────────────────────────────────
export const Clip1: React.FC<z.infer<typeof clip1Schema>> = ({ showCaptions }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const cue = useMemo(() => createCues(words, fps), [fps]);
  const b = useBeats(cue);
  const seq = (from: number, to: number) => ({ from, durationInFrames: Math.max(1, to - from) });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio src={staticFile("audio/clip1.mp3")} />
      <Background>
        <Sequence {...seq(0, b.chatIn + 12)} name="1 Terminal">
          <SceneTerminal b={b} exitAt={b.chatIn - 4} />
        </Sequence>
        <Sequence {...seq(b.chatIn, b.flood + 16)} name="2 Message">
          <SceneChat b={b} start={b.chatIn} />
        </Sequence>
        <Sequence {...seq(b.flood, b.demand)} name="3 Flood">
          <SceneFlood b={b} start={b.flood} />
        </Sequence>
        <Sequence {...seq(b.demand, b.room)} name="4 Demand">
          <SceneDemand b={b} start={b.demand} />
        </Sequence>
        <Sequence {...seq(b.room, b.cutToBlack)} name="5 DPR">
          <SceneDPR b={b} start={b.room} />
        </Sequence>
        <Sequence {...seq(b.cutToBlack, durationInFrames)} name="6 Hit">
          <SceneHit b={b} start={b.cutToBlack} end={durationInFrames} />
        </Sequence>
        <Flash at={b.leak} color={colors.red} peak={0.6} />
        <Flash at={b.slamHit} color={colors.red} peak={0.35} durationInFrames={10} />
      </Background>
      <Captions words={captionWords} enabled={showCaptions} />
    </AbsoluteFill>
  );
};
