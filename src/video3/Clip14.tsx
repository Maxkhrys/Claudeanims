import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  BlobCharacter,
  Card,
  Chip,
  Cop,
  Counter,
  EvidenceBoard,
  Flash,
  Pop,
  Scene,
  SeizedStamp,
  Sfx,
  Terminal,
  TitleSlam,
  White,
  mono,
} from "../components";
import { useClip } from "./words";

const Bar: React.FC<{ width: number; height?: number; color?: string }> = ({ width, height = 16, color = "#2A2F36" }) => (
  <div style={{ width, height, borderRadius: 3, background: color }} />
);

/** Simple paper form with a title and a few ruled lines. */
const PaperForm: React.FC<{ title: string; lines?: number; children?: React.ReactNode }> = ({ title, lines = 4, children }) => (
  <div style={{ width: 520, height: 600, borderRadius: 8, background: "#D9DDE0", padding: "34px 40px", boxShadow: "0 30px 70px rgba(0,0,0,0.7)", position: "relative" }}>
    <div style={{ fontFamily: fonts.display, fontSize: 64, color: "#11161B", lineHeight: 1 }}>{title}</div>
    <div style={{ height: 4, background: "#11161B", margin: "12px 0 26px" }} />
    {new Array(lines).fill(0).map((_, i) => (
      <div key={i} style={{ marginBottom: 26 }}>
        <Bar width={380 - (i % 3) * 70} height={14} color="#9AA3AB" />
        <div style={{ height: 8 }} />
        <Bar width={300 + (i % 2) * 90} height={14} color="#B9C0C6" />
      </div>
    ))}
    {children}
  </div>
);

