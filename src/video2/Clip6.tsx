import React from "react";
import { random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  AssetGarage,
  BlobCharacter,
  Car,
  Card,
  Cazes,
  Chip,
  Counter,
  Flash,
  MapPins,
  Pop,
  Scene,
  Sfx,
  Stamp,
  TitleSlam,
  mono,
  type CarType,
} from "../components";
import { useClip } from "./words";

/** Night skyline with lit windows, neon signs and a reflection. */
const Skyline: React.FC = () => {
  const frame = useCurrentFrame();
  const N = 26;
  const towers = new Array(N).fill(0).map((_, i) => {
    const w = 50 + random(`sk-w-${i}`) * 70;
    const h = 160 + random(`sk-h-${i}`) * 380;
    return { w, h, x: i * 76 - 20 + random(`sk-x-${i}`) * 20 };
  });
  const NEON = [colors.gold, colors.red, colors.green, colors.amber];
  const layer = (flip: boolean) => (
    <div style={{ position: "absolute", left: 0, right: 0, top: flip ? 640 : 60, height: 580, transform: flip ? "scaleY(-0.45)" : undefined, transformOrigin: "top", opacity: flip ? 0.28 : 1, filter: flip ? "blur(3px)" : undefined }}>
      {towers.map((t, i) => (
        <div key={i} style={{ position: "absolute", left: t.x, bottom: 0, width: t.w, height: t.h, background: "linear-gradient(to bottom, #141B22, #0A0E12)", borderTop: `3px solid ${NEON[i % 4]}55` }}>
          {new Array(Math.floor(t.h / 34)).fill(0).map((_, r) =>
            [0, 1, 2].map((k) => {
              const on = random(`sk-l-${i}-${r}-${k}-${Math.floor(frame / 50)}`) > 0.55;
              return on ? (
                <div key={`${r}-${k}`} style={{ position: "absolute", left: 8 + k * ((t.w - 26) / 2), top: 14 + r * 34, width: 10, height: 14, background: NEON[(i + r) % 4], opacity: 0.55 }} />
              ) : null;
            }),
          )}
          {i % 5 === 2 ? (
            <div style={{ position: "absolute", left: -6, top: -34, width: t.w + 12, height: 24, borderRadius: 4, border: `3px solid ${NEON[(i + 1) % 4]}`, boxShadow: `0 0 26px ${NEON[(i + 1) % 4]}`, opacity: 0.7 + 0.3 * Math.sin(frame / 6 + i) }} />
          ) : null}
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 640, background: `radial-gradient(ellipse at 50% 100%, ${colors.gold}22, rgba(0,0,0,0) 70%)` }} />
      {layer(false)}
      {layer(true)}
      <div style={{ position: "absolute", left: 0, right: 0, top: 638, height: 4, background: colors.gold, opacity: 0.35 }} />
    </div>
  );
};

const GarageCar: React.FC<{ at: number; type: CarType; color: string; label: string; size: number }> = ({ at, type, color, label, size }) => {
  const frame = useCurrentFrame();
  const s = sp(frame, 30, at, springs.pop);
  const on = frame >= at;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `scale(${on ? 1 + 0.12 * (1 - s) : 0.96})`, opacity: on ? 1 : 0.35 }}>
      {on ? <Sfx name="snap" at={at} /> : null}
      <Car type={type} color={color} size={size} />
      <div style={{ padding: "6px 14px", borderRadius: 6, background: on ? color : "transparent", border: `2px solid ${color}`, ...mono(24, on ? colors.bg : color), fontWeight: 700, whiteSpace: "nowrap", transform: `scale(${on ? s : 1})` }}>
        {label}
      </div>
    </div>
  );
};

const Bubble: React.FC<{ at: number; text: string; top: number; left: number }> = ({ at, text, top, left }) => (
  <Pop at={at} origin="left bottom" sound="pop" style={{ left, top }}>
    <div style={{ padding: "14px 26px", borderRadius: "22px 22px 22px 4px", background: colors.gold, color: colors.bg, fontFamily: fonts.mono, fontSize: 48, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }}>
      {text}
    </div>
  </Pop>
);

