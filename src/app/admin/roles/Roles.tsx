"use client";

import { Button, Input } from "@heroui/react";
import { useState, useContext, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import React from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { IconSquareX } from "@tabler/icons-react";
import { ProjectContext } from "@/components/ProjectContext";
import { Role } from "@prisma/client";
import { deleteRole, saveRoles } from "@/app/actions/rolesActions";
import { emptyRole } from "@/lib/schemas/defaultModels";

type Props = {
  userRoles: Role[];
};

export default function Roles({ userRoles }: Props) {
  const { data } = useSession();
  const user = data?.user;
  const project = useContext(ProjectContext);

  const initialRoles =
    userRoles.length > 0
      ? userRoles
      : [{ ...emptyRole, projectId: project.id }];

  const [roles, setRoles] = useState(
    initialRoles.filter((r) => r.projectId === project.id)
  );

  useEffect(() => {
    const newRoles = [...initialRoles].filter(
      (r) => r.projectId === project.id
    );
    setRoles(newRoles);
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
      roles: roles,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    name: "roles",
    control,
  });

  const onSubmit = async (values: { roles: Role[] }) => {
    const result = await saveRoles(values.roles);
    if (result.status === "success") {
      toast.success("Roles saved.");
    } else {
      toast.error("Something went wrong.");
    }
  };

  const onDelete = async (index: number) => {
    console.log("Role to delete: ", roles[index]);
    const result = await deleteRole(roles[index]);

    if (result.status === "success") {
      const newRoles = roles.filter((t) => t.name !== roles[index].name);
      setRoles(newRoles);
      remove(index);
      toast.success("Role deleted.");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Narrative Types</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full mt-16 h-full">
            {fields.map((role: Role, index: number) => {
              return (
                <div className="mt-2 flex flex-row justify-between">
                  <div className="flex flex-row">
                    <div className="mr-4">
                      <Input
                        label="name"
                        key={role.id}
                        {...register(`roles.${index}.name`)}
                      />
                    </div>
                    <div className="mr-4">
                      <Input
                        label="code"
                        key={role.id}
                        {...register(`roles.${index}.code`)}
                      />
                    </div>
                  </div>
                  <div>
                    <Button
                      color="primary"
                      onPress={async () => onDelete(index)}
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
              onPress={() => {
                append(emptyRole);
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
