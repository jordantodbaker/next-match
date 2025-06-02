import React from "react";
import Quantities from "./Costs";
import { getNarratives } from "../actions/narrativeActions";
import { getCompanies } from "../actions/companyActions";

export default async function NarrativePage() {
  let narratives = await getNarratives();
  const companies = await getCompanies();
  console.log(companies);

  narratives = narratives[0] === null ? [] : narratives;

  console.log("Narratives", narratives);

  return (
    <div className="flex h-full w-full">
      <Quantities />
    </div>
  );
}
