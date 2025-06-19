import React from "react";
import WorkforcePlan from "./WorkforcePlan";
import { getNarratives } from "../actions/narrativeActions";
import { getCompanies } from "../actions/companyActions";
import { getWorkforcePlans } from "../actions/workforcePlansActions";

export default async function WorkforcePlanPage() {
  const workforcePlans = await getWorkforcePlans();
  //const roles = await getRoles();
  return (
    <div className="flex h-full w-full">
      <WorkforcePlan workforcePlans={workforcePlans} />
    </div>
  );
}
