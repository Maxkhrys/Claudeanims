import React from "react";
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, springs } from "../../theme";
import { sp } from "../../lib/timing";
import { Flash, Sfx } from "../../components";
import { big, clamp01, lerp } from "../kit3d";
import { Crowd, Disintegrate, easeOut, GOLD, GownWoman, MoneyRain, ShakeAt, WantedStamp } from "../cryptoKit";
import { C, CountUp, CX, Glow, L0, CW, mono, Pop, Shot, Slam, StageBackdrop } from "./common";

/*
 * 0:00 cold open. Frame 1 is already loud and bright: fireworks mid-burst, spotlights,
 * a woman in a red ball gown waving on a stage, hard zoom in. At 0.6 s: white flash +
 * boom, she breaks apart into gold pixels. At 1.0 s a red WANTED $5,000,000 stamp slams
 * on with a screen shake. She is not named until #1.
 */

export const FLASH_AT = 18;
export const STAMP_AT = 30;

const WOMAN_W = 456;
const WOMAN_H = 912;
const WOMAN_TOP = 330;

const Woman: React.FC<{ wave: number }> = ({ wave }) => (
  <div style={{ width: WOMAN_W, height: WOMAN_H, position: "relative" }}>
    <div style={{ position: "absolute", left: 0, top: 0, transform: "scale(1.9)", transformOrigin: "0 0" }}>
      <GownWoman wave={wave} />
    </div>
  </div>
);

/** Full-frame layers behind the canvas during the cold open. */
export const OpeningBackdrop: React.FC<{ end: number }> = ({ end }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const zoom = 1 + 0.12 * easeOut(frame / FLASH_AT) + 0.04 * clamp01((frame - FLASH_AT) / (end - FLASH_AT));
  const crowdScale = (0.22 * height) / 330;
  const dim = frame >= FLASH_AT ? 0.35 * clamp01((frame - FLASH_AT) / 20) : 0;
  return (
    <ShakeAt hits={[FLASH_AT, STAMP_AT]} amount={44}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <StageBackdrop bursts={[-14, -8, 2, 9, 40, 58]} dim={dim} intensity={frame >= FLASH_AT ? 0.8 : 1.15} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: -40, bottom: 0, width: width + 80, height: 330 * crowdScale, overflow: "visible" }}>
        <div style={{ transform: `scale(${crowdScale})`, transformOrigin: "0 100%", position: "absolute", left: 0, bottom: 0 }}>
          <Crowd w={(width + 80) / crowdScale} rows={3} cheer={frame < FLASH_AT ? 1 : 0.2} />
        </div>
      </div>
    </ShakeAt>
  );
};

