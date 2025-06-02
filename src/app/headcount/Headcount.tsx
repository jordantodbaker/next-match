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

const roles = [
  { id: 1, name: "Boilermaker" },
  { id: 2, name: "Civil" },
  { id: 3, name: "Electirician" },
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

type FormValues = {
  headcount: {
    role: { id: number; name: string } | undefined;
    headcount: number;
  }[];
};

import { useSession } from "next-auth/react";
export default function HeadcountPage() {
  const { data } = useSession();
  const user = data?.user;

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
      headcount: [{ role: { id: 0, name: "" }, headcount: 0 }],
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

  const onSubmit = (data: FormValues) => {
    console.log("Submitting", data);
  };

  const onChangeRole = (key: any, field: any) => {
    const role = roles.find((r) => r.id == key);
    field.role = role;
    console.log("role", role);
    console.log("field", field);
    return field;
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Daily Headcount</h1>
        </div>

        <form
          onSubmit={handleSubmit((data) => {
            console.log("DATA", data);
          })}
        >
          <div className="w-full mt-16 h-full">
            <div className="flex sm:flex-row flex-col">
              {fields.map((field, index) => {
                return (
                  <section key={field.id} className="mr-4 mt-4">
                    <div className="flex flex-col">
                      <span>Role</span>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button variant="bordered" color="primary">
                            {field.role?.name
                              ? field.role.name
                              : "Select a Role"}
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          {...register(`headcount.${index}.role`)}
                          color="primary"
                          variant="faded"
                          aria-label="Static Actions"
                          onAction={(key) => {
                            const role = roles.find((r) => r.id == key);
                            if (role) {
                              //setValue(`headcount.${index}.role`, role);
                              update(index, { ...field, role: role });
                            }
                          }}
                          selectionMode="single"
                        >
                          {roles.map((role) => (
                            <DropdownItem key={role.id}>
                              {role.name}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="mt-2">
                      <label>
                        <span>Headcount</span>
                        <Input
                          type="number"
                          {...register(`headcount.${index}.headcount`)}
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
              append({
                role: { id: 0, name: "Select a Role" },
                headcount: 0,
              });
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
