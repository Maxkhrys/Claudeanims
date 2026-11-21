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

## Video 2: AlphaBay

One narration file, 14 clips, one composition.

```bash
npm run transcribe -- video2/full   # Whisper -> public/audio/video2/full.json
npm run timings:video2              # matches the script to the transcript -> src/video2/clipTimings.ts
npm run render:video2               # -> out/video2.mp4 (about 10:19)
npx remotion render V2-Clip8 out/v2-clip8.mp4   # any single clip, with its slice of the audio
```

- `scripts/alphabay_script.md` is the source of truth for what appears on screen.
- `scripts/clip-timings.mjs` finds each clip's start by matching the first narration line under
  every `## Clip N` heading to the transcript, and cuts in the middle of the pause before it.
- `src/video2/ClipN.tsx` holds one clip each. Inside a clip, `const { c, D } = useClip(N)` gives
  cue frames local to that clip. Clips render visuals only; `Video2` adds the audio, background and captions.
- `src/video2/words.ts` corrects Whisper's spellings of names (Cazes, Alexandre) for captions and cues.
- Compositions: `Video2` (full), `V2-Clip1` ... `V2-Clip14`, and `V2StyleGuide` (cast and component sheet).

New parts added for this video (all in `src/components/`): `EmailHeader`, `MapPins`, `EvidenceBoard`,
`AssetGarage` + `Car`, `SeizedStamp`, `MarketLogo` / `OnionLogo` / `CamelLogo`, and the `Cazes`, `Cop`
and `RossBlob` cast presets. Logos are stylised on purpose, not copies of the real ones.

## Video 3: Lapsus$

The narration comes in three audio parts (`public/audio/video3/part1.mp3` to `part3.mp3`), 26 clips.

```bash
npm run transcribe -- video3/part1   # once per part
npm run timings:video3               # merges the transcripts and writes src/video3/clipTimings.ts
npm run render:video3                # -> out/video3.mp4 (18:18 of narration plus a 15s end screen)
npx remotion render V3-Clip17 out/v3-clip17.mp4
```

- `scripts/lapsus_script.md` is the script, with a fact-check list at the bottom.
- `scripts/video3-timings.mjs` knows which clips are in which part, so clips can be built as each part arrives.
- To change the sentencing outcome on screen, edit `SENTENCE_STATUS` and `SENTENCE_NOTE` at the top of
  `src/video3/Clip25.tsx`, and regenerate part 3 of the narration to match.
- Shared parts added for this video: `HotelRoom`, `BrandTag` (plain company wordmarks), `PhoneBuzz`,
  `White` (the main character) and `FadeIn` (silent fade for the quiet courtroom clips).

## Vertical (TikTok / Reels)

`npm run render:vertical` renders the ten Silk Road clips as 1080x1920 files in `out/vertical/`.
`src/clips/Vertical.tsx` wraps each clip: part title on top, the original 16:9 clip scaled across
the middle, larger captions below, and the bottom kept clear for the app's own buttons.
Compositions: `SilkRoad-Vertical-1` ... `SilkRoad-Vertical-10`.

## Sound effects

`python3 scripts/make-sfx.py` synthesizes 16 sounds into `public/sfx` (no samples). Components play
them on their own: `TitleSlam` (slam), `Stamp` / `SeizedStamp` (stamp), `Counter` (ticks, then a coin
for money), `Terminal` and `ChatWindow` (key clicks, notification), `Chip` (pop), glitches (glitch).
Add extra ones with `<Sfx name="crash" at={c("smashes")} />`. Pass `sound={false}` to a component to
mute it, or change `SFX_VOLUME` in `src/components/Sfx.tsx` for the overall level. Because the sounds
live in the shared components, re-rendering the Silk Road clips adds sound to them too.

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

## Shorts (native 9:16)

Built for the vertical frame instead of wrapping a 16:9 clip. Flat blob characters, staged with fake 3D:
CSS 3D rooms and buildings, characters as camera-facing billboards, cards that flip, camera moves.

```bash
npm run render:short-lapsus1     # -> out/short-lapsus-1.mp4 (about 43s)
node scripts/short-stills.mjs out/stills 0 300 700 1100   # quick check stills, half size
```

- `src/shorts/ShortLapsus1.tsx`: Lapsus$ part 1 (the hotel room), reusing the first 41s of `audio/video3/part1.mp3`.
  Order: headline + TV stick on frame 0, dive into the hotel window, 3D cutaway room, loadout cards,
  studio break-in, phone takeover for the message, cliffhanger, end card pointing to the full video.
- Captions are big and centred (`ShortCaptions`), and hidden while the typed message is on screen.
- If Chrome can't be downloaded, add `--browser-executable=<path to chrome>` to the render command.
