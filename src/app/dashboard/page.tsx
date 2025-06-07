import React from "react";
import Dashboard from "./Dashboard";
import { getNarrativeTypes } from "../actions/narrativeTypeActions";
import { getNarratives as getSafetyNarratives } from "../actions/safetyActions";
import { getNarratives } from "../actions/narrativeActions";

export default async function AdminPage() {
  const safetyNarratives = await getSafetyNarratives();
  const narratives = await getNarratives();
  console.log({ safetyNarratives });
  console.log({ narratives });

  return (
    <div className="flex h-full w-full">
      <Dashboard safetyNarratives={safetyNarratives} narratives={narratives} />
    </div>
  );
}
