import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  AvatarBadge,
  ChatWindow,
  Chip,
  Flash,
  HOTEL_TV,
  HotelRoom,
  Pop,
  Scene,
  Sfx,
  Terminal,
  TitleSlam,
  White,
  mono,
} from "../components";
import { useClip } from "./words";

/** Labelled object card that sits on the bed. */
const ItemCard: React.FC<{ at: number; left: number; label: string; note?: string; color?: string; children: React.ReactNode }> = ({
  at,
  left,
  label,
  note,
  color = colors.amber,
  children,
}) => (
  <Pop at={at} from="up" sound="pop" style={{ left, top: 360, width: 300 }}>
    <div
      style={{
        height: 250,
        borderRadius: 14,
        background: "rgba(7,9,11,0.9)",
        border: `3px solid ${color}`,
        boxShadow: `0 0 50px ${color}33, 0 24px 50px rgba(0,0,0,0.7)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
      }}
    >
      <div style={{ height: 96, display: "flex", alignItems: "center" }}>{children}</div>
      <div style={{ ...mono(32, color), fontWeight: 700, letterSpacing: "0.08em" }}>{label}</div>
      {note ? <div style={{ ...mono(22, colors.dim) }}>{note}</div> : null}
    </div>
  </Pop>
);

/** What shows on the hotel TV: a company chat. */
const TvChat: React.FC<{ typingAt: number }> = ({ typingAt }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0B1512", fontFamily: fonts.mono, color: colors.text, padding: 26 }}>
      <div style={{ fontSize: 26, color: colors.amber, fontWeight: 700, letterSpacing: "0.1em" }}>COMPANY CHAT · #all-staff</div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ display: "flex", gap: 14, marginTop: 26, alignItems: "center", opacity: 0.55 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: colors.line }} />
          <div>
            <div style={{ width: 150 + i * 40, height: 12, background: colors.line, borderRadius: 3 }} />
            <div style={{ width: 380 - i * 70, height: 12, background: colors.line, borderRadius: 3, marginTop: 8, opacity: 0.7 }} />
          </div>
        </div>
      ))}
      {frame >= typingAt ? (
        <div style={{ display: "flex", gap: 14, marginTop: 30, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: colors.red }} />
          <div style={{ fontSize: 26, color: colors.red, fontWeight: 700 }}>
            new user is typing{".".repeat(1 + (Math.floor(frame / 8) % 3))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const Clip1: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(1);

  const tItems = c("So he uses");
  const tBreak = c("With that");
  const tMsg = c("I am not");
  const tOut = c("And this");

  const tvOn = sp(frame, fps, c("television"), springs.snappy);
  const stick = frame >= c("fire");
  const push = sp(frame, fps, tBreak, springs.heavy, tMsg - tBreak);
  const tvCx = HOTEL_TV.left + HOTEL_TV.width / 2;
  const tvCy = HOTEL_TV.top + HOTEL_TV.height / 2;
  const dimForItems = frame >= tItems && frame < tBreak ? sp(frame, fps, tItems, springs.smooth, 12) : 0;

  return (
    <>
      {/* the hotel room: on screen from the start until the message */}
      <Scene from={0} to={tMsg} exit="cut">
        <AbsoluteFill style={{ transform: `scale(${1 + push * 0.75})`, transformOrigin: `${tvCx}px ${tvCy}px` }}>
          <HotelRoom tvOn={tvOn} stick={stick} screen={<TvChat typingAt={c("leaves")} />}>
            {/* the boy, sitting on the bed */}
            <Pop at={c("17-year-old") - 6} origin="center bottom" style={{ left: 300, top: 470 }}>
              <White size={250} look={{ x: 0.7, y: -0.2 }} />
            </Pop>
          </HotelRoom>
        </AbsoluteFill>

        {/* opening: date, place, the rules */}
        <Scene from={0} to={tItems}>
          <Terminal
            style={{ position: "absolute", left: 110, top: 50, background: "rgba(7,9,11,0.82)", padding: "12px 20px", borderRadius: 8 }}
            fontSize={56}
            lines={[
              { text: "SEPTEMBER 2022", at: c("September"), durationInFrames: 22 },
              { text: "a budget hotel, england", prompt: "> ", at: c("budget"), durationInFrames: 28, size: 0.55, color: colors.text },
            ]}
          />
          <Chip at={c("police")} text="UNDER POLICE PROTECTION" color={colors.agent} fontSize={28} origin="center center" style={{ left: 190, top: 400 }} />
          <Chip at={c("bail")} text="BAIL: ACTIVE" color={colors.amber} fontSize={40} style={{ left: 1010, top: 610 }} />
          <Chip at={c("laptop")} text="LAPTOP: CONFISCATED" color={colors.red} fontSize={40} style={{ left: 1010, top: 692 }} />
          <Chip at={c("banned")} text="SMARTPHONE: BANNED" color={colors.red} fontSize={40} style={{ left: 1010, top: 774 }} />
        </Scene>

        {/* what he can get */}
        <Scene from={tItems} to={tBreak}>
          <AbsoluteFill style={{ background: "rgba(7,9,11,0.55)", opacity: dimForItems }} />
          <div style={{ position: "absolute", left: 110, top: 250, ...mono(38, colors.text), opacity: dimForItems }}>&gt; so he uses what he can get:</div>
          <ItemCard at={c("fire")} left={110} label="FIRE STICK">
            <div style={{ width: 150, height: 44, borderRadius: 10, background: "#1A2027", border: "3px solid #4A5866", position: "relative" }}>
              <div style={{ position: "absolute", right: 16, top: 13, width: 14, height: 14, borderRadius: 7, background: colors.amber, boxShadow: `0 0 16px ${colors.amber}` }} />
              <div style={{ position: "absolute", left: -26, top: 12, width: 26, height: 16, background: "#4A5866", borderRadius: "4px 0 0 4px" }} />
            </div>
          </ItemCard>
          <ItemCard at={c("television")} left={440} label="HOTEL TV">
            <div style={{ width: 150, height: 90, borderRadius: 8, background: "#0A1210", border: "4px solid #4A5866", boxShadow: `0 0 30px ${colors.green}55` }} />
          </ItemCard>
          <ItemCard at={c("phone")} left={770} label="A PHONE" note="not allowed" color={colors.red}>
            <div style={{ width: 52, height: 96, borderRadius: 10, background: "#0B0F13", border: "4px solid #4A5866", position: "relative" }}>
              <div style={{ position: "absolute", left: 8, right: 8, top: 10, bottom: 16, background: colors.panelLight, borderRadius: 3 }} />
            </div>
          </ItemCard>
        </Scene>

        {/* the break-in, seen on the TV */}
        <Scene from={tBreak} to={tMsg} exit="cut">
          <Chip at={c("studio")} text="TARGET: A GAME STUDIO" color={colors.amber} fontSize={36} style={{ left: 110, top: 110 }} />
          <Chip at={c("anticipated")} text="THE MOST ANTICIPATED GAME IN HISTORY" color={colors.text} fontSize={34} style={{ left: 110, top: 196 }} />
          <Chip at={c("every")} text="TO: EVERY EMPLOYEE" color={colors.red} filled fontSize={36} style={{ left: 110, top: 760 }} />
        </Scene>
        <Sfx name="riser" at={tMsg - 46} volume={0.7} />
      </Scene>

      {/* the message */}
      <Scene from={tMsg} to={tOut} exit="cut">
        <ChatWindow
          style={{ position: "absolute", left: 160, top: 150 }}
          width={1600}
          enterAt={tMsg}
          fontSize={62}
          title="company chat :: #all-staff"
          sender={{ name: "unknown user", color: colors.red, avatar: <AvatarBadge icon="unknown" size={104} /> }}
          recipient="all Rockstar staff"
          timestamp="SEPT 2022"
          minBodyHeight={330}
          messages={[
            { at: tMsg + 3, cps: 16, text: "I am not a Rockstar employee," },
            { at: c("I am an"), cps: 20, text: "I am an attacker." },
          ]}
        />
        <Flash at={c("attacker")} peak={0.4} />
      </Scene>

      {/* cut to black */}
      <Scene from={tOut} to={D} exit="glitch">
        <TitleSlam text="AND THIS WASN'T EVEN" fontSize={170} at={c("wasn't")} style={{ top: 240 }} />
        <TitleSlam text="HIS BIGGEST HACK." color={colors.red} fontSize={260} at={c("biggest", 1)} style={{ top: 450 }} />
      </Scene>
    </>
  );
};
