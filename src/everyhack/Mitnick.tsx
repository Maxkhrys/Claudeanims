import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, springs } from "../theme";
import { sp } from "../lib/timing";
import { Sfx } from "../components";
import { CalendarPage, DotMap, MoneyRain, Person } from "../shorts/cryptoKit";
import { big, Billboard, Box, type Cam, clamp01, lerp, Plane, Stage3D, Tag, useCam } from "../shorts/kit3d";
import { Alarm, BLUE, Bubble, Check, CountUp, Crt, CrossOut, DeskPhone, Dramatised, Glow, GREEN, Handset, Hit, Logo, mono, Mystery, Pill, Pop, RED, Row, type SceneProps, ShakeAt, Shot, Stamp, WhiteFlash, YELLOW } from "./kit";

/*
 * BLOCK 2: KEVIN MITNICK (1995), 46 s (the Short uses 0 - "legally.")
 *   A frame 0 flash + WANTED poster slams in -> "1990s", MOST WANTED HACKER, the face, KEVIN MITNICK
 *   B his weapon: a computer (crossed out) -> a TELEPHONE (ringing)
 *   C split call: Mitnick "Hi, it's Dave from IT" -> worker reads out the password (dramatised)
 *   D Motorola + Nokia towers, HACKED
 *   E US dot map: on the run, FBI badge chasing him city to city
 *   F FEB 1995 -> 3D apartment block, the lit window, Raleigh NC, crosshair
 *   G prosecutors shaking -> NUCLEAR WAR alarm -> whistling into a 3D payphone
 *   H bars slam down: 5 YEARS
 *   I suit + briefcase, money rain, paid to hack... LEGALLY (green tick)
 *   J teaser: talked his way in -> the next one was 15 -> Yahoo
 */

export const MITNICK = { hair: "short" as const, hairColor: "#2B1D14", glasses: true, outfit: "tee" as const, shirt: "#2E3A4A", skin: "#E8B48F" };

const Wanted: React.FC<{ reveal: number; frame: number }> = ({ reveal }) => (
  <div style={{ width: 520, height: 680, background: "#E8DCC0", border: "10px solid #3A2A1A", borderRadius: 8, boxShadow: "0 30px 80px rgba(0,0,0,0.7)", position: "relative", overflow: "hidden" }}>
    <div style={{ textAlign: "center", marginTop: 20, ...big(120, "#3A0B0B"), textShadow: "none" }}>WANTED</div>
    <div style={{ textAlign: "center", ...mono(24, "#3A2A1A") }}>BY THE F.B.I.</div>
    <div style={{ position: "absolute", left: 70, top: 200, width: 380, height: 340, background: "#CBBE9E", border: "6px solid #3A2A1A", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 90, top: 40, opacity: reveal }}>
        <Person size={500} {...MITNICK} look={0} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 40, opacity: 1 - reveal }}>
        <Person size={500} {...MITNICK} silhouette />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", ...big(62, "#3A0B0B"), textShadow: "none" }}>{reveal > 0.5 ? "KEVIN MITNICK" : "HACKER"}</div>
  </div>
);

/** Office worker at a desk, side B of the call. */
const Worker: React.FC<{ talk: boolean }> = ({ talk }) => (
  <div style={{ position: "relative", width: 360, height: 460 }}>
    <div style={{ position: "absolute", left: 80, top: 0 }}>
      <Person size={360} hair="neat" hairColor="#6A4A2A" outfit="suit" shirt="#4A5A6A" tie="#3FB6FF" skin="#F0C6A4" look={-0.6} bob={talk ? 1.5 : 0.4} arm={0.7} />
    </div>
    {/* desk in front of the worker */}
    <div style={{ position: "absolute", left: 0, top: 300, width: 360, height: 40, borderRadius: 8, background: "#6A4B38", border: "5px solid #0B0C10" }} />
    <div style={{ position: "absolute", left: 20, top: 340, width: 320, height: 110, background: "#57402F", border: "5px solid #0B0C10", borderTop: "none" }} />
    <div style={{ position: "absolute", left: 220, top: 230 }}>
      <DeskPhone w={110} />
    </div>
  </div>
);

