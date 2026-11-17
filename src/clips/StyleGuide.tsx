import React from "react";
import { AbsoluteFill } from "remotion";
import { colors, fonts } from "../theme";
import { AvatarBadge, Background, BlobCharacter, PirateHat } from "../components";

const Tag: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: fonts.mono, fontSize: 26, color: colors.dim, marginTop: 16 }}>{children}</div>
);

/** Character and palette reference. Not part of the documentary. */
export const StyleGuide: React.FC = () => (
  <Background>
    <AbsoluteFill style={{ padding: 90, flexDirection: "column", gap: 40 }}>
      <div style={{ fontFamily: fonts.display, fontSize: 90, color: colors.text }}>DARK WEB CASE FILE</div>
      <div style={{ display: "flex", gap: 30, alignItems: "flex-end" }}>
        {(["calm", "angry"] as const).map((e) => (
          <div key={e} style={{ textAlign: "center" }}>
            <BlobCharacter color={colors.dpr} accessory="hoodie" expression={e} size={270} lightColor={colors.green} lightAmount={1} seed={1} />
            <Tag>DPR · {e}</Tag>
          </div>
        ))}
        {(["scared", "calm"] as const).map((e) => (
          <div key={e} style={{ textAlign: "center" }}>
            <BlobCharacter color={colors.chemist} expression={e} size={270} seed={2} />
            <Tag>FriendlyChemist · {e}</Tag>
          </div>
        ))}
        {(["calm", "angry"] as const).map((e) => (
          <div key={e} style={{ textAlign: "center" }}>
            <BlobCharacter color={colors.redandwhite} accessory="bikerVest" bulk={1.35} expression={e} size={270} seed={3} />
            <Tag>Redandwhite · {e}</Tag>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        <AvatarBadge icon="flask" color={colors.chemist} size={130} />
        <AvatarBadge icon="skull" color={colors.green} size={130} />
        <AvatarBadge icon="helmet" color={colors.redandwhite} size={130} />
        <AvatarBadge icon="unknown" size={130} />
        <PirateHat progress={1} size={170} />
        {[colors.green, colors.red, colors.amber, colors.text].map((c) => (
          <div key={c} style={{ width: 90, height: 90, borderRadius: 12, background: c }} />
        ))}
      </div>
    </AbsoluteFill>
  </Background>
);
