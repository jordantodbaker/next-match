import React from "react";
import Narrative from "./Narrative";
import { getNarrativeTypes, getNarratives } from "../actions/narrativeActions";
import { getCompanies } from "../actions/companyActions";

export default async function NarrativePage() {
  let narratives = await getNarratives();
  const narrativeTypes = await getNarrativeTypes();

  //console.log("Narratives", narratives);

  return (
    <div className="flex h-full w-full">
      <Narrative
        initialNarratives={narratives}
        narrativeTypes={narrativeTypes}
      />
    </div>
  );
}
