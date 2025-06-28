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
  CheckboxGroup,
} from "@heroui/react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import React from "react";
//import { authorizeNarrative, submitNarrative } from "../../actions/safetyActions";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { CompanyAccount, Role } from "@prisma/client";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { IconSquareX } from "@tabler/icons-react";
import { deleteCompany, saveCompany } from "@/app/actions/companyActions";
import CompanyTable from "./CompanyTable";
import { emptyCompany } from "@/lib/schemas/defaultModels";
import { CompanyWithRoles } from "@/lib/types";

type Props = {
  companies: CompanyWithRoles[];
  roles: Role[];
};

export default function Companies({
  companies: initialCompanies,
  roles,
}: Props) {
  const { data } = useSession();
  const user = data?.user;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const [companies, setCompanies] = useState(initialCompanies);
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyWithRoles>(emptyCompany);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);

  const handleNameChange = (name: string) => {
    const newCompany = { ...selectedCompany, name: name };
    setSelectedCompany(newCompany);
  };

  const handleCodeChange = (code: string) => {
    const newCompany = { ...selectedCompany, companyCode: code };
    setSelectedCompany(newCompany);
  };

  const onSaveCompany = async () => {
    const company = { ...selectedCompany };
    const roles = [...selectedRoles];
    const result = await saveCompany(company, roles);
    const newCompanies =
      company.id === 0
        ? [...companies, company]
        : companies.map((c) => {
            if (c.id === company.id || c.id === 0) {
              return company;
            }
            return c;
          });

    setCompanies(newCompanies);

    if (result.status === "success") {
      toast.success("Company Saved.");
    } else {
      toast.error(result.error);
    }
  };

  const onDeleteCompany = async () => {
    const company = { ...selectedCompany };
    const result = await deleteCompany(company);

    if (result.status === "success") {
      const newCompanies = companies.filter(
        (t) => t.name !== selectedCompany.name
      );
      setCompanies(newCompanies);
      toast.success("Company Deleted.");
    } else {
      toast.error(result.error);
    }
  };

  const onClickEditCompany = async (company: CompanyWithRoles) => {
    setSelectedCompany(company);
    setSelectedRoles(company.roles);
    onOpen();
  };

  const onClickDeleteCompany = (company: CompanyWithRoles) => {
    setSelectedCompany(company);
    onDeleteOpen();
  };

  const onToggleRole = (role: Role) => {
    const roles = [...selectedRoles];
    if (roles.includes(role)) {
      setSelectedRoles(roles.filter((r) => r.id !== role.id));
    } else {
      setSelectedRoles([...roles, role]);
    }
    console.log("Roles: ", selectedRoles);
  };

  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      <div className="w-full flex flex-col m-16">
        <div>
          <h1 className="text-3xl text-center">Companies</h1>
        </div>
        <CompanyTable
          companies={companies}
          onClickEditCompany={onClickEditCompany}
          onClickDeleteCompany={onClickDeleteCompany}
        />

        <div className="mt-4">
          <Button
            className="mr-4"
            color="primary"
            type="button"
            onPress={() => {
              setSelectedCompany(emptyCompany);
              onOpen();
            }}
          >
            Add Company
          </Button>
          {/* <Button color="primary" type="submit" isLoading={isSubmitting}>
              Submit
            </Button> */}
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
                  {selectedCompany.id === 0 ? "Add Company" : "Edit Company"}
                </ModalHeader>
                <ModalBody>
                  <Input
                    label="Company Name"
                    placeholder="Company Name"
                    variant="bordered"
                    value={selectedCompany.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                  <Input
                    label="Company Code"
                    placeholder="Company Code"
                    variant="bordered"
                    value={selectedCompany.companyCode}
                    onChange={(e) => handleCodeChange(e.target.value)}
                  />
                  <div className="flex py-2 px-1 justify-between">
                    <CheckboxGroup
                      defaultValue={selectedCompany.roles.map((r) => r.code)}
                      label="Select roles"
                    >
                      {roles.map((role) => {
                        return (
                          <Checkbox
                            value={role.code}
                            onValueChange={() => onToggleRole(role)}
                            defaultChecked={selectedCompany.roles.some(
                              (r) => r.id === role.id
                            )}
                          >
                            {role.name}
                          </Checkbox>
                        );
                      })}
                    </CheckboxGroup>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={async () => {
                      onClose();
                      await onSaveCompany();
                    }}
                  >
                    {selectedCompany.id === 0 ? "Add Company" : "Edit Company"}
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
                  {selectedCompany.id === 0 ? "Add Company" : "Edit Company"}
                </ModalHeader>
                <ModalBody>
                  <div>
                    Are you just you want to delete {selectedCompany.name}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onDeleteClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={async () => {
                      onDeleteClose();
                      await onDeleteCompany();
                    }}
                  >
                    Delete {selectedCompany.name}
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
