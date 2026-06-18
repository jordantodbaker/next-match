import React from "react";
import Companies from "./Companies";
import { getCompanies } from "../../actions/companyActions";
import { getRoles } from "@/app/actions/rolesActions";
import { getProjects } from "@/app/actions/projectActions";

export default async function AdminPage() {
  const [companies, roles, projects] = await Promise.all([
    getCompanies(),
    getRoles(),
    getProjects(),
  ]);
  return (
    <div className="flex h-full w-full">
      <Companies companies={companies} roles={roles} projects={projects} />
    </div>
  );
}
