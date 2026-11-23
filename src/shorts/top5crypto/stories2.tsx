import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../../theme";
import { sp } from "../../lib/timing";
import { BlobCharacter, Flash, SeizedStamp, Sfx } from "../../components";
import { big, clamp01, lerp, Tag } from "../kit3d";
import { Bars, CalendarPage, Cash, Coin, Columns, Cracks, Disintegrate, DotMap, easeInOut, easeOut, GOLD, House, LineChart, MINT, Person, Phone, PLACES, ShakeAt, TEAL } from "../cryptoKit";
import { CountUp, CW, Glow, L0, mono, Panel, Pill, Pop, Row, type SceneProps, Shot, Slam } from "./common";

const PURPLE = "#9B6BFF";

/* ================================================================== #3 TERRA / DO KWON */

const Scale: React.FC<{ tilt: number; broken: number; left: React.ReactNode; right: React.ReactNode }> = ({ tilt, broken, left, right }) => {
  const W = 680;
  const leftDrop = broken * 520;
  return (
    <div style={{ position: "relative", width: W, height: 560 }}>
      <div style={{ position: "absolute", left: W / 2 - 14, top: 110, width: 28, height: 420, background: "linear-gradient(90deg, #8A949E, #D9DEE3, #8A949E)", borderRadius: 8 }} />
      <div style={{ position: "absolute", left: W / 2 - 120, top: 520, width: 240, height: 34, borderRadius: 12, background: "#8A949E" }} />
      <div style={{ position: "absolute", left: W / 2 - 26, top: 92, width: 52, height: 52, borderRadius: "50%", background: GOLD }} />
      {/* beam */}
      <div style={{ position: "absolute", left: 0, top: 110, width: W, height: 20, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: broken > 0 ? -broken * 40 : 0, width: W / 2, height: 20, background: "#D9DEE3", borderRadius: 10, transform: `rotate(${broken * -35}deg) translateY(${broken * 160}px)`, transformOrigin: "100% 50%" }} />
        <div style={{ position: "absolute", left: W / 2, width: W / 2, height: 20, background: "#D9DEE3", borderRadius: 10 }} />
        {/* left pan */}
        <div style={{ position: "absolute", left: 20, top: 20 + leftDrop, width: 200, transform: `rotate(${-tilt + broken * 30}deg)`, opacity: 1 - broken * 0.6 }}>
          <div style={{ width: 4, height: 120, background: "#8A949E", margin: "0 auto" }} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: -10 }}>{left}</div>
          <div style={{ height: 22, borderRadius: "0 0 100px 100px", background: "#8A949E" }} />
        </div>
        {/* right pan */}
        <div style={{ position: "absolute", left: W - 220, top: 20, width: 200, transform: `rotate(${-tilt}deg)` }}>
          <div style={{ width: 4, height: 120, background: "#8A949E", margin: "0 auto" }} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: -10 }}>{right}</div>
          <div style={{ height: 22, borderRadius: "0 0 100px 100px", background: "#8A949E" }} />
        </div>
      </div>
    </div>
  );
};

const Bill: React.FC<{ w: number; text?: string }> = ({ w, text = "$1" }) => (
  <div style={{ width: w, height: w * 0.48, borderRadius: 8, background: "linear-gradient(135deg, #9EDBAA, #4C9C63)", border: "5px solid #2C6B3F", display: "flex", alignItems: "center", justifyContent: "center", ...big(w * 0.3, "#1F4D2D"), textShadow: "none" }}>{text}</div>
);

const Handcuffs: React.FC<{ size: number; closed: number }> = ({ size, closed }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 200 120">
    <circle cx={50} cy={60} r={38} fill="none" stroke="#C9D2DA" strokeWidth={14} strokeDasharray={`${180 + closed * 60} 300`} />
    <circle cx={150} cy={60} r={38} fill="none" stroke="#C9D2DA" strokeWidth={14} strokeDasharray={`${180 + closed * 60} 300`} transform="rotate(180 150 60)" />
    <path d="M88 60 Q100 44 112 60" fill="none" stroke="#8A949E" strokeWidth={10} />
  </svg>
);

