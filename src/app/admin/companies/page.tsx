import React from "react";
import Companies from "./Companies";
import { getCompanies } from "../../actions/companyActions";
import { getRoles } from "@/app/actions/rolesActions";

export default async function AdminPage() {
  const companies = await getCompanies();
  const roles = await getRoles();

  return (
    <div className="flex h-full w-full">
      <Companies companies={companies} roles={roles} />
    </div>
  );
}
