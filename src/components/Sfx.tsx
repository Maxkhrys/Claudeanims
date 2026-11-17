import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

export type SfxName =
  | "type"
  | "tick"
  | "click"
  | "pop"
  | "slam"
  | "stamp"
  | "glitch"
  | "whoosh"
  | "coin"
  | "notify"
  | "error"
  | "riser"
  | "crash"
  | "door"
  | "rumble"
  | "snap";

/** Master level for all sound effects, relative to the narration. */
export const SFX_VOLUME = 0.55;

/**
 * Plays a sound effect from public/sfx at frame `at`.
 * With `durationInFrames` the sound is cut there; add `loop` for typing/ticking beds.
 * Most components (TitleSlam, Counter, Terminal, ChatWindow, Chip, glitches...)
 * already play their own sound; use this for anything extra.
 */
export const Sfx: React.FC<{
  name: SfxName;
  at?: number;
  volume?: number;
  durationInFrames?: number;
  loop?: boolean;
}> = ({ name, at = 0, volume = 1, durationInFrames, loop = false }) => {
  if (durationInFrames !== undefined && durationInFrames < 1) return null;
  return (
    <Sequence
      from={Math.max(0, Math.round(at))}
      durationInFrames={durationInFrames === undefined ? undefined : Math.max(1, Math.round(durationInFrames))}
      layout="none"
    >
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume * SFX_VOLUME} loop={loop} />
    </Sequence>
  );
};
