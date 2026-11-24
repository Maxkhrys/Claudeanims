const { chromium } = require('playwright'); const path=require('path');
const ctrl=`<svg viewBox="-130 -80 260 160" width="100%"><path d="M-80,-40 C-60,-62 60,-62 80,-40 C108,-12 122,44 98,56 C74,64 58,30 40,20 L-40,20 C-58,30 -74,64 -98,56 C-122,44 -108,-12 -80,-40Z" fill="#2a2b33" stroke="#fff" stroke-width="7"/><circle cx="58" cy="-26" r="10" fill="#ff4d6d"/><circle cx="78" cy="-8" r="10" fill="#22E6FF"/><circle cx="38" cy="-8" r="10" fill="#FFD60A"/><circle cx="58" cy="10" r="10" fill="#39FF88"/><path d="M-72,-10 h38 M-53,-29 v38" stroke="#ddd" stroke-width="11" stroke-linecap="round"/><circle cx="-22" cy="22" r="12" fill="#111"/><circle cx="24" cy="22" r="12" fill="#111"/></svg>`;
const css=(W,H)=>`@font-face{font-family:Anton;src:url(Anton-400.woff2)}*{margin:0;box-sizing:border-box}body{width:${W}px;height:${H}px;background:#0B0C10;overflow:hidden;position:relative;font-family:Anton;text-transform:uppercase}
.rays{position:absolute;inset:-50%;background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,255,255,.045) 0 9deg,transparent 9deg 22deg)}
.glow{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(255,214,10,.30),transparent 65%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.75))}
.j{position:absolute;filter:drop-shadow(7px 0 0 #fff) drop-shadow(-7px 0 0 #fff) drop-shadow(0 7px 0 #fff) drop-shadow(0 -7px 0 #fff) drop-shadow(5px 5px 0 #fff) drop-shadow(-5px -5px 0 #fff) drop-shadow(5px -5px 0 #fff) drop-shadow(-5px 5px 0 #fff) drop-shadow(0 18px 30px rgba(0,0,0,.7))}
.top{position:absolute;color:#fff;line-height:1;text-shadow:0 8px 0 rgba(0,0,0,.6)}
.hit{position:absolute;background:#FFD60A;color:#0B0C10;line-height:1;transform:rotate(-3deg);box-shadow:8px 10px 0 rgba(0,0,0,.6);white-space:nowrap}
.ring{position:absolute;border:12px solid #FFD60A;border-radius:50%;background:rgba(11,12,16,.82);display:flex;align-items:center;justify-content:center;transform:rotate(-8deg);box-shadow:0 0 50px rgba(255,214,10,.45)}
.onion{position:absolute;border-radius:50%}img{display:block}`;
const yt=`<style>${css(1280,720)}</style><div class="rays"></div><div class="glow" style="left:560px;top:-40px;width:900px;height:900px"></div>
<img class="j" src="jensen-cut.png" style="left:680px;top:60px;width:620px">
<div class="vig" style="pointer-events:none"></div>
<img src="nvidia-logo-white.png" style="position:absolute;left:60px;top:28px;height:215px">
<img src="gta6.png" style="position:absolute;left:372px;top:34px;height:205px">
<div class="top" style="left:60px;top:262px;font-size:150px">He quit...</div>
<div class="hit" style="left:54px;top:440px;font-size:122px;padding:8px 26px 14px">He's back?!</div>
<div class="ring" style="left:640px;top:468px;width:240px;height:240px"><div style="width:185px">${ctrl}</div></div>
<img class="onion" src="onion.png" style="right:26px;top:22px;width:104px">`;
const cover=`<style>${css(1080,1920)}</style><div class="rays"></div><div class="glow" style="left:60px;top:800px;width:1000px;height:1000px"></div>
<img class="j" src="jensen-cut.png" style="left:110px;top:985px;width:740px">
<div class="vig" style="pointer-events:none"></div>
<img class="onion" src="onion.png" style="left:62px;top:268px;width:120px">
<img src="nvidia-logo-white.png" style="position:absolute;left:200px;top:255px;height:290px">
<img src="gta6.png" style="position:absolute;left:600px;top:262px;height:275px">
<div class="top" style="left:66px;top:575px;font-size:176px">He quit...</div>
<div class="hit" style="left:60px;top:770px;font-size:170px;padding:8px 28px 16px">He's back?!</div>
<div class="ring" style="left:560px;top:1290px;width:330px;height:330px"><div style="width:250px">${ctrl}</div></div>`;
(async()=>{const b=await chromium.launch();for(const [n,h,W,H] of [['yt',yt,1280,720],['cover',cover,1080,1920]]){require('fs').writeFileSync(n+'.html','<!doctype html><meta charset=utf8><body>'+h);const p=await b.newPage({viewport:{width:W,height:H}});await p.goto('file://'+path.resolve(n+'.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:n+'.jpg',type:'jpeg',quality:93});}await b.close()})();
