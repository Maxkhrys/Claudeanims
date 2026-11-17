import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import transcript from "../../public/audio/clip2.json";
import { colors, fonts, springs } from "../theme";
import { createCues, sp, type Cues, type Word } from "../lib/timing";
import {
  Background,
  BlobCharacter,
  BuildingIcon,
  Captions,
  CoinIcon,
  Counter,
  CrossOut,
  DecodeText,
  Flash,
  Glitch,
  GlitchBars,
  GlitchTransition,
  PirateHat,
  ShopWindow,
  Terminal,
  TitleSlam,
} from "../components";

export const clip2Schema = z.object({
  showCaptions: z.boolean(),
});

const words = transcript.words as Word[];

const useBeats = (cue: Cues) =>
  useMemo(
    () => ({
      question: cue.at("how"),
      rewind: cue.at("rewind"),
      ross: cue.at("Ross"),
      age: cue.at("late"),
      physics: cue.at("physics"),
      scout: cue.at("Eagle"),
      believer: cue.at("believer"),
      idea: cue.at("People should"),
      free: cue.at("free"),
      buy: cue.at("buy"),
      sell: cue.at("sell"),
      noGov: cue.at("no government"),
      tools: cue.at("He saw"),
      toolsHead: cue.at("two"),
      toolCards: cue.at("tools"),
      tor: cue.at("Tor"),
      who: cue.at("who"),
      where: cue.at("where"),
      bitcoin: cue.at("Bitcoin"),
      noBank: cue.at("no bank"),
      noNames: cue.at("no names"),
      launch: cue.at("In early"),
      early: cue.at("early"),
      silkRoad: cue.at("Silk"),
      shop: cue.at("looked"),
      listings: cue.at("Listings"),
      stars: cue.at("star"),
      reviews: cue.at("reviews"),
      reveal: cue.at("everything"),
      illegal: cue.at("illegal"),
      run: cue.at("To run"),
      became: cue.at("became"),
      alias: cue.at("Dread"),
      aliasEnd: cue.end("Roberts"),
      princess: cue.at("Princess"),
      lineup: cue.at("where", 1),
      title: cue.at("pirate's"),
      pass1: cue.at("passed"),
      pass2: cue.at("person"),
      pass3: cue.at("person", 1),
      perfect: cue.at("perfect"),
      disguise: cue.at("disguise"),
    }),
    [cue],
  );

type Beats = ReturnType<typeof useBeats>;
type SceneProps = { b: Beats; start: number };

const mono = (size: number, color: string = colors.text): React.CSSProperties => ({
  fontFamily: fonts.mono,
  fontSize: size,
  color,
});

