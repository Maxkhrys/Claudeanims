import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, BrandTag, Card, Chip, Counter, Pop, Scene, Sfx, Terminal, TitleSlam, mono } from "../components";
import { useClip } from "./words";

// Clip 21, "The Bill". Normal energy returns after the two quiet clips.

/** Generic video card with a play button. Not real artwork. */
const TrailerCard: React.FC<{ width?: number; label?: string }> = ({ width = 560, label = "OFFICIAL TRAILER 1" }) => (
  <div style={{ width, borderRadius: 14, overflow: "hidden", border: `3px solid ${colors.amber}`, background: colors.panel, boxShadow: `0 0 70px ${colors.amber}33, 0 30px 70px rgba(0,0,0,0.7)` }}>
    <div style={{ height: width * 0.5, background: "linear-gradient(135deg, #3A2A14, #14100A)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: width * 0.2, height: width * 0.2, borderRadius: "50%", background: colors.amber, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 40px ${colors.amber}` }}>
        <div style={{ width: 0, height: 0, marginLeft: width * 0.02, borderTop: `${width * 0.05}px solid transparent`, borderBottom: `${width * 0.05}px solid transparent`, borderLeft: `${width * 0.08}px solid ${colors.bg}` }} />
      </div>
    </div>
    <div style={{ padding: "12px 18px", ...mono(width * 0.05, colors.text), fontWeight: 700, letterSpacing: "0.08em" }}>{label}</div>
  </div>
);

/** Office door with a padlock that snaps shut at `at`. */
const LockedDoor: React.FC<{ at: number; left: number }> = ({ at, left }) => {
  const frame = useCurrentFrame();
  const { fps } = { fps: 30 };
  const s = sp(frame, fps, at, springs.pop);
  const locked = frame >= at;
  const c = locked ? colors.red : colors.dim;
  return (
    <div style={{ position: "absolute", left, top: 250, width: 250, height: 460 }}>
      <Sfx name="click" at={at} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "10px 10px 0 0", background: "linear-gradient(to right, #222B34, #19212A)", border: `4px solid ${locked ? "#5A2A2A" : "#303A45"}` }}>
        <div style={{ position: "absolute", left: 40, top: 46, width: 170, height: 120, borderRadius: 6, background: "#0C1014", border: "3px solid #303A45" }} />
      </div>
      <svg width={110} height={130} viewBox="0 0 110 130" style={{ position: "absolute", left: 70, top: 220, transform: `scale(${locked ? 0.7 + 0.3 * s : 0.7})`, filter: locked ? `drop-shadow(0 0 16px ${colors.red})` : "none" }}>
        <path d={locked ? "M 28 62 V 40 Q 28 14 55 14 Q 82 14 82 40 V 62" : "M 28 62 V 40 Q 28 14 55 14 Q 82 14 82 36"} fill="none" stroke={c} strokeWidth={12} strokeLinecap="round" />
        <rect x={12} y={58} width={86} height={64} rx={10} fill={c} />
        <circle cx={55} cy={88} r={9} fill={colors.bg} />
      </svg>
    </div>
  );
};

/** Balance with a small pile and a big pile. `tilt` positive = right side down. */
const HypeScale: React.FC<{ tilt: number }> = ({ tilt }) => (
  <svg width={1100} height={520} viewBox="0 0 1100 520" style={{ overflow: "visible" }}>
    <path d="M 550 110 V 470 M 430 480 H 670" stroke={colors.dim} strokeWidth={12} strokeLinecap="round" />
    <g transform={`rotate(${tilt} 550 120)`}>
      <path d="M 160 120 H 940" stroke={colors.text} strokeWidth={12} strokeLinecap="round" />
      <g transform={`rotate(${-tilt} 160 120)`}>
        <path d="M 160 120 L 80 300 M 160 120 L 240 300" stroke={colors.dim} strokeWidth={4} />
        <path d="M 60 300 Q 160 360 260 300 Z" fill={colors.dim} />
        <rect x={130} y={262} width={60} height={38} rx={6} fill={colors.red} />
      </g>
      <g transform={`rotate(${-tilt} 940 120)`}>
        <path d="M 940 120 L 820 300 M 940 120 L 1060 300" stroke={colors.dim} strokeWidth={4} />
        <path d="M 800 300 Q 940 370 1080 300 Z" fill={colors.dim} />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const row = i < 4 ? 0 : i < 7 ? 1 : i < 9 ? 2 : 3;
          const col = i < 4 ? i : i < 7 ? i - 4 : i < 9 ? i - 7 : 0;
          const n = [4, 3, 2, 1][row];
          return <rect key={i} x={940 - (n * 62) / 2 + col * 62 + 3} y={262 - row * 42} width={56} height={38} rx={6} fill={colors.amber} />;
        })}
      </g>
    </g>
  </svg>
);

