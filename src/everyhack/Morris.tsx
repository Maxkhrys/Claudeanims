import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, Sfx } from "../components";
import { Person } from "../shorts/cryptoKit";
import { big, Billboard, Box, type Cam, clamp01, lerp, Plane, Stage3D, Tag, useCam } from "../shorts/kit3d";
import { Alarm, Bubble, Check, CountUp, Crt, Glow, GREEN, Hit, Logo, mono, Mystery, Pill, Pop, RED, Row, type SceneProps, ShakeAt, Shot, Stamp, Worm, YELLOW } from "./kit";

/*
 * BLOCK 1: THE MORRIS WORM (1988), 55 s
 *   A 1988 rolls back from 2026; the whole internet is a tiny cluster
 *   B 60,000 computers, universities + military
 *   C 3D dorm room: Robert Morris, 23, Cornell, writes a little program
 *   D "just counting the internet"
 *   E one mistake in the code (highlighted line)
 *   F network: visit once -> copies again x2 x4 x8 -> machines choke (overload)
 *   G 6,000 crash, 1 in 10 of the internet
 *   H first person convicted under the new computer crime law
 *   I probation, community service, $10,000 fine
 *   J twist: professor at MIT
 *   K teaser: broke it by accident -> the next guy did it on purpose
 */

const MORRIS = { hair: "messy" as const, hairColor: "#5A3A22", glasses: true, outfit: "tee" as const, shirt: "#8A1F2A", skin: "#F0C6A4" };

/** Network of nodes on a circle-ish layout; used for the tiny internet and the worm spread. */
const NODES = new Array(18).fill(0).map((_, i) => {
  const ring = i < 6 ? 150 : 320;
  const a = (i < 6 ? i / 6 : (i - 6) / 12) * Math.PI * 2 + (i < 6 ? 0.3 : 0);
  return { x: 500 + Math.cos(a) * ring, y: 470 + Math.sin(a) * ring * 0.78 };
});
const EDGES: [number, number][] = [
  ...new Array(6).fill(0).map((_, i) => [i, (i + 1) % 6] as [number, number]),
  ...new Array(12).fill(0).map((_, i) => [6 + i, 6 + ((i + 1) % 12)] as [number, number]),
  ...new Array(12).fill(0).map((_, i) => [Math.floor(i / 2), 6 + i] as [number, number]),
];