/** The apartment block in 3D with one lit window. */
const Apartment: React.FC<{ from: number; to: number; c: SceneProps["c"] }> = ({ from, to, c }) => {
  const frame = useCurrentFrame();
  const tTrack = c("track");
  const tNorth = c("north");
  const cam0 = useCam([
    { at: from, tx: 0, ty: -300, tz: 0, rx: -6, ry: 28, dist: -200 },
    { at: from + 1, tx: 0, ty: -320, tz: 0, rx: -10, ry: 18, dist: -40 },
    { at: tTrack - 4, tx: 60, ty: -360, tz: 0, rx: -6, ry: -8, dist: 260 },
  ]);
  const cam: Cam = { ...cam0, ry: cam0.ry + 1.5 * Math.sin(frame / 30) };
  const lit = (r: number, k: number) => r === 2 && k === 2;
  const windows = (
    <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gridTemplateRows: "repeat(4, 1fr)", gap: 26, padding: 30 }}>
      {new Array(16).fill(0).map((_, i) => {
        const r = Math.floor(i / 4);
        const k = i % 4;
        const on = lit(r, k) || random(`w${i}`) < 0.25;
        return <div key={i} style={{ borderRadius: 4, background: lit(r, k) ? (frame >= tTrack ? RED : YELLOW) : on ? "#8A7A40" : "#0B1220", boxShadow: lit(r, k) ? `0 0 40px ${frame >= tTrack ? RED : YELLOW}` : "none" }} />;
      })}
    </div>
  );
  return (
    <Shot from={from} to={to} enter="punch" whoosh push={0.03}>
      <AbsoluteFill style={{ background: "linear-gradient(#060B18, #0E1A30 60%, #0A0F18)" }} />
      {new Array(40).fill(0).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: random(`st${i}`) * 1000, top: random(`sy${i}`) * 400, width: 3, height: 3, background: "#fff", opacity: 0.4 + 0.4 * Math.sin(frame / 8 + i) }} />
      ))}
      <Stage3D cam={cam} cx={500} cy={800}>
        <Plane w={1600} h={1000} t="rotateX(90deg)" style={{ background: "#111820" }} />
        <Box x={0} z={-100} w={460} d={300} h={560} top="#2A3442" front="#3A4656" side="#2A3442" frontChildren={windows} />
        <Box x={-430} z={-60} w={240} d={240} h={300} top="#1E2630" front="#28323E" side="#1E2630" />
        <Box x={420} z={-160} w={220} d={220} h={380} top="#1E2630" front="#28323E" side="#1E2630" />
        <Billboard pos={{ x: 0, y: -600, z: -100 }} cam={cam} w={700} h={120}>
          <Tag at={tNorth} text="RALEIGH, NORTH CAROLINA" color={YELLOW} size={38} />
        </Billboard>
      </Stage3D>
      {/* tracking crosshair locks on the lit window */}
      {frame >= tTrack ? (
        (() => {
          const k = sp(frame, 30, tTrack, springs.snappy);
          const s = lerp(3, 1, k);
          return (
            <div style={{ position: "absolute", left: 500 - 90, top: 420 - 90, width: 180, height: 180, transform: `scale(${s}) rotate(${(1 - k) * 90}deg)`, opacity: clamp01(k * 2) }}>
              <Sfx name="beep" at={tTrack} volume={0.5} />
              <svg width={180} height={180} viewBox="0 0 180 180">
                <circle cx={90} cy={90} r={70} fill="none" stroke={RED} strokeWidth={6} />
                <line x1={90} y1={0} x2={90} y2={50} stroke={RED} strokeWidth={6} />
                <line x1={90} y1={130} x2={90} y2={180} stroke={RED} strokeWidth={6} />
                <line x1={0} y1={90} x2={50} y2={90} stroke={RED} strokeWidth={6} />
                <line x1={130} y1={90} x2={180} y2={90} stroke={RED} strokeWidth={6} />
              </svg>
            </div>
          );
        })()
      ) : null}
    </Shot>
  );
};

