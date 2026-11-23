import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../../theme";
import { sp } from "../../lib/timing";
import { BlobCharacter, Flash, SeizedStamp, Sfx } from "../../components";
import { big, clamp01, lerp, Tag } from "../kit3d";
import {
  Browser,
  CalendarPage,
  Coin,
  Cracks,
  Disintegrate,
  DotMap,
  easeInOut,
  easeOut,
  Ecg,
  GOLD,
  House,
  LineChart,
  MINT,
  MoneyBag,
  Person,
  Phone,
  PINK,
  PLACES,
  ShakeAt,
  Shapes,
  SKY,
  Tomb,
  Vault,
} from "../cryptoKit";
import { CountUp, CW, Glow, L0, mono, Panel, Pill, Pop, Row, type SceneProps, Shot, Slam } from "./common";

const fmtPrice = (n: number) => (n < 10 ? n.toFixed(2) : Math.round(n).toLocaleString("en-US"));

/** Price that climbs exponentially from `a` to `b` between frames f0 and f1. */
const expPrice = (frame: number, f0: number, f1: number, a: number, b: number) => {
  const p = clamp01((frame - f0) / Math.max(1, f1 - f0));
  return a * Math.pow(b / a, easeInOut(p));
};

/* ================================================================== #5 SQUID GAME TOKEN */

const SQUID_UP: [number, number][] = new Array(26).fill(0).map((_, i) => {
  const x = i / 25;
  return [x, Math.min(1, 0.02 + Math.pow(x, 3.2) * 0.98 + (i % 3 === 1 ? 0.015 : 0))];
});

