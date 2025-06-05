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
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext } from "react";

const roles = [
  { id: 1, name: "Boilermaker" },
  { id: 2, name: "Civil" },
  { id: 3, name: "Electrician" },
  { id: 4, name: "Instrument" },
  { id: 5, name: "Insulation" },
  { id: 6, name: "Ironworker" },
  { id: 7, name: "Laborer" },
  { id: 8, name: "Mason" },
  { id: 9, name: "Millwright" },
  { id: 10, name: "Pipefitter" },
  { id: 11, name: "Painter" },
  { id: 13, name: "Cleaning" },
  { id: 14, name: "Carpenter" },
  { id: 15, name: "Other" },
  { id: 16, name: "Machinist" },
  { id: 17, name: "Support - Gen. Labor" },
];

type Props = {
  initialNarratives: (Narrative | null)[];
  companies: CompanyAccount[];
  narrativeTypes: NarrativeType[];
};

type NarrativeShape = {
  narrativeType: NarrativeType;
  narrative: Narrative;
};

type FormValues = {
  narratives: NarrativeShape[];
};

import { useSession } from "next-auth/react";
import { CompanyAccount, Narrative, NarrativeType } from "@prisma/client";
import { submitNarrative } from "../actions/narrativeActions";
import { CompanyContext } from "@/components/CompanyContext";
export default function NarrativePage({
  initialNarratives,
  companies,
  narrativeTypes,
}: Props) {
  const { data } = useSession();
  const user = data?.user;

  const company = useContext(CompanyContext);

  const emptyNarrative = {
    narrativeType: { id: 0, type: "" },
    narrative: {
      id: 0,
      narrative: "",
      userId: 0,
      companyId: 0,
      authorized: false,
      updatedAt: null,
      narrativeTypeId: 0,
    },
  };

  let processedNarratives = initialNarratives.map((n) => ({
    narrative: n,
    narrativeType: narrativeTypes.find((nt) => nt.id == n?.narrativeTypeId),
  }));

  processedNarratives =
    processedNarratives[0] === null ? [emptyNarrative] : processedNarratives;

  const [narratives, setNarratives] = useState(processedNarratives);

  console.log("NARRAITEV", processedNarratives);

  useEffect(() => {
    if (company && user?.role === "ADMIN") {
      console.log("NARRATIVES: ", narratives);
      console.log("CUMPANY: ", company);
      narratives.map((n) => console.log(n));
      const newNarratives = narratives.filter(
        (n: any) => n.narrative.companyId == company.id
      );

      console.log("NEW NARRATIVES: ", newNarratives);

      setNarratives(
        (newNarratives.length > 0
          ? newNarratives
          : [emptyNarrative]) as NarrativeShape[]
      );
    }
  }, [company as any]);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm({
    //resolver: zodResolver(safetySchema),
    //mode: "onTouched",
    defaultValues: {
      narratives: narratives,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "narratives",
    control,
  });

  const watchFieldArray = watch("narratives");
  const controlledFields = fields.map((field, index) => {
    return { ...field, ...watchFieldArray[index] };
  });

  const onSubmit = async (data: FormValues) => {
    console.log("Submitting", data);
    const result = await Promise.all(
      data.narratives.map(
        async (n) =>
          await submitNarrative({
            narrative: {
              ...n.narrative,
              userId: user?.id as number,
              companyId: user?.companyId as number,
              narrativeTypeId: n.narrativeType.id,
            },
          })
      )
    );

    console.log("DONE ", result);
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Narratives</h1>
        </div>

        <form
          onSubmit={handleSubmit(async (data) => await onSubmit(data as any))}
        >
          <div className="w-full mt-16 h-full">
            <div className="flex flex-col">
              {fields.map((field, index) => {
                return (
                  <section key={field.id} className="mr-4 mt-16 w-full">
                    <div className="flex flex-col">
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            variant="bordered"
                            color="primary"
                            className="w-xs"
                          >
                            {field.narrativeType?.type
                              ? field.narrativeType.type
                              : "Narrative Type"}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          {...register(`narratives.${index}.narrativeType`)}
                          color="primary"
                          variant="faded"
                          aria-label="Static Actions"
                          onAction={(key) => {
                            const narrativeType = narrativeTypes.find(
                              (r) => r.id == key
                            );
                            if (narrativeType) {
                              //setValue(`headcount.${index}.role`, role);
                              update(index, {
                                ...field,
                                narrativeType: narrativeType,
                              });
                            }
                          }}
                          selectionMode="single"
                        >
                          {narrativeTypes.map((type) => (
                            <DropdownItem key={type.id}>
                              {type.type}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="mt-2">
                      <label>
                        <span>Narrative</span>
                        <Textarea
                          variant="faded"
                          type="number"
                          {...register(
                            `narratives.${index}.narrative.narrative`
                          )}
                        />
                      </label>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="bordered"
                        color="primary"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
          <Button
            variant="bordered"
            color="primary"
            type="button"
            onClick={() => {
              append(emptyNarrative);
            }}
          >
            Add Another
          </Button>
          <div className="mt-2">
            <Button
              color="primary"
              type="submit"
              isDisabled={!isValid}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