/** Canvas layer of the cold open (woman, stamp, text). */
export const Opening: React.FC<{ c: C; end: number }> = ({ c, end }) => {
  const frame = useCurrentFrame();
  const tDisappear = c("disappeared");
  const tAnd = c("and", 0);
  const zoom = 1 + 0.2 * easeOut(frame / FLASH_AT);
  const wave = frame / 14;
  // gold pixel dust that keeps drifting after she is gone
  const dust =
    frame > FLASH_AT + 20
      ? new Array(26).fill(0).map((_, i) => {
          const t = frame - FLASH_AT - 20;
          const x = CX - 180 + random(`du-${i}`) * 360 + Math.sin(t / 15 + i) * 20 + t * (0.5 + random(`dv-${i}`));
          const y = WOMAN_TOP + 100 + random(`dy-${i}`) * 560 - t * (1.2 + random(`dw-${i}`) * 2);
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 14, height: 14, background: GOLD, opacity: 0.8 * (1 - clamp01(t / 70)), boxShadow: `0 0 12px ${GOLD}` }} />;
        })
      : null;
  return (
    <ShakeAt hits={[FLASH_AT, STAMP_AT]} amount={44}>
      <Sfx name="crowd" at={0} volume={0.8} />
      <Sfx name="firework" at={0} volume={0.7} />
      <Sfx name="slam" at={0} volume={0.45} />
      <Sfx name="boom" at={FLASH_AT} volume={1} />
      <Sfx name="dissolve" at={FLASH_AT} volume={0.8} />
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: `${CX}px 900px` }}>
        {/* spotlight pool */}
        <div style={{ position: "absolute", left: CX - 300, top: WOMAN_TOP + WOMAN_H - 70, width: 600, height: 120, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,245,225,0.75), rgba(255,245,225,0) 70%)" }} />
        <div style={{ position: "absolute", left: CX - WOMAN_W / 2, top: WOMAN_TOP }}>
          <Disintegrate w={WOMAN_W} h={WOMAN_H} at={FLASH_AT} cols={12} rows={22} dur={26} render={() => <Woman wave={wave} />} seed="open" />
        </div>
        {dust}
        {/* empty spot: dotted outline + question mark */}
        {frame >= tDisappear ? (
          <div style={{ position: "absolute", left: CX - WOMAN_W / 2, top: WOMAN_TOP, opacity: clamp01((frame - tDisappear) / 8) * 0.9 }}>
            <svg width={WOMAN_W} height={WOMAN_H} viewBox="0 0 240 480">
              <path
                d="M120 42 C142 42 154 58 154 82 C154 104 140 118 136 132 C150 140 152 170 152 205 C170 300 210 400 226 470 L14 470 C30 400 70 300 88 205 C88 170 90 140 104 132 C100 118 86 104 86 82 C86 58 98 42 120 42 Z"
                fill="rgba(255,255,255,0.04)"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth={4}
                strokeDasharray="12 10"
              />
            </svg>
          </div>
        ) : null}
      </AbsoluteFill>
      {/* $4 billion counter at the top while she vanishes */}
      {frame >= tAnd ? (
        <Pop at={tAnd} style={{ left: L0, width: CW, top: 210, textAlign: "center" }} sound={false}>
          <div style={{ display: "inline-block", padding: "8px 30px", borderRadius: 20, background: "rgba(7,9,11,0.85)", border: `5px solid ${GOLD}` }}>
            <CountUp at={tAnd} to={4000000000} dur={22} prefix="$" size={92} color={GOLD} />
            <div style={{ ...mono(26, colors.text) }}>GONE WITHOUT A TRACE</div>
          </div>
        </Pop>
      ) : null}
      {/* WANTED stamp */}
      <div style={{ position: "absolute", left: L0, width: CW, top: 470, display: "flex", justifyContent: "center", transform: `translateY(${frame > tDisappear ? -(frame - tDisappear) * 0.6 : 0}px)` }}>
        <WantedStamp at={STAMP_AT} />
      </div>
      {frame > end - 6 ? <AbsoluteFill style={{ background: "#fff", opacity: (frame - end + 6) / 10 }} /> : null}
    </ShakeAt>
  );
};

/* ------------------------------------------------------------------ title */

const CARD_COLS = ["#FF2E88", "#3FB6FF", "#9B6BFF", "#1FD1B2", colors.red];

