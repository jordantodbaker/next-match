import React from "react";
import WorkforcePlan from "./WorkforcePlan";
import { getCompany } from "../actions/companyActions";
import { getWorkforcePlans } from "../actions/workforcePlansActions";


export default async function WorkforcePlanPage() {
  const company = await getCompany();
  const workforcePlans = await getWorkforcePlans();

  return (

      <div className="flex h-full w-full">
        <WorkforcePlan workforcePlans={workforcePlans} company={company} />
      </div>
  );
}
