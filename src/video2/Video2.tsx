import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { z } from "zod";
import { colors } from "../theme";
import { Background, Captions } from "../components";
import { clipTimings } from "./clipTimings";
import { clipWords, fullWords } from "./words";
import { Clip1 } from "./Clip1";
import { Clip2 } from "./Clip2";
import { Clip3 } from "./Clip3";
import { Clip4 } from "./Clip4";
import { Clip5 } from "./Clip5";
import { Clip6 } from "./Clip6";
import { Clip7 } from "./Clip7";
import { Clip8 } from "./Clip8";
import { Clip9 } from "./Clip9";
import { Clip10 } from "./Clip10";
import { Clip11 } from "./Clip11";
import { Clip12 } from "./Clip12";
import { Clip13 } from "./Clip13";
import { Clip14 } from "./Clip14";

const AUDIO = "audio/video2/full.mp3";
export const VIDEO2_CLIPS = [Clip1, Clip2, Clip3, Clip4, Clip5, Clip6, Clip7, Clip8, Clip9, Clip10, Clip11, Clip12, Clip13, Clip14];

export const video2Schema = z.object({ showCaptions: z.boolean() });
export const video2ClipSchema = z.object({ n: z.number(), showCaptions: z.boolean() });

/** The whole AlphaBay video: one audio track, 14 clips placed by clipTimings. */
export const Video2: React.FC<z.infer<typeof video2Schema>> = ({ showCaptions }) => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    <Audio src={staticFile(AUDIO)} />
    <Background>
      {clipTimings.map((t, i) => {
        const Clip = VIDEO2_CLIPS[i];
        return (
          <Sequence key={t.n} from={t.startFrame} durationInFrames={t.endFrame - t.startFrame} name={`${t.n} ${t.title}`}>
            <Clip />
          </Sequence>
        );
      })}
    </Background>
    <Captions words={fullWords} enabled={showCaptions} />
  </AbsoluteFill>
);

/** One clip on its own, with the matching slice of the narration. */
export const Video2Clip: React.FC<z.infer<typeof video2ClipSchema>> = ({ n, showCaptions }) => {
  const t = clipTimings[n - 1];
  const Clip = VIDEO2_CLIPS[n - 1];
  const words = useMemo(() => clipWords(n), [n]);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio src={staticFile(AUDIO)} trimBefore={t.startFrame} />
      <Background>
        <Clip />
      </Background>
      <Captions words={words} enabled={showCaptions} />
    </AbsoluteFill>
  );
};
