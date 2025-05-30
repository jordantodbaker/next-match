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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SafetySchema, safetySchema } from "@/lib/schemas/safetySchema";
import { authorizeNarrative, submitNarrative } from "../actions/safetyActions";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type Props = {
  narratives: any;
  companies: any;
};

export default function SafetyPage({ narratives, companies }: Props) {
  const [selectedCompany, setSelectedCompany] = useState(
    companies.find((c: any) => c.id == narratives[0].companyId)
  );
  const [selectedNarrative, setSelectedNarrative] = useState(narratives[0]);
  const [narrativeValue, setNarrativeValue] = useState(narratives[0].narrative);

  const onChangeCompany = (key: any) => {
    const company = companies.find((c: any) => c.id == key);
    const narrative = narratives.find((n: any) => n.companyId == key);

    setNarrativeValue(narrative.narrative);
    setSelectedCompany(company);
    setSelectedNarrative(narrative);
  };

  const onNarrativeChange = (e: any) => {
    const narrative = e.target.value;
    setNarrativeValue(narrative);
  };

  const { data } = useSession();
  const user = data?.user;
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<SafetySchema>({
    resolver: zodResolver(safetySchema),
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

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Safety Narrative</h1>
        </div>
        {user?.role === "ADMIN" && (
          <div className="mt-2">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" color="primary">
                  {selectedCompany.name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                color="primary"
                variant="faded"
                aria-label="Static Actions"
                onAction={(key) => onChangeCompany(key)}
                // selectedKeys={[2]}
                selectionMode="single"
              >
                {companies.map((company: any) => (
                  <DropdownItem key={company.id}>{company.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mt-16 h-full">
            <Textarea
              {...register("narrative")}
              label="Narrative"
              placeholder="Enter your Safety Narrative"
              defaultValue={selectedNarrative.narrative}
              onChange={(e) => onNarrativeChange(e)}
              value={narrativeValue}
              disabled={selectedNarrative.authorized}
            />
            <div className="flex justify-end mr-2 text-gray-500 font-light italic mt-1">
              Last updated on {selectedNarrative.updatedAt.toLocaleDateString()}{" "}
              at {selectedNarrative.updatedAt.toLocaleTimeString()}
            </div>
          </div>
          <div className="mt-2">
            <Button
              color="primary"
              type="submit"
              isDisabled={!isValid || selectedNarrative.authorized}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
            {user?.role === "ADMIN" && (
              <Button
                className="ml-2"
                color="primary"
                isDisabled={!isValid}
                isLoading={isSubmitting}
                onPress={onClickAuthorize}
              >
                {selectedNarrative.authorized ? "Unauthorize" : "Authorize"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
