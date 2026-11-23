import type { OnionThumbProps } from "./OnionThumb";

type Example = Omit<OnionThumbProps, "format">;

/**
 * Every video gets one entry here. Each entry renders two stills:
 * Thumb-<id>-YT (1280x720) and Thumb-<id>-Cover (1080x1920).
 * Render: npm run thumbs   (or: npx remotion still Thumb-<id>-YT out/thumbs/<id>-yt.png)
 */
export const THUMBS: Record<string, Example> = {
  // "He Hacked GTA 6 With a TV Stick"
  TvStick: { top: "HACKED GTA 6", hit: "WITH THIS?!", accent: "#FFD60A", character: "hacker", emotion: "shock", object: "tvstick", objectLabel: "TV STICK" },
  // "The Kid Who Showed GTA 6 to the World First" (judge / sentencing)
  Judge: { top: "LEAKED WITH", hit: "THIS?!", accent: "#FFD60A", character: "judge", emotion: "shock", object: "evidence" },
  // "The GTA 6 Leak Was a Crypto Scam?"
  Cyberleak: { top: "GTA 6 LEAK", hit: "$30M SCAM?", accent: "#FFD60A", character: "leek", emotion: "shock", object: "coin", objectLabel: "$30M" },
  // "Top 5 teen hackers" countdown: no names, no #1, nothing that spoils the order
  Top5Teens: { top: "TEEN HACKERS", hit: "TOP 5", accent: "#FFD60A", character: "anon", emotion: "shock", object: "mystery", objectLabel: "#1" },
};
