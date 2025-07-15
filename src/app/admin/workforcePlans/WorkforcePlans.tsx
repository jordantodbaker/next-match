"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Accordion, AccordionItem } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import * as z from "zod/v4";
import { useSession } from "next-auth/react";
import {
  CompanyAccount,
  Headcount,
  Project,
  Role,
  SecurityRole,
  User,
} from "@prisma/client";
import { Company } from "@/lib/types";
import { ProjectContext } from "@/components/ProjectContext";
import { CompanyContext } from "@/components/CompanyContext";
import { toast } from "react-toastify";
import Roles from "../roles/Roles";

type Props = {
  companies: Company[];
};

export default function WorkforcePlansPage({
  companies: initialCompanies,
}: Props) {
  const { data } = useSession();
  const user = data?.user;
  const project = useContext<Project>(ProjectContext);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);

  useEffect(() => {
    const newCompanies = initialCompanies.map((c) => ({
      ...c,
      workforcePlans: [...c.workforcePlans].filter(
        (w) => w.projectId == project.id
      ),
    }));
    setCompanies(newCompanies);
  }, [project]);

  return (
    <div className="h-full overflow-x-scroll flex w-full">
      <Sidebar />
      <div className=" flex flex-col m-16 w-full">
        <div>
          <h1 className="text-3xl text-center">Workforce Plans</h1>
        </div>
        <form>
          <div className="mt-16 h-full flex flex-col justify-center w-full">
            <div>
              {companies.map((field, index) => {
                const plans: any = [];
                let wfps: any = [];
                let lastId =
                  field.workforcePlans.length > 0
                    ? field.workforcePlans[0].roleId
                    : null;
                if (lastId) {
                  field.workforcePlans.forEach((p) => {
                    if (p.roleId !== lastId) {
                      plans.push({
                        role: field.roles.find((r) => r.id == lastId),
                        plans: wfps,
                      });
                      lastId = p.roleId;
                      wfps = [];
                    }
                    wfps.push(p);
                  });
                }

                plans.push({
                  role: field.roles.find((r) => r.id == lastId),
                  plans: wfps,
                });

                return (
                  <Accordion
                    isCompact
                    key={field.id}
                    className="mr-4 sm:mt-4 mt-16"
                  >
                    <AccordionItem
                      key={index}
                      title={<div className="text-2xl">{field.name}</div>}
                    >
                      {plans[0].plans.length > 0 &&
                        plans.map((plan: any) => {
                          return (
                            <div>
                              <div>{plan.role.name}</div>
                              <div className={"flex flex-row"}>
                                {plan.plans.map((p: any) => (
                                  <div className="flex flex-row">
                                    <div>
                                      {p.date.toLocaleDateString(undefined, {
                                        month: "numeric",
                                        day: "numeric",
                                      })}
                                    </div>
                                    <div> | </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
