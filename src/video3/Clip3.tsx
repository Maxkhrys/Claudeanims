import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Card, Chip, DecodeText, MapPins, Pop, Scene, Terminal, TitleSlam, White, mono } from "../components";
import { useClip } from "./words";

/** White at his desk, lit by a monitor. `glow` 0..1 */
const Desk: React.FC<{ glow: number; left?: number }> = ({ glow, left = 560 }) => {
  const frame = useCurrentFrame();
  const g = glow * (0.9 + 0.1 * Math.sin(frame / 3));
  return (
    <div style={{ position: "absolute", left, top: 130, width: 800, height: 700, transform: "scale(1.18)", transformOrigin: "center top" }}>
      <div style={{ position: "absolute", left: -200, top: -60, width: 1200, height: 800, background: `radial-gradient(ellipse at 50% 60%, ${colors.green}, rgba(0,0,0,0) 60%)`, opacity: 0.2 * g }} />
      <div style={{ position: "absolute", left: 210, top: 120 }}>
        <White size={430} look={{ x: 0, y: 0.8 }} lightColor={colors.green} lightAmount={0.75 * g} />
      </div>
      {/* desk */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, height: 26, borderRadius: 6, background: "#1C242C" }} />
      <div style={{ position: "absolute", left: 30, right: 30, top: 546, height: 140, background: "linear-gradient(to bottom, #131A20, #0A0D10)" }} />
      {/* monitor, seen from behind */}
      <div style={{ position: "absolute", left: 220, top: 330, width: 360, height: 200, borderRadius: 12, background: "linear-gradient(to bottom, #1A2128, #0C1014)", border: "3px solid #2A343D", boxShadow: `0 -6px 50px ${colors.green}${g > 0.5 ? "66" : "22"}` }}>
        <div style={{ position: "absolute", left: 164, top: 84, width: 32, height: 32, borderRadius: 16, background: colors.green, opacity: 0.2 + 0.7 * g }} />
      </div>
      <div style={{ position: "absolute", left: 370, top: 528, width: 60, height: 10, background: "#2A343D" }} />
    </div>
  );
};

const ROOMS = [
  { left: 110, top: 110, w: 430 },
  { left: 1380, top: 90, w: 430 },
  { left: 90, top: 440, w: 400 },
  { left: 1420, top: 400, w: 400 },
  { left: 250, top: 690, w: 420 },
  { left: 1250, top: 680, w: 440 },
];

const BOARD = ["xploit_", "n1ghtowl", "sim.king", "zer0day", "WHITE"];

