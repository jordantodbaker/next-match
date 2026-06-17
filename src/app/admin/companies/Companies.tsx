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
  Select,
  SelectItem,
  select,
} from "@heroui/react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import React from "react";
//import { authorizeNarrative, submitNarrative } from "../../actions/safetyActions";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { toast } from "react-toastify";
import { CompanyAccount, Project, Role as PrismaRole } from "@prisma/client";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import { deleteCompany, saveCompany } from "@/app/actions/companyActions";
import CompanyTable from "./CompanyTable";
import { emptyCompany } from "@/lib/schemas/defaultModels";
import { Company, Role } from "@/lib/types";

type Props = {
  companies: Company[];
  roles: Role[];
  projects: Project[];
};

export default function Companies({
  companies: initialCompanies,
  roles,
  projects,
}: Props) {
  const data = { user: useCurrentUser() };
  const user = data?.user;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  const [companies, setCompanies] = useState(initialCompanies);
  const [selectedCompany, setSelectedCompany] = useState<Company>(emptyCompany);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);

  const handleNameChange = (name: string) => {
    const newCompany = { ...selectedCompany, name: name };
    setSelectedCompany(newCompany);
  };

  const handleCodeChange = (code: string) => {
    const newCompany = { ...selectedCompany, companyCode: code };
    setSelectedCompany(newCompany);
  };

  const handlePowerBiUrlChange = (powerBiUrl: string) => {
    const newCompany = { ...selectedCompany, powerBiUrl };
    setSelectedCompany(newCompany);
  };

  const handleProjectChange = (projectIds: string) => {
    const parsedIds = projectIds.split(",").map((p) => parseInt(p));
    const newProjects = projects.filter((p) => parsedIds.includes(p.id));
    setSelectedProjects(newProjects);
  };

  const onSaveCompany = async () => {
    const company = { ...selectedCompany };
    const roles = [...selectedRoles];
    const projects = [...selectedProjects];
    const result = await saveCompany(company, roles, projects);
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

  const onClickEditCompany = async (company: Company) => {
    setSelectedCompany(company);
    setSelectedRoles(company.roles);
    onOpen();
  };

  const onClickDeleteCompany = (company: Company) => {
    setSelectedCompany(company);
    onDeleteOpen();
  };

  const onToggleRole = (e: any) => {
    const rolesSelected = [...selectedRoles];
    const selectedRole = roles.find((r) => r.code === e.target.value);
    if (selectedRole) {
      let newRoles = [...selectedRoles];
      if (
        selectedRole &&
        rolesSelected.filter((r) => r.id === selectedRole.id).length > 0
      ) {
        newRoles = rolesSelected.filter((r) => r.id !== selectedRole.id);
      } else {
        newRoles = [...rolesSelected, selectedRole];
      }

      let newCompany = { ...selectedCompany, roles: newRoles };

      const newCompanies = companies.map((c) => {
        if (c.id === newCompany.id) {
          return newCompany;
        }
        return c;
      });

      setSelectedRoles(newRoles);
      setSelectedCompany(newCompany);
      setCompanies(newCompanies);
    }
  };

  let lastId = 0;

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
                  <Input
                    label="Power BI Report URL"
                    placeholder="https://app.powerbi.com/view?r=..."
                    variant="bordered"
                    value={selectedCompany.powerBiUrl ?? ""}
                    onChange={(e) => handlePowerBiUrlChange(e.target.value)}
                  />
                  {selectedCompany.powerBiUrl && (
                    <a
                      href={selectedCompany.powerBiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary underline self-start"
                    >
                      View this company&apos;s Power BI report ↗
                    </a>
                  )}
                  <Select
                    className="max-w-xs"
                    label="Projects"
                    placeholder="Select Projects"
                    selectionMode="multiple"
                    onChange={(e) => handleProjectChange(e.target.value)}
                    defaultSelectedKeys={selectedCompany.projects.map(
                      (p: Project) => `${p.id}`
                    )}
                  >
                    {projects.map((project) => (
                      <SelectItem key={project.id}>{project.name}</SelectItem>
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
