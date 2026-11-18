import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { z } from "zod";
import { colors } from "../theme";
import { Background, Captions } from "../components";
import { audioParts, clipTimings } from "./clipTimings";
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
import { Clip15 } from "./Clip15";
import { Clip16 } from "./Clip16";
import { Clip17 } from "./Clip17";
import { Clip18 } from "./Clip18";
import { Clip19 } from "./Clip19";
import { Clip20 } from "./Clip20";
import { Clip21 } from "./Clip21";
import { Clip22 } from "./Clip22";
import { Clip23 } from "./Clip23";
import { Clip24 } from "./Clip24";
import { Clip25 } from "./Clip25";
import { Clip26 } from "./Clip26";

/** Index 0 is clip 1. */
export const VIDEO3_CLIPS = [Clip1, Clip2, Clip3, Clip4, Clip5, Clip6, Clip7, Clip8, Clip9, Clip10, Clip11, Clip12, Clip13, Clip14, Clip15, Clip16, Clip17, Clip18, Clip19, Clip20, Clip21, Clip22, Clip23, Clip24, Clip25, Clip26];

export const video3Schema = z.object({ showCaptions: z.boolean() });
export const video3ClipSchema = z.object({ n: z.number(), showCaptions: z.boolean() });

/** The Lapsus$ video: narration parts played back to back, clips placed by clipTimings. */
export const Video3: React.FC<z.infer<typeof video3Schema>> = ({ showCaptions }) => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    {audioParts.map((p) => (
      <Sequence key={p.n} from={p.startFrame} durationInFrames={p.frames} layout="none" name={`audio part ${p.n}`}>
        <Audio src={staticFile(p.file)} />
      </Sequence>
    ))}
    <Background>
      {clipTimings.map((t) => {
        const Clip = VIDEO3_CLIPS[t.n - 1];
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
export const Video3Clip: React.FC<z.infer<typeof video3ClipSchema>> = ({ n, showCaptions }) => {
  const t = clipTimings.find((c) => c.n === n)!;
  const part = audioParts.find((p) => p.n === t.part)!;
  const Clip = VIDEO3_CLIPS[n - 1];
  const words = useMemo(() => clipWords(n), [n]);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio src={staticFile(part.file)} trimBefore={t.startFrame - part.startFrame} />
      <Background>
        <Clip />
      </Background>
      <Captions words={words} enabled={showCaptions} />
    </AbsoluteFill>
  );
};
