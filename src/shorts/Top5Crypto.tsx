import React, { useMemo } from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { colors, springs } from "../theme";
import { createCues, sp, type Word } from "../lib/timing";
import { Background, GlitchBars } from "../components";
import transcript from "../../public/shorts/top5crypto/words.json";
import { big, lerp, SHORT_H, SHORT_W, ShortCaptions } from "./kit3d";
import { Between, type C, LS, NumberCard, Ring, RingWide, StageBackdrop } from "./top5crypto/common";
import { FLASH_AT, Opening, OpeningBackdrop, Title } from "./top5crypto/opening";
import { Squid, Quadriga } from "./top5crypto/stories1";
import { Terra, Ftx } from "./top5crypto/stories2";
import { OneCoin, OneCoinBackdrop, Outro } from "./top5crypto/stories3";
import { Disintegrate, GOLD, GownWoman, PINK, SKY, TEAL } from "./cryptoKit";
import { WhiteFlash } from "./top5crypto/common";

/*
 * Top 5 countdown: "5 crypto scams that vanished with billions" (4:26, 9:16 + 16:9).
 * Narration: public/shorts/top5crypto/vo.mp3 (Max's ElevenLabs v4 take, loudness-normalised).
 * Word timings in words.json (sherpa-onnx zipformer, aligned onto the script text).
 *
 *   open   woman in a red gown on stage -> white flash, gold pixels -> WANTED $5,000,000
 *   title  TOP 5 crypto scams that vanished with billions; #1 is still out there
 *   #5     Squid Game token: show -> coin launch -> +75,000% -> can't sell -> rug pull -> $0
 *   #4     QuadrigaCX: Canada -> Cotten dies in Jaipur -> only he had the passwords -> empty wallets -> dig him up
 *   #3     Terra: $1 peg -> $1, 50c, 9c -> $40B evaporates -> Kwon flees, fake passport -> 15 years
 *   #2     FTX: golden boy, $30B, hype -> news report -> bank run -> $8B gone -> 25 years -> Supreme Court
 *   #1     OneCoin: Wembley 2016, the same woman walks out -> named -> no blockchain -> flight to Athens ->
 *          vanishes (pixels again) -> FBI Ten Most Wanted, $5M
 *   outro  recap + "where is the Cryptoqueen?" comment prompt + follow (no "next up" tease)
 *
 * Vertical layout keeps all key text and visuals in the safe zone (x 162..918, y 192..1536),
 * captions small at y 1150, countdown ring at y 1300 on the left.
 */

export const top5CryptoSchema = z.object({ showCaptions: z.boolean(), landscape: z.boolean().optional() });
export { SHORT_W, SHORT_H };
/** VO is 265.3 s; hold the follow card for a beat after the last word. */
export const TOP5_CRYPTO_FRAMES = 7990;

const WORDS = transcript.words as Word[];

