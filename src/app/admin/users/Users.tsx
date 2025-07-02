"use client";

import { Sidebar } from "@/components/sidebar/Sidebar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  NumberInput,
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
import { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import * as z from "zod/v4";

type Props = {
  companies: CompanyWithUsers[];
};

type Errors = {
  name?: string;
  password?: string;
  email?: string;
};

import { useSession } from "next-auth/react";
import {
  CompanyAccount,
  Headcount,
  Role,
  SecurityRole,
  User,
} from "@prisma/client";
import { CompanyWithUsers } from "@/lib/types";
import { ProjectContext } from "@/components/ProjectContext";
import { CompanyContext } from "@/components/CompanyContext";
import { toast } from "react-toastify";
import { emptyUser } from "@/lib/schemas/defaultModels";
import { userSchema } from "@/lib/schemas/userSchema";
import { saveUser } from "@/app/actions/userActions";

export default function UsersPage({ companies }: Props) {
  const { data } = useSession();
  const user = data?.user;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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

  useEffect(() => {}, []);

  const onSaveUser = async () => {
    const data = new FormData();
    data.set("user", JSON.stringify(selectedUser));

    const result = await fetch("/api/users", {
      method: "POST",
      body: data,
    });

    console.log("RESULT: ", result);
  };

  console.log("Errors", errors);

  return (
    <div className="flex h-full w-full">
      <Sidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Users</h1>
        </div>
        <form>
          <div className="w-full mt-16 h-full flex flex-col justify-center">
            <div className="">
              {companies.map((field, index) => {
                return (
                  <Accordion
                    isCompact
                    key={field.id}
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
                              <Button color="primary">Delete</Button>
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
                      value={selectedUser.passwordHash}
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
                          passwordHash: e.target.value,
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
                          passwordHash: "",
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
      </div>
    </div>
  );
}
