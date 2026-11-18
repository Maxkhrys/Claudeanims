import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, fonts } from "../theme";
import { BlobCharacter, FadeIn, Scene, mono } from "../components";
import { useClip } from "./words";

// Clip 20, "The Hospital". The quietest clip in the video: fades only, muted colours,
// no sound effects at all, no character shown in distress.

const MUTED = "#9AA6B2";

/** Plain bordered card. */
const Plain: React.FC<{ width?: number; children: React.ReactNode }> = ({ width = 1200, children }) => (
  <div style={{ width, padding: "40px 54px", background: "rgba(12,16,20,0.94)", border: `2px solid ${colors.line}`, borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>{children}</div>
);

/** Closed hospital door at the end of a plain corridor. */
const HospitalDoor: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, #10151A 0%, #141A20 70%, #0A0D10 70%, #07090B 100%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 752, height: 4, background: "#1D252D" }} />
    <div style={{ position: "absolute", left: 190, top: 150, width: 420, height: 610, borderRadius: "8px 8px 0 0", background: "linear-gradient(to right, #252E37, #1B232B)", border: "4px solid #303A45" }}>
      <div style={{ position: "absolute", left: 130, top: 90, width: 160, height: 200, borderRadius: 6, background: "#0C1014", border: "3px solid #303A45" }} />
      <div style={{ position: "absolute", right: 34, top: 330, width: 18, height: 70, borderRadius: 9, background: "#59636D" }} />
    </div>
    <div style={{ position: "absolute", left: 150, top: 96, width: 500, height: 44, display: "flex", alignItems: "center", justifyContent: "center", ...mono(24, colors.dim), letterSpacing: "0.3em" }}>SECURE HOSPITAL</div>
  </AbsoluteFill>
);

export const Clip20: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, D } = useClip(20);

  const tOrder = c("Arion");
  const tRisk = c("The judge said");
  const tYounger = c("The younger");
  const tEnd = c("Arion", 1);
  const pages = Math.max(0, frame - tEnd - 30);

  return (
    <>
      {/* 1: sentencing day */}
      <Scene from={0} to={tOrder}>
        <AbsoluteFill style={{ background: "linear-gradient(to bottom, #0D1116 0%, #11161C 66%, #090B0E 66%, #07090B 100%)", opacity: 0.8 }} />
        <FadeIn at={2} style={{ left: 130, top: 110 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 110, lineHeight: 1, color: MUTED, letterSpacing: "0.04em" }}>DECEMBER 2023</span>
        </FadeIn>
        <FadeIn at={c("judge") - 4} durationInFrames={20} style={{ left: 960 - 150, top: 230 }}>
          <BlobCharacter color="#3C3550" size={360} seed={4} idle={0.5} look={{ x: 0, y: 0.5 }} />
        </FadeIn>
        <FadeIn at={c("judge") - 4} durationInFrames={20} style={{ left: 560, top: 540, width: 800, height: 330, borderRadius: "12px 12px 0 0", background: "linear-gradient(to bottom, #1C222A, #12171D)", border: "2px solid #252D36" }}>
          <div style={{ textAlign: "center", marginTop: 26, ...mono(30, MUTED), letterSpacing: "0.26em" }}>THE JUDGE</div>
        </FadeIn>
        <FadeIn at={c("sentence")} style={{ left: 134, top: 240 }}>
          <span style={{ ...mono(34, colors.dim), letterSpacing: "0.14em" }}>the sentence</span>
        </FadeIn>
        <FadeIn at={c("wasn't")} durationInFrames={20} style={{ left: 1420, top: 330 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 96, lineHeight: 1.05, color: colors.text }}>
            NOT
            <br />
            PRISON
          </span>
        </FadeIn>
      </Scene>

      {/* 2: the order */}
      <Scene from={tOrder} to={tRisk}>
        <FadeIn at={c("indefinite") - 6} durationInFrames={26} style={{ left: 240, top: 170 }}>
          <Plain width={1440}>
            <div style={{ ...mono(26, colors.dim), letterSpacing: "0.22em" }}>THE COURT'S ORDER</div>
            <div style={{ fontFamily: fonts.display, fontSize: 124, lineHeight: 1, color: colors.text, marginTop: 14, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>INDEFINITE HOSPITAL ORDER</div>
          </Plain>
        </FadeIn>
        {[
          { at: c("secure"), text: "held in a secure hospital" },
          { at: c("fixed"), text: "no fixed number of years" },
          { at: c("long"), text: "for as long as he is judged to be a danger" },
        ].map((l, i) => (
          <FadeIn key={l.text} at={l.at} style={{ left: 296, top: 540 + i * 84 }}>
            <span style={{ ...mono(44, i === 1 ? colors.text : MUTED), fontWeight: i === 1 ? 700 : 400 }}>
              <span style={{ color: colors.dim }}>· </span>
              {l.text}
            </span>
          </FadeIn>
        ))}
      </Scene>

      {/* 3: why */}
      <Scene from={tRisk} to={tYounger}>
        <FadeIn at={tRisk + 4} style={{ left: 300, top: 150 }}>
          <span style={{ ...mono(30, colors.dim), letterSpacing: "0.2em" }}>THE JUDGE'S REASON</span>
        </FadeIn>
        <FadeIn at={c("high") - 10} durationInFrames={26} style={{ left: 240, top: 210 }}>
          <Plain width={1440}>
            <div style={{ fontFamily: fonts.display, fontSize: 132, lineHeight: 1.02, color: colors.text }}>"A HIGH RISK TO THE PUBLIC"</div>
            <div style={{ ...mono(28, colors.dim), marginTop: 16 }}>because of his skills, and his desire to keep going</div>
          </Plain>
        </FadeIn>
        <FadeIn at={c("Doctors")} style={{ left: 300, top: 600 }}>
          <span style={{ ...mono(30, colors.dim), letterSpacing: "0.2em" }}>DOCTORS REPORTED</span>
        </FadeIn>
        <FadeIn at={c("still")} durationInFrames={24} style={{ left: 296, top: 656 }}>
          <span style={{ ...mono(48, MUTED) }}>he was still saying it:</span>
        </FadeIn>
        <FadeIn at={c("wanted")} durationInFrames={24} style={{ left: 296, top: 736 }}>
          <span style={{ ...mono(48, colors.text), fontWeight: 700 }}>he wanted to go back to hacking.</span>
        </FadeIn>
      </Scene>

      {/* 4: the younger defendant (never named) */}
      <Scene from={tYounger} to={tEnd}>
        <FadeIn at={tYounger + 2} durationInFrames={18} style={{ left: 300, top: 290 }}>
          <BlobCharacter color="#8C97A3" size={330} seed={17} idle={0.6} />
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <span style={{ display: "inline-block", padding: "6px 18px", borderRadius: 6, background: "#8C97A3", ...mono(28, colors.bg), fontWeight: 700, filter: "blur(7px)" }}>▇▇▇▇▇ ▇▇▇▇▇▇</span>
          </div>
        </FadeIn>
        <FadeIn at={tYounger + 6} style={{ left: 740, top: 250 }}>
          <span style={{ ...mono(32, colors.dim), letterSpacing: "0.18em" }}>THE YOUNGER DEFENDANT</span>
        </FadeIn>
        <FadeIn at={c("avoided")} style={{ left: 740, top: 310 }}>
          <span style={{ ...mono(44, MUTED) }}>avoided custody</span>
        </FadeIn>
        <FadeIn at={c("youth") - 6} durationInFrames={24} style={{ left: 730, top: 400 }}>
          <Plain width={1000}>
            <div style={{ fontFamily: fonts.display, fontSize: 104, lineHeight: 1.02, color: colors.text }}>
              YOUTH REHABILITATION
              <br />
              ORDER
            </div>
            <div style={{ ...mono(40, MUTED), marginTop: 18, opacity: frame >= c("18") ? Math.min(1, (frame - c("18")) / 16) : 0 }}>18 MONTHS OF SUPERVISION</div>
          </Plain>
        </FadeIn>
      </Scene>

      {/* 5: no end date. Silent. */}
      <Scene from={tEnd} to={D}>
        <HospitalDoor />
        {/* calendar pages with no date on them */}
        {[0, 1, 2, 3].map((i) => {
          const local = pages - i * 26;
          if (local < 0) return null;
          const a = Math.min(1, local / 20);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 820 + i * 250,
                top: 250 + (1 - a) * 14,
                width: 210,
                height: 240,
                borderRadius: 10,
                background: "rgba(12,16,20,0.94)",
                border: `2px solid ${colors.line}`,
                opacity: a * (1 - i * 0.17),
                textAlign: "center",
              }}
            >
              <div style={{ height: 46, background: "#1D252D", borderRadius: "8px 8px 0 0" }} />
              <div style={{ fontFamily: fonts.display, fontSize: 130, lineHeight: 1.4, color: colors.dim }}>—</div>
            </div>
          );
        })}
        <FadeIn at={c("18", 1) - 6} durationInFrames={26} style={{ left: 820, top: 560 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 120, lineHeight: 1, color: colors.text, letterSpacing: "0.03em" }}>HE WAS EIGHTEEN</span>
        </FadeIn>
        <FadeIn at={c("nobody")} durationInFrames={26} style={{ left: 824, top: 710 }}>
          <span style={{ ...mono(40, MUTED) }}>release date: unknown</span>
        </FadeIn>
      </Scene>
    </>
  );
};
