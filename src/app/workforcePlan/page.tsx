import React from "react";
import WorkforcePlan from "./WorkforcePlan";
import { getNarratives } from "../actions/narrativeActions";
import { getCompanies } from "../actions/companyActions";
import { getWorkforcePlans } from "../actions/workforcePlansActions";
import { getRoles } from "../actions/rolesActions";

export default async function WorkforcePlanPage() {
  const workforcePlans = await getWorkforcePlans();
  const roles = await getRoles();
  return (
    <div className="flex h-full w-full">
      <WorkforcePlan workforcePlans={workforcePlans} roles={roles} />
    </div>
  );
}
