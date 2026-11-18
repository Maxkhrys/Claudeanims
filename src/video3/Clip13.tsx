import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  Card,
  Chip,
  CoinIcon,
  Dpr,
  Flash,
  Pop,
  Scene,
  SeizedStamp,
  Sfx,
  TitleSlam,
  White,
  mono,
} from "../components";
import { useClip } from "./words";

/** A value that is always covered: we never show personal details, real or invented. */
const Redacted: React.FC<{ width: number; height?: number }> = ({ width, height = 38 }) => (
  <div style={{ width, height, borderRadius: 4, background: "#000", border: "1px solid #20262C" }} />
);

/** One row of the doxxing profile; the label appears, the value stays blacked out. */
const ProfileRow: React.FC<{ at: number; label: string; widths: number[] }> = ({ at, label, widths }) => (
  <Pop at={at} from="left" sound="snap" style={{ position: "relative", marginTop: 26 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
      <div style={{ ...mono(40, colors.red), fontWeight: 700, width: 290, letterSpacing: "0.1em" }}>{label}</div>
      <div style={{ display: "flex", gap: 14 }}>
        {widths.map((w, i) => (
          <Redacted key={i} width={w} height={46} />
        ))}
      </div>
    </div>
  </Pop>
);

export const Clip13: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(13);

  const tMistake = c("That was");
  const tExposed = c("So they");
  const tClaim = c("They even");
  const tEnd = c("The boy");

  const broken = frame >= c("badly");
  const shake = broken && frame < c("January") ? (random(`dx-${Math.floor(frame / 2)}`) - 0.5) * 10 : 0;
  const walk = sp(frame, fps, c("gave"), springs.smooth, 40);
  const drop = sp(frame, fps, c("leaked"), springs.snappy);

  const POSTS = [0, 1, 2, 3];
  const COMMENTS = [
    { text: "what happened to this site??", left: 1180, top: 300 },
    { text: "the new owner broke everything", left: 1090, top: 420 },
    { text: "bring back the old admin", left: 1220, top: 540 },
  ];

  return (
    <>
      {/* 1: he buys the site, runs it badly, leaks it on the way out */}
      <Scene from={0} to={tMistake}>
        <div style={{ position: "absolute", left: 130, top: 80, ...mono(32, colors.dim) }}>&gt; the year before:</div>
        <div style={{ position: "absolute", left: 150 + walk * -70, top: 470 }}>
          <Pop at={c("White") - 6} origin="center bottom" style={{ position: "relative" }}>
            <White size={300} look={{ x: walk > 0.2 ? -0.9 : 0.8, y: 0 }} />
          </Pop>
        </div>
        <Chip at={c("bought")} text="NEW OWNER: WHITE" color={colors.text} fontSize={30} style={{ left: 130, top: 380 }} />

        <Pop at={c("website") - 6} from="up" style={{ left: 560, top: 110, transform: undefined }}>
          <div style={{ transform: `translateX(${shake}px)` }}>
            <Card accent={broken ? colors.red : colors.line} style={{ width: 1180, padding: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 22px", background: "#090D10", borderBottom: `2px solid ${colors.line}`, ...mono(22, colors.dim) }}>
                {[colors.red, colors.amber, colors.green].map((col) => (
                  <div key={col} style={{ width: 14, height: 14, borderRadius: 7, background: col, opacity: 0.75 }} />
                ))}
                <span style={{ marginLeft: 12 }}>a notorious website</span>
              </div>
              <div style={{ padding: "26px 36px 34px" }}>
                <div style={{ fontFamily: fonts.display, fontSize: 150, lineHeight: 0.95, color: broken ? colors.red : colors.text, opacity: frame >= c("called") ? 1 : 0.12 }}>
                  DOXBIN
                </div>
                <div style={{ ...mono(32, colors.amber), marginTop: 6, opacity: frame >= c("posting") ? 1 : 0 }}>
                  a site for posting people's private details
                </div>
                <div style={{ marginTop: 26 }}>
                  {POSTS.map((i) => {
                    const at = (i < 2 ? c("names") : c("addresses")) + (i % 2) * 6;
                    const err = broken && frame >= c("badly") + i * 6;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, padding: "14px 0", borderTop: `2px solid ${colors.line}`, opacity: frame >= at ? 1 : 0 }}>
                        <span style={{ ...mono(26, colors.dim), width: 150 }}>{i < 2 ? "name" : "address"}</span>
                        {err ? (
                          <span style={{ ...mono(28, colors.red), fontWeight: 700 }}>ERROR 500: PAGE NOT AVAILABLE</span>
                        ) : (
                          <>
                            <Redacted width={260 + i * 40} />
                            <Redacted width={180 - i * 20} />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </Pop>
        <Sfx name="error" at={c("badly")} />
        <Chip at={c("badly")} text="RAN IT BADLY" color={colors.red} filled fontSize={36} style={{ left: 130, top: 290 }} />
        {COMMENTS.map((m, i) => (
          <Pop key={i} at={c("turned") + i * 7} sound={i === 0 ? "pop" : undefined} style={{ left: m.left, top: m.top }}>
            <div style={{ padding: "12px 20px", borderRadius: "14px 14px 14px 2px", background: colors.text, color: colors.bg, ...mono(26, colors.bg), fontWeight: 700, transform: `rotate(${i % 2 ? 2 : -2}deg)`, boxShadow: "0 12px 30px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
              {m.text}
            </div>
          </Pop>
        ))}
        <Chip at={c("January")} text="JANUARY: GIVES UP CONTROL" fontSize={24} style={{ left: 130, top: 200 }} />

        {/* the database falls out of the site */}
        {frame >= c("leaked") ? (
          <div style={{ position: "absolute", left: 300, top: 560 + (1 - drop) * -260, transform: `rotate(${(1 - drop) * -30 - 6}deg)`, opacity: Math.min(1, drop * 3) }}>
            <Sfx name="whoosh" at={c("leaked")} />
            <div style={{ width: 230, height: 270, borderRadius: 10, background: colors.panelLight, border: `3px solid ${colors.amber}`, boxShadow: `0 0 50px ${colors.amber}44`, padding: 20 }}>
              <div style={{ ...mono(26, colors.amber), fontWeight: 700 }}>users.db</div>
              {[150, 120, 160, 100, 140].map((w, i) => (
                <div key={i} style={{ marginTop: 14 }}>
                  <Redacted width={w} height={20} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <SeizedStamp at={c("own")} text="LEAKED" fontSize={70} style={{ left: 250, top: 650 }} />
      </Scene>

      {/* 2: the wrong people to pick a fight with */}
      <Scene from={tMistake} to={tExposed}>
        <TitleSlam text="A MISTAKE" color={colors.red} fontSize={230} at={c("mistake")} style={{ top: 50 }} />
        <Flash at={c("mistake")} peak={0.3} durationInFrames={10} />
        <div style={{ position: "absolute", left: 800, top: 260, width: 1100, height: 600, background: "radial-gradient(ellipse at 50% 60%, rgba(255,59,59,0.2), rgba(0,0,0,0) 62%)" }} />
        <Pop at={tMistake + 4} origin="center bottom" style={{ left: 190, top: 500 }}>
          <White size={270} look={{ x: 0.9, y: 0 }} />
        </Pop>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Pop key={i} at={c("picked") + i * 5} origin="center bottom" style={{ left: 760 + (i % 4) * 250 + (i > 3 ? 125 : 0), top: i > 3 ? 480 : 330 }}>
            <Dpr size={i > 3 ? 330 : 280} expression="angry" seed={20 + i} lightColor={colors.red} lightAmount={0.9} look={{ x: -0.9, y: 0.2 }} />
          </Pop>
        ))}
        <Chip at={c("hobby")} text="THEIR HOBBY: EXPOSING PEOPLE" color={colors.red} filled fontSize={36} origin="center center" style={{ left: 190, top: 330 }} />
      </Scene>

      {/* 3: they expose him. Every value stays covered. */}
      <Scene from={tExposed} to={tClaim}>
        <TitleSlam text="SO THEY EXPOSED HIM" color={colors.red} fontSize={130} at={c("exposed")} style={{ top: 60 }} />
        <Pop at={tExposed + 6} from="up" style={{ left: 360, top: 250 }}>
          <Card accent={colors.red} style={{ width: 1200, padding: "30px 44px 44px", display: "flex", gap: 50, alignItems: "center" }}>
            <div style={{ width: 220, flexShrink: 0, textAlign: "center" }}>
              <White size={230} idle={0.4} />
              <div style={{ ...mono(22, colors.dim), marginTop: 6 }}>"WHITE"</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ ...mono(26, colors.dim), letterSpacing: "0.2em" }}>POSTED FOR EVERYONE TO SEE</div>
              <ProfileRow at={c("real")} label="NAME" widths={[210, 250]} />
              <ProfileRow at={c("home")} label="ADDRESS" widths={[110, 250, 90]} />
              <ProfileRow at={c("family")} label="FAMILY" widths={[240, 200]} />
            </div>
          </Card>
        </Pop>
      </Scene>

      {/* 4: the unconfirmed fortune */}
      <Scene from={tClaim} to={tEnd}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", ...mono(36, colors.dim) }}>&gt; they even claimed:</div>
        <Pop at={c("sitting")} style={{ left: 330, top: 310 }}>
          <div style={{ transform: `rotate(${Math.sin(frame / 16) * 8}deg)` }}>
            <CoinIcon size={260} />
          </div>
        </Pop>
        <TitleSlam text="300 BITCOIN?" color={colors.amber} fontSize={250} at={c("fortune")} style={{ left: 640, right: 60, top: 300 }} />
        <SeizedStamp at={c("never")} text="NEVER CONFIRMED" fontSize={90} rotate={-6} style={{ left: 700, top: 620 }} />
      </Scene>

      {/* 5: the hacker had been doxxed */}
      <Scene from={tEnd} to={D} exit="cut">
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 70%, rgba(255,59,59,0.14), rgba(0,0,0,0) 60%)" }} />
        <TitleSlam text="THE HACKER" fontSize={210} at={tEnd + 4} style={{ top: 70 }} />
        <TitleSlam text="HAD BEEN DOXXED" color={colors.red} fontSize={210} at={c("had been") - 4} style={{ top: 280 }} />
        <Pop at={tEnd + 8} origin="center bottom" style={{ left: 960 - 108, top: 560 }}>
          <White size={250} look={{ x: 0, y: 0.6 }} />
        </Pop>
      </Scene>
    </>
  );
};
