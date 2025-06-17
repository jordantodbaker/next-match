import React from "react";
import Quantities from "./Costs";
import { getNarratives } from "../actions/narrativeActions";
import { getCompanies } from "../actions/companyActions";

export default async function NarrativePage() {
  let narratives = await getNarratives();
  const companies = await getCompanies();
  narratives = narratives[0] === null ? [] : narratives;

  return (
    <div className="flex h-full w-full">
      <Quantities />
    </div>
  );
}
