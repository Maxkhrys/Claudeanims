import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  BlobCharacter,
  BrandTag,
  CamelLogo,
  Cazes,
  Chip,
  FadeIn,
  MarketLogo,
  Pop,
  RossBlob,
  Scene,
  SeizedStamp,
  TitleSlam,
  White,
  mono,
} from "../components";
import { useClip } from "./words";

/** Megaphone icon. */
const Megaphone: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = colors.amber }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ filter: `drop-shadow(0 0 12px ${color}77)` }}>
    <path d="M3 9.5 V14.5 H6.5 L14 19 V5 L6.5 9.5 Z" fill={color} />
    <path d="M17 9 C18.4 10.6 18.4 13.4 17 15 M19.4 6.6 C22.2 9.6 22.2 14.4 19.4 17.4" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </svg>
);

/** Email address in a glowing tag. */
const EmailTag: React.FC<{ text: string; color: string }> = ({ text, color }) => (
  <div
    style={{
      display: "inline-block",
      padding: "10px 24px",
      background: "#05070A",
      border: `4px solid ${color}`,
      borderRadius: 12,
      ...mono(40, color),
      fontWeight: 700,
      whiteSpace: "nowrap",
      boxShadow: `0 0 50px ${color}66`,
    }}
  >
    {text}
  </div>
);

