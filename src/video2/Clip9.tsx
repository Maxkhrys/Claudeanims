import React from "react";
import { TitleSlam } from "../components";
import { clipTimings } from "./clipTimings";

/** Placeholder until the clip is built. */
export const Clip9: React.FC = () => (
  <TitleSlam text={`CLIP 9: ${clipTimings[8].title.toUpperCase()}`} fontSize={120} at={4} style={{ top: 420 }} sound={false} />
);
