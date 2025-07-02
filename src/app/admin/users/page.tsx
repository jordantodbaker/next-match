import React from "react";
import Users from "./Users";
import { getCompaniesWithUsers } from "../../actions/companyActions";

export default async function AdminPage() {
  const companies = await getCompaniesWithUsers();

  return (
    <div className="flex h-full w-full">
      <Users companies={companies} />
    </div>
  );
}
