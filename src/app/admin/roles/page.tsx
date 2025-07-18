import React, { useContext } from "react";
import Roles from "./Roles";
import { getRoles } from "../../actions/rolesActions";
import { getCategories } from "@/app/actions/roleCategoryActions";

export default async function RolePage() {
  const roles = await getRoles();
  const categories = await getCategories();
  return (
    <div className="flex h-full w-full">
      <Roles roles={roles} categories={categories} />
    </div>
  );
}
