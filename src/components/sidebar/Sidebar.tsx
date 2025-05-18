"use client";
import React, { useState } from "react";
import {
  Sidebar as AceSidebar,
  SidebarBody,
  SidebarLink,
} from "./AceternitySidebar";
import {
  IconFirstAidKit,
  IconClipboard,
  IconHammer,
  IconUser,
  IconCoin,
} from "@tabler/icons-react";

export function Sidebar() {
  const links = [
    {
      label: "Safety",
      href: "#",
      icon: (
        <IconFirstAidKit className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Narratives",
      href: "#",
      icon: (
        <IconClipboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Quantities",
      href: "#",
      icon: (
        <IconHammer className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Costs",
      href: "#",
      icon: (
        <IconCoin className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Manpower",
      href: "#",
      icon: (
        <IconUser className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <AceSidebar open={true} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 border-1 border-r-black border-t-0">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
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
