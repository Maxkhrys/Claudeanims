// Thumbnail + vertical cover for the AI bank heist Short (same look as the OnionThumb system).
// Run from this folder: node make.js  -> yt.jpg (1280x720), cover.jpg (1080x1920)
const { chromium } = require('playwright'); const path = require('path');
const Y = '#FFD60A';
const eye = `<svg viewBox="-260 -260 520 520" width="100%"><g stroke="${Y}" stroke-width="9" fill="none" opacity=".85">${Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2+.3,c=Math.cos(a),s=Math.sin(a);return `<path d="M${c*150},${s*150} L${(c*150+c*240)/2},${s*150} L${c*240},${s*240}"/><circle cx="${c*240}" cy="${s*240}" r="11" fill="${Y}"/>`}).join('')}</g>
<circle r="150" fill="#120f02" stroke="${Y}" stroke-width="14"/><circle r="108" fill="none" stroke="${Y}" stroke-width="6" stroke-dasharray="24 14"/><circle r="70" fill="${Y}"/><circle r="28" fill="#fff"/></svg>`;
const cash = `<svg viewBox="-120 -100 240 200" width="100%">${[0,1,2,3].map(i=>`<g transform="translate(${-8+i*6},${40-i*22}) rotate(${-6+i*3})"><rect x="-95" y="-38" width="190" height="76" rx="8" fill="#2f7d4f" stroke="#0B0C10" stroke-width="5"/><circle r="22" fill="#9be0b5"/><text x="0" y="12" text-anchor="middle" font-family="Anton" font-size="34" fill="#0B0C10">€</text></g>`).join('')}<text x="0" y="96" text-anchor="middle" font-family="Anton" font-size="52" fill="#fff">€100M</text></svg>`;
const bank = `<svg viewBox="-330 -310 660 600" width="100%"><path d="M-300,-170 L0,-300 L300,-170Z" fill="#e7e0d0"/><rect x="-300" y="-170" width="600" height="40" fill="#cbc3b1"/><rect x="-250" y="-118" width="500" height="52" fill="#0B0C10"/><text x="0" y="-80" text-anchor="middle" font-family="Anton" font-size="38" fill="#fff" letter-spacing="3">CRÉDIT MUTUEL ARKÉA</text>${[-230,-130,-30,70,170].map(x=>`<rect x="${x}" y="-60" width="60" height="300" fill="#e7e0d0"/>`).join('')}<rect x="-320" y="240" width="640" height="40" fill="#cbc3b1"/></svg>`;
const css=(W,H)=>`@font-face{font-family:Anton;src:url(Anton-400.woff2)}*{margin:0;box-sizing:border-box}body{width:${W}px;height:${H}px;background:#0B0C10;overflow:hidden;position:relative;font-family:Anton;text-transform:uppercase}
.rays{position:absolute;inset:-50%;background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,255,255,.045) 0 9deg,transparent 9deg 22deg)}
.glow{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(255,214,10,.32),transparent 65%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.75))}
.st{position:absolute;filter:drop-shadow(7px 0 0 #fff) drop-shadow(-7px 0 0 #fff) drop-shadow(0 7px 0 #fff) drop-shadow(0 -7px 0 #fff) drop-shadow(0 18px 30px rgba(0,0,0,.7))}
.top{position:absolute;color:#fff;line-height:1;text-shadow:0 8px 0 rgba(0,0,0,.6)}
.hit{position:absolute;background:${Y};color:#0B0C10;line-height:1;transform:rotate(-3deg);box-shadow:8px 10px 0 rgba(0,0,0,.6);white-space:nowrap}
.ring{position:absolute;border:12px solid ${Y};border-radius:50%;background:rgba(11,12,16,.85);display:flex;align-items:center;justify-content:center;transform:rotate(-8deg);box-shadow:0 0 50px rgba(255,214,10,.45)}
.onion{position:absolute;border-radius:50%}img{display:block}`;
const yt=`<style>${css(1280,720)}</style><div class="rays"></div><div class="glow" style="left:560px;top:-60px;width:860px;height:860px"></div>
<div class="st" style="left:690px;top:70px;width:520px">${eye}</div>
<div class="vig"></div>
<div class="st" style="left:60px;top:30px;width:330px">${bank}</div>
<div class="top" style="left:60px;top:322px;font-size:150px">AI robbed</div>
<div class="hit" style="left:54px;top:492px;font-size:132px;padding:8px 26px 14px">a bank?!</div>
<div class="ring" style="left:610px;top:430px;width:260px;height:260px"><div style="width:200px">${cash}</div></div>
<img class="onion" src="onion.png" style="right:26px;top:22px;width:104px">`;
const cover=`<style>${css(1080,1920)}</style><div class="rays"></div><div class="glow" style="left:60px;top:820px;width:1000px;height:1000px"></div>
<div class="st" style="left:150px;top:1010px;width:620px">${eye}</div>
<div class="vig"></div>
<img class="onion" src="onion.png" style="left:62px;top:268px;width:120px">
<div class="st" style="left:215px;top:240px;width:380px">${bank}</div>
<div class="top" style="left:66px;top:600px;font-size:176px">AI robbed</div>
<div class="hit" style="left:60px;top:800px;font-size:180px;padding:8px 28px 16px">a bank?!</div>
<div class="ring" style="left:560px;top:1250px;width:330px;height:330px"><div style="width:250px">${cash}</div></div>`;
(async()=>{const b=await chromium.launch();for(const [n,h,W,H] of [['yt',yt,1280,720],['cover',cover,1080,1920]]){require('fs').writeFileSync(n+'.html','<!doctype html><meta charset=utf8><body>'+h);const p=await b.newPage({viewport:{width:W,height:H}});await p.goto('file://'+path.resolve(n+'.html'));await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:n+'.jpg',type:'jpeg',quality:93});}await b.close()})();
