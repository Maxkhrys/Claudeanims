import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, Sfx } from "../components";
import { big, Billboard, Box, type Cam, clamp01, lerp, Plane, Stage3D, Tag, useCam } from "../shorts/kit3d";
import { Glow, Handset, Hit, Logo, mono, Pop, RED, Row, type SceneProps, ShakeAt, Shot, Stamp, WhiteFlash, YELLOW } from "./kit";

/*
 * BLOCK 0 cold open (15.5 s)
 *   0.0  white flash -> Vegas casino floor in 3D, slot machines spinning, phone rings
 *   4.0  "went dark": machines black out one by one, OFFLINE stamp
 *   5.1  3D hotel room, TV + Fire Stick, the GTA VI logo glitches onto the TV, LEAKED
 *  10.5  EVERY FAMOUS HACK / IN HISTORY / EXPLAINED, years fly past, 12:00 timer, LET'S GO
 */

const SYMBOLS = ["7", "BAR", "$", "♥", "7", "★"];

const SlotFace: React.FC<{ i: number; dark: boolean }> = ({ i, dark }) => {
  const frame = useCurrentFrame();
  const hue = ["#FF2E88", YELLOW, "#3FB6FF", "#39FF88", "#FF8A1F"][i % 5];
  return (
    <div style={{ position: "absolute", inset: 0, background: dark ? "#08090B" : `linear-gradient(180deg, ${hue}, #1A0B18 40%)` }}>
      {!dark ? (
        <>
          <div style={{ position: "absolute", left: 10, right: 10, top: 10, height: 40, borderRadius: 8, background: "#0B0C10", display: "flex", alignItems: "center", justifyContent: "center", ...big(30, hue) }}>JACKPOT</div>
          <div style={{ position: "absolute", left: 12, right: 12, top: 70, height: 100, borderRadius: 8, background: "#FFFFFF", display: "flex", overflow: "hidden", border: "4px solid #0B0C10" }}>
            {[0, 1, 2].map((r) => {
              const y = ((frame * (14 + r * 5) + i * 37 + r * 20) % 300) - 150;
              return (
                <div key={r} style={{ flex: 1, position: "relative", borderRight: r < 2 ? "3px solid #ccc" : "none" }}>
                  {[0, 1, 2, 3].map((k) => (
                    <div key={k} style={{ position: "absolute", left: 0, right: 0, top: y + k * 75, textAlign: "center", ...big(44, k % 2 ? RED : "#0B0C10"), textShadow: "none" }}>
                      {SYMBOLS[(k + r + i) % SYMBOLS.length]}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 20, right: 20, top: 190, height: 14, borderRadius: 7, background: hue, opacity: 0.5 + 0.5 * Math.sin(frame / 3 + i) }} />
        </>
      ) : (
        <div style={{ position: "absolute", left: 12, right: 12, top: 70, height: 100, borderRadius: 8, background: "#050607", border: "4px solid #15181C" }} />
      )}
    </div>
  );
};

const Casino: React.FC<{ c: SceneProps["c"]; to: number }> = ({ c, to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tDark = c("went dark");
  const tVegas = c("las vegas");
  const cam0 = useCam([
    { at: 0, tx: 0, ty: -180, tz: 0, rx: -8, ry: 26, dist: 700 },
    { at: 1, tx: 0, ty: -180, tz: 0, rx: -10, ry: 14, dist: 520 },
    { at: tVegas - 6, tx: 0, ty: -190, tz: 0, rx: -12, ry: -16, dist: 420 },
    { at: tDark + 10, tx: 0, ty: -180, tz: 0, rx: -10, ry: -6, dist: 300 },
  ]);
  const cam: Cam = { ...cam0, ry: cam0.ry + 2 * Math.sin(frame / 30) };
  const xs = [-400, -200, 0, 200, 400];
  const darkAt = (i: number) => tDark + 2 + i * 3;
  const allDark = frame >= darkAt(4);
  return (
    <Shot from={0} to={to} enter="none" push={0.04}>
      <AbsoluteFill style={{ background: allDark ? "#030304" : "radial-gradient(ellipse at 50% 30%, #3A0B2A, #0B0510 70%)" }} />
      <Stage3D cam={cam} cx={500} cy={600}>
        <Plane w={1400} h={900} t="rotateX(90deg)" style={{ background: allDark ? "#060406" : "repeating-linear-gradient(45deg, #3B0A1E 0 40px, #2A0716 40px 80px)" }}>
          {!allDark ? <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, rgba(255,200,80,0.25), rgba(0,0,0,0) 60%)" }} /> : null}
        </Plane>
        {xs.map((x, i) => {
          const dark = frame >= darkAt(i);
          return (
            <React.Fragment key={i}>
              <Box x={x} z={-60} w={160} d={130} h={330} top={dark ? "#111" : "#3a2a3a"} front="#1A1A22" side={dark ? "#0B0B0E" : "#2A1F2C"} frontChildren={<SlotFace i={i} dark={dark} />} />
              {dark && frame < darkAt(i) + 8 ? <Sfx name="snap" at={darkAt(i)} volume={0.5} /> : null}
            </React.Fragment>
          );
        })}
        <Billboard pos={{ x: 0, y: -400, z: -60 }} cam={cam} w={700} h={130}>
          <Tag at={tVegas} until={tDark - 2} text="LAS VEGAS" color={YELLOW} size={54} />
        </Billboard>
      </Stage3D>
      {/* the phone call that did it */}
      <Row top={120}>
        <Pop at={c("phone")} until={tVegas - 2}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 30px", borderRadius: 24, background: "rgba(7,9,11,0.92)", border: `5px solid ${YELLOW}` }}>
            <Handset size={90} ring={1} />
            <div style={{ ...big(76, YELLOW) }}>ONE PHONE CALL</div>
          </div>
          <Sfx name="beep" at={c("phone")} volume={0.35} />
        </Pop>
      </Row>
      {frame >= tDark + 16 ? (
        <Row top={360}>
          <Stamp at={tDark + 16} text="OFFLINE" size={130} />
        </Row>
      ) : null}
      {frame >= darkAt(4) ? <Sfx name="crash" at={darkAt(4)} volume={0.5} /> : null}
      {/* sparks when the lights die */}
      {frame >= tDark && frame < tDark + 20
        ? new Array(14).fill(0).map((_, k) => {
            const t = (frame - tDark) / 20;
            return <div key={k} style={{ position: "absolute", left: 500 + (random(`spx${k}`) - 0.5) * 700 * t, top: 520 - 300 * t * random(`spy${k}`) + 400 * t * t, width: 8, height: 8, borderRadius: 4, background: YELLOW, opacity: 1 - t }} />;
          })
        : null}
    </Shot>
  );
};

const HotelRoom: React.FC<{ c: SceneProps["c"]; from: number; to: number }> = ({ c, from, to }) => {
  const frame = useCurrentFrame();
  const tStick = c("stick");
  const tGame = c("biggest");
  const tLeak = c("leaked");
  const cam0 = useCam([
    { at: from, tx: 40, ty: -220, tz: 0, rx: -16, ry: -34, dist: 120 },
    { at: from + 1, tx: 40, ty: -200, tz: 0, rx: -14, ry: -24, dist: 220 },
    { at: tStick - 4, tx: 200, ty: -230, tz: -60, rx: -8, ry: -10, dist: 520 },
    { at: tGame - 4, tx: 160, ty: -260, tz: -80, rx: -6, ry: -4, dist: 460 },
  ]);
  const cam: Cam = { ...cam0, ry: cam0.ry + 2 * Math.sin(frame / 30) };
  const onGame = frame >= tGame;
  const glitch = onGame && frame < tGame + 10;
  const W = 1000;
  const Dp = 760;
  const H = 520;
  return (
    <Shot from={from} to={to} enter="punch" whoosh>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #16202E, #06080B 70%)" }} />
      <ShakeAt hits={[tLeak]} amount={26}>
        <Stage3D cam={cam} cx={500} cy={640}>
          <Plane w={W} h={Dp} t="rotateX(90deg)" style={{ background: "linear-gradient(#3A3128, #2A231C)" }} />
          <Plane w={W} h={H} t={`translate3d(0px, ${-H / 2}px, ${-Dp / 2}px)`} style={{ background: "linear-gradient(#24303F, #1A2330)" }}>
            <div style={{ position: "absolute", left: 80, top: 90, width: 260, height: 200, background: "#0B1626", border: "10px solid #3A4656" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%, #FFFFFF22, transparent 40%)" }} />
            </div>
            <div style={{ position: "absolute", right: 70, top: 60, ...mono(26, "#8FA3B5") }}>ROOM 213</div>
          </Plane>
          <Plane w={Dp} h={H} t={`translate3d(${-W / 2}px, ${-H / 2}px, 0px) rotateY(90deg)`} style={{ background: "linear-gradient(#1E2836, #151D28)" }} />
          {/* bed on the left */}
          <Box x={-260} z={-40} w={340} d={460} h={90} top="#E6E1D6" front="#BDB6A8" side="#A79F90" />
          <Box x={-260} z={-250} w={340} d={40} h={190} top="#5A4030" front="#6A4B38" side="#4A3426" />
          <Billboard pos={{ x: -250, y: -90, z: 40 }} cam={cam} w={220} h={260}>
            <BlobCharacter color="#1A1F26" accessory="hoodie" size={230} seed={3} lightColor={onGame ? YELLOW : "#3FB6FF"} lightAmount={0.6} look={{ x: 1, y: -0.3 }} />
          </Billboard>
          {/* TV unit on the right, TV facing the bed */}
          <Box x={230} z={-230} w={300} d={110} h={120} top="#3A2C22" front="#4A382B" side="#2E231B" />
          <Plane w={340} h={200} t="translate3d(230px, -230px, -240px)" style={{ background: "#050607", border: "10px solid #15181C", borderRadius: 8, overflow: "hidden", boxShadow: onGame ? `0 0 80px ${YELLOW}66` : "0 0 40px #3FB6FF44" }}>
            {onGame ? (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #FF5FA2, #FFB347 50%, #5FD0FF)", display: "flex", alignItems: "center", justifyContent: "center", transform: glitch ? `translateX(${(random(`g${frame}`) - 0.5) * 40}px)` : "none" }}>
                <Logo id="gta6" h={150} card={false} />
              </div>
            ) : (
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#0E2A44, #071422)", display: "flex", alignItems: "center", justifyContent: "center", ...mono(22, "#5FA8FF") }}>NO SIGNAL</div>
            )}
          </Plane>
          {/* the Fire Stick hanging from the TV */}
          <Box x={340} z={-235} w={60} d={16} h={22} y0={-120} top="#222" front="#2A2D33" side="#1A1C20" />
          <Billboard pos={{ x: 360, y: -150, z: -200 }} cam={cam} w={400} h={110}>
            <Tag at={tStick} until={tGame - 2} text="FIRE STICK" color={YELLOW} size={40} />
          </Billboard>
        </Stage3D>
      </ShakeAt>
      {glitch ? <Sfx name="glitch" at={tGame} volume={0.6} /> : null}
      <Row top={110}>
        <Pop at={c("tv")} until={tGame - 2}>
          <div style={{ ...big(84, colors.text) }}>ONE TV STICK</div>
        </Pop>
      </Row>
      <Row top={100}>
        <Pop at={tGame + 4} sound="whoosh">
          <div style={{ ...big(80, colors.text) }}>BIGGEST GAME ON EARTH</div>
        </Pop>
      </Row>
      {frame >= tLeak ? (
        <Row top={720}>
          <Stamp at={tLeak} text="LEAKED" size={140} rotate={-8} />
        </Row>
      ) : null}
    </Shot>
  );
};

const YEARS = ["1988", "1995", "2000", "2013", "2014", "2016", "2017", "2020", "2021", "2023", "2025"];

const Title: React.FC<{ c: SceneProps["c"]; from: number; to: number }> = ({ c, from, to }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tFamous = c("famous");
  const tHack = c("hack");
  const tHist = c("history");
  const tExp = c("explained");
  const tTwelve = c("twelve");
  const tGo = c("let's");
  const warp = sp(frame, fps, tGo + 6, springs.smooth);
  const secLeft = frame >= tTwelve ? Math.max(0, 720 - Math.floor((frame - tTwelve) / 2)) : 720;
  return (
    <Shot from={from} to={to} enter="none" push={0.02}>
      <AbsoluteFill style={{ transform: `scale(${1 + warp * 1.8})`, opacity: 1 - warp * 0.9 }}>
        <Glow color={YELLOW} y={45} a="30" />
        {/* years flying past behind the title */}
        {YEARS.map((y, i) => {
          const t = (frame - from) / 30 + i * 0.37;
          const k = t % 1.6;
          const ang = i * 2.2;
          const r = 120 + k * 520;
          return (
            <div key={y} style={{ position: "absolute", left: 500 + Math.cos(ang) * r - 80, top: 500 + Math.sin(ang) * r * 0.8 - 30, ...big(40 + k * 50, "#2E3944"), opacity: clamp01(k * 3) * (1 - k / 1.6) }}>
              {y}
            </div>
          );
        })}
        <Row top={200}>
          <Pop at={from} sound="slam">
            <div style={{ ...big(150, colors.text) }}>EVERY</div>
          </Pop>
          {frame >= tFamous ? (
            <Pop at={tFamous} sound="slam">
              <div style={{ ...big(150, colors.text) }}>FAMOUS</div>
            </Pop>
          ) : null}
        </Row>
        {frame >= tHack ? (
          <Row top={340}>
            <Pop at={tHack} sound="slam">
              <div style={{ ...big(230, YELLOW) }}>HACK</div>
            </Pop>
          </Row>
        ) : null}
        {frame >= tHist ? (
          <Row top={560}>
            <Pop at={tHist}>
              <div style={{ ...mono(46, colors.text) }}>IN HISTORY</div>
            </Pop>
          </Row>
        ) : null}
        {frame >= tExp ? (
          <Row top={640}>
            <Pop at={tExp} sound="boom">
              <Hit text="EXPLAINED" size={150} />
            </Pop>
          </Row>
        ) : null}
        {frame >= tTwelve ? (
          <Row top={850}>
            <Pop at={tTwelve}>
              <div style={{ padding: "8px 26px", borderRadius: 14, background: "rgba(7,9,11,0.92)", border: `5px solid ${RED}`, ...mono(56, RED) }}>
                {String(Math.floor(secLeft / 60)).padStart(2, "0")}:{String(secLeft % 60).padStart(2, "0")}
              </div>
            </Pop>
          </Row>
        ) : null}
      </AbsoluteFill>
      {frame >= tGo ? <Sfx name="riser" at={tGo - 4} volume={0.4} /> : null}
    </Shot>
  );
};

export const ColdOpen: React.FC<SceneProps> = ({ c, D }) => {
  const tTv = c("one tv");
  const tEvery = c("every");
  return (
    <AbsoluteFill>
      <ShakeAt hits={[0, c("went dark")]} amount={34}>
        <Casino c={c} to={tTv} />
      </ShakeAt>
      <HotelRoom c={c} from={tTv} to={tEvery} />
      <Title c={c} from={tEvery} to={D} />
      <WhiteFlash at={0} hold={3} fade={12} />
      <Sfx name="boom" at={0} volume={0.8} />
      <WhiteFlash at={tEvery} hold={1} fade={8} />
    </AbsoluteFill>
  );
};

export { lerp };
