import React from "react";
import { useCurrentFrame, useVideoConfig, random, interpolate } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";

export type ChatMessage = {
  text: string;
  /** frame (local) when the message starts typing out */
  at: number;
  /** frame (local) when typing dots appear; omit for no dots */
  typingFrom?: number;
  /** characters per second */
  cps?: number;
  /** a reply from the other side: right-aligned, in `ownColor` */
  own?: boolean;
  /** small name shown above the bubble */
  label?: string;
};

const SCRAMBLE = "abcdefghijkmnopqrstuvwxyz0123456789#$%&@";

/** Text that resolves from scrambled characters, left to right. */
export const DecodeText: React.FC<{ text: string; at: number; durationInFrames?: number }> = ({
  text,
  at,
  durationInFrames = 14,
}) => {
  const f = useCurrentFrame();
  const t = Math.min(1, Math.max(0, (f - at) / durationInFrames));
  const solved = Math.floor(t * text.length);
  return (
    <>
      {text
        .split("")
        .map((ch, i) =>
          i < solved || ch === " "
            ? ch
            : SCRAMBLE[Math.floor(random(`dec-${text}-${i}-${Math.floor(f / 2)}`) * SCRAMBLE.length)],
        )
        .join("")}
    </>
  );
};

const TypingDots: React.FC<{ color: string }> = ({ color }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", height: 36 }}>
      {[0, 1, 2].map((i) => {
        const w = Math.max(0, Math.sin(f / 4 - i * 0.9));
        return (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: color,
              opacity: 0.35 + 0.65 * w,
              transform: `translateY(${-7 * w}px)`,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Dark-web style private-message window.
 * All frame props are local to the window (wrap it in a <Sequence>).
 */
export const ChatWindow: React.FC<{
  width?: number;
  title?: string;
  sender: {
    name: string;
    color?: string;
    avatar: React.ReactNode;
    /** shown until `revealAt` */
    hiddenAvatar?: React.ReactNode;
    /** frame when the sender's name decodes; omit to show it from the start */
    revealAt?: number;
  };
  recipient?: string;
  timestamp?: string;
  subject?: { text: string; urgent?: boolean; at?: number };
  messages: ChatMessage[];
  minBodyHeight?: number;
  /** frame when the window pops in */
  enterAt?: number;
  /** message text size */
  fontSize?: number;
  ownColor?: string;
  style?: React.CSSProperties;
}> = ({
  width = 1080,
  title = "private messages",
  sender,
  recipient,
  timestamp,
  subject,
  messages,
  minBodyHeight = 260,
  enterAt = 0,
  fontSize = 34,
  ownColor = colors.green,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = sp(frame, fps, enterAt, springs.snappy);
  const accent = sender.color ?? colors.green;
  const revealAt = sender.revealAt ?? enterAt;
  const revealed = frame >= revealAt;
  const avatarPop = sender.revealAt === undefined ? 1 : sp(frame, fps, revealAt, springs.pop);

  const subjAt = subject?.at ?? enterAt;
  const subjIn = sp(frame, fps, subjAt, springs.snappy);
  const subjColor = subject?.urgent ? colors.red : colors.dim;
  const urgentPulse = subject?.urgent ? 0.75 + 0.25 * Math.sin((frame - subjAt) / 4) : 1;

  if (frame < enterAt) return null;

  return (
    <div
      style={{
        width,
        fontFamily: fonts.mono,
        color: colors.text,
        background: colors.panel,
        border: `2px solid ${colors.line}`,
        borderRadius: 14,
        boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(57,255,136,0.06), 0 0 80px rgba(57,255,136,0.07)`,
        overflow: "hidden",
        opacity: interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        transform: `translateY(${(1 - enter) * 50}px) scale(${0.9 + 0.1 * enter})`,
        ...style,
      }}
    >
      {/* title bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 22px",
          background: "#090D10",
          borderBottom: `2px solid ${colors.line}`,
          fontSize: 22,
          color: colors.dim,
        }}
      >
        {[colors.red, colors.amber, colors.green].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.75 }} />
        ))}
        <div style={{ marginLeft: 14, letterSpacing: "0.04em" }}>{title}</div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            background: colors.green,
            boxShadow: `0 0 10px ${colors.green}`,
            opacity: 0.6 + 0.4 * Math.sin(frame / 9),
          }}
        />
        <div>tor: connected · pgp</div>
      </div>

      {/* header */}
      <div
        style={{
          display: "flex",
          gap: 26,
          padding: "26px 30px 22px",
          borderBottom: `2px solid ${colors.line}`,
          alignItems: "center",
        }}
      >
        <div style={{ width: 104, height: 104, flexShrink: 0, position: "relative" }}>
          {revealed ? (
            <div style={{ transform: `scale(${avatarPop})` }}>{sender.avatar}</div>
          ) : (
            sender.hiddenAvatar ?? sender.avatar
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span style={{ fontSize: 22, color: colors.dim }}>FROM</span>
            <span
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: revealed ? accent : colors.dim,
                textShadow: revealed ? `0 0 22px ${accent}55` : "none",
              }}
            >
              {revealed ? (
                <DecodeText text={sender.name} at={revealAt} />
              ) : (
                <DecodeText text={"x".repeat(sender.name.length)} at={1e9} />
              )}
            </span>
            <div style={{ flex: 1 }} />
            {timestamp ? <span style={{ fontSize: 22, color: colors.dim }}>{timestamp}</span> : null}
          </div>
          {recipient ? (
            <div style={{ fontSize: 22, color: colors.dim, marginTop: 6 }}>
              TO&nbsp;&nbsp;&nbsp;<span style={{ color: colors.text, opacity: 0.8 }}>{recipient}</span>
            </div>
          ) : null}
          {subject ? (
            <div
              style={{
                marginTop: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: 14,
                padding: "8px 16px",
                border: `2px solid ${subjColor}`,
                background: subject.urgent ? "rgba(255,59,59,0.12)" : "transparent",
                borderRadius: 6,
                fontSize: 28,
                fontWeight: 700,
                color: subjColor,
                opacity: frame >= subjAt ? urgentPulse : 0,
                transform: `scale(${0.7 + 0.3 * subjIn})`,
                transformOrigin: "left center",
                boxShadow: subject.urgent ? `0 0 30px rgba(255,59,59,${0.35 * urgentPulse})` : "none",
              }}
            >
              <span style={{ opacity: 0.7, fontWeight: 400 }}>SUBJECT:</span>
              <span style={{ letterSpacing: "0.06em" }}>{subject.text}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* body */}
      <div
        style={{
          padding: "28px 30px 34px",
          minHeight: minBodyHeight,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          alignItems: "flex-start",
        }}
      >
        {messages.map((m, i) => {
          const isLatest = !messages.some((o, j) => j > i && frame >= o.at);
          const mAccent = m.own ? ownColor : accent;
          const dots = m.typingFrom !== undefined && frame >= m.typingFrom && frame < m.at;
          if (dots) {
            const dIn = sp(frame, fps, m.typingFrom!, springs.pop);
            return (
              <div
                key={i}
                style={{
                  padding: "18px 26px",
                  background: colors.panelLight,
                  border: `2px solid ${colors.line}`,
                  borderRadius: 14,
                  transform: `scale(${dIn})`,
                  transformOrigin: m.own ? "right bottom" : "left bottom",
                  alignSelf: m.own ? "flex-end" : "flex-start",
                }}
              >
                <TypingDots color={mAccent} />
              </div>
            );
          }
          if (frame < m.at) return null;
          const cps = m.cps ?? 40;
          const chars = Math.min(m.text.length, Math.floor(((frame - m.at) / fps) * cps));
          const typing = chars < m.text.length;
          return (
            <div
              key={i}
              style={{
                padding: "20px 26px",
                background: colors.panelLight,
                border: `2px solid ${colors.line}`,
                borderLeft: m.own ? `2px solid ${colors.line}` : `4px solid ${accent}`,
                borderRight: m.own ? `4px solid ${ownColor}` : `2px solid ${colors.line}`,
                borderRadius: 10,
                fontSize,
                lineHeight: 1.45,
                whiteSpace: "pre-wrap",
                alignSelf: m.own ? "flex-end" : "flex-start",
                maxWidth: "92%",
              }}
            >
              {m.label ? (
                <div style={{ fontSize: fontSize * 0.6, color: mAccent, marginBottom: 4, fontWeight: 700 }}>
                  {m.label}
                </div>
              ) : null}
              <span>{m.text.slice(0, chars)}</span>
              <span
                style={{
                  display: "inline-block",
                  width: fontSize * 0.52,
                  height: fontSize * 1.05,
                  verticalAlign: "-0.18em",
                  marginLeft: 2,
                  background: mAccent,
                  opacity: typing || (isLatest && Math.floor(frame / 8) % 2 === 0) ? 1 : 0,
                }}
              />
              {/* reserve final size so the bubble doesn't reflow while typing */}
              <span style={{ opacity: 0 }}>{m.text.slice(chars)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
