import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Chip, Cop, HotelRoom, Pop, Scene, SeizedStamp, Sfx, Terminal, TitleSlam, White, mono } from "../components";
import { useClip } from "./words";

/** Tagged evidence card. */
const Evidence: React.FC<{ at: number; left: number; tag: string; label: string; color?: string; children: React.ReactNode }> = ({
  at,
  left,
  tag,
  label,
  color = colors.amber,
  children,
}) => (
  <Pop at={at} from="up" sound="pop" style={{ left, top: 250, width: 420 }}>
    <div
      style={{
        height: 330,
        borderRadius: 14,
        background: "rgba(7,9,11,0.93)",
        border: `3px solid ${color}`,
        boxShadow: `0 0 50px ${color}33, 0 24px 50px rgba(0,0,0,0.7)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", left: 16, top: 14, padding: "4px 12px", background: color, color: colors.bg, borderRadius: 4, ...mono(22, colors.bg), fontWeight: 700 }}>{tag}</div>
      <div style={{ height: 130, display: "flex", alignItems: "center" }}>{children}</div>
      <div style={{ ...mono(40, color), fontWeight: 700, letterSpacing: "0.08em" }}>{label}</div>
    </div>
  </Pop>
);

type Block = { label: string; sub?: string; at: number; kind: "arrest" | "free" | "hack" };

/** Plain fade-in text, no sound. */
const Fade: React.FC<{ at: number; frames?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ at, frames = 24, style, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", ...style, opacity: o }}>{children}</div>;
};

export const Clip18: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(18);

  const tFound = c("They found");
  const tLine = c("Look");
  const tBail = c("This time");
  const tChannel = c("The channel");
  const tAge = c("He was 17");
  const tGlow = c("another");

  const copsIn = sp(frame, fps, c("police"), springs.smooth, 26);
  const dim = frame >= tFound ? sp(frame, fps, tFound, springs.smooth, 12) : 0;

  const blocks: Block[] = [
    { label: "ARREST", sub: "JAN", at: c("Arrested"), kind: "arrest" },
    { label: "RELEASED", at: c("Released"), kind: "free" },
    { label: "HACK", at: c("Released") + 10, kind: "hack" },
    { label: "ARREST", sub: "MAR", at: c("Arrested", 1), kind: "arrest" },
    { label: "BAILED", at: c("Bailed"), kind: "free" },
    { label: "HACK", at: c("Bailed") + 10, kind: "hack" },
    { label: "ARREST", sub: "SEP", at: c("Arrested", 2), kind: "arrest" },
  ];
  const fill = sp(frame, fps, c("Arrested"), springs.smooth, c("Arrested", 2) - c("Arrested") + 10);
  const channelDim = interpolate(frame, [tChannel + 20, tAge - 6], [1, 0.22], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      {/* 1: police in the hotel room, and what they found */}
      <Scene from={0} to={tLine}>
        <HotelRoom tvOn={0.55} stick>
          <div style={{ position: "absolute", left: 300, top: 470 }}>
            <White size={250} look={{ x: 0.9, y: 0 }} />
          </div>
          {[0, 1].map((i) => (
            <div key={i} style={{ position: "absolute", left: interpolate(copsIn, [0, 1], [2000, 1180 + i * 260]), top: 520, opacity: frame >= c("police") ? 1 : 0 }}>
              <Cop size={340} seed={12 + i} look={{ x: -0.9, y: 0 }} />
            </div>
          ))}
        </HotelRoom>
        <Sfx name="door" at={c("walked")} volume={0.8} />
        <Terminal
          style={{ position: "absolute", left: 110, top: 50, background: "rgba(7,9,11,0.82)", padding: "12px 20px", borderRadius: 8 }}
          fontSize={56}
          lines={[{ text: "SEPTEMBER 22, 2022", at: c("September"), durationInFrames: 40 }]}
        />
        <Scene from={tFound} to={tLine}>
          <AbsoluteFill style={{ background: "rgba(7,9,11,0.6)", opacity: dim }} />
          <div style={{ position: "absolute", left: 500, top: 170, ...mono(38, colors.text), opacity: dim }}>&gt; found in the room:</div>
          <Evidence at={c("fire")} left={500} tag="ITEM 1" label="FIRE STICK">
            <div style={{ width: 210, height: 60, borderRadius: 12, background: "#1A2027", border: "4px solid #4A5866", position: "relative" }}>
              <div style={{ position: "absolute", right: 22, top: 18, width: 18, height: 18, borderRadius: 9, background: colors.amber, boxShadow: `0 0 16px ${colors.amber}` }} />
              <div style={{ position: "absolute", left: -34, top: 17, width: 34, height: 22, background: "#4A5866", borderRadius: "5px 0 0 5px" }} />
            </div>
          </Evidence>
          <Evidence at={c("iPhone")} left={980} tag="ITEM 2" label="AN IPHONE" color={colors.red}>
            <div style={{ width: 70, height: 130, borderRadius: 14, background: "#0B0F13", border: "5px solid #4A5866", position: "relative" }}>
              <div style={{ position: "absolute", left: 9, right: 9, top: 12, bottom: 20, background: colors.panelLight, borderRadius: 4 }} />
            </div>
          </Evidence>
          <SeizedStamp at={c("bail")} text="BANNED ITEM" fontSize={56} rotate={-8} style={{ left: 1040, top: 610 }} />
        </Scene>
      </Scene>

      {/* 2: the timeline */}
      <Scene from={tLine} to={tBail}>
        <div style={{ position: "absolute", left: 110, top: 150, ...mono(40, colors.text) }}>&gt; look at that timeline:</div>
        <div style={{ position: "absolute", left: 110, top: 250, ...mono(30, colors.dim), letterSpacing: "0.3em" }}>2022</div>
        <div style={{ position: "absolute", left: 110, top: 438, width: 1700, height: 8, background: colors.line }}>
          <div style={{ width: `${Math.min(1, fill) * 100}%`, height: "100%", background: colors.text }} />
        </div>
        {blocks.map((b, i) => {
          if (frame < b.at) return null;
          const p = sp(frame, fps, b.at, springs.pop);
          const hot = b.kind === "hack" && frame >= tGlow;
          const g = sp(frame, fps, tGlow + (i > 3 ? 6 : 0), springs.pop);
          const col = b.kind === "arrest" ? colors.agent : b.kind === "hack" ? (hot ? colors.red : colors.dim) : colors.text;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 110 + i * 245,
                top: 330,
                width: 225,
                height: 220,
                borderRadius: 12,
                border: `3px ${b.kind === "hack" && !hot ? "dashed" : "solid"} ${col}`,
                background: hot ? "rgba(255,59,59,0.2)" : "rgba(7,9,11,0.94)",
                boxShadow: hot ? `0 0 60px ${colors.red}88` : "none",
                transform: `scale(${hot ? 1 + 0.14 * (1 - g) + 0.04 : p})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <div style={{ fontFamily: fonts.display, fontSize: b.kind === "hack" ? 84 : 58, lineHeight: 1, color: col }}>{b.kind === "hack" && !hot ? "?" : b.label}</div>
              {b.sub ? <div style={{ ...mono(34, col), fontWeight: 700 }}>{b.sub}</div> : null}
            </div>
          );
        })}
        {blocks.filter((b) => b.kind !== "hack").map((b, i) => (
          <Sfx key={i} name={b.kind === "arrest" ? "click" : "pop"} at={b.at} />
        ))}
        <Sfx name="snap" at={tGlow} />
        <Sfx name="snap" at={tGlow + 6} />
        <Chip at={c("between")} text="BETWEEN EVERY SINGLE ARREST..." color={colors.text} fontSize={38} sound={false} style={{ left: 110, top: 620 }} />
        <TitleSlam text="ANOTHER HACK." color={colors.red} fontSize={150} at={c("hack")} style={{ left: 1010, right: 40, top: 608 }} />
      </Scene>

      {/* 3: no more bail */}
      <Scene from={tBail} to={tChannel}>
        <div style={{ position: "absolute", left: 1180, top: 110, width: 380, height: 720, background: "linear-gradient(to right, #2A323A, #1C232A)", border: "8px solid #11161B", borderRadius: 6, boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}>
          <div style={{ position: "absolute", left: 110, top: 110, width: 160, height: 46, background: "#0B0E11", borderRadius: 4 }} />
          <div style={{ position: "absolute", right: 34, top: 360, width: 26, height: 70, background: "#11161B", borderRadius: 6 }} />
        </div>
        <Sfx name="door" at={c("held")} volume={0.8} />
        <SeizedStamp at={c("no bail")} text="NO MORE BAIL" fontSize={120} rotate={-7} style={{ left: 150, top: 250 }} />
        <Chip at={c("custody")} text="HELD IN CUSTODY UNTIL TRIAL" color={colors.text} fontSize={40} style={{ left: 170, top: 560 }} />
      </Scene>

      {/* 4: the channel falls silent */}
      <Scene from={tChannel} to={tAge}>
        <div style={{ position: "absolute", left: 460, top: 110, width: 1000, opacity: channelDim, filter: `saturate(${channelDim})` }}>
          <div style={{ background: colors.panel, border: `2px solid ${colors.line}`, borderRadius: 14, overflow: "hidden", fontFamily: fonts.mono }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 28px", background: "#090D10", borderBottom: `2px solid ${colors.line}` }}>
              <div style={{ width: 62, height: 62, borderRadius: 31, background: colors.greenDim }} />
              <div>
                <div style={{ fontFamily: fonts.display, fontSize: 60, lineHeight: 1, color: colors.text }}>LAPSUS$</div>
                <div style={{ fontSize: 22, color: colors.dim }}>public channel · member count frozen</div>
              </div>
            </div>
            <div style={{ padding: "26px 28px 30px" }}>
              {[0, 1].map((i) => (
                <div key={i} style={{ marginBottom: 18, padding: "16px 20px", background: colors.panelLight, borderRadius: 10, opacity: 0.6 }}>
                  <div style={{ width: 520 - i * 140, height: 14, background: colors.line, borderRadius: 3 }} />
                  <div style={{ width: 760 - i * 200, height: 14, background: colors.line, borderRadius: 3, marginTop: 10 }} />
                </div>
              ))}
              <div style={{ fontSize: 26, color: colors.dim, marginTop: 8 }}>last post: september 2022</div>
              <div style={{ fontSize: 26, color: colors.dim, marginTop: 6 }}>no new messages</div>
            </div>
          </div>
        </div>
        <Chip at={c("silent")} text="SILENT" color={colors.text} fontSize={44} sound={false} style={{ left: 130, top: 300 }} />
        <Chip at={c("stopped")} text="THE LEAKS STOPPED" color={colors.text} fontSize={32} sound={false} style={{ left: 1410, top: 420 }} />
        <Fade at={c("finished") - 8} frames={16} style={{ left: 0, right: 0, top: 660, textAlign: "center" }}>
          <span style={{ fontFamily: fonts.display, fontSize: 150, color: colors.dim, letterSpacing: "0.06em" }}>FINISHED.</span>
        </Fade>
      </Scene>

      {/* 5: quiet end card */}
      <Scene from={tAge} to={D}>
        <Fade at={tAge + 4} frames={22} style={{ left: 0, right: 0, top: 400, textAlign: "center" }}>
          <span style={{ fontFamily: fonts.display, fontSize: 210, color: colors.text, letterSpacing: "0.04em" }}>HE WAS SEVENTEEN.</span>
        </Fade>
      </Scene>
    </>
  );
};
