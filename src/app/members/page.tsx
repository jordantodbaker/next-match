import { Sidebar } from "@/components/sidebar/Sidebar";
import React from "react";

export default function MembersPage() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <div>
        <div className="border-1 border-amber-200 w-xl">APS</div>
      </div>
    </div>
  );
}
