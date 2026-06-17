import React from "react";
import Narrative from "./Narrative";
import { getNarratives } from "../actions/safetyActions";

export default async function AdminPage() {
  const narratives = await getNarratives();
  const intialNarratives = narratives.length > 0 ? narratives : [];
  return (
    <div className="flex h-full w-full">
      <Narrative narratives={intialNarratives} />
    </div>
  );
}
