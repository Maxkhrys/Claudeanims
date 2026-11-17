import React from "react";
import { TitleSlam } from "../components";
import { clipTimings } from "./clipTimings";

/** Placeholder until the clip is built. */
export const Clip3: React.FC = () => (
  <TitleSlam text={`CLIP 3: ${clipTimings[2].title.toUpperCase()}`} fontSize={120} at={4} style={{ top: 420 }} sound={false} />
);
