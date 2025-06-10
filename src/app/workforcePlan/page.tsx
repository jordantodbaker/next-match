import React from "react";
import WorkforcePlan from "./WorkforcePlan";
import { getNarratives } from "../actions/narrativeActions";
import { getCompanies } from "../actions/companyActions";

export default async function WorkforcePlanPage() {
  const companies = await getCompanies();
  console.log(companies);

  return (
    <div className="flex h-full w-full">
      <WorkforcePlan />
    </div>
  );
}