export const Terra: React.FC<SceneProps> = ({ c, start, end }) => {
  const frame = useCurrentFrame();
  const tKorea = c("south korea");
  const tDo = c("do kwon");
  const tTerra = c("terrausd");
  const tStable = c("stablecoin");
  const tSupposed = c("supposed");
  const tAlways2 = c("always", 1);
  const tThen = c("then in may");
  const tMay = c("may");
  const tBreaks = c("breaks");
  const tOne = c("one dollar", 1);
  const tFifty = c("fifty cents");
  const tNine = c("nine cents");
  const tForty = c("forty billion", 1);
  const tEvap = c("evaporates");
  const tFam = c("families");
  const tSavings = c("savings");
  const tAnd = c("and do kwon");
  const tLeaves = c("leaves");
  const tTweets = c("tweets");
  const tRun = c("on the run");
  const tMonths = c("months later");
  const tArrested = c("arrested");
  const tMont = c("montenegro");
  const tBoard = c("board a plane");
  const tPassport = c("fake passport");
  const tDec = c("in december", 1);
  const tJudge = c("judge");
  const tFraud = c("fraud on");
  const tEpic = c("epic");
  const tGen = c("generational");
  const tScale = c("scale");
  const tFifteen = c("fifteen years");
  const tBut2 = c("but number two");
  const tGolden = c("golden");

  const price = frame < tFifty ? 1 : frame < tNine ? 0.5 : 0.09;
  const priceCol = frame < tFifty ? colors.text : frame < tNine ? colors.amber : colors.red;

  return (
    <ShakeAt hits={[tBreaks, tFifty, tNine, tFifteen]} amount={26}>
      <Glow color={TEAL} y={40} />

      {/* A: South Korea, Do Kwon, TerraUSD, a stablecoin */}
      <Shot from={start} to={tSupposed} push={0.05}>
        <div style={{ position: "absolute", left: 60, top: 300, opacity: frame >= tDo ? 0.35 : 1 }}>
          <DotMap w={840} h={560} view={[100, 50, 150, 18]} pins={[{ at: PLACES.korea, t: tKorea, color: TEAL }]} dotColor="#21414A" />
        </div>
        <Row top={215}>
          <Pop at={tKorea} style={{ position: "relative" }}>
            <Pill text="SOUTH KOREA" color={colors.text} size={46} />
          </Pop>
        </Row>
        {frame >= tDo ? (
          <Pop at={tDo} style={{ left: 110, top: 380 }} from="left">
            <Person size={620} outfit="suit" hair="neat" shirt="#1E2A33" tie={TEAL} glasses={false} bob={1} />
          </Pop>
        ) : null}
        {frame >= tDo ? (
          <div style={{ position: "absolute", left: 90, top: 330 }}>
            <Tag at={tDo} text="DO KWON" color={TEAL} size={44} filled />
          </div>
        ) : null}
        {frame >= tTerra ? (
          <Pop at={tTerra} style={{ left: 520, top: 430 }}>
            <Coin size={320} label="UST" color="#7FE3D2" edge="#1B7F70" textColor="#0B3D36" spin={Math.sin((frame - tTerra) / 10) * 30} />
          </Pop>
        ) : null}
        {frame >= tStable ? (
          <Pop at={tStable} style={{ left: 480, top: 820 }}>
            <div style={{ padding: "12px 26px", borderRadius: 18, background: "rgba(7,9,11,0.92)", border: `6px solid ${TEAL}`, textAlign: "center" }}>
              <div style={{ ...mono(30, TEAL) }}>STABLECOIN</div>
              <div style={{ ...big(84, colors.text) }}>1 UST = $1</div>
            </div>
          </Pop>
        ) : null}
      </Shot>

      {/* B: always worth one dollar */}
      <Shot from={tSupposed} to={tThen} push={0.04}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...big(120, colors.text) }}>ALWAYS WORTH $1</div>
        </div>
        <div style={{ position: "absolute", left: 140, top: 400 }}>
          <Scale tilt={Math.sin(frame / 14) * 1.5} broken={0} left={<Coin size={150} label="UST" color="#7FE3D2" edge="#1B7F70" textColor="#0B3D36" />} right={<Bill w={190} />} />
        </div>
        <SeizedStamp at={tAlways2} text="ALWAYS." color={TEAL} fontSize={130} rotate={-8} style={{ left: 260, top: 900 }} />
      </Shot>

      {/* C: May 2022, it breaks */}
      <Shot from={tThen} to={tOne} push={0.04}>
        <div style={{ position: "absolute", left: 100, top: 230 }}>
          <Pop at={tMay} style={{ position: "relative", transform: "rotate(-6deg)" }}>
            <CalendarPage month="MAY" day="2022" w={250} color={TEAL} />
          </Pop>
        </div>
        {(() => {
          const wob = frame < tBreaks ? clamp01((frame - tMay) / Math.max(1, tBreaks - tMay)) : 1;
          const broken = frame >= tBreaks ? easeOut((frame - tBreaks) / 12) : 0;
          return (
            <div style={{ position: "absolute", left: 140, top: 420 }}>
              <Scale tilt={Math.sin(frame / 2.5) * 6 * wob + wob * 8} broken={broken} left={<Coin size={150} label="UST" color="#7FE3D2" edge="#1B7F70" textColor="#0B3D36" />} right={<Bill w={190} />} />
            </div>
          );
        })()}
        {frame >= tBreaks ? <Sfx name="crack" at={tBreaks} volume={0.9} /> : null}
        <Slam at={tBreaks} style={{ left: 420, top: 270 }} rotate={6}>
          <div style={{ padding: "6px 26px", borderRadius: 16, background: colors.red }}>
            <div style={{ ...big(120, colors.bg), textShadow: "none" }}>IT BREAKS</div>
          </div>
        </Slam>
        <Flash at={tBreaks} color={colors.red} peak={0.4} />
      </Shot>

      {/* D: $1.00 -> 50c -> 9c */}
      <Shot from={tOne} to={tForty} push={0.03} enter="none">
        <div style={{ position: "absolute", left: 90, top: 560, opacity: 0.85 }}>
          <LineChart
            w={780}
            h={420}
            pts={[
              [0, 0.95],
              [0.3, 0.95],
              [0.36, 0.5],
              [0.6, 0.48],
              [0.68, 0.1],
              [1, 0.08],
            ]}
            progress={frame < tFifty ? 0.32 : frame < tNine ? 0.62 : clamp01(0.7 + (frame - tNine) / 60)}
            color={priceCol === colors.text ? TEAL : priceCol}
          />
        </div>
        <div style={{ position: "absolute", left: L0, width: CW, top: 240, textAlign: "center" }}>
          <div style={{ ...mono(30, colors.dim) }}>1 UST =</div>
          <div key={price} style={{ ...big(290, priceCol), transform: `scale(${1 + 0.25 * Math.exp(-(frame - (frame < tFifty ? tOne : frame < tNine ? tFifty : tNine)) / 4)})` }}>
            {price === 1 ? "$1.00" : price === 0.5 ? "50¢" : "9¢"}
          </div>
        </div>
        {[tFifty, tNine].map((t, i) => (frame >= t ? <Sfx key={i} name="crack" at={t} volume={0.8} /> : null))}
        <Cracks x={300} y={420} at={tFifty} w={1080} h={1300} seed="t1" />
        <Cracks x={700} y={520} at={tNine} w={1080} h={1300} seed="t2" />
        {frame >= tNine ? <Flash at={tNine} color={colors.red} peak={0.45} /> : null}
      </Shot>

      {/* E: $40 billion evaporates */}
      <Shot from={tForty} to={tFam} push={0.05}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <CountUp at={tForty} to={40} dur={18} prefix="$" suffix=" BILLION" size={150} color={GOLD} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 480 }}>
          <Disintegrate
            w={720}
            h={420}
            at={tEvap}
            cols={16}
            rows={9}
            dur={36}
            tint="#E8F0F4"
            seed="evap"
            render={() => (
              <div style={{ display: "flex", gap: 20, alignItems: "flex-end", paddingTop: 60 }}>
                <Cash w={220} layers={9} />
                <Cash w={220} layers={12} />
                <Cash w={220} layers={7} />
              </div>
            )}
          />
        </div>
        {frame >= tEvap ? <Sfx name="dissolve" at={tEvap} volume={0.8} /> : null}
        {frame >= tEvap ? (
          <Pop at={tEvap + 10} style={{ left: L0, width: CW, top: 960, textAlign: "center" }}>
            <Pill text="EVAPORATED" color={colors.red} filled size={52} />
          </Pop>
        ) : null}
      </Shot>

      {/* F: families lose their savings */}
      <Shot from={tFam} to={tAnd} push={0.05}>
        <div style={{ position: "absolute", left: 120, top: 330 }}>
          <House size={340} color="#C9D2DA" window={colors.amber} />
        </div>
        <div style={{ position: "absolute", left: 90, top: 640, display: "flex", gap: 4, alignItems: "flex-end" }}>
          <BlobCharacter color="#5B86C4" size={230} expression={frame >= tSavings ? "scared" : "calm"} seed={1} />
          <BlobCharacter color="#C89A9A" size={210} expression={frame >= tSavings ? "scared" : "calm"} seed={2} />
          <BlobCharacter color="#9AC8B0" size={140} expression={frame >= tSavings ? "scared" : "calm"} seed={3} />
        </div>
        {/* piggy bank */}
        {(() => {
          const broke = frame >= tSavings;
          const t = broke ? (frame - tSavings) / 20 : 0;
          return (
            <div style={{ position: "absolute", left: 560, top: 520 }}>
              {broke ? <Sfx name="crack" at={tSavings} volume={0.8} /> : null}
              {[0, 1].map((half) => (
                <div key={half} style={{ position: "absolute", left: half * 130, top: 0, width: 130, height: 220, overflow: "hidden", transform: broke ? `translate(${(half ? 1 : -1) * t * 60}px, ${t * t * 80}px) rotate(${(half ? 1 : -1) * t * 25}deg)` : "none" }}>
                  <div style={{ position: "absolute", left: -half * 130, top: 0, width: 260, height: 220 }}>
                    <svg width={260} height={220} viewBox="0 0 260 220">
                      <ellipse cx={130} cy={110} rx={110} ry={86} fill="#FF9DB8" stroke="#C05A78" strokeWidth={6} />
                      <circle cx={232} cy={100} r={30} fill="#FF9DB8" stroke="#C05A78" strokeWidth={6} />
                      <rect x={110} y={26} width={50} height={10} rx={5} fill="#C05A78" />
                      <rect x={60} y={180} width={26} height={36} rx={8} fill="#FF9DB8" />
                      <rect x={170} y={180} width={26} height={36} rx={8} fill="#FF9DB8" />
                      <circle cx={190} cy={86} r={7} fill="#14181D" />
                    </svg>
                  </div>
                </div>
              ))}
              {broke
                ? new Array(8).fill(0).map((_, i) => (
                    <div key={i} style={{ position: "absolute", left: 110 + (i - 4) * 26 * t * 3, top: 120 + t * t * 300 - Math.sin(t * 3) * 60, width: 44, height: 44, borderRadius: "50%", background: GOLD, opacity: 1 - clamp01(t - 0.8) }} />
                  ))
                : null}
            </div>
          );
        })()}
        <Row top={215}>
          <Pop at={tFam} style={{ position: "relative" }}>
            <Pill text="FAMILIES" color={colors.text} size={46} />
          </Pop>
          {frame >= tSavings ? (
            <Pop at={tSavings} style={{ position: "relative" }}>
              <Pill text="LIFE SAVINGS: GONE" color={colors.red} filled size={46} />
            </Pop>
          ) : null}
        </Row>
      </Shot>

      {/* G: Do Kwon leaves South Korea */}
      <Shot from={tAnd} to={tTweets} push={0.05}>
        <Row top={215}>
          <Pop at={tAnd} style={{ position: "relative" }}>
            <Pill text="AND DO KWON?" color={TEAL} filled size={50} />
          </Pop>
        </Row>
        <div style={{ position: "absolute", left: 60, top: 360 }}>
          <DotMap
            w={840}
            h={560}
            view={[75, 55, 150, 0]}
            pins={[{ at: PLACES.korea, t: tAnd, color: TEAL }]}
            arcs={[{ from: PLACES.korea, to: [88, 14], t0: tLeaves - 4, t1: tTweets + 6, plane: true, color: colors.red }]}
            question={[{ at: [86, 12], t: tLeaves + 22 }]}
            dotColor="#21414A"
          />
        </div>
        {frame >= tLeaves ? <Sfx name="plane" at={tLeaves - 4} volume={0.6} /> : null}
      </Shot>

      {/* H: "not on the run" */}
      <Shot from={tTweets} to={tMonths} push={0.05}>
        <div style={{ position: "absolute", left: 120, top: 330, width: 720, padding: "30px 34px", borderRadius: 28, background: "#F3F5F7", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", transform: "rotate(-2deg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 84, height: 84, borderRadius: 84, background: TEAL }} />
            <div>
              <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 40, color: "#0B0F14" }}>Do Kwon</div>
              <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 28, color: "#6B7580" }}>September 2022</div>
            </div>
          </div>
          <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 60, color: "#0B0F14", marginTop: 24, lineHeight: 1.1 }}>
            I am not <span style={{ background: frame >= tRun ? "#FFE36E" : "transparent" }}>"on the run"</span> or anything similar...
          </div>
        </div>
        {frame >= tTweets ? <Sfx name="notify" at={tTweets} volume={0.6} /> : null}
        {frame >= tRun + 8 ? (
          <Pop at={tRun + 8} style={{ left: L0, width: CW, top: 860, textAlign: "center" }}>
            <div style={{ ...big(150, colors.amber), textShadow: `0 0 40px ${colors.amber}` }}>SURE?</div>
          </Pop>
        ) : null}
      </Shot>

      {/* I: arrested in Montenegro with a fake passport */}
      <Shot from={tMonths} to={tDec} push={0.05}>
        <Row top={215} gap={14}>
          <Pop at={tMonths} style={{ position: "relative" }}>
            <Pill text="MONTHS LATER" color={colors.text} size={40} />
          </Pop>
          {frame >= tMont ? (
            <Pop at={tMont} style={{ position: "relative" }}>
              <Pill text="MONTENEGRO · MARCH 2023" color={TEAL} filled size={40} />
            </Pop>
          ) : null}
        </Row>
        {frame >= tArrested ? (
          <Pop at={tArrested} style={{ left: 120, top: 360 }}>
            <Sfx name="snap" at={tArrested + 6} volume={0.9} />
            <Handcuffs size={300} closed={clamp01((frame - tArrested - 4) / 4)} />
          </Pop>
        ) : null}
        {frame >= tBoard ? (
          <Pop at={tBoard} style={{ left: 440, top: 380 }} from="right">
            <div style={{ width: 400, height: 540, borderRadius: 22, background: "#1F3A5A", border: "6px solid #12253A", padding: 30, boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
              <div style={{ ...big(56, GOLD), textAlign: "center" }}>PASSPORT</div>
              <div style={{ margin: "30px auto 0", width: 160, height: 160, borderRadius: "50%", border: `5px solid ${GOLD}` }} />
              <div style={{ marginTop: 40, height: 16, background: "#3A5A7A", borderRadius: 8 }} />
              <div style={{ marginTop: 14, height: 16, width: "70%", background: "#3A5A7A", borderRadius: 8 }} />
              <div style={{ marginTop: 14, height: 16, width: "85%", background: "#3A5A7A", borderRadius: 8 }} />
            </div>
          </Pop>
        ) : null}
        {frame >= tBoard ? (
          <Pop at={tBoard + 6} style={{ left: 100, top: 700 }} sound={false}>
            <div style={{ width: 300, padding: "18px 22px", borderRadius: 16, background: "#F4F1EA", transform: "rotate(-5deg)" }}>
              <div style={{ ...mono(20, "#5A6470") }}>BOARDING PASS</div>
              <div style={{ ...big(64, "#14181D"), textShadow: "none" }}>→ DUBAI</div>
            </div>
          </Pop>
        ) : null}
        <SeizedStamp at={tPassport + 4} text="FAKE" color={colors.red} fontSize={170} rotate={-14} style={{ left: 460, top: 560 }} />
        <SeizedStamp at={tArrested + 2} text="ARRESTED" color={colors.red} fontSize={70} rotate={-6} style={{ left: 300, top: 1000 }} />
      </Shot>

      {/* J: a New York judge: "epic, generational scale" */}
      <Shot from={tDec} to={tFifteen} push={0.04}>
        <div style={{ position: "absolute", left: 230, top: 250, opacity: 0.9 }}>
          <Columns w={500} label="U.S. COURT · NEW YORK" />
        </div>
        <Row top={230}>
          <Pop at={tDec} style={{ position: "relative" }}>
            <Pill text="DECEMBER 2025" color={colors.text} size={40} />
          </Pop>
        </Row>
        {frame >= tJudge ? (
          <div style={{ position: "absolute", left: 640, top: 470, transform: `rotate(${frame < tJudge + 6 ? -40 + (frame - tJudge) * 7 : 0}deg)`, transformOrigin: "20% 80%" }}>
            <Sfx name="slam" at={tJudge + 5} volume={0.9} />
            <svg width={220} height={220} viewBox="0 0 100 100">
              <rect x={20} y={20} width={50} height={26} rx={6} fill="#8A5A2E" transform="rotate(-30 45 33)" />
              <rect x={42} y={40} width={10} height={54} rx={4} fill="#6A4422" transform="rotate(-30 45 33)" />
            </svg>
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 100, top: 640, width: 760, padding: "26px 30px", borderRadius: 22, background: "rgba(7,9,11,0.94)", border: `6px solid ${GOLD}`, textAlign: "center" }}>
          <div style={{ ...mono(26, colors.dim) }}>THE JUDGE CALLED IT</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 22, marginTop: 10 }}>
            {[
              { w: "FRAUD ON AN", at: tFraud, col: colors.text },
              { w: "EPIC,", at: tEpic, col: GOLD },
              { w: "GENERATIONAL", at: tGen, col: GOLD },
              { w: "SCALE", at: tScale, col: colors.text },
            ].map((q) => (
              <div key={q.w} style={{ ...big(92, q.col), opacity: frame >= q.at ? 1 : 0.12, transform: `scale(${frame >= q.at ? 1 + 0.3 * Math.exp(-(frame - q.at) / 3) : 1})` }}>
                {q.w}
              </div>
            ))}
          </div>
        </div>
      </Shot>

      {/* K: fifteen years */}
      <Shot from={tFifteen} to={tBut2} push={0.05} enter="none">
        <div style={{ position: "absolute", left: 330, top: 380 }}>
          <Person size={600} outfit="suit" hair="neat" silhouette />
        </div>
        <div style={{ position: "absolute", left: 140, top: 300, width: 680, height: 740 }}>
          <Bars w={680} h={740} at={tFifteen} n={7} />
        </div>
        <Slam at={tFifteen + 4} style={{ left: L0, width: CW, top: 520, textAlign: "center" }} sound="boom">
          <div style={{ display: "inline-block", padding: "6px 36px", borderRadius: 22, background: colors.red, boxShadow: `0 0 80px ${colors.red}` }}>
            <div style={{ ...big(220, colors.bg), textShadow: "none" }}>15 YEARS</div>
          </div>
        </Slam>
      </Shot>

      {/* L: teaser: the golden boy of crypto */}
      <Shot from={tBut2} to={end} push={0.06} enter="fade">
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${GOLD}55, rgba(0,0,0,0) 40%)` }} />
        <div style={{ position: "absolute", left: 330, top: 360, filter: `drop-shadow(0 0 40px ${GOLD})` }}>
          <Person size={620} hair="messy" outfit="tee" shorts silhouette />
        </div>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1080} height={1300}>
          {new Array(16).fill(0).map((_, i) => {
            const tw = 0.5 + 0.5 * Math.sin(frame / 4 + i * 2);
            const x = 200 + random(`sx-${i}`) * 560;
            const y = 330 + random(`sy-${i}`) * 650;
            return <path key={i} d={`M${x} ${y - 22 * tw} L${x + 6} ${y} L${x} ${y + 22 * tw} L${x - 6} ${y} Z M${x - 22 * tw} ${y} L${x} ${y + 6} L${x + 22 * tw} ${y} L${x} ${y - 6} Z`} fill="#FFF6D6" />;
          })}
        </svg>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...big(110, colors.text) }}>#2 WAS THE</div>
        </div>
        {frame >= tGolden ? (
          <Slam at={tGolden} style={{ left: L0, width: CW, top: 860, textAlign: "center" }}>
            <div style={{ ...big(170, GOLD), textShadow: `0 6px 0 #6B4A00, 0 0 50px ${GOLD}` }}>GOLDEN BOY</div>
          </Slam>
        ) : null}
        {frame >= tGolden ? <Sfx name="kaching" at={tGolden} volume={0.6} /> : null}
      </Shot>
    </ShakeAt>
  );
};

