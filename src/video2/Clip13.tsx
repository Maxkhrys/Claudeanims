import React from "react";
import { TitleSlam } from "../components";
import { clipTimings } from "./clipTimings";

/** Placeholder until the clip is built. */
export const Clip13: React.FC = () => (
  <TitleSlam text={`CLIP 13: ${clipTimings[12].title.toUpperCase()}`} fontSize={120} at={4} style={{ top: 420 }} sound={false} />
);
