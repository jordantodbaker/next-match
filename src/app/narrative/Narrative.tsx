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
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SafetySchema, safetySchema } from "@/lib/schemas/safetySchema";
import {
  authorizeNarrative,
  submitNarrative,
} from "../actions/narrativeActions";
import { getSunday } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { join } from "path";

export default function NarrativePage({
  intialNarratives,
  companies,
  narrativeTypes,
}) {
  const { data } = useSession();
  const user = data?.user;

  const [selectedCompany, setSelectedCompany] = useState(
    companies.find((c) => c.id == intialNarratives[0]?.companyId || 1)
  );
  const [narratives, setNarratives] = useState(
    intialNarratives[0] || [{ id: "new-0", narrative: "", narrativeTypeId: 1 }]
  );

  const [selectedNarrative, setSelectedNarrative] = useState();

  const onChangeCompany = (key) => {
    const company = companies.find((c) => c.id == key);
    const narrative = narratives.find((n) => n.companyId == key);

    setNarrativeValues(narrative.narrative);
    setSelectedCompany(company);
    setSelectedNarrative(narrative);
  };

  const onNarrativeChange = (e) => {
    const newNarratives = narratives.map((n) => {
      if (n.id === e.target.id) {
        n = { ...n, narrative: e.target.value };
      }
      return n;
    });
    console.log("New Narratives: ", newNarratives);
    setNarratives(newNarratives);
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SafetySchema>({
    resolver: zodResolver(safetySchema),
    mode: "onTouched",
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "narratives", // unique name for your Field Array
    }
  );

  const onSubmit = async () => {
    setNarratives((narrative) => ({
      ...narrative,
      userId: user.id,
      updatedAt: new Date(),
    }));
    const result = await submitNarrative(narratives);
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
    const result = await authorizeNarrative(selectedNarrative);
  };

  const onChangeNarrativeType = (key) => {
    const narrativeType = narrativeTypes.find((n) => n.id == key);
    setSelectedNarrative(narrativeType);
  };

  const [narrativeForms, setNarrativeForms] = useState([]);

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Narrative</h1>
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
                selectionMode="single"
              >
                {companies.map((company) => (
                  <DropdownItem key={company.id}>{company.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mt-16 h-full">
            {narratives.map((narrative, i) => (
              <div className="mb-6">
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered">
                      {selectedNarrative
                        ? selectedNarrative.type
                        : "Select Narrative Type"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    color="primary"
                    variant="faded"
                    aria-label="Static Actions"
                    onAction={(key) => onChangeNarrativeType(key)}
                    selectionMode="single"
                  >
                    {narrativeTypes.map((type) => (
                      <DropdownItem key={type.id}>{type.type}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Textarea
                  {...register(`narrative`)}
                  id={narrative.id}
                  key={narrative.id}
                  label="Narrative"
                  className="mt-2"
                  placeholder="Enter your Safety Narrative"
                  defaultValue={narrative.narrative}
                  onChange={(e) => onNarrativeChange(e)}
                  value={narrative.narrative}
                  disabled={false}
                />
                {narrative?.updatedAt && (
                  <div className="flex justify-end mr-2 text-gray-500 font-light italic mt-1">
                    Last updated on {narrative.updatedAt.toLocaleDateString()}{" "}
                    at {narrative.updatedAt.toLocaleTimeString()}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-2">
            {" "}
            <Button
              color="primary"
              onPress={() =>
                setNarratives([
                  ...narratives,
                  {
                    id: "new-" + narratives.length,
                    narrativeTypeId: 1,
                    narrative: "",
                  },
                ])
              }
            >
              Add Narrative
            </Button>
          </div>
          <div className="mt-2">
            <Button
              color="primary"
              type="submit"
              isDisabled={!isValid || narratives[0].authorized}
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
                {narratives[0].authorized ? "Unauthorize" : "Authorize"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
