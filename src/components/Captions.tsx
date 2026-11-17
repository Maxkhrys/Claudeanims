import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { colors, fonts, springs } from "../theme";
import type { Word } from "../lib/timing";

type Chunk = { words: Word[]; start: number; end: number };

const clean = (s: string) => s.replace(/["“”]/g, "");

const chunkWords = (words: Word[], maxWords: number, maxChars: number): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) chunks.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  words.forEach((w, i) => {
    const len = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    if (cur.length >= maxWords || (cur.length > 0 && len > maxChars)) flush();
    cur.push(w);
    const next = words[i + 1];
    const endsSentence = /[.!?…]["”]?$/.test(w.text);
    const pause = next ? next.start - w.end > 0.4 : true;
    if (endsSentence || pause) flush();
  });
  flush();
  return chunks;
};

/** Word-by-word highlighted captions driven by Whisper timestamps. */
export const Captions: React.FC<{
  words: Word[];
  enabled?: boolean;
  maxWords?: number;
  maxChars?: number;
  fontSize?: number;
  bottom?: number;
  highlight?: string;
}> = ({
  words,
  enabled = true,
  maxWords = 4,
  maxChars = 26,
  fontSize = 68,
  bottom = 84,
  highlight = colors.green,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = useMemo(() => chunkWords(words, maxWords, maxChars), [words, maxWords, maxChars]);
  if (!enabled) return null;

  const t = frame / fps;
  let idx = -1;
  for (let i = 0; i < chunks.length; i++) {
    if (t >= chunks[i].start - 0.04) idx = i;
  }
  if (idx < 0) return null;
  const chunk = chunks[idx];
  if (t > chunk.end + 0.5) return null;

  const enter = spring({
    frame: frame - Math.round((chunk.start - 0.04) * fps),
    fps,
    config: springs.snappy,
  });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", pointerEvents: "none" }}>
      {/* soft dark band so captions stay readable over busy scenes */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: bottom + fontSize * 3.2,
          background: "linear-gradient(to top, rgba(7,9,11,0.92) 0%, rgba(7,9,11,0.7) 45%, rgba(7,9,11,0) 100%)",
        }}
      />
      <div
        style={{
          marginBottom: bottom,
          display: "flex",
          gap: fontSize * 0.42,
          padding: "10px 30px",
          position: "relative",
          transform: `translateY(${(1 - enter) * 16}px) scale(${0.96 + 0.04 * enter})`,
          opacity: Math.min(1, enter * 2),
        }}
      >
        {chunk.words.map((w, i) => {
          const next = chunk.words[i + 1];
          const active = t >= w.start && (next ? t < next.start : true);
          const spoken = t >= w.start;
          const pop = spring({
            frame: frame - Math.round(w.start * fps),
            fps,
            config: springs.pop,
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: fonts.sans,
                fontWeight: 800,
                fontSize,
                lineHeight: 1.1,
                textTransform: "uppercase",
                letterSpacing: "0.01em",
                color: active ? highlight : colors.text,
                opacity: spoken ? 1 : 0.4,
                // long words grow less, so they never eat the gap to their neighbours
                transform: `scale(${active ? 1 + 0.08 * pop * Math.min(1, 6 / w.text.length) : 1})`,
                textShadow: active
                  ? `0 0 26px ${highlight}77, 0 4px 0 #000, 0 0 12px #000, 0 0 30px #000`
                  : "0 4px 0 #000, 0 0 12px #000, 0 0 30px #000",
                WebkitTextStroke: "2px rgba(0,0,0,0.55)",
                paintOrder: "stroke fill",
              }}
            >
              {clean(w.text)}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
