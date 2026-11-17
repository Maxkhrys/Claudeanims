import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  Card,
  Cazes,
  Chip,
  MapPins,
  Pop,
  RossBlob,
  Scene,
  Sfx,
  Terminal,
  TitleSlam,
  mono,
} from "../components";
import { useClip } from "./words";

const QUEBEC = { lon: -72.5, lat: 46.3 };
const BANGKOK = { lon: 100.5, lat: 13.7 };

/** Chunky beige-era PC: CRT, tower, keyboard and a nest of wires. */
const OldPC: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 760, top: 250, width: 900, height: 560 }}>
      {/* wires */}
      <svg width={900} height={560} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {[
          "M 300 470 C 200 560 60 470 -40 540",
          "M 640 470 C 760 560 820 440 940 520",
          "M 420 480 C 400 600 620 560 600 640",
          "M 700 300 C 820 320 800 470 900 430",
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={i % 2 ? "#3A444E" : colors.greenDim} strokeWidth={7} strokeLinecap="round" />
        ))}
      </svg>
      {/* CRT */}
      <div style={{ position: "absolute", left: 120, top: 0, width: 460, height: 380, borderRadius: 26, background: "linear-gradient(to bottom, #CFC6B0, #9D957F)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", left: 34, top: 30, right: 34, bottom: 70, borderRadius: 22, background: "#06120B", border: "6px solid #5E5848", overflow: "hidden", boxShadow: `inset 0 0 60px ${colors.green}44` }}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                margin: "14px 18px 0",
                height: 12,
                width: `${30 + ((i * 37 + Math.floor(frame / 8)) % 60)}%`,
                borderRadius: 3,
                background: colors.green,
                opacity: 0.35 + 0.5 * (((i + Math.floor(frame / 8)) % 3) / 2),
              }}
            />
          ))}
        </div>
        <div style={{ position: "absolute", right: 46, bottom: 26, width: 16, height: 16, borderRadius: 8, background: colors.green, boxShadow: `0 0 12px ${colors.green}` }} />
      </div>
      <div style={{ position: "absolute", left: 250, top: 380, width: 200, height: 40, background: "#8B846F" }} />
      {/* tower */}
      <div style={{ position: "absolute", left: 630, top: 60, width: 190, height: 410, borderRadius: 12, background: "linear-gradient(to bottom, #C9C0AA, #8F8872)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
        {[40, 80, 120].map((y) => (
          <div key={y} style={{ position: "absolute", left: 24, right: 24, top: y, height: 22, borderRadius: 4, background: "#6E6857" }} />
        ))}
        <div style={{ position: "absolute", left: 34, bottom: 60, width: 18, height: 18, borderRadius: 9, background: colors.amber, opacity: Math.floor(frame / 5) % 2 ? 1 : 0.3 }} />
      </div>
      {/* keyboard */}
      <div style={{ position: "absolute", left: 100, top: 440, width: 500, height: 56, borderRadius: 10, background: "linear-gradient(to bottom, #C9C0AA, #9D957F)", display: "flex", flexWrap: "wrap", gap: 5, padding: 9 }}>
        {new Array(44).fill(0).map((_, i) => (
          <div key={i} style={{ width: 17, height: 13, borderRadius: 3, background: "#7C7664" }} />
        ))}
      </div>
    </div>
  );
};

