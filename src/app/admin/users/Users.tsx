"use client";

import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Accordion,
  AccordionItem,
  useDisclosure,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useState } from "react";
import React from "react";
import * as z from "zod/v4";

type UnlinkedClerkUser = {
  clerkId: string;
  name: string;
  email: string;
};

type Props = {
  companies: CompanyWithUsers[];
  unlinkedUsers: UnlinkedClerkUser[];
};

type Errors = {
  name?: string;
  password?: string;
  email?: string;
};

import { User } from "@prisma/client";
import { CompanyWithUsers } from "@/lib/types";
import { toast } from "react-toastify";
import { emptyUser } from "@/lib/schemas/defaultModels";
import { userSchema } from "@/lib/schemas/userSchema";
import { RegisterSchema } from "@/lib/schemas/registerSchema";
import { saveUser, deleteUser } from "@/app/actions/userActions";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

export default function UsersPage({ companies, unlinkedUsers }: Props) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [selectedUser, setSelectedUser] = useState({
    ...emptyUser,
    updatePassword: false,
  });
  const [errors, setErrors] = useState({
    name: { errors: [] },
    password: { errors: [] },
    email: { errors: [] },
  });

  const onSaveUser = async () => {
    const result = await saveUser(selectedUser as unknown as RegisterSchema);

    if (result.status === "error") {
      toast.error("Could not save user. Did you pick a company?");
    } else {
      toast.success("User saved.");
      router.refresh();
    }
  };

  const onAssignClerkUser = (u: UnlinkedClerkUser) => {
    setSelectedUser({
      ...emptyUser,
      id: 0,
      name: u.name || u.email,
      email: u.email,
      clerkId: u.clerkId,
      companyId: 0,
      updatePassword: false,
    } as any);
    onOpen();
  };

  const onDeleteUser = async () => {
    if (!userToDelete) return;
    const result = await deleteUser(userToDelete.id);
    if (result.status === "success") {
      toast.success("User deleted.");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Users</h1>
        </div>
        <form>
          <div className="w-full mt-16 h-full flex flex-col justify-center">
            <div className="">
              {unlinkedUsers.length > 0 && (
                <Accordion
                  isCompact
                  defaultExpandedKeys="all"
                  className="mr-4 sm:mt-4 mt-16"
                >
                  <AccordionItem
                    key="unassigned"
                    title={
                      <div className="text-2xl text-warning-600">
                        Unassigned (no company)
                      </div>
                    }
                  >
                    {unlinkedUsers.map((u) => (
                      <div
                        key={u.clerkId}
                        className="flex flex-row justify-between items-center"
                      >
                        <div>{u.name || "—"}</div>
                        <div>{u.email}</div>
                        <div>
                          <Button
                            color="primary"
                            onPress={() => onAssignClerkUser(u)}
                          >
                            Assign to company
                          </Button>
                        </div>
                      </div>
                    ))}
                  </AccordionItem>
                </Accordion>
              )}
              {companies.map((field, index) => {
                return (
                  <Accordion
                    isCompact
                    key={field.id}
                    defaultExpandedKeys="all"
                    className="mr-4 sm:mt-4 mt-16"
                  >
                    <AccordionItem
                      key={index}
                      title={<div className="text-2xl">{field.name}</div>}
                    >
                      {field.users.map((user) => {
                        return (
                          <div className="flex flex-row justify-between">
                            <div>{user.name}</div>
                            <div>{user.email}</div>
                            <div>{user.securityRole}</div>
                            <div>
                              <Button
                                className="mr-4"
                                color="primary"
                                onPress={() => {
                                  onOpen();
                                  setSelectedUser(user as any);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                color="danger"
                                onPress={() => {
                                  setUserToDelete(user);
                                  onDeleteOpen();
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </div>
          </div>
          <div className="mt-2">
            <Button
              color="primary"
              onPress={() => {
                setSelectedUser({ ...emptyUser, updatePassword: true });
                onOpen();
              }}
            >
              Add User
            </Button>
          </div>
        </form>
        <Modal
          isOpen={isOpen}
          placement="top-center"
          onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {selectedUser.id === 0 ? "Add User" : "Edit User"}
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Name"
                    placeholder="Name"
                    variant="bordered"
                    value={selectedUser.name}
                    isInvalid={
                      errors && errors.name && errors.name.errors.length > 0
                    }
                    errorMessage={
                      errors && errors.name ? errors.name.errors[0] : ""
                    }
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        name: e.target.value,
                      })
                    }
                  />
                  <Input
                    label="Email"
                    placeholder="Email"
                    variant="bordered"
                    value={selectedUser.email}
                    isInvalid={
                      errors && errors.email && errors.email.errors.length > 0
                    }
                    errorMessage={
                      errors && errors.email ? errors.email.errors[0] : ""
                    }
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                  />

                  {(showChangePassword || selectedUser.id === 0) && (
                    <Input
                      label="Password"
                      placeholder="Password"
                      variant="bordered"
                      value={selectedUser.password}
                      type="password"
                      isInvalid={
                        errors &&
                        errors.password &&
                        errors.password.errors.length > 0
                      }
                      errorMessage={
                        errors && errors.password
                          ? errors.password.errors[0]
                          : ""
                      }
                      onChange={(e) =>
                        setSelectedUser({
                          ...selectedUser,
                          password: e.target.value,
                        })
                      }
                    />
                  )}

                  {selectedUser.id !== 0 && (
                    <Button
                      color="primary"
                      onPress={() => {
                        setShowChangePassword(true);
                        setSelectedUser({
                          ...selectedUser,
                          password: "",
                          updatePassword: true,
                        });
                      }}
                    >
                      Change Password
                    </Button>
                  )}

                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        color="primary"
                        className="w-xs"
                      >
                        {selectedUser.companyId
                          ? companies.find(
                              (c) => c.id == selectedUser.companyId
                            )!.name
                          : "Select Company"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      color="primary"
                      variant="faded"
                      aria-label="Static Actions"
                      onAction={(key) => {
                        const company = companies.find((c) => c.id == key);
                        if (company) {
                          setSelectedUser({
                            ...selectedUser,
                            companyId: company.id,
                          });
                        }
                      }}
                      selectionMode="single"
                    >
                      {companies.map((company) => (
                        <DropdownItem key={company.id}>
                          {company.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={async () => {
                      const result = userSchema.safeParse(selectedUser);
                      if (result.error) {
                        const tree: any = z.treeifyError(result.error as any);
                        setErrors(tree.properties);
                      } else {
                        await onSaveUser();
                        onClose();
                      }
                    }}
                  >
                    {selectedUser.id === 0 ? "Add User" : "Edit User"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete?.name} (${userToDelete?.email})? This also removes their login.`}
          confirmLabel={`Delete ${userToDelete?.name ?? ""}`.trim()}
          onConfirm={onDeleteUser}
        />
      </div>
    </div>
  );
}
