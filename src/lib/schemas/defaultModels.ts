import {
  CompanyAccount,
  Project,
  RoleCategory,
  SecurityRole,
  User,
} from "@prisma/client";
import { Role, Company } from "../types";



export const emptyProject = { id: 0, name: "", code: "" } as Project;

export const emptyUser = {
  id: 0,
  name: "",
  email: "",
  password: "",
  securityRole: SecurityRole.USER,
  companyId: 0,
  hasTakenWFPTour: false,
} as User & { password: string };

export const emptyRoleCategory = {
  id: 0,
  name: "",
  description: "",
  isDirect: true,
} as RoleCategory;

export const emptyRole = {
  id: 0,
  code: "",
  name: "",
  description: "",
  categoryId: 0,
  category: emptyRoleCategory,
} as Role;

export const emptyCompany = {
  id: 0,
  name: "",
  companyCode: "",
  powerBiUrl: null,
  roles: [emptyRole],
  projects: [],
  workforcePlans: [],
  headcounts: []
} as Company;