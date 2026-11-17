// Generates word-level timestamps for a clip's narration with whisper.cpp.
// Usage: node scripts/transcribe.mjs clip1          ->  public/audio/clip1.json
//        node scripts/transcribe.mjs video2/full    ->  public/audio/video2/full.json
import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
import {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} from "@remotion/install-whisper-cpp";

const clip = process.argv[2];
if (!clip) {
  console.error("Usage: node scripts/transcribe.mjs <clipName>   e.g. clip1");
  process.exit(1);
}

const root = process.cwd();
const mp3 = path.join(root, "public", "audio", `${clip}.mp3`);
if (!fs.existsSync(mp3)) {
  console.error(`Missing ${mp3}`);
  process.exit(1);
}

const whisperPath = path.join(root, ".whisper");
const version = "1.7.6";
const model = process.env.WHISPER_MODEL ?? "medium.en";

await installWhisperCpp({ to: whisperPath, version });
await downloadWhisperModel({ model, folder: whisperPath });

// whisper.cpp needs 16 kHz mono WAV
const wav = path.join(whisperPath, `${clip.replace(/[\/\\]/g, "_")}.wav`);
execSync(`ffmpeg -y -loglevel error -i "${mp3}" -ar 16000 -ac 1 "${wav}"`);

const whisperCppOutput = await transcribe({
  inputPath: wav,
  whisperPath,
  whisperCppVersion: version,
  model,
  tokenLevelTimestamps: true,
  splitOnWord: true,
});

const { captions } = toCaptions({ whisperCppOutput });
const words = captions
  .map((c) => ({
    text: c.text.trim(),
    start: +(c.startMs / 1000).toFixed(3),
    end: +(c.endMs / 1000).toFixed(3),
  }))
  .filter((w) => w.text.length > 0);

const out = path.join(root, "public", "audio", `${clip}.json`);
fs.writeFileSync(out, JSON.stringify({ clip, model, words }, null, 2));
fs.unlinkSync(wav);
console.log(`Wrote ${words.length} words -> ${out}`);