export const Clip3: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(3);

  const tKid = c("He was a");
  const tForum = c("And he was");
  const tMove = c("In his");
  const tRoss = c("He'd");

  const zoomIn = sp(frame, fps, c("He grew"), springs.heavy, 70);
  const rossFade = 1 - sp(frame, fps, c("convinced"), springs.smooth, 20);
  const doubt = frame - c("thought");
  const doubtGlitch = doubt >= 0 ? Math.exp(-doubt / 5) : 0;
  const username = sp(frame, fps, c("Alpha", 1), springs.slam);

  return (
    <>
      {/* 1: the real name, and where he came from */}
      <Scene from={0} to={tKid}>
        <div style={{ position: "absolute", left: 130, top: 70, ...mono(40, colors.gold), fontWeight: 700, letterSpacing: "0.14em" }}>
          ALPHA02 <span style={{ color: colors.dim }}>= real name:</span>
        </div>
        <TitleSlam text="ALEXANDRE CAZES" color={colors.text} fontSize={200} at={c("Alexandre")} style={{ left: 124, right: "auto", top: 120, alignItems: "flex-start" }} />
        <Pop at={c("He grew") - 4} from="up" style={{ left: 260, top: 340, width: 1400, height: 520, overflow: "hidden", borderRadius: 14, border: `2px solid ${colors.line}`, background: "rgba(12,17,21,0.7)" }}>
          <MapPins
            width={1400}
            style={{ left: 0, top: -70 }}
            focus={{ lon: -78, lat: 44, zoom: 1 + zoomIn * 1.9 }}
            pins={[{ lon: QUEBEC.lon, lat: QUEBEC.lat, at: c("Trois"), glow: true }]}
          />
        </Pop>
        <Chip at={c("Trois")} text="TROIS-RIVIÈRES" fontSize={44} style={{ left: 300, top: 380 }} />
        <Chip at={c("small")} text="A SMALL CITY" color={colors.text} fontSize={32} style={{ left: 300, top: 480 }} />
        <Chip at={c("Quebec")} text="QUEBEC, CANADA" color={colors.text} fontSize={40} style={{ left: 1210, top: 380 }} />
      </Scene>

      {/* 2: the computer kid */}
      <Scene from={tKid} to={tForum}>
        <OldPC />
        <Pop at={tKid} origin="center bottom" style={{ left: 330, top: 380 }}>
          <Cazes size={420} look={{ x: 0.9, y: 0.2 }} />
        </Pop>
        <Chip at={c("computer")} text="COMPUTER KID" color={colors.green} filled fontSize={46} style={{ left: 130, top: 100 }} />
        <Chip at={c("17")} text="AGE 17" color={colors.text} fontSize={46} style={{ left: 560, top: 100 }} />
        <Chip at={c("web")} text="WEB DESIGN + TECH SUPPORT" fontSize={36} style={{ left: 130, top: 210 }} />
        <Chip at={c("fix")} text="FIXED COMPUTERS" color={colors.text} fontSize={32} style={{ left: 130, top: 300 }} />
        <Chip at={c("viruses")} text="REMOVED VIRUSES" color={colors.red} fontSize={32} style={{ left: 530, top: 300 }} />
      </Scene>

      {/* 3: the forum post */}
      <Scene from={tForum} to={tMove}>
        <Pop at={tForum} from="up" style={{ left: 260, top: 110 }} sound="notify">
          <Card style={{ width: 1400, height: 640, padding: "30px 50px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", ...mono(26, colors.dim), letterSpacing: "0.16em" }}>
              <span>TECH FORUM · HELP &amp; TUTORIALS</span>
              <span>years earlier</span>
            </div>
            <Terminal
              style={{ marginTop: 34 }}
              fontSize={58}
              color={colors.text}
              showCursor={frame < c("Under")}
              lines={[{ text: "How to remove a virus", at: c("active"), durationInFrames: 24 }, { text: "from an image", at: c("active") + 24, durationInFrames: 16 }]}
            />
            <div style={{ borderTop: `2px solid ${colors.line}`, marginTop: 40, paddingTop: 26, ...mono(34, colors.dim), opacity: frame >= c("Under") ? 1 : 0 }}>posted by</div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 230,
                lineHeight: 1,
                color: colors.gold,
                textShadow: `0 0 50px ${colors.gold}66`,
                transform: `scale(${3 - 2 * username})`,
                transformOrigin: "left center",
                opacity: frame >= c("Alpha", 1) ? 1 : 0,
              }}
            >
              ALPHA02
            </div>
          </Card>
        </Pop>
        <Sfx name="slam" at={c("Alpha", 1)} />
        <Chip at={c("Remember")} text="REMEMBER THAT NAME" color={colors.red} filled fontSize={50} origin="center center" style={{ left: 1030, top: 600 }} />
      </Scene>

      {/* 4: Canada to Thailand */}
      <Scene from={tMove} to={tRoss}>
        <MapPins
          width={1640}
          style={{ left: 140, top: 110 }}
          pins={[
            { lon: QUEBEC.lon, lat: QUEBEC.lat, label: "QUEBEC", at: tMove, side: "left" },
            { lon: BANGKOK.lon, lat: BANGKOK.lat, label: "BANGKOK", at: c("Thailand") + 22, side: "right", color: colors.gold, glow: true },
          ]}
          lines={[{ from: [QUEBEC.lon, QUEBEC.lat], to: [BANGKOK.lon, BANGKOK.lat], at: c("moved"), durationInFrames: 44, plane: true }]}
        />
        <Chip at={c("early")} text="EARLY 20s" color={colors.text} fontSize={40} style={{ left: 150, top: 90 }} />
        <Chip at={c("married")} text="MARRIED" color={colors.text} fontSize={36} style={{ left: 150, top: 640 }} />
        <Chip at={c("life")} text="A NEW LIFE IN BANGKOK" color={colors.gold} filled fontSize={40} style={{ left: 400, top: 636 }} />
      </Scene>

      {/* 5: he won't make the same mistakes */}
      <Scene from={tRoss} to={D} exit="glitch">
        <Pop at={tRoss} origin="center bottom" style={{ left: 240, top: 330 }}>
          <Cazes size={420} look={{ x: 0.9, y: 0 }} />
        </Pop>
        <Pop at={c("Ross")} origin="center bottom" style={{ left: 1360, top: 330 }}>
          <div style={{ opacity: 0.4 * rossFade }}>
            <RossBlob size={420} look={{ x: -0.6, y: 0 }} />
          </div>
        </Pop>
        <Chip at={c("watched")} text="WATCHED SILK ROAD FALL" color={colors.green} fontSize={34} origin="center center" style={{ left: 740, top: 420 }} />
        <Chip at={c("exactly")} text="KNEW EXACTLY HOW" color={colors.text} fontSize={34} origin="center center" style={{ left: 790, top: 510 }} />
        <Chip at={c("smarter")} text="&quot;I'M SMARTER&quot;" color={colors.gold} filled fontSize={44} origin="center center" style={{ left: 790, top: 610 }} />
        <TitleSlam text="I WON'T MAKE THE SAME MISTAKES." color={colors.text} fontSize={132} at={c("wouldn't")} extraGlitch={doubtGlitch} style={{ top: 90 }} />
        <Chip at={c("thought")} text="...OR SO HE THOUGHT" color={colors.red} fontSize={40} origin="center center" style={{ left: 740, top: 250 }} sound="error" />
      </Scene>
    </>
  );
};