export const Clip14: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(14);

  const tPublic = c("And on March");
  const tArrests = c("One day");
  const tAgain = c("And on March", 1);

  const windowLit = sp(frame, fps, c("traced"), springs.smooth, 20);

  return (
    <>
      {/* 1: researchers connect the dots */}
      <Scene from={0} to={tPublic}>
        <EvidenceBoard
          width={1280}
          height={720}
          style={{ left: 90, top: 90 }}
          items={[
            { id: "white", x: 250, y: 150, at: 20, title: "WHITE", sub: "username", color: colors.text },
            { id: "breach", x: 1010, y: 150, at: c("tracking"), title: "BREACHBASE", sub: "username", color: colors.text },
            { id: "habits", x: 220, y: 560, at: c("habits"), title: "HABITS", sub: "when he was online", color: colors.amber },
            { id: "mistakes", x: 1040, y: 560, at: c("mistakes"), title: "MISTAKES", sub: "details he let slip", color: colors.amber },
            { id: "who", x: 640, y: 370, at: c("connected"), title: "ONE PERSON", sub: "name: ██████████", color: colors.red, big: true },
          ]}
          strings={[
            { from: "white", to: "who", at: c("usernames") },
            { from: "breach", to: "who", at: c("usernames") + 8 },
            { from: "habits", to: "who", at: c("habits") + 8 },
            { from: "mistakes", to: "who", at: c("mistakes") + 8 },
          ]}
        />
        {[0, 1].map((i) => (
          <Pop key={i} at={8 + i * 6} origin="center bottom" style={{ left: 1430 + i * 210, top: 420 + i * 40 }}>
            <BlobCharacter color={colors.agent} size={300 - i * 20} seed={30 + i} look={{ x: -0.9, y: -0.2 }} />
          </Pop>
        ))}
        <Chip at={c("researchers")} text="SECURITY RESEARCHERS" color={colors.agent} fontSize={28} style={{ left: 1385, top: 250 }} />
        <Chip at={c("months")} text="TRACKING HIM FOR MONTHS" color={colors.text} fontSize={24} style={{ left: 1385, top: 330 }} />
      </Scene>

      {/* 2: the story goes public */}
      <Scene from={tPublic} to={tArrests}>
        <Terminal
          style={{ position: "absolute", left: 110, top: 70 }}
          fontSize={56}
          lines={[{ text: "MARCH 23, 2022", at: c("March"), durationInFrames: 22 }]}
        />
        <Pop at={c("story") - 4} from="slam" sound="slam" style={{ left: 110, top: 190 }}>
          <div style={{ width: 900, background: "#E3E0D8", borderRadius: 6, padding: "26px 40px 34px", transform: "rotate(-2deg)", boxShadow: "0 30px 80px rgba(0,0,0,0.75)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "4px solid #11161B", paddingBottom: 10 }}>
              <Bar width={300} height={34} color="#11161B" />
              <span style={{ fontFamily: fonts.mono, fontSize: 22, color: "#3A424A" }}>23 MARCH 2022</span>
            </div>
            <div style={{ fontFamily: fonts.display, fontSize: 104, lineHeight: 0.98, color: "#11161B", marginTop: 18 }}>
              TEENAGER SUSPECTED OF BEING HACKING MASTERMIND
            </div>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
              {[820, 760, 800, 520].map((w, i) => (
                <Bar key={i} width={w} height={12} color="#9C9A93" />
              ))}
            </div>
          </div>
        </Pop>
        <Chip at={c("16-year-old")} text="AGE 16" color={colors.amber} filled fontSize={44} style={{ left: 1090, top: 120 }} />
        <Chip at={c("living")} text="LIVING WITH HIS MOTHER" color={colors.text} fontSize={30} style={{ left: 1090, top: 220 }} />
        <Chip at={c("Oxford")} text="NEAR OXFORD" color={colors.text} fontSize={30} style={{ left: 1090, top: 300 }} />

        {/* the house: one bedroom window, a parent at the door */}
        <Pop at={c("world's") - 4} from="up" style={{ left: 1100, top: 390 }}>
          <div style={{ position: "relative", width: 700, height: 460 }}>
            <div style={{ position: "absolute", left: 60, top: 0, width: 0, height: 0, borderLeft: "290px solid transparent", borderRight: "290px solid transparent", borderBottom: "130px solid #1A222B" }} />
            <div style={{ position: "absolute", left: 90, top: 128, width: 520, height: 332, background: "#121920", border: "3px solid #232D37" }} />
            <div style={{ position: "absolute", left: 420, top: 170, width: 130, height: 110, background: `rgba(57,255,136,${0.12 + 0.75 * windowLit})`, border: "5px solid #232D37", boxShadow: `0 0 ${70 * windowLit}px ${colors.green}` }} />
            <div style={{ position: "absolute", left: 160, top: 290, width: 110, height: 170, background: "#2A1F16", border: "4px solid #3A2C20", borderRadius: "6px 6px 0 0" }} />
            <div style={{ position: "absolute", left: 250, top: 300 }}>
              <BlobCharacter color={colors.extras[3]} size={170} seed={40} look={{ x: 0.3, y: -0.7 }} />
            </div>
          </div>
        </Pop>
        <Chip at={c("bedroom") - 6} text="TRACED TO A TEENAGER'S BEDROOM" color={colors.green} fontSize={28} origin="center center" style={{ left: 1170, top: 820 }} />
      </Scene>

      {/* 3: seven arrests */}
      <Scene from={tArrests} to={tAgain}>
        <Terminal
          style={{ position: "absolute", left: 110, top: 70 }}
          fontSize={56}
          lines={[{ text: "MARCH 24, 2022", at: c("day"), durationInFrames: 20 }]}
        />
        {[0, 1, 2].map((i) => (
          <Pop key={i} at={c("British") + i * 5} origin="center bottom" style={{ left: 110 + i * 190, top: 430 }}>
            <Cop size={i === 1 ? 340 : 300} seed={12 + i} look={{ x: 0.8, y: 0 }} />
          </Pop>
        ))}
        <div style={{ position: "absolute", left: 800, top: 170, display: "flex", alignItems: "baseline", gap: 36 }}>
          {frame >= c("seven") - 10 ? <Counter to={7} at={c("seven") - 10} durationInFrames={18} fontSize={330} color={colors.red} /> : null}
          <Pop at={c("arrests")} from="up" style={{ position: "relative" }}>
            <span style={{ fontFamily: fonts.display, fontSize: 190, color: colors.text, lineHeight: 1 }}>ARRESTED</span>
          </Pop>
        </div>
        <div style={{ position: "absolute", left: 800, top: 530, display: "flex", gap: 22 }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Pop key={i} at={c("arrests") + 6 + i * 3} origin="center bottom" style={{ position: "relative" }}>
              <BlobCharacter color={["#DDE4EC", colors.extras[0], colors.extras[1], colors.extras[2], colors.extras[3], colors.ross, colors.extras[1]][i]} size={150} seed={50 + i} idle={0.5} />
            </Pop>
          ))}
        </div>
        <Chip at={c("16")} text="ALL AGED 16 TO 21" color={colors.amber} fontSize={44} style={{ left: 800, top: 720 }} />
        <Flash at={c("seven")} color={colors.agent} peak={0.3} durationInFrames={10} />
      </Scene>

      {/* 4: arrested again, charged, and given rules */}
      <Scene from={tAgain} to={D}>
        <Pop at={tAgain + 2} style={{ left: 120, top: 100 }}>
          <div style={{ width: 300, borderRadius: 14, overflow: "hidden", border: `3px solid ${colors.line}`, background: colors.panel, textAlign: "center" }}>
            <div style={{ background: colors.red, ...mono(34, colors.bg), fontWeight: 700, padding: "8px 0", letterSpacing: "0.2em" }}>MARCH</div>
            <div style={{ fontFamily: fonts.display, fontSize: 210, lineHeight: 1.05, color: colors.text }}>30</div>
            <div style={{ ...mono(26, colors.dim), paddingBottom: 12 }}>2022</div>
          </div>
        </Pop>
        <Pop at={c("Arion") - 4} origin="center bottom" style={{ left: 150, top: 520 }}>
          <White size={250} look={{ x: 0.6, y: 0.4 }} />
        </Pop>
        <Pop at={c("arrested")} origin="center bottom" style={{ left: 360, top: 470 }}>
          <Cop size={320} look={{ x: -0.8, y: 0 }} />
        </Pop>
        <SeizedStamp at={c("again")} text="ARREST NUMBER TWO" fontSize={84} rotate={-5} style={{ left: 470, top: 130 }} />
        <Chip at={c("second")} text="THE SECOND TIME IN 10 WEEKS" color={colors.text} fontSize={27} style={{ left: 480, top: 310 }} />

        <Pop at={c("This time") - 4} from="right" style={{ left: 1010, top: 300, transform: undefined }}>
          <div style={{ transform: "rotate(-3deg) scale(0.78)", transformOrigin: "0 0" }}>
            <PaperForm title="CHARGE SHEET" lines={5}>
              <SeizedStamp at={c("charged")} text="CHARGED" fontSize={76} rotate={-12} style={{ left: 120, top: 330 }} />
            </PaperForm>
          </div>
        </Pop>
        <Pop at={c("And this") - 2} from="right" style={{ left: 1450, top: 280, transform: undefined }}>
          <div style={{ transform: "rotate(3deg) scale(0.78)", transformOrigin: "0 0" }}>
            <PaperForm title="BAIL" lines={3}>
              <div style={{ ...mono(26, "#11161B"), fontWeight: 700, marginTop: 10 }}>CONDITIONS:</div>
              <SeizedStamp at={c("court") + 4} text="RULES APPLY" fontSize={52} rotate={8} color={colors.agent} style={{ left: 60, top: 400 }} />
            </PaperForm>
          </div>
        </Pop>
        <Sfx name="whoosh" at={c("This time") - 4} volume={0.6} />
      </Scene>
    </>
  );
};
