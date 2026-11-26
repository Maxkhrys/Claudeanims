// Thumbnail + vertical cover for the "One week: FBI, CIA, Treasury hacked" Short (OnionThumb look).
// Run from this folder: node make.js  -> yt.jpg (1280x720), cover.jpg (1080x1920)
// Seals are drawn stand-ins: swap in the real seal PNGs if they become available.
const { chromium } = require('playwright'); const path = require('path');
const Y = '#FFD60A';
const seal = (k) => {
  const S = { fbi: ['#0c2350', '#14408f', '#d9a933', '#d9a933', 'FEDERAL BUREAU OF INVESTIGATION', 'FBI', 70],
    cia: ['#101c33', '#1f3a68', '#c9d2dc', '#e9eef3', 'CENTRAL INTELLIGENCE AGENCY', 'CIA', 52],
    treasury: ['#0d3b25', '#145c38', '#d9a933', '#d9a933', 'DEPARTMENT OF THE TREASURY', 'TREASURY', 34] }[k];
  const star = k === 'cia' ? Array.from({ length: 16 }, (_, i) => `<path d="M0,-80 L9,0 L-9,0Z" fill="${i % 2 ? '#c9d2dc' : '#E8283C'}" transform="rotate(${i * 22.5})"/>`).join('') : '';
  return `<svg viewBox="-160 -160 320 320" width="100%"><defs><path id="a${k}" d="M-118,0 A118,118 0 1 1 118,0 A118,118 0 1 1 -118,0"/></defs>
<circle r="150" fill="${S[0]}" stroke="${S[2]}" stroke-width="9"/><text font-family="Anton" font-size="25" fill="${S[3]}" letter-spacing="2"><textPath href="#a${k}">${S[4]}</textPath></text>
<circle r="92" fill="${S[1]}" stroke="${S[2]}" stroke-width="4"/>${star}<text y="${k === 'fbi' ? 24 : 18}" text-anchor="middle" font-family="Anton" font-size="${S[6]}" fill="#fff" stroke="${S[1]}" stroke-width="6" paint-order="stroke">${S[5]}</text></svg>`;
};
const hood = `<svg viewBox="-120 -330 240 340" width="100%"><path d="M-110,0 C-118,-140 -95,-215 0,-224 C95,-215 118,-140 110,0Z" fill="#111"/><path d="M-70,-214 C-84,-350 84,-350 70,-214 C60,-190 -60,-190 -70,-214Z" fill="#111"/><path d="M-44,-226 C-48,-300 48,-300 44,-226 C36,-206 -36,-206 -44,-226Z" fill="#000"/><circle cx="-20" cy="-262" r="9" fill="#E8283C"/><circle cx="20" cy="-262" r="9" fill="#E8283C"/></svg>`;
const css=(W,H)=>`@font-face{font-family:Anton;src:url(Anton-400.woff2)}*{margin:0;box-sizing:border-box}body{width:${W}px;height:${H}px;background:#0B0C10;overflow:hidden;position:relative;font-family:Anton;text-transform:uppercase}
.rays{position:absolute;inset:-50%;background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,255,255,.045) 0 9deg,transparent 9deg 22deg)}
.glow{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(232,40,60,.35),transparent 65%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.75))}
.st{position:absolute;filter:drop-shadow(7px 0 0 #fff) drop-shadow(-7px 0 0 #fff) drop-shadow(0 7px 0 #fff) drop-shadow(0 -7px 0 #fff) drop-shadow(0 18px 30px rgba(0,0,0,.7))}
.seal{position:absolute;filter:drop-shadow(0 10px 18px rgba(0,0,0,.7))}
.top{position:absolute;color:#fff;line-height:1;text-shadow:0 8px 0 rgba(0,0,0,.6)}
.hit{position:absolute;background:${Y};color:#0B0C10;line-height:1;transform:rotate(-3deg);box-shadow:8px 10px 0 rgba(0,0,0,.6);white-space:nowrap}
.ring{position:absolute;border:12px solid ${Y};border-radius:50%;background:rgba(11,12,16,.85);display:flex;align-items:center;justify-content:center;transform:rotate(-8deg);box-shadow:0 0 50px rgba(255,214,10,.45);color:#E8283C}
.onion{position:absolute;border-radius:50%}img{display:block}`;
const yt=`<style>${css(1280,720)}</style><div class="rays"></div><div class="glow" style="left:640px;top:-80px;width:820px;height:820px"></div>
<div class="st" style="left:800px;top:120px;width:360px">${hood}</div>
<div class="vig"></div>
<div class="seal" style="left:60px;top:40px;width:200px">${seal('fbi')}</div>
<div class="seal" style="left:275px;top:40px;width:200px">${seal('cia')}</div>
<div class="seal" style="left:490px;top:40px;width:200px">${seal('treasury')}</div>
<div class="top" style="left:60px;top:286px;font-size:150px">One week</div>
<div class="hit" style="left:54px;top:460px;font-size:140px;padding:8px 26px 14px">All hacked</div>
<div class="ring" style="left:960px;top:440px;width:240px;height:240px;font-size:96px">WHO?</div>
<img class="onion" src="onion.png" style="right:26px;top:22px;width:104px">`;
const cover=`<style>${css(1080,1920)}</style><div class="rays"></div><div class="glow" style="left:80px;top:900px;width:1000px;height:1000px"></div>
<div class="st" style="left:300px;top:1080px;width:440px">${hood}</div>
<div class="vig"></div>
<img class="onion" src="onion.png" style="left:62px;top:230px;width:110px">
<div class="seal" style="left:70px;top:370px;width:250px">${seal('fbi')}</div>
<div class="seal" style="left:340px;top:370px;width:250px">${seal('cia')}</div>
<div class="seal" style="left:610px;top:370px;width:250px">${seal('treasury')}</div>
<div class="top" style="left:66px;top:680px;font-size:190px">One week</div>
<div class="hit" style="left:60px;top:890px;font-size:170px;padding:8px 28px 16px">All hacked</div>
<div class="ring" style="left:600px;top:1220px;width:300px;height:300px;font-size:116px">WHO?</div>`;
(async()=>{const b=await chromium.launch();for(const [n,h,W,H] of [['yt',yt,1280,720],['cover',cover,1080,1920]]){require('fs').writeFileSync(n+'.html','<!doctype html><meta charset=utf8><body>'+h);const p=await b.newPage({viewport:{width:W,height:H}});await p.goto('file://'+path.resolve(n+'.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:n+'.jpg',type:'jpeg',quality:93});}await b.close()})();
