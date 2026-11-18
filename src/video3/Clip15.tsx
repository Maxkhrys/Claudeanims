import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  Car,
  Card,
  Chip,
  HOTEL_TV,
  HotelRoom,
  Pop,
  Scene,
  SeizedStamp,
  Sfx,
  TitleSlam,
  White,
  mono,
} from "../components";
import { useClip } from "./words";

const Redacted: React.FC<{ width: number; height?: number }> = ({ width, height = 40 }) => (
  <div style={{ width, height, borderRadius: 4, background: "#000", border: "1px solid #20262C" }} />
);

/** Bail form row that stamps in. */
const Condition: React.FC<{ at: number; text: string; big?: boolean }> = ({ at, text, big }) => (
  <Pop at={at} from="slam" sound="stamp" origin="left center" style={{ position: "relative", marginTop: 22 }}>
    <div
      style={{
        display: "inline-block",
        padding: big ? "10px 30px" : "8px 22px",
        border: `${big ? 8 : 5}px solid ${colors.red}`,
        borderRadius: 10,
        fontFamily: fonts.display,
        fontSize: big ? 150 : 70,
        lineHeight: 1.05,
        color: colors.red,
        background: "rgba(7,9,11,0.8)",
        textShadow: "0 0 30px rgba(255,59,59,0.45)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  </Pop>
);

/** Night exterior of a generic budget hotel. No real brand. */
const HotelExterior: React.FC<{ signOn: number }> = ({ signOn }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, #070B12 0%, #0D141E 70%, #090C10 70%, #06080A 100%)" }} />
      <div style={{ position: "absolute", left: 760, top: 150, width: 980, height: 610, background: "#121A23", border: "3px solid #1F2A35" }}>
        {new Array(4).fill(0).map((_, r) =>
          new Array(7).fill(0).map((__, col) => {
            const lit = random(`hw-${r}-${col}`) > 0.62;
            return (
              <div
                key={`${r}-${col}`}
                style={{
                  position: "absolute",
                  left: 50 + col * 130,
                  top: 120 + r * 112,
                  width: 80,
                  height: 70,
                  background: lit ? "rgba(255,181,71,0.5)" : "#0B1016",
                  border: "3px solid #1F2A35",
                  opacity: lit ? 0.8 + 0.2 * Math.sin(frame / 20 + r + col) : 1,
                }}
              />
            );
          }),
        )}
        <div style={{ position: "absolute", left: 420, bottom: 0, width: 140, height: 120, background: "#0B1016", border: "3px solid #2A3642" }} />
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 24,
            width: 380,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 84,
            lineHeight: 1,
            letterSpacing: "0.2em",
            color: colors.amber,
            opacity: 0.2 + 0.8 * signOn * (0.9 + 0.1 * random(`sign-${Math.floor(frame / 4)}`)),
            textShadow: `0 0 ${40 * signOn}px ${colors.amber}`,
          }}
        >
          HOTEL
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 756, height: 5, background: "#1B242E" }} />
    </AbsoluteFill>
  );
};

