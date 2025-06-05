import React from "react";
import NarrativeTypes from "./NarrativeTypes";
import { getNarrativeTypes } from "../../actions/narrativeTypeActions";

export default async function AdminPage() {
  const narrativeTypes = await getNarrativeTypes();
  console.log({ narrativeTypes });

  return (
    <div className="flex h-full w-full">
      <NarrativeTypes narrativeTypes={narrativeTypes} />
    </div>
  );
}
