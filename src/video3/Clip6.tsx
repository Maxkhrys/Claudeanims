import React from "react";
import { random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, BrandTag, BRANDS, Chip, Cop, Pop, Scene, SeizedStamp, Sfx, Terminal, TitleSlam, White, mono } from "../components";
import { useClip } from "./words";

/** Evidence item with a numbered tag. */
const Evidence: React.FC<{ at: number; n: number; label: string; left: number; children: React.ReactNode }> = ({ at, n, label, left, children }) => (
  <Pop at={at} sound="pop" origin="center bottom" style={{ left, top: 330, width: 340 }}>
    <div style={{ height: 230, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 14 }}>{children}</div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 16px", background: colors.amber, borderRadius: 6, transform: `rotate(${n % 2 ? -3 : 3}deg)` }}>
        <span style={{ ...mono(26, colors.bg), fontWeight: 700 }}>#{n}</span>
        <span style={{ ...mono(28, colors.bg), fontWeight: 700 }}>{label}</span>
      </div>
    </div>
  </Pop>
);

const PhoneIcon: React.FC<{ h?: number }> = ({ h = 150 }) => (
  <div style={{ width: h * 0.5, height: h, borderRadius: h * 0.1, background: "#0B0F13", border: "5px solid #3A444E" }}>
    <div style={{ margin: "14% 12%", height: "66%", background: "#18212A", borderRadius: 4 }} />
  </div>
);
const LaptopIcon: React.FC<{ w?: number; glow?: number }> = ({ w = 220, glow = 0 }) => (
  <div>
    <div style={{ width: w, height: w * 0.62, borderRadius: "10px 10px 2px 2px", background: glow > 0 ? "#0D1A16" : "#0B0F13", border: "5px solid #3A444E", boxShadow: glow > 0 ? `0 0 ${50 * glow}px ${colors.green}88` : "none" }}>
      {glow > 0 ? <div style={{ margin: 14, height: 10, width: "50%", background: colors.green, opacity: glow, borderRadius: 2 }} /> : null}
    </div>
    <div style={{ width: w * 1.16, height: 12, marginLeft: -w * 0.08, borderRadius: "2px 2px 8px 8px", background: "#3A444E" }} />
  </div>
);
const UsbIcon: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ width: 28, height: 26, background: "#8A949E", borderRadius: "3px 3px 0 0" }} />
    <div style={{ width: 44, height: 90, background: "#2A343D", border: "4px solid #3A444E", borderRadius: 8 }} />
  </div>
);
const SimIcon: React.FC<{ r?: number }> = ({ r = 0 }) => (
  <svg width={54} height={68} viewBox="0 0 40 50" style={{ transform: `rotate(${r}deg)` }}>
    <path d="M 4 4 H 26 L 36 14 V 46 H 4 Z" fill={colors.panelLight} stroke={colors.amber} strokeWidth={3} strokeLinejoin="round" />
    <rect x={11} y={22} width={18} height={16} rx={3} fill={colors.amber} />
  </svg>
);

