import React from "react";
import Companies from "./Companies";
import { getCompanies } from "../../actions/companyActions";

export default async function AdminPage() {
  const companies = await getCompanies();

  return (
    <div className="flex h-full w-full bg-blue-200">
      <Companies companies={companies} />
    </div>
  );
}
