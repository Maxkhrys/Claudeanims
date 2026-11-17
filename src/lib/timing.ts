import { spring, type SpringConfig } from "remotion";

export type Word = { text: string; start: number; end: number };
export type Transcript = { words: Word[] };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, "");

/**
 * Looks up spoken words in a Whisper transcript and returns frame numbers.
 * `query` can be one word ("half") or a phrase ("and he says"); `nth` picks
 * the nth occurrence (0-based). Throws if not found, so a re-recorded
 * voiceover with different wording fails loudly instead of drifting.
 */
export const createCues = (words: Word[], fps: number) => {
  const tokens = words.map((w) => norm(w.text));

  const find = (query: string, nth = 0) => {
    const q = query.split(/\s+/).map(norm).filter(Boolean);
    let seen = 0;
    for (let i = 0; i <= tokens.length - q.length; i++) {
      if (q.every((t, j) => tokens[i + j] === t)) {
        if (seen === nth) return { first: words[i], last: words[i + q.length - 1] };
        seen++;
      }
    }
    throw new Error(`Cue "${query}" (occurrence ${nth}) not found in transcript`);
  };

  return {
    /** frame where the word/phrase starts */
    at: (query: string, nth = 0, offsetSec = 0) =>
      Math.round((find(query, nth).first.start + offsetSec) * fps),
    /** frame where the word/phrase ends */
    end: (query: string, nth = 0, offsetSec = 0) =>
      Math.round((find(query, nth).last.end + offsetSec) * fps),
  };
};

export type Cues = ReturnType<typeof createCues>;

/** Merge a spoken phrase into one caption word, e.g. "Friendly Chemist" -> "FriendlyChemist". */
export const replacePhrase = (words: Word[], phrase: string, replacement: string): Word[] => {
  const q = phrase.split(/\s+/).map(norm);
  const out: Word[] = [];
  for (let i = 0; i < words.length; i++) {
    if (q.every((t, j) => words[i + j] && norm(words[i + j].text) === t)) {
      const last = words[i + q.length - 1];
      const tail = last.text.match(/[.,!?…]+["']?$/)?.[0].replace(/["']/g, "") ?? "";
      out.push({ text: replacement + tail, start: words[i].start, end: last.end });
      i += q.length - 1;
    } else {
      out.push(words[i]);
    }
  }
  return out;
};

/** Spring that starts at frame `at`. Returns 0 before it. */
export const sp = (
  frame: number,
  fps: number,
  at: number,
  config: Partial<SpringConfig>,
  durationInFrames?: number,
) => spring({ frame: frame - at, fps, config, durationInFrames });

import { useMemo } from "react";
import { useVideoConfig } from "remotion";

/** Hook form of createCues: `c("word")` gives the frame a word starts. */
export const useCues = (words: Word[]) => {
  const { fps, durationInFrames } = useVideoConfig();
  const cue = useMemo(() => createCues(words, fps), [words, fps]);
  return { c: cue.at, ce: cue.end, fps, D: durationInFrames };
};

/** Caption words with the character names joined up. */
export const captionNames = (words: Word[]) =>
  [
    ["Friendly Chemist's", "FriendlyChemist's"],
    ["Friendly Chemist", "FriendlyChemist"],
    ["Red and White", "Redandwhite"],
  ].reduce((w, [from, to]) => replacePhrase(w, from, to), words);
