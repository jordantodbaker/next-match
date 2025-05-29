import React from "react";
import Narrative from "./Narrative";
import { getNarratives } from "../actions/safetyActions";
import { getCompanies } from "../actions/companyActions";

export default async function SafetyPage() {
  const narratives = await getNarratives();
  const companies = await getCompanies();
  // console.log({ narratives });
  // console.log({ companies });
  return (
    <div className="flex h-full w-full">
      <Narrative narratives={narratives} companies={companies} />
    </div>
  );
}
