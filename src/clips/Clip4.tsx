import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import transcript from "../../public/audio/clip4.json";
import { colors, fonts, springs } from "../theme";
import { captionNames, sp, useCues, type Word } from "../lib/timing";
import {
  BlobCharacter,
  Card,
  ChatWindow,
  Chemist,
  Chip,
  ClipShell,
  Counter,
  DecodeText,
  Dpr,
  DprDesk,
  Flash,
  NameTag,
  Parcel,
  Pop,
  RedWhite,
  SENDERS,
  Scene,
  Terminal,
  TitleSlam,
  Vanish,
  mono,
} from "../components";

export const clip4Schema = z.object({ showCaptions: z.boolean() });
const words = transcript.words as Word[];
const capWords = captionNames(words);

export const Clip4: React.FC<z.infer<typeof clip4Schema>> = ({ showCaptions }) => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useCues(words);

  const tWorse = c("Worse");
  const tTold = c("He told");
  const tOffer = c("His offer");
  const tAnswer = c("The answer");
  const tBehind = c("And behind");

  const ship = sp(frame, fps, c("supplied"), springs.smooth, 22);
  const unpaid = sp(frame, fps, c("so was"), springs.snappy);
  const push = sp(frame, fps, tBehind, springs.heavy, D - tBehind);

  return (
    <ClipShell audio="audio/clip4.mp3" words={capWords} showCaptions={showCaptions}>
      {/* 1 + 2: his story. FriendlyChemist stays on the left throughout. */}
      <Scene from={0} to={tTold}>
        <Pop at={2} origin="center bottom" style={{ left: 150, top: 300 }}>
          <Chemist size={440} look={{ x: 0.8, y: 0 }} />
          <NameTag text="FriendlyChemist" color={colors.chemist} />
        </Pop>

        <Scene from={0} to={tWorse}>
          <Terminal
            style={{ position: "absolute", left: 150, top: 120 }}
            fontSize={38}
            color={colors.dim}
            lines={[{ text: "friendlychemist's story:", prompt: "> ", at: c("story") - 8, durationInFrames: 26 }]}
          />
          <Pop at={c("vanished") - 6} origin="center bottom" style={{ left: 1420, top: 330 }}>
            <Vanish at={c("gone")}>
              <BlobCharacter color={colors.extras[1]} size={400} seed={8} look={{ x: -0.8, y: 0 }} />
            </Vanish>
            <NameTag text={frame >= c("gone") ? "VANISHED" : "THE DEALER"} color={frame >= c("gone") ? colors.red : colors.extras[1]} />
          </Pop>
          {frame >= c("supplied") && frame < c("gone") ? (
            <div
              style={{
                position: "absolute",
                left: interpolate(ship, [0, 1], [520, 1370]),
                top: 610 - Math.sin(Math.min(1, ship) * Math.PI) * 60,
              }}
            >
              <Parcel size={90} />
            </div>
          ) : null}
          <div style={{ position: "absolute", left: 560, width: 860, top: 250, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {frame >= c("nearly") ? (
              <div style={{ position: "relative" }}>
                <Counter to={900000} prefix="$" at={c("nearly")} durationInFrames={c("of") - c("nearly")} fontSize={150} color={unpaid > 0.5 ? colors.red : colors.amber} />
                <div style={{ position: "absolute", left: -10, top: "50%", height: 10, width: `${unpaid * 104}%`, background: colors.red, boxShadow: `0 0 20px ${colors.red}` }} />
              </div>
            ) : null}
            <Pop at={c("product")} from="up" style={{ position: "relative", marginTop: 14 }}>
              <span style={{ ...mono(36, colors.dim), letterSpacing: "0.16em" }}>OF PRODUCT, HANDED OVER</span>
            </Pop>
          </div>
          <Chip at={c("credit")} text="ON CREDIT" origin="center center" style={{ left: 860, top: 500 }} />
          <Chip at={c("money")} text="NEVER PAID BACK" color={colors.red} filled origin="center center" style={{ left: 800, top: 600 }} />
        </Scene>

        <Scene from={tWorse} to={tTold}>
          <div
            style={{
              position: "absolute",
              left: 900,
              top: 100,
              width: 1100,
              height: 900,
              background: "radial-gradient(ellipse at 50% 60%, rgba(255,59,59,0.22), rgba(0,0,0,0) 62%)",
              opacity: sp(frame, fps, c("dangerous"), springs.smooth, 20),
            }}
          />
          {[0, 1, 2].map((i) => (
            <Pop key={i} at={c("dangerous") + i * 5} origin="center bottom" style={{ left: 1010 + i * 250, top: i === 1 ? 380 : 320 }}>
              <RedWhite size={i === 1 ? 470 : 420} expression="angry" seed={3 + i} look={{ x: -0.9, y: 0.2 }} />
            </Pop>
          ))}
          <TitleSlam text="BIKER GANG" color={colors.red} fontSize={190} at={c("biker")} style={{ left: 700, top: 80 }} />
          <Chip at={c("Canadian")} text="CANADA" color={colors.red} style={{ left: 640, top: 150 }} />
          <Pop at={c("wanted")} from="right" style={{ left: 560, top: 812 }}>
            <span style={{ ...mono(44, colors.red), fontWeight: 700 }}>◀━━ THEY WANT THEIR MONEY</span>
          </Pop>
        </Scene>
      </Scene>

      {/* 3: his messages to DPR */}
      <Scene from={tTold} to={tOffer}>
        <ChatWindow
          style={{ position: "absolute", left: 110, top: 90 }}
          width={1130}
          enterAt={tTold}
          fontSize={30}
          title="silkroad :: private messages"
          sender={SENDERS.chemist}
          recipient="Dread Pirate Roberts"
          timestamp="3/14/2013"
          minBodyHeight={420}
          messages={[
            {
              typingFrom: tTold + 6,
              at: c("scared"),
              cps: 60,
              text: "im freaking out here! that was not my money! im getting scared. [...] im scared for my family!",
            },
            { at: c("planted"), cps: 60, text: "i put a keylogger on lucydrops computer when he left the room one day" },
            {
              at: c("every") - 6,
              cps: 60,
              text: "i also have the indentities of 9 top vendors and 15 smaller vendors and thousands of customers",
            },
          ]}
        />
        <Pop at={c("planted")} from="right" style={{ left: 1300, top: 130 }}>
          <Card accent={colors.chemist} style={{ width: 520, height: 300 }}>
            <Terminal
              fontSize={30}
              color={colors.chemist}
              lines={[
                { text: "keylogger: ACTIVE", prompt: "> ", at: c("keylogger") },
                { text: "captured: logins", prompt: "> ", at: c("had") },
                { text: "captured: customer lists", prompt: "> ", at: c("customer") },
                { text: "captured: ADDRESSES", prompt: "> ", at: c("address"), color: colors.red },
              ]}
            />
          </Card>
        </Pop>
        <Pop at={tTold + 4} origin="center bottom" style={{ left: 1420, top: 470 }}>
          <Chemist size={330} look={{ x: -0.8, y: 0 }} />
        </Pop>
      </Scene>

      {/* 4: the offer */}
      <Scene from={tOffer} to={tAnswer}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", ...mono(38, colors.dim) }}>&gt; his offer:</div>
        <TitleSlam text="PAY" color={colors.amber} fontSize={440} at={c("Pay")} style={{ top: 170 }} />
        <TitleSlam text="OR IT ALL LEAKS" color={colors.red} fontSize={180} at={c("leaks")} style={{ top: 620 }} />
        <Flash at={c("leaks")} peak={0.5} />
      </Scene>

      {/* 5: the cold reply */}
      <Scene from={tAnswer} to={tBehind}>
        <ChatWindow
          style={{ position: "absolute", left: 110, top: 170 }}
          width={1120}
          enterAt={tAnswer}
          title="silkroad :: private messages"
          sender={SENDERS.dpr}
          recipient="FriendlyChemist"
          timestamp="3/15/2013"
          minBodyHeight={280}
          messages={[
            {
              typingFrom: tAnswer + 6,
              at: c("Send") - 14,
              cps: 48,
              text: "I will get in touch with lucydrop and get back to you. Send me all of the information you've harvested so I can verify it.",
            },
          ]}
        />
        <Pop at={tAnswer + 3} origin="center bottom" style={{ left: 1340, top: 300 }}>
          <Dpr size={480} look={{ x: -0.8, y: 0.2 }} />
        </Pop>
        <Chip at={c("cold")} text="COLD." color={colors.text} style={{ left: 1330, top: 170 }} />
        <Chip at={c("calm")} text="CALM." color={colors.text} style={{ left: 1560, top: 170 }} />
      </Scene>

      {/* 6: behind the scenes, the hunt */}
      <Scene from={tBehind} to={D} exit="glitch">
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + push * 0.16})`, transformOrigin: "1350px 400px" }}>
          <DprDesk x={1350} />
        </div>
        <Terminal
          style={{ position: "absolute", left: 130, top: 170 }}
          fontSize={40}
          color={colors.green}
          lines={[
            { text: "meanwhile, behind the scenes", prompt: "> ", at: c("behind"), durationInFrames: 24, color: colors.dim },
            { text: "identify --user FriendlyChemist", prompt: "> ", at: c("started"), durationInFrames: 24 },
          ]}
        />
        <Pop at={c("hunting") + 8} from="left" style={{ left: 130, top: 360 }}>
          <Card style={{ width: 800 }}>
            <div style={{ ...mono(26, colors.dim), letterSpacing: "0.18em" }}>TARGET</div>
            <div style={{ fontFamily: fonts.display, fontSize: 96, lineHeight: 1.05, color: colors.chemist }}>FRIENDLYCHEMIST</div>
            <div style={{ ...mono(38), marginTop: 14 }}>
              <span style={{ color: colors.dim }}>real name: </span>
              <span style={{ color: colors.amber, fontWeight: 700 }}>
                <DecodeText text="xxxxx xxxxxxx" at={1e9} />
              </span>
            </div>
            <div style={{ ...mono(38), marginTop: 6 }}>
              <span style={{ color: colors.dim }}>address: </span>
              <span style={{ color: colors.amber, fontWeight: 700 }}>
                <DecodeText text="xxxxxxxxxxxxxxxx" at={1e9} />
              </span>
            </div>
            <div style={{ ...mono(30, colors.red), marginTop: 16, opacity: 0.6 + 0.4 * Math.sin(frame / 4) }}>● SEARCHING...</div>
          </Card>
        </Pop>
      </Scene>
    </ClipShell>
  );
};
