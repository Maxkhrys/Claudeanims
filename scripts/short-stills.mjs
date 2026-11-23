import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const frames = process.argv.slice(3).map(Number);
// Renders check stills of a Short in one bundle: node scripts/short-stills.mjs <outDir> <frame> <frame> ...
// Set COMP to pick another Short (default Short-Lapsus-1).
// Set BROWSER to a Chrome binary when remotion.media is unreachable (e.g. /opt/pw-browsers/chromium_headless_shell).
const BX = process.env.BROWSER || undefined;
const out = process.argv[2];
const COMP_PROPS = process.env.LANDSCAPE ? { showCaptions: true, landscape: true } : { showCaptions: true };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id: process.env.COMP || "Short-Lapsus-1", inputProps: COMP_PROPS, browserExecutable: BX });
for (const f of frames) {
  await renderStill({ serveUrl, composition: comp, frame: f, output: `${out}/f${String(f).padStart(4, "0")}.jpg`, imageFormat: "jpeg", scale: 0.5, inputProps: COMP_PROPS, browserExecutable: BX });
  console.log("done", f);
}
