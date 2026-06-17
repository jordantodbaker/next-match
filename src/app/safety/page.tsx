import React from "react";
import Narrative from "./Narrative";
import { getNarratives } from "../actions/safetyActions";

export default async function SafetyPage() {
  const narratives = await getNarratives();

  return (
    <div className="flex h-full w-full">
      <Narrative narratives={narratives} />
    </div>
  );
}
