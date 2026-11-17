import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { colors, fonts } from "../theme";
import { Car, Cazes, Dpr, Grain, MarketLogo, SeizedStamp, Vignette } from "../components";

export const thumbnailSchema = z.object({ variant: z.enum(["email", "mistake"]) });

const big = (size: number, color: string): React.CSSProperties => ({
  fontFamily: fonts.display,
  fontSize: size,
  lineHeight: 0.88,
  color,
  letterSpacing: "0.01em",
  whiteSpace: "nowrap",
  textShadow: `0 10px 0 rgba(0,0,0,0.75), 0 0 60px ${color}55`,
});

const EmailTag: React.FC<{ text: string; color: string; size?: number; rotate?: number }> = ({ text, color, size = 66, rotate = -3 }) => (
  <div
    style={{
      display: "inline-block",
      padding: "14px 30px",
      background: "#05070A",
      border: `6px solid ${color}`,
      borderRadius: 14,
      fontFamily: fonts.mono,
      fontWeight: 700,
      fontSize: size,
      color,
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 0 70px ${color}88, 0 18px 40px rgba(0,0,0,0.8)`,
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);

/** YouTube thumbnail for video 2. Render with `npm run thumb:video2`. */
export const Thumbnail: React.FC<z.infer<typeof thumbnailSchema>> = ({ variant }) => (
  <AbsoluteFill style={{ backgroundColor: "#06080A", overflow: "hidden" }}>
    {variant === "email" ? (
      <>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 80% 55%, rgba(245,200,76,0.42), rgba(0,0,0,0) 58%)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 15% 20%, rgba(57,255,136,0.16), rgba(0,0,0,0) 55%)" }} />
        <div style={{ position: "absolute", left: 1150, top: 150 }}>
          <Cazes size={900} sunglasses idle={0} />
        </div>
        <div style={{ position: "absolute", left: 1010, top: 800 }}>
          <Car type="supercar" size={560} />
        </div>
        <div style={{ position: "absolute", left: 1370, top: 60 }}>
          <MarketLogo name="ALPHABAY" mark="alpha" size={70} />
        </div>
        <div style={{ position: "absolute", left: 70, top: 70, ...big(370, colors.text) }}>ONE EMAIL</div>
        <div style={{ position: "absolute", left: 80, top: 450 }}>
          <EmailTag text="pimp_alex_91@hotmail.com" color={colors.green} size={68} />
        </div>
        <div style={{ position: "absolute", left: 70, top: 640, ...big(250, colors.gold) }}>ENDED A $1B</div>
        <div style={{ position: "absolute", left: 70, top: 850, ...big(250, colors.red) }}>EMPIRE</div>
        <SeizedStamp at={-60} fontSize={120} rotate={-10} sound={false} style={{ left: 1290, top: 690 }} />
      </>
    ) : (
      <>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 20% 60%, rgba(57,255,136,0.30), rgba(0,0,0,0) 50%)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 80% 60%, rgba(245,200,76,0.36), rgba(0,0,0,0) 50%)" }} />
        <div style={{ position: "absolute", left: 958, top: 0, width: 4, height: 1080, background: "rgba(255,255,255,0.12)" }} />
        <div style={{ position: "absolute", left: 180, top: 300 }}>
          <Dpr size={560} idle={0} lightAmount={1} />
        </div>
        <div style={{ position: "absolute", left: 1250, top: 300 }}>
          <Cazes size={560} sunglasses idle={0} />
        </div>
        <div style={{ position: "absolute", left: 90, top: 40, ...big(150, colors.green) }}>SILK ROAD · 2013</div>
        <div style={{ position: "absolute", right: 90, top: 40, ...big(150, colors.gold) }}>ALPHABAY · 2017</div>
        <div style={{ position: "absolute", left: 90, top: 205 }}>
          <EmailTag text="rossulbricht@gmail.com" color={colors.green} size={46} rotate={-2} />
        </div>
        <div style={{ position: "absolute", right: 90, top: 205 }}>
          <EmailTag text="pimp_alex_91@hotmail.com" color={colors.gold} size={46} rotate={2} />
        </div>
        <div style={{ position: "absolute", left: -40, right: -40, top: 720, height: 330, background: "rgba(6,8,10,0.9)", transform: "rotate(-3deg)", borderTop: `8px solid ${colors.red}`, borderBottom: `8px solid ${colors.red}`, display: "flex", justifyContent: "center", alignItems: "center", gap: 50 }}>
          <span style={big(300, colors.text)}>THE SAME</span>
          <span style={big(300, colors.red)}>MISTAKE</span>
        </div>
      </>
    )}
    <Grain opacity={0.05} />
    <Vignette strength={0.55} />
  </AbsoluteFill>
);
