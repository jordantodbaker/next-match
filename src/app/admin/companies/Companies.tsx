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
  Select,
  SelectItem,
  Card,
  CardBody,
} from "@heroui/react";
import { useState } from "react";
import React from "react";
import { toast } from "react-toastify";
import { Project } from "@prisma/client";
import { AdminSidebar } from "@/components/sidebar/AdminSidebar";
import PageHeading from "@/components/PageHeading";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
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
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
    const company = { ...selectedCompany };
    const roles = [...selectedRoles];
    const projects = [...selectedProjects];
    const result = await saveCompany(company, roles, projects);
    setIsSaving(false);
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

  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      <div className="w-full flex flex-col gap-6 p-6 sm:p-10 overflow-y-auto">
        <PageHeading
          title="Companies"
          action={
            <Button
              color="primary"
              type="button"
              onPress={() => {
                setSelectedCompany(emptyCompany);
                onOpen();
              }}
            >
              Add Company
            </Button>
          }
        />
        <Card>
          <CardBody>
            <CompanyTable
              companies={companies}
              onClickEditCompany={onClickEditCompany}
              onClickDeleteCompany={onClickDeleteCompany}
            />
          </CardBody>
        </Card>
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
                <ModalBody className="gap-4">
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
                    label="Projects"
                    placeholder="Select Projects"
                    variant="bordered"
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
                  <Button color="default" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    isLoading={isSaving}
                    onPress={async () => {
                      onClose();
                      await onSaveCompany();
                    }}
                  >
                    {selectedCompany.id === 0 ? "Add Company" : "Save"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onOpenChange={onDeleteOpenChange}
          title="Delete Company"
          message={`Are you sure you want to delete ${selectedCompany.name}?`}
          confirmLabel={`Delete ${selectedCompany.name}`}
          onConfirm={onDeleteCompany}
        />
      </div>
    </div>
  );
}
