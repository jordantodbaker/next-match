import {
  CompanyAccount,
  Project,
  Role,
  SecurityRole,
  User,
} from "@prisma/client";

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

export const emptyUser = {
  id: 0,
  name: "",
  email: "",
  passwordHash: "",
  securityRole: SecurityRole.USER,
  companyId: 0,
} as User;
