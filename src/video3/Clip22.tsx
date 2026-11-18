import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, BuildingIcon, Chip, CrossOut, PhoneBuzz, Pop, Scene, Sfx, Terminal, TitleSlam, mono } from "../components";
import { useClip } from "./words";

/** A sheet of paper with grey "text" bars. */
const Paper: React.FC<{ width: number; height: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  width,
  height,
  children,
  style,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 10,
      background: "linear-gradient(to bottom, #E9E6DC, #D4D0C4)",
      boxShadow: "0 30px 70px rgba(0,0,0,0.7)",
      padding: "34px 44px",
      color: "#15181C",
      position: "relative",
      ...style,
    }}
  >
    {children}
  </div>
);

const Bars: React.FC<{ n: number; seed?: number }> = ({ n, seed = 0 }) => (
  <>
    {new Array(n).fill(0).map((_, i) => (
      <div key={i} style={{ height: 14, marginTop: 16, width: `${62 + ((i * 37 + seed * 13) % 36)}%`, background: "#15181C", opacity: 0.22, borderRadius: 3 }} />
    ))}
  </>
);

/** One of the three "simple tricks". */
const Trick: React.FC<{ at: number; left: number; label: string; children: React.ReactNode }> = ({ at, left, label, children }) => (
  <Pop at={at} from="up" sound="pop" style={{ left, top: 250, width: 460 }}>
    <div
      style={{
        height: 420,
        borderRadius: 14,
        background: "rgba(7,9,11,0.93)",
        border: `3px solid ${colors.amber}`,
        boxShadow: `0 0 50px ${colors.amber}22, 0 24px 50px rgba(0,0,0,0.7)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 30,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, top: 24, bottom: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
      <div style={{ fontFamily: fonts.display, fontSize: 66, lineHeight: 1, color: colors.text }}>{label}</div>
    </div>
  </Pop>
);

export const Clip22: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(22);

  const tAnswer = c("The answer");
  const tTricks = c("A phone");
  const tReview = c("The review");
  const tVault = c("Companies had");
  const tWeakest = c("The weakest");

  const drop = sp(frame, fps, c("review") - 8, springs.snappy);
  const strike = sp(frame, fps, c("secret") + 10, springs.snappy);
  const hl = sp(frame, fps, c("cheap"), springs.snappy);
  const cross = sp(frame, fps, c("stop"), springs.smooth, 12);
  const key = sp(frame, fps, c("stop") + 12, springs.pop);
  const walk = sp(frame, fps, c("walked"), springs.heavy, c("yes") - c("walked") + 20);
  const door = sp(frame, fps, tVault + 6, springs.smooth, 30);

  return (
    <>
      {/* 1: the government orders a review */}
      <Scene from={0} to={tAnswer}>
        <Pop at={4} origin="center bottom" style={{ left: 200, top: 210 }}>
          <BuildingIcon size={380} color={colors.text} />
        </Pop>
        <Chip at={c("States")} text="UNITED STATES GOVERNMENT" color={colors.text} origin="center center" style={{ left: 150, top: 620 }} />
        <div style={{ position: "absolute", left: 900, top: 190 + (1 - drop) * -700, transform: `rotate(${(1 - drop) * -14 - 3}deg)`, opacity: frame >= c("review") - 8 ? 1 : 0 }}>
          <Sfx name="stamp" at={c("review") - 2} volume={0.7} />
          <Paper width={620} height={440}>
            <div style={{ ...mono(26, "#15181C"), letterSpacing: "0.2em", opacity: 0.7 }}>OFFICIAL REVIEW</div>
            <div style={{ fontFamily: fonts.display, fontSize: 92, lineHeight: 1, marginTop: 10 }}>THE LAPSUS$ ATTACKS</div>
            <div style={{ ...mono(30, "#15181C"), marginTop: 10, fontWeight: 700 }}>AUGUST 2023</div>
            <Bars n={5} />
          </Paper>
        </div>
        <Terminal
          style={{ position: "absolute", left: 900, top: 690 }}
          fontSize={40}
          color={colors.amber}
          lines={[{ text: "how did a group of teenagers do all this?", prompt: "> ", at: c("How"), durationInFrames: 60 }]}
        />
      </Scene>

      {/* 2: the uncomfortable answer */}
      <Scene from={tAnswer} to={tTricks}>
        <Pop at={tAnswer} from="up" style={{ left: 330, top: 110 }}>
          <Paper width={1260} height={690}>
            <div style={{ display: "flex", justifyContent: "space-between", ...mono(24, "#15181C"), letterSpacing: "0.14em", opacity: 0.75 }}>
              <span>FINDINGS</span>
              <span>US CYBER SAFETY REVIEW BOARD, 2023</span>
            </div>
            <Bars n={2} seed={1} />
            <div style={{ marginTop: 34, position: "relative", display: "inline-block", fontFamily: fonts.display, fontSize: 86, lineHeight: 1, opacity: frame >= c("secret") - 6 ? 1 : 0 }}>
              SECRET WEAPONS
              <div style={{ position: "absolute", left: -8, top: "48%", height: 9, width: `calc(${strike * 100}% + ${strike * 16}px)`, background: colors.red }} />
            </div>
            <div style={{ marginTop: 26 }}>
              <span
                style={{
                  fontFamily: fonts.display,
                  fontSize: 86,
                  lineHeight: 1.05,
                  whiteSpace: "nowrap",
                  padding: "4px 16px",
                  background: `linear-gradient(to right, ${colors.amber} ${hl * 100}%, transparent ${hl * 100}%)`,
                  opacity: frame >= c("cheap") - 4 ? 1 : 0,
                }}
              >
                LOW-COST TECHNIQUES, WELL KNOWN
              </span>
            </div>
            <div style={{ ...mono(24, "#15181C"), marginTop: 12, opacity: frame >= c("cheap") ? 0.65 : 0 }}>(paraphrased)</div>
            <Bars n={4} seed={2} />
          </Paper>
        </Pop>
        <Chip at={c("uncomfortable")} text="UNCOMFORTABLE" color={colors.red} filled fontSize={40} origin="left center" style={{ left: 330, top: 28 }} />
        <Chip at={c("known")} text="KNOWN ABOUT FOR YEARS" color={colors.text} fontSize={38} origin="center center" style={{ left: 1090, top: 720 }} />
      </Scene>

      {/* 3: three simple tricks */}
      <Scene from={tTricks} to={tReview}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", ...mono(38, colors.dim) }}>&gt; the whole toolkit:</div>
        <Trick at={c("phone")} left={170} label="A PHONE CALL">
          <svg width={210} height={210} viewBox="0 0 24 24">
            <path d="M6.6 3 L9.4 3 L10.8 7.2 L8.8 8.8 C9.9 11.2 11.8 13.1 14.2 14.2 L15.8 12.2 L20 13.6 L20 16.4 C20 18.4 18.4 20 16.4 20 C9 19.6 3.4 14 3 6.6 C3 4.6 4.6 3 6.6 3 Z" fill="none" stroke={colors.text} strokeWidth={1.4} strokeLinejoin="round" />
            <path d="M15 4 C17.6 4.6 19.4 6.4 20 9 M14.6 7 C15.8 7.4 16.6 8.2 17 9.4" fill="none" stroke={colors.amber} strokeWidth={1.4} strokeLinecap="round" opacity={0.5 + 0.5 * Math.sin(frame / 4)} />
          </svg>
        </Trick>
        <Trick at={c("bribe")} left={730} label="A BRIBE">
          <svg width={230} height={200} viewBox="0 0 46 40">
            <rect x={3} y={8} width={40} height={24} rx={3} fill="none" stroke={colors.green} strokeWidth={2.2} />
            <circle cx={23} cy={20} r={6.5} fill="none" stroke={colors.green} strokeWidth={2.2} />
            <path d="M23 16 V24" stroke={colors.green} strokeWidth={2.2} strokeLinecap="round" />
            <rect x={8} y={3} width={40} height={24} rx={3} fill="none" stroke={colors.green} strokeWidth={1.4} opacity={0.4} transform="translate(-8 0)" />
          </svg>
        </Trick>
        <Trick at={c("login")} left={1290} label="A PROMPT, AGAIN">
          <div style={{ position: "relative", width: 150, height: 260 }}>
            <PhoneBuzz at={c("login")} prompts={8} interval={8} size={130} style={{ left: 10, top: 0 }} />
          </div>
        </Trick>
        <Pop at={c("hundred")} from="slam" style={{ left: 1590, top: 96 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 130, color: colors.red, textShadow: "0 0 30px rgba(255,59,59,0.5)" }}>×100</span>
        </Pop>
      </Scene>

      {/* 4: the one weakness, text-message codes */}
      <Scene from={tReview} to={tVault}>
        <Chip at={c("one")} text="ONE WEAKNESS ABOVE ALL" color={colors.amber} fontSize={44} origin="center center" style={{ left: 640, top: 110 }} />
        <Pop at={c("login", 1) - 4} from="up" style={{ left: 300, top: 250 }}>
          <div style={{ width: 560, height: 470, borderRadius: 40, background: "#0B0F13", border: "6px solid #2A343D", boxShadow: "0 30px 70px rgba(0,0,0,0.7)", padding: 34, position: "relative" }}>
            <div style={{ ...mono(26, colors.dim), letterSpacing: "0.14em" }}>TEXT MESSAGE</div>
            <div style={{ marginTop: 26, padding: "24px 28px", borderRadius: 22, background: colors.panelLight, border: `2px solid ${colors.line}`, ...mono(44), fontWeight: 700, lineHeight: 1.35 }}>
              Your login code is
              <br />
              <span style={{ color: colors.green }}>481 902</span>
            </div>
            <div style={{ ...mono(28, colors.dim), marginTop: 26 }}>sent by SMS</div>
            <div style={{ position: "absolute", left: 100, top: 60 }}>
              <CrossOut progress={cross} size={360} />
            </div>
          </div>
        </Pop>
        <Sfx name="error" at={c("stop")} />
        <div style={{ position: "absolute", left: 1090, top: 280, transform: `scale(${key})`, opacity: frame >= c("stop") + 12 ? 1 : 0 }}>
          <Sfx name="coin" at={c("stop") + 12} volume={0.6} />
          <svg width={420} height={330} viewBox="0 0 84 66" style={{ filter: `drop-shadow(0 0 22px ${colors.green}77)` }}>
            <rect x={4} y={18} width={52} height={30} rx={8} fill={colors.panelLight} stroke={colors.green} strokeWidth={3} />
            <circle cx={24} cy={33} r={8} fill="none" stroke={colors.green} strokeWidth={3} />
            <circle cx={24} cy={33} r={2.5} fill={colors.green} />
            <rect x={56} y={25} width={22} height={16} rx={2} fill={colors.green} />
            <rect x={62} y={29} width={4} height={8} fill={colors.bg} />
            <rect x={70} y={29} width={4} height={8} fill={colors.bg} />
            <circle cx={44} cy={33} r={3} fill="none" stroke={colors.green} strokeWidth={2} />
          </svg>
          <div style={{ textAlign: "center", ...mono(34, colors.green), fontWeight: 700, letterSpacing: "0.1em" }}>A PHYSICAL SECURITY KEY</div>
        </div>
        <Chip at={c("relying")} text="STOP RELYING ON TEXT CODES" color={colors.red} filled fontSize={40} origin="center center" style={{ left: 610, top: 770 }} />
      </Scene>

      {/* 5: billions on defences, and a tired human */}
      <Scene from={tVault} to={tWeakest}>
        {/* vault wall and round door, swung open */}
        <div style={{ position: "absolute", left: 760, top: 150, width: 640, height: 640, borderRadius: 320, background: "radial-gradient(circle, #05070A 55%, #11171D 56%, #1C242C 100%)", border: "14px solid #2A343D", boxShadow: "0 0 90px rgba(0,0,0,0.8) inset" }} />
        <div
          style={{
            position: "absolute",
            left: 760,
            top: 150,
            width: 640,
            height: 640,
            borderRadius: 320,
            background: "radial-gradient(circle, #3A4652 0%, #232C36 60%, #151B21 100%)",
            border: "14px solid #4A5866",
            transformOrigin: "left center",
            transform: `perspective(1600px) rotateY(${-door * 78}deg)`,
          }}
        >
          <div style={{ position: "absolute", left: 220, top: 220, width: 200, height: 200, borderRadius: 100, border: "16px solid #59636D" }} />
          <div style={{ position: "absolute", left: 312, top: 180, width: 16, height: 280, background: "#59636D" }} />
          <div style={{ position: "absolute", left: 180, top: 312, width: 280, height: 16, background: "#59636D" }} />
        </div>
        <Sfx name="door" at={tVault + 6} volume={0.7} />
        <Pop at={c("billions")} from="slam" style={{ left: 90, top: 150 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 150, lineHeight: 1, color: colors.amber, textShadow: `0 0 34px ${colors.amber}55` }}>$ BILLIONS</span>
        </Pop>
        <Chip at={c("firewalls")} text="FIREWALLS" color={colors.text} fontSize={40} style={{ left: 100, top: 330 }} />
        <Chip at={c("encryption")} text="ENCRYPTION" color={colors.text} fontSize={40} style={{ left: 100, top: 430 }} />
        {/* the hacker simply walks in */}
        <div
          style={{
            position: "absolute",
            left: interpolate(walk, [0, 1], [300, 1010]),
            top: 560 - Math.abs(Math.sin(walk * 20)) * 14,
            opacity: frame >= c("walked") ? 1 : 0,
            transform: `scale(${interpolate(walk, [0, 1], [1, 0.7])})`,
          }}
        >
          <BlobCharacter color="#2B333C" size={200} seed={5} eyeColor={colors.red} look={{ x: 1, y: 0 }} />
        </div>
        {/* the tired human */}
        <Pop at={c("tired") - 6} origin="center bottom" style={{ left: 1500, top: 330 }}>
          <BlobCharacter color={colors.extras[0]} size={380} seed={9} look={{ x: -0.6, y: 0.9 }} />
          <div style={{ position: "absolute", left: 30, top: 250, width: 96, height: 168, borderRadius: 16, background: "#0B0F13", border: "4px solid #2A343D", transform: "rotate(-8deg)" }}>
            <div style={{ margin: "56px 10px 0", padding: "8px 0", borderRadius: 8, textAlign: "center", ...mono(19, frame >= c("yes") ? colors.bg : colors.text), fontWeight: 700, background: frame >= c("yes") ? colors.green : colors.panelLight }}>
              {frame >= c("yes") ? "YES" : "APPROVE?"}
            </div>
          </div>
        </Pop>
        <Chip at={c("tired")} text="A TIRED HUMAN" color={colors.amber} fontSize={36} origin="left center" style={{ left: 1430, top: 240 }} />
        <Pop at={c("yes")} from="slam" sound="click" style={{ left: 1570, top: 715 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 150, color: colors.green, textShadow: `0 0 30px ${colors.green}66` }}>YES.</span>
        </Pop>
      </Scene>

      {/* 6: the lesson */}
      <Scene from={tWeakest} to={D} exit="glitch">
        <AbsoluteFill>
          <TitleSlam text="THE WEAKEST LINK" fontSize={250} at={c("weakest")} style={{ top: 170 }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", ...mono(44, colors.dim), opacity: frame >= c("isn't") ? 1 : 0 }}>
            isn't the <span style={{ textDecoration: "line-through", color: colors.text }}>code</span>
          </div>
          <TitleSlam text="IS A PERSON." color={colors.red} fontSize={300} at={c("person")} style={{ top: 510 }} />
        </AbsoluteFill>
      </Scene>
    </>
  );
};
