import React from "react";
import { random, useCurrentFrame } from "remotion";
import { z } from "zod";
import transcript from "../../public/audio/clip7.json";
import { colors, fonts, springs } from "../theme";
import { captionNames, sp, useCues, type Word } from "../lib/timing";
import {
  AvatarBadge,
  BlobCharacter,
  Card,
  ChatWindow,
  Chemist,
  Chip,
  ClipShell,
  CoinIcon,
  Counter,
  CrossOut,
  Crosshair,
  DprDesk,
  Flash,
  NameTag,
  Pop,
  RedWhite,
  SENDERS,
  Scene,
  TitleSlam,
  Vanish,
  mono,
} from "../components";

export const clip7Schema = z.object({ showCaptions: z.boolean() });
const words = transcript.words as Word[];
const capWords = captionNames(words);

const FOUR = [colors.extras[3], colors.extras[0], colors.extras[1], colors.extras[2]];

export const Clip7: React.FC<z.infer<typeof clip7Schema>> = ({ showCaptions }) => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useCues(words);

  const tNews = c("But Red");
  const tNamed = c("He named");
  const tHouse = c("And that man");
  const tPush = c("Then Red");
  const tSend = c("He sends");
  const tMind = c("In his mind");

  return (
    <ClipShell audio="audio/clip7.mp3" words={capWords} showCaptions={showCaptions}>
      {/* 1: the photo arrives, and is deleted */}
      <Scene from={0} to={tNews}>
        <DprDesk x={1400} look={{ x: -0.6, y: frame >= c("looks") ? 0.9 : 0.3 }} />
        <Scene from={0} to={c("thanks") - 4}>
          <Pop at={c("photo")} origin="left center" style={{ left: 150, top: 150 }}>
            <span style={{ ...mono(30, colors.amber), fontWeight: 700, letterSpacing: "0.12em" }}>● 1 NEW ATTACHMENT</span>
          </Pop>
          <Pop at={c("photo") + 3} style={{ left: 150, top: 210 }}>
            <Vanish at={c("deletes")}>
              <Card style={{ width: 700, padding: 22 }}>
                {/* the picture itself is never shown */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 3, height: 380, borderRadius: 6, overflow: "hidden" }}>
                  {new Array(14 * 8).fill(0).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        background: `hsl(${random(`px-h-${i}`) * 20}, ${10 + random(`px-s-${i}`) * 25}%, ${6 + random(`px-l-${i}-${Math.floor(frame / 6)}`) * 16}%)`,
                      }}
                    />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, ...mono(26, colors.dim) }}>
                  <span>photo.jpg</span>
                  <span style={{ color: colors.amber }}>code: 83746102</span>
                </div>
              </Card>
            </Vanish>
          </Pop>
          <Chip at={c("deletes") + 8} text="FILE DELETED" color={colors.red} filled fontSize={48} origin="center center" style={{ left: 300, top: 400 }} />
        </Scene>
        <ChatWindow
          style={{ position: "absolute", left: 110, top: 190 }}
          width={980}
          enterAt={c("thanks") - 4}
          fontSize={32}
          title="silkroad :: private messages"
          sender={SENDERS.dpr}
          recipient="redandwhite"
          timestamp="4/5/2013"
          minBodyHeight={250}
          messages={[
            {
              at: c("thanks") + 2,
              cps: 60,
              text: "I've received the picture and deleted it. Thank you again for your swift action.",
            },
          ]}
        />
      </Scene>

      {/* 2: more news, and a name */}
      <Scene from={tNews} to={tHouse}>
        <Pop at={tNews} origin="center bottom" style={{ left: 100, top: 300 }}>
          <RedWhite size={440} look={{ x: 0.8, y: 0 }} />
          <NameTag text="redandwhite" color={colors.redandwhite} />
        </Pop>
        <Chip at={c("more")} text="MORE NEWS" color={colors.red} style={{ left: 130, top: 180 }} />
        <ChatWindow
          style={{ position: "absolute", left: 600, top: 70 }}
          width={1210}
          enterAt={c("He says")}
          fontSize={30}
          title="silkroad :: private messages"
          sender={SENDERS.rw}
          recipient="Dread Pirate Roberts"
          timestamp="4/1/2013"
          minBodyHeight={110}
          messages={[
            {
              typingFrom: c("He says") + 5,
              at: c("died"),
              cps: 55,
              text: "They questioned him and he spilled everything he knew.",
            },
          ]}
        />
        <Pop at={tNamed} from="up" style={{ left: 600, top: 480 }}>
          <Card accent={colors.red} style={{ width: 1210, display: "flex", gap: 34, alignItems: "center", padding: "24px 34px" }}>
            <AvatarBadge icon="unknown" size={150} />
            <div style={{ flex: 1 }}>
              <div style={{ ...mono(24, colors.dim), letterSpacing: "0.18em" }}>NAMED BY FRIENDLYCHEMIST</div>
              <div style={{ ...mono(46), fontWeight: 700, marginTop: 6 }}>
                name: <span style={{ background: colors.text, color: colors.text }}>██████ ██████</span>
              </div>
              <div style={{ ...mono(30, colors.dim), marginTop: 10, height: 44, position: "relative" }}>
                known accounts:
                <Chip at={c("fake")} text="tony76" color={colors.amber} fontSize={26} style={{ left: 290, top: -6 }} />
                <Chip at={c("accounts")} text="+ more" color={colors.amber} fontSize={26} style={{ left: 450, top: -6 }} />
              </div>
            </div>
          </Card>
        </Pop>
        <Chip at={c("serial")} text="SERIAL SCAMMER" color={colors.red} filled fontSize={36} style={{ left: 1380, top: 440 }} />
      </Scene>

      {/* 3 + 4: four people in one house */}
      <Scene from={tHouse} to={tSend}>
        {FOUR.map((col, i) => {
          const x = 330 + i * 420;
          const at = i === 0 ? tHouse : c("three") + (i - 1) * 4;
          return (
            <React.Fragment key={i}>
              <Pop at={at} origin="center bottom" style={{ left: x - 121, top: 90 }}>
                <BlobCharacter color={col} size={280} seed={10 + i} expression={frame >= c("all", 1) + 10 ? "scared" : "calm"} sweat={false} />
                <NameTag text={i === 0 ? "THE SCAMMER" : `ROOMMATE ${i}`} color={i === 0 ? colors.red : col} fontSize={22} />
              </Pop>
              <Crosshair at={i === 0 ? c("gone") : c("all", 1) + i * 4} size={230} style={{ left: x - 115, top: 95 }} />
            </React.Fragment>
          );
        })}
        <Scene from={tHouse} to={tPush}>
          <Chip at={c("all")} text="ALL IN ON IT" fontSize={44} origin="center center" style={{ left: 780, top: 520 }} />
          <TitleSlam text="DPR WANTS HIM GONE" color={colors.red} fontSize={130} at={c("wants")} style={{ top: 640 }} />
        </Scene>
        <ChatWindow
          style={{ position: "absolute", left: 310, top: 470 }}
          width={1300}
          enterAt={tPush}
          fontSize={27}
          title="silkroad :: private messages"
          sender={SENDERS.rw}
          recipient="Dread Pirate Roberts"
          timestamp="4/6/2013"
          minBodyHeight={100}
          messages={[
            {
              at: c("pushes") - 10,
              cps: 80,
              text: "if you would like to do the others as well, I would be able to have it done for 500k USD. [...] I would prefer to do all 4",
            },
            {
              own: true,
              label: "DreadPirateRoberts",
              at: c("agrees"),
              cps: 50,
              text: "hmm... ok, I'll defer to your better judgement",
            },
          ]}
        />
        <Flash at={c("all", 1)} peak={0.3} durationInFrames={10} />
      </Scene>

      {/* 5: 3,000 more bitcoin */}
      <Scene from={tSend} to={tMind}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
          <div style={{ transform: `rotate(${Math.sin(frame / 15) * 8}deg)` }}>
            <CoinIcon size={190} />
          </div>
          <Counter to={3000} prefix="+" suffix=" BTC" at={c("3000")} durationInFrames={c("more", 1) - c("3000")} fontSize={230} color={colors.amber} />
        </div>
        <Pop at={c("Bitcoin")} from="up" style={{ left: 0, right: 0, top: 440, textAlign: "center" }}>
          <span style={{ ...mono(34, colors.dim) }}>"$500k in btc (3,000 @ $166/btc) has been sent" · tx e7db5246...286c6c67</span>
        </Pop>
        <TitleSlam text="$500,000" color={colors.text} fontSize={300} at={c("half")} style={{ top: 510 }} />
      </Scene>

      {/* 6: five people */}
      <Scene from={tMind} to={D} exit="glitch">
        <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", ...mono(38, colors.dim) }}>&gt; in his mind:</div>
        {[colors.chemist, ...FOUR].map((col, i) => {
          const x = 280 + i * 340;
          const cross = sp(frame, fps, c("ordered") + i * 3, springs.smooth, 9);
          return (
            <React.Fragment key={i}>
              <Pop at={tMind + i * 3} origin="center bottom" style={{ left: x - 113, top: 440 }}>
                {i === 0 ? <Chemist size={260} sweat={false} shake={0} /> : <BlobCharacter color={col} size={260} seed={10 + i} />}
              </Pop>
              <div style={{ position: "absolute", left: x - 105, top: 460 }}>
                <CrossOut progress={cross} size={210} />
              </div>
            </React.Fragment>
          );
        })}
        <TitleSlam text="5 HITS ORDERED" color={colors.red} fontSize={230} at={c("five")} style={{ top: 150 }} />
        <Flash at={c("five")} peak={0.5} />
      </Scene>
    </ClipShell>
  );
};
