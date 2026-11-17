import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Background, Chip, Dpr, GlitchTransition, PirateHat, Pop, Terminal, TitleSlam, mono } from "../components";

/** Titles for the chapter cards that sit between clips in the full video. */
export const CHAPTERS = [
  "THE MESSAGE",
  "THE IDEALIST",
  "THE EMPIRE",
  "THE BLACKMAIL",
  "REDANDWHITE",
  "THE HIT",
  "FOUR MORE",
  "THE CON",
  "THE NET CLOSES",
  "THE VERDICT",
];

export const chapterSchema = z.object({ part: z.number(), title: z.string() });

/** Two-second "PART 02 / TITLE" card. */
export const ChapterCard: React.FC<z.infer<typeof chapterSchema>> = ({ part, title }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const line = sp(frame, fps, 6, springs.smooth, 20);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Background>
        <GlitchTransition at={durationInFrames - 8} durationInFrames={7} mode="out" seed={`ch-${part}`}>
          <Terminal
            style={{ position: "absolute", left: 0, right: 0, top: 300 }}
            align="center"
            fontSize={54}
            lines={[{ text: `PART ${String(part).padStart(2, "0")} / 10`, at: 2, durationInFrames: 10 }]}
            showCursor={frame < 16}
          />
          <TitleSlam text={title} fontSize={title.length > 12 ? 250 : 320} at={10} style={{ top: 400 }} />
          <div style={{ position: "absolute", left: 960 - 400 * line, width: 800 * line, top: 760, height: 6, background: colors.green, boxShadow: `0 0 24px ${colors.green}` }} />
        </GlitchTransition>
      </Background>
    </AbsoluteFill>
  );
};

/**
 * 15-second end screen. The two outlined areas are where YouTube's
 * end-screen elements (suggested video, subscribe button) go.
 */
export const EndScreen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hat = sp(frame, fps, 40, springs.smooth, 50);
  const box = (at: number): React.CSSProperties => ({
    border: `3px dashed ${colors.greenDim}`,
    borderRadius: 16,
    background: "rgba(57,255,136,0.04)",
    opacity: Math.min(1, sp(frame, fps, at, springs.snappy) * 2),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Background>
        <TitleSlam text="THANKS FOR WATCHING" color={colors.green} fontSize={170} at={6} style={{ top: 50 }} />
        {/* suggested video slot, 16:9 */}
        <div style={{ position: "absolute", left: 130, top: 300, width: 800, height: 450, ...box(24) }} />
        <Pop at={30} from="up" style={{ left: 130, top: 770, width: 800, textAlign: "center" }}>
          <span style={{ ...mono(34, colors.dim), letterSpacing: "0.16em" }}>WATCH NEXT</span>
        </Pop>
        {/* subscribe slot, round */}
        <div style={{ position: "absolute", left: 1060, top: 380, width: 290, height: 290, ...box(30), borderRadius: 145 }} />
        <Chip at={38} text="SUBSCRIBE" color={colors.red} filled fontSize={40} origin="center center" style={{ left: 1065, top: 700 }} />
        <div style={{ position: "absolute", left: 1560 - 85, top: 250 + Math.sin(frame / 20) * 5 }}>
          <PirateHat progress={hat} size={170} />
        </div>
        <Pop at={20} origin="center bottom" style={{ left: 1560 - 165, top: 380 }}>
          <Dpr size={380} look={{ x: -0.7, y: 0 }} />
        </Pop>
        <Terminal
          style={{ position: "absolute", left: 0, right: 0, top: 850 }}
          align="center"
          fontSize={40}
          color={colors.text}
          lines={[{ text: "more case files soon", prompt: "> ", at: 60, durationInFrames: 26 }]}
        />
      </Background>
    </AbsoluteFill>
  );
};
