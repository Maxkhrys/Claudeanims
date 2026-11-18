import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, FadeIn, Scene, Sfx, Terminal, mono } from "../components";
import { useClip } from "./words";

/** A plain legal document card. */
const Doc: React.FC<{ width: number; title: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ width, title, children, style }) => (
  <div
    style={{
      width,
      borderRadius: 10,
      background: "linear-gradient(to bottom, #E9E6DC, #D4D0C4)",
      boxShadow: "0 30px 70px rgba(0,0,0,0.7)",
      padding: "32px 44px 40px",
      color: "#15181C",
      ...style,
    }}
  >
    <div style={{ ...mono(26, "#15181C"), letterSpacing: "0.2em", opacity: 0.7, borderBottom: "3px solid rgba(21,24,28,0.3)", paddingBottom: 12 }}>{title}</div>
    {children}
  </div>
);

/** Text with a line that draws through it. */
const Struck: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, 30, at, springs.smooth, 14);
  return (
    <span style={{ position: "relative", display: "inline-block", opacity: frame >= at ? 0.55 : 1 }}>
      {children}
      <span style={{ position: "absolute", left: -6, top: "50%", height: 7, width: `calc(${s * 100}% + ${s * 12}px)`, background: "#15181C" }} />
    </span>
  );
};

