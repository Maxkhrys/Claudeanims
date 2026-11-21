import React from "react";
import { AbsoluteFill } from "remotion";
import { z } from "zod";
import { colors, fonts } from "../theme";
import { CamelLogo, Car, Cazes, Dpr, Grain, MarketLogo, SeizedStamp, Vignette, White } from "../components";

export const thumbnailSchema = z.object({ variant: z.enum(["email", "mistake", "silkroad"]) });

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

/** YouTube thumbnails. Render with `npm run thumb:video2` or `npm run thumb:video1`. */
export const Thumbnail: React.FC<z.infer<typeof thumbnailSchema>> = ({ variant }) => (
  <AbsoluteFill style={{ backgroundColor: "#06080A", overflow: "hidden" }}>
    {variant === "silkroad" ? (
      <>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 80% 55%, rgba(255,59,59,0.40), rgba(0,0,0,0) 58%)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 15% 20%, rgba(57,255,136,0.18), rgba(0,0,0,0) 55%)" }} />
        <div style={{ position: "absolute", left: 1150, top: 150 }}>
          <Dpr size={900} idle={0} expression="angry" lightColor={colors.red} lightAmount={1} />
        </div>
        <div style={{ position: "absolute", left: 1350, top: 40, display: "flex", alignItems: "center", gap: 18 }}>
          <CamelLogo size={120} />
          <span style={{ ...big(92, colors.green), textShadow: "none" }}>SILK ROAD</span>
        </div>
        <div style={{ position: "absolute", left: 70, top: 70, ...big(350, colors.text) }}>HE PAID FOR</div>
        <div style={{ position: "absolute", left: 80, top: 430 }}>
          <EmailTag text={'"Your problem has been taken care of."'} color={colors.green} size={43} />
        </div>
        <div style={{ position: "absolute", left: 70, top: 610, ...big(260, colors.red) }}>5 HITS</div>
        <div style={{ position: "absolute", left: 70, top: 830, ...big(260, colors.gold) }}>ALL FAKE</div>
        <SeizedStamp at={-60} text="SCAMMED" fontSize={120} rotate={-10} sound={false} style={{ left: 1250, top: 760 }} />
      </>
    ) : variant === "email" ? (
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

/** 9:16 cover for the vertical Silk Road parts (TikTok / Reels). Key content stays in the centre, which is what the profile grid shows. */
export const VerticalCover: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#06080A", overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 68%, rgba(255,59,59,0.46), rgba(0,0,0,0) 55%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 18%, rgba(57,255,136,0.20), rgba(0,0,0,0) 50%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
      <CamelLogo size={130} />
      <span style={{ ...big(104, colors.green), textShadow: "none" }}>SILK ROAD</span>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", ...big(262, colors.text) }}>HE PAID FOR</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 668, textAlign: "center", ...big(370, colors.red) }}>5 HITS</div>
    <div style={{ position: "absolute", left: 540 - 290, top: 960 }}>
      <Dpr size={670} idle={0} expression="angry" lightColor={colors.red} lightAmount={1} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center" }}>
      <div style={{ display: "inline-block", transform: "rotate(-4deg)", background: "rgba(6,8,10,0.9)", padding: "18px 60px 0", borderRadius: 18, border: `8px solid ${colors.gold}` }}>
        <div style={big(270, colors.gold)}>ALL FAKE</div>
      </div>
    </div>
    <Grain opacity={0.05} />
    <Vignette strength={0.55} />
  </AbsoluteFill>
);

