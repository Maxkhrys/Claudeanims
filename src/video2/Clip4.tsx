import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  BlobCharacter,
  CamelLogo,
  Card,
  Cazes,
  Chip,
  IconFlood,
  MarketLogo,
  NameTag,
  Pop,
  Scene,
  SeizedStamp,
  Sfx,
  Terminal,
  TitleSlam,
  mono,
} from "../components";
import { useClip } from "./words";

// ─── local helpers ───────────────────────────────────────────────────

/** AlphaBay-style homepage: search bar, category rail, listing skeletons. */
const HomePage: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const q = "search all listings";
  const typed = Math.max(0, Math.min(q.length, Math.floor((frame - at - 20) / 1.6)));
  const cats = ["Drugs", "Fraud", "Hacking tools", "Stolen data", "Fake IDs", "Services"];
  return (
    <Card accent={colors.gold} style={{ width: 1250, height: 720, padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: "#090D10", borderBottom: `2px solid ${colors.line}` }}>
        {[colors.red, colors.amber, colors.green].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.75 }} />
        ))}
        <div style={{ flex: 1, marginLeft: 14, padding: "8px 18px", borderRadius: 8, background: colors.panelLight, border: `1px solid ${colors.line}`, ...mono(22, colors.dim) }}>
          <span style={{ color: colors.gold }}>tor://</span>alphabay••••••••.onion
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "20px 28px", borderBottom: `2px solid ${colors.line}` }}>
        <MarketLogo name="ALPHABAY" mark="alpha" size={54} />
        <div style={{ flex: 1, padding: "12px 22px", borderRadius: 30, border: `2px solid ${colors.gold}`, background: colors.panelLight, ...mono(26) }}>
          <span style={{ color: colors.gold }}>⌕ </span>
          {q.slice(0, typed)}
          <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1, color: colors.gold }}>▌</span>
        </div>
        <div style={{ ...mono(22, colors.dim) }}>wallet · orders · support</div>
      </div>
      <div style={{ display: "flex", height: 520 }}>
        <div style={{ width: 290, borderRight: `2px solid ${colors.line}`, padding: "20px 24px" }}>
          <div style={{ ...mono(20, colors.dim), letterSpacing: "0.16em", marginBottom: 12 }}>CATEGORIES</div>
          {cats.map((cat, i) => {
            const s = sp(frame, 30, at + 14 + i * 4, springs.snappy);
            return (
              <div key={cat} style={{ ...mono(26), padding: "9px 0", borderBottom: `1px solid ${colors.line}`, opacity: Math.min(1, s * 2), transform: `translateX(${(1 - s) * -30}px)` }}>
                <span style={{ color: colors.gold }}>▸ </span>
                {cat}
              </div>
            );
          })}
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, padding: 22, alignContent: "start" }}>
          {new Array(6).fill(0).map((_, i) => {
            const s = sp(frame, 30, at + 24 + i * 3, springs.pop);
            return (
              <div key={i} style={{ height: 208, borderRadius: 10, border: `2px solid ${colors.line}`, background: colors.panelLight, padding: 14, transform: `scale(${s})` }}>
                <div style={{ height: 100, borderRadius: 6, background: "linear-gradient(135deg, #1B242C, #141B21)" }} />
                <div style={{ height: 16, width: "70%", borderRadius: 4, background: colors.line, marginTop: 14 }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                  <div style={{ height: 14, width: 90, borderRadius: 4, background: colors.gold, opacity: 0.7 }} />
                  <div style={{ height: 14, width: 60, borderRadius: 4, background: colors.green, opacity: 0.6 }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

type IconName = "lock" | "twofa" | "wallet" | "shield";
const FeatureIcon: React.FC<{ name: IconName; color: string }> = ({ name, color }) => {
  const common = { fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={120} height={120} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 10px ${color}77)` }}>
      {name === "lock" ? (
        <g {...common}>
          <rect x={5} y={11} width={14} height={10} rx={2} />
          <path d="M8 11 V7.5 a4 4 0 0 1 8 0 V11" />
          <circle cx={12} cy={16} r={1.4} fill={color} />
        </g>
      ) : null}
      {name === "twofa" ? (
        <g {...common}>
          <rect x={7} y={2.5} width={10} height={19} rx={2} />
          <path d="M10 8 h4 M10 11.5 h4 M10 15 h4" />
          <circle cx={12} cy={18.5} r={0.6} fill={color} />
        </g>
      ) : null}
      {name === "wallet" ? (
        <g {...common}>
          <path d="M3.5 7.5 a2 2 0 0 1 2 -2 H18 v3" />
          <rect x={3.5} y={8} width={17} height={11.5} rx={2} />
          <path d="M15.5 12 H20.5 v3.5 H15.5 a1.75 1.75 0 0 1 0 -3.5 Z" />
        </g>
      ) : null}
      {name === "shield" ? (
        <g {...common}>
          <path d="M12 3 L19.5 6 V11.5 c0 4.6 -3.2 7.6 -7.5 9.5 c-4.3 -1.9 -7.5 -4.9 -7.5 -9.5 V6 Z" />
          <path d="M8.6 12 l2.4 2.4 l4.4 -4.6" />
        </g>
      ) : null}
    </svg>
  );
};

const FeatureTile: React.FC<{ at: number; icon: IconName; title: string; sub: string; left: number }> = ({ at, icon, title, sub, left }) => (
  <Pop at={at} sound="pop" style={{ left, top: 370 }}>
    <Card accent={colors.gold} style={{ width: 280, height: 380, padding: "26px 18px", textAlign: "center" }}>
      <FeatureIcon name={icon} color={colors.gold} />
      <div style={{ fontFamily: fonts.display, fontSize: 52, lineHeight: 1, color: colors.text, marginTop: 14 }}>{title}</div>
      <div style={{ ...mono(22, colors.dim), marginTop: 12, lineHeight: 1.4 }}>{sub}</div>
    </Card>
  </Pop>
);

const Staff: React.FC<{ at: number; x: number; color: string; seed: number; look: number }> = ({ at, x, color, seed, look }) => (
  <Pop at={at} origin="center bottom" style={{ left: x - 108, top: 450 }}>
    <BlobCharacter color={color} size={250} seed={seed} look={{ x: look, y: 0 }} />
  </Pop>
);

const CategoryRow: React.FC<{ at: number; n: string; text: string; top: number; first?: boolean }> = ({ at, n, text, top, first }) => (
  <Pop at={at} from="left" sound="pop" style={{ left: 380, top, width: 1160 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 30, borderBottom: `2px solid ${colors.line}`, paddingBottom: 12 }}>
      <span style={{ ...mono(34, colors.gold), fontWeight: 700, width: 60 }}>{n}</span>
      <span style={{ fontFamily: fonts.display, fontSize: 88, lineHeight: 1, color: colors.text, flex: 1 }}>{text}</span>
      <span style={{ ...mono(26, colors.bg), fontWeight: 700, background: first ? colors.green : colors.red, padding: "5px 14px", borderRadius: 6 }}>
        {first ? "LIKE SILK ROAD" : "NEW"}
      </span>
    </div>
  </Pop>
);

// ─── Clip 4: Building the Empire ─────────────────────────────────────
export const Clip4: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(4);

  const tSecurity = c("Cazes");
  const tStaff = c("He hired");
  const tCats = c("And unlike");
  const tRise = c("As the");

  const ceo = frame >= c("CEO");
  const grow = sp(frame, fps, c("people"), springs.heavy, D - c("people"));
  const RIVALS = ["SILK ROAD 2", "AGORA", "EVOLUTION", "THE REST"];

  return (
    <>
      {/* 1: the homepage */}
      <Scene from={0} to={tSecurity}>
        <Terminal
          style={{ position: "absolute", left: 110, top: 60 }}
          fontSize={38}
          color={colors.gold}
          lines={[{ text: "december 2014: alphabay goes live", prompt: "> ", at: c("December") - 8, durationInFrames: 34 }]}
        />
        <Pop at={c("launched")} from="up" sound="whoosh" style={{ left: 110, top: 130 }}>
          <HomePage at={c("launched")} />
        </Pop>
        <Chip at={c("different")} text="FELT DIFFERENT" color={colors.text} fontSize={32} style={{ left: 1400, top: 200 }} />
        <Chip at={c("fast")} text="FAST" color={colors.gold} fontSize={54} style={{ left: 1400, top: 320 }} />
        <Chip at={c("professional")} text="PROFESSIONAL" color={colors.gold} fontSize={38} style={{ left: 1400, top: 460 }} />
        <Chip at={c("company")} text="RUN LIKE A COMPANY" color={colors.gold} filled fontSize={28} style={{ left: 1400, top: 590 }} />
      </Scene>

      {/* 2: security features */}
      <Scene from={tSecurity} to={tStaff}>
        <Pop at={tSecurity} origin="center bottom" style={{ left: 130, top: 330 }}>
          <Cazes size={440} look={{ x: 0.8, y: 0 }} />
          <NameTag text="ALPHA02" color={colors.gold} />
        </Pop>
        <TitleSlam text="BETTER SECURITY" color={colors.gold} fontSize={190} at={c("security")} style={{ left: 610, right: "auto", top: 110, alignItems: "flex-start" }} />
        <FeatureTile at={c("Encrypted")} icon="lock" title="ENCRYPTED" sub="private messages" left={620} />
        <FeatureTile at={c("two-factor")} icon="twofa" title="TWO-FACTOR" sub="logins" left={920} />
        <FeatureTile at={c("money")} icon="wallet" title="ESCROW" sub="buyer's money is held..." left={1220} />
        <FeatureTile at={c("order")} icon="shield" title="RELEASED" sub="...when the order arrives" left={1520} />
      </Scene>

      {/* 3: staff. Not a lone hacker: a CEO */}
      <Scene from={tStaff} to={tCats}>
        <Pop at={tStaff} origin="center bottom" style={{ left: 960 - 173, top: 300 }}>
          <Cazes size={400} sunglasses={ceo} />
        </Pop>
        {[
          { at: c("moderators"), xs: [210, 420], color: colors.extras[1], tag: "MODERATORS", look: 1 },
          { at: c("customer"), xs: [1500, 1710], color: colors.extras[2], tag: "SUPPORT", look: -1 },
          { at: c("security", 1), xs: [640, 1280], color: colors.agent, tag: "SECURITY", look: 0 },
        ].map((g, gi) => (
          <React.Fragment key={g.tag}>
            {g.xs.map((x, i) => (
              <Staff key={x} at={g.at + i * 3} x={x} color={g.color} seed={20 + gi * 2 + i} look={gi === 2 ? (i ? -0.8 : 0.8) : g.look} />
            ))}
            <Chip
              at={g.at + 4}
              text={g.tag}
              color={g.color}
              fontSize={28}
              origin="center center"
              style={gi === 2 ? { left: 870, top: 760 } : { left: (g.xs[0] + g.xs[1]) / 2 - 110, top: 720 }}
            />
          </React.Fragment>
        ))}
        <Scene from={tStaff} to={c("CEO") - 2}>
          <Chip at={c("hired")} text="HE HIRED STAFF" color={colors.text} fontSize={44} origin="center center" style={{ left: 760, top: 130 }} />
          <Pop at={c("lone")} from="up" style={{ left: 0, right: 0, top: 230, textAlign: "center" }}>
            <span style={{ ...mono(34, colors.dim), textDecoration: "line-through", textDecorationColor: colors.red }}>a lone hacker in a bedroom</span>
          </Pop>
        </Scene>
        <TitleSlam text="CEO" color={colors.gold} fontSize={300} at={c("CEO")} style={{ top: 30 }} />
      </Scene>

      {/* 4: almost everything */}
      <Scene from={tCats} to={tRise}>
        <Pop at={c("Silk")} style={{ left: 130, top: 90 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, opacity: 0.55 }}>
            <CamelLogo size={130} />
            <span style={{ ...mono(28, colors.green) }}>
              silk road:
              <br />
              mostly drugs
            </span>
          </div>
        </Pop>
        <TitleSlam text="ALMOST EVERYTHING" color={colors.gold} fontSize={170} at={c("everything")} style={{ left: 520, top: 60 }} />
        <CategoryRow at={c("Drugs")} n="01" text="DRUGS" top={290} first />
        <CategoryRow at={c("stolen")} n="02" text="STOLEN CREDIT CARDS" top={400} />
        <CategoryRow at={c("hacked")} n="03" text="HACKED ACCOUNTS" top={510} />
        <CategoryRow at={c("malware")} n="04" text="MALWARE" top={620} />
        <CategoryRow at={c("fake")} n="05" text="FAKE IDs" top={730} />
      </Scene>

      {/* 5: rivals fall, AlphaBay grows */}
      <Scene from={tRise} to={D} exit="glitch">
        {frame >= c("flooded") ? <IconFlood at={c("flooded")} spread={40} color={colors.gold} seed="v2c4" style={{ opacity: 0.3 }} /> : null}
        {RIVALS.map((name, i) => {
          const fall = sp(frame, fps, c("collapsed") + i * 5, springs.smooth, 26);
          const x = 90 + i * 450;
          return (
            <div
              key={name}
              style={{
                position: "absolute",
                left: x,
                top: 110 + fall * 900,
                transform: `rotate(${fall * (i % 2 ? 24 : -24)}deg)`,
                opacity: 1 - fall * 0.9,
              }}
            >
              <MarketLogo name={name} size={62} color={colors.dim} />
              <SeizedStamp at={c("collapsed") + i * 5 - 4} text={i % 2 ? "SCAMMED" : "SEIZED"} fontSize={44} sound={i === 0} style={{ left: 70, top: 50 }} />
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 330,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${interpolate(grow, [0, 1], [0.75, 1.45])})`,
          }}
        >
          <MarketLogo name="ALPHABAY" mark="alpha" size={170} />
        </div>
        <Sfx name="riser" at={c("Within")} volume={0.6} />
        <Chip at={c("two")} text="WITHIN 2 YEARS" color={colors.text} fontSize={36} origin="center center" style={{ left: 780, top: 200 }} />
        <TitleSlam text="THE BIGGEST BLACK MARKET ON THE PLANET" color={colors.gold} fontSize={104} at={c("biggest")} style={{ top: 700 }} />
      </Scene>
    </>
  );
};