export const Clip24: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, D } = useClip(24);

  const tArgued = c("They argued");
  const tChange = c("Then came");
  const tMoved = c("He was moved");
  const tThree = c("Three");

  const GROUNDS = [
    { label: "HIS EARLIER CONVICTIONS", at: c("earlier"), result: "HEARD" },
    { label: "HIS BAIL CONDITIONS", at: c("bail"), result: "REFUSED" },
    { label: "OTHER EVIDENCE", at: c("bail") + 16, result: "REFUSED" },
    { label: "OTHER EVIDENCE", at: c("bail") + 26, result: "REFUSED" },
  ];
  const push = interpolate(frame, [0, tArgued], [1, 1.05], { extrapolateRight: "clamp" });

  return (
    <>
      {/* 1: the Court of Appeal */}
      <Scene from={0} to={tArgued}>
        <AbsoluteFill style={{ transform: `scale(${push})`, transformOrigin: "50% 60%" }}>
          {/* columns and bench */}
          {[250, 520, 1340, 1610].map((x) => (
            <div key={x} style={{ position: "absolute", left: x, top: 130, width: 60, height: 620, background: "linear-gradient(to right, #1A2128, #2A333D, #1A2128)", borderRadius: 6 }} />
          ))}
          <div style={{ position: "absolute", left: 200, right: 200, top: 100, height: 40, background: "#232C36", borderRadius: 6 }} />
          <FadeIn at={c("lawyers")} durationInFrames={20} style={{ left: 0, right: 0, top: 0, bottom: 0 }}>
            {[760, 930, 1100].map((x, i) => (
              <div key={x} style={{ position: "absolute", left: x - 60, top: 330 }}>
                <BlobCharacter color="#3C3550" size={i === 1 ? 250 : 220} seed={4 + i} idle={0.4} look={{ x: 0, y: 0.5 }} />
              </div>
            ))}
            <div style={{ position: "absolute", left: 560, top: 520, width: 800, height: 240, borderRadius: "14px 14px 0 0", background: "linear-gradient(to bottom, #2A2118, #120E0A)", border: "2px solid #4A3A28" }} />
          </FadeIn>
        </AbsoluteFill>
        <FadeIn at={c("story") - 10} durationInFrames={18} out={c("lawyers") - 26}  style={{ left: 0, right: 0, top: 380, textAlign: "center" }}>
          <span style={{ ...mono(52, colors.text), fontWeight: 700 }}>his story wasn't over.</span>
        </FadeIn>
        <Terminal
          style={{ position: "absolute", left: 0, right: 0, top: 170 }}
          align="center"
          fontSize={56}
          color={colors.amber}
          sound={false}
          lines={[{ text: "2025 · COURT OF APPEAL", at: c("Court") - 10, durationInFrames: 26 }]}
        />
        <FadeIn at={c("secure")} durationInFrames={16} style={{ left: 0, right: 0, top: 790, textAlign: "center" }}>
          <span style={{ ...mono(32, colors.dim), letterSpacing: "0.14em" }}>APPEAL LODGED FROM A SECURE HOSPITAL</span>
        </FadeIn>
      </Scene>

      {/* 2: the grounds, and the decision */}
      <Scene from={tArgued} to={tChange}>
        <div style={{ position: "absolute", left: 130, top: 100, ...mono(36, colors.dim) }}>&gt; the argument: the jury should never have been told about...</div>
        {GROUNDS.map((g, i) => {
          const decided = frame >= c("judges") + i * 8;
          const heard = g.result === "HEARD";
          return (
            <FadeIn key={i} at={i < 2 ? g.at - 8 : g.at} durationInFrames={14} style={{ left: 130 + i * 425, top: 200 }}>
              <div
                style={{
                  width: 395,
                  height: 300,
                  borderRadius: 12,
                  background: colors.panel,
                  border: `2px solid ${decided && !heard ? colors.dim : colors.line}`,
                  padding: "24px 26px",
                  opacity: decided && !heard ? 0.6 : 1,
                }}
              >
                <div style={{ ...mono(26, colors.amber), letterSpacing: "0.2em" }}>GROUND {i + 1}</div>
                <div style={{ ...mono(36, colors.text), fontWeight: 700, lineHeight: 1.25, marginTop: 18, height: 100 }}>{g.label}</div>
                <div style={{ marginTop: 26, ...mono(34, heard ? colors.text : colors.dim), fontWeight: 700, letterSpacing: "0.1em", opacity: decided ? 1 : 0 }}>
                  {heard ? "HEARD, NOT ENOUGH" : "REFUSED"}
                </div>
              </div>
            </FadeIn>
          );
        })}
        <FadeIn at={c("September") - 6} durationInFrames={16} style={{ left: 130, top: 560 }}>
          <span style={{ ...mono(40, colors.amber), fontWeight: 700 }}>SEPTEMBER 2025</span>
        </FadeIn>
        <FadeIn at={c("findings") - 6} durationInFrames={18} style={{ left: 130, top: 630 }}>
          <div style={{ padding: "18px 40px 20px", borderRadius: 12, border: `3px solid ${colors.text}`, background: "rgba(7,9,11,0.9)" }}>
            <span style={{ fontFamily: fonts.display, fontSize: 130, lineHeight: 1, color: colors.text }}>APPEAL DISMISSED</span>
          </div>
        </FadeIn>
        <FadeIn at={c("stand") - 4} durationInFrames={16} style={{ left: 1150, top: 690 }}>
          <span style={{ ...mono(36, colors.dim) }}>the jury's findings stand.</span>
        </FadeIn>
      </Scene>

      {/* 3: found fit to stand trial */}
      <Scene from={tChange} to={tMoved}>
        <FadeIn at={tChange} durationInFrames={14} style={{ left: 0, right: 0, top: 80, textAlign: "center" }}>
          <span style={{ ...mono(40, colors.dim) }}>&gt; then, a bigger change</span>
        </FadeIn>
        <FadeIn at={c("January") - 10} durationInFrames={18} style={{ left: 460, top: 170 }}>
          <Doc width={1000} title="MEDICAL ASSESSMENT">
            <div style={{ display: "flex", alignItems: "baseline", gap: 30, marginTop: 30 }}>
              <span style={{ ...mono(34, "#15181C"), width: 250, opacity: 0.7 }}>2023</span>
              <span style={{ fontFamily: fonts.display, fontSize: 84, lineHeight: 1 }}>
                <Struck at={c("this time")}>UNFIT TO STAND TRIAL</Struck>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 30, marginTop: 34, opacity: frame >= c("January") ? 1 : 0 }}>
              <span style={{ ...mono(34, "#15181C"), width: 250, fontWeight: 700 }}>JANUARY 2026</span>
              <span style={{ fontFamily: fonts.display, fontSize: 104, lineHeight: 1, opacity: interpolate(frame, [c("fit") - 4, c("fit") + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
                FIT TO STAND TRIAL
              </span>
            </div>
            <div style={{ ...mono(26, "#15181C"), marginTop: 34, opacity: frame >= c("doctors") ? 0.7 : 0 }}>assessed again by doctors</div>
          </Doc>
        </FadeIn>
      </Scene>

      {/* 4: hospital to prison */}
      <Scene from={tMoved} to={tThree}>
        <FadeIn at={tMoved} durationInFrames={14} style={{ left: 510, top: 200 }}>
          <Doc width={900} title="TRANSFER">
            <div style={{ ...mono(30, "#15181C"), marginTop: 28, opacity: 0.7 }}>FROM</div>
            <div style={{ fontFamily: fonts.display, fontSize: 100, lineHeight: 1.05 }}>
              <Struck at={c("out")}>SECURE HOSPITAL</Struck>
            </div>
            <div style={{ ...mono(30, "#15181C"), marginTop: 26, opacity: 0.7 }}>TO</div>
            <div style={{ fontFamily: fonts.display, fontSize: 130, lineHeight: 1.05, opacity: interpolate(frame, [c("prison") - 6, c("prison") + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
              PRISON
            </div>
          </Doc>
        </FadeIn>
        <Sfx name="door" at={c("prison")} volume={0.5} />
      </Scene>

      {/* 5: the case is back on */}
      <Scene from={tThree} to={D}>
        <FadeIn at={tThree} durationInFrames={16} style={{ left: 0, right: 0, top: 300, textAlign: "center" }}>
          <span style={{ ...mono(46, colors.dim), letterSpacing: "0.12em" }}>3 YEARS AFTER THE FIRST TRIAL</span>
        </FadeIn>
        <FadeIn at={c("case") - 4} durationInFrames={18} style={{ left: 0, right: 0, top: 390, textAlign: "center" }}>
          <span style={{ fontFamily: fonts.display, fontSize: 230, lineHeight: 1, color: colors.text, textShadow: "0 0 40px rgba(230,230,230,0.2)" }}>THE CASE WAS BACK ON</span>
        </FadeIn>
        <div style={{ position: "absolute", left: 760 + Math.min(1, Math.max(0, (frame - c("back")) / 20)) * 0, top: 640, width: 400 * Math.min(1, Math.max(0, (frame - c("back")) / 24)), height: 6, background: colors.amber }} />
      </Scene>
    </>
  );
};
