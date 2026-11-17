import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  BlobCharacter,
  Card,
  Chip,
  Cop,
  Flash,
  MapPins,
  MarketLogo,
  OnionLogo,
  Pop,
  Scene,
  SeizedStamp,
  Sfx,
  TitleSlam,
  mono,
} from "../components";
import { useClip } from "./words";

/** Police shield. */
export const Badge: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 100 115" style={{ filter: `drop-shadow(0 0 24px ${colors.agent}88)` }}>
    <path d="M 50 4 L 94 18 V 56 C 94 84 74 102 50 111 C 26 102 6 84 6 56 V 18 Z" fill={colors.police} stroke={colors.gold} strokeWidth={5} />
    <path d="M 50 30 l 7 15 16 2 -12 11 3 16 -14 -8 -14 8 3 -16 -12 -11 16 -2 Z" fill={colors.gold} />
  </svg>
);

/** A little crowd of users that can shake and move between two x positions. */
export const Crowd: React.FC<{ n: number; x: number; y: number; toX?: number; move?: number; panic?: number; color?: string; seed: string }> = ({
  n,
  x,
  y,
  toX,
  move = 0,
  panic = 0,
  color = colors.green,
  seed,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const ox = (random(`${seed}-x-${i}`) - 0.5) * 520;
        const oy = (random(`${seed}-y-${i}`) - 0.5) * 150;
        const lag = random(`${seed}-l-${i}`) * 0.5;
        const m = Math.max(0, Math.min(1, (move - lag) / 0.5));
        const jx = (random(`${seed}-j-${i}-${frame}`) - 0.5) * 16 * panic;
        const jy = (random(`${seed}-k-${i}-${frame}`) - 0.5) * 10 * panic;
        const px = interpolate(m, [0, 1], [x + ox, (toX ?? x) + ox * 0.7]);
        return (
          <svg key={i} width={34} height={34} viewBox="0 0 34 34" style={{ position: "absolute", left: px + jx, top: y + oy + jy - Math.sin(m * Math.PI) * 50 }}>
            <circle cx={17} cy={11} r={6.5} fill={color} />
            <path d="M 4 32 C 4 21 10 19 17 19 C 24 19 30 21 30 32 Z" fill={color} />
          </svg>
        );
      })}
    </>
  );
};