/** "TOP 5 CRYPTO SCAMS THAT VANISHED WITH BILLIONS" + "number one is still out there". */
export const Title: React.FC<{ c: C; start: number; end: number }> = ({ c, start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tCrypto = c("crypto");
  const tVanish = c("vanished");
  const tBillions = c("billions");
  const tNum = c("and number");
  const tStill = c("still");
  const vanishGlitch = frame >= tVanish && frame < tVanish + 10;
  return (
    <ShakeAt hits={[start, tCrypto]} amount={30}>
      <Glow color={GOLD} y={34} a="44" />
      <MoneyRain w={1080} h={1300} from={start} n={22} coins speed={0.8} />
      <Shot from={start} to={tNum} push={0.06} enter="none">
        <Slam at={start} style={{ left: L0, width: CW, top: 210, textAlign: "center" }} sound="boom">
          <div style={{ display: "inline-flex", alignItems: "flex-end", gap: 26 }}>
            <div style={{ ...big(190, colors.text), marginBottom: 40 }}>TOP</div>
            <div style={{ ...big(470, GOLD) }}>5</div>
          </div>
        </Slam>
        <Slam at={tCrypto} style={{ left: L0, width: CW, top: 650, textAlign: "center" }}>
          <div style={{ ...big(150, colors.text) }}>CRYPTO SCAMS</div>
        </Slam>
        {frame >= tVanish ? (
          <div style={{ position: "absolute", left: L0, width: CW, top: 800, textAlign: "center" }}>
            <Sfx name="glitch" at={tVanish} volume={0.6} />
            <div style={{ display: "inline-block", padding: "2px 26px", borderRadius: 16, background: colors.red, transform: `rotate(-2deg) translateX(${vanishGlitch ? (random(`vg-${frame}`) - 0.5) * 40 : 0}px)` }}>
              <div style={{ ...big(116, colors.bg), textShadow: vanishGlitch ? `8px 0 0 #3FB6FF, -8px 0 0 ${GOLD}` : "none" }}>THAT VANISHED</div>
            </div>
          </div>
        ) : null}
        {frame >= tBillions ? (
          <Pop at={tBillions} style={{ left: L0, width: CW, top: 950, textAlign: "center" }}>
            <div style={{ ...big(104, GOLD) }}>WITH BILLIONS</div>
          </Pop>
        ) : null}
      </Shot>
      <Shot from={tNum} to={end} push={0.05}>
        <div style={{ position: "absolute", left: L0, width: CW, top: 240, textAlign: "center" }}>
          <div style={{ ...big(130, colors.text) }}>NUMBER 1 IS</div>
          <div style={{ ...big(150, colors.red), marginTop: 8, opacity: frame >= tStill ? 1 : 0.15 }}>STILL OUT THERE</div>
        </div>
        <div style={{ position: "absolute", left: L0, width: CW, top: 560, display: "flex", justifyContent: "center", gap: 16 }}>
          {[5, 4, 3, 2, 1].map((n, i) => {
            const at = tNum + i * 3;
            const s = sp(frame, fps, at, springs.pop);
            const one = n === 1;
            const ping = one && frame >= tStill ? ((frame - tStill) % 30) / 30 : 0;
            return (
              <div key={n} style={{ position: "relative", width: one ? 220 : 136, height: one ? 330 : 220, marginTop: one ? 0 : 55, transform: `scale(${s}) rotate(${one ? 0 : (i - 1.5) * 2}deg)` }}>
                {frame >= at ? <Sfx name="snap" at={at} volume={0.35} /> : null}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 18,
                    background: one ? "linear-gradient(180deg, #3A0610, #12040B)" : "#121820",
                    border: `6px solid ${CARD_COLS[i]}`,
                    boxShadow: `0 0 ${one ? 70 : 30}px ${CARD_COLS[i]}66`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {one ? (
                    <>
                      <div style={{ position: "absolute", top: 18, transform: "scale(0.52)", transformOrigin: "50% 0" }}>
                        <GownWoman silhouette shadow="#5A0A16" armUp={false} />
                      </div>
                      <div style={{ ...big(200, colors.red), position: "relative", marginTop: 20, textShadow: `0 0 40px ${colors.red}` }}>?</div>
                    </>
                  ) : (
                    <div style={{ ...big(130, "#2A3540") }}>?</div>
                  )}
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: -64, textAlign: "center", ...big(54, one ? colors.red : colors.text) }}>#{n}</div>
                {one && ping > 0 ? <div style={{ position: "absolute", inset: -20 - ping * 50, borderRadius: 30, border: `5px solid ${colors.red}`, opacity: 1 - ping }} /> : null}
              </div>
            );
          })}
        </div>
        {frame >= tStill ? <Sfx name="heartbeat" at={tStill} volume={0.8} /> : null}
      </Shot>
      {frame < start + 8 ? <AbsoluteFill style={{ background: "#fff", opacity: 1 - (frame - start) / 8 }} /> : null}
    </ShakeAt>
  );
};

