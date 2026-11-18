import { useMemo } from "react";
import { useVideoConfig } from "remotion";
import transcript from "../../public/audio/video3/full.json";
import { createCues, type Word } from "../lib/timing";
import { clipTimings } from "./clipTimings";

// Whisper's spellings, corrected for captions and cue lookups.
const FIXES: [RegExp, string][] = [
  [/^(Lapsis|Lapses|Lapsus|Lapsys|Lapsos)(?=[.,?!']|$)/i, "Lapsus"],
  [/^(Kurtai|Kurtaj|Kurtay|Curtai|Curtaj|Kertaj)(?=[.,?!']|$)/i, "Kurtaj"],
  [/^(Aryan|Arian|Arion|Aaron)(?=[.,?!']|$)/, "Arion"],
];
const fix = (text: string) => FIXES.reduce((t, [re, to]) => t.replace(re, to), text);

/** Every transcribed word of the video 3 narration, timed from the start of part 1. */
export const fullWords = (transcript.words as Word[]).map((w) => ({ ...w, text: fix(w.text) }));

const timing = (n: number) => {
  const t = clipTimings.find((c) => c.n === n);
  if (!t) throw new Error(`Clip ${n} of video 3 has no narration yet. Add its audio part and run npm run timings:video3.`);
  return t;
};

/** The words of clip `n`, re-timed so 0 is the start of that clip. */
export const clipWords = (n: number): Word[] => {
  const t = timing(n);
  return fullWords
    .filter((w) => w.start >= t.startSec - 0.001 && w.start < t.endSec - 0.001)
    .map((w) => ({ ...w, start: +(w.start - t.startSec).toFixed(3), end: +(w.end - t.startSec).toFixed(3) }));
};

/**
 * Cue lookup for one clip of video 3; frames are local to the clip.
 *   const { c, ce, D } = useClip(3);
 */
export const useClip = (n: number) => {
  const { fps } = useVideoConfig();
  const words = useMemo(() => clipWords(n), [n]);
  const cue = useMemo(() => createCues(words, fps), [words, fps]);
  const t = timing(n);
  return { c: cue.at, ce: cue.end, fps, D: t.endFrame - t.startFrame, words };
};
