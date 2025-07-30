import React from "react";
import WorkforcePlan from "./WorkforcePlan";
import { getCompany } from "../actions/companyActions";
import { getWorkforcePlans } from "../actions/workforcePlansActions";
import Wrapper from "./Wrapper";
import { getUser } from "../actions/userActions";
import { emptyUser } from "@/lib/schemas/defaultModels";

export default async function WorkforcePlanPage() {
  const company = await getCompany();
  const workforcePlans = await getWorkforcePlans();
  const userResult = await getUser();

  const user = userResult.status === "success" ? userResult.data : emptyUser;

  return (
    <div className="flex h-full w-full">
      <Wrapper workforcePlans={workforcePlans} company={company} user={user} />
    </div>
  );
}
