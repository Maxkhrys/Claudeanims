import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  AvatarBadge,
  BlobCharacter,
  BrandTag,
  Card,
  ChatWindow,
  Chip,
  Flash,
  HOTEL_TV,
  HotelRoom,
  PhoneBuzz,
  Pop,
  Scene,
  SeizedStamp,
  Sfx,
  Terminal,
  White,
  mono,
} from "../components";
import { useClip } from "./words";

const SYSTEMS = ["EMAIL", "CLOUD", "CODE", "FINANCE", "ADMIN"];

/** Row of internal systems that light up as the attacker walks through. */
const Hallway: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig30();
  const open = sp(frame, fps, at, springs.snappy);
  if (frame < at - 2) return null;
  return (
    <div style={{ position: "absolute", left: 110, top: 610, width: 1700, height: 220 }}>
      {/* the door */}
      <div style={{ position: "absolute", left: 0, top: 10, width: 150, height: 200, border: `4px solid ${colors.green}`, borderRadius: 6, background: "rgba(57,255,136,0.08)", perspective: 600 }}>
        <div style={{ position: "absolute", inset: 0, background: "#1B242C", border: "3px solid #33404C", transformOrigin: "left center", transform: `rotateY(${-open * 78}deg)` }}>
          <div style={{ position: "absolute", right: 16, top: 96, width: 14, height: 14, borderRadius: 7, background: colors.amber }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 170, top: 106, width: 1530, height: 6, background: colors.line }} />
      {SYSTEMS.map((s, i) => {
        const on = sp(frame, fps, at + 10 + i * 9, springs.pop);
        const lit = frame >= at + 10 + i * 9;
        return (
          <div
            key={s}
            style={{
              position: "absolute",
              left: 230 + i * 300,
              top: 40,
              width: 240,
              height: 140,
              borderRadius: 10,
              border: `3px solid ${lit ? colors.green : colors.line}`,
              background: lit ? "rgba(57,255,136,0.12)" : colors.panel,
              boxShadow: lit ? `0 0 40px ${colors.green}44` : "none",
              transform: `scale(${lit ? 1 + 0.1 * (1 - on) : 1})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <div style={{ ...mono(34, lit ? colors.green : colors.dim), fontWeight: 700 }}>{s}</div>
            <div style={{ ...mono(20, lit ? colors.green : colors.dim) }}>{lit ? "ACCESS: OPEN" : "locked"}</div>
          </div>
        );
      })}
      {SYSTEMS.map((_, i) => (
        <Sfx key={i} name="click" at={at + 10 + i * 9} volume={0.6} />
      ))}
    </div>
  );
};

// the clip always runs at 30fps; a tiny helper keeps Hallway self-contained
const useVideoConfig30 = () => ({ fps: 30 });

export const Clip16: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(16);

  const tAttack = c("The attacker");
  const tAnnounce = c("Then came", 1);
  const tRevolut = c("The banking");
  const tHotel = c("And a few");
  const tApprove = c("approved");
  const tInside = c("inside");

  const typed = (text: string, at: number, cps = 26) => text.slice(0, Math.max(0, Math.floor(((frame - at) / fps) * cps)));
  const itMsg = "Hi, this is IT. Please accept the prompt to make these stop.";
  const push = sp(frame, fps, tHotel, springs.heavy, D - tHotel);
  const tvCx = HOTEL_TV.left + HOTEL_TV.width / 2;
  const tvCy = HOTEL_TV.top + HOTEL_TV.height / 2;
  const cardGone = sp(frame, fps, tInside - 8, springs.snappy);

  return (
    <>
      {/* 1: Uber */}
      <Scene from={0} to={tAttack}>
        <Terminal
          style={{ position: "absolute", left: 0, right: 0, top: 170 }}
          align="center"
          fontSize={64}
          lines={[{ text: "SEPTEMBER 2022", at: c("September"), durationInFrames: 24 }]}
        />
        <Pop at={c("Uber")} from="slam" sound="slam" style={{ left: 0, right: 0, top: 330, display: "flex", justifyContent: "center" }}>
          <BrandTag name="UBER" size={300} />
        </Pop>
        <Chip at={c("ride-hailing")} text="ONE OF THE BIGGEST RIDE-HAILING COMPANIES IN THE WORLD" color={colors.text} fontSize={34} origin="center center" style={{ left: 330, top: 690 }} />
      </Scene>

      {/* 2: password, prompt flood, fake IT message, inside */}
      <Scene from={tAttack} to={tAnnounce}>
        <div style={{ position: "absolute", left: 110, top: 70, ...mono(34, colors.dim) }}>&gt; how the attacker got in:</div>

        {/* stolen password */}
        <div style={{ opacity: 1 - cardGone }}>
          <Pop at={c("password") - 8} from="left" sound="pop" style={{ left: 110, top: 150 }}>
            <Card accent={colors.amber} style={{ width: 520, padding: "24px 30px" }}>
              <div style={{ ...mono(24, colors.dim), letterSpacing: "0.16em" }}>CONTRACTOR LOGIN</div>
              <div style={{ ...mono(34), marginTop: 14 }}>
                <span style={{ color: colors.dim }}>user </span>contractor_••••
              </div>
              <div style={{ ...mono(34), marginTop: 6 }}>
                <span style={{ color: colors.dim }}>pass </span>
                <span style={{ color: colors.amber }}>••••••••••</span>
              </div>
            </Card>
          </Pop>
          <SeizedStamp at={c("bought")} text="BOUGHT ONLINE" color={colors.amber} fontSize={44} rotate={-6} style={{ left: 250, top: 330 }} />
        </div>

        {/* the contractor's phone */}
        <Pop at={c("flood") - 10} from="up" style={{ left: 660, top: 70, width: 600, textAlign: "center" }}>
          <span style={{ ...mono(26, colors.dim), letterSpacing: "0.16em", whiteSpace: "nowrap" }}>THE CONTRACTOR'S PHONE</span>
        </Pop>
        <PhoneBuzz at={c("flood") - 6} prompts={7} interval={14} approveAt={tApprove} time="01:07" size={250} style={{ left: 835, top: 110 }} />
        <Chip at={c("didn't")} text="NO ANSWER" color={colors.red} fontSize={30} origin="center center" style={{ left: 600, top: 470 }} />

        {/* fake IT support message */}
        <Pop at={c("message") - 4} from="right" sound="notify" style={{ left: 1210, top: 150 }}>
          <div style={{ width: 600 }}>
            <div style={{ ...mono(24, colors.dim), letterSpacing: "0.12em", marginBottom: 10 }}>NEW MESSAGE · FROM "IT SUPPORT"</div>
            <div style={{ padding: "22px 26px", borderRadius: "18px 18px 18px 4px", background: colors.panelLight, border: `3px solid ${colors.agent}`, ...mono(34), lineHeight: 1.4, minHeight: 190 }}>
              {typed(itMsg, c("Just") - 20)}
              <span style={{ opacity: Math.floor(frame / 8) % 2 ? 0 : 1, color: colors.agent }}>▌</span>
            </div>
            <div style={{ ...mono(20, colors.dim), marginTop: 8 }}>paraphrased</div>
          </div>
        </Pop>
        <Sfx name="type" at={c("Just") - 20} durationInFrames={70} loop volume={0.7} />
        <SeizedStamp at={c("pretending")} text="FAKE" fontSize={70} rotate={10} style={{ left: 1590, top: 420 }} />

        {/* approved, and in */}
        <Chip at={tApprove + 6} text="APPROVED" color={colors.green} filled fontSize={40} origin="center center" style={{ left: 600, top: 470 }} />
        <Hallway at={tInside - 6} />
        <Flash at={tInside} color={colors.green} peak={0.25} durationInFrames={10} />
      </Scene>

      {/* 3: the announcement in the company chat */}
      <Scene from={tAnnounce} to={tRevolut}>
        <ChatWindow
          style={{ position: "absolute", left: 110, top: 110 }}
          width={1180}
          enterAt={tAnnounce}
          fontSize={48}
          title="uber :: company chat"
          sender={{ name: "unknown user", color: colors.red, avatar: <AvatarBadge icon="unknown" size={104} /> }}
          recipient="all staff"
          timestamp="SEPT 2022"
          minBodyHeight={280}
          messages={[{ typingFrom: c("announcement"), at: c("A message") + 12, cps: 22, label: "PARAPHRASED", text: "Announcement: this company has been hacked." }]}
        />
        {[0, 1, 2].map((i) => (
          <Pop key={i} at={tAnnounce + 8 + i * 5} origin="center bottom" style={{ left: 1360 + i * 150, top: 430 + (i % 2) * 40 }}>
            <BlobCharacter color={colors.extras[i]} size={230} seed={20 + i} expression={frame >= c("hacked") ? "scared" : "calm"} sweat={false} look={{ x: -0.9, y: -0.2 }} />
          </Pop>
        ))}
        <Chip at={c("staff")} text="THE STAFF" color={colors.text} fontSize={28} origin="center center" style={{ left: 1490, top: 330 }} />
        <Flash at={c("hacked")} peak={0.35} durationInFrames={10} />
      </Scene>

      {/* 4: Revolut, same spree */}
      <Scene from={tRevolut} to={tHotel}>
        <div style={{ position: "absolute", left: 250, top: 300, opacity: 0.55 }}>
          <BrandTag name="UBER" size={150} />
        </div>
        <SeizedStamp at={tRevolut} text="BREACHED" fontSize={60} sound={false} style={{ left: 330, top: 470 }} />
        <Pop at={c("Revolut") - 4} from="slam" sound="slam" style={{ left: 980, top: 290 }}>
          <BrandTag name="REVOLUT" size={170} />
        </Pop>
        <SeizedStamp at={c("hit")} text="BREACHED" fontSize={70} style={{ left: 1160, top: 480 }} />
        <Chip at={c("same")} text="THE SAME SPREE" fontSize={40} origin="center center" style={{ left: 760, top: 690 }} />
      </Scene>

      {/* 5: back in the hotel room, a new target on the TV */}
      <Scene from={tHotel} to={D} exit="cut">
        <AbsoluteFill style={{ transform: `scale(${1 + push * 0.18})`, transformOrigin: `${tvCx}px ${tvCy}px` }}>
          <HotelRoom
            tvOn={1}
            stick
            glow={frame >= c("picked") ? colors.amber : colors.green}
            screen={
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, background: "#0E0C07" }}>
                {frame >= c("picked") ? (
                  <>
                    <div style={{ ...mono(26, colors.dim), letterSpacing: "0.2em" }}>NEW TARGET</div>
                    <BrandTag name="ROCKSTAR" size={110} />
                  </>
                ) : (
                  <div style={{ ...mono(30, colors.green) }}>&gt; _</div>
                )}
              </div>
            }
          >
            <div style={{ position: "absolute", left: 300, top: 470 }}>
              <White size={250} look={{ x: 0.8, y: -0.2 }} />
            </div>
          </HotelRoom>
        </AbsoluteFill>
        <Chip at={c("few")} text="A FEW DAYS LATER" color={colors.text} fontSize={36} style={{ left: 110, top: 60 }} />
        <Sfx name="riser" at={D - 48} volume={0.6} />
      </Scene>
    </>
  );
};
