import React from "react";
import { Composition, Still, staticFile } from "remotion";
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { VIDEO } from "./theme";
import { Clip1, clip1Schema } from "./clips/Clip1";
import { Clip2, clip2Schema } from "./clips/Clip2";
import { Clip3, clip3Schema } from "./clips/Clip3";
import { Clip4, clip4Schema } from "./clips/Clip4";
import { Clip5, clip5Schema } from "./clips/Clip5";
import { Clip6, clip6Schema } from "./clips/Clip6";
import { Clip7, clip7Schema } from "./clips/Clip7";
import { Clip8, clip8Schema } from "./clips/Clip8";
import { Clip9, clip9Schema } from "./clips/Clip9";
import { Clip10, clip10Schema } from "./clips/Clip10";
import { ChapterCard, EndScreen, chapterSchema } from "./clips/Extras";
import { Video2, Video2Clip, video2ClipSchema, video2Schema } from "./video2/Video2";
import { VIDEO2_FRAMES, clipTimings } from "./video2/clipTimings";
import { VIDEO3_OUTRO_FRAMES, Video3, Video3Clip, video3ClipSchema, video3Schema } from "./video3/Video3";
import { VIDEO3_FRAMES, clipTimings as clipTimings3 } from "./video3/clipTimings";
import { Vertical3Clip, vertical3Schema } from "./video3/Vertical3";
import { TOP5_TEENS_FRAMES, Top5Teens, Top5TeensCover, Top5TeensThumbYT, top5TeensSchema } from "./shorts/Top5Teens";
import { JUDGE_GTA6_FRAMES, JudgeGTA6, judgeGta6Schema } from "./shorts/JudgeGTA6";
import { WALKS_FREE_FRAMES, WalksFreeGTA6, walksFreeSchema } from "./shorts/WalksFreeGTA6";
import { JENSEN_BACK_FRAMES, JensenBack, jensenBackSchema } from "./shorts/JensenBack";
import { AI_BANK_FRAMES, AiBankHeist, aiBankSchema } from "./shorts/AiBankHeist";
import { ONE_WEEK_FRAMES, OneWeekHacked, oneWeekSchema } from "./shorts/OneWeekHacked";
import { SHORT_CYBERLEAK_FRAMES, ShortCyberleak, shortCyberleakSchema } from "./shorts/ShortCyberleak";
import { SHORT_H, SHORT_LAPSUS1_FRAMES, SHORT_W, ShortLapsus1, shortLapsus1Schema } from "./shorts/ShortLapsus1";
import { Thumbnail, ThumbnailAlphaBayBright, ThumbnailLapsus, ThumbnailLapsusB, ThumbnailLapsusBright, ThumbnailLapsusC, ThumbnailSilkRoadBright, VerticalCover, VerticalCoverAlphaBay, VerticalCoverLapsus, thumbnailSchema } from "./video2/Thumbnail";
import { V2StyleGuide } from "./video2/V2StyleGuide";
import { VERTICAL, VerticalClip, verticalSchema } from "./clips/Vertical";
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
        id="Clip8"
        component={Clip8}
        schema={clip8Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 50}
        calculateMetadata={durationFromAudio("audio/clip8.mp3")}
      />
      <Composition
        id="Clip9"
        component={Clip9}
        schema={clip9Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 50}
        calculateMetadata={durationFromAudio("audio/clip9.mp3")}
      />
      <Composition
        id="Clip10"
        component={Clip10}
        schema={clip10Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 50}
        calculateMetadata={durationFromAudio("audio/clip10.mp3")}
      />
      <Composition
        id="Video2"
        component={Video2}
        schema={video2Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO2_FRAMES}
      />
      {clipTimings.map((t) => (
        <Composition
          key={t.n}
          id={`V2-Clip${t.n}`}
          component={Video2Clip}
          schema={video2ClipSchema}
          defaultProps={{ n: t.n, showCaptions: true }}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={t.endFrame - t.startFrame}
        />
      ))}
      <Composition
        id="Video3"
        component={Video3}
        schema={video3Schema}
        defaultProps={{ showCaptions: true }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO3_FRAMES + VIDEO3_OUTRO_FRAMES}
      />
      {clipTimings3.map((t) => (
        <Composition
          key={t.n}
          id={`V3-Clip${t.n}`}
          component={Video3Clip}
          schema={video3ClipSchema}
          defaultProps={{ n: t.n, showCaptions: true }}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={t.endFrame - t.startFrame}
        />
      ))}
      {clipTimings3.map((t) => (
        <Composition
          key={t.n}
          id={`Lapsus-Vertical-${t.n}`}
          component={Vertical3Clip}
          schema={vertical3Schema}
          defaultProps={{ n: t.n, showCaptions: true }}
          width={1080}
          height={1920}
          fps={VIDEO.fps}
          durationInFrames={t.endFrame - t.startFrame}
        />
      ))}
      <Composition
        id="Short-Lapsus-1"
        component={ShortLapsus1}
        schema={shortLapsus1Schema}
        defaultProps={{ showCaptions: true }}
        width={SHORT_W}
        height={SHORT_H}
        fps={VIDEO.fps}
        durationInFrames={SHORT_LAPSUS1_FRAMES}
      />
      <Composition
        id="Short-Cyberleak"
        component={ShortCyberleak}
        schema={shortCyberleakSchema}
        defaultProps={{ showCaptions: true }}
        width={SHORT_W}
        height={SHORT_H}
        fps={VIDEO.fps}
        durationInFrames={SHORT_CYBERLEAK_FRAMES}
      />
      <Composition
        id="Top5-Teen-Hackers"
        component={Top5Teens}
        schema={top5TeensSchema}
        defaultProps={{ showCaptions: true }}
        width={SHORT_W}
        height={SHORT_H}
        fps={VIDEO.fps}
        durationInFrames={TOP5_TEENS_FRAMES}
      />
      <Composition
        id="Top5-Teen-Hackers-YT"
        component={Top5Teens}
        schema={top5TeensSchema}
        defaultProps={{ showCaptions: true, landscape: true }}
        width={1920}
        height={1080}
        fps={VIDEO.fps}
        durationInFrames={TOP5_TEENS_FRAMES}
      />
      <Composition
        id="Judge-GTA6"
        component={JudgeGTA6}
        schema={judgeGta6Schema}
        defaultProps={{ showCaptions: true }}
        width={SHORT_W}
        height={SHORT_H}
        fps={VIDEO.fps}
        durationInFrames={JUDGE_GTA6_FRAMES}
      />
      <Composition
        id="WalksFree-GTA6"
        component={WalksFreeGTA6}
        schema={walksFreeSchema}
        defaultProps={{ showCaptions: true }}
        width={SHORT_W}
        height={SHORT_H}
        fps={VIDEO.fps}
        durationInFrames={WALKS_FREE_FRAMES}
      />
      <Composition
        id="Jensen-Back"
        component={JensenBack}
        schema={jensenBackSchema}
        defaultProps={{ showCaptions: true }}
        width={SHORT_W}
        height={SHORT_H}
        fps={VIDEO.fps}
        durationInFrames={JENSEN_BACK_FRAMES}
      />
      <Composition
        id="AI-Bank-Heist"
        component={AiBankHeist}
        schema={aiBankSchema}
        defaultProps={{ showCaptions: true }}
        width={SHORT_W}
        height={SHORT_H}
        fps={VIDEO.fps}
        durationInFrames={AI_BANK_FRAMES}
      />
      <Composition
        id="One-Week-Hacked"
        component={OneWeekHacked}
        schema={oneWeekSchema}
        defaultProps={{ showCaptions: true }}
        width={SHORT_W}
        height={SHORT_H}
        fps={VIDEO.fps}
        durationInFrames={ONE_WEEK_FRAMES}
      />
      <Composition
        id="Judge-GTA6-YT"
        component={JudgeGTA6}
        schema={judgeGta6Schema}
        defaultProps={{ showCaptions: true, landscape: true }}
        width={1920}
        height={1080}
        fps={VIDEO.fps}
        durationInFrames={JUDGE_GTA6_FRAMES}
      />
      <Still id="Top5-Teen-Hackers-Thumb-YT" component={Top5TeensThumbYT} width={1920} height={1080} />
      <Still id="Top5-Teen-Hackers-Cover" component={Top5TeensCover} width={SHORT_W} height={SHORT_H} />
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <Composition
          key={n}
          id={`SilkRoad-Vertical-${n}`}
          component={VerticalClip}
          schema={verticalSchema}
          defaultProps={{ n, showCaptions: true }}
          width={VERTICAL.width}
          height={VERTICAL.height}
          fps={VIDEO.fps}
          durationInFrames={VIDEO.fps * 50}
          calculateMetadata={durationFromAudio(`audio/clip${n}.mp3`)}
        />
      ))}
      <Composition
        id="ChapterCard"
        component={ChapterCard}
        schema={chapterSchema}
        defaultProps={{ part: 2, title: "THE IDEALIST" }}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 2}
      />
      <Composition
        id="EndScreen"
        component={EndScreen}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={VIDEO.fps * 15}
      />
      {(["email", "mistake", "silkroad"] as const).map((variant) => (
        <Composition
          key={variant}
          id={variant === "silkroad" ? "V1-Thumb" : `V2-Thumb-${variant}`}
          component={Thumbnail}
          schema={thumbnailSchema}
          defaultProps={{ variant }}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={1}
        />
      ))}
      <Composition id="Bright-Lapsus" component={ThumbnailLapsusBright} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={1} />
      <Composition id="Bright-SilkRoad" component={ThumbnailSilkRoadBright} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={1} />
      <Composition id="Bright-AlphaBay" component={ThumbnailAlphaBayBright} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={1} />
      <Composition id="V3-Thumb-B" component={ThumbnailLapsusB} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={1} />
      <Composition id="V3-Thumb-C" component={ThumbnailLapsusC} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={1} />
      <Composition id="V3-Thumb" component={ThumbnailLapsus} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={1} />
      <Composition id="V3-Cover-Vertical" component={VerticalCoverLapsus} width={1080} height={1920} fps={VIDEO.fps} durationInFrames={1} />
      <Composition id="V2-Cover-Vertical" component={VerticalCoverAlphaBay} width={1080} height={1920} fps={VIDEO.fps} durationInFrames={1} />
      <Composition id="V1-Cover-Vertical" component={VerticalCover} width={1080} height={1920} fps={VIDEO.fps} durationInFrames={1} />
      <Composition id="V2StyleGuide" component={V2StyleGuide} width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps} durationInFrames={VIDEO.fps * 5} />
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
