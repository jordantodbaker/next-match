import React from "react";
import Dashboard from "./Dashboard";
import { getNarrativeTypes } from "../actions/narrativeTypeActions";

export default async function AdminPage() {
  const narrativeTypes = await getNarrativeTypes();
  console.log({ narrativeTypes });

  return (
    <div className="flex h-full w-full">
      <Dashboard narrativeTypes={narrativeTypes} />
    </div>
  );
}
