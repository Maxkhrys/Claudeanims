import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, Card, Chip, Dpr, PhoneBuzz, Pop, Scene, Sfx, Terminal, TitleSlam, mono } from "../components";
import { useClip } from "./words";

const StepHead: React.FC<{ at: number; n: string; title: string; color: string }> = ({ at, n, title, color }) => (
  <>
    <Pop at={at - 8} from="left" style={{ left: 130, top: 80 }}>
      <span style={{ ...mono(46, color), fontWeight: 700, letterSpacing: "0.1em" }}>STEP {n}</span>
    </Pop>
    <TitleSlam text={title} color={color} fontSize={170} at={at} style={{ left: 124, right: "auto", top: 140, alignItems: "flex-start" }} />
  </>
);

const LOGINS = [
  ["j.smith@██████.com", "$4"],
  ["a.kumar@██████.com", "$3"],
  ["support-04@██████.net", "$7"],
  ["m.jones@██████.com", "$2"],
];

export const Clip8: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(8);

  const t1 = c("Step");
  const t2 = c("Or skip");
  const t3 = c("But a password");
  const tEnd = c("That's it");

  const handover = sp(frame, fps, c("willing"), springs.smooth, 26);
  const door = sp(frame, fps, c("yes") + 6, springs.smooth, 20);
  const approved = frame >= c("yes");

  return (
    <>
      {/* 0: the question */}
      <Scene from={0} to={t1}>
        <TitleSlam text="HOW DO TEENAGERS HACK" fontSize={170} at={c("teenagers") - 6} style={{ top: 90 }} />
        <TitleSlam text="A TRILLION DOLLAR COMPANY?" color={colors.amber} fontSize={170} at={c("companies") - 8} style={{ top: 270 }} />
        {[0, 1, 2].map((i) => (
          <Pop key={i} at={c("group") + i * 4} origin="center bottom" style={{ left: 250 + i * 170, top: 560 }}>
            <BlobCharacter color={["#DDE4EC", colors.extras[1], colors.extras[2]][i]} size={230} seed={30 + i} look={{ x: 0.9, y: -0.4 }} />
          </Pop>
        ))}
        <Pop at={c("best-defended") - 6} from="up" style={{ left: 1180, top: 480 }}>
          <svg width={520} height={380} viewBox="0 0 260 190">
            <path d="M 20 190 V 60 H 60 V 30 H 200 V 60 H 240 V 190 Z" fill="#141B22" stroke="#2A343D" strokeWidth={4} />
            {[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3].map((k) => <rect key={`${r}-${k}`} x={78 + k * 30} y={48 + r * 28} width={16} height={14} fill={colors.greenDim} opacity={0.5} />))}
            <path d="M 130 96 l 34 12 v 26 q 0 26 -34 40 q -34 -14 -34 -40 v -26 Z" fill={colors.green} stroke={colors.bg} strokeWidth={4} />
            <path d="M 116 132 l 10 10 l 20 -22" fill="none" stroke={colors.bg} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Pop>
      </Scene>

      {/* 1: buy a password */}
      <Scene from={t1} to={t2}>
        <StepHead at={c("Buy")} n="1" title="BUY A PASSWORD" color={colors.green} />
        <Pop at={c("Stolen") - 6} from="up" style={{ left: 130, top: 380 }}>
          <Card style={{ width: 1100, padding: "22px 30px" }}>
            <div style={{ ...mono(26, colors.dim), letterSpacing: "0.16em", marginBottom: 8 }}>STOLEN EMPLOYEE LOGINS · FOR SALE</div>
            {LOGINS.map(([who, price], i) => {
              const at = c("Stolen") + i * 9;
              const s = sp(frame, fps, at, springs.snappy);
              return (
                <div key={who} style={{ display: "flex", alignItems: "center", padding: "13px 0", borderTop: `2px solid ${colors.line}`, opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * 40}px)` }}>
                  <span style={{ ...mono(34), flex: 1 }}>{who}</span>
                  <span style={{ ...mono(30, colors.dim), marginRight: 40 }}>password: ••••••••</span>
                  <span style={{ ...mono(38, colors.amber), fontWeight: 700, width: 70, textAlign: "right" }}>{price}</span>
                </div>
              );
            })}
          </Card>
        </Pop>
        <Chip at={c("few")} text="JUST A FEW DOLLARS" fontSize={38} sound="coin" origin="center center" style={{ left: 1290, top: 520 }} />
      </Scene>

      {/* 2: or buy an employee */}
      <Scene from={t2} to={t3}>
        <StepHead at={c("buy", 1)} n="2" title="OR BUY AN EMPLOYEE" color={colors.amber} />
        <Pop at={c("Lapsus") - 6} from="up" style={{ left: 130, top: 380 }}>
          <Card accent={colors.amber} style={{ width: 900, padding: "24px 32px" }}>
            <div style={{ ...mono(24, colors.dim), letterSpacing: "0.16em" }}>POSTED IN THE PUBLIC CHANNEL · paraphrased</div>
            <Terminal
              style={{ marginTop: 14 }}
              fontSize={44}
              color={colors.text}
              lines={[{ text: "WE ARE RECRUITING INSIDERS", at: c("advertised"), durationInFrames: 28 }]}
              showCursor={false}
            />
            <div style={{ ...mono(34), marginTop: 16, lineHeight: 1.7 }}>
              <div style={{ opacity: frame >= c("phone") ? 1 : 0 }}>
                <span style={{ color: colors.amber }}>▸ </span>staff at phone companies
              </div>
              <div style={{ opacity: frame >= c("tech") ? 1 : 0 }}>
                <span style={{ color: colors.amber }}>▸ </span>staff at tech firms
              </div>
              <div style={{ opacity: frame >= c("sell") ? 1 : 0, color: colors.amber, fontWeight: 700 }}>we pay for your access.</div>
            </div>
          </Card>
        </Pop>
        {/* the handover */}
        <Pop at={c("staff")} origin="center bottom" style={{ left: 1130, top: 450 }}>
          <BlobCharacter color={colors.extras[0]} size={330} seed={41} badge={colors.text} look={{ x: 0.9, y: 0 }} />
        </Pop>
        <Pop at={c("insiders")} origin="center bottom" style={{ left: 1520, top: 450 }}>
          <Dpr size={330} look={{ x: -0.9, y: 0 }} />
        </Pop>
        {frame >= c("willing") ? (
          <div style={{ position: "absolute", left: interpolate(handover, [0, 1], [1330, 1500]), top: 620 - Math.sin(Math.min(1, handover) * Math.PI) * 50 }}>
            <Sfx name="whoosh" at={c("willing")} />
            <div style={{ width: 110, height: 70, borderRadius: 10, background: colors.panelLight, border: `3px solid ${colors.amber}`, boxShadow: `0 0 30px ${colors.amber}66`, ...mono(20, colors.amber), fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
              ACCESS
            </div>
          </div>
        ) : null}
        <Chip at={c("access")} text="ACCESS: SOLD" color={colors.red} filled fontSize={34} origin="center center" style={{ left: 1320, top: 360 }} />
      </Scene>

      {/* 3: the prompt */}
      <Scene from={t3} to={tEnd}>
        <StepHead at={c("enough")} n="3" title="THE PROMPT" color={colors.red} />
        <Pop at={t3} from="up" style={{ left: 130, top: 380 }}>
          <Card style={{ width: 560, padding: "22px 30px" }}>
            <div style={{ ...mono(24, colors.dim), letterSpacing: "0.16em" }}>COMPANY SIGN-IN</div>
            <div style={{ ...mono(36), marginTop: 14 }}>
              password <span style={{ color: colors.green, fontWeight: 700 }}>✓</span>
            </div>
            <div style={{ ...mono(36), marginTop: 8, opacity: frame >= c("approve") ? 1 : 0.2 }}>
              phone approval{" "}
              <span style={{ color: approved ? colors.green : colors.amber, fontWeight: 700 }}>{approved ? "✓" : "..."}</span>
            </div>
          </Card>
        </Pop>
        <PhoneBuzz at={c("sent")} prompts={9} interval={34} approveAt={c("yes")} time="01:07" size={330} style={{ left: 790, top: 210 }} />
        {["AGAIN", "AND AGAIN", "AND AGAIN"].map((t, i) => (
          <Chip key={i} at={c("again", i)} text={t} color={colors.red} fontSize={30 + i * 6} sound={false} style={{ left: 150, top: 610 + i * 76 }} />
        ))}
        {/* someone, half asleep */}
        <Pop at={c("middle")} from="right" style={{ left: 1230, top: 300, width: 560, height: 520 }}>
          <div style={{ position: "absolute", right: 30, top: 0, width: 90, height: 90, borderRadius: 45, background: colors.text, opacity: 0.85, boxShadow: `0 0 50px ${colors.text}66` }} />
          <div style={{ position: "absolute", right: 5, top: -12, width: 80, height: 80, borderRadius: 40, background: colors.bg }} />
          <div style={{ position: "absolute", left: 0, top: 10, ...mono(30, colors.dim), letterSpacing: "0.16em" }}>1:07 AM</div>
          <div style={{ position: "absolute", left: 120, top: 110 }}>
            <BlobCharacter color={colors.extras[2]} size={330} seed={52} look={{ x: -0.8, y: 0.6 }} />
          </div>
          <div style={{ position: "absolute", left: 20, top: 330, width: 520, height: 190, borderRadius: 18, background: "linear-gradient(to bottom, #3A4757, #252E39)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }} />
          <div style={{ position: "absolute", left: 330, top: 60 + Math.sin(frame / 10) * 6, ...mono(40, colors.dim), fontWeight: 700, opacity: approved ? 0 : 0.8 }}>z z z</div>
        </Pop>
        <Chip at={c("half")} text="HALF ASLEEP" color={colors.text} fontSize={30} style={{ left: 1250, top: 250 }} />
        {/* the door opens */}
        {frame >= c("yes") ? (
          <div style={{ position: "absolute", left: 130, top: 600, width: 600, height: 250 }}>
            <Sfx name="door" at={c("yes") + 6} volume={0.7} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(7,9,11,0.96)", border: `3px solid ${colors.green}`, borderRadius: 12, boxShadow: `0 0 60px ${colors.green}55`, display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
              <svg width={130} height={190} viewBox="0 0 65 95">
                <rect x={4} y={4} width={57} height={87} fill="#0A1210" stroke={colors.green} strokeWidth={3} />
                <path d={`M 4 4 L ${4 + 57 * (1 - door * 0.75)} ${4 + door * 8} V ${91 - door * 8} L 4 91 Z`} fill="#1B242C" stroke={colors.green} strokeWidth={3} />
              </svg>
              <span style={{ fontFamily: fonts.display, fontSize: 92, color: colors.green, whiteSpace: "nowrap" }}>THEY'RE IN</span>
            </div>
          </div>
        ) : null}
      </Scene>

      {/* 4: that's it */}
      <Scene from={tEnd} to={D}>
        <TitleSlam text="THAT'S IT." fontSize={330} at={tEnd} style={{ top: 190 }} />
        <TitleSlam text="THAT WAS THE WHOLE TRICK." color={colors.amber} fontSize={150} at={c("whole")} style={{ top: 560 }} />
      </Scene>
    </>
  );
};
