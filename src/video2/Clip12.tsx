import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Car, CoinIcon, Scene, SeizedStamp, Sfx, Terminal, mono } from "../components";
import { useClip } from "./words";

// Clip 12, "The Cell". Deliberately quiet: muted colours, plain fades,
// no slams, flashes or glitches, and nothing of the death itself is shown.

const GREY = "#9AA3AB";

/** Plain opacity fade-in. No movement, no sound. */
const Fade: React.FC<{ at: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  at,
  dur = 24,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (o <= 0) return null;
  return <div style={{ position: "absolute", ...style, opacity: o }}>{children}</div>;
};

/** A closed steel cell door. `bars` draws an open barred front instead (the video 1 callback). */
const CellDoor: React.FC<{ width?: number; height?: number; bars?: boolean; label?: string }> = ({
  width = 330,
  height = 560,
  bars = false,
  label,
}) => (
  <div
    style={{
      width,
      height,
      borderRadius: 6,
      border: "10px solid #2A3138",
      background: bars ? "#07090B" : "linear-gradient(to right, #343C44, #262D34 60%, #1E242A)",
      position: "relative",
      boxShadow: "0 0 60px rgba(0,0,0,0.6)",
      overflow: "hidden",
    }}
  >
    {bars ? (
      <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "space-evenly" }}>
        {new Array(6).fill(0).map((_, i) => (
          <div key={i} style={{ width: 16, height: "100%", borderRadius: 5, background: "linear-gradient(to right, #59636D, #2A323A)" }} />
        ))}
      </div>
    ) : (
      <>
        {/* viewing slot */}
        <div style={{ position: "absolute", left: "30%", right: "30%", top: 70, height: 46, borderRadius: 4, background: "#0A0D10", border: "4px solid #1A2026" }} />
        {/* hatch */}
        <div style={{ position: "absolute", left: "22%", right: "22%", top: 300, height: 34, borderRadius: 3, border: "4px solid #1A2026" }} />
        {/* lock */}
        <div style={{ position: "absolute", right: 22, top: 250, width: 26, height: 70, borderRadius: 4, background: "#14191E" }} />
        {[40, height - 80].map((y) => (
          <div key={y} style={{ position: "absolute", left: 8, top: y, width: 14, height: 34, borderRadius: 3, background: "#14191E" }} />
        ))}
      </>
    )}
    {label ? (
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", ...mono(20, "#6C757D"), letterSpacing: "0.2em" }}>{label}</div>
    ) : null}
  </div>
);

/** Grey prison corridor with one closed door. */
const Corridor: React.FC<{ doorX: number }> = ({ doorX }) => {
  const frame = useCurrentFrame();
  const flicker = 0.9 + 0.1 * Math.sin(frame / 37) * Math.sin(frame / 11);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* back wall */}
      <div style={{ position: "absolute", left: -100, right: -100, top: 0, height: 800, background: "linear-gradient(to bottom, #12171B 0%, #1B2126 55%, #151A1E 100%)" }} />
      {/* wall panel lines */}
      {[-60, 320, 700, 1460, 1840].map((x) => (
        <div key={x} style={{ position: "absolute", left: x, top: 0, width: 3, height: 800, background: "#0E1215" }} />
      ))}
      <div style={{ position: "absolute", left: -100, right: -100, top: 560, height: 8, background: "#0E1215" }} />
      {/* ceiling strip lights */}
      {[300, 960, 1620].map((x) => (
        <div key={x} style={{ position: "absolute", left: x - 150, top: 26, width: 300, height: 10, borderRadius: 5, background: GREY, opacity: 0.35 * flicker, boxShadow: `0 0 80px 20px rgba(154,163,171,${0.12 * flicker})` }} />
      ))}
      {/* floor */}
      <div style={{ position: "absolute", left: -100, right: -100, top: 800, bottom: -100, background: "linear-gradient(to bottom, #0F1316, #07090B 60%)", borderTop: "4px solid #262D33" }} />
      <div style={{ position: "absolute", left: doorX - 260, top: 800, width: 850, height: 140, background: "radial-gradient(ellipse at 50% 0%, rgba(154,163,171,0.10), rgba(0,0,0,0) 70%)" }} />
      {/* the door */}
      <div style={{ position: "absolute", left: doorX, top: 240 }}>
        <CellDoor />
      </div>
    </div>
  );
};

const HouseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 150, color = GREY }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 8 50 L 50 14 L 92 50 Z" fill={color} />
    <rect x={18} y={50} width={64} height={38} fill={color} />
    <rect x={42} y={62} width={16} height={26} fill={colors.bg} opacity={0.7} />
    <rect x={24} y={58} width={12} height={12} fill={colors.bg} opacity={0.7} />
    <rect x={64} y={58} width={12} height={12} fill={colors.bg} opacity={0.7} />
  </svg>
);

const DAYS = [5, 6, 7, 8, 9, 10, 11, 12];