/** 3D street corner payphone; Mitnick stands beside it with the handset. */
const PayphoneScene: React.FC<{ from: number; to: number; c: SceneProps["c"] }> = ({ from, to, c }) => {
  const frame = useCurrentFrame();
  const tNuke = c("nuclear");
  const tWhistle = c("whistling");
  const cam0 = useCam([
    { at: from, tx: 0, ty: -260, tz: 0, rx: -10, ry: -30, dist: 100 },
    { at: from + 1, tx: 0, ty: -260, tz: 0, rx: -10, ry: -18, dist: 240 },
    { at: tWhistle - 4, tx: -40, ty: -330, tz: 0, rx: -6, ry: 6, dist: 440 },
  ]);
  const cam: Cam = { ...cam0, ry: cam0.ry + 1.5 * Math.sin(frame / 30) };
  const whistle = frame >= tWhistle;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, #1E2838, #06080B 70%)" }} />
      <Stage3D cam={cam} cx={500} cy={700}>
        <Plane w={1200} h={800} t="rotateX(90deg)" style={{ background: "repeating-linear-gradient(90deg, #22262C 0 120px, #1C2025 120px 124px)" }} />
        {/* payphone: pole + box, against the back */}
        <Box x={120} z={-160} w={40} d={40} h={260} top="#555" front="#6A6F76" side="#50555C" />
        <Box
          x={120}
          z={-150}
          w={200}
          d={110}
          h={260}
          y0={-200}
          top="#B0B6BE"
          front="#C9CED5"
          side="#9AA0A8"
          frontChildren={
            <div style={{ position: "absolute", inset: 0 }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 10, textAlign: "center", ...big(34, "#1A3A8A"), textShadow: "none" }}>PHONE</div>
              <div style={{ position: "absolute", left: 40, top: 70, width: 120, height: 120, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {new Array(12).fill(0).map((_, i) => (
                  <div key={i} style={{ background: "#2A3442", borderRadius: 4 }} />
                ))}
              </div>
            </div>
          }
        />
        {/* Mitnick stands left of the phone, clear of the box */}
        <Billboard pos={{ x: -130, y: 0, z: -70 }} cam={cam} w={220} h={420}>
          <div style={{ position: "relative" }}>
            <Person size={400} {...MITNICK} look={0.8} bob={1} arm={0.9} />
            <div style={{ position: "absolute", left: 120, top: 40 }}>
              <Handset size={70} color="#2A2D33" />
            </div>
          </div>
        </Billboard>
        {whistle ? (
          <Billboard pos={{ x: 0, y: -330, z: -60 }} cam={cam} w={300} h={200}>
            <div style={{ position: "relative", width: 300, height: 200 }}>
              {[0, 1, 2, 3].map((k) => {
                const t = ((frame - tWhistle) / 24 + k * 0.25) % 1;
                return (
                  <div key={k} style={{ position: "absolute", left: 40 + t * 180, top: 150 - t * 140 + Math.sin(t * 10) * 10, ...big(60, YELLOW), opacity: 1 - t }}>
                    ♪
                  </div>
                );
              })}
            </div>
          </Billboard>
        ) : null}
      </Stage3D>
      {frame >= tNuke ? (
        <Row top={90}>
          <Pop at={tNuke} sound="boom">
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "10px 28px", borderRadius: 18, background: RED }}>
              <svg width={80} height={80} viewBox="-50 -50 100 100">
                <circle r={46} fill={YELLOW} stroke="#0B0C10" strokeWidth={4} />
                <circle r={9} fill="#0B0C10" />
                {[0, 1, 2].map((i) => (
                  <path key={i} d="M0,0 L-14,-38 A40,40 0 0 1 14,-38 Z" transform={`rotate(${i * 120})`} fill="#0B0C10" />
                ))}
              </svg>
              <div style={{ ...big(84, "#FFFFFF"), textShadow: "none" }}>NUCLEAR WAR?!</div>
            </div>
          </Pop>
        </Row>
      ) : null}
      <Alarm from={tNuke} to={to} />
      {whistle ? <Sfx name="notify" at={tWhistle} volume={0.4} /> : null}
    </AbsoluteFill>
  );
};

