import React from "react";
import { random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  CamelLogo,
  Car,
  Card,
  Cazes,
  Chip,
  CoinIcon,
  Counter,
  Flash,
  MarketLogo,
  Pop,
  RossBlob,
  Scene,
  Sfx,
  Terminal,
  TitleSlam,
  mono,
} from "../components";
import { useClip } from "./words";

const StatCard: React.FC<{
  at: number;
  dur: number;
  label: string;
  to: number;
  suffix?: string;
  left: number;
}> = ({ at, dur, label, to, suffix, left }) => {
  const frame = useCurrentFrame();
  return (
    <Pop at={at - 6} from="up" style={{ left, top: 110 }}>
      <Card accent={colors.gold} style={{ width: 540, height: 280, padding: "26px 30px", textAlign: "center" }}>
        <div style={{ ...mono(30, colors.dim), letterSpacing: "0.22em" }}>{label}</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
          {frame >= at ? <Counter to={to} suffix={suffix} at={at} durationInFrames={dur} fontSize={104} color={colors.gold} /> : null}
        </div>
      </Card>
    </Pop>
  );
};

/** Cramped room for Ross: bare bulb, desk, laptop. */
const CrampedRoom: React.FC<{ lit: number }> = ({ lit }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 150, top: 190, width: 640, height: 600, border: "10px solid #1C232A", background: "linear-gradient(to bottom, #0C1014, #12181D)", overflow: "hidden", opacity: 0.45 + 0.55 * lit }}>
      <div style={{ position: "absolute", left: 318, top: 0, width: 4, height: 90, background: "#3A444E" }} />
      <div style={{ position: "absolute", left: 300, top: 86, width: 40, height: 40, borderRadius: 20, background: colors.amber, opacity: 0.5 + 0.2 * Math.sin(frame / 3), boxShadow: `0 0 80px ${colors.amber}` }} />
      <div style={{ position: "absolute", left: 190, top: 210 }}>
        <RossBlob size={300} look={{ x: 0, y: 0.9 }} lightColor={colors.green} lightAmount={0.5} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 480, height: 16, background: "#2A333B", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 240, top: 400, width: 160, height: 84, borderRadius: "8px 8px 2px 2px", background: "#161C22", border: "2px solid #2A343D", boxShadow: `0 -4px 26px ${colors.green}55` }} />
      {[90, 500].map((x) => (
        <div key={x} style={{ position: "absolute", left: x, top: 496, width: 14, height: 110, background: "#232B33" }} />
      ))}
    </div>
  );
};

