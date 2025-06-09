"use client";

import { Button, Input } from "@heroui/react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import React from "react";
import { SafetySchema } from "@/lib/schemas/safetySchema";
//import { authorizeNarrative, submitNarrative } from "../../actions/safetyActions";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { CompanyContext } from "@/components/CompanyContext";
import { NarrativeType } from "@prisma/client";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { IconSquareX } from "@tabler/icons-react";
import {
  saveNarrativeType,
  deleteNarrativeType,
} from "@/app/actions/narrativeTypeActions";

type Role = {
  id: number;
  name: string;
};

type Props = {
  userRoles: Role[];
};

export default function Roles(userRoles: any) {
  const { data } = useSession();
  const user = data?.user;
  const [roles, setRoles] = useState(userRoles);

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
      roles: roles,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "roles",
    control,
  });

  const onSubmit = async (values: { roles: Role[] }) => {
    console.log("IN HERE", values);
    // const result = await Promise.all(
    //   values.roles.map(async (n) => saveNarrativeType(n))
    // );
    // const success = result.filter((r) => r.status === "error").length === 0;

    // if (success) {
    //   toast.success("Narrative saved.");
    // } else {
    //   toast.error("Something went wrong.");
    // }
  };

  // const onDelete = async (index: number) => {
  //   const result = await deleteNarrativeType(types[index]);

  //   if (result.status === "success") {
  //     const newTypes = types.filter((t) => t.type !== types[index].type);
  //     setTypes(newTypes);
  //     remove(index);
  //     toast.success("Narrative saved.");
  //   } else {
  //     toast.error(result.error);
  //   }
  // };

  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Narrative Types</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mt-16 h-full">
            {fields.map((role: any, index: number) => {
              return (
                <div className="mt-2 flex flex-row justify-between">
                  <div className="mr-4">
                    <Input key={role.id} {...register(`roles.${index}.name`)} />
                  </div>
                  <div>
                    <Button
                      color="primary"
                      onPress={async () => {
                        //await onDelete(index);
                      }}
                      endContent={<IconSquareX />}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <Button
              className="mr-4"
              variant="bordered"
              color="primary"
              type="button"
              onClick={() => {
                append({ id: 0, name: "" });
              }}
            >
              Add Another
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