/** US dot map with Mitnick on the run and the FBI behind him. */
const Chase: React.FC<{ from: number; to: number; c: SceneProps["c"] }> = ({ from, to, c }) => {
  const frame = useCurrentFrame();
  const tFbi = c("f.b.i.");
  const LA: [number, number] = [-118.2, 34];
  const SEA: [number, number] = [-122.3, 47.6];
  const DEN: [number, number] = [-105, 39.7];
  const RAL: [number, number] = [-78.6, 35.8];
  const d = Math.max(1, to - from);
  const t0 = from + 4;
  const arcs = [
    { from: LA, to: SEA, color: YELLOW, t0, t1: t0 + d * 0.25 },
    { from: SEA, to: DEN, color: YELLOW, t0: t0 + d * 0.28, t1: t0 + d * 0.5 },
    { from: DEN, to: RAL, color: YELLOW, t0: t0 + d * 0.53, t1: t0 + d * 0.85 },
  ];
  const fbiArcs = [
    { from: LA, to: SEA, color: BLUE, t0: tFbi, t1: tFbi + 14 },
    { from: SEA, to: DEN, color: BLUE, t0: tFbi + 14, t1: tFbi + 28 },
  ];
  return (
    <Shot from={from} to={to} whoosh push={0.04}>
      <Glow color={BLUE} y={50} a="20" />
      <div style={{ position: "absolute", left: 40, top: 230 }}>
        <DotMap
          w={920}
          h={560}
          view={[-127, 51, -65, 23]}
          arcs={[...arcs, ...(frame >= tFbi ? fbiArcs : [])]}
          pins={[
            { at: LA, label: "LOS ANGELES", t: from + 2, color: YELLOW },
            { at: SEA, label: "SEATTLE", t: arcs[0].t1, color: YELLOW },
            { at: DEN, label: "DENVER", t: arcs[1].t1, color: YELLOW },
            { at: RAL, label: "RALEIGH", t: arcs[2].t1, color: RED },
          ]}
          dotColor="#2C3B4A"
        />
      </div>
      <Row top={100}>
        <Pop at={from}>
          <Pill text="YEARS ON THE RUN" color={YELLOW} size={50} />
        </Pop>
      </Row>
      {frame >= tFbi ? (
        <div style={{ position: "absolute", left: 640, top: 640 }}>
          <Pop at={tFbi} sound="slam">
            <Logo id="fbi" h={220} />
          </Pop>
        </div>
      ) : null}
      {frame >= tFbi ? <Sfx name="riser" at={tFbi} volume={0.3} /> : null}
    </Shot>
  );
};

