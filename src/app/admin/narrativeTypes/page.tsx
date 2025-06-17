import React from "react";
import NarrativeTypes from "./NarrativeTypes";
import { getNarrativeTypes } from "../../actions/narrativeTypeActions";

export default async function AdminPage() {
  const narrativeTypes = await getNarrativeTypes();

  return (
    <div className="flex h-full w-full bg-blue-200">
      <NarrativeTypes narrativeTypes={narrativeTypes} />
    </div>
  );
}
