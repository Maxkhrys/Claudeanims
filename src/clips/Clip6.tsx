import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";
import transcript from "../../public/audio/clip6.json";
import { colors, fonts, springs } from "../theme";
import { captionNames, sp, useCues, type Word } from "../lib/timing";
import {
  AvatarBadge,
  Card,
  ChatWindow,
  Chemist,
  Chip,
  ClipShell,
  CoinIcon,
  Counter,
  Flash,
  Pop,
  RedWhite,
  SENDERS,
  Scene,
  Terminal,
  TitleSlam,
  mono,
} from "../components";

export const clip6Schema = z.object({ showCaptions: z.boolean() });
const words = transcript.words as Word[];
const capWords = captionNames(words);

const QuoteRow: React.FC<{ at: number; name: string; note: string; price: string; color: string }> = ({
  at,
  name,
  note,
  price,
  color,
}) => (
  <Pop at={at} from="left" style={{ position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", padding: "22px 0", borderBottom: `2px solid ${colors.line}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ ...mono(50), fontWeight: 700 }}>{name}</div>
        <div style={{ ...mono(26, colors.dim), marginTop: 4 }}>{note}</div>
      </div>
      <div style={{ ...mono(58, color), fontWeight: 700, textShadow: `0 0 24px ${color}55` }}>{price}</div>
    </div>
  </Pop>
);

export const Clip6: React.FC<z.infer<typeof clip6Schema>> = ({ showCaptions }) => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useCues(words);

  const tQuote = c("Red and White answers");
  const tHaggle = c("The Dread Pirate Roberts haggles");
  const tPay = c("At the end");
  const tProof = c("Red and White even");
  const tDone = c("Then");

  const settle = sp(frame, fps, c("settle"), springs.smooth, 10);
  const chain = sp(frame, fps, c("still"), springs.snappy);
  const flow = sp(frame, fps, c("sends"), springs.smooth, 15);

  return (
    <ClipShell audio="audio/clip6.mp3" words={capWords} showCaptions={showCaptions}>
      {/* 1: the bounty */}
      <Scene from={0} to={tQuote}>
        <ChatWindow
          style={{ position: "absolute", left: 110, top: 110 }}
          width={1130}
          enterAt={3}
          fontSize={32}
          title="silkroad :: private messages"
          sender={SENDERS.dpr}
          recipient="redandwhite"
          timestamp="3/29/2013"
          minBodyHeight={330}
          messages={[
            {
              typingFrom: c("messages"),
              at: c("asks") - 20,
              cps: 52,
              text: "I would like to put a bounty on his head if it's not too much trouble for you. What would be an adequate amount to motivate you to find him?",
            },
          ]}
        />
        <Pop at={c("bounty")} from="slam" style={{ left: 1310, top: 130 }}>
          <Card accent={colors.red} style={{ width: 480, textAlign: "center", padding: "20px 30px 30px" }}>
            <div style={{ fontFamily: fonts.display, fontSize: 130, lineHeight: 1, color: colors.red, textShadow: "0 0 30px rgba(255,59,59,0.5)" }}>BOUNTY</div>
            <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>
              <Chemist size={300} />
            </div>
            <div style={{ ...mono(28, colors.chemist), fontWeight: 700 }}>FRIENDLYCHEMIST</div>
            <div style={{ ...mono(28, colors.dim), marginTop: 6 }}>price: ???</div>
          </Card>
        </Pop>
        <Flash at={c("bounty")} peak={0.35} durationInFrames={10} />
      </Scene>

      {/* 2: the quote */}
      <Scene from={tQuote} to={tHaggle}>
        <Pop at={tQuote} origin="center bottom" style={{ left: 120, top: 300 }}>
          <RedWhite size={480} look={{ x: 0.8, y: 0 }} />
        </Pop>
        <Pop at={c("quote") - 8} from="up" style={{ left: 660, top: 90 }}>
          <Card style={{ width: 1120, padding: "30px 44px 36px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <div style={{ fontFamily: fonts.display, fontSize: 104, lineHeight: 1, color: colors.text }}>PRICE QUOTE</div>
              <div style={{ flex: 1 }} />
              <div style={{ ...mono(24, colors.dim), textAlign: "right" }}>from: redandwhite · 3/30/2013</div>
            </div>
            <div style={{ borderTop: `2px solid ${colors.line}`, marginTop: 14 }}>
              <QuoteRow at={c("clean")} name="CLEAN" note="made to look like he just vanished" price="300k+ USD" color={colors.red} />
              <QuoteRow at={c("messy")} name="NON-CLEAN" note="the cheaper option" price="150-200k USD" color={colors.amber} />
            </div>
            <Pop at={c("costs")} from="up" style={{ position: "relative", marginTop: 20 }}>
              <div style={{ ...mono(25, colors.dim), lineHeight: 1.5 }}>
                "These prices pay for 2 professional hitters including their travel expenses and work they put in."
              </div>
            </Pop>
          </Card>
        </Pop>
        <Chip at={c("kitchen")} text="LIKE A KITCHEN QUOTE" color={colors.text} fontSize={28} style={{ left: 130, top: 190 }} />
      </Scene>

      {/* 3: haggling */}
      <Scene from={tHaggle} to={tPay}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - settle * 0.93 }}>
          <ChatWindow
            style={{ position: "absolute", left: 385, top: 130 }}
            width={1150}
            enterAt={tHaggle}
            fontSize={32}
            title="silkroad :: private messages"
            sender={SENDERS.dpr}
            recipient="redandwhite"
            timestamp="3/31/2013"
            minBodyHeight={300}
            messages={[
              {
                at: tHaggle + 8,
                cps: 75,
                text: "Don't want to be a pain here, but the price seems high. Not long ago, I had a clean hit done for $80k. Are the prices you quoted the best you can do?",
              },
            ]}
          />
        </div>
        <Pop at={c("settle")} from="up" style={{ left: 0, right: 0, top: 230, textAlign: "center" }}>
          <span style={{ ...mono(40, colors.dim), letterSpacing: "0.2em" }}>AGREED PRICE</span>
        </Pop>
        <TitleSlam text="$150,000" color={colors.amber} fontSize={420} at={c("150000")} style={{ top: 290 }} />
      </Scene>

      {/* 4: the payment, on the blockchain */}
      <Scene from={tPay} to={tProof}>
        <Terminal
          style={{ position: "absolute", left: 130, top: 90 }}
          fontSize={44}
          lines={[{ text: "MARCH 31, 2013", at: c("March"), durationInFrames: 22 }]}
        />
        <Pop at={c("sends") - 6} from="up" style={{ left: 130, top: 190 }}>
          <Card style={{ width: 1660, height: 330, display: "flex", alignItems: "center", padding: "20px 50px" }}>
            <div style={{ width: 300, textAlign: "center" }}>
              <AvatarBadge icon="skull" size={130} color={colors.green} />
              <div style={{ ...mono(26, colors.green), fontWeight: 700, marginTop: 10 }}>DreadPirateRoberts</div>
            </div>
            <div style={{ flex: 1, position: "relative", height: 280 }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 6, display: "flex", justifyContent: "center" }}>
                {frame >= c("1670") ? (
                  <Counter to={1670} suffix=" BTC" at={c("1670")} durationInFrames={28} fontSize={120} color={colors.amber} />
                ) : null}
              </div>
              <div style={{ position: "absolute", left: 20, right: 20, top: 180, height: 6, background: colors.line }}>
                <div style={{ width: `${flow * 100}%`, height: "100%", background: colors.amber, boxShadow: `0 0 16px ${colors.amber}` }} />
              </div>
              {frame >= c("sends")
                ? [0, 1, 2, 3].map((i) => {
                    const t = ((frame - c("sends") + i * 10) % 40) / 40;
                    return (
                      <div key={i} style={{ position: "absolute", left: `${interpolate(t, [0, 1], [2, 92])}%`, top: 158, opacity: Math.sin(t * Math.PI) }}>
                        <CoinIcon size={48} />
                      </div>
                    );
                  })
                : null}
              <div style={{ position: "absolute", left: 0, right: 0, top: 216, textAlign: "center", ...mono(28, colors.dim) }}>
                about $150,000 at $90/btc
              </div>
            </div>
            <div style={{ width: 380, textAlign: "center" }}>
              <AvatarBadge icon="helmet" size={130} color={colors.redandwhite} />
              <div style={{ ...mono(24, colors.red), fontWeight: 700, marginTop: 10 }}>1MwvS1id...BH9WTL</div>
            </div>
          </Card>
        </Pop>
        {/* the chain */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 580, height: 190, opacity: Math.min(1, chain * 2), transform: `translateY(${(1 - chain) * 60}px)` }}>
          {new Array(9).fill(0).map((_, i) => {
            const x = 60 + i * 235 - ((frame - c("still")) * 0.6);
            const hot = i === 4 && frame >= c("blockchain");
            const hp = sp(frame, fps, c("blockchain"), springs.pop);
            return (
              <div key={i} style={{ position: "absolute", left: x, top: 0 }}>
                <div
                  style={{
                    width: 190,
                    height: 150,
                    borderRadius: 10,
                    border: `3px solid ${hot ? colors.amber : colors.line}`,
                    background: hot ? "rgba(255,181,71,0.12)" : colors.panel,
                    boxShadow: hot ? `0 0 50px ${colors.amber}66` : "none",
                    transform: `scale(${hot ? 1 + 0.12 * hp : 1})`,
                    padding: 14,
                    ...mono(20, hot ? colors.amber : colors.dim),
                    lineHeight: 1.5,
                  }}
                >
                  block
                  <br />
                  {hot ? (
                    <b>
                      tx 4a0a5b60
                      <br />
                      ...145b5601
                    </b>
                  ) : (
                    <span style={{ opacity: 0.5 }}>
                      ▇▇▇▇▇▇
                      <br />
                      ▇▇▇▇
                    </span>
                  )}
                </div>
                <div style={{ position: "absolute", left: 190, top: 72, width: 45, height: 6, background: colors.line }} />
              </div>
            );
          })}
        </div>
        <Chip at={c("Anyone")} text="PUBLIC RECORD · ANYONE CAN LOOK IT UP" origin="center center" style={{ left: 560, top: 780 }} />
      </Scene>

      {/* 5: the proof numbers */}
      <Scene from={tProof} to={tDone}>
        <ChatWindow
          style={{ position: "absolute", left: 110, top: 80 }}
          width={1150}
          enterAt={tProof}
          fontSize={29}
          title="silkroad :: private messages"
          sender={SENDERS.rw}
          recipient="Dread Pirate Roberts"
          timestamp="3/31/2013"
          minBodyHeight={440}
          messages={[
            {
              at: tProof + 10,
              cps: 70,
              text: "If you want picture confirmation of the job afterwards, give me random numbers and I will have them write them beside him and take a picture for you.",
            },
            {
              own: true,
              label: "DreadPirateRoberts",
              typingFrom: c("write") - 16,
              at: c("write"),
              cps: 50,
              text: "Here are some random numbers for a picture: 83746102",
            },
          ]}
        />
        <Chip at={c("random")} text="RANDOM NUMBERS" color={colors.text} fontSize={30} origin="center center" style={{ left: 1420, top: 300 }} />
        <TitleSlam text="83746102" color={colors.amber} fontSize={150} at={c("proof")} style={{ left: 1280, right: 40, top: 390 }} />
        <Chip at={c("proof") + 6} text="= PROOF" color={colors.red} filled origin="center center" style={{ left: 1470, top: 580 }} />
      </Scene>

      {/* 6: a single message */}
      <Scene from={tDone} to={D} exit="glitch">
        <Pop at={c("single")} style={{ left: 310, top: 200 }} origin="left center">
          <span style={{ ...mono(30, colors.red), fontWeight: 700, letterSpacing: "0.12em", opacity: 0.6 + 0.4 * Math.sin(frame / 4) }}>
            ● 1 NEW MESSAGE
          </span>
        </Pop>
        <ChatWindow
          style={{ position: "absolute", left: 310, top: 260 }}
          width={1300}
          enterAt={c("message")}
          fontSize={56}
          title="silkroad :: private messages"
          sender={SENDERS.rw}
          recipient="Dread Pirate Roberts"
          timestamp="4/1/2013"
          minBodyHeight={170}
          messages={[{ typingFrom: c("arrives") - 6, at: c("Your"), cps: 24, text: "Your problem has been taken care of." }]}
        />
        <Flash at={c("of", 2)} peak={0.4} />
      </Scene>
    </ClipShell>
  );
};
