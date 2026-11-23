import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { colors, springs } from "../theme";
import { createCues, sp, type Word } from "../lib/timing";
import { Background, GlitchBars, Sfx } from "../components";
import { big, clamp01, lerp, ShortCaptions } from "../shorts/kit3d";
import { Glow, Hit, Logo, type LogoId, mono, type SceneProps, WhiteFlash, YELLOW } from "./kit";
import { ColdOpen } from "./ColdOpen";
import { Morris } from "./Morris";
import { Mitnick } from "./Mitnick";
import b0 from "../../public/everyhack/block00.json";
import b1 from "../../public/everyhack/block01.json";
import b2 from "../../public/everyhack/block02.json";

/*
 * "Every Famous Hack Explained" (format 6), built block by block as Max records them.
 *
 * Each script block = one segment: its own mp3 + word timings (public/everyhack/blockNN.*)
 * and its own scene component. Segments play back to back; every hack gets a 1.3 s title card
 * (year, name, real logos) before it. To add the next recorded block:
 *   1. drop blockNN.mp3 + blockNN.json into public/everyhack (scripts/everyhack-align.py)
 *   2. write its scene (src/everyhack/<Name>.tsx) and add it to SEGMENTS below
 *   3. the long video picks it up automatically (EveryHack-YT renders every segment)
 * The last segment's TEASER line is cut and an end card is added, so each partial render
 * ends cleanly (no "next up" pointing at a block that isn't there yet).
 *
 * Every scene draws on a 1000x1000 canvas:
 *   9:16  canvas at x 162..918, y 200..956 (inside the TikTok/Reels/Shorts safe zone),
 *         small captions centred at y 1110 (58%), hack chip at y 1260.
 *   16:9  canvas 880px tall in the middle, hack number/year/name on the left, logos on the right.
 */

type Seg = {
  id: string;
  audio: string;
  words: Word[];
  sec: number;
  Comp: React.FC<SceneProps>;
  /** hack segments get a title card and a side panel */
  card?: { n: number; year: string; name: string; logos: LogoId[] };
  /** first words of the TEASER line (cut when this segment ends a render) */
  teaser?: string;
  /** pinned-comment question shown on the end card when this segment ends a render */
  question?: string;
};

export const TOTAL_HACKS = 14;

export const SEGMENTS: Seg[] = [
  { id: "open", audio: "everyhack/block00.mp3", words: b0.words as Word[], sec: 15.6, Comp: ColdOpen },
  {
    id: "morris",
    audio: "everyhack/block01.mp3",
    words: b1.words as Word[],
    sec: 55.2,
    Comp: Morris,
    card: { n: 1, year: "1988", name: "THE MORRIS WORM", logos: ["cornell", "mit"] },
    teaser: "morris broke",
    question: "Would you get a professor job after breaking the internet?",
  },
  {
    id: "mitnick",
    audio: "everyhack/block02.mp3",
    words: b2.words as Word[],
    sec: 46.05,
    Comp: Mitnick,
    card: { n: 2, year: "1995", name: "KEVIN MITNICK", logos: ["motorola", "nokia", "fbi"] },
    teaser: "mitnick talked",
    question: "Would YOU have given him the password?",
  },
];

const FPS = 30;
const CARD = 40;
const END_CARD = 96;

/** Frames a segment plays for; `cut` = stop before its teaser line. */
const segFrames = (s: Seg, cut: boolean) => {
  if (cut && s.teaser) {
    const t = createCues(s.words, FPS).at(s.teaser);
    // the voice stops just before the teaser; the picture holds a beat longer
    return { dur: t + 18, audioEnd: t - 3 };
  }
  const d = Math.ceil(s.sec * FPS) + 6;
  return { dur: d, audioEnd: d };
};

type Placed = { seg: Seg; from: number; dur: number; audioEnd: number; cardFrom: number | null };

export const layoutSegments = (ids: string[] | undefined, cutLast = true) => {
  const segs = ids && ids.length ? SEGMENTS.filter((s) => ids.includes(s.id)) : SEGMENTS;
  const out: Placed[] = [];
  let t = 0;
  segs.forEach((s, i) => {
    let cardFrom: number | null = null;
    if (s.card && i > 0) {
      cardFrom = t;
      t += CARD;
    }
    const { dur, audioEnd } = segFrames(s, cutLast && i === segs.length - 1);
    out.push({ seg: s, from: t, dur, audioEnd, cardFrom });
    t += dur;
  });
  return { placed: out, end: t, total: t + END_CARD };
};

