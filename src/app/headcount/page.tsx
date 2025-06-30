import React from "react";
import Headcount from "./Headcount";
import { getNarratives } from "../actions/narrativeActions";
import { getCompanies, getCompany } from "../actions/companyActions";
import { getRoles } from "../actions/rolesActions";
import { getHeadcount } from "../actions/headcountActions";

export default async function NarrativePage() {
  const roles = await getRoles();
  const company = await getCompany();
  const headcount = await getHeadcount();

  return (
    <div className="flex h-full w-full">
      <Headcount roles={roles} company={company} headcount={headcount[0]} />
    </div>
  );
}
