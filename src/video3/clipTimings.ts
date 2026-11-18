// Placeholder until scripts/video3-timings.mjs has run. Do not edit by hand.
export const VIDEO3_FPS = 30;
export const VIDEO3_FRAMES = 1;
export const VIDEO3_CLIP_COUNT = 26;

export const audioParts: { n: number; file: string; startFrame: number; frames: number }[] = [];

export type ClipTiming = {
  n: number;
  title: string;
  part: number;
  startFrame: number;
  endFrame: number;
  startSec: number;
  endSec: number;
};

export const clipTimings: ClipTiming[] = [];