export const Clip3: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(3);

  const tDesk = c("Arion is");
  const tNames = c("Online", 1);
  const tRooms = c("He found");
  const tBoard = c("And in that");
  const tCourt = c("By 2021");

  const online = sp(frame, fps, c("Online"), springs.smooth, 20);
  const climb = sp(frame, fps, c("climbing") - 6, springs.heavy, 40);
  const rank = Math.round(4 * (1 - Math.min(1, climb)));
  const order = BOARD.filter((n) => n !== "WHITE");
  order.splice(rank, 0, "WHITE");

  return (
    <>
      {/* 1: near Oxford */}
      <Scene from={0} to={tDesk}>
        <MapPins
          width={1640}
          style={{ left: 140, top: 150 }}
          focus={{ lon: -2, lat: 53.5, zoom: 1 + 2.4 * sp(frame, fps, 6, springs.heavy, 70) }}
          pins={[{ lon: -1.26, lat: 51.75, at: c("Oxford") - 4, color: colors.amber, glow: true }]}
        />
        <Chip at={c("Oxford")} text="NEAR OXFORD, ENGLAND" fontSize={40} origin="center center" style={{ left: 1080, top: 520 }} />
        <Pop at={c("Arion") - 8} from="up" style={{ left: 0, right: 0, top: 70, height: 250, background: "rgba(7,9,11,0.8)" }}>
          <div />
        </Pop>
        <TitleSlam text="ARION KURTAJ" fontSize={230} at={c("Arion")} style={{ top: 80 }} />
      </Scene>

      {/* 2: real world vs online */}
      <Scene from={tDesk} to={tNames}>
        <Desk glow={0.25 + 0.75 * online} />
        <Chip at={c("special")} text="A SPECIAL SCHOOL" color={colors.text} fontSize={36} style={{ left: 110, top: 250 }} />
        <Chip at={c("hard")} text="THE REAL WORLD: HARD" color={colors.dim} fontSize={34} style={{ left: 110, top: 340 }} />
        <Chip at={c("somebody")} text="ONLINE: SOMEBODY ELSE" color={colors.green} filled fontSize={36} style={{ left: 1240, top: 250 }} />
      </Scene>

      {/* 3: his names */}
      <Scene from={tNames} to={tRooms}>
        <Pop at={tNames} origin="center bottom" style={{ left: 190, top: 360 }}>
          <White size={400} look={{ x: 0.8, y: -0.1 }} lightColor={colors.green} lightAmount={0.5} />
        </Pop>
        <Terminal
          style={{ position: "absolute", left: 720, top: 150 }}
          fontSize={38}
          color={colors.dim}
          showCursor={frame < c("White")}
          lines={[{ text: "online, he was known as", prompt: "> ", at: tNames + 4, durationInFrames: 28 }]}
        />
        <TitleSlam text="WHITE" fontSize={330} at={c("White")} style={{ left: 710, right: "auto", top: 210, alignItems: "flex-start" }} />
        <Pop at={c("Breachbase") - 4} from="left" style={{ left: 720, top: 520 }}>
          <span style={{ ...mono(34, colors.dim) }}>also: </span>
          <span style={{ fontFamily: fonts.display, fontSize: 150, lineHeight: 1, color: colors.green, textShadow: `0 0 40px ${colors.green}55` }}>
            <DecodeText text="BREACHBASE" at={c("Breachbase")} durationInFrames={14} />
          </span>
        </Pop>
        <Chip at={c("good")} text="VERY, VERY GOOD WITH COMPUTERS" fontSize={34} style={{ left: 720, top: 740 }} />
      </Scene>

      {/* 4: the chat rooms */}
      <Scene from={tRooms} to={tBoard}>
        <div style={{ position: "absolute", left: 960 - 152, top: 330 }}>
          <White size={350} lightColor={colors.green} lightAmount={0.6} look={{ x: Math.sin(frame / 30), y: 0 }} />
        </div>
        {ROOMS.map((r, i) => (
          <Pop key={i} at={tRooms + 6 + i * 12} sound="pop" style={{ left: r.left, top: r.top }}>
            <Card style={{ width: r.w, padding: "16px 20px" }}>
              <div style={{ ...mono(20, colors.green), letterSpacing: "0.1em" }}>
                # <DecodeText text={["sim-swaps", "accounts", "methods", "flex", "targets", "market"][i]} at={tRooms + 6 + i * 12} />
              </div>
              {[0, 1, 2].map((k) => (
                <div key={k} style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: [colors.amber, colors.agent, colors.red][(i + k) % 3], opacity: 0.8 }} />
                  <div style={{ height: 10, borderRadius: 3, background: colors.line, width: 110 + random(`rm-${i}-${k}-${Math.floor((frame + i * 7) / 20)}`) * (r.w - 220) }} />
                </div>
              ))}
            </Card>
          </Pop>
        ))}
        <Chip at={c("tricks")} text="TRADING TRICKS FOR BREAKING INTO ACCOUNTS" fontSize={30} origin="center center" style={{ left: 560, top: 130 }} />
        <Pop at={c("reputation") - 6} from="up" style={{ left: 300, right: 300, top: 705, height: 150, background: "rgba(7,9,11,0.88)", borderRadius: 12 }}>
          <div />
        </Pop>
        <TitleSlam text="REPUTATION = YOUR LAST HACK" color={colors.amber} fontSize={112} at={c("reputation")} style={{ top: 722 }} />
      </Scene>

      {/* 5: climbing */}
      <Scene from={tBoard} to={tCourt}>
        <Pop at={tBoard} from="up" style={{ left: 510, top: 110 }}>
          <Card style={{ width: 900, height: 700, padding: "26px 40px" }}>
            <div style={{ ...mono(28, colors.green), letterSpacing: "0.2em" }}>REPUTATION BOARD</div>
            <div style={{ position: "relative", height: 590, marginTop: 14 }}>
              {BOARD.map((name) => {
                const pos = order.indexOf(name);
                const me = name === "WHITE";
                return (
                  <div
                    key={name}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: me ? 4 * 114 * (1 - Math.min(1, climb)) : pos * 114,
                      height: 100,
                      display: "flex",
                      alignItems: "center",
                      gap: 26,
                      padding: "0 26px",
                      borderRadius: 10,
                      background: me ? "rgba(57,255,136,0.14)" : colors.panelLight,
                      border: `2px solid ${me ? colors.green : colors.line}`,
                      zIndex: me ? 2 : 1,
                      boxShadow: me ? `0 0 40px ${colors.green}44` : "none",
                    }}
                  >
                    <span style={{ ...mono(40, me ? colors.green : colors.dim), fontWeight: 700, width: 70 }}>#{pos + 1}</span>
                    <span style={{ fontFamily: me ? fonts.display : fonts.mono, fontSize: me ? 78 : 40, color: me ? colors.green : colors.text, flex: 1 }}>{name}</span>
                    {me ? <span style={{ ...mono(40, colors.green) }}>▲</span> : null}
                  </div>
                );
              })}
            </div>
          </Card>
        </Pop>
      </Scene>

      {/* 6: first convictions */}
      <Scene from={tCourt} to={D}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ marginTop: -80, width: 1100, borderRadius: 14, border: `2px solid ${colors.line}`, background: colors.panel, padding: "34px 50px 44px", opacity: Math.min(1, (frame - tCourt) / 10) }}>
            <div style={{ ...mono(28, colors.dim), letterSpacing: "0.24em" }}>COURT RECORD</div>
            <div style={{ fontFamily: fonts.display, fontSize: 260, lineHeight: 1, color: colors.text, marginTop: 6 }}>2021</div>
            <div style={{ height: 4, background: colors.line, margin: "10px 0 20px" }} />
            <div style={{ fontFamily: fonts.display, fontSize: 130, lineHeight: 1, color: colors.amber, opacity: frame >= c("first") ? 1 : 0.12 }}>
              FIRST CONVICTIONS
            </div>
          </div>
        </AbsoluteFill>
        <Chip at={c("exams")} text="WHILE OTHER KIDS SAT EXAMS" color={colors.text} fontSize={34} origin="center center" style={{ left: 640, top: 120 }} />
      </Scene>
    </>
  );
};
