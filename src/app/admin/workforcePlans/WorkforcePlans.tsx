"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Accordion, AccordionItem } from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import * as z from "zod/v4";
import { useCurrentUser } from "@/lib/useCurrentUser";
import {
  CompanyAccount,
  Headcount,
  Project,
  Role,
  SecurityRole,
  User,
  WorkforcePlan,
} from "@prisma/client";
import { Company } from "@/lib/types";
import { ProjectContext } from "@/components/ProjectContext";
import { CompanyContext } from "@/components/CompanyContext";
import { toast } from "react-toastify";
import Roles from "../roles/Roles";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";

const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

type Props = {
  companies: Company[];
};

type ReportPlan = WorkforcePlan & {
  dayHeadCount: number;
  nightHeadCount: number;
};
type ParsedCompany = Company & { reportPlans: ReportPlan };

export default function WorkforcePlansPage({
  companies: initialCompanies,
}: Props) {
  const parsedCompanies = initialCompanies.map((company) => {
    let merged = [];

    for (let i = 0; i < company.workforcePlans.length; i++) {
      const headCount = company.headcounts.find((hc) => {
        if (
          datesAreOnSameDay(company.workforcePlans[i].date, hc.date) &&
          company.workforcePlans[i].roleId === hc.roleId
        ) {
        }
        return (
          datesAreOnSameDay(company.workforcePlans[i].date, hc.date) &&
          company.workforcePlans[i].roleId === hc.roleId &&
          company.workforcePlans[i].projectId === hc.projectId
        );
      });
      merged.push({
        ...company.workforcePlans[i],
        ...{
          dayHeadCount: headCount?.dayCount,
          nightHeadCount: headCount?.dayCount,
        },
      });
    }

    return { ...company, reportPlans: merged };
  });

  const data = { user: useCurrentUser() };
  const user = data?.user;
  const project = useContext<Project>(ProjectContext);
  const [companies, setCompanies] = useState<any[]>(parsedCompanies);

  useEffect(() => {
    const newCompanies = parsedCompanies.map((c) => ({
      ...c,
      reportPlans: [...c.reportPlans].filter((w) => w.projectId == project.id),
    }));
    setCompanies(newCompanies);
  }, [project]);

  console.log("Companies: ", companies);

  return (
    <div className="h-full overflow-x-scroll flex w-full">
      <AdminSidebar />
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
                  field.reportPlans.length > 0
                    ? field.reportPlans[0].roleId
                    : null;
                if (lastId) {
                  field.reportPlans.forEach((p: ReportPlan) => {
                    if (p.roleId !== lastId) {
                      plans.push({
                        role: field.roles.find((r: any) => r.id == lastId),
                        plans: wfps,
                      });
                      lastId = p.roleId;
                      wfps = [];
                    }
                    wfps.push(p);
                  });
                }

                plans.push({
                  role: field.roles.find((r: Role) => r.id == lastId),
                  plans: wfps,
                });

                return (
                  <div>
                    {plans[0].plans.length > 0 && (
                      <div className="text-2xl font-bold">{field.name}</div>
                    )}
                    {plans[0].plans.length > 0 &&
                      plans.map((plan: any) => {
                        return (
                          <div className="mb-8">
                            <div className="text-xl mb-2">{plan.role.name}</div>
                            <div className="flex">
                              <div className="flex flex-col justify-end mr-4 font-bold">
                                <div>Day</div>
                                <div>Night</div>
                              </div>
                              <div className={"flex"}>
                                {plan.plans.map((p: any) => (
                                  <div className="mr-8">
                                    <div className="text-center mb-4 font-bold text-lg">
                                      {p.date.toLocaleDateString(undefined, {
                                        month: "numeric",
                                        day: "numeric",
                                      })}
                                    </div>
                                    <div className="flex mb-4">
                                      <div className="[writing-mode:vertical-lr]">
                                        Planned
                                      </div>
                                      <div className="[writing-mode:vertical-lr]">
                                        Actual
                                      </div>
                                    </div>
                                    <div className="flex">
                                      <div className="mr-2">
                                        <div>{p.dayCount}</div>
                                        <div>{p.nightCount}</div>
                                      </div>
                                      <div>
                                        <div>{p.dayHeadCount}</div>
                                        <div>{p.nightHeadCount}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
