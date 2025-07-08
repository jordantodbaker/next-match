import React from "react";
import Companies from "./Companies";
import { getCompanies } from "../../actions/companyActions";
import { getRoles } from "@/app/actions/rolesActions";
import { getProjects } from "@/app/actions/projectActions";

export default async function AdminPage() {
  const companies = await getCompanies();
  const roles = await getRoles();
  const projects = await getProjects();

  return (
    <div className="flex h-full w-full">
      <Companies companies={companies} roles={roles} projects={projects}/>
    </div>
  );
}