// ─── Clip 6: The Lifestyle ───────────────────────────────────────────
export const Clip6: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(6);

  const tGarage = c("Lamborghini") - 8;
  const tMap = c("houses");
  const tAssets = c("Investigators");
  const tForum = c("And he");
  const tNeighbours = c("Even");
  const tFreeze = c("exactly");

  const BKK: [number, number] = [100.5, 13.7];
  const frozen = frame >= tFreeze;
  const ff = frozen ? tFreeze : frame; // "freeze frame": motion below uses ff

  return (
    <>
      {/* 1: Bangkok at night */}
      <Scene from={0} to={tGarage}>
        <Skyline />
        <TitleSlam text="BANGKOK" color={colors.gold} fontSize={230} at={c("Thailand") - 6} style={{ top: 90 }} />
        <Pop at={c("living")} origin="center bottom" style={{ left: 960 - 165, top: 430 }}>
          <Cazes size={380} sunglasses />
        </Pop>
        <Chip at={c("movie")} text="LIVING LIKE A MOVIE STAR" color={colors.gold} filled fontSize={38} origin="center center" style={{ left: 1180, top: 560 }} />
      </Scene>

      {/* 2: the garage */}
      <Scene from={tGarage} to={tMap}>
        <AssetGarage width={1700} height={600} openAt={tGarage} openDuration={22} label="PRIVATE GARAGE" style={{ left: 110, top: 150 }}>
          <GarageCar at={c("Lamborghini")} type="supercar" color={colors.gold} label="LAMBORGHINI" size={400} />
          <GarageCar at={c("Porsche")} type="sedan" color={colors.text} label="PORSCHE PANAMERA" size={380} />
          <GarageCar at={c("Mini")} type="mini" color={colors.red} label="MINI" size={300} />
          <GarageCar at={c("BMW")} type="bike" color={colors.agent} label="BMW MOTORBIKE" size={260} />
        </AssetGarage>
        <div style={{ position: "absolute", left: 110, top: 80, ...mono(34, colors.dim) }}>&gt; garage inventory</div>
      </Scene>

      {/* 3: property around the world */}
      <Scene from={tMap} to={tAssets}>
        <MapPins
          width={1700}
          style={{ left: 110, top: 70 }}
          dotColor="#5C4B22"
          pins={[
            { lon: BKK[0], lat: BKK[1], label: "BANGKOK · HOUSES", at: c("Bangkok"), color: colors.gold, side: "top" },
            { lon: 98.3, lat: 7.9, label: "PHUKET · VILLA", at: c("Phuket"), color: colors.gold, side: "bottom" },
            { lon: 33, lat: 35, label: "CYPRUS", at: c("Cyprus"), color: colors.gold, side: "top" },
            { lon: -61.8, lat: 17.1, label: "ANTIGUA", at: c("Antigua"), color: colors.gold, side: "top" },
          ]}
          lines={[
            { from: BKK, to: [33, 35], at: c("Cyprus") - 6, durationInFrames: 14, color: colors.gold },
            { from: [33, 35], to: [-61.8, 17.1], at: c("Antigua") - 6, durationInFrames: 14, color: colors.gold },
          ]}
        />
        <div style={{ position: "absolute", left: 110, top: 50, ...mono(34, colors.dim) }}>&gt; property</div>
        <Chip at={c("citizenship")} text="TRYING TO BUY CITIZENSHIP" color={colors.text} fontSize={32} origin="center center" style={{ left: 430, top: 560 }} />
      </Scene>

      {/* 4: total assets */}
      <Scene from={tAssets} to={tForum}>
        <Pop at={tAssets + 4} from="up" style={{ left: 0, right: 0, top: 150, textAlign: "center" }}>
          <span style={{ ...mono(36, colors.dim), letterSpacing: "0.2em" }}>TOTAL ASSETS, PER INVESTIGATORS</span>
        </Pop>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
          {frame >= c("assets") ? <Counter to={23000000} prefix="$" at={c("assets")} durationInFrames={c("million") - c("assets") + 8} fontSize={230} color={colors.gold} /> : null}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", gap: 50, alignItems: "flex-end" }}>
          {(["supercar", "sedan", "mini", "bike"] as CarType[]).map((t, i) => {
            const s = sp(frame, fps, c("around") + i * 4, springs.pop);
            return (
              <div key={t} style={{ transform: `scale(${s})` }}>
                <Car type={t} size={220} color={[colors.gold, colors.text, colors.red, colors.agent][i]} />
              </div>
            );
          })}
          {[0, 1, 2].map((i) => {
            const s = sp(frame, fps, c("around") + 16 + i * 4, springs.pop);
            return (
              <svg key={i} width={120} height={110} viewBox="0 0 24 22" style={{ transform: `scale(${s})` }}>
                <path d="M2 11 L12 2 L22 11 V21 H2 Z" fill={colors.gold} opacity={0.85} />
                <rect x={10} y={14} width={4} height={7} fill={colors.bg} />
              </svg>
            );
          })}
        </div>
      </Scene>

      {/* 5: bragging on a forum */}
      <Scene from={tForum} to={tNeighbours}>
        <Pop at={tForum} origin="center bottom" style={{ left: 150, top: 330 }}>
          <Cazes size={440} sunglasses look={{ x: 0.8, y: 0 }} />
        </Pop>
        <Chip at={c("couldn't")} text="COULDN'T HELP HIMSELF" color={colors.text} fontSize={34} style={{ left: 150, top: 200 }} />
        <Pop at={c("online") - 6} from="up" style={{ left: 700, top: 120 }}>
          <Card accent={colors.gold} style={{ width: 1090, height: 660, padding: "24px 34px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...mono(26, colors.dim), letterSpacing: "0.14em" }}>
              <span>ONLINE MEN'S FORUM</span>
              <span>posts paraphrased</span>
            </div>
            <div style={{ ...mono(26, colors.dim), marginTop: 20 }}>member posts about:</div>
          </Card>
        </Pop>
        <Bubble at={c("money")} text="his money" left={760} top={280} />
        <Bubble at={c("cars")} text="his cars" left={1160} top={390} />
        <Bubble at={c("life")} text="his life in Thailand" left={820} top={500} />
        <Chip at={c("Bragging")} text="BRAGGING TO STRANGERS" color={colors.red} filled fontSize={44} origin="center center" style={{ left: 900, top: 650 }} />
      </Scene>

      {/* 6: the neighbours notice */}
      <Scene from={tNeighbours} to={D} exit="glitch">
        <div style={{ position: "absolute", inset: 0, filter: frozen ? "grayscale(0.7) brightness(0.8)" : undefined }}>
          {/* Cazes' driveway */}
          <div style={{ position: "absolute", left: 980, top: 150, width: 860, height: 420, background: `radial-gradient(ellipse at 50% 70%, ${colors.gold}2A, rgba(0,0,0,0) 65%)` }} />
          <div style={{ position: "absolute", left: 1010, top: 400 }}>
            <Car type="supercar" size={330} />
          </div>
          <div style={{ position: "absolute", left: 1330, top: 380 }}>
            <Car type="sedan" size={320} color={colors.text} />
          </div>
          <div style={{ position: "absolute", left: 1650, top: 420 }}>
            <Car type="mini" size={230} color={colors.red} />
          </div>
          <div style={{ position: "absolute", left: 1290, top: 130 }}>
            <Cazes size={280} sunglasses idle={frozen ? 0 : 1} />
          </div>
          {/* neighbours peek over the fence */}
          {[0, 1, 2].map((i) => {
            const up = sp(ff, fps, c("neighbors") + i * 5, springs.pop);
            return (
              <div key={i} style={{ position: "absolute", left: 150 + i * 240, top: 620 - up * 250 + Math.sin(ff / 11 + i) * 6 }}>
                <BlobCharacter color={colors.extras[i]} size={300} seed={30 + i} look={{ x: 1, y: -0.2 }} idle={frozen ? 0 : 1} />
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 60, top: 540, width: 860, height: 340, display: "flex", gap: 8 }}>
            {new Array(14).fill(0).map((_, i) => (
              <div key={i} style={{ flex: 1, height: "100%", borderRadius: "30px 30px 0 0", background: "linear-gradient(to bottom, #3A2F22, #1C1611)", border: "2px solid #120E0A" }} />
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 580, height: 4, background: "#2A333B", opacity: 0.4 }} />
          <Chip at={c("foreigner")} text="a young foreigner..." color={colors.text} fontSize={30} style={{ left: 170, top: 230 }} />
          <Chip at={c("fleet")} text="...a fleet of sports cars..." color={colors.text} fontSize={30} style={{ left: 300, top: 310 }} />
          <Chip at={c("no")} text="...and no obvious job?" color={colors.amber} fontSize={30} style={{ left: 430, top: 390 }} />
        </div>
        <Sfx name="snap" at={tFreeze} />
        <Stamp at={tFreeze + 4} text="SUSPICIOUS" fontSize={330} top={330} />
        <Flash at={tFreeze} color={colors.text} peak={0.5} durationInFrames={6} />
      </Scene>
    </>
  );
};
