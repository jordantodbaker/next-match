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
  Tooltip,
} from "@heroui/react";
import { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { saveAs } from "file-saver";

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
  company: CompanyWithRoles;
  headcount: any;
  baseUrl: string;
};

import { useSession } from "next-auth/react";
import { CompanyAccount, Headcount, Role, SecurityRole } from "@prisma/client";
import { CompanyWithRoles } from "@/lib/types";
import { saveHeadcount } from "../actions/headcountActions";
import { ProjectContext } from "@/components/ProjectContext";
import { CompanyContext } from "@/components/CompanyContext";
import { narrativeSchema } from "../../lib/schemas/narrativeSchema";
import { toast } from "react-toastify";
import { IconInfoCircle } from "@tabler/icons-react";

export default function HeadcountPage({
  company,
  headcount: initialHeadcount,
  baseUrl: baseUrl,
}: Props) {
  const { data } = useSession();
  const user = data?.user;
  const project = useContext(ProjectContext);
  const selectedCompany = useContext(CompanyContext);
  const [headcount, setHeadcount] = useState(initialHeadcount);
  const initialValues =
    headcount.length > 0 &&
    headcount.filter((hc: any) => hc.projectId === project.id).length > 0
      ? headcount
      : [
          ...company.roles.map((role) => ({
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
      headcount.filter((hc: any) => hc.projectId === project.id).length > 0
        ? headcount.filter((hc: any) => hc.projectId === project.id)
        : [
            ...company.roles.map((role) => ({
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
    replace(newHeadcount);
  }, [project]);

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

  const onClickGetCSV = async () => {
    const data = new FormData();
    const fileName = `headcount_${company.id}_${project.id}.xlsx`;
    data.set("project", JSON.stringify(project));
    data.set("company", JSON.stringify(company));
    data.set("fileName", fileName);

    const uploadRequest = await fetch("/api/headcount", {
      method: "POST",
      body: data,
    });

    saveAs(`${baseUrl}/files/${fileName}`, "headcount.xlsx");

    const deleteResult = await fetch("/api/headcount", {
      method: "DELETE",
      body: data,
    });
  };

  const onSubmit = async (data: FormValues) => {
    if (data.headcount[0].id === 0) {
      const newHeadcounts = [...headcount, ...data.headcount];
      setHeadcount(newHeadcounts);
    }
    if (user?.id) {
      const headcounts = data.headcount.map((hc: any) => {
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

  let lastCategoryId = 0;

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
                let showCategoryTitle = false;
                if (lastCategoryId !== field.role.categoryId) {
                  showCategoryTitle = true;
                  lastCategoryId = field.role.categoryId;
                }
                return (
                  <section key={field.id} className="mr-4 sm:mt-4 mt-16">
                    {showCategoryTitle && (
                      <div className="flex flex-row mb-4 items-end border-b-1 pb-2">
                        <h1 className="text-2xl">
                          {field.role.category.name}{" "}
                        </h1>
                        <div className="ml-2">
                          {field.role.category.description && (
                            <Tooltip content={field.role.category.description}>
                              <IconInfoCircle />
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-row">
                      <div className="w-3xs flex align-middle">
                        <div>
                          <span>{field.role.name} </span>
                        </div>
                        <div className="ml-2">
                          {field.role.description && (
                            <Tooltip content={field.role.description}>
                              <IconInfoCircle />
                            </Tooltip>
                          )}
                        </div>
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
          <div className="mt-2 flex justify-between">
            <Button
              color="primary"
              type="submit"
              isDisabled={!isValid}
              isLoading={isSubmitting}
            >
              Submit
            </Button>
            <Button
              variant="bordered"
              color="primary"
              onPress={onClickGetCSV}
              //isDisabled={!isValid}
            >
              Download CSV
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