// ─── Scene 1: rewind ─────────────────────────────────────────────────
const SceneRewind: React.FC<SceneProps> = ({ b, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = (a: number) => a - start;
  const rw = frame - rel(b.rewind);
  const rewinding = rw >= 0 && rw < 26;
  const amount = rewinding ? 0.25 + 0.3 * Math.sin((rw / 26) * Math.PI) : 0;
  const tag = sp(frame, fps, rel(b.rewind), springs.pop);
  const exit = sp(frame, fps, rel(b.ross) - 6, springs.snappy);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 + exit * 0.15})` }}>
      <Terminal
        style={{ position: "absolute", left: 0, right: 0, top: 230 }}
        align="center"
        fontSize={46}
        color={colors.text}
        showCursor={frame < rel(b.rewind)}
        lines={[{ text: "how did we get here?", prompt: "> ", at: rel(b.question), durationInFrames: 26 }]}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Glitch amount={amount} seed="rewind">
          <Counter
            from={2013}
            to={2011}
            at={rel(b.rewind)}
            durationInFrames={26}
            fontSize={330}
            format={(n) => String(n)}
            color={rw >= 0 ? colors.amber : colors.green}
          />
        </Glitch>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 720,
          textAlign: "center",
          ...mono(46, colors.amber),
          fontWeight: 700,
          letterSpacing: "0.3em",
          transform: `scale(${tag})`,
          opacity: rw >= 0 ? 0.65 + 0.35 * Math.sin(frame / 3) : 0,
        }}
      >
        ◀◀ REWIND · 2 YEARS
      </div>
      <GlitchBars amount={amount * 1.6} seed="rewind-bars" />
    </AbsoluteFill>
  );
};

// ─── Scene 2: the case file on Ross ──────────────────────────────────
const FileRow: React.FC<{ at: number; label: string; value: string; color?: string }> = ({
  at,
  label,
  value,
  color = colors.text,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = sp(frame, fps, at, springs.snappy);
  if (frame < at) return <div style={{ height: 96 }} />;
  return (
    <div
      style={{
        height: 96,
        display: "flex",
        alignItems: "center",
        gap: 26,
        borderBottom: `2px solid ${colors.line}`,
        opacity: Math.min(1, s * 2),
        transform: `translateX(${(1 - s) * 60}px)`,
      }}
    >
      <div style={{ ...mono(30, colors.dim), width: 290, letterSpacing: "0.14em" }}>{label}</div>
      <div style={{ ...mono(58, color), fontWeight: 700, textShadow: `0 0 22px ${color}44` }}>
        <DecodeText text={value} at={at} durationInFrames={10} />
      </div>
    </div>
  );
};

const SceneRoss: React.FC<SceneProps> = ({ b, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = (a: number) => a - start;
  const pop = sp(frame, fps, 0, springs.pop);
  const exit = sp(frame, fps, rel(b.idea) - 6, springs.snappy);

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `translateX(${-exit * 120}px)` }}>
      <div
        style={{
          position: "absolute",
          left: 170,
          top: 190,
          transform: `scale(${pop})`,
          transformOrigin: "center bottom",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "-40px -60px",
            background: "radial-gradient(ellipse at 50% 55%, rgba(143,163,181,0.16), rgba(0,0,0,0) 65%)",
          }}
        />
        <BlobCharacter color={colors.ross} size={560} seed={4} look={{ x: 0.7, y: 0 }} />
      </div>
      <div style={{ position: "absolute", left: 760, top: 150, ...mono(28, colors.green), letterSpacing: "0.22em" }}>
        CASE FILE // SUBJECT 001
      </div>
      <TitleSlam
        text="ROSS ULBRICHT"
        fontSize={210}
        at={0}
        style={{ left: 756, right: "auto", top: 196, alignItems: "flex-start" }}
      />
      <div style={{ position: "absolute", left: 760, top: 430, width: 1020 }}>
        <FileRow at={rel(b.age)} label="AGE" value="LATE 20s" />
        <FileRow at={rel(b.physics)} label="DEGREE" value="PHYSICS" />
        <FileRow at={rel(b.scout)} label="RECORD" value="EAGLE SCOUT" />
        <FileRow at={rel(b.believer)} label="BELIEVES IN" value="ONE BIG IDEA" color={colors.amber} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: the idea ───────────────────────────────────────────────
const SceneIdea: React.FC<SceneProps> = ({ b, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = (a: number) => a - start;
  const inL = sp(frame, fps, 2, springs.pop);
  const inR = sp(frame, fps, 6, springs.pop);
  const buy = sp(frame, fps, rel(b.buy), springs.smooth, 16);
  const sell = sp(frame, fps, rel(b.sell), springs.smooth, 16);
  const gov = sp(frame, fps, rel(b.noGov), springs.slam);
  const cross = sp(frame, fps, rel(b.noGov) + 8, springs.smooth, 12);
  const govOn = frame >= rel(b.noGov);
  const LX = 470;
  const RX = 1450;
  const arc = (t: number) => -Math.sin(Math.min(1, t) * Math.PI) * 120;

  return (
    <GlitchTransition at={rel(b.tools) - 8} durationInFrames={8} mode="out" seed="idea-out">
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", ...mono(34, colors.dim) }}>
        &gt; the idea:
      </div>
      <TitleSlam text="A FREE MARKET" color={colors.green} fontSize={190} at={rel(b.free)} style={{ top: 150 }} />

      {/* buyer and seller */}
      <div style={{ position: "absolute", left: LX - 150, top: 420, transform: `scale(${inL})`, transformOrigin: "center bottom" }}>
        <BlobCharacter color={colors.ross} size={360} seed={5} look={{ x: 0.9, y: 0 }} />
      </div>
      <div style={{ position: "absolute", left: RX - 150, top: 420, transform: `scale(${inR})`, transformOrigin: "center bottom" }}>
        <BlobCharacter color={colors.extras[0]} size={360} seed={6} look={{ x: -0.9, y: 0 }} />
      </div>
      <div style={{ position: "absolute", left: LX - 60, top: 800, ...mono(30, colors.dim), letterSpacing: "0.2em" }}>BUYER</div>
      <div style={{ position: "absolute", left: RX - 70, top: 800, ...mono(30, colors.dim), letterSpacing: "0.2em" }}>SELLER</div>

      {/* coin goes right on "buy", package comes back on "sell" */}
      <div
        style={{
          position: "absolute",
          left: interpolate(buy, [0, 1], [LX + 130, RX - 220]),
          top: 560 + arc(buy),
          opacity: frame >= rel(b.buy) ? 1 : 0,
        }}
      >
        <CoinIcon size={90} />
      </div>
      <div
        style={{
          position: "absolute",
          left: interpolate(sell, [0, 1], [RX - 230, LX + 130]),
          top: 660 + arc(sell) * 0.6,
          width: 90,
          height: 80,
          borderRadius: 8,
          background: colors.panelLight,
          border: `3px solid ${colors.green}`,
          boxShadow: "0 0 26px rgba(57,255,136,0.3)",
          opacity: frame >= rel(b.sell) ? 1 : 0,
        }}
      >
        <div style={{ position: "absolute", left: 38, top: 0, bottom: 0, width: 10, background: colors.green, opacity: 0.6 }} />
      </div>

      {/* no government in the way */}
      {govOn ? (
        <div
          style={{
            position: "absolute",
            left: 960 - 130,
            top: 430,
            width: 260,
            transform: `scale(${interpolate(gov, [0, 1], [2.4, 1])})`,
            opacity: Math.min(1, gov * 3),
          }}
        >
          <BuildingIcon size={260} color={colors.text} />
          <div style={{ position: "absolute", left: -10, top: -10 }}>
            <CrossOut progress={cross} size={280} />
          </div>
          <div
            style={{
              marginTop: 18,
              textAlign: "center",
              whiteSpace: "nowrap",
              marginLeft: -120,
              marginRight: -120,
              fontFamily: fonts.display,
              fontSize: 84,
              color: colors.red,
              opacity: cross,
              textShadow: "0 0 30px rgba(255,59,59,0.5)",
            }}
          >
            NO GOVERNMENT
          </div>
        </div>
      ) : null}
    </GlitchTransition>
  );
};

// ─── Scene 4: two tools ──────────────────────────────────────────────
const Redact: React.FC<{ text: string; at: number; color?: string }> = ({ text, at, color = colors.text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = sp(frame, fps, at, springs.snappy);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {text}
      <span
        style={{
          position: "absolute",
          left: -4,
          top: 2,
          bottom: 2,
          width: `calc(${w * 100}% + ${w * 8}px)`,
          background: color,
        }}
      />
    </span>
  );
};

const ToolCard: React.FC<{
  at: number;
  slotAt: number;
  n: string;
  title: string;
  accent: string;
  left: number;
  children: React.ReactNode;
}> = ({ at, slotAt, n, title, accent, left, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slot = sp(frame, fps, slotAt, springs.snappy);
  const on = sp(frame, fps, at, springs.pop);
  const active = frame >= at;
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: 220,
        width: 800,
        height: 600,
        borderRadius: 14,
        border: `2px ${active ? "solid" : "dashed"} ${active ? accent : colors.line}`,
        background: active ? colors.panel : "transparent",
        boxShadow: active ? `0 0 90px ${accent}22, 0 40px 100px rgba(0,0,0,0.6)` : "none",
        opacity: Math.min(1, slot * 2),
        transform: `scale(${0.9 + 0.1 * slot + (active ? 0.04 * (1 - on) : 0)})`,
        padding: "30px 40px",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
        <div style={{ ...mono(34, active ? accent : colors.dim), fontWeight: 700 }}>{n}</div>
        {active ? (
          <div
            style={{
              fontFamily: fonts.display,
              fontSize: 150,
              lineHeight: 0.9,
              color: accent,
              textShadow: `0 0 40px ${accent}55`,
              transform: `scale(${0.6 + 0.4 * on})`,
              transformOrigin: "left bottom",
            }}
          >
            {title}
          </div>
        ) : null}
      </div>
      {active ? children : null}
    </div>
  );
};

const SceneTools: React.FC<SceneProps> = ({ b, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = (a: number) => a - start;
  const exit = sp(frame, fps, rel(b.launch) - 6, springs.snappy);
  const nodes = [70, 245, 420, 595, 700];
  const t = ((frame - rel(b.tor)) % 50) / 50;
  const px = interpolate(t, [0, 1], [nodes[0], nodes[4]]);
  const bank = sp(frame, fps, rel(b.noBank), springs.pop);
  const bankX = sp(frame, fps, rel(b.noBank) + 5, springs.smooth, 10);
  const names = sp(frame, fps, rel(b.noNames), springs.pop);
  const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 22, height: 62, ...mono(36) };

  return (
    <AbsoluteFill style={{ opacity: 1 - exit, transform: `scale(${1 - exit * 0.1})` }}>
      <Terminal
        style={{ position: "absolute", left: 130, top: 120 }}
        fontSize={44}
        color={colors.text}
        lines={[{ text: "two new tools made it possible", prompt: "> ", at: rel(b.toolsHead), durationInFrames: 34 }]}
      />

      <ToolCard at={rel(b.tor)} slotAt={rel(b.toolCards)} n="01" title="TOR" accent={colors.green} left={130}>
        <svg width={720} height={170} viewBox="0 0 770 170" style={{ marginTop: 26 }}>
          <path d={`M ${nodes[0]} 80 H ${nodes[4]}`} stroke={colors.greenDim} strokeWidth={4} strokeDasharray="10 10" />
          {nodes.map((x, i) => {
            const end = i === 0 || i === 4;
            const near = Math.max(0, 1 - Math.abs(px - x) / 60);
            return (
              <g key={x}>
                {!end
                  ? [34, 25, 16].map((r, k) => (
                      <circle
                        key={r}
                        cx={x}
                        cy={80}
                        r={r + near * 4}
                        fill={colors.panel}
                        stroke={colors.green}
                        strokeWidth={3}
                        opacity={0.45 + k * 0.2 + near * 0.3}
                      />
                    ))
                  : null}
                {end ? <circle cx={x} cy={80} r={20} fill={i === 0 ? colors.text : colors.green} /> : null}
                <text x={x} y={152} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={22} fill={colors.dim}>
                  {i === 0 ? "you" : i === 4 ? "site" : `relay ${i}`}
                </text>
              </g>
            );
          })}
          <circle cx={px} cy={80} r={9} fill="#fff" style={{ filter: `drop-shadow(0 0 10px ${colors.green})` }} />
        </svg>
        <div style={{ marginTop: 22 }}>
          <div style={row}>
            <span style={{ color: colors.dim, width: 150 }}>WHO</span>
            <Redact text="ross_u@home-pc" at={rel(b.who)} />
          </div>
          <div style={row}>
            <span style={{ color: colors.dim, width: 150 }}>WHERE</span>
            <Redact text="192.168.0.14 · USA" at={rel(b.where)} />
          </div>
        </div>
      </ToolCard>

      <ToolCard at={rel(b.bitcoin)} slotAt={rel(b.toolCards) + 4} n="02" title="BITCOIN" accent={colors.amber} left={990}>
        <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 30, height: 170 }}>
          <div style={{ transform: `rotate(${Math.sin(frame / 18) * 8}deg) translateY(${Math.sin(frame / 11) * 6}px)` }}>
            <CoinIcon size={160} />
          </div>
          <div style={{ ...mono(34, colors.dim), lineHeight: 1.5 }}>
            digital money
            <br />
            sent person to person
          </div>
        </div>
        <div style={{ marginTop: 22 }}>
          <div style={{ ...row, opacity: Math.min(1, bank * 2), transform: `scale(${0.8 + 0.2 * bank})`, transformOrigin: "left center" }}>
            <div style={{ position: "relative", width: 56, height: 56 }}>
              <BuildingIcon size={56} color={colors.text} />
              <div style={{ position: "absolute", left: 0, top: 0 }}>
                <CrossOut progress={bankX} size={56} />
              </div>
            </div>
            <span style={{ color: colors.red, fontWeight: 700 }}>NO BANK</span>
          </div>
          <div style={{ ...row, opacity: Math.min(1, names * 2), transform: `scale(${0.8 + 0.2 * names})`, transformOrigin: "left center" }}>
            <span style={{ color: colors.dim, width: 150 }}>NAME</span>
            <Redact text="Ross Ulbricht" at={rel(b.noNames) + 4} />
            <span style={{ color: colors.red, fontWeight: 700, marginLeft: 16 }}>NO NAMES</span>
          </div>
        </div>
      </ToolCard>
    </AbsoluteFill>
  );
};

// ─── Scene 5: Silk Road opens ────────────────────────────────────────
const LISTINGS = [
  { title: "Product #1", realTitle: "CANNABIS", price: "0.9 BTC", review: "fast shipping A+" },
  { title: "Product #2", realTitle: "MDMA", price: "2.1 BTC" },
  { title: "Product #3", realTitle: "LSD", price: "1.4 BTC", review: "would buy again" },
  { title: "Product #4", realTitle: "COCAINE", price: "6.0 BTC" },
  { title: "Product #5", realTitle: "HEROIN", price: "4.8 BTC", review: "5/5 stealth" },
  { title: "Product #6", realTitle: "FAKE IDs", price: "9.5 BTC" },
  { title: "Product #7", realTitle: "PILLS", price: "1.1 BTC", review: "legit seller" },
  { title: "Product #8", realTitle: "MUSHROOMS", price: "0.7 BTC" },
];

const SceneShop: React.FC<SceneProps> = ({ b, start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = (a: number) => a - start;
  const introExit = sp(frame, fps, rel(b.shop) - 5, springs.snappy);
  const shopOn = frame >= rel(b.shop) - 2;

  return (
    <AbsoluteFill>
      {introExit < 0.99 ? (
        <AbsoluteFill style={{ opacity: 1 - introExit, transform: `scale(${1 + introExit * 0.2})` }}>
          <Terminal
            style={{ position: "absolute", left: 0, right: 0, top: 250 }}
            align="center"
            fontSize={50}
            color={colors.text}
            lines={[{ text: "early 2011: launch", prompt: "> ", at: rel(b.early), durationInFrames: 24 }]}
          />
          <TitleSlam text="SILK ROAD" color={colors.green} fontSize={380} at={rel(b.silkRoad)} style={{ top: 350 }} underline />
        </AbsoluteFill>
      ) : null}

      {shopOn ? (
        <Sequence from={rel(b.shop) - 2} layout="none">
          <ShopWindow
            style={{ position: "absolute", left: 210, top: 70 }}
            width={1500}
            url="silkroad••••••••.onion"
            listings={LISTINGS}
            listingsAt={b.listings - b.shop + 2}
            starsAt={b.stars - b.shop + 2}
            reviewsAt={b.reviews - b.shop + 2}
            revealAt={b.reveal - b.shop + 2}
          />
        </Sequence>
      ) : null}

      <div style={{ position: "absolute", inset: 0, transform: "rotate(-9deg)" }}>
        <TitleSlam text="ILLEGAL" color={colors.red} fontSize={430} at={rel(b.illegal)} style={{ top: 250 }} />
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 6: becoming the Dread Pirate Roberts ──────────────────────
const SceneAlias: React.FC<SceneProps & { end: number }> = ({ b, start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = (a: number) => a - start;

  // part 1: Ross puts on the mask
  const pop = sp(frame, fps, 0, springs.pop);
  const sw = frame - rel(b.became);
  const swapGlitch = sw >= -3 && sw < 12 ? Math.sin(((sw + 3) / 15) * Math.PI) : 0;
  const hooded = sw >= 3;
  const hat = sp(frame, fps, rel(b.alias), springs.smooth, b.aliasEnd - b.alias + 4);
  const aliasIn = sp(frame, fps, rel(b.alias), springs.snappy);
  const chip = sp(frame, fps, rel(b.princess), springs.pop);
  const part1Exit = sp(frame, fps, rel(b.lineup) - 5, springs.snappy);

  // part 2: the title is passed along
  const XS = [330, 750, 1170, 1590];
  const lineColors = [colors.ross, colors.extras[0], colors.extras[1], colors.extras[2]];
  const hops = [b.pass1, b.pass2, b.pass3].map((a) => sp(frame, fps, rel(a), springs.smooth, 11));
  const hatX = XS[0] + hops.reduce((x, h, i) => x + h * (XS[i + 1] - XS[i]), 0);
  const hatY = hops.reduce((y, h) => y - Math.sin(Math.min(1, h) * Math.PI) * 110, 0);
  const wearer = hops.filter((h) => h > 0.5).length;
  const hatPop = sp(frame, fps, rel(b.title), springs.pop);
  const dg = frame - rel(b.disguise);
  const disguiseGlitch = dg >= -2 && dg < 10 ? Math.sin(((dg + 2) / 12) * Math.PI) : 0;
  const allHooded = dg >= 2;

  return (
    <GlitchTransition at={rel(end) - 9} durationInFrames={8} mode="out" seed="alias-out">
      {part1Exit < 0.99 ? (
        <AbsoluteFill style={{ opacity: 1 - part1Exit, transform: `scale(${1 - part1Exit * 0.1})` }}>
          <div style={{ position: "absolute", left: 500 - 105, top: 60 + Math.sin(frame / 20) * 5 }}>
            <PirateHat progress={hat} size={210} />
          </div>
          <div style={{ position: "absolute", left: 500 - 238, top: 240, transform: `scale(${pop})`, transformOrigin: "center bottom" }}>
            <Glitch amount={swapGlitch} seed="swap">
              {hooded ? (
                <BlobCharacter
                  color={colors.dpr}
                  accessory="hoodie"
                  size={550}
                  seed={1}
                  lightColor={colors.green}
                  lightAmount={0.8}
                />
              ) : (
                <BlobCharacter color={colors.ross} size={550} seed={1} />
              )}
            </Glitch>
          </div>
          <div style={{ position: "absolute", left: 900, top: 250, width: 900 }}>
            <Terminal
              fontSize={38}
              color={colors.dim}
              showCursor={frame < rel(b.alias)}
              lines={[{ text: "to run it, he became", prompt: "> ", at: 4, durationInFrames: 26 }]}
            />
            <div style={{ marginTop: 36, opacity: Math.min(1, aliasIn * 2), transform: `translateX(${(1 - aliasIn) * -40}px)` }}>
              <div style={{ fontFamily: fonts.display, fontSize: 170, lineHeight: 0.95, color: colors.text, textShadow: "0 0 40px rgba(230,230,230,0.25)" }}>
                <DecodeText text="DREAD PIRATE" at={rel(b.alias)} durationInFrames={14} />
                <br />
                <DecodeText text="ROBERTS" at={rel(b.alias) + 10} durationInFrames={12} />
              </div>
            </div>
            <div
              style={{
                marginTop: 34,
                display: "inline-block",
                padding: "12px 22px",
                border: `2px solid ${colors.amber}`,
                borderRadius: 6,
                ...mono(32, colors.amber),
                fontWeight: 700,
                letterSpacing: "0.06em",
                transform: `scale(${chip})`,
                transformOrigin: "left center",
              }}
            >
              SOURCE: "THE PRINCESS BRIDE"
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {frame >= rel(b.lineup) - 2 ? (
        <AbsoluteFill>
          <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", ...mono(34, colors.dim) }}>
            &gt; one title, passed from person to person
          </div>
          <TitleSlam text="THE PERFECT DISGUISE" color={colors.amber} fontSize={150} at={rel(b.perfect)} style={{ top: 150 }} />
          {XS.map((x, i) => {
            const s = sp(frame, fps, rel(b.lineup) + i * 3, springs.pop);
            const isWearer = i === wearer && frame >= rel(b.title);
            const past = i < wearer;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x - 147,
                  top: 470,
                  transform: `scale(${s})`,
                  transformOrigin: "center bottom",
                  opacity: allHooded ? 1 : past ? 0.4 : 1,
                }}
              >
                <Glitch amount={disguiseGlitch} seed={`dis-${i}`}>
                  {allHooded ? (
                    <BlobCharacter color={colors.dpr} accessory="hoodie" size={340} seed={i + 7} lightColor={colors.green} lightAmount={0.7} />
                  ) : (
                    <BlobCharacter color={lineColors[i]} size={340} seed={i + 7} look={{ x: isWearer ? 0 : i < wearer ? 0.8 : -0.8, y: isWearer ? -0.8 : 0 }} />
                  )}
                </Glitch>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: hatX - 85,
              top: 365 + hatY,
              transform: `scale(${hatPop}) rotate(${Math.sin(frame / 14) * 3}deg)`,
              opacity: allHooded ? 0 : 1,
            }}
          >
            <PirateHat progress={1} size={170} />
          </div>
        </AbsoluteFill>
      ) : null}
    </GlitchTransition>
  );
};

// ─── Clip 2 ──────────────────────────────────────────────────────────
export const Clip2: React.FC<z.infer<typeof clip2Schema>> = ({ showCaptions }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const cue = useMemo(() => createCues(words, fps), [fps]);
  const b = useBeats(cue);
  const seq = (from: number, to: number) => ({ from, durationInFrames: Math.max(1, to - from) });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <Audio src={staticFile("audio/clip2.mp3")} />
      <Background>
        <Sequence {...seq(0, b.ross + 8)} name="1 Rewind">
          <SceneRewind b={b} start={0} />
        </Sequence>
        <Sequence {...seq(b.ross, b.idea + 8)} name="2 Ross">
          <SceneRoss b={b} start={b.ross} />
        </Sequence>
        <Sequence {...seq(b.idea, b.tools)} name="3 Idea">
          <SceneIdea b={b} start={b.idea} />
        </Sequence>
        <Sequence {...seq(b.tools, b.launch + 8)} name="4 Tools">
          <SceneTools b={b} start={b.tools} />
        </Sequence>
        <Sequence {...seq(b.launch, b.run)} name="5 Shop">
          <SceneShop b={b} start={b.launch} />
        </Sequence>
        <Sequence {...seq(b.run, durationInFrames)} name="6 Alias">
          <SceneAlias b={b} start={b.run} end={durationInFrames} />
        </Sequence>
        <Flash at={b.noGov} color={colors.red} peak={0.3} durationInFrames={10} />
        <Flash at={b.illegal} color={colors.red} peak={0.55} />
      </Background>
      <Captions words={words} enabled={showCaptions} />
    </AbsoluteFill>
  );
};
