import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import type { SpringConfig } from "remotion";

// Fonts are bundled in public/fonts so renders work offline and never change.
const FONT_FILES = [
  { family: "JetBrains Mono", weight: "400", file: "JetBrainsMono-400.woff2" },
  { family: "JetBrains Mono", weight: "700", file: "JetBrainsMono-700.woff2" },
  { family: "Bebas Neue", weight: "400", file: "BebasNeue-400.woff2" },
  { family: "Inter Tight", weight: "700", file: "InterTight-700.woff2" },
  { family: "Inter Tight", weight: "800", file: "InterTight-800.woff2" },
];

FONT_FILES.forEach(({ family, weight, file }) => {
  loadFont({ family, weight, url: staticFile(`fonts/${file}`) });
});

export const VIDEO = { width: 1920, height: 1080, fps: 30 } as const;

export const colors = {
  bg: "#07090B",
  panel: "#0C1115",
  panelLight: "#121920",
  line: "#1E2A32",
  green: "#39FF88",
  greenDim: "#1C7A45",
  red: "#FF3B3B",
  amber: "#FFB547",
  text: "#E6E6E6",
  dim: "#73808A",
  // character colours
  chemist: "#A9DDB6",
  dpr: "#1A222B",
  ross: "#8FA3B5",
  agent: "#5B86C4",
  extras: ["#C8B08A", "#B59AC8", "#9AC8B0", "#C89A9A"],
  redandwhite: "#D7322F",
} as const;

export const fonts = {
  mono: `"JetBrains Mono", monospace`,
  display: `"Bebas Neue", sans-serif`,
  sans: `"Inter Tight", sans-serif`,
} as const;

type Cfg = Partial<SpringConfig>;

/** Spring presets. Everything that moves uses one of these. */
export const springs = {
  /** no overshoot, for fades, camera moves, counters */
  smooth: { damping: 200 } as Cfg,
  /** quick UI motion with a hint of overshoot */
  snappy: { damping: 18, stiffness: 190, mass: 0.6 } as Cfg,
  /** bouncy pop for characters and icons */
  pop: { damping: 11, stiffness: 170, mass: 0.7 } as Cfg,
  /** heavy impact for TitleSlam */
  slam: { damping: 13, stiffness: 240, mass: 0.9 } as Cfg,
  /** slow and weighty, for push-ins */
  heavy: { damping: 60, stiffness: 30, mass: 2 } as Cfg,
} as const;
