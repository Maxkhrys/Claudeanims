// Builds out/full.mp4: clip1, then a chapter card before each of clips 2-10, then the end screen.
// Clips that already exist in out/ are reused; pass --rerender to render them again.
import { execSync } from "node:child_process";
import fs from "node:fs";

const TITLES = ["THE MESSAGE", "THE IDEALIST", "THE EMPIRE", "THE BLACKMAIL", "REDANDWHITE", "THE HIT", "FOUR MORE", "THE CON", "THE NET CLOSES", "THE VERDICT"];
const force = process.argv.includes("--rerender");
const run = (cmd) => execSync(cmd, { stdio: "inherit" });
const render = (id, out, props) => {
  if (!force && fs.existsSync(out)) return;
  const p = props ? ` --props='${JSON.stringify(props)}'` : "";
  run(`npx remotion render ${id} ${out} --enforce-audio-track${p}`);
};

fs.mkdirSync("out/cards", { recursive: true });
const parts = [];
for (let n = 1; n <= 10; n++) {
  if (n > 1) {
    const card = `out/cards/card${n}.mp4`;
    render("ChapterCard", card, { part: n, title: TITLES[n - 1] });
    parts.push(card);
  }
  render(`Clip${n}`, `out/clip${n}.mp4`);
  parts.push(`out/clip${n}.mp4`);
}
render("EndScreen", "out/cards/endscreen.mp4");
parts.push("out/cards/endscreen.mp4");

fs.writeFileSync("out/full.txt", parts.map((p) => `file '${p.replace(/^out\//, "")}'`).join("\n"));
// re-encode audio only, so the joins are gapless; video is copied untouched
run(`ffmpeg -y -loglevel error -f concat -safe 0 -i out/full.txt -c:v copy -c:a aac -b:a 192k -movflags +faststart out/full.mp4`);
console.log("Wrote out/full.mp4");
