"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Input,
} from "@heroui/react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

type FormValues = {
  headcount: {
    role: { id: number; name: string };
    dayHeadcount: number;
    nightHeadcount: number;
  }[];
};

type Props = {
  roles: Role[];
};

import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
export default function HeadcountPage({ roles }: Props) {
  const { data } = useSession();
  const user = data?.user;

  const initialValues = [
    ...roles.map((role) => ({ ...role, dayHeadcount: 0, nightHeadcount: 0 })),
  ];

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
      headcount: initialValues,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "headcount",
    control,
  });

  const watchFieldArray = watch("headcount");
  const controlledFields = fields.map((field, index) => {
    return { ...field, ...watchFieldArray[index] };
  });

  const onSubmit = (data: FormValues) => {};

  const onChangeRole = (key: any, field: any) => {
    const role = roles.find((r) => r.id == key);
    field.role = role;
    return field;
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Daily Headcount</h1>
        </div>
        <form onSubmit={handleSubmit((data) => {})}>
          <div className="w-full mt-16 h-full flex flex-col justify-center">
            <div className="">
              {fields.map((field, index) => {
                return (
                  <section key={field.id} className="mr-4 sm:mt-4 mt-16">
                    <div className="flex flex-row">
                      <div className="w-3xs flex align-middle">
                        <span>{field.name}</span>
                      </div>
                      <Input
                        fullWidth={false}
                        size="sm"
                        className="mr-2"
                        label="Day"
                        type="number"
                        {...register(`headcount.${index}.dayHeadcount`)}
                      />
                      <Input
                        fullWidth={false}
                        size="sm"
                        label="Night"
                        type="number"
                        {...register(`headcount.${index}.nightHeadcount`)}
                      />
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
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