/* ------------------------------------------------------------------ pieces */

/** Places the 1000x1000 scene canvas for the current format. */
const Canvas: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  const s = portrait ? 0.756 : 0.88;
  const left = portrait ? 162 : (width - 1000 * s) / 2;
  const top = portrait ? 200 : 22;
  return (
    <div style={{ position: "absolute", left, top, width: 1000 * s, height: 1000 * s, borderRadius: 34, overflow: "hidden", border: "4px solid #1E2A32", boxShadow: `0 0 80px rgba(0,0,0,0.8), 0 0 40px ${YELLOW}14` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 1000, transform: `scale(${s})`, transformOrigin: "0 0", background: colors.bg }}>{children}</div>
    </div>
  );
};

/** Full-frame title card before each hack: HACK #n, year, name, real logos. */
const HackCard: React.FC<{ n: number; year: string; name: string; logos: LogoId[] }> = ({ n, year, name, logos }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const s = sp(frame, fps, 0, springs.slam);
  const out = clamp01((frame - CARD + 7) / 7);
  const k = portrait ? 1 : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, opacity: 1 - out }}>
      <Sfx name="whoosh" at={0} volume={0.6} />
      <Sfx name="boom" at={0} volume={0.45} />
      <Glow color={YELLOW} y={portrait ? 33 : 42} a="38" />
      <div style={{ position: "absolute", left: portrait ? 162 : 0, width: portrait ? 756 : width, top: portrait ? 300 : 120, textAlign: "center", transform: `scale(${lerp(1.8, 1, s) * k})` }}>
        <div style={{ ...mono(portrait ? 40 : 46, colors.text) }}>
          HACK {String(n).padStart(2, "0")} / {TOTAL_HACKS}
        </div>
        <div style={{ ...big(portrait ? 300 : 340, YELLOW), marginTop: 10 }}>{year}</div>
        <div style={{ marginTop: 14 }}>
          <Hit text={name} size={portrait ? 92 : 110} color="#FFFFFF" rotate={-2} />
        </div>
        <div style={{ marginTop: portrait ? 60 : 50, display: "flex", justifyContent: "center", alignItems: "center", gap: 30, opacity: clamp01((frame - 6) / 6) }}>
          {logos.map((l) => (
            <Logo key={l} id={l} h={portrait ? 74 : 84} maxW={260} />
          ))}
        </div>
      </div>
      {frame < 8 ? <GlitchBars amount={1 - frame / 8} seed={`card-${n}`} /> : null}
    </AbsoluteFill>
  );
};

/** 16:9 side panels: progress + year + name on the left, logos on the right. */
const SidePanels: React.FC<{ card: NonNullable<Seg["card"]>; dur: number }> = ({ card, dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = sp(frame, fps, 4, springs.pop);
  const p = clamp01(frame / dur);
  return (
    <>
      <div style={{ position: "absolute", left: 50, top: 200, width: 400, opacity: e, transform: `translateX(${(1 - e) * -60}px)` }}>
        <div style={{ ...mono(30, colors.dim) }}>
          HACK {String(card.n).padStart(2, "0")} / {TOTAL_HACKS}
        </div>
        <div style={{ ...big(170, YELLOW), marginTop: 16 }}>{card.year}</div>
        <div style={{ ...big(78, colors.text), whiteSpace: "normal", marginTop: 12 }}>{card.name}</div>
        <div style={{ marginTop: 30, width: 360, height: 12, borderRadius: 6, background: "#1E2A32" }}>
          <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 6, background: YELLOW }} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 50, top: 220, width: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 40, opacity: e, transform: `translateX(${(1 - e) * 60}px)` }}>
        {card.logos.map((l) => (
          <Logo key={l} id={l} h={l === "fbi" ? 170 : 90} maxW={300} />
        ))}
      </div>
    </>
  );
};

