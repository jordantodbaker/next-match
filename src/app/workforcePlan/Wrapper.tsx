"use client";

import React from "react";
import { User, WorkforcePlan as WorkforcePlanType } from "@prisma/client";
import { CompanyWithRoles } from "@/lib/types";
import { TourProvider, useTour } from "@reactour/tour";
import WorkforcePlan from "./WorkforcePlan";

export default function WorkforcePlanPage({
  workforcePlans,
  company,
  user,
}: {
  workforcePlans: WorkforcePlanType[];
  company: CompanyWithRoles;
  user: User;
}) {
  const steps = [
    {
      selector: ".step-one",
      content:
        "Use this drop down to select the role for which is workforce plan applies.",
    },
    {
      selector: ".step-two",
      content:
        "To bulk-fill an entire workforce plan, or just empty days, fill the day and night head counts and click fill all to fill in every value you in the workforce plan. Or click Fill Empty to only fill in days that don't have values yet.",
    },
    {
      selector: ".step-three",
      content: "Each row section represents a week in the workforce plan.",
    },
    {
      selector: ".step-four",
      content:
        "You can fill out an entire week at once by entering the day and night headcounts and clicking Fill Week.",
    },
    {
      selector: ".step-five",
      content:
        "Once you've finished filling out your workforce plan, click Submit to save your workforce plan.",
    },
  ];

  const { setIsOpen } = useTour();

  return (
    <TourProvider
      steps={steps}
      onClickClose={async (clickProps) => {
        clickProps.setIsOpen(false);
        clickProps.setCurrentStep(0);
        const data = new FormData();
        data.set("user", JSON.stringify({ ...user, hasTakenWFPTour: true }));

        const result = await fetch("/api/users", {
          method: "POST",
          body: data,
        });
      }}
    >
      <WorkforcePlan
        workforcePlans={workforcePlans}
        company={company}
        showTour={!user.hasTakenWFPTour}
      />
    </TourProvider>
  );
}