export const Mitnick: React.FC<SceneProps> = ({ c, D }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tWanted = c("most wanted");
  const tKevin = c("kevin");
  const tAnd = c("and his");
  const tComputer = c("computer");
  const tWasnt = c("wasn't");
  const tPhone = c("telephone");
  const tCall = c("he'd call");
  const tPretend = c("pretend");
  const tAsk = c("ask");
  const tPass = c("password");
  const tWorked = c("it worked");
  const tMoto = c("motorola");
  const tNokia = c("nokia");
  const tSpent = c("he spent");
  const tIn = c("in february");
  const tFeb = c("february");
  const tApt = c("they finally");
  const tPros = c("and prosecutors");
  const tScared = c("scared");
  const tSaid = c("he said");
  const tClaimed = c("claimed");
  const tServed = c("he served");
  const tFive = c("five years");
  const tThen = c("then he");
  const tPaid = c("paid");
  const tLegal = c("legally");
  const tTalked = c("mitnick talked");
  const tNext = c("the next one");
  const tFifteen = c("fifteen");
  const tYahoo = c("yahoo");

  const reveal = sp(frame, fps, tKevin, springs.smooth);
  const posterIn = sp(frame, fps, 0, springs.slam);

  return (
    <ShakeAt hits={[0, tPhone, tMoto, tNokia, tServed, c("nuclear")]} amount={30}>
      {/* A: wanted poster, frame 0 */}
      <Shot from={0} to={tAnd} enter="none" push={0.06}>
        <AbsoluteFill style={{ background: Math.floor(frame / 6) % 2 === 0 && frame < tKevin ? "radial-gradient(ellipse at 20% 0%, rgba(255,40,40,0.45), transparent 55%), radial-gradient(ellipse at 80% 0%, rgba(40,120,255,0.25), transparent 55%)" : "radial-gradient(ellipse at 80% 0%, rgba(255,40,40,0.3), transparent 55%), radial-gradient(ellipse at 20% 0%, rgba(40,120,255,0.45), transparent 55%)" }} />
        <div style={{ position: "absolute", left: 240, top: 170, transform: `scale(${lerp(2.6, 1, posterIn)}) rotate(${lerp(-14, -3, posterIn)}deg)`, transformOrigin: "260px 340px" }}>
          <Wanted reveal={reveal} frame={frame} />
        </div>
        <Row top={60}>
          <Pop at={0} sound="none">
            <Pill text="THE 1990s" color={colors.text} size={44} />
          </Pop>
        </Row>
        {frame >= tWanted ? (
          <div style={{ position: "absolute", left: 560, top: 140 }}>
            <Pop at={tWanted} sound="slam">
              <Hit text="#1 MOST WANTED" size={70} color={RED} rotate={8} />
            </Pop>
          </div>
        ) : null}
        {frame >= tKevin ? <Sfx name="whoosh" at={tKevin} volume={0.5} /> : null}
        <Sfx name="slam" at={0} volume={0.8} />
        <Sfx name="boom" at={0} volume={0.6} />
      </Shot>

      {/* B: weapon = telephone */}
      <Shot from={tAnd} to={tCall} whoosh>
        <Glow color={frame >= tPhone ? YELLOW : GREEN} y={45} a="28" />
        <Row top={100}>
          <div style={{ ...mono(44, colors.text) }}>HIS BEST WEAPON</div>
        </Row>
        {frame < tPhone ? (
          frame >= tAnd + 4 ? (
            <Row top={300}>
              <Pop at={tAnd + 4}>
                <div style={{ position: "relative" }}>
                  <Crt w={360}>
                    <div style={{ position: "absolute", inset: 20, ...mono(28, GREEN) }}>C:\&gt; _</div>
                  </Crt>
                  <CrossOut at={tWasnt} size={360} />
                </div>
              </Pop>
            </Row>
          ) : null
        ) : (
          <>
            <Row top={300}>
              <Pop at={tPhone} sound="boom">
                <DeskPhone w={420} ring />
              </Pop>
            </Row>
            <Row top={720}>
              <Pop at={tPhone + 3} sound="none">
                <Hit text="A TELEPHONE" size={110} />
              </Pop>
            </Row>
          </>
        )}
        {frame >= tWasnt && frame < tPhone ? <Sfx name="error" at={tWasnt} volume={0.5} /> : null}
      </Shot>

      {/* C: the call */}
      <Shot from={tCall} to={tWorked} whoosh push={0.03}>
        <Glow color={YELLOW} y={50} a="18" />
        <div style={{ position: "absolute", left: 40, top: 360 }}>
          <div style={{ position: "relative" }}>
            <Person size={420} {...MITNICK} look={0.8} bob={1.2} arm={0.9} />
            <div style={{ position: "absolute", left: 130, top: 40 }}>
              <Handset size={80} color="#2A2D33" />
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 600, top: 400 }}>
          <Worker talk={frame >= tAsk} />
        </div>
        {/* the phone line between them */}
        <svg width={1000} height={1000} style={{ position: "absolute", inset: 0 }}>
          <path d="M290,470 C420,330 560,330 700,470" stroke={YELLOW} strokeWidth={6} fill="none" strokeDasharray="14 12" strokeDashoffset={-frame * 3} opacity={0.8} />
        </svg>
        <div style={{ position: "absolute", left: 60, top: 110 }}>
          {frame >= tPretend ? (
            <Pop at={tPretend}>
              <Bubble text="Hi! It's Dave, from IT." w={400} size={38} />
            </Pop>
          ) : (
            <Pop at={tCall}>
              <Pill text="CALLS A COMPANY" color={YELLOW} size={40} />
            </Pop>
          )}
        </div>
        {frame >= tAsk ? (
          <div style={{ position: "absolute", left: 500, top: 210 }}>
            <Pop at={tAsk}>
              <Bubble text={frame >= tPass ? "Sure! It's Summer95" : "...the password?"} w={440} size={36} tail="right" color={frame >= tPass ? YELLOW : "#FFFFFF"} />
            </Pop>
          </div>
        ) : null}
        {frame >= tPass ? <Sfx name="kaching" at={tPass} volume={0.5} /> : null}
        <Dramatised top={960} />
      </Shot>

      {/* D: giants like Motorola and Nokia */}
      <Shot from={tWorked} to={tSpent} whoosh>
        <Glow color={BLUE} y={40} a="22" />
        <Row top={100}>
          <div style={{ ...mono(44, colors.text) }}>IT WORKED ON GIANTS</div>
        </Row>
        <div style={{ position: "absolute", left: 0, width: 1000, top: 220, display: "flex", justifyContent: "center", gap: 60, alignItems: "flex-end" }}>
          {[
            { id: "motorola" as const, at: tMoto, h: 560 },
            { id: "nokia" as const, at: tNokia, h: 500 },
          ].map((b) => (
            <div key={b.id} style={{ position: "relative", width: 360, height: 700, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
              {frame >= b.at ? (
                <Pop at={b.at} sound="slam">
                  <Logo id={b.id} h={b.id === "nokia" ? 70 : 110} maxW={300} />
                </Pop>
              ) : null}
              <div style={{ marginTop: 20, width: 260, height: b.h - 200, background: "linear-gradient(#2A3442, #1A2230)", border: "6px solid #0B0C10", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, padding: 18, boxSizing: "border-box" }}>
                {new Array(16).fill(0).map((_, i) => (
                  <div key={i} style={{ height: 30, background: frame >= b.at + 6 ? (i % 3 === 0 ? RED : "#6A5A2A") : "#8A7A40", borderRadius: 3 }} />
                ))}
              </div>
              {frame >= b.at + 6 ? (
                <div style={{ position: "absolute", top: 380 }}>
                  <Stamp at={b.at + 6} text="HACKED" size={70} rotate={-12} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </Shot>

      {/* E: on the run, FBI chasing */}
      <Chase from={tSpent} to={tIn} c={c} />

      {/* F: Feb 1995, the apartment */}
      <Shot from={tIn} to={tApt} whoosh>
        <Glow color={YELLOW} y={45} a="20" />
        <Row top={240}>
          <Pop at={tIn} sound="slam">
            <CalendarPage month="FEB" day="1995" w={380} color={RED} />
          </Pop>
        </Row>
      </Shot>
      <Apartment from={tApt} to={tPros} c={c} />

      {/* G: prosecutors scared -> nuclear war by whistling into a payphone */}
      <Shot from={tPros} to={tClaimed} whoosh>
        <Glow color={RED} y={50} a="20" />
        <div style={{ position: "absolute", left: 0, width: 1000, top: 340, display: "flex", justifyContent: "center", gap: 40 }}>
          {[0, 1, 2].map((i) => {
            const shake = frame >= tScared ? (random(`ps${i}-${frame}`) - 0.5) * 12 : 0;
            return (
              <div key={i} style={{ transform: `translateX(${shake}px)` }}>
                <Person size={420} hair={i === 1 ? "short" : "neat"} hairColor={["#2B1D14", "#8A6A4A", "#4A3A2A"][i]} outfit="suit" shirt={["#1E2630", "#2A2430", "#1E2A2A"][i]} tie={RED} skin={["#F0C6A4", "#C98E6A", "#E8B48F"][i]} look={0} />
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 1000, top: 800, height: 60, background: "#5A3A22", border: "6px solid #0B0C10" }} />
        <Row top={110}>
          <Pop at={tPros}>
            <Pill text="PROSECUTORS" color={colors.text} size={46} />
          </Pop>
        </Row>
        {frame >= tScared ? (
          <Row top={220}>
            <Pop at={tScared} sound="slam">
              <Hit text="TERRIFIED" size={90} color={RED} />
            </Pop>
          </Row>
        ) : null}
        {frame >= tSaid ? (
          <div style={{ position: "absolute", right: 40, top: 900 }}>
            <Pop at={tSaid} sound="none">
              <div style={{ ...mono(24, colors.dim) }}>(according to Mitnick)</div>
            </Pop>
          </div>
        ) : null}
      </Shot>
      <Shot from={tClaimed} to={tServed} enter="punch" whoosh push={0.03}>
        <PayphoneScene from={tClaimed} to={tServed} c={c} />
      </Shot>

      {/* H: five years */}
      <Shot from={tServed} to={tThen} enter="punch">
        <Glow color={colors.text} y={45} a="14" />
        <div style={{ position: "absolute", left: 300, top: 260 }}>
          <Person size={460} {...MITNICK} shirt="#D96A1A" look={0} />
        </div>
        <div style={{ position: "absolute", left: 160, top: lerp(-700, 180, sp(frame, fps, tServed, springs.slam)), width: 680, height: 660, display: "flex", justifyContent: "space-between" }}>
          {new Array(7).fill(0).map((_, i) => (
            <div key={i} style={{ width: 24, height: "100%", background: "linear-gradient(90deg, #5A6068, #B9C0C8, #5A6068)", borderRadius: 8 }} />
          ))}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 26, background: "#7A8088", borderRadius: 8 }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: "#7A8088", borderRadius: 8 }} />
        </div>
        <Sfx name="slam" at={tServed + 4} volume={0.8} />
        {frame >= tFive ? (
          <Row top={800}>
            <Pop at={tFive} sound="slam">
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <CountUp at={tFive} from={0} to={5} size={170} color={YELLOW} dur={10} />
                <div style={{ ...big(100, colors.text) }}>YEARS</div>
              </div>
            </Pop>
          </Row>
        ) : null}
      </Shot>

      {/* I: paid to hack, legally */}
      <Shot from={tThen} to={tTalked} whoosh push={0.05}>
        <Glow color={GREEN} y={45} a="24" />
        {frame >= tPaid ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 1000, opacity: 0.85 }}>
            <MoneyRain w={1000} h={1000} from={tPaid} n={26} />
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 120, top: 300 }}>
          <Person size={460} {...MITNICK} outfit="suit" shirt="#1E2630" tie={YELLOW} look={0.5} bob={0.8} />
        </div>
        <div style={{ position: "absolute", left: 230, top: 650, width: 120, height: 90, borderRadius: 10, background: "#4A3022", border: "6px solid #0B0C10" }} />
        <div style={{ position: "absolute", left: 530, top: 300, width: 400 }}>
          <Pop at={tThen + 6}>
            <Pill text="SECURITY CONSULTANT" color={YELLOW} size={34} />
          </Pop>
          {frame >= tPaid ? (
            <div style={{ marginTop: 30 }}>
              <Pop at={tPaid}>
                <Pill text="PAID TO HACK" color={GREEN} size={46} />
              </Pop>
            </div>
          ) : null}
        </div>
        {frame >= tLegal ? (
          <Row top={780}>
            <Pop at={tLegal} sound="boom">
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Check size={130} />
                <Hit text="LEGALLY" size={110} color={GREEN} />
              </div>
            </Pop>
          </Row>
        ) : null}
        {frame >= tPaid ? <Sfx name="kaching" at={tPaid} volume={0.6} /> : null}
      </Shot>

      {/* J: teaser */}
      <Shot from={tTalked} to={D} whoosh push={0.05}>
        <Glow color={frame >= tYahoo ? "#7E1FFF" : YELLOW} y={45} a="30" />
        {frame < tNext ? (
          <>
            <Row top={300}>
              <Handset size={300} ring={1} />
            </Row>
            <Row top={720}>
              <Pop at={tTalked + 10}>
                <Hit text="TALKED HIS WAY IN" size={90} />
              </Pop>
            </Row>
          </>
        ) : (
          <>
            <Row top={180}>
              <Pop at={tNext} sound="boom">
                <Mystery size={440} label={frame >= tFifteen ? "15" : "?"} color={YELLOW} />
              </Pop>
            </Row>
            {frame >= tYahoo ? (
              <Row top={700}>
                <Pop at={tYahoo} sound="slam">
                  <Logo id="yahoo" h={120} />
                </Pop>
              </Row>
            ) : null}
          </>
        )}
      </Shot>
      <WhiteFlash at={0} hold={3} fade={12} />
    </ShakeAt>
  );
};
