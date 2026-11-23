import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../../theme";
import { sp } from "../../lib/timing";
import { OnionLogo, SeizedStamp, Sfx } from "../../components";
import { big, clamp01, lerp } from "../kit3d";
import { Coin, Cracks, Crowd, Disintegrate, DotMap, easeInOut, easeOut, GOLD, GownWoman, MoneyRain, PlaneShape, ShakeAt, Shapes, TEAL, Tomb, Vault, WantedStamp } from "../cryptoKit";
import { CountUp, CW, CX, Glow, L0, mono, Pill, Pop, Row, type SceneProps, Shot, Slam, StageBackdrop } from "./common";

/* ================================================================== #1 ONECOIN / RUJA IGNATOVA */

const ORANGE = "#F7931A";

/** Full-frame Wembley stage behind the canvas while she is on stage (fireworks -> "one problem"). */
export const OneCoinBackdrop: React.FC<SceneProps> = ({ c }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tFire = c("fireworks");
  const tPacked = c("packed");
  const tProblem = c("just one problem");
  if (frame < tFire || frame >= tProblem) return null;
  const crowdScale = (0.22 * height) / 330;
  return (
    <AbsoluteFill style={{ opacity: clamp01((frame - tFire) / 4) }}>
      <StageBackdrop at={tFire} bursts={[tFire - 6, tFire + 2, tFire + 10, tFire + 20, tPacked + 12, tPacked + 30]} intensity={1.05} />
      <div style={{ position: "absolute", left: -40, bottom: 0, width: width + 80, height: 330 * crowdScale }}>
        <div style={{ transform: `scale(${crowdScale})`, transformOrigin: "0 100%", position: "absolute", left: 0, bottom: 0 }}>
          <Crowd w={(width + 80) / crowdScale} rows={3} cheer={frame >= tPacked ? 1 : 0.4} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Split-flap text that settles one letter at a time from `at`. */
const Flap: React.FC<{ text: string; at: number; size: number; color?: string }> = ({ text, at, size, color = "#FFE7A8" }) => {
  const frame = useCurrentFrame();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ→0123456789";
  return (
    <div style={{ display: "flex", gap: size * 0.08 }}>
      {text.split("").map((ch, i) => {
        const settle = at + i * 1.5;
        const shown = frame >= settle || ch === " " ? ch : chars[Math.floor(random(`fl-${i}-${frame}`) * chars.length)];
        return (
          <div key={i} style={{ width: size * 0.62, height: size * 1.05, borderRadius: 6, background: ch === " " ? "transparent" : "#14181D", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: size * 0.8, color, position: "relative" }}>
            {shown}
            {ch !== " " ? <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "#05070A" }} /> : null}
          </div>
        );
      })}
    </div>
  );
};

