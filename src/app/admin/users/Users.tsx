"use client";

import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import {
  Accordion,
  AccordionItem,
  useDisclosure,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  User as UserCard,
  Card,
  CardHeader,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useState } from "react";
import React from "react";
import * as z from "zod/v4";
import { SecurityRole, User } from "@prisma/client";
import { CompanyWithUsers } from "@/lib/types";
import { toast } from "react-toastify";
import { emptyUser } from "@/lib/schemas/defaultModels";
import { userSchema } from "@/lib/schemas/userSchema";
import { RegisterSchema } from "@/lib/schemas/registerSchema";
import { saveUser, deleteUser, inviteUser } from "@/app/actions/userActions";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import PageHeading from "@/components/PageHeading";

type UnlinkedClerkUser = {
  clerkId: string;
  name: string;
  email: string;
};

type Props = {
  companies: CompanyWithUsers[];
  unlinkedUsers: UnlinkedClerkUser[];
};

function RoleChip({ role }: { role: SecurityRole }) {
  return (
    <Chip
      size="sm"
      variant={role === SecurityRole.ADMIN ? "solid" : "flat"}
      color={role === SecurityRole.ADMIN ? "primary" : "default"}
    >
      {role}
    </Chip>
  );
}

export default function UsersPage({ companies, unlinkedUsers }: Props) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User>({ ...emptyUser });
  const [errors, setErrors] = useState({
    name: { errors: [] },
    email: { errors: [] },
  });

  // Brand-new user: no Clerk identity yet → we send an invitation rather than
  // creating a record directly.
  const isInvite = selectedUser.id === 0 && !selectedUser.clerkId;

  const openAdd = () => {
    setSelectedUser({ ...emptyUser });
    onOpen();
  };

  const openEdit = (user: User) => {
    setSelectedUser({ ...user });
    onOpen();
  };

  const onSaveUser = async () => {
    setIsSaving(true);
    try {
      const result = isInvite
        ? await inviteUser({
            email: selectedUser.email,
            name: selectedUser.name,
            companyId: selectedUser.companyId,
            securityRole: selectedUser.securityRole,
          })
        : await saveUser(selectedUser as unknown as RegisterSchema);

      if (result.status === "error") {
        toast.error(
          isInvite
            ? "Could not send invitation."
            : "Could not save user. Did you pick a company?"
        );
      } else {
        toast.success(isInvite ? "Invitation sent." : "User saved.");
        router.refresh();
      }
    } finally {
      setIsSaving(false);
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
    } as User);
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
      <div className="flex-1 min-w-0 flex flex-col gap-6 p-6 sm:p-10 overflow-y-auto">
        <PageHeading
          title="Users"
          action={
            <Button color="primary" onPress={openAdd}>
              Invite User
            </Button>
          }
        />

        {/* Clerk sign-ups not yet linked to an app record */}
        {unlinkedUsers.length > 0 && (
          <Card className="border border-warning-200 bg-warning-50">
            <CardHeader className="flex items-center gap-3">
              <span className="text-lg font-semibold text-warning-700">
                Unassigned sign-ups
              </span>
              <Chip size="sm" variant="flat" color="warning">
                {unlinkedUsers.length}
              </Chip>
              <span className="text-sm text-default-500">
                Signed in but not yet set up — assign a company to finish.
              </span>
            </CardHeader>
            <CardBody className="gap-1">
              {unlinkedUsers.map((u) => (
                <div
                  key={u.clerkId}
                  className="flex flex-col gap-2 border-b border-divider py-2 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <UserCard
                    name={u.name || "—"}
                    description={u.email}
                    avatarProps={{ name: u.name || u.email, size: "sm" }}
                  />
                  <Button
                    size="sm"
                    color="primary"
                    onPress={() => onAssignClerkUser(u)}
                  >
                    Assign to company
                  </Button>
                </div>
              ))}
            </CardBody>
          </Card>
        )}

        {/* Users grouped by company */}
        <Accordion
          variant="splitted"
          selectionMode="multiple"
          defaultExpandedKeys="all"
        >
          {companies.map((field) => (
            <AccordionItem
              key={String(field.id)}
              aria-label={field.name}
              title={
                <div className="flex items-center gap-3">
                  <span className="text-xl font-semibold">{field.name}</span>
                  <Chip size="sm" variant="flat" color="primary">
                    {field.users.length}
                  </Chip>
                </div>
              }
            >
              {field.users.length === 0 ? (
                <p className="pb-2 text-default-400">
                  No users in this company yet.
                </p>
              ) : (
                field.users.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-3 border-b border-divider py-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <UserCard
                      name={user.name}
                      description={user.email}
                      avatarProps={{ name: user.name, size: "sm" }}
                      className="justify-start sm:flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <RoleChip role={user.securityRole} />
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        onPress={() => openEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
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
                ))
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isInvite
                  ? "Invite User"
                  : selectedUser.id === 0
                  ? "Assign User"
                  : "Edit User"}
              </ModalHeader>
              <ModalBody className="gap-4">
                <Input
                  label="Name"
                  placeholder="Name"
                  variant="bordered"
                  value={selectedUser.name}
                  isInvalid={errors?.name?.errors.length > 0}
                  errorMessage={errors?.name?.errors[0] ?? ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                />
                <Input
                  label="Email"
                  placeholder="Email"
                  variant="bordered"
                  value={selectedUser.email}
                  isInvalid={errors?.email?.errors.length > 0}
                  errorMessage={errors?.email?.errors[0] ?? ""}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
                <Select
                  label="Role"
                  variant="bordered"
                  selectedKeys={new Set([selectedUser.securityRole])}
                  onSelectionChange={(keys) => {
                    const role = Array.from(keys)[0] as SecurityRole;
                    if (role) setSelectedUser({ ...selectedUser, securityRole: role });
                  }}
                >
                  <SelectItem key={SecurityRole.USER}>User</SelectItem>
                  <SelectItem key={SecurityRole.ADMIN}>Admin</SelectItem>
                </Select>
                <Select
                  label="Company"
                  placeholder="Select company"
                  variant="bordered"
                  aria-label="Select company"
                  selectedKeys={
                    selectedUser.companyId
                      ? new Set([String(selectedUser.companyId)])
                      : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const id = Number(Array.from(keys)[0]);
                    if (id) setSelectedUser({ ...selectedUser, companyId: id });
                  }}
                >
                  {companies.map((company) => (
                    <SelectItem key={String(company.id)}>
                      {company.name}
                    </SelectItem>
                  ))}
                </Select>
                {isInvite && (
                  <p className="text-sm text-default-500">
                    An email invitation will be sent so they can set their own
                    password.
                  </p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isLoading={isSaving}
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
                  {isInvite
                    ? "Send Invitation"
                    : selectedUser.id === 0
                    ? "Assign"
                    : "Save"}
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
  );
}