/** 9:16 cover for the AlphaBay video, matching the "one email" thumbnail. */
export const VerticalCoverAlphaBay: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#06080A", overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(245,200,76,0.44), rgba(0,0,0,0) 55%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 18%, rgba(57,255,136,0.18), rgba(0,0,0,0) 50%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 265, display: "flex", justifyContent: "center" }}>
      <MarketLogo name="ALPHABAY" mark="alpha" size={84} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 410, textAlign: "center", ...big(300, colors.text) }}>ONE EMAIL</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
      <EmailTag text="pimp_alex_91@hotmail.com" color={colors.green} size={56} />
    </div>
    <div style={{ position: "absolute", left: 540 - 260, top: 850 }}>
      <Cazes size={600} sunglasses idle={0} />
    </div>
    <SeizedStamp at={-60} fontSize={76} rotate={10} sound={false} style={{ left: 700, top: 1150 }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1290, textAlign: "center" }}>
      <div style={{ display: "inline-block", transform: "rotate(-3deg)", background: "rgba(6,8,10,0.92)", padding: "22px 44px 6px", borderRadius: 18, border: `8px solid ${colors.gold}` }}>
        <div style={big(212, colors.gold)}>ENDED A $1B</div>
        <div style={big(250, colors.red)}>EMPIRE</div>
      </div>
    </div>
    <Grain opacity={0.05} />
    <Vignette strength={0.55} />
  </AbsoluteFill>
);

/** The hotel TV with the attacker's message, used on the Lapsus$ thumbnails. */
const HackedTv: React.FC<{ width: number }> = ({ width }) => {
  const h = width * 0.56;
  return (
    <div style={{ position: "relative", width, height: h }}>
      <div style={{ position: "absolute", inset: -40, background: "radial-gradient(ellipse at 50% 50%, rgba(255,59,59,0.5), rgba(0,0,0,0) 68%)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "#07090B", border: "10px solid #232C36", boxShadow: "0 0 80px rgba(255,59,59,0.45), 0 24px 50px rgba(0,0,0,0.8)", padding: `${h * 0.12}px ${width * 0.06}px`, display: "flex", flexDirection: "column", justifyContent: "center", gap: h * 0.06 }}>
        <div style={{ fontFamily: fonts.mono, fontSize: width * 0.04, color: colors.dim, letterSpacing: "0.1em" }}>TO: ALL STAFF</div>
        <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: width * 0.062, lineHeight: 1.3, color: colors.red, textShadow: "0 0 24px rgba(255,59,59,0.6)" }}>
          I am not a Rockstar
          <br />
          employee, I am an
          <br />
          attacker.
        </div>
      </div>
      {/* the streaming stick */}
      <div style={{ position: "absolute", right: -width * 0.11, top: h * 0.6, width: width * 0.12, height: h * 0.1, borderRadius: 8, background: "#1A2027", border: "3px solid #3A4753" }}>
        <div style={{ position: "absolute", right: 10, top: "28%", width: 12, height: 12, borderRadius: 6, background: colors.amber, boxShadow: `0 0 14px ${colors.amber}` }} />
      </div>
    </div>
  );
};

/** 16:9 thumbnail for video 3 (Lapsus$). */
export const ThumbnailLapsus: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#06080A", overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(255,59,59,0.34), rgba(0,0,0,0) 58%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 15% 20%, rgba(57,255,136,0.16), rgba(0,0,0,0) 55%)" }} />
    <div style={{ position: "absolute", left: 1215, top: 80 }}>
      <HackedTv width={600} />
    </div>
    <div style={{ position: "absolute", left: 1330, top: 520 }}>
      <White size={500} idle={0} look={{ x: 0, y: -0.6 }} />
    </div>
    <div style={{ position: "absolute", left: 70, top: 60, ...big(310, colors.text) }}>HE HACKED</div>
    <div style={{ position: "absolute", left: 70, top: 340, ...big(430, colors.amber) }}>GTA 6</div>
    <div style={{ position: "absolute", left: 70, top: 760, ...big(205, colors.red) }}>FROM A HOTEL TV</div>
    <SeizedStamp at={-60} text="AGE 17" fontSize={100} rotate={-9} sound={false} style={{ left: 870, top: 520 }} />
    <Grain opacity={0.05} />
    <Vignette strength={0.55} />
  </AbsoluteFill>
);

