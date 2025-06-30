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
import { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

type FormValues = {
  headcount: {
    role: Role;
    dayCount: number;
    nightCount: number;
    id: number;
    userId: number | undefined;
    companyId: number;
    projectId: number;
    date: Date;
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
  console.log("HEAD COUNT: ", headcount);
  const initialValues =
    headcount.length > 0 &&
    headcount[0].filter((hc: any) => hc.projectId === project.id).length > 0
      ? headcount[0]
      : [
          ...company[0].roles.map((role) => ({
            role: role,
            dayCount: 0,
            nightCount: 0,
            id: headcount.length > 0 && headcount[0].id ? headcount[0].id : 0,
            userId: typeof user?.id !== "undefined" ? user.id : 0,
            date: new Date(),
            companyId:
              user?.securityRole === SecurityRole.ADMIN
                ? selectedCompany.id
                : user?.companyId,
            projectId: project.id,
          })),
        ];

  useEffect(() => {
    const newHeadcount =
      headcount.length > 0 &&
      headcount[0].filter((hc: any) => hc.projectId === project.id).length > 0
        ? headcount[0].filter((hc: any) => hc.projectId === project.id)
        : [
            ...company[0].roles.map((role) => ({
              role: role,
              dayCount: 0,
              nightCount: 0,
              id: headcount.length > 0 && headcount[0].id ? headcount[0].id : 0,
              userId: typeof user?.id !== "undefined" ? user.id : 0,
              date: new Date(),
              companyId:
                user?.securityRole === SecurityRole.ADMIN
                  ? selectedCompany.id
                  : user?.companyId,
              projectId: project.id,
            })),
          ];
    console.log("NEW COUNT REPLACING: ", newHeadcount);
    replace(newHeadcount);
  }, [project]);
  const filtered = headcount[0].filter(
    (hc: any) => hc.projectId === project.id
  );
  console.log("Headcount: ", filtered);
  console.log("Project ID: ", project.id);

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

  const { fields, append, remove, update, replace } = useFieldArray({
    name: "headcount",
    control,
  });

  const onSubmit = async (data: FormValues) => {
    if (user?.id) {
      const headcounts = data.headcount.map((hc) => {
        return {
          id: hc.id,
          dayCount: hc.dayCount,
          nightCount: hc.nightCount,
          roleId: hc.role.id,
          companyId:
            user.securityRole === SecurityRole.ADMIN
              ? selectedCompany.id
              : user.companyId,
          userId: user.id,
          date: hc.date,
          projectId: hc.projectId,
        };
      });
      const result = await saveHeadcount(headcounts);

      if (result.status === "success") {
        toast.success("Headcount saved.");
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Daily Headcount</h1>
          <h2 className="text-2xl text-center mt-4">
            {new Date().toLocaleDateString()}
          </h2>
          <p className="mt-4 text-center">
            Please submit the headcount for today's day and night shifts for
            each role.
          </p>
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit(data as any);
          })}
        >
          <div className="w-full mt-16 h-full flex flex-col justify-center">
            <div className="">
              {fields.map((field: any, index) => {
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
                        {...register(`headcount.${index}.dayCount`, {
                          valueAsNumber: true,
                        })}
                      />
                      <Input
                        fullWidth={false}
                        size="sm"
                        label="Night"
                        type="number"
                        {...register(`headcount.${index}.nightCount`, {
                          valueAsNumber: true,
                        })}
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
