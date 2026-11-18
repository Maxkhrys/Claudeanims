import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Chip, FadeIn, HotelRoom, OnionLogo, Pop, Scene, Terminal, TitleSlam, White, mono } from "../components";
import { useClip } from "./words";

const PALE = "#DDE4EC";

/** One line inside a verdict card; appears when it is spoken. */
const Line: React.FC<{ at: number; text: string; color: string }> = ({ at, text, color }) => (
  <Pop at={at} from="left" sound="pop" style={{ position: "relative", marginTop: 16 }}>
    <span style={{ ...mono(35), fontWeight: 700, whiteSpace: "nowrap" }}>
      <span style={{ color }}>▸ </span>
      {text}
    </span>
  </Pop>
);

export const Clip26: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(26);

  const tSome = c("To some");
  const tOthers = c("To others");
  const tMaybe = c("Maybe");
  const tAnswer = c("So", 1);
  const tOutro = c("Let");

  const merge = sp(frame, fps, tMaybe, springs.smooth, 22);
  const leftIn = sp(frame, fps, tSome, springs.snappy);
  const rightIn = sp(frame, fps, tOthers, springs.snappy);
  const ROOMS = ["#methods", "#flex", "#targets", "#sim-swaps"];

  const card = (accent: string): React.CSSProperties => ({
    position: "absolute",
    top: 130,
    width: 830,
    height: 660,
    borderRadius: 16,
    background: "rgba(12,17,21,0.94)",
    border: `3px solid ${accent}`,
    boxShadow: `0 0 70px ${accent}22, 0 40px 100px rgba(0,0,0,0.65)`,
    padding: "34px 44px",
  });

  return (
    <>
      {/* 1: the room, empty now */}
      <Scene from={0} to={tSome}>
        <HotelRoom tvOn={0} />
        <AbsoluteFill style={{ background: "rgba(7,9,11,0.35)" }} />
        <FadeIn at={8} durationInFrames={18} style={{ left: 0, right: 0, top: 60, textAlign: "center" }}>
          <span style={{ fontFamily: fonts.display, fontSize: 96, color: colors.text, textShadow: "0 6px 0 rgba(0,0,0,0.7)" }}>WHAT DO WE MAKE OF ARION KURTAJ?</span>
        </FadeIn>
      </Scene>

      {/* 2: two readings, then both */}
      <Scene from={tSome} to={tAnswer}>
        <div
          style={{
            ...card(colors.red),
            left: 110 + merge * 320,
            opacity: Math.min(1, leftIn * 2) * (1 - merge * 0.72),
            transform: `translateX(${(1 - leftIn) * -70}px) rotate(${merge * -3}deg)`,
          }}
        >
          <div style={{ ...mono(26, colors.dim), letterSpacing: "0.2em" }}>TO SOME PEOPLE</div>
          {frame >= c("dangerous") ? (
            <div style={{ fontFamily: fonts.display, fontSize: 88, lineHeight: 1, whiteSpace: "nowrap", color: colors.red, marginTop: 8, textShadow: `0 0 34px ${colors.red}55` }}>A DANGEROUS CRIMINAL</div>
          ) : null}
          <div style={{ height: 5, background: colors.red, marginTop: 14, opacity: 0.8 }} />
          <Line at={c("blackmailed")} text="BLACKMAILED COMPANIES" color={colors.red} />
          <Line at={c("drain")} text="HELPED DRAIN STRANGERS' ACCOUNTS" color={colors.red} />
          <Line at={c("didn't")} text="DIDN'T STOP WHEN CAUGHT" color={colors.red} />
          <Line at={c("Not the first")} text="NOT THE FIRST TIME" color={colors.red} />
          <Line at={c("Not the second")} text="NOT THE SECOND" color={colors.red} />
        </div>

        {frame >= tOthers ? (
          <div
            style={{
              ...card(PALE),
              left: 980 - merge * 320,
              opacity: Math.min(1, rightIn * 2) * (1 - merge * 0.72),
              transform: `translateX(${(1 - rightIn) * 70}px) rotate(${merge * 3}deg)`,
            }}
          >
            <div style={{ ...mono(26, colors.dim), letterSpacing: "0.2em" }}>TO OTHERS</div>
            {frame >= c("vulnerable") ? (
              <div style={{ fontFamily: fonts.display, fontSize: 88, lineHeight: 1, whiteSpace: "nowrap", color: PALE, marginTop: 8, textShadow: `0 0 34px ${PALE}44` }}>A VULNERABLE KID</div>
            ) : null}
            <div style={{ height: 5, background: PALE, marginTop: 14, opacity: 0.8 }} />
            <Line at={c("Autistic")} text="AUTISTIC" color={PALE} />
            <Line at={c("Isolated")} text="ISOLATED" color={PALE} />
            <Line at={c("rewarded")} text="REWARDED FOR EVERY BIGGER HACK" color={PALE} />
            <Line at={c("no way")} text="UNTIL THERE WAS NO WAY BACK" color={PALE} />
            {/* the small figure at his desk, chat rooms looming over him */}
            <div style={{ position: "absolute", right: 40, bottom: 26 }}>
              <White size={170} />
            </div>
            {ROOMS.map((r, i) => (
              <Chip
                key={r}
                at={c("online") + i * 7}
                text={r}
                color={colors.green}
                fontSize={22}
                sound={false}
                style={{ right: 230 + (i % 2) * 170, bottom: 36 + Math.floor(i / 2) * 58 }}
              />
            ))}
          </div>
        ) : null}

        <TitleSlam text="MAYBE BOTH." color={colors.amber} fontSize={260} at={c("both")} style={{ top: 320 }} />
      </Scene>

      {/* 3: the question */}
      <Scene from={tAnswer} to={tOutro}>
        <Terminal
          style={{ position: "absolute", left: 0, right: 0, top: 220 }}
          align="center"
          fontSize={76}
          lines={[{ text: "what should happen to him?", prompt: "> ", at: c("what's"), durationInFrames: 44 }]}
        />
        <Chip at={c("Prison")} text="PRISON?" color={colors.red} fontSize={44} origin="center center" style={{ left: 280, top: 520 }} />
        <Chip at={c("Hospital")} text="HOSPITAL?" color={PALE} fontSize={44} origin="center center" style={{ left: 600, top: 520 }} />
        <Chip at={c("job")} text="A JOB IN CYBERSECURITY?" color={colors.green} fontSize={44} origin="center center" style={{ left: 975, top: 520 }} />
      </Scene>

      {/* 4: sign-off, then black */}
      <Scene from={tOutro} to={D - 4} exit="cut">
        <TitleSlam text="TELL ME IN THE COMMENTS" color={colors.amber} fontSize={170} at={tOutro} style={{ top: 190 }} />
        <Pop at={tOutro + 14} from="up" style={{ left: 0, right: 0, top: 520, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
          <OnionLogo size={130} />
          <span style={{ fontFamily: fonts.display, fontSize: 150, lineHeight: 1, color: colors.green, letterSpacing: "0.04em", textShadow: `0 0 40px ${colors.green}55` }}>THE ONION ARCHIVE</span>
        </Pop>
      </Scene>
    </>
  );
};
