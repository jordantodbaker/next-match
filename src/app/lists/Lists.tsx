"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
  NumberInput,
} from "@heroui/react";
import { Key, useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { getSunday } from "@/lib/utils";
import { submitWorkforcePlan } from "../actions/workforcePlansActions";
import { CompanyContext } from "@/components/CompanyContext";
import { CompanyAccount, Project, Role, WorkforcePlan } from "@prisma/client";
import { ProjectContext } from "@/components/ProjectContext";
import { emptyRole } from "@/lib/schemas/defaultModels";
import { CompanyWithRoles } from "@/lib/types";
import { TourProvider, useTour } from "@reactour/tour";
import Comp from "./Comp";

export default function Lists({}: {}) {
  const steps = [
    {
      selector: ".first-step",
      content: "This is my first Step",
    },
  ];

  const { setIsOpen } = useTour();
  return (
    <TourProvider steps={steps}>
      <Comp />
    </TourProvider>
  );
}
