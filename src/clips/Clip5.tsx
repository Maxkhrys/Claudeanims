import React from "react";
import { useCurrentFrame } from "remotion";
import { z } from "zod";
import transcript from "../../public/audio/clip5.json";
import { colors, fonts, springs } from "../theme";
import { captionNames, sp, useCues, type Word } from "../lib/timing";
import {
  ChatWindow,
  Chemist,
  Chip,
  ClipShell,
  Dpr,
  DprDesk,
  Flash,
  NameTag,
  Pop,
  RedWhite,
  SENDERS,
  Scene,
  Terminal,
  TitleSlam,
  mono,
} from "../components";

export const clip5Schema = z.object({ showCaptions: z.boolean() });
const words = transcript.words as Word[];
const capWords = captionNames(words);

export const Clip5: React.FC<z.infer<typeof clip5Schema>> = ({ showCaptions }) => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useCues(words);

  const tSays = c("He says he speaks");
  const tWild = c("Here's");
  const tTells = c("He tells");
  const tTrio = c("A blackmailer");
  const tBack = c("But Friendly");
  const t72 = c("72");

  const table = sp(frame, fps, c("turning"), springs.snappy);
  const dim72 = sp(frame, fps, t72 - 3, springs.smooth, 8);
  const secs = Math.max(0, 59 - Math.floor((frame - t72) / fps));

  return (
    <ClipShell audio="audio/clip5.mp3" words={capWords} showCaptions={showCaptions}>
      {/* 1: a new user appears */}
      <Scene from={0} to={tSays}>
        <Terminal
          style={{ position: "absolute", left: 0, right: 0, top: 150 }}
          align="center"
          fontSize={44}
          color={colors.text}
          showCursor={frame < c("Red")}
          lines={[{ text: "new user online", prompt: "> ", at: c("new"), durationInFrames: 22 }]}
        />
        <TitleSlam text="REDANDWHITE" color={colors.red} fontSize={250} at={c("Red")} style={{ top: 230 }} />
        <Pop at={c("Red")} from="slam" origin="center bottom" style={{ left: 960 - 165, top: 500 }}>
          <RedWhite size={380} />
        </Pop>
        <Flash at={c("Red")} peak={0.35} durationInFrames={10} />
      </Scene>

      {/* 2: who he says he is */}
      <Scene from={tSays} to={tWild}>
        <ChatWindow
          style={{ position: "absolute", left: 110, top: 80 }}
          width={1150}
          enterAt={tSays}
          fontSize={30}
          title="silkroad :: private messages"
          sender={SENDERS.rw}
          recipient="Dread Pirate Roberts"
          timestamp="3/25/2013"
          minBodyHeight={430}
          messages={[
            {
              typingFrom: tSays + 5,
              at: c("speaks") + 4,
              cps: 60,
              text: "I was asked to contact you. We are the people friendlychemist owes money to.",
            },
            {
              at: c("claims"),
              cps: 55,
              text: "We have a majority hold over most of the movement of products in western Canada",
            },
            { at: c("flatly"), cps: 55, text: "We hold him and him only responsible for the missing product/money." },
          ]}
        />
        <Pop at={tSays + 3} origin="center bottom" style={{ left: 1370, top: 290 }}>
          <RedWhite size={450} look={{ x: -0.8, y: 0.1 }} />
          <NameTag text="redandwhite" color={colors.redandwhite} />
        </Pop>
        <Chip at={c("Western")} text="WESTERN CANADA" color={colors.red} style={{ left: 1390, top: 170 }} />
        <Chip at={c("their")} text="FRIENDLYCHEMIST = THEIR PROBLEM" color={colors.red} filled fontSize={34} style={{ left: 420, top: 806 }} />
      </Scene>

      {/* 3: DPR doesn't panic. He pitches. */}
      <Scene from={tWild} to={tTrio}>
        <DprDesk x={1400} />
        <Scene from={tWild} to={tTells}>
          <Terminal
            style={{ position: "absolute", left: 130, top: 170 }}
            fontSize={40}
            color={colors.dim}
            showCursor={frame < c("panic")}
            lines={[{ text: "here's where it gets wild", prompt: "> ", at: c("where"), durationInFrames: 22 }]}
          />
          <Chip at={c("panic")} text="NO PANIC" color={colors.text} fontSize={40} style={{ left: 130, top: 270 }} />
          <TitleSlam text="HE PITCHES." color={colors.green} fontSize={250} at={c("pitches")} style={{ left: 124, right: "auto", top: 380, alignItems: "flex-start" }} />
        </Scene>
        <ChatWindow
          style={{ position: "absolute", left: 110, top: 130 }}
          width={940}
          enterAt={tTells}
          fontSize={32}
          title="silkroad :: private messages"
          sender={SENDERS.dpr}
          recipient="redandwhite"
          timestamp="3/27/2013"
          minBodyHeight={230}
          messages={[
            {
              typingFrom: tTells + 5,
              at: c("should"),
              cps: 50,
              text: "In those categories, I think you could be doing over $1M in sales a week...",
            },
          ]}
        />
        <Chip at={c("become")} text="OFFER: SELL ON SILK ROAD" color={colors.green} style={{ left: 130, top: 690 }} />
        <Chip at={c("setup")} text="SETUP FEE: WAIVED" style={{ left: 130, top: 780 }} />
      </Scene>

      {/* 4: a business meeting */}
      <Scene from={tTrio} to={tBack}>
        <Pop at={c("blackmailer")} origin="center bottom" style={{ left: 480 - 173, top: 290 }}>
          <Chemist size={400} look={{ x: 0.8, y: 0 }} />
          <NameTag text="THE BLACKMAILER" color={colors.chemist} />
        </Pop>
        <Pop at={c("biker")} origin="center bottom" style={{ left: 960 - 173, top: 290 }}>
          <RedWhite size={400} />
          <NameTag text="THE BIKER GANG" color={colors.redandwhite} />
        </Pop>
        <Pop at={c("dark")} origin="center bottom" style={{ left: 1440 - 173, top: 290 }}>
          <Dpr size={400} look={{ x: -0.8, y: 0 }} />
          <NameTag text="THE KINGPIN" color={colors.green} />
        </Pop>
        {/* the meeting table slides in */}
        <div
          style={{
            position: "absolute",
            left: 200,
            width: 1520,
            top: 610 + (1 - table) * 500,
            height: 190,
            borderRadius: "18px 18px 8px 8px",
            background: "linear-gradient(to bottom, #1B232A, #0B0F13)",
            border: "2px solid #2A343D",
            boxShadow: "0 -10px 40px rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-start",
            paddingTop: 22,
          }}
        >
          {["BLACKMAILER", "BIKER GANG", "KINGPIN"].map((t) => (
            <div key={t} style={{ ...mono(24, colors.bg), fontWeight: 700, background: colors.text, padding: "8px 18px", borderRadius: 4 }}>
              {t}
            </div>
          ))}
        </div>
        <TitleSlam text="A BUSINESS MEETING" color={colors.amber} fontSize={170} at={c("business")} style={{ top: 70 }} />
      </Scene>

      {/* 5: 72 hours */}
      <Scene from={tBack} to={D} exit="glitch">
        <div style={{ position: "absolute", inset: 0, opacity: 1 - dim72 * 0.8 }}>
          <ChatWindow
            style={{ position: "absolute", left: 110, top: 100 }}
            width={1130}
            enterAt={tBack}
            title="silkroad :: private messages"
            sender={SENDERS.chemist}
            recipient="Dread Pirate Roberts"
            timestamp="3/29/2013"
            subject={{ text: "DEADLINE", urgent: true, at: c("deadline") }}
            minBodyHeight={300}
            messages={[
              {
                typingFrom: tBack + 5,
                at: c("isn't"),
                cps: 58,
                text: "u leave me no choice i want 500k usd withn 72hrs or i am going to post all the info i have.",
              },
            ]}
          />
          <Pop at={tBack + 3} origin="center bottom" style={{ left: 1350, top: 300 }}>
            <Chemist size={450} look={{ x: -0.8, y: 0 }} />
          </Pop>
        </div>
        <TitleSlam text="72 HOURS" color={colors.red} fontSize={400} at={t72} style={{ top: 220 }} />
        <Pop at={t72 + 6} from="up" style={{ left: 0, right: 0, top: 650, textAlign: "center" }}>
          <span style={{ ...mono(90, colors.red), fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            71:59:{String(secs).padStart(2, "0")}
          </span>
        </Pop>
        <Flash at={t72} peak={0.5} />
      </Scene>
    </ClipShell>
  );
};
