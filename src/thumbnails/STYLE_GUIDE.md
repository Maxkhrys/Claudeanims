# The Onion Archive: thumbnail style guide

One look for every video, so people recognise the channel in the feed before they read a word.
Examples: `branding/thumbnail-system/` (`before-after.jpg` shows old vs new).

## The 7 rules

1. **Dark background, always.** Near-black `#0B0C10` with a soft glow behind the subject, faint light rays, grain and vignette. No purple sunsets, no red gradients.
2. **One accent colour: channel yellow `#FFD60A`.** It's used for the headline block, the glow and the ring around the object. Don't add a second bright colour. Swap the accent only for a whole series, never for one video.
3. **One font: Anton, all caps.** Two lines only:
   - line 1 in white: the setup ("HACKED GTA 6")
   - line 2 in black on a tilted yellow block: the click word ("WITH THIS?!")
4. **3-4 words in total** ("GTA 6" counts as one). If you need more words, the idea isn't sharp enough yet.
5. **A face with a strong emotion + one clear object.** The character is a white-outlined "sticker" (shock, fear or smirk). The object (TV stick, coin, evidence bag, file) is circled in yellow. If someone can't tell what the object is in half a second, pick another object.
6. **Always show the real logo of what the video is about** (Max's rule): the GTA VI logo on every GTA video, the company's logo on a company hack, and so on. It sits big, right above the headline. You can add 2-3 logos side by side. Because the logo already says "GTA 6", the words don't need to repeat it.
7. **The onion logo goes in the same corner every time:** top right on YouTube, top left above the headline on covers.

## Formats and safe zones

| | Size | Keep clear |
|---|---|---|
| YouTube thumbnail | 1280x720 | Bottom-right corner (YouTube's timestamp goes there) |
| Vertical cover (TikTok / Reels / Shorts) | 1080x1920 | Everything important sits in x 60-918, y 250-1536: inside TikTok's 3:4 profile-grid crop, and clear of the top 10%, the right 15% (buttons) and the bottom 20% (name/caption bar) |

## Countdown (Top 5) videos

Never spoil the order: no names, faces or targets of any entry, and never #1. That includes logos: only use a logo that covers the whole episode and gives nothing away (e.g. a platform the whole list shares). Logos of individual targets (NASA, Twitter, GTA VI...) would reveal the lineup. With no logo, the headline moves up into that space. Use the anonymous hooded character (glowing eyes), "TOP 5" as the click word, and the CLASSIFIED file with "#1" as the object.

## Making a new thumbnail (Remotion, repo `claudeanims`)

1. Add one entry to `src/thumbnails/examples.ts`:
   ```ts
   MyVideo: { top: "HACKED", hit: "WITH THIS?!", logos: ["gta6.png"], character: "hacker", emotion: "shock", object: "tvstick", objectLabel: "TV STICK" },
   ```
   Logos are transparent PNG cut-outs in `public/thumbnails/logos/` (`gta6.png` is already there). Drop a new one in for each new company or game.
   Characters: `hacker`, `anon`, `judge`, `leek` (Cyberleak's real avatar), `none`. Objects: `tvstick`, `evidence`, `coin`, `mystery`, `none`.
2. Run `npm run thumbs -- MyVideo` (cloud container: prefix `BROWSER=/opt/pw-browsers/chromium_headless_shell`).
3. You get `out/thumbs/MyVideo-yt.jpg` and `out/thumbs/MyVideo-cover.jpg`. The headline auto-sizes to fit.

New stories that need a new character or object: add it to `src/thumbnails/art.tsx` in the same flat, thick-outline style, so it still looks like the channel.

## Quick check before uploading

- Shrink it to phone-feed size. Can you read every word and tell what the object is?
- Is the real logo of the company/game on it?
- Is it the same dark + yellow + Anton + onion look as the last video?
- Countdown? Nothing gives away the lineup.