export const Squid: React.FC<SceneProps> = ({ c, start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tOct = c("october");
  const tBiggest = c("biggest");
  const tSo = c("so someone");
  const tSquid = c("squid", 1);
  const tStarts = c("starts");
  const tCent = c("cent");
  const tWeek = c("a week");
  const tNearly = c("nearly");
  const tUp = c("up seventy-five");
  const tBut = c("but people");
  const tWeird = c("weird");
  const tSell = c("couldn't sell");
  const tBuilt = c("was built");
  const tNever = c("never get");
  const tThen = c("then on");
  const tNov = c("november");
  const tCashed = c("cashed");
  const tPrice = c("the price");
  const tZero = c("zero");
  const tWebsite = c("website");
  const tVanished = c("vanished", 1);
  const tSoDid = c("so did");
  const tThree = c("three point");
  const tMillion = c("million dollars");
  const tRules = c("rules");
  const tNobody = c("nobody wins");
  const tHouse = c("house");
  const tBut4 = c("but number four");
  const tDied = c("he died");
  const tOr = c("or did");

  return (
    <ShakeAt hits={[tUp, tZero, tCashed]} amount={30}>
      <Glow color={PINK} y={40} />

      {/* A: the show everyone is watching */}
      <Shot from={start} to={tSo} push={0.06}>
        <Row top={215}>
          <Pop at={tOct} style={{ position: "relative" }}>
            <Pill text="OCTOBER 2021" color={colors.text} size={44} />
          </Pop>
        </Row>
        <div style={{ position: "absolute", left: 100, top: 330, width: 760, height: 470, borderRadius: 26, background: "#05080A", border: "16px solid #1E252D", boxShadow: `0 0 120px ${PINK}66`, overflow: "hidden" }}>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #0F5F55, #04201D 75%)" }} />
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(frame / 8)})` }}>
            <Shapes size={150} color={PINK} />
          </AbsoluteFill>
          <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.25) 0 2px, transparent 2px 5px)" }} />
          {frame < start + 34 ? <AbsoluteFill style={{ background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' seed='${frame % 7}'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`, opacity: 1 - clamp01((frame - start - 26) / 8) }} /> : null}
        </div>
        <div style={{ position: "absolute", left: 600, top: 290 }}>
          {frame >= tBiggest ? (
            <Pop at={tBiggest} style={{ position: "relative", transform: "rotate(8deg)" }}>
              <div style={{ padding: "10px 24px", borderRadius: 18, background: GOLD, transform: "rotate(8deg)", ...big(60, colors.bg), textShadow: "none" }}>#1 SHOW ON EARTH</div>
            </Pop>
          ) : null}
        </div>
        {/* viewers in front of the TV */}
        <div style={{ position: "absolute", left: 100, top: 690, width: 760, display: "flex", justifyContent: "space-around" }}>
          {[0, 1, 2, 3].map((i) => (
            <BlobCharacter key={i} color={["#3A2A40", "#2A3A48", "#40322A", "#2E2E3E"][i]} size={230} seed={i} lightColor={PINK} lightAmount={0.55} look={{ x: 0, y: -1 }} idle={0.6} />
          ))}
        </div>
        {frame >= tBiggest + 6 ? (
          <Row top={960} gap={14}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Pop key={i} at={tBiggest + 6 + i * 3} style={{ position: "relative" }} sound={i === 0}>
                <div style={{ width: 140, height: 90, borderRadius: 10, background: "#04201D", border: "6px solid #1E252D", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 30px ${PINK}55` }}>
                  <Shapes size={30} color={PINK} />
                </div>
              </Pop>
            ))}
          </Row>
        ) : null}
      </Shot>

      {/* B: someone launches a coin called Squid */}
      <Shot from={tSo} to={tStarts} push={0.04}>
        <div style={{ position: "absolute", left: 90, top: 720 }}>
          <BlobCharacter color="#1A1F26" accessory="hoodie" size={300} sunglasses lightColor={GOLD} lightAmount={0.5} look={{ x: 1, y: -0.6 }} />
        </div>
        <div style={{ position: "absolute", left: 60, top: 660 }}>
          <Tag at={tSo + 4} text="ANONYMOUS DEVS" color={colors.text} size={30} />
        </div>
        {(() => {
          const launch = easeOut((frame - tSo - 6) / 22);
          const y = lerp(1150, 300, launch);
          return (
            <>
              {frame >= tSo + 6 ? <Sfx name="whoosh" at={tSo + 6} volume={0.7} /> : null}
              {/* exhaust */}
              {new Array(14).fill(0).map((_, i) => {
                const k = (frame - tSo - 6 - i * 1.5) / 22;
                if (k < 0 || k > 1.6) return null;
                const yy = lerp(1150, 300, easeOut(k)) + 300;
                return <div key={i} style={{ position: "absolute", left: 600 - 50 + (random(`ex-${i}`) - 0.5) * 60, top: yy, width: 100 + i * 6, height: 100 + i * 6, borderRadius: "50%", background: i < 3 ? GOLD : "rgba(200,200,210,0.35)", opacity: 1 - k / 1.6 }} />;
              })}
              <div style={{ position: "absolute", left: 600 - 170, top: y, transform: `rotate(${Math.sin(frame / 6) * 4}deg)` }}>
                <Coin size={340} label={<Shapes size={64} color="#6B4A00" stroke={0.16} />} spin={(frame - tSo) * 9} />
              </div>
            </>
          );
        })()}
        <div style={{ position: "absolute", left: 420, top: 250 }}>
          <Tag at={tSquid} text="$SQUID" color={GOLD} size={56} filled />
        </div>
      </Shot>

      {/* C: one cent -> nearly $3,000 */}
      <Shot from={tStarts} to={tBut} push={0.04}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...mono(30, colors.dim) }}>PRICE PER COIN</div>
          {frame >= tCent ? <div style={{ ...big(200, frame >= tUp ? MINT : colors.text) }}>${fmtPrice(expPrice(frame, tWeek + 4, tNearly + 30, 0.01, 2861))}</div> : null}
        </div>
        <div style={{ position: "absolute", left: 90, top: 520 }}>
          <Panel w={780} color={MINT} pad={30}>
            <LineChart w={720} h={420} pts={SQUID_UP} progress={clamp01((frame - tWeek) / (tUp - tWeek))} color={MINT} />
          </Panel>
        </div>
        {frame >= tWeek ? (
          <div style={{ position: "absolute", left: 120, top: 550 }}>
            <Pop at={tWeek} style={{ position: "relative" }}>
              <Pill text="+1 WEEK" color={colors.text} size={34} />
            </Pop>
          </div>
        ) : null}
        <Slam at={tUp} style={{ left: L0, width: CW, top: 620, textAlign: "center" }} rotate={-6} sound="boom">
          <div style={{ display: "inline-block", padding: "6px 34px", borderRadius: 22, background: MINT }}>
            <div style={{ ...big(180, colors.bg), textShadow: "none" }}>+75,000%</div>
          </div>
        </Slam>
        {frame >= tUp ? <Sfx name="kaching" at={tUp} volume={0.6} /> : null}
        <Flash at={tUp} color={MINT} peak={0.35} />
      </Shot>

      {/* D: they couldn't sell */}
      <Shot from={tBut} to={tBuilt} push={0.04}>
        {(() => {
          const presses = [tSell, tSell + 12, tSell + 24];
          const pressed = presses.some((p) => frame >= p && frame < p + 5);
          const shake = presses.reduce((k, p) => (frame >= p ? Math.max(k, Math.exp(-(frame - p) / 4)) : k), 0);
          return (
            <>
              <div style={{ position: "absolute", left: 290, top: 240, transform: `translateX(${Math.sin(frame * 2.5) * 12 * shake}px)` }}>
                <Phone w={380} glow={frame >= tSell ? colors.red : MINT}>
                  <div style={{ fontFamily: fonts.mono, color: colors.text, textAlign: "center" }}>
                    <div style={{ ...mono(26, colors.dim) }}>MY WALLET</div>
                    <div style={{ ...big(66, GOLD), marginTop: 8 }}>$SQUID</div>
                    <div style={{ ...big(78, MINT), marginTop: 10 }}>$2,861.00</div>
                    <div style={{ margin: "18px auto 0", width: 300 }}>
                      <LineChart w={300} h={150} pts={SQUID_UP} progress={1} color={MINT} grid={false} dot={false} />
                    </div>
                    <div style={{ marginTop: 26, padding: "14px 0", borderRadius: 16, background: MINT, ...big(54, colors.bg), textShadow: "none" }}>BUY ✓</div>
                    <div style={{ marginTop: 16, padding: "14px 0", borderRadius: 16, background: frame >= tSell ? "#5A1218" : colors.red, ...big(54, frame >= tSell ? "#FF8A8A" : "#fff"), textShadow: "none", transform: `scale(${pressed ? 0.92 : 1})` }}>SELL</div>
                  </div>
                </Phone>
              </div>
              {frame >= tWeird && frame < tSell ? (
                <>
                  <Pop at={tWeird} style={{ left: 130, top: 360 }}>
                    <div style={{ ...big(160, colors.amber) }}>?</div>
                  </Pop>
                  <Pop at={tWeird + 5} style={{ left: 720, top: 300 }} sound={false}>
                    <div style={{ ...big(120, colors.amber) }}>?</div>
                  </Pop>
                </>
              ) : null}
              {presses.map((p, i) =>
                frame >= p ? (
                  <Pop key={i} at={p} style={{ left: i % 2 ? 470 : 90, top: 300 + i * 190 }} sound={false}>
                    <Sfx name="error" at={p} volume={0.7} />
                    <div style={{ padding: "16px 24px", borderRadius: 18, background: "rgba(40,6,10,0.96)", border: `5px solid ${colors.red}`, ...mono(32, colors.red), boxShadow: `0 0 40px ${colors.red}66` }}>✕ SELL FAILED</div>
                  </Pop>
                ) : null,
              )}
              {/* finger */}
              {frame >= tSell - 6 ? (
                <div style={{ position: "absolute", left: 520, top: (pressed ? 905 : 930) + Math.max(0, (tSell - frame) * 12), width: 70, height: 150, borderRadius: 35, background: "#E8B48F", border: "5px solid #B9825E", transform: "rotate(-14deg)" }} />
              ) : null}
            </>
          );
        })()}
      </Shot>

      {/* E: built so buyers could get in and never get out */}
      <Shot from={tBuilt} to={tThen} push={0.04}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...big(110, colors.text) }}>A ONE-WAY TRAP</div>
        </div>
        {/* big coin portal on the right */}
        <div style={{ position: "absolute", left: 590, top: 430 }}>
          <Coin size={280} label={<Shapes size={52} color="#6B4A00" stroke={0.16} />} spin={Math.sin(frame / 20) * 20} />
        </div>
        {/* buyers walking in */}
        {new Array(5).fill(0).map((_, i) => {
          const t = ((frame - tBuilt) * 4 + i * 110) % 560;
          const x = 90 + t;
          const sc = x > 520 ? Math.max(0, 1 - (x - 520) / 120) : 1;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: 470 + Math.abs(Math.sin((frame + i * 9) / 4)) * -12, transform: `scale(${sc})`, transformOrigin: "50% 100%" }}>
              <BlobCharacter color={["#5B86C4", "#C8B08A", "#9AC8B0", "#B59AC8", "#C89A9A"][i]} size={170} seed={i} idle={0.4} look={{ x: 1, y: 0 }} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 90, top: 700, width: 500, height: 18, borderRadius: 9, background: `${MINT}55` }} />
        <div style={{ position: "absolute", left: 110, top: 740 }}>
          <Pill text="BUY → IN" color={MINT} filled size={44} />
        </div>
        {/* the way out */}
        <div style={{ position: "absolute", left: 90, top: 870, width: 760, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ ...big(120, frame >= tNever ? "#4A2226" : colors.text) }}>← OUT</div>
          <div style={{ flex: 1, height: 18, borderRadius: 9, background: frame >= tNever ? `${colors.red}66` : "#2A3540" }} />
        </div>
        {frame >= tNever ? (
          <Slam at={tNever} style={{ left: 560, top: 820 }} sound="none">
            <Sfx name="stamp" at={tNever} volume={0.9} />
            <svg width={200} height={220} viewBox="0 0 100 110">
              <path d="M25 50 L25 32 C25 6 75 6 75 32 L75 50" fill="none" stroke="#C9D2DA" strokeWidth={10} />
              <rect x={12} y={48} width={76} height={58} rx={10} fill={colors.red} stroke="#fff" strokeWidth={4} />
              <circle cx={50} cy={74} r={8} fill="#fff" />
            </svg>
          </Slam>
        ) : null}
        <SeizedStamp at={tNever + 6} text="SELLING BLOCKED" color={colors.red} fontSize={58} rotate={-6} style={{ left: 140, top: 1010 }} />
      </Shot>

      {/* F: November 1, the creators cash out (a literal rug pull) */}
      <Shot from={tThen} to={tPrice} push={0.03}>
        <div style={{ position: "absolute", left: 110, top: 240 }}>
          <Pop at={tNov} style={{ position: "relative", transform: "rotate(-6deg)" }}>
            <CalendarPage month="NOV" day="1" w={240} />
          </Pop>
        </div>
        {(() => {
          const pull = frame >= tCashed ? easeOut((frame - tCashed) / 8) : 0;
          const fall = frame >= tCashed + 4 ? Math.pow((frame - tCashed - 4) / 30, 2) * 900 : 0;
          return (
            <>
              {frame >= tCashed ? <Sfx name="whoosh" at={tCashed} volume={0.8} /> : null}
              {frame >= tCashed ? <Sfx name="kaching" at={tCashed + 4} volume={0.7} /> : null}
              {/* holders standing on the rug */}
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ position: "absolute", left: 130 + i * 150, top: 650 + fall * (0.8 + i * 0.15), transform: `rotate(${fall * 0.05 * (i % 2 ? 1 : -1)}deg)` }}>
                  <BlobCharacter color={["#5B86C4", "#C8B08A", "#9AC8B0"][i]} size={200} seed={i + 3} expression={frame >= tCashed ? "scared" : "calm"} />
                </div>
              ))}
              {/* coins on the rug */}
              {new Array(7).fill(0).map((_, i) => (
                <div key={`c${i}`} style={{ position: "absolute", left: 130 + i * 62, top: 800 - (i % 2) * 30 + fall * (1 + (i % 3) * 0.2), width: 70, height: 70, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #FFF3C4, ${GOLD} 50%, #B07A00)`, transform: `rotate(${fall * 0.3}deg)` }} />
              ))}
              {/* the rug */}
              <div style={{ position: "absolute", left: 100 + pull * 760, top: 860, width: 560, height: 46, borderRadius: 8, background: `repeating-linear-gradient(90deg, ${colors.red} 0 40px, #8A0818 40px 56px, ${GOLD} 56px 62px)`, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }} />
              {/* the devs yanking it */}
              <div style={{ position: "absolute", left: 660 + pull * 120, top: 650 }}>
                <BlobCharacter color="#1A1F26" accessory="hoodie" size={230} sunglasses look={{ x: -1, y: 0 }} />
              </div>
              <div style={{ position: "absolute", left: 690 + pull * 120, top: 600 }}>{frame >= tCashed ? <MoneyBag size={120} /> : null}</div>
            </>
          );
        })()}
        <Slam at={tCashed + 2} style={{ left: L0, width: CW, top: 420, textAlign: "center" }} rotate={-5}>
          <div style={{ display: "inline-block", padding: "4px 30px", borderRadius: 18, background: colors.red }}>
            <div style={{ ...big(150, colors.bg), textShadow: "none" }}>RUG PULL</div>
          </div>
        </Slam>
      </Shot>

      {/* G: price hits zero within minutes */}
      <Shot from={tPrice} to={tWebsite} push={0.03}>
        {(() => {
          const drop = clamp01((frame - tPrice - 4) / Math.max(1, tZero + 6 - tPrice - 4));
          const price = frame < tPrice + 4 ? 2861 : 2861 * Math.pow(1 - easeInOut(drop), 3);
          const pts: [number, number][] = [...SQUID_UP.map(([x, y]) => [x * 0.8, y] as [number, number]), [0.84, 0.3], [0.86, 0.02], [1, 0.0]];
          return (
            <>
              <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
                <div style={{ ...mono(30, colors.dim) }}>PRICE PER COIN</div>
                <div style={{ ...big(210, frame >= tZero ? colors.red : colors.text) }}>${fmtPrice(price)}</div>
              </div>
              <div style={{ position: "absolute", left: 90, top: 530 }}>
                <Panel w={780} color={frame >= tPrice + 6 ? colors.red : MINT} pad={30}>
                  <LineChart w={720} h={420} pts={pts} progress={lerp(0.8, 1, clamp01((frame - tPrice) / (tZero + 4 - tPrice)))} color={frame >= tPrice + 6 ? colors.red : MINT} />
                </Panel>
              </div>
              <Cracks x={560} y={760} at={tZero} w={1080} h={1300} seed="sq0" />
              {frame >= tZero ? <Sfx name="crash" at={tZero} volume={0.8} /> : null}
              {frame >= tZero ? (
                <div style={{ position: "absolute", left: 600, top: 470 }}>
                  <Tag at={tZero + 4} text="-99.99%" color={colors.red} size={48} filled />
                </div>
              ) : null}
            </>
          );
        })()}
        <Flash at={tZero} color={colors.red} peak={0.5} />
      </Shot>

      {/* H: the website vanished */}
      <Shot from={tWebsite} to={tSoDid} push={0.04}>
        <div style={{ position: "absolute", left: 100, top: 300 }}>
          <Disintegrate
            w={760}
            h={600}
            at={tVanished + 4}
            cols={14}
            rows={12}
            dur={22}
            tint={colors.red}
            seed="web"
            render={() => (
              <Browser w={760} url="squid-coin.official" color={frame >= tVanished ? colors.red : PINK}>
                <div style={{ height: 530, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: frame >= tVanished ? "#0B0608" : "#04201D" }}>
                  {frame >= tVanished ? (
                    <>
                      <div style={{ ...big(220, colors.red) }}>404</div>
                      <div style={{ ...mono(36, colors.text) }}>SITE NOT FOUND</div>
                    </>
                  ) : (
                    <>
                      <Shapes size={110} color={PINK} />
                      <div style={{ ...big(90, colors.text), marginTop: 30 }}>PLAY TO EARN</div>
                      <div style={{ marginTop: 20, padding: "12px 40px", borderRadius: 14, background: PINK, ...big(54, "#fff"), textShadow: "none" }}>BUY NOW</div>
                    </>
                  )}
                </div>
              </Browser>
            )}
          />
        </div>
        {frame >= tVanished ? <Sfx name="glitch" at={tVanished} volume={0.6} /> : null}
        {frame >= tVanished + 4 ? <Sfx name="dissolve" at={tVanished + 4} volume={0.7} /> : null}
      </Shot>

      {/* I: and so did $3.3 million */}
      <Shot from={tSoDid} to={tRules} push={0.04}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 230, textAlign: "center" }}>
          {frame >= tThree ? <CountUp at={tThree} to={3300000} dur={30} prefix="$" size={170} color={GOLD} /> : null}
          <div style={{ ...mono(32, colors.text), marginTop: 6, opacity: frame >= tThree ? 1 : 0 }}>OF BUYERS' MONEY</div>
        </div>
        {(() => {
          const fly = easeInOut((frame - tSoDid - 10) / 70);
          return (
            <div style={{ position: "absolute", left: lerp(330, 700, fly), top: lerp(560, 380, fly), transform: `scale(${lerp(1.2, 0.45, fly)}) rotate(${Math.sin(frame / 8) * 8}deg)` }}>
              <MoneyBag size={300} wings />
            </div>
          );
        })()}
        <SeizedStamp at={tMillion + 16} text="GONE" color={colors.red} fontSize={150} rotate={-10} style={{ left: 220, top: 760 }} />
      </Shot>

      {/* J: nobody wins but the house (slot machine) */}
      <Shot from={tRules} to={tBut4} push={0.04}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...big(110, frame >= tNobody ? colors.red : colors.text) }}>NOBODY WINS</div>
        </div>
        <div style={{ position: "absolute", left: 140, top: 400, width: 680, height: 520, borderRadius: 40, background: "linear-gradient(180deg, #8A0818, #3A0610)", border: `10px solid ${GOLD}`, boxShadow: `0 0 80px ${GOLD}55` }}>
          <div style={{ position: "absolute", left: 40, right: 40, top: 40, height: 60, borderRadius: 16, background: "#12040B", display: "flex", alignItems: "center", justifyContent: "center", ...big(48, GOLD) }}>
            {frame >= tHouse ? "THE HOUSE WINS" : "SPIN TO WIN"}
          </div>
          <div style={{ position: "absolute", left: 40, right: 40, top: 130, height: 300, display: "flex", gap: 20 }}>
            {[0, 1, 2].map((i) => {
              const stop = [tNobody, tNobody + 10, tHouse][i];
              const spinning = frame < stop;
              const sym = Math.floor((frame + i * 3) / 2) % 3;
              return (
                <div key={i} style={{ flex: 1, borderRadius: 20, background: "#F4F1EA", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  {!spinning ? <Sfx name="click" at={stop} volume={0.7} /> : null}
                  {spinning ? (
                    <div style={{ transform: `translateY(${((frame * 40) % 120) - 60}px)`, filter: "blur(3px)" }}>
                      <svg width={120} height={120} viewBox="0 0 100 100">
                        {sym === 0 ? <circle cx={50} cy={50} r={38} fill="none" stroke={PINK} strokeWidth={12} /> : sym === 1 ? <polygon points="50,10 92,88 8,88" fill="none" stroke={PINK} strokeWidth={12} strokeLinejoin="round" /> : <rect x={14} y={14} width={72} height={72} fill="none" stroke={PINK} strokeWidth={12} />}
                      </svg>
                    </div>
                  ) : (
                    <div style={{ transform: `scale(${sp(frame, fps, stop, springs.pop)})` }}>
                      <House size={150} color={GOLD} window={colors.red} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {frame >= tHouse ? <Sfx name="kaching" at={tHouse} volume={0.8} /> : null}
        {frame >= tHouse ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1300, pointerEvents: "none" }}>
            {new Array(18).fill(0).map((_, i) => {
              const t = (frame - tHouse) / 30;
              return <div key={i} style={{ position: "absolute", left: 480 + Math.cos(i) * 420 * easeOut(t), top: 660 + Math.sin(i * 1.7) * 380 * easeOut(t) + t * t * 200, width: 50, height: 50, borderRadius: "50%", background: GOLD, opacity: 1 - clamp01(t - 0.6) }} />;
            })}
          </div>
        ) : null}
      </Shot>

      {/* K: teaser: number four didn't run. He died. Or did he? */}
      <Shot from={tBut4} to={end} push={0.05} enter="fade">
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...big(110, colors.text) }}>{frame >= tDied ? "HE DIED." : "#4 DIDN'T RUN"}</div>
          {frame >= tOr ? <div style={{ ...big(130, colors.red), marginTop: 10 }}>OR DID HE?</div> : null}
        </div>
        <div style={{ position: "absolute", left: 100, top: 520 }}>
          <Panel w={760} color={frame >= tDied && frame < tOr + 10 ? "#3A4652" : MINT} pad={20}>
            <Ecg w={708} h={330} flatAt={tDied + 4} blipAt={tOr + 12} color={frame >= tDied ? (frame >= tOr + 12 ? MINT : "#9AA6B2") : MINT} />
            <div style={{ display: "flex", justifyContent: "space-between", ...mono(30, frame >= tDied ? colors.red : MINT), marginTop: 10 }}>
              <span>HEART RATE</span>
              <span>{frame >= tDied + 4 && !(frame >= tOr + 12 && frame < tOr + 30) ? "0" : "72"} BPM</span>
            </div>
          </Panel>
        </div>
        {frame >= tDied + 4 ? <Sfx name="flatline" at={tDied + 4} volume={0.7} durationInFrames={tOr + 10 - tDied - 4} /> : null}
        {frame >= tOr + 12 ? <Sfx name="beep" at={tOr + 12} volume={0.9} /> : null}
        {frame >= tOr + 12 ? <Sfx name="heartbeat" at={tOr + 14} volume={0.9} /> : null}
        {frame >= tDied ? <AbsoluteFill style={{ background: "rgba(0,0,0,0.35)", opacity: clamp01((frame - tDied) / 8), pointerEvents: "none" }} /> : null}
      </Shot>
    </ShakeAt>
  );
};

/* ================================================================== #4 QUADRIGACX */

const Building: React.FC<{ w: number; sign: string; color: string; lit: number }> = ({ w, sign, color, lit }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={w * 1.3} viewBox="0 0 300 390">
      <rect x={40} y={60} width={220} height={330} fill="#1A2430" stroke="#2E3B48" strokeWidth={6} />
      <rect x={70} y={20} width={160} height={50} fill="#1A2430" stroke="#2E3B48" strokeWidth={6} />
      {new Array(7).fill(0).map((_, r) =>
        new Array(5).fill(0).map((__, k) => (
          <rect key={`${r}-${k}`} x={58 + k * 40} y={120 + r * 36} width={24} height={20} fill={random(`bw-${r}-${k}-${Math.floor(frame / 20)}`) < lit ? "#FFE7A8" : "#0E151C"} />
        )),
      )}
      <rect x={30} y={70} width={240} height={40} rx={6} fill={color} />
      <text x={150} y={100} textAnchor="middle" fontFamily={fonts.display} fontSize={32} fill="#07090B" letterSpacing={2}>
        {sign}
      </text>
    </svg>
  );
};

