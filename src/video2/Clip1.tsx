import React from "react";
import { TitleSlam } from "../components";
import { clipTimings } from "./clipTimings";

/** Placeholder until the clip is built. */
export const Clip1: React.FC = () => (
  <TitleSlam text={`CLIP 1: ${clipTimings[0].title.toUpperCase()}`} fontSize={120} at={4} style={{ top: 420 }} sound={false} />
);
