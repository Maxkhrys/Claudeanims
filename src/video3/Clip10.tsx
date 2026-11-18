import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { BlobCharacter, BrandTag, Chip, Counter, Flash, Pop, Scene, SeizedStamp, Sfx, TitleSlam, mono } from "../components";
import { useClip } from "./words";

/** Our own generic "public channel" card (no real app branding). Reused by clips 11 and 12. */
export const ChannelCard: React.FC<{
  at: number;
  width?: number;
  height?: number;
  /** 0..1 how full the "members" meter is */
  meter?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ at, width = 760, height = 520, meter = 0.5, style, children }) => {
  const frame = useCurrentFrame();
  return (
    <Pop at={at} from="up" sound="notify" style={{ width, ...style }}>
      <div style={{ height, borderRadius: 14, background: colors.panel, border: `2px solid ${colors.line}`, boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 70px rgba(57,255,136,0.08)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 22px", background: "#090D10", borderBottom: `2px solid ${colors.line}` }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, background: colors.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontSize: 30, color: colors.bg }}>L</div>
          <div style={{ flex: 1 }}>
            <div style={{ ...mono(28), fontWeight: 700 }}>LAPSUS$</div>
            <div style={{ ...mono(18, colors.dim) }}>public channel · anyone can join</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ ...mono(16, colors.dim), letterSpacing: "0.14em" }}>MEMBERS ▲</div>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 30, marginTop: 4 }}>
              {new Array(10).fill(0).map((_, i) => {
                const on = i / 10 < meter;
                const h = 8 + i * 2.4 + (on ? 3 * Math.sin(frame / 4 + i) : 0);
                return <div key={i} style={{ width: 9, height: h, borderRadius: 2, background: on ? colors.green : colors.line, boxShadow: on ? `0 0 8px ${colors.green}` : "none" }} />;
              })}
            </div>
          </div>
        </div>
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>{children}</div>
      </div>
    </Pop>
  );
};

