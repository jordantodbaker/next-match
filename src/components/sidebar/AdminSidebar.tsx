"use client";
import React, { useState } from "react";
import {
  Sidebar as AceSidebar,
  SidebarBody,
  SidebarLink,
} from "./AceternitySidebar";
import {
  IconUser,
  IconLayoutGrid,
} from "@tabler/icons-react";

export function AdminSidebar() {
  const links = [
    {
      label: "Users",
      href: "/admin/users",
      icon: (
        <IconUser className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },

    {
      label: "Company Accounts",
      href: "/admin/companies",
      icon: (
        <IconLayoutGrid className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <AceSidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 border-1 border-r-cyan-600 border-t-0 bg-blue-200">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto justify-between">
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
      </SidebarBody>
    </AceSidebar>
  );
}
