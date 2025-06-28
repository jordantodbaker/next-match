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
import { useContext, useState } from "react";
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
  company: CompanyWithRoles[];
  headcount: any;
};

import { useSession } from "next-auth/react";
import { CompanyAccount, Role, SecurityRole } from "@prisma/client";
import { CompanyWithRoles } from "@/lib/types";
import { saveHeadcount } from "../actions/headcountActions";
import { ProjectContext } from "@/components/ProjectContext";
import { CompanyContext } from "@/components/CompanyContext";
import { narrativeSchema } from "../../lib/schemas/narrativeSchema";
import { toast } from "react-toastify";

export default function HeadcountPage({ roles, company, headcount }: Props) {
  const { data } = useSession();
  const user = data?.user;
  const project = useContext(ProjectContext);
  const selectedCompany = useContext(CompanyContext);
  const initialValues = [
    ...company[0].roles.map((role) => ({
      role: role,
      dayHeadcount: 0,
      nightHeadcount: 0,
      id: headcount.length > 0 && headcount[0].id ? headcount[0].id : 0,
      userId: user?.id,
      date: new Date(),
      companyId:
        user?.securityRole === SecurityRole.ADMIN
          ? selectedCompany.id
          : user?.companyId,
      projectId: project.id,
    })),
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

  const onSubmit = async (data) => {
    console.log("DATA: ", data);
    // const headcounts = data.map((hc) => ({
    //   id: hc.id,
    //   dayCount: hc.dayCount,
    //   nightCount: hc.nightCount,
    // }));
    const result = await saveHeadcount(data.headcount);
    if (result.status === "success") {
      toast.success("Company Deleted.");
    } else {
      toast.error(result.error);
    }
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
            onSubmit(data);
          })}
        >
          <div className="w-full mt-16 h-full flex flex-col justify-center">
            <div className="">
              {fields.map((field, index) => {
                return (
                  <section key={field.id} className="mr-4 sm:mt-4 mt-16">
                    <div className="flex flex-row">
                      <div className="w-3xs flex align-middle">
                        <span>{field.role.name}</span>
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