/** Clip 9: the trap inside the trap. */
export const Clip9: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(9);

  const tNl = c("So in");
  const tJune = c("From June");
  const tPlan = c("The plan");

  const hop = sp(frame, fps, c("moves"), springs.smooth, 24);
  const badge = sp(frame, fps, c("Dutch"), springs.snappy);
  const tash = frame >= c("looking");
  const orders = 1240 + Math.floor(Math.max(0, frame - tJune) / 7);
  const panic = frame >= c("panic") ? 1 : frame >= c("hundreds") ? 0.4 : 0;
  const run = sp(frame, fps, c("run", 1), springs.smooth, 40);
  const hatch = sp(frame, fps, c("into"), springs.pop);

  return (
    <>
      {/* 1: when one market falls, everyone moves to the next */}
      <Scene from={0} to={tNl}>
        <Pop at={2} origin="center bottom" style={{ left: 130, top: 330 }}>
          <Cop size={420} look={{ x: 0.8, y: 0 }} />
        </Pop>
        <TitleSlam text="A BIGGER PLAN" color={colors.agent} fontSize={210} at={c("bigger")} style={{ left: 560, top: 70 }} />
        {["MARKET A", "MARKET B", "MARKET C"].map((name, i) => (
          <Pop key={name} at={c("When") + i * 4} style={{ left: 640 + i * 400, top: 380 }}>
            <div style={{ textAlign: "center", width: 300, opacity: i === 0 && frame >= c("falls") ? 0.35 : 1 }}>
              <OnionLogo size={150} color={i === 0 ? colors.dim : colors.green} />
              <div style={{ ...mono(30, colors.dim), marginTop: 8 }}>{name}</div>
            </div>
          </Pop>
        ))}
        <SeizedStamp at={c("falls")} text="DOWN" fontSize={70} style={{ left: 700, top: 420 }} />
        {frame >= c("everyone") ? <Crowd n={16} seed="s1" x={770} toX={1170} y={680} move={hop} /> : null}
        <Chip at={c("next")} text="THEY ALWAYS MOVE TO THE NEXT ONE" color={colors.green} fontSize={30} origin="center center" style={{ left: 820, top: 780 }} />
      </Scene>

      {/* 2: the Netherlands, and a market called Hansa */}
      <Scene from={tNl} to={tJune}>
        <div style={{ position: "absolute", left: 60, top: 150, width: 940, height: 690, overflow: "hidden", borderRadius: 14, border: `2px solid ${colors.line}`, background: colors.panel }}>
          <MapPins
            width={940}
            style={{ left: 0, top: 120 }}
            focus={{ lon: 9, lat: 50, zoom: 3.2 }}
            pins={[
              { lon: 5.3, lat: 52.2, label: "NETHERLANDS", at: c("Netherlands"), color: colors.dutch, glow: true, side: "left" },
              { lon: 12, lat: 49.4, label: "GERMANY", at: c("Germany"), color: colors.red, side: "right" },
            ]}
          />
        </div>
        <Sfx name="whoosh" at={tNl} />
        <div style={{ position: "absolute", left: 1590 + (1 - badge) * 160, top: 120, opacity: badge }}>
          <Badge size={210} />
        </div>
        <Sfx name="whoosh" at={c("Dutch")} />
        <Pop at={c("Hansa")} style={{ left: 1080, top: 190, zIndex: 2 }}>
          <MarketLogo name="HANSA" mark="hansa" size={120} />
        </Pop>
        <Chip at={c("another")} text="ANOTHER MARKET" color={colors.dutch} fontSize={30} style={{ left: 1090, top: 110 }} />
        {[0, 1].map((i) => (
          <Pop key={i} at={c("two") + i * 4} origin="center bottom" style={{ left: 1110 + i * 250, top: 390 }}>
            <BlobCharacter color={colors.extras[i + 1]} size={230} seed={20 + i} expression={frame >= c("arrested") ? "scared" : "calm"} sweat={false} />
          </Pop>
        ))}
        <div style={{ position: "absolute", left: 1090, top: 632, ...mono(28, colors.dim), letterSpacing: "0.14em", opacity: frame >= c("two") ? 1 : 0 }}>HANSA'S TWO ADMINS</div>
        <SeizedStamp at={c("arrested")} text="ARRESTED" fontSize={84} style={{ left: 1130, top: 470 }} />
        <Scene from={c("instead")} to={c("took")} exit="cut">
          <Chip at={c("instead")} text="SHUT IT DOWN?" color={colors.text} fontSize={44} style={{ left: 1090, top: 710 }} />
        </Scene>
        <TitleSlam text="TAKEN OVER" color={colors.dutch} fontSize={160} at={c("took")} style={{ left: 1000, top: 690 }} />
        <Flash at={c("took")} color={colors.dutch} peak={0.3} durationInFrames={10} />
      </Scene>

      {/* 3: secretly run by the police */}
      <Scene from={tJune} to={tPlan}>
        <Chip at={c("June")} text="JUNE 20, 2017" color={colors.text} fontSize={32} style={{ left: 110, top: 100 }} />
        <Pop at={tJune + 2} from="up" style={{ left: 480, top: 90 }}>
          <Card accent={colors.dutch} style={{ width: 1330, height: 290, padding: "22px 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <MarketLogo name="HANSA" mark="hansa" size={62} />
              <span style={{ ...mono(32, colors.dim), letterSpacing: "0.2em" }}>ADMIN PANEL</span>
              <div style={{ flex: 1 }} />
              <span style={{ ...mono(30, colors.green), fontWeight: 700 }}>● ONLINE</span>
            </div>
            <div style={{ display: "flex", gap: 70, marginTop: 26, alignItems: "baseline" }}>
              <div>
                <div style={{ ...mono(24, colors.dim), letterSpacing: "0.14em" }}>ORDERS TODAY</div>
                <div style={{ ...mono(76, colors.text), fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{orders.toLocaleString("en-US")}</div>
              </div>
              <div>
                <div style={{ ...mono(24, colors.dim), letterSpacing: "0.14em" }}>LOGGED IN AS</div>
                <div style={{ ...mono(50, colors.dutch), fontWeight: 700 }}>admin</div>
              </div>
              <div>
                <div style={{ ...mono(24, colors.dim), letterSpacing: "0.14em" }}>REALLY</div>
                <div style={{ ...mono(50, colors.agent), fontWeight: 700, opacity: frame >= c("secretly") ? 1 : 0 }}>the police</div>
              </div>
            </div>
          </Card>
        </Pop>
        {[0, 1, 2].map((i) => (
          <Pop key={i} at={c("secretly") + i * 4} origin="center bottom" style={{ left: 600 + i * 330, top: 420 }}>
            <Cop size={330} seed={12 + i} moustache={tash} look={{ x: i - 1, y: 0.6 }} />
          </Pop>
        ))}
        <Sfx name="pop" at={c("looking")} />
        <Sfx name="pop" at={c("looking") + 3} />
        {/* the counter they sit behind */}
        <div style={{ position: "absolute", left: 470, width: 1340, top: 690, height: 170, borderRadius: "16px 16px 6px 6px", background: "linear-gradient(to bottom, #1B232A, #0B0F13)", border: "2px solid #2A343D", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 190, height: 110, borderRadius: "10px 10px 2px 2px", background: "#12181D", border: "2px solid #2A343D", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 20, height: 20, borderRadius: 10, background: colors.dutch, boxShadow: `0 0 18px ${colors.dutch}` }} />
            </div>
          ))}
        </div>
        <Chip at={c("Still")} text="STILL OPEN" color={colors.green} fontSize={36} style={{ left: 110, top: 430 }} />
        <Chip at={c("taking")} text="STILL TAKING ORDERS" color={colors.green} fontSize={30} style={{ left: 110, top: 520 }} />
        <Chip at={c("completely")} text="COMPLETELY NORMAL" color={colors.amber} filled fontSize={30} style={{ left: 110, top: 610 }} />
      </Scene>

      {/* 4: the plan */}
      <Scene from={tPlan} to={D} exit="glitch">
        <div style={{ position: "absolute", left: 958, top: 90, width: 4, height: 770, background: colors.line }} />
        <div style={{ position: "absolute", left: 130, top: 100, ...mono(32, colors.dim) }}>&gt; the plan:</div>
        <div style={{ position: "absolute", left: 130, top: 170, opacity: frame >= c("Take") + 10 ? 0.35 : 1 }}>
          <MarketLogo name="ALPHABAY" mark="alpha" size={110} />
        </div>
        <SeizedStamp at={c("Take") + 6} text="STEP 1: TAKE IT DOWN" fontSize={58} style={{ left: 170, top: 210 }} />
        <div style={{ position: "absolute", left: 1060, top: 170 }}>
          <MarketLogo name="HANSA" mark="hansa" size={110} />
        </div>
        {frame >= c("Watch") ? <Crowd n={46} seed="s4" x={270} toX={1150} y={560} move={run} panic={panic * (1 - Math.min(1, run))} /> : null}
        <Chip at={c("panic")} text="STEP 2: PANIC" color={colors.red} fontSize={36} style={{ left: 150, top: 760 }} />
        <Sfx name="whoosh" at={c("run", 1)} />
        {/* the trap door under Hansa */}
        <div style={{ position: "absolute", left: 1090, top: 700, width: 660, height: 150 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: "#000", border: `3px solid ${colors.dutch}`, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 250, top: 26 + (1 - hatch) * 140 }}>
              <Cop size={200} look={{ x: 0, y: -0.8 }} />
            </div>
          </div>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                left: i ? "50%" : 0,
                width: "50%",
                height: "100%",
                background: "repeating-linear-gradient(45deg, #1C232A 0 18px, #262F37 18px 36px)",
                border: `3px solid ${colors.dutch}`,
                transformOrigin: i ? "right center" : "left center",
                transform: `scaleX(${1 - hatch * 0.9})`,
              }}
            />
          ))}
        </div>
        <Sfx name="door" at={c("into")} volume={0.7} />
        <Chip at={c("wait")} text="STEP 3: WAIT" color={colors.dutch} fontSize={36} style={{ left: 1100, top: 380 }} />
        <TitleSlam text="THE TRAP WAS SET" color={colors.red} fontSize={230} at={c("market", 2)} style={{ top: 330 }} />
        <Flash at={c("market", 2)} peak={0.45} />
      </Scene>
    </>
  );
};
