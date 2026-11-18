import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, BrandTag, Counter, FadeIn, Scene, Terminal, White, mono } from "../components";
import { useClip } from "./words";

// Clip 19, "The Trial". Deliberately quiet: fades and typed text only, muted colours,
// no slams, flashes, glitches or stamps.

const MUTED = "#9AA6B2";

/** Plain courtroom backdrop: panelled wall, a bench, two tables. */
const Courtroom: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill style={{ opacity }}>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, #0D1116 0%, #11161C 66%, #090B0E 66%, #07090B 100%)" }} />
    {new Array(8).fill(0).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 60 + i * 230, top: 70, width: 190, height: 560, border: "2px solid #171D24", borderRadius: 4 }} />
    ))}
    <div style={{ position: "absolute", left: 610, top: 470, width: 700, height: 250, borderRadius: "10px 10px 0 0", background: "linear-gradient(to bottom, #1C222A, #12171D)", border: "2px solid #252D36" }} />
    <div style={{ position: "absolute", left: 590, top: 452, width: 740, height: 22, borderRadius: 6, background: "#252D36" }} />
    <div style={{ position: "absolute", left: 140, top: 760, width: 520, height: 26, borderRadius: 6, background: "#1A2027" }} />
    <div style={{ position: "absolute", left: 1260, top: 760, width: 520, height: 26, borderRadius: 6, background: "#1A2027" }} />
  </AbsoluteFill>
);