export const Quadriga: React.FC<SceneProps> = ({ c, start, end }) => {
  const frame = useCurrentFrame();
  const tCanada = c("canada");
  const tQuad = c("quadrigacx");
  const tBiggest = c("biggest", 1);
  const tFounder = c("founder");
  const tGerald = c("gerald");
  const tThirty = c("thirty years");
  const tDec = c("in december");
  const tIndia = c("india");
  const tWife = c("wife");
  const tDies = c("dies");
  const tJaipur = c("jaipur");
  const tProblem = c("here's the problem");
  const tOnly = c("only one");
  const tPass = c("passwords");
  const t190 = c("one hundred and ninety");
  const tOver = c("over a hundred");
  const tLocked = c("locked");
  const tForever = c("forever");
  const tInvest = c("investigators");
  const tOpen = c("open the");
  const tEmpty = c("empty");
  const tReg = c("regulators");
  const tFake = c("fake accounts");
  const tTraded = c("traded");
  const tLost = c("lost it");
  const tCalled = c("they called");
  const tOld = c("old-fashioned");
  const tWrapped = c("wrapped");
  const tLawyers = c("lawyers");
  const tDig = c("dig");
  const tReally = c("really");
  const tBut3 = c("but number three");
  const tMillions = c("millions");
  const tForty = c("forty billion");
  const tWeek = c("in a week");

  return (
    <ShakeAt hits={[tEmpty, tForty, tLocked]} amount={28}>
      <Glow color={SKY} y={40} />

      {/* A: Canada's biggest exchange */}
      <Shot from={start} to={tFounder} push={0.05}>
        <div style={{ position: "absolute", left: 60, top: 300, opacity: frame >= tQuad ? 0.45 : 1 }}>
          <DotMap w={840} h={520} view={[-170, 78, -45, 12]} pins={[{ at: PLACES.canada, t: tCanada, label: "CANADA", color: colors.red }]} dotColor="#2E4256" />
        </div>
        <Row top={215}>
          <Pop at={tCanada} style={{ position: "relative" }}>
            <Pill text="CANADA" color={colors.text} size={46} />
          </Pop>
        </Row>
        {frame >= tQuad ? (
          <Pop at={tQuad} style={{ left: 290, top: 380 }} from="up">
            <Building w={380} sign="QUADRIGACX" color={SKY} lit={0.7} />
          </Pop>
        ) : null}
        {frame >= tBiggest ? (
          <Pop at={tBiggest} style={{ left: L0, width: CW, top: 920, textAlign: "center" }}>
            <Pill text="#1 CRYPTO EXCHANGE IN CANADA" color={GOLD} filled size={44} />
          </Pop>
        ) : null}
      </Shot>

      {/* B: the founder, Gerald Cotten, 30 */}
      <Shot from={tFounder} to={tDec} push={0.06}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 52%, ${SKY}33, rgba(0,0,0,0) 40%)` }} />
        <div style={{ position: "absolute", left: 320, top: 340 }}>
          <Person size={660} outfit="suit" hair="neat" shirt="#24324A" tie={SKY} bob={1} />
        </div>
        <Row top={215}>
          <Pop at={tGerald} style={{ position: "relative" }}>
            <Pill text="GERALD COTTEN" color={SKY} filled size={56} />
          </Pop>
        </Row>
        <div style={{ position: "absolute", left: 110, top: 470 }}>
          <Tag at={tFounder} text="FOUNDER + CEO" color={colors.text} size={34} />
        </div>
        {frame >= tThirty ? (
          <Pop at={tThirty} style={{ left: 640, top: 480 }}>
            <div style={{ width: 200, height: 200, borderRadius: "50%", background: GOLD, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${GOLD}88` }}>
              <div style={{ ...mono(26, colors.bg) }}>AGE</div>
              <div style={{ ...big(110, colors.bg), textShadow: "none" }}>30</div>
            </div>
          </Pop>
        ) : null}
      </Shot>

      {/* C: Dec 2018, flies to India with his new wife */}
      <Shot from={tDec} to={tDies} push={0.04}>
        <Row top={215}>
          <Pop at={tDec} style={{ position: "relative" }}>
            <Pill text="DECEMBER 2018" color={colors.text} size={46} />
          </Pop>
        </Row>
        <div style={{ position: "absolute", left: 60, top: 380 }}>
          <DotMap
            w={840}
            h={460}
            view={[-135, 72, 105, -10]}
            pins={[
              { at: PLACES.canada, t: tDec, color: SKY },
              { at: PLACES.india, t: tIndia + 20, color: colors.red },
            ]}
            arcs={[{ from: PLACES.canada, to: PLACES.india, t0: tDec + 8, t1: tIndia + 24, plane: true, color: GOLD }]}
            dotColor="#2E4256"
          />
        </div>
        {frame >= tDec + 8 ? <Sfx name="plane" at={tDec + 8} volume={0.6} /> : null}
        <div style={{ position: "absolute", left: 590, top: 470 }}>
          <Tag at={tIndia} text="INDIA" color={colors.red} size={40} filled />
        </div>
        {frame >= tWife ? (
          <Pop at={tWife} style={{ left: L0, width: CW, top: 900, textAlign: "center" }}>
            <Pill text="♥ WITH HIS NEW WIFE" color={PINK} size={42} />
          </Pop>
        ) : null}
      </Shot>

      {/* D: dies suddenly in Jaipur */}
      <Shot from={tDies} to={tProblem} push={0.04}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...big(130, colors.red) }}>DIED SUDDENLY</div>
        </div>
        <div style={{ position: "absolute", left: 100, top: 420 }}>
          <Panel w={760} color="#3A4652" pad={20}>
            <Ecg w={708} h={300} flatAt={tDies + 8} color={frame >= tDies + 8 ? "#9AA6B2" : MINT} />
          </Panel>
        </div>
        {frame >= tDies + 8 ? <Sfx name="flatline" at={tDies + 8} volume={0.6} /> : null}
        {frame >= tJaipur ? (
          <Pop at={tJaipur} style={{ left: L0, width: CW, top: 860, textAlign: "center" }}>
            <Pill text="HOSPITAL · JAIPUR, INDIA" color={colors.text} size={44} />
          </Pop>
        ) : null}
        {frame >= tDies + 8 ? <AbsoluteFill style={{ backdropFilter: "grayscale(1)", background: "rgba(0,0,0,0.2)", opacity: clamp01((frame - tDies - 8) / 10), pointerEvents: "none" }} /> : null}
      </Shot>

      {/* E: only he knew the passwords */}
      <Shot from={tProblem} to={t190} push={0.05}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 215, textAlign: "center" }}>
          <div style={{ ...big(120, colors.amber) }}>THE PROBLEM</div>
        </div>
        <div style={{ position: "absolute", left: 120, top: 400 }}>
          <Panel w={720} color={frame >= tPass ? colors.red : SKY} pad={34}>
            <div style={{ ...mono(30, colors.dim) }}>CUSTOMER WALLETS · ACCESS</div>
            <div style={{ marginTop: 24, height: 110, borderRadius: 18, background: "#05080A", border: `4px solid ${frame >= tPass ? colors.red : "#2E3944"}`, display: "flex", alignItems: "center", padding: "0 26px", ...big(90, frame >= tPass ? colors.red : colors.text), letterSpacing: "0.15em" }}>
              {frame >= tPass ? "? ? ? ? ? ? ? ?" : "•".repeat(Math.min(10, Math.max(0, Math.floor((frame - tProblem) / 3))))}
            </div>
            <div style={{ marginTop: 24, padding: "14px 0", borderRadius: 16, background: frame >= tPass ? "#3A1014" : SKY, textAlign: "center", ...big(54, frame >= tPass ? colors.red : colors.bg), textShadow: "none" }}>
              {frame >= tPass ? "ACCESS DENIED" : "UNLOCK"}
            </div>
          </Panel>
        </div>
        {frame >= tPass ? <Sfx name="error" at={tPass} volume={0.8} /> : null}
        {frame >= tOnly ? (
          <Pop at={tOnly} style={{ left: L0, width: CW, top: 860, textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 24 }}>
              <div style={{ transform: "scale(0.6)", transformOrigin: "50% 50%", margin: "-60px -30px" }}>
                <Person size={300} outfit="suit" hair="neat" silhouette />
              </div>
              <div style={{ ...big(84, colors.text) }}>ONLY HE KNEW IT</div>
            </div>
          </Pop>
        ) : null}
      </Shot>

      {/* F: $190M owed to 115,000 customers, locked away forever */}
      <Shot from={t190} to={tInvest} push={0.04}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 210, textAlign: "center" }}>
          <CountUp at={t190} to={190000000} dur={40} prefix="$" size={150} color={GOLD} />
          <div style={{ ...mono(30), marginTop: 4 }}>US DOLLARS OWED</div>
        </div>
        <div style={{ position: "absolute", left: 230, top: 450, transform: `rotate(${frame >= tLocked ? 0 : 0}deg)` }}>
          <Vault size={500} open={0} spin={frame >= tLocked ? Math.min(90, (frame - tLocked) * 12) : 0} />
        </div>
        {/* customers around the vault */}
        {frame >= tOver
          ? new Array(36).fill(0).map((_, i) => {
              const a = (i / 36) * Math.PI * 2;
              const s = clamp01((frame - tOver - i * 0.6) / 6);
              return <div key={i} style={{ position: "absolute", left: 480 + Math.cos(a) * 380 - 18, top: 700 + Math.sin(a) * 300 - 18, width: 36, height: 50, borderRadius: 18, background: ["#5B86C4", "#C8B08A", "#9AC8B0", "#B59AC8"][i % 4], transform: `scale(${s})` }} />;
            })
          : null}
        {frame >= tOver ? (
          <Pop at={tOver + 10} style={{ left: L0, width: CW, top: 1010, textAlign: "center" }}>
            <Pill text="115,000 CUSTOMERS" color={colors.text} size={40} />
          </Pop>
        ) : null}
        {frame >= tLocked ? (
          <>
            <Slam at={tLocked + 4} style={{ left: 150, top: 670 }} sound="slam">
              <div style={{ width: 660, height: 54, borderRadius: 27, background: "repeating-linear-gradient(90deg, #8A949E 0 40px, #4E5862 40px 50px)", transform: "rotate(-24deg)", boxShadow: "0 10px 20px rgba(0,0,0,0.6)" }} />
            </Slam>
            <Slam at={tLocked + 7} style={{ left: 150, top: 670 }} sound="none">
              <div style={{ width: 660, height: 54, borderRadius: 27, background: "repeating-linear-gradient(90deg, #8A949E 0 40px, #4E5862 40px 50px)", transform: "rotate(24deg)", boxShadow: "0 10px 20px rgba(0,0,0,0.6)" }} />
            </Slam>
          </>
        ) : null}
        <SeizedStamp at={tForever} text="LOCKED FOREVER" color={colors.red} fontSize={84} rotate={-8} style={{ left: 170, top: 640 }} />
      </Shot>

      {/* G: investigators open the wallets. They're empty. */}
      <Shot from={tInvest} to={tReg} push={0.05}>
        {(() => {
          const open = easeInOut((frame - tOpen) / 22);
          return (
            <>
              {frame >= tOpen ? <Sfx name="creak" at={tOpen} volume={0.8} /> : null}
              <div style={{ position: "absolute", left: 240, top: 330 }}>
                <Vault
                  size={480}
                  open={open}
                  inside={
                    <div style={{ width: "100%", height: "100%", background: "radial-gradient(circle at 50% 60%, #1A2028, #050607 70%)", position: "relative" }}>
                      <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
                        <path d="M10 10 L40 40 M10 10 L20 45 M10 10 L45 20 M18 26 Q26 22 30 18 M24 36 Q34 32 36 24" stroke="rgba(255,255,255,0.35)" strokeWidth={0.8} fill="none" />
                      </svg>
                      {frame >= tEmpty ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...big(170, "#3A4652") }}>$0</div> : null}
                    </div>
                  }
                />
              </div>
              {/* torch beam into the vault */}
              {frame >= tOpen + 10 ? <div style={{ position: "absolute", left: 120, top: 560, width: 520, height: 120, background: "linear-gradient(90deg, rgba(255,250,200,0.0), rgba(255,250,200,0.35))", clipPath: "polygon(0 45%, 100% 0, 100% 100%, 0 55%)", opacity: clamp01((frame - tOpen - 10) / 6) }} /> : null}
              <div style={{ position: "absolute", left: 60, top: 640 }}>
                <BlobCharacter color="#2C4C86" size={260} badge={GOLD} look={{ x: 1, y: -0.3 }} expression={frame >= tEmpty ? "scared" : "calm"} />
              </div>
              <div style={{ position: "absolute", left: 700, top: 680 }}>
                <BlobCharacter color="#3A5A8A" size={220} seed={3} badge={GOLD} look={{ x: -1, y: -0.3 }} expression={frame >= tEmpty ? "scared" : "calm"} />
              </div>
            </>
          );
        })()}
        <Row top={215}>
          <Pop at={tInvest} style={{ position: "relative" }}>
            <Pill text="INVESTIGATORS" color={colors.text} size={44} />
          </Pop>
        </Row>
        <SeizedStamp at={tEmpty + 6} text="EMPTY" color={colors.red} fontSize={170} rotate={-8} style={{ left: 250, top: 880 }} />
        {frame >= tEmpty ? <Sfx name="boom" at={tEmpty} volume={0.6} /> : null}
      </Shot>

      {/* H: the regulator's findings */}
      <Shot from={tReg} to={tCalled} push={0.04}>
        <div style={{ position: "absolute", left: 130, top: 240, width: 700, padding: "36px 40px", borderRadius: 10, background: "#F4F1EA", boxShadow: "0 30px 70px rgba(0,0,0,0.6)", transform: "rotate(-2deg)" }}>
          <div style={{ ...mono(26, "#5A6470") }}>REGULATOR'S REPORT · 2020</div>
          <div style={{ height: 4, background: "#14181D", margin: "16px 0 26px" }} />
          {[
            { at: tFake, t: "FAKE ACCOUNTS" },
            { at: tTraded, t: "TRADED WITH CUSTOMERS' MONEY" },
            { at: tLost, t: "LOST IT" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 0", borderBottom: "3px dashed #C9CFD6", opacity: frame >= r.at ? 1 : 0.18 }}>
              {frame >= r.at ? <Sfx name="stamp" at={r.at} volume={0.6} /> : null}
              <div style={{ width: 66, height: 66, borderRadius: 12, border: `6px solid ${colors.red}`, display: "flex", alignItems: "center", justifyContent: "center", ...big(60, colors.red), textShadow: "none", transform: `scale(${frame >= r.at ? 1 + 0.6 * Math.exp(-(frame - r.at) / 3) : 1})` }}>
                {frame >= r.at ? "✓" : ""}
              </div>
              <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 44, color: "#14181D", lineHeight: 1.05 }}>{r.t}</div>
            </div>
          ))}
        </div>
        <SeizedStamp at={tLost + 8} text="FRAUD" color={colors.red} fontSize={150} rotate={-12} style={{ left: 300, top: 820 }} />
      </Shot>

      {/* I: "an old-fashioned fraud wrapped in modern technology" */}
      <Shot from={tCalled} to={tLawyers} push={0.05}>
        <div style={{ position: "absolute", left: 110, top: 260, width: 740, padding: "40px 40px 34px", borderRadius: 8, background: "linear-gradient(135deg, #E9D9B4, #CDB78A)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)", transform: "rotate(-3deg)", opacity: frame >= tOld ? 1 : 0.25 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 100, color: "#5A3E1A", lineHeight: 0.5 }}>“</div>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: 76, color: "#3A2810", lineHeight: 1.05 }}>an old-fashioned fraud</div>
        </div>
        {frame >= tWrapped ? (
          <Pop at={tWrapped} style={{ left: 140, top: 620 }} sound={false}>
            <Sfx name="glitch" at={tWrapped} volume={0.6} />
            <div style={{ width: 700, padding: "34px 36px", borderRadius: 20, background: "rgba(4,12,20,0.95)", border: `6px solid ${SKY}`, boxShadow: `0 0 60px ${SKY}88`, transform: "rotate(2deg)" }}>
              <div style={{ ...mono(52, SKY), whiteSpace: "normal", lineHeight: 1.2, textShadow: `0 0 18px ${SKY}`, transform: frame < tWrapped + 8 ? `translateX(${(random(`wq-${frame}`) - 0.5) * 30}px)` : "none" }}>wrapped in modern technology”</div>
            </div>
          </Pop>
        ) : null}
        <div style={{ position: "absolute", left: L0, width: CW, top: 980, textAlign: "center", ...mono(28, colors.dim) }}>ONTARIO SECURITIES COMMISSION</div>
      </Shot>

      {/* J: lawyers ask police to dig him up */}
      <Shot from={tLawyers} to={tBut3} push={0.05}>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, #0A1424 0%, #0B0F18 70%)" }} />
        <div style={{ position: "absolute", left: 640, top: 250, width: 150, height: 150, borderRadius: "50%", background: "#F4F1EA", boxShadow: "0 0 80px #F4F1EA88" }} />
        <div style={{ position: "absolute", left: 60, top: 930, width: 840, height: 200, borderRadius: "50% 50% 0 0", background: "#141C14" }} />
        <div style={{ position: "absolute", left: 310, top: 560 }}>
          <Tomb w={340} text={["GERALD", "COTTEN", "1988 – 2018"]} />
        </div>
        {/* dirt pile + flying dirt */}
        <div style={{ position: "absolute", left: 140, top: 900, width: 200, height: 90, borderRadius: "50% 50% 0 0", background: "#3A2A1C" }} />
        {frame >= tDig
          ? new Array(10).fill(0).map((_, i) => {
              const t = ((frame - tDig) % 18) / 18;
              const k = i / 10;
              return <div key={i} style={{ position: "absolute", left: 300 - t * 160 - k * 40, top: 900 - Math.sin(t * Math.PI) * (120 + k * 80), width: 18 + k * 10, height: 14 + k * 8, borderRadius: 6, background: "#5A4030" }} />;
            })
          : null}
        {frame >= tDig ? (
          <div style={{ position: "absolute", left: 250, top: 700, transform: `rotate(${-30 + Math.sin(((frame - tDig) / 18) * Math.PI * 2) * 25}deg)`, transformOrigin: "50% 100%" }}>
            <div style={{ width: 16, height: 220, background: "#8A6A44", margin: "0 auto" }} />
            <div style={{ width: 70, height: 70, borderRadius: "0 0 30px 30px", background: "#9AA6B2", marginTop: -6 }} />
          </div>
        ) : null}
        <Pop at={tLawyers} style={{ left: 110, top: 230 }} from="left">
          <div style={{ width: 460, padding: "20px 26px", borderRadius: 8, background: "#F4F1EA", transform: "rotate(-4deg)", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
            <div style={{ ...mono(22, "#5A6470") }}>LETTER TO POLICE</div>
            <div style={{ fontFamily: fonts.sans, fontWeight: 800, fontSize: 46, color: "#14181D", lineHeight: 1.05, marginTop: 8 }}>PLEASE EXHUME THE BODY</div>
          </div>
        </Pop>
        {frame >= tReally ? (
          <Pop at={tReally} style={{ left: 420, top: 380 }}>
            <Sfx name="creak" at={tReally} volume={0.7} />
            <div style={{ ...big(200, colors.amber), textShadow: `0 0 50px ${colors.amber}` }}>?</div>
          </Pop>
        ) : null}
      </Shot>

      {/* K: teaser: #3 wiped out $40 billion in a week */}
      <Shot from={tBut3} to={end} push={0.05} enter="fade">
        <div style={{ position: "absolute", left: L0, width: CW, top: 240, textAlign: "center" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <div style={{ ...big(130, colors.dim) }}>MILLIONS</div>
            {frame >= tMillions ? <div style={{ position: "absolute", left: -10, right: -10, top: "48%", height: 14, background: colors.red, transformOrigin: "0 50%", transform: `scaleX(${easeOut((frame - tMillions) / 6)}) rotate(-4deg)` }} /> : null}
          </div>
        </div>
        {frame >= tForty ? (
          <Slam at={tForty} style={{ left: L0, width: CW, top: 460, textAlign: "center" }} sound="boom">
            <CountUp at={tForty} to={40000000000} dur={16} prefix="$" size={130} color={GOLD} />
          </Slam>
        ) : null}
        {frame >= tWeek ? (
          <Row top={720} gap={12}>
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => {
              const at = tWeek + i * 3;
              return (
                <div key={i} style={{ position: "relative", width: 100, height: 120, borderRadius: 14, background: "#F4F1EA", display: "flex", alignItems: "center", justifyContent: "center", ...big(64, "#14181D"), textShadow: "none" }}>
                  {d}
                  {frame >= at ? (
                    <>
                      <Sfx name="tick" at={at} volume={0.5} durationInFrames={3} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...big(120, colors.red), textShadow: "none" }}>✕</div>
                    </>
                  ) : null}
                </div>
              );
            })}
          </Row>
        ) : null}
        {frame >= tWeek ? (
          <Pop at={tWeek + 22} style={{ left: L0, width: CW, top: 900, textAlign: "center" }}>
            <Pill text="IN ONE WEEK" color={colors.red} filled size={50} />
          </Pop>
        ) : null}
      </Shot>
    </ShakeAt>
  );
};
