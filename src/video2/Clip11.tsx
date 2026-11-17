import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  BlobCharacter,
  Chip,
  Cop,
  Counter,
  Flash,
  MapPins,
  MarketLogo,
  Pop,
  Scene,
  Sfx,
  ShopWindow,
  Stamp,
  TitleSlam,
  mono,
} from "../components";
import { Badge, Crowd } from "./Clip9";
import { useClip } from "./words";

const Laptop: React.FC<{ shut?: number; glow?: string }> = ({ shut = 0, glow = colors.dutch }) => (
  <div style={{ width: 200 }}>
    <div
      style={{
        width: 180,
        height: 110,
        marginLeft: 10,
        borderRadius: "10px 10px 2px 2px",
        background: "#12181D",
        border: "2px solid #2A343D",
        transformOrigin: "center bottom",
        transform: `scaleY(${1 - shut * 0.92})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: shut > 0.5 ? "none" : `0 -6px 30px ${glow}44`,
      }}
    >
      <div style={{ width: 18, height: 18, borderRadius: 9, background: glow, opacity: 1 - shut }} />
    </div>
    <div style={{ width: 200, height: 10, borderRadius: "3px 3px 8px 8px", background: "#1C232A" }} />
  </div>
);

const DATA = [
  { label: "PASSWORDS", cue: "passwords", y: 250 },
  { label: "SELLER LOCATIONS", cue: "locations", y: 400 },
  { label: "DELIVERY ADDRESSES", cue: "addresses", y: 550 },
];

const WORLD: [number, number][] = [
  [-98, 39],
  [-1, 53],
  [134, -25],
  [-52, -12],
  [103, 35],
  [25, -28],
  [-110, 55],
  [78, 21],
];

/** Clip 11: the honeypot. */
export const Clip11: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(11);

  const tRec = c("And every");
  const tAddr = c("Around");
  const tPlug = c("Then");
  const tBlow = c("It was");

  const flood = sp(frame, fps, c("flooded"), springs.smooth, 60);
  const seized = frame >= c("replaced");
  const plug = frame >= c("pulled") && !seized;

  return (
    <>
      {/* 1: the refugees arrive */}
      <Scene from={0} to={tRec}>
        <div style={{ position: "absolute", left: 120, top: 90 }}>
          <MarketLogo name="HANSA" mark="hansa" size={100} />
        </div>
        <div style={{ position: "absolute", left: 130, top: 250, ...mono(30, colors.dim), letterSpacing: "0.18em" }}>NEW SIGN-UPS PER DAY</div>
        {/* bar chart: flat, then it explodes */}
        <div style={{ position: "absolute", left: 130, top: 300, width: 760, height: 460, display: "flex", alignItems: "flex-end", gap: 16, borderBottom: `3px solid ${colors.line}` }}>
          {[0.08, 0.09, 0.07, 0.1, 0.09, 0.52, 0.8, 1].map((h, i) => {
            const big = i >= 5;
            const g = big ? sp(frame, fps, c("jumped") + (i - 5) * 8, springs.pop) : sp(frame, fps, 6 + i * 3, springs.snappy);
            return <div key={i} style={{ flex: 1, height: `${h * g * 100}%`, borderRadius: "6px 6px 0 0", background: big ? colors.dutch : colors.greenDim, boxShadow: big ? `0 0 30px ${colors.dutch}66` : "none" }} />;
          })}
        </div>
        <Sfx name="riser" at={c("jumped") - 20} volume={0.6} />
        <Crowd n={70} seed="c11" x={-500} toX={1380} y={745} move={flood} color={colors.green} />
        <Sfx name="whoosh" at={c("flooded")} />
        <Chip at={c("refugees")} text="REFUGEES FROM ALPHABAY" color={colors.gold} fontSize={34} style={{ left: 1010, top: 110 }} />
        <TitleSlam text="HUNDREDS" color={colors.text} fontSize={150} at={c("hundreds")} style={{ left: 960, top: 190 }} />
        <Pop at={c("to", 0) } style={{ left: 1400, top: 330 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 90, color: colors.dim }}>▼</span>
        </Pop>
        <TitleSlam text="THOUSANDS" color={colors.dutch} fontSize={190} at={c("thousands")} style={{ left: 960, top: 430 }} />
      </Scene>

      {/* 2: every move recorded */}
      <Scene from={tRec} to={tAddr}>
        <Pop at={tRec} origin="center bottom" style={{ left: 150, top: 300 }}>
          <Cop size={400} moustache look={{ x: 0.5, y: 0.8 }} />
        </Pop>
        <div style={{ position: "absolute", left: 80, top: 610, width: 560, height: 230, borderRadius: "16px 16px 6px 6px", background: "linear-gradient(to bottom, #1B232A, #0B0F13)", border: "2px solid #2A343D" }} />
        <div style={{ position: "absolute", left: 260, top: 560 }}>
          <Laptop />
        </div>
        <Sfx name="type" at={tRec + 10} durationInFrames={tAddr - tRec - 30} loop volume={0.35} />
        <Chip at={c("recorded")} text="● REC" color={colors.red} filled fontSize={46} style={{ left: 130, top: 140 }} />
        <Chip at={c("changed")} text="THE SITE, QUIETLY CHANGED" color={colors.dutch} fontSize={30} style={{ left: 390, top: 152 }} />
        {/* the police folder */}
        <div style={{ position: "absolute", left: 1150, top: 150, width: 650, height: 660 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 260, height: 70, borderRadius: "14px 14px 0 0", background: colors.police }} />
          <div style={{ position: "absolute", left: 0, top: 56, right: 0, bottom: 0, borderRadius: "0 16px 16px 16px", background: `linear-gradient(to bottom, ${colors.police}, #17294B)`, border: `3px solid ${colors.agent}`, boxShadow: `0 0 80px ${colors.agent}33, 0 30px 80px rgba(0,0,0,0.6)` }} />
          <div style={{ position: "absolute", right: 30, top: 80 }}>
            <Badge size={110} />
          </div>
          <div style={{ position: "absolute", left: 40, top: 96, ...mono(34, colors.text), fontWeight: 700, letterSpacing: "0.14em" }}>POLICE FILE</div>
          {DATA.map((d, i) => {
            const at = c(d.cue) + 14;
            const s = sp(frame, fps, at, springs.pop);
            return frame >= at ? (
              <div key={i} style={{ position: "absolute", left: 40, top: 210 + i * 130, ...mono(40, colors.gold), fontWeight: 700, transform: `scale(${s})`, transformOrigin: "left center" }}>
                ✓ {d.label}
              </div>
            ) : null;
          })}
        </div>
        {/* data flying into it */}
        {DATA.map((d, i) => {
          const at = c(d.cue) - 4;
          const fly = sp(frame, fps, at, springs.smooth, 20);
          if (frame < at || fly > 0.995) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: interpolate(fly, [0, 1], [640, 1250]),
                top: interpolate(fly, [0, 1], [d.y + 120, 380 + i * 130]) - Math.sin(fly * Math.PI) * 90,
                transform: `scale(${1 - fly * 0.35})`,
                opacity: fly > 0.85 ? (1 - fly) / 0.15 : 1,
                padding: "10px 22px",
                borderRadius: 6,
                background: colors.gold,
                ...mono(34, colors.bg),
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {d.label}
            </div>
          );
        })}
        {DATA.map((d, i) => (
          <React.Fragment key={i}>
            <Sfx name="whoosh" at={c(d.cue) - 4} />
            <Sfx name="coin" at={c(d.cue) + 14} volume={0.6} />
          </React.Fragment>
        ))}
        {/* a steady trickle of smaller records */}
        {new Array(10).fill(0).map((_, i) => {
          const t = ((frame - c("logged") + i * 13) % 60) / 60;
          if (frame < c("logged")) return null;
          return (
            <div key={i} style={{ position: "absolute", left: interpolate(t, [0, 1], [560, 1220]), top: 300 + random(`dy-${i}`) * 380 - Math.sin(t * Math.PI) * 50, width: 46, height: 30, borderRadius: 4, border: `2px solid ${colors.agent}`, background: colors.panelLight, opacity: Math.sin(t * Math.PI) * 0.8 }} />
          );
        })}
      </Scene>

      {/* 3: ten thousand addresses, sent around the world */}
      <Scene from={tAddr} to={tPlug}>
        <div style={{ position: "absolute", left: 130, top: 90, display: "flex", alignItems: "baseline", gap: 40 }}>
          <Counter to={10000} suffix="+" at={c("10000") - 6} durationInFrames={c("addresses", 1) - c("10000") + 6} fontSize={190} color={colors.gold} />
          <Pop at={c("buyer")} from="up" style={{ position: "relative" }}>
            <span style={{ ...mono(52, colors.text), fontWeight: 700 }}>BUYER ADDRESSES</span>
          </Pop>
        </div>
        <MapPins
          width={1150}
          style={{ left: 385, top: 310 }}
          pins={[
            { lon: 5.3, lat: 52.2, at: tAddr + 4, color: colors.dutch, glow: true },
            ...WORLD.map(([lon, lat], i) => ({ lon, lat, at: c("handed") + 14 + i * 4, color: colors.agent })),
          ]}
          lines={WORLD.map(([lon, lat], i) => ({ from: [5.3, 52.2] as [number, number], to: [lon, lat] as [number, number], at: c("handed") + i * 4, durationInFrames: 22, color: colors.gold }))}
        />
        <Chip at={c("handed")} text="HANDED TO POLICE WORLDWIDE" color={colors.agent} fontSize={32} style={{ left: 130, top: 330 }} />
      </Scene>

      {/* 4: the plug is pulled */}
      <Scene from={tPlug} to={tBlow}>
        <Chip at={c("July")} text="JULY 20, 2017" color={colors.text} fontSize={32} style={{ left: 110, top: 56 }} />
        {!seized ? (
          <div style={{ position: "absolute", inset: 0, opacity: plug ? (random(`pl-${frame}`) > 0.5 ? 1 : 0.2) : 1 }}>
            <ShopWindow
              style={{ position: "absolute", left: 420, top: 150 }}
              width={1200}
              url="hansa••••••••.onion"
              storeName="Hansa"
              tagline="market"
              listingsAt={tPlug + 4}
              starsAt={tPlug + 12}
              listings={new Array(8).fill(0).map((_, i) => ({ title: `Listing #${i + 1}`, price: "BTC" }))}
            />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              left: 260,
              top: 150,
              width: 1400,
              height: 690,
              borderRadius: 14,
              border: `4px solid ${colors.gold}`,
              background: `linear-gradient(135deg, ${colors.police}, #101B33)`,
              boxShadow: `0 0 120px ${colors.agent}55`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Badge size={130} />
            <div style={{ fontFamily: fonts.display, fontSize: 124, lineHeight: 1, color: colors.text, textAlign: "center", marginTop: 10 }}>
              THIS HIDDEN SITE
              <br />
              HAS BEEN SEIZED
            </div>
            <div style={{ ...mono(32, colors.text), opacity: 0.8 }}>and controlled by the police since June 20</div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 96,
                lineHeight: 1,
                color: colors.gold,
                marginTop: 14,
                textShadow: `0 0 40px ${colors.gold}66`,
                transform: `scale(${frame >= c("We've") ? 2 - sp(frame, fps, c("We've"), springs.slam) : 0})`,
              }}
            >
              "WE'VE BEEN WATCHING YOU."
            </div>
          </div>
        )}
        <Sfx name="glitch" at={c("pulled")} />
        <Sfx name="error" at={c("plug")} volume={1.2} />
        <Sfx name="slam" at={c("replaced")} />
        <Flash at={c("replaced")} color={colors.agent} peak={0.45} />
        <Sfx name="slam" at={c("We've")} volume={0.8} />
      </Scene>

      {/* 5: trust itself, destroyed */}
      <Scene from={tBlow} to={D} exit="glitch">
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 250 + i * 310;
          const shutAt = c("taken") + i * 5;
          const shut = sp(frame, fps, shutAt, springs.snappy);
          return (
            <React.Fragment key={i}>
              <Pop at={tBlow + i * 3} origin="center bottom" style={{ left: x - 104, top: 440 }}>
                <BlobCharacter color={colors.extras[i % 4]} size={240} seed={30 + i} expression={frame >= c("biggest") ? "scared" : "calm"} look={{ x: 0, y: 0.8 }} />
              </Pop>
              <div style={{ position: "absolute", left: x - 100, top: 620, opacity: frame >= tBlow + i * 3 ? 1 : 0 }}>
                <Laptop shut={shut} glow={colors.green} />
              </div>
              <Sfx name="click" at={shutAt} volume={1.5} />
            </React.Fragment>
          );
        })}
        <Scene from={tBlow} to={c("Trust")} exit="cut">
          <Chip at={c("biggest")} text="ONE OF THE BIGGEST BLOWS THE DARK WEB EVER TOOK" color={colors.text} fontSize={30} origin="center center" style={{ left: 460, top: 100 }} />
          <Chip at={c("Not")} text="NOT JUST A SITE SHUT DOWN" color={colors.dim} fontSize={44} origin="center center" style={{ left: 560, top: 230 }} />
        </Scene>
        <TitleSlam text="TRUST" color={colors.text} fontSize={260} at={c("Trust")} style={{ top: 150 }} />
        <Stamp at={c("destroyed")} text="DESTROYED" fontSize={300} top={170} />
        <Flash at={c("destroyed")} peak={0.5} />
      </Scene>
    </>
  );
};
