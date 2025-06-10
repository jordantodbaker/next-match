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
  IconLock,
  IconHome,
  IconUsers,
  IconCheck,
  IconAlertTriangle,
  IconExclamationMark,
} from "@tabler/icons-react";

export function Sidebar() {
  const links = [
    {
      label: "Home",
      href: " /dashboard",
      icon: (
        <IconHome className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Safety",
      href: "/safety",
      icon: (
        <IconFirstAidKit className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      statusIcon: <IconCheck className="h-5 w-5 shrink-0 " color="green" />,
    },
    {
      label: "Narratives",
      href: "/narrative",
      icon: (
        <IconClipboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      statusIcon: (
        <IconAlertTriangle className="h-5 w-5 shrink-0 " color="orange" />
      ),
    },
    {
      label: "Quantities",
      href: "/quantities",
      icon: (
        <IconHammer className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      statusIcon: (
        <IconExclamationMark className="h-5 w-5 shrink-0 " color="red" />
      ),
    },
    {
      label: "Costs",
      href: "/costs",
      icon: (
        <IconCoin className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      statusIcon: <IconCheck className="h-5 w-5 shrink-0 " color="green" />,
    },
    {
      label: "Headcount",
      href: "/headcount",
      icon: (
        <IconUser className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      statusIcon: <IconCheck className="h-5 w-5 shrink-0 " color="green" />,
    },
    {
      label: "Workforce Plan",
      href: "/workforcePlan",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      statusIcon: <IconCheck className="h-5 w-5 shrink-0 " color="green" />,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <AceSidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 border-1 border-r-cyan-600 border-t-0">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto justify-between">
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Admin",
                href: "/admin",
                icon: (
                  <IconLock className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
              }}
            />
          </div>
        </div>
      </SidebarBody>
    </AceSidebar>
  );
}
