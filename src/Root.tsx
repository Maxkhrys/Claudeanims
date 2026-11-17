import React from "react";
import { Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { VIDEO } from "./theme";
import { Clip1, clip1Schema } from "./clips/Clip1";
import { Clip2, clip2Schema } from "./clips/Clip2";
import { Clip3, clip3Schema } from "./clips/Clip3";
import { Clip4, clip4Schema } from "./clips/Clip4";
import { Clip5, clip5Schema } from "./clips/Clip5";
import { Clip6, clip6Schema } from "./clips/Clip6";
import { Clip7, clip7Schema } from "./clips/Clip7";
import { StyleGuide } from "./clips/StyleGuide";

/** Composition length always follows the narration audio. */
const durationFromAudio = (file: string) => async () => {
  const seconds = await getAudioDurationInSeconds(staticFile(file));
  return { durationInFrames: Math.ceil(seconds * VIDEO.fps) };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Clip1"
        component={Clip1}
        schema={clip1Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 43}
        calculateMetadata={durationFromAudio("audio/clip1.mp3")}
      />
      <Composition
        id="Clip2"
        component={Clip2}
        schema={clip2Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 51}
        calculateMetadata={durationFromAudio("audio/clip2.mp3")}
      />
      <Composition
        id="Clip3"
        component={Clip3}
        schema={clip3Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 48}
        calculateMetadata={durationFromAudio("audio/clip3.mp3")}
      />
      <Composition
        id="Clip4"
        component={Clip4}
        schema={clip4Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 48}
        calculateMetadata={durationFromAudio("audio/clip4.mp3")}
      />
      <Composition
        id="Clip5"
        component={Clip5}
        schema={clip5Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 48}
        calculateMetadata={durationFromAudio("audio/clip5.mp3")}
      />
      <Composition
        id="Clip6"
        component={Clip6}
        schema={clip6Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 48}
        calculateMetadata={durationFromAudio("audio/clip6.mp3")}
      />
      <Composition
        id="Clip7"
        component={Clip7}
        schema={clip7Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 48}
        calculateMetadata={durationFromAudio("audio/clip7.mp3")}
      />
      <Composition
        id="StyleGuide"
        component={StyleGuide}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 10}
      />
    </>
  );
};
