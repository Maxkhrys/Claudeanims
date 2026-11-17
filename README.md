# Silk Road documentary (Remotion)

Ten one-minute clips, animated in code. 1920x1080, 30fps. Style: "dark web case file".

## Commands

```bash
npm install
npm run dev                      # Remotion Studio
npm run render:clip1             # -> out/clip1.mp4
npm run render:clip2             # -> out/clip2.mp4 (render:clip3 ... render:clip10 likewise)
npm run render:all               # all ten clips
npm run build:full               # -> out/full.mp4: all clips + chapter cards + end screen (about 8:15)
npm run transcribe -- clip1      # Whisper word timestamps -> public/audio/clip1.json
npx remotion still Clip1 out/frame.png --frame=600
```

Render without captions:

```bash
npx remotion render Clip1 out/clip1-nocaps.mp4 --props='{"showCaptions":false}'
```

In Studio, captions toggle with the `showCaptions` checkbox in the props panel.
The `StyleGuide` composition shows every character, avatar and colour on one frame.

## Full video

`npm run build:full` renders anything missing in `out/`, then joins: clip 1, a 2-second chapter
card before each of clips 2 to 10, and a 15-second end screen. Add `-- --rerender` to render every
clip again first. Card titles live in `scripts/build-full.mjs`; the card and end-screen designs
are in `src/clips/Extras.tsx`. The dashed boxes on the end screen mark where YouTube's
suggested-video and subscribe elements go.

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
3. Copy `src/clips/Clip5.tsx` to `ClipN.tsx`. Change the transcript import and
   the audio path, and replace the scenes, timing each element with `c("spoken word")`.
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

## Clips 3 onward: the scene kit

Clips 3 to 7 use `src/components/Kit.tsx`, which makes a clip much shorter to write:

- `ClipShell`: audio + `Background` + `Captions` in one wrapper.
- `useCues(words)`: returns `c("word")` (start frame) and `ce("word")` (end frame).
- `Scene from to exit="fade|glitch|cut"`: shows children between two frames **without shifting time**,
  so everything inside uses composition frames and you pass `at={c("word")}` directly.
- `Pop`, `Chip`, `Stamp`, `Vanish`, `Card`, `Crosshair`, `Parcel`: small animated building blocks.
- `Chemist`, `Dpr`, `RedWhite`, `DprDesk`, `NameTag`, `SENDERS`: the cast and their chat headers.
- `captionNames(words)`: joins "Friendly Chemist" / "Red and White" into one caption word.

Use `Clip5.tsx` as the template for new clips. `Clip1.tsx` and `Clip2.tsx` use the older
`<Sequence>` pattern with local frames; both approaches work.

Chat text in clips 4 to 7 is quoted from the trial-exhibit message transcript. `[...]` marks a cut
inside a message. Names of alleged private individuals are redacted on screen.

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
