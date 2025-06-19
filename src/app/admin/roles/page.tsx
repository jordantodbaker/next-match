import React, { useContext } from "react";
import Roles from "./Roles";
import { getRoles } from "../../actions/rolesActions";

export default async function AdminPage() {
  const roles = await getRoles();

  return (
    <div className="flex h-full w-full bg-blue-200">
      <Roles userRoles={roles} />
    </div>
  );
}
