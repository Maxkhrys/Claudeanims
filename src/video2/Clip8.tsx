import React from "react";
import { TitleSlam } from "../components";
import { clipTimings } from "./clipTimings";

/** Placeholder until the clip is built. */
export const Clip8: React.FC = () => (
  <TitleSlam text={`CLIP 8: ${clipTimings[7].title.toUpperCase()}`} fontSize={120} at={4} style={{ top: 420 }} sound={false} />
);
