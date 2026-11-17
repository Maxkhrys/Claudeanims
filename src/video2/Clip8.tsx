import React from "react";
import { useCurrentFrame } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import {
  Card,
  Cazes,
  Chip,
  EmailHeader,
  EvidenceBoard,
  Flash,
  Pop,
  RossBlob,
  Scene,
  Sfx,
  TitleSlam,
  mono,
} from "../components";
import { useClip } from "./words";

const ADDRESS = "pimp_alex_91@hotmail.com";

/** Clip 8: the email. Zoom into the header, the address, then the strings snap together. */
export const Clip8: React.FC = () => {
  const frame = useCurrentFrame();
  const { c, fps, D } = useClip(8);

  const tBoard = c("Investigators");
  const tPost = c("And then");
  const tSame = c("The same");
  const tRoss = c("Ross's");

  // slow push-in on the From line
  const zoom = 1 + 0.5 * sp(frame, fps, c("sender's") - 12, springs.heavy, 70);
  const revealed = frame >= c("personal") - 4;
  const line = sp(frame, fps, c("1991") + 4, springs.smooth, 14);
  const dim = sp(frame, fps, tRoss - 4, springs.smooth, 12);

  const emailProps = {
    width: 1300,
    style: { left: 250, top: 150 },
    subject: "Welcome to AlphaBay!",
    fromName: "AlphaBay",
    date: "December 2014",
    body: ["Welcome to the AlphaBay forums.", "Your account has been created."],
    zoom,
  };

  return (
    <>
      {/* 1: the header, and who it came from */}
      <Scene from={0} to={tBoard}>
        {revealed ? (
          <EmailHeader
            {...emailProps}
            fromAddress={ADDRESS}
            typeAt={c("Pimp_Alex_91")}
            typeDuration={c("Alex") - c("Pimp_Alex_91") - 8}
            highlights={[
              { text: "alex", at: c("Alex") },
              { text: "91", at: c("1991"), color: colors.red },
            ]}
          />
        ) : (
          <EmailHeader {...emailProps} fromAddress="xxxxxxxxxxxx@xxxxxxx.xxx" blur={1} />
        )}
        <Chip at={c("sender's")} text="◀ THE SENDER'S ADDRESS" color={colors.green} fontSize={30} style={{ left: 1250, top: 176 }} />
        <Scene from={0} to={c("personal")} exit="cut">
          <Chip at={c("throwaway")} text="NOT A THROWAWAY" color={colors.text} fontSize={36} style={{ left: 1250, top: 262 }} />
        </Scene>
        <Chip at={c("personal")} text="A PERSONAL HOTMAIL" color={colors.amber} filled fontSize={36} style={{ left: 1250, top: 262 }} />

        {/* "91" -> the birth date */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path
            d="M 978 418 V 560 H 1180"
            fill="none"
            stroke={colors.red}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - line}
            opacity={line > 0 ? 1 : 0}
            style={{ filter: `drop-shadow(0 0 8px ${colors.red})` }}
          />
        </svg>
        <Pop at={c("Born")} from="right" sound="pop" style={{ left: 1180, top: 470 }}>
          <Card accent={colors.red} style={{ width: 600, padding: "22px 30px 26px" }}>
            <div style={{ ...mono(26, colors.dim), letterSpacing: "0.18em" }}>DATE OF BIRTH</div>
            <div style={{ ...mono(74, colors.red), fontWeight: 700, lineHeight: 1.1 }}>
              19.10.<span style={{ color: frame >= c("1991") ? colors.red : colors.dim }}>1991</span>
            </div>
            <div
              style={{
                fontFamily: fonts.display,
                fontSize: 78,
                lineHeight: 1,
                marginTop: 8,
                color: colors.text,
                opacity: frame >= c("Alexandre") ? 1 : 0,
              }}
            >
              ALEXANDRE CAZES
            </div>
          </Card>
        </Pop>
        <Sfx name="snap" at={c("1991") + 4} />
      </Scene>

      {/* 2-4: the evidence board */}
      <Scene from={tBoard} to={D} exit="glitch">
        <div style={{ position: "absolute", inset: 0, opacity: 1 - dim * 0.82 }}>
          <EvidenceBoard
            width={1720}
            height={760}
            style={{ left: 100, top: 90 }}
            items={[
              { id: "hotmail", x: 860, y: 110, at: tBoard + 4, title: "pimp_alex_91", sub: "@hotmail.com", color: colors.amber, width: 380 },
              { id: "linkedin", x: 280, y: 250, at: c("LinkedIn"), title: "LINKEDIN", sub: "his profile" },
              { id: "paypal", x: 1440, y: 250, at: c("PayPal"), title: "PAYPAL", sub: "his account" },
              { id: "company", x: 280, y: 560, at: c("tech"), title: "TECH COMPANY", sub: "his business" },
              { id: "forum", x: 1440, y: 560, at: c("French"), title: "OLD FORUM POST", sub: "username: Alpha02", color: colors.green },
              { id: "cazes", x: 860, y: 430, at: tSame, title: "ALEXANDRE CAZES", sub: "one man", color: colors.red, big: true },
            ]}
            strings={[
              { from: "hotmail", to: "linkedin", at: c("LinkedIn") + 5 },
              { from: "hotmail", to: "paypal", at: c("PayPal") + 5 },
              { from: "hotmail", to: "company", at: c("tech") + 8 },
              { from: "hotmail", to: "forum", at: c("Hotmail", 1) },
              { from: "forum", to: "cazes", at: c("username") },
              { from: "hotmail", to: "cazes", at: c("email") },
              { from: "linkedin", to: "cazes", at: c("email") + 8 },
              { from: "paypal", to: "cazes", at: c("email") + 12 },
              { from: "company", to: "cazes", at: c("email") + 16 },
            ]}
          />
        </div>
        <Sfx name="riser" at={tSame - 46} volume={0.8} />
        <Flash at={tSame} color={colors.red} peak={0.3} durationInFrames={10} />

        {/* the old forum post, pulled up in front of the board */}
        <Scene from={c("post") - 6} to={tSame - 8}>
          <Pop at={c("post") - 6} from="up" sound="whoosh" style={{ left: 420, top: 170 }}>
            <Card accent={colors.green} style={{ width: 1080, padding: "26px 40px 34px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", ...mono(24, colors.dim), letterSpacing: "0.12em" }}>
                <span>FRENCH TECH FORUM</span>
                <span>YEARS EARLIER</span>
              </div>
              <div style={{ ...mono(46), fontWeight: 700, lineHeight: 1.25, marginTop: 16 }}>
                "How to remove a virus from an image"
              </div>
              <div style={{ ...mono(32, colors.dim), marginTop: 22, opacity: frame >= c("Username") ? 1 : 0 }}>
                posted by{" "}
                <b style={{ color: colors.green, fontSize: 48 }}>Alpha02</b>
              </div>
              <div style={{ ...mono(32, colors.dim), marginTop: 12, opacity: frame >= c("Signed") ? 1 : 0 }}>
                signed <b style={{ color: colors.text }}>Alexandre Cazes</b>
              </div>
              <div style={{ marginTop: 14, opacity: frame >= c("Hotmail", 1) ? 1 : 0 }}>
                <b style={{ ...mono(40, colors.bg), background: colors.amber, padding: "4px 14px", borderRadius: 6 }}>{ADDRESS}</b>
              </div>
            </Card>
          </Pop>
          <Sfx name="pop" at={c("Username")} />
          <Sfx name="pop" at={c("Signed")} />
          <Sfx name="snap" at={c("Hotmail", 1)} />
        </Scene>

        {/* the same mistake */}
        <Pop at={tRoss - 2} origin="center bottom" style={{ left: 300, top: 400 }}>
          <RossBlob size={330} look={{ x: 0.8, y: 0 }} />
        </Pop>
        <Chip at={tRoss + 6} text="rossulbricht@gmail.com" color={colors.green} fontSize={30} origin="center center" style={{ left: 240, top: 760 }} />
        <Pop at={c("mistake")} origin="center bottom" style={{ left: 1300, top: 400 }}>
          <Cazes size={330} look={{ x: -0.8, y: 0 }} />
        </Pop>
        <Chip at={c("mistake") + 6} text={ADDRESS} color={colors.amber} fontSize={30} origin="center center" style={{ left: 1210, top: 760 }} />
        <TitleSlam text="THE SAME MISTAKE" color={colors.red} fontSize={230} at={c("exactly")} style={{ top: 120 }} />
        <Flash at={c("exactly")} peak={0.45} />
      </Scene>
    </>
  );
};