export const Clip21: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(21);

  const tChanged = c("And it changed");
  const tStrange = c("But here's");
  const tHype = c("The leak didn't");
  const tCourt = c("His own");

  const tilt = sp(frame, fps, c("kill"), springs.pop) * 16;

  return (
    <>
      {/* 1: the damage report */}
      <Scene from={0} to={tChanged}>
        <Pop at={c("Rockstar")} from="left" style={{ left: 130, top: 100 }}>
          <BrandTag name="ROCKSTAR" size={110} />
        </Pop>
        <TitleSlam text="A NIGHTMARE" color={colors.red} fontSize={150} at={c("nightmare")} style={{ left: 1000, right: 60, top: 80 }} />
        <Pop at={c("company")} from="up" style={{ left: 250, top: 300 }}>
          <Card accent={colors.amber} style={{ width: 1420, padding: "30px 50px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...mono(28, colors.dim), letterSpacing: "0.2em" }}>
              <span>DAMAGE REPORT</span>
              <span>as told to the court</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 30, marginTop: 20, minHeight: 190 }}>
              <span style={{ ...mono(34, colors.dim), width: 330 }}>COST TO RECOVER</span>
              {frame >= c("5") ? <Counter to={5000000} prefix="$" at={c("5")} durationInFrames={c("recover") - c("5") + 8} fontSize={170} color={colors.amber} /> : null}
            </div>
          </Card>
        </Pop>
        <Chip at={c("thousands")} text="+ THOUSANDS OF STAFF HOURS" color={colors.text} fontSize={46} origin="center center" style={{ left: 560, top: 690 }} />
      </Scene>

      {/* 2: security tightened */}
      <Scene from={tChanged} to={tStrange}>
        <Terminal
          style={{ position: "absolute", left: 130, top: 110 }}
          fontSize={42}
          color={colors.text}
          lines={[{ text: "it changed how the studio worked", prompt: "> ", at: tChanged + 2, durationInFrames: 34 }]}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <LockedDoor key={i} at={c("Security") + i * 7} left={200 + i * 320} />
        ))}
        <Chip at={c("tightened")} text="SECURITY TIGHTENED" color={colors.red} filled fontSize={54} origin="center center" style={{ left: 650, top: 740 }} />
      </Scene>

      {/* 3: the strange part */}
      <Scene from={tStrange} to={tHype}>
        <Chip at={c("strange")} text="THE STRANGE PART" fontSize={40} style={{ left: 130, top: 90 }} />
        <Pop at={c("A little")} from="left" style={{ left: 130, top: 190 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 96, lineHeight: 1, color: colors.text }}>DECEMBER 2023</span>
          <div style={{ ...mono(30, colors.dim), marginTop: 8 }}>a little over a year after the leak</div>
        </Pop>
        <Pop at={c("first")} sound="pop" style={{ left: 130, top: 400 }}>
          <TrailerCard width={600} />
        </Pop>
        <div style={{ position: "absolute", left: 800, right: 60, top: 400, display: "flex", flexDirection: "column", alignItems: "center" }}>
          {frame >= c("90") ? <Counter to={90000000} suffix="+" at={c("90")} durationInFrames={c("day") - c("90")} fontSize={150} color={colors.amber} /> : null}
          <Pop at={c("times")} from="up" style={{ position: "relative", marginTop: 14 }}>
            <span style={{ ...mono(52, colors.text), fontWeight: 700, letterSpacing: "0.08em" }}>VIEWS</span>
          </Pop>
          <Chip at={c("single")} text="IN A SINGLE DAY" fontSize={46} origin="center center" style={{ position: "relative", marginTop: 20 }} />
        </div>
      </Scene>

      {/* 4: leak vs hype */}
      <Scene from={tHype} to={tCourt}>
        <div style={{ position: "absolute", left: 410, top: 190 }}>
          <HypeScale tilt={tilt} />
        </div>
        <Pop at={tHype + 4} from="up" style={{ left: 420, top: 110 }}>
          <span style={{ ...mono(44, colors.red), fontWeight: 700, letterSpacing: "0.12em" }}>THE LEAK</span>
        </Pop>
        <Pop at={c("hype") - 4} from="up" style={{ left: 1210, top: 110 }}>
          <span style={{ ...mono(44, colors.amber), fontWeight: 700, letterSpacing: "0.12em" }}>THE HYPE</span>
        </Pop>
        <Sfx name="whoosh" at={c("kill")} />
      </Scene>

      {/* 5: the judge is not persuaded */}
      <Scene from={tCourt} to={D} exit="glitch">
        <AbsoluteFill style={{ background: "linear-gradient(to bottom, #0D1116 0%, #11161C 68%, #090B0E 68%, #07090B 100%)", opacity: 0.7 }} />
        <Pop at={tCourt + 2} origin="center bottom" style={{ left: 150, top: 380 }}>
          <BlobCharacter color="#6F7F92" size={380} seed={21} look={{ x: 0.9, y: -0.2 }} />
          <div style={{ textAlign: "center", marginTop: 10, ...mono(26, colors.dim), letterSpacing: "0.16em" }}>HIS LAWYERS</div>
        </Pop>
        <Pop at={c("pointed")} sound="pop" style={{ left: 560, top: 300 }}>
          <TrailerCard width={420} label="90,000,000+ VIEWS" />
        </Pop>
        <Pop at={c("pointed") + 4} from="left" style={{ left: 566, top: 250 }}>
          <span style={{ ...mono(30, colors.amber), fontWeight: 700 }}>"look how well it did"</span>
        </Pop>
        <Pop at={c("The judge")} origin="center bottom" style={{ left: 1420, top: 170 }}>
          <BlobCharacter color="#3C3550" size={330} seed={4} expression={frame >= c("not persuaded") ? "angry" : "calm"} look={{ x: -0.8, y: 0.3 }} />
          <div style={{ textAlign: "center", marginTop: 6, ...mono(26, colors.dim), letterSpacing: "0.16em" }}>THE JUDGE</div>
        </Pop>
        <Chip at={c("not persuaded")} text="NOT PERSUADED" color={colors.red} filled fontSize={44} origin="center center" style={{ left: 1310, top: 100 }} />
        <TitleSlam text="REAL COMPANIES." color={colors.text} fontSize={128} at={c("Real")} style={{ left: 960, right: 30, top: 570 }} />
        <TitleSlam text="REAL PEOPLE." color={colors.red} fontSize={128} at={c("real", 1)} style={{ left: 960, right: 30, top: 710 }} />
      </Scene>
    </>
  );
};
