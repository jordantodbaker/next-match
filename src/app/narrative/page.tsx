import React from "react";
import Narrative from "./Narrative";
import { getNarrativeTypes, getNarratives } from "../actions/narrativeActions";

export default async function NarrativePage() {
  const [narratives, narrativeTypes] = await Promise.all([
    getNarratives(),
    getNarrativeTypes(),
  ]);

  return (
    <div className="flex h-full w-full">
      <Narrative
        initialNarratives={narratives}
        narrativeTypes={narrativeTypes}
      />
    </div>
  );
}
