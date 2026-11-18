import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BrandTag, Card, Chip, Counter, MapPins, Pop, Scene, SeizedStamp, Sfx, Terminal, TitleSlam, mono } from "../components";
import { useClip } from "./words";

const BRAND_GRID = [
  { name: "NVIDIA", cue: "Nvidia", left: 190, top: 330 },
  { name: "SAMSUNG", cue: "Samsung", left: 1010, top: 330 },
  { name: "MICROSOFT", cue: "Microsoft", left: 190, top: 580 },
  { name: "UBER", cue: "Uber", left: 1010, top: 580 },
];

export const Clip2: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(2);

  const tEverywhere = c("Within");
  const tList = c("But Rockstar");
  const tHunt = c("Investigators");
  const tCourt = c("And this month");

  const thumbs = Math.round(90 * sp(frame, fps, c("90"), springs.smooth, 46));
  const zoom = 1 + 2.2 * sp(frame, fps, c("trail"), springs.heavy, 60);
  const spread = sp(frame, fps, c("everywhere"), springs.snappy);
  const door = sp(frame, fps, c("court"), springs.snappy);
  const guilty = frame >= c("Guilty") ? Math.min(1, (frame - c("Guilty")) / 12) : 0;

  return (
    <>
      {/* 1: the forum post */}
      <Scene from={0} to={tEverywhere}>
        <Pop at={4} from="up" style={{ left: 150, top: 80 }}>
          <Card style={{ width: 1050, height: 760, padding: "26px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...mono(24, colors.dim), letterSpacing: "0.12em" }}>
              <span>GAMING FORUM · NEW POST</span>
              <span>SEPT 2022</span>
            </div>
            <div style={{ fontFamily: fonts.display, fontSize: 84, lineHeight: 1, color: colors.text, marginTop: 14 }}>GTA 6: LEAKED FOOTAGE</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(15, 1fr)", gap: 8, marginTop: 26 }}>
              {new Array(90).fill(0).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 78,
                    borderRadius: 5,
                    background: i < thumbs ? `hsl(${150 + random(`th-${i}`) * 60}, 30%, ${14 + random(`tl-${i}`) * 12}%)` : colors.panelLight,
                    border: `2px solid ${i < thumbs ? colors.greenDim : colors.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: colors.text,
                    fontSize: 20,
                    opacity: i < thumbs ? 1 : 0.4,
                  }}
                >
                  {i < thumbs ? "▶" : ""}
                </div>
              ))}
            </div>
          </Card>
        </Pop>
        <div style={{ position: "absolute", left: 1280, top: 170, width: 540, textAlign: "center" }}>
          {frame >= c("90") ? <Counter to={90} at={c("90")} durationInFrames={46} fontSize={300} color={colors.amber} /> : null}
          <Pop at={c("clips")} from="up" style={{ position: "relative" }}>
            <span style={{ ...mono(46, colors.text), fontWeight: 700, letterSpacing: "0.14em" }}>VIDEO CLIPS</span>
          </Pop>
        </div>
        <Chip at={c("hour")} text="ALMOST AN HOUR OF FOOTAGE" fontSize={28} origin="center center" style={{ left: 1262, top: 590 }} />
        <Chip at={c("unfinished")} text="EARLY. UNFINISHED." color={colors.red} fontSize={30} origin="center center" style={{ left: 1368, top: 672 }} />
      </Scene>

      {/* 2: everywhere */}
      <Scene from={tEverywhere} to={tList}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {new Array(18).fill(0).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            const r = 120 + spread * (520 + random(`sr-${i}`) * 260);
            const pulse = ((frame - tEverywhere + i * 4) % 40) / 40;
            return (
              <g key={i} opacity={spread}>
                <line x1={960 + Math.cos(a) * 110} y1={450 + Math.sin(a) * 70} x2={960 + Math.cos(a) * r} y2={450 + Math.sin(a) * r * 0.62} stroke={colors.green} strokeWidth={4} strokeDasharray="6 14" opacity={0.6} />
                <circle cx={960 + Math.cos(a) * r * pulse} cy={450 + Math.sin(a) * r * 0.62 * pulse} r={9} fill={colors.green} opacity={1 - pulse} />
              </g>
            );
          })}
        </svg>
        <TitleSlam text="EVERYWHERE" color={colors.green} fontSize={280} at={c("everywhere")} style={{ top: 300 }} />
        <Pop at={c("Within")} from="up" style={{ left: 0, right: 0, top: 200, textAlign: "center" }}>
          <span style={{ ...mono(44, colors.dim), letterSpacing: "0.2em" }}>WITHIN HOURS</span>
        </Pop>
        <Chip at={c("biggest")} text="ONE OF THE BIGGEST LEAKS IN GAMING HISTORY" fontSize={40} origin="center center" style={{ left: 420, top: 680 }} />
        <Sfx name="whoosh" at={c("everywhere") - 4} />
      </Scene>

      {/* 3: a very long list */}
      <Scene from={tList} to={tHunt}>
        <Pop at={c("Rockstar")} from="left" style={{ left: 190, top: 90 }}>
          <BrandTag name="ROCKSTAR" size={110} />
        </Pop>
        <Chip at={c("latest")} text="ONLY THE LATEST NAME" color={colors.text} fontSize={34} style={{ left: 900, top: 120 }} />
        <Terminal
          style={{ position: "absolute", left: 190, top: 240 }}
          fontSize={36}
          color={colors.dim}
          lines={[{ text: "same group. about one year:", prompt: "> ", at: c("about"), durationInFrames: 26 }]}
        />
        {BRAND_GRID.map((b) => (
          <React.Fragment key={b.name}>
            <Pop at={c(b.cue)} style={{ left: b.left, top: b.top }} origin="left center">
              <Card style={{ width: 720, height: 200, display: "flex", alignItems: "center", padding: "0 40px" }}>
                <BrandTag name={b.name} size={104} />
              </Card>
            </Pop>
            <SeizedStamp at={c(b.cue) + 7} text="BREACHED" fontSize={46} rotate={7} style={{ left: b.left + 470, top: b.top - 26 }} />
          </React.Fragment>
        ))}
      </Scene>

      {/* 4: who they thought it was, and who it was */}
      <Scene from={tHunt} to={tCourt}>
        <MapPins
          width={1640}
          style={{ left: 140, top: 110 }}
          focus={{ lon: -2, lat: 53, zoom }}
          pins={[
            { lon: 37.6, lat: 55.7, label: "?", at: c("foreign"), color: colors.red },
            { lon: 116.4, lat: 39.9, label: "?", at: c("professional"), color: colors.red, side: "left" },
            { lon: 51.4, lat: 35.7, label: "?", at: c("army"), color: colors.red, side: "bottom" },
            { lon: -1.3, lat: 51.8, at: c("trail") + 20, color: colors.green, glow: true },
          ]}
        />
        <Scene from={tHunt} to={c("trail")}>
          <Chip at={c("assumed")} text="THE ASSUMPTION: A FOREIGN GOVERNMENT" color={colors.red} fontSize={36} style={{ left: 140, top: 60 }} />
          <Chip at={c("army")} text="A PROFESSIONAL ARMY OF HACKERS" color={colors.text} fontSize={32} style={{ left: 140, top: 770 }} />
          {[
            { cue: "foreign", left: 1150, top: 150 },
            { cue: "professional", left: 1520, top: 240 },
            { cue: "army", left: 1215, top: 380 },
          ].map((q) => (
            <Pop key={q.cue} at={c(q.cue) + 3} style={{ left: q.left, top: q.top }}>
              <span style={{ fontFamily: fonts.display, fontSize: 110, lineHeight: 1, color: colors.red, textShadow: `0 0 30px ${colors.red}` }}>?</span>
            </Pop>
          ))}
          <SeizedStamp at={c("wrong")} text="WRONG" fontSize={190} rotate={-8} style={{ left: 640, top: 320 }} />
        </Scene>
        <Chip at={c("England")} text="ENGLAND" color={colors.green} fontSize={44} origin="center center" style={{ left: 850, top: 250 }} />
        {/* a house with one lit window */}
        <Pop at={c("teenager's")} from="up" style={{ left: 1270, top: 330 }}>
          <svg width={420} height={380} viewBox="0 0 420 380">
            <path d="M 30 170 L 210 40 L 390 170 Z" fill="#1A222B" stroke="#2F3A45" strokeWidth={5} />
            <rect x={60} y={170} width={300} height={190} fill="#141B22" stroke="#2F3A45" strokeWidth={5} />
            <rect x={90} y={270} width={64} height={90} fill="#0B0F13" stroke="#2F3A45" strokeWidth={4} />
            <rect x={228} y={200} width={86} height={70} fill={colors.green} opacity={0.75 + 0.2 * Math.sin(frame / 7)} />
            <rect x={228} y={200} width={86} height={70} fill="none" stroke="#2F3A45" strokeWidth={5} />
            <path d="M 271 200 V 270" stroke="#2F3A45" strokeWidth={4} />
          </svg>
          <div style={{ textAlign: "center", ...mono(30, colors.green), fontWeight: 700, letterSpacing: "0.12em" }}>A TEENAGER'S BEDROOM</div>
        </Pop>
        <Pop at={c("Lapsus") - 6} from="up" style={{ left: 140, top: 560, width: 1000, height: 250, background: "rgba(7,9,11,0.82)", borderRadius: 14 }}>
          <div />
        </Pop>
        <TitleSlam text="LAPSUS$" color={colors.green} fontSize={270} at={c("Lapsus")} style={{ left: 180, right: "auto", top: 560, alignItems: "flex-start" }} />
      </Scene>

      {/* 5: this month */}
      <Scene from={tCourt} to={D}>
        <Pop at={tCourt} from="up" sound="click" style={{ left: 190, top: 150 }}>
          <div style={{ width: 520, borderRadius: 14, overflow: "hidden", border: `3px solid ${colors.line}`, background: colors.panel }}>
            <div style={{ background: colors.red, color: colors.bg, textAlign: "center", padding: "12px 0", ...mono(34, colors.bg), fontWeight: 700, letterSpacing: "0.2em" }}>THIS MONTH</div>
            <div style={{ textAlign: "center", fontFamily: fonts.display, fontSize: 150, lineHeight: 1.05, color: colors.text, padding: "18px 0 0" }}>NOVEMBER</div>
            <div style={{ textAlign: "center", fontFamily: fonts.display, fontSize: 190, lineHeight: 1, color: colors.text, paddingBottom: 20 }}>2026</div>
          </div>
        </Pop>
        <Chip at={c("four")} text="MORE THAN 4 YEARS LATER" fontSize={34} style={{ left: 190, top: 640 }} />
        {/* courtroom door */}
        <div style={{ position: "absolute", left: 1360, top: 130, width: 420, height: 690, opacity: Math.min(1, door * 2), transform: `translateY(${(1 - door) * 40}px)` }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #2A2118, #17120D)", border: "6px solid #4A3A28", borderRadius: "10px 10px 0 0" }} />
          <div style={{ position: "absolute", left: 40, top: 60, width: 150, height: 250, border: "4px solid #4A3A28", borderRadius: 4 }} />
          <div style={{ position: "absolute", right: 40, top: 60, width: 150, height: 250, border: "4px solid #4A3A28", borderRadius: 4 }} />
          <div style={{ position: "absolute", left: 40, top: 350, width: 150, height: 280, border: "4px solid #4A3A28", borderRadius: 4 }} />
          <div style={{ position: "absolute", right: 40, top: 350, width: 150, height: 280, border: "4px solid #4A3A28", borderRadius: 4 }} />
          <div style={{ position: "absolute", left: 206, top: 0, width: 6, height: 690, background: "#120E0A" }} />
          <div style={{ position: "absolute", left: 60, right: 60, top: -74, textAlign: "center", ...mono(30, colors.amber), fontWeight: 700, letterSpacing: "0.3em" }}>COURT</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 730,
            width: 620,
            top: 330,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 190,
            lineHeight: 1,
            color: colors.text,
            letterSpacing: "0.06em",
            opacity: guilty,
            transform: `translateY(${interpolate(guilty, [0, 1], [14, 0])}px)`,
          }}
        >
          "GUILTY."
        </div>
      </Scene>
    </>
  );
};
