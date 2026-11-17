import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, springs } from "../theme";
import { sp } from "../lib/timing";
import { Sfx } from "./Sfx";

export type EmailHighlight = {
  /** substring of the sender address to highlight */
  text: string;
  at: number;
  color?: string;
};

/**
 * Email client view. `zoom` scales the whole card around the From line, so
 * animating it 1 -> 2.4 pushes in on the sender address.
 * The address can type out (`typeAt`), start blurred (`blur`), and have
 * parts of it highlighted.
 */
export const EmailHeader: React.FC<{
  width?: number;
  at?: number;
  subject: string;
  fromName: string;
  fromAddress: string;
  to?: string;
  date?: string;
  body?: string[];
  /** frame the address starts typing; omit to show it immediately */
  typeAt?: number;
  typeDuration?: number;
  /** 0..1 blur on the address */
  blur?: number;
  highlights?: EmailHighlight[];
  zoom?: number;
  style?: React.CSSProperties;
}> = ({
  width = 1300,
  at = 0,
  subject,
  fromName,
  fromAddress,
  to = "new user",
  date,
  body = [],
  typeAt,
  typeDuration = 60,
  blur = 0,
  highlights = [],
  zoom = 1,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const enter = sp(frame, fps, at, springs.snappy);
  const chars =
    typeAt === undefined
      ? fromAddress.length
      : Math.max(0, Math.min(fromAddress.length, Math.floor(((frame - typeAt) / typeDuration) * fromAddress.length)));
  const shown = fromAddress.slice(0, chars);

  // split the address into highlighted and plain runs
  const marks = highlights
    .map((h) => ({ ...h, i: fromAddress.indexOf(h.text) }))
    .filter((h) => h.i >= 0)
    .sort((a, b) => a.i - b.i);
  const runs: React.ReactNode[] = [];
  let pos = 0;
  marks.forEach((h, k) => {
    if (h.i > pos) runs.push(shown.slice(pos, h.i));
    const on = frame >= h.at;
    const p = sp(frame, fps, h.at, springs.pop);
    const c = h.color ?? colors.amber;
    runs.push(
      <span
        key={k}
        style={{
          display: "inline-block",
          background: on ? c : "transparent",
          color: on ? colors.bg : undefined,
          borderRadius: 6,
          padding: "0 4px",
          margin: "0 -4px",
          transform: `scale(${on ? 1 + 0.25 * (1 - p) : 1})`,
          boxShadow: on ? `0 0 30px ${c}` : "none",
        }}
      >
        {shown.slice(h.i, h.i + h.text.length)}
      </span>,
    );
    pos = h.i + h.text.length;
  });
  runs.push(shown.slice(pos));

  const row: React.CSSProperties = { display: "flex", alignItems: "baseline", gap: 20, padding: "9px 0" };
  const label: React.CSSProperties = { width: 130, fontSize: 24, color: colors.dim, letterSpacing: "0.1em", flexShrink: 0 };

  return (
    <div
      style={{
        position: "absolute",
        width,
        ...style,
        transform: `translateY(${(1 - enter) * 50}px) scale(${(0.92 + 0.08 * enter) * zoom})`,
        transformOrigin: "30% 38%",
        opacity: Math.min(1, enter * 2.5),
      }}
    >
      <Sfx name="notify" at={at} />
      {typeAt !== undefined ? <Sfx name="type" at={typeAt} durationInFrames={typeDuration} loop /> : null}
      {marks.map((h, k) => (
        <Sfx key={k} name="pop" at={h.at} />
      ))}
      <div
        style={{
          fontFamily: fonts.mono,
          color: colors.text,
          background: colors.panel,
          border: `2px solid ${colors.line}`,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 80px rgba(57,255,136,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 22px", background: "#090D10", borderBottom: `2px solid ${colors.line}`, fontSize: 22, color: colors.dim }}>
          {[colors.red, colors.amber, colors.green].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c, opacity: 0.75 }} />
          ))}
          <span style={{ marginLeft: 14 }}>inbox · message source</span>
        </div>
        <div style={{ padding: "22px 34px 10px", fontSize: 44, fontWeight: 700 }}>{subject}</div>
        <div style={{ padding: "4px 34px 18px", borderBottom: `2px solid ${colors.line}` }}>
          <div style={row}>
            <span style={label}>FROM</span>
            <span style={{ fontSize: 30 }}>{fromName}</span>
            <span style={{ fontSize: 36, fontWeight: 700, color: colors.green, filter: blur > 0.01 ? `blur(${blur * 10}px)` : undefined, textShadow: `0 0 22px ${colors.green}55` }}>
              &lt;{runs}
              {chars >= fromAddress.length ? ">" : <span style={{ opacity: Math.floor(frame / 6) % 2 ? 0.2 : 1 }}>▌</span>}
            </span>
          </div>
          <div style={row}>
            <span style={label}>TO</span>
            <span style={{ fontSize: 28, opacity: 0.8 }}>{to}</span>
          </div>
          {date ? (
            <div style={row}>
              <span style={label}>DATE</span>
              <span style={{ fontSize: 28, opacity: 0.8 }}>{date}</span>
            </div>
          ) : null}
        </div>
        <div style={{ padding: "24px 34px 30px", fontSize: 30, lineHeight: 1.6, minHeight: 120 }}>
          {body.map((l, i) => (
            <div key={i}>{l || " "}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
