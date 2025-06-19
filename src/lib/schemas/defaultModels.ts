import { CompanyAccount, Project, Role } from "@prisma/client";

export const emptyCompany = {
    id: 0,
    name: "",
    companyCode: ""
} as CompanyAccount;

export const emptyProject = {id: 0, name: "", code: ""} as Project

  export const emptyRole = {
    id: 0,
    code: "",
    name: "",
    projectId: 0,
  } as Role;
