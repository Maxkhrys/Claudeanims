import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, Card, Chip, Cop, Counter, Dpr, MapPins, Pop, Scene, Sfx, TitleSlam, mono } from "../components";
import { useClip } from "./words";

/** Megaphone icon. */
const Megaphone: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = colors.amber }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: `drop-shadow(0 0 12px ${color}77)` }}>
    <path d="M 14 40 H 34 L 72 18 V 82 L 34 60 H 14 Z" fill={color} />
    <path d="M 24 60 L 30 86 H 42 L 38 62" fill={color} opacity={0.8} />
    <path d="M 80 34 Q 92 50 80 66" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
    <path d="M 88 24 Q 108 50 88 76" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" opacity={0.6} />
  </svg>
);

/** One post in the public channel. */
const Post: React.FC<{ at: number; children: React.ReactNode; shot?: boolean }> = ({ at, children, shot }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = sp(frame, 30, at, springs.snappy);
  return (
    <div style={{ display: "flex", gap: 18, marginBottom: 18, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * 30}px)` }}>
      <Sfx name="pop" at={at} volume={0.7} />
      <div style={{ width: 54, height: 54, borderRadius: 27, background: colors.amber, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Megaphone size={34} color={colors.bg} />
      </div>
      <div style={{ flex: 1, padding: "14px 20px", borderRadius: "4px 14px 14px 14px", background: colors.panelLight, border: `2px solid ${colors.line}` }}>
        {shot ? (
          <div style={{ height: 150, borderRadius: 6, marginBottom: 12, background: "linear-gradient(135deg, #1B242C, #10161B)", border: `1px solid ${colors.line}`, padding: 12 }}>
            <div style={{ height: 14, width: "40%", background: colors.greenDim, borderRadius: 3 }} />
            {[70, 55, 80, 45].map((w, i) => (
              <div key={i} style={{ height: 10, width: `${w}%`, background: colors.line, borderRadius: 3, marginTop: 12 }} />
            ))}
            <div style={{ ...mono(18, colors.red), marginTop: 10, fontWeight: 700 }}>INTERNAL · ADMIN VIEW</div>
          </div>
        ) : null}
        <div style={{ ...mono(30), lineHeight: 1.35 }}>{children}</div>
      </div>
    </div>
  );
};

const PINS: [number, number][] = [
  [-46, -23],
  [-74, 41],
  [13, 52],
  [78, 22],
];

export const Clip7: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(7);

  const tPublic = c("And they did");
  const tCompare = c("Most hackers");
  const tJoin = c("And they got");

  const viewers = sp(frame, fps, c("whole"), springs.smooth, 40);
  const megaWave = Math.sin(frame / 4);

  return (
    <>
      {/* 1: new friends, a crew, a name */}
      <Scene from={0} to={tPublic}>
        <MapPins
          width={1500}
          style={{ left: 210, top: 120 }}
          pins={[
            { lon: -1.3, lat: 51.75, label: "WHITE", at: c("White"), color: colors.text, side: "top" },
            ...PINS.map(([lon, lat], i) => ({ lon, lat, at: c("crew") + i * 8, color: colors.green })),
          ]}
          lines={PINS.map(([lon, lat], i) => ({
            from: [-1.3, 51.75] as [number, number],
            to: [lon, lat] as [number, number],
            at: c("found") + i * 7,
            durationInFrames: 26,
            color: colors.green,
          }))}
        />
        <Chip at={c("loose")} text="A LOOSE CREW OF YOUNG HACKERS" color={colors.green} style={{ left: 150, top: 80 }} />
        <Chip at={c("online")} text="THEY MET ONLINE" color={colors.text} fontSize={28} style={{ left: 150, top: 160 }} />
        <Pop at={c("Lapsus") - 4} style={{ left: 0, right: 0, top: 300, height: 400, background: "rgba(7,9,11,0.9)", borderTop: `2px solid ${colors.amber}`, borderBottom: `2px solid ${colors.amber}` }}>
          <div />
        </Pop>
        <Pop at={c("name")} from="up" style={{ left: 0, right: 0, top: 322, textAlign: "center" }}>
          <span style={{ ...mono(34, colors.dim), letterSpacing: "0.2em" }}>THEY GAVE THEMSELVES A NAME</span>
        </Pop>
        <TitleSlam text="LAPSUS" color={colors.amber} fontSize={360} at={c("Lapsus")} style={{ top: 360 }} />
      </Scene>

      {/* 2: they went public */}
      <Scene from={tPublic} to={tCompare}>
        <Chip at={c("something")} text="ALMOST NO CRIMINAL GROUP DOES THIS" color={colors.text} fontSize={26} origin="center center" style={{ left: 1215, top: 44 }} />
        <Pop at={tPublic + 4} from="up" style={{ left: 120, top: 70 }}>
          <Card accent={colors.amber} style={{ width: 1040, height: 790, padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 28px", background: "#090D10", borderBottom: `2px solid ${colors.line}` }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: colors.amber, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Megaphone size={46} color={colors.bg} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fonts.display, fontSize: 64, lineHeight: 1, color: colors.amber }}>LAPSUS</div>
                <div style={{ ...mono(24, colors.dim) }}>public channel · anyone can join</div>
              </div>
              <div style={{ textAlign: "right" }}>
                {frame >= c("opened") ? <Counter to={30000} suffix="+" at={c("opened")} durationInFrames={tCompare - c("opened") - 10} fontSize={54} color={colors.text} sound={false} /> : null}
                <div style={{ ...mono(20, colors.dim), letterSpacing: "0.16em" }}>WATCHING</div>
              </div>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <Post at={c("posted")} shot>
                screenshots from <b style={{ color: colors.red }}>inside</b> their victims' systems
              </Post>
              <Post at={c("taunted")}>
                hello <b style={{ color: colors.amber }}>[COMPANY]</b>. you might want to check your servers :)
              </Post>
              <Post at={c("joked")}>who next?</Post>
            </div>
          </Card>
        </Pop>
        <TitleSlam text="THEY WENT" fontSize={150} at={c("public") - 6} style={{ left: 1210, right: 20, top: 120 }} />
        <TitleSlam text="PUBLIC" color={colors.amber} fontSize={230} at={c("public")} style={{ left: 1210, right: 20, top: 250 }} />
        <Chip at={c("invited")} text="THE WHOLE WORLD: INVITED" fontSize={28} origin="center center" style={{ left: 1280, top: 490 }} />
        {/* the audience arrives */}
        <div style={{ position: "absolute", left: 1230, top: 580, width: 620, display: "flex", flexWrap: "wrap", gap: 10 }}>
          {new Array(40).fill(0).map((_, i) => {
            const on = viewers * 44 > i + random(`v7-${i}`) * 4;
            return (
              <svg key={i} width={52} height={52} viewBox="0 0 34 34" style={{ opacity: on ? 0.9 : 0, transform: `scale(${on ? 1 : 0.4})` }}>
                <circle cx={17} cy={11} r={6.5} fill={i % 7 === 0 ? colors.amber : colors.green} />
                <path d="M 4 32 C 4 21 10 19 17 19 C 24 19 30 21 30 32 Z" fill={i % 7 === 0 ? colors.amber : colors.green} />
              </svg>
            );
          })}
        </div>
      </Scene>

      {/* 3: most hackers hide. Lapsus wanted an audience. */}
      <Scene from={tCompare} to={tJoin}>
        <div style={{ position: "absolute", left: 958, top: 100, width: 4, height: 740, background: colors.line }} />
        <Pop at={tCompare} from="left" style={{ left: 130, top: 110, width: 760 }}>
          <div style={{ fontFamily: fonts.display, fontSize: 120, lineHeight: 1, color: colors.dim }}>MOST HACKERS</div>
          <div style={{ height: 6, background: colors.dim, marginTop: 8 }} />
        </Pop>
        <Pop at={tCompare + 4} origin="center bottom" style={{ left: 330, top: 300 }}>
          <div style={{ opacity: 0.55 }}>
            <Dpr size={420} lightAmount={0.25} />
          </div>
        </Pop>
        <Chip at={c("silence")} text="WORK IN SILENCE" color={colors.dim} fontSize={34} origin="center center" style={{ left: 330, top: 760 }} />
        <Pop at={c("Lapsus", 1) - 4} from="right" style={{ left: 1030, top: 110, width: 760 }}>
          <div style={{ fontFamily: fonts.display, fontSize: 120, lineHeight: 1, color: colors.amber, textShadow: `0 0 34px ${colors.amber}55` }}>LAPSUS</div>
          <div style={{ height: 6, background: colors.amber, marginTop: 8 }} />
        </Pop>
        <Pop at={c("Lapsus", 1)} origin="center bottom" style={{ left: 1130, top: 300 }}>
          <BlobCharacter color={colors.extras[1]} size={420} seed={21} look={{ x: 0.8, y: 0 }} />
        </Pop>
        <Pop at={c("wanted")} style={{ left: 1460, top: 360 + megaWave * 6 }}>
          <div style={{ transform: `rotate(${-8 + megaWave * 3}deg)` }}>
            <Megaphone size={230} />
          </div>
        </Pop>
        <Chip at={c("audience")} text="WANTED AN AUDIENCE" color={colors.amber} filled fontSize={38} origin="center center" style={{ left: 1150, top: 760 }} />
      </Scene>

      {/* 4: and they got one */}
      <Scene from={tJoin} to={D}>
        <Pop at={tJoin} from="up" style={{ left: 0, right: 0, top: 80, textAlign: "center" }}>
          <span style={{ fontFamily: fonts.display, fontSize: 130, color: colors.text }}>AND THEY GOT ONE</span>
        </Pop>
        <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", ...mono(30, colors.dim), letterSpacing: "0.2em" }}>
          NEW MEMBERS JOINING THE CHANNEL
        </div>
        {[
          { at: c("Reporters"), label: "REPORTERS", color: colors.extras[0], x: 380 },
          { at: c("security"), label: "SECURITY RESEARCHERS", color: colors.extras[2], x: 960 },
        ].map((m) => (
          <Pop key={m.label} at={m.at} origin="center bottom" style={{ left: m.x - 150, top: 330, width: 300, textAlign: "center" }} sound="pop">
            <BlobCharacter color={m.color} size={330} seed={m.x} />
            <div style={{ ...mono(28, colors.bg), fontWeight: 700, background: m.color, padding: "6px 14px", borderRadius: 6, display: "inline-block", marginTop: 10, whiteSpace: "nowrap" }}>{m.label}</div>
          </Pop>
        ))}
        {/* the police slip in quietly */}
        <div
          style={{
            position: "absolute",
            left: interpolate(sp(frame, fps, c("quietly"), springs.heavy, 40), [0, 1], [1980, 1390]),
            top: 330,
            width: 300,
            textAlign: "center",
            opacity: frame >= c("quietly") ? 1 : 0,
          }}
        >
          <Cop size={330} look={{ x: -0.9, y: 0 }} />
          <div style={{ ...mono(28, colors.text), fontWeight: 700, background: colors.police, padding: "6px 14px", borderRadius: 6, display: "inline-block", marginTop: 10, opacity: frame >= c("police") ? 1 : 0 }}>
            THE POLICE
          </div>
        </div>
        <Chip at={c("quietly")} text="...QUIETLY" color={colors.dim} fontSize={30} sound={false} style={{ left: 1420, top: 270 }} />
      </Scene>
    </>
  );
};
