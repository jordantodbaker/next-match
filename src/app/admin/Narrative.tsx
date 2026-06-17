"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Textarea,
} from "@heroui/react";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
//import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SafetySchema } from "@/lib/schemas/safetySchema";
import { authorizeNarrative, submitNarrative } from "../actions/safetyActions";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { toast } from "react-toastify";
import { CompanyContext } from "@/components/CompanyContext";
import { CompanyAccount, SecurityRole } from "@prisma/client";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";

type Props = {
  narratives: any;
};

export default function SafetyPage({ narratives }: Props) {
  const company = useContext<CompanyAccount>(CompanyContext);

  const initialNarrative =
    narratives.length > 0 && narratives[0].narrative ? narratives[0] : "";

  const [selectedNarrative, setSelectedNarrative] = useState(narratives[0]);
  const [narrativeValue, setNarrativeValue] = useState(initialNarrative);

  useEffect(() => {
    if (company && user?.securityRole === SecurityRole.ADMIN) {
      const narrative = narratives.find((n: any) => n.companyId == company.id);
      setSelectedNarrative(narrative);
      setNarrativeValue(narrative?.narrative ?? "");
    }
  }, [company as any]);

  const onNarrativeChange = (e: any) => {
    const narrative = e.target.value;
    setNarrativeValue(narrative);
  };

  const data = { user: useCurrentUser() };
  const user = data?.user;
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<SafetySchema>({
    //resolver: zodResolver(safetySchema),
    mode: "onTouched",
  });

  const onSubmit = async () => {
    selectedNarrative.narrative = narrativeValue;
    selectedNarrative.userId = user?.id;
    selectedNarrative.updatedAt = new Date();
    const result = await submitNarrative(selectedNarrative);
    if (result.status === "success") {
      toast.success("Narrative saved.");
    } else {
      console.log(result.error);
    }
  };

  const onClickAuthorize = async () => {
    setSelectedNarrative({
      ...selectedNarrative,
      authorized: !selectedNarrative.authorized,
    });
    await authorizeNarrative(selectedNarrative);
  };

  const onClickWorkForce = async () => {
    const uploadRequest = await fetch("/api/workforcePlans", {
      method: "PUT",
    });
  };

  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Admin Panel</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mt-16 h-full">
            <Button
              className="ml-2"
              color="primary"
              isDisabled={!isValid}
              isLoading={isSubmitting}
              onPress={onClickWorkForce}
            >
              Sync Workforce Plans
            </Button>
          </div>
          <div className="mt-2">
            <Button
              color="primary"
              type="submit"
              isDisabled={selectedNarrative?.authorized}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
            {user?.securityRole === SecurityRole.ADMIN && (
              <Button
                className="ml-2"
                color="primary"
                isDisabled={!isValid}
                isLoading={isSubmitting}
                onPress={onClickAuthorize}
              >
                {selectedNarrative?.authorized ? "Unauthorize" : "Authorize"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
