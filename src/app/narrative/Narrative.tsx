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
import { SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { SafetySchema, safetySchema } from "@/lib/schemas/safetySchema";
import {
  authorizeNarrative,
  submitNarrative,
} from "../actions/narrativeActions";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { CompanyAccount, Narrative, NarrativeType } from "@prisma/client";

type Props = {
  initialNarratives: (Narrative | null)[];
  companies: CompanyAccount[];
  narrativeTypes: NarrativeType[];
};

export default function NarrativePage({
  initialNarratives,
  companies,
  narrativeTypes,
}: Props) {
  const { data } = useSession();
  const user = data?.user;

  const [selectedCompany, setSelectedCompany] = useState(
    initialNarratives
      ? companies.find((c) => c.id == initialNarratives[0]?.companyId || 1)
      : null
  );
  const [narratives, setNarratives] = useState<any>([
    {
      id: 0,
      narrative: "",
      narrativeTypeId: 1,
      userId: user?.id,
      companyId: user?.companyId,
      authorized: false,
    },
  ]);

  const [selectedNarrativeType, setSelectedNarrativeType] =
    useState<NarrativeType>();

  const onChangeCompany = (key: number) => {
    const company = companies.find((c) => c.id == key);
    const narrative = narratives.find((n: Narrative) => n.companyId == key);
    if (narrative) {
      setNarratives(narrative);
    }

    setSelectedCompany(company);
    setSelectedNarrativeType(narrative);
  };

  const onNarrativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("narratives", narratives);
    console.log(e.target.id);
    const id = parseInt(e.target.id);
    const newNarratives = narratives.map((n: Narrative) => {
      if (n.id == id) {
        n = { ...n, narrative: e.target.value };
      }
      return n;
    });
    console.log("New Narratives: ", newNarratives);
    setNarratives(newNarratives);
  };

  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<SafetySchema>({
    resolver: zodResolver(safetySchema),
    mode: "onTouched",
  });

  const onSubmit = async () => {
    setNarratives((narrative: Narrative) => ({
      ...narrative,
      userId: user?.id,
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
    setNarratives({
      ...narratives,
      authorized: !narratives.authorized,
    });
    await authorizeNarrative(narratives);
  };

  const onChangeNarrativeType = (key: number) => {
    const narrativeType = narrativeTypes.find((n) => n.id == key);
    setSelectedNarrativeType(narrativeType);
  };

  console.log("Narratives: ", narratives);

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
                  {selectedCompany?.name}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                color="primary"
                variant="faded"
                aria-label="Static Actions"
                onAction={(key) => onChangeCompany(key as number)}
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
            {narratives.map((narrative: Narrative) => (
              <div className="mb-6" key={selectedNarrativeType?.id}>
                <Dropdown key={selectedNarrativeType?.id}>
                  <DropdownTrigger>
                    <Button variant="bordered">
                      {selectedNarrativeType
                        ? selectedNarrativeType.type
                        : "Select Narrative Type"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    color="primary"
                    variant="faded"
                    key={selectedNarrativeType?.id}
                    aria-label="Static Actions"
                    onAction={(key) => onChangeNarrativeType(key as number)}
                    selectionMode="single"
                  >
                    {narrativeTypes.map((type) => (
                      <DropdownItem key={type.id}>{type.type}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Textarea
                  {...register(`narrative`)}
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
                    id: narratives.length,
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