export const Clip12: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(12);

  const tFacing = c("He was facing");
  const tJuly = c("On July");
  const tBecause = c("Because");
  const tAssets = c("The cars");

  const DOOR_X = 1150;
  // slow, steady push towards the door for the whole corridor section
  const push = interpolate(frame, [0, tBecause], [1, 1.12], { extrapolateRight: "clamp" });
  const dim = interpolate(frame, [tBecause - 10, tBecause + 20], [1, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const calSpan = tJuly - tFacing - 14;

  const ASSETS = [
    { at: c("cars"), x: 120, node: <Car type="supercar" size={370} color="#B9A26A" /> },
    { at: c("cars") + 6, x: 520, node: <Car type="sedan" size={360} color={GREY} /> },
    { at: c("houses"), x: 940, node: <HouseIcon size={250} /> },
    { at: c("houses") + 6, x: 1230, node: <HouseIcon size={190} /> },
    { at: c("crypto"), x: 1500, node: <CoinIcon size={230} color="#B9A26A" /> },
  ];

  return (
    <>
      {/* 1-4: the corridor */}
      <Scene from={0} to={tAssets}>
        <Sfx name="door" at={4} volume={0.7} />
        <div style={{ position: "absolute", inset: 0, opacity: dim, transform: `scale(${push})`, transformOrigin: `${DOOR_X + 165}px 520px` }}>
          <Corridor doorX={DOOR_X} />
          {/* Ross's cell from video 1, faint, beside it */}
          <Fade at={c("25") - 6} dur={40} style={{ left: 1570, top: 300 }}>
            <div style={{ opacity: 0.32 }}>
              <CellDoor width={270} height={470} bars />
            </div>
          </Fade>
        </div>

        {/* where he was held */}
        <Scene from={0} to={tFacing}>
          <Terminal
            style={{ position: "absolute", left: 130, top: 220 }}
            fontSize={40}
            color={GREY}
            cursorColor={GREY}
            sound={false}
            lines={[
              { text: "after the arrest", prompt: "> ", at: c("After"), durationInFrames: 20 },
              { text: "narcotics suppression bureau, bangkok", prompt: "> ", at: c("Narcotics"), durationInFrames: 40 },
            ]}
          />
          <Fade at={c("Waiting")} style={{ left: 130, top: 430 }}>
            <div style={{ ...mono(34, colors.text), letterSpacing: "0.1em", padding: "12px 20px", border: `2px solid ${colors.line}`, borderRadius: 6, background: "rgba(7,9,11,0.8)" }}>
              AWAITING EXTRADITION TO THE UNITED STATES
            </div>
          </Fade>
        </Scene>

        {/* the week */}
        <Scene from={tFacing} to={tBecause}>
          <div style={{ position: "absolute", left: 130, top: 190, ...mono(30, colors.dim), letterSpacing: "0.3em" }}>JULY 2017</div>
          <div style={{ position: "absolute", left: 130, top: 250, display: "flex", gap: 12 }}>
            {DAYS.map((d, i) => {
              const at = tFacing + 6 + (i / (DAYS.length - 1)) * calSpan;
              const on = interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const last = i === DAYS.length - 1;
              return (
                <div
                  key={d}
                  style={{
                    width: 100,
                    height: 110,
                    borderRadius: 8,
                    border: `2px solid ${last && on > 0.5 ? colors.text : colors.line}`,
                    background: `rgba(154,163,171,${0.04 + 0.14 * on})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fonts.display,
                    fontSize: 70,
                    color: colors.text,
                    opacity: 0.3 + 0.7 * on,
                  }}
                >
                  {d}
                </div>
              );
            })}
          </div>
          <Fade at={c("charges")} style={{ left: 130, top: 420 }}>
            <span style={{ ...mono(42, GREY) }}>facing: the rest of his life in prison</span>
          </Fade>
          <Fade at={c("July")} dur={30} style={{ left: 130, top: 495 }}>
            <div style={{ fontFamily: fonts.display, fontSize: 120, lineHeight: 1, color: colors.text }}>JULY 12, 2017</div>
          </Fade>
          <Fade at={c("Thai")} dur={30} style={{ left: 134, top: 622 }}>
            <span style={{ ...mono(38, GREY) }}>found dead in his cell,<br />one week after the arrest</span>
          </Fade>
          <Fade at={c("25")} dur={30} style={{ left: 134, top: 742 }}>
            <span style={{ ...mono(52, colors.text), fontWeight: 700, letterSpacing: "0.12em" }}>AGE 25</span>
          </Fade>
        </Scene>

        {/* how it ended */}
        <Scene from={tBecause} to={tAssets}>
          <Terminal
            style={{ position: "absolute", left: 0, right: 0, top: 190 }}
            align="center"
            fontSize={110}
            color={colors.text}
            cursorColor={GREY}
            sound={false}
            lines={[{ text: "CASE CLOSED?", at: tBecause + 8, durationInFrames: 30 }]}
          />
          <Fade at={c("never", 1)} style={{ left: 0, right: 0, top: 420, textAlign: "center" }}>
            <span style={{ ...mono(58, colors.text), fontWeight: 700 }}>never convicted of anything</span>
          </Fade>
          <Fade at={c("family")} style={{ left: 0, right: 0, top: 520, textAlign: "center" }}>
            <span style={{ ...mono(42, GREY) }}>his family has questioned how it happened</span>
          </Fade>
          <Fade at={c("Officially")} style={{ left: 0, right: 0, top: 610, textAlign: "center" }}>
            <span style={{ ...mono(42, GREY) }}>officially: the case simply ended</span>
          </Fade>
        </Scene>
      </Scene>

      {/* 5: everything seized */}
      <Scene from={tAssets} to={D}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", ...mono(44, colors.dim), letterSpacing: "0.3em" }}>
          WHAT HE LEFT BEHIND
        </div>
        <div style={{ position: "absolute", left: 100, right: 100, top: 660, height: 4, background: colors.line }} />
        {ASSETS.map((a, i) => (
          <React.Fragment key={i}>
            <Fade at={a.at} dur={12} style={{ left: a.x, top: 380, height: 280, display: "flex", alignItems: "flex-end" }}>
              {a.node}
            </Fade>
            <SeizedStamp at={c("All") + i * 4} fontSize={64} sound={i % 2 === 0} style={{ left: a.x + 20, top: 470 }} />
          </React.Fragment>
        ))}
        <Fade at={c("crypto") + 8} style={{ left: 1440, top: 690 }}>
          <span style={{ ...mono(32, colors.dim) }}>millions in crypto</span>
        </Fade>
      </Scene>
    </>
  );
};
