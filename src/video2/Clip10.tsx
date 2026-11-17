import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  Car,
  Card,
  Cazes,
  Chip,
  Cop,
  Flash,
  MarketLogo,
  Pop,
  Scene,
  SeizedStamp,
  Sfx,
  ShopWindow,
  Terminal,
  TitleSlam,
  mono,
} from "../components";
import { Crowd } from "./Clip9";
import { useClip } from "./words";

const LaptopRow: React.FC<{ at: number; n: string; text: string }> = ({ at, n, text }) => (
  <Pop at={at} from="left" sound="pop" style={{ position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "17px 0", borderBottom: `2px solid ${colors.line}` }}>
      <span style={{ ...mono(34, colors.green), fontWeight: 700, width: 60 }}>{n}</span>
      <span style={{ ...mono(46), fontWeight: 700, flex: 1 }}>{text}</span>
      <span style={{ ...mono(28, colors.bg), fontWeight: 700, background: colors.green, padding: "5px 16px", borderRadius: 6 }}>OPEN</span>
    </div>
  </Pop>
);

const POSTS = [
  { text: "is the site down for anyone else??", x: 150, y: 120, r: -3 },
  { text: "can't log in. what is going on", x: 980, y: 190, r: 2 },
  { text: "EXIT SCAM???", x: 330, y: 400, r: 3, hot: true },
  { text: "Alpha02 ran with our money!", x: 880, y: 500, r: -2, hot: true },
  { text: "my funds were still in there...", x: 240, y: 680, r: 1 },
];