export const Clip15: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(15);

  const tProblem = c("But there");
  const tMoved = c("So police");
  const tRoom = c("No laptop");
  const tMonths = c("For months");
  const tInside = c("But inside");

  const drive = sp(frame, fps, c("moved"), springs.smooth, 46);
  const lights = Math.floor(frame / 5) % 2;
  const push = sp(frame, fps, tInside, springs.heavy, D - tInside);
  const tvCx = HOTEL_TV.left + HOTEL_TV.width / 2;
  const tvCy = HOTEL_TV.top + HOTEL_TV.height / 2;
  const phone = sp(frame, fps, c("talent"), springs.smooth, 24);
  const tvOn = sp(frame, fps, c("bored") - 6, springs.snappy) * 0.55;
  const MONTHS = ["APRIL", "MAY", "JUNE", "JULY", "AUGUST"];
  const THREATS = [
    { text: "we're not finished with you", left: 1180, top: 250 },
    { text: "we know who you are", left: 1260, top: 400 },
    { text: "this isn't over", left: 1150, top: 550 },
  ];

  return (
    <>
      {/* 1: bail, with rules */}
      <Scene from={0} to={tProblem}>
        <div style={{ position: "absolute", left: 130, top: 90, ...mono(34, colors.dim) }}>&gt; released on bail</div>
        <Pop at={4} from="up" style={{ left: 130, top: 160 }}>
          <Card style={{ width: 1120, padding: "30px 44px 44px" }}>
            <div style={{ fontFamily: fonts.display, fontSize: 110, lineHeight: 1, color: colors.text }}>BAIL CONDITIONS</div>
            <div style={{ height: 4, background: colors.line, margin: "14px 0 6px" }} />
            <Condition at={c("strict")} text="STRICT RULES" />
            <br />
            <Condition at={c("allowed") - 6} text="NO SMARTPHONE" big />
          </Card>
        </Pop>
        <Pop at={8} origin="center bottom" style={{ left: 1430, top: 420 }}>
          <White size={330} look={{ x: -0.8, y: 0 }} />
        </Pop>
        <Pop at={c("smartphone")} style={{ left: 1420, top: 190 }}>
          <div style={{ position: "relative", width: 110, height: 190, borderRadius: 18, background: "#0B0F13", border: "5px solid #3A444E" }}>
            <div style={{ position: "absolute", left: -40, top: 80, width: 190, height: 12, background: colors.red, transform: "rotate(-52deg)", boxShadow: `0 0 16px ${colors.red}` }} />
          </div>
        </Pop>
      </Scene>

      {/* 2: the second problem. Every detail stays covered. */}
      <Scene from={tProblem} to={tMoved}>
        <TitleSlam text="A SECOND PROBLEM" color={colors.amber} fontSize={150} at={c("second")} style={{ top: 50 }} />
        <Pop at={c("home") - 6} from="up" style={{ left: 150, top: 250 }}>
          <Card accent={colors.red} style={{ width: 940, padding: "26px 40px 40px", display: "flex", gap: 40, alignItems: "center" }}>
            <div style={{ width: 190, flexShrink: 0, textAlign: "center" }}>
              <White size={200} idle={0.4} />
              <div style={{ ...mono(20, colors.dim), marginTop: 6 }}>"WHITE"</div>
            </div>
            <div style={{ flex: 1 }}>
              {[
                { label: "NAME", w: [180, 220] },
                { label: "ADDRESS", w: [90, 190, 60] },
                { label: "FAMILY", w: [210, 170] },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 20 }}>
                  <div style={{ ...mono(32, colors.red), fontWeight: 700, width: 220, letterSpacing: "0.1em" }}>{r.label}</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    {r.w.map((w, i) => (
                      <Redacted key={i} width={w} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Pop>
        <SeizedStamp at={c("posted")} text="POSTED ONLINE" fontSize={80} rotate={-7} style={{ left: 420, top: 600 }} />
        {THREATS.map((m, i) => (
          <Pop key={i} at={c("those") + i * 10} sound={i === 0 ? "notify" : undefined} style={{ left: m.left, top: m.top }}>
            <div style={{ padding: "14px 22px", borderRadius: "14px 14px 14px 2px", background: "#1A0E0E", border: `2px solid ${colors.red}`, ...mono(28, colors.red), fontWeight: 700, transform: `rotate(${i % 2 ? 2 : -2}deg)`, boxShadow: "0 12px 30px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
              {m.text}
            </div>
          </Pop>
        ))}
        <Chip at={c("rivals")} text="BY HIS RIVALS" color={colors.red} fontSize={30} style={{ left: 1180, top: 170 }} />
      </Scene>

      {/* 3: moved to a budget hotel */}
      <Scene from={tMoved} to={tRoom}>
        <HotelExterior signOn={sp(frame, fps, c("budget"), springs.snappy)} />
        <div style={{ position: "absolute", left: interpolate(drive, [0, 1], [-520, 250]), top: 590 }}>
          <Car type="sedan" size={480} color={colors.police} />
          <div style={{ position: "absolute", left: 200, top: 28, width: 70, height: 18, borderRadius: 6, background: lights ? colors.red : colors.agent, boxShadow: `0 0 50px ${lights ? colors.red : colors.agent}` }} />
          <div style={{ position: "absolute", left: 60, top: 150, ...mono(22, colors.text), fontWeight: 700, letterSpacing: "0.2em" }}>POLICE</div>
        </div>
        <Sfx name="whoosh" at={c("moved")} />
        <Chip at={c("out")} text="OUT OF HIS HOME" color={colors.text} fontSize={32} style={{ left: 110, top: 110 }} />
        <Pop at={c("hotel")} sound="click" style={{ left: 110, top: 220 }}>
          <div style={{ width: 300, height: 180, borderRadius: 16, background: "linear-gradient(135deg, #2A3542, #18212B)", border: `3px solid ${colors.amber}`, padding: 22, transform: "rotate(-6deg)", boxShadow: `0 0 50px ${colors.amber}33` }}>
            <div style={{ ...mono(24, colors.amber), fontWeight: 700, letterSpacing: "0.2em" }}>ROOM KEY</div>
            <div style={{ marginTop: 60, width: 250, height: 28, background: "#0B0F13" }} />
          </div>
        </Pop>
        <Chip at={c("protection") - 8} text="FOR HIS OWN PROTECTION" color={colors.agent} filled fontSize={38} style={{ left: 110, top: 450 }} />
      </Scene>

      {/* 4: the room, the quiet months, and boredom */}
      <Scene from={tRoom} to={D} exit="cut">
        <AbsoluteFill style={{ transform: `scale(${1 + push * 0.7})`, transformOrigin: `${tvCx}px ${tvCy}px` }}>
          <HotelRoom tvOn={tvOn} stick={frame >= c("nothing")} screen={<AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(57,255,136,0.5), rgba(7,9,11,1) 75%)" }} />}>
            <Pop at={tRoom + 4} origin="center bottom" style={{ left: 300, top: 470 }}>
              <White size={250} look={{ x: frame >= tInside ? 0.9 : 0.2, y: frame >= tInside ? -0.3 : 0.5 }} />
            </Pop>
            {/* a phone lighting up under the duvet */}
            <div style={{ position: "absolute", left: 430, top: 770, width: 90, height: 50, borderRadius: 10, background: colors.text, opacity: 0.85 * phone, boxShadow: `0 0 ${70 * phone}px ${colors.text}`, filter: "blur(3px)" }} />
          </HotelRoom>
        </AbsoluteFill>

        <Scene from={tRoom} to={tMonths}>
          <Chip at={c("laptop")} text="LAPTOP: CONFISCATED" color={colors.red} fontSize={32} style={{ left: 110, top: 60 }} />
          <Chip at={c("computer")} text="NO COMPUTER" color={colors.red} fontSize={32} style={{ left: 560, top: 60 }} />
          <Chip at={c("bed")} text="A BED" color={colors.text} fontSize={28} style={{ left: 250, top: 570 }} />
          <Chip at={c("kettle")} text="A KETTLE" color={colors.text} fontSize={28} style={{ left: 640, top: 440 }} />
          <Chip at={c("television")} text="A TELEVISION" color={colors.amber} fontSize={32} style={{ left: 1230, top: 100 }} />
        </Scene>

        <Scene from={tMonths} to={tInside}>
          <div style={{ position: "absolute", left: 110, top: 50, display: "flex", gap: 14 }}>
            {MONTHS.map((m, i) => (
              <Pop key={m} at={c("months") + i * 8} from="up" sound={i === 0 ? "whoosh" : undefined} style={{ position: "relative" }}>
                <div style={{ width: 150, borderRadius: 10, overflow: "hidden", border: `2px solid ${colors.line}`, background: colors.panel, textAlign: "center", transform: `rotate(${(i - 2) * 2}deg)` }}>
                  <div style={{ background: colors.greenDim, height: 14 }} />
                  <div style={{ ...mono(24, colors.text), fontWeight: 700, padding: "16px 0", letterSpacing: "0.06em" }}>{m}</div>
                </div>
              </Pop>
            ))}
          </div>
          <Pop at={c("quiet") - 6} from="left" style={{ left: 110, top: 190 }}>
            <Card style={{ width: 620, padding: "18px 26px" }}>
              <div style={{ ...mono(26, colors.dim) }}>
                the channel · <span style={{ color: colors.text }}>last post: months ago</span>
              </div>
              <div style={{ ...mono(34, colors.dim), marginTop: 8, opacity: 0.4 + 0.3 * Math.sin(frame / 8) }}>no new messages</div>
            </Card>
          </Pop>
          <Chip at={c("headlines")} text="THE HEADLINES MOVED ON" color={colors.text} fontSize={30} style={{ left: 110, top: 350 }} />
        </Scene>

        <Scene from={tInside} to={D} exit="cut">
          <Chip at={c("nothing")} text="NOTHING TO DO" color={colors.text} fontSize={34} style={{ left: 110, top: 70 }} />
          <Chip at={c("talent")} text="ONE PARTICULAR TALENT" color={colors.amber} fontSize={34} style={{ left: 110, top: 160 }} />
          <TitleSlam text="BORED." color={colors.red} fontSize={200} at={c("bored")} style={{ left: 60, right: 1080, top: 280 }} />
        </Scene>
      </Scene>
    </>
  );
};
