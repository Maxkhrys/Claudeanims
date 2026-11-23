import type { OnionThumbProps } from "./OnionThumb";

type Example = Omit<OnionThumbProps, "format">;

/**
 * Every video gets one entry here. Each entry renders two stills:
 * Thumb-<id>-YT (1280x720) and Thumb-<id>-Cover (1080x1920).
 * Render: npm run thumbs   (or: npx remotion still Thumb-<id>-YT out/thumbs/<id>-yt.png)
 */
export const THUMBS: Record<string, Example> = {
  // "He Hacked GTA 6 With a TV Stick"
  TvStick: { top: "HACKED", hit: "WITH THIS?!", logos: ["gta6.png"], accent: "#FFD60A", character: "hacker", emotion: "shock", object: "tvstick", objectLabel: "TV STICK" },
  // "The Kid Who Showed GTA 6 to the World First" (judge / sentencing)
  Judge: { top: "LEAKED WITH", hit: "THIS?!", logos: ["gta6.png"], accent: "#FFD60A", character: "judge", emotion: "shock", object: "evidence" },
  // "The GTA 6 Leak Was a Crypto Scam?"
  Cyberleak: { top: "LEAKED FOR", hit: "CRYPTO?!", logos: ["gta6.png"], accent: "#FFD60A", character: "leek", emotion: "shock", object: "coin", objectLabel: "$30M" },
  // "The GTA 6 Hacker Just Walked Free" (7 years, time served, 23 Nov 2026)
  WalksFree: { top: "7 YEARS...", hit: "WALKED FREE?!", logos: ["gta6.png"], accent: "#FFD60A", character: "hacker", emotion: "smirk", object: "tvstick", objectLabel: "FIRE STICK" },
  // "Top 5 teen hackers" countdown: no names, no #1, no target logos (they would give the lineup away)
  Top5Teens: { top: "TEEN HACKERS", hit: "TOP 5", accent: "#FFD60A", character: "anon", emotion: "shock", object: "mystery", objectLabel: "#1", logos: [] },
  // "Top 5 crypto scams that vanished with billions" countdown: generic Bitcoin logo only, no scam logos/names
  Top5Crypto: { top: "CRYPTO SCAMS", hit: "TOP 5", accent: "#FFD60A", character: "anon", emotion: "shock", object: "coin", objectLabel: "#1?", logos: ["bitcoin.svg"] },
};