/** 9:16 chip under the captions: year + name. */
const Chip: React.FC<{ card: NonNullable<Seg["card"]> }> = ({ card }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = sp(frame, fps, 6, springs.pop);
  return (
    <div style={{ position: "absolute", left: 162, width: 756, top: 1250, display: "flex", justifyContent: "center", transform: `scale(${e})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 24px", borderRadius: 16, background: "rgba(7,9,11,0.9)", border: `4px solid ${YELLOW}` }}>
        <div style={{ ...big(54, YELLOW) }}>{card.year}</div>
        <div style={{ ...big(54, colors.text) }}>{card.name}</div>
      </div>
    </div>
  );
};

const EndCard: React.FC<{ question: string }> = ({ question }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const portrait = height > width;
  const e = sp(frame, fps, 0, springs.pop);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Glow color={YELLOW} y={portrait ? 35 : 42} a="30" />
      <Sfx name="whoosh" at={0} volume={0.5} />
      <div style={{ position: "absolute", left: portrait ? 162 : 260, width: portrait ? 756 : width - 520, top: portrait ? 330 : 170, textAlign: "center", transform: `scale(${lerp(0.7, 1, e)})`, opacity: clamp01(e * 2) }}>
        <Img src={staticFile("thumbnails/onion-logo.png")} style={{ height: portrait ? 190 : 200 }} />
        <div style={{ ...big(portrait ? 76 : 90, colors.text), whiteSpace: "normal", marginTop: 30, lineHeight: 1.05 }}>{question}</div>
        <div style={{ marginTop: 40 }}>
          <Hit text="TELL ME IN THE COMMENTS" size={portrait ? 58 : 66} />
        </div>
        <div style={{ ...mono(portrait ? 30 : 34, colors.dim), marginTop: 44 }}>FOLLOW THE ONION ARCHIVE</div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ the video */

export const everyHackSchema = z.object({
  showCaptions: z.boolean(),
  /** segment ids to include, in order; empty = all recorded blocks */
  blocks: z.array(z.string()),
});

const SegmentView: React.FC<{ p: Placed; showCaptions: boolean; ending: boolean }> = ({ p, showCaptions }) => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  const { seg } = p;
  const c = useMemo(() => createCues(seg.words, FPS).at, [seg]);
  const words = useMemo(() => seg.words.filter((w) => w.start * FPS < p.audioEnd), [seg, p.audioEnd]);
  const Comp = seg.Comp;
  return (
    <AbsoluteFill>
      <Audio src={staticFile(seg.audio)} endAt={p.audioEnd} />
      <Background drift={0.3} vignette={0.7}>
        <Canvas>
          <Comp c={c} D={p.dur} />
        </Canvas>
        {seg.card ? portrait ? <Chip card={seg.card} /> : <SidePanels card={seg.card} dur={p.dur} /> : null}
      </Background>
      <ShortCaptions
        words={words}
        enabled={showCaptions}
        centerY={portrait ? 1110 : 990}
        fontSize={portrait ? 58 : 50}
        maxWords={portrait ? 4 : 6}
        maxChars={portrait ? 22 : 36}
        left={portrait ? 170 : 420}
        right={portrait ? 170 : 420}
        hide={[]}
        hot={["dark", "leaked", "mistake", "crash", "choke", "convicted", "accident", "purpose", "wanted", "telephone", "password", "nuclear", "legally", "fbi", "f.b.i."]}
      />
    </AbsoluteFill>
  );
};

export const EveryHack: React.FC<z.infer<typeof everyHackSchema>> = ({ showCaptions, blocks }) => {
  const { placed, end, total } = useMemo(() => layoutSegments(blocks), [blocks]);
  const last = placed[placed.length - 1];
  const bed = (f: number) => 0.07 * interpolate(f, [total - 40, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio src={staticFile("shorts/top5teens/bed.mp3")} volume={bed} loop />
      {placed.map((p) => (
        <React.Fragment key={p.seg.id}>
          {p.cardFrom !== null && p.seg.card ? (
            <Sequence from={p.cardFrom} durationInFrames={CARD}>
              <HackCard {...p.seg.card} />
            </Sequence>
          ) : null}
          <Sequence from={p.from} durationInFrames={p.dur}>
            <SegmentView p={p} showCaptions={showCaptions} ending={p === last} />
          </Sequence>
        </React.Fragment>
      ))}
      <Sequence from={end} durationInFrames={END_CARD}>
        <EndCard question={last.seg.question ?? "Which hack shocked you most?"} />
      </Sequence>
      {placed.map((p) => (p.cardFrom !== null ? <WhiteFlash key={`f${p.seg.id}`} at={p.cardFrom} hold={1} fade={6} /> : null))}
    </AbsoluteFill>
  );
};

export const everyHackFrames = (blocks: string[]) => layoutSegments(blocks).total;
