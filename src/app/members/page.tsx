import { Sidebar } from "@/components/sidebar/Sidebar";
import Link from "next/link";
import React from "react";

export default function MembersPage() {
  return (
    <div className="flex">
      <Sidebar />
      <h3 className="text-3xl">This will be the members page</h3>
      <Link href="/">Back Home</Link>
    </div>
  );
}