/** Clip 10: the takedown. */
export const Clip10: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(10);

  const tFound = c("And they");
  const tOffline = c("That same");
  const tUsers = c("Users");
  const tMove = c("And so");

  // the crash, replayed slowly
  const drive = sp(frame, fps, c("fake"), springs.smooth, c("crash") - c("fake") + 6);
  const hit = c("crash") + 4;
  const tilt = sp(frame, fps, hit, springs.pop);
  const walk = sp(frame, fps, c("lured") + 6, springs.smooth, 46);
  const walking = walk > 0.02 && walk < 0.98;
  const cuffed = frame >= c("shut");

  const dying = frame >= c("went") && frame < c("offline");
  const dead = frame >= c("offline");
  const move = sp(frame, fps, c("They moved"), springs.smooth, 34);

  return (
    <>
      {/* 1: that morning in Bangkok */}
      <Scene from={0} to={tFound}>
        {/* dawn sky */}
        <div style={{ position: "absolute", left: -100, right: -100, top: -100, height: 900, background: "linear-gradient(to bottom, rgba(7,9,11,0) 30%, rgba(44,76,134,0.25) 70%, rgba(255,181,71,0.22) 100%)" }} />
        <Terminal
          style={{ position: "absolute", left: 110, top: 80 }}
          fontSize={56}
          lines={[
            { text: "BANGKOK", at: c("Bangkok") - 4, durationInFrames: 12 },
            { text: "JULY 5, 2017 · 05:00", at: c("July"), durationInFrames: 22, size: 0.7, color: colors.text },
          ]}
        />
        {/* house */}
        <div style={{ position: "absolute", left: 1290, top: 300, width: 540, height: 480, background: "linear-gradient(to bottom, #151C22, #0C1014)", border: "2px solid #2A343D", borderRadius: "10px 10px 0 0" }}>
          <div style={{ position: "absolute", left: 60, top: 70, width: 190, height: 120, borderRadius: 6, background: colors.green, opacity: 0.25 + 0.1 * Math.sin(frame / 7), boxShadow: `0 0 60px ${colors.green}` }} />
          <div style={{ position: "absolute", left: 300, top: 70, width: 170, height: 120, borderRadius: 6, background: "#1B242C" }} />
          <div style={{ position: "absolute", left: 360, top: 290, width: 110, height: 190, borderRadius: "6px 6px 0 0", background: "#07090B", border: "2px solid #2A343D" }} />
        </div>
        <Chip at={c("computer") - 6} text="HIS LAPTOP: STILL OPEN" color={colors.green} fontSize={28} origin="center bottom" style={{ left: 1250, top: 230 }} />
        {/* wall and gate */}
        <div style={{ position: "absolute", left: 250, top: 580, width: 330, height: 200, background: "#12181D", borderTop: "8px solid #2A343D" }} />
        <div style={{ position: "absolute", left: 900, top: 580, width: 400, height: 200, background: "#12181D", borderTop: "8px solid #2A343D" }} />
        <div
          style={{
            position: "absolute",
            left: 580,
            top: 560,
            width: 320,
            height: 220,
            transformOrigin: "right bottom",
            transform: `rotate(${tilt * 13}deg) translateX(${tilt * 26}px)`,
            display: "flex",
            justifyContent: "space-between",
            borderTop: `10px solid ${colors.amber}`,
            borderBottom: `10px solid ${colors.amber}`,
          }}
        >
          {new Array(9).fill(0).map((_, i) => (
            <div key={i} style={{ width: 9, background: colors.amber, opacity: 0.85 }} />
          ))}
        </div>
        {/* road */}
        <div style={{ position: "absolute", left: -200, right: -200, top: 780, bottom: -200, background: "linear-gradient(to bottom, #161D23, #06080A 50%)", borderTop: "3px solid rgba(255,255,255,0.08)" }} />
        {/* the car */}
        <div style={{ position: "absolute", left: interpolate(drive, [0, 1], [-480, 262]) + (frame >= hit ? -tilt * 14 : 0), top: 608, opacity: frame >= c("fake") - 2 ? 1 : 0 }}>
          <Car type="sedan" size={400} color="#8A949D" />
        </div>
        <Sfx name="crash" at={hit} />
        <Flash at={hit} color={colors.text} peak={0.4} durationInFrames={8} />
        <Chip at={c("fake")} text="A FAKE CRASH" color={colors.amber} filled fontSize={38} style={{ left: 110, top: 300 }} />
        <Chip at={hit} text="!" color={colors.red} filled fontSize={70} origin="center center" style={{ left: 700, top: 400 }} />
        {/* Cazes comes out to look */}
        <div style={{ position: "absolute", left: interpolate(walk, [0, 1], [1610, 990]), top: 480 - (walking ? Math.abs(Math.sin(frame / 2.6)) * 16 : 0), opacity: frame >= c("lured") ? 1 : 0 }}>
          <Cazes size={300} expression={cuffed ? "scared" : "calm"} sweat={false} look={{ x: -1, y: 0 }} />
        </div>
        {/* the police were waiting */}
        {[0, 1].map((i) => (
          <Pop key={i} at={c("before") + i * 5} origin="center bottom" sound={i ? undefined : "whoosh"} style={{ left: i ? 1230 : 760, top: 480 }}>
            <Cop size={300} seed={12 + i} expression="angry" look={{ x: i ? -1 : 1, y: 0 }} />
          </Pop>
        ))}
        <Sfx name="click" at={c("shut")} volume={1.6} />
        <Sfx name="click" at={c("shut") + 4} volume={1.6} />
        <SeizedStamp at={c("shut") + 2} text="ARRESTED" fontSize={110} style={{ left: 860, top: 330 }} />
      </Scene>

      {/* 2: everything still open */}
      <Scene from={tFound} to={tOffline}>
        <Pop at={tFound} from="up" style={{ left: 120, top: 90 }}>
          <Card accent={colors.green} style={{ width: 1250, padding: "26px 44px 34px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span style={{ ...mono(28, colors.green), letterSpacing: "0.2em" }}>CAZES'S LAPTOP</span>
              <div style={{ flex: 1 }} />
              <span style={{ ...mono(28, colors.green), fontWeight: 700, opacity: 0.6 + 0.4 * Math.sin(frame / 4) }}>● SESSION ACTIVE</span>
            </div>
            <div style={{ fontFamily: fonts.display, fontSize: 120, lineHeight: 1, color: colors.text, marginTop: 6 }}>EVERYTHING STILL OPEN</div>
            <div style={{ borderTop: `2px solid ${colors.line}`, marginTop: 14 }}>
              <LaptopRow at={c("Logged")} n="01" text="ALPHABAY'S SERVERS" />
              <LaptopRow at={c("Passwords")} n="02" text="PASSWORDS" />
              <LaptopRow at={c("wallets")} n="03" text="WALLETS" />
              <LaptopRow at={c("list")} n="04" text="HIS ASSETS + THEIR VALUES" />
            </div>
          </Card>
        </Pop>
        <Pop at={tFound + 6} origin="center bottom" style={{ left: 1450, top: 380 }}>
          <Cop size={420} look={{ x: -0.9, y: 0.2 }} />
        </Pop>
      </Scene>

      {/* 3: AlphaBay goes dark */}
      <Scene from={tOffline} to={tUsers}>
        {!dead ? (
          <div style={{ position: "absolute", inset: 0, opacity: dying ? (random(`fl-${frame}`) > 0.45 ? 1 : 0.25) : 1, transform: dying ? `translateX(${(random(`fx-${frame}`) - 0.5) * 24}px)` : undefined }}>
            <ShopWindow
              style={{ position: "absolute", left: 310, top: 80 }}
              width={1300}
              url="alphabay••••••••.onion"
              storeName="AlphaBay"
              tagline="marketplace"
              listingsAt={tOffline + 3}
              starsAt={tOffline + 8}
              listings={new Array(8).fill(0).map((_, i) => ({ title: `Listing #${i + 1}`, price: "BTC" }))}
            />
          </div>
        ) : (
          <div style={{ position: "absolute", left: 310, top: 80, width: 1300, height: 700, borderRadius: 14, border: `2px solid ${colors.red}`, background: "#090B0D", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <div style={{ ...mono(110, colors.dim), fontWeight: 700 }}>:(</div>
            <div style={{ ...mono(74, colors.red), fontWeight: 700, textShadow: `0 0 30px ${colors.red}66` }}>SITE UNREACHABLE</div>
            <div style={{ ...mono(30, colors.dim) }}>alphabay••••••••.onion did not respond</div>
          </div>
        )}
        <Sfx name="glitch" at={c("went")} />
        <Sfx name="error" at={c("offline")} volume={1.3} />
        <Flash at={c("offline")} peak={0.35} durationInFrames={10} />
        <Chip at={c("warning")} text="NO WARNING" color={colors.red} fontSize={40} style={{ left: 360, top: 660 }} />
        <Chip at={c("message")} text="NO MESSAGE" color={colors.red} fontSize={40} style={{ left: 700, top: 660 }} />
        <TitleSlam text="VANISHED" color={colors.red} fontSize={300} at={c("vanished")} style={{ top: 120 }} />
      </Scene>

      {/* 4: the users panic */}
      <Scene from={tUsers} to={tMove}>
        {POSTS.map((p, i) => {
          const at = [tUsers, c("idea"), c("Most"), c("exit"), c("money")][i];
          return (
            <Pop key={i} at={at} sound="notify" origin="left bottom" style={{ left: p.x, top: p.y }}>
              <div
                style={{
                  transform: `rotate(${p.r}deg)`,
                  padding: "18px 28px",
                  borderRadius: "16px 16px 16px 4px",
                  background: colors.panelLight,
                  border: `2px solid ${p.hot ? colors.red : colors.line}`,
                  boxShadow: p.hot ? "0 0 40px rgba(255,59,59,0.3)" : "0 20px 50px rgba(0,0,0,0.6)",
                }}
              >
                <div style={{ ...mono(22, colors.dim) }}>user_{1000 + i * 733} · forum</div>
                <div style={{ ...mono(p.hot ? 58 : 40, p.hot ? colors.red : colors.text), fontWeight: 700 }}>{p.text}</div>
              </div>
            </Pop>
          );
        })}
      </Scene>

      {/* 5: they move, to Hansa */}
      <Scene from={tMove} to={D} exit="glitch">
        <div style={{ position: "absolute", left: 120, top: 110, opacity: 0.3 }}>
          <MarketLogo name="ALPHABAY" mark="alpha" size={90} />
        </div>
        <SeizedStamp at={tMove + 4} text="GONE" fontSize={70} style={{ left: 260, top: 120 }} />
        <Crowd n={60} seed="c10" x={420} toX={1420} y={560} move={move} panic={1 - Math.min(1, move)} />
        <Chip at={c("exactly")} text="EXACTLY WHAT THE POLICE HOPED" color={colors.agent} fontSize={34} style={{ left: 330, top: 270 }} />
        {[0, 1, 2].map((i) => {
          const a = sp(frame, fps, c("They moved") + i * 4, springs.snappy);
          return (
            <div key={i} style={{ position: "absolute", left: 760, top: 420 + i * 90, width: 380 * a, height: 10, background: colors.dutch, boxShadow: `0 0 16px ${colors.dutch}`, opacity: a > 0 ? 1 : 0 }}>
              <div style={{ position: "absolute", right: -4, top: -15, borderLeft: `30px solid ${colors.dutch}`, borderTop: "20px solid transparent", borderBottom: "20px solid transparent" }} />
            </div>
          );
        })}
        <Sfx name="whoosh" at={c("They moved")} />
        <Pop at={c("To Hansa")} from="slam" sound="slam" style={{ left: 1230, top: 230 }}>
          <MarketLogo name="HANSA" mark="hansa" size={130} />
        </Pop>
        <Flash at={c("To Hansa")} color={colors.dutch} peak={0.35} />
      </Scene>
    </>
  );
};