export const Top5Crypto: React.FC<z.infer<typeof top5CryptoSchema>> = ({ showCaptions, landscape = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useMemo(() => createCues(WORDS, fps), [fps]);
  const c: C = cue.at;

  const tTitle = c("five crypto");
  const t5 = c("number five");
  const t4 = c("number four", 1);
  const t3 = c("number three", 1);
  const t2 = c("number two", 1);
  const t1 = c("number one", 2);
  const tOut = c("so think");
  const END = TOP5_CRYPTO_FRAMES;

  const stories = [
    { n: 5, start: t5, end: t4, name: "SQUID GAME COIN", sub: "2021 · $3.3M", color: PINK },
    { n: 4, start: t4, end: t3, name: "QUADRIGACX", sub: "2018 · $190M", color: SKY },
    { n: 3, start: t3, end: t2, name: "TERRA", sub: "2022 · $40B", color: TEAL },
    { n: 2, start: t2, end: t1, name: "FTX", sub: "2022 · $8B", color: "#9B6BFF" },
    { n: 1, start: t1, end: tOut, name: "ONECOIN", sub: "$4B+ · STILL MISSING", color: colors.red },
  ];

  const toSide = sp(frame, fps, t5, springs.smooth, 20) - sp(frame, fps, tOut, springs.smooth, 20);
  const sceneL = lerp(LS.centerL, LS.sideL, toSide);

  const bedVol = (f: number) => {
    const intro = interpolate(f, [0, tTitle, tTitle + 30], [0.05, 0.05, 0.1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const fadeOut = interpolate(f, [END - 45, END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return intro * fadeOut;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio src={staticFile("shorts/top5crypto/vo.mp3")} />
      <Audio src={staticFile("shorts/top5teens/bed.mp3")} volume={bedVol} loop />
      <Background drift={0.35} vignette={0.7}>
        {/* full-frame backdrops (stage) behind the scene canvas */}
        <Between from={0} to={tTitle}>
          <OpeningBackdrop end={tTitle} />
        </Between>
        <Between from={t1} to={tOut}>
          <OneCoinBackdrop c={c} start={t1} end={tOut} />
        </Between>
        {/* scene canvas: laid out on a 60..900 grid, centred in the frame inside the safe zone.
            Landscape: same 1080x1920 canvas, scaled and placed right of the countdown panel. */}
        <div style={landscape ? { position: "absolute", left: sceneL, top: LS.T, width: SHORT_W, height: SHORT_H, transform: `scale(${LS.S})`, transformOrigin: "0 0" } : { position: "absolute", inset: 0 }}>
          <AbsoluteFill style={{ transform: "translateX(54px) scale(0.9)", transformOrigin: "540px 760px" }}>
            <Between from={0} to={tTitle}>
              <Opening c={c} end={tTitle} />
            </Between>
            <Between from={tTitle} to={t5}>
              <Title c={c} start={tTitle} end={t5} />
            </Between>
            <Between from={t5} to={t4}>
              <Squid c={c} start={t5} end={t4} />
            </Between>
            <Between from={t4} to={t3}>
              <Quadriga c={c} start={t4} end={t3} />
            </Between>
            <Between from={t3} to={t2}>
              <Terra c={c} start={t3} end={t2} />
            </Between>
            <Between from={t2} to={t1}>
              <Ftx c={c} start={t2} end={t1} />
            </Between>
            <Between from={t1} to={tOut}>
              <OneCoin c={c} start={t1} end={tOut} landscape={landscape} />
            </Between>
            <Between from={tOut} to={END}>
              <Outro c={c} start={tOut} end={END} />
            </Between>
          </AbsoluteFill>
        </div>

        {stories.map((s) => (
          <Between key={s.n} from={s.start} to={s.end}>
            {landscape ? <RingWide {...s} /> : <Ring {...s} />}
          </Between>
        ))}
        {stories.map((s) => (
          <NumberCard key={`n${s.n}`} at={s.start} n={s.n} color={s.color} />
        ))}
        {[t5, t4, t3, t2, t1, tOut].map((t) => (frame >= t && frame < t + 8 ? <GlitchBars key={`gb${t}`} amount={1 - (frame - t) / 8} seed={`s-${t}`} /> : null))}
      </Background>

      <WhiteFlash at={FLASH_AT} />
      <ShortCaptions
        words={WORDS}
        enabled={showCaptions}
        centerY={landscape ? 1000 : 1150}
        fontSize={landscape ? 56 : 60}
        maxWords={landscape ? 6 : 4}
        maxChars={landscape ? 34 : 22}
        left={landscape ? 260 : 170}
        right={landscape ? 260 : 170}
        hide={[[c("where do"), END]]}
        hot={["billion", "billions", "disappeared", "vanished", "zero", "empty", "died", "fraud", "fake", "gone", "wanted", "murdered", "nobody", "evaporates", "collapses", "sentenced", "arrested", "forever", "exist", "cryptoqueen", "never"]}
      />
    </AbsoluteFill>
  );
};


/* ------------------------------------------------------------------ cover / thumbnail (spoiler-free) */

/**
 * No lineup, names, numbers order or targets: one anonymous woman in a red gown on a bright
 * stage, frozen mid-way through breaking into gold pixels, with TOP 5 and a curiosity line.
 */
const ThumbWoman: React.FC<{ scale: number }> = ({ scale }) => (
  <Disintegrate
    w={240 * scale}
    h={480 * scale}
    at={-13}
    cols={14}
    rows={26}
    dur={34}
    seed="thumb"
    render={() => (
      <div style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        <GownWoman wave={0.15} />
      </div>
    )}
  />
);

export const Top5CryptoThumbYT: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    <StageBackdrop bursts={[-12, -16, -9, -20]} intensity={1.2} />
    <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(7,9,11,0.85) 0%, rgba(7,9,11,0.55) 45%, rgba(7,9,11,0) 70%)" }} />
    <div style={{ position: "absolute", left: 1180, top: 70 }}>
      <ThumbWoman scale={2.05} />
    </div>
    <div style={{ position: "absolute", left: 90, top: 70, width: 1050 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
        <div style={{ ...big(200, colors.text), marginBottom: 46 }}>TOP</div>
        <div style={{ ...big(440, GOLD), textShadow: `0 14px 0 #6B4A00, 0 0 80px ${GOLD}88` }}>5</div>
      </div>
      <div style={{ ...big(150, colors.text), marginTop: 8 }}>CRYPTO SCAMS</div>
      <div style={{ display: "inline-block", marginTop: 18, padding: "6px 34px", borderRadius: 22, background: colors.red, transform: "rotate(-2deg)" }}>
        <div style={{ ...big(150, colors.bg), textShadow: "none" }}>THAT VANISHED</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 96, top: 905 }}>
      <div style={{ padding: "10px 30px", borderRadius: 16, background: "rgba(7,9,11,0.92)", border: `6px solid ${GOLD}`, ...big(76, GOLD), textShadow: "none" }}>$ BILLIONS GONE</div>
    </div>
  </AbsoluteFill>
);

/** Upload cover (1080x1920): everything inside x 162..918, y 300..1600. */
export const Top5CryptoCover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    <StageBackdrop bursts={[-12, -16, -9, -20]} intensity={1.2} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(7,9,11,0.8) 0%, rgba(7,9,11,0.3) 40%, rgba(7,9,11,0.1) 60%, rgba(7,9,11,0.7) 100%)" }} />
    <div style={{ position: "absolute", left: 162, width: 756, top: 300, textAlign: "center" }}>
      <div style={{ display: "inline-flex", alignItems: "flex-end", gap: 18 }}>
        <div style={{ ...big(140, colors.text), marginBottom: 34 }}>TOP</div>
        <div style={{ ...big(300, GOLD), textShadow: `0 10px 0 #6B4A00, 0 0 60px ${GOLD}88` }}>5</div>
      </div>
      <div style={{ ...big(110, colors.text), marginTop: 4 }}>CRYPTO SCAMS</div>
      <div style={{ display: "inline-block", marginTop: 12, padding: "4px 28px", borderRadius: 18, background: colors.red, transform: "rotate(-2deg)" }}>
        <div style={{ ...big(108, colors.bg), textShadow: "none" }}>THAT VANISHED</div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 540 - 175, top: 840 }}>
      <ThumbWoman scale={1.45} />
    </div>
    <div style={{ position: "absolute", left: 162, width: 756, top: 1500, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "8px 26px", borderRadius: 16, background: "rgba(7,9,11,0.92)", border: `5px solid ${GOLD}`, ...big(64, GOLD), textShadow: "none" }}>#1 IS STILL OUT THERE</div>
    </div>
  </AbsoluteFill>
);