/** 9:16 cover for video 3 (Lapsus$). */
export const VerticalCoverLapsus: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#06080A", overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 58%, rgba(255,59,59,0.38), rgba(0,0,0,0) 55%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 16%, rgba(57,255,136,0.18), rgba(0,0,0,0) 50%)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center", ...big(262, colors.text) }}>HE HACKED</div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", ...big(430, colors.amber) }}>GTA 6</div>
    <div style={{ position: "absolute", left: 540 - 300, top: 900 }}>
      <HackedTv width={600} />
    </div>
    <div style={{ position: "absolute", left: 60, top: 1140 }}>
      <White size={330} idle={0} look={{ x: 0.8, y: -0.7 }} />
    </div>
    <SeizedStamp at={-60} text="AGE 17" fontSize={92} rotate={8} sound={false} style={{ left: 700, top: 1250 }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1440, textAlign: "center" }}>
      <div style={{ display: "inline-block", transform: "rotate(-3deg)", background: "rgba(6,8,10,0.92)", padding: "20px 40px 4px", borderRadius: 18, border: `8px solid ${colors.red}` }}>
        <div style={big(178, colors.red)}>FROM A HOTEL TV</div>
      </div>
    </div>
    <Grain opacity={0.05} />
    <Vignette strength={0.55} />
  </AbsoluteFill>
);

/** Lapsus$ thumbnail, variant B: fewer words, one idea. */
export const ThumbnailLapsusB: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#06080A", overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 30% 45%, rgba(255,181,71,0.30), rgba(0,0,0,0) 55%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 82% 60%, rgba(255,59,59,0.30), rgba(0,0,0,0) 50%)" }} />
    <div style={{ position: "absolute", left: 70, top: 110, ...big(520, colors.amber) }}>GTA 6</div>
    <div style={{ position: "absolute", left: 80, top: 720, ...big(200, colors.text) }}>BY A 17-YEAR-OLD</div>
    <SeizedStamp at={-60} text="LEAKED" fontSize={170} rotate={-8} sound={false} style={{ left: 760, top: 470 }} />
    <div style={{ position: "absolute", left: 1400, top: 130 }}>
      <White size={420} idle={0} look={{ x: -0.8, y: 0.3 }} />
    </div>
    <Grain opacity={0.05} />
    <Vignette strength={0.55} />
  </AbsoluteFill>
);

/** Lapsus$ thumbnail, variant C: curiosity. The object that did it, with an arrow. */
export const ThumbnailLapsusC: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#06080A", overflow: "hidden" }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 72% 55%, rgba(255,181,71,0.34), rgba(0,0,0,0) 55%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 15% 20%, rgba(57,255,136,0.14), rgba(0,0,0,0) 55%)" }} />
    <div style={{ position: "absolute", left: 70, top: 70, ...big(330, colors.text) }}>THIS</div>
    <div style={{ position: "absolute", left: 70, top: 370, ...big(330, colors.red) }}>HACKED</div>
    <div style={{ position: "absolute", left: 70, top: 670, ...big(330, colors.amber) }}>GTA 6</div>
    {/* the streaming stick, large */}
    <div style={{ position: "absolute", left: 1080, top: 430, width: 700, height: 210, borderRadius: 36, background: "linear-gradient(to bottom, #2A333D, #12171C)", border: "8px solid #47525E", transform: "rotate(-14deg)", boxShadow: "0 0 120px rgba(255,181,71,0.5), 0 40px 80px rgba(0,0,0,0.8)" }}>
      <div style={{ position: "absolute", left: -90, top: 60, width: 100, height: 90, borderRadius: "10px 0 0 10px", background: "#8C96A0", border: "6px solid #5A646E" }} />
      <div style={{ position: "absolute", right: 60, top: 78, width: 54, height: 54, borderRadius: 27, background: colors.amber, boxShadow: `0 0 50px ${colors.amber}` }} />
      <div style={{ position: "absolute", left: 70, top: 62, fontFamily: fonts.mono, fontSize: 66, fontWeight: 700, color: "#8C96A0", letterSpacing: "0.1em" }}>TV STICK</div>
    </div>
    {/* arrow from the words to the stick */}
    <svg width={520} height={300} viewBox="0 0 520 300" style={{ position: "absolute", left: 700, top: 150, overflow: "visible", filter: "drop-shadow(0 0 16px rgba(255,59,59,0.8))" }}>
      <path d="M 20 40 C 220 0 380 80 440 230" fill="none" stroke={colors.red} strokeWidth={22} strokeLinecap="round" />
      <path d="M 372 196 L 446 252 L 478 164" fill="none" stroke={colors.red} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <Grain opacity={0.05} />
    <Vignette strength={0.55} />
  </AbsoluteFill>
);
