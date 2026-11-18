import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BrandTag, Chip, FadeIn, Pop, Scene, Sfx, Terminal, TitleSlam, White, mono } from "../components";
import { useClip } from "./words";

/**
 * UPDATE AFTER THE SENTENCING HEARING.
 * This is the only place the outcome is written. While it reads "PENDING" the
 * final card says he is still waiting; change both lines once the sentence is known
 * (and re-record the last narration line of this clip to match).
 */
const SENTENCE_STATUS = "PENDING";
const SENTENCE_NOTE = "still waiting to learn his sentence";

/** Plain, quiet courtroom: wall panels, a raised bench and a dock rail. */
const Courtroom: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(to bottom, #10151B 0%, #131A22 66%, #0A0D11 66%, #07090B 100%)" }} />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{ position: "absolute", left: 60 + i * 310, top: 90, width: 270, height: 520, border: "3px solid #1B242E", borderRadius: 6, opacity: 0.7 }} />
    ))}
    {/* judge's bench */}
    <div style={{ position: "absolute", left: 1150, top: 470, width: 640, height: 250, borderRadius: "14px 14px 0 0", background: "linear-gradient(to bottom, #2A2118, #15100B)", border: "2px solid #4A3A28" }} />
    <div style={{ position: "absolute", left: 1120, top: 450, width: 700, height: 26, borderRadius: 6, background: "#3A2D20" }} />
    {/* dock rail */}
    <div style={{ position: "absolute", left: 300, top: 640, width: 520, height: 14, borderRadius: 7, background: "#3A4652" }} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <div key={i} style={{ position: "absolute", left: 318 + i * 80, top: 652, width: 8, height: 130, background: "#2A343D" }} />
    ))}
  </AbsoluteFill>
);

/** A charge card that turns over, then gets a calm GUILTY PLEA mark. */
const ChargeCard: React.FC<{ at: number; left: number; children: React.ReactNode }> = ({ at, left, children }) => {
  const frame = useCurrentFrame();
  const { fps } = { fps: 30 };
  const flip = sp(frame, fps, at, springs.snappy);
  const shown = frame >= at;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: 410,
        width: 520,
        height: 330,
        borderRadius: 14,
        background: shown ? colors.panel : "#0B0F13",
        border: `2px solid ${shown ? colors.text : colors.line}`,
        boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
        transform: `perspective(900px) rotateY(${(1 - flip) * 90}deg)`,
        opacity: shown ? 1 : 0.35,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
      }}
    >
      {shown ? (
        <>
          <Sfx name="click" at={at} />
          <div style={{ ...mono(22, colors.dim), letterSpacing: "0.2em" }}>CHARGE</div>
          {children}
          <div
            style={{
              padding: "8px 22px",
              border: `3px solid ${colors.red}`,
              borderRadius: 8,
              ...mono(34, colors.red),
              fontWeight: 700,
              letterSpacing: "0.12em",
              opacity: Math.min(1, Math.max(0, (frame - at - 10) / 14)),
            }}
          >
            GUILTY PLEA
          </div>
        </>
      ) : null}
    </div>
  );
};

/** Tear-off style calendar card. */
const DayCard: React.FC<{ day: string; label: string; color: string }> = ({ day, label, color }) => (
  <div style={{ width: 560, borderRadius: 16, overflow: "hidden", background: colors.panel, border: `3px solid ${color}`, boxShadow: `0 0 60px ${color}33, 0 30px 70px rgba(0,0,0,0.6)` }}>
    <div style={{ background: color, color: colors.bg, textAlign: "center", padding: "12px 0", ...mono(34, colors.bg), fontWeight: 700, letterSpacing: "0.2em" }}>NOVEMBER 2026</div>
    <div style={{ textAlign: "center", fontFamily: fonts.display, fontSize: 300, lineHeight: 1, color: colors.text, paddingTop: 16 }}>{day}</div>
    <div style={{ textAlign: "center", padding: "6px 20px 28px", ...mono(36, color), fontWeight: 700, letterSpacing: "0.06em" }}>{label}</div>
  </div>
);

