import React from "react";
import { Composition, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { VIDEO } from "./theme";
import { Clip1, clip1Schema } from "./clips/Clip1";
import { Clip2, clip2Schema } from "./clips/Clip2";
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