export const Clip6: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(6);

  const tSearch = c("They arrested");
  const tQuestion = c("He was questioned");
  const tMost = c("Most");
  const tWeeks = c("Within");

  const lights = frame >= c("police") ? Math.floor((frame - c("police")) / 7) % 2 : -1;
  const knock = sp(frame, fps, c("came"), springs.snappy);
  const plug = sp(frame, fps, tMost + 30, springs.pop);
  const away = sp(frame, fps, tMost + 14, springs.smooth, 20);
  const rise = sp(frame, fps, c("hack"), springs.heavy, 70);

  return (
    <>
      {/* A: the knock */}
      <Scene from={0} to={tSearch}>
        <Terminal style={{ position: "absolute", left: 150, top: 100 }} fontSize={64} lines={[{ text: "JANUARY 24, 2022", at: 2, durationInFrames: 30 }]} />
        {/* police lights wash */}
        {lights >= 0 ? (
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at ${lights ? 30 : 70}% 55%, ${lights ? "rgba(255,59,59,0.22)" : "rgba(91,134,196,0.3)"}, rgba(0,0,0,0) 60%)` }} />
        ) : null}
        {/* house front */}
        <div style={{ position: "absolute", left: 760, top: 250, width: 420, height: 590, background: "#131A21", border: "4px solid #232C36" }} />
        <div style={{ position: "absolute", left: 870, top: 400, width: 200, height: 440, borderRadius: "8px 8px 0 0", background: "#1E2831", border: "5px solid #2F3B47" }}>
          <div style={{ position: "absolute", right: 22, top: 220, width: 16, height: 16, borderRadius: 8, background: colors.amber }} />
          <div style={{ position: "absolute", left: 60, top: 60, width: 80, height: 50, background: "#0F151B", borderRadius: 4 }} />
        </div>
        <div style={{ position: "absolute", left: 800, top: 300, width: 110, height: 90, background: colors.amber, opacity: 0.25, border: "4px solid #2F3B47" }} />
        <Pop at={c("police") - 6} origin="center bottom" style={{ left: 420 + (1 - knock) * -40, top: 470 }}>
          <Cop size={380} look={{ x: 0.9, y: 0 }} />
        </Pop>
        <Pop at={c("police")} origin="center bottom" style={{ left: 1240, top: 470 }}>
          <Cop size={380} seed={14} look={{ x: -0.9, y: 0 }} />
        </Pop>
        <Sfx name="door" at={c("came")} volume={0.8} />
        <Chip at={c("came")} text="THE POLICE CAME FOR HIM" color={colors.agent} fontSize={36} origin="center center" style={{ left: 700, top: 180 }} />
      </Scene>

      {/* B: the search */}
      <Scene from={tSearch} to={tQuestion}>
        <div style={{ position: "absolute", left: 110, top: 80, ...mono(34, colors.dim) }}>&gt; evidence seized from the house</div>
        <SeizedStamp at={c("arrested")} text="ARRESTED" fontSize={90} rotate={-6} style={{ left: 1380, top: 60 }} />
        {/* table */}
        <div style={{ position: "absolute", left: 80, right: 80, top: 566, height: 26, borderRadius: 6, background: "#232C36", boxShadow: "0 24px 50px rgba(0,0,0,0.6)" }} />
        <Evidence at={c("phones")} n={1} label="PHONES" left={110}>
          <PhoneIcon />
          <PhoneIcon h={130} />
        </Evidence>
        <Evidence at={c("laptops")} n={2} label="LAPTOPS" left={540}>
          <LaptopIcon />
        </Evidence>
        <Evidence at={c("USB")} n={3} label="USB STICKS" left={990}>
          <UsbIcon />
          <UsbIcon />
          <UsbIcon />
        </Evidence>
        <Evidence at={c("pile")} n={4} label="SIM CARDS" left={1420}>
          {[-14, 8, -4, 16, 2].map((r, i) => (
            <div key={i} style={{ marginLeft: i ? -22 : 0, marginBottom: (i % 2) * 14 }}>
              <SimIcon r={r} />
            </div>
          ))}
        </Evidence>
      </Scene>

      {/* C: questioned, released, sixteen */}
      <Scene from={tQuestion} to={tMost}>
        <Pop at={tQuestion} origin="center bottom" style={{ left: 250, top: 420 }}>
          <White size={330} look={{ x: 0.5, y: 0.3 }} />
        </Pop>
        <Chip at={c("questioned")} text="QUESTIONED" color={colors.agent} fontSize={40} style={{ left: 240, top: 300 }} />
        <SeizedStamp at={c("released")} text="RELEASED UNDER INVESTIGATION" color={colors.amber} fontSize={78} rotate={-5} style={{ left: 640, top: 150 }} />
        <Pop at={c("16") - 4} from="slam" sound="slam" style={{ left: 760, top: 330 }}>
          <span style={{ fontFamily: fonts.display, fontSize: 330, lineHeight: 1, color: colors.text, textShadow: "0 0 60px rgba(230,230,230,0.3)" }}>AGE 16</span>
        </Pop>
        <Chip at={c("devices")} text="DEVICES: GONE" color={colors.red} fontSize={38} style={{ left: 770, top: 690 }} />
        <Chip at={c("knew")} text="NAME: KNOWN TO POLICE" color={colors.red} fontSize={38} style={{ left: 1170, top: 690 }} />
      </Scene>

      {/* D: most people vs White */}
      <Scene from={tMost} to={tWeeks}>
        <div style={{ position: "absolute", left: 958, top: 110, width: 4, height: 730, background: colors.line }} />
        <div style={{ position: "absolute", left: 0, width: 958, top: 110, textAlign: "center", fontFamily: fonts.display, fontSize: 110, color: colors.dim }}>MOST PEOPLE</div>
        <div style={{ position: "absolute", left: 962, right: 0, top: 110, textAlign: "center", fontFamily: fonts.display, fontSize: 110, color: colors.green }}>WHITE</div>
        <div style={{ position: "absolute", left: 180, top: 380 }}>
          <BlobCharacter color={colors.extras[0]} size={340} seed={31} look={{ x: 0.6, y: 0.6 }} />
        </div>
        {/* keyboard going into a box */}
        <div style={{ position: "absolute", left: 560, top: 640, width: 280, height: 150, background: "#3A2F22", border: "4px solid #5A4632", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 590, top: 520 + away * 150, width: 220, height: 50, borderRadius: 8, background: "#2A343D", border: "3px solid #3A444E", opacity: 1 - away * 0.8 }} />
        <Chip at={tMost + 30} text="STOP" color={colors.dim} fontSize={40} origin="center center" style={{ left: 420, top: 270 }} />
        <div style={{ position: "absolute", left: 1090, top: 380 }}>
          <White size={340} look={{ x: 0.7, y: 0.4 }} lightColor={colors.green} lightAmount={plug * 0.6} />
        </div>
        <div style={{ position: "absolute", left: 1460, top: 560, transform: `scale(${0.6 + 0.4 * plug})`, transformOrigin: "center bottom" }}>
          <LaptopIcon w={250} glow={plug} />
        </div>
        <Sfx name="click" at={tMost + 30} />
        <Chip at={tMost + 40} text="NEW LAPTOP" color={colors.green} fontSize={40} origin="center center" style={{ left: 1420, top: 270 }} />
      </Scene>

      {/* E: within weeks */}
      <Scene from={tWeeks} to={D} exit="glitch">
        {/* calendar pages tearing off */}
        {new Array(6).fill(0).map((_, i) => {
          const t = (frame - tWeeks - i * 9) / 34;
          if (t < 0 || t > 1.2) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 250 + t * (120 + random(`pg-${i}`) * 200),
                top: 300 + t * t * 520,
                width: 190,
                height: 210,
                borderRadius: 10,
                background: colors.text,
                transform: `rotate(${t * (30 + random(`pr-${i}`) * 50) * (i % 2 ? 1 : -1)}deg)`,
                opacity: 1 - Math.max(0, t - 0.6) * 1.8,
                overflow: "hidden",
              }}
            >
              <div style={{ height: 50, background: colors.red }} />
              <div style={{ textAlign: "center", fontFamily: fonts.display, fontSize: 120, lineHeight: 1.2, color: colors.bg }}>{25 + i}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 250, top: 300, width: 190, height: 210, borderRadius: 10, background: colors.text, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.6)" }}>
          <div style={{ height: 50, background: colors.red, ...mono(24, colors.text), fontWeight: 700, textAlign: "center", lineHeight: "50px" }}>FEB 2022</div>
          <div style={{ textAlign: "center", fontFamily: fonts.display, fontSize: 120, lineHeight: 1.2, color: colors.bg }}>{Math.min(23, 1 + Math.floor(Math.max(0, frame - tWeeks) / 5))}</div>
        </div>
        <Sfx name="whoosh" at={tWeeks + 4} />
        <Chip at={tWeeks + 6} text="WITHIN WEEKS" fontSize={40} style={{ left: 240, top: 200 }} />
        {/* the next target rises on the horizon */}
        <div style={{ position: "absolute", left: 600, right: 0, top: 640, height: 4, background: `linear-gradient(to right, rgba(0,0,0,0), ${BRANDS.NVIDIA}, rgba(0,0,0,0))`, opacity: rise }} />
        <div style={{ position: "absolute", left: 700, right: 100, top: 280, height: 360, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: `radial-gradient(ellipse at 50% 100%, ${BRANDS.NVIDIA}66, rgba(0,0,0,0) 70%)`, opacity: rise }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: (1 - rise) * 380 + 60, textAlign: "center" }}>
            <BrandTag name="NVIDIA" size={230} />
          </div>
        </div>
        <Chip at={c("valuable")} text="ONE OF THE MOST VALUABLE COMPANIES IN THE WORLD" color={colors.text} fontSize={30} origin="center center" style={{ left: 760, top: 680 }} />
        <TitleSlam text="HE WAS JUST GETTING STARTED." color={colors.amber} fontSize={150} at={c("just")} style={{ top: 70 }} />
      </Scene>
    </>
  );
};
