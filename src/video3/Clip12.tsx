import React from "react";
import { random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, Chip, CoinIcon, Flash, IconFlood, Pop, Scene, Sfx, TitleSlam, mono } from "../components";
import { ChannelCard, Post } from "./Clip10";
import { useClip } from "./words";

const Pan: React.FC<{ label: string; color: string; children: React.ReactNode }> = ({ label, color, children }) => (
  <div style={{ width: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ width: 4, height: 120, background: colors.dim }} />
    <div style={{ height: 130, display: "flex", alignItems: "flex-end" }}>{children}</div>
    <div style={{ width: 300, height: 22, borderRadius: "0 0 150px 150px", background: color, boxShadow: `0 0 30px ${color}66` }} />
    <div style={{ fontFamily: fonts.display, fontSize: 80, color, marginTop: 14, letterSpacing: "0.06em" }}>{label}</div>
  </div>
);

const Megaphone: React.FC<{ size?: number; color?: string }> = ({ size = 120, color = colors.amber }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 14px ${color}88)` }}>
    <path d="M 14 40 H 36 L 78 16 V 84 L 36 60 H 14 Z" fill={color} />
    <path d="M 26 60 L 32 86 H 44 L 40 60" fill={color} />
    <path d="M 86 36 Q 94 50 86 64" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

const TILE_COLORS = [colors.agent, colors.extras[0], colors.extras[2], colors.extras[1], colors.extras[3]];

export const Clip12: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(12);

  const tAttacks = c("In some") - 6;
  const tChannel = c("Then they") - 6;
  const tHiding = c("They weren't") - 6;

  // the scale: a slight lean to money, then fame drops hard
  const lean = sp(frame, fps, c("money."), springs.smooth, 20);
  const drop = sp(frame, fps, c("famous.") - 4, springs.pop);
  const angle = -6 * lean + 24 * drop;
  const rad = (angle * Math.PI) / 180;
  const ARM = 430;
  const PX = 960;
  const PY = 330;

  return (
    <>
      {/* 1: what did they want? */}
      <Scene from={0} to={tAttacks}>
        <TitleSlam text="WHAT DID THEY ACTUALLY WANT?" fontSize={130} at={c("point") - 10} style={{ top: 60 }} />
        {/* scale */}
        <div style={{ position: "absolute", left: PX - 12, top: PY, width: 24, height: 420, background: "#2A343D", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: PX - 150, top: PY + 410, width: 300, height: 22, borderRadius: 8, background: "#2A343D" }} />
        <div style={{ position: "absolute", left: PX - ARM, top: PY - 8, width: ARM * 2, height: 16, borderRadius: 8, background: colors.text, transform: `rotate(${angle}deg)` }} />
        <div style={{ position: "absolute", left: PX - 16, top: PY - 16, width: 32, height: 32, borderRadius: 16, background: colors.amber }} />
        <Pop at={c("Sometimes") - 6} from="up" style={{ left: PX - Math.cos(rad) * ARM - 150, top: PY - Math.sin(rad) * ARM }}>
          <Pan label="MONEY" color={colors.green}>
            <CoinIcon size={110} />
          </Pan>
        </Pop>
        <Pop at={c("investigators") - 6} from="up" style={{ left: PX + Math.cos(rad) * ARM - 150, top: PY + Math.sin(rad) * ARM }}>
          <Pan label="FAME" color={colors.amber}>
            <Megaphone size={130} />
          </Pan>
        </Pop>
        <Sfx name="slam" at={c("famous.") - 4} volume={0.8} />
        <Chip at={c("business.")} text="NOT ACTING LIKE A BUSINESS" color={colors.text} fontSize={26} style={{ left: 110, top: 190 }} />
        <Chip at={c("famous.")} text="ACTING LIKE IT WANTED TO BE FAMOUS" fontSize={26} style={{ left: 1210, top: 190 }} />
      </Scene>

      {/* 2: they stayed, and joined the emergency call */}
      <Scene from={tAttacks} to={tChannel}>
        <Scene from={tAttacks} to={c("slipped") - 4}>
          <Chip at={c("steal")} text="STEAL THE DATA" color={colors.dim} fontSize={40} origin="center center" style={{ left: 560, top: 250 }} />
          <Chip at={c("leave.")} text="AND LEAVE?" color={colors.dim} fontSize={40} origin="center center" style={{ left: 1040, top: 250 }} />
          <TitleSlam text="THEY STAYED." color={colors.red} fontSize={300} at={c("stayed.")} style={{ top: 380 }} />
        </Scene>
        {/* the call */}
        <Pop at={c("slipped")} from="up" sound="notify" style={{ left: 110, top: 80 }}>
          <div style={{ width: 1160, borderRadius: 14, background: colors.panel, border: `2px solid ${colors.line}`, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", background: "#090D10", borderBottom: `2px solid ${colors.line}`, ...mono(24, colors.dim) }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: colors.red, opacity: 0.6 + 0.4 * Math.sin(frame / 5) }} />
              <span style={{ color: colors.text, fontWeight: 700 }}>EMERGENCY CALL</span>
              <span>· incident response · staff only</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, padding: 18 }}>
              {new Array(6).fill(0).map((_, i) => {
                const intruder = i === 5;
                const on = intruder ? frame >= c("listened") : frame >= c("emergency") + i * 4;
                const s = sp(frame, fps, intruder ? c("listened") : c("emergency") + i * 4, springs.pop);
                return (
                  <div
                    key={i}
                    style={{
                      height: 300,
                      borderRadius: 10,
                      background: intruder && on ? "#0A0607" : "#11171D",
                      border: `3px solid ${intruder && on ? colors.red : colors.line}`,
                      boxShadow: intruder && on ? `0 0 40px ${colors.red}66` : "none",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {on ? (
                      <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center", transform: `scale(${s})`, transformOrigin: "center bottom" }}>
                        {intruder ? (
                          <BlobCharacter color="#14181D" accessory="hoodie" size={270} seed={50} eyeColor={colors.red} lightColor={colors.red} lightAmount={0.5} />
                        ) : (
                          <BlobCharacter color={TILE_COLORS[i]} size={270} seed={50 + i} expression="scared" shake={0.4} sweat={i % 2 === 0} look={{ x: (i % 3) - 1, y: 0 }} />
                        )}
                      </div>
                    ) : null}
                    <div style={{ position: "absolute", left: 10, bottom: 8, ...mono(18, intruder && on ? colors.red : colors.dim), fontWeight: 700 }}>
                      {intruder ? (on ? "UNKNOWN PARTICIPANT" : "") : `staff ${i + 1}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Pop>
        <Sfx name="error" at={c("listened")} volume={0.7} />
        {/* call chat */}
        <Pop at={c("read") - 6} from="right" style={{ left: 1310, top: 80 }}>
          <div style={{ width: 500, height: 720, borderRadius: 14, background: colors.panel, border: `2px solid ${colors.line}`, padding: "16px 18px", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
            <div style={{ ...mono(22, colors.dim), letterSpacing: "0.14em", marginBottom: 14 }}>CALL CHAT</div>
            {[
              { at: c("read"), who: "staff 2", text: "how are they still in??" },
              { at: c("internal"), who: "staff 4", text: "reset everything. now." },
              { at: c("about"), who: "staff 1", text: "can they see this chat?" },
            ].map((m) =>
              frame >= m.at ? (
                <div key={m.text} style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 10, background: colors.panelLight, borderLeft: `4px solid ${colors.agent}` }}>
                  <Sfx name="pop" at={m.at} volume={0.5} />
                  <div style={{ ...mono(18, colors.dim) }}>{m.who}</div>
                  <div style={{ ...mono(26), fontWeight: 700 }}>{m.text}</div>
                </div>
              ) : null,
            )}
            {frame >= c("happening.") ? (
              <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,59,59,0.12)", border: `3px solid ${colors.red}`, transform: `scale(${sp(frame, fps, c("happening."), springs.pop)})`, transformOrigin: "left center" }}>
                <Sfx name="notify" at={c("happening.")} />
                <div style={{ ...mono(18, colors.red) }}>unknown participant</div>
                <div style={{ ...mono(64, colors.red), fontWeight: 700, lineHeight: 1.1 }}>lol</div>
              </div>
            ) : null}
          </div>
        </Pop>
        <Chip at={c("staff")} text="LISTENING TO THE STAFF TRY TO THROW THEM OUT" color={colors.red} fontSize={28} style={{ left: 110, top: 800 }} />
      </Scene>

      {/* 3: back to the channel */}
      <Scene from={tChannel} to={tHiding}>
        <ChannelCard at={tChannel + 2} width={900} height={500} meter={1} style={{ left: 130, top: 150 }}>
          <Post at={c("channel")} text="we were on their emergency call the whole time" color={colors.green} />
          <Post at={c("told")} text="they said hi" />
        </ChannelCard>
        {["HAHA", "NO WAY", "LEGENDS", "WHO NEXT?", "W", "LOL"].map((r, i) => (
          <Chip
            key={r}
            at={c("followers") + i * 4}
            text={r}
            color={i % 2 ? colors.amber : colors.green}
            fontSize={30}
            origin="center center"
            style={{ left: 1120 + (i % 3) * 230 + random(`rx-${i}`) * 40, top: 230 + Math.floor(i / 3) * 110 + random(`ry-${i}`) * 30 }}
          />
        ))}
        <Pop at={tChannel + 10} origin="center bottom" style={{ left: 1290, top: 480 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
            <BlobCharacter color="#14181D" accessory="hoodie" size={300} seed={50} eyeColor={colors.text} lightColor={colors.green} lightAmount={0.6} />
            <div style={{ marginBottom: 120, transform: `rotate(${Math.sin(frame / 6) * 6}deg)` }}>
              <Megaphone size={150} />
            </div>
          </div>
        </Pop>
      </Scene>

      {/* 4: performing */}
      <Scene from={tHiding} to={D} exit="glitch">
        {frame >= c("everyone") - 6 ? (
          <IconFlood at={c("everyone") - 6} spread={30} highlightAt={c("Including")} highlightColor={colors.red} highlightRatio={0.07} seed="watchers" style={{ opacity: 0.5 }} />
        ) : null}
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 520, background: "rgba(7,9,11,0.82)" }} />
        <TitleSlam text="THEY WEREN'T HIDING." color={colors.text} fontSize={200} at={c("hiding.") - 8} style={{ top: 190 }} />
        <TitleSlam text="THEY WERE PERFORMING." color={colors.amber} fontSize={200} at={c("performing.") - 8} style={{ top: 420 }} />
        <Chip at={c("watching.")} text="EVERYONE WAS WATCHING" color={colors.green} fontSize={36} origin="center center" style={{ left: 700, top: 700 }} />
        <Chip at={c("angry.") - 10} text="INCLUDING SOME VERY ANGRY PEOPLE" color={colors.red} filled fontSize={36} origin="center center" style={{ left: 590, top: 790 }} />
        <Flash at={c("Including")} peak={0.25} durationInFrames={10} />
      </Scene>
    </>
  );
};