/* ================================================================== #2 FTX / SBF */

const HypeCard: React.FC<{ at: number; title: string; color: string; children: React.ReactNode; x: number; y: number }> = ({ at, title, color, children, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = sp(frame, fps, at, springs.pop);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 400, height: 360, transform: `scale(${s}) rotate(${(x > 300 ? 1 : -1) * 2}deg)`, borderRadius: 26, background: "#0E141B", border: `6px solid ${color}`, overflow: "hidden", boxShadow: `0 0 50px ${color}55` }}>
      <Sfx name="pop" at={at} volume={0.6} />
      <div style={{ height: 270, position: "relative", overflow: "hidden" }}>{children}</div>
      <div style={{ height: 90, display: "flex", alignItems: "center", justifyContent: "center", background: color, ...big(58, colors.bg), textShadow: "none" }}>{title}</div>
    </div>
  );
};

export const Ftx: React.FC<SceneProps> = ({ c, start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tSam = c("sam");
  const tMessy = c("messy");
  const tShorts = c("shorts");
  const tThirty = c("thirty billion");
  const tFtx = c("ftx");
  const tSuper = c("super bowl");
  const tSports = c("sports");
  const tCeleb = c("celebrities");
  const tPol = c("politicians");
  const tThen = c("then in november");
  const tNews = c("news report");
  const tBuilt = c("built on");
  const tRush = c("customers rush");
  const tIsnt = c("and it isn't");
  const tEight = c("eight billion");
  const tGone = c("gone");
  const tCollapses = c("collapses");
  const tNine = c("nine days");
  const tSentenced = c("sentenced");
  const tTwentyFive = c("twenty-five years");
  const tJune = c("in june");
  const tLoses = c("loses");
  const tNow = c("now he's");
  const tBegging = c("begging");
  const tLeast = c("at least");
  const tWhere = c("where he is");
  const tNumOne = c("number one", 1);
  const tNobody = c("nobody does");

  return (
    <ShakeAt hits={[tCollapses, tTwentyFive, tIsnt]} amount={26}>
      <Glow color={PURPLE} y={40} />

      {/* A: Sam Bankman-Fried. Messy hair. Shorts. */}
      <Shot from={start} to={tThirty} push={0.06}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${PURPLE}44, rgba(0,0,0,0) 40%)` }} />
        <div style={{ position: "absolute", left: 300, top: 330 }}>
          <Person size={720} hair="messy" outfit="tee" shirt="#5A6470" shorts bob={1} look={0.3} />
        </div>
        <Row top={215}>
          <Pop at={tSam} style={{ position: "relative" }}>
            <Pill text="SAM BANKMAN-FRIED" color={PURPLE} filled size={52} />
          </Pop>
        </Row>
        <div style={{ position: "absolute", left: 600, top: 330 }}>
          <Tag at={tMessy} text="MESSY HAIR" color={colors.amber} size={40} filled />
        </div>
        <div style={{ position: "absolute", left: 590, top: 760 }}>
          <Tag at={tShorts} text="SHORTS" color={colors.amber} size={40} filled />
        </div>
      </Shot>

      {/* B: $30 billion company, FTX */}
      <Shot from={tThirty} to={tSuper} push={0.05}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <CountUp at={tThirty} to={30} dur={20} prefix="$" suffix=" BILLION" size={150} color={GOLD} />
          <div style={{ ...mono(30), marginTop: 4 }}>COMPANY VALUE</div>
        </div>
        {/* tower that builds itself */}
        <div style={{ position: "absolute", left: 300, top: 440, width: 360, height: 620 }}>
          {new Array(7).fill(0).map((_, i) => {
            const at = tThirty + 4 + i * 4;
            const s = sp(frame, fps, at, springs.slam);
            if (frame < at) return null;
            return <div key={i} style={{ position: "absolute", left: 20 + (i % 2) * 6, bottom: i * 82, width: 320, height: 76, borderRadius: 10, background: `linear-gradient(90deg, #3A2A6A, ${PURPLE})`, border: "4px solid #1A1230", transform: `translateY(${(1 - s) * -500}px)`, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
              {new Array(5).fill(0).map((__, k) => <div key={k} style={{ width: 34, height: 30, borderRadius: 4, background: "#FFE7A8", opacity: 0.85 }} />)}
            </div>;
          })}
        </div>
        {frame >= tFtx ? (
          <Slam at={tFtx} style={{ left: L0, width: CW, top: 520, textAlign: "center" }} sound="boom" rotate={-4}>
            <div style={{ display: "inline-block", padding: "6px 40px", borderRadius: 24, background: "#fff", boxShadow: `0 0 80px ${PURPLE}` }}>
              <div style={{ ...big(220, "#11131A"), textShadow: "none", letterSpacing: "0.04em" }}>FTX</div>
            </div>
          </Slam>
        ) : null}
      </Shot>

      {/* C: Super Bowl ads, stadiums, celebrities, politicians */}
      <Shot from={tSuper} to={tThen} push={0.03}>
        <HypeCard at={tSuper} title="SUPER BOWL ADS" color={GOLD} x={70} y={230}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #2E7D3A, #1E5A28)" }} />
          {new Array(6).fill(0).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: 30 + i * 62, top: 0, bottom: 0, width: 4, background: "rgba(255,255,255,0.5)" }} />
          ))}
          <div style={{ position: "absolute", left: 90, top: 70, width: 220, height: 130, borderRadius: 10, background: "#05080A", border: "6px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", ...big(80, "#fff") }}>FTX</div>
        </HypeCard>
        <HypeCard at={tSports} title="STADIUMS" color={MINT} x={490} y={230}>
          <svg width={400} height={270} viewBox="0 0 400 270">
            <rect width={400} height={270} fill="#0B1A30" />
            <path d="M20 250 L20 140 Q200 40 380 140 L380 250 Z" fill="#2A3A55" />
            <path d="M50 250 L50 160 Q200 80 350 160 L350 250 Z" fill="#3A4A68" />
            <rect x={120} y={100} width={160} height={50} rx={8} fill="#fff" />
            <text x={200} y={140} textAnchor="middle" fontFamily={fonts.display} fontSize={44} fill="#11131A">
              FTX ARENA
            </text>
            {[60, 340].map((x) => (
              <g key={x}>
                <rect x={x - 4} y={20} width={8} height={90} fill="#8A949E" />
                <rect x={x - 26} y={10} width={52} height={22} rx={4} fill="#FFF6D6" />
              </g>
            ))}
          </svg>
        </HypeCard>
        <HypeCard at={tCeleb} title="CELEBRITIES" color={colors.amber} x={70} y={630}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #2A0A12, #12040B)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 70, background: colors.red }} />
          <div style={{ position: "absolute", left: 70, top: 50, display: "flex", gap: 14 }}>
            {[0, 1, 2].map((i) => (
              <BlobCharacter key={i} color={["#E3B455", "#C89A9A", "#9AC8B0"][i]} size={170} sunglasses seed={i} />
            ))}
          </div>
          {new Array(5).fill(0).map((_, i) => (frame - tCeleb) % 12 === i * 2 ? <div key={i} style={{ position: "absolute", left: 40 + i * 70, top: 30 + (i % 2) * 40, width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.9)" }} /> : null)}
        </HypeCard>
        <HypeCard at={tPol} title="POLITICIANS" color={colors.red} x={490} y={630}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #14213A, #0B1220)" }} />
          <div style={{ position: "absolute", left: 140, top: 40 }}>
            <Person size={220} outfit="suit" hair="short" shirt="#1E2A40" tie={colors.red} />
          </div>
          <div style={{ position: "absolute", left: 120, top: 170, width: 160, height: 100, borderRadius: "10px 10px 0 0", background: "#6A4422", border: "4px solid #3A240E" }} />
        </HypeCard>
      </Shot>

      {/* D: one news report: his trading firm is built on FTX's own coin */}
      <Shot from={tThen} to={tRush} push={0.04}>
        <Row top={215}>
          <Pop at={tThen + 6} style={{ position: "relative" }}>
            <Pill text="NOVEMBER 2022" color={colors.text} size={40} />
          </Pop>
        </Row>
        {frame >= tNews - 6 ? (
          (() => {
            const s = sp(frame, fps, tNews - 6, springs.snappy);
            return (
              <div style={{ position: "absolute", left: 110, top: 310, width: 740, padding: "22px 28px", borderRadius: 6, background: "#F1EDE4", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", transform: `rotate(${lerp(540, -2, s)}deg) scale(${lerp(0.1, 1, s)})` }}>
                <Sfx name="whoosh" at={tNews - 6} volume={0.6} />
                <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 44, color: "#14181D", textAlign: "center", borderBottom: "4px double #14181D", paddingBottom: 8 }}>THE CRYPTO REPORT</div>
                <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 52, color: "#14181D", lineHeight: 1.05, marginTop: 14 }}>LEAKED: HIS TRADING FIRM IS BUILT ON FTX'S OWN COIN</div>
                <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
                  {[0.9, 0.7, 0.8].map((w, i) => (
                    <div key={i} style={{ flex: 1 }}>
                      {[1, 0.8, 0.95, 0.6].map((ww, k) => (
                        <div key={k} style={{ height: 10, width: `${ww * w * 100}%`, background: "#B8B2A6", marginTop: 8, borderRadius: 4 }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()
        ) : null}
        {frame >= tBuilt ? (
          <Pop at={tBuilt} style={{ left: 280, top: 700 }} from="up">
            <div style={{ position: "relative", width: 400, height: 360, transform: `rotate(${Math.sin(frame / 5) * 3}deg)`, transformOrigin: "50% 100%" }}>
              <div style={{ position: "absolute", left: 60, top: 0, width: 280, height: 180, borderRadius: 10, background: "#2A3442", border: "5px solid #4A5664", display: "flex", alignItems: "center", justifyContent: "center", ...big(54, colors.text) }}>TRADING FIRM</div>
              {new Array(6).fill(0).map((_, i) => (
                <div key={i} style={{ position: "absolute", left: 150 + Math.sin(i * 2 + frame / 6) * 6, top: 180 + i * 30, width: 100, height: 30, borderRadius: "50%", background: `linear-gradient(180deg, #5BE3C8, #1B7F70)`, border: "3px solid #0B3D36" }} />
              ))}
              <div style={{ position: "absolute", left: 290, top: 270 }}>
                <Tag at={tBuilt + 8} text="FTX'S OWN COIN" color={TEAL} size={30} filled />
              </div>
            </div>
          </Pop>
        ) : null}
      </Shot>

      {/* E: customers rush to pull their money out. It isn't there. */}
      <Shot from={tRush} to={tEight} push={0.04}>
        <div style={{ position: "absolute", left: 540, top: 300 }}>
          <Phone w={300} glow={frame >= tIsnt ? colors.red : PURPLE}>
            <div style={{ textAlign: "center", paddingTop: 30 }}>
              <div style={{ ...mono(24, colors.dim) }}>FTX ACCOUNT</div>
              <div style={{ ...big(64, colors.text), marginTop: 20 }}>$12,400</div>
              <div style={{ marginTop: 40, padding: "16px 0", borderRadius: 16, background: frame >= tIsnt ? "#3A1014" : PURPLE, ...big(44, frame >= tIsnt ? colors.red : "#fff"), textShadow: "none" }}>{frame >= tIsnt ? "PAUSED" : "WITHDRAW"}</div>
              {frame >= tIsnt ? <div style={{ ...mono(22, colors.red), marginTop: 20, whiteSpace: "normal" }}>WITHDRAWALS UNAVAILABLE</div> : null}
            </div>
          </Phone>
        </div>
        {new Array(7).fill(0).map((_, i) => {
          const x = Math.min(440, 60 + ((frame - tRush) * (6 + (i % 3)) + i * 70) % 520);
          return (
            <div key={i} style={{ position: "absolute", left: x - 40, top: 520 + (i % 3) * 120 - Math.abs(Math.sin((frame + i * 7) / 3)) * 18 }}>
              <BlobCharacter color={["#5B86C4", "#C8B08A", "#9AC8B0", "#B59AC8", "#C89A9A", "#E3B455", "#8FA3B5"][i]} size={170} seed={i} look={{ x: 1, y: 0 }} expression={frame >= tIsnt ? "scared" : "calm"} />
            </div>
          );
        })}
        <Row top={215}>
          <Pop at={tRush} style={{ position: "relative" }}>
            <Pill text="BANK RUN" color={colors.amber} filled size={50} />
          </Pop>
        </Row>
        {frame >= tIsnt ? <Sfx name="error" at={tIsnt} volume={0.8} /> : null}
        <SeizedStamp at={tIsnt + 8} text="IT ISN'T THERE" color={colors.red} fontSize={80} rotate={-6} style={{ left: 140, top: 960 }} />
      </Shot>

      {/* F: $8 billion of customer money, gone */}
      <Shot from={tEight} to={tCollapses} push={0.05}>
        <div style={{ position: "absolute", left: 90, top: 430 }}>
          <Disintegrate
            w={780}
            h={260}
            at={tGone}
            cols={18}
            rows={6}
            dur={24}
            tint={colors.red}
            seed="eight"
            render={() => (
              <div style={{ width: 780, height: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <CountUp at={tEight} to={8000000000} dur={30} prefix="$" size={130} color={GOLD} tick={false} />
                <div style={{ ...mono(34), marginTop: 10 }}>OF CUSTOMER MONEY</div>
              </div>
            )}
          />
        </div>
        {frame >= tEight ? <Sfx name="tick" at={tEight} volume={0.35} durationInFrames={30} /> : null}
        {frame >= tGone ? <Sfx name="dissolve" at={tGone} volume={0.8} /> : null}
        <Slam at={tGone + 10} style={{ left: L0, width: CW, top: 760, textAlign: "center" }} sound="boom">
          <div style={{ ...big(220, colors.red), textShadow: `0 0 60px ${colors.red}` }}>GONE</div>
        </Slam>
      </Shot>

      {/* G: FTX collapses in nine days */}
      <Shot from={tCollapses} to={tSentenced} push={0.04}>
        <div style={{ position: "absolute", left: 300, top: 440, width: 360, height: 620 }}>
          {new Array(7).fill(0).map((_, i) => {
            const t = Math.max(0, frame - tCollapses - (6 - i) * 1.5) / 30;
            const dir = random(`fc-${i}`) - 0.5;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 20 + (i % 2) * 6,
                  bottom: i * 82,
                  width: 320,
                  height: 76,
                  borderRadius: 10,
                  background: `linear-gradient(90deg, #3A2A6A, ${PURPLE})`,
                  border: "4px solid #1A1230",
                  transform: `translate(${dir * 500 * t}px, ${t * t * 900}px) rotate(${dir * 200 * t}deg)`,
                }}
              />
            );
          })}
          <div style={{ position: "absolute", left: 60, bottom: 240, ...big(140, "#fff"), opacity: 1 - clamp01((frame - tCollapses) / 6) }}>FTX</div>
        </div>
        {frame >= tCollapses ? <Sfx name="crash" at={tCollapses} volume={0.9} /> : null}
        {frame >= tCollapses ? <Sfx name="rumble" at={tCollapses} volume={0.7} /> : null}
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...mono(32, colors.dim) }}>COLLAPSE IN</div>
          {frame >= tNine ? <CountUp at={tNine} from={1} to={9} dur={14} suffix=" DAYS" size={170} color={colors.red} /> : <div style={{ ...big(170, colors.red) }}>...</div>}
        </div>
        <SeizedStamp at={tNine + 16} text="BANKRUPT" color={colors.red} fontSize={110} rotate={-8} style={{ left: 200, top: 700 }} />
      </Shot>

      {/* H: 25 years */}
      <Shot from={tSentenced} to={tJune} push={0.05} enter="none">
        <div style={{ position: "absolute", left: 330, top: 380 }}>
          <Person size={600} hair="messy" outfit="tee" shorts silhouette />
        </div>
        <div style={{ position: "absolute", left: 140, top: 300, width: 680, height: 740 }}>
          <Bars w={680} h={740} at={tSentenced + 4} />
        </div>
        {frame >= tTwentyFive ? (
          <Slam at={tTwentyFive} style={{ left: L0, width: CW, top: 520, textAlign: "center" }} sound="boom">
            <div style={{ display: "inline-block", padding: "6px 36px", borderRadius: 22, background: colors.red, boxShadow: `0 0 80px ${colors.red}` }}>
              <div style={{ ...big(220, colors.bg), textShadow: "none" }}>25 YEARS</div>
            </div>
          </Slam>
        ) : null}
      </Shot>

      {/* I: June 2026, loses his appeal */}
      <Shot from={tJune} to={tNow} push={0.05}>
        <div style={{ position: "absolute", left: 170, top: 300, width: 620, padding: "36px 40px", borderRadius: 10, background: "#F4F1EA", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", transform: "rotate(2deg)" }}>
          <div style={{ ...mono(26, "#5A6470") }}>COURT OF APPEALS · JUNE 2026</div>
          <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 64, color: "#14181D", marginTop: 16, lineHeight: 1.05 }}>APPEAL OF SAM BANKMAN-FRIED</div>
          {[1, 0.8, 0.9, 0.6].map((w, k) => (
            <div key={k} style={{ height: 14, width: `${w * 100}%`, background: "#C9CFD6", marginTop: 16, borderRadius: 6 }} />
          ))}
        </div>
        <SeizedStamp at={tLoses} text="DENIED" color={colors.red} fontSize={170} rotate={-12} style={{ left: 230, top: 560 }} />
      </Shot>

      {/* J: now begging the Supreme Court */}
      <Shot from={tNow} to={tLeast} push={0.05}>
        <div style={{ position: "absolute", left: 230, top: 250 }}>
          <Columns w={500} label="SUPREME COURT" />
        </div>
        <div style={{ position: "absolute", left: 140, top: 640 }}>
          <Person size={420} hair="messy" outfit="tee" shirt="#5A6470" shorts arm={frame >= tBegging ? 120 + Math.sin(frame / 3) * 10 : 0} />
        </div>
        {frame >= tBegging ? (
          <Pop at={tBegging} style={{ left: 420, top: 640 }}>
            <div style={{ position: "relative", padding: "22px 30px", borderRadius: 30, background: "#fff", ...big(80, "#14181D"), textShadow: "none" }}>
              PLEASE?
              <div style={{ position: "absolute", left: -20, bottom: 20, width: 0, height: 0, borderTop: "20px solid transparent", borderBottom: "20px solid transparent", borderRight: "30px solid #fff" }} />
            </div>
          </Pop>
        ) : null}
        {frame >= tBegging + 10 ? (
          <div style={{ position: "absolute", left: lerp(330, 470, easeOut((frame - tBegging - 10) / 30)), top: lerp(700, 420, easeOut((frame - tBegging - 10) / 30)), width: 90, height: 110, background: "#F4F1EA", transform: `rotate(${(frame - tBegging) * 6}deg)`, borderRadius: 6 }} />
        ) : null}
      </Shot>

      {/* K: at least we know where he is */}
      <Shot from={tLeast} to={tNumOne} push={0.05}>
        <div style={{ position: "absolute", left: 230, top: 400, width: 500, height: 560, borderRadius: 20, background: "#1A2028", border: "8px solid #3A4652", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 160, top: 160 }}>
            <Person size={380} hair="messy" outfit="uniform" shirt="#E07A2E" />
          </div>
          <Bars w={500} h={560} at={tLeast} n={6} />
        </div>
        {frame >= tWhere
          ? (() => {
              const s = sp(frame, fps, tWhere, springs.slam);
              return (
                <div style={{ position: "absolute", left: 420, top: lerp(-200, 260, s) }}>
                  <Sfx name="pop" at={tWhere} volume={0.8} />
                  <svg width={120} height={160} viewBox="-60 -110 120 120">
                    <path d="M0 0 C-14 -30 -40 -46 -40 -70 A40 40 0 1 1 40 -70 C40 -46 14 -30 0 0 Z" fill={MINT} stroke="#fff" strokeWidth={5} />
                    <circle cx={0} cy={-70} r={14} fill="#fff" />
                  </svg>
                </div>
              );
            })()
          : null}
        {frame >= tWhere ? (
          <Pop at={tWhere + 6} style={{ left: L0, width: CW, top: 1000, textAlign: "center" }}>
            <Pill text="LOCATION: KNOWN" color={MINT} filled size={44} />
          </Pop>
        ) : null}
      </Shot>

      {/* L: number one... nobody does */}
      <Shot from={tNumOne} to={end} push={0.05} enter="fade">
        <div style={{ position: "absolute", left: 60, top: 380 }}>
          <DotMap
            w={840}
            h={460}
            view={[-170, 80, 180, -56]}
            dotColor="#2A3440"
            question={[
              { at: [-100, 40], t: tNobody },
              { at: [20, 46], t: tNobody + 3 },
              { at: [55, 25], t: tNobody + 6 },
              { at: [105, 30], t: tNobody + 9 },
              { at: [-60, -15], t: tNobody + 12 },
              { at: [135, -25], t: tNobody + 15 },
              { at: [25, 0], t: tNobody + 18 },
            ]}
          />
          {/* radar sweep */}
          <div style={{ position: "absolute", left: 420 - 400, top: 230 - 400, width: 800, height: 800, borderRadius: "50%", background: `conic-gradient(from ${(frame - tNumOne) * 6}deg, ${colors.red}55, rgba(0,0,0,0) 60deg)`, opacity: 0.6 }} />
        </div>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...big(120, colors.text) }}>NUMBER 1?</div>
          {frame >= tNobody ? <div style={{ ...big(130, colors.red), marginTop: 8 }}>NOBODY KNOWS</div> : null}
        </div>
        {frame >= tNobody ? <Sfx name="heartbeat" at={tNobody} volume={0.9} /> : null}
      </Shot>
    </ShakeAt>
  );
};

