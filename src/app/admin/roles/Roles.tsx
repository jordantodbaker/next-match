"use client";

import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useState } from "react";
import React from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { RoleCategory } from "@prisma/client";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { deleteRole, saveRole } from "@/app/actions/rolesActions";
import RoleTable from "./RoleTable";
import { emptyRole, emptyRoleCategory } from "@/lib/schemas/defaultModels";
import { Role } from "@/lib/types";

type Props = {
  roles: Role[];
  categories: RoleCategory[];
};

export default function Roles({ roles: initialRoles, categories }: Props) {
  const { data } = useSession();
  const user = data?.user;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const [roles, setRoles] = useState(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role>(emptyRole);

  const handleNameChange = (name: string) => {
    const newRole = { ...selectedRole, name: name };
    setSelectedRole(newRole);
  };

  const handleCodeChange = (code: string) => {
    const newRole = { ...selectedRole, code: code };
    setSelectedRole(newRole);
  };

  const handleDescriptionChange = (description: string) => {
    const newRole = { ...selectedRole, description: description };
    setSelectedRole(newRole);
  };

  const handleCategoryChange = (category: any) => {
    setSelectedRole({
      ...selectedRole,
      categoryId: parseInt(category),
      category: categories.find((c) => c.id == category) || emptyRoleCategory,
    });
  };

  const onSaveRole = async () => {
    const role = { ...selectedRole };
    console.log("Role: ", role);
    const result = await saveRole(role);
    const newRoles =
      role.id === 0
        ? [...roles, role]
        : roles.map((c) => {
            if (c.id === role.id || c.id === 0) {
              return role;
            }
            return c;
          });

    setRoles(newRoles);

    if (result.status === "success") {
      toast.success("Role Saved.");
    } else {
      toast.error(result.error);
    }
  };

  const onDeleteRole = async () => {
    const role = { ...selectedRole };
    const result = await deleteRole(role);

    if (result.status === "success") {
      const newRoles = roles.filter((t) => t.name !== selectedRole.name);
      setRoles(newRoles);
      toast.success("Role Deleted.");
    } else {
      toast.error(result.error);
    }
  };

  const onClickEditRole = async (role: Role) => {
    setSelectedRole(role);
    onOpen();
  };

  const onClickDeleteRole = (role: Role) => {
    setSelectedRole(role);
    onDeleteOpen();
  };

  // const onToggleIsDirect = (e: any) => {
  //   setSelectedRole({
  //     ...selectedRole,
  //     isDirect: !selectedRole.isDirect,
  //   });
  // };

  console.log("selected role: ", selectedRole);

  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Roles</h1>
        </div>
        <RoleTable
          roles={roles}
          categories={categories}
          onClickEditRole={onClickEditRole}
          onClickDeleteRole={onClickDeleteRole}
        />

        <div className="mt-4">
          <Button
            className="mr-4"
            color="primary"
            type="button"
            onPress={() => {
              setSelectedRole(emptyRole);
              onOpen();
            }}
          >
            Add Role
          </Button>
        </div>
        <Modal
          isOpen={isOpen}
          placement="top-center"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedRole.id === 0 ? "Add Role" : "Edit Role"}
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Name"
                    placeholder="Role Name"
                    variant="bordered"
                    value={selectedRole.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                  <Input
                    label="Code"
                    placeholder="Role Code"
                    variant="bordered"
                    value={selectedRole.code || ""}
                    onChange={(e) => handleCodeChange(e.target.value)}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Description"
                    variant="bordered"
                    value={selectedRole.description || ""}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                  />
                  <Select
                    className="max-w-xs"
                    label="Category"
                    placeholder="Select Category"
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    //defaultSelectedKeys={[selectedRole.categoryId]}
                    selectedKeys={[`${selectedRole.categoryId}`]}
                  >
                    {categories.map((category) => (
                      <SelectItem key={category.id}>{category.name}</SelectItem>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={async () => {
                      onClose();
                      await onSaveRole();
                    }}
                  >
                    {selectedRole.id === 0 ? "Add Role" : "Edit Role"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Modal
          isOpen={isDeleteOpen}
          placement="top-center"
          onOpenChange={onDeleteOpenChange}
        >
          <ModalContent>
            {(onDeleteClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedRole.id === 0 ? "Add Role" : "Edit Role"}
                </ModalHeader>
                <ModalBody>
                  <div>Are you just you want to delete {selectedRole.name}</div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onDeleteClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={async () => {
                      onDeleteClose();
                      await onDeleteRole();
                    }}
                  >
                    Delete {selectedRole.name}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