export const OneCoin: React.FC<SceneProps & { landscape: boolean }> = ({ c, start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tLondon = c("london");
  const tWembley = c("wembley");
  const tJune = c("june twenty sixteen");
  const tFire = c("fireworks");
  const tPacked = c("packed");
  const tWoman = c("and a woman");
  const tWalks = c("walks out");
  const tDoctor = c("doctor");
  const tRuja = c("ruja");
  const tQueen = c("cryptoqueen");
  const tTells = c("she tells");
  const tOneCoin = c("onecoin");
  const tKill = c("kill");
  const tProblem = c("just one problem");
  const tDidnt = c("onecoin didn't");
  const tExist = c("exist");
  const tNoReal = c("no real");
  const tNumbers = c("just numbers");
  const tMore = c("more than");
  const tPeople = c("million people");
  const tOver = c("over four");
  const tThen = c("then in october");
  const tBoards = c("boards");
  const tAthens = c("athens");
  const tAnd = c("and is never");
  const tNever = c("never seen");
  const tToday = c("today");
  const tFbi = c("fbi's");
  const tReward = c("reward");
  const tFive = c("five million");
  const tSome = c("some say");
  const tMurdered = c("murdered");
  const tOthers = c("others");
  const tBillions = c("on billions");
  const tNobody = c("nobody knows");

  // woman's position on stage: walks in from the right, then centre
  const walkP = easeInOut((frame - (tWalks - 14)) / 40);
  const womanX = lerp(820, CX, walkP);
  const walking = frame >= tWalks - 14 && frame < tWalks + 26;

  return (
    <ShakeAt hits={[tKill, tExist, tFbi]} amount={26}>
      {/* A: London, Wembley Arena, June 2016 */}
      <Shot from={start} to={tFire} push={0.06}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0B1530 0%, #1A0A28 60%, #07090B 100%)" }} />
        {[-1, 1].map((sd) => (
          <div key={sd} style={{ position: "absolute", left: CX - 60 + sd * 200, top: 200, width: 120, height: 700, background: "linear-gradient(0deg, rgba(255,240,200,0.4), rgba(255,240,200,0))", clipPath: "polygon(40% 100%, 60% 100%, 100% 0, 0 0)", transformOrigin: "50% 100%", transform: `rotate(${sd * 18 + Math.sin(frame / 12 + sd) * 10}deg)` }} />
        ))}
        <svg style={{ position: "absolute", left: 80, top: 520 }} width={800} height={460} viewBox="0 0 800 460">
          <path d="M20 440 L20 230 Q400 60 780 230 L780 440 Z" fill="#20283A" stroke="#3A4660" strokeWidth={6} />
          <path d="M60 440 L60 250 Q400 110 740 250 L740 440 Z" fill="#2A3448" />
          {new Array(9).fill(0).map((_, i) => (
            <rect key={i} x={110 + i * 66} y={300} width={36} height={110} rx={6} fill={random(`wa-${i}-${Math.floor(frame / 10)}`) > 0.3 ? "#FFE7A8" : "#3A4660"} />
          ))}
          <rect x={210} y={180} width={380} height={70} rx={10} fill={colors.red} />
          <text x={400} y={230} textAnchor="middle" fontFamily={fonts.display} fontSize={52} fill="#fff" letterSpacing={3}>
            WEMBLEY ARENA
          </text>
        </svg>
        <Row top={215} gap={14}>
          <Pop at={tLondon} style={{ position: "relative" }}>
            <Pill text="LONDON" color={colors.text} size={44} />
          </Pop>
          {frame >= tJune ? (
            <Pop at={tJune} style={{ position: "relative" }}>
              <Pill text="JUNE 2016" color={GOLD} filled size={44} />
            </Pop>
          ) : null}
        </Row>
        {frame >= tWembley ? <Sfx name="crowd" at={tWembley} volume={0.4} /> : null}
      </Shot>

      {/* B-E: on stage (the full-frame stage backdrop is drawn behind the canvas) */}
      <Shot from={tFire} to={tProblem} push={0.03} enter="none">
        <Sfx name="firework" at={tFire - 10} volume={0.8} />
        {frame >= tPacked ? <Sfx name="crowd" at={tPacked} volume={0.8} /> : null}
        {/* LED screen with a giant coin */}
        <div style={{ position: "absolute", left: CX - 150, top: 230, opacity: frame >= tTells ? 0 : 1 }}>
          <div style={{ transform: `scale(${1 + 0.05 * Math.sin(frame / 6)})` }}>
            <Coin size={300} label="1" spin={Math.sin(frame / 18) * 25} />
          </div>
        </div>
        {/* the woman */}
        {frame >= tWoman - 2 && frame < tTells ? (
          <div style={{ position: "absolute", left: womanX - 192, top: 380 }}>
            <div style={{ position: "absolute", left: 192 - 260, top: 640, width: 520, height: 110, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,245,225,0.7), rgba(255,245,225,0) 70%)" }} />
            <div style={{ transform: "scale(1.6)", transformOrigin: "0 0" }}>
              <GownWoman wave={walking ? 0 : frame / 14} walk={walking ? frame / 18 : 0} armUp={!walking} crown={frame >= tQueen} />
            </div>
          </div>
        ) : null}
        {frame >= tQueen && frame < tQueen + 18
          ? new Array(12).fill(0).map((_, i) => {
              const t = (frame - tQueen) / 18;
              const a = (i / 12) * Math.PI * 2;
              return <div key={i} style={{ position: "absolute", left: CX + Math.cos(a) * 160 * easeOut(t) - 10, top: 430 + Math.sin(a) * 160 * easeOut(t) - 10, width: 20, height: 20, background: GOLD, transform: "rotate(45deg)", opacity: 1 - t }} />;
            })
          : null}
        {frame >= tQueen ? <Sfx name="kaching" at={tQueen} volume={0.6} /> : null}
        {frame >= tRuja && frame < tTells ? (
          <Slam at={tRuja} style={{ left: L0, width: CW, top: 215, textAlign: "center" }}>
            <div style={{ display: "inline-block", padding: "8px 30px", borderRadius: 20, background: "rgba(7,9,11,0.9)", border: `6px solid ${colors.red}` }}>
              <div style={{ ...big(110, colors.text) }}>DR. RUJA IGNATOVA</div>
            </div>
          </Slam>
        ) : null}
        {frame >= tQueen && frame < tTells ? (
          <Pop at={tQueen} style={{ left: L0, width: CW, top: 990, textAlign: "center" }}>
            <div style={{ display: "inline-block", padding: "6px 30px", borderRadius: 18, background: GOLD }}>
              <div style={{ ...big(96, colors.bg), textShadow: "none" }}>"THE CRYPTOQUEEN"</div>
            </div>
          </Pop>
        ) : null}
        {/* E: OneCoin will kill Bitcoin */}
        {frame >= tTells ? (
          <>
            <div style={{ position: "absolute", left: 90, top: 520 }}>
              <div style={{ transform: "scale(1.15)", transformOrigin: "0 0" }}>
                <GownWoman wave={frame / 14} crown />
              </div>
            </div>
            <Pop at={tTells + 4} style={{ left: 330, top: 260 }}>
              <div style={{ position: "relative", padding: "18px 28px", borderRadius: 30, background: "#fff", maxWidth: 520 }}>
                <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 46, color: "#14181D", lineHeight: 1.05 }}>{frame >= tKill ? "IT WILL KILL BITCOIN!" : "MY COIN, ONECOIN..."}</div>
                <div style={{ position: "absolute", left: 40, bottom: -28, width: 0, height: 0, borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderTop: "30px solid #fff" }} />
              </div>
            </Pop>
            {(() => {
              const hit = frame >= tKill ? easeOut((frame - tKill + 8) / 8) : 0;
              const charge = frame >= tKill - 8 ? easeInOut((frame - tKill + 8) / 8) : 0;
              return (
                <>
                  <div style={{ position: "absolute", left: lerp(380, 520, charge), top: 560 }}>
                    {frame >= tOneCoin ? <Coin size={200} label="1" spin={(frame - tOneCoin) * 6} /> : null}
                  </div>
                  <div style={{ position: "absolute", left: 660, top: 560, transform: `translate(${hit * 60}px, ${hit * -20}px) rotate(${hit * 25}deg)` }}>
                    <Coin size={200} label="₿" color={ORANGE} edge="#A85E00" textColor="#fff" />
                    <Cracks x={100} y={100} at={tKill} w={200} h={200} seed="btc" color="#2A1600" />
                  </div>
                  {frame >= tKill ? <Sfx name="crack" at={tKill} volume={0.9} /> : null}
                  {frame >= tKill ? <Sfx name="slam" at={tKill} volume={0.7} /> : null}
                </>
              );
            })()}
            {frame >= tKill ? (
              <Slam at={tKill + 4} style={{ left: 400, top: 820 }} rotate={-5} sound="none">
                <div style={{ display: "inline-block", padding: "4px 24px", borderRadius: 16, background: GOLD }}>
                  <div style={{ ...big(84, colors.bg), textShadow: "none" }}>"BITCOIN KILLER"</div>
                </div>
              </Slam>
            ) : null}
          </>
        ) : null}
      </Shot>

      {/* F: there was just one problem (record scratch, freeze) */}
      <Shot from={tProblem} to={tDidnt} push={0.08} enter="none">
        <Sfx name="glitch" at={tProblem} volume={0.8} />
        <AbsoluteFill style={{ background: "#0B0D10" }} />
        <div style={{ position: "absolute", left: 90, top: 520, filter: "grayscale(1) brightness(0.6)" }}>
          <div style={{ transform: "scale(1.15)", transformOrigin: "0 0" }}>
            <GownWoman crown />
          </div>
        </div>
        <div style={{ position: "absolute", left: L0, width: CW, top: 240, textAlign: "center" }}>
          <div style={{ ...big(120, colors.text) }}>JUST ONE</div>
          <div style={{ ...big(200, colors.amber) }}>PROBLEM</div>
        </div>
        <Pop at={tProblem + 6} style={{ left: 520, top: 640 }}>
          <svg width={260} height={230} viewBox="0 0 100 90">
            <polygon points="50,4 96,86 4,86" fill={colors.amber} stroke="#0B0D10" strokeWidth={4} strokeLinejoin="round" />
            <rect x={45} y={30} width={10} height={32} rx={4} fill="#0B0D10" />
            <circle cx={50} cy={73} r={6} fill="#0B0D10" />
          </svg>
        </Pop>
      </Shot>

      {/* G1: OneCoin didn't exist */}
      <Shot from={tDidnt} to={tNoReal} push={0.05}>
        <div style={{ position: "absolute", left: CX - 210, top: 360 }}>
          <Disintegrate w={420} h={420} at={tExist} cols={12} rows={12} dur={24} seed="oc" render={() => <Coin size={420} label="1" spin={Math.min(180, (frame - tDidnt) * 8) % 360} />} />
        </div>
        {frame >= tExist ? <Sfx name="dissolve" at={tExist} volume={0.8} /> : null}
        <SeizedStamp at={tExist + 4} text="DIDN'T EXIST" color={colors.red} fontSize={110} rotate={-8} style={{ left: 170, top: 860 }} />
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...big(110, colors.text) }}>ONECOIN</div>
        </div>
      </Shot>

      {/* G2: no real blockchain */}
      <Shot from={tNoReal} to={tNumbers} push={0.05}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...big(120, colors.text) }}>NO REAL</div>
          <div style={{ ...big(130, colors.red) }}>BLOCKCHAIN</div>
        </div>
        <div style={{ position: "absolute", left: 90, top: 600, width: 780, height: 220 }}>
          {[0, 1, 2, 3].map((i) => {
            const brk = clamp01((frame - tNoReal - 10 - i * 3) / 14);
            const dir = i % 2 ? 1 : -1;
            return (
              <React.Fragment key={i}>
                <div style={{ position: "absolute", left: i * 200, top: 30, width: 160, height: 160, borderRadius: 20, background: "#141C26", border: `6px solid ${TEAL}`, transform: `translate(${(i - 1.5) * brk * 60}px, ${brk * brk * 260 * (0.5 + i * 0.2)}px) rotate(${dir * brk * 40}deg)`, opacity: 1 - brk * 0.6, display: "flex", alignItems: "center", justifyContent: "center", ...mono(30, TEAL) }}>
                  #{1041 + i}
                </div>
                {i < 3 ? <div style={{ position: "absolute", left: i * 200 + 160, top: 100, width: 40, height: 20, borderRadius: 10, background: "#8A949E", opacity: 1 - brk * 3 }} /> : null}
              </React.Fragment>
            );
          })}
        </div>
        {frame >= tNoReal + 10 ? <Sfx name="crash" at={tNoReal + 10} volume={0.6} /> : null}
      </Shot>

      {/* G3: just numbers on a screen */}
      <Shot from={tNumbers} to={tMore} push={0.05}>
        <div style={{ position: "absolute", left: 140, top: 300, width: 680, height: 440, borderRadius: 22, background: "#0B0F14", border: "16px solid #2A3440", overflow: "hidden" }}>
          <div style={{ padding: 24, fontFamily: fonts.mono, fontSize: 34, color: colors.text }}>
            {[
              ["ACCOUNT", "COINS"],
              ["#20118", "12,500"],
              ["#20119", "48,000"],
              ["#20120", "150,000"],
              ["#20121", "9,999,999"],
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 6px", borderBottom: "2px solid #1E2A32", color: i === 0 ? colors.dim : colors.text, opacity: frame >= tNumbers + i * 4 ? 1 : 0 }}>
                <span>{r[0]}</span>
                <span style={{ color: i === 0 ? colors.dim : GOLD }}>
                  {i === 4 ? r[1].slice(0, Math.max(0, Math.min(r[1].length, Math.floor((frame - tNumbers - 16) / 2)))) : r[1]}
                  {i === 4 && Math.floor(frame / 8) % 2 ? "▌" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", left: 100, top: 740, width: 760, height: 26, borderRadius: "0 0 20px 20px", background: "#3A4652" }} />
        {frame >= tNumbers + 16 ? <Sfx name="type" at={tNumbers + 16} volume={0.6} durationInFrames={20} /> : null}
        <Pop at={tNumbers + 8} style={{ left: L0, width: CW, top: 860, textAlign: "center" }}>
          <Pill text="TYPED IN. NOT MINED." color={colors.amber} filled size={48} />
        </Pop>
      </Shot>

      {/* H1: 3.5 million people bought in */}
      <Shot from={tMore} to={tOver} push={0.05}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          {frame >= tPeople - 10 ? <CountUp at={tPeople - 10} to={3500000} dur={30} suffix="+" size={160} color={colors.text} /> : <div style={{ ...big(160, colors.text) }}>...</div>}
          <div style={{ ...mono(32), marginTop: 6 }}>PEOPLE BOUGHT IN</div>
        </div>
        <div style={{ position: "absolute", left: 110, top: 480, width: 740, display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 10 }}>
          {new Array(112).fill(0).map((_, i) => {
            const s = clamp01((frame - tMore - i * 0.4) / 5);
            return <div key={i} style={{ height: 52, borderRadius: "40% 40% 10px 10px", background: ["#5B86C4", "#C8B08A", "#9AC8B0", "#B59AC8", "#C89A9A"][i % 5], transform: `scale(${s})` }} />;
          })}
        </div>
      </Shot>

      {/* H2: over four billion dollars */}
      <Shot from={tOver} to={tThen} push={0.05}>
        <MoneyRain w={1080} h={1300} from={tOver} n={24} />
        <div style={{ position: "absolute", left: L0, width: CW, top: 500, textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "16px 36px", borderRadius: 24, background: "rgba(7,9,11,0.9)", border: `6px solid ${GOLD}` }}>
            <CountUp at={tOver} to={4000000000} dur={28} prefix="$" suffix="+" size={130} color={GOLD} />
          </div>
        </div>
        {frame >= tOver + 20 ? <Sfx name="kaching" at={tOver + 20} volume={0.7} /> : null}
      </Shot>

      {/* I: Oct 2017, Ryanair from Sofia to Athens */}
      <Shot from={tThen} to={tAnd} push={0.04}>
        <Row top={215}>
          <Pop at={tThen + 4} style={{ position: "relative" }}>
            <Pill text="25 OCTOBER 2017" color={colors.text} size={44} />
          </Pop>
        </Row>
        <div style={{ position: "absolute", left: 80, top: 330, width: 800, padding: 26, borderRadius: 20, background: "#0B0E12", border: "6px solid #2A3440" }}>
          <div style={{ ...mono(28, colors.amber) }}>DEPARTURES · SOFIA</div>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            <Flap text="ATHENS" at={tBoards - 4} size={64} />
            <Flap text="RYANAIR" at={tBoards + 6} size={64} color="#9FD3FF" />
            <Flap text={frame >= tAthens + 6 ? "DEPARTED" : "BOARDING"} at={frame >= tAthens + 6 ? tAthens + 6 : tBoards + 14} size={64} color={frame >= tAthens + 6 ? colors.red : colors.green} />
          </div>
        </div>
        {frame >= tBoards - 4 ? <Sfx name="tick" at={tBoards - 4} volume={0.5} durationInFrames={30} /> : null}
        {(() => {
          const p = easeInOut((frame - tAthens) / 40);
          if (frame < tAthens) return null;
          return (
            <>
              <Sfx name="plane" at={tAthens} volume={0.8} />
              <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1300}>
                <g transform={`translate(${lerp(120, 900, p)} ${lerp(1060, 760, p)}) rotate(-18) scale(${lerp(1, 1.6, p)})`}>
                  <PlaneShape size={220} color="#E8EEF4" />
                </g>
              </svg>
            </>
          );
        })()}
      </Shot>

      {/* J: and is never seen again (she breaks into pixels again) */}
      <Shot from={tAnd} to={tToday} push={0.06}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #2A4A7A 0%, #8AA8D0 100%)", opacity: 0.55 }} />
        {new Array(6).fill(0).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: ((i * 190 + (frame - tAnd) * (2 + i * 0.4)) % 1300) - 200, top: 260 + i * 140, width: 300, height: 90, borderRadius: 60, background: "rgba(255,255,255,0.75)" }} />
        ))}
        <div style={{ position: "absolute", left: CX - 192, top: 330 }}>
          <Disintegrate
            w={384}
            h={768}
            at={tNever + 6}
            cols={12}
            rows={22}
            dur={30}
            seed="never"
            render={() => (
              <div style={{ transform: "scale(1.6)", transformOrigin: "0 0" }}>
                <GownWoman wave={frame / 14} />
              </div>
            )}
          />
        </div>
        {frame >= tNever + 6 ? <Sfx name="dissolve" at={tNever + 6} volume={0.9} /> : null}
        <Slam at={tNever + 10} style={{ left: L0, width: CW, top: 230, textAlign: "center" }} sound="boom">
          <div style={{ ...big(120, colors.text) }}>NEVER SEEN</div>
          <div style={{ ...big(150, colors.red) }}>AGAIN</div>
        </Slam>
      </Shot>

      {/* K: FBI Ten Most Wanted, up to $5 million */}
      <Shot from={tToday} to={tSome} push={0.04}>
        <div style={{ position: "absolute", left: 170, top: 240, width: 620, padding: "26px 30px 30px", borderRadius: 8, background: "#F1EDE4", boxShadow: "0 30px 70px rgba(0,0,0,0.6)", transform: "rotate(-1.5deg)", textAlign: "center" }}>
          <div style={{ ...big(60, "#14181D"), textShadow: "none" }}>FBI · TEN MOST WANTED</div>
          <div style={{ height: 5, background: colors.red, margin: "12px 0 18px" }} />
          <div style={{ width: 300, height: 330, margin: "0 auto", background: "#D9D2C2", border: "6px solid #14181D", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: -30, top: 10, transform: "scale(1.5)", transformOrigin: "0 0" }}>
              <GownWoman armUp={false} />
            </div>
          </div>
          <div style={{ ...big(64, "#14181D"), textShadow: "none", marginTop: 16 }}>RUJA IGNATOVA</div>
          <div style={{ ...mono(26, "#5A6470"), marginTop: 10 }}>REWARD: UP TO</div>
          {frame >= tFive ? <CountUp at={tFive} to={5000000} dur={20} prefix="$" size={96} color={colors.red} /> : <div style={{ ...big(96, colors.red) }}>$?</div>}
        </div>
        <div style={{ position: "absolute", left: 470, width: 500, top: 560, display: "flex", justifyContent: "center", transform: "scale(0.5)", transformOrigin: "50% 0" }}>
          <WantedStamp at={tFbi} />
        </div>
        {frame >= tReward ? <Sfx name="kaching" at={tFive + 18} volume={0.6} /> : null}
      </Shot>

      {/* L: murdered? or living on billions? */}
      <Shot from={tSome} to={tNobody} push={0.04}>
        <div style={{ position: "absolute", left: 80, top: 260, width: 390, height: 640, borderRadius: 26, background: "linear-gradient(180deg, #0A1424, #05080D)", border: "6px solid #3A4652", overflow: "hidden", opacity: frame >= tMurdered - 6 ? 1 : 0.15 }}>
          <div style={{ position: "absolute", left: 90, top: 210 }}>
            <Tomb w={210} text={["?"]} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", ...big(70, colors.text) }}>MURDERED?</div>
        </div>
        <div style={{ position: "absolute", left: 490, top: 260, width: 390, height: 640, borderRadius: 26, background: "linear-gradient(180deg, #48C6EF, #F7D794 70%, #E8B86A)", border: `6px solid ${GOLD}`, overflow: "hidden", opacity: frame >= tOthers ? 1 : 0.15 }}>
          <div style={{ position: "absolute", left: 250, top: 50, width: 90, height: 90, borderRadius: "50%", background: "#FFF3B0", boxShadow: "0 0 60px #FFF3B0" }} />
          <svg style={{ position: "absolute", left: 20, top: 150 }} width={160} height={300} viewBox="0 0 160 300">
            <path d="M80 300 Q70 180 90 80" stroke="#7A5230" strokeWidth={14} fill="none" />
            <path d="M90 80 Q40 60 10 90 M90 80 Q140 50 158 90 M90 80 Q60 20 30 30 M90 80 Q120 20 150 34" stroke="#2E8B57" strokeWidth={16} fill="none" strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", left: 180, top: 130, transform: "scale(0.66)", transformOrigin: "0 0" }}>
            <GownWoman wave={frame / 14} silhouette={false} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", ...big(60, "#14181D"), textShadow: "none", whiteSpace: "normal" }}>
            {frame >= tBillions ? "LIVING ON BILLIONS?" : "LIVING SOMEWHERE?"}
          </div>
        </div>
        {frame >= tMurdered - 6 ? <Sfx name="heartbeat" at={tMurdered - 6} volume={0.8} /> : null}
        {frame >= tOthers ? <Sfx name="kaching" at={tOthers} volume={0.5} /> : null}
        <div style={{ position: "absolute", left: L0, width: CW, top: 950, textAlign: "center", ...mono(26, colors.dim) }}>UNCONFIRMED THEORIES</div>
      </Shot>

      {/* M: nobody knows */}
      <Shot from={tNobody} to={end} push={0.08} enter="fade">
        {new Array(20).fill(0).map((_, i) => {
          const y = ((frame - tNobody) * (4 + (i % 4)) + random(`qy-${i}`) * 900) % 1000 + 200;
          return <div key={i} style={{ position: "absolute", left: 80 + random(`qx-${i}`) * 780, top: y, ...big(60 + (i % 3) * 30, "rgba(255,59,59,0.35)") }}>?</div>;
        })}
        <div style={{ position: "absolute", left: L0, width: CW, top: 300, textAlign: "center" }}>
          <div style={{ ...big(420, colors.red), textShadow: `0 0 80px ${colors.red}`, transform: `scale(${1 + 0.04 * Math.sin(frame / 5)})` }}>?</div>
          <div style={{ ...big(120, colors.text), marginTop: 20 }}>NOBODY KNOWS</div>
        </div>
        <Sfx name="heartbeat" at={tNobody} volume={0.9} />
      </Shot>
    </ShakeAt>
  );
};