/** Poolside for Cazes: water, lounger glow, sports car. */
const Poolside: React.FC<{ lit: number }> = ({ lit }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 1010, top: 150, width: 800, height: 680, opacity: 0.45 + 0.55 * lit }}>
      <div style={{ position: "absolute", left: 60, top: 0, width: 680, height: 420, background: `radial-gradient(ellipse at 50% 60%, ${colors.gold}33, rgba(0,0,0,0) 65%)` }} />
      <div style={{ position: "absolute", left: 470, top: 150 }}>
        <Car type="supercar" size={330} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 60 }}>
        <Cazes size={380} sunglasses look={{ x: 0, y: 0 }} />
      </div>
      {/* pool */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, height: 240, borderRadius: 26, border: "8px solid #D8DEE2", background: "linear-gradient(to bottom, #1E7FA8, #0F4D6E)", overflow: "hidden" }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: -60 + ((frame * (0.6 + i * 0.2) + i * 170) % 900),
              top: 30 + i * 52,
              width: 150,
              height: 6,
              borderRadius: 3,
              background: "#BFEFFF",
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Clip 5: The Numbers ─────────────────────────────────────────────
export const Clip5: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(5);

  const tBillion = c("Prosecutors");
  const tDaily = c("On a good");
  const tWallet = c("All of that");
  const tSplit = c("But here's");

  const barA = sp(frame, fps, c("comparison"), springs.smooth, 24);
  const barS = sp(frame, fps, c("13000") - 4, springs.snappy);
  const meter = sp(frame, fps, c("sales"), springs.smooth, c("dollars", 1) - c("sales") + 10);
  const rossLit = frame >= c("Ross", 1) ? 1 : 0;
  const cazesLit = frame >= c("Cazes", 1) ? 1 : 0;

  return (
    <>
      {/* 1: users, vendors, listings */}
      <Scene from={0} to={tBillion}>
        <div style={{ position: "absolute", left: 110, top: 40, ...mono(32, colors.dim) }}>&gt; alphabay at its peak</div>
        <StatCard at={c("200000")} dur={c("users") - c("200000")} label="USERS" to={200000} suffix="+" left={110} />
        <StatCard at={c("40000")} dur={c("sellers") - c("40000") + 6} label="VENDORS" to={40000} left={690} />
        <StatCard at={c("Hundreds")} dur={c("listings") - c("Hundreds") + 8} label="LISTINGS" to={350000} suffix="+" left={1270} />

        {/* comparison bars */}
        <Pop at={c("comparison") - 4} from="left" style={{ left: 110, top: 470, width: 1700 }}>
          <div style={{ ...mono(28, colors.dim), letterSpacing: "0.16em", marginBottom: 14 }}>LISTINGS AT PEAK</div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, height: 100 }}>
            <div style={{ width: 300 }}>
              <MarketLogo name="ALPHABAY" mark="alpha" size={34} />
            </div>
            <div style={{ height: 70, width: 1150 * barA, borderRadius: 8, background: colors.gold, boxShadow: `0 0 30px ${colors.gold}66` }} />
            <span style={{ ...mono(40, colors.gold), fontWeight: 700 }}>350,000+</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, height: 100, opacity: frame >= c("Silk") ? 1 : 0 }}>
            <div style={{ width: 300, display: "flex", alignItems: "center", gap: 12 }}>
              <CamelLogo size={70} />
              <span style={{ fontFamily: fonts.display, fontSize: 40, color: colors.green }}>SILK ROAD</span>
            </div>
            <div style={{ height: 70, width: Math.max(4, 43 * barS), borderRadius: 8, background: colors.green, boxShadow: `0 0 30px ${colors.green}66` }} />
            {frame >= c("13000") - 4 ? <Counter to={13000} at={c("13000") - 4} durationInFrames={18} fontSize={40} color={colors.green} /> : null}
          </div>
        </Pop>
      </Scene>

      {/* 2: a billion dollars */}
      <Scene from={tBillion} to={tDaily}>
        <Terminal
          style={{ position: "absolute", left: 0, right: 0, top: 190 }}
          align="center"
          fontSize={42}
          color={colors.text}
          lines={[{ text: "prosecutors later said it handled:", prompt: "> ", at: tBillion + 4, durationInFrames: 40 }]}
        />
        <TitleSlam text="$1,000,000,000+" color={colors.gold} fontSize={270} at={c("billion")} style={{ top: 310 }} />
        <Sfx name="coin" at={c("billion") + 3} />
        <Chip at={c("transactions")} text="IN TRANSACTIONS" color={colors.text} fontSize={46} origin="center center" style={{ left: 720, top: 640 }} />
        <Flash at={c("billion")} color={colors.gold} peak={0.35} durationInFrames={10} />
      </Scene>

      {/* 3: the daily meter */}
      <Scene from={tDaily} to={tWallet}>
        <div style={{ position: "absolute", left: 210, top: 130, ...mono(34, colors.dim), letterSpacing: "0.2em" }}>DAILY SALES, ESTIMATED</div>
        <div style={{ position: "absolute", left: 210, top: 200, width: 1500, height: 90, borderRadius: 14, border: `3px solid ${colors.line}`, background: colors.panel, overflow: "hidden" }}>
          <div style={{ width: `${meter * 86}%`, height: "100%", background: `linear-gradient(to right, ${colors.amber}, ${colors.gold})`, boxShadow: `0 0 40px ${colors.gold}` }} />
          {[25, 50, 75].map((p) => (
            <div key={p} style={{ position: "absolute", left: `${p}%`, top: 0, bottom: 0, width: 3, background: colors.bg, opacity: 0.5 }} />
          ))}
        </div>
        <Sfx name="tick" at={c("sales")} durationInFrames={c("dollars", 1) - c("sales")} loop volume={0.7} />
        <TitleSlam text="$600,000 - $800,000" color={colors.gold} fontSize={220} at={c("hundreds", 1)} style={{ top: 340 }} />
        <Pop at={c("dollars", 1)} style={{ left: 0, right: 0, top: 570, textAlign: "center" }} sound="coin">
          <span style={{ fontFamily: fonts.display, fontSize: 110, color: colors.text }}>A DAY</span>
        </Pop>
        <Chip at={c("Every")} text="EVERY. SINGLE. DAY." color={colors.text} fontSize={40} origin="center center" style={{ left: 300, top: 730 }} />
        <Chip at={c("commission")} text="+ A COMMISSION ON EVERY SALE" color={colors.gold} filled fontSize={36} origin="center center" style={{ left: 900, top: 730 }} />
      </Scene>

      {/* 4: it all flows to one wallet */}
      <Scene from={tWallet} to={tSplit}>
        {new Array(14).fill(0).map((_, i) => {
          const t = ((frame - tWallet + i * 7) % 48) / 48;
          const a = random(`w-a-${i}`) * Math.PI * 2;
          const r = 900 * (1 - t);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 960 - 28 + Math.cos(a) * r * 1.2,
                top: 480 - 28 + Math.sin(a) * r * 0.6,
                opacity: Math.min(1, t * 3) * (t > 0.92 ? 0 : 1),
                transform: `scale(${1 - t * 0.5})`,
              }}
            >
              <CoinIcon size={56} />
            </div>
          );
        })}
        {[0, 1, 2].map((i) => (
          <Sfx key={i} name="coin" at={c("flowed") + i * 22} volume={0.5} />
        ))}
        <Pop at={tWallet + 4} origin="center bottom" style={{ left: 960 - 152, top: 170 }}>
          <Cazes size={350} sunglasses />
        </Pop>
        <Pop at={tWallet + 8} from="up" style={{ left: 960 - 330, top: 430 }}>
          <Card accent={colors.gold} style={{ width: 660, padding: "20px 34px", textAlign: "center" }}>
            <div style={{ ...mono(26, colors.dim), letterSpacing: "0.22em" }}>WALLET OWNER</div>
            <div style={{ height: 150 }} />
          </Card>
        </Pop>
        <TitleSlam text="ALPHA02" color={colors.gold} fontSize={170} at={c("Alpha02")} style={{ top: 492 }} />
        <Chip at={c("one", 1)} text="ONE MAN" color={colors.text} fontSize={44} origin="center center" style={{ left: 840, top: 720 }} />
      </Scene>

      {/* 5: Ross vs Cazes */}
      <Scene from={tSplit} to={D} exit="glitch">
        <div style={{ position: "absolute", left: 958, top: 90, width: 4, height: 760, background: colors.line }} />
        <CrampedRoom lit={rossLit} />
        <Poolside lit={cazesLit} />
        <div style={{ position: "absolute", left: 150, top: 96, fontFamily: fonts.display, fontSize: 84, lineHeight: 1, color: colors.green, opacity: frame >= c("Ross") ? 1 : 0.2 }}>ROSS ULBRICHT</div>
        <div style={{ position: "absolute", left: 1010, top: 60, fontFamily: fonts.display, fontSize: 84, lineHeight: 1, color: colors.gold, opacity: frame >= c("Cazes") ? 1 : 0.2 }}>ALEXANDRE CAZES</div>
        <Chip at={c("broke")} text="LIVED LIKE A BROKE STUDENT" color={colors.green} fontSize={30} origin="center center" style={{ left: 210, top: 806 }} />
        <TitleSlam text="DID NOT." color={colors.gold} fontSize={170} at={c("not")} style={{ left: 1010, right: 110, top: 640 }} />
        <Flash at={c("not")} color={colors.gold} peak={0.3} durationInFrames={10} />
      </Scene>
    </>
  );
};
