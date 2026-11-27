// Thumbnail + vertical cover for the "GTA 6 photo got me banned" Short (OnionThumb look).
// Run from this folder: node make.js  -> yt.jpg (1280x720), cover.jpg (1080x1920)
// Real logos: GTA VI, PlayStation, Xbox (simple-icons marks, white). Beach photo is drawn; bodies censored.
const { chromium } = require('playwright'); const path = require('path');
const Y = '#FFD60A';
const photo = (w) => `<svg viewBox="0 0 400 300" width="${w}"><defs><linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0b3d"/><stop offset=".6" stop-color="#c2306b"/><stop offset="1" stop-color="#ff9a3c"/></linearGradient></defs><rect width="400" height="300" fill="#F1ECE2"/><rect x="16" y="16" width="368" height="230" fill="url(#v)"/><circle cx="250" cy="130" r="40" fill="#ffd36b"/><rect x="16" y="140" width="368" height="40" fill="#1d5e8c"/><rect x="16" y="180" width="368" height="66" fill="#e7b77a"/><path d="M50,246 C60,190 70,150 60,100" stroke="#140a1c" stroke-width="9" fill="none"/><path d="M60,100 q-40,0 -60,30 M60,100 q40,-10 60,20 M60,100 q-10,-30 -40,-40 M60,100 q20,-30 50,-30" stroke="#140a1c" stroke-width="8" fill="none"/><rect x="110" y="178" width="200" height="54" fill="#000"/><text x="210" y="217" text-anchor="middle" font-family="Anton" font-size="38" fill="#fff" letter-spacing="3">CENSORED</text><text x="200" y="280" text-anchor="middle" font-family="monospace" font-weight="700" font-size="20" fill="#333">GTA 6 · IN-GAME PHOTO</text></svg>`;
const pad = `<svg viewBox="-160 -110 320 220" width="100%"><path d="M-110,-60 C-150,-60 -160,0 -150,60 C-140,110 -95,110 -70,60 L-40,20 L40,20 L70,60 C95,110 140,110 150,60 C160,0 150,-60 110,-60 Z" fill="#1b1d24" stroke="#000" stroke-width="6"/><rect x="-100" y="-20" width="50" height="16" rx="4" fill="#5b6070"/><rect x="-83" y="-37" width="16" height="50" rx="4" fill="#5b6070"/><circle cx="80" cy="-30" r="11" fill="#22E6FF"/><circle cx="105" cy="-8" r="11" fill="#E8283C"/><circle cx="55" cy="-8" r="11" fill="#FF2BD6"/><circle cx="80" cy="14" r="11" fill="#39FF88"/><text x="0" y="-70" text-anchor="middle" font-family="Anton" font-size="70" fill="#E8283C">!!</text></svg>`;
const css=(W,H)=>`@font-face{font-family:Anton;src:url(Anton-400.woff2)}*{margin:0;box-sizing:border-box}body{width:${W}px;height:${H}px;background:#0B0C10;overflow:hidden;position:relative;font-family:Anton;text-transform:uppercase}
.rays{position:absolute;inset:-50%;background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,255,255,.045) 0 9deg,transparent 9deg 22deg)}
.glow{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(232,40,60,.42),transparent 65%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.75))}
.st{position:absolute;filter:drop-shadow(7px 0 0 #fff) drop-shadow(-7px 0 0 #fff) drop-shadow(0 7px 0 #fff) drop-shadow(0 -7px 0 #fff) drop-shadow(0 18px 30px rgba(0,0,0,.7))}
.logo{position:absolute;filter:drop-shadow(0 10px 18px rgba(0,0,0,.8))}
.top{position:absolute;color:#fff;line-height:1;text-shadow:0 8px 0 rgba(0,0,0,.6);white-space:nowrap}
.hit{position:absolute;background:${Y};color:#0B0C10;line-height:1;transform:rotate(-3deg);box-shadow:8px 10px 0 rgba(0,0,0,.6);white-space:nowrap}
.ring{position:absolute;border:12px solid ${Y};border-radius:50%;background:rgba(11,12,16,.85);display:flex;align-items:center;justify-content:center;transform:rotate(-6deg);box-shadow:0 0 50px rgba(255,214,10,.45)}
.age{position:absolute;background:#E8283C;color:#fff;line-height:1;transform:rotate(6deg);box-shadow:6px 8px 0 rgba(0,0,0,.6);white-space:nowrap}
.onion{position:absolute;border-radius:50%}img{display:block}`;
const yt=`<style>${css(1280,720)}</style><div class="rays"></div><div class="glow" style="left:620px;top:-60px;width:820px;height:820px"></div>
<div class="ring" style="left:790px;top:230px;width:440px;height:440px">${photo(330)}</div>
<div class="st" style="left:690px;top:470px;width:230px;transform:rotate(-12deg)">${pad}</div>
<div class="vig"></div>
<img class="logo" src="gta6.png" style="left:50px;top:24px;width:330px">
<img class="logo" src="ps-white.svg" style="left:410px;top:70px;width:130px">
<img class="logo" src="xbox-white.svg" style="left:575px;top:72px;width:112px">
<div class="age" style="left:1010px;top:220px;font-size:60px;padding:6px 18px 10px">30 DAYS</div>
<div class="top" style="left:56px;top:300px;font-size:132px">1 GTA 6 photo</div>
<div class="hit" style="left:50px;top:460px;font-size:150px;padding:6px 26px 14px">= BANNED</div>
<img class="onion" src="onion.png" style="right:26px;top:22px;width:104px">`;
const cover=`<style>${css(1080,1920)}</style><div class="rays"></div><div class="glow" style="left:60px;top:900px;width:1000px;height:1000px"></div>
<div class="ring" style="left:330px;top:1040px;width:520px;height:520px">${photo(400)}</div>
<div class="st" style="left:90px;top:1330px;width:300px;transform:rotate(-12deg)">${pad}</div>
<div class="vig"></div>
<img class="onion" src="onion.png" style="left:62px;top:220px;width:104px">
<img class="logo" src="gta6.png" style="left:250px;top:210px;width:420px">
<img class="logo" src="ps-white.svg" style="left:720px;top:240px;width:150px">
<img class="logo" src="xbox-white.svg" style="left:735px;top:420px;width:120px">
<div class="top" style="left:66px;top:600px;font-size:150px">1 GTA 6 photo</div>
<div class="hit" style="left:60px;top:800px;font-size:180px;padding:8px 28px 16px">= BANNED</div>
<div class="age" style="left:640px;top:1030px;font-size:80px;padding:6px 20px 12px">30 DAYS</div>`;
(async()=>{const b=await chromium.launch();for(const [n,h,W,H] of [['yt',yt,1280,720],['cover',cover,1080,1920]]){require('fs').writeFileSync(n+'.html','<!doctype html><meta charset=utf8><body>'+h);const p=await b.newPage({viewport:{width:W,height:H}});await p.goto('file://'+path.resolve(n+'.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:n+'.jpg',type:'jpeg',quality:93});}await b.close()})();