/** One post inside a ChannelCard. */
export const Post: React.FC<{ at: number; text: string; color?: string; shots?: number }> = ({ at, text, color = colors.text, shots = 0 }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const s = sp(frame, 30, at, springs.snappy);
  return (
    <div style={{ padding: "12px 16px", borderRadius: 10, background: colors.panelLight, borderLeft: `4px solid ${colors.green}`, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * 20}px)` }}>
      <Sfx name="pop" at={at} volume={0.5} />
      <div style={{ ...mono(24, color), fontWeight: 700 }}>{text}</div>
      {shots > 0 ? (
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {new Array(shots).fill(0).map((_, i) => (
            <div key={i} style={{ width: 150, height: 84, borderRadius: 6, background: "linear-gradient(135deg, #1B242C, #141B21)", border: `1px solid ${colors.line}`, padding: 8 }}>
              <div style={{ height: 8, width: 70 + i * 14, background: colors.dim, opacity: 0.5, borderRadius: 2 }} />
              <div style={{ height: 6, width: 110, background: colors.line, borderRadius: 2, marginTop: 8 }} />
              <div style={{ height: 6, width: 90 - i * 10, background: colors.line, borderRadius: 2, marginTop: 6 }} />
              <div style={{ height: 14, width: 44, background: colors.red, opacity: 0.6, borderRadius: 3, marginTop: 10 }} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const FileCard: React.FC<{ label: string; color: string; w?: number }> = ({ label, color, w = 250 }) => (
  <div style={{ width: w, padding: "22px 18px 18px", borderRadius: 10, background: colors.panel, border: `3px solid ${color}`, boxShadow: `0 0 40px ${color}33, 0 20px 40px rgba(0,0,0,0.6)`, position: "relative" }}>
    <div style={{ position: "absolute", right: -3, top: -3, width: 34, height: 34, background: colors.bg, borderLeft: `3px solid ${color}`, borderBottom: `3px solid ${color}` }} />
    <div style={{ ...mono(20, colors.dim), letterSpacing: "0.14em" }}>SOURCE CODE</div>
    <div style={{ fontFamily: fonts.display, fontSize: 84, lineHeight: 1, color, marginTop: 4 }}>{label}</div>
    {[0.9, 0.7, 0.8].map((x, i) => (
      <div key={i} style={{ height: 7, width: `${x * 100}%`, background: colors.line, borderRadius: 3, marginTop: 9 }} />
    ))}
  </div>
);

const DayChip: React.FC<{ at: number; text: string; style?: React.CSSProperties }> = ({ at, text, style }) => (
  <Pop at={at} from="left" sound="click" style={style}>
    <div style={{ display: "inline-block", padding: "10px 24px", background: colors.text, color: colors.bg, borderRadius: 8, fontFamily: fonts.mono, fontWeight: 700, fontSize: 46, letterSpacing: "0.08em" }}>{text}</div>
  </Pop>
);

export const Clip10: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(10);

  const tSamsung = c("March", 1) - 6;
  const tMicrosoft = c("March", 2) - 6;
  const tThree = c("Three") - 6;
  const tInside = c("Inside") - 6;
  const tLast = c("And then came") - 4;

  // the calendar: a day marker racing through March
  const calStart = c("March");
  const day = Math.max(1, Math.min(31, Math.floor(((frame - calStart) / (tSamsung - calStart)) * 31) + 1));
  const meter = interpolate(frame, [tThree, tInside], [0.3, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      {/* 1: Nvidia refused, the leaking starts, March begins */}
      <Scene from={0} to={tSamsung}>
        <Pop at={2} from="left" style={{ left: 140, top: 150 }}>
          <BrandTag name="NVIDIA" size={110} />
        </Pop>
        <SeizedStamp at={c("refused")} text="REFUSED" fontSize={76} rotate={-8} style={{ left: 640, top: 150 }} />
        {/* folder with files escaping */}
        <Pop at={c("leaking") - 12} style={{ left: 170, top: 400 }}>
          <div style={{ width: 300, height: 220, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 130, height: 40, borderRadius: "10px 10px 0 0", background: "#8C6A2A" }} />
            <div style={{ position: "absolute", left: 0, top: 30, width: 300, height: 190, borderRadius: "0 12px 12px 12px", background: "linear-gradient(to bottom, #C99A3C, #8C6A2A)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", ...mono(26, colors.bg), fontWeight: 700 }}>STOLEN DATA</div>
          </div>
        </Pop>
        {frame >= c("leaking")
          ? new Array(7).fill(0).map((_, i) => {
              const t = (((frame - c("leaking")) / 46 + i / 7) % 1 + 1) % 1;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 400 + t * 520,
                    top: 470 + Math.sin(t * Math.PI) * -90 + (i % 3) * 34,
                    width: 58,
                    height: 72,
                    borderRadius: 6,
                    background: colors.panelLight,
                    border: `2px solid ${colors.green}`,
                    opacity: Math.sin(t * Math.PI),
                    transform: `rotate(${(random(`f-${i}`) - 0.5) * 40 + t * 60}deg)`,
                  }}
                >
                  <div style={{ height: 5, margin: "12px 8px 0", background: colors.green, opacity: 0.7 }} />
                  <div style={{ height: 5, margin: "8px 8px 0", background: colors.line }} />
                  <div style={{ height: 5, margin: "8px 14px 0 8px", background: colors.line }} />
                </div>
              );
            })
          : null}
        <Chip at={c("leaking")} text="SO THEY STARTED LEAKING" color={colors.green} style={{ left: 170, top: 660 }} />
        {/* calendar */}
        <Pop at={calStart - 6} from="right" sound="whoosh" style={{ left: 1060, top: 150 }}>
          <div style={{ width: 720, borderRadius: 14, background: colors.panel, border: `2px solid ${colors.line}`, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}>
            <div style={{ padding: "14px 26px", background: colors.red, color: colors.bg, fontFamily: fonts.display, fontSize: 72, letterSpacing: "0.06em" }}>MARCH 2022</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, padding: 22 }}>
              {new Array(31).fill(0).map((_, i) => {
                const d = i + 1;
                const hit = d === 4 || d === 21 || d === 22;
                const passed = frame >= calStart && d <= day;
                return (
                  <div
                    key={d}
                    style={{
                      height: 70,
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      ...mono(30, passed ? (hit ? colors.bg : colors.text) : colors.dim),
                      fontWeight: 700,
                      background: passed ? (hit ? colors.red : colors.panelLight) : "transparent",
                      border: `2px solid ${d === day && frame >= calStart ? colors.amber : colors.line}`,
                      boxShadow: passed && hit ? `0 0 24px ${colors.red}` : "none",
                    }}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
          </div>
        </Pop>
        <Sfx name="tick" at={calStart} durationInFrames={tSamsung - calStart - 10} loop volume={0.5} />
        <TitleSlam text="THE WILDEST MONTH" color={colors.amber} fontSize={130} at={c("wildest")} style={{ left: 120, right: 900, top: 735 }} />
      </Scene>

      {/* 2: Samsung, March 4 */}
      <Scene from={tSamsung} to={tMicrosoft}>
        <DayChip at={tSamsung + 4} text="MARCH 4" style={{ left: 150, top: 110 }} />
        <Pop at={c("Samsung.")} from="slam" sound="slam" style={{ left: 150, top: 220 }}>
          <BrandTag name="SAMSUNG" size={190} />
        </Pop>
        <div style={{ position: "absolute", left: 150, top: 440, display: "flex", alignItems: "baseline", gap: 30 }}>
          {frame >= c("190") ? <Counter to={190} suffix=" GB" at={c("190")} durationInFrames={26} fontSize={230} color={colors.amber} /> : null}
        </div>
        <Chip at={c("Galaxy")} text="INCLUDING GALAXY PHONE SOURCE CODE" color={colors.text} fontSize={34} style={{ left: 150, top: 720 }} />
        {/* the torrent drops */}
        <Pop at={c("dumped")} from="up" sound="whoosh" style={{ left: 1240, top: 250 }}>
          <div style={{ width: 500, padding: "26px 30px", borderRadius: 14, background: colors.panel, border: `3px solid ${colors.red}`, boxShadow: "0 0 80px rgba(255,59,59,0.25), 0 30px 60px rgba(0,0,0,0.7)" }}>
            <div style={{ ...mono(24, colors.dim), letterSpacing: "0.14em" }}>PUBLIC DOWNLOAD</div>
            <div style={{ ...mono(40), fontWeight: 700, marginTop: 8 }}>samsung_leak</div>
            <div style={{ ...mono(28, colors.amber), marginTop: 4 }}>190 GB · 3 parts</div>
            <div style={{ height: 16, borderRadius: 8, background: colors.line, marginTop: 22, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, Math.max(0, (frame - c("dumped")) * 2.2))}%`, background: colors.red, boxShadow: `0 0 16px ${colors.red}` }} />
            </div>
            <div style={{ ...mono(22, colors.dim), marginTop: 10 }}>anyone can download</div>
          </div>
        </Pop>
        {frame >= c("anyone")
          ? new Array(9).fill(0).map((_, i) => {
              const t = (((frame - c("anyone")) / 34 + i / 9) % 1 + 1) % 1;
              return (
                <div key={i} style={{ position: "absolute", left: 1270 + (i % 5) * 100, top: 560 + t * 230, ...mono(44, colors.red), fontWeight: 700, opacity: Math.sin(t * Math.PI) }}>
                  ↓
                </div>
              );
            })
          : null}
        <SeizedStamp at={c("online")} text="DUMPED ONLINE" fontSize={64} rotate={7} style={{ left: 1290, top: 120 }} />
      </Scene>

      {/* 3: Microsoft, March 21 */}
      <Scene from={tMicrosoft} to={tThree}>
        <DayChip at={tMicrosoft + 4} text="MARCH 21" style={{ left: 150, top: 110 }} />
        <Pop at={c("Microsoft.")} from="slam" sound="slam" style={{ left: 150, top: 220 }}>
          <BrandTag name="MICROSOFT" size={170} />
        </Pop>
        <Chip at={c("posted")} text="POSTED TO THE CHANNEL" color={colors.green} fontSize={34} style={{ left: 150, top: 420 }} />
        {[
          { label: "BING", at: c("Bing,"), color: "#6FA8FF" },
          { label: "MAPS", at: c("Maps,"), color: colors.green },
          { label: "CORTANA", at: c("Cortana."), color: colors.amber },
        ].map((f, i) => (
          <Pop key={f.label} at={f.at} sound="pop" style={{ left: 150 + i * 330, top: 520 }}>
            <div style={{ transform: `rotate(${(i - 1) * 3}deg) translateY(${Math.sin(frame / 18 + i) * 6}px)` }}>
              <FileCard label={f.label} color={f.color} w={i === 2 ? 330 : 280} />
            </div>
          </Pop>
        ))}
        <Pop at={c("voice")} from="right" style={{ left: 1300, top: 560 }}>
          <span style={{ ...mono(30, colors.dim) }}>search · maps · voice assistant</span>
        </Pop>
      </Scene>

      {/* 4: three giants in three weeks */}
      <Scene from={tThree} to={tInside}>
        {["NVIDIA", "SAMSUNG", "MICROSOFT"].map((n, i) => (
          <React.Fragment key={n}>
            <Pop at={tThree + 4 + i * 6} from="up" style={{ left: 130, top: 130 + i * 190 }}>
              <BrandTag name={n} size={120} />
            </Pop>
            <SeizedStamp at={c("biggest") + i * 12} text="BREACHED" fontSize={64} rotate={i % 2 ? 6 : -7} style={{ left: 760, top: 138 + i * 190 }} />
          </React.Fragment>
        ))}
        <TitleSlam text="3 GIANTS. 3 WEEKS." color={colors.red} fontSize={130} at={c("three", 1)} style={{ left: 120, right: 760, top: 700 }} />
        <ChannelCard at={c("announced") - 8} width={660} height={470} meter={meter} style={{ left: 1160, top: 150 }}>
          <Post at={c("announced")} text="nvidia: done" />
          <Post at={c("every")} text="samsung: done" />
          <Post at={c("public")} text="microsoft: done. who next?" color={colors.green} />
        </ChannelCard>
        <Chip at={c("public")} text="ANNOUNCED IN PUBLIC" fontSize={30} origin="center center" style={{ left: 1300, top: 650 }} />
        <Flash at={c("three", 1)} peak={0.3} durationInFrames={10} />
      </Scene>

      {/* 5: security teams watching the channel */}
      <Scene from={tInside} to={tLast} exit="cut">
        {/* big wall screen */}
        <div style={{ position: "absolute", left: 420, top: 70, width: 1080, height: 470, borderRadius: 16, background: "#07090B", border: "6px solid #232C36", boxShadow: `0 0 90px rgba(57,255,136,${0.12 + 0.04 * Math.sin(frame / 5)})` }} />
        <ChannelCard at={tInside + 2} width={1040} height={430} meter={1} style={{ left: 440, top: 90 }}>
          <Post at={tInside + 10} text="3 down." />
          <Post at={c("watching")} text="next target: loading..." color={colors.amber} />
          <Post at={c("asking")} text="guess who" color={colors.green} />
        </ChannelCard>
        {[0, 1, 2, 3].map((i) => (
          <Pop key={i} at={c("security", 1) + i * 4} origin="center bottom" style={{ left: 420 + i * 290, top: 590 }}>
            <BlobCharacter color={[colors.agent, colors.extras[0], colors.extras[2], colors.extras[1]][i]} size={250} seed={20 + i} expression="scared" sweat={i % 2 === 0} shake={0.5} look={{ x: 0, y: -0.9 }} />
          </Pop>
        ))}
        <Chip at={c("large")} text="INSIDE EVERY BIG COMPANY" color={colors.text} fontSize={24} style={{ left: 440, top: 14 }} />
        <TitleSlam text="ARE WE NEXT?" color={colors.amber} fontSize={230} at={c("Are")} style={{ top: 250 }} />
      </Scene>

      {/* 6: the next one */}
      <Scene from={tLast} to={D} exit="glitch">
        <TitleSlam text="THE NEXT ONE" color={colors.text} fontSize={230} at={c("came") - 4} style={{ top: 210 }} />
        <TitleSlam text="SCARED EVERYBODY." color={colors.red} fontSize={230} at={c("scared")} style={{ top: 460 }} />
        <Sfx name="riser" at={tLast} volume={0.6} />
      </Scene>
    </>
  );
};
