import React from "react";
import Dashboard from "./Dashboard";
import { getNarratives as getSafetyNarratives } from "../actions/safetyActions";
import { getNarratives } from "../actions/narrativeActions";

export default async function AdminPage() {
  const [safetyNarratives, narratives] = await Promise.all([
    getSafetyNarratives(),
    getNarratives(),
  ]);

  return (
    <div className="flex h-full w-full">
      <Dashboard safetyNarratives={safetyNarratives} narratives={narratives} />
    </div>
  );
}
