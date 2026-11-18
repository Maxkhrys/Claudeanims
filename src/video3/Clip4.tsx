import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, Chip, Flash, Pop, Scene, Sfx, TitleSlam, mono } from "../components";
import { useClip } from "./words";

type P = { x: number; y: number };
const YOU: P = { x: 330, y: 300 };
const ATTACKER: P = { x: 330, y: 700 };
const NUMBER: P = { x: 880, y: 500 };
const SERVICES: { id: string; label: string; icon: string; p: P }[] = [
  { id: "bank", label: "BANK", icon: "$", p: { x: 1520, y: 240 } },
  { id: "email", label: "EMAIL", icon: "@", p: { x: 1590, y: 500 } },
  { id: "crypto", label: "CRYPTO", icon: "B", p: { x: 1520, y: 760 } },
];

const lerp = (a: P, b: P, t: number): P => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

const Node: React.FC<{
  p: P;
  at: number;
  label: string;
  sub?: string;
  icon?: string;
  color?: string;
  w?: number;
  big?: boolean;
}> = ({ p, at, label, sub, icon, color = colors.text, w = 270, big = false }) => (
  <Pop at={at} sound="pop" style={{ left: p.x - w / 2, top: p.y - (big ? 80 : 58), width: w }}>
    <div
      style={{
        height: big ? 160 : 116,
        borderRadius: 14,
        background: colors.panel,
        border: `3px solid ${color}`,
        boxShadow: `0 0 50px ${color}33, 0 20px 50px rgba(0,0,0,0.6)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
      }}
    >
      {icon ? (
        <div style={{ width: 56, height: 56, borderRadius: 28, background: color, color: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 34 }}>
          {icon}
        </div>
      ) : null}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: fonts.display, fontSize: big ? 62 : 54, lineHeight: 1, color, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{label}</div>
        {sub ? <div style={{ ...mono(big ? 28 : 22, colors.dim), marginTop: 6, whiteSpace: "nowrap" }}>{sub}</div> : null}
      </div>
    </div>
  </Pop>
);

/**
 * The SIM-swap diagram. `swapAt` (optional) is the frame the owner's line snaps
 * away; `takeAt` the frame it reconnects to the attacker; `codesToAttackerAt`
 * when codes start flowing to the attacker.
 */
const Diagram: React.FC<{
  start: number;
  serviceAt: number[];
  codesAt: number;
  attackerAt?: number;
  swapAt?: number;
  takeAt?: number;
  stolenAt?: number;
  openAt?: number;
}> = ({ start, serviceAt, codesAt, attackerAt, swapAt, takeAt, stolenAt, openAt }) => {
  const frame = useCurrentFrame();
  const ownerLine = sp(frame, 30, start + 8, springs.smooth, 14);
  const away = swapAt === undefined ? 0 : sp(frame, 30, swapAt, springs.snappy);
  const take = takeAt === undefined ? 0 : sp(frame, 30, takeAt, springs.pop);
  const stolen = stolenAt !== undefined && frame >= stolenAt;
  const open = openAt === undefined ? 0 : sp(frame, 30, openAt, springs.snappy);
  const ownerColor = interpolateColors(Math.min(1, away), [0, 1], [colors.green, colors.red]);
  // the owner's line retracts back towards the phone number
  const ownerEnd = lerp(NUMBER, YOU, Math.max(0, ownerLine * (1 - away)));
  const takeEnd = lerp(NUMBER, ATTACKER, Math.min(1.06, take));
  const target = stolen ? ATTACKER : YOU;
  const dotColor = stolen ? colors.red : colors.green;
  const codesOn = frame >= codesAt && (swapAt === undefined || frame < swapAt || stolen);

  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {SERVICES.map((s, i) => {
          if (frame < serviceAt[i]) return null;
          const p = sp(frame, 30, serviceAt[i] + 4, springs.smooth, 12);
          const e = lerp(s.p, NUMBER, p);
          const col = interpolateColors(open, [0, 1], [colors.greenDim, colors.red]);
          return <line key={s.id} x1={s.p.x} y1={s.p.y} x2={e.x} y2={e.y} stroke={col} strokeWidth={5} strokeDasharray="12 10" strokeLinecap="round" />;
        })}
        {ownerLine * (1 - away) > 0.02 ? (
          <line x1={NUMBER.x} y1={NUMBER.y} x2={ownerEnd.x} y2={ownerEnd.y} stroke={ownerColor} strokeWidth={8} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 10px ${ownerColor})` }} />
        ) : null}
        {take > 0.02 ? (
          <line x1={NUMBER.x} y1={NUMBER.y} x2={takeEnd.x} y2={takeEnd.y} stroke={colors.red} strokeWidth={8} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${colors.red})` }} />
        ) : null}
        {/* login codes travelling: service -> phone number -> whoever holds it */}
        {codesOn
          ? SERVICES.map((s, i) => {
              if (frame < serviceAt[i] + 14) return null;
              const t = ((frame - codesAt + i * 17) % 52) / 52;
              const pos = t < 0.5 ? lerp(s.p, NUMBER, t * 2) : lerp(NUMBER, target, (t - 0.5) * 2);
              return (
                <g key={s.id} transform={`translate(${pos.x} ${pos.y})`} opacity={Math.sin(t * Math.PI) ** 0.5}>
                  <rect x={-38} y={-17} width={76} height={34} rx={8} fill={colors.bg} stroke={dotColor} strokeWidth={3} />
                  <text textAnchor="middle" y={8} fontFamily="JetBrains Mono" fontWeight={700} fontSize={20} fill={dotColor}>
                    {["481", "902", "775"][i]}
                  </text>
                </g>
              );
            })
          : null}
      </svg>
      <Node p={YOU} at={start} label="YOU" sub={away > 0.5 ? "locked out" : "the real owner"} color={away > 0.5 ? colors.dim : colors.green} />
      <Node p={NUMBER} at={start + 4} label="YOUR NUMBER" sub="+44 7•• ••• •21" color={away > 0.5 ? colors.red : colors.amber} w={380} big />
      {SERVICES.map((s, i) => (
        <Node key={s.id} p={s.p} at={serviceAt[i]} label={open > 0.5 ? "OPEN" : s.label} sub={open > 0.5 ? s.label.toLowerCase() : undefined} icon={s.icon} color={open > 0.5 ? colors.red : colors.text} />
      ))}
      {attackerAt !== undefined ? <Node p={ATTACKER} at={attackerAt} label="ATTACKER" sub={take > 0.9 ? "holds your number" : "a new SIM card"} color={colors.red} /> : null}
      {swapAt !== undefined ? <Sfx name="snap" at={swapAt} /> : null}
      {takeAt !== undefined ? <Sfx name="snap" at={takeAt} /> : null}
    </>
  );
};

const SpeechBubble: React.FC<{ at: number; text: string; left: number; top: number; tail?: "left" | "right" }> = ({ at, text, left, top, tail = "left" }) => (
  <Pop at={at} sound="pop" origin={tail === "left" ? "left bottom" : "right bottom"} style={{ left, top }}>
    <div style={{ padding: "18px 28px", borderRadius: tail === "left" ? "22px 22px 22px 4px" : "22px 22px 4px 22px", background: colors.text, color: colors.bg, ...mono(36, colors.bg), fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
      {text}
    </div>
  </Pop>
);

export const Clip4: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(4);

  const tDiagram = c("Think");
  const tCall = c("So");
  const tSwap = c("and they move");
  const tSlam = c("No secret");

  const codeIn = sp(frame, fps, c("code"), springs.pop);
  const ring = Math.sin(frame / 2.2) * 5;

  return (
    <>
      {/* A: the phone and the code */}
      <Scene from={0} to={tDiagram}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", ...mono(36, colors.dim) }}>&gt; the trick that made his name</div>
        {/* phone */}
        <Pop at={6} style={{ left: 300, top: 190 }}>
          <div style={{ width: 300, height: 600, borderRadius: 44, background: "#0B0F13", border: "9px solid #2A343D", boxShadow: "0 30px 70px rgba(0,0,0,0.7), 0 0 70px rgba(57,255,136,0.12)", position: "relative" }}>
            <svg width={120} height={140} viewBox="0 0 60 70" style={{ position: "absolute", left: 81, top: 90 }}>
              <path d="M 16 30 V 20 a 14 14 0 0 1 28 0 V 30" fill="none" stroke={colors.green} strokeWidth={6} strokeLinecap="round" />
              <rect x={8} y={30} width={44} height={34} rx={7} fill={colors.green} />
              <circle cx={30} cy={45} r={5} fill={colors.bg} />
              <rect x={28} y={46} width={4} height={10} fill={colors.bg} />
            </svg>
            <div
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                top: 290,
                padding: "16px 18px",
                borderRadius: 16,
                background: colors.panelLight,
                border: `2px solid ${colors.green}`,
                transform: `scale(${codeIn})`,
                opacity: frame >= c("code") ? 1 : 0,
              }}
            >
              <div style={{ ...mono(20, colors.dim) }}>MESSAGE</div>
              <div style={{ ...mono(27), marginTop: 6, lineHeight: 1.35 }}>
                Your code is
                <br />
                <b style={{ color: colors.green, fontSize: 40 }}>481 902</b>
              </div>
            </div>
          </div>
        </Pop>
        <Sfx name="notify" at={c("code")} />
        <TitleSlam text="SIM SWAPPING" color={colors.amber} fontSize={186} at={c("SIM")} style={{ left: 700, right: 40, top: 350 }} />
        <Chip at={c("doesn't")} text="NO BRILLIANT CODE NEEDED" color={colors.text} fontSize={34} style={{ left: 760, top: 250 }} />
      </Scene>

      {/* B: why your phone number matters */}
      <Scene from={tDiagram} to={tCall}>
        <Diagram start={tDiagram} serviceAt={[c("bank"), c("email"), c("crypto")]} codesAt={c("bank") + 10} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", ...mono(34, colors.dim) }}>&gt; every account sends its login code to one place</div>
        <Chip at={c("master")} text="THE MASTER KEY" fontSize={46} origin="center center" style={{ left: 695, top: 640 }} />
        <Flash at={c("master")} color={colors.amber} peak={0.25} durationInFrames={10} />
      </Scene>

      {/* C: going after the phone company */}
      <Scene from={tCall} to={tSwap}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", ...mono(34, colors.dim) }}>&gt; so the attacker goes after the phone company</div>
        <Pop at={tCall + 4} origin="center bottom" style={{ left: 250, top: 330 }}>
          <div style={{ transform: `rotate(${frame >= c("They trick") ? ring * 0.25 : 0}deg)` }}>
            <BlobCharacter color="#2B333C" size={400} seed={21} eyeColor={colors.red} look={{ x: 0.9, y: 0 }} />
          </div>
          <div style={{ textAlign: "center", marginTop: 10, ...mono(28, colors.red), fontWeight: 700, letterSpacing: "0.14em" }}>THE ATTACKER</div>
        </Pop>
        <Pop at={c("phone", 2) - 4} origin="center bottom" style={{ left: 1320, top: 330 }}>
          <BlobCharacter color={colors.agent} size={400} seed={22} look={{ x: -0.9, y: 0 }} />
          <div style={{ textAlign: "center", marginTop: 10, ...mono(28, colors.agent), fontWeight: 700, letterSpacing: "0.14em" }}>PHONE COMPANY STAFF</div>
        </Pop>
        {/* the call line between them */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {frame >= c("They trick") ? (
            <path
              d={`M 600 520 Q 780 ${440 + ring * 6} 960 520 T 1320 520`}
              fill="none"
              stroke={colors.amber}
              strokeWidth={5}
              strokeDasharray="6 14"
              strokeLinecap="round"
              strokeDashoffset={-frame * 2}
            />
          ) : null}
        </svg>
        <SpeechBubble at={c("They trick")} text={'"Hi, I lost my phone..."'} left={560} top={300} />
        <Sfx name="notify" at={c("They trick") - 6} volume={0.6} />
        <Chip at={c("employee")} text="1. TRICK AN EMPLOYEE" color={colors.text} fontSize={34} style={{ left: 690, top: 620 }} />
        <Chip at={c("bribe")} text="2. OR BRIBE ONE" fontSize={34} style={{ left: 690, top: 700 }} />
        <Chip at={c("break")} text="3. OR BREAK INTO THEIR TOOLS" color={colors.red} fontSize={34} style={{ left: 690, top: 780 }} />
      </Scene>

      {/* D: the swap */}
      <Scene from={tSwap} to={tSlam}>
        <Diagram
          start={tSwap - 60}
          serviceAt={[tSwap - 60, tSwap - 60, tSwap - 60]}
          codesAt={c("Now")}
          attackerAt={tSwap + 4}
          swapAt={c("move")}
          takeAt={c("SIM", 1)}
          stolenAt={c("Now")}
          openAt={c("walk")}
        />
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", ...mono(34, colors.dim) }}>&gt; your number, moved to a SIM card they control</div>
        <Chip at={c("control")} text="SIM SWAPPED" color={colors.red} filled fontSize={44} origin="center center" style={{ left: 720, top: 640 }} />
        <Flash at={c("SIM", 1)} peak={0.35} durationInFrames={10} />
        <Chip at={c("reset")} text="PASSWORDS RESET" color={colors.red} fontSize={34} origin="center center" style={{ left: 1120, top: 130 }} />
        <Sfx name="error" at={c("walk")} />
      </Scene>

      {/* E: the punchline */}
      <Scene from={tSlam} to={D} exit="glitch">
        <TitleSlam text="NO HACKING." fontSize={300} at={tSlam} style={{ top: 170 }} />
        <TitleSlam text="JUST TALKING." color={colors.amber} fontSize={300} at={c("just")} style={{ top: 470 }} />
        <Pop at={c("voice")} from="up" style={{ left: 0, right: 0, top: 790, textAlign: "center" }}>
          <span style={{ ...mono(38, colors.dim) }}>a convincing voice on the phone</span>
        </Pop>
      </Scene>
    </>
  );
};
