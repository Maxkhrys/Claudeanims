// Renders every Onion Archive thumbnail (YouTube 1280x720 + vertical cover 1080x1920) as JPG.
// Usage: node scripts/thumbs.mjs [Id ...]      e.g. node scripts/thumbs.mjs Judge
// In the cloud container add: BROWSER=/opt/pw-browsers/chromium_headless_shell
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const out = path.resolve("out/thumbs");
fs.mkdirSync(out, { recursive: true });
const only = process.argv.slice(2);
const browserExecutable = process.env.BROWSER || null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comps = (await getCompositions(serveUrl, { browserExecutable })).filter(
  (c) => c.id.startsWith("Thumb-") && (only.length === 0 || only.some((o) => c.id.startsWith(`Thumb-${o}-`))),
);
for (const c of comps) {
  const [, id, kind] = c.id.split("-");
  const file = path.join(out, `${id}-${kind.toLowerCase()}.jpg`);
  await renderStill({ composition: c, serveUrl, output: file, imageFormat: "jpeg", jpegQuality: 92, browserExecutable });
  console.log("wrote", file);
}
