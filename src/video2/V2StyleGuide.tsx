import React from "react";
import { AbsoluteFill } from "remotion";
import { colors, fonts } from "../theme";
import {
  AssetGarage,
  Background,
  CamelLogo,
  Car,
  Cazes,
  Cop,
  EmailHeader,
  EvidenceBoard,
  MapPins,
  MarketLogo,
  OnionLogo,
  RossBlob,
  SeizedStamp,
} from "../components";

/** Reference sheet for the video 2 cast and components. Not part of the video. */
export const V2StyleGuide: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: colors.bg }}>
    <Background>
      <div style={{ position: "absolute", left: 60, top: 40, display: "flex", gap: 26, alignItems: "flex-end" }}>
        <Cazes size={230} />
        <Cazes size={230} sunglasses />
        <Cop size={230} />
        <Cop size={230} moustache />
        <RossBlob size={230} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 300, display: "flex", gap: 40, alignItems: "center" }}>
        <MarketLogo name="ALPHABAY" mark="alpha" size={70} />
        <MarketLogo name="HANSA" mark="hansa" size={70} />
        <MarketLogo name="AGORA" size={50} />
        <CamelLogo size={150} cracked />
        <OnionLogo size={70} />
      </div>
      <MapPins
        width={820}
        style={{ left: 60, top: 430 }}
        pins={[
          { lon: -72.5, lat: 46.3, label: "QUEBEC", at: 0 },
          { lon: 100.5, lat: 13.7, label: "BANGKOK", at: 0, side: "left" },
          { lon: 5, lat: 52, label: "NL", at: 0, color: colors.dutch, glow: true, side: "top" },
        ]}
        lines={[{ from: [-72.5, 46.3], to: [100.5, 13.7], at: 0, durationInFrames: 30, plane: true }]}
      />
      <EmailHeader
        width={900}
        style={{ left: 980, top: 40 }}
        subject="Welcome to AlphaBay!"
        fromName="AlphaBay"
        fromAddress="pimp_alex_91@hotmail.com"
        date="Dec 2014"
        body={["Welcome to the forums.", "Your account is ready."]}
        highlights={[
          { text: "alex", at: 0 },
          { text: "91", at: 0, color: colors.red },
        ]}
      />
      <AssetGarage width={860} height={300} openAt={-30} style={{ left: 980, top: 470 }}>
        <Car type="supercar" size={190} />
        <Car type="sedan" size={190} color={colors.text} />
        <Car type="mini" size={150} color={colors.red} />
        <Car type="bike" size={130} color={colors.agent} />
      </AssetGarage>
      <EvidenceBoard
        width={860}
        height={250}
        style={{ left: 980, top: 800 }}
        items={[
          { id: "a", x: 150, y: 90, at: 0, title: "HOTMAIL", sub: "pimp_alex_91" },
          { id: "b", x: 440, y: 150, at: 0, title: "LINKEDIN" },
          { id: "c", x: 720, y: 90, at: 0, title: "PAYPAL" },
        ]}
        strings={[
          { from: "a", to: "b", at: 0 },
          { from: "b", to: "c", at: 0 },
        ]}
      />
      <SeizedStamp at={0} style={{ left: 420, top: 860 }} />
      <div style={{ position: "absolute", left: 60, top: 900, fontFamily: fonts.mono, fontSize: 24, color: colors.dim }}>video 2 parts</div>
    </Background>
  </AbsoluteFill>
);