/** Paper-style card with a small heading. */
const Paper: React.FC<{ heading: string; width?: number; children: React.ReactNode }> = ({ heading, width = 760, children }) => (
  <div style={{ width, padding: "30px 40px 36px", background: "rgba(12,16,20,0.94)", border: `2px solid ${colors.line}`, borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
    <div style={{ ...mono(24, colors.dim), letterSpacing: "0.2em", paddingBottom: 14, borderBottom: `2px solid ${colors.line}` }}>{heading}</div>
    {children}
  </div>
);

/** Scales of justice. `tilt` in degrees, positive = right pan down. */
const Scales: React.FC<{ tilt?: number; color?: string }> = ({ tilt = 0, color = MUTED }) => (
  <svg width={520} height={420} viewBox="0 0 520 420" style={{ overflow: "visible" }}>
    <path d="M 260 40 V 370 M 170 380 H 350" stroke={color} strokeWidth={10} strokeLinecap="round" />
    <circle cx={260} cy={40} r={14} fill={color} />
    <g transform={`rotate(${tilt} 260 70)`}>
      <path d="M 70 70 H 450" stroke={color} strokeWidth={10} strokeLinecap="round" />
      {[70, 450].map((x) => (
        <g key={x} transform={`rotate(${-tilt} ${x} 70)`}>
          <path d={`M ${x} 70 L ${x - 60} 210 M ${x} 70 L ${x + 60} 210`} stroke={color} strokeWidth={4} />
          <path d={`M ${x - 74} 210 Q ${x} 268 ${x + 74} 210 Z`} fill={color} opacity={0.85} />
        </g>
      ))}
    </g>
  </svg>
);

export const Clip19: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(19);

  const tJury = c("So");
  const tWeeks = c("For weeks");
  const tAugust = c("In August");
  const tSecond = c("A second");

  const sway = Math.sin(frame / 40) * 1.6;
  const BRANDS_SEEN = ["BT", "NVIDIA", "UBER", "REVOLUT", "ROCKSTAR"];

  return (
    <>
      <Courtroom opacity={0.75} />

      {/* 1: the trial opens, and the ruling */}
      <Scene from={0} to={tJury}>
        <Terminal
          style={{ position: "absolute", left: 130, top: 110 }}
          fontSize={52}
          color={MUTED}
          lines={[{ text: "SUMMER 2023 · LONDON", at: c("trial"), durationInFrames: 40 }]}
        />
        <FadeIn at={c("unusual")} style={{ left: 134, top: 200 }}>
          <span style={{ ...mono(32, colors.dim), letterSpacing: "0.14em" }}>the trial begins with an unusual ruling</span>
        </FadeIn>
        <FadeIn at={c("Doctors")} durationInFrames={20} style={{ left: 250, top: 330 }}>
          <White size={330} idle={0.6} look={{ x: 0.6, y: 0 }} />
        </FadeIn>
        <FadeIn at={c("Doctors") + 6} style={{ left: 760, top: 300 }}>
          <Paper heading="MEDICAL ASSESSMENT" width={880}>
            <div style={{ ...mono(34, colors.text), marginTop: 22, lineHeight: 1.6 }}>
              <span style={{ color: colors.dim }}>assessed by: </span>doctors
              <br />
              <span style={{ opacity: frame >= c("autism") ? 1 : 0.15 }}>
                <span style={{ color: colors.dim }}>reason: </span>autism
              </span>
            </div>
            <FadeIn at={c("not fit")} durationInFrames={26} style={{ position: "relative", marginTop: 26 }}>
              <div style={{ fontFamily: fonts.display, fontSize: 92, lineHeight: 1, color: colors.text, letterSpacing: "0.03em" }}>UNFIT TO STAND TRIAL</div>
            </FadeIn>
          </Paper>
        </FadeIn>
      </Scene>

      {/* 2: a different job for the jury */}
      <Scene from={tJury} to={tWeeks}>
        <FadeIn at={tJury + 4} style={{ left: 0, right: 0, top: 96, textAlign: "center" }}>
          <span style={{ ...mono(36, colors.dim), letterSpacing: "0.2em" }}>THE JURY'S JOB</span>
        </FadeIn>
        <FadeIn at={tJury + 8} style={{ left: 700, top: 190, transform: `rotate(${sway * 0.2}deg)` }}>
          <Scales tilt={sway} />
        </FadeIn>
        <FadeIn at={c("Not to decide")} out={c("only") - 14} durationInFrames={16} style={{ left: 0, right: 0, top: 650, textAlign: "center" }}>
          <span style={{ fontFamily: fonts.display, fontSize: 120, color: colors.dim, letterSpacing: "0.04em", textDecoration: frame >= c("guilty") + 10 ? "line-through" : "none" }}>
            GUILTY / NOT GUILTY
          </span>
        </FadeIn>
        <FadeIn at={c("only")} durationInFrames={24} style={{ left: 0, right: 0, top: 640, textAlign: "center" }}>
          <span style={{ fontFamily: fonts.display, fontSize: 150, color: colors.text, letterSpacing: "0.04em" }}>DID HE DO IT?</span>
        </FadeIn>
        <FadeIn at={c("done")} style={{ left: 0, right: 0, top: 808, textAlign: "center" }}>
          <span style={{ ...mono(30, colors.dim) }}>not his guilt. only whether he did the acts.</span>
        </FadeIn>
      </Scene>

      {/* 3: weeks of evidence */}
      <Scene from={tWeeks} to={tAugust}>
        <FadeIn at={tWeeks + 2} style={{ left: 130, top: 100 }}>
          <span style={{ ...mono(36, colors.dim), letterSpacing: "0.2em" }}>THE EVIDENCE · HEARD OVER WEEKS</span>
        </FadeIn>
        {BRANDS_SEEN.map((name, i) => {
          const at = c("heard") + i * 9;
          const flip = sp(frame, fps, at, springs.smooth, 16);
          return (
            <div
              key={name}
              style={{
                position: "absolute",
                left: 130 + i * 338,
                top: 200,
                width: 310,
                height: 190,
                borderRadius: 10,
                background: "rgba(12,16,20,0.94)",
                border: `2px solid ${colors.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `perspective(900px) rotateY(${(1 - flip) * 90}deg)`,
                opacity: frame >= at ? 1 : 0,
              }}
            >
              <div style={{ filter: "saturate(0.55)" }}>
                <BrandTag name={name} size={name.length > 6 ? 46 : 58} />
              </div>
            </div>
          );
        })}
        {[
          { at: c("ransom"), text: "THE RANSOM DEMAND", sub: "$4,000,000" },
          { at: c("900"), text: "900 PHONE NUMBERS", sub: "moved to the hackers' SIM cards" },
          { at: c("hotel"), text: "THE HOTEL ROOM", sub: "a stick, a tv and a phone" },
        ].map((e, i) => (
          <FadeIn key={e.text} at={e.at} durationInFrames={18} style={{ left: 130 + i * 563, top: 470, width: 530 }}>
            <Paper heading={`EXHIBIT ${i + 1}`} width={530}>
              <div style={{ fontFamily: fonts.display, fontSize: 60, lineHeight: 1.05, color: colors.text, marginTop: 18 }}>{e.text}</div>
              <div style={{ ...mono(24, colors.dim), marginTop: 8 }}>{e.sub}</div>
            </Paper>
          </FadeIn>
        ))}
      </Scene>

      {/* 4: the jury's answer */}
      <Scene from={tAugust} to={tSecond}>
        <FadeIn at={tAugust + 2} style={{ left: 0, right: 0, top: 110, textAlign: "center" }}>
          <span style={{ ...mono(38, colors.dim), letterSpacing: "0.2em" }}>AUGUST 2023 · THE JURY'S ANSWER</span>
        </FadeIn>
        <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 40 }}>
          {frame >= c("12") - 6 ? (
            <Counter to={12} at={c("12") - 6} durationInFrames={24} fontSize={300} color={colors.text} sound={false} />
          ) : null}
          <FadeIn at={c("offenses")} durationInFrames={14} style={{ position: "relative" }}>
            <span style={{ fontFamily: fonts.display, fontSize: 150, color: MUTED }}>OFFENCES</span>
          </FadeIn>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 30 }}>
          {[
            { at: c("Blackmail"), text: "BLACKMAIL" },
            { at: c("fraud"), text: "FRAUD" },
            { at: c("computer"), text: "COMPUTER MISUSE" },
          ].map((l) => (
            <div key={l.text} style={{ opacity: frame >= l.at ? Math.min(1, (frame - l.at) / 14) : 0, padding: "14px 30px", border: `2px solid ${MUTED}`, borderRadius: 6, ...mono(40, colors.text), fontWeight: 700, letterSpacing: "0.08em" }}>
              {l.text}
            </div>
          ))}
        </div>
        <FadeIn at={c("carried")} style={{ left: 0, right: 0, top: 700, textAlign: "center" }}>
          <span style={{ ...mono(34, colors.dim) }}>the jury found he did the acts</span>
        </FadeIn>
      </Scene>

      {/* 5: the second defendant (never named) */}
      <Scene from={tSecond} to={D}>
        <FadeIn at={tSecond + 2} durationInFrames={18} style={{ left: 520, top: 300 }}>
          <BlobCharacter color="#8C97A3" size={330} seed={17} idle={0.6} />
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <span style={{ display: "inline-block", padding: "6px 18px", borderRadius: 6, background: "#8C97A3", color: colors.bg, ...mono(28, colors.bg), fontWeight: 700, filter: "blur(7px)" }}>
              ▇▇▇▇▇ ▇▇▇▇▇▇
            </span>
          </div>
        </FadeIn>
        <FadeIn at={tSecond + 6} style={{ left: 930, top: 300 }}>
          <span style={{ ...mono(34, colors.dim), letterSpacing: "0.18em" }}>A SECOND TEENAGER</span>
        </FadeIn>
        <FadeIn at={c("17")} style={{ left: 930, top: 370 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 130, lineHeight: 1, color: MUTED }}>AGE 17</span>
        </FadeIn>
        <FadeIn at={c("17") + 12} style={{ left: 934, top: 510 }}>
          <span style={{ ...mono(28, colors.dim) }}>cannot be named</span>
        </FadeIn>
        <FadeIn at={c("guilty", 1) - 4} durationInFrames={20} style={{ left: 930, top: 580 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 150, lineHeight: 1, color: colors.text }}>FOUND GUILTY</span>
        </FadeIn>
        <FadeIn at={c("part")} style={{ left: 934, top: 740 }}>
          <span style={{ ...mono(30, colors.dim) }}>of his part in the attacks</span>
        </FadeIn>
      </Scene>
    </>
  );
};
