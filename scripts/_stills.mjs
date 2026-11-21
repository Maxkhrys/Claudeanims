// Renders check stills of one composition in a single bundle.
// Usage: node scripts/_stills.mjs <CompositionId> <outDir> <sec,sec,...>
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
const [, , id, out, list] = process.argv;
const browserExecutable = fs.existsSync("/opt/pw-browsers/chromium_headless_shell") ? "/opt/pw-browsers/chromium_headless_shell" : undefined;
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: "src/index.ts" });
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const s of list.split(",")) {
  const output = `${out}/${String(s).padStart(5, "0")}.jpg`;
  await renderStill({ composition, serveUrl, output, frame: Math.round(+s * composition.fps), imageFormat: "jpeg", jpegQuality: 85, browserExecutable });
  console.log(output);
}
