import React from "react";
import WorkforcePlansPage from "./WorkforcePlans";
import { getCompanies } from "../../actions/companyActions";

export default async function AdminPage() {
  const companies = await getCompanies();

  return (
    <div className="flex h-full w-full">
      <WorkforcePlansPage companies={companies} />
    </div>
  );
}