/** Our own plain game box: no real artwork. */
const GameBox: React.FC = () => (
  <div style={{ position: "relative", width: 300 }}>
    <div
      style={{
        width: 300,
        height: 390,
        borderRadius: 10,
        background: "linear-gradient(135deg, #2A1E3A, #121722 60%, #1E2A22)",
        border: `3px solid ${colors.amber}`,
        boxShadow: `0 0 70px ${colors.amber}44, 0 30px 60px rgba(0,0,0,0.7)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ ...mono(24, colors.dim), letterSpacing: "0.3em" }}>THE GAME</div>
      <div style={{ fontFamily: fonts.display, fontSize: 230, lineHeight: 0.95, color: colors.amber, textShadow: `0 0 40px ${colors.amber}66` }}>VI</div>
    </div>
    {/* shelf */}
    <div style={{ position: "absolute", left: -90, top: 390, width: 480, height: 18, borderRadius: 4, background: "#2A343D" }} />
  </div>
);

/** Plain closed courtroom door. */
const Door: React.FC = () => (
  <div style={{ width: 280, height: 430, borderRadius: "10px 10px 0 0", background: "linear-gradient(to right, #5A452E, #3A2C1C)", border: "5px solid #8A6E48", position: "relative", boxShadow: "0 30px 60px rgba(0,0,0,0.7)" }}>
    <div style={{ position: "absolute", left: 30, top: 34, width: 212, height: 150, border: "3px solid #7A6040", borderRadius: 4 }} />
    <div style={{ position: "absolute", left: 30, top: 214, width: 212, height: 170, border: "3px solid #7A6040", borderRadius: 4 }} />
    <div style={{ position: "absolute", right: 22, top: 205, width: 18, height: 18, borderRadius: 9, background: "#D9B36A" }} />
  </div>
);

/** The final card. Text comes from SENTENCE_STATUS / SENTENCE_NOTE at the top of this file. */
const SentenceCard: React.FC = () => (
  <div style={{ width: 1100, padding: "50px 60px 56px", borderRadius: 16, background: colors.panel, border: `2px solid ${colors.line}`, textAlign: "center", boxShadow: "0 40px 100px rgba(0,0,0,0.65)" }}>
    <div style={{ ...mono(38, colors.dim), letterSpacing: "0.3em" }}>THE SENTENCE</div>
    <div style={{ fontFamily: fonts.display, fontSize: 240, lineHeight: 1, color: colors.text, marginTop: 14 }}>{SENTENCE_STATUS}</div>
    <div style={{ ...mono(34, colors.dim), marginTop: 10 }}>{SENTENCE_NOTE}</div>
  </div>
);

export const Clip25: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(25);

  const tPlea = c("And this time");
  const tTiming = c("And the timing");
  const tGame = c("The game");
  const tWait = c("As this");
  const link = sp(frame, fps, c("Grand") + 8, springs.smooth, 16);

  return (
    <>
      {/* 1: the courtroom */}
      <Scene from={0} to={tPlea}>
        <Courtroom />
        <Terminal
          style={{ position: "absolute", left: 110, top: 110, background: "rgba(7,9,11,0.82)", padding: "16px 24px", borderRadius: 8 }}
          fontSize={62}
          lines={[
            { text: "NOVEMBER 16, 2026", at: c("November"), durationInFrames: 26 },
            { text: "woolwich crown court, london", prompt: "> ", at: c("stood"), durationInFrames: 30, size: 0.56, color: colors.text },
          ]}
        />
        <Pop at={c("Kurtaj")} origin="center bottom" style={{ left: 470, top: 420 }}>
          <White size={300} look={{ x: 0.7, y: -0.2 }} />
        </Pop>
        <Chip at={c("21")} text="AGE 21" color={colors.text} fontSize={52} style={{ left: 880, top: 500 }} />
      </Scene>

      {/* 2: the plea */}
      <Scene from={tPlea} to={tTiming}>
        <FadeIn at={c("no jury")} style={{ left: 0, right: 0, top: 96, textAlign: "center" }}>
          <span style={{ ...mono(40, colors.dim), letterSpacing: "0.22em" }}>THIS TIME, NO JURY</span>
        </FadeIn>
        {/* the empty jury box, until the plea */}
        {frame < c("guilty") ? (
          <FadeIn at={c("no jury") + 6} durationInFrames={16} style={{ left: 360, top: 330 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 22, width: 1200 }}>
              {new Array(12).fill(0).map((_, i) => (
                <div key={i} style={{ height: 150, borderRadius: "60px 60px 12px 12px", border: `3px dashed ${colors.dim}`, opacity: 0.7 }} />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 26, ...mono(34, colors.dim), letterSpacing: "0.2em" }}>12 EMPTY SEATS</div>
          </FadeIn>
        ) : null}
        <TitleSlam text="GUILTY." color={colors.text} fontSize={230} at={c("guilty")} glitch={false} style={{ top: 150 }} />
        <ChargeCard at={c("Rockstar")} left={130}>
          <BrandTag name="ROCKSTAR" size={74} />
        </ChargeCard>
        <ChargeCard at={c("Uber")} left={700}>
          <BrandTag name="UBER" size={96} />
        </ChargeCard>
        <ChargeCard at={c("crimes")} left={1270}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: fonts.display, fontSize: 92, lineHeight: 0.95, color: colors.amber }}>LAPSUS$</div>
            <div style={{ ...mono(26), marginTop: 6 }}>as a teenager</div>
          </div>
        </ChargeCard>
      </Scene>

      {/* 3: the same week */}
      <Scene from={tTiming} to={tGame}>
        <FadeIn at={c("timing")} durationInFrames={14} style={{ left: 0, right: 0, top: 80, textAlign: "center" }}>
          <span style={{ ...mono(40, colors.dim), letterSpacing: "0.22em" }}>THE TIMING</span>
        </FadeIn>
        <Pop at={c("timing")} from="up" sound="pop" style={{ left: 250, top: 190 }}>
          <DayCard day="16" label="GUILTY PLEA" color={colors.red} />
        </Pop>
        <Pop at={c("Grand")} from="up" sound="pop" style={{ left: 1110, top: 190 }}>
          <DayCard day="19" label="GTA SIX RELEASE DAY" color={colors.amber} />
        </Pop>
        <div style={{ position: "absolute", left: 820, top: 470, height: 8, width: 280 * link, background: colors.text, boxShadow: `0 0 16px ${colors.text}` }} />
        <Chip at={c("same week")} text="THE SAME WEEK" color={colors.text} filled fontSize={44} origin="center center" style={{ left: 762, top: 730 }} />
      </Scene>

      {/* 4: the game in shops, the hacker in a cell */}
      <Scene from={tGame} to={tWait}>
        <div style={{ position: "absolute", left: 958, top: 110, width: 4, height: 720, background: colors.line }} />
        <Pop at={tGame + 2} from="up" style={{ left: 330, top: 200 }}>
          <GameBox />
        </Pop>
        <Chip at={c("hotel")} text="LEAKED FROM A HOTEL TV, 4 YEARS EARLIER" color={colors.dim} fontSize={26} origin="center center" style={{ left: 150, top: 110 }} />
        <Chip at={c("arrived")} text="IN SHOPS" color={colors.amber} filled fontSize={46} origin="center center" style={{ left: 350, top: 650 }} sound="coin" />
        <Pop at={c("while")} from="up" style={{ left: 1300, top: 170 }}>
          <Door />
        </Pop>
        <FadeIn at={c("waited")} style={{ left: 1040, right: 80, top: 650, textAlign: "center" }}>
          <span style={{ ...mono(44, colors.text), fontWeight: 700, letterSpacing: "0.1em" }}>WAITING TO BE SENTENCED</span>
        </FadeIn>
      </Scene>

      {/* 5: the sentence (see SENTENCE_STATUS at the top of the file) */}
      <Scene from={tWait} to={D}>
        <FadeIn at={tWait + 4} durationInFrames={20} style={{ left: 410, top: 230 }}>
          <SentenceCard />
        </FadeIn>
      </Scene>
    </>
  );
};
