"use client";

import {
  Button,
  Input,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
} from "@heroui/react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import React from "react";
import { SafetySchema } from "@/lib/schemas/safetySchema";
//import { authorizeNarrative, submitNarrative } from "../../actions/safetyActions";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { CompanyContext } from "@/components/CompanyContext";
import { Narrative, NarrativeType, SafetyNarrative } from "@prisma/client";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import {
  IconFirstAidKit,
  IconClipboard,
  IconHammer,
  IconUser,
  IconCoin,
  IconLock,
  IconCheck,
} from "@tabler/icons-react";
import {
  saveNarrativeType,
  deleteNarrativeType,
} from "@/app/actions/narrativeTypeActions";
import { Sidebar } from "@/components/sidebar/Sidebar";
import Link from "next/link";

type Props = {
  safetyNarratives: any;
  narratives: Narrative[];
};

export default function Dashboard({ safetyNarratives, narratives }: Props) {
  const safetyNarrativeValid = safetyNarratives[0].narrative !== "";
  console.log("slfjlsdjFljsd: ", safetyNarratives[0]);
  console.log("valid: ", safetyNarrativeValid);
  const sections = [
    {
      title: "Safety",
      icon: (
        <IconFirstAidKit
          height="256"
          width=""
          color={safetyNarrativeValid ? "green" : "yellow"}
        />
      ),
      status: safetyNarrativeValid ? "valid" : "warn",
      href: "/safety",
      color: "green",
      authorized: safetyNarratives[0].authorized,
    },
    {
      title: "Narratives",
      icon: <IconClipboard height="256" width="" color="#f6bc4d" />,
      status: "warn",
      color: "amber",
      href: "/narratives",
    },
    {
      title: "Quantities",
      icon: <IconHammer height="256" width="" color="red" />,
      status: "error",
      color: "danger",
      href: "/quantities",
    },
    {
      title: "Costs",
      icon: <IconCoin height="256" width="" color="green" />,
      status: "valid",
      color: "green",
      href: "/costs",
    },
    {
      title: "Headcount",
      icon: <IconUser height="256" width="" color="green" />,
      status: "valid",
      color: "green",
      href: "/headcount",
    },
  ];

  const { data } = useSession();
  const user = data?.user;

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full p-18">
        <div className="flex flex-row justify-between mt-16 flex-wrap">
          {sections.map((s) => (
            <Link href={s.href} className="w-1/5 mr-8 mt-6">
              <Card className={`border-1 border-${s.color}-500`}>
                <CardHeader className="flex justify-end">
                  {s.authorized && (
                    <div>
                      <IconCheck color="green" />
                      Authorized
                    </div>
                  )}
                </CardHeader>
                <CardBody className="flex flex-row justify-center">
                  {s.icon}
                </CardBody>
                <CardFooter>
                  <div className="flex flex-col w-full ">
                    <h1 className="text-3xl text-center">{s.title}</h1>
                    {s.status === "valid" && (
                      <p className="mt-2 text-center">{s.title} is complete!</p>
                    )}
                    {s.status === "warn" && (
                      <p className="mt-2 text-center">
                        {s.title} needs to be filled out.
                      </p>
                    )}
                    {s.status === "error" && (
                      <p className="mt-2 text-center">{s.title} has errors.</p>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
