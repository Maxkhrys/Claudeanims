// Thumbnail + vertical cover for the "15-year-old's GTA 6 PC port killed" Short (OnionThumb look).
// Run from this folder: node make.js  -> yt.jpg (1280x720), cover.jpg (1080x1920)
// Real logos: GTA VI, Take-Two, GitHub, Discord (PNGs in this folder). The kid is a drawn silhouette (minor, never shown).
const { chromium } = require('playwright'); const path = require('path');
const Y = '#FFD60A';
const kid = `<svg viewBox="-130 -280 260 290" width="100%"><path d="M-125,0 C-127,-95 -95,-148 0,-154 C95,-148 127,-95 125,0Z" fill="#111"/><path d="M-66,-146 C-75,-262 75,-262 66,-146 C53,-130 -53,-130 -66,-146Z" fill="#111"/><path d="M-70,-205 C-70,-276 70,-276 70,-205" fill="none" stroke="#2a2a30" stroke-width="13"/><rect x="-86" y="-222" width="28" height="50" rx="11" fill="#22E6FF"/><rect x="58" y="-222" width="28" height="50" rx="11" fill="#22E6FF"/></svg>`;
const monitor = (w) => `<svg viewBox="-170 -130 340 280" width="${w}"><rect x="-160" y="-120" width="320" height="200" rx="14" fill="#1b1d24" stroke="#000" stroke-width="5"/><rect x="-145" y="-105" width="290" height="170" fill="#1a0306"/><text x="0" y="-45" text-anchor="middle" font-family="Anton" font-size="40" fill="#fff">GTA VI · PC</text><rect x="-120" y="-20" width="240" height="26" fill="#3a0b10"/><rect x="-120" y="-20" width="170" height="26" fill="#E8283C"/><text x="0" y="48" text-anchor="middle" font-family="Anton" font-size="34" fill="#E8283C">DELETED</text><path d="M10,-60 L-20,-20 L15,10 L-10,60 M10,-60 L60,-90 M15,10 L70,30" stroke="#fff" stroke-width="4" fill="none"/><rect x="-30" y="80" width="60" height="34" fill="#14161c"/><rect x="-80" y="110" width="160" height="14" rx="5" fill="#14161c"/></svg>`;
const css=(W,H)=>`@font-face{font-family:Anton;src:url(Anton-400.woff2)}*{margin:0;box-sizing:border-box}body{width:${W}px;height:${H}px;background:#0B0C10;overflow:hidden;position:relative;font-family:Anton;text-transform:uppercase}
.rays{position:absolute;inset:-50%;background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,255,255,.045) 0 9deg,transparent 9deg 22deg)}
.glow{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(232,40,60,.38),transparent 65%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.75))}
.st{position:absolute;filter:drop-shadow(7px 0 0 #fff) drop-shadow(-7px 0 0 #fff) drop-shadow(0 7px 0 #fff) drop-shadow(0 -7px 0 #fff) drop-shadow(0 18px 30px rgba(0,0,0,.7))}
.logo{position:absolute;filter:drop-shadow(0 10px 18px rgba(0,0,0,.8))}
.top{position:absolute;color:#fff;line-height:1;text-shadow:0 8px 0 rgba(0,0,0,.6);white-space:nowrap}
.hit{position:absolute;background:${Y};color:#0B0C10;line-height:1;transform:rotate(-3deg);box-shadow:8px 10px 0 rgba(0,0,0,.6);white-space:nowrap}
.ring{position:absolute;border:12px solid ${Y};border-radius:50%;background:rgba(11,12,16,.85);display:flex;align-items:center;justify-content:center;transform:rotate(-6deg);box-shadow:0 0 50px rgba(255,214,10,.45)}
.age{position:absolute;background:#E8283C;color:#fff;line-height:1;transform:rotate(6deg);box-shadow:6px 8px 0 rgba(0,0,0,.6);white-space:nowrap}
.onion{position:absolute;border-radius:50%}img{display:block}`;
const yt=`<style>${css(1280,720)}</style><div class="rays"></div><div class="glow" style="left:620px;top:-60px;width:820px;height:820px"></div>
<div class="ring" style="left:800px;top:250px;width:420px;height:420px">${monitor(330)}</div>
<div class="st" style="left:700px;top:330px;width:250px">${kid}</div>
<div class="vig"></div>
<img class="logo" src="gta6.png" style="left:50px;top:24px;width:330px">
<img class="logo" src="taketwo-white.png" style="left:410px;top:60px;width:150px">
<img class="logo" src="github-white.png" style="left:590px;top:62px;width:116px">
<div class="age" style="left:790px;top:250px;font-size:64px;padding:6px 18px 10px">AGE 15</div>
<div class="top" style="left:56px;top:300px;font-size:132px">He put GTA 6</div>
<div class="hit" style="left:50px;top:460px;font-size:150px;padding:6px 26px 14px">on PC?!</div>
<img class="onion" src="onion.png" style="right:26px;top:22px;width:104px">`;
const cover=`<style>${css(1080,1920)}</style><div class="rays"></div><div class="glow" style="left:60px;top:900px;width:1000px;height:1000px"></div>
<div class="ring" style="left:380px;top:1060px;width:480px;height:480px">${monitor(380)}</div>
<div class="st" style="left:150px;top:1180px;width:330px">${kid}</div>
<div class="vig"></div>
<img class="onion" src="onion.png" style="left:62px;top:220px;width:104px">
<img class="logo" src="gta6.png" style="left:290px;top:210px;width:420px">
<img class="logo" src="taketwo-white.png" style="left:740px;top:260px;width:150px">
<img class="logo" src="github-white.png" style="left:760px;top:420px;width:116px">
<div class="top" style="left:66px;top:600px;font-size:160px">He put GTA 6</div>
<div class="hit" style="left:60px;top:800px;font-size:180px;padding:8px 28px 16px">on PC?!</div>
<div class="age" style="left:120px;top:1100px;font-size:80px;padding:6px 20px 12px">AGE 15</div>`;
(async()=>{const b=await chromium.launch();for(const [n,h,W,H] of [['yt',yt,1280,720],['cover',cover,1080,1920]]){require('fs').writeFileSync(n+'.html','<!doctype html><meta charset=utf8><body>'+h);const p=await b.newPage({viewport:{width:W,height:H}});await p.goto('file://'+path.resolve(n+'.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:n+'.jpg',type:'jpeg',quality:93});}await b.close()})();
