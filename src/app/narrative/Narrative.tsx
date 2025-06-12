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
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Narrative, NarrativeType } from "@prisma/client";
import {
  authorizeNarrative,
  deleteNarrative,
  submitNarrative,
} from "../actions/narrativeActions";
import { CompanyContext } from "@/components/CompanyContext";
import { toast } from "react-toastify";
import {
  NarrativeSchema,
  narrativeSchema,
} from "@/lib/schemas/narrativeSchema";

type Props = {
  initialNarratives: (Narrative | null)[];
  narrativeTypes: NarrativeType[];
};

type NarrativeShape = {
  narrativeType: NarrativeType | undefined;
  narrative: Narrative;
};

type FormValues = {
  narratives: NarrativeShape[];
};

export default function NarrativePage({
  initialNarratives,
  narrativeTypes,
}: Props) {
  const { data } = useSession();
  const router = useRouter();
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
    processedNarratives[0] === null || processedNarratives.length === 0
      ? [emptyNarrative]
      : processedNarratives;

  const [empty, setEmpty] = useState<NarrativeShape>([] as any);
  const [narratives, setNarratives] = useState([] as any);

  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<NarrativeSchema>({
    //resolver: zodResolver(narrativeSchema),
    //mode: "onTouched",
    defaultValues: {
      narratives: narratives,
    },
  });

  const { fields, append, remove, update, replace } = useFieldArray({
    name: "narratives",
    control,
  });

  useEffect(() => {
    if (company && user?.securityRole === "ADMIN") {
      const empty = {
        narrativeType: { id: 0, type: "" },
        narrative: {
          id: 0,
          narrative: "",
          userId: user?.id,
          companyId: company.id,
          authorized: false,
          updatedAt: null,
          narrativeTypeId: 0,
        },
      };

      setEmpty(empty);

      const newNarratives = processedNarratives.filter((n: any) => {
        return n.narrative.companyId == company.id;
      });

      replace(newNarratives as NarrativeShape[]);
      setNarratives(
        (newNarratives.length > 0 ? newNarratives : [empty]) as NarrativeShape[]
      );
    } else {
      const empty = {
        narrativeType: { id: 0, type: "" },
        narrative: {
          id: 0,
          narrative: "",
          userId: user?.id || 0,
          companyId: user?.companyId || 0,
          authorized: false,
          updatedAt: null,
          narrativeTypeId: 0,
        },
      };

      setEmpty(empty);
      const newNarratives = processedNarratives.filter((n: any) => {
        return n.narrative.companyId == user?.companyId;
      });

      replace(newNarratives as NarrativeShape[]);
      setNarratives(
        (newNarratives.length > 0 ? newNarratives : [empty]) as NarrativeShape[]
      );
    }
  }, [company as any, user]);

  const watchFieldArray = watch("narratives");
  const controlledFields = fields.map((field, index) => {
    return { ...field, ...watchFieldArray[index] };
  });

  const onSubmit = async (data: FormValues) => {
    const result = await Promise.all(
      data.narratives.map(
        async (n) =>
          await submitNarrative({
            narrative: {
              ...n.narrative,
              userId: user?.id as number,
              narrativeTypeId: n.narrativeType?.id as number,
            },
          })
      )
    );
  };

  const onClickDelete = async (narrative: Narrative) => {
    const result = await deleteNarrative(narrative);
    if (result.status === "success") {
      toast.success("Narrative deleted.");
    } else {
      toast.error("Something went wrong");
    }
  };

  const onClickAuthorize = async () => {
    const newNarratives = narratives.map((n, i) => {
      const newNarrative = {
        narrativeType: { ...n.narrativeType },
        narrative: { ...n.narrative, authorized: !n.narrative?.authorized },
      };

      if (n.narrativeType && n.narrative) {
        return newNarrative;
      }
    });

    fields.forEach((f, i) =>
      update(i, {
        narrativeType: f.narrativeType,
        narrative: {
          ...f.narrative,
          authorized: !f.narrative?.authorized,
        } as any,
      })
    );

    const result = await Promise.all(
      narratives.map(async (n) => await authorizeNarrative(n?.narrative as any))
    );

    const success = result.filter((r) => r.status === "error").length === 0;

    if (success) {
      toast.success("Success");
    } else {
      toast.error("Something went wrong");
    }

    setNarratives(newNarratives as any);
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
                            isDisabled={field.narrative?.authorized}
                          >
                            {field.narrativeType?.type
                              ? field.narrativeType.type
                              : "Narrative Type"}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          {...register(`narratives.${index}.narrativeType`, {
                            required: "Please select a narrative type.",
                          })}
                          color="primary"
                          variant="faded"
                          aria-label="Static Actions"
                          onAction={(key) => {
                            const narrativeType = narrativeTypes.find(
                              (r) => r.id == key
                            );
                            if (narrativeType) {
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
                          disabled={field.narrative?.authorized}
                          {...register(
                            `narratives.${index}.narrative.narrative`
                          )}
                        />
                      </label>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button
                        variant="bordered"
                        color="primary"
                        type="button"
                        isDisabled={
                          field.narrative?.authorized || fields.length === 1
                        }
                        onPress={() => {
                          onClickDelete(field.narrative);
                          remove(index);
                        }}
                      >
                        Delete
                      </Button>
                      {field.narrative?.updatedAt && (
                        <div className=" mr-2 text-gray-500 font-light italic mt-1">
                          Last updated on{" "}
                          {field?.narrative?.updatedAt.toLocaleDateString()} at{" "}
                          {field.narrative.updatedAt.toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
          <div>
            <Button
              className="mr-2"
              variant="bordered"
              color="primary"
              type="button"
              onPress={() => {
                append(empty);
              }}
            >
              Add Another
            </Button>
            <Button
              color="primary"
              type="submit"
              isDisabled={!isValid}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </div>
          {user?.securityRole === "ADMIN" && (
            <Button
              className="mt-2"
              color="primary"
              isDisabled={!isValid}
              isLoading={isSubmitting}
              onPress={onClickAuthorize}
            >
              {narratives[0]?.narrative?.authorized
                ? "Unauthorize"
                : "Authorize"}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
