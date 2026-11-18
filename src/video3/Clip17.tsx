import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  AvatarBadge,
  BrandTag,
  Card,
  ChatWindow,
  Chip,
  Counter,
  DecodeText,
  Flash,
  HOTEL_TV,
  HotelRoom,
  IconFlood,
  Pop,
  Scene,
  Sfx,
  TitleSlam,
  White,
  mono,
} from "../components";
import { useClip } from "./words";

/** What the hotel TV shows before the message: the studio's internal chat. */
const TvScreen: React.FC<{ rockstarAt: number }> = ({ rockstarAt }) => {
  const frame = useCurrentFrame();
  const inside = frame >= rockstarAt;
  return (
    <div style={{ position: "absolute", inset: 0, background: inside ? "#0E0C07" : "#0B1512", fontFamily: fonts.mono, color: colors.text, padding: 26 }}>
      {inside ? (
        <>
          <BrandTag name="ROCKSTAR" size={64} />
          <div style={{ fontSize: 24, color: colors.amber, fontWeight: 700, letterSpacing: "0.1em", marginTop: 14 }}>INTERNAL CHAT · #all-staff</div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginTop: 22, alignItems: "center", opacity: 0.55 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: colors.line }} />
              <div>
                <div style={{ width: 150 + i * 40, height: 11, background: colors.line, borderRadius: 3 }} />
                <div style={{ width: 380 - i * 70, height: 11, background: colors.line, borderRadius: 3, marginTop: 8, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </>
      ) : (
        <div style={{ fontSize: 30, color: colors.green }}>
          &gt; connecting{".".repeat(1 + (Math.floor(frame / 8) % 3))}
        </div>
      )}
    </div>
  );
};

/** Clock whose hands turn while nobody answers. */
const Clock: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  return (
    <svg width={300} height={300} viewBox="-110 -110 220 220">
      <circle r={100} fill={colors.panel} stroke={colors.text} strokeWidth={6} />
      {new Array(12).fill(0).map((_, i) => (
        <line key={i} x1={0} y1={-88} x2={0} y2={-76} stroke={colors.dim} strokeWidth={4} transform={`rotate(${i * 30})`} />
      ))}
      <line x1={0} y1={0} x2={0} y2={-52} stroke={colors.text} strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 1.5})`} />
      <line x1={0} y1={0} x2={0} y2={-78} stroke={colors.red} strokeWidth={5} strokeLinecap="round" transform={`rotate(${t * 18})`} />
      <circle r={7} fill={colors.text} />
    </svg>
  );
};

const THUMBS = 90;

export const Clip17: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(17);

  const tMsg = c("He sent");
  const tDeal = c("Rockstar didn't");
  const tForum = c("So");
  const tConfirm = c("Rockstar confirmed");
  const tFirst = c("I am not");
  const tDrop = c("90");

  const push = sp(frame, fps, tMsg - 70, springs.heavy, 70);
  const tvCx = HOTEL_TV.left + HOTEL_TV.width / 2;
  const tvCy = HOTEL_TV.top + HOTEL_TV.height / 2;
  const world = sp(frame, fps, c("seen"), springs.smooth, 20);

  return (
    <>
      {/* 1: the hotel room */}
      <Scene from={0} to={tMsg} exit="cut">
        <AbsoluteFill style={{ transform: `scale(${1 + push * 0.7})`, transformOrigin: `${tvCx}px ${tvCy}px` }}>
          <HotelRoom tvOn={1} stick glow={frame >= c("Rockstar") ? colors.amber : colors.green} screen={<TvScreen rockstarAt={c("Rockstar")} />}>
            <div style={{ position: "absolute", left: 300, top: 470 }}>
              <White size={250} look={{ x: 0.8, y: -0.2 }} />
            </div>
            {/* phone and small keyboard on the bed */}
            <div style={{ position: "absolute", left: 540, top: 716, width: 34, height: 62, borderRadius: 7, background: "#0B0F13", border: "3px solid #4A5866", transform: "rotate(-14deg)" }}>
              <div style={{ position: "absolute", inset: "6px 5px 9px", background: colors.green, opacity: 0.5, borderRadius: 2 }} />
            </div>
            <div style={{ position: "absolute", left: 150, top: 738, width: 130, height: 36, borderRadius: 6, background: "#141A20", border: "3px solid #4A5866", transform: "rotate(6deg)" }} />
          </HotelRoom>
        </AbsoluteFill>
        <Scene from={0} to={tMsg - 60}>
          <Chip at={c("fire")} text="FIRE STICK" fontSize={34} style={{ left: 1500, top: 620 }} />
          <Chip at={c("television")} text="HOTEL TV" fontSize={34} style={{ left: 1010, top: 80 }} />
          <Chip at={c("phone")} text="A PHONE" color={colors.red} fontSize={34} style={{ left: 600, top: 630 }} />
          <Chip at={c("internal")} text="INSIDE THE INTERNAL CHAT" color={colors.amber} filled fontSize={36} style={{ left: 110, top: 80 }} />
          <Chip at={c("studio")} text="THE STUDIO BEHIND GRAND THEFT AUTO" color={colors.text} fontSize={30} style={{ left: 110, top: 170 }} />
        </Scene>
        <Sfx name="riser" at={tMsg - 46} volume={0.7} />
      </Scene>

      {/* 2: the message (echoes clip 1) and the threat */}
      <Scene from={tMsg} to={tDeal} exit="cut">
        <ChatWindow
          style={{ position: "absolute", left: 160, top: 40 }}
          width={1600}
          enterAt={tMsg}
          fontSize={50}
          title="rockstar :: company chat :: #all-staff"
          sender={{ name: "unknown user", color: colors.red, avatar: <AvatarBadge icon="unknown" size={104} /> }}
          recipient="every Rockstar employee"
          timestamp="SEPT 2022"
          minBodyHeight={440}
          messages={[
            { typingFrom: tMsg + 8, at: tFirst, cps: 17, text: "I am not a Rockstar employee," },
            { at: c("I am an"), cps: 22, text: "I am an attacker." },
            { at: c("threatened"), cps: 16, label: "PARAPHRASED", text: "Contact me, or the game's source code gets released." },
          ]}
        />
        <Flash at={c("attacker")} peak={0.4} />
      </Scene>

      {/* 3: no reply */}
      <Scene from={tDeal} to={tForum}>
        <div style={{ position: "absolute", left: 300, top: 200, transform: "scale(1.5)", transformOrigin: "0 0" }}>
          <Clock at={tDeal} />
        </div>
        <Sfx name="tick" at={tDeal} durationInFrames={tForum - tDeal} loop volume={0.5} />
        <div style={{ position: "absolute", left: 860, top: 250, ...mono(54, colors.dim) }}>
          reply from Rockstar:
          <span style={{ color: colors.text, opacity: Math.floor(frame / 8) % 2 ? 0.2 : 1 }}> ...</span>
        </div>
        <TitleSlam text="NO DEAL." color={colors.red} fontSize={300} at={c("deal")} style={{ left: 850, right: "auto", top: 360, alignItems: "flex-start" }} />
      </Scene>

      {/* 4: the forum post */}
      <Scene from={tForum} to={tConfirm}>
        <Pop at={tForum} from="up" style={{ left: 110, top: 50 }}>
          <Card style={{ width: 1700, height: 800, padding: "24px 34px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span style={{ ...mono(26, colors.dim), letterSpacing: "0.16em" }}>FAN FORUM · NEW POST BY</span>
              <span style={{ fontFamily: fonts.display, fontSize: 84, lineHeight: 1, color: colors.amber }}>
                <DecodeText text="teapotuberhacker" at={c("Teapot")} durationInFrames={24} />
              </span>
              <div style={{ flex: 1 }} />
              {frame >= tDrop ? <Counter to={THUMBS} suffix=" CLIPS" at={tDrop} durationInFrames={c("forum") - tDrop} fontSize={84} color={colors.red} /> : null}
            </div>
            <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(15, 1fr)", gap: 10 }}>
              {new Array(THUMBS).fill(0).map((_, i) => {
                const at = tDrop + i * ((c("forum") - tDrop) / THUMBS);
                const p = sp(frame, fps, at, springs.pop);
                return (
                  <div
                    key={i}
                    style={{
                      height: 92,
                      borderRadius: 6,
                      background: `linear-gradient(135deg, hsl(${20 + random(`th-${i}`) * 40}, 35%, ${14 + random(`tl-${i}`) * 14}%), #10151A)`,
                      border: `2px solid ${colors.line}`,
                      transform: `scale(${p})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ width: 0, height: 0, borderLeft: `14px solid ${colors.text}`, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", opacity: 0.6 }} />
                  </div>
                );
              })}
            </div>
          </Card>
        </Pop>
        <Chip at={c("unfinished")} text="THE UNFINISHED GAME" color={colors.text} filled fontSize={40} origin="center center" style={{ left: 700, top: 770 }} />
      </Scene>

      {/* 5: confirmed, and seen by everyone */}
      <Scene from={tConfirm} to={D} exit="glitch">
        <div style={{ position: "absolute", inset: 0, opacity: world * 0.55 }}>
          <IconFlood at={c("seen")} spread={40} seed="world" />
        </div>
        <Pop at={tConfirm} from="up" style={{ left: 310, top: 120 }}>
          <Card accent={colors.amber} style={{ width: 1300, padding: "30px 44px 36px", textAlign: "center", background: "rgba(7,9,11,0.95)" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <BrandTag name="ROCKSTAR" size={70} />
            </div>
            <div style={{ ...mono(26, colors.dim), letterSpacing: "0.2em", marginTop: 14 }}>OFFICIAL STATEMENT</div>
            <div style={{ height: 190 }} />
          </Card>
        </Pop>
        <TitleSlam text={'"A NETWORK INTRUSION"'} color={colors.text} fontSize={130} at={c("confirmed")} style={{ top: 300 }} />
        <Chip at={c("Years")} text="YEARS OF SECRET WORK" fontSize={40} origin="center center" style={{ left: 250, top: 560 }} />
        <Chip at={c("entire")} text="SEEN BY THE ENTIRE WORLD" color={colors.red} filled fontSize={40} origin="center center" style={{ left: 1010, top: 560 }} />
        <Chip at={c("roughest")} text="IN ITS ROUGHEST, MOST UNFINISHED FORM" color={colors.text} fontSize={34} origin="center center" style={{ left: 560, top: 690 }} />
      </Scene>
    </>
  );
};
