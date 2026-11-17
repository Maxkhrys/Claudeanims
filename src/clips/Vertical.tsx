import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { colors, fonts, springs, VIDEO } from "../theme";
import { captionNames, sp, type Word } from "../lib/timing";
import { Background, Captions, OnionLogo } from "../components";
import { CHAPTERS } from "./Extras";
import t1 from "../../public/audio/clip1.json";
import t2 from "../../public/audio/clip2.json";
import t3 from "../../public/audio/clip3.json";
import t4 from "../../public/audio/clip4.json";
import t5 from "../../public/audio/clip5.json";
import t6 from "../../public/audio/clip6.json";
import t7 from "../../public/audio/clip7.json";
import t8 from "../../public/audio/clip8.json";
import t9 from "../../public/audio/clip9.json";
import t10 from "../../public/audio/clip10.json";
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

const CLIPS = [Clip1, Clip2, Clip3, Clip4, Clip5, Clip6, Clip7, Clip8, Clip9, Clip10];
const WORDS = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10].map((t) => captionNames(t.words as Word[]));

export const VERTICAL = { width: 1080, height: 1920 } as const;
export const verticalSchema = z.object({ n: z.number(), showCaptions: z.boolean() });

// the 1920x1080 clip is scaled to slightly overfill the 1080 width
const SCALE = 0.6;
const CLIP_TOP = 610;
const CLIP_H = VIDEO.height * SCALE;

/**
 * 9:16 version of a Silk Road clip for TikTok / Reels: part title on top,
 * the original clip across the middle, larger captions underneath.
 */
export const VerticalClip: React.FC<z.infer<typeof verticalSchema>> = ({ n, showCaptions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const Clip = CLIPS[n - 1];
  const inTitle = sp(frame, fps, 4, springs.snappy);
  const inPart = sp(frame, fps, 10, springs.pop);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Background drift={0.4}>
        {/* header */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 26px",
              borderRadius: 8,
              background: colors.green,
              color: colors.bg,
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: 44,
              letterSpacing: "0.12em",
              transform: `scale(${inPart})`,
            }}
          >
            PART {n} / 10
          </div>
          <div
            style={{
              marginTop: 22,
              fontFamily: fonts.display,
              fontSize: 150,
              lineHeight: 0.95,
              color: colors.text,
              textShadow: "0 0 40px rgba(230,230,230,0.25)",
              opacity: Math.min(1, inTitle * 2),
              transform: `translateY(${(1 - inTitle) * 30}px)`,
            }}
          >
            {CHAPTERS[n - 1]}
          </div>
          <div style={{ marginTop: 10, fontFamily: fonts.mono, fontSize: 34, color: colors.dim, letterSpacing: "0.2em" }}>
            THE SILK ROAD CASE FILE
          </div>
        </div>
      </Background>

      {/* the clip, rendered at its native 1920x1080 and scaled down */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: CLIP_TOP,
          width: VERTICAL.width,
          height: CLIP_H,
          overflow: "hidden",
          borderTop: `4px solid ${colors.green}`,
          borderBottom: `4px solid ${colors.green}`,
          boxShadow: "0 0 80px rgba(57,255,136,0.18)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: (VERTICAL.width - VIDEO.width * SCALE) / 2,
            top: 0,
            width: VIDEO.width,
            height: VIDEO.height,
            transform: `scale(${SCALE})`,
            transformOrigin: "0 0",
          }}
        >
          <Sequence width={VIDEO.width} height={VIDEO.height}>
            <Clip showCaptions={false} />
          </Sequence>
        </div>
      </div>

      <Captions words={WORDS[n - 1]} enabled={showCaptions} fontSize={88} maxWords={3} maxChars={17} bottom={440} />

      {/* footer */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1560, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <OnionLogo size={46} />
        <span style={{ fontFamily: fonts.mono, fontSize: 32, fontWeight: 700, color: colors.green, letterSpacing: "0.12em" }}>
          THE ONION ARCHIVE
        </span>
        <span style={{ fontFamily: fonts.mono, fontSize: 30, color: colors.dim }}>· full story on YouTube</span>
      </div>
    </AbsoluteFill>
  );
};
