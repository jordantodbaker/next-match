import { CompanyAccount, Project, Role } from "@prisma/client";

type CompanyWithRoles = CompanyAccount & { roles: Role[] };

export const emptyCompany = {
  id: 0,
  name: "",
  companyCode: "",
  roles: [],
} as CompanyWithRoles;

export const emptyProject = { id: 0, name: "", code: "" } as Project;

export const emptyRole = {
  id: 0,
  code: "",
  name: "",
} as Role;