/** One of the three "how they fell" panels. */
const Fall: React.FC<{
  at: number;
  left: number;
  accent: string;
  head: React.ReactNode;
  who: React.ReactNode;
  reasonAt: number;
  reason: string;
  reasonColor?: string;
}> = ({ at, left, accent, head, who, reasonAt, reason, reasonColor = colors.amber }) => {
  const frame = useCurrentFrame();
  const r = sp(frame, 30, reasonAt, springs.pop);
  return (
    <Pop at={at} from="up" sound="pop" style={{ left, top: 170, width: 560 }}>
      <div
        style={{
          height: 640,
          borderRadius: 14,
          background: "rgba(7,9,11,0.93)",
          border: `3px solid ${accent}`,
          boxShadow: `0 0 60px ${accent}22, 0 24px 50px rgba(0,0,0,0.7)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "28px 20px",
        }}
      >
        <div style={{ height: 110, display: "flex", alignItems: "center" }}>{head}</div>
        <div style={{ height: 300, display: "flex", alignItems: "flex-end" }}>{who}</div>
        <div style={{ ...mono(26, colors.dim), letterSpacing: "0.2em", marginTop: 26 }}>BROUGHT DOWN BY</div>
        <div
          style={{
            marginTop: 8,
            fontFamily: fonts.display,
            fontSize: 84,
            lineHeight: 1,
            color: reasonColor,
            textShadow: `0 0 30px ${reasonColor}55`,
            transform: `scale(${frame >= reasonAt ? r : 0})`,
          }}
        >
          {reason}
        </div>
      </div>
    </Pop>
  );
};

export const Clip23: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(23);

  const tThink = c("Think");
  const tPlaybook = c("And the playbook");
  const tEven = c("Even");

  const drift = frame * 3.2;
  const undone = frame >= c("undone");
  const ROOMS = new Array(10).fill(0).map((_, i) => ({ x: 150 + (i % 5) * 330, y: 300 + Math.floor(i / 5) * 230, at: c("Other") + i * 7 }));

  return (
    <>
      {/* 1: the same lesson, three times */}
      <Scene from={0} to={tThink}>
        {/* the two old email addresses drift past */}
        <div style={{ position: "absolute", left: 1150 - drift, top: 40, opacity: 0.9 }}>
          <EmailTag text="rossulbricht@gmail.com" color={colors.green} />
        </div>
        <div style={{ position: "absolute", left: 1990 - drift, top: 40, opacity: 0.9 }}>
          <EmailTag text="pimp_alex_91@hotmail.com" color={colors.gold} />
        </div>
        <FadeIn at={c("familiar") - 20} out={c("Silk") - 6} durationInFrames={14} style={{ left: 0, right: 0, top: 420, textAlign: "center" }}>
          <span style={{ fontFamily: fonts.display, fontSize: 170, color: colors.text }}>SOUND FAMILIAR?</span>
        </FadeIn>
        <Fall
          at={c("Silk")}
          left={90}
          accent={colors.green}
          head={
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <CamelLogo size={120} />
              <span style={{ fontFamily: fonts.display, fontSize: 70, color: colors.green }}>SILK ROAD</span>
            </div>
          }
          who={<RossBlob size={280} />}
          reasonAt={c("old")}
          reason="AN OLD EMAIL"
        />
        <Fall
          at={c("AlphaBay")}
          left={680}
          accent={colors.gold}
          head={<MarketLogo name="ALPHABAY" mark="alpha" size={62} />}
          who={<Cazes size={280} />}
          reasonAt={c("old", 1)}
          reason="AN OLD EMAIL"
        />
        <Fall
          at={c("And Lapsus")}
          left={1270}
          accent={colors.red}
          head={<span style={{ fontFamily: fonts.display, fontSize: 84, color: colors.text }}>LAPSUS$</span>}
          who={<White size={250} />}
          reasonAt={c("fight")}
          reason="A FEUD"
          reasonColor={colors.red}
        />
      </Scene>

      {/* 2: they beat giants, then bragging undid them */}
      <Scene from={tThink} to={tPlaybook}>
        <div style={{ position: "absolute", left: 130, top: 100, ...mono(36, colors.dim) }}>&gt; think about it. they broke into:</div>
        {(["NVIDIA", "SAMSUNG", "MICROSOFT"] as const).map((n, i) => (
          <React.Fragment key={n}>
            <Pop at={c(n === "NVIDIA" ? "Nvidia" : n === "SAMSUNG" ? "Samsung" : "Microsoft")} from="left" sound="pop" style={{ left: 130, top: 190 + i * 140, opacity: undone ? 0.45 : 1 }}>
              <BrandTag name={n} size={96} />
            </Pop>
            <SeizedStamp at={c(n === "NVIDIA" ? "Nvidia" : n === "SAMSUNG" ? "Samsung" : "Microsoft") + 9} text="BREACHED" fontSize={40} rotate={-6} sound={false} style={{ left: 640, top: 205 + i * 140 }} />
          </React.Fragment>
        ))}
        <TitleSlam text="UNDONE BY" color={colors.red} fontSize={170} at={c("undone")} style={{ left: 960, right: 60, top: 90 }} />
        <Pop at={c("bragging") - 4} origin="center bottom" style={{ left: 1080, top: 330 }}>
          <BlobCharacter color={colors.extras[1]} size={330} seed={8} look={{ x: 0.8, y: -0.3 }} />
          <div style={{ position: "absolute", left: 250, top: 70, transform: `rotate(${-10 + Math.sin(frame / 5) * 5}deg)` }}>
            <Megaphone size={170} />
          </div>
        </Pop>
        <Chip at={c("public")} text="BRAGGING IN A PUBLIC CHAT ROOM" fontSize={34} origin="center center" style={{ left: 1010, top: 680 }} />
        <Chip at={c("enemies")} text="MAKING ENEMIES ON A FORUM" color={colors.red} fontSize={34} origin="center center" style={{ left: 1060, top: 770 }} />
      </Scene>

      {/* 3: the playbook lived on */}
      <Scene from={tPlaybook} to={tEven}>
        <TitleSlam text="THE PLAYBOOK LIVED ON" color={colors.amber} fontSize={150} at={c("playbook")} style={{ top: 70 }} />
        {ROOMS.map((r, i) => {
          const on = sp(frame, fps, r.at, springs.pop);
          if (frame < r.at) return null;
          const live = 0.6 + 0.4 * Math.sin(frame / 6 + i);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: r.x,
                top: r.y,
                width: 290,
                height: 190,
                borderRadius: 12,
                background: colors.panel,
                border: `2px solid ${colors.green}`,
                boxShadow: `0 0 ${40 * live}px rgba(57,255,136,0.25)`,
                padding: 18,
                transform: `scale(${on})`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: colors.green, opacity: live }} />
                <div style={{ ...mono(22, colors.dim) }}>new crew</div>
              </div>
              {/* handles are blurred bars: no real group is named */}
              {[0, 1, 2].map((k) => (
                <div key={k} style={{ display: "flex", gap: 10, marginTop: 16, alignItems: "center" }}>
                  <div style={{ width: 60 + random(`h-${i}-${k}`) * 50, height: 16, borderRadius: 4, background: colors.green, opacity: 0.55, filter: "blur(3px)" }} />
                  <div style={{ width: 70 + random(`m-${i}-${k}`) * 70, height: 12, borderRadius: 4, background: colors.line }} />
                </div>
              ))}
            </div>
          );
        })}
        <Chip at={c("phone")} text="THE PHONE CALLS" color={colors.text} filled fontSize={38} origin="center center" style={{ left: 190, top: 770 }} />
        <Chip at={c("fake")} text="THE FAKE TECH SUPPORT" color={colors.text} filled fontSize={38} origin="center center" style={{ left: 680, top: 770 }} />
        <Chip at={c("flood")} text="THE FLOOD OF PROMPTS" color={colors.text} filled fontSize={38} origin="center center" style={{ left: 1290, top: 770 }} />
      </Scene>

      {/* 4: the second teenager (never named) */}
      <Scene from={tEven} to={D}>
        <Pop at={tEven} origin="center bottom" style={{ left: 300, top: 250 }}>
          <BlobCharacter color={colors.extras[2]} size={440} seed={9} look={{ x: 0.6, y: 0 }} />
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <span style={{ display: "inline-block", width: 260, height: 40, borderRadius: 6, background: colors.text, filter: "blur(7px)", opacity: 0.8 }} />
          </div>
        </Pop>
        <Chip at={c("second")} text="THE SECOND TEENAGER FROM THE TRIAL" color={colors.text} fontSize={36} style={{ left: 820, top: 200 }} />
        <FadeIn at={c("back") - 4} durationInFrames={14} style={{ left: 820, top: 300 }}>
          <span style={{ ...mono(44, colors.amber), fontWeight: 700 }}>went back to it.</span>
        </FadeIn>
        <Pop at={c("five") - 6} from="up" sound="stamp" style={{ left: 820, top: 410 }}>
          <div style={{ padding: "26px 40px 30px", borderRadius: 14, background: "rgba(7,9,11,0.93)", border: `3px solid ${colors.red}`, boxShadow: "0 0 60px rgba(255,59,59,0.25)" }}>
            <div style={{ ...mono(30, colors.dim), letterSpacing: "0.2em" }}>LATER SENTENCE</div>
            <div style={{ fontFamily: fonts.display, fontSize: 150, lineHeight: 1, color: colors.red, marginTop: 6 }}>5 YEARS 6 MONTHS</div>
          </div>
        </Pop>
        <Chip at={c("new")} text="FOR NEW CYBERCRIMES" color={colors.red} fontSize={36} style={{ left: 820, top: 700 }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, background: colors.bg, opacity: interpolate(frame, [D - 10, D - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
      </Scene>
    </>
  );
};
