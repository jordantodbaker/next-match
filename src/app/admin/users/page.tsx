import React from "react";
import Users from "./Users";
import { getCompaniesWithUsers } from "../../actions/companyActions";
import { getUnlinkedClerkUsers } from "../../actions/userActions";

export default async function AdminPage() {
  const [companies, unlinkedUsers] = await Promise.all([
    getCompaniesWithUsers(),
    getUnlinkedClerkUsers(),
  ]);

  return (
    <div className="flex h-full w-full">
      <Users companies={companies} unlinkedUsers={unlinkedUsers} />
    </div>
  );
}
