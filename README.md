# Silk Road documentary (Remotion)

Ten one-minute clips, animated in code. 1920x1080, 30fps. Style: "dark web case file".

## Commands

```bash
npm install
npm run dev                      # Remotion Studio
npm run render:clip1             # -> out/clip1.mp4
npm run render:clip2             # -> out/clip2.mp4
npm run transcribe -- clip1      # Whisper word timestamps -> public/audio/clip1.json
npx remotion still Clip1 out/frame.png --frame=600
```

Render without captions:

```bash
npx remotion render Clip1 out/clip1-nocaps.mp4 --props='{"showCaptions":false}'
```

In Studio, captions toggle with the `showCaptions` checkbox in the props panel.
The `StyleGuide` composition shows every character, avatar and colour on one frame.

## Layout

```
public/audio/clipN.mp3    narration
public/audio/clipN.json   Whisper word timestamps (generated)
public/fonts/             bundled fonts (JetBrains Mono, Bebas Neue, Inter Tight)
src/theme.ts              colours, fonts, spring presets
src/lib/timing.ts         createCues(): word -> frame lookup
src/components/           reusable building blocks
src/clips/ClipN.tsx       one file per clip
src/Root.tsx              one <Composition> per clip
scripts/transcribe.mjs    runs whisper.cpp (medium.en)
```

## How timing works

Nothing is keyed to hand-picked frame numbers. Each clip builds a `cue` from its
transcript and asks for the frame of a spoken word or phrase:

```ts
const cue = createCues(words, fps);
cue.at("half")             // frame where "half" starts
cue.at("online", 1)        // second time "online" is said
cue.at("On the other")     // phrases work too
cue.end("customers")       // frame where the word ends
cue.at("private", 0, -0.1) // 0.1s early
```

If a cue word is not in the transcript the clip throws, so a re-recorded
voiceover fails loudly instead of drifting out of sync.

## Adding the next clip

1. Drop the narration at `public/audio/clipN.mp3` (examples below use clip 3).
2. `npm run transcribe -- clip3` and skim `clip3.json` for misheard words.
3. Copy `src/clips/Clip1.tsx` to `Clip3.tsx`. Change the transcript import and
   the audio path, rewrite `useBeats` with the new cue words, and replace the scenes.
4. Register it in `src/Root.tsx`:

   ```tsx
   <Composition
     id="Clip3"
     component={Clip3}
     schema={clip3Schema}
     defaultProps={{ showCaptions: true }}
     width={VIDEO.width} height={VIDEO.height} fps={VIDEO.fps}
     durationInFrames={VIDEO.fps * 60}
     calculateMetadata={durationFromAudio("audio/clip3.mp3")}
   />
   ```

5. Add `"render:clip3": "remotion render Clip3 out/clip3.mp4"` to `package.json`.

## Components

| Component | Use |
|---|---|
| `Background` | Wrap all scenes. Grain, scanlines, vignette, camera drift. |
| `GlitchTransition` | `mode="in" \| "out" \| "pulse"` around a scene. `Glitch` and `Flash` for one-off hits. |
| `TitleSlam` | Big slam text: `text`, `color`, `fontSize`, `at`. |
| `Counter` | Number ticker: `to`, `at`, `durationInFrames`, `prefix`, `suffix`. |
| `Terminal` | Typed lines with a blinking cursor. |
| `ChatWindow` | Messenger window: sender, avatar, timestamp, urgent subject, typing dots, typed messages. |
| `BlobCharacter` | `color`, `accessory` (`hoodie`, `bikerVest`), `expression` (`calm`, `scared`, `angry`), `bulk`. |
| `AvatarBadge`, `PirateHat` | Profile badges (`flask`, `skull`, `helmet`) and the self-drawing hat. |
| `ShopWindow` | Marketplace browser window: listings, stars, review chips, red "reveal" stage. |
| `BuildingIcon`, `CoinIcon`, `CrossOut`, `Star` | Small icons (government/bank, Bitcoin, self-drawing red X). |
| `IconFlood` | Grid of user icons with address tags. |
| `Captions` | Word-by-word captions from the Whisper JSON. |

Frame props on components are local, so wrap a scene in `<Sequence from={...}>`
and pass `cueFrame - sequenceStart`.

Characters: DPR = `colors.dpr` + `hoodie`; FriendlyChemist = `colors.chemist` + `scared`;
Redandwhite = `colors.redandwhite` + `bikerVest` + `bulk={1.35}`.