/* ================================================================== OUTRO */

const RecapCard: React.FC<{ at: number; x: number; y: number; w?: number; h?: number; title: string; color: string; children: React.ReactNode }> = ({ at, x, y, w = 400, h = 380, title, color, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = sp(frame, fps, at, springs.pop);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, background: "#0E141B", border: `6px solid ${color}`, overflow: "hidden", transform: `scale(${s})`, boxShadow: `0 0 50px ${color}44` }}>
      <Sfx name="pop" at={at} volume={0.6} />
      <div style={{ height: h - 90, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>{children}</div>
      <div style={{ height: 90, display: "flex", alignItems: "center", justifyContent: "center", background: color, ...big(50, colors.bg), textShadow: "none" }}>{title}</div>
    </div>
  );
};

export const Outro: React.FC<SceneProps> = ({ c, start, end }) => {
  const frame = useCurrentFrame();
  const tFake = c("a fake coin");
  const tEmpty = c("an empty");
  const tForty = c("forty billion", 2);
  const tQueen = c("and a queen");
  const tVanished = c("vanished", 2);
  const tWhere = c("where do");
  const tComments = c("comments");
  const tFollow = c("follow");

  return (
    <AbsoluteFill>
      <Glow color={GOLD} y={40} a="30" />
      <Shot from={start} to={tWhere} push={0.04} enter="fade">
        <div style={{ position: "absolute", left: L0, width: CW, top: 205, textAlign: "center" }}>
          <div style={{ ...big(96, colors.text) }}>SO THINK ABOUT IT</div>
        </div>
        <RecapCard at={tFake} x={70} y={320} title="A FAKE COIN" color="#FF2E88">
          <Coin size={200} label={<Shapes size={40} color="#6B4A00" stroke={0.16} />} spin={Math.sin((frame - tFake) / 9) * 35} />
        </RecapCard>
        <RecapCard at={tEmpty} x={490} y={320} title="AN EMPTY WALLET" color="#3FB6FF">
          <Vault size={220} open={0.7} />
        </RecapCard>
        <RecapCard at={tForty} x={70} y={720} title="GONE IN A WEEK" color={TEAL}>
          <div style={{ ...big(130, GOLD) }}>$40B</div>
        </RecapCard>
        <RecapCard at={tQueen} x={490} y={720} title="THE QUEEN" color={colors.red}>
          <div style={{ position: "absolute", left: 128, top: 6 }}>
            <Disintegrate w={144} h={288} at={tVanished} cols={8} rows={14} dur={22} seed="outq" render={() => <div style={{ transform: "scale(0.6)", transformOrigin: "0 0" }}><GownWoman crown wave={frame / 14} /></div>} />
          </div>
        </RecapCard>
        {frame >= tVanished ? <Sfx name="dissolve" at={tVanished} volume={0.8} /> : null}
      </Shot>
      <Shot from={tWhere} to={end} push={0.03}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 210, textAlign: "center" }}>
          <div style={{ ...big(112, colors.text) }}>WHERE IS THE</div>
          <div style={{ ...big(132, colors.red), textShadow: `0 0 40px ${colors.red}` }}>CRYPTOQUEEN?</div>
        </div>
        <div style={{ position: "absolute", left: 60, top: 500, opacity: 0.9 }}>
          <DotMap
            w={840}
            h={420}
            view={[-170, 80, 180, -56]}
            dotColor="#2A3440"
            question={[
              { at: [25, 42], t: tWhere + 6 },
              { at: [55, 25], t: tWhere + 12 },
              { at: [-80, 25], t: tWhere + 18 },
              { at: [105, 15], t: tWhere + 24 },
            ]}
          />
        </div>
        <div style={{ position: "absolute", left: L0, width: CW, top: 900, textAlign: "center", opacity: frame >= tComments - 10 ? 1 : 0 }}>
          <div style={{ display: "inline-block", padding: "12px 30px", borderRadius: 18, background: "rgba(7,9,11,0.92)", border: `5px solid ${colors.amber}`, ...mono(40, colors.amber) }}>COMMENT YOUR THEORY ↓</div>
        </div>
        {frame >= tFollow ? (
          <Pop at={tFollow} style={{ left: L0, width: CW, top: 1010, display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 32px", borderRadius: 60, background: colors.red }}>
              <OnionLogo size={60} color={colors.text} />
              <div style={{ ...big(66, colors.text), textShadow: "none" }}>FOLLOW THE ONION ARCHIVE</div>
            </div>
          </Pop>
        ) : null}
      </Shot>
    </AbsoluteFill>
  );
};

