import React, { useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { colors, fonts, springs, VIDEO } from "../theme";
import { sp } from "../lib/timing";
import { Background, Captions, OnionLogo } from "../components";
import { audioParts, clipTimings, VIDEO3_CLIP_COUNT } from "./clipTimings";
import { clipWords } from "./words";
import { VIDEO3_CLIPS } from "./Video3";

export const vertical3Schema = z.object({ n: z.number(), showCaptions: z.boolean() });

const W = 1080;
const SCALE = 0.6;
const CLIP_TOP = 640;
const CLIP_H = VIDEO.height * SCALE;

/** 9:16 version of one Lapsus$ clip for TikTok / Reels / Facebook. */
export const Vertical3Clip: React.FC<z.infer<typeof vertical3Schema>> = ({ n, showCaptions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = clipTimings.find((c) => c.n === n)!;
  const part = audioParts.find((p) => p.n === t.part)!;
  const Clip = VIDEO3_CLIPS[n - 1];
  const words = useMemo(() => clipWords(n), [n]);
  const inTitle = sp(frame, fps, 4, springs.snappy);
  const inPart = sp(frame, fps, 10, springs.pop);
  const title = t.title.toUpperCase();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio src={staticFile(part.file)} trimBefore={t.startFrame - part.startFrame} />
      <Background drift={0.4}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center" }}>
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
            PART {n} / {VIDEO3_CLIP_COUNT}
          </div>
          <div
            style={{
              marginTop: 20,
              fontFamily: fonts.display,
              fontSize: title.length > 14 ? 112 : 150,
              lineHeight: 0.95,
              color: colors.text,
              textShadow: "0 0 40px rgba(230,230,230,0.25)",
              opacity: Math.min(1, inTitle * 2),
              transform: `translateY(${(1 - inTitle) * 30}px)`,
            }}
          >
            {title}
          </div>
          <div style={{ marginTop: 12, fontFamily: fonts.mono, fontSize: 32, color: colors.dim, letterSpacing: "0.18em" }}>
            THE TEEN WHO HACKED GTA 6
          </div>
          {/* channel name sits up here, clear of the apps' buttons and description */}
          <div style={{ marginTop: 18, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
            <OnionLogo size={40} />
            <span style={{ fontFamily: fonts.mono, fontSize: 30, fontWeight: 700, color: colors.green, letterSpacing: "0.12em" }}>
              THE ONION ARCHIVE
            </span>
          </div>
        </div>
      </Background>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: CLIP_TOP,
          width: W,
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
            left: (W - VIDEO.width * SCALE) / 2,
            top: 0,
            width: VIDEO.width,
            height: VIDEO.height,
            transform: `scale(${SCALE})`,
            transformOrigin: "0 0",
          }}
        >
          <Sequence width={VIDEO.width} height={VIDEO.height}>
            <Background>
              <Clip />
            </Background>
          </Sequence>
        </div>
      </div>

      <Captions words={words} enabled={showCaptions} fontSize={88} maxWords={3} maxChars={17} bottom={420} />
    </AbsoluteFill>
  );
};