const Network: React.FC<{ visitAt?: number; copyAt?: number[]; chokeAt?: number; scale?: number; tiny?: boolean }> = ({ visitAt = 1e9, copyAt = [], chokeAt = 1e9, scale = 1 }) => {
  const frame = useCurrentFrame();
  const visited = (i: number) => frame >= visitAt + i * 2;
  const level = copyAt.filter((t) => frame >= t).length;
  const choke = frame >= chokeAt;
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, transformOrigin: "500px 470px" }}>
      <svg width={1000} height={1000} style={{ position: "absolute", inset: 0 }}>
        {EDGES.map(([a, b], k) => (
          <line key={k} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke={choke ? "#5A1A1A" : visited(Math.max(a, b)) ? `${GREEN}88` : "#2E3944"} strokeWidth={5} />
        ))}
      </svg>
      {NODES.map((n, i) => {
        const hot = choke && random(`ck${i}`) < 0.85;
        const jitter = hot ? (random(`j${i}-${frame}`) - 0.5) * 8 : 0;
        return (
          <div key={i} style={{ position: "absolute", left: n.x - 42 + jitter, top: n.y - 34, width: 84, height: 64, borderRadius: 10, background: hot ? "#3A0B0B" : "#0C1115", border: `5px solid ${hot ? RED : visited(i) ? GREEN : "#3A4656"}`, boxShadow: visited(i) || hot ? `0 0 26px ${hot ? RED : GREEN}66` : "none" }}>
            {level > 0 && !choke ? (
              <div style={{ position: "absolute", left: 0, right: 0, top: 6, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
                {new Array(Math.min(8, Math.pow(2, level - 1))).fill(0).map((_, k) => (
                  <div key={k} style={{ width: 14, height: 10, borderRadius: 5, background: GREEN }} />
                ))}
              </div>
            ) : null}
            {hot ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...big(36, RED) }}>!!</div> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** The dorm room in 3D: desk with a CRT, Morris standing beside it (never inside it). */
const Dorm: React.FC<{ from: number; to: number; c: SceneProps["c"] }> = ({ from, to, c }) => {
  const frame = useCurrentFrame();
  const tName = c("robert");
  const tCornell = c("cornell");
  const tProg = c("program");
  const tSays = c("he says");
  const cam0 = useCam([
    { at: from, tx: 0, ty: -230, tz: 0, rx: -18, ry: 32, dist: 60 },
    { at: from + 1, tx: 0, ty: -230, tz: 0, rx: -14, ry: 20, dist: 200 },
    { at: tCornell - 6, tx: 60, ty: -250, tz: 0, rx: -10, ry: 4, dist: 300 },
    { at: tProg - 4, tx: 120, ty: -300, tz: -60, rx: -6, ry: -6, dist: 560 },
    { at: tSays, tx: 100, ty: -290, tz: -60, rx: -6, ry: 8, dist: 470 },
  ]);
  const cam: Cam = { ...cam0, ry: cam0.ry + 1.5 * Math.sin(frame / 32) };
  const typed = Math.max(0, Math.floor((frame - tProg + 10) / 2));
  const code = "worm.c\n> main() {\n>   find_hosts();\n>   copy_self();\n> }";
  return (
    <Shot from={from} to={to} enter="punch" whoosh push={0.03}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1A2230, #06080B 70%)" }} />
      <Stage3D cam={cam} cx={500} cy={660}>
        <Plane w={1000} h={760} t="rotateX(90deg)" style={{ background: "linear-gradient(#2E2A26, #24201C)" }} />
        <Plane w={1000} h={520} t="translate3d(0px, -260px, -380px)" style={{ background: "linear-gradient(#2B3A2E, #1F2A22)" }}>
          {/* pennant + posters, 1988 dorm */}
          <div style={{ position: "absolute", left: 90, top: 80, width: 0, height: 0, borderTop: "60px solid transparent", borderBottom: "60px solid transparent", borderLeft: "260px solid #B31B1B" }} />
          <div style={{ position: "absolute", left: 96, top: 122, ...big(32, "#FFFFFF"), textShadow: "none" }}>CORNELL</div>
          <div style={{ position: "absolute", right: 90, top: 70, width: 170, height: 230, background: "#2A2420", border: "8px solid #5A4A3A", display: "flex", alignItems: "center", justifyContent: "center", ...big(64, YELLOW) }}>1988</div>
        </Plane>
        <Plane w={760} h={520} t="translate3d(-500px, -260px, 0px) rotateY(90deg)" style={{ background: "linear-gradient(#243026, #1A231C)" }} />
        {/* desk with the computer on top */}
        <Box x={150} z={-200} w={420} d={180} h={150} top="#6A4B38" front="#57402F" side="#473426" />
        <Billboard pos={{ x: 150, y: -150, z: -210 }} cam={cam} w={260} h={250}>
          <Crt w={240}>
            <div style={{ position: "absolute", inset: 10, whiteSpace: "pre", ...mono(15, GREEN), lineHeight: 1.35 }}>{frame >= tProg - 10 ? code.slice(0, typed) : "> _"}</div>
          </Crt>
        </Billboard>
        {/* Morris stands to the left of the desk, clear of it */}
        <Billboard pos={{ x: -180, y: 0, z: -120 }} cam={cam} w={220} h={420}>
          <Person size={400} {...MORRIS} look={0.6} bob={1} arm={frame >= tProg ? 0.6 : 0} />
        </Billboard>
      </Stage3D>
      <Row top={60}>
        <Tag at={tName} until={tSays - 2} text="ROBERT MORRIS · 23" color={YELLOW} size={44} />
      </Row>
      <Row top={170}>
        <Pop at={tCornell} until={tSays - 2}>
          <Logo id="cornell" h={90} />
        </Pop>
      </Row>
      {frame >= tSays ? (
        <div style={{ position: "absolute", left: 150, top: 110 }}>
          <Pop at={tSays}>
            <Bubble text="I just want to count how big the internet is." w={480} size={36} />
          </Pop>
        </div>
      ) : null}
      {frame >= tProg ? <Sfx name="type" at={tProg - 10} volume={0.4} durationInFrames={50} /> : null}
    </Shot>
  );
};

/** Code close-up with the one bad line. */
const Code: React.FC<{ from: number; to: number; c: SceneProps["c"] }> = ({ from, to, c }) => {
  const frame = useCurrentFrame();
  const tMistake = c("mistake");
  const lines = ["for (host in internet) {", "  if (already_infected(host))", "    // copy anyway, just in case", "    copy_self(host);", "  count++;", "}"];
  return (
    <Shot from={from} to={to} whoosh push={0.06}>
      <Glow color={GREEN} y={45} a="22" />
      <div style={{ position: "absolute", left: 90, top: 180, width: 820, padding: 30, borderRadius: 22, background: "#06120B", border: `6px solid ${GREEN}55`, boxShadow: `0 0 60px ${GREEN}33` }}>
        <div style={{ ...mono(24, colors.dim), marginBottom: 16 }}>worm.c · 2 Nov 1988</div>
        {lines.map((l, i) => {
          const bad = i === 2 || i === 3;
          const lit = bad && frame >= tMistake;
          return (
            <div key={i} style={{ ...mono(36, lit ? "#FFFFFF" : GREEN), whiteSpace: "pre", padding: "6px 10px", borderRadius: 8, background: lit ? `${RED}AA` : "transparent", opacity: frame >= from + i * 3 ? 1 : 0 }}>
              {l}
            </div>
          );
        })}
      </div>
      {frame >= tMistake ? (
        <Row top={690}>
          <Stamp at={tMistake} text="ONE MISTAKE" size={110} rotate={-6} />
        </Row>
      ) : null}
    </Shot>
  );
};

/** Ten computers, one crashes: "one in ten on the entire internet". */
const OneInTen: React.FC<{ at: number; zoom: number }> = ({ at, zoom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const z = sp(frame, fps, zoom, springs.smooth);
  const grid = (ox: number, oy: number, s: number, seed: string) => (
    <div style={{ position: "absolute", left: ox, top: oy, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 * s, transform: `scale(${s})`, transformOrigin: "0 0" }}>
      {new Array(10).fill(0).map((_, i) => {
        const dead = i === Math.floor(random(seed) * 10) && frame >= at + 4;
        return (
          <div key={i} style={{ width: 130, height: 96, borderRadius: 12, background: dead ? "#3A0B0B" : "#0C1115", border: `6px solid ${dead ? RED : "#3A4656"}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(48, dead ? RED : GREEN) }}>
            {dead ? "X" : ":)"}
          </div>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{ transform: `scale(${lerp(1, 0.42, z)})`, transformOrigin: "500px 500px" }}>
      {grid(120, 380, 1, "main")}
      {z > 0.02
        ? [-1, 0, 1].flatMap((gy) =>
            [-1, 0, 1].map((gx) => (gx === 0 && gy === 0 ? null : <div key={`${gx}${gy}`} style={{ opacity: z }}>{grid(120 + gx * 820, 380 + gy * 330, 1, `g${gx}${gy}`)}</div>)),
          )
        : null}
    </AbsoluteFill>
  );
};

export const Morris: React.FC<SceneProps> = ({ c, D }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tInternet = c("internet");
  const tTiny = c("tiny");
  const tAbout = c("about");
  const tSixty = c("sixty");
  const tUni = c("universities");
  const tMil = c("military");
  const tRobert = c("robert");
  const tSays = c("he says");
  const tBut = c("but he");
  const tInstead = c("instead");
  const tCopies = c("copies");
  const tAgain = [c("again", 0), c("again", 1), c("again", 2)];
  const tChoke = c("choke");
  const tAround = c("around");
  const tCrash = c("crash");
  const tOneIn = c("one in ten");
  const tEntire = c("entire");
  const tMorris2 = c("morris", 1);
  const tFirst = c("first");
  const tConv = c("convicted");
  const tLaw = c("law");
  const tProb = c("probation");
  const tComm = c("community");
  const tFine = c("ten thousand dollar");
  const tAnd = c("and the twist");
  const tTwist = c("twist");
  const tProf = c("professor");
  const tMit = c("m.i.t.");
  const tMorris3 = c("morris", 2);
  const tAccident = c("accident");
  const tNext = c("the next");
  const tPurpose = c("purpose");

  const year = frame < tInternet - 6 ? Math.round(lerp(2026, 1988, clamp01(frame / 18))) : 1988;

  return (
    <ShakeAt hits={[tChoke, tCrash, tConv, tTwist]} amount={30}>
      {/* A: 1988, the internet is tiny */}
      <Shot from={0} to={tAbout} push={0.06}>
        <Glow color={GREEN} y={42} a="26" />
        <Row top={frame < tInternet ? 300 : 90}>
          <div style={{ ...big(frame < tInternet ? 300 : 120, YELLOW), transition: "none" }}>{year}</div>
        </Row>
        {frame >= tInternet ? (
          <AbsoluteFill style={{ transform: `scale(${frame >= tTiny ? lerp(1, 0.4, sp(frame, fps, tTiny, springs.snappy)) : 1})`, transformOrigin: "500px 520px" }}>
            <Network visitAt={tInternet} />
          </AbsoluteFill>
        ) : null}
        {frame >= tInternet ? (
          <Row top={850}>
            <Pop at={tInternet}>
              <Pill text="THE WHOLE INTERNET" color={GREEN} size={44} />
            </Pop>
          </Row>
        ) : null}
        {frame >= tTiny ? (
          <div style={{ position: "absolute", left: 600, top: 330 }}>
            <Pop at={tTiny} sound="pop">
              <Hit text="TINY" size={110} rotate={8} />
            </Pop>
          </div>
        ) : null}
        {frame < 3 ? <Sfx name="whoosh" at={0} volume={0.5} /> : null}
      </Shot>

      {/* B: 60,000 computers */}
      <Shot from={tAbout} to={tRobert} whoosh>
        <Glow color={GREEN} y={40} a="20" />
        <Row top={110}>
          <CountUp at={tSixty} to={60000} size={190} color={colors.text} dur={26} />
        </Row>
        <Row top={290}>
          <div style={{ ...mono(46, GREEN) }}>COMPUTERS. ON EARTH.</div>
        </Row>
        <div style={{ position: "absolute", left: 120, top: 390, width: 760, display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 10 }}>
          {new Array(40).fill(0).map((_, i) => (
            <div key={i} style={{ height: 50, borderRadius: 8, background: "#0C1115", border: `4px solid ${frame >= tSixty + i ? GREEN : "#2E3944"}`, opacity: frame >= tSixty + i * 0.6 ? 1 : 0.2 }} />
          ))}
        </div>
        <Row top={720} gap={30}>
          {frame >= tUni ? (
            <Pop at={tUni}>
              <Pill text="UNIVERSITIES" color={YELLOW} size={46} />
            </Pop>
          ) : null}
          {frame >= tMil ? (
            <Pop at={tMil}>
              <Pill text="MILITARY" color="#8FD16A" size={46} />
            </Pop>
          ) : null}
        </Row>
      </Shot>

      {/* C + D: the dorm room */}
      <Dorm from={tRobert} to={tBut} c={c} />

      {/* E: the one mistake */}
      <Code from={tBut} to={tInstead} c={c} />

      {/* F: visit once... then copies again and again until they choke */}
      <Shot from={tInstead} to={tAround} enter="punch" whoosh push={0.04}>
        <Glow color={frame >= tChoke ? RED : GREEN} y={45} a="26" />
        <Network visitAt={tInstead + 6} copyAt={[tCopies, ...tAgain]} chokeAt={tChoke} scale={0.92} />
        <Row top={60}>
          {frame < tCopies ? (
            <Pill text="VISIT EACH COMPUTER ONCE" color={GREEN} size={40} />
          ) : frame < tChoke ? (
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <Worm size={150} />
              <div style={{ ...big(120, GREEN) }}>x{Math.pow(2, Math.min(3, tAgain.filter((t) => frame >= t).length + 1))}</div>
            </div>
          ) : (
            <Stamp at={tChoke} text="OVERLOAD" size={110} rotate={-4} />
          )}
        </Row>
        {tAgain.map((t, i) => (frame >= t ? <Sfx key={i} name="pop" at={t} volume={0.6} /> : null))}
        {frame >= tChoke ? <Sfx name="crash" at={tChoke} volume={0.6} /> : null}
        <Alarm from={tChoke} to={tAround} />
      </Shot>

      {/* G: 6,000 crash, one in ten */}
      <Shot from={tAround} to={tMorris2} whoosh>
        <Glow color={RED} y={40} a="26" />
        <Row top={120}>
          <CountUp at={tAround + 6} to={6000} size={200} color={RED} dur={20} />
        </Row>
        <Row top={310}>
          {frame >= tCrash ? (
            <Pop at={tCrash} sound="slam">
              <div style={{ ...big(90, colors.text) }}>COMPUTERS CRASH</div>
            </Pop>
          ) : null}
        </Row>
        {frame >= tOneIn - 4 ? <OneInTen at={tOneIn} zoom={tEntire} /> : null}
        {frame >= tOneIn ? (
          <Row top={860}>
            <Pop at={tOneIn}>
              <Hit text={frame >= tEntire ? "1 IN 10 OF THE INTERNET" : "1 IN 10"} size={70} color={YELLOW} />
            </Pop>
          </Row>
        ) : null}
      </Shot>

      {/* H: first person convicted */}
      <Shot from={tMorris2} to={tProb} whoosh>
        <Glow color={YELLOW} y={40} a="22" />
        <div style={{ position: "absolute", left: 140, top: 300 }}>
          <Person size={430} {...MORRIS} outfit="suit" shirt="#2A3442" look={0.3} bob={0.6} />
        </div>
        {/* gavel */}
        <div style={{ position: "absolute", left: 560, top: 360, transform: `rotate(${frame >= tConv ? lerp(-40, 10, sp(frame, fps, tConv, springs.slam)) : -40}deg)`, transformOrigin: "60px 200px" }}>
          <div style={{ width: 200, height: 80, borderRadius: 18, background: "#7A4A2A", border: "6px solid #0B0C10" }} />
          <div style={{ marginLeft: 85, width: 30, height: 220, background: "#5A3A22", border: "6px solid #0B0C10" }} />
        </div>
        <div style={{ position: "absolute", left: 520, top: 640, width: 360, height: 40, borderRadius: 10, background: "#5A3A22", border: "6px solid #0B0C10" }} />
        <Row top={110}>
          {frame >= tFirst ? (
            <Pop at={tFirst}>
              <Pill text="THE FIRST EVER" color={YELLOW} size={50} />
            </Pop>
          ) : null}
        </Row>
        {frame >= tConv ? (
          <Row top={210}>
            <Stamp at={tConv} text="CONVICTED" size={120} rotate={-6} />
          </Row>
        ) : null}
        {frame >= tLaw ? (
          <Row top={760}>
            <Pop at={tLaw}>
              <div style={{ padding: "14px 26px", borderRadius: 14, background: "#E8E0CC", border: "5px solid #0B0C10", ...mono(30, "#0B0C10"), textAlign: "center" }}>COMPUTER FRAUD AND ABUSE ACT · 1986</div>
            </Pop>
          </Row>
        ) : null}
        {frame >= tConv ? <Sfx name="slam" at={tConv} volume={0.7} /> : null}
      </Shot>

      {/* I: the sentence */}
      <Shot from={tProb} to={tAnd} whoosh>
        <Glow color={YELLOW} y={50} a="20" />
        <Row top={120}>
          <div style={{ ...mono(40, colors.dim) }}>THE SENTENCE</div>
        </Row>
        <div style={{ position: "absolute", left: 90, top: 220, width: 820, display: "flex", flexDirection: "column", gap: 34, alignItems: "center" }}>
          <Pop at={tProb} from="left" sound="whoosh">
            <Pill text="3 YEARS PROBATION" color={colors.text} size={58} />
          </Pop>
          {frame >= tComm ? (
            <Pop at={tComm} from="right" sound="whoosh">
              <Pill text="400 HOURS COMMUNITY SERVICE" color={colors.text} size={46} />
            </Pop>
          ) : null}
          {frame >= tFine ? (
            <Pop at={tFine} sound="slam">
              <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
                <CountUp at={tFine} to={10000} prefix="$" size={170} color={YELLOW} dur={18} />
                <div style={{ ...big(80, colors.text) }}>FINE</div>
              </div>
            </Pop>
          ) : null}
        </div>
        {frame >= tFine + 6 ? <Sfx name="kaching" at={tFine + 6} volume={0.6} /> : null}
      </Shot>

      {/* J: the twist, professor at MIT */}
      <Shot from={tAnd} to={tMorris3} whoosh push={0.05}>
        <Glow color="#A31F34" y={45} a="30" />
        {frame < tProf - 4 ? (
          <Row top={340}>
            <Pop at={tTwist} sound="boom">
              <Hit text="THE TWIST?" size={150} color={YELLOW} rotate={-3} />
            </Pop>
          </Row>
        ) : (
          <>
            {/* chalkboard */}
            <div style={{ position: "absolute", left: 360, top: 250, width: 540, height: 330, borderRadius: 14, background: "#1F3A2C", border: "14px solid #6A4B38" }}>
              <div style={{ position: "absolute", left: 30, top: 30, ...mono(30, "#E6E6E6"), whiteSpace: "pre", lineHeight: 1.5 }}>{"LECTURE 1:\nHOW NETWORKS FAIL\n\n6.824 Distributed\nSystems"}</div>
            </div>
            <div style={{ position: "absolute", left: 120, top: 330 }}>
              <Person size={430} {...MORRIS} outfit="suit" shirt="#3A4656" look={0.8} bob={0.8} arm={0.8} hairColor="#8A8B8C" />
            </div>
            <Row top={110}>
              <Pop at={tProf - 4}>
                <Pill text="PROFESSOR" color={YELLOW} size={56} />
              </Pop>
            </Row>
            {frame >= tMit ? (
              <Row top={650}>
                <Pop at={tMit} sound="slam">
                  <Logo id="mit" h={150} />
                </Pop>
              </Row>
            ) : null}
          </>
        )}
      </Shot>

      {/* K: teaser */}
      <Shot from={tMorris3} to={D} whoosh push={0.05}>
        <Glow color={frame >= tNext ? RED : GREEN} y={45} a="26" />
        {frame < tNext ? (
          <>
            <div style={{ position: "absolute", left: 300, top: 220 }}>
              <svg width={400} height={400} viewBox="-100 -100 200 200">
                <circle r={90} fill="#0C1115" stroke={GREEN} strokeWidth={6} />
                <ellipse rx={40} ry={90} fill="none" stroke={GREEN} strokeWidth={4} />
                <line x1={-90} y1={0} x2={90} y2={0} stroke={GREEN} strokeWidth={4} />
                <line x1={-80} y1={-42} x2={80} y2={-42} stroke={GREEN} strokeWidth={4} />
                <line x1={-80} y1={42} x2={80} y2={42} stroke={GREEN} strokeWidth={4} />
                {frame >= tMorris3 + 20 ? <path d="M-20,-92 L6,-30 L-14,0 L14,40 L-4,92" stroke={RED} strokeWidth={10} fill="none" /> : null}
              </svg>
            </div>
            {frame >= tMorris3 + 20 ? <Sfx name="crack" at={tMorris3 + 20} volume={0.7} /> : null}
            <Row top={690}>
              {frame >= tAccident ? (
                <Pop at={tAccident}>
                  <Hit text="BY ACCIDENT" size={110} color={YELLOW} />
                </Pop>
              ) : null}
            </Row>
          </>
        ) : (
          <>
            <Row top={200}>
              <Pop at={tNext} sound="boom">
                <Mystery size={480} color={RED} />
              </Pop>
            </Row>
            <Row top={730}>
              {frame >= tPurpose ? (
                <Pop at={tPurpose} sound="slam">
                  <Hit text="ON PURPOSE" size={120} color={RED} />
                </Pop>
              ) : null}
            </Row>
          </>
        )}
      </Shot>
      {/* little nod to the blob cast so Morris' world feels like the channel */}
      {frame < 0 ? <BlobCharacter color="#000" /> : null}
      {frame < 0 ? <Check size={1} /> : null}
    </ShakeAt>
  );
};
