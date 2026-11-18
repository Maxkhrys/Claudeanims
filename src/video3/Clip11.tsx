import React from "react";
import { interpolateColors, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, BrandTag, BuildingIcon, Chip, Flash, Pop, Scene, Sfx, Terminal, TitleSlam, mono } from "../components";
import { ChannelCard, Post } from "./Clip10";
import { useClip } from "./words";

const KeyIcon: React.FC<{ size?: number; color?: string }> = ({ size = 200, color = colors.amber }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${size * 0.12}px ${color})` }}>
    <circle cx={32} cy={50} r={22} fill="none" stroke={color} strokeWidth={10} />
    <path d="M 54 50 H 94 M 78 50 V 66 M 90 50 V 62" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
  </svg>
);

const Door: React.FC<{ w: number; h: number; color: string; label?: string; open?: number }> = ({ w, h, color, label, open = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: `${w * 0.12}px ${w * 0.12}px 0 0`, background: open > 0.5 ? "rgba(255,59,59,0.16)" : colors.panel, border: `${Math.max(2, w * 0.03)}px solid ${color}`, position: "relative", boxShadow: w > 100 ? `0 0 60px ${color}33, 0 30px 60px rgba(0,0,0,0.6)` : "none" }}>
    <div style={{ position: "absolute", right: w * 0.14, top: h * 0.5, width: w * 0.09, height: w * 0.09, borderRadius: w, background: color }} />
    {label ? (
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.18, textAlign: "center", fontFamily: fonts.display, fontSize: w * 0.26, color, letterSpacing: "0.06em" }}>{label}</div>
    ) : null}
  </div>
);

const Laptop: React.FC<{ glow?: string; size?: number }> = ({ glow = colors.red, size = 200 }) => (
  <div>
    <div style={{ width: size, height: size * 0.62, borderRadius: `${size * 0.05}px ${size * 0.05}px 2px 2px`, background: "linear-gradient(to bottom, #1A2128, #0C1014)", border: "2px solid #2A343D", boxShadow: `0 0 ${size * 0.4}px ${glow}66`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: size * 0.1, height: size * 0.1, borderRadius: size, background: glow, boxShadow: `0 0 16px ${glow}` }} />
    </div>
    <div style={{ width: size * 1.14, height: size * 0.05, marginLeft: -size * 0.07, borderRadius: "2px 2px 6px 6px", background: "#1C232A" }} />
  </div>
);

const KINDS = ["BANK", "HOSPITAL", "GOV", "SHOP", "AIRLINE", "SCHOOL", "TELECOM", "TECH"];

export const Clip11: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(11);

  const tBreak = c("Break") - 6;
  const tMarch = c("On March") - 6;
  const tTruth = c("truth") - 12;
  const tEnd = c("In the end") - 6;

  // key diagram
  const CX = 960;
  const CY = 500;
  const N = 16;
  const spread = sp(frame, fps, c("guards") - 8, springs.smooth, 22);
  const allOpen = c("every door");

  // zoom on the laptop
  const zoom = sp(frame, fps, c("single") - 20, springs.heavy, 150);

  return (
    <>
      {/* 1: Okta, the company that runs the login page */}
      <Scene from={0} to={tBreak}>
        <Terminal
          style={{ position: "absolute", left: 130, top: 90 }}
          fontSize={36}
          color={colors.dim}
          showCursor={frame < c("Okta.")}
          lines={[{ text: "a company most people have never heard of", prompt: "> ", at: 6, durationInFrames: 60 }]}
        />
        <Pop at={c("Okta.")} from="slam" sound="slam" style={{ left: 130, top: 170 }}>
          <BrandTag name="OKTA" size={220} />
        </Pop>
        <Chip at={c("phones")} text="NOT PHONES" color={colors.dim} fontSize={30} style={{ left: 130, top: 430 }} />
        <Chip at={c("games.")} text="NOT GAMES" color={colors.dim} fontSize={30} style={{ left: 380, top: 430 }} />
        {/* the login door, in front of thousands of smaller doors */}
        <Pop at={c("login") - 6} from="up" sound="door" style={{ left: 190, top: 520 }}>
          <Door w={230} h={320} color={colors.amber} label="LOGIN" />
        </Pop>
        <Chip at={c("login")} text="IT RUNS THE LOGIN PAGE" fontSize={32} style={{ left: 470, top: 560 }} />
        <div style={{ position: "absolute", left: 1040, top: 170, width: 800 }}>
          {new Array(12 * 6).fill(0).map((_, i) => {
            const s = sp(frame, fps, c("thousands") + random(`d-${i}`) * 34, springs.pop);
            if (s <= 0.01) return null;
            return (
              <div key={i} style={{ position: "absolute", left: (i % 12) * 66, top: Math.floor(i / 12) * 94, transform: `scale(${s})` }}>
                <Door w={48} h={82} color={colors.greenDim} />
              </div>
            );
          })}
        </div>
        <Sfx name="tick" at={c("thousands")} durationInFrames={34} loop volume={0.5} />
        <Chip at={c("other")} text="FOR THOUSANDS OF OTHER COMPANIES" color={colors.green} fontSize={30} style={{ left: 1040, top: 760 }} />
        {[
          { t: "BANKS", at: c("banks,") },
          { t: "HOSPITALS", at: c("hospitals,") },
          { t: "GOVERNMENTS", at: c("governments.") },
        ].map((k, i) => (
          <Pop key={k.t} at={k.at} sound="pop" style={{ left: 470 + i * 0, top: 640 + i * 62 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <BuildingIcon size={44} color={colors.text} />
              <span style={{ ...mono(34), fontWeight: 700 }}>{k.t}</span>
            </div>
          </Pop>
        ))}
      </Scene>

      {/* 2: one key, every door */}
      <Scene from={tBreak} to={tMarch}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {new Array(N).fill(0).map((_, i) => {
            const a = (i / N) * Math.PI * 2;
            const hit = sp(frame, fps, allOpen + i * 1.5, springs.snappy);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={CX + Math.cos(a) * 640 * spread}
                y2={CY + Math.sin(a) * 300 * spread}
                stroke={interpolateColors(Math.min(1, hit), [0, 1], [colors.greenDim, colors.red])}
                strokeWidth={4}
                strokeDasharray="6 10"
              />
            );
          })}
        </svg>
        {new Array(N).fill(0).map((_, i) => {
          const a = (i / N) * Math.PI * 2;
          const hit = sp(frame, fps, allOpen + i * 1.5, springs.pop);
          const col = hit > 0.5 ? colors.red : colors.green;
          return (
            <div key={i} style={{ position: "absolute", left: CX + Math.cos(a) * 640 * spread - 62, top: CY + Math.sin(a) * 300 * spread - 40, width: 124, opacity: Math.min(1, spread * 2), transform: `scale(${1 + 0.15 * (hit > 0 && hit < 1 ? 1 : 0)})` }}>
              <div style={{ padding: "12px 0", borderRadius: 10, background: colors.panel, border: `3px solid ${col}`, textAlign: "center", ...mono(22, col), fontWeight: 700, boxShadow: hit > 0.5 ? `0 0 30px ${colors.red}66` : "none" }}>
                {hit > 0.5 ? "OPEN" : KINDS[i % KINDS.length]}
              </div>
            </div>
          );
        })}
        <Pop at={tBreak + 2} sound="pop" style={{ left: CX - 120, top: CY - 120 }}>
          <div style={{ width: 240, height: 240, borderRadius: 120, background: colors.panel, border: `4px solid ${colors.amber}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 80px ${colors.amber}44` }}>
            <KeyIcon size={150} />
          </div>
        </Pop>
        <Sfx name="snap" at={allOpen} />
        <TitleSlam text="EVERY DOOR AT ONCE" color={colors.red} fontSize={104} at={c("once.") - 6} style={{ top: 22 }} />
      </Scene>

      {/* 3: March 22, screenshots, panic */}
      <Scene from={tMarch} to={tTruth}>
        <Terminal style={{ position: "absolute", left: 130, top: 90 }} fontSize={54} lines={[{ text: "MARCH 22, 2022", at: tMarch + 4, durationInFrames: 22 }]} />
        <ChannelCard at={c("posted") - 6} width={820} height={520} meter={1} style={{ left: 130, top: 210 }}>
          <Post at={c("screenshots")} text="inside okta. screenshots:" color={colors.green} shots={3} />
          <Post at={c("systems.")} text="thousands of companies use this, right?" />
        </ChannelCard>
        {/* alarm */}
        <div style={{ position: "absolute", inset: 0, background: colors.red, mixBlendMode: "screen", opacity: frame >= c("Security") ? 0.1 * (0.5 + 0.5 * Math.sin((frame - c("Security")) / 3)) : 0 }} />
        <Sfx name="error" at={c("Security")} />
        <TitleSlam text="PANIC" color={colors.red} fontSize={190} at={c("Security")} style={{ left: 1040, right: 60, top: 60 }} />
        {[0, 1, 2].map((i) => (
          <Pop key={i} at={c("teams") + i * 5} origin="center bottom" style={{ left: 1060 + i * 260, top: 330 }}>
            <BlobCharacter color={[colors.agent, colors.extras[2], colors.extras[0]][i]} size={300} seed={30 + i} expression="scared" shake={1} />
          </Pop>
        ))}
        {frame >= c("dropped")
          ? [0, 1, 2, 3].map((i) => {
              const t = (((frame - c("dropped")) / 20 + i / 4) % 1 + 1) % 1;
              return (
                <div key={i} style={{ position: "absolute", left: 1090 + i * 190, top: 270 - t * 40, ...mono(30, colors.amber), fontWeight: 700, opacity: Math.sin(t * Math.PI), transform: `rotate(${(i % 2 ? 1 : -1) * 8}deg)` }}>
                  RING!
                </div>
              );
            })
          : null}
        <Sfx name="notify" at={c("dropped")} />
        <Sfx name="notify" at={c("dropped") + 14} />
        <Chip at={c("Nobody")} text="HOW FAR DID IT GO?" color={colors.amber} fontSize={44} origin="center center" style={{ left: 1150, top: 720 }} />
      </Scene>

      {/* 4: the truth, one laptop */}
      <Scene from={tTruth} to={tEnd}>
        <Chip at={c("smaller")} text="SMALLER" color={colors.text} fontSize={50} style={{ left: 130, top: 110 }} />
        <Chip at={c("stranger.")} text="AND STRANGER" color={colors.amber} fontSize={50} style={{ left: 450, top: 110 }} />
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + zoom * 0.55})`, transformOrigin: "1330px 610px" }}>
          {/* contractor office: rows of desks, one laptop lit */}
          {new Array(8).fill(0).map((_, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const x = 780 + col * 280 + row * 60;
            const y = 420 + row * 230;
            const hot = i === 6;
            return (
              <div key={i} style={{ position: "absolute", left: x, top: y, opacity: hot ? 1 : 0.35 }}>
                <div style={{ position: "absolute", left: -40, top: 96, width: 220, height: 10, background: "#232C36", borderRadius: 4 }} />
                <div style={{ position: "absolute", left: 10, top: 12 }}>
                  <Laptop size={110} glow={hot ? colors.red : colors.greenDim} />
                </div>
              </div>
            );
          })}
          <Pop at={c("support") - 6} origin="center bottom" style={{ left: 1420, top: 520 }}>
            <BlobCharacter color={colors.extras[0]} size={170} seed={41} look={{ x: -0.9, y: 0.3 }} />
          </Pop>
        </div>
        <Pop at={c("single")} from="left" sound="click" style={{ left: 130, top: 300 }}>
          <div style={{ fontFamily: fonts.display, fontSize: 170, lineHeight: 0.95, color: colors.red, textShadow: "0 0 40px rgba(255,59,59,0.4)" }}>
            ONE
            <br />
            LAPTOP
          </div>
        </Pop>
        <Chip at={c("support")} text="A SUPPORT WORKER" color={colors.text} fontSize={32} style={{ left: 130, top: 650 }} />
        <Chip at={c("outside")} text="AT AN OUTSIDE CONTRACTOR" color={colors.text} fontSize={32} style={{ left: 130, top: 730 }} />
        {/* five days in January */}
        <Pop at={c("access") - 8} from="up" style={{ left: 1010, top: 104 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderRadius: 12, background: "rgba(7,9,11,0.9)", border: `2px solid ${colors.line}` }}>
            <span style={{ ...mono(26, colors.dim), marginRight: 10 }}>JAN</span>
            {[15, 16, 17, 18, 19, 20, 21, 22].map((d) => {
              const hot = d >= 16 && d <= 21;
              const on = hot && frame >= c("five") + (d - 16) * 4;
              return (
                <div key={d} style={{ width: 62, height: 62, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", ...mono(28, on ? colors.bg : colors.dim), fontWeight: 700, background: on ? colors.red : "transparent", border: `2px solid ${on ? colors.red : colors.line}` }}>
                  {d}
                </div>
              );
            })}
            <span style={{ ...mono(30, colors.red), fontWeight: 700, marginLeft: 14, opacity: frame >= c("days,") ? 1 : 0 }}>A 5-DAY WINDOW</span>
          </div>
        </Pop>
        <Sfx name="tick" at={c("five")} durationInFrames={20} loop volume={0.6} />
      </Scene>

      {/* 5: two customers, and the lesson */}
      <Scene from={tEnd} to={D} exit="glitch">
        <Pop at={tEnd + 4} from="up" style={{ left: 0, right: 0, top: 110, textAlign: "center" }}>
          <span style={{ ...mono(40, colors.dim), letterSpacing: "0.2em" }}>CUSTOMERS AFFECTED</span>
        </Pop>
        <TitleSlam text="2" color={colors.green} fontSize={420} at={c("two")} style={{ top: 150 }} />
        <Chip at={c("lesson")} text="BUT THE LESSON LANDED" color={colors.text} fontSize={36} style={{ left: 1260, top: 330 }} />
        <Pop at={c("teenagers")} sound="pop" style={{ left: 250, top: 230 }}>
          <KeyIcon size={230} />
        </Pop>
        <Chip at={c("close")} text="THAT CLOSE TO THE MASTER KEY" fontSize={30} style={{ left: 130, top: 480 }} />
        <TitleSlam text="NOTHING WAS SAFE" color={colors.red} fontSize={190} at={c("nothing")} style={{ top: 630 }} />
        <Flash at={c("nothing")} peak={0.4} />
      </Scene>
    </>
  );
};
