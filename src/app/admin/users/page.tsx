import React from "react";
import Narrative from "../Narrative";
import { getNarratives } from "../../actions/safetyActions";
import { getCompanies } from "../../actions/companyActions";

export default async function AdminPage() {
  const narratives = await getNarratives();

  return (
    <div className="flex h-full w-full">
      <Narrative narratives={narratives} />
    </div>
  );
}
