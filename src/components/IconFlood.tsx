import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, random, interpolateColors, spring } from "remotion";
import { colors, fonts, springs } from "../theme";

/**
 * A grid of tiny user icons, each with an address tag, that floods the frame.
 * Frames are local (wrap in a <Sequence>).
 */
export const IconFlood: React.FC<{
  cols?: number;
  rows?: number;
  /** frames over which the icons pop in */
  spread?: number;
  color?: string;
  /** frame when a random subset turns `highlightColor` */
  highlightAt?: number;
  highlightColor?: string;
  highlightRatio?: number;
  /** 0..1, tints everything `dangerColor` */
  danger?: number;
  dangerColor?: string;
  /** skip the pop-in */
  instant?: boolean;
  seed?: string;
  style?: React.CSSProperties;
}> = ({
  cols = 28,
  rows = 11,
  spread = 55,
  color = colors.green,
  highlightAt,
  highlightColor = colors.amber,
  highlightRatio = 0.12,
  danger = 0,
  dangerColor = colors.red,
  instant = false,
  seed = "flood",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const cw = width / cols;
  const ch = height / rows;

  const cells = useMemo(
    () =>
      new Array(cols * rows).fill(0).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const dist = Math.hypot((c + 0.5) / cols - 0.5, (r + 0.5) / rows - 0.5) / 0.71;
        return {
          c,
          r,
          delay: (dist * 0.55 + random(`${seed}-d-${i}`) * 0.45) * spread,
          num: 100 + Math.floor(random(`${seed}-n-${i}`) * 9800),
          bar: 14 + random(`${seed}-b-${i}`) * 18,
          hl: random(`${seed}-h-${i}`) < highlightRatio,
          hlDelay: random(`${seed}-hd-${i}`) * 14,
        };
      }),
    [cols, rows, seed, spread, highlightRatio],
  );

  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      {cells.map((cell, i) => {
        const pop = instant
          ? 1
          : spring({ frame: frame - cell.delay, fps, config: springs.pop });
        if (pop <= 0.001) return null;
        const hl =
          cell.hl && highlightAt !== undefined
            ? spring({ frame: frame - highlightAt - cell.hlDelay, fps, config: springs.pop })
            : 0;
        let col = interpolateColors(Math.min(1, hl), [0, 1], [color, highlightColor]);
        if (danger > 0) col = interpolateColors(danger, [0, 1], [col, dangerColor]);
        const dimmed = highlightAt !== undefined && frame >= highlightAt && !cell.hl ? 0.55 : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cell.c * cw,
              top: cell.r * ch,
              width: cw,
              height: ch,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              transform: `scale(${pop * (1 + 0.22 * hl)})`,
              opacity: (0.55 + 0.45 * hl) * dimmed,
            }}
          >
            <svg width={34} height={34} viewBox="0 0 34 34">
              <circle cx={17} cy={11} r={6.5} fill={col} />
              <path d="M 4 32 C 4 21 10 19 17 19 C 24 19 30 21 30 32 Z" fill={col} />
            </svg>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                padding: "2px 4px",
                border: `1px solid ${col}`,
                borderRadius: 3,
                fontFamily: fonts.mono,
                fontSize: 10,
                lineHeight: 1,
                color: col,
              }}
            >
              <span>{cell.num}</span>
              <span style={{ width: cell.bar, height: 6, background: col, opacity: 0.7 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
