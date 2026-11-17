import { useMemo } from "react";
import { useVideoConfig } from "remotion";
import transcript from "../../public/audio/video2/full.json";
import { createCues, type Word } from "../lib/timing";
import { clipTimings } from "./clipTimings";

/** Every word of the video 2 narration, timed from the start of the full audio. */
export const fullWords = transcript.words as Word[];

/** The words of clip `n` (1-based), re-timed so 0 is the start of that clip. */
export const clipWords = (n: number): Word[] => {
  const t = clipTimings[n - 1];
  return fullWords
    .filter((w) => w.start >= t.startSec - 0.001 && w.start < t.endSec - 0.001)
    .map((w) => ({ ...w, start: +(w.start - t.startSec).toFixed(3), end: +(w.end - t.startSec).toFixed(3) }));
};

/**
 * Cue lookup for one clip of video 2. Frames are local to the clip, which is
 * what you want inside its <Sequence>.
 *   const { c, ce, D } = useClip(3);
 *   c("Thailand")  -> frame where "Thailand" is spoken in clip 3
 *   D              -> length of the clip in frames
 */
export const useClip = (n: number) => {
  const { fps } = useVideoConfig();
  const words = useMemo(() => clipWords(n), [n]);
  const cue = useMemo(() => createCues(words, fps), [words, fps]);
  const t = clipTimings[n - 1];
  return { c: cue.at, ce: cue.end, fps, D: t.endFrame - t.startFrame, words };
};
